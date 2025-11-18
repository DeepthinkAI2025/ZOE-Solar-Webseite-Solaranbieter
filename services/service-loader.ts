/**
 * Optimized Service Loader für ZOE Solar
 *
 * Lädt nur die wesentlichen Services für Performance-Optimierung
 * Verhindert das Laden von 112 über-engineerten Services
 */

import { performanceOptimizationService } from './performance-optimization-service';

// Kern-Services die immer geladen werden
const CORE_SERVICES = {
  performance: performanceOptimizationService,
};

// Lazy-Load Services die nur bei Bedarf geladen werden
const LAZY_SERVICES = {
  // SEO Services
  seo: () => import('./seo-service').then(m => m.default),
  structuredData: () => import('./structured-data-service').then(m => m.default),

  // Content Services
  content: () => import('./content-service').then(m => m.default),
  faq: () => import('./faq-service').then(m => m.default),

  // Local SEO Services
  localSEO: () => import('./local-seo-service').then(m => m.default),
  geo: () => import('./geo-service').then(m => m.default),

  // Analytics Services
  analytics: () => import('./analytics-service').then(m => m.default),
  monitoring: () => import('./monitoring-service').then(m => m.default),
};

// Service Cache für bereits geladene Services
const serviceCache = new Map<string, any>();

// Performance Monitoring für Service Loading
const performanceMetrics = {
  servicesLoaded: 0,
  totalLoadTime: 0,
  averageLoadTime: 0,
};

/**
 * Service Loader Klasse
 */
class ServiceLoader {
  private isInitialized = false;
  private loadPromises = new Map<string, Promise<any>>();

  /**
   * Initiales Service Loading mit Performance-Fokus
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('🚀 Initialisiere optimierte Services für ZOE Solar...');
    const startTime = performance.now();

    // Nur Core Services sofort laden
    await this.loadCoreServices();

    // Performance Optimierung sofort starten
    await this.optimizePerformance();

    // Lazy Loading für andere Services einrichten
    this.setupLazyLoading();

    this.isInitialized = true;
    const loadTime = performance.now() - startTime;

    console.log(`✅ Services initialisiert in ${loadTime.toFixed(2)}ms`);
    console.log(`📊 Performance Score: ${await this.getPerformanceScore()}`);

    this.updateMetrics(loadTime);
  }

  /**
   * Core Services laden (immer benötigt)
   */
  private async loadCoreServices(): Promise<void> {
    console.log('📦 Lade Core Services...');

    const coreStartTime = performance.now();

    // Performance Service laden und starten
    const { performance } = CORE_SERVICES;
    await performance.runFullOptimization();

    const coreLoadTime = performance.now() - coreStartTime;
    console.log(`⚡ Core Services geladen in ${coreLoadTime.toFixed(2)}ms`);

    performanceMetrics.servicesLoaded += Object.keys(CORE_SERVICES).length;
  }

  /**
   * Performance Optimierung starten
   */
  private async optimizePerformance(): Promise<void> {
    console.log('⚡ Starte Performance Optimierung...');

    // Core Web Vitals optimieren
    await CORE_SERVICES.performance.optimizeCoreWebVitals();

    // Mobile Experience optimieren
    await CORE_SERVICES.performance.optimizeMobileExperience();

    // Deutsche SEO optimieren
    await CORE_SERVICES.performance.optimizeGermanSEO();
  }

  /**
   * Lazy Loading für optionale Services einrichten
   */
  private setupLazyLoading(): void {
    console.log('🔄 Richte Lazy Loading für optionale Services ein...');

    // Intersection Observer für Sichtbarkeits-basiertes Loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadServiceForElement(entry.target as Element);
          }
        });
      }, { threshold: 0.1 });

      // Observer für relevante Elemente registrieren
      this.registerLazyElements(observer);
    }

    // Event-basiertes Loading
    this.setupEventBasedLoading();

    // Zeitbasiertes Loading (nach Core Loading)
    this.setupTimeBasedLoading();
  }

  /**
   * Lazy Elements für Observer registrieren
   */
  private registerLazyElements(observer: IntersectionObserver): void {
    // FAQ Sektion -> FAQ Service
    const faqSections = document.querySelectorAll('.faq-section, [data-service="faq"]');
    faqSections.forEach(section => observer.observe(section));

    // Kontaktformular -> Local SEO Service
    const contactForms = document.querySelectorAll('.contact-form, [data-service="contact"]');
    contactForms.forEach(form => observer.observe(form));

    // Analytics Sektion -> Analytics Service
    const analyticsSections = document.querySelectorAll('.analytics-section, [data-service="analytics"]');
    analyticsSections.forEach(section => observer.observe(section));

    // Karten -> Geo Service
    const maps = document.querySelectorAll('.map-container, [data-service="geo"]');
    maps.forEach(map => observer.observe(map));
  }

  /**
   * Service für bestimmtes Element laden
   */
  private async loadServiceForElement(element: Element): Promise<void> {
    const serviceName = element.getAttribute('data-service');
    if (serviceName && serviceName in LAZY_SERVICES) {
      await this.loadService(serviceName);
      element.removeAttribute('data-service'); // Verhindert doppeltes Loading
    }
  }

  /**
   * Event-basiertes Loading einrichten
   */
  private setupEventBasedLoading(): void {
    // User Interaction -> SEO Service
    const userInteractionEvents = ['click', 'scroll', 'keydown'];

    const loadSEOOnInteraction = () => {
      this.loadService('seo');
      userInteractionEvents.forEach(event => {
        document.removeEventListener(event, loadSEOOnInteraction);
      });
    };

    userInteractionEvents.forEach(event => {
      document.addEventListener(event, loadSEOOnInteraction, { once: true });
    });

    // Form Focus -> Local SEO Service
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('focus', () => {
        this.loadService('localSEO');
      }, { once: true });
    });
  }

  /**
   * Zeitbasiertes Loading einrichten
   */
  private setupTimeBasedLoading(): void {
    // Nach 3 Sekunden -> Analytics Service
    setTimeout(() => {
      this.loadService('analytics');
    }, 3000);

    // Nach 5 Sekunden -> Monitoring Service
    setTimeout(() => {
      this.loadService('monitoring');
    }, 5000);

    // Nach 10 Sekunden -> Strukturierte Daten
    setTimeout(() => {
      this.loadService('structuredData');
    }, 10000);
  }

  /**
   * Service on-demand laden
   */
  async loadService(serviceName: string): Promise<any> {
    // Prüfen ob Service bereits geladen ist
    if (serviceCache.has(serviceName)) {
      return serviceCache.get(serviceName);
    }

    // Prüfen ob Service bereits am Laden ist
    if (this.loadPromises.has(serviceName)) {
      return this.loadPromises.get(serviceName);
    }

    // Service nicht gefunden
    if (!(serviceName in LAZY_SERVICES)) {
      console.warn(`❌ Service "${serviceName}" nicht gefunden`);
      return null;
    }

    // Service laden
    const loadPromise = this.loadServiceInternal(serviceName);
    this.loadPromises.set(serviceName, loadPromise);

    try {
      const service = await loadPromise;
      serviceCache.set(serviceName, service);
      this.loadPromises.delete(serviceName);

      console.log(`✅ Service "${serviceName}" erfolgreich geladen`);
      return service;
    } catch (error) {
      console.error(`❌ Fehler beim Laden von Service "${serviceName}":`, error);
      this.loadPromises.delete(serviceName);
      return null;
    }
  }

  /**
   * Internes Service Loading mit Performance Tracking
   */
  private async loadServiceInternal(serviceName: string): Promise<any> {
    const startTime = performance.now();
    console.log(`📦 Lade Service: ${serviceName}...`);

    const serviceLoader = LAZY_SERVICES[serviceName as keyof typeof LAZY_SERVICES];
    const serviceModule = await serviceLoader();

    const loadTime = performance.now() - startTime;
    console.log(`⚡ Service "${serviceName}" geladen in ${loadTime.toFixed(2)}ms`);

    // Service initialisieren falls nötig
    if (serviceModule.initialize && typeof serviceModule.initialize === 'function') {
      await serviceModule.initialize();
    }

    performanceMetrics.servicesLoaded++;
    performanceMetrics.totalLoadTime += loadTime;
    performanceMetrics.averageLoadTime = performanceMetrics.totalLoadTime / performanceMetrics.servicesLoaded;

    return serviceModule;
  }

  /**
   * Performance Score berechnen
   */
  async getPerformanceScore(): Promise<number> {
    const metrics = await CORE_SERVICES.performance.measurePerformance();
    return metrics.score;
  }

  /**
   * Performance Metrics aktualisieren
   */
  private updateMetrics(loadTime: number): void {
    performanceMetrics.servicesLoaded++;
    performanceMetrics.totalLoadTime += loadTime;
    performanceMetrics.averageLoadTime = performanceMetrics.totalLoadTime / performanceMetrics.servicesLoaded;
  }

  /**
   * Service Status abrufen
   */
  getServiceStatus(): {
    initialized: boolean;
    coreServices: string[];
    lazyServices: string[];
    performanceMetrics: typeof performanceMetrics;
  } {
    return {
      initialized: this.isInitialized,
      coreServices: Object.keys(CORE_SERVICES),
      lazyServices: Object.keys(LAZY_SERVICES),
      performanceMetrics: { ...performanceMetrics },
    };
  }

  /**
   * Cache leeren (für Development)
   */
  clearCache(): void {
    serviceCache.clear();
    this.loadPromises.clear();
    performanceMetrics.servicesLoaded = 0;
    performanceMetrics.totalLoadTime = 0;
    performanceMetrics.averageLoadTime = 0;
    this.isInitialized = false;
    console.log('🗑️ Service Cache geleert');
  }

  /**
   * Preload wichtiger Services
   */
  async preloadServices(serviceNames: string[]): Promise<void> {
    console.log(`🚀 Preloading Services: ${serviceNames.join(', ')}`);

    const preloadPromises = serviceNames
      .filter(name => name in LAZY_SERVICES)
      .map(name => this.loadService(name));

    await Promise.allSettled(preloadPromises);
    console.log('✅ Service Preloading abgeschlossen');
  }
}

// Singleton Export
export const serviceLoader = new ServiceLoader();
export default serviceLoader;

// Types für TypeScript
export interface ServiceInterface {
  initialize?(): Promise<void>;
  name?: string;
  version?: string;
}

// Auto-Initialization für Production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  document.addEventListener('DOMContentLoaded', () => {
    serviceLoader.initialize();
  });
}