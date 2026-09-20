import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { orderApi } from '../../../services'

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  completed: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_BADGE = {
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-info/20 text-info',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-error/20 text-error',
}

export default function Detail() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await orderApi.list()
      setOrders((Array.isArray(data) ? data : data.results ?? []))
    } catch (e) {
      setError('Impossible de charger les demandes')
      console.error('orders:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = async (order, status) => {
    if (status === order.status) return
    try {
      const { data } = await orderApi.partialUpdate(order.id, { status })
      setOrders(orders.map((o) => (o.id === data.id ? data : o)))
      toast.success('Statut mis à jour')
    } catch {
      toast.error('Mise à jour impossible')
    }
  }

  return (
    <div className='min-h-screen bg-base-100 text-base-content p-6'>
      <h1 className='text-2xl font-bold mb-4'>Approbation des demandes</h1>

      {error && <div className='alert alert-error mb-4'>{error}</div>}

      <div className='w-full bg-white shadow-2xl rounded-2xl p-4 overflow-x-auto'>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm font-semibold text-slate-600">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Utilisateur</th>
              <th className="py-3 px-3">Articles</th>
              <th className="py-3 px-3">Total</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Statut</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200/70 text-sm text-slate-700'>
            {loading ? (
              <tr><td className="py-8 text-center" colSpan="6"><span className="loading loading-spinner loading-lg"></span></td></tr>
            ) : orders.length === 0 ? (
              <tr><td className="py-8 text-center text-slate-500" colSpan="6">Aucune commande.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-100/50 transition-colors">
                  <td className="py-3 px-3 font-semibold">{o.id}</td>
                  <td className="py-3 px-3">{o.user}</td>
                  <td className="py-3 px-3">{o.items?.length ?? 0}</td>
                  <td className="py-3 px-3">
                    {Number(o.total_price ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${STATUS_BADGE[o.status] ?? 'bg-base-300'}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                      <select
                        className="select select-xs select-bordered"
                        value={o.status}
                        onChange={(e) => updateStatus(o, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}