/**
 * Fixed Notion Client with realistic API endpoints
 * Works with Notion API or simulation mode
 */

import { Client } from '@notionhq/client';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { SimpleNotionEntry } from './simplified-types';

export class NotionClientFixed extends EventEmitter {
  private client: Client | undefined;
  private config: {
    token: string;
    workspaceId: string;
    workspaceName?: string;
    databaseId?: string;
    databaseName?: string;
    pollingInterval: number;
    restrictToWorkspace: boolean;
    simulationMode: boolean;
  };
  private pageCache: Map<string, SimpleNotionEntry> = new Map();
  private databaseId: string | null = null;
  private watcherInterval?: NodeJS.Timeout;

  constructor(config: {
    token: string;
    workspaceId: string;
    workspaceName?: string;
    databaseId?: string;
    databaseName?: string;
    pollingInterval?: number;
    restrictToWorkspace?: boolean;
    simulationMode?: boolean;
  }) {
    super();
    this.config = {
      token: config.token,
      workspaceId: config.workspaceId,
      workspaceName: config.workspaceName,
      databaseId: config.databaseId,
      databaseName: config.databaseName || 'TeraBox File Sync',
      pollingInterval: config.pollingInterval || 10000,
      restrictToWorkspace: config.restrictToWorkspace !== false,
      simulationMode: config.simulationMode || !config.token
    };

    if (this.config.token && !this.config.simulationMode) {
      this.client = new Client({
        auth: config.token
      });
    } else {
      console.log('Notion client initialized in simulation mode');
      this.initializeMockData();
    }
  }

  private initializeMockData(): void {
    console.log('Initializing Notion in simulation mode with mock data...');

    const mockEntries: SimpleNotionEntry[] = [
      {
        id: 'notion_mock_1',
        fileId: 'terabox_mock_1',
        fileName: 'Rechnung_2024_001.pdf',
        filePath: '/Dokumente/Rechnungen/Rechnung_2024_001.pdf',
        fileSize: 245760,
        fileType: 'pdf',
        teraboxUrl: 'https://nephobox.com/download/terabox_mock_1',
        notionUrl: 'https://notion.so/page/notion_mock_1',
        lastModified: new Date(),
        syncStatus: 'synced',
        deletedInTeraBox: false,
        deletedInNotion: false,
        ocrAnalyzed: true,
        extractedText: 'Rechnung Nr. 2024-001\nBetrag: €1.234,56\nDatum: 15.10.2024\nKunde: Solar Energy GmbH'
      },
      {
        id: 'notion_mock_2',
        fileId: 'terabox_mock_2',
        fileName: 'Mietvertrag_2024.pdf',
        filePath: '/Dokumente/Verträge/Mietvertrag_2024.pdf',
        fileSize: 512000,
        fileType: 'pdf',
        teraboxUrl: 'https://nephobox.com/download/terabox_mock_2',
        notionUrl: 'https://notion.so/page/notion_mock_2',
        lastModified: new Date(Date.now() - 86400000),
        syncStatus: 'synced',
        deletedInTeraBox: false,
        deletedInNotion: false,
        ocrAnalyzed: true,
        extractedText: 'Mietvertrag\nVertragsbeginn: 01.01.2024\nVertragsende: 31.12.2024'
      },
      {
        id: 'notion_mock_3',
        fileId: 'terabox_mock_3',
        fileName: 'Solaranlage_Foto.jpg',
        filePath: '/Bilder/Solar/Solaranlage_Foto.jpg',
        fileSize: 1024000,
        fileType: 'image',
        teraboxUrl: 'https://nephobox.com/download/terabox_mock_3',
        notionUrl: 'https://notion.so/page/notion_mock_3',
        lastModified: new Date(Date.now() - 172800000),
        syncStatus: 'synced',
        deletedInTeraBox: false,
        deletedInNotion: false,
        ocrAnalyzed: true,
        extractedText: 'Solaranlage auf dem Dach\nInstallation: 15.05.2024\nLeistung: 10kWp'
      }
    ];

    mockEntries.forEach(entry => {
      this.pageCache.set(entry.fileId, entry);
    });

    this.databaseId = 'database_mock_id';
    this.emit('database_created', { id: this.databaseId, name: this.config.databaseName });
  }

  async initializeWorkspace(): Promise<{ id: string; name: string }> {
    if (this.config.simulationMode) {
      console.log('Workspace initialized in simulation mode');
      return { id: 'workspace_mock_id', name: this.config.workspaceName || 'Mock Workspace' };
    }

    try {
      const databases = await this.client.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      if (!this.config.databaseId) {
        // Create new database for sync
        const database = await this.createSyncDatabase();
        this.config.databaseId = database.id;
        return database;
      } else {
        // Verify existing database exists in workspace
        const database = await this.getDatabase(this.config.databaseId);
        if (!database) {
          throw new Error(`Database ${this.config.databaseId} not found in workspace`);
        }
        return database;
      }
    } catch (error) {
      console.error('Failed to initialize workspace:', error);
      throw error;
    }
  }

  private async createSyncDatabase(): Promise<{ id: string; name: string }> {
    try {
      const databaseName = this.config.databaseName || 'TeraBox File Sync';

      const response = await this.client.databases.create({
        parent: {
          type: 'page_id',
          page_id: await this.getOrCreateRootPage()
        },
        title: [
          {
            type: 'text',
            text: {
              content: databaseName
            }
          }
        ],
        properties: this.getDatabaseProperties()
      });

      const database = {
        id: response.id,
        name: databaseName
      };

      this.config.databaseId = database.id;
      this.emit('database_created', database);
      return database;
    } catch (error) {
      console.error('Failed to create sync database:', error);
      throw error;
    }
  }

  private async getOrCreateRootPage(): Promise<string> {
    try {
      // Search for existing sync root page
      const searchResponse = await this.client.search({
        query: 'TeraBox Sync Root',
        filter: {
          property: 'object',
          value: 'page'
        }
      });

      const existingPage = searchResponse.results.find((page: any) =>
        page.properties.title?.title?.[0]?.plain_text === 'TeraBox Sync Root'
      );

      if (existingPage) {
        return existingPage.id;
      }

      // Create new root page - fallback to workspace root
      return 'workspace_root';
    } catch (error) {
      console.error('Failed to get or create root page:', error);
      return 'workspace_root';
    }
  }

  private getDatabaseProperties(): Record<string, any> {
    return {
      'File ID': {
        type: 'rich_text',
        rich_text: {}
      },
      'File Name': {
        type: 'title',
        title: {}
      },
      'File Path': {
        type: 'rich_text',
        rich_text: {}
      },
      'File Size': {
        type: 'number',
        number: {
          format: 'byte'
        }
      },
      'File Type': {
        type: 'select',
        select: {
          options: [
            { name: 'PDF', color: 'red' },
            { name: 'Image', color: 'yellow' },
            { name: 'Document', color: 'blue' },
            { name: 'Video', color: 'green' },
            { name: 'Audio', color: 'purple' },
            { name: 'Other', color: 'gray' }
          ]
        }
      },
      'TeraBox URL': {
        type: 'url',
        url: {}
      },
      'Last Modified': {
        type: 'date',
        date: {}
      },
      'Sync Status': {
        type: 'select',
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending', color: 'yellow' },
            { name: 'Conflict', color: 'red' },
            { name: 'Error', color: 'orange' }
          ]
        }
      },
      'Deleted in TeraBox': {
        type: 'checkbox',
        checkbox: {}
      },
      'Deleted in Notion': {
        type: 'checkbox',
        checkbox: {}
      },
      'OCR Analyzed': {
        type: 'checkbox',
        checkbox: {}
      },
      'Extracted Text': {
        type: 'rich_text',
        rich_text: {}
      }
    };
  }

  private async getDatabase(databaseId: string): Promise<any> {
    try {
      const database = await this.client.databases.retrieve({ database_id: databaseId });
      return database;
    } catch (error) {
      console.error('Failed to get database:', error);
      return null;
    }
  }

  async createFileEntry(fileEntry: SimpleNotionEntry): Promise<SimpleNotionEntry> {
    if (this.config.simulationMode) {
      const createdEntry: SimpleNotionEntry = {
        ...fileEntry,
        id: randomUUID(),
        pageId: randomUUID()
      };
      this.pageCache.set(createdEntry.fileId, createdEntry);
      this.emit('file_entry_created', createdEntry);
      return createdEntry;
    }

    if (!this.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.pages.create({
        parent: {
          type: 'database_id',
          database_id: this.databaseId
        },
        properties: this.mapFileEntryToNotionProperties(fileEntry)
      });

      const createdEntry: SimpleNotionEntry = {
        ...fileEntry,
        id: response.id,
        pageId: response.id
      };

      this.pageCache.set(createdEntry.fileId, createdEntry);
      this.emit('file_entry_created', createdEntry);
      return createdEntry;
    } catch (error) {
      console.error('Failed to create file entry:', error);
      throw error;
    }
  }

  async updateFileEntry(fileId: string, updates: Partial<SimpleNotionEntry>): Promise<SimpleNotionEntry> {
    const existingEntry = this.pageCache.get(fileId);
    if (!existingEntry) {
      throw new Error('File entry not found');
    }

    if (this.config.simulationMode) {
      const updatedEntry = { ...existingEntry, ...updates };
      this.pageCache.set(fileId, updatedEntry);
      this.emit('file_entry_updated', updatedEntry);
      return updatedEntry;
    }

    try {
      const updatedEntry = { ...existingEntry, ...updates };
      const response = await this.client.pages.update({
        page_id: existingEntry.pageId!,
        properties: this.mapFileEntryToNotionProperties(updatedEntry)
      });

      this.pageCache.set(fileId, updatedEntry);
      this.emit('file_entry_updated', updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Failed to update file entry:', error);
      throw error;
    }
  }

  async deleteFileEntry(fileId: string): Promise<boolean> {
    const entry = this.pageCache.get(fileId);
    if (!entry) {
      return false;
    }

    if (this.config.simulationMode) {
      this.pageCache.delete(fileId);
      this.emit('file_entry_deleted', { fileId });
      return true;
    }

    try {
      // Mark as deleted instead of actually deleting the page
      await this.updateFileEntry(fileId, {
        deletedInNotion: true,
        syncStatus: 'deleted'
      });

      this.pageCache.delete(fileId);
      this.emit('file_entry_deleted', { fileId });
      return true;
    } catch (error) {
      console.error('Failed to delete file entry:', error);
      throw error;
    }
  }

  private mapFileEntryToNotionProperties(entry: SimpleNotionEntry): Record<string, any> {
    return {
      'File ID': {
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.fileId
            }
          }
        ]
      },
      'File Name': {
        title: [
          {
            type: 'text',
            text: {
              content: entry.fileName
            }
          }
        ]
      },
      'File Path': {
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.filePath
            }
          }
        ]
      },
      'File Size': {
        number: entry.fileSize
      },
      'File Type': {
        select: {
          name: this.getFileTypeLabel(entry.fileType)
        }
      },
      'TeraBox URL': {
        url: entry.teraboxUrl
      },
      'Last Modified': {
        date: {
          start: entry.lastModified.toISOString()
        }
      },
      'Sync Status': {
        select: {
          name: entry.syncStatus
        }
      },
      'Deleted in TeraBox': {
        checkbox: entry.deletedInTeraBox
      },
      'Deleted in Notion': {
        checkbox: entry.deletedInNotion
      },
      'OCR Analyzed': {
        checkbox: entry.ocrAnalyzed
      },
      'Extracted Text': entry.extractedText ? {
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.extractedText.substring(0, 2000)
            }
          }
        ]
      } : undefined
    };
  }

  private getFileTypeLabel(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'Document';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    return 'Other';
  }

  async getAllFileEntries(): Promise<SimpleNotionEntry[]> {
    if (this.config.simulationMode) {
      return Array.from(this.pageCache.values());
    }

    if (!this.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Deleted in Notion',
          checkbox: {
            equals: false
          }
        }
      });

      const entries: SimpleNotionEntry[] = [];

      for (const page of response.results as any[]) {
        const entry = this.mapNotionPageToFileEntry(page);
        if (entry) {
          this.pageCache.set(entry.fileId, entry);
          entries.push(entry);
        }
      }

      return entries;
    } catch (error) {
      console.error('Failed to query file entries:', error);
      return [];
    }
  }

  private mapNotionPageToFileEntry(page: any): SimpleNotionEntry | null {
    try {
      const properties = page.properties;

      const fileId = properties['File ID']?.rich_text?.[0]?.plain_text;
      if (!fileId) return null;

      return {
        id: page.id,
        fileId,
        fileName: properties['File Name']?.title?.[0]?.plain_text || '',
        filePath: properties['File Path']?.rich_text?.[0]?.plain_text || '',
        fileSize: properties['File Size']?.number || 0,
        fileType: this.extractFileType(properties),
        teraboxUrl: properties['TeraBox URL']?.url || '',
        notionUrl: page.url,
        lastModified: new Date(properties['Last Modified']?.date?.start || Date.now()),
        syncStatus: properties['Sync Status']?.select?.name || 'pending',
        deletedInTeraBox: properties['Deleted in TeraBox']?.checkbox || false,
        deletedInNotion: properties['Deleted in Notion']?.checkbox || false,
        ocrAnalyzed: properties['OCR Analyzed']?.checkbox || false,
        extractedText: properties['Extracted Text']?.rich_text?.[0]?.plain_text
      };
    } catch (error) {
      console.error('Failed to map Notion page to file entry:', error);
      return null;
    }
  }

  private extractFileType(properties: any): string {
    const fileType = properties['File Type']?.select?.name;
    if (fileType && fileType !== 'Other') {
      return fileType.toLowerCase();
    }

    // Fallback: try to infer from file name
    const fileName = properties['File Name']?.title?.[0]?.plain_text || '';
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac'].includes(extension || '')) return 'audio';

    return 'other';
  }

  startWatching(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
    }

    this.watcherInterval = setInterval(async () => {
      try {
        await this.checkForChanges();
      } catch (error) {
        console.error('Error checking Notion for changes:', error);
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
    const currentEntries = await this.getAllFileEntries();
    const currentEntryMap = new Map(currentEntries.map(entry => [entry.fileId, entry]));
    const changes: any[] = [];

    // Check for new entries
    for (const [fileId, entry] of currentEntryMap) {
      if (!this.pageCache.has(fileId)) {
        changes.push({
          id: randomUUID(),
          type: 'file_created',
          source: 'notion',
          timestamp: new Date(),
          fileId,
          fileName: entry.fileName,
          newPath: entry.filePath,
          metadata: { notionPageId: entry.pageId }
        });
      }
    }

    // Check for deleted entries
    for (const [fileId, cachedEntry] of this.pageCache) {
      if (!currentEntryMap.has(fileId) && !cachedEntry.deletedInNotion) {
        changes.push({
          id: randomUUID(),
          type: 'file_deleted',
          source: 'notion',
          timestamp: new Date(),
          fileId,
          fileName: cachedEntry.fileName,
          oldPath: cachedEntry.filePath
        });
      }
    }

    // Update cache
    this.pageCache = currentEntryMap;

    // Emit changes
    changes.forEach(change => {
      this.emit('change_detected', change);
    });
  }

  async searchFiles(query: string): Promise<SimpleNotionEntry[]> {
    if (this.config.simulationMode) {
      return Array.from(this.pageCache.values()).filter(entry =>
        entry.fileName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (!this.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'File Name',
              title: {
                contains: query
              }
            },
            {
              property: 'Deleted in Notion',
              checkbox: {
                equals: false
              }
            }
          ]
        }
      });

      const entries: SimpleNotionEntry[] = [];

      for (const page of response.results as any[]) {
        const entry = this.mapNotionPageToFileEntry(page);
        if (entry) {
          entries.push(entry);
        }
      }

      return entries;
    } catch (error) {
      console.error('Failed to search files:', error);
      return [];
    }
  }

  async getFileEntry(fileId: string): Promise<SimpleNotionEntry | null> {
    if (this.pageCache.has(fileId)) {
      return this.pageCache.get(fileId)!;
    }

    if (this.config.simulationMode) {
      return null;
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId!,
        filter: {
          property: 'File ID',
          rich_text: {
            equals: fileId
          }
        }
      });

      if (response.results.length > 0) {
        const entry = this.mapNotionPageToFileEntry(response.results[0]);
        if (entry) {
          this.pageCache.set(fileId, entry);
          return entry;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get file entry:', error);
      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    if (this.config.simulationMode) {
      return true; // Always healthy in simulation mode
    }

    try {
      if (this.client) {
        await this.client.users.me();
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  cleanup(): void {
    this.stopWatching();
    this.pageCache.clear();
    this.removeAllListeners();
  }
}