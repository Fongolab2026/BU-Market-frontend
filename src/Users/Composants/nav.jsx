import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ClipboardList, Heart, Menu, ShoppingCart, Store, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../hooks/useFavorites'
import { clearTokens, isAuthenticated } from '../../services/api'
import { NAV_LINKS, isNavLinkActive } from './nav/navLinks.js'
import useNavBadges from './nav/useNavBadges.js'
import ThemeToggleButton from './nav/ThemeToggleButton.jsx'
import NavUserMenu from './nav/NavUserMenu.jsx'
import NavMobileMenu from './nav/NavMobileMenu.jsx'

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
      <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/90 shadow-sm shadow-base-content/3 backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
          <Link
            to={showLandingAuth ? '/' : '/accueil'}
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
              <ThemeToggleButton />
              <Link to="/inscription" className="btn btn-ghost btn-sm px-3 sm:px-4">
                Inscription
              </Link>
              <Link to="/connexion" className="btn btn-accent btn-sm px-3 sm:px-5">
                Connexion
              </Link>
            </nav>
          ) : (
            <>
              <nav className="hidden flex-1 justify-center md:flex" aria-label="Navigation principale">
                <ul className="flex items-center gap-7">
                  {NAV_LINKS.map(({ label, path }) => (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => handleNavLink(path)}
                        aria-current={isCurrentNavLink(path) ? 'page' : undefined}
                        className={`relative px-0 py-2 text-[13px] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:bg-primary after:transition-transform hover:text-primary hover:after:scale-x-100 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isCurrentNavLink(path)
                            ? 'text-primary after:scale-x-100'
                            : 'text-base-content/70 after:scale-x-0'
                        }`}
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
                        ? `Mes notifications, ${notificationCount} non lue${notificationCount > 1 ? 's' : ''}`
                        : 'Mes notifications'
                    }
                    aria-current={isCurrentRoute('/notifications') ? 'page' : undefined}
                    className={`relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-base-200 hover:text-primary ${
                      isCurrentRoute('/notifications')
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content/65'
                    }`}
                  >
                    <Bell size={21} />
                    {notificationCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold tabular-nums text-primary-content ring-2 ring-base-100">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </Link>
                )}

                <Link
                  to="/favoris"
                  title="Mes favoris"
                  aria-label="Mes favoris"
                  aria-current={isCurrentRoute('/favoris') ? 'page' : undefined}
                  className={`relative hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-base-200 hover:text-primary sm:inline-flex ${
                    isCurrentRoute('/favoris')
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/65'
                  }`}
                >
                  <Heart size={21} className={favoriteCount > 0 ? 'fill-current text-red-500' : ''} />
                  {favoriteCount > 0 && !favoritesLoading && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {favoriteCount > 99 ? '99+' : favoriteCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/panier"
                  title="Mon panier"
                  aria-label={
                    cartCount > 0
                      ? `Mon panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`
                      : 'Mon panier'
                  }
                  aria-current={isCurrentRoute('/panier') ? 'page' : undefined}
                  className={`relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-base-200 hover:text-primary ${
                    isCurrentRoute('/panier')
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/65'
                  }`}
                >
                  <ShoppingCart size={21} />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-content ring-2 ring-base-100">
                      {cartCount > 99 ? '99+' : cartCount}
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
                        : 'Mes commandes'
                    }
                    aria-current={isCurrentRoute('/commandes') ? 'page' : undefined}
                    className={`relative hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-base-200 hover:text-primary sm:inline-flex ${
                      isCurrentRoute('/commandes')
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content/65'
                    }`}
                  >
                    <ClipboardList size={21} />
                    {pendingOrderCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-warning-content ring-2 ring-base-100">
                        {pendingOrderCount > 99 ? '99+' : pendingOrderCount}
                      </span>
                    )}
                  </Link>
                )}

                <ThemeToggleButton />

                <button
                  type="button"
                  onClick={toggleMobile}
                  aria-label="Menu"
                  className="inline-flex size-10 items-center justify-center rounded-full text-base-content/65 transition-colors hover:bg-base-200 hover:text-primary md:hidden"
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
          className="fixed inset-0 z-[45] backdrop-blur-md md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
    </>
  )
}
