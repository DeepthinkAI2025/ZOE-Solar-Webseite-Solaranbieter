import { useState, useEffect } from 'react'
import { notionService } from '../lib/notion/client'
import type { CaseStudy } from '../lib/types/notion'

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true)
        const data = await notionService.getCaseStudies()
        setCaseStudies(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching case studies:', err)
        setError('Fallstudien konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudies()
  }, [])

  const refetch = () => {
    setLoading(true)
    notionService.getCaseStudies()
      .then(setCaseStudies)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  const getCaseStudiesByLocation = (locationKey: string) => {
    return caseStudies.filter(study => study.locationKey === locationKey)
  }

  const getCaseStudyBySlug = (slug: string) => {
    return caseStudies.find(study => study.slug === slug)
  }

  const getFeaturedCaseStudies = (limit: number = 3) => {
    return caseStudies.slice(0, limit)
  }

  const getCaseStudiesByCategory = (category: 'residential' | 'commercial' | 'agricultural') => {
    return caseStudies.filter(study => study.category === category)
  }

  return {
    caseStudies,
    loading,
    error,
    refetch,
    getCaseStudiesByLocation,
    getCaseStudyBySlug,
    getFeaturedCaseStudies,
    getCaseStudiesByCategory
  }
}

export function useCaseStudy(slug: string) {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!slug) {
        setError('Kein Slug angegeben')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const allCaseStudies = await notionService.getCaseStudies()
        const found = allCaseStudies.find(study => study.slug === slug)

        if (found) {
          setCaseStudy(found)
          setError(null)
        } else {
          setError('Fallstudie nicht gefunden')
        }
      } catch (err) {
        console.error('Error fetching case study:', err)
        setError('Fallstudie konnte nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudy()
  }, [slug])

  return { caseStudy, loading, error }
}

export function useCaseStudiesByCategory(category: 'residential' | 'commercial' | 'agricultural') {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCaseStudiesByCategory = async () => {
      try {
        setLoading(true)
        const allCaseStudies = await notionService.getCaseStudies()
        const filtered = allCaseStudies.filter(study => study.category === category)
        setCaseStudies(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching case studies by category:', err)
        setError('Fallstudien konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchCaseStudiesByCategory()
    }
  }, [category])

  return { caseStudies, loading, error }
}