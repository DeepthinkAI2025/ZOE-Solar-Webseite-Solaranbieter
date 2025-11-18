/**
 * Zentralisierte Konstanten für die ZOE Solar Anwendung
 *
 * Enthält alle wichtigen Konstanten, Konfigurationswerte und Enums
 * an einem Ort für bessere Wartbarkeit und Konsistenz.
 */

// =============================================================================
// APPLICATION METADATA
// =============================================================================

export const APP_CONFIG = {
  NAME: 'ZOE Solar',
  VERSION: process.env.REACT_APP_VERSION || '2.0.0',
  DESCRIPTION: 'Ihr Experte für Photovoltaik, E-Mobilität und Elektrotechnik',
  AUTHOR: 'ZOE Solar GmbH',
  HOMEPAGE: 'https://zoe-solar.de',
  REPOSITORY: 'https://github.com/zoe-solar/webseite',
  BUILD_DATE: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

// =============================================================================
// CONTACT & BUSINESS INFORMATION
// =============================================================================

export const BUSINESS_INFO = {
  COMPANY: {
    NAME: 'ZOE Solar GmbH',
    LEGAL_FORM: 'GmbH',
    ADDRESS: {
      STREET: 'Musterstraße 1',
      CITY: 'Berlin',
      ZIP: '10115',
      COUNTRY: 'DE',
    },
    CONTACT: {
      PHONE: '+49-30-1234567',
      PHONE_CLEAN: '+49301234567',
      EMAIL: 'info@zoe-solar.de',
      WEBSITE: 'https://zoe-solar.de',
    },
    TAX: {
      VAT_ID: 'DE123456789',
      TAX_NUMBER: '123/456/78910',
    },
    REGISTRATION: {
      COMMERCIAL_REGISTER: 'Berlin Charlottenburg',
      REGISTRATION_NUMBER: 'HRB 123456 B',
    },
    MANAGEMENT: [
      'Max Mustermann',
      'Erika Mustermann',
    ],
  },
  SERVICE_AREAS: [
    {
      name: 'Berlin',
      region: 'Bundesland',
      zipCodes: ['10115', '10117', '10119', '10178', '10179'],
      coordinates: { lat: 52.5200, lng: 13.4050 },
    },
    {
      name: 'Brandenburg',
      region: 'Bundesland',
      zipCodes: ['14467', '14469', '14471', '14473'],
      coordinates: { lat: 52.4125, lng: 12.5316 },
    },
    {
      name: 'Bayern',
      region: 'Bundesland',
      zipCodes: ['80331', '80333', '80335', '80336', '80337'],
      coordinates: { lat: 48.7904, lng: 11.4979 },
    },
  ],
  BUSINESS_HOURS: {
    WEEKDAYS: 'Mo-Fr 09:00-18:00',
    SATURDAY: 'Geschlossen',
    SUNDAY: 'Geschlossen',
    HOLIDAYS: 'Geschlossen',
  },
} as const;

// =============================================================================
// SEO & WEB PERFORMANCE
// =============================================================================

export const SEO_CONFIG = {
  DEFAULT_TITLE: 'ZOE Solar GmbH - Photovoltaik, E-Mobilität & Elektrotechnik',
  DEFAULT_DESCRIPTION: 'Ihr Experte für Photovoltaikanlagen, E-Mobilität und Elektroinstallationen in Berlin, Brandenburg und Bayern. Beratung, Planung und Installation aus einer Hand.',
  KEYWORDS: [
    'Photovoltaik',
    'Solaranlage',
    'E-Mobilität',
    'E-Ladestation',
    'Elektroinstallation',
    'Solar Berlin',
    'Photovoltaik Brandenburg',
    'Solarenergie',
    'Nachhaltigkeit',
    'Erneuerbare Energien',
    'KfW Förderung',
    'Agri-PV',
  ],
  OPEN_GRAPH: {
    TYPE: 'website',
    LOCALE: 'de_DE',
    SITE_NAME: APP_CONFIG.NAME,
  },
  TWITTER_CARD: {
    CARD: 'summary_large_image',
    SITE: '@zoe_solar',
    CREATOR: '@zoe_solar',
  },
  ROBOTS: {
    DEFAULT: 'index,follow',
    NOINDEX: 'noindex,nofollow',
  },
} as const;

// =============================================================================
// ROUTING & NAVIGATION
// =============================================================================

export const ROUTES = {
  HOME: '/',
  SERVICES: {
    MAIN: '/leistungen',
    PHOTOVOLTAIK: '/photovoltaik',
    E_MOBILITY: '/e-mobilitaet',
    ELECTRICAL: '/elektro',
  },
  COMPANY: {
    ABOUT: '/ueber-uns',
    TEAM: '/team',
    CONTACT: '/kontakt',
    CAREER: '/karriere',
    SUSTAINABILITY: '/nachhaltigkeit',
    PRESS: '/presse',
  },
  PRODUCTS: {
    OVERVIEW: '/produkte',
    MANUFACTURER: '/hersteller/:slug',
    USE_CASES: '/anwendungsfaelle',
    USE_CASE_DETAIL: '/anwendungsfaelle/:slug',
  },
  KNOWLEDGE: {
    FAQ: '/wissen/faq',
    TECHNOLOGY: '/technologie',
    GUIDES: '/leitfaden',
    GUIDE_DETAIL: '/leitfaden/:slug',
    NEWS: '/aktuelles',
    ARTICLE_DETAIL: '/artikel/:slug',
    MAGAZINE: '/magazin',
    WISSENS_HUB: '/wissens-hub',
    GLOSSARY: '/glossar',
  },
  RESIDENTIAL: {
    OVERVIEW: '/eigenheim',
    COSTS: '/eigenheim/kosten',
    SINGLE_FAMILY_COSTS: '/eigenheim/einfamilienhaus-kosten',
    PLANNING: '/eigenheim/planung',
    INSTALLATION: '/eigenheim/installation',
    ROOF_INSTALLATION: '/photovoltaik/installation-dach',
  },
  COMMERCIAL: {
    OVERVIEW: '/photovoltaik',
    INDUSTRY: '/photovoltaik/industrie',
    AGRICULTURE: '/photovoltaik/landwirtschaft',
    COMMERCIAL_BUILDINGS: '/photovoltaik/gewerbegebaeude',
    LOGISTICS: '/photovoltaik/logistikzentren',
    RETAIL: '/photovoltaik/einzelhandel',
    CALCULATOR: '/photovoltaik/rechner-gewerbe',
  },
  AGRICULTURAL: {
    OVERVIEW: '/agri-pv',
    EXPERIENCES: '/agri-pv-erfahrungen',
    BRANDENBURG: '/agri-pv/brandenburg',
    SACHSEN_ANHALT: '/agri-pv/sachsen-anhalt',
    NIEDERSACHSEN: '/agri-pv/niedersachsen',
    BAYERN: '/agri-pv/bayern',
    NORDRHEIN_WESTFALEN: '/agri-pv/nordrhein-westfalen',
  },
  FUNDING: {
    CHECK: '/foerdermittel-check',
    KFW: '/foerdermittel/kfw',
    IBB: '/foerdermittel/ibb',
    BAFA: '/foerdermittel/bafa',
  },
  FINANCIAL: {
    OVERVIEW: '/preise',
    FINANCING: '/finanzierung',
    PROMOTIONS: '/sonderaktionen',
    REFERRAL: '/empfehlungspraemie',
  },
  SERVICE_PAGES: {
    PHOTOVOLTAIK: '/service/photovoltaik',
    CHARGING_PARKS: '/service/ladeparks',
    STORAGE: '/service/speicher',
    PV_REGISTRATION: '/service/anmeldung-pv',
    CHARGING_REGISTRATION: '/service/anmeldung-ladestationen',
    GRID_CONNECTION: '/service/netzanschluss',
    DISTRIBUTION_BOARD: '/service/verteilerbau',
    METER_INSTALLATION: '/service/zaehlerbau',
  },
  CASE_STUDIES: {
    OVERVIEW: '/fallstudien',
    DETAIL: '/fallstudien/:slug',
  },
  LEGAL: {
    IMPRINT: '/impressum',
    PRIVACY: '/datenschutz',
    TERMS: '/agb',
  },
  USER: {
    LOGIN: '/login',
    EMPLOYEE_LOGIN: '/mitarbeiter-login',
    DASHBOARD: '/dashboard',
    DIY_HUB: '/diy-hub',
  },
  ADMIN: {
    SEO_MONITORING: '/seo-monitoring',
    STRATEGY_DASHBOARD: '/unified-strategy-dashboard',
    PREDICTIVE_CONTENT: '/admin/predictive-content',
    EDGE_COMPUTING: '/admin/edge-computing',
    MULTILINGUAL: '/admin/multilingual-expansion',
  },
} as const;

// =============================================================================
// USER INTERFACE & THEMING
// =============================================================================

export const UI_CONFIG = {
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out',
    },
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem',
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1100,
    POPOVER: 1200,
    TOOLTIP: 1300,
    NOTIFICATION: 1400,
    SKIP_LINKS: 9999,
  },
} as const;

// =============================================================================
// COLOR SCHEMES & BRANDING
// =============================================================================

export const BRAND_COLORS = {
  PRIMARY: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  SECONDARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  ACCENT: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
} as const;

// =============================================================================
// FORM VALIDATION & USER INPUT
// =============================================================================

export const VALIDATION_RULES = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[+]?[\d\s\-\(\)]+$/,
  ZIP_CODE_GERMANY: /^\d{5}$/,
  HOUSE_NUMBER: /^\d+[a-zA-Z]?$/,
  IBAN: /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)$/,
  NAME: /^[a-zA-ZäöüßÄÖÜ\s\-']+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
} as const;

export const FORM_LIMITS = {
  MESSAGE_MAX_LENGTH: 5000,
  SUBJECT_MAX_LENGTH: 200,
  NAME_MAX_LENGTH: 100,
  COMPANY_MAX_LENGTH: 200,
  STREET_MAX_LENGTH: 100,
  CITY_MAX_LENGTH: 100,
  MAX_UPLOAD_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
} as const;

// =============================================================================
// API & EXTERNAL SERVICES
// =============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ENDPOINTS: {
    CONTACT: '/contact',
    QUOTE: '/quote',
    NEWSLETTER: '/newsletter',
    SEARCH: '/search',
    PRODUCTS: '/products',
    CALCULATOR: '/calculator',
    FUNDING: '/funding',
    LOCATIONS: '/locations',
  },
} as const;

export const EXTERNAL_SERVICES = {
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GA_ID || 'G-XXXXXXXXXX',
  GOOGLE_TAG_MANAGER_ID: process.env.REACT_APP_GTM_ID || 'GTM-XXXXXXX',
  HOTJAR_ID: process.env.REACT_APP_HOTJAR_ID || '',
  CLARITY_ID: process.env.REACT_APP_CLARITY_ID || '',
  FACEBOOK_PIXEL_ID: process.env.REACT_APP_FB_PIXEL_ID || '',
  LINKEDIN_INSIGHT_TAG: process.env.REACT_APP_LI_INSIGHT_TAG || '',
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  THEME_PREFERENCES: 'theme-preferences',
  USER_CONSENT: 'user-consent',
  ANALYTICS_CONSENT: 'analytics-conssent',
  COMPARISON_LIST: 'comparison-list',
  RECENTLY_VIEWED: 'recently-viewed',
  SEARCH_HISTORY: 'search-history',
  FORM_DRAFTS: 'form-drafts',
  USER_PREFERENCES: 'user-preferences',
  SESSION_ID: 'session-id',
  ERROR_REPORTS: 'error-reports',
  SERVICE_WORKER_VERSION: 'sw-version',
} as const;

// =============================================================================
// PERFORMANCE & OPTIMIZATION
// =============================================================================

export const PERFORMANCE_CONFIG = {
  LAZY_LOADING: {
    IMAGE_THRESHOLD: 200,
    COMPONENT_THRESHOLD: 100,
    ROOT_MARGIN: '50px',
  },
  CACHING: {
    STATIC_ASSETS: 365 * 24 * 60 * 60, // 1 year in seconds
    API_RESPONSES: 5 * 60, // 5 minutes in seconds
    DYNAMIC_CONTENT: 60, // 1 minute in seconds
  },
  PRELOADING: {
    CRITICAL_RESOURCES: [
      '/fonts/inter-v12-latin-regular.woff2',
      '/fonts/inter-v12-latin-600.woff2',
      '/images/logo.svg',
    ],
    PRELOAD_STRATEGIES: [
      'dns-prefetch',
      'preconnect',
      'prefetch',
      'preload',
    ],
  },
  WEB_VITALS_THRESHOLDS: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint (ms)
    TTFB: 800, // Time to First Byte (ms)
  },
} as const;

// =============================================================================
// ERROR HANDLING & MONITORING
// =============================================================================

export const ERROR_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAYS: [1000, 2000, 4000], // Exponential backoff
  ERROR_BOUNDARY: {
    MAX_RETRIES: 3,
    COOLDOWN_PERIOD: 60000, // 1 minute
  },
  LOG_LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
  ERROR_REPORTING_ENABLED: process.env.NODE_ENV === 'production',
} as const;

// =============================================================================
// CONTENT & TEXT
// =============================================================================

export const CONTENT_CONFIG = {
  LOADING_MESSAGES: [
    'Laden...',
    'Einen Moment bitte...',
    'Daten werden verarbeitet...',
    'Fast fertig...',
    'Wird geladen...',
  ],
  ERROR_MESSAGES: {
    GENERIC: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
    NETWORK: 'Netzwerkverbindung unterbrochen. Bitte überprüfen Sie Ihre Internetverbindung.',
    VALIDATION: 'Bitte überprüfen Sie Ihre Eingaben.',
    NOT_FOUND: 'Die gesuchte Seite wurde nicht gefunden.',
    SERVER: 'Serverfehler. Bitte versuchen Sie es später erneut.',
  },
  SUCCESS_MESSAGES: {
    FORM_SUBMITTED: 'Ihre Nachricht wurde erfolgreich gesendet.',
    QUOTE_REQUESTED: 'Ihre Angebotsanfrage wurde erhalten.',
    NEWSLETTER_SUBSCRIBED: 'Sie wurden erfolgreich zum Newsletter angemeldet.',
  },
} as const;

// =============================================================================
// SOCIAL MEDIA & SHARING
// =============================================================================

export const SOCIAL_MEDIA = {
  PLATFORMS: {
    FACEBOOK: 'https://www.facebook.com/zoe.solar.gmbh',
    INSTAGRAM: 'https://www.instagram.com/zoe.solar/',
    LINKEDIN: 'https://www.linkedin.com/company/zoe-solar',
    YOUTUBE: 'https://www.youtube.com/c/zoesolar',
    XING: 'https://www.xing.com/company/zoe-solar-gmbh',
  },
  SHARE_URLS: {
    FACEBOOK: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    TWITTER: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    LINKEDIN: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    WHATSAPP: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    EMAIL: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
} as const;

// =============================================================================
// ENUMS & TYPES
// =============================================================================

export enum ThemeMode {
  DAY = 'day',
  NIGHT = 'night',
  SEASONAL = 'seasonal',
}

export enum AnimationLevel {
  NONE = 'none',
  BASIC = 'basic',
  ADVANCED = 'advanced',
  ENHANCED = 'enhanced',
}

export enum InteractionMode {
  STANDARD = 'standard',
  ACCESSIBLE = 'accessible',
  TOUCH_FRIENDLY = 'touch-friendly',
}

export enum ServiceCategory {
  PHOTOVOLTAIK = 'photovoltaik',
  E_MOBILITAET = 'e-mobilitaet',
  ELEKTRO = 'elektro',
  BERATUNG = 'beratung',
  WARTUNG = 'wartung',
}

export enum ProjectType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  AGRICULTURAL = 'agricultural',
  INDUSTRIAL = 'industrial',
}

export enum LeadSource {
  WEBSITE = 'website',
  PHONE = 'phone',
  EMAIL = 'email',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media',
  ADVERTISING = 'advertising',
  TRADE_SHOW = 'trade_show',
  OTHER = 'other',
}

// =============================================================================
// EXPORT ALL CONSTANTS
// =============================================================================

export default {
  APP_CONFIG,
  BUSINESS_INFO,
  SEO_CONFIG,
  ROUTES,
  UI_CONFIG,
  BRAND_COLORS,
  VALIDATION_RULES,
  FORM_LIMITS,
  API_CONFIG,
  EXTERNAL_SERVICES,
  STORAGE_KEYS,
  PERFORMANCE_CONFIG,
  ERROR_CONFIG,
  CONTENT_CONFIG,
  SOCIAL_MEDIA,
  ThemeMode,
  AnimationLevel,
  InteractionMode,
  ServiceCategory,
  ProjectType,
  LeadSource,
} as const;