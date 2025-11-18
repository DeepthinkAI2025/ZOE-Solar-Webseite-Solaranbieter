const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent(...args);
};
import { serpFeatureOptimizer } from './SerpFeatureOptimizer';
import { userIntentClassifier } from './UserIntentClassifier';

export interface ContentGap {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  competitorRanking: number;
  ourRanking: number;
  opportunity: 'high' | 'medium' | 'low';
  contentType: 'blog' | 'landing' | 'product' | 'faq';
  recommendedActions: string[];
}

export interface CompetitorAnalysis {
  domain: string;
  contentLength: number;
  keywordCoverage: number;
  backlinks: number;
  domainAuthority: number;
  contentFreshness: number;
  serpFeatures: string[];
}

export interface ContentRecommendation {
  title: string;
  contentType: string;
  targetKeywords: string[];
  estimatedWordCount: number;
  priority: 'high' | 'medium' | 'low';
  expectedTraffic: number;
  timeToRank: string;
  structuredData: object;
}

export class ContentGapAnalyzer {
  private static instance: ContentGapAnalyzer;
  private gapCache: Map<string, ContentGap[]> = new Map();
  private competitorCache: Map<string, CompetitorAnalysis[]> = new Map();

  private constructor() {}

  static getInstance(): ContentGapAnalyzer {
    if (!ContentGapAnalyzer.instance) {
      ContentGapAnalyzer.instance = new ContentGapAnalyzer();
    }
    return ContentGapAnalyzer.instance;
  }

  async analyzeContentGaps(
    primaryKeywords: string[],
    competitors: string[] = ['enpal.de', 'sonnenrepublik.de', 'eigensonne.de']
  ): Promise<ContentGap[]> {
    const cacheKey = primaryKeywords.join(',');
    
    if (this.gapCache.has(cacheKey)) {
      return this.gapCache.get(cacheKey)!;
    }

    try {
      const gaps: ContentGap[] = [];
      
      // Analyze each keyword for gaps
      for (const keyword of primaryKeywords) {
        const keywordGaps = await this.analyzeKeywordGap(keyword, competitors);
        gaps.push(...keywordGaps);
      }

      // AI-enhanced gap analysis
      const enhancedGaps = await this.enhanceGapAnalysis(gaps);
      
      // Sort by opportunity
      enhancedGaps.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.opportunity] - priorityOrder[a.opportunity];
      });

      this.gapCache.set(cacheKey, enhancedGaps);
      return enhancedGaps;

    } catch (error) {
      console.error('Content gap analysis failed:', error);
      return this.generateFallbackGaps(primaryKeywords);
    }
  }

  private async analyzeKeywordGap(
    keyword: string,
    competitors: string[]
  ): Promise<ContentGap[]> {
    // Mock competitor analysis - in real implementation, this would use SEO APIs
    const gaps: ContentGap[] = [];
    
    // Generate related keywords that competitors might be ranking for
    const relatedKeywords = await this.findRelatedKeywords(keyword);
    
    for (const relatedKeyword of relatedKeywords) {
      // Mock analysis - in production, use tools like SEMrush, Ahrefs APIs
      const gap: ContentGap = {
        keyword: relatedKeyword,
        searchVolume: Math.floor(Math.random() * 10000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        competitorRanking: Math.floor(Math.random() * 10) + 1,
        ourRanking: Math.floor(Math.random() * 50) + 11, // We're not in top 10
        opportunity: this.calculateOpportunity(relatedKeyword),
        contentType: this.determineContentType(relatedKeyword),
        recommendedActions: this.generateRecommendedActions(relatedKeyword)
      };

      gaps.push(gap);
    }

    return gaps;
  }

  private async findRelatedKeywords(keyword: string): Promise<string[]> {
    try {
      const prompt = `
        Finde 10-15 verwandte Keywords für: "${keyword}"
        
        Fokus auf Solarenergie/Photovoltaik-Themen.
        
        Berücksichtige:
        - Long-tail Keywords
        - Lokale Variationen
        - Kaufintentionen
        - Informationssuche
        - Vergleiche und Reviews
        
        Antworte nur mit einem JSON Array:
        ["keyword 1", "keyword 2", ...]
      `;

      const response = await optimizeKeywords(prompt);
      
      if (Array.isArray(response)) {
        return response.slice(0, 15);
      }
      
      return this.generateFallbackKeywords(keyword);
      
    } catch (error) {
      console.warn('Related keywords generation failed:', error);
      return this.generateFallbackKeywords(keyword);
    }
  }

  private generateFallbackKeywords(keyword: string): string[] {
    const templates = [
      `${keyword} kosten`,
      `${keyword} vergleich`,
      `${keyword} test`,
      `${keyword} erfahrungen`,
      `${keyword} anbieter`,
      `${keyword} installation`,
      `${keyword} förderung`,
      `beste ${keyword}`,
      `günstige ${keyword}`,
      `${keyword} beratung`
    ];

    return templates.slice(0, 10);
  }

  private calculateOpportunity(keyword: string): 'high' | 'medium' | 'low' {
    // Simplified opportunity calculation
    const commercialTerms = ['kosten', 'preis', 'angebot', 'kaufen', 'installation'];
    const informationalTerms = ['was ist', 'wie funktioniert', 'vorteile', 'nachteile'];
    
    if (commercialTerms.some(term => keyword.includes(term))) {
      return 'high';
    } else if (informationalTerms.some(term => keyword.includes(term))) {
      return 'medium';
    }
    
    return 'low';
  }

  private determineContentType(keyword: string): 'blog' | 'landing' | 'product' | 'faq' {
    if (keyword.includes('kosten') || keyword.includes('preis') || keyword.includes('angebot')) {
      return 'landing';
    } else if (keyword.includes('vergleich') || keyword.includes('test') || keyword.includes('beste')) {
      return 'product';
    } else if (keyword.includes('was ist') || keyword.includes('wie') || keyword.includes('warum')) {
      return 'faq';
    }
    
    return 'blog';
  }

  private generateRecommendedActions(keyword: string): string[] {
    const contentType = this.determineContentType(keyword);
    
    const actionsByType = {
      blog: [
        'Umfassenden Ratgeber-Artikel erstellen',
        'Verwandte Keywords integrieren',
        'Interne Verlinkung optimieren',
        'Bilder und Infografiken hinzufügen'
      ],
      landing: [
        'Zielgerichtete Landing Page erstellen',
        'Call-to-Action optimieren',
        'Preisrechner integrieren',
        'Kundenbewertungen prominenter platzieren'
      ],
      product: [
        'Detaillierte Produktvergleiche erstellen',
        'Vergleichstabellen implementieren',
        'Vor- und Nachteile auflisten',
        'Kaufberatung integrieren'
      ],
      faq: [
        'FAQ-Sektion erweitern',
        'Strukturierte Daten für FAQ implementieren',
        'People Also Ask optimieren',
        'Voice Search Optimierung'
      ]
    };

    return actionsByType[contentType] || [];
  }

  private async enhanceGapAnalysis(gaps: ContentGap[]): Promise<ContentGap[]> {
    try {
      const prompt = `
        Verbessere diese Content Gap Analyse:
        
        ${JSON.stringify(gaps.slice(0, 10), null, 2)}
        
        Bewerte und verbessere:
        1. Opportunity Ranking (high/medium/low)
        2. Content Type Zuordnung
        3. Recommended Actions
        
        Fokus auf Solarenergie/Photovoltaik Branche.
        
        Antworte mit dem verbesserten JSON Array.
      `;

      const response = await optimizeKeywords(prompt);
      
      if (Array.isArray(response) && response.length > 0) {
        return response;
      }
      
      return gaps;
      
    } catch (error) {
      console.warn('Gap analysis enhancement failed:', error);
      return gaps;
    }
  }

  private generateFallbackGaps(keywords: string[]): ContentGap[] {
    return keywords.map(keyword => ({
      keyword,
      searchVolume: 1000,
      difficulty: 50,
      competitorRanking: 5,
      ourRanking: 15,
      opportunity: 'medium' as const,
      contentType: 'blog' as const,
      recommendedActions: [
        'Content für dieses Keyword erstellen',
        'SEO-Optimierung durchführen',
        'Interne Verlinkung aufbauen'
      ]
    }));
  }

  async analyzeCompetitors(competitors: string[]): Promise<CompetitorAnalysis[]> {
    const cacheKey = competitors.join(',');
    
    if (this.competitorCache.has(cacheKey)) {
      return this.competitorCache.get(cacheKey)!;
    }

    // Mock competitor analysis - in production, use web scraping/API tools
    const analyses: CompetitorAnalysis[] = competitors.map(domain => ({
      domain,
      contentLength: Math.floor(Math.random() * 2000) + 500,
      keywordCoverage: Math.floor(Math.random() * 100),
      backlinks: Math.floor(Math.random() * 10000),
      domainAuthority: Math.floor(Math.random() * 100),
      contentFreshness: Math.random(),
      serpFeatures: this.generateSerpFeatures()
    }));

    this.competitorCache.set(cacheKey, analyses);
    return analyses;
  }

  private generateSerpFeatures(): string[] {
    const allFeatures = [
      'Featured Snippet',
      'People Also Ask',
      'Local Pack',
      'Image Pack',
      'Video Results',
      'Reviews',
      'Sitelinks',
      'Knowledge Panel'
    ];

    const count = Math.floor(Math.random() * 4) + 1;
    return allFeatures.slice(0, count);
  }

  async generateContentRecommendations(gaps: ContentGap[]): Promise<ContentRecommendation[]> {
    const highPriorityGaps = gaps.filter(gap => gap.opportunity === 'high').slice(0, 10);
    
    const recommendations: ContentRecommendation[] = [];

    for (const gap of highPriorityGaps) {
      const recommendation = await this.createContentRecommendation(gap);
      recommendations.push(recommendation);
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async createContentRecommendation(gap: ContentGap): Promise<ContentRecommendation> {
    try {
      const prompt = `
        Erstelle eine Content-Empfehlung für das Keyword: "${gap.keyword}"
        
        Content Type: ${gap.contentType}
        Search Volume: ${gap.searchVolume}
        Difficulty: ${gap.difficulty}
        
        Generiere:
        1. Ansprechenden Titel
        2. Verwandte Keywords (3-5)
        3. Geschätzte Wortanzahl
        4. Priorität (high/medium/low)
        5. Erwarteter Traffic
        
        Format als JSON:
        {
          "title": "...",
          "targetKeywords": ["..."],
          "estimatedWordCount": 1500,
          "priority": "high",
          "expectedTraffic": 500
        }
      `;

      const response = await optimizeKeywords(prompt);
      
      if (typeof response === 'object' && response.title) {
        return {
          title: response.title,
          contentType: gap.contentType,
          targetKeywords: response.targetKeywords || [gap.keyword],
          estimatedWordCount: response.estimatedWordCount || 1200,
          priority: response.priority || gap.opportunity,
          expectedTraffic: response.expectedTraffic || Math.floor(gap.searchVolume * 0.1),
          timeToRank: this.estimateTimeToRank(gap.difficulty),
          structuredData: serpFeatureOptimizer.generateStructuredData(
            gap.keyword,
            `Content about ${gap.keyword}`,
            gap.contentType === 'faq' ? 'faq' : 'article'
          )
        };
      }
      
      return this.createFallbackRecommendation(gap);
      
    } catch (error) {
      console.warn('Content recommendation generation failed:', error);
      return this.createFallbackRecommendation(gap);
    }
  }

  private createFallbackRecommendation(gap: ContentGap): ContentRecommendation {
    return {
      title: `Umfassender Guide zu ${gap.keyword}`,
      contentType: gap.contentType,
      targetKeywords: [gap.keyword],
      estimatedWordCount: 1200,
      priority: gap.opportunity,
      expectedTraffic: Math.floor(gap.searchVolume * 0.1),
      timeToRank: this.estimateTimeToRank(gap.difficulty),
      structuredData: {}
    };
  }

  private estimateTimeToRank(difficulty: number): string {
    if (difficulty < 30) return '2-4 Monate';
    if (difficulty < 60) return '4-8 Monate';
    if (difficulty < 80) return '8-12 Monate';
    return '12+ Monate';
  }

  async performSerpAnalysis(keyword: string): Promise<{
    topResults: Array<{
      position: number;
      domain: string;
      title: string;
      contentLength: number;
      serpFeatures: string[];
    }>;
    opportunities: string[];
    recommendations: string[];
  }> {
    // Mock SERP analysis - in production, use SERP API
    const topResults = Array.from({ length: 10 }, (_, i) => ({
      position: i + 1,
      domain: `competitor${i + 1}.de`,
      title: `${keyword} - Competitor ${i + 1}`,
      contentLength: Math.floor(Math.random() * 2000) + 300,
      serpFeatures: this.generateSerpFeatures()
    }));

    const opportunities = [
      'Featured Snippet Optimierung möglich',
      'Längerer Content als Konkurrenz erstellen',
      'Mehr strukturierte Daten implementieren',
      'Voice Search Optimierung verbessern',
      'Lokale SEO-Signale verstärken'
    ];

    const recommendations = [
      'Umfassendere Inhalte als Top 3 Konkurrenten erstellen',
      'FAQ-Sektion für People Also Ask optimieren',
      'Mehr interne Verlinkung implementieren',
      'Bessere Nutzererfahrung schaffen',
      'Mobile Optimierung verbessern'
    ];

    return {
      topResults,
      opportunities,
      recommendations
    };
  }

  getGapAnalysisReport(): {
    totalGapsAnalyzed: number;
    highOpportunityGaps: number;
    averageDifficulty: number;
    topContentTypes: string[];
    recommendations: string[];
  } {
    const allGaps = Array.from(this.gapCache.values()).flat();
    
    if (allGaps.length === 0) {
      return {
        totalGapsAnalyzed: 0,
        highOpportunityGaps: 0,
        averageDifficulty: 0,
        topContentTypes: [],
        recommendations: ['Beginne mit Content Gap Analyse']
      };
    }

    const highOpportunityGaps = allGaps.filter(gap => gap.opportunity === 'high').length;
    const averageDifficulty = allGaps.reduce((sum, gap) => sum + gap.difficulty, 0) / allGaps.length;
    
    const contentTypeCounts = allGaps.reduce((acc, gap) => {
      acc[gap.contentType] = (acc[gap.contentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topContentTypes = Object.entries(contentTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const recommendations = [
      `${highOpportunityGaps} High-Opportunity Keywords identifiziert`,
      `Fokus auf ${topContentTypes[0]}-Content für beste Ergebnisse`,
      averageDifficulty < 50 ? 'Viele einfach zu rankende Keywords gefunden' : 'Erhöhte SEO-Anstrengungen erforderlich',
      'Content-Lücken systematisch schließen',
      'Regelmäßige Konkurrenzanalyse durchführen'
    ];

    return {
      totalGapsAnalyzed: allGaps.length,
      highOpportunityGaps,
      averageDifficulty: Math.round(averageDifficulty),
      topContentTypes,
      recommendations
    };
  }
}

export const contentGapAnalyzer = ContentGapAnalyzer.getInstance();