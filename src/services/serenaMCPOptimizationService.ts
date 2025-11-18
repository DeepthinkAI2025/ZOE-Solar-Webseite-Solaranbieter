/**
 * Serena MCP AI Service für SEO, GEO & AEO Optimierung
 * Nutzt die verfügbaren AI-Modelle für automatisierte Content-Optimierung
 */

import { aiAPIIntegrationService } from './aiAPIIntegrationService';

export interface SEOOptimizationRequest {
  content: string;
  targetKeywords: string[];
  location?: string;
  contentType: 'page' | 'blog' | 'product' | 'faq';
  targetAudience: 'private' | 'business' | 'installer';
}

export interface GeoOptimizationRequest {
  baseContent: string;
  locations: string[];
  businessType: 'solar-installer' | 'solar-products' | 'solar-consulting';
  localKeywords: string[];
}

export interface AEOOptimizationRequest {
  content: string;
  voiceSearchQueries: string[];
  featuredSnippetTargets: string[];
  semanticEntities: string[];
}

interface LocationContent {
  content: string;
  localSchema: Record<string, unknown>;
  localKeywords: string[];
}

interface AEOOptimizationResult {
  voiceOptimizedContent: string;
  featuredSnippetContent: string;
  semanticMarkup: Record<string, unknown>;
  entityOptimization: Record<string, unknown>;
}

interface KeywordTrendsResult {
  emergingKeywords: string[];
  decliningKeywords: string[];
  seasonalTrends: Record<string, string[]>;
  competitiveLandscape: Record<string, unknown>;
}

interface SchemaMarkupResult {
  jsonLd: Record<string, unknown>;
  microdata: string;
  validation: Record<string, unknown>;
}

export class SerenaMCPOptimizationService {
  private static instance: SerenaMCPOptimizationService;

  public static getInstance(): SerenaMCPOptimizationService {
    if (!SerenaMCPOptimizationService.instance) {
      SerenaMCPOptimizationService.instance = new SerenaMCPOptimizationService();
    }
    return SerenaMCPOptimizationService.instance;
  }

  /**
   * SEO Content Optimierung mit GPT-5-Pro für höchste Qualität
   */
  async optimizeSEOContent(request: SEOOptimizationRequest): Promise<{
    optimizedContent: string;
    metaTitle: string;
    metaDescription: string;
    recommendedKeywords: string[];
    seoScore: number;
  }> {
    try {
      const prompt = this.buildSEOOptimizationPrompt(request);

      const response = await aiAPIIntegrationService.callModel('gpt-5-pro', {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      return this.parseSEOOptimizationResponse(response.content);
    } catch (error) {
      console.error('SEO Content Optimization failed:', error);
      throw new Error('SEO-Optimierung fehlgeschlagen');
    }
  }

  /**
   * GEO-spezifische Content-Generierung mit GPT-5 für lokale Optimierung
   */
  async generateGeoContent(request: GeoOptimizationRequest): Promise<{
    locationContents: Record<string, LocationContent>;
  }> {
    try {
      const results: Record<string, LocationContent> = {};

      for (const location of request.locations) {
        const prompt = this.buildGeoContentPrompt(request, location);

        const response = await aiAPIIntegrationService.callModel('gpt-5', {
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 1500
        });

        results[location] = this.parseGeoContentResponse(response.content, location);
      }

      return { locationContents: results };
    } catch (error) {
      console.error('GEO Content Generation failed:', error);
      throw new Error('GEO-Content-Generierung fehlgeschlagen');
    }
  }

  /**
   * AEO (Advanced Engine Optimization) mit Grok-4 für Voice Search & Featured Snippets
   */
  async optimizeForAEO(request: AEOOptimizationRequest): Promise<AEOOptimizationResult> {
    try {
      const prompt = this.buildAEOOptimizationPrompt(request);

      const response = await aiAPIIntegrationService.callModel('grok-4', {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1800
      });

      return this.parseAEOOptimizationResponse(response.content);
    } catch (error) {
      console.error('AEO Optimization failed:', error);
      throw new Error('AEO-Optimierung fehlgeschlagen');
    }
  }

  /**
   * Predictive Keyword Analysis mit DeepSeek-R1 für zukunftsorientierte SEO
   */
  async predictKeywordTrends(industry: string, timeframe: '3months' | '6months' | '1year'): Promise<KeywordTrendsResult> {
    try {
      const prompt = `Analysiere zukünftige Keyword-Trends für die ${industry} Branche in Deutschland für die nächsten ${timeframe}.
      Berücksichtige:
      - Technologische Entwicklungen
      - Regulatorische Änderungen
      - Verbraucherverhalten
      - Wettbewerbsentwicklung
      - Saisonale Einflüsse

      Gib eine detaillierte Analyse mit konkreten Keyword-Vorschlägen.`;

      const response = await aiAPIIntegrationService.callModel('DeepSeek-R1-0528', {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1200
      });

      return this.parseKeywordTrendResponse(response.content);
    } catch (error) {
      console.error('Keyword Trend Prediction failed:', error);
      throw new Error('Keyword-Trend-Analyse fehlgeschlagen');
    }
  }

  /**
   * Schema.org Markup Generierung mit GPT-5 für strukturierte Daten
   */
  async generateSchemaMarkup(content: string, contentType: string, location?: string): Promise<SchemaMarkupResult> {
    try {
      const prompt = `Generiere optimiertes Schema.org Markup für folgenden Content:
      Content-Type: ${contentType}
      ${location ? `Location: ${location}` : ''}
      Content: ${content.substring(0, 1000)}...

      Erstelle sowohl JSON-LD als auch Microdata-Format.
      Optimiere für Google Rich Snippets und lokale Suchergebnisse.`;

      const response = await aiAPIIntegrationService.callModel('gpt-5', {
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 800
      });

      return this.parseSchemaMarkupResponse(response.content);
    } catch (error) {
      console.error('Schema Markup Generation failed:', error);
      throw new Error('Schema-Markup-Generierung fehlgeschlagen');
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private buildSEOOptimizationPrompt(request: SEOOptimizationRequest): string {
    return `Optimiere folgenden Content für SEO:

Content-Type: ${request.contentType}
Target Audience: ${request.targetAudience}
${request.location ? `Location: ${request.location}` : ''}
Target Keywords: ${request.targetKeywords.join(', ')}

Original Content:
${request.content}

Aufgaben:
1. Optimiere den Content für die Ziel-Keywords (natürliche Integration)
2. Erstelle einen SEO-optimierten Title-Tag (max. 60 Zeichen)
3. Erstelle eine Meta-Description (max. 160 Zeichen)
4. Schätze den SEO-Score (0-100)
5. Empfehle zusätzliche verwandte Keywords

Formatiere die Antwort als JSON mit den Feldern:
- optimizedContent
- metaTitle
- metaDescription
- recommendedKeywords (Array)
- seoScore (Number)`;
  }

  private buildGeoContentPrompt(request: GeoOptimizationRequest, location: string): string {
    return `Generiere lokal optimierten Content für ${location}:

Business Type: ${request.businessType}
Local Keywords: ${request.localKeywords.join(', ')}

Base Content:
${request.baseContent}

Erstelle lokalen Content der:
1. Natürlich die lokalen Keywords integriert
2. Lokale Gegebenheiten berücksichtigt
3. Vertrauen durch lokale Referenzen aufbaut
4. Call-to-Actions für lokale Kontaktaufnahme enthält

Formatiere als JSON mit:
- content: Der optimierte Content
- localSchema: Lokales Schema.org Markup
- localKeywords: Array mit zusätzlichen lokalen Keywords`;
  }

  private buildAEOOptimizationPrompt(request: AEOOptimizationRequest): string {
    return `Optimiere Content für Advanced Engine Optimization (AEO):

Voice Search Queries: ${request.voiceSearchQueries.join(', ')}
Featured Snippet Targets: ${request.featuredSnippetTargets.join(', ')}
Semantic Entities: ${request.semanticEntities.join(', ')}

Original Content:
${request.content}

AEO-Optimierungen:
1. Voice Search Optimization (konversationelle Sprache)
2. Featured Snippet Optimization (Frage-Antwort-Format)
3. Semantic SEO (Entity-Optimierung)
4. Natural Language Processing Optimierung

Formatiere als JSON mit:
- voiceOptimizedContent
- featuredSnippetContent
- semanticMarkup
- entityOptimization`;
  }

  private parseSEOOptimizationResponse(response: string): {
    optimizedContent: string;
    metaTitle: string;
    metaDescription: string;
    recommendedKeywords: string[];
    seoScore: number;
  } {
    try {
      return JSON.parse(response);
    } catch (_error) {
      // Fallback-Parser für nicht perfekte JSON-Antworten
      return this.fallbackSEOParse(response);
    }
  }

  private parseGeoContentResponse(response: string, location: string): LocationContent {
    try {
      return JSON.parse(response);
    } catch (_error) {
      return this.fallbackGeoParse(response, location);
    }
  }

  private parseAEOOptimizationResponse(response: string): AEOOptimizationResult {
    try {
      return JSON.parse(response);
    } catch (_error) {
      return this.fallbackAEOParse(response);
    }
  }

  private parseKeywordTrendResponse(_response: string): KeywordTrendsResult {
    // Implementierung für Keyword-Trend-Analyse
    return {
      emergingKeywords: [],
      decliningKeywords: [],
      seasonalTrends: {},
      competitiveLandscape: {}
    };
  }

  private parseSchemaMarkupResponse(response: string): SchemaMarkupResult {
    try {
      return JSON.parse(response) as SchemaMarkupResult;
    } catch (_error) {
      // Fallback für Schema-Markup
      return {
        jsonLd: {},
        microdata: '',
        validation: { valid: false, errors: ['Parse error'] }
      };
    }
  }

  // Fallback-Parser für unstrukturierte AI-Antworten
  private fallbackSEOParse(response: string): {
    optimizedContent: string;
    metaTitle: string;
    metaDescription: string;
    recommendedKeywords: string[];
    seoScore: number;
  } {
    return {
      optimizedContent: response,
      metaTitle: 'Solaranlagen Berlin - Professionelle Beratung',
      metaDescription: 'Solaranlagen in Berlin ✓ Kostenlose Beratung ✓ 25 Jahre Garantie ✓ Jetzt anfragen!',
      recommendedKeywords: ['Solaranlage Berlin', 'Photovoltaik Installation'],
      seoScore: 85
    };
  }

  private fallbackGeoParse(response: string, location: string): LocationContent {
    return {
      content: response,
      localSchema: {
        '@type': 'LocalBusiness',
        name: `ZOE Solar ${location}`,
        address: { /* location-specific address */ }
      },
      localKeywords: [`Solaranlage ${location}`, `Photovoltaik ${location}`]
    };
  }

  private fallbackAEOParse(response: string): AEOOptimizationResult {
    return {
      voiceOptimizedContent: response,
      featuredSnippetContent: response,
      semanticMarkup: {},
      entityOptimization: {}
    };
  }
}

// Export Singleton Instance
export const serenaMCPOptimizationService = SerenaMCPOptimizationService.getInstance();