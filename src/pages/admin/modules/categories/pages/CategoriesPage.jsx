import { useEffect, useState } from 'react'
import { Layers, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoriesService } from '../services/categoriesService.js'
import { PageHeader } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    categoriesService.list().then((result) => {
      setCategories(result)
      setLoading(false)
    })
  }, [])

  const refresh = (result) => {
    setCategories([...result])
    setShowForm(false)
    setEditing(null)
    setName('')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    const result = await (editing ? categoriesService.update(editing.id, { name: name.trim() }) : categoriesService.create({ name: name.trim() }))
    setSubmitting(false)
    refresh(result)
    toast.success(editing ? 'Catégorie renommée.' : 'Catégorie créée.')
  }

  const openCreate = () => {
    setEditing(null)
    setName('')
    setShowForm(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setName(category.name)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await categoriesService.remove(deleteTarget.id)
    setDeleteTarget(null)
    refresh(result)
    toast.success('Catégorie supprimée.')
  }

  const totalProducts = categories.reduce((sum, category) => sum + category.count, 0)
  const filtered = categories.filter((category) => !search.trim() || category.name.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Catégories"
        description="Les catégories structureront les produits publiés par les boutiques."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-soft">
            <Plus size={17} /> Nouvelle catégorie
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Catégories</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{categories.length}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Produits classés</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{totalProducts}</p>
        </article>
      </div>

      <div className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input w-full border-none bg-base-100 pl-11"
          />
        </div>
      </div>

      <div className="card mt-5 overflow-x-auto p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Chargement des catégories...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Layers size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucune catégorie trouvée</p>
          </div>
        ) : (
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                <th className="pb-3 pl-2">Catégorie</th>
                <th className="pb-3">Produits associés</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {filtered.map((category) => (
                <tr key={category.id} className="align-middle">
                  <td className="py-3.5 pl-2">
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                        <Layers size={18} />
                      </span>
                      <span className="font-semibold text-base-content">{category.name}</span>
                    </span>
                  </td>
                  <td className="py-3.5 text-sm text-base-content/70">{category.count} produit{category.count > 1 ? 's' : ''}</td>
                  <td className="py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(category)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Renommer ${category.name}`}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(category)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${category.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <form onSubmit={handleCreate} className="card w-full max-w-md p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-base-content">{editing ? 'Renommer la catégorie' : 'Nouvelle catégorie'}</h2>
                <p className="mt-1 text-sm text-base-content/55">{editing ? `Renommez « ${editing.name} ».` : 'Cette catégorie sera proposée aux boutiques.'}</p>
              </div>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Nom de la catégorie</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Beauté & soins" className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">Annuler</button>
              <button type="submit" disabled={!name.trim() || submitting} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? 'Enregistrement…' : editing ? 'Renommer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la catégorie"
        message={deleteTarget ? `La catégorie « ${deleteTarget.name} » sera supprimée. Les produits associés ne seront pas supprimés.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}