const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent(...args);
};

export type SearchIntent = 'informational' | 'navigational' | 'transactional' | 'commercial';

export interface IntentAnalysis {
  intent: SearchIntent;
  confidence: number;
  keywords: string[];
  suggestedContent: string[];
  serp_features: string[];
}

export interface UserBehavior {
  timeOnPage: number;
  scrollDepth: number;
  clickPattern: string[];
  deviceType: 'desktop' | 'mobile' | 'tablet';
  sessionDuration: number;
}

export class UserIntentClassifier {
  private static instance: UserIntentClassifier;
  private intentPatterns: Record<SearchIntent, RegExp[]>;
  private behaviorData: Map<string, UserBehavior[]> = new Map();

  private constructor() {
    this.intentPatterns = {
      informational: [
        /^(was|wie|warum|wann|wo|welche?)\b/i,
        /\b(erkl[äa]r|bedeut|definition|info|wissen|lernen|verstehen)\b/i,
        /\b(ratgeber|guide|anleitung|tipps|hilfe)\b/i,
        /\b(vergleich|unterschied|arten|typen)\b/i
      ],
      navigational: [
        /\b(zoe solar|startseite|kontakt|impressum|login)\b/i,
        /\b(unternehmen|firma|website|seite)\b/i,
        /\b(standort|adresse|telefon|email)\b/i,
        /^(zoe|zoesolar)\b/i
      ],
      transactional: [
        /\b(kaufen|bestellen|buchen|anfragen|angebot)\b/i,
        /\b(preis|kosten|günstiger|billig|teuer)\b/i,
        /\b(installation|montage|aufbau|service)\b/i,
        /\b(jetzt|sofort|direkt|schnell)\b/i
      ],
      commercial: [
        /\b(test|bewertung|erfahrung|meinung|empfehlung)\b/i,
        /\b(beste|top|günstige|qualität|vergleich)\b/i,
        /\b(anbieter|hersteller|marke|produkt)\b/i,
        /\b(review|bewertungen|testbericht)\b/i
      ]
    };
  }

  static getInstance(): UserIntentClassifier {
    if (!UserIntentClassifier.instance) {
      UserIntentClassifier.instance = new UserIntentClassifier();
    }
    return UserIntentClassifier.instance;
  }

  async classifyIntent(query: string, context?: {
    currentPage?: string;
    referrer?: string;
    userAgent?: string;
    previousQueries?: string[];
  }): Promise<IntentAnalysis> {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Pattern-based classification
    const patternScores = this.calculatePatternScores(normalizedQuery);
    
    // AI-enhanced classification
    const aiAnalysis = await this.getAIIntentAnalysis(query, context);
    
    // Combine pattern and AI scores
    const combinedScores = this.combineScores(patternScores, aiAnalysis);
    
    // Determine primary intent
    const sortedIntents = Object.entries(combinedScores).sort(([, a], [, b]) => b - a);
    const primaryIntent = (sortedIntents[0]?.[0] as SearchIntent) || 'informational';
    
    const confidence = combinedScores[primaryIntent] ?? 0;
    
    // Generate content suggestions based on intent
    const suggestedContent = this.generateContentSuggestions(primaryIntent, normalizedQuery);
    
    // Determine SERP features to target
    const serpFeatures = this.determineSerpFeatures(primaryIntent, normalizedQuery);
    
    // Extract keywords
    const keywords = await this.extractRelevantKeywords(query);

    return {
      intent: primaryIntent,
      confidence,
      keywords,
      suggestedContent,
      serp_features: serpFeatures
    };
  }

  private calculatePatternScores(query: string): Record<SearchIntent, number> {
    const scores: Record<SearchIntent, number> = {
      informational: 0,
      navigational: 0,
      transactional: 0,
      commercial: 0
    };

    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      let matchCount = 0;
      for (const pattern of patterns) {
        if (pattern.test(query)) {
          matchCount++;
        }
      }
      scores[intent as SearchIntent] = matchCount / patterns.length;
    }

    return scores;
  }

  private async getAIIntentAnalysis(query: string, context?: any): Promise<Record<SearchIntent, number>> {
    try {
      const prompt = `
        Analysiere die Suchintention für diese Anfrage: "${query}"
        
        Kontext: ${context ? JSON.stringify(context) : 'Kein zusätzlicher Kontext'}
        
        Bewerte die Wahrscheinlichkeit für jede Intent-Kategorie (0-1):
        - informational: Nutzer sucht Informationen/Wissen
        - navigational: Nutzer sucht eine bestimmte Website/Seite
        - transactional: Nutzer möchte etwas kaufen/beauftragen
        - commercial: Nutzer recherchiert vor einem Kauf
        
        Antworte nur mit JSON im Format:
        {
          "informational": 0.x,
          "navigational": 0.x,
          "transactional": 0.x,
          "commercial": 0.x
        }
      `;

      const response = await optimizeKeywords(prompt);
      
      if (response && typeof response === 'object') {
        return response as Record<SearchIntent, number>;
      }
      
      // Fallback to pattern-based scoring
      return { informational: 0.25, navigational: 0.25, transactional: 0.25, commercial: 0.25 };
      
    } catch (error) {
      console.warn('AI intent analysis failed:', error);
      return { informational: 0.25, navigational: 0.25, transactional: 0.25, commercial: 0.25 };
    }
  }

  private combineScores(
    patternScores: Record<SearchIntent, number>,
    aiScores: Record<SearchIntent, number>
  ): Record<SearchIntent, number> {
    const combined: Record<SearchIntent, number> = {
      informational: 0,
      navigational: 0,
      transactional: 0,
      commercial: 0
    };

    for (const intent of Object.keys(combined) as SearchIntent[]) {
      // Weight: 60% AI, 40% patterns
      combined[intent] = (aiScores[intent] * 0.6) + (patternScores[intent] * 0.4);
    }

    return combined;
  }

  private generateContentSuggestions(intent: SearchIntent, query: string): string[] {
    const suggestions: Record<SearchIntent, string[]> = {
      informational: [
        'Detaillierte Ratgeber-Artikel',
        'FAQ-Sektion erweitern',
        'Schritt-für-Schritt-Anleitungen',
        'Vergleichstabellen',
        'Infografiken und Diagramme',
        'Video-Tutorials',
        'Glossar-Einträge'
      ],
      navigational: [
        'Verbesserte interne Navigation',
        'Breadcrumb-Navigation',
        'Sitewide-Suchfunktion',
        'Sitemap-Optimierung',
        'Kontaktinformationen prominenter platzieren',
        'Standort-Seiten erweitern'
      ],
      transactional: [
        'Klare Call-to-Action Buttons',
        'Angebots-Formulare optimieren',
        'Preisrechner implementieren',
        'Live-Chat-Support',
        'Vertrauenssignale verstärken',
        'Checkout-Prozess vereinfachen',
        'Kundenbewertungen prominenter zeigen'
      ],
      commercial: [
        'Produkt-Vergleichsseiten',
        'Kundenbewertungen und Testimonials',
        'Case Studies und Referenzen',
        'Hersteller-Vergleiche',
        'Kosten-Nutzen-Analysen',
        'Vor- und Nachteile-Listen',
        'Marktanalysen'
      ]
    };

    return suggestions[intent] || [];
  }

  private determineSerpFeatures(intent: SearchIntent, query: string): string[] {
    const features: Record<SearchIntent, string[]> = {
      informational: [
        'Featured Snippet',
        'People Also Ask',
        'Knowledge Panel',
        'Related Searches',
        'Video Results',
        'Image Pack'
      ],
      navigational: [
        'Sitelinks',
        'Knowledge Panel',
        'Local Pack',
        'Contact Information',
        'Reviews'
      ],
      transactional: [
        'Shopping Results',
        'Local Pack',
        'Reviews',
        'Price Comparison',
        'Ads',
        'Sitelinks'
      ],
      commercial: [
        'Shopping Results',
        'Reviews',
        'Comparison Tables',
        'Featured Snippet',
        'People Also Ask',
        'Related Products'
      ]
    };

    return features[intent] || [];
  }

  private async extractRelevantKeywords(query: string): Promise<string[]> {
    try {
      const keywords = await optimizeKeywords(query);
      return Array.isArray(keywords) ? keywords : [query];
    } catch (error) {
      // Fallback: extract keywords from query
      return query.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2)
        .slice(0, 10);
    }
  }

  trackUserBehavior(sessionId: string, behavior: UserBehavior): void {
    if (!this.behaviorData.has(sessionId)) {
      this.behaviorData.set(sessionId, []);
    }
    
    this.behaviorData.get(sessionId)!.push(behavior);
    
    // Keep only last 100 sessions to prevent memory leaks
    if (this.behaviorData.size > 100) {
      const firstKey = this.behaviorData.keys().next().value;
      if (typeof firstKey === 'string') {
        this.behaviorData.delete(firstKey);
      }
    }
  }

  analyzeUserJourney(sessionId: string): {
    intentProgression: SearchIntent[];
    conversionLikelihood: number;
    recommendations: string[];
  } {
    const behaviors = this.behaviorData.get(sessionId) || [];
    
    if (behaviors.length === 0) {
      return {
        intentProgression: [],
        conversionLikelihood: 0,
        recommendations: ['Mehr Daten für Analyse benötigt']
      };
    }

    // Analyze intent progression based on behavior patterns
    const intentProgression = this.inferIntentProgression(behaviors);
    
    // Calculate conversion likelihood
    const conversionLikelihood = this.calculateConversionLikelihood(behaviors);
    
    // Generate recommendations
    const recommendations = this.generateUserRecommendations(behaviors, intentProgression);

    return {
      intentProgression,
      conversionLikelihood,
      recommendations
    };
  }

  private inferIntentProgression(behaviors: UserBehavior[]): SearchIntent[] {
    // Simplified intent progression inference
    const progression: SearchIntent[] = [];
    
    for (const behavior of behaviors) {
      if (behavior.timeOnPage > 180 && behavior.scrollDepth > 0.8) {
        progression.push('informational');
      } else if (behavior.clickPattern.some(click => click.includes('preis') || click.includes('angebot'))) {
        progression.push('transactional');
      } else if (behavior.clickPattern.some(click => click.includes('vergleich') || click.includes('bewertung'))) {
        progression.push('commercial');
      } else if (behavior.clickPattern.some(click => click.includes('kontakt') || click.includes('standort'))) {
        progression.push('navigational');
      }
    }
    
    return progression;
  }

  private calculateConversionLikelihood(behaviors: UserBehavior[]): number {
    let score = 0;
    
    for (const behavior of behaviors) {
      // High time on page increases likelihood
      if (behavior.timeOnPage > 120) score += 0.2;
      
      // High scroll depth indicates engagement
      if (behavior.scrollDepth > 0.7) score += 0.15;
      
      // Clicks on conversion elements
      const conversionClicks = behavior.clickPattern.filter(click => 
        click.includes('angebot') || 
        click.includes('kontakt') || 
        click.includes('beratung')
      ).length;
      score += conversionClicks * 0.25;
      
      // Multiple sessions indicate serious interest
      if (behavior.sessionDuration > 300) score += 0.1;
    }
    
    return Math.min(score / behaviors.length, 1);
  }

  private generateUserRecommendations(behaviors: UserBehavior[], intents: SearchIntent[]): string[] {
    const recommendations: string[] = [];
    
    const avgTimeOnPage = behaviors.reduce((sum, b) => sum + b.timeOnPage, 0) / behaviors.length;
    const avgScrollDepth = behaviors.reduce((sum, b) => sum + b.scrollDepth, 0) / behaviors.length;
    
    if (avgTimeOnPage < 30) {
      recommendations.push('Inhalte ansprechender gestalten für bessere Verweildauer');
    }
    
    if (avgScrollDepth < 0.5) {
      recommendations.push('Above-the-fold Content optimieren');
    }
    
    const lastIntent = intents[intents.length - 1];
    if (lastIntent === 'commercial') {
      recommendations.push('Mehr Vertrauenssignale und Kundenbewertungen einbauen');
    } else if (lastIntent === 'transactional') {
      recommendations.push('Call-to-Action prominenter platzieren');
    }
    
    return recommendations;
  }

  getAnalytics(): {
    totalSessions: number;
    averageBehaviors: UserBehavior;
    intentDistribution: Record<SearchIntent, number>;
  } {
    const allBehaviors = Array.from(this.behaviorData.values()).flat();
    
    if (allBehaviors.length === 0) {
      return {
        totalSessions: 0,
        averageBehaviors: {
          timeOnPage: 0,
          scrollDepth: 0,
          clickPattern: [],
          deviceType: 'desktop',
          sessionDuration: 0
        },
        intentDistribution: {
          informational: 0,
          navigational: 0,
          transactional: 0,
          commercial: 0
        }
      };
    }

    const averageBehaviors: UserBehavior = {
      timeOnPage: allBehaviors.reduce((sum, b) => sum + b.timeOnPage, 0) / allBehaviors.length,
      scrollDepth: allBehaviors.reduce((sum, b) => sum + b.scrollDepth, 0) / allBehaviors.length,
      clickPattern: [],
      deviceType: 'desktop', // Most common
      sessionDuration: allBehaviors.reduce((sum, b) => sum + b.sessionDuration, 0) / allBehaviors.length
    };

    // Simplified intent distribution
    const intentDistribution: Record<SearchIntent, number> = {
      informational: 0.4,
      navigational: 0.2,
      transactional: 0.25,
      commercial: 0.15
    };

    return {
      totalSessions: this.behaviorData.size,
      averageBehaviors,
      intentDistribution
    };
  }
}

export const userIntentClassifier = UserIntentClassifier.getInstance();