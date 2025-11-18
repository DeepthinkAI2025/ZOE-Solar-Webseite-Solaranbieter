// KI-basierte Personalisierung Service für ZOE Solar
import { AIPoweredLocalContentPersonalizationService } from './aiPoweredLocalContentPersonalizationService';

export interface PersonalizationConfig {
  enableRecommendations: boolean;
  enableJourneyOptimization: boolean;
  supportedSegments: string[];
}

export interface ProductRecommendation {
  productId: string;
  relevanceScore: number;
  reasoning: string;
}

export interface PersonalizedContent {
  userId: string;
  contentId: string;
  variant: string;
  personalizationFactors: string[];
}

export interface JourneyOptimizationResult {
  userId: string;
  optimizedSteps: string[];
  conversionProbability: number;
}

export class AIPersonalizationService {
  private config: PersonalizationConfig;
  private personalizationService: AIPoweredLocalContentPersonalizationService;

  constructor(config: PersonalizationConfig) {
    this.config = config;
    this.personalizationService = new AIPoweredLocalContentPersonalizationService();
  }

  public async getProductRecommendations(userId: string, locationKey: string): Promise<ProductRecommendation[]> {
    const rec = this.personalizationService.getContentRecommendations(userId, locationKey);
    return rec.recommendations.map(r => ({
      productId: r.productId,
      relevanceScore: r.relevance,
      reasoning: r.reasoning,
    }));
  }

  public async getPersonalizedContent(userId: string, contentId: string): Promise<PersonalizedContent | null> {
    return this.personalizationService.getPersonalizedContent(userId, contentId);
  }

  public async optimizeUserJourney(userId: string, locationKey: string): Promise<JourneyOptimizationResult> {
    // User Journey Optimierung (Platzhalter)
    return {
      userId,
      optimizedSteps: ['Landing', 'Produktvergleich', 'Kontakt'],
      conversionProbability: 0.87,
    };
  }

  public getConfig(): PersonalizationConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<PersonalizationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Dynamische Segmentierung und Echtzeit-Personalisierung
  public async segmentAndPersonalizeContent(userId: string, contentId: string, context: Record<string, any>): Promise<PersonalizedContent | null> {
    try {
      // Segment-Erkennung (Platzhalter)
      const segment = this.config.supportedSegments.find(s => context.segment === s) || 'default';
      const personalized = await this.getPersonalizedContent(userId, contentId);
      if (personalized) {
        personalized.variant = segment;
        personalized.personalizationFactors.push('Segment:' + segment);
        console.log(`[Personalization] Content für User ${userId} im Segment ${segment} personalisiert.`);
        return personalized;
      }
      return null;
    } catch (err) {
      console.error('[Personalization] Fehler bei Segmentierung/Personalisierung:', err);
      return null;
    }
  }
}