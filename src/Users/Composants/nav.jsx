import {
  ChevronDown,
  ClipboardList,
  Bell,
  Heart,
  LogOut,
  Menu,
  Moon,
  Repeat,
  Settings,
  ShoppingCart,
  Store,
  Sun,
  User,
  X,
} from "lucide-react";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useFavorites } from "../../hooks/useFavorites";
import { notificationApi, orderApi } from "../../services";
import { clearTokens, isAuthenticated } from "../../services/api";

const NAV_LINKS = [
  { label: "Accueil", path: "/accueil" },
  { label: "Produits", path: "/accueil#produits" },
  { label: "À propos", path: "/accueil#a-propos" },
  { label: "Contact", path: "/accueil#contact" },
];

export default function NavBar({ variant, mobileOpen: controlledOpen, onToggleMobile, onCloseMobile }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = controlledOpen ?? internalMobileOpen;
  const toggleMobile = () => {
    if (controlledOpen !== undefined) onToggleMobile?.();
    else setInternalMobileOpen((open) => !open);
  };
  const closeMobile = () => {
    if (controlledOpen !== undefined) onCloseMobile?.();
    else setInternalMobileOpen(false);
  };

  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  const { itemCount: cartCount } = useCart();
  const favoriteCount = favoriteIds.size;
  const authenticated = isAuthenticated();
  const showLandingAuth = variant === "landing";

  const displayName =
    user?.firstName || user?.first_name || user?.username || "Utilisateur";
  const initials =
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ""}`.toUpperCase() ||
    "U";
  const profileImage =
    user?.profile_pic || user?.profilePic || user?.avatar || user?.photo;

  useEffect(() => {
    if (!authenticated) {
      setPendingOrderCount(0);
      return undefined;
    }

    let active = true;
    const refreshPendingOrders = async () => {
      try {
        let page = 1;
        let pending = 0;
        let hasNextPage = true;
        while (hasNextPage) {
          const { data } = await orderApi.list({ page });
          const orders = Array.isArray(data) ? data : data?.results ?? [];
          pending += orders.filter((order) => order.status === 'pending').length;
          hasNextPage = !Array.isArray(data) && Boolean(data?.next);
          page += 1;
        }
        if (active) setPendingOrderCount(pending);
      } catch {
        // La navigation reste utilisable si le compteur ne peut pas être chargé.
      }
    };

    refreshPendingOrders();
    const intervalId = window.setInterval(refreshPendingOrders, 30000);
    window.addEventListener('focus', refreshPendingOrders);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshPendingOrders);
    };
  }, [authenticated, user?.id]);

  useEffect(() => {
    if (!authenticated) {
      setUnreadNotificationCount(0);
      return undefined;
    }

    let active = true;
    const refreshNotifications = async () => {
      try {
        const { data } = await notificationApi.list({ is_read: false, page: 1 });
        const unread = Array.isArray(data)
          ? data.length
          : Number(data?.count ?? data?.total ?? data?.results?.length ?? 0);
        if (active) setUnreadNotificationCount(unread);
      } catch {
        // L'icône reste disponible même si le compteur n'est pas joignable.
      }
    };

    refreshNotifications();
    const intervalId = window.setInterval(refreshNotifications, 30000);
    window.addEventListener('focus', refreshNotifications);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshNotifications);
    };
  }, [authenticated, user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearTokens();
    signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const handleNavLink = (path) => {
    closeMobile();
    const [base, id] = path.split("#");
    if (id) {
      navigate(base || "/accueil", { replace: false });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 shadow-sm shadow-base-content/3 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        {/* Logo du projet — purement visuel (non cliquable) */}
        <div className="flex shrink-0 items-center gap-2.5" aria-label="BU-Market">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/20">
            <Store size={21} strokeWidth={2.2} />
          </span>
          <span className="hidden text-[17px] font-extrabold tracking-tight text-base-content sm:block">
            BU<span className="text-primary">Market</span>
          </span>
        </div>

        {showLandingAuth ? (
          <nav className="ml-auto flex items-center gap-1.5 sm:gap-2" aria-label="Authentification">
            <Button
              type="button"
              onClick={toggleTheme}
              icon={isDark ? <Sun size={21} /> : <Moon size={21} />}
              title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              text
              rounded
              className="flex! size-10! items-center! justify-center! text-base-content/65! transition-colors hover:bg-base-200! hover:text-primary!"
            />
            <Link to="/inscription" className="btn btn-ghost btn-sm px-3 sm:px-4">
              Inscription
            </Link>
            <Link to="/connexion" className="btn btn-accent btn-sm px-3 sm:px-5">
              Connexion
            </Link>
          </nav>
        ) : (
          <>
            <nav
              className="hidden flex-1 justify-center md:flex"
              aria-label="Navigation principale"
            >
              <ul className="flex items-center gap-7">
                {NAV_LINKS.map(({ label, path }) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => handleNavLink(path)}
                      className="relative px-0 py-2 text-[13px] font-semibold text-base-content/70 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/favoris"
            title="Mes favoris"
            aria-label="Mes favoris"
            className="relative inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary"
          >
            <Heart size={21} className={favoriteCount > 0 ? "fill-current text-red-500" : ""} />
            {favoriteCount > 0 && !favoritesLoading && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {favoriteCount > 99 ? "99+" : favoriteCount}
              </span>
            )}
          </Link>

          <Link
            to="/panier"
            title="Mon panier"
            aria-label={
              cartCount > 0
                ? `Mon panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`
                : "Mon panier"
            }
            className="relative inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary"
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-content ring-2 ring-base-100">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {authenticated && (
            <Link
              to="/commandes"
              title="Commandes en attente"
              aria-label={pendingOrderCount > 0
                ? `Commandes en attente, ${pendingOrderCount}`
                : 'Mes commandes'}
              className="relative inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary"
            >
              <ClipboardList size={21} />
              {pendingOrderCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-content ring-2 ring-base-100">
                  {pendingOrderCount > 99 ? '99+' : pendingOrderCount}
                </span>
              )}
            </Link>
          )}

          {authenticated && (
            <Link
              to="/notifications"
              title="Mes notifications"
              aria-label={unreadNotificationCount > 0
                ? `Mes notifications, ${unreadNotificationCount} non lue${unreadNotificationCount > 1 ? 's' : ''}`
                : 'Mes notifications'}
              className="relative inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary"
            >
              <Bell size={21} />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-error-content ring-2 ring-base-100">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              )}
            </Link>
          )}

          <Button
            type="button"
            onClick={toggleTheme}
            icon={isDark ? <Sun size={21} /> : <Moon size={21} />}
            title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            aria-label={
              isDark ? "Activer le mode clair" : "Activer le mode sombre"
            }
            text
            rounded
            className="flex! size-10! items-center! justify-center! text-base-content/65! transition-colors hover:bg-base-200! hover:text-primary!"
          />

          <Button
            type="button"
            onClick={toggleMobile}
            icon={mobileOpen ? <X size={22} /> : <Menu size={22} />}
            aria-label="Menu"
            text
            rounded
            className="inline-flex! size-10! items-center! justify-center! text-base-content/65! transition-colors hover:bg-base-200! hover:text-primary! md:hidden!"
          />

          {/* Photo / avatar + menu paramètres */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition-colors hover:border-base-300/70 hover:bg-base-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                {profileImage ? (
                  <img src={profileImage} alt="" className="h-full w-full object-cover" />
                ) : initials ? (
                  initials
                ) : (
                  <User size={20} />
                )}
              </span>
              <span className="hidden max-w-28 truncate text-[13px] font-semibold text-base-content md:block">
                {displayName}
              </span>
              <ChevronDown
                size={16}
                className={`hidden text-base-content/50 transition-transform duration-200 sm:block ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-base-300/80 bg-base-100 shadow-xl shadow-base-content/10">
                <div className="border-b border-base-300/70 bg-base-200/40 px-4 py-3.5">
                  <p className="text-sm font-semibold text-base-content">
                    {authenticated ? displayName : "Invité"}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {authenticated
                      ? user?.email || "Gérer mon espace"
                      : "Connectez-vous"}
                  </p>
                </div>

                <ul className="p-2 text-sm">
                  <li>
                    <Link
                      to="/profil"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
                    >
                      <Settings size={18} />
                      Paramètres du profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connexion"
                      onClick={() => {
                        clearTokens();
                        setMenuOpen(false);
                      }}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
                    >
                      <Repeat size={18} />
                      Changer de compte
                    </Link>
                  </li>
                </ul>

                <div className="border-t border-base-300/70 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-error transition-colors hover:bg-error/10"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
            </div>
            </div>
          </>
        )}
      </div>

      {!showLandingAuth && mobileOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-base-300/70 bg-base-100/95 px-4 py-4 shadow-lg shadow-base-content/10 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-7xl" aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1.5">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => handleNavLink(path)}
                    className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-base-content/75 transition-colors hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
