import { makeManufacturer, makeProduct } from './adapterInterface.js';
import { extractFromRendered } from '../../puppeteerClient.js';

function normalizeUrl(base, href) {
  try {
    return new URL(href, base).toString();
  } catch (err) {
    return null;
  }
}

function findFirstMatch(regex, text) {
  const m = text.match(regex);
  return m ? m[1] : null;
}

async function fetchText(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ZOE-GenericAdapter/1.0' } });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  }
}

function extractPrice(text) {
  if (!text) return null;
  // common euro patterns like € 1.234,56 or 1.234,56 € or EUR 1234
  const euro = text.match(/€\s?([0-9\.,]{1,20})/);
  if (euro) return `€ ${euro[1]}`;
  const eur2 = text.match(/([0-9\.,]{1,20})\s?EUR/);
  if (eur2) return `€ ${eur2[1]}`;
  const usd = text.match(/\$\s?([0-9\.,]{1,20})/);
  if (usd) return `$ ${usd[1]}`;
  return null;
}

export async function fetchGeneric(manufacturer) {
  const website = manufacturer?.website || null;
  const name = manufacturer?.name || manufacturer?.slug || 'Hersteller';
  const candidates = [];

  if (website) {
    try {
      const base = new URL(website).origin;
      candidates.push(base);
      // common product listing paths to probe
      candidates.push(base + '/products');
      candidates.push(base + '/en/products');
      candidates.push(base + '/products/solar-panels');
      candidates.push(base + '/products/inverters');
      candidates.push(base + '/products/solar-inverters');
      candidates.push(base + '/products/batteries');
      candidates.push(base + '/products?category=solar');
      candidates.push(base + '/de/produkte');
      candidates.push(base + '/en/products');
    } catch (err) {
      // ignore malformed website
    }
  }

  let discovered = [];

  // first, try the homepage to get og: tags
  if (website) {
    const homeText = await fetchText(website);
    if (homeText) {
      const ogImage = findFirstMatch(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, homeText);
      const ogTitle = findFirstMatch(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i, homeText) || findFirstMatch(/<title>([^<]+)<\/title>/i, homeText);
      if (ogTitle || ogImage) {
        const p = makeProduct({ name: ogTitle ? `${ogTitle} (Beispiel)` : `${name} Beispielprodukt`, imageUrl: ogImage || null, description: ogTitle ? `Automatisch erfasst: ${ogTitle}` : 'Automatisch generiertes Beispielprodukt (placeholder).' });
        discovered.push(p);
      }
    }
  }

  // probe candidate listing pages for simple product-like pages
  for (const c of candidates) {
    if (!c) continue;
    try {
      const text = await fetchText(c);
      if (!text) continue;

      // find headings that could be product names
      const headings = Array.from(text.matchAll(/<(h[1-3])[^>]*>([^<]{3,200})<\/(h[1-3])>/ig)).map(m => m[2].trim());
      // find img srcs that look like product images
      const imgs = Array.from(text.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/ig)).map(m => m[1]);

      // pair headings and imgs heuristically
      for (let i = 0; i < Math.min(3, Math.max(headings.length, imgs.length)); i++) {
        const title = headings[i] || headings[0] || `${name} Produkt ${i + 1}`;
        const imgRaw = imgs[i] || imgs[0] || null;
        const imageUrl = imgRaw ? normalizeUrl(c, imgRaw) : null;
        const price = extractPrice(text);
        const desc = findFirstMatch(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i, text) || null;
        const p = makeProduct({ name: title + (price ? ` — ${price}` : ''), imageUrl, description: desc || `Automatisch erfasst von ${c}`, basePrice: price ? price : null, configurable: false, specs: {}, keyFeatures: [] });
        // avoid duplicates by name
        if (!discovered.some(d => d.name === p.name)) discovered.push(p);
        if (discovered.length >= 3) break;
      }

      if (discovered.length >= 3) break;
    } catch (err) {
      // continue
    }
  }

      // try sitemap.xml for richer product pages and JSON-LD parsing
      if (website) {
        try {
          const base = new URL(website).origin;
          const sitemapUrl = new URL('/sitemap.xml', base).href;
          const s = await fetchText(sitemapUrl);
          if (s) {
            const locs = Array.from(s.matchAll(/<loc>([^<]+)<\/loc>/ig)).map(m => m[1]);
            for (const loc of locs.slice(0, 40)) {
              const txt = await fetchText(loc);
              if (!txt) continue;
              // JSON-LD product
              const jsonld = Array.from(txt.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/ig)).map(m=>m[1]);
              for (const j of jsonld) {
                try {
                  const parsed = JSON.parse(j);
                  const arr = Array.isArray(parsed) ? parsed : [parsed];
                  for (const node of arr) {
                    if (node['@type'] && (String(node['@type']).toLowerCase().includes('product') || node['@type'] === 'Product')) {
                      const title = node.name || node.headline || null;
                      const img = Array.isArray(node.image) ? node.image[0] : node.image || null;
                      const price = node.offers && node.offers.price ? `${node.offers.priceCurrency || ''} ${node.offers.price}` : null;
                      const p = makeProduct({ name: title || `${name} Produkt`, imageUrl: img ? normalizeUrl(loc, img) : null, description: node.description || `Produkt von ${name}`, basePrice: price, configurable: false, specs: node, keyFeatures: [] });
                      if (!discovered.some(d => d.name === p.name)) discovered.push(p);
                    }
                  }
                } catch (err) {
                  // ignore JSON parse
                }
              }
              if (discovered.length >= 6) break;
            }
          }
        } catch (err) {
          // ignore
        }
      }

      // Puppeteer-rendered fallback for JS-heavy pages to gather datasheets and JSON-LD
      if (website && discovered.length < 4) {
        try {
          const base = website;
          const rendered = await extractFromRendered(base);
          if (rendered) {
            // pull JSON-LD product nodes
            for (const node of rendered.jsonLd || []) {
              if (node && node['@type'] && (String(node['@type']).toLowerCase().includes('product') || node['@type'] === 'Product')) {
                const title = node.name || node.headline || rendered.title || `${name} Produkt`;
                const img = Array.isArray(node.image) ? node.image[0] : node.image || (rendered.images && rendered.images[0]);
                const price = node.offers && node.offers.price ? `${node.offers.priceCurrency || ''} ${node.offers.price}` : null;
                const p = makeProduct({ name: title, imageUrl: img || null, description: node.description || rendered.metaDescription || '', basePrice: price, configurable: false, specs: node, keyFeatures: [], datasheets: rendered.datasheets || [] });
                if (!discovered.some(d => d.name === p.name)) discovered.push(p);
              }
            }
            // if still nothing, add first images as sample products
            if (discovered.length === 0 && rendered.images && rendered.images.length > 0) {
              const p = makeProduct({ name: `${name} Beispielprodukt (gerendert)`, imageUrl: rendered.images[0], description: rendered.metaDescription || '', basePrice: null, configurable: false, specs: {}, keyFeatures: [], datasheets: rendered.datasheets || [] });
              discovered.push(p);
            }
          }
        } catch (err) {
          // ignore
        }
      }

  // fallback: single placeholder using available manufacturer.logoUrl or nothing
  if (discovered.length === 0) {
    let ogImage = null;
    if (website) {
      const t = await fetchText(website);
      if (t) ogImage = findFirstMatch(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, t);
    }
    const product = makeProduct({ name: `${name} Beispielprodukt`, imageUrl: ogImage || manufacturer.logoUrl || null, description: 'Automatisch generiertes Beispielprodukt (placeholder).' });
    discovered.push(product);
  }

  return makeManufacturer({ slug: manufacturer.slug, name, logoUrl: manufacturer.logoUrl || (discovered[0] && discovered[0].imageUrl) || null, website: website, products: discovered });
}
