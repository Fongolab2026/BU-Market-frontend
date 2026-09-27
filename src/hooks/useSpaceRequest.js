import { useCallback, useEffect, useState } from 'react'
import { boutiqueApi, isAuthenticated } from '../services'

/** Statuts qui bloquent une nouvelle demande de location d'espace. */
const OPEN_STATUSES = ['pending', 'validated']

/**
 * Statut de la demande de location d'espace du commerçant connecté.
 *
 * null  -> pas de demande, ou visiteur non connecté, ou appel en cours/échoué
 * 'pending' | 'validated' | 'rejected' | 'suspended'
 *
 * `rejected` et `suspended` autorisent une nouvelle soumission.
 */
export function useSpaceRequest(user) {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!isAuthenticated()) {
      setStatus(null)
      return null
    }
    setLoading(true)
    try {
      const { data } = await boutiqueApi.myRequest()
      const next = data?.status ?? null
      setStatus(next)
      return next
    } catch {
      // Une demande antérieure sans propriétaire (visiteur non connecté)
      // reste invisible : on retombe sur l'état « aucune demande ».
      setStatus(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, user])

  return {
    status,
    loading,
    /** true si une soumission est bloquée par une demande en cours. */
    hasOpenRequest: OPEN_STATUSES.includes(status),
    /** true si le commerçant doit devenir (ou est déjà) vendeur. */
    isSellerByRequest: status === 'validated',
    refresh: load,
  }
}
