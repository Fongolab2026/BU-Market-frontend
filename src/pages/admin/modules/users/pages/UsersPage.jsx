import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Filter,
  Lock,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { utilisateursService } from '../services/utilisateursService.js'
import { PageHeader, Pagination, StatusBadge } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'
import PhoneInput from '../../../../../components/PhoneInput.jsx'
import Avatar from '../../../../../components/Avatar.jsx'
import { TableRowsSkeleton } from '../../../../../components/skeletons'
import { useAuth } from '../../../../../context/AuthContext.jsx'

const ROLE_META = {
  admin: {
    label: 'Gestionnaire',
    icon: ShieldCheck,
    className: 'bg-violet-50 text-violet-700 ring-violet-600/10',
  },
  merchant: {
    label: 'Commerçant',
    icon: Store,
    className: 'bg-orange-50 text-orange-700 ring-orange-600/10',
  },
  buyer: {
    label: 'Client',
    icon: ShoppingBag,
    className: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  },
}

const SUPER_ADMIN_META = {
  label: 'Super admin',
  icon: ShieldCheck,
  className: 'bg-brand/10 text-brand ring-brand/15',
}

const SHOP_STATUS_LABEL = {
  validated: 'Boutique validée',
  pending: 'Boutique en attente',
  suspended: 'Boutique suspendue',
}

const emptyForm = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  role: 'buyer',
  password: '',
}

const ALLOWED_ROLES = new Set(Object.keys(ROLE_META))

const parseApiErrors = (error) => {
  const data = error?.response?.data
  if (!data) return { fieldErrors: {}, message: 'Impossible de contacter le serveur.' }
  if (typeof data === 'string') {
    const text = data.trim()
    // Une page d'erreur HTML (500 Django) ne doit jamais etre affichee telle
    // quelle dans un toast : on renvoie un message court et lisible.
    if (text.startsWith('<')) {
      return {
        fieldErrors: {},
        message: 'Le serveur a rencontré une erreur. Réessayez ou contactez l’administrateur.',
      }
    }
    return { fieldErrors: {}, message: text }
  }
  if (Array.isArray(data)) return { fieldErrors: {}, message: data.join(' ') }

  const fieldErrors = {}
  let message = data.detail || ''
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'detail' || key === 'non_field_errors') {
      const text = Array.isArray(value) ? value.join(' ') : String(value)
      message = message || text
      return
    }
    fieldErrors[key] = Array.isArray(value) ? value.join(' ') : String(value)
    if (!message) message = fieldErrors[key]
  })

  return { fieldErrors, message: message || 'Une erreur est survenue.' }
}

export function UsersPage() {
  const [searchParams] = useSearchParams()
  const { user: currentUser } = useAuth()
  const [filters, setFilters] = useState({
    query: '',
    role: 'all',
    status: searchParams.get('status') || 'all',
  })
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState({ results: [], total: 0, totalPages: 1, page: 1, perPage: 5 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')

    const timer = setTimeout(() => {
      utilisateursService
        .list({ ...filters, page })
        .then((response) => {
          if (!cancelled) setData(response)
        })
        .catch(() => {
          if (!cancelled) setLoadError('La liste des utilisateurs n’a pas pu être chargée.')
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [filters, page, reloadKey])

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({ query: '', role: 'all', status: 'all' })
    setPage(1)
  }

  const setFormField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const passwordIsValid = form.password ? form.password.length >= 8 : Boolean(editing)
  const canSubmit = Boolean(
    form.username.trim() &&
      form.firstName.trim() &&
      form.email.trim() &&
      passwordIsValid,
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
    setShowForm(true)
  }

  const handleEdit = (user) => {
    setEditing(user)
    setForm({
      username: user.username || '',
      firstName: user.firstName && user.firstName !== 'Sans nom' ? user.firstName : '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone && user.phone !== '+257' ? user.phone : '',
      location: user.location && user.location !== 'Non précisée' ? user.location : '',
      role: ALLOWED_ROLES.has(user.role) ? user.role : 'buyer',
      password: '',
      apiRole: user.apiRole,
    })
    setFormErrors({})
    setShowForm(true)
  }

  const closeForm = () => {
    if (submitting) return
    setShowForm(false)
    setEditing(null)
    setFormErrors({})
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setFormErrors({})
    try {
      if (editing) {
        await utilisateursService.update(editing.id, form)
        toast.success('Utilisateur modifié.')
      } else {
        await utilisateursService.create(form)
        toast.success('Utilisateur ajouté.')
        setPage(1)
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      setReloadKey((key) => key + 1)
    } catch (error) {
      const { fieldErrors, message } = parseApiErrors(error)
      setFormErrors(fieldErrors)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return
    if (String(deleteTarget.id) === String(currentUser?.id)) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte.')
      setDeleteTarget(null)
      return
    }
    setDeleting(true)
    try {
      await utilisateursService.remove(deleteTarget.id)
      toast.success('Utilisateur supprimé.')
      setDeleteTarget(null)
      if (data.results.length === 1 && page > 1) setPage((current) => current - 1)
      setReloadKey((key) => key + 1)
    } catch (error) {
      const { message } = parseApiErrors(error)
      toast.error(message)
      // Un compte lie a des commandes ne peut pas etre supprime : on ferme
      // la confirmation pour eviter de laisser croire a un nouvel essai utile.
      if (error.response?.status === 409) setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtersActive = filters.query || filters.role !== 'all' || filters.status !== 'all'
  const rangeStart = data.total ? (data.page - 1) * data.perPage + 1 : 0
  const rangeEnd = Math.min(data.page * data.perPage, data.total)

  return (
    <>
      <PageHeader
        eyebrow="Comptes"
        title="Utilisateurs"
        description="Gérez les clients, commerçants et gestionnaires de la plateforme."
        action={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-base-300 bg-white text-base-content/60 transition hover:border-brand hover:text-brand"
              aria-label="Rafraîchir la liste"
              title="Rafraîchir"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand sm:flex-none">
              <UsersRound size={17} /> {data.total} compte{data.total > 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-soft sm:w-auto"
            >
              <Plus size={17} /> Ajouter un utilisateur
            </button>
          </div>
        }
      />

      <section className="card overflow-hidden">
        <div className="border-b border-base-200 bg-base-50/60 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
            <label className="relative block">
              <span className="sr-only">Rechercher un utilisateur</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={18}
              />
              <input
                value={filters.query}
                onChange={(event) => updateFilter('query', event.target.value)}
                placeholder="Rechercher par nom, e-mail ou boutique…"
                className="h-10 w-full rounded-lg border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Filtrer par rôle</span>
              <Filter
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={16}
              />
              <select
                value={filters.role}
                onChange={(event) => updateFilter('role', event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
              >
                <option value="all">Tous les rôles</option>
                <option value="merchant">Commerçants</option>
                <option value="buyer">Clients</option>
                <option value="admin">Gestionnaires</option>
              </select>
            </label>

            <label className="relative">
              <span className="sr-only">Filtrer par statut</span>
              <SlidersHorizontal
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={16}
              />
              <select
                value={filters.status}
                onChange={(event) => updateFilter('status', event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendus</option>
              </select>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!filtersActive}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-base-300 bg-white px-3 text-sm font-semibold text-base-content/60 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={15} /> Réinitialiser
            </button>
          </div>
        </div>

        {loadError && (
          <div className="flex flex-col items-start gap-3 border-b border-rose-100 bg-rose-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-700">
              <AlertCircle size={17} /> {loadError}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Réessayer
            </button>
          </div>
        )}

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
                          onClick={() => handleEdit(user)}
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
                            onClick={() => setDeleteTarget(user)}
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
                      onClick={() => handleEdit(user)}
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
                        onClick={() => setDeleteTarget(user)}
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

        {!loading && !loadError && data.results.length === 0 && (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-base-100 text-base-content/30">
              <Search size={24} />
            </span>
            <p className="mt-4 font-bold text-base-content">Aucun utilisateur trouvé</p>
            <p className="mt-1 text-sm text-base-content/45">
              Modifiez vos critères de recherche ou réinitialisez les filtres.
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-base-300 bg-white px-3.5 py-2 text-sm font-semibold text-base-content/70 transition hover:border-brand hover:text-brand"
              >
                <RotateCcw size={15} /> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {!loading && !loadError && data.total > 0 && (
          <div className="border-t border-base-200 px-4 pb-4 pt-4 sm:px-5">
            <div className="-mt-5 flex flex-col items-center justify-between gap-2 text-sm text-base-content/55 sm:flex-row">
              <p>
                Affichage de <span className="font-bold text-base-content">{rangeStart}</span> à{' '}
                <span className="font-bold text-base-content">{rangeEnd}</span> sur{' '}
                <span className="font-bold text-base-content">{data.total}</span> compte
                {data.total > 1 ? 's' : ''}
              </p>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <AddUserModal
          editing={editing}
          form={form}
          formErrors={formErrors}
          setFormField={setFormField}
          canSubmit={canSubmit}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer le compte"
        message={
          deleteTarget
            ? `Le compte de ${deleteTarget.firstName} sera définitivement supprimé. Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </>
  )
}

function RoleBadge({ role, superAdmin = false }) {
  const meta = superAdmin ? SUPER_ADMIN_META : ROLE_META[role] || ROLE_META.buyer
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${meta.className}`}
    >
      <Icon size={13} /> {meta.label}
    </span>
  )
}

function AddUserModal({
  editing,
  form,
  formErrors,
  setFormField,
  canSubmit,
  submitting,
  onSubmit,
  onClose,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
      <form
        onSubmit={onSubmit}
        className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-base-200 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              {editing ? <Pencil size={18} /> : <UsersRound size={18} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-base-content">
                {editing ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}
              </h2>
              <p className="mt-0.5 text-sm text-base-content/55">
                {editing
                  ? `Mettez à jour le compte de ${editing.firstName}.`
                  : 'Créez un compte et attribuez-lui le bon rôle.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid size-8 place-items-center rounded-lg text-base-content/45 transition hover:bg-base-100 hover:text-base-content disabled:opacity-50"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {formErrors.general && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{formErrors.general}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField
              label="Prénom"
              value={form.firstName}
              onChange={(value) => setFormField('firstName', value)}
              placeholder="Ex. Antoine"
              error={formErrors.firstName}
              required
            />
            <ModalField
              label="Nom"
              value={form.lastName}
              onChange={(value) => setFormField('lastName', value)}
              placeholder="Ex. Ndayishimiye"
              error={formErrors.lastName}
            />
            <ModalField
              label="Nom d’utilisateur"
              value={form.username}
              onChange={(value) => setFormField('username', value)}
              placeholder="Ex. antoine"
              error={formErrors.username}
              autoComplete="off"
              required
            />
            <ModalField
              label="Adresse e-mail"
              type="email"
              value={form.email}
              onChange={(value) => setFormField('email', value)}
              placeholder="exemple@gmail.com"
              error={formErrors.email}
              autoComplete="off"
              required
            />

            <div className="block">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
                Téléphone <span className="font-normal text-base-content/40">(optionnel)</span>
              </span>
              <PhoneInput
                size="md"
                value={form.phone}
                onChange={(value) => setFormField('phone', value)}
                error={Boolean(formErrors.phone)}
              />
              {formErrors.phone && (
                <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.phone}</p>
              )}
            </div>

            <ModalSelect
              label="Rôle"
              value={form.role}
              onChange={(value) => setFormField('role', value)}
              error={formErrors.role}
            >
              <option value="buyer">Client</option>
              <option value="merchant">Commerçant</option>
              <option value="admin">Gestionnaire</option>
            </ModalSelect>

            <ModalField
              label="Localisation"
              value={form.location}
              onChange={(value) => setFormField('location', value)}
              placeholder="Ex. Bujumbura, Rohero"
              error={formErrors.location}
              className="sm:col-span-2"
            />

            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-base-content/80">
                  <span>
                    {editing ? 'Nouveau mot de passe' : 'Mot de passe'}{' '}
                    <span className="font-normal text-base-content/40">
                      {editing ? '(optionnel)' : ''}
                    </span>
                  </span>
                  {!editing && <span className="text-xs font-normal text-base-content/40">8 caractères minimum</span>}
                </span>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setFormField('password', event.target.value)}
                    placeholder={editing ? 'Laisser vide pour conserver l’actuel' : '••••••••'}
                    autoComplete="new-password"
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm outline-none transition placeholder:text-base-content/40 focus:ring-4 ${
                      formErrors.password
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-base-300 focus:border-brand focus:ring-brand/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-base-content/40 transition hover:bg-base-100 hover:text-base-content"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.password}</p>
                )}
                {!formErrors.password && form.password.length > 0 && form.password.length < 8 && (
                  <p className="mt-1 text-xs font-medium text-amber-600">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-1.5 text-xs text-base-content/45">
            <ShieldCheck size={14} /> Les champs marqués d’un * sont obligatoires.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-base-300 bg-white px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100 disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function ModalField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  autoComplete,
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-base-300 focus:border-brand focus:ring-brand/10'
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </label>
  )
}

function ModalSelect({ label, value, onChange, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-base-300 focus:border-brand focus:ring-brand/10'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </label>
  )
}
