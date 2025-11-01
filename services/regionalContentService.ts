/**
 * Multi-Regional Content Service
 * Implementiert dynamische Content-Generierung basierend auf Standort, Sprache und regionalen Besonderheiten
 */

export interface RegionalConfig {
  country: string;
  region: string;
  language: string;
  currency: string;
  timezone: string;
  phonePrefix: string;
  dateFormat: string;
  decimalSeparator: string;
  thousandsSeparator: string;
}

export interface RegionalContent {
  [key: string]: {
    marketData: {
      averageSystemCost: number;
      averagePaybackPeriod: number;
      feedInTariff: number;
      electricityPrice: number;
      sunlightHours: number;
      co2Savings: number;
      governmentIncentives: string[];
    };
    localContent: {
      greetings: string[];
      regionalReferences: string[];
      localProjects: Array<{
        name: string;
        location: string;
        capacity: number;
        date: string;
        description: string;
      }>;
      localTestimonials: Array<{
        name: string;
        location: string;
        rating: number;
        text: string;
        date: string;
      }>;
    };
    regulatoryInfo: {
      permitsRequired: string[];
      buildingCodes: string[];
      gridConnection: string;
      netMetering: string;
      taxIncentives: string[];
      localRegulations: string[];
    };
    contactInfo: {
      localPhone: string;
      email: string;
      address: string;
      officeHours: string;
      serviceAreas: string[];
    };
  };
}

export class RegionalContentService {
  private regionalConfigs: RegionalConfig[] = [
    {
      country: 'DE',
      region: 'BY',
      language: 'de',
      currency: 'EUR',
      timezone: 'Europe/Berlin',
      phonePrefix: '+49',
      dateFormat: 'DD.MM.YYYY',
      decimalSeparator: ',',
      thousandsSeparator: '.'
    },
    {
      country: 'DE',
      region: 'BW',
      language: 'de',
      currency: 'EUR',
      timezone: 'Europe/Berlin',
      phonePrefix: '+49',
      dateFormat: 'DD.MM.YYYY',
      decimalSeparator: ',',
      thousandsSeparator: '.'
    },
    {
      country: 'AT',
      region: 'W',
      language: 'de',
      currency: 'EUR',
      timezone: 'Europe/Vienna',
      phonePrefix: '+43',
      dateFormat: 'DD.MM.YYYY',
      decimalSeparator: ',',
      thousandsSeparator: '.'
    },
    {
      country: 'CH',
      region: 'ZH',
      language: 'de',
      currency: 'CHF',
      timezone: 'Europe/Zurich',
      phonePrefix: '+41',
      dateFormat: 'DD.MM.YYYY',
      decimalSeparator: '.',
      thousandsSeparator: "'"
    }
  ];

  private regionalContent: RegionalContent = {
    'DE-BY': {
      marketData: {
        averageSystemCost: 1450,
        averagePaybackPeriod: 10,
        feedInTariff: 0.081,
        electricityPrice: 0.32,
        sunlightHours: 1650,
        co2Savings: 650,
        governmentIncentives: ['KfW Förderung', 'BAFA Zuschuss', 'Bayern Solarförderung']
      },
      localContent: {
        greetings: ['Servus!', 'Grüß Gott!', 'Guten Tag aus Bayern!'],
        regionalReferences: [
          'Bayern - Solarland Nummer 1 in Deutschland',
          'Optimale Bedingungen in Alpensüdseite',
          'Starker Ausbau im Chiemgau und Allgäu'
        ],
        localProjects: [
          {
            name: 'Landwirtschaftliche Solaranlage',
            location: 'München-Land',
            capacity: 250,
            date: '2024-10-15',
            description: 'Agri-PV Anlage mit Doppelnutzung für Landwirtschaft'
          },
          {
            name: 'Gewerbe-Dachanlage',
            location: 'Augsburg',
            capacity: 500,
            date: '2024-09-20',
            description: 'Industrielle Solaranlage für Produktionsbetrieb'
          }
        ],
        localTestimonials: [
          {
            name: 'Michael Huber',
            location: 'Rosenheim',
            rating: 5,
            text: 'Exzellente Beratung und professionelle Montage. Unsere Solaranlage in Rosenheim läuft perfekt!',
            date: '2024-10-01'
          }
        ]
      },
      regulatoryInfo: {
        permitsRequired: ['Baugenehmigung bei Denkmalschutz', 'Vereinbarung mit Netzbetreiber'],
        buildingCodes: ['Landesbauordnung Bayern', 'Energiewendegesetz'],
        gridConnection: 'Anmeldung bei lokalem Netzbetreiber erforderlich',
        netMetering: 'Einspeisevergütung nach EEG',
        taxIncentives: ['Steuerliche Vorteile § 21 EStG', 'MWST-Satz 19% auf Anlagen'],
        localRegulations: ['Bayerische Solarförderung', 'Kommunale Förderprogramme']
      },
      contactInfo: {
        localPhone: '+49 89 12345678',
        email: 'bayern@zoe-solar.de',
        address: 'Münchner Str. 123, 81549 München',
        officeHours: 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
        serviceAreas: ['Oberbayern', 'Niederbayern', 'Schwaben', 'Oberpfalz', 'Franken']
      }
    },
    'DE-BW': {
      marketData: {
        averageSystemCost: 1400,
        averagePaybackPeriod: 9.5,
        feedInTariff: 0.078,
        electricityPrice: 0.34,
        sunlightHours: 1750,
        co2Savings: 680,
        governmentIncentives: ['KfW Förderung', 'BAFA Zuschuss', 'BW Solarförderung']
      },
      localContent: {
        greetings: ['Grüß Gott!', 'Guten Tag aus Baden-Württemberg!'],
        regionalReferences: [
          'Baden-Württemberg - Technologiestandort Deutschland',
          'Hohe Sonneneinstrahlung im Rheintal',
          'Innovative Solarprojekte in Stuttgart und Karlsruhe'
        ],
        localProjects: [
          {
            name: 'Carport Solaranlage',
            location: 'Stuttgart',
            capacity: 45,
            date: '2024-10-10',
            description: 'Intelligente Carport-Lösung mit E-Mobilität'
          },
          {
            name: 'Gemeinde-Solarpark',
            location: 'Heidelberg',
            capacity: 2000,
            date: '2024-08-15',
            description: 'Gemeinschaftsprojekt für nachhaltige Energieversorgung'
          }
        ],
        localTestimonials: [
          {
            name: 'Sabine Müller',
            location: 'Heidelberg',
            rating: 5,
            text: 'Top Beratung in Baden-Württemberg! Unsere Anlage produziert mehr als erwartet.',
            date: '2024-09-15'
          }
        ]
      },
      regulatoryInfo: {
        permitsRequired: ['Baugenehmigung bei bestimmten Anlagengrößen'],
        buildingCodes: ['Landesbauordnung Baden-Württemberg'],
        gridConnection: 'Schnelle Netzanbindung in BW',
        netMetering: 'Einspeisevergütung mit BW-Zuschlag',
        taxIncentives: ['Landesförderung BW', 'Steuerliche Vergünstigungen'],
        localRegulations: ['Baden-Württemberg Klimaschutzgesetz']
      },
      contactInfo: {
        localPhone: '+49 711 98765432',
        email: 'bw@zoe-solar.de',
        address: 'Königstraße 456, 70173 Stuttgart',
        officeHours: 'Mo-Fr 07:30-18:30',
        serviceAreas: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Heidelberg', 'Freiburg']
      }
    },
    'AT-W': {
      marketData: {
        averageSystemCost: 1600,
        averagePaybackPeriod: 11,
        feedInTariff: 0.09,
        electricityPrice: 0.28,
        sunlightHours: 1900,
        co2Savings: 720,
        governmentIncentives: ['Österreichische Solarförderung', 'Klimaförderung', 'Wohnbauförderung']
      },
      localContent: {
        greetings: ['Servus!', 'Grüß Gott aus Österreich!', 'Guten Tag aus Wien!'],
        regionalReferences: [
          'Österreich - Vorreiter in erneuerbaren Energien',
          'Exzellente Bedingungen im Osten Österreichs',
          'Starke staatliche Förderprogramme'
        ],
        localProjects: [
          {
            name: 'Wohnhaus-Solaranlage',
            location: 'Wien',
            capacity: 35,
            date: '2024-10-05',
            description: 'Moderne Anlage mit Speicherlösung'
          }
        ],
        localTestimonials: [
          {
            name: 'Franz Huber',
            location: 'Wien',
            rating: 5,
            text: 'Perfekte Betreuung in Wien! Die Förderberatung war besonders hilfreich.',
            date: '2024-09-20'
          }
        ]
      },
      regulatoryInfo: {
        permitsRequired: ['Bewilligungspflicht je nach Anlagengröße'],
        buildingCodes: ['Österreichische Bauordnung'],
        gridConnection: 'Anmeldung bei Ökostromabwicklungsstelle',
        netMetering: 'Einspeisetarif gemäß Ökostromgesetz',
        taxIncentives: ['Investitionsabsetzbetrag', 'Förderungen aus Klimafonds'],
        localRegulations: ['Wiener Klimaschutzprogramm']
      },
      contactInfo: {
        localPhone: '+43 1 23456789',
        email: 'oesterreich@zoe-solar.de',
        address: 'Kärntner Straße 789, 1010 Wien',
        officeHours: 'Mo-Fr 08:00-18:00',
        serviceAreas: ['Wien', 'Niederösterreich', 'Burgenland', 'Oberösterreich']
      }
    },
    'CH-ZH': {
      marketData: {
        averageSystemCost: 2200,
        averagePaybackPeriod: 12,
        feedInTariff: 0.12,
        electricityPrice: 0.25,
        sunlightHours: 1600,
        co2Savings: 550,
        governmentIncentives: ['KEV-System', 'Kantonale Förderprogramme', 'Einmalvergütung']
      },
      localContent: {
        greetings: ['Grüezi!', 'Guten Tag aus der Schweiz!'],
        regionalReferences: [
          'Schweiz - Pionier in erneuerbaren Energien',
          'Stabile politische Rahmenbedingungen',
          'Hohe Qualitätssstandards'
        ],
        localProjects: [
          {
            name: 'Berg-Solaranlage',
            location: 'Zürich',
            capacity: 120,
            date: '2024-09-25',
            description: 'Hochperformante Anlage im Berggebiet'
          }
        ],
        localTestimonials: [
          {
            name: 'Peter Meier',
            location: 'Zürich',
            rating: 5,
            text: 'Exzellente Qualität in der Schweiz! Die Betreuung ist erstklassig.',
            date: '2024-10-01'
          }
        ]
      },
      regulatoryInfo: {
        permitsRequired: ['Baubewilligung je nach Kanton'],
        buildingCodes: ['Schweizer Bauordnungen'],
        gridConnection: 'Anmeldung beim lokalen Elektrizitätswerk',
        netMetering: 'Einspeisevergütung gemäss KEV',
        taxIncentives: ['Mehrwertsteuerbefreiung', 'Kantonale Beiträge'],
        localRegulations: ['Energiegesetz des Kantons Zürich']
      },
      contactInfo: {
        localPhone: '+41 44 9876543',
        email: 'schweiz@zoe-solar.de',
        address: 'Bahnhofstrasse 100, 8001 Zürich',
        officeHours: 'Mo-Fr 08:00-17:30',
        serviceAreas: ['Zürich', 'Bern', 'Basel', 'Genf', 'Luzern']
      }
    }
  };

  /**
   * Holt die Regional-Konfiguration basierend auf Country und Region
   */
  getRegionalConfig(country: string, region: string): RegionalConfig | null {
    return this.regionalConfigs.find(config =>
      config.country === country && config.region === region
    ) || null;
  }

  /**
   * Generiert regionalen Content für eine spezifische Region
   */
  async generateRegionalContent(country: string, region: string, contentType: string = 'service'): Promise<any> {
    const regionKey = `${country}-${region}`;
    const content = this.regionalContent[regionKey];
    const config = this.getRegionalConfig(country, region);

    if (!content || !config) {
      throw new Error(`No content found for region ${regionKey}`);
    }

    switch (contentType) {
      case 'service':
        return this.generateServicePage(content, config, regionKey);
      case 'pricing':
        return this.generatePricingPage(content, config, regionKey);
      case 'faq':
        return this.generateFAQPage(content, config, regionKey);
      case 'contact':
        return this.generateContactPage(content, config, regionKey);
      case 'landing':
        return this.generateLandingPage(content, config, regionKey);
      default:
        return content;
    }
  }

  /**
   * Generiert Service-Seite mit regionalen Anpassungen
   */
  private generateServicePage(content: any, config: RegionalConfig, regionKey: string) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `ZOE Solar ${config.region} - Photovoltaik Lösungen`,
      "description": `Professionelle Solaranlagen für ${config.region}. Durchschnittliche Kosten: ${this.formatCurrency(content.marketData.averageSystemCost, config)} pro kWp.`,
      "provider": {
        "@type": "Organization",
        "name": "ZOE Solar",
        "url": "https://zoe-solar.de"
      },
      "areaServed": {
        "@type": "Place",
        "name": config.region,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": config.country,
          "addressRegion": config.region
        }
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solar Services",
        "numberOfItems": 5,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Solaranlage Planung",
              "description": "Professionelle Analyse und Planung"
            },
            "price": "0",
            "priceCurrency": config.currency
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Solaranlage Installation",
              "description": "Vollständige Montage durch zertifizierte Partner"
            },
            "price": `${content.marketData.averageSystemCost * 10}`,
            "priceCurrency": config.currency
          }
        ]
      },
      "keywords": this.generateKeywords(content, config),
      "localContent": content.localContent,
      "marketData": content.marketData,
      "contactInfo": content.contactInfo,
      "regulatoryInfo": content.regulatoryInfo
    };
  }

  /**
   * Generiert Preis-Seite mit regionalen Werten
   */
  private generatePricingPage(content: any, config: RegionalConfig, regionKey: string) {
    const systemSizes = [5, 10, 15, 20]; // kWp
    const offers = systemSizes.map(size => ({
      "@type": "Offer",
      "name": `Solaranlage ${size} kWp`,
      "description": `Vollständige ${size} kWp Solaranlage für ${config.region}`,
      "price": this.formatCurrency(content.marketData.averageSystemCost * size, config),
      "priceCurrency": config.currency,
      "availability": "https://schema.org/InStock",
      "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      "seller": {
        "@type": "Organization",
        "name": "ZOE Solar"
      },
      "itemOffered": {
        "@type": "Product",
        "name": `${size} kWp Solaranlage`,
        "category": "Solar Energy System",
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Jährliche Erzeugung",
            "value": `${Math.round(size * content.marketData.sunlightHours)} kWh`
          },
          {
            "@type": "PropertyValue",
            "name": "Amortisationszeit",
            "value": `${content.marketData.averagePaybackPeriod} Jahre`
          },
          {
            "@type": "PropertyValue",
            "name": "CO2-Einsparung",
            "value": `${Math.round(size * content.marketData.co2Savings)} kg/Jahr`
          }
        ]
      }
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Solaranlage Preise ${config.region}`,
      "description": `Aktuelle Preise für Solaranlagen in ${config.region}`,
      "numberOfItems": offers.length,
      "itemListElement": offers,
      "marketData": content.marketData,
      "config": config
    };
  }

  /**
   * Generiert FAQ-Seite mit regionalen Fragen
   */
  private generateFAQPage(content: any, config: RegionalConfig, regionKey: string) {
    const regionalFAQs = [
      {
        "@type": "Question",
        "name": `Wie hoch sind die Kosten für eine Solaranlage in ${config.region}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In ${config.region} liegen die Durchschnittskosten bei ${this.formatCurrency(content.marketData.averageSystemCost, config)} pro kWp. Für eine typische 10 kWp Anlage erwarten Sie Kosten von ${this.formatCurrency(content.marketData.averageSystemCost * 10, config)}.`
        }
      },
      {
        "@type": "Question",
        "name": `Welche Förderungen gibt es in ${config.region}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In ${config.region} stehen Ihnen folgende Förderungen zur Verfügung: ${content.marketData.governmentIncentives.join(', ')}. Wir beraten Sie gerne zur optimalen Nutzung.`
        }
      },
      {
        "@type": "Question",
        "name": `Wie lange ist die Amortisationszeit in ${config.region}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Die durchschnittliche Amortisationszeit in ${config.region} beträgt ${content.marketData.averagePaybackPeriod} Jahre bei aktuellen Strompreisen von ${this.formatCurrency(content.marketData.electricityPrice, config)} pro kWh.`
        }
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": regionalFAQs,
      "about": {
        "@type": "Thing",
        "name": `Solaranlagen ${config.region}`,
        "description": `Regionale Informationen für Solaranlagen in ${config.region}`
      }
    };
  }

  /**
   * Generiert Kontakt-Seite mit regionalen Informationen
   */
  private generateContactPage(content: any, config: RegionalConfig, regionKey: string) {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `ZOE Solar ${config.region}`,
      "description": `Ihr Solar-Experte für ${config.region} und Umgebung`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": content.contactInfo.address,
        "addressLocality": config.region,
        "addressCountry": config.country,
        "postalCode": this.extractPostalCode(content.contactInfo.address)
      },
      "telephone": content.contactInfo.localPhone,
      "email": content.contactInfo.email,
      "openingHours": this.parseOpeningHours(content.contactInfo.officeHours),
      "areaServed": content.contactInfo.serviceAreas.map(area => ({
        "@type": "Place",
        "name": area
      })),
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": this.getRegionCoordinates(config.region).lat,
        "longitude": this.getRegionCoordinates(config.region).lng
      },
      "sameAs": [
        "https://zoe-solar.de",
        "https://facebook.com/zoesolar",
        "https://linkedin.com/company/zoe-solar"
      ]
    };
  }

  /**
   * Generiert Landing-Page mit vollem regionalen Content
   */
  private generateLandingPage(content: any, config: RegionalConfig, regionKey: string) {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Solaranlagen ${config.region} - ZOE Solar`,
      "description": `Professionelle Solaranlagen in ${config.region}. ${content.localContent.greetings[0]} Wir sind Ihr lokaler Experte.`,
      "url": `https://zoe-solar.de/${config.country.toLowerCase()}/${config.region.toLowerCase()}`,
      "about": {
        "@type": "Thing",
        "name": "Solar Energy Solutions",
        "description": `Solaranlagen und Photovoltaik-Lösungen für ${config.region}`
      },
      "mainEntity": {
        "@type": "Service",
        "name": "Solaranlage Installation",
        "description": `Vollständige Solaranlagen für ${config.region}`,
        "provider": {
          "@type": "Organization",
          "name": "ZOE Solar"
        },
        "areaServed": {
          "@type": "Place",
          "name": config.region
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Startseite",
            "item": "https://zoe-solar.de"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name:": config.country,
            "item": `https://zoe-solar.de/${config.country.toLowerCase()}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": config.region,
            "item": `https://zoe-solar.de/${config.country.toLowerCase()}/${config.region.toLowerCase()}`
          }
        ]
      },
      "regionalContent": content,
      "config": config
    };
  }

  /**
   * Formatiert Währung basierend auf Regional-Konfiguration
   */
  private formatCurrency(amount: number, config: RegionalConfig): string {
    const formatter = new Intl.NumberFormat(`${config.language}-${config.country}`, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  }

  /**
   * Generiert Keywords basierend auf regionalem Content
   */
  private generateKeywords(content: any, config: RegionalConfig): string[] {
    const baseKeywords = [
      'Solaranlage',
      'Photovoltaik',
      'Solarstrom',
      'erneuerbare Energien'
    ];

    const regionalKeywords = [
      `Solaranlage ${config.region}`,
      `Photovoltaik ${config.region}`,
      `Solaranlagen ${config.country}`,
      `${config.region} Solar`
    ];

    const marketKeywords = [
      `Solaranlage Kosten ${config.region}`,
      `Photovoltaik Förderung ${config.region}`,
      `Solarstrom Preis ${config.region}`
    ];

    return [...baseKeywords, ...regionalKeywords, ...marketKeywords];
  }

  /**
   * Extrahiert Postleitzahl aus Adresse
   */
  private extractPostalCode(address: string): string {
    const match = address.match(/\b\d{4,5}\b/);
    return match ? match[0] : '';
  }

  /**
   * Parst Öffnungszeiten
   */
  private parseOpeningHours(hours: string): string[] {
    // Vereinfachte Implementierung
    return [
      "Mo-Fr 08:00-18:00",
      "Sa 09:00-14:00",
      "So Closed"
    ];
  }

  /**
   * Holt Region-Koordinaten
   */
  private getRegionCoordinates(region: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'BY': { lat: 48.7904, lng: 11.4979 },
      'BW': { lat: 48.7758, lng: 9.1829 },
      'W': { lat: 48.2082, lng: 16.3738 },
      'ZH': { lat: 47.3769, lng: 8.5417 }
    };
    return coordinates[region] || { lat: 51.1657, lng: 10.4515 };
  }
}

// Export Singleton Instance
export const regionalContentService = new RegionalContentService();