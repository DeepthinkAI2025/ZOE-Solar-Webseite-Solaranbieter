// API Clients
export { default as APIClient } from './client/APIClient';
import OpenRouterClient, { getOpenRouterClient } from '../../services/core/OpenRouterClient';
export { OpenRouterClient, getOpenRouterClient };
export { default as SEOAPIClient } from './services/SEOAPIClient';
export { default as AnalyticsAPIClient } from './services/AnalyticsAPIClient';

// Types
export type {
  ApiResponse,
  PaginatedResponse,
  RequestConfig,
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  ApiClientConfig,
  HealthCheck,
  RateLimitInfo,
  CacheEntry,
} from './types/api.types';



export type {
  KeywordData,
  PageSEOData,
  BacklinkData,
  CompetitorData,
  LocalSEOData,
  ContentOptimization,
} from './services/SEOAPIClient';

export type {
  UserEvent,
  PageView,
  Conversion,
  UserSession,
  AnalyticsReport,
  RealTimeMetrics,
} from './services/AnalyticsAPIClient';

// API Instance Factory



// Default OpenRouter client (singleton)


import SEOAPIClient from './services/SEOAPIClient';
import AnalyticsAPIClient from './services/AnalyticsAPIClient';

export const defaultOpenRouterClient = getOpenRouterClient();


export const defaultSEOClient = new SEOAPIClient(
  import.meta.env.VITE_SEO_API_KEY || '',
  import.meta.env.VITE_SEO_API_BASE_URL
);


export const defaultAnalyticsClient = new AnalyticsAPIClient(
  import.meta.env.VITE_ANALYTICS_API_KEY || '',
  import.meta.env.VITE_ANALYTICS_API_BASE_URL
);

// Utility functions remain unchanged