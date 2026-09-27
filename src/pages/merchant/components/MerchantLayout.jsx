import {
  Building2,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  ShoppingBag,
  Store,
  X,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { authApi } from "../../../services/authService.js";
import UnifiedNavbar from "../../../components/UnifiedNavbar.jsx";

const navigationGroups = (hasShop) => [
  {
    label: "Gestion",
    items: [
      {
        to: "/marchand/tableau-de-bord",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      { to: "/marchand/boutique", label: "Ma boutique", icon: Building2 },
      { to: "/marchand/categories", label: "Catégories", icon: Layers },
    ],
  },
  {
    label: "Ventes",
    items: hasShop
      ? [
          { to: "/marchand/produits", label: "Mes produits", icon: Package },
          { to: "/marchand/commandes", label: "Commandes", icon: ShoppingBag },
        ]
      : [],
  },
  {
    label: "Communication",
    items: hasShop ? [{ to: "/marchand/messages", label: "Messages", icon: Mail }] : [],
  },
  {
    label: "Marché",
    items: hasShop ? [{ to: "/marchand/concurrents", label: "Concurrents", icon: Store }] : [],
  },
];

export function MerchantLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const [hasShop, setHasShop] = useState(false);

  useEffect(() => {
    if (user?.role === "merchant") {
      authApi
        .me()
        .then(({ data }) => {
          setHasShop(data.is_seller && data.shop?.status === "validated");
        })
        .catch(() => {});
    }
  }, [user]);

  const showAlert = hasShop === false && location.pathname !== "/marchand/boutique";

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
            to="/marchand/tableau-de-bord"
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
          {navigationGroups(hasShop).map((group) => (
            <div key={group.label}>
              {group.items.length > 0 && (
                <>
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
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Espace vendeur
          </p>
          <p className="mt-1 text-xs leading-5 text-white/55">
            {hasShop
              ? "Gérez votre boutique et vos ventes sur BUJA MARKET."
              : "Créez votre boutique pour commencer à vendre."}
          </p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64 pt-12">
        {showAlert && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-3 lg:static lg:bg-transparent lg:border-0 lg:px-0 lg:py-0">
            <div className="mx-auto max-w-[1440px] flex items-center gap-3 p-3 lg:p-0">
              <AlertCircle size={20} className="text-amber-600 shrink-0" />
              <div className="flex-1 text-sm text-amber-800">
                Votre boutique n'est pas encore validée. <NavLink to="/marchand/boutique" className="font-semibold underline hover:text-amber-700">Complétez votre demande</NavLink> pour accéder à toutes les fonctionnalités.
              </div>
            </div>
          </div>
        )}
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}