import { Link } from 'react-router-dom'
import { Bell, Heart, Package } from 'lucide-react'
import { NAV_LINKS } from './navLinks.js'

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
    <div className="absolute inset-x-0 top-full z-40 border-t border-base-300/70 bg-base-100/95 px-4 py-4 shadow-lg shadow-base-content/10 backdrop-blur-xl md:hidden">
      <nav className="mx-auto max-w-7xl" aria-label="Navigation mobile">
        <ul className="flex flex-col gap-1.5">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => onNavLink(path)}
                aria-current={isCurrentNavLink(path) ? 'page' : undefined}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isCurrentNavLink(path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/75'
                }`}
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
                  onClick={onClose}
                  aria-current={isCurrentRoute('/favoris') ? 'page' : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-base-200 hover:text-primary ${
                    isCurrentRoute('/favoris')
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/75'
                  }`}
                >
                  <Heart
                    size={18}
                    className={favoriteCount > 0 ? 'fill-current text-red-500' : ''}
                  />
                  Mes favoris
                  {favoriteCount > 0 && !favoritesLoading && (
                    <span className="ml-auto rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold tabular-nums text-red-500">
                      {favoriteCount > 99 ? '99+' : favoriteCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="sm:mt-1.5 sm:border-t sm:border-base-300/70 sm:pt-1.5">
                <Link
                  to="/notifications"
                  onClick={onClose}
                  aria-current={isCurrentRoute('/notifications') ? 'page' : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-base-200 hover:text-primary ${
                    isCurrentRoute('/notifications')
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/75'
                  }`}
                >
                  <Bell size={18} />
                  Notifications
                  {notificationCount > 0 && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/commandes"
                  onClick={onClose}
                  aria-current={isCurrentRoute('/commandes') ? 'page' : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-base-200 hover:text-primary ${
                    isCurrentRoute('/commandes')
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/75'
                  }`}
                >
                  <Package size={18} />
                  Mes commandes
                  {pendingOrderCount > 0 && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                      {pendingOrderCount > 99 ? '99+' : pendingOrderCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}
