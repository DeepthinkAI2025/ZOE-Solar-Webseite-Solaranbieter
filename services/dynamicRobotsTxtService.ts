/**
 * Dynamic Robots.txt Management Service für ZOE Solar
 *
 * Dynamische Verwaltung von robots.txt Dateien für verschiedene
 * User-Agents, Sitemaps und Crawling-Anweisungen
 */

const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent(...args);
};

export interface RobotsDirective {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
  sitemap?: string[];
  host?: string;
}

export interface RobotsConfiguration {
  id: string;
  domain: string;
  environment: 'production' | 'staging' | 'development';
  directives: RobotsDirective[];
  customRules: Array<{
    path: string;
    action: 'allow' | 'disallow';
    userAgents?: string[];
    conditions?: {
      parameter?: string;
      value?: string;
      operator?: 'equals' | 'contains' | 'regex';
    };
  }>;
  securityRules: Array<{
    type: 'rate-limit' | 'block-bots' | 'allow-verification';
    pattern: string;
    action: 'allow' | 'disallow' | 'delay';
    value?: number;
  }>;
  lastUpdated: Date;
  active: boolean;
}

export interface CrawlingAnalytics {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  botDistribution: Record<string, number>;
  popularPaths: Array<{
    path: string;
    requests: number;
    allowed: boolean;
  }>;
  crawlEfficiency: {
    allowedRatio: number;
    blockedRatio: number;
    averageCrawlDelay: number;
  };
  securityEvents: Array<{
    timestamp: Date;
    bot: string;
    action: string;
    reason: string;
  }>;
}

export interface RobotsOptimization {
  configurationId: string;
  recommendations: Array<{
    type: 'security' | 'performance' | 'seo' | 'compliance';
    issue: string;
    solution: string;
    priority: 'high' | 'medium' | 'low';
    impact: 'positive' | 'negative' | 'neutral';
    implementation: {
      directive: string;
      value: string;
      userAgent?: string;
    };
  }>;
  generatedAt: Date;
  applied: boolean;
}

class DynamicRobotsTxtService {
  private static instance: DynamicRobotsTxtService;
  private configurations: Map<string, RobotsConfiguration> = new Map();
  private analytics: CrawlingAnalytics;
  private optimizations: Map<string, RobotsOptimization> = new Map();
  private robotsInterval?: NodeJS.Timeout;

  private constructor() {
    this.analytics = this.initializeAnalytics();
    this.initializeBaseConfigurations();
  this.scheduleRobotsOptimization();
  }

  public static getInstance(): DynamicRobotsTxtService {
    if (!DynamicRobotsTxtService.instance) {
      DynamicRobotsTxtService.instance = new DynamicRobotsTxtService();
    }
    return DynamicRobotsTxtService.instance;
  }

  private initializeAnalytics(): CrawlingAnalytics {
    return {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      botDistribution: {},
      popularPaths: [],
      crawlEfficiency: {
        allowedRatio: 0,
        blockedRatio: 0,
        averageCrawlDelay: 0
      },
      securityEvents: []
    };
  }

  private initializeBaseConfigurations(): void {
    // Production Configuration
    this.configurations.set('production-main', {
      id: 'production-main',
      domain: 'zoe-solar.de',
      environment: 'production',
      directives: [
        {
          userAgent: '*',
          allow: ['/', '/photovoltaik', '/standort', '/blog'],
          disallow: ['/admin', '/api/private', '/_next', '/node_modules'],
          crawlDelay: 1,
          sitemap: ['https://zoe-solar.de/sitemap.xml']
        },
        {
          userAgent: 'Googlebot',
          allow: ['/', '/photovoltaik', '/standort', '/blog', '/api/public'],
          disallow: ['/admin', '/api/private'],
          crawlDelay: 0,
          sitemap: ['https://zoe-solar.de/sitemap.xml']
        },
        {
          userAgent: 'Bingbot',
          allow: ['/', '/photovoltaik', '/standort'],
          disallow: ['/admin', '/api/private', '/search'],
          crawlDelay: 2
        },
        {
          userAgent: 'Slurp',
          allow: ['/'],
          disallow: ['/admin', '/api', '/search'],
          crawlDelay: 3
        }
      ],
      customRules: [
        {
          path: '/api/webhook/*',
          action: 'disallow',
          userAgents: ['*']
        },
        {
          path: '/admin/*',
          action: 'disallow',
          userAgents: ['*']
        },
        {
          path: '/checkout/*',
          action: 'allow',
          userAgents: ['Googlebot']
        }
      ],
      securityRules: [
        {
          type: 'rate-limit',
          pattern: 'aggressive-bot',
          action: 'delay',
          value: 10
        },
        {
          type: 'block-bots',
          pattern: 'malicious-bot',
          action: 'disallow'
        },
        {
          type: 'allow-verification',
          pattern: 'google-site-verification',
          action: 'allow'
        }
      ],
      lastUpdated: new Date(),
      active: true
    });

    // Staging Configuration
    this.configurations.set('staging-main', {
      id: 'staging-main',
      domain: 'staging.zoe-solar.de',
      environment: 'staging',
      directives: [
        {
          userAgent: '*',
          allow: [],
          disallow: ['/'],
          crawlDelay: 30
        },
        {
          userAgent: 'Googlebot',
          allow: ['/'],
          disallow: [],
          crawlDelay: 10
        }
      ],
      customRules: [],
      securityRules: [
        {
          type: 'block-bots',
          pattern: '*',
          action: 'disallow'
        }
      ],
      lastUpdated: new Date(),
      active: true
    });
  }

  private scheduleRobotsOptimization(): void {
    // Robots-Optimierung alle 6 Stunden
    this.robotsInterval = setInterval(() => {
      this.performRobotsOptimization();
    }, 6 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performRobotsOptimization();
  }

  private async performRobotsOptimization(): Promise<void> {
    try {
      // Analysiere Crawling-Patterns
      await this.analyzeCrawlingPatterns();

      // Optimiere Robots-Konfigurationen
      await this.optimizeRobotsConfigurations();

      // Implementiere Security-Regeln
      await this.implementSecurityRules();

      // Aktualisiere Analytics
      this.updateCrawlingAnalytics();

    } catch (error) {
      console.error('Failed to perform robots optimization:', error);
    }
  }

  private async analyzeCrawlingPatterns(): Promise<void> {
    // Simuliere Crawling-Analyse
    const mockRequests = [
      { bot: 'Googlebot', path: '/', allowed: true },
      { bot: 'Googlebot', path: '/photovoltaik', allowed: true },
      { bot: 'Bingbot', path: '/admin', allowed: false },
      { bot: 'Slurp', path: '/api/private', allowed: false },
      { bot: 'Googlebot', path: '/blog', allowed: true },
      { bot: 'UnknownBot', path: '/admin/login', allowed: false }
    ];

    this.analytics.totalRequests = mockRequests.length;
    this.analytics.allowedRequests = mockRequests.filter(r => r.allowed).length;
    this.analytics.blockedRequests = mockRequests.filter(r => !r.allowed).length;

    // Bot Distribution
    this.analytics.botDistribution = {};
    mockRequests.forEach(request => {
      this.analytics.botDistribution[request.bot] =
        (this.analytics.botDistribution[request.bot] || 0) + 1;
    });

    // Popular Paths
    const pathStats: Record<string, { requests: number; allowed: number }> = {};
    mockRequests.forEach(request => {
      if (!pathStats[request.path]) {
        pathStats[request.path] = { requests: 0, allowed: 0 };
      }
      pathStats[request.path].requests++;
      if (request.allowed) pathStats[request.path].allowed++;
    });

    this.analytics.popularPaths = Object.entries(pathStats)
      .map(([path, stats]) => ({
        path,
        requests: stats.requests,
        allowed: stats.allowed > 0
      }))
      .sort((a, b) => b.requests - a.requests);

    // Crawl Efficiency
    this.analytics.crawlEfficiency = {
      allowedRatio: this.analytics.allowedRequests / this.analytics.totalRequests,
      blockedRatio: this.analytics.blockedRequests / this.analytics.totalRequests,
      averageCrawlDelay: 1.5
    };
  }

  private async optimizeRobotsConfigurations(): Promise<void> {
    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      const recommendations = [];

      // Performance-Optimierungen
      if (this.analytics.crawlEfficiency.allowedRatio < 0.7) {
        recommendations.push({
          type: 'performance' as const,
          issue: 'Zu viele blockierte Anfragen',
          solution: 'Erlaube mehr Pfade für vertrauenswürdige Bots',
          priority: 'medium' as const,
          impact: 'positive' as const,
          implementation: {
            directive: 'Allow',
            value: '/blog/*',
            userAgent: 'Googlebot'
          }
        });
      }

      // SEO-Optimierungen
      const googlebotDirective = config.directives.find(d => d.userAgent === 'Googlebot');
      if (!googlebotDirective?.sitemap) {
        recommendations.push({
          type: 'seo' as const,
          issue: 'Fehlende Sitemap-Referenz für Google',
          solution: 'Füge Sitemap zur Googlebot-Direktive hinzu',
          priority: 'high' as const,
          impact: 'positive' as const,
          implementation: {
            directive: 'Sitemap',
            value: 'https://zoe-solar.de/sitemap.xml',
            userAgent: 'Googlebot'
          }
        });
      }

      // Security-Optimierungen
      if (!config.securityRules.some(rule => rule.type === 'rate-limit')) {
        recommendations.push({
          type: 'security' as const,
          issue: 'Keine Rate-Limiting-Regeln',
          solution: 'Implementiere Rate-Limiting für aggressive Bots',
          priority: 'high' as const,
          impact: 'positive' as const,
          implementation: {
            directive: 'Crawl-delay',
            value: '5',
            userAgent: '*'
          }
        });
      }

      // Compliance-Optimierungen
      if (!config.directives.some(d => d.userAgent === 'GPTBot')) {
        recommendations.push({
          type: 'compliance' as const,
          issue: 'Keine GPTBot-Konfiguration',
          solution: 'Konfiguriere Zugriff für KI-Training-Bots',
          priority: 'low' as const,
          impact: 'neutral' as const,
          implementation: {
            directive: 'Disallow',
            value: '/api/private/*',
            userAgent: 'GPTBot'
          }
        });
      }

      if (recommendations.length > 0) {
        const optimization: RobotsOptimization = {
          configurationId: configId,
          recommendations,
          generatedAt: new Date(),
          applied: false
        };

        this.optimizations.set(configId, optimization);
      }
    }
  }

  private async implementSecurityRules(): Promise<void> {
    // Implementiere dynamische Security-Regeln basierend auf Analytics
    for (const [configId, config] of this.configurations) {
      if (!config.active) continue;

      // Blockiere unbekannte aggressive Bots
      const unknownBotRequests = this.analytics.botDistribution['UnknownBot'] || 0;
      if (unknownBotRequests > 10) {
        config.securityRules.push({
          type: 'block-bots',
          pattern: 'UnknownBot',
          action: 'disallow'
        });
      }

      // Passe Crawl-Delays an
      if (this.analytics.crawlEfficiency.averageCrawlDelay > 3) {
        const defaultDirective = config.directives.find(d => d.userAgent === '*');
        if (defaultDirective) {
          defaultDirective.crawlDelay = Math.min(defaultDirective.crawlDelay || 1, 2);
        }
      }
    }
  }

  private updateCrawlingAnalytics(): void {
    // Aktualisiere Security Events
    const recentEvents = [
      {
        timestamp: new Date(Date.now() - 3600000),
        bot: 'AggressiveBot',
        action: 'blocked',
        reason: 'Rate limit exceeded'
      },
      {
        timestamp: new Date(Date.now() - 1800000),
        bot: 'Googlebot',
        action: 'allowed',
        reason: 'Valid crawling'
      }
    ];

    this.analytics.securityEvents.push(...recentEvents);

    // Behalte nur letzte 100 Events
    if (this.analytics.securityEvents.length > 100) {
      this.analytics.securityEvents = this.analytics.securityEvents.slice(-100);
    }
  }

  // ===== PUBLIC API =====

  public getRobotsTxt(domain: string, environment: string = 'production'): string {
    const config = Array.from(this.configurations.values())
      .find(c => c.domain === domain && c.environment === environment);

    if (!config) {
      return this.generateDefaultRobotsTxt(domain);
    }

    return this.generateRobotsTxtFromConfig(config);
  }

  private generateRobotsTxtFromConfig(config: RobotsConfiguration): string {
    let robotsTxt = '';

    // Standard Header
    robotsTxt += `# Robots.txt for ${config.domain}\n`;
    robotsTxt += `# Generated by ZOE Solar Dynamic Robots Service\n`;
    robotsTxt += `# Last updated: ${config.lastUpdated.toISOString()}\n\n`;

    // User-Agent Direktiven
    for (const directive of config.directives) {
      robotsTxt += `User-agent: ${directive.userAgent}\n`;

      // Allow Regeln
      directive.allow.forEach(path => {
        robotsTxt += `Allow: ${path}\n`;
      });

      // Disallow Regeln
      directive.disallow.forEach(path => {
        robotsTxt += `Disallow: ${path}\n`;
      });

      // Crawl-Delay
      if (directive.crawlDelay !== undefined) {
        robotsTxt += `Crawl-delay: ${directive.crawlDelay}\n`;
      }

      // Sitemap
      if (directive.sitemap) {
        directive.sitemap.forEach(sitemap => {
          robotsTxt += `Sitemap: ${sitemap}\n`;
        });
      }

      // Host (für mehrere Domains)
      if (directive.host) {
        robotsTxt += `Host: ${directive.host}\n`;
      }

      robotsTxt += '\n';
    }

    // Custom Rules
    if (config.customRules.length > 0) {
      robotsTxt += '# Custom Rules\n';
      for (const rule of config.customRules) {
        const userAgents = rule.userAgents || ['*'];
        userAgents.forEach(userAgent => {
          robotsTxt += `User-agent: ${userAgent}\n`;
          robotsTxt += `${rule.action === 'allow' ? 'Allow' : 'Disallow'}: ${rule.path}\n`;
        });
        robotsTxt += '\n';
      }
    }

    return robotsTxt;
  }

  private generateDefaultRobotsTxt(domain: string): string {
    return `# Default Robots.txt for ${domain}
# Generated by ZOE Solar Dynamic Robots Service

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Disallow: /_next/
Crawl-delay: 1

Sitemap: https://${domain}/sitemap.xml
`;
  }

  public getConfiguration(domain: string, environment: string = 'production'): RobotsConfiguration | null {
    return Array.from(this.configurations.values())
      .find(c => c.domain === domain && c.environment === environment) || null;
  }

  public getAllConfigurations(): RobotsConfiguration[] {
    return Array.from(this.configurations.values());
  }

  public getAllRobotsTxt(): RobotsConfiguration[] {
    return this.getAllConfigurations();
  }

  public getCrawlingAnalytics(): CrawlingAnalytics {
    return { ...this.analytics };
  }

  public getOptimizationRecommendations(configId: string): RobotsOptimization | null {
    return this.optimizations.get(configId) || null;
  }

  public async createConfiguration(config: Omit<RobotsConfiguration, 'id' | 'lastUpdated'>): Promise<string> {
    const id = `robots-${config.domain}-${config.environment}-${Date.now()}`;
    const newConfig: RobotsConfiguration = {
      ...config,
      id,
      lastUpdated: new Date()
    };

    this.configurations.set(id, newConfig);
    return id;
  }

  public async updateConfiguration(configId: string, updates: Partial<RobotsConfiguration>): Promise<void> {
    const existing = this.configurations.get(configId);
    if (!existing) throw new Error(`Configuration ${configId} not found`);

    this.configurations.set(configId, {
      ...existing,
      ...updates,
      lastUpdated: new Date()
    });
  }

  public async applyOptimization(configId: string, recommendationIndex: number): Promise<void> {
    const optimization = this.optimizations.get(configId);
    if (!optimization) throw new Error(`Optimization ${configId} not found`);

    const recommendation = optimization.recommendations[recommendationIndex];
    if (!recommendation) throw new Error(`Recommendation ${recommendationIndex} not found`);

    const config = this.configurations.get(configId);
    if (!config) throw new Error(`Configuration ${configId} not found`);

    // Implementiere die Empfehlung
    await this.implementRecommendation(config, recommendation);

    // Markiere als angewendet
    optimization.applied = true;
    config.lastUpdated = new Date();
  }

  private async implementRecommendation(config: RobotsConfiguration, recommendation: any): Promise<void> {
    switch (recommendation.implementation.directive) {
      case 'Allow':
        const allowDirective = config.directives.find(d =>
          d.userAgent === recommendation.implementation.userAgent);
        if (allowDirective) {
          allowDirective.allow.push(recommendation.implementation.value);
        }
        break;

      case 'Disallow':
        const disallowDirective = config.directives.find(d =>
          d.userAgent === recommendation.implementation.userAgent);
        if (disallowDirective) {
          disallowDirective.disallow.push(recommendation.implementation.value);
        }
        break;

      case 'Sitemap':
        const sitemapDirective = config.directives.find(d =>
          d.userAgent === recommendation.implementation.userAgent);
        if (sitemapDirective) {
          sitemapDirective.sitemap = sitemapDirective.sitemap || [];
          sitemapDirective.sitemap.push(recommendation.implementation.value);
        }
        break;

      case 'Crawl-delay':
        const delayDirective = config.directives.find(d =>
          d.userAgent === recommendation.implementation.userAgent || '*');
        if (delayDirective) {
          delayDirective.crawlDelay = parseInt(recommendation.implementation.value);
        }
        break;
    }
  }

  public async addSecurityRule(configId: string, rule: RobotsConfiguration['securityRules'][0]): Promise<void> {
    const config = this.configurations.get(configId);
    if (!config) throw new Error(`Configuration ${configId} not found`);

    config.securityRules.push(rule);
    config.lastUpdated = new Date();
  }

  public async trackCrawlingEvent(bot: string, path: string, allowed: boolean, userAgent?: string): Promise<void> {
    this.analytics.totalRequests++;

    if (allowed) {
      this.analytics.allowedRequests++;
    } else {
      this.analytics.blockedRequests++;
    }

    // Update Bot Distribution
    this.analytics.botDistribution[bot] = (this.analytics.botDistribution[bot] || 0) + 1;

    // Update Popular Paths
    const existingPath = this.analytics.popularPaths.find(p => p.path === path);
    if (existingPath) {
      existingPath.requests++;
      if (allowed) existingPath.allowed = true;
    } else {
      this.analytics.popularPaths.push({
        path,
        requests: 1,
        allowed
      });
    }

    // Sort Popular Paths
    this.analytics.popularPaths.sort((a, b) => b.requests - a.requests);
    if (this.analytics.popularPaths.length > 50) {
      this.analytics.popularPaths = this.analytics.popularPaths.slice(0, 50);
    }
  }

  public stopRobotsOptimization(): void {
    if (this.robotsInterval) {
      clearInterval(this.robotsInterval);
      this.robotsInterval = undefined;
    }
  }

  public startRobotsOptimization(): void {
    if (!this.robotsInterval) {
      this.scheduleRobotsOptimization();
    }
  }
}

export const dynamicRobotsTxtService = DynamicRobotsTxtService.getInstance();
export default dynamicRobotsTxtService;