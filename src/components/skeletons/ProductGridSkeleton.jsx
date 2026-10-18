import ProductCardSkeleton from './ProductCardSkeleton.jsx'

/** Grille de cartes produit factices (accueil, favoris, catalogue…). */
export default function ProductGridSkeleton({
  count = 8,
  className = 'grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}) {
  return (
    <div className={className} aria-busy="true" aria-label="Chargement des produits">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
