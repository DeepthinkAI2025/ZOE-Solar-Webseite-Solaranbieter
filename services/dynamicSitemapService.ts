import { pageRoutes, Page } from '../data/pageRoutes';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
  image?: Array<{
    loc: string;
    title?: string;
    caption?: string;
  }>;
  video?: Array<{
    loc: string;
    title: string;
    description: string;
    thumbnail_loc: string;
  }>;
}

interface LocationData {
  city: string;
  state: string;
  zipCode: string;
  population: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  location: string;
  completionDate: string;
  powerOutput: number;
  description: string;
  images: string[];
  category: string;
}

class DynamicSitemapService {
  private baseUrl: string = 'https://zoe-solar.de';
  private defaultPriority: number = 0.7;
  private defaultChangeFreq: 'weekly' | 'monthly' = 'weekly';

  // German cities with solar potential
  private locations: LocationData[] = [
    { city: 'Berlin', state: 'Berlin', zipCode: '10115', population: 3645000, coordinates: { lat: 52.5200, lng: 13.4050 } },
    { city: 'Hamburg', state: 'Hamburg', zipCode: '20095', population: 1847000, coordinates: { lat: 53.5511, lng: 9.9937 } },
    { city: 'München', state: 'Bayern', zipCode: '80331', population: 1472000, coordinates: { lat: 48.1351, lng: 11.5820 } },
    { city: 'Köln', state: 'Nordrhein-Westfalen', zipCode: '50667', population: 1086000, coordinates: { lat: 50.9375, lng: 6.9603 } },
    { city: 'Frankfurt', state: 'Hessen', zipCode: '60311', population: 753000, coordinates: { lat: 50.1109, lng: 8.6821 } },
    { city: 'Stuttgart', state: 'Baden-Württemberg', zipCode: '70173', population: 635000, coordinates: { lat: 48.7758, lng: 9.1829 } },
    { city: 'Düsseldorf', state: 'Nordrhein-Westfalen', zipCode: '40210', population: 619000, coordinates: { lat: 51.2277, lng: 6.7735 } },
    { city: 'Dortmund', state: 'Nordrhein-Westfalen', zipCode: '44137', population: 588000, coordinates: { lat: 51.5136, lng: 7.4653 } },
    { city: 'Leipzig', state: 'Sachsen', zipCode: '04109', population: 593000, coordinates: { lat: 51.3397, lng: 12.3731 } },
    { city: 'Dresden', state: 'Sachsen', zipCode: '01067', population: 556000, coordinates: { lat: 51.0504, lng: 13.7373 } },
    { city: 'Hannover', state: 'Niedersachsen', zipCode: '30159', population: 534000, coordinates: { lat: 52.3759, lng: 9.7320 } },
    { city: 'Bremen', state: 'Bremen', zipCode: '28195', population: 569000, coordinates: { lat: 53.0793, lng: 8.8017 } },
    { city: 'Nürnberg', state: 'Bayern', zipCode: '90403', population: 518000, coordinates: { lat: 49.4521, lng: 11.0767 } },
    { city: 'Potsdam', state: 'Brandenburg', zipCode: '14469', population: 180000, coordinates: { lat: 52.4009, lng: 13.0591 } },
  ];

  // Solar project data
  private projects: ProjectData[] = [
    {
      id: 'proj-001',
      title: 'Gewerbe-PV-Anlage Berlin Mitte',
      slug: 'gewerbe-pv-berlin-mitte',
      location: 'Berlin',
      completionDate: '2024-06-15',
      powerOutput: 850,
      description: '850 kWp Dachanlage für Logistikzentrum',
      images: ['/images/projects/berlin-mitte-1.jpg', '/images/projects/berlin-mitte-2.jpg'],
      category: 'gewerbe'
    },
    {
      id: 'proj-002',
      title: 'Agri-PV Anlage Brandenburg',
      slug: 'agri-pv-brandenburg-hof',
      location: 'Brandenburg',
      completionDate: '2024-08-20',
      powerOutput: 1200,
      description: '1.2 MWp Agri-PV mit Doppelnutzung',
      images: ['/images/projects/agri-pv-brandenburg-1.jpg'],
      category: 'agri-pv'
    },
    {
      id: 'proj-003',
      title: 'Solarpark Niedersachsen',
      slug: 'solarpark-niedersachsen',
      location: 'Niedersachsen',
      completionDate: '2024-05-10',
      powerOutput: 2500,
      description: '2.5 MWp Freiflächenanlage',
      images: ['/images/projects/solarpark-1.jpg', '/images/projects/solarpark-2.jpg'],
      category: 'freiflaeche'
    }
  ];

  public generateMainSitemap = (): string => {
    const entries: SitemapEntry[] = [];

    // Add static pages from pageRoutes
    Object.entries(pageRoutes).forEach(([page, path]) => {
      if (this.shouldIncludePage(page as Page)) {
        entries.push(this.createPageEntry(page as Page, path));
      }
    });

    // Add location pages for all cities
    this.locations.forEach(location => {
      entries.push(this.createLocationEntry(location));
    });

    // Add project pages
    this.projects.forEach(project => {
      entries.push(this.createProjectEntry(project));
    });

    // Add category pages
    entries.push(...this.createCategoryEntries());

    // Add special SEO pages
    entries.push(...this.createSEOEntries());

    return this.generateXML(entries);
  };

  public generateImageSitemap = (): string => {
    const entries: SitemapEntry[] = [];

    // Project images
    this.projects.forEach(project => {
      project.images.forEach((imageUrl, index) => {
        entries.push({
          url: `${this.baseUrl}/projekte/${project.slug}`,
          lastmod: project.completionDate,
          changefreq: 'monthly',
          priority: 0.8,
          image: [{
            loc: `${this.baseUrl}${imageUrl}`,
            title: `${project.title} - Bild ${index + 1}`,
            caption: project.description,
          }],
        });
      });
    });

    // Add gallery images
    for (let i = 1; i <= 20; i++) {
      entries.push({
        url: `${this.baseUrl}/projekte`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.6,
        image: [{
          loc: `${this.baseUrl}/images/gallery/solar-project-${i}.jpg`,
          title: `Solaranlagen Projekt ${i}`,
          caption: 'Professionell installierte Photovoltaikanlage von ZOE Solar',
        }],
      });
    }

    return this.generateXML(entries, 'image');
  };

  public generateVideoSitemap = (): string => {
    const entries: SitemapEntry[] = [];

    // Solar installation videos
    const videos = [
      {
        loc: 'https://www.youtube.com/watch?v=solar-installation-1',
        title: 'Photovoltaik Installation Schritt für Schritt',
        description: 'Komplette Dokumentation einer professionellen PV-Anlagen Installation',
        thumbnail_loc: `${this.baseUrl}/images/videos/installation-thumb.jpg`,
      },
      {
        loc: 'https://www.youtube.com/watch?v=agri-pv-demo',
        title: 'Agri-PV Anlage in Aktion',
        description: 'Wie Agri-PV Doppelnutzung in der Praxis funktioniert',
        thumbnail_loc: `${this.baseUrl}/images/videos/agri-pv-thumb.jpg`,
      },
      {
        loc: 'https://www.youtube.com/watch?v=beratung-video',
        title: 'Solarberatung bei ZOE Solar',
        description: 'Was Sie in unserer persönlichen Solarberatung erwartet',
        thumbnail_loc: `${this.baseUrl}/images/videos/beratung-thumb.jpg`,
      },
    ];

    videos.forEach(video => {
      entries.push({
        url: `${this.baseUrl}/photovoltaik`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.9,
        video: [video],
      });
    });

    return this.generateXML(entries, 'video');
  };

  public generateNewsSitemap = (): string => {
    const entries: SitemapEntry[] = [];

    // News/blog entries
    const newsArticles = [
      {
        title: 'Neue Förderprogramme für Photovoltaik 2025',
        slug: 'neue-foerderprogramme-pv-2025',
        publication_date: '2024-10-28',
        keywords: 'Photovoltaik,Förderung,Solar,2025',
      },
      {
        title: 'Agri-PV: Die Zukunft der Landwirtschaft',
        slug: 'agri-pv-zukunft-landwirtschaft',
        publication_date: '2024-10-25',
        keywords: 'Agri-PV,Landwirtschaft,Solar,Doppelnutzung',
      },
      {
        title: 'Speicherpreise sinken - jetzt investieren',
        slug: 'speicherpreise-sinken-jetzt-investieren',
        publication_date: '2024-10-22',
        keywords: 'Batteriespeicher,Preise,Investition,Speicher',
      },
    ];

    newsArticles.forEach(article => {
      entries.push({
        url: `${this.baseUrl}/aktuelles/${article.slug}`,
        lastmod: article.publication_date,
        changefreq: 'daily',
        priority: 0.8,
      });
    });

    return this.generateXML(entries, 'news');
  };

  private shouldIncludePage = (page: Page): boolean => {
    // Exclude pages that shouldn't be in sitemap
    const excludePages: Page[] = [
      'dashboard', 'login', 'mitarbeiter-login'
    ];

    return !excludePages.includes(page);
  };

  private createPageEntry = (page: Page, path: string): SitemapEntry => {
    const priority = this.getPagePriority(page);
    const changeFreq = this.getPageChangeFreq(page);
    const lastmod = this.getPageLastMod(page);

    return {
      url: `${this.baseUrl}${path}`,
      lastmod,
      changefreq: changeFreq,
      priority,
      alternates: this.createAlternates(path),
    };
  };

  private createLocationEntry = (location: LocationData): SitemapEntry => {
    return {
      url: `${this.baseUrl}/standort/${location.city.toLowerCase()}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8,
      alternates: this.createAlternates(`/standort/${location.city.toLowerCase()}`),
    };
  };

  private createProjectEntry = (project: ProjectData): SitemapEntry => {
    return {
      url: `${this.baseUrl}/projekte/${project.slug}`,
      lastmod: project.completionDate,
      changefreq: 'monthly',
      priority: 0.9,
      image: project.images.map(imageUrl => ({
        loc: `${this.baseUrl}${imageUrl}`,
        title: project.title,
        caption: project.description,
      })),
    };
  };

  private createCategoryEntries = (): SitemapEntry[] => {
    return [
      {
        url: `${this.baseUrl}/photovoltaik/gewerbe`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/photovoltaik/landwirtschaft`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/photovoltaik/industrie`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/agri-pv`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
    ];
  };

  private createSEOEntries = (): SitemapEntry[] => {
    return [
      {
        url: `${this.baseUrl}/photovoltaik/rechner-gewerbe`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        url: `${this.baseUrl}/foerdermittel-check`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: `${this.baseUrl}/wissen/faq`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.8,
      },
    ];
  };

  private getPagePriority = (page: Page): number => {
    const priorityMap: Record<Page, number> = {
      'home': 1.0,
      'photovoltaik': 0.9,
      'agri-pv': 0.9,
      'projekte': 0.8,
      'photovoltaik/rechner-gewerbe': 1.0,
      'kontakt': 0.8,
      'ueber-uns': 0.7,
      'photovoltaik/gewerbe': 0.9,
      'photovoltaik/landwirtschaft': 0.9,
      'photovoltaik/industrie': 0.9,
      'foerdermittel-check': 0.9,
      'finanzierung': 0.8,
      'wissen/faq': 0.8,
    };

    return priorityMap[page] || this.defaultPriority;
  };

  private getPageChangeFreq = (page: Page): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' => {
    const changeFreqMap: Record<Page, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'> = {
      'home': 'daily',
      'photovoltaik/rechner-gewerbe': 'daily',
      'foerdermittel-check': 'daily',
      'aktuelles': 'daily',
      'photovoltaik': 'weekly',
      'agri-pv': 'weekly',
      'projekte': 'weekly',
      'kontakt': 'monthly',
      'ueber-uns': 'monthly',
      'impressum': 'yearly',
      'datenschutz': 'yearly',
      'agb': 'yearly',
    };

    return changeFreqMap[page] || this.defaultChangeFreq;
  };

  private getPageLastMod = (page: Page): string => {
    // Return actual last modification dates based on page type
    const today = new Date().toISOString().split('T')[0];

    const lastModMap: Record<Page, string> = {
      'home': today,
      'photovoltaik/rechner-gewerbe': today,
      'foerdermittel-check': today,
      'aktuelles': today,
      'photovoltaik': '2024-10-28',
      'agri-pv': '2024-10-28',
      'projekte': '2024-10-25',
      'impressum': '2024-01-01',
      'datenschutz': '2024-01-01',
      'agb': '2024-01-01',
    };

    return lastModMap[page] || today;
  };

  private createAlternates = (path: string): Array<{ hreflang: string; href: string }> => {
    return [
      { hreflang: 'de', href: `${this.baseUrl}${path}` },
      { hreflang: 'de-DE', href: `${this.baseUrl}${path}` },
      { hreflang: 'en', href: `${this.baseUrl}/en${path}` },
      { hreflang: 'x-default', href: `${this.baseUrl}${path}` },
    ];
  };

  private generateXML = (entries: SitemapEntry[], type: 'main' | 'image' | 'video' | 'news' = 'main'): string => {
    const xmlEntries = entries.map(entry => this.generateXMLUrlEntry(entry, type)).join('\n');

    const xmlns = {
      main: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      image: 'http://www.google.com/schemas/sitemap-image/1.1',
      video: 'http://www.google.com/schemas/sitemap-video/1.1',
      news: 'http://www.google.com/schemas/sitemap-news/0.9',
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="${xmlns.main}"
        xmlns:image="${xmlns.image}"
        xmlns:video="${xmlns.video}"
        xmlns:news="${xmlns.news}">
${xmlEntries}
</urlset>`;
  };

  private generateXMLUrlEntry = (entry: SitemapEntry, type: 'main' | 'image' | 'video' | 'news'): string => {
    let xml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`;

    // Add hreflang alternates
    if (entry.alternates) {
      entry.alternates.forEach(alternate => {
        xml += `
    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}" xmlns:xhtml="http://www.w3.org/1999/xhtml"/>`;
      });
    }

    // Add image elements
    if (entry.image && type !== 'news') {
      entry.image.forEach(image => {
        xml += `
    <image:image>
      <image:loc>${image.loc}</image:loc>`;
        if (image.title) xml += `
      <image:title>${this.escapeXML(image.title)}</image:title>`;
        if (image.caption) xml += `
      <image:caption>${this.escapeXML(image.caption)}</image:caption>`;
        xml += `
    </image:image>`;
      });
    }

    // Add video elements
    if (entry.video && type !== 'news') {
      entry.video.forEach(video => {
        xml += `
    <video:video>
      <video:loc>${video.loc}</video:loc>
      <video:title>${this.escapeXML(video.title)}</video:title>
      <video:description>${this.escapeXML(video.description)}</video:description>
      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>
    </video:video>`;
      });
    }

    xml += `
  </url>`;

    return xml;
  };

  private escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  public generateSitemapIndex = (): string => {
    const sitemaps = [
      'sitemap.xml',
      'sitemap-images.xml',
      'sitemap-videos.xml',
      'sitemap-news.xml',
    ];

    const entries = sitemaps.map(sitemap => `  <sitemap>
    <loc>${this.baseUrl}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
  };

  public writeSitemaps = (): void => {
    // In a real implementation, this would write files to the public directory
    // For now, we'll just generate the content
    const mainSitemap = this.generateMainSitemap();
    const imageSitemap = this.generateImageSitemap();
    const videoSitemap = this.generateVideoSitemap();
    const newsSitemap = this.generateNewsSitemap();
    const sitemapIndex = this.generateSitemapIndex();

    console.log('🗺️ Generated sitemaps:');
    console.log('✅ Main sitemap:', mainSitemap.length, 'characters');
    console.log('✅ Image sitemap:', imageSitemap.length, 'characters');
    console.log('✅ Video sitemap:', videoSitemap.length, 'characters');
    console.log('✅ News sitemap:', newsSitemap.length, 'characters');
    console.log('✅ Sitemap index:', sitemapIndex.length, 'characters');
  };
}

// Export singleton instance
export const dynamicSitemapService = new DynamicSitemapService();

export type { SitemapEntry, LocationData, ProjectData };