import { getCLS, getFID, getFCP, getLCP, onTTFB } from 'web-vitals';

interface ExtendedPerformance extends Performance {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export interface CoreWebVitals {
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
  cached: boolean;
  timestamp: number;
}

export interface NavigationTiming {
  domContentLoaded: number;
  loadEvent: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface ComponentMetrics {
  renders: number;
  totalTime: number;
  averageTime: number;
  lastRenderTime: number;
  memoryUsage?: number;
}

export interface PageMetrics {
  url: string;
  timestamp: number;
  userAgent: string;
  vitals: CoreWebVitals;
  navigation: NavigationTiming;
  resources: ResourceTiming[];
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  components: Map<string, ComponentMetrics>;
}

export interface UserSessionMetrics {
  sessionId: string;
  startTime: number;
  pageViews: number;
  totalPageLoadTime: number;
  averagePageLoadTime: number;
  bounceTime?: number;
  exitTime?: number;
  interactions: number;
  conversions: number;
  errors: Array<{
    type: string;
    message: string;
    timestamp: number;
    url: string;
    line?: number;
    column?: number;
  }>;
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private vitals: CoreWebVitals = {} as CoreWebVitals;
  private metrics: PageMetrics[] = [];
  private currentSession: UserSessionMetrics | null = null;
  private componentMetrics: Map<string, ComponentMetrics> = new Map();
  private isCollecting: boolean = false;

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public startCollection(): void {
    if (this.isCollecting) return;

    this.isCollecting = true;
    this.startSession();
    this.collectWebVitals();
    this.observeResourceTiming();
    this.observeNavigationTiming();
    this.observeMemoryUsage();
    this.observeErrors();
  }

  public stopCollection(): void {
    this.isCollecting = false;
    this.endSession();
  }

  public isCollectingMetrics(): boolean {
    return this.isCollecting;
  }

  private startSession(): void {
    this.currentSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: performance.now(),
      pageViews: 0,
      totalPageLoadTime: 0,
      averagePageLoadTime: 0,
      interactions: 0,
      conversions: 0,
      errors: [],
    };
  }

  private endSession(): void {
    if (this.currentSession) {
      this.currentSession.exitTime = performance.now();
      this.currentSession.averagePageLoadTime =
        this.currentSession.pageViews > 0
          ? this.currentSession.totalPageLoadTime / this.currentSession.pageViews
          : 0;
    }
  }

  private collectWebVitals(): void {
    const handleCLS = (metric: WebVitalsMetric) => {
      this.vitals.cls = metric.value;
      this.recordVital('CLS', metric.value);
    };

    const handleFID = (metric: WebVitalsMetric) => {
      this.vitals.fid = metric.value;
      this.recordVital('FID', metric.value);
    };

    const handleFCP = (metric: WebVitalsMetric) => {
      this.vitals.fcp = metric.value;
      this.recordVital('FCP', metric.value);
    };

    const handleLCP = (metric: WebVitalsMetric) => {
      this.vitals.lcp = metric.value;
      this.recordVital('LCP', metric.value);
    };

    const handleTTFB = (metric: WebVitalsMetric) => {
      this.vitals.ttfb = metric.value;
      this.recordVital('TTFB', metric.value);
    };

    try {
      getCLS(handleCLS);
      getFID(handleFID);
      getFCP(handleFCP);
      getLCP(handleLCP);
      onTTFB(handleTTFB);
    } catch (error) {
      console.warn('Failed to collect web vitals:', error);
    }
  }

  private recordVital(name: string, value: number): void {
    // Store vitals for current page
    const currentMetrics = this.getCurrentPageMetrics();
    if (currentMetrics) {
      currentMetrics.vitals[name.toLowerCase() as keyof CoreWebVitals] = value;
    }
  }

  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            const timing: ResourceTiming = {
              name: resource.name,
              duration: resource.duration,
              size: this.getResourceSize(resource),
              type: this.getResourceType(resource.name),
              cached: resource.transferSize === 0 && resource.decodedBodySize > 0,
              timestamp: resource.startTime,
            };

            this.addResourceTiming(timing);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Failed to observe resource timing:', error);
    }
  }

  private getResourceSize(resource: PerformanceResourceTiming): number {
    return Math.max(resource.transferSize, resource.encodedBodySize, resource.decodedBodySize);
  }

  private getResourceType(url: string): string {
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.js')) return 'script';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    if (url.includes('.json')) return 'data';
    return 'other';
  }

  private observeNavigationTiming(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming;
            this.recordNavigationTiming(nav);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Failed to observe navigation timing:', error);
    }
  }

  private recordNavigationTiming(nav: PerformanceNavigationTiming): void {
    const timing: NavigationTiming = {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      loadEvent: nav.loadEventEnd - nav.startTime,
      firstPaint: this.getMetricByName('first-paint'),
      firstContentfulPaint: this.getMetricByName('first-contentful-paint'),
      largestContentfulPaint: nav.responseEnd - nav.requestStart,
      firstInputDelay: this.vitals.fid || 0,
      cumulativeLayoutShift: this.vitals.cls || 0,
      timeToInteractive: this.calculateTTI(nav),
      totalBlockingTime: this.calculateTBT(nav),
    };

    const currentMetrics = this.getCurrentPageMetrics();
    if (currentMetrics) {
      currentMetrics.navigation = timing;
    }
  }

  private getMetricByName(name: string): number {
    const entries = performance.getEntriesByName(name, 'paint');
    return entries.length > 0 ? (entries[0] as PerformancePaintTiming).startTime : 0;
  }

  private calculateTTI(nav: PerformanceNavigationTiming): number {
    // Simplified TTI calculation
    return nav.domContentLoadedEventEnd - nav.startTime;
  }

  private calculateTBT(nav: PerformanceNavigationTiming): number {
    // Simplified TBT calculation
    let tbt = 0;
    const fcp = nav.responseStart - nav.startTime;

    for (const entry of performance.getEntriesByType('longtask')) {
      if (entry.startTime > fcp) {
        tbt += entry.duration - 50;
      }
    }

    return tbt;
  }

  private observeMemoryUsage(): void {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as ExtendedPerformance).memory;
      const currentMetrics = this.getCurrentPageMetrics();
      if (currentMetrics) {
        currentMetrics.memory = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        };
      }
    };

    // Check memory every 5 seconds
    setInterval(checkMemory, 5000);
    checkMemory(); // Initial check
  }

  private observeErrors(): void {
    const handleError = (event: ErrorEvent) => {
      if (this.currentSession) {
        this.currentSession.errors.push({
          type: event.error?.name || 'JavaScript',
          message: event.message,
          timestamp: performance.now(),
          url: event.filename,
          line: event.lineno,
          column: event.colno,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (this.currentSession) {
        this.currentSession.errors.push({
          type: 'UnhandledRejection',
          message: event.reason?.toString() || 'Unknown rejection',
          timestamp: performance.now(),
          url: window.location.href,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  }

  private getCurrentPageMetrics(): PageMetrics | null {
    if (this.metrics.length === 0) return null;
    return this.metrics[this.metrics.length - 1] || null;
  }

  private addResourceTiming(timing: ResourceTiming): void {
    const currentMetrics = this.getCurrentPageMetrics();
    if (currentMetrics) {
      currentMetrics.resources.push(timing);
    }
  }

  public recordPageView(url?: string): void {
    if (!this.isCollecting || !this.currentSession) return;

    const pageMetrics: PageMetrics = {
      url: url || window.location.href,
      timestamp: performance.now(),
      userAgent: navigator.userAgent,
      vitals: { ...this.vitals },
      navigation: {
        domContentLoaded: 0,
        loadEvent: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        timeToInteractive: 0,
        totalBlockingTime: 0,
      },
      resources: [],
      memory: {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
      },
      components: new Map(),
    };

    this.metrics.push(pageMetrics);
    this.currentSession.pageViews++;
  }

  public recordComponentRender(componentId: string, duration: number): void {
    const current = this.componentMetrics.get(componentId) || {
      renders: 0,
      totalTime: 0,
      averageTime: 0,
      lastRenderTime: 0,
    };

    const updated: ComponentMetrics = {
      renders: current.renders + 1,
      totalTime: current.totalTime + duration,
      averageTime: (current.totalTime + duration) / (current.renders + 1),
      lastRenderTime: duration,
    };

    this.componentMetrics.set(componentId, updated);

    // Also add to current page metrics
    const currentMetrics = this.getCurrentPageMetrics();
    if (currentMetrics) {
      currentMetrics.components.set(componentId, updated);
    }
  }

  public recordInteraction(): void {
    if (this.currentSession) {
      this.currentSession.interactions++;
    }
  }

  public recordConversion(): void {
    if (this.currentSession) {
      this.currentSession.conversions++;
    }
  }

  public recordBounce(): void {
    if (this.currentSession && this.currentSession.pageViews === 1) {
      this.currentSession.bounceTime = performance.now();
    }
  }

  public getVitals(): CoreWebVitals {
    return { ...this.vitals };
  }

  public getCurrentSession(): UserSessionMetrics | null {
    return this.currentSession;
  }

  public getPageMetrics(limit?: number): PageMetrics[] {
    return limit ? this.metrics.slice(-limit) : [...this.metrics];
  }

  public getComponentMetrics(componentId?: string): Map<string, ComponentMetrics> | ComponentMetrics | null {
    if (componentId) {
      return this.componentMetrics.get(componentId) || null;
    }
    return this.componentMetrics;
  }

  public getPerformanceReport(): {
    session: UserSessionMetrics | null;
    vitals: CoreWebVitals;
    pages: PageMetrics[];
    components: Map<string, ComponentMetrics>;
    summary: {
      totalPages: number;
      avgPageLoadTime: number;
      totalErrors: number;
      slowestPage: PageMetrics | null;
      mostRenderedComponent: string | null;
    };
  } {
    const summary = {
      totalPages: this.metrics.length,
      avgPageLoadTime: this.metrics.length > 0
        ? this.metrics.reduce((sum, page) => sum + page.navigation.loadEvent, 0) / this.metrics.length
        : 0,
      totalErrors: this.currentSession?.errors.length || 0,
      slowestPage: this.metrics.length > 0
        ? this.metrics.reduce((slowest, current) =>
            current.navigation.loadEvent > (slowest?.navigation.loadEvent || 0) ? current : slowest
          )
        : null,
      mostRenderedComponent: this.getMostRenderedComponent(),
    };

    return {
      session: this.currentSession,
      vitals: this.vitals,
      pages: this.metrics,
      components: this.componentMetrics,
      summary,
    };
  }

  private getMostRenderedComponent(): string | null {
    let mostRendered: string | null = null;
    let maxRenders = 0;

    for (const [componentId, metrics] of this.componentMetrics.entries()) {
      if (metrics.renders > maxRenders) {
        maxRenders = metrics.renders;
        mostRendered = componentId;
      }
    }

    return mostRendered;
  }

  public exportMetrics(): string {
    const report = this.getPerformanceReport();
    return JSON.stringify(report, null, 2);
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.componentMetrics.clear();
    this.vitals = {} as CoreWebVitals;
  }
}

export const metricsCollector = MetricsCollector.getInstance();
export default metricsCollector;