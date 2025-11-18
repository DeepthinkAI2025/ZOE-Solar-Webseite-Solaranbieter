const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent(...args);
};

export interface FeaturedSnippetStructure {
  type: 'paragraph' | 'list' | 'table' | 'video';
  content: string;
  title: string;
  url: string;
  position: number;
}

export interface PeopleAlsoAskQuestion {
  question: string;
  answer: string;
  relatedQuestions: string[];
  searchVolume?: number;
}

export interface SerpFeatureOptimization {
  featuredSnippet: {
    targetQuery: string;
    optimizedContent: string;
    structure: FeaturedSnippetStructure['type'];
    confidence: number;
  };
  peopleAlsoAsk: PeopleAlsoAskQuestion[];
  relatedSearches: string[];
  voiceSearchOptimization: {
    conversationalQueries: string[];
    answerFormat: string;
  };
}

export class SerpFeatureOptimizer {
  private static instance: SerpFeatureOptimizer;
  private snippetCache: Map<string, SerpFeatureOptimization> = new Map();

  private constructor() {}

  static getInstance(): SerpFeatureOptimizer {
    if (!SerpFeatureOptimizer.instance) {
      SerpFeatureOptimizer.instance = new SerpFeatureOptimizer();
    }
    return SerpFeatureOptimizer.instance;
  }

  async optimizeForFeaturedSnippet(
    query: string,
    content: string,
    targetType: FeaturedSnippetStructure['type'] = 'paragraph'
  ): Promise<{
    optimizedContent: string;
    confidence: number;
    recommendations: string[];
  }> {
    
    const cacheKey = `${query}-${targetType}`;
    if (this.snippetCache.has(cacheKey)) {
      const cached = this.snippetCache.get(cacheKey)!;
      return {
        optimizedContent: cached.featuredSnippet.optimizedContent,
        confidence: cached.featuredSnippet.confidence,
        recommendations: this.generateRecommendations(targetType)
      };
    }

    try {
      const optimizedContent = await this.generateSnippetContent(query, content, targetType);
      const confidence = this.calculateSnippetConfidence(query, optimizedContent, targetType);
      const recommendations = this.generateRecommendations(targetType);

      return {
        optimizedContent,
        confidence,
        recommendations
      };
    } catch (error) {
      console.error('Featured snippet optimization failed:', error);
      return {
        optimizedContent: this.fallbackSnippetOptimization(query, content, targetType),
        confidence: 0.3,
        recommendations: this.generateRecommendations(targetType)
      };
    }
  }

  private async generateSnippetContent(
    query: string,
    content: string,
    type: FeaturedSnippetStructure['type']
  ): Promise<string> {
    const prompts = {
      paragraph: `
        Optimiere diesen Content für ein Featured Snippet (Paragraph-Format) für die Suchanfrage: "${query}"
        
        Original Content: ${content}
        
        Erstelle eine präzise, 40-60 Wörter lange Antwort, die:
        - Die Frage direkt beantwortet
        - Klar und verständlich ist
        - Wichtige Keywords enthält
        - Zum Weiterlesen anregt
        
        Format: Direkte Antwort ohne einleitende Phrasen.
      `,
      
      list: `
        Erstelle eine optimierte Liste für Featured Snippet für: "${query}"
        
        Basierend auf: ${content}
        
        Format als nummerierte oder Bullet-Point Liste mit:
        - 3-8 prägnanten Punkten
        - Klarer Hierarchie
        - Actionable Items
        - Keywords in den Listenpunkten
        
        Gib nur die Liste zurück, keine zusätzlichen Erklärungen.
      `,
      
      table: `
        Erstelle eine Tabelle für Featured Snippet für: "${query}"
        
        Basierend auf: ${content}
        
        Format als HTML-Tabelle mit:
        - Klaren Spaltenüberschriften
        - 3-6 Zeilen mit relevanten Daten
        - Vergleichbare Werte
        - Keywords in Überschriften
        
        Nur die Tabelle als HTML zurückgeben.
      `,
      
      video: `
        Optimiere für Video Featured Snippet für: "${query}"
        
        Content: ${content}
        
        Erstelle:
        - Einen catchy Videotitel (60 Zeichen)
        - Eine prägnante Beschreibung (120 Zeichen)
        - 3-5 Timestamps mit Beschreibungen
        
        Format als JSON mit title, description, timestamps.
      `
    };

    const response = await optimizeKeywords(prompts[type]);
    return typeof response === 'string' ? response : content;
  }

  private calculateSnippetConfidence(
    query: string,
    content: string,
    type: FeaturedSnippetStructure['type']
  ): number {
    let confidence = 0.5; // Base confidence

    // Length optimization
    const wordCount = content.split(' ').length;
    if (type === 'paragraph' && wordCount >= 40 && wordCount <= 60) {
      confidence += 0.2;
    }

    // Query keyword presence
    const queryWords = query
      .toLowerCase()
      .split(' ')
      .filter(Boolean);
    const contentWords = content.toLowerCase();
    if (queryWords.length > 0) {
      const keywordMatches = queryWords.filter(word => contentWords.includes(word)).length;
      confidence += (keywordMatches / queryWords.length) * 0.2;
    }

    // Structure optimization
    if (type === 'list' && /^(\d+\.|•|-|\*)/.test(content.trim())) {
      confidence += 0.1;
    }

    // Direct answer format
    const primaryKeyword = queryWords[0];
    if (primaryKeyword && contentWords.includes(primaryKeyword)) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1);
  }

  private generateRecommendations(type: FeaturedSnippetStructure['type']): string[] {
    const recommendations = {
      paragraph: [
        'Beginne mit einer direkten Antwort auf die Frage',
        'Halte die Antwort zwischen 40-60 Wörtern',
        'Verwende die exakte Fragenformulierung im Text',
        'Strukturiere den Text logisch und klar',
        'Füge relevante Keywords natürlich ein'
      ],
      list: [
        'Verwende nummerierte Listen für Schritt-für-Schritt Anleitungen',
        'Bullet Points für Aufzählungen und Eigenschaften',
        'Halte Listenpunkte prägnant (5-15 Wörter)',
        'Verwende action-orientierte Sprache',
        'Strukturiere hierarchisch vom Wichtigsten zum Detail'
      ],
      table: [
        'Verwende klare, beschreibende Spaltenüberschriften',
        'Halte Tabellen kompakt (max. 6 Spalten, 8 Zeilen)',
        'Nutze vergleichbare Datentypen',
        'Platziere wichtigste Information in erste Spalte',
        'Verwende HTML-Tabellen-Markup korrekt'
      ],
      video: [
        'Erstelle aussagekräftige Videotitel mit Keywords',
        'Verwende Timestamps für wichtige Abschnitte',
        'Optimiere Thumbnail und Beschreibung',
        'Strukturiere Videos logisch mit klaren Abschnitten',
        'Füge Untertitel und Transkripte hinzu'
      ]
    };

    return recommendations[type] || [];
  }

  private fallbackSnippetOptimization(
    query: string,
    content: string,
    type: FeaturedSnippetStructure['type']
  ): string {
    const sentences = content.split('.').filter(s => s.trim().length > 10);
    
    switch (type) {
      case 'paragraph':
        // Return first 1-2 sentences that contain query keywords
        const relevantSentences = sentences.filter(sentence => 
          query.toLowerCase().split(' ').some(word => sentence.toLowerCase().includes(word))
        );
        return relevantSentences.slice(0, 2).join('. ').trim() + '.';
        
      case 'list':
        // Convert sentences to list format
        return sentences.slice(0, 5).map((sentence, index) => 
          `${index + 1}. ${sentence.trim()}`
        ).join('\n');
        
      case 'table':
        return `<table>
          <tr><th>Aspekt</th><th>Details</th></tr>
          <tr><td>Information</td><td>${sentences[0]?.trim() || 'Details verfügbar'}</td></tr>
        </table>`;
        
      case 'video':
        return JSON.stringify({
          title: `${query} - Erklärt`,
          description: sentences[0]?.substring(0, 120) || query,
          timestamps: ['0:00 Einführung', '1:00 Hauptteil', '3:00 Fazit']
        });
        
      default:
        return content;
    }
  }

  async generatePeopleAlsoAsk(baseQuery: string, content: string): Promise<PeopleAlsoAskQuestion[]> {
    try {
      const prompt = `
        Basierend auf der Suchanfrage "${baseQuery}" und diesem Content:
        
        ${content.substring(0, 500)}...
        
        Erstelle 5-8 "People Also Ask" Fragen mit Antworten im JSON Format:
        
        {
          "questions": [
            {
              "question": "Wie funktioniert...",
              "answer": "Kurze, präzise Antwort (50-80 Wörter)",
              "relatedQuestions": ["Ähnliche Frage 1", "Ähnliche Frage 2"]
            }
          ]
        }
        
        Fragen sollten:
        - Natürlich und häufig gestellt sein
        - Verschiedene Aspekte des Themas abdecken
        - Mit "Wie", "Was", "Warum", "Wann", "Wo" beginnen
        - Relevant für Solarenergie/Photovoltaik sein
      `;

      const response = await optimizeKeywords(prompt);
      
      if (typeof response === 'object' && response.questions) {
        return response.questions;
      }
      
      // Fallback questions
      return this.generateFallbackPAA(baseQuery);
      
    } catch (error) {
      console.error('PAA generation failed:', error);
      return this.generateFallbackPAA(baseQuery);
    }
  }

  private generateFallbackPAA(baseQuery: string): PeopleAlsoAskQuestion[] {
    const templates = [
      `Wie funktioniert ${baseQuery}?`,
      `Was kostet ${baseQuery}?`,
      `Warum ist ${baseQuery} wichtig?`,
      `Wann lohnt sich ${baseQuery}?`,
      `Wo kann man ${baseQuery} kaufen?`,
      `Welche Vorteile hat ${baseQuery}?`,
      `Welche Nachteile hat ${baseQuery}?`,
      `Wie lange dauert ${baseQuery}?`
    ];

    return templates.slice(0, 5).map(question => ({
      question,
      answer: `Eine detaillierte Antwort zu "${question}" finden Sie in unserem umfassenden Ratgeber. Kontaktieren Sie uns für eine persönliche Beratung.`,
      relatedQuestions: templates.filter(t => t !== question).slice(0, 2)
    }));
  }

  async optimizeForVoiceSearch(query: string, content: string): Promise<{
    conversationalQueries: string[];
    optimizedAnswer: string;
    questionFormats: string[];
  }> {
    try {
      const prompt = `
        Optimiere für Voice Search basierend auf: "${query}"
        
        Content: ${content.substring(0, 300)}
        
        Erstelle:
        1. 5-7 natürliche, gesprochene Variationen der Suchanfrage
        2. Eine konversationelle Antwort (20-30 Wörter)
        3. Verschiedene Frageformate (komplett, verkürzt, umgangssprachlich)
        
        Format als JSON:
        {
          "conversationalQueries": ["Wie kann ich...", "Was ist der beste Weg..."],
          "optimizedAnswer": "Direkte, natürliche Antwort",
          "questionFormats": ["Formelle Frage", "Umgangssprachliche Variante"]
        }
      `;

      const response = await optimizeKeywords(prompt);
      
      if (typeof response === 'object') {
        return {
          conversationalQueries: response.conversationalQueries || [],
          optimizedAnswer: response.optimizedAnswer || content.substring(0, 100),
          questionFormats: response.questionFormats || []
        };
      }
      
      return this.generateFallbackVoiceOptimization(query, content);
      
    } catch (error) {
      console.error('Voice search optimization failed:', error);
      return this.generateFallbackVoiceOptimization(query, content);
    }
  }

  private generateFallbackVoiceOptimization(query: string, content: string): {
    conversationalQueries: string[];
    optimizedAnswer: string;
    questionFormats: string[];
  } {
    const conversationalQueries = [
      `Wie kann ich ${query}?`,
      `Was ist ${query}?`,
      `Erkläre mir ${query}`,
      `Wie funktioniert ${query}?`,
      `Was kostet ${query}?`
    ];

    const firstSentence = content.split('.')[0]?.trim() || '';
    const optimizedAnswer = firstSentence.length > 100 ? 
      firstSentence.substring(0, 100) + '...' : 
      firstSentence;

    return {
      conversationalQueries,
      optimizedAnswer,
      questionFormats: conversationalQueries
    };
  }

  generateStructuredData(
    query: string,
    content: string,
    type: 'faq' | 'howto' | 'article'
  ): object {
    const baseStructure = {
      "@context": "https://schema.org",
      "@type": type === 'faq' ? 'FAQPage' : type === 'howto' ? 'HowTo' : 'Article',
    };

    switch (type) {
      case 'faq':
        return {
          ...baseStructure,
          "mainEntity": [{
            "@type": "Question",
            "name": query,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": content.substring(0, 200)
            }
          }]
        };

      case 'howto':
        return {
          ...baseStructure,
          "name": query,
          "description": content.substring(0, 200),
          "step": [
            {
              "@type": "HowToStep",
              "name": "Schritt 1",
              "text": content.split('.')[0] || ''
            }
          ]
        };

      case 'article':
        return {
          ...baseStructure,
          "headline": query,
          "description": content.substring(0, 200),
          "author": {
            "@type": "Organization",
            "name": "ZOE Solar"
          }
        };

      default:
        return baseStructure;
    }
  }

  getOptimizationReport(): {
    totalOptimizations: number;
    successRate: number;
    topPerformingTypes: string[];
    recommendations: string[];
  } {
    const totalOptimizations = this.snippetCache.size;
    
    if (totalOptimizations === 0) {
      return {
        totalOptimizations: 0,
        successRate: 0,
        topPerformingTypes: [],
        recommendations: ['Beginne mit der Optimierung für Featured Snippets']
      };
    }

    const optimizations = Array.from(this.snippetCache.values());
    const avgConfidence = optimizations.reduce((sum, opt) => 
      sum + opt.featuredSnippet.confidence, 0) / optimizations.length;
    
    const typePerformance = optimizations.reduce((acc, opt) => {
      const type = opt.featuredSnippet.structure;
      acc[type] = (acc[type] || 0) + opt.featuredSnippet.confidence;
      return acc;
    }, {} as Record<string, number>);

    const topPerformingTypes = Object.entries(typePerformance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const recommendations = [
      avgConfidence < 0.7 ? 'Verbessere Content-Qualität für höhere Snippet-Wahrscheinlichkeit' : '',
      'Fokussiere auf ' + topPerformingTypes[0] + ' Format für beste Ergebnisse',
      'Erweitere People Also Ask Optimierung',
      'Implementiere mehr Voice Search Optimierungen'
    ].filter(Boolean);

    return {
      totalOptimizations,
      successRate: avgConfidence,
      topPerformingTypes,
      recommendations
    };
  }
}

export const serpFeatureOptimizer = SerpFeatureOptimizer.getInstance();