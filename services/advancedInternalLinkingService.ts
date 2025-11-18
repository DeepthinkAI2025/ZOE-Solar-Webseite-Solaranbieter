/**
 * Advanced Internal Linking Service für ZOE Solar
 *
 * KI-gestütztes System für optimierte interne Verlinkung
 * mit dynamischer Link-Verteilung und Performance-Tracking
 */

import { getAIGatewayService } from './core/AIGatewayService.js';

// Wrapper für KI-Keyword-Optimierung (OpenRouter/Mistral)
const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent.apply(aiGateway, args);
};

export interface PageNode {
  url: string;
  title: string;
  keywords: string[];
  contentType: 'landing' | 'category' | 'product' | 'blog' | 'location' | 'service';
  authority: number; // 1-100
  traffic: number;
  conversionRate: number;
  internalLinks: Link[];
  externalLinks: Link[];
  backlinks: number;
  lastUpdated: Date;
}

export interface Link {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  linkType: 'dofollow' | 'nofollow';
  context: string;
  position: number; // Position im Text
  clicks?: number;
  conversions?: number;
}

export interface LinkOpportunity {
  sourcePage: PageNode;
  targetPage: PageNode;
  anchorText: string;
  context: string;
  priority: number; // 1-10
  expectedBenefit: {
    traffic: number;
    authority: number;
    conversions: number;
  };
  implementation: string;
}

export interface LinkingStrategy {
  id: string;
  name: string;
  description: string;
  targetPages: string[];
  rules: {
    maxLinksPerPage: number;
    anchorTextDistribution: Record<string, number>; // anchor -> percentage
    linkPlacement: 'contextual' | 'footer' | 'sidebar' | 'mixed';
    authorityThreshold: number;
  };
  performance: {
    totalTraffic: number;
    totalConversions: number;
    averageCTR: number;
  };
  active: boolean;
}

export interface LinkAnalysis {
  totalPages: number;
  totalLinks: number;
  orphanPages: PageNode[];
  brokenLinks: Link[];
  linkDistribution: {
    byAuthority: Record<string, number>;
    byContentType: Record<string, number>;
    byDepth: Record<string, number>;
  };
  opportunities: LinkOpportunity[];
  recommendations: string[];
}

class AdvancedInternalLinkingService {
  private static instance: AdvancedInternalLinkingService;
  private pages: Map<string, PageNode> = new Map();
  private strategies: Map<string, LinkingStrategy> = new Map();
  private linkHistory: Link[] = [];
  private analysisCache?: LinkAnalysis;
  private optimizationInterval?: NodeJS.Timeout;

  private constructor() {
    this.initializeStrategies();
    this.initializeOptimization();
  }

  public static getInstance(): AdvancedInternalLinkingService {
    if (!AdvancedInternalLinkingService.instance) {
      AdvancedInternalLinkingService.instance = new AdvancedInternalLinkingService();
    }
    return AdvancedInternalLinkingService.instance;
  }

  private initializeStrategies(): void {
    // Pillar Content Strategy
    this.strategies.set('pillar-content', {
      id: 'pillar-content',
      name: 'Pillar Content Linking',
      description: 'Verlinkung von Cluster-Content zu Pillar-Seiten für Authority-Aufbau',
      targetPages: ['/photovoltaik', '/agri-pv', '/speicherloesungen'],
      rules: {
        maxLinksPerPage: 5,
        anchorTextDistribution: {
          'Photovoltaik': 0.3,
          'Solaranlagen': 0.2,
          'PV-Anlagen': 0.2,
          'erfahren Sie mehr': 0.15,
          'lesen Sie weiter': 0.15
        },
        linkPlacement: 'contextual',
        authorityThreshold: 70
      },
      performance: {
        totalTraffic: 0,
        totalConversions: 0,
        averageCTR: 0
      },
      active: true
    });

    // Location-based Linking
    this.strategies.set('location-linking', {
      id: 'location-linking',
      name: 'Standort-basierte Verlinkung',
      description: 'Optimierte Links zwischen lokalen Standortseiten und Services',
      targetPages: [], // Wird dynamisch gefüllt
      rules: {
        maxLinksPerPage: 8,
        anchorTextDistribution: {
          'in Ihrer Nähe': 0.25,
          'lokaler Service': 0.25,
          'Standort finden': 0.25,
          'regionaler Partner': 0.25
        },
        linkPlacement: 'mixed',
        authorityThreshold: 50
      },
      performance: {
        totalTraffic: 0,
        totalConversions: 0,
        averageCTR: 0
      },
      active: true
    });

    // Product-Service Linking
    this.strategies.set('product-service', {
      id: 'product-service',
      name: 'Produkt-Service Verlinkung',
      description: 'Verbindung von Produktseiten mit relevanten Dienstleistungen',
      targetPages: ['/produkte', '/dienstleistungen'],
      rules: {
        maxLinksPerPage: 6,
        anchorTextDistribution: {
          'jetzt anfragen': 0.3,
          'Beratung erhalten': 0.25,
          'mehr erfahren': 0.2,
          'Preis anfordern': 0.15,
          'Termin vereinbaren': 0.1
        },
        linkPlacement: 'contextual',
        authorityThreshold: 60
      },
      performance: {
        totalTraffic: 0,
        totalConversions: 0,
        averageCTR: 0
      },
      active: true
    });
  }

  private initializeOptimization(): void {
    // Optimierung alle 6 Stunden
    this.optimizationInterval = setInterval(() => {
      this.performOptimization();
    }, 6 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performOptimization();
  }

  private async performOptimization(): Promise<void> {
    try {
      // Crawle Seiten und aktualisiere PageNodes
      await this.crawlAndUpdatePages();

      // Analysiere aktuelle Link-Struktur
      const analysis = await this.analyzeLinkStructure();

      // Generiere neue Link-Opportunities
      const opportunities = await this.generateLinkOpportunities(analysis);

      // Implementiere automatische Optimierungen
      await this.implementOptimizations(opportunities);

      // Cache aktualisieren
      this.analysisCache = analysis;

    } catch (error) {
      console.error('Failed to perform linking optimization:', error);
    }
  }

  private async crawlAndUpdatePages(): Promise<void> {
    // Simuliere Crawling der Website
    // In echter Implementierung würde hier ein Crawler verwendet

    const mockPages: PageNode[] = [
      {
        url: '/photovoltaik',
        title: 'Photovoltaik für Gewerbe & Industrie',
        keywords: ['Photovoltaik', 'Solaranlagen', 'PV-Anlagen'],
        contentType: 'category',
        authority: 85,
        traffic: 12500,
        conversionRate: 0.03,
        internalLinks: [],
        externalLinks: [],
        backlinks: 450,
        lastUpdated: new Date()
      },
      {
        url: '/agri-pv',
        title: 'Agri-PV für Landwirtschaft',
        keywords: ['Agri-PV', 'Landwirtschaft', 'Solar'],
        contentType: 'service',
        authority: 78,
        traffic: 8900,
        conversionRate: 0.025,
        internalLinks: [],
        externalLinks: [],
        backlinks: 320,
        lastUpdated: new Date()
      },
      {
        url: '/standort/berlin',
        title: 'Solaranlagen Berlin',
        keywords: ['Solaranlagen Berlin', 'Photovoltaik Berlin'],
        contentType: 'location',
        authority: 65,
        traffic: 3400,
        conversionRate: 0.04,
        internalLinks: [],
        externalLinks: [],
        backlinks: 85,
        lastUpdated: new Date()
      }
    ];

    mockPages.forEach(page => {
      this.pages.set(page.url, page);
    });
  }

  private async analyzeLinkStructure(): Promise<LinkAnalysis> {
    const pages = Array.from(this.pages.values());
    const allLinks = pages.flatMap(page => page.internalLinks);

    // Finde verwaiste Seiten
    const orphanPages = pages.filter(page =>
      page.internalLinks.length === 0 && page.contentType !== 'landing'
    );

    // Finde defekte Links
    const brokenLinks = allLinks.filter(link =>
      !this.pages.has(link.targetUrl)
    );

    // Link-Verteilung analysieren
    const linkDistribution = {
      byAuthority: this.calculateAuthorityDistribution(pages),
      byContentType: this.calculateContentTypeDistribution(pages),
      byDepth: this.calculateDepthDistribution(pages)
    };

    // Opportunities generieren
    const opportunities = await this.generateLinkOpportunities({
      totalPages: pages.length,
      totalLinks: allLinks.length,
      orphanPages,
      brokenLinks,
      linkDistribution,
      opportunities: [],
      recommendations: []
    });

    const recommendations = this.generateRecommendations({
      totalPages: pages.length,
      totalLinks: allLinks.length,
      orphanPages,
      brokenLinks,
      linkDistribution,
      opportunities,
      recommendations: []
    });

    return {
      totalPages: pages.length,
      totalLinks: allLinks.length,
      orphanPages,
      brokenLinks,
      linkDistribution,
      opportunities,
      recommendations
    };
  }

  private calculateAuthorityDistribution(pages: PageNode[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];

    ranges.forEach(range => {
      distribution[range] = 0;
    });

    pages.forEach(page => {
      const range = this.getAuthorityRange(page.authority);
  if (typeof distribution[range] === 'number') distribution[range]!++;
    });

    return distribution;
  }

  private calculateContentTypeDistribution(pages: PageNode[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    pages.forEach(page => {
      const type = page.contentType;
      distribution[type] = (distribution[type] || 0) + page.internalLinks.length;
    });

    return distribution;
  }

  private calculateDepthDistribution(pages: PageNode[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    const depths = ['0', '1', '2', '3+'];

    depths.forEach(depth => {
      distribution[depth] = 0;
    });

    pages.forEach(page => {
      const depth = this.calculatePageDepth(page.url);
      const depthKey = depth >= 3 ? '3+' : depth.toString();
  if (typeof distribution[depthKey] === 'number') distribution[depthKey]!++;
    });

    return distribution;
  }

  private calculatePageDepth(url: string): number {
    return (url.match(/\//g) || []).length - 1;
  }

  private getAuthorityRange(authority: number): string {
    if (authority <= 20) return '0-20';
    if (authority <= 40) return '21-40';
    if (authority <= 60) return '41-60';
    if (authority <= 80) return '61-80';
    return '81-100';
  }

  private async generateLinkOpportunities(analysis: LinkAnalysis): Promise<LinkOpportunity[]> {
    const opportunities: LinkOpportunity[] = [];

    // Finde Opportunities für verwaiste Seiten
    for (const orphanPage of analysis.orphanPages) {
      const potentialSources = this.findPotentialSourcePages(orphanPage);

      for (const sourcePage of potentialSources.slice(0, 3)) {
        const opportunity = await this.createLinkOpportunity(sourcePage, orphanPage);
        if (opportunity) {
          opportunities.push(opportunity);
        }
      }
    }

    // Finde Cross-Linking Opportunities
    const highAuthorityPages = Array.from(this.pages.values())
      .filter(page => page.authority > 70)
      .slice(0, 5);

    for (const highAuthPage of highAuthorityPages) {
      const relatedPages = this.findRelatedPages(highAuthPage);

      for (const relatedPage of relatedPages.slice(0, 2)) {
        if (relatedPage.authority < highAuthPage.authority) {
          const opportunity = await this.createLinkOpportunity(highAuthPage, relatedPage);
          if (opportunity) {
            opportunities.push(opportunity);
          }
        }
      }
    }

    return opportunities.sort((a, b) => b.priority - a.priority);
  }

  private findPotentialSourcePages(targetPage: PageNode): PageNode[] {
    return Array.from(this.pages.values())
      .filter(page =>
        page.url !== targetPage.url &&
        page.authority > targetPage.authority &&
        this.haveSharedKeywords(page, targetPage)
      )
      .sort((a, b) => b.authority - a.authority);
  }

  private findRelatedPages(page: PageNode): PageNode[] {
    return Array.from(this.pages.values())
      .filter(other =>
        other.url !== page.url &&
        this.haveSharedKeywords(page, other)
      )
      .sort((a, b) => b.traffic - a.traffic);
  }

  private haveSharedKeywords(page1: PageNode, page2: PageNode): boolean {
    const shared = page1.keywords.filter(keyword =>
      page2.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    return shared.length > 0;
  }

  private async createLinkOpportunity(sourcePage: PageNode, targetPage: PageNode): Promise<LinkOpportunity | null> {
    try {
      // KI-gestützte Anchor-Text Generierung
      const anchorText = await this.generateOptimalAnchorText(sourcePage, targetPage);
      const context = await this.generateLinkContext(sourcePage, targetPage);

      const expectedBenefit = this.calculateExpectedBenefit(sourcePage, targetPage);

      return {
        sourcePage,
        targetPage,
        anchorText,
        context,
        priority: this.calculatePriority(sourcePage, targetPage, expectedBenefit),
        expectedBenefit,
        implementation: `Füge Link in ${sourcePage.title} zu ${targetPage.title} hinzu`
      };
    } catch (error) {
      console.error('Failed to create link opportunity:', error);
      return null;
    }
  }

  private async generateOptimalAnchorText(sourcePage: PageNode, targetPage: PageNode): Promise<string> {
    // Verwende KI für optimale Anchor-Texte
    const sharedKeywords = sourcePage.keywords.filter(keyword =>
      targetPage.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (sharedKeywords.length > 0) {
  return sharedKeywords[0] || '';
    }

    // Fallback zu KI-generiertem Anchor-Text
    try {
      const prompt = `Generiere einen optimalen Anchor-Text für einen Link von "${sourcePage.title}" zu "${targetPage.title}". Der Anchor-Text sollte natürlich klingen und SEO-freundlich sein. Maximale Länge: 4 Wörter.`;
      const optimized = await optimizeKeywords({ content: prompt });
      return (optimized && typeof optimized === 'object' && 'optimizedTitle' in optimized && typeof optimized.optimizedTitle === 'string' && optimized.optimizedTitle.length > 0)
        ? optimized.optimizedTitle
        : targetPage.title;
    } catch {
      return targetPage.title;
    }
  }

  private async generateLinkContext(sourcePage: PageNode, targetPage: PageNode): Promise<string> {
    // Generiere kontextuellen Link-Text
    const contexts = [
      `Erfahren Sie mehr über ${targetPage.title.toLowerCase()}`,
      `Detaillierte Informationen zu ${targetPage.keywords[0] || 'unserem Service'}`,
      `Professionelle ${targetPage.contentType === 'service' ? 'Dienstleistungen' : 'Lösungen'} für ${targetPage.keywords[0] || 'Ihre Anforderungen'}`
    ];

  return contexts[Math.floor(Math.random() * contexts.length)] || '';
  }

  private calculateExpectedBenefit(sourcePage: PageNode, targetPage: PageNode): LinkOpportunity['expectedBenefit'] {
    const authorityBoost = Math.min(sourcePage.authority * 0.1, 10);
    const trafficBoost = Math.floor(sourcePage.traffic * 0.05);
    const conversionBoost = sourcePage.conversionRate * targetPage.conversionRate * 100;

    return {
      traffic: trafficBoost,
      authority: authorityBoost,
      conversions: conversionBoost
    };
  }

  private calculatePriority(sourcePage: PageNode, targetPage: PageNode, benefit: LinkOpportunity['expectedBenefit']): number {
    const authorityDiff = sourcePage.authority - targetPage.authority;
    const trafficFactor = benefit.traffic / 1000;
    const conversionFactor = benefit.conversions * 10;

    return Math.min(Math.floor(authorityDiff * 0.1 + trafficFactor + conversionFactor), 10);
  }

  private async implementOptimizations(opportunities: LinkOpportunity[]): Promise<void> {
    // Implementiere Top-Opportunities automatisch
    const topOpportunities = opportunities
      .filter(opp => opp.priority >= 7)
      .slice(0, 5);

    for (const opportunity of topOpportunities) {
      try {
        await this.implementLinkOpportunity(opportunity);
      } catch (error) {
        console.error('Failed to implement link opportunity:', error);
      }
    }
  }

  private async implementLinkOpportunity(opportunity: LinkOpportunity): Promise<void> {
    const link: Link = {
      sourceUrl: opportunity.sourcePage.url,
      targetUrl: opportunity.targetPage.url,
      anchorText: opportunity.anchorText,
      linkType: 'dofollow',
      context: opportunity.context,
      position: Math.floor(Math.random() * 1000) // Simulierte Position
    };

    // Aktualisiere Source-Page
    const sourcePage = this.pages.get(opportunity.sourcePage.url);
    if (sourcePage) {
      sourcePage.internalLinks.push(link);
      this.pages.set(sourcePage.url, sourcePage);
    }

    // Aktualisiere Target-Page
    const targetPage = this.pages.get(opportunity.targetPage.url);
    if (targetPage) {
      targetPage.backlinks++;
      this.pages.set(targetPage.url, targetPage);
    }

    // Link zur Historie hinzufügen
    this.linkHistory.push(link);
  }

  private generateRecommendations(analysis: LinkAnalysis): string[] {
    const recommendations: string[] = [];

    if (analysis.orphanPages.length > 0) {
      recommendations.push(`${analysis.orphanPages.length} verwaiste Seiten gefunden. Interne Links zu diesen Seiten hinzufügen.`);
    }

    if (analysis.brokenLinks.length > 0) {
      recommendations.push(`${analysis.brokenLinks.length} defekte interne Links gefunden. Diese reparieren oder entfernen.`);
    }

    const lowAuthorityPages = analysis.linkDistribution.byAuthority['0-20'] || 0;
    if (lowAuthorityPages > analysis.totalPages * 0.2) {
      recommendations.push('Zu viele Seiten mit niedriger Authority. Pillar-Content-Strategie verstärken.');
    }

    if (analysis.opportunities.length > 10) {
      recommendations.push(`${analysis.opportunities.length} Link-Opportunities identifiziert. Priorität auf High-Impact Links legen.`);
    }

    return recommendations;
  }

  // ===== PUBLIC API =====

  public getLinkAnalysis(): LinkAnalysis | undefined {
    return this.analysisCache;
  }

  public getPageNode(url: string): PageNode | undefined {
    return this.pages.get(url);
  }

  public getAllPages(): PageNode[] {
    return Array.from(this.pages.values());
  }

  public getLinkingStrategies(): LinkingStrategy[] {
    return Array.from(this.strategies.values());
  }

  public getStrategy(strategyId: string): LinkingStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  public async updateStrategy(strategyId: string, updates: Partial<LinkingStrategy>): Promise<void> {
    const existing = this.strategies.get(strategyId);
    if (!existing) throw new Error(`Strategy ${strategyId} not found`);

    this.strategies.set(strategyId, { ...existing, ...updates });

    // Trigger Neuoptimierung
    await this.performOptimization();
  }

  public getLinkOpportunities(limit = 10): LinkOpportunity[] {
    return this.analysisCache?.opportunities.slice(0, limit) || [];
  }

  public async implementLink(sourceUrl: string, targetUrl: string, anchorText: string, context: string): Promise<void> {
    const sourcePage = this.pages.get(sourceUrl);
    const targetPage = this.pages.get(targetUrl);

    if (!sourcePage || !targetPage) {
      throw new Error('Source or target page not found');
    }

    const opportunity: LinkOpportunity = {
      sourcePage,
      targetPage,
      anchorText,
      context,
      priority: 5,
      expectedBenefit: this.calculateExpectedBenefit(sourcePage, targetPage),
      implementation: 'Manual link implementation'
    };

    await this.implementLinkOpportunity(opportunity);
  }

  public getLinkHistory(limit = 50): Link[] {
    return this.linkHistory.slice(-limit);
  }

  public getPerformanceMetrics(): {
    totalLinks: number;
    averageLinksPerPage: number;
    orphanPagesCount: number;
    opportunitiesCount: number;
    strategiesActive: number;
  } {
    const totalLinks = Array.from(this.pages.values())
      .reduce((sum, page) => sum + page.internalLinks.length, 0);

    const orphanPagesCount = this.analysisCache?.orphanPages.length || 0;
    const opportunitiesCount = this.analysisCache?.opportunities.length || 0;
    const strategiesActive = Array.from(this.strategies.values())
      .filter(strategy => strategy.active).length;

    return {
      totalLinks,
      averageLinksPerPage: totalLinks / Math.max(this.pages.size, 1),
      orphanPagesCount,
      opportunitiesCount,
      strategiesActive
    };
  }

  public stopOptimization(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = undefined;
    }
  }

  public startOptimization(): void {
    if (!this.optimizationInterval) {
      this.initializeOptimization();
    }
  }
}

export const advancedInternalLinkingService = AdvancedInternalLinkingService.getInstance();
export default advancedInternalLinkingService;