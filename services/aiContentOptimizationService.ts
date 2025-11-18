/**
 * AI-First Content Optimization Service für ZOE Solar
 *
 * Zentraler Service für die Optimierung von Inhalten für AI-Suchsysteme und Large Language Models.
 * Implementiert fortgeschrittene Content-Strukturierung für maximale AI-Sichtbarkeit.
 */

const optimizeKeywords = (...args: Parameters<ReturnType<typeof getAIGatewayService>["optimizeContent"]>) => {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent(...args);
};

// ===== INTERFACES & TYPES =====

export interface AIContentOptimizationConfig {
  enabled: boolean;
  llmFriendly: boolean;
  conversationalOptimization: boolean;
  featuredSnippetTargeting: boolean;
  voiceSearchOptimization: boolean;
  aiReadableFAQ: boolean;
  semanticClustering: boolean;
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    batchSize: number;
  };
}

export interface ContentOptimizationRequest {
  content: string;
  contentType: 'page' | 'article' | 'faq' | 'product' | 'service';
  targetAudience: 'human' | 'ai' | 'both';
  optimizationGoals: string[];
  keywords: string[];
  context?: {
    pageUrl?: string;
    relatedTopics?: string[];
    userIntent?: string;
    searchQuery?: string;
  };
}

export interface OptimizedContent {
  originalContent: string;
  optimizedContent: string;
  llmStructuredContent: LLMStructuredContent;
  conversationalElements: ConversationalElement[];
  featuredSnippets: FeaturedSnippet[];
  voiceSearchPhrases: VoiceSearchPhrase[];
  aiReadableFAQ: AIReadableFAQ[];
  semanticClusters: SemanticCluster[];
  metadata: ContentMetadata;
  performance: ContentPerformance;
}

export interface LLMStructuredContent {
  title: string;
  summary: string;
  keyPoints: string[];
  entities: ContentEntity[];
  relationships: ContentRelationship[];
  structuredData: object;
  readabilityScore: number;
  aiReadabilityScore: number;
}

export interface ContentEntity {
  name: string;
  type: 'person' | 'organization' | 'product' | 'service' | 'location' | 'concept';
  confidence: number;
  context: string;
  relatedEntities: string[];
}

export interface ContentRelationship {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export interface ConversationalElement {
  question: string;
  answer: string;
  intent: string;
  confidence: number;
  context: string;
}

export interface FeaturedSnippet {
  query: string;
  answer: string;
  type: 'paragraph' | 'list' | 'table' | 'definition';
  position: number;
  confidence: number;
}

export interface VoiceSearchPhrase {
  phrase: string;
  intent: string;
  context: string;
  popularity: number;
  difficulty: number;
}

export interface AIReadableFAQ {
  question: string;
  answer: string;
  category: string;
  entities: string[];
  intent: string;
  confidence: number;
  aiOptimized: boolean;
}

export interface SemanticCluster {
  topic: string;
  keywords: string[];
  relatedTopics: string[];
  content: string[];
  strength: number;
}

export interface ContentMetadata {
  wordCount: number;
  readingTime: number;
  seoScore: number;
  aiOptimizationScore: number;
  lastOptimized: Date;
  version: string;
}

export interface ContentPerformance {
  processingTime: number;
  optimizationEfficiency: number;
  cacheHit: boolean;
  errors: string[];
}

// ===== MAIN SERVICE CLASS =====

class AIContentOptimizationService {
  private static instance: AIContentOptimizationService;
  private config: AIContentOptimizationConfig;
  private cache: Map<string, OptimizedContent> = new Map();
  private optimizationHistory: Map<string, OptimizedContent[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): AIContentOptimizationService {
    if (!AIContentOptimizationService.instance) {
      AIContentOptimizationService.instance = new AIContentOptimizationService();
    }
    return AIContentOptimizationService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): AIContentOptimizationConfig {
    return {
      enabled: true,
      llmFriendly: true,
      conversationalOptimization: true,
      featuredSnippetTargeting: true,
      voiceSearchOptimization: true,
      aiReadableFAQ: true,
      semanticClustering: true,
      performance: {
        cacheEnabled: true,
        cacheTTL: 3600, // 1 hour
        batchSize: 10
      }
    };
  }

  public updateConfig(newConfig: Partial<AIContentOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): AIContentOptimizationConfig {
    return { ...this.config };
  }

  // ===== CONTENT OPTIMIZATION =====

  public async optimizeContent(request: ContentOptimizationRequest): Promise<OptimizedContent> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    if (this.config.performance.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHit: true,
          processingTime: Date.now() - startTime
        }
      };
    }

    try {
      // Perform comprehensive AI optimization
      const optimizedContent = await this.performOptimization(request);

      // Calculate performance metrics
      const processingTime = Date.now() - startTime;
      optimizedContent.performance = {
        processingTime,
        optimizationEfficiency: this.calculateOptimizationEfficiency(request.content, optimizedContent.optimizedContent),
        cacheHit: false,
        errors: []
      };

      // Cache result if enabled
      if (this.config.performance.cacheEnabled) {
        this.cache.set(cacheKey, optimizedContent);
        setTimeout(() => this.cache.delete(cacheKey), this.config.performance.cacheTTL * 1000);
      }

      // Store in history
      this.storeOptimizationHistory(request, optimizedContent);

      return optimizedContent;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown optimization error';
      return {
        originalContent: request.content,
        optimizedContent: request.content,
        llmStructuredContent: this.getEmptyLLMStructure(),
        conversationalElements: [],
        featuredSnippets: [],
        voiceSearchPhrases: [],
        aiReadableFAQ: [],
        semanticClusters: [],
        metadata: this.getEmptyMetadata(),
        performance: {
          processingTime: Date.now() - startTime,
          optimizationEfficiency: 0,
          cacheHit: false,
          errors: [errorMessage]
        }
      };
    }
  }

  private async performOptimization(request: ContentOptimizationRequest): Promise<OptimizedContent> {
    const { content, contentType, targetAudience, optimizationGoals, keywords, context } = request;

    // 1. LLM-Friendly Content Structuring
    const llmStructuredContent = await this.createLLMStructuredContent(content, contentType);

    // 2. Conversational Optimization
    const conversationalElements = this.config.conversationalOptimization
      ? await this.generateConversationalElements(content, keywords, context)
      : [];

    // 3. Featured Snippet Targeting
    const featuredSnippets = this.config.featuredSnippetTargeting
      ? await this.generateFeaturedSnippets(content, keywords)
      : [];

    // 4. Voice Search Optimization
    const voiceSearchPhrases = this.config.voiceSearchOptimization
      ? await this.generateVoiceSearchPhrases(content, keywords, context)
      : [];

    // 5. AI-Readable FAQ
    const aiReadableFAQ = this.config.aiReadableFAQ
      ? await this.generateAIReadableFAQ(content, contentType)
      : [];

    // 6. Semantic Clustering
    const semanticClusters = this.config.semanticClustering
      ? await this.createSemanticClusters(content, keywords, context?.relatedTopics)
      : [];

    // 7. Create optimized content
    const optimizedContent = this.assembleOptimizedContent(
      content,
      llmStructuredContent,
      conversationalElements,
      featuredSnippets,
      voiceSearchPhrases,
      aiReadableFAQ,
      semanticClusters,
      targetAudience
    );

    // 8. Generate metadata
    const metadata = this.generateContentMetadata(content, optimizedContent, contentType);

    return {
      originalContent: content,
      optimizedContent,
      llmStructuredContent,
      conversationalElements,
      featuredSnippets,
      voiceSearchPhrases,
      aiReadableFAQ,
      semanticClusters,
      metadata,
      performance: {} as ContentPerformance // Will be set by caller
    };
  }

  // ===== LLM-FRIENDLY CONTENT STRUCTURING =====

  private async createLLMStructuredContent(content: string, contentType: string): Promise<LLMStructuredContent> {
    // Extract title and summary
    const title = this.extractTitle(content, contentType);
    const summary = await this.generateSummary(content);

    // Extract key points
    const keyPoints = this.extractKeyPoints(content);

    // Entity recognition
    const entities = await this.performEntityRecognition(content);

    // Relationship mapping
    const relationships = this.mapRelationships(entities);

    // Generate structured data
    const structuredData = this.generateStructuredData(content, contentType, entities);

    // Calculate readability scores
    const readabilityScore = this.calculateReadabilityScore(content);
    const aiReadabilityScore = this.calculateAIReadabilityScore(content, entities, relationships);

    return {
      title,
      summary,
      keyPoints,
      entities,
      relationships,
      structuredData,
      readabilityScore,
      aiReadabilityScore
    };
  }

  private extractTitle(content: string, contentType: string): string {
    if (!content || typeof content !== 'string') {
      return 'Untitled Content';
    }

    // Try to find existing title
    const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^##\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) return titleMatch[1].trim();

    // Generate title based on content type and content
    const firstSentence = content.split('.')[0] || content.split(' ')[0] || 'Untitled';
    return firstSentence.length > 50 ? firstSentence.substring(0, 47) + '...' : firstSentence;
  }

  private async generateSummary(content: string): Promise<string> {
    if (!content || typeof content !== 'string') {
      return 'No content available';
    }

    // Use AI to generate concise summary
    const words = content.split(/\s+/).length;
    const targetLength = Math.min(words * 0.2, 100); // 20% of original or max 100 words

    try {
      // In a real implementation, this would call an AI service
      const summary = content.substring(0, 200) + '...';
      return summary;
    } catch (error) {
      // Fallback to simple extraction
      return (content.split('.')[0] || content.split(' ')[0] || 'No summary available') + '.';
    }
  }

  private extractKeyPoints(content: string): string[] {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const sentences = content.split(/[.!?]+/).filter(s => s && s.trim().length > 20);
    const keyPoints: string[] = [];

    // Extract sentences with important keywords
    const importantKeywords = ['wichtig', 'hauptsächlich', 'besonders', 'zunächst', 'außerdem', 'schließlich'];

    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (importantKeywords.some(keyword => lowerSentence.includes(keyword))) {
        keyPoints.push(sentence.trim());
      }
    });

    // If not enough key points found, take first few sentences
    if (keyPoints.length < 3) {
      keyPoints.push(...sentences.slice(0, 3 - keyPoints.length).map(s => s.trim()));
    }

    return keyPoints.slice(0, 5); // Max 5 key points
  }

  private async performEntityRecognition(content: string): Promise<ContentEntity[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const entities: ContentEntity[] = [];

    // Simple entity recognition (in real implementation, use NLP service)
    const organizationPattern = /\b(ZOE Solar|ZOE|Solar|Photovoltaik|PV)\b/gi;
    const locationPattern = /\b(Berlin|München|Hamburg|Köln|Stuttgart|Dresden|Leipzig|Hannover|Nürnberg|Bremen|Wien|Graz|Linz|Salzburg|Innsbruck|Zürich|Basel|Bern|Genf|Lausanne)\b/gi;
    const productPattern = /\b(Solarmodule|Wechselrichter|Speicher|Batterie|Ladestation|E-Mobilität)\b/gi;

    // Extract organizations
    const orgMatches = content.match(organizationPattern);
    if (orgMatches) {
      orgMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'organization',
            confidence: 0.9,
            context: 'Solar energy company',
            relatedEntities: ['Photovoltaik', 'Solar']
          });
        }
      });
    }

    // Extract locations
    const locationMatches = content.match(locationPattern);
    if (locationMatches) {
      locationMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'location',
            confidence: 0.8,
            context: 'Service region',
            relatedEntities: ['Deutschland', 'Österreich', 'Schweiz']
          });
        }
      });
    }

    // Extract products
    const productMatches = content.match(productPattern);
    if (productMatches) {
      productMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'product',
            confidence: 0.85,
            context: 'Solar technology product',
            relatedEntities: ['Photovoltaik', 'Energie']
          });
        }
      });
    }

    return entities;
  }

  private mapRelationships(entities: ContentEntity[]): ContentRelationship[] {
    const relationships: ContentRelationship[] = [];

    // Create relationships between entities
    entities.forEach(entity => {
      entity.relatedEntities.forEach(related => {
        const relatedEntity = entities.find(e => e.name === related);
        if (relatedEntity) {
          relationships.push({
            subject: entity.name,
            predicate: 'related_to',
            object: relatedEntity.name,
            confidence: Math.min(entity.confidence, relatedEntity.confidence)
          });
        }
      });
    });

    return relationships;
  }

  private generateStructuredData(content: string, contentType: string, entities: ContentEntity[]): object {
    if (!content || typeof content !== 'string') {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Default Page',
        description: 'Default description'
      };
    }

    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': contentType === 'article' ? 'Article' : 'WebPage',
      name: entities.find(e => e.type === 'organization')?.name || 'ZOE Solar',
      description: content.substring(0, 160),
      about: entities.map(e => ({ '@type': 'Thing', name: e.name }))
    };

    return baseSchema;
  }

  private calculateReadabilityScore(content: string): number {
    if (!content || typeof content !== 'string') {
      return 0;
    }

    // Simple readability calculation (Flesch Reading Ease)
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const syllables = this.countSyllables(content);

    if (sentences === 0 || words === 0) return 0;

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, score));
  }

  private calculateAIReadabilityScore(content: string, entities: ContentEntity[], relationships: ContentRelationship[]): number {
    if (!content || typeof content !== 'string') {
      return 0;
    }

    let score = 50; // Base score

    // Entity density bonus
    const entityDensity = entities.length / (content.split(/\s+/).length / 100);
    score += entityDensity * 10;

    // Relationship complexity bonus
    score += relationships.length * 5;

    // Structured content bonus
    if (content.includes('#') || content.includes('**')) score += 10;

    // Length appropriateness
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 300 && wordCount < 2000) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    if (!text || typeof text !== 'string') {
      return 0;
    }

    // Simple syllable counting (German approximation)
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;

    words.forEach(word => {
      // Count vowel groups
      const vowelGroups = word.match(/[aeiouäöü]+/g);
      syllables += vowelGroups ? vowelGroups.length : 1;
    });

    return syllables;
  }

  // ===== CONVERSATIONAL OPTIMIZATION =====

  private async generateConversationalElements(
    content: string,
    keywords: string[],
    context?: { userIntent?: string; searchQuery?: string }
  ): Promise<ConversationalElement[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const elements: ConversationalElement[] = [];

    // Generate question-answer pairs based on content
    const sentences = content.split(/[.!?]+/).filter(s => s && s.trim().length > 20);

    sentences.forEach((sentence, index) => {
      // Create questions that this sentence might answer
      const questions = this.generateQuestionsForSentence(sentence, keywords, context);

      questions.forEach(question => {
        elements.push({
          question,
          answer: sentence.trim(),
          intent: context?.userIntent || 'informational',
          confidence: 0.7,
          context: `Generated from content section ${index + 1}`
        });
      });
    });

    return elements.slice(0, 10); // Limit to 10 elements
  }

  private generateQuestionsForSentence(sentence: string, keywords: string[], context?: { searchQuery?: string }): string[] {
    const questions: string[] = [];

    // Question patterns for German
    const patterns = [
      (keyword: string) => `Was ist ${keyword}?`,
      (keyword: string) => `Wie funktioniert ${keyword}?`,
      (keyword: string) => `Warum ${keyword}?`,
      (keyword: string) => `Wo finde ich ${keyword}?`,
      (keyword: string) => `Wann brauche ich ${keyword}?`
    ];

    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
        patterns.forEach(pattern => {
          questions.push(pattern(keyword));
        });
      }
    });

    // Add search query based questions
    if (context?.searchQuery) {
      questions.push(`Was bedeutet "${context.searchQuery}"?`);
      questions.push(`Wie kann ich "${context.searchQuery}" umsetzen?`);
    }

    return [...new Set(questions)]; // Remove duplicates
  }

  // ===== FEATURED SNIPPET TARGETING =====

  private async generateFeaturedSnippets(content: string, keywords: string[]): Promise<FeaturedSnippet[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const snippets: FeaturedSnippet[] = [];

    // Generate paragraph-style snippets
    keywords.forEach(keyword => {
      const sentences = content.split(/[.!?]+/).filter(s =>
        s && s.toLowerCase().includes(keyword.toLowerCase()) && s.trim().length > 50
      );

      sentences.slice(0, 2).forEach((sentence, index) => {
        snippets.push({
          query: `Was ist ${keyword}?`,
          answer: sentence.trim(),
          type: 'paragraph',
          position: index + 1,
          confidence: 0.8
        });
      });
    });

    // Generate list-style snippets
    const listPatterns = content.match(/[-*]\s+.+(\n[-*]\s+.+)+/g);
    if (listPatterns) {
      listPatterns.forEach((list, index) => {
        const listItems = list.split('\n').filter(item => item.trim());
        if (listItems.length >= 3) {
          snippets.push({
            query: keywords[0] ? `${keywords[0]} Liste` : 'Wichtige Punkte',
            answer: list,
            type: 'list',
            position: index + 1,
            confidence: 0.75
          });
        }
      });
    }

    return snippets.slice(0, 5);
  }

  // ===== VOICE SEARCH OPTIMIZATION =====

  private async generateVoiceSearchPhrases(
    content: string,
    keywords: string[],
    context?: { userIntent?: string }
  ): Promise<VoiceSearchPhrase[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const phrases: VoiceSearchPhrase[] = [];

    // Voice search patterns for German
    const voicePatterns = [
      'Was ist',
      'Wie funktioniert',
      'Wo finde ich',
      'Warum sollte ich',
      'Wie viel kostet',
      'Was sind die Vorteile von',
      'Wie installiere ich',
      'Wo kann ich kaufen'
    ];

    keywords.forEach(keyword => {
      voicePatterns.forEach(pattern => {
        const phrase = `${pattern} ${keyword}?`;
        phrases.push({
          phrase,
          intent: context?.userIntent || 'informational',
          context: 'Voice search optimization',
          popularity: Math.random() * 0.8 + 0.2, // Simulated popularity
          difficulty: Math.random() * 0.6 + 0.2 // Simulated difficulty
        });
      });
    });

    return phrases.slice(0, 15);
  }

  // ===== AI-READABLE FAQ =====

  private async generateAIReadableFAQ(content: string, contentType: string): Promise<AIReadableFAQ[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const faqs: AIReadableFAQ[] = [];

    // Extract potential FAQ content
    const sentences = content.split(/[.!?]+/).filter(s => s && s.trim().length > 30);

    sentences.forEach(sentence => {
      // Look for question patterns
      if (sentence.includes('?') || sentence.match(/\b(Frage|Antwort|FAQ)\b/i)) {
        const question = this.extractQuestion(sentence);
        const answer = sentence.trim();

        if (question) {
          faqs.push({
            question,
            answer,
            category: contentType,
            entities: this.extractEntitiesFromText(sentence),
            intent: 'informational',
            confidence: 0.7,
            aiOptimized: true
          });
        }
      }
    });

    return faqs.slice(0, 8);
  }

  private extractQuestion(text: string): string | null {
    if (!text || typeof text !== 'string') {
      return null;
    }

    // Try to extract or generate a question from the text
    if (text.includes('?')) {
      return text.split('?')[0] + '?';
    }

    // Generate question based on content
    const firstWords = text.split(' ').slice(0, 5).join(' ');
    return `Was ist ${firstWords.toLowerCase()}?`;
  }

  private extractEntitiesFromText(text: string): string[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const entities: string[] = [];
    const patterns = [
      /\b(ZOE Solar|Photovoltaik|Solar|PV)\b/gi,
      /\b(Berlin|München|Hamburg)\b/gi,
      /\b(Solarmodule|Wechselrichter|Speicher)\b/gi
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.push(...matches);
      }
    });

    return [...new Set(entities)];
  }

  // ===== SEMANTIC CLUSTERING =====

  private async createSemanticClusters(
    content: string,
    keywords: string[],
    relatedTopics?: string[]
  ): Promise<SemanticCluster[]> {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const clusters: SemanticCluster[] = [];

    // Group content by semantic topics
    const topics = [...keywords, ...(relatedTopics || [])];

    topics.forEach(topic => {
      const relatedContent = this.findRelatedContent(content, topic);
      const relatedKeywords = this.findRelatedKeywords(content, topic);

      if (relatedContent.length > 0) {
        clusters.push({
          topic,
          keywords: [topic, ...relatedKeywords],
          relatedTopics: topics.filter(t => t !== topic),
          content: relatedContent,
          strength: this.calculateTopicStrength(content, topic)
        });
      }
    });

    return clusters.slice(0, 5);
  }

  private findRelatedContent(content: string, topic: string): string[] {
    if (!content || typeof content !== 'string') {
      return [];
    }

    const sentences = content.split(/[.!?]+/);
    return sentences
      .filter(sentence => sentence.toLowerCase().includes(topic.toLowerCase()))
      .map(s => s.trim())
      .slice(0, 3);
  }

  private findRelatedKeywords(content: string, topic: string): string[] {
    if (!content || typeof content !== 'string') {
      return [];
    }

    // Simple keyword extraction around the topic
    const words = content.toLowerCase().split(/\s+/);
    const topicIndex = words.indexOf(topic.toLowerCase());

    if (topicIndex === -1) return [];

    const start = Math.max(0, topicIndex - 5);
    const end = Math.min(words.length, topicIndex + 5);
    const contextWords = words.slice(start, end);

    // Filter for relevant keywords
    return contextWords.filter(word =>
      word.length > 3 &&
      !['und', 'oder', 'aber', 'denn', 'weil', 'dass', 'wenn', 'dann'].includes(word)
    ).slice(0, 5);
  }

  private calculateTopicStrength(content: string, topic: string): number {
    if (!content || typeof content !== 'string') {
      return 0;
    }

    const occurrences = (content.toLowerCase().match(new RegExp(topic.toLowerCase(), 'g')) || []).length;
    const totalWords = content.split(/\s+/).length;
    return (occurrences * 100) / totalWords;
  }

  // ===== CONTENT ASSEMBLY =====

  private assembleOptimizedContent(
    originalContent: string,
    llmStructure: LLMStructuredContent,
    conversationalElements: ConversationalElement[],
    featuredSnippets: FeaturedSnippet[],
    voiceSearchPhrases: VoiceSearchPhrase[],
    aiReadableFAQ: AIReadableFAQ[],
    semanticClusters: SemanticCluster[],
    targetAudience: string
  ): string {
    let optimizedContent = originalContent;

    // Add LLM-friendly structure
    if (targetAudience === 'ai' || targetAudience === 'both') {
      optimizedContent = this.addLLMStructure(optimizedContent, llmStructure);
    }

    // Add conversational elements
    if (conversationalElements.length > 0) {
      optimizedContent += '\n\n## Häufige Fragen und Antworten\n\n';
      conversationalElements.slice(0, 5).forEach(element => {
        optimizedContent += `**${element.question}**\n${element.answer}\n\n`;
      });
    }

    // Add AI-readable FAQ section
    if (aiReadableFAQ.length > 0) {
      optimizedContent += '\n\n## AI-Optimierte FAQ\n\n';
      aiReadableFAQ.slice(0, 5).forEach(faq => {
        optimizedContent += `**${faq.question}**\n${faq.answer}\n\n`;
      });
    }

    return optimizedContent;
  }

  private addLLMStructure(content: string, llmStructure: LLMStructuredContent): string {
    let structuredContent = `# ${llmStructure.title}\n\n`;

    // Add summary
    structuredContent += `## Zusammenfassung\n${llmStructure.summary}\n\n`;

    // Add key points
    if (llmStructure.keyPoints.length > 0) {
      structuredContent += `## Wichtige Punkte\n`;
      llmStructure.keyPoints.forEach(point => {
        structuredContent += `- ${point}\n`;
      });
      structuredContent += '\n';
    }

    // Add entities section
    if (llmStructure.entities.length > 0) {
      structuredContent += `## Relevante Entitäten\n`;
      llmStructure.entities.forEach(entity => {
        structuredContent += `- **${entity.name}** (${entity.type}): ${entity.context}\n`;
      });
      structuredContent += '\n';
    }

    // Add original content
    structuredContent += `## Detaillierte Informationen\n${content}\n\n`;

    // Add readability info
    structuredContent += `## Inhaltsmetriken\n`;
    structuredContent += `- Lesbarkeit: ${llmStructure.readabilityScore.toFixed(1)}/100\n`;
    structuredContent += `- AI-Lesbarkeit: ${llmStructure.aiReadabilityScore.toFixed(1)}/100\n`;

    return structuredContent;
  }

  // ===== METADATA GENERATION =====

  private generateContentMetadata(
    originalContent: string,
    optimizedContent: string,
    contentType: string
  ): ContentMetadata {
    const wordCount = optimizedContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

    return {
      wordCount,
      readingTime,
      seoScore: this.calculateSEOOptimizationScore(optimizedContent),
      aiOptimizationScore: this.calculateAIOptimizationScore(optimizedContent),
      lastOptimized: new Date(),
      version: '1.0.0'
    };
  }

  private calculateSEOOptimizationScore(content: string): number {
    let score = 50; // Base score

    // Title optimization
    if (content.includes('# ')) score += 10;

    // Keyword density (simplified)
    const keywords = ['Photovoltaik', 'Solar', 'ZOE', 'Energie'];
    const keywordCount = keywords.reduce((count, keyword) =>
      count + (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length, 0
    );
    score += Math.min(keywordCount * 2, 20);

    // Structure bonus
    if (content.includes('## ')) score += 10;
    if (content.includes('- ')) score += 5;

    return Math.min(100, score);
  }

  private calculateAIOptimizationScore(content: string): number {
    let score = 50; // Base score

    // Structured content bonus
    if (content.includes('# ')) score += 15;
    if (content.includes('**')) score += 10;

    // Entity mentions
    const entities = ['ZOE Solar', 'Photovoltaik', 'Solar', 'Berlin', 'München'];
    const entityCount = entities.reduce((count, entity) =>
      count + (content.includes(entity) ? 1 : 0), 0
    );
    score += entityCount * 3;

    // FAQ section
    if (content.includes('FAQ') || content.includes('Fragen')) score += 10;

    return Math.min(100, score);
  }

  // ===== UTILITY METHODS =====

  private generateCacheKey(request: ContentOptimizationRequest): string {
    const contentHash = this.simpleHash(request.content);
    const configHash = this.simpleHash(JSON.stringify({
      contentType: request.contentType,
      targetAudience: request.targetAudience,
      optimizationGoals: request.optimizationGoals,
      keywords: request.keywords
    }));

    return `${contentHash}-${configHash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private calculateOptimizationEfficiency(original: string, optimized: string): number {
    const originalLength = original.length;
    const optimizedLength = optimized.length;
    const efficiency = (optimizedLength - originalLength) / originalLength * 100;
    return Math.max(0, Math.min(100, 50 + efficiency)); // Normalize to 0-100 range
  }

  private storeOptimizationHistory(request: ContentOptimizationRequest, result: OptimizedContent): void {
    const key = this.generateCacheKey(request);
    if (!this.optimizationHistory.has(key)) {
      this.optimizationHistory.set(key, []);
    }
    this.optimizationHistory.get(key)!.push(result);

    // Keep only last 5 optimizations per content
    if (this.optimizationHistory.get(key)!.length > 5) {
      this.optimizationHistory.get(key)!.shift();
    }
  }

  private getEmptyLLMStructure(): LLMStructuredContent {
    return {
      title: '',
      summary: '',
      keyPoints: [],
      entities: [],
      relationships: [],
      structuredData: {},
      readabilityScore: 0,
      aiReadabilityScore: 0
    };
  }

  private getEmptyMetadata(): ContentMetadata {
    return {
      wordCount: 0,
      readingTime: 0,
      seoScore: 0,
      aiOptimizationScore: 0,
      lastOptimized: new Date(),
      version: '1.0.0'
    };
  }

  // ===== PUBLIC API METHODS =====

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Would need to track hits/misses for real hit rate
    };
  }

  public getOptimizationHistory(contentKey: string): OptimizedContent[] {
    return this.optimizationHistory.get(contentKey) || [];
  }

  public validateOptimization(request: ContentOptimizationRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.content || request.content.trim().length === 0) {
      issues.push('Content cannot be empty');
    }

    if (!request.contentType) {
      issues.push('Content type is required');
    }

    if (!request.keywords || request.keywords.length === 0) {
      issues.push('At least one keyword is required');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// ===== EXPORT =====

export const aiContentOptimizationService = AIContentOptimizationService.getInstance();
export default aiContentOptimizationService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Basic content optimization
 * const result = await aiContentOptimizationService.optimizeContent({
 *   content: "ZOE Solar ist Ihr Photovoltaik-Experte in Berlin...",
 *   contentType: 'page',
 *   targetAudience: 'both',
 *   optimizationGoals: ['ai-visibility', 'conversational'],
 *   keywords: ['Photovoltaik', 'Solar', 'Berlin']
 * });
 *
 * // Get optimization history
 * const history = aiContentOptimizationService.getOptimizationHistory('content-key');
 *
 * // Update configuration
 * aiContentOptimizationService.updateConfig({ voiceSearchOptimization: false });
 */