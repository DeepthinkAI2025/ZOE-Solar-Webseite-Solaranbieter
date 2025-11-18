import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { enterpriseCitationManagementService } from './enterpriseCitationManagementService';
import { multiLocationManagementService } from './multiLocationManagementService';

export interface PerformanceFactor {
  name: string;
  category: 'technical' | 'content' | 'local' | 'competition' | 'user_behavior';
  weight: number;
  currentValue: number;
  targetValue: number;
  impact: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface SearchPrediction {
  locationKey: string;
  keyword: string;
  currentPosition: number;
  predictedPosition: number;
  confidence: number;
  timeFrame: '1_week' | '1_month' | '3_months' | '6_months';
  factors: PerformanceFactor[];
  probability: {
    improve: number;
    maintain: number;
    decline: number;
  };
  recommendations: Array<{
    action: string;
    impact: number;
    effort: 'low' | 'medium' | 'high';
    priority: 'low' | 'medium' | 'high';
  }>;
  createdAt: string;
}

export interface LocalSearchTrend {
  locationKey: string;
  trendType: 'seasonal' | 'competitive' | 'algorithm' | 'market';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  strength: number;
  duration: string;
  affectedKeywords: string[];
  predictions: Array<{
    keyword: string;
    positionChange: number;
    confidence: number;
  }>;
  mitigationStrategies: string[];
  detectedAt: string;
}

export interface PerformanceScenario {
  id: string;
  name: string;
  description: string;
  locationKey: string;
  assumptions: Array<{
    factor: string;
    change: number;
    timeframe: string;
  }>;
  predictions: Array<{
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
  }>;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface PredictionModel {
  id: string;
  name: string;
  type: 'ranking' | 'traffic' | 'conversion' | 'competition';
  accuracy: number;
  lastTrained: string;
  features: string[];
  performance: {
    mse: number;
    r2: number;
    mae: number;
  };
  active: boolean;
}

/**
 * Local Search Performance Prediction Service
 * KI-gestützte Vorhersage der lokalen Suchleistung
 */
export class LocalSearchPerformancePredictionService {
  private predictions: Map<string, SearchPrediction[]> = new Map();
  private trends: Map<string, LocalSearchTrend[]> = new Map();
  private scenarios: Map<string, PerformanceScenario[]> = new Map();
  private predictionModels: Map<string, PredictionModel> = new Map();

  constructor() {
    this.initializePredictionModels();
    this.generateInitialPredictions();
    this.detectInitialTrends();
  }

  /**
   * Initialisiert Vorhersagemodelle
   */
  private initializePredictionModels(): void {
    const models: PredictionModel[] = [
      {
        id: 'ranking_prediction_v1',
        name: 'Ranking Prediction Model',
        type: 'ranking',
        accuracy: 0.85,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        features: [
          'citation_consistency',
          'gmb_reviews',
          'content_quality',
          'technical_seo_score',
          'competitor_activity',
          'seasonal_factors'
        ],
        performance: {
          mse: 2.3,
          r2: 0.78,
          mae: 1.1
        },
        active: true
      },
      {
        id: 'traffic_prediction_v1',
        name: 'Traffic Prediction Model',
        type: 'traffic',
        accuracy: 0.82,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        features: [
          'search_volume',
          'competition_level',
          'content_freshness',
          'user_intent',
          'device_distribution'
        ],
        performance: {
          mse: 1250,
          r2: 0.75,
          mae: 890
        },
        active: true
      },
      {
        id: 'conversion_prediction_v1',
        name: 'Conversion Prediction Model',
        type: 'conversion',
        accuracy: 0.79,
        lastTrained: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        features: [
          'landing_page_quality',
          'call_to_action_effectiveness',
          'trust_signals',
          'user_experience',
          'mobile_optimization'
        ],
        performance: {
          mse: 0.02,
          r2: 0.71,
          mae: 0.08
        },
        active: true
      },
      {
        id: 'competition_prediction_v1',
        name: 'Competition Analysis Model',
        type: 'competition',
        accuracy: 0.88,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        features: [
          'competitor_citations',
          'competitor_reviews',
          'competitor_content',
          'market_share',
          'marketing_budget'
        ],
        performance: {
          mse: 1.8,
          r2: 0.82,
          mae: 0.9
        },
        active: true
      }
    ];

    models.forEach(model => {
      this.predictionModels.set(model.id, model);
    });
  }

  /**
   * Generiert initiale Vorhersagen
   */
  private generateInitialPredictions(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const predictions: SearchPrediction[] = [];

      // Keywords für diesen Standort
      const keywords = [
        `solaranlage ${region.city}`,
        `photovoltaik ${region.city}`,
        `pv installation ${region.city}`,
        `solar ${region.city}`,
        `gewerbe solar ${region.city}`
      ];

      keywords.forEach(keyword => {
        const currentPosition = Math.floor(Math.random() * 15) + 1;
        const prediction = this.generateSearchPrediction(locationKey, keyword, currentPosition);
        predictions.push(prediction);
      });

      this.predictions.set(locationKey, predictions);
    });
  }

  /**
   * Generiert Suchvorhersage für Keyword
   */
  private generateSearchPrediction(locationKey: string, keyword: string, currentPosition: number): SearchPrediction {
    const factors = this.calculatePerformanceFactors(locationKey, keyword);

    // KI-basierte Vorhersage (simuliert)
    const predictedPosition = this.predictPosition(currentPosition, factors);
    const confidence = this.calculateConfidence(factors);

    const probability = {
      improve: Math.min(0.8, Math.max(0.1, (100 - currentPosition) / 100 + Math.random() * 0.2)),
      maintain: Math.min(0.6, Math.max(0.2, 0.5 - Math.abs(predictedPosition - currentPosition) / 20)),
      decline: Math.min(0.5, Math.max(0.1, currentPosition / 20 + Math.random() * 0.1))
    };

    // Normalisieren der Wahrscheinlichkeiten
    const total = probability.improve + probability.maintain + probability.decline;
    probability.improve /= total;
    probability.maintain /= total;
    probability.decline /= total;

    const recommendations = this.generatePredictionRecommendations(factors, currentPosition, predictedPosition);

    return {
      locationKey,
      keyword,
      currentPosition,
      predictedPosition: Math.round(predictedPosition * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
      timeFrame: '1_month',
      factors,
      probability,
      recommendations,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Berechnet Performance-Faktoren
   */
  private calculatePerformanceFactors(locationKey: string, keyword: string): PerformanceFactor[] {
    const locationProfile = multiLocationManagementService.getLocationProfile(locationKey);
    const citationEntries = enterpriseCitationManagementService.getCitationEntries(locationKey);
    const analyticsData = localSEOAnalyticsService.getKeywordPerformanceForLocation(locationKey);

    const factors: PerformanceFactor[] = [
      {
        name: 'Citation Consistency',
        category: 'local',
        weight: 0.25,
        currentValue: citationEntries.length > 0 ?
          citationEntries.reduce((sum, c) => sum + c.consistency.overallScore, 0) / citationEntries.length : 0,
        targetValue: 95,
        impact: 0.8,
        trend: Math.random() > 0.6 ? 'improving' : 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'GMB Reviews',
        category: 'local',
        weight: 0.20,
        currentValue: citationEntries.length > 0 ?
          citationEntries.reduce((sum, c) => sum + c.performance.rating, 0) / citationEntries.length : 0,
        targetValue: 4.5,
        impact: 0.7,
        trend: Math.random() > 0.7 ? 'improving' : 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Content Quality',
        category: 'content',
        weight: 0.18,
        currentValue: Math.floor(Math.random() * 30) + 70,
        targetValue: 90,
        impact: 0.6,
        trend: Math.random() > 0.5 ? 'improving' : 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Technical SEO',
        category: 'technical',
        weight: 0.15,
        currentValue: Math.floor(Math.random() * 20) + 75,
        targetValue: 95,
        impact: 0.9,
        trend: Math.random() > 0.8 ? 'improving' : 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Competitor Activity',
        category: 'competition',
        weight: 0.12,
        currentValue: Math.floor(Math.random() * 40) + 30,
        targetValue: 20,
        impact: -0.5,
        trend: Math.random() > 0.6 ? 'declining' : 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'User Behavior',
        category: 'user_behavior',
        weight: 0.10,
        currentValue: Math.floor(Math.random() * 25) + 60,
        targetValue: 80,
        impact: 0.4,
        trend: Math.random() > 0.5 ? 'improving' : 'stable',
        lastUpdated: new Date().toISOString()
      }
    ];

    return factors;
  }

  /**
   * Position vorhersagen
   */
  private predictPosition(currentPosition: number, factors: PerformanceFactor[]): number {
    let positionChange = 0;

    factors.forEach(factor => {
      const factorImpact = (factor.targetValue - factor.currentValue) / 100 * factor.impact * factor.weight;
      positionChange += factorImpact * -2; // Negative Werte verbessern die Position
    });

    // Zufällige Variation hinzufügen
    positionChange += (Math.random() - 0.5) * 0.5;

    const predictedPosition = Math.max(1, Math.min(100, currentPosition + positionChange));
    return predictedPosition;
  }

  /**
   * Konfidenz berechnen
   */
  private calculateConfidence(factors: PerformanceFactor[]): number {
    const avgFactorQuality = factors.reduce((sum, f) => sum + Math.abs(f.targetValue - f.currentValue), 0) / factors.length;
    const dataCompleteness = factors.filter(f => f.currentValue > 0).length / factors.length;

    return Math.min(0.95, Math.max(0.6, (1 - avgFactorQuality / 100) * dataCompleteness));
  }

  /**
   * Vorhersage-Empfehlungen generieren
   */
  private generatePredictionRecommendations(
    factors: PerformanceFactor[],
    currentPosition: number,
    predictedPosition: number
  ): SearchPrediction['recommendations'] {
    const recommendations: SearchPrediction['recommendations'] = [];

    // Schwache Faktoren identifizieren
    const weakFactors = factors.filter(f => f.currentValue < f.targetValue * 0.8);

    weakFactors.forEach(factor => {
      let action = '';
      let effort: 'low' | 'medium' | 'high' = 'medium';

      switch (factor.name) {
        case 'Citation Consistency':
          action = 'NAP-Konsistenz in allen Citations verbessern';
          effort = 'high';
          break;
        case 'GMB Reviews':
          action = 'Google My Business Bewertungen sammeln und managen';
          effort = 'medium';
          break;
        case 'Content Quality':
          action = 'Lokalen Content optimieren und erweitern';
          effort = 'high';
          break;
        case 'Technical SEO':
          action = 'Technische SEO-Probleme beheben';
          effort = 'medium';
          break;
        case 'Competitor Activity':
          action = 'Wettbewerbsanalyse durchführen und differenzieren';
          effort = 'medium';
          break;
        case 'User Behavior':
          action = 'User Experience und Conversion optimieren';
          effort = 'high';
          break;
      }

      recommendations.push({
        action,
        impact: Math.abs(factor.impact) * factor.weight * 100,
        effort,
        priority: factor.currentValue < f.targetValue * 0.6 ? 'high' : 'medium'
      });
    });

    // Nach Impact sortieren
    recommendations.sort((a, b) => b.impact - a.impact);

    return recommendations.slice(0, 3);
  }

  /**
   * Trends initial erkennen
   */
  private detectInitialTrends(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const trends: LocalSearchTrend[] = [];

      // Saisonale Trends
      trends.push({
        locationKey,
        trendType: 'seasonal',
        description: 'Erhöhte Nachfrage nach Solaranlagen im Frühling',
        impact: 'positive',
        strength: 0.7,
        duration: '3 Monate',
        affectedKeywords: [`solaranlage ${region.city}`, `photovoltaik ${region.city}`],
        predictions: [
          {
            keyword: `solaranlage ${region.city}`,
            positionChange: -1.5,
            confidence: 0.8
          }
        ],
        mitigationStrategies: [
          'Content-Kalender an saisonale Trends anpassen',
          'Frühlingsaktionen vorbereiten'
        ],
        detectedAt: new Date().toISOString()
      });

      // Wettbewerbstrends
      trends.push({
        locationKey,
        trendType: 'competitive',
        description: 'Neuer Wettbewerber erweitert Marketingaktivitäten',
        impact: 'negative',
        strength: 0.6,
        duration: '2 Monate',
        affectedKeywords: [`gewerbe solar ${region.city}`],
        predictions: [
          {
            keyword: `gewerbe solar ${region.city}`,
            positionChange: 2.0,
            confidence: 0.75
          }
        ],
        mitigationStrategies: [
          'Differenzierungsstrategie entwickeln',
          'Content-Marketing intensivieren'
        ],
        detectedAt: new Date().toISOString()
      });

      this.trends.set(locationKey, trends);
    });
  }

  /**
   * Suchvorhersage für Standort abrufen
   */
  public getSearchPredictions(locationKey: string): SearchPrediction[] {
    return this.predictions.get(locationKey) || [];
  }

  /**
   * Trends für Standort abrufen
   */
  public getLocalTrends(locationKey: string): LocalSearchTrend[] {
    return this.trends.get(locationKey) || [];
  }

  /**
   * Performance-Szenario erstellen
   */
  public createPerformanceScenario(scenario: Omit<PerformanceScenario, 'id' | 'createdAt'>): PerformanceScenario {
    const newScenario: PerformanceScenario = {
      ...scenario,
      id: `scenario_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const existingScenarios = this.scenarios.get(scenario.locationKey) || [];
    existingScenarios.push(newScenario);
    this.scenarios.set(scenario.locationKey, existingScenarios);

    return newScenario;
  }

  /**
   * Szenarien für Standort abrufen
   */
  public getPerformanceScenarios(locationKey: string): PerformanceScenario[] {
    return this.scenarios.get(locationKey) || [];
  }

  /**
   * Vorhersagemodelle abrufen
   */
  public getPredictionModels(): PredictionModel[] {
    return Array.from(this.predictionModels.values());
  }

  /**
   * Neue Vorhersage für Keyword generieren
   */
  public generateKeywordPrediction(locationKey: string, keyword: string): SearchPrediction | null {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) return null;

    // Aktuelle Position schätzen
    const currentPosition = Math.floor(Math.random() * 20) + 1;

    return this.generateSearchPrediction(locationKey, keyword, currentPosition);
  }

  /**
   * Trend-Analyse durchführen
   */
  public analyzeTrends(locationKey: string): {
    activeTrends: LocalSearchTrend[];
    riskAssessment: 'low' | 'medium' | 'high';
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  } {
    const trends = this.getLocalTrends(locationKey);
    const activeTrends = trends.filter(t => {
      const trendAge = Date.now() - new Date(t.detectedAt).getTime();
      return trendAge < 90 * 24 * 60 * 60 * 1000; // 90 Tage
    });

    const negativeTrends = activeTrends.filter(t => t.impact === 'negative');
    const positiveTrends = activeTrends.filter(t => t.impact === 'positive');

    let riskAssessment: 'low' | 'medium' | 'high' = 'low';
    if (negativeTrends.length > 2) riskAssessment = 'high';
    else if (negativeTrends.length > 0) riskAssessment = 'medium';

    const opportunities = positiveTrends.map(t => t.description);
    const threats = negativeTrends.map(t => t.description);

    const recommendations = [
      ...activeTrends.flatMap(t => t.mitigationStrategies),
      riskAssessment === 'high' ? 'Sofortige Gegenmaßnahmen einleiten' : 'Regelmäßige Überwachung beibehalten'
    ];

    return {
      activeTrends,
      riskAssessment,
      opportunities,
      threats,
      recommendations: [...new Set(recommendations)] // Duplikate entfernen
    };
  }

  /**
   * Performance-Prognose für Zeitraum
   */
  public generatePerformanceForecast(locationKey: string, months: number = 6): {
    locationKey: string;
    timeframe: string;
    currentMetrics: {
      avgPosition: number;
      totalTraffic: number;
      conversionRate: number;
    };
    forecastedMetrics: {
      avgPosition: number;
      totalTraffic: number;
      conversionRate: number;
    };
    confidence: number;
    keyDrivers: string[];
    risks: string[];
    opportunities: string[];
  } {
    const predictions = this.getSearchPredictions(locationKey);
    const analyticsData = localSEOAnalyticsService.getKeywordPerformanceForLocation(locationKey);

    const currentAvgPosition = predictions.reduce((sum, p) => sum + p.currentPosition, 0) / predictions.length;
    const forecastedAvgPosition = predictions.reduce((sum, p) => sum + p.predictedPosition, 0) / predictions.length;

    // Traffic basierend auf Position schätzen
    const currentTraffic = analyticsData.reduce((sum, kw) => sum + kw.clicks, 0);
    const trafficMultiplier = Math.max(0.5, Math.min(2.0, currentAvgPosition / forecastedAvgPosition));
    const forecastedTraffic = Math.round(currentTraffic * trafficMultiplier);

    const currentConversionRate = 3.5; // Beispielwert
    const forecastedConversionRate = Math.min(5.0, currentConversionRate * (1 + (months * 0.02)));

    const confidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

    const keyDrivers = [
      'Citation-Optimierung',
      'Content-Qualitätsverbesserung',
      'Technische SEO-Optimierung'
    ];

    const risks = [
      'Erhöhte Wettbewerbsaktivität',
      'Algorithmus-Änderungen',
      'Saisonale Schwankungen'
    ];

    const opportunities = [
      'Neue lokale Keywords',
      'Featured Snippets',
      'Local Pack Rankings'
    ];

    return {
      locationKey,
      timeframe: `${months} Monate`,
      currentMetrics: {
        avgPosition: Math.round(currentAvgPosition * 10) / 10,
        totalTraffic: currentTraffic,
        conversionRate: currentConversionRate
      },
      forecastedMetrics: {
        avgPosition: Math.round(forecastedAvgPosition * 10) / 10,
        totalTraffic: forecastedTraffic,
        conversionRate: Math.round(forecastedConversionRate * 10) / 10
      },
      confidence: Math.round(confidence * 100) / 100,
      keyDrivers,
      risks,
      opportunities
    };
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalPredictions: number;
    avgConfidence: number;
    activeTrends: number;
    highRiskLocations: string[];
    topOpportunities: Array<{ location: string; potential: number }>;
    modelPerformance: { [key: string]: number };
  } {
    let totalPredictions = 0;
    let totalConfidence = 0;
    let activeTrends = 0;
    const locationRisks: { [key: string]: number } = {};
    const opportunities: Array<{ location: string; potential: number }> = [];

    Array.from(this.predictions.entries()).forEach(([locationKey, predictions]) => {
      totalPredictions += predictions.length;
      totalConfidence += predictions.reduce((sum, p) => sum + p.confidence, 0);

      // Risiko basierend auf negativen Vorhersagen
      const negativePredictions = predictions.filter(p => p.predictedPosition > p.currentPosition).length;
      locationRisks[locationKey] = negativePredictions / predictions.length;
    });

    Array.from(this.trends.values()).forEach(trends => {
      activeTrends += trends.length;
    });

    // Top Opportunities berechnen
    Object.entries(locationRisks).forEach(([location, risk]) => {
      const potential = (1 - risk) * 100; // Höheres Potenzial bei geringerem Risiko
      opportunities.push({ location, potential });
    });

    opportunities.sort((a, b) => b.potential - a.potential);

    const highRiskLocations = Object.entries(locationRisks)
      .filter(([, risk]) => risk > 0.5)
      .map(([location]) => location);

    const modelPerformance: { [key: string]: number } = {};
    Array.from(this.predictionModels.values()).forEach(model => {
      modelPerformance[model.name] = model.accuracy;
    });

    return {
      totalPredictions,
      avgConfidence: totalPredictions > 0 ? totalConfidence / totalPredictions : 0,
      activeTrends,
      highRiskLocations,
      topOpportunities: opportunities.slice(0, 5),
      modelPerformance
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localSearchPerformancePredictionService = new LocalSearchPerformancePredictionService();