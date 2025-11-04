// TypeScript Typen für Notion API Integration

export interface NotionDatabase {
  id: string
  title: string
  properties: Record<string, any>
}

export interface DatabasePageResponse {
  id: string
  created_time: string
  last_edited_time: string
  properties: Record<string, any>
  url: string
}

export interface NotionBlock {
  id: string
  created_time: string
  last_edited_time: string
  has_children: boolean
  type: string
  [key: string]: any
}

// Interface für ZOE Solar Datenstrukturen

export interface Product {
  id: string
  name: string
  category: string
  manufacturer: string
  price: number
  specifications: string[]
  images: string[]
  description: string
  status: string
  featured: boolean
}

export interface CaseStudy {
  slug: string
  title: string
  location: string
  locationKey: string
  category: 'residential' | 'commercial' | 'agricultural'
  date: string
  imageUrl: string
  excerpt: string
  clientName: string
  clientType: string
  projectSize: string
  installationTime: string
  roi: string
  co2Savings: string
  highlights: Array<{
    icon: string
    value: string
    label: string
  }>
  challenge: string
  solution: string
  results: string
  testimonial: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  technicalDetails: Record<string, any>
  gallery: string[]
  relatedServices: string[]
}

export interface Article {
  slug: string
  title: string
  category: string
  date: string
  imageUrl: string
  excerpt: string
  authorName: string
  authorRole: string
  authorImageUrl: string
  authorBio: string
  isAIGenerated: boolean
  sources: string[]
}

export interface Service {
  id: string
  title: string
  category: string
  description: string
  icon: string
  pricing?: string
  features: string[]
  relatedProducts: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  expertise: string[]
  email?: string
  linkedin?: string
}

export interface Testimonial {
  id: string
  customerName: string
  company: string
  role: string
  rating: number
  quote: string
  projectTitle?: string
  imageUrl?: string
  date: string
  category: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  relatedArticles: string[]
}

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  relatedTerms: string[]
}

export interface Location {
  id: string
  name: string
  region: string
  coordinates?: {
    lat: number
    lng: number
  }
  serviceArea: string
  contactEmail?: string
  phone?: string
  address?: string
}