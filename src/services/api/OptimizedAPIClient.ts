import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Enhanced types for API requests
interface RequestConfig extends AxiosRequestConfig {
  retryCount?: number
  cacheKey?: string
  cacheTTL?: number
  deduplicate?: boolean
  priority?: 'high' | 'normal' | 'low'
  metadata?: {
    startTime?: number
  }
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  headers?: Record<string, string>
}

interface RequestQueueItem {
  config: RequestConfig
  resolve: (value: AxiosResponse) => void
  reject: (reason: unknown) => void
  timestamp: number
}

// Advanced caching system with TTL and size limits
class AdvancedCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private cleanupInterval: NodeJS.Timeout

  constructor(maxSize: number = 100, cleanupIntervalMs: number = 60000) {
    this.maxSize = maxSize
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs)
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set(key: string, data: T, ttl: number = 300000): void { // 5 minutes default
    // Check if we need to evict old entries
    if (this.cache.size >= this.maxSize) {
      // Simple LRU: remove oldest entry
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }

    this.cache.set(key, entry)
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Request deduplication system
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<unknown>>()

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  clear(): void {
    this.pendingRequests.clear()
  }

  size(): number {
    return this.pendingRequests.size
  }
}

// Priority queue for requests
class RequestQueue {
  private queues = {
    high: [] as RequestQueueItem[],
    normal: [] as RequestQueueItem[],
    low: [] as RequestQueueItem[]
  }
  private processing = false
  private concurrencyLimit = 6
  private activeRequests = 0

  enqueue(config: RequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const priority = config.priority || 'normal'
      const queueItem: RequestQueueItem = {
        config,
        resolve,
        reject,
        timestamp: Date.now()
      }

      this.queues[priority].push(queueItem)
      this.process()
    })
  }

  private async process(): Promise<void> {
    if (this.processing || this.activeRequests >= this.concurrencyLimit) return

    this.processing = true

    while (this.activeRequests < this.concurrencyLimit) {
      const nextItem = this.getNextItem()
      if (!nextItem) break

      this.activeRequests++
      this.processItem(nextItem).finally(() => {
        this.activeRequests--
        this.process()
      })
    }

    this.processing = false
  }

  private getNextItem(): RequestQueueItem | null {
    if (this.queues.high.length > 0) return this.queues.high.shift()!
    if (this.queues.normal.length > 0) return this.queues.normal.shift()!
    if (this.queues.low.length > 0) return this.queues.low.shift()!
    return null
  }

  private async processItem(item: RequestQueueItem): Promise<void> {
    try {
      const result = await this.executeRequest(item.config)
      item.resolve(result)
    } catch (error) {
      item.reject(error)
    }
  }

  private async executeRequest(config: RequestConfig): Promise<AxiosResponse> {
    // Implementation would depend on your HTTP client
    // This is a placeholder
    return axios(config)
  }

  clear(): void {
    Object.values(this.queues).forEach(queue => queue.length = 0)
  }

  size(): number {
    return Object.values(this.queues).reduce((total, queue) => total + queue.length, 0)
  }
}

// Optimized API Client
export class OptimizedAPIClient {
  private axiosInstance: AxiosInstance
  private cache: AdvancedCache<unknown>
  private deduplicator: RequestDeduplicator
  private requestQueue: RequestQueue
  private requestMetadata = new WeakMap<AxiosRequestConfig, { startTime: number; cacheTTL?: number }>()
  private metrics = {
    requests: 0,
    cacheHits: 0,
    retries: 0,
    errors: 0
  }

  constructor(
    baseURL: string,
    options: {
      timeout?: number
      cacheSize?: number
      enableDeduplication?: boolean
      enableQueueing?: boolean
      retryAttempts?: number
      retryDelay?: number
    } = {}
  ) {
    const {
      timeout = 10000,
      cacheSize = 100,
      enableDeduplication: _enableDeduplication = true,
      enableQueueing: _enableQueueing = true,
      retryAttempts = 3,
      retryDelay = 1000
    } = options

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.cache = new AdvancedCache(cacheSize)
    this.deduplicator = new RequestDeduplicator()
    this.requestQueue = new RequestQueue()

    this.setupInterceptors(retryAttempts, retryDelay)
  }

  private setupInterceptors(maxRetries: number, retryDelay: number): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.metrics.requests++
        this.requestMetadata.set(config, {
          startTime: Date.now(),
          cacheTTL: (config as RequestConfig).cacheTTL
        })
        return config
      },
      (error) => {
        this.metrics.errors++
        return Promise.reject(error)
      }
    )

    // Response interceptor for caching and retry logic
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const config = response.config as RequestConfig

        // Cache successful GET requests
        if (config.method?.toLowerCase() === 'get' && config.cacheKey) {
          const metadata = this.requestMetadata.get(response.config)
          const ttl = metadata?.cacheTTL || 300000 // 5 minutes default
          this.cache.set(
            config.cacheKey,
            response.data,
            ttl
          )
        }

        // Log performance metrics
        const metadata = this.requestMetadata.get(response.config)
        const duration = metadata ? Date.now() - metadata.startTime : 0
        if (duration > 2000) { // Slow request warning
          console.warn(`Slow API request: ${config.url} took ${duration}ms`)
        }

        return response
      },
      async (error) => {
        this.metrics.errors++
        const config = error.config as RequestConfig

        // Retry logic
        if (!config.retryCount) {
          config.retryCount = 0
        }

        if (
          config.retryCount < maxRetries &&
          (error.code === 'ECONNABORTED' ||
           error.code === 'NETWORK_ERROR' ||
           (error.response && error.response.status >= 500))
        ) {
          config.retryCount++
          this.metrics.retries++

          // Exponential backoff
          const delay = retryDelay * Math.pow(2, config.retryCount - 1)
          await new Promise(resolve => setTimeout(resolve, delay))

          return this.axiosInstance.request(config)
        }

        return Promise.reject(error)
      }
    )
  }

  async request<T = unknown>(config: RequestConfig): Promise<AxiosResponse<T>> {
    const {
      cacheKey,
      cacheTTL: _cacheTTL,
      deduplicate = true,
      priority,
      ...axiosConfig
    } = config

    // Check cache first for GET requests
    if (axiosConfig.method?.toLowerCase() === 'get' && cacheKey) {
      const cachedData = this.cache.get(cacheKey)
      if (cachedData) {
        this.metrics.cacheHits++
        return {
          data: cachedData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: axiosConfig,
          request: {}
        } as AxiosResponse<T>
      }
    }

    // Create request function
    const makeRequest = async () => {
      if (priority && priority !== 'normal') {
        return this.requestQueue.enqueue(config)
      }
      return this.axiosInstance.request(axiosConfig)
    }

    // Deduplicate requests if enabled
    if (deduplicate && cacheKey) {
      return this.deduplicator.deduplicate(cacheKey, makeRequest)
    }

    return makeRequest()
  }

  // Convenience methods
  async get<T = unknown>(
    url: string,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'GET', url })
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'PATCH', url, data })
  }

  async delete<T = unknown>(
    url: string,
    config: RequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.request({ ...config, method: 'DELETE', url })
  }

  // Cache management
  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const key of this.cache['cache'].keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  // Metrics and monitoring
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.requests > 0
        ? (this.metrics.cacheHits / this.metrics.requests * 100).toFixed(2) + '%'
        : '0%',
      cacheSize: this.cache.size(),
      pendingRequests: this.deduplicator.size(),
      queuedRequests: this.requestQueue.size()
    }
  }

  // Cleanup
  destroy(): void {
    this.cache.destroy()
    this.deduplicator.clear()
    this.requestQueue.clear()
  }
}

// Factory for creating optimized API clients
export function createOptimizedAPIClient(
  baseURL: string,
  options?: ConstructorParameters<typeof OptimizedAPIClient>[1]
): OptimizedAPIClient {
  return new OptimizedAPIClient(baseURL, options)
}

// Singleton instance for common usage
export const apiClient = createOptimizedAPIClient('/api', {
  timeout: 10000,
  cacheSize: 200,
  enableDeduplication: true,
  enableQueueing: true,
  retryAttempts: 3,
  retryDelay: 1000
})

export default OptimizedAPIClient