import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localSEOAnalyticsService } from './localSEOAnalyticsService';
import { competitorLocalSEOAnalysisService } from './competitorLocalSEOAnalysisService';
import { advancedLocalSERPFeatureMonitoringService } from './advancedLocalSERPFeatureMonitoringService';

export interface LocalKeyword {
  id: string;
  keyword: string;
  locationKey: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high' | 'very_high';
  difficulty: number;
  cpc: number;
  intent: 'informational' | 'commercial' | 'navigational' | 'local';
  seasonality: {
    peak: string[];
    low: string[];
    score: number;
  };
  performance: {
    currentRanking: number;
    targetRanking: number;
    trend: 'improving' | 'stable' | 'declining';
    impressions: number;
    clicks: number;
    ctr: number;
  };
  relatedKeywords: string[];
  longTailVariants: string[];
  competitorKeywords: string[];
  lastUpdated: string;
}

export interface KeywordCluster {
  id: string;
  name: string;
  locationKey: string;
  theme: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  supportingKeywords: string[];
  pillarContent: {
    title: string;
    url: string;
    wordCount: number;
    internalLinks: number;
    externalLinks: number;
  };
  clusterContent: Array<{
    title: string;
    url: string;
    type: 'blog' | 'landing_page' | 'service_page' | 'location_page';
    primaryKeyword: string;
    secondaryKeywords: string[];
  }>;
  performance: {
    totalTraffic: number;
    avgPosition: number;
    conversionRate: number;
    backlinks: number;
  };
  optimizationStatus: 'optimized' | 'needs_work' | 'underperforming';
  createdAt: string;
  lastOptimized: string;
}

export interface DynamicKeywordInsertion {
  id: string;
  contentId: string;
  contentType: 'page' | 'blog_post' | 'meta' | 'schema' | 'internal_link';
  locationKey: string;
  originalContent: string;
  optimizedContent: string;
  keywordsInserted: Array<{
    keyword: string;
    position: number;
    context: string;
    density: number;
  }>;
  performance: {
    readabilityScore: number;
    keywordDensity: number;
    naturalLanguageScore: number;
    seoScore: number;
  };
  abTestResults?: {
    originalPerformance: number;
    optimizedPerformance: number;
    improvement: number;
    confidence: number;
  };
  appliedAt: string;
  results: {
    trafficChange: number;
    rankingChange: number;
    conversionChange: number;
  };
}

export interface KeywordOpportunity {
  id: string;
  keyword: string;
  locationKey: string;
  opportunityType: 'ranking_gap' | 'content_gap' | 'competitor_weakness' | 'seasonal_trend' | 'emerging_topic';
  potential: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTraffic: number;
  estimatedConversions: number;
  competitorAnalysis: {
    rankingCompetitors: number;
    contentCompetitors: number;
    avgCompetitorDomainAuthority: number;
    opportunityScore: number;
  };
  implementation: {
    contentType: 'blog_post' | 'landing_page' | 'service_page' | 'location_page';
    estimatedWordCount: number;
    internalLinkingOpportunities: number;
    externalLinkingOpportunities: number;
  };
  timeline: 'immediate' | 'short_term' | 'long_term';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface KeywordMapping {
  id: string;
  locationKey: string;
  pageUrl: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  lsiKeywords: string[];
  entityKeywords: string[];
  userIntentKeywords: string[];
  commercialIntentKeywords: string[];
  localModifierKeywords: string[];
  performance: {
    currentRanking: number;
    targetRanking: number;
    searchVolume: number;
    competitionLevel: number;
    opportunityScore: number;
  };
  contentOptimization: {
    titleOptimized: boolean;
    metaDescriptionOptimized: boolean;
    headingsOptimized: boolean;
    contentOptimized: boolean;
    internalLinksOptimized: boolean;
    schemaOptimized: boolean;
  };
  lastMapped: string;
  nextReview: string;
}

export interface KeywordPerformanceDashboard {
  locationKey: string;
  timeRange: {
    start: string;
    end: string;
  };
  overview: {
    totalKeywords: number;
    rankingKeywords: number;
    avgPosition: number;
    totalTraffic: number;
    totalConversions: number;
    keywordGrowth: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    traffic: number;
    conversions: number;
    trend: string;
  }>;
  keywordClusters: Array<{
    clusterId: string;
    name: string;
    keywords: number;
    traffic: number;
    performance: number;
  }>;
  opportunities: Array<{
    keyword: string;
    potential: number;
    difficulty: string;
    estimatedTraffic: number;
  }>;
  competitorInsights: Array<{
    competitor: string;
    sharedKeywords: number;
    rankingGap: number;
    opportunityKeywords: number;
  }>;
  recommendations: string[];
}

/**
 * Dynamic Local Keyword Integration Service
 * Dynamische Integration von lokalen Keywords in Content
 */
export class DynamicLocalKeywordIntegrationService {
  private localKeywords: Map<string, LocalKeyword[]> = new Map();
  private keywordClusters: Map<string, KeywordCluster[]> = new Map();
  private keywordMappings: Map<string, KeywordMapping[]> = new Map();
  private keywordOpportunities: Map<string, KeywordOpportunity[]> = new Map();
  private dynamicInsertions: Map<string, DynamicKeywordInsertion[]> = new Map();

  constructor() {
    this.initializeLocalKeywords();
    this.createKeywordClusters();
    this.generateKeywordMappings();
    this.identifyKeywordOpportunities();
    this.setupDynamicInsertionRules();
  }

  /**
   * Initialisiert lokale Keywords
   */
  private initializeLocalKeywords(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const keywords: LocalKeyword[] = [];

      // Basis-Keywords für jeden Standort
      const baseKeywords = [
        `solaranlage ${region.city}`,
        `photovoltaik ${region.city}`,
        `pv installation ${region.city}`,
        `solar ${region.city}`,
        `gewerbe solar ${region.city}`,
        `solaranlage installation ${region.city}`,
        `photovoltaik beratung ${region.city}`,
        `solaranlage kosten ${region.city}`,
        `pv anlage ${region.city}`,
        `solartechnik ${region.city}`
      ];

      baseKeywords.forEach((keyword, index) => {
        const searchVolume = 500 + Math.floor(Math.random() * 2000); // 500-2500
        const competition = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
        const difficulty = 20 + Math.floor(Math.random() * 60); // 20-80

        const keywordData: LocalKeyword = {
          id: `kw_${locationKey}_${index}`,
          keyword,
          locationKey,
          searchVolume,
          competition,
          difficulty,
          cpc: 5 + Math.random() * 15, // 5-20€
          intent: Math.random() > 0.7 ? 'commercial' : Math.random() > 0.5 ? 'informational' : 'local',
          seasonality: {
            peak: ['März', 'April', 'Mai'],
            low: ['Dezember', 'Januar'],
            score: 0.6 + Math.random() * 0.4
          },
          performance: {
            currentRanking: Math.floor(Math.random() * 20) + 1,
            targetRanking: 5,
            trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as 'improving' | 'stable' | 'declining',
            impressions: searchVolume * 0.3,
            clicks: searchVolume * 0.03,
            ctr: 0.03 + Math.random() * 0.05
          },
          relatedKeywords: [
            `${keyword} preise`,
            `${keyword} förderung`,
            `${keyword} wartung`
          ],
          longTailVariants: [
            `professionelle ${keyword}`,
            `${keyword} für häuser`,
            `${keyword} mit speicher`
          ],
          competitorKeywords: [
            `solaranlage ${region.city} günstig`,
            `beste ${keyword}`,
            `${keyword} erfahrung`
          ],
          lastUpdated: new Date().toISOString()
        };

        keywords.push(keywordData);
      });

      this.localKeywords.set(locationKey, keywords);
    });
  }

  /**
   * Erstellt Keyword-Cluster
   */
  private createKeywordClusters(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const clusters: KeywordCluster[] = [];

      // Solaranlagen-Cluster
      clusters.push({
        id: `cluster_solar_${locationKey}`,
        name: `Solaranlagen ${region.city}`,
        locationKey,
        theme: 'solar_installation',
        primaryKeyword: `solaranlage ${region.city}`,
        secondaryKeywords: [
          `photovoltaik ${region.city}`,
          `pv anlage ${region.city}`,
          `solar installation ${region.city}`
        ],
        longTailKeywords: [
          `solaranlage installation ${region.city}`,
          `photovoltaik beratung ${region.city}`,
          `pv anlage kosten ${region.city}`
        ],
        supportingKeywords: [
          'förderung',
          'wartung',
          'speicher',
          'wechselrichter'
        ],
        pillarContent: {
          title: `Alles über Solaranlagen in ${region.city}`,
          url: `/solaranlagen-${locationKey}`,
          wordCount: 2500,
          internalLinks: 15,
          externalLinks: 8
        },
        clusterContent: [
          {
            title: `Solaranlage Kosten ${region.city} 2024`,
            url: `/solaranlage-kosten-${locationKey}`,
            type: 'blog_post',
            primaryKeyword: `solaranlage kosten ${region.city}`,
            secondaryKeywords: ['photovoltaik preise', 'pv installation kosten']
          },
          {
            title: `Förderungen für Solaranlagen ${region.city}`,
            url: `/foerderungen-solar-${locationKey}`,
            type: 'blog_post',
            primaryKeyword: `solaranlage förderung ${region.city}`,
            secondaryKeywords: ['kfw förderung', 'eeg vergütung']
          }
        ],
        performance: {
          totalTraffic: 2500,
          avgPosition: 8.5,
          conversionRate: 0.025,
          backlinks: 45
        },
        optimizationStatus: 'optimized',
        createdAt: new Date().toISOString(),
        lastOptimized: new Date().toISOString()
      });

      // Wartung-Cluster
      clusters.push({
        id: `cluster_maintenance_${locationKey}`,
        name: `Solaranlagen-Wartung ${region.city}`,
        locationKey,
        theme: 'solar_maintenance',
        primaryKeyword: `solaranlage wartung ${region.city}`,
        secondaryKeywords: [
          `pv wartung ${region.city}`,
          `solar service ${region.city}`,
          `photovoltaik inspektion ${region.city}`
        ],
        longTailKeywords: [
          `jährliche solaranlage wartung ${region.city}`,
          `pv anlage reinigung ${region.city}`,
          `solar panel wartung kosten ${region.city}`
        ],
        supportingKeywords: [
          'inspektion',
          'reinigung',
          'reparatur',
          'garantie'
        ],
        pillarContent: {
          title: `Solaranlagen-Wartung in ${region.city} - Komplette Anleitung`,
          url: `/solaranlagen-wartung-${locationKey}`,
          wordCount: 1800,
          internalLinks: 12,
          externalLinks: 5
        },
        clusterContent: [
          {
            title: `Wartungsvertrag Solaranlage ${region.city}`,
            url: `/wartungsvertrag-solar-${locationKey}`,
            type: 'service_page',
            primaryKeyword: `wartungsvertrag solaranlage ${region.city}`,
            secondaryKeywords: ['pv wartung vertrag', 'solar service vertrag']
          }
        ],
        performance: {
          totalTraffic: 1200,
          avgPosition: 12.3,
          conversionRate: 0.015,
          backlinks: 23
        },
        optimizationStatus: 'needs_work',
        createdAt: new Date().toISOString(),
        lastOptimized: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      this.keywordClusters.set(locationKey, clusters);
    });
  }

  /**
   * Generiert Keyword-Mappings
   */
  private generateKeywordMappings(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const mappings: KeywordMapping[] = [];

      // Mapping für Hauptseiten
      mappings.push({
        id: `mapping_home_${locationKey}`,
        locationKey,
        pageUrl: `/standort/${locationKey}`,
        primaryKeyword: `solaranlage ${region.city}`,
        secondaryKeywords: [
          `photovoltaik ${region.city}`,
          `pv installation ${region.city}`
        ],
        longTailKeywords: [
          `professionelle solaranlage ${region.city}`,
          `solaranlage mit speicher ${region.city}`
        ],
        lsiKeywords: [
          'förderung',
          'beratung',
          'installation',
          'wartung'
        ],
        entityKeywords: [
          'ZOE Solar GmbH',
          region.city,
          'Photovoltaik'
        ],
        userIntentKeywords: [
          'kosten',
          'preise',
          'förderung',
          'anbieter'
        ],
        commercialIntentKeywords: [
          'angebot',
          'beratung',
          'termin',
          'installation'
        ],
        localModifierKeywords: [
          'in der nähe',
          'lokal',
          region.city,
          'umgebung'
        ],
        performance: {
          currentRanking: 5,
          targetRanking: 3,
          searchVolume: 1200,
          competitionLevel: 35,
          opportunityScore: 75
        },
        contentOptimization: {
          titleOptimized: true,
          metaDescriptionOptimized: true,
          headingsOptimized: true,
          contentOptimized: true,
          internalLinksOptimized: true,
          schemaOptimized: true
        },
        lastMapped: new Date().toISOString(),
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Mapping für Service-Seiten
      mappings.push({
        id: `mapping_installation_${locationKey}`,
        locationKey,
        pageUrl: `/dienstleistungen/solaranlage-installation-${locationKey}`,
        primaryKeyword: `solaranlage installation ${region.city}`,
        secondaryKeywords: [
          `pv installation ${region.city}`,
          `photovoltaik montage ${region.city}`
        ],
        longTailKeywords: [
          `professionelle solaranlage installation ${region.city}`,
          `pv anlage installation mit speicher ${region.city}`
        ],
        lsiKeywords: [
          'montage',
          'anschluss',
          'prüfung',
          'garantie'
        ],
        entityKeywords: [
          'Solaranlage',
          'Installation',
          'Fachbetrieb'
        ],
        userIntentKeywords: [
          'wie lange',
          'kosten',
          'ablauf',
          'garantie'
        ],
        commercialIntentKeywords: [
          'angebot',
          'termin',
          'beratung',
          'auftrag'
        ],
        localModifierKeywords: [
          region.city,
          'regional',
          'lokal',
          'erfahrung'
        ],
        performance: {
          currentRanking: 8,
          targetRanking: 5,
          searchVolume: 800,
          competitionLevel: 45,
          opportunityScore: 65
        },
        contentOptimization: {
          titleOptimized: true,
          metaDescriptionOptimized: false,
          headingsOptimized: true,
          contentOptimized: true,
          internalLinksOptimized: false,
          schemaOptimized: true
        },
        lastMapped: new Date().toISOString(),
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      this.keywordMappings.set(locationKey, mappings);
    });
  }

  /**
   * Identifiziert Keyword-Opportunities
   */
  private identifyKeywordOpportunities(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const opportunities: KeywordOpportunity[] = [];

      // Ranking Gap Opportunities
      opportunities.push({
        id: `opp_ranking_gap_${locationKey}_1`,
        keyword: `solaranlage günstig ${region.city}`,
        locationKey,
        opportunityType: 'ranking_gap',
        potential: 85,
        difficulty: 'medium',
        estimatedTraffic: 650,
        estimatedConversions: 26,
        competitorAnalysis: {
          rankingCompetitors: 3,
          contentCompetitors: 8,
          avgCompetitorDomainAuthority: 45,
          opportunityScore: 78
        },
        implementation: {
          contentType: 'landing_page',
          estimatedWordCount: 1200,
          internalLinkingOpportunities: 5,
          externalLinkingOpportunities: 3
        },
        timeline: 'short_term',
        priority: 'high',
        createdAt: new Date().toISOString()
      });

      // Content Gap Opportunities
      opportunities.push({
        id: `opp_content_gap_${locationKey}_1`,
        keyword: `solaranlage mit speicher ${region.city}`,
        locationKey,
        opportunityType: 'content_gap',
        potential: 70,
        difficulty: 'medium',
        estimatedTraffic: 480,
        estimatedConversions: 19,
        competitorAnalysis: {
          rankingCompetitors: 1,
          contentCompetitors: 2,
          avgCompetitorDomainAuthority: 35,
          opportunityScore: 82
        },
        implementation: {
          contentType: 'blog_post',
          estimatedWordCount: 1800,
          internalLinkingOpportunities: 8,
          externalLinkingOpportunities: 5
        },
        timeline: 'short_term',
        priority: 'high',
        createdAt: new Date().toISOString()
      });

      // Seasonal Opportunities
      opportunities.push({
        id: `opp_seasonal_${locationKey}_1`,
        keyword: `solaranlage frühlingsaktion ${region.city}`,
        locationKey,
        opportunityType: 'seasonal_trend',
        potential: 60,
        difficulty: 'easy',
        estimatedTraffic: 320,
        estimatedConversions: 22,
        competitorAnalysis: {
          rankingCompetitors: 0,
          contentCompetitors: 1,
          avgCompetitorDomainAuthority: 25,
          opportunityScore: 90
        },
        implementation: {
          contentType: 'landing_page',
          estimatedWordCount: 800,
          internalLinkingOpportunities: 3,
          externalLinkingOpportunities: 2
        },
        timeline: 'immediate',
        priority: 'medium',
        createdAt: new Date().toISOString()
      });

      this.keywordOpportunities.set(locationKey, opportunities);
    });
  }

  /**
   * Richtet dynamische Insertion-Regeln ein
   */
  private setupDynamicInsertionRules(): void {
    // Beispielhafte dynamische Insertions werden bei Bedarf generiert
  }

  /**
   * Optimiert Content mit lokalen Keywords
   */
  public optimizeContentWithKeywords(
    contentId: string,
    contentType: 'page' | 'blog_post' | 'meta' | 'schema',
    locationKey: string,
    originalContent: string,
    targetKeywords?: string[]
  ): DynamicKeywordInsertion {
    const keywords = targetKeywords || this.getRelevantKeywords(locationKey, contentType);

    // Analysiere original Content
    const originalAnalysis = this.analyzeContent(originalContent);

    // Generiere optimierten Content
    const optimizedContent = this.generateOptimizedContent(originalContent, keywords, locationKey);

    // Analysiere optimierten Content
    const optimizedAnalysis = this.analyzeContent(optimizedContent);

    // Identifiziere eingefügte Keywords
    const keywordsInserted = this.identifyInsertedKeywords(originalContent, optimizedContent, keywords);

    // Berechne Performance-Metriken
    const performance = this.calculateContentPerformance(originalAnalysis, optimizedAnalysis);

    const insertion: DynamicKeywordInsertion = {
      id: `insertion_${contentId}_${Date.now()}`,
      contentId,
      contentType,
      locationKey,
      originalContent,
      optimizedContent,
      keywordsInserted,
      performance,
      appliedAt: new Date().toISOString(),
      results: {
        trafficChange: 0, // Wird später aktualisiert
        rankingChange: 0,
        conversionChange: 0
      }
    };

    // Speichere Insertion
    const locationInsertions = this.dynamicInsertions.get(locationKey) || [];
    locationInsertions.push(insertion);
    this.dynamicInsertions.set(locationKey, locationInsertions);

    return insertion;
  }

  /**
   * Holt relevante Keywords für Standort und Content-Typ
   */
  private getRelevantKeywords(locationKey: string, contentType: string): string[] {
    const keywords = this.localKeywords.get(locationKey) || [];
    const mappings = this.keywordMappings.get(locationKey) || [];

    // Sammle Keywords basierend auf Content-Typ
    const relevantKeywords: string[] = [];

    mappings.forEach(mapping => {
      if (contentType === 'page' && mapping.pageUrl.includes('/standort/')) {
        relevantKeywords.push(mapping.primaryKeyword, ...mapping.secondaryKeywords);
      } else if (contentType === 'blog_post' && mapping.pageUrl.includes('/blog/')) {
        relevantKeywords.push(...mapping.longTailKeywords);
      }
    });

    // Fallback zu allgemeinen Keywords
    if (relevantKeywords.length === 0) {
      relevantKeywords.push(...keywords.slice(0, 5).map(k => k.keyword));
    }

    return [...new Set(relevantKeywords)]; // Duplikate entfernen
  }

  /**
   * Analysiert Content
   */
  private analyzeContent(content: string): {
    wordCount: number;
    keywordDensity: { [keyword: string]: number };
    readabilityScore: number;
    naturalLanguageScore: number;
  } {
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = words.length;

    // Vereinfachte Analyse
    const keywordDensity: { [keyword: string]: number } = {};
    const readabilityScore = Math.min(100, Math.max(0, 60 + Math.random() * 30));
    const naturalLanguageScore = Math.min(100, Math.max(0, 70 + Math.random() * 25));

    return {
      wordCount,
      keywordDensity,
      readabilityScore,
      naturalLanguageScore
    };
  }

  /**
   * Generiert optimierten Content
   */
  private generateOptimizedContent(originalContent: string, keywords: string[], locationKey: string): string {
    let optimizedContent = originalContent;

    // Natürliche Keyword-Integration
    keywords.forEach(keyword => {
      if (!optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
        // Finde geeignete Stellen für Keyword-Integration
        const sentences = optimizedContent.split(/[.!?]+/);

        // Füge Keyword in eine geeignete Stelle ein
        if (sentences.length > 2) {
          const insertIndex = Math.floor(sentences.length / 2);
          const insertPosition = optimizedContent.indexOf(sentences[insertIndex]);

          if (insertPosition > 0) {
            const before = optimizedContent.substring(0, insertPosition);
            const after = optimizedContent.substring(insertPosition);

            // Natürliche Integration
            optimizedContent = before + ` Erfahren Sie mehr über ${keyword}. ` + after;
          }
        }
      }
    });

    return optimizedContent;
  }

  /**
   * Identifiziert eingefügte Keywords
   */
  private identifyInsertedKeywords(
    original: string,
    optimized: string,
    keywords: string[]
  ): DynamicKeywordInsertion['keywordsInserted'] {
    const inserted: DynamicKeywordInsertion['keywordsInserted'] = [];

    keywords.forEach(keyword => {
      const originalCount = (original.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      const optimizedCount = (optimized.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;

      if (optimizedCount > originalCount) {
        const position = optimized.toLowerCase().indexOf(keyword.toLowerCase());
        const context = this.getContextAroundPosition(optimized, position, 50);

        inserted.push({
          keyword,
          position,
          context,
          density: optimizedCount / optimized.split(/\s+/).length
        });
      }
    });

    return inserted;
  }

  /**
   * Holt Kontext um Position
   */
  private getContextAroundPosition(text: string, position: number, radius: number): string {
    const start = Math.max(0, position - radius);
    const end = Math.min(text.length, position + radius);
    return text.substring(start, end);
  }

  /**
   * Berechnet Content-Performance
   */
  private calculateContentPerformance(
    original: any,
    optimized: any
  ): DynamicKeywordInsertion['performance'] {
    return {
      readabilityScore: optimized.readabilityScore,
      keywordDensity: Object.values(optimized.keywordDensity).reduce((sum, density) => sum + density, 0),
      naturalLanguageScore: optimized.naturalLanguageScore,
      seoScore: Math.min(100, Math.max(0, 50 + Math.random() * 40))
    };
  }

  /**
   * Ruft lokale Keywords ab
   */
  public getLocalKeywords(locationKey: string): LocalKeyword[] {
    return this.localKeywords.get(locationKey) || [];
  }

  /**
   * Ruft Keyword-Cluster ab
   */
  public getKeywordClusters(locationKey: string): KeywordCluster[] {
    return this.keywordClusters.get(locationKey) || [];
  }

  /**
   * Ruft Keyword-Mappings ab
   */
  public getKeywordMappings(locationKey: string): KeywordMapping[] {
    return this.keywordMappings.get(locationKey) || [];
  }

  /**
   * Ruft Keyword-Opportunities ab
   */
  public getKeywordOpportunities(locationKey: string): KeywordOpportunity[] {
    return this.keywordOpportunities.get(locationKey) || [];
  }

  /**
   * Führt Keyword-Recherche durch
   */
  public performKeywordResearch(locationKey: string, seedKeywords: string[]): {
    discoveredKeywords: LocalKeyword[];
    keywordClusters: KeywordCluster[];
    opportunities: KeywordOpportunity[];
    competitorAnalysis: any;
    recommendations: string[];
  } {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) throw new Error(`Region ${locationKey} not found`);

    // Simuliere Keyword-Recherche
    const discoveredKeywords: LocalKeyword[] = seedKeywords.map((seed, index) => ({
      id: `discovered_${locationKey}_${index}`,
      keyword: `${seed} ${region.city}`,
      locationKey,
      searchVolume: 200 + Math.floor(Math.random() * 800),
      competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      difficulty: 15 + Math.floor(Math.random() * 50),
      cpc: 3 + Math.random() * 12,
      intent: ['informational', 'commercial', 'local'][Math.floor(Math.random() * 3)] as any,
      seasonality: {
        peak: ['März', 'April'],
        low: ['Dezember', 'Januar'],
        score: 0.5 + Math.random() * 0.4
      },
      performance: {
        currentRanking: Math.floor(Math.random() * 30) + 1,
        targetRanking: 10,
        trend: 'stable',
        impressions: 0,
        clicks: 0,
        ctr: 0
      },
      relatedKeywords: [`${seed} preise`, `${seed} anbieter`],
      longTailVariants: [`professionelle ${seed}`, `${seed} mit garantie`],
      competitorKeywords: [`günstige ${seed}`, `beste ${seed}`],
      lastUpdated: new Date().toISOString()
    }));

    // Erstelle Cluster aus discovered Keywords
    const keywordClusters = this.createClustersFromKeywords(discoveredKeywords, locationKey);

    // Analysiere Opportunities
    const opportunities = this.analyzeKeywordOpportunities(discoveredKeywords, locationKey);

    // Competitor-Analyse
    const competitorAnalysis = competitorLocalSEOAnalysisService.getCompetitorSEOProfile('comp_001', locationKey);

    const recommendations = [
      'Erstelle Pillar-Content für Top-Keywords',
      'Optimiere Long-Tail-Keywords für schnelle Rankings',
      'Bauen Sie interne Verlinkung auf',
      'Überwache saisonale Trends'
    ];

    return {
      discoveredKeywords,
      keywordClusters,
      opportunities,
      competitorAnalysis,
      recommendations
    };
  }

  /**
   * Erstellt Cluster aus Keywords
   */
  private createClustersFromKeywords(keywords: LocalKeyword[], locationKey: string): KeywordCluster[] {
    // Vereinfachte Cluster-Erstellung
    const clusters: KeywordCluster[] = [];
    const themes = ['solar_installation', 'solar_maintenance', 'solar_financing'];

    themes.forEach(theme => {
      const themeKeywords = keywords.filter(k => k.keyword.includes(theme.split('_')[1]));

      if (themeKeywords.length > 0) {
        clusters.push({
          id: `cluster_${theme}_${locationKey}`,
          name: `${theme.replace('_', ' ')} ${locationKey}`,
          locationKey,
          theme,
          primaryKeyword: themeKeywords[0].keyword,
          secondaryKeywords: themeKeywords.slice(1, 4).map(k => k.keyword),
          longTailKeywords: themeKeywords.slice(4).map(k => k.keyword),
          supportingKeywords: ['kosten', 'förderung', 'beratung'],
          pillarContent: {
            title: `Alles über ${theme} in ${locationKey}`,
            url: `/${theme}-${locationKey}`,
            wordCount: 2000,
            internalLinks: 10,
            externalLinks: 5
          },
          clusterContent: [],
          performance: {
            totalTraffic: themeKeywords.reduce((sum, k) => sum + k.searchVolume * 0.02, 0),
            avgPosition: 15,
            conversionRate: 0.02,
            backlinks: 5
          },
          optimizationStatus: 'needs_work',
          createdAt: new Date().toISOString(),
          lastOptimized: new Date().toISOString()
        });
      }
    });

    return clusters;
  }

  /**
   * Analysiert Keyword-Opportunities
   */
  private analyzeKeywordOpportunities(keywords: LocalKeyword[], locationKey: string): KeywordOpportunity[] {
    return keywords
      .filter(k => k.competition === 'low' && k.searchVolume > 300)
      .map(k => ({
        id: `opp_${k.id}`,
        keyword: k.keyword,
        locationKey,
        opportunityType: 'ranking_gap' as const,
        potential: Math.min(100, k.searchVolume / 10),
        difficulty: 'easy' as const,
        estimatedTraffic: k.searchVolume * 0.03,
        estimatedConversions: k.searchVolume * 0.03 * 0.02,
        competitorAnalysis: {
          rankingCompetitors: Math.floor(Math.random() * 3),
          contentCompetitors: Math.floor(Math.random() * 5),
          avgCompetitorDomainAuthority: 30 + Math.random() * 30,
          opportunityScore: 70 + Math.random() * 25
        },
        implementation: {
          contentType: 'blog_post' as const,
          estimatedWordCount: 1200 + Math.floor(Math.random() * 800),
          internalLinkingOpportunities: 3 + Math.floor(Math.random() * 5),
          externalLinkingOpportunities: 1 + Math.floor(Math.random() * 3)
        },
        timeline: 'short_term' as const,
        priority: 'medium' as const,
        createdAt: new Date().toISOString()
      }));
  }

  /**
   * Optimiert Keyword-Cluster
   */
  public optimizeKeywordCluster(clusterId: string, locationKey: string): {
    cluster: KeywordCluster;
    optimizations: Array<{
      type: 'content' | 'linking' | 'technical';
      action: string;
      impact: number;
      effort: string;
    }>;
    expectedResults: {
      trafficIncrease: number;
      rankingImprovement: number;
      conversionIncrease: number;
    };
  } {
    const clusters = this.keywordClusters.get(locationKey) || [];
    const cluster = clusters.find(c => c.id === clusterId);

    if (!cluster) throw new Error(`Cluster ${clusterId} not found`);

    const optimizations = [
      {
        type: 'content' as const,
        action: 'Erweitere Pillar-Content um 500 Wörter',
        impact: 20,
        effort: 'medium'
      },
      {
        type: 'linking' as const,
        action: 'Füge 5 interne Links hinzu',
        impact: 15,
        effort: 'low'
      },
      {
        type: 'technical' as const,
        action: 'Optimiere Meta-Tags für alle Cluster-Seiten',
        impact: 10,
        effort: 'low'
      }
    ];

    const expectedResults = {
      trafficIncrease: cluster.performance.totalTraffic * 0.25,
      rankingImprovement: 2.5,
      conversionIncrease: cluster.performance.conversionRate * 0.3
    };

    // Aktualisiere Cluster
    cluster.lastOptimized = new Date().toISOString();
    cluster.optimizationStatus = 'optimized';

    return {
      cluster,
      optimizations,
      expectedResults
    };
  }

  /**
   * Ruft Performance-Dashboard ab
   */
  public getKeywordPerformanceDashboard(locationKey: string): KeywordPerformanceDashboard {
    const keywords = this.getLocalKeywords(locationKey);
    const clusters = this.getKeywordClusters(locationKey);
    const opportunities = this.getKeywordOpportunities(locationKey);

    const totalKeywords = keywords.length;
    const rankingKeywords = keywords.filter(k => k.performance.currentRanking <= 20).length;
    const avgPosition = keywords.reduce((sum, k) => sum + k.performance.currentRanking, 0) / totalKeywords;
    const totalTraffic = keywords.reduce((sum, k) => sum + k.performance.clicks, 0);
    const totalConversions = Math.floor(totalTraffic * 0.02);
    const keywordGrowth = 12.5; // Beispielwert

    const topKeywords = keywords
      .sort((a, b) => b.performance.clicks - a.performance.clicks)
      .slice(0, 10)
      .map(k => ({
        keyword: k.keyword,
        position: k.performance.currentRanking,
        traffic: k.performance.clicks,
        conversions: Math.floor(k.performance.clicks * 0.02),
        trend: k.performance.trend
      }));

    const keywordClusters = clusters.map(c => ({
      clusterId: c.id,
      name: c.name,
      keywords: c.secondaryKeywords.length + c.longTailKeywords.length + 1,
      traffic: c.performance.totalTraffic,
      performance: c.performance.avgPosition
    }));

    const topOpportunities = opportunities
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 5)
      .map(o => ({
        keyword: o.keyword,
        potential: o.potential,
        difficulty: o.difficulty,
        estimatedTraffic: o.estimatedTraffic
      }));

    const competitorInsights = [
      {
        competitor: 'SolarTech Berlin GmbH',
        sharedKeywords: 8,
        rankingGap: 3.2,
        opportunityKeywords: 5
      },
      {
        competitor: 'GreenEnergy Hamburg',
        sharedKeywords: 6,
        rankingGap: 2.8,
        opportunityKeywords: 3
      }
    ];

    const recommendations = [
      'Fokussiere dich auf Long-Tail-Keywords für schnellere Rankings',
      'Erweitere Content-Cluster um interne Verlinkung',
      'Überwache saisonale Keyword-Trends',
      'Optimiere für lokale Suchintentionen'
    ];

    return {
      locationKey,
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },
      overview: {
        totalKeywords,
        rankingKeywords,
        avgPosition: Math.round(avgPosition * 10) / 10,
        totalTraffic: Math.round(totalTraffic),
        totalConversions,
        keywordGrowth
      },
      topKeywords,
      keywordClusters,
      opportunities: topOpportunities,
      competitorInsights,
      recommendations
    };
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalKeywords: number;
    totalClusters: number;
    totalOpportunities: number;
    avgKeywordPerformance: number;
    topPerformingLocations: Array<{
      location: string;
      keywords: number;
      avgPosition: number;
      traffic: number;
    }>;
    keywordTrends: Array<{
      trend: string;
      keywords: number;
      impact: string;
    }>;
    optimizationOpportunities: Array<{
      location: string;
      opportunities: number;
      potentialTraffic: number;
    }>;
  } {
    const allKeywords = Array.from(this.localKeywords.values()).flat();
    const allClusters = Array.from(this.keywordClusters.values()).flat();
    const allOpportunities = Array.from(this.keywordOpportunities.values()).flat();

    const totalKeywords = allKeywords.length;
    const totalClusters = allClusters.length;
    const totalOpportunities = allOpportunities.length;
    const avgKeywordPerformance = allKeywords.reduce((sum, k) => sum + (21 - k.performance.currentRanking), 0) / totalKeywords;

    // Top performing Locations
    const locationPerformance = PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      const keywords = this.getLocalKeywords(locationKey);
      const avgPosition = keywords.reduce((sum, k) => sum + k.performance.currentRanking, 0) / keywords.length;
      const traffic = keywords.reduce((sum, k) => sum + k.performance.clicks, 0);

      return {
        location: locationKey,
        keywords: keywords.length,
        avgPosition: Math.round(avgPosition * 10) / 10,
        traffic: Math.round(traffic)
      };
    }).sort((a, b) => a.avgPosition - b.avgPosition).slice(0, 5);

    // Keyword Trends
    const keywordTrends = [
      {
        trend: 'improving',
        keywords: allKeywords.filter(k => k.performance.trend === 'improving').length,
        impact: 'positive'
      },
      {
        trend: 'stable',
        keywords: allKeywords.filter(k => k.performance.trend === 'stable').length,
        impact: 'neutral'
      },
      {
        trend: 'declining',
        keywords: allKeywords.filter(k => k.performance.trend === 'declining').length,
        impact: 'negative'
      }
    ];

    // Optimization Opportunities
    const optimizationOpportunities = PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      const opportunities = this.getKeywordOpportunities(locationKey);
      const potentialTraffic = opportunities.reduce((sum, o) => sum + o.estimatedTraffic, 0);

      return {
        location: locationKey,
        opportunities: opportunities.length,
        potentialTraffic: Math.round(potentialTraffic)
      };
    }).sort((a, b) => b.potentialTraffic - a.potentialTraffic).slice(0, 5);

    return {
      totalKeywords,
      totalClusters,
      totalOpportunities,
      avgKeywordPerformance: Math.round(avgKeywordPerformance * 10) / 10,
      topPerformingLocations: locationPerformance,
      keywordTrends,
      optimizationOpportunities
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const dynamicLocalKeywordIntegrationService = new DynamicLocalKeywordIntegrationService();