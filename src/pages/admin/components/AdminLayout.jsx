import {
  Bell,
  Building2,
  ClipboardList,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  ShoppingBag,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import UnifiedNavbar from "../../../components/UnifiedNavbar.jsx";

const navigationGroups = [
  {
    label: "Aperçu",
    items: [
      {
        to: "/admin/tableau-de-bord",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Comptes",
    items: [
      { to: "/admin/utilisateurs", label: "Utilisateurs", icon: UsersRound },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { to: "/admin/boutiques", label: "Boutiques", icon: Building2 },
      { to: "/admin/produits", label: "Produits", icon: Package },
      { to: "/admin/categories", label: "Catégories", icon: Layers },
    ],
  },
  {
    label: "Commerce",
    items: [
      { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
      { to: "/admin/avis", label: "Avis", icon: Star },
      { to: "/admin/demandes", label: "Demandes", icon: ClipboardList },
      { to: "/admin/messages", label: "Messages", icon: Mail },
    ],
  },
  {
    label: "Système",
    items: [
      { to: "/admin/notifications", label: "Notifications", icon: Bell },
      { to: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <UnifiedNavbar onOpenMenu={() => setIsSidebarOpen(true)} />
      {isSidebarOpen && (
        <button
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-1">
          <NavLink
            to="/admin/tableau-de-bord"
            className="flex items-center gap-3"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-lg font-black text-brand shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
              B
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-white">
                BUMA
              </span>
              <span className="block text-[11px] font-medium tracking-wide text-white/55">
                Buja Market
              </span>
            </span>
          </NavLink>
          <button
            aria-label="Fermer le menu"
            className="p-2 text-white/70 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="mt-8 space-y-5 overflow-y-auto pr-1"
          aria-label="Navigation principale"
        >
          {navigationGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition ${isActive ? "border-accent bg-white/10 text-white" : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"}`
                    }
                  >
                    <Icon size={18} strokeWidth={2} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Espace gestion
          </p>
          <p className="mt-1 text-xs leading-5 text-white/55">
            Administration de la plateforme BUJA MARKET.
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64 pt-12">
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
