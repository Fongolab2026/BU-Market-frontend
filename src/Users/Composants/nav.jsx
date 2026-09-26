import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Repeat,
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronDown,
  Store,
  Menu,
  X,
} from 'lucide-react'
import { Button } from 'primereact/button'
import { isAuthenticated, clearTokens } from '../../services/api'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { label: 'Accueil', path: '/' },
  { label: 'Produits', path: '/#produits' },
  { label: 'À propos', path: '/#a-propos' },
  { label: 'Contact', path: '/#contact' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { isDark, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const authenticated = isAuthenticated()

  const displayName = user?.firstName || user?.first_name || user?.username || 'Utilisateur'
  const initials = user?.initials || `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ''}`.toUpperCase() || 'U'
  const profileImage = user?.profile_pic || user?.profilePic || user?.avatar || user?.photo

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
    clearTokens()
    signOut()
    setMenuOpen(false)
    navigate('/connexion')
  }

  const handleNavLink = (path) => {
    setMobileOpen(false)
    if (path.startsWith('/#')) {
      navigate('/', { replace: false })
      setTimeout(() => {
        const id = path.replace('/#', '')
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(path)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md">
            <Store size={22} />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-base-content sm:block">
            BU-<span className="text-primary">Market</span>
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV_LINKS.map(({ label, path }) => (
            <Button
              key={label}
              type="button"
              onClick={() => handleNavLink(path)}
              text
              className="text-sm font-medium text-base-content/75 hover:text-primary"
              style={{ minHeight: 'auto', padding: '0.5rem 1rem' }}
            >
              {label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            onClick={toggleTheme}
            icon={isDark ? <Sun size={21} /> : <Moon size={21} />}
            title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            text
            rounded
            className="text-base-content/70"
          />

          <Button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            icon={mobileOpen ? <X size={22} /> : <Menu size={22} />}
            aria-label="Menu"
            text
            rounded
            className="!inline-flex text-base-content/70 md:!hidden"
          />

          {/* Photo / avatar + menu paramètres */}
          <div className='relative' ref={menuRef}>
            <button
              type='button'
              onClick={() => setMenuOpen((open) => !open)}
              className='flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-base-200'
            >
              <span className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20'>
                {profileImage ? (
              className="!inline-flex text-base-content/70 md:!hidden"
                ) : initials ? (
                  initials
                ) : (
                  <User size={20} />
                )}
              </span>
              <span className='hidden max-w-28 truncate text-sm font-semibold text-base-content md:block'>{displayName}</span>
              <ChevronDown
                size={16}
                className={`hidden text-base-content/60 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div className='absolute right-0 mt-2 w-60 overflow-hidden rounded-box border border-base-300/70 bg-base-100 shadow-xl'>
                <div className='border-b border-base-300/70 px-4 py-3'>
                  <p className='text-sm font-semibold text-base-content'>
                    {authenticated ? displayName : 'Invité'}
                  </p>
                  <p className='text-xs text-base-content/60'>
                    {authenticated ? (user?.email || 'Gérer mon espace') : 'Connectez-vous'}
                  </p>
                </div>

                <ul className='p-2 text-sm'>
                  <li>
                    <Link
                      to="/profil"
                      onClick={() => setMenuOpen(false)}
                      className='flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200'
                    >
                      <Settings size={18} />
                      Paramètres du profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connexion"
                      onClick={() => {
                        clearTokens()
                        setMenuOpen(false)
                      }}
                      className='flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200'
                    >
                      <Repeat size={18} />
                      Changer de compte
                    </Link>
                  </li>
                </ul>

                <div className='border-t border-base-300/70 p-2'>
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='flex w-full items-center gap-3 rounded-field px-3 py-2 text-sm text-error transition-colors hover:bg-error/10'
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
        <div className="border-t border-base-300/70 bg-base-100 px-4 py-3 md:hidden">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <Button
                    type="button"
                    onClick={() => handleNavLink(path)}
                    className="w-full justify-start rounded-field px-4 py-2.5 text-base-content/75 hover:text-primary"
                    text
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}