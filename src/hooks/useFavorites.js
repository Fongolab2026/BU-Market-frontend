import { useCallback, useEffect, useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'
import { favoriteApi, getAccessToken, isAuthenticated } from '../services'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Store partagé des favoris.
 *
 * Avant, chaque carte produit montait son propre `useFavorites` : une page de
 * 20 produits déclenchait donc 20 fois `GET /favorites/favorites/`. Le store
 * ci-dessous mutualise l'état et la requête entre tous les composants
 * (navbar, cartes, page favoris…), ce qui supprime ces appels en double et
 * rend l'accueil nettement plus fluide une fois connecté.
 */
let favoriteIds = new Set()
let favoriteRecords = new Map()
let loading = false
let loaded = false
let loadedToken = null
let error = null
let inFlight = null
let listeners = new Set()

let snapshot = { favoriteIds, loading, error, loaded }

function publish() {
  snapshot = { favoriteIds, loading, error, loaded }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return snapshot
}

function resetStore() {
  if (!favoriteIds.size && !loading && !loaded && !error) return
  favoriteIds = new Set()
  favoriteRecords = new Map()
  loading = false
  loaded = false
  loadedToken = null
  inFlight = null
  error = null
  publish()
}

function setLocalFavorite(productId, liked) {
  const nextIds = new Set(favoriteIds)
  if (liked) nextIds.add(productId)
  else nextIds.delete(productId)
  favoriteIds = nextIds
  if (!liked) favoriteRecords.delete(productId)
  publish()
}

/** Charge les favoris une seule fois par session, pour tous les composants. */
async function ensureFavorites(token) {
  if (!token || !isAuthenticated()) return null
  if (loaded && loadedToken === token) return null
  if (inFlight && inFlight.token === token) return inFlight.promise

  loading = true
  error = null
  publish()

  const promise = favoriteApi
    .listAll()
    .then((results) => {
      // Une déconnexion (ou un changement de compte) pendant la requête ne
      // doit pas repeupler le store avec les favoris de l'ancien compte.
      if (getAccessToken() !== token) return
      favoriteRecords = new Map(results.map((favorite) => [favorite.product, favorite.id]))
      favoriteIds = new Set(results.map((favorite) => favorite.product))
      loaded = true
      loadedToken = token
    })
    .catch((err) => {
      if (getAccessToken() !== token) return
      error = err?.message || 'Impossible de charger les favoris'
    })
    .finally(() => {
      if (inFlight?.token === token) {
        inFlight = null
        loading = false
      }
      publish()
    })

  inFlight = { token, promise }
  return promise
}

export function useFavorites() {
  const { user } = useAuth()
  const userId = user?.id

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  useEffect(() => {
    const token = getAccessToken()
    if (!userId || !token) {
      resetStore()
      return
    }
    ensureFavorites(token)
  }, [userId])

  const isFavorite = useCallback((productId) => favoriteIds.has(productId), [])

  const toggleFavorite = useCallback(async (productId) => {
    if (!isAuthenticated()) {
      toast.error('Connectez-vous pour gérer vos favoris')
      return null
    }

    const id = Number(productId)
    const wasFavorite = favoriteIds.has(id)
    // Mise à jour optimiste : le cœur réagit immédiatement au clic.
    setLocalFavorite(id, !wasFavorite)

    try {
      if (wasFavorite) {
        let recordId = favoriteRecords.get(id)
        if (!recordId) {
          const results = await favoriteApi.listAll()
          recordId = results.find((favorite) => favorite.product === id)?.id
        }
        if (!recordId) throw new Error('Favori introuvable')
        await favoriteApi.remove(recordId)
        favoriteRecords.delete(id)
      } else {
        const { data } = await favoriteApi.create({ product: id, stars: 5 })
        if (data?.id) favoriteRecords.set(id, data.id)
        if (!loaded && getAccessToken()) {
          loaded = true
          loadedToken = getAccessToken()
        }
      }
      return !wasFavorite
    } catch (err) {
      // En cas d'échec, on rétablit l'état précédent.
      setLocalFavorite(id, wasFavorite)
      error = err.response?.data?.detail || err.message || 'Impossible de mettre à jour les favoris'
      publish()
      toast.error(error)
      return wasFavorite
    }
  }, [])

  const refetch = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      resetStore()
      return
    }
    loaded = false
    loadedToken = null
    await ensureFavorites(token)
  }, [])

  return {
    favoriteIds: snapshot.favoriteIds,
    isFavorite,
    toggleFavorite,
    loading: snapshot.loading,
    error: snapshot.error,
    refetch,
  }
}

// Le store n'a pas besoin de la valeur retournée pour rester synchrone ; ces
// exports facilitent les tests et les rafraîchissements manuels éventuels.
export const favoritesStore = { resetStore, getSnapshot }
