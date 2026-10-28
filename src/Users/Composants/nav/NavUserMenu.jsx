import { Link } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Package, Repeat, Settings, User } from 'lucide-react'
import { clearTokens } from '../../../services/api'

/** Avatar + menu déroulant du compte connecté. */
export default function NavUserMenu({
  menuRef,
  open,
  onToggle,
  onClose,
  authenticated,
  displayName,
  accountLabel = 'Client',
  email,
  initials,
  profileImage,
  isBuyer,
  notificationCount,
  pendingOrderCount,
  onLogout,
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menu du compte de ${displayName}`}
        className={`flex items-center gap-2 rounded-2xl border p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          open
            ? 'border-base-300/80 bg-base-200/70'
            : 'border-transparent hover:border-base-300/70 hover:bg-base-200/60'
        }`}
      >
        <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
          {profileImage ? (
            <img src={profileImage} alt="" className="h-full w-full object-cover" />
          ) : initials ? (
            initials
          ) : (
            <User size={20} />
          )}
        </span>

        <span className="hidden min-w-0 flex-col items-start leading-tight lg:flex">
          <span className="max-w-28 truncate text-[13px] font-semibold text-base-content">
            {displayName}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-base-content/45">
            {authenticated ? accountLabel : 'Invité'}
          </span>
        </span>

        {isBuyer && notificationCount > 0 && (
          <span
            className="absolute right-1 top-1 size-2.5 rounded-full bg-primary ring-2 ring-base-100 lg:hidden"
            aria-hidden="true"
          />
        )}

        <ChevronDown
          size={15}
          className={`hidden text-base-content/40 transition-transform duration-200 sm:block ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2.5 w-64 overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-2xl shadow-base-content/10"
        >
          <div className="border-b border-base-300/70 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 px-4 py-3.5">
            <p className="truncate text-sm font-bold text-base-content">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-base-content/55">
              {authenticated ? email || accountLabel : 'Connectez-vous'}
            </p>
            {authenticated && (
              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {accountLabel}
              </span>
            )}
          </div>

          <ul className="p-2 text-sm">
            {isBuyer && (
              <li>
                <Link
                  to="/notifications"
                  onClick={onClose}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
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
            )}
            {isBuyer && (
              <li>
                <Link
                  to="/commandes"
                  onClick={onClose}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
                >
                  <Package size={18} />
                  Mes commandes
                  {pendingOrderCount > 0 && (
                    <span className="ml-auto rounded-full bg-warning/15 px-2 py-0.5 text-xs font-bold text-warning">
                      {pendingOrderCount > 99 ? '99+' : pendingOrderCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/profil"
                onClick={onClose}
                role="menuitem"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
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
                  onClose()
                }}
                role="menuitem"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary"
              >
                <Repeat size={18} />
                Changer de compte
              </Link>
            </li>
          </ul>

          <div className="border-t border-base-300/70 p-2">
            <button
              type="button"
              onClick={onLogout}
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
