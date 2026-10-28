import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ClipboardList,
  Heart,
  Menu,
  ShoppingCart,
  Store,
  UserPlus,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../hooks/useFavorites'
import { clearTokens, isAuthenticated } from '../../services/api'
import { NAV_LINKS, isNavLinkActive } from './nav/navLinks.js'
import useNavBadges from './nav/useNavBadges.js'
import ThemeToggleButton from './nav/ThemeToggleButton.jsx'
import NavUserMenu from './nav/NavUserMenu.jsx'
import NavMobileMenu from './nav/NavMobileMenu.jsx'

/** Bouton-icône de la barre supérieure, avec état actif et pastille. */
function NavIconLink({
  to,
  label,
  active = false,
  badge = 0,
  badgeClassName = 'bg-primary text-primary-content',
  className = '',
  children,
}) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-base-content/60 hover:bg-base-200 hover:text-primary'
      } ${className}`}
    >
      {children}
      {badge > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ring-2 ring-base-100 ${badgeClassName}`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

/**
 * Barre de navigation du site.
 *
 * `variant="landing"` affiche uniquement les actions d'authentification ;
 * sinon on affiche la navigation principale et les raccourcis du compte.
 * Le panneau mobile peut être contrôlé par le parent (props `mobileOpen`).
 */
export default function NavBar({
  variant,
  mobileOpen: controlledOpen,
  onToggleMobile,
  onCloseMobile,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const mobileOpen = controlledOpen ?? internalMobileOpen

  const toggleMobile = () => {
    if (controlledOpen !== undefined) onToggleMobile?.()
    else setInternalMobileOpen((open) => !open)
  }
  const closeMobile = () => {
    if (controlledOpen !== undefined) onCloseMobile?.()
    else setInternalMobileOpen(false)
  }

  const { user, signOut } = useAuth()
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const { itemCount: cartCount } = useCart()

  const authenticated = isAuthenticated()
  const showLandingAuth = variant === 'landing'
  const isBuyer = authenticated && !showLandingAuth && user?.role === 'client'
  const { pendingOrderCount, notificationCount } = useNavBadges(isBuyer, user?.id)

  const favoriteCount = favoriteIds.size
  const isCurrentRoute = (path) => location.pathname === path
  const isCurrentNavLink = (path) => isNavLinkActive(location.pathname, location.hash, path)

  const displayName =
    user?.firstName || user?.first_name || user?.username || 'Utilisateur'
  const initials =
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ''}`.toUpperCase() ||
    'U'
  const profileImage =
    user?.profile_pic || user?.profilePic || user?.avatar || user?.photo
  const accountLabel =
    user?.role === 'admin' || user?.role === 'superadmin'
      ? 'Administrateur'
      : user?.role === 'merchant' || user?.role === 'seller'
        ? 'Vendeur'
        : 'Client'

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
    navigate('/')
  }

  const handleNavLink = (path) => {
    closeMobile()
    const [base, id] = path.split('#')
    if (id) {
      navigate(`${base || '/accueil'}#${id}`, { replace: false })
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(path)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-base-300/60 bg-base-100/85 shadow-[0_1px_2px_rgb(0_0_0/0.03)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link
            to={showLandingAuth ? '/' : '/accueil'}
            onClick={closeMobile}
            aria-label="BU-Market, retour à l'accueil"
            className="flex shrink-0 items-center gap-2.5 rounded-2xl transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25 ring-1 ring-white/15">
              <Store size={21} strokeWidth={2.2} />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[17px] font-extrabold tracking-tight text-base-content">
                BU<span className="text-primary">Market</span>
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-base-content/40">
                Marketplace
              </span>
            </span>
          </Link>

          {showLandingAuth ? (
            <nav className="ml-auto flex items-center gap-1.5 sm:gap-2" aria-label="Authentification">
              <ThemeToggleButton />
              <span className="mx-1 hidden h-6 w-px bg-base-300/70 sm:block" aria-hidden="true" />
              <Link
                to="/connexion"
                className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-base-content/70 transition-colors hover:bg-base-200 hover:text-primary sm:inline-flex"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="btn btn-primary btn-sm h-10 gap-2 rounded-xl px-4 shadow-sm"
              >
                <UserPlus size={17} aria-hidden="true" />
                <span className="hidden sm:inline">Créer un compte</span>
                <span className="sm:hidden">S&apos;inscrire</span>
              </Link>
            </nav>
          ) : (
            <>
              <nav className="mx-auto hidden lg:flex" aria-label="Navigation principale">
                <ul className="flex items-center gap-1 rounded-full border border-base-300/60 bg-base-200/50 p-1">
                  {NAV_LINKS.map(({ label, path }) => {
                    const active = isCurrentNavLink(path)
                    return (
                      <li key={label}>
                        <button
                          type="button"
                          onClick={() => handleNavLink(path)}
                          aria-current={active ? 'page' : undefined}
                          className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:px-4 ${
                            active
                              ? 'bg-base-100 text-primary shadow-sm'
                              : 'text-base-content/60 hover:bg-base-100/70 hover:text-base-content'
                          }`}
                        >
                          {label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
                {isBuyer && (
                  <NavIconLink
                    to="/notifications"
                    label={
                      notificationCount > 0
                        ? `Mes notifications, ${notificationCount} non lue${notificationCount > 1 ? 's' : ''}`
                        : 'Mes notifications'
                    }
                    active={isCurrentRoute('/notifications')}
                    badge={notificationCount}
                  >
                    <Bell size={20} />
                  </NavIconLink>
                )}

                <NavIconLink
                  to="/favoris"
                  label={
                    favoriteCount > 0
                      ? `Mes favoris, ${favoriteCount} produit${favoriteCount > 1 ? 's' : ''}`
                      : 'Mes favoris'
                  }
                  active={isCurrentRoute('/favoris')}
                  badge={favoritesLoading ? 0 : favoriteCount}
                  badgeClassName="bg-red-500 text-white"
                  className="max-sm:hidden"
                >
                  <Heart size={20} className={favoriteCount > 0 ? 'fill-current text-red-500' : ''} />
                </NavIconLink>

                <NavIconLink
                  to="/panier"
                  label={
                    cartCount > 0
                      ? `Mon panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`
                      : 'Mon panier'
                  }
                  active={isCurrentRoute('/panier')}
                  badge={cartCount}
                >
                  <ShoppingCart size={20} />
                </NavIconLink>

                {isBuyer && (
                  <NavIconLink
                    to="/commandes"
                    label={
                      pendingOrderCount > 0
                        ? `Commandes en attente, ${pendingOrderCount}`
                        : 'Mes commandes'
                    }
                    active={isCurrentRoute('/commandes')}
                    badge={pendingOrderCount}
                    badgeClassName="bg-warning text-warning-content"
                    className="max-sm:hidden"
                  >
                    <ClipboardList size={20} />
                  </NavIconLink>
                )}

                <span
                  className="mx-1 hidden h-6 w-px bg-base-300/70 sm:block"
                  aria-hidden="true"
                />

                <ThemeToggleButton />

                <button
                  type="button"
                  onClick={toggleMobile}
                  aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                  aria-expanded={mobileOpen}
                  className="inline-flex size-10 items-center justify-center rounded-xl text-base-content/60 transition-colors hover:bg-base-200 hover:text-primary lg:hidden"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <NavUserMenu
                  menuRef={menuRef}
                  open={menuOpen}
                  onToggle={() => setMenuOpen((open) => !open)}
                  onClose={() => setMenuOpen(false)}
                  authenticated={authenticated}
                  displayName={displayName}
                  accountLabel={accountLabel}
                  email={user?.email}
                  initials={initials}
                  profileImage={profileImage}
                  isBuyer={isBuyer}
                  notificationCount={notificationCount}
                  pendingOrderCount={pendingOrderCount}
                  onLogout={handleLogout}
                />
              </div>
            </>
          )}
        </div>

        {!showLandingAuth && (
          <NavMobileMenu
            open={mobileOpen}
            onClose={closeMobile}
            isBuyer={isBuyer}
            isCurrentRoute={isCurrentRoute}
            isCurrentNavLink={isCurrentNavLink}
            onNavLink={handleNavLink}
            favoriteCount={favoriteCount}
            favoritesLoading={favoritesLoading}
            notificationCount={notificationCount}
            pendingOrderCount={pendingOrderCount}
          />
        )}
      </header>

      {!showLandingAuth && mobileOpen && (
        <div
          className="fixed inset-0 z-[45] bg-base-content/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </>
  )
}
