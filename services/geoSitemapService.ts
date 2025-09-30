import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';

export interface GeoSitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };
  images?: Array<{
    url: string;
    caption?: string;
    geoLocation?: string;
    title?: string;
  }>;
  videos?: Array<{
    url: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    duration?: number;
  }>;
  alternateLanguages?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface LocalSitemapIndex {
  location: string;
  sitemapUrl: string;
  urlCount: number;
  lastUpdated: string;
  geoData: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
}

/**
 * GEO-Optimized Sitemap Service
 * Generiert lokalisierte Sitemaps mit Geo-Informationen für bessere lokale SEO-Performance
 */
export class GeoSitemapService {
  private baseUrl = 'https://www.zoe-solar.de';
  private sitemapEntries: Map<string, GeoSitemapEntry[]> = new Map();
  private localSitemapIndex: LocalSitemapIndex[] = [];

  constructor() {
    this.generateAllLocalSitemaps();
  }

  /**
   * Generiert alle lokalen Sitemaps für alle Service-Regionen
   */
  private generateAllLocalSitemaps(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const entries = this.generateLocationSitemap(region);
      this.sitemapEntries.set(region.city.toLowerCase(), entries);
      
      this.localSitemapIndex.push({
        location: region.city,
        sitemapUrl: `${this.baseUrl}/sitemaps/local-${region.city.toLowerCase()}.xml`,
        urlCount: entries.length,
        lastUpdated: new Date().toISOString(),
        geoData: {
          latitude: region.latitude,
          longitude: region.longitude,
          radiusKm: region.radiusKm
        }
      });
    });
  }

  /**
   * Generiert Sitemap-Einträge für eine spezifische Region
   */
  private generateLocationSitemap(region: ServiceRegion): GeoSitemapEntry[] {
    const entries: GeoSitemapEntry[] = [];
    const citySlug = region.city.toLowerCase();
    const today = new Date().toISOString();

    // Hauptstandortseite
    entries.push({
      url: `${this.baseUrl}/standort/${citySlug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
        city: region.city,
        state: region.state
      },
      images: [
        {
          url: `${this.baseUrl}/images/standort-${citySlug}-hero.jpg`,
          caption: `ZOE Solar Standort ${region.city}`,
          geoLocation: `${region.city}, ${region.state}`,
          title: `Photovoltaik ${region.city}`
        },
        {
          url: `${this.baseUrl}/images/team-${citySlug}.jpg`,
          caption: `Unser Team in ${region.city}`,
          geoLocation: `${region.city}, ${region.state}`,
          title: `ZOE Solar Team ${region.city}`
        }
      ],
      alternateLanguages: [
        { hreflang: 'de', href: `${this.baseUrl}/standort/${citySlug}` },
        { hreflang: 'en', href: `${this.baseUrl}/en/locations/${citySlug}` }
      ]
    });

    // Service-Seiten für die Region
    const services = [
      'photovoltaik',
      'batteriespeicher',
      'wartung',
      'monitoring',
      'beratung'
    ];

    services.forEach(service => {
      entries.push({
        url: `${this.baseUrl}/service/${service}/${citySlug}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          city: region.city,
          state: region.state
        },
        images: [
          {
            url: `${this.baseUrl}/images/${service}-${citySlug}.jpg`,
            caption: `${service} Service in ${region.city}`,
            geoLocation: `${region.city}, ${region.state}`,
            title: `${service} ${region.city}`
          }
        ]
      });
    });

    // Anwendungsfall-Seiten (Eigenheim, Gewerbe, Agri-PV)
    const useCases = [
      { slug: 'eigenheim', priority: 0.85 },
      { slug: 'gewerbe', priority: 0.8 },
      { slug: 'agri-pv', priority: 0.75 }
    ];

    useCases.forEach(useCase => {
      entries.push({
        url: `${this.baseUrl}/${useCase.slug}/${citySlug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: useCase.priority,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          city: region.city,
          state: region.state
        },
        images: [
          {
            url: `${this.baseUrl}/images/${useCase.slug}-${citySlug}-1.jpg`,
            caption: `${useCase.slug} Photovoltaik in ${region.city}`,
            geoLocation: `${region.city}, ${region.state}`,
            title: `${useCase.slug} PV ${region.city}`
          }
        ]
      });
    });

    // Lokale Blog-Posts und Guides
    const contentTypes = [
      'solaranlage-ratgeber',
      'foerderung-guide',
      'kosten-rechner',
      'wartung-tipps'
    ];

    contentTypes.forEach(content => {
      entries.push({
        url: `${this.baseUrl}/ratgeber/${content}-${citySlug}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          city: region.city,
          state: region.state
        }
      });
    });

    // Referenzprojekte in der Region
    for (let i = 1; i <= 5; i++) {
      entries.push({
        url: `${this.baseUrl}/projekte/${citySlug}/projekt-${i}`,
        lastmod: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        changefreq: 'yearly',
        priority: 0.6,
        location: {
          latitude: region.latitude + (Math.random() - 0.5) * 0.1,
          longitude: region.longitude + (Math.random() - 0.5) * 0.1,
          city: region.city,
          state: region.state
        },
        images: [
          {
            url: `${this.baseUrl}/images/projekt-${citySlug}-${i}-vorher.jpg`,
            caption: `Projekt ${i} in ${region.city} - Vorher`,
            geoLocation: `${region.city}, ${region.state}`,
            title: `Referenz ${i} ${region.city}`
          },
          {
            url: `${this.baseUrl}/images/projekt-${citySlug}-${i}-nachher.jpg`,
            caption: `Projekt ${i} in ${region.city} - Nachher`,
            geoLocation: `${region.city}, ${region.state}`,
            title: `Solaranlage Projekt ${i} ${region.city}`
          }
        ]
      });
    }

    // FAQ-Seiten mit lokalen Fragen
    entries.push({
      url: `${this.baseUrl}/faq/${citySlug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.65,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
        city: region.city,
        state: region.state
      }
    });

    // Kontakt-Seite für die Region
    entries.push({
      url: `${this.baseUrl}/kontakt/${citySlug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
        city: region.city,
        state: region.state
      }
    });

    return entries;
  }

  /**
   * Generiert XML-Sitemap für eine spezifische Region
   */
  public generateLocalSitemapXML(locationKey: string): string {
    const entries = this.sitemapEntries.get(locationKey);
    if (!entries) {
      throw new Error(`Keine Sitemap-Einträge für ${locationKey} gefunden`);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
    xml += '        xmlns:geo="http://www.google.com/geo/schemas/sitemap/1.0"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;

      // Geo-Informationen hinzufügen
      if (entry.location) {
        xml += `    <geo:geo>\n`;
        xml += `      <geo:format>kml</geo:format>\n`;
        xml += `      <geo:title>${this.escapeXml(entry.location.city + ', ' + entry.location.state)}</geo:title>\n`;
        xml += `      <geo:publication_date>${entry.lastmod}</geo:publication_date>\n`;
        xml += `    </geo:geo>\n`;
      }

      // Bilder hinzufügen
      if (entry.images) {
        entry.images.forEach(image => {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
          if (image.caption) {
            xml += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
          }
          if (image.geoLocation) {
            xml += `      <image:geo_location>${this.escapeXml(image.geoLocation)}</image:geo_location>\n`;
          }
          if (image.title) {
            xml += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
          }
          xml += `    </image:image>\n`;
        });
      }

      // Videos hinzufügen
      if (entry.videos) {
        entry.videos.forEach(video => {
          xml += `    <video:video>\n`;
          xml += `      <video:thumbnail_loc>${this.escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>\n`;
          xml += `      <video:title>${this.escapeXml(video.title)}</video:title>\n`;
          xml += `      <video:description>${this.escapeXml(video.description)}</video:description>\n`;
          xml += `      <video:content_loc>${this.escapeXml(video.url)}</video:content_loc>\n`;
          if (video.duration) {
            xml += `      <video:duration>${video.duration}</video:duration>\n`;
          }
          xml += `    </video:video>\n`;
        });
      }

      // Alternative Sprachen hinzufügen
      if (entry.alternateLanguages) {
        entry.alternateLanguages.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(alt.href)}" />\n`;
        });
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generiert Master-Sitemap-Index für alle lokalen Sitemaps
   */
  public generateGeoSitemapIndex(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Haupt-Sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemap.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Lokale Sitemaps
    this.localSitemapIndex.forEach(index => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.escapeXml(index.sitemapUrl)}</loc>\n`;
      xml += `    <lastmod>${index.lastUpdated}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Generiert News-Sitemap für lokale Nachrichten und Updates
   */
  public generateLocalNewsSitemap(locationKey: string): string {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) {
      throw new Error(`Region ${locationKey} nicht gefunden`);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    // Beispiel-News-Einträge
    const newsItems = [
      {
        url: `${this.baseUrl}/news/neue-foerderung-${locationKey}-2024`,
        title: `Neue Photovoltaik-Förderung in ${region.city} verfügbar`,
        publishDate: new Date().toISOString(),
        keywords: `Förderung, Photovoltaik, ${region.city}, Solar, Zuschuss`
      },
      {
        url: `${this.baseUrl}/news/agri-pv-projekt-${locationKey}`,
        title: `Großes Agri-PV-Projekt in ${region.state} gestartet`,
        publishDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        keywords: `Agri-PV, ${region.state}, Landwirtschaft, Solar, Innovation`
      }
    ];

    newsItems.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(item.url)}</loc>\n`;
      xml += '    <news:news>\n';
      xml += '      <news:publication>\n';
      xml += '        <news:name>ZOE Solar News</news:name>\n';
      xml += '        <news:language>de</news:language>\n';
      xml += '      </news:publication>\n';
      xml += `      <news:publication_date>${item.publishDate}</news:publication_date>\n`;
      xml += `      <news:title>${this.escapeXml(item.title)}</news:title>\n`;
      xml += `      <news:keywords>${this.escapeXml(item.keywords)}</news:keywords>\n`;
      xml += '    </news:news>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generiert Mobile-Sitemap mit lokalen Optimierungen
   */
  public generateMobileSitemap(locationKey: string): string {
    const entries = this.sitemapEntries.get(locationKey);
    if (!entries) {
      throw new Error(`Keine Sitemap-Einträge für ${locationKey} gefunden`);
    }

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">\n';

    // Nur die wichtigsten Seiten für Mobile
    const mobileEntries = entries.filter(entry => 
      entry.priority >= 0.7 || 
      entry.url.includes('/kontakt/') ||
      entry.url.includes('/standort/')
    );

    mobileEntries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;
      xml += '    <mobile:mobile/>\n';
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Aktualisiert Sitemap-Einträge für eine Region
   */
  public updateLocationSitemap(locationKey: string, newEntries: GeoSitemapEntry[]): void {
    this.sitemapEntries.set(locationKey, newEntries);
    
    // Index aktualisieren
    const indexEntry = this.localSitemapIndex.find(index => 
      index.location.toLowerCase() === locationKey.toLowerCase()
    );
    if (indexEntry) {
      indexEntry.urlCount = newEntries.length;
      indexEntry.lastUpdated = new Date().toISOString();
    }
  }

  /**
   * Fügt neue URL zu einer lokalen Sitemap hinzu
   */
  public addUrlToLocationSitemap(locationKey: string, entry: GeoSitemapEntry): void {
    const existingEntries = this.sitemapEntries.get(locationKey) || [];
    
    // Prüfen ob URL bereits existiert
    const existingIndex = existingEntries.findIndex(e => e.url === entry.url);
    if (existingIndex !== -1) {
      existingEntries[existingIndex] = entry; // Update
    } else {
      existingEntries.push(entry); // Add new
    }
    
    this.updateLocationSitemap(locationKey, existingEntries);
  }

  /**
   * Entfernt URL aus lokaler Sitemap
   */
  public removeUrlFromLocationSitemap(locationKey: string, url: string): void {
    const existingEntries = this.sitemapEntries.get(locationKey) || [];
    const filteredEntries = existingEntries.filter(entry => entry.url !== url);
    this.updateLocationSitemap(locationKey, filteredEntries);
  }

  /**
   * Abrufen aller Sitemap-Einträge für eine Region
   */
  public getLocationSitemapEntries(locationKey: string): GeoSitemapEntry[] {
    return this.sitemapEntries.get(locationKey) || [];
  }

  /**
   * Abrufen des Sitemap-Index
   */
  public getLocalSitemapIndex(): LocalSitemapIndex[] {
    return this.localSitemapIndex;
  }

  /**
   * Statistiken für alle lokalen Sitemaps
   */
  public getSitemapStatistics(): {
    totalLocations: number;
    totalUrls: number;
    averageUrlsPerLocation: number;
    lastUpdated: string;
    topLocations: Array<{location: string, urlCount: number}>;
  } {
    const totalUrls = Array.from(this.sitemapEntries.values())
      .reduce((sum, entries) => sum + entries.length, 0);
    
    const topLocations = this.localSitemapIndex
      .sort((a, b) => b.urlCount - a.urlCount)
      .slice(0, 5)
      .map(index => ({
        location: index.location,
        urlCount: index.urlCount
      }));

    return {
      totalLocations: this.localSitemapIndex.length,
      totalUrls,
      averageUrlsPerLocation: Math.round(totalUrls / this.localSitemapIndex.length),
      lastUpdated: new Date().toISOString(),
      topLocations
    };
  }

  /**
   * XML-Escape-Funktion
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Automatische Sitemap-Generierung für alle Regionen
   */
  public generateAllSitemapFiles(): { [key: string]: string } {
    const sitemapFiles: { [key: string]: string } = {};

    // Master-Index
    sitemapFiles['geo-sitemap-index.xml'] = this.generateGeoSitemapIndex();

    // Lokale Sitemaps
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      sitemapFiles[`local-${locationKey}.xml`] = this.generateLocalSitemapXML(locationKey);
      sitemapFiles[`news-${locationKey}.xml`] = this.generateLocalNewsSitemap(locationKey);
      sitemapFiles[`mobile-${locationKey}.xml`] = this.generateMobileSitemap(locationKey);
    });

    return sitemapFiles;
  }
}

// Singleton-Instanz für globale Verwendung
export const geoSitemapService = new GeoSitemapService();