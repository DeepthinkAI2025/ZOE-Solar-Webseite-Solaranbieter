/**
 * Sentiment Analysis Service für ZOE Solar
 * Implementiert Real-time Sentiment Tracking und AI-powered Sentiment Classification
 *
 * Hauptfunktionen:
 * - Real-time Sentiment Analysis für Content und Reviews
 * - AI-powered Sentiment Classification mit ML-Modellen
 * - Sentiment Tracking für Brand Monitoring
 * - Automated Sentiment Alerts und Reporting
 * - Multi-language Sentiment Analysis
 * - Sentiment-based Content Optimization
 */

export interface SentimentData {
  id: string;
  content: string;
  source: string;
  timestamp: string;
  author?: string;
  url?: string;
  language: string;
  sentiment: SentimentResult;
  entities: string[];
  context: SentimentContext;
}

export interface SentimentResult {
  label: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number; // -1 bis 1
  confidence: number; // 0 bis 1
  aspects: SentimentAspect[];
  emotions: EmotionScore[];
}

export interface SentimentAspect {
  aspect: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

export interface EmotionScore {
  emotion: string;
  score: number;
  confidence: number;
}

export interface SentimentContext {
  domain: string;
  category: string;
  keywords: string[];
  intent: 'review' | 'complaint' | 'praise' | 'question' | 'suggestion' | 'general';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface SentimentAlert {
  id: string;
  type: 'negative_spike' | 'sentiment_drop' | 'brand_mention' | 'crisis_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data: SentimentData[];
  timestamp: string;
  recommendations: string[];
}

export interface SentimentTrend {
  period: string;
  overallScore: number;
  volume: number;
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
    mixed: number;
  };
  topAspects: SentimentAspect[];
  alerts: SentimentAlert[];
}

export interface SentimentConfig {
  apiEndpoint: string;
  apiKey: string;
  models: {
    primary: string;
    fallback: string;
    multilingual: string;
  };
  thresholds: {
    negativeThreshold: number;
    alertThreshold: number;
    confidenceThreshold: number;
  };
  languages: string[];
  domains: string[];
  monitoring: {
    enabled: boolean;
    interval: number; // Minuten
    sources: string[];
  };
}

/**
 * AI Sentiment Classifier
 * Nutzt ML-Modelle für fortschrittliche Sentiment-Analyse
 */
export class AISentimentClassifier {
  private config: SentimentConfig;
  private modelCache: Map<string, any> = new Map();

  constructor(config: SentimentConfig) {
    this.config = config;
  }

  /**
   * Klassifiziert Sentiment eines Textes
   */
  async classifySentiment(text: string, language: string = 'de'): Promise<SentimentResult> {
    try {
      // Primäres ML-Modell verwenden
      const result = await this.callSentimentAPI(text, language, this.config.models.primary);

      // Fallback bei niedriger Confidence
      if (result.confidence < this.config.thresholds.confidenceThreshold) {
        const fallbackResult = await this.callSentimentAPI(text, language, this.config.models.fallback);
        if (fallbackResult.confidence > result.confidence) {
          return fallbackResult;
        }
      }

      return result;
    } catch (error) {
      console.error('Sentiment classification failed:', error);
      // Fallback auf regelbasierte Analyse
      return this.ruleBasedSentiment(text, language);
    }
  }

  /**
   * Ruft Sentiment-API auf
   */
  private async callSentimentAPI(text: string, language: string, model: string): Promise<SentimentResult> {
    const response = await fetch(`${this.config.apiEndpoint}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        text,
        language,
        model,
        features: ['sentiment', 'aspects', 'emotions', 'entities']
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      label: data.sentiment.label,
      score: data.sentiment.score,
      confidence: data.confidence,
      aspects: data.aspects || [],
      emotions: data.emotions || []
    };
  }

  /**
   * Regelbasierte Sentiment-Analyse als Fallback
   */
  private ruleBasedSentiment(text: string, language: string): SentimentResult {
    const positiveWords = ['gut', 'super', 'exzellent', 'zufrieden', 'empfehle', 'professionell', 'qualität'];
    const negativeWords = ['schlecht', 'enttäuscht', 'problem', 'fehler', 'teuer', 'langsam', 'unzufrieden'];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      positiveCount += (lowerText.match(new RegExp(word, 'g')) || []).length;
    });

    negativeWords.forEach(word => {
      negativeCount += (lowerText.match(new RegExp(word, 'g')) || []).length;
    });

    const total = positiveCount + negativeCount;
    const score = total > 0 ? (positiveCount - negativeCount) / total : 0;

    let label: 'positive' | 'negative' | 'neutral' | 'mixed';
    if (Math.abs(score) < 0.1) {
      label = 'neutral';
    } else if (score > 0.3) {
      label = 'positive';
    } else if (score < -0.3) {
      label = 'negative';
    } else {
      label = 'mixed';
    }

    return {
      label,
      score,
      confidence: 0.5, // Niedrige Confidence für regelbasiert
      aspects: [],
      emotions: []
    };
  }

  /**
   * Analysiert Sentiment-Aspekte
   */
  async analyzeAspects(text: string, language: string): Promise<SentimentAspect[]> {
    // Implementierung für aspektbasierte Sentiment-Analyse
    const aspects = ['service', 'qualität', 'preis', 'support', 'produkt'];

    const results: SentimentAspect[] = [];

    for (const aspect of aspects) {
      if (text.toLowerCase().includes(aspect)) {
        const aspectSentiment = await this.classifySentiment(text, language);
        results.push({
          aspect,
          sentiment: aspectSentiment.label,
          score: aspectSentiment.score,
          confidence: aspectSentiment.confidence
        });
      }
    }

    return results;
  }
}

/**
 * Real-time Sentiment Tracker
 * Überwacht Sentiment in Echtzeit über verschiedene Quellen
 */
export class RealTimeSentimentTracker {
  private config: SentimentConfig;
  private classifier: AISentimentClassifier;
  private sentimentHistory: SentimentData[] = [];
  private alerts: SentimentAlert[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor(config: SentimentConfig, classifier: AISentimentClassifier) {
    this.config = config;
    this.classifier = classifier;
  }

  /**
   * Startet Real-time Monitoring
   */
  startMonitoring(): void {
    if (this.config.monitoring.enabled) {
      this.monitoringInterval = setInterval(() => {
        this.performMonitoringCycle();
      }, this.config.monitoring.interval * 60 * 1000);
    }
  }

  /**
   * Stoppt Monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
  }

  /**
   * Führt einen Monitoring-Zyklus durch
   */
  private async performMonitoringCycle(): Promise<void> {
    try {
      // Sammle neue Daten aus verschiedenen Quellen
      const newData = await this.collectSentimentData();

      for (const data of newData) {
        await this.processSentimentData(data);
      }

      // Prüfe auf Alerts
      await this.checkForAlerts();

      // Bereinige alte Daten
      this.cleanupOldData();

    } catch (error) {
      console.error('Monitoring cycle failed:', error);
    }
  }

  /**
   * Sammelt Sentiment-Daten aus verschiedenen Quellen
   */
  private async collectSentimentData(): Promise<SentimentData[]> {
    const data: SentimentData[] = [];

    // Google Reviews sammeln
    const googleReviews = await this.collectGoogleReviews();
    data.push(...googleReviews);

    // Social Media sammeln
    const socialMedia = await this.collectSocialMedia();
    data.push(...socialMedia);

    // Website-Kommentare sammeln
    const websiteComments = await this.collectWebsiteComments();
    data.push(...websiteComments);

    return data;
  }

  /**
   * Sammelt Google Reviews
   */
  private async collectGoogleReviews(): Promise<SentimentData[]> {
    // Implementierung für Google Reviews API
    return [];
  }

  /**
   * Sammelt Social Media Daten
   */
  private async collectSocialMedia(): Promise<SentimentData[]> {
    // Implementierung für Social Media APIs
    return [];
  }

  /**
   * Sammelt Website-Kommentare
   */
  private async collectWebsiteComments(): Promise<SentimentData[]> {
    // Implementierung für Website-Comment-System
    return [];
  }

  /**
   * Verarbeitet Sentiment-Daten
   */
  private async processSentimentData(data: SentimentData): Promise<void> {
    // Sentiment klassifizieren falls nicht bereits geschehen
    if (!data.sentiment) {
      data.sentiment = await this.classifier.classifySentiment(data.content, data.language);
    }

    // Context analysieren
    data.context = await this.analyzeContext(data);

    // Zu History hinzufügen
    this.sentimentHistory.push(data);
  }

  /**
   * Analysiert Kontext der Sentiment-Daten
   */
  private async analyzeContext(data: SentimentData): Promise<SentimentContext> {
    // Implementierung für Context-Analyse
    return {
      domain: 'general',
      category: 'review',
      keywords: [],
      intent: 'general',
      urgency: 'low'
    };
  }

  /**
   * Prüft auf Sentiment-Alerts
   */
  private async checkForAlerts(): Promise<void> {
    const recentData = this.getRecentSentimentData(60); // Letzte 60 Minuten

    // Negative Sentiment Spike prüfen
    const negativeSpike = this.detectNegativeSpike(recentData);
    if (negativeSpike) {
      this.createAlert('negative_spike', 'high', 'Negative sentiment spike detected', recentData);
    }

    // Kritische negative Mentions prüfen
    const criticalMentions = recentData.filter(d =>
      d.sentiment.label === 'negative' &&
      d.context.urgency === 'critical'
    );

    if (criticalMentions.length > 0) {
      this.createAlert('crisis_detected', 'critical', 'Critical negative mentions detected', criticalMentions);
    }
  }

  /**
   * Erkennt negative Sentiment-Spikes
   */
  private detectNegativeSpike(data: SentimentData[]): boolean {
    if (data.length < 10) return false;

    const recentNegative = data.filter(d => d.sentiment.label === 'negative').length;
    const total = data.length;
    const negativeRatio = recentNegative / total;

    return negativeRatio > this.config.thresholds.alertThreshold;
  }

  /**
   * Erstellt einen Alert
   */
  private createAlert(type: SentimentAlert['type'], severity: SentimentAlert['severity'], message: string, data: SentimentData[]): void {
    const alert: SentimentAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      data,
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations(type, data)
    };

    this.alerts.push(alert);

    // Alert weiterleiten (Email, Slack, etc.)
    this.dispatchAlert(alert);
  }

  /**
   * Generiert Empfehlungen für Alerts
   */
  private generateRecommendations(type: SentimentAlert['type'], data: SentimentData[]): string[] {
    const recommendations: string[] = [];

    switch (type) {
      case 'negative_spike':
        recommendations.push('Überprüfe kürzlich veröffentlichte Inhalte');
        recommendations.push('Kontaktiere betroffene Kunden direkt');
        recommendations.push('Veröffentliche eine Klarstellung oder Entschuldigung');
        break;
      case 'crisis_detected':
        recommendations.push('Sofortige Krisenkommunikation einleiten');
        recommendations.push('Management benachrichtigen');
        recommendations.push('PR-Team aktivieren');
        break;
    }

    return recommendations;
  }

  /**
   * Leitet Alert weiter
   */
  private dispatchAlert(alert: SentimentAlert): void {
    // Implementierung für Alert-Dispatch (Email, Slack, etc.)
    console.log('Alert dispatched:', alert);
  }

  /**
   * Holt recente Sentiment-Daten
   */
  private getRecentSentimentData(minutes: number): SentimentData[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.sentimentHistory.filter(d => new Date(d.timestamp) > cutoff);
  }

  /**
   * Bereinigt alte Daten
   */
  private cleanupOldData(): void {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 Tage
    this.sentimentHistory = this.sentimentHistory.filter(d => new Date(d.timestamp) > cutoff);
    this.alerts = this.alerts.filter(a => new Date(a.timestamp) > cutoff);
  }

  /**
   * Holt Sentiment-Trends
   */
  getSentimentTrends(period: string): SentimentTrend {
    const data = this.getSentimentDataForPeriod(period);

    const breakdown = {
      positive: data.filter(d => d.sentiment.label === 'positive').length,
      negative: data.filter(d => d.sentiment.label === 'negative').length,
      neutral: data.filter(d => d.sentiment.label === 'neutral').length,
      mixed: data.filter(d => d.sentiment.label === 'mixed').length
    };

    const overallScore = data.reduce((sum, d) => sum + d.sentiment.score, 0) / data.length;

    return {
      period,
      overallScore,
      volume: data.length,
      breakdown,
      topAspects: this.getTopAspects(data),
      alerts: this.alerts.filter(a => a.timestamp.includes(period))
    };
  }

  /**
   * Holt Sentiment-Daten für einen Zeitraum
   */
  private getSentimentDataForPeriod(period: string): SentimentData[] {
    // Implementierung für Perioden-Filterung
    return this.sentimentHistory;
  }

  /**
   * Holt Top-Aspekte
   */
  private getTopAspects(data: SentimentData[]): SentimentAspect[] {
    const aspectMap = new Map<string, { total: number, count: number }>();

    data.forEach(d => {
      d.sentiment.aspects.forEach(aspect => {
        const existing = aspectMap.get(aspect.aspect) || { total: 0, count: 0 };
        existing.total += aspect.score;
        existing.count += 1;
        aspectMap.set(aspect.aspect, existing);
      });
    });

    return Array.from(aspectMap.entries())
      .map(([aspect, data]) => ({
        aspect,
        sentiment: data.total / data.count > 0 ? 'positive' : 'negative',
        score: data.total / data.count,
        confidence: 0.8
      }))
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
      .slice(0, 10);
  }
}

/**
 * Sentiment Analysis Service
 * Haupt-Service für alle Sentiment-Analyse-Funktionen
 */
export class SentimentAnalysisService {
  private config: SentimentConfig;
  private classifier: AISentimentClassifier;
  private tracker: RealTimeSentimentTracker;

  constructor(config: SentimentConfig) {
    this.config = config;
    this.classifier = new AISentimentClassifier(config);
    this.tracker = new RealTimeSentimentTracker(config, this.classifier);
  }

  /**
   * Initialisiert den Service
   */
  async initialize(): Promise<void> {
    // Modelle laden
    await this.classifier.initialize();

    // Monitoring starten
    this.tracker.startMonitoring();
  }

  /**
   * Analysiert Sentiment eines Textes
   */
  async analyzeSentiment(text: string, language: string = 'de'): Promise<SentimentResult> {
    return this.classifier.classifySentiment(text, language);
  }

  /**
   * Analysiert Sentiment-Daten
   */
  async analyzeSentimentData(data: Omit<SentimentData, 'sentiment' | 'context'>): Promise<SentimentData> {
    const sentiment = await this.classifier.classifySentiment(data.content, data.language);
    const context = await this.tracker['analyzeContext'](data);

    return {
      ...data,
      sentiment,
      context,
      entities: [] // Wird durch Entity Recognition gefüllt
    };
  }

  /**
   * Holt Sentiment-Trends
   */
  getSentimentTrends(period: string): SentimentTrend {
    return this.tracker.getSentimentTrends(period);
  }

  /**
   * Holt aktive Alerts
   */
  getActiveAlerts(): SentimentAlert[] {
    return this.tracker['alerts'].filter(a =>
      new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Letzte 24h
    );
  }

  /**
   * Exportiert Sentiment-Daten
   */
  exportSentimentData(startDate: string, endDate: string): SentimentData[] {
    // Implementierung für Daten-Export
    return [];
  }

  /**
   * Generiert Sentiment-Report
   */
  generateSentimentReport(period: string): object {
    const trends = this.getSentimentTrends(period);
    const alerts = this.getActiveAlerts();

    return {
      period,
      summary: {
        overallSentiment: trends.overallScore > 0 ? 'positive' : 'negative',
        totalVolume: trends.volume,
        sentimentBreakdown: trends.breakdown
      },
      topAspects: trends.topAspects,
      alerts: alerts,
      recommendations: this.generateReportRecommendations(trends, alerts),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generiert Report-Empfehlungen
   */
  private generateReportRecommendations(trends: SentimentTrend, alerts: SentimentAlert[]): string[] {
    const recommendations: string[] = [];

    if (trends.overallScore < -0.2) {
      recommendations.push('Fokussiere dich auf Kundenfeedback und Verbesserungen');
    }

    if (alerts.length > 5) {
      recommendations.push('Erhöhe Monitoring-Frequenz für kritische Themen');
    }

    if (trends.breakdown.negative > trends.breakdown.positive) {
      recommendations.push('Entwickle Strategie zur Adressierung negativer Aspekte');
    }

    return recommendations;
  }

  /**
   * Schließt den Service
   */
  async shutdown(): Promise<void> {
    this.tracker.stopMonitoring();
  }
}

// Standard-Konfiguration
const defaultSentimentConfig: SentimentConfig = {
  apiEndpoint: 'https://api.sentiment-ai.example.com/v1',
  apiKey: process.env.SENTIMENT_API_KEY || '',
  models: {
    primary: 'sentiment-v3-large',
    fallback: 'sentiment-v2-base',
    multilingual: 'sentiment-multilingual-v1'
  },
  thresholds: {
    negativeThreshold: -0.3,
    alertThreshold: 0.3,
    confidenceThreshold: 0.7
  },
  languages: ['de', 'en', 'fr'],
  domains: ['solar', 'energy', 'technology', 'business'],
  monitoring: {
    enabled: true,
    interval: 15, // 15 Minuten
    sources: ['google_reviews', 'social_media', 'website_comments']
  }
};

// Singleton-Instanz
export const sentimentAnalysisService = new SentimentAnalysisService(defaultSentimentConfig);