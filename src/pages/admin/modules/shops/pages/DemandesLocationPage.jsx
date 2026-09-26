import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, Loader2, Search, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { demandesLocationService } from '../services/demandesLocationService.js'
import { PageHeader, Pagination, StatusBadge } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

const STATUS_LABELS = {
  pending: { label: 'En attente', class: 'bg-yellow-100 text-yellow-700' },
  validated: { label: 'Validée', class: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejetée', class: 'bg-rose-100 text-rose-700' },
  suspended: { label: 'Suspendue', class: 'bg-orange-100 text-orange-700' },
}

export function DemandesLocationPage() {
  const [demandes, setDemandes] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [validateTarget, setValidateTarget] = useState(null)

  const PAGE_SIZE = 10

  const reload = () => {
    setLoading(true)
    demandesLocationService.list({ query: search, status, page, perPage: PAGE_SIZE })
      .then((response) => {
        const results = Array.isArray(response) ? response : (response.results || [])
        setDemandes(results)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erreur chargement demandes:', err)
        toast.error('Impossible de charger les demandes')
        setLoading(false)
      })
  }

  useEffect(() => { reload() }, [search, status, page])

  const handleValidate = async (demande) => {
    setValidateTarget(demande.id)
    try {
      await demandesLocationService.validate(demande.id)
      toast.success('Demande validée : le commerçant est promu')
      reload()
    } catch (err) {
      toast.error('Erreur lors de la validation')
    } finally {
      setValidateTarget(null)
    }
  }

  const handleReject = async (demande) => {
    setDeleteTarget(demande.id)
    try {
      await demandesLocationService.reject(demande.id)
      toast.success('Demande rejetée')
      reload()
    } catch (err) {
      toast.error('Erreur lors du rejet')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Espace admin"
        title="Demandes de location"
        description="Gérez les demandes d'espace partenaire envoyées depuis la page publique."
        action={
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            En direct
          </span>
        }
      />

      <section className="card">
        <div className="flex flex-col gap-3 border-b border-base-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher une demande</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Rechercher par nom, propriétaire, province…"
              className="input input-bordered w-full pl-10 pr-3 text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
              className="select select-bordered w-auto bg-base-100 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
              <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Chargement…
            </div>
          ) : demandes.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto w-20 h-20 rounded-full bg-base-100 flex items-center justify-center mb-4 text-base-content/30" size={28} />
              <p className="font-bold text-base-content">Aucune demande</p>
              <p className="mt-1 text-sm text-base-content/45">Aucune demande de location ne correspond à vos filtres.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="text-xs font-semibold text-base-content/50 uppercase border-b border-base-200">
                      <th className="p-3 text-left">Boutique</th>
                      <th className="p-3 text-left">Propriétaire</th>
                      <th className="p-3 text-left">Province / Commune</th>
                      <th className="p-3 text-center">Statut</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d) => {
                      const st = STATUS_LABELS[d.status] || { label: d.status, class: 'bg-base-200 text-base-content' }
                      return (
                        <tr key={d.id} className="border-t border-base-200 hover:bg-base-50">
                          <td className="p-3">
                            <p className="font-semibold text-base-content">{d.companyName}</p>
                            <p className="text-xs text-base-content/50">{d.industry}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-base-content">{d.ownerName}</p>
                            <p className="text-xs text-base-content/50">{d.email}</p>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-base-content">{d.province} / {d.commune}</p>
                            <p className="text-xs text-base-content/50">{d.neighborhood}{d.otherNeighborhood && ` (${d.otherNeighborhood})`}</p>
                          </td>
                          <td className="p-3 text-center">
                            <StatusBadge status={d.status} label={st.label} />
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {d.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleValidate(d)}
                                    disabled={validateTarget === d.id}
                                    className="btn btn-xs btn-success"
                                    aria-label={`Valider ${d.companyName}`}
                                  >
                                    {validateTarget === d.id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle2 size={14} /> Valider
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleReject(d)}
                                    disabled={deleteTarget === d.id}
                                    className="btn btn-xs btn-error"
                                    aria-label={`Rejeter ${d.companyName}`}
                                  >
                                    {deleteTarget === d.id ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      <>
                                        <XCircle size={14} /> Rejeter
                                      </>
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(demandes.length / PAGE_SIZE)}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleReject(demandes.find((d) => d.id === deleteTarget))}
        title="Rejeter la demande"
        message="Cette action est définitive. Le commerçant ne sera pas promu."
        confirmLabel="Rejeter"
        confirmClass="btn-error"
      />
    </div>
  )
}
