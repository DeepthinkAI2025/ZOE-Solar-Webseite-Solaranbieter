import { tavilySearch, tavilyExtract } from "../../tavilyClient.js";

const BAD_HOST_SUFFIXES = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "facebook.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "pinterest.com",
  "amazon.com",
  "wikipedia.org",
  "wikimedia.org",
  "imdb.com",
  "reddit.com"
];

const STOPWORDS = new Set([
  "the",
  "and",
  "with",
  "series",
  "model",
  "module",
  "panel",
  "solar",
  "energy",
  "power",
  "system",
  "systems",
  "solution",
  "solutions",
  "premium",
  "ultimate",
  "excellence",
  "experience",
  "innovation",
  "innovative",
  "smart",
  "intelligent",
  "modern",
  "future",
  "next",
  "generation",
  "design",
  "stylish",
  "aesthetic",
  "aesthetics",
  "quality",
  "performance",
  "reliability",
  "guarantee",
  "warranty",
  "gmbh",
  "ag",
  "kg",
  "ltd",
  "inc",
  "co",
  "company",
  "group",
  "international"
]);

const MARKETING_TOKENS = new Set([
  "epitome",
  "elegance",
  "perfection",
  "perfectionist",
  "beautiful",
  "beauty",
  "luxury",
  "exclusive",
  "exquisite",
  "iconic",
  "legendary",
  "flagship",
  "signature",
  "masterpiece",
  "supreme"
]);

const KEYWORDS_BY_TYPE = {
  datasheet: ["datasheet", "data-sheet", "spec", "specification", "technical", "product-sheet"],
  installation_manual: ["installation", "manual", "guide", "instructions", "mounting", "wiring"],
  compatibility_list: ["compatibility", "compatible", "approved", "list", "matrix"],
  other: ["brochure", "catalog", "catalogue", "flyer", "certificate", "warranty", "documentation"]
};

const COMMON_DOCUMENT_KEYWORDS = [
  "datasheet",
  "manual",
  "installation",
  "guide",
  "specification",
  "technical",
  "sheet",
  "pdf",
  "instructions",
  "warranty",
  "certificate",
  "catalog",
  "catalogue"
];

const MIN_RELEVANCE_SCORE = 5;

function hasPdfExtension(url) {
  return typeof url === 'string' && /\.pdf(?:$|[?#])/i.test(url);
}

function extractHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch (err) {
    return null;
  }
}

function normaliseDomain(hostname) {
  if (!hostname) return null;
  return hostname.toLowerCase().replace(/^www\./, '');
}

function isBadHost(hostname) {
  if (!hostname) return false;
  return BAD_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

function isManufacturerHost(hostname, manufacturerDomain, manufacturerRootDomain) {
  if (!hostname) return false;
  const domainCandidates = [manufacturerDomain, manufacturerRootDomain].filter(Boolean);
  if (domainCandidates.length === 0) return false;
  return domainCandidates.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function tokenize(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function filterProductTokens(tokens = []) {
  const filtered = tokens.filter((token) => !MARKETING_TOKENS.has(token));
  return filtered.length ? filtered : tokens;
}

function includesAny(haystack, needles) {
  if (!haystack || needles.length === 0) return false;
  return needles.some((needle) => haystack.includes(needle));
}

function scoreSearchHit(hit, context) {
  const url = hit?.url ? hit.url.trim() : '';
  if (!url) return Number.NEGATIVE_INFINITY;
  if (!hasPdfExtension(url)) return Number.NEGATIVE_INFINITY;

  const hostname = extractHostname(url);
  if (isBadHost(hostname)) return Number.NEGATIVE_INFINITY;

  const onManufacturerDomain = isManufacturerHost(
    hostname,
    context.manufacturerDomain,
    context.manufacturerRootDomain
  );

  if (context.manufacturerDomain && !onManufacturerDomain) {
    const slugMatch = context.manufacturerSlug && hostname ? hostname.includes(context.manufacturerSlug) : false;
    if (!slugMatch) {
      return Number.NEGATIVE_INFINITY;
    }
  }

  const text = [url, hit?.title ?? '', hit?.description ?? ''].join(' ').toLowerCase();
  const hasManufacturerToken = includesAny(text, context.manufacturerTokens);

  if (!onManufacturerDomain && !hasManufacturerToken) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  if (onManufacturerDomain) score += 4;
  if (hasManufacturerToken) score += 3;
  if (includesAny(text, context.productTokens)) score += 2;
  if (includesAny(text, KEYWORDS_BY_TYPE[context.type] || [])) score += 2;
  if (includesAny(text, COMMON_DOCUMENT_KEYWORDS)) score += 1;

  return score;
}

function uniqueUrls(urls = []) {
  const seen = new Set();
  const safe = [];
  for (const url of urls) {
    if (!url || typeof url !== 'string') continue;
    const trimmed = url.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    safe.push(trimmed);
  }
  return safe;
}

function buildDocument(type, url, title, description, previewText) {
  return {
    type,
    url,
    title: title || undefined,
    description: description || undefined,
    previewText: previewText || undefined
  };
}

async function runTavilySearch(query, maxResults = 6) {
  try {
    const res = await tavilySearch(query, {
      max_results: Math.max(3, Math.min(10, maxResults)),
      search_depth: 'advanced',
      include_answer: false,
      include_images: false,
      include_html: false
    });
    return Array.isArray(res?.results) ? res.results : [];
  } catch (err) {
    console.warn('[tavily] search failed for query', query, err?.message || err);
    return [];
  }
}

async function runTavilyExtract(urls) {
  if (!urls.length) return [];
  try {
    const response = await tavilyExtract(urls, {
      extractDepth: 'basic',
      includeImages: false,
      timeout: 60
    });
    return Array.isArray(response?.results) ? response.results : [];
  } catch (err) {
    console.warn('[tavily] extract failed', err?.message || err);
    return [];
  }
}

/**
 * Sucht mit Tavily nach Dokumenten-URLs für ein Produkt und extrahiert Metadaten für Vorschauen.
 * @param {string} productName
 * @param {string} manufacturerName
 * @returns {Promise<{ datasheetUrls: string[], installationManualUrls: string[], additionalDocumentUrls: string[], documents: any[] }>}
 */
export async function fetchProductDocuments(productName, manufacturerName, manufacturerWebsite = null) {
  const manufacturerHostname = manufacturerWebsite ? extractHostname(manufacturerWebsite) : null;
  const manufacturerRootDomain = normaliseDomain(manufacturerHostname);
  const manufacturerTokens = tokenize(manufacturerName);
  const filteredProductTokens = filterProductTokens(tokenize(productName));
  const productTokens = filteredProductTokens.length ? filteredProductTokens : tokenize(productName);
  const manufacturerSlug = manufacturerRootDomain
    ? manufacturerRootDomain.split('.')[0]
    : manufacturerTokens.find((token) => token.length > 4) ?? null;

  const manufacturerQuery = manufacturerTokens.slice(0, 3).join(' ');
  const productQuery = productTokens.slice(0, 4).join(' ');

  const baseQueries = [
    { type: 'datasheet', query: `${manufacturerQuery} ${productQuery} datasheet filetype:pdf` },
    { type: 'datasheet', query: `${manufacturerQuery} ${productQuery} technical data sheet pdf` },
    { type: 'installation_manual', query: `${manufacturerQuery} ${productQuery} installation manual filetype:pdf` },
    { type: 'installation_manual', query: `${manufacturerQuery} ${productQuery} mounting instructions pdf` },
    { type: 'compatibility_list', query: `${manufacturerQuery} ${productQuery} compatibility list filetype:pdf` },
    { type: 'other', query: `${manufacturerQuery} ${productQuery} documentation filetype:pdf` }
  ];

  const aggregatedByType = new Map();

  const perQueryResults = await Promise.all(
    baseQueries.map(async ({ type, query }) => {
      const hits = await runTavilySearch(query.trim().replace(/\s+/g, ' '), 8);
      const context = {
        type,
        manufacturerDomain: manufacturerRootDomain ?? manufacturerHostname,
        manufacturerRootDomain,
        manufacturerTokens,
        productTokens,
        manufacturerSlug
      };

      const scoredHits = hits
        .map((hit) => ({
          url: hit?.url,
          title: hit?.title,
          description: hit?.content,
          score: scoreSearchHit(hit, context)
        }))
        .filter((hit) => Boolean(hit.url) && Number.isFinite(hit.score) && hit.score >= MIN_RELEVANCE_SCORE);

      return { type, hits: scoredHits };
    })
  );

  for (const { type, hits } of perQueryResults) {
    if (!aggregatedByType.has(type)) {
      aggregatedByType.set(type, new Map());
    }
    const bucket = aggregatedByType.get(type);
    for (const hit of hits) {
      const existing = bucket.get(hit.url);
      if (!existing || (hit.score ?? 0) > (existing.score ?? 0)) {
        bucket.set(hit.url, hit);
      }
    }
  }

  const searchResultsByType = Array.from(aggregatedByType.entries()).map(([type, bucket]) => ({
    type,
    hits: Array.from(bucket.values())
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 5)
  }));

  const groupedUrls = {
    datasheet: uniqueUrls(searchResultsByType.find(r => r.type === 'datasheet')?.hits.map(h => h.url) || []),
    installation_manual: uniqueUrls(searchResultsByType.find(r => r.type === 'installation_manual')?.hits.map(h => h.url) || []),
    compatibility_list: uniqueUrls(searchResultsByType.find(r => r.type === 'compatibility_list')?.hits.map(h => h.url) || []),
    other: uniqueUrls(searchResultsByType.find(r => r.type === 'other')?.hits.map(h => h.url) || [])
  };

  const allUniqueUrls = uniqueUrls([
    ...groupedUrls.datasheet,
    ...groupedUrls.installation_manual,
    ...groupedUrls.compatibility_list,
    ...groupedUrls.other
  ]);

  const extractResults = await runTavilyExtract(allUniqueUrls.slice(0, 15));
  const extractByUrl = new Map();
  for (const item of extractResults) {
    if (!item?.url) continue;
    extractByUrl.set(item.url, item);
  }

  const buildDocsForType = (type, urls) =>
    urls.map((url) => {
      const searchHit = searchResultsByType
        .find((entry) => entry.type === type)?.hits.find((hit) => hit.url === url);
      const extract = extractByUrl.get(url);
      const previewText = extract?.raw_content
        ? extract.raw_content.slice(0, 800)
        : searchHit?.description;
      return buildDocument(
        type,
        url,
        searchHit?.title || extract?.title,
        searchHit?.description,
        previewText
      );
    });

  const documents = [
    ...buildDocsForType('datasheet', groupedUrls.datasheet),
    ...buildDocsForType('installation_manual', groupedUrls.installation_manual),
    ...buildDocsForType('compatibility_list', groupedUrls.compatibility_list),
    ...buildDocsForType('other', groupedUrls.other)
  ];

  return {
    datasheetUrls: groupedUrls.datasheet,
    installationManualUrls: groupedUrls.installation_manual,
    additionalDocumentUrls: uniqueUrls([...groupedUrls.compatibility_list, ...groupedUrls.other]),
    documents
  };
}
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
