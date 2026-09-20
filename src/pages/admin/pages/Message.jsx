import { MessageSquare } from 'lucide-react'
import { PageHeader } from '../components/ui.jsx'

export default function Message() {
  return <>
    <PageHeader title="Messages" description="Consultez les messages et notifications envoyés aux utilisateurs de la plateforme." action={<span className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1.5 text-sm font-semibold text-base-content/60"><MessageSquare size={17} /> 0 non lu</span>} />
    <div className="card p-12 text-center">
      <MessageSquare className="mx-auto text-base-content/25" size={34} />
      <p className="mt-3 font-bold text-base-content">Aucun message pour le moment</p>
      <p className="mt-1 text-sm text-base-content/45">Les messages des clients apparaîtront ici.</p>
    </div>
  </>
}