// Base API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
}

export interface NetworkError extends ApiError {
  type: 'NETWORK_ERROR';
  originalError: Error;
}

export interface TimeoutError extends ApiError {
  type: 'TIMEOUT_ERROR';
  timeout: number;
}

export interface ValidationError extends ApiError {
  type: 'VALIDATION_ERROR';
  validationErrors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// API Client configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  enableCache: boolean;
  cacheTTL: number;
  headers: Record<string, string>;
  interceptors?: {
    request?: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>;
    response?: Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>>;
    error?: Array<(error: ApiError) => ApiError | Promise<ApiError>>;
  };
}

// Service health check
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: Array<{
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message?: string;
    duration?: number;
  }>;
}

// Rate limiting
export interface RateLimitInfo {
  remaining: number;
  reset: number;
  limit: number;
  retryAfter?: number;
}

// Cache interface
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

// API Versioning
export interface ApiVersion {
  version: string;
  deprecated: boolean;
  deprecationDate?: string;
  sunsetDate?: string;
  supportedUntil?: string;
  migrationGuide?: string;
}