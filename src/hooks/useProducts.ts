import { useState, useEffect } from 'react'
import { notionService } from '../lib/notion/client'
import type { Product } from '../lib/types/notion'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await notionService.getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Produkte konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const refetch = () => {
    setLoading(true)
    notionService.getProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  return { products, loading, error, refetch }
}

export function useProductByCategory(category: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true)
        const allProducts = await notionService.getProducts()
        const filtered = allProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase()
        )
        setProducts(filtered)
        setError(null)
      } catch (err) {
        console.error('Error fetching products by category:', err)
        setError('Produkte konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchProductsByCategory()
    }
  }, [category])

  return { products, loading, error }
}

export function useFeaturedProducts(limit: number = 3) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const allProducts = await notionService.getProducts()
        const featured = allProducts
          .filter(product => product.featured)
          .slice(0, limit)
        setProducts(featured)
        setError(null)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError('Featured Produkte konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [limit])

  return { products, loading, error }
}