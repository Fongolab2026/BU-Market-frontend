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

const initialsOf = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "A";

const groups = [
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
      { to: "/admin/demandes-location", label: "Demandes location", icon: Building2 },
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
      { to: "/admin/messages", label: "Messages", icon: Mail },
    ],
  },
  {
    section: "Système",
    items: [
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
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
      logoutPath="/admin/connexion"
      profilePath="/admin/profil"
      profileName={displayName}
      profileSubtitle="Administrateur"
      profilePhoto={user?.profile_pic || user?.profilePic}
      profileInitials={initialsOf(displayName)}
    />
  );
}
