// 🗃️ Erweiterte Cache-Manager-Klasse für ZOE Solar CMS
// Unterstützt Memory Cache, KV Cache, ETag-Validierung und Real-time Updates

interface CacheEntry<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  etag?: string
  size: number // Größe in Bytes (ungefähr)
}

interface CacheStats {
  hits: number
  misses: number
  size: number
  entryCount: number
  hitRate: number
}

interface CacheConfig {
  maxSize: number // Maximale Cache-Größe in MB
  defaultTTL: number // Standard TTL in Millisekunden
  gcInterval: number // Garbage Collection Intervall in ms
  enableKV: boolean // KV-Cache aktivieren
}

interface KVClient {
  set: (key: string, value: unknown, options?: { ex?: number }) => Promise<unknown>
  get: (key: string) => Promise<unknown>
  del: (...keys: string[]) => Promise<unknown>
  keys: (pattern: string) => Promise<string[]>
}

export class CacheManager {
  private static instance: CacheManager
  private memoryCache = new Map<string, CacheEntry>()
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    entryCount: 0,
    hitRate: 0
  }
  private config: CacheConfig
  private gcTimer?: NodeJS.Timeout
  private kvClient?: KVClient
  
  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: config?.maxSize || 50, // 50MB Default
      defaultTTL: config?.defaultTTL || 5 * 60 * 1000, // 5 Minuten
      gcInterval: config?.gcInterval || 60 * 1000, // 1 Minute
      enableKV: config?.enableKV || false
    }
    
    this.initKVClient()
    this.startGarbageCollection()
  }
  
  public static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config)
    }
    return CacheManager.instance
  }

  private initKVClient() {
    if (typeof window === 'undefined' && this.config.enableKV) {
      try {
        // Vercel KV Client
        const { createClient } = require('@vercel/kv')
        this.kvClient = createClient(
          process.env.KV_REST_API_URL,
          process.env.KV_REST_API_TOKEN
        )
      } catch (error) {
        console.warn('⚠️ KV Client could not be initialized:', error)
      }
    }
  }

  // ========== Cache-Operationen ==========

  /**
   * Daten im Cache speichern
   */
  set<T>(key: string, data: T, ttl?: number, options?: {
    etag?: boolean
    priority?: 'low' | 'normal' | 'high'
    tags?: string[]
  }): void {
    const actualTTL = ttl || this.config.defaultTTL
    const now = Date.now()
    
    // Cache-Eintrag erstellen
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: actualTTL,
      etag: options?.etag ? this.generateETag(data) : undefined,
      size: this.estimateSize(data)
    }

    // Alten Eintrag entfernen
    this.remove(key)

    // Cache-Größe prüfen
    if (this.shouldEvict(entry.size)) {
      this.evictLRU()
    }

    // Neuen Eintrag hinzufügen
    this.memoryCache.set(key, entry)
    this.updateStats(entry, 'add')

    // KV Cache (für persistente Daten)
    if (this.kvClient && this.shouldPersistToKV(options)) {
      this.persistToKV(key, entry, actualTTL)
    }

    // Debug-Ausgabe
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache SET: ${key} (TTL: ${actualTTL}ms, Size: ${entry.size} bytes)`)
    }
  }

  /**
   * Daten aus Cache abrufen
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined
    
    if (!entry) {
      // KV Cache versuchen - aber synchron zurückgeben
      // Note: KV Cache wird asynchron behandelt, hier nur Memory Cache
      this.stats.misses++
      this.updateHitRate()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Cache MISS: ${key}`)
      }
      
      return null
    }

    // TTL prüfen
    if (this.isExpired(entry)) {
      this.delete(key)
      this.stats.misses++
      this.updateHitRate()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏰ Cache EXPIRED: ${key}`)
      }
      
      return null
    }

    // Cache Hit
    this.stats.hits++
    this.updateHitRate()
    
    // Access Order für LRU aktualisieren
    this.updateAccessOrder(key)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Cache HIT: ${key}`)
    }
    
    return entry.data
  }

  /**
   * Prüfen ob ein Schlüssel existiert und nicht abgelaufen ist
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key)
    if (!entry) return false
    
    return !this.isExpired(entry)
  }

  /**
   * Cache-Eintrag löschen
   */
  delete(key: string): boolean {
    const entry = this.memoryCache.get(key)
    if (!entry) return false
    
    this.remove(key)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Cache DELETE: ${key}`)
    }
    
    return true
  }

  /**
   * Alle Einträge mit Pattern löschen
   */
  clear(pattern?: string): void {
    if (!pattern) {
      // Gesamten Cache leeren
      this.stats = {
        hits: 0,
        misses: 0,
        size: 0,
        entryCount: 0,
        hitRate: 0
      }
      this.memoryCache.clear()
      
      // KV Cache leeren (falls konfiguriert)
      if (this.kvClient) {
        this.clearKVCache()
      }
      
      console.log('🗑️ Cache komplett geleert')
      return
    }

    // Pattern-basiertes Löschen
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    const keysToDelete: string[] = []
    
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }
    
    for (const key of keysToDelete) {
      this.remove(key)
    }
    
    console.log(`🗑️ Cache geleert für Pattern: ${pattern} (${keysToDelete.length} Einträge)`)
  }

  /**
   * Cache-Pattern invalidieren (für Webhooks)
   */
  invalidate(pattern: string, metadata?: unknown): void {
    console.log(`🔄 Cache Invalidierung: ${pattern}`)
    
    this.clear(pattern)
    
    // Real-time Benachrichtigung an Clients
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cacheInvalidated', {
        detail: { pattern, metadata, timestamp: Date.now() }
      }))
    }
    
    // WebSocket-Benachrichtigung (falls konfiguriert)
    this.broadcastInvalidation(pattern, metadata)
  }

  // ========== Erweiterte Features ==========

  /**
   * ETag für bedingte Requests
   */
  getETag(key: string): string | null {
    const entry = this.memoryCache.get(key)
    return entry?.etag || null
  }

  /**
   * Cache-Wärmung (Preloading)
   */
  async warmCache(keys: Array<{key: string, fetcher: () => Promise<unknown>}>): Promise<void> {
    console.log(`🔥 Warmup Cache für ${keys.length} Keys...`)
    
    const promises = keys.map(async ({ key, fetcher }) => {
      if (!this.has(key)) {
        try {
          const data = await fetcher()
          this.set(key, data)
          console.log(`✅ Cache warmed: ${key}`)
        } catch (error) {
          console.warn(`⚠️ Cache warmup failed for ${key}:`, error)
        }
      }
    })
    
    await Promise.allSettled(promises)
    console.log('🔥 Cache Warmup abgeschlossen')
  }

  /**
   * Cache-Statistiken abrufen
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * Cache-Informationen für Debugging
   */
  getDebugInfo() {
    const entries = Array.from(this.memoryCache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      size: entry.size,
      expired: this.isExpired(entry)
    }))
    
    return {
      config: this.config,
      stats: this.stats,
      entries: entries.sort((a, b) => a.key.localeCompare(b.key))
    }
  }

  // ========== Private Methoden ==========

  private remove(key: string): void {
    const entry = this.memoryCache.get(key)
    if (entry) {
      this.updateStats(entry, 'remove')
      this.memoryCache.delete(key)
    }
  }

  private shouldEvict(newEntrySize: number): boolean {
    return (this.stats.size + newEntrySize) > (this.config.maxSize * 1024 * 1024)
  }

  private evictLRU(): void {
    if (this.memoryCache.size === 0) return
    
    // Least Recently Used Entry finden
    let lruKey = ''
    let lruTime = Date.now()
    
    // Access Order aus Timestamp ableiten (vereinfacht)
    for (const [key, entry] of this.memoryCache) {
      if (entry.timestamp < lruTime) {
        lruTime = entry.timestamp
        lruKey = key
      }
    }
    
    if (lruKey) {
      this.remove(lruKey)
      console.log(`🗑️ LRU Eviction: ${lruKey}`)
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  private updateStats(entry: CacheEntry, operation: 'add' | 'remove'): void {
    if (operation === 'add') {
      this.stats.size += entry.size
      this.stats.entryCount++
    } else {
      this.stats.size -= entry.size
      this.stats.entryCount--
    }
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
  }

  private updateAccessOrder(key: string): void {
    // Access Order aktualisieren (vereinfacht durch Timestamp-Update)
    const entry = this.memoryCache.get(key)
    if (entry) {
      entry.timestamp = Date.now()
    }
  }

  private generateETag(data: unknown): string {
    const crypto = require('crypto')
    const content = typeof data === 'string' ? data : JSON.stringify(data)
    return crypto.createHash('md5').update(content).digest('hex')
  }

  private estimateSize(data: unknown): number {
    try {
      const serialized = JSON.stringify(data)
      return new Blob([serialized]).size
    } catch (_error) {
      // Fallback für nicht-serialisierbare Daten
      return 1024 // 1KB Default
    }
  }

  private shouldPersistToKV(options?: { priority?: 'low' | 'normal' | 'high'; tags?: string[] }): boolean {
    // Persistiere zu KV für:
    // - Sensible Daten (Kunden, Mitarbeiter)
    // - Langlebige Daten (API-Responses, Bilder-Metadaten)
    // - Hohe Priorität Daten
    if (!options) return false
    
    return (options.priority === 'high') || 
           options.tags?.includes('persistent') ||
           options.tags?.includes('sensitive')
  }

  // ========== KV Cache Methoden ==========

  private async persistToKV(key: string, entry: CacheEntry, ttl: number): Promise<void> {
    if (!this.kvClient) return
    
    try {
      const kvKey = `cache:${key}`
      await this.kvClient.set(kvKey, {
        ...entry,
        data: JSON.stringify(entry.data) // Daten serialisieren
      }, { ex: Math.floor(ttl / 1000) }) // TTL in Sekunden
      
      console.log(`💾 Persisted to KV: ${key}`)
    } catch (error) {
      console.warn(`⚠️ KV persistence failed for ${key}:`, error)
    }
  }

  private async getFromKV<T>(key: string): Promise<T | null> {
    if (!this.kvClient) return null
    
    try {
      const kvKey = `cache:${key}`
      const kvData = await this.kvClient.get(kvKey)
      
      if (!kvData) return null
      
      const entry = typeof kvData === 'string' ? JSON.parse(kvData) : kvData
      
      // TTL prüfen
      if (this.isExpired(entry)) {
        await this.kvClient.del(kvKey)
        return null
      }
      
      // Daten deserialisieren
      const data = typeof entry.data === 'string' ? JSON.parse(entry.data) : entry.data
      
      // In Memory Cache laden (für zukünftige Zugriffe)
      this.memoryCache.set(key, {
        ...entry,
        data,
        timestamp: Date.now() // Timestamp aktualisieren
      })
      
      this.stats.hits++
      this.updateHitRate()
      
      console.log(`💾 Retrieved from KV: ${key}`)
      return data
      
    } catch (error) {
      console.warn(`⚠️ KV retrieval failed for ${key}:`, error)
      return null
    }
  }

  private async clearKVCache(): Promise<void> {
    if (!this.kvClient) return
    
    try {
      // Alle Cache-Keys abrufen und löschen
      const keys = await this.kvClient.keys('cache:*')
      if (keys.length > 0) {
        await this.kvClient.del(...keys)
        console.log(`🗑️ Cleared ${keys.length} KV cache entries`)
      }
    } catch (error) {
      console.warn('⚠️ KV cache clear failed:', error)
    }
  }

  // ========== Garbage Collection ==========

  private startGarbageCollection(): void {
    this.gcTimer = setInterval(() => {
      this.runGarbageCollection()
    }, this.config.gcInterval)
  }

  private runGarbageCollection(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    // Abgelaufene Einträge finden
    for (const [key, entry] of this.memoryCache) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key)
      }
    }
    
    // Abgelaufene Einträge entfernen
    for (const key of expiredKeys) {
      this.remove(key)
    }
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 GC: Removed ${expiredKeys.length} expired entries`)
    }
  }

  public stopGarbageCollection(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer)
      this.gcTimer = undefined
    }
  }

  // ========== Real-time Features ==========

  private broadcastInvalidation(pattern: string, metadata?: unknown): void {
    if (typeof window === 'undefined') return
    
    // WebSocket für Real-time Updates
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
      const ws = new WebSocket(`${wsUrl}/cache-updates`)
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'INVALIDATE',
          pattern,
          metadata
        }))
        ws.close()
      }
    } catch (error) {
      console.warn('⚠️ WebSocket broadcast failed:', error)
    }
  }

  // ========== Cleanup ==========

  public destroy(): void {
    this.stopGarbageCollection()
    this.memoryCache.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      entryCount: 0,
      hitRate: 0
    }
  }
}

// Singleton Instance
export const cacheManager = CacheManager.getInstance()

// Globaler Cache-Clearing für Webhook-Updates
if (typeof window !== 'undefined') {
  // Cache-Invalidation Events von außen abfangen
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'CACHE_INVALIDATE') {
      cacheManager.invalidate(event.data.pattern, event.data.metadata)
    }
  })
}

export default CacheManager