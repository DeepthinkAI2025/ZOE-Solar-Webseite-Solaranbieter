import { useState, useEffect } from 'react'
import { notionService } from '../lib/notion/client'
import type { Service, TeamMember, Testimonial, FAQ, GlossaryTerm, Location } from '../lib/types/notion'

// Universal Hook für alle Notion-Daten
export function useNotionData<T>(
  fetcher: () => Promise<T[]>,
  dependency: any[] = []
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetcher()
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Daten konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependency)

  const refetch = () => {
    setLoading(true)
    fetcher()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  return { data, loading, error, refetch }
}

// Spezifische Hooks für andere Daten

export function useServices() {
  return useNotionData<Service>(() => notionService.getServices())
}

export function useTeam() {
  return useNotionData<TeamMember>(() => notionService.getTeam())
}

export function useTestimonials() {
  return useNotionData<Testimonial>(() => notionService.getTestimonials())
}

export function useFAQs() {
  return useNotionData<FAQ>(() => notionService.getFAQs())
}

export function useGlossary() {
  return useNotionData<GlossaryTerm>(() => notionService.getGlossary())
}

export function useLocations() {
  return useNotionData<Location>(() => notionService.getLocations())
}

// Spezialisierte Hooks

export function useTestimonialsByCategory(category: string) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonialsByCategory = async () => {
      try {
        setLoading(true)
        const allTestimonials = await notionService.getTestimonials()
        const filtered = allTestimonials.filter(testimonial =>
          testimonial.category.toLowerCase() === category.toLowerCase()
        )
        setTestimonials(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching testimonials by category:', err)
        setError('Testimonials konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchTestimonialsByCategory()
    }
  }, [category])

  return { testimonials, loading, error }
}

export function useFAQsByCategory(category: string) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFAQsByCategory = async () => {
      try {
        setLoading(true)
        const allFAQs = await notionService.getFAQs()
        const filtered = allFAQs.filter(faq =>
          faq.category.toLowerCase() === category.toLowerCase()
        )
        setFaqs(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching FAQs by category:', err)
        setError('FAQs konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchFAQsByCategory()
    }
  }, [category])

  return { faqs, loading, error }
}

export function useGlossaryByCategory(category: string) {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTermsByCategory = async () => {
      try {
        setLoading(true)
        const allTerms = await notionService.getGlossary()
        const filtered = allTerms.filter(term =>
          term.category.toLowerCase() === category.toLowerCase()
        )
        setTerms(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching glossary terms by category:', err)
        setError('Glossar-Begriffe konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchTermsByCategory()
    }
  }, [category])

  return { terms, loading, error }
}