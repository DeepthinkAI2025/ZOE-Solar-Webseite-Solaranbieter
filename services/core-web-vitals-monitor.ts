/**
 * Core Web Vitals Monitor für ZOE Solar
 *
 * Kontinuierliches Monitoring und automatische Optimierung
 * der Core Web Vitals für maximale SEO-Performance
 */

export interface CoreWebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  si: number; // Speed Index
  tti: number; // Time to Interactive
  score: number; // Overall performance score (0-100)
}

export interface PerformanceAudit {
  timestamp: string;
  metrics: CoreWebVitalsMetrics;
  issues: PerformanceIssue[];
  recommendations: string[];
  scoreBreakdown: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

export interface PerformanceIssue {
  type: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'JS' | 'CSS' | 'IMAGE';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  element?: string;
  recommendation: string;
  impact: string;
}

class CoreWebVitalsMonitor {
  private metrics: CoreWebVitalsMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    si: 0,
    tti: 0,
    score: 0,
  };

  private observations: Map<string, PerformanceObserver> = new Map();
  private auditHistory: PerformanceAudit[] = [];
  private isMonitoring = false;

  // Core Web Vitals Zielwerte (Google Standards)
  private readonly targets = {
    LCP: { good: 2500, needsImprovement: 4000 }, // ms
    FID: { good: 100, needsImprovement: 300 },    // ms
    CLS: { good: 0.1, needsImprovement: 0.25 },    // score
    FCP: { good: 1800, needsImprovement: 3000 },  // ms
    TTFB: { good: 600, needsImprovement: 1000 },  // ms
    TTI: { good: 3800, needsImprovement: 7300 },  // ms
  };

  /**
   * Startet das Core Web Vitals Monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    console.log('🚀 Starte Core Web Vitals Monitoring...');
    this.isMonitoring = true;

    // Performance Observer für LCP
    this.observeLCP();

    // Performance Observer für FID
    this.observeFID();

    // Performance Observer für CLS
    this.observeCLS();

    // Performance Observer für FCP
    this.observeFCP();

    // Performance Observer für TTFB
    this.observeTTFB();

    // Navigation Timing für TTI und SI
    this.observeNavigationTiming();

    // Automatische Optimierung starten
    this.startAutoOptimization();

    // Periodische Audits durchführen
    this.startPeriodicAudits();
  }

  /**
   * Largest Contentful Paint (LCP) überwachen
   */
  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;

        this.metrics.lcp = lastEntry.startTime;
        this.checkLCPOptimizations();

        console.log(`⏱️ LCP: ${Math.round(this.metrics.lcp)}ms`);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observations.set('LCP', observer);
    } catch (error) {
      console.warn('LCP Monitoring nicht unterstützt:', error);
    }
  }

  /**
   * First Input Delay (FID) überwachen
   */
  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const entry = entries[0] as PerformanceEventTiming;

        if (entry.processingStart && entry.startTime) {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkFIDOptimizations();

          console.log(`⚡ FID: ${Math.round(this.metrics.fid)}ms`);
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observations.set('FID', observer);
    } catch (error) {
      console.warn('FID Monitoring nicht unterstützt:', error);
    }
  }

  /**
   * Cumulative Layout Shift (CLS) überwachen
   */
  private observeCLS(): void {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();

        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        this.metrics.cls = clsValue;
        this.checkCLSOptimizations();

        console.log(`📊 CLS: ${this.metrics.cls.toFixed(3)}`);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observations.set('CLS', observer);
    } catch (error) {
      console.warn('CLS Monitoring nicht unterstützt:', error);
    }
  }

  /**
   * First Contentful Paint (FCP) überwachen
   */
  private observeFCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          this.checkFCPOptimizations();

          console.log(`🎨 FCP: ${Math.round(this.metrics.fcp)}ms`);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observations.set('FCP', observer);
    } catch (error) {
      console.warn('FCP Monitoring nicht unterstützt:', error);
    }
  }

  /**
   * Time to First Byte (TTFB) überwachen
   */
  private observeTTFB(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const navigationEntry = entries[0] as PerformanceNavigationTiming;

        if (navigationEntry && navigationEntry.responseStart > 0) {
          this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          this.checkTTFBOptimizations();

          console.log(`🌐 TTFB: ${Math.round(this.metrics.ttfb)}ms`);
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observations.set('TTFB', observer);
    } catch (error) {
      console.warn('TTFB Monitoring nicht unterstützt:', error);
    }
  }

  /**
   * Navigation Timing für zusätzliche Metriken
   */
  private observeNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];

        // Time to Interactive (TTI) approximation
        this.metrics.tti = navEntry.loadEventEnd - navEntry.fetchStart;

        // Speed Index approximation (simplified)
        this.metrics.si = navEntry.loadEventEnd - navEntry.responseStart;

        this.calculateOverallScore();
      }
    }
  }

  /**
   * LCP-Optimierungen prüfen und anwenden
   */
  private checkLCPOptimizations(): void {
    const issues: PerformanceIssue[] = [];

    if (this.metrics.lcp > this.targets.LCP.needsImprovement) {
      issues.push({
        type: 'LCP',
        severity: 'critical',
        description: `LCP ist zu langsam: ${Math.round(this.metrics.lcp)}ms (Ziel: <${this.targets.LCP.good}ms)`,
        recommendation: 'Critical CSS optimieren, Bilder vorladen, Server-Response verbessern',
        impact: 'Starke Auswirkung auf User Experience und Rankings'
      });

      // Automatische LCP-Optimierungen
      this.optimizeLCPCritical();
    } else if (this.metrics.lcp > this.targets.LCP.good) {
      issues.push({
        type: 'LCP',
        severity: 'medium',
        description: `LCP könnte verbessert werden: ${Math.round(this.metrics.lcp)}ms`,
        recommendation: 'Bilder optimieren, Resource Hints hinzufügen',
        impact: 'Moderate Auswirkung auf Rankings'
      });
    }

    this.reportIssues(issues);
  }

  /**
   * FID-Optimierungen prüfen und anwenden
   */
  private checkFIDOptimizations(): void {
    const issues: PerformanceIssue[] = [];

    if (this.metrics.fid > this.targets.FID.needsImprovement) {
      issues.push({
        type: 'FID',
        severity: 'high',
        description: `FID ist zu langsam: ${Math.round(this.metrics.fid)}ms (Ziel: <${this.targets.FID.good}ms)`,
        recommendation: 'JavaScript-Dateien reduzieren, Code Splitting implementieren',
        impact: 'Auswirkung auf Interaktivität und User Engagement'
      });

      this.optimizeFIDCritical();
    }

    this.reportIssues(issues);
  }

  /**
   * CLS-Optimierungen prüfen und anwenden
   */
  private checkCLSOptimizations(): void {
    const issues: PerformanceIssue[] = [];

    if (this.metrics.cls > this.targets.CLS.needsImprovement) {
      issues.push({
        type: 'CLS',
        severity: 'critical',
        description: `CLS ist zu hoch: ${this.metrics.cls.toFixed(3)} (Ziel: <${this.targets.CLS.good})`,
        recommendation: 'Bilder Dimensionen angeben, Font-Display optimieren, Layout Shifts vermeiden',
        impact: 'Starke Auswirkung auf User Experience und Absprungrate'
      });

      this.optimizeCLSCritical();
    }

    this.reportIssues(issues);
  }

  /**
   * FCP-Optimierungen prüfen und anwenden
   */
  private checkFCPOptimizations(): void {
    const issues: PerformanceIssue[] = [];

    if (this.metrics.fcp > this.targets.FCP.needsImprovement) {
      issues.push({
        type: 'FCP',
        severity: 'high',
        description: `FCP ist zu langsam: ${Math.round(this.metrics.fcp)}ms (Ziel: <${this.targets.FCP.good}ms)`,
        recommendation: 'Server-Response optimieren, Render-Blocking Resources reduzieren',
        impact: 'Auswirkung auf wahrgenommene Ladezeit'
      });
    }

    this.reportIssues(issues);
  }

  /**
   * TTFB-Optimierungen prüken und anwenden
   */
  private checkTTFBOptimizations(): void {
    const issues: PerformanceIssue[] = [];

    if (this.metrics.ttfb > this.targets.TTFB.needsImprovement) {
      issues.push({
        type: 'TTFB',
        severity: 'high',
        description: `TTFB ist zu langsam: ${Math.round(this.metrics.ttfb)}ms (Ziel: <${this.targets.TTFB.good}ms)`,
        recommendation: 'Server-Performance optimieren, Caching verbessern, CDN nutzen',
        impact: 'Auswirkung auf alle Ladezeit-Metriken'
      });
    }

    this.reportIssues(issues);
  }

  /**
   * Kritische LCP-Optimierungen automatisch anwenden
   */
  private optimizeLCPCritical(): void {
    // Critical CSS Injection
    this.injectCriticalCSS();

    // Bilder vorladen
    this.preloadAboveTheFoldImages();

    // Schriftarten vorladen
    this.preloadCriticalFonts();
  }

  /**
   * Kritische FID-Optimierungen automatisch anwenden
   */
  private optimizeFIDCritical(): void {
    // Nicht-kritische JavaScript defer/load
    this.optimizeJavaScriptLoading();

    // Event Listener optimieren
    this.optimizeEventListeners();
  }

  /**
   * Kritische CLS-Optimierungen automatisch anwenden
   */
  private optimizeCLSCritical(): void {
    // Bild-Dimensionen sicherstellen
    this.fixImageDimensions();

    // Font-Display optimieren
    this.optimizeFontDisplay();
  }

  /**
   * Critical CSS injizieren
   */
  private injectCriticalCSS(): void {
    const criticalCSS = `
      /* Critical CSS für Above-the-Fold Content */
      .hero-section { display: block; }
      .container { max-width: 1200px; margin: 0 auto; }
      .btn-primary { background: #10b981; color: white; padding: 12px 24px; }
    `;

    // Inlined critical CSS
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }

  /**
   * Bilder vorladen
   */
  private preloadAboveTheFoldImages(): void {
    const heroImages = document.querySelectorAll('.hero-section img');
    heroImages.forEach(img => {
      if (img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Kritische Schriftarten vorladen
   */
  private preloadCriticalFonts(): void {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
    ];

    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * JavaScript-Ladeverhalten optimieren
   */
  private optimizeJavaScriptLoading(): void {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('critical') && !script.hasAttribute('defer') && !script.hasAttribute('async')) {
        script.setAttribute('defer', '');
      }
    });
  }

  /**
   * Event Listener optimieren
   */
  private optimizeEventListeners(): void {
    // Passive Event Listener für Scroll/Touch
    const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'wheel'];

    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true });
    });
  }

  /**
   * Bild-Dimensionen korrigieren
   */
  private fixImageDimensions(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.width && !img.height) {
        // Placeholder dimensions vermeiden CLS
        img.style.aspectRatio = '16/9';
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    });
  }

  /**
   * Font-Display optimieren
   */
  private optimizeFontDisplay(): void {
    const fontDisplayRule = document.createElement('style');
    fontDisplayRule.textContent = `
      @font-face {
        font-family: 'Poppins';
        font-display: swap;
      }
    `;
    document.head.appendChild(fontDisplayRule);
  }

  /**
   * Gesamtscore berechnen
   */
  private calculateOverallScore(): void {
    let score = 100;

    // LCP Score (30%)
    const lcpScore = Math.max(0, 100 - ((this.metrics.lcp - this.targets.LCP.good) / (this.targets.LCP.needsImprovement - this.targets.LCP.good)) * 100);
    score += (lcpScore - 100) * 0.3;

    // FID Score (30%)
    const fidScore = Math.max(0, 100 - ((this.metrics.fid - this.targets.FID.good) / (this.targets.FID.needsImprovement - this.targets.FID.good)) * 100);
    score += (fidScore - 100) * 0.3;

    // CLS Score (40%)
    const clsScore = Math.max(0, 100 - ((this.metrics.cls - this.targets.CLS.good) / (this.targets.CLS.needsImprovement - this.targets.CLS.good)) * 100);
    score += (clsScore - 100) * 0.4;

    this.metrics.score = Math.round(score);

    console.log(`🎯 Overall Performance Score: ${this.metrics.score}/100`);
  }

  /**
   * Performance-Issues melden
   */
  private reportIssues(issues: PerformanceIssue[]): void {
    if (issues.length > 0) {
      console.group('🚨 Performance Issues Detected:');
      issues.forEach(issue => {
        console.warn(`${issue.severity.toUpperCase()}: ${issue.description}`);
        console.info(`💡 ${issue.recommendation}`);
      });
      console.groupEnd();

      // Issues an Google Analytics senden (vereinfacht)
      this.trackPerformanceIssues(issues);
    }
  }

  /**
   * Performance-Issues an Analytics senden
   */
  private trackPerformanceIssues(issues: PerformanceIssue[]): void {
    if (typeof gtag !== 'undefined') {
      issues.forEach(issue => {
        gtag('event', 'performance_issue', {
          event_category: 'Core Web Vitals',
          event_label: issue.type,
          value: Math.round(issue.severity === 'critical' ? 3 : issue.severity === 'high' ? 2 : 1),
          custom_parameter_1: issue.description,
          custom_parameter_2: issue.recommendation
        });
      });
    }
  }

  /**
   * Automatische Optimierung starten
   */
  private startAutoOptimization(): void {
    // Seite wurde vollständig geladen
    if (document.readyState === 'complete') {
      this.performAutoOptimizations();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.performAutoOptimizations(), 1000);
      });
    }
  }

  /**
   * Automatische Optimierungen durchführen
   */
  private performAutoOptimizations(): void {
    console.log('🔧 Führe automatische Performance-Optimierungen durch...');

    // Lazy Loading für Bilder implementieren
    this.implementLazyLoading();

    // Intersection Observer für Animations-Performance
    this.optimizeAnimations();

    // Resource Hints hinzufügen
    this.addResourceHints();
  }

  /**
   * Lazy Loading für Bilder implementieren
   */
  private implementLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Animationen optimieren
   */
  private optimizeAnimations(): void {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            animationObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(el => animationObserver.observe(el));
    }
  }

  /**
   * Resource Hints hinzufügen
   */
  private addResourceHints(): void {
    // DNS Prefetch für externe Ressourcen
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'images.unsplash.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Periodische Audits durchführen
   */
  private startPeriodicAudits(): void {
    // Alle 30 Sekunden ein Performance Audit
    setInterval(() => {
      this.performPerformanceAudit();
    }, 30000);

    // Alle 5 Minuten ein umfassenderes Audit
    setInterval(() => {
      this.performComprehensiveAudit();
    }, 300000);
  }

  /**
   * Performance Audit durchführen
   */
  private performPerformanceAudit(): void {
    const audit: PerformanceAudit = {
      timestamp: new Date().toISOString(),
      metrics: { ...this.metrics },
      issues: [],
      recommendations: [],
      scoreBreakdown: {
        performance: this.metrics.score,
        accessibility: 95, // Vereinfacht
        bestPractices: 90, // Vereinfacht
        seo: 98 // Vereinfacht
      }
    };

    this.auditHistory.push(audit);

    // Nur letzte 10 Audits behalten
    if (this.auditHistory.length > 10) {
      this.auditHistory = this.auditHistory.slice(-10);
    }
  }

  /**
   * Umfassendes Audit durchführen
   */
  private performComprehensiveAudit(): void {
    console.log('🔍 Führe umfassendes Performance Audit durch...');

    // Lighthouse-ähnliche Überprüfungen
    this.checkImageOptimization();
    this.checkJavaScriptOptimization();
    this.checkCSSOptimization();
    this.checkNetworkPerformance();

    this.calculateOverallScore();
  }

  /**
   * Bild-Optimierung prüfen
   */
  private checkImageOptimization(): void {
    const images = document.querySelectorAll('img');
    let unoptimizedImages = 0;

    images.forEach(img => {
      if (!img.src.includes('.webp') && !img.src.includes('data:image')) {
        unoptimizedImages++;
      }
    });

    if (unoptimizedImages > 0) {
      console.warn(`📸 ${unoptimizedImages} Bilder könnten für WebP optimiert werden`);
    }
  }

  /**
   * JavaScript-Optimierung prüfen
   */
  private checkJavaScriptOptimization(): void {
    const scripts = document.querySelectorAll('script[src]');
    const largeScripts = Array.from(scripts).filter(script => {
      // Vereinfachte Größenprüfung
      return script.src && (script.src.includes('.js') || script.src.includes('bundle'));
    });

    if (largeScripts.length > 5) {
      console.warn(`⚡ ${largeScripts.length} JavaScript-Dateien gefunden - Code Splitting empfohlen`);
    }
  }

  /**
   * CSS-Optimierung prüfen
   */
  private checkCSSOptimization(): void {
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    const unusedCSS = styles.length > 3;

    if (unusedCSS) {
      console.warn(`🎨 ${styles.length} CSS-Dateien gefunden - Critical CSS empfohlen`);
    }
  }

  /**
   * Netzwerk-Performance prüfen
   */
  private checkNetworkPerformance(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        console.warn(`🌐 Langsame Verbindung erkannt: ${connection.effectiveType}`);
        this.enableLowDataMode();
      }
    }
  }

  /**
   * Low Data Mode aktivieren
   */
  private enableLowDataMode(): void {
    // Bilder mit niedrigerer Qualität laden
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && img.src.includes('unsplash')) {
        img.src = img.src.replace('q=80', 'q=50').replace('w=1200', 'w=800');
      }
    });
  }

  /**
   * Aktuelle Metriken abrufen
   */
  getCurrentMetrics(): CoreWebVitalsMetrics {
    return { ...this.metrics };
  }

  /**
   * Audit-Historie abrufen
   */
  getAuditHistory(): PerformanceAudit[] {
    return [...this.auditHistory];
  }

  /**
   * Monitoring stoppen
   */
  stopMonitoring(): void {
    console.log('🛑 Stoppe Core Web Vitals Monitoring...');
    this.isMonitoring = false;

    this.observations.forEach(observer => {
      observer.disconnect();
    });

    this.observations.clear();
  }
}

// Singleton-Instanz exportieren
export const coreWebVitalsMonitor = new CoreWebVitalsMonitor();

// Automatisch beim Laden starten (nur im Browser)
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      coreWebVitalsMonitor.startMonitoring();
    });
  } else {
    coreWebVitalsMonitor.startMonitoring();
  }
}