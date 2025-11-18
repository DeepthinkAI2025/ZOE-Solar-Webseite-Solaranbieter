/**
 * Simplified Types for easier compilation
 */

export type ConflictResolutionStrategy = 'latest_wins' | 'manual_resolve' | 'keep_both' | 'terabox_wins' | 'notion_wins';

export interface SimpleSyncConfig {
  terabox: {
    baseURL: string;
    targetFolder: string;
    username: string;
    password: string;
    pollingInterval: number;
    watchSubfolders: boolean;
  };
  notion: {
    token: string;
    workspaceId: string;
    databaseName: string;
    restrictToWorkspace: boolean;
  };
  sync: {
    mode: 'bidirectional' | 'terabox_to_notion' | 'notion_to_terabox';
    conflictResolution: ConflictResolutionStrategy;
    autoRetry: boolean;
  };
  ocr: {
    enabled: boolean;
    baseURL: string;
  };
}

export interface SimpleTeraBoxFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType?: string;
  modifiedAt: Date;
  deleted: boolean;
}

export interface SimpleNotionEntry {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  teraboxUrl: string;
  notionUrl: string;
  lastModified: Date;
  syncStatus: string;
  deletedInTeraBox: boolean;
  deletedInNotion: boolean;
  ocrAnalyzed: boolean;
  extractedText?: string;
}

export interface SimpleSyncMetrics {
  totalFiles: number;
  syncedFiles: number;
  pendingOperations: number;
  conflictsCount: number;
  errorsCount: number;
  successRate: number;
  storageUsage: {
    terabox: number;
    notion: number;
  };
}

export interface SimpleHealthStatus {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  components: {
    sync: boolean;
    ocr: boolean;
    terabox: boolean;
    notion: boolean;
  };
}