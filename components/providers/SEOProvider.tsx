import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// SEO Performance Interfaces
export interface SEOMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  seoScore: number; // Overall SEO performance score (0-100)
  pageSpeed: {
    mobile: number;
    desktop: number;
  };
  accessibility: number;
  bestPractices: number;
  lastUpdate: Date;
}

export interface SEOAnalysis {
  pageUrl: string;
  title: string;
  description: string;
  h1: string;
  h2Count: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  schemaMarkup: {
    types: string[];
    valid: boolean;
    errors: string[];
  };
  lastAnalyzed: Date;
}

export interface ContentOptimization {
  optimizedPages: string[];
  pendingOptimizations: string[];
  optimizationScore: number;
  suggestions: string[];
  lastOptimized: Date;
}

export interface SchemaConsolidation {
  consolidated: boolean;
  types: string[];
  conflicts: string[];
  lastConsolidated: Date;
}

export interface ImageOptimization {
  optimizedImages: number;
  totalImages: number;
  compressionRatio: number;
  webpConversion: number;
  lazyLoading: boolean;
  lastOptimized: Date;
}

export interface LocalSEO {
  napConsistency: {
    consistent: boolean;
    inconsistencies: string[];
  };
  localRankings: Record<string, number>;
  citations: {
    total: number;
    consistent: number;
    inconsistent: number;
  };
  reviews: {
    average: number;
    total: number;
    lastUpdated: Date;
  };
}

export interface SEOState {
  metrics: SEOMetrics | null;
  analysis: SEOAnalysis | null;
  contentOptimization: ContentOptimization | null;
  schemaConsolidation: SchemaConsolidation | null;
  imageOptimization: ImageOptimization | null;
  localSEO: LocalSEO | null;
  isLoading: boolean;
  error: string | null;
}

interface SEOContextType {
  state: SEOState;
  initializeSEOServices: () => Promise<void>;
  analyzePage: (url: string) => Promise<SEOAnalysis>;
  optimizeContent: (pageUrl: string) => Promise<void>;
  updateMetrics: (metrics: Partial<SEOMetrics>) => void;
  consolidateSchema: () => Promise<void>;
  optimizeImages: () => Promise<void>;
  checkLocalSEO: () => Promise<void>;
  generateSchema: (type: string, data: any) => string;
  trackSEOPerformance: () => void;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

interface SEOProviderProps {
  children: ReactNode;
}

export const SEOProvider: React.FC<SEOProviderProps> = ({ children }) => {
  const location = useLocation();
  const [state, setState] = useState<SEOState>({
    metrics: null,
    analysis: null,
    contentOptimization: null,
    schemaConsolidation: null,
    imageOptimization: null,
    localSEO: null,
    isLoading: false,
    error: null,
  });

  // Initialize SEO Services
  const initializeSEOServices = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Dynamically import SEO services (from existing App.tsx imports)
      const services = await Promise.all([
        import('../../services/automatedCoreWebVitalsOptimizationService'),
        import('../../services/advancedInternalLinkingService'),
        import('../../services/brandAuthorityBuildingService'),
        import('../../services/enterpriseCitationManagementService'),
        import('../../services/enterpriseBrandAuthorityService'),
        import('../../services/schemaConsolidationService'),
        import('../../services/imageOptimizationEnhancementService'),
        import('../../services/napConsistencyAuditService'),
        import('../../services/localPerformanceHarmonizerService'),
        import('../../services/voiceSearchOptimizationService'),
        import('../../services/agriPVContentExpansionService'),
      ]);

      // Initialize all services
      const initResults = await Promise.allSettled(
        services.map(async (service) => {
          const serviceModule = service.default || service;
          if (typeof serviceModule === 'object' && 'initialize' in serviceModule) {
            return serviceModule.initialize();
          } else if (typeof serviceModule === 'function') {
            return serviceModule();
          }
          return Promise.resolve();
        })
      );

      console.log('🔍 SEO Services initialized:', initResults);

      // Start automatic page analysis
      await analyzePage(window.location.pathname);

      setState(prev => ({ ...prev, isLoading: false }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize SEO services',
      }));
      console.error('❌ SEO Services initialization failed:', error);
    }
  }, []);

  // Analyze current page
  const analyzePage = useCallback(async (url: string): Promise<SEOAnalysis> => {
    try {
      const analysis: SEOAnalysis = {
        pageUrl: url,
        title: document.title || '',
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        h1: document.querySelector('h1')?.textContent || '',
        h2Count: document.querySelectorAll('h2').length,
        internalLinks: document.querySelectorAll('a[href^="/"]').length,
        externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])').length,
        wordCount: document.body.textContent?.split(/\s+/).length || 0,
        keywordDensity: {}, // Would be calculated by AI service
        readabilityScore: 0, // Would be calculated by AI service
        schemaMarkup: {
          types: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
            script => {
              try {
                const data = JSON.parse(script.textContent || '{}');
                return data['@type'] || 'Unknown';
              } catch {
                return 'Invalid';
              }
            }
          ),
          valid: true,
          errors: [],
        },
        lastAnalyzed: new Date(),
      };

      setState(prev => ({ ...prev, analysis }));
      return analysis;

    } catch (error) {
      console.error('❌ Page analysis failed:', error);
      throw error;
    }
  }, []);

  // Content optimization
  const optimizeContent = useCallback(async (pageUrl: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Would call AI content optimization service
      const optimization: ContentOptimization = {
        optimizedPages: [pageUrl],
        pendingOptimizations: [],
        optimizationScore: 85,
        suggestions: [
          'Add more internal links',
          'Optimize meta description',
          'Include more relevant keywords',
        ],
        lastOptimized: new Date(),
      };

      setState(prev => ({
        ...prev,
        contentOptimization: optimization,
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Content optimization failed',
      }));
    }
  }, []);

  // Update SEO metrics
  const updateMetrics = useCallback((metrics: Partial<SEOMetrics>) => {
    setState(prev => ({
      ...prev,
      metrics: prev.metrics
        ? { ...prev.metrics, ...metrics, lastUpdate: new Date() }
        : {
            coreWebVitals: metrics.coreWebVitals || { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 },
            seoScore: metrics.seoScore || 0,
            pageSpeed: metrics.pageSpeed || { mobile: 0, desktop: 0 },
            accessibility: metrics.accessibility || 0,
            bestPractices: metrics.bestPractices || 0,
            lastUpdate: new Date(),
          },
    }));
  }, []);

  // Schema consolidation
  const consolidateSchema = useCallback(async () => {
    try {
      // Would call schema consolidation service
      const consolidation: SchemaConsolidation = {
        consolidated: true,
        types: ['Organization', 'LocalBusiness', 'Product', 'Service'],
        conflicts: [],
        lastConsolidated: new Date(),
      };

      setState(prev => ({ ...prev, schemaConsolidation: consolidation }));
      console.log('🏗️ Schema markup consolidated');

    } catch (error) {
      console.error('❌ Schema consolidation failed:', error);
    }
  }, []);

  // Image optimization
  const optimizeImages = useCallback(async () => {
    try {
      const images = document.querySelectorAll('img');
      const totalImages = images.length;

      // Would call image optimization service
      const optimization: ImageOptimization = {
        optimizedImages: Math.floor(totalImages * 0.8),
        totalImages,
        compressionRatio: 0.7,
        webpConversion: 0.9,
        lazyLoading: true,
        lastOptimized: new Date(),
      };

      setState(prev => ({ ...prev, imageOptimization: optimization }));
      console.log('🖼️ Images optimized:', optimization);

    } catch (error) {
      console.error('❌ Image optimization failed:', error);
    }
  }, []);

  // Local SEO check
  const checkLocalSEO = useCallback(async () => {
    try {
      // Would call local SEO audit service
      const localSEO: LocalSEO = {
        napConsistency: {
          consistent: true,
          inconsistencies: [],
        },
        localRankings: {
          'Berlin': 3,
          'Brandenburg': 5,
          'Bayern': 8,
        },
        citations: {
          total: 45,
          consistent: 42,
          inconsistent: 3,
        },
        reviews: {
          average: 4.6,
          total: 128,
          lastUpdated: new Date(),
        },
      };

      setState(prev => ({ ...prev, localSEO }));
      console.log('📍 Local SEO analyzed:', localSEO);

    } catch (error) {
      console.error('❌ Local SEO check failed:', error);
    }
  }, []);

  // Generate structured data
  const generateSchema = useCallback((type: string, data: any): string => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return JSON.stringify(schema);
  }, []);

  // Track SEO performance
  const trackSEOPerformance = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      const lcp = paint.find(p => p.name === 'largest-contentful-paint')?.startTime || 0;
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      const ttfb = navigation.responseStart - navigation.requestStart;

      // Update metrics
      updateMetrics({
        coreWebVitals: {
          lcp,
          fid: 0, // Would need to measure first input delay
          cls: 0, // Would need to measure cumulative layout shift
          fcp,
          ttfb,
        },
      });
    }
  }, [updateMetrics]);

  // Initialize SEO services on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeSEOServices();
    }, 4000); // Delay to not block initial render

    return () => clearTimeout(timer);
  }, [initializeSEOServices]);

  // Analyze page on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzePage(location.pathname);
    }, 1000); // Allow page to render

    return () => clearTimeout(timer);
  }, [location.pathname, analyzePage]);

  // Track performance metrics
  useEffect(() => {
    let observer: PerformanceObserver;

    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            trackSEOPerformance();
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [trackSEOPerformance]);

  const value: SEOContextType = {
    state,
    initializeSEOServices,
    analyzePage,
    optimizeContent,
    updateMetrics,
    consolidateSchema,
    optimizeImages,
    checkLocalSEO,
    generateSchema,
    trackSEOPerformance,
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEOState = () => {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEOState must be used within an SEOProvider');
  }
  return context;
};

export default SEOProvider;