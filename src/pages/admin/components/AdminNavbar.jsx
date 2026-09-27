import { Bell, LogOut, Menu, Moon, ShieldCheck, Sun } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";

const displayName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  user?.username ||
  user?.email ||
  "Administrateur";

const initialsOf = (user) => {
  const source = user?.firstName || user?.username || user?.email || "A";
  return String(source).trim().charAt(0).toUpperCase();
};

/**
 * Barre supérieure de l'espace administrateur. Volontairement distincte de
 * UnifiedNavbar : tous les liens et la déconnexion restent confines à /admin
 * pour ne jamais renvoyer vers les interfaces clients ou commerçants.
 */
export function AdminNavbar({ onOpenMenu, section }) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    signOut();
    navigate("/admin/connexion", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-5">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            className="btn btn-ghost btn-circle lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
        )}

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            Espace gestion
          </p>
          <h2 className="truncate text-base font-bold tracking-tight text-base-content">
            {section || "Administration"}
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/admin/notifications"
            title="Notifications"
            aria-label="Notifications"
            className="btn btn-ghost btn-circle"
          >
            <Bell size={21} />
          </NavLink>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            className="btn btn-ghost btn-circle"
          >
            {isDark ? <Sun size={21} /> : <Moon size={21} />}
          </button>

          <div className="ml-1 flex items-center gap-2 border-l border-base-300/70 pl-2 sm:ml-2 sm:pl-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand ring-1 ring-brand/20">
              {initialsOf(user)}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold text-base-content">
                {displayName(user)}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-base-content/60">
                <ShieldCheck size={13} className="text-accent" aria-hidden="true" />
                Administrateur
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Déconnexion"
            className="btn btn-ghost btn-circle text-error transition hover:bg-error/10"
            aria-label="Déconnexion"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
