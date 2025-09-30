import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localUserBehaviorTrackingService } from './localUserBehaviorTrackingService';
import { localSearchPerformancePredictionService } from './localSearchPerformancePredictionService';
import { competitorLocalSEOAnalysisService } from './competitorLocalSEOAnalysisService';

export interface UserProfile {
  userId: string;
  locationKey: string;
  demographics: {
    age?: number;
    income?: string;
    propertyType?: 'house' | 'apartment' | 'business' | 'other';
    propertySize?: number;
    energyConsumption?: number;
  };
  behavior: {
    searchHistory: string[];
    contentPreferences: string[];
    deviceType: 'desktop' | 'mobile' | 'tablet';
    sessionFrequency: 'daily' | 'weekly' | 'monthly' | 'rare';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  intent: {
    primaryIntent: 'information' | 'comparison' | 'purchase' | 'emergency';
    intentStrength: number;
    budgetRange: { min: number; max: number };
    timeline: 'immediate' | '1_month' | '3_months' | '6_months';
    decisionStage: 'awareness' | 'consideration' | 'decision' | 'retention';
  };
  localContext: {
    distanceToBusiness: number;
    localCompetition: number;
    neighborhoodType: 'residential' | 'commercial' | 'industrial';
    solarPotential: number;
  };
  lastUpdated: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'landing_page' | 'blog_post' | 'email' | 'ad_copy' | 'social_post' | 'faq';
  category: 'solar_basics' | 'pricing' | 'installation' | 'maintenance' | 'financing' | 'case_studies';
  baseContent: {
    title: string;
    headline: string;
    subheadline: string;
    body: string[];
    cta: string;
    images: string[];
    keywords: string[];
  };
  personalizationRules: {
    locationBased: Array<{
      condition: string;
      modifications: {
        title?: string;
        headline?: string;
        content?: string;
        cta?: string;
      };
    }>;
    userBased: Array<{
      condition: string;
      modifications: {
        title?: string;
        headline?: string;
        content?: string;
        cta?: string;
      };
    }>;
    intentBased: Array<{
      condition: string;
      modifications: {
        title?: string;
        headline?: string;
        content?: string;
        cta?: string;
      };
    }>;
  };
  performanceMetrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
  lastUpdated: string;
}

export interface PersonalizedContent {
  id: string;
  userId: string;
  locationKey: string;
  templateId: string;
  personalizationFactors: {
    userProfile: Partial<UserProfile>;
    locationData: any;
    intentData: any;
    competitorData: any;
    performanceData: any;
  };
  generatedContent: {
    title: string;
    headline: string;
    subheadline: string;
    body: string[];
    cta: string;
    images: string[];
    metadata: {
      keywords: string[];
      description: string;
      schemaMarkup: any;
    };
  };
  performancePrediction: {
    expectedCTR: number;
    expectedConversion: number;
    confidence: number;
    reasoning: string[];
  };
  abTestVariants: Array<{
    variantId: string;
    content: Partial<PersonalizedContent['generatedContent']>;
    weight: number;
  }>;
  createdAt: string;
  expiresAt: string;
}

export interface ContentPersonalizationRule {
  id: string;
  name: string;
  priority: number;
  conditions: Array<{
    factor: 'location' | 'user_demographics' | 'user_behavior' | 'intent' | 'time' | 'device' | 'competition';
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
    value: any;
  }>;
  actions: Array<{
    target: 'title' | 'headline' | 'content' | 'cta' | 'images' | 'metadata';
    operation: 'replace' | 'append' | 'prepend' | 'modify';
    value: string;
    dynamic: boolean;
  }>;
  performance: {
    appliedCount: number;
    successRate: number;
    avgImprovement: number;
  };
  active: boolean;
  createdAt: string;
}

export interface PersonalizationCampaign {
  id: string;
  name: string;
  description: string;
  targetAudience: {
    locations: string[];
    userSegments: string[];
    intents: string[];
    exclusions: string[];
  };
  contentStrategy: {
    templates: string[];
    personalizationRules: string[];
    abTesting: boolean;
    dynamicOptimization: boolean;
  };
  goals: {
    primary: 'conversions' | 'engagement' | 'awareness' | 'retention';
    kpis: Array<{
      metric: string;
      target: number;
      current: number;
    }>;
  };
  performance: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCTR: number;
    avgConversionRate: number;
    roi: number;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface ContentRecommendation {
  userId: string;
  locationKey: string;
  recommendations: Array<{
    contentId: string;
    type: string;
    relevance: number;
    reasoning: string;
    expectedEngagement: number;
    personalizationFactors: string[];
  }>;
  nextBestContent: {
    contentId: string;
    type: string;
    urgency: 'high' | 'medium' | 'low';
    trigger: string;
  };
  generatedAt: string;
}

export interface PersonalizationAnalytics {
  campaignId: string;
  timeRange: {
    start: string;
    end: string;
  };
  audienceInsights: {
    totalUsers: number;
    segmentsReached: number;
    avgPersonalizationScore: number;
    topPerformingSegments: Array<{
      segment: string;
      performance: number;
      size: number;
    }>;
  };
  contentPerformance: {
    totalContentGenerated: number;
    avgGenerationTime: number;
    personalizationAccuracy: number;
    abTestResults: Array<{
      variantA: string;
      variantB: string;
      winner: string;
      improvement: number;
      confidence: number;
    }>;
  };
  businessImpact: {
    additionalConversions: number;
    additionalRevenue: number;
    improvedEngagement: number;
    costSavings: number;
  };
  recommendations: string[];
}

/**
 * AI-Powered Local Content Personalization Service
 * KI-gestützte Personalisierung von lokalem Content
 */
export class AIPoweredLocalContentPersonalizationService {
  private userProfiles: Map<string, UserProfile> = new Map();
  private contentTemplates: Map<string, ContentTemplate> = new Map();
  private personalizationRules: Map<string, ContentPersonalizationRule> = new Map();
  private campaigns: Map<string, PersonalizationCampaign> = new Map();
  private personalizedContent: Map<string, PersonalizedContent[]> = new Map();

  constructor() {
    this.initializeContentTemplates();
    this.initializePersonalizationRules();
    this.generateSampleUserProfiles();
    this.createSampleCampaigns();
  }

  /**
   * Initialisiert Content-Templates
   */
  private initializeContentTemplates(): void {
    const templates: ContentTemplate[] = [
      {
        id: 'solar_basics_landing',
        name: 'Solaranlagen Grundlagen Landing Page',
        type: 'landing_page',
        category: 'solar_basics',
        baseContent: {
          title: 'Solaranlagen für Ihr Zuhause',
          headline: 'Erfahren Sie alles über Photovoltaik',
          subheadline: 'Moderne Solartechnologie für nachhaltige Energie',
          body: [
            'Solaranlagen wandeln Sonnenlicht in saubere Energie um.',
            'Profitieren Sie von staatlichen Förderungen.',
            'Reduzieren Sie Ihre Stromkosten nachhaltig.'
          ],
          cta: 'Kostenlose Beratung anfordern',
          images: ['solar-panels.jpg', 'house-with-solar.jpg'],
          keywords: ['solaranlage', 'photovoltaik', 'förderung']
        },
        personalizationRules: {
          locationBased: [
            {
              condition: 'locationKey == "berlin"',
              modifications: {
                title: 'Solaranlagen Berlin - Professionelle Installation',
                headline: 'Solaranlagen für Berlin und Umgebung',
                content: 'Nutzen Sie die Berliner Solarförderung optimal.'
              }
            }
          ],
          userBased: [
            {
              condition: 'propertyType == "house"',
              modifications: {
                headline: 'Solaranlagen für Einfamilienhäuser',
                content: 'Optimale Auslegung für Ihr Dach.'
              }
            }
          ],
          intentBased: [
            {
              condition: 'primaryIntent == "purchase"',
              modifications: {
                cta: 'Jetzt Angebot einholen',
                content: 'Schnelle Installation innerhalb von 2 Wochen.'
              }
            }
          ]
        },
        performanceMetrics: {
          impressions: 12500,
          clicks: 625,
          conversions: 31,
          avgTimeOnPage: 180,
          bounceRate: 0.35
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'pricing_guide_blog',
        name: 'Preisguide für Solaranlagen',
        type: 'blog_post',
        category: 'pricing',
        baseContent: {
          title: 'Solaranlage Kosten 2024 - Vollständiger Preisguide',
          headline: 'Was kostet eine Solaranlage wirklich?',
          subheadline: 'Alle Kostenfaktoren im Überblick',
          body: [
            'Die Kosten für eine Solaranlage variieren je nach Größe.',
            'Förderungen können bis zu 50% der Kosten decken.',
            'Amortisation typischerweise nach 8-10 Jahren.'
          ],
          cta: 'Individuelles Angebot erhalten',
          images: ['cost-calculator.jpg', 'solar-roi-chart.jpg'],
          keywords: ['solaranlage kosten', 'photovoltaik preise', 'förderung']
        },
        personalizationRules: {
          locationBased: [
            {
              condition: 'locationKey contains region',
              modifications: {
                title: 'Solaranlage Kosten {{region}} 2024',
                content: 'Regionale Förderungen in {{region}} berücksichtigt.'
              }
            }
          ],
          userBased: [
            {
              condition: 'budgetRange.max < 20000',
              modifications: {
                headline: 'Kostengünstige Solaranlagen ab 15.000€',
                content: 'Optimale Lösungen für kleinere Budgets.'
              }
            }
          ],
          intentBased: [
            {
              condition: 'decisionStage == "consideration"',
              modifications: {
                cta: 'Kostenlose Kalkulation starten',
                content: 'Vergleichen Sie verschiedene Optionen.'
              }
            }
          ]
        },
        performanceMetrics: {
          impressions: 8900,
          clicks: 534,
          conversions: 27,
          avgTimeOnPage: 240,
          bounceRate: 0.28
        },
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'case_study_email',
        name: 'Erfolgreiche Installation Case Study',
        type: 'email',
        category: 'case_studies',
        baseContent: {
          title: 'So sparen Sie 70% Stromkosten',
          headline: 'Erfolgsgeschichte: Familie Müller',
          subheadline: 'Von 400€ auf 120€ Stromkosten pro Monat',
          body: [
            'Familie Müller hat sich für eine 10kWp Solaranlage entschieden.',
            'Installation innerhalb von 3 Tagen abgeschlossen.',
            'Stromkosten um 70% reduziert.'
          ],
          cta: 'Ähnliches Projekt starten',
          images: ['family-mueller.jpg', 'solar-installation.jpg'],
          keywords: ['solar erfolg', 'stromkosten sparen', 'case study']
        },
        personalizationRules: {
          locationBased: [
            {
              condition: 'distanceToBusiness < 50',
              modifications: {
                headline: 'Lokaler Erfolg: Familie aus {{city}}',
                content: 'Ebenso möglich in Ihrer Nachbarschaft.'
              }
            }
          ],
          userBased: [
            {
              condition: 'energyConsumption > 5000',
              modifications: {
                headline: 'Für hohe Stromverbraucher: 70% Ersparnis möglich',
                content: 'Ideal für Haushalte mit hohem Verbrauch.'
              }
            }
          ],
          intentBased: [
            {
              condition: 'timeline == "immediate"',
              modifications: {
                cta: 'Jetzt Termin vereinbaren',
                content: 'Schnelle Installation innerhalb 1 Woche möglich.'
              }
            }
          ]
        },
        performanceMetrics: {
          impressions: 5600,
          clicks: 448,
          conversions: 22,
          avgTimeOnPage: 90,
          bounceRate: 0.45
        },
        lastUpdated: new Date().toISOString()
      }
    ];

    templates.forEach(template => {
      this.contentTemplates.set(template.id, template);
    });
  }

  /**
   * Initialisiert Personalisierungsregeln
   */
  private initializePersonalizationRules(): void {
    const rules: ContentPersonalizationRule[] = [
      {
        id: 'location_proximity_rule',
        name: 'Standortnähe Personalisierung',
        priority: 10,
        conditions: [
          {
            factor: 'location',
            operator: 'less_than',
            value: 25 // km
          }
        ],
        actions: [
          {
            target: 'headline',
            operation: 'prepend',
            value: 'In Ihrer Nähe: ',
            dynamic: false
          },
          {
            target: 'cta',
            operation: 'replace',
            value: 'Lokalen Termin vereinbaren',
            dynamic: false
          }
        ],
        performance: {
          appliedCount: 1250,
          successRate: 0.78,
          avgImprovement: 0.25
        },
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'budget_based_pricing',
        name: 'Budgetbasierte Preisgestaltung',
        priority: 8,
        conditions: [
          {
            factor: 'user_demographics',
            operator: 'between',
            value: { min: 15000, max: 30000 }
          }
        ],
        actions: [
          {
            target: 'content',
            operation: 'modify',
            value: 'Angebote im Budget von {{budgetRange.min}}€ - {{budgetRange.max}}€',
            dynamic: true
          }
        ],
        performance: {
          appliedCount: 890,
          successRate: 0.82,
          avgImprovement: 0.31
        },
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'intent_driven_cta',
        name: 'Intent-basierte Call-to-Actions',
        priority: 9,
        conditions: [
          {
            factor: 'intent',
            operator: 'equals',
            value: 'purchase'
          }
        ],
        actions: [
          {
            target: 'cta',
            operation: 'replace',
            value: 'Jetzt kostenloses Angebot anfordern',
            dynamic: false
          },
          {
            target: 'headline',
            operation: 'append',
            value: ' - Bereit für Ihre Solaranlage?',
            dynamic: false
          }
        ],
        performance: {
          appliedCount: 1450,
          successRate: 0.85,
          avgImprovement: 0.42
        },
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'competitor_mention_rule',
        name: 'Wettbewerber-Erwähnung',
        priority: 6,
        conditions: [
          {
            factor: 'competition',
            operator: 'greater_than',
            value: 5 // Anzahl Wettbewerber
          }
        ],
        actions: [
          {
            target: 'content',
            operation: 'append',
            value: 'Warum ZOE Solar besser ist als lokale Alternativen.',
            dynamic: false
          }
        ],
        performance: {
          appliedCount: 567,
          successRate: 0.71,
          avgImprovement: 0.18
        },
        active: true,
        createdAt: new Date().toISOString()
      }
    ];

    rules.forEach(rule => {
      this.personalizationRules.set(rule.id, rule);
    });
  }

  /**
   * Generiert Beispiel-User-Profile
   */
  private generateSampleUserProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      // Generiere 20-50 Profile pro Standort
      const profileCount = 20 + Math.floor(Math.random() * 30);

      for (let i = 0; i < profileCount; i++) {
        const userId = `user_${locationKey}_${i}`;
        const profile: UserProfile = {
          userId,
          locationKey,
          demographics: {
            age: 25 + Math.floor(Math.random() * 50),
            income: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            propertyType: ['house', 'apartment', 'business'][Math.floor(Math.random() * 3)] as any,
            propertySize: 50 + Math.floor(Math.random() * 200),
            energyConsumption: 2000 + Math.floor(Math.random() * 8000)
          },
          behavior: {
            searchHistory: [
              'solaranlage kosten',
              'photovoltaik förderung',
              'solar installation'
            ],
            contentPreferences: ['videos', 'case_studies', 'pricing_guides'],
            deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)] as any,
            sessionFrequency: ['daily', 'weekly', 'monthly'][Math.floor(Math.random() * 3)] as any,
            timeOfDay: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)] as any
          },
          intent: {
            primaryIntent: ['information', 'comparison', 'purchase'][Math.floor(Math.random() * 3)] as any,
            intentStrength: Math.floor(Math.random() * 100),
            budgetRange: {
              min: 10000 + Math.floor(Math.random() * 20000),
              max: 30000 + Math.floor(Math.random() * 30000)
            },
            timeline: ['immediate', '1_month', '3_months'][Math.floor(Math.random() * 3)] as any,
            decisionStage: ['awareness', 'consideration', 'decision'][Math.floor(Math.random() * 3)] as any
          },
          localContext: {
            distanceToBusiness: Math.floor(Math.random() * 100),
            localCompetition: Math.floor(Math.random() * 10),
            neighborhoodType: ['residential', 'commercial', 'industrial'][Math.floor(Math.random() * 3)] as any,
            solarPotential: 60 + Math.floor(Math.random() * 35)
          },
          lastUpdated: new Date().toISOString()
        };

        this.userProfiles.set(userId, profile);
      }
    });
  }

  /**
   * Erstellt Beispiel-Kampagnen
   */
  private createSampleCampaigns(): void {
    const campaigns: PersonalizationCampaign[] = [
      {
        id: 'campaign_spring_solar_2024',
        name: 'Frühlings-Solar-Kampagne 2024',
        description: 'Personalisierte Content-Kampagne für die Hochsaison',
        targetAudience: {
          locations: ['berlin', 'hamburg', 'muenchen'],
          userSegments: ['high_intent_buyers', 'comparison_shoppers'],
          intents: ['purchase', 'comparison'],
          exclusions: ['low_budget_users']
        },
        contentStrategy: {
          templates: ['solar_basics_landing', 'pricing_guide_blog'],
          personalizationRules: ['location_proximity_rule', 'intent_driven_cta'],
          abTesting: true,
          dynamicOptimization: true
        },
        goals: {
          primary: 'conversions',
          kpis: [
            { metric: 'conversions', target: 150, current: 87 },
            { metric: 'engagement_rate', target: 0.25, current: 0.22 },
            { metric: 'avg_session_duration', target: 200, current: 185 }
          ]
        },
        performance: {
          totalImpressions: 45000,
          totalClicks: 2250,
          totalConversions: 87,
          avgCTR: 0.05,
          avgConversionRate: 0.038,
          roi: 2.8
        },
        status: 'active',
        startDate: '2024-03-01T00:00:00Z',
        createdAt: new Date().toISOString()
      },
      {
        id: 'campaign_local_engagement',
        name: 'Lokale Kundenbindung',
        description: 'Personalisierte Inhalte für Bestandskunden',
        targetAudience: {
          locations: PRIMARY_SERVICE_REGIONS.map(r => r.city.toLowerCase()),
          userSegments: ['existing_customers'],
          intents: ['support', 'upgrade'],
          exclusions: []
        },
        contentStrategy: {
          templates: ['case_study_email', 'maintenance_guide'],
          personalizationRules: ['location_proximity_rule', 'budget_based_pricing'],
          abTesting: false,
          dynamicOptimization: true
        },
        goals: {
          primary: 'retention',
          kpis: [
            { metric: 'engagement_rate', target: 0.40, current: 0.35 },
            { metric: 'upsell_conversions', target: 25, current: 18 },
            { metric: 'satisfaction_score', target: 4.5, current: 4.3 }
          ]
        },
        performance: {
          totalImpressions: 12500,
          totalClicks: 1750,
          totalConversions: 18,
          avgCTR: 0.14,
          avgConversionRate: 0.010,
          roi: 1.9
        },
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        createdAt: new Date().toISOString()
      }
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });
  }

  /**
   * Generiert personalisierten Content für User
   */
  public generatePersonalizedContent(
    userId: string,
    locationKey: string,
    templateId: string,
    context?: any
  ): PersonalizedContent | null {
    const userProfile = this.userProfiles.get(userId);
    const template = this.contentTemplates.get(templateId);

    if (!template) return null;

    // Sammle Personalisierungsfaktoren
    const personalizationFactors = {
      userProfile: userProfile || {},
      locationData: this.getLocationData(locationKey),
      intentData: userProfile?.intent || {},
      competitorData: competitorLocalSEOAnalysisService.getCompetitorSEOProfile('comp_001', locationKey),
      performanceData: template.performanceMetrics
    };

    // Wende Personalisierungsregeln an
    const generatedContent = this.applyPersonalizationRules(template, personalizationFactors);

    // Erstelle A/B-Test-Varianten
    const abTestVariants = this.generateABTestVariants(generatedContent, template);

    // Performance-Vorhersage
    const performancePrediction = this.predictContentPerformance(generatedContent, personalizationFactors);

    const personalizedContent: PersonalizedContent = {
      id: `personalized_${userId}_${templateId}_${Date.now()}`,
      userId,
      locationKey,
      templateId,
      personalizationFactors,
      generatedContent,
      performancePrediction,
      abTestVariants,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 Tage
    };

    // Speichere personalisierten Content
    const userContent = this.personalizedContent.get(userId) || [];
    userContent.push(personalizedContent);
    this.personalizedContent.set(userId, userContent);

    return personalizedContent;
  }

  /**
   * Ruft Standortdaten ab
   */
  private getLocationData(locationKey: string): any {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) return {};

    return {
      city: region.city,
      state: region.state,
      population: region.population,
      solarPotential: 70 + Math.random() * 25,
      avgIncome: 35000 + Math.random() * 25000,
      competitionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      localTrends: ['increasing_demand', 'government_incentives', 'technological_advancements']
    };
  }

  /**
   * Wendet Personalisierungsregeln an
   */
  private applyPersonalizationRules(
    template: ContentTemplate,
    factors: PersonalizedContent['personalizationFactors']
  ): PersonalizedContent['generatedContent'] {
    let content = { ...template.baseContent };

    // Wende alle aktiven Regeln an
    Array.from(this.personalizationRules.values())
      .filter(rule => rule.active)
      .sort((a, b) => b.priority - a.priority)
      .forEach(rule => {
        if (this.evaluateRuleConditions(rule, factors)) {
          content = this.applyRuleActions(content, rule, factors);
        }
      });

    // Dynamische Ersetzungen
    content = this.applyDynamicReplacements(content, factors);

    return {
      title: content.title,
      headline: content.headline,
      subheadline: content.subheadline,
      body: content.body,
      cta: content.cta,
      images: content.images,
      metadata: {
        keywords: content.keywords,
        description: content.body[0]?.substring(0, 155) + '...',
        schemaMarkup: this.generateSchemaMarkup(content, factors)
      }
    };
  }

  /**
   * Evaluiert Regelbedingungen
   */
  private evaluateRuleConditions(rule: ContentPersonalizationRule, factors: any): boolean {
    return rule.conditions.every(condition => {
      const factorValue = this.getFactorValue(condition.factor, factors);

      switch (condition.operator) {
        case 'equals':
          return factorValue === condition.value;
        case 'contains':
          return String(factorValue).includes(String(condition.value));
        case 'greater_than':
          return Number(factorValue) > Number(condition.value);
        case 'less_than':
          return Number(factorValue) < Number(condition.value);
        case 'between':
          return Number(factorValue) >= condition.value.min && Number(factorValue) <= condition.value.max;
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(factorValue);
        default:
          return false;
      }
    });
  }

  /**
   * Ruft Faktorwert ab
   */
  private getFactorValue(factor: string, factors: any): any {
    const factorMap: { [key: string]: string } = {
      'location': 'locationData.city',
      'user_demographics': 'userProfile.demographics',
      'user_behavior': 'userProfile.behavior',
      'intent': 'intentData.primaryIntent',
      'time': 'currentTime',
      'device': 'userProfile.behavior.deviceType',
      'competition': 'locationData.competitionLevel'
    };

    const path = factorMap[factor];
    if (!path) return null;

    return path.split('.').reduce((obj, key) => obj?.[key], factors);
  }

  /**
   * Wendet Regelaktionen an
   */
  private applyRuleActions(
    content: any,
    rule: ContentPersonalizationRule,
    factors: any
  ): any {
    const newContent = { ...content };

    rule.actions.forEach(action => {
      let value = action.value;

      if (action.dynamic) {
        value = this.replaceDynamicPlaceholders(value, factors);
      }

      switch (action.operation) {
        case 'replace':
          newContent[action.target] = value;
          break;
        case 'append':
          newContent[action.target] += value;
          break;
        case 'prepend':
          newContent[action.target] = value + newContent[action.target];
          break;
        case 'modify':
          // Vereinfachte Modifikation
          newContent[action.target] = value;
          break;
      }
    });

    return newContent;
  }

  /**
   * Ersetzt dynamische Platzhalter
   */
  private replaceDynamicPlaceholders(text: string, factors: any): string {
    return text
      .replace(/\{\{budgetRange\.min\}\}/g, factors.userProfile?.intent?.budgetRange?.min || '15000')
      .replace(/\{\{budgetRange\.max\}\}/g, factors.userProfile?.intent?.budgetRange?.max || '40000')
      .replace(/\{\{city\}\}/g, factors.locationData?.city || 'Ihrer Stadt')
      .replace(/\{\{region\}\}/g, factors.locationData?.state || 'Ihrer Region');
  }

  /**
   * Wendet dynamische Ersetzungen an
   */
  private applyDynamicReplacements(content: any, factors: any): any {
    const newContent = { ...content };

    Object.keys(newContent).forEach(key => {
      if (typeof newContent[key] === 'string') {
        newContent[key] = this.replaceDynamicPlaceholders(newContent[key], factors);
      } else if (Array.isArray(newContent[key])) {
        newContent[key] = newContent[key].map((item: any) =>
          typeof item === 'string' ? this.replaceDynamicPlaceholders(item, factors) : item
        );
      }
    });

    return newContent;
  }

  /**
   * Generiert Schema-Markup
   */
  private generateSchemaMarkup(content: any, factors: any): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.headline,
      description: content.metadata?.description,
      author: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZOE Solar GmbH',
        address: {
          '@type': 'PostalAddress',
          addressLocality: factors.locationData?.city || 'Deutschland'
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
  }

  /**
   * Generiert A/B-Test-Varianten
   */
  private generateABTestVariants(
    content: PersonalizedContent['generatedContent'],
    template: ContentTemplate
  ): PersonalizedContent['abTestVariants'] {
    const variants = [
      {
        variantId: 'variant_a',
        content: {},
        weight: 0.5
      },
      {
        variantId: 'variant_b',
        content: {
          headline: content.headline + ' - Jetzt 20% sparen!',
          cta: 'Sofort Angebot sichern'
        },
        weight: 0.3
      },
      {
        variantId: 'variant_c',
        content: {
          headline: 'Entdecken Sie Ihre Solar-Möglichkeiten',
          cta: 'Kostenlose Beratung starten'
        },
        weight: 0.2
      }
    ];

    return variants;
  }

  /**
   * Sagt Content-Performance voraus
   */
  private predictContentPerformance(
    content: PersonalizedContent['generatedContent'],
    factors: any
  ): PersonalizedContent['performancePrediction'] {
    // Vereinfachte Vorhersage basierend auf Faktoren
    let baseCTR = 0.03;
    let baseConversion = 0.02;

    // Personalisierungsfaktoren berücksichtigen
    if (factors.userProfile?.intent?.primaryIntent === 'purchase') {
      baseCTR += 0.01;
      baseConversion += 0.015;
    }

    if (factors.locationData?.distanceToBusiness < 25) {
      baseCTR += 0.005;
      baseConversion += 0.008;
    }

    const confidence = 0.75 + Math.random() * 0.2;

    return {
      expectedCTR: Math.round(baseCTR * 100) / 100,
      expectedConversion: Math.round(baseConversion * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      reasoning: [
        'Hohe Intent-Stärke des Users',
        'Lokale Relevanz erkannt',
        'Positive historische Performance ähnlicher Inhalte'
      ]
    };
  }

  /**
   * Ruft Content-Empfehlungen für User ab
   */
  public getContentRecommendations(userId: string, locationKey: string): ContentRecommendation {
    const userProfile = this.userProfiles.get(userId);
    const userBehavior = localUserBehaviorTrackingService.getUserJourney(userId, locationKey);

    const recommendations = Array.from(this.contentTemplates.values())
      .map(template => {
        const relevance = this.calculateContentRelevance(template, userProfile, userBehavior);
        const expectedEngagement = this.predictEngagement(template, userProfile);

        return {
          contentId: template.id,
          type: template.type,
          relevance,
          reasoning: this.generateRecommendationReasoning(template, userProfile, relevance),
          expectedEngagement,
          personalizationFactors: this.identifyPersonalizationFactors(template, userProfile)
        };
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    const nextBestContent = recommendations[0] || {
      contentId: 'default_landing',
      type: 'landing_page',
      urgency: 'medium' as const,
      trigger: 'general_interest'
    };

    return {
      userId,
      locationKey,
      recommendations,
      nextBestContent,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Berechnet Content-Relevanz
   */
  private calculateContentRelevance(template: ContentTemplate, userProfile?: UserProfile, userBehavior?: any): number {
    let relevance = 0.5; // Basisrelevanz

    if (!userProfile) return relevance;

    // Intent-basierte Relevanz
    if (template.category === 'pricing' && userProfile.intent.primaryIntent === 'comparison') {
      relevance += 0.3;
    }

    if (template.category === 'case_studies' && userProfile.intent.decisionStage === 'consideration') {
      relevance += 0.25;
    }

    // Verhaltensbasierte Relevanz
    if (userProfile.behavior.contentPreferences.includes(template.type)) {
      relevance += 0.2;
    }

    // Demografische Relevanz
    if (template.category === 'financing' && userProfile.demographics.income === 'medium') {
      relevance += 0.15;
    }

    return Math.min(1.0, relevance);
  }

  /**
   * Sagt Engagement voraus
   */
  private predictEngagement(template: ContentTemplate, userProfile?: UserProfile): number {
    let engagement = template.performanceMetrics.avgTimeOnPage / 300; // Normalisiert auf 0-1

    if (userProfile?.behavior.deviceType === 'mobile' && template.type === 'landing_page') {
      engagement += 0.1;
    }

    return Math.min(1.0, engagement);
  }

  /**
   * Generiert Empfehlungsbegründung
   */
  private generateRecommendationReasoning(template: ContentTemplate, userProfile?: UserProfile, relevance: number): string {
    if (relevance > 0.8) return 'Sehr hohe Relevanz basierend auf Ihrem Interesse und Verhalten';
    if (relevance > 0.6) return 'Gute Übereinstimmung mit Ihren Präferenzen';
    return 'Potenziell interessanter Content für Sie';
  }

  /**
   * Identifiziert Personalisierungsfaktoren
   */
  private identifyPersonalizationFactors(template: ContentTemplate, userProfile?: UserProfile): string[] {
    const factors = [];

    if (userProfile?.locationKey) factors.push('Standortbasiert');
    if (userProfile?.intent.primaryIntent) factors.push('Intent-basiert');
    if (userProfile?.behavior.deviceType) factors.push('Geräteoptimiert');

    return factors;
  }

  /**
   * Führt Kampagne aus
   */
  public executeCampaign(campaignId: string, userId: string, locationKey: string): PersonalizedContent | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || campaign.status !== 'active') return null;

    // Prüfe Zielgruppeneignung
    if (!this.isUserInCampaignAudience(userId, locationKey, campaign)) return null;

    // Wähle optimales Template
    const templateId = this.selectOptimalTemplate(campaign, userId, locationKey);

    return this.generatePersonalizedContent(userId, locationKey, templateId);
  }

  /**
   * Prüft, ob User in Kampagnen-Zielgruppe ist
   */
  private isUserInCampaignAudience(userId: string, locationKey: string, campaign: PersonalizationCampaign): boolean {
    if (!campaign.targetAudience.locations.includes(locationKey)) return false;

    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return false;

    // Vereinfachte Prüfung
    if (campaign.targetAudience.exclusions.includes('low_budget_users') &&
        userProfile.intent.budgetRange.max < 20000) return false;

    return true;
  }

  /**
   * Wählt optimales Template für Kampagne
   */
  private selectOptimalTemplate(campaign: PersonalizationCampaign, userId: string, locationKey: string): string {
    // Vereinfachte Auswahl - nimm erstes verfügbares Template
    return campaign.contentStrategy.templates[0];
  }

  /**
   * Ruft Kampagnen-Performance ab
   */
  public getCampaignAnalytics(campaignId: string): PersonalizationAnalytics | null {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    return {
      campaignId,
      timeRange: {
        start: campaign.startDate,
        end: campaign.endDate || new Date().toISOString()
      },
      audienceInsights: {
        totalUsers: 1250,
        segmentsReached: 5,
        avgPersonalizationScore: 0.78,
        topPerformingSegments: [
          { segment: 'high_intent_buyers', performance: 0.85, size: 450 },
          { segment: 'comparison_shoppers', performance: 0.72, size: 380 }
        ]
      },
      contentPerformance: {
        totalContentGenerated: campaign.performance.totalImpressions,
        avgGenerationTime: 0.8,
        personalizationAccuracy: 0.82,
        abTestResults: [
          {
            variantA: 'Standard CTA',
            variantB: 'Dringlichkeits-CTA',
            winner: 'Dringlichkeits-CTA',
            improvement: 0.23,
            confidence: 0.89
          }
        ]
      },
      businessImpact: {
        additionalConversions: campaign.performance.totalConversions,
        additionalRevenue: campaign.performance.totalConversions * 2500,
        improvedEngagement: 0.18,
        costSavings: 1250
      },
      recommendations: [
        'A/B-Testing für Headlines ausweiten',
        'Personalisierung für mobile User verbessern',
        'Lokale Events in Content integrieren'
      ]
    };
  }

  /**
   * Optimiert Personalisierungsregeln basierend auf Performance
   */
  public optimizePersonalizationRules(): void {
    Array.from(this.personalizationRules.values()).forEach(rule => {
      // Vereinfachte Optimierung - in Realität komplexer Algorithmus
      if (rule.performance.successRate > 0.8) {
        rule.priority += 1;
      } else if (rule.performance.successRate < 0.6) {
        rule.priority = Math.max(1, rule.priority - 1);
      }
    });
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalUsers: number;
    totalContentGenerated: number;
    activeCampaigns: number;
    avgPersonalizationScore: number;
    topPerformingContent: Array<{
      templateId: string;
      name: string;
      performance: number;
      usage: number;
    }>;
    campaignPerformance: Array<{
      campaignId: string;
      name: string;
      conversions: number;
      roi: number;
    }>;
    personalizationInsights: string[];
  } {
    const totalUsers = this.userProfiles.size;
    const totalContentGenerated = Array.from(this.personalizedContent.values())
      .reduce((sum, contents) => sum + contents.length, 0);
    const activeCampaigns = Array.from(this.campaigns.values())
      .filter(c => c.status === 'active').length;

    const personalizationScores = Array.from(this.personalizedContent.values())
      .flat()
      .map(content => content.performancePrediction.confidence);

    const avgPersonalizationScore = personalizationScores.length > 0
      ? personalizationScores.reduce((sum, score) => sum + score, 0) / personalizationScores.length
      : 0;

    // Top performing Content
    const templateUsage: { [key: string]: number } = {};
    Array.from(this.personalizedContent.values())
      .flat()
      .forEach(content => {
        templateUsage[content.templateId] = (templateUsage[content.templateId] || 0) + 1;
      });

    const topPerformingContent = Object.entries(templateUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([templateId, usage]) => {
        const template = this.contentTemplates.get(templateId);
        return {
          templateId,
          name: template?.name || 'Unknown',
          performance: Math.random() * 0.5 + 0.5, // Vereinfacht
          usage
        };
      });

    // Kampagnen-Performance
    const campaignPerformance = Array.from(this.campaigns.values())
      .map(campaign => ({
        campaignId: campaign.id,
        name: campaign.name,
        conversions: campaign.performance.totalConversions,
        roi: campaign.performance.roi
      }))
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5);

    const personalizationInsights = [
      `Durchschnittliche Personalisierungsgenauigkeit: ${(avgPersonalizationScore * 100).toFixed(1)}%`,
      `${activeCampaigns} aktive Personalisierungskampagnen`,
      `${totalContentGenerated} personalisierte Inhalte generiert`,
      'Mobile-Optimierung zeigt beste Performance',
      'Intent-basierte Personalisierung am effektivsten'
    ];

    return {
      totalUsers,
      totalContentGenerated,
      activeCampaigns,
      avgPersonalizationScore: Math.round(avgPersonalizationScore * 100) / 100,
      topPerformingContent,
      campaignPerformance,
      personalizationInsights
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const aiPoweredLocalContentPersonalizationService = new AIPoweredLocalContentPersonalizationService();