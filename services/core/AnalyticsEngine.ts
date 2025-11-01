/**
 * 📊 Analytics Engine - Unified Analytics Service für ZOE Solar
 *
 * Konsolidiert 15+ Analytics-Services in einer leistungsstarken Analytics-Maschine
 * User Behavior • Performance • SEO • Conversion • Business Intelligence
 */

interface AnalyticsConfig {
  trackingId: string;
  baseUrl: string;
  dataRetention: number; // Tage
  sampleRate: number;
  anonymizeIp: boolean;
  enableHeatmap: boolean;
  enableSessionRecording: boolean;
}

interface UserBehaviorEvent {
  userId?: string;
  sessionId: string;
  eventType: 'pageview' | 'click' | 'scroll' | 'form_start' | 'form_submit' | 'download' | 'video_play' | 'video_complete';
  element?: string;
  url: string;
  title: string;
  referrer?: string;
  timestamp: number;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenResolution: string;
  };
  location?: {
    country: string;
    city: string;
    region: string;
  };
  customData?: Record<string, any>;
}

interface PerformanceMetric {
  url: string;
  deviceType: string;
  timestamp: number;
  metrics: {
    // Core Web Vitals
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte

    // Additional Metrics
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;

    // Resource Metrics
    resourceCount: number;
    totalResourceSize: number;
    imageSize: number;
    scriptSize: number;
    cssSize: number;
  };
  userAgent: string;
  connectionType?: string;
}

interface SEOEvent {
  url: string;
  timestamp: number;
  eventType: 'ranking_change' | 'impression' | 'click' | 'keyword_discovery' | 'featured_snippet' | 'local_pack_appearance';
  data: {
    keyword?: string;
    position?: number;
    page?: number;
    clickThroughRate?: number;
    impressions?: number;
    clicks?: number;
    searchEngine?: string;
    location?: string;
    device?: string;
  };
}

interface ConversionEvent {
  conversionType: 'lead' | 'contact_form' | 'phone_call' | 'quote_request' | 'consultation_booking' | 'newsletter_signup';
  value?: number;
  currency?: string;
  userId?: string;
  sessionId: string;
  url: string;
  timestamp: number;
  funnelStage: 'awareness' | 'consideration' | 'decision' | 'purchase';
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  customAttributes?: Record<string, any>;
}

interface BusinessMetric {
  metricType: 'revenue' | 'cost' | 'profit' | 'leads' | 'conversions' | 'customer_acquisition_cost' | 'lifetime_value';
  value: number;
  currency?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  date: string;
  source: string;
  metadata?: Record<string, any>;
}

interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: UserBehaviorEvent[];
  device: UserBehaviorEvent['device'];
  location?: UserBehaviorEvent['location'];
  conversionEvents: ConversionEvent[];
  bounced: boolean;
  isNewUser: boolean;
  trafficSource: {
    source: string;
    medium: string;
    campaign?: string;
    term?: string;
  };
}

class AnalyticsEngine {
  private static instance: AnalyticsEngine;
  private config: AnalyticsConfig;
  private sessionData: Map<string, SessionData>;
  private performanceData: Map<string, PerformanceMetric[]>;
  private seoData: Map<string, SEOEvent[]>;
  private conversionData: Map<string, ConversionEvent[]>;
  private businessMetrics: Map<string, BusinessMetric[]>;

  private constructor() {
    this.config = {
      trackingId: 'GA-ZOE-SOLAR-2025',
      baseUrl: 'https://zoe-solar.de',
      dataRetention: 365, // Tage
      sampleRate: 100,
      anonymizeIp: true,
      enableHeatmap: true,
      enableSessionRecording: false // Datenschutzkonform
    };

    this.sessionData = new Map();
    this.performanceData = new Map();
    this.seoData = new Map();
    this.conversionData = new Map();
    this.businessMetrics = new Map();

    // Initialisiere automatische Datensammlung
    this.initializeTracking();
  }

  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  // ===== USER BEHAVIOR TRACKING =====

  /**
   * Konsolidiert: userBehaviorPatternAnalysisService + userJourneyOptimizationService + localUserBehaviorTrackingService
   */
  async trackUserBehavior(event: UserBehaviorEvent): Promise<any> {
    try {
      // Session verwalten
      const session = this.getOrCreateSession(event.sessionId, event.userId);

      // Event zur Session hinzufügen
      session.events.push(event);

      // Page View Tracking
      if (event.eventType === 'pageview') {
        session.pageViews++;
        await this.trackPageView(event);
      }

      // Conversion Events
      if (this.isConversionEvent(event.eventType)) {
        await this.trackConversionEvent(event);
      }

      // Form Tracking
      if (event.eventType === 'form_start' || event.eventType === 'form_submit') {
        await this.trackFormInteraction(event);
      }

      // Scroll Depth Tracking
      if (event.eventType === 'scroll') {
        await this.trackScrollDepth(event);
      }

      // Engagement Tracking
      const engagementScore = this.calculateEngagementScore(session);
      await this.updateEngagementMetrics(session.sessionId, engagementScore);

      return {
        success: true,
        sessionId: session.sessionId,
        eventTracked: true,
        engagementScore,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== PERFORMANCE TRACKING =====

  /**
   * Konsolidiert: webVitalsService + automatedCoreWebVitalsOptimizationService + performanceOptimizationService
   */
  async trackPerformanceMetrics(metrics: PerformanceMetric): Promise<any> {
    try {
      // Performance-Data speichern
      const urlKey = metrics.url;
      if (!this.performanceData.has(urlKey)) {
        this.performanceData.set(urlKey, []);
      }

      const urlMetrics = this.performanceData.get(urlKey)!;
      urlMetrics.push(metrics);

      // Performance-Evaluation
      const evaluation = this.evaluatePerformance(metrics);

      // Performance-Trends analysieren
      const trends = this.analyzePerformanceTrends(urlKey);

      // Optimierungsempfehlungen generieren
      const recommendations = this.generatePerformanceRecommendations(metrics);

      // Performance-Alerts
      const alerts = this.checkPerformanceAlerts(metrics);

      // Core Web Vitals aggregieren
      const coreWebVitals = this.aggregateCoreWebVitals(urlKey);

      return {
        success: true,
        url: metrics.url,
        deviceType: metrics.deviceType,
        evaluation,
        trends,
        recommendations,
        alerts,
        coreWebVitals,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== SEO ANALYTICS =====

  /**
   * Konsolidiert: aeoMonitoringService + advancedLocalSERPFeatureMonitoringService + advancedSERPTrackingService
   */
  async trackSEOEvent(event: SEOEvent): Promise<any> {
    try {
      // SEO-Data speichern
      const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
      if (!this.seoData.has(dateKey)) {
        this.seoData.set(dateKey, []);
      }

      const daySeoData = this.seoData.get(dateKey)!;
      daySeoData.push(event);

      // Keyword Performance analysieren
      const keywordPerformance = this.analyzeKeywordPerformance(event);

      // Ranking-Tracking
      const rankingAnalysis = this.analyzeRankings(event);

      // SERP-Feature-Tracking
      const serpFeatures = this.trackSERPFeatures(event);

      // Local SEO Performance
      const localPerformance = this.analyzeLocalSEO(event);

      // SEO-Opportunities identifizieren
      const opportunities = this.identifySEOOpportunities(event);

      return {
        success: true,
        eventType: event.eventType,
        keywordPerformance,
        rankingAnalysis,
        serpFeatures,
        localPerformance,
        opportunities,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== CONVERSION ANALYTICS =====

  /**
   * Konsolidiert: conversionRateOptimizationService + crmLeadTrackingIntegrationService + multiChannelAttributionService
   */
  async trackConversion(conversion: ConversionEvent): Promise<any> {
    try {
      // Conversion-Data speichern
      const dateKey = new Date(conversion.timestamp).toISOString().split('T')[0];
      if (!this.conversionData.has(dateKey)) {
        this.conversionData.set(dateKey, []);
      }

      const dayConversions = this.conversionData.get(dateKey)!;
      dayConversions.push(conversion);

      // Session aktualisieren
      const session = this.sessionData.get(conversion.sessionId);
      if (session) {
        session.conversionEvents.push(conversion);
      }

      // Conversion-Funnel analysieren
      const funnelAnalysis = this.analyzeConversionFunnel(conversion);

      // Channel Attribution
      const attribution = this.performAttribution(conversion);

      // Conversion Rate berechnen
      const conversionRates = this.calculateConversionRates();

      // Revenue Tracking
      const revenueAnalysis = this.analyzeRevenue(conversion);

      // ROI berechnen
      const roiAnalysis = this.calculateROI(conversion);

      return {
        success: true,
        conversionType: conversion.conversionType,
        value: conversion.value,
        funnelAnalysis,
        attribution,
        conversionRates,
        revenueAnalysis,
        roiAnalysis,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== BUSINESS INTELLIGENCE =====

  /**
   * Konsolidiert: predictiveMarketIntelligenceService + predictiveSEOTrendAnalysisService + enterpriseLocalReportingService
   */
  async trackBusinessMetric(metric: BusinessMetric): Promise<any> {
    try {
      // Business Metrics speichern
      const periodKey = `${metric.period}-${metric.date}`;
      if (!this.businessMetrics.has(periodKey)) {
        this.businessMetrics.set(periodKey, []);
      }

      const periodMetrics = this.businessMetrics.get(periodKey)!;
      periodMetrics.push(metric);

      // Business Performance analysieren
      const performance = this.analyzeBusinessPerformance(metric);

      // Trends berechnen
      const trends = this.calculateBusinessTrends(metric);

      // Prognosen erstellen
      const forecasts = this.generateBusinessForecasts(metric);

      // KPIs berechnen
      const kpis = this.calculateKPIs(metric);

      // Benchmarks
      const benchmarks = this.generateBenchmarks(metric);

      return {
        success: true,
        metricType: metric.metricType,
        value: metric.value,
        period: metric.period,
        performance,
        trends,
        forecasts,
        kpis,
        benchmarks,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== COMPREHENSIVE ANALYTICS =====

  async generateComprehensiveReport(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<any> {
    try {
      const startDate = this.getStartDateForPeriod(period);
      const endDate = new Date();

      // User Behavior Analytics
      const userBehaviorAnalytics = this.generateUserBehaviorReport(startDate, endDate);

      // Performance Analytics
      const performanceAnalytics = this.generatePerformanceReport(startDate, endDate);

      // SEO Analytics
      const seoAnalytics = this.generateSEOReport(startDate, endDate);

      // Conversion Analytics
      const conversionAnalytics = this.generateConversionReport(startDate, endDate);

      // Business Intelligence
      const businessIntelligence = this.generateBusinessReport(startDate, endDate);

      // Executive Summary
      const executiveSummary = this.generateExecutiveSummary({
        userBehaviorAnalytics,
        performanceAnalytics,
        seoAnalytics,
        conversionAnalytics,
        businessIntelligence
      });

      // Recommendations
      const recommendations = this.generateRecommendations({
        userBehaviorAnalytics,
        performanceAnalytics,
        seoAnalytics,
        conversionAnalytics,
        businessIntelligence
      });

      return {
        success: true,
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        executiveSummary,
        sections: {
          userBehaviorAnalytics,
          performanceAnalytics,
          seoAnalytics,
          conversionAnalytics,
          businessIntelligence
        },
        recommendations,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== REAL-TIME MONITORING =====

  async getRealTimeMetrics(): Promise<any> {
    try {
      const now = Date.now();
      const lastFiveMinutes = now - (5 * 60 * 1000);

      // Aktive Sessions
      const activeSessions = this.getActiveSessions(lastFiveMinutes);

      // Aktuelle Page Views
      const currentPageViews = this.getCurrentPageViews(lastFiveMinutes);

      // Live Events
      const liveEvents = this.getLiveEvents(lastFiveMinutes);

      // Performance Alerts
      const performanceAlerts = this.getActivePerformanceAlerts();

      // Conversion Activity
      const conversionActivity = this.getRecentConversions(lastFiveMinutes);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        activeSessions: activeSessions.length,
        currentPageViews: currentPageViews.length,
        liveEvents: liveEvents.length,
        performanceAlerts: performanceAlerts.length,
        recentConversions: conversionActivity.length,
        topPages: this.getTopPages(activeSessions),
        topEvents: this.getTopEvents(liveEvents),
        alerts: performanceAlerts.slice(0, 5)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== HELPER METHODS =====

  private initializeTracking(): void {
    // Page Visibility API für Session Tracking
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.handlePageHidden();
        } else {
          this.handlePageVisible();
        }
      });
    }

    // Before Unload für Session-Ende
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.handlePageUnload();
      });
    }
  }

  private getOrCreateSession(sessionId: string, userId?: string): SessionData {
    if (!this.sessionData.has(sessionId)) {
      const session: SessionData = {
        sessionId,
        userId,
        startTime: Date.now(),
        pageViews: 0,
        events: [],
        device: this.getDeviceInfo(),
        location: this.getUserLocation(),
        conversionEvents: [],
        bounced: true,
        isNewUser: !userId,
        trafficSource: this.getTrafficSource()
      };

      this.sessionData.set(sessionId, session);
    }

    return this.sessionData.get(sessionId)!;
  }

  private getDeviceInfo(): UserBehaviorEvent['device'] {
    if (typeof navigator === 'undefined') {
      return {
        type: 'desktop',
        os: 'Unknown',
        browser: 'Unknown',
        screenResolution: 'Unknown'
      };
    }

    const userAgent = navigator.userAgent;
    const screen = screen || { width: 1920, height: 1080 };

    return {
      type: this.detectDeviceType(),
      os: this.detectOS(userAgent),
      browser: this.detectBrowser(userAgent),
      screenResolution: `${screen.width}x${screen.height}`
    };
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof navigator === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      return 'mobile';
    }
    if (/tablet|ipad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private detectOS(userAgent: string): string {
    const osPatterns = {
      'Windows NT': 'Windows',
      'Mac OS X': 'macOS',
      'Linux': 'Linux',
      'Android': 'Android',
      'iOS': 'iOS'
    };

    for (const [pattern, os] of Object.entries(osPatterns)) {
      if (userAgent.includes(pattern)) return os;
    }

    return 'Unknown';
  }

  private detectBrowser(userAgent: string): string {
    const browserPatterns = {
      'Chrome': 'Chrome',
      'Firefox': 'Firefox',
      'Safari': 'Safari',
      'Edge': 'Edge',
      'Opera': 'Opera'
    };

    for (const [pattern, browser] of Object.entries(browserPatterns)) {
      if (userAgent.includes(pattern)) return browser;
    }

    return 'Unknown';
  }

  private getUserLocation(): UserBehaviorEvent['location'] | undefined {
    // Placeholder für Geolocation API
    return {
      country: 'Germany',
      city: 'München',
      region: 'Bayern'
    };
  }

  private getTrafficSource(): SessionData['trafficSource'] {
    if (typeof document === 'undefined') {
      return { source: 'direct', medium: 'none' };
    }

    const referrer = document.referrer;
    const utmParams = new URLSearchParams(window.location.search);

    const source = utmParams.get('utm_source') ||
                   (referrer ? new URL(referrer).hostname : 'direct');
    const medium = utmParams.get('utm_medium') ||
                   (referrer ? 'referral' : 'none');
    const campaign = utmParams.get('utm_campaign') || undefined;
    const term = utmParams.get('utm_term') || undefined;

    return { source, medium, campaign, term };
  }

  private isConversionEvent(eventType: string): boolean {
    const conversionEvents = ['form_submit', 'phone_call', 'download', 'quote_request'];
    return conversionEvents.includes(eventType);
  }

  private async trackPageView(event: UserBehaviorEvent): Promise<void> {
    // Page View Tracking Logic
    console.log(`📄 Page View tracked: ${event.url}`);
  }

  private async trackConversionEvent(event: UserBehaviorEvent): Promise<void> {
    // Conversion Event Tracking Logic
    console.log(`💰 Conversion event tracked: ${event.eventType}`);
  }

  private async trackFormInteraction(event: UserBehaviorEvent): Promise<void> {
    // Form Interaction Tracking Logic
    console.log(`📝 Form interaction tracked: ${event.eventType}`);
  }

  private async trackScrollDepth(event: UserBehaviorEvent): Promise<void> {
    // Scroll Depth Tracking Logic
    console.log(`📜 Scroll depth tracked: ${event.customData?.scrollDepth || 'unknown'}`);
  }

  private calculateEngagementScore(session: SessionData): number {
    let score = 0;

    // Page Views
    score += Math.min(session.pageViews * 10, 30);

    // Events
    score += Math.min(session.events.length * 5, 30);

    // Duration
    if (session.endTime) {
      const durationMinutes = (session.endTime - session.startTime) / (1000 * 60);
      score += Math.min(durationMinutes * 2, 20);
    }

    // Conversions
    score += Math.min(session.conversionEvents.length * 15, 20);

    return Math.min(score, 100);
  }

  private async updateEngagementMetrics(sessionId: string, score: number): Promise<void> {
    // Engagement Metrics Update Logic
    console.log(`📈 Engagement score updated for session ${sessionId}: ${score}`);
  }

  private evaluatePerformance(metrics: PerformanceMetric): any {
    const coreWebVitals = {
      lcp: this.evaluateLCP(metrics.metrics.lcp),
      fid: this.evaluateFID(metrics.metrics.fid),
      cls: this.evaluateCLS(metrics.metrics.cls),
      fcp: this.evaluateFCP(metrics.metrics.fcp),
      ttfb: this.evaluateTTFB(metrics.metrics.ttfb)
    };

    const overallScore = Object.values(coreWebVitals).reduce((sum, score) => sum + score, 0) / Object.keys(coreWebVitals).length;

    return {
      overallScore: Math.round(overallScore),
      coreWebVitals,
      grade: this.getPerformanceGrade(overallScore),
      resourceAnalysis: {
        totalSize: metrics.metrics.totalResourceSize,
        resourceCount: metrics.metrics.resourceCount,
        imageOptimization: this.analyzeImageOptimization(metrics),
        scriptOptimization: this.analyzeScriptOptimization(metrics),
        cssOptimization: this.analyzeCSOptimization(metrics)
      }
    };
  }

  private evaluateLCP(lcp: number): number {
    if (lcp <= 2500) return 100;
    if (lcp <= 4000) return 75;
    return 50;
  }

  private evaluateFID(fid: number): number {
    if (fid <= 100) return 100;
    if (fid <= 300) return 75;
    return 50;
  }

  private evaluateCLS(cls: number): number {
    if (cls <= 0.1) return 100;
    if (cls <= 0.25) return 75;
    return 50;
  }

  private evaluateFCP(fcp: number): number {
    if (fcp <= 1800) return 100;
    if (fcp <= 3000) return 75;
    return 50;
  }

  private evaluateTTFB(ttfb: number): number {
    if (ttfb <= 800) return 100;
    if (ttfb <= 1800) return 75;
    return 50;
  }

  private getPerformanceGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private analyzeImageOptimization(metrics: PerformanceMetric): any {
    const imageCount = metrics.metrics.totalResourceSize > 0 ?
      Math.round((metrics.metrics.imageSize / metrics.metrics.totalResourceSize) * 100) : 0;

    return {
      imagePercentage: imageCount,
      recommendation: imageCount > 60 ? 'Zu viele unoptimierte Bilder' : 'Bilder gut optimiert',
      potentialSavings: imageCount > 60 ? `${Math.round(metrics.metrics.imageSize * 0.3 / 1024)}KB` : 'Minimal'
    };
  }

  private analyzeScriptOptimization(metrics: PerformanceMetric): any {
    const scriptCount = metrics.metrics.totalResourceSize > 0 ?
      Math.round((metrics.metrics.scriptSize / metrics.metrics.totalResourceSize) * 100) : 0;

    return {
      scriptPercentage: scriptCount,
      recommendation: scriptCount > 40 ? 'Scripts sollten minifiziert und geladen werden' : 'Script-Optimierung gut',
      potentialSavings: scriptCount > 40 ? `${Math.round(metrics.metrics.scriptSize * 0.2 / 1024)}KB` : 'Minimal'
    };
  }

  private analyzeCSOptimization(metrics: PerformanceMetric): any {
    const cssCount = metrics.metrics.totalResourceSize > 0 ?
      Math.round((metrics.metrics.cssSize / metrics.metrics.totalResourceSize) * 100) : 0;

    return {
      cssPercentage: cssCount,
      recommendation: cssCount > 20 ? 'CSS sollte optimiert und gecached werden' : 'CSS-Optimierung gut',
      potentialSavings: cssCount > 20 ? `${Math.round(metrics.metrics.cssSize * 0.15 / 1024)}KB` : 'Minimal'
    };
  }

  private analyzePerformanceTrends(url: string): any {
    const metrics = this.performanceData.get(url) || [];
    if (metrics.length < 2) {
      return { trend: 'insufficient_data', direction: 'unknown' };
    }

    const recent = metrics.slice(-10);
    const older = metrics.slice(-20, -10);

    const recentAvg = this.calculateAverageScore(recent);
    const olderAvg = this.calculateAverageScore(older);

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    return {
      trend: Math.abs(change) < 5 ? 'stable' : change > 0 ? 'improving' : 'degrading',
      direction: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
      change: Math.round(change),
      recentAverage: Math.round(recentAvg),
      olderAverage: Math.round(olderAvg)
    };
  }

  private calculateAverageScore(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;

    const totalScore = metrics.reduce((sum, metric) => {
      const evaluation = this.evaluatePerformance(metric);
      return sum + evaluation.overallScore;
    }, 0);

    return totalScore / metrics.length;
  }

  private generatePerformanceRecommendations(metrics: PerformanceMetric): string[] {
    const recommendations: string[] = [];

    if (metrics.metrics.lcp > 2500) {
      recommendations.push('Largest Contentful Paint optimieren - Bilder und Fonts preloaden');
    }

    if (metrics.metrics.fid > 100) {
      recommendations.push('First Input Delay reduzieren - JavaScript optimieren und laden');
    }

    if (metrics.metrics.cls > 0.1) {
      recommendations.push('Cumulative Layout Shift minimieren - Bildgrößen und Platzhalter definieren');
    }

    if (metrics.metrics.ttfb > 800) {
      recommendations.push('Time to First Byte verbessern - Server-Response optimieren');
    }

    if (metrics.metrics.totalResourceSize > 3000000) { // 3MB
      recommendations.push('Gesamtgröße reduzieren - Bilder komprimieren und unnötige Ressourcen entfernen');
    }

    return recommendations;
  }

  private checkPerformanceAlerts(metrics: PerformanceMetric): any[] {
    const alerts: any[] = [];

    if (metrics.metrics.lcp > 4000) {
      alerts.push({
        type: 'critical',
        metric: 'LCP',
        value: metrics.metrics.lcp,
        threshold: 4000,
        message: 'Largest Contentful Paint ist kritisch langsam'
      });
    }

    if (metrics.metrics.cls > 0.25) {
      alerts.push({
        type: 'critical',
        metric: 'CLS',
        value: metrics.metrics.cls,
        threshold: 0.25,
        message: 'Cumulative Layout Shift ist zu hoch'
      });
    }

    if (metrics.metrics.fid > 300) {
      alerts.push({
        type: 'warning',
        metric: 'FID',
        value: metrics.metrics.fid,
        threshold: 300,
        message: 'First Input Delay sollte optimiert werden'
      });
    }

    return alerts;
  }

  private aggregateCoreWebVitals(url: string): any {
    const metrics = this.performanceData.get(url) || [];
    if (metrics.length === 0) return null;

    const lcpValues = metrics.map(m => m.metrics.lcp);
    const fidValues = metrics.map(m => m.metrics.fid);
    const clsValues = metrics.map(m => m.metrics.cls);
    const fcpValues = metrics.map(m => m.metrics.fcp);
    const ttfbValues = metrics.map(m => m.metrics.ttfb);

    return {
      lcp: {
        average: this.average(lcpValues),
        median: this.median(lcpValues),
        p75: this.percentile(lcpValues, 75),
        p95: this.percentile(lcpValues, 95)
      },
      fid: {
        average: this.average(fidValues),
        median: this.median(fidValues),
        p75: this.percentile(fidValues, 75),
        p95: this.percentile(fidValues, 95)
      },
      cls: {
        average: this.average(clsValues),
        median: this.median(clsValues),
        p75: this.percentile(clsValues, 75),
        p95: this.percentile(clsValues, 95)
      },
      fcp: {
        average: this.average(fcpValues),
        median: this.median(fcpValues),
        p75: this.percentile(fcpValues, 75),
        p95: this.percentile(fcpValues, 95)
      },
      ttfb: {
        average: this.average(ttfbValues),
        median: this.median(ttfbValues),
        p75: this.percentile(ttfbValues, 75),
        p95: this.percentile(ttfbValues, 95)
      }
    };
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  private analyzeKeywordPerformance(event: SEOEvent): any {
    if (!event.data.keyword) return null;

    return {
      keyword: event.data.keyword,
      position: event.data.position || 0,
      clickThroughRate: event.data.clickThroughRate || 0,
      impressions: event.data.impressions || 0,
      clicks: event.data.clicks || 0,
      performance: this.evaluateKeywordPerformance(event.data.position || 0, event.data.clickThroughRate || 0)
    };
  }

  private evaluateKeywordPerformance(position: number, ctr: number): string {
    if (position <= 3 && ctr >= 10) return 'excellent';
    if (position <= 10 && ctr >= 5) return 'good';
    if (position <= 20 && ctr >= 2) return 'average';
    return 'needs_improvement';
  }

  private analyzeRankings(event: SEOEvent): any {
    return {
      currentPosition: event.data.position || 0,
      searchEngine: event.data.searchEngine || 'google',
      device: event.data.device || 'desktop',
      location: event.data.location || 'Germany',
      competition: this.assessKeywordCompetition(event.data.keyword || ''),
      opportunity: this.assessRankingOpportunity(event.data.position || 0)
    };
  }

  private assessKeywordCompetition(keyword: string): 'low' | 'medium' | 'high' {
    // Simulierte Competition Assessment
    const highCompetitionKeywords = ['solaranlagen', 'photovoltaik', 'strom'];
    const keywordLower = keyword.toLowerCase();

    if (highCompetitionKeywords.some(hk => keywordLower.includes(hk))) {
      return 'high';
    }

    return 'medium';
  }

  private assessRankingOpportunity(position: number): string {
    if (position <= 3) return 'maintain';
    if (position <= 10) return 'improve_to_top_3';
    if (position <= 20) return 'improve_to_top_10';
    return 'significant_improvement_needed';
  }

  private trackSERPFeatures(event: SEOEvent): any {
    const features = [];

    if (event.eventType === 'featured_snippet') {
      features.push('featured_snippet');
    }

    if (event.eventType === 'local_pack_appearance') {
      features.push('local_pack');
    }

    return {
      features,
      visibility: this.calculateSERPVisibility(features),
      impact: this.assessSERPImpact(features)
    };
  }

  private calculateSERPVisibility(features: string[]): number {
    const featureWeights = {
      'featured_snippet': 40,
      'local_pack': 30,
      'image_pack': 20,
      'video_pack': 15,
      'news_box': 25
    };

    return features.reduce((total, feature) => {
      return total + (featureWeights[feature as keyof typeof featureWeights] || 10);
    }, 0);
  }

  private assessSERPImpact(features: string[]): 'high' | 'medium' | 'low' {
    const visibility = this.calculateSERPVisibility(features);
    if (visibility >= 50) return 'high';
    if (visibility >= 25) return 'medium';
    return 'low';
  }

  private analyzeLocalSEO(event: SEOEvent): any {
    return {
      location: event.data.location,
      localRankings: this.getLocalRankings(event),
      localCompetition: this.assessLocalCompetition(event.data.location || ''),
      localSearchVolume: this.estimateLocalSearchVolume(event.data.keyword || '', event.data.location || ''),
      localOpportunities: this.identifyLocalOpportunities(event)
    };
  }

  private getLocalRankings(event: SEOEvent): any {
    return {
      position: event.data.position || 0,
      localPackPosition: event.data.position ? Math.min(event.data.position + 2, 20) : 0,
      mapsPosition: event.data.position ? Math.min(event.data.position + 1, 15) : 0
    };
  }

  private assessLocalCompetition(location: string): 'low' | 'medium' | 'high' {
    const highCompetitionCities = ['München', 'Berlin', 'Hamburg', 'Frankfurt', 'Köln'];
    return highCompetitionCities.includes(location) ? 'high' : 'medium';
  }

  private estimateLocalSearchVolume(keyword: string, location: string): number {
    // Simulierte lokale Suchvolumen-Schätzung
    const baseVolume = location.includes('München') ? 500 :
                      location.includes('Berlin') ? 450 :
                      location.includes('Hamburg') ? 400 : 300;

    const keywordMultiplier = keyword.includes('photovoltaik') ? 1.5 :
                             keyword.includes('solar') ? 1.2 : 1.0;

    return Math.round(baseVolume * keywordMultiplier);
  }

  private identifyLocalOpportunities(event: SEOEvent): string[] {
    const opportunities = [];

    if ((event.data.position || 0) > 10) {
      opportunities.push('Improve local rankings');
    }

    if (!event.data.location || event.data.location === 'Germany') {
      opportunities.push('Target specific locations');
    }

    if (event.eventType === 'impression' && !event.data.clicks) {
      opportunities.push('Optimize meta titles and descriptions');
    }

    return opportunities;
  }

  private identifySEOOpportunities(event: SEOEvent): string[] {
    const opportunities = [];

    if (event.eventType === 'impression' && (!event.data.clicks || event.data.clicks === 0)) {
      opportunities.push('Improve snippet attractiveness');
    }

    if ((event.data.position || 0) > 10) {
      opportunities.push('Content quality and relevance improvement');
    }

    if (event.data.clickThroughRate && event.data.clickThroughRate < 2) {
      opportunities.push('Meta description optimization');
    }

    if (event.eventType === 'ranking_change' && (event.data.position || 0) > 3) {
      opportunities.push('Target featured snippet optimization');
    }

    return opportunities;
  }

  private analyzeConversionFunnel(conversion: ConversionEvent): any {
    const funnelStages = {
      awareness: { visits: 0, conversions: 0 },
      consideration: { visits: 0, conversions: 0 },
      decision: { visits: 0, conversions: 0 },
      purchase: { visits: 0, conversions: 0 }
    };

    // Simulierte Funnel-Analyse
    funnelStages[conversion.funnelStage].conversions++;

    return {
      currentStage: conversion.funnelStage,
      funnelStages,
      conversionRateByStage: this.calculateConversionRateByStage(funnelStages),
      dropOffPoints: this.identifyDropOffPoints(funnelStages),
      optimizationOpportunities: this.identifyFunnelOptimizations(funnelStages, conversion.funnelStage)
    };
  }

  private calculateConversionRateByStage(funnelStages: any): any {
    const rates: any = {};

    Object.entries(funnelStages).forEach(([stage, data]: [string, any]) => {
      rates[stage] = data.visits > 0 ? (data.conversions / data.visits) * 100 : 0;
    });

    return rates;
  }

  private identifyDropOffPoints(funnelStages: any): string[] {
    const dropOffs = [];

    Object.entries(funnelStages).forEach(([stage, data]: [string, any]) => {
      if (data.visits > 0 && data.conversions === 0) {
        dropOffs.push(`${stage} - No conversions detected`);
      }
    });

    return dropOffs;
  }

  private identifyFunnelOptimizations(funnelStages: any, currentStage: string): string[] {
    const optimizations = [];

    if (currentStage === 'awareness') {
      optimizations.push('Improve landing page content');
      optimizations.push('Add more compelling value proposition');
    }

    if (currentStage === 'consideration') {
      optimizations.push('Add customer testimonials');
      optimizations.push('Provide detailed product information');
    }

    if (currentStage === 'decision') {
      optimizations.push('Simplify conversion process');
      optimizations.push('Add trust signals and guarantees');
    }

    return optimizations;
  }

  private performAttribution(conversion: ConversionEvent): any {
    return {
      source: conversion.source,
      medium: conversion.medium,
      campaign: conversion.campaign,
      content: conversion.content,
      attributionModel: 'last_click',
      touchpoints: this.simulateTouchpoints(conversion),
      pathAnalysis: this.analyzeConversionPath(conversion)
    };
  }

  private simulateTouchpoints(conversion: ConversionEvent): any[] {
    // Simulierte Touchpoints für Attribution
    return [
      {
        channel: 'organic_search',
        timestamp: conversion.timestamp - 86400000, // 1 Tag vorher
        interaction: 'first_visit'
      },
      {
        channel: conversion.medium,
        timestamp: conversion.timestamp - 3600000, // 1 Stunde vorher
        interaction: 'conversion_trigger'
      }
    ];
  }

  private analyzeConversionPath(conversion: ConversionEvent): any {
    return {
      pathLength: 2, // Simuliert
      timeToConvert: this.calculateTimeToConvert(conversion),
      mostEffectiveChannel: conversion.medium,
      assistedConversions: 1
    };
  }

  private calculateTimeToConvert(conversion: ConversionEvent): string {
    const session = this.sessionData.get(conversion.sessionId);
    if (!session || !session.startTime) return 'unknown';

    const timeToConvert = conversion.timestamp - session.startTime;
    const hours = Math.floor(timeToConvert / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return `${Math.floor(timeToConvert / (1000 * 60))} minutes`;
  }

  private calculateConversionRates(): any {
    const totalSessions = this.sessionData.size;
    const conversionSessions = Array.from(this.sessionData.values())
      .filter(session => session.conversionEvents.length > 0).length;

    const overallRate = totalSessions > 0 ? (conversionSessions / totalSessions) * 100 : 0;

    return {
      overall: Math.round(overallRate * 100) / 100,
      byConversionType: this.calculateConversionRatesByType(),
      bySource: this.calculateConversionRatesBySource(),
      byDevice: this.calculateConversionRatesByDevice()
    };
  }

  private calculateConversionRatesByType(): any {
    const typeCounts: Record<string, { sessions: number; conversions: number }> = {};

    Array.from(this.sessionData.values()).forEach(session => {
      session.conversionEvents.forEach(conversion => {
        if (!typeCounts[conversion.conversionType]) {
          typeCounts[conversion.conversionType] = { sessions: 0, conversions: 0 };
        }
        typeCounts[conversion.conversionType].sessions++;
        typeCounts[conversion.conversionType].conversions++;
      });
    });

    const rates: any = {};
    Object.entries(typeCounts).forEach(([type, data]) => {
      rates[type] = (data.conversions / data.sessions) * 100;
    });

    return rates;
  }

  private calculateConversionRatesBySource(): any {
    const sourceCounts: Record<string, { sessions: number; conversions: number }> = {};

    Array.from(this.sessionData.values()).forEach(session => {
      const source = session.trafficSource.source;
      if (!sourceCounts[source]) {
        sourceCounts[source] = { sessions: 0, conversions: 0 };
      }
      sourceCounts[source].sessions++;
      if (session.conversionEvents.length > 0) {
        sourceCounts[source].conversions++;
      }
    });

    const rates: any = {};
    Object.entries(sourceCounts).forEach(([source, data]) => {
      rates[source] = (data.conversions / data.sessions) * 100;
    });

    return rates;
  }

  private calculateConversionRatesByDevice(): any {
    const deviceCounts: Record<string, { sessions: number; conversions: number }> = {};

    Array.from(this.sessionData.values()).forEach(session => {
      const device = session.device.type;
      if (!deviceCounts[device]) {
        deviceCounts[device] = { sessions: 0, conversions: 0 };
      }
      deviceCounts[device].sessions++;
      if (session.conversionEvents.length > 0) {
        deviceCounts[device].conversions++;
      }
    });

    const rates: any = {};
    Object.entries(deviceCounts).forEach(([device, data]) => {
      rates[device] = (data.conversions / data.sessions) * 100;
    });

    return rates;
  }

  private analyzeRevenue(conversion: ConversionEvent): any {
    const value = conversion.value || 0;
    const currency = conversion.currency || 'EUR';

    return {
      revenue: value,
      currency,
      averageOrderValue: value,
      revenueByConversionType: this.getRevenueByConversionType(conversion.conversionType, value),
      revenueTrend: this.getRevenueTrend(conversion.conversionType)
    };
  }

  private getRevenueByConversionType(conversionType: string, value: number): any {
    const typeRevenue = this.conversionData.get('revenue_by_type') || [];
    const existingRevenue = typeRevenue.find(r => r.type === conversionType);

    if (existingRevenue) {
      existingRevenue.total += value;
      existingRevenue.count += 1;
    } else {
      typeRevenue.push({ type: conversionType, total: value, count: 1 });
    }

    return {
      total: existingRevenue?.total || value,
      count: existingRevenue?.count || 1,
      average: (existingRevenue?.total || value) / (existingRevenue?.count || 1)
    };
  }

  private getRevenueTrend(conversionType: string): 'increasing' | 'stable' | 'decreasing' {
    // Simulierter Trend
    return Math.random() > 0.5 ? 'increasing' : 'stable';
  }

  private calculateROI(conversion: ConversionEvent): any {
    const value = conversion.value || 0;
    const estimatedCost = this.estimateConversionCost(conversion);
    const roi = estimatedCost > 0 ? ((value - estimatedCost) / estimatedCost) * 100 : 0;

    return {
      revenue: value,
      cost: estimatedCost,
      profit: value - estimatedCost,
      roi: Math.round(roi * 100) / 100,
      paybackPeriod: this.estimatePaybackPeriod(conversion),
      roiByChannel: this.getROIByChannel(conversion)
    };
  }

  private estimateConversionCost(conversion: ConversionEvent): number {
    const costPerChannel: Record<string, number> = {
      'organic_search': 50,
      'direct': 20,
      'referral': 30,
      'social': 40,
      'paid_search': 100,
      'email': 25
    };

    return costPerChannel[conversion.medium] || 50;
  }

  private estimatePaybackPeriod(conversion: ConversionEvent): string {
    const value = conversion.value || 0;
    const cost = this.estimateConversionCost(conversion);

    if (value <= cost) return 'more_than_12_months';

    const monthlyValue = value / 12; // Annahme: Jährlicher Wert
    const paybackMonths = Math.ceil(cost / monthlyValue);

    if (paybackMonths <= 3) return 'within_3_months';
    if (paybackMonths <= 6) return 'within_6_months';
    if (paybackMonths <= 12) return 'within_12_months';

    return 'more_than_12_months';
  }

  private getROIByChannel(conversion: ConversionEvent): any {
    return {
      [conversion.medium]: this.calculateROIForChannel(conversion.medium, conversion.value || 0)
    };
  }

  private calculateROIForChannel(channel: string, revenue: number): number {
    const cost = this.estimateConversionCost({ ...{} as ConversionEvent, medium: channel });
    return cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
  }

  private analyzeBusinessPerformance(metric: BusinessMetric): any {
    const historicalData = this.getHistoricalMetrics(metric.metricType, metric.period);
    const trend = this.calculateTrend(historicalData, metric.value);
    const benchmark = this.getIndustryBenchmark(metric.metricType);
    const performance = this.assessPerformanceAgainstBenchmark(metric.value, benchmark);

    return {
      currentValue: metric.value,
      historicalAverage: this.calculateHistoricalAverage(historicalData),
      trend,
      benchmark,
      performance,
      change: this.calculatePercentageChange(historicalData, metric.value)
    };
  }

  private getHistoricalMetrics(metricType: string, period: string): BusinessMetric[] {
    const key = `${metricType}-${period}`;
    return this.businessMetrics.get(key) || [];
  }

  private calculateTrend(historicalData: BusinessMetric[], currentValue: number): 'increasing' | 'stable' | 'decreasing' {
    if (historicalData.length < 2) return 'stable';

    const recentValues = historicalData.slice(-5).map(d => d.value);
    recentValues.push(currentValue);

    const firstHalf = recentValues.slice(0, Math.floor(recentValues.length / 2));
    const secondHalf = recentValues.slice(Math.floor(recentValues.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const change = (secondAvg - firstAvg) / firstAvg;

    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }

  private getIndustryBenchmark(metricType: string): number {
    const benchmarks: Record<string, number> = {
      'revenue': 1000000, // 1M EUR annual revenue
      'cost': 600000, // 600K EUR annual costs
      'profit': 200000, // 200K EUR annual profit
      'leads': 500, // 500 leads per month
      'conversions': 50, // 50 conversions per month
      'customer_acquisition_cost': 200, // 200 EUR per customer
      'lifetime_value': 5000 // 5000 EUR lifetime value
    };

    return benchmarks[metricType] || 0;
  }

  private assessPerformanceAgainstBenchmark(currentValue: number, benchmark: number): 'excellent' | 'good' | 'average' | 'below_average' {
    const ratio = currentValue / benchmark;

    if (ratio >= 1.2) return 'excellent';
    if (ratio >= 1.0) return 'good';
    if (ratio >= 0.8) return 'average';
    return 'below_average';
  }

  private calculatePercentageChange(historicalData: BusinessMetric[], currentValue: number): number {
    if (historicalData.length === 0) return 0;

    const previousValue = historicalData[historicalData.length - 1].value;
    return previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
  }

  private calculateHistoricalAverage(historicalData: BusinessMetric[]): number {
    if (historicalData.length === 0) return 0;
    return historicalData.reduce((sum, d) => sum + d.value, 0) / historicalData.length;
  }

  private calculateBusinessTrends(metric: BusinessMetric): any {
    const historicalData = this.getHistoricalMetrics(metric.metricType, metric.period);
    if (historicalData.length < 3) return { trend: 'insufficient_data' };

    const values = historicalData.map(d => d.value);
    values.push(metric.value);

    const growthRate = this.calculateGrowthRate(values);
    const seasonality = this.detectSeasonality(values);
    const forecast = this.generateSimpleForecast(values);

    return {
      trend: growthRate > 0.05 ? 'growing' : growthRate < -0.05 ? 'declining' : 'stable',
      growthRate: Math.round(growthRate * 10000) / 100,
      seasonality,
      forecast,
      confidence: this.calculateForecastConfidence(values.length)
    };
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const periods = values.length - 1;

    return periods > 0 ? Math.pow(lastValue / firstValue, 1 / periods) - 1 : 0;
  }

  private detectSeasonality(values: number[]): 'high' | 'medium' | 'low' | 'none' {
    if (values.length < 12) return 'insufficient_data';

    // Simple seasonality detection
    const monthly = values.slice(-12);
    const stdDev = this.calculateStandardDeviation(monthly);
    const mean = monthly.reduce((sum, val) => sum + val, 0) / monthly.length;
    const coefficientOfVariation = stdDev / mean;

    if (coefficientOfVariation > 0.3) return 'high';
    if (coefficientOfVariation > 0.15) return 'medium';
    if (coefficientOfVariation > 0.05) return 'low';
    return 'none';
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private generateSimpleForecast(values: number[]): number {
    if (values.length < 3) return values[values.length - 1];

    // Simple linear regression for next period
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * n + intercept;
  }

  private calculateForecastConfidence(dataPoints: number): 'high' | 'medium' | 'low' {
    if (dataPoints >= 12) return 'high';
    if (dataPoints >= 6) return 'medium';
    return 'low';
  }

  private generateBusinessForecasts(metric: BusinessMetric): any {
    const historicalData = this.getHistoricalMetrics(metric.metricType, metric.period);
    const forecasts = [];

    // 3-month forecast
    for (let i = 1; i <= 3; i++) {
      const forecast = this.generateSimpleForecast([...historicalData.map(d => d.value), ...Array(i).fill(0)]);
      forecasts.push({
        period: `+${i} months`,
        forecast: Math.round(forecast),
        confidence: this.calculateForecastConfidence(historicalData.length)
      });
    }

    return {
      forecasts,
      methodology: 'linear_regression',
      accuracy: this.calculateForecastAccuracy(historicalData)
    };
  }

  private calculateForecastAccuracy(historicalData: BusinessMetric[]): number {
    if (historicalData.length < 4) return 0;

    // Simple backtesting
    const trainingData = historicalData.slice(0, -2);
    const actualValues = historicalData.slice(-2).map(d => d.value);

    let totalError = 0;
    for (let i = 0; i < actualValues.length; i++) {
      const forecast = this.generateSimpleForecast([...trainingData.map(d => d.value), ...Array(i + 1).fill(0)]);
      totalError += Math.abs(forecast - actualValues[i]);
    }

    const averageError = totalError / actualValues.length;
    const averageActual = actualValues.reduce((sum, val) => sum + val, 0) / actualValues.length;

    return Math.max(0, (1 - averageError / averageActual) * 100);
  }

  private calculateKPIs(metric: BusinessMetric): any {
    const kpis: any = {};

    switch (metric.metricType) {
      case 'revenue':
        kpis.revenuePerEmployee = this.calculateRevenuePerEmployee(metric.value);
        kpis.revenueGrowthRate = this.calculateRevenueGrowthRate(metric.value);
        break;

      case 'leads':
        kpis.leadToConversionRate = this.calculateLeadConversionRate(metric.value);
        kpis.costPerLead = this.calculateCostPerLead(metric.value);
        break;

      case 'conversions':
        kpis.conversionRate = this.calculateConversionRate(metric.value);
        kpis.averageOrderValue = this.calculateAverageOrderValue(metric.value);
        break;

      case 'customer_acquisition_cost':
        kpis.cacRatio = this.calculateCACRatio(metric.value);
        kpis.cacPaybackPeriod = this.calculateCACPaybackPeriod(metric.value);
        break;

      case 'lifetime_value':
        kpis.ltvToCACRatio = this.calculateLTVToCACRatio(metric.value);
        kpis.customerRetentionRate = this.calculateCustomerRetentionRate(metric.value);
        break;
    }

    return kpis;
  }

  private calculateRevenuePerEmployee(revenue: number): number {
    const employees = 50; // Placeholder
    return Math.round(revenue / employees);
  }

  private calculateRevenueGrowthRate(revenue: number): number {
    const previousRevenue = revenue * 0.9; // Placeholder
    return Math.round(((revenue - previousRevenue) / previousRevenue) * 10000) / 100;
  }

  private calculateLeadConversionRate(leads: number): number {
    const conversions = leads * 0.1; // Placeholder 10% conversion rate
    return Math.round((conversions / leads) * 10000) / 100;
  }

  private calculateCostPerLead(leads: number): number {
    const marketingSpend = 10000; // Placeholder
    return Math.round(marketingSpend / leads);
  }

  private calculateConversionRate(conversions: number): number {
    const visitors = conversions * 100; // Placeholder 1% conversion rate
    return Math.round((conversions / visitors) * 10000) / 100;
  }

  private calculateAverageOrderValue(conversions: number): number {
    const revenue = conversions * 5000; // Placeholder 5000 EUR average
    return Math.round(revenue / conversions);
  }

  private calculateCACRatio(cac: number): number {
    const ltv = cac * 3; // Placeholder LTV is 3x CAC
    return Math.round((ltv / cac) * 100) / 100;
  }

  private calculateCACPaybackPeriod(cac: number): string {
    const monthlyRevenue = cac * 0.3; // Placeholder 30% monthly revenue
    const months = Math.ceil(cac / monthlyRevenue);

    if (months <= 3) return 'less_than_3_months';
    if (months <= 6) return '3_to_6_months';
    if (months <= 12) return '6_to_12_months';
    return 'more_than_12_months';
  }

  private calculateLTVToCACRatio(ltv: number): number {
    const cac = ltv / 3; // Placeholder CAC is 1/3 of LTV
    return Math.round((ltv / cac) * 100) / 100;
  }

  private calculateCustomerRetentionRate(ltv: number): number {
    // Placeholder calculation based on LTV
    if (ltv > 10000) return 85;
    if (ltv > 5000) return 75;
    if (ltv > 2000) return 65;
    return 55;
  }

  private generateBenchmarks(metric: BusinessMetric): any {
    const industry = 'solar_energy'; // Placeholder
    const benchmarks = this.getIndustryBenchmarks(industry);

    return {
      industry,
      industryAverage: benchmarks[metric.metricType] || 0,
      industryTop10: benchmarks[metric.metricType] * 1.5 || 0,
      industryMedian: benchmarks[metric.metricType] * 0.8 || 0,
      percentile: this.calculatePercentile(metric.value, benchmarks[metric.metricType] || 0)
    };
  }

  private getIndustryBenchmarks(industry: string): Record<string, number> {
    const benchmarks: Record<string, Record<string, number>> = {
      'solar_energy': {
        'revenue': 2000000,
        'cost': 1200000,
        'profit': 400000,
        'leads': 800,
        'conversions': 80,
        'customer_acquisition_cost': 250,
        'lifetime_value': 7500
      }
    };

    return benchmarks[industry] || {};
  }

  private calculatePercentile(value: number, benchmark: number): number {
    const ratio = value / benchmark;
    if (ratio >= 2.0) return 90;
    if (ratio >= 1.5) return 75;
    if (ratio >= 1.0) return 50;
    if (ratio >= 0.5) return 25;
    return 10;
  }

  private generateUserBehaviorReport(startDate: Date, endDate: Date): any {
    const sessions = Array.from(this.sessionData.values()).filter(
      session => session.startTime >= startDate.getTime() && session.startTime <= endDate.getTime()
    );

    return {
      totalSessions: sessions.length,
      uniqueUsers: new Set(sessions.filter(s => s.userId).map(s => s.userId)).size,
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
      bounceRate: this.calculateBounceRate(sessions),
      topPages: this.getTopPagesFromSessions(sessions),
      deviceBreakdown: this.getDeviceBreakdown(sessions),
      trafficSources: this.getTrafficSourcesFromSessions(sessions),
      userEngagement: this.calculateUserEngagement(sessions)
    };
  }

  private calculateAverageSessionDuration(sessions: SessionData[]): number {
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;

    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.endTime! - session.startTime);
    }, 0);

    return Math.round(totalDuration / completedSessions.length / 1000); // in seconds
  }

  private calculateBounceRate(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    const bouncedSessions = sessions.filter(session => session.bounced).length;
    return Math.round((bouncedSessions / sessions.length) * 10000) / 100;
  }

  private getTopPagesFromSessions(sessions: SessionData[]): any[] {
    const pageViews: Record<string, number> = {};

    sessions.forEach(session => {
      session.events.forEach(event => {
        if (event.eventType === 'pageview') {
          pageViews[event.url] = (pageViews[event.url] || 0) + 1;
        }
      });
    });

    return Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, views]) => ({ url, views }));
  }

  private getDeviceBreakdown(sessions: SessionData[]): any {
    const breakdown: Record<string, number> = {};

    sessions.forEach(session => {
      const device = session.device.type;
      breakdown[device] = (breakdown[device] || 0) + 1;
    });

    const total = sessions.length;
    return Object.entries(breakdown).map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / total) * 10000) / 100
    }));
  }

  private getTrafficSourcesFromSessions(sessions: SessionData[]): any[] {
    const sources: Record<string, number> = {};

    sessions.forEach(session => {
      const source = session.trafficSource.source;
      sources[source] = (sources[source] || 0) + 1;
    });

    return Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .map(([source, count]) => ({ source, count }));
  }

  private calculateUserEngagement(sessions: SessionData[]): any {
    const engagementScores = sessions.map(session => this.calculateEngagementScore(session));

    return {
      average: this.average(engagementScores),
      median: this.median(engagementScores),
      distribution: this.getEngagementDistribution(engagementScores),
      topEngagedSessions: sessions
        .sort((a, b) => this.calculateEngagementScore(b) - this.calculateEngagementScore(a))
        .slice(0, 5)
        .map(session => ({
          sessionId: session.sessionId,
          score: this.calculateEngagementScore(session),
          duration: session.endTime ? (session.endTime - session.startTime) / 1000 : 0,
          pageViews: session.pageViews
        }))
    };
  }

  private getEngagementDistribution(scores: number[]): any {
    const distribution = {
      low: scores.filter(s => s < 30).length,
      medium: scores.filter(s => s >= 30 && s < 70).length,
      high: scores.filter(s => s >= 70).length
    };

    const total = scores.length;
    return {
      low: { count: distribution.low, percentage: Math.round((distribution.low / total) * 100) },
      medium: { count: distribution.medium, percentage: Math.round((distribution.medium / total) * 100) },
      high: { count: distribution.high, percentage: Math.round((distribution.high / total) * 100) }
    };
  }

  private generatePerformanceReport(startDate: Date, endDate: Date): any {
    const allPerformanceData: PerformanceMetric[] = [];

    this.performanceData.forEach((metrics) => {
      const filteredMetrics = metrics.filter(
        metric => metric.timestamp >= startDate.getTime() && metric.timestamp <= endDate.getTime()
      );
      allPerformanceData.push(...filteredMetrics);
    });

    return {
      totalAudits: allPerformanceData.length,
      overallScore: this.calculateOverallPerformanceScore(allPerformanceData),
      coreWebVitalsSummary: this.getCoreWebVitalsSummary(allPerformanceData),
      performanceByDevice: this.getPerformanceByDevice(allPerformanceData),
      performanceByPage: this.getPerformanceByPage(allPerformanceData),
      topIssues: this.getTopPerformanceIssues(allPerformanceData),
      improvements: this.getPerformanceImprovements(allPerformanceData)
    };
  }

  private calculateOverallPerformanceScore(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;

    const scores = metrics.map(metric => {
      const evaluation = this.evaluatePerformance(metric);
      return evaluation.overallScore;
    });

    return Math.round(this.average(scores));
  }

  private getCoreWebVitalsSummary(metrics: PerformanceMetric[]): any {
    const allLcp = metrics.map(m => m.metrics.lcp);
    const allFid = metrics.map(m => m.metrics.fid);
    const allCls = metrics.map(m => m.metrics.cls);

    return {
      lcp: {
        average: this.average(allLcp),
        median: this.median(allLcp),
        p75: this.percentile(allLcp, 75),
        good: allLcp.filter(v => v <= 2500).length,
        needsImprovement: allLcp.filter(v => v > 2500 && v <= 4000).length,
        poor: allLcp.filter(v => v > 4000).length
      },
      fid: {
        average: this.average(allFid),
        median: this.median(allFid),
        p75: this.percentile(allFid, 75),
        good: allFid.filter(v => v <= 100).length,
        needsImprovement: allFid.filter(v => v > 100 && v <= 300).length,
        poor: allFid.filter(v => v > 300).length
      },
      cls: {
        average: this.average(allCls),
        median: this.median(allCls),
        p75: this.percentile(allCls, 75),
        good: allCls.filter(v => v <= 0.1).length,
        needsImprovement: allCls.filter(v => v > 0.1 && v <= 0.25).length,
        poor: allCls.filter(v => v > 0.25).length
      }
    };
  }

  private getPerformanceByDevice(metrics: PerformanceMetric[]): any {
    const deviceGroups: Record<string, PerformanceMetric[]> = {};

    metrics.forEach(metric => {
      if (!deviceGroups[metric.deviceType]) {
        deviceGroups[metric.deviceType] = [];
      }
      deviceGroups[metric.deviceType].push(metric);
    });

    return Object.entries(deviceGroups).map(([device, deviceMetrics]) => ({
      device,
      count: deviceMetrics.length,
      averageScore: this.calculateOverallPerformanceScore(deviceMetrics),
      coreWebVitals: this.getCoreWebVitalsSummary(deviceMetrics)
    }));
  }

  private getPerformanceByPage(metrics: PerformanceMetric[]): any[] {
    const pageGroups: Record<string, PerformanceMetric[]> = {};

    metrics.forEach(metric => {
      if (!pageGroups[metric.url]) {
        pageGroups[metric.url] = [];
      }
      pageGroups[metric.url].push(metric);
    });

    return Object.entries(pageGroups)
      .map(([url, pageMetrics]) => ({
        url,
        count: pageMetrics.length,
        averageScore: this.calculateOverallPerformanceScore(pageMetrics),
        lastAudit: Math.max(...pageMetrics.map(m => m.timestamp))
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);
  }

  private getTopPerformanceIssues(metrics: PerformanceMetric[]): any[] {
    const issues: any[] = [];

    metrics.forEach(metric => {
      const alerts = this.checkPerformanceAlerts(metric);
      alerts.forEach(alert => {
        issues.push({
          type: alert.type,
          metric: alert.metric,
          url: metric.url,
          device: metric.deviceType,
          value: alert.value,
          threshold: alert.threshold,
          message: alert.message
        });
      });
    });

    return issues
      .sort((a, b) => {
        const severityOrder = { critical: 3, warning: 2, info: 1 };
        return severityOrder[b.type] - severityOrder[a.type];
      })
      .slice(0, 10);
  }

  private getPerformanceImprovements(metrics: PerformanceMetric[]): any {
    const improvements: any[] = [];

    metrics.forEach(metric => {
      const recommendations = this.generatePerformanceRecommendations(metric);
      recommendations.forEach(rec => {
        if (!improvements.find(imp => imp.recommendation === rec)) {
          improvements.push({
            recommendation: rec,
            affectedPages: 1,
            estimatedImpact: this.estimateRecommendationImpact(rec)
          });
        } else {
          const existing = improvements.find(imp => imp.recommendation === rec);
          existing.affectedPages++;
        }
      });
    });

    return improvements
      .sort((a, b) => b.estimatedImpact - a.estimatedImpact)
      .slice(0, 5);
  }

  private estimateRecommendationImpact(recommendation: string): number {
    const impactMap: Record<string, number> = {
      'Largest Contentful Paint optimieren - Bilder und Fonts preloaden': 25,
      'First Input Delay reduzieren - JavaScript optimieren und laden': 20,
      'Cumulative Layout Shift minimieren - Bildgrößen und Platzhalter definieren': 15,
      'Time to First Byte verbessern - Server-Response optimieren': 20,
      'Gesamtgröße reduzieren - Bilder komprimieren und unnötige Ressourcen entfernen': 30
    };

    return impactMap[recommendation] || 10;
  }

  private generateSEOReport(startDate: Date, endDate: Date): any {
    const allSEOData: SEOEvent[] = [];

    this.seoData.forEach((events, date) => {
      const dateObj = new Date(date);
      if (dateObj >= startDate && dateObj <= endDate) {
        allSEOData.push(...events);
      }
    });

    return {
      totalEvents: allSEOData.length,
      keywordPerformance: this.analyzeOverallKeywordPerformance(allSEOData),
      rankingSummary: this.getRankingSummary(allSEOData),
      serpFeaturePerformance: this.getSERPFeaturePerformance(allSEOData),
      localSEOPerformance: this.getLocalSEOPerformanceOverall(allSEOData),
      topKeywords: this.getTopKeywords(allSEOData),
      seoOpportunities: this.getTopSEOOpportunities(allSEOData)
    };
  }

  private analyzeOverallKeywordPerformance(events: SEOEvent[]): any {
    const keywordData: Record<string, any> = {};

    events.forEach(event => {
      if (event.data.keyword) {
        if (!keywordData[event.data.keyword]) {
          keywordData[event.data.keyword] = {
            positions: [],
            impressions: [],
            clicks: [],
            ctr: []
          };
        }

        const data = keywordData[event.data.keyword];
        if (event.data.position) data.positions.push(event.data.position);
        if (event.data.impressions) data.impressions.push(event.data.impressions);
        if (event.data.clicks) data.clicks.push(event.data.clicks);
        if (event.data.clickThroughRate) data.ctr.push(event.data.clickThroughRate);
      }
    });

    return Object.entries(keywordData).map(([keyword, data]) => ({
      keyword,
      averagePosition: this.average(data.positions),
      totalImpressions: data.impressions.reduce((sum, val) => sum + val, 0),
      totalClicks: data.clicks.reduce((sum, val) => sum + val, 0),
      averageCTR: this.average(data.ctr),
      performance: this.evaluateKeywordPerformance(this.average(data.positions), this.average(data.ctr))
    }));
  }

  private getRankingSummary(events: SEOEvent[]): any {
    const positions = events
      .filter(e => e.data.position)
      .map(e => e.data.position!);

    return {
      totalKeywords: new Set(events.filter(e => e.data.keyword).map(e => e.data.keyword)).size,
      averagePosition: this.average(positions),
      top3Rankings: positions.filter(p => p <= 3).length,
      top10Rankings: positions.filter(p => p <= 10).length,
      top20Rankings: positions.filter(p => p <= 20).length,
      rankingDistribution: this.getRankingDistribution(positions)
    };
  }

  private getRankingDistribution(positions: number[]): any {
    return {
      top3: positions.filter(p => p <= 3).length,
      top4to10: positions.filter(p => p >= 4 && p <= 10).length,
      top11to20: positions.filter(p => p >= 11 && p <= 20).length,
      beyond20: positions.filter(p => p > 20).length
    };
  }

  private getSERPFeaturePerformance(events: SEOEvent[]): any {
    const features: Record<string, number> = {};

    events.forEach(event => {
      if (event.eventType === 'featured_snippet') {
        features.featured_snippet = (features.featured_snippet || 0) + 1;
      }
      if (event.eventType === 'local_pack_appearance') {
        features.local_pack = (features.local_pack || 0) + 1;
      }
    });

    return features;
  }

  private getLocalSEOPerformanceOverall(events: SEOEvent[]): any {
    const localEvents = events.filter(e => e.data.location);

    return {
      totalLocalEvents: localEvents.length,
      locations: new Set(localEvents.map(e => e.data.location)).size,
      averageLocalRanking: this.average(
        localEvents.filter(e => e.data.position).map(e => e.data.position!)
      ),
      topLocalLocations: this.getTopLocalLocations(localEvents)
    };
  }

  private getTopLocalLocations(events: SEOEvent[]): any[] {
    const locationData: Record<string, any> = {};

    events.forEach(event => {
      if (event.data.location) {
        if (!locationData[event.data.location]) {
          locationData[event.data.location] = {
            positions: [],
            events: 0
          };
        }
        locationData[event.data.location].events++;
        if (event.data.position) {
          locationData[event.data.location].positions.push(event.data.position);
        }
      }
    });

    return Object.entries(locationData)
      .map(([location, data]) => ({
        location,
        events: data.events,
        averagePosition: data.positions.length > 0 ? this.average(data.positions) : 0
      }))
      .sort((a, b) => a.events - b.events)
      .slice(0, 10);
  }

  private getTopKeywords(events: SEOEvent[]): any[] {
    const keywordData = this.analyzeOverallKeywordPerformance(events);
    return keywordData
      .sort((a, b) => b.totalImpressions - a.totalImpressions)
      .slice(0, 20);
  }

  private getTopSEOOpportunities(events: SEOEvent[]): string[] {
    const opportunities = new Set<string>();

    events.forEach(event => {
      const eventOpportunities = this.identifySEOOpportunities(event);
      eventOpportunities.forEach(opp => opportunities.add(opp));
    });

    return Array.from(opportunities).slice(0, 10);
  }

  private generateConversionReport(startDate: Date, endDate: Date): any {
    const allConversions: ConversionEvent[] = [];

    this.conversionData.forEach((conversions, date) => {
      const dateObj = new Date(date);
      if (dateObj >= startDate && dateObj <= endDate) {
        allConversions.push(...conversions);
      }
    });

    return {
      totalConversions: allConversions.length,
      conversionRate: this.calculateOverallConversionRate(allConversions),
      revenueMetrics: this.getRevenueMetrics(allConversions),
      conversionFunnel: this.getConversionFunnelOverall(allConversions),
      attributionAnalysis: this.getAttributionAnalysis(allConversions),
      topConversionPages: this.getTopConversionPages(allConversions),
      conversionByType: this.getConversionBreakdown(allConversions)
    };
  }

  private calculateOverallConversionRate(conversions: ConversionEvent[]): number {
    const totalSessions = this.sessionData.size;
    if (totalSessions === 0) return 0;

    return Math.round((conversions.length / totalSessions) * 10000) / 100;
  }

  private getRevenueMetrics(conversions: ConversionEvent[]): any {
    const totalRevenue = conversions
      .filter(c => c.value)
      .reduce((sum, c) => sum + c.value!, 0);

    return {
      totalRevenue,
      averageOrderValue: conversions.filter(c => c.value).length > 0 ?
        totalRevenue / conversions.filter(c => c.value).length : 0,
      revenueByType: this.getRevenueByConversionTypeOverall(conversions),
      revenueBySource: this.getRevenueBySourceOverall(conversions)
    };
  }

  private getRevenueByConversionTypeOverall(conversions: ConversionEvent[]): any {
    const revenueByType: Record<string, number> = {};

    conversions.forEach(conversion => {
      if (conversion.value) {
        revenueByType[conversion.conversionType] =
          (revenueByType[conversion.conversionType] || 0) + conversion.value;
      }
    });

    return revenueByType;
  }

  private getRevenueBySourceOverall(conversions: ConversionEvent[]): any {
    const revenueBySource: Record<string, number> = {};

    conversions.forEach(conversion => {
      if (conversion.value) {
        revenueBySource[conversion.source] =
          (revenueBySource[conversion.source] || 0) + conversion.value;
      }
    });

    return revenueBySource;
  }

  private getConversionFunnelOverall(conversions: ConversionEvent[]): any {
    const funnelStages = {
      awareness: 0,
      consideration: 0,
      decision: 0,
      purchase: 0
    };

    conversions.forEach(conversion => {
      funnelStages[conversion.funnelStage]++;
    });

    const total = Object.values(funnelStages).reduce((sum, val) => sum + val, 0);

    return {
      stages: funnelStages,
      percentages: Object.fromEntries(
        Object.entries(funnelStages).map(([stage, count]) => [
          stage,
          total > 0 ? Math.round((count / total) * 10000) / 100 : 0
        ])
      ),
      dropOffPoints: this.calculateDropOffPointsForFunnel(funnelStages)
    };
  }

  private calculateDropOffPointsForFunnel(funnelStages: any): string[] {
    const stages = ['awareness', 'consideration', 'decision', 'purchase'] as const;
    const dropOffs = [];

    for (let i = 0; i < stages.length - 1; i++) {
      const current = funnelStages[stages[i]];
      const next = funnelStages[stages[i + 1]];

      if (current > 0 && next === 0) {
        dropOffs.push(`No conversions from ${stages[i]} to ${stages[i + 1]}`);
      }
    }

    return dropOffs;
  }

  private getAttributionAnalysis(conversions: ConversionEvent[]): any {
    const sourceData: Record<string, { count: number; revenue: number }> = {};

    conversions.forEach(conversion => {
      if (!sourceData[conversion.source]) {
        sourceData[conversion.source] = { count: 0, revenue: 0 };
      }
      sourceData[conversion.source].count++;
      if (conversion.value) {
        sourceData[conversion.source].revenue += conversion.value;
      }
    });

    return Object.entries(sourceData)
      .map(([source, data]) => ({
        source,
        conversions: data.count,
        revenue: data.revenue,
        averageOrderValue: data.count > 0 ? data.revenue / data.count : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private getTopConversionPages(conversions: ConversionEvent[]): any[] {
    const pageData: Record<string, number> = {};

    conversions.forEach(conversion => {
      pageData[conversion.url] = (pageData[conversion.url] || 0) + 1;
    });

    return Object.entries(pageData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, count]) => ({ url, conversions: count }));
  }

  private getConversionBreakdown(conversions: ConversionEvent[]): any {
    const breakdown: Record<string, number> = {};

    conversions.forEach(conversion => {
      breakdown[conversion.conversionType] = (breakdown[conversion.conversionType] || 0) + 1;
    });

    const total = conversions.length;
    return Object.entries(breakdown)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / total) * 10000) / 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  private generateBusinessReport(startDate: Date, endDate: Date): any {
    const allBusinessMetrics: BusinessMetric[] = [];

    this.businessMetrics.forEach((metrics, period) => {
      const periodDate = new Date(period.split('-')[1]);
      if (periodDate >= startDate && periodDate <= endDate) {
        allBusinessMetrics.push(...metrics);
      }
    });

    return {
      totalMetrics: allBusinessMetrics.length,
      kpis: this.calculateBusinessKPIs(allBusinessMetrics),
      revenueAnalysis: this.getRevenueAnalysis(allBusinessMetrics),
      profitability: this.getProfitabilityAnalysis(allBusinessMetrics),
      growthMetrics: this.getGrowthMetrics(allBusinessMetrics),
      forecasts: this.getBusinessForecastsOverall(allBusinessMetrics)
    };
  }

  private calculateBusinessKPIs(metrics: BusinessMetric[]): any {
    const kpis: any = {};

    metrics.forEach(metric => {
      const metricKPIs = this.calculateKPIs(metric);
      Object.assign(kpis, metricKPIs);
    });

    return kpis;
  }

  private getRevenueAnalysis(metrics: BusinessMetric[]): any {
    const revenueMetrics = metrics.filter(m => m.metricType === 'revenue');
    const totalRevenue = revenueMetrics.reduce((sum, m) => sum + m.value, 0);

    return {
      totalRevenue,
      averageRevenue: revenueMetrics.length > 0 ? totalRevenue / revenueMetrics.length : 0,
      revenueGrowth: this.calculateRevenueGrowth(revenueMetrics),
      revenueProjections: this.generateRevenueProjections(revenueMetrics)
    };
  }

  private calculateRevenueGrowth(revenueMetrics: BusinessMetric[]): number {
    if (revenueMetrics.length < 2) return 0;

    const sorted = revenueMetrics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1].value;
    const previous = sorted[sorted.length - 2].value;

    return previous > 0 ? Math.round(((latest - previous) / previous) * 10000) / 100 : 0;
  }

  private generateRevenueProjections(revenueMetrics: BusinessMetric[]): any {
    const values = revenueMetrics.map(m => m.value);

    return {
      nextMonth: Math.round(this.generateSimpleForecast(values)),
      nextQuarter: Math.round(this.generateSimpleForecast(values) * 3),
      nextYear: Math.round(this.generateSimpleForecast(values) * 12)
    };
  }

  private getProfitabilityAnalysis(metrics: BusinessMetric[]): any {
    const revenueMetrics = metrics.filter(m => m.metricType === 'revenue');
    const costMetrics = metrics.filter(m => m.metricType === 'cost');
    const profitMetrics = metrics.filter(m => m.metricType === 'profit');

    const totalRevenue = revenueMetrics.reduce((sum, m) => sum + m.value, 0);
    const totalCost = costMetrics.reduce((sum, m) => sum + m.value, 0);
    const totalProfit = profitMetrics.reduce((sum, m) => sum + m.value, 0);

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0,
      breakEvenPoint: totalRevenue - totalCost
    };
  }

  private getGrowthMetrics(metrics: BusinessMetric[]): any {
    const growthMetrics: Record<string, number[]> = {};

    metrics.forEach(metric => {
      if (!growthMetrics[metric.metricType]) {
        growthMetrics[metric.metricType] = [];
      }
      growthMetrics[metric.metricType].push(metric.value);
    });

    const growthRates: any = {};
    Object.entries(growthMetrics).forEach(([type, values]) => {
      growthRates[type] = this.calculateGrowthRate(values);
    });

    return growthRates;
  }

  private getBusinessForecastsOverall(metrics: BusinessMetric[]): any {
    const forecasts: any = {};

    ['revenue', 'cost', 'profit', 'leads', 'conversions'].forEach(metricType => {
      const typeMetrics = metrics.filter(m => m.metricType === metricType);
      if (typeMetrics.length > 0) {
        const values = typeMetrics.map(m => m.value);
        forecasts[metricType] = {
          nextPeriod: Math.round(this.generateSimpleForecast(values)),
          trend: this.calculateTrend(typeMetrics, values[values.length - 1]),
          confidence: this.calculateForecastConfidence(typeMetrics.length)
        };
      }
    });

    return forecasts;
  }

  private generateExecutiveSummary(reports: any): any {
    const { userBehaviorAnalytics, performanceAnalytics, seoAnalytics, conversionAnalytics, businessIntelligence } = reports;

    return {
      overview: {
        totalSessions: userBehaviorAnalytics.totalSessions,
        averagePerformanceScore: performanceAnalytics.overallScore,
        totalConversions: conversionAnalytics.totalConversions,
        totalRevenue: businessIntelligence.revenueAnalysis.totalRevenue
      },
      keyMetrics: {
        conversionRate: conversionAnalytics.conversionRate,
        bounceRate: userBehaviorAnalytics.bounceRate,
        top3Rankings: seoAnalytics.rankingSummary.top3Rankings,
        profitMargin: businessIntelligence.profitability.profitMargin
      },
      performance: {
        excellent: performanceAnalytics.coreWebVitalsSummary.lcp.good > performanceAnalytics.coreWebVitalsSummary.lcp.poor,
        needsAttention: performanceAnalytics.coreWebVitalsSummary.lcp.poor > 0,
        overallGrade: this.getPerformanceGrade(performanceAnalytics.overallScore)
      },
      recommendations: [
        ...performanceAnalytics.topIssues.slice(0, 2).map((issue: any) => issue.message),
        ...seoAnalytics.seoOpportunities.slice(0, 2)
      ]
    };
  }

  private generateRecommendations(reports: any): string[] {
    const recommendations: string[] = [];

    // Performance Recommendations
    if (reports.performanceAnalytics.overallScore < 80) {
      recommendations.push('Performance optimieren - Core Web Vitals verbessern');
    }

    // SEO Recommendations
    if (reports.seoAnalytics.rankingSummary.top3Rankings < 5) {
      recommendations.push('SEO verbessern - Top-3-Rankings erhöhen');
    }

    // Conversion Recommendations
    if (reports.conversionAnalytics.conversionRate < 2) {
      recommendations.push('Conversion-Rate optimieren - Landing Pages verbessern');
    }

    // Business Recommendations
    if (reports.businessIntelligence.profitability.profitMargin < 20) {
      recommendations.push('Profitabilität erhöhen - Kosten optimieren');
    }

    return recommendations;
  }

  private getStartDateForPeriod(period: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    switch (period) {
      case 'daily':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private getActiveSessions(since: number): SessionData[] {
    return Array.from(this.sessionData.values()).filter(
      session => session.startTime >= since && (!session.endTime || session.endTime >= since)
    );
  }

  private getCurrentPageViews(since: number): UserBehaviorEvent[] {
    const pageViews: UserBehaviorEvent[] = [];

    this.sessionData.forEach(session => {
      session.events.forEach(event => {
        if (event.eventType === 'pageview' && event.timestamp >= since) {
          pageViews.push(event);
        }
      });
    });

    return pageViews;
  }

  private getLiveEvents(since: number): UserBehaviorEvent[] {
    const liveEvents: UserBehaviorEvent[] = [];

    this.sessionData.forEach(session => {
      session.events.forEach(event => {
        if (event.timestamp >= since) {
          liveEvents.push(event);
        }
      });
    });

    return liveEvents;
  }

  private getActivePerformanceAlerts(): any[] {
    const alerts: any[] = [];
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    this.performanceData.forEach((metrics, url) => {
      const recentMetrics = metrics.filter(m => m.timestamp >= oneHourAgo);

      recentMetrics.forEach(metric => {
        const metricAlerts = this.checkPerformanceAlerts(metric);
        alerts.push(...metricAlerts.map(alert => ({ ...alert, url })));
      });
    });

    return alerts;
  }

  private getRecentConversions(since: number): ConversionEvent[] {
    const recentConversions: ConversionEvent[] = [];

    this.conversionData.forEach((conversions, date) => {
      const dateObj = new Date(date);
      if (dateObj.getTime() >= since) {
        recentConversions.push(...conversions);
      }
    });

    return recentConversions;
  }

  private getTopPages(sessions: SessionData[]): any[] {
    const pageViews: Record<string, number> = {};

    sessions.forEach(session => {
      session.events.forEach(event => {
        if (event.eventType === 'pageview') {
          pageViews[event.url] = (pageViews[event.url] || 0) + 1;
        }
      });
    });

    return Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([url, views]) => ({ url, views }));
  }

  private getTopEvents(events: UserBehaviorEvent[]): any[] {
    const eventCounts: Record<string, number> = {};

    events.forEach(event => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
    });

    return Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([eventType, count]) => ({ eventType, count }));
  }

  private handlePageHidden(): void {
    // Session pausieren wenn Seite nicht sichtbar
    console.log('📱 Page hidden - session paused');
  }

  private handlePageVisible(): void {
    // Session fortsetzen wenn Seite wieder sichtbar
    console.log('📱 Page visible - session resumed');
  }

  private handlePageUnload(): void {
    // Session beenden wenn Seite verlassen wird
    const currentSession = this.getCurrentSession();
    if (currentSession) {
      currentSession.endTime = Date.now();
      currentSession.duration = currentSession.endTime - currentSession.startTime;
    }
  }

  private getCurrentSession(): SessionData | null {
    // Placeholder für Session-Tracking
    const sessions = Array.from(this.sessionData.values());
    return sessions.length > 0 ? sessions[sessions.length - 1] : null;
  }

  // ===== PUBLIC UTILITY METHODS =====

  getHealthStatus(): any {
    return {
      status: 'healthy',
      services: {
        userBehavior: 'operational',
        performance: 'operational',
        seo: 'operational',
        conversion: 'operational',
        business: 'operational'
      },
      data: {
        sessions: this.sessionData.size,
        performanceMetrics: Array.from(this.performanceData.values()).reduce((sum, arr) => sum + arr.length, 0),
        seoEvents: Array.from(this.seoData.values()).reduce((sum, arr) => sum + arr.length, 0),
        conversions: Array.from(this.conversionData.values()).reduce((sum, arr) => sum + arr.length, 0),
        businessMetrics: Array.from(this.businessMetrics.values()).reduce((sum, arr) => sum + arr.length, 0)
      },
      uptime: process.uptime(),
      lastUpdate: new Date().toISOString()
    };
  }

  clearAllData(): void {
    this.sessionData.clear();
    this.performanceData.clear();
    this.seoData.clear();
    this.conversionData.clear();
    this.businessMetrics.clear();
    console.log('🗑️ All analytics data cleared');
  }

  getConfiguration(): AnalyticsConfig {
    return { ...this.config };
  }

  updateConfiguration(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('✅ Analytics Engine configuration updated');
  }

  exportData(): any {
    return {
      sessions: Array.from(this.sessionData.entries()),
      performance: Array.from(this.performanceData.entries()),
      seo: Array.from(this.seoData.entries()),
      conversions: Array.from(this.conversionData.entries()),
      business: Array.from(this.businessMetrics.entries()),
      config: this.config,
      exportedAt: new Date().toISOString()
    };
  }
}

// Export Singleton
export const analyticsEngine = AnalyticsEngine.getInstance();
export default analyticsEngine;