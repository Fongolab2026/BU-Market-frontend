import { Skeleton } from './Skeleton.jsx'

/** Bloc de graphique factice. */
export default function ChartSkeleton({ className = 'h-80', rounded = 'rounded-2xl' }) {
  return <Skeleton rounded={rounded} className={`w-full ${className}`} />
}
