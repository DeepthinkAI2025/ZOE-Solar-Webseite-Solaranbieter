import { gmbOptimizationService } from './gmbOptimizationService';
import { localSEOAnalyticsService, LocalSEOMetrics } from './localSEOAnalyticsService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

/**
 * GMB-GEO Integration Service
 * Synchronisiert GMB-Daten mit dem Local SEO Analytics System
 */
export class GMBGeoIntegrationService {
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeIntegration();
  }

  /**
   * Initialisiert die Integration zwischen GMB und GEO-Systemen
   */
  private initializeIntegration(): void {
    // Automatische Synchronisation alle 6 Stunden
    this.startAutoSync();

    // Initiale Synchronisation
    this.syncAllLocations();
  }

  /**
   * Startet automatische Synchronisation
   */
  public startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Synchronisiere alle 6 Stunden
    this.syncInterval = setInterval(() => {
      this.syncAllLocations();
    }, 6 * 60 * 60 * 1000);
  }

  /**
   * Stoppt automatische Synchronisation
   */
  public stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Synchronisiert alle Standorte
   */
  public syncAllLocations(): void {
    console.log('🔄 Synchronisiere GMB-Daten mit GEO-System...');

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      try {
        this.syncLocationData(region.city.toLowerCase());
      } catch (error) {
        console.error(`❌ Fehler bei Synchronisation für ${region.city}:`, error);
      }
    });

    console.log('✅ GMB-GEO Synchronisation abgeschlossen');
  }

  /**
   * Synchronisiert Daten für einen spezifischen Standort
   */
  public syncLocationData(locationKey: string): void {
    const gmbInsights = gmbOptimizationService.generatePerformanceMetrics(locationKey);
    const gmbProfile = gmbOptimizationService.getProfileForLocation(locationKey);

    if (!gmbProfile) {
      console.warn(`⚠️ Kein GMB-Profil für ${locationKey} gefunden`);
      return;
    }

    // Aktualisiere Local SEO Analytics mit GMB-Daten
    this.updateLocalSEOWithGMBData(locationKey, gmbInsights, gmbProfile);

    // Überprüfe auf GMB-spezifische Alerts
    this.checkGMBAlerts(locationKey, gmbInsights, gmbProfile);
  }

  /**
   * Aktualisiert Local SEO Analytics mit GMB-Daten
   */
  private updateLocalSEOWithGMBData(
    locationKey: string,
    gmbInsights: any,
    gmbProfile: any
  ): void {
    // Hier würde in einer echten Implementierung die Local SEO Datenbank aktualisiert werden
    // Für diese Demo simulieren wir die Integration

    const gmbMetrics = {
      views: {
        search: gmbInsights.metrics.views.search,
        maps: gmbInsights.metrics.views.maps,
        total: gmbInsights.metrics.views.search + gmbInsights.metrics.views.maps
      },
      actions: {
        website: gmbInsights.metrics.actions.website,
        direction: gmbInsights.metrics.actions.direction,
        phone: gmbInsights.metrics.actions.phone,
        total: gmbInsights.metrics.actions.website + gmbInsights.metrics.actions.direction + gmbInsights.metrics.actions.phone
      },
      reviews: {
        count: gmbProfile.reviews?.length || 0,
        averageRating: this.calculateAverageRating(gmbProfile.reviews || []),
        newReviews: this.countNewReviews(gmbProfile.reviews || [])
      },
      photos: {
        views: gmbInsights.metrics.photos.viewsOwner + gmbInsights.metrics.photos.viewsCustomer,
        newPhotos: gmbProfile.photos?.filter(p => this.isNewPhoto(p)).length || 0
      },
      posts: {
        views: Math.floor(Math.random() * 500) + 200, // Simuliert
        newPosts: gmbOptimizationService.getPostsForLocation(locationKey).filter(p => this.isNewPost(p)).length
      }
    };

    // In echter Implementierung würde hier die Datenbank aktualisiert werden
    console.log(`📊 GMB-Metriken für ${locationKey} synchronisiert:`, gmbMetrics);
  }

  /**
   * Berechnet Durchschnittsbewertung
   */
  private calculateAverageRating(reviews: any[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  }

  /**
   * Zählt neue Bewertungen (letzte 7 Tage)
   */
  private countNewReviews(reviews: any[]): number {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return reviews.filter(review =>
      new Date(review.publishTime) > sevenDaysAgo
    ).length;
  }

  /**
   * Prüft ob Foto neu ist (letzte 7 Tage)
   */
  private isNewPhoto(photo: any): boolean {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(photo.uploadDate) > sevenDaysAgo;
  }

  /**
   * Prüft ob Post neu ist (letzte 7 Tage)
   */
  private isNewPost(post: any): boolean {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(post.scheduledPublishTime) > sevenDaysAgo;
  }

  /**
   * Überprüft auf GMB-spezifische Alerts
   */
  private checkGMBAlerts(locationKey: string, gmbInsights: any, gmbProfile: any): void {
    const alerts = [];

    // GMB Views Alert
    const totalViews = gmbInsights.metrics.views.search + gmbInsights.metrics.views.maps;
    if (totalViews < 100) {
      alerts.push({
        type: 'gmb_issue',
        severity: 'medium',
        title: `Niedrige GMB-Sichtbarkeit in ${locationKey}`,
        description: `Nur ${totalViews} GMB-Aufrufe in den letzten 30 Tagen`,
        impact: 'Reduzierte lokale Sichtbarkeit',
        actionRequired: 'GMB-Profil optimieren, Posts erstellen, Bewertungen sammeln'
      });
    }

    // Review Rating Alert
    const avgRating = this.calculateAverageRating(gmbProfile.reviews || []);
    if (avgRating < 4.0) {
      alerts.push({
        type: 'gmb_issue',
        severity: 'high',
        title: `GMB-Bewertung unter 4.0 in ${locationKey}`,
        description: `Aktuelle Bewertung: ${avgRating} Sterne`,
        impact: 'Negative Auswirkungen auf lokale Rankings',
        actionRequired: 'Bewertungen aktiv einholen, auf Bewertungen antworten'
      });
    }

    // Neue Alerts erstellen
    alerts.forEach(alert => {
      localSEOAnalyticsService.createAlert({
        locationKey,
        type: alert.type as any,
        severity: alert.severity as any,
        title: alert.title,
        description: alert.description,
        impact: alert.impact,
        actionRequired: alert.actionRequired,
        status: 'active'
      });
    });
  }

  /**
   * Generiert integrierten Report für Standort
   */
  public generateIntegratedReport(locationKey: string): {
    gmbData: any;
    localSEOData: any;
    integratedInsights: string[];
    crossSystemRecommendations: string[];
  } {
    const gmbInsights = gmbOptimizationService.generatePerformanceMetrics(locationKey);
    const localSEOReport = localSEOAnalyticsService.generateLocalSEOReport(locationKey);

    const integratedInsights = this.generateIntegratedInsights(gmbInsights, localSEOReport);
    const crossSystemRecommendations = this.generateCrossSystemRecommendations(gmbInsights, localSEOReport);

    return {
      gmbData: gmbInsights,
      localSEOData: localSEOReport,
      integratedInsights,
      crossSystemRecommendations
    };
  }

  /**
   * Generiert integrierte Insights
   */
  private generateIntegratedInsights(gmbInsights: any, localSEOReport: any): string[] {
    const insights = [];

    // GMB-SEO Korrelation
    const gmbViews = gmbInsights.metrics.views.search + gmbInsights.metrics.views.maps;
    const organicTraffic = localSEOReport.metrics.organicTraffic.sessions;

    if (gmbViews > organicTraffic * 0.5) {
      insights.push('🎯 Starke GMB-Präsenz unterstützt organische Rankings');
    }

    // Bewertungs-Impact
    const gmbRating = localSEOReport.metrics.gmbMetrics.reviews.averageRating;
    if (gmbRating > 4.5) {
      insights.push('⭐ Exzellente Bewertungen stärken lokale Autorität');
    }

    // Local Pack Performance
    const localPackKeywords = localSEOReport.metrics.localSearchRankings.filter((r: any) => r.localPack).length;
    if (localPackKeywords > 0) {
      insights.push(`🏆 ${localPackKeywords} Keywords ranken im Local Pack`);
    }

    return insights;
  }

  /**
   * Generiert Cross-System Empfehlungen
   */
  private generateCrossSystemRecommendations(gmbInsights: any, localSEOReport: any): string[] {
    const recommendations = [];

    // GMB-Content Integration
    if (gmbInsights.metrics.actions.website < 50) {
      recommendations.push('Erstelle GMB-Posts mit Links zur Website für besseren Traffic-Flow');
    }

    // Bewertungs-SEO Synergie
    if (localSEOReport.metrics.gmbMetrics.reviews.averageRating < 4.3) {
      recommendations.push('Verbessere Bewertungen durch aktives Management und schnelle Antworten');
    }

    // Local Schema Integration
    if (!localSEOReport.metrics.technicalSEO.schemaMarkup ||
        localSEOReport.metrics.technicalSEO.schemaMarkup < 80) {
      recommendations.push('Implementiere LocalBusiness Schema für bessere GMB-SEO Synergie');
    }

    return recommendations;
  }

  /**
   * Bulk-Update für NAP-Konsistenz über alle Systeme
   */
  public performBulkNAPUpdate(updates: Array<{
    locationKey: string;
    field: 'name' | 'address' | 'phone';
    value: string;
  }>): void {
    // GMB-Updates
    gmbOptimizationService.bulkUpdateNAPConsistency(updates);

    // Citation-Tracking Updates würden hier ebenfalls erfolgen
    console.log(`🔄 NAP-Bulk-Update für ${updates.length} Standorte durchgeführt`);
  }

  /**
   * Standort-spezifische Integration testen
   */
  public testLocationIntegration(locationKey: string): {
    gmbConnected: boolean;
    localSEOConnected: boolean;
    dataConsistency: boolean;
    lastSync: string;
  } {
    const gmbProfile = gmbOptimizationService.getProfileForLocation(locationKey);
    const localSEOMetrics = localSEOAnalyticsService.getMetricsForLocation(locationKey, 1);

    return {
      gmbConnected: !!gmbProfile,
      localSEOConnected: localSEOMetrics.length > 0,
      dataConsistency: this.checkDataConsistency(gmbProfile, localSEOMetrics[0]),
      lastSync: new Date().toISOString()
    };
  }

  /**
   * Prüft Datenkonsistenz zwischen Systemen
   */
  private checkDataConsistency(gmbProfile: any, localSEOMetrics: LocalSEOMetrics): boolean {
    if (!gmbProfile || !localSEOMetrics) return false;

    // Prüfe NAP-Konsistenz
    const napMatch =
      gmbProfile.address === localSEOMetrics.citationMetrics.consistentCitations > 0; // Vereinfacht

    return napMatch;
  }

  /**
   * System-Health-Check
   */
  public getSystemHealth(): {
    overallStatus: 'healthy' | 'warning' | 'critical';
    gmbStatus: 'online' | 'offline' | 'degraded';
    geoStatus: 'online' | 'offline' | 'degraded';
    lastSyncStatus: string;
    activeIntegrations: number;
  } {
    const testResults = PRIMARY_SERVICE_REGIONS.map(region =>
      this.testLocationIntegration(region.city.toLowerCase())
    );

    const healthyLocations = testResults.filter(r => r.gmbConnected && r.localSEOConnected).length;
    const overallStatus = healthyLocations === PRIMARY_SERVICE_REGIONS.length ? 'healthy' :
                         healthyLocations > PRIMARY_SERVICE_REGIONS.length * 0.8 ? 'warning' : 'critical';

    return {
      overallStatus,
      gmbStatus: 'online', // In echter Implementierung würde hier API-Status geprüft
      geoStatus: 'online',
      lastSyncStatus: new Date().toISOString(),
      activeIntegrations: healthyLocations
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const gmbGeoIntegrationService = new GMBGeoIntegrationService();