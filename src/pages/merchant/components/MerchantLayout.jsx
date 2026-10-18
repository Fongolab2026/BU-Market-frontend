import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { authApi } from "../../../services/authService.js";
import { merchantNotificationService } from "../modules/notifications/services/merchantNotificationService.js";
import WorkspaceShell from "../../../components/WorkspaceShell.jsx";

const initialsOf = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "V";

export function MerchantLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [hasShop, setHasShop] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role !== "merchant") return;
    authApi
      .me()
      .then(({ data }) => {
        setHasShop(Boolean(data.is_seller && data.shop?.status === "validated"));
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (user?.role !== "merchant") return undefined;
    let active = true;
    const loadUnread = () => {
      merchantNotificationService
        .unreadCount()
        .then((count) => {
          if (active) setUnreadCount(count);
        })
        .catch(() => {});
    };
    loadUnread();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") loadUnread();
    }, 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user]);

  const groups = [
    {
      section: "Gestion",
      items: [
        { to: "/marchand/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
        { to: "/marchand/boutique", label: "Ma boutique", icon: Store },
        { to: "/marchand/categories", label: "Catégories", icon: Layers },
      ],
    },
    {
      section: "Ventes",
      items: [
        { to: "/marchand/produits", label: "Mes produits", icon: Package },
        { to: "/marchand/commandes", label: "Commandes", icon: ShoppingCart },
      ],
    },
    {
      section: "Communication",
      items: [
        { to: "/marchand/messages", label: "Messages", icon: Mail, dot: true },
        {
          to: "/marchand/notifications",
          label: "Notifications",
          icon: Bell,
          badge: unreadCount,
        },
      ],
    },
    {
      section: "Marché",
      items: [{ to: "/marchand/concurrents", label: "Concurrents", icon: Users }],
    },
    {
      section: "Compte",
      items: [{ to: "/marchand/profil", label: "Paramètres du profil", icon: Settings }],
    },
  ];

  const displayName =
    user?.shop?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.first_name ||
    user?.username ||
    "Vendeur";

  const showAlert = hasShop === false && pathname !== "/marchand/boutique";

  return (
    <WorkspaceShell
      groups={groups}
      homePath="/marchand/tableau-de-bord"
      notificationsPath="/marchand/notifications"
      notificationsCount={unreadCount}
      logoutPath="/"
      profilePath="/marchand/profil"
      profileName={displayName}
      profileSubtitle={user?.adresse || "Bujumbura, BI"}
      profilePhoto={user?.profile_pic || user?.profilePic}
      profileInitials={initialsOf(displayName)}
    >
      {showAlert && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle size={20} className="shrink-0 text-amber-600" />
          <div className="flex-1">
            Votre boutique n'est pas encore validée.{" "}
            <Link
              to="/marchand/boutique"
              className="font-semibold underline hover:text-amber-700"
            >
              Complétez votre demande
            </Link>{" "}
            pour accéder à toutes les fonctionnalités.
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
