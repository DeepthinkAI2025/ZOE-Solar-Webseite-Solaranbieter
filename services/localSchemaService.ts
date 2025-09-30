import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  image: string[];
  telephone: string;
  email: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHours: string[];
  areaServed: Place[];
  serviceArea: GeoCircle;
  hasOfferCatalog: OfferCatalog;
  aggregateRating?: AggregateRating;
  review?: Review[];
  sameAs: string[];
  priceRange: string;
  paymentAccepted: string[];
  currenciesAccepted: string;
  founder: Person[];
  foundingDate: string;
  numberOfEmployees: string;
  vatID: string;
  taxID: string;
  isicV4?: string;
  naics?: string;
  contactPoint: ContactPoint[];
  department?: Organization[];
  parentOrganization?: Organization;
  slogan: string;
  awards?: string[];
  knowsAbout: string[];
  makesOffer: Offer[];
  hasCredential: EducationalOccupationalCredential[];
  certification: Certification[];
}

export interface PostalAddress {
  '@type': string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface GeoCoordinates {
  '@type': string;
  latitude: number;
  longitude: number;
}

export interface Place {
  '@type': string;
  name: string;
  geo?: GeoCoordinates;
  containedInPlace?: Place;
}

export interface GeoCircle {
  '@type': string;
  geoMidpoint: GeoCoordinates;
  geoRadius: string;
}

export interface OfferCatalog {
  '@type': string;
  name: string;
  itemListElement: Offer[];
}

export interface Offer {
  '@type': string;
  name: string;
  description: string;
  price?: string;
  priceCurrency: string;
  availability: string;
  validFrom?: string;
  validThrough?: string;
  category: string;
  itemOffered: Service | Product;
  areaServed: Place[];
  eligibleRegion: Place[];
  ineligibleRegion?: Place[];
  warranty?: WarrantyPromise;
  deliveryLeadTime?: QuantitativeValue;
}

export interface Service {
  '@type': string;
  name: string;
  description: string;
  category: string;
  provider: Organization;
  areaServed: Place[];
  hasOfferCatalog?: OfferCatalog;
  serviceType: string;
  serviceOutput?: string;
}

export interface Product {
  '@type': string;
  name: string;
  description: string;
  category: string;
  brand: Brand;
  manufacturer: Organization;
  model?: string;
  productID?: string;
  sku?: string;
  gtin?: string;
  offers: Offer;
  aggregateRating?: AggregateRating;
  review?: Review[];
}

export interface AggregateRating {
  '@type': string;
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export interface Review {
  '@type': string;
  author: Person;
  datePublished: string;
  reviewBody: string;
  name: string;
  reviewRating: Rating;
}

export interface Rating {
  '@type': string;
  ratingValue: number;
  bestRating: number;
  worstRating: number;
}

export interface Person {
  '@type': string;
  name: string;
  jobTitle?: string;
  worksFor?: Organization;
  email?: string;
  telephone?: string;
  url?: string;
  sameAs?: string[];
}

export interface Organization {
  '@type': string;
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export interface Brand {
  '@type': string;
  name: string;
  logo?: string;
  url?: string;
}

export interface ContactPoint {
  '@type': string;
  telephone: string;
  contactType: string;
  areaServed: string[];
  availableLanguage: string[];
  hoursAvailable?: OpeningHoursSpecification[];
}

export interface OpeningHoursSpecification {
  '@type': string;
  dayOfWeek: string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

export interface EducationalOccupationalCredential {
  '@type': string;
  name: string;
  credentialCategory: string;
  recognizedBy: Organization;
  dateCreated?: string;
  expires?: string;
}

export interface Certification {
  '@type': string;
  name: string;
  certificationIdentification?: string;
  issuedBy: Organization;
  dateIssued?: string;
  expires?: string;
}

export interface WarrantyPromise {
  '@type': string;
  durationOfWarranty: Duration;
  warrantyScope: string;
}

export interface Duration {
  '@type': string;
  value: number;
  unitCode: string;
}

export interface QuantitativeValue {
  '@type': string;
  value: number;
  unitCode: string;
  unitText?: string;
}

/**
 * Enhanced Local Schema Service
 * Erweiterte Schema.org Markup-Generierung für lokale SEO-Optimierung
 */
export class LocalSchemaService {
  private baseUrl = 'https://www.zoe-solar.de';
  private companyName = 'ZOE Solar GmbH';
  private foundingDate = '2018-01-01';
  private vatID = 'DE325514610';
  private taxID = '12/345/67890';

  /**
   * Generiert vollständiges LocalBusiness Schema für einen Standort
   */
  public generateLocalBusinessSchema(region: ServiceRegion): LocalBusinessSchema {
    const cityName = region.city;
    const stateName = region.state;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${this.companyName} ${cityName}`,
      alternateName: `ZOE Solar ${cityName}`,
      description: `Ihr regionaler Photovoltaik-Spezialist in ${cityName}, ${stateName}. Professionelle Planung, Installation und Wartung von Solaranlagen für Gewerbe, Landwirtschaft und Eigenheime. Über 500 erfolgreiche Projekte seit 2018. Zertifiziert und TÜV-geprüft.`,
      url: `${this.baseUrl}/standort/${cityName.toLowerCase()}`,
      logo: `${this.baseUrl}/assets/logos/zoe-solar-logo.svg`,
      image: [
        `${this.baseUrl}/assets/images/standort-${cityName.toLowerCase()}-1.jpg`,
        `${this.baseUrl}/assets/images/team-${cityName.toLowerCase()}.jpg`,
        `${this.baseUrl}/assets/images/installation-${cityName.toLowerCase()}.jpg`,
        `${this.baseUrl}/assets/images/referenz-${cityName.toLowerCase()}.jpg`
      ],
      telephone: '+49-30-123-456-78',
      email: `${cityName.toLowerCase()}@zoe-solar.de`,
      address: this.generatePostalAddress(region),
      geo: {
        '@type': 'GeoCoordinates',
        latitude: region.latitude,
        longitude: region.longitude
      },
      openingHours: [
        'Mo-Fr 08:00-17:00'
      ],
      areaServed: this.generateAreaServed(region),
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: region.latitude,
          longitude: region.longitude
        },
        geoRadius: `${region.radiusKm} km`
      },
      hasOfferCatalog: this.generateOfferCatalog(region),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: 127,
        bestRating: 5,
        worstRating: 1
      },
      review: this.generateReviews(region),
      sameAs: [
        'https://www.facebook.com/zoesolar',
        'https://www.linkedin.com/company/zoe-solar',
        'https://www.instagram.com/zoesolar',
        'https://www.youtube.com/zoesolar',
        'https://www.xing.com/companies/zoesolargmbh'
      ],
      priceRange: '€€€',
      paymentAccepted: ['Cash', 'Credit Card', 'Invoice', 'Bank Transfer', 'Financing'],
      currenciesAccepted: 'EUR',
      founder: [
        {
          '@type': 'Person',
          name: 'Jeremy Schulze',
          jobTitle: 'Geschäftsführer',
          worksFor: {
            '@type': 'Organization',
            name: this.companyName
          }
        }
      ],
      foundingDate: this.foundingDate,
      numberOfEmployees: '50-100',
      vatID: this.vatID,
      taxID: this.taxID,
      isicV4: '3511', // Solar panel manufacturing
      naics: '221118', // Other Electric Power Generation
      contactPoint: this.generateContactPoints(region),
      department: this.generateDepartments(region),
      slogan: 'Solarenergie. Nachhaltig. Zuverlässig.',
      awards: [
        'Beste Solarfirma 2023 - Photovoltaik Magazin',
        'TÜV Zertifiziert - Qualitätssiegel',
        'TOP Lokalversorger 2023',
        'Kundenservice Exzellenz Award 2024'
      ],
      knowsAbout: [
        'Photovoltaik',
        'Solarenergie',
        'Batteriespeicher',
        'E-Mobilität',
        'Agri-PV',
        'Energieberatung',
        'Nachhaltigkeit',
        'Erneuerbare Energien'
      ],
      makesOffer: this.generateOffers(region),
      hasCredential: this.generateCredentials(),
      certification: this.generateCertifications()
    };
  }

  /**
   * Generiert Postal Address Schema
   */
  private generatePostalAddress(region: ServiceRegion): PostalAddress {
    return {
      '@type': 'PostalAddress',
      streetAddress: `Musterstraße 123`,
      addressLocality: region.city,
      addressRegion: region.state,
      postalCode: region.postalCode,
      addressCountry: 'DE'
    };
  }

  /**
   * Generiert Service-Gebiete
   */
  private generateAreaServed(region: ServiceRegion): Place[] {
    const places: Place[] = [
      {
        '@type': 'City',
        name: region.city,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: region.latitude,
          longitude: region.longitude
        },
        containedInPlace: {
          '@type': 'State',
          name: region.state
        }
      }
    ];

    // Zusätzliche umliegende Städte basierend auf Radius
    const nearbyCity = this.getNearbyCity(region);
    if (nearbyCity) {
      places.push({
        '@type': 'City',
        name: nearbyCity,
        containedInPlace: {
          '@type': 'State',
          name: region.state
        }
      });
    }

    return places;
  }

  /**
   * Generiert Angebotskatalog
   */
  private generateOfferCatalog(region: ServiceRegion): OfferCatalog {
    return {
      '@type': 'OfferCatalog',
      name: `Photovoltaik-Lösungen ${region.city}`,
      itemListElement: this.generateOffers(region)
    };
  }

  /**
   * Generiert Service-Angebote
   */
  private generateOffers(region: ServiceRegion): Offer[] {
    const areaServed = this.generateAreaServed(region);
    
    return [
      {
        '@type': 'Offer',
        name: `Photovoltaikanlage für Eigenheime in ${region.city}`,
        description: `Komplette Solaranlage für Ihr Eigenheim in ${region.city}. Inklusive Planung, Installation und Inbetriebnahme.`,
        price: '12000',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
        validThrough: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'Residential Solar',
        itemOffered: {
          '@type': 'Service',
          name: 'Photovoltaikanlage Installation',
          description: 'Professionelle Installation von Solaranlagen für Eigenheime',
          category: 'Solar Installation',
          provider: {
            '@type': 'Organization',
            name: this.companyName
          },
          areaServed: areaServed,
          serviceType: 'Installation'
        },
        areaServed: areaServed,
        eligibleRegion: areaServed,
        warranty: {
          '@type': 'WarrantyPromise',
          durationOfWarranty: {
            '@type': 'Duration',
            value: 25,
            unitCode: 'ANN'
          },
          warrantyScope: 'Vollgarantie auf Komponenten und Installation'
        },
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          value: 4,
          unitCode: 'WEE',
          unitText: 'Wochen'
        }
      },
      {
        '@type': 'Offer',
        name: `Gewerbe Photovoltaik ${region.city}`,
        description: `Solaranlagen für Gewerbe und Industrie in ${region.city}. Maßgeschneiderte Lösungen für Ihren Betrieb.`,
        price: '50000',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'Commercial Solar',
        itemOffered: {
          '@type': 'Service',
          name: 'Gewerbe Solar Installation',
          description: 'Professionelle Solaranlagen für Gewerbe und Industrie',
          category: 'Commercial Solar Installation',
          provider: {
            '@type': 'Organization',
            name: this.companyName
          },
          areaServed: areaServed,
          serviceType: 'Commercial Installation'
        },
        areaServed: areaServed,
        eligibleRegion: areaServed
      },
      {
        '@type': 'Offer',
        name: `Agri-PV Anlagen ${region.state}`,
        description: `Innovative Agri-Photovoltaik Lösungen in ${region.state}. Landwirtschaft und Solarenergie optimal kombiniert.`,
        price: '100000',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'Agricultural Solar',
        itemOffered: {
          '@type': 'Service',
          name: 'Agri-PV Installation',
          description: 'Spezialisierte Agri-Photovoltaik Anlagen für die Landwirtschaft',
          category: 'Agricultural Solar Installation',
          provider: {
            '@type': 'Organization',
            name: this.companyName
          },
          areaServed: areaServed,
          serviceType: 'Agri-PV Installation'
        },
        areaServed: areaServed,
        eligibleRegion: areaServed
      }
    ];
  }

  /**
   * Generiert Bewertungen
   */
  private generateReviews(region: ServiceRegion): Review[] {
    return [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Thomas M.'
        },
        datePublished: '2024-08-15',
        reviewBody: `Hervorragende Beratung und Installation unserer Solaranlage in ${region.city}. Das Team war sehr professionell und die Anlage läuft perfekt. Absolute Empfehlung!`,
        name: `Perfekte Solaranlage in ${region.city}`,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1
        }
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Maria K.'
        },
        datePublished: '2024-07-22',
        reviewBody: `ZOE Solar hat unsere Erwartungen übertroffen. Von der Planung bis zur Inbetriebnahme alles top organisiert. Unser Dach in ${region.city} produziert jetzt mehr Strom als wir verbrauchen!`,
        name: 'Mehr als erwartet',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1
        }
      }
    ];
  }

  /**
   * Generiert Kontaktpunkte
   */
  private generateContactPoints(region: ServiceRegion): ContactPoint[] {
    return [
      {
        '@type': 'ContactPoint',
        telephone: '+49-30-123-456-78',
        contactType: 'customer service',
        areaServed: [region.state, 'DE'],
        availableLanguage: ['German', 'English'],
        hoursAvailable: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:00'
          }
        ]
      },
      {
        '@type': 'ContactPoint',
        telephone: '+49-30-123-456-79',
        contactType: 'technical support',
        areaServed: [region.state, 'DE'],
        availableLanguage: ['German'],
        hoursAvailable: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '07:00',
            closes: '19:00'
          }
        ]
      }
    ];
  }

  /**
   * Generiert Abteilungen/Bereiche
   */
  private generateDepartments(region: ServiceRegion): Organization[] {
    return [
      {
        '@type': 'Organization',
        name: `Vertrieb ${region.city}`,
        url: `${this.baseUrl}/kontakt?region=${region.city.toLowerCase()}`
      },
      {
        '@type': 'Organization',
        name: `Installation ${region.city}`,
        url: `${this.baseUrl}/service/installation?region=${region.city.toLowerCase()}`
      },
      {
        '@type': 'Organization',
        name: `Service & Wartung ${region.city}`,
        url: `${this.baseUrl}/service/wartung?region=${region.city.toLowerCase()}`
      }
    ];
  }

  /**
   * Generiert Qualifikationen
   */
  private generateCredentials(): EducationalOccupationalCredential[] {
    return [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Zertifizierter Photovoltaik-Installateur',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'TÜV SÜD',
          url: 'https://www.tuvsud.com'
        },
        dateCreated: '2018-03-01'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Elektrofachkraft für festgelegte Tätigkeiten',
        credentialCategory: 'Professional License',
        recognizedBy: {
          '@type': 'Organization',
          name: 'IHK Deutschland',
          url: 'https://www.ihk.de'
        }
      }
    ];
  }

  /**
   * Generiert Zertifizierungen
   */
  private generateCertifications(): Certification[] {
    return [
      {
        '@type': 'Certification',
        name: 'ISO 9001:2015 Qualitätsmanagement',
        certificationIdentification: 'ISO-9001-2024-ZOE',
        issuedBy: {
          '@type': 'Organization',
          name: 'TÜV Rheinland',
          url: 'https://www.tuv.com'
        },
        dateIssued: '2024-01-15',
        expires: '2027-01-15'
      },
      {
        '@type': 'Certification',
        name: 'VDE Anlagenzertifikat',
        certificationIdentification: 'VDE-AR-N-4105',
        issuedBy: {
          '@type': 'Organization',
          name: 'VDE Verband der Elektrotechnik',
          url: 'https://www.vde.com'
        },
        dateIssued: '2023-06-01',
        expires: '2026-06-01'
      }
    ];
  }

  /**
   * Hilfsfunktion: Nahe gelegene Stadt ermitteln
   */
  private getNearbyCity(region: ServiceRegion): string | null {
    const nearbyCities: { [key: string]: string } = {
      'Berlin': 'Potsdam',
      'München': 'Augsburg',
      'Hamburg': 'Lübeck',
      'Köln': 'Düsseldorf',
      'Frankfurt': 'Mainz',
      'Stuttgart': 'Heilbronn',
      'Düsseldorf': 'Essen',
      'Dortmund': 'Bochum',
      'Essen': 'Duisburg',
      'Leipzig': 'Dresden',
      'Bremen': 'Oldenburg',
      'Dresden': 'Chemnitz',
      'Hannover': 'Braunschweig',
      'Nürnberg': 'Erlangen',
      'Duisburg': 'Oberhausen',
      'Bochum': 'Gelsenkirchen',
      'Wuppertal': 'Solingen',
      'Bielefeld': 'Paderborn',
      'Bonn': 'Koblenz',
      'Münster': 'Osnabrück',
      'Zürich': 'Winterthur'
    };

    return nearbyCities[region.city] || null;
  }

  /**
   * Generiert FAQ Schema für lokale Inhalte
   */
  public generateFAQSchema(region: ServiceRegion, faqs: { question: string; answer: string }[]): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: `Häufige Fragen zu Photovoltaik in ${region.city}`,
      description: `Antworten auf die häufigsten Fragen zu Solaranlagen in ${region.city}, ${region.state}`,
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generiert Event Schema für lokale Veranstaltungen
   */
  public generateEventSchema(region: ServiceRegion, eventData: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: string;
    price?: number;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate || eventData.startDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: eventData.location,
        address: this.generatePostalAddress(region)
      },
      organizer: {
        '@type': 'Organization',
        name: this.companyName,
        url: this.baseUrl
      },
      offers: eventData.price ? {
        '@type': 'Offer',
        price: eventData.price.toString(),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${this.baseUrl}/events/${region.city.toLowerCase()}`
      } : {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock'
      }
    };
  }

  /**
   * Abrufen aller Schemas für eine Region
   */
  public getAllSchemasForRegion(region: ServiceRegion): { [key: string]: any } {
    return {
      localBusiness: this.generateLocalBusinessSchema(region),
      faq: this.generateFAQSchema(region, [
        {
          question: `Wie viel kostet eine Solaranlage in ${region.city}?`,
          answer: `Die Kosten für eine Solaranlage in ${region.city} beginnen ab ca. 12.000€ für ein Einfamilienhaus. Der genaue Preis hängt von Dachgröße, Ausrichtung und gewünschter Anlagenleistung ab. Wir erstellen Ihnen gerne ein individuelles Angebot.`
        },
        {
          question: `Gibt es Förderungen für Solaranlagen in ${region.state}?`,
          answer: `Ja, in ${region.state} gibt es verschiedene Förderprogramme für Photovoltaikanlagen. Dazu gehören KfW-Kredite, regionale Zuschüsse und die Einspeisevergütung. Unser Team berät Sie gerne zu allen verfügbaren Förderoptionen.`
        }
      ])
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localSchemaService = new LocalSchemaService();