import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  User,
  Repeat,
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronDown,
  Store,
  LayoutDashboard,
  Package,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function UnifiedNavbar() {
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const { isDark, toggleTheme } = useTheme()
  const { user, signOut, isDemo, switchDemoRole } = useAuth()
  const authenticated = !!user

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const currentRole = user?.role

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5">
        {/* Logo + titre */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Accueil BU-Market">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
            <Store size={22} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-base-content sm:block">
            BU-<span className="text-primary">Market</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Favoris */}
          <Link
            to="/favoris"
            title="Mes favoris"
            className="btn btn-ghost btn-circle relative"
          >
            <Heart size={22} />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className="btn btn-ghost btn-circle"
          >
            {isDark ? <Sun size={21} /> : <Moon size={21} />}
          </button>

          {/* Photo / avatar + menu paramètres */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-base-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <User size={20} />
              </span>
              <ChevronDown
                size={16}
                className={`hidden text-base-content/60 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-box border border-base-300/70 bg-base-100 shadow-xl">
                <div className="border-b border-base-300/70 px-4 py-3">
                  <p className="text-sm font-semibold text-base-content">
                    {authenticated
                      ? currentRole === 'admin' ? 'Administrateur'
                      : currentRole === 'merchant' ? 'Commerçant'
                      : 'Mon compte'
                      : 'Invité'}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {authenticated ? 'Gérer mon espace' : 'Connectez-vous'}
                  </p>
                </div>

                <ul className="p-2 text-sm">
                  {authenticated && currentRole === 'admin' && (
                    <>
                      <li>
                        <Link
                          to="/admin/tableau-de-bord"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200"
                        >
                          <LayoutDashboard size={18} />
                          Tableau de bord
                        </Link>
                      </li>
                    </>
                  )}
                  {authenticated && currentRole === 'merchant' && (
                    <>
                      <li>
                        <Link
                          to="/marchand/tableau-de-bord"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200"
                        >
                          <LayoutDashboard size={18} />
                          Mon tableau de bord
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/profil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200"
                    >
                      <Settings size={18} />
                      Paramètres du profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connexion"
                      onClick={() => {
                        signOut()
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200"
                    >
                      <Repeat size={18} />
                      Changer de compte
                    </Link>
                  </li>
                  {isDemo && authenticated && (
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          const newRole = currentRole === 'admin' ? 'merchant' : 'admin'
                          switchDemoRole(newRole)
                          navigate(newRole === 'merchant' ? '/marchand/tableau-de-bord' : '/admin/tableau-de-bord')
                          setMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200"
                      >
                        {currentRole === 'admin' ? <Package size={18} /> : <LayoutDashboard size={18} />}
                        Basculer en mode {currentRole === 'admin' ? 'Commerçant' : 'Administrateur'}
                      </button>
                    </li>
                  )}
                </ul>

                <div className="border-t border-base-300/70 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
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
    </header>
  )
}