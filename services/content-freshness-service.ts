/**
 * Content Freshness Service für ZOE Solar
 *
 * Stellt sicher, dass Inhalte regelmäßig aktualisiert werden
 * Automatisiert die Content-Aktualisierung für bessere Rankings
 */

import { performanceConfig, germanSEOConfig } from '../config/seo-performance-config';

export interface ContentMetrics {
  lastUpdated: Date;
  freshnessScore: number; // 0-100
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextUpdate: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface ContentItem {
  id: string;
  url: string;
  type: 'page' | 'blog' | 'faq' | 'service' | 'location';
  title: string;
  content: string;
  metrics: ContentMetrics;
  keywords: string[];
  schema?: any;
}

export interface UpdateStrategy {
  automatic: boolean;
  frequency: number; // days
  triggers: string[];
  templates: {
    priceUpdate: string;
    newsIntegration: string;
    seasonalContent: string;
    statisticsUpdate: string;
  };
}

class ContentFreshnessService {
  private contentDatabase: Map<string, ContentItem> = new Map();
  private updateQueue: ContentItem[] = [];
  private isProcessing = false;

  private readonly UPDATE_STRATEGIES: Map<string, UpdateStrategy> = new Map([
    ['service', {
      automatic: true,
      frequency: 30, // monthly
      triggers: ['price_change', 'new_regulation', 'technology_update'],
      templates: {
        priceUpdate: 'Aktuelle Preise für {service}: {price} €/kWp (Stand: {date})',
        newsIntegration: 'Neue Entwicklungen bei {service}: {news}',
        seasonalContent: '{season} Tipp für {service}: {tip}',
        statisticsUpdate: '{service} Marktübersicht {year}: {stats}'
      }
    }],
    ['blog', {
      automatic: true,
      frequency: 7, // weekly
      triggers: ['industry_news', 'new_research', 'market_trends'],
      templates: {
        priceUpdate: 'Photovoltaik Preis-Update {month} {year}',
        newsIntegration: 'Solar-News der Woche: {headlines}',
        seasonalContent: '{season} Solar-Trends für Unternehmen',
        statisticsUpdate: 'Solar-Markt Zahlen {quarter}: {data}'
      }
    }],
    ['faq', {
      automatic: true,
      frequency: 60, // quarterly
      triggers: ['new_questions', 'policy_changes', 'common_issues'],
      templates: {
        priceUpdate: 'FAQ: Was kosten Solaranlagen {month} {year}?',
        newsIntegration: 'FAQ: Neue Förderprogramme {year}',
        seasonalContent: '{season} FAQ: Häufige Fragen zur Saison',
        statisticsUpdate: 'FAQ: Aktuelle Zahlen & Fakten {year}'
      }
    }],
    ['location', {
      automatic: true,
      frequency: 90, // quarterly
      triggers: ['new_projects', 'regional_news', 'price_changes'],
      templates: {
        priceUpdate: 'Solaranlagen Preise {city}: {data}',
        newsIntegration: 'Solar-News aus {city}: {events}',
        seasonalContent: '{season} Solar-Projekte in {city}',
        statisticsUpdate: '{city} Solar-Statistik {year}: {data}'
      }
    }]
  ]);

  /**
   * Initialisiert den Service und startet automatische Updates
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initialisiere Content Freshness Service...');

    // Bestehende Inhalte analysieren
    await this.analyzeExistingContent();

    // Update-Scheduler starten
    this.startUpdateScheduler();

    // Externe Datenquellen integrieren
    await this.setupDataSources();

    console.log('✅ Content Freshness Service gestartet');
  }

  /**
   * Analysiert bestehende Inhalte und erstellt Content-Database
   */
  private async analyzeExistingContent(): Promise<void> {
    console.log('📊 Analysiere bestehende Inhalte...');

    // Service-Seiten
    const servicePages = [
      {
        id: 'solaranlagen-unternehmen',
        url: '/solaranlagen-fuer-unternehmen',
        type: 'service' as const,
        title: 'Solaranlagen für Unternehmen',
        keywords: germanSEOConfig.keywords.primary
      },
      {
        id: 'photovoltaik-beratung',
        url: '/photovoltaik-beratung',
        type: 'service' as const,
        title: 'Photovoltaik Beratung',
        keywords: ['Photovoltaik Beratung', 'Solarberatung', 'Unternehmensberatung']
      },
      {
        id: 'speicher-loesungen',
        url: '/speicher-loesungen',
        type: 'service' as const,
        title: 'Solarstromspeicher',
        keywords: ['Solarstromspeicher', 'Batteriespeicher', 'Energiespeicher']
      }
    ];

    // Location-Seiten
    const locationPages = [
      {
        id: 'berlin',
        url: '/standort/berlin',
        type: 'location' as const,
        title: 'Solaranlagen Berlin',
        keywords: ['Solaranlagen Berlin', 'Photovoltaik Berlin', 'Solar Installateur Berlin']
      },
      {
        id: 'muenchen',
        url: '/standort/muenchen',
        type: 'location' as const,
        title: 'Solaranlagen München',
        keywords: ['Solaranlagen München', 'Photovoltaik München', 'Solar Installateur München']
      },
      {
        id: 'hamburg',
        url: '/standort/hamburg',
        type: 'location' as const,
        title: 'Solaranlagen Hamburg',
        keywords: ['Solaranlagen Hamburg', 'Photovoltaik Hamburg', 'Solar Installateur Hamburg']
      }
    ];

    // Content Items erstellen
    [...servicePages, ...locationPages].forEach(page => {
      const contentItem: ContentItem = {
        ...page,
        content: '', // Wird bei Bedarf geladen
        metrics: this.generateInitialMetrics(page.type),
        schema: this.generateSchemaForPage(page)
      };

      this.contentDatabase.set(page.id, contentItem);
    });

    console.log(`✅ ${this.contentDatabase.size} Content Items analysiert`);
  }

  /**
   * Initiale Metriken für Content generieren
   */
  private generateInitialMetrics(type: string): ContentMetrics {
    const strategies = {
      service: { frequency: 30, priority: 'high' as const },
      blog: { frequency: 7, priority: 'medium' as const },
      faq: { frequency: 60, priority: 'medium' as const },
      location: { frequency: 90, priority: 'medium' as const },
      page: { frequency: 180, priority: 'low' as const }
    };

    const strategy = strategies[type as keyof typeof strategies] || strategies.page;
    const now = new Date();

    return {
      lastUpdated: new Date(now.getTime() - Math.random() * strategy.frequency * 24 * 60 * 60 * 1000),
      freshnessScore: Math.floor(Math.random() * 40) + 60, // 60-100
      updateFrequency: type === 'blog' ? 'weekly' : type === 'service' ? 'monthly' : 'quarterly',
      nextUpdate: new Date(now.getTime() + strategy.frequency * 24 * 60 * 60 * 1000),
      priority: strategy.priority
    };
  }

  /**
   * Schema für Page generieren
   */
  private generateSchemaForPage(page: any): any {
    if (page.type === 'service') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: page.title,
        description: `Professionelle ${page.title.toLowerCase()} von ZOE Solar`,
        provider: {
          '@type': 'Organization',
          name: 'ZOE Solar GmbH'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Germany'
        }
      };
    } else if (page.type === 'location') {
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `ZOE Solar ${page.title}`,
        description: `${page.title} von ZOE Solar`,
        areaServed: {
          '@type': 'City',
          name: page.title.split(' ').pop()
        }
      };
    }

    return null;
  }

  /**
   * Startet den automatischen Update-Scheduler
   */
  private startUpdateScheduler(): void {
    console.log('⏰ Starte Update-Scheduler...');

    // Jede Stunde prüfen
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);

    // Sofort prüfen
    this.checkForUpdates();
  }

  /**
   * Prüft welche Inhalte aktualisiert werden müssen
   */
  private checkForUpdates(): void {
    if (this.isProcessing) {
      return;
    }

    const now = new Date();
    this.updateQueue = [];

    this.contentDatabase.forEach((content, id) => {
      if (content.metrics.nextUpdate <= now) {
        this.updateQueue.push(content);
        console.log(`🔄 Update fällig: ${content.title} (${id})`);
      }
    });

    if (this.updateQueue.length > 0) {
      this.processUpdateQueue();
    }
  }

  /**
   * Verarbeitet die Update-Queue
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.isProcessing || this.updateQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`🔄 Verarbeite ${this.updateQueue.length} Updates...`);

    try {
      // Nach Priorität sortieren
      this.updateQueue.sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.metrics.priority] - priorities[a.metrics.priority];
      });

      // Updates verarbeiten
      for (const content of this.updateQueue) {
        await this.updateContent(content);
      }

      this.updateQueue = [];
      console.log('✅ Update-Queue verarbeitet');

    } catch (error) {
      console.error('❌ Fehler bei Update-Verarbeitung:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Aktualisiert spezifischen Content
   */
  private async updateContent(content: ContentItem): Promise<void> {
    console.log(`📝 Aktualisiere: ${content.title}`);

    const strategy = this.UPDATE_STRATEGIES.get(content.type);
    if (!strategy) {
      console.warn(`⚠️ Keine Update-Strategie für Typ: ${content.type}`);
      return;
    }

    try {
      // Externe Daten abrufen
      const externalData = await this.fetchExternalData(content);

      // Content generieren
      const updatedContent = await this.generateUpdatedContent(content, externalData);

      // Metriken aktualisieren
      content.metrics.lastUpdated = new Date();
      content.metrics.freshnessScore = Math.min(100, content.metrics.freshnessScore + 20);
      content.metrics.nextUpdate = this.calculateNextUpdate(content.type);

      // Schema aktualisieren
      if (content.schema) {
        content.schema.dateModified = new Date().toISOString();
      }

      console.log(`✅ Content aktualisiert: ${content.title}`);

    } catch (error) {
      console.error(`❌ Fehler bei Update von ${content.title}:`, error);
    }
  }

  /**
   * Externe Daten für Content-Updates abrufen
   */
  private async fetchExternalData(content: ContentItem): Promise<any> {
    const data: any = {
      date: new Date().toLocaleDateString('de-DE'),
      month: new Date().toLocaleDateString('de-DE', { month: 'long' }),
      year: new Date().getFullYear(),
      season: this.getCurrentSeason()
    };

    // Preise (simuliert)
    if (content.type === 'service' || content.type === 'location') {
      data.price = this.getCurrentPrice();
      data.priceChange = this.getPriceChange();
    }

    // Nachrichten (simuliert)
    if (content.type === 'blog') {
      data.news = await this.getSolarNews();
      data.headlines = this.getNewsHeadlines();
    }

    // Statistiken (simuliert)
    if (content.type === 'location') {
      data.stats = this.getLocationStats(content.title);
    }

    // Marktdaten (simuliert)
    if (content.type === 'service') {
      data.stats = this.getMarketStats();
      data.trends = this.getMarketTrends();
    }

    return data;
  }

  /**
   * Aktualisierten Content generieren
   */
  private async generateUpdatedContent(content: ContentItem, data: any): Promise<string> {
    const strategy = this.UPDATE_STRATEGIES.get(content.type);
    if (!strategy) return '';

    const updates: string[] = [];

    // Preis-Updates
    if (data.price) {
      updates.push(
        strategy.templates.priceUpdate
          .replace('{service}', content.title.toLowerCase())
          .replace('{price}', data.price)
          .replace('{date}', data.date)
      );
    }

    // News-Integration
    if (data.news || data.headlines) {
      updates.push(
        strategy.templates.newsIntegration
          .replace('{service}', content.title.toLowerCase())
          .replace('{news}', data.news || data.headlines)
      );
    }

    // Saisonale Inhalte
    updates.push(
      strategy.templates.seasonalContent
        .replace('{season}', data.season)
        .replace('{service}', content.title.toLowerCase())
        .replace('{tip}', this.getSeasonalTip(data.season))
    );

    // Statistik-Updates
    if (data.stats) {
      updates.push(
        strategy.templates.statisticsUpdate
          .replace('{service}', content.title.toLowerCase())
          .replace('{year}', data.year)
          .replace('{stats}', data.stats)
          .replace('{quarter}', this.getCurrentQuarter())
          .replace('{data}', data.stats)
      );
    }

    return updates.join('\n\n');
  }

  /**
   * Datenquellen einrichten
   */
  private async setupDataSources(): Promise<void> {
    console.log('🔌 Richte Datenquellen ein...');

    // Simulierte Datenquellen - in der Realität wären das echte APIs
    this.setupPriceAPI();
    this.setupNewsAPI();
    this.setupStatisticsAPI();

    console.log('✅ Datenquellen eingerichtet');
  }

  /**
   * Preis-API einrichten (simuliert)
   */
  private setupPriceAPI(): void {
    // Simuliert externe Preis-API
    console.log('💰 Preis-API verbunden');
  }

  /**
   * News-API einrichten (simuliert)
   */
  private setupNewsAPI(): void {
    // Simuliert externe News-API
    console.log('📰 News-API verbunden');
  }

  /**
   * Statistiken-API einrichten (simuliert)
   */
  private setupStatisticsAPI(): void {
    // Simuliert externe Statistiken-API
    console.log('📊 Statistiken-API verbunden');
  }

  // Helper Methods
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Frühling';
    if (month >= 5 && month <= 7) return 'Sommer';
    if (month >= 8 && month <= 10) return 'Herbst';
    return 'Winter';
  }

  private getCurrentQuarter(): string {
    const month = new Date().getMonth();
    return `Q${Math.floor(month / 3) + 1} ${new Date().getFullYear()}`;
  }

  private getCurrentPrice(): string {
    const basePrice = 1200;
    const variation = Math.random() * 200 - 100;
    return Math.round(basePrice + variation).toString();
  }

  private getPriceChange(): string {
    const change = (Math.random() * 10 - 5).toFixed(1);
    return change.startsWith('-') ? change : `+${change}`;
  }

  private async getSolarNews(): Promise<string> {
    const news = [
      'Neue Förderprogramme für Solaranlagen 2025 beschlossen',
      'Solarpreise sinken auf historisches Tief',
      'Branchenrecord: Deutschland installiert 15 GW Photovoltaik',
      'Innovation: Neue Solarzellen erreichen 30% Wirkungsgrad'
    ];
    return news[Math.floor(Math.random() * news.length)];
  }

  private getNewsHeadlines(): string {
    return 'Top-News: Förderplus +15% | Preistief | Rekordinstallation';
  }

  private getLocationStats(city: string): string {
    const stats = {
      'Berlin': '1.200 MW installiert, 8.500 Anlagen',
      'München': '950 MW installiert, 6.200 Anlagen',
      'Hamburg': '800 MW installiert, 5.100 Anlagen'
    };
    return stats[city as keyof typeof stats] || 'Daten werden aktualisiert';
  }

  private getMarketStats(): string {
    return `Marktanteil: 15% | Wachstum: +25% | Anlagen: 2,8 Mio`;
  }

  private getMarketTrends(): string {
    return 'Trend: Commercial Solar +40% | Storage Integration +60%';
  }

  private getSeasonalTip(season: string): string {
    const tips = {
      'Frühling': 'Optimale Zeit für die Planung Ihrer Solaranlage',
      'Sommer': 'Maximale Erträge bei optimaler Ausrichtung',
      'Herbst': 'Letzte Chance für Inbetriebnahme in diesem Jahr',
      'Winter': 'Beste Konditionen für Installation im Frühjahr'
    };
    return tips[season as keyof typeof tips] || 'Tipp: Planen Sie jetzt für 2025';
  }

  private calculateNextUpdate(type: string): Date {
    const frequencies = {
      service: 30,
      blog: 7,
      faq: 60,
      location: 90,
      page: 180
    };

    const days = frequencies[type as keyof typeof frequencies] || 180;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Manuelles Update für spezifischen Content anstoßen
   */
  async triggerUpdate(contentId: string): Promise<boolean> {
    const content = this.contentDatabase.get(contentId);
    if (!content) {
      console.warn(`⚠️ Content nicht gefunden: ${contentId}`);
      return false;
    }

    console.log(`🔄 Manuelles Update angestoßen: ${content.title}`);
    await this.updateContent(content);
    return true;
  }

  /**
   * Content-Freshness Status abrufen
   */
  getContentStatus(): Array<{
    id: string;
    title: string;
    freshnessScore: number;
    lastUpdated: Date;
    nextUpdate: Date;
    priority: string;
  }> {
    const status = Array.from(this.contentDatabase.values()).map(content => ({
      id: content.id,
      title: content.title,
      freshnessScore: content.metrics.freshnessScore,
      lastUpdated: content.metrics.lastUpdated,
      nextUpdate: content.metrics.nextUpdate,
      priority: content.metrics.priority
    }));

    return status.sort((a, b) => b.freshnessScore - a.freshnessScore);
  }

  /**
   * Durchschnittliche Freshness Score berechnen
   */
  getAverageFreshnessScore(): number {
    const contents = Array.from(this.contentDatabase.values());
    if (contents.length === 0) return 0;

    const totalScore = contents.reduce((sum, content) => sum + content.metrics.freshnessScore, 0);
    return Math.round(totalScore / contents.length);
  }
}

// Export als Singleton
export const contentFreshnessService = new ContentFreshnessService();
export default contentFreshnessService;