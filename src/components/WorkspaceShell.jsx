import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Moon,
  Settings,
  Store,
  Sun,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useFavorites } from "../hooks/useFavorites";
import Avatar from "./Avatar.jsx";

/**
 * Coquille commune des espaces connectés (vendeur + administration).
 *
 * Reprend l'identité visuelle du projet : barre latérale blanche, option active
 * en orange plein (`bg-primary`) avec texte en `text-primary-content` et
 * en-tête adapté au thème clair/sombre. L'en-tête
 * porte le logo du projet ; les entrées de navigation sont fournies par
 * l'appelant, l'état actif suit l'URL via `NavLink` et le contenu des routes
 * s'affiche dans `<Outlet />`.
 */

export default function WorkspaceShell({
  groups = [],
  notificationsPath,
  notificationsCount = 0,
  logoutPath = "/",
  profilePath = "/profil",
  profileName = "Utilisateur",
  profileSubtitle = "",
  profilePhoto,
  profileInitials = "?",
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { favoriteIds, loading: favoritesLoading } = useFavorites();
  const favoriteCount = favoriteIds.size;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
    navigate(logoutPath, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= BARRE LATÉRALE ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-base-300/70 bg-white text-base-content shadow-xl transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 items-center justify-end border-b border-base-300 px-4 lg:hidden">
            <button
              type="button"
              aria-label="Fermer le menu"
              className="rounded-lg p-1.5 text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            className="flex-1 space-y-5 overflow-y-auto p-3"
            aria-label="Navigation principale"
          >
            {groups.map((group) => {
              const items = (group.items || []).filter(Boolean);
              if (items.length === 0) return null;
              return (
                <div key={group.section}>
                  <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-primary/60">
                    {group.section}
                  </p>
                  <div className="space-y-1">
                    {items.map(({ to, label, icon: Icon, badge, dot }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                            isActive
                              ? "bg-primary font-semibold text-primary-content shadow-sm"
                              : "font-medium text-primary/90 hover:bg-primary/10 hover:text-primary"
                          }`
                        }
                      >
                        <Icon className="size-[18px]" strokeWidth={2} />
                        <span className="flex-1 truncate">{label}</span>
                        {badge > 0 && (
                          <span className="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                        {dot && <span className="size-2 rounded-full bg-primary-content" />}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Déconnexion fixée en bas de la barre latérale */}
        <div className="shrink-0 border-t border-base-300 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary/80 transition hover:bg-rose-500/15 hover:text-rose-600"
          >
            <LogOut className="size-[18px]" strokeWidth={2} />
            <span className="flex-1 truncate">Déconnexion</span>
          </button>
        </div>

      </aside>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-base-300/70 bg-base-100/90 px-3 backdrop-blur sm:gap-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Logo du projet — purement visuel (non cliquable) */}
            <div className="flex min-w-0 items-center gap-3" aria-label="BU-Marché">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-content shadow-sm">
                <Store className="size-5" />
              </span>
              <span className="hidden min-w-0 items-center gap-1 sm:flex">
                <span className="text-lg font-extrabold tracking-tight text-base-content">BU-</span>
                <span className="text-lg font-medium text-base-content/60">Marché</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/favoris"
              title="Mes favoris"
              aria-label="Mes favoris"
              className="relative rounded-full p-2 text-base-content/70 transition hover:bg-base-200 hover:text-base-content"
            >
              <Heart
                className={`size-5 ${favoriteCount > 0 ? "fill-current text-red-500" : ""}`}
              />
              {favoriteCount > 0 && !favoritesLoading && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {favoriteCount > 99 ? "99+" : favoriteCount}
                </span>
              )}
            </NavLink>

            {notificationsPath && (
              <NavLink
                to={notificationsPath}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-base-content/70 transition hover:bg-base-200 hover:text-base-content"
              >
                <Bell className="size-5" />
                {notificationsCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-base-100" />
                )}
              </NavLink>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
              className="rounded-full p-2 text-base-content/70 transition hover:bg-base-200 hover:text-base-content"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>

            <div className="mx-1 hidden h-5 w-px bg-base-300 sm:block" />

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-base-200"
              >
                <Avatar
                  src={profilePhoto}
                  name={profileName}
                  fallback={profileInitials}
                  alt="Photo de profil"
                  className="size-9 rounded-full bg-primary/15 text-xs font-bold text-primary"
                />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-36 truncate text-xs font-semibold leading-tight">
                    {profileName}
                  </span>
                  <span className="block max-w-36 truncate text-[11px] text-base-content/50">
                    {profileSubtitle}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 text-base-content/50 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
                  <div className="border-b border-base-300 px-4 py-3">
                    <p className="truncate text-sm font-semibold">{profileName}</p>
                    <p className="truncate text-xs text-base-content/50">{profileSubtitle}</p>
                  </div>
                  <div className="p-1.5 text-sm">
                    <NavLink
                      to={profilePath}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-base-content/80 transition hover:bg-base-200"
                    >
                      <Settings className="size-4" />
                      Paramètres du profil
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-error transition hover:bg-error/10"
                    >
                      <LogOut className="size-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1440px] space-y-6">
            {children}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
