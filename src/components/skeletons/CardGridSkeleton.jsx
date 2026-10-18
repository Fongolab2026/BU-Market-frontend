import { Skeleton, SkeletonButton, SkeletonCircle } from './Skeleton.jsx'

/**
 * Grille de cartes génériques (boutiques, avis, cartes de statistiques…).
 * `height` contrôle la hauteur de chaque bloc.
 */
export default function CardGridSkeleton({
  count = 6,
  height = 'h-40',
  className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  withFooter = false,
}) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`card flex flex-col gap-3 p-4 ${height}`}
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <SkeletonCircle className="size-10" />
            <div className="flex-1 space-y-2">
              <Skeleton rounded="rounded" className="h-4 w-2/3" />
              <Skeleton rounded="rounded" className="h-3 w-1/3" />
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <Skeleton rounded="rounded" className="h-3 w-full" />
            <Skeleton rounded="rounded" className="h-3 w-4/5" />
          </div>
          {withFooter && <SkeletonButton className="h-9 w-28" />}
        </div>
      ))}
    </div>
  )
}
