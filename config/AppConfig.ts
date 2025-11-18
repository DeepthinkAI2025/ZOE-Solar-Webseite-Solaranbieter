/**
 * Zentralisierte Konfigurationsverwaltung für die ZOE Solar Anwendung
 *
 * Diese Datei verwaltet alle Umgebungsvariablen, Feature Flags und
 * Konfigurationseinstellungen für verschiedene Umgebungen.
 */

// =============================================================================
// ENVIRONMENT CONFIGURATION
// =============================================================================

export type Environment = 'development' | 'staging' | 'production';

export const getCurrentEnvironment = (): Environment => {
  const env = process.env.NODE_ENV;
  if (env === 'production') return 'production';
  if (process.env.REACT_APP_ENV === 'staging') return 'staging';
  return 'development';
};

// =============================================================================
// API CONFIGURATION
// =============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
  endpoints: {
    contact: string;
    quote: string;
    newsletter: string;
    search: string;
    products: string;
    calculator: string;
    funding: string;
    locations: string;
    appointments: string;
    analytics: string;
  };
}

const getApiConfig = (): ApiConfig => {
  const env = getCurrentEnvironment();

  const baseUrls = {
    development: 'http://localhost:3001/api',
    staging: 'https://staging-api.zoe-solar.de/api',
    production: 'https://api.zoe-solar.de/api',
  };

  return {
    baseUrl: process.env.REACT_APP_API_BASE_URL || baseUrls[env],
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.REACT_APP_API_RETRY_DELAY || '1000'),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Version': process.env.REACT_APP_VERSION || '2.0.0',
      'X-Client-Environment': env,
    },
    endpoints: {
      contact: '/contact',
      quote: '/quote',
      newsletter: '/newsletter',
      search: '/search',
      products: '/products',
      calculator: '/calculator',
      funding: '/funding',
      locations: '/locations',
      appointments: '/appointments',
      analytics: '/analytics',
    },
  };
};

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export interface FeatureFlags {
  // Core Features
  enableAiChat: boolean;
  enableComparisonTool: boolean;
  enableQuoteCalculator: boolean;
  enableAppointmentBooking: boolean;

  // Advanced Features
  enableVoiceInterface: boolean;
  enableARMode: boolean;
  enableGestureControl: boolean;
  enableEmotionDetection: boolean;

  // Analytics & Tracking
  enableGoogleAnalytics: boolean;
  enableHotjar: boolean;
  enableClarity: boolean;
  enableFacebookPixel: boolean;
  enableLinkedInInsight: boolean;

  // Performance Features
  enableServiceWorker: boolean;
  enableWebP: boolean;
  enableLazyLoading: boolean;
  enablePreloading: boolean;
  enableImageOptimization: boolean;

  // Content Features
  enableDynamicContent: boolean;
  enablePersonalization: boolean;
  enableABTesting: boolean;
  enableMultilingual: boolean;

  // SEO Features
  enableStructuredData: boolean;
  enableSitemapGeneration: boolean;
  enableCanonicalUrls: boolean;
  enableHreflangTags: boolean;

  // Social Features
  enableSocialSharing: boolean;
  enableComments: boolean;
  enableRatings: boolean;
  enableTestimonials: boolean;

  // Development Features
  enableDebugMode: boolean;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
  enableServiceWorkerDebug: boolean;
}

const getFeatureFlags = (): FeatureFlags => {
  const env = getCurrentEnvironment();

  // Default feature flags
  const defaults: FeatureFlags = {
    // Core Features
    enableAiChat: true,
    enableComparisonTool: true,
    enableQuoteCalculator: true,
    enableAppointmentBooking: true,

    // Advanced Features
    enableVoiceInterface: false,
    enableARMode: false,
    enableGestureControl: false,
    enableEmotionDetection: false,

    // Analytics & Tracking
    enableGoogleAnalytics: env === 'production',
    enableHotjar: env === 'production',
    enableClarity: false,
    enableFacebookPixel: env === 'production',
    enableLinkedInInsight: false,

    // Performance Features
    enableServiceWorker: env === 'production',
    enableWebP: true,
    enableLazyLoading: true,
    enablePreloading: true,
    enableImageOptimization: true,

    // Content Features
    enableDynamicContent: true,
    enablePersonalization: true,
    enableABTesting: false,
    enableMultilingual: false,

    // SEO Features
    enableStructuredData: true,
    enableSitemapGeneration: true,
    enableCanonicalUrls: true,
    enableHreflangTags: false,

    // Social Features
    enableSocialSharing: true,
    enableComments: false,
    enableRatings: true,
    enableTestimonials: true,

    // Development Features
    enableDebugMode: env === 'development',
    enableErrorReporting: env === 'production',
    enablePerformanceMonitoring: true,
    enableServiceWorkerDebug: env === 'development',
  };

  // Override with environment variables
  return {
    ...defaults,
    enableAiChat: process.env.REACT_APP_ENABLE_AI_CHAT === 'true',
    enableVoiceInterface: process.env.REACT_APP_ENABLE_VOICE_INTERFACE === 'true',
    enableARMode: process.env.REACT_APP_ENABLE_AR_MODE === 'true',
    enableGestureControl: process.env.REACT_APP_ENABLE_GESTURE_CONTROL === 'true',
    enableEmotionDetection: process.env.REACT_APP_ENABLE_EMOTION_DETECTION === 'true',
    enableGoogleAnalytics: process.env.REACT_APP_ENABLE_GA === 'true',
    enableHotjar: process.env.REACT_APP_ENABLE_HOTJAR === 'true',
    enableClarity: process.env.REACT_APP_ENABLE_CLARITY === 'true',
    enableFacebookPixel: process.env.REACT_APP_ENABLE_FB_PIXEL === 'true',
    enableLinkedInInsight: process.env.REACT_APP_ENABLE_LI_INSIGHT === 'true',
    enableServiceWorker: process.env.REACT_APP_ENABLE_SW === 'true',
    enablePersonalization: process.env.REACT_APP_ENABLE_PERSONALIZATION === 'true',
    enableABTesting: process.env.REACT_APP_ENABLE_AB_TESTING === 'true',
    enableMultilingual: process.env.REACT_APP_ENABLE_MULTILINGUAL === 'true',
    enableComments: process.env.REACT_APP_ENABLE_COMMENTS === 'true',
    enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  };
};

// =============================================================================
// ANALYTICS CONFIGURATION
// =============================================================================

export interface AnalyticsConfig {
  googleAnalytics: {
    enabled: boolean;
    trackingId: string;
    debugMode: boolean;
    anonymizeIp: boolean;
    sendPageView: boolean;
  };
  hotjar: {
    enabled: boolean;
    trackingId: string;
    snippetVersion: number;
  };
  clarity: {
    enabled: boolean;
    trackingId: string;
  };
  facebookPixel: {
    enabled: boolean;
    pixelId: string;
    advancedMatching: boolean;
  };
  linkedinInsight: {
    enabled: boolean;
    partnerId: string;
  };
  customEvents: {
    trackPageViews: boolean;
    trackClicks: boolean;
    trackForms: boolean;
    trackScrollDepth: boolean;
    trackVideoEngagement: boolean;
    trackDownloads: boolean;
  };
}

const getAnalyticsConfig = (): AnalyticsConfig => {
  const flags = getFeatureFlags();

  return {
    googleAnalytics: {
      enabled: flags.enableGoogleAnalytics,
      trackingId: process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX',
      debugMode: getCurrentEnvironment() === 'development',
      anonymizeIp: true,
      sendPageView: true,
    },
    hotjar: {
      enabled: flags.enableHotjar,
      trackingId: process.env.REACT_APP_HOTJAR_ID || '',
      snippetVersion: 6,
    },
    clarity: {
      enabled: flags.enableClarity,
      trackingId: process.env.REACT_APP_CLARITY_ID || '',
    },
    facebookPixel: {
      enabled: flags.enableFacebookPixel,
      pixelId: process.env.REACT_APP_FB_PIXEL_ID || '',
      advancedMatching: true,
    },
    linkedinInsight: {
      enabled: flags.enableLinkedInInsight,
      partnerId: process.env.REACT_APP_LI_INSIGHT_TAG || '',
    },
    customEvents: {
      trackPageViews: true,
      trackClicks: true,
      trackForms: true,
      trackScrollDepth: true,
      trackVideoEngagement: true,
      trackDownloads: true,
    },
  };
};

// =============================================================================
// PERFORMANCE CONFIGURATION
// =============================================================================

export interface PerformanceConfig {
  lazyLoading: {
    enabled: boolean;
    imageThreshold: number;
    componentThreshold: number;
    rootMargin: string;
  };
  caching: {
    staticAssets: number; // seconds
    apiResponses: number; // seconds
    dynamicContent: number; // seconds
  };
  preloading: {
    criticalResources: string[];
    prefetchPages: string[];
    prefetchDelay: number; // milliseconds
  };
  optimization: {
    enableImageOptimization: boolean;
    enableWebP: boolean;
    enableMinification: boolean;
    enableCompression: boolean;
    enableCDN: boolean;
  };
  thresholds: {
    lcp: number; // Largest Contentful Paint (ms)
    fid: number; // First Input Delay (ms)
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
  };
}

const getPerformanceConfig = (): PerformanceConfig => {
  return {
    lazyLoading: {
      enabled: true,
      imageThreshold: 200,
      componentThreshold: 100,
      rootMargin: '50px',
    },
    caching: {
      staticAssets: 365 * 24 * 60 * 60, // 1 year
      apiResponses: 5 * 60, // 5 minutes
      dynamicContent: 60, // 1 minute
    },
    preloading: {
      criticalResources: [
        '/fonts/inter-v12-latin-regular.woff2',
        '/fonts/inter-v12-latin-600.woff2',
        '/images/logo.svg',
      ],
      prefetchPages: [
        '/photovoltaik',
        '/kontakt',
        '/eigenheim',
      ],
      prefetchDelay: 2000,
    },
    optimization: {
      enableImageOptimization: true,
      enableWebP: true,
      enableMinification: getCurrentEnvironment() === 'production',
      enableCompression: getCurrentEnvironment() === 'production',
      enableCDN: getCurrentEnvironment() === 'production',
    },
    thresholds: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      fcp: 1800,
      ttfb: 800,
    },
  };
};

// =============================================================================
// CONTENT CONFIGURATION
// =============================================================================

export interface ContentConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  fallbackLanguage: string;
  contentRefreshInterval: number; // minutes
  maxAgeForCache: number; // minutes
  enableContentOptimization: boolean;
  enablePersonalization: boolean;
  enableABTesting: boolean;
  cdnUrl: string;
  imageQuality: {
    webp: number;
    jpeg: number;
    png: number;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    author: string;
    openGraph: {
      type: string;
      locale: string;
      siteName: string;
    };
    twitterCard: {
      card: string;
      site: string;
      creator: string;
    };
  };
}

const getContentConfig = (): ContentConfig => {
  return {
    defaultLanguage: 'de',
    supportedLanguages: ['de', 'en'],
    fallbackLanguage: 'de',
    contentRefreshInterval: 60,
    maxAgeForCache: 1440, // 24 hours
    enableContentOptimization: true,
    enablePersonalization: getFeatureFlags().enablePersonalization,
    enableABTesting: getFeatureFlags().enableABTesting,
    cdnUrl: process.env.REACT_APP_CDN_URL || '',
    imageQuality: {
      webp: 80,
      jpeg: 85,
      png: 90,
    },
    seo: {
      defaultTitle: 'ZOE Solar GmbH - Photovoltaik, E-Mobilität & Elektrotechnik',
      defaultDescription: 'Ihr Experte für Photovoltaikanlagen, E-Mobilität und Elektroinstallationen in Berlin, Brandenburg und Bayern.',
      keywords: [
        'Photovoltaik',
        'Solaranlage',
        'E-Mobilität',
        'E-Ladestation',
        'Elektroinstallation',
        'Solar Berlin',
        'Photovoltaik Brandenburg',
      ],
      author: 'ZOE Solar GmbH',
      openGraph: {
        type: 'website',
        locale: 'de_DE',
        siteName: 'ZOE Solar',
      },
      twitterCard: {
        card: 'summary_large_image',
        site: '@zoe_solar',
        creator: '@zoe_solar',
      },
    },
  };
};

// =============================================================================
// MAIN CONFIG OBJECT
// =============================================================================

export interface AppConfig {
  environment: Environment;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  version: string;
  buildDate: string;
  api: ApiConfig;
  features: FeatureFlags;
  analytics: AnalyticsConfig;
  performance: PerformanceConfig;
  content: ContentConfig;
}

const createAppConfig = (): AppConfig => {
  const environment = getCurrentEnvironment();

  return {
    environment,
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
    version: process.env.REACT_APP_VERSION || '2.0.0',
    buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
    api: getApiConfig(),
    features: getFeatureFlags(),
    analytics: getAnalyticsConfig(),
    performance: getPerformanceConfig(),
    content: getContentConfig(),
  };
};

// Export singleton config instance
export const appConfig = createAppConfig();

// Export convenience functions
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return appConfig.features[feature];
};

export const getApiUrl = (endpoint: string): string => {
  return `${appConfig.api.baseUrl}${appConfig.api.endpoints[endpoint as keyof typeof appConfig.api.endpoints] || endpoint}`;
};

export const isDebugEnabled = (): boolean => {
  return appConfig.features.enableDebugMode || appConfig.isDevelopment;
};

// Export default
export default appConfig;