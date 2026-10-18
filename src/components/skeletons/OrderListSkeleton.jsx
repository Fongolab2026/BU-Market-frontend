import { Skeleton, SkeletonBadge } from './Skeleton.jsx'

/** Liste de commandes factices (espace client). */
export default function OrderListSkeleton({ rows = 3, className = 'mt-8 space-y-4' }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement des commandes">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-base-300 bg-(--surface) p-5"
          aria-hidden="true"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton rounded="rounded" className="h-4 w-40" />
              <Skeleton rounded="rounded" className="h-3 w-24" />
            </div>
            <SkeletonBadge className="h-7 w-24" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-base-200 pt-4">
            <Skeleton rounded="rounded" className="h-3 w-20" />
            <Skeleton rounded="rounded" className="h-5 w-28" />
          </div>
        </div>
      ))}
    </div>
  )
}
