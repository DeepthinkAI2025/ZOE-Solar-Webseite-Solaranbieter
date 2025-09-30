import { singleton } from 'tsyringe';
import { EntityKnowledgeGraphService } from './entityKnowledgeGraphService';
import { EnterpriseBrandAuthorityService } from './enterpriseBrandAuthorityService';
import { CrossPlatformEntityConsistencyService } from './crossPlatformEntityConsistencyService';
import { AEOIntegrationService } from './aeoIntegrationService';

export interface EntityPerformancePrediction {
  entityId: string;
  entityName: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  timeframe: '1week' | '1month' | '3months' | '6months';
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface CompetitorEntityAnalysis {
  competitorId: string;
  competitorName: string;
  entityStrength: number;
  marketShare: number;
  entityCoverage: {
    platforms: string[];
    completeness: number;
  };
  competitiveAdvantages: string[];
  vulnerabilities: string[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
}

export interface EntityOpportunity {
  id: string;
  type: 'platform_expansion' | 'entity_enhancement' | 'relationship_building' | 'content_gap';
  title: string;
  description: string;
  potentialImpact: number;
  difficulty: 'low' | 'medium' | 'high';
  estimatedEffort: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  platforms: string[];
  prerequisites: string[];
  expectedOutcomes: string[];
  timeline: string;
}

export interface AdvancedEntityReport {
  reportId: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalEntities: number;
    averagePerformance: number;
    topPerformingEntities: string[];
    underperformingEntities: string[];
    overallTrend: 'improving' | 'stable' | 'declining';
  };
  performanceAnalysis: {
    predictions: EntityPerformancePrediction[];
    trends: {
      metric: string;
      current: number;
      previous: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    }[];
  };
  competitorAnalysis: {
    competitors: CompetitorEntityAnalysis[];
    marketPosition: string;
    competitiveGaps: string[];
  };
  opportunities: {
    identified: EntityOpportunity[];
    prioritized: EntityOpportunity[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  alerts: {
    critical: string[];
    warnings: string[];
    info: string[];
  };
}

@singleton()
export class EnterpriseAEOIntelligenceService {
  private performanceHistory: Map<string, number[]> = new Map();
  private competitorData: Map<string, CompetitorEntityAnalysis> = new Map();
  private opportunityCache: EntityOpportunity[] = [];
  private reportCache: Map<string, AdvancedEntityReport> = new Map();

  constructor(
    private entityKnowledgeGraphService: EntityKnowledgeGraphService,
    private enterpriseBrandAuthorityService: EnterpriseBrandAuthorityService,
    private crossPlatformEntityConsistencyService: CrossPlatformEntityConsistencyService,
    private aeoIntegrationService: AEOIntegrationService
  ) {
    this.initializeIntelligenceEngine();
  }

  /**
   * Initialisiert die Intelligence Engine
   */
  private async initializeIntelligenceEngine(): Promise<void> {
    // Lade historische Performance-Daten
    await this.loadHistoricalPerformanceData();

    // Analysiere Competitor Landscape
    await this.analyzeCompetitorLandscape();

    // Identifiziere Opportunities
    await this.identifyEntityOpportunities();

    // Starte kontinuierliches Monitoring
    this.startIntelligenceMonitoring();
  }

  /**
   * Führt Predictive Entity Performance Analysis durch
   */
  async predictEntityPerformance(
    entityId: string,
    timeframe: '1week' | '1month' | '3months' | '6months' = '1month'
  ): Promise<EntityPerformancePrediction> {
    const entity = await this.getEntityData(entityId);
    const historicalData = this.performanceHistory.get(entityId) || [];
    const currentScore = this.calculateCurrentEntityScore(entity);

    // Machine Learning-basierte Vorhersage (vereinfacht)
    const prediction = this.performPredictiveAnalysis(entity, historicalData, timeframe);
    const factors = await this.analyzePerformanceFactors(entity, prediction);
    const recommendations = this.generatePerformanceRecommendations(prediction, factors);

    return {
      entityId,
      entityName: entity.name,
      currentScore,
      predictedScore: prediction.score,
      confidence: prediction.confidence,
      timeframe,
      factors,
      recommendations,
      riskLevel: this.assessRiskLevel(prediction, factors)
    };
  }

  /**
   * Analysiert Competitor Entities
   */
  async analyzeCompetitorEntities(competitorIds?: string[]): Promise<CompetitorEntityAnalysis[]> {
    const competitors = competitorIds || Array.from(this.competitorData.keys());
    const analyses: CompetitorEntityAnalysis[] = [];

    for (const competitorId of competitors) {
      const analysis = await this.performCompetitorAnalysis(competitorId);
      analyses.push(analysis);
      this.competitorData.set(competitorId, analysis);
    }

    return analyses;
  }

  /**
   * Identifiziert Entity Opportunities
   */
  async identifyEntityOpportunities(): Promise<EntityOpportunity[]> {
    const opportunities: EntityOpportunity[] = [];

    // Platform Expansion Opportunities
    const platformOpportunities = await this.identifyPlatformExpansionOpportunities();
    opportunities.push(...platformOpportunities);

    // Entity Enhancement Opportunities
    const enhancementOpportunities = await this.identifyEntityEnhancementOpportunities();
    opportunities.push(...enhancementOpportunities);

    // Relationship Building Opportunities
    const relationshipOpportunities = await this.identifyRelationshipBuildingOpportunities();
    opportunities.push(...relationshipOpportunities);

    // Content Gap Opportunities
    const contentOpportunities = await this.identifyContentGapOpportunities();
    opportunities.push(...contentOpportunities);

    // Priorisiere Opportunities
    this.opportunityCache = this.prioritizeOpportunities(opportunities);

    return this.opportunityCache;
  }

  /**
   * Generiert Advanced Entity Report
   */
  async generateAdvancedEntityReport(
    period: { start: Date; end: Date },
    options: {
      includePredictions?: boolean;
      includeCompetitorAnalysis?: boolean;
      includeOpportunities?: boolean;
      detailLevel?: 'summary' | 'detailed' | 'comprehensive';
    } = {}
  ): Promise<AdvancedEntityReport> {
    const reportId = `report-${Date.now()}`;
    const entities = this.getAllEntities();

    // Sammle alle Daten für den Report
    const performanceAnalysis = options.includePredictions !== false ?
      await this.generatePerformanceAnalysis(entities, period) : { predictions: [], trends: [] };

    const competitorAnalysis = options.includeCompetitorAnalysis !== false ?
      await this.generateCompetitorAnalysis() : { competitors: [], marketPosition: '', competitiveGaps: [] };

    const opportunities = options.includeOpportunities !== false ?
      await this.generateOpportunitiesAnalysis() : { identified: [], prioritized: [] };

    const report: AdvancedEntityReport = {
      reportId,
      generatedAt: new Date(),
      period,
      summary: this.generateReportSummary(entities, performanceAnalysis),
      performanceAnalysis,
      competitorAnalysis,
      opportunities,
      recommendations: this.generateReportRecommendations(performanceAnalysis, competitorAnalysis, opportunities),
      alerts: this.generateReportAlerts(performanceAnalysis, competitorAnalysis)
    };

    this.reportCache.set(reportId, report);
    return report;
  }

  /**
   * Hilfsmethoden für Predictive Analysis
   */
  private async getEntityData(entityId: string): Promise<any> {
    // Hole Entity-Daten aus verschiedenen Quellen
    const graph = this.entityKnowledgeGraphService.getKnowledgeGraph();
    const entity = graph.entities[entityId];

    if (!entity) {
      throw new Error(`Entity ${entityId} not found`);
    }

    return entity;
  }

  private calculateCurrentEntityScore(entity: any): number {
    // Berechne aktuellen Entity-Score basierend auf verschiedenen Faktoren
    let score = 0;

    // Authority Score (30%)
    score += (entity.authority || 0) * 0.3;

    // Completeness Score (25%)
    const completeness = this.calculateEntityCompleteness(entity);
    score += completeness * 0.25;

    // Consistency Score (20%)
    const consistency = this.calculateEntityConsistency(entity);
    score += consistency * 0.2;

    // Performance Score (15%)
    score += (entity.performance || 0) * 0.15;

    // Trend Score (10%)
    const trend = this.calculateEntityTrend(entity.id);
    score += trend * 0.1;

    return Math.min(score, 100);
  }

  private calculateEntityCompleteness(entity: any): number {
    const requiredFields = ['name', 'type', 'description', 'website'];
    const optionalFields = ['address', 'phone', 'socialProfiles', 'certifications'];

    let completeness = 0;
    requiredFields.forEach(field => {
      if (entity[field]) completeness += 20;
    });

    optionalFields.forEach(field => {
      if (entity[field]) completeness += 10;
    });

    return Math.min(completeness, 100);
  }

  private calculateEntityConsistency(entity: any): number {
    // Prüfe Konsistenz über Plattformen
    const consistencyReport = this.crossPlatformEntityConsistencyService.getConsistencyReport();
    const entityIssues = consistencyReport.issues.filter(issue =>
      issue.entityId === entity.id
    );

    const baseConsistency = 100 - (entityIssues.length * 10);
    return Math.max(baseConsistency, 0);
  }

  private calculateEntityTrend(entityId: string): number {
    const history = this.performanceHistory.get(entityId) || [];
    if (history.length < 2) return 50;

    const recent = history.slice(-5);
    const trend = recent[recent.length - 1] - recent[0];

    // Normalisiere Trend zu 0-100 Score
    return Math.min(Math.max(trend + 50, 0), 100);
  }

  private performPredictiveAnalysis(
    entity: any,
    historicalData: number[],
    timeframe: string
  ): { score: number; confidence: number } {
    // Vereinfachte Predictive Analysis
    const currentScore = this.calculateCurrentEntityScore(entity);
    const trend = this.calculateEntityTrend(entity.id);

    // Zeitrahmen-basierte Anpassung
    const timeframeMultiplier = {
      '1week': 0.1,
      '1month': 0.3,
      '3months': 0.7,
      '6months': 1.0
    }[timeframe] || 0.3;

    // Berechne vorhergesagten Score
    const trendImpact = (trend - 50) * timeframeMultiplier;
    const predictedScore = Math.min(Math.max(currentScore + trendImpact, 0), 100);

    // Berechne Confidence basierend auf Datenverfügbarkeit
    const confidence = Math.min(historicalData.length * 10 + 50, 95);

    return { score: predictedScore, confidence };
  }

  private async analyzePerformanceFactors(
    entity: any,
    prediction: { score: number; confidence: number }
  ): Promise<{ positive: string[]; negative: string[]; neutral: string[] }> {
    const factors = {
      positive: [] as string[],
      negative: [] as string[],
      neutral: [] as string[]
    };

    // Authority Faktoren
    if (entity.authority > 70) {
      factors.positive.push('High entity authority');
    } else if (entity.authority < 40) {
      factors.negative.push('Low entity authority');
    }

    // Completeness Faktoren
    const completeness = this.calculateEntityCompleteness(entity);
    if (completeness > 80) {
      factors.positive.push('High entity completeness');
    } else if (completeness < 50) {
      factors.negative.push('Incomplete entity data');
    }

    // Konsistenz Faktoren
    const consistency = this.calculateEntityConsistency(entity);
    if (consistency > 80) {
      factors.positive.push('Good cross-platform consistency');
    } else if (consistency < 50) {
      factors.negative.push('Poor cross-platform consistency');
    }

    // Trend Faktoren
    const trend = this.calculateEntityTrend(entity.id);
    if (trend > 60) {
      factors.positive.push('Positive performance trend');
    } else if (trend < 40) {
      factors.negative.push('Negative performance trend');
    }

    return factors;
  }

  private generatePerformanceRecommendations(
    prediction: { score: number; confidence: number },
    factors: { positive: string[]; negative: string[]; neutral: string[] }
  ): string[] {
    const recommendations: string[] = [];

    if (prediction.score < 50) {
      recommendations.push('Focus on improving entity completeness and consistency');
      recommendations.push('Enhance entity authority through content and backlinks');
    }

    if (factors.negative.includes('Poor cross-platform consistency')) {
      recommendations.push('Synchronize entity data across all platforms');
      recommendations.push('Implement automated entity consistency monitoring');
    }

    if (factors.negative.includes('Low entity authority')) {
      recommendations.push('Build authoritative content around the entity');
      recommendations.push('Acquire high-quality backlinks to entity pages');
    }

    if (prediction.confidence < 70) {
      recommendations.push('Gather more performance data for better predictions');
    }

    return recommendations;
  }

  private assessRiskLevel(
    prediction: { score: number; confidence: number },
    factors: { positive: string[]; negative: string[]; neutral: string[] }
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (prediction.score < 30 || factors.negative.length > 3) {
      return 'critical';
    } else if (prediction.score < 50 || factors.negative.length > 1) {
      return 'high';
    } else if (prediction.score < 70 || factors.negative.length > 0) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Competitor Analysis Methoden
   */
  private async performCompetitorAnalysis(competitorId: string): Promise<CompetitorEntityAnalysis> {
    // Mock Competitor Daten (in echter Implementierung aus Datenbank/API)
    const competitorData = {
      'competitor1': {
        name: 'SolarTech GmbH',
        entityStrength: 75,
        marketShare: 15,
        entityCoverage: {
          platforms: ['google', 'bing', 'facebook', 'linkedin'],
          completeness: 85
        },
        competitiveAdvantages: ['Strong social media presence', 'Extensive content library'],
        vulnerabilities: ['Limited local presence', 'Lower brand authority'],
        threatLevel: 'high' as const
      },
      'competitor2': {
        name: 'GreenEnergy Solutions',
        entityStrength: 68,
        marketShare: 12,
        entityCoverage: {
          platforms: ['google', 'bing', 'twitter'],
          completeness: 72
        },
        competitiveAdvantages: ['Strong local SEO', 'Good customer reviews'],
        vulnerabilities: ['Weak international presence', 'Limited social proof'],
        threatLevel: 'medium' as const
      }
    };

    const data = competitorData[competitorId] || {
      name: `Competitor ${competitorId}`,
      entityStrength: 50,
      marketShare: 5,
      entityCoverage: {
        platforms: ['google'],
        completeness: 50
      },
      competitiveAdvantages: [],
      vulnerabilities: ['Limited data available'],
      threatLevel: 'low' as const
    };

    return {
      competitorId,
      competitorName: data.name,
      entityStrength: data.entityStrength,
      marketShare: data.marketShare,
      entityCoverage: data.entityCoverage,
      competitiveAdvantages: data.competitiveAdvantages,
      vulnerabilities: data.vulnerabilities,
      threatLevel: data.threatLevel,
      recommendedActions: this.generateCompetitorActions(data)
    };
  }

  private generateCompetitorActions(competitorData: any): string[] {
    const actions: string[] = [];

    if (competitorData.entityStrength > 70) {
      actions.push('Monitor competitor closely and focus on differentiation');
    }

    if (competitorData.vulnerabilities.includes('Limited local presence')) {
      actions.push('Strengthen local entity presence to gain competitive advantage');
    }

    if (competitorData.competitiveAdvantages.includes('Strong social media presence')) {
      actions.push('Enhance social media strategy and engagement');
    }

    return actions;
  }

  /**
   * Opportunity Identification Methoden
   */
  private async identifyPlatformExpansionOpportunities(): Promise<EntityOpportunity[]> {
    const opportunities: EntityOpportunity[] = [];
    const entities = this.crossPlatformEntityConsistencyService.getAllEntities();
    const activePlatforms = ['google', 'bing', 'facebook', 'linkedin', 'twitter'];

    entities.forEach(entity => {
      const missingPlatforms = activePlatforms.filter(platform =>
        !entity.platform || entity.platform !== platform
      );

      if (missingPlatforms.length > 0) {
        opportunities.push({
          id: `platform-expansion-${entity.entityId}`,
          type: 'platform_expansion',
          title: `Expand ${entity.entityName} to ${missingPlatforms.join(', ')}`,
          description: `Entity is missing from ${missingPlatforms.length} key platforms`,
          potentialImpact: missingPlatforms.length * 15,
          difficulty: missingPlatforms.length > 2 ? 'high' : 'medium',
          estimatedEffort: `${missingPlatforms.length * 2} hours`,
          priority: missingPlatforms.length > 1 ? 'high' : 'medium',
          platforms: missingPlatforms,
          prerequisites: ['Platform accounts created', 'Entity data verified'],
          expectedOutcomes: ['Increased entity visibility', 'Better search coverage'],
          timeline: '2-4 weeks'
        });
      }
    });

    return opportunities;
  }

  private async identifyEntityEnhancementOpportunities(): Promise<EntityOpportunity[]> {
    const opportunities: EntityOpportunity[] = [];
    const entities = this.crossPlatformEntityConsistencyService.getAllEntities();

    entities.forEach(entity => {
      const completeness = this.calculateEntityCompleteness(entity);

      if (completeness < 70) {
        opportunities.push({
          id: `enhancement-${entity.entityId}`,
          type: 'entity_enhancement',
          title: `Enhance ${entity.entityName} completeness`,
          description: `Entity completeness is only ${completeness}%. Missing key attributes.`,
          potentialImpact: (100 - completeness) * 0.8,
          difficulty: completeness < 50 ? 'high' : 'medium',
          estimatedEffort: '4-8 hours',
          priority: completeness < 40 ? 'critical' : 'high',
          platforms: [entity.platform],
          prerequisites: ['Research entity data', 'Verify information accuracy'],
          expectedOutcomes: ['Improved entity authority', 'Better search visibility'],
          timeline: '1-2 weeks'
        });
      }
    });

    return opportunities;
  }

  private async identifyRelationshipBuildingOpportunities(): Promise<EntityOpportunity[]> {
    const opportunities: EntityOpportunity[] = [];
    const graph = this.entityKnowledgeGraphService.getKnowledgeGraph();

    // Finde Entities mit wenigen Relationships
    Object.values(graph.entities).forEach((entity: any) => {
      const relationshipCount = Object.keys(entity.relationships || {}).length;

      if (relationshipCount < 3) {
        opportunities.push({
          id: `relationships-${entity.id}`,
          type: 'relationship_building',
          title: `Build relationships for ${entity.name}`,
          description: `Entity has only ${relationshipCount} relationships. More connections needed.`,
          potentialImpact: (5 - relationshipCount) * 10,
          difficulty: 'medium',
          estimatedEffort: '6-12 hours',
          priority: relationshipCount < 2 ? 'high' : 'medium',
          platforms: ['google', 'bing'],
          prerequisites: ['Identify related entities', 'Establish connection criteria'],
          expectedOutcomes: ['Stronger entity graph', 'Better knowledge panel eligibility'],
          timeline: '3-6 weeks'
        });
      }
    });

    return opportunities;
  }

  private async identifyContentGapOpportunities(): Promise<EntityOpportunity[]> {
    const opportunities: EntityOpportunity[] = [];

    // Analysiere Content Gaps basierend auf Entity Performance
    const entities = this.crossPlatformEntityConsistencyService.getAllEntities();
    const underperformingEntities = entities.filter(entity =>
      this.calculateCurrentEntityScore(entity) < 60
    );

    underperformingEntities.forEach(entity => {
      opportunities.push({
        id: `content-gap-${entity.entityId}`,
        type: 'content_gap',
        title: `Create content for ${entity.entityName}`,
        description: 'Entity lacks supporting content to establish authority',
        potentialImpact: 25,
        difficulty: 'medium',
        estimatedEffort: '16-32 hours',
        priority: 'high',
        platforms: ['google', 'bing'],
        prerequisites: ['Content strategy defined', 'Keyword research completed'],
        expectedOutcomes: ['Improved entity authority', 'Better search rankings'],
        timeline: '4-8 weeks'
      });
    });

    return opportunities;
  }

  private prioritizeOpportunities(opportunities: EntityOpportunity[]): EntityOpportunity[] {
    return opportunities.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return b.potentialImpact - a.potentialImpact;
    });
  }

  /**
   * Report Generation Methoden
   */
  private async generatePerformanceAnalysis(
    entities: any[],
    period: { start: Date; end: Date }
  ): Promise<{ predictions: EntityPerformancePrediction[]; trends: any[] }> {
    const predictions: EntityPerformancePrediction[] = [];

    for (const entity of entities.slice(0, 10)) { // Top 10 Entities
      try {
        const prediction = await this.predictEntityPerformance(entity.id, '1month');
        predictions.push(prediction);
      } catch (error) {
        console.error(`Failed to predict performance for entity ${entity.id}:`, error);
      }
    }

    const trends = this.generatePerformanceTrends(entities, period);

    return { predictions, trends };
  }

  private generatePerformanceTrends(entities: any[], period: { start: Date; end: Date }): any[] {
    const trends = [];

    // Authority Trend
    const avgAuthority = entities.reduce((sum, entity) => sum + (entity.authority || 0), 0) / entities.length;
    trends.push({
      metric: 'Average Entity Authority',
      current: avgAuthority,
      previous: avgAuthority * 0.95, // Mock previous value
      change: avgAuthority * 0.05,
      trend: 'up'
    });

    // Completeness Trend
    const avgCompleteness = entities.reduce((sum, entity) =>
      sum + this.calculateEntityCompleteness(entity), 0) / entities.length;
    trends.push({
      metric: 'Average Entity Completeness',
      current: avgCompleteness,
      previous: avgCompleteness * 0.98,
      change: avgCompleteness * 0.02,
      trend: 'up'
    });

    return trends;
  }

  private async generateCompetitorAnalysis(): Promise<{
    competitors: CompetitorEntityAnalysis[];
    marketPosition: string;
    competitiveGaps: string[];
  }> {
    const competitors = await this.analyzeCompetitorEntities();
    const marketPosition = this.determineMarketPosition(competitors);
    const competitiveGaps = this.identifyCompetitiveGaps(competitors);

    return { competitors, marketPosition, competitiveGaps };
  }

  private determineMarketPosition(competitors: CompetitorEntityAnalysis[]): string {
    const ourStrength = 75; // Mock ZOE Solar strength
    const avgCompetitorStrength = competitors.reduce((sum, comp) => sum + comp.entityStrength, 0) / competitors.length;

    if (ourStrength > avgCompetitorStrength + 10) {
      return 'Market Leader';
    } else if (ourStrength > avgCompetitorStrength) {
      return 'Strong Competitor';
    } else {
      return 'Challenger';
    }
  }

  private identifyCompetitiveGaps(competitors: CompetitorEntityAnalysis[]): string[] {
    const gaps: string[] = [];

    const strongCompetitors = competitors.filter(c => c.threatLevel === 'high');
    if (strongCompetitors.length > 0) {
      gaps.push('Several competitors have stronger entity presence');
    }

    const platformsUsed = new Set(competitors.flatMap(c => c.entityCoverage.platforms));
    if (platformsUsed.has('linkedin') && !platformsUsed.has('linkedin')) {
      gaps.push('Missing presence on LinkedIn');
    }

    return gaps;
  }

  private async generateOpportunitiesAnalysis(): Promise<{
    identified: EntityOpportunity[];
    prioritized: EntityOpportunity[];
  }> {
    const opportunities = await this.identifyEntityOpportunities();
    const prioritized = opportunities.filter(opp =>
      opp.priority === 'critical' || opp.priority === 'high'
    ).slice(0, 5);

    return { identified: opportunities, prioritized };
  }

  private generateReportSummary(
    entities: any[],
    performanceAnalysis: any
  ): AdvancedEntityReport['summary'] {
    const scores = entities.map(entity => this.calculateCurrentEntityScore(entity));
    const avgPerformance = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const sortedEntities = entities.sort((a, b) =>
      this.calculateCurrentEntityScore(b) - this.calculateCurrentEntityScore(a)
    );

    return {
      totalEntities: entities.length,
      averagePerformance: avgPerformance,
      topPerformingEntities: sortedEntities.slice(0, 3).map(e => e.name),
      underperformingEntities: sortedEntities.slice(-3).map(e => e.name),
      overallTrend: this.determineOverallTrend(performanceAnalysis.trends)
    };
  }

  private determineOverallTrend(trends: any[]): 'improving' | 'stable' | 'declining' {
    const positiveTrends = trends.filter(t => t.trend === 'up').length;
    const negativeTrends = trends.filter(t => t.trend === 'down').length;

    if (positiveTrends > negativeTrends) return 'improving';
    if (negativeTrends > positiveTrends) return 'declining';
    return 'stable';
  }

  private generateReportRecommendations(
    performanceAnalysis: any,
    competitorAnalysis: any,
    opportunities: any
  ): AdvancedEntityReport['recommendations'] {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    // Immediate recommendations
    const criticalOpportunities = opportunities.prioritized.filter((opp: EntityOpportunity) =>
      opp.priority === 'critical'
    );
    if (criticalOpportunities.length > 0) {
      recommendations.immediate.push('Address critical entity opportunities immediately');
    }

    // Short-term recommendations
    if (performanceAnalysis.predictions.some((p: EntityPerformancePrediction) => p.riskLevel === 'high')) {
      recommendations.shortTerm.push('Focus on high-risk entity performance issues');
    }

    // Long-term recommendations
    if (competitorAnalysis.competitiveGaps.length > 0) {
      recommendations.longTerm.push('Address competitive gaps in entity strategy');
    }

    return recommendations;
  }

  private generateReportAlerts(
    performanceAnalysis: any,
    competitorAnalysis: any
  ): AdvancedEntityReport['alerts'] {
    const alerts = {
      critical: [] as string[],
      warnings: [] as string[],
      info: [] as string[]
    };

    // Critical alerts
    const criticalPredictions = performanceAnalysis.predictions.filter((p: EntityPerformancePrediction) =>
      p.riskLevel === 'critical'
    );
    if (criticalPredictions.length > 0) {
      alerts.critical.push(`${criticalPredictions.length} entities at critical risk`);
    }

    // Warnings
    const highThreatCompetitors = competitorAnalysis.competitors.filter((c: CompetitorEntityAnalysis) =>
      c.threatLevel === 'high'
    );
    if (highThreatCompetitors.length > 0) {
      alerts.warnings.push(`${highThreatCompetitors.length} high-threat competitors identified`);
    }

    // Info alerts
    if (performanceAnalysis.trends.some((t: any) => t.trend === 'up')) {
      alerts.info.push('Positive performance trends detected');
    }

    return alerts;
  }

  /**
   * Hilfsmethoden
   */
  private async loadHistoricalPerformanceData(): Promise<void> {
    // Mock historische Daten laden
    const entities = this.getAllEntities();
    entities.forEach(entity => {
      // Generiere 30 Tage historische Daten
      const history = [];
      let currentScore = this.calculateCurrentEntityScore(entity);

      for (let i = 29; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 10;
        history.push(Math.max(0, Math.min(100, currentScore + variation)));
      }

      this.performanceHistory.set(entity.id, history);
    });
  }

  private async analyzeCompetitorLandscape(): Promise<void> {
    // Mock Competitor Analyse
    await this.analyzeCompetitorEntities(['competitor1', 'competitor2']);
  }

  private getAllEntities(): any[] {
    const graph = this.entityKnowledgeGraphService.getKnowledgeGraph();
    return Object.values(graph.entities);
  }

  private startIntelligenceMonitoring(): void {
    // Aktualisiere Intelligence Daten alle 6 Stunden
    setInterval(async () => {
      await this.refreshIntelligenceData();
    }, 6 * 60 * 60 * 1000);
  }

  private async refreshIntelligenceData(): Promise<void> {
    await this.loadHistoricalPerformanceData();
    await this.analyzeCompetitorLandscape();
    await this.identifyEntityOpportunities();
  }

  /**
   * Öffentliche API Methoden
   */
  async getEntityPerformancePrediction(entityId: string): Promise<EntityPerformancePrediction> {
    return this.predictEntityPerformance(entityId);
  }

  async getCompetitorAnalysis(): Promise<CompetitorEntityAnalysis[]> {
    return this.analyzeCompetitorEntities();
  }

  async getEntityOpportunities(): Promise<EntityOpportunity[]> {
    return this.opportunityCache;
  }

  async getLatestReport(): Promise<AdvancedEntityReport | null> {
    const reports = Array.from(this.reportCache.values());
    if (reports.length === 0) return null;

    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0];
  }

  async generateReport(options?: any): Promise<AdvancedEntityReport> {
    const period = {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Letzte 30 Tage
      end: new Date()
    };

    return this.generateAdvancedEntityReport(period, options);
  }
}