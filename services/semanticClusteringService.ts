/**
 * Semantic Clustering Service für ZOE Solar
 *
 * Gruppiert verwandte Inhalte thematisch für optimale AI-Verarbeitung.
 * Implementiert fortschrittliche Clustering-Algorithmen zur Identifizierung
 * semantischer Beziehungen und thematischer Zusammenhänge.
 */

import { aiContentOptimizationService } from './aiContentOptimizationService';

// ===== INTERFACES & TYPES =====

export interface SemanticClusteringConfig {
  enabled: boolean;
  clusteringAlgorithm: 'kmeans' | 'hierarchical' | 'dbscan' | 'custom';
  similarityThreshold: number;
  maxClusters: number;
  minClusterSize: number;
  semanticAnalysis: {
    entityRecognition: boolean;
    topicModeling: boolean;
    relationshipMapping: boolean;
    contextAnalysis: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    maxContentLength: number;
    batchSize: number;
  };
}

export interface ClusteringRequest {
  content: ContentItem[];
  targetTopics: string[];
  clusteringCriteria: ClusteringCriteria;
  context?: {
    industry?: string;
    language?: string;
    contentType?: 'page' | 'article' | 'product' | 'service';
    userIntent?: string;
  };
}

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  url?: string;
  type: 'page' | 'article' | 'faq' | 'product' | 'service';
  metadata?: {
    keywords?: string[];
    entities?: string[];
    topics?: string[];
    lastModified?: Date;
  };
}

export interface ClusteringCriteria {
  similarityMetrics: ('semantic' | 'keyword' | 'entity' | 'topic' | 'contextual')[];
  weightSemantic: number;
  weightKeyword: number;
  weightEntity: number;
  weightTopic: number;
  weightContextual: number;
  minSimilarityScore: number;
  maxDistance: number;
}

export interface SemanticCluster {
  id: string;
  name: string;
  description: string;
  contentItems: ContentItem[];
  centroid: ContentVector;
  topics: string[];
  entities: string[];
  keywords: string[];
  relationships: ClusterRelationship[];
  quality: ClusterQuality;
  metadata: ClusterMetadata;
}

export interface ContentVector {
  id: string;
  vector: number[];
  dimensions: string[];
  magnitude: number;
  normalized: boolean;
}

export interface ClusterRelationship {
  targetClusterId: string;
  relationshipType: 'related' | 'parent' | 'child' | 'similar' | 'complementary';
  strength: number;
  description: string;
  sharedTopics: string[];
  sharedEntities: string[];
}

export interface ClusterQuality {
  cohesion: number; // How similar items within cluster are
  separation: number; // How different clusters are from each other
  silhouetteScore: number; // Overall clustering quality
  coverage: number; // Percentage of content covered
  density: number; // Cluster density score
}

export interface ClusterMetadata {
  createdAt: Date;
  lastUpdated: Date;
  algorithm: string;
  parameters: Record<string, any>;
  confidence: number;
  source: string;
}

export interface ClusteringResult {
  clusters: SemanticCluster[];
  unclusteredItems: ContentItem[];
  relationships: ClusterRelationship[];
  performance: ClusteringPerformance;
  metadata: ClusteringMetadata;
}

export interface ClusteringPerformance {
  processingTime: number;
  totalItems: number;
  clusteredItems: number;
  averageSimilarity: number;
  cacheHitRate: number;
  errorRate: number;
  memoryUsage: number;
}

export interface ClusteringMetadata {
  timestamp: Date;
  version: string;
  algorithm: string;
  parameters: ClusteringCriteria;
  totalClusters: number;
  averageClusterSize: number;
  clusteringQuality: number;
  coverage: number;
}

// ===== MAIN SERVICE CLASS =====

class SemanticClusteringService {
  private static instance: SemanticClusteringService;
  private config: SemanticClusteringConfig;
  private clusterCache: Map<string, ClusteringResult> = new Map();
  private contentVectors: Map<string, ContentVector> = new Map();
  private semanticKnowledgeBase: Map<string, SemanticKnowledge> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeSemanticKnowledgeBase();
  }

  public static getInstance(): SemanticClusteringService {
    if (!SemanticClusteringService.instance) {
      SemanticClusteringService.instance = new SemanticClusteringService();
    }
    return SemanticClusteringService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): SemanticClusteringConfig {
    return {
      enabled: true,
      clusteringAlgorithm: 'kmeans',
      similarityThreshold: 0.6,
      maxClusters: 20,
      minClusterSize: 2,
      semanticAnalysis: {
        entityRecognition: true,
        topicModeling: true,
        relationshipMapping: true,
        contextAnalysis: true
      },
      performance: {
        cacheEnabled: true,
        cacheTTL: 3600,
        maxContentLength: 10000,
        batchSize: 50
      }
    };
  }

  public updateConfig(newConfig: Partial<SemanticClusteringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): SemanticClusteringConfig {
    return { ...this.config };
  }

  // ===== CLUSTERING EXECUTION =====

  public async performClustering(request: ClusteringRequest): Promise<ClusteringResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // Check cache first
    if (this.config.performance.cacheEnabled && this.clusterCache.has(cacheKey)) {
      const cached = this.clusterCache.get(cacheKey)!;
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHitRate: 1.0
        }
      };
    }

    try {
      const result = await this.executeClustering(request);

      // Calculate performance metrics
      const processingTime = Date.now() - startTime;
      result.performance = {
        processingTime,
        totalItems: request.content.length,
        clusteredItems: result.clusters.reduce((sum, cluster) => sum + cluster.contentItems.length, 0),
        averageSimilarity: this.calculateAverageSimilarity(result.clusters),
        cacheHitRate: 0,
        errorRate: 0,
        memoryUsage: this.estimateMemoryUsage(result)
      };

      // Cache result if enabled
      if (this.config.performance.cacheEnabled) {
        this.clusterCache.set(cacheKey, result);
        setTimeout(() => this.clusterCache.delete(cacheKey), this.config.performance.cacheTTL * 1000);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown clustering error';
      return this.createErrorResult(request, errorMessage, startTime);
    }
  }

  private async executeClustering(request: ClusteringRequest): Promise<ClusteringResult> {
    const { content, targetTopics, clusteringCriteria, context } = request;

    // 1. Preprocess content
    const processedContent = this.preprocessContent(content);

    // 2. Generate content vectors
    const contentVectors = await this.generateContentVectors(processedContent, clusteringCriteria);

    // 3. Perform clustering based on algorithm
    let clusters: SemanticCluster[];
    switch (this.config.clusteringAlgorithm) {
      case 'kmeans':
        clusters = await this.performKMeansClustering(contentVectors, clusteringCriteria);
        break;
      case 'hierarchical':
        clusters = await this.performHierarchicalClustering(contentVectors, clusteringCriteria);
        break;
      case 'dbscan':
        clusters = await this.performDBSCANClustering(contentVectors, clusteringCriteria);
        break;
      default:
        clusters = await this.performCustomClustering(contentVectors, clusteringCriteria);
    }

    // 4. Post-process clusters
    clusters = this.postProcessClusters(clusters, targetTopics);

    // 5. Identify unclustered items
    const clusteredItemIds = new Set(clusters.flatMap(c => c.contentItems.map(item => item.id)));
    const unclusteredItems = processedContent.filter(item => !clusteredItemIds.has(item.id));

    // 6. Generate cluster relationships
    const relationships = this.generateClusterRelationships(clusters, clusteringCriteria);

    // 7. Generate metadata
    const metadata = this.generateClusteringMetadata(clusters, request, contentVectors);

    return {
      clusters,
      unclusteredItems,
      relationships,
      performance: {} as ClusteringPerformance, // Will be set by caller
      metadata
    };
  }

  // ===== CONTENT PREPROCESSING =====

  private preprocessContent(content: ContentItem[]): ContentItem[] {
    return content.map(item => ({
      ...item,
      content: this.cleanContent(item.content),
      title: this.cleanTitle(item.title)
    })).filter(item =>
      item.content.length >= 50 && // Minimum content length
      item.title.length >= 3 // Minimum title length
    );
  }

  private cleanContent(content: string): string {
    return content
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\säöüÄÖÜß.,!?-]/g, '') // Remove special characters except German umlauts
      .trim()
      .substring(0, this.config.performance.maxContentLength);
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/[^\w\säöüÄÖÜß-]/g, '')
      .trim();
  }

  // ===== VECTOR GENERATION =====

  private async generateContentVectors(
    content: ContentItem[],
    criteria: ClusteringCriteria
  ): Promise<ContentVector[]> {
    const vectors: ContentVector[] = [];

    for (const item of content) {
      const vector = await this.generateContentVector(item, criteria);
      vectors.push(vector);
      this.contentVectors.set(item.id, vector);
    }

    return vectors;
  }

  private async generateContentVector(item: ContentItem, criteria: ClusteringCriteria): Promise<ContentVector> {
    const dimensions: string[] = [];
    const vector: number[] = [];

    // Semantic similarity (weighted)
    if (criteria.similarityMetrics.includes('semantic')) {
      const semanticVector = await this.generateSemanticVector(item);
      vector.push(...semanticVector.map(v => v * criteria.weightSemantic));
      dimensions.push(...semanticVector.map((_, i) => `semantic_${i}`));
    }

    // Keyword similarity
    if (criteria.similarityMetrics.includes('keyword')) {
      const keywordVector = this.generateKeywordVector(item);
      vector.push(...keywordVector.map(v => v * criteria.weightKeyword));
      dimensions.push(...keywordVector.map((_, i) => `keyword_${i}`));
    }

    // Entity similarity
    if (criteria.similarityMetrics.includes('entity')) {
      const entityVector = this.generateEntityVector(item);
      vector.push(...entityVector.map(v => v * criteria.weightEntity));
      dimensions.push(...entityVector.map((_, i) => `entity_${i}`));
    }

    // Topic similarity
    if (criteria.similarityMetrics.includes('topic')) {
      const topicVector = this.generateTopicVector(item);
      vector.push(...topicVector.map(v => v * criteria.weightTopic));
      dimensions.push(...topicVector.map((_, i) => `topic_${i}`));
    }

    // Contextual similarity
    if (criteria.similarityMetrics.includes('contextual')) {
      const contextualVector = this.generateContextualVector(item);
      vector.push(...contextualVector.map(v => v * criteria.weightContextual));
      dimensions.push(...contextualVector.map((_, i) => `contextual_${i}`));
    }

    // Normalize vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    const normalizedVector = magnitude > 0 ? vector.map(v => v / magnitude) : vector;

    return {
      id: item.id,
      vector: normalizedVector,
      dimensions,
      magnitude,
      normalized: true
    };
  }

  private async generateSemanticVector(item: ContentItem): Promise<number[]> {
    // Simplified semantic vector generation (would use embeddings in production)
    const words = item.content.toLowerCase().split(/\s+/);
    const semanticFeatures = [
      'photovoltaik', 'solar', 'anlage', 'kosten', 'installation',
      'förderung', 'speicher', 'strom', 'energie', 'umwelt'
    ];

    return semanticFeatures.map(feature =>
      words.filter(word => word.includes(feature) || feature.includes(word)).length / words.length
    );
  }

  private generateKeywordVector(item: ContentItem): number[] {
    const keywords = item.metadata?.keywords || this.extractKeywords(item.content);
    const allKeywords = this.getAllKnownKeywords();

    return allKeywords.map(keyword =>
      keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ? 1 : 0
    );
  }

  private generateEntityVector(item: ContentItem): number[] {
    const entities = item.metadata?.entities || this.extractEntities(item.content);
    const allEntities = this.getAllKnownEntities();

    return allEntities.map(entity =>
      entities.some(e => e.toLowerCase().includes(entity.toLowerCase())) ? 1 : 0
    );
  }

  private generateTopicVector(item: ContentItem): number[] {
    const topics = item.metadata?.topics || this.extractTopics(item.content);
    const allTopics = this.getAllKnownTopics();

    return allTopics.map(topic =>
      topics.some(t => t.toLowerCase().includes(topic.toLowerCase())) ? 1 : 0
    );
  }

  private generateContextualVector(item: ContentItem): number[] {
    // Contextual features based on content type and structure
    const features = [
      item.type === 'page' ? 1 : 0,
      item.type === 'article' ? 1 : 0,
      item.type === 'product' ? 1 : 0,
      item.type === 'service' ? 1 : 0,
      item.type === 'faq' ? 1 : 0,
      item.content.length > 1000 ? 1 : 0,
      item.title.includes('?') ? 1 : 0,
      /\d+/.test(item.content) ? 1 : 0, // Contains numbers
      item.content.includes('kosten') || item.content.includes('preis') ? 1 : 0,
      item.content.includes('installation') || item.content.includes('montage') ? 1 : 0
    ];

    return features;
  }

  // ===== CLUSTERING ALGORITHMS =====

  private async performKMeansClustering(
    vectors: ContentVector[],
    criteria: ClusteringCriteria
  ): Promise<SemanticCluster[]> {
    const k = Math.min(this.config.maxClusters, Math.max(2, Math.floor(vectors.length / this.config.minClusterSize)));
    const clusters: SemanticCluster[] = [];

    // Initialize centroids randomly
    const centroids = this.initializeCentroids(vectors, k);

    // K-means iteration
    for (let iteration = 0; iteration < 10; iteration++) {
      // Assign vectors to nearest centroids
      const assignments = this.assignVectorsToCentroids(vectors, centroids);

      // Update centroids
      const newCentroids = this.updateCentroids(vectors, assignments, k);

      // Check for convergence
      if (this.centroidsConverged(centroids, newCentroids)) {
        break;
      }

      centroids.splice(0, centroids.length, ...newCentroids);
    }

    // Create cluster objects
    for (let i = 0; i < k; i++) {
      const clusterVectors = vectors.filter((_, index) => {
        const assignment = this.assignVectorsToCentroids(vectors, centroids)[index];
        return assignment === i;
      });

      if (clusterVectors.length >= this.config.minClusterSize) {
        clusters.push(await this.createSemanticCluster(clusterVectors, i, centroids[i]));
      }
    }

    return clusters;
  }

  private async performHierarchicalClustering(
    vectors: ContentVector[],
    criteria: ClusteringCriteria
  ): Promise<SemanticCluster[]> {
    // Simplified hierarchical clustering
    const clusters: SemanticCluster[] = [];

    // Start with each vector as its own cluster
    const initialClusters = vectors.map(vector => [vector]);

    // Merge closest clusters iteratively
    while (initialClusters.length > this.config.maxClusters && initialClusters.length > 1) {
      const { index1, index2 } = this.findClosestClusters(initialClusters, criteria);

      // Merge clusters
      const mergedCluster = [...initialClusters[index1], ...initialClusters[index2]];
      initialClusters.splice(Math.max(index1, index2), 1);
      initialClusters.splice(Math.min(index1, index2), 1);
      initialClusters.push(mergedCluster);
    }

    // Convert to SemanticCluster objects
    for (let i = 0; i < initialClusters.length; i++) {
      if (initialClusters[i].length >= this.config.minClusterSize) {
        const centroid = this.calculateCentroid(initialClusters[i]);
        clusters.push(await this.createSemanticCluster(initialClusters[i], i, centroid));
      }
    }

    return clusters;
  }

  private async performDBSCANClustering(
    vectors: ContentVector[],
    criteria: ClusteringCriteria
  ): Promise<SemanticCluster[]> {
    const clusters: SemanticCluster[] = [];
    const visited = new Set<string>();
    const clustered = new Set<string>();
    let clusterId = 0;

    for (const vector of vectors) {
      if (visited.has(vector.id)) continue;

      visited.add(vector.id);
      const neighbors = this.findNeighbors(vector, vectors, criteria.minSimilarityScore);

      if (neighbors.length < this.config.minClusterSize) {
        continue; // Noise point
      }

      // Start new cluster
      const clusterVectors: ContentVector[] = [vector];
      clustered.add(vector.id);

      // Expand cluster
      const toProcess = [...neighbors];
      while (toProcess.length > 0) {
        const neighbor = toProcess.pop()!;

        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          const neighborNeighbors = this.findNeighbors(neighbor, vectors, criteria.minSimilarityScore);

          if (neighborNeighbors.length >= this.config.minClusterSize) {
            toProcess.push(...neighborNeighbors.filter(n => !visited.has(n.id)));
          }
        }

        if (!clustered.has(neighbor.id)) {
          clustered.add(neighbor.id);
          clusterVectors.push(neighbor);
        }
      }

      // Create cluster
      const centroid = this.calculateCentroid(clusterVectors);
      clusters.push(await this.createSemanticCluster(clusterVectors, clusterId++, centroid));
    }

    return clusters;
  }

  private async performCustomClustering(
    vectors: ContentVector[],
    criteria: ClusteringCriteria
  ): Promise<SemanticCluster[]> {
    // Custom clustering based on semantic knowledge base
    const clusters: SemanticCluster[] = [];
    const processed = new Set<string>();

    for (const knowledge of this.semanticKnowledgeBase.values()) {
      const clusterVectors = vectors.filter(vector => {
        if (processed.has(vector.id)) return false;

        const contentItem = this.getContentItemById(vector.id, vectors);
        if (!contentItem) return false;

        const similarity = this.calculateSemanticSimilarity(contentItem, knowledge);
        return similarity >= criteria.minSimilarityScore;
      });

      if (clusterVectors.length >= this.config.minClusterSize) {
        clusterVectors.forEach(v => processed.add(v.id));
        const centroid = this.calculateCentroid(clusterVectors);
        clusters.push(await this.createSemanticCluster(clusterVectors, clusters.length, centroid, knowledge));
      }
    }

    return clusters;
  }

  // ===== CLUSTER CREATION =====

  private async createSemanticCluster(
    vectors: ContentVector[],
    clusterId: number,
    centroid: ContentVector,
    knowledge?: SemanticKnowledge
  ): Promise<SemanticCluster> {
    const contentItems = vectors.map(vector => this.getContentItemById(vector.id, vectors)!).filter(Boolean);

    // Extract cluster characteristics
    const topics = this.extractClusterTopics(contentItems);
    const entities = this.extractClusterEntities(contentItems);
    const keywords = this.extractClusterKeywords(contentItems);

    // Generate cluster name and description
    const name = knowledge?.name || this.generateClusterName(topics, entities);
    const description = knowledge?.description || this.generateClusterDescription(contentItems);

    // Calculate quality metrics
    const quality = this.calculateClusterQuality(vectors, centroid);

    // Generate relationships (will be populated later)
    const relationships: ClusterRelationship[] = [];

    const metadata: ClusterMetadata = {
      createdAt: new Date(),
      lastUpdated: new Date(),
      algorithm: this.config.clusteringAlgorithm,
      parameters: { clusterId },
      confidence: quality.cohesion,
      source: 'semantic_clustering_service'
    };

    return {
      id: `cluster_${clusterId}`,
      name,
      description,
      contentItems,
      centroid,
      topics,
      entities,
      keywords,
      relationships,
      quality,
      metadata
    };
  }

  private extractClusterTopics(contentItems: ContentItem[]): string[] {
    const topicCounts = new Map<string, number>();

    contentItems.forEach(item => {
      const topics = item.metadata?.topics || this.extractTopics(item.content);
      topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    return Array.from(topicCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  private extractClusterEntities(contentItems: ContentItem[]): string[] {
    const entityCounts = new Map<string, number>();

    contentItems.forEach(item => {
      const entities = item.metadata?.entities || this.extractEntities(item.content);
      entities.forEach(entity => {
        entityCounts.set(entity, (entityCounts.get(entity) || 0) + 1);
      });
    });

    return Array.from(entityCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([entity]) => entity);
  }

  private extractClusterKeywords(contentItems: ContentItem[]): string[] {
    const keywordCounts = new Map<string, number>();

    contentItems.forEach(item => {
      const keywords = item.metadata?.keywords || this.extractKeywords(item.content);
      keywords.forEach(keyword => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      });
    });

    return Array.from(keywordCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword]) => keyword);
  }

  private generateClusterName(topics: string[], entities: string[]): string {
    if (topics.length > 0) {
      return topics[0];
    }

    if (entities.length > 0) {
      return entities[0];
    }

    return 'Unbenannter Cluster';
  }

  private generateClusterDescription(contentItems: ContentItem[]): string {
    const types = [...new Set(contentItems.map(item => item.type))];
    const avgLength = contentItems.reduce((sum, item) => sum + item.content.length, 0) / contentItems.length;

    return `Cluster mit ${contentItems.length} Inhalten (${types.join(', ')}), durchschnittliche Länge: ${Math.round(avgLength)} Zeichen.`;
  }

  private calculateClusterQuality(vectors: ContentVector[], centroid: ContentVector): ClusterQuality {
    // Calculate cohesion (average distance to centroid)
    const cohesion = vectors.reduce((sum, vector) => {
      const distance = this.calculateVectorDistance(vector, centroid);
      return sum + distance;
    }, 0) / vectors.length;

    // Simplified separation and silhouette scores
    const separation = 1 - cohesion; // Simplified
    const silhouetteScore = (separation - cohesion) / Math.max(separation, cohesion) || 0;

    const coverage = vectors.length / this.contentVectors.size;
    const density = 1 / (1 + cohesion); // Higher density = lower cohesion

    return {
      cohesion: 1 - cohesion, // Invert so higher is better
      separation,
      silhouetteScore,
      coverage,
      density
    };
  }

  // ===== CLUSTER RELATIONSHIPS =====

  private generateClusterRelationships(
    clusters: SemanticCluster[],
    criteria: ClusteringCriteria
  ): ClusterRelationship[] {
    const relationships: ClusterRelationship[] = [];

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const relationship = this.calculateClusterRelationship(clusters[i], clusters[j], criteria);

        if (relationship.strength >= criteria.minSimilarityScore) {
          relationships.push({
            ...relationship,
            targetClusterId: clusters[j].id
          });

          // Add reverse relationship
          relationships.push({
            targetClusterId: clusters[i].id,
            relationshipType: relationship.relationshipType,
            strength: relationship.strength,
            description: relationship.description.split(' ').reverse().join(' '), // Simple reverse
            sharedTopics: relationship.sharedTopics,
            sharedEntities: relationship.sharedEntities
          });
        }
      }
    }

    return relationships;
  }

  private calculateClusterRelationship(
    cluster1: SemanticCluster,
    cluster2: SemanticCluster,
    criteria: ClusteringCriteria
  ): Omit<ClusterRelationship, 'targetClusterId'> {
    // Calculate shared topics, entities, and keywords
    const sharedTopics = cluster1.topics.filter(topic =>
      cluster2.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    );

    const sharedEntities = cluster1.entities.filter(entity =>
      cluster2.entities.some(e => e.toLowerCase().includes(entity.toLowerCase()))
    );

    const sharedKeywords = cluster1.keywords.filter(keyword =>
      cluster2.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
    );

    // Calculate centroid distance
    const distance = this.calculateVectorDistance(cluster1.centroid, cluster2.centroid);
    const similarity = Math.max(0, 1 - distance);

    // Determine relationship type
    let relationshipType: ClusterRelationship['relationshipType'] = 'related';
    let description = 'Verwandte Themen';

    if (similarity > 0.8) {
      relationshipType = 'similar';
      description = 'Sehr ähnliche Inhalte';
    } else if (sharedTopics.length > sharedEntities.length) {
      relationshipType = 'parent';
      description = 'Übergeordnetes Thema';
    } else if (sharedEntities.length > sharedTopics.length) {
      relationshipType = 'child';
      description = 'Untergeordnetes Thema';
    }

    return {
      relationshipType,
      strength: similarity,
      description,
      sharedTopics,
      sharedEntities
    };
  }

  // ===== UTILITY METHODS =====

  private initializeCentroids(vectors: ContentVector[], k: number): ContentVector[] {
    const centroids: ContentVector[] = [];

    // Random initialization
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * vectors.length);
      centroids.push({ ...vectors[randomIndex] });
    }

    return centroids;
  }

  private assignVectorsToCentroids(vectors: ContentVector[], centroids: ContentVector[]): number[] {
    return vectors.map(vector => {
      let minDistance = Infinity;
      let closestCentroid = 0;

      centroids.forEach((centroid, index) => {
        const distance = this.calculateVectorDistance(vector, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });

      return closestCentroid;
    });
  }

  private updateCentroids(vectors: ContentVector[], assignments: number[], k: number): ContentVector[] {
    const centroids: ContentVector[] = [];

    for (let i = 0; i < k; i++) {
      const clusterVectors = vectors.filter((_, index) => assignments[index] === i);

      if (clusterVectors.length > 0) {
        centroids.push(this.calculateCentroid(clusterVectors));
      } else {
        // Keep existing centroid if cluster is empty
        centroids.push(vectors[Math.floor(Math.random() * vectors.length)]);
      }
    }

    return centroids;
  }

  private centroidsConverged(oldCentroids: ContentVector[], newCentroids: ContentVector[]): boolean {
    const threshold = 0.001;

    for (let i = 0; i < oldCentroids.length; i++) {
      const distance = this.calculateVectorDistance(oldCentroids[i], newCentroids[i]);
      if (distance > threshold) {
        return false;
      }
    }

    return true;
  }

  private findClosestClusters(clusters: ContentVector[][], criteria: ClusteringCriteria): { index1: number; index2: number } {
    let minDistance = Infinity;
    let index1 = 0;
    let index2 = 1;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const centroid1 = this.calculateCentroid(clusters[i]);
        const centroid2 = this.calculateCentroid(clusters[j]);
        const distance = this.calculateVectorDistance(centroid1, centroid2);

        if (distance < minDistance) {
          minDistance = distance;
          index1 = i;
          index2 = j;
        }
      }
    }

    return { index1, index2 };
  }

  private findNeighbors(vector: ContentVector, allVectors: ContentVector[], minSimilarity: number): ContentVector[] {
    return allVectors.filter(other => {
      if (other.id === vector.id) return false;
      const similarity = this.calculateVectorSimilarity(vector, other);
      return similarity >= minSimilarity;
    });
  }

  private calculateCentroid(vectors: ContentVector[]): ContentVector {
    if (vectors.length === 0) {
      return {
        id: 'centroid',
        vector: [],
        dimensions: [],
        magnitude: 0,
        normalized: true
      };
    }

    const dimensions = vectors[0].dimensions;
    const vectorSum = new Array(dimensions.length).fill(0);

    vectors.forEach(vector => {
      vector.vector.forEach((value, index) => {
        vectorSum[index] += value;
      });
    });

    const centroidVector = vectorSum.map(sum => sum / vectors.length);
    const magnitude = Math.sqrt(centroidVector.reduce((sum, val) => sum + val * val, 0));

    return {
      id: 'centroid',
      vector: centroidVector,
      dimensions,
      magnitude,
      normalized: true
    };
  }

  private calculateVectorDistance(vector1: ContentVector, vector2: ContentVector): number {
    if (vector1.vector.length !== vector2.vector.length) {
      return 1; // Maximum distance for incompatible vectors
    }

    let sum = 0;
    for (let i = 0; i < vector1.vector.length; i++) {
      const diff = vector1.vector[i] - vector2.vector[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  private calculateVectorSimilarity(vector1: ContentVector, vector2: ContentVector): number {
    const distance = this.calculateVectorDistance(vector1, vector2);
    return Math.max(0, 1 - distance);
  }

  private getContentItemById(id: string, vectors: ContentVector[]): ContentItem | null {
    // This would need to be implemented to map vectors back to content items
    // For now, return a placeholder
    return null;
  }

  private calculateSemanticSimilarity(item: ContentItem, knowledge: SemanticKnowledge): number {
    const itemText = `${item.title} ${item.content}`.toLowerCase();
    const knowledgeText = `${knowledge.name} ${knowledge.description}`.toLowerCase();

    const itemWords = itemText.split(/\s+/);
    const knowledgeWords = knowledgeText.split(/\s+/);

    const commonWords = itemWords.filter(word => knowledgeWords.includes(word));
    const maxWords = Math.max(itemWords.length, knowledgeWords.length);

    return maxWords > 0 ? commonWords.length / maxWords : 0;
  }

  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/);
    const stopWords = ['der', 'die', 'das', 'und', 'oder', 'mit', 'für', 'von', 'zu', 'im', 'am', 'um'];

    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
      .slice(0, 10);
  }

  private extractEntities(content: string): string[] {
    // Simple entity extraction
    const entities: string[] = [];

    // Organization entities
    const orgPattern = /\b(ZOE Solar|Solar GmbH|Photovoltaik)\b/gi;
    const orgMatches = content.match(orgPattern);
    if (orgMatches) entities.push(...orgMatches);

    // Location entities
    const locationPattern = /\b(Berlin|München|Hamburg|Köln)\b/gi;
    const locationMatches = content.match(locationPattern);
    if (locationMatches) entities.push(...locationMatches);

    return [...new Set(entities)];
  }

  private extractTopics(content: string): string[] {
    const topics: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('photovoltaik') || lowerContent.includes('pv')) {
      topics.push('Photovoltaik');
    }

    if (lowerContent.includes('speicher') || lowerContent.includes('batterie')) {
      topics.push('Stromspeicher');
    }

    if (lowerContent.includes('kosten') || lowerContent.includes('preis')) {
      topics.push('Kosten');
    }

    if (lowerContent.includes('installation') || lowerContent.includes('montage')) {
      topics.push('Installation');
    }

    if (lowerContent.includes('förderung') || lowerContent.includes('zuschuss')) {
      topics.push('Förderungen');
    }

    return topics;
  }

  private getAllKnownKeywords(): string[] {
    return [
      'photovoltaik', 'solar', 'anlage', 'kosten', 'preis', 'installation',
      'förderung', 'speicher', 'strom', 'energie', 'umwelt', 'nachhaltig'
    ];
  }

  private getAllKnownEntities(): string[] {
    return ['ZOE Solar', 'Berlin', 'München', 'Photovoltaik', 'Solaranlage'];
  }

  private getAllKnownTopics(): string[] {
    return ['Photovoltaik', 'Stromspeicher', 'Kosten', 'Installation', 'Förderungen'];
  }

  private postProcessClusters(clusters: SemanticCluster[], targetTopics: string[]): SemanticCluster[] {
    return clusters
      .filter(cluster => cluster.contentItems.length >= this.config.minClusterSize)
      .sort((a, b) => b.quality.cohesion - a.quality.cohesion)
      .slice(0, this.config.maxClusters);
  }

  private generateClusteringMetadata(
    clusters: SemanticCluster[],
    request: ClusteringRequest,
    vectors: ContentVector[]
  ): ClusteringMetadata {
    const totalItems = request.content.length;
    const clusteredItems = clusters.reduce((sum, cluster) => sum + cluster.contentItems.length, 0);
    const averageClusterSize = clusteredItems / clusters.length || 0;
    const averageQuality = clusters.reduce((sum, cluster) => sum + cluster.quality.silhouetteScore, 0) / clusters.length || 0;
    const coverage = clusteredItems / totalItems;

    return {
      timestamp: new Date(),
      version: '1.0.0',
      algorithm: this.config.clusteringAlgorithm,
      parameters: request.clusteringCriteria,
      totalClusters: clusters.length,
      averageClusterSize,
      clusteringQuality: averageQuality,
      coverage
    };
  }

  private generateCacheKey(request: ClusteringRequest): string {
    const contentHash = this.simpleHash(JSON.stringify(request.content.map(c => c.id)));
    const criteriaHash = this.simpleHash(JSON.stringify(request.clusteringCriteria));
    const topicsHash = this.simpleHash(request.targetTopics.join(','));

    return `${contentHash}-${criteriaHash}-${topicsHash}`;
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

  private calculateAverageSimilarity(clusters: SemanticCluster[]): number {
    let totalSimilarity = 0;
    let count = 0;

    clusters.forEach(cluster => {
      cluster.relationships.forEach(rel => {
        totalSimilarity += rel.strength;
        count++;
      });
    });

    return count > 0 ? totalSimilarity / count : 0;
  }

  private estimateMemoryUsage(result: ClusteringResult): number {
    // Rough estimation in bytes
    const clusterSize = result.clusters.length * 1000; // ~1KB per cluster
    const relationshipSize = result.relationships.length * 500; // ~500B per relationship
    const itemSize = result.unclusteredItems.length * 2000; // ~2KB per item

    return clusterSize + relationshipSize + itemSize;
  }

  private createErrorResult(
    request: ClusteringRequest,
    errorMessage: string,
    startTime: number
  ): ClusteringResult {
    return {
      clusters: [],
      unclusteredItems: request.content,
      relationships: [],
      performance: {
        processingTime: Date.now() - startTime,
        totalItems: request.content.length,
        clusteredItems: 0,
        averageSimilarity: 0,
        cacheHitRate: 0,
        errorRate: 1,
        memoryUsage: 0
      },
      metadata: {
        timestamp: new Date(),
        version: '1.0.0',
        algorithm: this.config.clusteringAlgorithm,
        parameters: request.clusteringCriteria,
        totalClusters: 0,
        averageClusterSize: 0,
        clusteringQuality: 0,
        coverage: 0
      }
    };
  }

  private initializeSemanticKnowledgeBase(): void {
    // Initialize with solar energy domain knowledge
    this.semanticKnowledgeBase.set('photovoltaik', {
      id: 'photovoltaik',
      name: 'Photovoltaik',
      description: 'Solarstromerzeugung durch Photovoltaikmodule',
      topics: ['Solarenergie', 'PV-Anlagen', 'Stromerzeugung'],
      entities: ['Photovoltaik', 'Solarpanel', 'Wechselrichter'],
      keywords: ['photovoltaik', 'solar', 'pv', 'panel', 'modul'],
      relationships: ['speicher', 'installation', 'kosten']
    });

    this.semanticKnowledgeBase.set('speicher', {
      id: 'speicher',
      name: 'Stromspeicher',
      description: 'Batteriespeicher für Solarstrom',
      topics: ['Energiespeicher', 'Batterie', 'Stromspeicherung'],
      entities: ['Stromspeicher', 'Batterie', 'Lithium-Ionen'],
      keywords: ['speicher', 'batterie', 'stromspeicher', 'akkumulator'],
      relationships: ['photovoltaik', 'kosten', 'installation']
    });

    this.semanticKnowledgeBase.set('kosten', {
      id: 'kosten',
      name: 'Kosten & Preise',
      description: 'Kostenstruktur für Solaranlagen',
      topics: ['Investition', 'Finanzierung', 'Förderungen'],
      entities: ['Kosten', 'Preis', 'Förderung'],
      keywords: ['kosten', 'preis', 'förderung', 'zuschuss', 'finanzierung'],
      relationships: ['photovoltaik', 'speicher', 'installation']
    });
  }

  // ===== PUBLIC API METHODS =====

  public clearCache(): void {
    this.clusterCache.clear();
    this.contentVectors.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.clusterCache.size,
      hitRate: 0 // Would need to track hits/misses for real hit rate
    };
  }

  public getSemanticKnowledgeBase(): SemanticKnowledge[] {
    return Array.from(this.semanticKnowledgeBase.values());
  }

  public addToKnowledgeBase(knowledge: SemanticKnowledge): void {
    this.semanticKnowledgeBase.set(knowledge.id, knowledge);
  }

  public validateClusteringRequest(request: ClusteringRequest): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!request.content || request.content.length === 0) {
      issues.push('Content array cannot be empty');
    }

    if (!request.targetTopics || request.targetTopics.length === 0) {
      issues.push('At least one target topic is required');
    }

    if (!request.clusteringCriteria) {
      issues.push('Clustering criteria are required');
    }

    if (request.content.length > 1000) {
      issues.push('Too many content items. Maximum allowed: 1000');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// ===== SEMANTIC KNOWLEDGE INTERFACE =====

interface SemanticKnowledge {
  id: string;
  name: string;
  description: string;
  topics: string[];
  entities: string[];
  keywords: string[];
  relationships: string[];
}

// ===== EXPORT =====

export const semanticClusteringService = SemanticClusteringService.getInstance();
export default semanticClusteringService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Perform semantic clustering
 * const result = await semanticClusteringService.performClustering({
 *   content: [
 *     { id: '1', title: 'PV-Anlagen', content: '...', type: 'page' },
 *     { id: '2', title: 'Stromspeicher', content: '...', type: 'product' }
 *   ],
 *   targetTopics: ['Photovoltaik', 'Speicher'],
 *   clusteringCriteria: {
 *     similarityMetrics: ['semantic', 'keyword', 'entity'],
 *     weightSemantic: 0.5,
 *     weightKeyword: 0.3,
 *     weightEntity: 0.2,
 *     minSimilarityScore: 0.6
 *   }
 * });
 *
 * // Get semantic knowledge base
 * const knowledge = semanticClusteringService.getSemanticKnowledgeBase();
 *
 * // Update configuration
 * semanticClusteringService.updateConfig({ clusteringAlgorithm: 'hierarchical' });
 */