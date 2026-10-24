import {
  Bell,
  ChevronDown,
  ClipboardList,
  Heart,
  LogOut,
  Menu,
  Moon,
  Package,
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
import { apiGet, clearTokens, endpoints, isAuthenticated } from "../../services/api";
import { BUYER_NOTIFICATIONS_UPDATED } from "../../services/buyerNotificationService.js";

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
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const favoriteCount = favoriteIds.size;
  const authenticated = isAuthenticated();
  const showLandingAuth = variant === "landing";
  const isBuyer = authenticated && !showLandingAuth && user?.role === "client";

  const displayName =
    user?.firstName || user?.first_name || user?.username || "Utilisateur";
  const initials =
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ""}`.toUpperCase() ||
    "U";
  const profileImage =
    user?.profile_pic || user?.profilePic || user?.avatar || user?.photo;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compte les commandes en attente pour l'icône « Mes commandes ».
  useEffect(() => {
    if (!isBuyer) {
      setPendingOrderCount(0);
      return undefined;
    }

    let active = true;
    const loadPendingOrders = async () => {
      try {
        let page = 1;
        let totalPages = 1;
        let pending = 0;
        while (page <= totalPages) {
          const data = await apiGet(endpoints.orders.list, { page, perPage: 1000 });
          const results = Array.isArray(data) ? data : data?.results ?? [];
          pending += results.filter((order) => order.status === "pending").length;
          totalPages = Array.isArray(data) ? page : Number(data?.totalPages ?? data?.total_pages ?? page);
          page += 1;
        }
        if (active) setPendingOrderCount(pending);
      } catch {
        if (active) setPendingOrderCount(0);
      }
    };

    loadPendingOrders();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") loadPendingOrders();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isBuyer, user?.id]);

  // Suit les notifications non lues : les réponses du support client arrivent
  // dans l'espace acheteur sous forme de notifications.
  useEffect(() => {
    if (!isBuyer) {
      setNotificationCount(0);
      return undefined;
    }

    let active = true;
    const load = () => {
      apiGet(endpoints.notifications.unreadCount)
        .then((data) => {
          if (active) setNotificationCount(Number(data?.count) || 0);
        })
        .catch(() => {
          if (active) setNotificationCount(0);
        });
    };

    load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 30000);
    window.addEventListener(BUYER_NOTIFICATIONS_UPDATED, load);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener(BUYER_NOTIFICATIONS_UPDATED, load);
    };
  }, [isBuyer, user?.id]);

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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 shadow-sm shadow-base-content/3 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        {/* Logo du projet — retour à l'accueil */}
        <Link
          to={showLandingAuth ? "/" : "/accueil"}
          onClick={closeMobile}
          aria-label="BU-Market, retour à l'accueil"
          className="flex shrink-0 items-center gap-2.5 rounded-xl transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/20">
            <Store size={21} strokeWidth={2.2} />
          </span>
          <span className="hidden text-[17px] font-extrabold tracking-tight text-base-content sm:block">
            BU<span className="text-primary">Market</span>
          </span>
        </Link>

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
          {isBuyer && (
            <Link
              to="/notifications"
              title="Mes notifications"
              aria-label={
                notificationCount > 0
                  ? `Mes notifications, ${notificationCount} non lue${notificationCount > 1 ? "s" : ""}`
                  : "Mes notifications"
              }
              className="relative inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary"
            >
              <Bell size={21} />
              {notificationCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-content ring-2 ring-base-100">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Link>
          )}

          <Link
            to="/favoris"
            title="Mes favoris"
            aria-label="Mes favoris"
            className="relative hidden size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary sm:inline-flex"
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

          {isBuyer && (
            <Link
              to="/commandes"
              title="Mes commandes"
              aria-label={
                pendingOrderCount > 0
                  ? `Commandes en attente, ${pendingOrderCount}`
                  : "Mes commandes"
              }
              className="relative hidden size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary sm:inline-flex"
            >
              <ClipboardList size={21} />
              {pendingOrderCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-content ring-2 ring-base-100">
                  {pendingOrderCount > 99 ? "99+" : pendingOrderCount}
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
              className="relative flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 transition-colors hover:border-base-300/70 hover:bg-base-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              {isBuyer && notificationCount > 0 && (
                <span
                  className="absolute right-1 top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-base-100 lg:hidden"
                  aria-hidden="true"
                />
              )}
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
                  {isBuyer && (
                    <li>
                      <Link
                        to="/notifications"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
                      >
                        <Bell size={18} />
                        Notifications
                        {notificationCount > 0 && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                            {notificationCount > 99 ? "99+" : notificationCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  )}
                  {isBuyer && (
                    <li>
                      <Link
                        to="/commandes"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
                      >
                        <Package size={18} />
                        Mes commandes
                        {pendingOrderCount > 0 && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                            {pendingOrderCount > 99 ? "99+" : pendingOrderCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  )}
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
              {isBuyer && (
                <>
                  <li className="mt-1.5 border-t border-base-300/70 pt-1.5 sm:hidden">
                    <Link
                      to="/favoris"
                      onClick={closeMobile}
                      className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold text-base-content/75 transition-colors hover:bg-base-200 hover:text-primary"
                    >
                      <Heart
                        size={18}
                        className={favoriteCount > 0 ? "fill-current text-red-500" : ""}
                      />
                      Mes favoris
                      {favoriteCount > 0 && !favoritesLoading && (
                        <span className="ml-auto rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold tabular-nums text-red-500">
                          {favoriteCount > 99 ? "99+" : favoriteCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="sm:mt-1.5 sm:border-t sm:border-base-300/70 sm:pt-1.5">
                    <Link
                      to="/notifications"
                      onClick={closeMobile}
                      className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold text-base-content/75 transition-colors hover:bg-base-200 hover:text-primary"
                    >
                      <Bell size={18} />
                      Notifications
                      {notificationCount > 0 && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/commandes"
                      onClick={closeMobile}
                      className="flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold text-base-content/75 transition-colors hover:bg-base-200 hover:text-primary"
                    >
                      <Package size={18} />
                      Mes commandes
                      {pendingOrderCount > 0 && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                          {pendingOrderCount > 99 ? "99+" : pendingOrderCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
      </header>

      {!showLandingAuth && mobileOpen && (
        <div
          className="fixed inset-0 z-[45] backdrop-blur-md md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </>
  );
}
