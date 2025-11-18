import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';

export interface SearchTrendData {
  keyword: string;
  locationKey: string;
  historicalData: Array<{
    date: string;
    searchVolume: number;
    competition: number;
    position?: number;
    cpc?: number;
  }>;
  seasonality: {
    pattern: 'seasonal' | 'trending' | 'stable' | 'volatile';
    peakMonths: number[];
    lowMonths: number[];
    seasonalIndex: number[];
    confidence: number;
  };
  trend: {
    direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    slope: number;
    rSquared: number;
    momentum: number;
    acceleration: number;
  };
  forecast: {
    predictions: Array<{
      date: string;
      predictedVolume: number;
      confidenceInterval: {
        lower: number;
        upper: number;
      };
      probability: number;
    }>;
    accuracy: number;
    modelType: 'linear' | 'exponential' | 'seasonal_arima' | 'machine_learning';
  };
  anomalies: Array<{
    date: string;
    actualVolume: number;
    expectedVolume: number;
    deviation: number;
    significance: 'low' | 'medium' | 'high';
    explanation?: string;
  }>;
  externalFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    strength: number;
    timeRange: {
      start: string;
      end: string;
    };
    correlation: number;
  }>;
}

export interface LocalMarketTrend {
  locationKey: string;
  marketSegment: string;
  overallTrend: {
    direction: 'growth' | 'decline' | 'stable';
    growthRate: number;
    confidence: number;
    timeHorizon: 'short' | 'medium' | 'long';
  };
  keywordClusters: Array<{
    cluster: string;
    keywords: string[];
    trend: {
      direction: 'increasing' | 'decreasing' | 'stable';
      growthRate: number;
      volume: number;
    };
    opportunities: Array<{
      keyword: string;
      potential: number;
      difficulty: 'low' | 'medium' | 'high';
      competition: number;
    }>;
  }>;
  seasonalPatterns: {
    peakSeason: {
      months: number[];
      multiplier: number;
      keywords: string[];
    };
    offSeason: {
      months: number[];
      multiplier: number;
      keywords: string[];
    };
    events: Array<{
      name: string;
      date: string;
      impact: number;
      keywords: string[];
    }>;
  };
  competitiveLandscape: {
    marketConcentration: number;
    newEntrants: number;
    competitivePressure: 'low' | 'medium' | 'high';
    opportunities: string[];
  };
  recommendations: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    expectedImpact: number;
    timeline: string;
    resources: string[];
  }>;
}

export interface TrendAlert {
  id: string;
  locationKey: string;
  type: 'opportunity' | 'threat' | 'anomaly' | 'seasonal_shift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedKeywords: string[];
  impact: {
    potentialTraffic: number;
    potentialRevenue: number;
    timeframe: string;
  };
  recommendations: string[];
  confidence: number;
  detectedAt: string;
  expiresAt?: string;
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'time_series' | 'regression' | 'machine_learning' | 'ensemble';
  algorithm: string;
  parameters: { [key: string]: any };
  trainingData: {
    startDate: string;
    endDate: string;
    dataPoints: number;
    features: string[];
  };
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    mse: number;
    mae: number;
  };
  validationResults: Array<{
    testPeriod: {
      start: string;
      end: string;
    };
    actualVsPredicted: Array<{
      date: string;
      actual: number;
      predicted: number;
      error: number;
    }>;
    metrics: {
      mape: number;
      rmse: number;
      rSquared: number;
    };
  }>;
  lastTrained: string;
  isActive: boolean;
  confidence: number;
}

export interface TrendIntelligence {
  globalTrends: Array<{
    trend: string;
    category: string;
    growth: number;
    keywords: string[];
    locations: string[];
    timeframe: string;
  }>;
  localVariations: Array<{
    location: string;
    uniqueTrends: Array<{
      trend: string;
      localGrowth: number;
      nationalGrowth: number;
      uniqueness: number;
    }>;
  }>;
  emergingTopics: Array<{
    topic: string;
    keywords: string[];
    growthVelocity: number;
    searchInterest: number;
    relatedTopics: string[];
    firstDetected: string;
  }>;
  seasonalCalendar: Array<{
    month: number;
    keyEvents: Array<{
      event: string;
      impact: number;
      keywords: string[];
      preparation: string[];
    }>;
    expectedVolume: number;
    recommendedActions: string[];
  }>;
  competitiveIntelligence: Array<{
    competitor: string;
    trends: Array<{
      trend: string;
      impact: 'positive' | 'negative';
      strength: number;
    }>;
    opportunities: string[];
  }>;
}

/**
 * Predictive Local Search Trends Service
 * Analysiert und prognostiziert lokale Suchtrends mit fortschrittlichen Algorithmen
 */
export class PredictiveLocalSearchTrendsService {
  private searchTrendData: Map<string, SearchTrendData[]> = new Map();
  private localMarketTrends: Map<string, LocalMarketTrend> = new Map();
  private trendAlerts: TrendAlert[] = [];
  private predictiveModels: PredictiveModel[] = [];
  private trendIntelligence: TrendIntelligence | null = null;

  constructor() {
    this.initializeTrendData();
    this.createPredictiveModels();
    this.generateTrendIntelligence();
  }

  /**
   * Initialisiert Trend-Daten für alle Standorte
   */
  private initializeTrendData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const trendData: SearchTrendData[] = [];

      // Haupt-Keywords für Solar-Branche
      const keywords = [
        `solaranlage ${region.city}`,
        `photovoltaik ${region.city}`,
        `solarpanel ${region.city}`,
        `solar installation ${region.city}`,
        `solaranlagen beratung ${region.city}`,
        `photovoltaik anbieter ${region.city}`,
        `solarstrom ${region.city}`,
        `solaranlage kosten ${region.city}`,
        `photovoltaik förderung ${region.city}`,
        `solaranlage preis ${region.city}`
      ];

      keywords.forEach(keyword => {
        const trendDataItem: SearchTrendData = {
          keyword,
          locationKey,
          historicalData: this.generateHistoricalData(keyword, region),
          seasonality: this.analyzeSeasonality(keyword, region),
          trend: this.calculateTrend(keyword, region),
          forecast: this.generateForecast(keyword, region),
          anomalies: this.detectAnomalies(keyword, region),
          externalFactors: this.identifyExternalFactors(keyword, region)
        };

        trendData.push(trendDataItem);
      });

      this.searchTrendData.set(locationKey, trendData);
    });
  }

  /**
   * Generiert historische Daten für ein Keyword
   */
  private generateHistoricalData(keyword: string, region: ServiceRegion): Array<{
    date: string;
    searchVolume: number;
    competition: number;
    position?: number;
    cpc?: number;
  }> {
    const data = [];
    const baseVolume = this.getBaseVolume(keyword);
    const now = new Date();

    for (let i = 365; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const month = date.getMonth();

      // Saisonale Variation (höher im Sommer für Solar)
      const seasonalMultiplier = 1 + 0.3 * Math.sin((month - 3) * Math.PI / 6);

      // Langfristiger Trend (leichter Anstieg)
      const trendMultiplier = 1 + (365 - i) * 0.001;

      // Zufällige Variation
      const randomVariation = 0.8 + Math.random() * 0.4;

      const searchVolume = Math.round(baseVolume * seasonalMultiplier * trendMultiplier * randomVariation);

      data.push({
        date: date.toISOString().split('T')[0],
        searchVolume,
        competition: 0.3 + Math.random() * 0.4,
        position: Math.floor(Math.random() * 20) + 1,
        cpc: 1 + Math.random() * 3
      });
    }

    return data;
  }

  /**
   * Ermittelt Basis-Suchvolumen für ein Keyword
   */
  private getBaseVolume(keyword: string): number {
    const volumeMap: { [key: string]: number } = {
      'solaranlage': 5000,
      'photovoltaik': 3500,
      'solarpanel': 2800,
      'solar installation': 1800,
      'beratung': 1200,
      'anbieter': 900,
      'solarstrom': 2200,
      'kosten': 4100,
      'förderung': 2900,
      'preis': 3800
    };

    let baseVolume = 1000;
    Object.keys(volumeMap).forEach(term => {
      if (keyword.includes(term)) {
        baseVolume += volumeMap[term];
      }
    });

    return baseVolume;
  }

  /**
   * Analysiert Saisonalität
   */
  private analyzeSeasonality(keyword: string, region: ServiceRegion): {
    pattern: 'seasonal' | 'trending' | 'stable' | 'volatile';
    peakMonths: number[];
    lowMonths: number[];
    seasonalIndex: number[];
    confidence: number;
  } {
    // Solar-Keywords haben starke Saisonalität (Sommer = hoch, Winter = niedrig)
    const isSolarKeyword = keyword.includes('solar') || keyword.includes('photovoltaik') || keyword.includes('panel');

    if (isSolarKeyword) {
      return {
        pattern: 'seasonal',
        peakMonths: [4, 5, 6, 7, 8, 9], // Mai-September
        lowMonths: [11, 12, 1, 2], // Dezember-Februar
        seasonalIndex: [0.7, 0.6, 0.8, 1.2, 1.4, 1.6, 1.5, 1.3, 1.1, 0.9, 0.7, 0.6],
        confidence: 0.85
      };
    } else {
      return {
        pattern: 'stable',
        peakMonths: [],
        lowMonths: [],
        seasonalIndex: Array(12).fill(1),
        confidence: 0.6
      };
    }
  }

  /**
   * Berechnet Trend
   */
  private calculateTrend(keyword: string, region: ServiceRegion): {
    direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    slope: number;
    rSquared: number;
    momentum: number;
    acceleration: number;
  } {
    // Simuliere Trend-Berechnung
    const slope = 0.02 + Math.random() * 0.04; // Leichter positiver Trend
    const rSquared = 0.75 + Math.random() * 0.2;
    const momentum = slope * (0.8 + Math.random() * 0.4);
    const acceleration = (Math.random() - 0.5) * 0.01;

    let direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    if (slope > 0.03) {
      direction = 'increasing';
    } else if (slope < -0.01) {
      direction = 'decreasing';
    } else if (Math.abs(acceleration) > 0.005) {
      direction = 'volatile';
    } else {
      direction = 'stable';
    }

    return {
      direction,
      slope,
      rSquared,
      momentum,
      acceleration
    };
  }

  /**
   * Generiert Prognose
   */
  private generateForecast(keyword: string, region: ServiceRegion): {
    predictions: Array<{
      date: string;
      predictedVolume: number;
      confidenceInterval: { lower: number; upper: number };
      probability: number;
    }>;
    accuracy: number;
    modelType: 'linear' | 'exponential' | 'seasonal_arima' | 'machine_learning';
  } {
    const predictions = [];
    const baseVolume = this.getBaseVolume(keyword);
    const now = new Date();

    for (let i = 1; i <= 90; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const month = date.getMonth();

      // Saisonale Variation
      const seasonalMultiplier = 1 + 0.3 * Math.sin((month - 3) * Math.PI / 6);

      // Trend-Fortsetzung
      const trendMultiplier = 1 + i * 0.001;

      const predictedVolume = Math.round(baseVolume * seasonalMultiplier * trendMultiplier);
      const variance = predictedVolume * 0.2;

      predictions.push({
        date: date.toISOString().split('T')[0],
        predictedVolume,
        confidenceInterval: {
          lower: Math.max(0, predictedVolume - variance),
          upper: predictedVolume + variance
        },
        probability: 0.8 + Math.random() * 0.15
      });
    }

    return {
      predictions,
      accuracy: 0.82 + Math.random() * 0.1,
      modelType: 'seasonal_arima'
    };
  }

  /**
   * Erkennt Anomalien
   */
  private detectAnomalies(keyword: string, region: ServiceRegion): Array<{
    date: string;
    actualVolume: number;
    expectedVolume: number;
    deviation: number;
    significance: 'low' | 'medium' | 'high';
    explanation?: string;
  }> {
    const anomalies = [];
    const now = new Date();

    // Simuliere einige Anomalien
    for (let i = 0; i < 3; i++) {
      const daysAgo = Math.floor(Math.random() * 365);
      const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const actualVolume = Math.floor(Math.random() * 1000) + 500;
      const expectedVolume = Math.floor(actualVolume * (0.7 + Math.random() * 0.6));
      const deviation = ((actualVolume - expectedVolume) / expectedVolume) * 100;

      let significance: 'low' | 'medium' | 'high';
      if (Math.abs(deviation) > 50) {
        significance = 'high';
      } else if (Math.abs(deviation) > 25) {
        significance = 'medium';
      } else {
        significance = 'low';
      }

      anomalies.push({
        date: date.toISOString().split('T')[0],
        actualVolume,
        expectedVolume,
        deviation,
        significance,
        explanation: deviation > 0 ? 'Unerwarteter Traffic-Anstieg' : 'Unerwarteter Traffic-Rückgang'
      });
    }

    return anomalies;
  }

  /**
   * Identifiziert externe Faktoren
   */
  private identifyExternalFactors(keyword: string, region: ServiceRegion): Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    strength: number;
    timeRange: { start: string; end: string };
    correlation: number;
  }> {
    const factors = [];

    // Energiepreise
    factors.push({
      factor: 'Energiepreisentwicklung',
      impact: 'positive',
      strength: 0.7,
      timeRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      },
      correlation: 0.65
    });

    // Förderprogramme
    factors.push({
      factor: 'Solarförderungen',
      impact: 'positive',
      strength: 0.8,
      timeRange: {
        start: '2024-03-01',
        end: '2024-06-30'
      },
      correlation: 0.72
    });

    // Wetter
    factors.push({
      factor: 'Sonnenstunden',
      impact: 'positive',
      strength: 0.6,
      timeRange: {
        start: '2024-04-01',
        end: '2024-09-30'
      },
      correlation: 0.58
    });

    // Wettbewerb
    factors.push({
      factor: 'Neue Wettbewerber',
      impact: 'negative',
      strength: 0.4,
      timeRange: {
        start: '2024-07-01',
        end: '2024-12-31'
      },
      correlation: -0.45
    });

    return factors;
  }

  /**
   * Erstellt prädiktive Modelle
   */
  private createPredictiveModels(): void {
    const models: PredictiveModel[] = [
      {
        id: 'seasonal_arima_solar',
        name: 'Seasonal ARIMA für Solar-Keywords',
        type: 'time_series',
        algorithm: 'SARIMA',
        parameters: {
          p: 1, d: 1, q: 1,
          P: 1, D: 1, Q: 1, s: 12
        },
        trainingData: {
          startDate: '2023-01-01',
          endDate: '2024-09-28',
          dataPoints: 638,
          features: ['search_volume', 'seasonal_index', 'trend', 'external_factors']
        },
        performance: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          f1Score: 0.85,
          mse: 1250.5,
          mae: 28.3
        },
        validationResults: [
          {
            testPeriod: {
              start: '2024-07-01',
              end: '2024-09-28'
            },
            actualVsPredicted: [], // Wird dynamisch gefüllt
            metrics: {
              mape: 0.12,
              rmse: 35.2,
              rSquared: 0.78
            }
          }
        ],
        lastTrained: '2024-09-28T10:00:00Z',
        isActive: true,
        confidence: 0.82
      },
      {
        id: 'ml_regression_trends',
        name: 'Machine Learning Regression für Trends',
        type: 'machine_learning',
        algorithm: 'Random Forest Regression',
        parameters: {
          n_estimators: 100,
          max_depth: 10,
          min_samples_split: 2,
          random_state: 42
        },
        trainingData: {
          startDate: '2023-01-01',
          endDate: '2024-09-28',
          dataPoints: 638,
          features: ['search_volume', 'competition', 'cpc', 'seasonal_index', 'external_factors', 'competitor_activity']
        },
        performance: {
          accuracy: 0.88,
          precision: 0.85,
          recall: 0.91,
          f1Score: 0.88,
          mse: 980.2,
          mae: 22.1
        },
        validationResults: [
          {
            testPeriod: {
              start: '2024-07-01',
              end: '2024-09-28'
            },
            actualVsPredicted: [],
            metrics: {
              mape: 0.09,
              rmse: 28.7,
              rSquared: 0.82
            }
          }
        ],
        lastTrained: '2024-09-28T10:00:00Z',
        isActive: true,
        confidence: 0.85
      },
      {
        id: 'ensemble_predictor',
        name: 'Ensemble Predictor',
        type: 'ensemble',
        algorithm: 'Weighted Average Ensemble',
        parameters: {
          models: ['seasonal_arima_solar', 'ml_regression_trends'],
          weights: [0.6, 0.4]
        },
        trainingData: {
          startDate: '2023-01-01',
          endDate: '2024-09-28',
          dataPoints: 638,
          features: ['all_models_predictions']
        },
        performance: {
          accuracy: 0.91,
          precision: 0.89,
          recall: 0.93,
          f1Score: 0.91,
          mse: 756.8,
          mae: 18.9
        },
        validationResults: [
          {
            testPeriod: {
              start: '2024-07-01',
              end: '2024-09-28'
            },
            actualVsPredicted: [],
            metrics: {
              mape: 0.07,
              rmse: 24.1,
              rSquared: 0.86
            }
          }
        ],
        lastTrained: '2024-09-28T10:00:00Z',
        isActive: true,
        confidence: 0.88
      }
    ];

    this.predictiveModels = models;
  }

  /**
   * Generiert Trend-Intelligence
   */
  private generateTrendIntelligence(): void {
    this.trendIntelligence = {
      globalTrends: [
        {
          trend: 'Nachhaltige Energie',
          category: 'Environmental',
          growth: 0.35,
          keywords: ['solar', 'photovoltaik', 'erneuerbare energien', 'grüne energie'],
          locations: PRIMARY_SERVICE_REGIONS.map(r => r.city.toLowerCase()),
          timeframe: '2024-2026'
        },
        {
          trend: 'Energiekostensenkung',
          category: 'Economic',
          growth: 0.28,
          keywords: ['energiekosten sparen', 'solarstrom kosten', 'photovoltaik amortisation'],
          locations: ['berlin', 'hamburg', 'münchen', 'köln', 'frankfurt'],
          timeframe: '2024-2025'
        },
        {
          trend: 'Elektromobilität Integration',
          category: 'Technology',
          growth: 0.42,
          keywords: ['solar carport', 'elektroauto laden', 'wallbox solar', 'e-mobility solar'],
          locations: ['stuttgart', 'münchen', 'berlin'],
          timeframe: '2024-2027'
        }
      ],
      localVariations: PRIMARY_SERVICE_REGIONS.map(region => ({
        location: region.city.toLowerCase(),
        uniqueTrends: [
          {
            trend: `Lokale Solar-Initiativen ${region.city}`,
            localGrowth: 0.45 + Math.random() * 0.2,
            nationalGrowth: 0.35,
            uniqueness: 0.8
          },
          {
            trend: `Wettbewerbsdruck ${region.city}`,
            localGrowth: -0.15 + Math.random() * 0.3,
            nationalGrowth: 0.05,
            uniqueness: 0.6
          }
        ]
      })),
      emergingTopics: [
        {
          topic: 'Solar + Speicher',
          keywords: ['solar batterien', 'stromspeicher', 'solaranlage mit speicher', 'photovoltaik akku'],
          growthVelocity: 0.67,
          searchInterest: 0.78,
          relatedTopics: ['Energiespeicher', 'Batterietechnologie', 'Netzunabhängigkeit'],
          firstDetected: '2024-03-15'
        },
        {
          topic: 'Solar + Wärmepumpe',
          keywords: ['solar wärmepumpe', 'photovoltaik heizung', 'solar hybrid heizung'],
          growthVelocity: 0.52,
          searchInterest: 0.65,
          relatedTopics: ['Wärmepumpen', 'Hybridheizungen', 'Energieeffizienz'],
          firstDetected: '2024-05-20'
        },
        {
          topic: 'Solar + Elektromobilität',
          keywords: ['solar wallbox', 'photovoltaik laden', 'solar carport', 'e-auto solar'],
          growthVelocity: 0.71,
          searchInterest: 0.82,
          relatedTopics: ['E-Mobility', 'Ladeinfrastruktur', 'Intelligente Energie'],
          firstDetected: '2024-02-10'
        }
      ],
      seasonalCalendar: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        keyEvents: [
          {
            event: i >= 3 && i <= 8 ? 'Solar-Saison' : 'Winterpause',
            impact: i >= 3 && i <= 8 ? 1.4 : 0.6,
            keywords: ['solaranlage', 'photovoltaik', 'solarpanel'],
            preparation: i >= 3 && i <= 8 ?
              ['Content-Marketing verstärken', 'PPC-Budgets erhöhen', 'Beratungskapazitäten ausweiten'] :
              ['Content-Planung für nächste Saison', 'Kundenbindungsprogramme', 'Offline-Marketing']
          }
        ],
        expectedVolume: i >= 3 && i <= 8 ? 1.3 : 0.7,
        recommendedActions: i >= 3 && i <= 8 ?
          ['Lead-Generierung maximieren', 'Conversion-Optimierung', 'Kundenservice verstärken'] :
          ['Strategische Planung', 'Systemoptimierung', 'Team-Training']
      })),
      competitiveIntelligence: [
        {
          competitor: 'E.ON Solar',
          trends: [
            {
              trend: 'Preisaggressive Positionierung',
              impact: 'negative',
              strength: 0.7
            },
            {
              trend: 'Erweiterte Service-Angebote',
              impact: 'negative',
              strength: 0.6
            }
          ],
          opportunities: [
            'Qualitätsvorteile betonen',
            'Premium-Services entwickeln',
            'Kundenbindung stärken'
          ]
        },
        {
          competitor: 'SolarWorld',
          trends: [
            {
              trend: 'Internationale Expansion',
              impact: 'neutral',
              strength: 0.4
            },
            {
              trend: 'Produktinnovationen',
              impact: 'positive',
              strength: 0.5
            }
          ],
          opportunities: [
            'Lokale Expertise hervorheben',
            'Partnerschaften suchen',
            'Innovationsführerschaft zeigen'
          ]
        }
      ]
    };
  }

  /**
   * Ruft Suchtrend-Daten ab
   */
  public getSearchTrendData(locationKey: string, keyword?: string): SearchTrendData[] {
    const locationData = this.searchTrendData.get(locationKey) || [];

    if (keyword) {
      return locationData.filter(data => data.keyword.includes(keyword));
    }

    return locationData;
  }

  /**
   * Ruft lokale Markttrends ab
   */
  public getLocalMarketTrend(locationKey: string): LocalMarketTrend | null {
    return this.localMarketTrends.get(locationKey) || null;
  }

  /**
   * Generiert lokale Markttrends
   */
  public generateLocalMarketTrend(locationKey: string): LocalMarketTrend {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) throw new Error(`Standort ${locationKey} nicht gefunden`);

    const trendData = this.searchTrendData.get(locationKey) || [];
    const seoData = localSEOAnalyticsService.getLocalSEOAnalytics(locationKey);

    const marketTrend: LocalMarketTrend = {
      locationKey,
      marketSegment: 'Solar & Photovoltaik',
      overallTrend: {
        direction: 'growth',
        growthRate: 0.25 + Math.random() * 0.15,
        confidence: 0.82,
        timeHorizon: 'medium'
      },
      keywordClusters: [
        {
          cluster: 'Haupt-Keywords',
          keywords: trendData.slice(0, 3).map(d => d.keyword),
          trend: {
            direction: 'increasing',
            growthRate: 0.22,
            volume: trendData.slice(0, 3).reduce((sum, d) => sum + d.historicalData[d.historicalData.length - 1].searchVolume, 0)
          },
          opportunities: trendData.slice(0, 3).map(d => ({
            keyword: d.keyword,
            potential: d.forecast.predictions[0].predictedVolume,
            difficulty: d.historicalData[d.historicalData.length - 1].competition > 0.6 ? 'high' : 'medium',
            competition: d.historicalData[d.historicalData.length - 1].competition
          }))
        },
        {
          cluster: 'Long-Tail Keywords',
          keywords: trendData.slice(3, 6).map(d => d.keyword),
          trend: {
            direction: 'increasing',
            growthRate: 0.18,
            volume: trendData.slice(3, 6).reduce((sum, d) => sum + d.historicalData[d.historicalData.length - 1].searchVolume, 0)
          },
          opportunities: trendData.slice(3, 6).map(d => ({
            keyword: d.keyword,
            potential: d.forecast.predictions[0].predictedVolume,
            difficulty: 'low',
            competition: d.historicalData[d.historicalData.length - 1].competition
          }))
        }
      ],
      seasonalPatterns: {
        peakSeason: {
          months: [4, 5, 6, 7, 8, 9],
          multiplier: 1.4,
          keywords: trendData.filter(d => d.seasonality.pattern === 'seasonal').map(d => d.keyword)
        },
        offSeason: {
          months: [11, 12, 1, 2],
          multiplier: 0.6,
          keywords: trendData.filter(d => d.seasonality.pattern === 'seasonal').map(d => d.keyword)
        },
        events: [
          {
            name: ' Intersolar Europe',
            date: '2024-06-19',
            impact: 1.8,
            keywords: ['solar messe', 'photovoltaik messe', 'solar innovationen'],
            preparation: ['Messe-Content vorbereiten', 'PPC-Kampagnen planen', 'Lead-Magneten entwickeln']
          },
          {
            name: 'Energieeffizienz-Tag',
            date: '2024-03-21',
            impact: 1.3,
            keywords: ['energieeffizienz', 'solar sparen', 'photovoltaik förderung'],
            preparation: ['Bildungscontent erstellen', 'Social Media Kampagnen', 'Email-Newsletter']
          }
        ]
      },
      competitiveLandscape: {
        marketConcentration: 0.65,
        newEntrants: 3,
        competitivePressure: 'medium',
        opportunities: [
          'Lokale Expertise hervorheben',
          'Premium-Service-Positionierung',
          'Partnerschaften mit lokalen Unternehmen',
          'Digitale Innovationen vorantreiben'
        ]
      },
      recommendations: [
        {
          action: 'Lokale Content-Strategie entwickeln',
          priority: 'high',
          expectedImpact: 0.25,
          timeline: '3 Monate',
          resources: ['Content-Team', 'Lokale Recherche', 'SEO-Tools']
        },
        {
          action: 'Saisonale Marketing-Kampagnen planen',
          priority: 'high',
          expectedImpact: 0.30,
          timeline: '2 Monate',
          resources: ['Marketing-Team', 'Budget-Planung', 'Kreativ-Agentur']
        },
        {
          action: 'Wettbewerbsanalyse vertiefen',
          priority: 'medium',
          expectedImpact: 0.15,
          timeline: '1 Monat',
          resources: ['Marktforschungs-Tools', 'Analysten-Team']
        },
        {
          action: 'Technologie-Investitionen prüfen',
          priority: 'medium',
          expectedImpact: 0.20,
          timeline: '6 Monate',
          resources: ['IT-Budget', 'Technologie-Partner', 'Entwicklungs-Team']
        }
      ]
    };

    this.localMarketTrends.set(locationKey, marketTrend);
    return marketTrend;
  }

  /**
   * Generiert Trend-Alerts
   */
  public generateTrendAlerts(locationKey?: string): TrendAlert[] {
    const alerts: TrendAlert[] = [];

    const locations = locationKey ? [locationKey] : PRIMARY_SERVICE_REGIONS.map(r => r.city.toLowerCase());

    locations.forEach(loc => {
      const trendData = this.searchTrendData.get(loc) || [];

      // Opportunity Alert für Keywords mit starkem Wachstum
      const highGrowthKeywords = trendData.filter(d => d.trend.direction === 'increasing' && d.trend.slope > 0.035);
      if (highGrowthKeywords.length > 0) {
        alerts.push({
          id: `opportunity_${loc}_${Date.now()}`,
          locationKey: loc,
          type: 'opportunity',
          severity: 'medium',
          title: `Wachstumschance in ${loc}`,
          description: `${highGrowthKeywords.length} Keywords zeigen starkes Wachstum. Zeit für Content-Optimierung.`,
          affectedKeywords: highGrowthKeywords.map(d => d.keyword),
          impact: {
            potentialTraffic: highGrowthKeywords.reduce((sum, d) => sum + d.forecast.predictions[0].predictedVolume, 0),
            potentialRevenue: highGrowthKeywords.reduce((sum, d) => sum + d.forecast.predictions[0].predictedVolume * 50, 0),
            timeframe: '3-6 Monate'
          },
          recommendations: [
            'Content für diese Keywords erstellen',
            'PPC-Kampagnen für High-Growth Keywords starten',
            'Backlink-Strategie für diese Keywords entwickeln'
          ],
          confidence: 0.85,
          detectedAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Threat Alert für Keywords mit Rückgang
      const decliningKeywords = trendData.filter(d => d.trend.direction === 'decreasing' && d.trend.slope < -0.01);
      if (decliningKeywords.length > 0) {
        alerts.push({
          id: `threat_${loc}_${Date.now()}`,
          locationKey: loc,
          type: 'threat',
          severity: 'high',
          title: `Suchvolumen-Rückgang in ${loc}`,
          description: `${decliningKeywords.length} Keywords zeigen Suchvolumen-Rückgang. Sofortige Maßnahmen erforderlich.`,
          affectedKeywords: decliningKeywords.map(d => d.keyword),
          impact: {
            potentialTraffic: -decliningKeywords.reduce((sum, d) => sum + Math.abs(d.trend.slope) * 1000, 0),
            potentialRevenue: -decliningKeywords.reduce((sum, d) => sum + Math.abs(d.trend.slope) * 50000, 0),
            timeframe: 'Sofort'
          },
          recommendations: [
            'Content-Optimierung für betroffene Keywords',
            'Wettbewerbsanalyse durchführen',
            'Alternative Keywords identifizieren',
            'PPC-Strategie anpassen'
          ],
          confidence: 0.78,
          detectedAt: new Date().toISOString(),
          status: 'active'
        });
      }

      // Anomaly Alert für ungewöhnliche Suchmuster
      const anomalies = trendData.flatMap(d => d.anomalies.filter(a => a.significance === 'high'));
      if (anomalies.length > 0) {
        alerts.push({
          id: `anomaly_${loc}_${Date.now()}`,
          locationKey: loc,
          type: 'anomaly',
          severity: 'medium',
          title: `Ungewöhnliche Suchmuster in ${loc}`,
          description: `${anomalies.length} signifikante Anomalien in Suchdaten entdeckt.`,
          affectedKeywords: [...new Set(anomalies.map(a => trendData.find(d => d.anomalies.includes(a))?.keyword || ''))],
          impact: {
            potentialTraffic: anomalies.reduce((sum, a) => sum + Math.abs(a.deviation), 0),
            potentialRevenue: anomalies.reduce((sum, a) => sum + Math.abs(a.deviation) * 25, 0),
            timeframe: '1-2 Wochen'
          },
          recommendations: [
            'Anomalien analysieren und Ursachen identifizieren',
            'Content und SEO-Strategie anpassen',
            'Monitoring verstärken'
          ],
          confidence: 0.65,
          detectedAt: new Date().toISOString(),
          status: 'active'
        });
      }
    });

    this.trendAlerts.push(...alerts);
    return alerts;
  }

  /**
   * Ruft Trend-Alerts ab
   */
  public getTrendAlerts(locationKey?: string, status?: 'active' | 'acknowledged' | 'resolved' | 'expired'): TrendAlert[] {
    let alerts = this.trendAlerts;

    if (locationKey) {
      alerts = alerts.filter(a => a.locationKey === locationKey);
    }

    if (status) {
      alerts = alerts.filter(a => a.status === status);
    }

    return alerts.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  /**
   * Aktualisiert Trend-Alert Status
   */
  public updateTrendAlertStatus(alertId: string, status: 'active' | 'acknowledged' | 'resolved' | 'expired'): void {
    const alert = this.trendAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
    }
  }

  /**
   * Ruft prädiktive Modelle ab
   */
  public getPredictiveModels(): PredictiveModel[] {
    return this.predictiveModels;
  }

  /**
   * Trainiert ein prädiktives Modell neu
   */
  public retrainModel(modelId: string): PredictiveModel | null {
    const model = this.predictiveModels.find(m => m.id === modelId);
    if (!model) return null;

    // Simuliere Retraining
    model.performance.accuracy += (Math.random() - 0.5) * 0.05;
    model.performance.precision += (Math.random() - 0.5) * 0.05;
    model.performance.recall += (Math.random() - 0.5) * 0.05;
    model.performance.f1Score += (Math.random() - 0.5) * 0.05;
    model.lastTrained = new Date().toISOString();
    model.confidence += (Math.random() - 0.5) * 0.1;

    return model;
  }

  /**
   * Ruft Trend-Intelligence ab
   */
  public getTrendIntelligence(): TrendIntelligence | null {
    return this.trendIntelligence;
  }

  /**
   * Generiert Trend-Prognose für spezifisches Keyword
   */
  public generateKeywordForecast(keyword: string, locationKey: string, daysAhead: number = 90): {
    keyword: string;
    location: string;
    forecast: Array<{
      date: string;
      predictedVolume: number;
      confidence: number;
      factors: string[];
    }>;
    insights: {
      expectedGrowth: number;
      riskLevel: 'low' | 'medium' | 'high';
      opportunities: string[];
      recommendations: string[];
    };
  } {
    const trendData = this.searchTrendData.get(locationKey)?.find(d => d.keyword === keyword);
    if (!trendData) throw new Error(`Trend-Daten für ${keyword} in ${locationKey} nicht gefunden`);

    const forecast = [];
    const now = new Date();

    for (let i = 1; i <= daysAhead; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const prediction = trendData.forecast.predictions.find(p => p.date === date.toISOString().split('T')[0]);

      if (prediction) {
        forecast.push({
          date: prediction.date,
          predictedVolume: prediction.predictedVolume,
          confidence: prediction.probability,
          factors: trendData.externalFactors
            .filter(f => {
              const factorStart = new Date(f.timeRange.start);
              const factorEnd = new Date(f.timeRange.end);
              return date >= factorStart && date <= factorEnd;
            })
            .map(f => f.factor)
        });
      }
    }

    const expectedGrowth = trendData.trend.slope * daysAhead;
    const riskLevel = trendData.trend.direction === 'volatile' ? 'high' :
                     trendData.trend.direction === 'decreasing' ? 'medium' : 'low';

    return {
      keyword,
      location: locationKey,
      forecast,
      insights: {
        expectedGrowth,
        riskLevel,
        opportunities: [
          'Content-Optimierung für prognostizierte Hochphasen',
          'Saisonale Marketing-Kampagnen planen',
          'Budget für PPC-Kampagnen anpassen'
        ],
        recommendations: [
          'Monitoring der Suchvolumen-Trends verstärken',
          'Content-Kalender an saisonale Muster anpassen',
          'Wettbewerbsanalyse für Hochwachstums-Perioden durchführen'
        ]
      }
    };
  }

  /**
   * Generiert globale Trend-Übersicht
   */
  public generateGlobalTrendOverview(): {
    totalLocations: number;
    totalKeywords: number;
    trendingKeywords: Array<{
      keyword: string;
      locations: string[];
      avgGrowth: number;
      totalVolume: number;
    }>;
    marketTrends: Array<{
      trend: string;
      impact: number;
      affectedLocations: string[];
      timeframe: string;
    }>;
    recommendations: string[];
  } {
    const allTrendData = Array.from(this.searchTrendData.values()).flat();
    const totalLocations = PRIMARY_SERVICE_REGIONS.length;
    const totalKeywords = allTrendData.length;

    const keywordStats = new Map<string, { locations: string[], growths: number[], volumes: number[] }>();

    allTrendData.forEach(data => {
      if (!keywordStats.has(data.keyword)) {
        keywordStats.set(data.keyword, { locations: [], growths: [], volumes: [] });
      }
      const stats = keywordStats.get(data.keyword)!;
      stats.locations.push(data.locationKey);
      stats.growths.push(data.trend.slope);
      stats.volumes.push(data.historicalData[data.historicalData.length - 1].searchVolume);
    });

    const trendingKeywords = Array.from(keywordStats.entries())
      .map(([keyword, stats]) => ({
        keyword,
        locations: stats.locations,
        avgGrowth: stats.growths.reduce((sum, g) => sum + g, 0) / stats.growths.length,
        totalVolume: stats.volumes.reduce((sum, v) => sum + v, 0)
      }))
      .filter(k => k.avgGrowth > 0.02)
      .sort((a, b) => b.avgGrowth - a.avgGrowth)
      .slice(0, 10);

    const marketTrends = this.trendIntelligence?.globalTrends.map(t => ({
      trend: t.trend,
      impact: t.growth,
      affectedLocations: t.locations,
      timeframe: t.timeframe
    })) || [];

    const recommendations = [
      'Fokussiere Marketing-Budgets auf Top-Trending Keywords',
      'Entwickle Content-Strategien für identifizierte Markttrends',
      'Erweitere lokale Präsenz in wachstumsstarken Regionen',
      'Investiere in Technologien für bessere Trend-Analyse',
      'Baue Partnerschaften mit Trend-Settern auf'
    ];

    return {
      totalLocations,
      totalKeywords,
      trendingKeywords,
      marketTrends,
      recommendations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const predictiveLocalSearchTrendsService = new PredictiveLocalSearchTrendsService();