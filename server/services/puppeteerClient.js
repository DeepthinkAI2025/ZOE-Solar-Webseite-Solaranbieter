import puppeteer from 'puppeteer';

let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
  }
  return browserPromise;
}

export async function withPage(fn) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(30000);
  await page.setUserAgent('ZOE-Puppeteer/1.0');
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

export async function closeBrowser() {
  if (!browserPromise) return;
  const browser = await browserPromise;
  await browser.close();
  browserPromise = null;
}

export async function renderPageHtml(url, timeout = 15000) {
  return withPage(async (page) => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout });
    return page.content();
  });
}

export async function extractFromRendered(url, timeout = 20000) {
  return withPage(async (page) => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout });
    const data = await page.evaluate(() => {
      const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

      const html = document.documentElement.outerHTML;
      const title = document.title || null;
      const metaDescription = document.querySelector('meta[name="description"]')?.content || null;

      const images = uniq(Array.from(document.querySelectorAll('img')).map((img) => img.currentSrc || img.src || null));
      const logoCandidates = uniq(
        Array.from(document.querySelectorAll('img, link[rel="icon"], link[rel="shortcut icon"]'))
          .map((el) => {
            if (el.tagName === 'LINK') return el.href;
            const src = el.currentSrc || el.src;
            const alt = (el.getAttribute('alt') || '').toLowerCase();
            const cls = (el.getAttribute('class') || '').toLowerCase();
            if (!src) return null;
            if (alt.includes('logo') || alt.includes('brand') || cls.includes('logo')) return src;
            return null;
          })
      );

      const datasheets = uniq(
        Array.from(document.querySelectorAll('a[href$=".pdf"]')).map((a) => ({
          href: a.href,
          text: a.textContent?.trim() || null
        }))
      );

      const productLinks = uniq(
        Array.from(document.querySelectorAll('a[href]'))
          .map((a) => ({ href: a.href, text: a.textContent?.trim() || '' }))
          .filter(({ href, text }) => {
            const h = (href || '').toLowerCase();
            const t = (text || '').toLowerCase();
            return /product|produkte|modul|module|inverter|wechselrichter|speicher/.test(h) ||
              /product|produkt|modul|module|inverter|wechselrichter|speicher/.test(t);
          })
          .slice(0, 15)
      );

      const jsonLd = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((script) => script.textContent)
        .filter(Boolean);

      return { html, title, metaDescription, images, logoCandidates, datasheets, productLinks, jsonLd };
    });

    const parsedJsonLd = [];
    for (const block of data.jsonLd) {
      try {
        const parsed = JSON.parse(block);
        if (Array.isArray(parsed)) parsedJsonLd.push(...parsed);
        else parsedJsonLd.push(parsed);
      } catch (err) {
        // ignore invalid json-ld
      }
    }

    return {
      url,
      html: data.html,
      title: data.title,
      metaDescription: data.metaDescription,
      images: data.images,
      logoCandidates: data.logoCandidates,
      datasheets: data.datasheets,
      productLinks: data.productLinks,
      jsonLd: parsedJsonLd
    };
  });
}

export default { withPage, closeBrowser, renderPageHtml, extractFromRendered };
