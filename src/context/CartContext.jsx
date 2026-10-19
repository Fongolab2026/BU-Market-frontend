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

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      setCart(null)
      return null
    }
    setLoading(true)
    try {
      const { data } = await cartApi.list()
      const carts = data?.results ?? data
      const next = Array.isArray(carts) ? carts[0] ?? null : null
      setCart(next)
      return next
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

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      await cartApi.addItem(productId, quantity)
      return refresh()
    },
    [refresh],
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
    }),
    [cart, items, itemCount, total, loading, refresh, addItem, updateQuantity, removeItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart doit être utilisé dans CartProvider')
  return context
}
