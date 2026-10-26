import { EyeOff, Layers, Package, Plus, Search, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'
import { CardGridSkeleton } from '../../../../../components/skeletons'
import { PageHeader } from '../../../components/ui.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import CategoryFormModal from '../components/CategoryFormModal.jsx'
import { resolveCategoryVisual } from '../components/categoryVisuals.js'
import { merchantCategoryService } from '../services/merchantCategoryService.js'

const STATUS_FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: 'active', label: 'Actives' },
  { key: 'inactive', label: 'Inactives' },
]

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: 'package',
  active: true,
  image: null,
  imageFile: null,
  removeImage: false,
  imagePreview: '',
}

const normalize = (value = '') =>
  String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function MerchantCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    merchantCategoryService
      .list()
      .then((result) => {
        setCategories(result)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        toast.error('Impossible de charger les catégories.')
      })
  }, [])

  const reload = () =>
    merchantCategoryService
      .list()
      .then(setCategories)
      .catch(() => toast.error("Impossible d'actualiser les catégories."))

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setModal('create')
  }

  const openEdit = (category) => {
    // Une catégorie héritée porte l'icône générique « Divers » : on propose
    // directement celle que la carte affiche réellement (déduite du nom).
    const icon =
      category.icon && category.icon !== 'package'
        ? category.icon
        : resolveCategoryVisual(category).iconKey
    setForm({
      name: category.name,
      description: category.description || '',
      icon,
      active: category.active !== false,
      image: category.image || null,
      imageFile: null,
      removeImage: false,
      imagePreview: '',
    })
    setModal(category.id)
  }

  const setFormField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }))

  const handleImageChange = (file) =>
    setForm((current) => ({
      ...current,
      imageFile: file,
      removeImage: false,
      imagePreview: URL.createObjectURL(file),
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      const input = {
        name: form.name.trim(),
        description: form.description,
        icon: form.icon,
        active: form.active,
        imageFile: form.imageFile,
        removeImage: form.removeImage,
      }
      if (modal === 'create') {
        await merchantCategoryService.create(input)
        toast.success('Catégorie ajoutée.')
      } else {
        await merchantCategoryService.update(modal, input)
        toast.success('Catégorie mise à jour.')
      }
      setModal(null)
      await reload()
    } catch (error) {
      toast.error(
        error.response?.data?.name?.[0] ||
          error.response?.data?.detail ||
          "Impossible d'enregistrer la catégorie.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const toggleStatus = async (category) => {
    try {
      await merchantCategoryService.update(category.id, {
        active: category.active === false,
      })
      toast.success(category.active ? 'Catégorie masquée.' : 'Catégorie activée.')
      await reload()
    } catch {
      toast.error('Impossible de modifier le statut de la catégorie.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await merchantCategoryService.remove(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('Catégorie supprimée.')
      await reload()
    } catch (error) {
      setDeleteTarget(null)
      toast.error(
        error.response?.data?.detail || 'Impossible de supprimer la catégorie.',
      )
    }
  }

  const stats = useMemo(() => {
    const active = categories.filter((category) => category.active !== false)
    return {
      total: categories.length,
      active: active.length,
      inactive: categories.length - active.length,
      products: categories.reduce(
        (sum, category) => sum + Number(category.count || 0),
        0,
      ),
    }
  }, [categories])

  const visibleCategories = useMemo(() => {
    const query = normalize(search.trim())
    return categories.filter((category) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && category.active !== false) ||
        (statusFilter === 'inactive' && category.active === false)
      const matchesQuery =
        !query ||
        normalize(category.name).includes(query) ||
        normalize(category.description || '').includes(query)
      return matchesStatus && matchesQuery
    })
  }, [categories, search, statusFilter])

  const statItems = [
    { label: 'Catégories', value: stats.total, icon: Layers, tone: 'text-brand bg-brand/10' },
    { label: 'Actives', value: stats.active, icon: Sparkles, tone: 'text-success bg-success/10' },
    { label: 'Masquées', value: stats.inactive, icon: EyeOff, tone: 'text-base-content/60 bg-base-200' },
    { label: 'Produits classés', value: stats.products, icon: Package, tone: 'text-warning bg-warning/10' },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Catégories"
        description="Structurez votre catalogue : une catégorie, un visuel, une icône de repli."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
          >
            <Plus size={16} /> Nouvelle catégorie
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statItems.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-base-content/60">{label}</p>
              <span className={`grid size-9 place-items-center ${tone}`}>
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-base-content">
              {value}
            </p>
          </article>
        ))}
      </section>

      <section className="card">
        <div className="flex flex-col gap-3 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher une catégorie</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une catégorie…"
              className="input input-bordered w-full pl-10 pr-3 text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-base-300 p-1">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setStatusFilter(filter.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === filter.key
                      ? 'bg-brand text-white'
                      : 'text-base-content/60 hover:text-base-content'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <span className="hidden rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand sm:inline-block">
              {visibleCategories.length} affichée
              {visibleCategories.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <CardGridSkeleton
              count={8}
              height="h-64"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand/10">
                <Layers className="text-brand" size={28} />
              </div>
              <p className="mt-4 font-bold text-base-content">Aucune catégorie</p>
              <p className="mt-1 text-sm text-base-content/45">
                Créez votre première catégorie pour structurer votre catalogue.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
              >
                <Plus size={16} /> Nouvelle catégorie
              </button>
            </div>
          ) : visibleCategories.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-base-content">
                Aucune catégorie ne correspond à votre recherche.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('all')
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                <X size={15} /> Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={openEdit}
                  onToggle={toggleStatus}
                  onDelete={setDeleteTarget}
                />
              ))}
            </section>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la catégorie"
        message={
          deleteTarget
            ? `La catégorie « ${deleteTarget.name} » sera supprimée. Ses produits restent en ligne mais perdent leur classement.`
            : ''
        }
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {modal && (
        <CategoryFormModal
          isCreate={modal === 'create'}
          form={form}
          setFormField={setFormField}
          onImageChange={handleImageChange}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
