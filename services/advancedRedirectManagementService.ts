/**
 * Advanced Redirect Management Service für ZOE Solar
 *
 * Umfassendes Management von Redirects für optimale User Experience
 * und SEO nach Website-Änderungen
 */

import { getAIGatewayService } from './core/AIGatewayService.js';

// Wrapper für KI-Keyword-Optimierung (OpenRouter/Mistral)
const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent.apply(aiGateway, args);
};

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  type: '301' | '302' | '307' | '308';
  conditions?: {
    userAgent?: string;
    ipRange?: string;
    geoLocation?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    queryParameters?: Record<string, string>;
  };
  priority: number;
  active: boolean;
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  performance: {
    responseTime: number;
    successRate: number;
    userSatisfaction: number;
  };
}

export interface RedirectChain {
  id: string;
  startUrl: string;
  endUrl: string;
  chain: string[];
  length: number;
  type: 'valid' | 'redirect-loop' | 'too-long' | 'broken';
  lastChecked: Date;
  fixRecommendation?: string;
}

export interface RedirectAnalytics {
  totalRedirects: number;
  activeRedirects: number;
  redirectChains: number;
  brokenRedirects: number;
  performance: {
    averageResponseTime: number;
    successRate: number;
    userSatisfaction: number;
  };
  usage: {
    dailyHits: number;
    topRedirects: Array<{
      sourceUrl: string;
      hits: number;
      conversionRate: number;
    }>;
    redirectTypes: Record<string, number>;
  };
  issues: {
    loops: number;
    brokenChains: number;
    slowRedirects: number;
  };
}

export interface BulkRedirectOperation {
  id: string;
  type: 'migration' | 'restructure' | 'cleanup' | 'optimization';
  description: string;
  rules: RedirectRule[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  errors?: string[];
}

export interface RedirectPattern {
  id: string;
  pattern: string;
  replacement: string;
  type: 'regex' | 'wildcard';
  description: string;
  examples: Array<{
    source: string;
    target: string;
  }>;
  active: boolean;
  usageCount: number;
}

class AdvancedRedirectManagementService {
  private static instance: AdvancedRedirectManagementService;
  private redirectRules: Map<string, RedirectRule> = new Map();
  private redirectChains: Map<string, RedirectChain> = new Map();
  private redirectPatterns: Map<string, RedirectPattern> = new Map();
  private bulkOperations: Map<string, BulkRedirectOperation> = new Map();
  private analytics: RedirectAnalytics;
  private redirectInterval?: NodeJS.Timeout;

  private constructor() {
    this.analytics = this.initializeAnalytics();
    this.initializeDefaultRules();
    this.initializeRedirectPatterns();
    this.startRedirectMonitoring();
  }

  public static getInstance(): AdvancedRedirectManagementService {
    if (!AdvancedRedirectManagementService.instance) {
      AdvancedRedirectManagementService.instance = new AdvancedRedirectManagementService();
    }
    return AdvancedRedirectManagementService.instance;
  }

  private initializeAnalytics(): RedirectAnalytics {
    return {
      totalRedirects: 0,
      activeRedirects: 0,
      redirectChains: 0,
      brokenRedirects: 0,
      performance: {
        averageResponseTime: 0,
        successRate: 0,
        userSatisfaction: 0
      },
      usage: {
        dailyHits: 0,
        topRedirects: [],
        redirectTypes: {}
      },
      issues: {
        loops: 0,
        brokenChains: 0,
        slowRedirects: 0
      }
    };
  }

  private initializeDefaultRules(): void {
    // Migration von alter Domain
    this.redirectRules.set('domain-migration', {
      id: 'domain-migration',
      sourceUrl: 'https://alte-domain.de/*',
      targetUrl: 'https://zoe-solar.de/$1',
      type: '301',
      priority: 10,
      active: true,
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date(),
      usageCount: 1250,
      performance: {
        responseTime: 150,
        successRate: 0.98,
        userSatisfaction: 0.95
      }
    });

    // URL-Struktur Änderungen
    this.redirectRules.set('url-restructure-2024', {
      id: 'url-restructure-2024',
      sourceUrl: '/photovoltaik-angebote/*',
      targetUrl: '/photovoltaik/$1',
      type: '301',
      priority: 9,
      active: true,
      createdAt: new Date('2024-06-01'),
      lastUsed: new Date(),
      usageCount: 890,
      performance: {
        responseTime: 120,
        successRate: 0.99,
        userSatisfaction: 0.97
      }
    });

    // Mobile-spezifische Redirects
    this.redirectRules.set('mobile-redirect', {
      id: 'mobile-redirect',
      sourceUrl: '/kontakt',
      targetUrl: 'tel:+4930123456',
      type: '302',
      conditions: {
        deviceType: 'mobile'
      },
      priority: 8,
      active: true,
      createdAt: new Date('2024-03-15'),
      lastUsed: new Date(),
      usageCount: 450,
      performance: {
        responseTime: 80,
        successRate: 1.0,
        userSatisfaction: 0.92
      }
    });

    // Geo-spezifische Redirects
    this.redirectRules.set('geo-redirect-bayern', {
      id: 'geo-redirect-bayern',
      sourceUrl: '/agri-pv',
      targetUrl: '/agri-pv/bayern',
      type: '302',
      conditions: {
        geoLocation: 'Bayern'
      },
      priority: 7,
      active: true,
      createdAt: new Date('2024-04-01'),
      lastUsed: new Date(),
      usageCount: 320,
      performance: {
        responseTime: 95,
        successRate: 0.96,
        userSatisfaction: 0.94
      }
    });
  }

  private initializeRedirectPatterns(): void {
    // Blog-Migration Pattern
    this.redirectPatterns.set('blog-migration', {
      id: 'blog-migration',
      pattern: '/blog/(\\d{4})/(\\d{2})/(.+)',
      replacement: '/blog/$3',
      type: 'regex',
      description: 'Migration von datierten Blog-URLs zu SEO-freundlichen URLs',
      examples: [
        {
          source: '/blog/2024/01/photovoltaik-trends',
          target: '/blog/photovoltaik-trends'
        }
      ],
      active: true,
      usageCount: 234
    });

    // Produkt-Kategorie Pattern
    this.redirectPatterns.set('product-category', {
      id: 'product-category',
      pattern: '/produkte/(.+)',
      replacement: '/photovoltaik/$1',
      type: 'regex',
      description: 'Migration von alter Produkt-Kategorie zu neuer Photovoltaik-Struktur',
      examples: [
        {
          source: '/produkte/hausdach',
          target: '/photovoltaik/hausdach'
        }
      ],
      active: true,
      usageCount: 567
    });

    // Standort-Pattern
    this.redirectPatterns.set('location-wildcard', {
      id: 'location-wildcard',
      pattern: '/standorte/*',
      replacement: '/standort/$1',
      type: 'wildcard',
      description: 'Plural zu Singular für Standort-URLs',
      examples: [
        {
          source: '/standorte/berlin',
          target: '/standort/berlin'
        }
      ],
      active: true,
      usageCount: 189
    });
  }

  private _startRedirectMonitoring(): void {
    // Redirect-Monitoring alle 4 Stunden
    this.redirectInterval = setInterval(() => {
      this.performRedirectMonitoring();
    }, 4 * 60 * 60 * 1000);

    // Initiales Monitoring
    this.performRedirectMonitoring();
  }

  private async performRedirectMonitoring(): Promise<void> {
    try {
      // Analysiere Redirect-Ketten
      await this.analyzeRedirectChains();

      // Überprüfe Redirect-Performance
      await this.checkRedirectPerformance();

      // Identifiziere Probleme
      await this.identifyRedirectIssues();

      // Optimiere Redirect-Regeln
      await this.optimizeRedirectRules();

      // Aktualisiere Analytics
      this.updateRedirectAnalytics();

    } catch (error) {
      console.error('Failed to perform redirect monitoring:', error);
    }
  }

  private async analyzeRedirectChains(): Promise<void> {
    const chains: RedirectChain[] = [];

    // Simuliere Chain-Analyse
    const mockChains = [
      {
        startUrl: '/old-page',
        endUrl: '/new-page',
        chain: ['/old-page', '/intermediate-page', '/new-page'],
        length: 3,
        type: 'valid' as const
      },
      {
        startUrl: '/loop-page',
        endUrl: '/loop-page',
        chain: ['/loop-page', '/loop-page'],
        length: 2,
        type: 'redirect-loop' as const,
        fixRecommendation: 'Entferne zirkuläre Redirect-Regel'
      }
    ];

    for (const chain of mockChains) {
      const chainId = `chain-${chain.startUrl.replace(/\//g, '-')}`;
      chains.push({
        id: chainId,
        ...chain,
        lastChecked: new Date()
      });
    }

    // Speichere Chains
    chains.forEach(chain => {
      this.redirectChains.set(chain.id, chain);
    });
  }

  private async checkRedirectPerformance(): Promise<void> {
    for (const [ruleId, rule] of this.redirectRules) {
      if (!rule.active) continue;

      // Simuliere Performance-Check
      const mockPerformance = {
        responseTime: 80 + Math.random() * 100,
        successRate: 0.95 + Math.random() * 0.05,
        userSatisfaction: 0.90 + Math.random() * 0.08
      };

      rule.performance = mockPerformance;
      rule.lastUsed = new Date();
    }
  }

  private async identifyRedirectIssues(): Promise<void> {
    // Identifiziere langsame Redirects
    const slowRedirects = Array.from(this.redirectRules.values())
      .filter(rule => rule.performance.responseTime > 500);

    // Identifiziere Redirect-Loops
    const loops = Array.from(this.redirectChains.values())
      .filter(chain => chain.type === 'redirect-loop');

    // Identifiziere gebrochene Chains
    const brokenChains = Array.from(this.redirectChains.values())
      .filter(chain => chain.type === 'broken');

    this.analytics.issues = {
      loops: loops.length,
      brokenChains: brokenChains.length,
      slowRedirects: slowRedirects.length
    };
  }

  private async optimizeRedirectRules(): Promise<void> {
    // Entferne inaktive Redirects
    for (const [ruleId, rule] of this.redirectRules) {
      if (!rule.active && rule.usageCount === 0 && rule.createdAt.getTime() < Date.now() - 90 * 24 * 60 * 60 * 1000) {
        this.redirectRules.delete(ruleId);
      }
    }

    // Optimiere Chain-Längen
    for (const [chainId, chain] of this.redirectChains) {
      if (chain.length > 3) {
        // Erstelle direkten Redirect
        const directRule: RedirectRule = {
          id: `direct-${chainId}`,
          sourceUrl: chain.startUrl,
          targetUrl: chain.endUrl,
          type: '301',
          priority: 10,
          active: true,
          createdAt: new Date(),
          lastUsed: new Date(),
          usageCount: 0,
          performance: {
            responseTime: 100,
            successRate: 0.99,
            userSatisfaction: 0.96
          }
        };

        this.redirectRules.set(directRule.id, directRule);
      }
    }
  }

  private updateRedirectAnalytics(): void {
    const allRules = Array.from(this.redirectRules.values());
    const activeRules = allRules.filter(rule => rule.active);
    const allChains = Array.from(this.redirectChains.values());

    this.analytics.totalRedirects = allRules.length;
    this.analytics.activeRedirects = activeRules.length;
    this.analytics.redirectChains = allChains.length;
    this.analytics.brokenRedirects = allChains.filter(chain => chain.type === 'broken').length;

    // Performance-Metriken
    if (activeRules.length > 0) {
      this.analytics.performance.averageResponseTime =
        activeRules.reduce((sum, rule) => sum + rule.performance.responseTime, 0) / activeRules.length;

      this.analytics.performance.successRate =
        activeRules.reduce((sum, rule) => sum + rule.performance.successRate, 0) / activeRules.length;

      this.analytics.performance.userSatisfaction =
        activeRules.reduce((sum, rule) => sum + rule.performance.userSatisfaction, 0) / activeRules.length;
    }

    // Usage-Statistiken
    this.analytics.usage.dailyHits = activeRules.reduce((sum, rule) => sum + rule.usageCount, 0);

    this.analytics.usage.topRedirects = activeRules
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)
      .map(rule => ({
        sourceUrl: rule.sourceUrl,
        hits: rule.usageCount,
        conversionRate: rule.performance.userSatisfaction
      }));

    // Redirect Types
    this.analytics.usage.redirectTypes = {};
    activeRules.forEach(rule => {
      this.analytics.usage.redirectTypes[rule.type] =
        (this.analytics.usage.redirectTypes[rule.type] || 0) + 1;
    });
  }

  // ===== PUBLIC API =====

  public getRedirectForUrl(url: string, context?: {
    userAgent?: string;
    ip?: string;
    geoLocation?: string;
    deviceType?: string;
    queryParams?: Record<string, string>;
  }): { targetUrl: string; type: string } | null {
    // Finde passende Regel
    const matchingRule = this.findMatchingRule(url, context);

    if (matchingRule) {
      // Aktualisiere Usage-Statistiken
      matchingRule.usageCount++;
      matchingRule.lastUsed = new Date();

      return {
        targetUrl: this.applyRedirectPattern(matchingRule.targetUrl, url),
        type: matchingRule.type
      };
    }

    return null;
  }

  private findMatchingRule(url: string, context?: any): RedirectRule | null {
    const activeRules = Array.from(this.redirectRules.values())
      .filter(rule => rule.active)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      if (this.matchesRule(rule, url, context)) {
        return rule;
      }
    }

    return null;
  }

  private matchesRule(rule: RedirectRule, url: string, context?: any): boolean {
    // URL Pattern Matching
    if (!this.matchesUrlPattern(rule.sourceUrl, url)) {
      return false;
    }

    // Conditions Matching
    if (rule.conditions) {
      if (rule.conditions.userAgent && context?.userAgent &&
          !this.matchesPattern(rule.conditions.userAgent, context.userAgent)) {
        return false;
      }

      if (rule.conditions.deviceType && context?.deviceType &&
          rule.conditions.deviceType !== context.deviceType) {
        return false;
      }

      if (rule.conditions.geoLocation && context?.geoLocation &&
          rule.conditions.geoLocation !== context.geoLocation) {
        return false;
      }

      if (rule.conditions.queryParameters) {
        for (const [key, value] of Object.entries(rule.conditions.queryParameters)) {
          if (context?.queryParams?.[key] !== value) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private matchesUrlPattern(pattern: string, url: string): boolean {
    // Wildcard Matching
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(url);
    }

    // Exact Match
    return pattern === url;
  }

  private matchesPattern(pattern: string, value: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
    return regex.test(value);
  }

  private applyRedirectPattern(targetPattern: string, sourceUrl: string): string {
    // Pattern Replacement
    if (targetPattern.includes('$1')) {
      // Regex Capture Groups
      for (const [patternId, pattern] of this.redirectPatterns) {
        if (pattern.type === 'regex') {
          const regex = new RegExp(pattern.pattern);
          const match = sourceUrl.match(regex);
          if (match) {
            let target = targetPattern;
            match.forEach((capture, index) => {
              if (index > 0) {
                target = target.replace(`$${index}`, capture);
              }
            });
            return target;
          }
        }
      }
    }

    return targetPattern;
  }

  public getAllRedirectRules(): RedirectRule[] {
    return Array.from(this.redirectRules.values());
  }

  public getRedirectAnalytics(): RedirectAnalytics {
    return { ...this.analytics };
  }

  public getRedirectChains(): RedirectChain[] {
    return Array.from(this.redirectChains.values());
  }

  public async createRedirectRule(rule: Omit<RedirectRule, 'id' | 'createdAt' | 'lastUsed' | 'usageCount' | 'performance'>): Promise<string> {
    const id = `redirect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRule: RedirectRule = {
      ...rule,
      id,
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      performance: {
        responseTime: 100,
        successRate: 0.95,
        userSatisfaction: 0.90
      }
    };

    this.redirectRules.set(id, newRule);
    return id;
  }

  public async updateRedirectRule(ruleId: string, updates: Partial<RedirectRule>): Promise<void> {
    const existing = this.redirectRules.get(ruleId);
    if (!existing) throw new Error(`Redirect rule ${ruleId} not found`);

    this.redirectRules.set(ruleId, { ...existing, ...updates });
  }

  public async deleteRedirectRule(ruleId: string): Promise<void> {
    this.redirectRules.delete(ruleId);
  }

  public async createBulkRedirectOperation(operation: Omit<BulkRedirectOperation, 'id' | 'status' | 'progress' | 'createdAt'>): Promise<string> {
    const id = `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newOperation: BulkRedirectOperation = {
      ...operation,
      id,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    this.bulkOperations.set(id, newOperation);

    // Starte Bulk-Operation asynchron
    this.processBulkOperation(id);

    return id;
  }

  private async processBulkOperation(operationId: string): Promise<void> {
    const operation = this.bulkOperations.get(operationId);
    if (!operation) return;

    operation.status = 'processing';

    try {
      const totalRules = operation.rules.length;
      let processed = 0;

      for (const rule of operation.rules) {
        // Erstelle Redirect-Regel
        const ruleId = await this.createRedirectRule(rule);
        processed++;

        // Update Progress
        operation.progress = (processed / totalRules) * 100;

        // Simuliere Verarbeitungszeit
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      operation.status = 'completed';
      operation.completedAt = new Date();

    } catch (error) {
      operation.status = 'failed';
      operation.errors = [error instanceof Error ? error.message : 'Unknown error'];
    }
  }

  public getBulkOperationStatus(operationId: string): BulkRedirectOperation | null {
    return this.bulkOperations.get(operationId) || null;
  }

  public async createRedirectPattern(pattern: Omit<RedirectPattern, 'id' | 'usageCount'>): Promise<string> {
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPattern: RedirectPattern = {
      ...pattern,
      id,
      usageCount: 0
    };

    this.redirectPatterns.set(id, newPattern);
    return id;
  }

  public getRedirectPatterns(): RedirectPattern[] {
    return Array.from(this.redirectPatterns.values());
  }

  public async validateRedirectChains(): Promise<RedirectChain[]> {
    const invalidChains: RedirectChain[] = [];

    for (const [chainId, chain] of this.redirectChains) {
      // Prüfe auf Loops
      if (chain.type === 'redirect-loop') {
        invalidChains.push(chain);
      }

      // Prüfe auf zu lange Chains
      if (chain.length > 5) {
        chain.type = 'too-long';
        chain.fixRecommendation = 'Verkürze Redirect-Chain auf maximal 3 Redirects';
        invalidChains.push(chain);
      }

      // Prüfe auf gebrochene Chains
      const lastUrl = chain.chain[chain.chain.length - 1];
  if (lastUrl && !this.isValidUrl(lastUrl)) {
        chain.type = 'broken';
        chain.fixRecommendation = 'Überprüfe Ziel-URL auf Gültigkeit';
        invalidChains.push(chain);
      }
    }

    return invalidChains;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public async generateRedirectReport(): Promise<{
    summary: any;
    issues: any;
    recommendations: any;
  }> {
    const invalidChains = await this.validateRedirectChains();

    return {
      summary: {
        totalRedirects: this.analytics.totalRedirects,
        activeRedirects: this.analytics.activeRedirects,
        performance: this.analytics.performance
      },
      issues: {
        invalidChains: invalidChains.length,
        brokenRedirects: this.analytics.brokenRedirects,
        issues: this.analytics.issues
      },
      recommendations: [
        {
          type: 'optimization',
          action: 'Implementiere direkte Redirects für lange Chains',
          impact: 'high',
          effort: 'medium'
        },
        {
          type: 'maintenance',
          action: 'Entferne ungenutzte Redirect-Regeln',
          impact: 'medium',
          effort: 'low'
        }
      ]
    };
  }

  public stopRedirectMonitoring(): void {
    if (this.redirectInterval) {
      clearInterval(this.redirectInterval);
      this.redirectInterval = undefined;
    }
  }

  public startRedirectMonitoring(): void {
    if (!this.redirectInterval) {
      this._startRedirectMonitoring();
    }
  }
}

export const advancedRedirectManagementService = AdvancedRedirectManagementService.getInstance();
export default advancedRedirectManagementService;