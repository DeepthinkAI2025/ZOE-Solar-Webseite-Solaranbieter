/**
 * Advanced Analytics & AI-Tracking Service
 * Implementiert KI-Referral Tracking, Voice Search Analyse, Featured Snippet Performance
 */

export interface AIAnalyticsEvent {
  eventType: 'ai_referral' | 'voice_search' | 'featured_snippet' | 'ai_answer' | 'chatbot_interaction';
  timestamp: string;
  source: string;
  query: string;
  result: string;
  context: {
    userAgent: string;
    page: string;
    region: string;
    language: string;
    deviceType: string;
  };
  metadata: {
    confidence?: number;
    position?: number;
    clickThrough?: boolean;
    dwellTime?: number;
  };
}

export class AdvancedAnalyticsService {
  private events: AIAnalyticsEvent[] = [];
  private isTrackingEnabled: boolean = true;
  private batchSize: number = 50;
  private flushInterval: number = 30000;

  constructor() {
    this.initializeTracking();
    this.startPeriodicFlush();
    this.setupAIMonitoring();
  }

  private initializeTracking(): void {
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.trackPageVisibility(document.hidden);
      });
      this.detectAICrawlers();
      this.setupVoiceSearchTracking();
      this.monitorFeaturedSnippets();
      console.log('📊 Advanced Analytics Service initialized');
    }
  }

  trackAIReferral(source: string, query: string, result: string): void {
    if (!this.isTrackingEnabled) return;

    const event: AIAnalyticsEvent = {
      eventType: 'ai_referral',
      timestamp: new Date().toISOString(),
      source,
      query,
      result,
      context: {
        userAgent: navigator.userAgent,
        page: window.location.pathname,
        region: 'DE-BY',
        language: navigator.language,
        deviceType: this.detectDeviceType()
      },
      metadata: {
        confidence: this.calculateAICredibility(source),
        clickThrough: false,
        dwellTime: 0
      }
    };

    this.addEvent(event);
    console.log(`🤖 AI Referral tracked: ${source} - "${query}"`);
  }

  trackVoiceSearch(transcript: string, confidence: number): void {
    if (!this.isTrackingEnabled) return;

    const event: AIAnalyticsEvent = {
      eventType: 'voice_search',
      timestamp: new Date().toISOString(),
      source: 'voice_search',
      query: transcript,
      result: 'voice_search_processed',
      context: {
        userAgent: navigator.userAgent,
        page: window.location.pathname,
        region: 'DE-BY',
        language: 'de-DE',
        deviceType: this.detectDeviceType()
      },
      metadata: {
        confidence,
        dwellTime: 0
      }
    };

    this.addEvent(event);
    console.log(`🎤 Voice Search tracked: "${transcript}" (${confidence})`);
  }

  trackFeaturedSnippet(query: string, position: number, clickThrough: boolean): void {
    if (!this.isTrackingEnabled) return;

    const event: AIAnalyticsEvent = {
      eventType: 'featured_snippet',
      timestamp: new Date().toISOString(),
      source: 'google_search',
      query,
      result: 'featured_snippet_displayed',
      context: {
        userAgent: navigator.userAgent,
        page: window.location.pathname,
        region: 'DE-BY',
        language: navigator.language,
        deviceType: this.detectDeviceType()
      },
      metadata: {
        confidence: 0.95,
        position,
        clickThrough
      }
    };

    this.addEvent(event);
    console.log(`📈 Featured Snippet tracked: "${query}" - Position ${position} - Click: ${clickThrough}`);
  }

  private setupVoiceSearchTracking(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'de-DE';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          this.trackVoiceSearch(transcript, confidence);
        };

        (window as any).zoeSpeechRecognition = recognition;
      }
    }
  }

  private monitorFeaturedSnippets(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const query = urlParams.get('q') || urlParams.get('query');

    if (source === 'featured_snippet' && query) {
      this.trackFeaturedSnippet(query, 1, true);
    }
  }

  private setupAIMonitoring(): void {
    const referrer = document.referrer;
    if (referrer) {
      const aiSources = [
        'chat.openai.com',
        'claude.ai',
        'bard.google.com',
        'perplexity.ai',
        'you.com'
      ];

      for (const source of aiSources) {
        if (referrer.includes(source)) {
          this.trackAIReferral(source, document.title, 'ai_referral_landing');
          break;
        }
      }
    }
  }

  private detectAICrawlers(): void {
    const aiCrawlers = [
      'GPTBot',
      'ChatGPT-User',
      'Google-Extended',
      'anthropic-ai',
      'Claude-Web',
      'PerplexityBot',
      'YouBot'
    ];

    const userAgent = navigator.userAgent;
    for (const crawler of aiCrawlers) {
      if (userAgent.includes(crawler)) {
        this.trackAIReferral(crawler, document.title, 'ai_crawler_visit');
        break;
      }
    }
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  private addEvent(event: AIAnalyticsEvent): void {
    this.events.push(event);
    if (this.events.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const response = await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log(`📊 ${eventsToSend.length} analytics events flushed successfully`);
      } else {
        console.error('❌ Failed to flush analytics events');
        this.events.unshift(...eventsToSend);
      }
    } catch (error) {
      console.error('❌ Analytics flush failed:', error);
      this.events.unshift(...eventsToSend);
    }
  }

  private detectDeviceType(): string {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  private calculateAICredibility(source: string): number {
    const credibilityScores: { [key: string]: number } = {
      'chat.openai.com': 0.9,
      'claude.ai': 0.85,
      'bard.google.com': 0.95,
      'perplexity.ai': 0.8,
      'you.com': 0.75
    };

    return credibilityScores[source] || 0.7;
  }

  private trackPageVisibility(hidden: boolean): void {
    if (hidden) {
      console.log('📱 Page hidden - tracking dwell time');
    } else {
      console.log('📱 Page visible - tracking re-engagement');
    }
  }

  public enableTracking(): void {
    this.isTrackingEnabled = true;
    console.log('📊 Analytics tracking enabled');
  }

  public disableTracking(): void {
    this.isTrackingEnabled = false;
    console.log('📊 Analytics tracking disabled');
  }

  public getEvents(): AIAnalyticsEvent[] {
    return [...this.events];
  }

  public async forceFlush(): Promise<void> {
    await this.flushEvents();
  }

  public generateAnalyticsReport(): any {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(event => new Date(event.timestamp) > last24h);

    return {
      period: 'last_24_hours',
      generated: now.toISOString(),
      summary: {
        totalEvents: recentEvents.length,
        aiReferrals: recentEvents.filter(e => e.eventType === 'ai_referral').length,
        voiceSearches: recentEvents.filter(e => e.eventType === 'voice_search').length,
        featuredSnippets: recentEvents.filter(e => e.eventType === 'featured_snippet').length
      }
    };
  }
}

export const advancedAnalyticsService = new AdvancedAnalyticsService();
type KPI = {
  timestamp: string;
  avgPosition: number;
  top10Percentage: number;
  estimatedTraffic: number;
  conversionRate?: number;
  localVisibility?: number;
  aiCitations?: Record<string, number>;
};

type Alert = {
  type: string;
  severity: string;
  message: string;
  timestamp: string;
};

type ReportSummary = {
  period: string;
  avgPosition: number;
  organicTraffic: number;
  conversions: number;
  revenue: number;
  visibilityScore: number;
  conversionRate: number;
  localVisibility: number;
  aiCitations: Record<string, number>;
  alerts: Alert[];
};

type ExportFormat = 'json' | 'csv' | 'markdown';

// Hilfsfunktionen zum Laden der Datenquellen
function loadJSON(file: string) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data', file), 'utf-8'));
}

// Aggregation aller relevanten KPIs aus Reports und Monitoring-Daten
export function aggregateKPIs(): KPI {
  const seoReport = loadJSON('seo-report.json');
  const aiMetrics = loadJSON('seo-monitoring/ai-platform-performance-metrics.json');
  const weeklyReport = loadJSON('weekly-report-2025-09-28.json');
  const latestSummary = loadJSON('seo-monitoring/latest-summary.json');

  return {
    timestamp: seoReport.timestamp,
    avgPosition: seoReport.metrics.avgPosition,
    top10Percentage: seoReport.metrics.top10Percentage,
    estimatedTraffic: seoReport.metrics.estimatedTraffic,
    conversionRate: weeklyReport.summary.kpiOverview.analytics.conversionRate,
    localVisibility: weeklyReport.summary.kpiOverview.geo.visibilityScore,
    aiCitations: aiMetrics.metrics
      ? Object.fromEntries(
          Object.entries(aiMetrics.metrics).map(([k, v]: [string, any]) => [k, v.current.status === 'online' ? 1 : 0])
        )
      : {},
  };
}

// Automatisierte Monats- und Quartalsauswertung
export function getPeriodReport(period: 'monthly' | 'quarterly'): ReportSummary {
  // Beispiel: Aggregation aus Weekly- und SEO-Report
  const weeklyReport = loadJSON('weekly-report-2025-09-28.json');
  const seoReport = loadJSON('seo-report.json');
  const aiMetrics = loadJSON('seo-monitoring/ai-platform-performance-metrics.json');

  return {
    period: period === 'monthly' ? 'Monat' : 'Quartal',
    avgPosition: seoReport.metrics.avgPosition,
    organicTraffic: weeklyReport.summary.kpiOverview.seo.organicTraffic,
    conversions: weeklyReport.summary.kpiOverview.analytics.conversions,
    revenue: weeklyReport.summary.kpiOverview.analytics.revenue,
    visibilityScore: weeklyReport.summary.kpiOverview.seo.visibilityScore,
    conversionRate: weeklyReport.summary.kpiOverview.analytics.conversionRate,
    localVisibility: weeklyReport.summary.kpiOverview.geo.visibilityScore,
    aiCitations: aiMetrics.metrics
      ? Object.fromEntries(
          Object.entries(aiMetrics.metrics).map(([k, v]: [string, any]) => [k, v.current.status === 'online' ? 1 : 0])
        )
      : {},
    alerts: seoReport.alerts.map((a: any) => ({
      type: a.type,
      severity: a.severity,
      message: a.message,
      timestamp: a.timestamp,
    })),
  };
}

// Alerting für kritische Schwankungen
export function checkCriticalAlerts(): Alert[] {
  const seoReport = loadJSON('seo-report.json');
  return seoReport.alerts.filter((a: any) => a.severity === 'error' || a.severity === 'critical');
}

// Reporting-Funktionen für Stakeholder
export function exportReport(format: ExportFormat = 'json', period: 'monthly' | 'quarterly' = 'monthly'): string {
  const report = getPeriodReport(period);
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  if (format === 'csv') {
    // Simple CSV-Export (nur KPIs, keine Alerts)
    const header = Object.keys(report).filter(k => k !== 'alerts' && k !== 'aiCitations').join(',');
    const values = Object.values(report).filter((v, i) => header.split(',')[i] !== 'alerts' && header.split(',')[i] !== 'aiCitations').join(',');
    return `${header}\n${values}`;
  }
  if (format === 'markdown') {
    return `# SEO KPI Report (${report.period})\n\n` +
      `- Durchschnittliche Position: ${report.avgPosition}\n` +
      `- Organischer Traffic: ${report.organicTraffic}\n` +
      `- Conversions: ${report.conversions}\n` +
      `- Umsatz: ${report.revenue}\n` +
      `- Sichtbarkeits-Score: ${report.visibilityScore}\n` +
      `- Conversion Rate: ${report.conversionRate}\n` +
      `- Lokale Sichtbarkeit: ${report.localVisibility}\n` +
      `- AI-Citations: ${Object.entries(report.aiCitations).map(([k, v]) => `${k}: ${v}`).join(', ')}\n` +
      `\n## Alerts\n${report.alerts.map(a => `- [${a.severity}] ${a.message}`).join('\n')}`;
  }
  return '';
}

// Visualisierung (Platzhalter für Frontend-Integration)
export function getDashboardData() {
  return {
    kpis: aggregateKPIs(),
    alerts: checkCriticalAlerts(),
    reportMonthly: getPeriodReport('monthly'),
    reportQuarterly: getPeriodReport('quarterly'),
  };
}

// Automatisierte Auswertung (z.B. per Cronjob)
export function runAutomatedEvaluation() {
  const monthly = getPeriodReport('monthly');
  const quarterly = getPeriodReport('quarterly');
  // Hier könnte z.B. ein E-Mail-Trigger oder PDF-Export erfolgen
  fs.writeFileSync(path.resolve(__dirname, '../data/seo-monitoring/monthly-report.json'), JSON.stringify(monthly, null, 2));
  fs.writeFileSync(path.resolve(__dirname, '../data/seo-monitoring/quarterly-report.json'), JSON.stringify(quarterly, null, 2));
}

// --- Ende des Moduls ---