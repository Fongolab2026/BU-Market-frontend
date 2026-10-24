import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { authApi } from '../services'
import { useSpaceRequest } from './useSpaceRequest.js'

const MERCHANT_ROLES = ['merchant', 'seller']

/**
 * Bascule automatiquement un client vers l'espace marchand dès que sa demande
 * de location d'espace est validée par l'admin, sans reconnexion.
 *
 * Tant qu'une demande est en attente, le statut est revérifié périodiquement.
 * Quand il passe à `validated`, on rafraîchit le profil (le backend a promu le
 * compte en vendeur), on met à jour la session puis on redirige vers l'espace
 * marchand.
 *
 * Le hook est monté une seule fois, à la racine de l'application.
 */
export function useSellerUpgrade({ pollMs = 8000 } = {}) {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const { status, refresh } = useSpaceRequest(user, { pollMs })
  const upgraded = useRef(false)

  useEffect(() => {
    const refreshAfterRequest = () => refresh().catch(() => {})
    window.addEventListener('bu-market:space-request-updated', refreshAfterRequest)
    return () => window.removeEventListener('bu-market:space-request-updated', refreshAfterRequest)
  }, [refresh])

  useEffect(() => {
    if (upgraded.current) return
    if (status !== 'validated') return
    if (MERCHANT_ROLES.includes(user?.role)) return

    upgraded.current = true
    let active = true

    authApi
      .me()
      .then(({ data }) => {
        if (!active) return
        // Rafraîchit la session locale : le rôle devient « merchant ».
        signIn(data)
        toast.success('Votre espace marchand est activé 🎉')
        navigate('/marchand/tableau-de-bord', { replace: true })
      })
      .catch(() => {
        // On autorise une nouvelle tentative si la mise à jour échoue.
        upgraded.current = false
      })

    return () => {
      active = false
    }
  }, [status, user?.role, navigate, signIn])

  return status
}
