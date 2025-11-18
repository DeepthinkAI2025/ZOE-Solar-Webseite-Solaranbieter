/**
 * Automated Sitemap Generation Service für ZOE Solar
 *
 * Automatische Generierung und Verwaltung von XML-Sitemaps
 * für optimale Suchmaschinen-Indexierung
 */

import { getAIGatewayService } from './core/AIGatewayService.js';

// Wrapper für KI-Keyword-Optimierung (OpenRouter/Mistral)
const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent.apply(aiGateway, args);
};

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: Array<{
    loc: string;
    caption?: string;
    title?: string;
  }>;
  videos?: Array<{
    thumbnail_loc: string;
    title: string;
    description: string;
    content_loc?: string;
    duration?: number;
  }>;
  news?: {
    publication: {
      name: string;
      language: string;
    };
    publication_date: string;
    title: string;
  };
}

export interface SitemapIndex {
  sitemaps: Array<{
    loc: string;
    lastmod?: string;
  }>;
}

export interface SitemapConfiguration {
  id: string;
  domain: string;
  baseUrl: string;
  types: ('pages' | 'images' | 'videos' | 'news')[];
  includePatterns: string[];
  excludePatterns: string[];
  priorityRules: Array<{
    pattern: string;
    priority: number;
    changefreq: SitemapUrl['changefreq'];
  }>;
  maxUrlsPerSitemap: number;
  lastGenerated: Date;
  active: boolean;
}

export interface SitemapAnalytics {
  totalSitemaps: number;
  totalUrls: number;
  indexedUrls: number;
  coverageRate: number;
  lastSubmission: Date;
  searchConsoleData: {
    submitted: number;
    indexed: number;
    errors: number;
  };
  performance: {
    generationTime: number;
    fileSize: number;
    compressionRatio: number;
  };
}

export interface SitemapOptimization {
  configurationId: string;
  recommendations: Array<{
    type: 'coverage' | 'performance' | 'seo' | 'technical';
    issue: string;
    solution: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact: number;
    implementation: {
      action: string;
      parameters: Record<string, any>;
    };
  }>;
  generatedAt: Date;
  applied: boolean;
}

class AutomatedSitemapService {
  private static instance: AutomatedSitemapService;
  private configurations: Map<string, SitemapConfiguration> = new Map();
  private sitemaps: Map<string, SitemapUrl[]> = new Map();
  private sitemapIndices: Map<string, SitemapIndex> = new Map();
  private analytics: SitemapAnalytics;
  private optimizations: Map<string, SitemapOptimization> = new Map();
  private sitemapInterval?: NodeJS.Timeout;

  private constructor() {
    this.analytics = this.initializeAnalytics();
    this.initializeBaseConfiguration();
    this.scheduleSitemapGeneration();
  }

  public static getInstance(): AutomatedSitemapService {
    if (!AutomatedSitemapService.instance) {
      AutomatedSitemapService.instance = new AutomatedSitemapService();
    }
    return AutomatedSitemapService.instance;
  }

  private initializeAnalytics(): SitemapAnalytics {
    return {
      totalSitemaps: 0,
      totalUrls: 0,
      indexedUrls: 0,
      coverageRate: 0,
      lastSubmission: new Date(),
      searchConsoleData: {
        submitted: 0,
        indexed: 0,
        errors: 0
      },
      performance: {
        generationTime: 0,
        fileSize: 0,
        compressionRatio: 0
      }
    };
  }

  private initializeBaseConfiguration(): void {
    this.configurations.set('main-sitemap', {
      id: 'main-sitemap',
      domain: 'zoe-solar.de',
      baseUrl: 'https://zoe-solar.de',
      types: ['pages', 'images'],
      includePatterns: [
        '/',
        '/photovoltaik',
        '/photovoltaik/*',
        '/standort/*',
        '/blog/*',
        '/agri-pv/*',
        '/foerdermittel/*'
      ],
      excludePatterns: [
        '/admin/*',
        '/api/*',
        '/_next/*',
        '/node_modules/*',
        '/search*'
      ],
      priorityRules: [
        {
          pattern: '^/$',
          priority: 1.0,
          changefreq: 'daily'
        },
        {
          pattern: '^/photovoltaik$',
          priority: 0.9,
          changefreq: 'weekly'
        },
        {
          pattern: '^/standort/',
          priority: 0.8,
          changefreq: 'monthly'
        },
        {
          pattern: '^/blog/',
          priority: 0.7,
          changefreq: 'weekly'
        },
        {
          pattern: '^/agri-pv/',
          priority: 0.8,
          changefreq: 'weekly'
        }
      ],
      maxUrlsPerSitemap: 50000,
      lastGenerated: new Date(),
      active: true
    });
  }

  private scheduleSitemapGeneration(): void {
    // Sitemap-Generierung alle 24 Stunden
    this.sitemapInterval = setInterval(() => {
      this.performSitemapGeneration();
    }, 24 * 60 * 60 * 1000);

    // Initiale Generierung
    this.performSitemapGeneration();
  }

  private async performSitemapGeneration(): Promise<void> {
    try {
      // Sammle URLs aus verschiedenen Quellen
      await this.collectUrls();

      // Generiere Sitemaps
      await this.generateSitemaps();

      // Optimiere Sitemap-Struktur
      await this.optimizeSitemapStructure();

      // Validiere Sitemaps
      await this.validateSitemaps();

      // Aktualisiere Analytics
      this.updateSitemapAnalytics();

    } catch (error) {
      console.error('Failed to perform sitemap generation:', error);
    }
  }

  private async collectUrls(): Promise<void> {
    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      const urls: SitemapUrl[] = [];

      // Sammle Seiten-URLs
      if (config.types.includes('pages')) {
        const pageUrls = await this.collectPageUrls(config);
        urls.push(...pageUrls);
      }

      // Sammle Bilder-URLs
      if (config.types.includes('images')) {
        const imageUrls = await this.collectImageUrls(config);
        urls.push(...imageUrls);
      }

      // Sammle Video-URLs
      if (config.types.includes('videos')) {
        const videoUrls = await this.collectVideoUrls(config);
        urls.push(...videoUrls);
      }

      // Sammle News-URLs
      if (config.types.includes('news')) {
        const newsUrls = await this.collectNewsUrls(config);
        urls.push(...newsUrls);
      }

      this.sitemaps.set(configId, urls);
    }
  }

  private async collectPageUrls(config: SitemapConfiguration): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [];

    // Simuliere URL-Sammlung aus verschiedenen Quellen
    const mockPages = [
      { path: '/', lastmod: new Date().toISOString(), priority: 1.0, changefreq: 'daily' as const },
      { path: '/photovoltaik', lastmod: new Date(Date.now() - 86400000).toISOString(), priority: 0.9, changefreq: 'weekly' as const },
      { path: '/photovoltaik/hausdach', lastmod: new Date(Date.now() - 172800000).toISOString(), priority: 0.8, changefreq: 'weekly' as const },
      { path: '/standort/berlin', lastmod: new Date(Date.now() - 259200000).toISOString(), priority: 0.8, changefreq: 'monthly' as const },
      { path: '/standort/muenchen', lastmod: new Date(Date.now() - 259200000).toISOString(), priority: 0.8, changefreq: 'monthly' as const },
      { path: '/agri-pv/bayern', lastmod: new Date(Date.now() - 345600000).toISOString(), priority: 0.8, changefreq: 'monthly' as const },
      { path: '/blog/photovoltaik-trends-2024', lastmod: new Date(Date.now() - 604800000).toISOString(), priority: 0.7, changefreq: 'monthly' as const },
      { path: '/foerdermittel/kfw', lastmod: new Date(Date.now() - 86400000).toISOString(), priority: 0.8, changefreq: 'weekly' as const }
    ];

    for (const page of mockPages) {
      // Prüfe Include/Exclude Patterns
      const fullUrl = `${config.baseUrl}${page.path}`;
      if (this.shouldIncludeUrl(fullUrl, config)) {
        urls.push({
          loc: fullUrl,
          lastmod: page.lastmod,
          changefreq: page.changefreq,
          priority: page.priority
        });
      }
    }

    return urls;
  }

  private async collectImageUrls(config: SitemapConfiguration): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [];

    // Simuliere Bild-URL-Sammlung
    const mockImages = [
      {
        pageUrl: 'https://zoe-solar.de/photovoltaik',
        images: [
          {
            loc: 'https://zoe-solar.de/images/photovoltaik-system.jpg',
            caption: 'Moderne Photovoltaik-Anlage auf einem Einfamilienhaus',
            title: 'Photovoltaik System Installation'
          }
        ]
      },
      {
        pageUrl: 'https://zoe-solar.de/agri-pv',
        images: [
          {
            loc: 'https://zoe-solar.de/images/agri-pv-feld.jpg',
            caption: 'Agri-Photovoltaik Anlage auf landwirtschaftlichem Feld',
            title: 'Agri-PV Feldinstallation'
          }
        ]
      }
    ];

    for (const imageData of mockImages) {
      if (this.shouldIncludeUrl(imageData.pageUrl, config)) {
        urls.push({
          loc: imageData.pageUrl,
          images: imageData.images,
          changefreq: 'weekly',
          priority: 0.6
        });
      }
    }

    return urls;
  }

  private async collectVideoUrls(config: SitemapConfiguration): Promise<SitemapUrl[]> {
    // Simuliere Video-URLs (falls vorhanden)
    return [];
  }

  private async collectNewsUrls(config: SitemapConfiguration): Promise<SitemapUrl[]> {
    // Simuliere News-URLs für Blog-Posts
    const urls: SitemapUrl[] = [];

    const mockNews = [
      {
        loc: 'https://zoe-solar.de/blog/photovoltaik-trends-2024',
        news: {
          publication: {
            name: 'ZOE Solar Blog',
            language: 'de'
          },
          publication_date: new Date(Date.now() - 604800000).toISOString(),
          title: 'Photovoltaik Trends 2024: Was kommt auf uns zu?'
        }
      }
    ];

    for (const news of mockNews) {
      if (this.shouldIncludeUrl(news.loc, config)) {
        urls.push({
          loc: news.loc,
          news: news.news,
          changefreq: 'monthly',
          priority: 0.7
        });
      }
    }

    return urls;
  }

  private shouldIncludeUrl(url: string, config: SitemapConfiguration): boolean {
    // Prüfe Exclude Patterns
    for (const pattern of config.excludePatterns) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(url)) {
        return false;
      }
    }

    // Prüfe Include Patterns
    for (const pattern of config.includePatterns) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(url.replace(config.baseUrl, ''))) {
        return true;
      }
    }

    return false;
  }

  private async generateSitemaps(): Promise<void> {
    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      const urls = this.sitemaps.get(configId) || [];

      if (urls.length <= config.maxUrlsPerSitemap) {
        // Einzelne Sitemap
        const sitemapIndex: SitemapIndex = {
          sitemaps: [{
            loc: `${config.baseUrl}/sitemap.xml`,
            lastmod: new Date().toISOString()
          }]
        };
        this.sitemapIndices.set(configId, sitemapIndex);
      } else {
        // Mehrere Sitemaps mit Index
        const chunks = this.chunkArray(urls, config.maxUrlsPerSitemap);
        const sitemaps = chunks.map((chunk, index) => ({
          loc: `${config.baseUrl}/sitemap-${index + 1}.xml`,
          lastmod: new Date().toISOString()
        }));

        const sitemapIndex: SitemapIndex = { sitemaps };
        this.sitemapIndices.set(configId, sitemapIndex);
      }

      config.lastGenerated = new Date();
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async optimizeSitemapStructure(): Promise<void> {
    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      const urls = this.sitemaps.get(configId) || [];
      const optimizedUrls = [...urls];

      // Wende Priority Rules an
      for (const rule of config.priorityRules) {
        const regex = new RegExp(rule.pattern);
        optimizedUrls.forEach(url => {
          if (regex.test(url.loc.replace(config.baseUrl, ''))) {
            url.priority = rule.priority;
            url.changefreq = rule.changefreq;
          }
        });
      }

      // Sortiere nach Priorität (höchste zuerst)
      optimizedUrls.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      this.sitemaps.set(configId, optimizedUrls);
    }
  }

  private async validateSitemaps(): Promise<void> {
    for (const [configId, urls] of this.sitemaps) {
      // Validiere URL-Format
      urls.forEach(url => {
        if (!url.loc.startsWith('http')) {
          console.warn(`Invalid URL format: ${url.loc}`);
        }

        // Validiere Priority
        if (url.priority && (url.priority < 0 || url.priority > 1)) {
          console.warn(`Invalid priority for ${url.loc}: ${url.priority}`);
          url.priority = Math.max(0, Math.min(1, url.priority));
        }
      });
    }
  }

  private updateSitemapAnalytics(): void {
    let totalUrls = 0;
    let totalSitemaps = 0;

    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      const urls = this.sitemaps.get(configId) || [];
      totalUrls += urls.length;

      const index = this.sitemapIndices.get(configId);
      if (index) {
        totalSitemaps += index.sitemaps.length;
      }
    }

    this.analytics.totalUrls = totalUrls;
    this.analytics.totalSitemaps = totalSitemaps;
    this.analytics.coverageRate = totalUrls > 0 ? (this.analytics.indexedUrls / totalUrls) : 0;

    // Simuliere Search Console Daten
    this.analytics.searchConsoleData = {
      submitted: totalUrls,
      indexed: Math.floor(totalUrls * 0.85),
      errors: Math.floor(totalUrls * 0.02)
    };

    this.analytics.indexedUrls = this.analytics.searchConsoleData.indexed;
  }

  // ===== PUBLIC API =====

  public getSitemapXml(configId: string, sitemapIndex?: number): string {
    const config = this.configurations.get(configId);
    if (!config) return this.generateErrorSitemap('Configuration not found');

    const urls = this.sitemaps.get(configId);
    if (!urls) return this.generateErrorSitemap('No URLs found');

    if (sitemapIndex !== undefined) {
      // Einzelne Sitemap aus Index
      const index = this.sitemapIndices.get(configId);
      if (!index || !index.sitemaps[sitemapIndex]) {
        return this.generateErrorSitemap('Sitemap not found');
      }

      const chunkSize = config.maxUrlsPerSitemap;
      const startIndex = sitemapIndex * chunkSize;
      const endIndex = startIndex + chunkSize;
      const chunkUrls = urls.slice(startIndex, endIndex);

      return this.generateSitemapXml(chunkUrls);
    } else {
      // Haupt-Sitemap oder einzelne Sitemap
      if (urls.length <= config.maxUrlsPerSitemap) {
        return this.generateSitemapXml(urls);
      } else {
        // Sitemap Index
        const index = this.sitemapIndices.get(configId);
        return index ? this.generateSitemapIndexXml(index) : this.generateErrorSitemap('Sitemap index not found');
      }
    }
  }

  private generateSitemapXml(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

    // Erweitere Namensräume für verschiedene Typen
    const hasImages = urls.some(url => url.images);
    const hasVideos = urls.some(url => url.videos);
    const hasNews = urls.some(url => url.news);

    if (hasImages) xml += '\n         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
    if (hasVideos) xml += '\n         xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
    if (hasNews) xml += '\n         xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"';

    xml += '>\n';

    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;

      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      // Bilder
      if (url.images) {
        for (const image of url.images) {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${this.escapeXml(image.loc)}</image:loc>\n`;
          if (image.caption) {
            xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
          }
          if (image.title) {
            xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
          }
          xml += '    </image:image>\n';
        }
      }

      // Videos
      if (url.videos) {
        for (const video of url.videos) {
          xml += '    <video:video>\n';
          xml += `      <video:thumbnail_loc>${this.escapeXml(video.thumbnail_loc)}</video:thumbnail_loc>\n`;
          xml += `      <video:title>${this.escapeXml(video.title)}</video:title>\n`;
          xml += `      <video:description>${this.escapeXml(video.description)}</video:description>\n`;
          if (video.content_loc) {
            xml += `      <video:content_loc>${this.escapeXml(video.content_loc)}</video:content_loc>\n`;
          }
          if (video.duration) {
            xml += `      <video:duration>${video.duration}</video:duration>\n`;
          }
          xml += '    </video:video>\n';
        }
      }

      // News
      if (url.news) {
        xml += '    <news:news>\n';
        xml += '      <news:publication>\n';
        xml += `        <news:name>${this.escapeXml(url.news.publication.name)}</news:name>\n`;
        xml += `        <news:language>${url.news.publication.language}</news:language>\n`;
        xml += '      </news:publication>\n';
        xml += `      <news:publication_date>${url.news.publication_date}</news:publication_date>\n`;
        xml += `      <news:title>${this.escapeXml(url.news.title)}</news:title>\n`;
        xml += '    </news:news>\n';
      }

      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  private generateSitemapIndexXml(index: SitemapIndex): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const sitemap of index.sitemaps) {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(sitemap.loc)}</loc>\n`;
      if (sitemap.lastmod) {
        xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
      }
      xml += '  </sitemap>\n';
    }

    xml += '</sitemapindex>';
    return xml;
  }

  private generateErrorSitemap(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>${this.escapeXml(message)}</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '<';
        case '>': return '>';
        case '&': return '&';
        case '\'': return '&apos;';
        case '"': return '"';
        default: return c;
      }
    });
  }

  public getConfiguration(configId: string): SitemapConfiguration | null {
    return this.configurations.get(configId) || null;
  }

  public getAllConfigurations(): SitemapConfiguration[] {
    return Array.from(this.configurations.values());
  }

  public getSitemapAnalytics(): SitemapAnalytics {
    return { ...this.analytics };
  }

  public async createConfiguration(config: Omit<SitemapConfiguration, 'id' | 'lastGenerated'>): Promise<string> {
    const id = `sitemap-${config.domain}-${Date.now()}`;
    const newConfig: SitemapConfiguration = {
      ...config,
      id,
      lastGenerated: new Date()
    };

    this.configurations.set(id, newConfig);
    return id;
  }

  public async updateConfiguration(configId: string, updates: Partial<SitemapConfiguration>): Promise<void> {
    const existing = this.configurations.get(configId);
    if (!existing) throw new Error(`Configuration ${configId} not found`);

    this.configurations.set(configId, { ...existing, ...updates });
  }

  public async addUrlsToSitemap(configId: string, urls: SitemapUrl[]): Promise<void> {
    const existing = this.sitemaps.get(configId) || [];
    this.sitemaps.set(configId, [...existing, ...urls]);
  }

  public async removeUrlsFromSitemap(configId: string, urlPatterns: string[]): Promise<void> {
    const existing = this.sitemaps.get(configId) || [];
    const filtered = existing.filter(url =>
      !urlPatterns.some(pattern => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(url.loc);
      })
    );
    this.sitemaps.set(configId, filtered);
  }

  public getOptimizationRecommendations(configId: string): SitemapOptimization | null {
    return this.optimizations.get(configId) || null;
  }

  public getAllSitemaps(): Record<string, SitemapUrl[]> {
    const result: Record<string, SitemapUrl[]> = {};
    for (const [configId, urls] of this.sitemaps.entries()) {
      result[configId] = [...urls];
    }
    return result;
  }

  public stopSitemapGeneration(): void {
    if (this.sitemapInterval) {
      clearInterval(this.sitemapInterval);
      this.sitemapInterval = undefined;
    }
  }

  public startSitemapGeneration(): void {
    if (!this.sitemapInterval) {
      this.scheduleSitemapGeneration();
    }
  }
}

export const automatedSitemapService = AutomatedSitemapService.getInstance();
export default automatedSitemapService;