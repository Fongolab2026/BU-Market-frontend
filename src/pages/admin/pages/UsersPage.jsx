import { useEffect, useState } from 'react'
import { Eye, Filter, Pencil, Plus, Search, SlidersHorizontal, Trash2, UsersRound, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminService } from '../../../services/mockAdminService.js'
import { PageHeader, Pagination, StatusBadge } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'

const roleLabel = { admin: 'Gestionnaire', merchant: 'Commerçant', client: 'Client' }
const emptyForm = { firstName: '', lastName: '', email: '', phone: '+257', location: '', role: 'client' }

export function UsersPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ query: '', role: 'all', status: searchParams.get('status') || 'all' })
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState({ results: [], total: 0, totalPages: 1, page: 1, perPage: 5 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      adminService.listUsers({ ...filters, page }).then((response) => {
        setData(response)
        setLoading(false)
      })
    }, 150)
    return () => clearTimeout(timer)
  }, [filters, page, reloadKey])

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }
  const setFormField = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const canSubmit = form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim()

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    if (editing) {
      await adminService.updateUser(editing.id, form)
      toast.success('Utilisateur modifié.')
    } else {
      await adminService.createUser(form)
      toast.success('Utilisateur ajouté.')
    }
    setSubmitting(false)
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    setPage(1)
    setReloadKey((key) => key + 1)
  }

  const handleEdit = (user) => {
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, location: user.location, role: user.role })
    setEditing(user)
    setShowForm(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const handleDelete = async () => {
    await adminService.deleteUser(deleteTarget.id)
    setDeleteTarget(null)
    setReloadKey((key) => key + 1)
    toast.success('Utilisateur supprimé.')
  }

  const rangeStart = data.total ? (data.page - 1) * data.perPage + 1 : 0
  const rangeEnd = Math.min(data.page * data.perPage, data.total)

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        description="Consultez les comptes et leur accès à la plateforme."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
              <UsersRound size={17} /> {data.total} résultat{data.total > 1 ? 's' : ''}
            </div>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-soft">
              <Plus size={17} /> Ajouter
            </button>
          </div>
        }
      />

      <section className="card p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Rechercher un utilisateur</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Rechercher par nom, e-mail ou boutique…" className="h-10 w-full border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
          </label>
          <label className="relative">
            <span className="sr-only">Filtrer par rôle</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
            <select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
              <option value="all">Tous les rôles</option>
              <option value="merchant">Commerçants</option>
              <option value="client">Clients</option>
              <option value="admin">Gestionnaires</option>
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">Filtrer par statut</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
            <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendus</option>
            </select>
          </label>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-base-200 text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45">
                <th className="pb-3 pl-2">Utilisateur</th>
                <th className="pb-3">Rôle</th>
                <th className="pb-3">Boutique</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Dernière activité</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {loading ? (
                <TableSkeleton />
              ) : (
                data.results.map((user) => (
                  <tr key={user.id} className="transition hover:bg-base-100">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{user.initials}</span>
                        <div>
                          <p className="font-semibold text-base-content">{user.firstName} {user.lastName}</p>
                          <p className="mt-0.5 text-xs text-base-content/50">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-sm font-medium text-base-content/70">{roleLabel[user.role]}</td>
                    <td className="py-3.5 text-sm text-base-content/70">
                      {user.shop ? user.shop.name : <span className="text-base-content/40">Aucune boutique</span>}
                    </td>
                    <td className="py-3.5"><StatusBadge status={user.status} /></td>
                    <td className="py-3.5 text-sm text-base-content/55">{user.lastActive}</td>
                    <td className="py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/utilisateurs/${user.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10">
                          <Eye size={16} /> Détail
                        </Link>
                        <button onClick={() => handleEdit(user)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Modifier ${user.firstName} ${user.lastName}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${user.firstName} ${user.lastName}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && data.results.length === 0 && (
          <div className="py-14 text-center">
            <Search className="mx-auto text-base-content/25" size={30} />
            <p className="mt-3 font-bold text-base-content">Aucun utilisateur trouvé</p>
            <p className="mt-1 text-sm text-base-content/45">Modifiez vos critères de recherche.</p>
          </div>
        )}

        {!loading && data.total > 0 && (
          <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-base-200 pt-4 sm:flex-row">
            <p className="text-sm text-base-content/55">
              Affichage de <span className="font-bold text-base-content">{rangeStart}</span> à <span className="font-bold text-base-content">{rangeEnd}</span> sur {data.total}
            </p>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </div>
        )}
      </section>

      {showForm && <AddUserModal editing={editing} form={form} setFormField={setFormField} canSubmit={Boolean(canSubmit)} submitting={submitting} onSubmit={handleCreate} onClose={() => { setShowForm(false); setEditing(null) }} />}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer le compte"
        message={deleteTarget ? `Le compte de ${deleteTarget.firstName} ${deleteTarget.lastName} sera définitivement supprimé. Cette action est irréversible.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

function AddUserModal({ editing, form, setFormField, canSubmit, submitting, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">{editing ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}</h2>
            <p className="mt-1 text-sm text-base-content/55">{editing ? `Mettez à jour le compte de ${editing.firstName} ${editing.lastName}.` : 'Compte fictif, ajouté directement à la liste.'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ModalField label="Prénom" value={form.firstName} onChange={(value) => setFormField('firstName', value)} placeholder="Ex. Antoine" />
          <ModalField label="Nom" value={form.lastName} onChange={(value) => setFormField('lastName', value)} placeholder="Ex. Chevalier" />
          <ModalField label="E-mail" type="email" value={form.email} onChange={(value) => setFormField('email', value)} placeholder="exemple@gmail.com" className="sm:col-span-2" />
          <ModalField label="Téléphone" value={form.phone} onChange={(value) => setFormField('phone', value)} placeholder="+257 66 00 00 00" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Rôle</span>
            <select value={form.role} onChange={(event) => setFormField('role', event.target.value)} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
              <option value="client">Client</option>
              <option value="merchant">Commerçant</option>
              <option value="admin">Gestionnaire</option>
            </select>
          </label>
          <ModalField label="Localisation" value={form.location} onChange={(value) => setFormField('location', value)} placeholder="Lieu de résidence (ex. Bujumbura, Rohero)" className="sm:col-span-2" />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">Annuler</button>
          <button type="submit" disabled={!canSubmit || submitting} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Enregistrement…' : editing ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ModalField({ label, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
    </label>
  )
}

function TableSkeleton() {
  return [1, 2, 3, 4].map((item) => (
    <tr key={item} className="animate-pulse">
      <td className="py-4"><div className="h-10 w-52 rounded-lg bg-base-200" /></td>
      <td><div className="h-4 w-24 rounded bg-base-200" /></td>
      <td><div className="h-4 w-28 rounded bg-base-200" /></td>
      <td><div className="h-6 w-20 rounded-full bg-base-200" /></td>
      <td><div className="h-4 w-24 rounded bg-base-200" /></td>
    </tr>
  ))
}