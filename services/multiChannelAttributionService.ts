import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { crmLeadTrackingIntegrationService } from './crmLeadTrackingIntegrationService';
import { marketingAutomationIntegrationService } from './marketingAutomationIntegrationService';
import { localUserBehaviorTrackingService } from './localUserBehaviorTrackingService';

export interface AttributionTouchpoint {
  id: string;
  timestamp: string;
  channel: 'organic_search' | 'paid_search' | 'social' | 'email' | 'direct' | 'referral' | 'gmb' | 'local_pack' | 'display' | 'video';
  source: string; // z.B. 'google', 'facebook', 'email_campaign_001'
  campaign?: string;
  adGroup?: string;
  keyword?: string;
  landingPage: string;
  userId?: string;
  sessionId: string;
  device: 'desktop' | 'mobile' | 'tablet';
  location: {
    city: string;
    region: string;
    country: string;
    coordinates?: [number, number];
  };
  behavior: {
    timeOnPage: number;
    scrollDepth: number;
    interactions: string[]; // ['click_cta', 'form_start', 'download_brochure']
    engagementScore: number; // 0-100
  };
  value: {
    potential: number; // Geschätzter Wert des Touchpoints
    actual: number; // Tatsächlicher zugewiesener Wert
    currency: string;
  };
  localContext: {
    proximityToLocation: number; // km
    localIntent: boolean;
    competitorMentioned: boolean;
    seasonalFactor: number; // 0-1
  };
}

export interface CustomerJourney {
  id: string;
  userId: string;
  leadId?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'converted' | 'lost' | 'abandoned';
  touchpoints: AttributionTouchpoint[];
  conversion?: {
    type: 'lead' | 'sale' | 'appointment' | 'quote' | 'phone_call';
    value: number;
    currency: string;
    timestamp: string;
    channel: string; // Kanal der finalen Conversion
  };
  attribution: {
    model: string;
    weights: { [touchpointId: string]: number };
    totalValue: number;
    channelBreakdown: { [channel: string]: number };
  };
  journeyMetrics: {
    totalSessions: number;
    totalTime: number;
    channelsUsed: number;
    locationsVisited: number;
    devicesUsed: string[];
    peakEngagementTime: string;
  };
  insights: {
    primaryChannel: string;
    secondaryChannels: string[];
    journeyComplexity: 'simple' | 'moderate' | 'complex';
    conversionVelocity: number; // Tage bis Conversion
    localInfluence: number; // 0-1, wie stark lokale Faktoren gewirkt haben
  };
}

export interface AttributionModel {
  id: string;
  name: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven' | 'custom';
  description: string;
  config: {
    decayFactor?: number; // Für time_decay
    positionWeights?: { [position: string]: number }; // Für position_based
    customLogic?: string; // Für custom Modelle
    lookbackWindow: number; // Tage
    ignoreDirect?: boolean;
    localBias?: number; // Zusätzliches Gewicht für lokale Touchpoints
  };
  performance: {
    accuracy: number; // 0-1
    coverage: number; // Anteil der Journeys die modelliert werden können
    avgAttribution: number;
    channelDistribution: { [channel: string]: number };
    validationScore: number;
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  lastUsed: string;
}

export interface AttributionAnalysis {
  locationKey: string;
  timeRange: {
    start: string;
    end: string;
  };
  overview: {
    totalJourneys: number;
    convertedJourneys: number;
    conversionRate: number;
    avgJourneyLength: number; // Tage
    totalAttributionValue: number;
    avgOrderValue: number;
  };
  channelPerformance: Array<{
    channel: string;
    touchpoints: number;
    conversions: number;
    conversionRate: number;
    attributedValue: number;
    attributedRevenue: number;
    roi: number;
    avgPosition: number; // Durchschnittliche Position in Journey
  }>;
  journeyPatterns: {
    simpleJourneys: number; // 1 Touchpoint
    moderateJourneys: number; // 2-3 Touchpoints
    complexJourneys: number; // 4+ Touchpoints
    avgTouchpointsPerJourney: number;
    mostCommonPaths: Array<{
      path: string[]; // Array von Channels
      frequency: number;
      conversionRate: number;
      avgValue: number;
    }>;
  };
  localInsights: {
    localFirstTouchRate: number;
    localConversionRate: number;
    proximityCorrelation: number; // Korrelation zwischen Nähe und Conversion
    seasonalLocalImpact: { [month: string]: number };
    competitorLocalInfluence: number;
  };
  attributionComparison: {
    modelComparison: Array<{
      model: string;
      accuracy: number;
      coverage: number;
      channelDistribution: { [channel: string]: number };
    }>;
    recommendedModel: string;
    confidence: number;
  };
  recommendations: Array<{
    type: 'budget' | 'channel' | 'timing' | 'content';
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expectedImpact: number;
    rationale: string;
  }>;
}

export interface CrossChannelCampaignAttribution {
  campaignId: string;
  campaignName: string;
  channels: string[];
  timeRange: {
    start: string;
    end: string;
  };
  performance: {
    totalTouchpoints: number;
    totalConversions: number;
    totalRevenue: number;
    channelContribution: { [channel: string]: {
      touchpoints: number;
      conversions: number;
      revenue: number;
      percentage: number;
    }};
    synergyEffect: number; // Zusätzlicher Wert durch Channel-Kombination
    cannibalizationRate: number; // Wie viel Umsatz von anderen Channels genommen wurde
  };
  journeyAnalysis: {
    assistedConversions: number;
    lastTouchConversions: number;
    firstTouchConversions: number;
    multiChannelJourneys: number;
    channelSequences: Array<{
      sequence: string[];
      conversions: number;
      avgValue: number;
    }>;
  };
  optimization: {
    recommendedBudgetShift: { [channel: string]: number };
    channelPriorities: string[];
    timingOptimization: { [channel: string]: string[] };
    contentRecommendations: string[];
  };
}

export interface LocalAttributionIntelligence {
  locationKey: string;
  predictiveAttribution: {
    channelPredictors: Array<{
      channel: string;
      conversionProbability: number;
      avgValue: number;
      confidence: number;
    }>;
    journeyPredictors: {
      optimalLength: number;
      bestChannelSequence: string[];
      peakConversionTimes: string[];
      seasonalPatterns: { [season: string]: number };
    };
    valuePredictors: {
      highValueJourneys: {
        characteristics: string[];
        avgValue: number;
        frequency: number;
      };
      lowValueJourneys: {
        characteristics: string[];
        avgValue: number;
        frequency: number;
      };
    };
  };
  competitorAttribution: {
    marketShare: { [competitor: string]: number };
    attributionComparison: { [competitor: string]: {
      channels: string[];
      avgJourneyLength: number;
      conversionRate: number;
    }};
    opportunities: Array<{
      channel: string;
      potential: number;
      strategy: string;
    }>;
  };
  optimizationOpportunities: Array<{
    opportunity: string;
    type: 'channel_addition' | 'channel_optimization' | 'timing' | 'budget_reallocation';
    potentialImpact: number;
    implementationEffort: string;
    recommendedActions: string[];
  }>;
  lastUpdated: string;
}

/**
 * Multi-Channel Local Attribution Service
 * Attribution von Conversions über mehrere lokale Kanäle
 */
export class MultiChannelAttributionService {
  private touchpoints: Map<string, AttributionTouchpoint[]> = new Map();
  private customerJourneys: Map<string, CustomerJourney[]> = new Map();
  private attributionModels: AttributionModel[] = [];
  private attributionAnalyses: Map<string, AttributionAnalysis> = new Map();
  private localAttributionIntelligence: Map<string, LocalAttributionIntelligence> = new Map();

  constructor() {
    this.initializeDefaultAttributionModels();
    this.generateSampleData();
    this.createAttributionIntelligence();
  }

  /**
   * Initialisiert Standard-Attributionsmodelle
   */
  private initializeDefaultAttributionModels(): void {
    this.attributionModels = [
      {
        id: 'first_touch',
        name: 'First Touch',
        type: 'first_touch',
        description: 'Gibt 100% des Werts dem ersten Touchpoint',
        config: {
          lookbackWindow: 90,
          ignoreDirect: false,
          localBias: 1.2
        },
        performance: {
          accuracy: 0.65,
          coverage: 0.95,
          avgAttribution: 1.0,
          channelDistribution: {
            organic_search: 0.35,
            paid_search: 0.25,
            social: 0.20,
            email: 0.15,
            gmb: 0.05
          },
          validationScore: 0.72
        },
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'last_touch',
        name: 'Last Touch',
        type: 'last_touch',
        description: 'Gibt 100% des Werts dem letzten Touchpoint',
        config: {
          lookbackWindow: 30,
          ignoreDirect: false,
          localBias: 1.1
        },
        performance: {
          accuracy: 0.78,
          coverage: 0.98,
          avgAttribution: 1.0,
          channelDistribution: {
            organic_search: 0.40,
            paid_search: 0.30,
            social: 0.15,
            email: 0.10,
            gmb: 0.05
          },
          validationScore: 0.85
        },
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'linear',
        name: 'Linear',
        type: 'linear',
        description: 'Verteilt den Wert gleichmäßig auf alle Touchpoints',
        config: {
          lookbackWindow: 60,
          ignoreDirect: false,
          localBias: 1.0
        },
        performance: {
          accuracy: 0.70,
          coverage: 0.90,
          avgAttribution: 1.0,
          channelDistribution: {
            organic_search: 0.30,
            paid_search: 0.25,
            social: 0.20,
            email: 0.15,
            gmb: 0.10
          },
          validationScore: 0.75
        },
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'time_decay',
        name: 'Time Decay',
        type: 'time_decay',
        description: 'Gewichtet neuere Touchpoints stärker',
        config: {
          decayFactor: 0.8,
          lookbackWindow: 45,
          ignoreDirect: false,
          localBias: 1.3
        },
        performance: {
          accuracy: 0.82,
          coverage: 0.88,
          avgAttribution: 1.0,
          channelDistribution: {
            organic_search: 0.35,
            paid_search: 0.28,
            social: 0.18,
            email: 0.12,
            gmb: 0.07
          },
          validationScore: 0.88
        },
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      },
      {
        id: 'local_focused',
        name: 'Local Focused',
        type: 'custom',
        description: 'Optimiert für lokale Suchen mit erhöhtem Gewicht für lokale Kanäle',
        config: {
          customLogic: 'local_channels * 1.5 + other_channels',
          lookbackWindow: 30,
          ignoreDirect: false,
          localBias: 2.0
        },
        performance: {
          accuracy: 0.85,
          coverage: 0.92,
          avgAttribution: 1.0,
          channelDistribution: {
            gmb: 0.25,
            local_pack: 0.20,
            organic_search: 0.25,
            paid_search: 0.15,
            social: 0.10,
            email: 0.05
          },
          validationScore: 0.90
        },
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      }
    ];
  }

  /**
   * Generiert Beispieldaten
   */
  private generateSampleData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const touchpoints: AttributionTouchpoint[] = [];
      const journeys: CustomerJourney[] = [];

      // Simuliere Touchpoints für jeden Standort
      for (let i = 0; i < 200; i++) {
        const channels: AttributionTouchpoint['channel'][] = [
          'organic_search', 'paid_search', 'social', 'email', 'gmb', 'local_pack'
        ];
        const channel = channels[Math.floor(Math.random() * channels.length)];

        const touchpoint: AttributionTouchpoint = {
          id: `touch_${locationKey}_${i}`,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
          channel,
          source: channel === 'organic_search' ? 'google' :
                  channel === 'paid_search' ? 'google_ads' :
                  channel === 'social' ? 'facebook' :
                  channel === 'email' ? 'newsletter' :
                  channel === 'gmb' ? 'google_my_business' : 'google_local_pack',
          campaign: Math.random() > 0.7 ? `campaign_${locationKey}_${Math.floor(Math.random() * 5)}` : undefined,
          keyword: channel.includes('search') ? `solaranlage ${region.city}` : undefined,
          landingPage: Math.random() > 0.5 ? `/solaranlagen-${locationKey}` : '/kontakt',
          sessionId: `session_${i}`,
          device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)] as any,
          location: {
            city: region.city,
            region: region.state,
            country: 'Deutschland'
          },
          behavior: {
            timeOnPage: 60 + Math.floor(Math.random() * 300),
            scrollDepth: 0.4 + Math.random() * 0.6,
            interactions: Math.random() > 0.6 ? ['click_cta'] : Math.random() > 0.3 ? ['form_start'] : [],
            engagementScore: 20 + Math.floor(Math.random() * 80)
          },
          value: {
            potential: 50 + Math.floor(Math.random() * 200),
            actual: 0, // Wird bei Attribution berechnet
            currency: 'EUR'
          },
          localContext: {
            proximityToLocation: Math.floor(Math.random() * 50),
            localIntent: Math.random() > 0.4,
            competitorMentioned: Math.random() > 0.8,
            seasonalFactor: 0.5 + Math.random() * 0.5
          }
        };

        touchpoints.push(touchpoint);
      }

      this.touchpoints.set(locationKey, touchpoints);

      // Erstelle Customer Journeys
      this.createCustomerJourneys(locationKey, touchpoints);
    });
  }

  /**
   * Erstellt Customer Journeys aus Touchpoints
   */
  private createCustomerJourneys(locationKey: string, touchpoints: AttributionTouchpoint[]): void {
    const journeys: CustomerJourney[] = [];
    const sessions = new Map<string, AttributionTouchpoint[]>();

    // Gruppiere Touchpoints nach Session
    touchpoints.forEach(tp => {
      if (!sessions.has(tp.sessionId)) {
        sessions.set(tp.sessionId, []);
      }
      sessions.get(tp.sessionId)!.push(tp);
    });

    // Erstelle Journeys aus Sessions
    let journeyIndex = 0;
    sessions.forEach((sessionTouchpoints, sessionId) => {
      // Simuliere Conversion für einige Sessions
      const hasConversion = Math.random() > 0.7;
      const conversionValue = hasConversion ? 5000 + Math.floor(Math.random() * 20000) : 0;

      const journey: CustomerJourney = {
        id: `journey_${locationKey}_${journeyIndex++}`,
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        startDate: sessionTouchpoints[0].timestamp,
        endDate: hasConversion ? sessionTouchpoints[sessionTouchpoints.length - 1].timestamp : undefined,
        status: hasConversion ? 'converted' : 'active',
        touchpoints: sessionTouchpoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
        conversion: hasConversion ? {
          type: 'lead',
          value: conversionValue,
          currency: 'EUR',
          timestamp: sessionTouchpoints[sessionTouchpoints.length - 1].timestamp,
          channel: sessionTouchpoints[sessionTouchpoints.length - 1].channel
        } : undefined,
        attribution: {
          model: 'last_touch',
          weights: {},
          totalValue: conversionValue,
          channelBreakdown: {}
        },
        journeyMetrics: {
          totalSessions: 1,
          totalTime: sessionTouchpoints.reduce((sum, tp) => sum + tp.behavior.timeOnPage, 0),
          channelsUsed: new Set(sessionTouchpoints.map(tp => tp.channel)).size,
          locationsVisited: 1,
          devicesUsed: Array.from(new Set(sessionTouchpoints.map(tp => tp.device))),
          peakEngagementTime: '14:00'
        },
        insights: {
          primaryChannel: sessionTouchpoints[0].channel,
          secondaryChannels: Array.from(new Set(sessionTouchpoints.slice(1).map(tp => tp.channel))),
          journeyComplexity: sessionTouchpoints.length > 3 ? 'complex' : sessionTouchpoints.length > 1 ? 'moderate' : 'simple',
          conversionVelocity: hasConversion ? Math.floor(Math.random() * 30) : 0,
          localInfluence: sessionTouchpoints.some(tp => tp.localContext.localIntent) ? 0.8 : 0.3
        }
      };

      // Berechne Attribution
      this.calculateJourneyAttribution(journey);

      journeys.push(journey);
    });

    this.customerJourneys.set(locationKey, journeys);
  }

  /**
   * Berechnet Journey Attribution
   */
  private calculateJourneyAttribution(journey: CustomerJourney): void {
    if (!journey.conversion) return;

    const model = this.attributionModels.find(m => m.isDefault) || this.attributionModels[0];
    const weights: { [touchpointId: string]: number } = {};
    const channelBreakdown: { [channel: string]: number } = {};

    journey.touchpoints.forEach((tp, index) => {
      let weight = 0;

      switch (model.type) {
        case 'first_touch':
          weight = index === 0 ? 1 : 0;
          break;
        case 'last_touch':
          weight = index === journey.touchpoints.length - 1 ? 1 : 0;
          break;
        case 'linear':
          weight = 1 / journey.touchpoints.length;
          break;
        case 'time_decay':
          const daysSince = (new Date(journey.conversion!.timestamp).getTime() - new Date(tp.timestamp).getTime()) / (1000 * 60 * 60 * 24);
          weight = Math.pow(model.config.decayFactor || 0.8, daysSince);
          break;
        case 'local_focused':
          const isLocal = tp.channel === 'gmb' || tp.channel === 'local_pack' || tp.localContext.localIntent;
          weight = isLocal ? 1.5 / journey.touchpoints.length : 1 / journey.touchpoints.length;
          break;
      }

      // Lokaler Bias anwenden
      if (tp.localContext.localIntent && model.config.localBias) {
        weight *= model.config.localBias;
      }

      weights[tp.id] = weight;
      tp.value.actual = weight * journey.conversion!.value;

      // Channel Breakdown
      if (!channelBreakdown[tp.channel]) {
        channelBreakdown[tp.channel] = 0;
      }
      channelBreakdown[tp.channel] += weight;
    });

    journey.attribution = {
      model: model.id,
      weights,
      totalValue: journey.conversion.value,
      channelBreakdown
    };
  }

  /**
   * Erstellt Attribution Intelligence
   */
  private createAttributionIntelligence(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      const intelligence: LocalAttributionIntelligence = {
        locationKey,
        predictiveAttribution: {
          channelPredictors: [
            {
              channel: 'gmb',
              conversionProbability: 0.85,
              avgValue: 8500,
              confidence: 0.92
            },
            {
              channel: 'organic_search',
              conversionProbability: 0.72,
              avgValue: 6200,
              confidence: 0.88
            },
            {
              channel: 'paid_search',
              conversionProbability: 0.68,
              avgValue: 5800,
              confidence: 0.85
            },
            {
              channel: 'email',
              conversionProbability: 0.55,
              avgValue: 4200,
              confidence: 0.78
            }
          ],
          journeyPredictors: {
            optimalLength: 3.2,
            bestChannelSequence: ['organic_search', 'email', 'gmb'],
            peakConversionTimes: ['10:00-12:00', '14:00-16:00', '19:00-21:00'],
            seasonalPatterns: {
              spring: 1.2,
              summer: 1.4,
              autumn: 0.9,
              winter: 0.7
            }
          },
          valuePredictors: {
            highValueJourneys: {
              characteristics: ['local_intent', 'multiple_touchpoints', 'high_engagement'],
              avgValue: 12500,
              frequency: 0.15
            },
            lowValueJourneys: {
              characteristics: ['single_touchpoint', 'low_engagement', 'no_local_intent'],
              avgValue: 2100,
              frequency: 0.45
            }
          }
        },
        competitorAttribution: {
          marketShare: {
            'SolarTech GmbH': 0.25,
            'GreenEnergy Berlin': 0.18,
            'SunPower Solutions': 0.12
          },
          attributionComparison: {
            'SolarTech GmbH': {
              channels: ['gmb', 'organic_search', 'paid_search'],
              avgJourneyLength: 2.8,
              conversionRate: 0.082
            },
            'GreenEnergy Berlin': {
              channels: ['organic_search', 'social', 'email'],
              avgJourneyLength: 3.1,
              conversionRate: 0.065
            }
          },
          opportunities: [
            {
              channel: 'gmb',
              potential: 0.35,
              strategy: 'Erhöhe GMB-Präsenz und Bewertungen'
            },
            {
              channel: 'local_pack',
              potential: 0.28,
              strategy: 'Optimiere Local Pack Sichtbarkeit'
            }
          ]
        },
        optimizationOpportunities: [
          {
            opportunity: 'GMB-Optimierung',
            type: 'channel_optimization',
            potentialImpact: 0.40,
            implementationEffort: 'medium',
            recommendedActions: [
              'GMB-Profile vollständig ausfüllen',
              'Regelmäßige Beiträge posten',
              'Bewertungen aktiv einholen',
              'Öffnungszeiten aktualisieren'
            ]
          },
          {
            opportunity: 'Multi-Channel Journeys',
            type: 'channel_addition',
            potentialImpact: 0.25,
            implementationEffort: 'high',
            recommendedActions: [
              'Email-Nurturing implementieren',
              'Retargeting-Kampagnen aufbauen',
              'Cross-Channel Attribution verbessern'
            ]
          },
          {
            opportunity: 'Lokale Suchoptimierung',
            type: 'budget_reallocation',
            potentialImpact: 0.30,
            implementationEffort: 'medium',
            recommendedActions: [
              'Budget von generischen zu lokalen Keywords verschieben',
              'Local Pack Optimierung priorisieren',
              'Standort-spezifische Landing Pages erstellen'
            ]
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      this.localAttributionIntelligence.set(locationKey, intelligence);
    });
  }

  /**
   * Führt Attribution-Analyse durch
   */
  public performAttributionAnalysis(
    locationKey: string,
    timeRange: { start: string; end: string },
    modelId?: string
  ): AttributionAnalysis {
    const journeys = this.customerJourneys.get(locationKey) || [];
    const model = modelId ? this.attributionModels.find(m => m.id === modelId) : this.attributionModels.find(m => m.isDefault);

    if (!model) throw new Error('Attribution model not found');

    // Filtere Journeys nach Zeitraum
    const filteredJourneys = journeys.filter(j =>
      new Date(j.startDate) >= new Date(timeRange.start) &&
      (!j.endDate || new Date(j.endDate) <= new Date(timeRange.end))
    );

    const convertedJourneys = filteredJourneys.filter(j => j.status === 'converted');
    const totalAttributionValue = convertedJourneys.reduce((sum, j) => sum + (j.attribution?.totalValue || 0), 0);

    // Channel Performance berechnen
    const channelPerformance = this.calculateChannelPerformance(filteredJourneys);

    // Journey Patterns analysieren
    const journeyPatterns = this.analyzeJourneyPatterns(filteredJourneys);

    // Lokale Insights
    const localInsights = this.calculateLocalInsights(filteredJourneys);

    // Attribution Model Vergleich
    const attributionComparison = this.compareAttributionModels(filteredJourneys);

    const analysis: AttributionAnalysis = {
      locationKey,
      timeRange,
      overview: {
        totalJourneys: filteredJourneys.length,
        convertedJourneys: convertedJourneys.length,
        conversionRate: filteredJourneys.length > 0 ? convertedJourneys.length / filteredJourneys.length : 0,
        avgJourneyLength: filteredJourneys.reduce((sum, j) => sum + j.journeyMetrics.totalSessions, 0) / filteredJourneys.length,
        totalAttributionValue,
        avgOrderValue: convertedJourneys.length > 0 ? totalAttributionValue / convertedJourneys.length : 0
      },
      channelPerformance,
      journeyPatterns,
      localInsights,
      attributionComparison,
      recommendations: this.generateAttributionRecommendations(channelPerformance, journeyPatterns, localInsights)
    };

    this.attributionAnalyses.set(locationKey, analysis);
    return analysis;
  }

  /**
   * Berechnet Channel Performance
   */
  private calculateChannelPerformance(journeys: CustomerJourney[]): AttributionAnalysis['channelPerformance'] {
    const channelStats = new Map<string, {
      touchpoints: number;
      conversions: number;
      attributedValue: number;
      attributedRevenue: number;
      positions: number[];
    }>();

    journeys.forEach(journey => {
      if (!journey.conversion) return;

      journey.touchpoints.forEach((tp, index) => {
        if (!channelStats.has(tp.channel)) {
          channelStats.set(tp.channel, {
            touchpoints: 0,
            conversions: 0,
            attributedValue: 0,
            attributedRevenue: 0,
            positions: []
          });
        }

        const stats = channelStats.get(tp.channel)!;
        stats.touchpoints++;
        stats.attributedValue += tp.value.actual;
        stats.attributedRevenue += tp.value.actual;
        stats.positions.push(index + 1);

        // Conversion zählen (nur einmal pro Journey)
        if (index === journey.touchpoints.length - 1) {
          stats.conversions++;
        }
      });
    });

    return Array.from(channelStats.entries()).map(([channel, stats]) => ({
      channel,
      touchpoints: stats.touchpoints,
      conversions: stats.conversions,
      conversionRate: stats.touchpoints > 0 ? stats.conversions / stats.touchpoints : 0,
      attributedValue: stats.attributedValue,
      attributedRevenue: stats.attributedRevenue,
      roi: stats.attributedValue > 0 ? stats.attributedRevenue / stats.attributedValue : 0,
      avgPosition: stats.positions.reduce((sum, pos) => sum + pos, 0) / stats.positions.length
    }));
  }

  /**
   * Analysiert Journey Patterns
   */
  private analyzeJourneyPatterns(journeys: CustomerJourney[]): AttributionAnalysis['journeyPatterns'] {
    const simpleJourneys = journeys.filter(j => j.touchpoints.length === 1).length;
    const moderateJourneys = journeys.filter(j => j.touchpoints.length >= 2 && j.touchpoints.length <= 3).length;
    const complexJourneys = journeys.filter(j => j.touchpoints.length >= 4).length;

    const avgTouchpoints = journeys.reduce((sum, j) => sum + j.touchpoints.length, 0) / journeys.length;

    // Häufigste Pfade finden
    const pathCounts = new Map<string, { conversions: number; values: number[] }>();
    journeys.forEach(journey => {
      const path = journey.touchpoints.map(tp => tp.channel).join(' -> ');
      if (!pathCounts.has(path)) {
        pathCounts.set(path, { conversions: 0, values: [] });
      }
      const pathData = pathCounts.get(path)!;
      if (journey.conversion) {
        pathData.conversions++;
        pathData.values.push(journey.conversion.value);
      }
    });

    const mostCommonPaths = Array.from(pathCounts.entries())
      .sort((a, b) => b[1].conversions - a[1].conversions)
      .slice(0, 5)
      .map(([path, data]) => ({
        path: path.split(' -> '),
        frequency: data.conversions,
        conversionRate: journeys.filter(j => j.touchpoints.map(tp => tp.channel).join(' -> ') === path && j.conversion).length /
                       journeys.filter(j => j.touchpoints.map(tp => tp.channel).join(' -> ') === path).length,
        avgValue: data.values.reduce((sum, val) => sum + val, 0) / data.values.length
      }));

    return {
      simpleJourneys,
      moderateJourneys,
      complexJourneys,
      avgTouchpointsPerJourney: avgTouchpoints,
      mostCommonPaths
    };
  }

  /**
   * Berechnet lokale Insights
   */
  private calculateLocalInsights(journeys: CustomerJourney[]): AttributionAnalysis['localInsights'] {
    const localFirstTouch = journeys.filter(j =>
      j.touchpoints.length > 0 &&
      (j.touchpoints[0].channel === 'gmb' || j.touchpoints[0].channel === 'local_pack' || j.touchpoints[0].localContext.localIntent)
    ).length;

    const localConversions = journeys.filter(j =>
      j.conversion &&
      j.touchpoints.some(tp => tp.localContext.localIntent)
    ).length;

    const localFirstTouchRate = journeys.length > 0 ? localFirstTouch / journeys.length : 0;
    const localConversionRate = journeys.length > 0 ? localConversions / journeys.length : 0;

    // Proximity Correlation (vereinfacht)
    const proximityCorrelation = 0.65;

    // Seasonal Impact
    const seasonalLocalImpact: { [month: string]: number } = {};
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni'];
    months.forEach(month => {
      seasonalLocalImpact[month] = 0.5 + Math.random() * 0.5;
    });

    return {
      localFirstTouchRate,
      localConversionRate,
      proximityCorrelation,
      seasonalLocalImpact,
      competitorLocalInfluence: 0.15
    };
  }

  /**
   * Vergleicht Attributionsmodelle
   */
  private compareAttributionModels(journeys: CustomerJourney[]): AttributionAnalysis['attributionComparison'] {
    const modelComparison = this.attributionModels.map(model => {
      // Simuliere Modell-Performance
      const channelDistribution: { [channel: string]: number } = {};
      journeys.forEach(journey => {
        if (journey.attribution?.channelBreakdown) {
          Object.entries(journey.attribution.channelBreakdown).forEach(([channel, weight]) => {
            channelDistribution[channel] = (channelDistribution[channel] || 0) + weight;
          });
        }
      });

      // Normalisiere Distribution
      const total = Object.values(channelDistribution).reduce((sum, val) => sum + val, 0);
      Object.keys(channelDistribution).forEach(channel => {
        channelDistribution[channel] /= total;
      });

      return {
        model: model.name,
        accuracy: model.performance.accuracy,
        coverage: model.performance.coverage,
        channelDistribution
      };
    });

    return {
      modelComparison,
      recommendedModel: 'Local Focused',
      confidence: 0.88
    };
  }

  /**
   * Generiert Attribution-Empfehlungen
   */
  private generateAttributionRecommendations(
    channelPerformance: AttributionAnalysis['channelPerformance'],
    journeyPatterns: AttributionAnalysis['journeyPatterns'],
    localInsights: AttributionAnalysis['localInsights']
  ): AttributionAnalysis['recommendations'] {
    const recommendations: AttributionAnalysis['recommendations'] = [];

    // Budget-Empfehlungen
    const topChannel = channelPerformance.sort((a, b) => b.attributedRevenue - a.attributedRevenue)[0];
    if (topChannel) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        recommendation: `Erhöhe Budget für ${topChannel.channel} um 30%`,
        expectedImpact: 0.25,
        rationale: `${topChannel.channel} trägt ${((topChannel.attributedRevenue / channelPerformance.reduce((sum, c) => sum + c.attributedRevenue, 0)) * 100).toFixed(1)}% zum Umsatz bei`
      });
    }

    // Lokale Optimierungen
    if (localInsights.localFirstTouchRate < 0.3) {
      recommendations.push({
        type: 'channel',
        priority: 'high',
        recommendation: 'Stärke lokale Kanäle (GMB, Local Pack)',
        expectedImpact: 0.35,
        rationale: `Nur ${((localInsights.localFirstTouchRate) * 100).toFixed(1)}% der Journeys starten lokal`
      });
    }

    // Journey-Komplexität
    if (journeyPatterns.complexJourneys < journeyPatterns.simpleJourneys) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        recommendation: 'Entwickle Nurturing-Sequenzen für Multi-Touchpoint Journeys',
        expectedImpact: 0.20,
        rationale: 'Viele Conversions erfolgen über einfache Journeys'
      });
    }

    return recommendations;
  }

  /**
   * Führt Cross-Channel Campaign Attribution durch
   */
  public analyzeCrossChannelCampaignAttribution(
    campaignId: string,
    locationKey: string,
    timeRange: { start: string; end: string }
  ): CrossChannelCampaignAttribution {
    const campaign = marketingAutomationIntegrationService.getMarketingCampaigns(locationKey)
      .find(c => c.id === campaignId);

    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    const journeys = this.customerJourneys.get(locationKey) || [];
    const campaignJourneys = journeys.filter(j =>
      j.touchpoints.some(tp => tp.campaign === campaignId) &&
      new Date(j.startDate) >= new Date(timeRange.start) &&
      (!j.endDate || new Date(j.endDate) <= new Date(timeRange.end))
    );

    // Berechne Performance
    const channelContribution: { [channel: string]: any } = {};
    campaign.channels.forEach(channel => {
      channelContribution[channel.platform] = {
        touchpoints: 0,
        conversions: 0,
        revenue: 0,
        percentage: 0
      };
    });

    campaignJourneys.forEach(journey => {
      journey.touchpoints.forEach(tp => {
        if (channelContribution[tp.channel]) {
          channelContribution[tp.channel].touchpoints++;
          channelContribution[tp.channel].revenue += tp.value.actual;
          if (journey.conversion) {
            channelContribution[tp.channel].conversions++;
          }
        }
      });
    });

    // Prozente berechnen
    const totalRevenue = Object.values(channelContribution).reduce((sum, ch: any) => sum + ch.revenue, 0);
    Object.keys(channelContribution).forEach(channel => {
      channelContribution[channel].percentage = totalRevenue > 0 ? channelContribution[channel].revenue / totalRevenue : 0;
    });

    // Journey Analyse
    const assistedConversions = campaignJourneys.filter(j =>
      j.conversion && j.touchpoints.some(tp => tp.campaign === campaignId) &&
      j.touchpoints.findIndex(tp => tp.campaign === campaignId) < j.touchpoints.length - 1
    ).length;

    const lastTouchConversions = campaignJourneys.filter(j =>
      j.conversion && j.touchpoints[j.touchpoints.length - 1].campaign === campaignId
    ).length;

    const firstTouchConversions = campaignJourneys.filter(j =>
      j.conversion && j.touchpoints[0].campaign === campaignId
    ).length;

    const multiChannelJourneys = campaignJourneys.filter(j => j.touchpoints.length > 1).length;

    // Channel Sequences
    const sequenceCounts = new Map<string, { conversions: number; values: number[] }>();
    campaignJourneys.forEach(journey => {
      const sequence = journey.touchpoints.map(tp => tp.channel);
      const sequenceKey = sequence.join(' -> ');
      if (!sequenceCounts.has(sequenceKey)) {
        sequenceCounts.set(sequenceKey, { conversions: 0, values: [] });
      }
      const seqData = sequenceCounts.get(sequenceKey)!;
      if (journey.conversion) {
        seqData.conversions++;
        seqData.values.push(journey.conversion.value);
      }
    });

    const channelSequences = Array.from(sequenceCounts.entries())
      .sort((a, b) => b[1].conversions - a[1].conversions)
      .slice(0, 5)
      .map(([sequence, data]) => ({
        sequence: sequence.split(' -> '),
        conversions: data.conversions,
        avgValue: data.values.reduce((sum, val) => sum + val, 0) / data.values.length
      }));

    return {
      campaignId,
      campaignName: campaign.name,
      channels: campaign.channels.map(ch => ch.platform),
      timeRange,
      performance: {
        totalTouchpoints: campaignJourneys.reduce((sum, j) => sum + j.touchpoints.length, 0),
        totalConversions: campaignJourneys.filter(j => j.conversion).length,
        totalRevenue: campaignJourneys.reduce((sum, j) => sum + (j.conversion?.value || 0), 0),
        channelContribution,
        synergyEffect: 1.15, // Simuliert positiven Synergie-Effekt
        cannibalizationRate: 0.08
      },
      journeyAnalysis: {
        assistedConversions,
        lastTouchConversions,
        firstTouchConversions,
        multiChannelJourneys,
        channelSequences
      },
      optimization: {
        recommendedBudgetShift: {
          'gmb': 0.15,
          'organic_search': 0.10,
          'paid_search': -0.05,
          'email': 0.08
        },
        channelPriorities: ['gmb', 'organic_search', 'email', 'paid_search'],
        timingOptimization: {
          'gmb': ['9:00-11:00', '14:00-16:00'],
          'email': ['10:00', '15:00'],
          'social': ['12:00', '18:00']
        },
        contentRecommendations: [
          'Lokale Keywords stärker betonen',
          'Call-to-Actions für lokale Services',
          'Testimonials von lokalen Kunden',
          'Saisonale lokale Angebote'
        ]
      }
    };
  }

  /**
   * Ruft Touchpoints ab
   */
  public getTouchpoints(locationKey: string, filters?: {
    channel?: string;
    dateRange?: { start: string; end: string };
    userId?: string;
  }): AttributionTouchpoint[] {
    let touchpoints = this.touchpoints.get(locationKey) || [];

    if (filters) {
      touchpoints = touchpoints.filter(tp => {
        if (filters.channel && tp.channel !== filters.channel) return false;
        if (filters.userId && tp.sessionId !== filters.userId) return false;
        if (filters.dateRange) {
          const tpDate = new Date(tp.timestamp);
          if (tpDate < new Date(filters.dateRange.start) || tpDate > new Date(filters.dateRange.end)) return false;
        }
        return true;
      });
    }

    return touchpoints;
  }

  /**
   * Ruft Customer Journeys ab
   */
  public getCustomerJourneys(locationKey: string, filters?: {
    status?: string;
    hasConversion?: boolean;
    dateRange?: { start: string; end: string };
  }): CustomerJourney[] {
    let journeys = this.customerJourneys.get(locationKey) || [];

    if (filters) {
      journeys = journeys.filter(journey => {
        if (filters.status && journey.status !== filters.status) return false;
        if (filters.hasConversion !== undefined && (journey.conversion !== undefined) !== filters.hasConversion) return false;
        if (filters.dateRange) {
          const journeyDate = new Date(journey.startDate);
          if (journeyDate < new Date(filters.dateRange.start) || journeyDate > new Date(filters.dateRange.end)) return false;
        }
        return true;
      });
    }

    return journeys;
  }

  /**
   * Ruft Attributionsmodelle ab
   */
  public getAttributionModels(): AttributionModel[] {
    return this.attributionModels;
  }

  /**
   * Ruft Attribution-Analyse ab
   */
  public getAttributionAnalysis(locationKey: string): AttributionAnalysis | null {
    return this.attributionAnalyses.get(locationKey) || null;
  }

  /**
   * Ruft Local Attribution Intelligence ab
   */
  public getLocalAttributionIntelligence(locationKey: string): LocalAttributionIntelligence | null {
    return this.localAttributionIntelligence.get(locationKey) || null;
  }

  /**
   * Erstellt benutzerdefiniertes Attributionsmodell
   */
  public createCustomAttributionModel(
    name: string,
    type: AttributionModel['type'],
    config: Partial<AttributionModel['config']>
  ): AttributionModel {
    const model: AttributionModel = {
      id: `model_${Date.now()}`,
      name,
      type,
      description: `Custom ${type} attribution model`,
      config: {
        lookbackWindow: config.lookbackWindow || 30,
        ignoreDirect: config.ignoreDirect || false,
        localBias: config.localBias || 1.0,
        ...config
      },
      performance: {
        accuracy: 0.7,
        coverage: 0.85,
        avgAttribution: 1.0,
        channelDistribution: {},
        validationScore: 0.75
      },
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    this.attributionModels.push(model);
    return model;
  }

  /**
   * Dashboard-Übersicht für alle Standorte
   */
  public getGlobalAttributionDashboard(): {
    totalJourneys: number;
    totalConversions: number;
    totalAttributionValue: number;
    avgConversionRate: number;
    topChannels: Array<{
      channel: string;
      touchpoints: number;
      conversions: number;
      attributedValue: number;
    }>;
    modelPerformance: Array<{
      model: string;
      accuracy: number;
      coverage: number;
      usage: number;
    }>;
    localVsGlobal: {
      localConversionRate: number;
      globalConversionRate: number;
      localAttributionShare: number;
    };
    recommendations: string[];
  } {
    const allJourneys = Array.from(this.customerJourneys.values()).flat();
    const allTouchpoints = Array.from(this.touchpoints.values()).flat();

    const totalJourneys = allJourneys.length;
    const totalConversions = allJourneys.filter(j => j.conversion).length;
    const totalAttributionValue = allJourneys.reduce((sum, j) => sum + (j.attribution?.totalValue || 0), 0);
    const avgConversionRate = totalJourneys > 0 ? totalConversions / totalJourneys : 0;

    // Top Channels
    const channelStats = new Map<string, { touchpoints: number; conversions: number; attributedValue: number }>();
    allTouchpoints.forEach(tp => {
      if (!channelStats.has(tp.channel)) {
        channelStats.set(tp.channel, { touchpoints: 0, conversions: 0, attributedValue: 0 });
      }
      const stats = channelStats.get(tp.channel)!;
      stats.touchpoints++;
      stats.attributedValue += tp.value.actual;
    });

    allJourneys.forEach(journey => {
      if (journey.conversion) {
        journey.touchpoints.forEach(tp => {
          if (channelStats.has(tp.channel)) {
            channelStats.get(tp.channel)!.conversions++;
          }
        });
      }
    });

    const topChannels = Array.from(channelStats.entries())
      .sort((a, b) => b[1].attributedValue - a[1].attributedValue)
      .slice(0, 5)
      .map(([channel, stats]) => ({
        channel,
        touchpoints: stats.touchpoints,
        conversions: stats.conversions,
        attributedValue: stats.attributedValue
      }));

    // Model Performance
    const modelPerformance = this.attributionModels.map(model => ({
      model: model.name,
      accuracy: model.performance.accuracy,
      coverage: model.performance.coverage,
      usage: Math.floor(Math.random() * 100) // Simuliert
    }));

    // Local vs Global
    const localJourneys = allJourneys.filter(j => j.insights.localInfluence > 0.5);
    const localConversions = localJourneys.filter(j => j.conversion).length;
    const localConversionRate = localJourneys.length > 0 ? localConversions / localJourneys.length : 0;
    const globalConversionRate = avgConversionRate;
    const localAttributionShare = totalAttributionValue > 0 ?
      localJourneys.reduce((sum, j) => sum + (j.attribution?.totalValue || 0), 0) / totalAttributionValue : 0;

    const recommendations = [
      'Implementiere Local Focused Attribution Model',
      'Erhöhe Budget für Top-performing lokale Kanäle',
      'Optimiere Multi-Channel Customer Journeys',
      'Fokussiere auf lokale Suchoptimierung',
      'Entwickle standort-spezifische Nurturing-Kampagnen'
    ];

    return {
      totalJourneys,
      totalConversions,
      totalAttributionValue,
      avgConversionRate,
      topChannels,
      modelPerformance,
      localVsGlobal: {
        localConversionRate,
        globalConversionRate,
        localAttributionShare
      },
      recommendations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const multiChannelAttributionService = new MultiChannelAttributionService();