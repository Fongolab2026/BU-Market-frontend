import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Heart,
  User,
  Repeat,
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronDown,
  Store,
} from 'lucide-react'
import { isAuthenticated, clearTokens } from '../../services/api'

const THEME_KEY = 'bu-market-theme'
const LIGHT = 'bumarket'
const DARK = 'bumarket-dark'

function getInitialTheme() {
  if (typeof window === 'undefined') return LIGHT
  return localStorage.getItem(THEME_KEY) || LIGHT
}

export default function NavBar() {
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [favorites] = useState(0)

  const isDark = theme === DARK
  const authenticated = isAuthenticated()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/recherche?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = () => {
    clearTokens()
    setMenuOpen(false)
    navigate('/connexion')
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 backdrop-blur'>
      <div className='mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5'>
        {/* Logo + titre */}
        <Link to='/' className='flex shrink-0 items-center gap-2'>
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md'>
            <Store size={22} />
          </span>
          <span className='hidden text-lg font-bold tracking-tight text-base-content sm:block'>
            BU-<span className='text-primary'>Market</span>
          </span>
        </Link>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className='relative flex-1'>
          <Search
            size={18}
            className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40'
          />
          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Rechercher un produit...'
            className='input w-full pl-10 outline-0 border-gray-300'
          />
        </form>

        {/* Favoris */}
        <Link
          to='/favoris'
          title='Mes favoris'
          className='btn btn-ghost btn-circle relative'
        >
          <Heart size={22} />
          {favorites > 0 && (
            <span className='badge badge-primary badge-sm absolute right-0 top-0'>
              {favorites}
            </span>
          )}
        </Link>

        {/* Photo / avatar + menu paramètres */}
        <div className='relative' ref={menuRef}>
          <button
            type='button'
            onClick={() => setMenuOpen((open) => !open)}
            className='flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-base-200'
          >
            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20'>
              <User size={20} />
            </span>
            <ChevronDown
              size={16}
              className={`hidden text-base-content/60 transition-transform sm:block ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div className='absolute right-0 mt-2 w-60 overflow-hidden rounded-box border border-base-300/70 bg-base-100 shadow-xl'>
              <div className='border-b border-base-300/70 px-4 py-3'>
                <p className='text-sm font-semibold text-base-content'>
                  {authenticated ? 'Mon compte' : 'Invité'}
                </p>
                <p className='text-xs text-base-content/60'>
                  {authenticated ? 'Gérer mon espace' : 'Connectez-vous'}
                </p>
              </div>

              <ul className='p-2 text-sm'>
                <li>
                  <Link
                    to='/profil'
                    onClick={() => setMenuOpen(false)}
                    className='flex items-center gap-3 rounded-field px-3 py-2 text-base-content transition-colors hover:bg-base-200'
                  >
                    <Settings size={18} />
                    Paramètres du profil
                  </Link>
                </li>
                <li>
                  <Link
                    to='/connexion'
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
                <li>
                  <button
                    type='button'
                    onClick={() => setTheme(isDark ? LIGHT : DARK)}
                    className='flex w-full items-center gap-3 rounded-field px-3 py-2 text-left text-base-content transition-colors hover:bg-base-200'
                  >
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                    <span className='flex-1'>Mode sombre</span>
                    <span
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-base-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </span>
                  </button>
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
    </header>
  )
}
