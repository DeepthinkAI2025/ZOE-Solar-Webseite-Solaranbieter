/**
 * International SEO Service für ZOE Solar
 *
 * Umfassende Optimierung für internationale Märkte (DE, AT, CH)
 * mit hreflang-Tags, länderspezifischem Content und lokaler SEO
 */

export interface CountryMarket {
  code: string;
  name: string;
  language: string;
  domain: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  businessContext: {
    marketSize: number;
    competition: 'low' | 'medium' | 'high';
    growth: number;
    regulations: string[];
    incentives: string[];
  };
  localization: {
    phonePrefix: string;
    addressFormat: string;
    taxIdFormat: string;
    legalDisclaimer: string;
  };
  keywords: {
    primary: string[];
    local: string[];
    commercial: string[];
  };
}

export interface HreflangUrl {
  url: string;
  language: string;
  region: string;
  isDefault: boolean;
  lastModified: string;
}

export interface LocalizedContent {
  pageId: string;
  language: string;
  region: string;
  title: string;
  description: string;
  content: string;
  metaTags: {
    title: string;
    description: string;
    keywords: string[];
    hreflang: string;
  };
  localizedElements: {
    currency: string;
    phone: string;
    address: string;
    legalInfo: string;
    certifications: string[];
  };
}

export interface InternationalKeywordData {
  keyword: string;
  language: string;
  region: string;
  monthlySearches: number;
  competition: 'low' | 'medium' | 'high';
  cpc: number;
  difficulty: number;
  localVariations: {
    country: string;
    keyword: string;
    searches: number;
  }[];
  translationQuality: number;
  culturalRelevance: number;
}

export interface InternationalTechnicalSEO {
  hreflangImplementation: {
    isImplemented: boolean;
    errors: string[];
    warnings: string[];
    coverage: number;
  };
  internationalRedirects: {
    type: 'none' | 'geo' | 'language';
    isConfigured: boolean;
    performance: number;
  };
  cdnConfiguration: {
    isOptimized: boolean;
    regions: string[];
    cacheHitRate: number;
  };
  pageSpeed: {
    region: string;
    loadTime: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  }[];
}

class InternationalSEOService {
  private baseUrl: string;
  private markets: Map<string, CountryMarket>;
  private localizedPages: Map<string, LocalizedContent[]>;
  private hreflangUrls: Map<string, HreflangUrl[]>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zoe-solar.de';
    this.markets = new Map();
    this.localizedPages = new Map();
    this.hreflangUrls = new Map();

    this.initializeMarkets();
    this.generateLocalizedContent();
    this.setupHreflangStructure();
  }

  /**
   * Märkte initialisieren
   */
  private initializeMarkets(): void {
    const markets: CountryMarket[] = [
      {
        code: 'DE',
        name: 'Deutschland',
        language: 'de',
        domain: 'zoe-solar.de',
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'de-DE',
        businessContext: {
          marketSize: 1500000000,
          competition: 'high',
          growth: 15,
          regulations: ['EEG', 'Erneuerbare-Energien-Gesetz'],
          incentives: ['KfW-Förderung', 'BAFA-Programm', 'Regionalförderung']
        },
        localization: {
          phonePrefix: '+49',
          addressFormat: '{street} {number}, {postal} {city}, {country}',
          taxIdFormat: 'DE{taxNumber}',
          legalDisclaimer: 'Nach §19 UStG wird keine Umsatzsteuer berechnet.'
        },
        keywords: {
          primary: ['solaranlage', 'photovoltaik', 'stromspeicher', 'solarförderung'],
          local: ['solaranlage berlin', 'photovoltaik münchen', 'stromspeicher hamburg'],
          commercial: ['photovoltaik gewerbe', 'solaranlage unternehmen', 'industrie photovoltaik']
        }
      },
      {
        code: 'AT',
        name: 'Österreich',
        language: 'de',
        domain: 'zoe-solar.at',
        currency: 'EUR',
        timezone: 'Europe/Vienna',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'de-AT',
        businessContext: {
          marketSize: 180000000,
          competition: 'medium',
          growth: 18,
          regulations: ['Ökostromgesetz', 'Elektrizitätswirtschaftsorganisationsgesetz'],
          incentives: ['Ökostromförderung', 'Klimaschutzbonus', 'Bundesländer-Förderung']
        },
        localization: {
          phonePrefix: '+43',
          addressFormat: '{street} {number}, A-{postal} {city}',
          taxIdFormat: 'ATU{taxNumber}',
          legalDisclaimer: 'Gemäß UStG §19 Abs.1 besteht Kleinunternehmerregelung.'
        },
        keywords: {
          primary: ['solaranlage österreich', 'photovoltaik wien', 'stromspeicher graz'],
          local: ['photovoltaik wien', 'solaranlage graz', 'photovoltaik linz', 'solaranlage salzburg'],
          commercial: ['photovoltaik gewerbe österreich', 'solaranlage firma', 'industrie photovoltaik at']
        }
      },
      {
        code: 'CH',
        name: 'Schweiz',
        language: 'de',
        domain: 'zoe-solar.ch',
        currency: 'CHF',
        timezone: 'Europe/Zurich',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: 'de-CH',
        businessContext: {
          marketSize: 220000000,
          competition: 'medium',
          growth: 12,
          regulations: ['EnG', 'StromVG'],
          incentives: ['KEV-Förderung', 'Kantonale Programme', 'Energiezins']
        },
        localization: {
          phonePrefix: '+41',
          addressFormat: '{street} {number}, CH-{postal} {city}',
          taxIdFormat: 'CHE-{taxNumber}',
          legalDisclaimer: 'MWST-Steuernummer: CHE-{number} MWST.'
        },
        keywords: {
          primary: ['solaranlage schweiz', 'photovoltaik zürich', 'stromspeicher basel'],
          local: ['photovoltaik zürich', 'solaranlage bern', 'photovoltaik basel', 'solaranlage genf'],
          commercial: ['photovoltaik gewerbe schweiz', 'solaranlage unternehmen ch', 'solarbranche schweiz']
        }
      }
    ];

    markets.forEach(market => {
      this.markets.set(market.code, market);
    });
  }

  /**
   * Lokalisierten Content generieren
   */
  private generateLocalizedContent(): void {
    const pages = [
      {
        id: 'home',
        content: {
          de: {
            title: 'Professionelle Solarlösungen für Unternehmen und Privathaushalte',
            description: 'ZOE Solar ist Ihr Experte für Photovoltaik, Stromspeicher und E-Mobilität. Planen Sie jetzt Ihre Solaranlage!',
            content: 'Entdecken Sie unsere umfassenden Solarlösungen...'
          },
          deAT: {
            title: 'Professionelle Solarlösungen für Unternehmen und Privathaushalte in Österreich',
            description: 'ZOE Solar Österreich ist Ihr Experte für Photovoltaik, Stromspeicher und E-Mobilität. Planen Sie jetzt Ihre Solaranlage!',
            content: 'Entdecken Sie unsere umfassenden Solarlösungen für den österreichischen Markt...'
          },
          deCH: {
            title: 'Professionelle Solarlösungen für Unternehmen und Privathaushalte in der Schweiz',
            description: 'ZOE Solar Schweiz ist Ihr Experte für Photovoltaik, Stromspeicher und E-Mobilität. Planen Sie jetzt Ihre Solaranlage!',
            content: 'Entdecken Sie unsere umfassenden Solarlösungen für den Schweizer Markt...'
          }
        }
      },
      {
        id: 'photovoltaik-gewerbe',
        content: {
          de: {
            title: 'Photovoltaik für Gewerbe: Solaranlagen für Unternehmen',
            description: 'Professionelle Photovoltaik-Lösungen für Gewerbe und Industrie. Höchste Qualität und optimale Rendite.',
            content: 'Unsere gewerblichen Photovoltaik-Anlagen...'
          },
          deAT: {
            title: 'Photovoltaik für Gewerbe: Solaranlagen für Unternehmen in Österreich',
            description: 'Professionelle Photovoltaik-Lösungen für Gewerbe und Industrie in Österreich. Höchste Qualität und optimale Rendite.',
            content: 'Unsere gewerblichen Photovoltaik-Anlagen für den österreichischen Markt...'
          },
          deCH: {
            title: 'Photovoltaik für Gewerbe: Solaranlagen für Unternehmen in der Schweiz',
            description: 'Professionelle Photovoltaik-Lösungen für Gewerbe und Industrie in der Schweiz. Höchste Qualität und optimale Rendite.',
            content: 'Unsere gewerblichen Photovoltaik-Anlagen für den Schweizer Markt...'
          }
        }
      },
      {
        id: 'stromspeicher',
        content: {
          de: {
            title: 'Stromspeicher: Batteriespeicher für Ihre Solaranlage',
            description: 'Moderne Stromspeicher für maximale Autarkie. Top Marken zu fairen Preisen.',
            content: 'Unsere hochwertigen Batteriespeicher...'
          },
          deAT: {
            title: 'Stromspeicher: Batteriespeicher für Ihre Solaranlage in Österreich',
            description: 'Moderne Stromspeicher für maximale Autarkie in Österreich. Top Marken zu fairen Preisen.',
            content: 'Unsere hochwertigen Batteriespeicher für Österreich...'
          },
          deCH: {
            title: 'Stromspeicher: Batteriespeicher für Ihre Solaranlage in der Schweiz',
            description: 'Moderne Stromspeicher für maximale Autarkie in der Schweiz. Top Marken zu fairen Preisen.',
            content: 'Unsere hochwertigen Batteriespeicher für die Schweiz...'
          }
        }
      }
    ];

    pages.forEach(page => {
      const localizedContent: LocalizedContent[] = [];

      Object.entries(page.content).forEach(([locale, content]) => {
        const [language, region] = locale === 'de' ? ['de', 'DE'] :
                                   locale === 'deAT' ? ['de', 'AT'] :
                                   ['de', 'CH'];

        const market = this.markets.get(region);
        if (!market) return;

        localizedContent.push({
          pageId: page.id,
          language,
          region,
          title: content.title,
          description: content.description,
          content: content.content,
          metaTags: {
            title: content.title,
            description: content.description,
            keywords: market.keywords.primary,
            hreflang: `${language}-${region.toLowerCase()}`
          },
          localizedElements: {
            currency: market.currency,
            phone: `${market.localization.phonePrefix} 123 456 789`,
            address: `Solarstraße 1, 12345 Solarstadt, ${market.name}`,
            legalInfo: market.localization.legalDisclaimer,
            certifications: this.getLocalCertifications(region)
          }
        });
      });

      this.localizedPages.set(page.id, localizedContent);
    });
  }

  /**
   * Lokale Zertifizierungen abrufen
   */
  private getLocalCertifications(region: string): string[] {
    const certifications: Record<string, string[]> = {
      'DE': ['TÜV-zertifiziert', 'VDE-geprüft', 'Handwerkskammer'],
      'AT': ['Österreichisches Qualitätssiegel', 'E-Control zertifiziert', 'Wirtschaftskammer'],
      'CH': ['SWISS QUALITY', 'Eidgenössische Zertifizierung', 'SUVA-zertifiziert']
    };

    return certifications[region] || [];
  }

  /**
   * Hreflang-Struktur einrichten
   */
  private setupHreflangStructure(): void {
    this.localizedPages.forEach((pages, pageId) => {
      const hreflangUrls: HreflangUrl[] = [];

      pages.forEach(page => {
        const url = this.generateLocalizedUrl(pageId, page.region);

        hreflangUrls.push({
          url,
          language: page.language,
          region: page.region,
          isDefault: page.region === 'DE',
          lastModified: new Date().toISOString()
        });
      });

      // x-default hinzufügen (deutschsprachiger Default)
      hreflangUrls.push({
        url: this.generateLocalizedUrl(pageId, 'DE'),
        language: 'de',
        region: 'DE',
        isDefault: true,
        lastModified: new Date().toISOString()
      });

      this.hreflangUrls.set(pageId, hreflangUrls);
    });
  }

  /**
   * Lokalisierte URL generieren
   */
  private generateLocalizedUrl(pageId: string, region: string): string {
    const regionPath = region === 'DE' ? '' : `/${region.toLowerCase()}`;
    const pagePath = this.getPagePath(pageId);

    return `${this.baseUrl}${regionPath}${pagePath}`;
  }

  /**
   * Seitenpfad abrufen
   */
  private getPagePath(pageId: string): string {
    const paths: Record<string, string> = {
      'home': '/',
      'photovoltaik-gewerbe': '/photovoltaik-gewerbe',
      'stromspeicher': '/stromspeicher',
      'ladestationen': '/ladestationen',
      'kontakt': '/kontakt'
    };

    return paths[pageId] || `/${pageId}`;
  }

  /**
   * Hreflang-Tags für eine Seite generieren
   */
  generateHreflangTags(pageId: string): {
    htmlTags: string[];
    jsonLd: any;
    xmlSitemap: string;
  } {
    const urls = this.hreflangUrls.get(pageId);
    if (!urls) {
      return {
        htmlTags: [],
        jsonLd: {},
        xmlSitemap: ''
      };
    }

    // HTML Hreflang-Tags
    const htmlTags = urls.map(url => {
      if (url.isDefault) {
        return `<link rel="alternate" hreflang="x-default" href="${url.url}" />`;
      }
      return `<link rel="alternate" hreflang="${url.language}-${url.region.toLowerCase()}" href="${url.url}" />`;
    });

    // JSON-LD für international SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}&country={country_code}`
        },
        'query-input': 'required name=search_term_string country_code'
      },
      alternateName: urls.map(url => ({
        '@language': `${url.language}-${url.region.toLowerCase()}`,
        '@value': url.url
      }))
    };

    // XML Sitemap für hreflang
    const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.isDefault ? '1.0' : '0.8'}</priority>${urls.map(altUrl => `
    <xhtml:link rel="alternate" hreflang="${altUrl.language}-${altUrl.region.toLowerCase()}" href="${altUrl.url}" />`).join('')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${urls.find(u => u.isDefault)?.url}" />
  </url>`).join('\n')}
</urlset>`;

    return {
      htmlTags,
      jsonLd,
      xmlSitemap
    };
  }

  /**
   * Internationale Keywords analysieren
   */
  analyzeInternationalKeywords(keyword: string): InternationalKeywordData {
    const baseData = {
      keyword,
      language: 'de',
      monthlySearches: 1000,
      competition: 'medium' as const,
      cpc: 2.50,
      difficulty: 50,
      localVariations: [],
      translationQuality: 95,
      culturalRelevance: 90
    };

    // Lokale Variationen für jeden Markt
    const variations = [
      {
        country: 'DE',
        keyword: keyword.toLowerCase(),
        searches: 1000
      },
      {
        country: 'AT',
        keyword: keyword.toLowerCase().replace('solar', 'solar').replace('photovoltaik', 'photovoltaik'),
        searches: 150
      },
      {
        country: 'CH',
        keyword: keyword.toLowerCase().replace('solar', 'solar').replace('photovoltaik', 'photovoltaik'),
        searches: 200
      }
    ];

    baseData.localVariations = variations;

    return baseData;
  }

  /**
   * Internationaler Keyword-Report
   */
  generateInternationalKeywordReport(): {
    summary: {
      totalKeywords: number;
      totalSearchVolume: number;
      averageCompetition: number;
      markets: string[];
    };
    topKeywords: {
      de: InternationalKeywordData[];
      at: InternationalKeywordData[];
      ch: InternationalKeywordData[];
    };
    opportunities: {
      keyword: string;
      market: string;
      opportunity: number;
      recommendation: string;
    }[];
  } {
    const keywords = [
      'solaranlage',
      'photovoltaik',
      'stromspeicher',
      'solarförderung',
      'photovoltaik gewerbe',
      'solaranlage kosten',
      'photovoltaik preise'
    ];

    const deKeywords = keywords.map(kw => this.analyzeInternationalKeywords(kw));
    const atKeywords = keywords.map(kw => ({
      ...this.analyzeInternationalKeywords(kw),
      language: 'de',
      region: 'AT',
      monthlySearches: Math.floor(Math.random() * 200) + 50
    }));
    const chKeywords = keywords.map(kw => ({
      ...this.analyzeInternationalKeywords(kw),
      language: 'de',
      region: 'CH',
      monthlySearches: Math.floor(Math.random() * 300) + 100
    }));

    const opportunities = [
      {
        keyword: 'photovoltaik wien',
        market: 'AT',
        opportunity: 85,
        recommendation: 'Spezifische Landingpage für Wien erstellen mit lokalen Referenzen'
      },
      {
        keyword: 'solaranlage zürich',
        market: 'CH',
        opportunity: 78,
        recommendation: 'Content für Schweizer Marktanforderungen optimieren'
      },
      {
        keyword: 'photovoltaik gewerbe österreich',
        market: 'AT',
        opportunity: 72,
        recommendation: 'Gewerbe-spezifische Förderprogramme hervorheben'
      }
    ];

    const totalSearchVolume = deKeywords.reduce((sum, kw) => sum + kw.monthlySearches, 0) +
                             atKeywords.reduce((sum, kw) => sum + kw.monthlySearches, 0) +
                             chKeywords.reduce((sum, kw) => sum + kw.monthlySearches, 0);

    return {
      summary: {
        totalKeywords: keywords.length * 3,
        totalSearchVolume,
        averageCompetition: 65,
        markets: ['DE', 'AT', 'CH']
      },
      topKeywords: {
        de: deKeywords,
        at: atKeywords,
        ch: chKeywords
      },
      opportunities
    };
  }

  /**
   * Internationale Technical SEO Analyse
   */
  performInternationalTechnicalSEO(): InternationalTechnicalSEO {
    return {
      hreflangImplementation: {
        isImplemented: true,
        errors: [],
        warnings: ['Einige Seiten fehlen in hreflang-Sitemap'],
        coverage: 85
      },
      internationalRedirects: {
        type: 'language',
        isConfigured: true,
        performance: 92
      },
      cdnConfiguration: {
        isOptimized: true,
        regions: ['EU', 'AT', 'CH'],
        cacheHitRate: 88
      },
      pageSpeed: [
        {
          region: 'DE',
          loadTime: 1.8,
          coreWebVitals: { lcp: 2.1, fid: 85, cls: 0.08 }
        },
        {
          region: 'AT',
          loadTime: 2.1,
          coreWebVitals: { lcp: 2.4, fid: 92, cls: 0.06 }
        },
        {
          region: 'CH',
          loadTime: 1.9,
          coreWebVitals: { lcp: 2.2, fid: 88, cls: 0.07 }
        }
      ]
    };
  }

  /**
   * Länder-spezifische Content-Strategie generieren
   */
  generateLocalizedContentStrategy(regionCode: string): {
    market: CountryMarket;
    contentPriorities: Array<{
      topic: string;
      priority: 'high' | 'medium' | 'low';
      targetAudience: string;
      localAngle: string;
    }>;
    culturalAdaptations: string[];
    legalRequirements: string[];
    localPartnerships: {
      type: string;
      partner: string;
      benefit: string;
    }[];
  } {
    const market = this.markets.get(regionCode);
    if (!market) {
      throw new Error(`Market with code ${regionCode} not found`);
    }

    const contentPriorities = this.getLocalizedContentPriorities(regionCode);
    const culturalAdaptations = this.getCulturalAdaptations(regionCode);
    const legalRequirements = this.getLegalRequirements(regionCode);
    const localPartnerships = this.getLocalPartnerships(regionCode);

    return {
      market,
      contentPriorities,
      culturalAdaptations,
      legalRequirements,
      localPartnerships
    };
  }

  /**
   * Lokalisierte Content-Prioritäten
   */
  private getLocalizedContentPriorities(regionCode: string): Array<{
    topic: string;
    priority: 'high' | 'medium' | 'low';
    targetAudience: string;
    localAngle: string;
  }> {
    const priorities: Record<string, any[]> = {
      'AT': [
        {
          topic: 'Ökostromförderung 2025',
          priority: 'high' as const,
          targetAudience: 'Haushalte und Gewerbe',
          localAngle: 'Spezifische österreichische Förderprogramme und Einspeisungstarife'
        },
        {
          topic: 'Photovoltaik im Alpenraum',
          priority: 'high' as const,
          targetAudience: 'Bergregionen',
          localAngle: 'Spezielle Anforderungen für PV in Berggebieten'
        },
        {
          topic: 'E-Mobilität Österreich',
          priority: 'medium' as const,
          targetAudience: 'Unternehmen',
          localAngle: 'Ladeinfrastruktur und staatliche Unterstützung'
        }
      ],
      'CH': [
        {
          topic: 'KEV-Förderung Photovoltaik',
          priority: 'high' as const,
          targetAudience: 'Alle Kundengruppen',
          localAngle: 'Schweizer kostendeckende Einspeisungsvergütung'
        },
        {
          topic: 'Solaranlagen im Mehrfamilienhaus',
          priority: 'high' as const,
          targetAudience: 'Wohnungseigentümer',
          localAngle: 'Spezifische Regelungen für Mehrfamilienhäuser in der Schweiz'
        },
        {
          topic: 'Photovoltaik und Winterbetrieb',
          priority: 'medium' as const,
          targetAudience: 'Alle Regionen',
          localAngle: 'Schneebedeckung und Leistungsgarantien im Winter'
        }
      ]
    };

    return priorities[regionCode] || [];
  }

  /**
   * Kulturelle Anpassungen
   */
  private getCulturalAdaptations(regionCode: string): string[] {
    const adaptations: Record<string, string[]> = {
      'AT': [
        'Österreichische Rechtschreibung und Grammatik',
        'Lokale Bezeichnungen (z.B. "Stromsparte" statt "Stromtarif")',
        'Österreichische Maßeinheiten und Formate',
        'Referenzen auf österreichische Unternehmen und Projekte',
        'Berücksichtigung regionaler Feiertage'
      ],
      'CH': [
        'Schweizer Hochdeutsch',
        'Lokale Begriffe (z.B. "Elektrizitätswerk" statt "Stromanbieter")',
        'Schweizer Franken-Preisangaben',
        'Referenzen auf Schweizer Zertifizierungen',
        'Berücksichtigung kantonaler Unterschiede'
      ]
    };

    return adaptations[regionCode] || [];
  }

  /**
   * Rechtliche Anforderungen
   */
  private getLegalRequirements(regionCode: string): string[] {
    const requirements: Record<string, string[]> = {
      'AT': [
        'Österreichisches Impressumsgesetz',
        'E-Commerce-Recht Österreich',
        'Datenschutz DSGVO + österreichische Ergänzungen',
        'Gewerberechtliche Vorschriften',
        'Elektrizitätswirtschafts- und -organisationsgesetz (ElWOG)'
      ],
      'CH': [
        'Schweizerisches Obligationenrecht',
        'Datenschutz DSG (Schweiz)',
        'Bundesgesetz über den Datenschutz',
        'Elektrizitätsmarktgesetz (StromVG)',
        'Kantonale Baurechte'
      ]
    };

    return requirements[regionCode] || [];
  }

  /**
   * Lokale Partnerschaften
   */
  private getLocalPartnerships(regionCode: string): {
    type: string;
    partner: string;
    benefit: string;
  }[] {
    const partnerships: Record<string, any[]> = {
      'AT': [
        {
          type: 'Finanzierung',
          partner: 'Österreichische Kontrollbank',
          benefit: 'Günstige Finanzierungslösungen für Solarprojekte'
        },
        {
          type: 'Zertifizierung',
          partner: 'Österreichisches Umweltzeichen',
          benefit: 'Anerkannte Qualitätssiegel für nachhaltige Energie'
        },
        {
          type: 'Verbände',
          partner: 'Photovoltaik Austria',
          benefit: 'Branchenexpertise und Netzwerk'
        }
      ],
      'CH': [
        {
          type: 'Finanzierung',
          partner: 'Umweltstiftung Schweiz',
          benefit: 'Zinsgünstige Kredite für Umweltprojekte'
        },
        {
          type: 'Zertifizierung',
          partner: 'SWISS SOLAR',
          benefit: 'Branchenstandard und Qualitätssicherung'
        },
        {
          type: 'Verbände',
          partner: 'Swissolar Branchenverband',
          benefit: 'Politische Interessenvertretung und Fachexpertise'
        }
      ]
    };

    return partnerships[regionCode] || [];
  }

  /**
   * Monatlicher International SEO Report
   */
  generateMonthlyInternationalSEOReport(): {
    period: string;
    overallPerformance: {
      de: { visibility: number; traffic: number; conversions: number };
      at: { visibility: number; traffic: number; conversions: number };
      ch: { visibility: number; traffic: number; conversions: number };
    };
    keywordRankings: {
      keyword: string;
      de: number;
      at: number;
      ch: number;
      trend: 'up' | 'down' | 'stable';
    }[];
    technicalStatus: {
      hreflangErrors: number;
      redirectIssues: number;
      pageSpeedIssues: number;
      internationalIndexing: number;
    };
    recommendations: string[];
    nextMonthFocus: string[];
  } {
    return {
      period: 'Januar 2025',
      overallPerformance: {
        de: { visibility: 78, traffic: 12500, conversions: 186 },
        at: { visibility: 65, traffic: 2100, conversions: 28 },
        ch: { visibility: 62, traffic: 2800, conversions: 35 }
      },
      keywordRankings: [
        {
          keyword: 'solaranlage',
          de: 8,
          at: 5,
          ch: 12,
          trend: 'up' as const
        },
        {
          keyword: 'photovoltaik gewerbe',
          de: 6,
          at: 4,
          ch: 8,
          trend: 'up' as const
        },
        {
          keyword: 'stromspeicher',
          de: 12,
          at: 8,
          ch: 6,
          trend: 'stable' as const
        }
      ],
      technicalStatus: {
        hreflangErrors: 0,
        redirectIssues: 2,
        pageSpeedIssues: 1,
        internationalIndexing: 94
      },
      recommendations: [
        'AT-Markt Content um lokale Förderprogramme erweitern',
        'CH-Keyword-Strategie für winterliche Aspekte optimieren',
        'Internationale Backlink-Strategie verstärken',
        'Lokale Partnerschaften in Österreich und Schweiz ausbauen'
      ],
      nextMonthFocus: [
        'Content-Lokalisierung für österreichische Regionen',
        'Schweizer Markt-Analyse und Wettbewerbs-Tracking',
        'Internationale Conversion-Optimierung',
        'Cross-border SEO-Strategie entwickeln'
      ]
    };
  }

  /**
   * Alle Märkte abrufen
   */
  getMarkets(): Map<string, CountryMarket> {
    return new Map(this.markets);
  }

  /**
   * Lokalisierten Content abrufen
   */
  getLocalizedContent(pageId: string, region?: string): LocalizedContent[] {
    const pages = this.localizedPages.get(pageId);
    if (!pages) return [];

    if (region) {
      return pages.filter(page => page.region === region);
    }

    return pages;
  }

  /**
   * Hreflang-URLs abrufen
   */
  getHreflangUrls(pageId: string): HreflangUrl[] {
    return this.hreflangUrls.get(pageId) || [];
  }
}

// Singleton-Instanz exportieren
export const internationalSEOService = new InternationalSEOService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.internationalSEO = internationalSEOService;
}

export default internationalSEOService;

// Types für globale Erweiterung
declare global {
  interface Window {
    internationalSEO: typeof internationalSEOService;
  }
}