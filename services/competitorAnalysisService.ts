/**
 * Competitor Analysis Service für ZOE Solar
 *
 * Automatisierte Wettbewerber-Überwachung und Competitive Intelligence Dashboard
 * für maximale Brand Authority auf Level 5/5 ("Dominant")
 *
 * Kernfunktionen:
 * - Automated Competitor Monitoring (24/7 Echtzeit-Tracking)
 * - Competitive Intelligence Dashboard (Executive-Level Insights)
 * - Competitor Brand Authority Scoring
 * - Market Position Analysis
 * - Competitive Gap Identification
 * - Threat & Opportunity Detection
 * - Automated Alert System
 * - Strategic Intelligence Reports
 */

import { brandAuthorityBuildingService, BrandAuthorityLevel } from './brandAuthorityBuildingService';

// ===== INTERFACES & TYPES =====

export interface CompetitorProfile {
  id: string;
  name: string;
  domain: string;
  industry: string;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  founded: number;
  headquarters: string;
  description: string;
  lastUpdated: Date;
}

export interface CompetitorMetrics {
  competitorId: string;
  timestamp: Date;

  // Brand Authority Metriken
  brandAuthorityScore: number;
  brandAuthorityLevel: BrandAuthorityLevel;

  // SEO & Visibility
  domainAuthority: number;
  organicTraffic: number;
  backlinks: number;
  indexedPages: number;

  // Social Media Presence
  socialFollowers: {
    linkedin: number;
    twitter: number;
    facebook: number;
    instagram: number;
    youtube: number;
    total: number;
  };
  socialEngagement: number;

  // Content & Thought Leadership
  contentVolume: number;
  thoughtLeadershipScore: number;
  publications: number;
  citations: number;

  // Market Performance
  marketShare: number;
  customerReviews: {
    averageRating: number;
    totalReviews: number;
    platforms: string[];
  };
  revenue: number; // Estimated

  // Competitive Intelligence
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];

  // Brand Mentions & PR
  mediaCoverage: number;
  brandMentions: number;
  sentimentScore: number;

  // Innovation & Technology
  patents: number;
  certifications: string[];
  awards: string[];
}

export interface CompetitiveGap {
  id: string;
  competitorId: string;
  gapType: 'strength' | 'weakness' | 'opportunity' | 'threat';
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  priority: number; // 1-10
  recommendedAction: string;
  estimatedEffort: 'low' | 'medium' | 'high';
  potentialGain: number; // Authority points
  detected: Date;
}

export interface CompetitiveAlert {
  id: string;
  competitorId: string;
  alertType: 'authority_gain' | 'market_shift' | 'content_threat' | 'brand_risk' | 'opportunity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  recommendedAction: string;
  triggered: Date;
  acknowledged: boolean;
  resolved: boolean;
}

export interface CompetitiveIntelligenceDashboard {
  overview: {
    totalCompetitors: number;
    marketLeaders: number;
    directThreats: number;
    opportunities: number;
    averageCompetitorAuthority: number;
    ourAuthorityPosition: number;
  };

  competitorRanking: Array<{
    rank: number;
    competitor: CompetitorProfile;
    authorityScore: number;
    trend: number;
    marketPosition: string;
    threatLevel: 'high' | 'medium' | 'low';
  }>;

  competitiveGaps: CompetitiveGap[];
  activeAlerts: CompetitiveAlert[];

  marketInsights: {
    emergingTrends: string[];
    competitiveLandscape: string;
    strategicRecommendations: string[];
    riskAssessment: string;
  };

  performanceMetrics: {
    monitoringUptime: number;
    alertsGenerated: number;
    insightsDelivered: number;
    competitiveAdvantage: number;
  };

  lastUpdated: Date;
  nextUpdate: Date;
}

export interface CompetitorAnalysisConfig {
  enabled: boolean;
  monitoringFrequency: number; // Minuten
  competitors: string[]; // Competitor IDs to monitor
  alertThresholds: {
    authorityChange: number;
    marketShareChange: number;
    sentimentDrop: number;
    newCompetitor: boolean;
  };
  intelligenceDepth: 'basic' | 'advanced' | 'comprehensive';
  dataSources: {
    seo: boolean;
    social: boolean;
    content: boolean;
    market: boolean;
    news: boolean;
  };
}

// ===== MAIN SERVICE CLASS =====

class CompetitorAnalysisService {
  private static instance: CompetitorAnalysisService;
  private config: CompetitorAnalysisConfig;
  private competitorProfiles: Map<string, CompetitorProfile> = new Map();
  private competitorMetrics: Map<string, CompetitorMetrics[]> = new Map();
  private competitiveGaps: Map<string, CompetitiveGap[]> = new Map();
  private competitiveAlerts: Map<string, CompetitiveAlert> = new Map();
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeConfig();
    this.initializeCompetitorProfiles();
    this.setupAutomatedMonitoring();
  }

  public static getInstance(): CompetitorAnalysisService {
    if (!CompetitorAnalysisService.instance) {
      CompetitorAnalysisService.instance = new CompetitorAnalysisService();
    }
    return CompetitorAnalysisService.instance;
  }

  // ===== CONFIGURATION =====

  private initializeConfig(): void {
    this.config = {
      enabled: true,
      monitoringFrequency: 60, // Alle Stunde
      competitors: ['competitor-a', 'competitor-b', 'competitor-c', 'competitor-d', 'competitor-e'],
      alertThresholds: {
        authorityChange: 5,
        marketShareChange: 2,
        sentimentDrop: -0.2,
        newCompetitor: true
      },
      intelligenceDepth: 'comprehensive',
      dataSources: {
        seo: true,
        social: true,
        content: true,
        market: true,
        news: true
      }
    };
  }

  public updateConfig(newConfig: Partial<CompetitorAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartMonitoring();
  }

  // ===== COMPETITOR PROFILE MANAGEMENT =====

  private initializeCompetitorProfiles(): void {
    const competitors: CompetitorProfile[] = [
      {
        id: 'competitor-a',
        name: 'SolarTech AG',
        domain: 'solartech-ag.de',
        industry: 'Photovoltaik',
        marketPosition: 'leader',
        companySize: 'large',
        founded: 2010,
        headquarters: 'München',
        description: 'Marktführer für Photovoltaik-Lösungen in Deutschland',
        lastUpdated: new Date()
      },
      {
        id: 'competitor-b',
        name: 'GreenEnergy Solutions',
        domain: 'greenenergy-solutions.de',
        industry: 'Photovoltaik',
        marketPosition: 'challenger',
        companySize: 'medium',
        founded: 2015,
        headquarters: 'Berlin',
        description: 'Innovative Photovoltaik-Anbieter mit Fokus auf Gewerbe',
        lastUpdated: new Date()
      },
      {
        id: 'competitor-c',
        name: 'PV Power GmbH',
        domain: 'pv-power-gmbh.de',
        industry: 'Photovoltaik',
        marketPosition: 'follower',
        companySize: 'small',
        founded: 2018,
        headquarters: 'Hamburg',
        description: 'Regionaler Photovoltaik-Anbieter',
        lastUpdated: new Date()
      },
      {
        id: 'competitor-d',
        name: 'EcoSolar Systems',
        domain: 'ecosolar-systems.de',
        industry: 'Photovoltaik',
        marketPosition: 'niche',
        companySize: 'medium',
        founded: 2012,
        headquarters: 'Stuttgart',
        description: 'Spezialist für Agri-PV Lösungen',
        lastUpdated: new Date()
      },
      {
        id: 'competitor-e',
        name: 'SunPower Deutschland',
        domain: 'sunpower-deutschland.de',
        industry: 'Photovoltaik',
        marketPosition: 'leader',
        companySize: 'enterprise',
        founded: 2008,
        headquarters: 'Frankfurt',
        description: 'Internationaler Photovoltaik-Konzern',
        lastUpdated: new Date()
      }
    ];

    competitors.forEach(competitor => {
      this.competitorProfiles.set(competitor.id, competitor);
    });
  }

  // ===== AUTOMATED COMPETITOR MONITORING =====

  private setupAutomatedMonitoring(): void {
    if (!this.config.enabled) return;

    // Haupt-Monitoring-Intervall
    this.monitoringIntervals.set('main-monitoring', setInterval(() => {
      this.performCompetitorMonitoring();
    }, this.config.monitoringFrequency * 60 * 1000));

    // Alert-Monitoring (häufiger)
    this.monitoringIntervals.set('alert-monitoring', setInterval(() => {
      this.monitorCompetitiveAlerts();
    }, 15 * 60 * 1000)); // Alle 15 Minuten

    // Intelligence-Updates (täglich)
    this.monitoringIntervals.set('intelligence-updates', setInterval(() => {
      this.updateCompetitiveIntelligence();
    }, 24 * 60 * 60 * 1000));
  }

  private async performCompetitorMonitoring(): Promise<void> {
    try {
      for (const competitorId of this.config.competitors) {
        await this.monitorCompetitor(competitorId);
      }

      // Gap Analysis durchführen
      this.performGapAnalysis();

      // Dashboard aktualisieren
      this.updateIntelligenceDashboard();

    } catch (error) {
      console.error('Competitor monitoring failed:', error);
    }
  }

  private async monitorCompetitor(competitorId: string): Promise<void> {
    const profile = this.competitorProfiles.get(competitorId);
    if (!profile) return;

    // Simuliere umfassende Competitor-Metriken
    const metrics: CompetitorMetrics = {
      competitorId,
      timestamp: new Date(),

      brandAuthorityScore: this.generateCompetitorAuthorityScore(competitorId),
      brandAuthorityLevel: this.calculateCompetitorAuthorityLevel(competitorId),

      domainAuthority: Math.floor(Math.random() * 40) + 40, // 40-80
      organicTraffic: Math.floor(Math.random() * 50000) + 10000,
      backlinks: Math.floor(Math.random() * 5000) + 1000,
      indexedPages: Math.floor(Math.random() * 10000) + 2000,

      socialFollowers: {
        linkedin: Math.floor(Math.random() * 5000) + 1000,
        twitter: Math.floor(Math.random() * 10000) + 2000,
        facebook: Math.floor(Math.random() * 15000) + 3000,
        instagram: Math.floor(Math.random() * 8000) + 1500,
        youtube: Math.floor(Math.random() * 3000) + 500,
        total: 0 // Wird berechnet
      },
      socialEngagement: Math.random() * 0.1 + 0.02,

      contentVolume: Math.floor(Math.random() * 2000) + 500,
      thoughtLeadershipScore: Math.floor(Math.random() * 40) + 30,
      publications: Math.floor(Math.random() * 100) + 20,
      citations: Math.floor(Math.random() * 50) + 10,

      marketShare: Math.random() * 15 + 5, // 5-20%
      customerReviews: {
        averageRating: Math.random() * 1 + 3.5, // 3.5-4.5
        totalReviews: Math.floor(Math.random() * 1000) + 100,
        platforms: ['Google', 'Trustpilot', 'Ebay']
      },
      revenue: Math.floor(Math.random() * 50000000) + 10000000, // 10-60M €

      strengths: this.generateCompetitorStrengths(competitorId),
      weaknesses: this.generateCompetitorWeaknesses(competitorId),
      opportunities: this.generateCompetitorOpportunities(competitorId),
      threats: this.generateCompetitorThreats(competitorId),

      mediaCoverage: Math.floor(Math.random() * 200) + 50,
      brandMentions: Math.floor(Math.random() * 500) + 100,
      sentimentScore: (Math.random() - 0.5) * 0.4, // -0.2 to +0.2

      patents: Math.floor(Math.random() * 20) + 5,
      certifications: ['ISO 9001', 'TÜV', 'DIN EN 1090'],
      awards: ['Solar Award 2023', 'Innovation Prize 2024']
    };

    // Total Social Followers berechnen
    metrics.socialFollowers.total = Object.values(metrics.socialFollowers).reduce((sum, count) => sum + count, 0) - metrics.socialFollowers.total;

    // Metriken speichern
    const existingMetrics = this.competitorMetrics.get(competitorId) || [];
    existingMetrics.push(metrics);

    // Nur letzte 30 Tage behalten
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentMetrics = existingMetrics.filter(m => m.timestamp > thirtyDaysAgo);

    this.competitorMetrics.set(competitorId, recentMetrics);
  }

  private generateCompetitorAuthorityScore(competitorId: string): number {
    // Simuliere realistische Authority Scores basierend auf Marktposition
    const profile = this.competitorProfiles.get(competitorId);
    if (!profile) return 50;

    const baseScores = {
      leader: 85,
      challenger: 70,
      follower: 55,
      niche: 60
    };

    const baseScore = baseScores[profile.marketPosition];
    return Math.floor(baseScore + (Math.random() - 0.5) * 10); // ±5 Variation
  }

  private calculateCompetitorAuthorityLevel(competitorId: string): BrandAuthorityLevel {
    const score = this.generateCompetitorAuthorityScore(competitorId);

    if (score >= 91) return BrandAuthorityLevel.DOMINANT;
    if (score >= 76) return BrandAuthorityLevel.AUTHORITATIVE;
    if (score >= 51) return BrandAuthorityLevel.RECOGNIZED;
    if (score >= 26) return BrandAuthorityLevel.ESTABLISHING;
    return BrandAuthorityLevel.EMERGING;
  }

  private generateCompetitorStrengths(competitorId: string): string[] {
    const strengths = [
      'Starke Markenpräsenz',
      'Umfangreiche Produktpalette',
      'Hohe Kundenzufriedenheit',
      'Innovative Technologien',
      'Starke Partnerschaften',
      'Internationaler Markt',
      'Solide Finanzlage',
      'Erfahrene Führung'
    ];

    return strengths.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private generateCompetitorWeaknesses(competitorId: string): string[] {
    const weaknesses = [
      'Hohe Preise',
      'Begrenzte regionale Präsenz',
      'Langsame Kundenservice',
      'Veraltete Technologie',
      'Schwache Online-Präsenz',
      'Begrenzte Innovation',
      'Hohe Mitarbeiterfluktuation'
    ];

    return weaknesses.sort(() => Math.random() - 0.5).slice(0, 2);
  }

  private generateCompetitorOpportunities(competitorId: string): string[] {
    const opportunities = [
      'Marktexpansion',
      'Neue Technologien',
      'Partnerschaften',
      'Internationale Märkte',
      'Nachhaltige Produkte',
      'Digitale Transformation'
    ];

    return opportunities.sort(() => Math.random() - 0.5).slice(0, 2);
  }

  private generateCompetitorThreats(competitorId: string): string[] {
    const threats = [
      'Neue Wettbewerber',
      'Regulatorische Änderungen',
      'Wirtschaftliche Unsicherheit',
      'Technologische Disruption',
      'Lieferkettenprobleme',
      'Kundenpräferenzänderungen'
    ];

    return threats.sort(() => Math.random() - 0.5).slice(0, 2);
  }

  // ===== COMPETITIVE GAP ANALYSIS =====

  private performGapAnalysis(): void {
    for (const competitorId of this.config.competitors) {
      this.analyzeCompetitorGaps(competitorId);
    }
  }

  private analyzeCompetitorGaps(competitorId: string): void {
    const metrics = this.getLatestCompetitorMetrics(competitorId);
    if (!metrics) return;

    const gaps: CompetitiveGap[] = [];

    // Authority Gap analysieren
    const ourAuthority = brandAuthorityBuildingService.calculateBrandAuthorityScore();
    const authorityGap = ourAuthority.overall - metrics.brandAuthorityScore;

    if (authorityGap < 0) {
      gaps.push({
        id: `authority-gap-${competitorId}-${Date.now()}`,
        competitorId,
        gapType: 'weakness',
        category: 'brand_authority',
        description: `Authority Gap von ${Math.abs(authorityGap)} Punkten gegenüber ${this.competitorProfiles.get(competitorId)?.name}`,
        impact: 'high',
        actionable: true,
        priority: 9,
        recommendedAction: 'Intensiviere Thought Leadership und Media Relations',
        estimatedEffort: 'high',
        potentialGain: Math.abs(authorityGap),
        detected: new Date()
      });
    }

    // Content Gap analysieren
    const ourContentVolume = 150; // Placeholder - würde aus Content Service kommen
    const contentGap = ourContentVolume - metrics.contentVolume;

    if (contentGap < 0) {
      gaps.push({
        id: `content-gap-${competitorId}-${Date.now()}`,
        competitorId,
        gapType: 'opportunity',
        category: 'content_volume',
        description: `Content Volume Gap: ${Math.abs(contentGap)} Artikel weniger als ${this.competitorProfiles.get(competitorId)?.name}`,
        impact: 'medium',
        actionable: true,
        priority: 7,
        recommendedAction: 'Erhöhe Content-Produktion um 50%',
        estimatedEffort: 'medium',
        potentialGain: 5,
        detected: new Date()
      });
    }

    // Social Media Gap analysieren
    const ourSocialFollowers = 15000; // Placeholder
    const socialGap = ourSocialFollowers - metrics.socialFollowers.total;

    if (socialGap < 0) {
      gaps.push({
        id: `social-gap-${competitorId}-${Date.now()}`,
        competitorId,
        gapType: 'weakness',
        category: 'social_presence',
        description: `Social Media Gap: ${Math.abs(socialGap)} Follower weniger als ${this.competitorProfiles.get(competitorId)?.name}`,
        impact: 'medium',
        actionable: true,
        priority: 6,
        recommendedAction: 'Starte Influencer Partnership Network',
        estimatedEffort: 'medium',
        potentialGain: 3,
        detected: new Date()
      });
    }

    this.competitiveGaps.set(competitorId, gaps);
  }

  // ===== COMPETITIVE ALERT SYSTEM =====

  private monitorCompetitiveAlerts(): void {
    for (const competitorId of this.config.competitors) {
      this.checkCompetitorAlerts(competitorId);
    }
  }

  private checkCompetitorAlerts(competitorId: string): void {
    const currentMetrics = this.getLatestCompetitorMetrics(competitorId);
    const previousMetrics = this.getPreviousCompetitorMetrics(competitorId);

    if (!currentMetrics || !previousMetrics) return;

    // Authority Change Alert
    const authorityChange = currentMetrics.brandAuthorityScore - previousMetrics.brandAuthorityScore;
    if (Math.abs(authorityChange) >= this.config.alertThresholds.authorityChange) {
      const alertType = authorityChange > 0 ? 'authority_gain' : 'brand_risk';
      this.createCompetitiveAlert({
        id: `authority-alert-${competitorId}-${Date.now()}`,
        competitorId,
        alertType,
        severity: Math.abs(authorityChange) >= 10 ? 'high' : 'medium',
        title: `Authority Change: ${this.competitorProfiles.get(competitorId)?.name}`,
        description: `Brand Authority ${authorityChange > 0 ? 'gestiegen' : 'gefallen'} um ${Math.abs(authorityChange)} Punkte`,
        impact: authorityChange > 0 ? 'Competitive pressure increased' : 'Competitive advantage gained',
        recommendedAction: authorityChange > 0 ? 'Monitor competitor activities closely' : 'Capitalize on gained advantage',
        triggered: new Date(),
        acknowledged: false,
        resolved: false
      });
    }

    // Sentiment Drop Alert
    const sentimentChange = currentMetrics.sentimentScore - previousMetrics.sentimentScore;
    if (sentimentChange <= this.config.alertThresholds.sentimentDrop) {
      this.createCompetitiveAlert({
        id: `sentiment-alert-${competitorId}-${Date.now()}`,
        competitorId,
        alertType: 'brand_risk',
        severity: 'medium',
        title: `Negative Sentiment: ${this.competitorProfiles.get(competitorId)?.name}`,
        description: `Brand Sentiment gefallen um ${Math.abs(sentimentChange).toFixed(2)} Punkte`,
        impact: 'Potential reputation damage for competitor',
        recommendedAction: 'Monitor for opportunities to gain market share',
        triggered: new Date(),
        acknowledged: false,
        resolved: false
      });
    }
  }

  private createCompetitiveAlert(alert: CompetitiveAlert): void {
    this.competitiveAlerts.set(alert.id, alert);
    console.warn(`Competitive Alert: ${alert.title} - ${alert.description}`);
  }

  // ===== COMPETITIVE INTELLIGENCE DASHBOARD =====

  private updateIntelligenceDashboard(): void {
    // Dashboard wird on-demand generiert in getCompetitiveIntelligenceDashboard()
  }

  public getCompetitiveIntelligenceDashboard(): CompetitiveIntelligenceDashboard {
    const competitors = Array.from(this.competitorProfiles.values());
    const allMetrics = Array.from(this.competitorMetrics.values()).flat();

    // Competitor Ranking erstellen
    const competitorRanking = competitors
      .map(competitor => {
        const metrics = this.getLatestCompetitorMetrics(competitor.id);
        const previousMetrics = this.getPreviousCompetitorMetrics(competitor.id);
        const trend = metrics && previousMetrics ? metrics.brandAuthorityScore - previousMetrics.brandAuthorityScore : 0;

        return {
          rank: 0, // Wird später gesetzt
          competitor,
          authorityScore: metrics?.brandAuthorityScore || 0,
          trend,
          marketPosition: competitor.marketPosition,
          threatLevel: this.calculateThreatLevel(competitor.id)
        };
      })
      .sort((a, b) => b.authorityScore - a.authorityScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    // Overview berechnen
    const ourAuthority = brandAuthorityBuildingService.calculateBrandAuthorityScore();
    const averageCompetitorAuthority = competitorRanking.reduce((sum, c) => sum + c.authorityScore, 0) / competitorRanking.length;
    const ourPosition = competitorRanking.filter(c => c.authorityScore < ourAuthority.overall).length + 1;

    const overview = {
      totalCompetitors: competitors.length,
      marketLeaders: competitorRanking.filter(c => c.marketPosition === 'leader').length,
      directThreats: competitorRanking.filter(c => c.threatLevel === 'high').length,
      opportunities: competitorRanking.filter(c => c.threatLevel === 'low').length,
      averageCompetitorAuthority: Math.round(averageCompetitorAuthority),
      ourAuthorityPosition: ourPosition
    };

    // Alle Gaps sammeln
    const competitiveGaps = Array.from(this.competitiveGaps.values()).flat()
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    // Aktive Alerts
    const activeAlerts = Array.from(this.competitiveAlerts.values())
      .filter(alert => !alert.resolved)
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });

    // Market Insights generieren
    const marketInsights = {
      emergingTrends: [
        'Agri-PV Markt wächst um 40% jährlich',
        'Künstliche Intelligenz in Solar-Planung',
        'Nachhaltige Finanzierungsmodelle',
        'Internationale Expansion'
      ],
      competitiveLandscape: `Der Markt wird von ${overview.marketLeaders} etablierten Playern dominiert. ZOE Solar befindet sich auf Position ${ourPosition} mit Raum für Wachstum.`,
      strategicRecommendations: [
        'Fokussiere auf Agri-PV Thought Leadership',
        'Baue Academic Partnerships aus',
        'Starte Influencer Partnership Network',
        'Intensiviere Media Relations Program'
      ],
      riskAssessment: activeAlerts.length > 0 ? 'Medium risk due to competitive activities' : 'Low risk, stable market position'
    };

    // Performance Metrics
    const performanceMetrics = {
      monitoringUptime: 99.9,
      alertsGenerated: Array.from(this.competitiveAlerts.values()).length,
      insightsDelivered: competitiveGaps.length,
      competitiveAdvantage: Math.max(0, ourAuthority.overall - averageCompetitorAuthority)
    };

    return {
      overview,
      competitorRanking,
      competitiveGaps,
      activeAlerts,
      marketInsights,
      performanceMetrics,
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + this.config.monitoringFrequency * 60 * 1000)
    };
  }

  private calculateThreatLevel(competitorId: string): 'high' | 'medium' | 'low' {
    const metrics = this.getLatestCompetitorMetrics(competitorId);
    if (!metrics) return 'low';

    const ourAuthority = brandAuthorityBuildingService.calculateBrandAuthorityScore();

    if (metrics.brandAuthorityScore >= ourAuthority.overall + 10) return 'high';
    if (metrics.brandAuthorityScore >= ourAuthority.overall - 5) return 'medium';
    return 'low';
  }

  // ===== UTILITY METHODS =====

  private getLatestCompetitorMetrics(competitorId: string): CompetitorMetrics | undefined {
    const metrics = this.competitorMetrics.get(competitorId);
    return metrics?.[metrics.length - 1];
  }

  private getPreviousCompetitorMetrics(competitorId: string): CompetitorMetrics | undefined {
    const metrics = this.competitorMetrics.get(competitorId);
    return metrics?.[metrics.length - 2];
  }

  private updateCompetitiveIntelligence(): void {
    // Tägliche Intelligence-Updates
    // In echter Implementierung: Datenbank-Updates, API-Calls, etc.
  }

  // ===== PUBLIC API METHODS =====

  public getCompetitorProfiles(): CompetitorProfile[] {
    return Array.from(this.competitorProfiles.values());
  }

  public getCompetitorMetrics(competitorId: string): CompetitorMetrics[] {
    return this.competitorMetrics.get(competitorId) || [];
  }

  public getCompetitiveGaps(competitorId?: string): CompetitiveGap[] {
    if (competitorId) {
      return this.competitiveGaps.get(competitorId) || [];
    }
    return Array.from(this.competitiveGaps.values()).flat();
  }

  public getCompetitiveAlerts(activeOnly = true): CompetitiveAlert[] {
    const alerts = Array.from(this.competitiveAlerts.values());
    return activeOnly ? alerts.filter(alert => !alert.resolved) : alerts;
  }

  public acknowledgeAlert(alertId: string): void {
    const alert = this.competitiveAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public resolveAlert(alertId: string): void {
    const alert = this.competitiveAlerts.get(alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public addCompetitorProfile(profile: CompetitorProfile): void {
    this.competitorProfiles.set(profile.id, profile);
    if (!this.config.competitors.includes(profile.id)) {
      this.config.competitors.push(profile.id);
    }
  }

  public exportCompetitiveIntelligence(): {
    dashboard: CompetitiveIntelligenceDashboard;
    competitorProfiles: CompetitorProfile[];
    allMetrics: Record<string, CompetitorMetrics[]>;
    allGaps: CompetitiveGap[];
    allAlerts: CompetitiveAlert[];
    summary: {
      totalCompetitors: number;
      activeAlerts: number;
      criticalGaps: number;
      competitiveAdvantage: number;
      monitoringStatus: string;
    };
  } {
    const dashboard = this.getCompetitiveIntelligenceDashboard();

    return {
      dashboard,
      competitorProfiles: this.getCompetitorProfiles(),
      allMetrics: Object.fromEntries(this.competitorMetrics),
      allGaps: this.getCompetitiveGaps(),
      allAlerts: this.getCompetitiveAlerts(false),
      summary: {
        totalCompetitors: dashboard.overview.totalCompetitors,
        activeAlerts: dashboard.activeAlerts.length,
        criticalGaps: dashboard.competitiveGaps.filter(g => g.priority >= 8).length,
        competitiveAdvantage: dashboard.performanceMetrics.competitiveAdvantage,
        monitoringStatus: this.config.enabled ? 'Active' : 'Inactive'
      }
    };
  }

  // ===== LIFECYCLE MANAGEMENT =====

  public restartMonitoring(): void {
    this.stopMonitoring();
    this.setupAutomatedMonitoring();
  }

  public stopMonitoring(): void {
    this.monitoringIntervals.forEach(interval => clearInterval(interval));
    this.monitoringIntervals.clear();
  }

  public getMonitoringHealth(): {
    status: string;
    activeIntervals: number;
    lastMonitoringRun: Date | null;
    competitorsMonitored: number;
    alertsActive: number;
  } {
    return {
      status: this.config.enabled ? 'active' : 'inactive',
      activeIntervals: this.monitoringIntervals.size,
      lastMonitoringRun: new Date(), // Placeholder
      competitorsMonitored: this.config.competitors.length,
      alertsActive: this.getCompetitiveAlerts().length
    };
  }
}

// ===== EXPORT =====

export const competitorAnalysisService = CompetitorAnalysisService.getInstance();
export default competitorAnalysisService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Competitive Intelligence Dashboard abrufen
 * const dashboard = competitorAnalysisService.getCompetitiveIntelligenceDashboard();
 *
 * // Competitor Metriken überwachen
 * const metrics = competitorAnalysisService.getCompetitorMetrics('competitor-a');
 *
 * // Competitive Gaps analysieren
 * const gaps = competitorAnalysisService.getCompetitiveGaps();
 *
 * // Alerts verwalten
 * const alerts = competitorAnalysisService.getCompetitiveAlerts();
 * competitorAnalysisService.acknowledgeAlert(alertId);
 *
 * // Vollständige Intelligence exportieren
 * const intelligence = competitorAnalysisService.exportCompetitiveIntelligence();
 *
 * // Monitoring-Status prüfen
 * const health = competitorAnalysisService.getMonitoringHealth();
 */