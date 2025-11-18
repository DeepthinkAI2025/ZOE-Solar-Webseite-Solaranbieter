import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { pageToPath } from '../data/pageRoutes';
import { articles } from '../data/articles';
import { productCatalog } from '../data/products.generated.new';

const BASE_URL = 'https://www.zoe-solar.de';
const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Priority and changefreq mapping based on page types
const getPageConfig = (page: string) => {
  const configs: Record<string, { changefreq: string; priority: number }> = {
    home: { changefreq: 'weekly', priority: 1.0 },
    photovoltaik: { changefreq: 'weekly', priority: 0.9 },
    'e-mobilitaet': { changefreq: 'monthly', priority: 0.8 },
    preise: { changefreq: 'weekly', priority: 0.8 },
    projekte: { changefreq: 'weekly', priority: 0.7 },
    produkte: { changefreq: 'weekly', priority: 0.7 },
    'hersteller-detail': { changefreq: 'monthly', priority: 0.6 },
    'ueber-uns': { changefreq: 'monthly', priority: 0.6 },
    karriere: { changefreq: 'monthly', priority: 0.5 },
    kontakt: { changefreq: 'monthly', priority: 0.6 },
    'service-photovoltaik': { changefreq: 'monthly', priority: 0.6 },
    'service-ladeparks': { changefreq: 'monthly', priority: 0.6 },
    'service-speicher': { changefreq: 'monthly', priority: 0.6 },
    nachhaltigkeit: { changefreq: 'monthly', priority: 0.5 },
    aktuelles: { changefreq: 'daily', priority: 0.6 },
    'article-detail': { changefreq: 'monthly', priority: 0.5 },
    anwendungsfaelle: { changefreq: 'weekly', priority: 0.7 },
    'anwendungsfall-detail': { changefreq: 'monthly', priority: 0.6 },
    login: { changefreq: 'yearly', priority: 0.1 },
    dashboard: { changefreq: 'yearly', priority: 0.1 },
    empfehlungspraemie: { changefreq: 'monthly', priority: 0.6 },
    'wissens-hub': { changefreq: 'weekly', priority: 0.7 },
    glossar: { changefreq: 'monthly', priority: 0.6 },
    'guide-detail': { changefreq: 'monthly', priority: 0.6 },
    innovations: { changefreq: 'weekly', priority: 0.7 },
    finanzierung: { changefreq: 'monthly', priority: 0.7 },
    sonderaktionen: { changefreq: 'weekly', priority: 0.7 },
    'faq-page': { changefreq: 'weekly', priority: 0.7 },
    'partner-werden': { changefreq: 'monthly', priority: 0.6 },
    impressum: { changefreq: 'yearly', priority: 0.3 },
    datenschutz: { changefreq: 'yearly', priority: 0.3 },
    agb: { changefreq: 'yearly', priority: 0.3 },
    presse: { changefreq: 'monthly', priority: 0.5 },
    'wartung-service': { changefreq: 'monthly', priority: 0.6 },
    garantieabwicklung: { changefreq: 'monthly', priority: 0.5 },
    'foerdermittel-check': { changefreq: 'monthly', priority: 0.6 },
    'diy-hub': { changefreq: 'monthly', priority: 0.6 },
    'agri-pv': { changefreq: 'monthly', priority: 0.7 },
    team: { changefreq: 'monthly', priority: 0.5 },
    'warum-zoe-solar': { changefreq: 'monthly', priority: 0.6 },
    'foerdermittel-kfw': { changefreq: 'monthly', priority: 0.6 },
    'foerdermittel-ibb': { changefreq: 'monthly', priority: 0.6 },
    'foerdermittel-bafa': { changefreq: 'monthly', priority: 0.6 },
    elektro: { changefreq: 'monthly', priority: 0.7 },
    'service-anmeldung-pv': { changefreq: 'monthly', priority: 0.5 },
    'service-anmeldung-ladestationen': { changefreq: 'monthly', priority: 0.5 },
    'service-netzanschluss': { changefreq: 'monthly', priority: 0.6 },
    'service-verteilerbau': { changefreq: 'monthly', priority: 0.6 },
    'service-zaehlerbau': { changefreq: 'monthly', priority: 0.6 },
    standort: { changefreq: 'monthly', priority: 0.6 },
    'agri-pv-brandenburg': { changefreq: 'monthly', priority: 0.6 },
    'agri-pv-sachsen-anhalt': { changefreq: 'monthly', priority: 0.6 },
    'agri-pv-niedersachsen': { changefreq: 'monthly', priority: 0.6 },
    'agri-pv-bayern': { changefreq: 'monthly', priority: 0.6 },
    'agri-pv-nordrhein-westfalen': { changefreq: 'monthly', priority: 0.6 },
    eigenheim: { changefreq: 'monthly', priority: 0.7 },
    'eigenheim-kosten': { changefreq: 'monthly', priority: 0.6 },
    'eigenheim-einfamilienhaus-kosten': { changefreq: 'monthly', priority: 0.6 },
    'eigenheim-planung': { changefreq: 'monthly', priority: 0.6 },
    'photovoltaik-gewerbe': { changefreq: 'monthly', priority: 0.7 },
    'photovoltaik-logistikzentren': { changefreq: 'monthly', priority: 0.6 },
    'photovoltaik-einzelhandel': { changefreq: 'monthly', priority: 0.6 },
    'photovoltaik-installation-dach': { changefreq: 'monthly', priority: 0.6 },
    'eigenheim-installation': { changefreq: 'monthly', priority: 0.6 },
    'seo-monitoring': { changefreq: 'yearly', priority: 0.1 },
    fallstudien: { changefreq: 'monthly', priority: 0.6 },
    'fallstudie-detail': { changefreq: 'monthly', priority: 0.5 },
    'agri-pv-erfahrungen': { changefreq: 'monthly', priority: 0.6 },
    'mitarbeiter-login': { changefreq: 'yearly', priority: 0.1 },
  };
  return configs[page] || { changefreq: 'monthly', priority: 0.5 };
};

// Generate main sitemap with static pages
const generateMainSitemap = (): string => {
  const mainPages = Object.keys(pageToPath).filter(page =>
    !page.includes('hersteller-detail') &&
    !page.includes('article-detail') &&
    !page.includes('anwendungsfall-detail') &&
    !page.includes('fallstudie-detail') &&
    !page.includes('guide-detail')
  );

  const urls = mainPages.map(page => {
    const path = pageToPath[page as keyof typeof pageToPath];
    const config = getPageConfig(page);
    return {
      loc: `${BASE_URL}${path}`,
      lastmod: currentDate,
      changefreq: config.changefreq,
      priority: config.priority
    };
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate products sitemap
const generateProductsSitemap = (): string => {
  const productUrls = productCatalog.manufacturers.flatMap(manufacturer =>
    manufacturer.products.map(product => ({
      loc: `${BASE_URL}/produkte/${manufacturer.slug}/${product.slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate articles sitemap
const generateArticlesSitemap = (): string => {
  const articleUrls = articles.map(article => ({
    loc: `${BASE_URL}/aktuelles/${article.slug}`,
    lastmod: article.updatedAt || currentDate,
    changefreq: 'monthly',
    priority: 0.5
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articleUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate sitemap index
const generateSitemapIndex = (): string => {
  const sitemaps = [
    { loc: `${BASE_URL}/main-sitemap.xml`, lastmod: currentDate },
    { loc: `${BASE_URL}/products-sitemap.xml`, lastmod: currentDate },
    { loc: `${BASE_URL}/articles-sitemap.xml`, lastmod: currentDate }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return xml;
};

// Write all sitemaps
const publicDir = resolve(process.cwd(), 'public');

writeFileSync(resolve(publicDir, 'sitemap-index.xml'), generateSitemapIndex(), 'utf8');
writeFileSync(resolve(publicDir, 'main-sitemap.xml'), generateMainSitemap(), 'utf8');
writeFileSync(resolve(publicDir, 'products-sitemap.xml'), generateProductsSitemap(), 'utf8');
writeFileSync(resolve(publicDir, 'articles-sitemap.xml'), generateArticlesSitemap(), 'utf8');

// Keep old sitemap.xml for backward compatibility
writeFileSync(resolve(publicDir, 'sitemap.xml'), generateMainSitemap(), 'utf8');

console.log('Sitemaps generated successfully!');
console.log('- sitemap-index.xml');
console.log('- main-sitemap.xml');
console.log('- products-sitemap.xml');
console.log('- articles-sitemap.xml');
console.log('- sitemap.xml (backward compatibility)');