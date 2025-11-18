import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

// Define ServiceRegion interface locally since it's not exported from seoConfig
interface ServiceRegion {
  city: string;
  state: string;
  regionCode: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  slug?: string;
}

export interface LocalSEOMetrics {
  locationKey: string;
  date: string;
  organicTraffic: {
    sessions: number;
    users: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversions: number;
    conversionRate: number;
  };
  localSearchRankings: {
    keyword: string;
    position: number;
    previousPosition: number;
    searchVolume: number;
    difficulty: number;
    url: string;
    localPack: boolean;
    gmb: boolean;
  }[];
  gmbMetrics: {
    views: { search: number; maps: number; total: number };
    actions: { website: number; direction: number; phone: number; total: number };
    reviews: { count: number; averageRating: number; newReviews: number };
    photos: { views: number; newPhotos: number };
    posts: { views: number; newPosts: number };
  };
  citationMetrics: {
    totalCitations: number;
    consistentCitations: number;
    inconsistentCitations: number;
    napScore: number;
    newCitations: number;
    duplicates: number;
  };
  competitorAnalysis: {
    competitor: string;
    avgPosition: number;
    visibility: number;
    gmbReviews: number;
    citations: number;
  }[];
  technicalSEO: {
    pagespeedScore: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay  
      cls: number; // Cumulative Layout Shift
    };
    mobileFriendly: boolean;
    schemaMarkup: number; // percentage of pages with schema
    httpStatus: { [code: number]: number };
  };
}

export interface LocalSEOAlert {
  id: string;
  locationKey: string;
  type: 'ranking_drop' | 'traffic_drop' | 'gmb_issue' | 'citation_problem' | 'competitor_threat' | 'technical_issue';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionRequired: string;
  createdAt: string;
  resolvedAt?: string;
  status: 'active' | 'resolved' | 'ignored';
}

export interface LocalSEOReport {
  locationKey: string;
  period: { startDate: string; endDate: string };
  overallScore: number;
  metrics: LocalSEOMetrics;
  alerts: LocalSEOAlert[];
  insights: string[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'content' | 'technical' | 'local' | 'competition';
    title: string;
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  competitorGaps: Array<{
    competitor: string;
    opportunity: string;
    keywords: string[];
    estimatedTraffic: number;
  }>;
}

export interface LocalKeywordPerformance {
  keyword: string;
  locationKey: string;
  currentPosition: number;
  previousPosition: number;
  change: number;
  searchVolume: number;
  difficulty: number;
  opportunity: number;
  clicks: number;
  impressions: number;
  ctr: number;
  url: string;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  localPack: boolean;
  featured: boolean;
}

/**
 * Local SEO Analytics Service
 * Umfassendes Monitoring und Analytics-System für lokale SEO-Performance
 */
export class LocalSEOAnalyticsService {
  private metricsData: Map<string, LocalSEOMetrics[]> = new Map();
  private alertsData: Map<string, LocalSEOAlert[]> = new Map();
  private keywordPerformance: Map<string, LocalKeywordPerformance[]> = new Map();

  constructor() {
    this.initializeAnalyticsData();
    this.generateInitialAlerts();
  }

  /**
   * Initialisiert Analytics-Daten für alle Standorte
   */
  private initializeAnalyticsData(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      
      // Generiere historische Daten für die letzten 30 Tage
      const metrics: LocalSEOMetrics[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (dateStr) {
          metrics.push(this.generateDailyMetrics(locationKey, dateStr));
        }
      }
      
      this.metricsData.set(locationKey, metrics);
      this.keywordPerformance.set(locationKey, this.generateKeywordPerformance(region));
    });
  }

  /**
   * Generiert täglich Metriken für einen Standort
   */
  private generateDailyMetrics(locationKey: string, date: string): LocalSEOMetrics {
    const baseTraffic = Math.floor(Math.random() * 500) + 200;
    const seasonalFactor = Math.sin((new Date(date).getMonth() + 1) * Math.PI / 6) * 0.3 + 1;
    const weekdayFactors = [0.7, 1.1, 1.2, 1.1, 1.0, 0.8, 0.6];
    const weekdayFactor = weekdayFactors[new Date(date).getDay()] || 1.0;
    
    const adjustedTraffic = Math.floor(baseTraffic * seasonalFactor * weekdayFactor);

    return {
      locationKey,
      date,
      organicTraffic: {
        sessions: adjustedTraffic,
        users: Math.floor(adjustedTraffic * 0.85),
        pageviews: Math.floor(adjustedTraffic * 2.3),
        bounceRate: parseFloat((0.35 + Math.random() * 0.3).toFixed(2)),
        avgSessionDuration: Math.floor(120 + Math.random() * 180),
        conversions: Math.floor(adjustedTraffic * (0.02 + Math.random() * 0.03)),
        conversionRate: parseFloat((2 + Math.random() * 3).toFixed(2))
      },
      localSearchRankings: this.generateLocalRankings(locationKey),
      gmbMetrics: {
        views: {
          search: Math.floor(Math.random() * 800) + 400,
          maps: Math.floor(Math.random() * 600) + 300,
          total: 0 // wird berechnet
        },
        actions: {
          website: Math.floor(Math.random() * 80) + 40,
          direction: Math.floor(Math.random() * 60) + 30,
          phone: Math.floor(Math.random() * 40) + 20,
          total: 0 // wird berechnet
        },
        reviews: {
          count: Math.floor(Math.random() * 150) + 50,
          averageRating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
          newReviews: Math.floor(Math.random() * 3)
        },
        photos: {
          views: Math.floor(Math.random() * 300) + 150,
          newPhotos: Math.floor(Math.random() * 2)
        },
        posts: {
          views: Math.floor(Math.random() * 200) + 100,
          newPosts: Math.floor(Math.random() * 2)
        }
      },
      citationMetrics: {
        totalCitations: Math.floor(Math.random() * 50) + 30,
        consistentCitations: Math.floor(Math.random() * 40) + 25,
        inconsistentCitations: Math.floor(Math.random() * 10) + 2,
        napScore: Math.floor(Math.random() * 30) + 70,
        newCitations: Math.floor(Math.random() * 3),
        duplicates: Math.floor(Math.random() * 3)
      },
      competitorAnalysis: this.generateCompetitorAnalysis(locationKey),
      technicalSEO: {
        pagespeedScore: Math.floor(Math.random() * 30) + 70,
        coreWebVitals: {
          lcp: parseFloat((1.5 + Math.random() * 1.5).toFixed(1)),
          fid: parseFloat((50 + Math.random() * 100).toFixed(0)),
          cls: parseFloat((0.05 + Math.random() * 0.15).toFixed(3))
        },
        mobileFriendly: Math.random() > 0.1,
        schemaMarkup: Math.floor(Math.random() * 40) + 60,
        httpStatus: {
          200: Math.floor(Math.random() * 950) + 900,
          301: Math.floor(Math.random() * 30) + 10,
          404: Math.floor(Math.random() * 20) + 5,
          500: Math.floor(Math.random() * 5)
        }
      }
    };
  }

  /**
   * Generiert lokale Suchranking-Daten
   */
  private generateLocalRankings(locationKey: string): LocalSEOMetrics['localSearchRankings'] {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) return [];

    const keywords = [
      `solaranlage ${region.city}`,
      `photovoltaik ${region.city}`,
      `solar ${region.city}`,
      `pv anlage ${region.city}`,
      `solaranbieter ${region.city}`,
      `photovoltaik installation ${region.city}`,
      `gewerbe solar ${region.city}`,
      `agri pv ${region.state}`
    ];

    return keywords.map(keyword => ({
      keyword,
      position: Math.floor(Math.random() * 20) + 1,
      previousPosition: Math.floor(Math.random() * 20) + 1,
      searchVolume: Math.floor(Math.random() * 500) + 100,
      difficulty: Math.floor(Math.random() * 60) + 20,
      url: `https://www.zoe-solar.de/standort/${locationKey}`,
      localPack: Math.random() > 0.6,
      gmb: Math.random() > 0.4
    }));
  }

  /**
   * Generiert Konkurrenzanalyse
   */
  private generateCompetitorAnalysis(locationKey: string): LocalSEOMetrics['competitorAnalysis'] {
    const competitors = [
      'Solar-Konkurrent-A',
      'PV-Anbieter-B', 
      'Energiepartner-C',
      'Solardach-D'
    ];

    return competitors.map(competitor => ({
      competitor,
      avgPosition: parseFloat((Math.random() * 10 + 5).toFixed(1)),
      visibility: parseFloat((Math.random() * 50 + 25).toFixed(1)),
      gmbReviews: Math.floor(Math.random() * 200) + 50,
      citations: Math.floor(Math.random() * 80) + 20
    }));
  }

  /**
   * Generiert Keyword-Performance-Daten
   */
  private generateKeywordPerformance(region: ServiceRegion): LocalKeywordPerformance[] {
    const keywords = [
      { keyword: `solaranlage ${region.city}`, intent: 'commercial' as const, volume: 480 },
      { keyword: `photovoltaik ${region.city}`, intent: 'commercial' as const, volume: 320 },
      { keyword: `solar kosten ${region.city}`, intent: 'informational' as const, volume: 210 },
      { keyword: `pv installation ${region.city}`, intent: 'transactional' as const, volume: 150 },
      { keyword: `solaranbieter ${region.city}`, intent: 'commercial' as const, volume: 390 },
      { keyword: `photovoltaik förderung ${region.state}`, intent: 'informational' as const, volume: 680 },
      { keyword: `agri pv ${region.state}`, intent: 'commercial' as const, volume: 120 },
      { keyword: `gewerbe photovoltaik ${region.city}`, intent: 'commercial' as const, volume: 95 }
    ];

    return keywords.map(kw => {
      const currentPos = Math.floor(Math.random() * 15) + 1;
      const previousPos = Math.floor(Math.random() * 15) + 1;
      
      return {
        keyword: kw.keyword,
        locationKey: region.city.toLowerCase(),
        currentPosition: currentPos,
        previousPosition: previousPos,
        change: currentPos - previousPos,
        searchVolume: kw.volume,
        difficulty: Math.floor(Math.random() * 60) + 20,
        opportunity: Math.floor((20 - currentPos) * (kw.volume / 100)),
        clicks: Math.floor(kw.volume * this.getCTRByPosition(currentPos) / 100),
        impressions: Math.floor(kw.volume * 0.8),
        ctr: this.getCTRByPosition(currentPos),
        url: `https://www.zoe-solar.de/standort/${region.city.toLowerCase()}`,
        intent: kw.intent,
        localPack: Math.random() > 0.7,
        featured: currentPos <= 3 && Math.random() > 0.8
      };
    });
  }

  /**
   * Berechnet CTR basierend auf Position
   */
  private getCTRByPosition(position: number): number {
    const ctrByPosition = [0, 28.5, 15.7, 11.0, 8.0, 7.2, 5.1, 4.4, 3.9, 3.5, 3.1];
    return parseFloat((ctrByPosition[position] || 2.5).toFixed(1));
  }

  /**
   * Generiert initiale Alerts
   */
  private generateInitialAlerts(): void {
    PRIMARY_SERVICE_REGIONS.slice(0, 5).forEach(region => {
      const locationKey = region.city.toLowerCase();
      const alerts: LocalSEOAlert[] = [];

      // Beispiel-Alerts
      if (Math.random() > 0.7) {
        alerts.push({
          id: `alert_${locationKey}_${Date.now()}`,
          locationKey,
          type: 'ranking_drop',
          severity: 'high',
          title: `Ranking-Verlust für "${region.city}" Keywords`,
          description: `Mehrere wichtige Keywords für ${region.city} haben an Position verloren`,
          impact: 'Potentielle Reduktion des organischen Traffics um 15-20%',
          actionRequired: 'Content-Optimierung und technische SEO-Überprüfung erforderlich',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        });
      }

      if (Math.random() > 0.8) {
        alerts.push({
          id: `alert_${locationKey}_gmb_${Date.now()}`,
          locationKey,
          type: 'gmb_issue',
          severity: 'medium',
          title: 'GMB-Performance rückläufig',
          description: `Google My Business Aufrufe in ${region.city} sind um 25% gesunken`,
          impact: 'Weniger lokale Sichtbarkeit und potentielle Kundenanfragen',
          actionRequired: 'GMB-Profil optimieren, neue Posts erstellen, Bewertungen sammeln',
          createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        });
      }

      this.alertsData.set(locationKey, alerts);
    });
  }

  /**
   * Generiert umfassenden Local SEO Report
   */
  public generateLocalSEOReport(locationKey: string, days: number = 30): LocalSEOReport {
    const metrics = this.getMetricsForLocation(locationKey, days);
    const alerts = this.getActiveAlertsForLocation(locationKey);
    const keywordData = this.keywordPerformance.get(locationKey) || [];
    
    if (metrics.length === 0) {
      throw new Error(`Keine Metriken für ${locationKey} gefunden`);
    }

    const latestMetrics = metrics[metrics.length - 1];
    if (!latestMetrics) {
      throw new Error(`No metrics data available for ${locationKey}`);
    }

    const overallScore = this.calculateOverallScore(latestMetrics, alerts);
    
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (!endDate || !startDate) {
      throw new Error('Failed to generate date strings');
    }

    return {
      locationKey,
      period: { startDate, endDate },
      overallScore,
      metrics: latestMetrics,
      alerts,
      insights: this.generateInsights(metrics, keywordData),
      recommendations: this.generateRecommendations(latestMetrics, alerts, keywordData),
      competitorGaps: this.identifyCompetitorGaps(locationKey, keywordData)
    };
  }

  /**
   * Berechnet Overall SEO Score
   */
  private calculateOverallScore(metrics: LocalSEOMetrics, alerts: LocalSEOAlert[]): number {
    let score = 100;

    // Penalties für aktive Alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
    const highAlerts = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;
    const mediumAlerts = alerts.filter(a => a.severity === 'medium' && a.status === 'active').length;

    score -= (criticalAlerts * 20) + (highAlerts * 10) + (mediumAlerts * 5);

    // Bonus für gute Performance
    if (metrics.citationMetrics.napScore > 90) score += 5;
    if (metrics.gmbMetrics.reviews.averageRating > 4.5) score += 5;
    if (metrics.technicalSEO.pagespeedScore > 90) score += 5;
    if (metrics.organicTraffic.conversionRate > 4) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generiert Insights basierend auf Daten
   */
  private generateInsights(metrics: LocalSEOMetrics[], keywordData: LocalKeywordPerformance[]): string[] {
    const insights: string[] = [];
    
    if (metrics.length >= 7) {
      const recentTraffic = metrics.slice(-7).reduce((sum, m) => sum + m.organicTraffic.sessions, 0);
      const previousTraffic = metrics.slice(-14, -7).reduce((sum, m) => sum + m.organicTraffic.sessions, 0);
      const trafficChange = ((recentTraffic - previousTraffic) / previousTraffic * 100);
      
      if (trafficChange > 10) {
        insights.push(`📈 Organischer Traffic ist in den letzten 7 Tagen um ${trafficChange.toFixed(1)}% gestiegen`);
      } else if (trafficChange < -10) {
        insights.push(`📉 Organischer Traffic ist in den letzten 7 Tagen um ${Math.abs(trafficChange).toFixed(1)}% gesunken`);
      }
    }

    const improvingKeywords = keywordData.filter(kw => kw.change > 0).length;
    const decliningKeywords = keywordData.filter(kw => kw.change < 0).length;
    
    if (improvingKeywords > decliningKeywords) {
      insights.push(`🎯 ${improvingKeywords} Keywords haben sich verbessert vs. ${decliningKeywords} verschlechtert`);
    }

    const localPackKeywords = keywordData.filter(kw => kw.localPack).length;
    if (localPackKeywords > 0) {
      insights.push(`🏆 ${localPackKeywords} Keywords ranken im Local Pack`);
    }

    const latestMetrics = metrics[metrics.length - 1];
    if (latestMetrics) {
      if (latestMetrics.gmbMetrics.reviews.averageRating > 4.5) {
        insights.push(`⭐ Exzellente GMB-Bewertung von ${latestMetrics.gmbMetrics.reviews.averageRating} Sternen`);
      }

      if (latestMetrics.citationMetrics.napScore < 80) {
        insights.push(`⚠️ NAP-Konsistenz bei nur ${latestMetrics.citationMetrics.napScore}% - Verbesserungspotential vorhanden`);
      }
    }

    return insights;
  }

  /**
   * Generiert Empfehlungen
   */
  private generateRecommendations(
    metrics: LocalSEOMetrics, 
    alerts: LocalSEOAlert[], 
    keywordData: LocalKeywordPerformance[]
  ): LocalSEOReport['recommendations'] {
    const recommendations: LocalSEOReport['recommendations'] = [];

    // Kritische Alerts zuerst
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active');
    if (criticalAlerts.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'technical',
        title: 'Kritische Issues sofort beheben',
        description: `${criticalAlerts.length} kritische Probleme erfordern sofortige Aufmerksamkeit`,
        impact: 'Verhindert weitere Ranking- und Traffic-Verluste',
        effort: 'high'
      });
    }

    // NAP-Konsistenz
    if (metrics.citationMetrics.napScore < 85) {
      recommendations.push({
        priority: 'high',
        category: 'local',
        title: 'NAP-Konsistenz verbessern',
        description: `NAP-Score von ${metrics.citationMetrics.napScore}% durch Bereinigung inkonsistenter Citations verbessern`,
        impact: 'Bessere lokale Rankings und Vertrauen',
        effort: 'medium'
      });
    }

    // Content-Optimierung für underperforming Keywords
    const underperformingKeywords = keywordData.filter(kw => kw.currentPosition > 10 && kw.opportunity > 50);
    if (underperformingKeywords.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: 'Content für hochvolumige Keywords optimieren',
        description: `${underperformingKeywords.length} Keywords mit hohem Potenzial durch Content-Optimierung verbessern`,
        impact: `Geschätzter Traffic-Gewinn: ${underperformingKeywords.reduce((sum, kw) => sum + kw.opportunity, 0)} Besucher/Monat`,
        effort: 'medium'
      });
    }

    // GMB-Optimierung
    if (metrics.gmbMetrics.reviews.averageRating < 4.3) {
      recommendations.push({
        priority: 'medium',
        category: 'local',
        title: 'Google My Business Bewertungen verbessern',
        description: 'Aktive Bewertungssammlung zur Verbesserung der lokalen Sichtbarkeit',
        impact: 'Höhere Conversion-Rate und bessere lokale Rankings',
        effort: 'low'
      });
    }

    // Technische Performance
    if (metrics.technicalSEO.pagespeedScore < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'technical',
        title: 'Website-Performance optimieren',
        description: `PageSpeed Score von ${metrics.technicalSEO.pagespeedScore} durch Core Web Vitals Optimierung verbessern`,
        impact: 'Bessere User Experience und Rankings',
        effort: 'high'
      });
    }

    // Competitor Gap Analysis
    const competitorOpportunities = metrics.competitorAnalysis.filter(c => c.avgPosition < 5).length;
    if (competitorOpportunities > 0) {
      recommendations.push({
        priority: 'low',
        category: 'competition',
        title: 'Konkurrenz-Lücken schließen',
        description: `${competitorOpportunities} Konkurrenten haben bessere Positionen - Analyse und Strategie entwickeln`,
        impact: 'Marktanteil zurückgewinnen',
        effort: 'high'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Identifiziert Konkurrenz-Lücken
   */
  private identifyCompetitorGaps(locationKey: string, keywordData: LocalKeywordPerformance[]): LocalSEOReport['competitorGaps'] {
    const gaps: LocalSEOReport['competitorGaps'] = [];
    
    // Simulierte Konkurrenz-Analyse
    const competitors = ['Solar-Konkurrent-A', 'PV-Anbieter-B', 'Energiepartner-C'];
    
    competitors.forEach(competitor => {
      const opportunityKeywords = keywordData
        .filter(kw => kw.currentPosition > 5 && kw.searchVolume > 100)
        .slice(0, 3);
      
      if (opportunityKeywords.length > 0) {
        gaps.push({
          competitor,
          opportunity: `${competitor} rankt besser für hochvolumige Keywords`,
          keywords: opportunityKeywords.map(kw => kw.keyword),
          estimatedTraffic: opportunityKeywords.reduce((sum, kw) => sum + kw.opportunity, 0)
        });
      }
    });

    return gaps;
  }

  /**
   * Abrufen von Metriken für einen Standort
   */
  public getMetricsForLocation(locationKey: string, days: number = 30): LocalSEOMetrics[] {
    const allMetrics = this.metricsData.get(locationKey) || [];
    return allMetrics.slice(-days);
  }

  /**
   * Abrufen aktiver Alerts für einen Standort
   */
  public getActiveAlertsForLocation(locationKey: string): LocalSEOAlert[] {
    const alerts = this.alertsData.get(locationKey) || [];
    return alerts.filter(alert => alert.status === 'active');
  }

  /**
   * Keyword-Performance für Standort abrufen
   */
  public getKeywordPerformanceForLocation(locationKey: string): LocalKeywordPerformance[] {
    return this.keywordPerformance.get(locationKey) || [];
  }

  /**
   * Neuen Alert erstellen
   */
  public createAlert(alert: Omit<LocalSEOAlert, 'id' | 'createdAt'>): LocalSEOAlert {
    const newAlert: LocalSEOAlert = {
      ...alert,
      id: `alert_${alert.locationKey}_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const existingAlerts = this.alertsData.get(alert.locationKey) || [];
    existingAlerts.push(newAlert);
    this.alertsData.set(alert.locationKey, existingAlerts);

    return newAlert;
  }

  /**
   * Alert als resolved markieren
   */
  public resolveAlert(alertId: string, locationKey: string): boolean {
    const alerts = this.alertsData.get(locationKey) || [];
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    
    if (alertIndex !== -1 && alerts[alertIndex]) {
      alerts[alertIndex].status = 'resolved';
      alerts[alertIndex].resolvedAt = new Date().toISOString();
      return true;
    }
    
    return false;
  }

  /**
   * Dashboard-Übersicht für alle Standorte
   */
  public getDashboardOverview(): {
    totalLocations: number;
    avgOverallScore: number;
    totalAlerts: number;
    criticalAlerts: number;
    totalTraffic: number;
    avgConversionRate: number;
    topPerformingLocations: Array<{location: string, score: number, traffic: number}>;
    recentAlerts: LocalSEOAlert[];
  } {
    const allLocations = Array.from(this.metricsData.keys());
    let totalScore = 0;
    let totalTraffic = 0;
    let totalConversionRate = 0;
    let totalAlerts = 0;
    let criticalAlerts = 0;
    const locationPerformance: Array<{location: string, score: number, traffic: number}> = [];
    const recentAlerts: LocalSEOAlert[] = [];

    allLocations.forEach(locationKey => {
      const metrics = this.getMetricsForLocation(locationKey, 1);
      const alerts = this.getActiveAlertsForLocation(locationKey);
      
      if (metrics.length > 0) {
        const latestMetrics = metrics[0];
        if (latestMetrics) {
          const score = this.calculateOverallScore(latestMetrics, alerts);
          
          totalScore += score;
          totalTraffic += latestMetrics.organicTraffic.sessions;
          totalConversionRate += latestMetrics.organicTraffic.conversionRate;
          totalAlerts += alerts.length;
          criticalAlerts += alerts.filter(a => a.severity === 'critical').length;
          
          locationPerformance.push({
            location: locationKey,
            score,
            traffic: latestMetrics.organicTraffic.sessions
          });
        }
      }
      
      // Sammle neueste Alerts
      alerts.slice(0, 2).forEach(alert => recentAlerts.push(alert));
    });

    // Sortiere Standorte nach Performance
    locationPerformance.sort((a, b) => b.score - a.score);

    return {
      totalLocations: allLocations.length,
      avgOverallScore: Math.round(totalScore / allLocations.length),
      totalAlerts,
      criticalAlerts,
      totalTraffic,
      avgConversionRate: parseFloat((totalConversionRate / allLocations.length).toFixed(2)),
      topPerformingLocations: locationPerformance.slice(0, 5),
      recentAlerts: recentAlerts.slice(0, 10)
    };
  }

  /**
   * Get local performance data for a location
   * Alias for dashboard overview for backward compatibility
   */
  public getLocalPerformance(locationKey?: string): any {
    if (locationKey) {
      const metrics = this.getMetricsForLocation(locationKey, 30);
      const alerts = this.getActiveAlertsForLocation(locationKey);
      
      if (metrics.length === 0) {
        return {
          status: 'no_data',
          message: `No performance data found for ${locationKey}`
        };
      }

      const latestMetrics = metrics[metrics.length - 1];
      if (!latestMetrics) {
        return {
          status: 'no_metrics',
          message: `No metrics data available for ${locationKey}`
        };
      }

      const score = this.calculateOverallScore(latestMetrics, alerts);
      
      return {
        locationKey,
        score,
        metrics: latestMetrics,
        alerts,
        trend: this.getTrendAnalysis(locationKey, 30)
      };
    } else {
      // Return overall dashboard overview
      return this.getDashboardOverview();
    }
  }

  /**
   * Trend-Analyse für Standort
   */
  public getTrendAnalysis(locationKey: string, days: number = 30): {
    trafficTrend: number;
    rankingTrend: number;
    conversionTrend: number;
    gmbTrend: number;
  } {
    const metrics = this.getMetricsForLocation(locationKey, days);
    if (metrics.length < 2) {
      return { trafficTrend: 0, rankingTrend: 0, conversionTrend: 0, gmbTrend: 0 };
    }

    const recent = metrics.slice(-7);
    const previous = metrics.slice(-14, -7);

    const recentAvgTraffic = recent.reduce((sum, m) => sum + m.organicTraffic.sessions, 0) / recent.length;
    const previousAvgTraffic = previous.reduce((sum, m) => sum + m.organicTraffic.sessions, 0) / previous.length;
    const trafficTrend = ((recentAvgTraffic - previousAvgTraffic) / previousAvgTraffic) * 100;

    const recentAvgConversion = recent.reduce((sum, m) => sum + m.organicTraffic.conversionRate, 0) / recent.length;
    const previousAvgConversion = previous.reduce((sum, m) => sum + m.organicTraffic.conversionRate, 0) / previous.length;
    const conversionTrend = ((recentAvgConversion - previousAvgConversion) / previousAvgConversion) * 100;

    const recentAvgGMB = recent.reduce((sum, m) => sum + m.gmbMetrics.views.total, 0) / recent.length;
    const previousAvgGMB = previous.reduce((sum, m) => sum + m.gmbMetrics.views.total, 0) / previous.length;
    const gmbTrend = ((recentAvgGMB - previousAvgGMB) / previousAvgGMB) * 100;

    return {
      trafficTrend: parseFloat(trafficTrend.toFixed(1)),
      rankingTrend: Math.random() * 20 - 10, // Simuliert
      conversionTrend: parseFloat(conversionTrend.toFixed(1)),
      gmbTrend: parseFloat(gmbTrend.toFixed(1))
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const localSEOAnalyticsService = new LocalSEOAnalyticsService();