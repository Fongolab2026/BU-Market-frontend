import { Link } from 'react-router-dom'
import { Bell, Heart, Package, Settings } from 'lucide-react'
import { NAV_LINKS } from './navLinks.js'

function MobileLink({ to, onClick, active, icon: Icon, children, badge, badgeClassName }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
      }`}
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-lg ${
          active ? 'bg-primary text-primary-content' : 'bg-base-200/80 text-base-content/55'
        }`}
      >
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="flex-1">{children}</span>
      {badge > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${badgeClassName}`}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

/** Panneau de navigation mobile (sous la barre supérieure). */
export default function NavMobileMenu({
  open,
  onClose,
  isBuyer,
  isCurrentRoute,
  isCurrentNavLink,
  onNavLink,
  favoriteCount,
  favoritesLoading,
  notificationCount,
  pendingOrderCount,
}) {
  if (!open) return null

  return (
    <div className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-base-300/60 bg-base-100/95 px-3 py-3 shadow-2xl shadow-base-content/10 backdrop-blur-xl lg:hidden">
      <nav className="mx-auto max-w-7xl" aria-label="Navigation mobile">
        <p className="px-3 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-base-content/40">
          Navigation
        </p>
        <ul className="grid gap-0.5 sm:grid-cols-2">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => onNavLink(path)}
                aria-current={isCurrentNavLink(path) ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  isCurrentNavLink(path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                    isCurrentNavLink(path)
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200/80 text-base-content/55'
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {isBuyer && (
          <>
            <p className="mt-4 border-t border-base-300/60 px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-base-content/40">
              Mon compte
            </p>
            <ul className="grid gap-0.5 sm:grid-cols-2">
              <li>
                <MobileLink
                  to="/favoris"
                  onClick={onClose}
                  active={isCurrentRoute('/favoris')}
                  icon={Heart}
                  badge={favoritesLoading ? 0 : favoriteCount}
                  badgeClassName="bg-red-500/10 text-red-500"
                >
                  Mes favoris
                </MobileLink>
              </li>
              <li>
                <MobileLink
                  to="/notifications"
                  onClick={onClose}
                  active={isCurrentRoute('/notifications')}
                  icon={Bell}
                  badge={notificationCount}
                  badgeClassName="bg-primary/10 text-primary"
                >
                  Notifications
                </MobileLink>
              </li>
              <li>
                <MobileLink
                  to="/commandes"
                  onClick={onClose}
                  active={isCurrentRoute('/commandes')}
                  icon={Package}
                  badge={pendingOrderCount}
                  badgeClassName="bg-warning/15 text-warning"
                >
                  Mes commandes
                </MobileLink>
              </li>
              <li>
                <MobileLink
                  to="/profil"
                  onClick={onClose}
                  active={isCurrentRoute('/profil')}
                  icon={Settings}
                >
                  Paramètres du profil
                </MobileLink>
              </li>
            </ul>
          </>
        )}
      </nav>
    </div>
  )
}
