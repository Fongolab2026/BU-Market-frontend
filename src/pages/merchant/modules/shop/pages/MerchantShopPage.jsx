import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, Clock3, Eye, ImagePlus, Package, Pencil, Plus, Star, Store, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { merchantShopService } from '../services/merchantShopService.js'
import { PageHeader, StatusBadge } from '../../../components/ui.jsx'
import { ShopSkeleton } from '../../../../../components/skeletons'

const shopCategories = ['Alimentation', 'Mode & accessoires', 'Artisanat', 'Maison & décoration', 'Beauté & soins', 'Électronique']

const statusMeta = {
  none: { label: 'Non créée' },
  pending: { label: 'En attente de validation' },
  validated: { label: 'Validée' },
  suspended: { label: 'Suspendue' },
}

const formatDate = (value) => {
  if (!value) return "à l'instant"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "à l'instant"
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function MerchantShopPage() {
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', description: '', imageFile: null, imagePreview: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    merchantShopService.get().then((result) => {
      setShop(result)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      toast.error('Impossible de charger votre boutique.')
    })
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.category) return
    setSubmitting(true)
    try {
      const updated = shop && shop.id ? await merchantShopService.update(form) : await merchantShopService.create(form)
      setShop(updated)
      setIsCreating(false)
      setIsEditing(false)
      toast.success(shop && shop.id ? 'Votre boutique a été mise à jour.' : 'Votre boutique a été créée.')
    } catch (error) {
      const detail = error.response?.data?.detail
      toast.error(detail || "Impossible d'enregistrer la boutique.")
    } finally {
      setSubmitting(false)
    }
  }

  const openCreate = () => { setForm({ name: '', category: shopCategories[0], description: '', imageFile: null, imagePreview: '' }); setIsCreating(true); setIsEditing(false) }
  const openEdit = () => { setForm({ id: shop.id, name: shop.name, category: shop.category, description: shop.description, imageFile: null, imagePreview: shop.shopImage || '' }); setIsEditing(true); setIsCreating(false) }

  if (loading) return <ShopSkeleton />

  const meta = statusMeta[shop?.id ? shop.status : 'none'] || statusMeta.none

  // Complétion du profil boutique : logo, description et catégorie
  // (le nom est requis à la création, il compte donc toujours).
  const profileCompletion = shop
    ? Math.round(
        ([shop.name, shop.category, shop.description, shop.shopImage].filter(
          (value) => value && String(value).trim(),
        ).length /
          4) *
          100,
      )
    : 0

  const profileTip = !shop?.description
    ? 'Ajoutez une description pour inspirer confiance'
    : !shop?.shopImage
      ? 'Ajoutez un logo pour une vitrine plus attractive'
      : 'Profil complet : votre vitrine est prête'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Ma boutique"
        description="Gérez l'identité et la présentation de votre boutique sur BU-Market."
        action={
          shop?.id && (
            <button type="button" onClick={openEdit} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft">
              <Pencil size={16} /> Modifier
            </button>
          )
        }
      />

      {!shop?.id ? (
        <ShopEmpty onCreate={openCreate} />
      ) : (
        <div className="space-y-6">
          <article className="card overflow-hidden">
            <div className="relative h-32 bg-gradient-to-br from-brand via-brand/70 to-accent/40">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_50%)]"
                aria-hidden="true"
              />
            </div>
            <div className="-mt-14 flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:px-6 sm:pb-6">
              <div className="relative">
                <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-base-100 bg-base-100 text-brand shadow-lg">
                  {shop.shopImage ? <img src={shop.shopImage} alt={shop.name} className="h-full w-full object-cover" /> : <Building2 size={38} />}
                </span>
                {shop.status === 'validated' && (
                  <span
                    className="absolute -bottom-2 -right-2 grid size-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-base-100"
                    title="Boutique validée"
                  >
                    <CheckCircle2 size={12} />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-base-content">{shop.name}</h2>
                  <StatusBadge status={shop.status} label={meta.label} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                  <span className="flex items-center gap-1.5">
                    <Store size={14} /> {shop.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} /> Créée le {formatDate(shop.createdAt)}
                  </span>
                </div>
              </div>
              {/* L'action « Modifier » vit uniquement dans l'en-tête de la page
                  (PageHeader) : pas de doublon dans la carte. */}
            </div>

            <div className="border-t border-base-200 bg-base-50/50 p-6 sm:px-6">
              <h3 className="text-sm font-semibold text-base-content/70 mb-2">Description</h3>
              {shop.description ? (
                <p className="text-sm leading-7 text-base-content/75">{shop.description}</p>
              ) : (
                <p className="text-sm leading-7 text-base-content/50">
                  Aucune description pour le moment.{' '}
                  <button
                    type="button"
                    onClick={openEdit}
                    className="font-semibold text-brand hover:underline"
                  >
                    Ajoutez-en une
                  </button>{' '}
                  pour inspirer confiance chez vos clients.
                </p>
              )}
            </div>
          </article>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Statistiques de la boutique">
            <ShopStatCard icon={Package} label="Produits publiés" value={shop.products} tone="bg-brand/10 text-brand" hint={shop.products ? 'En ligne dans votre catalogue' : 'Publiez votre premier produit'} />
            <ShopStatCard icon={Star} label="Note moyenne" value={shop.rating ? `${shop.rating} / 5` : '—'} tone="bg-amber-50 text-amber-700" hint={shop.reviewCount ? `Basée sur ${shop.reviewCount} avis` : 'Pas encore d’avis'} />
            <ShopStatCard icon={Eye} label="Vues ce mois" value={shop.views} tone="bg-orange-50 text-orange-700" hint={shop.views ? 'Vos clients découvrent votre boutique' : 'Partagez votre boutique pour attirer des visites'} />
            <ShopStatCard icon={CheckCircle2} label="Avis reçus" value={shop.reviewCount} tone="bg-emerald-50 text-emerald-700" hint={shop.reviewCount ? 'Répondez pour renforcer la confiance' : 'Encouragez vos clients à laisser un avis'} />
          </section>

          <section className="card p-6" aria-labelledby="visibility-title">
            <h3 id="visibility-title" className="font-semibold text-base-content mb-5 flex items-center gap-2">
              <Eye size={18} className="text-brand" /> Visibilité & profil
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-base-50 p-4 border border-base-200">
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">Statut de validation</p>
                <p className="mt-1 font-semibold text-base-content">{shop.status === 'validated' ? 'Boutique visible' : shop.status === 'pending' ? 'En cours de validation' : 'Boutique masquée'}</p>
                <p className="mt-2 text-xs text-base-content/50">{shop.status === 'validated' ? 'Vos produits apparaissent dans les recherches' : 'Patientez le temps de la vérification'}</p>
              </div>
              <div className="rounded-xl bg-base-50 p-4 border border-base-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">Complétion du profil</p>
                  <p className="text-xs font-bold text-brand">{profileCompletion}%</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-base-200 overflow-hidden">
                  <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="mt-2 text-xs text-base-content/50">{profileTip}</p>
              </div>
              <div className="rounded-xl bg-base-50 p-4 border border-base-200">
                <p className="text-xs font-medium text-base-content/50 uppercase tracking-wide">Produits actifs</p>
                <p className="mt-1 font-semibold text-brand">{shop.products}</p>
                <Link
                  to="/marchand/produits"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:underline"
                >
                  Gérer mes produits
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      {(isCreating || isEditing) && (
        <ShopForm
          title={isCreating ? 'Créer ma boutique' : 'Modifier ma boutique'}
          subtitle={isCreating ? 'Renseignez les informations pour créer votre espace de vente.' : 'Mettez à jour les informations de votre boutique.'}
          form={form}
          setFormField={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={() => { setIsCreating(false); setIsEditing(false) }}
        />
      )}
    </div>
  )
}

function ShopEmpty({ onCreate }) {
  return (
    <div className="card grid max-w-2xl place-items-center p-12 text-center">
      <span className="grid size-20 place-items-center rounded-2xl bg-brand/10 text-brand">
        <Building2 size={40} />
      </span>
      <h2 className="mt-5 text-2xl font-bold text-base-content">Aucune boutique pour l'instant</h2>
      <p className="mt-3 max-w-md text-base leading-6 text-base-content/60">Créez votre boutique pour commencer à vendre sur BU-Market. Elle sera validée par notre équipe avant publication.</p>
      <button type="button" onClick={onCreate} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-soft">
        <Plus size={16} /> Créer ma boutique
      </button>
    </div>
  )
}

function ShopStatCard({ icon: Icon, label, value, tone, hint }) {
  return (
    <article className="card p-5 transition hover:border-brand/30 hover:shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-base-content/60">{label}</p>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-base-content">{value}</p>
      {hint && <p className="mt-2 text-xs font-medium text-base-content/50">{hint}</p>}
    </article>
  )
}

function ShopForm({ title, subtitle, form, setFormField, submitting, onSubmit, onClose }) {
  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    setFormField('imageFile', file)
    setFormField('imagePreview', URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <form onSubmit={onSubmit} className="card w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-base-content">{title}</h2>
            <p className="mt-1 text-sm text-base-content/55">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Photo de la boutique</span>
            <div className="flex items-center gap-4">
              <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand/10 text-brand">
                {form.imagePreview ? <img src={form.imagePreview} alt="Aperçu de la boutique" className="h-full w-full object-cover" /> : <ImagePlus size={26} />}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full text-sm" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Nom de la boutique</span>
            <input value={form.name} onChange={(event) => setFormField('name', event.target.value)} placeholder="Ex : Maison Claire" className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Catégorie</span>
            <select value={form.category} onChange={(event) => setFormField('category', event.target.value)} className="select select-bordered w-full text-sm focus:border-brand focus:ring-2 focus:ring-brand/20">
              {shopCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">Description</span>
            <textarea value={form.description} onChange={(event) => setFormField('description', event.target.value)} rows={4} placeholder="Décrivez votre activité, vos produits, vos horaires, votre histoire…" className="textarea textarea-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none" />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-base-300 px-5 py-2.5 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">Annuler</button>
          <button type="submit" disabled={!form.name.trim() || !form.category || submitting} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

