import { ClipboardList, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { orderApi } from '../../services'

export default function MesCommandes() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderApi.list()
      .then(({ data }) => {
        const result = Array.isArray(data) ? data : data?.results
        setOrders(Array.isArray(result) ? result : [])
      })
      .catch(() => toast.error('Impossible de charger vos commandes.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="text-primary" />
          <h1 className="text-3xl font-extrabold text-base-content">Mes commandes</h1>
        </div>

        {loading ? <p className="py-20 text-center text-base-content/60">Chargement...</p> : orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={48} className="mx-auto text-base-content/25" />
            <p className="mt-4 text-base-content/60">Vous n’avez encore aucune commande.</p>
            <Link to="/accueil" className="btn btn-primary mt-6">Continuer mes achats</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-base-300 bg-(--surface) p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base-content">Commande #{order.id}</h2>
                    <p className="mt-1 text-sm text-base-content/60">{order.date || order.created_at}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{order.status}</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-base-200 pt-4 text-sm">
                  <span className="text-base-content/60">{order.items?.length || 0} article(s)</span>
                  <strong className="text-lg text-primary">{Number(order.total_price || 0).toLocaleString('fr-FR')} BIF</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
