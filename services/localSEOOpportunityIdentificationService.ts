import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { predictiveLocalSearchTrendsService } from './predictiveLocalSearchTrendsService';
import { localMarketIntelligenceService } from './localMarketIntelligenceService';
import { advancedLocalCompetitorAnalysisService } from './advancedLocalCompetitorAnalysisService';
import { enterpriseLocalReportingService } from './enterpriseLocalReportingService';

export interface SEOOpportunity {
  id: string;
  locationKey: string;
  type: 'keyword' | 'content' | 'technical' | 'citation' | 'social' | 'local_pack' | 'gmb' | 'link_building' | 'competitive_gap';
  category: 'high_impact' | 'medium_impact' | 'long_term' | 'defensive';
  title: string;
  description: string;
  currentState: {
    score: number; // 0-100
    issues: string[];
    strengths: string[];
  };
  opportunity: {
    potential: number; // 0-100
    estimatedTraffic: number;
    estimatedRevenue: number;
    timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  };
  requirements: {
    resources: string[];
    skills: string[];
    budget: number;
    timeline: string;
  };
  implementation: {
    steps: Array<{
      step: string;
      priority: 'high' | 'medium' | 'low';
      effort: 'low' | 'medium' | 'high';
      dependencies: string[];
    }>;
    kpis: Array<{
      metric: string;
      target: number;
      current: number;
      timeframe: string;
    }>;
    risks: Array<{
      risk: string;
      probability: number;
      impact: string;
      mitigation: string;
    }>;
  };
  competitiveAdvantage: {
    uniqueness: number; // 0-100
    sustainability: number; // 0-100
    barriers: string[];
  };
  priority: {
    overall: number; // 0-100
    factors: {
      impact: number;
      ease: number;
      competition: number;
      alignment: number;
    };
  };
  status: 'identified' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  tags: string[];
}

export interface OpportunityCluster {
  id: string;
  name: string;
  description: string;
  opportunities: SEOOpportunity[];
  theme: string;
  totalPotential: number;
  totalEffort: 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
  synergies: string[]; // IDs anderer Opportunities die zusammen implementiert werden sollten
  prerequisites: string[];
  estimatedCompletion: string;
}

export interface LocalSEOOpportunityReport {
  locationKey: string;
  generatedAt: string;
  executiveSummary: {
    totalOpportunities: number;
    highPriorityOpportunities: number;
    totalPotentialTraffic: number;
    totalPotentialRevenue: number;
    implementationRoadmap: Array<{
      phase: string;
      duration: string;
      opportunities: number;
      expectedImpact: number;
    }>;
  };
  opportunityBreakdown: {
    byType: { [type: string]: number };
    byCategory: { [category: string]: number };
    byPriority: { [priority: string]: number };
    byTimeframe: { [timeframe: string]: number };
  };
  opportunityClusters: OpportunityCluster[];
  quickWins: SEOOpportunity[]; // Opportunities die schnell und einfach umzusetzen sind
  strategicInitiatives: SEOOpportunity[]; // Langfristige strategische Opportunities
  resourceRequirements: {
    budget: {
      total: number;
      byCategory: { [category: string]: number };
      monthly: number[];
    };
    personnel: {
      required: Array<{
        role: string;
        fte: number;
        duration: string;
      }>;
      skills: string[];
    };
    tools: string[];
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    riskFactors: Array<{
      factor: string;
      impact: number;
      probability: number;
      mitigation: string;
    }>;
    contingencyPlans: string[];
  };
  successMetrics: {
    primary: Array<{
      metric: string;
      target: number;
      current: number;
      timeframe: string;
    }>;
    secondary: Array<{
      metric: string;
      target: number;
      current: number;
      timeframe: string;
    }>;
  };
  recommendations: Array<{
    recommendation: string;
    rationale: string;
    priority: 'high' | 'medium' | 'low';
    expectedImpact: number;
    implementation: string[];
  }>;
}

/**
 * Local SEO Opportunity Identification Service
 * Umfassende Identifizierung von SEO-Chancen für lokale Märkte
 */
export class LocalSEOOpportunityIdentificationService {
  private opportunities: Map<string, SEOOpportunity[]> = new Map();
  private opportunityClusters: Map<string, OpportunityCluster[]> = new Map();
  private opportunityReports: Map<string, LocalSEOOpportunityReport> = new Map();

  constructor() {
    this.initializeOpportunities();
  }

  /**
   * Initialisiert Opportunities für alle Standorte
   */
  private initializeOpportunities(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const opportunities: SEOOpportunity[] = [];

      // Sammle Daten aus verschiedenen Services
      const seoData = localSEOAnalyticsService.getLocalSEOAnalytics(locationKey);
      const trendData = predictiveLocalSearchTrendsService.getSearchTrendData(locationKey);
      const marketData = localMarketIntelligenceService.getMarketPotential(locationKey);
      const competitorData = advancedLocalCompetitorAnalysisService.getCompetitorIntelligenceReport(locationKey);

      if (seoData && trendData && marketData && competitorData) {
        // Keyword-Opportunities
        this.identifyKeywordOpportunities(locationKey, trendData, opportunities);

        // Content-Opportunities
        this.identifyContentOpportunities(locationKey, seoData, opportunities);

        // Technical SEO Opportunities
        this.identifyTechnicalOpportunities(locationKey, seoData, opportunities);

        // Citation Opportunities
        this.identifyCitationOpportunities(locationKey, seoData, opportunities);

        // Local Pack Opportunities
        this.identifyLocalPackOpportunities(locationKey, seoData, opportunities);

        // GMB Opportunities
        this.identifyGMBOpportunities(locationKey, seoData, opportunities);

        // Competitive Gap Opportunities
        this.identifyCompetitiveGapOpportunities(locationKey, competitorData, opportunities);

        // Social Media Opportunities
        this.identifySocialOpportunities(locationKey, opportunities);
      }

      this.opportunities.set(locationKey, opportunities);
      this.createOpportunityClusters(locationKey);
    });
  }

  /**
   * Identifiziert Keyword-Opportunities
   */
  private identifyKeywordOpportunities(
    locationKey: string,
    trendData: any[],
    opportunities: SEOOpportunity[]
  ): void {
    const highGrowthKeywords = trendData.filter(d =>
      d.trend.direction === 'increasing' && d.trend.slope > 0.03
    );

    const lowCompetitionKeywords = trendData.filter(d =>
      d.historicalData.some(h => h.competition < 0.3) &&
      d.historicalData[d.historicalData.length - 1].position > 10
    );

    if (highGrowthKeywords.length > 0) {
      opportunities.push({
        id: `keyword_growth_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'keyword',
        category: 'high_impact',
        title: `High-Growth Keywords optimieren`,
        description: `${highGrowthKeywords.length} Keywords zeigen starkes Wachstum. Optimierung kann signifikanten Traffic-Zuwachs bringen.`,
        currentState: {
          score: 45,
          issues: ['Keywords nicht vollständig optimiert', 'Content-Lücken vorhanden'],
          strengths: ['Gute technische Grundlage', 'Starke Markenpräsenz']
        },
        opportunity: {
          potential: 85,
          estimatedTraffic: highGrowthKeywords.reduce((sum, k) => sum + k.forecast.predictions[0].predictedVolume, 0),
          estimatedRevenue: highGrowthKeywords.reduce((sum, k) => sum + k.forecast.predictions[0].predictedVolume * 25, 0),
          timeframe: 'short_term'
        },
        requirements: {
          resources: ['SEO-Spezialist', 'Content-Team'],
          skills: ['Keyword-Recherche', 'On-Page SEO', 'Content-Optimierung'],
          budget: 15000,
          timeline: '3 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'Keyword-Analyse durchführen',
              priority: 'high',
              effort: 'medium',
              dependencies: []
            },
            {
              step: 'Content-Optimierung implementieren',
              priority: 'high',
              effort: 'high',
              dependencies: ['Keyword-Analyse']
            },
            {
              step: 'Performance überwachen',
              priority: 'medium',
              effort: 'low',
              dependencies: ['Content-Optimierung']
            }
          ],
          kpis: [
            {
              metric: 'Keyword-Rankings',
              target: 15,
              current: 25,
              timeframe: '3 Monate'
            },
            {
              metric: 'Organischer Traffic',
              target: 2000,
              current: 1200,
              timeframe: '3 Monate'
            }
          ],
          risks: [
            {
              risk: 'Algorithmus-Änderungen',
              probability: 0.3,
              impact: 'Ranking-Verlust',
              mitigation: 'Diversifizierte Strategie'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 60,
          sustainability: 75,
          barriers: ['Technisches Know-how', 'Content-Qualität']
        },
        priority: {
          overall: 85,
          factors: {
            impact: 90,
            ease: 70,
            competition: 60,
            alignment: 95
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['keyword', 'growth', 'high-impact']
      });
    }

    if (lowCompetitionKeywords.length > 0) {
      opportunities.push({
        id: `keyword_low_comp_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'keyword',
        category: 'medium_impact',
        title: `Low-Competition Keywords erschließen`,
        description: `${lowCompetitionKeywords.length} Keywords haben geringe Konkurrenz und hohes Ranking-Potenzial.`,
        currentState: {
          score: 30,
          issues: ['Keywords nicht targetiert', 'Content fehlt'],
          strengths: ['Lokale Expertise', 'Technische SEO-Basis']
        },
        opportunity: {
          potential: 70,
          estimatedTraffic: lowCompetitionKeywords.reduce((sum, k) => sum + k.forecast.predictions[0].predictedVolume * 0.8, 0),
          estimatedRevenue: lowCompetitionKeywords.reduce((sum, k) => sum + k.forecast.predictions[0].predictedVolume * 20, 0),
          timeframe: 'medium_term'
        },
        requirements: {
          resources: ['Content-Writer', 'SEO-Tools'],
          skills: ['Content-Erstellung', 'SEO-Optimierung'],
          budget: 8000,
          timeline: '4 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'Long-Tail Keywords identifizieren',
              priority: 'high',
              effort: 'low',
              dependencies: []
            },
            {
              step: 'Content für Keywords erstellen',
              priority: 'high',
              effort: 'medium',
              dependencies: ['Long-Tail Keywords identifizieren']
            },
            {
              step: 'Interne Verlinkung optimieren',
              priority: 'medium',
              effort: 'low',
              dependencies: ['Content für Keywords erstellen']
            }
          ],
          kpis: [
            {
              metric: 'Neue Rankings',
              target: 20,
              current: 5,
              timeframe: '4 Monate'
            }
          ],
          risks: [
            {
              risk: 'Geringes Suchvolumen',
              probability: 0.4,
              impact: 'Niedriger ROI',
              mitigation: 'Fokus auf Conversions'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 80,
          sustainability: 85,
          barriers: ['Lokale Präsenz', 'Content-Qualität']
        },
        priority: {
          overall: 65,
          factors: {
            impact: 60,
            ease: 85,
            competition: 90,
            alignment: 70
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['keyword', 'low-competition', 'long-tail']
      });
    }
  }

  /**
   * Identifiziert Content-Opportunities
   */
  private identifyContentOpportunities(
    locationKey: string,
    seoData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const contentGaps = [
      'Lokale Fallstudien',
      'Saisonale Solar-Guides',
      'Förderprogramm-Übersichten',
      'Vergleichsartikel'
    ];

    opportunities.push({
      id: `content_gaps_${locationKey}_${Date.now()}`,
      locationKey,
      type: 'content',
      category: 'high_impact',
      title: `Content-Lücken schließen`,
      description: `${contentGaps.length} wichtige Content-Themen fehlen. Diese würden signifikanten Traffic und Authority generieren.`,
      currentState: {
        score: 40,
        issues: ['Unvollständige Content-Abdeckung', 'Veraltete Inhalte'],
        strengths: ['Starke technische Basis', 'Gute User-Experience']
      },
      opportunity: {
        potential: 80,
        estimatedTraffic: 3500,
        estimatedRevenue: 87500,
        timeframe: 'medium_term'
      },
      requirements: {
        resources: ['Content-Team', 'SEO-Spezialist'],
        skills: ['Content-Strategie', 'SEO-Writing', 'Research'],
        budget: 25000,
        timeline: '6 Monate'
      },
      implementation: {
        steps: [
          {
            step: 'Content-Audit durchführen',
            priority: 'high',
            effort: 'medium',
            dependencies: []
          },
          {
            step: 'Content-Kalender erstellen',
            priority: 'high',
            effort: 'low',
            dependencies: ['Content-Audit']
          },
          {
            step: 'Prioritäre Inhalte produzieren',
            priority: 'high',
            effort: 'high',
            dependencies: ['Content-Kalender']
          },
          {
            step: 'Performance messen und optimieren',
            priority: 'medium',
            effort: 'medium',
            dependencies: ['Prioritäre Inhalte produzieren']
          }
        ],
        kpis: [
          {
            metric: 'Neue Content-Pieces',
            target: 15,
            current: 0,
            timeframe: '6 Monate'
          },
          {
            metric: 'Content-Traffic',
            target: 3000,
            current: 800,
            timeframe: '6 Monate'
          }
        ],
        risks: [
          {
            risk: 'Resource-Engpässe',
            probability: 0.5,
            impact: 'Verzögerungen',
            mitigation: 'Externe Freelancer engagieren'
          }
        ]
      },
      competitiveAdvantage: {
        uniqueness: 70,
        sustainability: 90,
        barriers: ['Content-Qualität', 'Lokales Wissen']
      },
      priority: {
        overall: 78,
        factors: {
          impact: 85,
          ease: 60,
          competition: 75,
          alignment: 80
        }
      },
      status: 'identified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['content', 'gaps', 'authority']
    });
  }

  /**
   * Identifiziert technische SEO Opportunities
   */
  private identifyTechnicalOpportunities(
    locationKey: string,
    seoData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const technicalIssues = [];

    if (seoData.technicalSEO.coreWebVitals < 70) {
      technicalIssues.push('Core Web Vitals optimieren');
    }
    if (!seoData.technicalSEO.mobileFriendly) {
      technicalIssues.push('Mobile-Optimierung');
    }
    if (seoData.technicalSEO.pageSpeed > 3.0) {
      technicalIssues.push('Ladezeiten verbessern');
    }

    if (technicalIssues.length > 0) {
      opportunities.push({
        id: `technical_seo_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'technical',
        category: 'high_impact',
        title: `Technische SEO verbessern`,
        description: `${technicalIssues.length} kritische technische SEO-Probleme müssen behoben werden.`,
        currentState: {
          score: seoData.technicalSEO.coreWebVitals,
          issues: technicalIssues,
          strengths: ['Saubere HTML-Struktur', 'Gute interne Verlinkung']
        },
        opportunity: {
          potential: 75,
          estimatedTraffic: 1200,
          estimatedRevenue: 30000,
          timeframe: 'immediate'
        },
        requirements: {
          resources: ['Entwickler', 'SEO-Spezialist'],
          skills: ['Technical SEO', 'Web-Development'],
          budget: 12000,
          timeline: '2 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'Technischen Audit durchführen',
              priority: 'high',
              effort: 'low',
              dependencies: []
            },
            {
              step: 'Core Web Vitals optimieren',
              priority: 'high',
              effort: 'medium',
              dependencies: ['Technischen Audit']
            },
            {
              step: 'Mobile-Optimierung implementieren',
              priority: 'high',
              effort: 'medium',
              dependencies: ['Technischen Audit']
            },
            {
              step: 'Performance überwachen',
              priority: 'medium',
              effort: 'low',
              dependencies: ['Core Web Vitals optimieren', 'Mobile-Optimierung']
            }
          ],
          kpis: [
            {
              metric: 'Core Web Vitals Score',
              target: 85,
              current: seoData.technicalSEO.coreWebVitals,
              timeframe: '2 Monate'
            },
            {
              metric: 'Mobile Score',
              target: 95,
              current: seoData.technicalSEO.mobileScore,
              timeframe: '2 Monate'
            }
          ],
          risks: [
            {
              risk: 'Implementierungsfehler',
              probability: 0.3,
              impact: 'Performance-Verschlechterung',
              mitigation: 'Staging-Umgebung testen'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 50,
          sustainability: 95,
          barriers: ['Technisches Know-how', 'Entwicklungsressourcen']
        },
        priority: {
          overall: 82,
          factors: {
            impact: 80,
            ease: 70,
            competition: 85,
            alignment: 85
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['technical', 'performance', 'mobile']
      });
    }
  }

  /**
   * Identifiziert Citation Opportunities
   */
  private identifyCitationOpportunities(
    locationKey: string,
    seoData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const missingCitations = seoData.citationAnalytics.missingCitations || [];

    if (missingCitations.length > 0) {
      opportunities.push({
        id: `citations_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'citation',
        category: 'medium_impact',
        title: `Citation-Profil erweitern`,
        description: `${missingCitations.length} wichtige Citations fehlen. Vollständiges Citation-Profil würde lokale Sichtbarkeit verbessern.`,
        currentState: {
          score: seoData.citationAnalytics.overallScore,
          issues: [`${missingCitations.length} fehlende Citations`],
          strengths: ['Grundlegendes Citation-Profil vorhanden']
        },
        opportunity: {
          potential: 65,
          estimatedTraffic: 800,
          estimatedRevenue: 20000,
          timeframe: 'medium_term'
        },
        requirements: {
          resources: ['Citation-Builder', 'Lokale Netzwerke'],
          skills: ['Citation-Management', 'Lokales Networking'],
          budget: 5000,
          timeline: '4 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'Citation-Audit durchführen',
              priority: 'high',
              effort: 'low',
              dependencies: []
            },
            {
              step: 'Prioritäre Citations identifizieren',
              priority: 'high',
              effort: 'low',
              dependencies: ['Citation-Audit']
            },
            {
              step: 'Citation-Kampagne starten',
              priority: 'high',
              effort: 'medium',
              dependencies: ['Prioritäre Citations identifizieren']
            },
            {
              step: 'Citation-Qualität überwachen',
              priority: 'medium',
              effort: 'low',
              dependencies: ['Citation-Kampagne starten']
            }
          ],
          kpis: [
            {
              metric: 'Neue Citations',
              target: missingCitations.length,
              current: 0,
              timeframe: '4 Monate'
            },
            {
              metric: 'Citation Score',
              target: 90,
              current: seoData.citationAnalytics.overallScore,
              timeframe: '4 Monate'
            }
          ],
          risks: [
            {
              risk: 'Duplicate Citations',
              probability: 0.4,
              impact: 'Penalty-Risiko',
              mitigation: 'Qualitätskontrolle implementieren'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 75,
          sustainability: 80,
          barriers: ['Lokale Kontakte', 'Konsistente Daten']
        },
        priority: {
          overall: 58,
          factors: {
            impact: 60,
            ease: 75,
            competition: 70,
            alignment: 65
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['citations', 'local-seo', 'authority']
      });
    }
  }

  /**
   * Identifiziert Local Pack Opportunities
   */
  private identifyLocalPackOpportunities(
    locationKey: string,
    seoData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const localPackData = seoData.localPackAnalytics;

    if (localPackData.position > 3) {
      opportunities.push({
        id: `local_pack_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'local_pack',
        category: 'high_impact',
        title: `Local Pack Position verbessern`,
        description: `Aktuelle Position ${localPackData.position} im Local Pack. Top-3 Position würde signifikanten Traffic-Zuwachs bringen.`,
        currentState: {
          score: Math.max(0, 100 - (localPackData.position - 1) * 25),
          issues: ['GMB-Optimierung unvollständig', 'Reviews unzureichend'],
          strengths: ['Lokale Präsenz', 'NAP-Konsistenz']
        },
        opportunity: {
          potential: 85,
          estimatedTraffic: localPackData.clicks * 2.5,
          estimatedRevenue: localPackData.clicks * 2.5 * 25,
          timeframe: 'short_term'
        },
        requirements: {
          resources: ['GMB-Manager', 'Review-Management'],
          skills: ['Local SEO', 'GMB-Optimierung'],
          budget: 3000,
          timeline: '2 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'GMB-Profil auditieren',
              priority: 'high',
              effort: 'low',
              dependencies: []
            },
            {
              step: 'GMB-Optimierung implementieren',
              priority: 'high',
              effort: 'medium',
              dependencies: ['GMB-Profil auditieren']
            },
            {
              step: 'Review-Kampagne starten',
              priority: 'high',
              effort: 'medium',
              dependencies: ['GMB-Optimierung implementieren']
            },
            {
              step: 'Local Pack Performance tracken',
              priority: 'medium',
              effort: 'low',
              dependencies: ['GMB-Optimierung implementieren']
            }
          ],
          kpis: [
            {
              metric: 'Local Pack Position',
              target: 3,
              current: localPackData.position,
              timeframe: '2 Monate'
            },
            {
              metric: 'GMB Reviews',
              target: 50,
              current: seoData.gmbAnalytics.reviewCount,
              timeframe: '2 Monate'
            }
          ],
          risks: [
            {
              risk: 'Google Algorithmus-Änderungen',
              probability: 0.3,
              impact: 'Positionsschwankungen',
              mitigation: 'Diversifizierte lokale SEO-Strategie'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 65,
          sustainability: 70,
          barriers: ['Lokale Reputation', 'Kundenbeziehungen']
        },
        priority: {
          overall: 88,
          factors: {
            impact: 95,
            ease: 65,
            competition: 80,
            alignment: 90
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['local-pack', 'gmb', 'local-seo']
      });
    }
  }

  /**
   * Identifiziert GMB Opportunities
   */
  private identifyGMBOpportunities(
    locationKey: string,
    seoData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const gmbData = seoData.gmbAnalytics;

    if (gmbData.rating < 4.5 || gmbData.responseRate < 0.8) {
      opportunities.push({
        id: `gmb_optimization_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'gmb',
        category: 'high_impact',
        title: `GMB-Optimierung und Reputation-Management`,
        description: 'GMB-Profil und Kundenbewertungen optimieren für bessere lokale Sichtbarkeit.',
        currentState: {
          score: (gmbData.rating / 5) * 100,
          issues: gmbData.rating < 4.5 ? ['Niedrige Bewertung'] : [],
          strengths: ['Vollständiges Profil', 'Regelmäßige Posts']
        },
        opportunity: {
          potential: 75,
          estimatedTraffic: 600,
          estimatedRevenue: 15000,
          timeframe: 'immediate'
        },
        requirements: {
          resources: ['GMB-Manager', 'Kundenbetreuung'],
          skills: ['Reputation-Management', 'Kundenkommunikation'],
          budget: 2000,
          timeline: '1 Monat'
        },
        implementation: {
          steps: [
            {
              step: 'GMB-Audit durchführen',
              priority: 'high',
              effort: 'low',
              dependencies: []
            },
            {
              step: 'Review-Management implementieren',
              priority: 'high',
              effort: 'medium',
              dependencies: ['GMB-Audit']
            },
            {
              step: 'Response-Rate verbessern',
              priority: 'high',
              effort: 'medium',
              dependencies: ['GMB-Audit']
            },
            {
              step: 'Content-Posting optimieren',
              priority: 'medium',
              effort: 'low',
              dependencies: ['GMB-Audit']
            }
          ],
          kpis: [
            {
              metric: 'GMB Rating',
              target: 4.8,
              current: gmbData.rating,
              timeframe: '1 Monat'
            },
            {
              metric: 'Response Rate',
              target: 0.95,
              current: gmbData.responseRate,
              timeframe: '1 Monat'
            }
          ],
          risks: [
            {
              risk: 'Negative Reviews',
              probability: 0.6,
              impact: 'Reputationsschaden',
              mitigation: 'Proaktives Review-Management'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 60,
          sustainability: 85,
          barriers: ['Kundenbeziehungen', 'Service-Qualität']
        },
        priority: {
          overall: 80,
          factors: {
            impact: 85,
            ease: 80,
            competition: 75,
            alignment: 85
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['gmb', 'reputation', 'local-seo']
      });
    }
  }

  /**
   * Identifiziert Competitive Gap Opportunities
   */
  private identifyCompetitiveGapOpportunities(
    locationKey: string,
    competitorData: any,
    opportunities: SEOOpportunity[]
  ): void {
    const competitiveGaps = competitorData.competitiveAnalysis.weaknessesVsCompetition;

    if (competitiveGaps.length > 0) {
      opportunities.push({
        id: `competitive_gaps_${locationKey}_${Date.now()}`,
        locationKey,
        type: 'competitive_gap',
        category: 'strategic',
        title: `Wettbewerbslücken nutzen`,
        description: `${competitiveGaps.length} identifizierte Wettbewerbslücken können zu signifikantem Vorteil führen.`,
        currentState: {
          score: 50,
          issues: competitiveGaps,
          strengths: competitorData.competitiveAnalysis.strengthsVsCompetition
        },
        opportunity: {
          potential: 90,
          estimatedTraffic: 2500,
          estimatedRevenue: 62500,
          timeframe: 'long_term'
        },
        requirements: {
          resources: ['Strategisches Team', 'Entwicklungsteam'],
          skills: ['Strategische Planung', 'Innovation'],
          budget: 50000,
          timeline: '12 Monate'
        },
        implementation: {
          steps: [
            {
              step: 'Wettbewerbsanalyse vertiefen',
              priority: 'high',
              effort: 'medium',
              dependencies: []
            },
            {
              step: 'Strategische Lücken identifizieren',
              priority: 'high',
              effort: 'low',
              dependencies: ['Wettbewerbsanalyse vertiefen']
            },
            {
              step: 'Innovationspipeline entwickeln',
              priority: 'high',
              effort: 'high',
              dependencies: ['Strategische Lücken identifizieren']
            },
            {
              step: 'Differenzierungsstrategie implementieren',
              priority: 'high',
              effort: 'high',
              dependencies: ['Innovationspipeline entwickeln']
            }
          ],
          kpis: [
            {
              metric: 'Marktanteil',
              target: 0.15,
              current: 0.05,
              timeframe: '12 Monate'
            },
            {
              metric: 'Unique Selling Points',
              target: 5,
              current: 2,
              timeframe: '12 Monate'
            }
          ],
          risks: [
            {
              risk: 'Wettbewerber reagieren',
              probability: 0.8,
              impact: 'Vorteil schwindet',
              mitigation: 'Schnelle Implementierung und kontinuierliche Innovation'
            }
          ]
        },
        competitiveAdvantage: {
          uniqueness: 95,
          sustainability: 70,
          barriers: ['Innovationsfähigkeit', 'Markenpositionierung']
        },
        priority: {
          overall: 75,
          factors: {
            impact: 90,
            ease: 40,
            competition: 95,
            alignment: 80
          }
        },
        status: 'identified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['competitive', 'strategic', 'innovation']
      });
    }
  }

  /**
   * Identifiziert Social Media Opportunities
   */
  private identifySocialOpportunities(
    locationKey: string,
    opportunities: SEOOpportunity[]
  ): void {
    opportunities.push({
      id: `social_seo_${locationKey}_${Date.now()}`,
      locationKey,
      type: 'social',
      category: 'medium_impact',
      title: `Social Media für SEO nutzen`,
      description: 'Social Signals und lokale Community-Engagement für bessere SEO-Performance.',
      currentState: {
        score: 35,
        issues: ['Geringe Social Media Präsenz', 'Wenig Community-Engagement'],
        strengths: ['Lokale Zielgruppe', 'Interessante Inhalte']
      },
      opportunity: {
        potential: 60,
        estimatedTraffic: 400,
        estimatedRevenue: 10000,
        timeframe: 'medium_term'
      },
      requirements: {
        resources: ['Social Media Manager', 'Content-Team'],
        skills: ['Social Media Marketing', 'Community Management'],
        budget: 8000,
        timeline: '4 Monate'
      },
      implementation: {
        steps: [
          {
            step: 'Social Media Audit',
            priority: 'high',
            effort: 'low',
            dependencies: []
          },
          {
            step: 'Content-Strategie entwickeln',
            priority: 'high',
            effort: 'medium',
            dependencies: ['Social Media Audit']
          },
          {
            step: 'Community-Engagement aufbauen',
            priority: 'high',
            effort: 'medium',
            dependencies: ['Content-Strategie entwickeln']
          },
          {
            step: 'Social Signals tracken',
            priority: 'medium',
            effort: 'low',
            dependencies: ['Community-Engagement aufbauen']
          }
        ],
        kpis: [
          {
            metric: 'Social Engagement',
            target: 500,
            current: 50,
            timeframe: '4 Monate'
          },
          {
            metric: 'Social Traffic',
            target: 300,
            current: 20,
            timeframe: '4 Monate'
          }
        ],
        risks: [
          {
            risk: 'Zeitaufwand für Engagement',
            probability: 0.5,
            impact: 'Resource-Belastung',
            mitigation: 'Automatisierte Tools und Community-Manager'
          }
        ]
      },
      competitiveAdvantage: {
        uniqueness: 55,
        sustainability: 75,
        barriers: ['Lokale Community-Kontakte', 'Konsistente Präsenz']
      },
      priority: {
        overall: 55,
        factors: {
          impact: 50,
          ease: 70,
          competition: 60,
          alignment: 65
        }
      },
      status: 'identified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['social', 'community', 'engagement']
    });
  }

  /**
   * Erstellt Opportunity Clusters
   */
  private createOpportunityClusters(locationKey: string): void {
    const opportunities = this.opportunities.get(locationKey) || [];
    const clusters: OpportunityCluster[] = [];

    // Content-Cluster
    const contentOpportunities = opportunities.filter(o => o.type === 'content');
    if (contentOpportunities.length > 0) {
      clusters.push({
        id: `content_cluster_${locationKey}`,
        name: 'Content Excellence',
        description: 'Umfassende Content-Strategie für lokale SEO-Dominanz',
        opportunities: contentOpportunities,
        theme: 'Content-First Local SEO',
        totalPotential: contentOpportunities.reduce((sum, o) => sum + o.opportunity.potential, 0),
        totalEffort: 'high',
        priority: 'high',
        synergies: contentOpportunities.map(o => o.id),
        prerequisites: [],
        estimatedCompletion: '6 Monate'
      });
    }

    // Technical SEO Cluster
    const technicalOpportunities = opportunities.filter(o => o.type === 'technical');
    if (technicalOpportunities.length > 0) {
      clusters.push({
        id: `technical_cluster_${locationKey}`,
        name: 'Technical Foundation',
        description: 'Solide technische Basis für alle SEO-Aktivitäten',
        opportunities: technicalOpportunities,
        theme: 'Technical SEO Excellence',
        totalPotential: technicalOpportunities.reduce((sum, o) => sum + o.opportunity.potential, 0),
        totalEffort: 'medium',
        priority: 'high',
        synergies: technicalOpportunities.map(o => o.id),
        prerequisites: [],
        estimatedCompletion: '2 Monate'
      });
    }

    // Local SEO Cluster
    const localOpportunities = opportunities.filter(o =>
      ['citation', 'local_pack', 'gmb'].includes(o.type)
    );
    if (localOpportunities.length > 0) {
      clusters.push({
        id: `local_cluster_${locationKey}`,
        name: 'Local Dominance',
        description: 'Lokale Sichtbarkeit maximieren durch alle Local SEO Kanäle',
        opportunities: localOpportunities,
        theme: 'Complete Local SEO',
        totalPotential: localOpportunities.reduce((sum, o) => sum + o.opportunity.potential, 0),
        totalEffort: 'medium',
        priority: 'high',
        synergies: localOpportunities.map(o => o.id),
        prerequisites: ['technical_cluster'],
        estimatedCompletion: '4 Monate'
      });
    }

    this.opportunityClusters.set(locationKey, clusters);
  }

  /**
   * Generiert Local SEO Opportunity Report
   */
  public generateLocalSEOOpportunityReport(locationKey: string): LocalSEOOpportunityReport {
    const opportunities = this.opportunities.get(locationKey) || [];
    const clusters = this.opportunityClusters.get(locationKey) || [];

    const totalPotentialTraffic = opportunities.reduce((sum, o) => sum + o.opportunity.estimatedTraffic, 0);
    const totalPotentialRevenue = opportunities.reduce((sum, o) => sum + o.opportunity.estimatedRevenue, 0);

    const report: LocalSEOOpportunityReport = {
      locationKey,
      generatedAt: new Date().toISOString(),
      executiveSummary: {
        totalOpportunities: opportunities.length,
        highPriorityOpportunities: opportunities.filter(o => o.priority.overall > 80).length,
        totalPotentialTraffic,
        totalPotentialRevenue,
        implementationRoadmap: [
          {
            phase: 'Immediate Actions (0-2 Monate)',
            duration: '2 Monate',
            opportunities: opportunities.filter(o => o.opportunity.timeframe === 'immediate').length,
            expectedImpact: 0.3
          },
          {
            phase: 'Short-term Growth (2-6 Monate)',
            duration: '4 Monate',
            opportunities: opportunities.filter(o => o.opportunity.timeframe === 'short_term').length,
            expectedImpact: 0.4
          },
          {
            phase: 'Medium-term Scaling (6-12 Monate)',
            duration: '6 Monate',
            opportunities: opportunities.filter(o => o.opportunity.timeframe === 'medium_term').length,
            expectedImpact: 0.2
          },
          {
            phase: 'Long-term Dominance (12+ Monate)',
            duration: '12+ Monate',
            opportunities: opportunities.filter(o => o.opportunity.timeframe === 'long_term').length,
            expectedImpact: 0.1
          }
        ]
      },
      opportunityBreakdown: {
        byType: opportunities.reduce((acc, o) => {
          acc[o.type] = (acc[o.type] || 0) + 1;
          return acc;
        }, {} as { [type: string]: number }),
        byCategory: opportunities.reduce((acc, o) => {
          acc[o.category] = (acc[o.category] || 0) + 1;
          return acc;
        }, {} as { [category: string]: number }),
        byPriority: {
          high: opportunities.filter(o => o.priority.overall > 80).length,
          medium: opportunities.filter(o => o.priority.overall > 60 && o.priority.overall <= 80).length,
          low: opportunities.filter(o => o.priority.overall <= 60).length
        },
        byTimeframe: opportunities.reduce((acc, o) => {
          acc[o.opportunity.timeframe] = (acc[o.opportunity.timeframe] || 0) + 1;
          return acc;
        }, {} as { [timeframe: string]: number })
      },
      opportunityClusters: clusters,
      quickWins: opportunities
        .filter(o => o.priority.overall > 70 && o.requirements.timeline === '1 Monat')
        .sort((a, b) => b.priority.overall - a.priority.overall)
        .slice(0, 5),
      strategicInitiatives: opportunities
        .filter(o => o.category === 'strategic' || o.opportunity.timeframe === 'long_term')
        .sort((a, b) => b.opportunity.potential - a.opportunity.potential)
        .slice(0, 3),
      resourceRequirements: {
        budget: {
          total: opportunities.reduce((sum, o) => sum + o.requirements.budget, 0),
          byCategory: opportunities.reduce((acc, o) => {
            acc[o.category] = (acc[o.category] || 0) + o.requirements.budget;
            return acc;
          }, {} as { [category: string]: number }),
          monthly: [15000, 25000, 20000, 15000, 10000, 8000] // Beispiel-Verteilung
        },
        personnel: {
          required: [
            {
              role: 'SEO Manager',
              fte: 1,
              duration: '12 Monate'
            },
            {
              role: 'Content Creator',
              fte: 0.5,
              duration: '6 Monate'
            },
            {
              role: 'Technical SEO',
              fte: 0.5,
              duration: '3 Monate'
            }
          ],
          skills: ['SEO', 'Content Marketing', 'Technical SEO', 'Local SEO', 'Analytics']
        },
        tools: ['Ahrefs', 'SEMrush', 'Google Analytics', 'GMB Manager', 'Content Management System']
      },
      riskAssessment: {
        overallRisk: 'medium',
        riskFactors: [
          {
            factor: 'Google Algorithmus-Änderungen',
            impact: 0.8,
            probability: 0.4,
            mitigation: 'Diversifizierte Strategie und kontinuierliches Monitoring'
          },
          {
            factor: 'Wettbewerbsreaktionen',
            impact: 0.7,
            probability: 0.6,
            mitigation: 'Schnelle Implementierung und First-Mover-Advantage'
          },
          {
            factor: 'Resource-Engpässe',
            impact: 0.5,
            probability: 0.5,
            mitigation: 'Skalierbare Prozesse und externe Partner'
          }
        ],
        contingencyPlans: [
          'Monatliche Strategie-Reviews',
          'Budget für externe Hilfe',
          'Alternative Strategien vorbereitet'
        ]
      },
      successMetrics: {
        primary: [
          {
            metric: 'Organischer Traffic Wachstum',
            target: 50,
            current: 0,
            timeframe: '12 Monate'
          },
          {
            metric: 'Keyword Rankings Verbesserung',
            target: 30,
            current: 0,
            timeframe: '12 Monate'
          },
          {
            metric: 'Konversionsrate',
            target: 0.12,
            current: 0.08,
            timeframe: '12 Monate'
          }
        ],
        secondary: [
          {
            metric: 'Domain Authority',
            target: 65,
            current: 45,
            timeframe: '12 Monate'
          },
          {
            metric: 'Local Pack Position',
            target: 2,
            current: 5,
            timeframe: '6 Monate'
          }
        ]
      },
      recommendations: [
        {
          recommendation: 'Fokussiere zunächst auf Quick Wins für schnelle Ergebnisse',
          rationale: 'Schnelle Erfolge bauen Momentum und Vertrauen auf',
          priority: 'high',
          expectedImpact: 0.8,
          implementation: ['Prioritäten basierend auf Effort vs. Impact setzen', 'Ressourcen auf High-ROI Opportunities konzentrieren']
        },
        {
          recommendation: 'Baue eine skalierbare Content-Maschine auf',
          rationale: 'Content ist der Schlüssel für langfristigen SEO-Erfolg',
          priority: 'high',
          expectedImpact: 0.9,
          implementation: ['Content-Kalender etablieren', 'Prozesse für Content-Erstellung standardisieren', 'Performance-Tracking implementieren']
        },
        {
          recommendation: 'Technische Excellence als Wettbewerbsvorteil nutzen',
          rationale: 'Technische SEO bildet die Grundlage für alle anderen Aktivitäten',
          priority: 'high',
          expectedImpact: 0.7,
          implementation: ['Regelmäßige technische Audits', 'Performance-Monitoring etablieren', 'Entwicklungsprozesse optimieren']
        },
        {
          recommendation: 'Lokale Dominanz durch Multi-Channel-Ansatz erreichen',
          rationale: 'Lokale Sichtbarkeit erfordert Präsenz in allen relevanten Kanälen',
          priority: 'medium',
          expectedImpact: 0.8,
          implementation: ['GMB optimieren', 'Lokale Citations ausbauen', 'Community-Engagement stärken']
        },
        {
          recommendation: 'Kontinuierliches Monitoring und Anpassung etablieren',
          rationale: 'SEO ist dynamisch und erfordert kontinuierliche Optimierung',
          priority: 'medium',
          expectedImpact: 0.6,
          implementation: ['Wöchentliche Performance-Reviews', 'Monatliche Strategie-Anpassungen', 'Automatisierte Alerts für wichtige Metriken']
        }
      ]
    };

    this.opportunityReports.set(locationKey, report);
    return report;
  }

  /**
   * Ruft Opportunities ab
   */
  public getOpportunities(locationKey: string, filters?: {
    type?: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    status?: 'identified' | 'planned' | 'in_progress' | 'completed' | 'cancelled';
  }): SEOOpportunity[] {
    let opportunities = this.opportunities.get(locationKey) || [];

    if (filters) {
      if (filters.type) {
        opportunities = opportunities.filter(o => o.type === filters.type);
      }
      if (filters.category) {
        opportunities = opportunities.filter(o => o.category === filters.category);
      }
      if (filters.priority) {
        const priorityRanges = {
          high: [81, 100],
          medium: [61, 80],
          low: [0, 60]
        };
        const [min, max] = priorityRanges[filters.priority];
        opportunities = opportunities.filter(o => o.priority.overall >= min && o.priority.overall <= max);
      }
      if (filters.status) {
        opportunities = opportunities.filter(o => o.status === filters.status);
      }
    }

    return opportunities.sort((a, b) => b.priority.overall - a.priority.overall);
  }

  /**
   * Ruft Opportunity Clusters ab
   */
  public getOpportunityClusters(locationKey: string): OpportunityCluster[] {
    return this.opportunityClusters.get(locationKey) || [];
  }

  /**
   * Ruft Local SEO Opportunity Report ab
   */
  public getLocalSEOOpportunityReport(locationKey: string): LocalSEOOpportunityReport | null {
    return this.opportunityReports.get(locationKey) || null;
  }

  /**
   * Aktualisiert Opportunity Status
   */
  public updateOpportunityStatus(opportunityId: string, status: SEOOpportunity['status'], assignedTo?: string): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const opportunities = this.opportunities.get(region.city.toLowerCase()) || [];
      const opportunity = opportunities.find(o => o.id === opportunityId);
      if (opportunity) {
        opportunity.status = status;
        opportunity.updatedAt = new Date().toISOString();
        if (assignedTo) {
          opportunity.assignedTo = assignedTo;
        }
      }
    });
  }

  /**
   * Generiert globale Opportunity Übersicht
   */
  public generateGlobalOpportunityOverview(): {
    totalOpportunities: number;
    opportunitiesByLocation: Array<{
      location: string;
      count: number;
      avgPriority: number;
      totalPotential: number;
    }>;
    topGlobalOpportunities: SEOOpportunity[];
    implementationCapacity: {
      requiredResources: number;
      availableCapacity: number;
      bottleneckAnalysis: string[];
    };
    strategicPriorities: string[];
  } {
    const allOpportunities: SEOOpportunity[] = [];
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const opportunities = this.opportunities.get(region.city.toLowerCase()) || [];
      allOpportunities.push(...opportunities);
    });

    const opportunitiesByLocation = PRIMARY_SERVICE_REGIONS.map(region => {
      const opportunities = this.opportunities.get(region.city.toLowerCase()) || [];
      return {
        location: region.city,
        count: opportunities.length,
        avgPriority: opportunities.length > 0 ?
          opportunities.reduce((sum, o) => sum + o.priority.overall, 0) / opportunities.length : 0,
        totalPotential: opportunities.reduce((sum, o) => sum + o.opportunity.potential, 0)
      };
    });

    const topGlobalOpportunities = allOpportunities
      .sort((a, b) => b.priority.overall - a.priority.overall)
      .slice(0, 10);

    const totalBudget = allOpportunities.reduce((sum, o) => sum + o.requirements.budget, 0);

    return {
      totalOpportunities: allOpportunities.length,
      opportunitiesByLocation,
      topGlobalOpportunities,
      implementationCapacity: {
        requiredResources: Math.ceil(totalBudget / 10000), // Rough estimate
        availableCapacity: 8, // Example capacity
        bottleneckAnalysis: [
          'Content-Erstellungskapazität',
          'Technische Entwicklungsressourcen',
          'Lokale Marktkenntnis'
        ]
      },
      strategicPriorities: [
        'Technische SEO Foundation stärken',
        'Content-Qualität und -Quantität erhöhen',
        'Lokale Sichtbarkeit maximieren',
        'Kundenbindung und Reputation verbessern',
        'Innovative Differenzierung entwickeln'
      ]
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localSEOOpportunityIdentificationService = new LocalSEOOpportunityIdentificationService();