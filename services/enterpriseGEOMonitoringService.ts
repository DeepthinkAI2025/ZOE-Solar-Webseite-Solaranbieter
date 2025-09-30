import { enterpriseGEOIntegrationService } from './enterpriseGEOIntegrationService';
import { enterpriseGEOOrchestrator } from './enterpriseGEOOrchestrator';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

export interface MonitoringAlert {
  id: string;
  type: 'performance' | 'availability' | 'data_quality' | 'security' | 'capacity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedServices: string[];
  affectedLocations: string[];
  threshold: {
    metric: string;
    current: number;
    threshold: number;
    operator: 'gt' | 'lt' | 'eq' | 'ne';
  };
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  autoResolved: boolean;
  escalationLevel: number;
  notificationsSent: string[];
  tags: string[];
}

export interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  location?: string;
  service?: string;
  tags: { [key: string]: string };
  metadata: { [key: string]: any };
}

export interface MonitoringThreshold {
  id: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne';
  value: number;
  duration: number; // Sekunden
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  enabled: boolean;
  cooldown: number; // Sekunden zwischen Alerts
  lastTriggered?: string;
}

export interface MonitoringDashboard {
  overview: {
    totalAlerts: number;
    activeAlerts: number;
    criticalAlerts: number;
    systemHealth: number;
    uptime: number;
  };
  serviceHealth: Array<{
    service: string;
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    responseTime: number;
    errorRate: number;
  }>;
  locationHealth: Array<{
    location: string;
    status: 'healthy' | 'warning' | 'error';
    performance: number;
    alerts: number;
  }>;
  recentAlerts: MonitoringAlert[];
  keyMetrics: Array<{
    name: string;
    current: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    status: 'good' | 'warning' | 'critical';
  }>;
  predictions: Array<{
    metric: string;
    prediction: number;
    confidence: number;
    timeframe: string;
    risk: 'low' | 'medium' | 'high';
  }>;
}

export interface MonitoringReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalMetrics: number;
    totalAlerts: number;
    systemAvailability: number;
    averagePerformance: number;
  };
  alerts: {
    bySeverity: { [severity: string]: number };
    byType: { [type: string]: number };
    byService: { [service: string]: number };
    topIssues: Array<{
      issue: string;
      count: number;
      impact: string;
    }>;
  };
  performance: {
    serviceMetrics: Array<{
      service: string;
      avgResponseTime: number;
      uptime: number;
      errorRate: number;
      throughput: number;
    }>;
    locationMetrics: Array<{
      location: string;
      performance: number;
      traffic: number;
      conversions: number;
      alerts: number;
    }>;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'performance' | 'reliability' | 'security' | 'capacity';
    recommendation: string;
    rationale: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }>;
  generatedAt: string;
}

/**
 * Enterprise GEO Monitoring Service
 * Umfassendes Monitoring- und Alert-System für die GEO-Infrastruktur
 */
export class EnterpriseGEOMonitoringService {
  private alerts: MonitoringAlert[] = [];
  private metrics: MonitoringMetric[] = [];
  private thresholds: MonitoringThreshold[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertCooldowns: Map<string, number> = new Map();

  constructor() {
    this.initializeDefaultThresholds();
    this.startMonitoring();
  }

  /**
   * Initialisiert Standard-Schwellenwerte
   */
  private initializeDefaultThresholds(): void {
    const defaultThresholds: Omit<MonitoringThreshold, 'id'>[] = [
      // Performance Thresholds
      {
        metric: 'response_time',
        operator: 'gt',
        value: 2000, // 2 Sekunden
        duration: 300, // 5 Minuten
        severity: 'medium',
        description: 'API Response Time zu hoch',
        enabled: true,
        cooldown: 600 // 10 Minuten
      },
      {
        metric: 'error_rate',
        operator: 'gt',
        value: 0.05, // 5%
        duration: 300,
        severity: 'high',
        description: 'Error Rate zu hoch',
        enabled: true,
        cooldown: 300
      },

      // Verfügbarkeit Thresholds
      {
        metric: 'uptime',
        operator: 'lt',
        value: 0.99, // 99%
        duration: 3600, // 1 Stunde
        severity: 'high',
        description: 'Service Uptime zu niedrig',
        enabled: true,
        cooldown: 1800
      },

      // Datenqualität Thresholds
      {
        metric: 'data_freshness',
        operator: 'lt',
        value: 3600, // 1 Stunde
        duration: 1800,
        severity: 'medium',
        description: 'Daten nicht mehr aktuell',
        enabled: true,
        cooldown: 900
      },

      // Kapazität Thresholds
      {
        metric: 'cpu_usage',
        operator: 'gt',
        value: 0.8, // 80%
        duration: 600,
        severity: 'medium',
        description: 'CPU-Auslastung zu hoch',
        enabled: true,
        cooldown: 1200
      },
      {
        metric: 'memory_usage',
        operator: 'gt',
        value: 0.85, // 85%
        duration: 600,
        severity: 'high',
        description: 'Memory-Auslastung zu hoch',
        enabled: true,
        cooldown: 1200
      },

      // SEO-spezifische Thresholds
      {
        metric: 'ranking_drop',
        operator: 'gt',
        value: 3, // 3 Plätze
        duration: 86400, // 1 Tag
        severity: 'high',
        description: 'Ranking-Verlust bei wichtigen Keywords',
        enabled: true,
        cooldown: 43200 // 12 Stunden
      },
      {
        metric: 'traffic_drop',
        operator: 'gt',
        value: 0.15, // 15%
        duration: 86400,
        severity: 'critical',
        description: 'Organischer Traffic-Einbruch',
        enabled: true,
        cooldown: 21600 // 6 Stunden
      }
    ];

    defaultThresholds.forEach(threshold => {
      this.addThreshold(threshold);
    });
  }

  /**
   * Startet das Monitoring
   */
  private startMonitoring(): void {
    // Sammle Metriken alle 30 Sekunden
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkThresholds();
      this.cleanupOldData();
    }, 30000);

    // Erstmalige Metrik-Sammlung
    this.collectMetrics();
  }

  /**
   * Sammelt Monitoring-Metriken
   */
  private collectMetrics(): void {
    const timestamp = new Date().toISOString();

    // System-Metriken
    this.addMetric({
      name: 'system_load',
      value: Math.random() * 0.8 + 0.1,
      unit: 'percentage',
      timestamp,
      tags: { type: 'system' },
      metadata: {}
    });

    // Service-Metriken
    const orchestratorMetrics = enterpriseGEOOrchestrator.getMetrics();
    this.addMetric({
      name: 'active_tasks',
      value: orchestratorMetrics.activeWorkflows,
      unit: 'count',
      timestamp,
      tags: { type: 'orchestrator' },
      metadata: {}
    });

    this.addMetric({
      name: 'queued_tasks',
      value: orchestratorMetrics.queuedTasks,
      unit: 'count',
      timestamp,
      tags: { type: 'orchestrator' },
      metadata: {}
    });

    // Standort-spezifische Metriken
    PRIMARY_SERVICE_REGIONS.forEach(region => {
      const locationKey = region.city.toLowerCase();
      const dashboard = enterpriseGEOIntegrationService.getIntegratedDashboard(locationKey);

      if (dashboard) {
        this.addMetric({
          name: 'performance_score',
          value: dashboard.overview.performanceScore,
          unit: 'score',
          timestamp,
          location: locationKey,
          tags: { type: 'performance' },
          metadata: { trend: dashboard.overview.trend }
        });

        this.addMetric({
          name: 'active_alerts',
          value: dashboard.alerts.filter(a => !a.resolved).length,
          unit: 'count',
          timestamp,
          location: locationKey,
          tags: { type: 'alerts' },
          metadata: {}
        });
      }
    });

    // API-Metriken (falls verfügbar)
    try {
      // Hier würden echte API-Metriken gesammelt werden
      this.addMetric({
        name: 'api_response_time',
        value: 150 + Math.random() * 200,
        unit: 'ms',
        timestamp,
        tags: { type: 'api' },
        metadata: {}
      });

      this.addMetric({
        name: 'api_error_rate',
        value: Math.random() * 0.02,
        unit: 'percentage',
        timestamp,
        tags: { type: 'api' },
        metadata: {}
      });
    } catch (error) {
      // API-Metriken nicht verfügbar
    }
  }

  /**
   * Fügt eine Metrik hinzu
   */
  public addMetric(metric: MonitoringMetric): void {
    this.metrics.push(metric);

    // Behalte nur die letzten 10.000 Metriken
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
  }

  /**
   * Fügt einen Schwellenwert hinzu
   */
  public addThreshold(threshold: Omit<MonitoringThreshold, 'id'>): string {
    const id = `threshold_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.thresholds.push({ ...threshold, id });
    return id;
  }

  /**
   * Prüft alle Schwellenwerte
   */
  private checkThresholds(): void {
    const now = Date.now();

    for (const threshold of this.thresholds) {
      if (!threshold.enabled) continue;

      // Prüfe Cooldown
      const lastTriggered = threshold.lastTriggered;
      if (lastTriggered) {
        const lastTriggeredTime = new Date(lastTriggered).getTime();
        if (now - lastTriggeredTime < threshold.cooldown * 1000) continue;
      }

      // Sammle relevante Metriken
      const relevantMetrics = this.metrics.filter(m =>
        m.name === threshold.metric &&
        (now - new Date(m.timestamp).getTime()) <= threshold.duration * 1000
      );

      if (relevantMetrics.length === 0) continue;

      // Prüfe Schwellenwert
      const shouldAlert = this.evaluateThreshold(threshold, relevantMetrics);

      if (shouldAlert) {
        this.createAlert(threshold, relevantMetrics);
        threshold.lastTriggered = new Date().toISOString();
      }
    }
  }

  /**
   * Evaluiert einen Schwellenwert
   */
  private evaluateThreshold(threshold: MonitoringThreshold, metrics: MonitoringMetric[]): boolean {
    const values = metrics.map(m => m.value);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;

    switch (threshold.operator) {
      case 'gt': return avgValue > threshold.value;
      case 'lt': return avgValue < threshold.value;
      case 'eq': return Math.abs(avgValue - threshold.value) < 0.01;
      case 'ne': return Math.abs(avgValue - threshold.value) >= 0.01;
      default: return false;
    }
  }

  /**
   * Erstellt einen Alert
   */
  private createAlert(threshold: MonitoringThreshold, metrics: MonitoringMetric[]): void {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentValue = metrics[metrics.length - 1]?.value || 0;

    const alert: MonitoringAlert = {
      id: alertId,
      type: this.getAlertTypeFromMetric(threshold.metric),
      severity: threshold.severity,
      title: threshold.description,
      description: `${threshold.metric} überschreitet Schwellenwert. Aktueller Wert: ${currentValue.toFixed(2)}, Schwellenwert: ${threshold.value}`,
      affectedServices: this.getAffectedServices(threshold.metric, metrics),
      affectedLocations: this.getAffectedLocations(metrics),
      threshold: {
        metric: threshold.metric,
        current: currentValue,
        threshold: threshold.value,
        operator: threshold.operator
      },
      timestamp: new Date().toISOString(),
      acknowledged: false,
      resolved: false,
      autoResolved: false,
      escalationLevel: 0,
      notificationsSent: [],
      tags: ['auto-generated', threshold.metric]
    };

    this.alerts.push(alert);

    // Sende Benachrichtigungen
    this.sendAlertNotifications(alert);

    // Erstelle Orchestrator-Event
    enterpriseGEOOrchestrator.addEvent({
      type: 'performance_alert',
      severity: alert.severity,
      source: 'monitoring_service',
      message: alert.title,
      data: {
        alertId,
        threshold: threshold.metric,
        currentValue,
        thresholdValue: threshold.value,
        affectedLocations: alert.affectedLocations
      }
    });
  }

  /**
   * Bestimmt Alert-Typ aus Metrik
   */
  private getAlertTypeFromMetric(metric: string): MonitoringAlert['type'] {
    if (metric.includes('response_time') || metric.includes('performance')) {
      return 'performance';
    }
    if (metric.includes('uptime') || metric.includes('error')) {
      return 'availability';
    }
    if (metric.includes('data') || metric.includes('freshness')) {
      return 'data_quality';
    }
    if (metric.includes('cpu') || metric.includes('memory')) {
      return 'capacity';
    }
    return 'performance';
  }

  /**
   * Ermittelt betroffene Services
   */
  private getAffectedServices(metric: string, metrics: MonitoringMetric[]): string[] {
    const services = new Set<string>();

    metrics.forEach(m => {
      if (m.service) services.add(m.service);
      if (m.tags.service) services.add(m.tags.service);
    });

    // Fallback: Alle Services als betroffen markieren
    if (services.size === 0) {
      return ['enterpriseGEOIntegration', 'enterpriseGEOOrchestrator'];
    }

    return Array.from(services);
  }

  /**
   * Ermittelt betroffene Standorte
   */
  private getAffectedLocations(metrics: MonitoringMetric[]): string[] {
    const locations = new Set<string>();

    metrics.forEach(m => {
      if (m.location) locations.add(m.location);
    });

    return Array.from(locations);
  }

  /**
   * Sendet Alert-Benachrichtigungen
   */
  private sendAlertNotifications(alert: MonitoringAlert): void {
    // Hier würden echte Benachrichtigungen implementiert werden
    // Email, Slack, SMS, etc.

    console.log(`Alert Notification: ${alert.title} (${alert.severity})`);

    alert.notificationsSent.push('console'); // Placeholder
  }

  /**
   * Bereinigt alte Daten
   */
  private cleanupOldData(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 Stunden

    // Alte Metriken entfernen
    this.metrics = this.metrics.filter(m =>
      new Date(m.timestamp).getTime() > cutoffTime
    );

    // Alte Alerts entfernen (außer kritische)
    this.alerts = this.alerts.filter(a =>
      a.severity === 'critical' ||
      new Date(a.timestamp).getTime() > cutoffTime
    );
  }

  /**
   * Ruft Monitoring-Dashboard ab
   */
  public getMonitoringDashboard(): MonitoringDashboard {
    const activeAlerts = this.alerts.filter(a => !a.resolved);
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

    const serviceHealth = this.calculateServiceHealth();
    const locationHealth = this.calculateLocationHealth();

    return {
      overview: {
        totalAlerts: this.alerts.length,
        activeAlerts: activeAlerts.length,
        criticalAlerts: criticalAlerts.length,
        systemHealth: this.calculateSystemHealth(),
        uptime: this.calculateUptime()
      },
      serviceHealth,
      locationHealth,
      recentAlerts: this.alerts.slice(-10),
      keyMetrics: this.getKeyMetrics(),
      predictions: this.generatePredictions()
    };
  }

  /**
   * Berechnet Service-Health
   */
  private calculateServiceHealth(): Array<{
    service: string;
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    responseTime: number;
    errorRate: number;
  }> {
    const services = ['enterpriseGEOIntegration', 'enterpriseGEOOrchestrator', 'enterpriseGEOAPIGateway'];

    return services.map(service => {
      const serviceMetrics = this.metrics.filter(m => m.service === service || m.tags.service === service);
      const uptime = this.calculateServiceUptime(service);
      const responseTime = this.calculateAverageResponseTime(service);
      const errorRate = this.calculateErrorRate(service);

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      if (errorRate > 0.05 || uptime < 0.99) status = 'error';
      else if (errorRate > 0.02 || responseTime > 1000) status = 'warning';

      return {
        service,
        status,
        uptime,
        responseTime,
        errorRate
      };
    });
  }

  /**
   * Berechnet Location-Health
   */
  private calculateLocationHealth(): Array<{
    location: string;
    status: 'healthy' | 'warning' | 'error';
    performance: number;
    alerts: number;
  }> {
    return PRIMARY_SERVICE_REGIONS.map(region => {
      const locationKey = region.city.toLowerCase();
      const locationMetrics = this.metrics.filter(m => m.location === locationKey);
      const performance = this.calculateLocationPerformance(locationKey);
      const alerts = this.alerts.filter(a =>
        a.affectedLocations.includes(locationKey) && !a.resolved
      ).length;

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      if (alerts > 5 || performance < 50) status = 'error';
      else if (alerts > 2 || performance < 75) status = 'warning';

      return {
        location: locationKey,
        status,
        performance,
        alerts
      };
    });
  }

  /**
   * Berechnet System-Health
   */
  private calculateSystemHealth(): number {
    const serviceHealth = this.calculateServiceHealth();
    const avgHealth = serviceHealth.reduce((sum, s) => {
      const healthScore = s.status === 'healthy' ? 1 : s.status === 'warning' ? 0.5 : 0;
      return sum + healthScore;
    }, 0) / serviceHealth.length;

    return Math.round(avgHealth * 100);
  }

  /**
   * Berechnet Uptime
   */
  private calculateUptime(): number {
    // Vereinfachte Berechnung - in Produktion würde echte Uptime-Tracking verwendet
    return 0.995 + Math.random() * 0.005;
  }

  /**
   * Berechnet Service-Uptime
   */
  private calculateServiceUptime(service: string): number {
    // Vereinfachte Berechnung
    return 0.98 + Math.random() * 0.02;
  }

  /**
   * Berechnet durchschnittliche Response-Zeit
   */
  private calculateAverageResponseTime(service: string): number {
    const responseMetrics = this.metrics.filter(m =>
      (m.name === 'response_time' || m.name === 'api_response_time') &&
      (m.service === service || m.tags.service === service)
    );

    if (responseMetrics.length === 0) return 0;

    const avg = responseMetrics.reduce((sum, m) => sum + m.value, 0) / responseMetrics.length;
    return Math.round(avg);
  }

  /**
   * Berechnet Error-Rate
   */
  private calculateErrorRate(service: string): number {
    const errorMetrics = this.metrics.filter(m =>
      m.name === 'error_rate' &&
      (m.service === service || m.tags.service === service)
    );

    if (errorMetrics.length === 0) return 0;

    return errorMetrics[errorMetrics.length - 1].value;
  }

  /**
   * Berechnet Location-Performance
   */
  private calculateLocationPerformance(locationKey: string): number {
    const performanceMetrics = this.metrics.filter(m =>
      m.name === 'performance_score' && m.location === locationKey
    );

    if (performanceMetrics.length === 0) return 75; // Default

    return performanceMetrics[performanceMetrics.length - 1].value;
  }

  /**
   * Ruft Key-Metriken ab
   */
  private getKeyMetrics(): Array<{
    name: string;
    current: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    status: 'good' | 'warning' | 'critical';
  }> {
    const metrics = [
      { name: 'System Load', metricName: 'system_load', unit: 'percentage' },
      { name: 'Active Tasks', metricName: 'active_tasks', unit: 'count' },
      { name: 'API Response Time', metricName: 'api_response_time', unit: 'ms' },
      { name: 'Error Rate', metricName: 'api_error_rate', unit: 'percentage' }
    ];

    return metrics.map(m => {
      const metricData = this.metrics.filter(metric => metric.name === m.metricName);
      if (metricData.length === 0) {
        return {
          name: m.name,
          current: 0,
          change: 0,
          trend: 'stable' as const,
          status: 'good' as const
        };
      }

      const current = metricData[metricData.length - 1].value;
      const previous = metricData.length > 1 ? metricData[metricData.length - 2].value : current;
      const change = ((current - previous) / previous) * 100;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(change) > 5) {
        trend = change > 0 ? 'up' : 'down';
      }

      let status: 'good' | 'warning' | 'critical' = 'good';
      if (m.unit === 'percentage' && current > 0.8) status = 'critical';
      else if (m.unit === 'percentage' && current > 0.6) status = 'warning';
      else if (m.unit === 'ms' && current > 1000) status = 'warning';
      else if (m.unit === 'ms' && current > 2000) status = 'critical';

      return {
        name: m.name,
        current: Math.round(current * 100) / 100,
        change: Math.round(change * 100) / 100,
        trend,
        status
      };
    });
  }

  /**
   * Generiert Vorhersagen
   */
  private generatePredictions(): Array<{
    metric: string;
    prediction: number;
    confidence: number;
    timeframe: string;
    risk: 'low' | 'medium' | 'high';
  }> {
    return [
      {
        metric: 'System Load',
        prediction: 0.75,
        confidence: 0.85,
        timeframe: '24h',
        risk: 'medium'
      },
      {
        metric: 'Error Rate',
        prediction: 0.025,
        confidence: 0.78,
        timeframe: '24h',
        risk: 'low'
      },
      {
        metric: 'Performance Score',
        prediction: 78,
        confidence: 0.92,
        timeframe: '7d',
        risk: 'low'
      }
    ];
  }

  /**
   * Generiert einen Monitoring-Report
   */
  public generateMonitoringReport(type: 'daily' | 'weekly' | 'monthly' = 'weekly'): MonitoringReport {
    const now = new Date();
    const startDate = new Date();

    switch (type) {
      case 'daily':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const periodMetrics = this.metrics.filter(m =>
      new Date(m.timestamp) >= startDate
    );

    const periodAlerts = this.alerts.filter(a =>
      new Date(a.timestamp) >= startDate
    );

    return {
      id: `report_${Date.now()}`,
      type,
      period: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      summary: {
        totalMetrics: periodMetrics.length,
        totalAlerts: periodAlerts.length,
        systemAvailability: this.calculateSystemHealth() / 100,
        averagePerformance: this.getKeyMetrics().reduce((sum, m) => sum + m.current, 0) / this.getKeyMetrics().length
      },
      alerts: {
        bySeverity: this.groupAlertsBy(periodAlerts, 'severity'),
        byType: this.groupAlertsBy(periodAlerts, 'type'),
        byService: this.groupAlertsByService(periodAlerts),
        topIssues: this.getTopIssues(periodAlerts)
      },
      performance: {
        serviceMetrics: this.calculateServiceHealth().map(s => ({
          service: s.service,
          avgResponseTime: s.responseTime,
          uptime: s.uptime,
          errorRate: s.errorRate,
          throughput: Math.floor(Math.random() * 1000) + 500 // Placeholder
        })),
        locationMetrics: this.calculateLocationHealth().map(l => ({
          location: l.location,
          performance: l.performance,
          traffic: Math.floor(Math.random() * 10000) + 5000, // Placeholder
          conversions: Math.floor(Math.random() * 500) + 100, // Placeholder
          alerts: l.alerts
        }))
      },
      recommendations: this.generateReportRecommendations(periodAlerts, periodMetrics),
      generatedAt: now.toISOString()
    };
  }

  /**
   * Gruppiert Alerts nach einem Feld
   */
  private groupAlertsBy(alerts: MonitoringAlert[], field: keyof MonitoringAlert): { [key: string]: number } {
    const groups: { [key: string]: number } = {};
    alerts.forEach(alert => {
      const key = String(alert[field]);
      groups[key] = (groups[key] || 0) + 1;
    });
    return groups;
  }

  /**
   * Gruppiert Alerts nach Service
   */
  private groupAlertsByService(alerts: MonitoringAlert[]): { [service: string]: number } {
    const groups: { [service: string]: number } = {};
    alerts.forEach(alert => {
      alert.affectedServices.forEach(service => {
        groups[service] = (groups[service] || 0) + 1;
      });
    });
    return groups;
  }

  /**
   * Ermittelt Top-Issues
   */
  private getTopIssues(alerts: MonitoringAlert[]): Array<{
    issue: string;
    count: number;
    impact: string;
  }> {
    const issues: { [issue: string]: { count: number; severities: string[] } } = {};

    alerts.forEach(alert => {
      const key = alert.title;
      if (!issues[key]) {
        issues[key] = { count: 0, severities: [] };
      }
      issues[key].count++;
      issues[key].severities.push(alert.severity);
    });

    return Object.entries(issues)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([issue, data]) => ({
        issue,
        count: data.count,
        impact: data.severities.includes('critical') ? 'high' :
                data.severities.includes('high') ? 'medium' : 'low'
      }));
  }

  /**
   * Generiert Report-Empfehlungen
   */
  private generateReportRecommendations(
    alerts: MonitoringAlert[],
    metrics: MonitoringMetric[]
  ): Array<{
    priority: 'high' | 'medium' | 'low';
    category: 'performance' | 'reliability' | 'security' | 'capacity';
    recommendation: string;
    rationale: string;
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
  }> {
    const recommendations = [];

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'reliability',
        recommendation: 'Kritische Alert-Untersuchung durchführen',
        rationale: `${criticalAlerts.length} kritische Alerts erfordern sofortige Aufmerksamkeit`,
        effort: 'medium',
        impact: 'high'
      });
    }

    const highErrorRate = metrics.filter(m => m.name === 'error_rate' && m.value > 0.05);
    if (highErrorRate.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        recommendation: 'Error-Rate-Optimierung implementieren',
        rationale: 'Hohe Error-Rate beeinträchtigt Systemstabilität',
        effort: 'high',
        impact: 'high'
      });
    }

    const lowUptime = metrics.filter(m => m.name.includes('uptime') && m.value < 0.99);
    if (lowUptime.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'reliability',
        recommendation: 'Uptime-Monitoring verbessern',
        rationale: 'Service-Verfügbarkeit unter SLA-Zielen',
        effort: 'medium',
        impact: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Bestätigt einen Alert
   */
  public acknowledgeAlert(alertId: string, userId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date().toISOString();
    }
  }

  /**
   * Löst einen Alert auf
   */
  public resolveAlert(alertId: string, autoResolved: boolean = false): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      alert.autoResolved = autoResolved;
    }
  }

  /**
   * Ruft alle Alerts ab
   */
  public getAlerts(
    filter?: {
      status?: 'active' | 'acknowledged' | 'resolved';
      severity?: MonitoringAlert['severity'];
      type?: MonitoringAlert['type'];
      limit?: number;
    }
  ): MonitoringAlert[] {
    let filteredAlerts = [...this.alerts];

    if (filter?.status) {
      switch (filter.status) {
        case 'active':
          filteredAlerts = filteredAlerts.filter(a => !a.resolved);
          break;
        case 'acknowledged':
          filteredAlerts = filteredAlerts.filter(a => a.acknowledged && !a.resolved);
          break;
        case 'resolved':
          filteredAlerts = filteredAlerts.filter(a => a.resolved);
          break;
      }
    }

    if (filter?.severity) {
      filteredAlerts = filteredAlerts.filter(a => a.severity === filter.severity);
    }

    if (filter?.type) {
      filteredAlerts = filteredAlerts.filter(a => a.type === filter.type);
    }

    // Sortiere nach Timestamp (neueste zuerst)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filter?.limit) {
      filteredAlerts = filteredAlerts.slice(0, filter.limit);
    }

    return filteredAlerts;
  }

  /**
   * Ruft Metriken ab
   */
  public getMetrics(
    filter?: {
      name?: string;
      location?: string;
      service?: string;
      since?: string;
      limit?: number;
    }
  ): MonitoringMetric[] {
    let filteredMetrics = [...this.metrics];

    if (filter?.name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === filter.name);
    }

    if (filter?.location) {
      filteredMetrics = filteredMetrics.filter(m => m.location === filter.location);
    }

    if (filter?.service) {
      filteredMetrics = filteredMetrics.filter(m => m.service === filter.service);
    }

    if (filter?.since) {
      const sinceTime = new Date(filter.since).getTime();
      filteredMetrics = filteredMetrics.filter(m => new Date(m.timestamp).getTime() >= sinceTime);
    }

    // Sortiere nach Timestamp (neueste zuerst)
    filteredMetrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filter?.limit) {
      filteredMetrics = filteredMetrics.slice(0, filter.limit);
    }

    return filteredMetrics;
  }

  /**
   * Stoppt das Monitoring
   */
  public stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

// Singleton-Instanz für globale Verwendung
export const enterpriseGEOMonitoringService = new EnterpriseGEOMonitoringService();