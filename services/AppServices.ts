/**
 * Zentralisierte Service Registry und Initialisierung
 *
 * Dieser Service verwaltet alle App-Services und deren Lebenszyklus.
 * Er ermöglicht eine strukturierte Initialisierung, Fehlerbehandlung und Monitoring.
 */

// Service Interfaces
export interface ServiceStatus {
  name: string;
  version: string;
  status: 'pending' | 'initializing' | 'ready' | 'error' | 'disabled';
  initialized: boolean;
  lastUpdate: Date | null;
  error?: string;
  dependencies: string[];
  metrics?: ServiceMetrics;
}

export interface ServiceMetrics {
  initializationTime: number;
  memoryUsage?: number;
  requestCount?: number;
  errorCount?: number;
  performance?: {
    avgResponseTime?: number;
    p95ResponseTime?: number;
    throughput?: number;
  };
}

export interface ServiceConfiguration {
  name: string;
  version: string;
  enabled: boolean;
  dependencies: string[];
  initialize: () => Promise<void>;
  destroy?: () => Promise<void>;
  healthCheck?: () => Promise<boolean>;
  getMetrics?: () => ServiceMetrics;
  config?: Record<string, any>;
}

export interface ServiceRegistryState {
  services: Map<string, ServiceStatus>;
  initializationOrder: string[];
  initializationComplete: boolean;
  errors: string[];
  metrics: {
    totalInitializationTime: number;
    servicesInitialized: number;
    servicesFailed: number;
    lastHealthCheck: Date | null;
  };
}

/**
 * Main AppServices Class
 * Zentrale Service-Registry für die gesamte Anwendung
 */
class AppServices {
  private static instance: AppServices;
  private services: Map<string, ServiceConfiguration> = new Map();
  private state: ServiceRegistryState = {
    services: new Map(),
    initializationOrder: [],
    initializationComplete: false,
    errors: [],
    metrics: {
      totalInitializationTime: 0,
      servicesInitialized: 0,
      servicesFailed: 0,
      lastHealthCheck: null,
    },
  };
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.registerCoreServices();
  }

  /**
   * Singleton pattern - get the instance
   */
  public static getInstance(): AppServices {
    if (!AppServices.instance) {
      AppServices.instance = new AppServices();
    }
    return AppServices.instance;
  }

  /**
   * Register all core services
   */
  private registerCoreServices(): void {
    // Performance Services
    this.registerService({
      name: 'performanceOptimization',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { default: performanceOptimizationService } = await import('./performanceOptimizationService');
        await performanceOptimizationService.initialize();
      },
      healthCheck: async () => {
        try {
          const { default: performanceOptimizationService } = await import('./performanceOptimizationService');
          return !!performanceOptimizationService;
        } catch {
          return false;
        }
      },
    });

    this.registerService({
      name: 'automatedCoreWebVitalsOptimization',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { automatedCoreWebVitalsOptimizationService } = await import('./automatedCoreWebVitalsOptimizationService');
        // Service is auto-initialized
      },
    });

    // Conversion Services
    this.registerService({
      name: 'conversionRateOptimization',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { default: conversionRateOptimizationService } = await import('./conversionRateOptimizationService');
        await conversionRateOptimizationService.initialize();
      },
    });

    // Mobile Experience Services
    this.registerService({
      name: 'mobileExperienceOptimization',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { default: mobileExperienceOptimizationService } = await import('./mobileExperienceOptimizationService');
        await mobileExperienceOptimizationService.initialize();
      },
    });

    // AI Services
    this.registerService({
      name: 'aiPersonalizationEngine',
      version: '2.0.0',
      enabled: true,
      dependencies: ['performanceOptimization'],
      initialize: async () => {
        const { default: aiPersonalizationEngine } = await import('./aiPersonalizationEngine');
        await aiPersonalizationEngine.initialize();
      },
    });

    this.registerService({
      name: 'aiIntegrationService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['aiPersonalizationEngine'],
      initialize: async () => {
        const { aiIntegrationService } = await import('./aiIntegrationService');
        // Service is auto-initialized
      },
    });

    this.registerService({
      name: 'aiFirstContentOptimizationService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { aiFirstContentOptimizationService } = await import('./aiFirstContentOptimizationService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'predictiveKeywordAnalysisService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { predictiveKeywordAnalysisService } = await import('./predictiveKeywordAnalysisService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'userBehaviorPatternAnalysisService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['aiPersonalizationEngine'],
      initialize: async () => {
        const { default: aiPersonalizationEngine } = await import('./aiPersonalizationEngine');
        await aiPersonalizationEngine.initialize();
      },
    });

    // SEO Services
    this.registerService({
      name: 'advancedInternalLinkingService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { advancedInternalLinkingService } = await import('./advancedInternalLinkingService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'brandAuthorityBuildingService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { brandAuthorityBuildingService } = await import('./brandAuthorityBuildingService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'enterpriseCitationManagementService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['brandAuthorityBuildingService'],
      initialize: async () => {
        const { enterpriseCitationManagementService } = await import('./enterpriseCitationManagementService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'enterpriseBrandAuthorityService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['brandAuthorityBuildingService'],
      initialize: async () => {
        const { enterpriseBrandAuthorityService } = await import('./enterpriseBrandAuthorityService');
        // Service initialization
      },
    });

    this.registerService({
      name: 'schemaConsolidationService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['advancedInternalLinkingService'],
      initialize: async () => {
        const { schemaConsolidationService } = await import('./schemaConsolidationService');
        await schemaConsolidationService.forceSchemaConsolidation();
      },
    });

    this.registerService({
      name: 'imageOptimizationEnhancementService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { imageOptimizationEnhancementService } = await import('./imageOptimizationEnhancementService');
        await imageOptimizationEnhancementService.forceImageOptimization();
      },
    });

    this.registerService({
      name: 'napConsistencyAuditService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { napConsistencyAuditService } = await import('./napConsistencyAuditService');
        await napConsistencyAuditService.forceNAPAudit();
      },
    });

    this.registerService({
      name: 'localPerformanceHarmonizerService',
      version: '1.0.0',
      enabled: true,
      dependencies: ['napConsistencyAuditService'],
      initialize: async () => {
        const { localPerformanceHarmonizerService } = await import('./localPerformanceHarmonizerService');
        await localPerformanceHarmonizerService.forceHarmonization();
      },
    });

    this.registerService({
      name: 'voiceSearchOptimizationService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { voiceSearchOptimizationService } = await import('./voiceSearchOptimizationService');
        await voiceSearchOptimizationService.forceVoiceSearchOptimization();
      },
    });

    this.registerService({
      name: 'agriPVContentExpansionService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { agriPVContentExpansionService } = await import('./agriPVContentExpansionService');
        await agriPVContentExpansionService.forceAgriPVExpansion();
      },
    });

    // Content Services
    this.registerService({
      name: 'contentStorytellingEnhancementService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { contentStorytellingEnhancementService } = await import('./contentStorytellingEnhancementService');
        await contentStorytellingEnhancementService.initialize();
      },
    });

    // Community Services
    this.registerService({
      name: 'communitySocialProofService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { communitySocialProofService } = await import('./communitySocialProofService');
        await communitySocialProofService.initialize();
      },
    });

    // Analytics Services
    this.registerService({
      name: 'advancedAnalyticsMeasurementService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { advancedAnalyticsMeasurementService } = await import('./advancedAnalyticsMeasurementService');
        await advancedAnalyticsMeasurementService.initialize();
      },
    });

    // AI Monitoring
    this.registerService({
      name: 'aiMonitoringAnalyticsService',
      version: '1.0.0',
      enabled: true,
      dependencies: [],
      initialize: async () => {
        const { aiMonitoringAnalyticsService } = await import('./aiMonitoringAnalyticsService');
        // Service initialization
      },
    });
  }

  /**
   * Register a new service
   */
  public registerService(service: ServiceConfiguration): void {
    this.services.set(service.name, service);

    // Initialize service status
    this.state.services.set(service.name, {
      name: service.name,
      version: service.version,
      status: service.enabled ? 'pending' : 'disabled',
      initialized: false,
      lastUpdate: null,
      dependencies: service.dependencies,
    });
  }

  /**
   * Get service configuration
   */
  public getService(name: string): ServiceConfiguration | undefined {
    return this.services.get(name);
  }

  /**
   * Get service status
   */
  public getServiceStatus(name: string): ServiceStatus | undefined {
    return this.state.services.get(name);
  }

  /**
   * Get all service statuses
   */
  public getAllServiceStatuses(): ServiceStatus[] {
    return Array.from(this.state.services.values());
  }

  /**
   * Get entire registry state
   */
  public getState(): ServiceRegistryState {
    return { ...this.state };
  }

  /**
   * Initialize all services in dependency order
   */
  public async initializeAllServices(): Promise<void> {
    // Return existing promise if already initializing
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  /**
   * Perform the actual initialization
   */
  private async performInitialization(): Promise<void> {
    const startTime = Date.now();
    console.log('🚀 Initializing App Services...');

    try {
      // Calculate initialization order based on dependencies
      const initializationOrder = this.calculateInitializationOrder();
      this.state.initializationOrder = initializationOrder;

      // Initialize services in order
      for (const serviceName of initializationOrder) {
        await this.initializeService(serviceName);
      }

      this.state.initializationComplete = true;
      this.state.metrics.totalInitializationTime = Date.now() - startTime;

      console.log(`✅ All services initialized in ${this.state.metrics.totalInitializationTime}ms`);
      console.log(`📊 Services: ${this.state.metrics.servicesInitialized} successful, ${this.state.metrics.servicesFailed} failed`);

    } catch (error) {
      console.error('❌ Service initialization failed:', error);
      this.state.errors.push(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Calculate initialization order based on dependencies
   */
  private calculateInitializationOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (serviceName: string): void => {
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected: ${serviceName}`);
      }
      if (visited.has(serviceName)) {
        return;
      }

      visiting.add(serviceName);
      const service = this.services.get(serviceName);

      if (service && service.enabled) {
        // Visit dependencies first
        for (const dep of service.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(serviceName);
      visited.add(serviceName);

      if (service && service.enabled) {
        order.push(serviceName);
      }
    };

    // Visit all enabled services
    for (const [name, service] of this.services) {
      if (service.enabled) {
        visit(name);
      }
    }

    return order;
  }

  /**
   * Initialize a single service
   */
  private async initializeService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    const status = this.state.services.get(serviceName);

    if (!service || !service.enabled || status?.status === 'disabled') {
      return;
    }

    if (status?.initialized) {
      console.log(`⏭️ Service ${serviceName} already initialized`);
      return;
    }

    console.log(`⚙️ Initializing service: ${serviceName}`);
    const startTime = Date.now();

    try {
      // Update status to initializing
      this.updateServiceStatus(serviceName, {
        status: 'initializing',
        lastUpdate: new Date(),
      });

      // Initialize the service
      await service.initialize();

      // Calculate metrics
      const initializationTime = Date.now() - startTime;
      const metrics: ServiceMetrics = {
        initializationTime,
      };

      // Update service status to ready
      this.updateServiceStatus(serviceName, {
        status: 'ready',
        initialized: true,
        lastUpdate: new Date(),
        metrics,
      });

      this.state.metrics.servicesInitialized++;
      console.log(`✅ Service ${serviceName} initialized in ${initializationTime}ms`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update service status to error
      this.updateServiceStatus(serviceName, {
        status: 'error',
        initialized: false,
        lastUpdate: new Date(),
        error: errorMessage,
      });

      this.state.metrics.servicesFailed++;
      this.state.errors.push(`${serviceName}: ${errorMessage}`);

      console.error(`❌ Failed to initialize service ${serviceName}:`, error);
      throw error;
    }
  }

  /**
   * Update service status
   */
  private updateServiceStatus(serviceName: string, updates: Partial<ServiceStatus>): void {
    const current = this.state.services.get(serviceName);
    if (current) {
      const updated = { ...current, ...updates };
      this.state.services.set(serviceName, updated);
    }
  }

  /**
   * Perform health check on all services
   */
  public async performHealthCheck(): Promise<void> {
    console.log('🔍 Performing health check on all services...');
    const results = new Map<string, boolean>();

    for (const [name, service] of this.services) {
      if (service.enabled && service.healthCheck) {
        try {
          const isHealthy = await service.healthCheck();
          results.set(name, isHealthy);

          this.updateServiceStatus(name, {
            status: isHealthy ? 'ready' : 'error',
            lastUpdate: new Date(),
          });
        } catch (error) {
          results.set(name, false);
          console.error(`❌ Health check failed for ${name}:`, error);
        }
      }
    }

    this.state.metrics.lastHealthCheck = new Date();
    console.log(`🏥 Health check completed: ${Array.from(results.values()).filter(Boolean).length}/${results.size} services healthy`);
  }

  /**
   * Get service metrics
   */
  public async getServiceMetrics(serviceName: string): Promise<ServiceMetrics | undefined> {
    const service = this.services.get(serviceName);
    if (service && service.getMetrics) {
      return service.getMetrics();
    }
    return this.state.services.get(serviceName)?.metrics;
  }

  /**
   * Reset all services
   */
  public async resetAllServices(): Promise<void> {
    console.log('🔄 Resetting all services...');

    // Reset state
    this.state.initializationComplete = false;
    this.state.initializationOrder = [];
    this.state.errors = [];
    this.state.metrics = {
      totalInitializationTime: 0,
      servicesInitialized: 0,
      servicesFailed: 0,
      lastHealthCheck: null,
    };

    // Reset service statuses
    for (const [name, service] of this.services) {
      this.state.services.set(name, {
        name,
        version: service.version,
        status: service.enabled ? 'pending' : 'disabled',
        initialized: false,
        lastUpdate: null,
        dependencies: service.dependencies,
      });

      // Call destroy if available
      if (service.destroy) {
        try {
          await service.destroy();
        } catch (error) {
          console.error(`Error destroying service ${name}:`, error);
        }
      }
    }

    this.initializationPromise = null;
    console.log('✅ All services reset');
  }

  /**
   * Enable or disable a service
   */
  public setServiceEnabled(serviceName: string, enabled: boolean): void {
    const service = this.services.get(serviceName);
    if (service) {
      service.enabled = enabled;

      this.updateServiceStatus(serviceName, {
        status: enabled ? 'pending' : 'disabled',
        lastUpdate: new Date(),
      });

      console.log(`${enabled ? '✅' : '❌'} Service ${serviceName} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Export singleton instance
export const appServices = AppServices.getInstance();

// Export types and utilities
export { AppServices };
export default appServices;