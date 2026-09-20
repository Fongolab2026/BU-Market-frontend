import { BadgeCheck } from 'lucide-react'
import { PageHeader } from './components/ui.jsx'

export default function Approuver_Publication() {
  return <>
    <PageHeader title="Publications" description="Validez ou masquez les produits déjà publiés sur le marché." action={<span className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1.5 text-sm font-semibold text-base-content/60"><BadgeCheck size={17} /> 0 à valider</span>} />
    <div className="card p-12 text-center">
      <BadgeCheck className="mx-auto text-base-content/25" size={34} />
      <p className="mt-3 font-bold text-base-content">Aucune publication à valider</p>
      <p className="mt-1 text-sm text-base-content/45">Les publications en attente apparaîtront ici.</p>
    </div>
  </>
}