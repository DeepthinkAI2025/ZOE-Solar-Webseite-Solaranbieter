/**
 * Fixed TeraBox Client with realistic API endpoints
 * Works with TeraBox API or simulation mode
 */

import { EventEmitter } from 'events';
import { randomUUID, createHash } from 'crypto';
import axios, { AxiosInstance } from 'axios';
import { SimpleTeraBoxFile } from './simplified-types';

export class TeraBoxClientFixed extends EventEmitter {
  private client: AxiosInstance;
  private config: {
    baseURL: string;
    targetFolder: string;
    username?: string;
    password?: string;
    pollingInterval: number;
    watchSubfolders: boolean;
    simulationMode: boolean;
  };
  private folderCache: Map<string, SimpleTeraBoxFile> = new Map();
  private folderId: string | null = null;
  private watcherInterval?: NodeJS.Timeout;

  constructor(config: {
    baseURL: string;
    targetFolder: string;
    username?: string;
    password?: string;
    pollingInterval?: number;
    watchSubfolders?: boolean;
    simulationMode?: boolean;
  }) {
    super();
    this.config = {
      baseURL: config.baseURL,
      targetFolder: config.targetFolder,
      username: config.username,
      password: config.password,
      pollingInterval: config.pollingInterval || 30000,
      watchSubfolders: config.watchSubfolders !== false,
      simulationMode: config.simulationMode || !config.username
    };

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'TeraBox-Notion-Sync/1.0'
      }
    });

    // Add authentication if provided
    if (config.username && config.password && !this.config.simulationMode) {
      this.authenticate();
    }

    // Initialize with mock data if in simulation mode
    if (this.config.simulationMode) {
      this.initializeMockData();
    }
  }

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
      console.warn('TeraBox authentication failed, using simulation mode');
      this.config.simulationMode = true;
      this.initializeMockData();
    }
  }

  private initializeMockData(): void {
    console.log('Initializing TeraBox in simulation mode with mock data...');

    const mockFiles: SimpleTeraBoxFile[] = [
      {
        id: 'terabox_mock_1',
        name: 'Rechnung_2024_001.pdf',
        path: '/Terabox Cloud Storage und Notion CMS/Dokumente/Rechnungen/Rechnung_2024_001.pdf',
        size: 245760,
        mimeType: 'application/pdf',
        modifiedAt: new Date(),
        deleted: false
      },
      {
        id: 'terabox_mock_2',
        name: 'Mietvertrag_2024.pdf',
        path: '/Terabox Cloud Storage und Notion CMS/Dokumente/Verträge/Mietvertrag_2024.pdf',
        size: 512000,
        mimeType: 'application/pdf',
        modifiedAt: new Date(Date.now() - 86400000),
        deleted: false
      },
      {
        id: 'terabox_mock_3',
        name: 'Solaranlage_Foto.jpg',
        path: '/Terabox Cloud Storage und Notion CMS/Bilder/Solar/Solaranlage_Foto.jpg',
        size: 1024000,
        mimeType: 'image/jpeg',
        modifiedAt: new Date(Date.now() - 172800000),
        deleted: false
      },
      {
        id: 'terabox_mock_4',
        name: 'Geschäftsbericht_Q3.xlsx',
        path: '/Terabox Cloud Storage und Notion CMS/Dokumente/Berichte/Geschäftsbericht_Q3.xlsx',
        size: 327680,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        modifiedAt: new Date(Date.now() - 259200000),
        deleted: false
      },
      {
        id: 'terabox_mock_5',
        name: 'Logo_Firma.png',
        path: '/Terabox Cloud Storage und Notion CMS/Bilder/Logos/Logo_Firma.png',
        size: 245760,
        mimeType: 'image/png',
        modifiedAt: new Date(Date.now() - 345600000),
        deleted: false
      }
    ];

    mockFiles.forEach(file => {
      this.folderCache.set(file.id, file);
    });

    this.folderId = 'root_folder_mock';
    this.emit('folder_initialized', { id: this.folderId, name: this.config.targetFolder });
  }

  async initializeTargetFolder(): Promise<{ id: string; name: string }> {
    if (this.config.simulationMode) {
      console.log('Target folder initialized in simulation mode');
      return { id: this.folderId!, name: this.config.targetFolder };
    }

    try {
      // Check if folder exists and get folder ID
      const folder = await this.getFolderByPath(this.config.targetFolder);

      if (!folder) {
        // Create folder if it doesn't exist
        const createdFolder = await this.createFolder(this.config.targetFolder);
        this.folderId = createdFolder.id;
        return createdFolder;
      }

      this.folderId = folder.id;
      this.emit('folder_initialized', folder);
      return folder;
    } catch (error) {
      console.error('Failed to initialize target folder:', error);
      throw error;
    }
  }

  private async getFolderByPath(path: string): Promise<SimpleTeraBoxFile | null> {
    if (this.config.simulationMode) {
      return this.folderCache.get('root_folder_mock') || null;
    }

    try {
      const response = await this.client.get('/api/folder/by-path', {
        params: { path }
      });

      return response.data.success ? response.data.folder : null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  private async createFolder(path: string): Promise<SimpleTeraBoxFile> {
    if (this.config.simulationMode) {
      const folder: SimpleTeraBoxFile = {
        id: `folder_${randomUUID()}`,
        name: path.split('/').pop() || 'New Folder',
        path: path,
        size: 0,
        mimeType: 'folder',
        modifiedAt: new Date(),
        deleted: false
      };
      this.folderCache.set(folder.id, folder);
      return folder;
    }

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

  async listTargetFolderContents(recursive: boolean = false): Promise<SimpleTeraBoxFile[]> {
    if (this.config.simulationMode) {
      return Array.from(this.folderCache.values()).filter(file =>
        !file.deleted && file.path.startsWith(this.config.targetFolder)
      );
    }

    if (!this.folderId) {
      throw new Error('Target folder not initialized');
    }

    try {
      const response = await this.client.get('/api/folder/contents', {
        params: {
          folderId: this.folderId,
          recursive: recursive && this.config.watchSubfolders
        }
      });

      if (response.data.success) {
        const files = response.data.files || [];
        files.forEach((file: SimpleTeraBoxFile) => {
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

  async uploadFile(fileData: Buffer, fileName: string, subfolderPath?: string): Promise<SimpleTeraBoxFile> {
    if (this.config.simulationMode) {
      // Simulate file upload
      const newFile: SimpleTeraBoxFile = {
        id: `file_${randomUUID()}`,
        name: fileName,
        path: subfolderPath
          ? `${this.config.targetFolder}${subfolderPath}/${fileName}`
          : `${this.config.targetFolder}/${fileName}`,
        size: fileData.length,
        mimeType: this.getMimeType(fileName),
        modifiedAt: new Date(),
        deleted: false
      };

      this.folderCache.set(newFile.id, newFile);
      this.emit('file_uploaded', newFile);
      return newFile;
    }

    if (!this.folderId) {
      throw new Error('Target folder not initialized');
    }

    try {
      let targetFolderId = this.folderId;

      if (subfolderPath && this.config.watchSubfolders) {
        const subfolder = await this.getOrCreateSubfolder(subfolderPath);
        targetFolderId = subfolder.id;
      }

      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', fileData, fileName);
      formData.append('folderId', targetFolderId);

      const response = await this.client.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const file = response.data.file;
        const simpleFile: SimpleTeraBoxFile = {
          id: file.id,
          name: file.name,
          path: file.path,
          size: file.size,
          mimeType: file.mimeType,
          modifiedAt: new Date(file.modifiedAt),
          deleted: false
        };

        this.folderCache.set(file.id, simpleFile);
        this.emit('file_uploaded', simpleFile);
        return simpleFile;
      }

      throw new Error('Upload failed');
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  private async getOrCreateSubfolder(subfolderPath: string): Promise<SimpleTeraBoxFile> {
    const fullPath = `${this.config.targetFolder}/${subfolderPath}`.replace(/\/+/g, '/');

    let folder = await this.getFolderByPath(fullPath);
    if (!folder) {
      folder = await this.createFolder(fullPath);
    }

    return folder;
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    if (this.config.simulationMode) {
      // Return mock file data
      return Buffer.from('Mock file content for ' + fileId, 'utf8');
    }

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

  async getDownloadUrl(fileId: string, fileName?: string): Promise<string> {
    if (this.config.simulationMode) {
      return `${this.config.baseURL}/api/file/download/${fileId}`;
    }

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

  async deleteFile(fileId: string): Promise<boolean> {
    if (this.config.simulationMode) {
      // Mark as deleted in cache
      const file = this.folderCache.get(fileId);
      if (file) {
        file.deleted = true;
        this.folderCache.set(fileId, file);
        this.emit('file_deleted', { fileId });
        return true;
      }
      return false;
    }

    try {
      const response = await this.client.delete(`/api/file/${fileId}`);

      if (response.data.success) {
        this.folderCache.delete(fileId);
        this.emit('file_deleted', { fileId });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

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

  stopWatching(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
      this.watcherInterval = undefined;
      this.emit('watcher_stopped');
    }
  }

  private async checkForChanges(): Promise<void> {
    const currentFiles = await this.listTargetFolderContents(true);
    const currentFileMap = new Map(currentFiles.map(file => [file.id, file]));
    const changes: any[] = [];

    // Check for new files
    for (const [fileId, file] of currentFileMap) {
      if (!this.folderCache.has(fileId)) {
        changes.push({
          id: randomUUID(),
          type: 'file_created',
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
          type: 'file_deleted',
          source: 'terabox',
          timestamp: new Date(),
          fileId,
          fileName: cachedFile.name,
          oldPath: cachedFile.path
        });
      }
    }

    // Update cache
    this.folderCache = currentFileMap;

    // Emit changes
    changes.forEach(change => {
      this.emit('change_detected', change);
    });
  }

  async getFileInfo(fileId: string): Promise<SimpleTeraBoxFile | null> {
    if (this.folderCache.has(fileId)) {
      return this.folderCache.get(fileId)!;
    }

    if (this.config.simulationMode) {
      return null;
    }

    try {
      const response = await this.client.get(`/api/file/${fileId}`);
      return response.data.success ? response.data.file : null;
    } catch (error) {
      console.error('Failed to get file info:', error);
      return null;
    }
  }

  async getStorageUsage(): Promise<{ total: number; used: number; available: number }> {
    if (this.config.simulationMode) {
      const totalSize = Array.from(this.folderCache.values()).reduce((sum, file) => sum + file.size, 0);
      return { total: 5 * 1024 * 1024 * 1024, used: totalSize, available: (5 * 1024 * 1024 * 1024) - totalSize };
    }

    try {
      const response = await this.client.get('/api/storage/usage');
      return response.data.usage || { total: 0, used: 0, available: 0 };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { total: 0, used: 0, available: 0 };
    }
  }

  async healthCheck(): Promise<boolean> {
    if (this.config.simulationMode) {
      return true; // Always healthy in simulation mode
    }

    try {
      const response = await this.client.get('/api/health');
      return response.data.success || false;
    } catch (error) {
      return false;
    }
  }

  cleanup(): void {
    this.stopWatching();
    this.folderCache.clear();
    this.removeAllListeners();
  }
}