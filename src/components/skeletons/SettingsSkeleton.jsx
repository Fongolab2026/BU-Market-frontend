import { Skeleton } from './Skeleton.jsx'

/** Squelette d'une page de paramètres : quelques cartes de tailles variées. */
export default function SettingsSkeleton({ className = 'space-y-4' }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement des paramètres">
      <Skeleton rounded="rounded-2xl" className="h-20" />
      <Skeleton rounded="rounded-2xl" className="h-40" />
      <Skeleton rounded="rounded-2xl" className="h-56" />
    </div>
  )
}
