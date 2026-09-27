import { Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "../../pages/admin/components/AdminLayout.jsx";
import { ProtectedRoute } from "../../pages/admin/components/ProtectedRoute.jsx";
import { CategoriesPage } from "../../pages/admin/modules/categories/pages/CategoriesPage.jsx";
import { DashboardPage } from "../../pages/admin/modules/dashboard/pages/DashboardPage.jsx";
import { MessagesPage } from "../../pages/admin/modules/messages/pages/MessagesPage.jsx";
import { NotificationsPage } from "../../pages/admin/modules/notifications/pages/NotificationsPage.jsx";
import { CommandesPage } from "../../pages/admin/modules/orders/pages/CommandesPage.jsx";
import { ProduitsPage } from "../../pages/admin/modules/products/pages/ProduitsPage.jsx";
import { DemandesLocationPage } from "../../pages/admin/modules/shops/pages/DemandesLocationPage.jsx";
import { AvisPage } from "../../pages/admin/modules/reviews/pages/AvisPage.jsx";
import { SettingsPage } from "../../pages/admin/modules/settings/pages/SettingsPage.jsx";
import { BoutiquesPage } from "../../pages/admin/modules/shops/pages/BoutiquesPage.jsx";
import { UserDetailPage } from "../../pages/admin/modules/users/pages/UserDetailPage.jsx";
import { UsersPage } from "../../pages/admin/modules/users/pages/UsersPage.jsx";
import { DemandesPage } from "../../pages/admin/modules/requests/pages/DemandesPage.jsx";
import { MerchantLayout } from "../../pages/merchant/components/MerchantLayout.jsx";
import { MerchantCategoriesPage } from "../../pages/merchant/modules/categories/pages/MerchantCategoriesPage.jsx";
import { MerchantCompetitorsPage } from "../../pages/merchant/modules/competitors/pages/MerchantCompetitorsPage.jsx";
import { MerchantDashboardPage } from "../../pages/merchant/modules/dashboard/pages/MerchantDashboardPage.jsx";
import { MerchantMessagesPage } from "../../pages/merchant/modules/messages/pages/MerchantMessagesPage.jsx";
import { MerchantOrdersPage } from "../../pages/merchant/modules/orders/pages/MerchantOrdersPage.jsx";
import { MerchantProductsPage } from "../../pages/merchant/modules/products/pages/MerchantProductsPage.jsx";
import { MerchantShopPage } from "../../pages/merchant/modules/shop/pages/MerchantShopPage.jsx";
import { isAuthenticated } from "../../services/api.js";
import DetailProduit from "../Pages/DetailProduit.jsx";
import Home from "../Pages/Home.jsx";

function RequireUser() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/connexion" replace />;
}

export const protectedRoutes = [
  {
    element: <RequireUser />,
    children: [
      { index: true, element: <Home /> },
      { path: "produit/:id", element: <DetailProduit /> },
    ],
  },
  {
    path: "admin",
    element: <Outlet />,
    children: [
      { index: true, element: <Navigate to="connexion" replace /> },
      { path: "connexion", element: <Navigate to="/admin/connexion" replace /> },
      { path: "acces-refuse", element: <Navigate to="/admin/acces-refuse" replace /> },
      {
        element: (
          <ProtectedRoute
            allowedRoles={["admin"]}
            loginPath="/admin/connexion"
            deniedPath="/admin/acces-refuse"
          />
        ),
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="tableau-de-bord" replace /> },
              { path: "tableau-de-bord", element: <DashboardPage /> },
              { path: "utilisateurs", element: <UsersPage /> },
              { path: "utilisateurs/:userId", element: <UserDetailPage /> },
              { path: "boutiques", element: <BoutiquesPage /> },
              { path: "demandes-location", element: <DemandesLocationPage /> },
              { path: "demandes", element: <DemandesPage /> },
              { path: "produits", element: <ProduitsPage /> },
              { path: "categories", element: <CategoriesPage /> },
              { path: "commandes", element: <CommandesPage /> },
              { path: "avis", element: <AvisPage /> },
              { path: "messages", element: <MessagesPage /> },
              { path: "notifications", element: <NotificationsPage /> },
              { path: "parametres", element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "marchand",
    element: <Outlet />,
    children: [
      { index: true, element: <Navigate to="connexion" replace /> },
      { path: "connexion", element: <Navigate to="/connexion" replace /> },
      {
        element: (
          <ProtectedRoute
            allowedRoles={["merchant"]}
            loginPath="/connexion"
            deniedPath="/connexion"
          />
        ),
        children: [
          {
            element: <MerchantLayout />,
            children: [
              { index: true, element: <Navigate to="tableau-de-bord" replace /> },
              { path: "tableau-de-bord", element: <MerchantDashboardPage /> },
              { path: "boutique", element: <MerchantShopPage /> },
              { path: "produits", element: <MerchantProductsPage /> },
              { path: "commandes", element: <MerchantOrdersPage /> },
              { path: "messages", element: <MerchantMessagesPage /> },
              { path: "categories", element: <MerchantCategoriesPage /> },
              { path: "concurrents", element: <MerchantCompetitorsPage /> },
            ],
          },
        ],
      },
    ],
  },
];
