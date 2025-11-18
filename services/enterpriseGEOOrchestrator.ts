import { enterpriseGEOIntegrationService } from './enterpriseGEOIntegrationService';
import { enterpriseGEOAPIGateway } from './enterpriseGEOAPIGateway';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

export interface OrchestrationTask {
  id: string;
  type: 'sync' | 'analysis' | 'optimization' | 'reporting' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  locationKey?: string;
  services: string[];
  parameters: { [key: string]: any };
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  progress: number;
  result?: any;
  error?: string;
  dependencies: string[]; // Task IDs die zuerst abgeschlossen sein müssen
  retryCount: number;
  maxRetries: number;
}

export interface OrchestrationWorkflow {
  id: string;
  name: string;
  description: string;
  tasks: OrchestrationTask[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  createdAt: string;
  updatedAt: string;
  progress: number;
  trigger: {
    type: 'manual' | 'scheduled' | 'event' | 'api';
    schedule?: string; // Cron-Format
    eventType?: string;
    apiEndpoint?: string;
  };
  notifications: {
    onStart: boolean;
    onComplete: boolean;
    onError: boolean;
    emailRecipients: string[];
    webhookUrl?: string;
  };
}

export interface SystemEvent {
  id: string;
  type: 'data_sync' | 'performance_alert' | 'service_failure' | 'user_action' | 'system_update';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  data: any;
  timestamp: string;
  processed: boolean;
}

export interface OrchestrationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageExecutionTime: number;
  successRate: number;
  activeWorkflows: number;
  queuedTasks: number;
  systemLoad: number;
  serviceHealth: { [serviceName: string]: number };
}

/**
 * Enterprise GEO Orchestrator
 * Zentrales Orchestrierungssystem für alle GEO-Services
 */
export class EnterpriseGEOOrchestrator {
  private taskQueue: OrchestrationTask[] = [];
  private activeTasks: Map<string, OrchestrationTask> = new Map();
  private workflows: Map<string, OrchestrationWorkflow> = new Map();
  private eventQueue: SystemEvent[] = [];
  private metrics: OrchestrationMetrics;
  private isRunning: boolean = false;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.initializeDefaultWorkflows();
    this.startOrchestrator();
  }

  /**
   * Initialisiert Standard-Metriken
   */
  private initializeMetrics(): OrchestrationMetrics {
    return {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageExecutionTime: 0,
      successRate: 1.0,
      activeWorkflows: 0,
      queuedTasks: 0,
      systemLoad: 0,
      serviceHealth: {}
    };
  }

  /**
   * Initialisiert Standard-Workflows
   */
  private initializeDefaultWorkflows(): void {
    // Täglicher Daten-Sync Workflow
    this.createWorkflow({
      id: 'daily-data-sync',
      name: 'Täglicher GEO-Daten-Sync',
      description: 'Synchronisiert alle GEO-Daten für alle Standorte',
      tasks: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      trigger: {
        type: 'scheduled',
        schedule: '0 2 * * *' // Täglich um 2:00 Uhr
      },
      notifications: {
        onStart: false,
        onComplete: true,
        onError: true,
        emailRecipients: ['admin@zoe-solar.de'],
        webhookUrl: 'https://api.zoe-solar.de/webhooks/geo-sync'
      }
    });

    // Wöchentlicher Performance-Report Workflow
    this.createWorkflow({
      id: 'weekly-performance-report',
      name: 'Wöchentlicher Performance-Report',
      description: 'Generiert wöchentliche Performance-Berichte',
      tasks: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      trigger: {
        type: 'scheduled',
        schedule: '0 9 * * 1' // Montags um 9:00 Uhr
      },
      notifications: {
        onStart: false,
        onComplete: true,
        onError: true,
        emailRecipients: ['management@zoe-solar.de', 'seo-team@zoe-solar.de']
      }
    });

    // Echtzeit-Monitoring Workflow
    this.createWorkflow({
      id: 'realtime-monitoring',
      name: 'Echtzeit-Monitoring',
      description: 'Überwacht kontinuierlich alle GEO-Services',
      tasks: [],
      status: 'running',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 100,
      trigger: {
        type: 'manual'
      },
      notifications: {
        onStart: false,
        onComplete: false,
        onError: true,
        emailRecipients: ['devops@zoe-solar.de']
      }
    });
  }

  /**
   * Startet den Orchestrator
   */
  private startOrchestrator(): void {
    this.isRunning = true;
    this.processTaskQueue();
    this.processEvents();
    this.updateMetrics();

    // Regelmäßige Aufgaben
    setInterval(() => this.processTaskQueue(), 5000); // Alle 5 Sekunden
    setInterval(() => this.processEvents(), 10000); // Alle 10 Sekunden
    setInterval(() => this.updateMetrics(), 30000); // Alle 30 Sekunden
    setInterval(() => this.checkScheduledWorkflows(), 60000); // Alle Minute
  }

  /**
   * Erstellt einen neuen Workflow
   */
  public createWorkflow(workflow: OrchestrationWorkflow): string {
    this.workflows.set(workflow.id, workflow);
    this.metrics.activeWorkflows++;
    return workflow.id;
  }

  /**
   * Fügt eine Aufgabe zur Warteschlange hinzu
   */
  public queueTask(task: Omit<OrchestrationTask, 'id' | 'status' | 'createdAt' | 'progress' | 'retryCount'>): string {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullTask: OrchestrationTask = {
      ...task,
      id: taskId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      progress: 0,
      retryCount: 0,
      maxRetries: task.maxRetries || 3
    };

    this.taskQueue.push(fullTask);
    this.metrics.queuedTasks++;
    this.metrics.totalTasks++;

    return taskId;
  }

  /**
   * Verarbeitet die Task-Warteschlange
   */
  private async processTaskQueue(): Promise<void> {
    if (!this.isRunning || this.activeTasks.size >= 10) return; // Max 10 parallele Tasks

    // Finde Tasks ohne unerfüllte Dependencies
    const availableTasks = this.taskQueue.filter(task =>
      task.status === 'pending' &&
      task.dependencies.every(depId => {
        const depTask = [...this.taskQueue, ...this.activeTasks.values()].find(t => t.id === depId);
        return depTask?.status === 'completed';
      })
    );

    // Sortiere nach Priorität
    availableTasks.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Starte verfügbare Tasks
    for (const task of availableTasks.slice(0, 10 - this.activeTasks.size)) {
      await this.executeTask(task);
    }
  }

  /**
   * Führt eine Aufgabe aus
   */
  private async executeTask(task: OrchestrationTask): Promise<void> {
    task.status = 'running';
    task.startedAt = new Date().toISOString();
    this.activeTasks.set(task.id, task);
    this.metrics.queuedTasks--;

    try {
      // Simuliere Task-Ausführung basierend auf Typ
      const result = await this.executeTaskLogic(task);

      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.progress = 100;
      task.result = result;
      this.metrics.completedTasks++;

      // Entferne aus aktiven Tasks
      this.activeTasks.delete(task.id);

      // Trigger abhängige Tasks
      this.triggerDependentTasks(task.id);

    } catch (error) {
      console.error(`Task ${task.id} failed:`, error);
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.retryCount++;

      if (task.retryCount < task.maxRetries) {
        // Task zurück in Warteschlange
        task.status = 'pending';
        task.progress = 0;
        this.taskQueue.push(task);
      } else {
        task.status = 'failed';
        this.metrics.failedTasks++;
      }

      this.activeTasks.delete(task.id);
    }
  }

  /**
   * Führt die eigentliche Task-Logik aus
   */
  private async executeTaskLogic(task: OrchestrationTask): Promise<any> {
    switch (task.type) {
      case 'sync':
        return await this.executeSyncTask(task);

      case 'analysis':
        return await this.executeAnalysisTask(task);

      case 'optimization':
        return await this.executeOptimizationTask(task);

      case 'reporting':
        return await this.executeReportingTask(task);

      case 'maintenance':
        return await this.executeMaintenanceTask(task);

      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  /**
   * Führt Sync-Task aus
   */
  private async executeSyncTask(task: OrchestrationTask): Promise<any> {
    if (task.locationKey) {
      // Einzelner Standort
      return enterpriseGEOIntegrationService.syncLocationData(task.locationKey);
    } else {
      // Alle Standorte
      const results = {};
      for (const region of PRIMARY_SERVICE_REGIONS) {
        const locationKey = region.city.toLowerCase();
        results[locationKey] = enterpriseGEOIntegrationService.syncLocationData(locationKey);
      }
      return results;
    }
  }

  /**
   * Führt Analysis-Task aus
   */
  private async executeAnalysisTask(task: OrchestrationTask): Promise<any> {
    const locationKey = task.locationKey || 'global';

    switch (task.parameters.analysisType) {
      case 'performance':
        return enterpriseGEOIntegrationService.getIntegratedDashboard(locationKey);

      case 'competitor':
        // Hier würde die Wettbewerbsanalyse aufgerufen werden
        return { message: 'Competitor analysis completed' };

      case 'trends':
        // Hier würden Trend-Analysen aufgerufen werden
        return { message: 'Trend analysis completed' };

      default:
        return { message: 'Analysis completed' };
    }
  }

  /**
   * Führt Optimization-Task aus
   */
  private async executeOptimizationTask(task: OrchestrationTask): Promise<any> {
    // Hier würden verschiedene Optimierungen ausgeführt werden
    return { message: 'Optimization completed' };
  }

  /**
   * Führt Reporting-Task aus
   */
  private async executeReportingTask(task: OrchestrationTask): Promise<any> {
    if (task.locationKey) {
      return enterpriseGEOIntegrationService.getIntegratedDashboard(task.locationKey);
    } else {
      return enterpriseGEOIntegrationService.generateGlobalGEOOverview();
    }
  }

  /**
   * Führt Maintenance-Task aus
   */
  private async executeMaintenanceTask(task: OrchestrationTask): Promise<any> {
    switch (task.parameters.maintenanceType) {
      case 'health_check':
        return enterpriseGEOIntegrationService.getSystemHealth();

      case 'diagnostic':
        return enterpriseGEOIntegrationService.performSystemDiagnostic();

      case 'backup':
        return enterpriseGEOIntegrationService.createSystemBackup();

      default:
        return { message: 'Maintenance completed' };
    }
  }

  /**
   * Trigger abhängige Tasks
   */
  private triggerDependentTasks(completedTaskId: string): void {
    const dependentTasks = this.taskQueue.filter(task =>
      task.dependencies.includes(completedTaskId)
    );

    // Diese Tasks können jetzt potenziell ausgeführt werden
    // processTaskQueue() wird sie beim nächsten Durchlauf finden
  }

  /**
   * Verarbeitet System-Events
   */
  private async processEvents(): Promise<void> {
    const unprocessedEvents = this.eventQueue.filter(event => !event.processed);

    for (const event of unprocessedEvents) {
      await this.handleEvent(event);
      event.processed = true;
    }

    // Behalte nur die letzten 1000 Events
    if (this.eventQueue.length > 1000) {
      this.eventQueue = this.eventQueue.slice(-1000);
    }
  }

  /**
   * Behandelt ein einzelnes Event
   */
  private async handleEvent(event: SystemEvent): Promise<void> {
    switch (event.type) {
      case 'performance_alert':
        // Erstelle Task für Performance-Untersuchung
        this.queueTask({
          type: 'analysis',
          priority: event.severity === 'critical' ? 'critical' : 'high',
          locationKey: event.data.locationKey,
          services: ['localSEOAnalytics', 'localSearchPerformancePrediction'],
          parameters: { analysisType: 'performance', alertData: event.data },
          dependencies: [],
          maxRetries: 2
        });
        break;

      case 'service_failure':
        // Erstelle Maintenance-Task
        this.queueTask({
          type: 'maintenance',
          priority: 'high',
          services: [event.source],
          parameters: { maintenanceType: 'health_check', failureData: event.data },
          dependencies: [],
          maxRetries: 3
        });
        break;

      case 'data_sync':
        // Trigger abhängige Analysen
        if (event.data.locationKey) {
          this.queueTask({
            type: 'analysis',
            priority: 'medium',
            locationKey: event.data.locationKey,
            services: ['enterpriseLocalReporting'],
            parameters: { analysisType: 'performance' },
            dependencies: [],
            maxRetries: 1
          });
        }
        break;
    }
  }

  /**
   * Fügt ein Event zur Warteschlange hinzu
   */
  public addEvent(event: Omit<SystemEvent, 'id' | 'timestamp' | 'processed'>): void {
    const fullEvent: SystemEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      processed: false
    };

    this.eventQueue.push(fullEvent);
  }

  /**
   * Aktualisiert Metriken
   */
  private updateMetrics(): void {
    const totalTasks = this.metrics.totalTasks;
    const completedTasks = this.metrics.completedTasks;
    const failedTasks = this.metrics.failedTasks;

    this.metrics.successRate = totalTasks > 0 ? completedTasks / totalTasks : 1.0;
    this.metrics.systemLoad = (this.activeTasks.size + this.taskQueue.length) / 20; // Max 20 concurrent

    // Service Health aktualisieren
    const health = enterpriseGEOIntegrationService.getSystemHealth();
    if (health) {
      this.metrics.serviceHealth = {};
      Object.entries(health.serviceHealth).forEach(([service, status]) => {
        this.metrics.serviceHealth[service] = status.status === 'healthy' ? 1 :
                                              status.status === 'warning' ? 0.5 : 0;
      });
    }
  }

  /**
   * Prüft geplante Workflows
   */
  private checkScheduledWorkflows(): void {
    const now = new Date();

    for (const workflow of this.workflows.values()) {
      if (workflow.trigger.type === 'scheduled' && workflow.trigger.schedule) {
        // Einfache Cron-Prüfung (in Produktion würde cron-parser verwendet)
        if (this.shouldRunScheduledWorkflow(workflow, now)) {
          this.startWorkflow(workflow.id);
        }
      }
    }
  }

  /**
   * Prüft ob ein geplanter Workflow ausgeführt werden soll
   */
  private shouldRunScheduledWorkflow(workflow: OrchestrationWorkflow, now: Date): boolean {
    // Vereinfachte Implementierung - in Produktion würde cron-parser verwendet
    const schedule = workflow.trigger.schedule;
    if (!schedule) return false;

    // Beispiel: "0 2 * * *" = täglich um 2:00 Uhr
    const parts = schedule.split(' ');
    if (parts.length !== 5) return false;

    const [minute, hour, day, month, dayOfWeek] = parts;

    return (minute === '*' || parseInt(minute) === now.getMinutes()) &&
           (hour === '*' || parseInt(hour) === now.getHours()) &&
           (day === '*' || parseInt(day) === now.getDate()) &&
           (month === '*' || parseInt(month) === now.getMonth() + 1) &&
           (dayOfWeek === '*' || parseInt(dayOfWeek) === now.getDay());
  }

  /**
   * Startet einen Workflow
   */
  public startWorkflow(workflowId: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return;

    workflow.status = 'running';
    workflow.updatedAt = new Date().toISOString();

    // Erstelle Tasks für den Workflow
    for (const task of workflow.tasks) {
      this.queueTask(task);
    }
  }

  /**
   * Ruft Orchestrator-Metriken ab
   */
  public getMetrics(): OrchestrationMetrics {
    return { ...this.metrics };
  }

  /**
   * Ruft aktive Tasks ab
   */
  public getActiveTasks(): OrchestrationTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Ruft Task-Warteschlange ab
   */
  public getTaskQueue(): OrchestrationTask[] {
    return [...this.taskQueue];
  }

  /**
   * Ruft alle Workflows ab
   */
  public getWorkflows(): OrchestrationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Ruft System-Events ab
   */
  public getEvents(limit: number = 100): SystemEvent[] {
    return this.eventQueue.slice(-limit);
  }

  /**
   * Stoppt den Orchestrator
   */
  public stop(): void {
    this.isRunning = false;
  }

  /**
   * Führt Notfall-Stopp durch
   */
  public emergencyStop(): void {
    this.stop();
    // Alle aktiven Tasks abbrechen
    for (const task of this.activeTasks.values()) {
      task.status = 'failed';
      task.error = 'Emergency stop initiated';
    }
    this.activeTasks.clear();
  }

  /**
   * Führt System-Recovery durch
   */
  public async performSystemRecovery(): Promise<{
    recoveredTasks: number;
    failedRecoveries: number;
    systemStatus: string;
  }> {
    let recoveredTasks = 0;
    let failedRecoveries = 0;

    // Versuche fehlgeschlagene Tasks wiederherzustellen
    const failedTasks = this.taskQueue.filter(task => task.status === 'failed');
    for (const task of failedTasks) {
      try {
        task.status = 'pending';
        task.retryCount = 0;
        task.error = undefined;
        recoveredTasks++;
      } catch (error) {
        failedRecoveries++;
      }
    }

    // Starte Orchestrator neu
    this.startOrchestrator();

    return {
      recoveredTasks,
      failedRecoveries,
      systemStatus: 'recovery_completed'
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const enterpriseGEOOrchestrator = new EnterpriseGEOOrchestrator();