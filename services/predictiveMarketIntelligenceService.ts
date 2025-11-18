// Predictive Market Intelligence Service für ZOE Solar
import { AIMonitoringAnalyticsService } from './aiMonitoringAnalyticsService';
import { CompetitorIntelligenceService } from './competitorIntelligenceService';

export interface MarketIntelligenceConfig {
  enableExternalSources: boolean;
  updateIntervalHours: number;
  monitoredKeywords: string[];
}

export interface MarketTrend {
  keyword: string;
  trendScore: number;
  growthRate: number;
  confidence: number;
  relatedTopics: string[];
}

export interface CompetitorReport {
  domain: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  threats: string[];
  opportunities: string[];
}

export class PredictiveMarketIntelligenceService {
  private config: MarketIntelligenceConfig;
  private monitoringService: AIMonitoringAnalyticsService;
  private competitorService: CompetitorIntelligenceService;

  constructor(config: MarketIntelligenceConfig) {
    this.config = config;
    this.monitoringService = new AIMonitoringAnalyticsService();
    this.competitorService = new CompetitorIntelligenceService();
  }

  public async getMarketTrends(): Promise<MarketTrend[]> {
    const trends = await this.monitoringService.analyzePredictiveTrends(this.config.monitoredKeywords);
    return trends.map(t => ({
      keyword: t.keyword,
      trendScore: t.trendScore,
      growthRate: t.growthRate,
      confidence: t.confidence,
      relatedTopics: t.relatedTopics,
    }));
  }

  public async getCompetitorReports(): Promise<CompetitorReport[]> {
    const profiles = this.competitorService.getCompetitorProfiles();
    return profiles.map(profile => ({
      domain: profile.domain,
      marketShare: profile.marketShare,
      strengths: profile.strengths,
      weaknesses: profile.weaknesses,
      threats: profile.threats,
      opportunities: profile.opportunities,
    }));
  }

  public async integrateExternalData(sourceUrl: string): Promise<boolean> {
    // Externe Datenintegration (Platzhalter)
    return true;
  }

  public getConfig(): MarketIntelligenceConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<MarketIntelligenceConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Automatisierter Scheduler für Markt-/Trendprognosen
  public scheduleAutomatedUpdates(callback: () => void): void {
    setInterval(() => {
      try {
        callback();
        console.log('[MarketIntelligence] Update erfolgreich durchgeführt.');
      } catch (err) {
        console.error('[MarketIntelligence] Fehler beim Update:', err);
      }
    }, this.config.updateIntervalHours * 3600 * 1000);
  }

  // Erweiterte Integration externer Datenquellen mit Fehlerhandling
  public async integrateExternalDataAdvanced(sourceUrl: string): Promise<boolean> {
    try {
      // Externe Daten holen und verarbeiten (Platzhalter)
      const success = await this.integrateExternalData(sourceUrl);
      if (!success) throw new Error('Datenintegration fehlgeschlagen');
      console.log(`[MarketIntelligence] Daten von ${sourceUrl} erfolgreich integriert.`);
      return true;
    } catch (err) {
      console.error(`[MarketIntelligence] Fehler bei externer Datenintegration:`, err);
      return false;
    }
  }
}