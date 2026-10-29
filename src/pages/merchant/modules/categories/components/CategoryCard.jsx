import { Edit3, Eye, EyeOff, Trash2 } from 'lucide-react'
import { StatusBadge } from '../../../components/ui.jsx'
import CategoryCover from './CategoryCover.jsx'

/**
 * Carte d'une catégorie : couverture (image téléversée ou visuel construit),
 * compteur de produits, statut et actions.
 */
export default function CategoryCard({ category, onEdit, onToggle, onDelete }) {
  const isActive = category.active !== false

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
      <div className="relative">
        <CategoryCover category={category} className="aspect-[16/10] w-full" iconSize="h-16 w-16" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
          {category.count || 0} produit{Number(category.count) > 1 ? 's' : ''}
        </span>
        {!isActive && (
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            Masquée
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words text-base font-bold leading-snug text-base-content">
            {category.name}
          </h3>
          <StatusBadge
            status={isActive ? 'active' : 'inactive'}
            label={isActive ? 'Active' : 'Inactive'}
          />
        </div>

        <p className="line-clamp-2 text-sm leading-5 text-base-content/60">
          {category.description || 'Aucune description pour cette catégorie.'}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-base-200 pt-3">
          {category.canManage ? <>
          <button
            type="button"
            onClick={() => onToggle(category)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition ${
              isActive
                ? 'bg-base-200/70 text-base-content/65 hover:bg-base-200 hover:text-base-content'
                : 'bg-success/10 text-success hover:bg-success/20'
            }`}
          >
            {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
            {isActive ? 'Masquer' : 'Activer'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(category)}
            aria-label={`Modifier ${category.name}`}
            className="rounded-lg p-2 text-base-content/45 transition hover:bg-brand/10 hover:text-brand"
          >
            <Edit3 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            aria-label={`Supprimer ${category.name}`}
            className="rounded-lg p-2 text-base-content/45 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={16} />
          </button>
          </> : <span className="text-xs text-base-content/55">Catégorie partagée · lecture seule</span>}
        </div>
      </div>
    </article>
  )
}
