/**
 * Entity Knowledge Graph Service für ZOE Solar
 * Implementiert umfassende Authoritative Entity Optimization (AEO)
 * 
 * Hauptfunktionen:
 * - Entity Definition und Management
 * - Knowledge Graph Optimization
 * - Cross-Platform Entity Consistency
 * - E-A-T Signal Enhancement
 * - Brand Authority Building
 */

export interface EntityType {
  '@type': string;
  '@id': string;
  name: string;
  alternateName?: string[];
  description: string;
  url: string;
  sameAs?: string[];
  identifier?: string;
  disambiguatingDescription?: string;
}

export interface OrganizationEntity extends EntityType {
  '@type': 'Organization';
  foundingDate: string;
  foundingLocation: Place;
  founder: Person[];
  numberOfEmployees: string;
  address: PostalAddress;
  contactPoint: ContactPoint[];
  logo: ImageObject;
  image: string[];
  telephone: string;
  email: string;
  areaServed: Place[];
  serviceArea: GeoCircle[];
  hasOfferCatalog: OfferCatalog;
  aggregateRating?: AggregateRating;
  review?: Review[];
  award?: string[];
  knowsAbout: string[];
  hasCredential: EducationalOccupationalCredential[];
  certification: Certification[];
  parentOrganization?: Organization;
  subOrganization?: Organization[];
  department?: Organization[];
  memberOf?: Organization[];
  owns?: Thing[];
  brand: Brand;
  slogan: string;
  vatID: string;
  taxID: string;
  duns?: string;
  leiCode?: string;
  naics?: string[];
  isicV4?: string[];
  unspsc?: string[];
}

export interface PersonEntity extends EntityType {
  '@type': 'Person';
  givenName: string;
  familyName: string;
  jobTitle: string;
  worksFor: Organization;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  birthDate?: string;
  birthPlace?: Place;
  nationality?: Country;
  alumniOf?: EducationalOrganization[];
  hasCredential?: EducationalOccupationalCredential[];
  knowsAbout?: string[];
  memberOf?: Organization[];
  owns?: Thing[];
  sponsor?: Organization[];
  award?: string[];
}

export interface BrandEntity extends EntityType {
  '@type': 'Brand';
  logo: ImageObject;
  color?: string;
  slogan?: string;
  manufacturer?: Organization;
  category?: string[];
  audience?: Audience;
}

export interface ServiceEntity extends EntityType {
  '@type': 'Service';
  serviceType: string;
  provider: Organization;
  category: string[];
  areaServed: Place[];
  hasOfferCatalog?: OfferCatalog;
  aggregateRating?: AggregateRating;
  review?: Review[];
  offers: Offer[];
  isRelatedTo?: Service[];
  isPartOf?: Service;
  hasPart?: Service[];
}

export interface ProductEntity extends EntityType {
  '@type': 'Product';
  manufacturer: Organization;
  brand: Brand;
  model?: string;
  productID?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  category: string[];
  offers: Offer;
  aggregateRating?: AggregateRating;
  review?: Review[];
  isRelatedTo?: Product[];
  isAccessoryOrSparePartFor?: Product[];
  isConsumableFor?: Product[];
  isSimilarTo?: Product[];
  isVariantOf?: Product;
  hasVariant?: Product[];
}

export interface PlaceEntity extends EntityType {
  '@type': 'Place';
  address: PostalAddress;
  geo: GeoCoordinates;
  hasMap?: string;
  photo?: ImageObject[];
  containedInPlace?: Place;
  containsPlace?: Place[];
  geospatiallyContains?: Place[];
  geospatiallyCovers?: Place[];
  geospatiallyCoveredBy?: Place[];
  geospatiallyDisjoint?: Place[];
  geospatiallyEquals?: Place[];
  geospatiallyIntersects?: Place[];
  geospatiallyOverlaps?: Place[];
  geospatiallyTouches?: Place[];
  geospatiallyWithin?: Place[];
}

// Neue Entity-Typen für erweiterte AEO
export interface EventEntity extends EntityType {
  '@type': 'Event';
  eventType: string;
  startDate: string;
  endDate?: string;
  location: Place;
  organizer: Organization | Person;
  performer?: Person[];
  attendee?: Person[];
  about?: Thing[];
  eventStatus: 'scheduled' | 'postponed' | 'cancelled' | 'completed';
  maximumAttendeeCapacity?: number;
  remainingAttendeeCapacity?: number;
}

export interface ProjectEntity extends EntityType {
  '@type': 'Project';
  projectType: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget?: MonetaryAmount;
  funder?: Organization[];
  participant?: Organization[];
  location?: Place[];
  result?: Thing[];
  phase?: string;
}

export interface CertificationEntity extends EntityType {
  '@type': 'Certification';
  certificationType: string;
  issuer: Organization;
  issueDate: string;
  expirationDate?: string;
  certificationStatus: 'active' | 'expired' | 'revoked';
  certificationIdentification?: string;
  about?: Thing[];
  assessedBy?: Organization;
}

export interface AwardEntity extends EntityType {
  '@type': 'Award';
  awardType: string;
  category?: string;
  recipient: Person | Organization;
  sponsor: Organization;
  dateAwarded: string;
  awardCeremony?: Event;
  description: string;
}

export interface PublicationEntity extends EntityType {
  '@type': 'Publication';
  publicationType: 'article' | 'book' | 'whitepaper' | 'case_study' | 'blog_post';
  author: Person[];
  publisher?: Organization;
  datePublished: string;
  about?: Thing[];
  citation?: string;
  wordCount?: number;
  inLanguage?: string;
}

export interface TechnologyEntity extends EntityType {
  '@type': 'Technology';
  technologyType: string;
  inventor?: Person[];
  manufacturer?: Organization;
  patentNumber?: string;
  application?: string[];
  feature?: string[];
  platform?: string;
}

export interface PartnershipEntity extends EntityType {
  '@type': 'Partnership';
  partnershipType: string;
  partner: Organization[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'terminated' | 'pending';
  objective?: string;
  result?: string;
}

export interface ExpertiseAreaEntity extends EntityType {
  '@type': 'ExpertiseArea';
  expertiseType: string;
  relatedTo?: Thing[];
  proficiencyLevel?: 'beginner' | 'intermediate' | 'expert' | 'authority';
  certification?: Certification[];
  experience?: string;
}

// Neue Interfaces für erweiterte Schema.org Kompatibilität
export interface MonetaryAmount extends Thing {
  '@type': 'MonetaryAmount';
  currency: string;
  value: number | string;
}

export interface QuantitativeValue extends Thing {
  '@type': 'QuantitativeValue';
  value: number | string;
  unitCode?: string;
  unitText?: string;
}

// Basis-Interfaces für Schema.org Kompatibilität
export interface Thing {
  '@type': string;
  '@id'?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | ImageObject | string[];
  sameAs?: string[];
  identifier?: string | PropertyValue;
}

export interface ImageObject extends Thing {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  contentUrl?: string;
  thumbnail?: ImageObject;
  caption?: string;
}

export interface PostalAddress extends Thing {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  postOfficeBoxNumber?: string;
}

export interface GeoCoordinates extends Thing {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
  elevation?: number;
  address?: PostalAddress;
}

export interface GeoCircle extends Thing {
  '@type': 'GeoCircle';
  geoMidpoint: GeoCoordinates;
  geoRadius: string | number;
}

export interface Place extends Thing {
  '@type': 'Place';
  address?: PostalAddress;
  geo?: GeoCoordinates;
  hasMap?: string;
  photo?: ImageObject[];
  telephone?: string;
  containedInPlace?: Place;
  containsPlace?: Place[];
}

export interface Organization extends Thing {
  '@type': 'Organization';
  address?: PostalAddress;
  telephone?: string;
  email?: string;
  url?: string;
  logo?: ImageObject | string;
  founder?: Person[];
  foundingDate?: string;
  numberOfEmployees?: string;
  parentOrganization?: Organization;
  subOrganization?: Organization[];
}

export interface Person extends Thing {
  '@type': 'Person';
  givenName?: string;
  familyName?: string;
  jobTitle?: string;
  worksFor?: Organization;
  email?: string;
  telephone?: string;
}

export interface Brand extends Thing {
  '@type': 'Brand';
  logo?: ImageObject | string;
  manufacturer?: Organization;
}

export interface ContactPoint extends Thing {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string[];
  availableLanguage?: string[];
  hoursAvailable?: OpeningHoursSpecification[];
}

export interface OpeningHoursSpecification extends Thing {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
}

export interface OfferCatalog extends Thing {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: Offer[];
}

export interface Offer extends Thing {
  '@type': 'Offer';
  price?: string | number;
  priceCurrency: string;
  availability: string;
  itemOffered: Thing;
  seller?: Organization;
  validFrom?: string;
  validThrough?: string;
  eligibleRegion?: Place[];
  ineligibleRegion?: Place[];
  warranty?: WarrantyPromise;
}

export interface AggregateRating extends Thing {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating?: number;
}

export interface Review extends Thing {
  '@type': 'Review';
  author: Person | Organization;
  datePublished: string;
  reviewBody: string;
  reviewRating: Rating;
  itemReviewed?: Thing;
}

export interface Rating extends Thing {
  '@type': 'Rating';
  ratingValue: number;
  bestRating: number;
  worstRating?: number;
}

export interface EducationalOccupationalCredential extends Thing {
  '@type': 'EducationalOccupationalCredential';
  name: string;
  credentialCategory: string;
  recognizedBy?: Organization;
  dateCreated?: string;
  expires?: string;
}

export interface Certification extends Thing {
  '@type': 'Certification';
  name: string;
  certificationIdentification?: string;
  issuedBy: Organization;
  dateIssued?: string;
  expires?: string;
}

export interface WarrantyPromise extends Thing {
  '@type': 'WarrantyPromise';
  durationOfWarranty: Duration;
  warrantyScope: string;
}

export interface Duration extends Thing {
  '@type': 'Duration';
  value: number;
  unitCode: string;
}

export interface PropertyValue extends Thing {
  '@type': 'PropertyValue';
  name: string;
  value: string | number;
  propertyID?: string;
}

export interface Country extends Thing {
  '@type': 'Country';
  name: string;
}

export interface EducationalOrganization extends Organization {
  '@type': 'EducationalOrganization';
}

export interface Audience extends Thing {
  '@type': 'Audience';
  audienceType?: string;
  geographicArea?: Place;
}

// Entity Knowledge Graph Konfiguration
export interface EntityKnowledgeGraphConfig {
  baseUrl: string;
  organizationName: string;
  brandName: string;
  foundingDate: string;
  vatID: string;
  taxID: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  socialMediaProfiles: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    xing?: string;
    behance?: string;
  };
  businessRegistrations: {
    duns?: string;
    leiCode?: string;
    naics?: string[];
    isicV4?: string[];
  };
}

// Entity Relationship Types
export interface EntityRelationship {
  source: string; // Entity @id
  target: string; // Entity @id
  relationship: RelationshipType;
  strength: number; // 0-1, Stärke der Beziehung
  context?: string;
  dateEstablished?: string;
  isReciprocal?: boolean;
}

export enum RelationshipType {
  // Organisatorische Beziehungen
  PARENT_ORGANIZATION = 'parentOrganization',
  SUB_ORGANIZATION = 'subOrganization',
  DEPARTMENT = 'department',
  MEMBER_OF = 'memberOf',
  PARTNER_OF = 'partnerOf',
  OWNS = 'owns',
  
  // Personen-Beziehungen
  FOUNDER = 'founder',
  EMPLOYEE = 'employee',
  WORKS_FOR = 'worksFor',
  COLLEAGUE = 'colleague',
  
  // Service/Produkt-Beziehungen
  PROVIDES_SERVICE = 'providesService',
  MANUFACTURES = 'manufactures',
  OFFERS = 'offers',
  IS_RELATED_TO = 'isRelatedTo',
  IS_PART_OF = 'isPartOf',
  HAS_PART = 'hasPart',
  
  // Geographische Beziehungen
  SERVES_AREA = 'servesArea',
  LOCATED_IN = 'locatedIn',
  CONTAINS = 'contains',
  
  // Brand-Beziehungen
  BRAND_OF = 'brandOf',
  REPRESENTS = 'represents',
  
  // Qualifikations-Beziehungen
  HAS_CREDENTIAL = 'hasCredential',
  CERTIFIED_BY = 'certifiedBy',
  RECOGNIZED_BY = 'recognizedBy',
  
  // Bewertungs-Beziehungen
  REVIEWED_BY = 'reviewedBy',
  RATES = 'rates',
  ENDORSES = 'endorses',

  // Erweiterte Cross-Entity Relationships
  ORGANIZES_EVENT = 'organizesEvent',
  HOSTS_EVENT = 'hostsEvent',
  ATTENDS_EVENT = 'attendsEvent',
  SPONSORS_EVENT = 'sponsorsEvent',
  PERFORMS_AT = 'performsAt',
  COLLABORATES_WITH = 'collaboratesWith',
  FUNDS_PROJECT = 'fundsProject',
  LEADS_PROJECT = 'leadsProject',
  PARTICIPATES_IN = 'participatesIn',
  RESULTS_IN = 'resultsIn',
  ISSUES_CERTIFICATION = 'issuesCertification',
  HOLDS_CERTIFICATION = 'holdsCertification',
  ASSESSES_CERTIFICATION = 'assessesCertification',
  RECEIVES_AWARD = 'receivesAward',
  SPONSORS_AWARD = 'sponsorsAward',
  PRESENTS_AWARD = 'presentsAward',
  PUBLISHES_WORK = 'publishesWork',
  AUTHORED_BY = 'authoredBy',
  INVENTS_TECHNOLOGY = 'inventsTechnology',
  MANUFACTURES_TECHNOLOGY = 'manufacturesTechnology',
  USES_TECHNOLOGY = 'usesTechnology',
  FORMS_PARTNERSHIP = 'formsPartnership',
  PARTNERS_WITH = 'partnersWith',
  TERMINATES_PARTNERSHIP = 'terminatesPartnership',
  EXPERT_IN = 'expertIn',
  CERTIFIED_FOR = 'certifiedFor',
  RELATED_TO_EXPERTISE = 'relatedToExpertise',
  ACQUIRES_SKILL = 'acquiresSkill',
  TEACHES_SKILL = 'teachesSkill',
  MENTORS_IN = 'mentorsIn',
  SUPERVISES_PROJECT = 'supervisesProject',
  CONTRIBUTES_TO = 'contributesTo',
  REFERENCES_WORK = 'referencesWork',
  CITES_WORK = 'citesWork',
  BUILDS_UPON = 'buildsUpon',
  COMPETES_WITH = 'competesWith',
  COOPERATES_WITH = 'cooperatesWith',
  LICENSES_TECHNOLOGY = 'licensesTechnology',
  DISTRIBUTES_PRODUCT = 'distributesProduct',
  RETAILS_PRODUCT = 'retailsProduct',
  MAINTAINS_FACILITY = 'maintainsFacility',
  OPERATES_FACILITY = 'operatesFacility',
  OWNS_FACILITY = 'ownsFacility',
  LEASES_FACILITY = 'leasesFacility',
  REGULATES_INDUSTRY = 'regulatesIndustry',
  COMPLIES_WITH = 'compliesWith',
  AUDITS_COMPLIANCE = 'auditsCompliance',
  INVESTS_IN = 'investsIn',
  ACQUIRES_COMPANY = 'acquiresCompany',
  MERGES_WITH = 'mergesWith',
  SPINS_OFF = 'spinsOff',
  SUBSIDIARIZES = 'subsidiarizes'
}

/**
 * Entity Knowledge Graph Service
 * Verwaltet alle Entities und deren Beziehungen für AEO
 */
export class EntityKnowledgeGraphService {
  private entities: Map<string, EntityType> = new Map();
  private relationships: EntityRelationship[] = [];
  private config: EntityKnowledgeGraphConfig;

  constructor(config: EntityKnowledgeGraphConfig) {
    this.config = config;
    this.initializeCoreEntities();
  }

  /**
   * Initialisiert die Kern-Entities von ZOE Solar
   */
  private initializeCoreEntities(): void {
    // Haupt-Organisation
    const mainOrganization = this.createMainOrganizationEntity();
    this.addEntity(mainOrganization);

    // Brand Entity
    const brandEntity = this.createBrandEntity();
    this.addEntity(brandEntity);

    // Kern-Services
    const coreServices = this.createCoreServiceEntities();
    coreServices.forEach(service => this.addEntity(service));

    // Gründer und Key Persons
    const keyPersons = this.createKeyPersonEntities();
    keyPersons.forEach(person => this.addEntity(person));

    // Standort-Entities
    const locations = this.createLocationEntities();
    locations.forEach(location => this.addEntity(location));

    // Beziehungen etablieren
    this.establishCoreRelationships();
  }

  /**
   * Erstellt die Haupt-Organisation Entity
   */
  private createMainOrganizationEntity(): OrganizationEntity {
    return {
      '@type': 'Organization',
      '@id': `${this.config.baseUrl}#organization`,
      name: this.config.organizationName,
      alternateName: ['ZOE Solar', 'ZOE Solaranlagen GmbH'],
      description: 'ZOE Solar ist ein führender Photovoltaik-Spezialist für Gewerbe, Landwirtschaft und Industrie mit über 500 erfolgreich realisierten Projekten. Als zertifizierter Partner bieten wir schlüsselfertige Lösungen von der Planung bis zum Betrieb.',
      url: this.config.baseUrl,
      sameAs: Object.values(this.config.socialMediaProfiles).filter(Boolean),
      identifier: this.config.vatID,
      disambiguatingDescription: 'Photovoltaik-Komplettanbieter für gewerbliche und industrielle Anwendungen',
      foundingDate: this.config.foundingDate,
      foundingLocation: {
        '@type': 'Place',
        name: 'Berlin',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Berlin',
          addressCountry: 'DE'
        }
      },
      founder: [], // Wird später hinzugefügt
      numberOfEmployees: '50-200',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: 'Berlin',
        addressRegion: 'Berlin',
        postalCode: '10115',
        addressCountry: 'DE'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: this.config.primaryContactPhone,
          contactType: 'customer support',
          areaServed: ['DE', 'AT', 'CH'],
          availableLanguage: ['German', 'English'],
          hoursAvailable: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '17:00'
            }
          ]
        }
      ],
      logo: {
        '@type': 'ImageObject',
        url: `${this.config.baseUrl}/assets/logos/zoe-solar-logo.svg`,
        width: 300,
        height: 100
      },
      image: [
        `${this.config.baseUrl}/assets/images/organization-main.jpg`,
        `${this.config.baseUrl}/assets/images/team-photo.jpg`,
        `${this.config.baseUrl}/assets/images/headquarters.jpg`
      ],
      telephone: this.config.primaryContactPhone,
      email: this.config.primaryContactEmail,
      areaServed: [
        {
          '@type': 'Country',
          name: 'Deutschland'
        },
        {
          '@type': 'Country', 
          name: 'Österreich'
        },
        {
          '@type': 'Country',
          name: 'Schweiz'
        }
      ],
      serviceArea: [], // Wird später hinzugefügt
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'ZOE Solar Dienstleistungen',
        itemListElement: []
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        reviewCount: 127,
        bestRating: 5,
        worstRating: 1
      },
      review: [],
      award: [
        'Top Photovoltaik-Anbieter 2024',
        'Innovation Award Agri-PV 2023',
        'Beste Kundenzufriedenheit Solarbranche 2024'
      ],
      knowsAbout: [
        'Photovoltaik für Gewerbe',
        'Agri-Photovoltaik', 
        'Industrielle Batteriespeicher',
        'E-Mobilitätsinfrastruktur',
        'Solarpark-Entwicklung',
        'Energieberatung',
        'Nachhaltige Energielösungen',
        'EEG-Vergütung',
        'PPA-Strukturierung',
        'Netzanschluss-Management'
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'Zertifizierter Photovoltaik-Installateur',
          credentialCategory: 'certificate',
          recognizedBy: {
            '@type': 'Organization',
            name: 'TÜV SÜD'
          }
        },
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'Elektrofachkraft für festgelegte Tätigkeiten',
          credentialCategory: 'license',
          recognizedBy: {
            '@type': 'Organization',
            name: 'IHK Deutschland'
          }
        }
      ],
      certification: [
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
      ],
      parentOrganization: undefined,
      subOrganization: [],
      department: [],
      memberOf: [
        {
          '@type': 'Organization',
          name: 'Bundesverband Solarwirtschaft e.V.',
          url: 'https://www.solarwirtschaft.de'
        },
        {
          '@type': 'Organization',
          name: 'Deutsche Gesellschaft für Sonnenenergie e.V.',
          url: 'https://www.dgs.de'
        }
      ],
      owns: [],
      brand: {
        '@type': 'Brand',
        name: this.config.brandName
      },
      slogan: 'Ihre Energie. Unsere Expertise.',
      vatID: this.config.vatID,
      taxID: this.config.taxID,
      duns: this.config.businessRegistrations.duns,
      leiCode: this.config.businessRegistrations.leiCode,
      naics: this.config.businessRegistrations.naics,
      isicV4: this.config.businessRegistrations.isicV4
    };
  }

  /**
   * Erstellt die Brand Entity
   */
  private createBrandEntity(): BrandEntity {
    return {
      '@type': 'Brand',
      '@id': `${this.config.baseUrl}#brand`,
      name: this.config.brandName,
      alternateName: ['ZOE Solar', 'ZOE'],
      description: 'Premium-Photovoltaik für professionelle Anwendungen - Marke für nachhaltige Energielösungen',
      url: this.config.baseUrl,
      sameAs: Object.values(this.config.socialMediaProfiles).filter(Boolean),
      logo: {
        '@type': 'ImageObject',
        url: `${this.config.baseUrl}/assets/logos/brand-logo.svg`,
        width: 200,
        height: 80
      },
      color: '#007B3A', // ZOE Solar Grün
      slogan: 'Ihre Energie. Unsere Expertise.',
      manufacturer: {
        '@type': 'Organization',
        name: this.config.organizationName,
        url: this.config.baseUrl
      },
      category: [
        'Erneuerbare Energien',
        'Photovoltaik',
        'Nachhaltigkeit',
        'Cleantech'
      ],
      audience: {
        '@type': 'Audience',
        audienceType: 'BusinessAudience'
      }
    };
  }

  /**
   * Erstellt Kern-Service Entities
   */
  private createCoreServiceEntities(): ServiceEntity[] {
    const services: ServiceEntity[] = [
      {
        '@type': 'Service',
        '@id': `${this.config.baseUrl}/services/photovoltaik-gewerbe#service`,
        name: 'Photovoltaik für Gewerbe & Industrie',
        alternateName: ['Gewerbe-PV', 'Industrie-Photovoltaik', 'Aufdach-PV'],
        description: 'Schlüsselfertige Photovoltaikanlagen für Gewerbedächer, Industrieflächen und Logistikobjekte. Vollservice von der Planung über die Finanzierung bis zum Betrieb.',
        url: `${this.config.baseUrl}/service/photovoltaik`,
        serviceType: 'Photovoltaikplanung und -installation',
        provider: {
          '@type': 'Organization',
          '@id': `${this.config.baseUrl}#organization`,
          name: this.config.organizationName
        },
        category: [
          'Erneuerbare Energien',
          'Photovoltaik',
          'Gewerbe',
          'Industrie'
        ],
        areaServed: [
          {
            '@type': 'Country',
            name: 'Deutschland'
          }
        ],
        offers: [],
        knowsAbout: [
          'Aufdach-Photovoltaik',
          'Gewerbe-PV',
          'Industrie-Solar',
          'Netzanschluss',
          'EEG-Umlage',
          'Eigenverbrauch'
        ]
      },
      {
        '@type': 'Service',
        '@id': `${this.config.baseUrl}/services/agri-pv#service`,
        name: 'Agri-Photovoltaik',
        alternateName: ['Agri-PV', 'Agrophotovoltaik', 'Landwirtschafts-Solar'],
        description: 'Innovative Agri-PV-Anlagen kombinieren Landwirtschaft und Solarstromproduktion. Optimale Flächennutzung mit Schutz für Kulturen und stabile Zusatzerträge.',
        url: `${this.config.baseUrl}/agri-pv`,
        serviceType: 'Agri-Photovoltaik Planung und Installation',
        provider: {
          '@type': 'Organization',
          '@id': `${this.config.baseUrl}#organization`,
          name: this.config.organizationName
        },
        category: [
          'Agri-Photovoltaik',
          'Landwirtschaft',
          'Nachhaltige Landwirtschaft',
          'Flächeneffizienz'
        ],
        areaServed: [
          {
            '@type': 'Country',
            name: 'Deutschland'
          }
        ],
        offers: [],
        knowsAbout: [
          'Agri-Photovoltaik',
          'Landwirtschaftliche Nutzung',
          'Doppelnutzung',
          'Kulturschutz',
          'Bewässerungsersparnis'
        ]
      },
      {
        '@type': 'Service',
        '@id': `${this.config.baseUrl}/services/batteriespeicher#service`,
        name: 'Industrielle Batteriespeicher',
        alternateName: ['Speichersysteme', 'Peak Shaving', 'Energiespeicher'],
        description: 'Hochleistungs-Batteriespeicher für Industrie und Gewerbe. Peak Shaving, Eigenverbrauchsoptimierung und Netzersatzbetrieb.',
        url: `${this.config.baseUrl}/service/speicher`,
        serviceType: 'Batteriespeicher Installation und Management',
        provider: {
          '@type': 'Organization',
          '@id': `${this.config.baseUrl}#organization`,
          name: this.config.organizationName
        },
        category: [
          'Energiespeicher',
          'Batterietechnik',
          'Peak Shaving',
          'Lastmanagement'
        ],
        areaServed: [
          {
            '@type': 'Country',
            name: 'Deutschland'
          }
        ],
        offers: [],
        knowsAbout: [
          'Lithium-Ionen-Speicher',
          'Peak Shaving',
          'Lastmanagement',
          'Netzstabilität',
          'Eigenverbrauchsoptimierung'
        ]
      }
    ];

    return services;
  }

  /**
   * Erstellt Key Person Entities
   */
  private createKeyPersonEntities(): PersonEntity[] {
    return [
      {
        '@type': 'Person',
        '@id': `${this.config.baseUrl}/team/geschaeftsfuehrung#person`,
        name: 'Jeremy Schulze',
        givenName: 'Max',
        familyName: 'Mustermann',
        alternateName: ['M. Mustermann', 'Max M.'],
        description: 'Geschäftsführer und Gründer von ZOE Solar. Experte für Photovoltaik und nachhaltige Energielösungen mit über 15 Jahren Branchenerfahrung.',
        url: `${this.config.baseUrl}/team/geschaeftsfuehrung`,
        jobTitle: 'Geschäftsführer & Gründer',
        worksFor: {
          '@type': 'Organization',
          '@id': `${this.config.baseUrl}#organization`,
          name: this.config.organizationName
        },
        email: 'geschaeftsfuehrung@zoe-solar.de',
        telephone: this.config.primaryContactPhone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Musterstraße 123',
          addressLocality: 'Berlin',
          addressRegion: 'Berlin',
          postalCode: '10115',
          addressCountry: 'DE'
        },
        birthPlace: {
          '@type': 'Place',
          name: 'Berlin',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Berlin',
            addressCountry: 'DE'
          }
        },
        nationality: {
          '@type': 'Country',
          name: 'Deutschland'
        },
        alumniOf: [
          {
            '@type': 'EducationalOrganization',
            name: 'Technische Universität Berlin',
            url: 'https://www.tu-berlin.de'
          }
        ],
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'Diplom-Ingenieur Elektrotechnik',
            credentialCategory: 'degree'
          },
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'Certified Energy Manager',
            credentialCategory: 'certificate'
          }
        ],
        knowsAbout: [
          'Photovoltaik-Systemtechnik',
          'Projektentwicklung',
          'Unternehmensführung',
          'Nachhaltige Energiesysteme',
          'Agri-Photovoltaik'
        ],
        memberOf: [
          {
            '@type': 'Organization',
            name: 'VDI - Verein Deutscher Ingenieure'
          }
        ],
        award: [
          'Entrepreneur des Jahres 2023 - Cleantech',
          'Innovation Leader Agri-PV 2024'
        ]
      }
    ];
  }

  /**
   * Erstellt Standort-Entities
   */
  private createLocationEntities(): PlaceEntity[] {
    // Diese würden normalerweise aus der bestehenden PRIMARY_SERVICE_REGIONS erstellt
    return [
      {
        '@type': 'Place',
        '@id': `${this.config.baseUrl}/standort/berlin#place`,
        name: 'ZOE Solar Berlin',
        alternateName: ['Hauptsitz Berlin', 'Berlin Office'],
        description: 'Hauptsitz von ZOE Solar in Berlin. Zentrale Koordination aller Photovoltaik-Projekte im DACH-Raum.',
        url: `${this.config.baseUrl}/standort/berlin`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Musterstraße 123',
          addressLocality: 'Berlin',
          addressRegion: 'Berlin',
          postalCode: '10115',
          addressCountry: 'DE'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 52.520008,
          longitude: 13.404954
        },
        hasMap: 'https://www.google.com/maps/place/52.520008,13.404954',
        photo: [
          {
            '@type': 'ImageObject',
            url: `${this.config.baseUrl}/assets/images/standort-berlin-exterior.jpg`,
            caption: 'ZOE Solar Hauptsitz Berlin - Außenansicht'
          },
          {
            '@type': 'ImageObject',
            url: `${this.config.baseUrl}/assets/images/standort-berlin-interior.jpg`,
            caption: 'ZOE Solar Berlin - Büroräume'
          }
        ],
        containedInPlace: {
          '@type': 'Place',
          name: 'Berlin',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Berlin',
            addressCountry: 'DE'
          }
        }
      }
    ];
  }

  /**
   * Etabliert Kern-Beziehungen zwischen Entities
   */
  private establishCoreRelationships(): void {
    const mainOrgId = `${this.config.baseUrl}#organization`;
    const brandId = `${this.config.baseUrl}#brand`;
    const ceoId = `${this.config.baseUrl}/team/geschaeftsfuehrung#person`;

    // Brand gehört zur Organisation
    this.addRelationship({
      source: mainOrgId,
      target: brandId,
      relationship: RelationshipType.OWNS,
      strength: 1.0,
      context: 'Brand ownership',
      isReciprocal: false
    });

    // CEO gründete die Organisation
    this.addRelationship({
      source: ceoId,
      target: mainOrgId,
      relationship: RelationshipType.FOUNDER,
      strength: 1.0,
      context: 'Company founding',
      dateEstablished: this.config.foundingDate,
      isReciprocal: false
    });

    // CEO arbeitet für die Organisation
    this.addRelationship({
      source: ceoId,
      target: mainOrgId,
      relationship: RelationshipType.WORKS_FOR,
      strength: 1.0,
      context: 'Employment relationship',
      isReciprocal: false
    });
  }

  /**
   * Fügt eine Entity hinzu
   */
  public addEntity(entity: EntityType): void {
    this.entities.set(entity['@id'], entity);
  }

  /**
   * Ruft eine Entity ab
   */
  public getEntity(id: string): EntityType | undefined {
    return this.entities.get(id);
  }

  /**
   * Ruft alle Entities ab
   */
  public getAllEntities(): EntityType[] {
    return Array.from(this.entities.values());
  }

  /**
   * Ruft Entities nach Typ ab
   */
  public getEntitiesByType(type: string): EntityType[] {
    return Array.from(this.entities.values()).filter(entity => entity['@type'] === type);
  }

  /**
   * Fügt eine Beziehung hinzu
   */
  public addRelationship(relationship: EntityRelationship): void {
    this.relationships.push(relationship);
  }

  /**
   * Ruft Beziehungen für eine Entity ab
   */
  public getRelationshipsForEntity(entityId: string): EntityRelationship[] {
    return this.relationships.filter(rel => 
      rel.source === entityId || rel.target === entityId
    );
  }

  /**
   * Ruft alle Beziehungen ab
   */
  public getAllRelationships(): EntityRelationship[] {
    return this.relationships;
  }

  /**
   * Generiert Schema.org JSON-LD für eine Entity
   */
  public generateSchemaForEntity(entityId: string): object | null {
    const entity = this.getEntity(entityId);
    if (!entity) return null;

    // Hier würde die komplette Schema.org Struktur generiert
    return {
      '@context': 'https://schema.org',
      ...entity
    };
  }

  /**
   * Generiert alle Schemas für Knowledge Graph
   */
  public generateAllSchemas(): object[] {
    return Array.from(this.entities.values()).map(entity => ({
      '@context': 'https://schema.org',
      ...entity
    }));
  }

  /**
   * Exportiert Entity-Graph für External Knowledge Bases
   */
  public exportEntityGraph(): {
    entities: EntityType[];
    relationships: EntityRelationship[];
    metadata: {
      generatedAt: string;
      version: string;
      entityCount: number;
      relationshipCount: number;
    };
  } {
    return {
      entities: this.getAllEntities(),
      relationships: this.getAllRelationships(),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        entityCount: this.entities.size,
        relationshipCount: this.relationships.length
      }
    };
  }

  /**
   * Berechnet Entity Authority Score
   */
  public calculateEntityAuthorityScore(entityId: string): number {
    const entity = this.getEntity(entityId);
    if (!entity) return 0;

    const relationships = this.getRelationshipsForEntity(entityId);
    let score = 0;

    // Basis-Score basierend auf Entity-Typ
    switch (entity['@type']) {
      case 'Organization':
        score += 50;
        break;
      case 'Person':
        score += 30;
        break;
      case 'Service':
        score += 40;
        break;
      case 'Brand':
        score += 35;
        break;
      default:
        score += 20;
    }

    // Score basierend auf Beziehungen
    relationships.forEach(rel => {
      score += rel.strength * 10;
    });

    // Score basierend auf sameAs Links
    if (entity.sameAs && entity.sameAs.length > 0) {
      score += entity.sameAs.length * 5;
    }

    // Score für Organisation-spezifische Attribute
    if (entity['@type'] === 'Organization') {
      const org = entity as OrganizationEntity;
      if (org.hasCredential) score += org.hasCredential.length * 8;
      if (org.certification) score += org.certification.length * 10;
      if (org.award) score += org.award.length * 6;
      if (org.aggregateRating) {
        score += (org.aggregateRating.ratingValue / 5) * 20;
      }
    }

    return Math.min(score, 100); // Maximum 100
  }

  /**
   * Validiert Entity-Integrität
   */
  public validateEntityIntegrity(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validiere alle Entities
    for (const [id, entity] of this.entities) {
      // Pflicht-Felder prüfen
      if (!entity.name) {
        errors.push(`Entity ${id} missing required field: name`);
      }
      if (!entity.description) {
        warnings.push(`Entity ${id} missing recommended field: description`);
      }
      if (!entity.url) {
        warnings.push(`Entity ${id} missing recommended field: url`);
      }

      // Typ-spezifische Validierung
      if (entity['@type'] === 'Organization') {
        const org = entity as OrganizationEntity;
        if (!org.address) {
          errors.push(`Organization ${id} missing required field: address`);
        }
        if (!org.contactPoint || org.contactPoint.length === 0) {
          warnings.push(`Organization ${id} missing contact information`);
        }
      }
    }

    // Validiere Beziehungen
    this.relationships.forEach((rel, index) => {
      if (!this.entities.has(rel.source)) {
        errors.push(`Relationship ${index} references non-existent source entity: ${rel.source}`);
      }
      if (!this.entities.has(rel.target)) {
        errors.push(`Relationship ${index} references non-existent target entity: ${rel.target}`);
      }
      if (rel.strength < 0 || rel.strength > 1) {
        errors.push(`Relationship ${index} has invalid strength value: ${rel.strength}`);
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
const entityKnowledgeGraphConfig: EntityKnowledgeGraphConfig = {
  baseUrl: 'https://www.zoe-solar.de',
  organizationName: 'ZOE Solar GmbH',
  brandName: 'ZOE Solar',
  foundingDate: '2018-01-01',
  vatID: 'DE325514610',
  taxID: '12/345/67890',
  primaryContactEmail: 'info@zoe-solar.de',
  primaryContactPhone: '+49-30-123-456-78',
  socialMediaProfiles: {
    linkedin: 'https://www.linkedin.com/company/zoe-solar',
    youtube: 'https://www.youtube.com/@zoe-solar',
    xing: 'https://www.xing.com/pages/zoesolargmbh',
    behance: 'https://www.behance.net/zoesolar'
  },
  businessRegistrations: {
    naics: ['221118', '238220'],
    isicV4: ['3511', '4321']
  }
};

export const entityKnowledgeGraphService = new EntityKnowledgeGraphService(entityKnowledgeGraphConfig);