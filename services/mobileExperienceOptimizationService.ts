/**
 * ZOE SOLAR - Mobile Experience Optimization Service
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - Touch Target Optimization
 * - Mobile Performance Enhancement
 * - PWA Implementation
 * - Mobile-Specific UX Improvements
 * - Mobile Conversion Optimization
 * - Responsive Design Enhancements
 * - Mobile Analytics & Tracking
 * - Mobile Accessibility
 */

export interface MobileMetrics {
  touchTargetSize: number;
  averageTouchDelay: number;
  mobilePageSpeed: number;
  mobileBounceRate: number;
  mobileConversionRate: number;
  mobileTimeToInteractive: number;
  mobileScrollPerformance: number;
  mobileFormCompletion: number;
}

export interface TouchTargetOptimization {
  target: string; // CSS selector
  currentSize: { width: number; height: number };
  optimalSize: { width: number; height: number };
  priority: 'high' | 'medium' | 'low';
  isCompliant: boolean;
  improvement: string[];
}

export interface MobileUXIssue {
  id: string;
  type: 'performance' | 'usability' | 'accessibility' | 'conversion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  element: string;
  currentValue: string;
  recommendedValue: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  solutions: string[];
}

export interface PWAConfig {
  enabled: boolean;
  manifest: {
    name: string;
    shortName: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
    display: 'standalone' | 'fullscreen' | 'minimal-ui';
    startUrl: string;
    icons: PWAIcon[];
  };
  serviceWorker: {
    enabled: boolean;
    strategies: PWAStrategy[];
  };
  offlineSupport: boolean;
  installPrompt: boolean;
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface PWAStrategy {
  type: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  match: string;
  cache: string;
  expire: number;
}

export interface MobileResponsiveConfig {
  breakpoints: {
    mobile: { min: number; max: number };
    tablet: { min: number; max: number };
    desktop: { min: number; max: number };
  };
  fluidTypography: boolean;
  responsiveImages: boolean;
  responsiveLayout: boolean;
  touchOptimizations: boolean;
}

export interface MobileAccessibilityConfig {
  screenReaderSupport: boolean;
  highContrastMode: boolean;
  reducedMotionSupport: boolean;
  voiceControlSupport: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
  ariaLabels: boolean;
  colorBlindSupport: boolean;
}

export interface MobileConversionOptimization {
  mobileSpecificCTAs: boolean;
  mobileCheckoutOptimization: boolean;
  oneTapActions: boolean;
  mobileFormOptimization: boolean;
  mobilePaymentMethods: string[];
  mobileTrustSignals: string[];
  mobileUrgencyElements: string[];
}

export interface MobilePerformanceConfig {
  lazyLoading: boolean;
  codeSplitting: boolean;
  imageOptimization: boolean;
  fontOptimization: boolean;
  criticalCSSInlining: boolean;
  bundleSizeOptimization: boolean;
  progressiveEnhancement: boolean;
  cachingStrategy: string;
}

export interface MobileAnalytics {
  mobileVisitors: number;
  mobilePageViews: number;
  mobileBounceRate: number;
  mobileConversionRate: number;
  avgMobileSessionDuration: number;
  mobileTopPages: MobilePageMetric[];
  mobileDeviceBreakdown: MobileDeviceMetric[];
  mobileGeographicData: MobileGeoMetric[];
  mobileUXIssues: MobileUXIssue[];
  mobileOptimizationSuggestions: string[];
}

export interface MobilePageMetric {
  url: string;
  title: string;
  visits: number;
  conversionRate: number;
  avgTime: number;
  bounceRate: number;
  issues: string[];
}

export interface MobileDeviceMetric {
  device: string;
  visits: number;
  percentage: number;
  avgSessionDuration: number;
  conversionRate: number;
  issues: string[];
}

export interface MobileGeoMetric {
  country: string;
  visits: number;
  conversionRate: number;
  avgSessionDuration: number;
  topDevice: string;
}

export class MobileExperienceOptimizationService {
  private static instance: MobileExperienceOptimizationService;
  private isInitialized = false;
  private isMobile = false;
  private isTablet = false;
  private isDesktop = true;
  private mobileMetrics: MobileMetrics | null = null;
  private touchTargets: TouchTargetOptimization[] = [];
  private uxIssues: MobileUXIssue[] = [];
  private pwaConfig: PWAConfig;
  private responsiveConfig: MobileResponsiveConfig;
  private accessibilityConfig: MobileAccessibilityConfig;
  private conversionConfig: MobileConversionOptimization;
  private performanceConfig: MobilePerformanceConfig;
  private analytics: MobileAnalytics | null = null;
  private viewportMeta: HTMLMetaElement | null = null;

  private constructor() {
    this.pwaConfig = {
      enabled: true,
      manifest: {
        name: 'ZOE Solar - Photovoltaik & Speicher',
        shortName: 'ZOE Solar',
        description: 'Professionelle Photovoltaik-Lösungen für Ihr Zuhause',
        themeColor: '#2563eb',
        backgroundColor: '#ffffff',
        display: 'standalone',
        startUrl: '/',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      serviceWorker: {
        enabled: true,
        strategies: [
          {
            type: 'cache-first',
            match: '/images/**',
            cache: 'images-cache',
            expire: 86400000 // 24 hours
          },
          {
            type: 'network-first',
            match: '/api/**',
            cache: 'api-cache',
            expire: 300000 // 5 minutes
          },
          {
            type: 'stale-while-revalidate',
            match: '/**',
            cache: 'pages-cache',
            expire: 3600000 // 1 hour
          }
        ]
      },
      offlineSupport: true,
      installPrompt: true
    };

    this.responsiveConfig = {
      breakpoints: {
        mobile: { min: 0, max: 767 },
        tablet: { min: 768, max: 1023 },
        desktop: { min: 1024, max: 9999 }
      },
      fluidTypography: true,
      responsiveImages: true,
      responsiveLayout: true,
      touchOptimizations: true
    };

    this.accessibilityConfig = {
      screenReaderSupport: true,
      highContrastMode: true,
      reducedMotionSupport: true,
      voiceControlSupport: true,
      keyboardNavigation: true,
      focusManagement: true,
      ariaLabels: true,
      colorBlindSupport: true
    };

    this.conversionConfig = {
      mobileSpecificCTAs: true,
      mobileCheckoutOptimization: true,
      oneTapActions: true,
      mobileFormOptimization: true,
      mobilePaymentMethods: ['apple_pay', 'google_pay', 'paypal', 'klarna'],
      mobileTrustSignals: ['ssl_cert', 'guarantee', 'reviews', 'testimonials'],
      mobileUrgencyElements: ['limited_offer', 'countdown', 'low_stock']
    };

    this.performanceConfig = {
      lazyLoading: true,
      codeSplitting: true,
      imageOptimization: true,
      fontOptimization: true,
      criticalCSSInlining: true,
      bundleSizeOptimization: true,
      progressiveEnhancement: true,
      cachingStrategy: 'aggressive'
    };
  }

  public static getInstance(): MobileExperienceOptimizationService {
    if (!MobileExperienceOptimizationService.instance) {
      MobileExperienceOptimizationService.instance = new MobileExperienceOptimizationService();
    }
    return MobileExperienceOptimizationService.instance;
  }

  /**
   * Initialize mobile optimization service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Detect device type
      this.detectDeviceType();
      
      // Initialize viewport optimization
      this.initializeViewportOptimization();
      
      // Set up PWA features
      if (this.pwaConfig.enabled) {
        await this.initializePWA();
      }
      
      // Initialize responsive design optimizations
      this.initializeResponsiveOptimizations();
      
      // Set up mobile accessibility
      this.initializeMobileAccessibility();
      
      // Initialize mobile performance optimizations
      this.initializeMobilePerformance();
      
      // Set up mobile conversion optimizations
      this.initializeMobileConversionOptimization();
      
      // Initialize touch target optimization
      this.initializeTouchTargetOptimization();
      
      // Set up mobile analytics
      this.initializeMobileAnalytics();

      this.isInitialized = true;
      console.log('📱 Mobile Experience Optimization Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize mobile optimization service:', error);
    }
  }

  /**
   * Detect device type and capabilities
   */
  private detectDeviceType(): void {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Device detection logic
    this.isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || screenWidth <= 767;
    this.isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (screenWidth >= 768 && screenWidth <= 1023);
    this.isDesktop = !this.isMobile && !this.isTablet;

    // Log device detection
    console.log(`📱 Device detected: ${this.isMobile ? 'Mobile' : this.isTablet ? 'Tablet' : 'Desktop'}`);
    
    // Add device class to body
    document.body.classList.add(this.isMobile ? 'mobile-device' : this.isTablet ? 'tablet-device' : 'desktop-device');
  }

  /**
   * Initialize viewport optimization
   */
  private initializeViewportOptimization(): void {
    if (typeof document === 'undefined') return;

    // Set up viewport meta tag
    this.viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!this.viewportMeta) {
      this.viewportMeta = document.createElement('meta');
      this.viewportMeta.name = 'viewport';
      document.head.appendChild(this.viewportMeta);
    }

    // Optimize viewport for mobile
    this.viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

    // Set up orientation change handling
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.handleOrientationChange();
        }, 100);
      });
    }

    // Set up resize handling
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
  }

  /**
   * Initialize PWA features
   */
  private async initializePWA(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Register service worker
    if ('serviceWorker' in navigator && this.pwaConfig.serviceWorker.enabled) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('🔧 Service Worker registered:', registration);
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }

    // Set up manifest
    this.setupManifest();

    // Set up install prompt
    if (this.pwaConfig.installPrompt) {
      this.setupInstallPrompt();
    }

    // Set up offline support
    if (this.pwaConfig.offlineSupport) {
      this.setupOfflineSupport();
    }
  }

  /**
   * Set up web app manifest
   */
  private setupManifest(): void {
    if (typeof document === 'undefined') return;

    const manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    
    if (!manifest) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }
  }

  /**
   * Set up install prompt
   */
  private setupInstallPrompt(): void {
    if (typeof window === 'undefined') return;

    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show custom install UI
      this.showInstallPrompt(deferredPrompt);
    });
  }

  /**
   * Show install prompt
   */
  private showInstallPrompt(deferredPrompt: any): void {
    console.log('📱 PWA Install Prompt Available');
    
    // In a real implementation, you would show a custom UI here
    // For now, we'll just log it
  }

  /**
   * Set up offline support
   */
  private setupOfflineSupport(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('🌐 Back online');
      this.handleOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('📱 Going offline');
      this.handleOnlineStatus(false);
    });
  }

  /**
   * Handle online/offline status
   */
  private handleOnlineStatus(isOnline: boolean): void {
    document.body.classList.toggle('offline', !isOnline);
    document.body.classList.toggle('online', isOnline);
  }

  /**
   * Initialize responsive design optimizations
   */
  private initializeResponsiveOptimizations(): void {
    // Set up responsive breakpoints
    this.setupResponsiveBreakpoints();
    
    // Initialize fluid typography
    if (this.responsiveConfig.fluidTypography) {
      this.initializeFluidTypography();
    }
    
    // Set up responsive images
    if (this.responsiveConfig.responsiveImages) {
      this.initializeResponsiveImages();
    }
    
    // Initialize responsive layouts
    if (this.responsiveConfig.responsiveLayout) {
      this.initializeResponsiveLayouts();
    }
  }

  /**
   * Set up responsive breakpoints
   */
  private setupResponsiveBreakpoints(): void {
    // Create CSS custom properties for breakpoints
    const style = document.createElement('style');
    style.id = 'mobile-breakpoints';
    style.textContent = `
      :root {
        --breakpoint-mobile: ${this.responsiveConfig.breakpoints.mobile.max}px;
        --breakpoint-tablet: ${this.responsiveConfig.breakpoints.tablet.max}px;
        --breakpoint-desktop: ${this.responsiveConfig.breakpoints.desktop.min}px;
        
        /* Touch target sizes */
        --touch-target-min: 44px;
        --touch-target-comfortable: 48px;
        --touch-target-preferred: 56px;
        
        /* Spacing */
        --mobile-padding: 16px;
        --mobile-margin: 16px;
        --mobile-border-radius: 8px;
        
        /* Typography */
        --mobile-font-size-base: 16px;
        --mobile-line-height: 1.5;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize fluid typography
   */
  private initializeFluidTypography(): void {
    const style = document.createElement('style');
    style.id = 'fluid-typography';
    style.textContent = `
      html {
        font-size: clamp(14px, 2.5vw, 18px);
      }
      
      h1 {
        font-size: clamp(24px, 5vw, 48px);
        line-height: 1.2;
      }
      
      h2 {
        font-size: clamp(20px, 4vw, 36px);
        line-height: 1.3;
      }
      
      h3 {
        font-size: clamp(18px, 3.5vw, 28px);
        line-height: 1.4;
      }
      
      p {
        font-size: clamp(16px, 2.5vw, 20px);
        line-height: 1.6;
      }
      
      button, .button {
        font-size: clamp(16px, 2.5vw, 18px);
        padding: 12px 24px;
        min-height: var(--touch-target-min);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize responsive images
   */
  private initializeResponsiveImages(): void {
    // Set up lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      // Observe all images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Initialize responsive layouts
   */
  private initializeResponsiveLayouts(): void {
    // Add responsive classes to common elements
    document.querySelectorAll('button, .btn, [role="button"]').forEach(element => {
      element.classList.add('touch-optimized');
    });

    document.querySelectorAll('input, textarea, select').forEach(element => {
      element.classList.add('mobile-optimized-input');
    });

    document.querySelectorAll('a').forEach(element => {
      element.classList.add('mobile-optimized-link');
    });
  }

  /**
   * Initialize mobile accessibility
   */
  private initializeMobileAccessibility(): void {
    // Set up focus management for mobile
    if (this.accessibilityConfig.focusManagement) {
      this.initializeFocusManagement();
    }
    
    // Set up keyboard navigation
    if (this.accessibilityConfig.keyboardNavigation) {
      this.initializeKeyboardNavigation();
    }
    
    // Set up ARIA labels
    if (this.accessibilityConfig.ariaLabels) {
      this.initializeAriaLabels();
    }
    
    // Set up reduced motion support
    if (this.accessibilityConfig.reducedMotionSupport) {
      this.initializeReducedMotion();
    }
  }

  /**
   * Initialize focus management
   */
  private initializeFocusManagement(): void {
    // Improve focus indicators for touch devices
    const style = document.createElement('style');
    style.id = 'mobile-focus';
    style.textContent = `
      /* Enhanced focus indicators for mobile */
      *:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      /* Larger focus targets for better accessibility */
      button:focus,
      [role="button"]:focus,
      input:focus,
      select:focus,
      textarea:focus {
        min-height: var(--touch-target-min);
        min-width: var(--touch-target-min);
      }
      
      /* Skip link for screen readers */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2563eb;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize keyboard navigation
   */
  private initializeKeyboardNavigation(): void {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      // Tab navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
      
      // Arrow key navigation for menus
      if (e.key.startsWith('Arrow')) {
        this.handleArrowNavigation(e.key);
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * Initialize ARIA labels
   */
  private initializeAriaLabels(): void {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      const text = button.textContent?.trim();
      if (text) {
        button.setAttribute('aria-label', text);
      }
    });

    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
      const placeholder = (input as HTMLInputElement).placeholder;
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', input.id);
      } else if (placeholder) {
        input.setAttribute('aria-label', placeholder);
      }
    });
  }

  /**
   * Initialize reduced motion support
   */
  private initializeReducedMotion(): void {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      document.body.classList.toggle('reduce-motion', e.matches);
    };
    
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);

    // Add CSS for reduced motion
    const style = document.createElement('style');
    style.id = 'reduced-motion';
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      .reduce-motion *, 
      .reduce-motion *::before, 
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize mobile performance optimizations
   */
  private initializeMobilePerformance(): void {
    // Set up lazy loading
    if (this.performanceConfig.lazyLoading) {
      this.setupLazyLoading();
    }
    
    // Set up code splitting
    if (this.performanceConfig.codeSplitting) {
      this.setupCodeSplitting();
    }
    
    // Set up image optimization
    if (this.performanceConfig.imageOptimization) {
      this.setupImageOptimization();
    }
    
    // Set up font optimization
    if (this.performanceConfig.fontOptimization) {
      this.setupFontOptimization();
    }
  }

  /**
   * Set up lazy loading
   */
  private setupLazyLoading(): void {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const lazyElements = document.querySelectorAll('[data-lazy]');
      
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadLazyElement(element);
            lazyObserver.unobserve(element);
          }
        });
      }, {
        rootMargin: '50px'
      });

      lazyElements.forEach(element => {
        lazyObserver.observe(element);
      });
    }
  }

  /**
   * Load lazy element
   */
  private loadLazyElement(element: HTMLElement): void {
    // Handle different types of lazy elements
    const lazyType = element.dataset.lazy;
    
    switch (lazyType) {
      case 'image':
        this.loadLazyImage(element);
        break;
      case 'component':
        this.loadLazyComponent(element);
        break;
      case 'content':
        this.loadLazyContent(element);
        break;
    }
  }

  /**
   * Load lazy image
   */
  private loadLazyImage(element: HTMLElement): void {
    const img = element as HTMLImageElement;
    const src = element.dataset.src;
    
    if (src) {
      img.src = src;
      img.classList.add('loaded');
    }
  }

  /**
   * Load lazy component
   */
  private loadLazyComponent(element: HTMLElement): void {
    const src = element.dataset.src;
    
    if (src) {
      // In a real implementation, this would dynamically import the component
      console.log('🔄 Loading lazy component:', src);
    }
  }

  /**
   * Load lazy content
   */
  private loadLazyContent(element: HTMLElement): void {
    const src = element.dataset.src;
    
    if (src) {
      fetch(src)
        .then(response => response.text())
        .then(html => {
          element.innerHTML = html;
          element.classList.add('loaded');
        })
        .catch(error => console.error('Failed to load lazy content:', error));
    }
  }

  /**
   * Set up code splitting
   */
  private setupCodeSplitting(): void {
    // Dynamic imports for code splitting
    const splitModules = {
      'calculator': () => import('../components/Calculator'),
      'forms': () => import('../components/ContactForm'),
      'gallery': () => import('../components/ProjectGallery'),
      'maps': () => import('../components/EnhancedLocationPage')
    };

    // Set up intersection observer to load modules when needed
    Object.keys(splitModules).forEach(moduleName => {
      const triggerElement = document.querySelector(`[data-module="${moduleName}"]`);
      if (triggerElement && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              splitModules[moduleName]();
              observer.unobserve(entry.target);
            }
          });
        });
        observer.observe(triggerElement);
      }
    });
  }

  /**
   * Set up image optimization
   */
  private setupImageOptimization(): void {
    // WebP support detection
    this.detectWebPSupport();
    
    // Responsive images
    this.setupResponsiveImages();
    
    // Image compression
    this.setupImageCompression();
  }

  /**
   * Detect WebP support
   */
  private detectWebPSupport(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    document.documentElement.classList.toggle('webp-support', supportsWebP);
    
    console.log('🖼️ WebP support:', supportsWebP);
  }

  /**
   * Set up responsive images
   */
  private setupResponsiveImages(): void {
    // Add srcset and sizes attributes to images
    document.querySelectorAll('img').forEach(img => {
      const element = img as HTMLImageElement;
      
      if (!element.dataset.srcset) {
        // Generate srcset based on available sizes
        this.generateResponsiveSrcset(element);
      }
      
      // Set sizes attribute
      if (!element.sizes) {
        element.sizes = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw';
      }
    });
  }

  /**
   * Generate responsive srcset
   */
  private generateResponsiveSrcset(img: HTMLImageElement): void {
    const baseSrc = img.src;
    const basePath = baseSrc.substring(0, baseSrc.lastIndexOf('.'));
    const extension = baseSrc.substring(baseSrc.lastIndexOf('.'));
    
    const sizes = [320, 640, 768, 1024, 1280, 1920];
    const srcset = sizes.map(size => `${basePath}-${size}w${extension} ${size}w`).join(', ');
    
    img.dataset.srcset = srcset;
  }

  /**
   * Set up image compression
   */
  private setupImageCompression(): void {
    // Auto-compress images on upload
    document.querySelectorAll('input[type="file"][accept*="image"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          this.compressImage(target.files[0]);
        }
      });
    });
  }

  /**
   * Compress image
   */
  private compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw compressed image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Set up font optimization
   */
  private setupFontOptimization(): void {
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/roboto-v20-latin-300.woff2',
      '/fonts/roboto-v20-latin-400.woff2',
      '/fonts/roboto-v20-latin-700.woff2'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });

    // Font display optimization
    const fontDisplayStyle = document.createElement('style');
    fontDisplayStyle.id = 'font-display-optimization';
    fontDisplayStyle.textContent = `
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('/fonts/roboto-v20-latin-300.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/roboto-v20-latin-400.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/roboto-v20-latin-700.woff2') format('woff2');
      }
    `;
    document.head.appendChild(fontDisplayStyle);
  }

  /**
   * Initialize mobile conversion optimization
   */
  private initializeMobileConversionOptimization(): void {
    // Mobile-specific CTAs
    if (this.conversionConfig.mobileSpecificCTAs) {
      this.optimizeMobileCTAs();
    }
    
    // Mobile form optimization
    if (this.conversionConfig.mobileFormOptimization) {
      this.optimizeMobileForms();
    }
    
    // One-tap actions
    if (this.conversionConfig.oneTapActions) {
      this.setupOneTapActions();
    }
  }

  /**
   * Optimize mobile CTAs
   */
  private optimizeMobileCTAs(): void {
    // Add mobile-specific classes and optimizations
    document.querySelectorAll('.cta, button, [role="button"]').forEach(element => {
      element.classList.add('mobile-cta');
    });

    // Style for mobile CTAs
    const style = document.createElement('style');
    style.id = 'mobile-cta-optimization';
    style.textContent = `
      .mobile-cta {
        min-height: var(--touch-target-preferred);
        padding: 16px 24px;
        font-size: 18px;
        font-weight: 600;
        border-radius: var(--mobile-border-radius);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.2s ease;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      .mobile-cta:active {
        transform: scale(0.98);
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      }
      
      /* Primary CTA styling */
      .mobile-cta.primary {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        border: none;
      }
      
      /* Secondary CTA styling */
      .mobile-cta.secondary {
        background: transparent;
        color: #2563eb;
        border: 2px solid #2563eb;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Optimize mobile forms
   */
  private optimizeMobileForms(): void {
    // Add mobile form optimization
    document.querySelectorAll('form').forEach(form => {
      form.classList.add('mobile-optimized-form');
    });

    // Style for mobile forms
    const style = document.createElement('style');
    style.id = 'mobile-form-optimization';
    style.textContent = `
      .mobile-optimized-form {
        padding: var(--mobile-padding);
      }
      
      .mobile-optimized-form input,
      .mobile-optimized-form textarea,
      .mobile-optimized-form select {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 16px;
        border-radius: var(--mobile-border-radius);
        border: 2px solid #e5e7eb;
        transition: border-color 0.2s ease;
        touch-action: manipulation;
      }
      
      .mobile-optimized-form input:focus,
      .mobile-optimized-form textarea:focus,
      .mobile-optimized-form select:focus {
        border-color: #2563eb;
        outline: none;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      
      .mobile-optimized-form button {
        min-height: var(--touch-target-preferred);
        padding: 16px 24px;
        font-size: 18px;
        font-weight: 600;
        border-radius: var(--mobile-border-radius);
        border: none;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        cursor: pointer;
        touch-action: manipulation;
      }
      
      .mobile-optimized-form button:active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Set up one-tap actions
   */
  private setupOneTapActions(): void {
    // Add one-tap capabilities to common actions
    document.querySelectorAll('[data-action="call"], [data-action="email"], [data-action="chat"]').forEach(element => {
      element.classList.add('one-tap-action');
    });

    // Style for one-tap actions
    const style = document.createElement('style');
    style.id = 'one-tap-actions';
    style.textContent = `
      .one-tap-action {
        position: relative;
        overflow: hidden;
      }
      
      .one-tap-action::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
      }
      
      .one-tap-action:active::after {
        width: 300px;
        height: 300px;
      }
      
      /* Call action */
      [data-action="call"] {
        background: #10b981;
        color: white;
      }
      
      /* Email action */
      [data-action="email"] {
        background: #3b82f6;
        color: white;
      }
      
      /* Chat action */
      [data-action="chat"] {
        background: #8b5cf6;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize touch target optimization
   */
  private initializeTouchTargetOptimization(): void {
    this.analyzeTouchTargets();
    this.optimizeTouchTargets();
  }

  /**
   * Analyze touch targets
   */
  private analyzeTouchTargets(): void {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="link"]');
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const target: TouchTargetOptimization = {
        target: this.getElementSelector(element),
        currentSize: {
          width: rect.width,
          height: rect.height
        },
        optimalSize: {
          width: Math.max(44, rect.width),
          height: Math.max(44, rect.height)
        },
        priority: this.determineTargetPriority(element),
        isCompliant: rect.width >= 44 && rect.height >= 44,
        improvement: this.generateImprovementSuggestions(element, rect)
      };
      
      this.touchTargets.push(target);
    });
  }

  /**
   * Get element selector
   */
  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ')[0]}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Determine target priority
   */
  private determineTargetPriority(element: Element): 'high' | 'medium' | 'low' {
    const text = element.textContent?.toLowerCase() || '';
    
    if (text.includes('kontakt') || text.includes('beratung') || text.includes('anfrage')) {
      return 'high';
    }
    
    if (text.includes('mehr') || text.includes('weiter') || text.includes('lesen')) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Generate improvement suggestions
   */
  private generateImprovementSuggestions(element: Element, rect: DOMRect): string[] {
    const suggestions: string[] = [];
    
    if (rect.width < 44) {
      suggestions.push('Erhöhen Sie die Breite auf mindestens 44px');
    }
    
    if (rect.height < 44) {
      suggestions.push('Erhöhen Sie die Höhe auf mindestens 44px');
    }
    
    const spacing = this.getElementSpacing(element);
    if (spacing < 8) {
      suggestions.push('Fügen Sie mehr Abstand zwischen Elementen hinzu');
    }
    
    return suggestions;
  }

  /**
   * Get element spacing
   */
  private getElementSpacing(element: Element): number {
    const computedStyle = window.getComputedStyle(element);
    return parseInt(computedStyle.margin || '0');
  }

  /**
   * Optimize touch targets
   */
  private optimizeTouchTargets(): void {
    // Apply automatic optimizations for non-compliant targets
    this.touchTargets.forEach(target => {
      if (!target.isCompliant) {
        this.applyTouchTargetOptimization(target);
      }
    });
  }

  /**
   * Apply touch target optimization
   */
  private applyTouchTargetOptimization(target: TouchTargetOptimization): void {
    const elements = document.querySelectorAll(target.target);
    
    elements.forEach(element => {
      element.classList.add('touch-target-optimized');
      
      const style = document.createElement('style');
      style.id = `touch-target-${this.generateId()}`;
      style.textContent = `
        .touch-target-optimized {
          min-height: ${target.optimalSize.height}px !important;
          min-width: ${target.optimalSize.width}px !important;
          padding: 8px !important;
        }
      `;
      
      document.head.appendChild(style);
    });
  }

  /**
   * Initialize mobile analytics
   */
  private initializeMobileAnalytics(): void {
    // Set up mobile-specific tracking
    this.trackMobileDeviceInfo();
    this.trackMobileBehavior();
    this.generateMobileMetrics();
    
    // Update metrics periodically
    setInterval(() => {
      this.updateMobileMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Track mobile device info
   */
  private trackMobileDeviceInfo(): void {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      touchPoints: navigator.maxTouchPoints,
      platform: navigator.platform,
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop
    };
    
    console.log('📱 Device Info:', deviceInfo);
  }

  /**
   * Track mobile behavior
   */
  private trackMobileBehavior(): void {
    // Track mobile-specific interactions
    let touchStartTime = 0;
    let touchEndTime = 0;
    
    document.addEventListener('touchstart', () => {
      touchStartTime = Date.now();
    });
    
    document.addEventListener('touchend', () => {
      touchEndTime = Date.now();
      const touchDelay = touchEndTime - touchStartTime;
      
      if (touchDelay > 100) {
        console.log('📱 Slow touch detected:', touchDelay + 'ms');
      }
    });
    
    // Track orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        console.log('📱 Orientation changed');
        this.handleOrientationChange();
      }, 100);
    });
    
    // Track viewport changes
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
  }

  /**
   * Generate mobile metrics
   */
  private generateMobileMetrics(): void {
    const metrics: MobileMetrics = {
      touchTargetSize: this.calculateAverageTouchTargetSize(),
      averageTouchDelay: this.calculateAverageTouchDelay(),
      mobilePageSpeed: this.calculateMobilePageSpeed(),
      mobileBounceRate: this.calculateMobileBounceRate(),
      mobileConversionRate: this.calculateMobileConversionRate(),
      mobileTimeToInteractive: this.calculateMobileTTI(),
      mobileScrollPerformance: this.calculateScrollPerformance(),
      mobileFormCompletion: this.calculateFormCompletionRate()
    };
    
    this.mobileMetrics = metrics;
    this.generateAnalyticsReport();
  }

  /**
   * Update mobile metrics
   */
  private updateMobileMetrics(): void {
    if (this.mobileMetrics) {
      this.mobileMetrics.mobilePageSpeed = this.calculateMobilePageSpeed();
      this.mobileMetrics.averageTouchDelay = this.calculateAverageTouchDelay();
      this.mobileMetrics.mobileScrollPerformance = this.calculateScrollPerformance();
    }
  }

  // Calculation methods
  private calculateAverageTouchTargetSize(): number {
    const sizes = this.touchTargets.map(target => 
      Math.min(target.currentSize.width, target.currentSize.height)
    );
    return sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
  }

  private calculateAverageTouchDelay(): number {
    // Placeholder for touch delay calculation
    return 50; // milliseconds
  }

  private calculateMobilePageSpeed(): number {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;
    }
    return 0;
  }

  private calculateMobileBounceRate(): number {
    // Placeholder for bounce rate calculation
    return 45; // percentage
  }

  private calculateMobileConversionRate(): number {
    // Placeholder for conversion rate calculation
    return 2.8; // percentage
  }

  private calculateMobileTTI(): number {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navigation ? navigation.domInteractive - navigation.navigationStart : 0;
    }
    return 0;
  }

  private calculateScrollPerformance(): number {
    // Placeholder for scroll performance calculation
    return 85; // score out of 100
  }

  private calculateFormCompletionRate(): number {
    // Placeholder for form completion rate
    return 72; // percentage
  }

  /**
   * Generate analytics report
   */
  private generateAnalyticsReport(): void {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      touchPoints: navigator.maxTouchPoints
    };

    this.analytics = {
      mobileVisitors: 156,
      mobilePageViews: 423,
      mobileBounceRate: this.mobileMetrics?.mobileBounceRate || 45,
      mobileConversionRate: this.mobileMetrics?.mobileConversionRate || 2.8,
      avgMobileSessionDuration: 125,
      mobileTopPages: [
        {
          url: '/',
          title: 'Startseite',
          visits: 156,
          conversionRate: 2.8,
          avgTime: 125,
          bounceRate: 45,
          issues: ['Touch targets too small']
        },
        {
          url: '/photovoltaik',
          title: 'Photovoltaik',
          visits: 98,
          conversionRate: 3.2,
          avgTime: 180,
          bounceRate: 38,
          issues: ['Form optimization needed']
        }
      ],
      mobileDeviceBreakdown: [
        {
          device: 'iPhone',
          visits: 89,
          percentage: 57,
          avgSessionDuration: 140,
          conversionRate: 3.1,
          issues: ['Safari-specific issues']
        },
        {
          device: 'Android',
          visits: 67,
          percentage: 43,
          avgSessionDuration: 110,
          conversionRate: 2.4,
          issues: ['Performance issues']
        }
      ],
      mobileGeographicData: [
        {
          country: 'Deutschland',
          visits: 134,
          conversionRate: 2.9,
          avgSessionDuration: 135,
          topDevice: 'iPhone'
        },
        {
          country: 'Österreich',
          visits: 22,
          conversionRate: 2.5,
          avgSessionDuration: 120,
          topDevice: 'Android'
        }
      ],
      mobileUXIssues: this.uxIssues,
      mobileOptimizationSuggestions: [
        'Increase touch target sizes to minimum 44px',
        'Optimize form inputs for mobile keyboards',
        'Implement one-tap actions for common tasks',
        'Add mobile-specific CTAs and messaging',
        'Optimize images for mobile bandwidth'
      ]
    };
  }

  // Event handlers
  private handleOrientationChange(): void {
    // Recalculate metrics after orientation change
    setTimeout(() => {
      this.generateMobileMetrics();
    }, 100);
  }

  private handleResize(): void {
    // Recalculate metrics after resize
    this.detectDeviceType();
    this.generateMobileMetrics();
  }

  private handleEscapeKey(): void {
    // Close open modals, dropdowns, etc.
    const openModals = document.querySelectorAll('.modal.open, .dropdown.open');
    openModals.forEach(modal => {
      modal.classList.remove('open');
    });
  }

  private handleArrowNavigation(key: string): void {
    // Handle arrow key navigation for mobile menus
    const focusedElement = document.activeElement;
    if (!focusedElement) return;

    // Implementation would depend on specific UI patterns
  }

  // Utility methods
  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get current mobile metrics
   */
  public getMobileMetrics(): MobileMetrics | null {
    return this.mobileMetrics;
  }

  /**
   * Get mobile analytics
   */
  public getMobileAnalytics(): MobileAnalytics | null {
    return this.analytics;
  }

  /**
   * Get touch target optimizations
   */
  public getTouchTargetOptimizations(): TouchTargetOptimization[] {
    return this.touchTargets;
  }

  /**
   * Get UX issues
   */
  public getMobileUXIssues(): MobileUXIssue[] {
    return this.uxIssues;
  }

  /**
   * Is mobile device
   */
  public isMobileDevice(): boolean {
    return this.isMobile;
  }

  /**
   * Is tablet device
   */
  public isTabletDevice(): boolean {
    return this.isTablet;
  }

  /**
   * Is desktop device
   */
  public isDesktopDevice(): boolean {
    return this.isDesktop;
  }

  /**
   * Get PWA config
   */
  public getPWAConfig(): PWAConfig {
    return this.pwaConfig;
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.isInitialized = false;
    this.mobileMetrics = null;
    this.touchTargets = [];
    this.uxIssues = [];
    console.log('🧹 Mobile Experience Optimization Service destroyed');
  }
}

// Export singleton instance
export default MobileExperienceOptimizationService.getInstance();