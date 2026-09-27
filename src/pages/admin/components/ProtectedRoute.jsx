import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import { isAuthenticated } from '../../../services/api.js'

/**
 * Garde de route. Les chemins de repli sont imposés par l'appelant afin
 * qu'un espace protégé ne puisse jamais renvoyer vers une interface
 * qui ne lui appartient pas.
 */
export function ProtectedRoute({ allowedRoles, loginPath = "/admin/connexion", deniedPath = "/admin/acces-refuse" }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // Un jeton d'accès est obligatoire : la seule presence d'une session
  // dans le localStorage ne suffit pas à ouvrir une page protegee.
  if (!isAuthenticated() || !user) {
    return <Navigate to={loginPath} replace state={{ from: location?.pathname || "/admin" }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={deniedPath} replace state={{ from: location?.pathname || "/admin" }} />
  }

  return <Outlet />
}
