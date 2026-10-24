import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cartApi, cartItemApi, isAuthenticated } from '../services'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

/**
 * Panier partagé par toute l'application.
 *
 * Centralise l'état du panier afin que le badge du navbar et la page panier
 * restent synchronisés : ajouter un produit, changer une quantité ou
 * supprimer une ligne met à jour le compteur partout, sans rechargement.
 */
export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(() => isAuthenticated())
  const [lastRemovedCount, setLastRemovedCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      setCart(null)
      return null
    }
    setLoading(true)
    try {
      // Utiliser l'endpoint current qui crée le panier s'il n'existe pas
      const { data } = await cartApi.current()
      setCart(data)
      return data
    } catch {
      // Le panier est secondaire : on n'interrompt pas la navigation en cas d'échec.
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Recharge le panier à la connexion et le vide à la déconnexion.
  useEffect(() => {
    refresh()
  }, [refresh, user?.id, user?.email])

  // Synchroniser le stock périodiquement (toutes les 30 secondes)
  useEffect(() => {
    if (!isAuthenticated()) return
    const interval = setInterval(() => {
      syncStock()
    }, 30000)
    return () => clearInterval(interval)
  }, [user?.id])

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      const { data } = await cartApi.addItem(productId, quantity)
      if (data.removed_out_of_stock > 0) {
        setLastRemovedCount(data.removed_out_of_stock)
      }
      setCart(data)
      return data
    },
    [],
  )

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const { data } = await cartItemApi.partialUpdate(itemId, { quantity })
    setCart((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) => (item.id === data.id ? data : item)),
          }
        : current,
    )
    return data
  }, [])

  const removeItem = useCallback(async (itemId) => {
    await cartItemApi.remove(itemId)
    setCart((current) =>
      current
        ? { ...current, items: current.items.filter((item) => item.id !== itemId) }
        : current,
    )
  }, [])

  const syncStock = useCallback(async () => {
    if (!isAuthenticated()) return
    try {
      const { data } = await cartApi.syncStock()
      if (data.removed_out_of_stock > 0) {
        setLastRemovedCount(data.removed_out_of_stock)
      }
      setCart(data)
    } catch {
      // Ignorer les erreurs de sync silencieuses
    }
  }, [])

  const checkout = useCallback(async () => {
    if (!isAuthenticated()) {
      throw new Error('Utilisateur non authentifié')
    }
    return cartApi.checkout()
  }, [])

  const items = useMemo(() => cart?.items ?? [], [cart])
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [items],
  )
  const total = Number(cart?.total_prices || 0)

  const value = useMemo(
    () => ({
      cart,
      items,
      itemCount,
      total,
      loading,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      checkout,
      syncStock,
      lastRemovedCount,
      clearRemovedCount: () => setLastRemovedCount(0),
    }),
    [cart, items, itemCount, total, loading, refresh, addItem, updateQuantity, removeItem, checkout, syncStock, lastRemovedCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart doit être utilisé dans CartProvider')
  return context
}
