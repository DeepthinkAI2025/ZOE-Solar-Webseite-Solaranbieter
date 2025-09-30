/**
 * AI Monitoring & Analytics Service für ZOE Solar
 *
 * Umfassendes Monitoring und Analytics für AI-Sichtbarkeit:
 * - AI-Search Performance Tracking
 * - Zero-Click Search Optimization
 * - AI Citation und Mention Monitoring
 * - Predictive SEO Trend Analysis
 */

import { aiPlatformIntegrationService } from './aiPlatformIntegrationService';
import { semanticAIUnderstandingService } from './semanticAIUnderstandingService';

// ===== INTERFACES & TYPES =====

export interface AISearchPerformance {
  platform: string;
  query: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  featuredSnippet: boolean;
  knowledgePanel: boolean;
  aiSummary: boolean;
  lastUpdated: Date;
}

export interface ZeroClickMetrics {
  query: string;
  zeroClickRate: number;
  aiResponseRate: number;
  featuredSnippetRate: number;
  knowledgePanelRate: number;
  localPackRate: number;
  totalSearches: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface AICitation {
  id: string;
  platform: string;
  sourceUrl: string;
  citedUrl: string;
  citationText: string;
  context: string;
  authority: number;
  relevance: number;
  sentiment: number;
  discoveredAt: Date;
  lastVerified: Date;
  status: 'active' | 'outdated' | 'removed';
}

export interface AIMention {
  id: string;
  platform: string;
  source: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reach: number;
  engagement: number;
  discoveredAt: Date;
  url?: string;
}

export interface PredictiveSEOTrend {
  trendId: string;
  trendName: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  timeframe: string;
  affectedKeywords: string[];
  recommendedActions: string[];
  dataPoints: TrendDataPoint[];
  predictedGrowth: number;
  lastUpdated: Date;
}

export interface TrendDataPoint {
  date: Date;
  value: number;
  confidence: number;
  source: string;
}

export interface AIMonitoringDashboard {
  overview: {
    totalAISearches: number;
    averageZeroClickRate: number;
    activeCitations: number;
    trendingTopics: string[];
    aiVisibilityScore: number;
  };
  performance: {
    platformBreakdown: Record<string, AISearchPerformance[]>;
    zeroClickAnalysis: ZeroClickMetrics[];
    citationHealth: CitationHealthMetrics;
  };
  trends: {
    currentTrends: PredictiveSEOTrend[];
    emergingPatterns: EmergingPattern[];
    seasonalVariations: SeasonalVariation[];
  };
  alerts: AIMonitoringAlert[];
  recommendations: AIImprovementRecommendation[];
}

export interface CitationHealthMetrics {
  totalCitations: number;
  activeCitations: number;
  outdatedCitations: number;
  averageAuthority: number;
  averageRelevance: number;
  citationDistribution: Record<string, number>;
}

export interface EmergingPattern {
  pattern: string;
  frequency: number;
  growth: number;
  firstSeen: Date;
  relatedQueries: string[];
}

export interface SeasonalVariation {
  season: string;
  query: string;
  baselinePerformance: number;
  seasonalMultiplier: number;
  confidence: number;
}

export interface AIMonitoringAlert {
  id: string;
  type: 'performance_drop' | 'citation_loss' | 'trend_emergence' | 'zero_click_increase';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedEntities: string[];
  recommendedAction: string;
  createdAt: Date;
  acknowledged: boolean;
}

export interface AIImprovementRecommendation {
  id: string;
  category: 'content' | 'technical' | 'citation' | 'trend';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: number;
  implementationEffort: 'low' | 'medium' | 'high';
  timeframe: string;
  metrics: string[];
}

// ===== MAIN SERVICE CLASS =====

class AIMonitoringAnalyticsService {
  private static instance: AIMonitoringAnalyticsService;
  private searchPerformanceData: Map<string, AISearchPerformance[]> = new Map();
  private zeroClickMetrics: ZeroClickMetrics[] = [];
  private citations: Map<string, AICitation> = new Map();
  private mentions: Map<string, AIMention> = new Map();
  private predictiveTrends: Map<string, PredictiveSEOTrend> = new Map();
  private alerts: AIMonitoringAlert[] = [];
  private monitoringConfig: AIMonitoringConfig;

  private constructor() {
    this.monitoringConfig = this.getDefaultConfig();
    this.initializeMockData();
  }

  public static getInstance(): AIMonitoringAnalyticsService {
    if (!AIMonitoringAnalyticsService.instance) {
      AIMonitoringAnalyticsService.instance = new AIMonitoringAnalyticsService();
    }
    return AIMonitoringAnalyticsService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): AIMonitoringConfig {
    return {
      enabled: true,
      platforms: {
        google: true,
        bing: true,
        openai: true,
        perplexity: true
      },
      monitoring: {
        performanceTracking: true,
        zeroClickAnalysis: true,
        citationMonitoring: true,
        mentionTracking: true,
        trendAnalysis: true
      },
      alerts: {
        enabled: true,
        performanceThreshold: 0.1, // 10% drop
        citationThreshold: 5, // 5 lost citations
        zeroClickThreshold: 0.8 // 80% zero-click rate
      },
      dataRetention: {
        performanceData: 90, // days
        citationData: 365, // days
        trendData: 180 // days
      },
      updateFrequency: {
        performance: 3600000, // 1 hour
        citations: 86400000, // 1 day
        trends: 604800000 // 1 week
      }
    };
  }

  public updateConfig(newConfig: Partial<AIMonitoringConfig>): void {
    this.monitoringConfig = { ...this.monitoringConfig, ...newConfig };
  }

  public getConfig(): AIMonitoringConfig {
    return { ...this.monitoringConfig };
  }

  // ===== PERFORMANCE TRACKING =====

  public async trackAISearchPerformance(
    platform: string,
    query: string,
    metrics: Partial<AISearchPerformance>
  ): Promise<void> {
    const performance: AISearchPerformance = {
      platform,
      query,
      position: metrics.position || 0,
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      ctr: metrics.ctr || 0,
      featuredSnippet: metrics.featuredSnippet || false,
      knowledgePanel: metrics.knowledgePanel || false,
      aiSummary: metrics.aiSummary || false,
      lastUpdated: new Date()
    };

    if (!this.searchPerformanceData.has(platform)) {
      this.searchPerformanceData.set(platform, []);
    }

    const platformData = this.searchPerformanceData.get(platform)!;
    const existingIndex = platformData.findIndex(p => p.query === query);

    if (existingIndex >= 0) {
      platformData[existingIndex] = performance;
    } else {
      platformData.push(performance);
    }

    // Check for performance alerts
    await this.checkPerformanceAlerts(platform, performance);
  }

  public getAISearchPerformance(
    platform?: string,
    query?: string,
    dateRange?: { start: Date; end: Date }
  ): AISearchPerformance[] {
    let data: AISearchPerformance[] = [];

    if (platform) {
      data = this.searchPerformanceData.get(platform) || [];
    } else {
      // Combine all platforms
      for (const platformData of this.searchPerformanceData.values()) {
        data.push(...platformData);
      }
    }

    // Filter by query if specified
    if (query) {
      data = data.filter(p => p.query.toLowerCase().includes(query.toLowerCase()));
    }

    // Filter by date range if specified
    if (dateRange) {
      data = data.filter(p =>
        p.lastUpdated >= dateRange.start && p.lastUpdated <= dateRange.end
      );
    }

    return data.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }

  // ===== ZERO-CLICK ANALYSIS =====

  public async analyzeZeroClickSearches(
    queries: string[],
    dateRange: { start: Date; end: Date }
  ): Promise<ZeroClickMetrics[]> {
    const results: ZeroClickMetrics[] = [];

    for (const query of queries) {
      const metrics = await this.calculateZeroClickMetrics(query, dateRange);
      if (metrics) {
        results.push(metrics);
        this.zeroClickMetrics.push(metrics);
      }
    }

    // Check for zero-click alerts
    await this.checkZeroClickAlerts(results);

    return results;
  }

  private async calculateZeroClickMetrics(
    query: string,
    dateRange: { start: Date; end: Date }
  ): Promise<ZeroClickMetrics | null> {
    // Get performance data for this query across all platforms
    const performanceData = this.getAISearchPerformance(undefined, query, dateRange);

    if (performanceData.length === 0) return null;

    // Calculate zero-click metrics
    const totalSearches = performanceData.reduce((sum, p) => sum + p.impressions, 0);
    const totalClicks = performanceData.reduce((sum, p) => sum + p.clicks, 0);

    const aiResponses = performanceData.filter(p => p.aiSummary).length;
    const featuredSnippets = performanceData.filter(p => p.featuredSnippet).length;
    const knowledgePanels = performanceData.filter(p => p.knowledgePanel).length;

    // Estimate local pack appearances (simplified)
    const localPackRate = query.toLowerCase().includes('near me') ||
                         query.toLowerCase().includes('berlin') ? 0.3 : 0.1;

    return {
      query,
      zeroClickRate: totalClicks / totalSearches,
      aiResponseRate: aiResponses / performanceData.length,
      featuredSnippetRate: featuredSnippets / performanceData.length,
      knowledgePanelRate: knowledgePanels / performanceData.length,
      localPackRate,
      totalSearches,
      dateRange
    };
  }

  public getZeroClickMetrics(
    query?: string,
    minZeroClickRate?: number
  ): ZeroClickMetrics[] {
    let metrics = [...this.zeroClickMetrics];

    if (query) {
      metrics = metrics.filter(m => m.query.toLowerCase().includes(query.toLowerCase()));
    }

    if (minZeroClickRate !== undefined) {
      metrics = metrics.filter(m => m.zeroClickRate >= minZeroClickRate);
    }

    return metrics.sort((a, b) => b.zeroClickRate - a.zeroClickRate);
  }

  // ===== CITATION MONITORING =====

  public async addCitation(citation: Omit<AICitation, 'id' | 'discoveredAt' | 'lastVerified'>): Promise<string> {
    const id = `citation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newCitation: AICitation = {
      id,
      ...citation,
      discoveredAt: new Date(),
      lastVerified: new Date(),
      status: 'active'
    };

    this.citations.set(id, newCitation);

    // Check for citation alerts
    await this.checkCitationAlerts();

    return id;
  }

  public async updateCitationStatus(id: string, status: AICitation['status']): Promise<boolean> {
    const citation = this.citations.get(id);
    if (!citation) return false;

    citation.status = status;
    citation.lastVerified = new Date();

    // Check for citation loss alerts
    if (status === 'removed' || status === 'outdated') {
      await this.checkCitationAlerts();
    }

    return true;
  }

  public getCitations(
    platform?: string,
    status?: AICitation['status'],
    minAuthority?: number
  ): AICitation[] {
    let citations = Array.from(this.citations.values());

    if (platform) {
      citations = citations.filter(c => c.platform === platform);
    }

    if (status) {
      citations = citations.filter(c => c.status === status);
    }

    if (minAuthority !== undefined) {
      citations = citations.filter(c => c.authority >= minAuthority);
    }

    return citations.sort((a, b) => b.lastVerified.getTime() - a.lastVerified.getTime());
  }

  public getCitationHealthMetrics(): CitationHealthMetrics {
    const citations = Array.from(this.citations.values());
    const activeCitations = citations.filter(c => c.status === 'active');

    const citationDistribution: Record<string, number> = {};
    citations.forEach(citation => {
      citationDistribution[citation.platform] = (citationDistribution[citation.platform] || 0) + 1;
    });

    return {
      totalCitations: citations.length,
      activeCitations: activeCitations.length,
      outdatedCitations: citations.filter(c => c.status === 'outdated').length,
      averageAuthority: activeCitations.reduce((sum, c) => sum + c.authority, 0) / activeCitations.length || 0,
      averageRelevance: activeCitations.reduce((sum, c) => sum + c.relevance, 0) / activeCitations.length || 0,
      citationDistribution
    };
  }

  // ===== MENTION TRACKING =====

  public async addMention(mention: Omit<AIMention, 'id' | 'discoveredAt'>): Promise<string> {
    const id = `mention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newMention: AIMention = {
      id,
      ...mention,
      discoveredAt: new Date()
    };

    this.mentions.set(id, newMention);

    // Analyze sentiment and update metrics
    await this.analyzeMentionSentiment(newMention);

    return id;
  }

  public getMentions(
    platform?: string,
    sentiment?: AIMention['sentiment'],
    minEngagement?: number
  ): AIMention[] {
    let mentions = Array.from(this.mentions.values());

    if (platform) {
      mentions = mentions.filter(m => m.platform === platform);
    }

    if (sentiment) {
      mentions = mentions.filter(m => m.sentiment === sentiment);
    }

    if (minEngagement !== undefined) {
      mentions = mentions.filter(m => m.engagement >= minEngagement);
    }

    return mentions.sort((a, b) => b.discoveredAt.getTime() - a.discoveredAt.getTime());
  }

  private async analyzeMentionSentiment(mention: AIMention): Promise<void> {
    // Simple sentiment analysis (would use ML model in production)
    const content = mention.content.toLowerCase();

    const positiveWords = ['gut', 'besser', 'erfolgreich', 'zufrieden', 'effizient', 'professionell', 'empfehlenswert'];
    const negativeWords = ['schlecht', 'teuer', 'problematisch', 'enttäuschend', 'schwierig'];

    const positiveCount = positiveWords.reduce((count, word) =>
      count + (content.split(word).length - 1), 0
    );

    const negativeCount = negativeWords.reduce((count, word) =>
      count + (content.split(word).length - 1), 0
    );

    if (positiveCount > negativeCount) {
      mention.sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      mention.sentiment = 'negative';
    } else {
      mention.sentiment = 'neutral';
    }
  }

  // ===== PREDICTIVE TREND ANALYSIS =====

  public async analyzePredictiveTrends(keywords: string[]): Promise<PredictiveSEOTrend[]> {
    const trends: PredictiveSEOTrend[] = [];

    for (const keyword of keywords) {
      const trend = await this.analyzeKeywordTrend(keyword);
      if (trend) {
        trends.push(trend);
        this.predictiveTrends.set(trend.trendId, trend);
      }
    }

    // Identify emerging patterns
    const emergingPatterns = await this.identifyEmergingPatterns(trends);
    const seasonalVariations = await this.analyzeSeasonalVariations(keywords);

    // Combine all trend data
    return [...trends, ...emergingPatterns, ...seasonalVariations];
  }

  private async analyzeKeywordTrend(keyword: string): Promise<PredictiveSEOTrend | null> {
    // Get historical performance data
    const performanceData = this.getAISearchPerformance(undefined, keyword, {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      end: new Date()
    });

    if (performanceData.length < 7) return null; // Need at least a week of data

    // Calculate trend metrics
    const dataPoints = this.generateTrendDataPoints(performanceData);
    const growth = this.calculateTrendGrowth(dataPoints);
    const confidence = this.calculateTrendConfidence(dataPoints);

    if (Math.abs(growth) < 0.05) return null; // No significant trend

    const trendId = `trend_${keyword.replace(/\s+/g, '_')}_${Date.now()}`;

    return {
      trendId,
      trendName: `${keyword} Trend`,
      description: this.generateTrendDescription(keyword, growth, confidence),
      impact: this.determineTrendImpact(growth, confidence),
      confidence,
      timeframe: this.predictTrendTimeframe(growth),
      affectedKeywords: [keyword, ...this.findRelatedKeywords(keyword)],
      recommendedActions: this.generateTrendActions(keyword, growth),
      dataPoints,
      predictedGrowth: growth,
      lastUpdated: new Date()
    };
  }

  private generateTrendDataPoints(performanceData: AISearchPerformance[]): TrendDataPoint[] {
    // Group by date and calculate daily metrics
    const dailyData = new Map<string, { impressions: number; clicks: number; count: number }>();

    performanceData.forEach(p => {
      const dateKey = p.lastUpdated.toISOString().split('T')[0];
      const existing = dailyData.get(dateKey) || { impressions: 0, clicks: 0, count: 0 };

      dailyData.set(dateKey, {
        impressions: existing.impressions + p.impressions,
        clicks: existing.clicks + p.clicks,
        count: existing.count + 1
      });
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date: new Date(date),
      value: data.clicks / data.impressions || 0, // CTR as trend metric
      confidence: Math.min(1.0, data.count / 10), // Confidence based on data points
      source: 'search_performance'
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private calculateTrendGrowth(dataPoints: TrendDataPoint[]): number {
    if (dataPoints.length < 2) return 0;

    const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
    const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));

    const firstAvg = firstHalf.reduce((sum, dp) => sum + dp.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, dp) => sum + dp.value, 0) / secondHalf.length;

    return firstAvg !== 0 ? (secondAvg - firstAvg) / firstAvg : 0;
  }

  private calculateTrendConfidence(dataPoints: TrendDataPoint[]): number {
    const avgConfidence = dataPoints.reduce((sum, dp) => sum + dp.confidence, 0) / dataPoints.length;
    const dataPointCount = dataPoints.length;

    // Higher confidence with more data points and consistent confidence scores
    return Math.min(1.0, (avgConfidence * 0.7) + (Math.min(dataPointCount / 30, 1) * 0.3));
  }

  private generateTrendDescription(keyword: string, growth: number, confidence: number): string {
    const direction = growth > 0 ? 'steigend' : 'fallend';
    const strength = Math.abs(growth) > 0.2 ? 'stark' : Math.abs(growth) > 0.1 ? 'moderat' : 'leicht';

    return `Das Keyword "${keyword}" zeigt eine ${strength} ${direction}e Tendenz mit ${Math.round(confidence * 100)}% Konfidenz.`;
  }

  private determineTrendImpact(growth: number, confidence: number): 'high' | 'medium' | 'low' {
    const impactScore = Math.abs(growth) * confidence;

    if (impactScore > 0.15) return 'high';
    if (impactScore > 0.08) return 'medium';
    return 'low';
  }

  private predictTrendTimeframe(growth: number): string {
    const absGrowth = Math.abs(growth);

    if (absGrowth > 0.3) return '1-3 Monate';
    if (absGrowth > 0.15) return '3-6 Monate';
    if (absGrowth > 0.08) return '6-12 Monate';
    return '12+ Monate';
  }

  private findRelatedKeywords(keyword: string): string[] {
    // Simple related keyword finding (would use ML in production)
    const related: string[] = [];

    if (keyword.includes('photovoltaik')) {
      related.push('solaranlage', 'sonnenenergie', 'pv-anlage');
    }

    if (keyword.includes('berlin')) {
      related.push('berlin photovoltaik', 'solar berlin');
    }

    return related.slice(0, 3);
  }

  private generateTrendActions(keyword: string, growth: number): string[] {
    const actions: string[] = [];

    if (growth > 0) {
      actions.push(`Content für "${keyword}" ausbauen`);
      actions.push('Backlinks für wachsende Keywords aufbauen');
    } else {
      actions.push(`Alternative Keywords für "${keyword}" finden`);
      actions.push('Content-Optimierung für rückläufige Keywords');
    }

    return actions;
  }

  private async identifyEmergingPatterns(trends: PredictiveSEOTrend[]): Promise<PredictiveSEOTrend[]> {
    const patterns: PredictiveSEOTrend[] = [];

    // Look for patterns across trends
    const highGrowthTrends = trends.filter(t => t.predictedGrowth > 0.1);

    if (highGrowthTrends.length >= 3) {
      patterns.push({
        trendId: `pattern_emerging_${Date.now()}`,
        trendName: 'Aufstrebende AI-Suchtrends',
        description: `${highGrowthTrends.length} Keywords zeigen starkes Wachstum in AI-Suchen`,
        impact: 'high',
        confidence: 0.8,
        timeframe: '1-3 Monate',
        affectedKeywords: highGrowthTrends.flatMap(t => t.affectedKeywords),
        recommendedActions: [
          'Content für aufstrebende Keywords priorisieren',
          'AI-Suchoptimierung verstärken',
          'Trend-Monitoring intensivieren'
        ],
        dataPoints: [],
        predictedGrowth: highGrowthTrends.reduce((sum, t) => sum + t.predictedGrowth, 0) / highGrowthTrends.length,
        lastUpdated: new Date()
      });
    }

    return patterns;
  }

  private async analyzeSeasonalVariations(keywords: string[]): Promise<PredictiveSEOTrend[]> {
    const variations: PredictiveSEOTrend[] = [];

    // Analyze seasonal patterns (simplified)
    const seasonalKeywords = keywords.filter(k =>
      k.includes('sommer') || k.includes('winter') || k.includes('urlaub')
    );

    seasonalKeywords.forEach(keyword => {
      variations.push({
        trendId: `seasonal_${keyword}_${Date.now()}`,
        trendName: `Saisonale Variation: ${keyword}`,
        description: `Saisonale Suchmuster für "${keyword}" identifiziert`,
        impact: 'medium',
        confidence: 0.7,
        timeframe: 'Jahreszyklus',
        affectedKeywords: [keyword],
        recommendedActions: [
          'Saisonale Content-Planung',
          'Zeitgesteuerte SEO-Kampagnen',
          'Saisonale Keyword-Optimierung'
        ],
        dataPoints: [],
        predictedGrowth: 0.15, // Estimated seasonal variation
        lastUpdated: new Date()
      });
    });

    return variations;
  }

  // ===== DASHBOARD & REPORTING =====

  public async generateMonitoringDashboard(): Promise<AIMonitoringDashboard> {
    const overview = await this.generateOverviewMetrics();
    const performance = await this.generatePerformanceMetrics();
    const trends = await this.generateTrendsData();
    const alerts = this.getActiveAlerts();
    const recommendations = await this.generateRecommendations();

    return {
      overview,
      performance,
      trends,
      alerts,
      recommendations
    };
  }

  private async generateOverviewMetrics(): Promise<AIMonitoringDashboard['overview']> {
    const performanceData = this.getAISearchPerformance();
    const zeroClickData = this.getZeroClickMetrics();
    const citations = this.getCitations();

    const totalAISearches = performanceData.reduce((sum, p) => sum + p.impressions, 0);
    const averageZeroClickRate = zeroClickData.length > 0 ?
      zeroClickData.reduce((sum, m) => sum + m.zeroClickRate, 0) / zeroClickData.length : 0;

    // Extract trending topics from recent performance data
    const trendingTopics = this.extractTrendingTopics(performanceData);

    // Calculate AI visibility score
    const aiVisibilityScore = this.calculateAIVisibilityScore(performanceData, citations);

    return {
      totalAISearches,
      averageZeroClickRate,
      activeCitations: citations.filter(c => c.status === 'active').length,
      trendingTopics,
      aiVisibilityScore
    };
  }

  private async generatePerformanceMetrics(): Promise<AIMonitoringDashboard['performance']> {
    const platformBreakdown: Record<string, AISearchPerformance[]> = {};

    for (const platform of Object.keys(this.monitoringConfig.platforms)) {
      if (this.monitoringConfig.platforms[platform as keyof typeof this.monitoringConfig.platforms]) {
        platformBreakdown[platform] = this.getAISearchPerformance(platform);
      }
    }

    return {
      platformBreakdown,
      zeroClickAnalysis: this.zeroClickMetrics.slice(-10), // Last 10 analyses
      citationHealth: this.getCitationHealthMetrics()
    };
  }

  private async generateTrendsData(): Promise<AIMonitoringDashboard['trends']> {
    const currentTrends = Array.from(this.predictiveTrends.values())
      .filter(t => t.lastUpdated > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    const emergingPatterns = await this.identifyEmergingPatterns(currentTrends);
    const seasonalVariations = await this.analyzeSeasonalVariations(
      currentTrends.flatMap(t => t.affectedKeywords)
    );

    return {
      currentTrends,
      emergingPatterns,
      seasonalVariations
    };
  }

  private extractTrendingTopics(performanceData: AISearchPerformance[]): string[] {
    // Group by query and calculate recent growth
    const queryMetrics = new Map<string, { recent: number; older: number }>();

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    performanceData.forEach(p => {
      const query = p.query;
      const isRecent = p.lastUpdated.getTime() > weekAgo;
      const isOlder = p.lastUpdated.getTime() <= weekAgo && p.lastUpdated.getTime() > monthAgo;

      const existing = queryMetrics.get(query) || { recent: 0, older: 0 };

      if (isRecent) {
        existing.recent += p.impressions;
      } else if (isOlder) {
        existing.older += p.impressions;
      }

      queryMetrics.set(query, existing);
    });

    // Calculate growth and sort
    const trending = Array.from(queryMetrics.entries())
      .map(([query, metrics]) => ({
        query,
        growth: metrics.older > 0 ? (metrics.recent - metrics.older) / metrics.older : 0
      }))
      .filter(item => item.growth > 0.1) // At least 10% growth
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 5)
      .map(item => item.query);

    return trending;
  }

  private calculateAIVisibilityScore(
    performanceData: AISearchPerformance[],
    citations: AICitation[]
  ): number {
    let score = 0;

    // Performance score (40%)
    const avgCTR = performanceData.reduce((sum, p) => sum + p.ctr, 0) / performanceData.length || 0;
    score += Math.min(40, avgCTR * 400); // Scale CTR to 0-40 points

    // AI features score (30%)
    const aiFeatures = performanceData.filter(p => p.aiSummary || p.featuredSnippet || p.knowledgePanel).length;
    const aiFeatureRate = performanceData.length > 0 ? aiFeatures / performanceData.length : 0;
    score += aiFeatureRate * 30;

    // Citation score (30%)
    const activeCitations = citations.filter(c => c.status === 'active');
    const avgAuthority = activeCitations.reduce((sum, c) => sum + c.authority, 0) / activeCitations.length || 0;
    score += Math.min(30, avgAuthority * 30);

    return Math.min(100, score);
  }

  // ===== ALERT SYSTEM =====

  private async checkPerformanceAlerts(platform: string, performance: AISearchPerformance): Promise<void> {
    if (!this.monitoringConfig.alerts.enabled) return;

    // Check for significant performance drops
    const previousPerformance = this.getAISearchPerformance(platform, performance.query, {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 24 * 60 * 60 * 1000)
    });

    if (previousPerformance.length > 0) {
      const avgPreviousCTR = previousPerformance.reduce((sum, p) => sum + p.ctr, 0) / previousPerformance.length;
      const drop = (avgPreviousCTR - performance.ctr) / avgPreviousCTR;

      if (drop > this.monitoringConfig.alerts.performanceThreshold) {
        this.createAlert({
          type: 'performance_drop',
          severity: drop > 0.2 ? 'high' : 'medium',
          title: `Performance-Einbruch für "${performance.query}"`,
          description: `CTR für "${performance.query}" ist um ${(drop * 100).toFixed(1)}% gefallen`,
          affectedEntities: [performance.query],
          recommendedAction: 'Content-Optimierung und Backlink-Analyse durchführen'
        });
      }
    }
  }

  private async checkZeroClickAlerts(metrics: ZeroClickMetrics[]): Promise<void> {
    if (!this.monitoringConfig.alerts.enabled) return;

    const highZeroClickQueries = metrics.filter(m => m.zeroClickRate > this.monitoringConfig.alerts.zeroClickThreshold);

    if (highZeroClickQueries.length > 0) {
      this.createAlert({
        type: 'zero_click_increase',
        severity: 'medium',
        title: `${highZeroClickQueries.length} Queries mit hoher Zero-Click-Rate`,
        description: `${highZeroClickQueries.length} Suchanfragen haben eine Zero-Click-Rate über ${(this.monitoringConfig.alerts.zeroClickThreshold * 100).toFixed(0)}%`,
        affectedEntities: highZeroClickQueries.map(m => m.query),
        recommendedAction: 'Featured Snippets und Knowledge Panels optimieren'
      });
    }
  }

  private async checkCitationAlerts(): Promise<void> {
    if (!this.monitoringConfig.alerts.enabled) return;

    const health = this.getCitationHealthMetrics();
    const lostCitations = health.totalCitations - health.activeCitations;

    if (lostCitations > this.monitoringConfig.alerts.citationThreshold) {
      this.createAlert({
        type: 'citation_loss',
        severity: lostCitations > 10 ? 'high' : 'medium',
        title: `${lostCitations} Citations verloren`,
        description: `${lostCitations} Citations wurden als veraltet oder entfernt markiert`,
        affectedEntities: [],
        recommendedAction: 'Citation-Building Kampagne starten und Content aktualisieren'
      });
    }
  }

  private createAlert(alertData: Omit<AIMonitoringAlert, 'id' | 'createdAt' | 'acknowledged'>): void {
    const alert: AIMonitoringAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...alertData,
      createdAt: new Date(),
      acknowledged: false
    };

    this.alerts.push(alert);
  }

  public getActiveAlerts(): AIMonitoringAlert[] {
    return this.alerts
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // ===== RECOMMENDATIONS =====

  private async generateRecommendations(): Promise<AIImprovementRecommendation[]> {
    const recommendations: AIImprovementRecommendation[] = [];

    // Analyze current state and generate recommendations
    const dashboard = await this.generateMonitoringDashboard();

    // Content recommendations based on zero-click analysis
    if (dashboard.overview.averageZeroClickRate > 0.7) {
      recommendations.push({
        id: 'rec_zero_click_content',
        category: 'content',
        priority: 'high',
        title: 'Zero-Click Content-Strategie entwickeln',
        description: 'Hohe Zero-Click-Raten erfordern umfassendere Content-Optimierung',
        expectedImpact: 0.25,
        implementationEffort: 'high',
        timeframe: '3-6 Monate',
        metrics: ['zero_click_rate', 'organic_traffic', 'engagement_rate']
      });
    }

    // Technical recommendations based on AI visibility
    if (dashboard.overview.aiVisibilityScore < 60) {
      recommendations.push({
        id: 'rec_ai_visibility_tech',
        category: 'technical',
        priority: 'high',
        title: 'AI-Sichtbarkeit technisch verbessern',
        description: 'Structured Data und Schema Markup für bessere AI-Erkennung',
        expectedImpact: 0.3,
        implementationEffort: 'medium',
        timeframe: '1-2 Monate',
        metrics: ['ai_visibility_score', 'featured_snippets', 'knowledge_panels']
      });
    }

    // Citation recommendations
    const citationHealth = dashboard.performance.citationHealth;
    if (citationHealth.activeCitations < 20) {
      recommendations.push({
        id: 'rec_citation_building',
        category: 'citation',
        priority: 'medium',
        title: 'Citation-Building Kampagne starten',
        description: 'Mehr hochwertige Citations für verbesserte Autorität aufbauen',
        expectedImpact: 0.2,
        implementationEffort: 'medium',
        timeframe: '2-4 Monate',
        metrics: ['citation_count', 'domain_authority', 'ai_visibility_score']
      });
    }

    // Trend-based recommendations
    const highImpactTrends = dashboard.trends.currentTrends.filter(t => t.impact === 'high');
    if (highImpactTrends.length > 0) {
      recommendations.push({
        id: 'rec_trend_optimization',
        category: 'trend',
        priority: 'high',
        title: 'Trend-basierte Content-Optimierung',
        description: `${highImpactTrends.length} wichtige Trends erfordern Content-Anpassungen`,
        expectedImpact: 0.35,
        implementationEffort: 'high',
        timeframe: '1-3 Monate',
        metrics: ['trend_alignment_score', 'organic_growth', 'conversion_rate']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // ===== UTILITY METHODS =====

  private initializeMockData(): void {
    // Initialize with some mock data for demonstration
    this.trackAISearchPerformance('google', 'photovoltaik berlin', {
      position: 3,
      impressions: 1200,
      clicks: 180,
      ctr: 0.15,
      featuredSnippet: true,
      aiSummary: true
    });

    this.trackAISearchPerformance('bing', 'solaranlage kosten', {
      position: 2,
      impressions: 800,
      clicks: 120,
      ctr: 0.15,
      knowledgePanel: true
    });

    // Add some mock citations
    this.addCitation({
      platform: 'perplexity',
      sourceUrl: 'https://example.com/article1',
      citedUrl: 'https://www.zoe-solar.de/photovoltaik',
      citationText: 'ZOE Solar ist ein führender Photovoltaik-Spezialist',
      context: 'Im Bereich erneuerbare Energien...',
      authority: 0.8,
      relevance: 0.9,
      sentiment: 0.8,
      status: 'active'
    });
  }

  public clearData(): void {
    this.searchPerformanceData.clear();
    this.zeroClickMetrics = [];
    this.citations.clear();
    this.mentions.clear();
    this.predictiveTrends.clear();
    this.alerts = [];
  }

  public exportData(): {
    performance: Record<string, AISearchPerformance[]>;
    citations: AICitation[];
    trends: PredictiveSEOTrend[];
    alerts: AIMonitoringAlert[];
  } {
    return {
      performance: Object.fromEntries(this.searchPerformanceData),
      citations: Array.from(this.citations.values()),
      trends: Array.from(this.predictiveTrends.values()),
      alerts: this.alerts
    };
  }

  public getMonitoringStats(): {
    performanceRecords: number;
    zeroClickAnalyses: number;
    citations: number;
    mentions: number;
    trends: number;
    alerts: number;
  } {
    return {
      performanceRecords: Array.from(this.searchPerformanceData.values()).reduce((sum, arr) => sum + arr.length, 0),
      zeroClickAnalyses: this.zeroClickMetrics.length,
      citations: this.citations.size,
      mentions: this.mentions.size,
      trends: this.predictiveTrends.size,
      alerts: this.alerts.length
    };
  }
}

// ===== TYPE DEFINITIONS =====

interface AIMonitoringConfig {
  enabled: boolean;
  platforms: {
    google: boolean;
    bing: boolean;
    openai: boolean;
    perplexity: boolean;
  };
  monitoring: {
    performanceTracking: boolean;
    zeroClickAnalysis: boolean;
    citationMonitoring: boolean;
    mentionTracking: boolean;
    trendAnalysis: boolean;
  };
  alerts: {
    enabled: boolean;
    performanceThreshold: number;
    citationThreshold: number;
    zeroClickThreshold: number;
  };
  dataRetention: {
    performanceData: number;
    citationData: number;
    trendData: number;
  };
  updateFrequency: {
    performance: number;
    citations: number;
    trends: number;
  };
}

// ===== EXPORT =====

export const aiMonitoringAnalyticsService = AIMonitoringAnalyticsService.getInstance();
export default aiMonitoringAnalyticsService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Performance Tracking
 * await aiMonitoringAnalyticsService.trackAISearchPerformance('google', 'photovoltaik berlin', {
 *   position: 3,
 *   impressions: 1200,
 *   clicks: 180,
 *   ctr: 0.15,
 *   featuredSnippet: true,
 *   aiSummary: true
 * });
 *
 * // Zero-Click Analyse
 * const zeroClickData = await aiMonitoringAnalyticsService.analyzeZeroClickSearches(
 *   ['photovoltaik kosten', 'solaranlage berlin'],
 *   { start: new Date('2024-01-01'), end: new Date() }
 * );
 *
 * // Citation hinzufügen
 * const citationId = await aiMonitoringAnalyticsService.addCitation({
 *   platform: 'perplexity',
 *   sourceUrl: 'https://example.com',
 *   citedUrl: 'https://www.zoe-solar.de',
 *   citationText: 'ZOE Solar ist ein Experte...',
 *   context: 'Im Solarbereich...',
 *   authority: 0.8,
 *   relevance: 0.9,
 *   sentiment: 0.7,
 *   status: 'active'
 * });
 *
 * // Dashboard generieren
 * const dashboard = await aiMonitoringAnalyticsService.generateMonitoringDashboard();
 *
 * // Alerts abrufen
 * const alerts = aiMonitoringAnalyticsService.getActiveAlerts();
 */