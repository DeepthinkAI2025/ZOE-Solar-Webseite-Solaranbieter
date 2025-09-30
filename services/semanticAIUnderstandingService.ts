/**
 * Semantic AI Understanding Service für ZOE Solar
 *
 * Erweiterte semantische Verarbeitung für AI-Systeme:
 * - Enhanced Entity Recognition
 * - Contextual Relationship Mapping
 * - Intent Classification für AI Queries
 * - Semantic Clustering von Related Topics
 */

import { aiContentOptimizationService } from './aiContentOptimizationService';

// ===== INTERFACES & TYPES =====

export interface SemanticEntity {
  id: string;
  name: string;
  type: 'organization' | 'product' | 'service' | 'location' | 'concept' | 'person' | 'event';
  confidence: number;
  context: string[];
  relationships: EntityRelationship[];
  metadata: Record<string, any>;
  lastUpdated: Date;
}

export interface EntityRelationship {
  targetEntityId: string;
  relationshipType: 'provides' | 'located_in' | 'related_to' | 'part_of' | 'competitor' | 'partner' | 'uses' | 'benefits_from';
  strength: number;
  context: string;
  bidirectional: boolean;
}

export interface SemanticContext {
  primaryIntent: string;
  secondaryIntents: string[];
  entities: SemanticEntity[];
  relationships: EntityRelationship[];
  topics: SemanticTopic[];
  sentiment: {
    score: number; // -1 to 1
    confidence: number;
    aspects: SentimentAspect[];
  };
  language: {
    primary: string;
    confidence: number;
    detectedLanguages: string[];
  };
  domain: {
    primary: string;
    confidence: number;
    relatedDomains: string[];
  };
}

export interface SemanticTopic {
  id: string;
  name: string;
  keywords: string[];
  relevanceScore: number;
  subtopics: string[];
  parentTopic?: string;
  clusterId?: string;
}

export interface SentimentAspect {
  aspect: string;
  sentiment: number; // -1 to 1
  confidence: number;
  mentions: string[];
}

export interface IntentClassification {
  primaryIntent: string;
  confidence: number;
  subIntents: Array<{
    intent: string;
    confidence: number;
  }>;
  context: string;
  entities: string[];
  suggestedActions: string[];
}

export interface SemanticCluster {
  id: string;
  name: string;
  topics: SemanticTopic[];
  entities: SemanticEntity[];
  centroid: number[]; // Vector representation
  cohesion: number;
  size: number;
  parentCluster?: string;
  subClusters: string[];
}

export interface SemanticAnalysisRequest {
  content: string;
  contentType: 'page' | 'article' | 'query' | 'conversation' | 'document';
  context?: {
    domain?: string;
    userIntent?: string;
    previousInteractions?: string[];
    targetAudience?: string;
  };
  analysisDepth: 'basic' | 'intermediate' | 'advanced';
  includeEntities: boolean;
  includeRelationships: boolean;
  includeTopics: boolean;
  includeSentiment: boolean;
}

export interface SemanticAnalysisResult {
  content: string;
  context: SemanticContext;
  entities: SemanticEntity[];
  relationships: EntityRelationship[];
  topics: SemanticTopic[];
  clusters: SemanticCluster[];
  intent: IntentClassification;
  performance: {
    processingTime: number;
    confidence: number;
    coverage: number;
  };
  recommendations: SemanticRecommendation[];
}

export interface SemanticRecommendation {
  type: 'entity_enrichment' | 'relationship_discovery' | 'topic_expansion' | 'content_optimization';
  priority: 'high' | 'medium' | 'low';
  description: string;
  impact: number;
  implementation: string[];
}

// ===== MAIN SERVICE CLASS =====

class SemanticAIUnderstandingService {
  private static instance: SemanticAIUnderstandingService;
  private entityDatabase: Map<string, SemanticEntity> = new Map();
  private relationshipGraph: Map<string, EntityRelationship[]> = new Map();
  private topicClusters: Map<string, SemanticCluster> = new Map();
  private intentPatterns: Map<string, RegExp[]> = new Map();

  private constructor() {
    this.initializeEntityDatabase();
    this.initializeIntentPatterns();
    this.initializeTopicClusters();
  }

  public static getInstance(): SemanticAIUnderstandingService {
    if (!SemanticAIUnderstandingService.instance) {
      SemanticAIUnderstandingService.instance = new SemanticAIUnderstandingService();
    }
    return SemanticAIUnderstandingService.instance;
  }

  // ===== INITIALIZATION =====

  private initializeEntityDatabase(): void {
    // Core ZOE Solar entities
    this.entityDatabase.set('zoe_solar', {
      id: 'zoe_solar',
      name: 'ZOE Solar',
      type: 'organization',
      confidence: 1.0,
      context: ['Photovoltaik-Spezialist', 'Gewerbe und Industrie', 'Berlin'],
      relationships: [],
      metadata: {
        founded: 2020,
        employees: 50,
        certifications: ['DIN EN 1090', 'ISO 9001'],
        services: ['Photovoltaik', 'Stromspeicher', 'E-Mobility']
      },
      lastUpdated: new Date()
    });

    this.entityDatabase.set('photovoltaik', {
      id: 'photovoltaik',
      name: 'Photovoltaik',
      type: 'service',
      confidence: 0.95,
      context: ['Solarstromerzeugung', 'Erneuerbare Energie', 'Nachhaltigkeit'],
      relationships: [],
      metadata: {
        category: 'renewable_energy',
        efficiency: '15-22%',
        lifespan: '25-30 Jahre'
      },
      lastUpdated: new Date()
    });

    this.entityDatabase.set('berlin', {
      id: 'berlin',
      name: 'Berlin',
      type: 'location',
      confidence: 1.0,
      context: ['Hauptstadt', 'Deutschland', 'ZOE Solar Standort'],
      relationships: [],
      metadata: {
        country: 'Deutschland',
        population: 3700000,
        area: '891 km²'
      },
      lastUpdated: new Date()
    });

    // Build initial relationships
    this.buildInitialRelationships();
  }

  private buildInitialRelationships(): void {
    // ZOE Solar provides Photovoltaik
    this.addRelationship('zoe_solar', 'photovoltaik', 'provides', 1.0, 'Kernkompetenz von ZOE Solar');

    // ZOE Solar located in Berlin
    this.addRelationship('zoe_solar', 'berlin', 'located_in', 1.0, 'Hauptsitz in Berlin');

    // Photovoltaik benefits from solar energy
    this.addRelationship('photovoltaik', 'solar_energy', 'uses', 0.9, 'Photovoltaik nutzt Sonnenenergie');
  }

  private initializeIntentPatterns(): void {
    // Commercial intents
    this.intentPatterns.set('commercial_inquiry', [
      /kosten|preis|angebot|budget|investition/i,
      /finanzierung|förderung|subvention/i,
      /kaufen|bestellen|buchung/i
    ]);

    // Informational intents
    this.intentPatterns.set('informational_inquiry', [
      /wie|was|wann|wo|warum|weshalb/i,
      /erklärung|definition|bedeutung/i,
      /anleitung|tutorial|guide/i
    ]);

    // Navigational intents
    this.intentPatterns.set('navigational_inquiry', [
      /kontakt|adresse|telefon|email/i,
      /öffnungszeiten|standort|filiale/i,
      /website|seite|link/i
    ]);

    // Transactional intents
    this.intentPatterns.set('transactional_inquiry', [
      /termin|beratung|besichtigung/i,
      /anfrage|kontaktformular/i,
      /registrierung|anmeldung/i
    ]);
  }

  private initializeTopicClusters(): void {
    // Photovoltaik cluster
    this.topicClusters.set('photovoltaik_cluster', {
      id: 'photovoltaik_cluster',
      name: 'Photovoltaik & Solartechnik',
      topics: [],
      entities: [],
      centroid: [0.8, 0.7, 0.6], // Example vector
      cohesion: 0.85,
      size: 15,
      subClusters: ['installation', 'wartung', 'technologie']
    });

    // Wirtschaftlichkeit cluster
    this.topicClusters.set('wirtschaftlichkeit_cluster', {
      id: 'wirtschaftlichkeit_cluster',
      name: 'Wirtschaftlichkeit & Finanzierung',
      topics: [],
      entities: [],
      centroid: [0.9, 0.4, 0.8],
      cohesion: 0.78,
      size: 12,
      subClusters: ['kosten', 'förderungen', 'rentabilität']
    });
  }

  // ===== SEMANTIC ANALYSIS =====

  public async analyzeSemanticContent(request: SemanticAnalysisRequest): Promise<SemanticAnalysisResult> {
    const startTime = Date.now();

    try {
      // Parallel processing for better performance
      const [entities, relationships, topics, context, intent] = await Promise.all([
        this.extractEntities(request),
        this.mapRelationships(request),
        this.clusterTopics(request),
        this.analyzeContext(request),
        this.classifyIntent(request)
      ]);

      // Create semantic clusters
      const clusters = this.createSemanticClusters(topics, entities);

      // Calculate performance metrics
      const processingTime = Date.now() - startTime;
      const confidence = this.calculateOverallConfidence(entities, relationships, topics);
      const coverage = this.calculateContentCoverage(request.content, entities, topics);

      // Generate recommendations
      const recommendations = this.generateSemanticRecommendations(entities, relationships, topics, clusters);

      return {
        content: request.content,
        context,
        entities,
        relationships,
        topics,
        clusters,
        intent,
        performance: {
          processingTime,
          confidence,
          coverage
        },
        recommendations
      };

    } catch (error) {
      console.error('Semantic analysis failed:', error);
      return this.createErrorResult(request, error as Error, startTime);
    }
  }

  // ===== ENTITY RECOGNITION =====

  private async extractEntities(request: SemanticAnalysisRequest): Promise<SemanticEntity[]> {
    if (!request.includeEntities) return [];

    const entities: SemanticEntity[] = [];
    const content = request.content.toLowerCase();

    // Extract from entity database
    for (const [id, entity] of this.entityDatabase) {
      if (this.entityMatchesContent(entity, content)) {
        entities.push({ ...entity });
      }
    }

    // Extract new entities using pattern matching
    const newEntities = this.extractNewEntities(request.content, request.contentType);
    entities.push(...newEntities);

    // Enhance entities with context
    entities.forEach(entity => {
      entity.context = this.extractEntityContext(entity, request.content);
      entity.confidence = this.calculateEntityConfidence(entity, request.content);
    });

    return entities.sort((a, b) => b.confidence - a.confidence);
  }

  private entityMatchesContent(entity: SemanticEntity, content: string): boolean {
    const entityName = entity.name.toLowerCase();
    const variations = this.generateEntityVariations(entity.name);

    return variations.some(variation =>
      content.includes(variation.toLowerCase())
    );
  }

  private generateEntityVariations(name: string): string[] {
    const variations = [name];

    // Add common variations
    if (name === 'ZOE Solar') {
      variations.push('ZOE-Solar', 'Zoe Solar', 'zoe solar');
    }

    if (name === 'Photovoltaik') {
      variations.push('PV', 'Solaranlage', 'Solarstrom');
    }

    return variations;
  }

  private extractNewEntities(content: string, contentType: string): SemanticEntity[] {
    const entities: SemanticEntity[] = [];

    // Extract organization names
    const orgPatterns = [
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g, // Company names
      /\b[A-Z]{2,}\b/g // Acronyms
    ];

    orgPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!this.entityDatabase.has(match.toLowerCase()) && match.length > 2) {
            entities.push({
              id: `entity_${match.toLowerCase().replace(/\s+/g, '_')}`,
              name: match,
              type: 'organization',
              confidence: 0.6,
              context: [],
              relationships: [],
              metadata: {},
              lastUpdated: new Date()
            });
          }
        });
      }
    });

    // Extract location names
    const locationPatterns = [
      /\b(Berlin|München|Hamburg|Köln|Frankfurt|Dresden|Leipzig)\b/gi
    ];

    locationPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({
            id: `location_${match.toLowerCase()}`,
            name: match,
            type: 'location',
            confidence: 0.8,
            context: ['Deutschland'],
            relationships: [],
            metadata: { country: 'Deutschland' },
            lastUpdated: new Date()
          });
        });
      }
    });

    return entities;
  }

  private extractEntityContext(entity: SemanticEntity, content: string): string[] {
    const context: string[] = [];
    const sentences = content.split(/[.!?]+/);

    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes(entity.name.toLowerCase())) {
        // Extract surrounding context (up to 50 characters before and after)
        const index = sentence.toLowerCase().indexOf(entity.name.toLowerCase());
        const start = Math.max(0, index - 50);
        const end = Math.min(sentence.length, index + entity.name.length + 50);
        context.push(sentence.substring(start, end).trim());
      }
    });

    return context.slice(0, 5); // Limit to 5 context examples
  }

  private calculateEntityConfidence(entity: SemanticEntity, content: string): number {
    let confidence = 0.5; // Base confidence

    // Name matching strength
    const nameMatches = (content.toLowerCase().match(new RegExp(entity.name.toLowerCase(), 'g')) || []).length;
    confidence += Math.min(0.3, nameMatches * 0.1);

    // Context relevance
    if (entity.context.length > 0) {
      confidence += 0.2;
    }

    // Type-specific confidence
    switch (entity.type) {
      case 'organization':
        if (entity.name.includes('Solar') || entity.name.includes('Energy')) confidence += 0.1;
        break;
      case 'location':
        confidence += 0.15;
        break;
      case 'service':
        if (content.includes('service') || content.includes('dienst')) confidence += 0.1;
        break;
    }

    return Math.min(1.0, confidence);
  }

  // ===== RELATIONSHIP MAPPING =====

  private async mapRelationships(request: SemanticAnalysisRequest): Promise<EntityRelationship[]> {
    if (!request.includeRelationships) return [];

    const relationships: EntityRelationship[] = [];

    // Get existing relationships from database
    for (const [entityId, entityRelationships] of this.relationshipGraph) {
      relationships.push(...entityRelationships);
    }

    // Discover new relationships
    const newRelationships = this.discoverRelationships(request.content, request.entities || []);
    relationships.push(...newRelationships);

    // Filter and rank relationships
    return relationships
      .filter(rel => rel.strength > 0.3)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 20);
  }

  private discoverRelationships(content: string, entities: SemanticEntity[]): EntityRelationship[] {
    const relationships: EntityRelationship[] = [];

    // Analyze co-occurrence patterns
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i];
        const entity2 = entities[j];

        const relationship = this.analyzeEntityRelationship(entity1, entity2, content);
        if (relationship) {
          relationships.push(relationship);
        }
      }
    }

    // Analyze sentence-level relationships
    const sentences = content.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const sentenceEntities = entities.filter(entity =>
        sentence.toLowerCase().includes(entity.name.toLowerCase())
      );

      if (sentenceEntities.length >= 2) {
        const relationship = this.analyzeSentenceRelationship(sentenceEntities, sentence);
        if (relationship) {
          relationships.push(relationship);
        }
      }
    });

    return relationships;
  }

  private analyzeEntityRelationship(
    entity1: SemanticEntity,
    entity2: SemanticEntity,
    content: string
  ): EntityRelationship | null {
    const lowerContent = content.toLowerCase();

    // Organization-Service relationships
    if (entity1.type === 'organization' && entity2.type === 'service') {
      if (lowerContent.includes('bietet') || lowerContent.includes('an') || lowerContent.includes('dienst')) {
        return {
          targetEntityId: entity2.id,
          relationshipType: 'provides',
          strength: 0.8,
          context: 'Service-Angebot erkannt',
          bidirectional: false
        };
      }
    }

    // Organization-Location relationships
    if (entity1.type === 'organization' && entity2.type === 'location') {
      if (lowerContent.includes('in') || lowerContent.includes('standort') || lowerContent.includes('sitz')) {
        return {
          targetEntityId: entity2.id,
          relationshipType: 'located_in',
          strength: 0.9,
          context: 'Standort-Information erkannt',
          bidirectional: false
        };
      }
    }

    // Service-Concept relationships
    if (entity1.type === 'service' && entity2.type === 'concept') {
      return {
        targetEntityId: entity2.id,
        relationshipType: 'related_to',
        strength: 0.6,
        context: 'Konzeptuelle Verbindung erkannt',
        bidirectional: true
      };
    }

    return null;
  }

  private analyzeSentenceRelationship(entities: SemanticEntity[], sentence: string): EntityRelationship | null {
    const lowerSentence = sentence.toLowerCase();

    // Look for relationship indicators
    const relationshipIndicators = {
      provides: ['bietet', 'an', 'dienst', 'service', 'angebot'],
      located_in: ['in', 'standort', 'sitz', 'ansässig', 'befindet'],
      related_to: ['bezüglich', 'zu', 'über', 'betreffend'],
      uses: ['verwendet', 'nutzt', 'benutzt', 'einsetzt']
    };

    for (const [type, indicators] of Object.entries(relationshipIndicators)) {
      if (indicators.some(indicator => lowerSentence.includes(indicator))) {
        if (entities.length >= 2) {
          return {
            targetEntityId: entities[1].id,
            relationshipType: type as EntityRelationship['relationshipType'],
            strength: 0.7,
            context: `Beziehung aus Satz erkannt: "${sentence.substring(0, 100)}..."`,
            bidirectional: type === 'related_to'
          };
        }
      }
    }

    return null;
  }

  private addRelationship(
    sourceId: string,
    targetId: string,
    type: EntityRelationship['relationshipType'],
    strength: number,
    context: string
  ): void {
    const relationship: EntityRelationship = {
      targetEntityId: targetId,
      relationshipType: type,
      strength,
      context,
      bidirectional: ['related_to', 'competitor'].includes(type)
    };

    if (!this.relationshipGraph.has(sourceId)) {
      this.relationshipGraph.set(sourceId, []);
    }

    this.relationshipGraph.get(sourceId)!.push(relationship);

    // Add bidirectional relationship if applicable
    if (relationship.bidirectional) {
      if (!this.relationshipGraph.has(targetId)) {
        this.relationshipGraph.set(targetId, []);
      }

      this.relationshipGraph.get(targetId)!.push({
        ...relationship,
        targetEntityId: sourceId
      });
    }
  }

  // ===== TOPIC CLUSTERING =====

  private async clusterTopics(request: SemanticAnalysisRequest): Promise<SemanticTopic[]> {
    if (!request.includeTopics) return [];

    const topics = this.extractTopics(request.content, request.contentType);

    // Assign topics to clusters
    topics.forEach(topic => {
      topic.clusterId = this.assignTopicToCluster(topic);
    });

    // Enhance topic relationships
    this.buildTopicRelationships(topics);

    return topics.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private extractTopics(content: string, contentType: string): SemanticTopic[] {
    const topics: SemanticTopic[] = [];
    const lowerContent = content.toLowerCase();

    // Domain-specific topic extraction for solar/photovoltaik
    const solarTopics = [
      {
        name: 'Photovoltaik Installation',
        keywords: ['installation', 'montage', 'aufbau', 'errichtung'],
        relevanceScore: lowerContent.includes('install') ? 0.9 : 0.6
      },
      {
        name: 'Kosten & Wirtschaftlichkeit',
        keywords: ['kosten', 'preis', 'wirtschaftlich', 'rentabilität', 'amortisation'],
        relevanceScore: lowerContent.includes('kosten') || lowerContent.includes('preis') ? 0.9 : 0.5
      },
      {
        name: 'Förderungen & Subventionen',
        keywords: ['förderung', 'subvention', 'kfw', 'bundesförderung'],
        relevanceScore: lowerContent.includes('förder') ? 0.9 : 0.4
      },
      {
        name: 'Technische Details',
        keywords: ['wirkungsgrad', 'modul', 'wechselrichter', 'speicher'],
        relevanceScore: lowerContent.includes('technisch') || lowerContent.includes('modul') ? 0.8 : 0.5
      },
      {
        name: 'Wartung & Service',
        keywords: ['wartung', 'service', 'pflege', 'reinigung', 'inspektion'],
        relevanceScore: lowerContent.includes('wartung') || lowerContent.includes('service') ? 0.8 : 0.4
      }
    ];

    solarTopics.forEach((topicData, index) => {
      if (topicData.relevanceScore > 0.3) {
        topics.push({
          id: `topic_${index}`,
          name: topicData.name,
          keywords: topicData.keywords,
          relevanceScore: topicData.relevanceScore,
          subtopics: this.extractSubtopics(topicData.name, content),
          clusterId: undefined
        });
      }
    });

    return topics;
  }

  private extractSubtopics(parentTopic: string, content: string): string[] {
    const subtopics: string[] = [];
    const lowerContent = content.toLowerCase();

    // Extract subtopics based on parent topic
    switch (parentTopic) {
      case 'Photovoltaik Installation':
        if (lowerContent.includes('dach')) subtopics.push('Dachinstallation');
        if (lowerContent.includes('freifläche')) subtopics.push('Freiflächenanlage');
        if (lowerContent.includes('carport')) subtopics.push('Carport-Installation');
        break;

      case 'Kosten & Wirtschaftlichkeit':
        if (lowerContent.includes('rechner')) subtopics.push('Kostenrechner');
        if (lowerContent.includes('einsparung')) subtopics.push('Stromeinsparung');
        if (lowerContent.includes('rückzahlung')) subtopics.push('Rückzahlungszeit');
        break;

      case 'Förderungen & Subventionen':
        if (lowerContent.includes('kfw')) subtopics.push('KfW-Förderung');
        if (lowerContent.includes('bund')) subtopics.push('Bundesförderung');
        if (lowerContent.includes('land')) subtopics.push('Landesförderung');
        break;
    }

    return subtopics;
  }

  private assignTopicToCluster(topic: SemanticTopic): string | undefined {
    // Simple clustering based on keywords
    if (topic.keywords.some(k => ['installation', 'montage', 'aufbau'].includes(k))) {
      return 'photovoltaik_cluster';
    }

    if (topic.keywords.some(k => ['kosten', 'preis', 'wirtschaftlich'].includes(k))) {
      return 'wirtschaftlichkeit_cluster';
    }

    return undefined;
  }

  private buildTopicRelationships(topics: SemanticTopic[]): void {
    topics.forEach(topic => {
      // Find parent topics
      const parentTopic = topics.find(t =>
        t.name !== topic.name &&
        topic.keywords.some(k => t.keywords.includes(k))
      );

      if (parentTopic) {
        topic.parentTopic = parentTopic.id;
      }
    });
  }

  private createSemanticClusters(topics: SemanticTopic[], entities: SemanticEntity[]): SemanticCluster[] {
    const clusters: SemanticCluster[] = [];

    // Group topics by clusterId
    const clusterGroups = new Map<string, SemanticTopic[]>();

    topics.forEach(topic => {
      if (topic.clusterId) {
        if (!clusterGroups.has(topic.clusterId)) {
          clusterGroups.set(topic.clusterId, []);
        }
        clusterGroups.get(topic.clusterId)!.push(topic);
      }
    });

    // Create cluster objects
    for (const [clusterId, clusterTopics] of clusterGroups) {
      const existingCluster = this.topicClusters.get(clusterId);
      if (existingCluster) {
        clusters.push({
          ...existingCluster,
          topics: clusterTopics,
          entities: entities.filter(e => this.entityBelongsToCluster(e, clusterId)),
          size: clusterTopics.length
        });
      }
    }

    return clusters;
  }

  private entityBelongsToCluster(entity: SemanticEntity, clusterId: string): boolean {
    // Simple heuristic: check if entity name appears in cluster topics
    const cluster = this.topicClusters.get(clusterId);
    if (!cluster) return false;

    return cluster.topics.some(topic =>
      topic.keywords.some(keyword =>
        entity.name.toLowerCase().includes(keyword) ||
        entity.context.some(ctx => ctx.toLowerCase().includes(keyword))
      )
    );
  }

  // ===== CONTEXT ANALYSIS =====

  private async analyzeContext(request: SemanticAnalysisRequest): Promise<SemanticContext> {
    const content = request.content;

    // Analyze sentiment
    const sentiment = this.analyzeSentiment(content);

    // Detect language
    const language = this.detectLanguage(content);

    // Determine domain
    const domain = this.determineDomain(content, request.context);

    // Extract entities and relationships for context
    const entities = await this.extractEntities(request);
    const relationships = await this.mapRelationships(request);

    // Extract topics
    const topics = await this.clusterTopics(request);

    return {
      primaryIntent: 'informational', // Will be overridden by intent classification
      secondaryIntents: [],
      entities,
      relationships,
      topics,
      sentiment,
      language,
      domain
    };
  }

  private analyzeSentiment(content: string): SemanticContext['sentiment'] {
    const lowerContent = content.toLowerCase();

    let score = 0;
    const aspects: SentimentAspect[] = [];

    // Positive indicators
    const positiveWords = ['gut', 'besser', 'erfolgreich', 'zufrieden', 'effizient', 'kostengünstig', 'nachhaltig'];
    const positiveCount = positiveWords.reduce((count, word) =>
      count + (lowerContent.split(word).length - 1), 0
    );

    // Negative indicators
    const negativeWords = ['schlecht', 'teuer', 'problematisch', 'schwierig', 'kompliziert'];
    const negativeCount = negativeWords.reduce((count, word) =>
      count + (lowerContent.split(word).length - 1), 0
    );

    // Calculate sentiment score
    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords > 0) {
      score = (positiveCount - negativeCount) / totalSentimentWords;
    }

    // Extract sentiment aspects
    const aspectKeywords = {
      'Kosten': ['kosten', 'preis', 'teuer', 'günstig'],
      'Qualität': ['qualität', 'gut', 'schlecht', 'robust'],
      'Service': ['service', 'unterstützung', 'beratung'],
      'Technologie': ['technologie', 'effizient', 'modern']
    };

    for (const [aspect, keywords] of Object.entries(aspectKeywords)) {
      const mentions = keywords.filter(keyword => lowerContent.includes(keyword));
      if (mentions.length > 0) {
        const aspectSentiment = this.calculateAspectSentiment(aspect, content);
        aspects.push({
          aspect,
          sentiment: aspectSentiment,
          confidence: 0.7,
          mentions
        });
      }
    }

    return {
      score: Math.max(-1, Math.min(1, score)),
      confidence: totalSentimentWords > 0 ? 0.8 : 0.5,
      aspects
    };
  }

  private calculateAspectSentiment(aspect: string, content: string): number {
    const lowerContent = content.toLowerCase();
    let sentiment = 0;

    // Simple aspect-based sentiment calculation
    const positiveIndicators = ['gut', 'besser', 'effizient', 'kostengünstig', 'zufrieden'];
    const negativeIndicators = ['schlecht', 'teuer', 'problematisch', 'schwierig'];

    positiveIndicators.forEach(word => {
      if (lowerContent.includes(word)) sentiment += 0.2;
    });

    negativeIndicators.forEach(word => {
      if (lowerContent.includes(word)) sentiment -= 0.2;
    });

    return Math.max(-1, Math.min(1, sentiment));
  }

  private detectLanguage(content: string): SemanticContext['language'] {
    // Simple language detection for German content
    const germanWords = ['der', 'die', 'das', 'und', 'mit', 'für', 'auf', 'ist', 'von', 'zu'];
    const germanCount = germanWords.reduce((count, word) =>
      count + (content.toLowerCase().split(word).length - 1), 0
    );

    const totalWords = content.split(/\s+/).length;
    const germanRatio = germanCount / totalWords;

    return {
      primary: germanRatio > 0.1 ? 'de' : 'en',
      confidence: Math.min(1.0, germanRatio * 2),
      detectedLanguages: germanRatio > 0.1 ? ['de'] : ['en']
    };
  }

  private determineDomain(content: string, context?: SemanticAnalysisRequest['context']): SemanticContext['domain'] {
    const lowerContent = content.toLowerCase();

    // Domain detection based on keywords
    if (lowerContent.includes('photovoltaik') || lowerContent.includes('solar')) {
      return {
        primary: 'renewable_energy',
        confidence: 0.9,
        relatedDomains: ['sustainability', 'technology', 'business']
      };
    }

    if (lowerContent.includes('beratung') || lowerContent.includes('service')) {
      return {
        primary: 'consulting',
        confidence: 0.8,
        relatedDomains: ['business', 'customer_service']
      };
    }

    if (lowerContent.includes('technisch') || lowerContent.includes('installation')) {
      return {
        primary: 'technology',
        confidence: 0.7,
        relatedDomains: ['engineering', 'business']
      };
    }

    return {
      primary: 'general',
      confidence: 0.5,
      relatedDomains: []
    };
  }

  // ===== INTENT CLASSIFICATION =====

  private async classifyIntent(request: SemanticAnalysisRequest): Promise<IntentClassification> {
    const content = request.content.toLowerCase();

    // Primary intent classification
    const primaryIntent = this.determinePrimaryIntent(content, request.contentType);

    // Sub-intents
    const subIntents = this.determineSubIntents(content, primaryIntent);

    // Extract entities for intent
    const entities = this.extractIntentEntities(content);

    // Generate suggested actions
    const suggestedActions = this.generateSuggestedActions(primaryIntent, subIntents, request.contentType);

    return {
      primaryIntent,
      confidence: this.calculateIntentConfidence(content, primaryIntent),
      subIntents,
      context: this.extractIntentContext(content),
      entities,
      suggestedActions
    };
  }

  private determinePrimaryIntent(content: string, contentType: string): string {
    // Check against intent patterns
    for (const [intent, patterns] of this.intentPatterns) {
      const matches = patterns.reduce((count, pattern) =>
        count + (content.match(pattern) || []).length, 0
      );

      if (matches > 0) {
        return intent;
      }
    }

    // Content type based classification
    switch (contentType) {
      case 'query':
        return 'informational_inquiry';
      case 'page':
        return 'navigational_inquiry';
      case 'article':
        return 'informational_inquiry';
      default:
        return 'general_inquiry';
    }
  }

  private determineSubIntents(content: string, primaryIntent: string): Array<{ intent: string; confidence: number }> {
    const subIntents: Array<{ intent: string; confidence: number }> = [];

    // Extract sub-intents based on primary intent
    switch (primaryIntent) {
      case 'commercial_inquiry':
        if (content.includes('förderung')) {
          subIntents.push({ intent: 'funding_inquiry', confidence: 0.8 });
        }
        if (content.includes('beratung')) {
          subIntents.push({ intent: 'consultation_request', confidence: 0.7 });
        }
        break;

      case 'informational_inquiry':
        if (content.includes('kosten')) {
          subIntents.push({ intent: 'cost_information', confidence: 0.8 });
        }
        if (content.includes('technisch')) {
          subIntents.push({ intent: 'technical_details', confidence: 0.7 });
        }
        break;
    }

    return subIntents;
  }

  private extractIntentEntities(content: string): string[] {
    const entities: string[] = [];

    // Extract entities relevant to intent
    const entityPatterns = [
      /\b\d+(?:\.\d+)?\s*(?:€|euro|kosten|preis)\b/gi, // Prices/costs
      /\b\d+(?:\.\d+)?\s*kwp?\b/gi, // Power ratings
      /\b\d+(?:\.\d+)?\s*jahre?\b/gi, // Time periods
      /\b\d+(?:\.\d+)?\s*%\b/g // Percentages
    ];

    entityPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        entities.push(...matches);
      }
    });

    return [...new Set(entities)];
  }

  private generateSuggestedActions(
    primaryIntent: string,
    subIntents: Array<{ intent: string; confidence: number }>,
    contentType: string
  ): string[] {
    const actions: string[] = [];

    switch (primaryIntent) {
      case 'commercial_inquiry':
        actions.push('Kontaktformular anzeigen');
        actions.push('Kostenrechner vorschlagen');
        if (subIntents.some(si => si.intent === 'funding_inquiry')) {
          actions.push('Förderungsübersicht anzeigen');
        }
        break;

      case 'informational_inquiry':
        actions.push('Relevante Artikel vorschlagen');
        actions.push('FAQ-Bereich hervorheben');
        break;

      case 'navigational_inquiry':
        actions.push('Standort-Informationen anzeigen');
        actions.push('Kontaktmöglichkeiten hervorheben');
        break;
    }

    return actions;
  }

  private calculateIntentConfidence(content: string, intent: string): number {
    const patterns = this.intentPatterns.get(intent) || [];
    const matches = patterns.reduce((count, pattern) =>
      count + (content.match(pattern) || []).length, 0
    );

    return Math.min(1.0, 0.5 + (matches * 0.1));
  }

  private extractIntentContext(content: string): string {
    // Extract the most relevant sentence for intent context
    const sentences = content.split(/[.!?]+/);
    const intentKeywords = ['kosten', 'preis', 'beratung', 'information', 'kontakt'];

    for (const sentence of sentences) {
      if (intentKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
        return sentence.trim();
      }
    }

    return sentences[0]?.trim() || '';
  }

  // ===== UTILITY METHODS =====

  private calculateOverallConfidence(
    entities: SemanticEntity[],
    relationships: EntityRelationship[],
    topics: SemanticTopic[]
  ): number {
    const entityConfidence = entities.length > 0 ?
      entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length : 0;

    const relationshipConfidence = relationships.length > 0 ?
      relationships.reduce((sum, r) => sum + r.strength, 0) / relationships.length : 0;

    const topicConfidence = topics.length > 0 ?
      topics.reduce((sum, t) => sum + t.relevanceScore, 0) / topics.length : 0;

    return (entityConfidence + relationshipConfidence + topicConfidence) / 3;
  }

  private calculateContentCoverage(content: string, entities: SemanticEntity[], topics: SemanticTopic[]): number {
    const contentWords = content.toLowerCase().split(/\s+/).length;
    let coveredWords = 0;

    // Count words covered by entities
    entities.forEach(entity => {
      const matches = content.toLowerCase().match(new RegExp(entity.name.toLowerCase(), 'g'));
      if (matches) {
        coveredWords += matches.length;
      }
    });

    // Count words covered by topics
    topics.forEach(topic => {
      topic.keywords.forEach(keyword => {
        const matches = content.toLowerCase().match(new RegExp(keyword, 'g'));
        if (matches) {
          coveredWords += matches.length;
        }
      });
    });

    return Math.min(1.0, coveredWords / contentWords);
  }

  private generateSemanticRecommendations(
    entities: SemanticEntity[],
    relationships: EntityRelationship[],
    topics: SemanticTopic[],
    clusters: SemanticCluster[]
  ): SemanticRecommendation[] {
    const recommendations: SemanticRecommendation[] = [];

    // Entity enrichment recommendations
    if (entities.length < 5) {
      recommendations.push({
        type: 'entity_enrichment',
        priority: 'medium',
        description: 'Weitere Entitäten zur Verbesserung der semantischen Abdeckung hinzufügen',
        impact: 0.3,
        implementation: [
          'Entity-Datenbank erweitern',
          'NER-Modell trainieren',
          'Kontext-Informationen hinzufügen'
        ]
      });
    }

    // Relationship discovery recommendations
    if (relationships.length < 10) {
      recommendations.push({
        type: 'relationship_discovery',
        priority: 'high',
        description: 'Mehr Entitäts-Beziehungen zur Verbesserung des Knowledge Graphs identifizieren',
        impact: 0.4,
        implementation: [
          'Beziehungsanalyse verbessern',
          'Kontextuelle Muster erkennen',
          'Domain-spezifische Regeln definieren'
        ]
      });
    }

    // Topic expansion recommendations
    const avgTopicRelevance = topics.reduce((sum, t) => sum + t.relevanceScore, 0) / topics.length;
    if (avgTopicRelevance < 0.7) {
      recommendations.push({
        type: 'topic_expansion',
        priority: 'medium',
        description: 'Topic-Relevanz durch bessere Keyword-Abdeckung verbessern',
        impact: 0.25,
        implementation: [
          'Keyword-Analyse erweitern',
          'Topic-Modelle optimieren',
          'Domain-spezifisches Vokabular integrieren'
        ]
      });
    }

    // Content optimization recommendations
    if (clusters.length === 0) {
      recommendations.push({
        type: 'content_optimization',
        priority: 'low',
        description: 'Semantische Cluster für bessere Content-Strukturierung erstellen',
        impact: 0.2,
        implementation: [
          'Clustering-Algorithmus implementieren',
          'Topic-Hierarchien aufbauen',
          'Content-Segmentierung verbessern'
        ]
      });
    }

    return recommendations;
  }

  private createErrorResult(
    request: SemanticAnalysisRequest,
    error: Error,
    startTime: number
  ): SemanticAnalysisResult {
    return {
      content: request.content,
      context: {
        primaryIntent: 'unknown',
        secondaryIntents: [],
        entities: [],
        relationships: [],
        topics: [],
        sentiment: { score: 0, confidence: 0, aspects: [] },
        language: { primary: 'unknown', confidence: 0, detectedLanguages: [] },
        domain: { primary: 'unknown', confidence: 0, relatedDomains: [] }
      },
      entities: [],
      relationships: [],
      topics: [],
      clusters: [],
      intent: {
        primaryIntent: 'unknown',
        confidence: 0,
        subIntents: [],
        context: '',
        entities: [],
        suggestedActions: []
      },
      performance: {
        processingTime: Date.now() - startTime,
        confidence: 0,
        coverage: 0
      },
      recommendations: [{
        type: 'content_optimization',
        priority: 'high',
        description: `Kritischer Fehler bei der semantischen Analyse: ${error.message}`,
        impact: 1.0,
        implementation: [
          'Fehler-Logs überprüfen',
          'System-Komponenten validieren',
          'Fallback-Mechanismen implementieren'
        ]
      }]
    };
  }

  // ===== PUBLIC API METHODS =====

  public addEntity(entity: SemanticEntity): void {
    this.entityDatabase.set(entity.id, entity);
  }

  public getEntity(id: string): SemanticEntity | undefined {
    return this.entityDatabase.get(id);
  }

  public getAllEntities(): SemanticEntity[] {
    return Array.from(this.entityDatabase.values());
  }

  public addTopicCluster(cluster: SemanticCluster): void {
    this.topicClusters.set(cluster.id, cluster);
  }

  public getTopicCluster(id: string): SemanticCluster | undefined {
    return this.topicClusters.get(id);
  }

  public getAllTopicClusters(): SemanticCluster[] {
    return Array.from(this.topicClusters.values());
  }

  public updateIntentPatterns(intent: string, patterns: RegExp[]): void {
    this.intentPatterns.set(intent, patterns);
  }

  public getIntentPatterns(): Map<string, RegExp[]> {
    return new Map(this.intentPatterns);
  }

  public clearCaches(): void {
    // Clear any cached analysis results if implemented
  }

  public getAnalysisStats(): {
    entities: number;
    relationships: number;
    clusters: number;
    intents: number;
  } {
    return {
      entities: this.entityDatabase.size,
      relationships: Array.from(this.relationshipGraph.values()).reduce((sum, rels) => sum + rels.length, 0),
      clusters: this.topicClusters.size,
      intents: this.intentPatterns.size
    };
  }

  public validateAnalysisRequest(request: SemanticAnalysisRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.content || request.content.trim().length === 0) {
      issues.push('Content cannot be empty');
    }

    if (request.content.length > 100000) {
      issues.push('Content too large. Maximum allowed: 100,000 characters');
    }

    if (!['basic', 'intermediate', 'advanced'].includes(request.analysisDepth)) {
      issues.push('Invalid analysis depth. Must be: basic, intermediate, or advanced');
    }

    if (!['page', 'article', 'query', 'conversation', 'document'].includes(request.contentType)) {
      issues.push('Invalid content type');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// ===== EXPORT =====

export const semanticAIUnderstandingService = SemanticAIUnderstandingService.getInstance();
export default semanticAIUnderstandingService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Vollständige semantische Analyse
 * const result = await semanticAIUnderstandingService.analyzeSemanticContent({
 *   content: "ZOE Solar bietet Photovoltaik-Lösungen in Berlin...",
 *   contentType: 'page',
 *   analysisDepth: 'advanced',
 *   includeEntities: true,
 *   includeRelationships: true,
 *   includeTopics: true,
 *   includeSentiment: true,
 *   context: {
 *     domain: 'solar_energy',
 *     userIntent: 'commercial'
 *   }
 * });
 *
 * // Einzelne Entität hinzufügen
 * semanticAIUnderstandingService.addEntity({
 *   id: 'new_entity',
 *   name: 'Neue Entität',
 *   type: 'service',
 *   confidence: 0.8,
 *   context: ['Beschreibung'],
 *   relationships: [],
 *   metadata: {},
 *   lastUpdated: new Date()
 * });
 *
 * // Intent-Patterns aktualisieren
 * semanticAIUnderstandingService.updateIntentPatterns('custom_intent', [
 *   /custom\s+pattern/gi
 * ]);
 */