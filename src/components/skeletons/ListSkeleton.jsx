import { Skeleton, SkeletonCircle } from './Skeleton.jsx'

/**
 * Liste de cartes factices (notifications, avis, résultats…).
 * `withAvatar` ajoute une pastille à gauche, `lines` le nombre de lignes de texte.
 */
export default function ListSkeleton({
  rows = 5,
  lines = 3,
  withAvatar = true,
  className = 'space-y-3',
  itemClassName = 'card',
}) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-4 ${itemClassName}`}
          aria-hidden="true"
        >
          {withAvatar && <SkeletonCircle className="size-10 shrink-0" />}
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton rounded="rounded" className="h-4 w-1/2" />
            {Array.from({ length: lines }, (_, lineIndex) => (
              <Skeleton
                key={lineIndex}
                rounded="rounded"
                className={`h-3 ${lineIndex % 2 === 0 ? 'w-full' : 'w-4/5'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
