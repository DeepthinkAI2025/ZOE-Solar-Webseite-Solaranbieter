import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  RequestConfig,
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  ApiClientConfig,
  CacheEntry,
  RateLimitInfo,
} from '../types/api.types';

class APIClient {
  private axiosInstance: AxiosInstance;
  private config: ApiClientConfig;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
    this.setupCacheCleanup();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        let requestConfig: RequestConfig = {
          method: config.method?.toUpperCase() as HttpMethod,
          url: config.url || '',
          data: config.data,
          params: config.params,
          headers: config.headers,
        };

        // Apply request interceptors
        if (this.config.interceptors?.request) {
          for (const interceptor of this.config.interceptors.request) {
            requestConfig = await interceptor(requestConfig);
          }
        }

        // Add rate limiting info
        if (this.rateLimitInfo) {
          config.headers = {
            ...config.headers,
            'X-RateLimit-Remaining': this.rateLimitInfo.remaining.toString(),
          };
        }

        return config;
      },
      (error) => Promise.reject(this.createError(error, 'NETWORK_ERROR'))
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      async (response) => {
        let apiResponse: ApiResponse = response.data;

        // Store rate limiting info
        const rateLimitHeaders = response.headers['x-ratelimit-remaining'];
        if (rateLimitHeaders) {
          this.rateLimitInfo = {
            remaining: parseInt(rateLimitHeaders as string, 10),
            reset: parseInt(response.headers['x-ratelimit-reset'] as string, 10),
            limit: parseInt(response.headers['x-ratelimit-limit'] as string, 10),
          };
        }

        // Apply response interceptors
        if (this.config.interceptors?.response) {
          for (const interceptor of this.config.interceptors.response) {
            apiResponse = await interceptor(apiResponse);
          }
        }

        return apiResponse;
      },
      async (error) => {
        // Apply error interceptors
        let apiError = this.createError(error);

        if (this.config.interceptors?.error) {
          for (const interceptor of this.config.interceptors.error) {
            apiError = await interceptor(apiError);
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  private createError(error: unknown, type?: string): ApiError {
    const now = new Date().toISOString();
    const requestId = this.generateRequestId();

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type: 'TIMEOUT_ERROR',
        code: 'TIMEOUT',
        message: 'Request timeout',
        statusCode: 408,
        timestamp: now,
        requestId,
        timeout: this.config.timeout,
      } as TimeoutError;
    }

    if (!error.response) {
      return {
        type: 'NETWORK_ERROR',
        code: 'NETWORK_ERROR',
        message: 'Network error',
        timestamp: now,
        requestId,
        originalError: error,
      } as NetworkError;
    }

    const { response } = error;
    const statusCode = response.status;

    if (statusCode === 422 && response.data?.errors) {
      return {
        type: 'VALIDATION_ERROR',
        code: 'VALIDATION_ERROR',
        message: response.data.message || 'Validation failed',
        statusCode,
        timestamp: now,
        requestId,
        validationErrors: response.data.errors,
      } as ValidationError;
    }

    return {
      type: type || 'API_ERROR',
      code: response.data?.code || `HTTP_${statusCode}`,
      message: response.data?.message || `HTTP ${statusCode} Error`,
      statusCode,
      details: response.data?.details,
      timestamp: now,
      requestId,
    } as ApiError;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupCacheCleanup(): void {
    setInterval(() => {
      this.cleanupCache();
    }, 60000); // Clean up cache every minute
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private getCacheKey(config: RequestConfig): string {
    const { method, url, params, data } = config;
    const paramsStr = params ? JSON.stringify(params) : '';
    const dataStr = data ? JSON.stringify(data) : '';
    return `${method}_${url}_${paramsStr}_${dataStr}`;
  }

  private async getCachedResponse<T>(config: RequestConfig): Promise<T | null> {
    if (!config.cache || config.method !== 'GET') {
      return null;
    }

    const key = this.getCacheKey(config);
    const entry = this.cache.get(key) as CacheEntry<T>;

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCachedResponse<T>(config: RequestConfig, data: T): void {
    if (!config.cache || config.method !== 'GET') {
      return;
    }

    const key = this.getCacheKey(config);
    const ttl = config.cacheTTL || this.config.cacheTTL;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    });
  }

  public async request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Check cache for GET requests
    if (config.cache && config.method === 'GET') {
      const cached = await this.getCachedResponse<T>(config);
      if (cached) {
        return {
          success: true,
          data: cached,
        };
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: {
        ...this.config.headers,
        ...config.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: config.timeout || this.config.timeout,
    };

    let lastError: ApiError | null = null;
    const maxRetries = config.retries ?? this.config.retries;
    const retryDelay = config.retryDelay ?? this.config.retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.axiosInstance.request<ApiResponse<T>>(axiosConfig);
        const result = response.data;

        // Cache successful GET responses
        if (config.cache && config.method === 'GET' && result.success && result.data) {
          this.setCachedResponse(config, result.data);
        }

        return result;
      } catch (error) {
        lastError = error as ApiError;

        // Don't retry on client errors (4xx)
        if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500) {
          break;
        }

        // Wait before retrying
        if (attempt < maxRetries) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError;
  }

  public async get<T = unknown>(
    url: string,
    params?: Record<string, string | number>,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...options,
    });
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...options,
    });
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...options,
    });
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
  }

  public async delete<T = unknown>(
    url: string,
    options?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...options,
    });
  }

  public getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default APIClient;