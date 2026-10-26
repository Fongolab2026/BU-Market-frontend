import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categoryApi, productApi, shopApi } from '../../../services'
import { PRODUCTS_PER_PAGE } from './homeData.js'

/**
 * Charge le catalogue de l'accueil et gère la recherche, les catégories et la
 * pagination.
 *
 * Trois appels sont lancés ensemble (`Promise.allSettled`) : produits, puis
 * catégories, puis boutiques. Chaque échec est indépendant — une erreur de
 * l'API des boutiques (500, réseau) ne bloque jamais l'affichage des produits
 * et est signalée via `shopsError` pour éviter de présenter une panne comme
 * une liste vide.
 */
export default function useHomeCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [shops, setShops] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [shopsError, setShopsError] = useState(false)

  useEffect(() => {
    let active = true

    Promise.allSettled([
      productApi.listAll({ status: 'active' }),
      categoryApi.list(),
      shopApi.list({ status: 'validated', perPage: 100 }),
    ]).then(([prodRes, catRes, shopRes]) => {
      if (!active) return

      if (prodRes.status === 'fulfilled') {
        setProducts(prodRes.value)
      } else {
        setError('Erreur lors du chargement des produits')
        console.error('home: produits', prodRes.reason)
      }

      if (catRes.status === 'fulfilled') {
        const data = catRes.value.data
        setCategories(Array.isArray(data) ? data : data.results ?? [])
      } else {
        console.error('home: catégories', catRes.reason)
      }

      if (shopRes.status === 'fulfilled') {
        const payload = shopRes.value.data
        const list = Array.isArray(payload) ? payload : (payload?.results ?? [])
        setShops(Array.isArray(list) ? list : [])
        setShopsError(false)
      } else {
        // Un échec réseau (ou 500) ne doit pas se faire passer pour une liste
        // vide : on l'annonce explicitement dans la section.
        setShops([])
        setShopsError(true)
        console.error('home: boutiques', shopRes.reason)
      }

      setInitialLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const searchQuery = searchParams.get('q')?.trim().toLowerCase() || ''

  const searchedProducts = useMemo(() => {
    const filtered = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products

    if (!searchQuery) return filtered

    return filtered.filter((product) => {
      const category = categories.find((item) => item.id === product.category)?.name || ''
      return `${product.name} ${product.details || ''} ${category}`.toLowerCase().includes(searchQuery)
    })
  }, [products, categories, selectedCategory, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const totalPages = Math.max(1, Math.ceil(searchedProducts.length / PRODUCTS_PER_PAGE))
  const visibleProducts = searchedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

  const setSearchQuery = (value) => {
    const nextQuery = value.trim()
    setSearchParams(nextQuery ? { q: nextQuery } : {}, { replace: true })
  }

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  return {
    products,
    categories,
    shops,
    selectedCategory,
    selectCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    visibleProducts,
    searchedProducts,
    initialLoading,
    error,
    shopsError,
    searchQuery,
    setSearchQuery,
  }
}
