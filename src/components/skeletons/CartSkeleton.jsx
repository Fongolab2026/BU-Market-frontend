import { Skeleton, SkeletonButton } from './Skeleton.jsx'

/** Squelette du panier : liste d'articles à gauche, récapitulatif à droite. */
export default function CartSkeleton({ className = 'mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]' }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement du panier">
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl border border-base-300 bg-(--surface) p-4"
            aria-hidden="true"
          >
            <Skeleton rounded="rounded-xl" className="size-16 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton rounded="rounded" className="h-4 w-2/3" />
              <Skeleton rounded="rounded" className="h-3 w-1/3" />
            </div>
            <Skeleton rounded="rounded-lg" className="h-8 w-28" />
          </div>
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-base-300 bg-(--surface) p-5" aria-hidden="true">
        <Skeleton rounded="rounded" className="h-5 w-40" />
        <div className="mt-4 space-y-3">
          <Skeleton rounded="rounded" className="h-4 w-full" />
          <Skeleton rounded="rounded" className="h-4 w-3/4" />
          <SkeletonButton className="mt-3 h-11 w-full" />
        </div>
      </div>
    </div>
  )
}
