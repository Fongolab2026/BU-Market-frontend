import { ImagePlus, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import CategoryCover from './CategoryCover.jsx'
import { CATEGORY_ICONS } from './categoryVisuals.js'

const MAX_IMAGE_SIZE = 2.5 * 1024 * 1024 // `FILE_UPLOAD_MAX_MEMORY_SIZE` de Django

/**
 * Formulaire de création / d'édition d'une catégorie.
 * Le champ `image` (URL persistée) sert d'aperçu tant qu'aucun nouveau
 * fichier n'est sélectionné ; `imageFile` porte le fichier à téléverser.
 */
export default function CategoryFormModal({
  isCreate,
  form,
  setFormField,
  onImageChange,
  submitting,
  onSubmit,
  onClose,
}) {
  const previewImage = form.imageFile
    ? form.imagePreview
    : form.removeImage
      ? ''
      : form.image || ''

  const previewCategory = {
    name: form.name || 'Nouvelle catégorie',
    icon: form.icon,
    image: previewImage,
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L'image dépasse 2,5 Mo. Choisissez un fichier plus léger.")
      return
    }
    onImageChange(file)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-in fade-in zoom-in-95 duration-200">
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-base-content">
              {isCreate ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
            </h2>
            <p className="mt-1 text-sm text-base-content/55">
              Nom, visuel et icône de repli : c&apos;est ce que verront vos clients.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <CategoryCover
            category={previewCategory}
            className="h-32 w-full rounded-xl ring-1 ring-base-300"
            iconSize="h-14 w-14"
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Nom de la catégorie
            </span>
            <input
              value={form.name}
              onChange={(event) => setFormField('name', event.target.value)}
              placeholder="Ex : Alimentation"
              className="input input-bordered w-full text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Description
            </span>
            <textarea
              value={form.description || ''}
              onChange={(event) => setFormField('description', event.target.value)}
              placeholder="Courte présentation visible sur la carte…"
              rows={3}
              className="textarea textarea-bordered w-full resize-none text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Image de la catégorie
            </span>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-base-300 bg-base-200/40 p-3">
              <span className="grid h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-100">
                {previewImage ? (
                  <img src={previewImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-base-content/35">
                    <ImagePlus size={20} />
                  </span>
                )}
              </span>
              <div className="flex flex-col gap-1.5">
                <label className="btn btn-sm btn-outline border-brand text-brand hover:border-brand hover:bg-brand/10">
                  {previewImage ? 'Remplacer' : 'Téléverser une image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                  />
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormField('imageFile', null)
                      setFormField('removeImage', true)
                    }}
                    className="btn btn-sm btn-ghost text-base-content/60"
                  >
                    <Trash2 size={14} /> Retirer
                  </button>
                )}
                <p className="text-xs text-base-content/45">JPG ou PNG · 2,5 Mo max.</p>
              </div>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
              Icône <span className="font-normal text-base-content/50">(visuel de repli)</span>
            </span>
            <div className="grid grid-cols-9 gap-2 sm:grid-cols-12">
              {CATEGORY_ICONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormField('icon', key)}
                  title={label}
                  aria-label={`Choisir l'icône ${label}`}
                  aria-pressed={form.icon === key}
                  className={`grid h-10 place-items-center rounded-xl border-2 transition ${
                    form.icon === key
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-base-200 text-base-content/50 hover:border-brand/50 hover:text-brand'
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-base-content/45">
              Utilisée si aucune image n&apos;est téléversée.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-base-300 p-3">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(event) => setFormField('active', event.target.checked)}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm font-medium text-base-content/80">
              Catégorie active (visible dans les filtres et les formulaires)
            </span>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!form.name.trim() || submitting}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Enregistrement…' : isCreate ? 'Créer' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
