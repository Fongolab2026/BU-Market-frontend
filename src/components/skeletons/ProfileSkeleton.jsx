import { Skeleton } from './Skeleton.jsx'

/** Squelette d'une fiche détaillée (profil utilisateur, utilisateur admin…). */
export default function ProfileSkeleton({ className = 'space-y-4' }) {
  return (
    <div className={className} role="status" aria-busy="true" aria-label="Chargement du profil">
      <Skeleton rounded="rounded-2xl" className="h-48" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton rounded="rounded-2xl" className="h-72" />
        <Skeleton rounded="rounded-2xl" className="h-64" />
      </div>
    </div>
  )
}
