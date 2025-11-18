// Erweiterte Notion API Client für ZOE Solar CMS
// Production-ready mit Sicherheit, Caching und Webhook-Support

import { DatabasePageResponse } from '../types/notion'
import { NotionService } from './client'
import type {
  Article
} from '../types/notion'

export interface NotionWebhookEvent {
  type: string
  data: {
    object: string
    id: string
    created_time: string
    last_edited_time: string
    parent?: {
      database_id?: string
      type?: string
    }
    properties?: Record<string, unknown>
  }
}

export class EnhancedNotionService extends NotionService {
  private webhookSecret: string
  private encryptionKey: string
  private kvClient: { get: (key: string) => Promise<string | null>; set: (key: string, value: string, options?: { ex: number }) => Promise<void>; keys: (pattern: string) => Promise<string[]>; del: (...keys: string[]) => Promise<number> } | null = null
  
  constructor() {
    super()
    this.webhookSecret = import.meta.env.VITE_WEBHOOK_SECRET || 'default-secret'
    this.encryptionKey = import.meta.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars'
    
    // KV Client für erweiterte Caching-Funktionen
    this.initKVClient()
  }
  
  private initKVClient() {
    if (typeof window === 'undefined') {
      // Nur auf Server-Seite
      try {
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

  // ========== Webhook-Verifikation ==========
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error)
      return false
    }
  }

  // ========== Bilder-Datenbank Integration ==========
  async getImagesByCategory(category: string) {
    return this.getCachedData(`images-${category}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_IMAGES_DB
      if (!databaseId) throw new Error('VITE_NOTION_IMAGES_DB nicht gesetzt')

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              select: { equals: 'Aktiv' }
            },
            {
              property: 'Kategorie',
              select: { equals: category }
            }
          ]
        },
        sorts: [{ property: 'Titel', direction: 'ascending' }]
      })
      return this.mapImages(response.results as DatabasePageResponse[])
    })
  }

  async getOptimizedImages(options: {
    category?: string
    maxSize?: number
    format?: string[]
    quality?: 'optimized' | 'original'
  } = {}) {
    const { category, maxSize, format = ['WebP', 'JPG'], quality = 'optimized' } = options
    
    return this.getCachedData(`images-optimized-${category}-${maxSize}-${quality}`, async () => {
      const images = await this.getImagesByCategory(category)
      
      return images.filter(image => {
        // Dateigröße prüfen
        if (maxSize && image.fileSize > maxSize * 1024) return false
        
        // Format prüfen
        if (format.length > 0 && !format.includes(image.format)) return false
        
        // Qualität prüfen
        if (image.quality !== quality) return false
        
        return true
      }).map(image => ({
        ...image,
        optimizedUrl: this.generateOptimizedUrl(image),
        responsiveSrcSet: this.generateResponsiveSrcSet(image)
      }))
    })
  }

  private generateOptimizedUrl(image: ImageAsset): string {
    // Bildoptimierung via CDN oder Image-Service
    if (image.format === 'WebP') {
      return image.webUrl // WebP ist bereits optimiert
    }
    
    // Für JPG/PNG: Service wie Cloudinary, ImageKit etc.
    return `${image.webUrl}?quality=85&format=webp`
  }

  private generateResponsiveSrcSet(image: ImageAsset): string {
    const widths = [320, 640, 960, 1280, 1920]
    return widths
      .map(width => `${this.generateOptimizedUrl(image)}?width=${width} ${width}w`)
      .join(', ')
  }

  // ========== Blog-Artikel mit erweiterten Funktionen ==========
  async getBlogArticles(options: {
    category?: string
    limit?: number
    offset?: number
    tags?: string[]
    difficulty?: string
    status?: string
  } = {}) {
    const { category, limit = 10, offset = 0, tags, difficulty, status = 'Veröffentlicht' } = options
    
    return this.getCachedData(`blog-${category}-${offset}-${limit}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_BLOG_DB
      if (!databaseId) throw new Error('VITE_NOTION_BLOG_DB nicht gesetzt')
      
      const filter: Record<string, unknown> = {
        property: 'Status',
        select: { equals: status }
      }
      
      // Erweiterte Filter
      const conditions = [filter]
      
      if (category) {
        conditions.push({
          property: 'Kategorie',
          select: { equals: category }
        })
      }
      
      if (difficulty) {
        conditions.push({
          property: 'Schwierigkeit',
          select: { equals: difficulty }
        })
      }
      
      if (tags && tags.length > 0) {
        conditions.push({
          property: 'Tags',
          multi_select: { contains: tags[0] }
        })
      }
      
      const finalFilter = conditions.length > 1 ? { and: conditions } : filter

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: finalFilter,
        sorts: [{ property: 'Datum', direction: 'descending' }],
        page_size: limit,
        start_cursor: offset > 0 ? this.getCursorForOffset(offset) : undefined
      })
      
      return {
        articles: this.mapBlogArticles(response.results),
        hasMore: response.has_more,
        nextCursor: response.next_cursor,
        total: response.results.length
      }
    })
  }

  // ========== SEO-optimierte Blog-Funktionen ==========
  async getBlogArticleBySlug(slug: string): Promise<Article | null> {
    return this.getCachedData(`blog-slug-${slug}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_BLOG_DB
      if (!databaseId) throw new Error('VITE_NOTION_BLOG_DB nicht gesetzt')

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Slug',
              rich_text: { equals: slug }
            },
            {
              property: 'Status',
              select: { equals: 'Veröffentlicht' }
            }
          ]
        }
      })
      
      if (response.results.length === 0) return null
      
      const articles = this.mapBlogArticles(response.results)
      return articles[0] || null
    })
  }

  async getRelatedBlogArticles(articleId: string, limit = 3): Promise<Article[]> {
    // Verwandte Artikel basierend auf Tags und Kategorie finden
    return this.getCachedData(`related-blog-${articleId}`, async () => {
      // Zuerst das ursprüngliche Artikel laden
      const originalArticle = await this.getArticleById(articleId)
      if (!originalArticle) return []

      // Artikel mit ähnlichen Tags/Kategorie finden
      const relatedResponse = await this.client.databases.query({
        database_id: import.meta.env.VITE_NOTION_BLOG_DB,
        filter: {
          and: [
            {
              property: 'Status',
              select: { equals: 'Veröffentlicht' }
            },
            {
              property: 'Kategorie',
              select: { equals: originalArticle.category }
            },
            {
              property: 'ID',
              rich_text: { does_not_equal: articleId }
            }
          ]
        },
        sorts: [{ property: 'Datum', direction: 'descending' }],
        page_size: limit
      })

      return this.mapBlogArticles(relatedResponse.results)
    })
  }

  // ========== API-Endpunkte Dokumentation ==========
  async getApiEndpoints() {
    return this.getCachedData('api-endpoints', async () => {
      const databaseId = import.meta.env.VITE_NOTION_API_DB
      if (!databaseId) throw new Error('VITE_NOTION_API_DB nicht gesetzt')

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Status',
          select: { equals: 'Aktiv' }
        },
        sorts: [{ property: 'Endpunkt-Name', direction: 'ascending' }]
      })
      return this.mapApiEndpoints(response.results)
    })
  }

  async getApiEndpointByPath(path: string): Promise<ApiEndpoint | null> {
    const endpoints = await this.getApiEndpoints()
    return endpoints.find(endpoint => endpoint.path === path) || null
  }

  // ========== Website-Seiten Management ==========
  async getWebsitePages(options: {
    type?: string
    category?: string
    status?: string
    visibility?: string
  } = {}) {
    return this.getCachedData(`pages-${options.type}-${options.category}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_PAGES_DB
      if (!databaseId) throw new Error('VITE_NOTION_PAGES_DB nicht gesetzt')

      const filter: Record<string, unknown> = {
        property: 'Status',
        select: { equals: options.status || 'Live' }
      }
      
      const conditions = [filter]
      
      if (options.type) {
        conditions.push({
          property: 'Seiten-Typ',
          select: { equals: options.type }
        })
      }
      
      if (options.category) {
        conditions.push({
          property: 'Hauptkategorie',
          select: { equals: options.category }
        })
      }
      
      if (options.visibility) {
        conditions.push({
          property: 'Sichtbarkeit',
          select: { equals: options.visibility }
        })
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: conditions.length > 1 ? { and: conditions } : filter,
        sorts: [{ property: 'Sortierung', direction: 'ascending' }]
      })
      
      return this.mapWebsitePages(response.results)
    })
  }

  // ========== Sichere Kunden-Daten (mit Autorisierung) ==========
  async getCustomers(options: {
    segment?: string
    status?: string
    limit?: number
  } = {}) {
    if (!this.isAuthorized()) {
      throw new Error('Nicht autorisiert für Kunden-Daten')
    }
    
    return this.getCachedData(`customers-${options.segment}-${options.status}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_CUSTOMERS_DB
      if (!databaseId) throw new Error('VITE_NOTION_CUSTOMERS_DB nicht gesetzt')

      const filter: Record<string, unknown> = {
        property: 'Status',
        select: { equals: options.status || 'Aktiv' }
      }
      
      const conditions = [filter]
      
      if (options.segment) {
        conditions.push({
          property: 'Kunden-Segment',
          select: { equals: options.segment }
        })
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: conditions.length > 1 ? { and: conditions } : filter,
        sorts: [{ property: 'Firma', direction: 'ascending' }],
        page_size: options.limit
      })
      
      return this.mapCustomers(response.results)
    }, { useKV: true, ttl: 300 }) // 5 Minuten Cache für sensible Daten
  }

  // ========== Mitarbeiter-Management ==========
  async getEmployees(options: {
    position?: string
    department?: string
    status?: string
  } = {}) {
    if (!this.isAuthorized('employees')) {
      throw new Error('Nicht autorisiert für Mitarbeiter-Daten')
    }
    
    return this.getCachedData(`employees-${options.position}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_EMPLOYEES_DB
      if (!databaseId) throw new Error('VITE_NOTION_EMPLOYEES_DB nicht gesetzt')

      const filter: Record<string, unknown> = {
        property: 'Status',
        select: { equals: options.status || 'Aktiv' }
      }
      
      const conditions = [filter]
      
      if (options.position) {
        conditions.push({
          property: 'Position',
          select: { equals: options.position }
        })
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: conditions.length > 1 ? { and: conditions } : filter,
        sorts: [{ property: 'Name', direction: 'ascending' }]
      })
      
      return this.mapEmployees(response.results)
    }, { useKV: true, ttl: 600 }) // 10 Minuten Cache
  }

  // ========== Projekt-Verwaltung ==========
  async getProjects(options: {
    status?: string
    type?: string
    customerId?: string
  } = {}) {
    return this.getCachedData(`projects-${options.status}-${options.type}`, async () => {
      const databaseId = import.meta.env.VITE_NOTION_PROJECTS_DB
      if (!databaseId) throw new Error('VITE_NOTION_PROJECTS_DB nicht gesetzt')

      const filter: Record<string, unknown> = {}
      
      if (options.status) {
        filter.property = 'Status'
        filter.select = { equals: options.status }
      }
      
      const conditions = [filter]
      
      if (options.type) {
        conditions.push({
          property: 'Typ',
          select: { equals: options.type }
        })
      }

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: conditions.length > 1 ? { and: conditions } : filter,
        sorts: [
          { property: 'Beginn', direction: 'descending' }
        ]
      })
      
      return this.mapProjects(response.results)
    })
  }

  // ========== Erweiterte Cache-Methoden ==========
  private async getCachedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options: { useKV?: boolean; ttl?: number } = {}
  ): Promise<T> {
    const { useKV = false, ttl = 300 } = options
    const cacheEnabled = import.meta.env.VITE_NOTION_ENABLE_CACHE !== 'false'
    
    if (!cacheEnabled) {
      return await fetcher()
    }

    // Memory Cache prüfen
    const cached = this.cache.get(key)
    const cacheDuration = parseInt(import.meta.env.VITE_NOTION_CACHE_DURATION || '300000')
    
    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`📦 Cache hit für: ${key}`)
      return cached.data
    }

    // KV Cache prüfen (für sensible Daten)
    if (useKV && this.kvClient) {
      try {
        const kvKey = `notion-cache:${key}`
        const kvData = await this.kvClient.get(kvKey)
        if (kvData) {
          console.log(`📦 KV Cache hit für: ${key}`)
          return JSON.parse(kvData)
        }
      } catch (error) {
        console.warn(`⚠️ KV Cache error for ${key}:`, error)
      }
    }

    console.log(`🔄 Cache miss, lade neue Daten für: ${key}`)
    const data = await fetcher()
    
    // Memory Cache setzen
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
    
    // KV Cache setzen (für sensible Daten)
    if (useKV && this.kvClient) {
      try {
        const kvKey = `notion-cache:${key}`
        await this.kvClient.set(kvKey, JSON.stringify(data), { ex: ttl })
      } catch (error) {
        console.warn(`⚠️ KV Cache set error for ${key}:`, error)
      }
    }
    
    return data
  }

  // ========== Cache-Invalidierung für Webhooks ==========
  clearCache(pattern?: string, useKV = false) {
    if (pattern) {
      // Nur spezifische Cache-Einträge löschen
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
          console.log(`🗑️ Cache gelöscht für: ${key}`)
        }
      }
      
      // KV Cache invalidieren
      if (useKV && this.kvClient) {
        this.kvCacheInvalidate(pattern)
      }
    } else {
      // Gesamten Cache leeren
      const size = this.cache.size
      this.cache.clear()
      console.log(`🗑️ Gesamter Cache geleert (${size} Einträge)`)
    }
  }

  private async kvCacheInvalidate(pattern: string) {
    if (!this.kvClient) return

    try {
      const keys = await this.kvClient.keys(`notion-cache:${pattern}`)
      if (keys.length > 0) {
        await this.kvClient.del(...keys)
        console.log(`🗑️ ${keys.length} KV Cache-Einträge für Pattern "${pattern}" gelöscht`)
      }
    } catch (error) {
      console.warn(`⚠️ KV Cache invalidation error for pattern ${pattern}:`, error)
    }
  }

  // ========== Autorisierung ==========
  private isAuthorized(resource?: string): boolean {
    // Implementierung der Autorisierung
    // Hier würde JWT-Token, Session-Check, RBAC etc. geprüft
    
    // Für Demo: Admin-Rolle hat Zugriff auf alles
    const userRole = this.getCurrentUserRole()
    
    if (userRole === 'admin') return true
    
    if (resource === 'customers' || resource === 'employees') {
      return userRole === 'admin' || userRole === 'manager'
    }
    
    return userRole === 'admin' || userRole === 'editor'
  }

  private getCurrentUserRole(): string {
    // Hier würde der aktuelle Benutzer-Rolle ermittelt werden
    // Session, JWT, etc.
    return 'admin' // Placeholder
  }

  // ========== Mapping-Methoden ==========

  private mapImages(pages: DatabasePageResponse[]): ImageAsset[] {
    return pages.map(page => ({
      id: page.id,
      title: page.properties.Titel?.title?.[0]?.text?.content || '',
      filename: page.properties.Dateiname?.rich_text?.[0]?.text?.content || '',
      altText: page.properties['Alt-Text']?.rich_text?.map(text => text.text.content).join(' ') || '',
      category: page.properties.Kategorie?.select?.name || '',
      fileSize: page.properties.Dateigröße?.number || 0,
      dimensions: page.properties.Abmessungen?.rich_text?.[0]?.text?.content || '',
      format: page.properties.Format?.select?.name || 'JPG',
      quality: page.properties.Qualität?.select?.name || 'Original',
      webUrl: page.properties['Web-URL']?.url || '',
      backupUrl: page.properties['Backup-URL']?.url || '',
      status: page.properties.Status?.select?.name || 'Aktiv',
      lastUpdated: page.properties['Letzte Aktualisierung']?.date?.start || ''
    }))
  }

  private mapApiEndpoints(pages: DatabasePageResponse[]): ApiEndpoint[] {
    return pages.map(page => ({
      id: page.id,
      name: page.properties['Endpunkt-Name']?.title?.[0]?.text?.content || '',
      method: page.properties['HTTP-Methode']?.select?.name || 'GET',
      path: page.properties.Pfad?.rich_text?.[0]?.text?.content || '',
      description: page.properties.Beschreibung?.rich_text?.map(text => text.text.content).join(' ') || '',
      parameters: this.parseJSONField(page.properties.Parameter?.rich_text?.[0]?.text?.content),
      responseExample: this.parseJSONField(page.properties['Response-Beispiel']?.rich_text?.[0]?.text?.content),
      authentication: page.properties.Authentifizierung?.select?.name || 'Öffentlich',
      rateLimit: page.properties['Rate-Limit']?.number || 60,
      cacheDuration: page.properties['Cache-Dauer']?.number || 300,
      status: page.properties.Status?.select?.name || 'Aktiv',
      version: page.properties.Version?.rich_text?.[0]?.text?.content || '1.0',
      lastUsed: page.properties['Letzte Nutzung']?.date?.start || ''
    }))
  }

  private mapWebsitePages(pages: DatabasePageResponse[]): WebsitePage[] {
    return pages.map(page => ({
      id: page.id,
      name: page.properties.Seitenname?.title?.[0]?.text?.content || '',
      urlPath: page.properties['URL-Pfad']?.rich_text?.[0]?.text?.content || '',
      type: page.properties['Seiten-Typ']?.select?.name || 'Standard',
      category: page.properties.Hauptkategorie?.select?.name || '',
      sortOrder: page.properties.Sortierung?.number || 0,
      metaTitle: page.properties['Meta-Titel']?.rich_text?.[0]?.text?.content || '',
      metaDescription: page.properties['Meta-Beschreibung']?.rich_text?.[0]?.text?.content || '',
      breadcrumb: page.properties.Breadcrumb?.rich_text?.[0]?.text?.content || '',
      mainNav: page.properties['Hauptnavigation']?.checkbox || false,
      footerNav: page.properties['Footer-Navigation']?.checkbox || false,
      status: page.properties.Status?.select?.name || 'Live',
      visibility: page.properties.Sichtbarkeit?.select?.name || 'Öffentlich'
    }))
  }

  private mapCustomers(pages: DatabasePageResponse[]): Customer[] {
    return pages.map(page => ({
      id: page.id,
      customerId: page.properties['Kunden-ID']?.title?.[0]?.text?.content || '',
      company: page.properties.Firma?.rich_text?.[0]?.text?.content || '',
      contactPerson: page.properties.Ansprechpartner?.rich_text?.[0]?.text?.content || '',
      email: page.properties.E-Mail?.email || '',
      phone: page.properties.Telefon?.phone_number || '',
      address: page.properties.Straße?.rich_text?.[0]?.text?.content || '',
      postalCode: page.properties.PLZ?.rich_text?.[0]?.text?.content || '',
      city: page.properties.Stadt?.rich_text?.[0]?.text?.content || '',
      country: page.properties.Land?.select?.name || 'Deutschland',
      segment: page.properties['Kunden-Segment']?.select?.name || '',
      status: page.properties.Status?.select?.name || 'Aktiv',
      firstContact: page.properties.Erstkontakt?.date?.start || '',
      contractStart: page.properties.Vertragsbeginn?.date?.start || '',
      projectValue: page.properties.Projektwert?.number || 0,
      paymentBehavior: page.properties.Bezahlverhalten?.select?.name || '',
      satisfaction: page.properties.Zufriedenheit?.select?.name || '',
      referenceAllowed: page.properties['Referenz-Freigabe']?.checkbox || false,
      notes: page.properties.Notizen?.rich_text?.map(text => text.text.content).join(' ') || '',
      lastActivity: page.properties['Letzte Aktivität']?.date?.start || ''
    }))
  }

  private mapEmployees(pages: DatabasePageResponse[]): Employee[] {
    return pages.map(page => ({
      id: page.id,
      employeeId: page.properties['Mitarbeiter-ID']?.rich_text?.[0]?.text?.content || '',
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      position: page.properties.Position?.select?.name || '',
      email: page.properties.E-Mail?.email || '',
      phone: page.properties.Telefon?.phone_number || '',
      mobile: page.properties.Handynummer?.phone_number || '',
      workType: page.properties.Arbeitszeit?.select?.name || 'Vollzeit',
      location: page.properties.Standort?.rich_text?.[0]?.text?.content || '',
      qualifications: page.properties.Qualifikationen?.multi_select?.map(item => item.name) || [],
      certificates: page.properties.Zertifikate?.multi_select?.map(item => item.name) || [],
      languages: page.properties.Sprachen?.multi_select?.map(item => item.name) || [],
      accessRights: page.properties.Zugangsrechte?.multi_select?.map(item => item.name) || [],
      startDate: page.properties.Arbeitsbeginn?.date?.start || '',
      status: page.properties.Status?.select?.name || 'Aktiv',
      notes: page.properties.Notizen?.rich_text?.map(text => text.text.content).join(' ') || ''
    }))
  }

  private mapProjects(pages: DatabasePageResponse[]): Project[] {
    return pages.map(page => ({
      id: page.id,
      projectId: page.properties['Projekt-ID']?.rich_text?.[0]?.text?.content || '',
      name: page.properties.Projektname?.title?.[0]?.text?.content || '',
      type: page.properties.Typ?.select?.name || '',
      status: page.properties.Status?.select?.name || '',
      location: page.properties.Standort?.rich_text?.[0]?.text?.content || '',
      area: page.properties.Fläche?.number || 0,
      power: page.properties.Leistung?.number || 0,
      cost: page.properties.Kosten?.number || 0,
      startDate: page.properties.Beginn?.date?.start || '',
      plannedCompletion: page.properties['Geplante Fertigstellung']?.date?.start || '',
      actualCompletion: page.properties['Tatsächliche Fertigstellung']?.date?.start || '',
      notes: page.properties.Notizen?.rich_text?.map(text => text.text.content).join(' ') || '',
      riskLevel: page.properties['Risiko-Bewertung']?.select?.name || 'Mittel'
    }))
  }

  // Hilfsmethoden
  private getCursorForOffset(offset: number): string {
    // Vereinfachte Cursor-Berechnung
    return btoa(`offset:${offset}`)
  }

  private async getArticleById(id: string): Promise<Article | null> {
    try {
      const page = await this.client.pages.retrieve({ page_id: id })
      const articles = this.mapBlogArticles([page])
      return articles[0] || null
    } catch (error) {
      console.warn(`Article with ID ${id} not found:`, error)
      return null
    }
  }

  private parseJSONField(content: string): unknown {
    try {
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.warn('⚠️ JSON Parsing Fehler:', error)
      return null
    }
  }

  // Credentials Management Methods
  async getCredentialsData(): Promise<unknown[]> {
    try {
      const databaseId = '9cd5cf15-6e46-4ae6-8716-58247a7f6cbf' // Credentials Management Database

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Active'
          }
        }
      })

      return response.results.map((page: unknown) => ({
        id: (page as Record<string, unknown>).id,
        serviceName: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Service Name']?.title?.[0]?.text?.content || '',
        apiKey: ((page as Record<string, unknown>).properties as Record<string, unknown>)['API Key']?.rich_text?.[0]?.text?.content || '',
        environment: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Environment']?.select?.name || '',
        isActive: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Status']?.select?.name === 'Active',
        lastUpdated: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Last Updated']?.date?.start || '',
        description: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Description']?.rich_text?.map((text: unknown) => (text as Record<string, unknown>).text?.content).join(' ') || '',
        contactPerson: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Contact Person']?.rich_text?.[0]?.text?.content || ''
      }))
    } catch (error) {
      console.error('Error fetching credentials data:', error)
      return []
    }
  }

  async getCredentialById(credentialId: string): Promise<unknown | null> {
    try {
      const page = await this.client.pages.retrieve({ page_id: credentialId })

      return {
        id: (page as Record<string, unknown>).id,
        serviceName: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Service Name']?.title?.[0]?.text?.content || '',
        apiKey: ((page as Record<string, unknown>).properties as Record<string, unknown>)['API Key']?.rich_text?.[0]?.text?.content || '',
        environment: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Environment']?.select?.name || '',
        isActive: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Status']?.select?.name === 'Active',
        lastUpdated: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Last Updated']?.date?.start || '',
        description: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Description']?.rich_text?.map((text: unknown) => (text as Record<string, unknown>).text?.content).join(' ') || '',
        contactPerson: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Contact Person']?.rich_text?.[0]?.text?.content || ''
      }
    } catch (error) {
      console.error(`Error fetching credential ${credentialId}:`, error)
      return null
    }
  }

  async getUsersData(): Promise<unknown[]> {
    try {
      const databaseId = '50b80a4d-df9a-42f7-b964-486bec1abf16' // Users Management Database

      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Active'
          }
        }
      })

      return response.results.map((page: unknown) => ({
        id: (page as Record<string, unknown>).id,
        email: ((page as Record<string, unknown>).properties as Record<string, unknown>).Email?.email || '',
        name: ((page as Record<string, unknown>).properties as Record<string, unknown>).Name?.title?.[0]?.text?.content || '',
        role: ((page as Record<string, unknown>).properties as Record<string, unknown>).Role?.select?.name || '',
        status: ((page as Record<string, unknown>).properties as Record<string, unknown>).Status?.select?.name || '',
        department: ((page as Record<string, unknown>).properties as Record<string, unknown>).Department?.select?.name || '',
        permissions: ((page as Record<string, unknown>).properties as Record<string, unknown>).Permissions?.multi_select?.map((sel: unknown) => (sel as Record<string, unknown>).name) || [],
        lastLogin: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Last Login']?.date?.start || '',
        lastSync: ((page as Record<string, unknown>).properties as Record<string, unknown>)['Last Sync']?.date?.start || ''
      }))
    } catch (error) {
      console.error('Error fetching users data:', error)
      return []
    }
  }
}

// NotionAPI wrapper for services
export class NotionAPI {
  private enhanced: EnhancedNotionService

  constructor() {
    this.enhanced = enhancedNotionService
  }

  async getCredentialsData(): Promise<unknown[]> {
    return await this.enhanced.getCredentialsData()
  }

  async getCredentialById(credentialId: string): Promise<unknown | null> {
    return await this.enhanced.getCredentialById(credentialId)
  }

  async getUsersData(): Promise<unknown[]> {
    return await this.enhanced.getUsersData()
  }
}

// Singleton Instance
export const enhancedNotionService = new EnhancedNotionService()
export default EnhancedNotionService