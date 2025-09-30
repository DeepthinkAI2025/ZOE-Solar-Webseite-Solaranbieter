/**
 * AI API Integration für ZOE Solar
 *
 * RESTful API-Schnittstelle für alle AI-Services
 * Integration in bestehende Express/Node.js Infrastruktur
 */

import express, { Request, Response, Router } from 'express';
import { aiIntegrationService } from './aiIntegrationService';
import { aiFirstContentOptimizationService } from './aiFirstContentOptimizationService';
import { predictiveKeywordAnalysisService } from './predictiveKeywordAnalysisService';
import { contentPerformancePredictionService } from './contentPerformancePredictionService';
import { userBehaviorPatternAnalysisService } from './userBehaviorPatternAnalysisService';
import { aiPlatformIntegrationService } from './aiPlatformIntegrationService';
import { semanticAIUnderstandingService } from './semanticAIUnderstandingService';
import { aiMonitoringAnalyticsService } from './aiMonitoringAnalyticsService';
import { aiFutureProofingService } from './aiFutureProofingService';
import { aiPlatformMonitoringService } from './aiPlatformMonitoringService';

// ===== TYPES & INTERFACES =====

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
}

interface ContentOptimizationRequest {
  url: string;
  content: string;
  contentType?: 'page' | 'article' | 'product' | 'faq' | 'documentation';
  optimizationGoals?: string[];
  context?: Record<string, any>;
}

interface BatchOptimizationRequest {
  requests: ContentOptimizationRequest[];
  priority?: 'low' | 'medium' | 'high';
}

interface SyncRequest {
  type?: 'full' | 'incremental' | 'content-specific';
  services?: string[];
}

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, ServiceHealth>;
  aiReadiness: number;
  lastSync: string;
  uptime: number;
}

// ===== MAIN API CLASS =====

class AIAPIIntegration {
  private static instance: AIAPIIntegration;
  private router: Router;
  private startTime: Date;

  private constructor() {
    this.router = express.Router();
    this.startTime = new Date();
    this.setupRoutes();
    this.setupMiddleware();
  }

  public static getInstance(): AIAPIIntegration {
    if (!AIAPIIntegration.instance) {
      AIAPIIntegration.instance = new AIAPIIntegration();
    }
    return AIAPIIntegration.instance;
  }

  // ===== ROUTER SETUP =====

  private setupRoutes(): void {
    // Health Check
    this.router.get('/health', this.handleHealthCheck.bind(this));

    // Integration Status
    this.router.get('/status', this.handleGetStatus.bind(this));

    // Content Optimization
    this.router.post('/optimize/content', this.handleContentOptimization.bind(this));
    this.router.post('/optimize/batch', this.handleBatchOptimization.bind(this));

    // AI Services Direct Access
    this.router.get('/services/content-optimization/results', this.handleGetContentOptimizationResults.bind(this));
    this.router.get('/services/keyword-analysis/predictions', this.handleGetKeywordPredictions.bind(this));
    this.router.get('/services/performance-prediction/predictions', this.handleGetPerformancePredictions.bind(this));
    this.router.get('/services/behavior-analysis/insights', this.handleGetBehaviorInsights.bind(this));
    this.router.get('/services/platform-integration/optimizations', this.handleGetPlatformOptimizations.bind(this));
    this.router.get('/services/semantic-understanding/entities', this.handleGetSemanticEntities.bind(this));
    this.router.get('/services/monitoring-analytics/performance', this.handleGetMonitoringPerformance.bind(this));
    this.router.get('/services/future-proofing/stats', this.handleGetFutureProofingStats.bind(this));

    // AI Platform Monitoring
    this.router.get('/services/platform-monitoring/status', this.handleGetPlatformMonitoringStatus.bind(this));
    this.router.post('/services/platform-monitoring/start', this.handleStartPlatformMonitoring.bind(this));
    this.router.post('/services/platform-monitoring/stop', this.handleStopPlatformMonitoring.bind(this));
    this.router.post('/services/platform-monitoring/check', this.handlePerformManualCheck.bind(this));
    this.router.get('/services/platform-monitoring/history/:platformId?', this.handleGetPlatformHistory.bind(this));
    this.router.get('/services/platform-monitoring/report', this.handleGetMonitoringReport.bind(this));
    this.router.put('/services/platform-monitoring/config', this.handleUpdateMonitoringConfig.bind(this));

    // Synchronization
    this.router.post('/sync', this.handleSync.bind(this));
    this.router.get('/sync/:operationId', this.handleGetSyncOperation.bind(this));
    this.router.get('/sync/recent', this.handleGetRecentSyncOperations.bind(this));

    // Configuration
    this.router.get('/config', this.handleGetConfig.bind(this));
    this.router.put('/config', this.handleUpdateConfig.bind(this));
    this.router.post('/config/export', this.handleExportConfig.bind(this));
    this.router.post('/config/import', this.handleImportConfig.bind(this));

    // Cache Management
    this.router.delete('/cache', this.handleClearCache.bind(this));
    this.router.get('/cache/stats', this.handleGetCacheStats.bind(this));

    // Analytics & Insights
    this.router.get('/insights/readiness', this.handleGetAIReadiness.bind(this));
    this.router.get('/insights/recommendations', this.handleGetRecommendations.bind(this));
    this.router.get('/insights/performance', this.handleGetPerformanceInsights.bind(this));

    // Webhook Endpoints für externe Integrationen
    this.router.post('/webhooks/content-updated', this.handleContentUpdatedWebhook.bind(this));
    this.router.post('/webhooks/seo-changed', this.handleSEOChangedWebhook.bind(this));
    this.router.post('/webhooks/ai-platform-update', this.handleAIPlatformUpdateWebhook.bind(this));
  }

  private setupMiddleware(): void {
    // Request Logging
    this.router.use((req: Request, res: Response, next) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      (req as any).requestId = requestId;

      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${requestId}`);
      next();
    });

    // Error Handling
    this.router.use((error: Error, req: Request, res: Response, next: Function) => {
      console.error('AI API Error:', error);
      this.sendErrorResponse(res, 500, 'Internal server error', (req as any).requestId);
    });
  }

  // ===== HEALTH CHECK =====

  private async handleHealthCheck(req: Request, res: Response): Promise<void> {
    try {
      const health = await aiIntegrationService.getIntegrationHealth();
      const uptime = Date.now() - this.startTime.getTime();

      const response: HealthCheckResponse = {
        status: health.status as 'healthy' | 'degraded' | 'unhealthy',
        services: aiIntegrationService.getServiceHealth(),
        aiReadiness: health.aiReadiness,
        lastSync: health.lastSync.toISOString(),
        uptime
      };

      this.sendSuccessResponse(res, response, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Health check failed', (req as any).requestId);
    }
  }

  // ===== STATUS ENDPOINTS =====

  private handleGetStatus(req: Request, res: Response): void {
    try {
      const status = aiIntegrationService.getIntegrationStatus();
      this.sendSuccessResponse(res, status, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get status', (req as any).requestId);
    }
  }

  // ===== CONTENT OPTIMIZATION =====

  private async handleContentOptimization(req: Request, res: Response): Promise<void> {
    try {
      const { url, content, contentType, optimizationGoals, context }: ContentOptimizationRequest = req.body;

      if (!url || !content) {
        return this.sendErrorResponse(res, 400, 'URL and content are required', (req as any).requestId);
      }

      const optimization = await aiIntegrationService.optimizeContent(url, content);

      // Erweitere mit zusätzlichen Parametern falls angegeben
      if (contentType || optimizationGoals || context) {
        // Hier könnte zusätzliche Verarbeitung erfolgen
      }

      this.sendSuccessResponse(res, optimization, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Content optimization failed', (req as any).requestId);
    }
  }

  private async handleBatchOptimization(req: Request, res: Response): Promise<void> {
    try {
      const { requests, priority }: BatchOptimizationRequest = req.body;

      if (!requests || !Array.isArray(requests)) {
        return this.sendErrorResponse(res, 400, 'Requests array is required', (req as any).requestId);
      }

      if (requests.length > 50) {
        return this.sendErrorResponse(res, 400, 'Maximum 50 requests per batch', (req as any).requestId);
      }

      const results = await aiIntegrationService.processBatch(requests);

      this.sendSuccessResponse(res, { results, total: results.length }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Batch optimization failed', (req as any).requestId);
    }
  }

  // ===== AI SERVICES DIRECT ACCESS =====

  private handleGetContentOptimizationResults(req: Request, res: Response): void {
    try {
      const results = aiFirstContentOptimizationService.getOptimizationResults();
      this.sendSuccessResponse(res, results, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get content optimization results', (req as any).requestId);
    }
  }

  private handleGetKeywordPredictions(req: Request, res: Response): void {
    try {
      const predictions = predictiveKeywordAnalysisService.getKeywordPredictions();
      this.sendSuccessResponse(res, predictions, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get keyword predictions', (req as any).requestId);
    }
  }

  private handleGetPerformancePredictions(req: Request, res: Response): void {
    try {
      const predictions = contentPerformancePredictionService.getPerformancePredictions();
      this.sendSuccessResponse(res, predictions, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get performance predictions', (req as any).requestId);
    }
  }

  private handleGetBehaviorInsights(req: Request, res: Response): void {
    try {
      const insights = userBehaviorPatternAnalysisService.getBehaviorInsights();
      this.sendSuccessResponse(res, insights, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get behavior insights', (req as any).requestId);
    }
  }

  private handleGetPlatformOptimizations(req: Request, res: Response): void {
    try {
      const optimizations = aiPlatformIntegrationService.getPlatformOptimizations();
      this.sendSuccessResponse(res, optimizations, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get platform optimizations', (req as any).requestId);
    }
  }

  private handleGetSemanticEntities(req: Request, res: Response): void {
    try {
      const entities = semanticAIUnderstandingService.getAllEntities();
      this.sendSuccessResponse(res, entities, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get semantic entities', (req as any).requestId);
    }
  }

  private handleGetMonitoringPerformance(req: Request, res: Response): void {
    try {
      const performance = aiMonitoringAnalyticsService.getAISearchPerformance();
      this.sendSuccessResponse(res, performance, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get monitoring performance', (req as any).requestId);
    }
  }

  private handleGetFutureProofingStats(req: Request, res: Response): void {
    try {
      const stats = aiFutureProofingService.getStats();
      this.sendSuccessResponse(res, stats, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get future-proofing stats', (req as any).requestId);
    }
  }

  // ===== AI PLATFORM MONITORING =====

  private handleGetPlatformMonitoringStatus(req: Request, res: Response): void {
    try {
      const status = aiPlatformMonitoringService.getStatus();
      this.sendSuccessResponse(res, status, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get platform monitoring status', (req as any).requestId);
    }
  }

  private async handleStartPlatformMonitoring(req: Request, res: Response): Promise<void> {
    try {
      await aiPlatformMonitoringService.startMonitoring();
      this.sendSuccessResponse(res, { message: 'Platform monitoring started successfully' }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to start platform monitoring', (req as any).requestId);
    }
  }

  private async handleStopPlatformMonitoring(req: Request, res: Response): Promise<void> {
    try {
      await aiPlatformMonitoringService.stopMonitoring();
      this.sendSuccessResponse(res, { message: 'Platform monitoring stopped successfully' }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to stop platform monitoring', (req as any).requestId);
    }
  }

  private async handlePerformManualCheck(req: Request, res: Response): Promise<void> {
    try {
      const { platformId } = req.body;
      const result = await aiPlatformMonitoringService.performManualCheck(platformId);
      this.sendSuccessResponse(res, result, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to perform manual check', (req as any).requestId);
    }
  }

  private handleGetPlatformHistory(req: Request, res: Response): void {
    try {
      const { platformId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const history = platformId
        ? aiPlatformMonitoringService.getPlatformHistory(platformId, limit)
        : aiPlatformMonitoringService.getAllPlatformHistory(limit);
      this.sendSuccessResponse(res, history, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get platform history', (req as any).requestId);
    }
  }

  private handleGetMonitoringReport(req: Request, res: Response): void {
    try {
      // Generate a fresh report
      const report = aiPlatformMonitoringService.performManualCheck();
      this.sendSuccessResponse(res, report, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get monitoring report', (req as any).requestId);
    }
  }

  private handleUpdateMonitoringConfig(req: Request, res: Response): void {
    try {
      const newConfig = req.body;
      aiPlatformMonitoringService.updateConfig(newConfig);
      this.sendSuccessResponse(res, { message: 'Monitoring configuration updated successfully' }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to update monitoring configuration', (req as any).requestId);
    }
  }

  // ===== SYNCHRONIZATION =====

  private async handleSync(req: Request, res: Response): Promise<void> {
    try {
      const { type, services }: SyncRequest = req.body;

      let operation;
      if (type === 'full') {
        operation = await aiIntegrationService.performFullSync();
      } else {
        // Für andere Sync-Typen könnte zusätzliche Logik implementiert werden
        operation = await aiIntegrationService.performFullSync();
      }

      this.sendSuccessResponse(res, operation, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Sync operation failed', (req as any).requestId);
    }
  }

  private handleGetSyncOperation(req: Request, res: Response): void {
    try {
      const { operationId } = req.params;
      const operation = aiIntegrationService.getSyncOperation(operationId);

      if (!operation) {
        return this.sendErrorResponse(res, 404, 'Sync operation not found', (req as any).requestId);
      }

      this.sendSuccessResponse(res, operation, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get sync operation', (req as any).requestId);
    }
  }

  private handleGetRecentSyncOperations(req: Request, res: Response): void {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const operations = aiIntegrationService.getRecentSyncOperations(limit);
      this.sendSuccessResponse(res, operations, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get recent sync operations', (req as any).requestId);
    }
  }

  // ===== CONFIGURATION =====

  private handleGetConfig(req: Request, res: Response): void {
    try {
      const config = aiIntegrationService.getConfig();
      this.sendSuccessResponse(res, config, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get configuration', (req as any).requestId);
    }
  }

  private handleUpdateConfig(req: Request, res: Response): void {
    try {
      const newConfig = req.body;
      aiIntegrationService.updateConfig(newConfig);
      this.sendSuccessResponse(res, { message: 'Configuration updated successfully' }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to update configuration', (req as any).requestId);
    }
  }

  private handleExportConfig(req: Request, res: Response): void {
    try {
      const configJson = aiIntegrationService.exportConfiguration();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="ai-integration-config.json"');
      res.send(configJson);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to export configuration', (req as any).requestId);
    }
  }

  private handleImportConfig(req: Request, res: Response): void {
    try {
      const configJson = req.body.config;
      const success = aiIntegrationService.importConfiguration(configJson);

      if (success) {
        this.sendSuccessResponse(res, { message: 'Configuration imported successfully' }, (req as any).requestId);
      } else {
        this.sendErrorResponse(res, 400, 'Invalid configuration format', (req as any).requestId);
      }
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to import configuration', (req as any).requestId);
    }
  }

  // ===== CACHE MANAGEMENT =====

  private handleClearCache(req: Request, res: Response): void {
    try {
      aiIntegrationService.clearCache();
      this.sendSuccessResponse(res, { message: 'Cache cleared successfully' }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to clear cache', (req as any).requestId);
    }
  }

  private handleGetCacheStats(req: Request, res: Response): void {
    try {
      const stats = aiIntegrationService.getCacheStats();
      this.sendSuccessResponse(res, stats, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get cache stats', (req as any).requestId);
    }
  }

  // ===== ANALYTICS & INSIGHTS =====

  private handleGetAIReadiness(req: Request, res: Response): void {
    try {
      const readiness = aiIntegrationService.getAIReadinessScore();
      this.sendSuccessResponse(res, readiness, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get AI readiness score', (req as any).requestId);
    }
  }

  private handleGetRecommendations(req: Request, res: Response): void {
    try {
      const recommendations = aiIntegrationService.getOptimizationRecommendations();
      this.sendSuccessResponse(res, recommendations, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get recommendations', (req as any).requestId);
    }
  }

  private handleGetPerformanceInsights(req: Request, res: Response): void {
    try {
      const status = aiIntegrationService.getIntegrationStatus();
      const insights = {
        performance: status.performance,
        aiReadiness: status.aiReadiness,
        serviceHealth: Object.values(status.services).map(s => ({
          name: s.name,
          status: s.status,
          aiScore: s.aiScore,
          lastSync: s.lastSync
        })),
        recentErrors: status.errors.slice(-5)
      };
      this.sendSuccessResponse(res, insights, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Failed to get performance insights', (req as any).requestId);
    }
  }

  // ===== WEBHOOKS =====

  private async handleContentUpdatedWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { url, content, contentType } = req.body;

      if (!url || !content) {
        return this.sendErrorResponse(res, 400, 'URL and content are required', (req as any).requestId);
      }

      // Trigger AI-Optimierung für aktualisierten Content
      const optimization = await aiIntegrationService.optimizeContent(url, content);

      // Hier könnte zusätzliche Logik für Content-Updates implementiert werden
      console.log(`Content updated and optimized: ${url}`);

      this.sendSuccessResponse(res, {
        message: 'Content updated and optimized',
        optimization: optimization.metadata
      }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'Content update webhook failed', (req as any).requestId);
    }
  }

  private async handleSEOChangedWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { changes, affectedUrls } = req.body;

      // Trigger Re-Optimierung für betroffene URLs
      if (affectedUrls && Array.isArray(affectedUrls)) {
        for (const url of affectedUrls.slice(0, 10)) { // Limitiere auf 10 URLs
          try {
            await aiIntegrationService.optimizeContent(url, '');
          } catch (error) {
            console.error(`Failed to re-optimize ${url}:`, error);
          }
        }
      }

      this.sendSuccessResponse(res, {
        message: 'SEO changes processed',
        reoptimizedUrls: affectedUrls?.slice(0, 10) || []
      }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'SEO change webhook failed', (req as any).requestId);
    }
  }

  private async handleAIPlatformUpdateWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { platform, updates } = req.body;

      // Trigger Platform-spezifische Updates
      if (platform && updates) {
        // Hier könnte platform-spezifische Logik implementiert werden
        console.log(`AI platform update received: ${platform}`);
      }

      // Trigger Sync für Platform Integration Service
      await aiIntegrationService.performFullSync();

      this.sendSuccessResponse(res, {
        message: 'AI platform update processed',
        platform,
        syncTriggered: true
      }, (req as any).requestId);
    } catch (error) {
      this.sendErrorResponse(res, 500, 'AI platform update webhook failed', (req as any).requestId);
    }
  }

  // ===== UTILITY METHODS =====

  private sendSuccessResponse<T>(res: Response, data: T, requestId: string): void {
    const response: APIResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId
    };
    res.json(response);
  }

  private sendErrorResponse(res: Response, statusCode: number, error: string, requestId: string): void {
    const response: APIResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId
    };
    res.status(statusCode).json(response);
  }

  // ===== PUBLIC API =====

  public getRouter(): Router {
    return this.router;
  }

  public getBasePath(): string {
    return '/api/ai';
  }

  public async initialize(): Promise<void> {
    console.log('AI API Integration initialized');

    // Trigger initial sync
    try {
      await aiIntegrationService.performFullSync();
      console.log('Initial AI sync completed');
    } catch (error) {
      console.error('Initial AI sync failed:', error);
    }
  }

  public async shutdown(): Promise<void> {
    console.log('AI API Integration shutting down');
    aiIntegrationService.stop();
  }
}

// ===== EXPORT =====

export const aiAPIIntegration = AIAPIIntegration.getInstance();
export default aiAPIIntegration;

/**
 * ===== USAGE IN EXPRESS APP =====
 *
 * import express from 'express';
 * import { aiAPIIntegration } from './services/aiAPIIntegration';
 *
 * const app = express();
 * app.use(express.json());
 *
 * // Mount AI API routes
 * app.use(aiAPIIntegration.getBasePath(), aiAPIIntegration.getRouter());
 *
 * // Initialize AI services
 * aiAPIIntegration.initialize();
 *
 * // Graceful shutdown
 * process.on('SIGTERM', async () => {
 *   await aiAPIIntegration.shutdown();
 *   process.exit(0);
 * });
 *
 * ===== API ENDPOINTS =====
 *
 * GET    /api/ai/health                          - Health check
 * GET    /api/ai/status                          - Integration status
 * POST   /api/ai/optimize/content                - Content optimization
 * POST   /api/ai/optimize/batch                  - Batch optimization
 * POST   /api/ai/sync                            - Trigger sync
 * GET    /api/ai/sync/recent                     - Recent sync operations
 * GET    /api/ai/config                          - Get configuration
 * PUT    /api/ai/config                          - Update configuration
 * GET    /api/ai/insights/readiness              - AI readiness score
 * GET    /api/ai/insights/recommendations        - Optimization recommendations
 * POST   /api/ai/webhooks/content-updated        - Content update webhook
 * POST   /api/ai/webhooks/seo-changed            - SEO change webhook
 * POST   /api/ai/webhooks/ai-platform-update     - AI platform update webhook
 *
 * ===== AI PLATFORM MONITORING ENDPOINTS =====
 *
 * GET    /api/ai/services/platform-monitoring/status              - Get monitoring status
 * POST   /api/ai/services/platform-monitoring/start               - Start monitoring
 * POST   /api/ai/services/platform-monitoring/stop                - Stop monitoring
 * POST   /api/ai/services/platform-monitoring/check               - Perform manual check
 * GET    /api/ai/services/platform-monitoring/history/:platformId? - Get platform history
 * GET    /api/ai/services/platform-monitoring/report              - Get monitoring report
 * PUT    /api/ai/services/platform-monitoring/config              - Update monitoring config
 */