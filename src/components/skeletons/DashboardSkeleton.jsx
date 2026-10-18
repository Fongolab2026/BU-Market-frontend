import { Skeleton } from './Skeleton.jsx'

/**
 * Squelette de tableau de bord (admin et commerçant partagent la même
 * disposition : titre, 4 indicateurs, 2 graphiques).
 */
export default function DashboardSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Chargement du tableau de bord"
    >
      <Skeleton rounded="rounded-xl" className="h-16 w-80 max-w-full" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} rounded="rounded-2xl" className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Skeleton rounded="rounded-2xl" className="h-80 xl:col-span-2" />
        <Skeleton rounded="rounded-2xl" className="h-80" />
      </div>
    </div>
  )
}
