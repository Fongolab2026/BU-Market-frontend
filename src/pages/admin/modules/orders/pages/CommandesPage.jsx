import { useEffect, useState } from 'react'
import { ClipboardCheck, MapPin, Package, Search, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { commandesService } from '../services/commandesService.js'
import { PageHeader, Pagination, StatusBadge } from '../../../components/ui.jsx'

const PAGE_SIZE = 6
const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'completed', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]
const statusLabels = { pending: 'En attente', shipped: 'Expédiée', completed: 'Livrée', cancelled: 'Annulée' }

export function CommandesPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    commandesService.list().then((result) => {
      setOrders(result)
      setLoading(false)
    })
  }, [])

  const pendingCount = orders.filter((order) => order.status === 'pending').length
  const totalAmount = orders.reduce((sum, order) => (order.status !== 'cancelled' ? sum + Number(String(order.total).replace(/\s/g, '')) : sum), 0)
  const formattedTotal = String(totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  const filtered = orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status
    const text = `${order.id} ${order.client} ${order.shop}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const updateStatus = async (order, nextStatus) => {
    if (nextStatus === order.status) return
    const updated = await commandesService.updateStatus(order.id, nextStatus)
    setOrders((current) => current.map((item) => (item.id === updated.id ? { ...item, status: updated.status } : item)))
    toast.success(`Commande ${order.id} marquée « ${statusLabels[nextStatus]} ».`)
  }

  return (
    <>
      <PageHeader
        eyebrow="Commerce"
        title="Commandes"
        description="Suivez et mettez à jour le statut des commandes passées sur la plateforme."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
            <ClipboardCheck size={17} /> {pendingCount} à traiter
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Commandes</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{orders.length}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Ventes encaissées</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{formattedTotal} F</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">En attente</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-amber-600">{pendingCount}</p>
        </article>
      </div>

      <div className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            placeholder="Rechercher un client, une commande, une boutique..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input w-full border-none bg-base-100 pl-11"
          />
        </div>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="select w-full border-none bg-base-100 md:w-52">
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="card mt-5 overflow-x-auto p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Chargement des commandes...
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingBag size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucune commande trouvée</p>
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                <th className="pb-3 pl-2">Référence</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Articles</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {visible.map((order) => (
                <tr key={order.id} className="align-middle">
                  <td className="py-3.5 pl-2 font-semibold text-base-content">{order.id}</td>
                  <td className="py-3.5">
                    <div>
                      <p className="font-semibold text-base-content">{order.client}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                        <MapPin size={12} /> {order.location}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-base-content/70">
                      <Package size={14} className="text-secondary" /> {order.items}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-base-content">{order.total} F</td>
                  <td className="py-3.5"><StatusBadge status={order.status} label={statusLabels[order.status]} /></td>
                  <td className="py-3.5 text-sm text-base-content/55">{order.date}</td>
                  <td className="py-3.5">
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order, event.target.value)}
                      className="h-9 w-full min-w-32 rounded-lg border border-base-300 bg-white px-2 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    >
                      {statusOptions.filter((option) => option.value !== 'all').map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </>
  )
}