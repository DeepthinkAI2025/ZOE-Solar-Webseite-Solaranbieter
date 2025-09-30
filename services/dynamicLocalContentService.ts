import { PRIMARY_SERVICE_REGIONS, ServiceRegion } from '../data/seoConfig';
import { localContentService, ContentTemplate, GeneratedContent } from './localContentService';
import { multiLocationManagementService, LocationProfile } from './multiLocationManagementService';

export interface DynamicContentRule {
  id: string;
  name: string;
  trigger: {
    type: 'seasonal' | 'event' | 'market_condition' | 'competitor_action' | 'performance_drop' | 'opportunity';
    conditions: Array<{
      field: string;
      operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
      value: any;
    }>;
  };
  contentType: ContentTemplate['type'];
  templateId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  maxGenerations: number;
  active: boolean;
}

export interface ContentPersonalization {
  userSegment: 'homeowner' | 'business' | 'agriculture' | 'investor';
  locationKey: string;
  interests: string[];
  behavior: {
    viewedPages: string[];
    searchTerms: string[];
    timeOnSite: number;
    conversionStage: 'awareness' | 'consideration' | 'decision';
  };
  preferences: {
    contentLength: 'short' | 'medium' | 'long';
    tone: 'professional' | 'casual' | 'technical' | 'conversational';
    format: 'text' | 'video' | 'infographic' | 'interactive';
  };
}

export interface DynamicContentGeneration {
  id: string;
  locationKey: string;
  ruleId: string;
  contentType: ContentTemplate['type'];
  generatedContent: GeneratedContent;
  personalizationData: ContentPersonalization;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    engagementRate: number;
    timeOnPage: number;
  };
  aiGenerated: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ContentOptimization {
  contentId: string;
  locationKey: string;
  optimizationType: 'keyword_density' | 'readability' | 'engagement' | 'conversion' | 'seo_score';
  currentValue: number;
  targetValue: number;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'ignored';
  appliedAt?: string;
}

/**
 * Dynamic Local Content Generation Service
 * KI-gestützte dynamische Generierung von standortspezifischen Inhalten
 */
export class DynamicLocalContentService {
  private dynamicRules: Map<string, DynamicContentRule[]> = new Map();
  private generatedDynamicContent: Map<string, DynamicContentGeneration[]> = new Map();
  private contentOptimizations: Map<string, ContentOptimization[]> = new Map();
  private personalizationProfiles: Map<string, ContentPersonalization[]> = new Map();

  constructor() {
    this.initializeDynamicRules();
    this.initializePersonalizationProfiles();
    this.generateInitialOptimizations();
  }

  /**
   * Initialisiert dynamische Content-Regeln
   */
  private initializeDynamicRules(): void {
    const baseRules: DynamicContentRule[] = [
      {
        id: 'seasonal_solar_savings',
        name: 'Saisonale Stromersparnis',
        trigger: {
          type: 'seasonal',
          conditions: [
            { field: 'month', operator: 'equals', value: [6, 7, 8] }, // Sommer
            { field: 'solar_hours', operator: 'greater_than', value: 200 }
          ]
        },
        contentType: 'blog',
        templateId: 'solaranlage-eigenheim-guide',
        priority: 'high',
        frequency: 'monthly',
        maxGenerations: 12,
        active: true
      },
      {
        id: 'competitor_price_drop',
        name: 'Konkurrenz-Preissenkung Reaktion',
        trigger: {
          type: 'competitor_action',
          conditions: [
            { field: 'competitor_price_change', operator: 'less_than', value: -0.05 },
            { field: 'market_share_impact', operator: 'greater_than', value: 0.1 }
          ]
        },
        contentType: 'landing_page',
        templateId: 'gewerbe-solar-ratgeber',
        priority: 'critical',
        frequency: 'once',
        maxGenerations: 1,
        active: true
      },
      {
        id: 'local_event_solar',
        name: 'Lokale Solar-Messe',
        trigger: {
          type: 'event',
          conditions: [
            { field: 'event_type', operator: 'equals', value: 'solar_fair' },
            { field: 'event_distance', operator: 'less_than', value: 50 }
          ]
        },
        contentType: 'blog',
        templateId: 'local-case-study',
        priority: 'medium',
        frequency: 'weekly',
        maxGenerations: 4,
        active: true
      },
      {
        id: 'performance_drop_recovery',
        name: 'Performance-Einbruch Erholung',
        trigger: {
          type: 'performance_drop',
          conditions: [
            { field: 'organic_traffic_change', operator: 'less_than', value: -0.15 },
            { field: 'ranking_drop', operator: 'greater_than', value: 2 }
          ]
        },
        contentType: 'guide',
        templateId: 'agri-pv-landwirtschaft',
        priority: 'high',
        frequency: 'weekly',
        maxGenerations: 8,
        active: true
      },
      {
        id: 'market_opportunity',
        name: 'Marktchance nutzen',
        trigger: {
          type: 'opportunity',
          conditions: [
            { field: 'keyword_opportunity_score', operator: 'greater_than', value: 70 },
            { field: 'competition_level', operator: 'equals', value: 'low' }
          ]
        },
        contentType: 'case_study',
        templateId: 'solaranlage-eigenheim-guide',
        priority: 'medium',
        frequency: 'monthly',
        maxGenerations: 6,
        active: true
      }
    ];

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const locationRules = baseRules.map(rule => ({
        ...rule,
        id: `${rule.id}_${locationKey}`
      }));

      this.dynamicRules.set(locationKey, locationRules);
    });
  }

  /**
   * Initialisiert Personalisierungsprofile
   */
  private initializePersonalizationProfiles(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const profiles: ContentPersonalization[] = [
        {
          userSegment: 'homeowner',
          locationKey,
          interests: ['stromersparnis', 'umweltschutz', 'hausmodernisierung'],
          behavior: {
            viewedPages: ['/photovoltaik', '/foerdermittel'],
            searchTerms: ['solaranlage kosten', 'pv anlage'],
            timeOnSite: 180,
            conversionStage: 'consideration'
          },
          preferences: {
            contentLength: 'medium',
            tone: 'conversational',
            format: 'text'
          }
        },
        {
          userSegment: 'business',
          locationKey,
          interests: ['rentabilität', 'steuervorteile', 'energieautarkie'],
          behavior: {
            viewedPages: ['/gewerbe', '/finanzierung'],
            searchTerms: ['gewerbe solar', 'pv contracting'],
            timeOnSite: 240,
            conversionStage: 'decision'
          },
          preferences: {
            contentLength: 'long',
            tone: 'professional',
            format: 'interactive'
          }
        },
        {
          userSegment: 'agriculture',
          locationKey,
          interests: ['agri-pv', 'doppelnutzung', 'förderungen'],
          behavior: {
            viewedPages: ['/landwirtschaft', '/agri-pv'],
            searchTerms: ['agri photovoltaik', 'solar felder'],
            timeOnSite: 300,
            conversionStage: 'awareness'
          },
          preferences: {
            contentLength: 'long',
            tone: 'technical',
            format: 'video'
          }
        }
      ];

      this.personalizationProfiles.set(locationKey, profiles);
    });
  }

  /**
   * Generiert initiale Optimierungen
   */
  private generateInitialOptimizations(): void {
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const optimizations: ContentOptimization[] = [];

      // SEO-Score Optimierung
      optimizations.push({
        contentId: `optimization_seo_${locationKey}`,
        locationKey,
        optimizationType: 'seo_score',
        currentValue: 65,
        targetValue: 85,
        recommendations: [
          'Meta-Description optimieren',
          'Interne Verlinkung verbessern',
          'Keyword-Dichte anpassen'
        ],
        priority: 'high',
        status: 'pending'
      });

      // Engagement-Optimierung
      optimizations.push({
        contentId: `optimization_engagement_${locationKey}`,
        locationKey,
        optimizationType: 'engagement',
        currentValue: 2.3,
        targetValue: 4.5,
        recommendations: [
          'Mehr Multimedia-Elemente hinzufügen',
          'Fragen am Ende des Artikels stellen',
          'Call-to-Actions verbessern'
        ],
        priority: 'medium',
        status: 'pending'
      });

      this.contentOptimizations.set(locationKey, optimizations);
    });
  }

  /**
   * Dynamischen Content basierend auf Regeln generieren
   */
  public generateDynamicContent(locationKey: string, triggerData: any = {}): DynamicContentGeneration[] {
    const rules = this.dynamicRules.get(locationKey) || [];
    const activeRules = rules.filter(rule => rule.active && this.evaluateTrigger(rule.trigger, triggerData));

    const generatedContent: DynamicContentGeneration[] = [];

    activeRules.forEach(rule => {
      if (this.shouldGenerateContent(rule, locationKey)) {
        try {
          const content = this.generateContentFromRule(rule, locationKey, triggerData);
          generatedContent.push(content);

          // Content zu lokalem Service hinzufügen
          const existingContent = localContentService.getContentForLocation(locationKey);
          existingContent.push(content.generatedContent);
          // Note: In real implementation, this would update the service
        } catch (error) {
          console.error(`Fehler bei dynamischer Content-Generierung für Regel ${rule.id}:`, error);
        }
      }
    });

    // Bestehende dynamische Inhalte aktualisieren
    const existingDynamicContent = this.generatedDynamicContent.get(locationKey) || [];
    existingDynamicContent.push(...generatedContent);
    this.generatedDynamicContent.set(locationKey, existingDynamicContent);

    return generatedContent;
  }

  /**
   * Trigger-Auswertung
   */
  private evaluateTrigger(trigger: DynamicContentRule['trigger'], triggerData: any): boolean {
    return trigger.conditions.every(condition => {
      const fieldValue = this.getNestedValue(triggerData, condition.field);

      switch (condition.operator) {
        case 'equals':
          if (Array.isArray(condition.value)) {
            return condition.value.includes(fieldValue);
          }
          return fieldValue === condition.value;

        case 'greater_than':
          return fieldValue > condition.value;

        case 'less_than':
          return fieldValue < condition.value;

        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());

        case 'between':
          return fieldValue >= condition.value[0] && fieldValue <= condition.value[1];

        default:
          return false;
      }
    });
  }

  /**
   * Hilfsfunktion für verschachtelte Werte
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Prüft, ob Content generiert werden sollte
   */
  private shouldGenerateContent(rule: DynamicContentRule, locationKey: string): boolean {
    const existingContent = this.generatedDynamicContent.get(locationKey) || [];
    const ruleContentCount = existingContent.filter(c => c.ruleId === rule.id).length;

    return ruleContentCount < rule.maxGenerations;
  }

  /**
   * Content aus Regel generieren
   */
  private generateContentFromRule(rule: DynamicContentRule, locationKey: string, triggerData: any): DynamicContentGeneration {
    const region = PRIMARY_SERVICE_REGIONS.find(r => r.city.toLowerCase() === locationKey);
    if (!region) {
      throw new Error(`Region ${locationKey} nicht gefunden`);
    }

    const locationProfile = multiLocationManagementService.getLocationProfile(locationKey);
    const personalizationProfiles = this.personalizationProfiles.get(locationKey) || [];

    // KI-generierten Content simulieren (in realer Implementierung würde hier eine KI-API aufgerufen)
    const aiEnhancedData = this.generateAIEnhancedContent(rule, region, locationProfile, triggerData);

    // Template aus lokalem Service verwenden
    const template = localContentService.getContentTemplates().find(t => t.id === rule.templateId);
    if (!template) {
      throw new Error(`Template ${rule.templateId} nicht gefunden`);
    }

    const generatedContent = localContentService.generateContentFromTemplate(template, region, aiEnhancedData);

    // Personalisierung basierend auf Segment
    const personalization = this.selectBestPersonalization(personalizationProfiles, triggerData);

    return {
      id: `dynamic_${rule.id}_${Date.now()}`,
      locationKey,
      ruleId: rule.id,
      contentType: rule.contentType,
      generatedContent,
      personalizationData: personalization,
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        engagementRate: 0,
        timeOnPage: 0
      },
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      expiresAt: rule.frequency === 'once' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * KI-gestützte Content-Erweiterung
   */
  private generateAIEnhancedContent(rule: DynamicContentRule, region: ServiceRegion, locationProfile: LocationProfile | null, triggerData: any): any {
    const enhancements: any = {};

    // Lokale Marktbedingungen integrieren
    if (locationProfile) {
      enhancements.marketData = {
        localCompetition: locationProfile.competitorData.totalCompetitors,
        marketSize: locationProfile.marketData.population,
        solarAdoption: locationProfile.marketData.solarAdoptionRate
      };
    }

    // Trigger-spezifische Anpassungen
    switch (rule.trigger.type) {
      case 'seasonal':
        enhancements.seasonalContext = {
          currentSeason: this.getCurrentSeason(),
          solarHours: triggerData.solar_hours || 1800,
          energyCosts: triggerData.energy_costs || 0.35
        };
        break;

      case 'competitor_action':
        enhancements.competitiveAdvantage = {
          priceDifference: triggerData.competitor_price_change || 0,
          uniqueSellingPoints: ['Lokaler Service', '25 Jahre Garantie', 'Deutsche Qualität']
        };
        break;

      case 'performance_drop':
        enhancements.recoveryFocus = {
          trafficLoss: triggerData.organic_traffic_change || 0,
          rankingIssues: triggerData.ranking_drop || 0,
          recoveryStrategies: ['Content-Optimierung', 'Backlink-Aufbau', 'Technische SEO']
        };
        break;
    }

    // Lokale Keywords dynamisch generieren
    enhancements.localKeywords = this.generateLocalKeywords(region, rule.contentType);

    // Lokale Statistiken und Fakten
    enhancements.localFacts = {
      population: region.population || 100000,
      solarPotential: region.solarPotential || 'hoch',
      averageRoofSize: '150-200 m²',
      energyConsumption: '3.500-4.500 kWh/Jahr'
    };

    return enhancements;
  }

  /**
   * Aktuelle Jahreszeit ermitteln
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Frühling';
    if (month >= 6 && month <= 8) return 'Sommer';
    if (month >= 9 && month <= 11) return 'Herbst';
    return 'Winter';
  }

  /**
   * Lokale Keywords generieren
   */
  private generateLocalKeywords(region: ServiceRegion, contentType: string): string[] {
    const baseKeywords = [
      `solaranlage ${region.city}`,
      `photovoltaik ${region.city}`,
      `pv ${region.city}`
    ];

    const typeSpecificKeywords: { [key: string]: string[] } = {
      blog: [`solar news ${region.city}`, `photovoltaik trends ${region.state}`],
      guide: [`solaranlage leitfaden ${region.city}`, `pv installation ${region.city}`],
      case_study: [`solar erfolg ${region.city}`, `pv referenz ${region.city}`],
      landing_page: [`solar anfrage ${region.city}`, `photovoltaik beratung ${region.city}`]
    };

    return [...baseKeywords, ...(typeSpecificKeywords[contentType] || [])];
  }

  /**
   * Beste Personalisierung auswählen
   */
  private selectBestPersonalization(profiles: ContentPersonalization[], triggerData: any): ContentPersonalization {
    // Einfache Auswahl-Logik - in realer Implementierung komplexer
    if (triggerData.userSegment) {
      const matchingProfile = profiles.find(p => p.userSegment === triggerData.userSegment);
      if (matchingProfile) return matchingProfile;
    }

    // Fallback auf Standard-Profil
    return profiles[0] || {
      userSegment: 'homeowner',
      locationKey: 'default',
      interests: [],
      behavior: {
        viewedPages: [],
        searchTerms: [],
        timeOnSite: 0,
        conversionStage: 'awareness'
      },
      preferences: {
        contentLength: 'medium',
        tone: 'professional',
        format: 'text'
      }
    };
  }

  /**
   * Personalisierte Content-Version generieren
   */
  public generatePersonalizedContent(baseContent: GeneratedContent, personalization: ContentPersonalization): GeneratedContent {
    const personalizedContent = { ...baseContent };

    // Content-Länge anpassen
    if (personalization.preferences.contentLength === 'short') {
      personalizedContent.content = this.shortenContent(baseContent.content);
    } else if (personalization.preferences.contentLength === 'long') {
      personalizedContent.content = this.expandContent(baseContent.content, personalization);
    }

    // Ton anpassen
    personalizedContent.content = this.adjustTone(personalizedContent.content, personalization.preferences.tone);

    // Interessen-spezifische Abschnitte hinzufügen
    if (personalization.interests.length > 0) {
      personalizedContent.content = this.addInterestSpecificSections(
        personalizedContent.content,
        personalization.interests
      );
    }

    // Conversion-Stage basierte CTAs
    personalizedContent.content = this.addConversionFocusedCTAs(
      personalizedContent.content,
      personalization.behavior.conversionStage
    );

    return personalizedContent;
  }

  /**
   * Content kürzen
   */
  private shortenContent(content: string): string {
    const paragraphs = content.split('\n\n');
    return paragraphs.slice(0, Math.ceil(paragraphs.length * 0.6)).join('\n\n');
  }

  /**
   * Content erweitern
   */
  private expandContent(content: string, personalization: ContentPersonalization): string {
    // Zusätzliche Abschnitte basierend auf Interessen hinzufügen
    let expandedContent = content;

    if (personalization.interests.includes('stromersparnis')) {
      expandedContent += '\n\n## Detaillierte Wirtschaftlichkeitsberechnung\n\n' +
        'Basierend auf Ihren aktuellen Stromkosten von 0,35€/kWh können Sie mit einer 8kWp Anlage jährlich ca. 1.200€ sparen.';
    }

    if (personalization.interests.includes('umweltschutz')) {
      expandedContent += '\n\n## Umweltbilanz Ihrer Solaranlage\n\n' +
        'Ihre Solaranlage vermeidet jährlich ca. 6,5 Tonnen CO₂-Emissionen, was der Pflanzung von 130 Bäumen entspricht.';
    }

    return expandedContent;
  }

  /**
   * Ton anpassen
   */
  private adjustTone(content: string, tone: string): string {
    // Einfache Ton-Anpassung - in realer Implementierung komplexer
    switch (tone) {
      case 'casual':
        return content.replace(/Sie/g, 'Du').replace(/Ihre/g, 'Deine');
      case 'technical':
        return content.replace(/einfach/g, 'technisch optimiert');
      case 'conversational':
        return content.replace(/wir bieten/g, 'wir haben genau das richtige für Sie');
      default:
        return content;
    }
  }

  /**
   * Interessen-spezifische Abschnitte hinzufügen
   */
  private addInterestSpecificSections(content: string, interests: string[]): string {
    let enhancedContent = content;

    interests.forEach(interest => {
      switch (interest) {
        case 'rentabilität':
          enhancedContent += '\n\n## ROI-Analyse für Ihr Unternehmen\n\n' +
            'Bereits nach 5-7 Jahren amortisiert sich Ihre Solaranlage durch die gesparten Energiekosten.';
          break;
        case 'steuervorteile':
          enhancedContent += '\n\n## Steuerliche Vorteile\n\n' +
            'Nutzen Sie die Möglichkeit der vollständigen Abschreibung über 20 Jahre.';
          break;
      }
    });

    return enhancedContent;
  }

  /**
   * Conversion-fokussierte CTAs hinzufügen
   */
  private addConversionFocusedCTAs(content: string, conversionStage: string): string {
    const ctaTemplates = {
      awareness: 'Interessiert? Fordern Sie unser kostenloses Infomaterial an.',
      consideration: 'Bereit für den nächsten Schritt? Vereinbaren Sie eine Beratung.',
      decision: 'Jetzt Angebot anfordern und von unseren Sonderkonditionen profitieren.'
    };

    const cta = ctaTemplates[conversionStage as keyof typeof ctaTemplates] || ctaTemplates.awareness;

    return content + `\n\n## Jetzt handeln\n\n${cta}`;
  }

  /**
   * Content-Optimierungen abrufen
   */
  public getContentOptimizations(locationKey: string): ContentOptimization[] {
    return this.contentOptimizations.get(locationKey) || [];
  }

  /**
   * Content-Optimierung anwenden
   */
  public applyContentOptimization(locationKey: string, optimizationId: string): boolean {
    const optimizations = this.contentOptimizations.get(locationKey);
    if (!optimizations) return false;

    const optimization = optimizations.find(opt => opt.contentId === optimizationId);
    if (!optimization) return false;

    optimization.status = 'applied';
    optimization.appliedAt = new Date().toISOString();

    return true;
  }

  /**
   * Dynamische Regeln für Standort abrufen
   */
  public getDynamicRules(locationKey: string): DynamicContentRule[] {
    return this.dynamicRules.get(locationKey) || [];
  }

  /**
   * Neue dynamische Regel erstellen
   */
  public createDynamicRule(locationKey: string, rule: Omit<DynamicContentRule, 'id'>): DynamicContentRule {
    const newRule: DynamicContentRule = {
      ...rule,
      id: `rule_${locationKey}_${Date.now()}`
    };

    const existingRules = this.dynamicRules.get(locationKey) || [];
    existingRules.push(newRule);
    this.dynamicRules.set(locationKey, existingRules);

    return newRule;
  }

  /**
   * Bulk-Content-Generierung für alle Standorte
   */
  public generateBulkDynamicContent(triggerData: any = {}): { generated: number; failed: number; results: DynamicContentGeneration[] } {
    let generated = 0;
    let failed = 0;
    const results: DynamicContentGeneration[] = [];

    PRIMARY_SERVICE_REGIONS.forEach(region => {
      try {
        const locationResults = this.generateDynamicContent(region.city.toLowerCase(), triggerData);
        results.push(...locationResults);
        generated += locationResults.length;
      } catch (error) {
        console.error(`Fehler bei dynamischer Content-Generierung für ${region.city}:`, error);
        failed++;
      }
    });

    return { generated, failed, results };
  }

  /**
   * Dashboard-Übersicht
   */
  public getDashboardOverview(): {
    totalDynamicContent: number;
    activeRules: number;
    pendingOptimizations: number;
    avgPerformance: number;
    topPerformingContent: Array<{location: string, performance: number}>;
    contentByType: { [key: string]: number };
  } {
    let totalDynamicContent = 0;
    let activeRules = 0;
    let pendingOptimizations = 0;
    let totalPerformance = 0;
    const contentByType: { [key: string]: number } = {};
    const locationPerformance: Array<{location: string, performance: number}> = [];

    Array.from(this.generatedDynamicContent.entries()).forEach(([locationKey, contents]) => {
      totalDynamicContent += contents.length;

      contents.forEach(content => {
        totalPerformance += content.performance.engagementRate;
        contentByType[content.contentType] = (contentByType[content.contentType] || 0) + 1;
      });

      if (contents.length > 0) {
        const avgPerformance = contents.reduce((sum, c) => sum + c.performance.engagementRate, 0) / contents.length;
        locationPerformance.push({ location: locationKey, performance: avgPerformance });
      }
    });

    Array.from(this.dynamicRules.values()).forEach(rules => {
      activeRules += rules.filter(r => r.active).length;
    });

    Array.from(this.contentOptimizations.values()).forEach(optimizations => {
      pendingOptimizations += optimizations.filter(opt => opt.status === 'pending').length;
    });

    locationPerformance.sort((a, b) => b.performance - a.performance);

    return {
      totalDynamicContent,
      activeRules,
      pendingOptimizations,
      avgPerformance: totalDynamicContent > 0 ? totalPerformance / totalDynamicContent : 0,
      topPerformingContent: locationPerformance.slice(0, 5),
      contentByType
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const dynamicLocalContentService = new DynamicLocalContentService();