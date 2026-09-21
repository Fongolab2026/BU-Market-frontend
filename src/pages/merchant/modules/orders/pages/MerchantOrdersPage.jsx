import { useEffect, useState } from 'react'
import { ClipboardCheck, MapPin, Package, Search, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantOrderService } from '../services/merchantOrderService.js'
import { PageHeader, StatusBadge } from '../../../components/ui.jsx'

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'completed', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]
const statusLabels = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', completed: 'Livrée', cancelled: 'Annulée' }

export function MerchantOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    merchantOrderService.list().then((result) => {
      setOrders(result)
      setLoading(false)
    })
  }, [])

  const pendingCount = orders.filter((order) => order.status === 'pending').length

  const filtered = orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status
    const text = `${order.id} ${order.client}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const updateStatus = async (order, nextStatus) => {
    if (nextStatus === order.status) return
    const updated = await merchantOrderService.updateStatus(order.id, nextStatus)
    setOrders((current) => current.map((item) => (item.id === updated.id ? { ...item, status: updated.status } : item)))
    toast.success(`Commande ${order.id} marquée « ${statusLabels[nextStatus]} ».`)
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace vendeur"
        title="Commandes"
        description="Suivez et mettez à jour le statut des commandes de votre boutique."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
            <ClipboardCheck size={17} /> {pendingCount} à traiter
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Commandes</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{orders.length}</p>
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
            placeholder="Rechercher un client, une commande..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input input-bordered w-full pl-11"
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="select select-bordered w-full md:w-52">
          <option value="all">Tous les statuts</option>
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
        ) : filtered.length === 0 ? (
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
              {filtered.map((order) => (
                <tr key={order.id} className="align-middle">
                  <td className="py-3.5 pl-2 font-semibold text-base-content">{order.id}</td>
                  <td className="py-3.5">
                    <div>
                      <p className="font-semibold text-base-content">{order.client}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                        <MapPin size={12} /> {order.client}
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
                      className="select select-bordered min-w-32 text-sm font-medium focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {statusOptions.map((option) => (
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
    </>
  )
}