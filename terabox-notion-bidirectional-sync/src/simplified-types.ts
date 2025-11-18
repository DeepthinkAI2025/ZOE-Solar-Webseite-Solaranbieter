/**
 * Simplified Type Definitions for the TeraBox + Notion Sync System
 * Basic types that work without complex dependencies
 */

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
  pageId?: string;
  lastModified: Date;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error' | 'deleted';
  deletedInTeraBox: boolean;
  deletedInNotion: boolean;
  ocrAnalyzed: boolean;
  extractedText?: string;
}

export interface SimpleSyncConfig {
  terabox: {
    baseURL: string;
    targetFolder: string;
    username?: string;
    password?: string;
    pollingInterval: number;
    watchSubfolders: boolean;
  };
  notion: {
    token: string;
    workspaceId: string;
    workspaceName?: string;
    databaseId?: string;
    databaseName?: string;
    restrictToWorkspace: boolean;
  };
  sync: {
    mode: 'bidirectional' | 'terabox_to_notion' | 'notion_to_terabox';
    conflictResolution: 'latest_wins' | 'terabox_wins' | 'notion_wins' | 'manual';
    autoRetry: boolean;
  };
  ocr: {
    enabled: boolean;
    baseURL: string;
    apiKey?: string;
  };
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

export interface SimpleChangeEvent {
  id: string;
  type: 'file_created' | 'file_updated' | 'file_deleted' | 'file_moved';
  source: 'terabox' | 'notion';
  timestamp: Date;
  fileId: string;
  fileName: string;
  oldPath?: string;
  newPath?: string;
  metadata?: Record<string, any>;
}