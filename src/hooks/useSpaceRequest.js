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
 *
 * Options :
 * - `pollMs` : si > 0, le statut est revérifié périodiquement tant qu'une
 *   demande est en attente (`pending`), ce qui permet de détecter la
 *   validation par l'admin sans recharger la page.
 */
export function useSpaceRequest(user, { pollMs = 0 } = {}) {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  /** Relecture silencieuse (n'active pas l'état `loading`). */
  const refreshStatus = useCallback(async () => {
    if (!isAuthenticated()) {
      setStatus(null)
      return null
    }
    const { data } = await boutiqueApi.myRequest()
    const next = data?.status ?? null
    setStatus(next)
    return next
  }, [])

  const load = useCallback(async () => {
    if (!isAuthenticated()) {
      setStatus(null)
      return null
    }
    setLoading(true)
    try {
      return await refreshStatus()
    } catch {
      // Une demande antérieure sans propriétaire (visiteur non connecté)
      // reste invisible : on retombe sur l'état « aucune demande ».
      setStatus(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [refreshStatus])

  useEffect(() => {
    load()
  }, [load, user])

  useEffect(() => {
    if (!pollMs || !isAuthenticated() || status !== 'pending') return undefined
    const id = setInterval(() => {
      refreshStatus().catch(() => {})
    }, pollMs)
    return () => clearInterval(id)
  }, [pollMs, status, refreshStatus])

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
