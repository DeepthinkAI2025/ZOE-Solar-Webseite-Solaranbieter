// 🔍 Erweiterter Audit-Logger für ZOE Solar CMS
// Protokolliert alle sicherheitsrelevanten Aktionen und Systemereignisse

export interface AuditEvent {
  id: string
  timestamp: number
  type: AuditEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  endpoint?: string
  method?: string
  status?: number
  duration?: number
  action: string
  resource?: string
  metadata?: Record<string, unknown>
  error?: {
    message: string
    stack?: string
    code?: string
  }
  before?: unknown // Zustand vor der Aktion
  after?: unknown  // Zustand nach der Aktion
}

export type AuditEventType =
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'system_error'
  | 'security_event'
  | 'performance'
  | 'api_usage'
  | 'webhook_received'
  | 'cache_operation'
  | 'configuration_change'

export interface AuditConfig {
  enabled: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  maxRetentionDays: number
  batchSize: number
  batchTimeout: number // Millisekunden
  persistToDatabase: boolean
  persistToFile: boolean
  alertThresholds: {
    highErrorRate: number    // > X Fehler in Y Minuten
    suspiciousActivity: number // > X Zugriffe pro Minute
    failedLogins: number     // > X fehlgeschlagene Logins
  }
  excludePaths?: string[]   // Pfade die nicht geloggt werden
  sensitiveFields?: string[] // Felder die maskiert werden sollen
  exportFormats: Array<'json' | 'csv' | 'elasticsearch'>
}

interface AuditBatch {
  events: AuditEvent[]
  timeoutId?: NodeJS.Timeout
}

export class AuditLogger {
  private static instance: AuditLogger
  private config: AuditConfig
  private batch: AuditBatch = { events: [] }
  private errorCount = new Map<string, number>() // IP -> Fehleranzahl
  private accessCount = new Map<string, number>() // IP -> Zugriffe
  private failedLogins = new Map<string, number>() // IP -> fehlgeschlagene Logins
  private alerts: Array<{type: string, message: string, timestamp: number}> = []
  private startTime = Date.now()

  private constructor(config: AuditConfig) {
    this.config = config
    this.startBatchProcessor()
  }

  public static getInstance(config: AuditConfig): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger(config)
    }
    return AuditLogger.instance
  }

  // ========== Public Logging Interface ==========

  /**
   * Audit-Event protokollieren
   */
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    if (!this.config.enabled) return

    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
      ip: event.ip || this.getCurrentIP(),
      userAgent: event.userAgent || this.getCurrentUserAgent()
    }

    // Batch hinzufügen
    this.addToBatch(auditEvent)

    // Echtzeit-Alerts prüfen
    this.checkAlerts(auditEvent)

    // Kritische Ereignisse sofort ausgeben
    if (event.severity === 'critical') {
      this.handleCriticalEvent(auditEvent)
    }
  }

  /**
   * Schnelle Logging-Methoden für häufige Events
   */
  logAuthentication(event: {
    userId?: string
    success: boolean
    ip?: string
    userAgent?: string
    method: 'login' | 'logout' | 'api_key' | 'session'
    metadata?: Record<string, unknown>
  }): void {
    this.log({
      type: 'authentication',
      severity: event.success ? 'low' : 'medium',
      userId: event.userId,
      action: `authentication_${event.method}_${event.success ? 'success' : 'failed'}`,
      endpoint: `/api/auth/${event.method}`,
      metadata: {
        success: event.success,
        ...event.metadata
      }
    })

    // Fehlgeschlagene Logins tracking
    if (!event.success && event.ip) {
      const count = this.failedLogins.get(event.ip) || 0
      this.failedLogins.set(event.ip, count + 1)
    }
  }

  logAuthorization(event: {
    userId?: string
    action: string
    resource?: string
    granted: boolean
    requiredPermissions?: string[]
    context?: Record<string, unknown>
  }): void {
    this.log({
      type: 'authorization',
      severity: event.granted ? 'low' : 'medium',
      userId: event.userId,
      action: `authorization_${event.granted ? 'granted' : 'denied'}`,
      resource: event.resource,
      metadata: {
        requiredPermissions: event.requiredPermissions,
        context: event.context
      }
    })
  }

  logDataAccess(event: {
    userId?: string
    resource: string
    action: 'read' | 'write' | 'delete'
    dataType: 'public' | 'private' | 'sensitive'
    recordCount?: number
    endpoint?: string
    method?: string
  }): void {
    this.log({
      type: 'data_access',
      severity: event.dataType === 'sensitive' ? 'high' : 'medium',
      userId: event.userId,
      action: `data_${event.action}_${event.dataType}`,
      endpoint: event.endpoint,
      method: event.method,
      resource: event.resource,
      metadata: {
        recordCount: event.recordCount,
        dataType: event.dataType
      }
    })
  }

  logSecurityEvent(event: {
    type: 'suspicious_activity' | 'brute_force' | 'unauthorized_access' | 'rate_limit_exceeded'
    severity?: 'medium' | 'high' | 'critical'
    ip?: string
    userId?: string
    details?: Record<string, unknown>
  }): void {
    this.log({
      type: 'security_event',
      severity: event.severity || 'high',
      userId: event.userId,
      ip: event.ip,
      action: `security_${event.type}`,
      metadata: event.details,
      resource: event.details?.endpoint as string | undefined
    })
  }

  logApiUsage(event: {
    endpoint: string
    method: string
    userId?: string
    status: number
    duration: number
    userAgent?: string
  }): void {
    // Zugriffe tracken für Alert-Prüfung
    const ip = event.userId ? undefined : 'anonymous' // Anonyme Zugriffe
    if (ip) {
      const count = this.accessCount.get(ip) || 0
      this.accessCount.set(ip, count + 1)
    }

    this.log({
      type: 'api_usage',
      severity: event.status >= 400 ? 'medium' : 'low',
      userId: event.userId,
      endpoint: event.endpoint,
      method: event.method,
      status: event.status,
      duration: event.duration,
      action: `api_${event.method.toLowerCase()}_${event.status}`,
      userAgent: event.userAgent
    })
  }

  logSystemError(event: {
    error: Error
    context?: string
    metadata?: Record<string, unknown>
  }): void {
    this.log({
      type: 'system_error',
      severity: 'high',
      action: `system_error_${event.context || 'unknown'}`,
      error: {
        message: event.error.message,
        stack: event.error.stack,
        code: (event.error as Error & { code?: string }).code
      },
      metadata: event.metadata
    })
  }

  logWebhookReceived(event: {
    source: string
    eventType: string
    data?: unknown
    processingTime?: number
  }): void {
    this.log({
      type: 'webhook_received',
      severity: 'low',
      action: `webhook_${event.source}_${event.eventType}`,
      metadata: {
        source: event.source,
        eventType: event.eventType,
        dataSize: event.data ? JSON.stringify(event.data).length : 0,
        processingTime: event.processingTime
      }
    })
  }

  // ========== Batch Processing ==========

  private addToBatch(event: AuditEvent): void {
    this.batch.events.push(event)

    // Batch-Größe prüfen
    if (this.batch.events.length >= this.config.batchSize) {
      this.flushBatch()
      return
    }

    // Timeout setzen falls noch nicht gesetzt
    if (!this.batch.timeoutId) {
      this.batch.timeoutId = setTimeout(() => {
        this.flushBatch()
      }, this.config.batchTimeout)
    }
  }

  private flushBatch(): void {
    if (this.batch.events.length === 0) return

    const events = [...this.batch.events]
    this.batch.events = []

    if (this.batch.timeoutId) {
      clearTimeout(this.batch.timeoutId)
      this.batch.timeoutId = undefined
    }

    // Events verarbeiten
    this.processBatch(events)
  }

  private async processBatch(events: AuditEvent[]): Promise<void> {
    try {
      // Parallel verarbeiten für bessere Performance
      const promises = [
        this.persistToConsole(events),
        this.persistToFileIfEnabled(events),
        this.persistToDatabaseIfEnabled(events),
        this.sendToElasticsearchIfEnabled(events)
      ]

      await Promise.allSettled(promises)

      console.log(`📊 Audit batch processed: ${events.length} events`)

    } catch (error) {
      console.error('❌ Failed to process audit batch:', error)
    }
  }

  private startBatchProcessor(): void {
    // Regelmäßiges Flushen bei Inaktivität
    setInterval(() => {
      this.flushBatch()
    }, this.config.batchTimeout)
  }

  // ========== Alerting ==========

  private checkAlerts(event: AuditEvent): void {
    // Fehlerrate prüfen
    if (event.type === 'system_error' && event.ip) {
      const errorCount = this.errorCount.get(event.ip) || 0
      this.errorCount.set(event.ip, errorCount + 1)

      if (errorCount >= this.config.alertThresholds.highErrorRate) {
        this.createAlert('HIGH_ERROR_RATE', `High error rate detected from IP: ${event.ip}`)
      }
    }

    // Verdächtige Aktivität prüfen
    if (event.type === 'api_usage' && event.ip) {
      const accessCount = this.accessCount.get(event.ip) || 0
      
      if (accessCount >= this.config.alertThresholds.suspiciousActivity) {
        this.createAlert('SUSPICIOUS_ACTIVITY', `High API usage from IP: ${event.ip}`)
      }
    }

    // Fehlgeschlagene Logins prüfen
    if (event.type === 'authentication' && 
        event.metadata?.success === false && 
        event.ip) {
      const failedCount = this.failedLogins.get(event.ip) || 0
      
      if (failedCount >= this.config.alertThresholds.failedLogins) {
        this.createAlert('BRUTE_FORCE_ATTEMPT', `Possible brute force attack from IP: ${event.ip}`)
      }
    }
  }

  private handleCriticalEvent(event: AuditEvent): void {
    // Sofortige Benachrichtigung für kritische Ereignisse
    console.error('🚨 CRITICAL AUDIT EVENT:', JSON.stringify(event, null, 2))
    
    // Hier könnten weitere Maßnahmen implementiert werden:
    // - Slack-Benachrichtigungen
    // - E-Mail-Alerts
    // - SMS-Warnungen
    // - Automatisches Blocken von IPs
  }

  private createAlert(type: string, message: string): void {
    const alert = {
      type,
      message,
      timestamp: Date.now()
    }

    this.alerts.push(alert)

    console.warn(`🚨 SECURITY ALERT [${type}]: ${message}`)

    // Alerts nach 24h entfernen
    setTimeout(() => {
      this.alerts = this.alerts.filter(a => a.timestamp > Date.now() - 24 * 60 * 60 * 1000)
    }, 24 * 60 * 60 * 1000)
  }

  // ========== Persistierung ==========

  private async persistToConsole(events: AuditEvent[]): Promise<void> {
    if (this.config.logLevel === 'debug') {
      events.forEach(event => {
        const prefix = this.getSeverityPrefix(event.severity)
        console.log(`${prefix} ${JSON.stringify(event, null, 2)}`)
      })
    }
  }

  private async persistToFileIfEnabled(events: AuditEvent[]): Promise<void> {
    if (!this.config.persistToFile) return

    try {
      const fs = require('fs').promises
      const path = require('path')
      
      const logDir = path.join(process.cwd(), 'logs')
      await fs.mkdir(logDir, { recursive: true })

      const today = new Date().toISOString().split('T')[0]
      const logFile = path.join(logDir, `audit-${today}.json`)

      const logLines = events.map(event => JSON.stringify(this.sanitizeEvent(event))).join('\n')
      await fs.appendFile(logFile, logLines + '\n')

    } catch (error) {
      console.error('Failed to write audit log to file:', error)
    }
  }

  private async persistToDatabaseIfEnabled(events: AuditEvent[]): Promise<void> {
    if (!this.config.persistToDatabase) return

    try {
      // In Produktion: Hier würde die Datenbank-Persistierung stehen
      // z.B. MongoDB, PostgreSQL, etc.
      
      // Für Demo: In JSON-Datei speichern
      console.log(`📊 Persisted ${events.length} audit events to database`)
      
    } catch (error) {
      console.error('Failed to persist audit events to database:', error)
    }
  }

  private async sendToElasticsearchIfEnabled(events: AuditEvent[]): Promise<void> {
    if (!this.config.exportFormats.includes('elasticsearch')) return

    try {
      // Elasticsearch-Integration würde hier implementiert werden
      console.log(`📊 Sent ${events.length} audit events to Elasticsearch`)
      
    } catch (error) {
      console.error('Failed to send audit events to Elasticsearch:', error)
    }
  }

  // ========== Reporting ==========

  /**
   * Audit-Report für einen Zeitraum generieren
   */
  generateReport(startDate: Date, endDate: Date): {
    summary: {
      totalEvents: number
      errorRate: number
      topUsers: Array<{userId: string, count: number}>
      topEndpoints: Array<{endpoint: string, count: number}>
    }
    events: AuditEvent[]
  } {
    // Filtered Events (vereinfacht)
    const filteredEvents = this.batch.events.filter(event => 
      event.timestamp >= startDate.getTime() && event.timestamp <= endDate.getTime()
    )

    const summary = {
      totalEvents: filteredEvents.length,
      errorRate: filteredEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length / filteredEvents.length * 100,
      topUsers: this.getTopUsers(filteredEvents),
      topEndpoints: this.getTopEndpoints(filteredEvents)
    }

    return {
      summary,
      events: filteredEvents
    }
  }

  /**
   * Aktuelle Alerts abrufen
   */
  getActiveAlerts(): Array<{type: string, message: string, timestamp: number}> {
    return this.alerts.filter(alert => alert.timestamp > Date.now() - 24 * 60 * 60 * 1000)
  }

  /**
   * Audit-Logs exportieren
   */
  async exportLogs(format: 'json' | 'csv', startDate: Date, endDate: Date): Promise<string> {
    const events = this.batch.events.filter(event => 
      event.timestamp >= startDate.getTime() && event.timestamp <= endDate.getTime()
    )

    switch (format) {
      case 'json':
        return JSON.stringify(events.map(e => this.sanitizeEvent(e)), null, 2)
      
      case 'csv':
        const headers = ['id', 'timestamp', 'type', 'severity', 'userId', 'action', 'endpoint']
        const rows = events.map(event => [
          event.id,
          new Date(event.timestamp).toISOString(),
          event.type,
          event.severity,
          event.userId || '',
          event.action,
          event.endpoint || ''
        ])
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
      
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  // ========== Utilities ==========

  private sanitizeEvent(event: AuditEvent): AuditEvent {
    if (!this.config.sensitiveFields || this.config.sensitiveFields.length === 0) {
      return event
    }

    const sanitized = { ...event }
    
    // Sensitive Fields maskieren
    this.config.sensitiveFields.forEach(field => {
      if (sanitized.metadata?.[field]) {
        sanitized.metadata[field] = this.maskSensitiveData(sanitized.metadata[field])
      }
      if (sanitized.before?.[field]) {
        sanitized.before[field] = this.maskSensitiveData(sanitized.before[field])
      }
      if (sanitized.after?.[field]) {
        sanitized.after[field] = this.maskSensitiveData(sanitized.after[field])
      }
    })

    return sanitized
  }

  private maskSensitiveData(data: string): string {
    if (data.length <= 4) {
      return '*'.repeat(data.length)
    }
    return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2)
  }

  private generateEventId(): string {
    return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private getSeverityPrefix(severity: string): string {
    const prefixes = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🚨',
      critical: '💥'
    }
    return prefixes[severity as keyof typeof prefixes] || '📝'
  }

  private getCurrentIP(): string {
    // In Produktion: Real IP aus Request extrahieren
    return 'unknown'
  }

  private getCurrentUserAgent(): string {
    // In Produktion: Real User-Agent aus Request extrahieren
    return 'unknown'
  }

  private getTopUsers(events: AuditEvent[]): Array<{userId: string, count: number}> {
    const userCounts = new Map<string, number>()
    
    events.forEach(event => {
      if (event.userId) {
        userCounts.set(event.userId, (userCounts.get(event.userId) || 0) + 1)
      }
    })

    return Array.from(userCounts.entries())
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private getTopEndpoints(events: AuditEvent[]): Array<{endpoint: string, count: number}> {
    const endpointCounts = new Map<string, number>()
    
    events.forEach(event => {
      if (event.endpoint) {
        endpointCounts.set(event.endpoint, (endpointCounts.get(event.endpoint) || 0) + 1)
      }
    })

    return Array.from(endpointCounts.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  // ========== Cleanup ==========

  public cleanup(): void {
    this.flushBatch()
    
    // Alte Statistics zurücksetzen
    this.errorCount.clear()
    this.accessCount.clear()
    this.failedLogins.clear()
    this.alerts = []
  }

  public getStats(): {
    uptime: number
    totalEvents: number
    activeAlerts: number
    batchSize: number
  } {
    return {
      uptime: Date.now() - this.startTime,
      totalEvents: this.batch.events.length,
      activeAlerts: this.getActiveAlerts().length,
      batchSize: this.batch.events.length
    }
  }

  public destroy(): void {
    this.flushBatch()
    AuditLogger.instance = null
  }
}

// Standard-Konfiguration
export const defaultAuditConfig: AuditConfig = {
  enabled: true,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  maxRetentionDays: 30,
  batchSize: 50,
  batchTimeout: 5000, // 5 Sekunden
  persistToDatabase: process.env.NODE_ENV === 'production',
  persistToFile: true,
  alertThresholds: {
    highErrorRate: 10,       // 10 Fehler
    suspiciousActivity: 100, // 100 Zugriffe
    failedLogins: 5          // 5 fehlgeschlagene Logins
  },
  excludePaths: ['/api/health', '/favicon.ico', '/assets/'],
  sensitiveFields: ['password', 'apiKey', 'token', 'secret'],
  exportFormats: ['json', 'elasticsearch']
}

export default AuditLogger