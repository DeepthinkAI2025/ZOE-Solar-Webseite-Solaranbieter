/**
 * Advanced State Consistency Manager
 * Ensures data consistency across components, API responses, and local storage with conflict resolution
 */

export interface StateConsistencyConfig {
  enablePersistence: boolean;
  enableConflictResolution: boolean;
  enableOptimisticUpdates: boolean;
  enableRealtimeSync: boolean;
  storageKey: string;
  maxRetries: number;
  syncInterval: number;
  conflictResolution: 'client' | 'server' | 'last-write-wins' | 'custom';
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB' | 'hybrid';
}

export interface StateSnapshot {
  id: string;
  timestamp: number;
  version: number;
  data: Record<string, unknown>;
  metadata: {
    source: string;
    userId?: string;
    sessionId: string;
    checksum: string;
    dependencies: string[];
  };
}

export interface ConflictEvent {
  id: string;
  timestamp: number;
  type: 'concurrent-modification' | 'schema-conflict' | 'validation-error' | 'sync-failure';
  source: string;
  target: string;
  data: {
    currentValue: unknown;
    incomingValue: unknown;
    path: string;
    schema?: unknown;
    validation?: unknown;
  };
  resolution?: {
    strategy: string;
    resolvedValue: unknown;
    timestamp: number;
    automatic: boolean;
  };
}

export interface ConsistencyReport {
  timestamp: Date;
  overallScore: number;
  stateHealth: {
    totalNodes: number;
    healthyNodes: number;
    inconsistentNodes: number;
    orphanedNodes: number;
    circularDependencies: string[];
  };
  conflicts: ConflictEvent[];
  sync: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    avgSyncTime: number;
    lastSyncTimestamp: Date;
  };
  performance: {
    stateSize: number;
    memoryUsage: number;
    compressionRatio: number;
    accessPatterns: Record<string, number>;
    bottlenecks: string[];
  };
  recommendations: string[];
}

export interface StateManagerConfig {
  initialState: Record<string, unknown>;
  schema: Record<string, unknown>;
  validators: Record<string, (value: unknown) => boolean>;
  transformers: Record<string, (value: unknown) => unknown>;
  middleware: Array<(state: unknown, action: unknown, next: () => void) => void>;
  persistence: {
    enabled: boolean;
    storage: 'localStorage' | 'sessionStorage' | 'indexedDB';
    compression: boolean;
    encryption: boolean;
    ttl?: number;
  };
}

interface StateNode {
  path: string;
  value: unknown;
  timestamp: number;
  version: number;
  dependencies: string[];
  validators: string[];
  subscribers: Set<(value: unknown, previous: unknown) => void>;
  lastModified: number;
  checksum: string;
}

class StateManager {
  private config: StateManagerConfig;
  private state: Map<string, StateNode> = new Map();
  private history: StateSnapshot[] = [];
  private conflicts: ConflictEvent[] = [];
  private middleware: Array<(state: unknown, action: unknown, next: () => void) => void> = [];
  private subscribers: Map<string, Set<(value: unknown, previous: unknown) => void>> = new Map();
  private syncQueue: Array<{ action: unknown; timestamp: number; retries: number }> = [];
  private isProcessing: boolean = false;
  private lastSyncTime: number = 0;

  constructor(config?: Partial<StateManagerConfig>) {
    this.config = {
      initialState: {},
      schema: {},
      validators: {},
      transformers: {},
      middleware: [],
      persistence: {
        enabled: true,
        storage: 'localStorage',
        compression: false,
        encryption: false,
      },
      ...config,
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    console.log('Initializing State Consistency Manager...');

    // Load initial state
    if (this.config.persistence.enabled) {
      await this.loadPersistedState();
    }

    // Set up initial state
    if (Object.keys(this.config.initialState).length > 0) {
      Object.entries(this.config.initialState).forEach(([path, value]) => {
        this.createStateNode(path, value, 'initialization');
      });
    }

    // Start sync processing
    this.startSyncProcessor();

    // Start periodic consistency checks
    this.startConsistencyChecker();

    // Set up event listeners for page visibility
    this.setupEventListeners();
  }

  public getState(path?: string): unknown {
    if (!path) {
      return this.rebuildStateObject();
    }

    const node = this.state.get(path);
    return node ? node.value : undefined;
  }

  public setState(path: string, value: unknown, options?: {
    source?: string;
    validate?: boolean;
    transform?: boolean;
    persist?: boolean;
    optimistic?: boolean;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const currentValue = this.getState(path);

        // Create action object
        const action = {
          type: 'SET_STATE',
          path,
          value,
          currentValue,
          timestamp: Date.now(),
          source: options?.source || 'unknown',
          validate: options?.validate !== false,
          transform: options?.transform !== false,
          persist: options?.persist !== false,
          optimistic: options?.optimistic || false,
        };

        // Add to sync queue
        this.syncQueue.push({
          action,
          timestamp: Date.now(),
          retries: 0,
        });

        // Process immediately if optimistic update
        if (action.optimistic) {
          this.applyAction(action);
        }

        resolve();
      } catch (_error) {
        reject(_error);
      }
    });
  }

  public subscribe(path: string, callback: (value: unknown, previous: unknown) => void): () => void {
    if (!this.subscribers.has(path)) {
      this.subscribers.set(path, new Set());
    }

    const subscribers = this.subscribers.get(path)!;
    subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(path);
      }
    };
  }

  public async validateState(): Promise<boolean> {
    const _conflicts: ConflictEvent[] = [];

    // Validate schema
    for (const [path, node] of this.state.entries()) {
      const schema = this.config.schema[path];
      if (schema) {
        try {
          this.validateAgainstSchema(node.value, schema, path);
        } catch (error) {
          _conflicts.push(this.createConflictEvent('schema-conflict', path, node.value, error));
        }
      }

      // Validate with custom validators
      const validators = this.config.validators[path];
      if (validators) {
        try {
          validators(node.value);
        } catch (error) {
          _conflicts.push(this.createConflictEvent('validation-error', path, node.value, error));
        }
      }
    }

    // Check for circular dependencies
    const circularDependencies = this.detectCircularDependencies();
    for (const cycle of circularDependencies) {
      _conflicts.push(this.createConflictEvent('validation-error', cycle.join(' -> '), null, new Error('Circular dependency detected')));
    }

    this.conflicts.push(..._conflicts);
    return _conflicts.length === 0;
  }

  public async syncWithServer(syncData?: Record<string, unknown>): Promise<void> {
    console.log('Starting server synchronization...');

    try {
      // If sync data provided, merge with local state
      if (syncData) {
        await this.mergeServerState(syncData);
      } else {
        // Otherwise, push local state to server
        await this.pushStateToServer();
      }

      this.lastSyncTime = Date.now();
      console.log('Server synchronization completed successfully');
    } catch (_error) {
      const conflict = this.createConflictEvent('sync-failure', 'server', null, _error);
      this.conflicts.push(conflict);
      throw _error;
    }
  }

  public async generateConsistencyReport(): Promise<ConsistencyReport> {
    const stateHealth = this.analyzeStateHealth();
    const sync = this.analyzeSyncStatus();
    const performance = await this.analyzePerformance();
    const recommendations = this.generateRecommendations(stateHealth, sync, performance);
    const overallScore = this.calculateOverallScore(stateHealth, sync, performance);

    return {
      timestamp: new Date(),
      overallScore,
      stateHealth,
      conflicts: this.conflicts,
      sync,
      performance,
      recommendations,
    };
  }

  private createStateNode(path: string, value: unknown, _source: string): void {
    const node: StateNode = {
      path,
      value,
      timestamp: Date.now(),
      version: 1,
      dependencies: this.extractDependencies(value),
      validators: this.getValidatorsForPath(path),
      subscribers: new Set(),
      lastModified: Date.now(),
      checksum: this.calculateChecksum(value),
    };

    this.state.set(path, node);
  }

  private updateStateNode(path: string, value: unknown, _source: string): StateNode {
    const existingNode = this.state.get(path);
    const version = existingNode ? existingNode.version + 1 : 1;

    const updatedNode: StateNode = {
      path,
      value,
      timestamp: Date.now(),
      version,
      dependencies: this.extractDependencies(value),
      validators: this.getValidatorsForPath(path),
      subscribers: existingNode?.subscribers || new Set(),
      lastModified: Date.now(),
      checksum: this.calculateChecksum(value),
    };

    this.state.set(path, updatedNode);
    return updatedNode;
  }

  private extractDependencies(value: unknown): string[] {
    // Simple dependency extraction - in real implementation would be more sophisticated
    const dependencies: string[] = [];

    if (typeof value === 'object' && value !== null) {
      for (const [_key, val] of Object.entries(value)) {
        if (typeof val === 'string' && val.startsWith('state:')) {
          dependencies.push(val.substring(6)); // Remove 'state:' prefix
        }
      }
    }

    return dependencies;
  }

  private getValidatorsForPath(path: string): string[] {
    // Return validator keys that apply to this path
    const validators: string[] = [];

    Object.keys(this.config.validators).forEach(validatorKey => {
      if (path.startsWith(validatorKey)) {
        validators.push(validatorKey);
      }
    });

    return validators;
  }

  private calculateChecksum(value: unknown): string {
    // Simple checksum calculation - in real implementation would use proper hashing
    const str = JSON.stringify(value);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private async applyAction(action: unknown): Promise<void> {
    const { path, value, currentValue, timestamp: _timestamp, source, validate, transform, persist, optimistic: _optimistic } = action as {
      type: string;
      path: string;
      value: unknown;
      currentValue: unknown;
      timestamp: number;
      source: string;
      validate: boolean;
      transform: boolean;
      persist: boolean;
      optimistic: boolean;
    };

    try {
      // Apply middleware
      await this.applyMiddleware(action);

      // Transform value if needed
      let finalValue = value;
      if (transform && this.config.transformers[path]) {
        finalValue = this.config.transformers[path](value);
      }

      // Validate value if needed
      if (validate) {
        await this.validateValue(path, finalValue);
      }

      // Update state
      const _updatedNode = this.updateStateNode(path, finalValue, source);

      // Notify subscribers
      this.notifySubscribers(path, finalValue, currentValue);

      // Persist if needed
      if (persist && this.config.persistence.enabled) {
        await this.persistState();
      }

      // Create snapshot for history
      this.createSnapshot(`${(action as { type: string }).type}_${path}`);

    } catch (_error) {
      console.error(`Failed to apply action for path ${path}:`, _error);
      throw _error;
    }
  }

  private async applyMiddleware(action: unknown): Promise<void> {
    for (const middleware of this.config.middleware) {
      await new Promise<void>((resolve, _reject) => {
        middleware(this.rebuildStateObject(), action, resolve);
      });
    }
  }

  private async validateValue(path: string, value: unknown): Promise<void> {
    // Schema validation
    const schema = this.config.schema[path];
    if (schema) {
      this.validateAgainstSchema(value, schema, path);
    }

    // Custom validation
    const validators = this.config.validators[path];
    if (validators) {
      validators(value);
    }
  }

  private validateAgainstSchema(value: unknown, schema: unknown, path: string): void {
    const schemaObj = schema as { type?: string; required?: boolean };
    if (schemaObj.type && typeof value !== schemaObj.type) {
      throw new Error(`Type mismatch for ${path}: expected ${schemaObj.type}, got ${typeof value}`);
    }

    if (schemaObj.required && (value === null || value === undefined)) {
      throw new Error(`Required field ${path} is missing`);
    }
  }

  private notifySubscribers(path: string, newValue: unknown, previousValue: unknown): void {
    // Notify direct subscribers
    const subscribers = this.subscribers.get(path);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(newValue, previousValue);
        } catch (_error) {
          console.error(`Error in subscriber for path ${path}:`, _error);
        }
      });
    }

    // Notify parent path subscribers
    const parentPath = path.split('.').slice(0, -1).join('.');
    if (parentPath) {
      this.notifySubscribers(parentPath, this.getState(parentPath), previousValue);
    }
  }

  private async persistState(): Promise<void> {
    const stateData = this.rebuildStateObject();

    try {
      let serializedData = JSON.stringify(stateData);

      // Apply compression if enabled
      if (this.config.persistence.compression) {
        serializedData = await this.compressData(serializedData);
      }

      // Apply encryption if enabled
      if (this.config.persistence.encryption) {
        serializedData = await this.encryptData(serializedData);
      }

      // Store in configured storage
      if (this.config.persistence.storage === 'localStorage') {
        localStorage.setItem('app-state', serializedData);
      } else if (this.config.persistence.storage === 'sessionStorage') {
        sessionStorage.setItem('app-state', serializedData);
      }
      // In real implementation, would handle IndexedDB as well

    } catch (_error) {
      console.error('Failed to persist state:', _error);
      throw _error;
    }
  }

  private async loadPersistedState(): Promise<void> {
    try {
      let serializedData = '{}';

      // Load from configured storage
      if (this.config.persistence.storage === 'localStorage') {
        serializedData = localStorage.getItem('app-state') || '{}';
      } else if (this.config.persistence.storage === 'sessionStorage') {
        serializedData = sessionStorage.getItem('app-state') || '{}';
      }

      // Decrypt if needed
      if (this.config.persistence.encryption && serializedData) {
        serializedData = await this.decryptData(serializedData);
      }

      // Decompress if needed
      if (this.config.persistence.compression && serializedData) {
        serializedData = await this.decompressData(serializedData);
      }

      // Parse and load state
      const persistedState = JSON.parse(serializedData);
      Object.entries(persistedState).forEach(([path, value]) => {
        this.createStateNode(path, value, 'persistence');
      });

      console.log('Persisted state loaded successfully');
    } catch (_error) {
      console.error('Failed to load persisted state:', _error);
      // Continue with empty state on error
    }
  }

  private async compressData(data: string): Promise<string> {
    // Simple compression simulation - in real implementation would use proper compression
    return btoa(data);
  }

  private async decompressData(compressedData: string): Promise<string> {
    // Simple decompression simulation
    return atob(compressedData);
  }

  private async encryptData(data: string): Promise<string> {
    // Simple encryption simulation - in real implementation would use proper encryption
    return data; // Would be encrypted
  }

  private async decryptData(encryptedData: string): Promise<string> {
    // Simple decryption simulation
    return encryptedData; // Would be decrypted
  }

  private createSnapshot(actionId: string): void {
    const snapshot: StateSnapshot = {
      id: `snapshot-${Date.now()}`,
      timestamp: Date.now(),
      version: this.history.length + 1,
      data: this.rebuildStateObject(),
      metadata: {
        source: actionId,
        sessionId: this.getSessionId(),
        checksum: this.calculateChecksum(this.rebuildStateObject()),
        dependencies: Array.from(this.state.keys()),
      },
    };

    this.history.push(snapshot);

    // Limit history size
    if (this.history.length > 100) {
      this.history = this.history.slice(-50);
    }
  }

  private getSessionId(): string {
    // Return or create session ID
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  private rebuildStateObject(): Record<string, unknown> {
    const state: Record<string, unknown> = {};

    for (const [path, node] of this.state.entries()) {
      this.setNestedValue(state, path, node.value);
    }

    return state;
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      current[lastKey] = value;
    }
  }

  private createConflictEvent(
    type: ConflictEvent['type'],
    target: string,
    currentValue: unknown,
    error: unknown
  ): ConflictEvent {
    return {
      id: `conflict-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      source: 'validation',
      target,
      data: {
        currentValue,
        incomingValue: currentValue,
        path: target,
        validation: (error as { message: string }).message,
      },
    };
  }

  private detectCircularDependencies(): string[][] {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cycles: string[][] = [];

    const detectCycle = (path: string, pathStack: string[]): void => {
      if (visited.has(path)) return;

      visited.add(path);
      recursionStack.add(path);
      pathStack.push(path);

      const node = this.state.get(path);
      if (node) {
        for (const dependency of node.dependencies) {
          if (recursionStack.has(dependency)) {
            // Found a cycle
            const cycleStart = pathStack.indexOf(dependency);
            cycles.push(pathStack.slice(cycleStart));
          } else {
            detectCycle(dependency, [...pathStack]);
          }
        }
      }

      recursionStack.delete(path);
      pathStack.pop();
    };

    for (const path of this.state.keys()) {
      if (!visited.has(path)) {
        detectCycle(path, []);
      }
    }

    return cycles;
  }

  private startSyncProcessor(): void {
    setInterval(async () => {
      if (!this.isProcessing && this.syncQueue.length > 0) {
        this.isProcessing = true;
        await this.processSyncQueue();
        this.isProcessing = false;
      }
    }, 100); // Process every 100ms
  }

  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const queueItem = this.syncQueue.shift()!;

      try {
        await this.applyAction(queueItem.action);
      } catch (_error) {
        console.error('Failed to process action:', _error);

        // Retry logic
        if (queueItem.retries < 3) {
          queueItem.retries++;
          queueItem.timestamp = Date.now();
          this.syncQueue.unshift(queueItem);
        }
      }
    }
  }

  private startConsistencyChecker(): void {
    setInterval(async () => {
      try {
        await this.validateState();
      } catch (_error) {
        console.error('Consistency check failed:', _error);
      }
    }, 60000); // Check every minute
  }

  private setupEventListeners(): void {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, check for state consistency
        try {
          await this.validateState();
        } catch (_error) {
          console.error('Visibility consistency check failed:', _error);
        }
      }
    });

    // Handle beforeunload for saving state
    window.addEventListener('beforeunload', async () => {
      if (this.config.persistence.enabled) {
        try {
          await this.persistState();
        } catch (_error) {
          console.error('Failed to save state before unload:', _error);
        }
      }
    });
  }

  private async mergeServerState(serverState: Record<string, unknown>): Promise<void> {
    const _conflicts: ConflictEvent[] = [];

    for (const [path, serverValue] of Object.entries(serverState)) {
      const localValue = this.getState(path);
      const localNode = this.state.get(path);

      if (localNode && localValue !== serverValue) {
        // Conflict detected
        const conflict = this.createConflictEvent('concurrent-modification', path, localValue, null);
        conflict.data.incomingValue = serverValue;
        conflict.source = 'server';

        // Resolve conflict based on strategy
        const resolvedValue = this.resolveConflict(localValue, serverValue, conflict);
        conflict.resolution = {
          strategy: this.getConflictResolutionStrategy(),
          resolvedValue,
          timestamp: Date.now(),
          automatic: true,
        };

        _conflicts.push(conflict);
        await this.setState(path, resolvedValue, { source: 'server', validate: false });
      } else if (!localNode) {
        // New value from server
        await this.setState(path, serverValue, { source: 'server', validate: false });
      }
    }

    if (_conflicts.length > 0) {
      this.conflicts.push(..._conflicts);
      console.log(`Resolved ${_conflicts.length} conflicts during server sync`);
    }
  }

  private async pushStateToServer(): Promise<void> {
    const currentState = this.rebuildStateObject();

    // In real implementation, would send to actual server
    console.log('Pushing state to server:', currentState);
  }

  private resolveConflict(localValue: unknown, serverValue: unknown, conflict: ConflictEvent): unknown {
    const strategy = this.getConflictResolutionStrategy();

    switch (strategy) {
      case 'client':
        return localValue;
      case 'server':
        return serverValue;
      case 'last-write-wins':
        return conflict.timestamp > Date.now() - 5000 ? serverValue : localValue;
      case 'custom':
        return this.customConflictResolution(localValue, serverValue, conflict);
      default:
        return serverValue;
    }
  }

  private getConflictResolutionStrategy(): string {
    // Would be configurable
    return 'last-write-wins';
  }

  private customConflictResolution(localValue: unknown, serverValue: unknown, _conflict: ConflictEvent): unknown {
    // Custom resolution logic
    if (typeof localValue === 'object' && typeof serverValue === 'object') {
      return { ...localValue, ...serverValue };
    }
    return serverValue;
  }

  private analyzeStateHealth(): ConsistencyReport['stateHealth'] {
    const totalNodes = this.state.size;
    const healthyNodes = Array.from(this.state.values()).filter(node => {
      return node.checksum === this.calculateChecksum(node.value);
    }).length;

    const inconsistentNodes = totalNodes - healthyNodes;
    const circularDependencies = this.detectCircularDependencies();
    const _orphanedNodes = this.findOrphanedNodes();

    return {
      totalNodes,
      healthyNodes,
      inconsistentNodes,
      orphanedNodes: _orphanedNodes.length,
      circularDependencies: circularDependencies.map(cycle => cycle.join(' -> ')),
    };
  }

  private findOrphanedNodes(): string[] {
    const referencedNodes = new Set<string>();
    const allNodes = new Set(this.state.keys());

    // Collect all referenced nodes
    for (const node of this.state.values()) {
      node.dependencies.forEach(dep => referencedNodes.add(dep));
    }

    // Find nodes that exist but aren't referenced
    const _orphaned: string[] = [];
    for (const path of allNodes) {
      if (!referencedNodes.has(path) && path !== 'root') {
        _orphaned.push(path);
      }
    }

    return _orphaned;
  }

  private analyzeSyncStatus(): ConsistencyReport['sync'] {
    const totalSyncs = this.history.length;
    const successfulSyncs = totalSyncs - this.conflicts.filter(c => c.type === 'sync-failure').length;
    const _failedSyncs = this.conflicts.filter(c => c.type === 'sync-failure').length;

    return {
      totalSyncs,
      successfulSyncs,
      failedSyncs: _failedSyncs,
      avgSyncTime: this.calculateAverageSyncTime(),
      lastSyncTimestamp: this.lastSyncTime > 0 ? new Date(this.lastSyncTime) : new Date(),
    };
  }

  private calculateAverageSyncTime(): number {
    // Mock calculation - would measure actual sync times
    return 150; // milliseconds
  }

  private async analyzePerformance(): Promise<ConsistencyReport['performance']> {
    const stateSize = JSON.stringify(this.rebuildStateObject()).length;
    const memoryUsage = this.estimateMemoryUsage();
    const compressionRatio = this.calculateCompressionRatio();
    const accessPatterns = this.calculateAccessPatterns();
    const _bottlenecks = this.identifyBottlenecks();

    return {
      stateSize,
      memoryUsage,
      compressionRatio,
      accessPatterns,
      bottlenecks: _bottlenecks,
    };
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;

    // Size of state data
    totalSize += JSON.stringify(this.rebuildStateObject()).length;

    // Size of history
    totalSize += JSON.stringify(this.history).length;

    // Size of other data structures
    totalSize += this.conflicts.length * 500; // Estimate per conflict
    totalSize += this.subscribers.size * 50; // Estimate per subscriber set

    return totalSize;
  }

  private calculateCompressionRatio(): number {
    const originalSize = JSON.stringify(this.rebuildStateObject()).length;
    if (originalSize === 0) return 0;

    // Simulate compression - in real implementation would measure actual compression
    return Math.round(((originalSize - originalSize * 0.7) / originalSize) * 100);
  }

  private calculateAccessPatterns(): Record<string, number> {
    const patterns: Record<string, number> = {};

    // Count access patterns based on subscribers and dependencies
    for (const [path, node] of this.state.entries()) {
      patterns[path] = node.subscribers.size + node.dependencies.length;
    }

    return patterns;
  }

  private identifyBottlenecks(): string[] {
    const bottlenecks: string[] = [];

    // Check for deep nesting
    for (const [path] of this.state.entries()) {
      if (path.split('.').length > 5) {
        bottlenecks.push(`Deep nesting in path: ${path}`);
      }
    }

    // Check for large state objects
    for (const [path, node] of this.state.entries()) {
      const size = JSON.stringify(node.value).length;
      if (size > 100000) { // 100KB
        bottlenecks.push(`Large state object at: ${path} (${size} bytes)`);
      }
    }

    return bottlenecks;
  }

  private generateRecommendations(
    stateHealth: ConsistencyReport['stateHealth'],
    sync: ConsistencyReport['sync'],
    performance: ConsistencyReport['performance']
  ): string[] {
    const _recommendations: string[] = [];

    // State health recommendations
    if (stateHealth.inconsistentNodes > 0) {
      _recommendations.push(`Fix ${stateHealth.inconsistentNodes} inconsistent state nodes`);
    }

    if (stateHealth.circularDependencies.length > 0) {
      _recommendations.push('Resolve circular dependencies to prevent infinite loops');
    }

    if (stateHealth.orphanedNodes > 5) {
      _recommendations.push('Clean up orphaned state nodes to reduce memory usage');
    }

    // Sync recommendations
    if (sync.failedSyncs > 0) {
      _recommendations.push('Investigate and fix sync failures');
    }

    if (sync.avgSyncTime > 500) {
      _recommendations.push('Optimize sync performance to reduce average sync time');
    }

    // Performance recommendations
    if (performance.memoryUsage > 1048576) { // 1MB
      _recommendations.push('Consider state compression or partitioning to reduce memory usage');
    }

    if (performance.compressionRatio < 30) {
      _recommendations.push('Enable state compression to reduce memory usage');
    }

    if (performance.bottlenecks.length > 0) {
      _recommendations.push('Address identified performance bottlenecks');
    }

    return _recommendations;
  }

  private calculateOverallScore(
    stateHealth: ConsistencyReport['stateHealth'],
    sync: ConsistencyReport['sync'],
    performance: ConsistencyReport['performance']
  ): number {
    let _score = 100;

    // Penalize health issues
    _score -= stateHealth.inconsistentNodes * 2;
    _score -= stateHealth.circularDependencies.length * 5;

    // Penalize sync failures
    _score -= sync.failedSyncs * 3;

    // Penalize performance issues
    if (performance.memoryUsage > 1048576) _score -= 10; // 1MB
    if (performance.bottlenecks.length > 0) _score -= performance.bottlenecks.length * 2;

    return Math.max(0, Math.min(100, _score));
  }

  public clearHistory(): void {
    this.history = [];
  }

  public clearConflicts(): void {
    this.conflicts = [];
  }

  public getConflicts(): ConflictEvent[] {
    return [...this.conflicts];
  }

  public getHistory(limit?: number): StateSnapshot[] {
    return limit ? this.history.slice(-limit) : [...this.history];
  }

  public addValidator(path: string, validator: (value: unknown) => boolean): void {
    this.config.validators[path] = validator;
  }

  public addTransformer(path: string, transformer: (value: unknown) => unknown): void {
    this.config.transformers[path] = transformer;
  }

  public addMiddleware(middleware: (state: unknown, action: unknown, next: () => void) => void): void {
    this.config.middleware.push(middleware);
  }

  public updateConfig(newConfig: Partial<StateManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export default StateManager;