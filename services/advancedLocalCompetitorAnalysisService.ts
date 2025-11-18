import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { predictiveLocalSearchTrendsService } from './predictiveLocalSearchTrendsService';

export interface CompetitorProfile {
  id: string;
  name: string;
  locationKey: string;
  businessType: 'solar_installer' | 'energy_provider' | 'construction' | 'retail' | 'other';
  companySize: 'local' | 'regional' | 'national' | 'international';
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  founded: number;
  revenue: {
    estimated: number;
    growth: number;
    source: string;
  };
  contact: {
    website: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
  };
  socialPresence: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    followers: {
      facebook: number;
      instagram: number;
      linkedin: number;
      youtube: number;
    };
  };
  certifications: string[];
  specializations: string[];
  serviceArea: string[];
  lastUpdated: string;
}

export interface CompetitorSEOAnalysis {
  competitorId: string;
  locationKey: string;
  domainAuthority: number;
  backlinkProfile: {
    totalBacklinks: number;
    uniqueDomains: number;
    avgDomainAuthority: number;
    toxicBacklinks: number;
    topBacklinks: Array<{
      url: string;
      domain: string;
      da: number;
      type: 'follow' | 'nofollow';
    }>;
  };
  keywordProfile: {
    totalKeywords: number;
    rankingKeywords: number;
    topKeywords: Array<{
      keyword: string;
      position: number;
      searchVolume: number;
      competition: string;
      trend: 'up' | 'down' | 'stable';
    }>;
    keywordGaps: string[];
    keywordOpportunities: Array<{
      keyword: string;
      potential: number;
      difficulty: 'low' | 'medium' | 'high';
    }>;
  };
  localSEO: {
    gmbProfile: {
      exists: boolean;
      rating: number;
      reviewCount: number;
      responseRate: number;
      topKeywords: string[];
      posts: number;
      photos: number;
    };
    localPackRankings: Array<{
      keyword: string;
      position: number;
      packPosition: number;
    }>;
    citationProfile: {
      totalCitations: number;
      uniqueCitations: number;
      citationScore: number;
      missingCitations: string[];
    };
  };
  contentAnalysis: {
    totalPages: number;
    blogPosts: number;
    servicePages: number;
    contentQuality: 'poor' | 'average' | 'good' | 'excellent';
    contentGaps: string[];
    topContent: Array<{
      url: string;
      title: string;
      performance: number;
      topic: string;
    }>;
  };
  technicalSEO: {
    coreWebVitals: number;
    mobileFriendly: boolean;
    pageSpeed: number;
    schemaMarkup: boolean;
    sslCertificate: boolean;
    indexStatus: number;
  };
}

export interface CompetitorPricingAnalysis {
  competitorId: string;
  locationKey: string;
  priceStrategy: 'premium' | 'value' | 'discount' | 'dynamic';
  servicePricing: {
    solarInstallation: {
      perKw: number;
      range: { min: number; max: number };
      avgProject: number;
    };
    maintenance: {
      annual: number;
      perVisit: number;
    };
    consulting: {
      initial: number;
      followUp: number;
    };
  };
  financingOptions: Array<{
    type: 'cash' | 'loan' | 'lease' | 'ppa';
    interestRate?: number;
    term?: number;
    description: string;
  }>;
  promotions: Array<{
    name: string;
    discount: number;
    conditions: string;
    validUntil: string;
  }>;
  priceComparison: {
    vsMarket: number; // -1 to 1, negative = cheaper
    vsZoeSolar: number;
    competitiveness: 'low' | 'medium' | 'high';
  };
  lastUpdated: string;
}

export interface CompetitorStrategyAnalysis {
  competitorId: string;
  locationKey: string;
  overallStrategy: 'aggressive_growth' | 'market_defense' | 'niche_focus' | 'cost_leadership' | 'innovation';
  marketingStrategy: {
    channels: string[];
    budget: {
      estimated: number;
      allocation: { [channel: string]: number };
    };
    messaging: string[];
    targetAudience: string[];
    brandPositioning: string;
  };
  salesStrategy: {
    approach: 'direct' | 'channel' | 'partnership' | 'online_first';
    salesCycle: number;
    conversionRate: number;
    customerRetention: number;
  };
  productStrategy: {
    offerings: string[];
    innovations: string[];
    partnerships: string[];
    roadmap: Array<{
      feature: string;
      timeline: string;
      impact: string;
    }>;
  };
  operationalStrategy: {
    locations: number;
    serviceRadius: number;
    capacity: number;
    efficiency: number;
  };
  competitiveAdvantages: string[];
  vulnerabilities: string[];
  predictedMoves: Array<{
    action: string;
    probability: number;
    impact: string;
    timeframe: string;
  }>;
}

export interface CompetitorThreatAssessment {
  competitorId: string;
  locationKey: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatCategories: {
    marketShare: {
      current: number;
      projected: number;
      growth: number;
    };
    customerOverlap: number;
    priceCompetition: number;
    serviceOverlap: number;
    geographicOverlap: number;
  };
  riskFactors: Array<{
    factor: string;
    impact: number;
    probability: number;
    mitigation: string[];
  }>;
  opportunityFactors: Array<{
    factor: string;
      impact: number;
      probability: number;
      exploitation: string[];
    }>;
  strategicResponse: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  monitoringPriority: 'low' | 'medium' | 'high';
}

export interface CompetitorIntelligenceReport {
  locationKey: string;
  generatedAt: string;
  executiveSummary: {
    totalCompetitors: number;
    marketConcentration: number;
    competitivePressure: 'low' | 'medium' | 'high' | 'intense';
    keyThreats: string[];
    opportunities: string[];
    recommendations: string[];
  };
  competitorLandscape: {
    marketLeaders: CompetitorProfile[];
    emergingThreats: CompetitorProfile[];
    nichePlayers: CompetitorProfile[];
    potentialEntrants: Array<{
      name: string;
      probability: number;
      impact: string;
    }>;
  };
  competitiveAnalysis: {
    strengthsVsCompetition: string[];
    weaknessesVsCompetition: string[];
    uniqueValueProposition: string;
    positioningStrategy: string;
  };
  strategicInsights: Array<{
    insight: string;
    category: 'opportunity' | 'threat' | 'trend' | 'gap';
    impact: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    actions: string[];
  }>;
  actionPlan: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
    responsible: string;
    resources: string[];
    kpis: string[];
  }>;
}

/**
 * Advanced Local Competitor Analysis Service
 * Fortschrittliche Wettbewerbsanalyse für lokale Märkte
 */
export class AdvancedLocalCompetitorAnalysisService {
  private competitorProfiles: Map<string, CompetitorProfile[]> = new Map();
  private competitorSEOAnalyses: Map<string, CompetitorSEOAnalysis[]> = new Map();
  private competitorPricingAnalyses: Map<string, CompetitorPricingAnalysis[]> = new Map();
  private competitorStrategyAnalyses: Map<string, CompetitorStrategyAnalysis[]> = new Map();
  private competitorThreatAssessments: Map<string, CompetitorThreatAssessment[]> = new Map();
  private intelligenceReports: Map<string, CompetitorIntelligenceReport> = new Map();

  constructor() {
    this.initializeCompetitorProfiles();
    this.initializeCompetitorAnalyses();
  }

  /**
   * Initialisiert Wettbewerber-Profile
   */
  private initializeCompetitorProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const competitors: CompetitorProfile[] = [];

      // Simuliere realistische Wettbewerber für jede Region
      const competitorTemplates = [
        {
          name: `${region.city} Solar GmbH`,
          businessType: 'solar_installer' as const,
          companySize: 'regional' as const,
          marketPosition: 'leader' as const,
          founded: 2015,
          revenue: { estimated: 8500000, growth: 0.15, source: 'estimated' },
          contact: {
            website: `https://www.${region.city.toLowerCase()}solar.de`,
            phone: '+49 30 1234567',
            email: `info@${region.city.toLowerCase()}solar.de`,
            address: {
              street: 'Hauptstraße 123',
              city: region.city,
              zipCode: region.zipCode || '10115',
              country: 'Germany'
            }
          },
          socialPresence: {
            facebook: `https://facebook.com/${region.city.toLowerCase()}solar`,
            instagram: `@${region.city.toLowerCase()}solar`,
            linkedin: `https://linkedin.com/company/${region.city.toLowerCase()}solar`,
            youtube: `https://youtube.com/@${region.city.toLowerCase()}solar`,
            followers: {
              facebook: 2500,
              instagram: 1800,
              linkedin: 450,
              youtube: 320
            }
          },
          certifications: ['TÜV', 'SolarKeymark', 'ISO 9001'],
          specializations: ['Photovoltaik', 'Solarthermie', 'Energiespeicher'],
          serviceArea: [region.city, region.state]
        },
        {
          name: `GreenEnergy ${region.city}`,
          businessType: 'energy_provider' as const,
          companySize: 'national' as const,
          marketPosition: 'challenger' as const,
          founded: 2010,
          revenue: { estimated: 25000000, growth: 0.08, source: 'public_data' },
          contact: {
            website: `https://www.greenenergy${region.city.toLowerCase()}.de`,
            phone: '+49 30 9876543',
            email: `kontakt@greenenergy${region.city.toLowerCase()}.de`,
            address: {
              street: 'Energieallee 45',
              city: region.city,
              zipCode: region.zipCode || '10115',
              country: 'Germany'
            }
          },
          socialPresence: {
            facebook: `https://facebook.com/greenenergy${region.city.toLowerCase()}`,
            instagram: `@greenenergy${region.city.toLowerCase()}`,
            linkedin: `https://linkedin.com/company/greenenergy-${region.city.toLowerCase()}`,
            youtube: `https://youtube.com/@greenenergy${region.city.toLowerCase()}`,
            followers: {
              facebook: 8500,
              instagram: 6200,
              linkedin: 1200,
              youtube: 980
            }
          },
          certifications: ['TÜV', 'SolarKeymark', 'ISO 14001', 'ISO 50001'],
          specializations: ['Erneuerbare Energien', 'E-Mobility', 'Energiemanagement'],
          serviceArea: [region.city, region.state, 'Bundesweit']
        },
        {
          name: `SolarPro ${region.city}`,
          businessType: 'solar_installer' as const,
          companySize: 'local' as const,
          marketPosition: 'follower' as const,
          founded: 2018,
          revenue: { estimated: 1200000, growth: 0.25, source: 'estimated' },
          contact: {
            website: `https://www.solarpro${region.city.toLowerCase()}.de`,
            phone: '+49 30 5554444',
            email: `info@solarpro${region.city.toLowerCase()}.de`,
            address: {
              street: 'Technikstraße 78',
              city: region.city,
              zipCode: region.zipCode || '10115',
              country: 'Germany'
            }
          },
          socialPresence: {
            facebook: `https://facebook.com/solarpro${region.city.toLowerCase()}`,
            instagram: `@solarpro${region.city.toLowerCase()}`,
            linkedin: `https://linkedin.com/company/solarpro-${region.city.toLowerCase()}`,
            youtube: '',
            followers: {
              facebook: 850,
              instagram: 620,
              linkedin: 120,
              youtube: 0
            }
          },
          certifications: ['TÜV', 'SolarKeymark'],
          specializations: ['Photovoltaik', 'Dachsanierung'],
          serviceArea: [region.city]
        }
      ];

      competitorTemplates.forEach((template, index) => {
        const competitor: CompetitorProfile = {
          id: `competitor_${locationKey}_${index + 1}`,
          locationKey,
          ...template,
          lastUpdated: new Date().toISOString()
        };
        competitors.push(competitor);
      });

      this.competitorProfiles.set(locationKey, competitors);
    });
  }

  /**
   * Initialisiert Wettbewerber-Analysen
   */
  private initializeCompetitorAnalyses(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const competitors = this.competitorProfiles.get(locationKey) || [];

      const seoAnalyses: CompetitorSEOAnalysis[] = [];
      const pricingAnalyses: CompetitorPricingAnalysis[] = [];
      const strategyAnalyses: CompetitorStrategyAnalysis[] = [];
      const threatAssessments: CompetitorThreatAssessment[] = [];

      competitors.forEach(competitor => {
        // SEO-Analyse
        const seoAnalysis: CompetitorSEOAnalysis = {
          competitorId: competitor.id,
          locationKey,
          domainAuthority: 45 + Math.random() * 30,
          backlinkProfile: {
            totalBacklinks: Math.floor(500 + Math.random() * 2000),
            uniqueDomains: Math.floor(50 + Math.random() * 200),
            avgDomainAuthority: 35 + Math.random() * 25,
            toxicBacklinks: Math.floor(Math.random() * 20),
            topBacklinks: [
              {
                url: 'https://example.com/solar-guide',
                domain: 'example.com',
                da: 65,
                type: 'follow'
              },
              {
                url: 'https://industry-site.de/photovoltaik',
                domain: 'industry-site.de',
                da: 55,
                type: 'follow'
              }
            ]
          },
          keywordProfile: {
            totalKeywords: Math.floor(200 + Math.random() * 800),
            rankingKeywords: Math.floor(150 + Math.random() * 600),
            topKeywords: [
              {
                keyword: `solaranlage ${region.city}`,
                position: Math.floor(1 + Math.random() * 10),
                searchVolume: 1200,
                competition: 'high',
                trend: 'up'
              },
              {
                keyword: `photovoltaik ${region.city}`,
                position: Math.floor(1 + Math.random() * 8),
                searchVolume: 800,
                competition: 'medium',
                trend: 'stable'
              }
            ],
            keywordGaps: ['solaranlage nachhaltigkeit', 'photovoltaik zukunft'],
            keywordOpportunities: [
              {
                keyword: `solaranlage ${region.city} 2024`,
                potential: 0.8,
                difficulty: 'medium'
              }
            ]
          },
          localSEO: {
            gmbProfile: {
              exists: true,
              rating: 4.2 + Math.random() * 0.8,
              reviewCount: Math.floor(50 + Math.random() * 200),
              responseRate: 0.85 + Math.random() * 0.15,
              topKeywords: [`solar ${region.city}`, `photovoltaik ${region.city}`],
              posts: Math.floor(10 + Math.random() * 50),
              photos: Math.floor(20 + Math.random() * 100)
            },
            localPackRankings: [
              {
                keyword: `solaranlage ${region.city}`,
                position: Math.floor(1 + Math.random() * 3),
                packPosition: Math.floor(1 + Math.random() * 3)
              }
            ],
            citationProfile: {
              totalCitations: Math.floor(20 + Math.random() * 50),
              uniqueCitations: Math.floor(15 + Math.random() * 40),
              citationScore: 75 + Math.random() * 20,
              missingCitations: ['yelp.de', 'golocal.de']
            }
          },
          contentAnalysis: {
            totalPages: Math.floor(50 + Math.random() * 200),
            blogPosts: Math.floor(10 + Math.random() * 50),
            servicePages: Math.floor(15 + Math.random() * 30),
            contentQuality: 'good',
            contentGaps: ['case studies', 'video content'],
            topContent: [
              {
                url: '/solar-guide',
                title: `Solaranlagen Guide ${region.city}`,
                performance: 0.85,
                topic: 'Solar Installation'
              }
            ]
          },
          technicalSEO: {
            coreWebVitals: 75 + Math.random() * 20,
            mobileFriendly: Math.random() > 0.2,
            pageSpeed: 2.0 + Math.random() * 1.5,
            schemaMarkup: Math.random() > 0.3,
            sslCertificate: true,
            indexStatus: 95 + Math.random() * 5
          }
        };
        seoAnalyses.push(seoAnalysis);

        // Preisanalyse
        const pricingAnalysis: CompetitorPricingAnalysis = {
          competitorId: competitor.id,
          locationKey,
          priceStrategy: competitor.marketPosition === 'leader' ? 'premium' :
                        competitor.marketPosition === 'challenger' ? 'value' : 'discount',
          servicePricing: {
            solarInstallation: {
              perKw: 1200 + Math.random() * 800,
              range: {
                min: 1000 + Math.random() * 400,
                max: 1800 + Math.random() * 600
              },
              avgProject: 15000 + Math.random() * 20000
            },
            maintenance: {
              annual: 300 + Math.random() * 400,
              perVisit: 80 + Math.random() * 70
            },
            consulting: {
              initial: 0,
              followUp: 50 + Math.random() * 100
            }
          },
          financingOptions: [
            {
              type: 'cash',
              description: 'Barzahlung mit 3% Rabatt'
            },
            {
              type: 'loan',
              interestRate: 0.045 + Math.random() * 0.02,
              term: 10 + Math.floor(Math.random() * 15),
              description: 'Finanzierung mit günstigen Konditionen'
            }
          ],
          promotions: [
            {
              name: 'Sommeraktion 2024',
              discount: 0.05 + Math.random() * 0.1,
              conditions: 'Bei Installation bis September',
              validUntil: '2024-09-30'
            }
          ],
          priceComparison: {
            vsMarket: -0.1 + Math.random() * 0.2,
            vsZoeSolar: -0.05 + Math.random() * 0.15,
            competitiveness: 'medium'
          },
          lastUpdated: new Date().toISOString()
        };
        pricingAnalyses.push(pricingAnalysis);

        // Strategieanalyse
        const strategyAnalysis: CompetitorStrategyAnalysis = {
          competitorId: competitor.id,
          locationKey,
          overallStrategy: competitor.marketPosition === 'leader' ? 'market_defense' :
                          competitor.marketPosition === 'challenger' ? 'aggressive_growth' :
                          'cost_leadership',
          marketingStrategy: {
            channels: ['google_ads', 'facebook', 'local_seo', 'content_marketing'],
            budget: {
              estimated: competitor.revenue.estimated * 0.08,
              allocation: {
                google_ads: 0.4,
                facebook: 0.25,
                local_seo: 0.2,
                content_marketing: 0.15
              }
            },
            messaging: ['Qualität', 'Zuverlässigkeit', 'Lokale Expertise'],
            targetAudience: ['Hausbesitzer', 'Unternehmen', 'Kommunen'],
            brandPositioning: competitor.marketPosition === 'leader' ? 'Premium-Anbieter' :
                             competitor.marketPosition === 'challenger' ? 'Innovativer Marktführer' :
                             'Preiswerter Qualitätsanbieter'
          },
          salesStrategy: {
            approach: 'direct',
            salesCycle: 25 + Math.floor(Math.random() * 20),
            conversionRate: 0.08 + Math.random() * 0.06,
            customerRetention: 0.85 + Math.random() * 0.1
          },
          productStrategy: {
            offerings: ['Solaranlagen', 'Energiespeicher', 'Wärmepumpen'],
            innovations: ['Neue Batterietechnologie', 'Smart Home Integration'],
            partnerships: ['E.ON', 'RWE', 'Lokale Handwerker'],
            roadmap: [
              {
                feature: 'Solar + E-Mobility Paket',
                timeline: 'Q2 2024',
                impact: 'Neue Umsatzquelle'
              }
            ]
          },
          operationalStrategy: {
            locations: competitor.companySize === 'local' ? 1 :
                      competitor.companySize === 'regional' ? 3 + Math.floor(Math.random() * 5) :
                      10 + Math.floor(Math.random() * 20),
            serviceRadius: competitor.companySize === 'local' ? 50 :
                          competitor.companySize === 'regional' ? 150 : 500,
            capacity: 50 + Math.floor(Math.random() * 200),
            efficiency: 0.8 + Math.random() * 0.15
          },
          competitiveAdvantages: [
            'Lokale Marktkenntnis',
            'Etwasierte Kundenbeziehungen',
            'Schneller Service'
          ],
          vulnerabilities: [
            'Begrenzte Ressourcen',
            'Weniger Technologie-Investitionen',
            'Kleinere Marketing-Budgets'
          ],
          predictedMoves: [
            {
              action: 'Preissenkung für Großkunden',
              probability: 0.7,
              impact: 'Preisdruck erhöhen',
              timeframe: '3 Monate'
            },
            {
              action: 'Partnerschaft mit Energieversorger',
              probability: 0.5,
              impact: 'Marktzugang erweitern',
              timeframe: '6 Monate'
            }
          ]
        };
        strategyAnalyses.push(strategyAnalysis);

        // Bedrohungsanalyse
        const threatAssessment: CompetitorThreatAssessment = {
          competitorId: competitor.id,
          locationKey,
          threatLevel: competitor.marketPosition === 'leader' ? 'high' :
                      competitor.marketPosition === 'challenger' ? 'medium' : 'low',
          threatCategories: {
            marketShare: {
              current: 0.05 + Math.random() * 0.15,
              projected: 0.06 + Math.random() * 0.18,
              growth: 0.02 + Math.random() * 0.08
            },
            customerOverlap: 0.6 + Math.random() * 0.3,
            priceCompetition: pricingAnalysis.priceComparison.vsZoeSolar < -0.1 ? 0.8 :
                           pricingAnalysis.priceComparison.vsZoeSolar < 0 ? 0.6 : 0.4,
            serviceOverlap: 0.7 + Math.random() * 0.25,
            geographicOverlap: 0.8 + Math.random() * 0.15
          },
          riskFactors: [
            {
              factor: 'Preisaggressive Positionierung',
              impact: 0.7,
              probability: 0.8,
              mitigation: ['Qualitätsvorteile betonen', 'Premium-Services anbieten']
            },
            {
              factor: 'Lokale Marktpräsenz',
              impact: 0.8,
              probability: 0.9,
              mitigation: ['Lokale Partnerschaften aufbauen', 'Lokale Events sponsern']
            }
          ],
          opportunityFactors: [
            {
              factor: 'Technologie-Defizite',
              impact: 0.6,
              probability: 0.7,
              exploitation: ['Technologische Überlegenheit zeigen', 'Innovationen hervorheben']
            }
          ],
          strategicResponse: {
            immediate: [
              'Lokale SEO optimieren',
              'Kundenbewertungen sammeln',
              'Preis-Leistungs-Verhältnis kommunizieren'
            ],
            shortTerm: [
              'Partnerschaften mit lokalen Unternehmen',
              'Content-Marketing ausbauen',
              'Social Media Präsenz stärken'
            ],
            longTerm: [
              'Technologie-Investitionen erhöhen',
              'Neue Märkte erschließen',
              'Markenpositionierung stärken'
            ]
          },
          monitoringPriority: competitor.marketPosition === 'leader' ? 'high' :
                             competitor.marketPosition === 'challenger' ? 'medium' : 'low'
        };
        threatAssessments.push(threatAssessment);
      });

      this.competitorSEOAnalyses.set(locationKey, seoAnalyses);
      this.competitorPricingAnalyses.set(locationKey, pricingAnalyses);
      this.competitorStrategyAnalyses.set(locationKey, strategyAnalyses);
      this.competitorThreatAssessments.set(locationKey, threatAssessments);
    });
  }

  /**
   * Generiert Wettbewerber-Intelligence-Report
   */
  public generateCompetitorIntelligenceReport(locationKey: string): CompetitorIntelligenceReport {
    const competitors = this.competitorProfiles.get(locationKey) || [];
    const seoAnalyses = this.competitorSEOAnalyses.get(locationKey) || [];
    const pricingAnalyses = this.competitorPricingAnalyses.get(locationKey) || [];
    const strategyAnalyses = this.competitorStrategyAnalyses.get(locationKey) || [];
    const threatAssessments = this.competitorThreatAssessments.get(locationKey) || [];

    const marketLeaders = competitors.filter(c => c.marketPosition === 'leader');
    const emergingThreats = competitors.filter(c => c.marketPosition === 'challenger');
    const nichePlayers = competitors.filter(c => c.marketPosition === 'follower');

    const totalMarketShare = competitors.reduce((sum, c) => {
      const threat = threatAssessments.find(t => t.competitorId === c.id);
      return sum + (threat?.threatCategories.marketShare.current || 0);
    }, 0);

    const competitivePressure = totalMarketShare > 0.6 ? 'intense' :
                               totalMarketShare > 0.4 ? 'high' :
                               totalMarketShare > 0.2 ? 'medium' : 'low';

    const report: CompetitorIntelligenceReport = {
      locationKey,
      generatedAt: new Date().toISOString(),
      executiveSummary: {
        totalCompetitors: competitors.length,
        marketConcentration: totalMarketShare,
        competitivePressure,
        keyThreats: threatAssessments
          .filter(t => t.threatLevel === 'high' || t.threatLevel === 'critical')
          .map(t => {
            const competitor = competitors.find(c => c.id === t.competitorId);
            return competitor?.name || 'Unknown';
          }),
        opportunities: [
          'Nischen-Märkte mit geringer Konkurrenz',
          'Technologische Differenzierung',
          'Premium-Service-Positionierung',
          'Lokale Partnerschaften'
        ],
        recommendations: [
          'Lokale SEO-Strategie intensivieren',
          'Kundenbindungsprogramme ausbauen',
          'Technologische Vorteile hervorheben',
          'Preis-Leistungs-Verhältnis optimieren'
        ]
      },
      competitorLandscape: {
        marketLeaders,
        emergingThreats,
        nichePlayers,
        potentialEntrants: [
          {
            name: 'Neuer Energieversorger',
            probability: 0.6,
            impact: 'Hoher Marktdruck durch Ressourcen'
          },
          {
            name: 'Internationaler Solar-Konzern',
            probability: 0.4,
            impact: 'Technologische Disruption'
          }
        ]
      },
      competitiveAnalysis: {
        strengthsVsCompetition: [
          'Höhere technologische Kompetenz',
          'Bessere Kundenservice-Qualität',
          'Innovative Produkte und Dienstleistungen',
          'Stärkere Online-Präsenz'
        ],
        weaknessesVsCompetition: [
          'Geringere lokale Markenbekanntheit',
          'Höhere Preise',
          'Begrenzte lokale Ressourcen',
          'Weniger etablierte Kundenbeziehungen'
        ],
        uniqueValueProposition: 'Premium-Solarlösungen mit KI-gestützter Optimierung und persönlichem Service',
        positioningStrategy: 'Technologieführer im Premium-Segment mit Fokus auf Nachhaltigkeit und Innovation'
      },
      strategicInsights: [
        {
          insight: 'Marktleader haben schwache Online-Präsenz - Opportunity für digitale Dominanz',
          category: 'opportunity',
          impact: 'high',
          confidence: 0.85,
          actions: ['SEO-Budget erhöhen', 'Content-Marketing ausbauen', 'Social Media Präsenz stärken']
        },
        {
          insight: 'Preisdruck von Discountern nimmt zu - Premium-Positionierung erforderlich',
          category: 'threat',
          impact: 'high',
          confidence: 0.9,
          actions: ['Qualitätsvorteile kommunizieren', 'Premium-Services entwickeln', 'Kundenbindung stärken']
        },
        {
          insight: 'Technologische Innovationen werden zum Differenzierungsmerkmal',
          category: 'trend',
          impact: 'medium',
          confidence: 0.75,
          actions: ['R&D-Investitionen erhöhen', 'Partnerschaften mit Tech-Unternehmen', 'Innovationen vermarkten']
        },
        {
          insight: 'Lokale Partnerschaften können Markteintrittsbarrieren überwinden',
          category: 'gap',
          impact: 'medium',
          confidence: 0.8,
          actions: ['Lokale Netzwerke aufbauen', 'Partnerschaften mit Handwerkern', 'Lokale Events sponsern']
        }
      ],
      actionPlan: [
        {
          action: 'Lokale SEO-Optimierung durchführen',
          priority: 'high',
          timeframe: '3 Monate',
          responsible: 'SEO-Team',
          resources: ['SEO-Budget', 'Content-Team', 'Technische Ressourcen'],
          kpis: ['Keyword-Rankings', 'Organischer Traffic', 'Konversionen']
        },
        {
          action: 'Kundenbindungsprogramm entwickeln',
          priority: 'high',
          timeframe: '2 Monate',
          responsible: 'Marketing-Team',
          resources: ['CRM-System', 'Marketing-Budget', 'Kundenbetreuung'],
          kpis: ['Kundenbindungsrate', 'Wiederholungskäufe', 'Kundenlebenswert']
        },
        {
          action: 'Technologie-Differenzierung hervorheben',
          priority: 'medium',
          timeframe: '4 Monate',
          responsible: 'Produkt-Team',
          resources: ['Entwicklungsteam', 'Marketing-Ressourcen', 'Demo-Systeme'],
          kpis: ['Lead-Qualität', 'Konversionsrate', 'Kundenfeedback']
        },
        {
          action: 'Lokale Partnerschaften aufbauen',
          priority: 'medium',
          timeframe: '6 Monate',
          responsible: 'Business Development',
          resources: ['Netzwerk-Budget', 'Vertriebsteam', 'Partner-Manager'],
          kpis: ['Anzahl Partnerschaften', 'Umsatz durch Partner', 'Marktanteil']
        }
      ]
    };

    this.intelligenceReports.set(locationKey, report);
    return report;
  }

  /**
   * Ruft Wettbewerber-Profile ab
   */
  public getCompetitorProfiles(locationKey: string): CompetitorProfile[] {
    return this.competitorProfiles.get(locationKey) || [];
  }

  /**
   * Ruft Wettbewerber-SEO-Analysen ab
   */
  public getCompetitorSEOAnalyses(locationKey: string): CompetitorSEOAnalysis[] {
    return this.competitorSEOAnalyses.get(locationKey) || [];
  }

  /**
   * Ruft Wettbewerber-Preisanalysen ab
   */
  public getCompetitorPricingAnalyses(locationKey: string): CompetitorPricingAnalysis[] {
    return this.competitorPricingAnalyses.get(locationKey) || [];
  }

  /**
   * Ruft Wettbewerber-Strategieanalysen ab
   */
  public getCompetitorStrategyAnalyses(locationKey: string): CompetitorStrategyAnalysis[] {
    return this.competitorStrategyAnalyses.get(locationKey) || [];
  }

  /**
   * Ruft Wettbewerber-Bedrohungsanalysen ab
   */
  public getCompetitorThreatAssessments(locationKey: string): CompetitorThreatAssessment[] {
    return this.competitorThreatAssessments.get(locationKey) || [];
  }

  /**
   * Ruft Wettbewerber-Intelligence-Report ab
   */
  public getCompetitorIntelligenceReport(locationKey: string): CompetitorIntelligenceReport | null {
    return this.intelligenceReports.get(locationKey) || null;
  }

  /**
   * Identifiziert Keyword-Lücken gegenüber Wettbewerbern
   */
  public identifyKeywordGaps(locationKey: string, targetKeywords: string[]): Array<{
    keyword: string;
    opportunity: number;
    competitorRankings: Array<{
      competitor: string;
      position: number;
    }>;
    zoeRanking?: number;
  }> {
    const seoAnalyses = this.competitorSEOAnalyses.get(locationKey) || [];
    const gaps = [];

    targetKeywords.forEach(keyword => {
      const competitorRankings = seoAnalyses
        .map(analysis => ({
          competitor: this.competitorProfiles.get(locationKey)?.find(c => c.id === analysis.competitorId)?.name || 'Unknown',
          position: analysis.keywordProfile.topKeywords.find(k => k.keyword === keyword)?.position || 100
        }))
        .filter(r => r.position <= 10)
        .sort((a, b) => a.position - b.position);

      const opportunity = competitorRankings.length === 0 ? 1.0 :
                         competitorRankings[0].position > 5 ? 0.8 :
                         competitorRankings[0].position > 3 ? 0.6 : 0.3;

      if (opportunity > 0.5) {
        gaps.push({
          keyword,
          opportunity,
          competitorRankings: competitorRankings.slice(0, 3),
          zoeRanking: Math.floor(5 + Math.random() * 15) // Simulierte ZOE-Position
        });
      }
    });

    return gaps.sort((a, b) => b.opportunity - a.opportunity);
  }

  /**
   * Analysiert Preisstrategien der Wettbewerber
   */
  public analyzePricingStrategies(locationKey: string): {
    marketPriceRange: {
      min: number;
      max: number;
      average: number;
    };
    pricingStrategies: { [strategy: string]: number };
    recommendations: Array<{
      action: string;
      rationale: string;
      expectedImpact: number;
    }>;
  } {
    const pricingAnalyses = this.competitorPricingAnalyses.get(locationKey) || [];

    const prices = pricingAnalyses.map(p => p.servicePricing.solarInstallation.perKw);
    const marketPriceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((sum, p) => sum + p, 0) / prices.length
    };

    const pricingStrategies: { [strategy: string]: number } = {};
    pricingAnalyses.forEach(analysis => {
      pricingStrategies[analysis.priceStrategy] = (pricingStrategies[analysis.priceStrategy] || 0) + 1;
    });

    const recommendations = [
      {
        action: 'Premium-Preisstrategie beibehalten',
        rationale: 'Markt zeigt Bereitschaft für Qualitätsprodukte zu zahlen',
        expectedImpact: 0.7
      },
      {
        action: 'Wertpakete für Preisbewusste Kunden entwickeln',
        rationale: 'Ansprache von 30% des Marktes die preissensitiv sind',
        expectedImpact: 0.6
      },
      {
        action: 'Transparente Preisgestaltung kommunizieren',
        rationale: 'Kunden schätzen Ehrlichkeit und Vergleichbarkeit',
        expectedImpact: 0.5
      }
    ];

    return {
      marketPriceRange,
      pricingStrategies,
      recommendations
    };
  }

  /**
   * Generiert globale Wettbewerbsübersicht
   */
  public generateGlobalCompetitiveOverview(): {
    totalCompetitors: number;
    marketConcentration: number;
    competitiveIntensity: 'low' | 'medium' | 'high' | 'extreme';
    keyCompetitiveTrends: Array<{
      trend: string;
      impact: number;
      affectedLocations: string[];
    }>;
    strategicRecommendations: string[];
  } {
    const allProfiles = Array.from(this.competitorProfiles.values()).flat();
    const allThreats = Array.from(this.competitorThreatAssessments.values()).flat();

    const totalCompetitors = allProfiles.length;
    const avgMarketShare = allThreats.reduce((sum, t) => sum + t.threatCategories.marketShare.current, 0) / allThreats.length;
    const marketConcentration = avgMarketShare * totalCompetitors;

    const competitiveIntensity = marketConcentration > 0.7 ? 'extreme' :
                                marketConcentration > 0.5 ? 'high' :
                                marketConcentration > 0.3 ? 'medium' : 'low';

    const keyCompetitiveTrends = [
      {
        trend: 'Konsolidierung im Markt',
        impact: 0.8,
        affectedLocations: PRIMARY_SERVICE_REGIONS.slice(0, 3).map(r => r.city.toLowerCase())
      },
      {
        trend: 'Technologie-Investitionen',
        impact: 0.7,
        affectedLocations: PRIMARY_SERVICE_REGIONS.map(r => r.city.toLowerCase())
      },
      {
        trend: 'Preiswettbewerb',
        impact: 0.6,
        affectedLocations: PRIMARY_SERVICE_REGIONS.slice(2, 5).map(r => r.city.toLowerCase())
      }
    ];

    const strategicRecommendations = [
      'Fokussiere auf technologische Differenzierung',
      'Baue starke lokale Präsenz auf',
      'Entwickle Premium-Service-Angebote',
      'Investiere in Kundenbindung',
      'Erschließe Nischen-Märkte'
    ];

    return {
      totalCompetitors,
      marketConcentration,
      competitiveIntensity,
      keyCompetitiveTrends,
      strategicRecommendations
    };
  }

  /**
   * Überwacht Wettbewerber-Aktivitäten
   */
  public monitorCompetitorActivity(locationKey: string): Array<{
    competitor: string;
    activity: string;
    impact: 'low' | 'medium' | 'high';
    detectedAt: string;
    recommendedResponse: string;
  }> {
    const competitors = this.competitorProfiles.get(locationKey) || [];
    const activities = [];

    competitors.forEach(competitor => {
      // Simuliere Aktivitäten
      const possibleActivities = [
        {
          activity: 'Neue Website gelauncht',
          impact: 'medium' as const,
          recommendedResponse: 'Website-Analyse durchführen und eigene Optimierungen prüfen'
        },
        {
          activity: 'Preissenkung angekündigt',
          impact: 'high' as const,
          recommendedResponse: 'Preisstrategie überprüfen und Wertvorteile hervorheben'
        },
        {
          activity: 'Neue Partnerschaft bekanntgegeben',
          impact: 'medium' as const,
          recommendedResponse: 'Eigene Partnerschaften stärken und Alleinstellungsmerkmale betonen'
        },
        {
          activity: 'Social Media Kampagne gestartet',
          impact: 'low' as const,
          recommendedResponse: 'Eigene Social Media Aktivitäten intensivieren'
        }
      ];

      const randomActivity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];

      activities.push({
        competitor: competitor.name,
        activity: randomActivity.activity,
        impact: randomActivity.impact,
        detectedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        recommendedResponse: randomActivity.recommendedResponse
      });
    });

    return activities.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }
}

// Singleton-Instanz für globale Verwendung
export const advancedLocalCompetitorAnalysisService = new AdvancedLocalCompetitorAnalysisService();