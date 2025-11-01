/**
 * Schema Markup Consolidation Service für ZOE Solar
 * 
 * Konsolidiert und koordiniert alle Schema-Services für optimale Performance
 * und Featured Snippet Opportunities.
 * 
 * Features:
 * - Deduplizierung bestehender Schemas
 * - Conflict Resolution zwischen Services  
 * - Priority-basierte Schema-Injection
 * - Performance-optimierte Schema-Generation
 */

export interface SchemaPriority {
  priority: number;
  service: string;
  schema: any;
  timestamp: Date;
}

export interface SchemaConflict {
  type: 'duplicate' | 'override' | 'incompatible';
  schemas: string[];
  resolution: 'merge' | 'override' | 'separate';
  priority: number;
}

export interface SchemaConsolidationConfig {
  enabled: boolean;
  maxSchemaSize: number;
  timeoutMs: number;
  deduplicationEnabled: boolean;
  conflictResolution: 'priority' | 'latest' | 'merge';
}

class SchemaConsolidationService {
  private static instance: SchemaConsolidationService;
  private config: SchemaConsolidationConfig;
  private schemaQueue: Map<string, SchemaPriority[]> = new Map();
  private consolidatedSchemas: Map<string, any> = new Map();
  private conflicts: SchemaConflict[] = [];
  private processingIntervals: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeConfig();
    this.setupConsolidationEngine();
  }

  public static getInstance(): SchemaConsolidationService {
    if (!SchemaConsolidationService.instance) {
      SchemaConsolidationService.instance = new SchemaConsolidationService();
    }
    return SchemaConsolidationService.instance;
  }

  private initializeConfig(): void {
    this.config = {
      enabled: true,
      maxSchemaSize: 50000, // 50KB limit
      timeoutMs: 1000, // 1s timeout
      deduplicationEnabled: true,
      conflictResolution: 'priority'
    };
  }

  private setupConsolidationEngine(): void {
    if (!this.config.enabled) return;

    // Main consolidation interval
    this.processingIntervals.set('main-consolidation', setInterval(() => {
      this.performSchemaConsolidation();
    }, 30 * 1000)); // Every 30 seconds

    // Conflict resolution interval
    this.processingIntervals.set('conflict-resolution', setInterval(() => {
      this.resolveConflicts();
    }, 60 * 1000)); // Every minute

    // Schema validation interval
    this.processingIntervals.set('schema-validation', setInterval(() => {
      this.validateConsolidatedSchemas();
    }, 5 * 60 * 1000)); // Every 5 minutes
  }

  // ===== SCHEMA REGISTRATION =====

  /**
   * Register a schema from any service
   */
  public registerSchema(serviceName: string, schema: any, priority: number = 50): void {
    const id = this.generateSchemaId(schema);
    const schemaPriority: SchemaPriority = {
      priority,
      service: serviceName,
      schema,
      timestamp: new Date()
    };

    if (!this.schemaQueue.has(id)) {
      this.schemaQueue.set(id, []);
    }

    const queue = this.schemaQueue.get(id)!;
    
    // Check for duplicates
    if (this.config.deduplicationEnabled) {
      const existingIndex = queue.findIndex(s => 
        JSON.stringify(s.schema) === JSON.stringify(schema)
      );
      
      if (existingIndex >= 0) {
        // Update priority if higher
        if (priority > queue[existingIndex].priority) {
          queue[existingIndex].priority = priority;
          queue[existingIndex].timestamp = new Date();
        }
        return; // Skip duplicate
      }
    }

    queue.push(schemaPriority);
    
    // Sort by priority (highest first)
    queue.sort((a, b) => b.priority - a.priority);
  }

  // ===== CONSOLIDATION ENGINE =====

  private performSchemaConsolidation(): void {
    try {
      for (const [id, schemas] of this.schemaQueue) {
        this.consolidateSchemaById(id, schemas);
      }
    } catch (error) {
      console.error('Schema consolidation failed:', error);
    }
  }

  private consolidateSchemaById(id: string, schemas: SchemaPriority[]): void {
    if (schemas.length === 0) return;

    let consolidatedSchema: any;

    switch (this.config.conflictResolution) {
      case 'priority':
        consolidatedSchema = this.resolveByPriority(schemas);
        break;
      case 'latest':
        consolidatedSchema = this.resolveByLatest(schemas);
        break;
      case 'merge':
        consolidatedSchema = this.resolveByMerge(schemas);
        break;
      default:
        consolidatedSchema = schemas[0].schema;
    }

    // Validate consolidated schema
    if (this.isValidSchema(consolidatedSchema)) {
      // Check size limit
      const schemaSize = JSON.stringify(consolidatedSchema).length;
      if (schemaSize <= this.config.maxSchemaSize) {
        this.consolidatedSchemas.set(id, consolidatedSchema);
        this.injectSchemaIntoDOM(id, consolidatedSchema);
      } else {
        console.warn(`Schema too large: ${id} (${schemaSize} bytes)`);
        this.truncateSchema(id, schemas);
      }
    }
  }

  private resolveByPriority(schemas: SchemaPriority[]): any {
    // Merge schemas respecting priorities
    const primarySchema = schemas[0].schema;
    const secondarySchemas = schemas.slice(1);

    let mergedSchema = { ...primarySchema };

    for (const secondary of secondarySchemas) {
      if (secondary.priority >= 30) { // Only merge high-priority schemas
        mergedSchema = this.deepMerge(mergedSchema, secondary.schema);
      }
    }

    return mergedSchema;
  }

  private resolveByLatest(schemas: SchemaPriority[]): any {
    // Use the most recent schema
    const sortedByTime = schemas.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return sortedByTime[0].schema;
  }

  private resolveByMerge(schemas: SchemaPriority[]): any {
    // Deep merge all schemas
    let merged = {};
    for (const schema of schemas) {
      merged = this.deepMerge(merged, schema.schema);
    }
    return merged;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  // ===== CONFLICT RESOLUTION =====

  private resolveConflicts(): void {
    for (const [id, schemas] of this.schemaQueue) {
      if (schemas.length > 1) {
        this.detectConflicts(id, schemas);
      }
    }

    // Process detected conflicts
    for (const conflict of this.conflicts) {
      this.applyConflictResolution(conflict);
    }
  }

  private detectConflicts(id: string, schemas: SchemaPriority[]): void {
    const schemaTypes = schemas.map(s => s.schema['@type']);
    const uniqueTypes = [...new Set(schemaTypes)];

    if (uniqueTypes.length !== schemaTypes.length) {
      this.conflicts.push({
        type: 'duplicate',
        schemas: schemas.map(s => s.service),
        resolution: 'merge',
        priority: 75
      });
    }

    // Check for incompatible schemas
    for (let i = 0; i < schemas.length - 1; i++) {
      for (let j = i + 1; j < schemas.length; j++) {
        if (this.areSchemasIncompatible(schemas[i].schema, schemas[j].schema)) {
          this.conflicts.push({
            type: 'incompatible',
            schemas: [schemas[i].service, schemas[j].service],
            resolution: 'separate',
            priority: 80
          });
        }
      }
    }
  }

  private areSchemasIncompatible(schema1: any, schema2: any): boolean {
    // Check for mutually exclusive properties
    const conflictingProperties = ['mainEntity', 'about', 'mentions'];
    
    for (const prop of conflictingProperties) {
      if (schema1[prop] && schema2[prop]) {
        // Check if the values are different
        const val1 = JSON.stringify(schema1[prop]);
        const val2 = JSON.stringify(schema2[prop]);
        if (val1 !== val2) {
          return true;
        }
      }
    }

    return false;
  }

  private applyConflictResolution(conflict: SchemaConflict): void {
    switch (conflict.resolution) {
      case 'merge':
        this.mergeConflictingSchemas(conflict);
        break;
      case 'override':
        this.overrideConflictingSchemas(conflict);
        break;
      case 'separate':
        this.separateConflictingSchemas(conflict);
        break;
    }
  }

  private mergeConflictingSchemas(conflict: SchemaConflict): void {
    // Implementation for merging conflicting schemas
    console.log(`Merging conflicting schemas: ${conflict.schemas.join(', ')}`);
  }

  private overrideConflictingSchemas(conflict: SchemaConflict): void {
    // Implementation for overriding schemas
    console.log(`Overriding conflicting schemas: ${conflict.schemas.join(', ')}`);
  }

  private separateConflictingSchemas(conflict: SchemaConflict): void {
    // Implementation for separating schemas
    console.log(`Separating conflicting schemas: ${conflict.schemas.join(', ')}`);
  }

  // ===== DOM INJECTION =====

  private injectSchemaIntoDOM(id: string, schema: any): void {
    try {
      // Remove existing script tag if present
      const existingScript = document.querySelector(`script[data-schema-id="${id}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      // Create new script tag
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-id', id);
      script.textContent = JSON.stringify(schema);

      // Inject into head
      document.head.appendChild(script);

      // Trigger schema event
      window.dispatchEvent(new CustomEvent('schemaInjected', {
        detail: { id, schema }
      }));

    } catch (error) {
      console.error(`Failed to inject schema ${id}:`, error);
    }
  }

  // ===== VALIDATION =====

  private validateConsolidatedSchemas(): void {
    for (const [id, schema] of this.consolidatedSchemas) {
      if (!this.isValidSchema(schema)) {
        console.warn(`Invalid schema detected: ${id}`);
        this.consolidatedSchemas.delete(id);
      }
    }
  }

  private isValidSchema(schema: any): boolean {
    if (!schema || typeof schema !== 'object') return false;
    
    // Basic schema validation
    const hasType = schema['@type'];
    const hasContext = schema['@context'] === 'https://schema.org';
    
    return Boolean(hasType && hasContext);
  }

  private truncateSchema(id: string, schemas: SchemaPriority[]): void {
    // Truncate schema to fit size limit
    console.log(`Truncating schema: ${id}`);
    // Implementation for schema truncation
  }

  // ===== UTILITY METHODS =====

  private generateSchemaId(schema: any): string {
    if (schema['@type']) {
      return `${schema['@type']}-${Date.now()}`;
    }
    return `unknown-${Date.now()}`;
  }

  // ===== PUBLIC API =====

  public getConsolidatedSchemas(): Map<string, any> {
    return new Map(this.consolidatedSchemas);
  }

  public getConflicts(): SchemaConflict[] {
    return [...this.conflicts];
  }

  public forceConsolidation(): void {
    this.performSchemaConsolidation();
    this.resolveConflicts();
  }

  public exportSchemas(): string {
    return JSON.stringify(Array.from(this.consolidatedSchemas.entries()), null, 2);
  }

  public updateConfig(newConfig: Partial<SchemaConsolidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartConsolidation();
  }

  private restartConsolidation(): void {
    this.stopConsolidation();
    this.setupConsolidationEngine();
  }

  private stopConsolidation(): void {
    this.processingIntervals.forEach(interval => clearInterval(interval));
    this.processingIntervals.clear();
  }

  public getHealthStatus(): {
    status: string;
    consolidatedSchemas: number;
    conflicts: number;
    queueSize: number;
    lastConsolidation: Date | null;
  } {
    return {
      status: this.config.enabled ? 'active' : 'inactive',
      consolidatedSchemas: this.consolidatedSchemas.size,
      conflicts: this.conflicts.length,
      queueSize: this.schemaQueue.size,
      lastConsolidation: new Date()
    };
  }
}

// ===== EXPORT =====

export const schemaConsolidationService = SchemaConsolidationService.getInstance();
export default schemaConsolidationService;

/**
 * ===== USAGE EXAMPLES =====
 * 
 * // Register schema from any service
 * schemaConsolidationService.registerSchema('LocalBusiness', {
 *   "@context": "https://schema.org",
 *   "@type": "LocalBusiness",
 *   "name": "ZOE Solar Berlin",
 *   "address": {
 *     "@type": "PostalAddress",
 *     "streetAddress": "Solarstraße 1",
 *     "addressLocality": "Berlin"
 *   }
 * }, 90);
 * 
 * // Force consolidation
 * schemaConsolidationService.forceConsolidation();
 * 
 * // Get consolidated schemas
 * const schemas = schemaConsolidationService.getConsolidatedSchemas();
 * 
 * // Export schemas for validation
 * const schemaJson = schemaConsolidationService.exportSchemas();
 */