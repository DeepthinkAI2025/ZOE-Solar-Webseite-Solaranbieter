/**
 * Google Analytics Enhanced Service für ZOE Solar
 *
 * Vollständige Implementierung mit GA4, Enhanced Ecommerce,
 * Custom Events und Performance Tracking für maximale Insights
 */

export interface AnalyticsConfig {
  measurementId: string;
  dataStreamIds: {
    web: string;
    app?: string;
  };
  customDimensions: {
    userType: string;
    customerType: string;
    serviceType: string;
    location: string;
    source: string;
  };
  conversionEvents: {
    contactFormSubmit: string;
    phoneCallClick: string;
    consultationRequest: string;
    quoteRequest: string;
    calculatorUsage: string;
  };
}

export interface AnalyticsEvent {
  name: string;
  parameters: Record<string, any>;
  userProperties?: Record<string, any>;
  timestamp?: number;
}

export interface EcommerceEvent {
  type: 'view_item_list' | 'select_item' | 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase';
  items: EcommerceItem[];
  value?: number;
  currency?: string;
  transaction_id?: string;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category?: string;
  sub_category?: string;
  price?: number;
  quantity?: number;
  location_id?: string;
}

class GoogleAnalyticsService {
  private config: AnalyticsConfig;
  private isInitialized = false;
  private userId: string | null = null;
  private sessionId: string | null = null;
  private pageViewData: Record<string, any> = {};

  constructor() {
    this.config = {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
      dataStreamIds: {
        web: process.env.NEXT_PUBLIC_GA_DATA_STREAM_WEB || 'XXXXXXXXXX'
      },
      customDimensions: {
        userType: 'custom_user_type',
        customerType: 'custom_customer_type',
        serviceType: 'custom_service_type',
        location: 'custom_location',
        source: 'custom_source'
      },
      conversionEvents: {
        contactFormSubmit: 'contact_form_submit',
        phoneCallClick: 'phone_call_click',
        consultationRequest: 'consultation_request',
        quoteRequest: 'quote_request',
        calculatorUsage: 'calculator_usage'
      }
    };

    this.initialize();
  }

  /**
   * Google Analytics initialisieren
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      // gtag script laden falls nicht vorhanden
      this.loadGtagScript();

      // Konfiguration setzen
      this.configureAnalytics();

      // Session tracking starten
      this.startSessionTracking();

      // Custom dimensions registrieren
      this.registerCustomDimensions();

      // Page tracking starten
      this.startPageTracking();

      // Enhanced Ecommerce aktivieren
      this.enableEnhancedEcommerce();

      // Performance tracking aktivieren
      this.enablePerformanceTracking();

      this.isInitialized = true;
      console.log('✅ Google Analytics Enhanced Service initialisiert');

    } catch (error) {
      console.error('❌ Google Analytics Initialisierung fehlgeschlagen:', error);
    }
  }

  /**
   * gtag Script laden
   */
  private loadGtagScript(): void {
    if (typeof gtag !== 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);

    // gtag Funktion initialisieren
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
  }

  /**
   * Analytics konfigurieren
   */
  private configureAnalytics(): void {
    gtag('js', new Date());
    gtag('config', this.config.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        [this.config.customDimensions.userType]: 'user_type',
        [this.config.customDimensions.customerType]: 'customer_type',
        [this.config.customDimensions.serviceType]: 'service_type',
        [this.config.customDimensions.location]: 'location',
        [this.config.customDimensions.source]: 'source'
      },
      send_page_view: false, // Manuelles Page Tracking
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true, // DSGVO-Konformität
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      transport_type: 'beacon'
    });

    // Enhanced Measurement aktivieren
    gtag('config', this.config.measurementId, {
      enhanced_measurement: {
        page_location: true,
        scroll: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true,
        form_interactions: true
      }
    });
  }

  /**
   * Session Tracking starten
   */
  private startSessionTracking(): void {
    // Session ID generieren oder aus Storage holen
    this.sessionId = this.getSessionId();

    // Session Start Event
    gtag('event', 'session_start', {
      session_id: this.sessionId,
      custom_parameter: 'solar_analytics'
    });

    // Session Duration tracking
    this.trackSessionDuration();
  }

  /**
   * Session ID abrufen oder generieren
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ga_session_id');

    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('ga_session_id', sessionId);
    }

    return sessionId;
  }

  /**
   * Session Duration tracken
   */
  private trackSessionDuration(): void {
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
      const duration = Math.round((Date.now() - startTime) / 1000);

      gtag('event', 'session_duration', {
        session_id: this.sessionId,
        custom_parameter: duration,
        event_category: 'engagement'
      });
    });

    // Heartbeat alle 30 Sekunden
    setInterval(() => {
      gtag('event', 'user_engagement', {
        session_id: this.sessionId,
        custom_parameter: 'heartbeat'
      });
    }, 30000);
  }

  /**
   * Custom Dimensions registrieren
   */
  private registerCustomDimensions(): void {
    // User Properties setzen
    this.setUserProperties();
  }

  /**
   * User Properties setzen
   */
  private setUserProperties(properties?: Record<string, any>): void {
    const defaultProperties = {
      user_type: 'visitor',
      customer_type: 'prospect',
      service_type: 'solar',
      location: this.detectLocation(),
      source: this.detectTrafficSource(),
      language: navigator.language,
      device_type: this.detectDeviceType(),
      browser: this.detectBrowser()
    };

    const finalProperties = { ...defaultProperties, ...properties };

    Object.entries(finalProperties).forEach(([key, value]) => {
      gtag('config', this.config.measurementId, {
        [key]: value
      });
    });
  }

  /**
   * Location detektieren
   */
  private detectLocation(): string {
    //Aus URL oder Storage
    const pathSegments = window.location.pathname.split('/');
    const locationSegment = pathSegments.find(segment =>
      ['berlin', 'muenchen', 'koeln', 'hamburg', 'frankfurt', 'stuttgart'].includes(segment.toLowerCase())
    );

    return locationSegment || 'deutschland';
  }

  /**
   * Traffic Source detektieren
   */
  private detectTrafficSource(): string {
    const utmSource = new URLSearchParams(window.location.search).get('utm_source');
    if (utmSource) return utmSource;

    const referrer = document.referrer;
    if (referrer.includes('google.com')) return 'google_organic';
    if (referrer.includes('bing.com')) return 'bing_organic';
    if (referrer.includes('facebook.com') || referrer.includes('fb.co')) return 'facebook';
    if (referrer.includes('linkedin.com')) return 'linkedin';
    if (referrer) return 'referral';

    return 'direct';
  }

  /**
   * Device Type detektieren
   */
  private detectDeviceType(): string {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  /**
   * Browser detektieren
   */
  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
    if (ua.includes('Firefox')) return 'firefox';
    if (ua.includes('Edg')) return 'edge';
    return 'other';
  }

  /**
   * Page Tracking starten
   */
  private startPageTracking(): void {
    // Initial Page View
    this.trackPageView();

    // Single Page App Navigation tracking
    this.trackPageNavigation();
  }

  /**
   * Page View tracken
   */
  private trackPageView(pagePath?: string, pageTitle?: string): void {
    const pageData = {
      page_path: pagePath || window.location.pathname,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      send_to: this.config.measurementId,
      session_id: this.sessionId
    };

    this.pageViewData = pageData;

    gtag('event', 'page_view', pageData);

    // Custom Page View Event für detailliertes Tracking
    gtag('event', 'page_view_detailed', {
      ...pageData,
      custom_parameter_1: this.detectPageCategory(),
      custom_parameter_2: this.detectContentSection(),
      custom_parameter_3: this.isUserAuthenticated()
    });
  }

  /**
   * Page Navigation bei SPAs tracken
   */
  private trackPageNavigation(): void {
    // History API überwachen für Single Page Applications
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state: any, title: string, url?: string | URL | null) {
      originalPushState.call(this, state, title, url);
      setTimeout(() => {
        if (window.location.href !== window.location.href) {
          // Verzögertes Tracking nach DOM Update
          setTimeout(() => {
            window.analytics?.trackPageView();
          }, 100);
        }
      }, 0);
    };

    history.replaceState = function(state: any, title: string, url?: string | URL | null) {
      originalReplaceState.call(this, state, title, url);
      setTimeout(() => {
        window.analytics?.trackPageView();
      }, 100);
    };

    window.addEventListener('popstate', () => {
      setTimeout(() => {
        window.analytics?.trackPageView();
      }, 100);
    });
  }

  /**
   * Page Category detektieren
   */
  private detectPageCategory(): string {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/photovoltaik') || path.includes('/solar')) return 'service_solar';
    if (path.includes('/speicher') || path.includes('/batterie')) return 'service_storage';
    if (path.includes('/e-mobilitaet') || path.includes('/ladestation')) return 'service_emobility';
    if (path.includes('/kontakt') || path.includes('/anfrage')) return 'conversion_contact';
    if (path.includes('/rechner') || path.includes('/calculator')) return 'tool_calculator';
    if (path.includes('/referenzen') || path.includes('/projekte')) return 'content_portfolio';
    if (path.includes('/wissen') || path.includes('/magazin')) return 'content_education';

    return 'general';
  }

  /**
   * Content Section detektieren
   */
  private detectContentSection(): string {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/berlin') || path.includes('/muenchen') || path.includes('/koeln')) return 'local';
    if (path.includes('/gewerbe') || path.includes('/unternehmen')) return 'business';
    if (path.includes('/privat') || path.includes('/eigenheim')) return 'private';
    if (path.includes('/agri') || path.includes('/landwirtschaft')) return 'agriculture';

    return 'general';
  }

  /**
   * User Authentication Status prüfen
   */
  private isUserAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }

  /**
   * Enhanced Ecommerce aktivieren
   */
  private enableEnhancedEcommerce(): void {
    // Ecommerce Settings
    gtag('config', this.config.measurementId, {
      currency: 'EUR',
      enable_idfa: false,
      enable_ecommerce: true
    });
  }

  /**
   * Performance Tracking aktivieren
   */
  private enablePerformanceTracking(): void {
    // Core Web Vitals tracking
    if ('PerformanceObserver' in window) {
      this.trackCoreWebVitals();
    }

    // Custom Performance Events
    this.trackCustomPerformance();
  }

  /**
   * Core Web Vitals tracken
   */
  private trackCoreWebVitals(): void {
    // LCP Tracking
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        gtag('event', 'web_vitals', {
          name: 'LCP',
          value: Math.round(lastEntry.startTime),
          event_category: 'performance',
          non_interaction: true
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) { /* LCP nicht unterstützt */ }

    // FID Tracking
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const entry = entries[0];

        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;

          gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(fid),
            event_category: 'performance',
            non_interaction: true
          });
        }
      }).observe({ entryTypes: ['first-input'] });
    } catch (e) { /* FID nicht unterstützt */ }

    // CLS Tracking
    try {
      let clsValue = 0;

      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();

        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(clsValue * 1000),
          event_category: 'performance',
          non_interaction: true
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (e) { /* CLS nicht unterstützt */ }
  }

  /**
   * Custom Performance Tracking
   */
  private trackCustomPerformance(): void {
    // Page Load Time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

      gtag('event', 'page_load_time', {
        value: Math.round(loadTime),
        event_category: 'performance',
        custom_parameter_1: this.detectPageCategory(),
        non_interaction: true
      });
    });

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

      gtag('event', 'dom_content_loaded', {
        value: Math.round(domLoadTime),
        event_category: 'performance',
        non_interaction: true
      });
    });
  }

  /**
   * User ID setzen (nach Login)
   */
  setUserId(userId: string): void {
    this.userId = userId;

    gtag('config', this.config.measurementId, {
      user_id: userId
    });

    gtag('event', 'login', {
      method: 'website',
      user_id: userId
    });
  }

  /**
   * Custom Event tracken
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) return;

    const eventData = {
      ...event.parameters,
      send_to: this.config.measurementId,
      session_id: this.sessionId
    };

    // User Properties für Event
    if (event.userProperties) {
      Object.entries(event.userProperties).forEach(([key, value]) => {
        gtag('config', this.config.measurementId, {
          [key]: value
        });
      });
    }

    gtag('event', event.name, eventData);
  }

  /**
   * Ecommerce Event tracken
   */
  trackEcommerceEvent(event: EcommerceEvent): void {
    if (!this.isInitialized) return;

    const eventData = {
      event_category: 'ecommerce',
      send_to: this.config.measurementId,
      session_id: this.sessionId
    };

    // Items hinzufügen
    if (event.items && event.items.length > 0) {
      eventData.items = event.items.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        item_category: item.category,
        item_sub_category: item.sub_category,
        price: item.price,
        quantity: item.quantity || 1,
        location_id: item.location_id
      }));
    }

    // Value und Currency
    if (event.value) {
      eventData.value = event.value;
    }
    if (event.currency) {
      eventData.currency = event.currency;
    }
    if (event.transaction_id) {
      eventData.transaction_id = event.transaction_id;
    }

    gtag('event', event.type, eventData);
  }

  /**
   * Kontaktformular-Submit tracken
   */
  trackContactFormSubmit(formData: Record<string, any>): void {
    this.trackEvent({
      name: this.config.conversionEvents.contactFormSubmit,
      parameters: {
        form_type: formData.formType || 'contact',
        customer_type: formData.customerType || 'prospect',
        service_interest: formData.serviceInterest || 'general',
        location: formData.location || this.detectLocation(),
        value: 25.00, // Geschätzter Wert
        currency: 'EUR'
      },
      userProperties: {
        customer_type: formData.customerType || 'prospect'
      }
    });

    // Conversion Label für Google Ads (falls vorhanden)
    gtag('event', 'conversion', {
      send_to: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXXXX',
      value: 25.00,
      currency: 'EUR'
    });
  }

  /**
   * Telefonanruf-Klick tracken
   */
  trackPhoneCallClick(phoneNumber: string): void {
    this.trackEvent({
      name: this.config.conversionEvents.phoneCallClick,
      parameters: {
        phone_number: phoneNumber.replace(/[^0-9+]/g, ''), // Nur Nummern
        page_location: window.location.pathname,
        value: 50.00, // Geschätzter Wert
        currency: 'EUR'
      }
    });
  }

  /**
   * Beratungsanfrage tracken
   */
  trackConsultationRequest(requestData: Record<string, any>): void {
    this.trackEvent({
      name: this.config.conversionEvents.consultationRequest,
      parameters: {
        consultation_type: requestData.type || 'general',
        customer_type: requestData.customerType || 'business',
        estimated_project_size: requestData.projectSize || 'unknown',
        location: requestData.location || this.detectLocation(),
        value: 75.00,
        currency: 'EUR'
      }
    });
  }

  /**
   * Solarrechner-Nutzung tracken
   */
  trackCalculatorUsage(calculatorData: Record<string, any>): void {
    this.trackEvent({
      name: this.config.conversionEvents.calculatorUsage,
      parameters: {
        calculator_type: calculatorData.type || 'solar',
        system_size_kw: calculatorData.systemSize,
        estimated_savings: calculatorData.savings,
        location: calculatorData.location || this.detectLocation(),
        completion_rate: calculatorData.completionRate || 100,
        value: 15.00,
        currency: 'EUR'
      }
    });

    // Ecommerce: Service ansehen
    this.trackEcommerceEvent({
      type: 'view_item',
      items: [{
        item_id: `solar-calculator-${calculatorData.systemSize || 'unknown'}`,
        item_name: 'Solaranlage Berechnung',
        category: 'Service',
        sub_category: 'Solar',
        price: calculatorData.estimatedPrice || 0,
        location_id: calculatorData.location || this.detectLocation()
      }]
    });
  }

  /**
   * Angebotsanfrage tracken
   */
  trackQuoteRequest(quoteData: Record<string, any>): void {
    this.trackEvent({
      name: this.config.conversionEvents.quoteRequest,
      parameters: {
        service_type: quoteData.serviceType || 'solar',
        customer_type: quoteData.customerType || 'business',
        system_size: quoteData.systemSize,
        estimated_value: quoteData.estimatedValue,
        location: quoteData.location || this.detectLocation(),
        value: quoteData.estimatedValue ? quoteData.estimatedValue * 0.1 : 100.00,
        currency: 'EUR'
      }
    });

    // Ecommerce: Zum Warenkorb hinzufügen
    this.trackEcommerceEvent({
      type: 'add_to_cart',
      items: [{
        item_id: quoteData.serviceType || 'solar-installation',
        item_name: quoteData.serviceName || 'Solarinstallation',
        category: 'Service',
        sub_category: quoteData.customerType || 'business',
        price: quoteData.estimatedValue || 0,
        quantity: 1,
        location_id: quoteData.location || this.detectLocation()
      }],
      value: quoteData.estimatedValue || 0,
      currency: 'EUR'
    });
  }

  /**
   * Social Media Interactions tracken
   */
  trackSocialInteraction(network: string, action: string, target: string): void {
    this.trackEvent({
      name: 'social_interaction',
      parameters: {
        social_network: network,
        social_action: action,
        social_target: target,
        page_location: window.location.pathname
      }
    });
  }

  /**
   * Downloads tracken
   */
  trackDownload(fileUrl: string, fileName: string, fileType: string): void {
    this.trackEvent({
      name: 'file_download',
      parameters: {
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        link_text: fileName,
        link_url: fileUrl
      }
    });
  }

  /**
   * Video Interactions tracken
   */
  trackVideoInteraction(videoUrl: string, action: 'play' | 'pause' | 'complete', videoDuration?: number): void {
    this.trackEvent({
      name: 'video_interaction',
      parameters: {
        video_url: videoUrl,
        video_action: action,
        video_duration: videoDuration,
        video_percent: action === 'complete' ? 100 : undefined,
        page_location: window.location.pathname
      }
    });
  }

  /**
   * Search Events tracken
   */
  trackSearch(searchTerm: string, resultsCount?: number, category?: string): void {
    this.trackEvent({
      name: 'search',
      parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
        search_category: category,
        page_location: window.location.pathname
      }
    });
  }

  /**
   * User Engagement tracken
   */
  trackEngagement(type: 'scroll' | 'dwell_time' | 'form_focus', data?: Record<string, any>): void {
    this.trackEvent({
      name: 'user_engagement',
      parameters: {
        engagement_type: type,
        ...data,
        page_location: window.location.pathname
      }
    });
  }

  /**
   * Error Tracking
   */
  trackError(error: Error | string, context?: string): void {
    this.trackEvent({
      name: 'error',
      parameters: {
        error_message: typeof error === 'string' ? error : error.message,
        error_context: context || 'general',
        page_location: window.location.pathname,
        user_agent: navigator.userAgent
      }
    });
  }

  /**
   * Custom Conversion tracken
   */
  trackConversion(conversionType: string, value: number, currency: string = 'EUR', additionalData?: Record<string, any>): void {
    this.trackEvent({
      name: 'conversion',
      parameters: {
        conversion_type: conversionType,
        value: value,
        currency: currency,
        ...additionalData
      }
    });
  }

  /**
   * Debug-Modus für Entwicklung
   */
  enableDebugMode(): void {
    if (typeof window !== 'undefined' && location.hostname === 'localhost') {
      gtag('config', this.config.measurementId, {
        debug_mode: true
      });
    }
  }

  /**
   * Analytics deaktivieren (DSGVO)
   */
  disable(): void {
    if (typeof window !== 'undefined') {
      window['ga-disable-' + this.config.measurementId] = true;
    }
  }

  /**
   * Analytics wieder aktivieren
   */
  enable(): void {
    if (typeof window !== 'undefined') {
      window['ga-disable-' + this.config.measurementId] = false;
    }
  }

  /**
   * Opt-out Link erzeugen
   */
  createOptOutLink(): string {
    return `javascript:window['ga-disable-${this.config.measurementId}']=true;alert('Google Analytics wurde deaktiviert.');`;
  }

  /**
   * Current User Properties abrufen
   */
  getCurrentUserProperties(): Record<string, any> {
    return {
      user_type: 'visitor',
      customer_type: 'prospect',
      service_type: 'solar',
      location: this.detectLocation(),
      source: this.detectTrafficSource(),
      language: navigator.language,
      device_type: this.detectDeviceType(),
      browser: this.detectBrowser()
    };
  }

  /**
   * Session Informationen abrufen
   */
  getSessionInfo(): Record<string, any> {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      page_path: window.location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      user_agent: navigator.userAgent
    };
  }
}

// Singleton-Instanz erstellen und global verfügbar machen
const googleAnalyticsService = new GoogleAnalyticsService();

// Global für einfachen Zugriff
if (typeof window !== 'undefined') {
  window.analytics = googleAnalyticsService;
}

export default googleAnalyticsService;

// Types für globale Erweiterung
declare global {
  interface Window {
    analytics: typeof googleAnalyticsService;
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: any[];
  }
}