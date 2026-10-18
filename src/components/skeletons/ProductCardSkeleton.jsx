import { Skeleton } from './Skeleton.jsx'

/**
 * Squelette d'une carte produit, calqué sur le gabarit réel
 * (`src/Users/products/ui/cardProduct.jsx`) : visuel carré puis lignes de texte.
 */
export default function ProductCardSkeleton({ className = '' }) {
  return (
    <div
      className={`w-full max-w-[420px] overflow-hidden rounded-2xl border border-base-300 bg-[var(--surface)] shadow-sm sm:max-w-none ${className}`}
      role="status"
      aria-label="Chargement d'un produit"
    >
      <Skeleton rounded="rounded-none" className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton rounded="rounded" className="h-4 w-3/4" />
        <Skeleton rounded="rounded" className="h-3 w-1/3" />
        <Skeleton rounded="rounded" className="h-3 w-full" />
        <Skeleton rounded="rounded" className="h-3 w-2/3" />
        <Skeleton rounded="rounded" className="mt-1 h-5 w-1/2" />
      </div>
    </div>
  )
}
