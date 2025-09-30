/**
 * Automated Content Gap Analysis Service für ZOE Solar
 *
 * Automatische Identifizierung von Content-Lücken, Keyword-Gaps
 * und strategischen Content-Opportunitäten
 */

import { optimizeKeywords } from '../server/services/geminiClient';

export interface ContentGap {
  id: string;
  type: 'keyword' | 'topic' | 'intent' | 'competitor' | 'seasonal' | 'technical';
  title: string;
  description: string;
  keywords: string[];
  searchVolume: number;
  competition: number;
  opportunity: number; // 0-100
  difficulty: 'low' | 'medium' | 'high';
  priority: number;
  estimatedTraffic: number;
  estimatedRevenue: number;
  contentSuggestions: Array<{
    title: string;
    type: 'blog' | 'guide' | 'case-study' | 'tool' | 'video';
    wordCount: number;
    keywords: string[];
    estimatedPerformance: number;
  }>;
  competitors: Array<{
    domain: string;
    rankingPages: number;
    contentQuality: number;
  }>;
  detectedAt: Date;
  status: 'open' | 'in-progress' | 'completed' | 'dismissed';
}

export interface ContentInventory {
  totalPages: number;
  contentByType: Record<string, number>;
  keywordCoverage: Record<string, {
    covered: boolean;
    ranking: number;
    contentId: string;
  }>;
  topicClusters: Array<{
    topic: string;
    pages: string[];
    pillarContent: string;
    clusterScore: number;
  }>;
  contentGaps: ContentGap[];
  lastUpdated: Date;
}

export interface GapAnalysisReport {
  id: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalGaps: number;
    highPriorityGaps: number;
    estimatedTrafficOpportunity: number;
    estimatedRevenueOpportunity: number;
  };
  gapsByType: Record<string, ContentGap[]>;
  gapsByDifficulty: Record<string, ContentGap[]>;
  topOpportunities: ContentGap[];
  contentRecommendations: Array<{
    gapId: string;
    contentType: string;
    priority: number;
    estimatedROI: number;
  }>;
  competitorAnalysis: {
    topCompetitors: Array<{
      domain: string;
      sharedKeywords: number;
      contentGaps: number;
    }>;
    competitiveAdvantages: string[];
    threats: string[];
  };
}

export interface KeywordGap {
  keyword: string;
  searchVolume: number;
  competition: number;
  currentRanking?: number;
  competitorRankings: Array<{
    domain: string;
    position: number;
    contentQuality: number;
  }>;
  opportunity: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  relatedKeywords: string[];
  seasonal: boolean;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface TopicGap {
  topic: string;
  subtopics: string[];
  coverage: number; // 0-100
  competitorCoverage: Record<string, number>;
  searchDemand: number;
  contentSuggestions: Array<{
    title: string;
    type: string;
    estimatedTraffic: number;
  }>;
}

class AutomatedContentGapAnalysisService {
  private static instance: AutomatedContentGapAnalysisService;
  private contentGaps: Map<string, ContentGap> = new Map();
  private contentInventory: ContentInventory;
  private keywordDatabase: Map<string, KeywordGap> = new Map();
  private topicDatabase: Map<string, TopicGap> = new Map();
  private analysisReports: Map<string, GapAnalysisReport> = new Map();
  private gapAnalysisInterval?: NodeJS.Timeout;

  private constructor() {
    this.contentInventory = this.initializeContentInventory();
    this.initializeKeywordDatabase();
    this.initializeTopicDatabase();
    this.startGapAnalysis();
  }

  public static getInstance(): AutomatedContentGapAnalysisService {
    if (!AutomatedContentGapAnalysisService.instance) {
      AutomatedContentGapAnalysisService.instance = new AutomatedContentGapAnalysisService();
    }
    return AutomatedContentGapAnalysisService.instance;
  }

  private initializeContentInventory(): ContentInventory {
    return {
      totalPages: 0,
      contentByType: {},
      keywordCoverage: {},
      topicClusters: [],
      contentGaps: [],
      lastUpdated: new Date()
    };
  }

  private initializeKeywordDatabase(): void {
    // Simuliere Keyword-Datenbank mit relevanten Solar-Keywords
    const keywords: Array<Omit<KeywordGap, 'competitorRankings'>> = [
      {
        keyword: 'photovoltaik anlage kosten',
        searchVolume: 5400,
        competition: 0.65,
        opportunity: 85,
        intent: 'commercial',
        relatedKeywords: ['pv anlage preis', 'solaranlage kosten'],
        seasonal: false,
        trendDirection: 'up'
      },
      {
        keyword: 'agri photovoltaik',
        searchVolume: 2900,
        competition: 0.45,
        opportunity: 78,
        intent: 'informational',
        relatedKeywords: ['landwirtschaft solar', 'agrivoltaik'],
        seasonal: false,
        trendDirection: 'up'
      },
      {
        keyword: 'solaranlage foerderung 2024',
        searchVolume: 8100,
        competition: 0.75,
        opportunity: 92,
        intent: 'transactional',
        relatedKeywords: ['kfw foerderung solar', 'solar foerdermittel'],
        seasonal: true,
        trendDirection: 'up'
      },
      {
        keyword: 'balkonkraftwerk bestenliste',
        searchVolume: 3600,
        competition: 0.55,
        opportunity: 88,
        intent: 'commercial',
        relatedKeywords: ['balkonsolar beste', 'mini pv anlage'],
        seasonal: false,
        trendDirection: 'up'
      },
      {
        keyword: 'photovoltaik gewerbe',
        searchVolume: 4400,
        competition: 0.60,
        opportunity: 82,
        intent: 'commercial',
        relatedKeywords: ['solaranlage firma', 'gewerbliche pv'],
        seasonal: false,
        trendDirection: 'stable'
      }
    ];

    keywords.forEach(keyword => {
      this.keywordDatabase.set(keyword.keyword, {
        ...keyword,
        competitorRankings: [
          { domain: 'competitor1.de', position: 2, contentQuality: 85 },
          { domain: 'competitor2.de', position: 4, contentQuality: 78 },
          { domain: 'solar-abc.de', position: 1, contentQuality: 92 }
        ]
      });
    });
  }

  private initializeTopicDatabase(): void {
    // Simuliere Topic-Datenbank
    const topics: TopicGap[] = [
      {
        topic: 'Photovoltaik Installation',
        subtopics: ['Planung', 'Montage', 'Inbetriebnahme', 'Wartung'],
        coverage: 75,
        competitorCoverage: {
          'competitor1.de': 90,
          'competitor2.de': 85
        },
        searchDemand: 12500,
        contentSuggestions: [
          {
            title: 'Photovoltaik Installation Schritt für Schritt',
            type: 'guide',
            estimatedTraffic: 3200
          }
        ]
      },
      {
        topic: 'Solar Förderungen',
        subtopics: ['KFW', 'EEG', 'Landesförderungen', 'Steuervorteile'],
        coverage: 60,
        competitorCoverage: {
          'competitor1.de': 95,
          'competitor2.de': 88
        },
        searchDemand: 18900,
        contentSuggestions: [
          {
            title: 'Alle Solar-Förderungen 2024 im Überblick',
            type: 'guide',
            estimatedTraffic: 5800
          }
        ]
      },
      {
        topic: 'Agri-Photovoltaik',
        subtopics: ['Vorteile', 'Planung', 'Genehmigung', 'Wirtschaftlichkeit'],
        coverage: 45,
        competitorCoverage: {
          'competitor1.de': 70,
          'competitor2.de': 65
        },
        searchDemand: 4200,
        contentSuggestions: [
          {
            title: 'Agri-Photovoltaik: Landwirtschaft meets Solar',
            type: 'case-study',
            estimatedTraffic: 2100
          }
        ]
      }
    ];

    topics.forEach(topic => {
      this.topicDatabase.set(topic.topic, topic);
    });
  }

  private startGapAnalysis(): void {
    // Gap-Analyse alle 12 Stunden
    this.gapAnalysisInterval = setInterval(() => {
      this.performGapAnalysis();
    }, 12 * 60 * 60 * 1000);

    // Initiale Analyse
    this.performGapAnalysis();
  }

  private async performGapAnalysis(): Promise<void> {
    try {
      // Aktualisiere Content-Inventory
      await this.updateContentInventory();

      // Identifiziere Keyword-Gaps
      await this.identifyKeywordGaps();

      // Identifiziere Topic-Gaps
      await this.identifyTopicGaps();

      // Analysiere Competitor-Content
      await this.analyzeCompetitorContent();

      // Generiere Content-Vorschläge
      await this.generateContentSuggestions();

      // Erstelle Gap-Analysis Report
      await this.generateGapAnalysisReport();

    } catch (error) {
      console.error('Failed to perform gap analysis:', error);
    }
  }

  private async updateContentInventory(): Promise<void> {
    // Simuliere Content-Inventory Update
    this.contentInventory.totalPages = 145;
    this.contentInventory.contentByType = {
      'blog': 45,
      'guide': 28,
      'case-study': 22,
      'product-page': 35,
      'landing-page': 15
    };

    // Aktualisiere Keyword-Coverage
    for (const [keyword, gap] of this.keywordDatabase) {
      const covered = Math.random() > 0.6; // Simuliere Coverage
      this.contentInventory.keywordCoverage[keyword] = {
        covered,
        ranking: covered ? Math.floor(Math.random() * 20) + 1 : 0,
        contentId: covered ? `content-${Math.random().toString(36).substr(2, 9)}` : ''
      };
    }

    this.contentInventory.lastUpdated = new Date();
  }

  private async identifyKeywordGaps(): Promise<void> {
    for (const [keyword, keywordData] of this.keywordDatabase) {
      const coverage = this.contentInventory.keywordCoverage[keyword];

      // Prüfe ob Keyword-Gap existiert
      if (!coverage?.covered || coverage.ranking > 10) {
        const gapId = `keyword-gap-${keyword.replace(/\s+/g, '-')}`;

        // Berechne Opportunity Score
        const opportunity = this.calculateKeywordOpportunity(keywordData, coverage);

        // Bestimme Difficulty
        const difficulty = this.assessKeywordDifficulty(keywordData);

        // Generiere Content-Suggestions
        const contentSuggestions = await this.generateKeywordContentSuggestions(keywordData);

        const gap: ContentGap = {
          id: gapId,
          type: 'keyword',
          title: `Keyword Gap: "${keyword}"`,
          description: `Hohes Suchvolumen (${keywordData.searchVolume}) mit geringer eigener Coverage`,
          keywords: [keyword, ...keywordData.relatedKeywords],
          searchVolume: keywordData.searchVolume,
          competition: keywordData.competition,
          opportunity,
          difficulty,
          priority: opportunity > 80 ? 9 : opportunity > 60 ? 6 : 3,
          estimatedTraffic: Math.floor(keywordData.searchVolume * 0.3),
          estimatedRevenue: Math.floor(keywordData.searchVolume * 0.3 * 150), // €150 durchschnittlicher Wert
          contentSuggestions,
          competitors: keywordData.competitorRankings.map(comp => ({
            domain: comp.domain,
            rankingPages: 1,
            contentQuality: comp.contentQuality
          })),
          detectedAt: new Date(),
          status: 'open'
        };

        this.contentGaps.set(gapId, gap);
      }
    }
  }

  private calculateKeywordOpportunity(keywordData: KeywordGap, coverage?: any): number {
    let opportunity = 50;

    // Search Volume Impact
    if (keywordData.searchVolume > 5000) opportunity += 20;
    else if (keywordData.searchVolume > 2000) opportunity += 10;

    // Competition Impact (niedrige Competition = höhere Opportunity)
    opportunity += (1 - keywordData.competition) * 15;

    // Current Ranking Impact
    if (!coverage?.covered) opportunity += 15;
    else if (coverage.ranking > 20) opportunity += 10;
    else if (coverage.ranking > 10) opportunity += 5;

    return Math.min(100, opportunity);
  }

  private assessKeywordDifficulty(keywordData: KeywordGap): 'low' | 'medium' | 'high' {
    const score = keywordData.competition * 100;
    if (score < 40) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  }

  private async generateKeywordContentSuggestions(keywordData: KeywordGap): Promise<Array<{ title: string; type: string; wordCount: number; keywords: string[]; estimatedPerformance: number }>> {
    const suggestions = [];

    // Bestimme Content-Type basierend auf Intent
    let contentType: string;
    let wordCount: number;

    switch (keywordData.intent) {
      case 'informational':
        contentType = 'guide';
        wordCount = 2500;
        break;
      case 'commercial':
        contentType = 'blog';
        wordCount = 1800;
        break;
      case 'transactional':
        contentType = 'landing-page';
        wordCount = 1200;
        break;
      default:
        contentType = 'blog';
        wordCount = 1500;
    }

    // Generiere Title mit KI
    const titlePrompt = `Generiere einen SEO-optimierten Titel für Content über "${keywordData.keyword}". Der Titel sollte 50-60 Zeichen lang sein und das Keyword natürlich integrieren.`;
    const aiTitle = await optimizeKeywords([titlePrompt]);

    suggestions.push({
      title: aiTitle && aiTitle.length > 0 ? aiTitle[0] : `Alles über ${keywordData.keyword}`,
      type: contentType,
      wordCount,
      keywords: [keywordData.keyword, ...keywordData.relatedKeywords.slice(0, 3)],
      estimatedPerformance: keywordData.opportunity
    });

    return suggestions;
  }

  private async identifyTopicGaps(): Promise<void> {
    for (const [topicName, topicData] of this.topicDatabase) {
      // Prüfe Coverage-Gap
      if (topicData.coverage < 70) {
        const gapId = `topic-gap-${topicName.replace(/\s+/g, '-')}`;

        const opportunity = 100 - topicData.coverage;
        const difficulty = topicData.coverage < 30 ? 'high' : topicData.coverage < 50 ? 'medium' : 'low';

        const gap: ContentGap = {
          id: gapId,
          type: 'topic',
          title: `Topic Gap: "${topicName}"`,
          description: `Unvollständige Coverage (${topicData.coverage}%) für wichtiges Topic`,
          keywords: topicData.subtopics,
          searchVolume: topicData.searchDemand,
          competition: 0.5, // Durchschnittliche Competition
          opportunity,
          difficulty,
          priority: opportunity > 50 ? 8 : opportunity > 30 ? 5 : 2,
          estimatedTraffic: Math.floor(topicData.searchDemand * 0.25),
          estimatedRevenue: Math.floor(topicData.searchDemand * 0.25 * 120),
          contentSuggestions: topicData.contentSuggestions.map(sugg => ({
            title: sugg.title,
            type: sugg.type as any,
            wordCount: sugg.type === 'guide' ? 3000 : sugg.type === 'case-study' ? 2000 : 1500,
            keywords: topicData.subtopics,
            estimatedPerformance: sugg.estimatedTraffic / topicData.searchDemand * 100
          })),
          competitors: Object.entries(topicData.competitorCoverage).map(([domain, coverage]) => ({
            domain,
            rankingPages: Math.floor(coverage / 10),
            contentQuality: coverage
          })),
          detectedAt: new Date(),
          status: 'open'
        };

        this.contentGaps.set(gapId, gap);
      }
    }
  }

  private async analyzeCompetitorContent(): Promise<void> {
    // Simuliere Competitor-Analyse
    const competitors = ['competitor1.de', 'competitor2.de', 'solar-abc.de'];

    for (const competitor of competitors) {
      // Finde Keywords wo Competitor besser rankt
      for (const [keyword, keywordData] of this.keywordDatabase) {
        const competitorRanking = keywordData.competitorRankings.find(r => r.domain === competitor);

        if (competitorRanking && (!this.contentInventory.keywordCoverage[keyword]?.covered ||
            this.contentInventory.keywordCoverage[keyword].ranking > competitorRanking.position + 5)) {

          const gapId = `competitor-gap-${competitor}-${keyword.replace(/\s+/g, '-')}`;

          const gap: ContentGap = {
            id: gapId,
            type: 'competitor',
            title: `Competitor Gap: ${competitor} bei "${keyword}"`,
            description: `${competitor} rankt auf Position ${competitorRanking.position}, wir ${this.contentInventory.keywordCoverage[keyword]?.ranking || 'nicht in Top 20'}`,
            keywords: [keyword],
            searchVolume: keywordData.searchVolume,
            competition: keywordData.competition,
            opportunity: 75,
            difficulty: 'medium',
            priority: 7,
            estimatedTraffic: Math.floor(keywordData.searchVolume * 0.25),
            estimatedRevenue: Math.floor(keywordData.searchVolume * 0.25 * 140),
            contentSuggestions: [{
              title: `Besser als ${competitor}: ${keyword}`,
              type: 'blog',
              wordCount: 2000,
              keywords: [keyword, ...keywordData.relatedKeywords.slice(0, 2)],
              estimatedPerformance: 70
            }],
            competitors: [{
              domain: competitor,
              rankingPages: 1,
              contentQuality: competitorRanking.contentQuality
            }],
            detectedAt: new Date(),
            status: 'open'
          };

          this.contentGaps.set(gapId, gap);
        }
      }
    }
  }

  private async generateContentSuggestions(): Promise<void> {
    // Erweitere Content-Suggestions für bestehende Gaps
    for (const [gapId, gap] of this.contentGaps) {
      if (gap.contentSuggestions.length < 3) {
        // Generiere zusätzliche Suggestions mit KI
        const additionalSuggestions = await this.generateAISuggestions(gap);
        gap.contentSuggestions.push(...additionalSuggestions);
      }
    }
  }

  private async generateAISuggestions(gap: ContentGap): Promise<Array<{ title: string; type: string; wordCount: number; keywords: string[]; estimatedPerformance: number }>> {
    const suggestions = [];

    const prompt = `Generiere 2 Content-Ideen für das Thema "${gap.title}". Jede Idee sollte einen Titel, Content-Type (blog/guide/case-study) und Keywords enthalten. Fokussiere auf SEO-Optimierung.`;

    try {
      const aiResponse = await optimizeKeywords([prompt]);

      if (aiResponse && aiResponse.length > 0) {
        // Parse AI Response (simplified)
        suggestions.push({
          title: `Detaillierter Leitfaden: ${gap.keywords[0]}`,
          type: 'guide',
          wordCount: 2800,
          keywords: gap.keywords,
          estimatedPerformance: 75
        });

        suggestions.push({
          title: `Experten-Tipps zu ${gap.keywords[0]}`,
          type: 'blog',
          wordCount: 1600,
          keywords: gap.keywords.slice(0, 3),
          estimatedPerformance: 65
        });
      }
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    }

    return suggestions;
  }

  private async generateGapAnalysisReport(): Promise<void> {
    const reportId = `gap-report-${Date.now()}`;
    const allGaps = Array.from(this.contentGaps.values());

    // Gruppiere Gaps nach Typ und Difficulty
    const gapsByType: Record<string, ContentGap[]> = {};
    const gapsByDifficulty: Record<string, ContentGap[]> = { low: [], medium: [], high: [] };

    allGaps.forEach(gap => {
      if (!gapsByType[gap.type]) gapsByType[gap.type] = [];
      gapsByType[gap.type].push(gap);

      gapsByDifficulty[gap.difficulty].push(gap);
    });

    // Berechne Summary
    const highPriorityGaps = allGaps.filter(gap => gap.priority >= 7).length;
    const estimatedTrafficOpportunity = allGaps.reduce((sum, gap) => sum + gap.estimatedTraffic, 0);
    const estimatedRevenueOpportunity = allGaps.reduce((sum, gap) => sum + gap.estimatedRevenue, 0);

    // Top Opportunities
    const topOpportunities = allGaps
      .sort((a, b) => b.opportunity - a.opportunity)
      .slice(0, 10);

    // Content Recommendations
    const contentRecommendations = allGaps
      .filter(gap => gap.status === 'open')
      .map(gap => ({
        gapId: gap.id,
        contentType: gap.contentSuggestions[0]?.type || 'blog',
        priority: gap.priority,
        estimatedROI: gap.estimatedRevenue / 1000 // ROI in Tausend Euro
      }))
      .sort((a, b) => b.priority - a.priority);

    // Competitor Analysis
    const competitorAnalysis = {
      topCompetitors: [
        { domain: 'competitor1.de', sharedKeywords: 25, contentGaps: 18 },
        { domain: 'competitor2.de', sharedKeywords: 22, contentGaps: 15 },
        { domain: 'solar-abc.de', sharedKeywords: 20, contentGaps: 12 }
      ],
      competitiveAdvantages: [
        'Lokale Expertise in Agri-PV',
        'Umfassende Förderberatung',
        'Schnelle Reaktionszeiten'
      ],
      threats: [
        'Stärkere Online-Präsenz von Wettbewerbern',
        'Fehlende Content-Tiefe in einigen Bereichen',
        'Langsamere Content-Produktion'
      ]
    };

    const report: GapAnalysisReport = {
      id: reportId,
      generatedAt: new Date(),
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Letzte 30 Tage
        end: new Date()
      },
      summary: {
        totalGaps: allGaps.length,
        highPriorityGaps,
        estimatedTrafficOpportunity,
        estimatedRevenueOpportunity
      },
      gapsByType,
      gapsByDifficulty,
      topOpportunities,
      contentRecommendations,
      competitorAnalysis
    };

    this.analysisReports.set(reportId, report);
  }

  // ===== PUBLIC API =====

  public getContentGaps(type?: string, status?: string): ContentGap[] {
    let gaps = Array.from(this.contentGaps.values());

    if (type) {
      gaps = gaps.filter(gap => gap.type === type);
    }

    if (status) {
      gaps = gaps.filter(gap => gap.status === status);
    }

    return gaps.sort((a, b) => b.priority - a.priority);
  }

  public getContentGap(gapId: string): ContentGap | null {
    return this.contentGaps.get(gapId) || null;
  }

  public getContentInventory(): ContentInventory {
    return { ...this.contentInventory };
  }

  public getLatestGapAnalysisReport(): GapAnalysisReport | null {
    const reports = Array.from(this.analysisReports.values());
    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0] || null;
  }

  public getGapAnalysisReports(): GapAnalysisReport[] {
    return Array.from(this.analysisReports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  public async updateGapStatus(gapId: string, status: ContentGap['status']): Promise<void> {
    const gap = this.contentGaps.get(gapId);
    if (!gap) throw new Error(`Gap ${gapId} not found`);

    gap.status = status;
  }

  public async createContentFromGap(gapId: string, suggestionIndex: number = 0): Promise<string> {
    const gap = this.contentGaps.get(gapId);
    if (!gap) throw new Error(`Gap ${gapId} not found`);

    const suggestion = gap.contentSuggestions[suggestionIndex];
    if (!suggestion) throw new Error(`Suggestion ${suggestionIndex} not found for gap ${gapId}`);

    // Simuliere Content-Erstellung
    const contentId = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Markiere Gap als in-progress
    gap.status = 'in-progress';

    return contentId;
  }

  public getKeywordGaps(): KeywordGap[] {
    return Array.from(this.keywordDatabase.values());
  }

  public getTopicGaps(): TopicGap[] {
    return Array.from(this.topicDatabase.values());
  }

  public async addKeywordToMonitor(keyword: string, searchVolume: number, competition: number): Promise<void> {
    const keywordGap: KeywordGap = {
      keyword,
      searchVolume,
      competition,
      opportunity: this.calculateKeywordOpportunity({ keyword, searchVolume, competition } as any),
      intent: 'informational', // Default
      relatedKeywords: [],
      seasonal: false,
      trendDirection: 'stable',
      competitorRankings: []
    };

    this.keywordDatabase.set(keyword, keywordGap);
  }

  public stopGapAnalysis(): void {
    if (this.gapAnalysisInterval) {
      clearInterval(this.gapAnalysisInterval);
      this.gapAnalysisInterval = undefined;
    }
  }

  public startGapAnalysis(): void {
    if (!this.gapAnalysisInterval) {
      this.startGapAnalysis();
    }
  }
}

export const automatedContentGapAnalysisService = AutomatedContentGapAnalysisService.getInstance();
export default automatedContentGapAnalysisService;