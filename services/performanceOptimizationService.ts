/**
 * ZOE SOLAR - Performance & Core Web Vitals Optimization Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - Core Web Vitals Monitoring
 * - Performance Budget Management  
 * - Resource Optimization
 * - Real-time Performance Tracking
 * - Progressive Enhancement
 */

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  timeToInteractive: number;
  speedIndex: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export interface OptimizationSuggestion {
  metric: string;
  currentValue: number;
  targetValue: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  actionItems: string[];
  estimatedImprovement: string;
}

export interface PerformanceBudget {
  resourceType: string;
  budget: number;
  currentUsage: number;
  isOverBudget: boolean;
  suggestions: string[];
}

export interface MonitoringConfig {
  enableRealTimeTracking: boolean;
  trackUserTiming: boolean;
  measureResourceTimings: boolean;
  monitorWebVitals: boolean;
  alertThresholds: {
    lcp: number;
    fid: number;
    cls: number;
    loadTime: number;
  };
}

export class PerformanceOptimizationService {
  private static instance: PerformanceOptimizationService;
  private isInitialized = false;
  private coreWebVitals: CoreWebVitals | null = null;
  private performanceMetrics: PerformanceMetrics | null = null;
  private monitoringConfig: MonitoringConfig;
  private performanceObserver: PerformanceObserver | null = null;
  private resourceTimings: PerformanceResourceTiming[] = [];
  private userTimings: PerformanceEntry[] = [];

  private constructor() {
    this.monitoringConfig = {
      enableRealTimeTracking: true,
      trackUserTiming: true,
      measureResourceTimings: true,
      monitorWebVitals: true,
      alertThresholds: {
        lcp: 2500, // 2.5s
        fid: 100, // 100ms
        cls: 0.1, // 0.1
        loadTime: 3000 // 3s
      }
    };
  }

  public static getInstance(): PerformanceOptimizationService {
    if (!PerformanceOptimizationService.instance) {
      PerformanceOptimizationService.instance = new PerformanceOptimizationService();
    }
    return PerformanceOptimizationService.instance;
  }

  /**
   * Initialize performance monitoring
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Start performance monitoring
      this.startPerformanceMonitoring();
      
      // Initialize Core Web Vitals tracking
      if (this.monitoringConfig.monitorWebVitals) {
        await this.initializeCoreWebVitals();
      }

      // Set up resource timing monitoring
      if (this.monitoringConfig.measureResourceTimings) {
        this.setupResourceTimingMonitoring();
      }

      // Initialize user timing tracking
      if (this.monitoringConfig.trackUserTiming) {
        this.setupUserTimingTracking();
      }

      // Set up real-time tracking
      if (this.monitoringConfig.enableRealTimeTracking) {
        this.setupRealTimeTracking();
      }

      this.isInitialized = true;
      console.log('🚀 Performance Optimization Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private async initializeCoreWebVitals(): Promise<void> {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.observeTTFB();
  }

  /**
   * Observe Largest Contentful Paint
   */
  private observeLCP(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          this.updateCoreWebVitals('lcp', lastEntry.startTime);
          this.analyzeLCPPerformance(lastEntry);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  /**
   * Observe First Input Delay
   */
  private observeFID(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: PerformanceEventTiming) => {
          this.updateCoreWebVitals('fid', entry.processingStart - entry.startTime);
          this.analyzeFIDPerformance(entry);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  private observeCLS(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.updateCoreWebVitals('cls', clsValue);
        this.analyzeCLSPerformance(clsValue);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Observe First Contentful Paint
   */
  private observeFCP(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: PerformanceEntry) => {
          if (entry.name === 'first-contentful-paint') {
            this.updateCoreWebVitals('fcp', entry.startTime);
            this.analyzeFCPPerformance(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Observe Time to First Byte
   */
  private observeTTFB(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: PerformanceNavigationTiming) => {
          const ttfb = entry.responseStart - entry.requestStart;
          this.updateCoreWebVitals('ttfb', ttfb);
          this.analyzeTTFBPerformance(ttfb);
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  /**
   * Set up resource timing monitoring
   */
  private setupResourceTimingMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.resourceTimings.push(...entries);
        this.analyzeResourcePerformance(entries);
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Set up user timing tracking
   */
  private setupUserTimingTracking(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.userTimings.push(...entries);
      });
      
      observer.observe({ entryTypes: ['measure', 'mark'] });
    }
  }

  /**
   * Set up real-time tracking
   */
  private setupRealTimeTracking(): void {
    // Real-time performance monitoring
    setInterval(() => {
      this.checkPerformanceThresholds();
    }, 5000); // Check every 5 seconds
  }

  /**
   * Start comprehensive performance monitoring
   */
  private startPerformanceMonitoring(): void {
    if (typeof window !== 'undefined') {
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.measurePageLoadPerformance();
        }, 0);
      });

      // Monitor navigation timing
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        const navigationEntries = window.performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          this.measureNavigationPerformance(navigationEntries[0] as PerformanceNavigationTiming);
        }
      }
    }
  }

  /**
   * Measure page load performance
   */
  private measurePageLoadPerformance(): void {
    if (typeof window === 'undefined') return;

    const loadTime = performance.now();
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.performanceMetrics = {
        loadTime,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        timeToInteractive: navigation.domInteractive - navigation.navigationStart,
        speedIndex: this.calculateSpeedIndex(),
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        largestContentfulPaint: this.getLargestContentfulPaint(),
        firstInputDelay: this.getFID(),
        cumulativeLayoutShift: this.getCLS()
      };

      this.analyzePageLoadPerformance();
    }
  }

  /**
   * Measure navigation performance
   */
  private measureNavigationPerformance(navigation: PerformanceNavigationTiming): void {
    const metrics = {
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      tlsHandshake: navigation.connectEnd - navigation.secureConnectionStart,
      requestResponse: navigation.responseEnd - navigation.requestStart,
      domProcessing: navigation.domContentLoadedEventEnd - navigation.domLoading,
      pageLoad: navigation.loadEventEnd - navigation.navigationStart
    };

    this.analyzeNavigationPerformance(metrics);
  }

  /**
   * Update Core Web Vitals
   */
  private updateCoreWebVitals(metric: keyof CoreWebVitals, value: number): void {
    if (!this.coreWebVitals) {
      this.coreWebVitals = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0
      };
    }
    
    this.coreWebVitals[metric] = value;
  }

  /**
   * Get performance budget analysis
   */
  public getPerformanceBudget(): PerformanceBudget[] {
    const budgets: PerformanceBudget[] = [
      {
        resourceType: 'JavaScript',
        budget: 170, // KB
        currentUsage: this.calculateJavaScriptUsage(),
        isOverBudget: false,
        suggestions: this.getJavaScriptOptimizationSuggestions()
      },
      {
        resourceType: 'CSS',
        budget: 100, // KB
        currentUsage: this.calculateCSSUsage(),
        isOverBudget: false,
        suggestions: this.getCSSOptimizationSuggestions()
      },
      {
        resourceType: 'Images',
        budget: 500, // KB
        currentUsage: this.calculateImageUsage(),
        isOverBudget: false,
        suggestions: this.getImageOptimizationSuggestions()
      },
      {
        resourceType: 'Fonts',
        budget: 200, // KB
        currentUsage: this.calculateFontUsage(),
        isOverBudget: false,
        suggestions: this.getFontOptimizationSuggestions()
      }
    ];

    return budgets.map(budget => ({
      ...budget,
      isOverBudget: budget.currentUsage > budget.budget
    }));
  }

  /**
   * Get optimization suggestions
   */
  public getOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    if (this.coreWebVitals) {
      // LCP suggestions
      if (this.coreWebVitals.lcp > this.monitoringConfig.alertThresholds.lcp) {
        suggestions.push({
          metric: 'LCP',
          currentValue: this.coreWebVitals.lcp,
          targetValue: this.monitoringConfig.alertThresholds.lcp,
          impact: 'high',
          description: 'Largest Contentful Paint ist zu langsam',
          actionItems: [
            'Optimieren Sie kritische CSS',
            'Verbessern Sie Server Response Time',
            'Optimieren Sie Largest Content Element',
            'Verwenden Sie Content Delivery Network (CDN)'
          ],
          estimatedImprovement: '30-50% Verbesserung möglich'
        });
      }

      // FID suggestions
      if (this.coreWebVitals.fid > this.monitoringConfig.alertThresholds.fid) {
        suggestions.push({
          metric: 'FID',
          currentValue: this.coreWebVitals.fid,
          targetValue: this.monitoringConfig.alertThresholds.fid,
          impact: 'high',
          description: 'First Input Delay ist zu hoch',
          actionItems: [
            'Reduzieren Sie JavaScript Bundle Size',
            'Verwenden Sie Code Splitting',
            'Optimieren Sie Event Handlers',
            'Vermeiden Sie Long Tasks'
          ],
          estimatedImprovement: '40-60% Verbesserung möglich'
        });
      }

      // CLS suggestions
      if (this.coreWebVitals.cls > this.monitoringConfig.alertThresholds.cls) {
        suggestions.push({
          metric: 'CLS',
          currentValue: this.coreWebVitals.cls,
          targetValue: this.monitoringConfig.alertThresholds.cls,
          impact: 'medium',
          description: 'Cumulative Layout Shift ist zu hoch',
          actionItems: [
            'Geben Sie allen Bildern feste Größen',
            'Reservieren Sie Platz für Ads',
            'Vermeiden Sie dynamische Content Updates',
            'Optimieren Sie Font Loading'
          ],
          estimatedImprovement: '50-70% Verbesserung möglich'
        });
      }
    }

    return suggestions;
  }

  /**
   * Check performance thresholds
   */
  private checkPerformanceThresholds(): void {
    if (!this.coreWebVitals) return;

    const alerts = [];

    if (this.coreWebVitals.lcp > this.monitoringConfig.alertThresholds.lcp) {
      alerts.push(`LCP: ${this.coreWebVitals.lcp}ms (Threshold: ${this.monitoringConfig.alertThresholds.lcp}ms)`);
    }

    if (this.coreWebVitals.fid > this.monitoringConfig.alertThresholds.fid) {
      alerts.push(`FID: ${this.coreWebVitals.fid}ms (Threshold: ${this.monitoringConfig.alertThresholds.fid}ms)`);
    }

    if (this.coreWebVitals.cls > this.monitoringConfig.alertThresholds.cls) {
      alerts.push(`CLS: ${this.coreWebVitals.cls} (Threshold: ${this.monitoringConfig.alertThresholds.cls})`);
    }

    if (alerts.length > 0) {
      console.warn('⚠️ Performance Alerts:', alerts);
    }
  }

  // Helper methods for performance calculations
  private calculateJavaScriptUsage(): number {
    return this.resourceTimings
      .filter(entry => entry.name.includes('.js'))
      .reduce((total, entry) => total + (entry as any).transferSize, 0) / 1024;
  }

  private calculateCSSUsage(): number {
    return this.resourceTimings
      .filter(entry => entry.name.includes('.css'))
      .reduce((total, entry) => total + (entry as any).transferSize, 0) / 1024;
  }

  private calculateImageUsage(): number {
    return this.resourceTimings
      .filter(entry => /\.(jpg|jpeg|png|gif|webp|svg)$/.test(entry.name))
      .reduce((total, entry) => total + (entry as any).transferSize, 0) / 1024;
  }

  private calculateFontUsage(): number {
    return this.resourceTimings
      .filter(entry => /\.(woff|woff2|ttf|otf)$/.test(entry.name))
      .reduce((total, entry) => total + (entry as any).transferSize, 0) / 1024;
  }

  private getJavaScriptOptimizationSuggestions(): string[] {
    return [
      'Use code splitting',
      'Minimize JavaScript bundles',
      'Remove unused code',
      'Optimize import statements'
    ];
  }

  private getCSSOptimizationSuggestions(): string[] {
    return [
      'Remove unused CSS',
      'Inline critical CSS',
      'Minimize CSS files',
      'Use CSS containment'
    ];
  }

  private getImageOptimizationSuggestions(): string[] {
    return [
      'Compress images',
      'Use modern formats (WebP)',
      'Implement lazy loading',
      'Optimize image sizes'
    ];
  }

  private getFontOptimizationSuggestions(): string[] {
    return [
      'Use font-display: swap',
      'Preload critical fonts',
      'Subset font files',
      'Use variable fonts'
    ];
  }

  // Performance analysis methods
  private analyzeLCPPerformance(entry: PerformanceEntry): void {
    const lcp = entry.startTime;
    if (lcp > this.monitoringConfig.alertThresholds.lcp) {
      console.warn(`⚠️ LCP Performance Alert: ${lcp}ms`);
    }
  }

  private analyzeFIDPerformance(entry: PerformanceEventTiming): void {
    const fid = entry.processingStart - entry.startTime;
    if (fid > this.monitoringConfig.alertThresholds.fid) {
      console.warn(`⚠️ FID Performance Alert: ${fid}ms`);
    }
  }

  private analyzeCLSPerformance(cls: number): void {
    if (cls > this.monitoringConfig.alertThresholds.cls) {
      console.warn(`⚠️ CLS Performance Alert: ${cls}`);
    }
  }

  private analyzeFCPPerformance(entry: PerformanceEntry): void {
    const fcp = entry.startTime;
    console.log(`📊 FCP: ${fcp}ms`);
  }

  private analyzeTTFBPerformance(ttfb: number): void {
    const ttfbThreshold = 600; // 600ms
    if (ttfb > ttfbThreshold) {
      console.warn(`⚠️ TTFB Performance Alert: ${ttfb}ms`);
    }
  }

  private analyzeResourcePerformance(entries: PerformanceResourceTiming[]): void {
    entries.forEach(entry => {
      const duration = entry.responseEnd - entry.startTime;
      if (duration > 1000) { // > 1s
        console.warn(`⚠️ Slow Resource: ${entry.name} (${duration}ms)`);
      }
    });
  }

  private analyzePageLoadPerformance(): void {
    if (this.performanceMetrics) {
      console.log('📊 Page Load Performance:', this.performanceMetrics);
    }
  }

  private analyzeNavigationPerformance(metrics: any): void {
    console.log('📊 Navigation Performance:', metrics);
  }

  // Helper methods for getting specific metrics
  private calculateSpeedIndex(): number {
    // Simplified Speed Index calculation
    return performance.now() * 0.8; // Placeholder
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
  }

  private getFID(): number {
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries.length === 0) return 0;
    
    const fid = fidEntries[0] as PerformanceEventTiming;
    return fid.processingStart - fid.startTime;
  }

  private getCLS(): number {
    const clsEntries = performance.getEntriesByType('layout-shift');
    if (clsEntries.length === 0) return 0;
    
    let cls = 0;
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    
    return cls;
  }

  /**
   * Get current Core Web Vitals
   */
  public getCurrentCoreWebVitals(): CoreWebVitals | null {
    return this.coreWebVitals;
  }

  /**
   * Get current performance metrics
   */
  public getCurrentPerformanceMetrics(): PerformanceMetrics | null {
    return this.performanceMetrics;
  }

  /**
   * Enable progressive enhancement
   */
  public enableProgressiveEnhancement(): void {
    // Add CSS for no-JS fallbacks
    const noJsStyle = document.createElement('style');
    noJsStyle.id = 'progressive-enhancement';
    noJsStyle.textContent = `
      .no-js .lazy-load { display: block !important; }
      .no-js .enhanced { display: none !important; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(noJsStyle);

    // Add no-js class
    document.documentElement.classList.remove('js');
    document.documentElement.classList.add('no-js');
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    this.isInitialized = false;
    console.log('🧹 Performance monitoring stopped');
  }
}

// Export singleton instance
export default PerformanceOptimizationService.getInstance();