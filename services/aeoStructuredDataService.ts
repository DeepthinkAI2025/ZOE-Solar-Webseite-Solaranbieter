/**
 * AEO Structured Data Service für ZOE Solar
 * Erweiterte Schema.org Implementierung für maximale Entity Authority
 * 
 * Features:
 * - Advanced Organization Schema mit E-A-T Signalen
 * - Product und Service Schema mit detaillierten Eigenschaften
 * - FAQ Schema für Knowledge Panel Optimization
 * - Review und Rating Schema Integration
 * - Breadcrumb und Navigation Schema
 * - Speakable Content für Voice Search
 * - Rich Results Optimization
 */

import { entityKnowledgeGraphService, EntityType, OrganizationEntity, ServiceEntity } from './entityKnowledgeGraphService';
import { eatSignalEnhancementService, EATSignal, EATSignalCategory } from './eatSignalEnhancementService';
import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';

// Advanced Schema Types
export interface AdvancedOrganizationSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  alternateName?: string[];
  legalName?: string;
  description: string;
  disambiguatingDescription?: string;
  url: string;
  logo: ImageObject;
  image: string[];
  
  // Kontakt & Adresse
  address: PostalAddress;
  telephone: string;
  email: string;
  contactPoint: ContactPoint[];
  
  // Geografische Daten
  geo: GeoCoordinates;
  areaServed: Place[];
  serviceArea: GeoCircle[];
  
  // Unternehmensdaten
  foundingDate: string;
  foundingLocation: Place;
  founder: Person[];
  numberOfEmployees: string;
  slogan: string;
  
  // Identifikatoren & Registrierungen
  vatID: string;
  taxID: string;
  duns?: string;
  leiCode?: string;
  naics?: string[];
  isicV4?: string[];
  
  // E-A-T Signale
  hasCredential: EducationalOccupationalCredential[];
  award: string[];
  memberOf: Organization[];
  certification: Certification[];
  knowsAbout: string[];
  
  // Bewertungen & Reviews
  aggregateRating: AggregateRating;
  review: Review[];
  
  // Services & Angebote
  hasOfferCatalog: OfferCatalog;
  makesOffer: Offer[];
  
  // Social Media & Cross-Platform
  sameAs: string[];
  
  // Strukturelle Beziehungen
  parentOrganization?: Organization;
  subOrganization?: Organization[];
  department?: Organization[];
  
  // Zusätzliche Properties für AEO
  additionalProperty: PropertyValue[];
  mainEntityOfPage?: WebPage;
  potentialAction?: Action[];
}

export interface AdvancedServiceSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  alternateName?: string[];
  description: string;
  serviceType: string;
  category: string[];
  
  // Provider & Relationships
  provider: Organization;
  broker?: Organization;
  
  // Geografische Verfügbarkeit
  areaServed: Place[];
  availableChannel: ServiceChannel[];
  hasServiceArea: GeoCircle;
  
  // Angebote & Preise
  offers: Offer[];
  priceRange?: string;
  
  // Qualität & Bewertungen
  aggregateRating?: AggregateRating;
  review?: Review[];
  
  // Service Details
  serviceOutput?: string;
  produces?: Thing;
  audience?: Audience;
  
  // Verfügbarkeit & Zeiten
  hoursAvailable?: OpeningHoursSpecification[];
  availableLanguage?: string[];
  
  // E-A-T Signale
  hasCredential?: EducationalOccupationalCredential[];
  award?: string[];
  
  // Zusätzliche Properties
  additionalProperty: PropertyValue[];
  isRelatedTo?: Service[];
  isPartOf?: Service;
  hasPart?: Service[];
}

export interface AdvancedProductSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  description: string;
  category: string[];
  
  // Hersteller & Brand
  manufacturer: Organization;
  brand: Brand;
  model?: string;
  
  // Identifikatoren
  productID?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  
  // Spezifikationen
  additionalProperty: PropertyValue[];
  hasEnergyConsumptionDetails?: EnergyConsumptionDetails;
  hasMeasurement?: QuantitativeValue[];
  
  // Angebote & Preise
  offers: Offer;
  
  // Bewertungen
  aggregateRating?: AggregateRating;
  review?: Review[];
  
  // Beziehungen
  isRelatedTo?: Product[];
  isAccessoryOrSparePartFor?: Product[];
  isConsumableFor?: Product[];
  isSimilarTo?: Product[];
  isVariantOf?: Product;
  hasVariant?: Product[];
  
  // Nachhaltigkeit
  sustainabilityRating?: SustainabilityRating;
  
  // Compliance & Zertifizierungen
  hasCredential?: EducationalOccupationalCredential[];
  award?: string[];
}

export interface AdvancedFAQSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  description: string;
  about?: Thing;
  
  // FAQ Einträge
  mainEntity: Question[];
  
  // Autor & Authority
  author?: Person | Organization;
  publisher: Organization;
  datePublished?: string;
  dateModified?: string;
  
  // Sprache & Lokalisierung
  inLanguage: string;
  
  // Zusätzliche Eigenschaften
  audience?: Audience;
  keywords?: string[];
  
  // Voice Search Optimization
  speakable?: SpeakableSpecification;
}

export interface AdvancedArticleSchema {
  '@context': string;
  '@type': string;
  '@id': string;
  headline: string;
  description: string;
  
  // Content Details
  articleBody?: string;
  wordCount?: number;
  
  // Autor & Publisher mit E-A-T
  author: Person | Organization;
  publisher: Organization;
  
  // Dates
  datePublished: string;
  dateModified: string;
  
  // Media
  image: ImageObject[];
  video?: VideoObject[];
  
  // Kategorisierung
  articleSection: string;
  about: Thing[];
  mentions?: Thing[];
  keywords: string[];
  
  // Bewertungen & Engagement
  aggregateRating?: AggregateRating;
  interactionStatistic?: InteractionCounter[];
  
  // Related Content
  isPartOf?: CreativeWorkSeries;
  hasPart?: Article[];
  citation?: CreativeWork[];
  
  // Voice Search
  speakable?: SpeakableSpecification;
  
  // Additional Properties
  additionalProperty?: PropertyValue[];
}

// Supporting Interfaces
export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
  contentUrl?: string;
  thumbnail?: ImageObject;
  representativeOfPage?: boolean;
}

export interface VideoObject {
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string[];
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  transcript?: string;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  postOfficeBoxNumber?: string;
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
  elevation?: number;
  address?: PostalAddress;
}

export interface GeoCircle {
  '@type': 'GeoCircle';
  geoMidpoint: GeoCoordinates;
  geoRadius: string | number;
}

export interface Place {
  '@type': 'Place';
  name: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
  containedInPlace?: Place;
  hasMap?: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string[];
  availableLanguage?: string[];
  hoursAvailable?: OpeningHoursSpecification[];
  contactOption?: string[];
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

export interface Person {
  '@type': 'Person';
  '@id'?: string;
  name: string;
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  worksFor?: Organization;
  hasCredential?: EducationalOccupationalCredential[];
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface Organization {
  '@type': 'Organization';
  '@id'?: string;
  name: string;
  url?: string;
  logo?: ImageObject | string;
}

export interface Brand {
  '@type': 'Brand';
  name: string;
  logo?: ImageObject | string;
  manufacturer?: Organization;
}

export interface EducationalOccupationalCredential {
  '@type': 'EducationalOccupationalCredential';
  name: string;
  credentialCategory: string;
  recognizedBy?: Organization;
  dateCreated?: string;
  expires?: string;
}

export interface Certification {
  '@type': 'Certification';
  name: string;
  certificationIdentification?: string;
  issuedBy: Organization;
  dateIssued?: string;
  expires?: string;
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating?: number;
}

export interface Review {
  '@type': 'Review';
  author: Person | Organization;
  datePublished: string;
  reviewBody: string;
  reviewRating: Rating;
  itemReviewed?: Thing;
}

export interface Rating {
  '@type': 'Rating';
  ratingValue: number;
  bestRating: number;
  worstRating?: number;
}

export interface OfferCatalog {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: Offer[];
}

export interface Offer {
  '@type': 'Offer';
  name?: string;
  description?: string;
  price?: string | number;
  priceCurrency: string;
  availability: string;
  itemOffered: Thing;
  seller?: Organization;
  validFrom?: string;
  validThrough?: string;
  warranty?: WarrantyPromise;
}

export interface ServiceChannel {
  '@type': 'ServiceChannel';
  serviceUrl: string;
  servicePhone?: ContactPoint;
  serviceSmsNumber?: string;
  providesService: Service;
}

export interface Service {
  '@type': 'Service';
  name: string;
  serviceType: string;
  provider: Organization;
}

export interface Thing {
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | ImageObject;
}

export interface PropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string | number;
  propertyID?: string;
  unitCode?: string;
  unitText?: string;
}

export interface QuantitativeValue {
  '@type': 'QuantitativeValue';
  value: number;
  unitCode: string;
  unitText?: string;
}

export interface EnergyConsumptionDetails {
  '@type': 'EnergyConsumptionDetails';
  energyEfficiencyScaleMin?: string;
  energyEfficiencyScaleMax?: string;
  hasEnergyEfficiencyCategory?: string;
}

export interface SustainabilityRating {
  '@type': 'SustainabilityRating';
  ratingValue: number;
  bestRating: number;
  ratingExplanation?: string;
}

export interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: Answer;
  answerCount?: number;
  upvoteCount?: number;
  dateCreated?: string;
}

export interface Answer {
  '@type': 'Answer';
  text: string;
  dateCreated?: string;
  upvoteCount?: number;
  author?: Person | Organization;
}

export interface Audience {
  '@type': 'Audience';
  audienceType?: string;
  geographicArea?: Place;
}

export interface SpeakableSpecification {
  '@type': 'SpeakableSpecification';
  cssSelector?: string[];
  xpath?: string[];
}

export interface InteractionCounter {
  '@type': 'InteractionCounter';
  interactionType: string;
  userInteractionCount: number;
}

export interface CreativeWorkSeries {
  '@type': 'CreativeWorkSeries';
  name: string;
}

export interface CreativeWork {
  '@type': 'CreativeWork';
  name: string;
  url?: string;
}

export interface WebPage {
  '@type': 'WebPage';
  url: string;
}

export interface Action {
  '@type': string;
  name?: string;
  target?: string;
}

export interface WarrantyPromise {
  '@type': 'WarrantyPromise';
  durationOfWarranty: Duration;
  warrantyScope: string;
}

export interface Duration {
  '@type': 'Duration';
  value: number;
  unitCode: string;
}

export interface Product {
  '@type': 'Product';
  name: string;
}

export interface Article {
  '@type': 'Article';
  headline: string;
}

/**
 * AEO Structured Data Service
 * Generiert erweiterte Schema.org Markup für maximale Entity Authority
 */
export class AEOStructuredDataService {
  private baseUrl: string;
  private organizationName: string;

  constructor(baseUrl: string = 'https://www.zoe-solar.de', organizationName: string = 'ZOE Solar GmbH') {
    this.baseUrl = baseUrl;
    this.organizationName = organizationName;
  }

  /**
   * Generiert erweiterte Organization Schema mit E-A-T Signalen
   */
  public generateAdvancedOrganizationSchema(): AdvancedOrganizationSchema {
    const organizationId = `${this.baseUrl}#organization`;
    const organizationEntity = entityKnowledgeGraphService.getEntity(organizationId) as OrganizationEntity;
    const eatSignals = eatSignalEnhancementService.getSignalsForEntity(organizationId);
    const eatScore = eatSignalEnhancementService.calculateEATScore(organizationId);

    if (!organizationEntity) {
      throw new Error('Organization entity not found');
    }

    // E-A-T Signale kategorisieren
    const expertiseSignals = eatSignals.filter(s => s.category === EATSignalCategory.EXPERTISE);
    const authoritySignals = eatSignals.filter(s => s.category === EATSignalCategory.AUTHORITATIVENESS);
    const trustSignals = eatSignals.filter(s => s.category === EATSignalCategory.TRUSTWORTHINESS);

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': organizationId,
      name: organizationEntity.name,
      alternateName: organizationEntity.alternateName,
      legalName: this.organizationName,
      description: organizationEntity.description,
      disambiguatingDescription: 'Führender Photovoltaik-Spezialist für Gewerbe, Landwirtschaft und Industrie im DACH-Raum',
      url: this.baseUrl,
      logo: organizationEntity.logo,
      image: organizationEntity.image,

      // Kontakt & Adresse
      address: organizationEntity.address,
      telephone: organizationEntity.telephone,
      email: organizationEntity.email,
      contactPoint: organizationEntity.contactPoint,

      // Geografische Daten
      geo: {
        '@type': 'GeoCoordinates',
        latitude: organizationEntity.address.streetAddress === 'Musterstraße 123' ? 52.520008 : 0,
        longitude: organizationEntity.address.streetAddress === 'Musterstraße 123' ? 13.404954 : 0
      },
      areaServed: organizationEntity.areaServed,
      serviceArea: PRIMARY_SERVICE_REGIONS.map(region => ({
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: region.latitude,
          longitude: region.longitude
        },
        geoRadius: region.radiusKm * 1000
      })),

      // Unternehmensdaten
      foundingDate: organizationEntity.foundingDate,
      foundingLocation: organizationEntity.foundingLocation,
      founder: organizationEntity.founder,
      numberOfEmployees: organizationEntity.numberOfEmployees,
      slogan: organizationEntity.slogan,

      // Identifikatoren & Registrierungen
      vatID: organizationEntity.vatID,
      taxID: organizationEntity.taxID,
      duns: organizationEntity.duns,
      leiCode: organizationEntity.leiCode,
      naics: organizationEntity.naics,
      isicV4: organizationEntity.isicV4,

      // E-A-T Signale
      hasCredential: organizationEntity.hasCredential,
      award: organizationEntity.award || [],
      memberOf: organizationEntity.memberOf || [],
      certification: organizationEntity.certification,
      knowsAbout: organizationEntity.knowsAbout,

      // Bewertungen & Reviews
      aggregateRating: organizationEntity.aggregateRating || {
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: 127,
        bestRating: 5,
        worstRating: 1
      },
      review: organizationEntity.review || [],

      // Services & Angebote
      hasOfferCatalog: organizationEntity.hasOfferCatalog,
      makesOffer: organizationEntity.makesOffer,

      // Social Media & Cross-Platform
      sameAs: organizationEntity.sameAs || [],

      // Strukturelle Beziehungen
      parentOrganization: organizationEntity.parentOrganization,
      subOrganization: organizationEntity.subOrganization,
      department: organizationEntity.department,

      // Zusätzliche Properties für AEO
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'EAT Authority Score',
          value: eatScore.overall,
          unitText: 'points'
        },
        {
          '@type': 'PropertyValue',
          name: 'Expertise Score',
          value: eatScore.expertise,
          unitText: 'points'
        },
        {
          '@type': 'PropertyValue',
          name: 'Authority Score',
          value: eatScore.authoritativeness,
          unitText: 'points'
        },
        {
          '@type': 'PropertyValue',
          name: 'Trust Score',
          value: eatScore.trustworthiness,
          unitText: 'points'
        },
        {
          '@type': 'PropertyValue',
          name: 'Completed Projects',
          value: 500,
          unitText: 'projects'
        },
        {
          '@type': 'PropertyValue',
          name: 'Years of Experience',
          value: 6,
          unitText: 'years'
        },
        {
          '@type': 'PropertyValue',
          name: 'Service Areas',
          value: PRIMARY_SERVICE_REGIONS.length,
          unitText: 'cities'
        }
      ],

      // Potentielle Aktionen
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: `${this.baseUrl}/?s={search_term_string}`,
          'query-input': 'required name=search_term_string'
        } as Action,
        {
          '@type': 'ContactAction',
          target: `${this.baseUrl}/kontakt`
        } as Action
      ]
    };
  }

  /**
   * Generiert erweiterte Service Schema
   */
  public generateAdvancedServiceSchema(serviceId: string): AdvancedServiceSchema | null {
    const serviceEntity = entityKnowledgeGraphService.getEntity(serviceId) as ServiceEntity;
    if (!serviceEntity) return null;

    const organizationId = `${this.baseUrl}#organization`;
    const organizationEntity = entityKnowledgeGraphService.getEntity(organizationId) as OrganizationEntity;

    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': serviceId,
      name: serviceEntity.name,
      alternateName: serviceEntity.alternateName,
      description: serviceEntity.description,
      serviceType: serviceEntity.serviceType,
      category: serviceEntity.category,

      // Provider & Relationships
      provider: {
        '@type': 'Organization',
        '@id': organizationId,
        name: this.organizationName,
        url: this.baseUrl
      },

      // Geografische Verfügbarkeit
      areaServed: serviceEntity.areaServed,
      availableChannel: PRIMARY_SERVICE_REGIONS.map(region => ({
        '@type': 'ServiceChannel',
        serviceUrl: `${this.baseUrl}/standort/${region.city.toLowerCase()}`,
        servicePhone: {
          '@type': 'ContactPoint',
          telephone: '+49-30-123-456-78',
          contactType: 'customer support',
          areaServed: [region.regionCode],
          availableLanguage: ['de', 'en']
        },
        providesService: {
          '@type': 'Service',
          name: serviceEntity.name,
          serviceType: serviceEntity.serviceType,
          provider: {
            '@type': 'Organization',
            name: this.organizationName
          }
        }
      })),
      hasServiceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 52.520008,
          longitude: 13.404954
        },
        geoRadius: 300000 // 300km Radius
      },

      // Angebote & Preise
      offers: serviceEntity.offers,
      priceRange: '€€€',

      // Qualität & Bewertungen
      aggregateRating: serviceEntity.aggregateRating,
      review: serviceEntity.review,

      // Service Details
      serviceOutput: 'Schlüsselfertige Photovoltaikanlage',
      produces: {
        '@type': 'Thing',
        name: 'Solarstrom',
        description: 'Nachhaltiger Solarstrom aus Photovoltaikanlagen'
      },
      audience: {
        '@type': 'Audience',
        audienceType: 'BusinessAudience'
      },

      // Verfügbarkeit & Zeiten
      hoursAvailable: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00'
        }
      ],
      availableLanguage: ['de', 'en'],

      // E-A-T Signale (falls vorhanden)
      hasCredential: organizationEntity?.hasCredential,
      award: organizationEntity?.award,

      // Zusätzliche Properties
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Warranty Period',
          value: 25,
          unitCode: 'ANN',
          unitText: 'years'
        },
        {
          '@type': 'PropertyValue',
          name: 'Installation Time',
          value: 2,
          unitCode: 'WEE',
          unitText: 'weeks'
        },
        {
          '@type': 'PropertyValue',
          name: 'Service Type',
          value: 'Full Service'
        }
      ],

      // Beziehungen
      isRelatedTo: serviceEntity.isRelatedTo,
      isPartOf: serviceEntity.isPartOf,
      hasPart: serviceEntity.hasPart
    };
  }

  /**
   * Generiert erweiterte FAQ Schema mit Voice Search Optimierung
   */
  public generateAdvancedFAQSchema(
    title: string,
    description: string,
    faqs: { question: string; answer: string; }[],
    aboutEntity?: Thing
  ): AdvancedFAQSchema {
    const organizationId = `${this.baseUrl}#organization`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${this.baseUrl}/faq#faq-page`,
      name: title,
      description: description,
      about: aboutEntity,

      // FAQ Einträge
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.cleanAnswerText(faq.answer),
          author: {
            '@type': 'Organization',
            '@id': organizationId,
            name: this.organizationName
          }
        },
        answerCount: 1
      })),

      // Autor & Authority
      author: {
        '@type': 'Organization',
        '@id': organizationId,
        name: this.organizationName,
        url: this.baseUrl
      },
      publisher: {
        '@type': 'Organization',
        '@id': organizationId,
        name: this.organizationName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/assets/logos/zoe-solar-logo.svg`
        }
      },
      datePublished: new Date().toISOString().split('T')[0],
      dateModified: new Date().toISOString().split('T')[0],

      // Sprache & Lokalisierung
      inLanguage: 'de-DE',

      // Zusätzliche Eigenschaften
      audience: {
        '@type': 'Audience',
        audienceType: 'BusinessAudience',
        geographicArea: {
          '@type': 'Place',
          name: 'Deutschland'
        }
      },
      keywords: ['Photovoltaik FAQ', 'Solar Fragen', 'PV Antworten', 'Solaranlage Beratung'],

      // Voice Search Optimization
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.faq-question', '.faq-answer']
      }
    };
  }

  /**
   * Generiert erweiterte Article Schema mit E-A-T Enhancement
   */
  public generateAdvancedArticleSchema(
    headline: string,
    description: string,
    content: string,
    authorEntityId: string,
    category: string,
    keywords: string[],
    publishDate: string,
    imageUrl?: string
  ): AdvancedArticleSchema {
    const organizationId = `${this.baseUrl}#organization`;
    const author = eatSignalEnhancementService.generateAuthorSchema(authorEntityId);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${this.baseUrl}/article/${this.slugify(headline)}#article`,
      headline,
      description,

      // Content Details
      articleBody: content,
      wordCount: content.split(' ').length,

      // Autor & Publisher mit E-A-T
      author: author || {
        '@type': 'Organization',
        '@id': organizationId,
        name: this.organizationName
      },
      publisher: {
        '@type': 'Organization',
        '@id': organizationId,
        name: this.organizationName,
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/assets/logos/zoe-solar-logo.svg`
        }
      },

      // Dates
      datePublished: publishDate,
      dateModified: new Date().toISOString(),

      // Media
      image: imageUrl ? [
        {
          '@type': 'ImageObject',
          url: imageUrl,
          width: 1200,
          height: 630,
          caption: headline
        }
      ] : [
        {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/assets/images/default-article.jpg`,
          width: 1200,
          height: 630,
          caption: headline
        }
      ],

      // Kategorisierung
      articleSection: category,
      about: [
        {
          '@type': 'Thing',
          name: 'Photovoltaik',
          description: 'Photovoltaische Stromerzeugung'
        }
      ],
      keywords,

      // Voice Search
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.key-facts']
      },

      // Additional Properties
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Reading Time',
          value: Math.ceil(content.split(' ').length / 200),
          unitText: 'minutes'
        },
        {
          '@type': 'PropertyValue',
          name: 'Content Type',
          value: 'Educational Article'
        }
      ]
    };
  }

  /**
   * Generiert Breadcrumb Schema
   */
  public generateBreadcrumbSchema(breadcrumbs: { name: string; url: string; }[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  /**
   * Generiert Website Schema mit Sitelinks
   */
  public generateWebsiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}#website`,
      name: 'ZOE Solar - Photovoltaik für Gewerbe & Industrie',
      url: this.baseUrl,
      description: 'Führender Photovoltaik-Spezialist für Gewerbe, Landwirtschaft und Industrie. Über 500 erfolgreiche Projekte seit 2018.',
      inLanguage: 'de-DE',
      
      // Suchfunktion
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      
      // Publisher
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}#organization`,
        name: this.organizationName
      },
      
      // Sitelinks
      mainEntity: [
        {
          '@type': 'WebPage',
          '@id': `${this.baseUrl}/service/photovoltaik`,
          name: 'Photovoltaik für Gewerbe',
          description: 'Gewerbliche Photovoltaikanlagen'
        },
        {
          '@type': 'WebPage',
          '@id': `${this.baseUrl}/agri-pv`,
          name: 'Agri-Photovoltaik',
          description: 'Landwirtschaftliche Solaranlagen'
        },
        {
          '@type': 'WebPage',
          '@id': `${this.baseUrl}/service/speicher`,
          name: 'Batteriespeicher',
          description: 'Industrielle Energiespeicher'
        },
        {
          '@type': 'WebPage',
          '@id': `${this.baseUrl}/kontakt`,
          name: 'Kontakt',
          description: 'Kontakt und Beratung'
        }
      ]
    };
  }

  /**
   * Generiert How-To Schema
   */
  public generateHowToSchema(
    name: string,
    description: string,
    steps: { name: string; text: string; }[],
    totalTime?: string,
    supply?: string[],
    tool?: string[]
  ): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name,
      description,
      totalTime: totalTime || 'P30D',
      supply: supply || [],
      tool: tool || [],
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    };
  }

  /**
   * Hilfsfunktion: Text von Markdown bereinigen
   */
  private cleanAnswerText(text: string): string {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  }

  /**
   * Hilfsfunktion: String zu Slug konvertieren
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Kombiniert alle Schemas für eine Seite
   */
  public generatePageSchemas(pageType: string, pageData?: any): object[] {
    const schemas: object[] = [];

    // Basis-Schemas für alle Seiten
    schemas.push(this.generateWebsiteSchema());
    schemas.push(this.generateAdvancedOrganizationSchema());

    // Seiten-spezifische Schemas
    switch (pageType) {
      case 'home':
        // Homepage-spezifische Schemas
        break;
      case 'service':
        if (pageData?.serviceId) {
          const serviceSchema = this.generateAdvancedServiceSchema(pageData.serviceId);
          if (serviceSchema) schemas.push(serviceSchema);
        }
        break;
      case 'faq':
        if (pageData?.faqs) {
          schemas.push(this.generateAdvancedFAQSchema(
            pageData.title || 'FAQ',
            pageData.description || 'Häufige Fragen',
            pageData.faqs,
            pageData.about
          ));
        }
        break;
      case 'article':
        if (pageData) {
          schemas.push(this.generateAdvancedArticleSchema(
            pageData.headline,
            pageData.description,
            pageData.content,
            pageData.authorEntityId,
            pageData.category,
            pageData.keywords,
            pageData.publishDate,
            pageData.imageUrl
          ));
        }
        break;
    }

    // Breadcrumb Schema (falls verfügbar)
    if (pageData?.breadcrumbs) {
      schemas.push(this.generateBreadcrumbSchema(pageData.breadcrumbs));
    }

    return schemas;
  }

  /**
   * Validiert alle generierten Schemas
   */
  public validateSchemas(schemas: object[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    schemas.forEach((schema, index) => {
      const schemaObj = schema as any;
      
      // Basis-Validierung
      if (!schemaObj['@context']) {
        errors.push(`Schema ${index}: Missing @context`);
      }
      if (!schemaObj['@type']) {
        errors.push(`Schema ${index}: Missing @type`);
      }
      if (!schemaObj.name && !schemaObj.headline) {
        warnings.push(`Schema ${index}: Missing name or headline`);
      }

      // Typ-spezifische Validierung
      if (schemaObj['@type'] === 'Organization') {
        if (!schemaObj.url) errors.push(`Organization schema ${index}: Missing URL`);
        if (!schemaObj.address) warnings.push(`Organization schema ${index}: Missing address`);
      }

      if (schemaObj['@type'] === 'Article') {
        if (!schemaObj.author) errors.push(`Article schema ${index}: Missing author`);
        if (!schemaObj.publisher) errors.push(`Article schema ${index}: Missing publisher`);
        if (!schemaObj.datePublished) errors.push(`Article schema ${index}: Missing datePublished`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Singleton-Instanz
export const aeoStructuredDataService = new AEOStructuredDataService();