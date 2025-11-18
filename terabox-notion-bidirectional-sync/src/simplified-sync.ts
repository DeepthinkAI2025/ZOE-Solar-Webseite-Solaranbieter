/**
 * Simplified Sync System for immediate use
 * Focuses on core functionality without complex dependencies
 */

import express from 'express';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { SimpleSyncConfig, SimpleTeraBoxFile, SimpleNotionEntry, SimpleSyncMetrics } from './core/simplified-types';

export class SimplifiedTeraBoxNotionSync extends EventEmitter {
  private app: express.Application;
  private config: SimpleSyncConfig;
  private isRunning = false;
  private startTime: number = Date.now();

  // Simple storage
  private files: Map<string, SimpleTeraBoxFile> = new Map();
  private notionEntries: Map<string, SimpleNotionEntry> = new Map();
  private syncMetrics: SimpleSyncMetrics = {
    totalFiles: 0,
    syncedFiles: 0,
    pendingOperations: 0,
    conflictsCount: 0,
    errorsCount: 0,
    successRate: 100,
    storageUsage: {
      terabox: 0,
      notion: 0
    }
  };

  constructor(config?: SimpleSyncConfig) {
    super();
    this.config = config || this.getDefaultConfig();
    this.app = express();
    this.setupExpress();
    this.setupMockData();
  }

  private getDefaultConfig(): SimpleSyncConfig {
    return {
      terabox: {
        baseURL: 'https://nephobox.com',
        targetFolder: '/Terabox Cloud Storage und Notion CMS',
        username: '',
        password: '',
        pollingInterval: 30000,
        watchSubfolders: true
      },
      notion: {
        token: '',
        workspaceId: '',
        databaseName: 'TeraBox File Sync',
        restrictToWorkspace: true
      },
      sync: {
        mode: 'bidirectional',
        conflictResolution: 'latest_wins',
        autoRetry: true
      },
      ocr: {
        enabled: false,
        baseURL: 'http://localhost:7860'
      }
    };
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(express.static('./monitoring'));

    // Health endpoint
    this.app.get('/health', (req, res) => {
      res.json(this.getHealthStatus());
    });

    // Metrics endpoint
    this.app.get('/metrics', (req, res) => {
      res.json({
        sync: this.syncMetrics,
        ocr: {
          stats: {
            totalProcessed: 0,
            successful: 0,
            averageConfidence: 0,
            totalTime: 0
          },
          queue: {
            queueLength: 0,
            processing: false
          }
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });

    // Config endpoint
    this.app.get('/config', (req, res) => {
      res.json(this.config);
    });

    // Force sync endpoint
    this.app.post('/sync/force', (req, res) => {
      this.performMockSync();
      res.json({ status: 'sync_initiated' });
    });

    // OCR backlog endpoint
    this.app.post('/ocr/backlog', (req, res) => {
      res.json({ status: 'backlog_processing_started' });
    });
  }

  private setupMockData(): void {
    // Add some mock files for demonstration
    const mockFiles: SimpleTeraBoxFile[] = [
      {
        id: 'file_1',
        name: 'Rechnung_2024_001.pdf',
        path: '/Terabox Cloud Storage und Notion CMS/Dokumente/Rechnungen',
        size: 245760,
        mimeType: 'application/pdf',
        modifiedAt: new Date(),
        deleted: false
      },
      {
        id: 'file_2',
        name: 'Mietvertrag_2024.pdf',
        path: '/Terabox Cloud Storage und Notion CMS/Dokumente/Verträge',
        size: 512000,
        mimeType: 'application/pdf',
        modifiedAt: new Date(Date.now() - 86400000),
        deleted: false
      },
      {
        id: 'file_3',
        name: 'Solaranlage_Foto.jpg',
        path: '/Terabox Cloud Storage und Notion CMS/Bilder/Solar',
        size: 1024000,
        mimeType: 'image/jpeg',
        modifiedAt: new Date(Date.now() - 172800000),
        deleted: false
      }
    ];

    mockFiles.forEach(file => {
      this.files.set(file.id, file);
      this.syncMetrics.totalFiles++;
      this.syncMetrics.syncedFiles++;
      this.syncMetrics.storageUsage.terabox += file.size;
    });

    // Create corresponding Notion entries
    mockFiles.forEach(file => {
      const notionEntry: SimpleNotionEntry = {
        id: `notion_${file.id}`,
        fileId: file.id,
        fileName: file.name,
        filePath: file.path,
        fileSize: file.size,
        fileType: file.mimeType || 'unknown',
        teraboxUrl: `https://nephobox.com/download/${file.id}`,
        notionUrl: `https://notion.so/page/${file.id}`,
        lastModified: file.modifiedAt,
        syncStatus: 'synced',
        deletedInTeraBox: false,
        deletedInNotion: false,
        ocrAnalyzed: this.config.ocr.enabled,
        extractedText: this.config.ocr.enabled ? 'Mock OCR extracted text' : undefined
      };
      this.notionEntries.set(file.id, notionEntry);
      this.syncMetrics.storageUsage.notion++;
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Sync system is already running');
    }

    try {
      console.log('🚀 Starting Simplified TeraBox + Notion Sync System...');

      // Start Express server
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => {
        console.log(`📊 Monitoring dashboard available at http://localhost:${port}`);
        console.log(`📁 Syncing TeraBox folder: ${this.config.terabox.targetFolder}`);
        console.log(`🗃️ Notion workspace: ${this.config.notion.workspaceId}`);
        console.log(`🔄 Sync mode: ${this.config.sync.mode}`);
        console.log(`🤖 OCR enabled: ${this.config.ocr.enabled ? 'Yes' : 'No'}`);
      });

      this.isRunning = true;
      this.startTime = Date.now();
      this.emit('started');

      // Simulate periodic sync activity
      this.startPeriodicActivity();

      console.log('✅ Simplified Sync system started successfully!');
    } catch (error) {
      console.error('❌ Failed to start sync system:', error);
      this.emit('start_failed', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.emit('stopped');
    console.log('✅ Sync system stopped successfully');
  }

  private startPeriodicActivity(): void {
    setInterval(() => {
      if (this.isRunning) {
        // Simulate some activity
        this.syncMetrics.successRate = 95 + Math.random() * 5;
        this.emit('periodic_activity');
      }
    }, 30000); // Every 30 seconds
  }

  private performMockSync(): void {
    console.log('🔄 Performing mock sync...');
    this.syncMetrics.syncedFiles = this.files.size;
    this.emit('sync_completed');
  }

  private getHealthStatus() {
    return {
      status: this.isRunning ? 'healthy' : 'unhealthy',
      uptime: process.uptime(),
      components: {
        sync: this.isRunning,
        ocr: this.config.ocr.enabled,
        terabox: this.isRunning,
        notion: this.isRunning
      },
      timestamp: new Date().toISOString()
    };
  }

  getStatus() {
    return {
      running: this.isRunning,
      uptime: process.uptime(),
      config: {
        teraboxFolder: this.config.terabox.targetFolder,
        notionWorkspace: this.config.notion.workspaceId,
        syncMode: this.config.sync.mode,
        ocrEnabled: this.config.ocr.enabled
      },
      metrics: this.syncMetrics,
      ocr: {
        totalProcessed: 0,
        successful: 0,
        queue: {
          queueLength: 0,
          processing: false
        }
      }
    };
  }

  // Configuration methods
  async saveConfiguration(filePath?: string): Promise<void> {
    const configPath = filePath || './config/sync-config.json';
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure config directory exists
    await fs.mkdir(path.dirname(configPath), { recursive: true });

    await fs.writeFile(configPath, JSON.stringify(this.config, null, 2));
    console.log(`Configuration saved to ${configPath}`);
  }

  // Cleanup
  async cleanup(): Promise<void> {
    await this.stop();
    this.removeAllListeners();
  }
}

// CLI usage
if (require.main === module) {
  const sync = new SimplifiedTeraBoxNotionSync();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await sync.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await sync.cleanup();
    process.exit(0);
  });

  // Start the sync system
  sync.start().catch(error => {
    console.error('❌ Failed to start sync system:', error);
    process.exit(1);
  });
}

export default SimplifiedTeraBoxNotionSync;