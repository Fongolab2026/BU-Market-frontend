import { useEffect, useState } from 'react'
import { Eye, EyeOff, Package, Pencil, Plus, Search, Store, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { produitsService } from '../services/produitsService.js'
import { PageHeader, Pagination, StatusBadge } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

const PAGE_SIZE = 8
const MAX_IMAGES = 5
const emptyForm = { shopId: '', name: '', price: '', stock: '' }

export function ProduitsPage() {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])

  useEffect(() => {
    let active = true
    produitsService.list().then((result) => {
      if (active) {
        setProducts(result)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [showForm])

  useEffect(() => {
    produitsService.listShopOptions({ perPage: 50 }).then((result) => setShops(result.results))
  }, [])

  const activeCount = products.filter((product) => product.status === 'active').length
  const inactiveCount = products.length - activeCount

  const filtered = products.filter((product) => {
    const matchesStatus = status === 'all' || product.status === status
    const text = `${product.name} ${product.shopName} ${product.shopCategory}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const setFormField = (name, value) => setForm((current) => ({ ...current, [name]: value }))
  const canSubmit = form.shopId && form.name.trim() && form.price.trim()

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, shopId: shops[0]?.id || '' })
    setSelectedFiles([])
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({ shopId: product.shopId, name: product.name, price: product.price, stock: String(product.stock) })
    setSelectedFiles([])
    setShowForm(true)
  }

  const toggleStatus = async (product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active'
    await produitsService.updateStatus(product.id, nextStatus)
    const updated = await produitsService.list()
    setProducts(updated)
    toast.success(nextStatus === 'active' ? 'Produit réactivé.' : 'Produit retiré.')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    if (editing) {
      await produitsService.update(editing.id, form)
      if (selectedFiles.length > 0) {
        try { await produitsService.uploadImages(editing.id, selectedFiles) } catch (e) { console.error('Upload images:', e) }
      }
      toast.success('Produit modifié.')
    } else {
      const created = await produitsService.create(form)
      if (selectedFiles.length > 0 && created?.id) {
        try { await produitsService.uploadImages(created.id, selectedFiles) } catch (e) { console.error('Upload images:', e) }
      }
      toast.success('Produit ajouté.')
    }
    setSubmitting(false)
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    setSelectedFiles([])
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await produitsService.remove(deleteTarget.id)
    const updated = await produitsService.list()
    setProducts(updated)
    setDeleteTarget(null)
    toast.success('Produit supprimé.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Modération"
        title="Produits"
        description="Ajoutez, modifiez ou retirez les produits publiés sur la plateforme."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-soft">
            <Plus size={17} /> Ajouter un produit
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Produits publiés</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{products.length}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Actifs</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">{activeCount}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Retirés</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content/50">{inactiveCount}</p>
        </article>
      </div>

      <div className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            placeholder="Rechercher un produit, une boutique..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input w-full border-none bg-base-100 pl-11"
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="select w-full border-none bg-base-100 md:w-48">
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Retirés</option>
        </select>
      </div>

      <div className="card mt-5 overflow-x-auto p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Chargement des produits...
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucun produit trouvé</p>
          </div>
        ) : (
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                <th className="pb-3 pl-2">Produit</th>
                <th className="pb-3">Boutique</th>
                <th className="pb-3">Prix</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {visible.map((product) => (
                <tr key={product.id} className="align-middle">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Package size={18} />
                      </span>
                      <div>
                        <p className="font-semibold text-base-content">{product.name}</p>
                        <p className="text-xs text-base-content/50">{product.shopCategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-base-content/70">
                      <Store size={14} className="text-secondary" /> {product.shopName}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-base-content">{product.price} F</td>
                  <td className="py-3.5 text-sm text-base-content/70">{product.stock} en stock</td>
                  <td className="py-3.5"><StatusBadge status={product.status} /></td>
                  <td className="py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {product.status === 'active' ? (
                        <button onClick={() => toggleStatus(product)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                          <EyeOff size={15} /> Retirer
                        </button>
                      ) : (
                        <button onClick={() => toggleStatus(product)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10">
                          <Eye size={15} /> Réactiver
                        </button>
                      )}
                      <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Modifier ${product.name}`}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(product)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${product.name}`}>
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

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />

      {showForm && (
        <ProductFormModal
          editing={editing}
          shops={shops}
          form={form}
          setFormField={setFormField}
          canSubmit={Boolean(canSubmit)}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditing(null) }}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer le produit"
        message={deleteTarget ? `Le produit « ${deleteTarget.name} » sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}

function ProductFormModal({ editing, shops, form, setFormField, canSubmit, submitting, onSubmit, onClose, selectedFiles, setSelectedFiles }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    const remaining = MAX_IMAGES - selectedFiles.length
    setSelectedFiles((prev) => [...prev, ...files.slice(0, remaining)])
  }
  const removeFile = (index) => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  const canAddMore = selectedFiles.length < MAX_IMAGES

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md max-h-[90vh] overflow-y-auto p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">{editing ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
            <p className="mt-1 text-sm text-base-content/55">{editing ? `Modifiez les informations de « ${editing.name} ».` : 'Le produit sera ajouté à la boutique choisie.'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {!editing && (
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Boutique</span>
              <select value={form.shopId} onChange={(event) => setFormField('shopId', event.target.value)} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </label>
          )}
          <ProductField label="Nom du produit" value={form.name} onChange={(value) => setFormField('name', value)} placeholder="Ex. Sac en raphia naturel" className="sm:col-span-2" />
          <ProductField label="Prix (F)" type="number" value={form.price} onChange={(value) => setFormField('price', value)} placeholder="Ex. 45000" />
          <ProductField label="Quantité en stock" type="number" value={form.stock} onChange={(value) => setFormField('stock', value)} placeholder="Ex. 20" />

          {/* Upload d'images */}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Photos du produit <span className="font-normal text-base-content/50">(max {MAX_IMAGES})</span>
            </span>
            {canAddMore && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition file:mr-3 file:border-0 file:bg-brand/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
              />
            )}
            {selectedFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-base-300">
                    <img src={URL.createObjectURL(file)} alt={`Aperçu ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={14} className="text-white" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 w-full bg-brand/90 px-1 text-center text-[10px] font-bold text-white">Principale</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </label>
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

function ProductField({ label, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-base-content/80">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" />
    </label>
  )
}