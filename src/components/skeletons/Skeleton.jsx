/**
 * Primitives de squelette (« skeleton ») partagées par tout le projet.
 *
 * Toutes les briques partent de `Skeleton` : un bloc neutre qui pulse
 * (`animate-pulse`) sur `bg-base-200`, donc automatiquement cohérent avec les
 * thèmes clair ET sombre, et qui se figera si l'utilisateur préfère les
 * animations réduites (`motion-reduce:animate-none`).
 */

/** Bloc de base. `as` permet de rendre un `span`, `div`, `tr`… selon le contexte. */
export function Skeleton({ as: Tag = 'div', rounded = 'rounded-md', className = '', ...rest }) {
  return (
    <Tag
      className={`animate-pulse bg-base-200 motion-reduce:animate-none ${rounded} ${className}`}
      aria-hidden="true"
      {...rest}
    />
  )
}

/** Plusieurs lignes de texte factices, de largeurs décroissantes. */
export function SkeletonText({ lines = 3, className = '', gap = 'space-y-2' }) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-2/3']
  return (
    <div className={`${gap} ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} rounded="rounded" className={`h-3 ${widths[index % widths.length]}`} />
      ))}
    </div>
  )
}

/** Pastille ronde (avatar, icône…). */
export function SkeletonCircle({ className = 'size-10' }) {
  return <Skeleton rounded="rounded-full" className={className} />
}

/** Badge / pastille de statut. */
export function SkeletonBadge({ className = 'h-6 w-20' }) {
  return <Skeleton rounded="rounded-full" className={className} />
}

/** Bouton. */
export function SkeletonButton({ className = 'h-10 w-32' }) {
  return <Skeleton rounded="rounded-lg" className={className} />
}

export default Skeleton
