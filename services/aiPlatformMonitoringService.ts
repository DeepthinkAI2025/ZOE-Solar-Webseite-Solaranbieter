/**
 * AI Platform Monitoring Service für ZOE Solar
 *
 * Zentraler Service für die kontinuierliche Überwachung der AI-Platform Sichtbarkeit:
 * - ChatGPT Plugin- und Browsing-Verfügbarkeit
 * - OpenRouter/Mistral Knowledge Graph Integration
 * - Bing Copilot Sidebar und Entity Cards
 * - Perplexity AI Source Citations
 * - Claude/Anthropic Web Search Integration
 *
 * Integration mit bestehenden Monitoring- und Analytics-Services
 */

import { aiMonitoringAnalyticsService } from './aiMonitoringAnalyticsService';
import { aiPlatformIntegrationService } from './aiPlatformIntegrationService';

// ===== INTERFACES & TYPES =====

export interface AIPlatform {
  id: string;
  name: string;
  type: 'chatbot' | 'search_ai' | 'research_ai';
  baseUrl?: string;
  apiEndpoint?: string;
  monitoringEnabled: boolean;
  checkInterval: number; // in Minuten
  lastCheck?: Date;
  status: 'online' | 'offline' | 'degraded' | 'unknown';
}

export interface PlatformCheckResult {
  platform: string;
  timestamp: Date;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  indicators: {
    featuredSnippet?: boolean;
    knowledgePanel?: boolean;
    aiAnswers?: boolean;
    copilotAnswers?: boolean;
    sidebarResults?: boolean;
    entityCards?: boolean;
    webBrowsingEnabled?: boolean;
    pluginsAvailable?: string[];
    contentIndexed?: boolean;
    sourcesCited?: boolean;
    citations?: any[];
    searchResults?: any[];
    lastUpdated?: Date;
    error?: string;
    contentAccessible?: boolean;
  };
  performance: {
    responseTime: number;
    attempts: number;
    errors: any[];
  };
  errors: any[];
}

export interface MonitoringReport {
  timestamp: Date;
  platforms: Record<string, PlatformCheckResult>;
  summary: {
    totalPlatforms: number;
    onlinePlatforms: number;
    platformsWithContent: number;
    platformsWithErrors: number;
    averageResponseTime: number;
    totalErrors: number;
    performance: {
      averageResponseTime: number;
      totalResponseTime: number;
      errorRate: number;
    };
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  platforms: Record<string, AIPlatform>;
  checkInterval: number; // globale Check-Interval in Minuten
  dataRetention: number; // Tage
  alertThresholds: {
    responseTimeWarning: number; // ms
    consecutiveFailures: number;
    offlineDuration: number; // Minuten
  };
  reporting: {
    generateReports: boolean;
    reportInterval: number; // Stunden
    storeHistoricalData: boolean;
  };
}

// ===== MAIN SERVICE CLASS =====

class AIPlatformMonitoringService {
  private static instance: AIPlatformMonitoringService;
  private config: MonitoringConfig;
  private monitoringInterval?: NodeJS.Timeout;
  private reportInterval?: NodeJS.Timeout;
  private platformChecks: Map<string, PlatformCheckResult[]> = new Map();
  private isRunning: boolean = false;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.loadExistingData();
  }

  public static getInstance(): AIPlatformMonitoringService {
    if (!AIPlatformMonitoringService.instance) {
      AIPlatformMonitoringService.instance = new AIPlatformMonitoringService();
    }
    return AIPlatformMonitoringService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): MonitoringConfig {
    return {
      enabled: true,
      platforms: {
        chatgpt: {
          id: 'chatgpt',
          name: 'ChatGPT Plugins',
          type: 'chatbot',
          monitoringEnabled: true,
          checkInterval: 60, // 1 Stunde
          status: 'unknown'
        },
        googleBard: {
          id: 'googleBard',
          name: 'OpenRouter/Mistral',
          type: 'chatbot',
          monitoringEnabled: true,
          checkInterval: 30, // 30 Minuten
          status: 'unknown'
        },
        bingCopilot: {
          id: 'bingCopilot',
          name: 'Bing Copilot',
          type: 'search_ai',
          monitoringEnabled: true,
          checkInterval: 45, // 45 Minuten
          status: 'unknown'
        },
        perplexity: {
          id: 'perplexity',
          name: 'Perplexity AI',
          type: 'research_ai',
          monitoringEnabled: true,
          checkInterval: 60, // 1 Stunde
          status: 'unknown'
        },
        claude: {
          id: 'claude',
          name: 'Claude/Anthropic',
          type: 'chatbot',
          monitoringEnabled: true,
          checkInterval: 120, // 2 Stunden
          status: 'unknown'
        }
      },
      checkInterval: 30, // 30 Minuten global
      dataRetention: 30, // 30 Tage
      alertThresholds: {
        responseTimeWarning: 5000, // 5 Sekunden
        consecutiveFailures: 3,
        offlineDuration: 120 // 2 Stunden
      },
      reporting: {
        generateReports: true,
        reportInterval: 24, // 24 Stunden
        storeHistoricalData: true
      }
    };
  }

  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  // ===== MONITORING CORE =====

  public async startMonitoring(): Promise<void> {
    if (this.isRunning) {
      console.log('AI Platform Monitoring is already running');
      return;
    }

    console.log('Starting AI Platform Monitoring Service...');
    this.isRunning = true;

    // Initial check
    await this.performAllPlatformChecks();

    // Setup periodic checks
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performAllPlatformChecks();
      } catch (error) {
        console.error('Error during platform checks:', error);
      }
    }, this.config.checkInterval * 60 * 1000);

    // Setup report generation
    if (this.config.reporting.generateReports) {
      this.reportInterval = setInterval(async () => {
        try {
          await this.generateMonitoringReport();
        } catch (error) {
          console.error('Error generating monitoring report:', error);
        }
      }, this.config.reporting.reportInterval * 60 * 60 * 1000);
    }

    console.log('AI Platform Monitoring Service started successfully');
  }

  public async stopMonitoring(): Promise<void> {
    if (!this.isRunning) {
      console.log('AI Platform Monitoring is not running');
      return;
    }

    console.log('Stopping AI Platform Monitoring Service...');
    this.isRunning = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = undefined;
    }

    console.log('AI Platform Monitoring Service stopped');
  }

  public getStatus(): {
    isRunning: boolean;
    lastCheck?: Date;
    platforms: Record<string, { status: string; lastCheck?: Date }>;
  } {
    const platforms: Record<string, { status: string; lastCheck?: Date }> = {};

    for (const [platformId, platform] of Object.entries(this.config.platforms)) {
      const checks = this.platformChecks.get(platformId) || [];
      const lastCheck = checks.length > 0 ? checks[checks.length - 1] : undefined;

      platforms[platformId] = {
        status: platform.status,
        lastCheck: lastCheck?.timestamp
      };
    }

    return {
      isRunning: this.isRunning,
      lastCheck: this.getLastGlobalCheck(),
      platforms
    };
  }

  // ===== PLATFORM CHECKS =====

  private async performAllPlatformChecks(): Promise<void> {
    const checkPromises: Promise<void>[] = [];

    for (const [platformId, platform] of Object.entries(this.config.platforms)) {
      if (platform.monitoringEnabled) {
        checkPromises.push(this.performPlatformCheck(platformId));
      }
    }

    await Promise.allSettled(checkPromises);

    // Update analytics service
    await this.updateAnalyticsService();

    console.log(`Completed platform checks for ${checkPromises.length} platforms`);
  }

  private async performPlatformCheck(platformId: string): Promise<void> {
    const platform = this.config.platforms[platformId];
    if (!platform) return;

    const startTime = Date.now();

    try {
      const checkResult = await this.checkPlatformStatus(platform);
      const responseTime = Date.now() - startTime;

      // Update platform status
      platform.status = checkResult.status;
      platform.lastCheck = new Date();

      // Store result
      if (!this.platformChecks.has(platformId)) {
        this.platformChecks.set(platformId, []);
      }

      const platformChecks = this.platformChecks.get(platformId)!;
      platformChecks.push({
        ...checkResult,
        timestamp: new Date(),
        responseTime
      });

      // Keep only recent checks (last 100)
      if (platformChecks.length > 100) {
        platformChecks.splice(0, platformChecks.length - 100);
      }

      // Check for alerts
      await this.checkPlatformAlerts(platformId, {
        ...checkResult,
        timestamp: new Date(),
        responseTime
      });

    } catch (error) {
      console.error(`Error checking platform ${platformId}:`, error);

      // Record error
      const errorResult: PlatformCheckResult = {
        platform: platformId,
        timestamp: new Date(),
        status: 'offline',
        responseTime: Date.now() - startTime,
        indicators: {
          error: error instanceof Error ? error.message : 'Unknown error',
          contentAccessible: false
        },
        performance: {
          responseTime: Date.now() - startTime,
          attempts: 1,
          errors: [error]
        },
        errors: [error]
      };

      if (!this.platformChecks.has(platformId)) {
        this.platformChecks.set(platformId, []);
      }
      this.platformChecks.get(platformId)!.push(errorResult);

      platform.status = 'offline';
    }
  }

  private async checkPlatformStatus(platform: AIPlatform): Promise<Omit<PlatformCheckResult, 'responseTime' | 'timestamp'>> {
    // Simulate platform checks (in production, this would make actual API calls)
    const result: Omit<PlatformCheckResult, 'responseTime' | 'timestamp'> = {
      platform: platform.id,
      status: 'offline', // Default to offline since we can't actually check external APIs
      indicators: {
        contentAccessible: true, // Assume content is accessible
        lastUpdated: new Date()
      },
      performance: {
        responseTime: 0,
        attempts: 1,
        errors: []
      },
      errors: []
    };

    // Platform-specific checks
    switch (platform.id) {
      case 'chatgpt':
        result.indicators = {
          ...result.indicators,
          webBrowsingEnabled: false, // Would check actual API
          pluginsAvailable: [],
          contentIndexed: true,
          error: 'External API not accessible for monitoring'
        };
        break;

      case 'googleBard':
        result.indicators = {
          ...result.indicators,
          featuredSnippet: false,
          knowledgePanel: false,
          aiAnswers: false,
          searchResults: [],
          error: 'External API not accessible for monitoring'
        };
        break;

      case 'bingCopilot':
        result.indicators = {
          ...result.indicators,
          copilotAnswers: false,
          sidebarResults: false,
          searchResults: [],
          error: 'External API not accessible for monitoring'
        };
        break;

      case 'perplexity':
        result.indicators = {
          ...result.indicators,
          aiAnswers: false,
          sourcesCited: false,
          citations: [],
          error: 'External API not accessible for monitoring'
        };
        break;

      case 'claude':
        result.indicators = {
          ...result.indicators,
          contentAccessible: true,
          error: 'External API not accessible for monitoring'
        };
        break;
    }

    // Simulate some variability
    const randomDelay = Math.random() * 2000 + 500; // 500-2500ms
    await new Promise(resolve => setTimeout(resolve, randomDelay));

    return result;
  }

  // ===== ANALYTICS INTEGRATION =====

  private async updateAnalyticsService(): Promise<void> {
    try {
      // Update AI Monitoring Analytics Service with latest data
      for (const [platformId, checks] of this.platformChecks) {
        const latestCheck = checks[checks.length - 1];
        if (latestCheck) {
          // Convert to analytics service format
          await aiMonitoringAnalyticsService.trackAISearchPerformance(
            platformId,
            `ai_platform_check_${platformId}`,
            {
              impressions: 1, // Placeholder
              clicks: latestCheck.status === 'online' ? 1 : 0,
              ctr: latestCheck.status === 'online' ? 1.0 : 0.0,
              featuredSnippet: latestCheck.indicators.featuredSnippet || false,
              knowledgePanel: latestCheck.indicators.knowledgePanel || false,
              aiSummary: latestCheck.indicators.aiAnswers || false
            }
          );
        }
      }
    } catch (error) {
      console.error('Error updating analytics service:', error);
    }
  }

  // ===== REPORTING =====

  private async generateMonitoringReport(): Promise<void> {
    const report = this.createMonitoringReport();
    await this.saveReport(report);
    console.log(`Generated monitoring report: ${report.timestamp.toISOString()}`);
  }

  private createMonitoringReport(): MonitoringReport {
    const platforms: Record<string, PlatformCheckResult> = {};
    let totalResponseTime = 0;
    let totalErrors = 0;
    let onlinePlatforms = 0;
    let platformsWithContent = 0;
    let platformsWithErrors = 0;

    for (const [platformId, checks] of this.platformChecks) {
      const latestCheck = checks[checks.length - 1];
      if (latestCheck) {
        platforms[platformId] = latestCheck;
        totalResponseTime += latestCheck.responseTime;
        totalErrors += latestCheck.errors.length;

        if (latestCheck.status === 'online') onlinePlatforms++;
        if (latestCheck.indicators.contentAccessible) platformsWithContent++;
        if (latestCheck.errors.length > 0) platformsWithErrors++;
      }
    }

    const totalPlatforms = Object.keys(this.config.platforms).length;
    const averageResponseTime = totalResponseTime / Math.max(totalPlatforms, 1);

    return {
      timestamp: new Date(),
      platforms,
      summary: {
        totalPlatforms,
        onlinePlatforms,
        platformsWithContent,
        platformsWithErrors,
        averageResponseTime,
        totalErrors,
        performance: {
          averageResponseTime,
          totalResponseTime,
          errorRate: totalErrors / Math.max(totalPlatforms, 1)
        }
      }
    };
  }

  private async saveReport(report: MonitoringReport): Promise<void> {
    try {
      // Save log entry to localStorage
      const logKey = 'ai-platform-monitoring-log';
      const logEntry = {
        timestamp: report.timestamp.toISOString(),
        summary: report.summary
      };

      const existingLog = localStorage.getItem(logKey);
      let logData: any[] = [];
      if (existingLog) {
        logData = JSON.parse(existingLog);
      }
      logData.push(logEntry);

      // Keep only last 100 entries
      if (logData.length > 100) {
        logData = logData.slice(-100);
      }

      localStorage.setItem(logKey, JSON.stringify(logData));

      // Save detailed report to localStorage
      const reportKey = `ai-platform-report-${report.timestamp.toISOString().split('T')[0]}`;
      localStorage.setItem(reportKey, JSON.stringify(report));

      console.log(`Saved monitoring report to localStorage: ${reportKey}`);

    } catch (error) {
      console.error('Error saving monitoring report:', error);
    }
  }

  // ===== ALERTS =====

  private async checkPlatformAlerts(platformId: string, result: PlatformCheckResult): Promise<void> {
    // Check response time
    if (result.responseTime > this.config.alertThresholds.responseTimeWarning) {
      console.warn(`Warning: High response time for ${platformId}: ${result.responseTime}ms`);
    }

    // Check consecutive failures
    const checks = this.platformChecks.get(platformId) || [];
    const recentChecks = checks.slice(-this.config.alertThresholds.consecutiveFailures);
    const consecutiveFailures = recentChecks.filter(c => c.status === 'offline').length;

    if (consecutiveFailures >= this.config.alertThresholds.consecutiveFailures) {
      console.error(`Alert: ${platformId} has been offline for ${consecutiveFailures} consecutive checks`);
    }

    // Check offline duration
    if (result.status === 'offline') {
      const lastOnlineCheck = checks.slice().reverse().find(c => c.status === 'online');
      if (lastOnlineCheck) {
        const offlineDuration = Date.now() - lastOnlineCheck.timestamp.getTime();
        const offlineMinutes = offlineDuration / (1000 * 60);

        if (offlineMinutes > this.config.alertThresholds.offlineDuration) {
          console.error(`Alert: ${platformId} has been offline for ${offlineMinutes.toFixed(1)} minutes`);
        }
      }
    }
  }

  // ===== DATA MANAGEMENT =====

  private loadExistingData(): void {
    try {
      const logKey = 'ai-platform-monitoring-log';
      const existingLog = localStorage.getItem(logKey);

      if (existingLog) {
        const logData = JSON.parse(existingLog);

        // Load recent platform checks from log
        for (const entry of logData.slice(-10)) { // Last 10 entries
          // This is simplified - in production, you'd load detailed reports
          for (const platformId of Object.keys(this.config.platforms)) {
            if (!this.platformChecks.has(platformId)) {
              this.platformChecks.set(platformId, []);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Could not load existing monitoring data:', error);
    }
  }

  private saveConfig(): void {
    try {
      const configKey = 'ai-platform-monitoring-config';
      localStorage.setItem(configKey, JSON.stringify(this.config));
    } catch (error) {
      console.error('Error saving monitoring config:', error);
    }
  }

  private getLastGlobalCheck(): Date | undefined {
    let latestCheck: Date | undefined;

    for (const checks of this.platformChecks.values()) {
      const lastCheck = checks[checks.length - 1];
      if (lastCheck && (!latestCheck || lastCheck.timestamp > latestCheck)) {
        latestCheck = lastCheck.timestamp;
      }
    }

    return latestCheck;
  }

  // ===== PUBLIC API =====

  public async performManualCheck(platformId?: string): Promise<MonitoringReport | PlatformCheckResult | null | undefined> {
    if (platformId) {
      await this.performPlatformCheck(platformId);
      const checks = this.platformChecks.get(platformId);
      return checks ? checks[checks.length - 1] : null;
    } else {
      await this.performAllPlatformChecks();
      return this.createMonitoringReport();
    }
  }

  public getPlatformHistory(platformId: string, limit: number = 50): PlatformCheckResult[] {
    const checks = this.platformChecks.get(platformId) || [];
    return checks.slice(-limit);
  }

  public getAllPlatformHistory(limit: number = 20): Record<string, PlatformCheckResult[]> {
    const result: Record<string, PlatformCheckResult[]> = {};

    for (const [platformId, checks] of this.platformChecks) {
      result[platformId] = checks.slice(-limit);
    }

    return result;
  }

  public clearOldData(): void {
    const cutoffDate = new Date(Date.now() - this.config.dataRetention * 24 * 60 * 60 * 1000);

    for (const [platformId, checks] of this.platformChecks) {
      const filteredChecks = checks.filter(check => check.timestamp >= cutoffDate);
      this.platformChecks.set(platformId, filteredChecks);
    }

    console.log(`Cleared old monitoring data older than ${cutoffDate.toISOString()}`);
  }
}

// ===== EXPORT =====

export const aiPlatformMonitoringService = AIPlatformMonitoringService.getInstance();
export default aiPlatformMonitoringService;

/**
 * ===== USAGE EXAMPLES =====
 *
 * // Start monitoring
 * await aiPlatformMonitoringService.startMonitoring();
 *
 * // Get current status
 * const status = aiPlatformMonitoringService.getStatus();
 *
 * // Perform manual check
 * const report = await aiPlatformMonitoringService.performManualCheck();
 *
 * // Get platform history
 * const history = aiPlatformMonitoringService.getPlatformHistory('chatgpt');
 *
 * // Stop monitoring
 * await aiPlatformMonitoringService.stopMonitoring();
 */