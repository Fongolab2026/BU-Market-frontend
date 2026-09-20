import { Navigate } from 'react-router-dom'
import { AdminLayout } from '../../pages/admin/components/AdminLayout.jsx'
import { ProtectedRoute } from '../../pages/admin/components/ProtectedRoute.jsx'
import { DashboardPage } from '../../pages/admin/modules/dashboard/pages/DashboardPage.jsx'
import { UsersPage } from '../../pages/admin/modules/users/pages/UsersPage.jsx'
import { UserDetailPage } from '../../pages/admin/modules/users/pages/UserDetailPage.jsx'
import { BoutiquesPage } from '../../pages/admin/modules/shops/pages/BoutiquesPage.jsx'
import { ProduitsPage } from '../../pages/admin/modules/products/pages/ProduitsPage.jsx'
import { CategoriesPage } from '../../pages/admin/modules/categories/pages/CategoriesPage.jsx'
import { CommandesPage } from '../../pages/admin/modules/orders/pages/CommandesPage.jsx'
import { AvisPage } from '../../pages/admin/modules/reviews/pages/AvisPage.jsx'
import { DemandesPage } from '../../pages/admin/modules/requests/pages/DemandesPage.jsx'
import { MessagesPage } from '../../pages/admin/modules/messages/pages/MessagesPage.jsx'
import { NotificationsPage } from '../../pages/admin/modules/notifications/pages/NotificationsPage.jsx'
import { SettingsPage } from '../../pages/admin/modules/settings/pages/SettingsPage.jsx'

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
          { path: 'utilisateurs/:userId', element: <UserDetailPage /> },
          { path: 'boutiques', element: <BoutiquesPage /> },
          { path: 'produits', element: <ProduitsPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'commandes', element: <CommandesPage /> },
          { path: 'avis', element: <AvisPage /> },
          { path: 'demandes', element: <DemandesPage /> },
          { path: 'messages', element: <MessagesPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'parametres', element: <SettingsPage /> },
        ],
      },
    ],
  },
]