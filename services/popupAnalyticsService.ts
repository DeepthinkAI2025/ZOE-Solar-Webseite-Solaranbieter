// Popup Analytics Service für ZOE Solar Conversion Tracking
// Detaillierte Analyse von Popup-Performance und Konversionsraten

interface PopupEvent {
  id: string;
  type: 'show' | 'close' | 'action_click' | 'form_submit' | 'conversion';
  popupType: 'timer' | 'black_friday' | 'exit_intent' | 'manual';
  timestamp: number;
  sessionId: string;
  userId?: string;
  action?: string;
  formData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  metadata?: {
    timeOnPage?: number;
    scrollDepth?: number;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

interface PopupMetrics {
  totalShows: number;
  uniqueShows: number;
  totalConversions: number;
  conversionRate: number;
  averageTimeToShow: number;
  bounceRate: number;
  topActions: Array<{ action: string; count: number; percentage: number }>;
  hourlyBreakdown: Array<{ hour: number; shows: number; conversions: number }>;
  dailyBreakdown: Array<{ date: string; shows: number; conversions: number; rate: number }>;
}

interface PopupPerformance {
  popupType: string;
  metrics: PopupMetrics;
  revenueGenerated?: number;
  costPerAcquisition?: number;
  returnOnInvestment?: number;
}

class PopupAnalyticsService {
  private events: PopupEvent[] = [];
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.loadStoredEvents();
    this.initializeSessionTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSessionTracking(): void {
    // Session start tracking
    this.trackEvent({
      type: 'show',
      popupType: 'manual',
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        utmSource: this.getUTMParameter('utm_source'),
        utmMedium: this.getUTMParameter('utm_medium'),
        utmCampaign: this.getUTMParameter('utm_campaign')
      }
    });
  }

  private getUTMParameter(param: string): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || undefined;
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('zoe_solar_popup_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored popup events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('zoe_solar_popup_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save popup events:', error);
    }
  }

  public trackEvent(event: Omit<PopupEvent, 'id' | 'timestamp' | 'sessionId'>): void {
    const fullEvent: PopupEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata: {
        ...event.metadata,
        timeOnPage: Date.now() - this.startTime,
        scrollDepth: this.getCurrentScrollDepth()
      }
    };

    this.events.push(fullEvent);
    this.saveEvents();

    // Send to Google Analytics if available
    this.sendToGoogleAnalytics(fullEvent);
  }

  private getCurrentScrollDepth(): number {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    return scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
  }

  private sendToGoogleAnalytics(event: PopupEvent): void {
    if (typeof window !== 'undefined' && window.gtag) {
      const eventName = `popup_${event.type}`;
      const eventParams: any = {
        event_category: 'popup_conversion',
        event_label: event.popupType,
        custom_map: {
          custom_parameter_1: 'popup_type',
          custom_parameter_2: 'action_type',
          custom_parameter_3: 'session_id'
        }
      };

      if (event.action) {
        eventParams.action_type = event.action;
      }

      if (event.formData?.email) {
        eventParams.has_email = true;
      }

      window.gtag('event', eventName, eventParams);
    }

    // Send to custom endpoint for detailed tracking
    this.sendToCustomEndpoint(event);
  }

  private async sendToCustomEndpoint(event: PopupEvent): Promise<void> {
    try {
      await fetch('/api/popup-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Failed to send popup analytics to custom endpoint:', error);
    }
  }

  public getMetrics(popupType?: string): PopupMetrics {
    const filteredEvents = popupType
      ? this.events.filter(e => e.popupType === popupType)
      : this.events;

    const shows = filteredEvents.filter(e => e.type === 'show');
    const conversions = filteredEvents.filter(e => e.type === 'conversion');
    const uniqueSessions = new Set(shows.map(e => e.sessionId)).size;

    const totalShows = shows.length;
    const totalConversions = conversions.length;
    const conversionRate = totalShows > 0 ? (totalConversions / totalShows) * 100 : 0;

    // Calculate average time to show
    const averageTimeToShow = shows.length > 0
      ? shows.reduce((sum, show) => sum + (show.metadata?.timeOnPage || 0), 0) / shows.length
      : 0;

    // Calculate bounce rate (closes without action)
    const closesWithoutAction = filteredEvents.filter(e =>
      e.type === 'close' &&
      !this.events.some(other =>
        other.sessionId === e.sessionId &&
        other.popupType === e.popupType &&
        other.timestamp > e.timestamp &&
        (other.type === 'action_click' || other.type === 'form_submit')
      )
    ).length;

    const bounceRate = totalShows > 0 ? (closesWithoutAction / totalShows) * 100 : 0;

    // Top actions analysis
    const actions = filteredEvents.filter(e => e.type === 'action_click');
    const actionCounts = actions.reduce((acc, action) => {
      const key = action.action || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({
        action,
        count,
        percentage: actions.length > 0 ? (count / actions.length) * 100 : 0
      }));

    // Hourly breakdown
    const hourlyBreakdown = this.createHourlyBreakdown(shows, conversions);

    // Daily breakdown
    const dailyBreakdown = this.createDailyBreakdown(shows, conversions);

    return {
      totalShows,
      uniqueShows: uniqueSessions,
      totalConversions,
      conversionRate,
      averageTimeToShow,
      bounceRate,
      topActions,
      hourlyBreakdown,
      dailyBreakdown
    };
  }

  private createHourlyBreakdown(shows: PopupEvent[], conversions: PopupEvent[]): Array<{ hour: number; shows: number; conversions: number }> {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      shows: 0,
      conversions: 0
    }));

    shows.forEach(show => {
      const hour = new Date(show.timestamp).getHours();
      hourlyData[hour].shows++;
    });

    conversions.forEach(conversion => {
      const hour = new Date(conversion.timestamp).getHours();
      hourlyData[hour].conversions++;
    });

    return hourlyData;
  }

  private createDailyBreakdown(shows: PopupEvent[], conversions: PopupEvent[]): Array<{ date: string; shows: number; conversions: number; rate: number }> {
    const dailyData = new Map<string, { shows: number; conversions: number }>();

    shows.forEach(show => {
      const date = new Date(show.timestamp).toISOString().split('T')[0];
      const existing = dailyData.get(date) || { shows: 0, conversions: 0 };
      existing.shows++;
      dailyData.set(date, existing);
    });

    conversions.forEach(conversion => {
      const date = new Date(conversion.timestamp).toISOString().split('T')[0];
      const existing = dailyData.get(date) || { shows: 0, conversions: 0 };
      existing.conversions++;
      dailyData.set(date, existing);
    });

    return Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        shows: data.shows,
        conversions: data.conversions,
        rate: data.shows > 0 ? (data.conversions / data.shows) * 100 : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }

  public getPerformanceByPopupType(): PopupPerformance[] {
    const popupTypes = ['timer', 'black_friday', 'exit_intent', 'manual'];

    return popupTypes.map(type => {
      const metrics = this.getMetrics(type);
      const conversions = this.events.filter(e => e.popupType === type && e.type === 'conversion');

      // Calculate estimated revenue (you can adjust these values based on your business metrics)
      const estimatedRevenuePerConversion = type === 'black_friday' ? 5000 : 3000;
      const revenueGenerated = conversions.length * estimatedRevenuePerConversion;

      return {
        popupType: type,
        metrics,
        revenueGenerated,
        costPerAcquisition: conversions.length > 0 ? 500 / conversions.length : 0, // Assuming $500 ad spend per popup
        returnOnInvestment: revenueGenerated > 0 ? ((revenueGenerated - 500) / 500) * 100 : 0
      };
    });
  }

  public exportData(): string {
    const data = {
      summary: this.getPerformanceByPopupType(),
      rawEvents: this.events.slice(-100), // Last 100 events
      exportTimestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    return JSON.stringify(data, null, 2);
  }

  public clearData(): void {
    this.events = [];
    localStorage.removeItem('zoe_solar_popup_events');
  }

  public getRealTimeMetrics(): {
    activeSessions: number;
    currentHourConversions: number;
    todayPerformance: PopupMetrics;
  } {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const todayStart = new Date().setHours(0, 0, 0, 0);

    const activeSessions = new Set(
      this.events
        .filter(e => now - e.timestamp < 30 * 60 * 1000) // Active in last 30 minutes
        .map(e => e.sessionId)
    ).size;

    const currentHourConversions = this.events.filter(
      e => e.type === 'conversion' && e.timestamp > oneHourAgo
    ).length;

    const todayEvents = this.events.filter(e => e.timestamp > todayStart);
    const todayMetrics = this.getMetricsFromEvents(todayEvents);

    return {
      activeSessions,
      currentHourConversions,
      todayPerformance: todayMetrics
    };
  }

  private getMetricsFromEvents(events: PopupEvent[]): PopupMetrics {
    const shows = events.filter(e => e.type === 'show');
    const conversions = events.filter(e => e.type === 'conversion');
    const uniqueSessions = new Set(shows.map(e => e.sessionId)).size;

    return {
      totalShows: shows.length,
      uniqueShows: uniqueSessions,
      totalConversions: conversions.length,
      conversionRate: shows.length > 0 ? (conversions.length / shows.length) * 100 : 0,
      averageTimeToShow: 0,
      bounceRate: 0,
      topActions: [],
      hourlyBreakdown: [],
      dailyBreakdown: []
    };
  }
}

// Singleton instance
export const popupAnalyticsService = new PopupAnalyticsService();

// Export type for use in components
export type { PopupEvent, PopupMetrics, PopupPerformance };