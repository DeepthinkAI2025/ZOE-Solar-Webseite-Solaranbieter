import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { crmLeadTrackingIntegrationService } from './crmLeadTrackingIntegrationService';
import { localUserBehaviorTrackingService } from './localUserBehaviorTrackingService';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';

export interface LocalMarketingCampaign {
  id: string;
  name: string;
  locationKey: string;
  campaignType: 'email' | 'social' | 'sms' | 'display' | 'local_event' | 'gmb_post' | 'multi_channel';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  targetAudience: {
    segments: Array<{
      id: string;
      name: string;
      criteria: {
        leadScore?: { min: number; max: number };
        interests?: string[];
        locationRadius?: number; // in km
        behaviorPatterns?: string[];
        demographic?: {
          ageRange?: [number, number];
          incomeRange?: [number, number];
          propertyType?: string[];
        };
        customCriteria?: { [key: string]: any };
      };
      size: number;
    }>;
    totalReach: number;
    estimatedConversion: number;
  };
  content: {
    subject?: string;
    headline?: string;
    body: string;
    callToAction: {
      text: string;
      url: string;
      type: 'primary' | 'secondary';
    };
    media: Array<{
      type: 'image' | 'video' | 'document';
      url: string;
      alt?: string;
      caption?: string;
    }>;
    personalization: {
      dynamicFields: string[];
      conditionalContent: Array<{
        condition: string;
        content: string;
      }>;
      localCustomization: boolean;
    };
  };
  channels: Array<{
    platform: 'email' | 'facebook' | 'instagram' | 'google_ads' | 'linkedin' | 'sms' | 'gmb';
    targeting: {
      interests?: string[];
      demographics?: any;
      location?: {
        radius: number;
        coordinates?: [number, number];
      };
      customAudience?: string;
    };
    budget?: {
      daily: number;
      total: number;
      currency: string;
    };
    schedule: {
      startDate: string;
      endDate?: string;
      frequency: 'once' | 'daily' | 'weekly' | 'monthly';
      timeSlots?: string[];
    };
  }>;
  automation: {
    triggers: Array<{
      event: string;
      condition: string;
      action: string;
      delay?: number; // in minutes
    }>;
    workflows: Array<{
      id: string;
      name: string;
      steps: Array<{
        id: string;
        type: 'send_message' | 'wait' | 'update_lead' | 'create_task' | 'conditional_branch';
        config: any;
        delay?: number;
      }>;
    }>;
    smartScheduling: {
      enabled: boolean;
      optimalTimes: { [day: string]: string[] };
      timezone: string;
    };
  };
  tracking: {
    utmParameters: {
      source: string;
      medium: string;
      campaign: string;
      term?: string;
      content?: string;
    };
    conversionGoals: Array<{
      id: string;
      name: string;
      type: 'form_submission' | 'phone_call' | 'appointment' | 'purchase' | 'custom';
      value?: number;
      attributionWindow: number; // in days
    }>;
    analytics: {
      googleAnalytics?: {
        trackingId: string;
        goals: string[];
      };
      facebookPixel?: {
        pixelId: string;
        events: string[];
      };
      customTracking?: {
        script: string;
        events: string[];
      };
    };
  };
  performance: {
    budget: {
      allocated: number;
      spent: number;
      remaining: number;
      currency: string;
    };
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      conversions: number;
      conversionRate: number;
      costPerClick: number;
      costPerConversion: number;
      roi: number;
      revenue: number;
    };
    channelPerformance: { [channel: string]: {
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      roi: number;
    }};
    audienceInsights: {
      engagementRate: number;
      openRate?: number;
      clickRate?: number;
      bounceRate?: number;
      unsubscribeRate?: number;
    };
  };
  abTesting?: {
    enabled: boolean;
    variants: Array<{
      id: string;
      name: string;
      content: any;
      weight: number; // percentage of traffic
      performance: {
        impressions: number;
        clicks: number;
        conversions: number;
        ctr: number;
        conversionRate: number;
      };
    }>;
    winner?: string;
    confidence: number;
    testDuration: number; // in days
  };
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface LocalMarketingAutomation {
  id: string;
  name: string;
  locationKey: string;
  type: 'lead_nurturing' | 'reengagement' | 'upselling' | 'seasonal' | 'event_based' | 'behavioral';
  status: 'active' | 'paused' | 'inactive';
  triggers: Array<{
    event: string;
    conditions: string[];
    delay?: number;
  }>;
  actions: Array<{
    type: 'send_email' | 'send_sms' | 'create_task' | 'update_lead' | 'add_tag' | 'remove_tag';
    config: any;
    delay?: number;
  }>;
  performance: {
    triggered: number;
    executed: number;
    conversions: number;
    revenue: number;
  };
  createdAt: string;
  lastTriggered?: string;
}

export interface LocalEventCampaign {
  id: string;
  name: string;
  locationKey: string;
  eventType: 'webinar' | 'workshop' | 'open_house' | 'trade_show' | 'community_event' | 'virtual_event';
  eventDetails: {
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number; // in minutes
    location: {
      type: 'physical' | 'virtual' | 'hybrid';
      address?: string;
      virtualLink?: string;
      capacity?: number;
    };
    targetAudience: string[];
    expectedAttendees: number;
  };
  marketingStrategy: {
    preEvent: {
      timeline: Array<{
        daysBefore: number;
        activities: string[];
        channels: string[];
      }>;
      content: {
        invitations: string;
        reminders: string[];
        teasers: string[];
      };
    };
    duringEvent: {
      engagement: string[];
      liveUpdates: boolean;
      qAndA: boolean;
    };
    postEvent: {
      followUp: string[];
      content: string[];
      analysis: string[];
    };
  };
  promotion: {
    channels: string[];
    budget: number;
    timeline: string[];
    materials: string[];
  };
  registration: {
    system: 'eventbrite' | 'custom' | 'manual';
    formFields: string[];
    confirmation: string;
    reminders: string[];
  };
  performance: {
    registrations: number;
    attendees: number;
    engagement: number;
    leadsGenerated: number;
    conversions: number;
    roi: number;
  };
  status: 'planning' | 'promoting' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface LocalMarketingIntelligence {
  locationKey: string;
  marketAnalysis: {
    competitorActivity: Array<{
      competitor: string;
      campaigns: number;
      spend: number;
      reach: number;
    }>;
    seasonalTrends: Array<{
      season: string;
      campaignType: string;
      effectiveness: number;
      recommendation: string;
    }>;
    audiencePreferences: {
      preferredChannels: string[];
      bestTimes: { [day: string]: string[] };
      contentTypes: string[];
      priceSensitivity: number;
    };
    localEvents: Array<{
      event: string;
      date: string;
      expectedImpact: number;
      marketingOpportunity: string;
    }>;
  };
  campaignInsights: {
    topPerforming: {
      campaignId: string;
      name: string;
      roi: number;
      reason: string;
    };
    underPerforming: {
      campaignId: string;
      name: string;
      roi: number;
      issues: string[];
      recommendations: string[];
    };
    channelEffectiveness: { [channel: string]: {
      reach: number;
      engagement: number;
      conversion: number;
      costEfficiency: number;
    }};
    audienceSegments: Array<{
      segment: string;
      size: number;
      engagement: number;
      value: number;
      recommendedActions: string[];
    }>;
  };
  predictiveAnalytics: {
    nextBestCampaign: {
      type: string;
      timing: string;
      expectedROI: number;
      confidence: number;
    };
    seasonalOpportunities: Array<{
      opportunity: string;
      timing: string;
      potential: number;
      strategy: string;
    }>;
    budgetOptimization: {
      recommendedSpend: { [channel: string]: number };
      expectedOutcomes: {
        reach: number;
        conversions: number;
        revenue: number;
      };
    };
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'budget' | 'timing' | 'content' | 'channels' | 'audience';
    recommendation: string;
    expectedImpact: number;
    implementationEffort: string;
  }>;
  lastUpdated: string;
}

/**
 * Marketing Automation Integration Service
 * Automatisierte lokale Marketing-Kampagnen
 */
export class MarketingAutomationIntegrationService {
  private marketingCampaigns: Map<string, LocalMarketingCampaign[]> = new Map();
  private marketingAutomations: Map<string, LocalMarketingAutomation[]> = new Map();
  private eventCampaigns: Map<string, LocalEventCampaign[]> = new Map();
  private marketingIntelligence: Map<string, LocalMarketingIntelligence> = new Map();

  constructor() {
    this.initializeDefaultCampaigns();
    this.setupMarketingAutomations();
    this.createEventCampaigns();
    this.generateMarketingIntelligence();
  }

  /**
   * Initialisiert Standard-Kampagnen
   */
  private initializeDefaultCampaigns(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const campaigns: LocalMarketingCampaign[] = [];

      // Email-Kampagne für lokale Leads
      campaigns.push({
        id: `campaign_email_${locationKey}`,
        name: `Solaranlagen Beratung ${region.city}`,
        locationKey,
        campaignType: 'email',
        status: 'active',
        targetAudience: {
          segments: [
            {
              id: 'high_intent_leads',
              name: 'High-Intent Solar Leads',
              criteria: {
                leadScore: { min: 70, max: 100 },
                interests: ['photovoltaik', 'solaranlage'],
                locationRadius: 25
              },
              size: 150
            }
          ],
          totalReach: 150,
          estimatedConversion: 12
        },
        content: {
          subject: `Kostenlose Solar-Beratung in ${region.city} - Jetzt Termin sichern!`,
          headline: `Professionelle Solaranlagen-Beratung in ${region.city}`,
          body: `Liebe/r Interessent/in,

wir haben Ihr Interesse an Solaranlagen in ${region.city} registriert. Als lokaler Experte bieten wir Ihnen eine kostenlose und unverbindliche Beratung vor Ort an.

Warum ZOE Solar:
• Über 500 erfolgreiche Installationen in ${region.city}
• Individuelle Lösungen für Ihr Dach
• Förderungen bis zu 50% der Kosten
• 10 Jahre Herstellergarantie

Sichern Sie sich jetzt Ihren persönlichen Beratungstermin!`,
          callToAction: {
            text: 'Termin vereinbaren',
            url: `/termin-vereinbaren-${locationKey}`,
            type: 'primary'
          },
          media: [
            {
              type: 'image',
              url: `/images/solar-installation-${locationKey}.jpg`,
              alt: `Solaranlage Installation in ${region.city}`
            }
          ],
          personalization: {
            dynamicFields: ['name', 'location'],
            conditionalContent: [
              {
                condition: 'timeline_immediately',
                content: 'Wir können bereits nächste Woche bei Ihnen vor Ort sein!'
              }
            ],
            localCustomization: true
          }
        },
        channels: [
          {
            platform: 'email',
            targeting: {
              customAudience: 'local_leads'
            },
            schedule: {
              startDate: new Date().toISOString(),
              frequency: 'weekly',
              timeSlots: ['10:00', '14:00']
            }
          }
        ],
        automation: {
          triggers: [
            {
              event: 'lead_created',
              condition: 'score > 70',
              action: 'send_campaign',
              delay: 60 // 1 hour
            }
          ],
          workflows: [
            {
              id: 'follow_up_workflow',
              name: 'Follow-up Sequence',
              steps: [
                {
                  id: 'step_1',
                  type: 'send_message',
                  config: { template: 'initial_email' },
                  delay: 0
                },
                {
                  id: 'step_2',
                  type: 'wait',
                  config: { duration: 3, unit: 'days' },
                  delay: 3 * 24 * 60
                },
                {
                  id: 'step_3',
                  type: 'conditional_branch',
                  config: {
                    condition: 'opened_email',
                    true: { action: 'send_follow_up' },
                    false: { action: 'send_reminder' }
                  }
                }
              ]
            }
          ],
          smartScheduling: {
            enabled: true,
            optimalTimes: {
              monday: ['09:00', '11:00', '15:00'],
              tuesday: ['10:00', '14:00', '16:00'],
              wednesday: ['09:00', '13:00', '15:00'],
              thursday: ['10:00', '14:00', '16:00'],
              friday: ['09:00', '11:00']
            },
            timezone: 'Europe/Berlin'
          }
        },
        tracking: {
          utmParameters: {
            source: 'email',
            medium: 'campaign',
            campaign: `solar_beratung_${locationKey}`
          },
          conversionGoals: [
            {
              id: 'appointment_booked',
              name: 'Termin vereinbart',
              type: 'appointment',
              value: 0,
              attributionWindow: 30
            },
            {
              id: 'quote_requested',
              name: 'Angebot angefordert',
              type: 'form_submission',
              value: 0,
              attributionWindow: 14
            }
          ],
          analytics: {
            googleAnalytics: {
              trackingId: 'GA_MEASUREMENT_ID',
              goals: ['appointment_booked', 'quote_requested']
            }
          }
        },
        performance: {
          budget: {
            allocated: 500,
            spent: 125,
            remaining: 375,
            currency: 'EUR'
          },
          metrics: {
            impressions: 2500,
            clicks: 125,
            ctr: 0.05,
            conversions: 8,
            conversionRate: 0.064,
            costPerClick: 1.00,
            costPerConversion: 15.63,
            roi: 3.2,
            revenue: 12000
          },
          channelPerformance: {
            email: {
              impressions: 2500,
              clicks: 125,
              conversions: 8,
              spend: 125,
              roi: 3.2
            }
          },
          audienceInsights: {
            engagementRate: 0.15,
            openRate: 0.35,
            clickRate: 0.08,
            bounceRate: 0.02,
            unsubscribeRate: 0.005
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startedAt: new Date().toISOString()
      });

      // Social Media Kampagne
      campaigns.push({
        id: `campaign_social_${locationKey}`,
        name: `Social Media Solar ${region.city}`,
        locationKey,
        campaignType: 'social',
        status: 'active',
        targetAudience: {
          segments: [
            {
              id: 'local_residents',
              name: 'Lokale Bewohner',
              criteria: {
                locationRadius: 15,
                interests: ['renewable_energy', 'sustainability']
              },
              size: 5000
            }
          ],
          totalReach: 5000,
          estimatedConversion: 25
        },
        content: {
          headline: `🌞 Solaranlagen in ${region.city} - Jetzt Förderung sichern!`,
          body: `Entdecken Sie die Vorteile von Solaranlagen in ${region.city}:
• Reduzieren Sie Ihre Stromkosten um bis zu 70%
• Nutzen Sie die aktuellen Förderungen (bis zu 7.500€)
• Werden Sie unabhängig von Energiepreisen
• Beitrag zum Klimaschutz

Kostenlose Beratung vor Ort!`,
          callToAction: {
            text: 'Mehr erfahren',
            url: `/solaranlagen-${locationKey}`,
            type: 'primary'
          },
          media: [
            {
              type: 'image',
              url: `/images/solar-benefits-${locationKey}.jpg`,
              alt: 'Solaranlage Vorteile'
            }
          ],
          personalization: {
            dynamicFields: ['location'],
            conditionalContent: [],
            localCustomization: true
          }
        },
        channels: [
          {
            platform: 'facebook',
            targeting: {
              location: {
                radius: 15
              },
              interests: ['Solar Energy', 'Renewable Energy', 'Sustainable Living']
            },
            budget: {
              daily: 25,
              total: 750,
              currency: 'EUR'
            },
            schedule: {
              startDate: new Date().toISOString(),
              frequency: 'daily'
            }
          },
          {
            platform: 'instagram',
            targeting: {
              location: {
                radius: 15
              },
              interests: ['Home Improvement', 'Green Living']
            },
            budget: {
              daily: 15,
              total: 450,
              currency: 'EUR'
            },
            schedule: {
              startDate: new Date().toISOString(),
              frequency: 'daily'
            }
          }
        ],
        automation: {
          triggers: [],
          workflows: [],
          smartScheduling: {
            enabled: true,
            optimalTimes: {
              monday: ['12:00', '18:00'],
              tuesday: ['11:00', '19:00'],
              wednesday: ['13:00', '17:00'],
              thursday: ['12:00', '18:00'],
              friday: ['11:00', '15:00'],
              saturday: ['14:00'],
              sunday: ['16:00']
            },
            timezone: 'Europe/Berlin'
          }
        },
        tracking: {
          utmParameters: {
            source: 'social',
            medium: 'paid',
            campaign: `solar_social_${locationKey}`
          },
          conversionGoals: [
            {
              id: 'website_visit',
              name: 'Website-Besuch',
              type: 'custom',
              attributionWindow: 7
            }
          ],
          analytics: {
            facebookPixel: {
              pixelId: 'FB_PIXEL_ID',
              events: ['ViewContent', 'Lead']
            }
          }
        },
        performance: {
          budget: {
            allocated: 1200,
            spent: 340,
            remaining: 860,
            currency: 'EUR'
          },
          metrics: {
            impressions: 25000,
            clicks: 850,
            ctr: 0.034,
            conversions: 18,
            conversionRate: 0.021,
            costPerClick: 0.40,
            costPerConversion: 18.89,
            roi: 2.8,
            revenue: 9500
          },
          channelPerformance: {
            facebook: {
              impressions: 18000,
              clicks: 620,
              conversions: 12,
              spend: 240,
              roi: 3.1
            },
            instagram: {
              impressions: 7000,
              clicks: 230,
              conversions: 6,
              spend: 100,
              roi: 2.3
            }
          },
          audienceInsights: {
            engagementRate: 0.045
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startedAt: new Date().toISOString()
      });

      this.marketingCampaigns.set(locationKey, campaigns);
    });
  }

  /**
   * Richtet Marketing-Automation ein
   */
  private setupMarketingAutomations(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const automations: LocalMarketingAutomation[] = [];

      // Lead Nurturing Automation
      automations.push({
        id: `automation_nurture_${locationKey}`,
        name: `Lead Nurturing ${region.city}`,
        locationKey,
        type: 'lead_nurturing',
        status: 'active',
        triggers: [
          {
            event: 'lead_created',
            conditions: ['score >= 50', 'location_within_25km'],
            delay: 30
          },
          {
            event: 'website_visit',
            conditions: ['visited_pricing_page', 'time_on_page > 120'],
            delay: 60
          }
        ],
        actions: [
          {
            type: 'send_email',
            config: {
              template: 'nurture_email_1',
              subject: `Solaranlagen Tipps für ${region.city}`
            },
            delay: 0
          },
          {
            type: 'wait',
            config: { duration: 3, unit: 'days' },
            delay: 3 * 24 * 60
          },
          {
            type: 'send_email',
            config: {
              template: 'nurture_email_2',
              subject: 'Förderungen für Solaranlagen 2024'
            },
            delay: 0
          },
          {
            type: 'add_tag',
            config: { tag: 'nurtured' },
            delay: 0
          }
        ],
        performance: {
          triggered: 45,
          executed: 42,
          conversions: 8,
          revenue: 24000
        },
        createdAt: new Date().toISOString(),
        lastTriggered: new Date().toISOString()
      });

      // Re-engagement Automation
      automations.push({
        id: `automation_reengage_${locationKey}`,
        name: `Re-engagement ${region.city}`,
        locationKey,
        type: 'reengagement',
        status: 'active',
        triggers: [
          {
            event: 'no_activity',
            conditions: ['last_activity > 30 days', 'status != won'],
            delay: 0
          }
        ],
        actions: [
          {
            type: 'send_email',
            config: {
              template: 'reengagement_email',
              subject: `Wir vermissen Sie! Solaranlagen in ${region.city}`
            },
            delay: 0
          },
          {
            type: 'wait',
            config: { duration: 7, unit: 'days' },
            delay: 7 * 24 * 60
          },
          {
            type: 'send_sms',
            config: {
              message: `Hallo! Haben Sie noch Fragen zu Solaranlagen in ${region.city}? Wir beraten Sie gerne.`
            },
            delay: 0
          },
          {
            type: 'add_tag',
            config: { tag: 'reengagement_attempted' },
            delay: 0
          }
        ],
        performance: {
          triggered: 23,
          executed: 20,
          conversions: 3,
          revenue: 9000
        },
        createdAt: new Date().toISOString(),
        lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      this.marketingAutomations.set(locationKey, automations);
    });
  }

  /**
   * Erstellt Event-Kampagnen
   */
  private createEventCampaigns(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const events: LocalEventCampaign[] = [];

      // Solar Info-Abend
      events.push({
        id: `event_info_evening_${locationKey}`,
        name: `Solar Info-Abend ${region.city}`,
        locationKey,
        eventType: 'community_event',
        eventDetails: {
          title: `Solar Info-Abend: Unabhängig von Strompreisen werden`,
          description: `Erfahren Sie alles über Solaranlagen in ${region.city}. Erfahrene Berater informieren über Förderungen, Technologien und Einsparungen.`,
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '18:30',
          duration: 120,
          location: {
            type: 'physical',
            address: `Musterstraße 123, ${region.zipCode} ${region.city}`,
            capacity: 50
          },
          targetAudience: ['Hausbesitzer', 'Interessierte', 'Bauherren'],
          expectedAttendees: 35
        },
        marketingStrategy: {
          preEvent: {
            timeline: [
              {
                daysBefore: 14,
                activities: ['Einladungen versenden', 'Social Media Posts'],
                channels: ['email', 'facebook', 'local_newsletter']
              },
              {
                daysBefore: 7,
                activities: ['Reminder versenden', 'Flyer verteilen'],
                channels: ['email', 'sms', 'local_partners']
              },
              {
                daysBefore: 1,
                activities: ['Final Reminder'],
                channels: ['email', 'sms']
              }
            ],
            content: {
              invitations: `Entdecken Sie die Möglichkeiten von Solaranlagen in ${region.city}!`,
              reminders: [
                `Noch 7 Tage bis zum Solar Info-Abend in ${region.city}`,
                `Morgen: Solar Info-Abend - Sichern Sie sich Ihren Platz!`
              ],
              teasers: [
                'Förderungen bis zu 7.500€',
                'Live-Beratung mit Experten',
                'Kostenlose Verpflegung'
              ]
            }
          },
          duringEvent: {
            engagement: ['Live-Präsentation', 'Q&A Session', 'Networking'],
            liveUpdates: true,
            qAndA: true
          },
          postEvent: {
            followUp: ['Danke-Email', 'Umfrage', 'Angebotsversand'],
            content: ['Event-Fotos', 'Präsentation als PDF', 'FAQ'],
            analysis: ['Teilnehmer-Feedback', 'Lead-Generierung', 'ROI-Analyse']
          }
        },
        promotion: {
          channels: ['email', 'social_media', 'local_partners', 'website'],
          budget: 800,
          timeline: ['2 Wochen vor Event', '1 Woche vor Event', 'Tag vor Event'],
          materials: ['Flyer', 'Social Media Posts', 'Email-Templates']
        },
        registration: {
          system: 'custom',
          formFields: ['name', 'email', 'phone', 'interests'],
          confirmation: 'Vielen Dank für Ihre Anmeldung! Wir freuen uns auf Sie.',
          reminders: ['1 Tag vorher', '2 Stunden vorher']
        },
        performance: {
          registrations: 28,
          attendees: 0, // Event noch nicht stattgefunden
          engagement: 0,
          leadsGenerated: 0,
          conversions: 0,
          roi: 0
        },
        status: 'promoting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      this.eventCampaigns.set(locationKey, events);
    });
  }

  /**
   * Generiert Marketing Intelligence
   */
  private generateMarketingIntelligence(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      const intelligence: LocalMarketingIntelligence = {
        locationKey,
        marketAnalysis: {
          competitorActivity: [
            {
              competitor: 'SolarTech GmbH',
              campaigns: 3,
              spend: 2500,
              reach: 15000
            },
            {
              competitor: 'GreenEnergy Berlin',
              campaigns: 2,
              spend: 1800,
              reach: 12000
            }
          ],
          seasonalTrends: [
            {
              season: 'Frühling',
              campaignType: 'email_nurturing',
              effectiveness: 0.85,
              recommendation: 'Fokussiere auf Lead-Nurturing im März-April'
            },
            {
              season: 'Sommer',
              campaignType: 'event_based',
              effectiveness: 0.92,
              recommendation: 'Plane Outdoor-Events für Juni-August'
            }
          ],
          audiencePreferences: {
            preferredChannels: ['email', 'facebook', 'website'],
            bestTimes: {
              monday: ['10:00', '14:00'],
              tuesday: ['11:00', '15:00'],
              wednesday: ['10:00', '14:00'],
              thursday: ['11:00', '16:00'],
              friday: ['09:00', '13:00']
            },
            contentTypes: ['educational', 'testimonial', 'case_study'],
            priceSensitivity: 0.7
          },
          localEvents: [
            {
              event: 'Umweltmesse Berlin',
              date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              expectedImpact: 0.8,
              marketingOpportunity: 'Stand buchen und Solar-Präsentation'
            }
          ]
        },
        campaignInsights: {
          topPerforming: {
            campaignId: 'campaign_email_berlin',
            name: 'Email Solar Beratung',
            roi: 3.2,
            reason: 'Hohe Lead-Qualität und Conversion-Rate'
          },
          underPerforming: {
            campaignId: 'campaign_social_berlin',
            name: 'Social Media Solar',
            roi: 1.8,
            issues: ['Zu breite Zielgruppensegmentierung', 'Geringe Engagement-Rate'],
            recommendations: [
              'Zielgruppensegmente verfeinern',
              'Content optimieren für höheres Engagement',
              'Budget umschichten zu besser performenden Kanälen'
            ]
          },
          channelEffectiveness: {
            email: {
              reach: 10000,
              engagement: 0.15,
              conversion: 0.08,
              costEfficiency: 0.85
            },
            facebook: {
              reach: 25000,
              engagement: 0.045,
              conversion: 0.021,
              costEfficiency: 0.65
            },
            google_ads: {
              reach: 15000,
              engagement: 0.08,
              conversion: 0.035,
              costEfficiency: 0.75
            }
          },
          audienceSegments: [
            {
              segment: 'High-Value Homeowners',
              size: 2500,
              engagement: 0.18,
              value: 25000,
              recommendedActions: ['Premium Email-Kampagnen', 'Persönliche Beratung']
            },
            {
              segment: 'Price Sensitive',
              size: 1800,
              engagement: 0.12,
              value: 15000,
              recommendedActions: ['Förderung hervorheben', 'Flexible Finanzierung']
            }
          ]
        },
        predictiveAnalytics: {
          nextBestCampaign: {
            type: 'local_event',
            timing: 'next_month',
            expectedROI: 4.2,
            confidence: 0.78
          },
          seasonalOpportunities: [
            {
              opportunity: 'Sommer Solar Aktion',
              timing: 'Mai-Juni',
              potential: 0.85,
              strategy: 'Outdoor Events und Social Media Kampagnen'
            },
            {
              opportunity: 'Winter Heizungsersatz',
              timing: 'November-Dezember',
              potential: 0.65,
              strategy: 'Email-Nurturing mit Heizungsvergleich'
            }
          ],
          budgetOptimization: {
            recommendedSpend: {
              email: 800,
              facebook: 600,
              google_ads: 400,
              events: 1000
            },
            expectedOutcomes: {
              reach: 45000,
              conversions: 85,
              revenue: 125000
            }
          }
        },
        recommendations: [
          {
            priority: 'high',
            category: 'budget',
            recommendation: 'Erhöhe Email-Marketing Budget um 30%',
            expectedImpact: 0.25,
            implementationEffort: 'low'
          },
          {
            priority: 'high',
            category: 'timing',
            category: 'timing',
            recommendation: 'Plane Sommer-Event-Kampagne für Juni',
            expectedImpact: 0.35,
            implementationEffort: 'medium'
          },
          {
            priority: 'medium',
            category: 'content',
            recommendation: 'Erstelle mehr Video-Content für Social Media',
            expectedImpact: 0.15,
            implementationEffort: 'high'
          },
          {
            priority: 'medium',
            category: 'channels',
            recommendation: 'Teste LinkedIn für B2B-Leads',
            expectedImpact: 0.20,
            implementationEffort: 'medium'
          },
          {
            priority: 'low',
            category: 'audience',
            recommendation: 'Erweitere Zielgruppensegmente um Nachbargemeinden',
            expectedImpact: 0.10,
            implementationEffort: 'low'
          }
        ],
        lastUpdated: new Date().toISOString()
      };

      this.marketingIntelligence.set(locationKey, intelligence);
    });
  }

  /**
   * Erstellt neue Marketing-Kampagne
   */
  public createMarketingCampaign(
    locationKey: string,
    campaignData: Partial<LocalMarketingCampaign>
  ): LocalMarketingCampaign {
    const campaignId = `campaign_${Date.now()}`;

    const campaign: LocalMarketingCampaign = {
      id: campaignId,
      name: campaignData.name || 'Neue Kampagne',
      locationKey,
      campaignType: campaignData.campaignType || 'email',
      status: 'draft',
      targetAudience: campaignData.targetAudience || {
        segments: [],
        totalReach: 0,
        estimatedConversion: 0
      },
      content: campaignData.content || {
        body: '',
        callToAction: {
          text: 'Mehr erfahren',
          url: '#',
          type: 'primary'
        },
        media: [],
        personalization: {
          dynamicFields: [],
          conditionalContent: [],
          localCustomization: false
        }
      },
      channels: campaignData.channels || [],
      automation: campaignData.automation || {
        triggers: [],
        workflows: [],
        smartScheduling: {
          enabled: false,
          optimalTimes: {},
          timezone: 'Europe/Berlin'
        }
      },
      tracking: campaignData.tracking || {
        utmParameters: {
          source: 'campaign',
          medium: 'marketing',
          campaign: campaignId
        },
        conversionGoals: [],
        analytics: {}
      },
      performance: campaignData.performance || {
        budget: {
          allocated: 0,
          spent: 0,
          remaining: 0,
          currency: 'EUR'
        },
        metrics: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          conversionRate: 0,
          costPerClick: 0,
          costPerConversion: 0,
          roi: 0,
          revenue: 0
        },
        channelPerformance: {},
        audienceInsights: {
          engagementRate: 0
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Speichere Kampagne
    const locationCampaigns = this.marketingCampaigns.get(locationKey) || [];
    locationCampaigns.push(campaign);
    this.marketingCampaigns.set(locationKey, locationCampaigns);

    return campaign;
  }

  /**
   * Startet Marketing-Kampagne
   */
  public startMarketingCampaign(campaignId: string, locationKey: string): boolean {
    const campaigns = this.marketingCampaigns.get(locationKey) || [];
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign || campaign.status !== 'draft') return false;

    campaign.status = 'active';
    campaign.startedAt = new Date().toISOString();
    campaign.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Pausiert Marketing-Kampagne
   */
  public pauseMarketingCampaign(campaignId: string, locationKey: string): boolean {
    const campaigns = this.marketingCampaigns.get(locationKey) || [];
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign || campaign.status !== 'active') return false;

    campaign.status = 'paused';
    campaign.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Führt A/B-Test für Kampagne durch
   */
  public createCampaignABTest(
    campaignId: string,
    locationKey: string,
    testConfig: {
      variants: Array<{
        name: string;
        content: any;
        weight: number;
      }>;
      targetMetric: string;
      duration: number;
    }
  ): boolean {
    const campaigns = this.marketingCampaigns.get(locationKey) || [];
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign) return false;

    campaign.abTesting = {
      enabled: true,
      variants: testConfig.variants.map((variant, index) => ({
        id: `variant_${index}`,
        name: variant.name,
        content: variant.content,
        weight: variant.weight,
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          conversionRate: 0
        }
      })),
      winner: undefined,
      confidence: 0,
      testDuration: testConfig.duration
    };

    campaign.updatedAt = new Date().toISOString();

    return true;
  }

  /**
   * Optimiert Kampagnen-Budget
   */
  public optimizeCampaignBudget(locationKey: string): {
    recommendations: Array<{
      campaignId: string;
      currentBudget: number;
      recommendedBudget: number;
      expectedROI: number;
      reason: string;
    }>;
    totalBudgetImpact: number;
    expectedRevenueIncrease: number;
  } {
    const campaigns = this.marketingCampaigns.get(locationKey) || [];
    const intelligence = this.marketingIntelligence.get(locationKey);

    const recommendations = campaigns
      .filter(c => c.status === 'active')
      .map(campaign => {
        const currentROI = campaign.performance.metrics.roi;
        const budget = campaign.performance.budget.allocated;

        let recommendedBudget = budget;
        let expectedROI = currentROI;
        let reason = '';

        if (currentROI > 3.0) {
          // Hoch performende Kampagne - Budget erhöhen
          recommendedBudget = budget * 1.5;
          expectedROI = currentROI * 0.9; // Leichter ROI-Rückgang bei Skalierung
          reason = 'Hoch performende Kampagne - Budget erhöhen für mehr Reichweite';
        } else if (currentROI < 1.5) {
          // Schlecht performende Kampagne - Budget reduzieren
          recommendedBudget = budget * 0.7;
          expectedROI = currentROI * 1.1; // ROI-Verbesserung bei Fokus
          reason = 'Unterperformende Kampagne - Budget reduzieren und optimieren';
        } else {
          // Mittel performende Kampagne - Budget beibehalten
          reason = 'Stabile Performance - Budget beibehalten';
        }

        return {
          campaignId: campaign.id,
          currentBudget: budget,
          recommendedBudget,
          expectedROI,
          reason
        };
      });

    const totalBudgetImpact = recommendations.reduce((sum, rec) => sum + (rec.recommendedBudget - rec.currentBudget), 0);
    const expectedRevenueIncrease = recommendations.reduce((sum, rec) => {
      const budgetIncrease = rec.recommendedBudget - rec.currentBudget;
      return sum + (budgetIncrease * rec.expectedROI);
    }, 0);

    return {
      recommendations,
      totalBudgetImpact,
      expectedRevenueIncrease
    };
  }

  /**
   * Ruft Marketing-Kampagnen ab
   */
  public getMarketingCampaigns(locationKey: string, filters?: {
    status?: string;
    type?: string;
    dateRange?: { start: string; end: string };
  }): LocalMarketingCampaign[] {
    let campaigns = this.marketingCampaigns.get(locationKey) || [];

    if (filters) {
      campaigns = campaigns.filter(campaign => {
        if (filters.status && campaign.status !== filters.status) return false;
        if (filters.type && campaign.campaignType !== filters.type) return false;
        if (filters.dateRange) {
          const campaignDate = new Date(campaign.createdAt);
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          if (campaignDate < startDate || campaignDate > endDate) return false;
        }
        return true;
      });
    }

    return campaigns;
  }

  /**
   * Ruft Marketing-Automation ab
   */
  public getMarketingAutomations(locationKey: string): LocalMarketingAutomation[] {
    return this.marketingAutomations.get(locationKey) || [];
  }

  /**
   * Ruft Event-Kampagnen ab
   */
  public getEventCampaigns(locationKey: string): LocalEventCampaign[] {
    return this.eventCampaigns.get(locationKey) || [];
  }

  /**
   * Ruft Marketing Intelligence ab
   */
  public getMarketingIntelligence(locationKey: string): LocalMarketingIntelligence | null {
    return this.marketingIntelligence.get(locationKey) || null;
  }

  /**
   * Generiert Kampagnen-Performance-Report
   */
  public generateCampaignPerformanceReport(
    locationKey: string,
    dateRange: { start: string; end: string }
  ): {
    overview: {
      totalCampaigns: number;
      activeCampaigns: number;
      totalBudget: number;
      totalSpent: number;
      totalRevenue: number;
      avgROI: number;
    };
    topPerformers: Array<{
      campaignId: string;
      name: string;
      roi: number;
      revenue: number;
      spent: number;
    }>;
    channelPerformance: { [channel: string]: {
      campaigns: number;
      totalSpent: number;
      totalRevenue: number;
      avgROI: number;
    }};
    trends: Array<{
      period: string;
      campaigns: number;
      revenue: number;
      roi: number;
    }>;
    recommendations: string[];
  } {
    const campaigns = this.getMarketingCampaigns(locationKey, { dateRange });

    const overview = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalBudget: campaigns.reduce((sum, c) => sum + c.performance.budget.allocated, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + c.performance.budget.spent, 0),
      totalRevenue: campaigns.reduce((sum, c) => sum + c.performance.metrics.revenue, 0),
      avgROI: campaigns.length > 0 ?
        campaigns.reduce((sum, c) => sum + c.performance.metrics.roi, 0) / campaigns.length : 0
    };

    const topPerformers = campaigns
      .sort((a, b) => b.performance.metrics.roi - a.performance.metrics.roi)
      .slice(0, 5)
      .map(c => ({
        campaignId: c.id,
        name: c.name,
        roi: c.performance.metrics.roi,
        revenue: c.performance.metrics.revenue,
        spent: c.performance.budget.spent
      }));

    // Channel Performance aggregieren
    const channelPerformance: { [channel: string]: any } = {};
    campaigns.forEach(campaign => {
      campaign.channels.forEach(channel => {
        if (!channelPerformance[channel.platform]) {
          channelPerformance[channel.platform] = {
            campaigns: 0,
            totalSpent: 0,
            totalRevenue: 0,
            avgROI: 0
          };
        }
        channelPerformance[channel.platform].campaigns++;
        channelPerformance[channel.platform].totalSpent += campaign.performance.budget.spent;
        channelPerformance[channel.platform].totalRevenue += campaign.performance.metrics.revenue;
      });
    });

    // ROI für jeden Channel berechnen
    Object.keys(channelPerformance).forEach(channel => {
      const perf = channelPerformance[channel];
      perf.avgROI = perf.totalSpent > 0 ? perf.totalRevenue / perf.totalSpent : 0;
    });

    // Trends (vereinfacht - würde normalerweise historische Daten verwenden)
    const trends = [
      {
        period: 'Letzte 30 Tage',
        campaigns: campaigns.length,
        revenue: overview.totalRevenue,
        roi: overview.avgROI
      }
    ];

    const recommendations = [
      'Fokussiere Budget auf Top-performing Kanäle',
      'Pausiere unterperformende Kampagnen',
      'Erhöhe Budget für Kampagnen mit ROI > 3.0',
      'Teste neue Kanäle mit kleinen Budgets',
      'Optimiere Kampagnen-Timing basierend auf Performance-Daten'
    ];

    return {
      overview,
      topPerformers,
      channelPerformance,
      trends,
      recommendations
    };
  }

  /**
   * Dashboard-Übersicht für alle Standorte
   */
  public getGlobalMarketingDashboard(): {
    totalCampaigns: number;
    totalBudget: number;
    totalRevenue: number;
    avgROI: number;
    topPerformingLocations: Array<{
      location: string;
      campaigns: number;
      revenue: number;
      roi: number;
    }>;
    channelOverview: { [channel: string]: {
      campaigns: number;
      spend: number;
      revenue: number;
      roi: number;
    }};
    campaignTypePerformance: { [type: string]: {
      campaigns: number;
      avgROI: number;
      totalRevenue: number;
    }};
    recommendations: string[];
  } {
    const allCampaigns = Array.from(this.marketingCampaigns.values()).flat();

    const totalCampaigns = allCampaigns.length;
    const totalBudget = allCampaigns.reduce((sum, c) => sum + c.performance.budget.allocated, 0);
    const totalRevenue = allCampaigns.reduce((sum, c) => sum + c.performance.metrics.revenue, 0);
    const avgROI = totalBudget > 0 ? totalRevenue / totalBudget : 0;

    // Top performing Locations
    const locationPerformance = PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      const campaigns = this.getMarketingCampaigns(locationKey);
      const revenue = campaigns.reduce((sum, c) => sum + c.performance.metrics.revenue, 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + c.performance.budget.spent, 0);
      const roi = totalSpent > 0 ? revenue / totalSpent : 0;

      return {
        location: locationKey,
        campaigns: campaigns.length,
        revenue,
        roi
      };
    }).sort((a, b) => b.roi - a.roi);

    // Channel Overview
    const channelOverview: { [channel: string]: any } = {};
    allCampaigns.forEach(campaign => {
      campaign.channels.forEach(channel => {
        if (!channelOverview[channel.platform]) {
          channelOverview[channel.platform] = {
            campaigns: 0,
            spend: 0,
            revenue: 0,
            roi: 0
          };
        }
        channelOverview[channel.platform].campaigns++;
        channelOverview[channel.platform].spend += campaign.performance.budget.spent;
        channelOverview[channel.platform].revenue += campaign.performance.metrics.revenue;
      });
    });

    // ROI berechnen
    Object.keys(channelOverview).forEach(channel => {
      const overview = channelOverview[channel];
      overview.roi = overview.spend > 0 ? overview.revenue / overview.spend : 0;
    });

    // Campaign Type Performance
    const campaignTypePerformance: { [type: string]: any } = {};
    allCampaigns.forEach(campaign => {
      const type = campaign.campaignType;
      if (!campaignTypePerformance[type]) {
        campaignTypePerformance[type] = {
          campaigns: 0,
          avgROI: 0,
          totalRevenue: 0
        };
      }
      campaignTypePerformance[type].campaigns++;
      campaignTypePerformance[type].totalRevenue += campaign.performance.metrics.revenue;
    });

    // Durchschnittlichen ROI berechnen
    Object.keys(campaignTypePerformance).forEach(type => {
      const campaignsOfType = allCampaigns.filter(c => c.campaignType === type);
      const avgROI = campaignsOfType.reduce((sum, c) => sum + c.performance.metrics.roi, 0) / campaignsOfType.length;
      campaignTypePerformance[type].avgROI = avgROI;
    });

    const recommendations = [
      'Erhöhe Budget für Email-Marketing (höchster ROI)',
      'Teste mehr Multi-Channel-Kampagnen',
      'Optimiere Social Media Targeting',
      'Implementiere mehr A/B-Tests',
      'Fokussiere auf lokale Events für Lead-Generierung'
    ];

    return {
      totalCampaigns,
      totalBudget,
      totalRevenue,
      avgROI,
      topPerformingLocations: locationPerformance.slice(0, 5),
      channelOverview,
      campaignTypePerformance,
      recommendations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const marketingAutomationIntegrationService = new MarketingAutomationIntegrationService();