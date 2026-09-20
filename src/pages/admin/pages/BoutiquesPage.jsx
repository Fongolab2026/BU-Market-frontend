import { useEffect, useState } from 'react'
import { Ban, Building2, CheckCircle2, Eye, Pencil, Search, SlidersHorizontal, Store, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminService } from '../../../services/mockAdminService.js'
import { PageHeader, Pagination, StatusBadge } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'

const PAGE_SIZE = 6

const statCards = [
  { id: 'all', label: 'Boutiques', classes: 'bg-brand/10 text-brand' },
  { id: 'pending', label: 'En attente', classes: 'bg-amber-50 text-amber-700' },
  { id: 'suspended', label: 'Suspendues', classes: 'bg-rose-50 text-rose-700' },
]

export function BoutiquesPage() {
  const [data, setData] = useState({ results: [], total: 0, totalPages: 1, page: 1, perPage: PAGE_SIZE })
  const [filters, setFilters] = useState({ query: '', status: 'all' })
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      adminService.listShops({ ...filters, page }).then((response) => {
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

  const handleValidate = async (shop) => {
    await adminService.updateShopStatus(shop.id, 'validated')
    setReloadKey((key) => key + 1)
    toast.success(`La boutique « ${shop.name} » a été validée.`)
  }

  const handleSuspend = async (shop) => {
    await adminService.updateShopStatus(shop.id, 'pending')
    setReloadKey((key) => key + 1)
    toast.success(`La boutique « ${shop.name} » est en attente de validation.`)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await adminService.deleteShop(deleteTarget.id)
    setDeleteTarget(null)
    setReloadKey((key) => key + 1)
    toast.success('La boutique a été supprimée.')
  }

  const openEdit = (shop) => {
    setEditTarget(shop)
    setForm({ name: shop.name, category: shop.category, description: shop.description || '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!editTarget || !form.name.trim() || !form.category) return
    setSubmitting(true)
    await adminService.updateShopInfo(editTarget.id, form)
    setSubmitting(false)
    setEditTarget(null)
    setReloadKey((key) => key + 1)
    toast.success('La boutique a été modifiée.')
  }

  const rangeStart = data.total ? (data.page - 1) * data.perPage + 1 : 0
  const rangeEnd = Math.min(data.page * data.perPage, data.total)

  return (
    <>
      <PageHeader
        eyebrow="Modération"
        title="Boutiques"
        description="Validez, suspendez ou supprimez les boutiques inscrites sur la plateforme."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
            <Store size={17} /> {data.total} boutique{data.total > 1 ? 's' : ''}
          </span>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <button key={card.id} type="button" onClick={() => updateFilter('status', card.id)} className={`card p-4 text-left transition ${filters.status === card.id ? 'ring-2 ring-brand/30' : ''}`}>
            <p className="text-sm font-medium text-base-content/60">{card.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-base-content">{card.id === 'all' ? data.total : data.results.filter((shop) => shop.status === card.id).length}</p>
          </button>
        ))}
      </section>

      <section className="card mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher une boutique</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Rechercher par nom, catégorie, propriétaire…" className="h-10 w-full border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
          </label>
          <label className="relative block w-full sm:w-48">
            <span className="sr-only">Filtrer par statut</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
            <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
              <option value="all">Tous les statuts</option>
              <option value="validated">Validées</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendues</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-base-200 bg-base-50 text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45">
                <th className="py-3 pl-5">Boutique</th>
                <th className="py-3">Propriétaire</th>
                <th className="py-3">Produits</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Créée le</th>
                <th className="py-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {loading ? (
                [1, 2, 3, 4].map((item) => (
                  <tr key={item} className="animate-pulse">
                    <td className="py-4 pl-5"><div className="h-10 w-52 rounded-lg bg-base-200" /></td>
                    <td><div className="h-4 w-32 rounded bg-base-200" /></td>
                    <td><div className="h-4 w-16 rounded bg-base-200" /></td>
                    <td><div className="h-6 w-24 rounded-full bg-base-200" /></td>
                    <td><div className="h-4 w-28 rounded bg-base-200" /></td>
                    <td><div className="h-4 w-24 rounded bg-base-200" /></td>
                  </tr>
                ))
              ) : (
                data.results.map((shop) => (
                  <tr key={shop.id} className="transition hover:bg-base-50">
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                          <Building2 size={18} />
                        </span>
                        <div>
                          <p className="font-semibold text-base-content">{shop.name}</p>
                          <p className="mt-0.5 text-xs text-base-content/50">{shop.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-base-content/70">{shop.owner}</td>
                    <td className="py-4 text-sm text-base-content/70">{shop.products}</td>
                    <td className="py-4">
                      <StatusBadge status={shop.status} label={shop.status === 'validated' ? 'Validée' : shop.status === 'suspended' ? 'Suspendue' : 'En attente'} />
                    </td>
                    <td className="py-4 text-sm text-base-content/55">{shop.createdAt}</td>
                    <td className="py-4 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/utilisateurs/${shop.ownerId}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10">
                          <Eye size={16} /> Détail
                        </Link>
                        {shop.status !== 'validated' && (
                          <button onClick={() => handleValidate(shop)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                            <CheckCircle2 size={16} /> Valider
                          </button>
                        )}
                        {shop.status !== 'suspended' && (
                          <button onClick={() => handleSuspend(shop)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-50">
                            <Ban size={16} /> Susp.
                          </button>
                        )}
                        <button onClick={() => openEdit(shop)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Modifier ${shop.name}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(shop)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${shop.name}`}>
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
            <Building2 className="mx-auto text-base-content/25" size={30} />
            <p className="mt-3 font-bold text-base-content">Aucune boutique trouvée</p>
            <p className="mt-1 text-sm text-base-content/45">Modifiez vos critères de recherche.</p>
          </div>
        )}

        {!loading && data.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-base-200 p-4 sm:flex-row">
            <p className="text-sm text-base-content/55">
              Affichage de <span className="font-bold text-base-content">{rangeStart}</span> à <span className="font-bold text-base-content">{rangeEnd}</span> sur {data.total}
            </p>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la boutique"
        message={deleteTarget ? `La boutique « ${deleteTarget.name} » sera supprimée. Cette action est définitive.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {editTarget && (
        <EditShopModal
          shop={editTarget}
          form={form}
          setFormField={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  )
}

function EditShopModal({ shop, form, setFormField, submitting, onSubmit, onClose }) {
  const categories = ['Artisanat', 'Alimentation', 'Mode vestimentaire', 'Électronique', 'Bijouterie', 'Décoration']
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">Modifier la boutique</h2>
            <p className="mt-1 text-sm text-base-content/55">{shop.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Nom de la boutique</span>
            <input value={form.name} onChange={(event) => setFormField('name', event.target.value)} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Catégorie</span>
            <select value={form.category} onChange={(event) => setFormField('category', event.target.value)} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Description</span>
            <textarea value={form.description} onChange={(event) => setFormField('description', event.target.value)} rows={3} className="w-full border border-base-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">Annuler</button>
          <button type="submit" disabled={!form.name.trim() || !form.category || submitting} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Enregistrement…' : 'Modifier'}
          </button>
        </div>
      </form>
    </div>
  )
}