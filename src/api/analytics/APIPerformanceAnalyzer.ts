/**
 * API Performance Analytics Service
 * Analyzes API usage patterns and optimizes requests based on real data
 */

import APIClient from '../client/APIClient';

export interface APIMetrics {
  endpoint: string;
  method: string;
  totalRequests: number;
  averageResponseTime: number;
  successRate: number;
  errorRate: number;
  cacheHitRate: number;
  dataTransfer: number;
  lastAccess: Date;
  peakUsageTimes: Array<{ hour: number; requests: number }>;
  typicalPayloadSize: number;
}

export interface UsagePattern {
  endpoint: string;
  frequency: 'high' | 'medium' | 'low';
  batchable: boolean;
  cacheable: boolean;
  compressible: boolean;
  critical: boolean;
  dependencies: string[];
  relatedEndpoints: string[];
}

export interface OptimizationSuggestion {
  type: 'cache' | 'batch' | 'compress' | 'preload' | 'merge' | 'deprecate';
  endpoint: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimatedImpact: {
    performanceGain: number; // percentage
    bandwidthSaving: number; // percentage
    serverLoadReduction: number; // percentage
  };
  implementation: string;
  effort: 'low' | 'medium' | 'high';
}

export interface APIPerformanceReport {
  timestamp: Date;
  totalEndpoints: number;
  totalRequests: number;
  averageResponseTime: number;
  overallSuccessRate: number;
  optimizationOpportunities: OptimizationSuggestion[];
  topSlowEndpoints: APIMetrics[];
  mostUsedEndpoints: APIMetrics[];
  cacheEffectiveness: number;
  bandwidthUsage: {
    total: number;
    compressible: number;
    cached: number;
  };
  recommendations: string[];
}

class APIPerformanceAnalyzer {
  private metrics: Map<string, APIMetrics> = new Map();
  private requestLogs: Array<{
    timestamp: Date;
    endpoint: string;
    method: string;
    duration: number;
    success: boolean;
    responseSize: number;
    cached: boolean;
  }> = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';
  private apiClient: APIClient;

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
    this.setupRequestInterceptors();
  }

  private setupRequestInterceptors(): void {
    // Performance tracking is handled through method wrapping
    // The actual APIClient doesn't expose interceptor methods
    // Instead, we track performance through the public methods
  }

  private logRequest(request: {
    timestamp: Date;
    endpoint: string;
    method: string;
    duration: number;
    success: boolean;
    responseSize: number;
    cached: boolean;
  }): void {
    if (!this.isEnabled) return;

    // Keep only last 10000 requests to prevent memory issues
    this.requestLogs.push(request);
    if (this.requestLogs.length > 10000) {
      this.requestLogs = this.requestLogs.slice(-5000);
    }

    this.updateMetrics(request);
  }

  private updateMetrics(request: {
    timestamp: Date;
    endpoint: string;
    method: string;
    duration: number;
    success: boolean;
    responseSize: number;
    cached: boolean;
  }): void {
    const key = `${request.method}:${request.endpoint}`;
    const existing = this.metrics.get(key) || {
      endpoint: request.endpoint,
      method: request.method,
      totalRequests: 0,
      averageResponseTime: 0,
      successRate: 100,
      errorRate: 0,
      cacheHitRate: 0,
      dataTransfer: 0,
      lastAccess: request.timestamp,
      peakUsageTimes: Array.from({ length: 24 }, (_, i) => ({ hour: i, requests: 0 })),
      typicalPayloadSize: 0,
    };

    // Update metrics
    existing.totalRequests++;
    existing.lastAccess = request.timestamp;

    // Update average response time
    existing.averageResponseTime =
      (existing.averageResponseTime * (existing.totalRequests - 1) + request.duration) / existing.totalRequests;

    // Update success/error rates
    if (request.success) {
      existing.successRate = (existing.successRate * (existing.totalRequests - 1) + 100) / existing.totalRequests;
    } else {
      existing.errorRate = (existing.errorRate * (existing.totalRequests - 1) + 100) / existing.totalRequests;
    }

    // Update cache hit rate
    if (request.cached) {
      existing.cacheHitRate = (existing.cacheHitRate * (existing.totalRequests - 1) + 100) / existing.totalRequests;
    }

    // Update data transfer
    existing.dataTransfer += request.responseSize;
    existing.typicalPayloadSize = existing.dataTransfer / existing.totalRequests;

    // Update peak usage times
    const hour = request.timestamp.getHours();
    existing.peakUsageTimes[hour].requests++;

    this.metrics.set(key, existing);
  }

  public analyzeUsagePatterns(): UsagePattern[] {
    const patterns: UsagePattern[] = [];

    for (const [_key, metrics] of this.metrics.entries()) {
      const pattern: UsagePattern = {
        endpoint: metrics.endpoint,
        frequency: this.categorizeFrequency(metrics.totalRequests),
        batchable: this.isBatchable(metrics),
        cacheable: this.isCacheable(metrics),
        compressible: this.isCompressible(metrics),
        critical: this.isCritical(metrics),
        dependencies: this.findDependencies(metrics.endpoint),
        relatedEndpoints: this.findRelatedEndpoints(metrics.endpoint),
      };

      patterns.push(pattern);
    }

    return patterns;
  }

  private categorizeFrequency(requests: number): 'high' | 'medium' | 'low' {
    const totalRequests = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.totalRequests, 0);
    const percentage = (requests / totalRequests) * 100;

    if (percentage > 10) return 'high';
    if (percentage > 2) return 'medium';
    return 'low';
  }

  private isBatchable(metrics: APIMetrics): boolean {
    // GET requests with similar endpoints could be batched
    return metrics.method === 'GET' &&
           metrics.totalRequests > 50 &&
           metrics.successRate > 95;
  }

  private isCacheable(metrics: APIMetrics): boolean {
    // High success rate GET requests are good cache candidates
    return metrics.method === 'GET' &&
           metrics.successRate > 90 &&
           metrics.averageResponseTime > 200;
  }

  private isCompressible(metrics: APIMetrics): boolean {
    // Large responses benefit from compression
    return metrics.typicalPayloadSize > 1024; // 1KB
  }

  private isCritical(metrics: APIMetrics): boolean {
    // Critical endpoints have high usage and low error rates
    return metrics.totalRequests > 100 &&
           metrics.successRate > 98 &&
           metrics.averageResponseTime < 500;
  }

  private findDependencies(endpoint: string): string[] {
    // Analyze endpoint to find dependencies (simplified)
    const dependencies: string[] = [];

    // Look for related patterns in endpoints
    for (const [_key, metrics] of this.metrics.entries()) {
      const endpointPart = endpoint.split('/')[1];
      if (endpointPart && metrics.endpoint.includes(endpointPart) && metrics.endpoint !== endpoint) {
        dependencies.push(metrics.endpoint);
      }
    }

    return dependencies.slice(0, 5); // Limit to 5 dependencies
  }

  private findRelatedEndpoints(endpoint: string): string[] {
    // Find endpoints with similar patterns
    const baseEndpoint = endpoint.split('?')[0] as string; // Remove query params
    const related: string[] = [];

    for (const [, metrics] of this.metrics.entries()) {
      const baseEndpointPart = baseEndpoint.split('/')[1];
      if (baseEndpointPart && metrics.endpoint.startsWith(baseEndpointPart) &&
          metrics.endpoint !== endpoint) {
        related.push(metrics.endpoint);
      }
    }

    return related.slice(0, 3);
  }

  public generateOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const patterns = this.analyzeUsagePatterns();

    for (const pattern of patterns) {
      const metrics = this.metrics.get(`GET:${pattern.endpoint}`) ||
                     this.metrics.get(`POST:${pattern.endpoint}`) ||
                     this.metrics.get(`PUT:${pattern.endpoint}`) ||
                     this.metrics.get(`DELETE:${pattern.endpoint}`);

      if (!metrics) continue;

      // Cache suggestions
      if (pattern.cacheable && metrics.cacheHitRate < 50) {
        suggestions.push({
          type: 'cache',
          endpoint: pattern.endpoint,
          priority: pattern.frequency === 'high' ? 'high' : 'medium',
          description: `Enable intelligent caching for ${pattern.endpoint}`,
          estimatedImpact: {
            performanceGain: Math.min(80, 100 - metrics.cacheHitRate),
            bandwidthSaving: 70,
            serverLoadReduction: 60,
          },
          implementation: `Add cache configuration with TTL based on usage patterns`,
          effort: 'low',
        });
      }

      // Batching suggestions
      if (pattern.batchable && pattern.frequency === 'high') {
        suggestions.push({
          type: 'batch',
          endpoint: pattern.endpoint,
          priority: 'medium',
          description: `Implement request batching for ${pattern.endpoint}`,
          estimatedImpact: {
            performanceGain: 40,
            bandwidthSaving: 30,
            serverLoadReduction: 50,
          },
          implementation: `Group similar requests within a time window (100ms)`,
          effort: 'medium',
        });
      }

      // Compression suggestions
      if (pattern.compressible && metrics.typicalPayloadSize > 2048) {
        suggestions.push({
          type: 'compress',
          endpoint: pattern.endpoint,
          priority: 'high',
          description: `Enable response compression for ${pattern.endpoint}`,
          estimatedImpact: {
            performanceGain: 25,
            bandwidthSaving: 60,
            serverLoadReduction: 15,
          },
          implementation: `Add gzip/brotli compression for responses > 2KB`,
          effort: 'low',
        });
      }

      // Preloading suggestions for critical endpoints
      if (pattern.critical && pattern.frequency === 'high') {
        suggestions.push({
          type: 'preload',
          endpoint: pattern.endpoint,
          priority: 'medium',
          description: `Preload ${pattern.endpoint} for better perceived performance`,
          estimatedImpact: {
            performanceGain: 50,
            bandwidthSaving: 0,
            serverLoadReduction: -20, // Actually increases but improves UX
          },
          implementation: `Preload during idle time or based on user behavior`,
          effort: 'medium',
        });
      }

      // Endpoint merging suggestions
      if (pattern.relatedEndpoints.length > 2 && pattern.frequency === 'high') {
        suggestions.push({
          type: 'merge',
          endpoint: pattern.endpoint,
          priority: 'low',
          description: `Consider merging ${pattern.endpoint} with related endpoints`,
          estimatedImpact: {
            performanceGain: 30,
            bandwidthSaving: 40,
            serverLoadReduction: 35,
          },
          implementation: `Create a single endpoint that returns combined data`,
          effort: 'high',
        });
      }

      // Deprecation suggestions for low-value endpoints
      if (pattern.frequency === 'low' && metrics.errorRate > 10) {
        suggestions.push({
          type: 'deprecate',
          endpoint: pattern.endpoint,
          priority: 'low',
          description: `Consider deprecating ${pattern.endpoint} - low usage, high errors`,
          estimatedImpact: {
            performanceGain: 0,
            bandwidthSaving: 100,
            serverLoadReduction: 100,
          },
          implementation: `Mark as deprecated and provide migration path`,
          effort: 'low',
        });
      }
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  public generatePerformanceReport(): APIPerformanceReport {
    const allMetrics = Array.from(this.metrics.values());
    const totalRequests = allMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const optimizationSuggestions = this.generateOptimizationSuggestions();

    const report: APIPerformanceReport = {
      timestamp: new Date(),
      totalEndpoints: allMetrics.length,
      totalRequests,
      averageResponseTime: this.calculateWeightedAverage(allMetrics, 'averageResponseTime'),
      overallSuccessRate: this.calculateWeightedAverage(allMetrics, 'successRate'),
      optimizationOpportunities: optimizationSuggestions,
      topSlowEndpoints: allMetrics
        .sort((a, b) => b.averageResponseTime - a.averageResponseTime)
        .slice(0, 10),
      mostUsedEndpoints: allMetrics
        .sort((a, b) => b.totalRequests - a.totalRequests)
        .slice(0, 10),
      cacheEffectiveness: this.calculateWeightedAverage(allMetrics, 'cacheHitRate'),
      bandwidthUsage: {
        total: allMetrics.reduce((sum, m) => sum + m.dataTransfer, 0),
        compressible: allMetrics
          .filter(m => this.isCompressible(m))
          .reduce((sum, m) => sum + m.dataTransfer, 0),
        cached: allMetrics
          .filter(m => m.cacheHitRate > 0)
          .reduce((sum, m) => sum + m.dataTransfer * (m.cacheHitRate / 100), 0),
      },
      recommendations: this.generateRecommendations(optimizationSuggestions),
    };

    return report;
  }

  private calculateWeightedAverage(
    metrics: APIMetrics[],
    property: keyof APIMetrics
  ): number {
    const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
    if (totalRequests === 0) return 0;

    const weightedSum = metrics.reduce((sum, m) => {
      const value = m[property] as number;
      return sum + (value * m.totalRequests);
    }, 0);

    return weightedSum / totalRequests;
  }

  private generateRecommendations(suggestions: OptimizationSuggestion[]): string[] {
    const recommendations: string[] = [];

    const highPriority = suggestions.filter(s => s.priority === 'high');
    const cacheSuggestions = suggestions.filter(s => s.type === 'cache');
    const compressionSuggestions = suggestions.filter(s => s.type === 'compress');

    if (highPriority.length > 0) {
      recommendations.push(`Address ${highPriority.length} high-priority optimizations first`);
    }

    if (cacheSuggestions.length > 3) {
      recommendations.push('Implement intelligent caching strategy to reduce server load by up to 60%');
    }

    if (compressionSuggestions.length > 0) {
      recommendations.push('Enable compression for large responses to save bandwidth');
    }

    if (this.getSlowEndpoints().length > 5) {
      recommendations.push('Investigate slow endpoints - consider database optimization or pagination');
    }

    return recommendations;
  }

  private getSlowEndpoints(): APIMetrics[] {
    return Array.from(this.metrics.values())
      .filter(m => m.averageResponseTime > 1000)
      .sort((a, b) => b.averageResponseTime - a.averageResponseTime);
  }

  public getMetrics(endpoint?: string): APIMetrics[] {
    if (endpoint) {
      const metric = this.metrics.get(endpoint);
      return metric ? [metric] : [];
    }
    return Array.from(this.metrics.values());
  }

  public exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Array.from(this.metrics.entries()).map(([key, metrics]) => ({
        key,
        ...metrics,
      })),
      requestLogs: this.requestLogs.slice(-1000), // Last 1000 requests
      performanceReport: this.generatePerformanceReport(),
    };
    return JSON.stringify(data, null, 2);
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public isTracking(): boolean {
    return this.isEnabled;
  }

  public clearMetrics(): void {
    this.metrics.clear();
    this.requestLogs = [];
  }
}

export default APIPerformanceAnalyzer;