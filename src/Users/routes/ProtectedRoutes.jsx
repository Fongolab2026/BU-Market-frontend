import { Navigate } from 'react-router-dom'
import { AdminLayout } from '../../Admin/components/AdminLayout.jsx'
import { ProtectedRoute } from '../../Admin/components/ProtectedRoute.jsx'
import { DashboardPage } from '../../Admin/pages/DashboardPage.jsx'
import { MerchantDetailPage } from '../../Admin/pages/MerchantDetailPage.jsx'
import { SettingsPage } from '../../Admin/pages/SettingsPage.jsx'
import { UsersPage } from '../../Admin/pages/UsersPage.jsx'

export const protectedRoutes = [
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="tableau-de-bord" replace /> },
          { path: 'tableau-de-bord', element: <DashboardPage /> },
          { path: 'utilisateurs', element: <UsersPage /> },
          { path: 'utilisateurs/:userId', element: <MerchantDetailPage /> },
          { path: 'parametres', element: <SettingsPage /> },
        ],
      },
    ],
  },
]