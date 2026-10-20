import { Skeleton, SkeletonCircle } from './Skeleton.jsx'

/** Liste de conversations factices (colonne de gauche des messageries). */
export default function ConversationListSkeleton({ rows = 6, className = 'space-y-1.5' }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement de la messagerie">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex w-full items-start gap-3 rounded-2xl border border-transparent p-2.5"
          aria-hidden="true"
        >
          <SkeletonCircle className="size-11 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton rounded="rounded" className="h-4 w-1/3" />
            <Skeleton rounded="rounded" className="h-3 w-2/5" />
            <Skeleton rounded="rounded" className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
