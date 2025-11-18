/**
 * AI-Readable FAQ & Q&A Service für ZOE Solar
 *
 * Erstellt strukturierte FAQ- und Q&A-Formate, die von AI-Systemen optimal
 * verarbeitet werden können. Implementiert Schema.org-kompatible Strukturen
 * und konversationelle Formate für maximale AI-Sichtbarkeit.
 */

import { aiContentOptimizationService } from './aiContentOptimizationService';

// ===== INTERFACES & TYPES =====

export interface AIReadableFAQConfig {
  enabled: boolean;
  schemaOrgOptimization: boolean;
  conversationalFormatting: boolean;
  semanticStructuring: boolean;
  multiLanguageSupport: boolean;
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    maxFAQsPerRequest: number;
  };
}

export interface FAQOptimizationRequest {
  content: string;
  contentType: 'page' | 'article' | 'product' | 'service';
  targetTopics: string[];
  targetAudience: 'human' | 'ai' | 'both';
  languages: string[];
  context?: {
    industry?: string;
    location?: string;
    userIntent?: string;
    complexity?: 'basic' | 'intermediate' | 'advanced';
  };
}

export interface AIReadableFAQResult {
  originalContent: string;
  optimizedContent: string;
  structuredFAQs: StructuredFAQ[];
  conversationalQA: ConversationalQA[];
  schemaOrgMarkup: object[];
  semanticClusters: FAQSemanticCluster[];
  performance: FAQPerformanceMetrics;
  metadata: FAQMetadata;
}

export interface StructuredFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
  tags: string[];
  entities: FAQEntity[];
  intent: string;
  confidence: number;
  aiReadability: number;
  humanReadability: number;
  schemaOrg: object;
  conversationalVariants: string[];
  relatedQuestions: string[];
  sourceContent: string;
  lastUpdated: Date;
}

export interface FAQEntity {
  name: string;
  type: 'organization' | 'product' | 'service' | 'location' | 'concept' | 'person';
  confidence: number;
  context: string;
  wikipediaLink?: string;
  sameAs?: string[];
}

export interface ConversationalQA {
  id: string;
  triggerPhrase: string;
  primaryQuestion: string;
  answer: string;
  followUpQuestions: string[];
  conversationFlow: ConversationStep[];
  intent: string;
  context: string;
  platformOptimization: {
    googleAssistant: boolean;
    alexa: boolean;
    siri: boolean;
    bing: boolean;
  };
  naturalLanguagePatterns: string[];
  voiceOptimization: {
    speakingTime: number; // seconds
    pausePoints: number[];
    emphasisWords: string[];
  };
}

export interface ConversationStep {
  step: number;
  userInput: string;
  aiResponse: string;
  expectedNextSteps: string[];
  confidence: number;
  fallbackResponse?: string;
}

export interface FAQSemanticCluster {
  topic: string;
  questions: string[];
  answers: string[];
  relatedTopics: string[];
  strength: number;
  coverage: number;
  optimizationSuggestions: string[];
}

export interface FAQPerformanceMetrics {
  processingTime: number;
  faqsGenerated: number;
  schemaValidations: number;
  cacheHitRate: number;
  errorRate: number;
  averageConfidence: number;
  aiReadabilityScore: number;
}

export interface FAQMetadata {
  timestamp: Date;
  version: string;
  totalFAQs: number;
  categories: string[];
  languages: string[];
  optimizationScore: number;
  schemaCompliance: number;
  semanticCoverage: number;
}

// ===== MAIN SERVICE CLASS =====

class AIReadableFAQService {
  private static instance: AIReadableFAQService;
  private config: AIReadableFAQConfig;
  private faqCache: Map<string, AIReadableFAQResult> = new Map();
  private entityKnowledgeBase: Map<string, FAQEntity> = new Map();
  private conversationPatterns: Map<string, ConversationStep[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeKnowledgeBase();
    this.initializeConversationPatterns();
  }

  public static getInstance(): AIReadableFAQService {
    if (!AIReadableFAQService.instance) {
      AIReadableFAQService.instance = new AIReadableFAQService();
    }
    return AIReadableFAQService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): AIReadableFAQConfig {
    return {
      enabled: true,
      schemaOrgOptimization: true,
      conversationalFormatting: true,
      semanticStructuring: true,
      multiLanguageSupport: true,
      performance: {
        cacheEnabled: true,
        cacheTTL: 3600, // 1 hour
        maxFAQsPerRequest: 50
      }
    };
  }

  public updateConfig(newConfig: Partial<AIReadableFAQConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): AIReadableFAQConfig {
    return { ...this.config };
  }

  // ===== FAQ OPTIMIZATION =====

  public async optimizeFAQs(request: FAQOptimizationRequest): Promise<AIReadableFAQResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    if (this.config.performance.cacheEnabled && this.faqCache.has(cacheKey)) {
      const cached = this.faqCache.get(cacheKey)!;
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHitRate: 1.0
        }
      };
    }

    try {
      const result = await this.performFAQOptimization(request);

      // Calculate performance metrics
      const processingTime = Date.now() - startTime;
      result.performance = {
        processingTime,
        faqsGenerated: result.structuredFAQs.length + result.conversationalQA.length,
        schemaValidations: result.schemaOrgMarkup.length,
        cacheHitRate: 0,
        errorRate: 0,
        averageConfidence: this.calculateAverageConfidence(result),
        aiReadabilityScore: this.calculateAIReadabilityScore(result)
      };

      // Cache result if enabled
      if (this.config.performance.cacheEnabled) {
        this.faqCache.set(cacheKey, result);
        setTimeout(() => this.faqCache.delete(cacheKey), this.config.performance.cacheTTL * 1000);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown FAQ optimization error';
      return this.createErrorResult(request, errorMessage, startTime);
    }
  }

  private async performFAQOptimization(request: FAQOptimizationRequest): Promise<AIReadableFAQResult> {
    const { content, contentType, targetTopics, targetAudience, languages, context } = request;

    // 1. Extract potential FAQ content
    const extractedQuestions = await this.extractQuestionsFromContent(content, targetTopics);

    // 2. Generate structured FAQs
    const structuredFAQs = this.config.schemaOrgOptimization
      ? await this.generateStructuredFAQs(extractedQuestions, content, contentType, context)
      : [];

    // 3. Create conversational Q&A
    const conversationalQA = this.config.conversationalFormatting
      ? await this.generateConversationalQA(structuredFAQs, context)
      : [];

    // 4. Generate Schema.org markup
    const schemaOrgMarkup = this.config.schemaOrgOptimization
      ? this.generateSchemaOrgMarkup(structuredFAQs, conversationalQA)
      : [];

    // 5. Create semantic clusters
    const semanticClusters = this.config.semanticStructuring
      ? this.createSemanticClusters(structuredFAQs, targetTopics)
      : [];

    // 6. Assemble optimized content
    const optimizedContent = this.assembleOptimizedContent(
      content,
      structuredFAQs,
      conversationalQA,
      targetAudience
    );

    // 7. Generate metadata
    const metadata = this.generateFAQMetadata(
      structuredFAQs,
      conversationalQA,
      languages,
      targetTopics
    );

    return {
      originalContent: content,
      optimizedContent,
      structuredFAQs,
      conversationalQA,
      schemaOrgMarkup,
      semanticClusters,
      performance: {} as FAQPerformanceMetrics, // Will be set by caller
      metadata
    };
  }

  // ===== QUESTION EXTRACTION =====

  private async extractQuestionsFromContent(content: string, targetTopics: string[]): Promise<string[]> {
    const questions: string[] = [];

    // Extract explicit questions
    const explicitQuestions = content.match(/[?]/g) ?
      content.split(/[.!?]+/).filter(sentence =>
        sentence.includes('?') && sentence.trim().length > 10
      ).map(s => s.trim() + '?') : [];

    questions.push(...explicitQuestions);

    // Generate implicit questions based on content structure
    const implicitQuestions = await this.generateImplicitQuestions(content, targetTopics);
    questions.push(...implicitQuestions);

    // Generate topic-specific questions
    const topicQuestions = this.generateTopicSpecificQuestions(targetTopics, content);
    questions.push(...topicQuestions);

    // Remove duplicates and limit
    return [...new Set(questions)].slice(0, this.config.performance.maxFAQsPerRequest);
  }

  private async generateImplicitQuestions(content: string, targetTopics: string[]): Promise<string[]> {
    const questions: string[] = [];

    // Look for informational patterns that could be questions
    const infoPatterns = [
      /\b(wichtig|wesentlich|entscheidend)\b.*(?:ist|sind)/gi,
      /\b(vorteil|vorteile)\b.*(?:bietet|bieten)/gi,
      /\b(kosten|preis)\b.*(?:beträgt|betragen)/gi,
      /\b(funktion|funktioniert)\b.*(?:wie)/gi
    ];

    infoPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const question = this.convertStatementToQuestion(match);
          if (question) questions.push(question);
        });
      }
    });

    // Generate questions for key topics
    targetTopics.forEach(topic => {
      questions.push(`Was ist ${topic}?`);
      questions.push(`Wie funktioniert ${topic}?`);
      questions.push(`Warum ${topic} wählen?`);
      questions.push(`Wo finde ich ${topic}?`);
    });

    return questions;
  }

  private generateTopicSpecificQuestions(targetTopics: string[], content: string): string[] {
    const questions: string[] = [];

    targetTopics.forEach(topic => {
      // Photovoltaik-specific questions
      if (topic.toLowerCase().includes('photovoltaik') || topic.toLowerCase().includes('pv')) {
        questions.push(`Wie funktioniert eine Photovoltaikanlage?`);
        questions.push(`Was kostet eine Photovoltaikanlage?`);
        questions.push(`Wie lange dauert die Installation einer PV-Anlage?`);
        questions.push(`Welche Förderungen gibt es für Photovoltaik?`);
        questions.push(`Wie hoch ist die Rendite einer Solaranlage?`);
      }

      // Speicher-specific questions
      if (topic.toLowerCase().includes('speicher') || topic.toLowerCase().includes('batterie')) {
        questions.push(`Warum brauche ich einen Stromspeicher?`);
        questions.push(`Wie lange hält ein Stromspeicher?`);
        questions.push(`Was kostet ein Stromspeicher?`);
        questions.push(`Wie funktioniert ein Stromspeicher?`);
      }

      // General business questions
      if (topic.toLowerCase().includes('unternehmen') || topic.toLowerCase().includes('firma')) {
        questions.push(`Seit wann gibt es ZOE Solar?`);
        questions.push(`Wo ist ZOE Solar ansässig?`);
        questions.push(`Wie viele Projekte hat ZOE Solar bereits realisiert?`);
        questions.push(`Warum ZOE Solar wählen?`);
      }
    });

    return questions;
  }

  private convertStatementToQuestion(statement: string): string | null {
    // Convert informational statements to questions
    const lowerStatement = statement.toLowerCase();

    if (lowerStatement.includes('kostet') || lowerStatement.includes('preis')) {
      return `Wie viel ${statement.toLowerCase().replace('kostet', 'kosten').replace('beträgt', 'betragen')}?`;
    }

    if (lowerStatement.includes('funktioniert')) {
      return `Wie ${statement.toLowerCase()}?`;
    }

    if (lowerStatement.includes('vorteil') || lowerStatement.includes('nutzen')) {
      return `Welche Vorteile ${statement.toLowerCase().replace('bietet', 'bieten')}?`;
    }

    return null;
  }

  // ===== STRUCTURED FAQ GENERATION =====

  private async generateStructuredFAQs(
    questions: string[],
    content: string,
    contentType: string,
    context?: FAQOptimizationRequest['context']
  ): Promise<StructuredFAQ[]> {
    const structuredFAQs: StructuredFAQ[] = [];

    for (const question of questions.slice(0, this.config.performance.maxFAQsPerRequest)) {
      const answer = await this.generateAnswerForQuestion(question, content);
      const category = this.categorizeQuestion(question, contentType);
      const tags = this.generateTagsForQuestion(question, content);
      const entities = await this.extractEntitiesFromQuestion(question, answer);
      const intent = this.analyzeQuestionIntent(question);
      const confidence = this.calculateFAQConfidence(question, answer, content);
      const aiReadability = this.calculateAIReadability(question, answer);
      const humanReadability = this.calculateHumanReadability(question, answer);
      const schemaOrg = this.generateFAQSchemaOrg(question, answer, category);
      const conversationalVariants = this.generateConversationalVariants(question);
      const relatedQuestions = this.findRelatedQuestions(question, questions);

      structuredFAQs.push({
        id: this.generateFAQId(question),
        question,
        answer,
        category,
        tags,
        entities,
        intent,
        confidence,
        aiReadability,
        humanReadability,
        schemaOrg,
        conversationalVariants,
        relatedQuestions,
        sourceContent: content.substring(0, 200),
        lastUpdated: new Date()
      });
    }

    return structuredFAQs;
  }

  private async generateAnswerForQuestion(question: string, content: string): Promise<string> {
    // Find relevant content for the question
    const relevantSentences = this.findRelevantSentencesForQuestion(question, content);

    if (relevantSentences.length === 0) {
      return 'Diese Information ist in unseren Unterlagen verfügbar. Kontaktieren Sie uns für detaillierte Auskünfte.';
    }

    // Combine relevant sentences into a coherent answer
    const answer = relevantSentences.slice(0, 3).join(' ').trim();

    // Ensure answer is complete and ends properly
    return answer.length > 500 ? answer.substring(0, 497) + '...' : answer;
  }

  private findRelevantSentencesForQuestion(question: string, content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const questionWords = question.toLowerCase().split(/\s+/).filter(word =>
      word.length > 2 && !['was', 'wie', 'wo', 'warum', 'wer', 'wann', 'ist', 'sind'].includes(word)
    );

    return sentences
      .filter(sentence => {
        const lowerSentence = sentence.toLowerCase();
        return questionWords.some(word => lowerSentence.includes(word));
      })
      .map(s => s.trim())
      .slice(0, 3);
  }

  private categorizeQuestion(question: string, contentType: string): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('kosten') || lowerQuestion.includes('preis')) {
      return 'Preise & Kosten';
    }

    if (lowerQuestion.includes('funktion') || lowerQuestion.includes('wie')) {
      return 'Technik & Funktion';
    }

    if (lowerQuestion.includes('installation') || lowerQuestion.includes('montage')) {
      return 'Installation & Service';
    }

    if (lowerQuestion.includes('förderung') || lowerQuestion.includes('zuschuss')) {
      return 'Förderungen & Finanzierung';
    }

    if (lowerQuestion.includes('unternehmen') || lowerQuestion.includes('firma')) {
      return 'Über uns';
    }

    // Default category based on content type
    switch (contentType) {
      case 'product': return 'Produkte';
      case 'service': return 'Services';
      case 'article': return 'Wissen';
      default: return 'Allgemein';
    }
  }

  private generateTagsForQuestion(question: string, content: string): string[] {
    const tags: string[] = [];
    const lowerQuestion = question.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Extract relevant tags
    if (lowerQuestion.includes('photovoltaik') || lowerContent.includes('photovoltaik')) {
      tags.push('Photovoltaik');
    }

    if (lowerQuestion.includes('speicher') || lowerContent.includes('speicher')) {
      tags.push('Stromspeicher');
    }

    if (lowerQuestion.includes('kosten') || lowerQuestion.includes('preis')) {
      tags.push('Kosten');
    }

    if (lowerQuestion.includes('installation')) {
      tags.push('Installation');
    }

    if (lowerQuestion.includes('förderung')) {
      tags.push('Förderung');
    }

    return [...new Set(tags)];
  }

  private async extractEntitiesFromQuestion(question: string, answer: string): Promise<FAQEntity[]> {
    const entities: FAQEntity[] = [];
    const combinedText = `${question} ${answer}`;

    // Check knowledge base for known entities
    for (const [entityName, entityData] of this.entityKnowledgeBase) {
      if (combinedText.toLowerCase().includes(entityName.toLowerCase())) {
        entities.push({ ...entityData });
      }
    }

    // Extract new entities
    const newEntities = this.extractNewEntities(combinedText);
    entities.push(...newEntities);

    return entities.slice(0, 5); // Limit to 5 entities
  }

  private extractNewEntities(text: string): FAQEntity[] {
    const entities: FAQEntity[] = [];

    // Simple entity extraction (would use NLP in production)
    const organizationPattern = /\b(ZOE Solar|ZOE|Solar GmbH)\b/gi;
    const locationPattern = /\b(Berlin|München|Hamburg|Köln|Stuttgart)\b/gi;
    const productPattern = /\b(Photovoltaik|PV-Anlage|Solaranlage|Wechselrichter|Stromspeicher)\b/gi;

    const orgMatches = text.match(organizationPattern);
    if (orgMatches) {
      orgMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'organization',
            confidence: 0.9,
            context: 'Solar energy company'
          });
        }
      });
    }

    const locationMatches = text.match(locationPattern);
    if (locationMatches) {
      locationMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'location',
            confidence: 0.8,
            context: 'Service location'
          });
        }
      });
    }

    const productMatches = text.match(productPattern);
    if (productMatches) {
      productMatches.forEach(match => {
        if (!entities.find(e => e.name === match)) {
          entities.push({
            name: match,
            type: 'product',
            confidence: 0.85,
            context: 'Solar technology product'
          });
        }
      });
    }

    return entities;
  }

  private analyzeQuestionIntent(question: string): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.startsWith('was') || lowerQuestion.includes('definition')) {
      return 'definition';
    }

    if (lowerQuestion.startsWith('wie') || lowerQuestion.includes('funktion')) {
      return 'instructional';
    }

    if (lowerQuestion.startsWith('warum') || lowerQuestion.includes('vorteil')) {
      return 'explanatory';
    }

    if (lowerQuestion.includes('kosten') || lowerQuestion.includes('preis')) {
      return 'commercial';
    }

    if (lowerQuestion.includes('wo') || lowerQuestion.includes('kontakt')) {
      return 'navigational';
    }

    return 'informational';
  }

  private calculateFAQConfidence(question: string, answer: string, content: string): number {
    let confidence = 0.5;

    // Answer quality
    if (answer.length > 50) confidence += 0.2;
    if (answer.length > 100) confidence += 0.1;

    // Question-content relevance
    const questionWords = question.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();
    const matches = questionWords.filter(word =>
      contentLower.includes(word) && word.length > 2
    ).length;
    confidence += (matches / questionWords.length) * 0.3;

    // Answer completeness
    if (answer.includes('?') || answer.includes('kontaktieren')) confidence -= 0.1;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  private calculateAIReadability(question: string, answer: string): number {
    let score = 50;

    // Structured question
    if (question.endsWith('?')) score += 10;

    // Clear answer structure
    if (answer.length < 300) score += 15;
    if (answer.split('.').length > 1) score += 10;

    // Entity mentions
    const entities = ['ZOE Solar', 'Photovoltaik', 'Solar'];
    const entityCount = entities.filter(entity => answer.includes(entity)).length;
    score += entityCount * 5;

    return Math.min(100, score);
  }

  private calculateHumanReadability(question: string, answer: string): number {
    // Simplified Flesch Reading Ease for German
    const words = answer.split(/\s+/).length;
    const sentences = answer.split(/[.!?]+/).length;
    const syllables = this.countSyllables(answer);

    if (sentences === 0 || words === 0) return 0;

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;

    words.forEach(word => {
      const vowelGroups = word.match(/[aeiouäöüy]+/g);
      syllables += vowelGroups ? vowelGroups.length : 1;
    });

    return syllables;
  }

  private generateFAQSchemaOrg(question: string, answer: string, category: string): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      },
      about: {
        '@type': 'Thing',
        name: category
      }
    };
  }

  private generateConversationalVariants(question: string): string[] {
    const variants: string[] = [question];

    // Generate natural language variants
    const baseQuestion = question.replace(/[?]/g, '').trim();

    variants.push(`Können Sie mir sagen: ${baseQuestion}?`);
    variants.push(`Ich würde gerne wissen: ${baseQuestion}`);
    variants.push(`Eine Frage: ${baseQuestion}?`);

    return variants;
  }

  private findRelatedQuestions(currentQuestion: string, allQuestions: string[]): string[] {
    const related: string[] = [];
    const currentWords = currentQuestion.toLowerCase().split(/\s+/);

    allQuestions.forEach(question => {
      if (question === currentQuestion) return;

      const questionWords = question.toLowerCase().split(/\s+/);
      const commonWords = currentWords.filter(word =>
        questionWords.includes(word) && word.length > 3
      );

      if (commonWords.length >= 2) {
        related.push(question);
      }
    });

    return related.slice(0, 3);
  }

  private generateFAQId(question: string): string {
    return `faq-${this.simpleHash(question)}`;
  }

  // ===== CONVERSATIONAL Q&A GENERATION =====

  private async generateConversationalQA(
    structuredFAQs: StructuredFAQ[],
    context?: FAQOptimizationRequest['context']
  ): Promise<ConversationalQA[]> {
    const conversationalQAs: ConversationalQA[] = [];

    for (const faq of structuredFAQs.slice(0, 10)) {
      const triggerPhrase = this.extractTriggerPhrase(faq.question);
      const conversationFlow = this.generateConversationFlow(faq, context);
      const platformOptimization = this.determinePlatformOptimization(faq.intent);
      const naturalLanguagePatterns = this.generateNaturalLanguagePatterns(faq.question);
      const voiceOptimization = this.optimizeForVoice(faq.answer);

      conversationalQAs.push({
        id: `conv-${faq.id}`,
        triggerPhrase,
        primaryQuestion: faq.question,
        answer: faq.answer,
        followUpQuestions: this.generateFollowUpQuestions(faq),
        conversationFlow,
        intent: faq.intent,
        context: context?.industry || 'solar energy',
        platformOptimization,
        naturalLanguagePatterns,
        voiceOptimization
      });
    }

    return conversationalQAs;
  }

  private extractTriggerPhrase(question: string): string {
    // Extract key trigger words
    const words = question.toLowerCase().split(/\s+/);
    const triggerWords = words.filter(word =>
      !['was', 'wie', 'wo', 'warum', 'wer', 'wann', 'ist', 'sind', 'hat', 'haben'].includes(word)
    );

    return triggerWords.slice(0, 3).join(' ');
  }

  private generateConversationFlow(faq: StructuredFAQ, context?: FAQOptimizationRequest['context']): ConversationStep[] {
    const flow: ConversationStep[] = [];

    // Initial response
    flow.push({
      step: 1,
      userInput: faq.question,
      aiResponse: faq.answer,
      expectedNextSteps: ['Ask for more details', 'Ask related question', 'End conversation'],
      confidence: faq.confidence
    });

    // Follow-up based on intent
    if (faq.intent === 'commercial') {
      flow.push({
        step: 2,
        userInput: 'Können Sie mir ein Angebot machen?',
        aiResponse: 'Gerne erstelle ich Ihnen ein individuelles Angebot. Welche Leistung benötigen Sie?',
        expectedNextSteps: ['Provide requirements', 'Ask for contact'],
        confidence: 0.8
      });
    } else if (faq.intent === 'instructional') {
      flow.push({
        step: 2,
        userInput: 'Können Sie das genauer erklären?',
        aiResponse: 'Natürlich! Lassen Sie mich das detaillierter erläutern...',
        expectedNextSteps: ['Continue explanation', 'Ask specific question'],
        confidence: 0.8
      });
    }

    return flow;
  }

  private determinePlatformOptimization(intent: string): ConversationalQA['platformOptimization'] {
    return {
      googleAssistant: true,
      alexa: intent === 'informational' || intent === 'instructional',
      siri: intent === 'navigational' || intent === 'commercial',
      bing: true
    };
  }

  private generateNaturalLanguagePatterns(question: string): string[] {
    const patterns: string[] = [];
    const baseQuestion = question.replace(/[?]/g, '').trim();

    patterns.push(`erzähl mir von ${baseQuestion}`);
    patterns.push(`ich möchte wissen ${baseQuestion}`);
    patterns.push(`sag mir bescheid über ${baseQuestion}`);

    return patterns;
  }

  private optimizeForVoice(answer: string): ConversationalQA['voiceOptimization'] {
    const words = answer.split(/\s+/);
    const speakingTime = Math.ceil(words.length / 150); // ~150 words per minute

    // Identify pause points (sentence endings)
    const pausePoints = [];
    let wordIndex = 0;
    answer.split(/[.!?]+/).forEach((sentence, index) => {
      if (index > 0) pausePoints.push(wordIndex);
      wordIndex += sentence.split(/\s+/).length;
    });

    // Identify emphasis words
    const emphasisWords = ['wichtig', 'besonders', 'zunächst', 'außerdem', 'schließlich', 'ZOE Solar'];

    return {
      speakingTime,
      pausePoints,
      emphasisWords: emphasisWords.filter(word => answer.toLowerCase().includes(word.toLowerCase()))
    };
  }

  private generateFollowUpQuestions(faq: StructuredFAQ): string[] {
    const questions: string[] = [];

    switch (faq.intent) {
      case 'commercial':
        questions.push('Wie hoch sind die Kosten?');
        questions.push('Gibt es Förderungen?');
        break;

      case 'instructional':
        questions.push('Wie funktioniert das genau?');
        questions.push('Gibt es eine Schritt-für-Schritt Anleitung?');
        break;

      case 'definition':
        questions.push('Können Sie ein Beispiel geben?');
        questions.push('Was sind die Vorteile?');
        break;

      default:
        questions.push('Können Sie das näher erläutern?');
        questions.push('Haben Sie Referenzen dazu?');
    }

    return questions;
  }

  // ===== SCHEMA.ORG MARKUP GENERATION =====

  private generateSchemaOrgMarkup(structuredFAQs: StructuredFAQ[], conversationalQAs: ConversationalQA[]): object[] {
    const schemas: object[] = [];

    // FAQ Schema
    if (structuredFAQs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: structuredFAQs.map(faq => faq.schemaOrg)
      });
    }

    // Q&A Schema
    if (conversationalQAs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: conversationalQAs.map(qa => ({
          '@type': 'Question',
          name: qa.primaryQuestion,
          acceptedAnswer: {
            '@type': 'Answer',
            text: qa.answer
          }
        }))
      });
    }

    return schemas;
  }

  // ===== SEMANTIC CLUSTERING =====

  private createSemanticClusters(structuredFAQs: StructuredFAQ[], targetTopics: string[]): FAQSemanticCluster[] {
    const clusters: FAQSemanticCluster[] = [];

    targetTopics.forEach(topic => {
      const relatedFAQs = structuredFAQs.filter(faq =>
        faq.question.toLowerCase().includes(topic.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      );

      if (relatedFAQs.length >= 2) {
        const questions = relatedFAQs.map(faq => faq.question);
        const answers = relatedFAQs.map(faq => faq.answer);
        const relatedTopics = this.findRelatedTopics(topic, structuredFAQs);
        const strength = relatedFAQs.reduce((sum, faq) => sum + faq.confidence, 0) / relatedFAQs.length;
        const coverage = relatedFAQs.length / structuredFAQs.length;
        const optimizationSuggestions = this.generateClusterOptimizationSuggestions(topic, relatedFAQs);

        clusters.push({
          topic,
          questions,
          answers,
          relatedTopics,
          strength,
          coverage,
          optimizationSuggestions
        });
      }
    });

    return clusters;
  }

  private findRelatedTopics(topic: string, faqs: StructuredFAQ[]): string[] {
    const relatedTopics: string[] = [];
    const topicWords = topic.toLowerCase().split(/\s+/);

    faqs.forEach(faq => {
      const faqWords = faq.question.toLowerCase().split(/\s+/);
      const commonWords = topicWords.filter(word => faqWords.includes(word));

      if (commonWords.length >= 1 && !relatedTopics.includes(faq.category)) {
        relatedTopics.push(faq.category);
      }
    });

    return relatedTopics.slice(0, 3);
  }

  private generateClusterOptimizationSuggestions(topic: string, faqs: StructuredFAQ[]): string[] {
    const suggestions: string[] = [];

    if (faqs.length < 5) {
      suggestions.push(`Fügen Sie mehr FAQs zum Thema "${topic}" hinzu`);
    }

    const avgConfidence = faqs.reduce((sum, faq) => sum + faq.confidence, 0) / faqs.length;
    if (avgConfidence < 0.7) {
      suggestions.push('Verbessern Sie die Antwortqualität für dieses Thema');
    }

    const categories = [...new Set(faqs.map(faq => faq.category))];
    if (categories.length > 1) {
      suggestions.push('Konsolidieren Sie FAQs in thematische Unterseiten');
    }

    return suggestions;
  }

  // ===== CONTENT ASSEMBLY =====

  private assembleOptimizedContent(
    originalContent: string,
    structuredFAQs: StructuredFAQ[],
    conversationalQAs: ConversationalQA[],
    targetAudience: string
  ): string {
    let optimizedContent = originalContent;

    // Add structured FAQ section
    if (structuredFAQs.length > 0) {
      optimizedContent += '\n\n## Häufig gestellte Fragen (FAQ)\n\n';
      structuredFAQs.slice(0, 10).forEach(faq => {
        optimizedContent += `### ${faq.question}\n${faq.answer}\n\n`;
      });
    }

    // Add conversational elements for AI audience
    if (targetAudience === 'ai' || targetAudience === 'both') {
      if (conversationalQAs.length > 0) {
        optimizedContent += '\n\n## Konversationelle Q&A\n\n';
        conversationalQAs.slice(0, 5).forEach(qa => {
          optimizedContent += `**Trigger:** ${qa.triggerPhrase}\n`;
          optimizedContent += `**Frage:** ${qa.primaryQuestion}\n`;
          optimizedContent += `**Antwort:** ${qa.answer}\n\n`;
        });
      }
    }

    return optimizedContent;
  }

  // ===== METADATA GENERATION =====

  private generateFAQMetadata(
    structuredFAQs: StructuredFAQ[],
    conversationalQAs: ConversationalQA[],
    languages: string[],
    targetTopics: string[]
  ): FAQMetadata {
    const categories = [...new Set(structuredFAQs.map(faq => faq.category))];
    const totalFAQs = structuredFAQs.length + conversationalQAs.length;

    const optimizationScore = this.calculateOptimizationScore(structuredFAQs, conversationalQAs);
    const schemaCompliance = this.calculateSchemaCompliance(structuredFAQs);
    const semanticCoverage = this.calculateSemanticCoverage(structuredFAQs, targetTopics);

    return {
      timestamp: new Date(),
      version: '1.0.0',
      totalFAQs,
      categories,
      languages,
      optimizationScore,
      schemaCompliance,
      semanticCoverage
    };
  }

  private calculateOptimizationScore(structuredFAQs: StructuredFAQ[], conversationalQAs: ConversationalQA[]): number {
    let score = 0;

    // FAQ quality (40%)
    const avgConfidence = structuredFAQs.reduce((sum, faq) => sum + faq.confidence, 0) / Math.max(1, structuredFAQs.length);
    score += avgConfidence * 40;

    // Conversational coverage (30%)
    const conversationalRatio = conversationalQAs.length / Math.max(1, structuredFAQs.length);
    score += Math.min(conversationalRatio * 30, 30);

    // AI readability (30%)
    const avgAIReadability = structuredFAQs.reduce((sum, faq) => sum + faq.aiReadability, 0) / Math.max(1, structuredFAQs.length);
    score += (avgAIReadability / 100) * 30;

    return Math.min(100, score);
  }

  private calculateSchemaCompliance(structuredFAQs: StructuredFAQ[]): number {
    // Simplified schema compliance check
    let compliant = 0;
    let total = 0;

    structuredFAQs.forEach(faq => {
      total++;
      if (faq.schemaOrg && typeof faq.schemaOrg === 'object' &&
          '@context' in faq.schemaOrg && '@type' in faq.schemaOrg) {
        compliant++;
      }
    });

    return total > 0 ? (compliant / total) * 100 : 0;
  }

  private calculateSemanticCoverage(structuredFAQs: StructuredFAQ[], targetTopics: string[]): number {
    let coveredTopics = 0;

    targetTopics.forEach(topic => {
      const hasCoverage = structuredFAQs.some(faq =>
        faq.question.toLowerCase().includes(topic.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      );

      if (hasCoverage) coveredTopics++;
    });

    return targetTopics.length > 0 ? (coveredTopics / targetTopics.length) * 100 : 0;
  }

  // ===== UTILITY METHODS =====

  private generateCacheKey(request: FAQOptimizationRequest): string {
    const contentHash = this.simpleHash(request.content);
    const topicsHash = this.simpleHash(request.targetTopics.join(','));
    const configHash = this.simpleHash(JSON.stringify({
      contentType: request.contentType,
      targetAudience: request.targetAudience,
      languages: request.languages
    }));

    return `${contentHash}-${topicsHash}-${configHash}`;
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

  private calculateAverageConfidence(result: AIReadableFAQResult): number {
    const confidences: number[] = [
      ...result.structuredFAQs.map(f => f.confidence),
      ...result.conversationalQA.map(c => c.conversationFlow[0]?.confidence || 0)
    ];

    return confidences.length > 0
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
      : 0;
  }

  private calculateAIReadabilityScore(result: AIReadableFAQResult): number {
    const scores = result.structuredFAQs.map(f => f.aiReadability);
    return scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;
  }

  private createErrorResult(
    request: FAQOptimizationRequest,
    errorMessage: string,
    startTime: number
  ): AIReadableFAQResult {
    return {
      originalContent: request.content,
      optimizedContent: request.content,
      structuredFAQs: [],
      conversationalQA: [],
      schemaOrgMarkup: [],
      semanticClusters: [],
      performance: {
        processingTime: Date.now() - startTime,
        faqsGenerated: 0,
        schemaValidations: 0,
        cacheHitRate: 0,
        errorRate: 1,
        averageConfidence: 0,
        aiReadabilityScore: 0
      },
      metadata: {
        timestamp: new Date(),
        version: '1.0.0',
        totalFAQs: 0,
        categories: [],
        languages: request.languages,
        optimizationScore: 0,
        schemaCompliance: 0,
        semanticCoverage: 0
      }
    };
  }

  private initializeKnowledgeBase(): void {
    // Initialize with known entities
    this.entityKnowledgeBase.set('ZOE Solar', {
      name: 'ZOE Solar',
      type: 'organization',
      confidence: 1.0,
      context: 'Photovoltaik-Spezialist für Gewerbe und Industrie',
      sameAs: ['https://www.zoe-solar.de']
    });

    this.entityKnowledgeBase.set('Photovoltaik', {
      name: 'Photovoltaik',
      type: 'concept',
      confidence: 0.95,
      context: 'Technologie zur Umwandlung von Sonnenlicht in elektrischen Strom',
      wikipediaLink: 'https://de.wikipedia.org/wiki/Photovoltaik'
    });

    this.entityKnowledgeBase.set('Berlin', {
      name: 'Berlin',
      type: 'location',
      confidence: 1.0,
      context: 'Hauptsitz von ZOE Solar',
      wikipediaLink: 'https://de.wikipedia.org/wiki/Berlin'
    });
  }

  private initializeConversationPatterns(): void {
    // Initialize common conversation patterns
    this.conversationPatterns.set('pricing', [
      {
        step: 1,
        userInput: 'Wie viel kostet das?',
        aiResponse: 'Die Kosten hängen von verschiedenen Faktoren ab. Lassen Sie mich Ihnen das erklären.',
        expectedNextSteps: ['Fragen nach Details'],
        confidence: 0.9
      }
    ]);
  }

  // ===== PUBLIC API METHODS =====

  public clearCache(): void {
    this.faqCache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.faqCache.size,
      hitRate: 0 // Would need to track hits/misses for real hit rate
    };
  }

  public getEntityKnowledgeBase(): FAQEntity[] {
    return Array.from(this.entityKnowledgeBase.values());
  }

  public addEntityToKnowledgeBase(entity: FAQEntity): void {
    this.entityKnowledgeBase.set(entity.name, entity);
  }

  public validateFAQRequest(request: FAQOptimizationRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.content || request.content.trim().length === 0) {
      issues.push('Content cannot be empty');
    }

    if (!request.targetTopics || request.targetTopics.length === 0) {
      issues.push('At least one target topic is required');
    }

    if (!request.contentType) {
      issues.push('Content type is required');
    }

    if (request.targetTopics.length > 10) {
      issues.push('Too many target topics. Maximum allowed: 10');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// ===== EXPORT =====

export const aiReadableFAQService = AIReadableFAQService.getInstance();
export default aiReadableFAQService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Optimize content for AI-readable FAQs
 * const result = await aiReadableFAQService.optimizeFAQs({
 *   content: "ZOE Solar bietet Photovoltaik-Lösungen...",
 *   contentType: 'page',
 *   targetTopics: ['Photovoltaik', 'Kosten', 'Installation'],
 *   targetAudience: 'both',
 *   languages: ['de'],
 *   context: { industry: 'solar', complexity: 'intermediate' }
 * });
 *
 * // Get entity knowledge base
 * const entities = aiReadableFAQService.getEntityKnowledgeBase();
 *
 * // Update configuration
 * aiReadableFAQService.updateConfig({ conversationalFormatting: true });
 */