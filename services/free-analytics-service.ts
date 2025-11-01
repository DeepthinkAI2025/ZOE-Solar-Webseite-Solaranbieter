/**
 * Free Analytics Service für ZOE Solar
 *
 * Komplette Analytics-Lösung ohne Google Analytics Abhängigkeit
 * Nutzt kostenlose Open-Source Tools und APIs
 */

export interface AnalyticsEvent {
  name: string;
  parameters: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
  userAgent: string;
  referrer: string;
  url: string;
}

export interface PageViewData {
  path: string;
  title: string;
  referrer: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  userAgent: string;
  loadTime?: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  sessionId: string;
  url: string;
  userAgent: string;
}

export interface UserBehavior {
  sessionId: string;
  events: AnalyticsEvent[];
  pageViews: PageViewData[];
  performanceMetrics: PerformanceMetric[];
  startTime: number;
  endTime?: number;
  duration: number;
  conversionEvents: AnalyticsEvent[];
  userAgent: string;
  screenResolution: string;
  viewport: string;
  language: string;
  timezone: string;
}

class FreeAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private pageViews: PageViewData[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private userBehavior: Map<string, UserBehavior> = new Map();
  private sessionId: string;
  private userId: string | null = null;
  private isEnabled = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUserTracking();
    this.initializePerformanceMonitoring();
    this.startDataPersistence();
    this.enableFreeAnalyticsTools();
  }

  /**
   * Session ID generieren
   */
  private generateSessionId(): string {
    let sessionId = sessionStorage.getItem('free_analytics_session_id');

    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('free_analytics_session_id', sessionId);
    }

    return sessionId;
  }

  /**
   * Benutzer-Tracking initialisieren
   */
  private initializeUserTracking(): void {
    if (typeof window === 'undefined') return;

    const behavior: UserBehavior = {
      sessionId: this.sessionId,
      events: [],
      pageViews: [],
      performanceMetrics: [],
      startTime: Date.now(),
      duration: 0,
      conversionEvents: [],
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.userBehavior.set(this.sessionId, behavior);

    // Page Exit Tracking
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });

    // Visibility Change Tracking
    document.addEventListener('visibilitychange', () => {
      this.trackVisibilityChange();
    });
  }

  /**
   * Performance-Monitoring initialisieren
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Core Web Vitals automatisch tracken
    this.trackCoreWebVitals();

    // Page Load Performance
    window.addEventListener('load', () => {
      this.trackPageLoadPerformance();
    });
  }

  /**
   * Core Web Vitals tracken
   */
  private trackCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  /**
   * LCP (Largest Contentful Paint) beobachten
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;

      this.trackPerformance({
        name: 'LCP',
        value: Math.round(lastEntry.startTime),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * FID (First Input Delay) beobachten
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const entry = entries[0] as PerformanceEventTiming;

      if (entry.processingStart && entry.startTime) {
        const fid = entry.processingStart - entry.startTime;

        this.trackPerformance({
          name: 'FID',
          value: Math.round(fid),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  /**
   * CLS (Cumulative Layout Shift) beobachten
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();

      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }

      this.trackPerformance({
        name: 'CLS',
        value: Math.round(clsValue * 1000),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * FCP (First Contentful Paint) beobachten
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        this.trackPerformance({
          name: 'FCP',
          value: Math.round(fcpEntry.startTime),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      }
    }).observe({ entryTypes: ['paint'] });
  }

  /**
   * Page Load Performance tracken
   */
  private trackPageLoadPerformance(): void {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = [
        { name: 'TTFB', value: Math.round(navigation.responseStart - navigation.requestStart) },
        { name: 'DOM_Load', value: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart) },
        { name: 'Window_Load', value: Math.round(navigation.loadEventEnd - navigation.navigationStart) },
        { name: 'DNS_Lookup', value: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart) }
      ];

      metrics.forEach(metric => {
        if (metric.value > 0) {
          this.trackPerformance({
            name: metric.name,
            value: metric.value,
            url: window.location.href,
            userAgent: navigator.userAgent
          });
        }
      });
    }
  }

  /**
   * Kostenlose Analytics-Tools aktivieren
   */
  private enableFreeAnalyticsTools(): void {
    // Plausible (Open-Source Alternative)
    this.enablePlausible();

    // Simple Analytics (Open-Source Alternative)
    this.enableSimpleAnalytics();

    // Fathom (Self-hosted Alternative)
    this.enableFathom();

    // Umami (Open-Source Alternative)
    this.enableUmami();
  }

  /**
   * Plausible Analytics aktivieren
   */
  private enablePlausible(): void {
    // Prüfen ob Plausible verfügbar ist
    const plausibleScript = document.querySelector('script[data-domain*="plausible"]');

    if (!plausibleScript) {
      // Plausible Script dynamisch laden
      const script = document.createElement('script');
      script.dataset.domain = 'zoe-solar.de';
      script.src = 'https://plausible.io/js/plausible.js';
      script.defer = true;
      script.setAttribute('data-exclude', '/admin,/api');
      document.head.appendChild(script);

      console.log('✅ Plausible Analytics aktiviert');
    }
  }

  /**
   * Simple Analytics aktivieren
   */
  private enableSimpleAnalytics(): void {
    // Simple Analytics Script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://scripts.simpleanalyticscdn.com/latest.js';
    document.head.appendChild(script);

    console.log('✅ Simple Analytics aktiviert');
  }

  /**
   * Fathom Analytics aktivieren
   */
  private enableFathom(): void {
    // Fathom Script (Self-hosted Variante)
    const script = document.createElement('script');
    script.src = 'https://cdn.usefathom.com/script.js';
    script.dataset.site = 'YOUR-FATHOM-ID'; // Wäre zu konfigurieren
    script.defer = true;
    document.head.appendChild(script);

    console.log('✅ Fathom Analytics aktiviert (Konfiguration benötigt)');
  }

  /**
   * Umami Analytics aktivieren
   */
  private enableUmami(): void {
    // Umami Script (Open-Source)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://analytics.umami.is/script.js';
    script.dataset.websiteId = 'YOUR-WEBSITE-ID'; // Wäre zu konfigurieren
    document.head.appendChild(script);

    console.log('✅ Umami Analytics aktiviert (Konfiguration benötigt)');
  }

  /**
   * Page View tracken
   */
  trackPageView(path?: string, title?: string): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const pageView: PageViewData = {
      path: path || window.location.pathname,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      userAgent: navigator.userAgent,
      loadTime: this.getPageLoadTime()
    };

    this.pageViews.push(pageView);

    // In User Behavior speichern
    const behavior = this.userBehavior.get(this.sessionId);
    if (behavior) {
      behavior.pageViews.push(pageView);
    }

    // An externe Tools senden
    this.sendToExternalTools('pageview', {
      path: pageView.path,
      title: pageView.title,
      referrer: pageView.referrer
    });

    console.log('📊 Page View tracked:', pageView);
  }

  /**
   * Custom Event tracken
   */
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      name: eventName,
      parameters,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href
    };

    this.events.push(event);

    // In User Behavior speichern
    const behavior = this.userBehavior.get(this.sessionId);
    if (behavior) {
      behavior.events.push(event);

      // Conversion Events markieren
      if (this.isConversionEvent(eventName)) {
        behavior.conversionEvents.push(event);
      }
    }

    // An externe Tools senden
    this.sendToExternalTools(eventName, parameters);

    console.log('📈 Event tracked:', event);
  }

  /**
   * Performance-Metrik tracken
   */
  private trackPerformance(metric: {
    name: string;
    value: number;
    url: string;
    userAgent: string;
  }): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: metric.url,
      userAgent: metric.userAgent
    };

    this.performanceMetrics.push(performanceMetric);

    // In User Behavior speichern
    const behavior = this.userBehavior.get(this.sessionId);
    if (behavior) {
      behavior.performanceMetrics.push(performanceMetric);
    }
  }

  /**
   * Events an externe Tools senden
   */
  private sendToExternalTools(eventName: string, parameters: Record<string, any>): void {
    // Plausible
    if (window.plausible) {
      window.plausible(eventName, { props: parameters });
    }

    // Simple Analytics
    if (window.sa_event) {
      window.sa_event(eventName, parameters);
    }

    // Fathom
    if (window.fathom) {
      window.fathom.trackEvent(eventName, { _value: parameters.value });
    }

    // Umami
    if (window.umami) {
      window.umami.track(eventName, parameters);
    }
  }

  /**
   * Conversion-Event erkennen
   */
  private isConversionEvent(eventName: string): boolean {
    const conversionEvents = [
      'contact_form_submit',
      'phone_call_click',
      'consultation_request',
      'quote_request',
      'calculator_usage',
      'newsletter_signup',
      'download_brochure'
    ];

    return conversionEvents.includes(eventName);
  }

  /**
   * Page Load Time berechnen
   */
  private getPageLoadTime(): number | undefined {
    if (!('performance' in window)) return undefined;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return Math.round(navigation.loadEventEnd - navigation.navigationStart);
    }

    return undefined;
  }

  /**
   * Session-Ende tracken
   */
  private trackSessionEnd(): void {
    const behavior = this.userBehavior.get(this.sessionId);
    if (behavior) {
      behavior.endTime = Date.now();
      behavior.duration = behavior.endTime - behavior.startTime;

      // Session-Daten speichern
      this.saveSessionData(behavior);

      // Externe Tools benachrichtigen
      this.sendToExternalTools('session_end', {
        duration: behavior.duration,
        pageViews: behavior.pageViews.length,
        events: behavior.events.length
      });
    }
  }

  /**
   * Visibility-Change tracken
   */
  private trackVisibilityChange(): void {
    if (document.hidden) {
      this.trackEvent('page_hidden', { timestamp: Date.now() });
    } else {
      this.trackEvent('page_visible', { timestamp: Date.now() });
    }
  }

  /**
   * Datenpersistenz starten
   */
  private startDataPersistence(): void {
    // Alle 30 Sekunden Daten speichern
    setInterval(() => {
      this.saveCurrentSessionData();
    }, 30000);

    // Daten beim Seitenwechsel speichern
    window.addEventListener('beforeunload', () => {
      this.saveCurrentSessionData();
    });
  }

  /**
   * Aktuelle Session-Daten speichern
   */
  private saveCurrentSessionData(): void {
    const behavior = this.userBehavior.get(this.sessionId);
    if (behavior) {
      this.saveSessionData(behavior);
    }
  }

  /**
   * Session-Daten speichern (LocalStorage)
   */
  private saveSessionData(behavior: UserBehavior): void {
    try {
      const existingData = localStorage.getItem('free_analytics_data') || '[]';
      const allData = JSON.parse(existingData);

      // Alte Sessions entfernen (nur letzte 100 behalten)
      if (allData.length > 100) {
        allData.splice(0, allData.length - 100);
      }

      // Aktuelle Session hinzufügen oder aktualisieren
      const existingIndex = allData.findIndex((session: UserBehavior) => session.sessionId === behavior.sessionId);
      if (existingIndex >= 0) {
        allData[existingIndex] = behavior;
      } else {
        allData.push(behavior);
      }

      localStorage.setItem('free_analytics_data', JSON.stringify(allData));
    } catch (error) {
      console.error('Fehler beim Speichern der Analytics-Daten:', error);
    }
  }

  /**
   * Benutzer-ID setzen
   */
  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('free_analytics_user_id', userId);

    this.trackEvent('user_identified', { user_id: userId });
  }

  /**
   * Benutzer-Trackings deaktivieren (Privacy-Compliance)
   */
  disable(): void {
    this.isEnabled = false;
    localStorage.setItem('free_analytics_consent', 'false');
  }

  /**
   * Benutzer-Trackings aktivieren
   */
  enable(): void {
    this.isEnabled = true;
    localStorage.setItem('free_analytics_consent', 'true');
  }

  /**
   * Check ob Tracking aktiviert ist
   */
  isTrackingEnabled(): boolean {
    const consent = localStorage.getItem('free_analytics_consent');
    return this.isEnabled && consent !== 'false';
  }

  /**
   * Alle Daten abrufen
   */
  getAllData(): {
    events: AnalyticsEvent[];
    pageViews: PageViewData[];
    performanceMetrics: PerformanceMetric[];
    userBehavior: UserBehavior[];
  } {
    return {
      events: [...this.events],
      pageViews: [...this.pageViews],
      performanceMetrics: [...this.performanceMetrics],
      userBehavior: Array.from(this.userBehavior.values())
    };
  }

  /**
   * Analytics-Report generieren
   */
  generateAnalyticsReport(): {
    summary: {
      totalSessions: number;
      totalPageViews: number;
      totalEvents: number;
      averageSessionDuration: number;
      conversionRate: number;
      bounceRate: number;
    };
    topPages: Array<{
      path: string;
      views: number;
      avgTimeOnPage: number;
      bounceRate: number;
    }>;
    topEvents: Array<{
      eventName: string;
      count: number;
      conversionRate: number;
    }>;
    performanceMetrics: {
      averageLoadTime: number;
      averageLCP: number;
      averageFID: number;
      averageCLS: number;
    };
    userEngagement: {
      returningUsers: number;
      newUsers: number;
      avgPagesPerSession: number;
      avgSessionDuration: number;
    };
    realTime: {
      activeSessions: number;
      currentUsers: number;
      topPage: string;
    };
  } {
    const allData = this.getAllData();

    // Grundlegende Metriken berechnen
    const summary = {
      totalSessions: allData.userBehavior.length,
      totalPageViews: allData.pageViews.length,
      totalEvents: allData.events.length,
      averageSessionDuration: this.calculateAverageSessionDuration(allData.userBehavior),
      conversionRate: this.calculateConversionRate(allData.userBehavior),
      bounceRate: this.calculateBounceRate(allData.userBehavior)
    };

    // Top-Seiten analysieren
    const topPages = this.analyzeTopPages(allData.pageViews);

    // Top-Events analysieren
    const topEvents = this.analyzeTopEvents(allData.events);

    // Performance-Metriken
    const performanceMetrics = this.analyzePerformanceMetrics(allData.performanceMetrics);

    // User Engagement
    const userEngagement = this.analyzeUserEngagement(allData.userBehavior);

    // Real-Time Daten
    const realTime = this.getRealTimeData(allData.userBehavior);

    return {
      summary,
      topPages,
      topEvents,
      performanceMetrics,
      userEngagement,
      realTime
    };
  }

  /**
   * Durchschnittliche Session-Dauer berechnen
   */
  private calculateAverageSessionDuration(userBehaviors: UserBehavior[]): number {
    if (userBehaviors.length === 0) return 0;

    const totalDuration = userBehaviors.reduce((sum, behavior) => {
      return sum + (behavior.endTime || Date.now()) - behavior.startTime;
    }, 0);

    return Math.round(totalDuration / userBehaviors.length / 1000); // in Sekunden
  }

  /**
   * Conversion-Rate berechnen
   */
  private calculateConversionRate(userBehaviors: UserBehavior[]): number {
    if (userBehaviors.length === 0) return 0;

    const sessionsWithConversions = userBehaviors.filter(behavior =>
      behavior.conversionEvents.length > 0
    ).length;

    return Math.round((sessionsWithConversions / userBehaviors.length) * 100);
  }

  /**
   * Bounce-Rate berechnen
   */
  private calculateBounceRate(userBehaviors: UserBehavior[]): number {
    if (userBehaviors.length === 0) return 0;

    const bouncedSessions = userBehaviors.filter(behavior =>
      behavior.pageViews.length === 1
    ).length;

    return Math.round((bouncedSessions / userBehaviors.length) * 100);
  }

  /**
   * Top-Seiten analysieren
   */
  private analyzeTopPages(pageViews: PageViewData[]): Array<{
    path: string;
    views: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }> {
    const pageStats = new Map<string, {
      views: number;
      totalTime: number;
      singleViewSessions: Set<string>;
    }>();

    pageViews.forEach(pageView => {
      const path = pageView.path;
      if (!pageStats.has(path)) {
        pageStats.set(path, {
          views: 0,
          totalTime: 0,
          singleViewSessions: new Set()
        });
      }

      const stats = pageStats.get(path)!;
      stats.views++;

      // Zeit auf Seite berechnen (vereinfacht)
      if (pageView.loadTime) {
        stats.totalTime += pageView.loadTime;
      }

      // Single-View-Sessions für Bounce-Rate
      const sessionPages = pageViews.filter(pv => pv.sessionId === pageView.sessionId);
      if (sessionPages.length === 1) {
        stats.singleViewSessions.add(pageView.sessionId);
      }
    });

    return Array.from(pageStats.entries())
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        avgTimeOnPage: Math.round(stats.totalTime / stats.views),
        bounceRate: Math.round((stats.singleViewSessions.size / stats.views) * 100)
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  /**
   * Top-Events analysieren
   */
  private analyzeTopEvents(events: AnalyticsEvent[]): Array<{
    eventName: string;
    count: number;
    conversionRate: number;
  }> {
    const eventStats = new Map<string, number>();

    events.forEach(event => {
      eventStats.set(event.name, (eventStats.get(event.name) || 0) + 1);
    });

    return Array.from(eventStats.entries())
      .map(([eventName, count]) => ({
        eventName,
        count,
        conversionRate: this.isConversionEvent(eventName) ? 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Performance-Metriken analysieren
   */
  private analyzePerformanceMetrics(metrics: PerformanceMetric[]): {
    averageLoadTime: number;
    averageLCP: number;
    averageFID: number;
    averageCLS: number;
  } {
    const metricGroups = {
      loadTime: [] as number[],
      LCP: [] as number[],
      FID: [] as number[],
      CLS: [] as number[]
    };

    metrics.forEach(metric => {
      switch (metric.name) {
        case 'Window_Load':
        case 'TTFB':
          metricGroups.loadTime.push(metric.value);
          break;
        case 'LCP':
          metricGroups.LCP.push(metric.value);
          break;
        case 'FID':
          metricGroups.FID.push(metric.value);
          break;
        case 'CLS':
          metricGroups.CLS.push(metric.value);
          break;
      }
    });

    const average = (arr: number[]) =>
      arr.length > 0 ? Math.round(arr.reduce((sum, val) => sum + val, 0) / arr.length) : 0;

    return {
      averageLoadTime: average(metricGroups.loadTime),
      averageLCP: average(metricGroups.LCP),
      averageFID: average(metricGroups.FID),
      averageCLS: average(metricGroups.CLS)
    };
  }

  /**
   * User Engagement analysieren
   */
  private analyzeUserEngagement(userBehaviors: UserBehavior[]): {
    returningUsers: number;
    newUsers: number;
    avgPagesPerSession: number;
    avgSessionDuration: number;
  } {
    // Vereinfachte Analyse - in echt würde man User-Cookie-basiertes Tracking verwenden
    const totalPages = userBehaviors.reduce((sum, behavior) => sum + behavior.pageViews.length, 0);
    const totalDuration = userBehaviors.reduce((sum, behavior) => sum + behavior.duration, 0);

    return {
      returningUsers: Math.round(userBehaviors.length * 0.3), // 30% geschätzt
      newUsers: Math.round(userBehaviors.length * 0.7),      // 70% geschätzt
      avgPagesPerSession: userBehaviors.length > 0 ? totalPages / userBehaviors.length : 0,
      avgSessionDuration: userBehaviors.length > 0 ? totalDuration / userBehaviors.length / 1000 : 0
    };
  }

  /**
   * Real-Time Daten
   */
  private getRealTimeData(userBehaviors: UserBehavior[]): {
    activeSessions: number;
    currentUsers: number;
    topPage: string;
  } {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    const activeSessions = userBehaviors.filter(behavior => {
      const lastActivity = Math.max(
        behavior.endTime || behavior.startTime,
        ...behavior.events.map(e => e.timestamp),
        ...behavior.pageViews.map(pv => pv.timestamp)
      );
      return lastActivity > fiveMinutesAgo;
    }).length;

    // Top-Page aus aktiven Sessions
    const activePageViews = this.pageViews.filter(pv => {
      const session = userBehaviors.find(ub => ub.sessionId === pv.sessionId);
      return session && (pv.timestamp > fiveMinutesAgo);
    });

    const pageFrequency = new Map<string, number>();
    activePageViews.forEach(pv => {
      pageFrequency.set(pv.path, (pageFrequency.get(pv.path) || 0) + 1);
    });

    const topPage = Array.from(pageFrequency.entries())
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '/';

    return {
      activeSessions,
      currentUsers: activeSessions,
      topPage
    };
  }

  /**
   * Daten exportieren (für Backup/Analyse)
   */
  exportData(): string {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      summary: this.generateAnalyticsReport(),
      rawData: this.getAllData()
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Daten importieren
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.version && data.rawData) {
        // Alte Daten mit neuen合并
        const existingData = JSON.parse(localStorage.getItem('free_analytics_data') || '[]');
        const allData = [...existingData, ...data.rawData.userBehavior];

        // Duplikate entfernen
        const uniqueData = allData.filter((session, index, self) =>
          index === self.findIndex(s => s.sessionId === session.sessionId)
        );

        localStorage.setItem('free_analytics_data', JSON.stringify(uniqueData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Fehler beim Importieren der Daten:', error);
      return false;
    }
  }
}

// Singleton-Instanz erstellen
export const freeAnalyticsService = new FreeAnalyticsService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.freeAnalytics = freeAnalyticsService;
}

export default freeAnalyticsService;

// Types für globale Erweiterung
declare global {
  interface Window {
    freeAnalytics: typeof freeAnalyticsService;
    plausible?: any;
    sa_event?: any;
    fathom?: any;
    umami?: any;
  }
}