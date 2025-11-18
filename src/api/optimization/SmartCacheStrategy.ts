/**
 * Smart Cache Strategy with Usage-Based Optimization
 * Implements intelligent caching based on usage patterns and performance data
 */

import APIPerformanceAnalyzer, { APIMetrics } from '../analytics/APIPerformanceAnalyzer';

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in MB
  strategy: 'lru' | 'lfu' | 'ttl' | 'adaptive';
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  preloadEnabled: boolean;
  staleWhileRevalidate: boolean;
}

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccess: number;
  size: number;
  compressed: boolean;
  metadata?: Record<string, unknown>;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  compressionRatio: number;
  averageAccessTime: number;
 热点命中率: Map<string, number>; // Hot-endpoint hit rates
}

export interface PreloadConfig {
  endpoint: string;
  priority: 'high' | 'medium' | 'low';
  trigger: 'idle' | 'user-behavior' | 'scheduled' | 'dependency';
  conditions?: {
    timeOfDay?: [number, number];
    userSegment?: string[];
    pages?: string[];
    dependencies?: string[];
  };
}

class SmartCacheStrategy {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = [];
  private stats: CacheStats;
  private config: CacheConfig;
  private performanceAnalyzer: APIPerformanceAnalyzer;
  private isInitialized: boolean = false;

  constructor(performanceAnalyzer: APIPerformanceAnalyzer, config?: Partial<CacheConfig>) {
    this.performanceAnalyzer = performanceAnalyzer;
    this.config = {
      ttl: 300000, // 5 minutes default
      maxSize: 50, // 50MB default
      strategy: 'adaptive',
      compressionEnabled: true,
      encryptionEnabled: false,
      preloadEnabled: true,
      staleWhileRevalidate: true,
      ...config,
    };

    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      evictionCount: 0,
      compressionRatio: 0,
      averageAccessTime: 0,
      热点命中率: new Map(),
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load cache from localStorage if available
    try {
      const stored = localStorage.getItem('smart-cache-data');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data.entries);
        this.accessOrder = data.accessOrder || [];
        this.updateStats();
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }

    // Start cache maintenance
    this.startMaintenance();

    // Setup preload strategies
    if (this.config.preloadEnabled) {
      this.setupPreloadStrategies();
    }

    this.isInitialized = true;
  }

  public async get<T = unknown>(key: string): Promise<T | null> {
    const startTime = performance.now();

    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.missRate++;
      this.updateStats();
      return null;
    }

    // Check if entry is expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.missRate++;
      this.updateStats();

      // Stale-while-revalidate: return stale data if enabled
      if (this.config.staleWhileRevalidate) {
        this.scheduleRevalidation(key);
        return entry.value as T;
      }

      return null;
    }

    // Update access information
    entry.hits++;
    entry.lastAccess = Date.now();
    this.updateAccessOrder(key);

    this.stats.hitRate++;
    this.updateStats();

    // Update performance tracking
    const accessTime = performance.now() - startTime;
    this.stats.averageAccessTime =
      (this.stats.averageAccessTime + accessTime) / 2;

    return entry.value as T;
  }

  public async set<T = unknown>(
    key: string,
    value: T,
    options?: {
      ttl?: number;
      metadata?: Record<string, unknown>;
      priority?: 'high' | 'medium' | 'low';
    }
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);
    const size = this.calculateSize(serializedValue);
    let processedValue = value;

    // Compress if enabled and beneficial
    let compressed = false;
    if (this.config.compressionEnabled && size > 1024) { // 1KB threshold
      processedValue = await this.compress(serializedValue);
      compressed = true;
    }

    const entry: CacheEntry<T> = {
      key,
      value: processedValue as T,
      timestamp: Date.now(),
      ttl: options?.ttl || this.config.ttl,
      hits: 0,
      lastAccess: Date.now(),
      size,
      compressed,
      metadata: options?.metadata,
    };

    // Check if we need to evict entries
    await this.ensureCapacity(size);

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
    this.updateStats();

    // Persist to localStorage
    this.persistToStorage();
  }

  private async ensureCapacity(requiredSize: number): Promise<void> {
    const currentSize = this.stats.totalSize;
    const maxSizeBytes = this.config.maxSize * 1024 * 1024; // Convert MB to bytes

    if (currentSize + requiredSize <= maxSizeBytes) {
      return;
    }

    // Evict entries based on strategy
    switch (this.config.strategy) {
      case 'lru':
        await this.evictLRU(requiredSize);
        break;
      case 'lfu':
        await this.evictLFU(requiredSize);
        break;
      case 'ttl':
        await this.evictExpired();
        break;
      case 'adaptive':
        await this.evictAdaptive(requiredSize);
        break;
    }
  }

  private async evictLRU(requiredSize: number): Promise<void> {
    let freedSpace = 0;
    const keysToRemove: string[] = [];

    for (const key of this.accessOrder) {
      const entry = this.cache.get(key);
      if (entry) {
        keysToRemove.push(key);
        freedSpace += entry.size;

        if (freedSpace >= requiredSize) break;
      }
    }

    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.evictionCount++;
    }
  }

  private async evictLFU(requiredSize: number): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.hits - b.hits);

    let freedSpace = 0;
    const keysToRemove: string[] = [];

    for (const [key, entry] of entries) {
      keysToRemove.push(key);
      freedSpace += entry.size;

      if (freedSpace >= requiredSize) break;
    }

    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.evictionCount++;
    }
  }

  private async evictExpired(): Promise<void> {
    const keysToRemove: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.evictionCount++;
    }
  }

  private async evictAdaptive(requiredSize: number): Promise<void> {
    // Adaptive strategy considers multiple factors:
    // - Usage patterns from performance analyzer
    // - Hit rates
    // - Access frequency
    // - Data size vs. value ratio

    const metrics = this.performanceAnalyzer.getMetrics();
    const endpointScores = new Map<string, number>();

    // Calculate scores for each cached entry
    for (const [key, entry] of this.cache.entries()) {
      const endpointMetrics = metrics.find((m: APIMetrics) => m.endpoint === key);

      let score = entry.hits; // Base score from hits

      if (endpointMetrics) {
        // Boost score for high-value endpoints
        score += endpointMetrics.totalRequests * 0.1;
        score += (100 - endpointMetrics.averageResponseTime) * 0.05;
        score += endpointMetrics.successRate * 0.1;
      }

      // Penalize large entries (less cache-efficient)
      score -= entry.size * 0.00001;

      endpointScores.set(key, score);
    }

    // Sort by score (lowest first) and evict
    const sortedEntries = Array.from(endpointScores.entries())
      .sort(([, a], [, b]) => a - b);

    let freedSpace = 0;
    const keysToRemove: string[] = [];

    for (const [key] of sortedEntries) {
      const entry = this.cache.get(key);
      if (entry) {
        keysToRemove.push(key);
        freedSpace += entry.size;

        if (freedSpace >= requiredSize) break;
      }
    }

    for (const key of keysToRemove) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.evictionCount++;
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private updateStats(): void {
    this.stats.totalEntries = this.cache.size;
    this.stats.totalSize = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.size, 0);

    const totalAccesses = this.stats.hitRate + this.stats.missRate;
    if (totalAccesses > 0) {
      this.stats.hitRate = (this.stats.hitRate / totalAccesses) * 100;
      this.stats.missRate = (this.stats.missRate / totalAccesses) * 100;
    }

    // Calculate compression ratio
    const compressedEntries = Array.from(this.cache.values())
      .filter(entry => entry.compressed);

    if (compressedEntries.length > 0) {
      const originalSize = compressedEntries.reduce((sum, entry) => sum + entry.size, 0);
      const compressedSize = compressedEntries.reduce((sum, entry) =>
        sum + JSON.stringify(entry.value).length, 0);

      this.stats.compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;
    }
  }

  private calculateSize(data: string): number {
    return new Blob([data]).size;
  }

  private async compress(data: string): Promise<string> {
    // Simple compression simulation (in real implementation, use compression library)
    return btoa(data);
  }

  private async decompress(data: string): Promise<string> {
    // Simple decompression simulation
    return atob(data);
  }

  private scheduleRevalidation(key: string): void {
    // In a real implementation, this would trigger a background refresh
    setTimeout(() => {
      console.log(`Revalidating cache entry: ${key}`);
    }, 0);
  }

  private setupPreloadStrategies(): void {
    // Analyze usage patterns to identify preload candidates
    const metrics = this.performanceAnalyzer.getMetrics();
    const highUsageEndpoints = metrics
      .filter((m: APIMetrics) => m.totalRequests > 100 && m.successRate > 95)
      .sort((a: APIMetrics, b: APIMetrics) => b.totalRequests - a.totalRequests)
      .slice(0, 10);

    // Create preload configurations
    const preloadConfigs: PreloadConfig[] = highUsageEndpoints.map((endpoint: APIMetrics) => ({
      endpoint: endpoint.endpoint,
      priority: endpoint.totalRequests > 500 ? 'high' : 'medium',
      trigger: 'user-behavior' as const,
      conditions: {
        timeOfDay: this.getPeakHours(endpoint),
        dependencies: this.findDependencies(endpoint.endpoint),
      },
    }));

    // Register preload strategies
    this.registerPreloadStrategies(preloadConfigs);
  }

  private getPeakHours(metrics: APIMetrics): [number, number] {
    const peakHour = metrics.peakUsageTimes
      .reduce((max, current) => current.requests > max.requests ? current : max)
      .hour;

    return [peakHour - 1, peakHour + 1]; // 2-hour window around peak
  }

  private findDependencies(endpoint: string): string[] {
    // Simplified dependency detection
    const parts = endpoint.split('/');
    return parts.slice(0, -1); // Parent endpoints as dependencies
  }

  private registerPreloadStrategies(configs: PreloadConfig[]): void {
    // In a real implementation, this would register with a preload manager
    console.log('Registering preload strategies:', configs);
  }

  private startMaintenance(): void {
    // Run maintenance every 5 minutes
    setInterval(() => {
      this.performMaintenance();
    }, 300000);
  }

  private performMaintenance(): void {
    // Evict expired entries
    this.evictExpired();

    // Update stats
    this.updateStats();

    // Persist to storage
    this.persistToStorage();

    // Log performance metrics
    if (this.stats.hitRate < 50 && this.stats.totalEntries > 10) {
      console.warn('Low cache hit rate detected:', this.stats.hitRate);
    }
  }

  private persistToStorage(): void {
    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        timestamp: Date.now(),
      };
      localStorage.setItem('smart-cache-data', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error);
    }
  }

  public getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  public getEntry(key: string): CacheEntry | undefined {
    return this.cache.get(key);
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
      this.updateStats();
      this.persistToStorage();
    }
    return deleted;
  }

  public clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      evictionCount: 0,
      compressionRatio: 0,
      averageAccessTime: 0,
      热点命中率: new Map(),
    };
    this.persistToStorage();
  }

  public updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reinitialize if strategy changed
    if (newConfig.strategy) {
      this.initialize();
    }
  }

  public getOptimizationReport(): {
    stats: CacheStats;
    recommendations: string[];
    topEntries: Array<{ key: string; hits: number; size: number; hitRate: number }>;
  } {
    const entries = Array.from(this.cache.values());

    const topEntries = entries
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10)
      .map(entry => ({
        key: entry.key,
        hits: entry.hits,
        size: entry.size,
        hitRate: entry.hits > 0 ? 100 : 0, // Simplified hit rate
      }));

    const recommendations: string[] = [];

    if (this.stats.hitRate < 60) {
      recommendations.push('Consider increasing TTL for frequently accessed data');
    }

    if (this.stats.compressionRatio < 30 && this.stats.totalSize > 10 * 1024 * 1024) {
      recommendations.push('Enable compression for large cache entries');
    }

    if (this.stats.evictionCount > 100) {
      recommendations.push('Consider increasing cache size or optimizing eviction strategy');
    }

    return {
      stats: this.getStats(),
      recommendations,
      topEntries,
    };
  }
}

export default SmartCacheStrategy;