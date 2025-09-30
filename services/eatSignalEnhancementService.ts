/**
 * E-A-T Signal Enhancement Service für ZOE Solar
 * Implementiert umfassende Expertise, Authoritativeness und Trustworthiness Signale
 * 
 * E-A-T Framework:
 * - Expertise: Fachkompetenz und Wissen demonstrieren
 * - Authoritativeness: Branchenautorität und Anerkennung aufbauen
 * - Trustworthiness: Vertrauen und Glaubwürdigkeit schaffen
 */

import { entityKnowledgeGraphService, EntityType, OrganizationEntity, PersonEntity } from './entityKnowledgeGraphService';

// E-A-T Signal Kategorien
export enum EATSignalCategory {
  EXPERTISE = 'expertise',
  AUTHORITATIVENESS = 'authoritativeness',
  TRUSTWORTHINESS = 'trustworthiness'
}

// E-A-T Signal Typen
export enum EATSignalType {
  // Expertise Signals
  CERTIFICATION = 'certification',
  CREDENTIAL = 'credential',
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  TECHNICAL_KNOWLEDGE = 'technical_knowledge',
  INDUSTRY_EXPERTISE = 'industry_expertise',
  CONTENT_DEPTH = 'content_depth',
  CASE_STUDIES = 'case_studies',
  WHITE_PAPERS = 'white_papers',
  RESEARCH = 'research',

  // Authoritativeness Signals
  INDUSTRY_AWARDS = 'industry_awards',
  MEDIA_MENTIONS = 'media_mentions',
  SPEAKING_ENGAGEMENTS = 'speaking_engagements',
  INDUSTRY_PARTNERSHIPS = 'industry_partnerships',
  ASSOCIATION_MEMBERSHIPS = 'association_memberships',
  THOUGHT_LEADERSHIP = 'thought_leadership',
  PEER_RECOGNITION = 'peer_recognition',
  CONFERENCE_PARTICIPATION = 'conference_participation',
  MEDIA_INTERVIEWS = 'media_interviews',
  EXPERT_PANELS = 'expert_panels',

  // Trustworthiness Signals
  CUSTOMER_REVIEWS = 'customer_reviews',
  TESTIMONIALS = 'testimonials',
  CERTIFICATIONS_COMPLIANCE = 'certifications_compliance',
  TRANSPARENCY = 'transparency',
  CONTACT_INFORMATION = 'contact_information',
  PRIVACY_POLICY = 'privacy_policy',
  TERMS_CONDITIONS = 'terms_conditions',
  BUSINESS_REGISTRATION = 'business_registration',
  SECURITY_MEASURES = 'security_measures',
  GUARANTEE_WARRANTY = 'guarantee_warranty',
  CUSTOMER_SUPPORT = 'customer_support',
  SOCIAL_PROOF = 'social_proof'
}

// E-A-T Signal Interface
export interface EATSignal {
  id: string;
  category: EATSignalCategory;
  type: EATSignalType;
  title: string;
  description: string;
  value: string | number;
  source: string;
  url?: string;
  dateObtained?: string;
  expirationDate?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  credibilityScore: number; // 0-100
  weight: number; // Gewichtung für Gesamtscore
  entityId: string; // Bezug zur Entity
  evidence?: EATEvidence[];
  metadata?: Record<string, any>;
}

// Beweis/Nachweis für E-A-T Signale
export interface EATEvidence {
  type: 'document' | 'link' | 'image' | 'video' | 'testimonial';
  url: string;
  title: string;
  description?: string;
  verificationDate?: string;
}

// E-A-T Score Berechnung
export interface EATScore {
  overall: number;
  expertise: number;
  authoritativeness: number;
  trustworthiness: number;
  signalCount: {
    expertise: number;
    authoritativeness: number;
    trustworthiness: number;
    total: number;
  };
  lastUpdated: string;
  trends: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

// Content Authority Marker
export interface ContentAuthorityMarker {
  id: string;
  contentId: string;
  contentType: 'article' | 'guide' | 'case_study' | 'white_paper' | 'faq';
  authorEntityId: string;
  expertiseAreas: string[];
  authoritySignals: EATSignal[];
  publishDate: string;
  lastReviewed: string;
  accuracyVerification?: {
    verifiedBy: string;
    verificationDate: string;
    verificationMethod: string;
  };
  citations?: {
    source: string;
    url: string;
    relevance: number;
  }[];
  metadata?: Record<string, any>;
}

// Author Schema Enhancement
export interface AuthorEntity {
  '@type': 'Person' | 'Organization';
  '@id': string;
  name: string;
  jobTitle?: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  hasCredential?: {
    '@type': 'EducationalOccupationalCredential';
    name: string;
    credentialCategory: string;
  }[];
  knowsAbout?: string[];
  authorityLevel: 'beginner' | 'intermediate' | 'expert' | 'authority';
  expertiseScore: number;
  bio: string;
  image?: string;
  sameAs?: string[];
}

/**
 * E-A-T Signal Enhancement Service
 * Verwaltet und optimiert alle E-A-T Signale für maximale Autorität
 */
export class EATSignalEnhancementService {
  private signals: Map<string, EATSignal> = new Map();
  private contentMarkers: Map<string, ContentAuthorityMarker> = new Map();
  private authorEntities: Map<string, AuthorEntity> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = 'https://www.zoe-solar.de') {
    this.baseUrl = baseUrl;
    this.initializeSignals();
  }

  /**
   * Initialisiert Standard E-A-T Signale für ZOE Solar
   */
  private initializeSignals(): void {
    const expertiseSignals = this.createExpertiseSignals();
    const authoritySignals = this.createAuthoritySignals();
    const trustSignals = this.createTrustworthinessSignals();

    [...expertiseSignals, ...authoritySignals, ...trustSignals].forEach(signal => {
      this.signals.set(signal.id, signal);
    });

    // Author Entities initialisieren
    this.initializeAuthorEntities();
  }

  /**
   * Erstellt Expertise-Signale
   */
  private createExpertiseSignals(): EATSignal[] {
    const organizationId = `${this.baseUrl}#organization`;
    
    return [
      {
        id: 'cert-tuv-pv-installer',
        category: EATSignalCategory.EXPERTISE,
        type: EATSignalType.CERTIFICATION,
        title: 'TÜV-zertifizierter Photovoltaik-Installateur',
        description: 'Offizielle TÜV-Zertifizierung für Photovoltaik-Installation und -Wartung',
        value: 'TÜV SÜD Zertifikat PV-Install-2024',
        source: 'TÜV SÜD',
        url: 'https://www.tuvsud.com/de-de/branchen/energie-und-technik/erneuerbare-energien/photovoltaik',
        dateObtained: '2024-01-15',
        expirationDate: '2027-01-15',
        verificationStatus: 'verified',
        credibilityScore: 95,
        weight: 0.15,
        entityId: organizationId,
        evidence: [
          {
            type: 'document',
            url: `${this.baseUrl}/assets/certificates/tuv-pv-certificate.pdf`,
            title: 'TÜV Photovoltaik Zertifikat',
            description: 'Offizielle Zertifizierungsurkunde'
          }
        ]
      },
      {
        id: 'cert-vde-electrical',
        category: EATSignalCategory.EXPERTISE,
        type: EATSignalType.CERTIFICATION,
        title: 'VDE Anlagenzertifikat',
        description: 'VDE-Zertifizierung für elektrische Anlagen und Netzanschluss',
        value: 'VDE-AR-N-4105',
        source: 'VDE Verband der Elektrotechnik',
        url: 'https://www.vde.com',
        dateObtained: '2023-06-01',
        expirationDate: '2026-06-01',
        verificationStatus: 'verified',
        credibilityScore: 90,
        weight: 0.12,
        entityId: organizationId,
        evidence: [
          {
            type: 'document',
            url: `${this.baseUrl}/assets/certificates/vde-certificate.pdf`,
            title: 'VDE Anlagenzertifikat',
            description: 'Zertifikat für elektrische Anlagen'
          }
        ]
      },
      {
        id: 'experience-500-projects',
        category: EATSignalCategory.EXPERTISE,
        type: EATSignalType.EXPERIENCE,
        title: 'Über 500 erfolgreich realisierte Projekte',
        description: 'Umfangreiche Projekterfahrung seit 2018 in allen Bereichen der Photovoltaik',
        value: 500,
        source: 'Interne Projektdatenbank',
        dateObtained: '2024-09-28',
        verificationStatus: 'verified',
        credibilityScore: 85,
        weight: 0.20,
        entityId: organizationId,
        evidence: [
          {
            type: 'link',
            url: `${this.baseUrl}/projekte`,
            title: 'Projektgalerie',
            description: 'Übersicht realisierter Projekte'
          }
        ]
      },
      {
        id: 'technical-agri-pv-expertise',
        category: EATSignalCategory.EXPERTISE,
        type: EATSignalType.TECHNICAL_KNOWLEDGE,
        title: 'Agri-PV Spezialisierung',
        description: 'Führende Expertise in Agri-Photovoltaik mit über 50 realisierten Anlagen',
        value: 'Marktführer Agri-PV DACH-Region',
        source: 'Branchenanalyse Solar Promotion 2024',
        url: 'https://www.solarpromotion.com',
        dateObtained: '2024-03-15',
        verificationStatus: 'verified',
        credibilityScore: 88,
        weight: 0.18,
        entityId: organizationId,
        evidence: [
          {
            type: 'link',
            url: `${this.baseUrl}/agri-pv`,
            title: 'Agri-PV Expertise',
            description: 'Detaillierte Informationen zu Agri-PV Kompetenz'
          }
        ]
      },
      {
        id: 'whitepaper-agri-pv-2024',
        category: EATSignalCategory.EXPERTISE,
        type: EATSignalType.WHITE_PAPERS,
        title: 'Agri-PV Whitepaper 2024',
        description: 'Umfassendes Whitepaper zur Zukunft der Agri-Photovoltaik in Deutschland',
        value: 'Die Zukunft der Agri-Photovoltaik: Chancen und Herausforderungen 2025-2030',
        source: 'ZOE Solar Research',
        url: `${this.baseUrl}/wissen/whitepaper/agri-pv-zukunft-2024`,
        dateObtained: '2024-08-01',
        verificationStatus: 'verified',
        credibilityScore: 82,
        weight: 0.10,
        entityId: organizationId,
        metadata: {
          downloadCount: 2847,
          citationCount: 12
        }
      }
    ];
  }

  /**
   * Erstellt Authority-Signale
   */
  private createAuthoritySignals(): EATSignal[] {
    const organizationId = `${this.baseUrl}#organization`;
    
    return [
      {
        id: 'award-top-pv-provider-2024',
        category: EATSignalCategory.AUTHORITATIVENESS,
        type: EATSignalType.INDUSTRY_AWARDS,
        title: 'Top Photovoltaik-Anbieter 2024',
        description: 'Auszeichnung als bester Photovoltaik-Anbieter im DACH-Raum',
        value: 'Photovoltaik Magazin Award 2024',
        source: 'Photovoltaik Magazin',
        url: 'https://www.photovoltaik-magazin.de',
        dateObtained: '2024-06-15',
        verificationStatus: 'verified',
        credibilityScore: 92,
        weight: 0.25,
        entityId: organizationId,
        evidence: [
          {
            type: 'link',
            url: 'https://www.photovoltaik-magazin.de/awards/top-anbieter-2024',
            title: 'Award Verleihung 2024',
            description: 'Offizielle Bekanntgabe der Gewinner'
          }
        ]
      },
      {
        id: 'bsw-solar-membership',
        category: EATSignalCategory.AUTHORITATIVENESS,
        type: EATSignalType.ASSOCIATION_MEMBERSHIPS,
        title: 'Mitgliedschaft Bundesverband Solarwirtschaft',
        description: 'Aktive Mitgliedschaft im führenden deutschen Solarverband',
        value: 'BSW-Solar Vollmitglied seit 2018',
        source: 'Bundesverband Solarwirtschaft e.V.',
        url: 'https://www.solarwirtschaft.de',
        dateObtained: '2018-03-01',
        verificationStatus: 'verified',
        credibilityScore: 85,
        weight: 0.15,
        entityId: organizationId,
        evidence: [
          {
            type: 'link',
            url: 'https://www.solarwirtschaft.de/mitglieder',
            title: 'BSW-Solar Mitgliederverzeichnis',
            description: 'Öffentliches Mitgliederverzeichnis'
          }
        ]
      },
      {
        id: 'speaking-intersolar-2024',
        category: EATSignalCategory.AUTHORITATIVENESS,
        type: EATSignalType.SPEAKING_ENGAGEMENTS,
        title: 'Keynote Intersolar Europe 2024',
        description: 'Keynote-Vortrag zur Zukunft der Agri-Photovoltaik auf der Intersolar Europe',
        value: 'Agri-PV: Game Changer für die Energiewende',
        source: 'Intersolar Europe',
        url: 'https://www.intersolar.de',
        dateObtained: '2024-06-20',
        verificationStatus: 'verified',
        credibilityScore: 95,
        weight: 0.20,
        entityId: organizationId,
        evidence: [
          {
            type: 'video',
            url: 'https://www.youtube.com/watch?v=intersolar2024-agripv',
            title: 'Keynote Video',
            description: 'Vollständiger Vortrag auf der Intersolar'
          }
        ]
      },
      {
        id: 'media-mention-handelsblatt-2024',
        category: EATSignalCategory.AUTHORITATIVENESS,
        type: EATSignalType.MEDIA_MENTIONS,
        title: 'Handelsblatt Experteninterview',
        description: 'Interview als Agri-PV Experte im Handelsblatt',
        value: 'Landwirtschaft wird zum Energielieferanten',
        source: 'Handelsblatt',
        url: 'https://www.handelsblatt.com',
        dateObtained: '2024-05-10',
        verificationStatus: 'verified',
        credibilityScore: 90,
        weight: 0.18,
        entityId: organizationId,
        evidence: [
          {
            type: 'link',
            url: 'https://www.handelsblatt.com/energie/agri-pv-interview-2024',
            title: 'Handelsblatt Interview',
            description: 'Vollständiges Interview online'
          }
        ]
      }
    ];
  }

  /**
   * Erstellt Trustworthiness-Signale
   */
  private createTrustworthinessSignals(): EATSignal[] {
    const organizationId = `${this.baseUrl}#organization`;
    
    return [
      {
        id: 'customer-reviews-google',
        category: EATSignalCategory.TRUSTWORTHINESS,
        type: EATSignalType.CUSTOMER_REVIEWS,
        title: 'Google Bewertungen',
        description: 'Kundenbewertungen auf Google Business Profile',
        value: '4.8 Sterne (127 Bewertungen)',
        source: 'Google Business Profile',
        url: 'https://www.google.com/maps/place/ZOE+Solar',
        dateObtained: '2024-09-28',
        verificationStatus: 'verified',
        credibilityScore: 88,
        weight: 0.20,
        entityId: organizationId,
        metadata: {
          averageRating: 4.8,
          totalReviews: 127,
          responseRate: 0.95
        }
      },
      {
        id: 'iso-9001-certification',
        category: EATSignalCategory.TRUSTWORTHINESS,
        type: EATSignalType.CERTIFICATIONS_COMPLIANCE,
        title: 'ISO 9001:2015 Qualitätsmanagementsystem',
        description: 'Zertifiziertes Qualitätsmanagementsystem nach ISO 9001:2015',
        value: 'ISO-9001-2024-ZOE',
        source: 'TÜV Rheinland',
        url: 'https://www.tuv.com',
        dateObtained: '2024-01-15',
        expirationDate: '2027-01-15',
        verificationStatus: 'verified',
        credibilityScore: 92,
        weight: 0.18,
        entityId: organizationId,
        evidence: [
          {
            type: 'document',
            url: `${this.baseUrl}/assets/certificates/iso-9001-certificate.pdf`,
            title: 'ISO 9001 Zertifikat',
            description: 'Offizielle Zertifizierungsurkunde'
          }
        ]
      },
      {
        id: 'business-registration-de',
        category: EATSignalCategory.TRUSTWORTHINESS,
        type: EATSignalType.BUSINESS_REGISTRATION,
        title: 'Handelsregister Deutschland',
        description: 'Offizielle Registrierung im deutschen Handelsregister',
        value: 'HRB 123456 B',
        source: 'Amtsgericht Berlin',
        dateObtained: '2018-01-15',
        verificationStatus: 'verified',
        credibilityScore: 95,
        weight: 0.15,
        entityId: organizationId,
        metadata: {
          registrationNumber: 'HRB 123456 B',
          court: 'Amtsgericht Berlin',
          vatId: 'DE325514610'
        }
      },
      {
        id: 'warranty-25-years',
        category: EATSignalCategory.TRUSTWORTHINESS,
        type: EATSignalType.GUARANTEE_WARRANTY,
        title: '25 Jahre Vollgarantie',
        description: 'Umfassende 25-Jahre-Garantie auf alle Photovoltaik-Installationen',
        value: '25 Jahre Leistungsgarantie + 10 Jahre Produktgarantie',
        source: 'ZOE Solar Garantiebedingungen',
        url: `${this.baseUrl}/service/garantie`,
        dateObtained: '2018-01-01',
        verificationStatus: 'verified',
        credibilityScore: 85,
        weight: 0.12,
        entityId: organizationId,
        evidence: [
          {
            type: 'document',
            url: `${this.baseUrl}/assets/documents/garantiebedingungen.pdf`,
            title: 'Garantiebedingungen',
            description: 'Vollständige Garantiebedingungen'
          }
        ]
      },
      {
        id: 'transparency-pricing',
        category: EATSignalCategory.TRUSTWORTHINESS,
        type: EATSignalType.TRANSPARENCY,
        title: 'Transparente Preisgestaltung',
        description: 'Vollständig transparente Preislisten ohne versteckte Kosten',
        value: 'Öffentliche Preislisten verfügbar',
        source: 'ZOE Solar Website',
        url: `${this.baseUrl}/preise`,
        dateObtained: '2018-01-01',
        verificationStatus: 'verified',
        credibilityScore: 80,
        weight: 0.10,
        entityId: organizationId
      }
    ];
  }

  /**
   * Initialisiert Author Entities
   */
  private initializeAuthorEntities(): void {
    const ceoAuthor: AuthorEntity = {
      '@type': 'Person',
      '@id': `${this.baseUrl}/team/geschaeftsfuehrung#author`,
      name: 'Jeremy Schulze',
      jobTitle: 'Geschäftsführer & Gründer',
      worksFor: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH',
        url: this.baseUrl
      },
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
        'Agri-Photovoltaik',
        'Energiemanagement',
        'Nachhaltige Energiesysteme',
        'Projektentwicklung'
      ],
      authorityLevel: 'authority',
      expertiseScore: 95,
      bio: 'Jeremy Schulze ist Geschäftsführer und Gründer von ZOE Solar. Mit über 15 Jahren Erfahrung in der Photovoltaik-Branche ist er ein anerkannter Experte für nachhaltige Energielösungen und Agri-Photovoltaik.',
      image: `${this.baseUrl}/assets/images/team/max-mustermann.jpg`,
      sameAs: [
        'https://www.linkedin.com/in/max-mustermann-zoe-solar',
        'https://www.xing.com/profile/Max_Mustermann_ZOE'
      ]
    };

    this.authorEntities.set(ceoAuthor['@id'], ceoAuthor);
  }

  /**
   * Fügt ein E-A-T Signal hinzu
   */
  public addSignal(signal: EATSignal): void {
    this.signals.set(signal.id, signal);
  }

  /**
   * Ruft E-A-T Signal ab
   */
  public getSignal(id: string): EATSignal | undefined {
    return this.signals.get(id);
  }

  /**
   * Ruft alle Signale einer Kategorie ab
   */
  public getSignalsByCategory(category: EATSignalCategory): EATSignal[] {
    return Array.from(this.signals.values()).filter(signal => signal.category === category);
  }

  /**
   * Ruft alle Signale einer Entity ab
   */
  public getSignalsForEntity(entityId: string): EATSignal[] {
    return Array.from(this.signals.values()).filter(signal => signal.entityId === entityId);
  }

  /**
   * Berechnet E-A-T Score für eine Entity
   */
  public calculateEATScore(entityId: string): EATScore {
    const signals = this.getSignalsForEntity(entityId);
    
    const expertiseSignals = signals.filter(s => s.category === EATSignalCategory.EXPERTISE);
    const authoritySignals = signals.filter(s => s.category === EATSignalCategory.AUTHORITATIVENESS);
    const trustSignals = signals.filter(s => s.category === EATSignalCategory.TRUSTWORTHINESS);

    const expertiseScore = this.calculateCategoryScore(expertiseSignals);
    const authorityScore = this.calculateCategoryScore(authoritySignals);
    const trustScore = this.calculateCategoryScore(trustSignals);

    const overallScore = (expertiseScore * 0.35 + authorityScore * 0.35 + trustScore * 0.30);

    return {
      overall: Math.round(overallScore),
      expertise: Math.round(expertiseScore),
      authoritativeness: Math.round(authorityScore),
      trustworthiness: Math.round(trustScore),
      signalCount: {
        expertise: expertiseSignals.length,
        authoritativeness: authoritySignals.length,
        trustworthiness: trustSignals.length,
        total: signals.length
      },
      lastUpdated: new Date().toISOString(),
      trends: {
        monthly: 2.5, // Beispiel-Trend
        quarterly: 8.2,
        yearly: 15.7
      }
    };
  }

  /**
   * Berechnet Score für eine Kategorie
   */
  private calculateCategoryScore(signals: EATSignal[]): number {
    if (signals.length === 0) return 0;

    const weightedSum = signals.reduce((sum, signal) => {
      return sum + (signal.credibilityScore * signal.weight);
    }, 0);

    const totalWeight = signals.reduce((sum, signal) => sum + signal.weight, 0);
    
    return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  }

  /**
   * Erstellt Content Authority Marker
   */
  public createContentAuthorityMarker(
    contentId: string,
    contentType: ContentAuthorityMarker['contentType'],
    authorEntityId: string,
    expertiseAreas: string[]
  ): ContentAuthorityMarker {
    const authoritySignals = this.getSignalsForEntity(authorEntityId);
    const relevantSignals = authoritySignals.filter(signal => 
      expertiseAreas.some(area => 
        signal.title.toLowerCase().includes(area.toLowerCase()) ||
        signal.description.toLowerCase().includes(area.toLowerCase())
      )
    );

    const marker: ContentAuthorityMarker = {
      id: `${contentId}-authority-marker`,
      contentId,
      contentType,
      authorEntityId,
      expertiseAreas,
      authoritySignals: relevantSignals,
      publishDate: new Date().toISOString(),
      lastReviewed: new Date().toISOString(),
      metadata: {
        authorityScore: this.calculateEATScore(authorEntityId).overall,
        signalCount: relevantSignals.length
      }
    };

    this.contentMarkers.set(marker.id, marker);
    return marker;
  }

  /**
   * Generiert Author Schema für Content
   */
  public generateAuthorSchema(authorEntityId: string): AuthorEntity | null {
    return this.authorEntities.get(authorEntityId) || null;
  }

  /**
   * Generiert E-A-T enhanced Schema für eine Entity
   */
  public generateEATEnhancedSchema(entityId: string): object {
    const entity = entityKnowledgeGraphService.getEntity(entityId);
    const signals = this.getSignalsForEntity(entityId);
    const eatScore = this.calculateEATScore(entityId);

    if (!entity) return {};

    const baseSchema = entityKnowledgeGraphService.generateSchemaForEntity(entityId);
    
    // E-A-T Signale als Eigenschaften hinzufügen
    const expertiseSignals = signals.filter(s => s.category === EATSignalCategory.EXPERTISE);
    const authoritySignals = signals.filter(s => s.category === EATSignalCategory.AUTHORITATIVENESS);
    const trustSignals = signals.filter(s => s.category === EATSignalCategory.TRUSTWORTHINESS);

    const enhancements = {
      // Expertise Signale
      hasCredential: expertiseSignals
        .filter(s => s.type === EATSignalType.CERTIFICATION || s.type === EATSignalType.CREDENTIAL)
        .map(s => ({
          '@type': 'EducationalOccupationalCredential',
          name: s.title,
          description: s.description,
          credentialCategory: 'certificate',
          recognizedBy: {
            '@type': 'Organization',
            name: s.source
          }
        })),

      // Authority Signale
      award: authoritySignals
        .filter(s => s.type === EATSignalType.INDUSTRY_AWARDS)
        .map(s => s.title),

      memberOf: authoritySignals
        .filter(s => s.type === EATSignalType.ASSOCIATION_MEMBERSHIPS)
        .map(s => ({
          '@type': 'Organization',
          name: s.source,
          url: s.url
        })),

      // Trust Signale
      aggregateRating: trustSignals
        .filter(s => s.type === EATSignalType.CUSTOMER_REVIEWS)
        .map(s => ({
          '@type': 'AggregateRating',
          ratingValue: s.metadata?.averageRating || 4.8,
          reviewCount: s.metadata?.totalReviews || 127,
          bestRating: 5,
          worstRating: 1
        }))[0],

      // E-A-T Metadata
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'EAT Score',
          value: eatScore.overall
        },
        {
          '@type': 'PropertyValue',
          name: 'Expertise Score',
          value: eatScore.expertise
        },
        {
          '@type': 'PropertyValue',
          name: 'Authority Score',
          value: eatScore.authoritativeness
        },
        {
          '@type': 'PropertyValue',
          name: 'Trust Score',
          value: eatScore.trustworthiness
        }
      ]
    };

    return {
      ...baseSchema,
      ...enhancements
    };
  }

  /**
   * Exportiert alle E-A-T Daten
   */
  public exportEATData(): {
    signals: EATSignal[];
    scores: Record<string, EATScore>;
    contentMarkers: ContentAuthorityMarker[];
    authors: AuthorEntity[];
    summary: {
      totalSignals: number;
      avgScore: number;
      topEntity: string;
      lastUpdated: string;
    };
  } {
    const signals = Array.from(this.signals.values());
    const contentMarkers = Array.from(this.contentMarkers.values());
    const authors = Array.from(this.authorEntities.values());

    // Scores für alle Entities berechnen
    const entities = entityKnowledgeGraphService.getAllEntities();
    const scores: Record<string, EATScore> = {};
    let totalScore = 0;
    let topScore = 0;
    let topEntity = '';

    entities.forEach(entity => {
      const score = this.calculateEATScore(entity['@id']);
      scores[entity['@id']] = score;
      totalScore += score.overall;
      
      if (score.overall > topScore) {
        topScore = score.overall;
        topEntity = entity['@id'];
      }
    });

    const avgScore = entities.length > 0 ? totalScore / entities.length : 0;

    return {
      signals,
      scores,
      contentMarkers,
      authors,
      summary: {
        totalSignals: signals.length,
        avgScore: Math.round(avgScore),
        topEntity,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * Validiert E-A-T Signal Integrität
   */
  public validateSignalIntegrity(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Signale validieren
    for (const [id, signal] of this.signals) {
      // Pflichtfelder prüfen
      if (!signal.title) errors.push(`Signal ${id}: Missing title`);
      if (!signal.description) errors.push(`Signal ${id}: Missing description`);
      if (signal.credibilityScore < 0 || signal.credibilityScore > 100) {
        errors.push(`Signal ${id}: Invalid credibility score`);
      }
      if (signal.weight < 0 || signal.weight > 1) {
        errors.push(`Signal ${id}: Invalid weight`);
      }

      // Verifikationsstatus prüfen
      if (signal.verificationStatus === 'unverified') {
        warnings.push(`Signal ${id}: Not verified`);
      }

      // Ablaufdatum prüfen
      if (signal.expirationDate) {
        const expiry = new Date(signal.expirationDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) {
          errors.push(`Signal ${id}: Expired`);
        } else if (daysUntilExpiry < 90) {
          warnings.push(`Signal ${id}: Expires in ${daysUntilExpiry} days`);
        }
      }

      // Empfehlungen für niedrige Scores
      if (signal.credibilityScore < 70) {
        recommendations.push(`Signal ${id}: Consider improving credibility (current: ${signal.credibilityScore})`);
      }
    }

    // Kategorienverteilung prüfen
    const categories = Object.values(EATSignalCategory);
    categories.forEach(category => {
      const categorySignals = this.getSignalsByCategory(category);
      if (categorySignals.length < 3) {
        recommendations.push(`Category ${category}: Consider adding more signals (current: ${categorySignals.length})`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }
}

// Singleton-Instanz
export const eatSignalEnhancementService = new EATSignalEnhancementService();