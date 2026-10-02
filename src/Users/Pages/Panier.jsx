import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { cartApi, cartItemApi } from '../../services'

export default function Panier() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const loadCart = async () => {
    try {
      const { data } = await cartApi.list()
      const carts = data.results ?? data
      setCart(Array.isArray(carts) ? carts[0] || null : null)
    } catch {
      toast.error('Impossible de charger le panier.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCart() }, [])

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return removeItem(item)
    try {
      const { data } = await cartItemApi.partialUpdate(item.id, { quantity })
      setCart((current) => ({
        ...current,
        items: current.items.map((entry) => entry.id === data.id ? data : entry),
      }))
    } catch (error) {
      toast.error(error.response?.data?.quantity?.[0] || 'Quantité indisponible.')
    }
  }

  const removeItem = async (item) => {
    await cartItemApi.remove(item.id)
    setCart((current) => ({
      ...current,
      items: current.items.filter((entry) => entry.id !== item.id),
    }))
  }

  const checkout = async () => {
    if (!cart?.items?.length || busy) return
    setBusy(true)
    try {
      const { data } = await cartApi.checkout()
      toast.success(`Commande #${data.id} créée avec succès.`)
      navigate('/commandes')
    } catch (error) {
      toast.error(error.response?.data?.cart?.[0] || 'Impossible de confirmer la commande.')
    } finally {
      setBusy(false)
    }
  }

  const total = Number(cart?.total_prices || 0)

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-primary" />
          <h1 className="text-3xl font-extrabold text-base-content">Mon panier</h1>
        </div>

        {loading ? <p className="py-20 text-center text-base-content/60">Chargement du panier...</p> : !cart?.items?.length ? (
          <div className="py-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-base-content/25" />
            <p className="mt-4 font-semibold text-base-content">Votre panier est vide.</p>
            <Link to="/accueil" className="btn btn-primary mt-6">Découvrir les produits</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <section className="space-y-3">
              {cart.items.map((item) => (
                <article key={item.id} className="flex items-center gap-4 rounded-2xl border border-base-300 bg-(--surface) p-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-base-content">{item.product_name}</h2>
                    <p className="mt-1 text-sm text-base-content/60">Sous-total : {Number(item.subtotal).toLocaleString('fr-FR')} BIF</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item, item.quantity - 1)} className="btn btn-ghost btn-sm btn-circle" aria-label="Diminuer la quantité"><Minus size={15} /></button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item, item.quantity + 1)} className="btn btn-ghost btn-sm btn-circle" aria-label="Augmenter la quantité"><Plus size={15} /></button>
                    <button type="button" onClick={() => removeItem(item)} className="btn btn-ghost btn-sm btn-circle text-error" aria-label="Supprimer du panier"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-base-300 bg-(--surface) p-5">
              <h2 className="font-bold text-base-content">Résumé</h2>
              <div className="mt-5 flex items-center justify-between border-t border-base-200 pt-4">
                <span className="font-semibold">Total</span>
                <strong className="text-xl text-primary">{total.toLocaleString('fr-FR')} BIF</strong>
              </div>
              <button type="button" onClick={checkout} disabled={busy} className="btn btn-primary mt-5 w-full">
                {busy ? 'Confirmation...' : 'Confirmer la commande'}
              </button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
