// Notion API Client für ZOE Solar CMS

import { Client } from '@notionhq/client'
import { DatabasePageResponse } from '../types/notion'
import { queryDatabase, type NotionDatabaseQueryOptions, type NotionQueryResponse } from './query-database'
import type {
  Product,
  CaseStudy,
  Article,
  Service,
  TeamMember,
  Testimonial,
  FAQ,
  GlossaryTerm,
  Location,
  NotionPropertyValue,
  NotionFileObject
} from '../types/notion'

export class NotionService {
  protected client: Client
  protected cache = new Map<string, { data: unknown; timestamp: number }>()
  private CACHE_DURATION = 5 * 60 * 1000 // 5 Minuten Cache

  constructor() {
    const token = import.meta.env.VITE_NOTION_TOKEN
    if (!token) {
      throw new Error('VITE_NOTION_TOKEN ist nicht in den Umgebungsvariablen gesetzt')
    }

    this.client = new Client({
      auth: token
    })
  }

  protected async getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    _options?: { useKV?: boolean; ttl?: number }
  ): Promise<T> {
    const cacheEnabled = import.meta.env.VITE_NOTION_ENABLE_CACHE === 'true'

    if (!cacheEnabled) {
      return await fetcher()
    }

    const cached = this.cache.get(key)
    const cacheDuration = parseInt(import.meta.env.VITE_NOTION_CACHE_DURATION || '300000')

    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`📦 Cache hit für: ${key}`)
      return cached.data as T
    }

    console.log(`🔄 Cache miss, lade neue Daten für: ${key}`)
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  protected async queryDatabase<T = DatabasePageResponse>(
    databaseId: string,
    body: NotionDatabaseQueryOptions = {}
  ): Promise<NotionQueryResponse<T>> {
    return queryDatabase<T>(this.client, databaseId, body)
  }

  // Produkte abrufen
  async getProducts(): Promise<Product[]> {
    const databaseId = import.meta.env.VITE_NOTION_PRODUCTS_DB
    if (!databaseId) throw new Error('VITE_NOTION_PRODUCTS_DB nicht gesetzt')

    return this.getCachedData('products', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Name', direction: 'ascending' }]
      })
      return this.mapProducts(response.results as DatabasePageResponse[])
    })
  }

  // Fallstudien abrufen
  async getCaseStudies(): Promise<CaseStudy[]> {
    const databaseId = import.meta.env.VITE_NOTION_CASE_STUDIES_DB
    if (!databaseId) throw new Error('VITE_NOTION_CASE_STUDIES_DB nicht gesetzt')

    return this.getCachedData('case-studies', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Date', direction: 'descending' }]
      })
      return this.mapCaseStudies(response.results as DatabasePageResponse[])
    })
  }

  // Artikel abrufen
  async getArticles(): Promise<Article[]> {
    const databaseId = import.meta.env.VITE_NOTION_ARTICLES_DB
    if (!databaseId) throw new Error('VITE_NOTION_ARTICLES_DB nicht gesetzt')

    return this.getCachedData('articles', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Date', direction: 'descending' }]
      })
      return this.mapArticles(response.results as DatabasePageResponse[])
    })
  }

  // Dienste abrufen
  async getServices(): Promise<Service[]> {
    const databaseId = import.meta.env.VITE_NOTION_SERVICES_DB
    if (!databaseId) throw new Error('VITE_NOTION_SERVICES_DB nicht gesetzt')

    return this.getCachedData('services', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Order', direction: 'ascending' }]
      })
      return this.mapServices(response.results as DatabasePageResponse[])
    })
  }

  // Team abrufen
  async getTeam(): Promise<TeamMember[]> {
    const databaseId = import.meta.env.VITE_NOTION_TEAM_DB
    if (!databaseId) throw new Error('VITE_NOTION_TEAM_DB nicht gesetzt')

    return this.getCachedData('team', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Active' }
        },
        sorts: [{ property: 'Order', direction: 'ascending' }]
      })
      return this.mapTeamMembers(response.results as DatabasePageResponse[])
    })
  }

  // Testimonials abrufen
  async getTestimonials(): Promise<Testimonial[]> {
    const databaseId = import.meta.env.VITE_NOTION_TESTIMONIALS_DB
    if (!databaseId) throw new Error('VITE_NOTION_TESTIMONIALS_DB nicht gesetzt')

    return this.getCachedData('testimonials', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Date', direction: 'descending' }]
      })
      return this.mapTestimonials(response.results as DatabasePageResponse[])
    })
  }

  // FAQ abrufen
  async getFAQs(): Promise<FAQ[]> {
    const databaseId = import.meta.env.VITE_NOTION_FAQ_DB
    if (!databaseId) throw new Error('VITE_NOTION_FAQ_DB nicht gesetzt')

    return this.getCachedData('faqs', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Order', direction: 'ascending' }]
      })
      return this.mapFAQs(response.results as DatabasePageResponse[])
    })
  }

  // Glossar abrufen
  async getGlossary(): Promise<GlossaryTerm[]> {
    const databaseId = import.meta.env.VITE_NOTION_GLOSSARY_DB
    if (!databaseId) throw new Error('VITE_NOTION_GLOSSARY_DB nicht gesetzt')

    return this.getCachedData('glossary', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Published' }
        },
        sorts: [{ property: 'Term', direction: 'ascending' }]
      })
      return this.mapGlossaryTerms(response.results as DatabasePageResponse[])
    })
  }

  // Standorte abrufen
  async getLocations(): Promise<Location[]> {
    const databaseId = import.meta.env.VITE_NOTION_LOCATIONS_DB
    if (!databaseId) throw new Error('VITE_NOTION_LOCATIONS_DB nicht gesetzt')

    return this.getCachedData('locations', async () => {
      const response = await this.queryDatabase(databaseId, {
        filter: {
          property: 'Status',
          select: { equals: 'Active' }
        },
        sorts: [{ property: 'Name', direction: 'ascending' }]
      })
      return this.mapLocations(response.results as DatabasePageResponse[])
    })
  }

  // Seiteninhalt abrufen
  async getPageContent(pageId: string) {
    return this.getCachedData(`page-${pageId}`, async () => {
      const blocks = await this.client.blocks.children.list({
        block_id: pageId
      })
      return blocks.results
    })
  }

  // Cache leeren (für Webhook Updates)
  clearCache(pattern?: string) {
    if (pattern) {
      // Nur spezifische Cache-Einträge löschen
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
          console.log(`🗑️ Cache gelöscht für: ${key}`)
        }
      }
    } else {
      // Gesamten Cache leeren
      const size = this.cache.size
      this.cache.clear()
      console.log(`🗑️ Gesamter Cache geleert (${size} Einträge)`)
    }
  }

  // ========== Daten-Mapping Methoden ==========

  private mapProducts(pages: DatabasePageResponse[]): Product[] {
    return pages.map(page => {
      const props = page.properties as Record<string, NotionPropertyValue>
      const richTextValues = (property?: NotionPropertyValue) =>
        property?.rich_text?.map(fragment => fragment?.text?.content || '').filter(Boolean) ?? []
      const fileUrls = (property?: NotionPropertyValue) =>
        property?.files?.map((file: NotionFileObject) =>
          file.type === 'external' ? file.external?.url : file.file?.url
        ).filter((url): url is string => Boolean(url)) ?? []

      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || '',
        category: props.Category?.select?.name || '',
        manufacturer: props.Manufacturer?.select?.name || '',
        price: props.Price?.number || 0,
        specifications: richTextValues(props.Specifications),
        images: fileUrls(props.Images),
        description: richTextValues(props.Description).join(' '),
        status: props.Status?.select?.name || '',
        featured: props.Featured?.checkbox || false
      }
    })
  }

  private mapCaseStudies(pages: DatabasePageResponse[]): CaseStudy[] {
    return pages.map(page => {
      const props = page.properties as Record<string, NotionPropertyValue>
      const firstRichText = (property?: NotionPropertyValue) => property?.rich_text?.[0]?.text?.content || ''
      const joinedRichText = (property?: NotionPropertyValue) =>
        property?.rich_text?.map(fragment => fragment?.text?.content || '').filter(Boolean).join(' ') || ''
      const firstFileUrl = (property?: NotionPropertyValue) => {
        const file = property?.files?.[0]
        if (!file) return ''
        return file.type === 'external' ? file.external?.url || '' : file.file?.url || ''
      }
      const fileUrls = (property?: NotionPropertyValue) =>
        property?.files?.map((file: NotionFileObject) =>
          file.type === 'external' ? file.external?.url : file.file?.url
        ).filter((url): url is string => Boolean(url)) ?? []

      return {
        slug: firstRichText(props.Slug),
        title: props.Title?.title?.[0]?.text?.content || '',
        location: firstRichText(props.Location),
        locationKey: firstRichText(props.LocationKey),
        category: (props.Category?.select?.name as 'residential' | 'commercial' | 'agricultural') || 'commercial',
        date: props.Date?.date?.start || '',
        imageUrl: firstFileUrl(props.ImageUrl),
        excerpt: joinedRichText(props.Excerpt),
        clientName: firstRichText(props.ClientName),
        clientType: firstRichText(props.ClientType),
        projectSize: firstRichText(props.ProjectSize),
        installationTime: firstRichText(props.InstallationTime),
        roi: firstRichText(props.ROI),
        co2Savings: firstRichText(props.CO2Savings),
        highlights: this.parseJSONField<{ icon: string; value: string; label: string }[]>(props.Highlights?.rich_text?.[0]?.text?.content),
        challenge: joinedRichText(props.Challenge),
        solution: joinedRichText(props.Solution),
        results: joinedRichText(props.Results),
        testimonial: this.parseJSONField(props.Testimonial?.rich_text?.[0]?.text?.content),
        technicalDetails: this.parseJSONField(props.TechnicalDetails?.rich_text?.[0]?.text?.content),
        gallery: fileUrls(props.Gallery),
        relatedServices: this.parseJSONField<string[]>(props.RelatedServices?.rich_text?.[0]?.text?.content)
      }
    })
  }

  private mapArticles(pages: DatabasePageResponse[]): Article[] {
    return pages.map(page => {
      const props = page.properties as Record<string, NotionPropertyValue>
      const firstRichText = (property?: NotionPropertyValue) => property?.rich_text?.[0]?.text?.content || ''
      const joinedRichText = (property?: NotionPropertyValue) =>
        property?.rich_text?.map(fragment => fragment?.text?.content || '').filter(Boolean).join(' ') || ''
      const firstFileUrl = (property?: NotionPropertyValue) => {
        const file = property?.files?.[0]
        if (!file) return ''
        return file.type === 'external' ? file.external?.url || '' : file.file?.url || ''
      }

      return {
        slug: firstRichText(props.Slug),
        title: props.Title?.title?.[0]?.text?.content || '',
        category: props.Category?.select?.name || '',
        date: props.Date?.date?.start || '',
        imageUrl: firstFileUrl(props.ImageUrl),
        excerpt: joinedRichText(props.Excerpt),
        authorName: firstRichText(props.AuthorName),
        authorRole: firstRichText(props.AuthorRole),
        authorImageUrl: firstFileUrl(props.AuthorImageUrl),
        authorBio: joinedRichText(props.AuthorBio),
        isAIGenerated: props.IsAIGenerated?.checkbox || false,
        sources: this.parseJSONField<string[]>(props.Sources?.rich_text?.[0]?.text?.content)
      }
    })
  }

  private mapServices(pages: DatabasePageResponse[]): Service[] {
    return pages.map(page => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || '',
      category: page.properties.Category?.select?.name || '',
      description: page.properties.Description?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ') || '',
      icon: page.properties.Icon?.rich_text?.[0]?.text?.content || '',
      pricing: page.properties.Pricing?.rich_text?.[0]?.text?.content,
      features: page.properties.Features?.rich_text?.map(text => text.text?.content || '').filter((value): value is string => Boolean(value)) || [],
      relatedProducts: this.parseJSONField<string[]>(page.properties.RelatedProducts?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapTeamMembers(pages: DatabasePageResponse[]): TeamMember[] {
    return pages.map(page => {
      const props = page.properties as Record<string, NotionPropertyValue>
      return {
        id: page.id,
        name: props.Name?.title?.[0]?.text?.content || '',
        role: props.Role?.rich_text?.[0]?.text?.content || '',
        bio: props.Bio?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ') || '',
        imageUrl: (() => {
          const file = props.ImageUrl?.files?.[0]
          if (!file) return ''
          return file.type === 'external' ? file.external?.url || '' : file.file?.url || ''
        })(),
        expertise: props.Expertise?.multi_select?.map(item => item.name).filter((value): value is string => Boolean(value)) || [],
        email: props.Email?.rich_text?.[0]?.text?.content,
        linkedin: props.LinkedIn?.rich_text?.[0]?.text?.content
      }
    })
  }

  private mapTestimonials(pages: DatabasePageResponse[]): Testimonial[] {
    return pages.map(page => {
      const richText = (property?: NotionPropertyValue): string[] =>
        property?.rich_text?.map(text => text.text?.content || '').filter(Boolean) ?? []
      const imageFile = page.properties.ImageUrl?.files?.[0]

      return {
        id: page.id,
        customerName: page.properties.CustomerName?.title?.[0]?.text?.content || '',
        company: page.properties.Company?.rich_text?.[0]?.text?.content || '',
        role: page.properties.Role?.rich_text?.[0]?.text?.content || '',
        rating: page.properties.Rating?.number || 5,
        quote: richText(page.properties.Quote).join(' ') || '',
        projectTitle: page.properties.ProjectTitle?.rich_text?.[0]?.text?.content,
        imageUrl: imageFile
          ? imageFile.type === 'external'
            ? imageFile.external?.url
            : imageFile.file?.url
          : undefined,
        date: page.properties.Date?.date?.start || '',
        category: page.properties.Category?.select?.name || ''
      }
    })
  }

  private mapFAQs(pages: DatabasePageResponse[]): FAQ[] {
    return pages.map(page => ({
      id: page.id,
      question: page.properties.Question?.title?.[0]?.text?.content || '',
      answer: page.properties.Answer?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ') || '',
      category: page.properties.Category?.select?.name || '',
      order: page.properties.Order?.number || 0,
      relatedArticles: this.parseJSONField<string[]>(page.properties.RelatedArticles?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapGlossaryTerms(pages: DatabasePageResponse[]): GlossaryTerm[] {
    return pages.map(page => ({
      id: page.id,
      term: page.properties.Term?.title?.[0]?.text?.content || '',
      definition: page.properties.Definition?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ') || '',
      category: page.properties.Category?.select?.name || '',
      relatedTerms: this.parseJSONField<string[]>(page.properties.RelatedTerms?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapLocations(pages: DatabasePageResponse[]): Location[] {
    return pages.map(page => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      region: page.properties.Region?.select?.name || '',
      coordinates: (() => {
        const content = page.properties.Coordinates?.rich_text?.[0]?.text?.content
        if (!content) return undefined
        try {
          return JSON.parse(content) as Location['coordinates']
        } catch (error) {
          console.warn('⚠️ Ungültige Koordinaten in Notion:', error)
          return undefined
        }
      })(),
      serviceArea: page.properties.ServiceArea?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ') || '',
      contactEmail: page.properties.ContactEmail?.rich_text?.[0]?.text?.content,
      phone: page.properties.Phone?.rich_text?.[0]?.text?.content,
      address: page.properties.Address?.rich_text?.map(text => text.text?.content || '').filter(Boolean).join(' ')
    }))
  }

  // Hilfsmethode zum Parsen von JSON-Feldern
  private parseJSONField<T = unknown>(content?: string | null): T {
    if (!content) {
      return [] as T
    }

    try {
      return JSON.parse(content) as T
    } catch (error) {
      console.warn('⚠️ JSON Parsing Fehler:', error)
      return [] as T
    }
  }
}

// Globaler Notion Service
export const notionService = new NotionService()