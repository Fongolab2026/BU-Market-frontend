import { Link } from 'react-router-dom'
import { Eye, Mail, Pencil, Store, Trash2 } from 'lucide-react'
import Avatar from '../../../../../components/Avatar.jsx'
import { StatusBadge } from '../../../components/ui.jsx'
import { TableRowsSkeleton } from '../../../../../components/skeletons'
import RoleBadge from './RoleBadge.jsx'
import { SHOP_STATUS_LABEL } from './usersConstants.js'

/** Vue tableau (desktop) et cartes (mobile) des utilisateurs. */
export default function UsersTable({ data, loading, currentUser, onEdit, onDelete }) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-base-200 bg-base-50/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-base-content/45">
              <th className="px-5 py-3">Utilisateur</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Boutique</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Dernière activité</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {loading ? (
              <TableRowsSkeleton columns={6} rows={5} />
            ) : (
              data.results.map((user) => (
                <tr key={user.id} className="group transition hover:bg-base-50/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profilePic}
                        name={user.firstName}
                        alt=""
                        className="size-10 shrink-0 rounded-full bg-brand/10 text-xs font-bold text-brand ring-2 ring-white"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-base-content">{user.firstName}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-base-content/50">
                          <Mail size={12} className="shrink-0" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} superAdmin={user.isSuperAdmin} />
                  </td>
                  <td className="px-5 py-4">
                    {user.shop ? (
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-base-content/80">
                          <Store size={14} className="shrink-0 text-base-content/40" />
                          {user.shop.name}
                        </p>
                        <p className="mt-0.5 pl-5 text-[11px] text-base-content/45">
                          {SHOP_STATUS_LABEL[user.shop.status] || user.shop.status}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-base-content/35">Aucune boutique</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-base-content/55">
                    {user.lastActive}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/utilisateurs/${user.id}`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-brand/10 hover:text-brand"
                        aria-label={`Voir le profil de ${user.firstName}`}
                        title="Voir le détail"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-brand/10 hover:text-brand"
                        aria-label={`Modifier ${user.firstName}`}
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      {String(user.id) === String(currentUser?.id) ? (
                        <button
                          type="button"
                          disabled
                          className="inline-flex size-8 cursor-not-allowed items-center justify-center rounded-lg text-base-content/20"
                          aria-label="Impossible de supprimer votre propre compte"
                          title="Impossible de supprimer votre propre compte"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Supprimer ${user.firstName}`}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 lg:hidden">
        {loading ? (
          <>
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse rounded-xl border border-base-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-base-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/5 rounded bg-base-200" />
                    <div className="h-3 w-3/5 rounded bg-base-200" />
                  </div>
                </div>
                <div className="mt-4 h-3 w-full rounded bg-base-200" />
              </div>
            ))}
          </>
        ) : (
          data.results.map((user) => (
            <article key={user.id} className="rounded-xl border border-base-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar
                    src={user.profilePic}
                    name={user.firstName}
                    alt=""
                    className="size-10 shrink-0 rounded-full bg-brand/10 text-xs font-bold text-brand"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-base-content">{user.firstName}</p>
                    <p className="mt-0.5 truncate text-xs text-base-content/50">{user.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <RoleBadge role={user.role} superAdmin={user.isSuperAdmin} />
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Link
                    to={`/admin/utilisateurs/${user.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-brand/10 hover:text-brand"
                    aria-label={`Voir le profil de ${user.firstName}`}
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-brand/10 hover:text-brand"
                    aria-label={`Modifier ${user.firstName}`}
                  >
                    <Pencil size={16} />
                  </button>
                  {String(user.id) === String(currentUser?.id) ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex size-8 cursor-not-allowed items-center justify-center rounded-lg text-base-content/20"
                      aria-label="Impossible de supprimer votre propre compte"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-base-content/45 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Supprimer ${user.firstName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-base-200 pt-3">
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-base-content/40">
                    Boutique
                  </dt>
                  <dd className="mt-1 truncate text-sm text-base-content/70">
                    {user.shop ? user.shop.name : 'Aucune'}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-base-content/40">
                    Dernière activité
                  </dt>
                  <dd className="mt-1 truncate text-sm text-base-content/70">{user.lastActive}</dd>
                </div>
              </dl>
            </article>
          ))
        )}
      </div>
    </>
  )
}
