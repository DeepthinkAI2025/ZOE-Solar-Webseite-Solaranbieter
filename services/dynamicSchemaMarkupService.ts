/**
 * Dynamic Schema Markup Generation Service für ZOE Solar
 *
 * Automatische Generierung und Verwaltung von strukturierten Daten (Schema.org)
 * für verbesserte SERP-Darstellung und Rich Results
 */

import { optimizeKeywords } from '../server/services/geminiClient';

export interface SchemaMarkup {
  id: string;
  type: 'Organization' | 'LocalBusiness' | 'Product' | 'Service' | 'Article' | 'FAQPage' | 'HowTo' | 'Event' | 'WebSite' | 'BreadcrumbList' | 'SpeakableSpecification';
  context: 'https://schema.org';
  data: any;
  pageUrl: string;
  userSegment?: string;
  dynamic: boolean;
  performance: {
    impressions: number;
    clicks: number;
    richResults: number;
    ctr: number;
    validationErrors: number;
    speakableScore?: number;
  };
  lastValidated: Date;
  active: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
  score: number; // 0-100
}

export interface SchemaPerformanceMetrics {
  totalSchemas: number;
  activeSchemas: number;
  richResultsRate: number;
  averageCTR: number;
  validationScore: number;
  topPerformingSchemas: Array<{
    id: string;
    type: string;
    ctr: number;
    richResults: number;
  }>;
  schemaTypeDistribution: Record<string, number>;
}

export interface DynamicSchemaRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    pageType?: string;
    contentType?: string;
    userSegment?: string;
    keywords?: string[];
    conditions?: {
      hasProduct?: boolean;
      hasLocation?: boolean;
      hasEvent?: boolean;
      hasFAQ?: boolean;
    };
  };
  schemaTemplate: {
    type: string;
    requiredFields: string[];
    optionalFields: string[];
    customLogic?: string;
  };
  priority: number;
  active: boolean;
  performance: {
    generatedCount: number;
    successRate: number;
    averageScore: number;
  };
}

class DynamicSchemaMarkupService {
  private static instance: DynamicSchemaMarkupService;
  private schemas: Map<string, SchemaMarkup> = new Map();
  private schemaRules: Map<string, DynamicSchemaRule> = new Map();
  private performanceMetrics: SchemaPerformanceMetrics;
  private schemaGenerationInterval?: NodeJS.Timeout;

  private constructor() {
    this.performanceMetrics = this.initializeMetrics();
    this.initializeSchemaRules();
    this.initializeBaseSchemas();
    this.initializeSchemaOptimization();
  }

  public static getInstance(): DynamicSchemaMarkupService {
    if (!DynamicSchemaMarkupService.instance) {
      DynamicSchemaMarkupService.instance = new DynamicSchemaMarkupService();
    }
    return DynamicSchemaMarkupService.instance;
  }

  private initializeMetrics(): SchemaPerformanceMetrics {
    return {
      totalSchemas: 0,
      activeSchemas: 0,
      richResultsRate: 0,
      averageCTR: 0,
      validationScore: 0,
      topPerformingSchemas: [],
      schemaTypeDistribution: {}
    };
  }

  private initializeSchemaRules(): void {
    // Produktseiten Schema Rule
    this.schemaRules.set('product-schema-rule', {
      id: 'product-schema-rule',
      name: 'Produktseiten Schema',
      description: 'Automatische Product Schema-Generierung für Produktseiten',
      trigger: {
        pageType: 'product',
        conditions: {
          hasProduct: true
        }
      },
      schemaTemplate: {
        type: 'Product',
        requiredFields: ['name', 'description', 'offers'],
        optionalFields: ['brand', 'manufacturer', 'category', 'image', 'review', 'aggregateRating'],
        customLogic: 'includeManufacturerInfo'
      },
      priority: 9,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });

    // LocalBusiness Schema Rule für Standorte
    this.schemaRules.set('local-business-schema-rule', {
      id: 'local-business-schema-rule',
      name: 'Standortseiten LocalBusiness Schema',
      description: 'LocalBusiness Schema für Standortseiten',
      trigger: {
        pageType: 'location',
        conditions: {
          hasLocation: true
        }
      },
      schemaTemplate: {
        type: 'LocalBusiness',
        requiredFields: ['name', 'address', 'telephone'],
        optionalFields: ['geo', 'openingHours', 'priceRange', 'image', 'review', 'aggregateRating'],
        customLogic: 'includeServiceArea'
      },
      priority: 8,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });

    // FAQ Schema Rule
    this.schemaRules.set('faq-schema-rule', {
      id: 'faq-schema-rule',
      name: 'FAQ Schema für FAQ-Seiten',
      description: 'Automatische FAQPage Schema-Generierung',
      trigger: {
        pageType: 'faq',
        conditions: {
          hasFAQ: true
        }
      },
      schemaTemplate: {
        type: 'FAQPage',
        requiredFields: ['mainEntity'],
        optionalFields: [],
        customLogic: 'extractFAQFromContent'
      },
      priority: 7,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });

    // Service Schema Rule
    this.schemaRules.set('service-schema-rule', {
      id: 'service-schema-rule',
      name: 'Service Schema',
      description: 'Service Schema für Dienstleistungsseiten',
      trigger: {
        pageType: 'service',
        contentType: 'service'
      },
      schemaTemplate: {
        type: 'Service',
        requiredFields: ['name', 'description', 'provider'],
        optionalFields: ['areaServed', 'serviceType', 'offers', 'review'],
        customLogic: 'includeServiceDetails'
      },
      priority: 6,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });

    // Article Schema Rule für Blog/Case Studies
    this.schemaRules.set('article-schema-rule', {
      id: 'article-schema-rule',
      name: 'Artikel Schema',
      description: 'Article Schema für Blog-Posts und Case Studies',
      trigger: {
        pageType: 'article',
        contentType: 'blog'
      },
      schemaTemplate: {
        type: 'Article',
        requiredFields: ['headline', 'author', 'datePublished'],
        optionalFields: ['dateModified', 'image', 'publisher', 'articleSection'],
        customLogic: 'includeArticleMetadata'
      },
      priority: 5,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });

    // Event Schema Rule für Veranstaltungen
    this.schemaRules.set('event-schema-rule', {
      id: 'event-schema-rule',
      name: 'Event Schema',
      description: 'Event Schema für Veranstaltungen und Events',
      trigger: {
        pageType: 'event',
        contentType: 'event'
      },
      schemaTemplate: {
        type: 'Event',
        requiredFields: ['name', 'startDate', 'location'],
        optionalFields: ['description', 'endDate', 'organizer', 'offers', 'eventStatus'],
        customLogic: 'includeEventDetails'
      },
      priority: 4,
      active: true,
      performance: {
        generatedCount: 0,
        successRate: 0,
        averageScore: 0
      }
    });
  }

  private initializeBaseSchemas(): void {
    // Basis Organization Schema
    this.schemas.set('organization-base', {
      id: 'organization-base',
      type: 'Organization',
      context: 'https://schema.org',
      data: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH',
        url: 'https://zoe-solar.de',
        logo: 'https://zoe-solar.de/logo.png',
        description: 'Ihr Partner für Photovoltaik-Lösungen in Deutschland',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Musterstraße 123',
          addressLocality: 'Berlin',
          postalCode: '10115',
          addressCountry: 'DE'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+49-30-123456',
          contactType: 'customer service',
          availableLanguage: ['German', 'English']
        },
        sameAs: [
          'https://www.facebook.com/zoesolar',
          'https://www.linkedin.com/company/zoe-solar',
          'https://twitter.com/zoesolar'
        ]
      },
      pageUrl: 'https://zoe-solar.de',
      dynamic: false,
      performance: {
        impressions: 0,
        clicks: 0,
        richResults: 0,
        ctr: 0,
        validationErrors: 0
      },
      lastValidated: new Date(),
      active: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    // Extended Organization Schema
    this.schemas.set('organization-extended', {
      id: 'organization-extended',
      type: 'Organization',
      context: 'https://schema.org',
      data: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH',
        url: 'https://zoe-solar.de',
        logo: 'https://zoe-solar.de/logo.png',
        description: 'Ihr Partner für Photovoltaik-Lösungen in Deutschland',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Musterstraße 123',
          addressLocality: 'Berlin',
          postalCode: '10115',
          addressCountry: 'DE'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+49-30-123456',
          contactType: 'customer service',
          availableLanguage: ['German', 'English']
        },
        sameAs: [
          'https://www.facebook.com/zoesolar',
          'https://www.linkedin.com/company/zoe-solar',
          'https://twitter.com/zoesolar'
        ],
        foundingDate: '2020-01-01',
        numberOfEmployees: 50,
        knowsAbout: ['Photovoltaik', 'Solarenergie', 'Erneuerbare Energien'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'ZOE Solar Produktkatalog'
        },
        makesOffer: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Photovoltaik Installation'
            }
          }
        ]
      },
      pageUrl: 'https://zoe-solar.de',
      dynamic: false,
      performance: {
        impressions: 0,
        clicks: 0,
        richResults: 0,
        ctr: 0,
        validationErrors: 0
      },
      lastValidated: new Date(),
      active: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    // WebSite Schema
    this.schemas.set('website-base', {
      id: 'website-base',
      type: 'WebSite',
      context: 'https://schema.org',
      data: {
        '@type': 'WebSite',
        name: 'ZOE Solar - Photovoltaik Lösungen',
        url: 'https://zoe-solar.de',
        description: 'Professionelle Photovoltaik-Installationen für Eigenheim, Gewerbe und Landwirtschaft',
        publisher: {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://zoe-solar.de/suche?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.hero-title', '.hero-description', '.faq-question', '.faq-answer']
        }
      },
      pageUrl: 'https://zoe-solar.de',
      dynamic: false,
      performance: {
        impressions: 0,
        clicks: 0,
        richResults: 0,
        ctr: 0,
        validationErrors: 0
      },
      lastValidated: new Date(),
      active: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  }

  private initializeSchemaOptimization(): void {
    // Schema-Optimierung alle 6 Stunden
    this.schemaGenerationInterval = setInterval(() => {
      this.performSchemaOptimization();
    }, 6 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performSchemaOptimization();
  }
  private async scanAllPages(): Promise<Array<{ url: string; type: string; content: string }>> {
    // Simuliere das Scannen aller Seiten aus dem pages/ Verzeichnis
    const allPages = [
      // Home und Hauptseiten
      { url: '/', type: 'home', content: 'ZOE Solar Homepage - Photovoltaik Lösungen' },
      { url: '/photovoltaik', type: 'product', content: 'Photovoltaik Systeme' },
      { url: '/produkte', type: 'product', content: 'Solarprodukte und Lösungen' },
      { url: '/dienstleistungen', type: 'service', content: 'Unsere Dienstleistungen' },
      { url: '/ueber-uns', type: 'organization', content: 'Über ZOE Solar GmbH' },
      { url: '/kontakt', type: 'organization', content: 'Kontaktinformationen' },
      { url: '/faq', type: 'faq', content: 'Häufige Fragen' },
      { url: '/blog', type: 'article', content: 'Solar Blog und News' },
      { url: '/fallstudien', type: 'article', content: 'Erfolgreiche Projekte' },
      { url: '/events', type: 'event', content: 'Solar Events und Veranstaltungen' },
      // Standortseiten
      { url: '/standort/berlin', type: 'location', content: 'ZOE Solar Berlin' },
      { url: '/standort/muenchen', type: 'location', content: 'ZOE Solar München' },
      { url: '/standort/hamburg', type: 'location', content: 'ZOE Solar Hamburg' },
      { url: '/standort/koeln', type: 'location', content: 'ZOE Solar Köln' },
      { url: '/standort/frankfurt', type: 'location', content: 'ZOE Solar Frankfurt' },
      { url: '/standort/stuttgart', type: 'location', content: 'ZOE Solar Stuttgart' },
      // Spezifische Produktseiten
      { url: '/eigenheim', type: 'product', content: 'Photovoltaik für Eigenheime' },
      { url: '/gewerbe', type: 'product', content: 'Gewerbliche Photovoltaik' },
      { url: '/landwirtschaft', type: 'product', content: 'Agri-PV Lösungen' },
      { url: '/industrie', type: 'product', content: 'Industrielle Solarlösungen' },
      // Service-Seiten
      { url: '/wartung', type: 'service', content: 'Wartung und Service' },
      { url: '/finanzierung', type: 'service', content: 'Finanzierungsmöglichkeiten' },
      { url: '/foerdermittel', type: 'service', content: 'Fördermittel und Zuschüsse' },
      // Zusätzliche Seiten für 100% Coverage
      { url: '/karriere', type: 'organization', content: 'Karriere bei ZOE Solar' },
      { url: '/presse', type: 'article', content: 'Pressemitteilungen' },
      { url: '/nachhaltigkeit', type: 'organization', content: 'Nachhaltigkeit und Umwelt' },
      { url: '/innovationen', type: 'product', content: 'Innovative Technologien' },
      { url: '/partner-werden', type: 'organization', content: 'Partnerprogramm' },
      { url: '/glossar', type: 'faq', content: 'Solar Glossar' },
      { url: '/team', type: 'organization', content: 'Unser Team' },
      { url: '/projekte', type: 'article', content: 'Referenzprojekte' },
      { url: '/preise', type: 'product', content: 'Preise und Angebote' },
      { url: '/sonderaktionen', type: 'event', content: 'Aktuelle Aktionen' }
    ];

    return allPages;
  }

  private async performSchemaOptimization(): Promise<void> {
    try {
      // Generiere dynamische Schemas basierend auf Content
      await this.generateDynamicSchemas();

      // Validiere alle Schemas
      await this.validateAllSchemas();

      // Optimiere Schema-Performance
      await this.optimizeSchemaPerformance();

      // Aktualisiere Metriken
      this.updatePerformanceMetrics();

    } catch (error) {
      console.error('Failed to perform schema optimization:', error);
    }
  }

  private async generateDynamicSchemas(): Promise<void> {
    // Simuliere Content-Analyse für verschiedene Seiten
    const pagesToProcess = [
      { url: '/photovoltaik', type: 'product', content: 'Photovoltaik Systeme' },
      { url: '/standort/berlin', type: 'location', content: 'Berlin Standort' },
      { url: '/faq', type: 'faq', content: 'Häufige Fragen' },
      { url: '/dienstleistungen', type: 'service', content: 'Unsere Dienstleistungen' }
    ];

    for (const page of pagesToProcess) {
      await this.generateSchemaForPage(page);
    }
  }

  private async generateSchemaForPage(page: { url: string; type: string; content: string }): Promise<void> {
    // Finde passende Rule
    const applicableRule = Array.from(this.schemaRules.values())
      .find(rule => this.matchesRule(rule, page));

    if (!applicableRule) return;

    // Generiere Schema basierend auf Rule
    const schemaData = await this.generateSchemaData(applicableRule, page);

    if (schemaData) {
      const schemaId = `dynamic-${page.type}-${Date.now()}`;
      const schema: SchemaMarkup = {
        id: schemaId,
        type: applicableRule.schemaTemplate.type as any,
        context: 'https://schema.org',
        data: schemaData,
        pageUrl: `https://zoe-solar.de${page.url}`,
        dynamic: true,
        performance: {
          impressions: 0,
          clicks: 0,
          richResults: 0,
          ctr: 0,
          validationErrors: 0
        },
        lastValidated: new Date(),
        active: true,
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      this.schemas.set(schemaId, schema);
      applicableRule.performance.generatedCount++;
    }
  }

  private matchesRule(rule: DynamicSchemaRule, page: { url: string; type: string; content: string }): boolean {
    if (!rule.active) return false;

    // Page Type Match
    if (rule.trigger.pageType && page.type !== rule.trigger.pageType) return false;

    // Content Type Match
    if (rule.trigger.contentType && !page.content.toLowerCase().includes(rule.trigger.contentType)) return false;

    // Conditions Match
    if (rule.trigger.conditions) {
      if (rule.trigger.conditions.hasProduct && !page.content.includes('Produkt')) return false;
      if (rule.trigger.conditions.hasLocation && !page.url.includes('standort')) return false;
      if (rule.trigger.conditions.hasFAQ && !page.url.includes('faq')) return false;
    }

    return true;
  }

  private async generateSchemaData(rule: DynamicSchemaRule, page: { url: string; type: string; content: string }): Promise<any> {
    const baseData: any = {
      '@type': rule.schemaTemplate.type
    };

    // Füge erforderliche Felder hinzu
    for (const field of rule.schemaTemplate.requiredFields) {
      baseData[field] = await this.generateFieldValue(field, page, rule);
    }

    // Füge optionale Felder hinzu (wenn verfügbar)
    for (const field of rule.schemaTemplate.optionalFields) {
      const value = await this.generateFieldValue(field, page, rule);
      if (value !== null) {
        baseData[field] = value;
      }
    }

    // Custom Logic anwenden
    if (rule.schemaTemplate.customLogic) {
      await this.applyCustomLogic(baseData, rule.schemaTemplate.customLogic, page);
    }

    return baseData;
  }

  private async generateFieldValue(field: string, page: { url: string; type: string; content: string }, rule: DynamicSchemaRule): Promise<any> {
    switch (field) {
      case 'name':
        return page.type === 'product' ? 'Photovoltaik-System' : 'ZOE Solar Dienstleistung';

      case 'description':
        return await this.generateAIDescription(page.content, rule.schemaTemplate.type);

      case 'offers':
        return {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock'
        };

      case 'address':
        return {
          '@type': 'PostalAddress',
          addressLocality: 'Berlin',
          addressCountry: 'DE'
        };
      case 'startDate':
        return new Date().toISOString();

      case 'location':
        return {
          '@type': 'Place',
          name: 'ZOE Solar Standort',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Berlin',
            addressCountry: 'DE'
          }
        };

      case 'eventStatus':
        return 'https://schema.org/EventScheduled';

      case 'organizer':
        return {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        };

      case 'telephone':
        return '+49-30-123456';

      case 'mainEntity':
        return await this.generateFAQEntities(page.content);

      case 'provider':
        return {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        };

      case 'headline':
        return page.content;

      case 'author':
        return {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        };

      case 'datePublished':
        return new Date().toISOString().split('T')[0];

      case 'areaServed':
        return {
          '@type': 'Country',
          name: 'Germany'
        };
      case 'serviceType':
        return 'Solar Installation Services';
      case 'provider':
        return {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH',
          url: 'https://zoe-solar.de'
        };
      default:
        return null;
    }
  }

  private async generateAIDescription(content: string, schemaType: string): Promise<string> {
    try {
      const prompt = `Generiere eine SEO-optimierte Beschreibung für ${schemaType} Schema basierend auf: "${content}". Maximale Länge: 160 Zeichen.`;

      const aiResponse = await optimizeKeywords([prompt]);
      return aiResponse && aiResponse.length > 0 ? aiResponse[0] : content;
    } catch (error) {
      console.error('Failed to generate AI description:', error);
      return content;
    }
  }

  private async generateFAQEntities(content: string): Promise<any[]> {
    // Simuliere FAQ-Extraktion
    return [
      {
        '@type': 'Question',
        name: 'Wie funktioniert Photovoltaik?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Photovoltaik wandelt Sonnenlicht in Strom um.'
        }
      }
    ];
  }

  private async applyCustomLogic(data: any, logic: string, page: { url: string; type: string; content: string }): Promise<void> {
    switch (logic) {
      case 'includeManufacturerInfo':
        data.manufacturer = {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        };
        break;

      case 'includeServiceArea':
        data.areaServed = [
          {
            '@type': 'Place',
            name: 'Deutschland'
          }
        ];
        break;

      case 'includeServiceDetails':
        data.serviceType = 'Photovoltaik Installation';
        break;
    }
  }

  private async validateAllSchemas(): Promise<void> {
    for (const [id, schema] of Array.from(this.schemas.entries())) {
      const validation = await this.validateSchema(schema);
      schema.lastValidated = new Date();

      if (!validation.valid) {
        schema.performance.validationErrors = validation.errors.length;
      }
    }
  }

  private async validateSchema(schema: SchemaMarkup): Promise<SchemaValidationResult> {
    const errors: Array<{ field: string; message: string; severity: 'error' | 'warning' }> = [];
    const warnings: Array<{ field: string; message: string }> = [];

    // Basis-Validierung
    if (!schema.data['@type']) {
      errors.push({
        field: '@type',
        message: 'Missing @type field',
        severity: 'error'
      });
    }

    // Typ-spezifische Validierung
    switch (schema.type) {
      case 'Product':
        if (!schema.data.name) {
          errors.push({
            field: 'name',
            message: 'Product name is required',
            severity: 'error'
          });
        }
        break;

      case 'LocalBusiness':
        if (!schema.data.address) {
          errors.push({
            field: 'address',
            message: 'Address is required for LocalBusiness',
            severity: 'error'
          });
        }
        break;
    }

    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score
    };
  }

  private async optimizeSchemaPerformance(): Promise<void> {
    // Deaktiviere schlecht performende Schemas
    for (const [id, schema] of Array.from(this.schemas.entries())) {
      if (schema.dynamic && schema.performance.impressions > 100) {
        const ctr = schema.performance.ctr;
        if (ctr < 0.01) { // Weniger als 1% CTR
          schema.active = false;
        }
      }
    }

    // Optimiere aktive Schemas
    for (const [id, schema] of Array.from(this.schemas.entries())) {
      if (schema.active) {
        await this.optimizeSchemaContent(schema);
      }
    }
  }

  private async optimizeSchemaContent(schema: SchemaMarkup): Promise<void> {
    // KI-basierte Optimierung der Schema-Inhalte
    if (schema.data.description) {
      const optimizedDesc = await this.generateAIDescription(
        schema.data.description,
        schema.type
      );
      if (optimizedDesc !== schema.data.description) {
        schema.data.description = optimizedDesc;
        schema.lastUpdated = new Date();
      }
    }
  }

  private updatePerformanceMetrics(): void {
    const allSchemas = Array.from(this.schemas.values());
    const activeSchemas = allSchemas.filter(s => s.active);

    this.performanceMetrics.totalSchemas = allSchemas.length;
    this.performanceMetrics.activeSchemas = activeSchemas.length;

    if (activeSchemas.length > 0) {
      this.performanceMetrics.averageCTR = activeSchemas.reduce((sum, s) => sum + s.performance.ctr, 0) / activeSchemas.length;
      this.performanceMetrics.richResultsRate = activeSchemas.reduce((sum, s) => sum + s.performance.richResults, 0) / activeSchemas.length;
      this.performanceMetrics.validationScore = activeSchemas.reduce((sum, s) => sum + (s.performance.validationErrors === 0 ? 100 : 50), 0) / activeSchemas.length;
    }

    // Schema Type Distribution
    this.performanceMetrics.schemaTypeDistribution = {};
    allSchemas.forEach(schema => {
      this.performanceMetrics.schemaTypeDistribution[schema.type] =
        (this.performanceMetrics.schemaTypeDistribution[schema.type] || 0) + 1;
    });

    // Top Performing Schemas
    this.performanceMetrics.topPerformingSchemas = activeSchemas
      .sort((a, b) => b.performance.ctr - a.performance.ctr)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        type: s.type,
        ctr: s.performance.ctr,
        richResults: s.performance.richResults
      }));
  }

  // ===== PUBLIC API =====

  public getSchemaForPage(pageUrl: string, userSegment?: string): SchemaMarkup[] {
    return Array.from(this.schemas.values())
      .filter(schema => schema.active && schema.pageUrl === pageUrl)
      .sort((a, b) => {
        // Priorisiere dynamische Schemas für User-Segment
        if (userSegment && a.userSegment === userSegment && b.userSegment !== userSegment) return -1;
        if (userSegment && b.userSegment === userSegment && a.userSegment !== userSegment) return 1;
        return 0;
      });
  }

  public getAllSchemas(): SchemaMarkup[] {
    return Array.from(this.schemas.values());
  }

  public getSchemaRules(): DynamicSchemaRule[] {
    return Array.from(this.schemaRules.values());
  }

  public getPerformanceMetrics(): SchemaPerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  public async createDynamicSchema(pageUrl: string, content: any, userSegment?: string): Promise<string> {
    // Finde passende Rule
    const applicableRule = Array.from(this.schemaRules.values())
      .find(rule => this.matchesRule(rule, { url: pageUrl, type: 'dynamic', content: JSON.stringify(content) }));

    if (!applicableRule) {
      throw new Error('No applicable schema rule found');
    }

    // Generiere Schema
    const schemaData = await this.generateSchemaData(applicableRule, {
      url: pageUrl,
      type: 'dynamic',
      content: JSON.stringify(content)
    });

    const schemaId = `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const schema: SchemaMarkup = {
      id: schemaId,
      type: applicableRule.schemaTemplate.type as any,
      context: 'https://schema.org',
      data: schemaData,
      pageUrl,
      userSegment,
      dynamic: true,
      performance: {
        impressions: 0,
        clicks: 0,
        richResults: 0,
        ctr: 0,
        validationErrors: 0
      },
      lastValidated: new Date(),
      active: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.schemas.set(schemaId, schema);
    return schemaId;
  }

  public async monitorRichResults(): Promise<void> {
    // Simuliere Rich Results Monitoring
    for (const [id, schema] of Array.from(this.schemas.entries())) {
      if (schema.active) {
        // Simuliere API-Call zu Google Search Console oder Rich Results Tool
        const richResultsCount = Math.floor(Math.random() * 100); // Simuliert
        schema.performance.richResults = richResultsCount;

        // Berechne Speakable Score basierend auf Speakable Schema
        if (schema.type === 'WebSite' && schema.data.speakable) {
          schema.performance.speakableScore = Math.min(100, richResultsCount * 2);
        }
      }
    }
  }

  public async updateSchemaPerformance(schemaId: string, event: 'impression' | 'click' | 'richResult'): Promise<void> {
    const schema = this.schemas.get(schemaId);
    if (!schema) return;

    switch (event) {
      case 'impression':
        schema.performance.impressions++;
        break;
      case 'click':
        schema.performance.clicks++;
        break;
      case 'richResult':
        schema.performance.richResults++;
        break;
    }

    // Berechne CTR
    schema.performance.ctr = schema.performance.impressions > 0
      ? schema.performance.clicks / schema.performance.impressions
      : 0;

    schema.lastUpdated = new Date();
  }

  public async validateSchemaById(schemaId: string): Promise<SchemaValidationResult> {
    const schema = this.schemas.get(schemaId);
    if (!schema) {
      throw new Error(`Schema ${schemaId} not found`);
    }

    return await this.validateSchema(schema);
  }

  public stopSchemaOptimization(): void {
    if (this.schemaGenerationInterval) {
      clearInterval(this.schemaGenerationInterval);
      this.schemaGenerationInterval = undefined;
    }
  }

  public startSchemaOptimization(): void {
    if (!this.schemaGenerationInterval) {
      this.initializeSchemaOptimization();
    }
  }
}

export const dynamicSchemaMarkupService = DynamicSchemaMarkupService.getInstance();
export default dynamicSchemaMarkupService;