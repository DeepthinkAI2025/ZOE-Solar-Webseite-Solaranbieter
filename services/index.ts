/**
 * SEO Services Entry Point - ZOE Solar
 *
 * Zentraler Einstiegspunkt für alle SEO-Optimierungs-Services
 * Aktiviert alle automatischen Optimierungen beim Start der Anwendung
 */

// Core Services importieren
export { coreWebVitalsMonitor } from './core-web-vitals-monitor';
export { googleAnalyticsService } from './google-analytics-service';
export { structuredDataExtendedService } from './structured-data-extended';
export { geoAEOContentService } from './geo-aeo-content-service';
export { localSEOService } from './local-seo-optimization-service';
export { internationalSEOService } from './international-seo-service';

// Default-Export für einfachen Import
import { coreWebVitalsMonitor } from './core-web-vitals-monitor';
import { googleAnalyticsService } from './google-analytics-service';
import { structuredDataExtendedService } from './structured-data-extended';
import { geoAEOContentService } from './geo-aeo-content-service';
import { localSEOService } from './local-seo-optimization-service';
import { internationalSEOService } from './international-seo-service';

/**
 * SEO Services Manager - Koordiniert alle SEO-Services
 */
class SEOServicesManager {
  private isInitialized = false;
  private serviceStatus: Record<string, boolean> = {};

  constructor() {
    this.initializeServices();
  }

  /**
   * Alle SEO-Services initialisieren und aktivieren
   */
  private async initializeServices(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) return;

    console.log('🚀 ZOE Solar SEO Services werden initialisiert...');

    try {
      // 1. Core Web Vitals Monitoring starten (höchste Priorität)
      await this.initializeCoreWebVitals();

      // 2. Google Analytics aktivieren
      await this.initializeGoogleAnalytics();

      // 3. Strukturierte Daten injizieren
      await this.initializeStructuredData();

      // 4. GEO/AEO Content optimieren
      await this.initializeGEOAEOContent();

      // 5. Local SEO aktivieren
      await this.initializeLocalSEO();

      // 6. Internationale SEO konfigurieren
      await this.initializeInternationalSEO();

      // 7. Performance-Monitoring starten
      await this.startPerformanceMonitoring();

      this.isInitialized = true;
      console.log('✅ Alle ZOE Solar SEO Services erfolgreich aktiviert!');

    } catch (error) {
      console.error('❌ Fehler bei der Initialisierung der SEO Services:', error);
    }
  }

  /**
   * Core Web Vitals Monitoring starten
   */
  private async initializeCoreWebVitals(): Promise<void> {
    try {
      coreWebVitalsMonitor.startMonitoring();
      this.serviceStatus['coreWebVitals'] = true;
      console.log('✅ Core Web Vitals Monitoring aktiviert');
    } catch (error) {
      console.error('❌ Core Web Vitals Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['coreWebVitals'] = false;
    }
  }

  /**
   * Google Analytics initialisieren
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    try {
      // Debug-Modus für Entwicklung
      if (location.hostname === 'localhost') {
        googleAnalyticsService.enableDebugMode();
      }

      // Seite als Page View tracken
      googleAnalyticsService.trackPageView();

      // Benutzer-Eigenschaften setzen
      googleAnalyticsService.setUserProperties({
        user_type: 'visitor',
        customer_type: 'prospect',
        service_type: 'solar',
        location: this.detectUserLocation()
      });

      this.serviceStatus['googleAnalytics'] = true;
      console.log('✅ Google Analytics Enhanced aktiviert');
    } catch (error) {
      console.error('❌ Google Analytics Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['googleAnalytics'] = false;
    }
  }

  /**
   * Strukturierte Daten injizieren
   */
  private async initializeStructuredData(): Promise<void> {
    try {
      // Alle erweiterten Schemas injizieren
      structuredDataExtendedService.injectAllExtendedSchemas();

      // Seitenspezifische Schemas basierend auf aktueller URL
      this.injectPageSpecificStructuredData();

      this.serviceStatus['structuredData'] = true;
      console.log('✅ Structured Data Schemas injiziert');
    } catch (error) {
      console.error('❌ Structured Data Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['structuredData'] = false;
    }
  }

  /**
   * GEO/AEO Content optimieren
   */
  private async initializeGEOAEOContent(): Promise<void> {
    try {
      const geoContent = geoAEOContentService.generateGEOOptimizedContent();

      // KI-optimierte Inhaltsblöcke für die Seite vorbereiten
      this.prepareGEOContentForPage(geoContent);

      // Conversation Starter bereitstellen
      this.setupConversationStarters(geoContent.conversation_starters);

      this.serviceStatus['geoAEO'] = true;
      console.log('✅ GEO/AEO Content optimiert');
    } catch (error) {
      console.error('❌ GEO/AEO Content Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['geoAEO'] = false;
    }
  }

  /**
   * Local SEO aktivieren
   */
  private async initializeLocalSEO(): Promise<void> {
    try {
      // NAP-Konsistenz prüfen
      const napCheck = localSEOService.checkNAPConsistency('berlin-hq');

      if (!napCheck.isConsistent) {
        console.warn('⚠️ NAP-Inkonsistenzen gefunden:', napCheck.inconsistencies);
      }

      // Lokale Keywords für die Seite vorbereiten
      this.prepareLocalKeywords();

      this.serviceStatus['localSEO'] = true;
      console.log('✅ Local SEO aktiviert');
    } catch (error) {
      console.error('❌ Local SEO Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['localSEO'] = false;
    }
  }

  /**
   * Internationale SEO konfigurieren
   */
  private async initializeInternationalSEO(): Promise<void> {
    try {
      // Hreflang-Tags für aktuelle Seite generieren
      const currentPage = this.detectCurrentPage();
      const hreflangData = internationalSEOService.generateHreflangTags(currentPage);

      // Hreflang-Tags injizieren
      this.injectHreflangTags(hreflangData.htmlTags);

      // XML Sitemap für hreflang (falls nötig)
      this.setupInternationalSitemaps();

      this.serviceStatus['internationalSEO'] = true;
      console.log('✅ Internationale SEO konfiguriert');
    } catch (error) {
      console.error('❌ Internationale SEO Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['internationalSEO'] = false;
    }
  }

  /**
   * Performance-Monitoring starten
   */
  private async startPerformanceMonitoring(): Promise<void> {
    try {
      // Intervall-Monitoring für fortlaufende Optimierung
      setInterval(() => {
        this.performHealthCheck();
      }, 60000); // Jede Minute

      // Tägliche Performance-Audits
      this.scheduleDailyAudits();

      this.serviceStatus['performanceMonitoring'] = true;
      console.log('✅ Performance-Monitoring gestartet');
    } catch (error) {
      console.error('❌ Performance-Monitoring Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['performanceMonitoring'] = false;
    }
  }

  /**
   * Seitenspezifische strukturierte Daten injizieren
   */
  private injectPageSpecificStructuredData(): void {
    const pageType = this.detectCurrentPage();

    switch (pageType) {
      case 'home':
        // Home Page Schemas
        structuredDataExtendedService.injectAllExtendedSchemas();
        break;
      case 'service':
        // Service Page Schemas
        break;
      case 'location':
        // Location Page Schemas
        break;
      default:
        // Generische Schemas
        break;
    }
  }

  /**
   * GEO Content für die Seite vorbereiten
   */
  private prepareGEOContentForPage(geoContent: any): void {
    // Speichern für die spätere Verwendung in Komponenten
    (window as any).zoeSolarGEOContent = geoContent;
  }

  /**
   * Conversation Starter einrichten
   */
  private setupConversationStarters(starters: any[]): void {
    // Für spätere Verwendung in Chat-Bot oder FAQ-Systemen
    (window as any).zoeSolarConversationStarters = starters;
  }

  /**
   * Lokale Keywords vorbereiten
   */
  private prepareLocalKeywords(): void {
    const keywords = localSEOService.generateLocalKeywords('berlin-hq');
    (window as any).zoeSolarLocalKeywords = keywords;
  }

  /**
   * Hreflang-Tags injizieren
   */
  private injectHreflangTags(tags: string[]): void {
    tags.forEach(tag => {
      const link = document.createElement('link');
      link.outerHTML = tag;
      document.head.appendChild(link);
    });
  }

  /**
   * Internationale Sitemaps einrichten
   */
  private setupInternationalSitemaps(): void {
    // Fügt Links zu internationalen Sitemaps hinzu
    const sitemapLinks = [
      '<link rel="sitemap" type="application/xml" href="/sitemap-international.xml" />',
      '<link rel="sitemap" type="application/xml" href="/sitemap-hreflang.xml" />'
    ];

    sitemapLinks.forEach(link => {
      const linkElement = document.createElement('link');
      linkElement.outerHTML = link;
      document.head.appendChild(linkElement);
    });
  }

  /**
   * Gesundheitscheck durchführen
   */
  private performHealthCheck(): void {
    // Core Web Vitals Status prüfen
    const metrics = coreWebVitalsMonitor.getCurrentMetrics();

    if (metrics.score < 80) {
      console.warn('⚠️ Core Web Vitals Score niedrig:', metrics.score);
    }

    // Service-Status prüfen
    const failedServices = Object.entries(this.serviceStatus)
      .filter(([_, status]) => !status)
      .map(([service, _]) => service);

    if (failedServices.length > 0) {
      console.warn('⚠️ SEO Services mit Problemen:', failedServices);
    }
  }

  /**
   * Tägliche Audits planen
   */
  private scheduleDailyAudits(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0); // 2 Uhr nachts

    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.performDailyAudit();
      // Jeden Tag wiederholen
      setInterval(() => this.performDailyAudit(), 24 * 60 * 60 * 1000);
    }, msUntilTomorrow);
  }

  /**
   * Tägliche Audits durchführen
   */
  private performDailyAudit(): void {
    console.log('🔍 Täglicher SEO Audit wird durchgeführt...');

    // Core Web Vitals Audit
    const currentMetrics = coreWebVitalsMonitor.getCurrentMetrics();
    console.log('Core Web Vitals:', currentMetrics);

    // Local SEO Audit
    try {
      const localAudit = localSEOService.performLocalSEOAudit('berlin-hq');
      console.log('Local SEO Score:', localAudit.overallScore);
    } catch (error) {
      console.error('Local SEO Audit fehlgeschlagen:', error);
    }

    // International SEO Audit
    try {
      const internationalAudit = internationalSEOService.performInternationalTechnicalSEO();
      console.log('International SEO Status:', internationalAudit.hreflangImplementation.coverage);
    } catch (error) {
      console.error('International SEO Audit fehlgeschlagen:', error);
    }
  }

  /**
   * Aktuelle Seite erkennen
   */
  private detectCurrentPage(): string {
    const path = window.location.pathname;

    if (path === '/' || path === '') return 'home';
    if (path.includes('/photovoltaik') || path.includes('/solar')) return 'service';
    if (path.includes('/standort') || path.includes('/kontakt')) return 'location';
    if (path.includes('/wissen') || path.includes('/magazin')) return 'content';

    return 'general';
  }

  /**
   * Benutzer-Standort erkennen
   */
  private detectUserLocation(): string {
    // Aus URL, Cookie oder Browser-API ableiten
    const urlPath = window.location.pathname;

    if (urlPath.includes('/berlin')) return 'berlin';
    if (urlPath.includes('/muenchen')) return 'muenchen';
    if (urlPath.includes('/hamburg')) return 'hamburg';
    if (urlPath.includes('/koeln')) return 'koeln';

    // Fallback zu Browser-Sprache/Standort
    if (navigator.language.includes('de')) return 'deutschland';

    return 'international';
  }

  /**
   * Service-Status abrufen
   */
  public getServiceStatus(): Record<string, boolean> {
    return { ...this.serviceStatus };
  }

  /**
   * Aktuelle Performance-Metriken abrufen
   */
  public getPerformanceMetrics(): any {
    return {
      coreWebVitals: coreWebVitalsMonitor.getCurrentMetrics(),
      auditHistory: coreWebVitalsMonitor.getAuditHistory(),
      sessionInfo: googleAnalyticsService.getSessionInfo(),
      userProperties: googleAnalyticsService.getCurrentUserProperties()
    };
  }

  /**
   * SEO-Report generieren
   */
  public generateSEOReport(): any {
    return {
      timestamp: new Date().toISOString(),
      services: this.getServiceStatus(),
      performance: this.getPerformanceMetrics(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Empfehlungen basierend auf aktuellem Status generieren
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = coreWebVitalsMonitor.getCurrentMetrics();

    if (metrics.lcp > 2500) {
      recommendations.push('Largest Contentful Paint (LCP) optimieren - Bilder vorladen, Critical CSS reduzieren');
    }

    if (metrics.fid > 100) {
      recommendations.push('First Input Delay (FID) reduzieren - JavaScript optimieren, Code Splitting implementieren');
    }

    if (metrics.cls > 0.1) {
      recommendations.push('Cumulative Layout Shift (CLS) minimieren - Bild-Dimensionen angeben, Font-Display optimieren');
    }

    if (!this.serviceStatus['localSEO']) {
      recommendations.push('Local SEO Service überprüfen und reparieren');
    }

    if (!this.serviceStatus['internationalSEO']) {
      recommendations.push('Internationale SEO-Konfiguration überprüfen');
    }

    return recommendations;
  }
}

// Singleton-Instanz erstellen und global verfügbar machen
const seoServicesManager = new SEOServicesManager();

// Global für einfachen Zugriff und Debugging
if (typeof window !== 'undefined') {
  window.zoeSolarSEO = seoServicesManager;
}

export default seoServicesManager;

// Types für globale Erweiterung
declare global {
  interface Window {
    zoeSolarSEO: typeof seoServicesManager;
    zoeSolarGEOContent?: any;
    zoeSolarConversationStarters?: any;
    zoeSolarLocalKeywords?: any;
  }
}