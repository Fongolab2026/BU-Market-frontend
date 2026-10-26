import { useEffect, useState } from 'react'
import { AlertCircle, Plus, RefreshCw, RotateCcw, Search, UsersRound } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { utilisateursService } from '../services/utilisateursService.js'
import { PageHeader, Pagination } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'
import { useAuth } from '../../../../../context/AuthContext.jsx'
import UsersFilters from '../components/UsersFilters.jsx'
import UsersTable from '../components/UsersTable.jsx'
import AddUserModal from '../components/AddUserModal.jsx'
import {
  ALLOWED_ROLES,
  emptyForm,
  parseApiErrors,
} from '../components/usersConstants.js'

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
        <UsersFilters
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          filtersActive={filtersActive}
        />

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

        <UsersTable
          data={data}
          loading={loading}
          currentUser={currentUser}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
        />

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
