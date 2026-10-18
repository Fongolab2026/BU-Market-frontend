/**
 * Bibliothèque de squelettes du projet.
 *
 * Un seul point d'entrée pour tous les états de chargement : importez la brique
 * dont vous avez besoin depuis `components/skeletons` plutôt que de réécrire
 * des `animate-pulse bg-base-200` dispersés.
 *
 *   import { TableSkeleton, ProductGridSkeleton } from '../../components/skeletons'
 *
 * Toutes les briques dérivent de la primitive `Skeleton` (thème clair/sombre,
 * `motion-reduce` géré) et exposent `role="status"` + `aria-busy` pour
 * l'accessibilité.
 */

// Primitives
export {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonBadge,
  SkeletonButton,
  default as SkeletonBlock,
} from './Skeleton.jsx'

// Tableaux
export { default as TableSkeleton, TableRowsSkeleton } from './TableSkeleton.jsx'

// Produits
export { default as ProductCardSkeleton } from './ProductCardSkeleton.jsx'
export { default as ProductGridSkeleton } from './ProductGridSkeleton.jsx'
export { default as ProductDetailSkeleton } from './ProductDetailSkeleton.jsx'

// Listes & cartes
export { default as ListSkeleton } from './ListSkeleton.jsx'
export { default as CardGridSkeleton } from './CardGridSkeleton.jsx'
export { default as ConversationListSkeleton } from './ConversationListSkeleton.jsx'
export { default as OrderListSkeleton } from './OrderListSkeleton.jsx'
export { default as CartSkeleton } from './CartSkeleton.jsx'

// Tableaux de bord & pages
export { default as StatCardSkeleton } from './StatCardSkeleton.jsx'
export { default as ChartSkeleton } from './ChartSkeleton.jsx'
export { default as DashboardSkeleton } from './DashboardSkeleton.jsx'
export { default as SettingsSkeleton } from './SettingsSkeleton.jsx'
export { default as ProfileSkeleton } from './ProfileSkeleton.jsx'
export { default as ShopSkeleton } from './ShopSkeleton.jsx'
