import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics Interfaces
export interface UserSession {
  id: string;
  startTime: Date;
  duration: number;
  pageViews: number;
  bounce: boolean;
  exitPage: string;
  userAgent: string;
  referrer: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os?: string;
    browser?: string;
    screen: {
      width: number;
      height: number;
    };
  };
  location?: {
    country?: string;
    city?: string;
    region?: string;
    lat?: number;
    lng?: number;
  };
}

export interface PageView {
  sessionId: string;
  url: string;
  title: string;
  timestamp: Date;
  timeOnPage: number;
  scrollDepth: number;
  interactions: UserInteraction[];
  exit: boolean;
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'form_submit' | 'download' | 'video_play' | 'chat_initiate' | 'quote_request';
  element?: string;
  elementClass?: string;
  elementId?: string;
  timestamp: Date;
  value?: any;
  metadata?: Record<string, any>;
}

export interface ConversionEvent {
  sessionId: string;
  type: 'contact_form' | 'quote_request' | 'newsletter_signup' | 'phone_call' | 'appointment_booking';
  value?: number;
  currency?: string;
  timestamp: Date;
  page: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export interface UserBehaviorMetrics {
  avgSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  returnVisitorRate: number;
  conversionRate: number;
  topPages: Array<{
    url: string;
    views: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }>;
  userFlow: Array<{
    from: string;
    to: string;
    count: number;
    dropOffRate: number;
  }>;
}

export interface AnalyticsState {
  currentSession: UserSession | null;
  currentPageView: PageView | null;
  pageViews: PageView[];
  interactions: UserInteraction[];
  conversions: ConversionEvent[];
  performanceMetrics: PerformanceMetrics | null;
  behaviorMetrics: UserBehaviorMetrics | null;
  isLoading: boolean;
  error: string | null;
  trackingEnabled: boolean;
  consent: {
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
}

interface AnalyticsContextType {
  state: AnalyticsState;
  trackPageView: (title?: string) => void;
  trackInteraction: (interaction: Omit<UserInteraction, 'timestamp'>) => void;
  trackConversion: (conversion: Omit<ConversionEvent, 'sessionId' | 'timestamp'>) => void;
  updateConsent: (consent: Partial<AnalyticsState['consent']>) => void;
  enableTracking: () => void;
  disableTracking: () => void;
  getSessionMetrics: () => UserBehaviorMetrics | null;
  exportData: () => string;
  clearData: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();
  const [state, setState] = useState<AnalyticsState>({
    currentSession: null,
    currentPageView: null,
    pageViews: [],
    interactions: [],
    conversions: [],
    performanceMetrics: null,
    behaviorMetrics: null,
    isLoading: false,
    error: null,
    trackingEnabled: true,
    consent: {
      analytics: false, // Default to false for GDPR compliance
      marketing: false,
      personalization: false,
    },
  });

  // Generate session ID
  const generateSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('analytics-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics-session-id', sessionId);
    }
    return sessionId;
  }, []);

  // Get device information
  const getDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const device: UserSession['device'] = {
      type: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
      os: navigator.platform || 'Unknown',
      browser: navigator.userAgent.split(' ').slice(-2)[0] || 'Unknown',
      screen: {
        width: screen.width,
        height: screen.height,
      },
    };
    return device;
  }, []);

  // Get UTM parameters
  const getUTMParameters = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
    };
  }, []);

  // Initialize session
  const initializeSession = useCallback(() => {
    const sessionId = generateSessionId();
    const existingSession = localStorage.getItem('analytics-session-data');

    if (existingSession) {
      try {
        const sessionData = JSON.parse(existingSession);
        const session: UserSession = {
          ...sessionData,
          duration: Date.now() - new Date(sessionData.startTime).getTime(),
        };
        setState(prev => ({ ...prev, currentSession: session }));
        return session;
      } catch (error) {
        console.warn('Failed to parse existing session data:', error);
      }
    }

    const newSession: UserSession = {
      id: sessionId,
      startTime: new Date(),
      duration: 0,
      pageViews: 1,
      bounce: false,
      exitPage: '',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      utm: getUTMParameters(),
      device: getDeviceInfo(),
    };

    setState(prev => ({ ...prev, currentSession: newSession }));
    localStorage.setItem('analytics-session-data', JSON.stringify(newSession));

    return newSession;
  }, [generateSessionId, getUTMParameters, getDeviceInfo]);

  // Track page view
  const trackPageView = useCallback((title?: string) => {
    if (!state.trackingEnabled || !state.consent.analytics || !state.currentSession) return;

    const pageView: PageView = {
      sessionId: state.currentSession.id,
      url: window.location.pathname,
      title: title || document.title,
      timestamp: new Date(),
      timeOnPage: 0,
      scrollDepth: 0,
      interactions: [],
      exit: false,
    };

    setState(prev => ({
      ...prev,
      currentPageView: pageView,
      pageViews: [...prev.pageViews, pageView],
      currentSession: prev.currentSession
        ? {
            ...prev.currentSession,
            pageViews: prev.currentSession.pageViews + 1,
          }
        : null,
    }));

    // Update session bounce status
    if (state.pageViews.length > 0) {
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession
          ? { ...prev.currentSession, bounce: false }
          : null,
      }));
    }

    console.log('📊 Page view tracked:', pageView);
  }, [state.trackingEnabled, state.consent.analytics, state.currentSession, state.pageViews.length]);

  // Track user interaction
  const trackInteraction = useCallback((interaction: Omit<UserInteraction, 'timestamp'>) => {
    if (!state.trackingEnabled || !state.consent.analytics || !state.currentPageView) return;

    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      interactions: [...prev.interactions, fullInteraction],
      currentPageView: prev.currentPageView
        ? {
            ...prev.currentPageView,
            interactions: [...prev.currentPageView.interactions, fullInteraction],
          }
        : null,
    }));

    console.log('🖱️ Interaction tracked:', fullInteraction);
  }, [state.trackingEnabled, state.consent.analytics, state.currentPageView]);

  // Track conversion
  const trackConversion = useCallback((conversion: Omit<ConversionEvent, 'sessionId' | 'timestamp'>) => {
    if (!state.trackingEnabled || !state.consent.analytics || !state.currentSession) return;

    const fullConversion: ConversionEvent = {
      ...conversion,
      sessionId: state.currentSession.id,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      conversions: [...prev.conversions, fullConversion],
    }));

    console.log('💰 Conversion tracked:', fullConversion);

    // Send to analytics service (would integrate with Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', conversion.type, {
        event_category: 'conversion',
        value: conversion.value,
        currency: conversion.currency,
      });
    }
  }, [state.trackingEnabled, state.consent.analytics, state.currentSession]);

  // Update consent
  const updateConsent = useCallback((consent: Partial<AnalyticsState['consent']>) => {
    setState(prev => ({
      ...prev,
      consent: { ...prev.consent, ...consent },
    }));

    localStorage.setItem('analytics-consent', JSON.stringify({ ...state.consent, ...consent }));
  }, [state.consent]);

  // Enable tracking
  const enableTracking = useCallback(() => {
    setState(prev => ({ ...prev, trackingEnabled: true }));
  }, []);

  // Disable tracking
  const disableTracking = useCallback(() => {
    setState(prev => ({ ...prev, trackingEnabled: false }));
  }, []);

  // Calculate session metrics
  const getSessionMetrics = useCallback((): UserBehaviorMetrics | null => {
    if (state.pageViews.length === 0) return null;

    const sessions = new Set(state.pageViews.map(pv => pv.sessionId)).size;
    const avgSessionDuration = state.pageViews.reduce((acc, pv) => acc + pv.timeOnPage, 0) / state.pageViews.length;
    const bounceRate = state.pageViews.filter(pv => pv.interactions.length === 0).length / state.pageViews.length;
    const pagesPerSession = state.pageViews.length / sessions;
    const returnVisitorRate = 0; // Would calculate based on returning users

    // Top pages analysis
    const pageStats = state.pageViews.reduce((acc, pv) => {
      if (!acc[pv.url]) {
        acc[pv.url] = { views: 0, totalTime: 0, bounces: 0 };
      }
      acc[pv.url].views++;
      acc[pv.url].totalTime += pv.timeOnPage;
      if (pv.interactions.length === 0) acc[pv.url].bounces++;
      return acc;
    }, {} as Record<string, { views: number; totalTime: number; bounces: number }>);

    const topPages = Object.entries(pageStats)
      .map(([url, stats]) => ({
        url,
        views: stats.views,
        avgTimeOnPage: stats.totalTime / stats.views,
        bounceRate: stats.bounces / stats.views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // User flow analysis
    const userFlow: UserBehaviorMetrics['userFlow'] = [];
    for (let i = 0; i < state.pageViews.length - 1; i++) {
      const current = state.pageViews[i];
      const next = state.pageViews[i + 1];
      if (current.sessionId === next.sessionId) {
        userFlow.push({
          from: current.url,
          to: next.url,
          count: 1,
          dropOffRate: 0,
        });
      }
    }

    return {
      avgSessionDuration,
      bounceRate,
      pagesPerSession,
      returnVisitorRate,
      conversionRate: state.conversions.length / state.pageViews.length,
      topPages,
      userFlow,
    };
  }, [state.pageViews, state.conversions]);

  // Export analytics data
  const exportData = useCallback(() => {
    const exportData = {
      session: state.currentSession,
      pageViews: state.pageViews,
      interactions: state.interactions,
      conversions: state.conversions,
      metrics: getSessionMetrics(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  }, [state, getSessionMetrics]);

  // Clear analytics data
  const clearData = useCallback(() => {
    setState(prev => ({
      ...prev,
      pageViews: [],
      interactions: [],
      conversions: [],
      behaviorMetrics: null,
      currentSession: null,
      currentPageView: null,
    }));

    localStorage.removeItem('analytics-session-data');
    sessionStorage.removeItem('analytics-session-id');
  }, []);

  // Collect performance metrics
  const collectPerformanceMetrics = useCallback(() => {
    if (!state.trackingEnabled) return;

    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      const metrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0, // Would need PerformanceObserver for LCP
        firstInputDelay: 0, // Would need PerformanceObserver for FID
        cumulativeLayoutShift: 0, // Would need PerformanceObserver for CLS
        timeToInteractive: navigation.domInteractive - navigation.navigationStart,
      };

      setState(prev => ({ ...prev, performanceMetrics: metrics }));
    }
  }, [state.trackingEnabled]);

  // Initialize on mount
  useEffect(() => {
    // Load consent from localStorage
    const savedConsent = localStorage.getItem('analytics-consent');
    if (savedConsent) {
      try {
        const consent = JSON.parse(savedConsent);
        setState(prev => ({ ...prev, consent }));
      } catch (error) {
        console.warn('Failed to parse saved consent:', error);
      }
    }

    // Initialize session
    initializeSession();

    // Collect performance metrics
    setTimeout(collectPerformanceMetrics, 3000);
  }, [initializeSession, collectPerformanceMetrics]);

  // Track page views on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      trackPageView();
    }, 100); // Allow page to render

    return () => clearTimeout(timer);
  }, [location.pathname, trackPageView]);

  // Track scroll depth
  useEffect(() => {
    if (!state.trackingEnabled || !state.consent.analytics) return;

    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollDepth = Math.round((scrollPosition / scrollHeight) * 100);

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track scroll milestones
        if (scrollDepth === 25 || scrollDepth === 50 || scrollDepth === 75 || scrollDepth === 90) {
          trackInteraction({
            type: 'scroll',
            element: 'document',
            value: scrollDepth,
            metadata: { milestone: scrollDepth },
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state.trackingEnabled, state.consent.analytics, trackInteraction]);

  // Update behavior metrics
  useEffect(() => {
    const metrics = getSessionMetrics();
    setState(prev => ({ ...prev, behaviorMetrics: metrics }));
  }, [getSessionMetrics]);

  // Handle page unload
  useEffect(() => {
    const handleUnload = () => {
      if (state.currentSession) {
        const updatedSession = {
          ...state.currentSession,
          duration: Date.now() - new Date(state.currentSession.startTime).getTime(),
          exitPage: window.location.pathname,
        };
        localStorage.setItem('analytics-session-data', JSON.stringify(updatedSession));
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [state.currentSession]);

  const value: AnalyticsContextType = {
    state,
    trackPageView,
    trackInteraction,
    trackConversion,
    updateConsent,
    enableTracking,
    disableTracking,
    getSessionMetrics: getSessionMetrics,
    exportData,
    clearData,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsState = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsState must be used within an AnalyticsProvider');
  }
  return context;
};

export default AnalyticsProvider;