import { singleton } from 'tsyringe';
import { AEOIntegrationService } from './aeoIntegrationService';
import { EntityKnowledgeGraphService } from './entityKnowledgeGraphService';
import { MultiLanguageEntityService } from './multiLanguageEntityService';

export interface PlatformEntity {
  platform: string;
  entityId: string;
  entityName: string;
  entityType: string;
  attributes: Record<string, any>;
  lastUpdated: Date;
  consistencyScore: number;
  optimizationStatus: 'optimized' | 'needs_attention' | 'critical';
}

export interface EntityConsistencyRule {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  checkFunction: (entities: PlatformEntity[]) => ConsistencyIssue[];
  autoFixFunction?: (entities: PlatformEntity[]) => Promise<boolean>;
}

export interface ConsistencyIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  platform: string;
  entityId: string;
  issue: string;
  recommendation: string;
  autoFixable: boolean;
}

export interface EntityUpdateBatch {
  platform: string;
  entityId: string;
  updates: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  scheduledTime?: Date;
}

export interface UnifiedEntity {
  id: string;
  masterEntity: PlatformEntity;
  platformVariants: PlatformEntity[];
  languageVariants: Record<string, any>;
  unifiedAttributes: Record<string, any>;
  consistencyScore: number;
  lastUnified: Date;
}

export interface NAPData {
  name: string;
  address: string;
  phone: string;
  website?: string;
  category?: string;
}

export interface AuthorityCorrelation {
  entityId: string;
  platform: string;
  authorityScore: number;
  correlatedPlatforms: Record<string, number>;
  correlationStrength: number;
  lastCalculated: Date;
}

@singleton()
export class CrossPlatformEntityConsistencyService {
  private platformEntities: Map<string, PlatformEntity[]> = new Map();
  private consistencyRules: EntityConsistencyRule[] = [];
  private updateQueue: EntityUpdateBatch[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private unifiedEntities: Map<string, UnifiedEntity> = new Map();
  private authorityCorrelations: Map<string, AuthorityCorrelation> = new Map();
  private realTimeSyncInterval: NodeJS.Timeout | null = null;

  constructor(
    private aeoIntegrationService: AEOIntegrationService,
    private entityKnowledgeGraphService: EntityKnowledgeGraphService,
    private multiLanguageEntityService: MultiLanguageEntityService
  ) {
    this.initializeConsistencyRules();
    this.startMonitoring();
    this.startRealTimeSync();
  }

  /**
   * Registriert eine neue Plattform für Entity-Management
   */
  async registerPlatform(platform: string, config: {
    apiEndpoint?: string;
    credentials?: Record<string, any>;
    entityTypes: string[];
    updateFrequency: number;
  }): Promise<void> {
    if (!this.platformEntities.has(platform)) {
      this.platformEntities.set(platform, []);
    }

    // Initiale Entity-Synchronisation
    await this.syncPlatformEntities(platform, config);

    // Plattform-spezifische Optimierungen starten
    await this.optimizePlatformEntities(platform, config);
  }

  /**
   * Synchronisiert Entities für eine spezifische Plattform
   */
  private async syncPlatformEntities(platform: string, config: any): Promise<void> {
    try {
      // Simuliere API-Call für Entity-Synchronisation
      const entities = await this.fetchPlatformEntities(platform, config);

      const platformEntities: PlatformEntity[] = entities.map(entity => ({
        platform,
        entityId: entity.id,
        entityName: entity.name,
        entityType: entity.type,
        attributes: entity.attributes,
        lastUpdated: new Date(),
        consistencyScore: this.calculateConsistencyScore(entity),
        optimizationStatus: this.determineOptimizationStatus(entity)
      }));

      this.platformEntities.set(platform, platformEntities);

      // Konsistenz-Check durchführen
      await this.checkEntityConsistency(platform);

    } catch (error) {
      console.error(`Fehler bei der Synchronisation der Plattform ${platform}:`, error);
      throw error;
    }
  }

  /**
   * Fetched Entities von einer Plattform (Mock-Implementierung)
   */
  private async fetchPlatformEntities(platform: string, config: any): Promise<any[]> {
    // Mock-Daten für verschiedene Plattformen
    const mockEntities = {
      'google': [
        { id: '1', name: 'ZOE Solar GmbH', type: 'Organization', attributes: { website: 'https://zoe-solar.de', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } },
        { id: '2', name: 'ZOE Solar Photovoltaik', type: 'Service', attributes: { category: 'Solar Energy', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } }
      ],
      'bing': [
        { id: '1', name: 'ZOE Solar GmbH', type: 'Organization', attributes: { website: 'https://zoe-solar.de', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } },
        { id: '2', name: 'ZOE Solar Photovoltaik', type: 'Service', attributes: { category: 'Solar Energy', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } }
      ],
      'facebook': [
        { id: '1', name: 'ZOE Solar', type: 'Business', attributes: { category: 'Solar Energy Company', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } }
      ],
      'linkedin': [
        { id: '1', name: 'ZOE Solar GmbH', type: 'Organization', attributes: { website: 'https://zoe-solar.de', industry: 'Renewable Energy', address: 'Musterstraße 1, 12345 Musterstadt', phone: '+49 123 456789' } }
      ]
    };

    return mockEntities[platform] || [];
  }

  /**
   * Berechnet Konsistenz-Score für eine Entity
   */
  private calculateConsistencyScore(entity: any): number {
    // Vereinfachte Berechnung basierend auf Attribut-Vollständigkeit
    const requiredAttributes = ['name', 'type'];
    const optionalAttributes = ['website', 'description', 'address'];

    let score = 0;
    requiredAttributes.forEach(attr => {
      if (entity[attr]) score += 25;
    });

    optionalAttributes.forEach(attr => {
      if (entity[attr]) score += 10;
    });

    return Math.min(score, 100);
  }

  /**
   * Bestimmt Optimierungsstatus
   */
  private determineOptimizationStatus(entity: any): 'optimized' | 'needs_attention' | 'critical' {
    const score = this.calculateConsistencyScore(entity);

    if (score >= 80) return 'optimized';
    if (score >= 50) return 'needs_attention';
    return 'critical';
  }

  /**
   * Initialisiert Konsistenz-Regeln
   */
  private initializeConsistencyRules(): void {
    this.consistencyRules = [
      {
        id: 'name_consistency',
        name: 'Entity Name Consistency',
        description: 'Ensures entity names are consistent across platforms',
        platforms: ['google', 'bing', 'facebook', 'linkedin'],
        checkFunction: this.checkNameConsistency.bind(this),
        autoFixFunction: this.fixNameConsistency.bind(this)
      },
      {
        id: 'attribute_consistency',
        name: 'Attribute Consistency',
        description: 'Ensures key attributes are consistent across platforms',
        platforms: ['google', 'bing', 'facebook', 'linkedin'],
        checkFunction: this.checkAttributeConsistency.bind(this),
        autoFixFunction: this.fixAttributeConsistency.bind(this)
      },
      {
        id: 'entity_type_consistency',
        name: 'Entity Type Consistency',
        description: 'Ensures entity types are appropriate for each platform',
        platforms: ['google', 'bing', 'facebook', 'linkedin'],
        checkFunction: this.checkEntityTypeConsistency.bind(this)
      },
      {
        id: 'nap_consistency',
        name: 'NAP Consistency',
        description: 'Ensures Name, Address, Phone consistency across platforms',
        platforms: ['google', 'bing', 'facebook', 'linkedin'],
        checkFunction: this.checkNAPConsistencyRule.bind(this),
        autoFixFunction: this.fixNAPConsistency.bind(this)
      },
      {
        id: 'authority_correlation',
        name: 'Authority Correlation',
        description: 'Ensures authority scores are correlated across platforms',
        platforms: ['google', 'bing', 'facebook', 'linkedin'],
        checkFunction: this.checkAuthorityCorrelation.bind(this)
      }
    ];
  }

  /**
   * Prüft Entity-Konsistenz für eine Plattform
   */
  async checkEntityConsistency(platform: string): Promise<ConsistencyIssue[]> {
    const platformEntities = this.platformEntities.get(platform) || [];
    const allEntities = Array.from(this.platformEntities.values()).flat();

    const issues: ConsistencyIssue[] = [];

    for (const rule of this.consistencyRules) {
      if (rule.platforms.includes(platform)) {
        const ruleIssues = rule.checkFunction(allEntities);
        issues.push(...ruleIssues);
      }
    }

    return issues;
  }

  /**
   * Prüft Namens-Konsistenz
   */
  private checkNameConsistency(entities: PlatformEntity[]): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const nameGroups = new Map<string, PlatformEntity[]>();

    // Gruppiere Entities nach Namen
    entities.forEach(entity => {
      const key = entity.entityName.toLowerCase();
      if (!nameGroups.has(key)) {
        nameGroups.set(key, []);
      }
      nameGroups.get(key)!.push(entity);
    });

    // Prüfe auf Inkonsistenzen
    nameGroups.forEach((groupEntities, name) => {
      if (groupEntities.length > 1) {
        const platforms = groupEntities.map(e => e.platform);
        const uniquePlatforms = [...new Set(platforms)];

        if (uniquePlatforms.length > 1) {
          // Verschiedene Plattformen haben ähnliche Namen
          groupEntities.forEach(entity => {
            issues.push({
              id: `name_consistency_${entity.platform}_${entity.entityId}`,
              severity: 'medium',
              platform: entity.platform,
              entityId: entity.entityId,
              issue: `Entity name "${entity.entityName}" appears on multiple platforms: ${uniquePlatforms.join(', ')}`,
              recommendation: 'Ensure consistent naming across platforms',
              autoFixable: true
            });
          });
        }
      }
    });

    return issues;
  }

  /**
   * Prüft Attribut-Konsistenz
   */
  private checkAttributeConsistency(entities: PlatformEntity[]): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const entityGroups = new Map<string, PlatformEntity[]>();

    // Gruppiere Entities nach ähnlichen Namen
    entities.forEach(entity => {
      const key = entity.entityName.toLowerCase().replace(/\s+/g, '');
      if (!entityGroups.has(key)) {
        entityGroups.set(key, []);
      }
      entityGroups.get(key)!.push(entity);
    });

    entityGroups.forEach((groupEntities, key) => {
      if (groupEntities.length > 1) {
        // Vergleiche Attribute
        const referenceEntity = groupEntities[0];
        const referenceAttrs = referenceEntity.attributes;

        groupEntities.slice(1).forEach(entity => {
          const differingAttrs: string[] = [];

          Object.keys(referenceAttrs).forEach(attr => {
            if (referenceAttrs[attr] !== entity.attributes[attr]) {
              differingAttrs.push(attr);
            }
          });

          if (differingAttrs.length > 0) {
            issues.push({
              id: `attr_consistency_${entity.platform}_${entity.entityId}`,
              severity: 'high',
              platform: entity.platform,
              entityId: entity.entityId,
              issue: `Attributes differ from reference entity: ${differingAttrs.join(', ')}`,
              recommendation: 'Synchronize attributes across platforms',
              autoFixable: true
            });
          }
        });
      }
    });

    return issues;
  }

  /**
   * Prüft Entity-Type-Konsistenz
   */
  private checkEntityTypeConsistency(entities: PlatformEntity[]): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];

    entities.forEach(entity => {
      const platformSpecificTypes = this.getPlatformSpecificTypes(entity.platform);

      if (!platformSpecificTypes.includes(entity.entityType)) {
        issues.push({
          id: `type_consistency_${entity.platform}_${entity.entityId}`,
          severity: 'low',
          platform: entity.platform,
          entityId: entity.entityId,
          issue: `Entity type "${entity.entityType}" is not optimal for ${entity.platform}`,
          recommendation: `Use one of: ${platformSpecificTypes.join(', ')}`,
          autoFixable: false
        });
      }
    });

    return issues;
  }

  /**
   * Gibt plattform-spezifische Entity-Typen zurück
   */
  private getPlatformSpecificTypes(platform: string): string[] {
    const typeMappings = {
      'google': ['Organization', 'LocalBusiness', 'Service', 'Product'],
      'bing': ['Organization', 'LocalBusiness', 'Service'],
      'facebook': ['Business', 'Organization', 'Brand'],
      'linkedin': ['Organization', 'Company', 'EducationalInstitution']
    };

    return typeMappings[platform] || [];
  }

  /**
   * Prüft NAP-Konsistenz-Regel
   */
  private checkNAPConsistencyRule(entities: PlatformEntity[]): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];

    entities.forEach(entity => {
      const napData = this.extractNAPData(entity);
      const napIssues = this.checkNAPConsistency(napData, entity);
      issues.push(...napIssues);
    });

    return issues;
  }

  /**
   * Prüft Authority Correlation
   */
  private async checkAuthorityCorrelation(entities: PlatformEntity[]): Promise<ConsistencyIssue[]> {
    const issues: ConsistencyIssue[] = [];

    for (const entity of entities) {
      try {
        const correlation = await this.calculateAuthorityCorrelation(entity.entityId);

        if (correlation.correlationStrength < 70) {
          issues.push({
            id: `authority_correlation_${entity.platform}_${entity.entityId}`,
            severity: 'medium',
            platform: entity.platform,
            entityId: entity.entityId,
            issue: `Low authority correlation (${correlation.correlationStrength.toFixed(1)}%) across platforms`,
            recommendation: 'Improve consistency to boost authority correlation',
            autoFixable: false
          });
        }
      } catch (error) {
        console.error(`Fehler bei Authority Correlation für ${entity.entityId}:`, error);
      }
    }

    return issues;
  }

  /**
   * Behebt NAP-Inkonsistenzen
   */
  private async fixNAPConsistency(entities: PlatformEntity[]): Promise<boolean> {
    // Sammle alle NAP-Daten
    const napDataMap = new Map<string, NAPData>();

    entities.forEach(entity => {
      const napData = this.extractNAPData(entity);
      napDataMap.set(entity.entityId, napData);
    });

    // Konsolidiere NAP-Daten (verwende die vollständigsten)
    const consolidatedNAP = this.consolidateNAPData(Array.from(napDataMap.values()));

    // Aktualisiere alle Entities mit konsolidierten NAP-Daten
    const updates: EntityUpdateBatch[] = entities.map(entity => ({
      platform: entity.platform,
      entityId: entity.entityId,
      updates: {
        name: consolidatedNAP.name,
        address: consolidatedNAP.address,
        phone: consolidatedNAP.phone,
        website: consolidatedNAP.website,
        category: consolidatedNAP.category
      },
      priority: 'high'
    }));

    this.updateQueue.push(...updates);
    await this.processUpdateQueue();

    return true;
  }

  /**
   * Konsolidiert NAP-Daten
   */
  private consolidateNAPData(napDataList: NAPData[]): NAPData {
    const consolidated: NAPData = {
      name: '',
      address: '',
      phone: '',
      website: '',
      category: ''
    };

    // Verwende die vollständigsten Daten
    napDataList.forEach(nap => {
      if (nap.name && !consolidated.name) consolidated.name = nap.name;
      if (nap.address && !consolidated.address) consolidated.address = nap.address;
      if (nap.phone && !consolidated.phone) consolidated.phone = nap.phone;
      if (nap.website && !consolidated.website) consolidated.website = nap.website;
      if (nap.category && !consolidated.category) consolidated.category = nap.category;
    });

    return consolidated;
  }

  /**
   * Behebt Namens-Inkonsistenzen automatisch
   */
  private async fixNameConsistency(entities: PlatformEntity[]): Promise<boolean> {
    // Vereinfachte Auto-Fix: Verwende den Namen der Entity mit höchstem Konsistenz-Score
    const sortedEntities = entities.sort((a, b) => b.consistencyScore - a.consistencyScore);
    const referenceName = sortedEntities[0].entityName;

    const updates: EntityUpdateBatch[] = entities.slice(1).map(entity => ({
      platform: entity.platform,
      entityId: entity.entityId,
      updates: { name: referenceName },
      priority: 'medium'
    }));

    this.updateQueue.push(...updates);
    await this.processUpdateQueue();

    return true;
  }

  /**
   * Behebt Attribut-Inkonsistenzen automatisch
   */
  private async fixAttributeConsistency(entities: PlatformEntity[]): Promise<boolean> {
    const referenceEntity = entities[0];
    const referenceAttrs = referenceEntity.attributes;

    const updates: EntityUpdateBatch[] = entities.slice(1).map(entity => ({
      platform: entity.platform,
      entityId: entity.entityId,
      updates: referenceAttrs,
      priority: 'high'
    }));

    this.updateQueue.push(...updates);
    await this.processUpdateQueue();

    return true;
  }

  /**
   * Verarbeitet Update-Queue
   */
  private async processUpdateQueue(): Promise<void> {
    const highPriorityUpdates = this.updateQueue.filter(u => u.priority === 'high');
    const mediumPriorityUpdates = this.updateQueue.filter(u => u.priority === 'medium');
    const lowPriorityUpdates = this.updateQueue.filter(u => u.priority === 'low');

    // Verarbeite Updates nach Priorität
    for (const update of [...highPriorityUpdates, ...mediumPriorityUpdates, ...lowPriorityUpdates]) {
      try {
        await this.applyEntityUpdate(update);
      } catch (error) {
        console.error(`Fehler beim Update der Entity ${update.entityId}:`, error);
      }
    }

    // Leere Queue
    this.updateQueue = [];
  }

  /**
   * Wendet Entity-Update an
   */
  private async applyEntityUpdate(update: EntityUpdateBatch): Promise<void> {
    // Mock-Implementierung für Entity-Update
    console.log(`Updating entity ${update.entityId} on ${update.platform}:`, update.updates);

    // Aktualisiere lokale Daten
    const platformEntities = this.platformEntities.get(update.platform) || [];
    const entityIndex = platformEntities.findIndex(e => e.entityId === update.entityId);

    if (entityIndex !== -1) {
      platformEntities[entityIndex] = {
        ...platformEntities[entityIndex],
        ...update.updates,
        lastUpdated: new Date()
      };

      // Aktualisiere Konsistenz-Score
      platformEntities[entityIndex].consistencyScore =
        this.calculateConsistencyScore(platformEntities[entityIndex]);
      platformEntities[entityIndex].optimizationStatus =
        this.determineOptimizationStatus(platformEntities[entityIndex]);
    }
  }

  /**
   * Optimiert Entities für eine spezifische Plattform
   */
  private async optimizePlatformEntities(platform: string, config: any): Promise<void> {
    const entities = this.platformEntities.get(platform) || [];

    for (const entity of entities) {
      if (entity.optimizationStatus !== 'optimized') {
        await this.optimizeEntity(entity, config);
      }
    }
  }

  /**
   * Optimiert eine einzelne Entity
   */
  private async optimizeEntity(entity: PlatformEntity, config: any): Promise<void> {
    // Plattform-spezifische Optimierungen
    switch (entity.platform) {
      case 'google':
        await this.optimizeGoogleEntity(entity);
        break;
      case 'bing':
        await this.optimizeBingEntity(entity);
        break;
      case 'facebook':
        await this.optimizeFacebookEntity(entity);
        break;
      case 'linkedin':
        await this.optimizeLinkedInEntity(entity);
        break;
    }
  }

  /**
   * Optimiert Google Entity
   */
  private async optimizeGoogleEntity(entity: PlatformEntity): Promise<void> {
    // Google-spezifische Optimierungen
    if (!entity.attributes.website) {
      entity.attributes.website = 'https://zoe-solar.de';
    }

    if (entity.entityType === 'Organization' && !entity.attributes.logo) {
      entity.attributes.logo = 'https://zoe-solar.de/logo.png';
    }
  }

  /**
   * Optimiert Bing Entity
   */
  private async optimizeBingEntity(entity: PlatformEntity): Promise<void> {
    // Bing-spezifische Optimierungen
    if (!entity.attributes.description) {
      entity.attributes.description = 'ZOE Solar - Ihr Partner für Photovoltaik und erneuerbare Energien';
    }
  }

  /**
   * Optimiert Facebook Entity
   */
  private async optimizeFacebookEntity(entity: PlatformEntity): Promise<void> {
    // Facebook-spezifische Optimierungen
    if (!entity.attributes.category) {
      entity.attributes.category = 'Solar Energy Company';
    }
  }

  /**
   * Optimiert LinkedIn Entity
   */
  private async optimizeLinkedInEntity(entity: PlatformEntity): Promise<void> {
    // LinkedIn-spezifische Optimierungen
    if (!entity.attributes.industry) {
      entity.attributes.industry = 'Renewable Energy';
    }

    if (!entity.attributes.description) {
      entity.attributes.description = 'ZOE Solar GmbH - Ihr Partner für Photovoltaik und erneuerbare Energien in Deutschland';
    }

    if (entity.entityType === 'Organization' && !entity.attributes.companySize) {
      entity.attributes.companySize = '51-200 employees';
    }
  }

  /**
   * Startet kontinuierliches Monitoring
   */
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.performConsistencyCheck();
    }, 300000); // Alle 5 Minuten
  }

  /**
   * Führt Konsistenz-Check durch
   */
  private async performConsistencyCheck(): Promise<void> {
    for (const [platform, entities] of this.platformEntities) {
      const issues = await this.checkEntityConsistency(platform);

      if (issues.length > 0) {
        // Kritische Issues automatisch beheben
        const criticalIssues = issues.filter(issue => issue.severity === 'critical' && issue.autoFixable);

        for (const issue of criticalIssues) {
          await this.autoFixIssue(issue);
        }

        // Benachrichtigung senden
        await this.notifyConsistencyIssues(issues);
      }
    }
  }

  /**
   * Behebt Issue automatisch
   */
  private async autoFixIssue(issue: ConsistencyIssue): Promise<void> {
    const rule = this.consistencyRules.find(r => issue.id.startsWith(r.id));

    if (rule?.autoFixFunction) {
      const allEntities = Array.from(this.platformEntities.values()).flat();
      await rule.autoFixFunction(allEntities);
    }
  }

  /**
   * Sendet Benachrichtigung über Konsistenz-Probleme
   */
  private async notifyConsistencyIssues(issues: ConsistencyIssue[]): Promise<void> {
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');

    if (criticalIssues.length > 0 || highIssues.length > 0) {
      console.warn('Entity Consistency Issues Detected:', {
        critical: criticalIssues.length,
        high: highIssues.length,
        total: issues.length
      });

      // Integration mit AEO Monitoring
      await this.aeoIntegrationService.logConsistencyIssues(issues);
    }
  }

  /**
   * Gibt Konsistenz-Report zurück
   */
  async getConsistencyReport(): Promise<{
    platforms: string[];
    totalEntities: number;
    consistencyScore: number;
    issues: ConsistencyIssue[];
    recommendations: string[];
  }> {
    const allEntities = Array.from(this.platformEntities.values()).flat();
    const allIssues: ConsistencyIssue[] = [];

    for (const platform of this.platformEntities.keys()) {
      const issues = await this.checkEntityConsistency(platform);
      allIssues.push(...issues);
    }

    const avgConsistencyScore = allEntities.reduce((sum, entity) => sum + entity.consistencyScore, 0) / allEntities.length;

    return {
      platforms: Array.from(this.platformEntities.keys()),
      totalEntities: allEntities.length,
      consistencyScore: avgConsistencyScore,
      issues: allIssues,
      recommendations: this.generateRecommendations(allIssues)
    };
  }

  /**
   * Generiert Empfehlungen basierend auf Issues
   */
  private generateRecommendations(issues: ConsistencyIssue[]): string[] {
    const recommendations: string[] = [];

    const issueTypes = issues.reduce((acc, issue) => {
      acc[issue.issue] = (acc[issue.issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(issueTypes).forEach(([issue, count]) => {
      if (count > 1) {
        recommendations.push(`Address "${issue}" across ${count} entities`);
      }
    });

    return recommendations;
  }

  /**
   * Startet Real-time Sync für Cross-Platform Entities
   */
  private startRealTimeSync(): void {
    this.realTimeSyncInterval = setInterval(async () => {
      await this.performRealTimeSync();
    }, 60000); // Alle Minute
  }

  /**
   * Führt Real-time Sync durch
   */
  private async performRealTimeSync(): Promise<void> {
    for (const platform of this.platformEntities.keys()) {
      try {
        await this.syncPlatformEntities(platform, {});
      } catch (error) {
        console.error(`Real-time Sync fehlgeschlagen für ${platform}:`, error);
      }
    }
  }

  /**
   * Erstellt oder aktualisiert Unified Entity
   */
  async createUnifiedEntity(entityId: string): Promise<UnifiedEntity> {
    const allEntities = this.getAllEntities().filter(e => e.entityId === entityId);
    if (allEntities.length === 0) {
      throw new Error(`Entity ${entityId} nicht gefunden`);
    }

    // Bestimme Master Entity (höchster Konsistenz-Score)
    const masterEntity = allEntities.reduce((best, current) =>
      current.consistencyScore > best.consistencyScore ? current : best
    );

    // Sammle Language Variants
    const languageVariants: Record<string, any> = {};
    const supportedLanguages = ['de', 'en', 'fr', 'es', 'it', 'nl'];

    for (const lang of supportedLanguages) {
      const translated = this.multiLanguageEntityService.getTranslatedEntities(entityId)
        .find(t => t.language === lang);
      if (translated) {
        languageVariants[lang] = {
          name: translated.translatedName,
          description: translated.translatedDescription,
          attributes: translated.translatedAttributes
        };
      }
    }

    // Unified Attributes (konsolidierte Attribute)
    const unifiedAttributes = this.consolidateAttributes(allEntities);

    const unifiedEntity: UnifiedEntity = {
      id: entityId,
      masterEntity,
      platformVariants: allEntities,
      languageVariants,
      unifiedAttributes,
      consistencyScore: this.calculateUnifiedConsistencyScore(allEntities),
      lastUnified: new Date()
    };

    this.unifiedEntities.set(entityId, unifiedEntity);
    return unifiedEntity;
  }

  /**
   * Konsolidiert Attribute aus verschiedenen Plattformen
   */
  private consolidateAttributes(entities: PlatformEntity[]): Record<string, any> {
    const consolidated: Record<string, any> = {};

    // Sammle alle einzigartigen Attribute
    const allKeys = new Set<string>();
    entities.forEach(entity => {
      Object.keys(entity.attributes).forEach(key => allKeys.add(key));
    });

    // Konsolidiere Werte (verwende den Wert mit der höchsten Konsistenz)
    allKeys.forEach(key => {
      const values = entities
        .map(entity => ({ value: entity.attributes[key], score: entity.consistencyScore }))
        .filter(item => item.value !== undefined);

      if (values.length > 0) {
        // Verwende den Wert der Entity mit höchstem Score
        const bestValue = values.reduce((best, current) =>
          current.score > best.score ? current : best
        );
        consolidated[key] = bestValue.value;
      }
    });

    return consolidated;
  }

  /**
   * Berechnet Unified Consistency Score
   */
  private calculateUnifiedConsistencyScore(entities: PlatformEntity[]): number {
    if (entities.length === 0) return 0;

    const avgScore = entities.reduce((sum, entity) => sum + entity.consistencyScore, 0) / entities.length;
    const platformCoverage = entities.length / this.platformEntities.size;

    // Bonus für vollständige Plattform-Abdeckung
    const coverageBonus = platformCoverage === 1 ? 20 : platformCoverage * 10;

    return Math.min(avgScore + coverageBonus, 100);
  }

  /**
   * Führt automated NAP Consistency Checks durch
   */
  async performNAPConsistencyCheck(): Promise<{
    napIssues: ConsistencyIssue[];
    napScore: number;
  }> {
    const napIssues: ConsistencyIssue[] = [];
    const allEntities = this.getAllEntities();

    for (const entity of allEntities) {
      const napData = this.extractNAPData(entity);
      const napIssuesForEntity = await this.checkNAPConsistency(napData, entity);
      napIssues.push(...napIssuesForEntity);
    }

    const napScore = this.calculateNAPScore(napIssues);

    return { napIssues, napScore };
  }

  /**
   * Extrahiert NAP-Daten aus Entity
   */
  private extractNAPData(entity: PlatformEntity): NAPData {
    return {
      name: entity.entityName,
      address: entity.attributes.address || '',
      phone: entity.attributes.phone || '',
      website: entity.attributes.website || '',
      category: entity.attributes.category || ''
    };
  }

  /**
   * Prüft NAP-Konsistenz
   */
  private async checkNAPConsistency(napData: NAPData, entity: PlatformEntity): Promise<ConsistencyIssue[]> {
    const issues: ConsistencyIssue[] = [];

    // Prüfe auf fehlende NAP-Elemente
    if (!napData.name) {
      issues.push({
        id: `nap_missing_name_${entity.platform}_${entity.entityId}`,
        severity: 'high',
        platform: entity.platform,
        entityId: entity.entityId,
        issue: 'Entity fehlt Name (NAP consistency)',
        recommendation: 'Füge einen Namen hinzu',
        autoFixable: false
      });
    }

    if (!napData.address) {
      issues.push({
        id: `nap_missing_address_${entity.platform}_${entity.entityId}`,
        severity: 'high',
        platform: entity.platform,
        entityId: entity.entityId,
        issue: 'Entity fehlt Adresse (NAP consistency)',
        recommendation: 'Füge eine Adresse hinzu',
        autoFixable: false
      });
    }

    if (!napData.phone) {
      issues.push({
        id: `nap_missing_phone_${entity.platform}_${entity.entityId}`,
        severity: 'medium',
        platform: entity.platform,
        entityId: entity.entityId,
        issue: 'Entity fehlt Telefonnummer (NAP consistency)',
        recommendation: 'Füge eine Telefonnummer hinzu',
        autoFixable: false
      });
    }

    return issues;
  }

  /**
   * Berechnet NAP-Score
   */
  private calculateNAPScore(issues: ConsistencyIssue[]): number {
    const totalChecks = this.getAllEntities().length * 3; // Name, Address, Phone
    const failedChecks = issues.length;

    return Math.max(0, ((totalChecks - failedChecks) / totalChecks) * 100);
  }

  /**
   * Berechnet Cross-Platform Authority Correlation
   */
  async calculateAuthorityCorrelation(entityId: string): Promise<AuthorityCorrelation> {
    const entity = this.getAllEntities().find(e => e.entityId === entityId);
    if (!entity) {
      throw new Error(`Entity ${entityId} nicht gefunden`);
    }

    const authorityScore = await this.multiLanguageEntityService.calculateLanguageAuthorityScore(entityId, 'de');
    const correlatedPlatforms: Record<string, number> = {};

    // Korrelation mit anderen Plattformen berechnen
    for (const [platform, entities] of this.platformEntities) {
      const platformEntity = entities.find(e => e.entityId === entityId);
      if (platformEntity) {
        correlatedPlatforms[platform] = platformEntity.consistencyScore;
      }
    }

    const correlationStrength = this.calculateCorrelationStrength(authorityScore.authorityScore, correlatedPlatforms);

    const correlation: AuthorityCorrelation = {
      entityId,
      platform: entity.platform,
      authorityScore: authorityScore.authorityScore,
      correlatedPlatforms,
      correlationStrength,
      lastCalculated: new Date()
    };

    this.authorityCorrelations.set(entityId, correlation);
    return correlation;
  }

  /**
   * Berechnet Korrelationsstärke
   */
  private calculateCorrelationStrength(baseScore: number, correlatedScores: Record<string, number>): number {
    const scores = Object.values(correlatedScores);
    if (scores.length === 0) return 0;

    const avgCorrelation = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgCorrelation, 2), 0) / scores.length;

    // Niedrige Varianz = hohe Korrelation
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  /**
   * Gibt alle Unified Entities zurück
   */
  getUnifiedEntities(): UnifiedEntity[] {
    return Array.from(this.unifiedEntities.values());
  }

  /**
   * Gibt Authority Correlations zurück
   */
  getAuthorityCorrelations(): AuthorityCorrelation[] {
    return Array.from(this.authorityCorrelations.values());
  }

  /**
   * Stoppt Monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.realTimeSyncInterval) {
      clearInterval(this.realTimeSyncInterval);
      this.realTimeSyncInterval = null;
    }
  }

  /**
   * Gibt alle verwalteten Entities zurück
   */
  getAllEntities(): PlatformEntity[] {
    return Array.from(this.platformEntities.values()).flat();
  }

  /**
   * Gibt Entities für eine spezifische Plattform zurück
   */
  getPlatformEntities(platform: string): PlatformEntity[] {
    return this.platformEntities.get(platform) || [];
  }
}
// Singleton-Instanz
export const crossPlatformEntityConsistencyService = new CrossPlatformEntityConsistencyService();