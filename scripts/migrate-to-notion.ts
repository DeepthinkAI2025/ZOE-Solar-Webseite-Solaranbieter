#!/usr/bin/env tsx

// Migration Script für ZOE Solar Daten nach Notion
// Dieses Script migriert bestehende Daten in Notion Datenbanken

import { notionService } from '../src/lib/notion/client'
import { products as currentProducts } from '../data/products.generated.new'
import { caseStudies as currentCaseStudies } from '../data/caseStudies'
import { articles as currentArticles } from '../data/articles'
import { testimonials as currentTestimonials } from '../data/testimonials'

// Simulierte Daten (die müsstest du mit deinen echten Daten ersetzen)
const mockArticles = [
  {
    slug: 'photovoltaik-fuer-gewerbe',
    title: 'Photovoltaik für Gewerbe: Die perfekte Lösung',
    category: 'Business',
    date: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    excerpt: 'Entdecken Sie wie Gewerbetreibende von Solaranlagen profitieren können.',
    authorName: 'Max Mustermann',
    authorRole: 'Solar Experte',
    authorImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    authorBio: 'Experte für erneuerbare Energien mit über 10 Jahren Erfahrung.',
    isAIGenerated: false,
    sources: ['https://example.com/source1', 'https://example.com/source2']
  }
]

const mockTestimonials = [
  {
    id: '1',
    customerName: 'Schmidt GmbH',
    company: 'Schmidt GmbH & Co. KG',
    role: 'Geschäftsführer',
    rating: 5,
    quote: 'ZOE Solar hat unsere Solaranlage perfekt geplant und installiert. Wir sparen jetzt 40% unserer Stromkosten!',
    projectTitle: '5 MW Solarpark',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    date: '2024-01-10',
    category: 'commercial'
  }
]

async function migrateProducts() {
  console.log('🚀 Migriere Produkte nach Notion...')

  for (const product of currentProducts.slice(0, 3)) { // Nur die ersten 3 für Demo
    try {
      const notionProduct = {
        parent: { type: 'database_id', database_id: process.env.VITE_NOTION_PRODUCTS_DB! },
        properties: {
          Name: {
            title: [{ text: { content: product.name } }]
          },
          Category: {
            select: { name: product.category || 'Allgemein' }
          },
          Manufacturer: {
            select: { name: product.manufacturer || 'ZOE Solar' }
          },
          Price: {
            number: product.price || 0
          },
          Specifications: {
            rich_text: Object.entries(product.specifications || {}).map(([key, value]) => ({
              text: { content: `${key}: ${value}` }
            }))
          },
          Images: {
            files: (product.images || []).map(url => ({
              type: 'external' as const,
              external: { url }
            }))
          },
          Description: {
            rich_text: [{ text: { content: product.description || '' } }]
          },
          Status: {
            select: { name: 'Published' }
          },
          Featured: {
            checkbox: false
          }
        }
      }

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionProduct)
      })

      if (response.ok) {
        console.log(`✅ Produkt migriert: ${product.name}`)
      } else {
        const error = await response.text()
        console.error(`❌ Fehler bei Produkt ${product.name}:`, error)
      }
    } catch (error) {
      console.error(`❌ Fehler bei Produkt ${product.name}:`, error)
    }
  }
}

async function migrateCaseStudies() {
  console.log('🏢 Migriere Fallstudien nach Notion...')

  for (const caseStudy of currentCaseStudies.slice(0, 3)) { // Nur die ersten 3 für Demo
    try {
      const notionCaseStudy = {
        parent: { type: 'database_id', database_id: process.env.VITE_NOTION_CASE_STUDIES_DB! },
        properties: {
          Slug: {
            rich_text: [{ text: { content: caseStudy.slug } }]
          },
          Title: {
            title: [{ text: { content: caseStudy.title } }]
          },
          Location: {
            rich_text: [{ text: { content: caseStudy.location } }]
          },
          LocationKey: {
            rich_text: [{ text: { content: caseStudy.locationKey } }]
          },
          Category: {
            select: { name: caseStudy.category }
          },
          Date: {
            date: { start: caseStudy.date }
          },
          ImageUrl: {
            files: [{
              type: 'external' as const,
              external: { url: caseStudy.imageUrl }
            }]
          },
          Excerpt: {
            rich_text: [{ text: { content: caseStudy.excerpt } }]
          },
          ClientName: {
            rich_text: [{ text: { content: caseStudy.clientName } }]
          },
          ClientType: {
            rich_text: [{ text: { content: caseStudy.clientType } }]
          },
          ProjectSize: {
            rich_text: [{ text: { content: caseStudy.projectSize } }]
          },
          InstallationTime: {
            rich_text: [{ text: { content: caseStudy.installationTime } }]
          },
          ROI: {
            rich_text: [{ text: { content: caseStudy.roi } }]
          },
          CO2Savings: {
            rich_text: [{ text: { content: caseStudy.co2Savings } }]
          },
          Highlights: {
            rich_text: [{ text: { content: JSON.stringify(caseStudy.highlights) } }]
          },
          Challenge: {
            rich_text: [{ text: { content: caseStudy.challenge } }]
          },
          Solution: {
            rich_text: [{ text: { content: caseStudy.solution } }]
          },
          Results: {
            rich_text: [{ text: { content: caseStudy.results } }]
          },
          Testimonial: {
            rich_text: [{ text: { content: JSON.stringify(caseStudy.testimonial) } }]
          },
          TechnicalDetails: {
            rich_text: [{ text: { content: JSON.stringify(caseStudy.technicalDetails) } }]
          },
          Gallery: {
            files: caseStudy.gallery.map(url => ({
              type: 'external' as const,
              external: { url }
            }))
          },
          RelatedServices: {
            rich_text: [{ text: { content: JSON.stringify(caseStudy.relatedServices) } }]
          },
          Status: {
            select: { name: 'Published' }
          }
        }
      }

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionCaseStudy)
      })

      if (response.ok) {
        console.log(`✅ Fallstudie migriert: ${caseStudy.title}`)
      } else {
        const error = await response.text()
        console.error(`❌ Fehler bei Fallstudie ${caseStudy.title}:`, error)
      }
    } catch (error) {
      console.error(`❌ Fehler bei Fallstudie ${caseStudy.title}:`, error)
    }
  }
}

async function migrateArticles() {
  console.log('📝 Migriere Artikel nach Notion...')

  for (const article of mockArticles) {
    try {
      const notionArticle = {
        parent: { type: 'database_id', database_id: process.env.VITE_NOTION_ARTICLES_DB! },
        properties: {
          Slug: {
            rich_text: [{ text: { content: article.slug } }]
          },
          Title: {
            title: [{ text: { content: article.title } }]
          },
          Category: {
            select: { name: article.category }
          },
          Date: {
            date: { start: article.date }
          },
          ImageUrl: {
            files: [{
              type: 'external' as const,
              external: { url: article.imageUrl }
            }]
          },
          Excerpt: {
            rich_text: [{ text: { content: article.excerpt } }]
          },
          AuthorName: {
            rich_text: [{ text: { content: article.authorName } }]
          },
          AuthorRole: {
            rich_text: [{ text: { content: article.authorRole } }]
          },
          AuthorImageUrl: {
            files: [{
              type: 'external' as const,
              external: { url: article.authorImageUrl }
            }]
          },
          AuthorBio: {
            rich_text: [{ text: { content: article.authorBio } }]
          },
          IsAIGenerated: {
            checkbox: article.isAIGenerated
          },
          Sources: {
            rich_text: [{ text: { content: JSON.stringify(article.sources) } }]
          },
          Status: {
            select: { name: 'Published' }
          }
        }
      }

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionArticle)
      })

      if (response.ok) {
        console.log(`✅ Artikel migriert: ${article.title}`)
      } else {
        const error = await response.text()
        console.error(`❌ Fehler bei Artikel ${article.title}:`, error)
      }
    } catch (error) {
      console.error(`❌ Fehler bei Artikel ${article.title}:`, error)
    }
  }
}

async function migrateTestimonials() {
  console.log('⭐ Migriere Testimonials nach Notion...')

  for (const testimonial of mockTestimonials) {
    try {
      const notionTestimonial = {
        parent: { type: 'database_id', database_id: process.env.VITE_NOTION_TESTIMONIALS_DB! },
        properties: {
          CustomerName: {
            title: [{ text: { content: testimonial.customerName } }]
          },
          Company: {
            rich_text: [{ text: { content: testimonial.company } }]
          },
          Role: {
            rich_text: [{ text: { content: testimonial.role } }]
          },
          Rating: {
            number: testimonial.rating
          },
          Quote: {
            rich_text: [{ text: { content: testimonial.quote } }]
          },
          ProjectTitle: {
            rich_text: [{ text: { content: testimonial.projectTitle || '' } }]
          },
          ImageUrl: {
            files: testimonial.imageUrl ? [{
              type: 'external' as const,
              external: { url: testimonial.imageUrl }
            }] : []
          },
          Date: {
            date: { start: testimonial.date }
          },
          Category: {
            select: { name: testimonial.category }
          },
          Status: {
            select: { name: 'Published' }
          }
        }
      }

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionTestimonial)
      })

      if (response.ok) {
        console.log(`✅ Testimonial migriert: ${testimonial.customerName}`)
      } else {
        const error = await response.text()
        console.error(`❌ Fehler bei Testimonial ${testimonial.customerName}:`, error)
      }
    } catch (error) {
      console.error(`❌ Fehler bei Testimonial ${testimonial.customerName}:`, error)
    }
  }
}

async function main() {
  console.log('🚀 Starte Migration zu Notion...')
  console.log('=====================================')

  // Prüfe ob Umgebungsvariablen gesetzt sind
  const requiredEnvVars = [
    'VITE_NOTION_TOKEN',
    'VITE_NOTION_PRODUCTS_DB',
    'VITE_NOTION_CASE_STUDIES_DB',
    'VITE_NOTION_ARTICLES_DB',
    'VITE_NOTION_TESTIMONIALS_DB'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  if (missingVars.length > 0) {
    console.error('❌ Fehlende Umgebungsvariablen:')
    missingVars.forEach(varName => console.error(`   - ${varName}`))
    console.error('\nBitte setze die Umgebungsvariablen in .env.local')
    process.exit(1)
  }

  try {
    await migrateProducts()
    console.log('')

    await migrateCaseStudies()
    console.log('')

    await migrateArticles()
    console.log('')

    await migrateTestimonials()

    console.log('')
    console.log('✨ Migration erfolgreich abgeschlossen!')
    console.log('')
    console.log('Nächste Schritte:')
    console.log('1. Überprüfe die Daten in deinen Notion Datenbanken')
    console.log('2. Teste die Website mit den neuen Notion-Daten')
    console.log('3. Richte Webhooks für Echtzeit-Updates ein')

  } catch (error) {
    console.error('❌ Migration fehlgeschlagen:', error)
    process.exit(1)
  }
}

// Nur ausführen, wenn das Script direkt aufgerufen wird
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}