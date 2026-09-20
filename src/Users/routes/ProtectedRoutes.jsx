import { Navigate } from 'react-router-dom'
import { AdminLayout } from '../../Admin/components/AdminLayout.jsx'
import { ProtectedRoute } from '../../Admin/components/ProtectedRoute.jsx'
import { AvisPage } from '../../Admin/pages/AvisPage.jsx'
import { BoutiquesPage } from '../../Admin/pages/BoutiquesPage.jsx'
import { DashboardPage } from '../../Admin/pages/DashboardPage.jsx'
import { DemandesPublicationPage } from '../../Admin/pages/DemandesPublicationPage.jsx'
import { ListeProduitsPage } from '../../Admin/pages/ListeProduitsPage.jsx'
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