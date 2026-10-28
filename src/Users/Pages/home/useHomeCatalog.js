import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categoryApi, productApi, shopApi } from '../../../services'
import { PRODUCTS_PER_PAGE } from './homeData.js'

/**
 * Charge le catalogue de l'accueil et gère la recherche, les catégories et la
 * pagination.
 *
 * Stratégie de chargement :
 * 1. la première page de produits est demandée immédiatement et affichée dès
 *    sa réception (pas d'attente des boutiques ni des catégories) ;
 * 2. les catégories et les boutiques arrivent en parallèle, chacune avec son
 *    propre état d'erreur ;
 * 3. le reste du catalogue est récupéré en arrière-plan, une fois la première
 *    page peinte, pour alimenter la recherche et les filtres sans bloquer
 *    l'affichage initial.
 *
 * L'ancienne version attendait `Promise.allSettled` sur les produits, les
 * catégories ET les boutiques : un appel lent aux boutiques retardait donc
 * l'apparition des produits.
 */
export default function useHomeCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [shops, setShops] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [initialLoading, setInitialLoading] = useState(true)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [shopsLoading, setShopsLoading] = useState(true)
  const [error, setError] = useState('')
  const [shopsError, setShopsError] = useState(false)
  const requestId = useRef(0)

  useEffect(() => {
    let active = true
    const currentRequest = ++requestId.current
    let idleHandle = null
    let usedIdleCallback = false

    // --- Catégories : indépendantes de l'affichage des produits ---
    categoryApi
      .list()
      .then(({ data }) => {
        if (!active) return
        setCategories(Array.isArray(data) ? data : data?.results ?? [])
      })
      .catch((reason) => console.error('home: catégories', reason))

    // --- Boutiques : chargées en parallèle, jamais bloquantes ---
    shopApi
      .list({ status: 'validated', perPage: 100 })
      .then(({ data }) => {
        if (!active) return
        const list = Array.isArray(data) ? data : data?.results ?? []
        setShops(Array.isArray(list) ? list : [])
        setShopsError(false)
      })
      .catch((reason) => {
        if (!active) return
        setShops([])
        setShopsError(true)
        console.error('home: boutiques', reason)
      })
      .finally(() => {
        if (active) setShopsLoading(false)
      })

    // --- Produits : première page affichée dès réception ---
    const loadRemainingCatalog = () => {
      if (!active || requestId.current !== currentRequest) return
      productApi
        .listAll({ status: 'active' })
        .then((fullCatalog) => {
          if (!active || requestId.current !== currentRequest) return
          setProducts((previous) => {
            // `listAll` renvoie aussi la première page : on fusionne par id
            // pour éviter les doublons et conserver l'ordre reçu.
            const merged = new Map(previous.map((product) => [product.id, product]))
            fullCatalog.forEach((product) => merged.set(product.id, product))
            return Array.from(merged.values())
          })
        })
        .catch((reason) => console.error('home: catalogue complet', reason))
        .finally(() => {
          if (active && requestId.current === currentRequest) setCatalogLoading(false)
        })
    }

    productApi
      .list({ status: 'active', page: 1, perPage: PRODUCTS_PER_PAGE })
      .then(({ data }) => {
        if (!active || requestId.current !== currentRequest) return
        const pageItems = Array.isArray(data) ? data : data?.results ?? []
        setProducts(Array.isArray(pageItems) ? pageItems : [])
        setError('')

        const totalPages = Array.isArray(data)
          ? 1
          : Number(data?.totalPages ?? data?.total_pages ?? 1)
        if (totalPages <= 1) {
          // Tout le catalogue tient dans la première page : aucun appel
          // supplémentaire n'est nécessaire.
          setCatalogLoading(false)
          return
        }

        // Le reste du catalogue n'est pas indispensable au premier rendu : on
        // le laisse passer après la peinture pour ne pas concurrencer les
        // images visibles.
        idleHandle =
          typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(loadRemainingCatalog, { timeout: 1500 })
            : window.setTimeout(loadRemainingCatalog, 250)
        usedIdleCallback = typeof window.requestIdleCallback === 'function'
      })
      .catch((reason) => {
        if (!active || requestId.current !== currentRequest) return
        setError('Erreur lors du chargement des produits')
        setCatalogLoading(false)
        console.error('home: produits', reason)
      })
      .finally(() => {
        if (active && requestId.current === currentRequest) setInitialLoading(false)
      })

    return () => {
      active = false
      if (idleHandle != null) {
        if (usedIdleCallback) window.cancelIdleCallback(idleHandle)
        else window.clearTimeout(idleHandle)
      }
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
    shopsLoading,
    selectedCategory,
    selectCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    visibleProducts,
    searchedProducts,
    initialLoading,
    catalogLoading,
    error,
    shopsError,
    searchQuery,
    setSearchQuery,
  }
}
