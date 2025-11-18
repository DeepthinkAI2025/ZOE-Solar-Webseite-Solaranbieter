import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';

export interface UserSession {
  sessionId: string;
  userId?: string;
  locationKey: string;
  startTime: string;
  endTime?: string;
  duration: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  ipLocation: {
    city: string;
    region: string;
    country: string;
    coordinates: [number, number];
  };
  referrer: string;
  landingPage: string;
  exitPage: string;
  pageViews: number;
  events: UserEvent[];
  conversions: Conversion[];
  localIntent: LocalIntent;
  searchQuery?: string;
  serpFeatures: SERPFeature[];
}

export interface UserEvent {
  eventId: string;
  timestamp: string;
  eventType: 'page_view' | 'click' | 'scroll' | 'form_interaction' | 'phone_click' | 'direction_request' | 'gmb_view';
  pageUrl: string;
  element?: string;
  value?: any;
  localContext: {
    locationKey: string;
    serviceType?: string;
    intentStrength: number;
  };
}

export interface Conversion {
  conversionId: string;
  timestamp: string;
  type: 'lead_form' | 'phone_call' | 'email' | 'appointment' | 'quote_request' | 'gmb_call';
  value: number;
  source: 'organic' | 'gmb' | 'paid' | 'direct';
  locationKey: string;
  attribution: AttributionData;
}

export interface LocalIntent {
  primaryIntent: 'information' | 'comparison' | 'purchase' | 'emergency' | 'support';
  intentStrength: number;
  locationSpecificity: 'broad' | 'city' | 'neighborhood' | 'address';
  serviceTypes: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  budgetRange?: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: 'immediate' | 'this_week' | 'this_month' | 'planning';
  confidence: number;
}

export interface SERPFeature {
  feature: 'local_pack' | 'featured_snippet' | 'knowledge_panel' | 'reviews' | 'directions' | 'website_link';
  position: number;
  clicked: boolean;
  dwellTime?: number;
  interactionType: 'view' | 'click' | 'call' | 'directions';
}

export interface AttributionData {
  touchpoints: Array<{
    channel: string;
    timestamp: string;
    interaction: string;
    weight: number;
  }>;
  firstTouch: {
    channel: string;
    timestamp: string;
  };
  lastTouch: {
    channel: string;
    timestamp: string;
  };
  conversionPath: string[];
  localAttribution: {
    locationKey: string;
    localSearch: boolean;
    gmbInteraction: boolean;
    citationInfluence: boolean;
  };
}

export interface UserJourney {
  userId: string;
  locationKey: string;
  journeyId: string;
  startDate: string;
  lastActivity: string;
  totalSessions: number;
  totalPageViews: number;
  totalConversions: number;
  totalValue: number;
  stages: JourneyStage[];
  currentStage: string;
  intentEvolution: IntentEvolution[];
  localBehavior: LocalBehaviorPattern;
  predictedNextAction: string;
  churnRisk: number;
}

export interface JourneyStage {
  stage: 'awareness' | 'consideration' | 'decision' | 'retention' | 'advocacy';
  enteredAt: string;
  exitedAt?: string;
  duration: number;
  activities: string[];
  conversions: number;
  value: number;
}

export interface IntentEvolution {
  timestamp: string;
  intent: LocalIntent;
  trigger: string;
  confidence: number;
}

export interface LocalBehaviorPattern {
  searchFrequency: 'daily' | 'weekly' | 'monthly' | 'rare';
  preferredChannels: string[];
  localSearchHabits: {
    usesLocalPack: boolean;
    checksReviews: boolean;
    requestsDirections: boolean;
    callsBusinesses: boolean;
  };
  contentPreferences: {
    video: boolean;
    blog: boolean;
    testimonials: boolean;
    pricing: boolean;
  };
  conversionPatterns: {
    preferredContactMethod: string;
    decisionTimeframe: string;
    priceSensitivity: 'low' | 'medium' | 'high';
  };
}

export interface BehaviorSegment {
  segmentId: string;
  name: string;
  description: string;
  criteria: {
    locationKey?: string;
    intentType?: string[];
    behaviorPatterns?: string[];
    valueRange?: { min: number; max: number };
  };
  size: number;
  avgValue: number;
  conversionRate: number;
  characteristics: {
    demographics: { [key: string]: any };
    preferences: string[];
    painPoints: string[];
  };
  recommendations: string[];
  createdAt: string;
}

export interface LocalHeatmap {
  locationKey: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: {
    searches: Array<{
      keyword: string;
      location: [number, number];
      intensity: number;
      timestamp: string;
    }>;
    clicks: Array<{
      page: string;
      location: [number, number];
      intensity: number;
      timestamp: string;
    }>;
    conversions: Array<{
      type: string;
      location: [number, number];
      value: number;
      timestamp: string;
    }>;
  };
  insights: {
    hotspots: Array<{
      coordinates: [number, number];
      radius: number;
      activity: string;
      potential: number;
    }>;
    trends: Array<{
      type: string;
      change: number;
      significance: 'low' | 'medium' | 'high';
    }>;
  };
}

export interface PredictiveBehavior {
  userId: string;
  locationKey: string;
  predictions: Array<{
    action: string;
    probability: number;
    timeframe: string;
    influencingFactors: string[];
    recommendedResponse: string;
  }>;
  riskAssessment: {
    churnRisk: number;
    competitionRisk: number;
    intentDecayRisk: number;
  };
  opportunities: Array<{
    opportunity: string;
    potentialValue: number;
    confidence: number;
    actionRequired: string;
  }>;
  generatedAt: string;
}

/**
 * Local User Behavior Tracking Service
 * Umfassende Verfolgung und Analyse des lokalen Nutzerverhaltens
 */
export class LocalUserBehaviorTrackingService {
  private sessions: Map<string, UserSession> = new Map();
  private journeys: Map<string, UserJourney> = new Map();
  private segments: Map<string, BehaviorSegment> = new Map();
  private heatmaps: Map<string, LocalHeatmap> = new Map();
  private predictions: Map<string, PredictiveBehavior> = new Map();

  constructor() {
    this.initializeTracking();
    this.generateSampleData();
    this.createBehaviorSegments();
    this.generateHeatmaps();
  }

  /**
   * Initialisiert das Tracking-System
   */
  private initializeTracking(): void {
    // Event-Listener für verschiedene Tracking-Events
    this.setupEventListeners();
  }

  /**
   * Richtet Event-Listener ein
   */
  private setupEventListeners(): void {
    // Hier würden normalerweise Event-Listener für verschiedene Plattformen eingerichtet
    // Für diese Implementierung simulieren wir die Daten
  }

  /**
   * Generiert Beispieldaten für Demonstration
   */
  private generateSampleData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      // Generiere 50-100 Sessions pro Standort
      const sessionCount = 50 + Math.floor(Math.random() * 50);

      for (let i = 0; i < sessionCount; i++) {
        const session = this.generateSampleSession(locationKey, region);
        this.sessions.set(session.sessionId, session);

        // Erstelle oder aktualisiere User Journey
        this.updateUserJourney(session);
      }
    });
  }

  /**
   * Generiert eine Beispielsitzung
   */
  private generateSampleSession(locationKey: string, region: ServiceRegion): UserSession {
    const sessionId = `session_${locationKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Letzte 30 Tage
    const duration = Math.floor(Math.random() * 1800) + 30; // 30 Sekunden bis 30 Minuten
    const endTime = new Date(startTime.getTime() + duration * 1000);

    const deviceTypes: UserSession['deviceType'][] = ['desktop', 'mobile', 'tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

    const events = this.generateSampleEvents(sessionId, locationKey, startTime, duration);
    const conversions = this.generateSampleConversions(sessionId, locationKey, events);

    const localIntent = this.determineLocalIntent(locationKey, events);

    return {
      sessionId,
      locationKey,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      ipLocation: {
        city: region.city,
        region: region.state,
        country: 'Germany',
        coordinates: [region.lat, region.lng]
      },
      referrer: Math.random() > 0.7 ? 'google.com' : 'direct',
      landingPage: `/standort/${locationKey}`,
      exitPage: conversions.length > 0 ? '/kontakt' : '/preise',
      pageViews: events.filter(e => e.eventType === 'page_view').length,
      events,
      conversions,
      localIntent,
      searchQuery: Math.random() > 0.6 ? `solaranlage ${region.city}` : undefined,
      serpFeatures: this.generateSampleSERPFeatures()
    };
  }

  /**
   * Generiert Beispiele-Events für eine Session
   */
  private generateSampleEvents(sessionId: string, locationKey: string, startTime: Date, duration: number): UserEvent[] {
    const events: UserEvent[] = [];
    const eventCount = Math.floor(Math.random() * 10) + 3; // 3-12 Events

    for (let i = 0; i < eventCount; i++) {
      const eventTime = new Date(startTime.getTime() + (i / eventCount) * duration * 1000);
      const eventTypes: UserEvent['eventType'][] = ['page_view', 'click', 'scroll', 'form_interaction', 'phone_click', 'direction_request'];

      events.push({
        eventId: `event_${sessionId}_${i}`,
        timestamp: eventTime.toISOString(),
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        pageUrl: i === 0 ? `/standort/${locationKey}` : `/dienstleistungen/${locationKey}`,
        element: Math.random() > 0.5 ? '.contact-button' : '.pricing-table',
        localContext: {
          locationKey,
          serviceType: 'solar_installation',
          intentStrength: Math.floor(Math.random() * 100)
        }
      });
    }

    return events;
  }

  /**
   * Generiert Beispiel-Conversions
   */
  private generateSampleConversions(sessionId: string, locationKey: string, events: UserEvent[]): Conversion[] {
    const conversions: Conversion[] = [];
    const conversionRate = 0.15; // 15% Conversion-Rate

    if (Math.random() < conversionRate) {
      const conversionTypes: Conversion['type'][] = ['lead_form', 'phone_call', 'email', 'appointment'];
      const sources: Conversion['source'][] = ['organic', 'gmb', 'paid', 'direct'];

      conversions.push({
        conversionId: `conv_${sessionId}`,
        timestamp: events[events.length - 1].timestamp,
        type: conversionTypes[Math.floor(Math.random() * conversionTypes.length)],
        value: Math.floor(Math.random() * 5000) + 1000, // 1000-6000€
        source: sources[Math.floor(Math.random() * sources.length)],
        locationKey,
        attribution: this.generateAttributionData(locationKey)
      });
    }

    return conversions;
  }

  /**
   * Bestimmt lokales Intent basierend auf Events
   */
  private determineLocalIntent(locationKey: string, events: UserEvent[]): LocalIntent {
    const intentTypes: LocalIntent['primaryIntent'][] = ['information', 'comparison', 'purchase', 'emergency', 'support'];
    const locationSpecificities: LocalIntent['locationSpecificity'][] = ['broad', 'city', 'neighborhood', 'address'];
    const urgencies: LocalIntent['urgencyLevel'][] = ['low', 'medium', 'high'];
    const timelines: LocalIntent['timeline'][] = ['immediate', 'this_week', 'this_month', 'planning'];

    // Analysiere Events für Intent-Bestimmung
    const hasPhoneClick = events.some(e => e.eventType === 'phone_click');
    const hasFormInteraction = events.some(e => e.eventType === 'form_interaction');
    const pageViews = events.filter(e => e.eventType === 'page_view').length;

    let primaryIntent: LocalIntent['primaryIntent'] = 'information';
    if (hasPhoneClick || hasFormInteraction) primaryIntent = 'purchase';
    else if (pageViews > 5) primaryIntent = 'comparison';

    return {
      primaryIntent,
      intentStrength: Math.floor(Math.random() * 100),
      locationSpecificity: locationSpecificities[Math.floor(Math.random() * locationSpecificities.length)],
      serviceTypes: ['solar_installation', 'maintenance', 'consulting'],
      urgencyLevel: urgencies[Math.floor(Math.random() * urgencies.length)],
      budgetRange: Math.random() > 0.5 ? {
        min: 5000,
        max: 25000,
        currency: 'EUR'
      } : undefined,
      timeline: timelines[Math.floor(Math.random() * timelines.length)],
      confidence: Math.floor(Math.random() * 40) + 60 // 60-100%
    };
  }

  /**
   * Generiert SERP-Feature-Daten
   */
  private generateSampleSERPFeatures(): SERPFeature[] {
    const features: SERPFeature['feature'][] = ['local_pack', 'featured_snippet', 'knowledge_panel', 'reviews', 'directions', 'website_link'];
    const featuresData: SERPFeature[] = [];

    features.forEach(feature => {
      if (Math.random() > 0.6) { // 40% Wahrscheinlichkeit für jedes Feature
        featuresData.push({
          feature,
          position: Math.floor(Math.random() * 3) + 1,
          clicked: Math.random() > 0.5,
          dwellTime: Math.random() > 0.5 ? Math.floor(Math.random() * 120) + 10 : undefined,
          interactionType: ['view', 'click', 'call', 'directions'][Math.floor(Math.random() * 4)] as SERPFeature['interactionType']
        });
      }
    });

    return featuresData;
  }

  /**
   * Generiert Attribution-Daten
   */
  private generateAttributionData(locationKey: string): AttributionData {
    const channels = ['organic', 'gmb', 'paid', 'direct', 'social'];
    const touchpoints = [];

    const touchpointCount = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < touchpointCount; i++) {
      touchpoints.push({
        channel: channels[Math.floor(Math.random() * channels.length)],
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        interaction: 'view',
        weight: Math.random()
      });
    }

    const firstTouch = touchpoints[0];
    const lastTouch = touchpoints[touchpoints.length - 1];

    return {
      touchpoints,
      firstTouch: {
        channel: firstTouch.channel,
        timestamp: firstTouch.timestamp
      },
      lastTouch: {
        channel: lastTouch.channel,
        timestamp: lastTouch.timestamp
      },
      conversionPath: touchpoints.map(tp => tp.channel),
      localAttribution: {
        locationKey,
        localSearch: Math.random() > 0.3,
        gmbInteraction: Math.random() > 0.5,
        citationInfluence: Math.random() > 0.4
      }
    };
  }

  /**
   * Aktualisiert oder erstellt User Journey
   */
  private updateUserJourney(session: UserSession): void {
    const userId = session.userId || `user_${session.ipLocation.coordinates.join('_')}`;
    const journeyKey = `${userId}_${session.locationKey}`;

    let journey = this.journeys.get(journeyKey);

    if (!journey) {
      journey = {
        userId,
        locationKey: session.locationKey,
        journeyId: `journey_${journeyKey}`,
        startDate: session.startTime,
        lastActivity: session.endTime || session.startTime,
        totalSessions: 0,
        totalPageViews: 0,
        totalConversions: 0,
        totalValue: 0,
        stages: [],
        currentStage: 'awareness',
        intentEvolution: [],
        localBehavior: this.generateLocalBehaviorPattern(),
        predictedNextAction: 'view_pricing',
        churnRisk: Math.random() * 100
      };
    }

    // Aktualisiere Journey-Metriken
    journey.totalSessions++;
    journey.totalPageViews += session.pageViews;
    journey.totalConversions += session.conversions.length;
    journey.totalValue += session.conversions.reduce((sum, conv) => sum + conv.value, 0);
    journey.lastActivity = session.endTime || session.startTime;

    // Aktualisiere Intent-Evolution
    journey.intentEvolution.push({
      timestamp: session.startTime,
      intent: session.localIntent,
      trigger: session.referrer,
      confidence: session.localIntent.confidence
    });

    // Bestimme aktuelle Stage basierend auf Aktivitäten
    journey.currentStage = this.determineJourneyStage(journey);

    this.journeys.set(journeyKey, journey);
  }

  /**
   * Generiert lokales Verhaltensmuster
   */
  private generateLocalBehaviorPattern(): LocalBehaviorPattern {
    const frequencies: LocalBehaviorPattern['searchFrequency'][] = ['daily', 'weekly', 'monthly', 'rare'];
    const contactMethods = ['phone', 'email', 'form', 'chat'];
    const timeframes = ['immediate', '1_week', '1_month', '3_months'];

    return {
      searchFrequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      preferredChannels: ['google', 'gmb', 'website', 'social'],
      localSearchHabits: {
        usesLocalPack: Math.random() > 0.3,
        checksReviews: Math.random() > 0.2,
        requestsDirections: Math.random() > 0.4,
        callsBusinesses: Math.random() > 0.5
      },
      contentPreferences: {
        video: Math.random() > 0.4,
        blog: Math.random() > 0.3,
        testimonials: Math.random() > 0.2,
        pricing: Math.random() > 0.1
      },
      conversionPatterns: {
        preferredContactMethod: contactMethods[Math.floor(Math.random() * contactMethods.length)],
        decisionTimeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        priceSensitivity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      }
    };
  }

  /**
   * Bestimmt Journey-Stage
   */
  private determineJourneyStage(journey: UserJourney): string {
    if (journey.totalConversions > 0) return 'retention';
    if (journey.totalSessions > 5) return 'decision';
    if (journey.totalPageViews > 10) return 'consideration';
    return 'awareness';
  }

  /**
   * Erstellt Verhaltenssegmente
   */
  private createBehaviorSegments(): void {
    const segments: BehaviorSegment[] = [
      {
        segmentId: 'high_intent_buyers',
        name: 'Hochmotivierte Käufer',
        description: 'Nutzer mit starkem Kaufinteresse und hoher Conversion-Wahrscheinlichkeit',
        criteria: {
          intentType: ['purchase'],
          behaviorPatterns: ['phone_click', 'form_submission']
        },
        size: 0,
        avgValue: 4500,
        conversionRate: 0.35,
        characteristics: {
          demographics: { age: '35-55', income: 'high' },
          preferences: ['premium_service', 'fast_installation'],
          painPoints: ['price_transparency', 'installation_time']
        },
        recommendations: [
          'Priorität bei Lead-Response',
          'Premium-Angebote präsentieren',
          'Schnelle Terminvereinbarung'
        ],
        createdAt: new Date().toISOString()
      },
      {
        segmentId: 'comparison_shoppers',
        name: 'Vergleichs-Shopper',
        description: 'Nutzer in der Recherchephase, vergleichen verschiedene Anbieter',
        criteria: {
          intentType: ['comparison'],
          behaviorPatterns: ['multiple_page_views', 'pricing_check']
        },
        size: 0,
        avgValue: 3200,
        conversionRate: 0.15,
        characteristics: {
          demographics: { age: '25-45', income: 'medium' },
          preferences: ['detailed_info', 'customer_reviews'],
          painPoints: ['too_much_info', 'decision_paralysis']
        },
        recommendations: [
          'Vergleichs-Tools bereitstellen',
          'Kundenbewertungen hervorheben',
          'Follow-up-Emails senden'
        ],
        createdAt: new Date().toISOString()
      },
      {
        segmentId: 'local_searchers',
        name: 'Lokale Sucher',
        description: 'Nutzer, die lokale Dienstleistungen in ihrer Region suchen',
        criteria: {
          locationKey: PRIMARY_SERVICE_REGIONS.map(r => r.city.toLowerCase()).join(','),
          behaviorPatterns: ['local_pack_interaction', 'direction_request']
        },
        size: 0,
        avgValue: 2800,
        conversionRate: 0.25,
        characteristics: {
          demographics: { location: 'local', age: '30-60' },
          preferences: ['local_business', 'personal_service'],
          painPoints: ['distance', 'availability']
        },
        recommendations: [
          'Lokale Präsenz stärken',
          'GMB-Optimierung priorisieren',
          'Lokale Events nutzen'
        ],
        createdAt: new Date().toISOString()
      }
    ];

    segments.forEach(segment => {
      this.segments.set(segment.segmentId, segment);
    });

    // Berechne tatsächliche Segment-Größen basierend auf Journey-Daten
    this.updateSegmentSizes();
  }

  /**
   * Aktualisiert Segment-Größen
   */
  private updateSegmentSizes(): void {
    const journeys = Array.from(this.journeys.values());

    this.segments.forEach(segment => {
      let matchingJourneys = 0;
      let totalValue = 0;
      let conversions = 0;

      journeys.forEach(journey => {
        if (this.matchesSegmentCriteria(journey, segment)) {
          matchingJourneys++;
          totalValue += journey.totalValue;
          conversions += journey.totalConversions;
        }
      });

      segment.size = matchingJourneys;
      segment.avgValue = matchingJourneys > 0 ? totalValue / matchingJourneys : 0;
      segment.conversionRate = matchingJourneys > 0 ? conversions / matchingJourneys : 0;
    });
  }

  /**
   * Prüft, ob Journey Segment-Kriterien erfüllt
   */
  private matchesSegmentCriteria(journey: UserJourney, segment: BehaviorSegment): boolean {
    // Vereinfachte Logik für Demo-Zwecke
    if (segment.segmentId === 'high_intent_buyers') {
      return journey.totalConversions > 0 && journey.totalValue > 3000;
    }
    if (segment.segmentId === 'comparison_shoppers') {
      return journey.totalPageViews > 8 && journey.totalSessions > 2;
    }
    if (segment.segmentId === 'local_searchers') {
      return journey.localBehavior.localSearchHabits.usesLocalPack;
    }
    return false;
  }

  /**
   * Generiert Heatmaps
   */
  private generateHeatmaps(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const heatmap: LocalHeatmap = {
        locationKey,
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        data: {
          searches: [],
          clicks: [],
          conversions: []
        },
        insights: {
          hotspots: [],
          trends: []
        }
      };

      // Generiere Beispiel-Daten für Heatmap
      for (let i = 0; i < 100; i++) {
        const lat = region.lat + (Math.random() - 0.5) * 0.1;
        const lng = region.lng + (Math.random() - 0.5) * 0.1;

        heatmap.data.searches.push({
          keyword: `solaranlage ${region.city}`,
          location: [lat, lng],
          intensity: Math.floor(Math.random() * 100),
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (Math.random() > 0.7) {
          heatmap.data.clicks.push({
            page: '/standort/' + locationKey,
            location: [lat, lng],
            intensity: Math.floor(Math.random() * 50),
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }

        if (Math.random() > 0.9) {
          heatmap.data.conversions.push({
            type: 'lead_form',
            location: [lat, lng],
            value: Math.floor(Math.random() * 5000) + 1000,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      }

      // Generiere Hotspots
      heatmap.insights.hotspots = [
        {
          coordinates: [region.lat, region.lng],
          radius: 2000,
          activity: 'high_search_volume',
          potential: 85
        }
      ];

      // Generiere Trends
      heatmap.insights.trends = [
        {
          type: 'search_increase',
          change: 15,
          significance: 'medium'
        },
        {
          type: 'conversion_improvement',
          change: 8,
          significance: 'low'
        }
      ];

      this.heatmaps.set(locationKey, heatmap);
    });
  }

  /**
   * Zeichnet User-Event auf
   */
  public trackEvent(event: Omit<UserEvent, 'eventId' | 'timestamp'>): void {
    const userEvent: UserEvent = {
      ...event,
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    // Finde oder erstelle Session
    const sessionId = this.findOrCreateSession(event.localContext.locationKey);
    const session = this.sessions.get(sessionId);

    if (session) {
      session.events.push(userEvent);
      session.pageViews = session.events.filter(e => e.eventType === 'page_view').length;
      this.sessions.set(sessionId, session);

      // Aktualisiere Journey
      this.updateUserJourney(session);
    }
  }

  /**
   * Zeichnet Conversion auf
   */
  public trackConversion(conversion: Omit<Conversion, 'conversionId' | 'timestamp'>): void {
    const newConversion: Conversion = {
      ...conversion,
      conversionId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    // Finde Session und füge Conversion hinzu
    const sessionId = this.findOrCreateSession(conversion.locationKey);
    const session = this.sessions.get(sessionId);

    if (session) {
      session.conversions.push(newConversion);
      this.sessions.set(sessionId, session);

      // Aktualisiere Journey
      this.updateUserJourney(session);
    }
  }

  /**
   * Findet oder erstellt Session
   */
  private findOrCreateSession(locationKey: string): string {
    // Vereinfachte Logik - in Realität würde dies komplexer sein
    const sessionId = `session_${locationKey}_${Date.now()}`;
    return sessionId;
  }

  /**
   * Ruft Sessions für Standort ab
   */
  public getSessions(locationKey: string, limit: number = 100): UserSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.locationKey === locationKey)
      .slice(0, limit);
  }

  /**
   * Ruft User Journey ab
   */
  public getUserJourney(userId: string, locationKey: string): UserJourney | null {
    return this.journeys.get(`${userId}_${locationKey}`) || null;
  }

  /**
   * Ruft Verhaltenssegmente ab
   */
  public getBehaviorSegments(): BehaviorSegment[] {
    return Array.from(this.segments.values());
  }

  /**
   * Ruft Heatmap für Standort ab
   */
  public getHeatmap(locationKey: string): LocalHeatmap | null {
    return this.heatmaps.get(locationKey) || null;
  }

  /**
   * Generiert prädiktives Verhalten für User
   */
  public generatePredictiveBehavior(userId: string, locationKey: string): PredictiveBehavior | null {
    const journey = this.getUserJourney(userId, locationKey);
    if (!journey) return null;

    const predictions = [
      {
        action: 'request_quote',
        probability: Math.min(0.8, journey.totalPageViews / 10),
        timeframe: 'next_7_days',
        influencingFactors: ['high_page_views', 'pricing_interest'],
        recommendedResponse: 'Send personalized quote offer'
      },
      {
        action: 'call_business',
        probability: Math.min(0.6, journey.localBehavior.localSearchHabits.callsBusinesses ? 0.7 : 0.3),
        timeframe: 'next_3_days',
        influencingFactors: ['local_search_habits', 'phone_preference'],
        recommendedResponse: 'Prepare sales team for inbound call'
      }
    ];

    const predictiveBehavior: PredictiveBehavior = {
      userId,
      locationKey,
      predictions,
      riskAssessment: {
        churnRisk: journey.churnRisk,
        competitionRisk: Math.random() * 100,
        intentDecayRisk: Math.max(0, 100 - journey.intentEvolution[journey.intentEvolution.length - 1]?.confidence || 0)
      },
      opportunities: [
        {
          opportunity: 'upsell_maintenance',
          potentialValue: 500,
          confidence: 0.7,
          actionRequired: 'Send maintenance package offer'
        }
      ],
      generatedAt: new Date().toISOString()
    };

    this.predictions.set(`${userId}_${locationKey}`, predictiveBehavior);
    return predictiveBehavior;
  }

  /**
   * Analysiert Nutzerverhalten für Standort
   */
  public analyzeUserBehavior(locationKey: string): {
    overview: {
      totalSessions: number;
      totalUsers: number;
      avgSessionDuration: number;
      conversionRate: number;
      avgValuePerUser: number;
    };
    intentAnalysis: {
      primaryIntents: Array<{ intent: string; count: number; percentage: number }>;
      intentEvolution: Array<{ date: string; avgIntentStrength: number }>;
    };
    behaviorPatterns: {
      deviceBreakdown: { [key: string]: number };
      channelPreferences: { [key: string]: number };
      contentEngagement: { [key: string]: number };
    };
    conversionFunnel: Array<{
      stage: string;
      users: number;
      conversionRate: number;
      dropOffRate: number;
    }>;
    recommendations: string[];
  } {
    const sessions = this.getSessions(locationKey);
    const journeys = Array.from(this.journeys.values()).filter(j => j.locationKey === locationKey);

    const totalSessions = sessions.length;
    const totalUsers = journeys.length;
    const avgSessionDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions;
    const totalConversions = sessions.reduce((sum, s) => sum + s.conversions.length, 0);
    const conversionRate = totalSessions > 0 ? totalConversions / totalSessions : 0;
    const totalValue = sessions.reduce((sum, s) => sum + s.conversions.reduce((convSum, conv) => convSum + conv.value, 0), 0);
    const avgValuePerUser = totalUsers > 0 ? totalValue / totalUsers : 0;

    // Intent-Analyse
    const intentCounts: { [key: string]: number } = {};
    sessions.forEach(session => {
      const intent = session.localIntent.primaryIntent;
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    const primaryIntents = Object.entries(intentCounts).map(([intent, count]) => ({
      intent,
      count,
      percentage: (count / totalSessions) * 100
    }));

    // Device-Breakdown
    const deviceBreakdown: { [key: string]: number } = {};
    sessions.forEach(session => {
      deviceBreakdown[session.deviceType] = (deviceBreakdown[session.deviceType] || 0) + 1;
    });

    // Conversion-Funnel (vereinfacht)
    const conversionFunnel = [
      { stage: 'Landing', users: totalSessions, conversionRate: 100, dropOffRate: 0 },
      { stage: 'Engagement', users: Math.round(totalSessions * 0.7), conversionRate: 70, dropOffRate: 30 },
      { stage: 'Consideration', users: Math.round(totalSessions * 0.4), conversionRate: 40, dropOffRate: 60 },
      { stage: 'Conversion', users: totalConversions, conversionRate: conversionRate * 100, dropOffRate: (1 - conversionRate) * 100 }
    ];

    const recommendations = [
      conversionRate < 0.1 ? 'Conversion-Funnel optimieren' : 'Conversion-Rate ist gut',
      avgSessionDuration < 180 ? 'Content-Engagement verbessern' : 'Gute Session-Duration',
      primaryIntents[0]?.intent === 'information' ? 'Mehr Conversion-orientierten Content erstellen' : 'Kaufinteresse gut'
    ];

    return {
      overview: {
        totalSessions,
        totalUsers,
        avgSessionDuration: Math.round(avgSessionDuration),
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgValuePerUser: Math.round(avgValuePerUser)
      },
      intentAnalysis: {
        primaryIntents,
        intentEvolution: [] // Vereinfacht für Demo
      },
      behaviorPatterns: {
        deviceBreakdown,
        channelPreferences: {}, // Vereinfacht
        contentEngagement: {} // Vereinfacht
      },
      conversionFunnel,
      recommendations
    };
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalSessions: number;
    totalUsers: number;
    totalConversions: number;
    avgConversionRate: number;
    topIntents: Array<{ intent: string; count: number }>;
    deviceBreakdown: { [key: string]: number };
    locationPerformance: Array<{ location: string; sessions: number; conversions: number; rate: number }>;
    behaviorInsights: string[];
  } {
    const allSessions = Array.from(this.sessions.values());
    const allJourneys = Array.from(this.journeys.values());

    const totalSessions = allSessions.length;
    const totalUsers = allJourneys.length;
    const totalConversions = allSessions.reduce((sum, s) => sum + s.conversions.length, 0);
    const avgConversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

    // Top Intents
    const intentCounts: { [key: string]: number } = {};
    allSessions.forEach(session => {
      intentCounts[session.localIntent.primaryIntent] = (intentCounts[session.localIntent.primaryIntent] || 0) + 1;
    });

    const topIntents = Object.entries(intentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([intent, count]) => ({ intent, count }));

    // Device Breakdown
    const deviceBreakdown: { [key: string]: number } = {};
    allSessions.forEach(session => {
      deviceBreakdown[session.deviceType] = (deviceBreakdown[session.deviceType] || 0) + 1;
    });

    // Location Performance
    const locationPerformance: { [key: string]: { sessions: number; conversions: number } } = {};
    allSessions.forEach(session => {
      if (!locationPerformance[session.locationKey]) {
        locationPerformance[session.locationKey] = { sessions: 0, conversions: 0 };
      }
      locationPerformance[session.locationKey].sessions++;
      locationPerformance[session.locationKey].conversions += session.conversions.length;
    });

    const locationPerfArray = Object.entries(locationPerformance).map(([location, data]) => ({
      location,
      sessions: data.sessions,
      conversions: data.conversions,
      rate: data.sessions > 0 ? (data.conversions / data.sessions) * 100 : 0
    }));

    const behaviorInsights = [
      `Durchschnittliche Conversion-Rate: ${avgConversionRate.toFixed(1)}%`,
      `Beliebteste Geräte: ${Object.entries(deviceBreakdown).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unbekannt'}`,
      `Häufigster Intent: ${topIntents[0]?.intent || 'Unbekannt'}`,
      totalSessions > 1000 ? 'Hohe Nutzeraktivität' : 'Moderate Nutzeraktivität'
    ];

    return {
      totalSessions,
      totalUsers,
      totalConversions,
      avgConversionRate: Math.round(avgConversionRate * 10) / 10,
      topIntents,
      deviceBreakdown,
      locationPerformance: locationPerfArray,
      behaviorInsights
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localUserBehaviorTrackingService = new LocalUserBehaviorTrackingService();