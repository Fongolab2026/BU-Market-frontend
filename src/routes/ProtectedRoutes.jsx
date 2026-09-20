import { Navigate } from 'react-router-dom'
import { AdminLayout } from '../pages/admin/components/AdminLayout.jsx'
import { ProtectedRoute } from '../pages/admin/components/ProtectedRoute.jsx'
import { AvisPage } from '../pages/admin/pages/AvisPage.jsx'
import { BoutiquesPage } from '../pages/admin/pages/BoutiquesPage.jsx'
import { DashboardPage } from '../pages/admin/pages/DashboardPage.jsx'
import { DemandesPublicationPage } from '../pages/admin/pages/DemandesPublicationPage.jsx'
import { ListeProduitsPage } from '../pages/admin/pages/ListeProduitsPage.jsx'
import { MerchantDetailPage } from '../pages/admin/pages/MerchantDetailPage.jsx'
import { SettingsPage } from '../pages/admin/pages/SettingsPage.jsx'
import { UsersPage } from '../pages/admin/pages/UsersPage.jsx'

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
          { path: 'demandes', element: <DemandesPublicationPage /> },
          { path: 'boutiques', element: <BoutiquesPage /> },
          { path: 'produits', element: <ListeProduitsPage /> },
          { path: 'avis', element: <AvisPage /> },
          { path: 'parametres', element: <SettingsPage /> },
        ],
      },
    ],
  },
]