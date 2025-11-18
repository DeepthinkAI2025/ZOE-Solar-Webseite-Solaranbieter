import { useState, useEffect, useCallback, useMemo } from 'react'
import { notionService } from '../lib/notion/client'
import type { Article, Product, CaseStudy } from '../lib/types/notion'

// Generic type for Notion entities
type NotionEntity = Article | Product | CaseStudy

// Generic cache configuration
interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
}

// Simple in-memory cache
class EntityCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>()
  private config: CacheConfig

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config
  }

  set(key: string, data: T): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Generic hook factory for Notion entities
function createNotionEntityHook<T extends NotionEntity>(
  entityName: string,
  fetchMethod: () => Promise<T[]>,
  cache: EntityCache<T[]>,
  errorMessage: string
) {
  return function useNotionEntities() {
    const [entities, setEntities] = useState<T[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEntities = useCallback(async (forceRefresh = false) => {
      const cacheKey = entityName
      const cachedData = !forceRefresh ? cache.get(cacheKey) : null

      if (cachedData) {
        setEntities(cachedData)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchMethod()
        cache.set(cacheKey, data)
        setEntities(data)
        setError(null)
      } catch (err) {
        console.error(`Error fetching ${entityName}:`, err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }, [fetchMethod, cache, errorMessage])

    useEffect(() => {
      fetchEntities()
    }, [fetchEntities])

    const refetch = useCallback(() => {
      fetchEntities(true)
    }, [fetchEntities])

    const filterEntities = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
      return entities.filter(entity => entity[field] === value)
    }, [entities])

    const findEntity = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
      return entities.find(entity => entity[field] === value)
    }, [entities])

    const getPaginated = useCallback((page: number, pageSize: number) => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      return entities.slice(start, end)
    }, [entities])

    const searchEntities = useCallback((query: string, fields: (keyof T)[]) => {
      const lowercaseQuery = query.toLowerCase()
      return entities.filter(entity =>
        fields.some(field =>
          String(entity[field]).toLowerCase().includes(lowercaseQuery)
        )
      )
    }, [entities])

    return {
      entities,
      loading,
      error,
      refetch,
      filterEntities,
      findEntity,
      getPaginated,
      searchEntities
    }
  }
}

// Create caches for each entity type
const articleCache = new EntityCache<Article[]>({
  ttl: 10 * 60 * 1000, // 10 minutes for articles
  maxSize: 50
})

const productCache = new EntityCache<Product[]>({
  ttl: 15 * 60 * 1000, // 15 minutes for products
  maxSize: 30
})

const caseStudyCache = new EntityCache<CaseStudy[]>({
  ttl: 20 * 60 * 1000, // 20 minutes for case studies
  maxSize: 40
})

// Create specific hooks using the factory
export const useArticles = createNotionEntityHook(
  'articles',
  () => notionService.getArticles(),
  articleCache,
  'Artikel konnten nicht geladen werden'
)

export const useProducts = createNotionEntityHook(
  'products',
  () => notionService.getProducts(),
  productCache,
  'Produkte konnten nicht geladen werden'
)

export const useCaseStudies = createNotionEntityHook(
  'caseStudies',
  () => notionService.getCaseStudies(),
  caseStudyCache,
  'Fallstudien konnten nicht geladen werden'
)

// Specific hook for single entity with memoized filtering
export function useArticle(slug: string) {
  const { entities: articles, loading, error } = useArticles()

  const article = useMemo(() =>
    articles.find(article => article.slug === slug),
    [articles, slug]
  )

  return { article, loading, error }
}

export function useProductByCategory(category: string) {
  const { entities: products, loading, error, filterEntities } = useProducts()

  const filteredProducts = useMemo(() =>
    filterEntities('category', category.toLowerCase()),
    [products, category, filterEntities]
  )

  return { products: filteredProducts, loading, error }
}

export function useFeaturedProducts(limit: number = 3) {
  const { entities: products, loading, error } = useProducts()

  const featuredProducts = useMemo(() =>
    products
      .filter(product => product.featured)
      .slice(0, limit),
    [products, limit]
  )

  return { products: featuredProducts, loading, error }
}

export function useCaseStudy(slug: string) {
  const { entities: caseStudies, loading, error } = useCaseStudies()

  const caseStudy = useMemo(() =>
    caseStudies.find(study => study.slug === slug),
    [caseStudies, slug]
  )

  return { caseStudy, loading, error }
}

export function useCaseStudiesByCategory(category: 'residential' | 'commercial' | 'agricultural') {
  const { entities: caseStudies, loading, error, filterEntities } = useCaseStudies()

  const filteredCaseStudies = useMemo(() =>
    filterEntities('category', category),
    [caseStudies, category, filterEntities]
  )

  return { caseStudies: filteredCaseStudies, loading, error }
}

// Additional utility hooks for common patterns
export function usePaginatedArticles(page: number, pageSize: number = 10) {
  const { entities: articles, loading, error, getPaginated } = useArticles()

  const paginatedArticles = useMemo(() =>
    getPaginated(page, pageSize),
    [articles, page, pageSize, getPaginated]
  )

  const totalPages = useMemo(() =>
    Math.ceil(articles.length / pageSize),
    [articles.length, pageSize]
  )

  return {
    articles: paginatedArticles,
    loading,
    error,
    totalPages,
    totalArticles: articles.length
  }
}

export function useArticleSearch(query: string) {
  const { entities: articles, loading, error, searchEntities } = useArticles()

  const searchResults = useMemo(() =>
    query.trim() === ''
      ? articles
      : searchEntities(query, ['title', 'excerpt', 'category']),
    [articles, query, searchEntities]
  )

  return { articles: searchResults, loading, error }
}

// Cache management utilities
export const useCacheManagement = () => {
  const clearAllCaches = useCallback(() => {
    articleCache.clear()
    productCache.clear()
    caseStudyCache.clear()
  }, [])

  const getCacheStats = useCallback(() => ({
    articles: articleCache.size(),
    products: productCache.size(),
    caseStudies: caseStudyCache.size()
  }), [])

  return {
    clearAllCaches,
    getCacheStats
  }
}

export default {
  useArticles,
  useProducts,
  useCaseStudies,
  useArticle,
  useProductByCategory,
  useFeaturedProducts,
  useCaseStudy,
  useCaseStudiesByCategory,
  usePaginatedArticles,
  useArticleSearch,
  useCacheManagement
}