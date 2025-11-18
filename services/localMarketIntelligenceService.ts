import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { predictiveLocalSearchTrendsService } from './predictiveLocalSearchTrendsService';

export interface DemographicProfile {
  locationKey: string;
  population: {
    total: number;
    density: number; // pro km²
    ageDistribution: {
      '0-17': number;
      '18-34': number;
      '35-54': number;
      '55-64': number;
      '65+': number;
    };
    householdTypes: {
      single: number;
      couples: number;
      families: number;
      seniors: number;
    };
  };
  income: {
    median: number;
    average: number;
    distribution: {
      low: number; // < 30k€
      middle: number; // 30-60k€
      high: number; // 60-100k€
      premium: number; // > 100k€
    };
  };
  education: {
    highSchool: number;
    bachelor: number;
    master: number;
    phd: number;
  };
  employment: {
    rate: number;
    sectors: {
      technology: number;
      manufacturing: number;
      services: number;
      construction: number;
      retail: number;
      other: number;
    };
  };
  housing: {
    ownership: number;
    rental: number;
    averagePrice: number;
    propertyTypes: {
      houses: number;
      apartments: number;
      condos: number;
    };
  };
}

export interface EconomicIndicators {
  locationKey: string;
  gdp: {
    total: number;
    perCapita: number;
    growth: number;
  };
  unemployment: {
    rate: number;
    trend: 'improving' | 'stable' | 'worsening';
    youthRate: number;
  };
  business: {
    totalBusinesses: number;
    startups: number;
    growthRate: number;
    sectors: {
      [sector: string]: {
        count: number;
        growth: number;
        avgRevenue: number;
      };
    };
  };
  realEstate: {
    prices: {
      residential: number;
      commercial: number;
      industrial: number;
    };
    trends: {
      residential: number; // Jahreswachstum in %
      commercial: number;
      industrial: number;
    };
  };
  consumerSpending: {
    total: number;
    categories: {
      housing: number;
      transportation: number;
      food: number;
      energy: number;
      services: number;
      discretionary: number;
    };
  };
}

export interface MarketPotential {
  locationKey: string;
  solarMarket: {
    currentPenetration: number; // % der Haushalte mit Solar
    potentialSize: number; // Marktvolumen in €
    growthRate: number; // Jährliches Wachstum
    adoptionBarriers: Array<{
      barrier: string;
      impact: number;
      solutions: string[];
    }>;
  };
  competitorAnalysis: {
    totalCompetitors: number;
    marketShare: {
      top3: number;
      top10: number;
      zoeSolar: number;
    };
    competitiveAdvantages: string[];
    threats: Array<{
      threat: string;
      probability: number;
      impact: number;
      mitigation: string[];
    }>;
  };
  customerSegments: Array<{
    segment: string;
    size: number;
    characteristics: string[];
    needs: string[];
    willingnessToPay: number;
    acquisitionCost: number;
    lifetimeValue: number;
  }>;
  opportunityScore: {
    overall: number; // 0-100
    factors: {
      marketSize: number;
      growth: number;
      competition: number;
      accessibility: number;
      profitability: number;
    };
  };
}

export interface ConsumerBehavior {
  locationKey: string;
  awareness: {
    solarTechnology: number; // % der Bevölkerung
    governmentIncentives: number;
    environmentalConcerns: number;
    costSavings: number;
  };
  decisionFactors: {
    cost: number; // Gewichtung 0-1
    reliability: number;
    aesthetics: number;
    environmental: number;
    incentives: number;
    recommendations: number;
  };
  purchaseIntent: {
    immediate: number; // % plant Installation in 6 Monaten
    shortTerm: number; // 6-12 Monate
    mediumTerm: number; // 1-2 Jahre
    longTerm: number; // >2 Jahre
  };
  informationSources: {
    onlineSearch: number;
    socialMedia: number;
    wordOfMouth: number;
    professionalAdvice: number;
    governmentSources: number;
    media: number;
  };
  barriers: Array<{
    barrier: string;
    affectedPopulation: number;
    severity: 'low' | 'medium' | 'high';
    solutions: string[];
  }>;
}

export interface LocalTrends {
  locationKey: string;
  emergingTrends: Array<{
    trend: string;
    category: 'technology' | 'policy' | 'economic' | 'social' | 'environmental';
    impact: 'positive' | 'negative' | 'neutral';
    strength: number; // 0-1
    timeframe: 'short' | 'medium' | 'long';
    affectedSegments: string[];
  }>;
  policyChanges: Array<{
    policy: string;
    type: 'incentive' | 'regulation' | 'funding';
    impact: number;
    effectiveDate: string;
    description: string;
  }>;
  economicDevelopments: Array<{
    development: string;
    type: 'growth' | 'decline' | 'stability';
    impact: number;
    affectedIndustries: string[];
  }>;
  socialMovements: Array<{
    movement: string;
    relevance: number;
    potentialImpact: number;
    alignment: 'positive' | 'negative' | 'neutral';
  }>;
}

export interface MarketIntelligenceReport {
  locationKey: string;
  generatedAt: string;
  summary: {
    marketMaturity: 'nascent' | 'growing' | 'mature' | 'saturated';
    opportunityLevel: 'low' | 'medium' | 'high' | 'excellent';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedStrategy: string;
  };
  keyInsights: Array<{
    insight: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    data: any;
    implications: string[];
  }>;
  recommendations: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
    expectedImpact: number;
    resources: string[];
    kpis: string[];
  }>;
  competitivePositioning: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    positioningStrategy: string;
  };
  forecast: {
    marketSize: Array<{ year: number; value: number; confidence: number }>;
    adoptionRate: Array<{ year: number; rate: number; confidence: number }>;
    revenuePotential: Array<{ year: number; value: number; confidence: number }>;
  };
}

/**
 * Local Market Intelligence Service
 * Umfassende Marktanalyse und Intelligence für lokale Märkte
 */
export class LocalMarketIntelligenceService {
  private demographicProfiles: Map<string, DemographicProfile> = new Map();
  private economicIndicators: Map<string, EconomicIndicators> = new Map();
  private marketPotentials: Map<string, MarketPotential> = new Map();
  private consumerBehaviors: Map<string, ConsumerBehavior> = new Map();
  private localTrends: Map<string, LocalTrends> = new Map();
  private intelligenceReports: Map<string, MarketIntelligenceReport> = new Map();

  constructor() {
    this.initializeDemographicProfiles();
    this.initializeEconomicIndicators();
    this.initializeMarketPotentials();
    this.initializeConsumerBehavior();
    this.initializeLocalTrends();
  }

  /**
   * Initialisiert demografische Profile
   */
  private initializeDemographicProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      // Simuliere realistische demografische Daten basierend auf Stadtgröße
      const basePopulation = region.population || 500000;
      const isLargeCity = basePopulation > 1000000;

      const profile: DemographicProfile = {
        locationKey,
        population: {
          total: basePopulation,
          density: isLargeCity ? 4000 : 2000,
          ageDistribution: {
            '0-17': 0.18,
            '18-34': isLargeCity ? 0.32 : 0.28,
            '35-54': 0.28,
            '55-64': 0.15,
            '65+': 0.07
          },
          householdTypes: {
            single: isLargeCity ? 0.45 : 0.35,
            couples: 0.25,
            families: 0.20,
            seniors: 0.10
          }
        },
        income: {
          median: isLargeCity ? 45000 : 38000,
          average: isLargeCity ? 55000 : 45000,
          distribution: {
            low: 0.25,
            middle: 0.45,
            high: 0.25,
            premium: 0.05
          }
        },
        education: {
          highSchool: 0.30,
          bachelor: 0.45,
          master: 0.20,
          phd: 0.05
        },
        employment: {
          rate: 0.92,
          sectors: {
            technology: isLargeCity ? 0.15 : 0.08,
            manufacturing: 0.12,
            services: 0.35,
            construction: 0.08,
            retail: 0.20,
            other: 0.10
          }
        },
        housing: {
          ownership: isLargeCity ? 0.35 : 0.55,
          rental: isLargeCity ? 0.65 : 0.45,
          averagePrice: isLargeCity ? 450000 : 320000,
          propertyTypes: {
            houses: isLargeCity ? 0.25 : 0.60,
            apartments: isLargeCity ? 0.65 : 0.30,
            condos: isLargeCity ? 0.10 : 0.10
          }
        }
      };

      this.demographicProfiles.set(locationKey, profile);
    });
  }

  /**
   * Initialisiert wirtschaftliche Indikatoren
   */
  private initializeEconomicIndicators(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const isLargeCity = (this.demographicProfiles.get(locationKey)?.population.total || 0) > 1000000;

      const indicators: EconomicIndicators = {
        locationKey,
        gdp: {
          total: isLargeCity ? 25000000000 : 8000000000, // in €
          perCapita: isLargeCity ? 55000 : 42000,
          growth: 0.025 + Math.random() * 0.01
        },
        unemployment: {
          rate: 0.045 + Math.random() * 0.02,
          trend: 'improving',
          youthRate: 0.08 + Math.random() * 0.03
        },
        business: {
          totalBusinesses: isLargeCity ? 45000 : 15000,
          startups: isLargeCity ? 1200 : 400,
          growthRate: 0.035,
          sectors: {
            'Solar & Energie': {
              count: isLargeCity ? 450 : 180,
              growth: 0.12,
              avgRevenue: 1200000
            },
            'Bauwesen': {
              count: isLargeCity ? 1200 : 480,
              growth: 0.08,
              avgRevenue: 800000
            },
            'Dienstleistungen': {
              count: isLargeCity ? 2800 : 1100,
              growth: 0.05,
              avgRevenue: 350000
            }
          }
        },
        realEstate: {
          prices: {
            residential: isLargeCity ? 4500 : 3200, // €/m²
            commercial: isLargeCity ? 2800 : 1800,
            industrial: isLargeCity ? 1200 : 800
          },
          trends: {
            residential: 0.06,
            commercial: 0.04,
            industrial: 0.02
          }
        },
        consumerSpending: {
          total: isLargeCity ? 12000000000 : 4000000000,
          categories: {
            housing: 0.28,
            transportation: 0.15,
            food: 0.12,
            energy: 0.08,
            services: 0.22,
            discretionary: 0.15
          }
        }
      };

      this.economicIndicators.set(locationKey, indicators);
    });
  }

  /**
   * Initialisiert Marktpotenziale
   */
  private initializeMarketPotentials(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const demographics = this.demographicProfiles.get(locationKey);
      const economics = this.economicIndicators.get(locationKey);

      if (!demographics || !economics) return;

      const totalHouseholds = Math.round(demographics.population.total * 0.35); // Annahme 2.8 Personen pro Haushalt
      const currentSolarPenetration = 0.08 + Math.random() * 0.06; // 8-14%
      const potentialCustomers = Math.round(totalHouseholds * (1 - currentSolarPenetration));

      const potential: MarketPotential = {
        locationKey,
        solarMarket: {
          currentPenetration: currentSolarPenetration,
          potentialSize: potentialCustomers * 15000, // Durchschnittlicher Auftragswert
          growthRate: 0.18 + Math.random() * 0.08,
          adoptionBarriers: [
            {
              barrier: 'Hohe Anfangsinvestition',
              impact: 0.35,
              solutions: ['Förderprogramme hervorheben', 'Finanzierungsmodelle anbieten', 'ROI-Rechner bereitstellen']
            },
            {
              barrier: 'Komplexität der Technologie',
              impact: 0.25,
              solutions: ['Einfache Erklärungen', 'Persönliche Beratung', 'Schritt-für-Schritt Guides']
            },
            {
              barrier: 'Zweifeln an Wirtschaftlichkeit',
              impact: 0.20,
              solutions: ['Fallstudien zeigen', 'Garantien anbieten', 'Langzeit-ROI darstellen']
            },
            {
              barrier: 'Fehlende Dachfläche',
              impact: 0.15,
              solutions: ['Alternative Lösungen vorschlagen', 'Dachanalyse anbieten', 'Mieter-Optionen prüfen']
            },
            {
              barrier: 'Regulatorische Unsicherheit',
              impact: 0.05,
              solutions: ['Regelmäßige Updates geben', 'Experten-Rat einholen', 'Rechtliche Beratung anbieten']
            }
          ]
        },
        competitorAnalysis: {
          totalCompetitors: Math.round(15 + Math.random() * 25),
          marketShare: {
            top3: 0.45 + Math.random() * 0.15,
            top10: 0.75 + Math.random() * 0.1,
            zoeSolar: 0.02 + Math.random() * 0.05
          },
          competitiveAdvantages: [
            'Lokale Expertise und Präsenz',
            'Premium-Service und Qualität',
            'Innovative Technologien',
            'Starke Markenreputation',
            'Umfassende Garantien'
          ],
          threats: [
            {
              threat: 'Preisaggressive Neueinsteiger',
              probability: 0.7,
              impact: 0.6,
              mitigation: ['Qualitätsvorteile betonen', 'Premium-Positionierung', 'Kundenbindung stärken']
            },
            {
              threat: 'Große Energieversorger expandieren',
              probability: 0.8,
              impact: 0.8,
              mitigation: ['Lokale Beziehungen nutzen', 'Spezialisierung betonen', 'Partnerschaften aufbauen']
            },
            {
              threat: 'Online-Only Anbieter',
              probability: 0.6,
              impact: 0.4,
              mitigation: ['Persönlichen Service hervorheben', 'Lokale Präsenz zeigen', 'Hybride Modelle entwickeln']
            }
          ]
        },
        customerSegments: [
          {
            segment: 'Junge Familien',
            size: 0.25,
            characteristics: ['25-45 Jahre', 'Einkommen 40-80k€', 'Eigentum', 'Umweltbewusst'],
            needs: ['Zuverlässige Energie', 'Kosteneinsparungen', 'Familienfreundliche Lösungen'],
            willingnessToPay: 0.8,
            acquisitionCost: 1200,
            lifetimeValue: 25000
          },
          {
            segment: 'Best Ager',
            size: 0.20,
            characteristics: ['55+ Jahre', 'Einkommen 50-100k€', 'Eigentum', 'Kostensenibel'],
            needs: ['Einfache Lösungen', 'Zuverlässigkeit', 'Gute Beratung'],
            willingnessToPay: 0.6,
            acquisitionCost: 800,
            lifetimeValue: 18000
          },
          {
            segment: 'Urban Professionals',
            size: 0.18,
            characteristics: ['30-50 Jahre', 'Hohes Einkommen', 'Mietwohnung', 'Technik-affin'],
            needs: ['Moderne Technologie', 'Flexibilität', 'Statussymbol'],
            willingnessToPay: 0.9,
            acquisitionCost: 1500,
            lifetimeValue: 35000
          },
          {
            segment: 'Kleine Unternehmen',
            size: 0.15,
            characteristics: ['KMU', 'Kostenbewusst', 'Nachhaltigkeitsziele'],
            needs: ['Business-Case', 'Steuerliche Vorteile', 'Schnelle Installation'],
            willingnessToPay: 0.7,
            acquisitionCost: 2000,
            lifetimeValue: 45000
          },
          {
            segment: 'Preisbewusste',
            size: 0.12,
            characteristics: ['Niedrigeres Einkommen', 'Preissensibel', 'Förderabhängig'],
            needs: ['Günstige Lösungen', 'Maximale Förderungen', 'Einfache Finanzierung'],
            willingnessToPay: 0.4,
            acquisitionCost: 600,
            lifetimeValue: 12000
          },
          {
            segment: 'Innovatoren',
            size: 0.10,
            characteristics: ['Technikbegeistert', 'Hohes Einkommen', 'Early Adopter'],
            needs: ['Neueste Technologie', 'Premium-Service', 'Exklusive Features'],
            willingnessToPay: 1.0,
            acquisitionCost: 2500,
            lifetimeValue: 55000
          }
        ],
        opportunityScore: {
          overall: 75 + Math.random() * 20,
          factors: {
            marketSize: 80,
            growth: 85,
            competition: 60,
            accessibility: 75,
            profitability: 70
          }
        }
      };

      this.marketPotentials.set(locationKey, potential);
    });
  }

  /**
   * Initialisiert Verbraucherverhalten
   */
  private initializeConsumerBehavior(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const demographics = this.demographicProfiles.get(locationKey);

      if (!demographics) return;

      const isUrban = demographics.population.density > 3000;

      const behavior: ConsumerBehavior = {
        locationKey,
        awareness: {
          solarTechnology: isUrban ? 0.65 : 0.55,
          governmentIncentives: 0.45,
          environmentalConcerns: 0.72,
          costSavings: 0.58
        },
        decisionFactors: {
          cost: 0.35,
          reliability: 0.25,
          aesthetics: 0.15,
          environmental: 0.15,
          incentives: 0.08,
          recommendations: 0.02
        },
        purchaseIntent: {
          immediate: 0.08,
          shortTerm: 0.15,
          mediumTerm: 0.25,
          longTerm: 0.32
        },
        informationSources: {
          onlineSearch: 0.45,
          socialMedia: 0.20,
          wordOfMouth: 0.18,
          professionalAdvice: 0.12,
          governmentSources: 0.04,
          media: 0.01
        },
        barriers: [
          {
            barrier: 'Hohe Investitionskosten',
            affectedPopulation: 0.40,
            severity: 'high',
            solutions: ['Förderprogramme', 'Finanzierungsmodelle', 'ROI-Rechner']
          },
          {
            barrier: 'Technische Komplexität',
            affectedPopulation: 0.30,
            severity: 'medium',
            solutions: ['Einfache Erklärungen', 'Persönliche Beratung', 'Schritt-für-Schritt Anleitungen']
          },
          {
            barrier: 'Unsicherheit über Wirtschaftlichkeit',
            affectedPopulation: 0.25,
            severity: 'medium',
            solutions: ['Fallstudien', 'Garantien', 'Langzeitanalysen']
          },
          {
            barrier: 'Fehlende Dachfläche',
            affectedPopulation: 0.15,
            severity: 'low',
            solutions: ['Alternative Standorte', 'Dachanalysen', 'Mieter-Lösungen']
          },
          {
            barrier: 'Zeitaufwand für Installation',
            affectedPopulation: 0.20,
            severity: 'low',
            solutions: ['Schnelle Installation', 'Projektmanagement', 'Regelmäßige Updates']
          }
        ]
      };

      this.consumerBehaviors.set(locationKey, behavior);
    });
  }

  /**
   * Initialisiert lokale Trends
   */
  private initializeLocalTrends(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();

      const trends: LocalTrends = {
        locationKey,
        emergingTrends: [
          {
            trend: 'Elektromobilität Integration',
            category: 'technology',
            impact: 'positive',
            strength: 0.75,
            timeframe: 'medium',
            affectedSegments: ['Urban Professionals', 'Junge Familien', 'Innovatoren']
          },
          {
            trend: 'Nachhaltigkeitsfokus',
            category: 'social',
            impact: 'positive',
            strength: 0.82,
            timeframe: 'long',
            affectedSegments: ['Alle Segmente']
          },
          {
            trend: 'Energiekostenanstieg',
            category: 'economic',
            impact: 'positive',
            strength: 0.68,
            timeframe: 'short',
            affectedSegments: ['Preisbewusste', 'Best Ager', 'Kleine Unternehmen']
          },
          {
            trend: 'Smart Home Integration',
            category: 'technology',
            impact: 'positive',
            strength: 0.60,
            timeframe: 'medium',
            affectedSegments: ['Urban Professionals', 'Innovatoren']
          },
          {
            trend: 'Wettbewerbszunahme',
            category: 'economic',
            impact: 'negative',
            strength: 0.55,
            timeframe: 'medium',
            affectedSegments: ['Alle Segmente']
          }
        ],
        policyChanges: [
          {
            policy: 'Erhöhte Solarförderungen 2024',
            type: 'incentive',
            impact: 0.8,
            effectiveDate: '2024-01-01',
            description: 'Verdoppelung der Einspeisevergütung und neue Investitionszuschüsse'
          },
          {
            policy: 'Netzanschluss-Beschleunigung',
            type: 'regulation',
            impact: 0.6,
            effectiveDate: '2024-03-01',
            description: 'Verkürzung der Genehmigungszeiten für Solaranlagen'
          },
          {
            policy: 'CO2-Preis Reform',
            type: 'economic',
            impact: 0.7,
            effectiveDate: '2024-07-01',
            description: 'Erhöhung des CO2-Preises macht Solaranlagen attraktiver'
          }
        ],
        economicDevelopments: [
          {
            development: 'Wirtschaftswachstum +2.5%',
            type: 'growth',
            impact: 0.6,
            affectedIndustries: ['Bauwesen', 'Energie', 'Dienstleistungen']
          },
          {
            development: 'Start-up Szene Expansion',
            type: 'growth',
            impact: 0.5,
            affectedIndustries: ['Technologie', 'Energie', 'Dienstleistungen']
          },
          {
            development: 'Gewerbeimmobilien Boom',
            type: 'growth',
            impact: 0.4,
            affectedIndustries: ['Bauwesen', 'Immobilien']
          }
        ],
        socialMovements: [
          {
            movement: 'Fridays for Future',
            relevance: 0.8,
            potentialImpact: 0.7,
            alignment: 'positive'
          },
          {
            movement: 'Nachhaltiger Konsum',
            relevance: 0.9,
            potentialImpact: 0.8,
            alignment: 'positive'
          },
          {
            movement: 'Energiewende-Unterstützung',
            relevance: 0.85,
            potentialImpact: 0.75,
            alignment: 'positive'
          }
        ]
      };

      this.localTrends.set(locationKey, trends);
    });
  }

  /**
   * Generiert Market Intelligence Report
   */
  public generateMarketIntelligenceReport(locationKey: string): MarketIntelligenceReport {
    const demographics = this.demographicProfiles.get(locationKey);
    const economics = this.economicIndicators.get(locationKey);
    const potential = this.marketPotentials.get(locationKey);
    const behavior = this.consumerBehaviors.get(locationKey);
    const trends = this.localTrends.get(locationKey);

    if (!demographics || !economics || !potential || !behavior || !trends) {
      throw new Error(`Unvollständige Daten für ${locationKey}`);
    }

    const opportunityScore = potential.opportunityScore.overall;
    const marketMaturity = opportunityScore > 80 ? 'nascent' :
                          opportunityScore > 60 ? 'growing' :
                          opportunityScore > 40 ? 'mature' : 'saturated';

    const report: MarketIntelligenceReport = {
      locationKey,
      generatedAt: new Date().toISOString(),
      summary: {
        marketMaturity,
        opportunityLevel: opportunityScore > 80 ? 'excellent' :
                         opportunityScore > 60 ? 'high' :
                         opportunityScore > 40 ? 'medium' : 'low',
        riskLevel: potential.competitorAnalysis.threats.reduce((sum, t) => sum + t.probability * t.impact, 0) > 0.5 ? 'high' : 'medium',
        recommendedStrategy: this.determineStrategy(potential, behavior, trends)
      },
      keyInsights: [
        {
          insight: `Marktpotenzial: ${Math.round(potential.solarMarket.potentialSize / 1000000)}M€ verfügbar`,
          importance: 'critical',
          data: potential.solarMarket,
          implications: [
            'Hohe Expansionsmöglichkeiten',
            'Fokussierung auf Wachstumssegmente',
            'Investition in Marketing erforderlich'
          ]
        },
        {
          insight: `${Math.round(behavior.awareness.solarTechnology * 100)}% der Bevölkerung kennen Solartechnologie`,
          importance: 'high',
          data: behavior.awareness,
          implications: [
            'Bewusstseins-Kampagnen für verbleibende 35%',
            'Fokussierung auf Aufklärung',
            'Word-of-Mouth Marketing stärken'
          ]
        },
        {
          insight: `${potential.competitorAnalysis.totalCompetitors} Wettbewerber im Markt`,
          importance: 'high',
          data: potential.competitorAnalysis,
          implications: [
            'Differenzierung durch Service-Qualität',
            'Lokale Präsenz als Wettbewerbsvorteil',
            'Premium-Positionierung'
          ]
        },
        {
          insight: `Durchschnittliches Einkommen: ${Math.round(demographics.income.average)}€`,
          importance: 'medium',
          data: demographics.income,
          implications: [
            'Preisstrategie an Zahlungsbereitschaft anpassen',
            'Finanzierungsmodelle für verschiedene Einkommensgruppen',
            'Zielgruppenspezifische Angebote'
          ]
        }
      ],
      recommendations: [
        {
          action: 'Lokale Marketing-Kampagne starten',
          priority: 'high',
          timeframe: '3 Monate',
          expectedImpact: 0.25,
          resources: ['Marketing-Budget', 'Lokale Agenturen', 'Content-Team'],
          kpis: ['Lead-Generierung', 'Markenbekanntheit', 'Website-Traffic']
        },
        {
          action: 'Vertriebskanäle ausbauen',
          priority: 'high',
          timeframe: '6 Monate',
          expectedImpact: 0.30,
          resources: ['Vertriebs-Team', 'Partnerschaften', 'Technologie-Investitionen'],
          kpis: ['Verkäufe', 'Marktanteil', 'Kundenakquise-Kosten']
        },
        {
          action: 'Kundenbindungsprogramm entwickeln',
          priority: 'medium',
          timeframe: '4 Monate',
          expectedImpact: 0.15,
          resources: ['CRM-System', 'Kundenbetreuung', 'Loyalty-Programm'],
          kpis: ['Kundenbindungsrate', 'Wiederholungskäufe', 'Kundenlebenswert']
        },
        {
          action: 'Technologie-Investitionen prüfen',
          priority: 'medium',
          timeframe: '12 Monate',
          expectedImpact: 0.20,
          resources: ['IT-Budget', 'Entwicklungsteam', 'Partnerschaften'],
          kpis: ['Prozesseffizienz', 'Kundenzufriedenheit', 'Kosteneinsparungen']
        }
      ],
      competitivePositioning: {
        strengths: potential.competitorAnalysis.competitiveAdvantages,
        weaknesses: [
          'Begrenzte Markenbekanntheit',
          'Höhere Preise als Discounter',
          'Begrenzte Ressourcen für nationale Expansion'
        ],
        opportunities: [
          'Wachsender Markt für Premium-Solarlösungen',
          'Lokale Präsenz als Differenzierungsmerkmal',
          'Technologische Innovationen',
          'Partnerschaften mit lokalen Unternehmen'
        ],
        threats: potential.competitorAnalysis.threats.map(t => t.threat),
        positioningStrategy: 'Premium-Qualitätsanbieter mit lokaler Expertise und persönlichem Service'
      },
      forecast: {
        marketSize: [
          { year: 2024, value: potential.solarMarket.potentialSize * 0.8, confidence: 0.85 },
          { year: 2025, value: potential.solarMarket.potentialSize * 0.9, confidence: 0.80 },
          { year: 2026, value: potential.solarMarket.potentialSize, confidence: 0.75 },
          { year: 2027, value: potential.solarMarket.potentialSize * 1.15, confidence: 0.70 }
        ],
        adoptionRate: [
          { year: 2024, rate: potential.solarMarket.currentPenetration + 0.02, confidence: 0.85 },
          { year: 2025, rate: potential.solarMarket.currentPenetration + 0.05, confidence: 0.80 },
          { year: 2026, rate: potential.solarMarket.currentPenetration + 0.08, confidence: 0.75 },
          { year: 2027, rate: potential.solarMarket.currentPenetration + 0.12, confidence: 0.70 }
        ],
        revenuePotential: [
          { year: 2024, value: potential.solarMarket.potentialSize * 0.15, confidence: 0.80 },
          { year: 2025, value: potential.solarMarket.potentialSize * 0.25, confidence: 0.75 },
          { year: 2026, value: potential.solarMarket.potentialSize * 0.35, confidence: 0.70 },
          { year: 2027, value: potential.solarMarket.potentialSize * 0.45, confidence: 0.65 }
        ]
      }
    };

    this.intelligenceReports.set(locationKey, report);
    return report;
  }

  /**
   * Bestimmt empfohlene Strategie
   */
  private determineStrategy(potential: MarketPotential, behavior: ConsumerBehavior, trends: LocalTrends): string {
    const opportunityScore = potential.opportunityScore.overall;
    const awareness = behavior.awareness.solarTechnology;
    const competition = potential.competitorAnalysis.marketShare.top3;

    if (opportunityScore > 80 && awareness < 0.6) {
      return 'Markenaufbau und Marktdurchdringung';
    } else if (opportunityScore > 60 && competition < 0.5) {
      return 'Aggressive Marktexpansion';
    } else if (opportunityScore > 40 && awareness > 0.7) {
      return 'Kundenbindungs- und Cross-Selling Strategie';
    } else {
      return 'Nischenstrategie und Premium-Positionierung';
    }
  }

  /**
   * Ruft demografisches Profil ab
   */
  public getDemographicProfile(locationKey: string): DemographicProfile | null {
    return this.demographicProfiles.get(locationKey) || null;
  }

  /**
   * Ruft wirtschaftliche Indikatoren ab
   */
  public getEconomicIndicators(locationKey: string): EconomicIndicators | null {
    return this.economicIndicators.get(locationKey) || null;
  }

  /**
   * Ruft Marktpotenzial ab
   */
  public getMarketPotential(locationKey: string): MarketPotential | null {
    return this.marketPotentials.get(locationKey) || null;
  }

  /**
   * Ruft Verbraucherverhalten ab
   */
  public getConsumerBehavior(locationKey: string): ConsumerBehavior | null {
    return this.consumerBehaviors.get(locationKey) || null;
  }

  /**
   * Ruft lokale Trends ab
   */
  public getLocalTrends(locationKey: string): LocalTrends | null {
    return this.localTrends.get(locationKey) || null;
  }

  /**
   * Ruft Market Intelligence Report ab
   */
  public getMarketIntelligenceReport(locationKey: string): MarketIntelligenceReport | null {
    return this.intelligenceReports.get(locationKey) || null;
  }

  /**
   * Generiert globale Marktübersicht
   */
  public generateGlobalMarketOverview(): {
    totalMarketPotential: number;
    averageOpportunityScore: number;
    topOpportunities: Array<{
      location: string;
      score: number;
      potential: number;
      priority: string;
    }>;
    marketTrends: Array<{
      trend: string;
      affectedLocations: string[];
      impact: number;
    }>;
    strategicRecommendations: string[];
  } {
    const allPotentials = Array.from(this.marketPotentials.values());
    const allTrends = Array.from(this.localTrends.values());

    const totalMarketPotential = allPotentials.reduce((sum, p) => sum + p.solarMarket.potentialSize, 0);
    const averageOpportunityScore = allPotentials.reduce((sum, p) => sum + p.opportunityScore.overall, 0) / allPotentials.length;

    const topOpportunities = allPotentials
      .sort((a, b) => b.opportunityScore.overall - a.opportunityScore.overall)
      .slice(0, 5)
      .map(p => ({
        location: p.locationKey,
        score: p.opportunityScore.overall,
        potential: p.solarMarket.potentialSize,
        priority: p.opportunityScore.overall > 80 ? 'high' : p.opportunityScore.overall > 60 ? 'medium' : 'low'
      }));

    const trendMap = new Map<string, { locations: string[], impacts: number[] }>();
    allTrends.forEach(t => {
      t.emergingTrends.forEach(trend => {
        if (!trendMap.has(trend.trend)) {
          trendMap.set(trend.trend, { locations: [], impacts: [] });
        }
        const data = trendMap.get(trend.trend)!;
        data.locations.push(t.locationKey);
        data.impacts.push(trend.strength);
      });
    });

    const marketTrends = Array.from(trendMap.entries())
      .map(([trend, data]) => ({
        trend,
        affectedLocations: data.locations,
        impact: data.impacts.reduce((sum, i) => sum + i, 0) / data.impacts.length
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);

    const strategicRecommendations = [
      'Fokussiere Ressourcen auf Top-5 Märkte mit höchstem Potenzial',
      'Entwickle lokale Marketing-Strategien für jeden Markt',
      'Baue Partnerschaften mit lokalen Stakeholdern auf',
      'Investiere in Daten und Analysen für bessere Entscheidungen',
      'Entwickle skalierbare Prozesse für Multi-Markt-Expansion'
    ];

    return {
      totalMarketPotential,
      averageOpportunityScore,
      topOpportunities,
      marketTrends,
      strategicRecommendations
    };
  }

  /**
   * Identifiziert Marktchancen
   */
  public identifyMarketOpportunities(locationKey: string): Array<{
    opportunity: string;
    type: 'segment' | 'trend' | 'gap' | 'partnership';
    potential: number;
    difficulty: 'low' | 'medium' | 'high';
    timeframe: string;
    requiredResources: string[];
  }> {
    const potential = this.marketPotentials.get(locationKey);
    const behavior = this.consumerBehaviors.get(locationKey);
    const trends = this.localTrends.get(locationKey);

    if (!potential || !behavior || !trends) return [];

    const opportunities = [];

    // Segment-Opportunities
    potential.customerSegments.forEach(segment => {
      if (segment.willingnessToPay > 0.7 && segment.lifetimeValue > 20000) {
        opportunities.push({
          opportunity: `Premium-Service für ${segment.segment}`,
          type: 'segment',
          potential: segment.lifetimeValue * segment.size * 100,
          difficulty: 'medium',
          timeframe: '6 Monate',
          requiredResources: ['Premium-Produkte', 'Personalisierter Service', 'Marketing-Budget']
        });
      }
    });

    // Trend-Opportunities
    trends.emergingTrends.forEach(trend => {
      if (trend.impact === 'positive' && trend.strength > 0.6) {
        opportunities.push({
          opportunity: `Ausnutzung Trend: ${trend.trend}`,
          type: 'trend',
          potential: trend.strength * 50000,
          difficulty: trend.timeframe === 'short' ? 'low' : 'medium',
          timeframe: trend.timeframe === 'short' ? '3 Monate' : '6 Monate',
          requiredResources: ['Trend-Analyse', 'Anpassung Produkte/Services', 'Marketing']
        });
      }
    });

    // Gap-Opportunities
    behavior.barriers.forEach(barrier => {
      if (barrier.affectedPopulation > 0.3) {
        opportunities.push({
          opportunity: `Lösung für Barriere: ${barrier.barrier}`,
          type: 'gap',
          potential: barrier.affectedPopulation * 25000,
          difficulty: 'medium',
          timeframe: '4 Monate',
          requiredResources: ['Produktentwicklung', 'Service-Verbesserungen', 'Kommunikation']
        });
      }
    });

    return opportunities.sort((a, b) => b.potential - a.potential);
  }

  /**
   * Analysiert Wettbewerbsposition
   */
  public analyzeCompetitivePosition(locationKey: string): {
    position: 'leader' | 'challenger' | 'follower' | 'niche';
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    recommendedActions: Array<{
      action: string;
      priority: 'high' | 'medium' | 'low';
      rationale: string;
    }>;
  } {
    const potential = this.marketPotentials.get(locationKey);
    if (!potential) throw new Error(`Marktpotenzial für ${locationKey} nicht gefunden`);

    const marketShare = potential.competitorAnalysis.marketShare.zoeSolar;
    const position = marketShare > 0.15 ? 'leader' :
                    marketShare > 0.08 ? 'challenger' :
                    marketShare > 0.03 ? 'follower' : 'niche';

    const strengths = potential.competitorAnalysis.competitiveAdvantages;
    const weaknesses = [
      'Begrenzte Markenbekanntheit',
      'Höhere Preise als Discounter',
      'Begrenzte Ressourcen'
    ];

    const opportunities = [
      'Wachsender Markt für Premium-Lösungen',
      'Lokale Präsenz als Differenzierungsmerkmal',
      'Technologische Überlegenheit',
      'Starke Kundenbindung möglich'
    ];

    const threats = potential.competitorAnalysis.threats.map(t => t.threat);

    const recommendedActions = [
      {
        action: 'Lokale Marketing-Kampagnen intensivieren',
        priority: 'high',
        rationale: 'Markenbekanntheit aufbauen und Marktanteil erhöhen'
      },
      {
        action: 'Premium-Positionierung stärken',
        priority: 'high',
        rationale: 'Differenzierung von preisgetriebenen Wettbewerbern'
      },
      {
        action: 'Kundenbindungsprogramme entwickeln',
        priority: 'medium',
        rationale: 'Wiederholungskäufe und Weiterempfehlungen fördern'
      },
      {
        action: 'Partnerschaften mit lokalen Unternehmen',
        priority: 'medium',
        rationale: 'Lokale Präsenz stärken und Vertrauen aufbauen'
      }
    ];

    return {
      position,
      strengths,
      weaknesses,
      opportunities,
      threats,
      recommendedActions
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localMarketIntelligenceService = new LocalMarketIntelligenceService();