import APIClient from '../client/APIClient';
import { PaginatedResponse } from '../types/api.types';

export interface UserEvent {
  userId: string;
  sessionId: string;
  timestamp: Date;
  eventType: 'page_view' | 'click' | 'form_start' | 'form_complete' | 'download' | 'chat_start' | 'quote_request' | 'contact_form';
  properties: Record<string, unknown>;
  value?: number;
  currency?: string;
}

export interface PageView {
  url: string;
  title: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  userAgent: string;
  ip: string;
  location?: {
    country: string;
    city: string;
    region: string;
    latitude?: number;
    longitude?: number;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    browserVersion: string;
    screenResolution: string;
    viewportSize: string;
  };
  performance: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
}

export interface Conversion {
  id: string;
  userId?: string;
  sessionId: string;
  type: 'contact_form' | 'quote_request' | 'phone_call' | 'pdf_download' | 'chat_interaction' | 'newsletter_signup';
  value?: number;
  currency?: string;
  properties: Record<string, unknown>;
  timestamp: Date;
  pageUrl: string;
  referrer?: string;
  utmData?: {
    source: string;
    medium: string;
    campaign: string;
  };
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  events: number;
  conversions: Conversion[];
  bounceRate: number;
  exitPage?: string;
  entryPage: string;
  referrer?: string;
  utmData?: {
    source: string;
    medium: string;
    campaign: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  location?: {
    country: string;
    city: string;
  };
  isNewUser: boolean;
}

export interface AnalyticsReport {
  timeframe: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    totalConversions: number;
    totalRevenue?: number;
    avgOrderValue?: number;
  };
  topPages: Array<{
    url: string;
    title: string;
    pageViews: number;
    uniquePageViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
  }>;
  topTrafficSources: Array<{
    source: string;
    sessions: number;
    users: number;
    conversionRate: number;
    avgSessionDuration: number;
  }>;
  topDevices: Array<{
    device: string;
    sessions: number;
    users: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
  }>;
  topLocations: Array<{
    country: string;
    sessions: number;
    users: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
  }>;
  conversionsByType: Record<string, number>;
  revenueBySource?: Record<string, number>;
}

export interface RealTimeMetrics {
  activeUsers: number;
  currentSessions: UserSession[];
  topPages: Array<{
    url: string;
    activeUsers: number;
    lastActivity: Date;
  }>;
  conversionsLastHour: number;
  pageViewsLastHour: number;
  avgSessionDuration: number;
  bounceRate: number;
}

class AnalyticsAPIClient {
  private apiClient: APIClient;

  constructor(apiKey: string, baseURL?: string) {
    this.apiClient = new APIClient({
      baseURL: baseURL || 'https://api.analytics-service.com/v1',
      timeout: 15000,
      retries: 2,
      retryDelay: 500,
      enableCache: true,
      cacheTTL: 300000, // 5 minutes
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      interceptors: {
        request: [this.addTimestamp.bind(this)],
      },
    });
  }

  private addTimestamp(config: unknown): unknown {
    const axiosConfig = config as { data?: unknown };
    return {
      ...axiosConfig,
      data: {
        ...axiosConfig.data,
        timestamp: (axiosConfig.data as { timestamp?: string })?.timestamp || new Date().toISOString(),
      },
    };
  }

  // Event Tracking
  public async trackPageView(pageView: Omit<PageView, 'timestamp'>): Promise<void> {
    await this.apiClient.post<void>(
      '/events/page-view',
      pageView,
      {
        cache: false, // Never cache event tracking
      }
    );
  }

  public async trackEvent(event: Omit<UserEvent, 'timestamp'>): Promise<void> {
    await this.apiClient.post<void>(
      '/events/custom',
      event,
      {
        cache: false,
      }
    );
  }

  public async trackConversion(conversion: Omit<Conversion, 'timestamp' | 'id'>): Promise<string> {
    const response = await this.apiClient.post<{ id: string }>(
      '/events/conversion',
      {
        ...conversion,
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      {
        cache: false,
      }
    );

    return response.data!.id;
  }

  public async trackFormSubmission(
    formType: string,
    formData: Record<string, unknown>,
    conversionValue?: number
  ): Promise<string> {
    return this.trackConversion({
      type: 'contact_form',
      value: conversionValue,
      properties: {
        formType,
        formData,
      },
      pageUrl: window.location.href,
      sessionId: this.getSessionId(),
    });
  }

  public async trackQuoteRequest(
    serviceType: string,
    value: number,
    formData: Record<string, unknown>
  ): Promise<string> {
    return this.trackConversion({
      type: 'quote_request',
      value,
      currency: 'EUR',
      properties: {
        serviceType,
        formData,
      },
      pageUrl: window.location.href,
      sessionId: this.getSessionId(),
    });
  }

  public async trackPDFDownload(fileName: string, url: string): Promise<string> {
    return this.trackConversion({
      type: 'pdf_download',
      properties: {
        fileName,
        url,
      },
      pageUrl: window.location.href,
      sessionId: this.getSessionId(),
    });
  }

  public async trackChatInteraction(
    interactionType: 'start' | 'message' | 'conversion',
    message?: string,
    conversionValue?: number
  ): Promise<string> {
    const conversionType = interactionType === 'conversion' ? 'chat_interaction' : undefined;

    if (conversionType) {
      return this.trackConversion({
        type: conversionType,
        value: conversionValue,
        properties: {
          interactionType,
          message,
        },
        pageUrl: window.location.href,
        sessionId: this.getSessionId(),
      });
    } else {
      await this.trackEvent({
        eventType: 'chat_start',
        properties: {
          interactionType,
          message,
        },
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
      });
      return '';
    }
  }

  // Data Retrieval
  public async getAnalyticsReport(
    startDate: Date,
    endDate: Date,
    filters?: {
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      deviceType?: string;
      location?: string;
    }
  ): Promise<AnalyticsReport> {
    const response = await this.apiClient.post<AnalyticsReport>(
      '/reports/analytics',
      {
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        filters,
      },
      {
        cache: true,
        cacheTTL: 600000, // 10 minutes
      }
    );

    return response.data!;
  }

  public async getPageAnalytics(
    url: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    pageViews: number;
    uniquePageViews: number;
    avgTimeOnPage: number;
    bounceRate: number;
    exitRate: number;
    entrances: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
  }> {
    const response = await this.apiClient.post<{
      pageViews: number;
      uniquePageViews: number;
      avgTimeOnPage: number;
      bounceRate: number;
      exitRate: number;
      entrances: number;
      conversions: number;
      conversionRate: number;
      revenue?: number;
    }>(
      '/reports/page-analytics',
      {
        url,
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
      {
        cache: true,
        cacheTTL: 300000,
      }
    );

    return response.data!;
  }

  public async getUserSessions(
    userId?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<PaginatedResponse<UserSession>> {
    const response = await this.apiClient.get<PaginatedResponse<UserSession>>(
      '/sessions',
      {
        userId,
        limit,
        offset,
      },
      {
        cache: true,
        cacheTTL: 60000, // 1 minute
      }
    );

    return response.data!;
  }

  public async getConversions(
    startDate: Date,
    endDate: Date,
    conversionType?: string,
    limit: number = 100
  ): Promise<Conversion[]> {
    const response = await this.apiClient.post<Conversion[]>(
      '/conversions',
      {
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        conversionType,
        limit,
      },
      {
        cache: true,
        cacheTTL: 300000,
      }
    );

    return response.data!;
  }

  // Real-time Analytics
  public async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const response = await this.apiClient.get<RealTimeMetrics>(
      '/realtime/metrics',
      {},
      {
        cache: false, // Real-time data should not be cached
      }
    );

    return response.data!;
  }

  public async getCurrentActiveUsers(): Promise<{
    count: number;
    users: Array<{
      userId: string;
      sessionId: string;
      currentPage: string;
      lastActivity: Date;
      location?: string;
      device: string;
    }>;
  }> {
    const response = await this.apiClient.get<{
      count: number;
      users: Array<{
        userId: string;
        sessionId: string;
        currentPage: string;
        lastActivity: Date;
        location?: string;
        device: string;
      }>;
    }>(
      '/realtime/active-users',
      {},
      {
        cache: false,
      }
    );

    return response.data!;
  }

  // Funnel Analysis
  public async getConversionFunnel(
    steps: Array<{
      name: string;
      condition: string;
      description?: string;
    }>,
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
      step: string;
      users: number;
      conversionRate: number;
      dropoffRate: number;
      avgTimeToComplete?: number;
    }>> {
    const response = await this.apiClient.post<Array<{
      step: string;
      users: number;
      conversionRate: number;
      dropoffRate: number;
      avgTimeToComplete?: number;
    }>>(
      '/funnel/analyze',
      {
        steps,
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
      {
        cache: true,
        cacheTTL: 600000,
      }
    );

    return response.data!;
  }

  // Cohort Analysis
  public async getCohortAnalysis(
    cohortType: 'weekly' | 'monthly',
    startDate: Date,
    endDate: Date
  ): Promise<Array<{
      cohort: string;
      size: number;
      retention: Array<number>;
      avgSessionDuration: Array<number>;
      conversionRate: Array<number>;
    }>> {
    const response = await this.apiClient.post<Array<{
      cohort: string;
      size: number;
      retention: Array<number>;
      avgSessionDuration: Array<number>;
      conversionRate: Array<number>;
    }>>(
      '/cohort/analyze',
      {
        cohortType,
        timeframe: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
      {
        cache: true,
        cacheTTL: 3600000, // 1 hour
      }
    );

    return response.data!;
  }

  // Utility methods
  private getSessionId(): string {
    // Get or generate session ID from localStorage/sessionStorage
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    // Get user ID from localStorage or cookie
    return localStorage.getItem('analytics_user_id') || undefined;
  }

  public setUserId(userId: string): void {
    localStorage.setItem('analytics_user_id', userId);
  }

  public clearUserId(): void {
    localStorage.removeItem('analytics_user_id');
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    const response = await this.apiClient.get<{ status: string; timestamp: Date }>(
      '/health',
      {},
      {
        cache: false,
      }
    );

    return response.data!;
  }

  public getRateLimitInfo() {
    return this.apiClient.getRateLimitInfo();
  }
}

export default AnalyticsAPIClient;