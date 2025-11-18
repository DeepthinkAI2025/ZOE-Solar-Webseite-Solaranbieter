/**
 * DeepSeek OCR Integration for TeraBox-Notion Sync
 * Integrates with the existing DeepSeek OCR Starter Kit
 */

import { EventEmitter } from 'events';
import { TeraBoxClient } from './terabox-client';
import { NotionClient } from './notion-client';
import {
  NotionFileEntry,
  SyncConfig,
  ExtractedData,
  TeraBoxFile
} from './types';

// DeepSeek OCR Client Interfaces (from existing project)
interface DeepSeekOCRClient {
  performOCR(request: OCRRequest): Promise<OCRResponse>;
  checkHealth(): Promise<HealthResponse>;
  extractEmailData(imageBase64: string, language?: string): Promise<any>;
}

// Create a simplified client for now
function createDeepSeekOCRClient(baseURL: string, apiKey?: string): DeepSeekOCRClient {
  return {
    async performOCR(request: OCRRequest): Promise<OCRResponse> {
      // Simulate OCR processing for now
      return {
        success: true,
        text: "Extracted text from document",
        confidence: 0.95,
        language_detected: request.language || 'auto',
        processing_time: 2000,
        extracted_data: {
          dates: ['15.10.2024'],
          amounts: ['299,99€'],
          invoice_numbers: ['RG-2024-001'],
          companies: ['Solar Energy GmbH']
        }
      };
    },

    async checkHealth(): Promise<HealthResponse> {
      return {
        status: 'healthy',
        model_loaded: true,
        device: 'cpu',
        memory_usage: {
          allocated_gb: 2.5,
          cached_gb: 1.8,
          max_allocated_gb: 3.0
        },
        uptime_seconds: 3600,
        last_request: new Date().toISOString()
      };
    },

    async extractEmailData(): Promise<any> {
      return {
        text: "Email content extracted",
        confidence: 0.95
      };
    }
  };
}

interface OCRRequest {
  image: string;
  language?: string;
  extract_tables?: boolean;
  extract_handwriting?: boolean;
}

interface OCRResponse {
  success: boolean;
  text: string;
  confidence: number;
  language_detected?: string;
  processing_time: number;
  extracted_data?: {
    dates?: string[];
    amounts?: string[];
    invoice_numbers?: string[];
    companies?: string[];
  };
  tables?: any[];
  error?: string;
}

interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
  memory_usage?: {
    allocated_gb: number;
    cached_gb: number;
    max_allocated_gb: number;
  };
  uptime_seconds: number;
  last_request?: string;
}

export class OCRIntegration extends EventEmitter {
  private teraboxClient: TeraBoxClient;
  private notionClient: NotionClient;
  private config: SyncConfig['ocr'];
  private ocrClient: DeepSeekOCRClient | null = null;
  private processingQueue: Array<{
    fileId: string;
    fileEntry: NotionFileEntry;
    priority: number;
    retryCount: number;
  }> = [];
  private processing = false;
  private stats = {
    totalProcessed: 0,
    successful: 0,
    failed: 0,
    averageConfidence: 0,
    totalTime: 0
  };

  constructor(
    teraboxClient: TeraBoxClient,
    notionClient: NotionClient,
    config: SyncConfig['ocr']
  ) {
    super();
    this.teraboxClient = teraboxClient;
    this.notionClient = notionClient;
    this.config = config;

    if (config.enabled && config.baseURL) {
      this.initializeOCRClient();
    }
  }

  /**
   * Initialize OCR client
   */
  private async initializeOCRClient(): Promise<void> {
    try {
      // Use simplified OCR client for now
      // TODO: Replace with actual DeepSeek OCR client when available
      this.ocrClient = createDeepSeekOCRClient(
        this.config.baseURL || 'http://localhost:7860',
        this.config.apiKey
      );

      // Test connection
      const health = await this.ocrClient.checkHealth();
      if (health.status === 'healthy' || health.model_loaded) {
        this.emit('ocr_client_initialized', { health });
        console.log('DeepSeek OCR client initialized successfully');
      } else {
        throw new Error(`OCR service unhealthy: ${health.status}`);
      }
    } catch (error) {
      console.error('Failed to initialize OCR client:', error);
      this.emit('ocr_client_error', error);
      this.ocrClient = null;
    }
  }

  /**
   * Check if a file should be processed by OCR
   */
  public shouldProcessFile(file: TeraBoxFile | NotionFileEntry): boolean {
    if (!this.config.enabled || !this.ocrClient) {
      return false;
    }

    // Check file size (limit to 50MB for OCR)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.fileSize > maxSize) {
      return false;
    }

    // Check file type
    const supportedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/bmp',
      'image/gif'
    ];

    // Handle both TeraBoxFile and NotionFileEntry
    const mimeType = 'mimeType' in file ? file.mimeType : file.fileType;

    return supportedTypes.includes(mimeType || '');
  }

  /**
   * Schedule OCR analysis for a file
   */
  public async scheduleAnalysis(fileEntry: NotionFileEntry, priority: number = 5): Promise<void> {
    if (!this.shouldProcessFile(fileEntry)) {
      return;
    }

    // Check if already processed
    if (fileEntry.ocrAnalyzed) {
      return;
    }

    // Add to processing queue
    this.processingQueue.push({
      fileId: fileEntry.fileId,
      fileEntry,
      priority,
      retryCount: 0
    });

    // Sort queue by priority (lower number = higher priority)
    this.processingQueue.sort((a, b) => a.priority - b.priority);

    this.emit('ocr_scheduled', { fileId: fileEntry.fileId, priority });

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue();
    }
  }

  /**
   * Process the OCR queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.processingQueue.length === 0 || !this.ocrClient) {
      return;
    }

    this.processing = true;

    try {
      while (this.processingQueue.length > 0) {
        const item = this.processingQueue.shift()!;
        await this.processFile(item);
      }
    } catch (error) {
      console.error('Error processing OCR queue:', error);
      this.emit('ocr_queue_error', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Process a single file with OCR
   */
  private async processFile(item: {
    fileId: string;
    fileEntry: NotionFileEntry;
    priority: number;
    retryCount: number;
  }): Promise<void> {
    const startTime = Date.now();

    try {
      this.emit('ocr_processing_started', { fileId: item.fileId });

      // Download file from TeraBox
      const fileData = await this.teraboxClient.downloadFile(item.fileId);
      const fileBase64 = fileData.toString('base64');

      // Determine language
      const language = this.detectLanguage(item.fileEntry.fileName);

      // Perform OCR
      const ocrRequest: OCRRequest = {
        image: fileBase64,
        language,
        extract_tables: this.config.extractFinancialData || true,
        extract_handwriting: false
      };

      const ocrResponse = await this.ocrClient.performOCR(ocrRequest);

      if (ocrResponse.success && ocrResponse.text) {
        // Update Notion entry with OCR results
        await this.updateNotionEntryWithOCRResults(item.fileEntry, ocrResponse);

        // Update statistics
        this.updateStats(true, ocrResponse.confidence, Date.now() - startTime);

        this.emit('ocr_processing_completed', {
          fileId: item.fileId,
          confidence: ocrResponse.confidence,
          textLength: ocrResponse.text.length,
          extractedData: ocrResponse.extracted_data
        });

        console.log(`OCR completed for file ${item.fileEntry.fileName} with confidence ${ocrResponse.confidence}`);
      } else {
        throw new Error(ocrResponse.error || 'OCR processing failed');
      }
    } catch (error) {
      console.error(`OCR processing failed for file ${item.fileEntry.fileName}:`, error);

      // Retry logic
      if (item.retryCount < 3) {
        item.retryCount++;
        item.priority = Math.max(1, item.priority - 1); // Increase priority for retries
        this.processingQueue.unshift(item); // Add back to front of queue

        this.emit('ocr_processing_retry', {
          fileId: item.fileId,
          retryCount: item.retryCount,
          error: (error as Error).message
        });
      } else {
        // Mark as failed after max retries
        await this.markOCRAsFailed(item.fileEntry, (error as Error).message);
        this.updateStats(false, 0, Date.now() - startTime);

        this.emit('ocr_processing_failed', {
          fileId: item.fileId,
          error: (error as Error).message,
          retryCount: item.retryCount
        });
      }
    }
  }

  /**
   * Detect document language based on filename and preferences
   */
  private detectLanguage(fileName: string): string {
    // Simple language detection based on filename
    const germanIndicators = ['rechnung', 'vertrag', 'brief', 'dokument', 'bericht'];
    const englishIndicators = ['invoice', 'contract', 'letter', 'document', 'report'];

    const fileNameLower = fileName.toLowerCase();

    if (germanIndicators.some(indicator => fileNameLower.includes(indicator))) {
      return 'de';
    } else if (englishIndicators.some(indicator => fileNameLower.includes(indicator))) {
      return 'en';
    } else if (this.config.languages && this.config.languages.length > 0) {
      return this.config.languages[0]; // Use first preferred language
    }

    return 'auto'; // Let OCR service detect
  }

  /**
   * Update Notion entry with OCR results
   */
  private async updateNotionEntryWithOCRResults(
    fileEntry: NotionFileEntry,
    ocrResponse: OCRResponse
  ): Promise<void> {
    try {
      // Extract structured data
      const extractedData = this.processExtractedData(ocrResponse.extracted_data);

      // Update Notion entry
      await this.notionClient.updateFileEntry(fileEntry.fileId, {
        ocrAnalyzed: true,
        extractedText: ocrResponse.text,
        extractedData,
        tags: this.generateTags(ocrResponse.text, extractedData),
        category: this.updateCategory(fileEntry.category, ocrResponse.text, extractedData)
      });

      this.emit('notion_entry_updated', { fileId: fileEntry.fileId, extractedData });
    } catch (error) {
      console.error('Failed to update Notion entry with OCR results:', error);
      throw error;
    }
  }

  /**
   * Process extracted data from OCR
   */
  private processExtractedData(rawData: any): ExtractedData {
    return {
      dates: rawData?.dates || [],
      amounts: rawData?.amounts || [],
      invoiceNumbers: rawData?.invoice_numbers || [],
      companies: rawData?.companies || [],
      confidence: rawData?.confidence || 0,
      languageDetected: rawData?.language_detected
    };
  }

  /**
   * Generate tags based on OCR text and extracted data
   */
  private generateTags(text: string, extractedData: ExtractedData): string[] {
    const tags = new Set<string>();

    // Add tags based on extracted data
    if (extractedData.invoiceNumbers && extractedData.invoiceNumbers.length > 0) {
      tags.add('Invoice');
    }

    if (extractedData.amounts && extractedData.amounts.length > 0) {
      tags.add('Financial');
    }

    if (extractedData.companies && extractedData.companies.length > 0) {
      tags.add('Business');
    }

    // Add tags based on text content
    const textLower = text.toLowerCase();

    if (textLower.includes('vertrag') || textLower.includes('contract')) {
      tags.add('Contract');
    }

    if (textLower.includes('rechnung') || textLower.includes('invoice')) {
      tags.add('Invoice');
    }

    if (textLower.includes('kontoauszug') || textLower.includes('statement')) {
      tags.add('Bank');
    }

    if (textLower.includes('steuer') || textLower.includes('tax')) {
      tags.add('Tax');
    }

    return Array.from(tags);
  }

  /**
   * Update category based on OCR analysis
   */
  private updateCategory(
    currentCategory: string | undefined,
    text: string,
    extractedData: ExtractedData
  ): string {
    // If already has a good category, keep it
    if (currentCategory && currentCategory !== 'other') {
      return currentCategory;
    }

    // Determine category based on OCR content
    const textLower = text.toLowerCase();

    if (extractedData.invoiceNumbers && extractedData.invoiceNumbers.length > 0) {
      return 'Document'; // Invoice/Financial document
    }

    if (textLower.includes('vertrag') || textLower.includes('contract')) {
      return 'Document'; // Contract/Legal document
    }

    if (textLower.includes('kontoauszug') || textLower.includes('statement')) {
      return 'Document'; // Bank statement
    }

    return currentCategory || 'Document';
  }

  /**
   * Mark OCR as failed in Notion entry
   */
  private async markOCRAsFailed(fileEntry: NotionFileEntry, errorMessage: string): Promise<void> {
    try {
      await this.notionClient.updateFileEntry(fileEntry.fileId, {
        ocrAnalyzed: true,
        extractedText: `[OCR Failed: ${errorMessage}]`
      });
    } catch (error) {
      console.error('Failed to mark OCR as failed in Notion:', error);
    }
  }

  /**
   * Update processing statistics
   */
  private updateStats(success: boolean, confidence: number, processingTime: number): void {
    this.stats.totalProcessed++;

    if (success) {
      this.stats.successful++;
      this.stats.averageConfidence =
        (this.stats.averageConfidence * (this.stats.successful - 1) + confidence) / this.stats.successful;
    } else {
      this.stats.failed++;
    }

    this.stats.totalTime += processingTime;
  }

  /**
   * Get processing statistics
   */
  public getStats(): typeof this.stats {
    return { ...this.stats };
  }

  /**
   * Get queue status
   */
  public getQueueStatus(): {
    queueLength: number;
    processing: boolean;
    nextInQueue?: { fileId: string; fileName: string; priority: number };
  } {
    return {
      queueLength: this.processingQueue.length,
      processing: this.processing,
      nextInQueue: this.processingQueue.length > 0 ? {
        fileId: this.processingQueue[0].fileId,
        fileName: this.processingQueue[0].fileEntry.fileName,
        priority: this.processingQueue[0].priority
      } : undefined
    };
  }

  /**
   * Process existing files that haven't been analyzed yet
   */
  public async processBacklog(): Promise<void> {
    if (!this.config.enabled || !this.ocrClient) {
      return;
    }

    try {
      this.emit('backlog_processing_started');

      // Get all files from Notion that haven't been OCR analyzed
      const allEntries = await this.notionClient.getAllFileEntries();
      const unprocessedEntries = allEntries.filter(entry =>
        !entry.ocrAnalyzed && this.shouldProcessFile(entry)
      );

      console.log(`Found ${unprocessedEntries.length} files for backlog processing`);

      // Schedule all unprocessed files
      for (const entry of unprocessedEntries) {
        await this.scheduleAnalysis(entry, 10); // Lower priority for backlog
      }

      this.emit('backlog_processing_scheduled', { count: unprocessedEntries.length });
    } catch (error) {
      console.error('Failed to process backlog:', error);
      this.emit('backlog_processing_failed', error);
    }
  }

  /**
   * Health check for OCR integration
   */
  public async healthCheck(): Promise<{
    ocrEnabled: boolean;
    ocrClientHealthy: boolean;
    queueLength: number;
    processing: boolean;
    stats: typeof this.stats;
  }> {
    let ocrClientHealthy = false;

    if (this.ocrClient) {
      try {
        const health = await this.ocrClient.checkHealth();
        ocrClientHealthy = health.status === 'healthy' || health.model_loaded;
      } catch (error) {
        ocrClientHealthy = false;
      }
    }

    return {
      ocrEnabled: this.config.enabled,
      ocrClientHealthy,
      queueLength: this.processingQueue.length,
      processing: this.processing,
      stats: this.getStats()
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.processing = false;
    this.processingQueue = [];
    this.removeAllListeners();
  }
}