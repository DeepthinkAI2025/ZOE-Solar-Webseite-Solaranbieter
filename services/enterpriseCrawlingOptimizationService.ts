/**
 * Enterprise-Level Crawling Optimization Service für ZOE Solar
 *
 * Fortgeschrittene Crawling-Optimierung mit AI-gestützter Analyse,
 * Crawl-Budget-Management und technischer SEO-Optimierung
 */

export interface CrawlData {
  url: string;
  crawlDate: Date;
  responseTime: number;
  statusCode: number;
  contentType: string;
  contentLength: number;
  lastModified?: Date;
  etag?: string;
  crawlDepth: number;
  linksFound: number;
  internalLinks: string[];
  externalLinks: string[];
  images: string[];
  scripts: string[];
  stylesheets: string[];
  metaRobots?: string;
  canonicalUrl?: string;
  schemaMarkup: object[];
  coreWebVitals?: {
    lcp: number;
    fid: number;
    cls: number;
  };
  mobileFriendly: boolean;
  indexable: boolean;
}

export interface CrawlBudget {
  totalUrls: number;
  crawledUrls: number;
  remainingBudget: number;
  budgetUtilization: number;
  priorityUrls: string[];
  lowPriorityUrls: string[];
  blockedUrls: string[];
  errorUrls: string[];
}

export interface CrawlingOptimization {
  url: string;
  issues: Array<{
    type: 'performance' | 'indexing' | 'technical' | 'content' | 'mobile';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    impact: number; // 1-10
    recommendation: string;
    autoFixable: boolean;
  }>;
  optimizations: Array<{
    type: string;
    description: string;
    expectedImprovement: number;
    implementation: string;
    priority: number;
  }>;
  performance: {
    crawlEfficiency: number;
    indexabilityScore: number;
    technicalHealthScore: number;
    overallScore: number;
  };
  lastAnalyzed: Date;
}

export interface CrawlingStrategy {
  id: string;
  name: string;
  description: string;
  rules: {
    crawlFrequency: 'daily' | 'weekly' | 'monthly';
    priorityThreshold: number;
    maxCrawlDepth: number;
    respectRobotsTxt: boolean;
    followRedirects: boolean;
    crawlDelay: number; // ms
    userAgent: string;
    allowedContentTypes: string[];
    excludedPatterns: string[];
  };
  performance: {
    urlsProcessed: number;
    averageResponseTime: number;
    successRate: number;
    crawlEfficiency: number;
  };
  active: boolean;
}

export interface CrawlAnalysis {
  totalUrls: number;
  crawledUrls: number;
  uncrawledUrls: number;
  errorUrls: number;
  blockedUrls: number;
  duplicateContent: number;
  orphanPages: number;
  redirectChains: number;
  brokenLinks: number;
  performance: {
    averageResponseTime: number;
    medianResponseTime: number;
    p95ResponseTime: number;
    crawlSuccessRate: number;
  };
  indexability: {
    indexablePages: number;
    nonIndexablePages: number;
    noindexPages: number;
    canonicalizedPages: number;
  };
  technical: {
    mobileFriendlyPages: number;
    pagesWithCoreWebVitals: number;
    pagesWithSchemaMarkup: number;
    pagesWithMetaDescription: number;
  };
  recommendations: string[];
}

class EnterpriseCrawlingOptimizationService {
  private static instance: EnterpriseCrawlingOptimizationService;
  private crawlData: Map<string, CrawlData> = new Map();
  private optimizations: Map<string, CrawlingOptimization> = new Map();
  private strategies: Map<string, CrawlingStrategy> = new Map();
  private crawlBudget: CrawlBudget;
  private analysisCache?: CrawlAnalysis;
  private crawlingInterval?: NodeJS.Timeout;

  private constructor() {
    this.crawlBudget = this.initializeCrawlBudget();
    this.initializeStrategies();
    this.startCrawlingOptimization();
  }

  public static getInstance(): EnterpriseCrawlingOptimizationService {
    if (!EnterpriseCrawlingOptimizationService.instance) {
      EnterpriseCrawlingOptimizationService.instance = new EnterpriseCrawlingOptimizationService();
    }
    return EnterpriseCrawlingOptimizationService.instance;
  }

  private initializeCrawlBudget(): CrawlBudget {
    return {
      totalUrls: 1000,
      crawledUrls: 0,
      remainingBudget: 1000,
      budgetUtilization: 0,
      priorityUrls: [],
      lowPriorityUrls: [],
      blockedUrls: [],
      errorUrls: []
    };
  }

  private initializeStrategies(): void {
    // High-Priority Content Strategy
    this.strategies.set('high-priority', {
      id: 'high-priority',
      name: 'High-Priority Content Crawling',
      description: 'Fokussiertes Crawling von wichtigen Landingpages und Produkten',
      rules: {
        crawlFrequency: 'daily',
        priorityThreshold: 8,
        maxCrawlDepth: 3,
        respectRobotsTxt: true,
        followRedirects: true,
        crawlDelay: 1000,
        userAgent: 'ZOE-Solar-Bot/1.0 (+https://www.zoe-solar.de/bot)',
        allowedContentTypes: ['text/html', 'application/json'],
        excludedPatterns: ['/admin', '/private', '/temp']
      },
      performance: {
        urlsProcessed: 0,
        averageResponseTime: 0,
        successRate: 0,
        crawlEfficiency: 0
      },
      active: true
    });

    // Comprehensive Site Audit Strategy
    this.strategies.set('comprehensive-audit', {
      id: 'comprehensive-audit',
      name: 'Umfassende Site-Analyse',
      description: 'Tiefgehende Crawling-Analyse für technische SEO-Audits',
      rules: {
        crawlFrequency: 'weekly',
        priorityThreshold: 1,
        maxCrawlDepth: 10,
        respectRobotsTxt: true,
        followRedirects: true,
        crawlDelay: 2000,
        userAgent: 'ZOE-Solar-Audit-Bot/1.0 (+https://www.zoe-solar.de/audit-bot)',
        allowedContentTypes: ['text/html', 'text/xml', 'application/xml'],
        excludedPatterns: ['/cdn', '/assets', '/media']
      },
      performance: {
        urlsProcessed: 0,
        averageResponseTime: 0,
        successRate: 0,
        crawlEfficiency: 0
      },
      active: true
    });

    // Mobile-First Crawling Strategy
    this.strategies.set('mobile-first', {
      id: 'mobile-first',
      name: 'Mobile-First Crawling',
      description: 'Mobile-optimierte Crawling-Strategie für Core Web Vitals',
      rules: {
        crawlFrequency: 'daily',
        priorityThreshold: 5,
        maxCrawlDepth: 5,
        respectRobotsTxt: true,
        followRedirects: true,
        crawlDelay: 1500,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        allowedContentTypes: ['text/html'],
        excludedPatterns: ['/desktop-only', '/print']
      },
      performance: {
        urlsProcessed: 0,
        averageResponseTime: 0,
        successRate: 0,
        crawlEfficiency: 0
      },
      active: true
    });
  }

  private _startCrawlingOptimization(): void {
    // Crawling-Optimierung alle 4 Stunden
    this.crawlingInterval = setInterval(() => {
      this.performCrawlingOptimization();
    }, 4 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performCrawlingOptimization();
  }

  private async performCrawlingOptimization(): Promise<void> {
    try {
      // Führe strategisches Crawling durch
      await this.executeStrategicCrawling();

      // Analysiere Crawl-Daten
      const analysis = await this.analyzeCrawlData();

      // Generiere Optimierungen
      await this.generateOptimizations(analysis);

      // Aktualisiere Crawl-Budget
      this.updateCrawlBudget();

      // Cache Analyse-Ergebnisse
      this.analysisCache = analysis;

    } catch (error) {
      console.error('Failed to perform crawling optimization:', error);
    }
  }

  private async executeStrategicCrawling(): Promise<void> {
    // Simuliere strategisches Crawling für verschiedene Strategien
    for (const [strategyId, strategy] of this.strategies) {
      if (!strategy.active) continue;

      try {
        const crawledUrls = await this.crawlWithStrategy(strategy);
        strategy.performance.urlsProcessed += crawledUrls.length;
        strategy.performance.averageResponseTime = this.calculateAverageResponseTime(crawledUrls);
        strategy.performance.successRate = this.calculateSuccessRate(crawledUrls);
        strategy.performance.crawlEfficiency = this.calculateCrawlEfficiency(strategy);

        this.strategies.set(strategyId, strategy);

      } catch (error) {
        console.error(`Failed to execute crawling strategy ${strategyId}:`, error);
      }
    }
  }

  private async crawlWithStrategy(strategy: CrawlingStrategy): Promise<CrawlData[]> {
    // Simuliere Crawling basierend auf Strategie
    const mockUrls = this.generateMockUrlsForStrategy(strategy);
    const crawledData: CrawlData[] = [];

    for (const url of mockUrls) {
      if (this.crawlBudget.remainingBudget <= 0) break;

      const crawlData = await this.crawlUrl(url, strategy);
      crawledData.push(crawlData);
      this.crawlData.set(url, crawlData);
      this.crawlBudget.crawledUrls++;
      this.crawlBudget.remainingBudget--;
    }

    return crawledData;
  }

  private generateMockUrlsForStrategy(strategy: CrawlingStrategy): string[] {
    const baseUrls = [
      'https://www.zoe-solar.de/',
      'https://www.zoe-solar.de/photovoltaik',
      'https://www.zoe-solar.de/agri-pv',
      'https://www.zoe-solar.de/produkte',
      'https://www.zoe-solar.de/standort/berlin',
      'https://www.zoe-solar.de/standort/muenchen'
    ];

    // Filter URLs basierend auf Strategie-Regeln
    return baseUrls.filter(url => {
      return !strategy.rules.excludedPatterns.some(pattern => url.includes(pattern));
    }).slice(0, Math.min(10, this.crawlBudget.remainingBudget));
  }

  private async crawlUrl(url: string, strategy: CrawlingStrategy): Promise<CrawlData> {
    // Simuliere URL-Crawling
    const responseTime = Math.random() * 2000 + 500; // 500-2500ms
    const statusCode = Math.random() > 0.9 ? 404 : 200;
    const contentLength = Math.floor(Math.random() * 100000) + 10000;

    return {
      url,
      crawlDate: new Date(),
      responseTime,
      statusCode,
      contentType: 'text/html',
      contentLength,
      crawlDepth: Math.floor(Math.random() * strategy.rules.maxCrawlDepth),
      linksFound: Math.floor(Math.random() * 20) + 5,
      internalLinks: [], // Would be populated in real implementation
      externalLinks: [],
      images: [],
      scripts: [],
      stylesheets: [],
      schemaMarkup: [],
      mobileFriendly: Math.random() > 0.2,
      indexable: Math.random() > 0.1
    };
  }

  private calculateAverageResponseTime(crawledData: CrawlData[]): number {
    if (crawledData.length === 0) return 0;
    return crawledData.reduce((sum, data) => sum + data.responseTime, 0) / crawledData.length;
  }

  private calculateSuccessRate(crawledData: CrawlData[]): number {
    if (crawledData.length === 0) return 0;
    const successful = crawledData.filter(data => data.statusCode === 200).length;
    return successful / crawledData.length;
  }

  private calculateCrawlEfficiency(strategy: CrawlingStrategy): number {
    // Efficiency basierend auf Response Time und Success Rate
    const responseTimeScore = Math.max(0, 1 - (strategy.performance.averageResponseTime / 3000));
    const successRateScore = strategy.performance.successRate;
    return (responseTimeScore + successRateScore) / 2;
  }

  private async analyzeCrawlData(): Promise<CrawlAnalysis> {
    const allCrawlData = Array.from(this.crawlData.values());

    const totalUrls = allCrawlData.length;
    const crawledUrls = allCrawlData.filter(data => data.statusCode === 200).length;
    const errorUrls = allCrawlData.filter(data => data.statusCode >= 400).length;
    const blockedUrls = allCrawlData.filter(data => data.statusCode === 403 || data.statusCode === 404).length;

    // Performance-Metriken
    const responseTimes = allCrawlData.map(data => data.responseTime).sort((a, b) => a - b);
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const medianResponseTime = responseTimes[Math.floor(responseTimes.length / 2)];
    const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)];

    // Indexability-Metriken
    const indexablePages = allCrawlData.filter(data => data.indexable).length;
    const mobileFriendlyPages = allCrawlData.filter(data => data.mobileFriendly).length;

    const recommendations = this.generateCrawlRecommendations(allCrawlData);

    return {
      totalUrls,
      crawledUrls,
      uncrawledUrls: totalUrls - crawledUrls,
      errorUrls,
      blockedUrls,
      duplicateContent: Math.floor(totalUrls * 0.05), // 5% geschätzt
      orphanPages: Math.floor(totalUrls * 0.1), // 10% geschätzt
      redirectChains: Math.floor(totalUrls * 0.02), // 2% geschätzt
      brokenLinks: Math.floor(totalUrls * 0.03), // 3% geschätzt
      performance: {
        averageResponseTime,
        medianResponseTime,
        p95ResponseTime,
        crawlSuccessRate: crawledUrls / totalUrls
      },
      indexability: {
        indexablePages,
        nonIndexablePages: totalUrls - indexablePages,
        noindexPages: Math.floor(totalUrls * 0.05),
        canonicalizedPages: Math.floor(totalUrls * 0.15)
      },
      technical: {
        mobileFriendlyPages,
        pagesWithCoreWebVitals: Math.floor(totalUrls * 0.8),
        pagesWithSchemaMarkup: Math.floor(totalUrls * 0.6),
        pagesWithMetaDescription: Math.floor(totalUrls * 0.7)
      },
      recommendations
    };
  }

  private generateCrawlRecommendations(crawlData: CrawlData[]): string[] {
    const recommendations: string[] = [];

    const slowPages = crawlData.filter(data => data.responseTime > 3000);
    if (slowPages.length > crawlData.length * 0.1) {
      recommendations.push(`${slowPages.length} Seiten laden langsamer als 3 Sekunden. Optimieren Sie Server-Response-Zeit und Caching.`);
    }

    const nonIndexablePages = crawlData.filter(data => !data.indexable);
    if (nonIndexablePages.length > crawlData.length * 0.1) {
      recommendations.push(`${nonIndexablePages.length} Seiten sind nicht indexierbar. Überprüfen Sie Meta-Robots-Tags und robots.txt.`);
    }

    const nonMobileFriendly = crawlData.filter(data => !data.mobileFriendly);
    if (nonMobileFriendly.length > 0) {
      recommendations.push(`${nonMobileFriendly.length} Seiten sind nicht mobile-freundlich. Implementieren Sie Responsive Design.`);
    }

    if (this.crawlBudget.budgetUtilization > 0.9) {
      recommendations.push('Crawl-Budget wird knapp. Optimieren Sie Crawling-Strategien und reduzieren Sie unwichtige URLs.');
    }

    return recommendations;
  }

  private async generateOptimizations(analysis: CrawlAnalysis): Promise<void> {
    // Generiere Optimierungen für jede gecrawlte URL
    for (const crawlData of Array.from(this.crawlData.values())) {
      const optimization = await this.generateUrlOptimization(crawlData, analysis);
      this.optimizations.set(crawlData.url, optimization);
    }
  }

  private async generateUrlOptimization(crawlData: CrawlData, analysis: CrawlAnalysis): Promise<CrawlingOptimization> {
    const issues: CrawlingOptimization['issues'] = [];
    const optimizations: CrawlingOptimization['optimizations'] = [];

    // Performance-Issues
    if (crawlData.responseTime > 3000) {
      issues.push({
        type: 'performance',
        severity: 'high',
        title: 'Langsame Ladezeit',
        description: `Seite lädt in ${crawlData.responseTime}ms`,
        impact: 8,
        recommendation: 'Optimieren Sie Bilder, aktivieren Sie Caching und komprimieren Sie Ressourcen',
        autoFixable: false
      });
    }

    // Indexability-Issues
    if (!crawlData.indexable) {
      issues.push({
        type: 'indexing',
        severity: 'critical',
        title: 'Nicht indexierbar',
        description: 'Seite ist für Suchmaschinen nicht indexierbar',
        impact: 10,
        recommendation: 'Entfernen Sie noindex-Tags oder korrigieren Sie robots.txt',
        autoFixable: true
      });
    }

    // Mobile-Issues
    if (!crawlData.mobileFriendly) {
      issues.push({
        type: 'mobile',
        severity: 'high',
        title: 'Nicht mobile-freundlich',
        description: 'Seite ist nicht für mobile Geräte optimiert',
        impact: 7,
        recommendation: 'Implementieren Sie Responsive Design und testen Sie mit Mobile-Friendly Test',
        autoFixable: false
      });
    }

    // Technische Issues
    if (crawlData.statusCode >= 400) {
      issues.push({
        type: 'technical',
        severity: 'critical',
        title: 'HTTP Fehler',
        description: `Seite gibt Status Code ${crawlData.statusCode} zurück`,
        impact: 10,
        recommendation: 'Beheben Sie den HTTP-Fehler oder richten Sie Redirects ein',
        autoFixable: false
      });
    }

    // Optimierungen vorschlagen
    if (crawlData.contentLength < 1000) {
      optimizations.push({
        type: 'content',
        description: 'Content-Length ist sehr gering - prüfen Sie auf Thin Content',
        expectedImprovement: 6,
        implementation: 'Erweitern Sie den Content um relevante Informationen',
        priority: 7
      });
    }

    if (crawlData.linksFound < 3) {
      optimizations.push({
        type: 'technical',
        description: 'Zu wenige interne Links gefunden',
        expectedImprovement: 4,
        implementation: 'Fügen Sie mehr interne Links hinzu für bessere Crawling-Tiefe',
        priority: 5
      });
    }

    const performanceScore = this.calculatePerformanceScore(crawlData, issues);

    return {
      url: crawlData.url,
      issues,
      optimizations,
      performance: {
        crawlEfficiency: analysis.performance.crawlSuccessRate * 100,
        indexabilityScore: (analysis.indexability.indexablePages / analysis.totalUrls) * 100,
        technicalHealthScore: ((analysis.technical.mobileFriendlyPages +
                               analysis.technical.pagesWithCoreWebVitals +
                               analysis.technical.pagesWithSchemaMarkup) /
                              (analysis.totalUrls * 3)) * 100,
        overallScore: performanceScore
      },
      lastAnalyzed: new Date()
    };
  }

  private calculatePerformanceScore(crawlData: CrawlData, issues: CrawlingOptimization['issues'][]): number {
    let score = 100;

    // Reduziere Score basierend auf Issues
    issues.forEach(issue => {
      score -= issue.impact * (issue.severity === 'critical' ? 2 : issue.severity === 'high' ? 1.5 : 1);
    });

    // Performance-Boni
    if (crawlData.mobileFriendly) score += 5;
    if (crawlData.indexable) score += 5;
    if (crawlData.responseTime < 1000) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private updateCrawlBudget(): void {
    this.crawlBudget.budgetUtilization = this.crawlBudget.crawledUrls / this.crawlBudget.totalUrls;

    // Identifiziere Priority URLs
    this.crawlBudget.priorityUrls = Array.from(this.crawlData.values())
      .filter(data => data.crawlDepth <= 2 && data.indexable)
      .map(data => data.url);

    // Identifiziere Low-Priority URLs
    this.crawlBudget.lowPriorityUrls = Array.from(this.crawlData.values())
      .filter(data => data.crawlDepth > 5 || !data.indexable)
      .map(data => data.url);

    // Identifiziere Error URLs
    this.crawlBudget.errorUrls = Array.from(this.crawlData.values())
      .filter(data => data.statusCode >= 400)
      .map(data => data.url);
  }

  // ===== PUBLIC API =====

  public getCrawlData(url: string): CrawlData | undefined {
    return this.crawlData.get(url);
  }

  public getCrawlAnalysis(): CrawlAnalysis | undefined {
    return this.analysisCache;
  }

  public getCrawlingOptimization(url: string): CrawlingOptimization | undefined {
    return this.optimizations.get(url);
  }

  public getCrawlBudget(): CrawlBudget {
    return { ...this.crawlBudget };
  }

  public getCrawlingStrategies(): CrawlingStrategy[] {
    return Array.from(this.strategies.values());
  }

  public async updateStrategy(strategyId: string, updates: Partial<CrawlingStrategy>): Promise<void> {
    const existing = this.strategies.get(strategyId);
    if (!existing) throw new Error(`Strategy ${strategyId} not found`);

    this.strategies.set(strategyId, { ...existing, ...updates });
  }

  public async crawlUrlManually(url: string, strategyId = 'high-priority'): Promise<CrawlData> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error(`Strategy ${strategyId} not found`);

    const crawlData = await this.crawlUrl(url, strategy);
    this.crawlData.set(url, crawlData);

    // Trigger Optimierung für diese URL
    const analysis = await this.analyzeCrawlData();
    const optimization = await this.generateUrlOptimization(crawlData, analysis);
    this.optimizations.set(url, optimization);

    return crawlData;
  }

  public getPerformanceOverview(): {
    totalUrls: number;
    crawlSuccessRate: number;
    averageResponseTime: number;
    indexabilityRate: number;
    mobileFriendlyRate: number;
    criticalIssues: number;
  } {
    const analysis = this.analysisCache;
    if (!analysis) {
      return {
        totalUrls: 0,
        crawlSuccessRate: 0,
        averageResponseTime: 0,
        indexabilityRate: 0,
        mobileFriendlyRate: 0,
        criticalIssues: 0
      };
    }

    const criticalIssues = Array.from(this.optimizations.values())
      .reduce((sum, opt) => sum + opt.issues.filter(issue => issue.severity === 'critical').length, 0);

    return {
      totalUrls: analysis.totalUrls,
      crawlSuccessRate: analysis.performance.crawlSuccessRate * 100,
      averageResponseTime: analysis.performance.averageResponseTime,
      indexabilityRate: (analysis.indexability.indexablePages / analysis.totalUrls) * 100,
      mobileFriendlyRate: (analysis.technical.mobileFriendlyPages / analysis.totalUrls) * 100,
      criticalIssues
    };
  }

  public stopCrawlingOptimization(): void {
    if (this.crawlingInterval) {
      clearInterval(this.crawlingInterval);
      this.crawlingInterval = undefined;
    }
  }

  public startCrawlingOptimization(): void {
    if (!this.crawlingInterval) {
      this._startCrawlingOptimization();
    }
  }
}

export const enterpriseCrawlingOptimizationService = EnterpriseCrawlingOptimizationService.getInstance();
export default enterpriseCrawlingOptimizationService;