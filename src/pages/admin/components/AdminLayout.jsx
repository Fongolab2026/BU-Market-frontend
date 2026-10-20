import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bell,
  Building2,
  ClipboardList,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  ShoppingCart,
  Star,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";
import WorkspaceShell from "../../../components/WorkspaceShell.jsx";
import { messagesService } from "../modules/messages/services/messagesService.js";
import { notificationsService } from "../modules/notifications/services/notificationsService.js";
import { demandesLocationService } from "../modules/shops/services/demandesLocationService.js";

const initialsOf = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "A";

const buildGroups = ({ messages, notifications, rentalRequests }) => [
  {
    section: "Aperçu",
    items: [
      { to: "/admin/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
    ],
  },
  {
    section: "Comptes",
    items: [{ to: "/admin/utilisateurs", label: "Utilisateurs", icon: UsersRound }],
  },
  {
    section: "Catalogue",
    items: [
      { to: "/admin/boutiques", label: "Boutiques", icon: Building2 },
      {
        to: "/admin/demandes-location",
        label: "Demandes location",
        icon: Building2,
        badge: rentalRequests,
      },
      { to: "/admin/produits", label: "Produits", icon: Package },
      { to: "/admin/categories", label: "Catégories", icon: Layers },
    ],
  },
  {
    section: "Commerce",
    items: [
      { to: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
      { to: "/admin/avis", label: "Avis", icon: Star },
      { to: "/admin/demandes", label: "Demandes", icon: ClipboardList },
      { to: "/admin/messages", label: "Messages", icon: Mail, badge: messages },
    ],
  },
  {
    section: "Système",
    items: [
      { to: "/admin/notifications", label: "Notifications", icon: Bell, badge: notifications },
      { to: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
  {
    section: "Compte",
    items: [{ to: "/admin/profil", label: "Mon profil", icon: Settings }],
  },
];

export function AdminLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [badges, setBadges] = useState({
    messages: 0,
    notifications: 0,
    rentalRequests: 0,
  });

  useEffect(() => {
    let active = true;

    const loadBadges = async () => {
      const [messages, notifications, rentalRequests] = await Promise.all([
        messagesService.unreadCount().catch(() => 0),
        notificationsService.unreadCount().catch(() => 0),
        demandesLocationService.pendingCount().catch(() => 0),
      ]);
      if (active) setBadges({ messages, notifications, rentalRequests });
    };

    loadBadges();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") loadBadges();
    }, 20000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [pathname]);

  const groups = buildGroups(badges);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.first_name ||
    user?.username ||
    user?.email ||
    "Administrateur";

  return (
    <WorkspaceShell
      groups={groups}
      homePath="/admin/tableau-de-bord"
      notificationsPath="/admin/notifications"
      notificationsCount={badges.notifications}
      logoutPath="/admin/connexion"
      profilePath="/admin/profil"
      profileName={displayName}
      profileSubtitle="Administrateur"
      profilePhoto={user?.profile_pic || user?.profilePic}
      profileInitials={initialsOf(displayName)}
    />
  );
}
