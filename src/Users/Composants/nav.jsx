import {
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Repeat,
  Settings,
  Store,
  Sun,
  User,
  X,
} from "lucide-react";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { clearTokens, isAuthenticated } from "../../services/api";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "Produits", path: "/#produits" },
  { label: "À propos", path: "/#a-propos" },
  { label: "Contact", path: "/#contact" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const authenticated = isAuthenticated();

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

  const handleLogout = () => {
    clearTokens();
    signOut();
    setMenuOpen(false);
    navigate("/connexion");
  };

  const handleNavLink = (path) => {
    setMobileOpen(false);
    if (path.startsWith("/#")) {
      navigate("/", { replace: false });
      setTimeout(() => {
        const id = path.replace("/#", "");
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
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={() => setMobileOpen(false)}
          aria-label="BU-Market, accueil"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/20 transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
            <Store size={21} strokeWidth={2.2} />
          </span>
          <span className="hidden text-[17px] font-extrabold tracking-tight text-base-content sm:block">
            BU<span className="text-primary">Market</span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 justify-center md:flex"
          aria-label="Navigation principale"
        >
          <ul className="flex items-center gap-1 rounded-full border border-base-300/70 bg-base-200/55 p-1">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => handleNavLink(path)}
                  className="rounded-full px-4 py-2 text-[13px] font-semibold text-base-content/65 transition-colors hover:bg-base-100 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
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
            onClick={() => setMobileOpen((v) => !v)}
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
      </div>

      {mobileOpen && (
        <div className="border-t border-base-300/70 bg-base-100/95 px-4 py-4 shadow-lg shadow-base-content/4 backdrop-blur-xl md:hidden">
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
