/**
 * SEO Services Entry Point - ZOE Solar (Updated with Free Analytics)
 *
 * Zentraler Einstiegspunkt für alle SEO-Optimierungs-Services
 * Jetzt mit 100% kostenloser Analytics-Lösung!
 */

// Core Services importieren
export { coreWebVitalsMonitor } from './core-web-vitals-monitor';
export { freeAnalyticsService } from './free-analytics-service';
export { structuredDataExtendedService } from './structured-data-extended';
export { geoAEOContentService } from './geo-aeo-content-service';
export { localSEOService } from './local-seo-optimization-service';
export { internationalSEOService } from './international-seo-service';

// Default-Export für einfachen Import
import { coreWebVitalsMonitor } from './core-web-vitals-monitor';
import { freeAnalyticsService } from './free-analytics-service';
import { structuredDataExtendedService } from './structured-data-extended';
import { geoAEOContentService } from './geo-aeo-content-service';
import { localSEOService } from './local-seo-optimization-service';
import { internationalSEOService } from './international-seo-service';

/**
 * SEO Services Manager - Koordiniert alle SEO-Services
 * Jetzt mit 100% kostenloser Analytics!
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

    console.log('🚀 ZOE Solar SEO Services werden initialisiert (mit kostenloser Analytics)...');

    try {
      // 1. Free Analytics starten (höchste Priorität)
      await this.initializeFreeAnalytics();

      // 2. Core Web Vitals Monitoring starten
      await this.initializeCoreWebVitals();

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
      console.log('✅ Alle ZOE Solar SEO Services erfolgreich aktiviert (inkl. kostenloser Analytics)!');

    } catch (error) {
      console.error('❌ Fehler bei der Initialisierung der SEO Services:', error);
    }
  }

  /**
   * Free Analytics initialisieren (100% kostenlos!)
   */
  private async initializeFreeAnalytics(): Promise<void> {
    try {
      // Free Analytics ist bereits im Konstruktor aktiviert
      // Page View automatisch tracken
      freeAnalyticsService.trackPageView();

      this.serviceStatus['freeAnalytics'] = true;
      console.log('✅ Free Analytics (Plausible, Simple Analytics, Umami) aktiviert');

      // Demo-Daten für CLI importieren
      this.importDemoData();

    } catch (error) {
      console.error('❌ Free Analytics Initialisierung fehlgeschlagen:', error);
      this.serviceStatus['freeAnalytics'] = false;
    }
  }

  /**
   * Demo-Daten importieren
   */
  private importDemoData(): void {
    // Importiere Beispiel-Daten für CLI-Dashboard
    try {
      const sampleData = {
        sessions: [
          {
            sessionId: 'demo_session_001',
            startTime: Date.now() - 3600000,
            endTime: Date.now() - 1800000,
            duration: 1800000,
            pageViews: 5,
            events: 3,
            userAgent: navigator.userAgent,
            converted: true
          }
        ],
        pageViews: [
          {
            path: '/',
            title: 'ZOE Solar - Photovoltaik für Unternehmen',
            timestamp: Date.now() - 3600000,
            sessionId: 'demo_session_001'
          }
        ],
        events: [
          {
            name: 'page_view',
            timestamp: Date.now() - 3600000,
            sessionId: 'demo_session_001',
            parameters: { page: '/' }
          }
        ]
      };

      // Speichere Demo-Daten für CLI
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('free_analytics_demo_data', JSON.stringify(sampleData));
      }

    } catch (error) {
      console.warn('Demo-Daten konnten nicht importiert werden:', error);
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
   * Gesundheitscheck durchführen
   */
  private performHealthCheck(): void {
    // Free Analytics Status prüfen
    if (freeAnalyticsService && typeof freeAnalyticsService.isTrackingEnabled === 'function') {
      const trackingEnabled = freeAnalyticsService.isTrackingEnabled();
      if (!trackingEnabled) {
        console.warn('⚠️ Free Analytics ist deaktiviert');
      }
    }

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
   * Service-Status abrufen
   */
  public getServiceStatus(): Record<string, boolean> {
    return { ...this.serviceStatus };
  }

  /**
   * Aktuelle Performance-Metriken abrufen (inkl. Free Analytics)
   */
  public getPerformanceMetrics(): any {
    return {
      coreWebVitals: coreWebVitalsMonitor.getCurrentMetrics(),
      freeAnalytics: freeAnalyticsService ? freeAnalyticsService.generateAnalyticsReport() : null,
      auditHistory: coreWebVitalsMonitor.getAuditHistory(),
      sessionInfo: this.getSessionInfo()
    };
  }

  /**
   * Session-Informationen abrufen
   */
  private getSessionInfo(): any {
    if (freeAnalyticsService) {
      return {
        trackingEnabled: freeAnalyticsService.isTrackingEnabled(),
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      };
    }
    return null;
  }

  /**
   * Session ID abrufen
   */
  private getSessionId(): string {
    return sessionStorage.getItem('free_analytics_session_id') || 'unknown';
  }

  /**
   * User ID abrufen
   */
  private getUserId(): string | null {
    return localStorage.getItem('free_analytics_user_id') || null;
  }

  /**
   * SEO-Report generieren (inkl. Free Analytics)
   */
  public generateSEOReport(): any {
    const baseReport = {
      timestamp: new Date().toISOString(),
      services: this.getServiceStatus(),
      performance: this.getPerformanceMetrics(),
      recommendations: this.generateRecommendations(),
      freeAnalyticsEnabled: true
    };

    // Free Analytics spezifische Daten hinzufügen
    if (freeAnalyticsService) {
      baseReport.freeAnalyticsReport = freeAnalyticsService.generateAnalyticsReport();
    }

    return baseReport;
  }

  /**
   * Empfehlungen basierend auf aktuellem Status generieren
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Free Analytics Empfehlungen
    if (!this.serviceStatus['freeAnalytics']) {
      recommendations.push('Free Analytics Service überprüfen und reparieren');
    }

    // Core Web Vitals Empfehlungen
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

    // Local SEO Empfehlungen
    if (!this.serviceStatus['localSEO']) {
      recommendations.push('Local SEO Service überprüfen und reparieren');
    }

    // International SEO Empfehlungen
    if (!this.serviceStatus['internationalSEO']) {
      recommendations.push('Internationale SEO-Konfiguration überprüfen');
    }

    return recommendations;
  }

  /**
   * CLI-Kommando für Analytics Dashboard ausführen
   */
  public async runAnalyticsCLI(command: string = 'dashboard'): Promise<void> {
    const AnalyticsCLI = require('../scripts/free-analytics-cli.js');
    const cli = new AnalyticsCLI();

    console.log('🔧 Führe Free Analytics CLI aus...');
    cli.run(command);
  }
}

// Singleton-Instanz erstellen und global verfügbar machen
const seoServicesManager = new SEOServicesManager();

// Global für einfachen Zugriff und Debugging
if (typeof window !== 'undefined') {
  window.zoeSolarSEO = seoServicesManager;
  window.analytics = freeAnalyticsService; // Kompatibilität mit gtag()
}

export default seoServicesManager;

// Types für globale Erweiterung
declare global {
  interface Window {
    zoeSolarSEO: typeof seoServicesManager;
    analytics: typeof freeAnalyticsService; // gtag() Kompatibilität
    zoeSolarGEOContent?: any;
    zoeSolarConversationStarters?: any;
    zoeSolarLocalKeywords?: any;
  }
}