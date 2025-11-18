/**
 * TeraBox + Notion Bidirectional Sync System
 * Main entry point for the universal starter kit
 */

import express from 'express';
import { EventEmitter } from 'events';
import { promises as fs, existsSync, readFileSync } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Core components
import { BidirectionalSyncEngine } from './core/sync-engine';
import { OCRIntegration } from './core/ocr-integration';
import { SyncConfig } from './core/types';

// Load environment variables
dotenv.config();

export class TeraBoxNotionSync extends EventEmitter {
  private syncEngine: BidirectionalSyncEngine;
  private ocrIntegration: OCRIntegration;
  private app: express.Application;
  private config: SyncConfig;
  private isRunning = false;

  constructor(config?: SyncConfig) {
    super();

    // Load configuration
    this.config = config || this.loadConfiguration();

    // Initialize Express app for web interface
    this.app = express();
    this.setupExpress();

    // Initialize core components
    this.syncEngine = new BidirectionalSyncEngine(this.config);
    this.ocrIntegration = new OCRIntegration(
      this.syncEngine.getTeraBoxClient(),
      this.syncEngine.getNotionClient(),
      this.config.ocr
    );

    this.setupEventHandlers();
  }

  /**
   * Load configuration from file or environment
   */
  private loadConfiguration(): SyncConfig {
    // Try to load from config file
    const configPath = path.join(__dirname, '../config/sync-config.json');

    if (existsSync(configPath)) {
      try {
        const configData = JSON.parse(readFileSync(configPath, 'utf8'));
        return this.mergeConfigWithEnv(configData);
      } catch (error) {
        console.warn('Failed to load config file, using environment variables:', error);
      }
    }

    // Load from environment variables
    return this.loadConfigFromEnv();
  }

  /**
   * Merge configuration with environment variables
   */
  private mergeConfigWithEnv(config: any): SyncConfig {
    return {
      terabox: {
        ...config.terabox,
        baseURL: process.env.TERABOX_BASE_URL || config.terabox.baseURL,
        targetFolder: process.env.TERABOX_TARGET_FOLDER || config.terabox.targetFolder,
        username: process.env.TERABOX_USERNAME || config.terabox.username,
        password: process.env.TERABOX_PASSWORD || config.terabox.password,
        apiKey: process.env.TERABOX_API_KEY || config.terabox.apiKey,
        pollingInterval: parseInt(process.env.TERABOX_POLLING_INTERVAL || '30000'),
        watchSubfolders: process.env.TERABOX_WATCH_SUBFOLDERS !== 'false'
      },
      notion: {
        ...config.notion,
        token: process.env.NOTION_TOKEN || config.notion.token,
        workspaceId: process.env.NOTION_WORKSPACE_ID || config.notion.workspaceId,
        workspaceName: process.env.NOTION_WORKSPACE_NAME || config.notion.workspaceName,
        databaseId: process.env.NOTION_DATABASE_ID || config.notion.databaseId,
        databaseName: process.env.NOTION_DATABASE_NAME || config.notion.databaseName,
        pollingInterval: parseInt(process.env.NOTION_POLLING_INTERVAL || '10000'),
        restrictToWorkspace: process.env.NOTION_RESTRICT_TO_WORKSPACE !== 'false'
      },
      sync: {
        ...config.sync,
        mode: (process.env.SYNC_MODE as any) || config.sync.mode,
        conflictResolution: (process.env.CONFLICT_RESOLUTION as any) || config.sync.conflictResolution,
        autoRetry: process.env.SYNC_AUTO_RETRY !== 'false',
        maxRetries: parseInt(process.env.SYNC_MAX_RETRIES || '3'),
        retryDelay: parseInt(process.env.SYNC_RETRY_DELAY || '5000'),
        batchSize: parseInt(process.env.SYNC_BATCH_SIZE || '10')
      },
      ocr: {
        enabled: process.env.OCR_ENABLED === 'true',
        baseURL: process.env.OCR_BASE_URL || null,
        apiKey: process.env.OCR_API_KEY || null,
        languages: (process.env.OCR_LANGUAGES || 'de,en').split(','),
        extractFinancialData: process.env.OCR_EXTRACT_FINANCIAL_DATA !== 'false'
      },
      logging: {
        level: (process.env.LOG_LEVEL as any) || 'info',
        file: process.env.LOG_FILE || 'sync.log',
        maxFiles: parseInt(process.env.LOG_MAX_FILES || '5'),
        maxSize: process.env.LOG_MAX_SIZE || '10MB'
      }
    };
  }

  /**
   * Load configuration from environment variables only
   */
  private loadConfigFromEnv(): SyncConfig {
    return {
      terabox: {
        baseURL: process.env.TERABOX_BASE_URL || 'https://nephobox.com',
        targetFolder: process.env.TERABOX_TARGET_FOLDER || '/Terabox Cloud Storage und Notion CMS',
        username: process.env.TERABOX_USERNAME || '',
        password: process.env.TERABOX_PASSWORD || '',
        apiKey: process.env.TERABOX_API_KEY || '',
        pollingInterval: parseInt(process.env.TERABOX_POLLING_INTERVAL || '30000'),
        watchSubfolders: process.env.TERABOX_WATCH_SUBFOLDERS !== 'false'
      },
      notion: {
        token: process.env.NOTION_TOKEN || '',
        workspaceId: process.env.NOTION_WORKSPACE_ID || '',
        workspaceName: process.env.NOTION_WORKSPACE_NAME || '',
        databaseId: process.env.NOTION_DATABASE_ID || '',
        databaseName: process.env.NOTION_DATABASE_NAME || 'TeraBox File Sync',
        pollingInterval: parseInt(process.env.NOTION_POLLING_INTERVAL || '10000'),
        restrictToWorkspace: true
      },
      sync: {
        mode: (process.env.SYNC_MODE as any) || 'bidirectional',
        conflictResolution: (process.env.CONFLICT_RESOLUTION as any) || 'latest_wins',
        autoRetry: true,
        maxRetries: 3,
        retryDelay: 5000,
        batchSize: 10
      },
      ocr: {
        enabled: process.env.OCR_ENABLED === 'true',
        baseURL: process.env.OCR_BASE_URL || '',
        apiKey: process.env.OCR_API_KEY || '',
        languages: ['de', 'en'],
        extractFinancialData: true
      },
      logging: {
        level: (process.env.LOG_LEVEL as any) || 'info',
        file: process.env.LOG_FILE || 'sync.log',
        maxFiles: 5,
        maxSize: '10MB'
      }
    };
  }

  /**
   * Setup Express server
   */
  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../monitoring')));

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const health = await this.getHealthStatus();
        res.json(health);
      } catch (error) {
        res.status(500).json({ status: 'error', error: (error as Error).message });
      }
    });

    // Metrics endpoint
    this.app.get('/metrics', async (req, res) => {
      try {
        const metrics = this.syncEngine.getMetrics();
        const ocrStats = this.ocrIntegration.getStats();
        const queueStatus = this.ocrIntegration.getQueueStatus();

        res.json({
          sync: metrics,
          ocr: {
            stats: ocrStats,
            queue: queueStatus
          },
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    // Configuration endpoint
    this.app.get('/config', (req, res) => {
      // Return sanitized configuration (without passwords/tokens)
      const sanitized = {
        terabox: {
          ...this.config.terabox,
          password: this.config.terabox.password ? '***' : undefined,
          apiKey: this.config.terabox.apiKey ? '***' : undefined
        },
        notion: {
          ...this.config.notion,
          token: this.config.notion.token ? '***' : undefined
        },
        sync: this.config.sync,
        ocr: this.config.ocr,
        logging: this.config.logging
      };
      res.json(sanitized);
    });

    // Force sync endpoint
    this.app.post('/sync/force', async (req, res) => {
      try {
        await this.syncEngine.forceSync();
        res.json({ status: 'sync_initiated' });
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    // Process OCR backlog endpoint
    this.app.post('/ocr/backlog', async (req, res) => {
      try {
        await this.ocrIntegration.processBacklog();
        res.json({ status: 'backlog_processing_started' });
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Sync engine events
    this.syncEngine.on('sync_initialized', (data) => {
      console.log('Sync system initialized:', data);
      this.emit('sync_initialized', data);
    });

    this.syncEngine.on('conflict_detected', (conflict) => {
      console.warn('Sync conflict detected:', conflict.description);
      this.emit('conflict_detected', conflict);
    });

    this.syncEngine.on('sync_failed', (error) => {
      console.error('Sync operation failed:', error);
      this.emit('sync_failed', error);
    });

    // OCR integration events
    this.ocrIntegration.on('ocr_processing_completed', (data) => {
      console.log('OCR processing completed:', data);
      this.emit('ocr_completed', data);
    });

    this.ocrIntegration.on('ocr_processing_failed', (error) => {
      console.error('OCR processing failed:', error);
      this.emit('ocr_failed', error);
    });
  }

  /**
   * Start the sync system
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Sync system is already running');
    }

    try {
      console.log('🚀 Starting TeraBox + Notion Sync System...');

      // Initialize sync engine
      await this.syncEngine.initialize();

      // Start OCR backlog processing if enabled
      if (this.config.ocr.enabled) {
        setTimeout(async () => {
          try {
            await this.ocrIntegration.processBacklog();
          } catch (error) {
            console.error('Failed to process OCR backlog:', error);
          }
        }, 5000); // Wait 5 seconds after sync initialization
      }

      // Start web server
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => {
        console.log(`📊 Monitoring dashboard available at http://localhost:${port}`);
      });

      this.isRunning = true;
      this.emit('started', { port, config: this.config });

      console.log('✅ TeraBox + Notion Sync System started successfully!');
      console.log(`📁 Syncing TeraBox folder: ${this.config.terabox.targetFolder}`);
      console.log(`🗃️ Notion workspace: ${this.config.notion.workspaceName || this.config.notion.workspaceId}`);
      console.log(`🔄 Sync mode: ${this.config.sync.mode}`);
      console.log(`🤖 OCR enabled: ${this.config.ocr.enabled ? 'Yes' : 'No'}`);

    } catch (error) {
      console.error('❌ Failed to start sync system:', error);
      this.emit('start_failed', error);
      throw error;
    }
  }

  /**
   * Stop the sync system
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      console.log('🛑 Stopping TeraBox + Notion Sync System...');

      await this.syncEngine.stop();
      this.ocrIntegration.cleanup();

      this.isRunning = false;
      this.emit('stopped');

      console.log('✅ Sync system stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop sync system:', error);
      this.emit('stop_failed', error);
      throw error;
    }
  }

  /**
   * Get health status
   */
  public async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy';
    uptime: number;
    components: {
      sync: boolean;
      ocr: boolean;
      terabox: boolean;
      notion: boolean;
    };
    timestamp: string;
  }> {
    const ocrHealth = await this.ocrIntegration.healthCheck();
    const syncMetrics = this.syncEngine.getMetrics();

    return {
      status: this.isRunning ? 'healthy' : 'unhealthy',
      uptime: process.uptime(),
      components: {
        sync: this.isRunning,
        ocr: ocrHealth.ocrEnabled && ocrHealth.ocrClientHealthy,
        terabox: syncMetrics.successRate > 80, // Simple health indicator
        notion: syncMetrics.successRate > 80
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get system status
   */
  public getStatus() {
    return {
      running: this.isRunning,
      uptime: process.uptime(),
      config: {
        teraboxFolder: this.config.terabox.targetFolder,
        notionWorkspace: this.config.notion.workspaceName || this.config.notion.workspaceId,
        syncMode: this.config.sync.mode,
        ocrEnabled: this.config.ocr.enabled
      },
      metrics: this.syncEngine.getMetrics(),
      ocr: {
        ...this.ocrIntegration.getStats(),
        queue: this.ocrIntegration.getQueueStatus()
      }
    };
  }

  /**
   * Save configuration to file
   */
  public async saveConfiguration(filePath?: string): Promise<void> {
    const configPath = filePath || path.join(__dirname, '../config/sync-config.json');
    const configDir = path.dirname(configPath);

    // Ensure config directory exists
    await fs.mkdir(configDir, { recursive: true });

    // Save configuration (without sensitive data)
    const sanitizedConfig = {
      ...this.config,
      terabox: {
        ...this.config.terabox,
        password: this.config.terabox.password ? '***' : undefined,
        apiKey: this.config.terabox.apiKey ? '***' : undefined
      },
      notion: {
        ...this.config.notion,
        token: this.config.notion.token ? '***' : undefined
      }
    };

    await fs.writeFile(configPath, JSON.stringify(sanitizedConfig, null, 2));
    console.log(`Configuration saved to ${configPath}`);
  }
}

// CLI usage
if (require.main === module) {
  const sync = new TeraBoxNotionSync();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    await sync.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    await sync.stop();
    process.exit(0);
  });

  // Start the sync system
  sync.start().catch(error => {
    console.error('❌ Failed to start sync system:', error);
    process.exit(1);
  });
}

export default TeraBoxNotionSync;