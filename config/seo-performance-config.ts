/**
 * SEO Performance Optimization Configuration für ZOE Solar
 *
 * Fokussiert auf Core Web Vitals und technische SEO-Optimierung
 * ohne übermäßige Komplexität
 */

export interface PerformanceConfig {
  // Core Web Vitals Optimierung
  coreWebVitals: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    resourceHints: boolean;
    criticalCSS: boolean;
    fontOptimization: boolean;
  };

  // Bundle Optimierung
  bundling: {
    codeSplitting: boolean;
    treeShaking: boolean;
    minification: boolean;
    compression: boolean;
    chunkSizeLimit: number; // bytes
  };

  // Caching Strategie
  caching: {
    staticAssets: number; // days
    apiResponses: number; // minutes
    images: number; // days
    fonts: number; // days
  };

  // Mobile Optimierung
  mobile: {
    touchOptimization: boolean;
    responsiveImages: boolean;
    simplifiedNavigation: boolean;
    reducedMotion: boolean;
  };
}

export const performanceConfig: PerformanceConfig = {
  coreWebVitals: {
    lazyLoading: true,
    imageOptimization: true,
    resourceHints: true,
    criticalCSS: true,
    fontOptimization: true,
  },

  bundling: {
    codeSplitting: true,
    treeShaking: true,
    minification: true,
    compression: true,
    chunkSizeLimit: 244 * 1024, // 244KB
  },

  caching: {
    staticAssets: 365, // 1 Jahr
    apiResponses: 15, // 15 Minuten
    images: 90, // 3 Monate
    fonts: 365, // 1 Jahr
  },

  mobile: {
    touchOptimization: true,
    responsiveImages: true,
    simplifiedNavigation: true,
    reducedMotion: true,
  },
};

// Core Web Vitals Zielwerte
export const coreWebVitalsTargets = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  TTI: { good: 3800, needsImprovement: 7300 }, // Time to Interactive (ms)
};

// Deutsche SEO-spezifische Konfiguration
export const germanSEOConfig = {
  language: 'de-DE',
  region: 'DE',
  hreflangs: ['de-DE', 'de-AT', 'de-CH'],
  localBusinessCategories: [
    'SolarEnergyContractor',
    'Electrician',
    'HomeEnergyService',
  ],
  keywords: {
    primary: [
      'Solaranlagen',
      'Photovoltaik',
      'Solarförderung',
      'Stromspeicher',
      'Solarstrom',
    ],
    local: [
      'Solaranlagen [stadt]',
      'Photovoltaik [region]',
      'Solar Installateur [ortsname]',
    ],
    commercial: [
      'Gewerbliche Solaranlagen',
      'Solar für Unternehmen',
      'Photovoltaik Gewerbe',
    ],
  },
};

// Resource Hints für kritische Ressourcen
export const resourceHints = {
  preconnect: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
  ],
  dnsPrefetch: [
    'https://www.google-analytics.com',
    'https://fonts.gstatic.com',
  ],
  preload: [
    // Critical fonts
    '/fonts/poppins-v20-latin-regular.woff2',
    '/fonts/poppins-v20-latin-600.woff2',
    // Critical CSS
    '/css/critical.css',
    // Hero images
    '/images/hero-solar.webp',
  ],
};

// Image Optimierung Konfiguration
export const imageOptimizationConfig = {
  formats: ['webp', 'avif'],
  quality: {
    webp: 80,
    avif: 75,
    fallback: 85,
  },
  responsive: {
    breakpoints: [640, 768, 1024, 1280, 1536],
    sizes: {
      hero: '(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 80vw',
      card: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
      gallery: '(max-width: 768px) 100vw, 50vw',
    },
  },
  lazyLoading: {
    enabled: true,
    threshold: 50,
    rootMargin: '50px',
  },
};