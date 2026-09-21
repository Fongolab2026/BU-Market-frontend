import { useEffect, useState } from 'react'
import { Eye, EyeOff, Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantProductService } from '../services/merchantProductService.js'
import { PageHeader, StatusBadge } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

const productCategories = ['Alimentation', 'Mode & accessoires', 'Artisanat', 'Maison & décoration', 'Beauté & soins', 'Électronique']

const categoryIcons = {
  'Alimentation': '🍎',
  'Mode & accessoires': '👕',
  'Artisanat': '🪵',
  'Maison & décoration': '🏠',
  'Beauté & soins': '💄',
  'Électronique': '📱'
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498840177845-8f2b3c98a77c?w=400&h=300&fit=crop'
]

function getPlaceholderImage(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  return placeholderImages[Math.abs(hash) % placeholderImages.length]
}

export function MerchantProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', category: productCategories[0], price: '', stock: '' })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    merchantProductService.list({ query: search, status }).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }, [search, status])

  const reload = () => merchantProductService.list({ query: search, status }).then(setProducts)

  const openCreate = () => { setForm({ name: '', category: productCategories[0], price: '', stock: '' }); setModal('create') }
  const openEdit = (product) => { setForm({ name: product.name, category: product.category, price: String(product.price).replace(/\s/g, ''), stock: String(product.stock) }); setModal(product.id) }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.price) return
    setSubmitting(true)
    if (modal === 'create') {
      await merchantProductService.create(form)
      toast.success('Votre produit a été publié.')
    } else {
      await merchantProductService.update(modal, form)
      toast.success('Votre produit a été mis à jour.')
    }
    setSubmitting(false)
    setModal(null)
    await reload()
  }

  const toggleStatus = async (product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active'
    await merchantProductService.updateStatus(product.id, nextStatus)
    toast.success(product.status === 'active' ? 'Produit mis en brouillon.' : 'Produit publié.')
    await reload()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await merchantProductService.remove(deleteTarget.id)
    setDeleteTarget(null)
    toast.success('Le produit a été supprimé.')
    await reload()
  }

  const activeCount = products.filter((product) => product.status === 'active').length

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Mes produits"
        description="Publiez et gérez les produits de votre boutique."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft">
            <Plus size={16} /> Publier un produit
          </button>
        }
      />

      <section className="card">
        <div className="flex flex-col gap-3 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher un produit</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un produit…" className="input input-bordered w-full pl-10 pr-3 text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => setStatus('all')} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${status === 'all' ? 'bg-brand text-white' : 'bg-base-100 text-base-content/60 hover:bg-base-200'}`}>Tous ({products.length})</button>
            <button type="button" onClick={() => setStatus('active')} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${status === 'active' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>Publiés ({activeCount})</button>
            <button type="button" onClick={() => setStatus('inactive')} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${status === 'inactive' ? 'bg-base-200 text-base-content' : 'bg-base-100 text-base-content/60 hover:bg-base-200'}`}>Brouillons</button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
              <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Chargement des produits...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-base-100 flex items-center justify-center mb-4">
                <Package className="text-base-content/30" size={28} />
              </div>
              <p className="font-bold text-base-content">Aucun produit trouvé</p>
              <p className="mt-1 text-sm text-base-content/45">Publiez votre premier produit pour commencer à vendre.</p>
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <article key={product.id} className="group rounded-2xl border border-base-200 bg-white overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-base-50 overflow-hidden">
                      <img
                        src={product.image || getPlaceholderImage(product.name)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.src = getPlaceholderImage(product.name); }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <StatusBadge status={product.status} label={product.status === 'active' ? 'Publié' : 'Brouillon'} />
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                          {categoryIcons[product.category] ? (
                            <span className="text-lg">{categoryIcons[product.category]}</span>
                          ) : (
                            <Package size={18} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-base-content group-hover:text-brand transition-colors">{product.name}</p>
                          <p className="mt-0.5 text-xs text-base-content/50 flex items-center gap-1">
                            {categoryIcons[product.category] && <span className="text-xs">{categoryIcons[product.category]}</span>}
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-base-100">
                        <div>
                          <p className="text-lg font-bold text-base-content">{product.price} F</p>
                          <p className="text-xs text-base-content/50">Stock : {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button onClick={() => toggleStatus(product)} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition ${product.status === 'active' ? 'bg-base-100 text-base-content/60 hover:bg-base-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                          {product.status === 'active' ? <> <EyeOff size={14} /> Retirer </> : <> <Eye size={14} /> Publier </>}
                        </button>
                        <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-brand/10 hover:text-brand" aria-label={`Modifier ${product.name}`}>
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Supprimer ${product.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Supprimer le produit"
                message={deleteTarget ? `Le produit « ${deleteTarget.name} » sera supprimé définitivement.` : ''}
                confirmLabel="Supprimer"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
              />

              {modal && (
                <ProductForm
                  isCreate={modal === 'create'}
                  form={form}
                  setFormField={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  onClose={() => setModal(null)}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function ProductForm({ isCreate, form, setFormField, submitting, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <form onSubmit={onSubmit} className="card w-full max-w-lg p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">{isCreate ? 'Publier un produit' : 'Modifier le produit'}</h2>
            <p className="mt-1 text-sm text-base-content/55">{isCreate ? 'Le produit sera immédiatement visible dans votre boutique.' : 'Mettez à jour les informations du produit.'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Nom du produit</span>
            <input value={form.name} onChange={(event) => setFormField('name', event.target.value)} placeholder="Ex : Huile de tournesol 1 L" className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Catégorie</span>
            <select value={form.category} onChange={(event) => setFormField('category', event.target.value)} className="select select-bordered w-full text-sm focus:border-brand focus:ring-2 focus:ring-brand/20">
              {productCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Prix (F)</span>
              <input type="number" min="0" value={form.price} onChange={(event) => setFormField('price', event.target.value)} placeholder="12 000" className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Stock</span>
              <input type="number" min="0" value={form.stock} onChange={(event) => setFormField('stock', event.target.value)} placeholder="60" className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20" />
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">Annuler</button>
          <button type="submit" disabled={!form.name.trim() || !form.price || submitting} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Enregistrement…' : isCreate ? 'Publier' : 'Modifier'}
          </button>
        </div>
      </form>
    </div>
  )
}