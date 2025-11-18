// Enhanced Performance Monitoring Service

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay (or FID replacement)
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Custom metrics
  componentRenderTime?: number;
  apiResponseTime?: number;
  bundleLoadTime?: number;

  // Resource metrics
  resourceTiming?: PerformanceResourceTiming[];
  navigationTiming?: PerformanceNavigationTiming;
}

interface PerformanceThresholds {
  lcp: { good: number, needsImprovement: number };
  fid: { good: number, needsImprovement: number };
  cls: { good: number, needsImprovement: number };
  fcp: { good: number, needsImprovement: number };
  ttfb: { good: number, needsImprovement: number };
}

class PerformanceService {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private thresholds: PerformanceThresholds = {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 },
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    // Initialize Core Web Vitals monitoring
    this.initializeWebVitals();

    // Initialize custom metrics
    this.initializeCustomMetrics();

    // Initialize resource monitoring
    this.initializeResourceMonitoring();
  }

  private initializeWebVitals() {
    try {
      // Largest Contentful Paint
      this.observePerformanceEvent('largest-contentful-paint', (entries) => {
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.evaluateMetric('lcp', this.metrics.lcp);
      });

      // First Input Delay (or Interaction to Next Paint for modern browsers)
      if ('PerformanceEventTiming' in window) {
        this.observePerformanceEvent('first-input', (entries) => {
          const firstEntry = entries[0];
          if (firstEntry) {
            this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
            this.evaluateMetric('fid', this.metrics.fid);
          }
        });

        // Interaction to Next Paint (INP) - the modern replacement for FID
        this.observePerformanceEvent('event', (entries) => {
          const inpEntries = entries.filter(entry => entry.duration > 0);
          if (inpEntries.length > 0) {
            const worstINP = Math.max(...inpEntries.map(entry => entry.duration));
            // Store as fid for compatibility
            this.metrics.fid = worstINP;
          }
        });
      }

      // Cumulative Layout Shift
      let clsValue = 0;
      this.observePerformanceEvent('layout-shift', (entries) => {
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.metrics.cls = clsValue;
        this.evaluateMetric('cls', this.metrics.cls);
      });

      // First Contentful Paint
      this.observePerformanceEvent('paint', (entries) => {
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.evaluateMetric('fcp', this.metrics.fcp);
          }
        });
      });

      // Time to First Byte
      if (performance.timing) {
        this.metrics.ttfb = performance.timing.responseStart - performance.timing.requestStart;
        this.evaluateMetric('ttfb', this.metrics.ttfb);
      }

    } catch (error) {
      console.warn('Performance monitoring initialization error:', error);
    }
  }

  private initializeCustomMetrics() {
    // Monitor React component render times
    this.observeComponentRenderTimes();

    // Monitor API response times
    this.observeApiResponses();

    // Monitor bundle loading
    this.observeBundleLoading();
  }

  private observePerformanceEvent(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private initializeResourceMonitoring() {
    // Monitor resource loading performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      this.metrics.resourceTiming = [...(this.metrics.resourceTiming || []), ...entries];
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Resource monitoring not supported:', error);
    }

    // Capture navigation timing
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        this.metrics.navigationTiming = navigationEntries[0];
      }
    }
  }

  private observeComponentRenderTimes() {
    // This would be implemented with React DevTools Profiler
    // For now, we'll provide a manual measurement utility
  }

  private observeApiResponses() {
    // Intercept fetch requests to measure API response times
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        this.metrics.apiResponseTime = endTime - startTime;

        // Log slow API calls
        if (this.metrics.apiResponseTime > 2000) {
          console.warn(`Slow API call: ${this.metrics.apiResponseTime.toFixed(2)}ms`, args[0]);
        }

        return response;
      } catch (error) {
        const endTime = performance.now();
        console.error(`API call failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
        throw error;
      }
    };
  }

  private observeBundleLoading() {
    // Monitor bundle loading performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].loadEventStart;
          this.metrics.bundleLoadTime = loadTime;
        }
      }, 0);
    });
  }

  private evaluateMetric(metricName: keyof PerformanceThresholds, value: number) {
    const threshold = this.thresholds[metricName];
    if (!threshold) return;

    let rating: 'good' | 'needs-improvement' | 'poor';

    if (value <= threshold.good) {
      rating = 'good';
    } else if (value <= threshold.needsImprovement) {
      rating = 'needs-improvement';
    } else {
      rating = 'poor';
    }

    // Log performance warnings
    if (rating !== 'good') {
      console.warn(`Performance warning - ${metricName.toUpperCase()}: ${value.toFixed(2)} (${rating})`);
    }

    // Send to analytics
    this.sendToAnalytics(metricName, value, rating);
  }

  private sendToAnalytics(metricName: string, value: number, rating: string) {
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'core_web_vital', {
        metric_name: metricName,
        value: Math.round(value),
        rating: rating,
        custom_map: { custom_parameter_1: 'metric_name' }
      });
    }

    // Send to custom analytics endpoint
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metricName,
          value,
          rating,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(error => {
        // Silently fail to avoid affecting user experience
      });
    }
  }

  // Public API methods

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getPerformanceScore(): number {
    const metrics = ['lcp', 'fid', 'cls', 'fcp', 'ttfb'] as const;
    let totalScore = 0;
    let validMetrics = 0;

    metrics.forEach(metric => {
      const value = this.metrics[metric];
      if (value !== undefined) {
        const threshold = this.thresholds[metric];
        let score = 0;

        if (value <= threshold.good) {
          score = 100;
        } else if (value <= threshold.needsImprovement) {
          score = 50 + 50 * (1 - (value - threshold.good) / (threshold.needsImprovement - threshold.good));
        } else {
          score = Math.max(0, 50 - 50 * Math.min(1, (value - threshold.needsImprovement) / threshold.needsImprovement));
        }

        totalScore += score;
        validMetrics++;
      }
    });

    return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 0;
  }

  public measureComponentRender<T>(componentName: string, fn: () => T): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    this.metrics.componentRenderTime = renderTime;

    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    // Flag slow components
    if (renderTime > 16) { // > 1 frame at 60fps
      console.warn(`Slow component render - ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    return result;
  }

  public getResourceAnalysis() {
    if (!this.metrics.resourceTiming) return null;

    const resources = this.metrics.resourceTiming;
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      slowResources: resources.filter(r => r.duration > 1000),
      resourcesByType: {} as Record<string, number[]>,
      averageLoadTime: 0,
    };

    let totalDuration = 0;

    resources.forEach(resource => {
      const type = resource.initiatorType || 'other';
      if (!analysis.resourcesByType[type]) {
        analysis.resourcesByType[type] = [];
      }
      analysis.resourcesByType[type].push(resource.duration);
      totalDuration += resource.duration;

      // Estimate size (this is approximate)
      if (resource.transferSize) {
        analysis.totalSize += resource.transferSize;
      }
    });

    analysis.averageLoadTime = resources.length > 0 ? totalDuration / resources.length : 0;

    return analysis;
  }

  public optimizePageLoad() {
    // Implement page load optimizations
    const optimizations = [];

    // Preload critical resources
    const criticalResources = [
      '/fonts/poppins-v20-latin-regular.woff2',
      '/styles/design-tokens.css',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'font';
      if (resource.endsWith('.woff2')) {
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
      optimizations.push(`Preloaded: ${resource}`);
    });

    // Preconnect to external domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://api.zoesolar.de',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
      optimizations.push(`Preconnected: ${domain}`);
    });

    console.log('Performance optimizations applied:', optimizations);
    return optimizations;
  }

  public generateReport() {
    const metrics = this.getMetrics();
    const score = this.getPerformanceScore();
    const resourceAnalysis = this.getResourceAnalysis();

    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      score,
      metrics,
      resourceAnalysis,
      recommendations: this.generateRecommendations(metrics, score),
    };
  }

  private generateRecommendations(metrics: PerformanceMetrics, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 80) {
      recommendations.push('Overall performance score needs improvement');
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint - reduce server response time, optimize images, remove render-blocking resources');
    }

    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay - minimize JavaScript execution time, break up long tasks');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift - specify dimensions for images and videos, avoid inserting content above existing content');
    }

    if (metrics.fcp && metrics.fcp > 1800) {
      recommendations.push('Optimize First Contentful Paint - reduce server response time, optimize critical resources');
    }

    const resourceAnalysis = this.getResourceAnalysis();
    if (resourceAnalysis && resourceAnalysis.slowResources.length > 0) {
      recommendations.push(`${resourceAnalysis.slowResources.length} resources are loading slowly (>1s)`);
    }

    return recommendations;
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceService = new PerformanceService();

// Export for testing
export { PerformanceService };

// Auto-initialize performance optimizations
if (typeof window !== 'undefined') {
  // Run optimizations after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceService.optimizePageLoad();
    }, 100);
  });

  // Generate performance report on page unload
  window.addEventListener('beforeunload', () => {
    const report = performanceService.generateReport();
    navigator.sendBeacon('/api/analytics/performance-report', JSON.stringify(report));
  });
}