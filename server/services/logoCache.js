import fs from 'fs';
import path from 'path';
import { fetchLogoCandidatesForWebsite } from './firecrawlClient.js';

const PUBLIC_LOGO_DIR = path.join(process.cwd(), 'public', 'assets', 'logos');

function ensureDir() {
  if (!fs.existsSync(PUBLIC_LOGO_DIR)) fs.mkdirSync(PUBLIC_LOGO_DIR, { recursive: true });
}

function guessExtFromContentType(ct) {
  if (!ct) return null;
  if (ct.includes('svg')) return 'svg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('webp')) return 'webp';
  return null;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function cacheLogoForManufacturer(slug, logoUrl) {
  if (!logoUrl) return null;

  // If already a local asset path (from previous caching), return as-is
  if (typeof logoUrl === 'string' && logoUrl.startsWith('/assets/logos/')) return logoUrl;

  // If a data URL, decode and persist
  if (typeof logoUrl === 'string' && logoUrl.startsWith('data:')) {
    try {
      ensureDir();
      const match = logoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) return null;
      const ct = match[1];
      const data = match[2];
      const ext = guessExtFromContentType(ct) || 'png';
      const filename = `${slug.replace(/[^a-z0-9\-]/gi, '_')}.${ext}`;
      const outPath = path.join(PUBLIC_LOGO_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      return `/assets/logos/${filename}`;
    } catch (err) {
      console.warn(`[logoCache] Failed to persist data-logo for ${slug}:`, err.message || err);
      return null;
    }
  }

  // normalize protocol-relative URLs
  let url = logoUrl;
  if (url.startsWith('//')) url = 'https:' + url;

  // If URL is not http(s), cannot fetch
  if (!url.startsWith('http')) return null;

  ensureDir();

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'ZOE-LogoCache/1.0' } });
      if (!res.ok) {
        if ([401, 403, 404].includes(res.status)) {
          console.warn(`[logoCache] ${slug}: ${res.status} für ${url} – keine weiteren Versuche.`);
          return null;
        }
        throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
      }
      const ct = res.headers.get('content-type') || '';
      let ext = guessExtFromContentType(ct);
      if (!ext) {
        const m = url.match(/\.([a-zA-Z0-9]{2,5})(?:[?#]|$)/);
        ext = m ? m[1] : 'png';
      }

      const filename = `${slug.replace(/[^a-z0-9\-]/gi, '_')}.${ext}`;
      const outPath = path.join(PUBLIC_LOGO_DIR, filename);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(outPath, Buffer.from(buffer));
      return `/assets/logos/${filename}`;
    } catch (err) {
      // If last attempt, log and return null
      if (attempt === maxRetries) {
        console.warn(`[logoCache] Failed to cache logo for ${slug} after ${attempt} attempts:`, err.message || err);
        return null;
      }
      // transient backoff before retry
      const backoff = attempt * 500;
      console.warn(`[logoCache] attempt ${attempt} failed for ${slug}, retrying in ${backoff}ms:`, err.message || err);
      // small delay
      // eslint-disable-next-line no-await-in-loop
      await sleep(backoff);
    }
  }
  return null;
}

/**
 * Try common logo locations and og:image on the manufacturer's website.
 * Returns local asset path or null.
 */
export async function probeAndCacheLogo(slug, websiteUrl) {
  if (!websiteUrl) return null;
  // normalize
  let site = websiteUrl;
  if (site.startsWith('//')) site = 'https:' + site;
  try {
    const base = new URL(site).origin;
    // 1) try homepage og:image
    try {
      const res = await fetch(base, { headers: { 'User-Agent': 'ZOE-LogoProbe/1.0' } });
      if (res.ok) {
        const text = await res.text();
        const og = (text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
        if (og) {
          const local = await cacheLogoForManufacturer(slug, og.startsWith('/') ? new URL(og, base).href : og);
          if (local) return local;
        }
      }
    } catch (err) {
      // ignore
    }

    const candidates = [
      '/favicon.ico',
      '/favicon.png',
      '/favicon.svg',
      '/logo.svg',
      '/logo.png',
      '/assets/logo.svg',
      '/assets/logo.png',
      '/wp-content/uploads/logo.png',
      '/wp-content/uploads/logo.svg'
    ];

    for (const p of candidates) {
      try {
        const url = new URL(p, base).href;
        const local = await cacheLogoForManufacturer(slug, url);
        if (local) return local;
      } catch (err) {
        // continue
      }
    }

    // 3) try sitemap.xml to find probable logo images or homepage imgs
    try {
      const sitemapUrl = new URL('/sitemap.xml', base).href;
      const res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'ZOE-LogoProbe/1.0' } });
      if (res.ok) {
        const xml = await res.text();
        // simple <loc> extraction
        const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/ig)).map(m => m[1]);
        // probe first few locations for images
        for (const loc of locs.slice(0, 12)) {
          try {
            const pageRes = await fetch(loc, { headers: { 'User-Agent': 'ZOE-LogoProbe/1.0' } });
            if (!pageRes.ok) continue;
            const txt = await pageRes.text();
            const og = (txt.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1];
            if (og) {
              const local = await cacheLogoForManufacturer(slug, og.startsWith('/') ? new URL(og, base).href : og);
              if (local) return local;
            }
            // try to find images with logo in alt or filename
            const imgs = Array.from(txt.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/ig)).map(m => m[1]);
            for (const img of imgs.slice(0, 6)) {
              if (img.toLowerCase().includes('logo') || img.toLowerCase().includes('brand')) {
                const resolved = img.startsWith('/') ? new URL(img, base).href : img;
                const local = await cacheLogoForManufacturer(slug, resolved);
                if (local) return local;
              }
            }
          } catch (err) {
            // continue
          }
        }
      }
    } catch (err) {
      // ignore sitemap errors
    }

    // 4) try Wikimedia Commons as a fallback (public/safe logos)
    try {
      // query MediaWiki API search for files matching the company name
      const queryName = slug.replace(/[-_]/g, ' ');
      const mwApi = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&generator=search&gsrsearch=${encodeURIComponent(queryName + ' logo')}&gsrlimit=5&formatversion=2&origin=*`;
      const res = await fetch(mwApi, { headers: { 'User-Agent': 'ZOE-Wikimedia-LogoProbe/1.0' } });
      if (res.ok) {
        const body = await res.json();
        if (body && body.query && Array.isArray(body.query.pages)) {
          for (const page of body.query.pages) {
            if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
              const imgUrl = page.imageinfo[0].url;
              const local = await cacheLogoForManufacturer(slug, imgUrl);
              if (local) return local;
            }
          }
        }
      }
    } catch (err) {
      // ignore
    }

    // 5) Firecrawl MCP fallback for logo discovery
    try {
      const candidates = await fetchLogoCandidatesForWebsite(base, slug);
      for (const candidate of candidates) {
        const local = await cacheLogoForManufacturer(slug, candidate);
        if (local) return local;
      }
    } catch (err) {
      console.warn('[logoCache] Firecrawl logo fallback failed for', slug, err?.message ?? err);
    }
  } catch (err) {
    // invalid URL or other error
  }
  return null;
}
