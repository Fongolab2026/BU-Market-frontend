import { resolveCategoryVisual } from './categoryVisuals.js'

/**
 * Couverture visuelle d'une catégorie.
 *
 * 1. l'image téléversée (`category.image`) si elle existe ;
 * 2. sinon un visuel construit : dégradé thématique, cercles décoratifs,
 *    trame de points et grande icône — la catégorie reste identifiable sans
 *    avoir téléversé d'image.
 */
export default function CategoryCover({ category = {}, className = '', iconSize = 'h-20 w-20' }) {
  const { Icon, gradient } = resolveCategoryVisual(category)
  const [from, to] = gradient

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {category.image ? (
        <img
          src={category.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/20"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:14px_14px]"
          />
          <span className="relative z-10 flex h-full w-full items-center justify-center">
            <Icon className={`${iconSize} text-white drop-shadow-lg`} strokeWidth={1.25} aria-hidden="true" />
          </span>
        </>
      )}
      {/* Voile sombre : garantit la lisibilité des badges superposés. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/15"
      />
    </div>
  )
}
