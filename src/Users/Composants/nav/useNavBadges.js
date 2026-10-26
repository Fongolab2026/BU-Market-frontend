import { useEffect, useState } from 'react'
import { apiGet, endpoints } from '../../../services/api'
import { BUYER_NOTIFICATIONS_UPDATED } from '../../../services/buyerNotificationService.js'

/**
 * Compteurs affichés dans la barre : commandes en attente et notifications non
 * lues. Les deux sont rafraîchis toutes les 30 s lorsque l'onglet est visible.
 */
export default function useNavBadges(isBuyer, userId) {
  const [pendingOrderCount, setPendingOrderCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    if (!isBuyer) {
      setPendingOrderCount(0)
      return undefined
    }

    let active = true
    const loadPendingOrders = async () => {
      try {
        let page = 1
        let totalPages = 1
        let pending = 0
        while (page <= totalPages) {
          const data = await apiGet(endpoints.orders.list, { page, perPage: 1000 })
          const results = Array.isArray(data) ? data : data?.results ?? []
          pending += results.filter((order) => order.status === 'pending').length
          totalPages = Array.isArray(data) ? page : Number(data?.totalPages ?? data?.total_pages ?? page)
          page += 1
        }
        if (active) setPendingOrderCount(pending)
      } catch {
        if (active) setPendingOrderCount(0)
      }
    }

    loadPendingOrders()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') loadPendingOrders()
    }, 30000)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [isBuyer, userId])

  useEffect(() => {
    if (!isBuyer) {
      setNotificationCount(0)
      return undefined
    }

    let active = true
    const load = () => {
      apiGet(endpoints.notifications.unreadCount)
        .then((data) => {
          if (active) setNotificationCount(Number(data?.count) || 0)
        })
        .catch(() => {
          if (active) setNotificationCount(0)
        })
    }

    load()
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, 30000)
    window.addEventListener(BUYER_NOTIFICATIONS_UPDATED, load)

    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener(BUYER_NOTIFICATIONS_UPDATED, load)
    }
  }, [isBuyer, userId])

  return { pendingOrderCount, notificationCount }
}
