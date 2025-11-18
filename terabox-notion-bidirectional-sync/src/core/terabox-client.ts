/**
 * TeraBox Client with Specific Folder Focus
 * Handles all TeraBox operations restricted to a specific folder only
 */

import axios, { AxiosInstance } from 'axios';
import { EventEmitter } from 'events';
import { randomUUID, createHash } from 'crypto';
import {
  TeraBoxFile,
  SyncConfig,
  ChangeEvent,
  ChangeType,
  ApiResponse
} from './types';

export class TeraBoxClient extends EventEmitter {
  private client: AxiosInstance;
  private config: SyncConfig['terabox'];
  private folderCache: Map<string, TeraBoxFile> = new Map();
  private lastSyncState: Map<string, string> = new Map(); // fileId -> hash
  private watcherInterval?: NodeJS.Timeout;

  constructor(config: SyncConfig['terabox']) {
    super();
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'TeraBox-Notion-Sync/1.0'
      }
    });

    // Add authentication if provided
    if (config.apiKey) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${config.apiKey}`;
    }

    // Setup authentication if username/password provided
    if (config.username && config.password) {
      this.authenticate();
    }
  }

  /**
   * Authenticate with TeraBox using username/password
   */
  private async authenticate(): Promise<void> {
    try {
      const response = await this.client.post('/auth/login', {
        username: this.config.username,
        password: this.config.password
      });

      if (response.data.token) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
    } catch (error) {
      console.error('TeraBox authentication failed:', error);
      throw error;
    }
  }

  /**
   * Initialize the specific folder for sync
   */
  async initializeTargetFolder(): Promise<TeraBoxFile> {
    try {
      // Check if folder exists and get folder ID
      const folder = await this.getFolderByPath(this.config.targetFolder);

      if (!folder) {
        // Create folder if it doesn't exist
        return await this.createFolder(this.config.targetFolder);
      }

      this.config.folderId = folder.id;
      this.emit('folder_initialized', folder);
      return folder;
    } catch (error) {
      console.error('Failed to initialize target folder:', error);
      throw error;
    }
  }

  /**
   * Get folder information by path
   */
  private async getFolderByPath(path: string): Promise<TeraBoxFile | null> {
    try {
      const response = await this.client.get('/api/folder/by-path', {
        params: { path }
      });

      return response.data.success ? response.data.folder : null;
    } catch (error) {
      // If folder doesn't exist, return null
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new folder
   */
  private async createFolder(path: string): Promise<TeraBoxFile> {
    try {
      const parts = path.split('/').filter(Boolean);
      const folderName = parts[parts.length - 1];
      const parentPath = '/' + parts.slice(0, -1).join('/');

      let parentId = null;
      if (parts.length > 1) {
        const parent = await this.getFolderByPath(parentPath);
        if (parent) {
          parentId = parent.id;
        } else {
          // Create parent folder recursively
          const createdParent = await this.createFolder(parentPath);
          parentId = createdParent.id;
        }
      }

      const response = await this.client.post('/api/folder/create', {
        name: folderName,
        parentId
      });

      if (response.data.success) {
        const folder = response.data.folder;
        this.folderCache.set(folder.id, folder);
        return folder;
      }

      throw new Error('Failed to create folder');
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  }

  /**
   * List all files and folders in the target folder
   */
  async listTargetFolderContents(recursive: boolean = false): Promise<TeraBoxFile[]> {
    if (!this.config.folderId) {
      throw new Error('Target folder not initialized');
    }

    try {
      const response = await this.client.get('/api/folder/contents', {
        params: {
          folderId: this.config.folderId,
          recursive: recursive && this.config.watchSubfolders
        }
      });

      if (response.data.success) {
        const files = response.data.files || [];
        // Update cache
        files.forEach((file: TeraBoxFile) => {
          this.folderCache.set(file.id, file);
        });
        return files;
      }

      return [];
    } catch (error) {
      console.error('Failed to list folder contents:', error);
      throw error;
    }
  }

  /**
   * Upload a file to the target folder
   */
  async uploadFile(fileData: Buffer | Blob, fileName: string, subfolderPath?: string): Promise<TeraBoxFile> {
    if (!this.config.folderId) {
      throw new Error('Target folder not initialized');
    }

    try {
      let targetFolderId = this.config.folderId;

      // Handle subfolder if provided
      if (subfolderPath && this.config.watchSubfolders) {
        const subfolder = await this.getOrCreateSubfolder(subfolderPath);
        targetFolderId = subfolder.id;
      }

      const formData = new FormData();
      formData.append('file', fileData, fileName);
      formData.append('folderId', targetFolderId);

      const response = await this.client.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          this.emit('upload_progress', { fileName, progress });
        }
      });

      if (response.data.success) {
        const file = response.data.file;
        this.folderCache.set(file.id, file);

        // Calculate file hash for change detection
        const hash = await this.calculateFileHash(fileData);
        this.lastSyncState.set(file.id, hash);

        this.emit('file_uploaded', file);
        return file;
      }

      throw new Error('Upload failed');
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  /**
   * Get or create subfolder within target folder
   */
  private async getOrCreateSubfolder(subfolderPath: string): Promise<TeraBoxFile> {
    const fullPath = `${this.config.targetFolder}/${subfolderPath}`.replace(/\/+/g, '/');

    let folder = await this.getFolderByPath(fullPath);
    if (!folder) {
      folder = await this.createFolder(fullPath);
    }

    return folder;
  }

  /**
   * Download a file
   */
  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/api/file/download/${fileId}`, {
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  /**
   * Get direct download URL for a file
   */
  async getDownloadUrl(fileId: string, fileName?: string): Promise<string> {
    try {
      const response = await this.client.get(`/api/file/url/${fileId}`, {
        params: { fileName }
      });

      return response.data.url || `${this.config.baseURL}/api/file/download/${fileId}`;
    } catch (error) {
      console.error('Failed to get download URL:', error);
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const response = await this.client.delete(`/api/file/${fileId}`);

      if (response.data.success) {
        this.folderCache.delete(fileId);
        this.lastSyncState.delete(fileId);
        this.emit('file_deleted', { fileId });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  /**
   * Move a file to a different location within target folder
   */
  async moveFile(fileId: string, newPath: string): Promise<TeraBoxFile> {
    try {
      const response = await this.client.put(`/api/file/${fileId}/move`, {
        newPath,
        targetFolderId: this.config.folderId
      });

      if (response.data.success) {
        const file = response.data.file;
        this.folderCache.set(fileId, file);
        this.emit('file_moved', { fileId, newPath });
        return file;
      }

      throw new Error('Move operation failed');
    } catch (error) {
      console.error('Failed to move file:', error);
      throw error;
    }
  }

  /**
   * Calculate file hash for change detection
   */
  private async calculateFileHash(fileData: Buffer | Blob): Promise<string> {
    const buffer = fileData instanceof Buffer ? fileData : await fileData.arrayBuffer();
    return createHash('sha256').update(Buffer.from(buffer)).digest('hex');
  }

  /**
   * Start watching for changes in the target folder
   */
  startWatching(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
    }

    this.watcherInterval = setInterval(async () => {
      try {
        await this.checkForChanges();
      } catch (error) {
        console.error('Error checking for changes:', error);
        this.emit('error', error);
      }
    }, this.config.pollingInterval);

    this.emit('watcher_started');
  }

  /**
   * Stop watching for changes
   */
  stopWatching(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
      this.watcherInterval = undefined;
      this.emit('watcher_stopped');
    }
  }

  /**
   * Check for changes in the target folder
   */
  private async checkForChanges(): Promise<ChangeEvent[]> {
    const currentFiles = await this.listTargetFolderContents(true);
    const changes: ChangeEvent[] = [];
    const currentFileMap = new Map<string, TeraBoxFile>();

    // Build current file map
    currentFiles.forEach(file => {
      currentFileMap.set(file.id, file);
    });

    // Check for new files
    for (const [fileId, file] of currentFileMap) {
      if (!this.folderCache.has(fileId)) {
        changes.push({
          id: randomUUID(),
          type: ChangeType.FILE_CREATED,
          source: 'terabox',
          timestamp: new Date(),
          fileId,
          fileName: file.name,
          newPath: file.path,
          metadata: { size: file.size, mimeType: file.mimeType }
        });
      }
    }

    // Check for deleted files
    for (const [fileId, cachedFile] of this.folderCache) {
      if (!currentFileMap.has(fileId) && !cachedFile.deleted) {
        changes.push({
          id: randomUUID(),
          type: ChangeType.FILE_DELETED,
          source: 'terabox',
          timestamp: new Date(),
          fileId,
          fileName: cachedFile.name,
          oldPath: cachedFile.path
        });
      }
    }

    // Check for modified files
    for (const [fileId, currentFile] of currentFileMap) {
      const cachedFile = this.folderCache.get(fileId);
      if (cachedFile && currentFile.modifiedAt > cachedFile.modifiedAt) {
        changes.push({
          id: randomUUID(),
          type: ChangeType.FILE_MODIFIED,
          source: 'terabox',
          timestamp: new Date(),
          fileId,
          fileName: currentFile.name,
          newPath: currentFile.path,
          metadata: {
            modifiedAt: currentFile.modifiedAt,
            size: currentFile.size
          }
        });
      }
    }

    // Update cache
    this.folderCache = currentFileMap;

    // Emit changes
    changes.forEach(change => {
      this.emit('change_detected', change);
    });

    return changes;
  }

  /**
   * Get file information
   */
  async getFileInfo(fileId: string): Promise<TeraBoxFile | null> {
    // Check cache first
    if (this.folderCache.has(fileId)) {
      return this.folderCache.get(fileId)!;
    }

    try {
      const response = await this.client.get(`/api/file/${fileId}`);

      if (response.data.success) {
        const file = response.data.file;
        this.folderCache.set(fileId, file);
        return file;
      }

      return null;
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  /**
   * Get storage usage for the target folder
   */
  async getStorageUsage(): Promise<{ total: number; used: number; available: number }> {
    try {
      const response = await this.client.get('/api/storage/usage', {
        params: { folderId: this.config.folderId }
      });

      return response.data.usage || { total: 0, used: 0, available: 0 };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { total: 0, used: 0, available: 0 };
    }
  }

  /**
   * Health check for TeraBox connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/health');
      return response.data.success || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopWatching();
    this.folderCache.clear();
    this.lastSyncState.clear();
    this.removeAllListeners();
  }
}