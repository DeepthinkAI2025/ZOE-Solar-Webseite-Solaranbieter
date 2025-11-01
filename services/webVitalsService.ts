import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Define Metric interface for web-vitals v5
interface Metric {
  name: string;
  value: number;
  id: string;
  delta?: number;
  entries?: any[];
}

// Web Vitals interface for our custom tracking
interface WebVitalsData {
  cls: number;
  inp: number; // INP replaces FID in web-vitals v5
  fcp: number;
  lcp: number;
  ttfb: number;
  url: string;
  userAgent: string;
  timestamp: number;
}

interface WebVitalsThresholds {
  CLS: { good: number; needsImprovement: number };
  INP: { good: number; needsImprovement: number }; // INP replaces FID
  FCP: { good: number; needsImprovement: number };
  LCP: { good: number; needsImprovement: number };
  TTFB: { good: number; needsImprovement: number };
}

class WebVitalsService {
  private thresholds: WebVitalsThresholds = {
    CLS: { good: 0.1, needsImprovement: 0.25 },
    INP: { good: 200, needsImprovement: 500 }, // INP thresholds in milliseconds
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    TTFB: { good: 800, needsImprovement: 1800 },
  };

  private metrics: Partial<WebVitalsData> = {};
  private observers: Set<(data: WebVitalsData) => void> = new Set();

  constructor() {
    this.initialize();
  }

  private initialize = (): void => {
    // Initialize all metrics collection with web-vitals v5 API
    onCLS(this.handleMetric.bind(this), { reportAllChanges: true });
    onINP(this.handleMetric.bind(this), { reportAllChanges: true }); // INP replaces FID in v5
    onFCP(this.handleMetric.bind(this), { reportAllChanges: true });
    onLCP(this.handleMetric.bind(this), { reportAllChanges: true });
    onTTFB(this.handleMetric.bind(this), { reportAllChanges: true });

    // Set up performance observer for additional insights
    this.setupPerformanceObserver();
  };

  private handleMetric = (metric: Metric): void => {
    // Store the metric
    (this.metrics as any)[metric.name.toLowerCase()] = metric.value;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metric.name}:`, metric.value, this.getRating(metric));
    }

    // Check if we have all metrics
    const requiredMetrics = ['cls', 'inp', 'fcp', 'lcp', 'ttfb'];
    const hasAllMetrics = requiredMetrics.every(m => (this.metrics as any)[m] !== undefined);

    if (hasAllMetrics) {
      this.reportMetrics();
    }
  };

  private getRating = (metric: Metric): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = (this.thresholds as any)[metric.name];
    if (!threshold) return 'good';

    if (metric.value <= threshold.good) return 'good';
    if (metric.value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  private reportMetrics = (): void => {
    const webVitalsData: WebVitalsData = {
      cls: this.metrics.cls || 0,
      inp: this.metrics.inp || 0, // INP replaces FID
      fcp: this.metrics.fcp || 0,
      lcp: this.metrics.lcp || 0,
      ttfb: this.metrics.ttfb || 0,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };

    // Send to all observers
    this.observers.forEach(observer => observer(webVitalsData));

    // Send to Google Analytics if available
    this.sendToGoogleAnalytics(webVitalsData);

    // Send to our SEO monitoring service
    this.sendToSEOMonitoring(webVitalsData);

    // Store in localStorage for performance monitoring
    this.storeMetrics(webVitalsData);
  };

  private sendToGoogleAnalytics = (data: WebVitalsData): void => {
    if (typeof gtag !== 'undefined') {
      // Send each metric as a custom event
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'CLS',
        value: Math.round(data.cls * 1000),
        non_interaction: true,
      });

      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'INP',
        value: Math.round(data.inp),
        non_interaction: true,
      });

      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'FCP',
        value: Math.round(data.fcp),
        non_interaction: true,
      });

      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'LCP',
        value: Math.round(data.lcp),
        non_interaction: true,
      });

      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'TTFB',
        value: Math.round(data.ttfb),
        non_interaction: true,
      });
    }
  };

  private sendToSEOMonitoring = (data: WebVitalsData): void => {
    // Send to our internal SEO monitoring API
    if (typeof fetch !== 'undefined') {
      fetch('/api/v1/seo/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          pageType: this.getPageType(),
          deviceType: this.getDeviceType(),
          connectionType: this.getConnectionType(),
        }),
      }).catch(() => {
        // Silently fail if the API is not available
      });
    }
  };

  private storeMetrics = (data: WebVitalsData): void => {
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('zoe-solar-web-vitals') || '[]');
      existingMetrics.push(data);

      // Keep only last 100 entries
      if (existingMetrics.length > 100) {
        existingMetrics.splice(0, existingMetrics.length - 100);
      }

      localStorage.setItem('zoe-solar-web-vitals', JSON.stringify(existingMetrics));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  };

  private setupPerformanceObserver = (): void => {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('⚠️ Long task detected:', {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task observer not supported
      }

      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const resources = list.getEntries();
        const slowResources = resources.filter(resource => resource.duration > 1000);

        if (slowResources.length > 0) {
          console.warn('⚠️ Slow resources detected:', slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            size: (r as any).transferSize || 0,
          })));
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Resource observer not supported
      }
    }
  };

  private getPageType = (): string => {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path.includes('/photovoltaik')) return 'photovoltaik';
    if (path.includes('/agri-pv')) return 'agri-pv';
    if (path.includes('/foerdermittel')) return 'funding';
    if (path.includes('/standort')) return 'location';
    if (path.includes('/projekte')) return 'projects';
    if (path.includes('/kontakt')) return 'contact';
    return 'other';
  };

  private getDeviceType = (): string => {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(ua)) return 'mobile';
    if (/Tablet|iPad/.test(ua)) return 'tablet';
    return 'desktop';
  };

  private getConnectionType = (): string => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType || 'unknown';
    }
    return 'unknown';
  };

  // Public methods
  public subscribe = (observer: (data: WebVitalsData) => void): (() => void) => {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  };

  public getCurrentMetrics = (): Partial<WebVitalsData> => {
    return { ...this.metrics };
  };

  public getHistoricalMetrics = (): WebVitalsData[] => {
    try {
      return JSON.parse(localStorage.getItem('zoe-solar-web-vitals') || '[]');
    } catch (error) {
      return [];
    }
  };

  public getPerformanceScore = (): number => {
    if (!this.metrics.cls || !this.metrics.inp || !this.metrics.fcp || !this.metrics.lcp) {
      return 0;
    }

    const scores = [
      this.getMetricScore('CLS', this.metrics.cls),
      this.getMetricScore('INP', this.metrics.inp),
      this.getMetricScore('FCP', this.metrics.fcp),
      this.getMetricScore('LCP', this.metrics.lcp),
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  private getMetricScore = (metric: keyof WebVitalsThresholds, value: number): number => {
    const threshold = this.thresholds[metric];
    if (value <= threshold.good) return 100;
    if (value <= threshold.needsImprovement) return 50 + (threshold.needsImprovement - value) / (threshold.needsImprovement - threshold.good) * 50;
    return Math.max(0, 50 - (value - threshold.needsImprovement) / threshold.needsImprovement * 50);
  };

  public getOptimizationSuggestions = (): string[] => {
    const suggestions: string[] = [];

    if (this.metrics.cls && this.metrics.cls > this.thresholds.CLS.good) {
      suggestions.push('CLS ist hoch. Vermeide Layout-Shifts durch Dimension-Attribut für Bilder und Reserve-Raum für dynamische Inhalte.');
    }

    if (this.metrics.inp && this.metrics.inp > this.thresholds.INP.good) {
      suggestions.push('INP ist langsam. Reduziere JavaScript-Ausführungszeit durch Code-Splitting und Lazy Loading.');
    }

    if (this.metrics.fcp && this.metrics.fcp > this.thresholds.FCP.good) {
      suggestions.push('FCP ist langsam. Optimiere Server-Response und reduziere Render-blocking-Resources.');
    }

    if (this.metrics.lcp && this.metrics.lcp > this.thresholds.LCP.good) {
      suggestions.push('LCP ist langsam. Optimiere Bilder (WebP/AVIF), verwende Preload für kritische Resources.');
    }

    if (this.metrics.ttfb && this.metrics.ttfb > this.thresholds.TTFB.good) {
      suggestions.push('TTFB ist langsam. Implementiere Caching und optimiere Server-Performance.');
    }

    return suggestions;
  };

  public generateReport = (): {
    score: number;
    metrics: Partial<WebVitalsData>;
    suggestions: string[];
    timestamp: number;
  } => {
    return {
      score: this.getPerformanceScore(),
      metrics: this.getCurrentMetrics(),
      suggestions: this.getOptimizationSuggestions(),
      timestamp: Date.now(),
    };
  };
}

// Create singleton instance
export const webVitalsService = new WebVitalsService();

// Export the service and types
export { WebVitalsService };
export type { WebVitalsData, WebVitalsThresholds };