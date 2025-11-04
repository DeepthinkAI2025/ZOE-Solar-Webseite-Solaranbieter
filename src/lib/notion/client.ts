// Notion API Client für ZOE Solar CMS

import { Client } from '@notionhq/client'
import { DatabasePageResponse } from '../types/notion'
import type { Product, CaseStudy, Article, Service, TeamMember, Testimonial, FAQ, GlossaryTerm, Location } from '../types/notion'

export class NotionService {
  private client: Client
  private cache = new Map<string, { data: any; timestamp: number }>()
  private CACHE_DURATION = 5 * 60 * 1000 // 5 Minuten Cache

  constructor() {
    const token = import.meta.env.VITE_NOTION_TOKEN
    if (!token) {
      throw new Error('VITE_NOTION_TOKEN ist nicht in den Umgebungsvariablen gesetzt')
    }

    this.client = new Client({
      auth: token,
      userAgent: 'ZOE-Solar-CMS/1.0'
    })
  }

  private async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cacheEnabled = import.meta.env.VITE_NOTION_ENABLE_CACHE === 'true'

    if (!cacheEnabled) {
      return await fetcher()
    }

    const cached = this.cache.get(key)
    const cacheDuration = parseInt(import.meta.env.VITE_NOTION_CACHE_DURATION || '300000')

    if (cached && Date.now() - cached.timestamp < cacheDuration) {
      console.log(`📦 Cache hit für: ${key}`)
      return cached.data
    }

    console.log(`🔄 Cache miss, lade neue Daten für: ${key}`)
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  // Produkte abrufen
  async getProducts(): Promise<Product[]> {
    const databaseId = import.meta.env.VITE_NOTION_PRODUCTS_DB
    if (!databaseId) throw new Error('VITE_NOTION_PRODUCTS_DB nicht gesetzt')

    return this.getCachedData('products', async () => {
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
      const response = await this.client.databases.query({
        database_id: databaseId,
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
    return pages.map(page => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      category: page.properties.Category?.select?.name || '',
      manufacturer: page.properties.Manufacturer?.select?.name || '',
      price: page.properties.Price?.number || 0,
      specifications: page.properties.Specifications?.rich_text?.map(text => text.text.content) || [],
      images: page.properties.Images?.files?.map(file =>
        file.type === 'external' ? file.external.url : file.file.url
      ) || [],
      description: page.properties.Description?.rich_text?.map(text => text.text.content).join(' ') || '',
      status: page.properties.Status?.select?.name || '',
      featured: page.properties.Featured?.checkbox || false
    }))
  }

  private mapCaseStudies(pages: DatabasePageResponse[]): CaseStudy[] {
    return pages.map(page => ({
      slug: page.properties.Slug?.rich_text?.[0]?.text?.content || '',
      title: page.properties.Title?.title?.[0]?.text?.content || '',
      location: page.properties.Location?.rich_text?.[0]?.text?.content || '',
      locationKey: page.properties.LocationKey?.rich_text?.[0]?.text?.content || '',
      category: page.properties.Category?.select?.name as 'residential' | 'commercial' | 'agricultural' || 'commercial',
      date: page.properties.Date?.date?.start || '',
      imageUrl: page.properties.ImageUrl?.files?.[0]?.type === 'external'
        ? page.properties.ImageUrl.files[0].external.url
        : page.properties.ImageUrl?.files?.[0]?.file?.url || '',
      excerpt: page.properties.Excerpt?.rich_text?.map(text => text.text.content).join(' ') || '',
      clientName: page.properties.ClientName?.rich_text?.[0]?.text?.content || '',
      clientType: page.properties.ClientType?.rich_text?.[0]?.text?.content || '',
      projectSize: page.properties.ProjectSize?.rich_text?.[0]?.text?.content || '',
      installationTime: page.properties.InstallationTime?.rich_text?.[0]?.text?.content || '',
      roi: page.properties.ROI?.rich_text?.[0]?.text?.content || '',
      co2Savings: page.properties.CO2Savings?.rich_text?.[0]?.text?.content || '',
      highlights: this.parseJSONField(page.properties.Highlights?.rich_text?.[0]?.text?.content),
      challenge: page.properties.Challenge?.rich_text?.map(text => text.text.content).join(' ') || '',
      solution: page.properties.Solution?.rich_text?.map(text => text.text.content).join(' ') || '',
      results: page.properties.Results?.rich_text?.map(text => text.text.content).join(' ') || '',
      testimonial: this.parseJSONField(page.properties.Testimonial?.rich_text?.[0]?.text?.content),
      technicalDetails: this.parseJSONField(page.properties.TechnicalDetails?.rich_text?.[0]?.text?.content),
      gallery: page.properties.Gallery?.files?.map(file =>
        file.type === 'external' ? file.external.url : file.file.url
      ) || [],
      relatedServices: this.parseJSONField(page.properties.RelatedServices?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapArticles(pages: DatabasePageResponse[]): Article[] {
    return pages.map(page => ({
      slug: page.properties.Slug?.rich_text?.[0]?.text?.content || '',
      title: page.properties.Title?.title?.[0]?.text?.content || '',
      category: page.properties.Category?.select?.name || '',
      date: page.properties.Date?.date?.start || '',
      imageUrl: page.properties.ImageUrl?.files?.[0]?.type === 'external'
        ? page.properties.ImageUrl.files[0].external.url
        : page.properties.ImageUrl?.files?.[0]?.file?.url || '',
      excerpt: page.properties.Excerpt?.rich_text?.map(text => text.text.content).join(' ') || '',
      authorName: page.properties.AuthorName?.rich_text?.[0]?.text?.content || '',
      authorRole: page.properties.AuthorRole?.rich_text?.[0]?.text?.content || '',
      authorImageUrl: page.properties.AuthorImageUrl?.files?.[0]?.type === 'external'
        ? page.properties.AuthorImageUrl.files[0].external.url
        : page.properties.AuthorImageUrl?.files?.[0]?.file?.url || '',
      authorBio: page.properties.AuthorBio?.rich_text?.map(text => text.text.content).join(' ') || '',
      isAIGenerated: page.properties.IsAIGenerated?.checkbox || false,
      sources: this.parseJSONField(page.properties.Sources?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapServices(pages: DatabasePageResponse[]): Service[] {
    return pages.map(page => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || '',
      category: page.properties.Category?.select?.name || '',
      description: page.properties.Description?.rich_text?.map(text => text.text.content).join(' ') || '',
      icon: page.properties.Icon?.rich_text?.[0]?.text?.content || '',
      pricing: page.properties.Pricing?.rich_text?.[0]?.text?.content,
      features: page.properties.Features?.rich_text?.map(text => text.text.content) || [],
      relatedProducts: this.parseJSONField(page.properties.RelatedProducts?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapTeamMembers(pages: DatabasePageResponse[]): TeamMember[] {
    return pages.map(page => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      role: page.properties.Role?.rich_text?.[0]?.text?.content || '',
      bio: page.properties.Bio?.rich_text?.map(text => text.text.content).join(' ') || '',
      imageUrl: page.properties.ImageUrl?.files?.[0]?.type === 'external'
        ? page.properties.ImageUrl.files[0].external.url
        : page.properties.ImageUrl?.files?.[0]?.file?.url || '',
      expertise: page.properties.Expertise?.multi_select?.map(item => item.name) || [],
      email: page.properties.Email?.rich_text?.[0]?.text?.content,
      linkedin: page.properties.LinkedIn?.rich_text?.[0]?.text?.content
    }))
  }

  private mapTestimonials(pages: DatabasePageResponse[]): Testimonial[] {
    return pages.map(page => ({
      id: page.id,
      customerName: page.properties.CustomerName?.title?.[0]?.text?.content || '',
      company: page.properties.Company?.rich_text?.[0]?.text?.content || '',
      role: page.properties.Role?.rich_text?.[0]?.text?.content || '',
      rating: page.properties.Rating?.number || 5,
      quote: page.properties.Quote?.rich_text?.map(text => text.text.content).join(' ') || '',
      projectTitle: page.properties.ProjectTitle?.rich_text?.[0]?.text?.content,
      imageUrl: page.properties.ImageUrl?.files?.[0]?.type === 'external'
        ? page.properties.ImageUrl.files[0].external.url
        : page.properties.ImageUrl?.files?.[0]?.file?.url,
      date: page.properties.Date?.date?.start || '',
      category: page.properties.Category?.select?.name || ''
    }))
  }

  private mapFAQs(pages: DatabasePageResponse[]): FAQ[] {
    return pages.map(page => ({
      id: page.id,
      question: page.properties.Question?.title?.[0]?.text?.content || '',
      answer: page.properties.Answer?.rich_text?.map(text => text.text.content).join(' ') || '',
      category: page.properties.Category?.select?.name || '',
      order: page.properties.Order?.number || 0,
      relatedArticles: this.parseJSONField(page.properties.RelatedArticles?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapGlossaryTerms(pages: DatabasePageResponse[]): GlossaryTerm[] {
    return pages.map(page => ({
      id: page.id,
      term: page.properties.Term?.title?.[0]?.text?.content || '',
      definition: page.properties.Definition?.rich_text?.map(text => text.text.content).join(' ') || '',
      category: page.properties.Category?.select?.name || '',
      relatedTerms: this.parseJSONField(page.properties.RelatedTerms?.rich_text?.[0]?.text?.content)
    }))
  }

  private mapLocations(pages: DatabasePageResponse[]): Location[] {
    return pages.map(page => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.text?.content || '',
      region: page.properties.Region?.select?.name || '',
      coordinates: page.properties.Coordinates?.rich_text?.[0]?.text?.content ?
        JSON.parse(page.properties.Coordinates.rich_text[0].text.content) : undefined,
      serviceArea: page.properties.ServiceArea?.rich_text?.map(text => text.text.content).join(' ') || '',
      contactEmail: page.properties.ContactEmail?.rich_text?.[0]?.text?.content,
      phone: page.properties.Phone?.rich_text?.[0]?.text?.content,
      address: page.properties.Address?.rich_text?.map(text => text.text.content).join(' ')
    }))
  }

  // Hilfsmethode zum Parsen von JSON-Feldern
  private parseJSONField(content: string): any {
    try {
      return content ? JSON.parse(content) : []
    } catch (error) {
      console.warn('⚠️ JSON Parsing Fehler:', error)
      return []
    }
  }
}

// Globaler Notion Service
export const notionService = new NotionService()