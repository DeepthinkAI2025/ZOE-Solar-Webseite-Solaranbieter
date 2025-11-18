import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  interactions: number;
  conversionEvents: ConversionEvent[];
  deviceInfo: DeviceInfo;
  location?: GeoLocation;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  browserVersion: string;
  os: string;
  screenResolution: string;
  viewportSize: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export interface GeoLocation {
  country: string;
  city: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface ConversionEvent {
  type: 'contact_form' | 'quote_request' | 'pdf_download' | 'phone_call' | 'chat_interaction';
  timestamp: Date;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface UserBehavior {
  sessionId: string;
  pagePath: string;
  timestamp: Date;
  action: 'page_view' | 'scroll' | 'click' | 'form_start' | 'form_complete' | 'chat_start' | 'chat_message';
  target?: string;
  value?: string | number;
  duration?: number;
}

export interface PagePerformance {
  path: string;
  loadTime: number;
  domContentLoaded: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  bounceRate: number;
  avgTimeOnPage: number;
  totalViews: number;
  uniqueViews: number;
}

export interface UserAnalyticsState {
  currentSession: UserSession | null;
  sessions: UserSession[];
  behavior: UserBehavior[];
  pagePerformance: Record<string, PagePerformance>;
  conversionMetrics: {
    totalConversions: number;
    conversionRate: number;
    conversionFunnel: Record<string, number>;
    averageOrderValue?: number;
    totalRevenue?: number;
  };
  realTimeMetrics: {
    activeUsers: number;
    currentSessions: UserSession[];
    topPages: Array<{ path: string; activeUsers: number }>;
    bounceRate: number;
    avgSessionDuration: number;
  };
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: UserAnalyticsState = {
  currentSession: null,
  sessions: [],
  behavior: [],
  pagePerformance: {},
  conversionMetrics: {
    totalConversions: 0,
    conversionRate: 0,
    conversionFunnel: {},
  },
  realTimeMetrics: {
    activeUsers: 0,
    currentSessions: [],
    topPages: [],
    bounceRate: 0,
    avgSessionDuration: 0,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

const userAnalyticsSlice = createSlice({
  name: 'userAnalytics',
  initialState,
  reducers: {
    // Session management
    startSession: (state, action: PayloadAction<Omit<UserSession, 'id' | 'startTime' | 'pageViews' | 'interactions' | 'conversionEvents'>>) => {
      const session: UserSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date(),
        pageViews: 0,
        interactions: 0,
        conversionEvents: [],
        ...action.payload,
      };
      state.currentSession = session;
      state.sessions.push(session);
      state.realTimeMetrics.currentSessions.push(session);
      state.realTimeMetrics.activeUsers = state.realTimeMetrics.currentSessions.length;
      state.lastUpdated = new Date();
    },

    endSession: (state) => {
      if (state.currentSession) {
        const endTime = new Date();
        const duration = endTime.getTime() - state.currentSession.startTime.getTime();

        state.currentSession.endTime = endTime;
        state.currentSession.duration = duration;

        // Update session in sessions array
        const index = state.sessions.findIndex(s => s.id === state.currentSession!.id);
        if (index >= 0) {
          state.sessions[index] = state.currentSession;
        }

        // Remove from current sessions
        state.realTimeMetrics.currentSessions = state.realTimeMetrics.currentSessions.filter(
          s => s.id !== state.currentSession!.id
        );
        state.realTimeMetrics.activeUsers = state.realTimeMetrics.currentSessions.length;

        state.currentSession = null;
        state.lastUpdated = new Date();
      }
    },

    // Behavior tracking
    trackBehavior: (state, action: PayloadAction<Omit<UserBehavior, 'timestamp' | 'sessionId'>>) => {
      if (state.currentSession) {
        const behavior: UserBehavior = {
          sessionId: state.currentSession.id,
          timestamp: new Date(),
          ...action.payload,
        };
        state.behavior.push(behavior);

        // Update session interactions
        state.currentSession.interactions += 1;
        if (action.payload.action === 'page_view') {
          state.currentSession.pageViews += 1;
        }

        state.lastUpdated = new Date();
      }
    },

    // Page performance
    updatePagePerformance: (state, action: PayloadAction<{ path: string } & Partial<PagePerformance>>) => {
      const { path, ...performanceData } = action.payload;
      const existing = state.pagePerformance[path] || {
        path,
        loadTime: 0,
        domContentLoaded: 0,
        timeToInteractive: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        bounceRate: 0,
        avgTimeOnPage: 0,
        totalViews: 0,
        uniqueViews: 0,
      };

      state.pagePerformance[path] = { ...existing, ...performanceData };
      state.lastUpdated = new Date();
    },

    // Conversion tracking
    trackConversion: (state, action: PayloadAction<Omit<ConversionEvent, 'timestamp'>>) => {
      if (state.currentSession) {
        const conversion: ConversionEvent = {
          timestamp: new Date(),
          ...action.payload,
        };
        state.currentSession.conversionEvents.push(conversion);

        // Update conversion metrics
        state.conversionMetrics.totalConversions += 1;

        // Update funnel
        const funnelKey = action.payload.type;
        state.conversionMetrics.conversionFunnel[funnelKey] =
          (state.conversionMetrics.conversionFunnel[funnelKey] || 0) + 1;

        // Calculate conversion rate
        const totalSessions = state.sessions.length;
        state.conversionMetrics.conversionRate = totalSessions > 0
          ? (state.conversionMetrics.totalConversions / totalSessions) * 100
          : 0;

        state.lastUpdated = new Date();
      }
    },

    // Real-time metrics
    updateRealTimeMetrics: (state, action: PayloadAction<Partial<UserAnalyticsState['realTimeMetrics']>>) => {
      state.realTimeMetrics = { ...state.realTimeMetrics, ...action.payload };
      state.lastUpdated = new Date();
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Data management
    clearAnalyticsData: (state) => {
      Object.assign(state, initialState);
    },
    clearSession: (state) => {
      state.currentSession = null;
    },
    clearBehavior: (state) => {
      state.behavior = [];
    },
  },
});

export const {
  startSession,
  endSession,
  trackBehavior,
  updatePagePerformance,
  trackConversion,
  updateRealTimeMetrics,
  setLoading,
  setError,
  clearAnalyticsData,
  clearSession,
  clearBehavior,
} = userAnalyticsSlice.actions;

export default userAnalyticsSlice.reducer;