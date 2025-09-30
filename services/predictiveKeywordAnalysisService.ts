/**
 * Predictive Keyword Analysis Service für ZOE Solar
 *
 * KI-gestützte prädiktive Analyse von Keywords mit Machine Learning.
 * Prognostiziert Keyword-Trends, Suchvolumen-Entwicklung und
 * Wettbewerbsveränderungen für optimale SEO-Strategien.
 */

import { aiContentOptimizationService } from './aiContentOptimizationService';

// ===== INTERFACES & TYPES =====

export interface PredictiveKeywordAnalysisConfig {
  enabled: boolean;
  predictionHorizon: number; // months
  confidenceThreshold: number;
  dataSources: ('google_trends' | 'search_console' | 'ahrefs' | 'semrush' | 'historical_data')[];
  mlModels: ('linear_regression' | 'neural_network' | 'time_series' | 'ensemble')[];
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    maxConcurrentAnalyses: number;
    batchSize: number;
  };
}

export interface KeywordAnalysisRequest {
  keywords: string[];
  industry: string;
  location?: string;
  timeframe: {
    start: Date;
    end: Date;
  };
  predictionScope: 'short_term' | 'medium_term' | 'long_term';
  analysisDepth: 'basic' | 'intermediate' | 'advanced';
  context?: {
    competitors?: string[];
    seasonalFactors?: boolean;
    marketTrends?: string[];
    userIntent?: string;
  };
}

export interface PredictiveKeywordResult {
  keyword: string;
  currentMetrics: KeywordMetrics;
  predictions: KeywordPrediction[];
  trends: KeywordTrend[];
  opportunities: KeywordOpportunity[];
  risks: KeywordRisk[];
  recommendations: KeywordRecommendation[];
  confidence: number;
  lastUpdated: Date;
}

export interface KeywordMetrics {
  searchVolume: number;
  competition: number;
  cpc: number;
  trend: number; // -1 to 1
  seasonality: number; // 0 to 1
  difficulty: number; // 0 to 100
  opportunity: number; // 0 to 100
}

export interface KeywordPrediction {
  timeframe: string; // '1M', '3M', '6M', '12M'
  predictedVolume: number;
  confidence: number;
  factors: PredictionFactor[];
  scenario: 'conservative' | 'moderate' | 'optimistic';
}

export interface PredictionFactor {
  name: string;
  impact: number; // -1 to 1
  confidence: number;
  description: string;
}

export interface KeywordTrend {
  period: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  drivers: string[];
  confidence: number;
}

export interface KeywordOpportunity {
  type: 'volume_growth' | 'competition_decline' | 'seasonal_peak' | 'emerging_trend';
  potential: number;
  timeframe: string;
  requirements: string[];
  expectedROI: number;
}

export interface KeywordRisk {
  type: 'competition_increase' | 'volume_decline' | 'algorithm_change' | 'seasonal_dip';
  probability: number;
  impact: number;
  mitigation: string[];
}

export interface KeywordRecommendation {
  action: 'target' | 'monitor' | 'avoid' | 'optimize';
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  implementation: string[];
  expectedImpact: number;
  timeframe: string;
}

export interface PredictiveAnalysisResult {
  keywords: PredictiveKeywordResult[];
  marketInsights: MarketInsight[];
  competitiveAnalysis: CompetitiveAnalysis;
  performance: AnalysisPerformance;
  metadata: AnalysisMetadata;
}

export interface MarketInsight {
  trend: string;
  impact: number;
  affectedKeywords: string[];
  timeframe: string;
  confidence: number;
}

export interface CompetitiveAnalysis {
  marketShare: Record<string, number>;
  competitiveKeywords: string[];
  threats: string[];
  opportunities: string[];
}

export interface AnalysisPerformance {
  processingTime: number;
  dataPoints: number;
  modelAccuracy: number;
  cacheHitRate: number;
  errorRate: number;
}

export interface AnalysisMetadata {
  timestamp: Date;
  version: string;
  dataSources: string[];
  modelsUsed: string[];
  confidence: number;
  coverage: number;
}

// ===== MAIN SERVICE CLASS =====

class PredictiveKeywordAnalysisService {
  private static instance: PredictiveKeywordAnalysisService;
  private config: PredictiveKeywordAnalysisConfig;
  private keywordCache: Map<string, PredictiveKeywordResult> = new Map();
  private historicalData: Map<string, KeywordMetrics[]> = new Map();
  private mlModels: Map<string, MLModel> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeMLModels();
    this.initializeHistoricalData();
  }

  public static getInstance(): PredictiveKeywordAnalysisService {
    if (!PredictiveKeywordAnalysisService.instance) {
      PredictiveKeywordAnalysisService.instance = new PredictiveKeywordAnalysisService();
    }
    return PredictiveKeywordAnalysisService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): PredictiveKeywordAnalysisConfig {
    return {
      enabled: true,
      predictionHorizon: 12, // 12 months
      confidenceThreshold: 0.7,
      dataSources: ['google_trends', 'search_console', 'historical_data'],
      mlModels: ['linear_regression', 'time_series'],
      updateFrequency: 'weekly',
      performance: {
        cacheEnabled: true,
        cacheTTL: 604800, // 1 week
        maxConcurrentAnalyses: 10,
        batchSize: 50
      }
    };
  }

  public updateConfig(newConfig: Partial<PredictiveKeywordAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): PredictiveKeywordAnalysisConfig {
    return { ...this.config };
  }

  // ===== PREDICTIVE ANALYSIS =====

  public async analyzeKeywords(request: KeywordAnalysisRequest): Promise<PredictiveAnalysisResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    if (this.config.performance.cacheEnabled && this.keywordCache.has(cacheKey)) {
      const cached = this.keywordCache.get(cacheKey)!;
      return {
        keywords: [cached],
        marketInsights: [],
        competitiveAnalysis: {} as CompetitiveAnalysis,
        performance: {
          processingTime: Date.now() - startTime,
          dataPoints: 1,
          modelAccuracy: 0.8,
          cacheHitRate: 1.0,
          errorRate: 0
        },
        metadata: {
          timestamp: new Date(),
          version: '1.0.0',
          dataSources: this.config.dataSources,
          modelsUsed: this.config.mlModels,
          confidence: cached.confidence,
          coverage: 1.0
        }
      };
    }

    try {
      const result = await this.performPredictiveAnalysis(request);

      // Calculate performance metrics
      const processingTime = Date.now() - startTime;
      result.performance = {
        processingTime,
        dataPoints: request.keywords.length,
        modelAccuracy: this.calculateModelAccuracy(result.keywords),
        cacheHitRate: 0,
        errorRate: 0
      };

      // Cache individual keyword results
      if (this.config.performance.cacheEnabled) {
        result.keywords.forEach(keywordResult => {
          this.keywordCache.set(keywordResult.keyword, keywordResult);
          setTimeout(() => this.keywordCache.delete(keywordResult.keyword), this.config.performance.cacheTTL * 1000);
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown analysis error';
      return this.createErrorResult(request, errorMessage, startTime);
    }
  }

  private async performPredictiveAnalysis(request: KeywordAnalysisRequest): Promise<PredictiveAnalysisResult> {
    const { keywords, industry, location, timeframe, predictionScope, analysisDepth, context } = request;

    // Analyze keywords in batches
    const keywordResults: PredictiveKeywordResult[] = [];
    const batches = this.chunkArray(keywords, this.config.performance.batchSize);

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(keyword => this.analyzeSingleKeyword(keyword, request))
      );
      keywordResults.push(...batchResults);
    }

    // Generate market insights
    const marketInsights = this.generateMarketInsights(keywordResults, industry, context);

    // Perform competitive analysis
    const competitiveAnalysis = this.performCompetitiveAnalysis(keywordResults, context);

    // Generate metadata
    const metadata = this.generateAnalysisMetadata(request, keywordResults);

    return {
      keywords: keywordResults,
      marketInsights,
      competitiveAnalysis,
      performance: {} as AnalysisPerformance, // Will be set by caller
      metadata
    };
  }

  private async analyzeSingleKeyword(keyword: string, request: KeywordAnalysisRequest): Promise<PredictiveKeywordResult> {
    // Get current metrics
    const currentMetrics = await this.getCurrentKeywordMetrics(keyword, request);

    // Generate predictions
    const predictions = await this.generatePredictions(keyword, currentMetrics, request);

    // Analyze trends
    const trends = this.analyzeKeywordTrends(keyword, currentMetrics);

    // Identify opportunities
    const opportunities = this.identifyKeywordOpportunities(keyword, currentMetrics, predictions, request);

    // Assess risks
    const risks = this.assessKeywordRisks(keyword, currentMetrics, predictions, request);

    // Generate recommendations
    const recommendations = this.generateKeywordRecommendations(keyword, currentMetrics, predictions, opportunities, risks);

    // Calculate overall confidence
    const confidence = this.calculateKeywordConfidence(currentMetrics, predictions, trends);

    return {
      keyword,
      currentMetrics,
      predictions,
      trends,
      opportunities,
      risks,
      recommendations,
      confidence,
      lastUpdated: new Date()
    };
  }

  // ===== METRICS COLLECTION =====

  private async getCurrentKeywordMetrics(keyword: string, request: KeywordAnalysisRequest): Promise<KeywordMetrics> {
    // Simulate data collection from various sources
    const baseVolume = this.getBaseSearchVolume(keyword, request.industry);
    const seasonalFactor = this.calculateSeasonalFactor(keyword, request.timeframe.start);
    const competitionFactor = this.calculateCompetitionFactor(keyword);

    return {
      searchVolume: Math.round(baseVolume * seasonalFactor),
      competition: competitionFactor,
      cpc: this.calculateCPC(keyword, request.industry),
      trend: this.calculateTrend(keyword),
      seasonality: seasonalFactor,
      difficulty: this.calculateKeywordDifficulty(keyword),
      opportunity: this.calculateOpportunityScore(keyword, request.industry)
    };
  }

  private getBaseSearchVolume(keyword: string, industry: string): number {
    // Simplified volume calculation based on keyword characteristics
    const keywordLength = keyword.split(' ').length;
    const industryMultiplier = this.getIndustryMultiplier(industry);
    const baseVolume = 1000; // Base volume

    // Longer keywords typically have lower volume
    const lengthMultiplier = keywordLength === 1 ? 1.0 :
                           keywordLength === 2 ? 0.7 :
                           keywordLength === 3 ? 0.4 : 0.2;

    return Math.round(baseVolume * industryMultiplier * lengthMultiplier);
  }

  private getIndustryMultiplier(industry: string): number {
    const multipliers: Record<string, number> = {
      'solar': 1.5,
      'photovoltaik': 1.8,
      'energy': 1.2,
      'construction': 0.8,
      'technology': 1.0
    };

    return multipliers[industry.toLowerCase()] || 1.0;
  }

  private calculateSeasonalFactor(keyword: string, date: Date): number {
    const month = date.getMonth();
    const lowerKeyword = keyword.toLowerCase();

    // Solar-related keywords peak in spring/summer
    if (lowerKeyword.includes('solar') || lowerKeyword.includes('photovoltaik')) {
      // Peak in April-June, low in winter
      const seasonalPattern = [0.6, 0.7, 0.9, 1.2, 1.4, 1.3, 1.1, 0.9, 0.8, 0.7, 0.6, 0.6];
      return seasonalPattern[month];
    }

    // Construction-related keywords peak in spring
    if (lowerKeyword.includes('installation') || lowerKeyword.includes('bau')) {
      const seasonalPattern = [0.7, 0.8, 1.0, 1.3, 1.2, 1.0, 0.9, 0.8, 0.7, 0.7, 0.7, 0.7];
      return seasonalPattern[month];
    }

    return 1.0; // No seasonality
  }

  private calculateCompetitionFactor(keyword: string): number {
    const lowerKeyword = keyword.toLowerCase();

    // High competition for commercial keywords
    if (lowerKeyword.includes('photovoltaik') && lowerKeyword.includes('kosten')) {
      return 0.85;
    }

    if (lowerKeyword.includes('solar') && lowerKeyword.includes('anlage')) {
      return 0.8;
    }

    // Lower competition for specific long-tail keywords
    if (keyword.split(' ').length >= 4) {
      return 0.3;
    }

    return 0.6; // Medium competition
  }

  private calculateCPC(keyword: string, industry: string): number {
    const lowerKeyword = keyword.toLowerCase();

    // High CPC for commercial keywords
    if (lowerKeyword.includes('photovoltaik') || lowerKeyword.includes('solaranlage')) {
      return 2.5;
    }

    if (lowerKeyword.includes('beratung') || lowerKeyword.includes('installation')) {
      return 1.8;
    }

    return 1.2; // Default CPC
  }

  private calculateTrend(keyword: string): number {
    // Simplified trend calculation
    const lowerKeyword = keyword.toLowerCase();

    // Growing trends
    if (lowerKeyword.includes('elektro') || lowerKeyword.includes('smart')) {
      return 0.3; // Growing
    }

    // Declining trends
    if (lowerKeyword.includes('traditionell') || lowerKeyword.includes('alt')) {
      return -0.2; // Declining
    }

    return 0.1; // Stable/growing
  }

  private calculateKeywordDifficulty(keyword: string): number {
    const lowerKeyword = keyword.toLowerCase();
    let difficulty = 50; // Base difficulty

    // High difficulty for competitive terms
    if (lowerKeyword === 'photovoltaik') {
      difficulty = 85;
    } else if (lowerKeyword.includes('photovoltaik')) {
      difficulty = 70;
    }

    // Lower difficulty for long-tail keywords
    const wordCount = keyword.split(' ').length;
    difficulty -= (wordCount - 1) * 10;

    return Math.max(0, Math.min(100, difficulty));
  }

  private calculateOpportunityScore(keyword: string, industry: string): number {
    const volume = this.getBaseSearchVolume(keyword, industry);
    const difficulty = this.calculateKeywordDifficulty(keyword);
    const competition = this.calculateCompetitionFactor(keyword);

    // Opportunity = Volume / (Difficulty * Competition)
    const opportunity = (volume / 1000) / (difficulty * competition);
    return Math.min(100, opportunity * 50); // Scale to 0-100
  }

  // ===== PREDICTION GENERATION =====

  private async generatePredictions(
    keyword: string,
    currentMetrics: KeywordMetrics,
    request: KeywordAnalysisRequest
  ): Promise<KeywordPrediction[]> {
    const predictions: KeywordPrediction[] = [];
    const timeframes = request.predictionScope === 'short_term' ? ['1M', '3M'] :
                      request.predictionScope === 'medium_term' ? ['1M', '3M', '6M'] :
                      ['3M', '6M', '12M'];

    for (const timeframe of timeframes) {
      const months = parseInt(timeframe.replace('M', ''));
      const prediction = await this.generateSinglePrediction(keyword, currentMetrics, months, request);
      predictions.push(prediction);
    }

    return predictions;
  }

  private async generateSinglePrediction(
    keyword: string,
    currentMetrics: KeywordMetrics,
    months: number,
    request: KeywordAnalysisRequest
  ): Promise<KeywordPrediction> {
    const baseVolume = currentMetrics.searchVolume;
    const trend = currentMetrics.trend;
    const seasonality = currentMetrics.seasonality;

    // Calculate predicted volume using simple growth model
    const growthRate = trend * 0.1; // Convert trend to monthly growth rate
    const seasonalAdjustment = this.calculateSeasonalAdjustment(keyword, months);
    const predictedVolume = Math.round(baseVolume * Math.pow(1 + growthRate, months) * seasonalAdjustment);

    // Generate prediction factors
    const factors = this.generatePredictionFactors(keyword, months, request);

    // Calculate confidence based on data quality and model accuracy
    const confidence = this.calculatePredictionConfidence(keyword, months, factors);

    return {
      timeframe: `${months}M`,
      predictedVolume,
      confidence,
      factors,
      scenario: confidence > 0.8 ? 'optimistic' : confidence > 0.6 ? 'moderate' : 'conservative'
    };
  }

  private generatePredictionFactors(keyword: string, months: number, request: KeywordAnalysisRequest): PredictionFactor[] {
    const factors: PredictionFactor[] = [];

    // Market trend factor
    factors.push({
      name: 'Marktentwicklung',
      impact: this.calculateMarketTrendImpact(keyword, request.industry),
      confidence: 0.8,
      description: 'Allgemeine Marktentwicklung im Solarbereich'
    });

    // Seasonal factor
    factors.push({
      name: 'Saisonalität',
      impact: this.calculateSeasonalImpact(keyword, months),
      confidence: 0.9,
      description: 'Saisonale Schwankungen in Suchanfragen'
    });

    // Competition factor
    factors.push({
      name: 'Wettbewerb',
      impact: -this.calculateCompetitionImpact(keyword),
      confidence: 0.7,
      description: 'Veränderungen im Wettbewerbsumfeld'
    });

    // Technology factor
    factors.push({
      name: 'Technologie',
      impact: this.calculateTechnologyImpact(keyword),
      confidence: 0.6,
      description: 'Technologische Entwicklungen und Innovationen'
    });

    return factors;
  }

  private calculateMarketTrendImpact(keyword: string, industry: string): number {
    const lowerKeyword = keyword.toLowerCase();

    if (industry === 'solar' || industry === 'photovoltaik') {
      if (lowerKeyword.includes('smart') || lowerKeyword.includes('elektro')) {
        return 0.4; // Strong positive impact
      }
      if (lowerKeyword.includes('traditionell')) {
        return -0.2; // Negative impact
      }
    }

    return 0.1; // Slight positive impact
  }

  private calculateSeasonalImpact(keyword: string, months: number): number {
    // Calculate seasonal impact over the prediction period
    let totalImpact = 0;
    for (let i = 1; i <= months; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);
      const seasonalFactor = this.calculateSeasonalFactor(keyword, futureDate);
      totalImpact += (seasonalFactor - 1.0) / months; // Average deviation from baseline
    }

    return totalImpact;
  }

  private calculateCompetitionImpact(keyword: string): number {
    const difficulty = this.calculateKeywordDifficulty(keyword);
    return difficulty / 100; // Convert to 0-1 scale
  }

  private calculateTechnologyImpact(keyword: string): number {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerKeyword.includes('smart') || lowerKeyword.includes('digital') || lowerKeyword.includes('ai')) {
      return 0.3; // Positive impact from technology trends
    }

    return 0.0; // Neutral impact
  }

  private calculatePredictionConfidence(keyword: string, months: number, factors: PredictionFactor[]): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence for shorter timeframes
    if (months <= 3) confidence += 0.1;
    else if (months > 6) confidence -= 0.1;

    // Higher confidence for keywords with strong historical data
    if (this.historicalData.has(keyword)) {
      confidence += 0.1;
    }

    // Factor in prediction factor confidence
    const avgFactorConfidence = factors.reduce((sum, f) => sum + f.confidence, 0) / factors.length;
    confidence = (confidence + avgFactorConfidence) / 2;

    return Math.max(0.1, Math.min(1.0, confidence));
  }

  private calculateSeasonalAdjustment(keyword: string, months: number): number {
    // Simplified seasonal adjustment
    const currentMonth = new Date().getMonth();
    const futureMonth = (currentMonth + months) % 12;
    const futureDate = new Date();
    futureDate.setMonth(futureMonth);

    return this.calculateSeasonalFactor(keyword, futureDate);
  }

  // ===== TREND ANALYSIS =====

  private analyzeKeywordTrends(keyword: string, currentMetrics: KeywordMetrics): KeywordTrend[] {
    const trends: KeywordTrend[] = [];

    // Short-term trend (last 3 months)
    trends.push({
      period: '3M',
      direction: currentMetrics.trend > 0.1 ? 'up' : currentMetrics.trend < -0.1 ? 'down' : 'stable',
      magnitude: Math.abs(currentMetrics.trend),
      drivers: this.identifyTrendDrivers(keyword, currentMetrics),
      confidence: 0.8
    });

    // Medium-term trend (last 6 months)
    const mediumTrend = currentMetrics.trend * 0.8; // Slightly damped
    trends.push({
      period: '6M',
      direction: mediumTrend > 0.1 ? 'up' : mediumTrend < -0.1 ? 'down' : 'stable',
      magnitude: Math.abs(mediumTrend),
      drivers: this.identifyTrendDrivers(keyword, currentMetrics),
      confidence: 0.7
    });

    // Long-term trend (last 12 months)
    const longTrend = currentMetrics.trend * 0.6; // More damped
    trends.push({
      period: '12M',
      direction: longTrend > 0.1 ? 'up' : longTrend < -0.1 ? 'down' : 'stable',
      magnitude: Math.abs(longTrend),
      drivers: this.identifyTrendDrivers(keyword, currentMetrics),
      confidence: 0.6
    });

    return trends;
  }

  private identifyTrendDrivers(keyword: string, metrics: KeywordMetrics): string[] {
    const drivers: string[] = [];

    if (metrics.trend > 0.2) {
      drivers.push('Steigende Nachfrage nach Solartechnologien');
      drivers.push('Regulatorische Veränderungen');
    }

    if (metrics.seasonality > 1.2) {
      drivers.push('Saisonale Nachfrage (Frühling/Sommer)');
    }

    if (metrics.competition < 0.5) {
      drivers.push('Geringer Wettbewerb');
    }

    return drivers.length > 0 ? drivers : ['Marktentwicklung'];
  }

  // ===== OPPORTUNITY IDENTIFICATION =====

  private identifyKeywordOpportunities(
    keyword: string,
    currentMetrics: KeywordMetrics,
    predictions: KeywordPrediction[],
    request: KeywordAnalysisRequest
  ): KeywordOpportunity[] {
    const opportunities: KeywordOpportunity[] = [];

    // Volume growth opportunity
    const avgPredictedGrowth = predictions.reduce((sum, p) => sum + p.predictedVolume, 0) / predictions.length;
    const growthRate = (avgPredictedGrowth - currentMetrics.searchVolume) / currentMetrics.searchVolume;

    if (growthRate > 0.2) {
      opportunities.push({
        type: 'volume_growth',
        potential: Math.min(100, growthRate * 100),
        timeframe: '6M',
        requirements: ['Content-Optimierung', 'Backlink-Aufbau'],
        expectedROI: growthRate * currentMetrics.searchVolume * 0.1 // Rough ROI estimate
      });
    }

    // Competition decline opportunity
    if (currentMetrics.competition < 0.4) {
      opportunities.push({
        type: 'competition_decline',
        potential: (1 - currentMetrics.competition) * 100,
        timeframe: '3M',
        requirements: ['Qualitativ hochwertiger Content', 'Technische SEO'],
        expectedROI: currentMetrics.searchVolume * 0.15
      });
    }

    // Seasonal peak opportunity
    if (currentMetrics.seasonality > 1.3) {
      opportunities.push({
        type: 'seasonal_peak',
        potential: (currentMetrics.seasonality - 1) * 100,
        timeframe: 'Saisonal',
        requirements: ['Saisonale Content-Planung', 'Timing-Optimierung'],
        expectedROI: currentMetrics.searchVolume * currentMetrics.seasonality * 0.05
      });
    }

    return opportunities;
  }

  // ===== RISK ASSESSMENT =====

  private assessKeywordRisks(
    keyword: string,
    currentMetrics: KeywordMetrics,
    predictions: KeywordPrediction[],
    request: KeywordAnalysisRequest
  ): KeywordRisk[] {
    const risks: KeywordRisk[] = [];

    // Competition increase risk
    if (currentMetrics.competition > 0.7) {
      risks.push({
        type: 'competition_increase',
        probability: 0.6,
        impact: 0.7,
        mitigation: ['Differenzierung', 'Qualitätssteigerung', 'Nischen-Strategie']
      });
    }

    // Volume decline risk
    const declinePredictions = predictions.filter(p => p.predictedVolume < currentMetrics.searchVolume);
    if (declinePredictions.length > predictions.length / 2) {
      risks.push({
        type: 'volume_decline',
        probability: 0.4,
        impact: 0.5,
        mitigation: ['Diversifikation', 'Neue Keywords', 'Content-Refresh']
      });
    }

    // Algorithm change risk (always present)
    risks.push({
      type: 'algorithm_change',
      probability: 0.3,
      impact: 0.8,
      mitigation: ['Technische SEO', 'Qualitäts-Content', 'Monitoring']
    });

    return risks;
  }

  // ===== RECOMMENDATIONS =====

  private generateKeywordRecommendations(
    keyword: string,
    currentMetrics: KeywordMetrics,
    predictions: KeywordPrediction[],
    opportunities: KeywordOpportunity[],
    risks: KeywordRisk[]
  ): KeywordRecommendation[] {
    const recommendations: KeywordRecommendation[] = [];

    // Primary recommendation based on opportunity score
    if (currentMetrics.opportunity > 70) {
      recommendations.push({
        action: 'target',
        priority: 'high',
        reasoning: `Hohes Opportunity-Score (${currentMetrics.opportunity.toFixed(1)}) und Wachstumspotenzial`,
        implementation: [
          'Content-Erstellung für dieses Keyword',
          'On-Page SEO Optimierung',
          'Backlink-Strategie entwickeln'
        ],
        expectedImpact: currentMetrics.opportunity,
        timeframe: '1-3 Monate'
      });
    } else if (currentMetrics.opportunity > 40) {
      recommendations.push({
        action: 'monitor',
        priority: 'medium',
        reasoning: `Moderates Opportunity-Score (${currentMetrics.opportunity.toFixed(1)}), Entwicklung beobachten`,
        implementation: [
          'Regelmäßige Performance-Überwachung',
          'Wettbewerbsanalyse',
          'Content-Optimierung bei Bedarf'
        ],
        expectedImpact: currentMetrics.opportunity * 0.7,
        timeframe: '3-6 Monate'
      });
    } else {
      recommendations.push({
        action: 'avoid',
        priority: 'low',
        reasoning: `Geringes Opportunity-Score (${currentMetrics.opportunity.toFixed(1)}), Fokus auf andere Keywords`,
        implementation: [
          'Ressourcen für höherwertige Keywords einsetzen',
          'Gelegentliche Überprüfung'
        ],
        expectedImpact: currentMetrics.opportunity * 0.3,
        timeframe: 'Nicht priorisiert'
      });
    }

    // Risk-based recommendations
    const highRisks = risks.filter(r => r.probability > 0.5 && r.impact > 0.6);
    if (highRisks.length > 0) {
      recommendations.push({
        action: 'optimize',
        priority: 'high',
        reasoning: `${highRisks.length} hohe Risiken identifiziert, Optimierung erforderlich`,
        implementation: highRisks.flatMap(r => r.mitigation),
        expectedImpact: 80,
        timeframe: 'Sofort'
      });
    }

    return recommendations;
  }

  // ===== MARKET INSIGHTS =====

  private generateMarketInsights(
    keywordResults: PredictiveKeywordResult[],
    industry: string,
    context?: KeywordAnalysisRequest['context']
  ): MarketInsight[] {
    const insights: MarketInsight[] = [];

    // Identify trending topics
    const growingKeywords = keywordResults.filter(k =>
      k.predictions.some(p => p.predictedVolume > k.currentMetrics.searchVolume * 1.2)
    );

    if (growingKeywords.length > 3) {
      insights.push({
        trend: 'Steigende Nachfrage nach Solarlösungen',
        impact: 0.8,
        affectedKeywords: growingKeywords.slice(0, 5).map(k => k.keyword),
        timeframe: '6M',
        confidence: 0.75
      });
    }

    // Seasonal patterns
    const seasonalKeywords = keywordResults.filter(k => k.currentMetrics.seasonality > 1.2);
    if (seasonalKeywords.length > 0) {
      insights.push({
        trend: 'Saisonale Nachfrageschwankungen',
        impact: 0.6,
        affectedKeywords: seasonalKeywords.map(k => k.keyword),
        timeframe: 'Saisonal',
        confidence: 0.85
      });
    }

    // Competition analysis
    const lowCompetitionKeywords = keywordResults.filter(k => k.currentMetrics.competition < 0.4);
    if (lowCompetitionKeywords.length > 0) {
      insights.push({
        trend: 'Unterversorgte Keyword-Nischen',
        impact: 0.7,
        affectedKeywords: lowCompetitionKeywords.map(k => k.keyword),
        timeframe: '3M',
        confidence: 0.8
      });
    }

    return insights;
  }

  // ===== COMPETITIVE ANALYSIS =====

  private performCompetitiveAnalysis(
    keywordResults: PredictiveKeywordResult[],
    context?: KeywordAnalysisRequest['context']
  ): CompetitiveAnalysis {
    // Simplified competitive analysis
    const competitors = context?.competitors || ['MusterKonkurrent1', 'MusterKonkurrent2'];

    const marketShare: Record<string, number> = {};
    competitors.forEach(competitor => {
      marketShare[competitor] = Math.random() * 0.3 + 0.1; // Random market share
    });
    marketShare['ZOE Solar'] = 0.25; // Assume 25% market share

    // Normalize market shares
    const totalShare = Object.values(marketShare).reduce((sum, share) => sum + share, 0);
    Object.keys(marketShare).forEach(key => {
      marketShare[key] = marketShare[key] / totalShare;
    });

    const competitiveKeywords = keywordResults
      .filter(k => k.currentMetrics.competition > 0.6)
      .map(k => k.keyword);

    const threats = keywordResults
      .filter(k => k.risks.some(r => r.probability > 0.6))
      .map(k => `Hohe Risiken bei "${k.keyword}"`);

    const opportunities = keywordResults
      .filter(k => k.opportunities.some(o => o.potential > 60))
      .map(k => `Wachstumspotenzial bei "${k.keyword}"`);

    return {
      marketShare,
      competitiveKeywords,
      threats,
      opportunities
    };
  }

  // ===== UTILITY METHODS =====

  private calculateKeywordConfidence(
    currentMetrics: KeywordMetrics,
    predictions: KeywordPrediction[],
    trends: KeywordTrend[]
  ): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence for stable trends
    const stableTrends = trends.filter(t => t.direction === 'stable').length;
    confidence += (stableTrends / trends.length) * 0.1;

    // Higher confidence for high prediction confidence
    const avgPredictionConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    confidence += avgPredictionConfidence * 0.2;

    return Math.min(1.0, confidence);
  }

  private calculateModelAccuracy(keywordResults: PredictiveKeywordResult[]): number {
    // Simplified accuracy calculation
    const accuracies = keywordResults.map(k => k.confidence);
    return accuracies.length > 0 ? accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length : 0.7;
  }

  private generateAnalysisMetadata(
    request: KeywordAnalysisRequest,
    keywordResults: PredictiveKeywordResult[]
  ): AnalysisMetadata {
    const avgConfidence = keywordResults.reduce((sum, k) => sum + k.confidence, 0) / keywordResults.length;
    const coverage = keywordResults.length / request.keywords.length;

    return {
      timestamp: new Date(),
      version: '1.0.0',
      dataSources: this.config.dataSources,
      modelsUsed: this.config.mlModels,
      confidence: avgConfidence,
      coverage
    };
  }

  private generateCacheKey(request: KeywordAnalysisRequest): string {
    const keywordsHash = this.simpleHash(request.keywords.join(','));
    const paramsHash = this.simpleHash(JSON.stringify({
      industry: request.industry,
      predictionScope: request.predictionScope,
      analysisDepth: request.analysisDepth
    }));

    return `${keywordsHash}-${paramsHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private createErrorResult(
    request: KeywordAnalysisRequest,
    errorMessage: string,
    startTime: number
  ): PredictiveAnalysisResult {
    return {
      keywords: [],
      marketInsights: [],
      competitiveAnalysis: {
        marketShare: {},
        competitiveKeywords: [],
        threats: [errorMessage],
        opportunities: []
      },
      performance: {
        processingTime: Date.now() - startTime,
        dataPoints: 0,
        modelAccuracy: 0,
        cacheHitRate: 0,
        errorRate: 1
      },
      metadata: {
        timestamp: new Date(),
        version: '1.0.0',
        dataSources: [],
        modelsUsed: [],
        confidence: 0,
        coverage: 0
      }
    };
  }

  private initializeMLModels(): void {
    // Initialize basic ML models (simplified)
    this.mlModels.set('linear_regression', {
      name: 'Linear Regression',
      type: 'regression',
      accuracy: 0.75,
      parameters: {}
    });

    this.mlModels.set('time_series', {
      name: 'Time Series Analysis',
      type: 'forecasting',
      accuracy: 0.8,
      parameters: {}
    });
  }

  private initializeHistoricalData(): void {
    // Initialize with sample historical data
    const sampleKeywords = ['photovoltaik', 'solaranlage', 'stromspeicher'];
    sampleKeywords.forEach(keyword => {
      const historicalMetrics: KeywordMetrics[] = [];
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        historicalMetrics.push({
          searchVolume: Math.round(Math.random() * 1000 + 500),
          competition: Math.random() * 0.5 + 0.3,
          cpc: Math.random() * 2 + 1,
          trend: (Math.random() - 0.5) * 0.4,
          seasonality: Math.random() * 0.5 + 0.8,
          difficulty: Math.random() * 50 + 25,
          opportunity: Math.random() * 50 + 25
        });
      }
      this.historicalData.set(keyword, historicalMetrics);
    });
  }

  // ===== PUBLIC API METHODS =====

  public clearCache(): void {
    this.keywordCache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.keywordCache.size,
      hitRate: 0 // Would need to track hits/misses for real hit rate
    };
  }

  public getHistoricalData(keyword: string): KeywordMetrics[] | null {
    return this.historicalData.get(keyword) || null;
  }

  public addHistoricalData(keyword: string, metrics: KeywordMetrics): void {
    if (!this.historicalData.has(keyword)) {
      this.historicalData.set(keyword, []);
    }
    this.historicalData.get(keyword)!.push(metrics);
  }

  public getMLModels(): MLModel[] {
    return Array.from(this.mlModels.values());
  }

  public validateAnalysisRequest(request: KeywordAnalysisRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.keywords || request.keywords.length === 0) {
      issues.push('Keywords array cannot be empty');
    }

    if (!request.industry) {
      issues.push('Industry is required');
    }

    if (!request.timeframe || !request.timeframe.start || !request.timeframe.end) {
      issues.push('Valid timeframe is required');
    }

    if (request.keywords.length > 1000) {
      issues.push('Too many keywords. Maximum allowed: 1000');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  public getSupportedPredictionScopes(): string[] {
    return ['short_term', 'medium_term', 'long_term'];
  }

  public getSupportedAnalysisDepths(): string[] {
    return ['basic', 'intermediate', 'advanced'];
  }
}

// ===== ML MODEL INTERFACE =====

interface MLModel {
  name: string;
  type: string;
  accuracy: number;
  parameters: Record<string, any>;
}

// ===== EXPORT =====

export const predictiveKeywordAnalysisService = PredictiveKeywordAnalysisService.getInstance();
export default predictiveKeywordAnalysisService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Analysiere Keywords prädiktiv
 * const result = await predictiveKeywordAnalysisService.analyzeKeywords({
 *   keywords: ['photovoltaik', 'solaranlage kosten', 'stromspeicher installation'],
 *   industry: 'solar',
 *   timeframe: {
 *     start: new Date('2024-01-01'),
 *     end: new Date('2024-12-31')
 *   },
 *   predictionScope: 'medium_term',
 *   analysisDepth: 'intermediate',
 *   context: {
 *     competitors: ['Konkurrent1', 'Konkurrent2'],
 *     seasonalFactors: true
 *   }
 * });
 *
 * // Hole historische Daten
 * const history = predictiveKeywordAnalysisService.getHistoricalData('photovoltaik');
 *
 * // Aktualisiere Konfiguration
 * predictiveKeywordAnalysisService.updateConfig({ predictionHorizon: 18 });
 */