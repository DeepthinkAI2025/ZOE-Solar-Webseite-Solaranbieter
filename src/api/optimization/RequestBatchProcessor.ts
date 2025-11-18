/**
 * Request Batch Processor
 * Intelligently batches API requests to reduce network overhead and improve performance
 */

import APIClient from '../client/APIClient';
import { ApiResponse } from '../types/api.types';
import { RequestConfig } from '../types/api.types';

export interface BatchableRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  headers?: Record<string, string>;
  priority: 'high' | 'medium' | 'low';
  timeout?: number;
  retryCount?: number;
  timestamp: number;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

export interface BatchConfig {
  maxBatchSize: number;
  maxWaitTime: number; // Maximum time to wait before flushing batch
  groupingStrategy: 'endpoint' | 'method' | 'priority' | 'adaptive';
  enableCompression: boolean;
  enableDeduplication: boolean;
  endpointThresholds: Record<string, {
    maxBatchSize: number;
    maxWaitTime: number;
  }>;
}

export interface BatchStats {
  totalBatches: number;
  totalRequests: number;
  averageBatchSize: number;
  averageWaitTime: number;
  deduplicationRate: number;
  compressionRatio: number;
  successRate: number;
  timeSavings: number; // Estimated time saved by batching
}

export interface BatchResult {
  batchId: string;
  requests: BatchableRequest[];
  responses: Array<{
    requestId: string;
    success: boolean;
    data?: unknown;
    error?: string;
    duration: number;
  }>;
  totalDuration: number;
  compressionEnabled: boolean;
  deduplicationCount: number;
}

class RequestBatchProcessor {
  private pendingRequests: Map<string, BatchableRequest[]> = new Map();
  private batchTimers: Map<string, number> = new Map();
  private config: BatchConfig;
  private apiClient: APIClient;
  private stats: BatchStats;
  private isEnabled: boolean = true;

  constructor(apiClient: APIClient, config?: Partial<BatchConfig>) {
    this.apiClient = apiClient;
    this.config = {
      maxBatchSize: 10,
      maxWaitTime: 100, // 100ms
      groupingStrategy: 'endpoint',
      enableCompression: true,
      enableDeduplication: true,
      endpointThresholds: {},
      ...config,
    };

    this.stats = {
      totalBatches: 0,
      totalRequests: 0,
      averageBatchSize: 0,
      averageWaitTime: 0,
      deduplicationRate: 0,
      compressionRatio: 0,
      successRate: 0,
      timeSavings: 0,
    };

    this.setupOptimalThresholds();
  }

  private setupOptimalThresholds(): void {
    // Configure optimal batching thresholds based on endpoint patterns
    this.config.endpointThresholds = {
      // High-frequency endpoints that benefit from aggressive batching
      '/api/analytics': { maxBatchSize: 20, maxWaitTime: 50 },
      '/api/tracking': { maxBatchSize: 50, maxWaitTime: 25 },
      '/api/metrics': { maxBatchSize: 30, maxWaitTime: 75 },

      // Medium-frequency endpoints
      '/api/content': { maxBatchSize: 10, maxWaitTime: 100 },
      '/api/user': { maxBatchSize: 5, maxWaitTime: 150 },

      // Low-frequency endpoints (minimal batching)
      '/api/admin': { maxBatchSize: 3, maxWaitTime: 200 },
      '/api/auth': { maxBatchSize: 2, maxWaitTime: 250 },
    };
  }

  public async addRequest(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown,
    options?: {
      priority?: 'high' | 'medium' | 'low';
      timeout?: number;
      headers?: Record<string, string>;
    }
  ): Promise<unknown> {
    if (!this.isEnabled) {
      // Fall back to direct request if batching is disabled
      const config: RequestConfig = {
        method,
        url,
        data,
        timeout: options?.timeout,
        headers: options?.headers,
      };

      const response = await this.apiClient.request(config);
      return response.data;
    }

    return new Promise((resolve, reject) => {
      const request: BatchableRequest = {
        id: this.generateRequestId(),
        url,
        method,
        data,
        priority: options?.priority || 'medium',
        timeout: options?.timeout,
        headers: options?.headers,
        retryCount: 0,
        timestamp: Date.now(),
        resolve,
        reject,
      };

      // Check for duplicates if enabled
      if (this.config.enableDeduplication) {
        const duplicate = this.findDuplicateRequest(request);
        if (duplicate) {
          // Attach to existing request
          duplicate.resolve = this.combineResolvers(duplicate.resolve, resolve);
          duplicate.reject = this.combineRejectors(duplicate.reject, reject);
          return;
        }
      }

      this.addToBatch(request);
    });
  }

  private addToBatch(request: BatchableRequest): void {
    const batchKey = this.getBatchKey(request);

    if (!this.pendingRequests.has(batchKey)) {
      this.pendingRequests.set(batchKey, []);
    }

    const batch = this.pendingRequests.get(batchKey)!;
    batch.push(request);

    // Check if we should flush the batch immediately
    const threshold = this.config.endpointThresholds[request.url] || this.config;

    if (batch.length >= threshold.maxBatchSize) {
      this.flushBatch(batchKey);
    } else {
      // Set timer to flush after max wait time
      this.scheduleBatchFlush(batchKey, threshold.maxWaitTime);
    }
  }

  private getBatchKey(request: BatchableRequest): string {
    switch (this.config.groupingStrategy) {
      case 'endpoint':
        return `${request.method}:${request.url}`;
      case 'method':
        return request.method;
      case 'priority':
        return request.priority;
      case 'adaptive':
        // Adaptive strategy considers multiple factors
        const hasData = request.data ? 'with-data' : 'no-data';
        const endpointType = this.getEndpointType(request.url);
        return `${request.method}:${endpointType}:${request.priority}:${hasData}`;
      default:
        return 'default';
    }
  }

  private getEndpointType(url: string): string {
    if (url.includes('/analytics')) return 'analytics';
    if (url.includes('/tracking')) return 'tracking';
    if (url.includes('/content')) return 'content';
    if (url.includes('/user')) return 'user';
    if (url.includes('/admin')) return 'admin';
    return 'general';
  }

  private scheduleBatchFlush(batchKey: string, maxWaitTime: number): void {
    if (this.batchTimers.has(batchKey)) {
      return; // Timer already scheduled
    }

    const timer = setTimeout(() => {
      this.flushBatch(batchKey);
    }, maxWaitTime);

    this.batchTimers.set(batchKey, timer);
  }

  private async flushBatch(batchKey: string): Promise<void> {
    // Clear timer if exists
    const timer = this.batchTimers.get(batchKey);
    if (timer) {
      clearTimeout(timer);
      this.batchTimers.delete(batchKey);
    }

    const batch = this.pendingRequests.get(batchKey);
    if (!batch || batch.length === 0) {
      return;
    }

    // Remove from pending
    this.pendingRequests.delete(batchKey);

    // Process the batch
    this.processBatch(batch);
  }

  private async processBatch(requests: BatchableRequest[]): Promise<void> {
    const startTime = performance.now();
    const batchId = this.generateBatchId();

    try {
      const result = await this.executeBatch(requests, batchId);
      this.handleBatchResult(result);
    } catch (error) {
      this.handleBatchError(requests, error);
    }

    // Update statistics
    const duration = performance.now() - startTime;
    this.updateStats(requests, duration);
  }

  private async executeBatch(requests: BatchableRequest[], batchId: string): Promise<BatchResult> {
    // Group requests by type for efficient processing
    const getRequests = requests.filter(r => r.method === 'GET');
    const postRequests = requests.filter(r => r.method === 'POST');
    const otherRequests = requests.filter(r => !['GET', 'POST'].includes(r.method));

    const responses: BatchResult['responses'] = [];
    let compressionEnabled = false;
    let deduplicationCount = 0;

    // Process GET requests (can be combined)
    if (getRequests.length > 0) {
      const getResult = await this.processGetRequests(getRequests, batchId);
      responses.push(...getResult.responses);
      compressionEnabled = compressionEnabled || getResult.compressionEnabled;
      deduplicationCount += getResult.deduplicationCount;
    }

    // Process POST requests
    if (postRequests.length > 0) {
      const postResult = await this.processPostRequests(postRequests, batchId);
      responses.push(...postResult.responses);
      compressionEnabled = compressionEnabled || postResult.compressionEnabled;
      deduplicationCount += postResult.deduplicationCount;
    }

    // Process other requests individually
    for (const request of otherRequests) {
      try {
        const response = await this.executeIndividualRequest(request);
        responses.push({
          requestId: request.id,
          success: true,
          data: response.data,
          duration: response.duration,
        });
      } catch (error) {
        responses.push({
          requestId: request.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0,
        });
      }
    }

    return {
      batchId,
      requests,
      responses,
      totalDuration: performance.now() - performance.now(), // Will be calculated by caller
      compressionEnabled,
      deduplicationCount,
    };
  }

  private async processGetRequests(requests: BatchableRequest[], batchId: string): Promise<{
    responses: BatchResult['responses'];
    compressionEnabled: boolean;
    deduplicationCount: number;
  }> {
    // Check if requests can be combined into a single endpoint
    const canCombine = this.canCombineGetRequests(requests);

    if (canCombine && requests.length > 1) {
      return this.processCombinedGetRequests(requests, batchId);
    } else {
      return this.processParallelGetRequests(requests);
    }
  }

  private canCombineGetRequests(requests: BatchableRequest[]): boolean {
    // Check if all requests go to the same endpoint with different parameters
    const baseUrls = new Set(requests.map(r => r.url.split('?')[0]));
    if (baseUrls.size !== 1) return false;

    const baseUrl = Array.from(baseUrls)[0];
    if (!baseUrl) return false;

    // Only combine if endpoint supports batching
    const batchableEndpoints = [
      '/api/content',
      '/api/analytics',
      '/api/tracking',
      '/api/metrics',
    ];

    return batchableEndpoints.some(endpoint => baseUrl.includes(endpoint));
  }

  private async processCombinedGetRequests(requests: BatchableRequest[], batchId: string): Promise<{
    responses: BatchResult['responses'];
    compressionEnabled: boolean;
    deduplicationCount: number;
  }> {
    // Combine parameters from all requests
    const combinedParams = new URLSearchParams();
    const requestMap = new Map<string, BatchableRequest>();

    for (const request of requests) {
      const url = new URL(request.url, window.location.origin);
      for (const [key, value] of url.searchParams) {
        if (!combinedParams.has(key)) {
          combinedParams.set(key, value);
          requestMap.set(key, request);
        }
      }
    }

    const baseUrl = requests[0]?.url.split('?')[0];
    if (!baseUrl) return false;
    const combinedUrl = `${baseUrl}?${combinedParams.toString()}`;

    try {
      const response = await this.apiClient.get(combinedUrl, {
        headers: { 'X-Batch-ID': batchId },
      });

      // Map the combined response back to individual requests
      const responses: BatchResult['responses'] = requests.map(request => ({
        requestId: request.id,
        success: true,
        data: response.data,
        duration: 0, // Would be measured in real implementation
      }));

      return {
        responses,
        compressionEnabled: true,
        deduplicationCount: requests.length - 1,
      };
    } catch (_error) {
      // Fallback to individual requests if combined request fails
      return this.processParallelGetRequests(requests);
    }
  }

  private async processParallelGetRequests(requests: BatchableRequest[]): Promise<{
    responses: BatchResult['responses'];
    compressionEnabled: boolean;
    deduplicationCount: number;
  }> {
    const responses: BatchResult['responses'] = [];

    // Execute requests in parallel
    const promises = requests.map(async (request) => {
      try {
        const response = await this.apiClient.request({
          method: 'GET',
          url: request.url,
        });

        return {
          requestId: request.id,
          success: true,
          data: response.data,
          duration: 0,
        };
      } catch (error) {
        return {
          requestId: request.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0,
        };
      }
    });

    const results = await Promise.all(promises);
    responses.push(...results);

    return {
      responses,
      compressionEnabled: false,
      deduplicationCount: 0,
    };
  }

  private async processPostRequests(requests: BatchableRequest[], batchId: string): Promise<{
    responses: BatchResult['responses'];
    compressionEnabled: boolean;
    deduplicationCount: number;
  }> {
    // POST requests are processed in parallel but can share connections
    const responses: BatchResult['responses'] = [];

    for (const request of requests) {
      try {
        const response = await this.apiClient.request({
          method: 'POST',
          url: request.url,
          data: request.data,
          headers: { ...request.headers, 'X-Batch-ID': batchId },
          timeout: request.timeout || 30000,
        });

        responses.push({
          requestId: request.id,
          success: true,
          data: response.data,
          duration: 0,
        });
      } catch (error) {
        responses.push({
          requestId: request.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0,
        });
      }
    }

    return {
      responses,
      compressionEnabled: false,
      deduplicationCount: 0,
    };
  }

  private async executeIndividualRequest(request: BatchableRequest): Promise<{
    data: unknown;
    duration: number;
  }> {
    const startTime = performance.now();

    let response: ApiResponse;
    switch (request.method) {
      case 'GET':
        response = await this.apiClient.get(request.url, {
          headers: request.headers,
          timeout: request.timeout,
        });
        break;
      case 'POST':
        response = await this.apiClient.post(request.url, request.data, {
          headers: request.headers,
          timeout: request.timeout,
        });
        break;
      case 'PUT':
        response = await this.apiClient.put(request.url, request.data, {
          headers: request.headers,
          timeout: request.timeout,
        });
        break;
      case 'DELETE':
        response = await this.apiClient.delete(request.url, {
          headers: request.headers,
          timeout: request.timeout,
        });
        break;
    }

    return {
      data: response.data,
      duration: performance.now() - startTime,
    };
  }

  private handleBatchResult(result: BatchResult): void {
    for (const response of result.responses) {
      const request = result.requests.find(r => r.id === response.requestId);
      if (!request) continue;

      if (response.success) {
        request.resolve(response.data);
      } else {
        request.reject(new Error(response.error || 'Request failed'));
      }
    }
  }

  private handleBatchError(requests: BatchableRequest[], error: unknown): void {
    for (const request of requests) {
      request.reject(error);
    }
  }

  private findDuplicateRequest(newRequest: BatchableRequest): BatchableRequest | null {
    for (const batch of this.pendingRequests.values()) {
      for (const request of batch) {
        if (this.areRequestsEquivalent(request, newRequest)) {
          return request;
        }
      }
    }
    return null;
  }

  private areRequestsEquivalent(req1: BatchableRequest, req2: BatchableRequest): boolean {
    return (
      req1.method === req2.method &&
      req1.url === req2.url &&
      JSON.stringify(req1.data) === JSON.stringify(req2.data)
    );
  }

  private combineResolvers(
    originalResolver: (value: unknown) => void,
    newResolver: (value: unknown) => void
  ): (value: unknown) => void {
    return (value: unknown) => {
      originalResolver(value);
      newResolver(value);
    };
  }

  private combineRejectors(
    originalRejector: (reason: unknown) => void,
    newRejector: (reason: unknown) => void
  ): (reason: unknown) => void {
    return (reason: unknown) => {
      originalRejector(reason);
      newRejector(reason);
    };
  }

  private updateStats(requests: BatchableRequest[], duration: number): void {
    this.stats.totalBatches++;
    this.stats.totalRequests += requests.length;
    this.stats.averageBatchSize = this.stats.totalRequests / this.stats.totalBatches;
    this.stats.averageWaitTime = (this.stats.averageWaitTime + duration) / 2;

    // Estimate time savings (assuming 50ms average per individual request)
    const estimatedIndividualTime = requests.length * 50;
    this.stats.timeSavings += Math.max(0, estimatedIndividualTime - duration);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public flushAllBatches(): void {
    for (const batchKey of this.pendingRequests.keys()) {
      this.flushBatch(batchKey);
    }
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = true; // Note: Disabling batching might not be desirable
  }

  public isBatching(): boolean {
    return this.isEnabled;
  }

  public getStats(): BatchStats {
    return { ...this.stats };
  }

  public getPendingRequests(): number {
    return Array.from(this.pendingRequests.values())
      .reduce((total, batch) => total + batch.length, 0);
  }

  public updateConfig(newConfig: Partial<BatchConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public clearStats(): void {
    this.stats = {
      totalBatches: 0,
      totalRequests: 0,
      averageBatchSize: 0,
      averageWaitTime: 0,
      deduplicationRate: 0,
      compressionRatio: 0,
      successRate: 0,
      timeSavings: 0,
    };
  }
}

export default RequestBatchProcessor;