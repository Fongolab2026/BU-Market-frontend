import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSpaceRequest } from '../../hooks/useSpaceRequest.js'
import Loading from '../Composants/Loading.jsx'

/**
 * Empêche d'atteindre /louer-espace quand une demande est déjà en cours
 * (pending) ou validée — le backend refuserait la soumission de toute façon.
 * Une demande rejetée ou suspendue laisse passer : l'utilisateur peut
 * soumettre une nouvelle demande.
 */
export default function RequireNoOpenRequest({ children }) {
  const { user } = useAuth()
  const { hasOpenRequest, loading } = useSpaceRequest(user)
  const location = useLocation()

  if (loading) return <Loading />
  if (hasOpenRequest) return <Navigate to="/" replace state={{ from: location.pathname }} />

  return children
}
