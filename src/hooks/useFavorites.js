import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { favoriteApi, isAuthenticated } from '../services'

/**
 * Hook pour gérer les favoris d'un utilisateur.
 * Fournit la liste des IDs de produits favoris, une fonction de toggle
 * et un indicateur d'état pour savoir si un produit est déjà favori.
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated()) return
    setLoading(true)
    try {
      const { data } = await favoriteApi.list({ perPage: 1000 })
      const results = Array.isArray(data) ? data : data?.results ?? []
      setFavoriteIds(new Set(results.map((f) => f.product)))
    } catch (err) {
      setError(err.message || 'Impossible de charger les favoris')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback(
    (productId) => favoriteIds.has(productId),
    [favoriteIds]
  )

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!isAuthenticated()) {
        return toast.error('Connectez-vous pour gérer vos favoris')
      }

      if (isFavorite(productId)) {
        // Retirer des favoris
        setLoading(true)
        try {
          const { data } = await favoriteApi.list({ perPage: 1000 })
          const results = Array.isArray(data) ? data : data?.results ?? []
          const fav = results.find((f) => f.product === productId)
          if (fav?.id) {
            await favoriteApi.remove(fav.id)
            setFavoriteIds((prev) => {
              const next = new Set(prev)
              next.delete(productId)
              return next
            })
          }
        } catch (err) {
          setError(err.message || 'Impossible de retirer des favoris')
        } finally {
          setLoading(false)
        }
      } else {
        // Ajouter aux favoris
        setLoading(true)
        try {
          await favoriteApi.create({ product: productId, stars: 5 })
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.add(productId)
            return next
          })
        } catch (err) {
          setError(err.response?.data?.detail || 'Impossible d\'ajouter aux favoris')
        } finally {
          setLoading(false)
        }
      }
    },
    [isFavorite]
  )

  return { favoriteIds, isFavorite, toggleFavorite, loading, error, refetch: loadFavorites }
}
