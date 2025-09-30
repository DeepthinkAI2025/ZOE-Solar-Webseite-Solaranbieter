import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { localUserBehaviorTrackingService } from './localUserBehaviorTrackingService';

export interface LocalLead {
  id: string;
  locationKey: string;
  source: 'organic_search' | 'local_pack' | 'gmb' | 'social' | 'referral' | 'direct' | 'paid';
  campaignId?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
  leadData: {
    serviceInterest: string[];
    propertyType?: 'house' | 'apartment' | 'commercial' | 'industrial';
    propertySize?: number; // in m²
    currentEnergyProvider?: string;
    monthlyEnergyCost?: number;
    roofType?: 'flat' | 'pitched' | 'mixed';
    timeline: 'immediately' | '3_months' | '6_months' | '1_year' | 'planning';
    budget?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  qualification: {
    score: number; // 0-100
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
    priority: 'hot' | 'warm' | 'cold';
    tags: string[];
    notes: string[];
  };
  journey: {
    firstTouch: {
      source: string;
      campaign?: string;
      timestamp: string;
      page: string;
    };
    touchpoints: Array<{
      timestamp: string;
      action: string;
      source: string;
      value?: number;
    }>;
    conversionEvents: Array<{
      event: string;
      timestamp: string;
      value?: number;
    }>;
  };
  attribution: {
    primarySource: string;
    secondarySources: string[];
    channelMix: { [channel: string]: number }; // Prozentuale Attribution
    customerLifetimeValue: number;
    acquisitionCost: number;
    roi: number;
  };
  localContext: {
    proximityToLocation: number; // in km
    localCompetition: string[];
    marketPosition: 'primary' | 'secondary' | 'tertiary';
    seasonalFactors: string[];
    economicIndicators: {
      localIncome: number;
      propertyValues: number;
      energyPrices: number;
    };
  };
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

export interface CRMIntegration {
  id: string;
  crmType: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho' | 'custom';
  name: string;
  config: {
    apiEndpoint: string;
    apiKey: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    customFields: { [key: string]: string };
  };
  mappings: {
    leadFields: { [zoeField: string]: string }; // ZOE Feld -> CRM Feld
    statusMappings: { [zoeStatus: string]: string }; // ZOE Status -> CRM Status
    customMappings: { [key: string]: any };
  };
  syncSettings: {
    autoSync: boolean;
    syncInterval: number; // in minutes
    batchSize: number;
    errorHandling: 'skip' | 'retry' | 'stop';
    conflictResolution: 'crm_wins' | 'zoe_wins' | 'manual';
  };
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  syncStats: {
    totalSynced: number;
    successfulSyncs: number;
    failedSyncs: number;
    lastError?: string;
  };
}

export interface LeadNurturingCampaign {
  id: string;
  name: string;
  locationKey: string;
  targetAudience: {
    leadScore: { min: number; max: number };
    interests: string[];
    locationRadius: number; // in km
    timeline: string[];
  };
  content: {
    emailSequence: Array<{
      id: string;
      subject: string;
      content: string;
      delay: number; // Tage nach vorheriger Email
      triggers: string[];
    }>;
    smsSequence: Array<{
      id: string;
      message: string;
      delay: number;
      triggers: string[];
    }>;
    retargetingAds: Array<{
      platform: 'google' | 'facebook' | 'linkedin';
      content: string;
      targeting: any;
      budget: number;
    }>;
  };
  automation: {
    entryTriggers: string[];
    exitTriggers: string[];
    scoringRules: Array<{
      condition: string;
      action: 'increase_score' | 'decrease_score' | 'move_to_campaign';
      value: number;
    }>;
  };
  performance: {
    enrolledLeads: number;
    conversionRate: number;
    avgTimeToConversion: number;
    roi: number;
    costPerLead: number;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface LocalLeadScoring {
  id: string;
  locationKey: string;
  leadId: string;
  scores: {
    demographic: number; // 0-25
    behavioral: number; // 0-25
    intent: number; // 0-25
    local: number; // 0-25
    total: number; // 0-100
  };
  factors: {
    demographic: {
      income: number;
      propertyValue: number;
      creditScore: number;
      employment: number;
    };
    behavioral: {
      pageViews: number;
      timeOnSite: number;
      downloads: number;
      emailOpens: number;
      formSubmissions: number;
    };
    intent: {
      searchVolume: number;
      keywordIntent: number;
      contentConsumption: number;
      competitorResearch: number;
    };
    local: {
      proximity: number;
      localSearch: number;
      communityEngagement: number;
      referrals: number;
    };
  };
  predictions: {
    conversionProbability: number;
    expectedValue: number;
    timeToConversion: number;
    churnRisk: number;
  };
  recommendations: string[];
  calculatedAt: string;
}

export interface LeadAttributionModel {
  id: string;
  name: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'custom';
  config: {
    decayFactor?: number;
    positionWeights?: { [position: string]: number };
    customLogic?: string;
  };
  performance: {
    accuracy: number;
    coverage: number;
    avgAttribution: number;
  };
  isDefault: boolean;
  createdAt: string;
}

export interface LocalCRMIntelligence {
  locationKey: string;
  marketInsights: {
    leadVolume: number;
    conversionRate: number;
    avgLeadValue: number;
    seasonalPatterns: Array<{
      month: string;
      leadVolume: number;
      conversionRate: number;
    }>;
    competitorActivity: Array<{
      competitor: string;
      leadsGenerated: number;
      marketShare: number;
    }>;
  };
  leadQuality: {
    avgScore: number;
    scoreDistribution: { [range: string]: number };
    topLeadSources: Array<{
      source: string;
      volume: number;
      quality: number;
    }>;
    conversionBySource: { [source: string]: number };
  };
  campaignPerformance: {
    activeCampaigns: number;
    totalROI: number;
    bestPerforming: {
      campaignId: string;
      name: string;
      roi: number;
      leads: number;
    };
    worstPerforming: {
      campaignId: string;
      name: string;
      roi: number;
      leads: number;
    };
  };
  predictiveAnalytics: {
    leadForecast: Array<{
      month: string;
      predictedLeads: number;
      confidence: number;
    }>;
    marketTrends: Array<{
      trend: string;
      impact: number;
      probability: number;
    }>;
    opportunityAreas: string[];
  };
  recommendations: string[];
  lastUpdated: string;
}

/**
 * CRM Lead Tracking Integration Service
 * Integration von lokalen Leads mit CRM-Systemen
 */
export class CRMLeadTrackingIntegrationService {
  private localLeads: Map<string, LocalLead[]> = new Map();
  private crmIntegrations: Map<string, CRMIntegration[]> = new Map();
  private leadNurturingCampaigns: Map<string, LeadNurturingCampaign[]> = new Map();
  private leadScoring: Map<string, LocalLeadScoring[]> = new Map();
  private attributionModels: LeadAttributionModel[] = [];
  private crmIntelligence: Map<string, LocalCRMIntelligence> = new Map();

  constructor() {
    this.initializeDefaultData();
    this.setupDefaultAttributionModels();
    this.createDefaultCampaigns();
  }

  /**
   * Initialisiert Standard-Daten
   */
  private initializeDefaultData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const leads: LocalLead[] = [];

      // Simuliere Leads für jeden Standort
      for (let i = 0; i < 50; i++) {
        const lead: LocalLead = {
          id: `lead_${locationKey}_${i}`,
          locationKey,
          source: ['organic_search', 'local_pack', 'gmb', 'social', 'referral'][Math.floor(Math.random() * 5)] as any,
          contactInfo: {
            name: `Jeremy Schulze ${i}`,
            email: `max${i}@example.com`,
            phone: `+49 30 123456${i}`,
            address: {
              street: `Musterstraße ${i + 1}`,
              city: region.city,
              zipCode: region.zipCode,
              country: 'Deutschland'
            }
          },
          leadData: {
            serviceInterest: ['photovoltaik', 'speicher', 'wallbox'][Math.floor(Math.random() * 3)] as any,
            propertyType: ['house', 'apartment'][Math.floor(Math.random() * 2)] as any,
            propertySize: 100 + Math.floor(Math.random() * 200),
            currentEnergyProvider: ['E.ON', 'Vattenfall', 'EnBW'][Math.floor(Math.random() * 3)],
            monthlyEnergyCost: 100 + Math.floor(Math.random() * 200),
            roofType: ['pitched', 'flat'][Math.floor(Math.random() * 2)] as any,
            timeline: ['immediately', '3_months', '6_months'][Math.floor(Math.random() * 3)] as any,
            budget: {
              min: 10000,
              max: 30000,
              currency: 'EUR'
            }
          },
          qualification: {
            score: 20 + Math.floor(Math.random() * 80),
            status: ['new', 'contacted', 'qualified'][Math.floor(Math.random() * 3)] as any,
            priority: ['hot', 'warm', 'cold'][Math.floor(Math.random() * 3)] as any,
            tags: ['interested', 'local', 'high_value'],
            notes: ['Lead aus lokaler Suche', 'Hat sich für Beratung interessiert']
          },
          journey: {
            firstTouch: {
              source: 'organic_search',
              campaign: 'local_seo_campaign',
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
              page: '/solaranlagen'
            },
            touchpoints: [
              {
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
                action: 'page_view',
                source: 'organic_search',
                value: 1
              }
            ],
            conversionEvents: [
              {
                event: 'form_submission',
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString(),
                value: 1
              }
            ]
          },
          attribution: {
            primarySource: 'organic_search',
            secondarySources: ['gmb', 'social'],
            channelMix: {
              'organic_search': 60,
              'gmb': 30,
              'social': 10
            },
            customerLifetimeValue: 15000 + Math.floor(Math.random() * 20000),
            acquisitionCost: 200 + Math.floor(Math.random() * 500),
            roi: 2.5 + Math.random() * 5
          },
          localContext: {
            proximityToLocation: Math.floor(Math.random() * 50),
            localCompetition: ['SolarTech GmbH', 'GreenEnergy Berlin'],
            marketPosition: 'primary',
            seasonalFactors: ['Frühling', 'Sommer'],
            economicIndicators: {
              localIncome: 3500 + Math.floor(Math.random() * 2000),
              propertyValues: 400000 + Math.floor(Math.random() * 200000),
              energyPrices: 0.25 + Math.random() * 0.1
            }
          },
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        leads.push(lead);
      }

      this.localLeads.set(locationKey, leads);

      // Erstelle CRM Intelligence für jeden Standort
      this.createCRMIntelligence(locationKey);
    });
  }

  /**
   * Richtet Standard-Attributionsmodelle ein
   */
  private setupDefaultAttributionModels(): void {
    this.attributionModels = [
      {
        id: 'first_touch',
        name: 'First Touch',
        type: 'first_touch',
        config: {},
        performance: {
          accuracy: 0.75,
          coverage: 0.85,
          avgAttribution: 1.0
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'last_touch',
        name: 'Last Touch',
        type: 'last_touch',
        config: {},
        performance: {
          accuracy: 0.80,
          coverage: 0.90,
          avgAttribution: 1.0
        },
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'linear',
        name: 'Linear Attribution',
        type: 'linear',
        config: {},
        performance: {
          accuracy: 0.70,
          coverage: 0.95,
          avgAttribution: 1.0
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'time_decay',
        name: 'Time Decay',
        type: 'time_decay',
        config: {
          decayFactor: 0.5
        },
        performance: {
          accuracy: 0.85,
          coverage: 0.88,
          avgAttribution: 1.0
        },
        isDefault: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Erstellt Standard-Kampagnen
   */
  private createDefaultCampaigns(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const campaigns: LeadNurturingCampaign[] = [];

      // Nurturing-Kampagne für neue Leads
      campaigns.push({
        id: `campaign_nurture_${locationKey}`,
        name: `Solar Interessenten ${region.city}`,
        locationKey,
        targetAudience: {
          leadScore: { min: 30, max: 70 },
          interests: ['photovoltaik', 'speicher'],
          locationRadius: 25,
          timeline: ['3_months', '6_months']
        },
        content: {
          emailSequence: [
            {
              id: 'email_1',
              subject: `Solaranlagen in ${region.city} - Ihre Fragen beantwortet`,
              content: 'Willkommen bei ZOE Solar...',
              delay: 0,
              triggers: ['lead_created']
            },
            {
              id: 'email_2',
              subject: 'Förderungen für Solaranlagen 2024',
              content: 'Entdecken Sie alle Fördermöglichkeiten...',
              delay: 3,
              triggers: ['email_opened']
            },
            {
              id: 'email_3',
              subject: 'Kostenlose Beratung vereinbaren',
              content: 'Lassen Sie uns über Ihre Solarlösung sprechen...',
              delay: 7,
              triggers: ['email_opened']
            }
          ],
          smsSequence: [
            {
              id: 'sms_1',
              message: `Hallo! Vielen Dank für Ihr Interesse an Solaranlagen in ${region.city}.`,
              delay: 1,
              triggers: ['lead_created']
            }
          ],
          retargetingAds: [
            {
              platform: 'google',
              content: `Solaranlagen ${region.city} - Jetzt beraten lassen`,
              targeting: { keywords: [`solaranlage ${region.city}`] },
              budget: 500
            }
          ]
        },
        automation: {
          entryTriggers: ['lead_score_30_70', 'interest_solar'],
          exitTriggers: ['converted', 'unsubscribed'],
          scoringRules: [
            {
              condition: 'email_opened',
              action: 'increase_score',
              value: 5
            },
            {
              condition: 'form_submitted',
              action: 'increase_score',
              value: 15
            }
          ]
        },
        performance: {
          enrolledLeads: 0,
          conversionRate: 0,
          avgTimeToConversion: 0,
          roi: 0,
          costPerLead: 0
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Hot Lead Kampagne
      campaigns.push({
        id: `campaign_hot_${locationKey}`,
        name: `Hot Leads ${region.city}`,
        locationKey,
        targetAudience: {
          leadScore: { min: 71, max: 100 },
          interests: ['photovoltaik', 'speicher', 'wallbox'],
          locationRadius: 50,
          timeline: ['immediately', '3_months']
        },
        content: {
          emailSequence: [
            {
              id: 'email_hot_1',
              subject: `DRINGEND: Solar-Beratung in ${region.city} verfügbar`,
              content: 'Sie haben sich für eine Solaranlage interessiert...',
              delay: 0,
              triggers: ['lead_score_high']
            }
          ],
          smsSequence: [
            {
              id: 'sms_hot_1',
              message: `Dringend: Solar-Beratungstermin in ${region.city} verfügbar!`,
              delay: 0,
              triggers: ['lead_score_high']
            }
          ],
          retargetingAds: []
        },
        automation: {
          entryTriggers: ['lead_score_71_100'],
          exitTriggers: ['converted', 'meeting_booked'],
          scoringRules: []
        },
        performance: {
          enrolledLeads: 0,
          conversionRate: 0,
          avgTimeToConversion: 0,
          roi: 0,
          costPerLead: 0
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      this.leadNurturingCampaigns.set(locationKey, campaigns);
    });
  }

  /**
   * Erstellt CRM Intelligence für Standort
   */
  private createCRMIntelligence(locationKey: string): void {
    const leads = this.localLeads.get(locationKey) || [];
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);

    if (!region) return;

    const intelligence: LocalCRMIntelligence = {
      locationKey,
      marketInsights: {
        leadVolume: leads.length,
        conversionRate: leads.filter(l => l.qualification.status === 'won').length / leads.length,
        avgLeadValue: leads.reduce((sum, l) => sum + l.attribution.customerLifetimeValue, 0) / leads.length,
        seasonalPatterns: [
          { month: 'Januar', leadVolume: 15, conversionRate: 0.02 },
          { month: 'Februar', leadVolume: 18, conversionRate: 0.025 },
          { month: 'März', leadVolume: 25, conversionRate: 0.03 },
          { month: 'April', leadVolume: 35, conversionRate: 0.035 },
          { month: 'Mai', leadVolume: 42, conversionRate: 0.04 },
          { month: 'Juni', leadVolume: 38, conversionRate: 0.038 }
        ],
        competitorActivity: [
          { competitor: 'SolarTech GmbH', leadsGenerated: 120, marketShare: 0.25 },
          { competitor: 'GreenEnergy Berlin', leadsGenerated: 95, marketShare: 0.20 },
          { competitor: 'SunPower Solutions', leadsGenerated: 75, marketShare: 0.15 }
        ]
      },
      leadQuality: {
        avgScore: leads.reduce((sum, l) => sum + l.qualification.score, 0) / leads.length,
        scoreDistribution: {
          '0-20': leads.filter(l => l.qualification.score <= 20).length,
          '21-40': leads.filter(l => l.qualification.score > 20 && l.qualification.score <= 40).length,
          '41-60': leads.filter(l => l.qualification.score > 40 && l.qualification.score <= 60).length,
          '61-80': leads.filter(l => l.qualification.score > 60 && l.qualification.score <= 80).length,
          '81-100': leads.filter(l => l.qualification.score > 80).length
        },
        topLeadSources: [
          { source: 'organic_search', volume: 25, quality: 75 },
          { source: 'gmb', volume: 15, quality: 80 },
          { source: 'local_pack', volume: 8, quality: 70 }
        ],
        conversionBySource: {
          'organic_search': 0.08,
          'gmb': 0.12,
          'local_pack': 0.10,
          'social': 0.05
        }
      },
      campaignPerformance: {
        activeCampaigns: 2,
        totalROI: 3.2,
        bestPerforming: {
          campaignId: 'campaign_hot_berlin',
          name: 'Hot Leads Berlin',
          roi: 4.5,
          leads: 12
        },
        worstPerforming: {
          campaignId: 'campaign_nurture_berlin',
          name: 'Solar Interessenten Berlin',
          roi: 2.1,
          leads: 8
        }
      },
      predictiveAnalytics: {
        leadForecast: [
          { month: 'Oktober', predictedLeads: 45, confidence: 0.85 },
          { month: 'November', predictedLeads: 38, confidence: 0.80 },
          { month: 'Dezember', predictedLeads: 28, confidence: 0.75 }
        ],
        marketTrends: [
          { trend: 'Steigende Energiepreise', impact: 0.8, probability: 0.9 },
          { trend: 'Neue Förderungen', impact: 0.6, probability: 0.7 },
          { trend: 'Wettbewerbszunahme', impact: -0.4, probability: 0.6 }
        ],
        opportunityAreas: [
          'Erhöhte Marketingausgaben für Q4',
          'Fokus auf High-Value Leads',
          'Lokale Events für Leadgenerierung'
        ]
      },
      recommendations: [
        'Erhöhe Budget für Google Ads im Q4',
        'Optimiere Lead-Scoring für bessere Qualifikation',
        'Implementiere lokale Events für Leadgenerierung',
        'Verbessere Follow-up Prozesse für Hot Leads'
      ],
      lastUpdated: new Date().toISOString()
    };

    this.crmIntelligence.set(locationKey, intelligence);
  }

  /**
   * Erstellt neue lokale Lead
   */
  public createLocalLead(
    locationKey: string,
    leadData: Partial<LocalLead>
  ): LocalLead {
    const leadId = `lead_${locationKey}_${Date.now()}`;

    const lead: LocalLead = {
      id: leadId,
      locationKey,
      source: leadData.source || 'organic_search',
      campaignId: leadData.campaignId,
      contactInfo: leadData.contactInfo || {
        name: '',
        email: '',
        phone: ''
      },
      leadData: leadData.leadData || {
        serviceInterest: [],
        timeline: 'planning'
      },
      qualification: leadData.qualification || {
        score: 50,
        status: 'new',
        priority: 'warm',
        tags: [],
        notes: []
      },
      journey: leadData.journey || {
        firstTouch: {
          source: 'unknown',
          timestamp: new Date().toISOString(),
          page: '/'
        },
        touchpoints: [],
        conversionEvents: []
      },
      attribution: leadData.attribution || {
        primarySource: 'unknown',
        secondarySources: [],
        channelMix: {},
        customerLifetimeValue: 0,
        acquisitionCost: 0,
        roi: 0
      },
      localContext: leadData.localContext || {
        proximityToLocation: 0,
        localCompetition: [],
        marketPosition: 'primary',
        seasonalFactors: [],
        economicIndicators: {
          localIncome: 0,
          propertyValues: 0,
          energyPrices: 0
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // Speichere Lead
    const locationLeads = this.localLeads.get(locationKey) || [];
    locationLeads.push(lead);
    this.localLeads.set(locationKey, locationLeads);

    // Berechne Lead-Scoring
    this.calculateLeadScoring(leadId, locationKey);

    return lead;
  }

  /**
   * Berechnet Lead-Scoring
   */
  private calculateLeadScoring(leadId: string, locationKey: string): LocalLeadScoring {
    const leads = this.localLeads.get(locationKey) || [];
    const lead = leads.find(l => l.id === leadId);

    if (!lead) throw new Error(`Lead ${leadId} not found`);

    // Berechne Scores basierend auf verschiedenen Faktoren
    const demographicScore = this.calculateDemographicScore(lead);
    const behavioralScore = this.calculateBehavioralScore(lead);
    const intentScore = this.calculateIntentScore(lead);
    const localScore = this.calculateLocalScore(lead);

    const totalScore = demographicScore + behavioralScore + intentScore + localScore;

    const scoring: LocalLeadScoring = {
      id: `scoring_${leadId}`,
      locationKey,
      leadId,
      scores: {
        demographic: demographicScore,
        behavioral: behavioralScore,
        intent: intentScore,
        local: localScore,
        total: totalScore
      },
      factors: {
        demographic: {
          income: lead.localContext.economicIndicators.localIncome / 100,
          propertyValue: lead.localContext.economicIndicators.propertyValues / 100000,
          creditScore: 700 + Math.floor(Math.random() * 300), // Simuliert
          employment: Math.random() > 0.2 ? 1 : 0
        },
        behavioral: {
          pageViews: lead.journey.touchpoints.filter(t => t.action === 'page_view').length,
          timeOnSite: lead.journey.touchpoints.reduce((sum, t) => sum + (t.value || 0), 0),
          downloads: lead.journey.touchpoints.filter(t => t.action === 'download').length,
          emailOpens: lead.journey.touchpoints.filter(t => t.action === 'email_open').length,
          formSubmissions: lead.journey.conversionEvents.filter(e => e.event === 'form_submission').length
        },
        intent: {
          searchVolume: 1000 + Math.floor(Math.random() * 4000),
          keywordIntent: lead.leadData.serviceInterest.length * 5,
          contentConsumption: lead.journey.touchpoints.length * 2,
          competitorResearch: Math.floor(Math.random() * 10)
        },
        local: {
          proximity: Math.max(0, 25 - lead.localContext.proximityToLocation),
          localSearch: lead.source === 'local_pack' || lead.source === 'gmb' ? 20 : 10,
          communityEngagement: Math.floor(Math.random() * 15),
          referrals: lead.journey.touchpoints.filter(t => t.source === 'referral').length * 5
        }
      },
      predictions: {
        conversionProbability: Math.min(1, totalScore / 100),
        expectedValue: lead.attribution.customerLifetimeValue,
        timeToConversion: 30 + Math.floor(Math.random() * 90), // Tage
        churnRisk: Math.max(0, 1 - (totalScore / 100))
      },
      recommendations: this.generateScoringRecommendations(totalScore, lead),
      calculatedAt: new Date().toISOString()
    };

    // Speichere Scoring
    const locationScoring = this.leadScoring.get(locationKey) || [];
    locationScoring.push(scoring);
    this.leadScoring.set(locationKey, locationScoring);

    // Aktualisiere Lead mit neuem Score
    lead.qualification.score = totalScore;
    lead.updatedAt = new Date().toISOString();

    return scoring;
  }

  /**
   * Berechnet demografischen Score
   */
  private calculateDemographicScore(lead: LocalLead): number {
    let score = 0;

    // Einkommen (0-10 Punkte)
    if (lead.localContext.economicIndicators.localIncome > 4000) score += 10;
    else if (lead.localContext.economicIndicators.localIncome > 3000) score += 7;
    else if (lead.localContext.economicIndicators.localIncome > 2000) score += 5;
    else score += 2;

    // Immobilienwert (0-10 Punkte)
    if (lead.localContext.economicIndicators.propertyValues > 500000) score += 10;
    else if (lead.localContext.economicIndicators.propertyValues > 300000) score += 7;
    else if (lead.localContext.economicIndicators.propertyValues > 150000) score += 5;
    else score += 2;

    // Budget (0-5 Punkte)
    if (lead.leadData.budget && lead.leadData.budget.min > 20000) score += 5;
    else if (lead.leadData.budget && lead.leadData.budget.min > 10000) score += 3;
    else score += 1;

    return Math.min(25, score);
  }

  /**
   * Berechnet behavioral Score
   */
  private calculateBehavioralScore(lead: LocalLead): number {
    let score = 0;

    // Touchpoints (0-10 Punkte)
    const touchpoints = lead.journey.touchpoints.length;
    if (touchpoints > 10) score += 10;
    else if (touchpoints > 5) score += 7;
    else if (touchpoints > 2) score += 5;
    else score += 2;

    // Conversion Events (0-10 Punkte)
    const conversions = lead.journey.conversionEvents.length;
    if (conversions > 3) score += 10;
    else if (conversions > 1) score += 7;
    else if (conversions > 0) score += 5;
    else score += 1;

    // Zeit auf Seite (0-5 Punkte)
    const timeOnSite = lead.journey.touchpoints.reduce((sum, t) => sum + (t.value || 0), 0);
    if (timeOnSite > 300) score += 5;
    else if (timeOnSite > 120) score += 3;
    else score += 1;

    return Math.min(25, score);
  }

  /**
   * Berechnet Intent Score
   */
  private calculateIntentScore(lead: LocalLead): number {
    let score = 0;

    // Service Interest (0-10 Punkte)
    const interests = lead.leadData.serviceInterest.length;
    if (interests > 2) score += 10;
    else if (interests > 1) score += 7;
    else if (interests > 0) score += 5;
    else score += 1;

    // Timeline (0-10 Punkte)
    switch (lead.leadData.timeline) {
      case 'immediately': score += 10; break;
      case '3_months': score += 8; break;
      case '6_months': score += 6; break;
      case '1_year': score += 4; break;
      case 'planning': score += 2; break;
    }

    // Property Size (0-5 Punkte)
    if (lead.leadData.propertySize && lead.leadData.propertySize > 150) score += 5;
    else if (lead.leadData.propertySize && lead.leadData.propertySize > 100) score += 3;
    else score += 1;

    return Math.min(25, score);
  }

  /**
   * Berechnet lokalen Score
   */
  private calculateLocalScore(lead: LocalLead): number {
    let score = 0;

    // Proximity (0-10 Punkte)
    const proximity = lead.localContext.proximityToLocation;
    if (proximity < 5) score += 10;
    else if (proximity < 15) score += 8;
    else if (proximity < 25) score += 6;
    else if (proximity < 50) score += 4;
    else score += 2;

    // Local Source (0-10 Punkte)
    if (lead.source === 'gmb' || lead.source === 'local_pack') score += 10;
    else if (lead.source === 'organic_search') score += 7;
    else if (lead.source === 'referral') score += 5;
    else score += 3;

    // Market Position (0-5 Punkte)
    if (lead.localContext.marketPosition === 'primary') score += 5;
    else if (lead.localContext.marketPosition === 'secondary') score += 3;
    else score += 1;

    return Math.min(25, score);
  }

  /**
   * Generiert Scoring-Empfehlungen
   */
  private generateScoringRecommendations(score: number, lead: LocalLead): string[] {
    const recommendations: string[] = [];

    if (score >= 80) {
      recommendations.push('Hot Lead - Sofort kontaktieren');
      recommendations.push('Premium-Beratung anbieten');
      recommendations.push('Schnelltermin vereinbaren');
    } else if (score >= 60) {
      recommendations.push('Warm Lead - Innerhalb 24h kontaktieren');
      recommendations.push('Personalisierte Informationen senden');
      recommendations.push('Follow-up nach 3 Tagen');
    } else if (score >= 40) {
      recommendations.push('Nurturing-Kampagne starten');
      recommendations.push('Regelmäßige Informationen senden');
      recommendations.push('Lead-Qualifikation verbessern');
    } else {
      recommendations.push('Cold Lead - Langfristiges Nurturing');
      recommendations.push('Basis-Informationen bereitstellen');
      recommendations.push('Re-engagement nach 30 Tagen');
    }

    return recommendations;
  }

  /**
   * Synchronisiert Lead mit CRM
   */
  public syncLeadToCRM(leadId: string, locationKey: string, crmId: string): {
    success: boolean;
    syncedData: any;
    errors?: string[];
  } {
    const integrations = this.crmIntegrations.get(locationKey) || [];
    const integration = integrations.find(i => i.id === crmId);

    if (!integration || integration.status !== 'active') {
      return {
        success: false,
        syncedData: null,
        errors: ['CRM Integration nicht gefunden oder inaktiv']
      };
    }

    const leads = this.localLeads.get(locationKey) || [];
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return {
        success: false,
        syncedData: null,
        errors: ['Lead nicht gefunden']
      };
    }

    // Simuliere CRM-Sync
    const syncedData = this.mapLeadToCRM(lead, integration);

    // Aktualisiere Sync-Stats
    integration.syncStats.totalSynced++;
    integration.syncStats.successfulSyncs++;
    integration.lastSync = new Date().toISOString();

    return {
      success: true,
      syncedData,
      errors: []
    };
  }

  /**
   * Mapped Lead zu CRM-Format
   */
  private mapLeadToCRM(lead: LocalLead, integration: CRMIntegration): any {
    const mappedData: any = {};

    // Basis-Felder mappen
    Object.entries(integration.mappings.leadFields).forEach(([zoeField, crmField]) => {
      switch (zoeField) {
        case 'name':
          mappedData[crmField] = lead.contactInfo.name;
          break;
        case 'email':
          mappedData[crmField] = lead.contactInfo.email;
          break;
        case 'phone':
          mappedData[crmField] = lead.contactInfo.phone;
          break;
        case 'company':
          mappedData[crmField] = 'Privatkunde';
          break;
        case 'status':
          mappedData[crmField] = integration.mappings.statusMappings[lead.qualification.status] || lead.qualification.status;
          break;
        case 'score':
          mappedData[crmField] = lead.qualification.score;
          break;
        case 'source':
          mappedData[crmField] = lead.source;
          break;
        case 'value':
          mappedData[crmField] = lead.attribution.customerLifetimeValue;
          break;
      }
    });

    // Custom Fields
    Object.entries(integration.mappings.customMappings).forEach(([key, value]) => {
      mappedData[key] = value;
    });

    return mappedData;
  }

  /**
   * Startet Nurturing-Kampagne für Lead
   */
  public enrollLeadInCampaign(
    leadId: string,
    locationKey: string,
    campaignId: string
  ): {
    success: boolean;
    campaign: LeadNurturingCampaign | null;
    nextSteps: string[];
  } {
    const campaigns = this.leadNurturingCampaigns.get(locationKey) || [];
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign || campaign.status !== 'active') {
      return {
        success: false,
        campaign: null,
        nextSteps: []
      };
    }

    const leads = this.localLeads.get(locationKey) || [];
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return {
        success: false,
        campaign: null,
        nextSteps: []
      };
    }

    // Prüfe Kampagnen-Kriterien
    const matchesCriteria = this.checkCampaignCriteria(lead, campaign);

    if (!matchesCriteria) {
      return {
        success: false,
        campaign: null,
        nextSteps: ['Lead erfüllt nicht die Kampagnen-Kriterien']
      };
    }

    // Aktualisiere Kampagnen-Performance
    campaign.performance.enrolledLeads++;

    // Erstelle nächste Schritte
    const nextSteps = this.generateCampaignNextSteps(campaign);

    return {
      success: true,
      campaign,
      nextSteps
    };
  }

  /**
   * Prüft Kampagnen-Kriterien
   */
  private checkCampaignCriteria(lead: LocalLead, campaign: LeadNurturingCampaign): boolean {
    // Lead Score
    if (lead.qualification.score < campaign.targetAudience.leadScore.min ||
        lead.qualification.score > campaign.targetAudience.leadScore.max) {
      return false;
    }

    // Interests
    if (campaign.targetAudience.interests.length > 0) {
      const hasMatchingInterest = campaign.targetAudience.interests.some(interest =>
        lead.leadData.serviceInterest.includes(interest)
      );
      if (!hasMatchingInterest) return false;
    }

    // Timeline
    if (campaign.targetAudience.timeline.length > 0) {
      if (!campaign.targetAudience.timeline.includes(lead.leadData.timeline)) {
        return false;
      }
    }

    // Proximity
    if (lead.localContext.proximityToLocation > campaign.targetAudience.locationRadius) {
      return false;
    }

    return true;
  }

  /**
   * Generiert nächste Schritte für Kampagne
   */
  private generateCampaignNextSteps(campaign: LeadNurturingCampaign): string[] {
    const steps: string[] = [];

    // Email Sequence
    if (campaign.content.emailSequence.length > 0) {
      steps.push(`Sende erste Email: "${campaign.content.emailSequence[0].subject}"`);
    }

    // SMS Sequence
    if (campaign.content.smsSequence.length > 0) {
      steps.push(`Sende erste SMS: "${campaign.content.smsSequence[0].message.substring(0, 50)}..."`);
    }

    // Retargeting
    if (campaign.content.retargetingAds.length > 0) {
      steps.push('Starte Retargeting-Kampagnen');
    }

    // Follow-up
    steps.push('Plane Follow-up basierend auf Lead-Reaktion');

    return steps;
  }

  /**
   * Ruft lokale Leads ab
   */
  public getLocalLeads(locationKey: string, filters?: {
    status?: string;
    priority?: string;
    source?: string;
    scoreMin?: number;
    scoreMax?: number;
  }): LocalLead[] {
    let leads = this.localLeads.get(locationKey) || [];

    if (filters) {
      leads = leads.filter(lead => {
        if (filters.status && lead.qualification.status !== filters.status) return false;
        if (filters.priority && lead.qualification.priority !== filters.priority) return false;
        if (filters.source && lead.source !== filters.source) return false;
        if (filters.scoreMin && lead.qualification.score < filters.scoreMin) return false;
        if (filters.scoreMax && lead.qualification.score > filters.scoreMax) return false;
        return true;
      });
    }

    return leads;
  }

  /**
   * Ruft Lead-Scoring ab
   */
  public getLeadScoring(locationKey: string, leadId?: string): LocalLeadScoring[] {
    const scoring = this.leadScoring.get(locationKey) || [];

    if (leadId) {
      return scoring.filter(s => s.leadId === leadId);
    }

    return scoring;
  }

  /**
   * Ruft Nurturing-Kampagnen ab
   */
  public getLeadNurturingCampaigns(locationKey: string): LeadNurturingCampaign[] {
    return this.leadNurturingCampaigns.get(locationKey) || [];
  }

  /**
   * Ruft CRM Intelligence ab
   */
  public getCRMIntelligence(locationKey: string): LocalCRMIntelligence | null {
    return this.crmIntelligence.get(locationKey) || null;
  }

  /**
   * Ruft Attributionsmodelle ab
   */
  public getAttributionModels(): LeadAttributionModel[] {
    return this.attributionModels;
  }

  /**
   * Erstellt CRM Integration
   */
  public createCRMIntegration(
    locationKey: string,
    integrationData: Partial<CRMIntegration>
  ): CRMIntegration {
    const integrationId = `crm_${locationKey}_${Date.now()}`;

    const integration: CRMIntegration = {
      id: integrationId,
      crmType: integrationData.crmType || 'salesforce',
      name: integrationData.name || `CRM Integration ${locationKey}`,
      config: integrationData.config || {
        apiEndpoint: '',
        apiKey: '',
        customFields: {}
      },
      mappings: integrationData.mappings || {
        leadFields: {},
        statusMappings: {},
        customMappings: {}
      },
      syncSettings: integrationData.syncSettings || {
        autoSync: false,
        syncInterval: 60,
        batchSize: 50,
        errorHandling: 'retry',
        conflictResolution: 'crm_wins'
      },
      status: 'inactive',
      lastSync: new Date().toISOString(),
      syncStats: {
        totalSynced: 0,
        successfulSyncs: 0,
        failedSyncs: 0
      }
    };

    // Speichere Integration
    const locationIntegrations = this.crmIntegrations.get(locationKey) || [];
    locationIntegrations.push(integration);
    this.crmIntegrations.set(locationKey, locationIntegrations);

    return integration;
  }

  /**
   * Dashboard-Übersicht für alle Standorte
   */
  public getGlobalCRMDashboard(): {
    totalLeads: number;
    totalConversions: number;
    avgLeadScore: number;
    totalRevenue: number;
    topPerformingLocations: Array<{
      location: string;
      leads: number;
      conversions: number;
      revenue: number;
    }>;
    leadSources: { [source: string]: number };
    conversionFunnel: Array<{
      stage: string;
      count: number;
      conversionRate: number;
    }>;
    recommendations: string[];
  } {
    const allLeads = Array.from(this.localLeads.values()).flat();
    const allIntelligence = Array.from(this.crmIntelligence.values());

    const totalLeads = allLeads.length;
    const totalConversions = allLeads.filter(l => l.qualification.status === 'won').length;
    const avgLeadScore = allLeads.reduce((sum, l) => sum + l.qualification.score, 0) / totalLeads;
    const totalRevenue = allLeads
      .filter(l => l.qualification.status === 'won')
      .reduce((sum, l) => sum + l.attribution.customerLifetimeValue, 0);

    // Top performing Locations
    const locationPerformance = PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      const leads = this.getLocalLeads(locationKey);
      const conversions = leads.filter(l => l.qualification.status === 'won').length;
      const revenue = leads
        .filter(l => l.qualification.status === 'won')
        .reduce((sum, l) => sum + l.attribution.customerLifetimeValue, 0);

      return {
        location: locationKey,
        leads: leads.length,
        conversions,
        revenue
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Lead Sources
    const leadSources: { [source: string]: number } = {};
    allLeads.forEach(lead => {
      leadSources[lead.source] = (leadSources[lead.source] || 0) + 1;
    });

    // Conversion Funnel
    const funnelStages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won'];
    const conversionFunnel = funnelStages.map((stage, index) => {
      const count = allLeads.filter(l => l.qualification.status === stage).length;
      const previousCount = index > 0 ?
        allLeads.filter(l => l.qualification.status === funnelStages[index - 1]).length : totalLeads;
      const conversionRate = previousCount > 0 ? count / previousCount : 0;

      return {
        stage,
        count,
        conversionRate
      };
    });

    const recommendations = [
      'Optimiere Lead-Qualifikation für höhere Conversion-Raten',
      'Erhöhe Marketing-Budget für Top-performing Kanäle',
      'Implementiere automatisierte Nurturing-Kampagnen',
      'Verbessere Follow-up-Prozesse für Hot Leads',
      'Integriere zusätzliche CRM-Systeme für bessere Daten'
    ];

    return {
      totalLeads,
      totalConversions,
      avgLeadScore: Math.round(avgLeadScore),
      totalRevenue: Math.round(totalRevenue),
      topPerformingLocations: locationPerformance.slice(0, 5),
      leadSources,
      conversionFunnel,
      recommendations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const crmLeadTrackingIntegrationService = new CRMLeadTrackingIntegrationService();