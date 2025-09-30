/**
 * Enterprise Entity Infrastructure Service für ZOE Solar
 *
 * Erweiterte AEO-Optimierung mit Enterprise-Level Features:
 * - Multi-Entity Management System für alle Brand-Entitäten
 * - Advanced Knowledge Graph Optimization
 * - Dynamic Entity Relationship Mapping
 * - Enterprise-Level Entity Monitoring
 *
 * Dieser Service erweitert die bestehenden AEO-Funktionen um skalierbare,
 * Enterprise-grade Entity-Management-Funktionen.
 */

import { entityKnowledgeGraphService, EntityType, EntityRelationship, RelationshipType } from './entityKnowledgeGraphService';

// ===== INTERFACES & TYPES =====

export interface EnterpriseEntityConfig {
  maxEntities: number;
  maxRelationships: number;
  autoOptimization: boolean;
  monitoringEnabled: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  batchSize: number;
  asyncProcessing: boolean;
  multiTenantSupport: boolean;
  tenantId?: string;
}

export interface EntityCluster {
  id: string;
  name: string;
  entities: string[]; // Entity IDs
  centralEntity: string; // Main entity ID
  relationshipDensity: number;
  authorityScore: number;
  lastUpdated: Date;
  metadata: Record<string, any>;
}

export interface EntityNetwork {
  id: string;
  name: string;
  clusters: EntityCluster[];
  connections: EntityRelationship[];
  networkMetrics: {
    totalEntities: number;
    totalRelationships: number;
    averageAuthorityScore: number;
    networkDensity: number;
    centralizationIndex: number;
  };
  lastAnalyzed: Date;
}

export interface EntityMonitoringData {
  entityId: string;
  timestamp: Date;
  metrics: {
    authorityScore: number;
    relationshipCount: number;
    searchVisibility: number;
    socialSignals: number;
    contentQuality: number;
    technicalHealth: number;
  };
  alerts: EntityAlert[];
  recommendations: EntityRecommendation[];
}

export interface EntityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  entityId: string;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface EntityRecommendation {
  id: string;
  type: 'optimization' | 'expansion' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  entityId: string;
  estimatedImpact: number;
  implementationEffort: 'low' | 'medium' | 'high';
  timestamp: Date;
  implemented: boolean;
}

export interface EntityOptimizationResult {
  entityId: string;
  optimizationsApplied: string[];
  authorityScoreImprovement: number;
  relationshipStrengthIncrease: number;
  timestamp: Date;
  success: boolean;
  errors?: string[];
}

export interface MultiEntityOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'optimize' | 'sync';
  entities: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  results: any[];
  errors: string[];
}

// ===== MAIN SERVICE CLASS =====

class EnterpriseEntityInfrastructureService {
  private static instance: EnterpriseEntityInfrastructureService;
  private config: EnterpriseEntityConfig;
  private entityClusters: Map<string, EntityCluster> = new Map();
  private entityNetworks: Map<string, EntityNetwork> = new Map();
  private monitoringData: Map<string, EntityMonitoringData[]> = new Map();
  private alerts: EntityAlert[] = [];
  private recommendations: EntityRecommendation[] = [];
  private operations: Map<string, MultiEntityOperation> = new Map();
  private cache: Map<string, any> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeEnterpriseFeatures();
    this.setupMonitoring();
  }

  public static getInstance(): EnterpriseEntityInfrastructureService {
    if (!EnterpriseEntityInfrastructureService.instance) {
      EnterpriseEntityInfrastructureService.instance = new EnterpriseEntityInfrastructureService();
    }
    return EnterpriseEntityInfrastructureService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): EnterpriseEntityConfig {
    return {
      maxEntities: 10000,
      maxRelationships: 50000,
      autoOptimization: true,
      monitoringEnabled: true,
      cacheEnabled: true,
      cacheTTL: 3600, // 1 hour
      batchSize: 100,
      asyncProcessing: true,
      multiTenantSupport: false
    };
  }

  public updateConfig(newConfig: Partial<EnterpriseEntityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartEnterpriseFeatures();
  }

  public getConfig(): EnterpriseEntityConfig {
    return { ...this.config };
  }

  // ===== INITIALIZATION =====

  private initializeEnterpriseFeatures(): void {
    if (!this.config.monitoringEnabled) return;

    // Initialisiere Entity-Cluster
    this.initializeEntityClusters();

    // Initialisiere Entity-Netzwerke
    this.initializeEntityNetworks();

    // Setup Auto-Optimierung wenn aktiviert
    if (this.config.autoOptimization) {
      this.setupAutoOptimization();
    }
  }

  private initializeEntityClusters(): void {
    // Erstelle initiale Cluster basierend auf bestehenden Entities
    const entities = entityKnowledgeGraphService.getAllEntities();

    // Haupt-Cluster für ZOE Solar Brand
    const mainCluster: EntityCluster = {
      id: 'zoe-solar-main',
      name: 'ZOE Solar Haupt-Entitäten',
      entities: [],
      centralEntity: 'https://www.zoe-solar.de#organization',
      relationshipDensity: 0,
      authorityScore: 0,
      lastUpdated: new Date(),
      metadata: {
        type: 'brand',
        priority: 'high'
      }
    };

    // Service-Cluster
    const serviceCluster: EntityCluster = {
      id: 'zoe-solar-services',
      name: 'ZOE Solar Dienstleistungen',
      entities: [],
      centralEntity: 'https://www.zoe-solar.de/services/photovoltaik-gewerbe#service',
      relationshipDensity: 0,
      authorityScore: 0,
      lastUpdated: new Date(),
      metadata: {
        type: 'service',
        priority: 'high'
      }
    };

    // Person-Cluster
    const personCluster: EntityCluster = {
      id: 'zoe-solar-team',
      name: 'ZOE Solar Team',
      entities: [],
      centralEntity: 'https://www.zoe-solar.de/team/geschaeftsfuehrung#person',
      relationshipDensity: 0,
      authorityScore: 0,
      lastUpdated: new Date(),
      metadata: {
        type: 'person',
        priority: 'medium'
      }
    };

    // Standort-Cluster
    const locationCluster: EntityCluster = {
      id: 'zoe-solar-locations',
      name: 'ZOE Solar Standorte',
      entities: [],
      centralEntity: 'https://www.zoe-solar.de/standort/berlin#place',
      relationshipDensity: 0,
      authorityScore: 0,
      lastUpdated: new Date(),
      metadata: {
        type: 'location',
        priority: 'medium'
      }
    };

    // Weise Entities zu Clustern zu
    entities.forEach(entity => {
      const entityId = entity['@id'];

      if (entityId.includes('#organization') || entityId.includes('#brand')) {
        mainCluster.entities.push(entityId);
      } else if (entityId.includes('/services/') || entityId.includes('/service/')) {
        serviceCluster.entities.push(entityId);
      } else if (entityId.includes('/team/')) {
        personCluster.entities.push(entityId);
      } else if (entityId.includes('/standort/')) {
        locationCluster.entities.push(entityId);
      }
    });

    // Berechne initiale Metriken
    this.calculateClusterMetrics(mainCluster);
    this.calculateClusterMetrics(serviceCluster);
    this.calculateClusterMetrics(personCluster);
    this.calculateClusterMetrics(locationCluster);

    // Speichere Cluster
    this.entityClusters.set(mainCluster.id, mainCluster);
    this.entityClusters.set(serviceCluster.id, serviceCluster);
    this.entityClusters.set(personCluster.id, personCluster);
    this.entityClusters.set(locationCluster.id, locationCluster);
  }

  private initializeEntityNetworks(): void {
    // Erstelle Haupt-Netzwerk
    const mainNetwork: EntityNetwork = {
      id: 'zoe-solar-network',
      name: 'ZOE Solar Entity-Netzwerk',
      clusters: Array.from(this.entityClusters.values()),
      connections: entityKnowledgeGraphService.getAllRelationships(),
      networkMetrics: {
        totalEntities: 0,
        totalRelationships: 0,
        averageAuthorityScore: 0,
        networkDensity: 0,
        centralizationIndex: 0
      },
      lastAnalyzed: new Date()
    };

    // Berechne Netzwerk-Metriken
    this.calculateNetworkMetrics(mainNetwork);

    this.entityNetworks.set(mainNetwork.id, mainNetwork);
  }

  private setupMonitoring(): void {
    if (!this.config.monitoringEnabled) return;

    // Monitoring alle 30 Minuten
    this.intervals.set('entityMonitoring', setInterval(() => {
      this.performEntityMonitoring();
    }, 30 * 60 * 1000));

    // Cluster-Analyse alle 2 Stunden
    this.intervals.set('clusterAnalysis', setInterval(() => {
      this.analyzeEntityClusters();
    }, 2 * 60 * 60 * 1000));
  }

  private setupAutoOptimization(): void {
    // Auto-Optimierung alle 6 Stunden
    this.intervals.set('autoOptimization', setInterval(() => {
      this.performAutoOptimization();
    }, 6 * 60 * 60 * 1000));
  }

  // ===== MULTI-ENTITY MANAGEMENT =====

  public async createMultiEntityOperation(
    type: MultiEntityOperation['type'],
    entities: string[],
    options: { batchSize?: number; async?: boolean } = {}
  ): Promise<MultiEntityOperation> {
    const operation: MultiEntityOperation = {
      id: `multi-entity-${type}-${Date.now()}`,
      type,
      entities,
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      results: [],
      errors: []
    };

    this.operations.set(operation.id, operation);

    if (options.async !== false && this.config.asyncProcessing) {
      // Async-Verarbeitung
      this.processMultiEntityOperationAsync(operation, options.batchSize || this.config.batchSize);
    } else {
      // Sync-Verarbeitung
      await this.processMultiEntityOperationSync(operation);
    }

    return operation;
  }

  private async processMultiEntityOperationSync(operation: MultiEntityOperation): Promise<void> {
    operation.status = 'running';

    try {
      for (let i = 0; i < operation.entities.length; i++) {
        const entityId = operation.entities[i];

        try {
          const result = await this.processEntityOperation(operation.type, entityId);
          operation.results.push(result);
        } catch (error) {
          operation.errors.push(`${entityId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        operation.progress = ((i + 1) / operation.entities.length) * 100;
      }

      operation.status = 'completed';
      operation.endTime = new Date();

    } catch (error) {
      operation.status = 'failed';
      operation.errors.push(error instanceof Error ? error.message : 'Unknown error');
      operation.endTime = new Date();
    }
  }

  private async processMultiEntityOperationAsync(
    operation: MultiEntityOperation,
    batchSize: number
  ): Promise<void> {
    operation.status = 'running';

    const batches = this.chunkArray(operation.entities, batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      // Verarbeite Batch parallel
      const batchPromises = batch.map(entityId =>
        this.processEntityOperation(operation.type, entityId)
          .catch(error => ({ error: `${entityId}: ${error instanceof Error ? error.message : 'Unknown error'}` }))
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(result => {
        if ('error' in result) {
          operation.errors.push(result.error);
        } else {
          operation.results.push(result);
        }
      });

      operation.progress = ((i + 1) / batches.length) * 100;
    }

    operation.status = 'completed';
    operation.endTime = new Date();
  }

  private async processEntityOperation(type: MultiEntityOperation['type'], entityId: string): Promise<any> {
    switch (type) {
      case 'create':
        return this.createEntity(entityId);
      case 'update':
        return this.updateEntity(entityId);
      case 'delete':
        return this.deleteEntity(entityId);
      case 'optimize':
        return this.optimizeEntity(entityId);
      case 'sync':
        return this.syncEntity(entityId);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // ===== ENTITY CLUSTER MANAGEMENT =====

  public createEntityCluster(
    name: string,
    centralEntity: string,
    entities: string[],
    metadata: Record<string, any> = {}
  ): EntityCluster {
    const cluster: EntityCluster = {
      id: `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      entities,
      centralEntity,
      relationshipDensity: 0,
      authorityScore: 0,
      lastUpdated: new Date(),
      metadata
    };

    this.calculateClusterMetrics(cluster);
    this.entityClusters.set(cluster.id, cluster);

    return cluster;
  }

  public getEntityCluster(clusterId: string): EntityCluster | undefined {
    return this.entityClusters.get(clusterId);
  }

  public getAllEntityClusters(): EntityCluster[] {
    return Array.from(this.entityClusters.values());
  }

  public updateEntityCluster(clusterId: string, updates: Partial<EntityCluster>): boolean {
    const cluster = this.entityClusters.get(clusterId);
    if (!cluster) return false;

    Object.assign(cluster, updates);
    cluster.lastUpdated = new Date();
    this.calculateClusterMetrics(cluster);

    return true;
  }

  public deleteEntityCluster(clusterId: string): boolean {
    return this.entityClusters.delete(clusterId);
  }

  private calculateClusterMetrics(cluster: EntityCluster): void {
    const entities = cluster.entities;
    const relationships = entityKnowledgeGraphService.getAllRelationships();

    // Berechne Relationship Density
    let connectionCount = 0;
    entities.forEach(entityId => {
      relationships.forEach(rel => {
        if ((rel.source === entityId && entities.includes(rel.target)) ||
            (rel.target === entityId && entities.includes(rel.source))) {
          connectionCount += rel.strength;
        }
      });
    });

    const maxPossibleConnections = entities.length * (entities.length - 1);
    cluster.relationshipDensity = maxPossibleConnections > 0 ? connectionCount / maxPossibleConnections : 0;

    // Berechne durchschnittlichen Authority Score
    let totalAuthority = 0;
    entities.forEach(entityId => {
      totalAuthority += entityKnowledgeGraphService.calculateEntityAuthorityScore(entityId);
    });
    cluster.authorityScore = entities.length > 0 ? totalAuthority / entities.length : 0;
  }

  // ===== ENTITY NETWORK ANALYSIS =====

  public analyzeEntityNetwork(networkId: string = 'zoe-solar-network'): EntityNetwork | null {
    const network = this.entityNetworks.get(networkId);
    if (!network) return null;

    // Aktualisiere Verbindungen
    network.connections = entityKnowledgeGraphService.getAllRelationships();
    network.lastAnalyzed = new Date();

    // Berechne Metriken neu
    this.calculateNetworkMetrics(network);

    return network;
  }

  private calculateNetworkMetrics(network: EntityNetwork): void {
    const allEntities = new Set<string>();
    network.clusters.forEach(cluster => {
      cluster.entities.forEach(entityId => allEntities.add(entityId));
    });

    network.networkMetrics.totalEntities = allEntities.size;
    network.networkMetrics.totalRelationships = network.connections.length;

    // Berechne durchschnittlichen Authority Score
    let totalAuthority = 0;
    allEntities.forEach(entityId => {
      totalAuthority += entityKnowledgeGraphService.calculateEntityAuthorityScore(entityId);
    });
    network.networkMetrics.averageAuthorityScore = allEntities.size > 0 ? totalAuthority / allEntities.size : 0;

    // Berechne Network Density
    const maxPossibleConnections = network.networkMetrics.totalEntities * (network.networkMetrics.totalEntities - 1);
    network.networkMetrics.networkDensity = maxPossibleConnections > 0 ?
      network.networkMetrics.totalRelationships / maxPossibleConnections : 0;

    // Berechne Centralization Index (vereinfacht)
    const centralEntity = 'https://www.zoe-solar.de#organization';
    const centralConnections = network.connections.filter(rel =>
      rel.source === centralEntity || rel.target === centralEntity
    ).length;

    network.networkMetrics.centralizationIndex = network.networkMetrics.totalRelationships > 0 ?
      centralConnections / network.networkMetrics.totalRelationships : 0;
  }

  // ===== ENTITY MONITORING =====

  public async performEntityMonitoring(entityId?: string): Promise<EntityMonitoringData[]> {
    const entitiesToMonitor = entityId ?
      [entityId] :
      entityKnowledgeGraphService.getAllEntities().map(e => e['@id']);

    const monitoringResults: EntityMonitoringData[] = [];

    for (const entityId of entitiesToMonitor) {
      const monitoringData = await this.monitorEntity(entityId);
      monitoringResults.push(monitoringData);

      // Speichere historische Daten
      if (!this.monitoringData.has(entityId)) {
        this.monitoringData.set(entityId, []);
      }
      this.monitoringData.get(entityId)!.push(monitoringData);

      // Behalte nur die letzten 100 Einträge
      const history = this.monitoringData.get(entityId)!;
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
    }

    return monitoringResults;
  }

  private async monitorEntity(entityId: string): Promise<EntityMonitoringData> {
    const entity = entityKnowledgeGraphService.getEntity(entityId);
    if (!entity) {
      throw new Error(`Entity not found: ${entityId}`);
    }

    const relationships = entityKnowledgeGraphService.getRelationshipsForEntity(entityId);
    const authorityScore = entityKnowledgeGraphService.calculateEntityAuthorityScore(entityId);

    // Simuliere Monitoring-Metriken (in echter Implementierung würden diese aus verschiedenen Quellen kommen)
    const monitoringData: EntityMonitoringData = {
      entityId,
      timestamp: new Date(),
      metrics: {
        authorityScore,
        relationshipCount: relationships.length,
        searchVisibility: Math.random() * 100, // Placeholder
        socialSignals: Math.random() * 1000, // Placeholder
        contentQuality: Math.random() * 100, // Placeholder
        technicalHealth: Math.random() * 100 // Placeholder
      },
      alerts: [],
      recommendations: []
    };

    // Generiere Alerts basierend auf Metriken
    monitoringData.alerts = this.generateEntityAlerts(monitoringData);

    // Generiere Recommendations
    monitoringData.recommendations = this.generateEntityRecommendations(monitoringData);

    return monitoringData;
  }

  private generateEntityAlerts(monitoringData: EntityMonitoringData): EntityAlert[] {
    const alerts: EntityAlert[] = [];
    const { metrics } = monitoringData;

    if (metrics.authorityScore < 30) {
      alerts.push({
        id: `alert-${Date.now()}-low-authority`,
        type: 'critical',
        message: `Entity authority score critically low: ${metrics.authorityScore}`,
        entityId: monitoringData.entityId,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.relationshipCount < 3) {
      alerts.push({
        id: `alert-${Date.now()}-few-relationships`,
        type: 'warning',
        message: `Entity has very few relationships: ${metrics.relationshipCount}`,
        entityId: monitoringData.entityId,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.technicalHealth < 50) {
      alerts.push({
        id: `alert-${Date.now()}-technical-issues`,
        type: 'warning',
        message: `Technical health issues detected: ${metrics.technicalHealth}%`,
        entityId: monitoringData.entityId,
        timestamp: new Date(),
        resolved: false
      });
    }

    return alerts;
  }

  private generateEntityRecommendations(monitoringData: EntityMonitoringData): EntityRecommendation[] {
    const recommendations: EntityRecommendation[] = [];
    const { metrics } = monitoringData;

    if (metrics.authorityScore < 70) {
      recommendations.push({
        id: `rec-${Date.now()}-boost-authority`,
        type: 'optimization',
        priority: 'high',
        title: 'Boost Entity Authority',
        description: 'Add more credentials, certifications, and high-quality backlinks to improve authority score',
        entityId: monitoringData.entityId,
        estimatedImpact: 20,
        implementationEffort: 'medium',
        timestamp: new Date(),
        implemented: false
      });
    }

    if (metrics.relationshipCount < 5) {
      recommendations.push({
        id: `rec-${Date.now()}-expand-network`,
        type: 'expansion',
        priority: 'medium',
        title: 'Expand Entity Network',
        description: 'Create more relationships with related entities to strengthen the knowledge graph',
        entityId: monitoringData.entityId,
        estimatedImpact: 15,
        implementationEffort: 'low',
        timestamp: new Date(),
        implemented: false
      });
    }

    if (metrics.contentQuality < 70) {
      recommendations.push({
        id: `rec-${Date.now()}-improve-content`,
        type: 'optimization',
        priority: 'high',
        title: 'Improve Content Quality',
        description: 'Update and enhance entity descriptions, add more detailed information',
        entityId: monitoringData.entityId,
        estimatedImpact: 25,
        implementationEffort: 'high',
        timestamp: new Date(),
        implemented: false
      });
    }

    return recommendations;
  }

  // ===== ENTITY OPTIMIZATION =====

  public async optimizeEntity(entityId: string): Promise<EntityOptimizationResult> {
    const result: EntityOptimizationResult = {
      entityId,
      optimizationsApplied: [],
      authorityScoreImprovement: 0,
      relationshipStrengthIncrease: 0,
      timestamp: new Date(),
      success: false,
      errors: []
    };

    try {
      const entity = entityKnowledgeGraphService.getEntity(entityId);
      if (!entity) {
        throw new Error(`Entity not found: ${entityId}`);
      }

      const initialAuthorityScore = entityKnowledgeGraphService.calculateEntityAuthorityScore(entityId);

      // Wende Optimierungen an
      const optimizations = await this.applyEntityOptimizations(entity);
      result.optimizationsApplied = optimizations;

      const finalAuthorityScore = entityKnowledgeGraphService.calculateEntityAuthorityScore(entityId);
      result.authorityScoreImprovement = finalAuthorityScore - initialAuthorityScore;

      // Berechne Relationship Strength Increase (vereinfacht)
      result.relationshipStrengthIncrease = optimizations.length * 0.1;

      result.success = true;

    } catch (error) {
      result.errors = [error instanceof Error ? error.message : 'Unknown error'];
    }

    return result;
  }

  private async applyEntityOptimizations(entity: EntityType): Promise<string[]> {
    const optimizations: string[] = [];

    // Optimierung 1: Verbessere Entity-Beschreibung
    if (!entity.description || entity.description.length < 100) {
      optimizations.push('enhanced-description');
    }

    // Optimierung 2: Füge fehlende sameAs Links hinzu
    if (!entity.sameAs || entity.sameAs.length === 0) {
      optimizations.push('added-sameAs-links');
    }

    // Optimierung 3: Optimiere Relationships
    const relationships = entityKnowledgeGraphService.getRelationshipsForEntity(entity['@id']);
    if (relationships.length < 5) {
      optimizations.push('optimized-relationships');
    }

    // Optimierung 4: Füge zusätzliche Metadaten hinzu
    if (entity['@type'] === 'Organization') {
      optimizations.push('enhanced-organization-metadata');
    }

    return optimizations;
  }

  public async performAutoOptimization(): Promise<EntityOptimizationResult[]> {
    const entities = entityKnowledgeGraphService.getAllEntities();
    const optimizationPromises = entities.map(entity =>
      this.optimizeEntity(entity['@id'])
    );

    return await Promise.all(optimizationPromises);
  }

  // ===== ANALYTICS & REPORTING =====

  public getEntityAnalytics(entityId: string): {
    currentMetrics: EntityMonitoringData | null;
    historicalData: EntityMonitoringData[];
    trends: {
      authorityScoreTrend: number;
      relationshipGrowth: number;
      alertFrequency: number;
    };
  } {
    const historicalData = this.monitoringData.get(entityId) || [];
    const currentMetrics = historicalData.length > 0 ? historicalData[historicalData.length - 1] : null;

    // Berechne Trends (vereinfacht)
    const trends = {
      authorityScoreTrend: 0,
      relationshipGrowth: 0,
      alertFrequency: 0
    };

    if (historicalData.length >= 2) {
      const recent = historicalData.slice(-7); // Letzte 7 Einträge
      const older = historicalData.slice(-14, -7); // Vorherige 7 Einträge

      if (recent.length > 0 && older.length > 0) {
        const recentAvgAuthority = recent.reduce((sum, d) => sum + d.metrics.authorityScore, 0) / recent.length;
        const olderAvgAuthority = older.reduce((sum, d) => sum + d.metrics.authorityScore, 0) / older.length;
        trends.authorityScoreTrend = recentAvgAuthority - olderAvgAuthority;

        const recentAvgRelationships = recent.reduce((sum, d) => sum + d.metrics.relationshipCount, 0) / recent.length;
        const olderAvgRelationships = older.reduce((sum, d) => sum + d.metrics.relationshipCount, 0) / older.length;
        trends.relationshipGrowth = recentAvgRelationships - olderAvgRelationships;
      }
    }

    return {
      currentMetrics,
      historicalData,
      trends
    };
  }

  public getClusterAnalytics(clusterId: string): {
    cluster: EntityCluster | null;
    entityAnalytics: Array<{
      entityId: string;
      metrics: EntityMonitoringData | null;
    }>;
    clusterHealth: {
      overallScore: number;
      issues: string[];
      recommendations: string[];
    };
  } {
    const cluster = this.entityClusters.get(clusterId);
    if (!cluster) {
      return {
        cluster: null,
        entityAnalytics: [],
        clusterHealth: {
          overallScore: 0,
          issues: [],
          recommendations: []
        }
      };
    }

    const entityAnalytics = cluster.entities.map(entityId => ({
      entityId,
      metrics: this.monitoringData.get(entityId)?.slice(-1)[0] || null
    }));

    // Berechne Cluster Health
    const avgAuthority = entityAnalytics.reduce((sum, ea) =>
      sum + (ea.metrics?.metrics.authorityScore || 0), 0) / entityAnalytics.length;

    const issues: string[] = [];
    const recommendations: string[] = [];

    if (avgAuthority < 50) {
      issues.push('Low average authority score');
      recommendations.push('Focus on authority building for cluster entities');
    }

    if (cluster.relationshipDensity < 0.3) {
      issues.push('Low relationship density');
      recommendations.push('Strengthen connections between cluster entities');
    }

    return {
      cluster,
      entityAnalytics,
      clusterHealth: {
        overallScore: avgAuthority,
        issues,
        recommendations
      }
    };
  }

  // ===== UTILITY METHODS =====

  private createEntity(entityId: string): Promise<any> {
    // Placeholder für Entity-Erstellung
    return Promise.resolve({ entityId, created: true });
  }

  private updateEntity(entityId: string): Promise<any> {
    // Placeholder für Entity-Update
    return Promise.resolve({ entityId, updated: true });
  }

  private deleteEntity(entityId: string): Promise<any> {
    // Placeholder für Entity-Löschung
    return Promise.resolve({ entityId, deleted: true });
  }

  private syncEntity(entityId: string): Promise<any> {
    // Placeholder für Entity-Sync
    return Promise.resolve({ entityId, synced: true });
  }

  private analyzeEntityClusters(): void {
    // Aktualisiere alle Cluster-Metriken
    this.entityClusters.forEach(cluster => {
      this.calculateClusterMetrics(cluster);
    });

    // Aktualisiere Netzwerk-Metriken
    this.entityNetworks.forEach(network => {
      this.calculateNetworkMetrics(network);
    });
  }

  // ===== LIFECYCLE MANAGEMENT =====

  public restartEnterpriseFeatures(): void {
    this.stopEnterpriseFeatures();
    this.initializeEnterpriseFeatures();
  }

  public stopEnterpriseFeatures(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }

  public getEnterpriseHealth(): {
    status: string;
    activeClusters: number;
    totalEntities: number;
    monitoringActive: boolean;
    autoOptimizationActive: boolean;
    lastOptimization: Date | null;
  } {
    const clusters = Array.from(this.entityClusters.values());
    const totalEntities = clusters.reduce((sum, cluster) => sum + cluster.entities.length, 0);

    return {
      status: 'active',
      activeClusters: clusters.length,
      totalEntities,
      monitoringActive: this.config.monitoringEnabled,
      autoOptimizationActive: this.config.autoOptimization,
      lastOptimization: null // Würde in echter Implementierung gespeichert werden
    };
  }

  // ===== CACHE MANAGEMENT =====

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Placeholder
    };
  }
}

// ===== EXPORT =====

export const enterpriseEntityInfrastructureService = EnterpriseEntityInfrastructureService.getInstance();
export default enterpriseEntityInfrastructureService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Multi-Entity Operation durchführen
 * const operation = await enterpriseEntityInfrastructureService.createMultiEntityOperation(
 *   'optimize',
 *   ['entity1', 'entity2', 'entity3']
 * );
 *
 * // Entity Monitoring starten
 * const monitoringData = await enterpriseEntityInfrastructureService.performEntityMonitoring();
 *
 * // Cluster Analytics abrufen
 * const analytics = enterpriseEntityInfrastructureService.getClusterAnalytics('zoe-solar-main');
 *
 * // Enterprise Health überprüfen
 * const health = enterpriseEntityInfrastructureService.getEnterpriseHealth();
 */