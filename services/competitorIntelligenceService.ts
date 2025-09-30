/**
 * Competitor Intelligence Service für ZOE Solar
 *
 * Umfassende Wettbewerber-Analyse und Intelligence für strategische Vorteile
 */

import { optimizeKeywords } from '../server/services/geminiClient';

export interface CompetitorProfile {
  id: string;
  domain: string;
  companyName: string;
  industry: string;
  location: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAnalyzed: Date;
  active: boolean;
}

export interface CompetitorAnalysis {
  competitorId: string;
  analysisDate: Date;
  seoMetrics: {
    domainAuthority: number;
    backlinks: number;
    organicTraffic: number;
    organicKeywords: number;
    paidKeywords: number;
    averagePosition: number;
    featuredSnippets: number;
  };
  contentStrategy: {
    contentTypes: string[];
    contentVolume: number;
    contentQuality: number;
    publishingFrequency: number;
    topTopics: Array<{
      topic: string;
      coverage: number;
      quality: number;
    }>;
  };
  technicalSEO: {
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
      overall: number;
    };
    mobileFriendly: boolean;
    httpsEnabled: boolean;
    sitemapPresent: boolean;
    robotsTxtOptimized: boolean;
  };
  socialPresence: {
    platforms: string[];
    followers: Record<string, number>;
    engagement: Record<string, number>;
    socialShares: number;
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitiveGap {
  id: string;
  competitorId: string;
  gapType: 'keyword' | 'content' | 'technical' | 'social' | 'local';
  description: string;
  impact: 'low' | 'medium' | 'high';
  exploitability: 'easy' | 'medium' | 'hard';
  resourcesRequired: 'low' | 'medium' | 'high';
  timeline: string;
  expectedGain: number;
  status: 'identified' | 'analyzing' | 'exploiting' | 'exploited';
  detectedAt: Date;
}

export interface MarketIntelligence {
  marketOverview: {
    totalMarketSize: number;
    growthRate: number;
    keyPlayers: number;
    marketShare: Record<string, number>;
  };
  competitiveLandscape: {
    marketLeaders: string[];
    emergingThreats: string[];
    marketGaps: string[];
    trendOpportunities: string[];
  };
  strategicInsights: Array<{
    insight: string;
    confidence: number;
    impact: string;
    recommendation: string;
  }>;
  generatedAt: Date;
}

export interface CompetitorMonitoring {
  competitorId: string;
  monitoringType: 'ranking' | 'content' | 'backlink' | 'social' | 'technical';
  frequency: 'daily' | 'weekly' | 'monthly';
  alerts: Array<{
    condition: string;
    threshold: number;
    currentValue: number;
    triggered: boolean;
    lastTriggered?: Date;
  }>;
  active: boolean;
  lastChecked: Date;
}

class CompetitorIntelligenceService {
  private static instance: CompetitorIntelligenceService;
  private competitorProfiles: Map<string, CompetitorProfile> = new Map();
  private competitorAnalyses: Map<string, CompetitorAnalysis> = new Map();
  private competitiveGaps: Map<string, CompetitiveGap> = new Map();
  private marketIntelligence: MarketIntelligence;
  private monitoringConfigs: Map<string, CompetitorMonitoring> = new Map();
  private intelligenceInterval?: NodeJS.Timeout;

  private constructor() {
    this.marketIntelligence = this.initializeMarketIntelligence();
    this.initializeCompetitorProfiles();
    this.initializeMonitoringConfigs();
    this.startCompetitorIntelligence();
  }

  public static getInstance(): CompetitorIntelligenceService {
    if (!CompetitorIntelligenceService.instance) {
      CompetitorIntelligenceService.instance = new CompetitorIntelligenceService();
    }
    return CompetitorIntelligenceService.instance;
  }

  private initializeMarketIntelligence(): MarketIntelligence {
    return {
      marketOverview: {
        totalMarketSize: 2500000000, // 2.5 Mrd EUR
        growthRate: 0.15, // 15%
        keyPlayers: 150,
        marketShare: {
          'leader1.de': 0.12,
          'leader2.de': 0.09,
          'zoe-solar.de': 0.03
        }
      },
      competitiveLandscape: {
        marketLeaders: ['leader1.de', 'leader2.de', 'leader3.de'],
        emergingThreats: ['startup1.de', 'startup2.de'],
        marketGaps: [
          'Agri-Photovoltaik Spezialisierung',
          'KI-gestützte Beratung',
          'Nachhaltigkeitsfokus'
        ],
        trendOpportunities: [
          'E-Mobilität Integration',
          'Energiegemeinschaften',
          'KI-Optimierung'
        ]
      },
      strategicInsights: [
        {
          insight: 'Agri-PV Markt zeigt 40% Wachstum',
          confidence: 85,
          impact: 'high',
          recommendation: 'Erhöhe Agri-PV Marketing-Budget um 30%'
        },
        {
          insight: 'Wettbewerber vernachlässigen Mobile UX',
          confidence: 78,
          impact: 'medium',
          recommendation: 'Fokussiere auf Mobile-First Strategie'
        }
      ],
      generatedAt: new Date()
    };
  }

  private initializeCompetitorProfiles(): void {
    const competitors = [
      {
        domain: 'photovoltaik-riese.de',
        companyName: 'Photovoltaik-Riese GmbH',
        industry: 'Solar & Photovoltaik',
        location: 'Deutschland',
        companySize: 'large' as const,
        marketPosition: 'leader' as const,
        threatLevel: 'high' as const
      },
      {
        domain: 'solar-profi.de',
        companyName: 'Solar Profi AG',
        industry: 'Solar & Photovoltaik',
        location: 'Deutschland',
        companySize: 'medium' as const,
        marketPosition: 'challenger' as const,
        threatLevel: 'medium' as const
      },
      {
        domain: 'green-energy-solar.de',
        companyName: 'Green Energy Solar GmbH',
        industry: 'Erneuerbare Energien',
        location: 'Deutschland',
        companySize: 'medium' as const,
        marketPosition: 'follower' as const,
        threatLevel: 'low' as const
      },
      {
        domain: 'agri-solar-experts.de',
        companyName: 'Agri Solar Experts',
        industry: 'Agri-Photovoltaik',
        location: 'Deutschland',
        companySize: 'small' as const,
        marketPosition: 'niche' as const,
        threatLevel: 'medium' as const
      }
    ];

    competitors.forEach(comp => {
      const profile: CompetitorProfile = {
        id: comp.domain.replace(/\./g, '-'),
        ...comp,
        lastAnalyzed: new Date(),
        active: true
      };

      this.competitorProfiles.set(profile.id, profile);
    });
  }

  private initializeMonitoringConfigs(): void {
    const monitoringTypes: Array<CompetitorMonitoring['monitoringType']> = [
      'ranking', 'content', 'backlink', 'social', 'technical'
    ];

    for (const [profileId, profile] of this.competitorProfiles) {
      for (const monitoringType of monitoringTypes) {
        const configId = `${profileId}-${monitoringType}`;
        const config: CompetitorMonitoring = {
          competitorId: profileId,
          monitoringType,
          frequency: profile.threatLevel === 'high' ? 'daily' : profile.threatLevel === 'medium' ? 'weekly' : 'monthly',
          alerts: this.generateDefaultAlerts(monitoringType),
          active: true,
          lastChecked: new Date()
        };

        this.monitoringConfigs.set(configId, config);
      }
    }
  }

  private generateDefaultAlerts(monitoringType: CompetitorMonitoring['monitoringType']): CompetitorMonitoring['alerts'] {
    switch (monitoringType) {
      case 'ranking':
        return [
          {
            condition: 'Average position improved by more than 2',
            threshold: -2,
            currentValue: 0,
            triggered: false
          },
          {
            condition: 'New keyword rankings in top 10',
            threshold: 5,
            currentValue: 0,
            triggered: false
          }
        ];
      case 'content':
        return [
          {
            condition: 'Content volume increased by 20%',
            threshold: 20,
            currentValue: 0,
            triggered: false
          }
        ];
      case 'backlink':
        return [
          {
            condition: 'New backlinks gained',
            threshold: 10,
            currentValue: 0,
            triggered: false
          }
        ];
      default:
        return [];
    }
  }

  private startCompetitorIntelligence(): void {
    // Intelligence-Analyse alle 24 Stunden
    this.intelligenceInterval = setInterval(() => {
      this.performCompetitorAnalysis();
    }, 24 * 60 * 60 * 1000);

    // Initiale Analyse
    this.performCompetitorAnalysis();
  }

  private async performCompetitorAnalysis(): Promise<void> {
    try {
      // Analysiere alle aktiven Wettbewerber
      for (const [profileId, profile] of this.competitorProfiles) {
        if (profile.active) {
          await this.analyzeCompetitor(profileId);
        }
      }

      // Identifiziere Competitive Gaps
      await this.identifyCompetitiveGaps();

      // Aktualisiere Market Intelligence
      await this.updateMarketIntelligence();

      // Überprüfe Monitoring Alerts
      await this.checkMonitoringAlerts();

    } catch (error) {
      console.error('Failed to perform competitor analysis:', error);
    }
  }

  private async analyzeCompetitor(competitorId: string): Promise<void> {
    const profile = this.competitorProfiles.get(competitorId);
    if (!profile) return;

    // Simuliere umfassende Competitor-Analyse
    const analysis: CompetitorAnalysis = {
      competitorId,
      analysisDate: new Date(),
      seoMetrics: {
        domainAuthority: 45 + Math.random() * 40, // 45-85
        backlinks: Math.floor(Math.random() * 50000) + 10000,
        organicTraffic: Math.floor(Math.random() * 500000) + 50000,
        organicKeywords: Math.floor(Math.random() * 10000) + 2000,
        paidKeywords: Math.floor(Math.random() * 2000) + 200,
        averagePosition: 10 + Math.random() * 20, // 10-30
        featuredSnippets: Math.floor(Math.random() * 50) + 5
      },
      contentStrategy: {
        contentTypes: ['blog', 'case-study', 'guide', 'product-page'],
        contentVolume: Math.floor(Math.random() * 500) + 100,
        contentQuality: 60 + Math.random() * 30, // 60-90
        publishingFrequency: Math.floor(Math.random() * 20) + 5,
        topTopics: [
          { topic: 'Photovoltaik', coverage: 85, quality: 78 },
          { topic: 'Solar Förderungen', coverage: 72, quality: 82 },
          { topic: 'Installation', coverage: 68, quality: 75 }
        ]
      },
      technicalSEO: {
        coreWebVitals: {
          lcp: 1500 + Math.random() * 2000,
          fid: 50 + Math.random() * 100,
          cls: 0.05 + Math.random() * 0.15,
          overall: 70 + Math.random() * 25
        },
        mobileFriendly: Math.random() > 0.2,
        httpsEnabled: Math.random() > 0.1,
        sitemapPresent: Math.random() > 0.15,
        robotsTxtOptimized: Math.random() > 0.25
      },
      socialPresence: {
        platforms: ['facebook', 'linkedin', 'twitter'],
        followers: {
          facebook: Math.floor(Math.random() * 10000) + 1000,
          linkedin: Math.floor(Math.random() * 5000) + 500,
          twitter: Math.floor(Math.random() * 2000) + 200
        },
        engagement: {
          facebook: Math.random() * 5,
          linkedin: Math.random() * 3,
          twitter: Math.random() * 2
        },
        socialShares: Math.floor(Math.random() * 1000) + 100
      },
      strengths: [
        'Starke Markenpräsenz',
        'Umfangreicher Content',
        'Gute technische Performance'
      ],
      weaknesses: [
        'Hohe Kosten',
        'Langsame Reaktionszeiten',
        'Begrenzte lokale Präsenz'
      ],
      opportunities: [
        'Lokale Märkte erschließen',
        'KI-Integration verbessern',
        'Mobile UX optimieren'
      ],
      threats: [
        'Neue Wettbewerber',
        'Preisdruck',
        'Regulatorische Änderungen'
      ]
    };

    this.competitorAnalyses.set(competitorId, analysis);
    profile.lastAnalyzed = new Date();
  }

  private async identifyCompetitiveGaps(): Promise<void> {
    for (const [competitorId, analysis] of this.competitorAnalyses) {
      // Keyword Gaps
      if (analysis.seoMetrics.organicKeywords < 5000) {
        const gap: CompetitiveGap = {
          id: `keyword-gap-${competitorId}`,
          competitorId,
          gapType: 'keyword',
          description: `Wettbewerber hat nur ${analysis.seoMetrics.organicKeywords} organische Keywords - Opportunity für Keyword-Expansion`,
          impact: 'high',
          exploitability: 'medium',
          resourcesRequired: 'medium',
          timeline: '3-6 Monate',
          expectedGain: 25,
          status: 'identified',
          detectedAt: new Date()
        };
        this.competitiveGaps.set(gap.id, gap);
      }

      // Content Gaps
      if (analysis.contentStrategy.contentQuality < 70) {
        const gap: CompetitiveGap = {
          id: `content-gap-${competitorId}`,
          competitorId,
          gapType: 'content',
          description: `Content-Qualität von ${analysis.contentStrategy.contentQuality.toFixed(1)} bietet Opportunity für höherwertigen Content`,
          impact: 'medium',
          exploitability: 'easy',
          resourcesRequired: 'high',
          timeline: '2-4 Monate',
          expectedGain: 20,
          status: 'identified',
          detectedAt: new Date()
        };
        this.competitiveGaps.set(gap.id, gap);
      }

      // Technical Gaps
      if (analysis.technicalSEO.coreWebVitals.overall < 75) {
        const gap: CompetitiveGap = {
          id: `technical-gap-${competitorId}`,
          competitorId,
          gapType: 'technical',
          description: `Core Web Vitals Score von ${analysis.technicalSEO.coreWebVitals.overall.toFixed(1)} - Verbesserungspotenzial`,
          impact: 'medium',
          exploitability: 'easy',
          resourcesRequired: 'low',
          timeline: '1-2 Monate',
          expectedGain: 15,
          status: 'identified',
          detectedAt: new Date()
        };
        this.competitiveGaps.set(gap.id, gap);
      }
    }
  }

  private async updateMarketIntelligence(): Promise<void> {
    // Aktualisiere Marktübersicht
    this.marketIntelligence.marketOverview.growthRate += (Math.random() - 0.5) * 0.02; // ±1%

    // Aktualisiere strategische Insights
    const newInsights = await this.generateStrategicInsights();
    this.marketIntelligence.strategicInsights.push(...newInsights);

    // Behalte nur letzte 10 Insights
    if (this.marketIntelligence.strategicInsights.length > 10) {
      this.marketIntelligence.strategicInsights = this.marketIntelligence.strategicInsights.slice(-10);
    }

    this.marketIntelligence.generatedAt = new Date();
  }

  private async generateStrategicInsights(): Promise<MarketIntelligence['strategicInsights']> {
    // Simuliere KI-generierte Insights
    return [
      {
        insight: 'Lokale SEO wird wichtiger für Lead-Generierung',
        confidence: 82,
        impact: 'high',
        recommendation: 'Erhöhe Investitionen in lokale SEO um 40%'
      }
    ];
  }

  private async checkMonitoringAlerts(): Promise<void> {
    for (const [configId, config] of this.monitoringConfigs) {
      if (!config.active) continue;

      const competitorId = config.competitorId;
      const analysis = this.competitorAnalyses.get(competitorId);

      if (!analysis) continue;

      // Überprüfe Alerts basierend auf Monitoring-Typ
      for (const alert of config.alerts) {
        const shouldTrigger = this.evaluateAlertCondition(alert, analysis, config.monitoringType);

        if (shouldTrigger && !alert.triggered) {
          alert.triggered = true;
          alert.lastTriggered = new Date();
          // Hier würde normalerweise eine Notification versendet
        } else if (!shouldTrigger && alert.triggered) {
          alert.triggered = false;
        }
      }

      config.lastChecked = new Date();
    }
  }

  private evaluateAlertCondition(alert: CompetitorMonitoring['alerts'][0], analysis: CompetitorAnalysis, monitoringType: CompetitorMonitoring['monitoringType']): boolean {
    switch (monitoringType) {
      case 'ranking':
        if (alert.condition.includes('position improved')) {
          return analysis.seoMetrics.averagePosition < alert.threshold;
        }
        if (alert.condition.includes('new keyword rankings')) {
          return analysis.seoMetrics.organicKeywords > alert.threshold;
        }
        break;
      case 'content':
        if (alert.condition.includes('volume increased')) {
          return analysis.contentStrategy.contentVolume > alert.threshold;
        }
        break;
      case 'backlink':
        if (alert.condition.includes('new backlinks')) {
          return analysis.seoMetrics.backlinks > alert.threshold;
        }
        break;
    }
    return false;
  }

  // ===== PUBLIC API =====

  public getCompetitorProfiles(): CompetitorProfile[] {
    return Array.from(this.competitorProfiles.values())
      .filter(profile => profile.active);
  }

  public getCompetitorProfile(competitorId: string): CompetitorProfile | null {
    return this.competitorProfiles.get(competitorId) || null;
  }

  public getCompetitorAnalysis(competitorId: string): CompetitorAnalysis | null {
    return this.competitorAnalyses.get(competitorId) || null;
  }

  public getAllCompetitorAnalyses(): CompetitorAnalysis[] {
    return Array.from(this.competitorAnalyses.values());
  }

  public getCompetitiveGaps(competitorId?: string): CompetitiveGap[] {
    const gaps = Array.from(this.competitiveGaps.values());

    if (competitorId) {
      return gaps.filter(gap => gap.competitorId === competitorId);
    }

    return gaps;
  }

  public getMarketIntelligence(): MarketIntelligence {
    return { ...this.marketIntelligence };
  }

  public getMonitoringConfigs(competitorId?: string): CompetitorMonitoring[] {
    const configs = Array.from(this.monitoringConfigs.values());

    if (competitorId) {
      return configs.filter(config => config.competitorId === competitorId);
    }

    return configs;
  }

  public async addCompetitor(domain: string, companyName: string, threatLevel: CompetitorProfile['threatLevel'] = 'medium'): Promise<string> {
    const profile: CompetitorProfile = {
      id: domain.replace(/\./g, '-'),
      domain,
      companyName,
      industry: 'Solar & Photovoltaik',
      location: 'Deutschland',
      companySize: 'medium',
      marketPosition: 'follower',
      threatLevel,
      lastAnalyzed: new Date(),
      active: true
    };

    this.competitorProfiles.set(profile.id, profile);

    // Erstelle Monitoring-Konfigurationen
    this.initializeMonitoringForCompetitor(profile.id);

    return profile.id;
  }

  private initializeMonitoringForCompetitor(competitorId: string): void {
    const monitoringTypes: Array<CompetitorMonitoring['monitoringType']> = [
      'ranking', 'content', 'backlink', 'social', 'technical'
    ];

    for (const monitoringType of monitoringTypes) {
      const configId = `${competitorId}-${monitoringType}`;
      const config: CompetitorMonitoring = {
        competitorId,
        monitoringType,
        frequency: 'weekly',
        alerts: this.generateDefaultAlerts(monitoringType),
        active: true,
        lastChecked: new Date()
      };

      this.monitoringConfigs.set(configId, config);
    }
  }

  public async updateCompetitorAnalysis(competitorId: string): Promise<void> {
    await this.analyzeCompetitor(competitorId);
  }

  public async createCompetitiveGap(gap: Omit<CompetitiveGap, 'id' | 'detectedAt'>): Promise<string> {
    const id = `gap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newGap: CompetitiveGap = {
      ...gap,
      id,
      detectedAt: new Date()
    };

    this.competitiveGaps.set(id, newGap);
    return id;
  }

  public async updateCompetitiveGap(gapId: string, updates: Partial<CompetitiveGap>): Promise<void> {
    const existing = this.competitiveGaps.get(gapId);
    if (!existing) throw new Error(`Competitive gap ${gapId} not found`);

    this.competitiveGaps.set(gapId, { ...existing, ...updates });
  }

  public getCompetitorComparison(competitorIds: string[]): {
    comparison: Record<string, any>;
    insights: string[];
  } {
    const comparison: Record<string, any> = {};
    const insights: string[] = [];

    for (const competitorId of competitorIds) {
      const analysis = this.competitorAnalyses.get(competitorId);
      if (analysis) {
        comparison[competitorId] = {
          seoMetrics: analysis.seoMetrics,
          contentStrategy: analysis.contentStrategy,
          technicalSEO: analysis.technicalSEO
        };
      }
    }

    // Generiere Vergleichs-Insights
    if (competitorIds.length >= 2) {
      insights.push('Vergleich der Wettbewerber zeigt Stärken in verschiedenen Bereichen');
      insights.push('Opportunity: Kombination der besten Praktiken');
    }

    return { comparison, insights };
  }

  public async generateCompetitorReport(competitorId: string): Promise<{
    profile: CompetitorProfile;
    analysis: CompetitorAnalysis;
    gaps: CompetitiveGap[];
    recommendations: string[];
  }> {
    const profile = this.competitorProfiles.get(competitorId);
    const analysis = this.competitorAnalyses.get(competitorId);
    const gaps = this.getCompetitiveGaps(competitorId);

    if (!profile || !analysis) {
      throw new Error(`Competitor ${competitorId} not found or not analyzed`);
    }

    const recommendations = [
      ...analysis.opportunities.map(opp => `Nutze Opportunity: ${opp}`),
      ...gaps.filter(gap => gap.status === 'identified').map(gap => `Exploit Gap: ${gap.description}`)
    ];

    return {
      profile,
      analysis,
      gaps,
      recommendations
    };
  }

  public stopCompetitorIntelligence(): void {
    if (this.intelligenceInterval) {
      clearInterval(this.intelligenceInterval);
      this.intelligenceInterval = undefined;
    }
  }

  public startCompetitorIntelligence(): void {
    if (!this.intelligenceInterval) {
      this.startCompetitorIntelligence();
    }
  }
}

export const competitorIntelligenceService = CompetitorIntelligenceService.getInstance();
export default competitorIntelligenceService;