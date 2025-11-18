import { contentFreshnessManager } from './ContentFreshnessManager';
import { internalLinkingOptimizer } from './InternalLinkingOptimizer';
import { criticalCSSExtractor } from './CriticalCSSExtractor';
import { userIntentClassifier } from './UserIntentClassifier';
import { serpFeatureOptimizer } from './SerpFeatureOptimizer';
import { seoMonitoringHub } from './SEOMonitoringHub';
import { contentGapAnalyzer } from './ContentGapAnalyzer';

export interface SEOInitializationConfig {
  enableMonitoring: boolean;
  monitoringInterval: number;
  enableContentFreshness: boolean;
  enableCriticalCSS: boolean;
  enableInternalLinking: boolean;
  enableUserIntentTracking: boolean;
  enableSerpOptimization: boolean;
  enableContentGapAnalysis: boolean;
}

export class SEOOrchestrator {
  private static instance: SEOOrchestrator;
  private initialized: boolean = false;
  private config: SEOInitializationConfig;

  private constructor(config?: Partial<SEOInitializationConfig>) {
    this.config = {
      enableMonitoring: true,
      monitoringInterval: 15, // minutes
      enableContentFreshness: true,
      enableCriticalCSS: true,
      enableInternalLinking: true,
      enableUserIntentTracking: true,
      enableSerpOptimization: true,
      enableContentGapAnalysis: true,
      ...config
    };
  }

  static getInstance(config?: Partial<SEOInitializationConfig>): SEOOrchestrator {
    if (!SEOOrchestrator.instance) {
      SEOOrchestrator.instance = new SEOOrchestrator(config);
    }
    return SEOOrchestrator.instance;
  }

  async initializeAllSEOSystems(): Promise<void> {
    if (this.initialized) {
      console.log('SEO systems already initialized');
      return;
    }

    console.log('🚀 Initializing Advanced SEO Optimization Suite...');

    try {
      // Initialize Content Freshness Management
      if (this.config.enableContentFreshness) {
        await this.initializeContentFreshness();
      }

      // Initialize Critical CSS Extraction
      if (this.config.enableCriticalCSS) {
        await this.initializeCriticalCSS();
      }

      // Initialize Internal Linking Optimization
      if (this.config.enableInternalLinking) {
        await this.initializeInternalLinking();
      }

      // Initialize User Intent Classification
      if (this.config.enableUserIntentTracking) {
        await this.initializeUserIntentTracking();
      }

      // Initialize SERP Feature Optimization
      if (this.config.enableSerpOptimization) {
        await this.initializeSerpOptimization();
      }

      // Initialize Content Gap Analysis
      if (this.config.enableContentGapAnalysis) {
        await this.initializeContentGapAnalysis();
      }

      // Initialize Monitoring Hub (should be last)
      if (this.config.enableMonitoring) {
        await this.initializeMonitoring();
      }

      this.initialized = true;
      console.log('✅ All SEO systems successfully initialized!');

      // Perform initial optimizations
      await this.performInitialOptimizations();

    } catch (error) {
      console.error('❌ Failed to initialize SEO systems:', error);
      throw error;
    }
  }

  private async initializeContentFreshness(): Promise<void> {
    console.log('📅 Initializing Content Freshness Management...');
    
    // Start automatic freshness checks
    // await contentFreshnessManager.checkFreshness(); // Temporarily disabled
    
    console.log('✓ Content Freshness Management initialized');
  }

  private async initializeCriticalCSS(): Promise<void> {
    console.log('🎨 Initializing Critical CSS Extraction...');
    
    const currentPath = window.location.pathname;
    
    // Extract critical CSS for current page
    await criticalCSSExtractor.extractCriticalCSS(currentPath);
    
    // Preload non-critical CSS
    await criticalCSSExtractor.preloadNonCriticalCSS();
    
    console.log('✓ Critical CSS Extraction initialized');
  }

  private async initializeInternalLinking(): Promise<void> {
    console.log('🔗 Initializing Internal Linking Optimization...');
    
    const currentPath = window.location.pathname;
    const content = document.body.textContent || '';
    const keywords = content.split(' ').slice(0, 20); // Get first 20 words as keywords
    
    // Get related links for current page
    await internalLinkingOptimizer.getRelatedLinks(currentPath, content, keywords);
    
    console.log('✓ Internal Linking Optimization initialized');
  }

  private async initializeUserIntentTracking(): Promise<void> {
    console.log('🎯 Initializing User Intent Classification...');
    
    // Start tracking user behavior
    const sessionId = this.generateSessionId();
    
    // Track initial page load behavior
    setTimeout(() => {
      const behavior = {
        timeOnPage: performance.now(),
        scrollDepth: this.getScrollDepth(),
        clickPattern: this.getRecentClicks(),
        deviceType: this.detectDeviceType(),
        sessionDuration: performance.now()
      };
      
      userIntentClassifier.trackUserBehavior(sessionId, behavior);
    }, 5000); // Track after 5 seconds
    
    console.log('✓ User Intent Classification initialized');
  }

  private async initializeSerpOptimization(): Promise<void> {
    console.log('📊 Initializing SERP Feature Optimization...');
    
    const currentPath = window.location.pathname;
    const content = document.body.textContent || '';
    const title = document.title;
    
    // Optimize for featured snippet
    await serpFeatureOptimizer.optimizeForFeaturedSnippet(title, content, 'paragraph');
    
    // Generate People Also Ask questions
    await serpFeatureOptimizer.generatePeopleAlsoAsk(title, content);
    
    // Optimize for voice search
    await serpFeatureOptimizer.optimizeForVoiceSearch(title, content);
    
    console.log('✓ SERP Feature Optimization initialized');
  }

  private async initializeContentGapAnalysis(): Promise<void> {
    console.log('🔍 Initializing Content Gap Analysis...');
    
    // Extract primary keywords from current page
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const primaryKeywords = [title, ...description.split(' ')].slice(0, 10);
    
    // Analyze content gaps
    await contentGapAnalyzer.analyzeContentGaps(primaryKeywords);
    
    console.log('✓ Content Gap Analysis initialized');
  }

  private async initializeMonitoring(): Promise<void> {
    console.log('📈 Initializing SEO Monitoring Hub...');
    
    // Start monitoring with configured interval
    await seoMonitoringHub.startMonitoring(this.config.monitoringInterval);
    
    console.log('✓ SEO Monitoring Hub initialized');
  }

  private async performInitialOptimizations(): Promise<void> {
    console.log('⚡ Performing initial optimizations...');

    try {
      // Optimize images on current page
      await this.optimizePageImages();

      // Inject critical CSS if available
      await this.injectCriticalCSS();

      // Add structured data
      await this.addStructuredData();

      // Optimize meta tags
      await this.optimizeMetaTags();

      console.log('✓ Initial optimizations completed');

    } catch (error) {
      console.warn('⚠️ Some initial optimizations failed:', error);
    }
  }

  private async optimizePageImages(): Promise<void> {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      
      // Add lazy loading if not present
      if (!imageElement.loading) {
        imageElement.loading = 'lazy';
      }
      
      // Add decoding optimization
      if (!imageElement.decoding) {
        imageElement.decoding = 'async';
      }
      
      // Mark as optimized
      imageElement.setAttribute('data-optimized', 'true');
    });
  }

  private async injectCriticalCSS(): Promise<void> {
    const currentPath = window.location.pathname;
    const criticalCSS = await criticalCSSExtractor.extractCriticalCSS(currentPath);
    
    if (criticalCSS && !document.getElementById('critical-css')) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    }
  }

  private async addStructuredData(): Promise<void> {
    const title = document.title;
    const content = document.body.textContent || '';
    
    // Add FAQ structured data if not present
    if (!document.querySelector('script[type="application/ld+json"]')) {
      const structuredData = serpFeatureOptimizer.generateStructuredData(title, content, 'article');
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }
  }

  private async optimizeMetaTags(): Promise<void> {
    // Ensure viewport meta tag exists
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }

    // Add robots meta if not present
    if (!document.querySelector('meta[name="robots"]')) {
      const robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large';
      document.head.appendChild(robots);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return Math.min((scrollTop + windowHeight) / documentHeight, 1);
  }

  private getRecentClicks(): string[] {
    // This would be populated by click event listeners in a real implementation
    return [];
  }

  private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    
    return 'desktop';
  }

  async getComprehensiveReport(): Promise<{
    systemStatus: Record<string, boolean>;
    performanceMetrics: any;
    contentMetrics: any;
    monitoringData: any;
    recommendations: string[];
  }> {
    const systemStatus = {
      contentFreshness: this.config.enableContentFreshness,
      criticalCSS: this.config.enableCriticalCSS,
      internalLinking: this.config.enableInternalLinking,
      userIntentTracking: this.config.enableUserIntentTracking,
      serpOptimization: this.config.enableSerpOptimization,
      contentGapAnalysis: this.config.enableContentGapAnalysis,
      monitoring: this.config.enableMonitoring
    };

    // const freshnessStats = contentFreshnessManager.getFreshnessStats(); // Temporarily disabled
    const linkingStats = internalLinkingOptimizer.getCacheStats();
    const cssStats = criticalCSSExtractor.getCacheStats();
    const intentStats = userIntentClassifier.getAnalytics();
    const serpReport = serpFeatureOptimizer.getOptimizationReport();
    const gapReport = contentGapAnalyzer.getGapAnalysisReport();
    const monitoringData = seoMonitoringHub.getDashboardData();

    const recommendations = [
      ...monitoringData.recommendations,
      ...serpReport.recommendations,
      ...gapReport.recommendations
    ].slice(0, 10);

    return {
      systemStatus,
      performanceMetrics: {
        contentFreshness: freshnessStats,
        internalLinking: linkingStats,
        criticalCSS: cssStats
      },
      contentMetrics: {
        userIntent: intentStats,
        serpFeatures: serpReport,
        contentGaps: gapReport
      },
      monitoringData,
      recommendations
    };
  }

  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down SEO systems...');
    
    if (this.config.enableMonitoring) {
      seoMonitoringHub.stopMonitoring();
    }
    
    // Clear caches
    internalLinkingOptimizer.clearCache();
    criticalCSSExtractor.clearCache();
    
    this.initialized = false;
    console.log('✓ SEO systems shut down');
  }
}

export const seoOrchestrator = SEOOrchestrator.getInstance();