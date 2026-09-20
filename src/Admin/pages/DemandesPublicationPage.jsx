import { useEffect, useState } from 'react'
import { ClipboardList, Eye, Package, Search, Store, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader, StatusBadge } from '../components/ui.jsx'

const statCards = [
  { id: 'pending', label: 'En attente', classes: 'bg-amber-50 text-amber-700' },
  { id: 'approved', label: 'Approuvées', classes: 'bg-emerald-50 text-emerald-700' },
  { id: 'rejected', label: 'Rejetées', classes: 'bg-rose-50 text-rose-700' },
]

export function DemandesPublicationPage() {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    adminService.listRequests().then((result) => {
      if (active) {
        setRequests(result)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  const counts = {
    pending: requests.filter((request) => request.status === 'pending').length,
    approved: requests.filter((request) => request.status === 'approved').length,
    rejected: requests.filter((request) => request.status === 'rejected').length,
  }

  const filtered = requests.filter((request) => {
    const matchesStatus = status === 'all' || request.status === status
    const text = `${request.product.name} ${request.seller} ${request.shop}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const updateStatus = (id, nextStatus) => {
    adminService.updateRequestStatus(id, nextStatus).then((updated) => {
      setRequests((current) => current.map((request) => (request.id === updated.id ? updated : request)))
      setSelected(null)
      toast.success(nextStatus === 'approved' ? 'Demande approuvée, produit publié' : 'Demande rejetée')
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Modération"
        title="Demandes de publication"
        description="Validez ou refusez les produits proposés par les commerçants avant leur publication."
        action={
          <span className="inline-flex items-center gap-2 rounded-xl bg-brand/10 px-3.5 py-2 text-sm font-bold text-brand">
            <ClipboardList size={16} /> {counts.pending} en attente
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.id} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-base-content/60">{card.label}</p>
              <span className={`grid size-9 place-items-center rounded-lg text-sm font-extrabold ${card.classes}`}>{counts[card.id]}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            placeholder="Rechercher un produit, un vendeur..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input w-full border-none bg-base-100 pl-11"
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="select w-full border-none bg-base-100 md:w-52">
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Rejetées</option>
        </select>
      </div>

      <div className="mt-5 space-y-4">
        {loading && (
          <div className="card flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Chargement des demandes...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="card p-10 text-center">
            <Package size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucune demande trouvée</p>
          </div>
        )}

        {filtered.map((request) => (
          <article key={request.id} className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Package size={22} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-base-content">{request.product.name}</h3>
                <p className="mt-0.5 text-sm text-base-content/60">{request.product.category}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Store size={12} /> {request.seller}
                  </span>
                  <span>{request.shop}</span>
                  <span>{request.date}</span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 md:justify-end">
              <span className="pr-2 text-base font-extrabold text-base-content">{request.product.price} F</span>
              <StatusBadge status={request.status} />
              <button type="button" onClick={() => setSelected(request)} className="btn btn-ghost btn-sm gap-1.5">
                <Eye size={15} /> Détail
              </button>
              {request.status === 'pending' && (
                <>
                  <button type="button" onClick={() => updateStatus(request.id, 'rejected')} className="btn btn-sm gap-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50">
                    <XCircle size={15} /> Rejeter
                  </button>
                  <button type="button" onClick={() => updateStatus(request.id, 'approved')} className="btn btn-sm gap-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Approuver
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-base-content">Détail de la demande</h2>
              <button type="button" onClick={() => setSelected(null)} className="btn btn-ghost btn-sm btn-circle" aria-label="Fermer">
                <XCircle size={16} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Package size={28} />
              </span>
              <div>
                <h3 className="font-bold text-base-content">{selected.product.name}</h3>
                <p className="text-sm text-base-content/60">{selected.product.category}</p>
                <p className="mt-1 text-xl font-extrabold text-brand">{selected.product.price} F</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-base-100 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Vendeur</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-base-content">
                  <Store size={14} className="text-secondary" /> {selected.seller}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Boutique</p>
                <p className="mt-1 text-sm font-medium text-base-content">{selected.shop}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Soumise le</p>
                <p className="mt-1 text-sm font-medium text-base-content">{selected.date}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Statut</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
            </div>

            {selected.status === 'pending' && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => updateStatus(selected.id, 'rejected')} className="btn flex-1 border-rose-200 text-rose-700 hover:bg-rose-50">
                  <XCircle size={16} /> Rejeter
                </button>
                <button type="button" onClick={() => updateStatus(selected.id, 'approved')} className="btn btn-primary flex-1">
                  Approuver la publication
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}