import { ClipboardList, LoaderCircle, Package, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { OrderListSkeleton } from '../../components/skeletons'
import { orderApi } from '../../services'
import { ConfirmDialog } from '../../pages/admin/components/ConfirmDialog'

export default function MesCommandes() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingOrderId, setCancellingOrderId] = useState(null)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const cancelOrder = async () => {
    if (!orderToCancel) return
    setCancellingOrderId(orderToCancel.id)
    try {
      const { data } = await orderApi.setStatus(orderToCancel.id, 'cancelled')
      setOrders((current) => current.map((order) => (
        order.id === orderToCancel.id ? { ...order, ...data, status: data?.status || 'cancelled' } : order
      )))
      toast.success('Commande annulée.')
      setOrderToCancel(null)
    } catch (error) {
      const detail = error.response?.data?.detail || error.response?.data?.error
      toast.error(typeof detail === 'string' ? detail : 'Impossible d’annuler cette commande.')
    } finally {
      setCancellingOrderId(null)
    }
  }

  useEffect(() => {
    orderApi.list()
      .then(({ data }) => {
        const result = Array.isArray(data) ? data : data?.results
        setOrders(Array.isArray(result) ? result : [])
      })
      .catch(() => toast.error('Impossible de charger vos commandes.'))
      .finally(() => setLoading(false))
  }, [])

  const pendingCount = orders.filter((order) => order.status === 'pending').length
  const visibleOrders = statusFilter === 'pending'
    ? orders.filter((order) => order.status === 'pending')
    : orders
  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    completed: 'Terminée',
    cancelled: 'Annulée',
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-primary" />
          <h1 className="text-3xl font-extrabold text-base-content">Mes commandes</h1>
        </div>

        {loading ? <OrderListSkeleton /> : orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={48} className="mx-auto text-base-content/25" />
            <p className="mt-4 text-base-content/60">Vous n’avez encore aucune commande.</p>
            <Link to="/accueil" className="btn btn-primary mt-6">Continuer mes achats</Link>
          </div>
        ) : (
          <>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrer les commandes">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              aria-pressed={statusFilter === 'all'}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === 'all' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}`}
            >
              Toutes ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              aria-pressed={statusFilter === 'pending'}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${statusFilter === 'pending' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/70 hover:bg-base-300'}`}
            >
              En attente ({pendingCount})
            </button>
          </div>
          {visibleOrders.length === 0 ? (
            <div className="py-16 text-center text-base-content/60">
              Aucune commande en attente.
            </div>
          ) : (
          <div className="mt-5 space-y-4">
            {visibleOrders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-base-300 bg-(--surface) p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base-content">Commande #{order.id}</h2>
                    <p className="mt-1 text-sm text-base-content/60">{order.date || order.created_at}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{statusLabels[order.status] || order.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-base-200 pt-4 text-sm">
                  <span className="text-base-content/60">{order.items?.length || 0} article(s)</span>
                  <strong className="text-lg text-primary">{Number(order.total_price || 0).toLocaleString('fr-FR')} BIF</strong>
                </div>
                {order.status === 'pending' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setOrderToCancel(order)}
                      disabled={cancellingOrderId === order.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2 text-sm font-semibold text-error transition hover:bg-error/10 disabled:opacity-60"
                    >
                      {cancellingOrderId === order.id ? <LoaderCircle size={16} className="animate-spin" /> : <XCircle size={16} />}
                      Annuler la commande
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          )}
          </>
        )}
      </main>
      <ConfirmDialog
        open={Boolean(orderToCancel)}
        title="Annuler cette commande ?"
        message={orderToCancel ? `La commande #${orderToCancel.id} sera annulée et son stock sera restauré.` : ''}
        confirmLabel="Annuler la commande"
        busy={cancellingOrderId !== null}
        onConfirm={cancelOrder}
        onCancel={() => setOrderToCancel(null)}
      />
      <Footer />
    </div>
  )
}
