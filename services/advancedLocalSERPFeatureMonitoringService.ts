import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';

export interface SERPFeature {
  id: string;
  name: string;
  type: 'local_pack' | 'featured_snippet' | 'knowledge_panel' | 'local_finder' | 'reviews' | 'directions' | 'photos' | 'posts' | 'qanda' | 'related_questions' | 'people_also_ask' | 'local_services' | 'emergency_services';
  description: string;
  impact: 'high' | 'medium' | 'low';
  visibility: 'always_visible' | 'conditional' | 'rare';
  eligibility: string[];
  optimizationTips: string[];
}

export interface SERPPosition {
  keyword: string;
  locationKey: string;
  position: number;
  previousPosition?: number;
  change: number;
  changeType: 'improved' | 'declined' | 'stable';
  feature: string;
  url: string;
  title: string;
  snippet: string;
  capturedAt: string;
  device: 'desktop' | 'mobile';
  searchIntent: 'local' | 'informational' | 'commercial' | 'navigational';
}

export interface LocalPackEntry {
  businessId: string;
  businessName: string;
  position: number;
  rating: number;
  reviewCount: number;
  address: string;
  phone?: string;
  website?: string;
  directionsUrl?: string;
  photos: Array<{
    url: string;
    caption?: string;
  }>;
  attributes: Array<{
    name: string;
    value: string | boolean;
  }>;
  priceRange?: string;
  hours?: {
    [day: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  distance?: string;
  isClaimed: boolean;
  gmbUrl?: string;
}

export interface SERPFeatureSnapshot {
  id: string;
  keyword: string;
  locationKey: string;
  searchEngine: 'google' | 'bing' | 'yahoo';
  device: 'desktop' | 'mobile';
  features: {
    localPack: {
      present: boolean;
      position: number;
      entries: LocalPackEntry[];
      mapVisible: boolean;
      filters: string[];
    };
    featuredSnippet: {
      present: boolean;
      type: 'paragraph' | 'list' | 'table' | 'video' | null;
      position: number;
      content: string;
      source: string;
      title: string;
    };
    knowledgePanel: {
      present: boolean;
      type: 'business' | 'local' | 'general';
      position: number;
      title: string;
      description: string;
      attributes: Array<{
        name: string;
        value: string;
      }>;
      images: string[];
      reviews?: {
        rating: number;
        count: number;
        topReview?: string;
      };
    };
    reviews: {
      present: boolean;
      position: number;
      businessName: string;
      rating: number;
      reviewCount: number;
      topReviews: Array<{
        author: string;
        rating: number;
        text: string;
        date: string;
      }>;
    };
    directions: {
      present: boolean;
      position: number;
      businessName: string;
      address: string;
      distance?: string;
      travelTime?: string;
    };
    photos: {
      present: boolean;
      position: number;
      count: number;
      businessName: string;
      images: Array<{
        url: string;
        caption?: string;
      }>;
    };
    posts: {
      present: boolean;
      position: number;
      count: number;
      businessName: string;
      recentPosts: Array<{
        title: string;
        date: string;
        snippet: string;
      }>;
    };
    qanda: {
      present: boolean;
      position: number;
      questionCount: number;
      businessName: string;
      topQuestions: Array<{
        question: string;
        answer: string;
        author: string;
        date: string;
      }>;
    };
    relatedQuestions: {
      present: boolean;
      position: number;
      questions: string[];
    };
    peopleAlsoAsk: {
      present: boolean;
      position: number;
      questions: Array<{
        question: string;
        answer: string;
        source: string;
        expanded: boolean;
      }>;
    };
    localServices: {
      present: boolean;
      position: number;
      services: Array<{
        name: string;
        description: string;
        bookingUrl?: string;
      }>;
    };
    emergencyServices: {
      present: boolean;
      position: number;
      services: Array<{
        name: string;
        phone: string;
        description: string;
      }>;
    };
  };
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  capturedAt: string;
  searchLocation: {
    query: string;
    coordinates: [number, number];
    radius: number;
  };
}

export interface SERPFeatureTrend {
  feature: string;
  locationKey: string;
  keyword: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'emerging' | 'declining';
  visibility: number;
  position: number;
  impact: number;
  timeframe: '7_days' | '30_days' | '90_days';
  dataPoints: Array<{
    date: string;
    present: boolean;
    position: number;
    impressions: number;
    clicks: number;
  }>;
  insights: string[];
  recommendations: string[];
}

export interface SERPFeatureOpportunity {
  id: string;
  keyword: string;
  locationKey: string;
  feature: string;
  opportunityType: 'ranking' | 'featured_snippet' | 'local_pack' | 'knowledge_panel' | 'emerging_feature';
  potential: number;
  difficulty: 'easy' | 'medium' | 'hard';
  competition: 'low' | 'medium' | 'high';
  estimatedTraffic: number;
  estimatedConversions: number;
  requirements: string[];
  implementationSteps: string[];
  timeline: 'immediate' | 'short_term' | 'long_term';
  roi: number;
  createdAt: string;
}

export interface SERPCompetitorAnalysis {
  keyword: string;
  locationKey: string;
  competitors: Array<{
    businessName: string;
    features: string[];
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  }>;
  featureComparison: {
    [feature: string]: {
      ourPresence: boolean;
      competitorPresence: number;
      ourPosition?: number;
      bestCompetitorPosition?: number;
      gap: number;
    };
  };
  recommendations: Array<{
    feature: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
  }>;
  analyzedAt: string;
}

export interface SERPFeatureAlert {
  id: string;
  type: 'opportunity' | 'threat' | 'change' | 'optimization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  keyword: string;
  locationKey: string;
  feature: string;
  message: string;
  details: string;
  recommendations: string[];
  actionable: boolean;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Advanced Local SERP Feature Monitoring Service
 * Umfassendes Monitoring und Analyse von lokalen SERP-Features
 */
export class AdvancedLocalSERPFeatureMonitoringService {
  private serpFeatures: Map<string, SERPFeature> = new Map();
  private snapshots: Map<string, SERPFeatureSnapshot[]> = new Map();
  private trends: Map<string, SERPFeatureTrend[]> = new Map();
  private opportunities: Map<string, SERPFeatureOpportunity[]> = new Map();
  private alerts: Map<string, SERPFeatureAlert[]> = new Map();

  constructor() {
    this.initializeSERPFeatures();
    this.generateInitialSnapshots();
    this.analyzeTrends();
    this.identifyOpportunities();
    this.setupAlerts();
  }

  /**
   * Initialisiert SERP-Features
   */
  private initializeSERPFeatures(): void {
    const features: SERPFeature[] = [
      {
        id: 'local_pack',
        name: 'Local Pack',
        type: 'local_pack',
        description: 'Lokale Geschäftsergebnisse mit Karte, Bewertungen und Kontaktdaten',
        impact: 'high',
        visibility: 'always_visible',
        eligibility: [
          'Google My Business Profil',
          'Lokale Suchabsicht',
          'NAP-Konsistenz',
          'Positive Bewertungen'
        ],
        optimizationTips: [
          'GMB-Profil optimieren',
          'Bewertungen sammeln',
          'NAP-Konsistenz sicherstellen',
          'Lokale Keywords verwenden'
        ]
      },
      {
        id: 'featured_snippet',
        name: 'Featured Snippet',
        type: 'featured_snippet',
        description: 'Hervorgehobene Antwort auf Suchanfrage oben in den Ergebnissen',
        impact: 'high',
        visibility: 'conditional',
        eligibility: [
          'Hochwertiger Content',
          'Strukturierte Daten',
          'Frage-Antwort-Format',
          'Autorität der Domain'
        ],
        optimizationTips: [
          'Fragen in Content beantworten',
          'Tabellen und Listen verwenden',
          'Strukturierte Daten implementieren',
          'Content für Sprachsuche optimieren'
        ]
      },
      {
        id: 'knowledge_panel',
        name: 'Knowledge Panel',
        type: 'knowledge_panel',
        description: 'Informationsbox mit Details zum Unternehmen',
        impact: 'medium',
        visibility: 'conditional',
        eligibility: [
          'Starkes GMB-Profil',
          'Wikipedia-Eintrag',
          'Autorität der Domain',
          'Umfangreiche Online-Präsenz'
        ],
        optimizationTips: [
          'GMB-Profil vollständig ausfüllen',
          'Wikipedia-Artikel anstreben',
          'Autorität aufbauen',
          'Strukturierte Daten verwenden'
        ]
      },
      {
        id: 'reviews',
        name: 'Bewertungen',
        type: 'reviews',
        description: 'Sternchenbewertungen und Top-Bewertungen in SERP',
        impact: 'medium',
        visibility: 'always_visible',
        eligibility: [
          'GMB-Profil',
          'Mindestens eine Bewertung',
          'Lokale Suchanfrage'
        ],
        optimizationTips: [
          'Bewertungen aktiv einholen',
          'Auf Bewertungen antworten',
          'Bewertungsaufforderungen senden',
          'Qualität sicherstellen'
        ]
      },
      {
        id: 'directions',
        name: 'Wegbeschreibungen',
        type: 'directions',
        description: 'Direkter Link zu Google Maps Wegbeschreibung',
        impact: 'medium',
        visibility: 'conditional',
        eligibility: [
          'GMB-Profil mit Adresse',
          'Lokale Suchanfrage',
          'Korrekte Adressdaten'
        ],
        optimizationTips: [
          'Adresse in GMB verifizieren',
          'Öffnungszeiten angeben',
          'Korrekte Standortdaten'
        ]
      },
      {
        id: 'photos',
        name: 'Fotos',
        type: 'photos',
        description: 'Geschäftsfotos in den Suchergebnissen',
        impact: 'low',
        visibility: 'conditional',
        eligibility: [
          'GMB-Fotos hochgeladen',
          'Qualitativ hochwertige Bilder',
          'Lokale Suchanfrage'
        ],
        optimizationTips: [
          'Professionelle Fotos hochladen',
          'Regelmäßig aktualisieren',
          'Bilder beschriften',
          'Verschiedene Kategorien abdecken'
        ]
      },
      {
        id: 'posts',
        name: 'Beiträge',
        type: 'posts',
        description: 'GMB-Beiträge in den Suchergebnissen',
        impact: 'low',
        visibility: 'conditional',
        eligibility: [
          'Aktive GMB-Beiträge',
          'Regelmäßige Updates',
          'Lokale Relevanz'
        ],
        optimizationTips: [
          'Regelmäßig Beiträge erstellen',
          'Lokale Events bewerben',
          'Angebote teilen',
          'Saisonale Inhalte'
        ]
      },
      {
        id: 'qanda',
        name: 'Fragen & Antworten',
        type: 'qanda',
        description: 'Q&A-Sektion in GMB',
        impact: 'medium',
        visibility: 'conditional',
        eligibility: [
          'GMB-Profil',
          'Aktive Q&A-Teilnahme',
          'Relevante Fragen'
        ],
        optimizationTips: [
          'Auf Fragen antworten',
          'Eigene Fragen stellen',
          'Hilfreiche Antworten geben',
          'Regelmäßig überwachen'
        ]
      },
      {
        id: 'people_also_ask',
        name: 'People Also Ask',
        type: 'people_also_ask',
        description: 'Ähnliche Fragen mit ausklappbaren Antworten',
        impact: 'medium',
        visibility: 'conditional',
        eligibility: [
          'Umfassender Content',
          'Frage-basiertes Schreiben',
          'Autorität der Domain'
        ],
        optimizationTips: [
          'Fragen in Content integrieren',
          'Ausführliche Antworten geben',
          'Interne Verlinkung',
          'Long-Form Content'
        ]
      },
      {
        id: 'local_services',
        name: 'Lokale Dienstleistungen',
        type: 'local_services',
        description: 'Spezialisierte lokale Service-Angebote',
        impact: 'medium',
        visibility: 'rare',
        eligibility: [
          'GMB-Services eingerichtet',
          'Buchungsoptionen',
          'Verfügbarkeitsangaben'
        ],
        optimizationTips: [
          'Services in GMB definieren',
          'Buchungslinks hinzufügen',
          'Verfügbarkeit aktualisieren',
          'Preise angeben'
        ]
      }
    ];

    features.forEach(feature => {
      this.serpFeatures.set(feature.id, feature);
    });
  }

  /**
   * Generiert initiale SERP-Snapshots
   */
  private generateInitialSnapshots(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const keywords = [
        `solaranlage ${region.city}`,
        `photovoltaik ${region.city}`,
        `pv installation ${region.city}`,
        `solar ${region.city}`,
        `gewerbe solar ${region.city}`
      ];

      keywords.forEach(keyword => {
        const snapshot = this.generateSERPSnapshot(keyword, locationKey, region);
        const key = `${keyword}_${locationKey}`;

        if (!this.snapshots.has(key)) {
          this.snapshots.set(key, []);
        }
        this.snapshots.get(key)!.push(snapshot);
      });
    });
  }

  /**
   * Generiert SERP-Snapshot für Keyword und Standort
   */
  private generateSERPSnapshot(keyword: string, locationKey: string, region: ServiceRegion): SERPFeatureSnapshot {
    const snapshot: SERPFeatureSnapshot = {
      id: `snapshot_${keyword}_${locationKey}_${Date.now()}`,
      keyword,
      locationKey,
      searchEngine: 'google',
      device: 'mobile',
      features: {
        localPack: this.generateLocalPackData(keyword, locationKey),
        featuredSnippet: this.generateFeaturedSnippetData(keyword),
        knowledgePanel: this.generateKnowledgePanelData(keyword, locationKey),
        reviews: this.generateReviewsData(locationKey),
        directions: this.generateDirectionsData(locationKey),
        photos: this.generatePhotosData(locationKey),
        posts: this.generatePostsData(locationKey),
        qanda: this.generateQandAData(locationKey),
        relatedQuestions: this.generateRelatedQuestionsData(keyword),
        peopleAlsoAsk: this.generatePeopleAlsoAskData(keyword),
        localServices: this.generateLocalServicesData(locationKey),
        emergencyServices: this.generateEmergencyServicesData(locationKey)
      },
      searchVolume: Math.floor(Math.random() * 1000) + 100,
      competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      capturedAt: new Date().toISOString(),
      searchLocation: {
        query: keyword,
        coordinates: [region.lat, region.lng],
        radius: 50000
      }
    };

    return snapshot;
  }

  /**
   * Generiert Local Pack Daten
   */
  private generateLocalPackData(keyword: string, locationKey: string): SERPFeatureSnapshot['features']['localPack'] {
    const present = Math.random() > 0.2; // 80% Wahrscheinlichkeit

    if (!present) {
      return {
        present: false,
        position: 0,
        entries: [],
        mapVisible: false,
        filters: []
      };
    }

    const entries: LocalPackEntry[] = [];
    const competitorNames = [
      'SolarTech Berlin GmbH',
      'GreenEnergy Hamburg',
      'PV München Pro',
      'EcoSolar Köln',
      'SunPower Frankfurt'
    ];

    for (let i = 0; i < 3; i++) {
      entries.push({
        businessId: `business_${i}`,
        businessName: i === 0 ? 'ZOE Solar GmbH' : competitorNames[i],
        position: i + 1,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200) + 20,
        address: `${Math.floor(Math.random() * 100) + 1} Musterstraße, ${locationKey}`,
        phone: `+49 ${Math.floor(Math.random() * 900) + 100} 123456`,
        website: `https://www.${entries[i]?.businessName.toLowerCase().replace(/\s+/g, '')}.de`,
        directionsUrl: `https://maps.google.com/?daddr=${encodeURIComponent(entries[i]?.address || '')}`,
        photos: [
          {
            url: `https://example.com/photo${i + 1}.jpg`,
            caption: 'Geschäftsfassade'
          }
        ],
        attributes: [
          { name: 'Open 24 hours', value: false },
          { name: 'Offers delivery', value: true },
          { name: 'Offers pickup', value: true }
        ],
        priceRange: '€€',
        hours: {
          monday: { open: '08:00', close: '18:00', isOpen: true },
          tuesday: { open: '08:00', close: '18:00', isOpen: true },
          wednesday: { open: '08:00', close: '18:00', isOpen: true },
          thursday: { open: '08:00', close: '18:00', isOpen: true },
          friday: { open: '08:00', close: '18:00', isOpen: true },
          saturday: { open: '09:00', close: '16:00', isOpen: true },
          sunday: { open: '00:00', close: '00:00', isOpen: false }
        },
        distance: `${Math.floor(Math.random() * 10) + 1} km`,
        isClaimed: true,
        gmbUrl: `https://www.google.com/maps/place/${encodeURIComponent(entries[i]?.businessName || '')}`
      });
    }

    return {
      present: true,
      position: 1,
      entries,
      mapVisible: true,
      filters: ['Rating', 'Distance', 'Open now']
    };
  }

  /**
   * Generiert Featured Snippet Daten
   */
  private generateFeaturedSnippetData(keyword: string): SERPFeatureSnapshot['features']['featuredSnippet'] {
    const present = Math.random() > 0.7; // 30% Wahrscheinlichkeit

    if (!present) {
      return {
        present: false,
        type: null,
        position: 0,
        content: '',
        source: '',
        title: ''
      };
    }

    const types: ('paragraph' | 'list' | 'table' | 'video')[] = ['paragraph', 'list', 'table'];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      present: true,
      type,
      position: Math.floor(Math.random() * 3) + 1,
      content: `Eine Solaranlage besteht aus Photovoltaik-Modulen, die Sonnenlicht in Strom umwandeln. Die Installation erfordert eine fachgerechte Montage auf dem Dach.`,
      source: 'zoe-solar.de',
      title: 'Was ist eine Solaranlage?'
    };
  }

  /**
   * Generiert Knowledge Panel Daten
   */
  private generateKnowledgePanelData(keyword: string, locationKey: string): SERPFeatureSnapshot['features']['knowledgePanel'] {
    const present = Math.random() > 0.6; // 40% Wahrscheinlichkeit

    if (!present) {
      return {
        present: false,
        type: 'business',
        position: 0,
        title: '',
        description: '',
        attributes: [],
        images: []
      };
    }

    return {
      present: true,
      type: 'business',
      position: 2,
      title: 'ZOE Solar GmbH',
      description: 'ZOE Solar ist ein führender Anbieter von Solaranlagen und Photovoltaik-Lösungen in Deutschland.',
      attributes: [
        { name: 'Gegründet', value: '2018' },
        { name: 'Hauptsitz', value: locationKey },
        { name: 'Mitarbeiter', value: '50+' },
        { name: 'Website', value: 'zoe-solar.de' }
      ],
      images: [
        'https://example.com/logo.jpg',
        'https://example.com/office.jpg'
      ],
      reviews: {
        rating: 4.5,
        count: 127,
        topReview: 'Sehr kompetente Beratung und professionelle Installation.'
      }
    };
  }

  /**
   * Generiert Reviews Daten
   */
  private generateReviewsData(locationKey: string): SERPFeatureSnapshot['features']['reviews'] {
    return {
      present: true,
      position: 1,
      businessName: 'ZOE Solar GmbH',
      rating: 4.3,
      reviewCount: 89,
      topReviews: [
        {
          author: 'Jeremy Schulze',
          rating: 5,
          text: 'Ausgezeichnete Beratung und Installation. Sehr zufrieden!',
          date: '2024-01-15'
        },
        {
          author: 'Anna Schmidt',
          rating: 4,
          text: 'Gute Arbeit, aber die Kommunikation könnte besser sein.',
          date: '2024-01-10'
        }
      ]
    };
  }

  /**
   * Generiert Directions Daten
   */
  private generateDirectionsData(locationKey: string): SERPFeatureSnapshot['features']['directions'] {
    return {
      present: true,
      position: 1,
      businessName: 'ZOE Solar GmbH',
      address: `Musterstraße 123, ${locationKey}`,
      distance: '2.3 km',
      travelTime: '8 min'
    };
  }

  /**
   * Generiert Photos Daten
   */
  private generatePhotosData(locationKey: string): SERPFeatureSnapshot['features']['photos'] {
    return {
      present: true,
      position: 2,
      count: 12,
      businessName: 'ZOE Solar GmbH',
      images: [
        { url: 'https://example.com/solar1.jpg', caption: 'Solaranlage Installation' },
        { url: 'https://example.com/office.jpg', caption: 'Büro' },
        { url: 'https://example.com/team.jpg', caption: 'Team' }
      ]
    };
  }

  /**
   * Generiert Posts Daten
   */
  private generatePostsData(locationKey: string): SERPFeatureSnapshot['features']['posts'] {
    return {
      present: true,
      position: 3,
      count: 8,
      businessName: 'ZOE Solar GmbH',
      recentPosts: [
        {
          title: 'Neue Fördermöglichkeiten für Solaranlagen',
          date: '2024-01-20',
          snippet: 'Informieren Sie sich über die aktuellen Förderprogramme...'
        },
        {
          title: 'Winterwartung Ihrer Solaranlage',
          date: '2024-01-15',
          snippet: 'Wichtige Tipps für die kalte Jahreszeit...'
        }
      ]
    };
  }

  /**
   * Generiert Q&A Daten
   */
  private generateQandAData(locationKey: string): SERPFeatureSnapshot['features']['qanda'] {
    return {
      present: true,
      position: 4,
      questionCount: 15,
      businessName: 'ZOE Solar GmbH',
      topQuestions: [
        {
          question: 'Wie lange dauert die Installation einer Solaranlage?',
          answer: 'Die Installation dauert typischerweise 1-3 Tage, abhängig von der Größe.',
          author: 'ZOE Solar GmbH',
          date: '2024-01-18'
        },
        {
          question: 'Welche Förderungen gibt es für Solaranlagen?',
          answer: 'Es gibt die KfW-Förderung und die Einspeisevergütung.',
          author: 'ZOE Solar GmbH',
          date: '2024-01-16'
        }
      ]
    };
  }

  /**
   * Generiert Related Questions Daten
   */
  private generateRelatedQuestionsData(keyword: string): SERPFeatureSnapshot['features']['relatedQuestions'] {
    return {
      present: true,
      position: 5,
      questions: [
        'Wie funktioniert eine Solaranlage?',
        'Was kostet eine Solaranlage?',
        'Welche Förderungen gibt es?',
        'Wie lange rechnet sich eine Solaranlage?'
      ]
    };
  }

  /**
   * Generiert People Also Ask Daten
   */
  private generatePeopleAlsoAskData(keyword: string): SERPFeatureSnapshot['features']['peopleAlsoAsk'] {
    return {
      present: true,
      position: 6,
      questions: [
        {
          question: 'Wie funktioniert eine Photovoltaikanlage?',
          answer: 'Eine Photovoltaikanlage wandelt Sonnenlicht mithilfe von Solarzellen in elektrischen Strom um.',
          source: 'zoe-solar.de',
          expanded: true
        },
        {
          question: 'Was sind die Vorteile einer Solaranlage?',
          answer: 'Solaranlagen sparen Stromkosten, sind umweltfreundlich und erhöhen den Immobilienwert.',
          source: 'wikipedia.org',
          expanded: false
        }
      ]
    };
  }

  /**
   * Generiert Local Services Daten
   */
  private generateLocalServicesData(locationKey: string): SERPFeatureSnapshot['features']['localServices'] {
    return {
      present: false,
      position: 0,
      services: []
    };
  }

  /**
   * Generiert Emergency Services Daten
   */
  private generateEmergencyServicesData(locationKey: string): SERPFeatureSnapshot['features']['emergencyServices'] {
    return {
      present: false,
      position: 0,
      services: []
    };
  }

  /**
   * Analysiert Trends
   */
  private analyzeTrends(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const keywords = [`solaranlage ${locationKey}`, `photovoltaik ${locationKey}`];

      keywords.forEach(keyword => {
        const key = `${keyword}_${locationKey}`;
        const snapshots = this.snapshots.get(key) || [];

        // Trends für verschiedene Features analysieren
        const features = ['localPack', 'featuredSnippet', 'knowledgePanel', 'reviews'];

        features.forEach(feature => {
          const trend = this.analyzeFeatureTrend(feature, keyword, locationKey, snapshots);
          const trendKey = `${feature}_${keyword}_${locationKey}`;

          if (!this.trends.has(trendKey)) {
            this.trends.set(trendKey, []);
          }
          this.trends.get(trendKey)!.push(trend);
        });
      });
    });
  }

  /**
   * Analysiert Trend für ein Feature
   */
  private analyzeFeatureTrend(
    feature: string,
    keyword: string,
    locationKey: string,
    snapshots: SERPFeatureSnapshot[]
  ): SERPFeatureTrend {
    // Vereinfachte Trend-Analyse
    const dataPoints = snapshots.map(snapshot => ({
      date: snapshot.capturedAt,
      present: (snapshot.features as any)[feature]?.present || false,
      position: (snapshot.features as any)[feature]?.position || 0,
      impressions: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 100)
    }));

    const visibility = dataPoints.filter(dp => dp.present).length / dataPoints.length;
    const avgPosition = dataPoints.reduce((sum, dp) => sum + dp.position, 0) / dataPoints.length;

    let trend: SERPFeatureTrend['trend'] = 'stable';
    if (visibility > 0.8) trend = 'increasing';
    else if (visibility < 0.3) trend = 'declining';

    return {
      feature,
      locationKey,
      keyword,
      trend,
      visibility: visibility * 100,
      position: avgPosition,
      impact: visibility * 10, // Vereinfacht
      timeframe: '30_days',
      dataPoints,
      insights: [
        `${feature} ist in ${Math.round(visibility * 100)}% der Suchen präsent`,
        `Durchschnittliche Position: ${Math.round(avgPosition * 10) / 10}`,
        trend === 'increasing' ? 'Aufwärtstrend erkennbar' : 'Stabile Präsenz'
      ],
      recommendations: [
        'Content-Optimierung fortsetzen',
        'Technische SEO verbessern',
        'Backlink-Profil stärken'
      ]
    };
  }

  /**
   * Identifiziert Opportunities
   */
  private identifyOpportunities(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const opportunities: SERPFeatureOpportunity[] = [];

      // Featured Snippet Opportunities
      if (Math.random() > 0.6) {
        opportunities.push({
          id: `opp_featured_${locationKey}_${Date.now()}`,
          keyword: `solaranlage ${locationKey}`,
          locationKey,
          feature: 'featured_snippet',
          opportunityType: 'featured_snippet',
          potential: 85,
          difficulty: 'medium',
          competition: 'medium',
          estimatedTraffic: 1200,
          estimatedConversions: 48,
          requirements: [
            'Umfassender Guide-Content',
            'Strukturierte Daten',
            'Frage-basiertes Schreiben'
          ],
          implementationSteps: [
            'Content-Gap-Analyse durchführen',
            'Umfassenden Leitfaden erstellen',
            'Schema.org Markup implementieren',
            'Interne Verlinkung optimieren'
          ],
          timeline: 'short_term',
          roi: 3.2,
          createdAt: new Date().toISOString()
        });
      }

      // Local Pack Opportunities
      opportunities.push({
        id: `opp_localpack_${locationKey}_${Date.now()}`,
        keyword: `photovoltaik ${locationKey}`,
        locationKey,
        feature: 'local_pack',
        opportunityType: 'local_pack',
        potential: 95,
        difficulty: 'high',
        competition: 'high',
        estimatedTraffic: 2500,
        estimatedConversions: 125,
        requirements: [
          'Optimiertes GMB-Profil',
          'Hohe Bewertungen',
            'NAP-Konsistenz',
            'Lokale Backlinks'
          ],
          implementationSteps: [
            'GMB-Profil vollständig optimieren',
            'Bewertungskampagne starten',
            'Citation-Audit durchführen',
            'Lokales Linkbuilding'
          ],
          timeline: 'immediate',
          roi: 4.8,
          createdAt: new Date().toISOString()
        });

      this.opportunities.set(locationKey, opportunities);
    });
  }

  /**
   * Richtet Alerts ein
   */
  private setupAlerts(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const alerts: SERPFeatureAlert[] = [];

      // Ranking-Alert
      alerts.push({
        id: `alert_ranking_${locationKey}_${Date.now()}`,
        type: 'opportunity',
        severity: 'medium',
        keyword: `solaranlage ${locationKey}`,
        locationKey,
        feature: 'local_pack',
        message: 'Position im Local Pack verbessert sich',
        details: 'Ihre Position für "solaranlage" hat sich von 3 auf 2 verbessert',
        recommendations: [
          'GMB-Bewertungen weiter sammeln',
          'Lokale Inhalte erweitern',
          'Citation-Konsistenz überwachen'
        ],
        actionable: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Featured Snippet Alert
      if (Math.random() > 0.7) {
        alerts.push({
          id: `alert_snippet_${locationKey}_${Date.now()}`,
          type: 'opportunity',
          severity: 'high',
          keyword: `photovoltaik ${locationKey}`,
          locationKey,
          feature: 'featured_snippet',
          message: 'Featured Snippet Opportunity identifiziert',
          details: 'Für das Keyword "photovoltaik" ist ein Featured Snippet verfügbar',
          recommendations: [
            'Detaillierten Guide erstellen',
            'Fragen umfassend beantworten',
            'Strukturierte Daten hinzufügen'
          ],
          actionable: true,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      this.alerts.set(locationKey, alerts);
    });
  }

  /**
   * Ruft SERP-Snapshot ab
   */
  public getSERPSnapshot(keyword: string, locationKey: string): SERPFeatureSnapshot | null {
    const snapshots = this.snapshots.get(`${keyword}_${locationKey}`);
    return snapshots ? snapshots[snapshots.length - 1] : null;
  }

  /**
   * Ruft SERP-Trends ab
   */
  public getSERPTrends(feature: string, keyword: string, locationKey: string): SERPFeatureTrend | null {
    const trends = this.trends.get(`${feature}_${keyword}_${locationKey}`);
    return trends ? trends[trends.length - 1] : null;
  }

  /**
   * Ruft Opportunities ab
   */
  public getSERPOpportunities(locationKey: string): SERPFeatureOpportunity[] {
    return this.opportunities.get(locationKey) || [];
  }

  /**
   * Ruft Alerts ab
   */
  public getSERPAlerts(locationKey: string): SERPFeatureAlert[] {
    return this.alerts.get(locationKey) || [];
  }

  /**
   * Führt SERP-Analyse durch
   */
  public performSERPAnalysis(keyword: string, locationKey: string): {
    overview: {
      keyword: string;
      locationKey: string;
      searchVolume: number;
      competition: string;
      featurePresence: { [key: string]: boolean };
    };
    localPackAnalysis: {
      present: boolean;
      position: number;
      competitors: number;
      ourPosition?: number;
      opportunities: string[];
    };
    featuredContentAnalysis: {
      featuredSnippet: boolean;
      knowledgePanel: boolean;
      peopleAlsoAsk: boolean;
      contentGaps: string[];
      optimizationOpportunities: string[];
    };
    competitorAnalysis: SERPCompetitorAnalysis;
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      feature: string;
      action: string;
      expectedImpact: number;
      difficulty: string;
    }>;
  } {
    const snapshot = this.getSERPSnapshot(keyword, locationKey);

    if (!snapshot) {
      throw new Error(`No SERP data found for keyword "${keyword}" in location "${locationKey}"`);
    }

    const featurePresence: { [key: string]: boolean } = {};
    Object.keys(snapshot.features).forEach(feature => {
      featurePresence[feature] = (snapshot.features as any)[feature].present;
    });

    // Local Pack Analyse
    const localPack = snapshot.features.localPack;
    const ourPosition = localPack.entries.findIndex(entry => entry.businessName === 'ZOE Solar GmbH') + 1;

    // Featured Content Analyse
    const featuredSnippet = snapshot.features.featuredSnippet.present;
    const knowledgePanel = snapshot.features.knowledgePanel.present;
    const peopleAlsoAsk = snapshot.features.peopleAlsoAsk.present;

    // Content Gaps identifizieren
    const contentGaps = [];
    if (!featuredSnippet) contentGaps.push('Featured Snippet fehlt');
    if (!knowledgePanel) contentGaps.push('Knowledge Panel nicht vorhanden');
    if (!peopleAlsoAsk) contentGaps.push('People Also Ask nicht präsent');

    // Competitor Analyse
    const competitorAnalysis = this.analyzeSERPCompetitors(keyword, locationKey, snapshot);

    // Recommendations
    const recommendations = [
      {
        priority: 'high' as const,
        feature: 'local_pack',
        action: 'GMB-Optimierung und Bewertungssammlung',
        expectedImpact: 25,
        difficulty: 'medium'
      },
      {
        priority: 'high' as const,
        feature: 'featured_snippet',
        action: 'Umfassenden FAQ-Content erstellen',
        expectedImpact: 20,
        difficulty: 'medium'
      },
      {
        priority: 'medium' as const,
        feature: 'knowledge_panel',
        action: 'GMB-Profil erweitern und Autorität stärken',
        expectedImpact: 15,
        difficulty: 'high'
      }
    ];

    return {
      overview: {
        keyword,
        locationKey,
        searchVolume: snapshot.searchVolume,
        competition: snapshot.competition,
        featurePresence
      },
      localPackAnalysis: {
        present: localPack.present,
        position: ourPosition || 0,
        competitors: localPack.entries.length,
        ourPosition: ourPosition || undefined,
        opportunities: ourPosition > 3 ? ['Position verbessern'] : ['Position halten']
      },
      featuredContentAnalysis: {
        featuredSnippet,
        knowledgePanel,
        peopleAlsoAsk,
        contentGaps,
        optimizationOpportunities: [
          'Frage-basierten Content erstellen',
          'Strukturierte Daten implementieren',
          'Autorität der Domain stärken'
        ]
      },
      competitorAnalysis,
      recommendations
    };
  }

  /**
   * Analysiert SERP-Competitors
   */
  private analyzeSERPCompetitors(
    keyword: string,
    locationKey: string,
    snapshot: SERPFeatureSnapshot
  ): SERPCompetitorAnalysis {
    const competitors = snapshot.features.localPack.entries
      .filter(entry => entry.businessName !== 'ZOE Solar GmbH')
      .map(entry => ({
        businessName: entry.businessName,
        features: ['local_pack', 'reviews', 'directions'], // Vereinfacht
        strengths: ['Hohe Bewertungen', 'Lokale Präsenz'],
        weaknesses: ['Wenig Content', 'Begrenzte Services'],
        opportunities: ['Content-Erweiterung', 'Service-Ausbau']
      }));

    const featureComparison: { [key: string]: any } = {
      local_pack: {
        ourPresence: snapshot.features.localPack.entries.some(e => e.businessName === 'ZOE Solar GmbH'),
        competitorPresence: snapshot.features.localPack.entries.length - 1,
        ourPosition: snapshot.features.localPack.entries.findIndex(e => e.businessName === 'ZOE Solar GmbH') + 1,
        bestCompetitorPosition: 1,
        gap: 0
      }
    };

    return {
      keyword,
      locationKey,
      competitors,
      featureComparison,
      recommendations: [
        {
          feature: 'local_pack',
          action: 'Bewertungen sammeln und GMB optimieren',
          priority: 'high',
          impact: 25
        }
      ],
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Ruft SERP-Features ab
   */
  public getSERPFeatures(): SERPFeature[] {
    return Array.from(this.serpFeatures.values());
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalSnapshots: number;
    activeFeatures: number;
    totalOpportunities: number;
    activeAlerts: number;
    featurePerformance: Array<{
      feature: string;
      presence: number;
      avgPosition: number;
      trend: string;
    }>;
    topOpportunities: SERPFeatureOpportunity[];
    recentAlerts: SERPFeatureAlert[];
    locationBreakdown: Array<{
      location: string;
      snapshots: number;
      opportunities: number;
      alerts: number;
    }>;
  } {
    const totalSnapshots = Array.from(this.snapshots.values()).reduce((sum, snaps) => sum + snaps.length, 0);
    const activeFeatures = this.serpFeatures.size;
    const totalOpportunities = Array.from(this.opportunities.values()).reduce((sum, opps) => sum + opps.length, 0);
    const activeAlerts = Array.from(this.alerts.values()).reduce((sum, alerts) => sum + alerts.length, 0);

    // Feature Performance
    const featurePerformance = Array.from(this.serpFeatures.values()).map(feature => {
      const presence = Math.floor(Math.random() * 40) + 30; // 30-70%
      const avgPosition = Math.floor(Math.random() * 5) + 1;
      const trends = ['increasing', 'stable', 'decreasing'];
      const trend = trends[Math.floor(Math.random() * trends.length)];

      return {
        feature: feature.name,
        presence,
        avgPosition,
        trend
      };
    });

    // Top Opportunities
    const allOpportunities = Array.from(this.opportunities.values()).flat();
    const topOpportunities = allOpportunities
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 5);

    // Recent Alerts
    const allAlerts = Array.from(this.alerts.values()).flat();
    const recentAlerts = allAlerts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Location Breakdown
    const locationBreakdown = PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      return {
        location: locationKey,
        snapshots: this.snapshots.get(`${Object.keys(this.snapshots).find(key => key.includes(locationKey)) || ''}`)?.length || 0,
        opportunities: this.opportunities.get(locationKey)?.length || 0,
        alerts: this.alerts.get(locationKey)?.length || 0
      };
    });

    return {
      totalSnapshots,
      activeFeatures,
      totalOpportunities,
      activeAlerts,
      featurePerformance,
      topOpportunities,
      recentAlerts,
      locationBreakdown
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const advancedLocalSERPFeatureMonitoringService = new AdvancedLocalSERPFeatureMonitoringService();