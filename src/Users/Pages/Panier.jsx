import { Minus, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Composants/Footer'
import NavBar from '../Composants/nav'
import { CartSkeleton } from '../../components/skeletons'
import { useCart } from '../../context/CartContext.jsx'
import { cartApi } from '../../services'

export default function Panier() {
  const navigate = useNavigate()
  const {
    items,
    total,
    loading,
    refresh,
    updateQuantity: persistQuantity,
    removeItem: persistRemove,
  } = useCart()
  const [busy, setBusy] = useState(false)

  // Quantité maximale commandable pour une ligne (stock restant du vendeur).
  const maxFor = (item) => (typeof item.stock === 'number' ? item.stock : Infinity)
  const isMaxed = (item) => item.quantity >= maxFor(item)
  // Stock devenu insuffisant (le vendeur en a retiré depuis l'ajout au panier).
  const overStocked = items.some(
    (item) => typeof item.stock === 'number' && item.quantity > item.stock,
  )

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return removeItem(item)
    if (quantity > maxFor(item)) {
      toast.error(`Stock insuffisant. Disponible : ${item.stock}.`)
      return
    }
    try {
      await persistQuantity(item.id, quantity)
    } catch (error) {
      toast.error(error.response?.data?.quantity?.[0] || 'Quantité indisponible.')
    }
  }

  const removeItem = async (item) => {
    try {
      await persistRemove(item.id)
      toast.success('Produit retiré du panier.')
    } catch {
      toast.error('Impossible de retirer ce produit.')
    }
  }

  const checkout = async () => {
    if (!items.length || busy) return
    setBusy(true)
    try {
      const { data } = await cartApi.checkout()
      toast.success(`Commande #${data.id} créée avec succès.`)
      await refresh()
      navigate('/commandes')
    } catch (error) {
      toast.error(error.response?.data?.cart?.[0] || 'Impossible de confirmer la commande.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <NavBar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-primary" />
          <h1 className="text-3xl font-extrabold text-base-content">Mon panier</h1>
        </div>

        {loading ? (
          <CartSkeleton />
        ) : !items.length ? (
          <div className="py-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-base-content/25" />
            <p className="mt-4 font-semibold text-base-content">Votre panier est vide.</p>
            <p className="mt-1 text-sm text-base-content/55">
              Parcourez le catalogue et ajoutez vos coups de cœur.
            </p>
            <Link to="/accueil" className="btn btn-primary mt-6">Découvrir les produits</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
            <section className="space-y-3">
              {items.map((item) => {
                const maxed = isMaxed(item)
                const hasStockInfo = typeof item.stock === 'number'
                return (
                  <article
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-base-300 bg-(--surface) p-3 sm:flex-nowrap sm:gap-4 sm:p-4"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-base-200 bg-base-200 sm:h-20 sm:w-20">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-base-content/30">
                          <Package size={22} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-base-content">{item.product_name}</h2>
                      <p className="mt-1 text-sm text-base-content/60">
                        Sous-total : {Number(item.subtotal).toLocaleString('fr-FR')} BIF
                      </p>
                      {hasStockInfo && (
                        <p
                          className={`mt-1 text-xs font-medium ${
                            maxed ? 'text-error' : 'text-base-content/45'
                          }`}
                        >
                          {maxed
                            ? item.quantity > item.stock
                              ? `Stock insuffisant — ${item.stock} disponible${item.stock > 1 ? 's' : ''}`
                              : `Stock maximum atteint — ${item.stock} disponible${item.stock > 1 ? 's' : ''}`
                            : `${item.stock} en stock`}
                        </p>
                      )}
                    </div>
                    <div className="flex w-full items-center justify-end gap-2 border-t border-base-200 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                      <button type="button" onClick={() => updateQuantity(item, item.quantity - 1)} className="btn btn-ghost btn-sm btn-circle" aria-label="Diminuer la quantité"><Minus size={15} /></button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        disabled={maxed}
                        title={maxed ? 'Stock maximum atteint' : 'Augmenter la quantité'}
                        className="btn btn-ghost btn-sm btn-circle disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={15} />
                      </button>
                      <button type="button" onClick={() => removeItem(item)} className="btn btn-ghost btn-sm btn-circle text-error" aria-label="Supprimer du panier"><Trash2 size={16} /></button>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-base-300 bg-(--surface) p-5 lg:sticky lg:top-24">
              <h2 className="font-bold text-base-content">Résumé</h2>
              {overStocked && (
                <p className="mt-3 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-xs font-medium text-error">
                  Certains articles dépassent le stock disponible. Réduisez les quantités pour continuer.
                </p>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-base-200 pt-4">
                <span className="font-semibold">Total</span>
                <strong className="text-xl text-primary">{total.toLocaleString('fr-FR')} BIF</strong>
              </div>
              <button
                type="button"
                onClick={checkout}
                disabled={busy || overStocked}
                className="btn btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {overStocked ? 'Stock insuffisant' : busy ? 'Confirmation...' : 'Confirmer la commande'}
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
