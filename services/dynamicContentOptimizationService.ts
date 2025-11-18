/**
 * Dynamic Content Optimization Service für ZOE Solar
 *
 * KI-gestützte dynamische Content-Optimierung basierend auf User Behavior,
 * Personalisierung und Performance-Daten
 */

import { getAIGatewayService } from './core/AIGatewayService.js';

// Wrapper für KI-Keyword-Optimierung (OpenRouter/Mistral)
const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent.apply(aiGateway, args);
};

export interface UserProfile {
  id: string;
  sessionId: string;
  behavior: {
    pagesViewed: string[];
    timeOnPage: Record<string, number>;
    scrollDepth: Record<string, number>;
    interactions: Array<{
      type: 'click' | 'form' | 'download' | 'call';
      element: string;
      timestamp: Date;
    }>;
    searchQueries: string[];
    deviceType: 'desktop' | 'mobile' | 'tablet';
    location: {
      city?: string;
      region?: string;
      country: string;
    };
    referrer?: string;
  };
  preferences: {
    contentTypes: string[];
    industries: string[];
    budgetRange?: string;
    timeline?: string;
  };
  scores: {
    engagement: number; // 0-100
    intent: number; // 0-100 (purchase intent)
    authority: number; // 0-100
  };
  lastActive: Date;
}

export interface ContentVariant {
  id: string;
  originalContentId: string;
  targetAudience: string;
  personalizationRules: {
    location?: string[];
    industry?: string[];
    deviceType?: string[];
    behaviorScore?: { min: number; max: number };
  };
  modifications: {
    headline?: string;
    subheadline?: string;
    cta?: string;
    contentBlocks?: Array<{
      id: string;
      content: string;
      position: number;
    }>;
    images?: Array<{
      url: string;
      alt: string;
      priority: number;
    }>;
    schemaMarkup?: object;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
  };
  active: boolean;
  createdAt: Date;
}

export interface ContentOptimization {
  contentId: string;
  currentVariant: ContentVariant;
  availableVariants: ContentVariant[];
  recommendations: Array<{
    type: 'variant' | 'modification' | 'new_variant';
    description: string;
    expectedImprovement: number;
    confidence: number;
    implementation: string;
  }>;
  performance: {
    baseline: ContentVariant['performance'];
    bestVariant: ContentVariant['performance'];
    improvement: number;
  };
  lastOptimized: Date;
}

export interface DynamicContentRule {
  id: string;
  name: string;
  conditions: {
    userProfile: Partial<UserProfile>;
    pageContext: {
      url: string;
      contentType: string;
      category?: string;
    };
    technical: {
      deviceType?: string;
      screenSize?: string;
      connectionSpeed?: string;
    };
  };
  actions: {
    contentModifications: ContentVariant['modifications'];
    priority: number;
  };
  performance: {
    activationCount: number;
    successRate: number;
    averageImprovement: number;
  };
  active: boolean;
}

class DynamicContentOptimizationService {
  private static instance: DynamicContentOptimizationService;
  private userProfiles: Map<string, UserProfile> = new Map();
  private contentVariants: Map<string, ContentVariant[]> = new Map();
  private optimizations: Map<string, ContentOptimization> = new Map();
  private rules: Map<string, DynamicContentRule> = new Map();
  private optimizationInterval?: NodeJS.Timeout;

  private constructor() {
    this.initializeRules();
    this.startOptimization();
  }

  public static getInstance(): DynamicContentOptimizationService {
    if (!DynamicContentOptimizationService.instance) {
      DynamicContentOptimizationService.instance = new DynamicContentOptimizationService();
    }
    return DynamicContentOptimizationService.instance;
  }

  private initializeRules(): void {
    // Location-based Personalization
    this.rules.set('location-personalization', {
      id: 'location-personalization',
      name: 'Standort-basierte Personalisierung',
      conditions: {
        userProfile: {
          behavior: {
            pagesViewed: [],
            timeOnPage: {},
            scrollDepth: {},
            interactions: [],
            searchQueries: [],
            deviceType: 'desktop',
            location: { country: 'DE' }
          }
        },
        pageContext: {
          url: '/',
          contentType: 'location'
        },
        technical: {}
      },
      actions: {
        contentModifications: {
          headline: 'Solaranlagen in [CITY] - Ihr lokaler Partner',
          subheadline: 'Professionelle Photovoltaik-Lösungen für [REGION]',
          cta: 'Kostenlose Beratung in [CITY] anfordern'
        },
        priority: 8
      },
      performance: {
        activationCount: 0,
        successRate: 0,
        averageImprovement: 0
      },
      active: true
    });

    // Industry-specific Content
    this.rules.set('industry-personalization', {
      id: 'industry-personalization',
      name: 'Branchen-spezifische Personalisierung',
      conditions: {
        userProfile: {
          preferences: {
            contentTypes: [],
            industries: ['landwirtschaft', 'gewerbe', 'industrie']
          }
        },
        pageContext: {
          url: '/',
          contentType: 'service'
        },
        technical: {}
      },
      actions: {
        contentModifications: {
          contentBlocks: [{
            id: 'industry-specific-benefits',
            content: 'Spezialisiert auf [INDUSTRY] mit jahrelanger Erfahrung und maßgeschneiderten Lösungen.',
            position: 2
          }]
        },
        priority: 7
      },
      performance: {
        activationCount: 0,
        successRate: 0,
        averageImprovement: 0
      },
      active: true
    });

    // Mobile Optimization
    this.rules.set('mobile-optimization', {
      id: 'mobile-optimization',
      name: 'Mobile-spezifische Optimierung',
      conditions: {
        userProfile: {
          behavior: {
            pagesViewed: [],
            timeOnPage: {},
            scrollDepth: {},
            interactions: [],
            searchQueries: [],
            deviceType: 'mobile',
            location: { country: 'DE' }
          }
        },
        pageContext: {
          url: '*',
          contentType: 'service'
        },
        technical: {
          deviceType: 'mobile'
        }
      },
      actions: {
        contentModifications: {
          cta: 'Jetzt anrufen',
          contentBlocks: [{
            id: 'mobile-cta',
            content: 'Einfache mobile Buchung - Kostenlose Beratung in 24h',
            position: 1
          }]
        },
        priority: 6
      },
      performance: {
        activationCount: 0,
        successRate: 0,
        averageImprovement: 0
      },
      active: true
    });

    // High-Intent Users
    this.rules.set('high-intent-personalization', {
      id: 'high-intent-personalization',
      name: 'High-Intent User Personalisierung',
      conditions: {
        userProfile: {
          scores: {
            engagement: 80,
            intent: 70,
            authority: 50
          }
        },
        pageContext: {
          url: '/',
          contentType: 'product'
        },
        technical: {}
      },
      actions: {
        contentModifications: {
          cta: 'Jetzt individuelles Angebot erhalten',
          contentBlocks: [{
            id: 'urgency-element',
            content: 'Begrenzte Verfügbarkeit - Sichern Sie sich Ihren Termin noch heute!',
            position: 3
          }]
        },
        priority: 9
      },
      performance: {
        activationCount: 0,
        successRate: 0,
        averageImprovement: 0
      },
      active: true
    });
  }

  private _startOptimization(): void {
    // Optimierung alle 2 Stunden
    this.optimizationInterval = setInterval(() => {
      this.performOptimization();
    }, 2 * 60 * 60 * 1000);

    // Initiale Optimierung
    this.performOptimization();
  }

  private async performOptimization(): Promise<void> {
    try {
      // Analysiere User Behavior
      await this.analyzeUserBehavior();

      // Generiere Content-Varianten
      await this.generateContentVariants();

      // Teste und optimiere Varianten
      await this.testAndOptimizeVariants();

      // Aktualisiere Regeln basierend auf Performance
      await this.updateRulesBasedOnPerformance();

    } catch (error) {
      console.error('Failed to perform dynamic content optimization:', error);
    }
  }

  private async analyzeUserBehavior(): Promise<void> {
    // Sammle User Behavior Daten
    // In echter Implementierung würde hier Analytics-Daten verarbeitet

    const mockProfiles: UserProfile[] = [
      {
        id: 'user-1',
        sessionId: 'session-123',
        behavior: {
          pagesViewed: ['/photovoltaik', '/agri-pv/brandenburg'],
          timeOnPage: { '/photovoltaik': 180, '/agri-pv/brandenburg': 240 },
          scrollDepth: { '/photovoltaik': 85, '/agri-pv/brandenburg': 92 },
          interactions: [
            { type: 'click', element: 'cta-button', timestamp: new Date() },
            { type: 'form', element: 'contact-form', timestamp: new Date() }
          ],
          searchQueries: ['Agri-PV Brandenburg', 'Förderungen 2025'],
          deviceType: 'desktop',
          location: { city: 'Berlin', region: 'Berlin', country: 'DE' }
        },
        preferences: {
          contentTypes: ['case-studies', 'technical-docs'],
          industries: ['landwirtschaft']
        },
        scores: {
          engagement: 85,
          intent: 75,
          authority: 60
        },
        lastActive: new Date()
      }
    ];

    mockProfiles.forEach(profile => {
      this.userProfiles.set(profile.id, profile);
    });
  }

  private async generateContentVariants(): Promise<void> {
    const contentIds = ['photovoltaik-landing', 'agri-pv-landing', 'contact-form'];

    for (const contentId of contentIds) {
      const variants = await this.createVariantsForContent(contentId);
      this.contentVariants.set(contentId, variants);
    }
  }

  private async createVariantsForContent(contentId: string): Promise<ContentVariant[]> {
    const variants: ContentVariant[] = [];

    // Basis-Variante
    variants.push({
      id: `${contentId}-base`,
      originalContentId: contentId,
      targetAudience: 'general',
      personalizationRules: {},
      modifications: {},
      performance: {
        impressions: 1000,
        clicks: 50,
        conversions: 5,
        ctr: 0.05,
        conversionRate: 0.005
      },
      active: true,
      createdAt: new Date()
    });

    // Standort-spezifische Variante
    variants.push({
      id: `${contentId}-location`,
      originalContentId: contentId,
      targetAudience: 'location-specific',
      personalizationRules: {
        location: ['Berlin', 'München', 'Hamburg']
      },
      modifications: {
        headline: 'Solaranlagen in Ihrer Region',
        cta: 'Lokalen Termin vereinbaren'
      },
      performance: {
        impressions: 500,
        clicks: 35,
        conversions: 4,
        ctr: 0.07,
        conversionRate: 0.008
      },
      active: true,
      createdAt: new Date()
    });

    // Mobile-spezifische Variante
    variants.push({
      id: `${contentId}-mobile`,
      originalContentId: contentId,
      targetAudience: 'mobile-users',
      personalizationRules: {
        deviceType: ['mobile']
      },
      modifications: {
        cta: 'Jetzt anrufen: 030 123456',
        contentBlocks: [{
          id: 'mobile-benefits',
          content: '✓ Kostenlose Beratung\n✓ 24h Rückruf\n✓ Mobile Terminvereinbarung',
          position: 1
        }]
      },
      performance: {
        impressions: 300,
        clicks: 25,
        conversions: 3,
        ctr: 0.083,
        conversionRate: 0.01
      },
      active: true,
      createdAt: new Date()
    });

    return variants;
  }

  private async testAndOptimizeVariants(): Promise<void> {
    // A/B Testing Simulation
    for (const [contentId, variants] of this.contentVariants) {
      const optimization = await this.optimizeContentVariants(contentId, variants);
      this.optimizations.set(contentId, optimization);
    }
  }

  private async optimizeContentVariants(contentId: string, variants: ContentVariant[]): Promise<ContentOptimization> {
    // Finde beste Variante basierend auf Performance
    const bestVariant = variants.reduce((best, current) =>
      current.performance.conversionRate > best.performance.conversionRate ? current : best
    );

    const baseline = variants.find(v => v.id.endsWith('-base')) || variants[0];

    const improvement = (baseline && baseline.performance.conversionRate)
      ? ((bestVariant.performance.conversionRate - baseline.performance.conversionRate) /
        baseline.performance.conversionRate) * 100
      : 0;

    // Generiere KI-basierte Empfehlungen
    const recommendations = await this.generateOptimizationRecommendations(contentId, variants, bestVariant);

    return {
      contentId,
      currentVariant: bestVariant,
      availableVariants: variants,
      recommendations,
      performance: {
  baseline: baseline ? baseline.performance : bestVariant.performance,
        bestVariant: bestVariant.performance,
        improvement
      },
      lastOptimized: new Date()
    };
  }

  private async generateOptimizationRecommendations(
    contentId: string,
    variants: ContentVariant[],
    bestVariant: ContentVariant
  ): Promise<ContentOptimization['recommendations']> {
    const recommendations = [];

    // Analysiere Performance-Muster
    const highPerformingElements = this.analyzeHighPerformingElements(variants);

    if (highPerformingElements.includes('urgency')) {
      recommendations.push({
        type: 'modification',
        description: 'Dringlichkeit-Elemente haben Conversion um 25% gesteigert',
        expectedImprovement: 25,
        confidence: 0.85,
        implementation: 'Fügen Sie "Begrenzte Verfügbarkeit" oder "Nur noch wenige Termine frei" hinzu'
      });
    }

    if (highPerformingElements.includes('localization')) {
      recommendations.push({
        type: 'new_variant',
        description: 'Standort-spezifische Varianten zeigen 30% höhere Conversion',
        expectedImprovement: 30,
        confidence: 0.9,
        implementation: 'Erstellen Sie Varianten für alle 10 Hauptstandorte'
      });
    }

    // KI-gestützte Empfehlungen
    try {
      const aiRecommendations = await this.generateAIRecommendations(contentId, bestVariant);
      recommendations.push(...aiRecommendations);
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
    }

    return recommendations.map(r => ({
      ...r,
      type: (['variant','modification','new_variant'].includes(r.type) ? r.type : 'modification') as 'variant'|'modification'|'new_variant'
    }));
  }

  private analyzeHighPerformingElements(variants: ContentVariant[]): string[] {
    const elements: string[] = [];

    const bestVariant = variants.reduce((best, current) =>
      current.performance.conversionRate > best.performance.conversionRate ? current : best
    );

    if (bestVariant.modifications.cta?.toLowerCase().includes('jetzt') ||
        bestVariant.modifications.cta?.toLowerCase().includes('sofort')) {
      elements.push('urgency');
    }

    if (bestVariant.personalizationRules.location) {
      elements.push('localization');
    }

    if (bestVariant.personalizationRules.deviceType?.includes('mobile')) {
      elements.push('mobile-optimization');
    }

    return elements;
  }

  private async generateAIRecommendations(contentId: string, bestVariant: ContentVariant): Promise<ContentOptimization['recommendations']> {
    try {
      const prompt = `Analysiere diese Content-Variante und schlage Verbesserungen vor:
      Content-ID: ${contentId}
      Beste Variante: ${JSON.stringify(bestVariant.modifications)}
      Performance: ${bestVariant.performance.conversionRate * 100}% Conversion Rate

      Gib 2-3 konkrete Verbesserungsvorschläge mit erwarteter Verbesserung zurück.`;

  const aiResponse = await optimizeKeywords({ content: prompt });

      return [
        {
          type: 'modification',
          description: (aiResponse && typeof aiResponse === 'object' && 'optimizedTitle' in aiResponse && typeof aiResponse.optimizedTitle === 'string' && aiResponse.optimizedTitle.length > 0)
            ? aiResponse.optimizedTitle
            : 'KI-gestützte Content-Optimierung',
          expectedImprovement: 15,
          confidence: 0.75,
          implementation: 'Implementiere KI-Empfehlungen für Headlines und CTAs'
        }
      ];
    } catch {
      return [];
    }
  }

  private async updateRulesBasedOnPerformance(): Promise<void> {
    // Aktualisiere Regel-Performance basierend auf tatsächlichen Daten
    for (const [ruleId, rule] of this.rules) {
      const performance = this.calculateRulePerformance(rule);
      this.rules.set(ruleId, { ...rule, performance });
    }
  }

  private calculateRulePerformance(rule: DynamicContentRule): DynamicContentRule['performance'] {
    // Simuliere Performance-Berechnung
    return {
      activationCount: Math.floor(Math.random() * 100) + 50,
      successRate: Math.random() * 0.3 + 0.7, // 70-100%
      averageImprovement: Math.random() * 20 + 10 // 10-30%
    };
  }

  // ===== PUBLIC API =====

  public getPersonalizedContent(userId: string, contentId: string, context: any): ContentVariant | null {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return null;

    const variants = this.contentVariants.get(contentId);
    if (!variants) return null;

    // Finde beste passende Variante
    const matchingVariants = variants.filter(variant =>
      this.matchesPersonalizationRules(variant, userProfile, context)
    );

    if (matchingVariants.length === 0) return null;

    // Wähle Variante mit bester Performance
    return matchingVariants.reduce((best, current) =>
      current.performance.conversionRate > best.performance.conversionRate ? current : best
    );
  }

  private matchesPersonalizationRules(variant: ContentVariant, userProfile: UserProfile, context: any): boolean {
    const rules = variant.personalizationRules;

    if (rules.location && userProfile.behavior.location.city) {
      if (!rules.location.includes(userProfile.behavior.location.city)) {
        return false;
      }
    }

    if (rules.industry && userProfile.preferences.industries.length > 0) {
      const hasMatch = userProfile.preferences.industries.some(industry =>
        rules.industry!.some(ruleIndustry => ruleIndustry.toLowerCase().includes(industry.toLowerCase()))
      );
      if (!hasMatch) return false;
    }

    if (rules.deviceType && !rules.deviceType.includes(userProfile.behavior.deviceType)) {
      return false;
    }

    if (rules.behaviorScore) {
      const userScore = userProfile.scores.engagement;
      if (userScore < rules.behaviorScore.min || userScore > rules.behaviorScore.max) {
        return false;
      }
    }

    return true;
  }

  public getContentOptimization(contentId: string): ContentOptimization | undefined {
    return this.optimizations.get(contentId);
  }

  public getAllOptimizations(): ContentOptimization[] {
    return Array.from(this.optimizations.values());
  }

  public getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  public updateUserProfile(userId: string, updates: Partial<UserProfile>): void {
    const existing = this.userProfiles.get(userId);
    if (existing) {
      this.userProfiles.set(userId, { ...existing, ...updates, lastActive: new Date() });
    }
  }

  public getDynamicRules(): DynamicContentRule[] {
    return Array.from(this.rules.values());
  }

  public async createContentVariant(variant: Omit<ContentVariant, 'id' | 'createdAt'>): Promise<string> {
    const id = `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newVariant: ContentVariant = {
      ...variant,
      id,
      createdAt: new Date()
    };

    const existingVariants = this.contentVariants.get(variant.originalContentId) || [];
    existingVariants.push(newVariant);
    this.contentVariants.set(variant.originalContentId, existingVariants);

    return id;
  }

  public async updateRule(ruleId: string, updates: Partial<DynamicContentRule>): Promise<void> {
    const existing = this.rules.get(ruleId);
    if (!existing) throw new Error(`Rule ${ruleId} not found`);

    this.rules.set(ruleId, { ...existing, ...updates });
  }

  public getPerformanceOverview(): {
    totalUsers: number;
    activeVariants: number;
    averageImprovement: number;
    topPerformingContent: Array<{ contentId: string; improvement: number }>;
  } {
    const totalUsers = this.userProfiles.size;
    const activeVariants = Array.from(this.contentVariants.values())
      .flat()
      .filter(variant => variant.active).length;

    const optimizations = Array.from(this.optimizations.values());
    const averageImprovement = optimizations.reduce((sum, opt) => sum + opt.performance.improvement, 0) /
                              Math.max(optimizations.length, 1);

    const topPerformingContent = optimizations
      .sort((a, b) => b.performance.improvement - a.performance.improvement)
      .slice(0, 5)
      .map(opt => ({
        contentId: opt.contentId,
        improvement: opt.performance.improvement
      }));

    return {
      totalUsers,
      activeVariants,
      averageImprovement,
      topPerformingContent
    };
  }

  public stopOptimization(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = undefined;
    }
  }

  public startOptimization(): void {
    if (!this.optimizationInterval) {
      this._startOptimization();
    }
  }
}

export const dynamicContentOptimizationService = DynamicContentOptimizationService.getInstance();
export default dynamicContentOptimizationService;