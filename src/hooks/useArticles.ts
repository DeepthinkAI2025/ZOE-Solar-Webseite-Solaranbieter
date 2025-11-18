import { useState, useEffect } from 'react'
import { notionService } from '../lib/notion/client'
import type { Article } from '../lib/types/notion'

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const data = await notionService.getArticles()
        setArticles(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Artikel konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const refetch = () => {
    setLoading(true)
    notionService.getArticles()
      .then(setArticles)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  const getArticleBySlug = (slug: string) => {
    return articles.find(article => article.slug === slug)
  }

  const getArticlesByCategory = (category: string) => {
    return articles.filter(article => article.category.toLowerCase() === category.toLowerCase())
  }

  const getLatestArticles = (limit: number = 3) => {
    return articles.slice(0, limit)
  }

  const getAIGeneratedArticles = () => {
    return articles.filter(article => article.isAIGenerated)
  }

  return {
    articles,
    loading,
    error,
    refetch,
    getArticleBySlug,
    getArticlesByCategory,
    getLatestArticles,
    getAIGeneratedArticles
  }
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('Kein Slug angegeben')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const allArticles = await notionService.getArticles()
        const found = allArticles.find(article => article.slug === slug)

        if (found) {
          setArticle(found)
          setError(null)
        } else {
          setError('Artikel nicht gefunden')
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Artikel konnte nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  return { article, loading, error }
}

export function useArticlesByCategory(category: string) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticlesByCategory = async () => {
      try {
        setLoading(true)
        const allArticles = await notionService.getArticles()
        const filtered = allArticles.filter(article =>
          article.category.toLowerCase() === category.toLowerCase()
        )
        setArticles(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching articles by category:', err)
        setError('Artikel konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchArticlesByCategory()
    }
  }, [category])

  return { articles, loading, error }
}