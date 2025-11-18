// 🎣 Erweiterte React Hooks für Notion CMS Integration
// Optimierte Datenabfragen mit Caching, Error Handling und Real-time Updates

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { cacheManager } from '../cache/cache-manager'
import { auditLogger } from '../security/audit-logger'
import { NotionClient } from '../notion/enhanced-client'

// ========== Hook Types ==========

interface UseNotionDataOptions<T = unknown> {
  cache?: boolean
  cacheKey?: string
  cacheTTL?: number
  revalidateOnFocus?: boolean
  revalidateOnReconnect?: boolean
  dedupingInterval?: number
  errorRetryCount?: number
  errorRetryInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseNotionMutationOptions<TData = unknown> {
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  invalidateQueries?: string[]
  optimisticUpdate?: boolean
}

interface NotionQuery {
  databaseId: string
  filter?: Record<string, unknown>
  sorts?: Array<{ property: string; direction: 'ascending' | 'descending' }>
  pageSize?: number
  startCursor?: string
}

// ========== Base Hook ==========

/**
 * Basis-Hook für Notion-Datenabfragen mit erweiterten Features
 */
function useNotionBase<T>(
  queryFn: () => Promise<T>,
  options: UseNotionDataOptions = {}
) {
  const {
    cache = true,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 Minuten
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    dedupingInterval = 2000,
    errorRetryCount = 3,
    errorRetryInterval = 1000,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)

  const queryKey = cacheKey || `notion_${Date.now()}_${Math.random()}`
  const retryCountRef = useRef(0)
  const isFetchingRef = useRef(false)
  const lastFetchTimeRef = useRef(0)

  const fetchData = useCallback(async (force = false) => {
    // Deduplication
    const now = Date.now()
    if (!force && now - lastFetchTimeRef.current < dedupingInterval) {
      return
    }

    // Cache prüfen
    if (cache && !force) {
      const cachedData = cacheManager.get<T>(queryKey)
      if (cachedData) {
        setData(cachedData)
        setIsLoading(false)
        setError(null)
        setLastUpdated(Date.now())
        return
      }
    }

    // Verhindere parallele Requests
    if (isFetchingRef.current) return
    isFetchingRef.current = true

    try {
      setIsLoading(true)
      setError(null)

      const result = await queryFn()
      
      // Cache speichern
      if (cache) {
        cacheManager.set(queryKey, result, cacheTTL)
      }

      setData(result)
      setLastUpdated(Date.now())
      retryCountRef.current = 0

      onSuccess?.(result)

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      
      // Retry Logic
      if (retryCountRef.current < errorRetryCount) {
        retryCountRef.current++
        setTimeout(() => {
          fetchData(true)
        }, errorRetryInterval * retryCountRef.current)
      } else {
        onError?.(error)
      }
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
      lastFetchTimeRef.current = now
    }
  }, [queryFn, cache, queryKey, cacheTTL, dedupingInterval, errorRetryCount, errorRetryInterval, onSuccess, onError])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Revalidation on focus
  useEffect(() => {
    if (!revalidateOnFocus) return

    const handleFocus = () => {
      fetchData(true)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchData, revalidateOnFocus])

  // Revalidation on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return

    const handleOnline = () => {
      fetchData(true)
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [fetchData, revalidateOnReconnect])

  // Cache invalidation listener
  useEffect(() => {
    const handleCacheInvalidation = (event: CustomEvent) => {
      const { pattern } = event.detail
      if (pattern && queryKey.includes(pattern)) {
        fetchData(true)
      }
    }

    window.addEventListener('cacheInvalidated', handleCacheInvalidation as EventListener)
    return () => window.removeEventListener('cacheInvalidated', handleCacheInvalidation as EventListener)
  }, [queryKey, fetchData])

  const refetch = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch
  }
}

// ========== Specific Hooks ==========

/**
 * Blog-Artikel abrufen mit erweiterten Features
 */
export function useNotionBlog(options: UseNotionDataOptions & {
  category?: string
  limit?: number
  featured?: boolean
} = {}) {
  const { category, limit = 10, featured = false, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_BLOG_DB_ID!,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          ...(category ? [{ property: 'Category', select: { equals: category } }] : []),
          ...(featured ? [{ property: 'Featured', checkbox: { equals: true } }] : [])
        ]
      },
      sorts: [{ property: 'Published Date', direction: 'descending' }],
      pageSize: limit
    }

    const result = await client.queryDatabase(query)
    
    // Audit logging
    auditLogger.logDataAccess({
      resource: 'blog_articles',
      action: 'read',
      dataType: 'public',
      recordCount: result.results.length,
      endpoint: '/api/notion/blog',
      method: 'GET'
    })

    return result.results
  }, [category, limit, featured])

  return useNotionBase(queryFn, {
    cacheKey: `blog_${category || 'all'}_${limit}_${featured}`,
    ...baseOptions
  })
}

/**
 * Produktdaten abrufen
 */
export function useNotionProducts(options: UseNotionDataOptions & {
  category?: string
  featured?: boolean
  limit?: number
} = {}) {
  const { category, featured = false, limit = 20, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID!,
      filter: {
        and: [
          { property: 'Active', checkbox: { equals: true } },
          ...(category ? [{ property: 'Category', select: { equals: category } }] : []),
          ...(featured ? [{ property: 'Featured', checkbox: { equals: true } }] : [])
        ]
      },
      sorts: [{ property: 'Name', direction: 'ascending' }],
      pageSize: limit
    }

    const result = await client.queryDatabase(query)
    
    auditLogger.logDataAccess({
      resource: 'products',
      action: 'read',
      dataType: 'public',
      recordCount: result.results.length,
      endpoint: '/api/notion/products',
      method: 'GET'
    })

    return result.results
  }, [category, featured, limit])

  return useNotionBase(queryFn, {
    cacheKey: `products_${category || 'all'}_${limit}_${featured}`,
    cacheTTL: 30 * 60 * 1000, // 30 Minuten für Produktdaten
    ...baseOptions
  })
}

/**
 * FAQ-Daten abrufen
 */
export function useNotionFAQ(options: UseNotionDataOptions & {
  category?: string
  search?: string
} = {}) {
  const { category, search, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_FAQ_DB_ID!,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          ...(category ? [{ property: 'Category', select: { equals: category } }] : []),
          ...(search ? [{
            or: [
              { property: 'Question', rich_text: { contains: search } },
              { property: 'Answer', rich_text: { contains: search } }
            ]
          }] : [])
        ]
      },
      sorts: [{ property: 'Order', direction: 'ascending' }],
      pageSize: 100
    }

    const result = await client.queryDatabase(query)
    
    auditLogger.logDataAccess({
      resource: 'faq',
      action: 'read',
      dataType: 'public',
      recordCount: result.results.length,
      endpoint: '/api/notion/faq',
      method: 'GET'
    })

    return result.results
  }, [category, search])

  return useNotionBase(queryFn, {
    cacheKey: `faq_${category || 'all'}_${search || 'none'}`,
    cacheTTL: 60 * 60 * 1000, // 1 Stunde für FAQ
    ...baseOptions
  })
}

/**
 * Team-Mitglieder abrufen
 */
export function useNotionTeam(options: UseNotionDataOptions & {
  department?: string
  featured?: boolean
} = {}) {
  const { department, featured = false, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_TEAM_DB_ID!,
      filter: {
        and: [
          { property: 'Active', checkbox: { equals: true } },
          ...(department ? [{ property: 'Department', select: { equals: department } }] : []),
          ...(featured ? [{ property: 'Featured', checkbox: { equals: true } }] : [])
        ]
      },
      sorts: [{ property: 'Name', direction: 'ascending' }],
      pageSize: 50
    }

    const result = await client.queryDatabase(query)
    
    auditLogger.logDataAccess({
      resource: 'team',
      action: 'read',
      dataType: 'private',
      recordCount: result.results.length,
      endpoint: '/api/notion/team',
      method: 'GET'
    })

    return result.results
  }, [department, featured])

  return useNotionBase(queryFn, {
    cacheKey: `team_${department || 'all'}_${featured}`,
    cacheTTL: 2 * 60 * 60 * 1000, // 2 Stunden für Team-Daten
    ...baseOptions
  })
}

/**
 * Standorte abrufen
 */
export function useNotionLocations(options: UseNotionDataOptions & {
  region?: string
  type?: string
} = {}) {
  const { region, type, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_LOCATIONS_DB_ID!,
      filter: {
        and: [
          { property: 'Active', checkbox: { equals: true } },
          ...(region ? [{ property: 'Region', select: { equals: region } }] : []),
          ...(type ? [{ property: 'Type', select: { equals: type } }] : [])
        ]
      },
      sorts: [{ property: 'Name', direction: 'ascending' }],
      pageSize: 100
    }

    const result = await client.queryDatabase(query)
    
    auditLogger.logDataAccess({
      resource: 'locations',
      action: 'read',
      dataType: 'public',
      recordCount: result.results.length,
      endpoint: '/api/notion/locations',
      method: 'GET'
    })

    return result.results
  }, [region, type])

  return useNotionBase(queryFn, {
    cacheKey: `locations_${region || 'all'}_${type || 'all'}`,
    cacheTTL: 24 * 60 * 60 * 1000, // 24 Stunden für Standorte
    ...baseOptions
  })
}

/**
 * Bildergalerie abrufen
 */
export function useNotionGallery(options: UseNotionDataOptions & {
  category?: string
  featured?: boolean
  limit?: number
} = {}) {
  const { category, featured = false, limit = 20, ...baseOptions } = options

  const queryFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const query: NotionQuery = {
      databaseId: process.env.NEXT_PUBLIC_NOTION_GALLERY_DB_ID!,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          ...(category ? [{ property: 'Category', select: { equals: category } }] : []),
          ...(featured ? [{ property: 'Featured', checkbox: { equals: true } }] : [])
        ]
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
      pageSize: limit
    }

    const result = await client.queryDatabase(query)
    
    auditLogger.logDataAccess({
      resource: 'gallery',
      action: 'read',
      dataType: 'public',
      recordCount: result.results.length,
      endpoint: '/api/notion/gallery',
      method: 'GET'
    })

    return result.results
  }, [category, featured, limit])

  return useNotionBase(queryFn, {
    cacheKey: `gallery_${category || 'all'}_${limit}_${featured}`,
    cacheTTL: 12 * 60 * 60 * 1000, // 12 Stunden für Galerie
    ...baseOptions
  })
}

// ========== Mutation Hooks ==========

/**
 * Basis-Mutation Hook
 */
function useNotionMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseNotionMutationOptions = {}
) {
  const [data, setData] = useState<TData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const {
    onSuccess,
    onError,
    invalidateQueries = [],
    optimisticUpdate = false
  } = options

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setIsLoading(true)
      setError(null)

      // Optimistic update
      if (optimisticUpdate) {
        // Hier könnte optimistic update implementiert werden
      }

      const result = await mutationFn(variables)
      
      setData(result)
      
      // Cache invalidieren
      invalidateQueries.forEach(queryKey => {
        cacheManager.clear(queryKey)
      })

      onSuccess?.(result)

      return result

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Mutation failed')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn, onSuccess, onError, invalidateQueries, optimisticUpdate])

  return {
    mutate,
    data,
    isLoading,
    error
  }
}

/**
 * Blog-Artikel erstellen/bearbeiten
 */
export function useNotionBlogMutation() {
  const client = NotionClient.getInstance()

  return useNotionMutation(
    async (data: {
      title: string
      content: string
      category?: string
      featured?: boolean
      published?: boolean
    }) => {
      auditLogger.logDataAccess({
        resource: 'blog_articles',
        action: 'write',
        dataType: 'private',
        endpoint: '/api/notion/blog',
        method: 'POST'
      })

      return await client.createPage({
        parent: { database_id: process.env.NEXT_PUBLIC_NOTION_BLOG_DB_ID! },
        properties: {
          'Title': { title: [{ text: { content: data.title } }] },
          'Category': data.category ? { select: { name: data.category } } : undefined,
          'Featured': data.featured ? { checkbox: true } : undefined,
          'Published': data.published ? { checkbox: true } : undefined
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: data.content } }]
            }
          }
        ]
      })
    },
    {
      invalidateQueries: ['blog_'],
      onSuccess: () => {
        // Cache invalidieren
        cacheManager.invalidate('blog_')
      }
    }
  )
}

/**
 * Produkt erstellen/bearbeiten
 */
export function useNotionProductMutation() {
  const client = NotionClient.getInstance()

  return useNotionMutation(
    async (data: {
      name: string
      description: string
      price?: number
      category?: string
      featured?: boolean
      active?: boolean
    }) => {
      auditLogger.logDataAccess({
        resource: 'products',
        action: 'write',
        dataType: 'private',
        endpoint: '/api/notion/products',
        method: 'POST'
      })

      return await client.createPage({
        parent: { database_id: process.env.NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID! },
        properties: {
          'Name': { title: [{ text: { content: data.name } }] },
          'Description': { rich_text: [{ text: { content: data.description } }] },
          'Price': data.price ? { number: data.price } : undefined,
          'Category': data.category ? { select: { name: data.category } } : undefined,
          'Featured': data.featured ? { checkbox: true } : undefined,
          'Active': data.active ? { checkbox: true } : undefined
        }
      })
    },
    {
      invalidateQueries: ['products_'],
      onSuccess: () => {
        cacheManager.invalidate('products_')
      }
    }
  )
}

// ========== Utility Hooks ==========

/**
 * Suche in Notion-Datenbanken
 */
export function useNotionSearch(query: string, options: UseNotionDataOptions & {
  databases?: string[]
} = {}) {
  const { databases = [], ...baseOptions } = options

  const searchFn = useCallback(async () => {
    const client = NotionClient.getInstance()
    
    const results = await client.search(query, {
      filter: {
        value: 'database',
        property: 'object'
      }
    })

    auditLogger.logDataAccess({
      resource: 'search',
      action: 'read',
      dataType: 'public',
      recordCount: results.results.length,
      endpoint: '/api/notion/search',
      method: 'GET'
    })

    return results.results
  }, [query, databases])

  return useNotionBase(searchFn, {
    cacheKey: `search_${query}`,
    cacheTTL: 5 * 60 * 1000, // 5 Minuten für Suchergebnisse
    ...baseOptions
  })
}

/**
 * Real-time Updates für Notion-Daten
 */
export function useNotionRealtime(databaseId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [updates, setUpdates] = useState<Record<string, unknown>[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connect = () => {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `wss://${window.location.host}`
      const ws = new WebSocket(`${wsUrl}/notion-updates?databaseId=${databaseId}`)
      
      ws.onopen = () => {
        setIsConnected(true)
        console.log('🔗 Connected to Notion realtime updates')
      }
      
      ws.onmessage = (event) => {
        const update = JSON.parse(event.data)
        setUpdates(prev => [update, ...prev.slice(0, 99)]) // Keep last 100 updates
        
        // Cache invalidieren
        cacheManager.invalidate(`notion_${databaseId}`)
      }
      
      ws.onclose = () => {
        setIsConnected(false)
        // Reconnect nach 5 Sekunden
        setTimeout(connect, 5000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      wsRef.current = ws
    }

    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [databaseId])

  const clearUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  return {
    isConnected,
    updates,
    clearUpdates
  }
}

/**
 * Performance-optimierte Pagination
 */
export function useNotionPagination<T>(
  queryFn: (cursor?: string) => Promise<{ results: T[]; hasMore: boolean; nextCursor?: string }>,
  options: UseNotionDataOptions & {
    pageSize?: number
    maxPages?: number
  } = {}
) {
  const { pageSize: _pageSize = 20, maxPages = 10, ..._baseOptions } = options
  
  const [pages, setPages] = useState<T[][]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const nextCursorRef = useRef<string | undefined>(undefined)

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || currentPage >= maxPages) return

    setIsLoadingMore(true)
    setError(null)

    try {
      const result = await queryFn(nextCursorRef.current)
      
      setPages(prev => [...prev, result.results])
      setHasMore(result.hasMore)
      nextCursorRef.current = result.nextCursor
      setCurrentPage(prev => prev + 1)

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more'))
    } finally {
      setIsLoadingMore(false)
    }
  }, [queryFn, isLoadingMore, hasMore, currentPage, maxPages])

  const reset = useCallback(() => {
    setPages([])
    setHasMore(true)
    setCurrentPage(0)
    nextCursorRef.current = undefined
    setError(null)
  }, [])

  const data = useMemo(() => pages.flat(), [pages])

  return {
    data,
    pages,
    hasMore,
    isLoadingMore,
    error,
    currentPage,
    loadMore,
    reset
  }
}

// ========== Export ==========

export default {
  useNotionBlog,
  useNotionProducts,
  useNotionFAQ,
  useNotionTeam,
  useNotionLocations,
  useNotionGallery,
  useNotionBlogMutation,
  useNotionProductMutation,
  useNotionSearch,
  useNotionRealtime,
  useNotionPagination
}