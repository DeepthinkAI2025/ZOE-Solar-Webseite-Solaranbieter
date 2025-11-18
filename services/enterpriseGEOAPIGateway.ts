import { enterpriseGEOIntegrationService } from './enterpriseGEOIntegrationService';
import { PRIMARY_SERVICE_REGIONS } from '../data/seoConfig';

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  params?: { [key: string]: any };
  body?: any;
  headers?: { [key: string]: string };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    processingTime: number;
    version: string;
  };
}

export interface GEOEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  response: {
    type: string;
    description: string;
  };
  authentication?: boolean;
  rateLimit?: {
    requests: number;
    period: string;
  };
}

/**
 * Enterprise GEO API Gateway
 * Zentraler Zugangspunkt für alle GEO- und Local SEO Services
 */
export class EnterpriseGEOAPIGateway {
  private endpoints: Map<string, GEOEndpoint> = new Map();
  private requestHistory: Array<{
    id: string;
    timestamp: string;
    method: string;
    endpoint: string;
    status: number;
    duration: number;
    userAgent?: string;
  }> = [];
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.registerEndpoints();
  }

  /**
   * Registriert alle verfügbaren Endpunkte
   */
  private registerEndpoints(): void {
    // Dashboard Endpunkte
    this.registerEndpoint({
      path: '/api/geo/dashboard/:locationKey',
      method: 'GET',
      description: 'Ruft integriertes GEO-Dashboard für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'IntegratedGEODashboard',
        description: 'Vollständiges Dashboard mit Performance-Metriken und Empfehlungen'
      },
      authentication: true,
      rateLimit: { requests: 100, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/dashboard/global',
      method: 'GET',
      description: 'Ruft globale GEO-Übersicht über alle Standorte ab',
      response: {
        type: 'GlobalGEOOverview',
        description: 'Globale Performance-Metriken und strategische Empfehlungen'
      },
      authentication: true,
      rateLimit: { requests: 50, period: 'hour' }
    });

    // Daten-Endpunkte
    this.registerEndpoint({
      path: '/api/geo/data/:locationKey',
      method: 'GET',
      description: 'Ruft vereinheitlichtes Datenmodell für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'UnifiedGEODataModel',
        description: 'Konsolidierte GEO-Daten aus allen Services'
      },
      authentication: true,
      rateLimit: { requests: 200, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/data/sync/:locationKey',
      method: 'POST',
      description: 'Synchronisiert Daten für einen Standort',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'UnifiedGEODataModel',
        description: 'Aktualisierte konsolidierte Daten'
      },
      authentication: true,
      rateLimit: { requests: 20, period: 'hour' }
    });

    // Service-Endpunkte
    this.registerEndpoint({
      path: '/api/geo/services/:serviceName/:locationKey',
      method: 'GET',
      description: 'Ruft Daten von einem spezifischen Service ab',
      parameters: [
        {
          name: 'serviceName',
          type: 'string',
          required: true,
          description: 'Name des Services'
        },
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'object',
        description: 'Service-spezifische Daten'
      },
      authentication: true,
      rateLimit: { requests: 500, period: 'hour' }
    });

    // Analytics Endpunkte
    this.registerEndpoint({
      path: '/api/geo/analytics/performance/:locationKey',
      method: 'GET',
      description: 'Ruft Performance-Analytics für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        },
        {
          name: 'period',
          type: 'string',
          required: false,
          description: 'Zeitraum (7d, 30d, 90d)'
        }
      ],
      response: {
        type: 'PerformanceAnalytics',
        description: 'Detaillierte Performance-Metriken'
      },
      authentication: true,
      rateLimit: { requests: 300, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/analytics/competitor/:locationKey',
      method: 'GET',
      description: 'Ruft Wettbewerbsanalyse für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'CompetitorAnalysis',
        description: 'Umfassende Wettbewerbsdaten'
      },
      authentication: true,
      rateLimit: { requests: 100, period: 'hour' }
    });

    // Content Endpunkte
    this.registerEndpoint({
      path: '/api/geo/content/optimization/:locationKey',
      method: 'GET',
      description: 'Ruft Content-Optimierungshinweise ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'ContentOptimization',
        description: 'Content-Optimierungshinweise und Empfehlungen'
      },
      authentication: true,
      rateLimit: { requests: 200, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/content/generate/:locationKey',
      method: 'POST',
      description: 'Generiert personalisierten Content für einen Standort',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'GeneratedContent',
        description: 'Generierter lokaler Content'
      },
      authentication: true,
      rateLimit: { requests: 50, period: 'hour' }
    });

    // Marketing Endpunkte
    this.registerEndpoint({
      path: '/api/geo/marketing/campaigns/:locationKey',
      method: 'GET',
      description: 'Ruft Marketing-Kampagnen für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'MarketingCampaigns',
        description: 'Aktive und geplante Marketing-Kampagnen'
      },
      authentication: true,
      rateLimit: { requests: 150, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/marketing/attribution/:locationKey',
      method: 'GET',
      description: 'Ruft Attribution-Analyse für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'AttributionAnalysis',
        description: 'Multi-Channel Attribution-Daten'
      },
      authentication: true,
      rateLimit: { requests: 100, period: 'hour' }
    });

    // System Endpunkte
    this.registerEndpoint({
      path: '/api/geo/system/health',
      method: 'GET',
      description: 'Ruft System-Health-Status ab',
      response: {
        type: 'SystemHealth',
        description: 'Gesamtstatus aller GEO-Services'
      },
      authentication: true,
      rateLimit: { requests: 60, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/system/diagnostic',
      method: 'GET',
      description: 'Führt vollständige Systemdiagnose durch',
      response: {
        type: 'SystemDiagnostic',
        description: 'Detaillierte Diagnose-Ergebnisse'
      },
      authentication: true,
      rateLimit: { requests: 10, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/system/backup',
      method: 'POST',
      description: 'Erstellt System-Backup',
      response: {
        type: 'BackupResult',
        description: 'Backup-Status und Metadaten'
      },
      authentication: true,
      rateLimit: { requests: 5, period: 'day' }
    });

    // Intelligence Endpunkte
    this.registerEndpoint({
      path: '/api/geo/intelligence/trends/:locationKey',
      method: 'GET',
      description: 'Ruft Suchtrend-Analyse für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'SearchTrends',
        description: 'Vorhersagende Suchtrend-Daten'
      },
      authentication: true,
      rateLimit: { requests: 100, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/intelligence/market/:locationKey',
      method: 'GET',
      description: 'Ruft Markt-Intelligence für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'MarketIntelligence',
        description: 'Umfassende Marktanalyse'
      },
      authentication: true,
      rateLimit: { requests: 100, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/intelligence/opportunities/:locationKey',
      method: 'GET',
      description: 'Ruft SEO-Opportunities für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'SEOOpportunities',
        description: 'Identifizierte Optimierungsmöglichkeiten'
      },
      authentication: true,
      rateLimit: { requests: 150, period: 'hour' }
    });

    // Konfiguration Endpunkte
    this.registerEndpoint({
      path: '/api/geo/config/:locationKey',
      method: 'GET',
      description: 'Ruft Integrationskonfiguration für einen Standort ab',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'GEOIntegrationConfig',
        description: 'Aktuelle Konfigurationseinstellungen'
      },
      authentication: true,
      rateLimit: { requests: 50, period: 'hour' }
    });

    this.registerEndpoint({
      path: '/api/geo/config/:locationKey',
      method: 'PUT',
      description: 'Aktualisiert Integrationskonfiguration für einen Standort',
      parameters: [
        {
          name: 'locationKey',
          type: 'string',
          required: true,
          description: 'Eindeutiger Schlüssel des Standorts'
        }
      ],
      response: {
        type: 'GEOIntegrationConfig',
        description: 'Aktualisierte Konfiguration'
      },
      authentication: true,
      rateLimit: { requests: 20, period: 'hour' }
    });

    // API Dokumentation
    this.registerEndpoint({
      path: '/api/geo/docs',
      method: 'GET',
      description: 'Ruft API-Dokumentation ab',
      response: {
        type: 'APIDocumentation',
        description: 'Vollständige API-Dokumentation'
      },
      authentication: false,
      rateLimit: { requests: 100, period: 'hour' }
    });
  }

  /**
   * Registriert einen einzelnen Endpunkt
   */
  private registerEndpoint(endpoint: GEOEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}`;
    this.endpoints.set(key, endpoint);
  }

  /**
   * Verarbeitet eine API-Anfrage
   */
  public async processRequest(request: APIRequest): Promise<APIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      // Rate Limiting prüfen
      if (!this.checkRateLimit(request)) {
        return this.createErrorResponse('RATE_LIMIT_EXCEEDED', 'Rate limit exceeded', 429, requestId, startTime);
      }

      // Endpunkt finden
      const endpoint = this.findEndpoint(request.method, request.endpoint);
      if (!endpoint) {
        return this.createErrorResponse('ENDPOINT_NOT_FOUND', 'Endpoint not found', 404, requestId, startTime);
      }

      // Parameter validieren
      const validationError = this.validateParameters(request, endpoint);
      if (validationError) {
        return this.createErrorResponse('VALIDATION_ERROR', validationError, 400, requestId, startTime);
      }

      // Anfrage verarbeiten
      const result = await this.handleRequest(request, endpoint);

      // Erfolgreiche Antwort erstellen
      this.logRequest(requestId, request, 200, Date.now() - startTime);
      return {
        success: true,
        data: result,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId,
          processingTime: Date.now() - startTime,
          version: '1.0.0'
        }
      };

    } catch (error) {
      console.error('API Gateway Error:', error);
      this.logRequest(requestId, request, 500, Date.now() - startTime);
      return this.createErrorResponse('INTERNAL_ERROR', 'Internal server error', 500, requestId, startTime);
    }
  }

  /**
   * Findet den passenden Endpunkt
   */
  private findEndpoint(method: string, path: string): GEOEndpoint | null {
    // Einfache Pfad-Matching (in Produktion würde man einen Router verwenden)
    for (const [key, endpoint] of this.endpoints) {
      if (key.startsWith(`${method}:`)) {
        const endpointPath = endpoint.path.replace(/:\w+/g, '[^/]+');
        const regex = new RegExp(`^${endpointPath}$`);
        if (regex.test(path)) {
          return endpoint;
        }
      }
    }
    return null;
  }

  /**
   * Validiert Anfrageparameter
   */
  private validateParameters(request: APIRequest, endpoint: GEOEndpoint): string | null {
    if (!endpoint.parameters) return null;

    const pathParams = this.extractPathParameters(request.endpoint, endpoint.path);
    const allParams = { ...pathParams, ...request.params };

    for (const param of endpoint.parameters) {
      if (param.required && !(param.name in allParams)) {
        return `Missing required parameter: ${param.name}`;
      }
    }

    return null;
  }

  /**
   * Extrahiert Pfadparameter
   */
  private extractPathParameters(requestPath: string, endpointPath: string): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    const requestParts = requestPath.split('/');
    const endpointParts = endpointPath.split('/');

    for (let i = 0; i < endpointParts.length; i++) {
      if (endpointParts[i].startsWith(':')) {
        const paramName = endpointParts[i].substring(1);
        params[paramName] = requestParts[i];
      }
    }

    return params;
  }

  /**
   * Verarbeitet die eigentliche Anfrage
   */
  private async handleRequest(request: APIRequest, endpoint: GEOEndpoint): Promise<any> {
    const pathParams = this.extractPathParameters(request.endpoint, endpoint.path);
    const locationKey = pathParams.locationKey;

    switch (endpoint.path) {
      case '/api/geo/dashboard/:locationKey':
        return enterpriseGEOIntegrationService.getIntegratedDashboard(locationKey);

      case '/api/geo/dashboard/global':
        return enterpriseGEOIntegrationService.generateGlobalGEOOverview();

      case '/api/geo/data/:locationKey':
        return enterpriseGEOIntegrationService.getUnifiedDataModel(locationKey);

      case '/api/geo/data/sync/:locationKey':
        return enterpriseGEOIntegrationService.syncLocationData(locationKey);

      case '/api/geo/system/health':
        return enterpriseGEOIntegrationService.getSystemHealth();

      case '/api/geo/system/diagnostic':
        return enterpriseGEOIntegrationService.performSystemDiagnostic();

      case '/api/geo/system/backup':
        return enterpriseGEOIntegrationService.createSystemBackup();

      case '/api/geo/config/:locationKey':
        if (request.method === 'GET') {
          return enterpriseGEOIntegrationService.getIntegrationConfig(locationKey);
        } else if (request.method === 'PUT') {
          enterpriseGEOIntegrationService.updateIntegrationConfig(locationKey, request.body);
          return enterpriseGEOIntegrationService.getIntegrationConfig(locationKey);
        }
        break;

      case '/api/geo/docs':
        return this.getAPIDocumentation();

      default:
        // Service-spezifische Endpunkte würden hier behandelt werden
        return { message: 'Endpoint not fully implemented yet' };
    }
  }

  /**
   * Prüft Rate Limiting
   */
  private checkRateLimit(request: APIRequest): boolean {
    const clientId = request.headers?.['x-client-id'] || 'anonymous';
    const endpoint = this.findEndpoint(request.method, request.endpoint);

    if (!endpoint?.rateLimit) return true;

    const key = `${clientId}:${request.method}:${request.endpoint}`;
    const limiter = this.rateLimiters.get(key);

    if (!limiter || Date.now() > limiter.resetTime) {
      this.rateLimiters.set(key, {
        count: 1,
        resetTime: Date.now() + this.getPeriodMs(endpoint.rateLimit.period)
      });
      return true;
    }

    if (limiter.count >= endpoint.rateLimit.requests) {
      return false;
    }

    limiter.count++;
    return true;
  }

  /**
   * Konvertiert Period-String in Millisekunden
   */
  private getPeriodMs(period: string): number {
    const periods = {
      'second': 1000,
      'minute': 60 * 1000,
      'hour': 60 * 60 * 1000,
      'day': 24 * 60 * 60 * 1000
    };
    return periods[period as keyof typeof periods] || 60 * 1000;
  }

  /**
   * Generiert eine eindeutige Request-ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Erstellt eine Fehlerantwort
   */
  private createErrorResponse(
    code: string,
    message: string,
    status: number,
    requestId: string,
    startTime: number
  ): APIResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details: status >= 500 ? 'Internal error occurred' : undefined
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId,
        processingTime: Date.now() - startTime,
        version: '1.0.0'
      }
    };
  }

  /**
   * Loggt eine Anfrage
   */
  private logRequest(
    requestId: string,
    request: APIRequest,
    status: number,
    duration: number
  ): void {
    this.requestHistory.push({
      id: requestId,
      timestamp: new Date().toISOString(),
      method: request.method,
      endpoint: request.endpoint,
      status,
      duration,
      userAgent: request.headers?.['user-agent']
    });

    // Behalte nur die letzten 1000 Einträge
    if (this.requestHistory.length > 1000) {
      this.requestHistory = this.requestHistory.slice(-1000);
    }
  }

  /**
   * Ruft API-Dokumentation ab
   */
  public getAPIDocumentation(): {
    version: string;
    baseUrl: string;
    endpoints: GEOEndpoint[];
    authentication: {
      type: string;
      description: string;
    };
    rateLimiting: {
      description: string;
      headers: string[];
    };
  } {
    return {
      version: '1.0.0',
      baseUrl: '/api/geo',
      endpoints: Array.from(this.endpoints.values()),
      authentication: {
        type: 'Bearer Token',
        description: 'Include Authorization header with Bearer token'
      },
      rateLimiting: {
        description: 'Rate limiting is enforced per endpoint',
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
      }
    };
  }

  /**
   * Ruft Request-Historie ab
   */
  public getRequestHistory(limit: number = 100): Array<{
    id: string;
    timestamp: string;
    method: string;
    endpoint: string;
    status: number;
    duration: number;
    userAgent?: string;
  }> {
    return this.requestHistory.slice(-limit);
  }

  /**
   * Ruft API-Metriken ab
   */
  public getAPIMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    requestsPerMinute: number;
    topEndpoints: Array<{
      endpoint: string;
      count: number;
      averageTime: number;
    }>;
  } {
    const totalRequests = this.requestHistory.length;
    const totalTime = this.requestHistory.reduce((sum, req) => sum + req.duration, 0);
    const errorCount = this.requestHistory.filter(req => req.status >= 400).length;

    const endpointStats = new Map<string, { count: number; totalTime: number }>();
    this.requestHistory.forEach(req => {
      const key = `${req.method} ${req.endpoint}`;
      const stats = endpointStats.get(key) || { count: 0, totalTime: 0 };
      stats.count++;
      stats.totalTime += req.duration;
      endpointStats.set(key, stats);
    });

    const topEndpoints = Array.from(endpointStats.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        averageTime: stats.totalTime / stats.count
      }));

    return {
      totalRequests,
      averageResponseTime: totalRequests > 0 ? totalTime / totalRequests : 0,
      errorRate: totalRequests > 0 ? errorCount / totalRequests : 0,
      requestsPerMinute: totalRequests / (Date.now() / (1000 * 60)),
      topEndpoints
    };
  }
}

// Singleton-Instanz für globale Verwendung
export const enterpriseGEOAPIGateway = new EnterpriseGEOAPIGateway();