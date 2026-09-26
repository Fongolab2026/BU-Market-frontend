import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'

export function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/connexion" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}