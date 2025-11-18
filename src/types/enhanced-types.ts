// Enhanced TypeScript types with strict typing and type guards

// Enhanced primitive types
type NonEmptyString = string & { length: 1 }
type PositiveNumber = number & { __brand: 'PositiveNumber' }
type NonNegativeNumber = number & { __brand: 'NonNegativeNumber' }
type URL = string & { __brand: 'URL' }
type Email = string & { __brand: 'Email' }
type UUID = string & { __brand: 'UUID' }
type ISO8601Date = string & { __brand: 'ISO8601Date' }

// Type guards for enhanced primitives
export function isNonEmptyString(value: unknown): value is NonEmptyString {
  return typeof value === 'string' && value.trim().length > 0
}

export function isPositiveNumber(value: unknown): value is PositiveNumber {
  return typeof value === 'number' && value > 0 && !isNaN(value) && isFinite(value)
}

export function isNonNegativeNumber(value: unknown): value is NonNegativeNumber {
  return typeof value === 'number' && value >= 0 && !isNaN(value) && isFinite(value)
}

export function isURL(value: unknown): value is URL {
  if (typeof value !== 'string') return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isEmail(value: unknown): value is Email {
  if (typeof value !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export function isUUID(value: unknown): value is UUID {
  if (typeof value !== 'string') return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

export function isISO8601Date(value: unknown): value is ISO8601Date {
  if (typeof value !== 'string') return false
  const date = new Date(value)
  return !isNaN(date.getTime()) && !!value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/)
}

// Enhanced API response types
interface APIResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
  timestamp: ISO8601Date
  requestId?: UUID
}

interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: ISO8601Date
  requestId?: UUID
}

interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: PositiveNumber
    limit: PositiveNumber
    total: NonNegativeNumber
    totalPages: PositiveNumber
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Enhanced product types
interface Product {
  id: UUID
  name: NonEmptyString
  description: NonEmptyString
  category: NonEmptyString
  price: PositiveNumber
  currency: 'EUR' | 'USD'
  images: URL[]
  specifications: Record<string, unknown>
  availability: 'in-stock' | 'out-of-stock' | 'pre-order'
  featured: boolean
  createdAt: ISO8601Date
  updatedAt: ISO8601Date
}

// Enhanced article types
interface Article {
  id: UUID
  title: NonEmptyString
  slug: NonEmptyString
  excerpt: NonEmptyString
  content: NonEmptyString
  author: {
    name: NonEmptyString
    email: Email
    avatar?: URL
  }
  category: NonEmptyString
  tags: NonEmptyString[]
  publishedAt: ISO8601Date
  updatedAt: ISO8601Date
  isAIGenerated: boolean
  readTime: PositiveNumber
  featuredImage?: URL
}

// Enhanced case study types
interface CaseStudy {
  id: UUID
  title: NonEmptyString
  slug: NonEmptyString
  client: NonEmptyString
  location: {
    city: NonEmptyString
    country: NonEmptyString
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  category: 'residential' | 'commercial' | 'agricultural'
  description: NonEmptyString
  challenges: NonEmptyString[]
  solutions: NonEmptyString[]
  results: {
    energyGenerated: PositiveNumber
    co2Saved: PositiveNumber
    costSavings: PositiveNumber
    roi: PositiveNumber
  }
  images: URL[]
  technologies: NonEmptyString[]
  completedAt: ISO8601Date
  featured: boolean
}

// Enhanced form types
interface FormField<T = unknown> {
  name: NonEmptyString
  type: 'text' | 'email' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: NonEmptyString
  placeholder?: string
  required: boolean
  validation?: {
    min?: PositiveNumber
    max?: PositiveNumber
    pattern?: RegExp
    custom?: (value: T) => boolean | string
  }
  defaultValue?: T
}

interface FormValidation {
  isValid: boolean
  errors: Record<string, NonEmptyString>
  touched: Record<string, boolean>
}

// Enhanced component props
interface ComponentProps {
  className?: string
  'data-testid'?: string
  'aria-label'?: string
  role?: string
}

interface LoadingProps extends ComponentProps {
  loading: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'skeleton' | 'dots'
}

interface ErrorBoundaryProps extends ComponentProps {
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// Enhanced hook types
interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  reset: () => void
}

interface UseFormState<T> {
  values: T
  errors: Record<keyof T, string>
  touched: Record<keyof T, boolean>
  isValid: boolean
  isSubmitting: boolean
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setValues: (updates: Partial<T>) => void
  validateField: <K extends keyof T>(field: K) => void
  validateForm: () => boolean
  resetForm: () => void
  submitForm: (onSubmit: (values: T) => Promise<void>) => Promise<boolean>
}

// Enhanced service types
interface ServiceConfig {
  baseURL: URL
  timeout: PositiveNumber
  retryAttempts: PositiveNumber
  cacheSize: PositiveNumber
  enableLogging: boolean
}

interface CacheConfig {
  ttl: PositiveNumber
  maxSize: PositiveNumber
  strategy: 'LRU' | 'FIFO' | 'LFU'
}

// Performance monitoring types
interface PerformanceMetrics {
  renderTime: PositiveNumber
  renderCount: PositiveNumber
  memoryUsage: {
    used: PositiveNumber
    total: PositiveNumber
  }
  networkRequests: {
    total: PositiveNumber
    cached: PositiveNumber
    failed: PositiveNumber
  }
}

interface ComponentPerformanceData {
  componentName: NonEmptyString
  metrics: PerformanceMetrics
  timestamp: ISO8601Date
}

// Type-safe event handlers
type EventHandler<T = Event> = (event: T) => void
type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// Type-safe utility types
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

type RequireExactlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys]

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

// Advanced type utilities
type Branded<T, B> = T & { __brand: B }

type SafeJSONParse<T> = T extends string
  ? unknown
  : never

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

type _NonNullable<T> = T extends null | undefined ? never : T

// Functional programming types
type Maybe<T> = T | null | undefined

type Either<L, R> =
  | { type: 'Left'; value: L }
  | { type: 'Right'; value: R }

type Result<T, E = Error> =
  | { type: 'Success'; value: T }
  | { type: 'Failure'; error: E }

// Type-safe configuration
interface ConfigSchema {
  api: {
    baseURL: URL
    timeout: PositiveNumber
    retries: PositiveNumber
  }
  cache: CacheConfig
  features: Record<string, boolean>
  analytics: {
    enabled: boolean
    trackingId?: NonEmptyString
  }
}

// Type guards for complex objects
export function isAPIResponse<T>(value: unknown, dataGuard: (data: unknown) => data is T): value is APIResponse<T> {
  return typeof value === 'object' && value !== null &&
    'status' in value && (value.status === 'success' || value.status === 'error') &&
    'timestamp' in value && isISO8601Date(value.timestamp) &&
    'data' in value && dataGuard(value.data)
}

export function isProduct(value: unknown): value is Product {
  return typeof value === 'object' && value !== null &&
    'id' in value && isUUID(value.id) &&
    'name' in value && isNonEmptyString(value.name) &&
    'price' in value && isPositiveNumber(value.price)
}

export function isArticle(value: unknown): value is Article {
  return typeof value === 'object' && value !== null &&
    'id' in value && isUUID(value.id) &&
    'title' in value && isNonEmptyString(value.title) &&
    'publishedAt' in value && isISO8601Date(value.publishedAt)
}

export function isCaseStudy(value: unknown): value is CaseStudy {
  return typeof value === 'object' && value !== null &&
    'id' in value && isUUID(value.id) &&
    'title' in value && isNonEmptyString(value.title) &&
    'category' in value && typeof value.category === 'string' && ['residential', 'commercial', 'agricultural'].includes(value.category as string)
}

// Type-safe error handling
export class TypedError<TCode extends string = string> extends Error {
  constructor(
    public readonly code: TCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'TypedError'
  }
}

export function isTypedError<TCode extends string>(
  error: unknown,
  code: TCode
): error is TypedError<TCode> {
  return error instanceof TypedError && error.code === code
}

// Export all enhanced types
export type {
  NonEmptyString,
  PositiveNumber,
  NonNegativeNumber,
  URL as URLType,
  Email,
  UUID,
  ISO8601Date,
  APIResponse,
  APIError,
  PaginatedResponse,
  Product,
  Article,
  CaseStudy,
  FormField,
  FormValidation,
  ComponentProps,
  LoadingProps,
  ErrorBoundaryProps,
  UseAsyncState,
  UseFormState,
  ServiceConfig,
  CacheConfig,
  PerformanceMetrics,
  ComponentPerformanceData,
  EventHandler,
  AsyncEventHandler,
  RequireAtLeastOne,
  RequireExactlyOne,
  DeepPartial,
  DeepRequired,
  Branded,
  SafeJSONParse,
  Awaited,
  _NonNullable,
  Maybe,
  Either,
  Result,
  ConfigSchema
}