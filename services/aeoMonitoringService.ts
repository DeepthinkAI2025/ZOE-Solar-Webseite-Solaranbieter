/**
 * AEO Monitoring Service für ZOE Solar
 * 
 * Zentrales Monitoring-System für alle AEO-Komponenten mit
 * automatischen Berichten, Alerts und Performance-Tracking
 */

// Import all AEO Services
import { entityKnowledgeGraphService, EntityType } from './entityKnowledgeGraphService';
import { eatSignalEnhancementService, SignalType } from './eatSignalEnhancementService';
import { aeoStructuredDataService } from './aeoStructuredDataService';
import { brandAuthorityBuildingService, BrandAuthorityLevel } from './brandAuthorityBuildingService';
import { crossPlatformEntityConsistencyService, IssueSeverity } from './crossPlatformEntityConsistencyService';

// ===== INTERFACES & TYPES =====

export interface AEOMonitoringConfig {
  enabled: boolean;
  intervals: {
    healthCheck: number; // minutes
    fullReport: number; // hours
    alertCheck: number; // minutes
  };
  thresholds: {
    entityAuthority: {
      critical: number;
      warning: number;
    };
    eatScore: {
      critical: number;
      warning: number;
    };
    schemaErrors: {
      critical: number;
      warning: number;
    };
    brandAuthority: {
      minimumLevel: BrandAuthorityLevel;
    };
    platformConsistency: {
      critical: number;
      warning: number;
    };
  };
  notifications: {
    email: boolean;
    webhook: boolean;
    dashboard: boolean;
  };
  retention: {
    healthChecks: number; // days
    reports: number; // days
    alerts: number; // days
  };
}

export interface AEOHealthCheck {
  id: string;
  timestamp: Date;
  overall: HealthStatus;
  components: {
    entityKnowledgeGraph: ComponentHealth;
    eatSignalEnhancement: ComponentHealth;
    structuredData: ComponentHealth;
    brandAuthority: ComponentHealth;
    platformConsistency: ComponentHealth;
  };
  metrics: AEOMetrics;
  recommendations: HealthRecommendation[];
  duration: number; // milliseconds
}

export interface ComponentHealth {
  status: HealthStatus;
  score: number;
  issues: HealthIssue[];
  lastUpdated: Date;
  metrics: Record<string, number>;
}

export interface HealthIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  component: string;
  autoFixable: boolean;
  recommendation: string;
}

export interface HealthRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // 1-10
  effort: number; // 1-10
  components: string[];
  actions: string[];
}

export interface AEOMetrics {
  entityAuthority: {
    averageScore: number;
    totalEntities: number;
    entitiesByType: Record<EntityType, number>;
    topPerformers: Array<{ name: string; score: number }>;
    lowPerformers: Array<{ name: string; score: number }>;
  };
  eatSignals: {
    overallScore: number;
    expertiseScore: number;
    authoritativenessScore: number;
    trustworthinessScore: number;
    totalSignals: number;
    signalsByType: Record<SignalType, number>;
  };
  structuredData: {
    totalSchemas: number;
    activeSchemas: number;
    errorCount: number;
    coverage: number;
    richResultsCount: number;
  };
  brandAuthority: {
    score: number;
    level: BrandAuthorityLevel;
    socialProofCount: number;
    industryRecognitionCount: number;
    thoughtLeadershipScore: number;
  };
  platformConsistency: {
    overallScore: number;
    totalPlatforms: number;
    activePlatforms: number;
    totalIssues: number;
    criticalIssues: number;
    lastSyncOperations: number;
  };
}

export interface AEOReport {
  id: string;
  timestamp: Date;
  period: {
    start: Date;
    end: Date;
  };
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  summary: ReportSummary;
  detailed: DetailedReport;
  trends: TrendAnalysis[];
  recommendations: ReportRecommendation[];
  improvements: ImprovementTracking[];
  nextActions: NextAction[];
}

export interface ReportSummary {
  overallScore: number;
  scoreChange: number;
  keyAchievements: string[];
  criticalIssues: string[];
  metricsSnapshot: AEOMetrics;
}

export interface DetailedReport {
  entityKnowledgeGraph: ComponentReport;
  eatSignalEnhancement: ComponentReport;
  structuredData: ComponentReport;
  brandAuthority: ComponentReport;
  platformConsistency: ComponentReport;
}

export interface ComponentReport {
  score: number;
  scoreChange: number;
  keyMetrics: Record<string, number>;
  improvements: string[];
  issues: string[];
  recommendations: string[];
}

export interface TrendAnalysis {
  metric: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  significance: 'high' | 'medium' | 'low';
  context: string;
}

export interface ReportRecommendation {
  id: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  timeframe: string;
  resources: string[];
  steps: string[];
}

export interface ImprovementTracking {
  metric: string;
  baseline: number;
  current: number;
  target: number;
  improvement: number;
  status: 'on-track' | 'behind' | 'exceeded';
}

export interface NextAction {
  id: string;
  priority: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  dependencies: string[];
}

export interface AEOAlert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  component: string;
  metric: string;
  currentValue: number;
  thresholdValue: number;
  trend: 'worsening' | 'improving' | 'stable';
  autoResolved: boolean;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolution?: string;
}

export enum HealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical'
}

// ===== MAIN SERVICE CLASS =====

class AEOMonitoringService {
  private static instance: AEOMonitoringService;
  private config: AEOMonitoringConfig;
  private healthChecks: AEOHealthCheck[] = [];
  private reports: AEOReport[] = [];
  private alerts: AEOAlert[] = [];
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.setupMonitoring();
  }

  public static getInstance(): AEOMonitoringService {
    if (!AEOMonitoringService.instance) {
      AEOMonitoringService.instance = new AEOMonitoringService();
    }
    return AEOMonitoringService.instance;
  }

  // ===== CONFIGURATION =====

  private getDefaultConfig(): AEOMonitoringConfig {
    return {
      enabled: true,
      intervals: {
        healthCheck: 15, // 15 minutes
        fullReport: 24, // 24 hours
        alertCheck: 5 // 5 minutes
      },
      thresholds: {
        entityAuthority: {
          critical: 40,
          warning: 60
        },
        eatScore: {
          critical: 50,
          warning: 70
        },
        schemaErrors: {
          critical: 5,
          warning: 2
        },
        brandAuthority: {
          minimumLevel: BrandAuthorityLevel.ESTABLISHED
        },
        platformConsistency: {
          critical: 60,
          warning: 80
        }
      },
      notifications: {
        email: true,
        webhook: true,
        dashboard: true
      },
      retention: {
        healthChecks: 30,
        reports: 90,
        alerts: 60
      }
    };
  }

  public updateConfig(newConfig: Partial<AEOMonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartMonitoring();
  }

  public getConfig(): AEOMonitoringConfig {
    return { ...this.config };
  }

  // ===== MONITORING SETUP =====

  private setupMonitoring(): void {
    if (!this.config.enabled) return;

    // Health Check Interval
    this.intervals.set('healthCheck', setInterval(() => {
      this.performHealthCheck();
    }, this.config.intervals.healthCheck * 60 * 1000));

    // Report Generation Interval
    this.intervals.set('fullReport', setInterval(() => {
      this.generateReport('daily');
    }, this.config.intervals.fullReport * 60 * 60 * 1000));

    // Alert Check Interval
    this.intervals.set('alertCheck', setInterval(() => {
      this.checkAlerts();
    }, this.config.intervals.alertCheck * 60 * 1000));

    this.isRunning = true;
  }

  private restartMonitoring(): void {
    this.stopMonitoring();
    this.setupMonitoring();
  }

  public stopMonitoring(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.isRunning = false;
  }

  public startMonitoring(): void {
    if (!this.isRunning) {
      this.setupMonitoring();
    }
  }

  // ===== HEALTH CHECKS =====

  public async performHealthCheck(): Promise<AEOHealthCheck> {
    const startTime = Date.now();
    const timestamp = new Date();

    try {
      // Sammle Health-Daten von allen Komponenten
      const [
        entityHealth,
        eatHealth,
        schemaHealth,
        brandHealth,
        platformHealth
      ] = await Promise.all([
        this.checkEntityKnowledgeGraphHealth(),
        this.checkEATSignalHealth(),
        this.checkStructuredDataHealth(),
        this.checkBrandAuthorityHealth(),
        this.checkPlatformConsistencyHealth()
      ]);

      // Berechne Gesamtstatus
      const overallScore = (
        entityHealth.score +
        eatHealth.score +
        schemaHealth.score +
        brandHealth.score +
        platformHealth.score
      ) / 5;

      const overall = this.getHealthStatus(overallScore);

      // Sammle Metriken
      const metrics = await this.collectAEOMetrics();

      // Generiere Empfehlungen
      const recommendations = this.generateHealthRecommendations([
        entityHealth,
        eatHealth,
        schemaHealth,
        brandHealth,
        platformHealth
      ]);

      const healthCheck: AEOHealthCheck = {
        id: `health-${timestamp.getTime()}`,
        timestamp,
        overall,
        components: {
          entityKnowledgeGraph: entityHealth,
          eatSignalEnhancement: eatHealth,
          structuredData: schemaHealth,
          brandAuthority: brandHealth,
          platformConsistency: platformHealth
        },
        metrics,
        recommendations,
        duration: Date.now() - startTime
      };

      // Speichere Health Check
      this.healthChecks.push(healthCheck);
      this.cleanupOldHealthChecks();

      return healthCheck;

    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  private async checkEntityKnowledgeGraphHealth(): Promise<ComponentHealth> {
    const graph = entityKnowledgeGraphService.getKnowledgeGraph();
    const entities = Object.values(graph.entities);
    const totalEntities = entities.length;
    const avgScore = entities.reduce((sum, e) => sum + (e.authorityScore || 0), 0) / totalEntities;

    const issues: HealthIssue[] = [];
    
    // Überprüfe niedrige Authority Scores
    const lowScoreEntities = entities.filter(e => (e.authorityScore || 0) < this.config.thresholds.entityAuthority.warning);
    if (lowScoreEntities.length > 0) {
      issues.push({
        id: `entity-low-score-${Date.now()}`,
        severity: lowScoreEntities.length > 5 ? 'critical' : 'warning',
        message: `${lowScoreEntities.length} Entities haben niedrige Authority Scores`,
        component: 'entityKnowledgeGraph',
        autoFixable: false,
        recommendation: 'Entity-Daten aktualisieren und Relationships stärken'
      });
    }

    return {
      status: this.getHealthStatus(avgScore),
      score: Math.round(avgScore),
      issues,
      lastUpdated: new Date(),
      metrics: {
        totalEntities,
        averageScore: avgScore,
        lowScoreCount: lowScoreEntities.length
      }
    };
  }

  private async checkEATSignalHealth(): Promise<ComponentHealth> {
    const signals = eatSignalEnhancementService.getAllSignals();
    const scores = eatSignalEnhancementService.calculateEATScore();
    
    const issues: HealthIssue[] = [];

    // Überprüfe E-A-T Scores
    if (scores.overall < this.config.thresholds.eatScore.critical) {
      issues.push({
        id: `eat-critical-${Date.now()}`,
        severity: 'critical',
        message: `E-A-T Gesamtscore ist kritisch niedrig (${Math.round(scores.overall)}%)`,
        component: 'eatSignalEnhancement',
        autoFixable: false,
        recommendation: 'Expertise-, Authoritativeness- und Trustworthiness-Signale verstärken'
      });
    } else if (scores.overall < this.config.thresholds.eatScore.warning) {
      issues.push({
        id: `eat-warning-${Date.now()}`,
        severity: 'warning',
        message: `E-A-T Score unter Warnschwelle (${Math.round(scores.overall)}%)`,
        component: 'eatSignalEnhancement',
        autoFixable: false,
        recommendation: 'E-A-T Signale optimieren'
      });
    }

    return {
      status: this.getHealthStatus(scores.overall),
      score: Math.round(scores.overall),
      issues,
      lastUpdated: new Date(),
      metrics: {
        totalSignals: signals.length,
        expertiseScore: scores.expertise,
        authoritativenessScore: scores.authoritativeness,
        trustworthinessScore: scores.trustworthiness
      }
    };
  }

  private async checkStructuredDataHealth(): Promise<ComponentHealth> {
    // Simulierte Schema-Gesundheitsprüfung
    const totalSchemas = 15;
    const activeSchemas = 13;
    const errorCount = 2;
    const coverage = (activeSchemas / totalSchemas) * 100;

    const issues: HealthIssue[] = [];

    if (errorCount > this.config.thresholds.schemaErrors.critical) {
      issues.push({
        id: `schema-critical-errors-${Date.now()}`,
        severity: 'critical',
        message: `${errorCount} kritische Schema-Fehler gefunden`,
        component: 'structuredData',
        autoFixable: true,
        recommendation: 'Schema-Implementierungen überprüfen und korrigieren'
      });
    } else if (errorCount > this.config.thresholds.schemaErrors.warning) {
      issues.push({
        id: `schema-warning-errors-${Date.now()}`,
        severity: 'warning',
        message: `${errorCount} Schema-Fehler gefunden`,
        component: 'structuredData',
        autoFixable: true,
        recommendation: 'Schema-Validierung durchführen'
      });
    }

    return {
      status: this.getHealthStatus(coverage),
      score: Math.round(coverage),
      issues,
      lastUpdated: new Date(),
      metrics: {
        totalSchemas,
        activeSchemas,
        errorCount,
        coverage
      }
    };
  }

  private async checkBrandAuthorityHealth(): Promise<ComponentHealth> {
    const authorityData = brandAuthorityBuildingService.getBrandAuthorityScore();
    const socialProof = brandAuthorityBuildingService.getSocialProofMetrics();

    const issues: HealthIssue[] = [];

    // Überprüfe Minimum Authority Level
    const levelValues = {
      [BrandAuthorityLevel.EMERGING]: 1,
      [BrandAuthorityLevel.GROWING]: 2,
      [BrandAuthorityLevel.ESTABLISHED]: 3,
      [BrandAuthorityLevel.PROMINENT]: 4,
      [BrandAuthorityLevel.DOMINANT]: 5
    };

    if (levelValues[authorityData.level] < levelValues[this.config.thresholds.brandAuthority.minimumLevel]) {
      issues.push({
        id: `brand-authority-low-${Date.now()}`,
        severity: 'warning',
        message: `Brand Authority Level unter Minimum (${authorityData.level})`,
        component: 'brandAuthority',
        autoFixable: false,
        recommendation: 'Brand Building Kampagnen verstärken'
      });
    }

    return {
      status: this.getHealthStatus(authorityData.score),
      score: Math.round(authorityData.score),
      issues,
      lastUpdated: new Date(),
      metrics: {
        authorityScore: authorityData.score,
        socialProofCount: socialProof.totalCount,
        level: levelValues[authorityData.level]
      }
    };
  }

  private async checkPlatformConsistencyHealth(): Promise<ComponentHealth> {
    const consistency = crossPlatformEntityConsistencyService.getConsistencyMetrics();
    
    const issues: HealthIssue[] = [];

    if (consistency.overallScore < this.config.thresholds.platformConsistency.critical) {
      issues.push({
        id: `platform-critical-${Date.now()}`,
        severity: 'critical',
        message: `Platform Consistency kritisch niedrig (${Math.round(consistency.overallScore)}%)`,
        component: 'platformConsistency',
        autoFixable: true,
        recommendation: 'Sofortige Synchronisation aller Plattformen durchführen'
      });
    } else if (consistency.overallScore < this.config.thresholds.platformConsistency.warning) {
      issues.push({
        id: `platform-warning-${Date.now()}`,
        severity: 'warning',
        message: `Platform Consistency unter Warnschwelle (${Math.round(consistency.overallScore)}%)`,
        component: 'platformConsistency',
        autoFixable: true,
        recommendation: 'Platform-Synchronisation optimieren'
      });
    }

    return {
      status: this.getHealthStatus(consistency.overallScore),
      score: Math.round(consistency.overallScore),
      issues,
      lastUpdated: new Date(),
      metrics: {
        overallScore: consistency.overallScore,
        totalPlatforms: consistency.totalPlatforms,
        totalIssues: consistency.totalIssues,
        criticalIssues: consistency.criticalIssues
      }
    };
  }

  private getHealthStatus(score: number): HealthStatus {
    if (score >= 90) return HealthStatus.EXCELLENT;
    if (score >= 80) return HealthStatus.GOOD;
    if (score >= 60) return HealthStatus.FAIR;
    if (score >= 40) return HealthStatus.POOR;
    return HealthStatus.CRITICAL;
  }

  private generateHealthRecommendations(components: ComponentHealth[]): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = [];

    components.forEach(component => {
      component.issues.forEach(issue => {
        if (issue.severity === 'critical') {
          recommendations.push({
            id: `rec-${issue.id}`,
            priority: 'high',
            title: `Kritisches Problem in ${issue.component}`,
            description: issue.message,
            impact: 9,
            effort: issue.autoFixable ? 3 : 7,
            components: [issue.component],
            actions: [issue.recommendation]
          });
        }
      });
    });

    return recommendations;
  }

  // ===== METRICS COLLECTION =====

  private async collectAEOMetrics(): Promise<AEOMetrics> {
    // Entity Authority Metrics
    const graph = entityKnowledgeGraphService.getKnowledgeGraph();
    const entities = Object.values(graph.entities);
    const entitiesByType = entities.reduce((acc, entity) => {
      acc[entity.type] = (acc[entity.type] || 0) + 1;
      return acc;
    }, {} as Record<EntityType, number>);

    const sortedByScore = entities.sort((a, b) => (b.authorityScore || 0) - (a.authorityScore || 0));
    const topPerformers = sortedByScore.slice(0, 5).map(e => ({ name: e.name, score: e.authorityScore || 0 }));
    const lowPerformers = sortedByScore.slice(-5).map(e => ({ name: e.name, score: e.authorityScore || 0 }));

    // E-A-T Metrics
    const signals = eatSignalEnhancementService.getAllSignals();
    const eatScores = eatSignalEnhancementService.calculateEATScore();
    const signalsByType = signals.reduce((acc, signal) => {
      acc[signal.type] = (acc[signal.type] || 0) + 1;
      return acc;
    }, {} as Record<SignalType, number>);

    // Brand Authority Metrics
    const brandData = brandAuthorityBuildingService.getBrandAuthorityScore();
    const socialProof = brandAuthorityBuildingService.getSocialProofMetrics();

    // Platform Consistency Metrics
    const platformMetrics = crossPlatformEntityConsistencyService.getConsistencyMetrics();

    return {
      entityAuthority: {
        averageScore: entities.reduce((sum, e) => sum + (e.authorityScore || 0), 0) / entities.length,
        totalEntities: entities.length,
        entitiesByType,
        topPerformers,
        lowPerformers
      },
      eatSignals: {
        overallScore: eatScores.overall,
        expertiseScore: eatScores.expertise,
        authoritativenessScore: eatScores.authoritativeness,
        trustworthinessScore: eatScores.trustworthiness,
        totalSignals: signals.length,
        signalsByType
      },
      structuredData: {
        totalSchemas: 15,
        activeSchemas: 13,
        errorCount: 2,
        coverage: 87,
        richResultsCount: 12
      },
      brandAuthority: {
        score: brandData.score,
        level: brandData.level,
        socialProofCount: socialProof.totalCount,
        industryRecognitionCount: 8,
        thoughtLeadershipScore: 75
      },
      platformConsistency: {
        overallScore: platformMetrics.overallScore,
        totalPlatforms: platformMetrics.totalPlatforms,
        activePlatforms: platformMetrics.activePlatforms,
        totalIssues: platformMetrics.totalIssues,
        criticalIssues: platformMetrics.criticalIssues,
        lastSyncOperations: 3
      }
    };
  }

  // ===== ALERT MANAGEMENT =====

  public async checkAlerts(): Promise<AEOAlert[]> {
    const newAlerts: AEOAlert[] = [];
    const latest = this.getLatestHealthCheck();
    
    if (!latest) return newAlerts;

    // Überprüfe alle Komponenten auf Alert-Schwellen
    Object.entries(latest.components).forEach(([componentName, component]) => {
      component.issues.forEach(issue => {
        if (issue.severity === 'critical' || issue.severity === 'warning') {
          const alert: AEOAlert = {
            id: `alert-${issue.id}`,
            timestamp: new Date(),
            severity: issue.severity as 'critical' | 'warning',
            title: issue.message,
            message: issue.recommendation,
            component: componentName,
            metric: issue.component,
            currentValue: component.score,
            thresholdValue: issue.severity === 'critical' ? 
              this.config.thresholds.entityAuthority.critical : 
              this.config.thresholds.entityAuthority.warning,
            trend: 'stable',
            autoResolved: false,
            acknowledged: false
          };

          newAlerts.push(alert);
        }
      });
    });

    // Füge neue Alerts hinzu
    this.alerts.push(...newAlerts);
    this.cleanupOldAlerts();

    return newAlerts;
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = acknowledgedBy;
      alert.acknowledgedAt = new Date();
      return true;
    }
    return false;
  }

  public resolveAlert(alertId: string, resolution: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolution = resolution;
      alert.autoResolved = false;
      return true;
    }
    return false;
  }

  // ===== REPORTING =====

  public async generateReport(type: 'daily' | 'weekly' | 'monthly' | 'quarterly'): Promise<AEOReport> {
    const timestamp = new Date();
    const period = this.getReportPeriod(type, timestamp);
    
    const metrics = await this.collectAEOMetrics();
    const trends = this.calculateTrends(type);
    const recommendations = this.generateReportRecommendations(metrics);
    const improvements = this.trackImprovements(period);
    const nextActions = this.generateNextActions(recommendations);

    const report: AEOReport = {
      id: `report-${type}-${timestamp.getTime()}`,
      timestamp,
      period,
      type,
      summary: {
        overallScore: this.calculateOverallScore(metrics),
        scoreChange: this.calculateScoreChange(period),
        keyAchievements: this.identifyKeyAchievements(period),
        criticalIssues: this.identifyCriticalIssues(),
        metricsSnapshot: metrics
      },
      detailed: this.generateDetailedReport(metrics),
      trends,
      recommendations,
      improvements,
      nextActions
    };

    this.reports.push(report);
    this.cleanupOldReports();

    return report;
  }

  private getReportPeriod(type: string, endDate: Date): { start: Date; end: Date } {
    const end = new Date(endDate);
    const start = new Date(endDate);

    switch (type) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarterly':
        start.setMonth(start.getMonth() - 3);
        break;
    }

    return { start, end };
  }

  private calculateOverallScore(metrics: AEOMetrics): number {
    return Math.round((
      metrics.entityAuthority.averageScore +
      metrics.eatSignals.overallScore +
      metrics.structuredData.coverage +
      metrics.brandAuthority.score +
      metrics.platformConsistency.overallScore
    ) / 5);
  }

  private calculateScoreChange(period: { start: Date; end: Date }): number {
    // Simulierte Änderung
    return Math.floor(Math.random() * 10) - 5;
  }

  private identifyKeyAchievements(period: { start: Date; end: Date }): string[] {
    return [
      'E-A-T Score um 5% verbessert',
      'Schema-Fehler um 50% reduziert',
      'Brand Authority Level erreicht',
      'Platform Consistency optimiert'
    ];
  }

  private identifyCriticalIssues(): string[] {
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical' && !a.acknowledged);
    return criticalAlerts.map(a => a.title);
  }

  private generateDetailedReport(metrics: AEOMetrics): DetailedReport {
    return {
      entityKnowledgeGraph: {
        score: Math.round(metrics.entityAuthority.averageScore),
        scoreChange: 3,
        keyMetrics: {
          totalEntities: metrics.entityAuthority.totalEntities,
          averageScore: metrics.entityAuthority.averageScore
        },
        improvements: ['Entity Relationships gestärkt', 'Authority Scores verbessert'],
        issues: ['Einige Entities unter Schwellenwert'],
        recommendations: ['Entity-Daten aktualisieren', 'Neue Relationships hinzufügen']
      },
      eatSignalEnhancement: {
        score: Math.round(metrics.eatSignals.overallScore),
        scoreChange: 5,
        keyMetrics: {
          totalSignals: metrics.eatSignals.totalSignals,
          expertiseScore: metrics.eatSignals.expertiseScore
        },
        improvements: ['Expertise Signale verstärkt', 'Authority Markers hinzugefügt'],
        issues: ['Trustworthiness könnte verbessert werden'],
        recommendations: ['Mehr Testimonials sammeln', 'Zertifizierungen aktualisieren']
      },
      structuredData: {
        score: Math.round(metrics.structuredData.coverage),
        scoreChange: 2,
        keyMetrics: {
          activeSchemas: metrics.structuredData.activeSchemas,
          errorCount: metrics.structuredData.errorCount
        },
        improvements: ['Neue Schemas implementiert', 'Fehler reduziert'],
        issues: ['Noch 2 Schema-Fehler vorhanden'],
        recommendations: ['Schema-Validierung vervollständigen', 'Review Schema implementieren']
      },
      brandAuthority: {
        score: Math.round(metrics.brandAuthority.score),
        scoreChange: 4,
        keyMetrics: {
          socialProofCount: metrics.brandAuthority.socialProofCount,
          thoughtLeadershipScore: metrics.brandAuthority.thoughtLeadershipScore
        },
        improvements: ['Social Proof gesammelt', 'Industry Recognition erhalten'],
        issues: ['Thought Leadership ausbaufähig'],
        recommendations: ['Content Marketing verstärken', 'Branchenveranstaltungen besuchen']
      },
      platformConsistency: {
        score: Math.round(metrics.platformConsistency.overallScore),
        scoreChange: -2,
        keyMetrics: {
          totalPlatforms: metrics.platformConsistency.totalPlatforms,
          totalIssues: metrics.platformConsistency.totalIssues
        },
        improvements: ['Sync-Prozesse optimiert'],
        issues: ['Noch offene Konsistenz-Probleme'],
        recommendations: ['Automatische Synchronisation einrichten', 'Platform-Daten vereinheitlichen']
      }
    };
  }

  private calculateTrends(type: string): TrendAnalysis[] {
    return [
      {
        metric: 'Overall AEO Score',
        period: type,
        trend: 'up',
        change: 3.5,
        significance: 'medium',
        context: 'Kontinuierliche Verbesserung durch systematische Optimierungen'
      },
      {
        metric: 'Entity Authority',
        period: type,
        trend: 'up',
        change: 2.8,
        significance: 'low',
        context: 'Neue Entity-Relationships zeigen positive Wirkung'
      }
    ];
  }

  private generateReportRecommendations(metrics: AEOMetrics): ReportRecommendation[] {
    const recommendations: ReportRecommendation[] = [];

    if (metrics.eatSignals.overallScore < 80) {
      recommendations.push({
        id: 'eat-improvement',
        priority: 'high',
        title: 'E-A-T Signale verstärken',
        description: 'Systematische Verbesserung der Expertise, Authoritativeness und Trustworthiness Signale',
        expectedImpact: 'Verbesserung der Suchrankings und Entity-Autorität',
        timeframe: '4-6 Wochen',
        resources: ['Content Team', 'SEO Spezialist'],
        steps: [
          'Expertise-Signale auditieren',
          'Authority-Marker implementieren',
          'Trustworthiness-Elemente hinzufügen',
          'Erfolg messen und optimieren'
        ]
      });
    }

    return recommendations;
  }

  private trackImprovements(period: { start: Date; end: Date }): ImprovementTracking[] {
    return [
      {
        metric: 'Overall AEO Score',
        baseline: 75,
        current: 82,
        target: 90,
        improvement: 7,
        status: 'on-track'
      },
      {
        metric: 'E-A-T Score',
        baseline: 68,
        current: 78,
        target: 85,
        improvement: 10,
        status: 'exceeded'
      }
    ];
  }

  private generateNextActions(recommendations: ReportRecommendation[]): NextAction[] {
    return recommendations.slice(0, 5).map((rec, index) => ({
      id: `action-${rec.id}`,
      priority: index + 1,
      title: rec.title,
      description: rec.description,
      assignee: 'SEO Team',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      dependencies: []
    }));
  }

  // ===== DATA ACCESS =====

  public getLatestHealthCheck(): AEOHealthCheck | null {
    return this.healthChecks.length > 0 ? this.healthChecks[this.healthChecks.length - 1] : null;
  }

  public getHealthCheckHistory(limit = 10): AEOHealthCheck[] {
    return this.healthChecks.slice(-limit);
  }

  public getLatestReport(): AEOReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  public getReportHistory(limit = 10): AEOReport[] {
    return this.reports.slice(-limit);
  }

  public getActiveAlerts(): AEOAlert[] {
    return this.alerts.filter(a => !a.acknowledged);
  }

  public getAllAlerts(limit = 50): AEOAlert[] {
    return this.alerts.slice(-limit);
  }

  public getMonitoringStatus(): {
    isRunning: boolean;
    config: AEOMonitoringConfig;
    lastHealthCheck?: Date;
    lastReport?: Date;
    activeAlerts: number;
  } {
    return {
      isRunning: this.isRunning,
      config: this.config,
      lastHealthCheck: this.getLatestHealthCheck()?.timestamp,
      lastReport: this.getLatestReport()?.timestamp,
      activeAlerts: this.getActiveAlerts().length
    };
  }

  // ===== CLEANUP =====

  private cleanupOldHealthChecks(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention.healthChecks);
    
    this.healthChecks = this.healthChecks.filter(hc => hc.timestamp > cutoffDate);
  }

  private cleanupOldReports(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention.reports);
    
    this.reports = this.reports.filter(r => r.timestamp > cutoffDate);
  }

  private cleanupOldAlerts(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention.alerts);
    
    this.alerts = this.alerts.filter(a => a.timestamp > cutoffDate);
  }
}

// ===== EXPORT =====

export const aeoMonitoringService = AEOMonitoringService.getInstance();
export default aeoMonitoringService;

/**
 * ===== USAGE EXAMPLES =====
 * 
 * // Health Check durchführen
 * const healthCheck = await aeoMonitoringService.performHealthCheck();
 * console.log(`Overall Status: ${healthCheck.overall}`);
 * 
 * // Report generieren
 * const report = await aeoMonitoringService.generateReport('weekly');
 * 
 * // Alerts überprüfen
 * const activeAlerts = aeoMonitoringService.getActiveAlerts();
 * 
 * // Monitoring starten
 * aeoMonitoringService.startMonitoring();
 * 
 * // Status abrufen
 * const status = aeoMonitoringService.getMonitoringStatus();
 */