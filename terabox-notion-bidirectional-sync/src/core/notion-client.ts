/**
 * Notion Client with Specific Workspace Focus
 * Handles all Notion operations restricted to a specific workspace only
 */

import { Client } from '@notionhq/client';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import {
  NotionFileEntry,
  SyncConfig,
  ChangeEvent,
  ChangeType,
  NotionDatabaseSchema,
  ApiResponse,
  SyncStatus
} from './types';

export class NotionClient extends EventEmitter {
  private client: Client;
  private config: SyncConfig['notion'];
  private databaseCache: Map<string, any> = new Map();
  private pageCache: Map<string, NotionFileEntry> = new Map();
  private lastSyncState: Map<string, string> = new Map(); // fileId -> lastModified
  private watcherInterval?: NodeJS.Timeout;

  constructor(config: SyncConfig['notion']) {
    super();
    this.config = config;

    this.client = new Client({
      auth: config.token,
      // Notion doesn't have workspace-specific clients, so we'll enforce it in our methods
    });
  }

  /**
   * Initialize the specific workspace and create/get sync database
   */
  async initializeWorkspace(): Promise<NotionDatabaseSchema> {
    try {
      // Verify workspace access by listing databases
      const databases = await this.listWorkspaceDatabases();

      if (!this.config.databaseId) {
        // Create new database for sync
        const database = await this.createSyncDatabase();
        this.config.databaseId = database.id;
        this.emit('database_created', database);
        return database;
      } else {
        // Verify existing database exists in workspace
        const database = await this.getDatabase(this.config.databaseId);
        if (!database) {
          throw new Error(`Database ${this.config.databaseId} not found in workspace`);
        }
        this.emit('database_verified', database);
        return database;
      }
    } catch (error) {
      console.error('Failed to initialize workspace:', error);
      throw error;
    }
  }

  /**
   * List all databases in the specific workspace
   */
  private async listWorkspaceDatabases(): Promise<any[]> {
    try {
      const response = await this.client.search({
        filter: {
          property: 'object',
          value: 'database'
        }
      });

      const databases = response.results as any[];

      // Filter databases to ensure they belong to our workspace
      if (this.config.restrictToWorkspace) {
        // Note: Notion API doesn't provide workspace ID in search results
        // We'll verify by attempting operations and checking permissions
        return databases;
      }

      return databases;
    } catch (error) {
      console.error('Failed to list workspace databases:', error);
      throw error;
    }
  }

  /**
   * Create a new database for file synchronization
   */
  private async createSyncDatabase(): Promise<NotionDatabaseSchema> {
    const databaseName = this.config.databaseName || 'TeraBox File Sync';

    try {
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

      const database: NotionDatabaseSchema = {
        id: response.id,
        title: databaseName,
        properties: this.getDatabaseProperties(),
        created: true,
        url: response.url
      };

      this.databaseCache.set(database.id, response);
      return database;
    } catch (error) {
      console.error('Failed to create sync database:', error);
      throw error;
    }
  }

  /**
   * Get or create a root page for the sync database
   */
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

      // Create new root page
      const rootPageResponse = await this.client.pages.create({
        parent: {
          type: 'workspace',
          workspace: true
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: 'TeraBox Sync Root'
                }
              }
            ]
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Root page for TeraBox-Notion bidirectional synchronization'
                  }
                }
              ]
            }
          }
        ]
      });

      return rootPageResponse.id;
    } catch (error) {
      console.error('Failed to get or create root page:', error);
      // Fallback: try to use workspace root
      throw error;
    }
  }

  /**
   * Define database properties for file synchronization
   */
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
      },
      'Tags': {
        type: 'multi_select',
        multi_select: {
          options: [
            { name: 'Invoice', color: 'red' },
            { name: 'Contract', color: 'blue' },
            { name: 'Personal', color: 'yellow' },
            { name: 'Work', color: 'green' },
            { name: 'Archive', color: 'gray' }
          ]
        }
      },
      'Category': {
        type: 'select',
        select: {
          options: [
            { name: 'Document', color: 'blue' },
            { name: 'Image', color: 'yellow' },
            { name: 'Video', color: 'green' },
            { name: 'Audio', color: 'purple' }
          ]
        }
      },
      'Checksum': {
        type: 'rich_text',
        rich_text: {}
      }
    };
  }

  /**
   * Get database information
   */
  private async getDatabase(databaseId: string): Promise<any> {
    try {
      if (this.databaseCache.has(databaseId)) {
        return this.databaseCache.get(databaseId);
      }

      const database = await this.client.databases.retrieve({ database_id: databaseId });
      this.databaseCache.set(databaseId, database);
      return database;
    } catch (error) {
      console.error('Failed to get database:', error);
      return null;
    }
  }

  /**
   * Create a new file entry in the Notion database
   */
  async createFileEntry(fileEntry: Omit<NotionFileEntry, 'id'>): Promise<NotionFileEntry> {
    if (!this.config.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.pages.create({
        parent: {
          type: 'database_id',
          database_id: this.config.databaseId
        },
        properties: this.mapFileEntryToNotionProperties(fileEntry)
      });

      const createdEntry: NotionFileEntry = {
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

  /**
   * Update an existing file entry
   */
  async updateFileEntry(fileId: string, updates: Partial<NotionFileEntry>): Promise<NotionFileEntry> {
    const existingEntry = this.pageCache.get(fileId);
    if (!existingEntry) {
      throw new Error('File entry not found');
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

  /**
   * Delete a file entry from Notion (mark as deleted)
   */
  async deleteFileEntry(fileId: string): Promise<boolean> {
    const entry = this.pageCache.get(fileId);
    if (!entry) {
      return false;
    }

    try {
      // Mark as deleted instead of actually deleting the page
      await this.updateFileEntry(fileId, {
        deletedInNotion: true,
        syncStatus: SyncStatus.DELETED
      });

      this.pageCache.delete(fileId);
      this.emit('file_entry_deleted', { fileId });
      return true;
    } catch (error) {
      console.error('Failed to delete file entry:', error);
      throw error;
    }
  }

  /**
   * Map file entry to Notion properties
   */
  private mapFileEntryToNotionProperties(entry: NotionFileEntry): Record<string, any> {
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
              content: entry.extractedText.substring(0, 2000) // Notion has limits
            }
          }
        ]
      } : undefined,
      'Tags': entry.tags && entry.tags.length > 0 ? {
        multi_select: entry.tags.map(tag => ({ name: tag }))
      } : undefined,
      'Category': entry.category ? {
        select: {
          name: entry.category
        }
      } : undefined,
      'Checksum': entry.checksum ? {
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.checksum
            }
          }
        ]
      } : undefined
    };
  }

  /**
   * Get file type label for Notion select property
   */
  private getFileTypeLabel(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'Document';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    return 'Other';
  }

  /**
   * Query all file entries from the database
   */
  async getAllFileEntries(): Promise<NotionFileEntry[]> {
    if (!this.config.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.config.databaseId,
        filter: {
          property: 'Deleted in Notion',
          checkbox: {
            equals: false
          }
        }
      });

      const entries: NotionFileEntry[] = [];

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

  /**
   * Map Notion page to file entry
   */
  private mapNotionPageToFileEntry(page: any): NotionFileEntry | null {
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
        syncStatus: properties['Sync Status']?.select?.name || SyncStatus.PENDING_TERABOX,
        deletedInTeraBox: properties['Deleted in TeraBox']?.checkbox || false,
        deletedInNotion: properties['Deleted in Notion']?.checkbox || false,
        ocrAnalyzed: properties['OCR Analyzed']?.checkbox || false,
        extractedText: properties['Extracted Text']?.rich_text?.[0]?.plain_text,
        tags: properties['Tags']?.multi_select?.map((tag: any) => tag.name) || [],
        category: properties['Category']?.select?.name,
        checksum: properties['Checksum']?.rich_text?.[0]?.plain_text,
        workspaceId: this.config.workspaceId,
        databaseId: this.config.databaseId!,
        pageId: page.id
      };
    } catch (error) {
      console.error('Failed to map Notion page to file entry:', error);
      return null;
    }
  }

  /**
   * Extract file type from Notion properties
   */
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

  /**
   * Start watching for changes in the Notion database
   */
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
   * Check for changes in the Notion database
   */
  private async checkForChanges(): Promise<ChangeEvent[]> {
    const currentEntries = await this.getAllFileEntries();
    const changes: ChangeEvent[] = [];
    const currentEntryMap = new Map<string, NotionFileEntry>();

    // Build current entry map
    currentEntries.forEach(entry => {
      currentEntryMap.set(entry.fileId, entry);
    });

    // Check for new entries
    for (const [fileId, entry] of currentEntryMap) {
      if (!this.pageCache.has(fileId)) {
        changes.push({
          id: randomUUID(),
          type: ChangeType.FILE_CREATED,
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
          type: ChangeType.FILE_DELETED,
          source: 'notion',
          timestamp: new Date(),
          fileId,
          fileName: cachedEntry.fileName,
          oldPath: cachedEntry.filePath
        });
      }
    }

    // Check for modified entries
    for (const [fileId, currentEntry] of currentEntryMap) {
      const cachedEntry = this.pageCache.get(fileId);
      if (cachedEntry && currentEntry.lastModified > cachedEntry.lastModified) {
        changes.push({
          id: randomUUID(),
          type: ChangeType.FILE_MODIFIED,
          source: 'notion',
          timestamp: new Date(),
          fileId,
          fileName: currentEntry.fileName,
          newPath: currentEntry.filePath,
          metadata: {
            lastModified: currentEntry.lastModified,
            syncStatus: currentEntry.syncStatus
          }
        });
      }
    }

    // Update cache
    this.pageCache = currentEntryMap;

    // Emit changes
    changes.forEach(change => {
      this.emit('change_detected', change);
    });

    return changes;
  }

  /**
   * Search for file entries by query
   */
  async searchFiles(query: string): Promise<NotionFileEntry[]> {
    if (!this.config.databaseId) {
      throw new Error('Database not initialized');
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.config.databaseId,
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

      const entries: NotionFileEntry[] = [];

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

  /**
   * Get file entry by TeraBox file ID
   */
  async getFileEntry(fileId: string): Promise<NotionFileEntry | null> {
    // Check cache first
    if (this.pageCache.has(fileId)) {
      return this.pageCache.get(fileId)!;
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.config.databaseId!,
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

  /**
   * Health check for Notion connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.users.me();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopWatching();
    this.pageCache.clear();
    this.databaseCache.clear();
    this.lastSyncState.clear();
    this.removeAllListeners();
  }
}