import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSchemaService } from './localSchemaService';

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  type: string;
  template: any;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: Array<{
    field: string;
    rule: string;
    message: string;
  }>;
}

export interface AutomatedSchemaGeneration {
  locationKey: string;
  pageType: 'location' | 'service' | 'blog' | 'case_study' | 'landing';
  contentData: any;
  generatedSchemas: any[];
  validationResults: SchemaValidationResult[];
  lastGenerated: string;
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}

export interface SchemaOptimization {
  schemaId: string;
  locationKey: string;
  optimizationType: 'missing_fields' | 'validation_errors' | 'performance' | 'relevance';
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'ignored';
  createdAt: string;
  appliedAt?: string;
}

/**
 * Advanced Local Schema Markup Automation Service
 * Automatisierte Generierung, Validierung und Optimierung von Schema.org Markup für lokale SEO
 */
export class AdvancedLocalSchemaService {
  private schemaTemplates: Map<string, SchemaTemplate> = new Map();
  private automatedSchemas: Map<string, AutomatedSchemaGeneration[]> = new Map();
  private schemaOptimizations: Map<string, SchemaOptimization[]> = new Map();
  private schemaCache: Map<string, { schema: any; expires: number }> = new Map();

  constructor() {
    this.initializeSchemaTemplates();
    this.initializeAutomatedSchemas();
    this.generateInitialOptimizations();
  }

  /**
   * Initialisiert Schema-Templates
   */
  private initializeSchemaTemplates(): void {
    const templates: SchemaTemplate[] = [
      {
        id: 'local_business_enhanced',
        name: 'Enhanced Local Business',
        type: 'LocalBusiness',
        template: {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: '{{businessName}}',
          alternateName: '{{alternateName}}',
          description: '{{description}}',
          url: '{{url}}',
          logo: '{{logo}}',
          image: '{{images}}',
          telephone: '{{telephone}}',
          email: '{{email}}',
          address: '{{address}}',
          geo: '{{geo}}',
          openingHours: '{{openingHours}}',
          areaServed: '{{areaServed}}',
          serviceArea: '{{serviceArea}}',
          hasOfferCatalog: '{{offerCatalog}}',
          aggregateRating: '{{aggregateRating}}',
          review: '{{reviews}}',
          sameAs: '{{sameAs}}',
          priceRange: '{{priceRange}}',
          paymentAccepted: '{{paymentAccepted}}',
          currenciesAccepted: '{{currenciesAccepted}}',
          founder: '{{founder}}',
          foundingDate: '{{foundingDate}}',
          numberOfEmployees: '{{numberOfEmployees}}',
          vatID: '{{vatID}}',
          taxID: '{{taxID}}',
          isicV4: '{{isicV4}}',
          naics: '{{naics}}',
          contactPoint: '{{contactPoint}}',
          department: '{{departments}}',
          slogan: '{{slogan}}',
          awards: '{{awards}}',
          knowsAbout: '{{knowsAbout}}',
          makesOffer: '{{offers}}',
          hasCredential: '{{credentials}}',
          certification: '{{certifications}}'
        },
        requiredFields: ['name', 'address', 'telephone', 'url'],
        optionalFields: ['description', 'geo', 'openingHours', 'aggregateRating'],
        validationRules: [
          {
            field: 'telephone',
            rule: 'format',
            message: 'Telefonnummer muss gültiges Format haben'
          },
          {
            field: 'email',
            rule: 'format',
            message: 'E-Mail muss gültiges Format haben'
          },
          {
            field: 'url',
            rule: 'format',
            message: 'URL muss gültiges Format haben'
          }
        ]
      },
      {
        id: 'organization_schema',
        name: 'Organization Schema',
        type: 'Organization',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '{{name}}',
          alternateName: '{{alternateName}}',
          description: '{{description}}',
          url: '{{url}}',
          logo: '{{logo}}',
          image: '{{images}}',
          telephone: '{{telephone}}',
          email: '{{email}}',
          address: '{{address}}',
          foundingDate: '{{foundingDate}}',
          numberOfEmployees: '{{numberOfEmployees}}',
          sameAs: '{{sameAs}}',
          contactPoint: '{{contactPoint}}',
          department: '{{departments}}',
          hasOfferCatalog: '{{offerCatalog}}',
          makesOffer: '{{offers}}',
          hasCredential: '{{credentials}}',
          certification: '{{certifications}}',
          slogan: '{{slogan}}',
          awards: '{{awards}}',
          knowsAbout: '{{knowsAbout}}'
        },
        requiredFields: ['name', 'url'],
        optionalFields: ['description', 'logo', 'telephone'],
        validationRules: []
      },
      {
        id: 'breadcrumb_schema',
        name: 'Breadcrumb Navigation',
        type: 'BreadcrumbList',
        template: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: '{{breadcrumbs}}'
        },
        requiredFields: ['itemListElement'],
        optionalFields: [],
        validationRules: [
          {
            field: 'itemListElement',
            rule: 'minLength',
            message: 'Mindestens ein Breadcrumb-Element erforderlich'
          }
        ]
      },
      {
        id: 'article_schema',
        name: 'Article Schema',
        type: 'Article',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: '{{headline}}',
          description: '{{description}}',
          image: '{{images}}',
          datePublished: '{{datePublished}}',
          dateModified: '{{dateModified}}',
          author: '{{author}}',
          publisher: '{{publisher}}',
          mainEntityOfPage: '{{mainEntityOfPage}}',
          articleSection: '{{articleSection}}',
          keywords: '{{keywords}}',
          about: '{{about}}',
          mentions: '{{mentions}}'
        },
        requiredFields: ['headline', 'author', 'publisher', 'datePublished'],
        optionalFields: ['description', 'image', 'dateModified'],
        validationRules: []
      },
      {
        id: 'faq_schema',
        name: 'FAQ Schema',
        type: 'FAQPage',
        template: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          name: '{{name}}',
          description: '{{description}}',
          mainEntity: '{{questions}}'
        },
        requiredFields: ['mainEntity'],
        optionalFields: ['name', 'description'],
        validationRules: [
          {
            field: 'mainEntity',
            rule: 'minLength',
            message: 'Mindestens eine Frage erforderlich'
          }
        ]
      },
      {
        id: 'how_to_schema',
        name: 'How-To Guide',
        type: 'HowTo',
        template: {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: '{{name}}',
          description: '{{description}}',
          image: '{{image}}',
          totalTime: '{{totalTime}}',
          supply: '{{supply}}',
          tool: '{{tool}}',
          step: '{{steps}}'
        },
        requiredFields: ['name', 'step'],
        optionalFields: ['description', 'image', 'totalTime'],
        validationRules: []
      },
      {
        id: 'event_schema',
        name: 'Local Event',
        type: 'Event',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: '{{name}}',
          description: '{{description}}',
          image: '{{images}}',
          startDate: '{{startDate}}',
          endDate: '{{endDate}}',
          eventStatus: '{{eventStatus}}',
          eventAttendanceMode: '{{eventAttendanceMode}}',
          location: '{{location}}',
          organizer: '{{organizer}}',
          offers: '{{offers}}',
          performer: '{{performer}}',
          about: '{{about}}'
        },
        requiredFields: ['name', 'startDate', 'location'],
        optionalFields: ['description', 'endDate', 'offers'],
        validationRules: []
      },
      {
        id: 'product_schema',
        name: 'Solar Product',
        type: 'Product',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: '{{name}}',
          description: '{{description}}',
          image: '{{images}}',
          brand: '{{brand}}',
          manufacturer: '{{manufacturer}}',
          model: '{{model}}',
          productID: '{{productID}}',
          sku: '{{sku}}',
          gtin: '{{gtin}}',
          offers: '{{offers}}',
          aggregateRating: '{{aggregateRating}}',
          review: '{{reviews}}',
          category: '{{category}}',
          additionalProperty: '{{additionalProperty}}'
        },
        requiredFields: ['name'],
        optionalFields: ['description', 'image', 'offers'],
        validationRules: []
      },
      {
        id: 'service_schema',
        name: 'Solar Service',
        type: 'Service',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: '{{name}}',
          description: '{{description}}',
          image: '{{images}}',
          provider: '{{provider}}',
          areaServed: '{{areaServed}}',
          hasOfferCatalog: '{{hasOfferCatalog}}',
          serviceType: '{{serviceType}}',
          category: '{{category}}',
          offers: '{{offers}}',
          aggregateRating: '{{aggregateRating}}',
          review: '{{reviews}}'
        },
        requiredFields: ['name', 'provider'],
        optionalFields: ['description', 'areaServed'],
        validationRules: []
      },
      {
        id: 'review_schema',
        name: 'Review & Rating',
        type: 'Review',
        template: {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: '{{itemReviewed}}',
          author: '{{author}}',
          datePublished: '{{datePublished}}',
          reviewBody: '{{reviewBody}}',
          name: '{{name}}',
          reviewRating: '{{reviewRating}}',
          publisher: '{{publisher}}'
        },
        requiredFields: ['itemReviewed', 'author', 'reviewRating'],
        optionalFields: ['reviewBody', 'datePublished'],
        validationRules: []
      }
    ];

    templates.forEach(template => {
      this.schemaTemplates.set(template.id, template);
    });
  }

  /**
   * Initialisiert automatisierte Schemas
   */
  private initializeAutomatedSchemas(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const schemas: AutomatedSchemaGeneration[] = [
        {
          locationKey,
          pageType: 'location',
          contentData: {},
          generatedSchemas: [],
          validationResults: [],
          lastGenerated: new Date().toISOString(),
          performance: {
            impressions: Math.floor(Math.random() * 1000),
            clicks: Math.floor(Math.random() * 100),
            ctr: parseFloat((Math.random() * 10).toFixed(2))
          }
        }
      ];

      this.automatedSchemas.set(locationKey, schemas);
    });
  }

  /**
   * Generiert initiale Optimierungen
   */
  private generateInitialOptimizations(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const optimizations: SchemaOptimization[] = [];

      // Schema-Validierung
      optimizations.push({
        schemaId: `local_business_${locationKey}`,
        locationKey,
        optimizationType: 'validation_errors',
        description: 'Schema-Validierung für LocalBusiness durchführen',
        impact: 15,
        effort: 'low',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Fehlende Felder ergänzen
      optimizations.push({
        schemaId: `missing_fields_${locationKey}`,
        locationKey,
        optimizationType: 'missing_fields',
        description: 'Fehlende erforderliche Schema-Felder ergänzen',
        impact: 20,
        effort: 'medium',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      this.schemaOptimizations.set(locationKey, optimizations);
    });
  }

  /**
   * Automatische Schema-Generierung für eine Region
   */
  public generateAutomatedSchemas(locationKey: string, pageType: AutomatedSchemaGeneration['pageType'], contentData: any = {}): AutomatedSchemaGeneration {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) {
      throw new Error(`Region ${locationKey} nicht gefunden`);
    }

    const schemas: any[] = [];
    const validationResults: SchemaValidationResult[] = [];

    switch (pageType) {
      case 'location':
        // LocalBusiness Schema
        const localBusinessSchema = this.generateEnhancedLocalBusinessSchema(region, contentData);
        schemas.push(localBusinessSchema);
        validationResults.push(this.validateSchema(localBusinessSchema, 'local_business_enhanced'));

        // Organization Schema
        const orgSchema = this.generateOrganizationSchema(region, contentData);
        schemas.push(orgSchema);
        validationResults.push(this.validateSchema(orgSchema, 'organization_schema'));

        // Breadcrumb Schema
        const breadcrumbSchema = this.generateBreadcrumbSchema(locationKey, contentData);
        schemas.push(breadcrumbSchema);
        validationResults.push(this.validateSchema(breadcrumbSchema, 'breadcrumb_schema'));
        break;

      case 'service':
        // Service Schema
        const serviceSchema = this.generateServiceSchema(region, contentData);
        schemas.push(serviceSchema);
        validationResults.push(this.validateSchema(serviceSchema, 'service_schema'));
        break;

      case 'blog':
      case 'case_study':
        // Article Schema
        const articleSchema = this.generateArticleSchema(contentData);
        schemas.push(articleSchema);
        validationResults.push(this.validateSchema(articleSchema, 'article_schema'));

        // Breadcrumb Schema
        const articleBreadcrumb = this.generateBreadcrumbSchema(locationKey, contentData);
        schemas.push(articleBreadcrumb);
        validationResults.push(this.validateSchema(articleBreadcrumb, 'breadcrumb_schema'));
        break;

      case 'landing':
        // Product/Service Schemas
        if (contentData.products) {
          contentData.products.forEach((product: any) => {
            const productSchema = this.generateProductSchema(product, region);
            schemas.push(productSchema);
            validationResults.push(this.validateSchema(productSchema, 'product_schema'));
          });
        }
        break;
    }

    const automatedGeneration: AutomatedSchemaGeneration = {
      locationKey,
      pageType,
      contentData,
      generatedSchemas: schemas,
      validationResults,
      lastGenerated: new Date().toISOString(),
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0
      }
    };

    // Cache aktualisieren
    const cacheKey = `${locationKey}_${pageType}`;
    this.schemaCache.set(cacheKey, {
      schema: schemas,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 Stunden Cache
    });

    // Bestehende Generierungen aktualisieren
    const existingGenerations = this.automatedSchemas.get(locationKey) || [];
    const existingIndex = existingGenerations.findIndex(gen => gen.pageType === pageType);

    if (existingIndex !== -1) {
      existingGenerations[existingIndex] = automatedGeneration;
    } else {
      existingGenerations.push(automatedGeneration);
    }

    this.automatedSchemas.set(locationKey, existingGenerations);

    return automatedGeneration;
  }

  /**
   * Generiert erweitertes LocalBusiness Schema
   */
  private generateEnhancedLocalBusinessSchema(region: ServiceRegion, contentData: any = {}): any {
    const baseSchema = localSchemaService.generateLocalBusinessSchema(region);

    // Erweiterte Felder hinzufügen
    return {
      ...baseSchema,
      // Zusätzliche Structured Data
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseSchema.url}/kontakt?aktion=beratung`,
          inLanguage: 'de-DE',
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform'
          ]
        },
        result: {
          '@type': 'Reservation',
          name: 'Kostenlose Beratung'
        }
      },
      // Enhanced Reviews
      review: baseSchema.review?.map(review => ({
        ...review,
        publisher: {
          '@type': 'Organization',
          name: 'Google',
          sameAs: 'https://www.google.com'
        }
      })),
      // Enhanced Offers
      makesOffer: baseSchema.makesOffer?.map(offer => ({
        ...offer,
        availabilityStarts: new Date().toISOString().split('T')[0],
        availabilityEnds: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    };
  }

  /**
   * Generiert Organization Schema
   */
  private generateOrganizationSchema(region: ServiceRegion, contentData: any = {}): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: `ZOE Solar ${region.city}`,
      alternateName: 'ZOE Solar GmbH',
      description: `Ihr regionaler Photovoltaik-Spezialist in ${region.city}, ${region.state}. Professionelle Planung, Installation und Wartung von Solaranlagen.`,
      url: `https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`,
      logo: 'https://www.zoe-solar.de/assets/logos/zoe-solar-logo.svg',
      image: [
        'https://www.zoe-solar.de/assets/images/team.jpg',
        'https://www.zoe-solar.de/assets/images/installation.jpg'
      ],
      telephone: '+49-30-123-456-78',
      email: `${region.city.toLowerCase()}@zoe-solar.de`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: region.city,
        addressRegion: region.state,
        postalCode: region.postalCode,
        addressCountry: 'DE'
      },
      foundingDate: '2018-01-01',
      numberOfEmployees: '50-100',
      sameAs: [
        'https://www.facebook.com/zoesolar',
        'https://www.linkedin.com/company/zoe-solar',
        'https://www.instagram.com/zoesolar'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+49-30-123-456-78',
        contactType: 'customer service',
        areaServed: region.state,
        availableLanguage: ['German', 'English']
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Photovoltaik-Lösungen ${region.city}`,
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Solaranlage Installation',
              description: 'Professionelle Installation von Photovoltaikanlagen'
            }
          }
        ]
      }
    };
  }

  /**
   * Generiert Breadcrumb Schema
   */
  private generateBreadcrumbSchema(locationKey: string, contentData: any = {}): any {
    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Startseite',
        item: 'https://www.zoe-solar.de'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Standorte',
        item: 'https://www.zoe-solar.de/standorte'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locationKey.charAt(0).toUpperCase() + locationKey.slice(1),
        item: `https://www.zoe-solar.de/standort/${locationKey}`
      }
    ];

    if (contentData.articleTitle) {
      breadcrumbs.push({
        '@type': 'ListItem',
        position: 4,
        name: contentData.articleTitle,
        item: contentData.articleUrl
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs
    };
  }

  /**
   * Generiert Article Schema
   */
  private generateArticleSchema(contentData: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: contentData.title || 'Solaranlage Leitfaden',
      description: contentData.description || 'Umfassender Leitfaden für Solaranlagen',
      image: contentData.images || [],
      datePublished: contentData.publishDate || new Date().toISOString(),
      dateModified: contentData.lastModified || new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'ZOE Solar',
        url: 'https://www.zoe-solar.de'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZOE Solar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.zoe-solar.de/assets/logos/zoe-solar-logo.svg'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': contentData.url || 'https://www.zoe-solar.de'
      },
      articleSection: contentData.category || 'Solaranlagen',
      keywords: contentData.keywords || [],
      about: contentData.topics || []
    };
  }

  /**
   * Generiert Service Schema
   */
  private generateServiceSchema(region: ServiceRegion, contentData: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: contentData.name || `Photovoltaik Service ${region.city}`,
      description: contentData.description || `Professionelle Photovoltaik-Dienstleistungen in ${region.city}`,
      image: contentData.images || [],
      provider: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH',
        url: 'https://www.zoe-solar.de'
      },
      areaServed: {
        '@type': 'City',
        name: region.city,
        addressRegion: region.state
      },
      serviceType: contentData.serviceType || 'Solar Installation',
      category: contentData.category || 'Renewable Energy',
      offers: contentData.offers || []
    };
  }

  /**
   * Generiert Product Schema
   */
  private generateProductSchema(productData: any, region: ServiceRegion): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      description: productData.description,
      image: productData.images || [],
      brand: {
        '@type': 'Brand',
        name: 'ZOE Solar'
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH'
      },
      category: productData.category || 'Solar Equipment',
      offers: {
        '@type': 'Offer',
        price: productData.price,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: `ZOE Solar ${region.city}`
        }
      }
    };
  }

  /**
   * Validiert Schema gegen Template
   */
  public validateSchema(schema: any, templateId: string): SchemaValidationResult {
    const template = this.schemaTemplates.get(templateId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template ${templateId} nicht gefunden`],
        warnings: [],
        score: 0
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Erforderliche Felder prüfen
    template.requiredFields.forEach(field => {
      if (!schema[field]) {
        errors.push(`Erforderliches Feld '${field}' fehlt`);
        score -= 20;
      }
    });

    // Validierungsregeln prüfen
    template.validationRules.forEach(rule => {
      const value = schema[rule.field];
      if (value) {
        switch (rule.rule) {
          case 'format':
            if (rule.field === 'telephone' && !this.isValidPhoneNumber(value)) {
              errors.push(rule.message);
              score -= 10;
            }
            if (rule.field === 'email' && !this.isValidEmail(value)) {
              errors.push(rule.message);
              score -= 10;
            }
            if (rule.field === 'url' && !this.isValidUrl(value)) {
              errors.push(rule.message);
              score -= 10;
            }
            break;
          case 'minLength':
            if (Array.isArray(value) && value.length < 1) {
              errors.push(rule.message);
              score -= 15;
            }
            break;
        }
      }
    });

    // Zusätzliche Prüfungen
    if (!schema['@context']) {
      warnings.push('@context fehlt');
      score -= 5;
    }

    if (!schema['@type']) {
      errors.push('@type fehlt');
      score -= 20;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  }

  /**
   * Hilfsfunktionen für Validierung
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Bulk-Schema-Generierung für alle Standorte
   */
  public generateBulkSchemas(pageType: AutomatedSchemaGeneration['pageType'], contentData: any = {}): { generated: number; failed: number; results: AutomatedSchemaGeneration[] } {
    let generated = 0;
    let failed = 0;
    const results: AutomatedSchemaGeneration[] = [];

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      try {
        const result = this.generateAutomatedSchemas(region.city.toLowerCase(), pageType, contentData);
        results.push(result);
        generated++;
      } catch (error) {
        console.error(`Fehler bei Schema-Generierung für ${region.city}:`, error);
        failed++;
      }
    });

    return { generated, failed, results };
  }

  /**
   * Schema aus Cache abrufen
   */
  public getCachedSchema(locationKey: string, pageType: string): any[] | null {
    const cacheKey = `${locationKey}_${pageType}`;
    const cached = this.schemaCache.get(cacheKey);

    if (cached && cached.expires > Date.now()) {
      return cached.schema;
    }

    // Cache löschen wenn abgelaufen
    if (cached) {
      this.schemaCache.delete(cacheKey);
    }

    return null;
  }

  /**
   * Optimierungen für Standort abrufen
   */
  public getSchemaOptimizations(locationKey: string): SchemaOptimization[] {
    return this.schemaOptimizations.get(locationKey) || [];
  }

  /**
   * Schema-Optimierung anwenden
   */
  public applySchemaOptimization(locationKey: string, optimizationId: string): boolean {
    const optimizations = this.schemaOptimizations.get(locationKey);
    if (!optimizations) return false;

    const optimization = optimizations.find(opt => opt.createdAt === optimizationId);
    if (!optimization) return false;

    optimization.status = 'applied';
    optimization.appliedAt = new Date().toISOString();

    return true;
  }

  /**
   * Alle Templates abrufen
   */
  public getSchemaTemplates(): SchemaTemplate[] {
    return Array.from(this.schemaTemplates.values());
  }

  /**
   * Automatisierte Schemas für Standort abrufen
   */
  public getAutomatedSchemas(locationKey: string): AutomatedSchemaGeneration[] {
    return this.automatedSchemas.get(locationKey) || [];
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalSchemas: number;
    validSchemas: number;
    invalidSchemas: number;
    avgValidationScore: number;
    pendingOptimizations: number;
    cacheHitRate: number;
  } {
    let totalSchemas = 0;
    let validSchemas = 0;
    let totalScore = 0;
    let pendingOptimizations = 0;

    Array.from(this.automatedSchemas.values()).forEach(generations => {
      generations.forEach(generation => {
        totalSchemas += generation.generatedSchemas.length;
        generation.validationResults.forEach(result => {
          if (result.isValid) validSchemas++;
          totalScore += result.score;
        });
      });
    });

    Array.from(this.schemaOptimizations.values()).forEach(optimizations => {
      pendingOptimizations += optimizations.filter(opt => opt.status === 'pending').length;
    });

    const cacheSize = this.schemaCache.size;
    const totalLocations = PRIMARY_SERVICE_REGIONS.length;
    const cacheHitRate = (cacheSize / totalLocations) * 100;

    return {
      totalSchemas,
      validSchemas,
      invalidSchemas: totalSchemas - validSchemas,
      avgValidationScore: totalSchemas > 0 ? totalScore / totalSchemas : 0,
      pendingOptimizations,
      cacheHitRate
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const advancedLocalSchemaService = new AdvancedLocalSchemaService();