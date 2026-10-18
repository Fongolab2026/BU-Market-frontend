import { Skeleton } from './Skeleton.jsx'

/** Carte d'indicateur (KPI) factice. */
export default function StatCardSkeleton({ className = '' }) {
  return (
    <article className={`card p-4 ${className}`} role="status" aria-label="Chargement d'un indicateur">
      <div className="flex items-start justify-between gap-3">
        <Skeleton rounded="rounded" className="h-4 w-24" />
        <Skeleton rounded="rounded-lg" className="size-9" />
      </div>
      <Skeleton rounded="rounded" className="mt-3 h-7 w-20" />
      <Skeleton rounded="rounded" className="mt-2 h-3 w-32" />
    </article>
  )
}
