/**
 * Advanced Real-Time Performance Monitor
 * Real-time performance tracking with intelligent analysis and alerting
 */

import { lighthouseIntegration, LighthouseMetrics } from '../../utils/performance/LighthouseIntegration';

export interface RealTimeMetrics {
  timestamp: number;
  pageLoad: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
    domContentLoaded: number;
    loadComplete: number;
  };
  resources: {
    totalRequests: number;
    totalSize: number;
    cachedRequests: number;
    slowRequests: number;
    failedRequests: number;
    resourceBreakdown: {
      scripts: { count: number; size: number };
      styles: { count: number; size: number };
      images: { count: number; size: number };
      fonts: { count: number; size: number };
      api: { count: number; size: number };
      other: { count: number; size: number };
    };
  };
  javascript: {
    executionTime: number;
    memoryUsage: number;
    heapSize: number;
    longTasks: Array<{
      duration: number;
      startTime: number;
      attribution: string;
    }>;
    frameRate: number;
  };
  userExperience: {
    interactionDelay: number;
    scrollPerformance: number;
    inputResponsiveness: number;
    visualStability: number;
    errorRate: number;
  };
  network: {
    connectionType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
    effectiveType: string;
  };
}

export interface PerformanceThresholds {
  pageLoad: {
    fcp: { good: number; needsImprovement: number };
    lcp: { good: number; needsImprovement: number };
    fid: { good: number; needsImprovement: number };
    cls: { good: number; needsImprovement: number };
    ttfb: { good: number; needsImprovement: number };
  };
  resources: {
    totalRequests: { good: number; needsImprovement: number };
    totalSize: { good: number; needsImprovement: number };
    slowRequestThreshold: number;
    failureRateThreshold: number;
  };
  javascript: {
    executionTime: { good: number; needsImprovement: number };
    memoryUsage: { good: number; needsImprovement: number };
    longTaskThreshold: number;
    frameRate: { good: number; needsImprovement: number };
  };
}

export interface PerformanceAlert {
  id: string;
  timestamp: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'page-load' | 'resource' | 'javascript' | 'user-experience' | 'network';
  title: string;
  description: string;
  currentValue: number;
  threshold: number;
  impact: string;
  recommendations: string[];
  relatedMetrics: string[];
}

export interface PerformanceInsight {
  id: string;
  timestamp: number;
  type: 'optimization' | 'degradation' | 'anomaly' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  metrics: Array<{
    name: string;
    value: number;
    trend: 'improving' | 'degrading' | 'stable';
  }>;
  recommendations: string[];
  evidence: string[];
}

export interface PerformanceReport {
  timestamp: Date;
  duration: number;
  sampleSize: number;
  summary: {
    averageLoadTime: number;
    performanceGrade: string;
    userExperienceScore: number;
    resourceEfficiency: number;
    errorRate: number;
  };
  trends: {
    loadTime: Array<{ timestamp: number; value: number }>;
    userExperience: Array<{ timestamp: number; value: number }>;
    resourceUsage: Array<{ timestamp: number; value: number }>;
  };
  alerts: PerformanceAlert[];
  insights: PerformanceInsight[];
  recommendations: string[];
  lighthouseMetrics?: LighthouseMetrics;
}

class RealTimeMonitor {
  private isMonitoring: boolean = false;
  private metrics: RealTimeMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private insights: PerformanceInsight[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds: PerformanceThresholds;
  private alertCallbacks: Set<(alert: PerformanceAlert) => void> = new Set();
  private insightCallbacks: Set<(insight: PerformanceInsight) => void> = new Set();
  private config: {
    samplingRate: number;
    bufferSize: number;
    alertCooldown: number;
    insightFrequency: number;
    enableLighthouse: boolean;
    enableUserTiming: boolean;
  };

  constructor(config?: Partial<typeof RealTimeMonitor.prototype.config>) {
    this.config = {
      samplingRate: 1.0,
      bufferSize: 1000,
      alertCooldown: 30000, // 30 seconds
      insightFrequency: 60000, // 1 minute
      enableLighthouse: process.env.NODE_ENV === 'development',
      enableUserTiming: true,
      ...config,
    };

    this.thresholds = this.initializeThresholds();
    this.setupPerformanceObservers();
  }

  private initializeThresholds(): PerformanceThresholds {
    return {
      pageLoad: {
        fcp: { good: 1800, needsImprovement: 3000 },
        lcp: { good: 2500, needsImprovement: 4000 },
        fid: { good: 100, needsImprovement: 300 },
        cls: { good: 0.1, needsImprovement: 0.25 },
        ttfb: { good: 800, needsImprovement: 1800 },
      },
      resources: {
        totalRequests: { good: 50, needsImprovement: 100 },
        totalSize: { good: 1500000, needsImprovement: 3000000 }, // 1.5MB / 3MB
        slowRequestThreshold: 1000, // 1 second
        failureRateThreshold: 0.05, // 5%
      },
      javascript: {
        executionTime: { good: 50, needsImprovement: 100 }, // milliseconds
        memoryUsage: { good: 50000000, needsImprovement: 100000000 }, // 50MB / 100MB
        longTaskThreshold: 50, // milliseconds
        frameRate: { good: 55, needsImprovement: 30 }, // FPS
      },
    };
  }

  public startMonitoring(): void {
    if (this.isMonitoring) {
      console.warn('Real-time monitoring is already active');
      return;
    }

    this.isMonitoring = true;
    console.log('Starting real-time performance monitoring...');

    // Start collecting metrics
    this.startMetricsCollection();

    // Start periodic analysis
    this.startPeriodicAnalysis();

    // Start Lighthouse integration if enabled
    if (this.config.enableLighthouse) {
      this.startLighthouseMonitoring();
    }

    // Add navigation timing listener
    this.setupNavigationTiming();

    // Add resource timing listener
    this.setupResourceTiming();

    // Add error tracking
    this.setupErrorTracking();
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.warn('Real-time monitoring is not active');
      return;
    }

    this.isMonitoring = false;
    console.log('Stopping real-time performance monitoring...');

    // Disconnect all observers
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers = [];

    // Clear any running intervals
    // (Implementation depends on how intervals are managed)
  }

  private startMetricsCollection(): void {
    // Collect initial metrics
    this.collectMetrics();

    // Set up continuous collection
    setInterval(() => {
      if (this.isMonitoring) {
        this.collectMetrics();
      }
    }, 1000); // Collect every second
  }

  private collectMetrics(): void {
    const timestamp = performance.now();

    const metrics: RealTimeMetrics = {
      timestamp,
      pageLoad: this.collectPageLoadMetrics(),
      resources: this.collectResourceMetrics(),
      javascript: this.collectJavaScriptMetrics(),
      userExperience: this.collectUserExperienceMetrics(),
      network: this.collectNetworkMetrics(),
    };

    // Add to buffer
    this.metrics.push(metrics);

    // Maintain buffer size
    if (this.metrics.length > this.config.bufferSize) {
      this.metrics = this.metrics.slice(-this.config.bufferSize);
    }

    // Check for alerts
    this.checkForAlerts(metrics);

    // Emit metrics to subscribers (if needed)
    this.emitMetrics(metrics);
  }

  private collectPageLoadMetrics(): RealTimeMetrics['pageLoad'] {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    return {
      fcp: this.getMetricValue('first-contentful-paint'),
      lcp: this.getMetricValue('largest-contentful-paint'),
      fid: this.getMetricValue('first-input'),
      cls: this.getCLSValue(),
      ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - (navigation.activationStart || navigation.fetchStart || 0) : 0,
      loadComplete: navigation ? navigation.loadEventEnd - (navigation.activationStart || navigation.fetchStart || 0) : 0,
    };
  }

  private collectResourceMetrics(): RealTimeMetrics['resources'] {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    let totalSize = 0;
    let slowRequests = 0;
    let failedRequests = 0;
    let cachedRequests = 0;

    const resourceBreakdown: RealTimeMetrics['resources']['resourceBreakdown'] = {
      scripts: { count: 0, size: 0 },
      styles: { count: 0, size: 0 },
      images: { count: 0, size: 0 },
      fonts: { count: 0, size: 0 },
      api: { count: 0, size: 0 },
      other: { count: 0, size: 0 },
    };

    for (const resource of resources) {
      const size = this.estimateResourceSize(resource);
      totalSize += size;

      if (resource.duration > this.thresholds.resources.slowRequestThreshold) {
        slowRequests++;
      }

      if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
        cachedRequests++;
      }

      // Categorize resources
      const url = resource.name.toLowerCase();
      if (url.includes('.js')) {
        resourceBreakdown.scripts.count++;
        resourceBreakdown.scripts.size += size;
      } else if (url.includes('.css')) {
        resourceBreakdown.styles.count++;
        resourceBreakdown.styles.size += size;
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        resourceBreakdown.images.count++;
        resourceBreakdown.images.size += size;
      } else if (url.includes('.woff') || url.includes('.ttf')) {
        resourceBreakdown.fonts.count++;
        resourceBreakdown.fonts.size += size;
      } else if (url.includes('/api/')) {
        resourceBreakdown.api.count++;
        resourceBreakdown.api.size += size;
      } else {
        resourceBreakdown.other.count++;
        resourceBreakdown.other.size += size;
      }
    }

    return {
      totalRequests: resources.length,
      totalSize,
      cachedRequests,
      slowRequests,
      failedRequests,
      resourceBreakdown,
    };
  }

  private collectJavaScriptMetrics(): RealTimeMetrics['javascript'] {
    // Get performance entries for long tasks
    const longTasks = performance.getEntriesByType('longtask') as (PerformanceEntry & { attribution?: Array<{ name?: string }> })[];

    // Estimate memory usage (limited in browser environment)
    const memoryInfo = (performance as unknown as { memory?: { usedJSHeapSize?: number; totalJSHeapSize?: number } }).memory || {};

    // Calculate frame rate (simplified)
    const frameRate = this.estimateFrameRate();

    return {
      executionTime: this.estimateJavaScriptExecutionTime(),
      memoryUsage: memoryInfo.usedJSHeapSize || 0,
      heapSize: memoryInfo.totalJSHeapSize || 0,
      longTasks: longTasks.map(task => ({
        duration: task.duration,
        startTime: task.startTime,
        attribution: (task as any).attribution?.[0]?.name || 'Unknown',
      })),
      frameRate,
    };
  }

  private collectUserExperienceMetrics(): RealTimeMetrics['userExperience'] {
    return {
      interactionDelay: this.getMetricValue('first-input') || 0,
      scrollPerformance: this.estimateScrollPerformance(),
      inputResponsiveness: this.estimateInputResponsiveness(),
      visualStability: 100 - (this.getCLSValue() * 100), // Invert CLS for stability score
      errorRate: this.getErrorRate(),
    };
  }

  private collectNetworkMetrics(): RealTimeMetrics['network'] {
    const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection || {};

    return {
      connectionType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
      effectiveType: connection.effectiveType || 'unknown',
    };
  }

  private getMetricValue(metricName: string): number {
    const entries = performance.getEntriesByName(metricName);
    if (entries.length > 0) {
      const entry = entries[entries.length - 1];
      return entry && 'startTime' in entry ? entry.startTime : 0;
    }
    return 0;
  }

  private getCLSValue(): number {
    let clsValue = 0;
    const entries = performance.getEntriesByType('layout-shift');

    for (const entry of entries) {
      const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean; value?: number };
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value || 0;
      }
    }

    return clsValue;
  }

  private estimateResourceSize(resource: PerformanceResourceTiming): number {
    // Try to get actual size, fallback to estimation
    if (resource.transferSize > 0) {
      return resource.transferSize;
    }

    // Estimate based on resource type and URL
    const url = resource.name.toLowerCase();
    if (url.includes('.jpg') || url.includes('.jpeg')) return 50000; // 50KB average
    if (url.includes('.png')) return 30000;
    if (url.includes('.webp')) return 20000;
    if (url.includes('.css')) return 25000;
    if (url.includes('.js')) return 75000;
    if (url.includes('.woff')) return 50000;
    if (url.includes('/api/')) return 1000; // 1KB average for API responses

    return 10000; // 10KB default
  }

  private estimateJavaScriptExecutionTime(): number {
    // Get timing information from performance entries
    const measureEntries = performance.getEntriesByType('measure');
    return measureEntries.reduce((total, entry) => total + entry.duration, 0);
  }

  private estimateFrameRate(): number {
    // Simplified frame rate estimation
    // In a real implementation, would use requestAnimationFrame timing
    return 60; // Assume 60 FPS for now
  }

  private estimateScrollPerformance(): number {
    // Simplified scroll performance metric
    // In a real implementation, would measure scroll event handling
    return 95; // Assume good scroll performance
  }

  private estimateInputResponsiveness(): number {
    // Simplified input responsiveness metric
    // In a real implementation, would measure input event handling
    return 90; // Assume good responsiveness
  }

  private getErrorRate(): number {
    // Calculate error rate from collected errors
    // In a real implementation, would track JavaScript errors
    return 0.01; // 1% error rate
  }

  private checkForAlerts(metrics: RealTimeMetrics): void {
    const alerts: PerformanceAlert[] = [];

    // Check page load metrics
    if (metrics.pageLoad.fcp > this.thresholds.pageLoad.fcp.needsImprovement) {
      alerts.push(this.createAlert(
        'page-load',
        'high',
        'Slow First Contentful Paint',
        `FCP is ${metrics.pageLoad.fcp}ms, above threshold of ${this.thresholds.pageLoad.fcp.needsImprovement}ms`,
        metrics.pageLoad.fcp,
        this.thresholds.pageLoad.fcp.needsImprovement,
        'Users see content slowly, affecting perceived performance',
        ['Optimize server response time', 'Reduce render-blocking resources', 'Implement resource hints'],
        ['fcp', 'ttfb', 'server-timing']
      ));
    }

    if (metrics.pageLoad.lcp > this.thresholds.pageLoad.lcp.needsImprovement) {
      alerts.push(this.createAlert(
        'page-load',
        'high',
        'Slow Largest Contentful Paint',
        `LCP is ${metrics.pageLoad.lcp}ms, above threshold of ${this.thresholds.pageLoad.lcp.needsImprovement}ms`,
        metrics.pageLoad.lcp,
        this.thresholds.pageLoad.lcp.needsImprovement,
        'Main content loads slowly, affecting user experience',
        ['Optimize images', 'Remove render-blocking resources', 'Preload critical resources'],
        ['lcp', 'images', 'render-blocking']
      ));
    }

    if (metrics.pageLoad.cls > this.thresholds.pageLoad.cls.needsImprovement) {
      alerts.push(this.createAlert(
        'page-load',
        'medium',
        'Poor Visual Stability',
        `CLS is ${metrics.pageLoad.cls.toFixed(3)}, above threshold of ${this.thresholds.pageLoad.cls.needsImprovement}`,
        metrics.pageLoad.cls,
        this.thresholds.pageLoad.cls.needsImprovement,
        'Page content shifts unexpectedly, frustrating users',
        ['Include size attributes for images and videos', 'Reserve space for dynamic content', 'Avoid inserting content above existing content'],
        ['cls', 'layout-shift', 'visual-stability']
      ));
    }

    // Check resource metrics
    if (metrics.resources.totalSize > this.thresholds.resources.totalSize.needsImprovement) {
      alerts.push(this.createAlert(
        'resource',
        'medium',
        'Large Page Size',
        `Total page size is ${(metrics.resources.totalSize / 1024 / 1024).toFixed(2)}MB, above threshold of ${(this.thresholds.resources.totalSize.needsImprovement / 1024 / 1024).toFixed(2)}MB`,
        metrics.resources.totalSize,
        this.thresholds.resources.totalSize.needsImprovement,
        'Large page size increases load time and data usage',
        ['Optimize and compress images', 'Remove unused CSS/JS', 'Implement code splitting', 'Use resource compression'],
        ['page-size', 'compression', 'optimization']
      ));
    }

    if (metrics.resources.slowRequests > 5) {
      alerts.push(this.createAlert(
        'resource',
        'medium',
        'Multiple Slow Requests',
        `${metrics.resources.slowRequests} requests are slower than ${this.thresholds.resources.slowRequestThreshold}ms`,
        metrics.resources.slowRequests,
        5,
        'Slow resources are delaying page load and user interactions',
        ['Optimize API responses', 'Implement caching', 'Use CDN', 'Optimize database queries'],
        ['slow-requests', 'api-performance', 'caching']
      ));
    }

    // Check JavaScript metrics
    if (metrics.javascript.longTasks.length > 0) {
      const totalLongTaskTime = metrics.javascript.longTasks.reduce((sum, task) => sum + task.duration, 0);
      alerts.push(this.createAlert(
        'javascript',
        'high',
        'Long JavaScript Tasks Detected',
        `${metrics.javascript.longTasks.length} long tasks blocking main thread (${totalLongTaskTime.toFixed(0)}ms total)`,
        totalLongTaskTime,
        0,
        'Long tasks block user interactions and make the page feel unresponsive',
        ['Break up long tasks', 'Use Web Workers for heavy computations', 'Optimize JavaScript execution'],
        ['long-tasks', 'main-thread', 'responsiveness']
      ));
    }

    // Check for alerts and notify subscribers
    for (const alert of alerts) {
      if (!this.isDuplicateAlert(alert)) {
        this.alerts.push(alert);
        this.notifyAlertSubscribers(alert);
      }
    }

    // Maintain alert buffer size
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  private createAlert(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    title: string,
    description: string,
    currentValue: number,
    threshold: number,
    impact: string,
    recommendations: string[],
    relatedMetrics: string[]
  ): PerformanceAlert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      severity,
      type,
      title,
      description,
      currentValue,
      threshold,
      impact,
      recommendations,
      relatedMetrics,
    };
  }

  private isDuplicateAlert(newAlert: PerformanceAlert): boolean {
    const recentAlerts = this.alerts.filter(
      alert => Date.now() - alert.timestamp < this.config.alertCooldown
    );

    return recentAlerts.some(alert =>
      alert.type === newAlert.type &&
      alert.title === newAlert.title
    );
  }

  private startPeriodicAnalysis(): void {
    setInterval(() => {
      if (this.isMonitoring) {
        this.generateInsights();
      }
    }, this.config.insightFrequency);
  }

  private generateInsights(): void {
    if (this.metrics.length < 10) return; // Need enough data for analysis

    const insights: PerformanceInsight[] = [];

    // Analyze trends
    const loadTimeTrend = this.analyzeTrend('pageLoad', 'loadComplete');
    const userExperienceTrend = this.analyzeTrend('userExperience', 'interactionDelay');

    if (loadTimeTrend.trend === 'degrading' && loadTimeTrend.confidence > 0.7) {
      insights.push({
        id: `insight-${Date.now()}-load-time`,
        timestamp: Date.now(),
        type: 'degradation',
        title: 'Page Load Time Degrading',
        description: `Page load time has increased by ${loadTimeTrend.changePercentage.toFixed(1)}% over the last period`,
        confidence: loadTimeTrend.confidence,
        impact: this.assessImpact(loadTimeTrend.changePercentage),
        metrics: [{
          name: 'Load Time',
          value: loadTimeTrend.currentValue,
          trend: loadTimeTrend.trend,
        }],
        recommendations: [
          'Investigate recent changes that may have affected performance',
          'Review resource loading and optimization',
          'Check for memory leaks or inefficient code',
        ],
        evidence: [
          `Average load time increased from ${loadTimeTrend.previousValue.toFixed(0)}ms to ${loadTimeTrend.currentValue.toFixed(0)}ms`,
          `Trend detected over ${loadTimeTrend.sampleCount} samples`,
        ],
      });
    }

    if (userExperienceTrend.trend === 'improving' && userExperienceTrend.confidence > 0.7) {
      insights.push({
        id: `insight-${Date.now()}-user-experience`,
        timestamp: Date.now(),
        type: 'optimization',
        title: 'User Experience Improving',
        description: `User interaction delay has improved by ${Math.abs(userExperienceTrend.changePercentage).toFixed(1)}%`,
        confidence: userExperienceTrend.confidence,
        impact: 'medium',
        metrics: [{
          name: 'Interaction Delay',
          value: userExperienceTrend.currentValue,
          trend: userExperienceTrend.trend,
        }],
        recommendations: [
          'Continue current optimization strategies',
          'Monitor to ensure improvement is sustained',
          'Apply similar optimizations to other areas',
        ],
        evidence: [
          `Interaction delay improved from ${userExperienceTrend.previousValue.toFixed(0)}ms to ${userExperienceTrend.currentValue.toFixed(0)}ms`,
        ],
      });
    }

    // Check for anomalies
    const anomaly = this.detectAnomalies();
    if (anomaly) {
      insights.push(anomaly);
    }

    // Add insights and notify subscribers
    for (const insight of insights) {
      this.insights.push(insight);
      this.notifyInsightSubscribers(insight);
    }

    // Maintain insight buffer size
    if (this.insights.length > 50) {
      this.insights = this.insights.slice(-50);
    }
  }

  private analyzeTrend(category: string, metric: string): {
    trend: 'improving' | 'degrading' | 'stable';
    confidence: number;
    changePercentage: number;
    currentValue: number;
    previousValue: number;
    sampleCount: number;
  } {
    const recentMetrics = this.metrics.slice(-20); // Last 20 samples
    const olderMetrics = this.metrics.slice(-40, -20); // Previous 20 samples

    if (recentMetrics.length < 10 || olderMetrics.length < 10) {
      return {
        trend: 'stable',
        confidence: 0,
        changePercentage: 0,
        currentValue: 0,
        previousValue: 0,
        sampleCount: recentMetrics.length,
      };
    }

    const getMetricValue = (metric: RealTimeMetrics, category: string, metricName: string): number => {
      const categoryData = metric[category as keyof RealTimeMetrics];
      if (typeof categoryData === 'object' && categoryData !== null && typeof categoryData === 'object') {
        return (categoryData as Record<string, unknown>)[metricName] as number || 0;
      }
      return 0;
    };

    const recentValues = recentMetrics.map(m => getMetricValue(m, category, metric));
    const olderValues = olderMetrics.map(m => getMetricValue(m, category, metric));

    const recentAverage = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const olderAverage = olderValues.reduce((sum, val) => sum + val, 0) / olderValues.length;

    const changePercentage = ((recentAverage - olderAverage) / olderAverage) * 100;

    let trend: 'improving' | 'degrading' | 'stable';
    if (Math.abs(changePercentage) < 5) {
      trend = 'stable';
    } else if (category === 'userExperience' || metric === 'interactionDelay') {
      // For user experience metrics, lower is better
      trend = changePercentage < 0 ? 'improving' : 'degrading';
    } else {
      // For most other metrics, lower is better (load time, etc.)
      trend = changePercentage < 0 ? 'improving' : 'degrading';
    }

    // Calculate confidence based on variance
    const recentVariance = this.calculateVariance(recentValues);
    const olderVariance = this.calculateVariance(olderValues);
    const confidence = Math.max(0, 1 - (recentVariance + olderVariance) / (2 * recentAverage));

    return {
      trend,
      confidence,
      changePercentage,
      currentValue: recentAverage,
      previousValue: olderAverage,
      sampleCount: recentValues.length,
    };
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
    return squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private assessImpact(changePercentage: number): 'high' | 'medium' | 'low' {
    const absChange = Math.abs(changePercentage);
    if (absChange > 20) return 'high';
    if (absChange > 10) return 'medium';
    return 'low';
  }

  private detectAnomalies(): PerformanceInsight | null {
    if (this.metrics.length < 10) return null;

    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) return null;

    const recent = this.metrics.slice(-5);

    // Check for unusual spikes in any metric
    const anomalies = [
      this.checkForAnomaly(latest.pageLoad.fcp, recent.map(m => m.pageLoad.fcp), 'First Contentful Paint'),
      this.checkForAnomaly(latest.pageLoad.lcp, recent.map(m => m.pageLoad.lcp), 'Largest Contentful Paint'),
      this.checkForAnomaly(latest.resources.totalSize, recent.map(m => m.resources.totalSize), 'Total Page Size'),
    ];

    const significantAnomaly = anomalies.find(a => a !== null);
    return significantAnomaly || null;
  }

  private checkForAnomaly(currentValue: number, recentValues: number[], metricName: string): PerformanceInsight | null {
    if (recentValues.length < 3) return null;

    const mean = recentValues.slice(0, -1).reduce((sum, val) => sum + val, 0) / (recentValues.length - 1);
    const standardDeviation = Math.sqrt(this.calculateVariance(recentValues.slice(0, -1)));

    const threshold = mean + (2 * standardDeviation); // 2 standard deviations

    if (currentValue > threshold) {
      return {
        id: `insight-${Date.now()}-anomaly-${metricName}`,
        timestamp: Date.now(),
        type: 'anomaly',
        title: `Unusual Spike in ${metricName}`,
        description: `${metricName} (${currentValue.toFixed(0)}) is significantly higher than recent average (${mean.toFixed(0)})`,
        confidence: 0.8,
        impact: 'medium',
        metrics: [{
          name: metricName,
          value: currentValue,
          trend: 'degrading',
        }],
        recommendations: [
          'Investigate what caused this unusual spike',
          'Check for recent deployments or configuration changes',
          'Monitor if this is a recurring pattern',
        ],
        evidence: [
          `Current value: ${currentValue.toFixed(0)} (threshold: ${threshold.toFixed(0)})`,
          `Recent average: ${mean.toFixed(0)} ± ${standardDeviation.toFixed(0)}`,
        ],
      };
    }

    return null;
  }

  private startLighthouseMonitoring(): void {
    // Run Lighthouse audit periodically (e.g., every 5 minutes)
    setInterval(async () => {
      if (this.isMonitoring) {
        try {
          const lighthouseMetrics = await lighthouseIntegration.runLighthouse();
          this.analyzeLighthouseResults(lighthouseMetrics);
        } catch (error) {
          console.error('Lighthouse audit failed:', error);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private analyzeLighthouseResults(metrics: LighthouseMetrics): void {
    // Generate insights based on Lighthouse results
    if (metrics.performance < 80) {
      const insight: PerformanceInsight = {
        id: `insight-${Date.now()}-lighthouse-performance`,
        timestamp: Date.now(),
        type: 'degradation',
        title: 'Lighthouse Performance Score Low',
        description: `Lighthouse performance score is ${metrics.performance}, below the recommended 80`,
        confidence: 0.9,
        impact: 'high',
        metrics: [{
          name: 'Lighthouse Performance',
          value: metrics.performance,
          trend: 'degrading',
        }],
        recommendations: lighthouseIntegration.generateRecommendations(metrics),
        evidence: [
          `Performance score: ${metrics.performance}`,
          `LCP: ${metrics.largestContentfulPaint}ms`,
          `FID: ${metrics.firstInputDelay}ms`,
          `CLS: ${metrics.cumulativeLayoutShift}`,
        ],
      };

      this.insights.push(insight);
      this.notifyInsightSubscribers(insight);
    }
  }

  private setupPerformanceObservers(): void {
    // Observer for Long Tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > this.thresholds.javascript.longTaskThreshold) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);

      // Observer for Layout Shift
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean; value?: number };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        }

        if (clsValue > this.thresholds.pageLoad.cls.needsImprovement) {
          console.warn(`High CLS detected: ${clsValue.toFixed(3)}`);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);
    }
  }

  private setupNavigationTiming(): void {
    // Listen for navigation events
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectMetrics(); // Collect metrics after page load
      }, 0);
    });
  }

  private setupResourceTiming(): void {
    // Monitor resource loading
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > this.thresholds.resources.slowRequestThreshold) {
            console.warn(`Slow resource detected: ${(entry as PerformanceResourceTiming).name} took ${entry.duration}ms`);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  private emitMetrics(_metrics: RealTimeMetrics): void {
    // Emit metrics to any subscribers (implementation depends on needs)
  }

  private notifyAlertSubscribers(alert: PerformanceAlert): void {
    for (const callback of this.alertCallbacks) {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    }
  }

  private notifyInsightSubscribers(insight: PerformanceInsight): void {
    for (const callback of this.insightCallbacks) {
      try {
        callback(insight);
      } catch (error) {
        console.error('Error in insight callback:', error);
      }
    }
  }

  // Public API methods
  public onAlert(callback: (alert: PerformanceAlert) => void): void {
    this.alertCallbacks.add(callback);
  }

  public onInsight(callback: (insight: PerformanceInsight) => void): void {
    this.insightCallbacks.add(callback);
  }

  public getCurrentMetrics(): RealTimeMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] || null : null;
  }

  public getMetricsHistory(count?: number): RealTimeMetrics[] {
    return count ? this.metrics.slice(-count) : [...this.metrics];
  }

  public getAlerts(severity?: PerformanceAlert['severity']): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  public getInsights(type?: PerformanceInsight['type']): PerformanceInsight[] {
    if (type) {
      return this.insights.filter(insight => insight.type === type);
    }
    return [...this.insights];
  }

  public async generatePerformanceReport(): Promise<PerformanceReport> {
    if (this.metrics.length === 0) {
      throw new Error('No metrics available for report generation');
    }

    const recentMetrics = this.metrics.slice(-100); // Last 100 data points
    const duration = this.metrics.length > 0
      ? (this.metrics[this.metrics.length - 1]?.timestamp || 0) - (this.metrics[0]?.timestamp || 0)
      : 0;

    const summary = this.calculateSummary(recentMetrics);
    const trends = this.calculateTrends(recentMetrics);

    // Get latest Lighthouse metrics if available
    const lighthouseMetrics = this.config.enableLighthouse
      ? await lighthouseIntegration.getLatestReport()
        ? await lighthouseIntegration.runLighthouse()
        : undefined
      : undefined;

    const report: PerformanceReport = {
      timestamp: new Date(),
      duration,
      sampleSize: recentMetrics.length,
      summary,
      trends,
      alerts: [...this.alerts],
      insights: [...this.insights],
      recommendations: this.generateReportRecommendations(summary, this.alerts, this.insights),
      lighthouseMetrics,
    };

    return report;
  }

  private calculateSummary(metrics: RealTimeMetrics[]): PerformanceReport['summary'] {
    const averageLoadTime = metrics.reduce((sum, m) => sum + m.pageLoad.loadComplete, 0) / metrics.length;
    const performanceGrade = this.calculatePerformanceGrade(averageLoadTime);
    const userExperienceScore = metrics.reduce((sum, m) => sum + m.userExperience.inputResponsiveness, 0) / metrics.length;
    const resourceEfficiency = this.calculateResourceEfficiency(metrics);
    const errorRate = metrics.reduce((sum, m) => sum + m.userExperience.errorRate, 0) / metrics.length;

    return {
      averageLoadTime,
      performanceGrade,
      userExperienceScore,
      resourceEfficiency,
      errorRate,
    };
  }

  private calculatePerformanceGrade(loadTime: number): string {
    if (loadTime < 1000) return 'A';
    if (loadTime < 2000) return 'B';
    if (loadTime < 3000) return 'C';
    if (loadTime < 5000) return 'D';
    return 'F';
  }

  private calculateResourceEfficiency(metrics: RealTimeMetrics[]): number {
    const totalSize = metrics.reduce((sum, m) => sum + m.resources.totalSize, 0) / metrics.length;
    const cachedRequests = metrics.reduce((sum, m) => sum + m.resources.cachedRequests, 0) / metrics.reduce((sum, m) => sum + m.resources.totalRequests, 0);

    // Efficiency score based on size and caching
    const sizeScore = Math.max(0, 100 - (totalSize / 100000)); // Penalty for large size
    const cacheScore = cachedRequests * 100; // Reward for caching

    return Math.min(100, sizeScore + cacheScore);
  }

  private calculateTrends(metrics: RealTimeMetrics[]): PerformanceReport['trends'] {
    const timePoints = metrics.map(m => m.timestamp);

    return {
      loadTime: timePoints.map((time, i) => ({ timestamp: time, value: metrics[i]?.pageLoad.loadComplete || 0 })),
      userExperience: timePoints.map((time, i) => ({ timestamp: time, value: metrics[i]?.userExperience.inputResponsiveness || 0 })),
      resourceUsage: timePoints.map((time, i) => ({ timestamp: time, value: metrics[i]?.resources.totalSize || 0 })),
    };
  }

  private generateReportRecommendations(
    summary: PerformanceReport['summary'],
    alerts: PerformanceAlert[],
    insights: PerformanceInsight[]
  ): string[] {
    const recommendations: string[] = [];

    if (summary.averageLoadTime > 3000) {
      recommendations.push('Optimize page load time (currently over 3 seconds)');
    }

    if (summary.performanceGrade === 'D' || summary.performanceGrade === 'F') {
      recommendations.push('Implement critical performance optimizations to improve grade');
    }

    if (summary.userExperienceScore < 70) {
      recommendations.push('Improve user experience through better responsiveness');
    }

    if (summary.errorRate > 0.02) {
      recommendations.push('Address JavaScript errors to improve reliability');
    }

    // Add alert-based recommendations
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push(`Address ${criticalAlerts.length} critical performance alerts immediately`);
    }

    // Add insight-based recommendations
    const degradationInsights = insights.filter(i => i.type === 'degradation');
    if (degradationInsights.length > 0) {
      recommendations.push('Investigate and resolve performance degradation issues');
    }

    return recommendations;
  }

  public updateConfig(newConfig: Partial<typeof RealTimeMonitor.prototype.config>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  public clearData(): void {
    this.metrics = [];
    this.alerts = [];
    this.insights = [];
  }
}

export default RealTimeMonitor;