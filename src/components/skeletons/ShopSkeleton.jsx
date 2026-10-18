import { Skeleton } from './Skeleton.jsx'

/**
 * Squelette d'une boutique : titre, grande carte (bannière / infos) puis une
 * rangée de cartes (indicateurs, produits…).
 */
export default function ShopSkeleton({ className = 'space-y-6', cards = 4 }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement de la boutique">
      <Skeleton rounded="rounded-xl" className="h-20 w-80 max-w-full" />
      <Skeleton rounded="rounded-2xl" className="h-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }, (_, index) => (
          <Skeleton key={index} rounded="rounded-2xl" className="h-36" />
        ))}
      </div>
    </div>
  )
}
