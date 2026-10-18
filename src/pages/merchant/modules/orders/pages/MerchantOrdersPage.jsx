import { useCallback, useEffect, useRef, useState } from 'react'
import { ClipboardCheck, MapPin, Package, Search, ShoppingBag, RefreshCw, Radio } from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantOrderService } from '../services/merchantOrderService.js'
import { PageHeader, StatusBadge } from '../../../components/ui.jsx'
import { TableSkeleton } from '../../../../../components/skeletons'

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'completed', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]
const statusLabels = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', completed: 'Livrée', cancelled: 'Annulée' }

/** Intervalle de rechargement automatique (nouvelles commandes du client). */
const POLL_INTERVAL_MS = 15000

const formatDateTime = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const formatNumber = (value) => Number(value || 0).toLocaleString('fr-FR')

export function MerchantOrdersPage() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(null)
  const [newOrderIds, setNewOrderIds] = useState([])
  const [live, setLive] = useState(true)
  const knownIds = useRef(new Set())
  const initialLoad = useRef(true)
  const timer = useRef(null)

  const loadOrders = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    else if (initialLoad.current) setLoading(true)
    try {
      const result = await merchantOrderService.list()
      if (initialLoad.current) {
        // Premier chargement : pas de surlignage, on mémorise juste les IDs.
        knownIds.current = new Set(result.map((order) => order.id))
        initialLoad.current = false
      } else {
        // Rechargements suivants : détecte les nouvelles commandes du client.
        const fresh = result.filter((order) => !knownIds.current.has(order.id))
        if (fresh.length > 0) {
          knownIds.current = new Set(result.map((order) => order.id))
          setNewOrderIds(fresh.map((order) => order.id))
          setTimeout(() => setNewOrderIds([]), 8000)
          toast.success(
            fresh.length === 1
              ? `Nouvelle commande #${fresh[0].id} reçue.`
              : `${fresh.length} nouvelles commandes reçues.`
          )
        }
      }
      setOrders(result)
      setError(false)
      setLastRefresh(new Date())
    } catch {
      if (!silent && initialLoad.current) setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [loadOrders])

  // Actualisation automatique tant que l'onglet est visible.
  useEffect(() => {
    if (!live) {
      if (timer.current) clearInterval(timer.current)
      return undefined
    }
    const tick = () => {
      if (document.visibilityState === 'visible') loadOrders({ silent: true })
    }
    timer.current = setInterval(tick, POLL_INTERVAL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') loadOrders({ silent: true })
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (timer.current) clearInterval(timer.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [live, loadOrders])

  const pendingCount = orders.filter((order) => order.status === 'pending').length

  const filtered = orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status
    const text = `${order.id} ${order.client}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const updateStatus = async (order, nextStatus) => {
    if (nextStatus === order.status) return
    try {
      const updated = await merchantOrderService.updateStatus(order.id, nextStatus)
      setOrders((current) => current.map((item) => (item.id === updated.id ? { ...item, status: updated.status } : item)))
      toast.success(`Commande #${order.id} marquée « ${statusLabels[nextStatus]} ».`)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Impossible de mettre à jour le statut.')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace vendeur"
        title="Commandes"
        description="Suivez et mettez à jour le statut des commandes de votre boutique."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLive((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                live ? 'bg-emerald-600 text-white' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
              }`}
              title={live ? 'Actualisation automatique activée' : 'Actualisation automatique désactivée'}
            >
              <Radio size={15} className={live && !refreshing ? 'animate-pulse' : ''} />
              {live ? 'En direct' : 'En pause'}
            </button>
            <button
              type="button"
              onClick={() => loadOrders({ silent: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-base-300 px-3 py-1.5 text-sm font-semibold text-base-content/70 transition hover:bg-base-100 disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Actualisation…' : 'Actualiser'}
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
              <ClipboardCheck size={17} /> {pendingCount} à traiter
            </span>
          </div>
        }
      />
      {lastRefresh && (
        <p className="mt-2 text-xs text-base-content/50">
          Dernière synchronisation : {formatDateTime(lastRefresh)}
          {refreshing ? ' · actualisation en cours…' : ''}
        </p>
      )}

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
          <TableSkeleton columns={7} rows={5} minWidth={760} />
        ) : error ? (
          <div className="p-10 text-center">
            <ShoppingBag size={40} className="mx-auto opacity-30" />
            <p className="mt-2 font-semibold text-base-content">Impossible de charger les commandes</p>
            <p className="mt-1 text-sm text-base-content/50">Veuillez réessayer dans quelques instants.</p>
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
                  <td className="py-3.5 pl-2 font-semibold text-base-content">#{order.id}</td>
                  <td className="py-3.5">
                    <div>
                      <p className="font-semibold text-base-content">{order.client}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                        <MapPin size={12} /> {order.location || 'Adresse non renseignée'}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-base-content/70">
                      <Package size={14} className="text-secondary" /> {order.items}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-base-content">{formatNumber(order.total)} BIF</td>
                  <td className="py-3.5"><StatusBadge status={order.status} label={statusLabels[order.status]} /></td>
                  <td className="py-3.5 text-sm text-base-content/55">{formatDateTime(order.date)}</td>
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