/**
 * Bidirectional Sync Engine
 * Core engine for synchronizing TeraBox folder with Notion workspace
 */

import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { TeraBoxClient } from './terabox-client';
import { NotionClient } from './notion-client';
import { ConflictResolver } from './conflict-resolver';
import {
  SyncConfig,
  ChangeEvent,
  SyncOperation,
  SyncOperationType,
  OperationStatus,
  SyncConflict,
  ConflictType,
  ConflictSeverity,
  TeraBoxFile,
  NotionFileEntry,
  SyncStatus,
  SyncState,
  SyncMetrics
} from './types';

export class BidirectionalSyncEngine extends EventEmitter {
  private teraboxClient: TeraBoxClient;
  private notionClient: NotionClient;
  private conflictResolver: ConflictResolver;
  private config: SyncConfig;

  // Expose clients for OCR integration
  public getTeraBoxClient(): TeraBoxClient {
    return this.teraboxClient;
  }

  public getNotionClient(): NotionClient {
    return this.notionClient;
  }
  private syncState: SyncState;
  private operationQueue: SyncOperation[] = [];
  private processing = false;
  private syncInterval?: NodeJS.Timeout;

  constructor(config: SyncConfig) {
    super();
    this.config = config;

    this.teraboxClient = new TeraBoxClient(config.terabox);
    this.notionClient = new NotionClient(config.notion);
    this.conflictResolver = new ConflictResolver(config.sync.conflictResolution);

    this.setupEventHandlers();
    this.initializeSyncState();
  }

  /**
   * Initialize sync state
   */
  private initializeSyncState(): void {
    this.syncState = {
      lastTeraBoxSync: new Date(),
      lastNotionSync: new Date(),
      lastFullSync: new Date(),
      totalSynced: 0,
      pendingChanges: [],
      activeConflicts: [],
      syncHistory: [],
      metrics: {
        totalFiles: 0,
        syncedFiles: 0,
        pendingOperations: 0,
        conflictsCount: 0,
        errorsCount: 0,
        lastSyncTime: new Date(),
        averageSyncTime: 0,
        successRate: 100,
        storageUsage: {
          terabox: 0,
          notion: 0
        },
        dataTransferred: 0,
        operationsPerHour: 0
      },
      teraboxFolderId: '',
      teraboxFolderPath: this.config.terabox.targetFolder,
      notionWorkspaceId: this.config.notion.workspaceId,
      notionDatabaseId: '',
      folderSyncOnly: true,
      workspaceSyncOnly: true
    };
  }

  /**
   * Setup event handlers for clients
   */
  private setupEventHandlers(): void {
    // TeraBox events
    this.teraboxClient.on('change_detected', (change: ChangeEvent) => {
      this.handleTeraBoxChange(change);
    });

    this.teraboxClient.on('error', (error: Error) => {
      this.emit('error', { source: 'terabox', error });
    });

    // Notion events
    this.notionClient.on('change_detected', (change: ChangeEvent) => {
      this.handleNotionChange(change);
    });

    this.notionClient.on('error', (error: Error) => {
      this.emit('error', { source: 'notion', error });
    });

    // Conflict resolver events
    this.conflictResolver.on('conflict_resolved', (resolution: any) => {
      this.emit('conflict_resolved', resolution);
    });
  }

  /**
   * Initialize the sync system
   */
  async initialize(): Promise<void> {
    try {
      this.emit('sync_initialization_started');

      // Initialize TeraBox folder
      const teraboxFolder = await this.teraboxClient.initializeTargetFolder();
      this.syncState.teraboxFolderId = teraboxFolder.id;

      // Initialize Notion workspace
      const notionDatabase = await this.notionClient.initializeWorkspace();
      this.syncState.notionDatabaseId = notionDatabase.id;

      // Perform initial sync
      await this.performInitialSync();

      // Start watching for changes
      this.startWatching();

      this.emit('sync_initialized', {
        teraboxFolder,
        notionDatabase
      });
    } catch (error) {
      console.error('Failed to initialize sync:', error);
      this.emit('sync_initialization_failed', error);
      throw error;
    }
  }

  /**
   * Perform initial synchronization
   */
  private async performInitialSync(): Promise<void> {
    try {
      this.emit('initial_sync_started');

      // Get current state from both systems
      const teraboxFiles = await this.teraboxClient.listTargetFolderContents(true);
      const notionEntries = await this.notionClient.getAllFileEntries();

      // Create maps for efficient comparison
      const teraboxMap = new Map(teraboxFiles.map(file => [file.id, file]));
      const notionMap = new Map(notionEntries.map(entry => [entry.fileId, entry]));

      // Sync TeraBox files to Notion
      for (const [fileId, teraboxFile] of teraboxMap) {
        const notionEntry = notionMap.get(fileId);

        if (!notionEntry) {
          // File exists in TeraBox but not in Notion
          await this.syncTeraBoxToNotion(teraboxFile);
        } else if (this.hasFileChanged(teraboxFile, notionEntry)) {
          // File exists in both but has changed
          const conflict = await this.detectConflict(teraboxFile, notionEntry);
          if (conflict) {
            await this.handleConflict(conflict);
          } else {
            await this.syncTeraBoxToNotion(teraboxFile, notionEntry);
          }
        }
      }

      // Sync Notion entries to TeraBox (for files that might exist only in Notion)
      for (const [fileId, notionEntry] of notionMap) {
        const teraboxFile = teraboxMap.get(fileId);

        if (!teraboxFile && !notionEntry.deletedInTeraBox) {
          // Entry exists in Notion but file not found in TeraBox
          await this.syncNotionToTeraBox(notionEntry);
        }
      }

      this.syncState.lastFullSync = new Date();
      this.emit('initial_sync_completed');
    } catch (error) {
      console.error('Initial sync failed:', error);
      this.emit('initial_sync_failed', error);
      throw error;
    }
  }

  /**
   * Check if file has changed compared to Notion entry
   */
  private hasFileChanged(teraboxFile: TeraBoxFile, notionEntry: NotionFileEntry): boolean {
    return teraboxFile.modifiedAt > notionEntry.lastModified ||
           teraboxFile.size !== notionEntry.fileSize ||
           teraboxFile.name !== notionEntry.fileName;
  }

  /**
   * Detect conflict between TeraBox file and Notion entry
   */
  private async detectConflict(teraboxFile: TeraBoxFile, notionEntry: NotionFileEntry): Promise<SyncConflict | null> {
    // Simple conflict detection - can be enhanced
    const timeDiff = Math.abs(teraboxFile.modifiedAt.getTime() - notionEntry.lastModified.getTime());
    const recentThreshold = 5 * 60 * 1000; // 5 minutes

    if (timeDiff < recentThreshold && teraboxFile.size !== notionEntry.fileSize) {
      return {
        id: randomUUID(),
        type: ConflictType.SIMULTANEOUS_EDIT,
        severity: ConflictSeverity.MEDIUM,
        description: `File ${teraboxFile.name} has been modified in both systems`,
        teraboxState: teraboxFile,
        notionState: notionEntry,
        timestamp: new Date(),
        needsManualIntervention: false
      };
    }

    return null;
  }

  /**
   * Handle conflict resolution
   */
  private async handleConflict(conflict: SyncConflict): Promise<void> {
    try {
      this.syncState.activeConflicts.push(conflict);
      this.emit('conflict_detected', conflict);

      const resolution = await this.conflictResolver.resolveConflict(conflict);

      if (resolution) {
        await this.applyConflictResolution(conflict, resolution);

        // Remove from active conflicts
        const index = this.syncState.activeConflicts.findIndex(c => c.id === conflict.id);
        if (index >= 0) {
          this.syncState.activeConflicts.splice(index, 1);
        }
      }
    } catch (error) {
      console.error('Failed to handle conflict:', error);
      this.emit('conflict_resolution_failed', { conflict, error });
    }
  }

  /**
   * Apply conflict resolution
   */
  private async applyConflictResolution(conflict: SyncConflict, resolution: any): Promise<void> {
    // Implementation depends on resolution strategy
    // This would involve updating the appropriate system based on the resolution
    console.log('Applying conflict resolution:', resolution);
  }

  /**
   * Sync TeraBox file to Notion
   */
  private async syncTeraBoxToNotion(teraboxFile: TeraBoxFile, existingEntry?: NotionFileEntry): Promise<void> {
    try {
      const downloadUrl = await this.teraboxClient.getDownloadUrl(teraboxFile.id, teraboxFile.name);

      const fileEntry: Omit<NotionFileEntry, 'id'> = {
        fileId: teraboxFile.id,
        fileName: teraboxFile.name,
        filePath: teraboxFile.path,
        fileSize: teraboxFile.size,
        fileType: teraboxFile.mimeType || 'unknown',
        teraboxUrl: downloadUrl,
        notionUrl: '', // Will be set after creation
        lastModified: teraboxFile.modifiedAt,
        syncStatus: SyncStatus.SYNCED,
        deletedInTeraBox: teraboxFile.deleted,
        deletedInNotion: false,
        ocrAnalyzed: false,
        workspaceId: this.config.notion.workspaceId,
        databaseId: this.syncState.notionDatabaseId
      };

      let notionEntry: NotionFileEntry;

      if (existingEntry) {
        // Update existing entry
        notionEntry = await this.notionClient.updateFileEntry(teraboxFile.id, fileEntry);
      } else {
        // Create new entry
        notionEntry = await this.notionClient.createFileEntry(fileEntry);
      }

      // Schedule OCR analysis if enabled
      if (this.config.ocr?.enabled && this.shouldAnalyzeFile(teraboxFile)) {
        await this.scheduleOCRAnalysis(notionEntry);
      }

      this.emit('file_synced_to_notion', { teraboxFile, notionEntry });
    } catch (error) {
      console.error('Failed to sync TeraBox to Notion:', error);
      this.emit('sync_failed', { source: 'terabox_to_notion', file: teraboxFile, error });
      throw error;
    }
  }

  /**
   * Sync Notion entry to TeraBox (for files created in Notion)
   */
  private async syncNotionToTeraBox(notionEntry: NotionFileEntry): Promise<void> {
    try {
      // This would handle files that were somehow created in Notion first
      // In practice, this might be rare but included for completeness
      console.log('Syncing Notion entry to TeraBox:', notionEntry.fileName);

      // Implementation would depend on how files are stored when created in Notion
      // This might involve downloading from a URL and uploading to TeraBox

      this.emit('file_synced_to_terabox', { notionEntry });
    } catch (error) {
      console.error('Failed to sync Notion to TeraBox:', error);
      this.emit('sync_failed', { source: 'notion_to_terabox', entry: notionEntry, error });
      throw error;
    }
  }

  /**
   * Check if file should be analyzed by OCR
   */
  private shouldAnalyzeFile(file: TeraBoxFile): boolean {
    const analyzableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/bmp'
    ];

    return analyzableTypes.includes(file.mimeType || '') && file.size < 50 * 1024 * 1024; // 50MB limit
  }

  /**
   * Schedule OCR analysis for a file
   */
  private async scheduleOCRAnalysis(notionEntry: NotionFileEntry): Promise<void> {
    // This would integrate with the existing DeepSeek OCR system
    // For now, just emit an event that can be handled by OCR module
    this.emit('ocr_analysis_scheduled', notionEntry);
  }

  /**
   * Handle TeraBox change event
   */
  private async handleTeraBoxChange(change: ChangeEvent): Promise<void> {
    try {
      const operation = this.createSyncOperation(change, SyncOperationType.CREATE_IN_NOTION);
      await this.queueOperation(operation);
    } catch (error) {
      console.error('Failed to handle TeraBox change:', error);
      this.emit('change_handling_failed', { source: 'terabox', change, error });
    }
  }

  /**
   * Handle Notion change event
   */
  private async handleNotionChange(change: ChangeEvent): Promise<void> {
    try {
      const operation = this.createSyncOperation(change, SyncOperationType.UPDATE_IN_TERABOX);
      await this.queueOperation(operation);
    } catch (error) {
      console.error('Failed to handle Notion change:', error);
      this.emit('change_handling_failed', { source: 'notion', change, error });
    }
  }

  /**
   * Create sync operation from change event
   */
  private createSyncOperation(change: ChangeEvent, defaultType: SyncOperationType): SyncOperation {
    let operationType = defaultType;

    switch (change.type) {
      case 'file_created':
        operationType = change.source === 'terabox'
          ? SyncOperationType.CREATE_IN_NOTION
          : SyncOperationType.CREATE_IN_TERABOX;
        break;
      case 'file_deleted':
        operationType = change.source === 'terabox'
          ? SyncOperationType.DELETE_IN_NOTION
          : SyncOperationType.DELETE_IN_TERABOX;
        break;
      case 'file_modified':
        operationType = change.source === 'terabox'
          ? SyncOperationType.UPDATE_IN_NOTION
          : SyncOperationType.UPDATE_IN_TERABOX;
        break;
      case 'file_moved':
        operationType = change.source === 'terabox'
          ? SyncOperationType.MOVE_IN_NOTION
          : SyncOperationType.MOVE_IN_TERABOX;
        break;
    }

    return {
      id: randomUUID(),
      type: operationType,
      sourceEvent: change,
      targetAction: {
        type: this.getActionType(operationType),
        target: change.source === 'terabox' ? 'notion' : 'terabox',
        data: {
          fileId: change.fileId,
          fileName: change.fileName,
          oldPath: change.oldPath,
          newPath: change.newPath,
          metadata: change.metadata
        }
      },
      status: OperationStatus.PENDING,
      attempts: 0,
      maxAttempts: this.config.sync.maxRetries,
      createdAt: new Date()
    };
  }

  /**
   * Get action type for operation
   */
  private getActionType(operationType: SyncOperationType): 'create' | 'update' | 'delete' | 'move' {
    switch (operationType) {
      case SyncOperationType.CREATE_IN_NOTION:
      case SyncOperationType.CREATE_IN_TERABOX:
        return 'create';
      case SyncOperationType.UPDATE_IN_NOTION:
      case SyncOperationType.UPDATE_IN_TERABOX:
        return 'update';
      case SyncOperationType.DELETE_IN_NOTION:
      case SyncOperationType.DELETE_IN_TERABOX:
        return 'delete';
      case SyncOperationType.MOVE_IN_NOTION:
      case SyncOperationType.MOVE_IN_TERABOX:
        return 'move';
      default:
        return 'update';
    }
  }

  /**
   * Queue operation for processing
   */
  private async queueOperation(operation: SyncOperation): Promise<void> {
    this.operationQueue.push(operation);
    this.syncState.metrics.pendingOperations = this.operationQueue.length;

    if (!this.processing) {
      await this.processOperationQueue();
    }
  }

  /**
   * Process operation queue
   */
  private async processOperationQueue(): Promise<void> {
    if (this.processing || this.operationQueue.length === 0) {
      return;
    }

    this.processing = true;

    try {
      while (this.operationQueue.length > 0) {
        const operation = this.operationQueue.shift()!;
        await this.processOperation(operation);
      }
    } catch (error) {
      console.error('Error processing operation queue:', error);
    } finally {
      this.processing = false;
      this.syncState.metrics.pendingOperations = this.operationQueue.length;
    }
  }

  /**
   * Process individual operation
   */
  private async processOperation(operation: SyncOperation): Promise<void> {
    const startTime = Date.now();

    try {
      operation.status = OperationStatus.IN_PROGRESS;
      operation.lastAttempt = new Date();
      operation.attempts++;

      this.emit('operation_started', operation);

      switch (operation.type) {
        case SyncOperationType.CREATE_IN_NOTION:
          await this.executeCreateInNotion(operation);
          break;
        case SyncOperationType.UPDATE_IN_NOTION:
          await this.executeUpdateInNotion(operation);
          break;
        case SyncOperationType.DELETE_IN_NOTION:
          await this.executeDeleteInNotion(operation);
          break;
        case SyncOperationType.MOVE_IN_NOTION:
          await this.executeMoveInNotion(operation);
          break;
        // Add TeraBox operations as needed
      }

      operation.status = OperationStatus.COMPLETED;
      operation.completedAt = new Date();
      operation.result = { success: true };

      this.syncState.syncHistory.push(operation);
      this.updateSyncMetrics(startTime);

      this.emit('operation_completed', operation);
    } catch (error) {
      console.error('Operation failed:', error);
      operation.error = (error as Error).message;

      if (operation.attempts < operation.maxAttempts && this.config.sync.autoRetry) {
        // Retry operation
        operation.status = OperationStatus.PENDING;
        operation.nextAttempt = new Date(Date.now() + this.config.sync.retryDelay);
        this.operationQueue.push(operation);
      } else {
        // Mark as failed
        operation.status = OperationStatus.FAILED;
        this.syncState.syncHistory.push(operation);
        this.syncState.metrics.errorsCount++;
      }

      this.emit('operation_failed', { operation, error });
    }
  }

  /**
   * Execute create in Notion operation
   */
  private async executeCreateInNotion(operation: SyncOperation): Promise<void> {
    const teraboxFile = await this.teraboxClient.getFileInfo(operation.targetAction.data.fileId);
    if (!teraboxFile) {
      throw new Error('TeraBox file not found');
    }

    await this.syncTeraBoxToNotion(teraboxFile);
  }

  /**
   * Execute update in Notion operation
   */
  private async executeUpdateInNotion(operation: SyncOperation): Promise<void> {
    const teraboxFile = await this.teraboxClient.getFileInfo(operation.targetAction.data.fileId);
    if (!teraboxFile) {
      throw new Error('TeraBox file not found');
    }

    const existingEntry = await this.notionClient.getFileEntry(operation.targetAction.data.fileId);
    await this.syncTeraBoxToNotion(teraboxFile, existingEntry);
  }

  /**
   * Execute delete in Notion operation
   */
  private async executeDeleteInNotion(operation: SyncOperation): Promise<void> {
    await this.notionClient.deleteFileEntry(operation.targetAction.data.fileId);
  }

  /**
   * Execute move in Notion operation
   */
  private async executeMoveInNotion(operation: SyncOperation): Promise<void> {
    const { fileId, newPath } = operation.targetAction.data;
    const existingEntry = await this.notionClient.getFileEntry(fileId);

    if (existingEntry) {
      await this.notionClient.updateFileEntry(fileId, {
        filePath: newPath
      });
    }
  }

  /**
   * Update sync metrics
   */
  private updateSyncMetrics(startTime: number): void {
    const duration = Date.now() - startTime;
    const totalOperations = this.syncState.syncHistory.length;
    const successfulOperations = this.syncState.syncHistory.filter(op => op.status === OperationStatus.COMPLETED).length;

    this.syncState.metrics.lastSyncTime = new Date();
    this.syncState.metrics.averageSyncTime = totalOperations > 0
      ? this.syncState.syncHistory.reduce((sum, op) => sum + (op.completedAt!.getTime() - op.createdAt.getTime()), 0) / totalOperations
      : 0;
    this.syncState.metrics.successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 100;
  }

  /**
   * Start watching for changes
   */
  private startWatching(): void {
    if (this.config.sync.mode === 'bidirectional' || this.config.sync.mode === 'terabox_to_notion') {
      this.teraboxClient.startWatching();
    }

    if (this.config.sync.mode === 'bidirectional' || this.config.sync.mode === 'notion_to_terabox') {
      this.notionClient.startWatching();
    }

    // Start periodic full sync
    this.syncInterval = setInterval(async () => {
      try {
        await this.performPeriodicSync();
      } catch (error) {
        console.error('Periodic sync failed:', error);
      }
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Perform periodic sync to catch any missed changes
   */
  private async performPeriodicSync(): Promise<void> {
    this.emit('periodic_sync_started');
    await this.performInitialSync(); // Reuse initial sync logic
    this.emit('periodic_sync_completed');
  }

  /**
   * Stop sync engine
   */
  async stop(): Promise<void> {
    this.teraboxClient.stopWatching();
    this.notionClient.stopWatching();

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }

    this.processing = false;
    this.emit('sync_stopped');
  }

  /**
   * Get current sync state
   */
  getSyncState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * Get sync metrics
   */
  getMetrics(): SyncMetrics {
    return { ...this.syncState.metrics };
  }

  /**
   * Force manual sync
   */
  async forceSync(): Promise<void> {
    await this.performInitialSync();
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.stop();
    this.teraboxClient.cleanup();
    this.notionClient.cleanup();
    this.removeAllListeners();
  }
}