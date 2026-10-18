import { Skeleton, SkeletonButton } from './Skeleton.jsx'

/** Squelette d'une fiche produit : visuel à gauche, informations à droite. */
export default function ProductDetailSkeleton({
  className = 'mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2',
}) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement du produit">
      <Skeleton rounded="rounded-2xl" className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton rounded="rounded" className="h-8 w-3/4" />
        <Skeleton rounded="rounded" className="h-6 w-1/3" />
        <div className="space-y-2 pt-2">
          <Skeleton rounded="rounded" className="h-3 w-full" />
          <Skeleton rounded="rounded" className="h-3 w-11/12" />
          <Skeleton rounded="rounded" className="h-3 w-4/5" />
        </div>
        <div className="flex flex-wrap gap-3 pt-3">
          <SkeletonButton className="h-11 w-40" />
          <SkeletonButton className="h-11 w-32" />
        </div>
      </div>
    </div>
  )
}
