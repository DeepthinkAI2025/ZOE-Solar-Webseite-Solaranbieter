/**
 * Clean Structured Data Service für ZOE Solar
 *
 * Implementiert nur die wichtigsten Schema.org Typen
 * Ohne übermäßige Komplexität - Fokus auf deutsche lokale SEO
 */

export interface SchemaType {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class StructuredDataService implements ServiceInterface {
  name = 'Clean Structured Data Service';
  version = '1.0.0';

  private readonly ESSENTIAL_SCHEMAS = [
    'LocalBusiness',
    'Organization',
    'WebSite',
    'BreadcrumbList',
    'FAQPage',
    'Service',
    'Article'
  ];

  async initialize(): Promise<void> {
    console.log('📊 Initialisiere Structured Data Service...');
    await this.cleanupExistingSchemas();
    await this.addEssentialSchemas();
  }

  /**
   * Bestehende überflüssige Schemas aufräumen
   */
  private async cleanupExistingSchemas(): Promise<void> {
    console.log('🧹 Räume überflüssige strukturierte Daten auf...');

    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    let removedCount = 0;

    existingScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '{}');

        // Nur essentielle Schemas behalten
        if (!this.isEssentialSchema(data['@type'])) {
          script.remove();
          removedCount++;
          console.log(`🗑️ Entfernt: ${data['@type']}`);
        }
      } catch (error) {
        // Ungültige JSON entfernen
        script.remove();
        removedCount++;
      }
    });

    console.log(`✅ Aufgeräumt: ${removedCount} überflüssige Schemas entfernt`);
  }

  /**
   * Prüfen ob Schema-Typ essentiell ist
   */
  private isEssentialSchema(type: string): boolean {
    return this.ESSENTIAL_SCHEMAS.includes(type);
  }

  /**
   * Essentielle Schemas hinzufügen
   */
  private async addEssentialSchemas(): Promise<void> {
    console.log('➕ Füge essentielle Schemas hinzu...');

    // Core Business Schemas
    this.addLocalBusinessSchema();
    this.addOrganizationSchema();
    this.addWebSiteSchema();

    // Page-spezifische Schemas
    await this.addPageSpecificSchemas();

    console.log('✅ Essentielle Schemas hinzugefügt');
  }

  /**
   * LocalBusiness Schema (deutscher Fokus)
   */
  private addLocalBusinessSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ZOE Solar GmbH",
      "alternateName": "ZOE Solar Photovoltaik",
      "description": "Professionelle Solaranlagen und Photovoltaik-Lösungen für Unternehmen in Deutschland",
      "url": "https://zoe-solar.de",
      "telephone": "+49 30 12345678",
      "email": "info@zoe-solar.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alt-Moabit 101",
        "addressLocality": "Berlin",
        "addressRegion": "BE",
        "postalCode": "10559",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 52.5250,
        "longitude": 13.3450
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "10:00",
          "closes": "14:00"
        }
      ],
      "priceRange": "€€€",
      "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
      "languagesSpoken": ["German", "English"],
      "areaServed": [
        {
          "@type": "Country",
          "name": "Germany"
        },
        {
          "@type": "City",
          "name": "Berlin"
        },
        {
          "@type": "City",
          "name": "München"
        },
        {
          "@type": "City",
          "name": "Hamburg"
        }
      ],
      "image": [
        "https://zoe-solar.de/images/zoe-solar-hq.jpg",
        "https://zoe-solar.de/images/zoe-solar-logo.png"
      ],
      "logo": "https://zoe-solar.de/images/zoe-solar-logo.png",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solaranlagen und Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Photovoltaik Anlagenbau",
              "description": "Planung und Installation von gewerblichen Solaranlagen"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Solarberatung",
              "description": "Professionelle Beratung für Solarprojekte"
            }
          }
        ]
      },
      "sameAs": [
        "https://www.linkedin.com/company/zoe-solar",
        "https://www.facebook.com/zoe-solar",
        "https://www.xing.com/company/zoe-solar",
        "https://www.instagram.com/zoe_solar"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+49 30 12345678",
        "availableLanguage": ["German", "English"]
      }
    };

    this.addSchema(schema);
  }

  /**
   * Organization Schema
   */
  private addOrganizationSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ZOE Solar GmbH",
      "legalName": "ZOE Solar Photovoltaik GmbH",
      "description": "Experte für gewerbliche Photovoltaik-Anlagen und Solarlösungen",
      "url": "https://zoe-solar.de",
      "logo": "https://zoe-solar.de/images/zoe-solar-logo.png",
      "foundingDate": "2015-01-15",
      "duns": "123456789",
      "vatID": "DE123456789",
      "taxID": "123/456/78901",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": "25",
        "unitText": "Employees"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alt-Moabit 101",
        "addressLocality": "Berlin",
        "addressRegion": "BE",
        "postalCode": "10559",
        "addressCountry": "DE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+49 30 12345678",
        "email": "info@zoe-solar.de",
        "availableLanguage": ["German", "English"],
        "hoursAvailable": [
          "Mo-Fr 09:00-18:00",
          "Sa 10:00-14:00"
        ]
      },
      "award": ["Deutscher Solarpreis 2022", "Innovationspreis Photovoltaik 2023"],
      "knowsAbout": [
        "Photovoltaik",
        "Solaranlagen",
        "Solarstrom",
        "Erneuerbare Energien",
        "Gewerbe",
        "Unternehmen"
      ],
      "serviceArea": {
        "@type": "Country",
        "name": "Germany"
      },
      "brand": {
        "@type": "Brand",
        "name": "ZOE Solar",
        "logo": "https://zoe-solar.de/images/zoe-solar-logo.png"
      }
    };

    this.addSchema(schema);
  }

  /**
   * WebSite Schema mit deutschen SEO-Features
   */
  private addWebSiteSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ZOE Solar",
      "alternateName": "ZOE Solar Photovoltaik",
      "description": "Ihr Experte für gewerbliche Solaranlagen und Photovoltaik-Lösungen in Deutschland",
      "url": "https://zoe-solar.de",
      "inLanguage": "de-DE",
      "isAccessibleForFree": true,
      "isPartOf": {
        "@type": "WebSite",
        "name": "ZOE Solar Group",
        "url": "https://zoe-solar.de"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH",
        "logo": {
          "@type": "ImageObject",
          "url": "https://zoe-solar.de/images/zoe-solar-logo.png",
          "width": 400,
          "height": 200
        }
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://zoe-solar.de/suche?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        {
          "@type": "ReadAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://zoe-solar.de/{article_slug}"
          },
          "object": {
            "@type": "Article",
            "name": "Photovoltaik Ratgeber"
          }
        }
      ],
      "about": [
        {
          "@type": "Thing",
          "name": "Photovoltaik"
        },
        {
          "@type": "Thing",
          "name": "Solaranlagen"
        },
        {
          "@type": "Thing",
          "name": "Erneuerbare Energien"
        }
      ],
      "mainEntity": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      },
      "copyrightYear": new Date().getFullYear(),
      "genre": ["Business", "Technology", "Energy", "Sustainability"],
      "audience": {
        "@type": "Audience",
        "audienceType": "Business Customers"
      }
    };

    this.addSchema(schema);
  }

  /**
   * Page-spezifische Schemas basierend auf aktueller Seite
   */
  private async addPageSpecificSchemas(): Promise<void> {
    const pageType = this.getCurrentPageType();

    switch (pageType) {
      case 'home':
        this.addHomeSchema();
        break;
      case 'service':
        this.addServiceSchema();
        break;
      case 'about':
        this.addAboutSchema();
        break;
      case 'contact':
        this.addContactSchema();
        break;
      case 'faq':
        this.addFAQSchema();
        break;
      case 'blog':
        this.addBlogSchema();
        break;
    }

    // Immer Breadcrumbs hinzufügen
    this.addBreadcrumbSchema();
  }

  /**
   * Aktuellen Page-Typ ermitteln
   */
  private getCurrentPageType(): string {
    const path = window.location.pathname.toLowerCase();

    if (path === '/' || path.includes('home')) return 'home';
    if (path.includes('service') || path.includes('leistung')) return 'service';
    if (path.includes('about') || path.includes('über-uns') || path.includes('ueber-uns')) return 'about';
    if (path.includes('contact') || path.includes('kontakt')) return 'contact';
    if (path.includes('faq') || path.includes('frag-antwort')) return 'faq';
    if (path.includes('blog') || path.includes('news') || path.includes('artikel')) return 'blog';

    return 'other';
  }

  /**
   * Home Page Schema
   */
  private addHomeSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "ZOE Solar - Photovoltaik für Unternehmen",
      "description": "Professionelle Solaranlagen und Photovoltaik-Lösungen für Unternehmen in ganz Deutschland",
      "url": "https://zoe-solar.de",
      "mainEntity": {
        "@type": "LocalBusiness",
        "name": "ZOE Solar GmbH"
      },
      "about": {
        "@type": "Thing",
        "name": "Photovoltaik für Unternehmen"
      },
      "slogan": "Ihr Partner für gewerbliche Solaranlagen"
    };

    this.addSchema(schema);
  }

  /**
   * Service Page Schema
   */
  private addServiceSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Gewerbliche Photovoltaik-Anlagen",
      "description": "Planung, Installation und Wartung von professionellen Solaranlagen für Unternehmen",
      "provider": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH",
        "url": "https://zoe-solar.de"
      },
      "serviceType": "Photovoltaik Installation",
      "areaServed": "Germany",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solaranlagen Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Solarberatung",
              "description": "Professionelle Beratung für Solarprojekte"
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "EUR",
              "price": "0",
              "description": "Kostenlose Erstberatung"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Photovoltaik Installation",
              "description": "Vollständige Installation von Solaranlagen"
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "EUR",
              "price": "auf Anfrage",
              "description": "Individuelle Preisgestaltung"
            }
          }
        ]
      }
    };

    this.addSchema(schema);
  }

  /**
   * About Page Schema
   */
  private addAboutSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Über ZOE Solar",
      "description": "Erfahren Sie mehr über ZOE Solar - Ihren Experten für gewerbliche Photovoltaik",
      "url": "https://zoe-solar.de/ueber-uns",
      "mainEntity": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH",
        "foundingDate": "2015",
        "description": "Experte für gewerbliche Photovoltaik-Anlagen in Deutschland"
      }
    };

    this.addSchema(schema);
  }

  /**
   * Contact Page Schema
   */
  private addContactSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Kontakt ZOE Solar",
      "description": "Kontaktieren Sie ZOE Solar für eine kostenlose Beratung zu Ihrer Solaranlage",
      "url": "https://zoe-solar.de/kontakt",
      "mainEntity": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": "+49 30 12345678",
          "email": "info@zoe-solar.de",
          "availableLanguage": ["German", "English"],
          "hoursAvailable": "Mo-Fr 09:00-18:00"
        }
      }
    };

    this.addSchema(schema);
  }

  /**
   * FAQ Page Schema
   */
  private addFAQSchema(): void {
    const faqs = this.getFAQData();

    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    this.addSchema(schema);
  }

  /**
   * FAQ Daten für deutsche Solarbranche
   */
  private getFAQData(): Array<{question: string, answer: string}> {
    return [
      {
        question: "Was kostet eine gewerbliche Solaranlage?",
        answer: "Die Kosten für eine gewerbliche Solaranlage variieren je nach Größe und Leistung. Durchschnittlich liegen die Investitionskosten zwischen 1.000 und 1.500 Euro pro Kilowatt-Peak. Eine detaillierte Kostenanalyse erstellen wir Ihnen gerne in einem kostenlosen Beratungsgespräch."
      },
      {
        question: "Welche Förderungen gibt es für gewerbliche Photovoltaik?",
        answer: "Für gewerbliche Photovoltaikanlagen gibt es verschiedene Förderprogramme. Die KfW bietet zinsgünstige Kredite, und es gibt Zuschüsse von der BAFA für Solaranlagen mit Batteriespeicher. Unsere Experten beraten Sie zu allen verfügbaren Fördermöglichkeiten."
      },
      {
        question: "Wie hoch ist die Rendite bei einer Solaranlage?",
        answer: "Die Rendite einer Solaranlage hängt von verschiedenen Faktoren ab wie Standort, Ausrichtung und Größe. Typischerweise liegt die Rendite bei gewerblichen Anlagen zwischen 8 und 12% pro Jahr. Wir erstellen für Sie eine exakte Rentabilitätsberechnung."
      },
      {
        question: "Wie lange dauert die Installation einer Solaranlage?",
        answer: "Die eigentliche Montage einer Solaranlage dauert in der Regel 1-3 Tage, je nach Größe des Projekts. Die gesamte Planungsphase mit Genehmigung und Anschluss dauert meist 2-4 Monate."
      },
      {
        question: "Welche Wartung benötigt eine Solaranlage?",
        answer: "Solaranlagen sind sehr wartungsarm. Wir empfehlen eine jährliche Kontrolle und Reinigung der Module. Die meisten Hersteller geben 25 Jahre Leistungsgarantie auf die Module und 10-15 Jahre auf die Wechselrichter."
      }
    ];
  }

  /**
   * Blog/Article Schema
   */
  private addBlogSchema(): void {
    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "ZOE Solar Photovoltaik Blog",
      "description": "Aktuelle Informationen und Ratgeber rund um Photovoltaik und Solaranlagen für Unternehmen",
      "url": "https://zoe-solar.de/blog",
      "publisher": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      },
      "inLanguage": "de-DE",
      "about": {
        "@type": "Thing",
        "name": "Photovoltaik"
      }
    };

    this.addSchema(schema);
  }

  /**
   * Breadcrumb Schema
   */
  private addBreadcrumbSchema(): void {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Startseite",
        "item": "https://zoe-solar.de"
      }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment;
      const position = index + 2;
      const name = this.capitalizeSegment(segment);

      breadcrumbs.push({
        "@type": "ListItem",
        "position": position,
        "name": name,
        "item": `https://zoe-solar.de${currentPath}`
      });
    });

    const schema: SchemaType = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };

    this.addSchema(schema);
  }

  /**
   * Segment für Breadcrumb formatieren
   */
  private capitalizeSegment(segment: string): string {
    const replacements: {[key: string]: string} = {
      'ueber-uns': 'Über uns',
      'kontakt': 'Kontakt',
      'service': 'Services',
      'blog': 'Blog',
      'faq': 'FAQ'
    };

    return replacements[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  /**
   * Schema zum DOM hinzufügen
   */
  private addSchema(schema: SchemaType): void {
    // Prüfen ob Schema bereits existiert
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    const schemaJson = JSON.stringify(schema);

    for (const existing of existingSchemas) {
      if (existing.textContent === schemaJson) {
        return; // Schema existiert bereits
      }
    }

    // Neues Schema hinzufügen
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    console.log(`✅ Schema hinzugefügt: ${schema['@type']}`);
  }

  /**
   * Validiert alle Schemas
   */
  async validateSchemas(): Promise<{valid: number, invalid: number, errors: string[]}> {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];

    schemas.forEach((schema, index) => {
      try {
        const data = JSON.parse(schema.textContent || '{}');

        // Grundlegende Validierung
        if (!data['@context'] || !data['@type']) {
          throw new Error('Missing @context or @type');
        }

        validCount++;
      } catch (error) {
        invalidCount++;
        errors.push(`Schema ${index + 1}: ${error}`);
      }
    });

    return {
      valid: validCount,
      invalid: invalidCount,
      errors: errors
    };
  }

  /**
   * Entfernt alle Schemas
   */
  clearAllSchemas(): void {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    schemas.forEach(schema => schema.remove());
    console.log('🗑️ Alle Schemas entfernt');
  }
}

// Export
export default new StructuredDataService();