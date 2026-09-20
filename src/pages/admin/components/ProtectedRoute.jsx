import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'

export function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/connexion" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
