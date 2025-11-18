/**
 * Core Type Definitions for TeraBox-Notion Bidirectional Sync System
 */

// ============================================================================
// Core System Types
// ============================================================================

export interface SyncConfig {
  // TeraBox Configuration - Specific Folder Only
  terabox: {
    baseURL: string;
    targetFolder: string; // Specific folder: "/Terabox Cloud Storage und Notion CMS"
    apiKey?: string;
    pollingInterval: number;
    username?: string;
    password?: string;
    folderId?: string; // Internal folder ID for efficient operations
    watchSubfolders: boolean; // Whether to sync subfolders within target folder
  };

  // Notion Configuration - Specific Workspace Only
  notion: {
    token: string;
    workspaceId: string; // Specific workspace ID
    workspaceName?: string; // Human-readable workspace name
    databaseId?: string; // Database within the workspace for sync
    databaseName?: string; // Auto-created database name
    pollingInterval: number;
    // Restrict operations to this specific workspace only
    restrictToWorkspace: boolean;
  };

  // Sync Configuration
  sync: {
    mode: 'bidirectional' | 'terabox_to_notion' | 'notion_to_terabox';
    conflictResolution: 'latest_wins' | 'manual_resolve' | 'keep_both' | 'terabox_wins' | 'notion_wins';
    autoRetry: boolean;
    maxRetries: number;
    retryDelay: number;
    batchSize: number;
  };

  // OCR Configuration (Optional)
  ocr?: {
    enabled: boolean;
    baseURL: string;
    apiKey?: string;
    languages: string[];
    extractFinancialData: boolean;
  };

  // Logging Configuration
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
    maxFiles?: number;
    maxSize?: string;
  };
}

// ============================================================================
// File System Types
// ============================================================================

export interface TeraBoxFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'file' | 'folder';
  mimeType?: string;
  hash?: string;
  createdAt: Date;
  modifiedAt: Date;
  downloadUrl?: string;
  parentId?: string;
  deleted: boolean;
}

export interface NotionFileEntry {
  id: string;
  fileId: string; // TeraBox File ID
  fileName: string;
  filePath: string; // Path within the specific TeraBox folder
  fileSize: number;
  fileType: string;
  teraboxUrl: string;
  notionUrl: string; // URL within the specific Notion workspace
  lastModified: Date;
  syncStatus: SyncStatus;
  deletedInTeraBox: boolean;
  deletedInNotion: boolean;
  ocrAnalyzed: boolean;
  extractedText?: string;
  extractedData?: ExtractedData;
  tags?: string[];
  category?: string;
  checksum?: string;
  // Workspace-specific fields
  workspaceId: string; // The specific workspace this entry belongs to
  databaseId: string; // The database within the workspace
  pageId?: string; // Notion page ID if created as page
}

export interface ExtractedData {
  dates?: string[];
  amounts?: string[];
  invoiceNumbers?: string[];
  companies?: string[];
  confidence?: number;
  languageDetected?: string;
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING_TERABOX = 'pending_terabox',
  PENDING_NOTION = 'pending_notion',
  CONFLICT = 'conflict',
  ERROR = 'error',
  DELETED = 'deleted'
}

// ============================================================================
// Change Detection Types
// ============================================================================

export interface ChangeEvent {
  id: string;
  type: ChangeType;
  source: 'terabox' | 'notion';
  timestamp: Date;
  fileId: string;
  fileName: string;
  oldPath?: string;
  newPath?: string;
  oldHash?: string;
  newHash?: string;
  metadata?: Record<string, any>;
}

export enum ChangeType {
  FILE_CREATED = 'file_created',
  FILE_DELETED = 'file_deleted',
  FILE_MODIFIED = 'file_modified',
  FILE_MOVED = 'file_moved',
  FILE_RENAMED = 'file_renamed',
  FOLDER_CREATED = 'folder_created',
  FOLDER_DELETED = 'folder_deleted',
  FOLDER_MOVED = 'folder_moved',
  BATCH_OPERATION = 'batch_operation'
}

// ============================================================================
// Sync Operation Types
// ============================================================================

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  sourceEvent: ChangeEvent;
  targetAction: TargetAction;
  status: OperationStatus;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  error?: string;
  result?: any;
  createdAt: Date;
  completedAt?: Date;
}

export enum SyncOperationType {
  CREATE_IN_NOTION = 'create_in_notion',
  UPDATE_IN_NOTION = 'update_in_notion',
  DELETE_IN_NOTION = 'delete_in_notion',
  MOVE_IN_NOTION = 'move_in_notion',
  CREATE_IN_TERABOX = 'create_in_terabox',
  UPDATE_IN_TERABOX = 'update_in_terabox',
  DELETE_IN_TERABOX = 'delete_in_terabox',
  MOVE_IN_TERABOX = 'move_in_terabox',
  CONFLICT_RESOLUTION = 'conflict_resolution'
}

export enum OperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface TargetAction {
  type: 'create' | 'update' | 'delete' | 'move';
  target: 'terabox' | 'notion';
  data: Record<string, any>;
  dependencies?: string[];
}

// ============================================================================
// Conflict Resolution Types
// ============================================================================

export interface SyncConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  description: string;
  teraboxState: TeraBoxFile;
  notionState: NotionFileEntry;
  timestamp: Date;
  autoResolved?: boolean;
  resolution?: ConflictResolution;
  needsManualIntervention: boolean;
}

export enum ConflictType {
  SIMULTANEOUS_EDIT = 'simultaneous_edit',
  DELETE_CONFLICT = 'delete_conflict',
  MOVE_CONFLICT = 'move_conflict',
  HASH_MISMATCH = 'hash_mismatch',
  NAMING_CONFLICT = 'naming_conflict',
  ACCESS_CONFLICT = 'access_conflict'
}

export enum ConflictSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ConflictResolution {
  strategy: ConflictResolutionStrategy;
  action: ResolutionAction;
  resolvedAt: Date;
  resolvedBy: 'system' | 'user';
  notes?: string;
}

export enum ConflictResolutionStrategy {
  LATEST_WINS = 'latest_wins',
  TERABOX_WINS = 'terabox_wins',
  NOTION_WINS = 'notion_wins',
  KEEP_BOTH = 'keep_both',
  MANUAL_RESOLVE = 'manual_resolve',
  SMART_MERGE = 'smart_merge'
}

export interface ResolutionAction {
  type: 'use_terabox' | 'use_notion' | 'merge' | 'keep_both' | 'custom';
  details: Record<string, any>;
}

// ============================================================================
// Monitoring & Health Types
// ============================================================================

export interface SyncMetrics {
  totalFiles: number;
  syncedFiles: number;
  pendingOperations: number;
  conflictsCount: number;
  errorsCount: number;
  lastSyncTime: Date;
  averageSyncTime: number;
  successRate: number;
  storageUsage: {
    terabox: number;
    notion: number;
  };
  dataTransferred: number;
  operationsPerHour: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  teraboxConnection: boolean;
  notionConnection: boolean;
  ocrConnection: boolean;
  lastHealthCheck: Date;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeOperations: number;
  queuedOperations: number;
  errorRate: number;
  issues: HealthIssue[];
}

export interface HealthIssue {
  type: 'connection' | 'sync' | 'performance' | 'storage' | 'auth';
  severity: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// Database Schema Types
// ============================================================================

export interface NotionDatabaseSchema {
  id: string;
  title: string;
  properties: Record<string, NotionPropertySchema>;
  created: boolean;
  url?: string;
}

export interface NotionPropertySchema {
  type: string;
  name: string;
  config: Record<string, any>;
  required?: boolean;
}

export interface SyncState {
  lastTeraBoxSync: Date;
  lastNotionSync: Date;
  lastFullSync: Date;
  totalSynced: number;
  pendingChanges: ChangeEvent[];
  activeConflicts: SyncConflict[];
  syncHistory: SyncOperation[];
  metrics: SyncMetrics;
  // Specific folder and workspace tracking
  teraboxFolderId: string;
  teraboxFolderPath: string;
  notionWorkspaceId: string;
  notionDatabaseId: string;
  // Sync boundaries
  folderSyncOnly: boolean; // Restrict sync to specific folder only
  workspaceSyncOnly: boolean; // Restrict sync to specific workspace only
}

// ============================================================================
// Event & Notification Types
// ============================================================================

export interface SyncEvent {
  type: 'sync_started' | 'sync_completed' | 'sync_failed' | 'conflict_detected' | 'conflict_resolved';
  timestamp: Date;
  data: any;
  severity: 'info' | 'warning' | 'error';
}

export interface NotificationChannel {
  type: 'email' | 'webhook' | 'slack' | 'discord' | 'in_app';
  config: Record<string, any>;
  enabled: boolean;
  filters: NotificationFilter[];
}

export interface NotificationFilter {
  eventType: string;
  minSeverity: string;
  conditions: Record<string, any>;
}