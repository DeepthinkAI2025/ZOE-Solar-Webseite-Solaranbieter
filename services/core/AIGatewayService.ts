/**
 * 🎯 AI Gateway Service - Zentrale AI-Verwaltung für ZOE Solar
 *
 * Konsolidiert 18+ AI-Services in einer performanten, kosteneffizienten Einheit
 * Basiert auf OpenRouter API mit minimax:m2 Modell
 */

import { openRouterClient } from './OpenRouterClient';

// ===== TYPES & INTERFACES =====

interface ContentOptimizationRequest {
  url?: string;
  content: string;
  contentType: 'page' | 'article' | 'product' | 'faq' | 'documentation';
  optimizationGoals: string[];
  context?: Record<string, any>;
  targetKeywords?: string[];
}

interface ConversationalRequest {
  message: string;
  conversationHistory?: string[];
  context?: string;
  userId?: string;
}

interface LocalSEORequest {
  location: string;
  service: string;
  targetAudience?: string;
  businessType?: 'solar' | 'energy' | 'consulting';
}

interface ProductDescriptionRequest {
  product: string;
  features: string[];
  benefits: string[];
  targetIndustry?: string;
  technicalSpecs?: Record<string, any>;
}

interface SEOAnalysisRequest {
  url: string;
  content: string;
  targetKeywords: string[];
  competitorUrls?: string[];
  analysisType: 'basic' | 'comprehensive' | 'technical';
}

interface PersonalizationRequest {
  userProfile: {
    industry?: string;
    companySize?: string;
    location?: string;
    interests?: string[];
    previousInteractions?: string[];
  };
  content: string;
  personalizationGoals: string[];
}

interface BatchRequest {
  requests: Array<{
    type: 'seo' | 'local' | 'product' | 'conversation' | 'personalization';
    data: any;
    priority?: 'low' | 'medium' | 'high';
  }>;
}

// ===== AI GATEWAY SERVICE =====

class AIGatewayService {
  private static instance: AIGatewayService;
  private requestQueue: Map<string, Promise<any>>;
  private performanceMetrics: Map<string, number[]>;

  private constructor() {
    this.requestQueue = new Map();
    this.performanceMetrics = new Map();
  }

  static getInstance(): AIGatewayService {
    if (!AIGatewayService.instance) {
      AIGatewayService.instance = new AIGatewayService();
    }
    return AIGatewayService.instance;
  }

  // ===== CONTENT OPTIMIZATION =====

  /**
   * Konsolidiert: aiContentOptimizationService + aiFirstContentOptimizationService + dynamicContentOptimizationService
   */
  async optimizeContent(request: ContentOptimizationRequest): Promise<any> {
    const startTime = Date.now();
    const cacheKey = `content-opt-${request.contentType}-${request.content.slice(0, 50)}`;

    try {
      // SEO-Optimierung
      let optimizedContent = request.content;
      let appliedOptimizations: string[] = [];

      if (request.optimizationGoals.includes('seo')) {
        const seoResult = await openRouterClient.generateSEOContent(
          this.extractTopic(request.content),
          request.targetKeywords || [],
          request.contentType
        );

        if (seoResult.success) {
          optimizedContent = seoResult.content || optimizedContent;
          appliedOptimizations.push('SEO-Optimierung');
        }
      }

      // Local SEO
      if (request.optimizationGoals.includes('local') && request.context?.location) {
        const localResult = await openRouterClient.generateLocalSEOContent(
          request.context.location,
          this.extractService(request.content),
          request.targetAudience || 'Unternehmen'
        );

        if (localResult.success) {
          optimizedContent = this.mergeContent(optimizedContent, localResult.content || '');
          appliedOptimizations.push('Local SEO');
        }
      }

      // Performance Tracking
      this.recordPerformance('contentOptimization', Date.now() - startTime);

      return {
        success: true,
        optimizedContent,
        originalContent: request.content,
        appliedOptimizations,
        metrics: {
          wordCount: optimizedContent.split(' ').length,
          optimizationScore: this.calculateOptimizationScore(optimizedContent, request.targetKeywords || []),
          processingTime: Date.now() - startTime
        },
        usage: this.extractUsageFromCache(cacheKey),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== CONVERSATIONAL AI =====

  /**
   * Konsolidiert: conversationalAIService + aiPersonalizationService
   */
  async handleConversation(request: ConversationalRequest): Promise<any> {
    const startTime = Date.now();

    try {
      // Kontext basierend auf User-Profil erstellen
      let context = request.context || '';

      if (request.userId) {
        // User-Profil laden (Mock für jetzt)
        const userProfile = await this.getUserProfile(request.userId);
        context += this.buildPersonalizedContext(userProfile);
      }

      const response = await openRouterClient.generateConversationalResponse(
        request.message,
        request.conversationHistory || [],
        context
      );

      // Performance Tracking
      this.recordPerformance('conversation', Date.now() - startTime);

      return {
        success: true,
        response: response.content,
        personalizationLevel: request.userId ? 'personalized' : 'generic',
        suggestedFollowUpQuestions: this.generateFollowUpQuestions(request.message, response.content || ''),
        confidence: this.calculateConfidenceScore(response.content || ''),
        usage: response.usage,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== LOCAL SEO =====

  /**
   * Konsolidiert: gmbOptimizationService + localContentService + localSEOAnalyticsService
   */
  async generateLocalSEOContent(request: LocalSEORequest): Promise<any> {
    const startTime = Date.now();

    try {
      const response = await openRouterClient.generateLocalSEOContent(
        request.location,
        request.service,
        request.targetAudience || 'Unternehmen'
      );

      // Zusätzliche Local SEO Analysen
      const geoKeywords = this.generateGeoKeywords(request.location, request.service);
      const localEntities = this.extractLocalEntities(response.content || '');

      // Performance Tracking
      this.recordPerformance('localSEO', Date.now() - startTime);

      return {
        success: true,
        content: response.content,
        location: request.location,
        service: request.service,
        targetAudience: request.targetAudience,
        seoElements: {
          geoKeywords,
          localEntities,
          schemaMarkup: this.generateLocalSchema(request.location, request.service),
          metaTags: this.generateLocalMetaTags(request.location, request.service)
        },
        usage: response.usage,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== PRODUCT DESCRIPTIONS =====

  /**
   * Konsolidiert: productDescriptionServices + aiContentEnhancementService
   */
  async generateProductDescription(request: ProductDescriptionRequest): Promise<any> {
    const startTime = Date.now();

    try {
      const response = await openRouterClient.generateProductDescription(
        request.product,
        request.features,
        request.benefits,
        request.targetIndustry
      );

      // Zusätzliche Produkt-Optimierungen
      const uspAnalysis = this.analyzeUSPs(request.features, request.benefits);
      const targetAudienceAnalysis = this.analyzeTargetAudience(request.targetIndustry);
      const competitorComparison = this.generateCompetitorComparison(request.product);

      // Performance Tracking
      this.recordPerformance('productDescription', Date.now() - startTime);

      return {
        success: true,
        description: response.content,
        product: request.product,
        targetIndustry: request.targetIndustry,
        analytics: {
          uniqueSellingPoints: uspAnalysis,
          targetAudienceInsights: targetAudienceAnalysis,
          competitorPositioning: competitorComparison,
          readabilityScore: this.calculateReadabilityScore(response.content || ''),
          conversionPotential: this.estimateConversionPotential(response.content || '')
        },
        usage: response.usage,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== SEO ANALYSIS =====

  /**
   * Konsolidiert: seoAnalysisServices + competitorIntelligenceService
   */
  async analyzeSEO(request: SEOAnalysisRequest): Promise<any> {
    const startTime = Date.now();

    try {
      // Content Analyse mit AI
      const analysisPrompt = `Analysiere diese Webseite für SEO-Wirksamkeit: ${request.url}

      Content: ${request.content.slice(0, 1000)}
      Ziel-Keywords: ${request.targetKeywords.join(', ')}

      Gib Empfehlungen für:
      1. Content-Optimierung
      2. technische SEO
      3. Keyword-Verbesserungen
      4. Wettbewerbsvorteile`;

      const analysis = await openRouterClient.generateContent({
        prompt: analysisPrompt,
        systemPrompt: 'Du bist ein SEO-Experte. Analysiere Webseiten und gib konkrete, umsetzbare Empfehlungen.',
        temperature: 0.3,
        maxTokens: 2000
      });

      // Technische Analysen
      const technicalScore = this.calculateTechnicalScore(request.content);
      const keywordDensity = this.calculateKeywordDensity(request.content, request.targetKeywords);
      const readabilityScore = this.calculateReadabilityScore(request.content);

      // Performance Tracking
      this.recordPerformance('seoAnalysis', Date.now() - startTime);

      return {
        success: true,
        url: request.url,
        analysisType: request.analysisType,
        contentAnalysis: analysis.content,
        technicalSEO: {
          score: technicalScore,
          issues: this.identifyTechnicalIssues(request.content),
          recommendations: this.generateTechnicalRecommendations(technicalScore)
        },
        keywordAnalysis: {
          targetKeywords: request.targetKeywords,
          density: keywordDensity,
          suggestions: this.generateKeywordSuggestions(request.content, request.targetKeywords)
        },
        performance: {
          readabilityScore,
          wordCount: request.content.split(' ').length,
          estimatedReadTime: Math.ceil(request.content.split(' ').length / 200)
        },
        usage: analysis.usage,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== BATCH PROCESSING =====

  async processBatchRequests(request: BatchRequest): Promise<any> {
    const startTime = Date.now();
    const results: any[] = [];

    try {
      // Sortieren nach Priority
      const sortedRequests = request.requests.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
      });

      // Parallele Verarbeitung mit Rate Limiting
      const chunks = this.chunkArray(sortedRequests, 3); // Max 3 parallele Requests

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(async (req) => {
          switch (req.type) {
            case 'seo':
              return this.analyzeSEO(req.data);
            case 'local':
              return this.generateLocalSEOContent(req.data);
            case 'product':
              return this.generateProductDescription(req.data);
            case 'conversation':
              return this.handleConversation(req.data);
            case 'personalization':
              return this.generatePersonalizedContent(req.data);
            default:
              return { success: false, error: `Unknown request type: ${req.type}` };
          }
        });

        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
      }

      const processingTime = Date.now() - startTime;
      const successRate = results.filter(r => r.success).length / results.length;

      return {
        success: true,
        processedRequests: results.length,
        successRate,
        processingTime,
        results,
        usage: this.calculateTotalUsage(results),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== UTILITY METHODS =====

  private extractTopic(content: string): string {
    // Extrahiere das Hauptthema aus dem Content
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    return sentences[0]?.trim().slice(0, 50) || 'Solarlösungen';
  }

  private extractService(content: string): string {
    // Extrahiere den Service aus dem Content
    if (content.toLowerCase().includes('photovoltaik')) return 'Photovoltaikanlagen';
    if (content.toLowerCase().includes('speicher')) return 'Batteriespeicher';
    if (content.toLowerCase().includes('lade')) return 'Ladeinfrastruktur';
    return 'Solarlösungen';
  }

  private mergeContent(original: string, additional: string): string {
    // Intelligente Content-Verbindung
    const sentences = original.split('. ').filter(s => s.trim());
    const additionalSentences = additional.split('. ').filter(s => s.trim());
    return [...sentences.slice(0, -1), ...additionalSentences, sentences[sentences.length - 1]].join('. ');
  }

  private generateGeoKeywords(location: string, service: string): string[] {
    return [
      `${service} ${location}`,
      `Solar ${location}`,
      `Photovoltaik ${location}`,
      `Solaranlagen ${location}`,
      `Energieberatung ${location}`
    ];
  }

  private extractLocalEntities(content: string): string[] {
    const entities: string[] = [];
    const patterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // Orte und Firmen
      /\b\d{5}\s+[A-Z][a-z]+\b/g // PLZ + Ort
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) entities.push(...matches);
    });

    return [...new Set(entities)];
  }

  private generateLocalSchema(location: string, service: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ZOE Solar",
      "description": `Professionelle ${service} in ${location}`,
      "areaServed": location,
      "serviceType": service
    };
  }

  private generateLocalMetaTags(location: string, service: string): any {
    return {
      title: `${service} in ${location} | ZOE Solar`,
      description: `Professionelle ${service} für Unternehmen in ${location}. Jetzt beraten lassen!`,
      keywords: this.generateGeoKeywords(location, service).join(', ')
    };
  }

  private calculateOptimizationScore(content: string, keywords: string[]): number {
    let score = 50; // Basis-Score

    keywords.forEach(keyword => {
      const density = (content.toLowerCase().split(keyword.toLowerCase()).length - 1) / content.split(' ').length * 100;
      if (density >= 1 && density <= 3) score += 10;
    });

    return Math.min(score, 100);
  }

  private calculateTechnicalScore(content: string): number {
    let score = 50;

    // Check für verschiedene technische Elemente
    if (content.includes('<h1>') || content.match(/^#{1}\s+/m)) score += 10;
    if (content.includes('<h2>') || content.match(/^#{2}\s+/m)) score += 10;
    if (content.length > 300) score += 10;
    if (content.includes('alt=')) score += 10;
    if (content.includes('href=')) score += 10;

    return Math.min(score, 100);
  }

  private calculateKeywordDensity(content: string, keywords: string[]): Record<string, number> {
    const densities: Record<string, number> = {};
    const words = content.toLowerCase().split(/\s+/).length;

    keywords.forEach(keyword => {
      const occurrences = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      densities[keyword] = (occurrences / words) * 100;
    });

    return densities;
  }

  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim()).length;
    const words = content.split(/\s+/).length;
    const syllables = content.toLowerCase().match(/[aeiou]/g)?.length || 0;

    // Simplified Flesch Reading Ease
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private estimateConversionPotential(content: string): number {
    let potential = 30; // Basis-Potenzial

    const conversionWords = ['jetzt', 'kostenlos', 'beratung', 'kontakt', 'angebot', 'preise', 'anfragen'];
    conversionWords.forEach(word => {
      if (content.toLowerCase().includes(word)) potential += 10;
    });

    return Math.min(potential, 90);
  }

  private analyzeUSPs(features: string[], benefits: string[]): any {
    return {
      uniqueFeatures: features.slice(0, 3),
      keyBenefits: benefits.slice(0, 3),
      differentiators: features.filter(f => f.includes('einzigartig') || f.includes('speziell'))
    };
  }

  private analyzeTargetAudience(industry?: string): any {
    const industries: Record<string, any> = {
      'produktion': { focus: 'Kosteneinsparung', decisionMaker: 'GF, Betriebsleiter' },
      'handel': { focus: 'Unabhängigkeit', decisionMaker: 'Inhaber, Geschäftsführer' },
      'dienstleistung': { focus: 'Nachhaltigkeit', decisionMaker: 'GF, CSR-Manager' }
    };

    return industries[industry || 'all'] || { focus: 'Allgemein', decisionMaker: 'Unternehmensentscheider' };
  }

  private generateCompetitorComparison(product: string): string[] {
    return [
      `Bessere Performance als Standard-${product}`,
      `Langfristige Kostenersparnis vs. Konkurrenz`,
      `Premium-Service inklusive`
    ];
  }

  private identifyTechnicalIssues(content: string): string[] {
    const issues: string[] = [];

    if (content.length < 300) issues.push('Content zu kurz');
    if (!content.includes('<h1>') && !content.match(/^#{1}\s+/m)) issues.push('Fehlende H1-Überschrift');
    if (!content.match(/<h[2-6]>/) && !content.match(/^#{2,6}\s+/m)) issues.push('Keine Unterüberschriften');

    return issues;
  }

  private generateTechnicalRecommendations(score: number): string[] {
    const recommendations: string[] = [];

    if (score < 70) {
      recommendations.push('Content mit relevanten Keywords erweitern');
      recommendations.push('Technische SEO-Elemente integrieren');
    }
    if (score < 50) {
      recommendations.push('Content-Struktur überarbeiten');
      recommendations.push('Meta-Daten optimieren');
    }

    return recommendations;
  }

  private generateKeywordSuggestions(content: string, existingKeywords: string[]): string[] {
    const suggestions: string[] = [];
    const baseKeywords = ['Solar', 'Photovoltaik', 'Energie', 'Nachhaltigkeit'];

    baseKeywords.forEach(base => {
      if (!existingKeywords.some(k => k.toLowerCase().includes(base.toLowerCase()))) {
        suggestions.push(base);
      }
    });

    return suggestions.slice(0, 5);
  }

  private generateFollowUpQuestions(question: string, response: string): string[] {
    // Generiere relevante Folgefragen basierend auf der Konversation
    const suggestions: string[] = [];

    if (question.toLowerCase().includes('kosten')) {
      suggestions.push('Welche Fördermittel gibt es?', 'Was ist die Amortisationszeit?');
    }
    if (question.toLowerCase().includes('leistung')) {
      suggestions.push('Welche Größe wird benötigt?', 'Wie viel Strom kann erzeugt werden?');
    }

    return suggestions;
  }

  private calculateConfidenceScore(response: string): number {
    // Berechne die Konfidenz in die AI-Antwort
    if (response.length < 50) return 60;
    if (response.includes('Ich weiß nicht') || response.includes('kann ich nicht sagen')) return 40;
    return 85;
  }

  private async getUserProfile(userId: string): Promise<any> {
    // Mock-Implementierung - würde normalerweise aus DB laden
    return {
      industry: 'handel',
      companySize: 'klein',
      location: 'München',
      interests: ['Photovoltaik', 'Kosteneinsparung'],
      previousInteractions: []
    };
  }

  private buildPersonalizedContext(profile: any): string {
    return `
User-Profil:
- Branche: ${profile.industry}
- Unternehmensgröße: ${profile.companySize}
- Standort: ${profile.location}
- Interessen: ${profile.interests?.join(', ')}

Passe die Antwort entsprechend an.`;
  }

  private async generatePersonalizedContent(request: PersonalizationRequest): Promise<any> {
    const personalizedPrompt = `Personalisiere diesen Content für:

${JSON.stringify(request.userProfile, null, 2)}

Content: ${request.content}

Personalisierungsziele: ${request.personalizationGoals.join(', ')}`;

    const response = await openRouterClient.generateContent({
      prompt: personalizedPrompt,
      systemPrompt: 'Du bist ein Personalisierungs-Experte. Passe Content perfekt an User-Profile an.',
      temperature: 0.7
    });

    return {
      success: true,
      personalizedContent: response.content,
      personalizationLevel: 'high',
      userProfile: request.userProfile,
      usage: response.usage,
      timestamp: new Date().toISOString()
    };
  }

  private recordPerformance(operation: string, duration: number): void {
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, []);
    }

    const metrics = this.performanceMetrics.get(operation)!;
    metrics.push(duration);

    // Behalte nur die letzten 100 Messungen
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  private extractUsageFromCache(cacheKey: string): any {
    // Implementierung für Cache-Usage-Extraction
    return {
      tokens: 0,
      cost: 0
    };
  }

  private calculateTotalUsage(results: any[]): any {
    let totalTokens = 0;
    let totalCost = 0;

    results.forEach(result => {
      if (result.usage) {
        totalTokens += result.usage.totalTokens || 0;
        totalCost += result.usage.cost || 0;
      }
    });

    return { totalTokens, totalCost };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // ===== PUBLIC UTILITY METHODS =====

  getHealthStatus(): any {
    const avgResponseTimes: Record<string, number> = {};

    this.performanceMetrics.forEach((times, operation) => {
      const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
      avgResponseTimes[operation] = Math.round(avg);
    });

    return {
      status: 'healthy',
      performance: avgResponseTimes,
      cacheStatus: openRouterClient.getHealthStatus(),
      uptime: process.uptime()
    };
  }

  getUsageStatistics(): any {
    return {
      openRouter: openRouterClient.getUsageStats(),
      gateway: {
        totalRequests: Array.from(this.performanceMetrics.values()).reduce((sum, times) => sum + times.length, 0),
        averageResponseTime: this.calculateOverallAverageResponseTime(),
        cacheHitRate: 0 // Implementieren bei Bedarf
      }
    };
  }

  private calculateOverallAverageResponseTime(): number {
    const allTimes = Array.from(this.performanceMetrics.values()).flat();
    if (allTimes.length === 0) return 0;

    const sum = allTimes.reduce((total, time) => total + time, 0);
    return Math.round(sum / allTimes.length);
  }

  async testConnection(): Promise<boolean> {
    try {
      const testResponse = await openRouterClient.generateContent({
        prompt: 'Test',
        maxTokens: 5
      });

      return testResponse.success;
    } catch (error) {
      console.error('AI Gateway Connection Test failed:', error);
      return false;
    }
  }
}

// Export Singleton
export const aiGatewayService = AIGatewayService.getInstance();
export default aiGatewayService;