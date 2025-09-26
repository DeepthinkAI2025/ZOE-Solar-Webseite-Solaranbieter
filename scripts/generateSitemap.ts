import { writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://www.zoe-solar.de';

const staticUrls = [
  { loc: BASE_URL, changefreq: 'weekly', priority: 1.0 },
  { loc: `${BASE_URL}/photovoltaik`, changefreq: 'weekly', priority: 0.9 },
  { loc: `${BASE_URL}/leistungen`, changefreq: 'monthly', priority: 0.8 },
  { loc: `${BASE_URL}/preise`, changefreq: 'weekly', priority: 0.8 },
  { loc: `${BASE_URL}/finanzierung`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${BASE_URL}/kontakt`, changefreq: 'monthly', priority: 0.6 },
  { loc: `${BASE_URL}/ueber-uns`, changefreq: 'monthly', priority: 0.6 },
  { loc: `${BASE_URL}/faq`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/wissenshub`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/anwendungsfaelle`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/produkte`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/agri-pv`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${BASE_URL}/elektro`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${BASE_URL}/emobilitaet`, changefreq: 'monthly', priority: 0.7 },
  { loc: `${BASE_URL}/aktuelle`, changefreq: 'daily', priority: 0.6 },
  { loc: `${BASE_URL}/team`, changefreq: 'monthly', priority: 0.5 },
  { loc: `${BASE_URL}/presse`, changefreq: 'monthly', priority: 0.5 },
  { loc: `${BASE_URL}/karriere`, changefreq: 'monthly', priority: 0.5 },
  { loc: `${BASE_URL}/impressum`, changefreq: 'yearly', priority: 0.3 },
  { loc: `${BASE_URL}/datenschutz`, changefreq: 'yearly', priority: 0.3 },
  { loc: `${BASE_URL}/agb`, changefreq: 'yearly', priority: 0.3 },
];

const generateSitemap = (): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

const sitemapPath = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(sitemapPath, generateSitemap(), 'utf8');
console.log('Sitemap generated at public/sitemap.xml');