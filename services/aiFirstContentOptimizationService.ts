/**
 * AI-First Content Optimization Service für ZOE Solar
 *
 * Zentraler Orchestrator für alle AI-First Content Optimization Funktionen.
 * Integriert LLM-Strukturierung, Conversational AI, Featured Snippets,
 * Voice Search und AI-readable FAQ-Systeme.
 */

import { aiContentOptimizationService } from './aiContentOptimizationService';
import { conversationalAIQueryOptimizationService } from './conversationalAIQueryOptimizationService';
import { aiReadableFAQService } from './aiReadableFAQService';
import { semanticClusteringService } from './semanticClusteringService';

// ===== INTERFACES & TYPES =====

export interface AIContentOptimizationRequest {
  content: string;
  contentType: 'page' | 'article' | 'product' | 'service' | 'faq';
  targetTopics: string[];
  targetAudience: 'human' | 'ai' | 'both';
  languages: string[];
  optimizationGoals: OptimizationGoal[];
  context?: {
    industry?: string;
    location?: string;
    userIntent?: string;
    complexity?: 'basic' | 'intermediate' | 'advanced';
    competitorAnalysis?: boolean;
    performanceMetrics?: boolean;
  };
}

export interface OptimizationGoal {
  type: 'llm_readability' | 'conversational' | 'featured_snippet' | 'voice_search' | 'faq_optimization' | 'semantic_clustering';
  priority: number;
  targetScore?: number;
  constraints?: Record<string, any>;
}

export interface AIContentOptimizationResult {
  originalContent: string;
  optimizedContent: string;
  optimizations: OptimizationResult[];
  performance: ContentOptimizationPerformance;
  metadata: ContentOptimizationMetadata;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationResult {
  type: string;
  success: boolean;
  score: number;
  improvements: string[];
  issues: string[];
  data: any;
  processingTime: number;
}

export interface ContentOptimizationPerformance {
  totalProcessingTime: number;
  individualProcessingTimes: Record<string, number>;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
  overallScore: number;
}

export interface ContentOptimizationMetadata {
  timestamp: Date;
  version: string;
  servicesUsed: string[];
  optimizationGoals: OptimizationGoal[];
  contentType: string;
  targetAudience: string;
  languages: string[];
  confidence: number;
}

export interface OptimizationRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  implementation: string[];
}

// ===== MAIN SERVICE CLASS =====

class AIFirstContentOptimizationService {
  private static instance: AIFirstContentOptimizationService;
  private config: AIContentOptimizationConfig;
  private optimizationCache: Map<string, AIContentOptimizationResult> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): AIFirstContentOptimizationService {
    if (!AIFirstContentOptimizationService.instance) {
      AIFirstContentOptimizationService.instance = new AIFirstContentOptimizationService();
    }
    return AIFirstContentOptimizationService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): AIContentOptimizationConfig {
    return {
      enabled: true,
      parallelProcessing: true,
      maxConcurrentOptimizations: 3,
      cacheEnabled: true,
      cacheTTL: 3600,
      performanceMonitoring: true,
      errorHandling: {
        retryAttempts: 3,
        fallbackEnabled: true,
        gracefulDegradation: true
      },
      qualityThresholds: {
        llmReadability: 0.8,
        conversational: 0.75,
        featuredSnippet: 0.85,
        voiceSearch: 0.8,
        faqOptimization: 0.7,
        semanticClustering: 0.75
      }
    };
  }

  public updateConfig(newConfig: Partial<AIContentOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): AIContentOptimizationConfig {
    return { ...this.config };
  }

  // ===== MAIN OPTIMIZATION METHOD =====

  public async optimizeContent(request: AIContentOptimizationRequest): Promise<AIContentOptimizationResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    if (this.config.cacheEnabled && this.optimizationCache.has(cacheKey)) {
      const cached = this.optimizationCache.get(cacheKey)!;
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHitRate: 1.0
        }
      };
    }

    try {
      const result = await this.performContentOptimization(request);

      // Calculate overall performance
      const totalProcessingTime = Date.now() - startTime;
      result.performance = {
        totalProcessingTime,
        individualProcessingTimes: this.extractProcessingTimes(result.optimizations),
        memoryUsage: this.estimateMemoryUsage(result),
        cacheHitRate: 0,
        errorRate: this.calculateErrorRate(result.optimizations),
        overallScore: this.calculateOverallScore(result.optimizations)
      };

      // Generate recommendations
      result.recommendations = this.generateOptimizationRecommendations(result);

      // Cache result if enabled
      if (this.config.cacheEnabled) {
        this.optimizationCache.set(cacheKey, result);
        setTimeout(() => this.optimizationCache.delete(cacheKey), this.config.cacheTTL * 1000);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown optimization error';
      return this.createErrorResult(request, errorMessage, startTime);
    }
  }

  private async performContentOptimization(request: AIContentOptimizationRequest): Promise<AIContentOptimizationResult> {
    const { content, contentType, targetTopics, targetAudience, languages, optimizationGoals, context } = request;

    // Sort goals by priority
    const sortedGoals = optimizationGoals.sort((a, b) => b.priority - a.priority);

    // Initialize results
    const optimizations: OptimizationResult[] = [];
    let optimizedContent = content;
    const servicesUsed: string[] = [];

    // Process optimizations based on goals
    for (const goal of sortedGoals) {
      try {
        const optimizationStart = Date.now();

        switch (goal.type) {
          case 'llm_readability':
            const llmResult = await this.optimizeForLLMReadability(optimizedContent, goal);
            optimizations.push({
              ...llmResult,
              processingTime: Date.now() - optimizationStart
            });
            optimizedContent = llmResult.data.optimizedContent || optimizedContent;
            servicesUsed.push('aiContentOptimizationService');
            break;

          case 'conversational':
            const convResult = await this.optimizeForConversationalAI(optimizedContent, goal, context);
            optimizations.push({
              ...convResult,
              processingTime: Date.now() - optimizationStart
            });
            optimizedContent = convResult.data.optimizedContent || optimizedContent;
            servicesUsed.push('conversationalAIQueryOptimizationService');
            break;

          case 'featured_snippet':
            const snippetResult = await this.optimizeForFeaturedSnippets(optimizedContent, goal);
            optimizations.push({
              ...snippetResult,
              processingTime: Date.now() - optimizationStart
            });
            optimizedContent = snippetResult.data.optimizedContent || optimizedContent;
            servicesUsed.push('conversationalAIQueryOptimizationService');
            break;

          case 'voice_search':
            const voiceResult = await this.optimizeForVoiceSearch(optimizedContent, goal);
            optimizations.push({
              ...voiceResult,
              processingTime: Date.now() - optimizationStart
            });
            optimizedContent = voiceResult.data.optimizedContent || optimizedContent;
            servicesUsed.push('conversationalAIQueryOptimizationService');
            break;

          case 'faq_optimization':
            const faqResult = await this.optimizeFAQs(optimizedContent, targetTopics, goal, context);
            optimizations.push({
              ...faqResult,
              processingTime: Date.now() - optimizationStart
            });
            optimizedContent = faqResult.data.optimizedContent || optimizedContent;
            servicesUsed.push('aiReadableFAQService');
            break;

          case 'semantic_clustering':
            const clusterResult = await this.performSemanticClustering(optimizedContent, targetTopics, goal);
            optimizations.push({
              ...clusterResult,
              processingTime: Date.now() - optimizationStart
            });
            // Semantic clustering doesn't modify content directly
            servicesUsed.push('semanticClusteringService');
            break;
        }

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Optimization failed';
        optimizations.push({
          type: goal.type,
          success: false,
          score: 0,
          improvements: [],
          issues: [errorMsg],
          data: null,
          processingTime: 0
        });
      }
    }

    // Generate metadata
    const metadata = this.generateOptimizationMetadata(
      request,
      servicesUsed,
      optimizations
    );

    return {
      originalContent: content,
      optimizedContent,
      optimizations,
      performance: {} as ContentOptimizationPerformance, // Will be set by caller
      metadata,
      recommendations: [] // Will be set by caller
    };
  }

  // ===== INDIVIDUAL OPTIMIZATION METHODS =====

  private async optimizeForLLMReadability(content: string, goal: OptimizationGoal): Promise<OptimizationResult> {
    try {
      const optimization = await aiContentOptimizationService.optimizeContent({
        content,
        contentType: 'llm_optimized',
        targetTopics: [],
        targetAudience: 'ai',
        languages: ['de'],
        context: goal.constraints
      });

      const score = this.calculateOptimizationScore(optimization, 'llm_readability');
      const success = score >= this.config.qualityThresholds.llmReadability;

      return {
        type: 'llm_readability',
        success,
        score,
        improvements: success ? ['LLM-Strukturierung angewendet', 'Entity-Erkennung verbessert'] : [],
        issues: success ? [] : ['LLM-Readability-Score unter Threshold'],
        data: optimization
      };

    } catch (error) {
      return {
        type: 'llm_readability',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'LLM optimization failed'],
        data: null
      };
    }
  }

  private async optimizeForConversationalAI(
    content: string,
    goal: OptimizationGoal,
    context?: AIContentOptimizationRequest['context']
  ): Promise<OptimizationResult> {
    try {
      const optimization = await conversationalAIQueryOptimizationService.optimizeForQueries({
        content,
        targetTopics: [],
        targetAudience: 'ai',
        context: context ? {
          industry: context.industry,
          location: context.location,
          userIntent: context.userIntent
        } : undefined
      });

      const score = this.calculateOptimizationScore(optimization, 'conversational');
      const success = score >= this.config.qualityThresholds.conversational;

      return {
        type: 'conversational',
        success,
        score,
        improvements: success ? ['Konversationelle Elemente hinzugefügt', 'Query-Optimierung angewendet'] : [],
        issues: success ? [] : ['Konversationelle Optimierung unter Threshold'],
        data: optimization
      };

    } catch (error) {
      return {
        type: 'conversational',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'Conversational optimization failed'],
        data: null
      };
    }
  }

  private async optimizeForFeaturedSnippets(content: string, goal: OptimizationGoal): Promise<OptimizationResult> {
    try {
      const optimization = await conversationalAIQueryOptimizationService.generateFeaturedSnippetOptimizations({
        content,
        targetTopics: [],
        context: goal.constraints
      });

      const score = this.calculateOptimizationScore(optimization, 'featured_snippet');
      const success = score >= this.config.qualityThresholds.featuredSnippet;

      return {
        type: 'featured_snippet',
        success,
        score,
        improvements: success ? ['Featured Snippet Optimierungen angewendet', 'Strukturierte Antworten erstellt'] : [],
        issues: success ? [] : ['Featured Snippet Score unter Threshold'],
        data: optimization
      };

    } catch (error) {
      return {
        type: 'featured_snippet',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'Featured snippet optimization failed'],
        data: null
      };
    }
  }

  private async optimizeForVoiceSearch(content: string, goal: OptimizationGoal): Promise<OptimizationResult> {
    try {
      const optimization = await conversationalAIQueryOptimizationService.generateVoiceSearchOptimizations({
        content,
        targetTopics: [],
        context: goal.constraints
      });

      const score = this.calculateOptimizationScore(optimization, 'voice_search');
      const success = score >= this.config.qualityThresholds.voiceSearch;

      return {
        type: 'voice_search',
        success,
        score,
        improvements: success ? ['Voice Search Optimierungen angewendet', 'Natürliche Sprache integriert'] : [],
        issues: success ? [] : ['Voice Search Score unter Threshold'],
        data: optimization
      };

    } catch (error) {
      return {
        type: 'voice_search',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'Voice search optimization failed'],
        data: null
      };
    }
  }

  private async optimizeFAQs(
    content: string,
    targetTopics: string[],
    goal: OptimizationGoal,
    context?: AIContentOptimizationRequest['context']
  ): Promise<OptimizationResult> {
    try {
      const optimization = await aiReadableFAQService.optimizeFAQs({
        content,
        contentType: 'page',
        targetTopics,
        targetAudience: 'both',
        languages: ['de'],
        context: context ? {
          industry: context.industry,
          location: context.location,
          userIntent: context.userIntent,
          complexity: context.complexity
        } : undefined
      });

      const score = this.calculateOptimizationScore(optimization, 'faq_optimization');
      const success = score >= this.config.qualityThresholds.faqOptimization;

      return {
        type: 'faq_optimization',
        success,
        score,
        improvements: success ? ['AI-readable FAQs generiert', 'Schema.org Markup hinzugefügt'] : [],
        issues: success ? [] : ['FAQ Optimierung unter Threshold'],
        data: optimization
      };

    } catch (error) {
      return {
        type: 'faq_optimization',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'FAQ optimization failed'],
        data: null
      };
    }
  }

  private async performSemanticClustering(
    content: string,
    targetTopics: string[],
    goal: OptimizationGoal
  ): Promise<OptimizationResult> {
    try {
      // Convert content to ContentItem format
      const contentItems = [{
        id: 'main_content',
        title: 'Main Content',
        content,
        type: 'page' as const,
        metadata: {
          topics: targetTopics
        }
      }];

      const clustering = await semanticClusteringService.performClustering({
        content: contentItems,
        targetTopics,
        clusteringCriteria: {
          similarityMetrics: ['semantic', 'keyword', 'entity'],
          weightSemantic: 0.5,
          weightKeyword: 0.3,
          weightEntity: 0.2,
          minSimilarityScore: 0.6,
          maxDistance: 1.0
        }
      });

      const score = this.calculateOptimizationScore(clustering, 'semantic_clustering');
      const success = score >= this.config.qualityThresholds.semanticClustering;

      return {
        type: 'semantic_clustering',
        success,
        score,
        improvements: success ? ['Semantische Cluster erstellt', 'Thematische Beziehungen identifiziert'] : [],
        issues: success ? [] : ['Semantische Cluster unter Threshold'],
        data: clustering
      };

    } catch (error) {
      return {
        type: 'semantic_clustering',
        success: false,
        score: 0,
        improvements: [],
        issues: [error instanceof Error ? error.message : 'Semantic clustering failed'],
        data: null
      };
    }
  }

  // ===== SCORING AND ANALYSIS =====

  private calculateOptimizationScore(result: any, type: string): number {
    switch (type) {
      case 'llm_readability':
        return result.aiReadabilityScore || result.confidence || 0.5;

      case 'conversational':
        return result.conversationalScore || result.confidence || 0.5;

      case 'featured_snippet':
        return result.featuredSnippetScore || result.confidence || 0.5;

      case 'voice_search':
        return result.voiceSearchScore || result.confidence || 0.5;

      case 'faq_optimization':
        return result.metadata?.optimizationScore || result.confidence || 0.5;

      case 'semantic_clustering':
        return result.metadata?.clusteringQuality || result.confidence || 0.5;

      default:
        return 0.5;
    }
  }

  private extractProcessingTimes(optimizations: OptimizationResult[]): Record<string, number> {
    const times: Record<string, number> = {};
    optimizations.forEach(opt => {
      times[opt.type] = opt.processingTime;
    });
    return times;
  }

  private calculateErrorRate(optimizations: OptimizationResult[]): number {
    const failed = optimizations.filter(opt => !opt.success).length;
    return optimizations.length > 0 ? failed / optimizations.length : 0;
  }

  private calculateOverallScore(optimizations: OptimizationResult[]): number {
    const scores = optimizations.map(opt => opt.score);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  }

  private estimateMemoryUsage(result: AIContentOptimizationResult): number {
    // Rough estimation in bytes
    const contentSize = result.originalContent.length + result.optimizedContent.length;
    const optimizationsSize = result.optimizations.length * 1000; // ~1KB per optimization
    const metadataSize = 2000; // ~2KB for metadata

    return contentSize + optimizationsSize + metadataSize;
  }

  private generateOptimizationRecommendations(result: AIContentOptimizationResult): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Analyze failed optimizations
    const failedOptimizations = result.optimizations.filter(opt => !opt.success);
    failedOptimizations.forEach(opt => {
      recommendations.push({
        type: opt.type,
        priority: 'high',
        description: `${opt.type} Optimierung ist fehlgeschlagen: ${opt.issues.join(', ')}`,
        impact: 0.8,
        effort: 'medium',
        implementation: [
          'Konfiguration überprüfen',
          'Service-Abhängigkeiten validieren',
          'Fehlerbehandlung verbessern'
        ]
      });
    });

    // Analyze low-scoring optimizations
    const lowScoring = result.optimizations.filter(opt => opt.success && opt.score < 0.7);
    lowScoring.forEach(opt => {
      recommendations.push({
        type: opt.type,
        priority: 'medium',
        description: `${opt.type} Score kann verbessert werden (aktuell: ${(opt.score * 100).toFixed(1)}%)`,
        impact: 0.6,
        effort: 'low',
        implementation: [
          'Threshold-Werte anpassen',
          'Zusätzliche Trainingsdaten hinzufügen',
          'Algorithmus-Parameter optimieren'
        ]
      });
    });

    // Performance recommendations
    if (result.performance.totalProcessingTime > 5000) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        description: 'Optimierung dauert länger als 5 Sekunden',
        impact: 0.4,
        effort: 'medium',
        implementation: [
          'Caching aktivieren',
          'Parallele Verarbeitung optimieren',
          'Batch-Größen reduzieren'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private generateOptimizationMetadata(
    request: AIContentOptimizationRequest,
    servicesUsed: string[],
    optimizations: OptimizationResult[]
  ): ContentOptimizationMetadata {
    const successfulOptimizations = optimizations.filter(opt => opt.success);
    const averageConfidence = successfulOptimizations.length > 0
      ? successfulOptimizations.reduce((sum, opt) => sum + opt.score, 0) / successfulOptimizations.length
      : 0;

    return {
      timestamp: new Date(),
      version: '1.0.0',
      servicesUsed,
      optimizationGoals: request.optimizationGoals,
      contentType: request.contentType,
      targetAudience: request.targetAudience,
      languages: request.languages,
      confidence: averageConfidence
    };
  }

  private generateCacheKey(request: AIContentOptimizationRequest): string {
    const contentHash = this.simpleHash(request.content);
    const goalsHash = this.simpleHash(JSON.stringify(request.optimizationGoals));
    const topicsHash = this.simpleHash(request.targetTopics.join(','));

    return `${contentHash}-${goalsHash}-${topicsHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private createErrorResult(
    request: AIContentOptimizationRequest,
    errorMessage: string,
    startTime: number
  ): AIContentOptimizationResult {
    return {
      originalContent: request.content,
      optimizedContent: request.content,
      optimizations: [],
      performance: {
        totalProcessingTime: Date.now() - startTime,
        individualProcessingTimes: {},
        memoryUsage: 0,
        cacheHitRate: 0,
        errorRate: 1,
        overallScore: 0
      },
      metadata: {
        timestamp: new Date(),
        version: '1.0.0',
        servicesUsed: [],
        optimizationGoals: request.optimizationGoals,
        contentType: request.contentType,
        targetAudience: request.targetAudience,
        languages: request.languages,
        confidence: 0
      },
      recommendations: [{
        type: 'error_recovery',
        priority: 'high',
        description: `Kritischer Fehler bei der Optimierung: ${errorMessage}`,
        impact: 1.0,
        effort: 'high',
        implementation: [
          'System-Logs überprüfen',
          'Service-Konfiguration validieren',
          'Fallback-Mechanismen implementieren'
        ]
      }]
    };
  }

  // ===== PUBLIC API METHODS =====

  public clearCache(): void {
    this.optimizationCache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.optimizationCache.size,
      hitRate: 0 // Would need to track hits/misses for real hit rate
    };
  }

  public getOptimizationHistory(): AIContentOptimizationResult[] {
    return Array.from(this.optimizationCache.values());
  }

  public validateOptimizationRequest(request: AIContentOptimizationRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.content || request.content.trim().length === 0) {
      issues.push('Content cannot be empty');
    }

    if (!request.contentType) {
      issues.push('Content type is required');
    }

    if (!request.optimizationGoals || request.optimizationGoals.length === 0) {
      issues.push('At least one optimization goal is required');
    }

    if (request.content.length > 100000) {
      issues.push('Content too large. Maximum allowed: 100,000 characters');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  public getSupportedOptimizationTypes(): string[] {
    return [
      'llm_readability',
      'conversational',
      'featured_snippet',
      'voice_search',
      'faq_optimization',
      'semantic_clustering'
    ];
  }

  public getQualityThresholds(): Record<string, number> {
    return { ...this.config.qualityThresholds };
  }

  public updateQualityThreshold(type: string, threshold: number): void {
    if (type in this.config.qualityThresholds) {
      (this.config.qualityThresholds as any)[type] = threshold;
    }
  }
}

// ===== CONFIGURATION INTERFACE =====

interface AIContentOptimizationConfig {
  enabled: boolean;
  parallelProcessing: boolean;
  maxConcurrentOptimizations: number;
  cacheEnabled: boolean;
  cacheTTL: number;
  performanceMonitoring: boolean;
  errorHandling: {
    retryAttempts: number;
    fallbackEnabled: boolean;
    gracefulDegradation: boolean;
  };
  qualityThresholds: {
    llmReadability: number;
    conversational: number;
    featuredSnippet: number;
    voiceSearch: number;
    faqOptimization: number;
    semanticClustering: number;
  };
}

// ===== EXPORT =====

export const aiFirstContentOptimizationService = AIFirstContentOptimizationService.getInstance();
export default aiFirstContentOptimizationService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Vollständige AI-First Content Optimization
 * const result = await aiFirstContentOptimizationService.optimizeContent({
 *   content: "ZOE Solar bietet Photovoltaik-Lösungen...",
 *   contentType: 'page',
 *   targetTopics: ['Photovoltaik', 'Kosten', 'Installation'],
 *   targetAudience: 'both',
 *   languages: ['de'],
 *   optimizationGoals: [
 *     { type: 'llm_readability', priority: 1 },
 *     { type: 'conversational', priority: 2 },
 *     { type: 'faq_optimization', priority: 3 }
 *   ],
 *   context: {
 *     industry: 'solar',
 *     complexity: 'intermediate'
 *   }
 * });
 *
 * // Einzelne Optimierung prüfen
 * const supportedTypes = aiFirstContentOptimizationService.getSupportedOptimizationTypes();
 *
 * // Qualitätsschwellen anpassen
 * aiFirstContentOptimizationService.updateQualityThreshold('llm_readability', 0.9);
 */