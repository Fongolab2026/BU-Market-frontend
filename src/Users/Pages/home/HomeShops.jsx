import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Globe, Mail, MapPin, Phone, Store, Users, X } from 'lucide-react'
import { shopApi } from '../../../services'
import ZoomableImage from '../../Composants/ZoomableImage.jsx'
import Reveal from '../../../components/Reveal.jsx'
import ReviewSection from '../../../components/reviews/ReviewSection.jsx'

export default function HomeShops({ shops, loadError = false }) {
  const [selectedShop, setSelectedShop] = useState(null)

  const openShop = async (shopId) => {
    try {
      const { data } = await shopApi.detail(shopId)
      setSelectedShop(data)
    } catch {
      setSelectedShop(null)
    }
  }

  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="border-t border-base-300 pt-12" aria-labelledby="boutiques-title">
        <Reveal className="mb-7 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Vendeurs</span>
            <h2 id="boutiques-title" className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Nos boutiques
            </h2>
          </div>
          <p className="text-sm text-base-content/60">
            Découvrez les boutiques validées de la marketplace
            {shops.length > 0 && ` · ${shops.length > 100 ? '100+' : shops.length}`}
          </p>
        </Reveal>

        {shops.length === 0 ? (
          loadError ? (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-6 text-base-content/75"
            >
              <AlertTriangle size={17} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
              Les boutiques n’ont pas pu être chargées. Rechargez la page pour réessayer.
            </p>
          ) : (
            <p className="text-center text-base-content/60">
              Aucune boutique validée pour le moment.
            </p>
          )
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop, index) => (
              <Reveal key={shop.id} delay={(index % 3) * 80}>
                <button
                  type="button"
                  onClick={() => openShop(shop.id)}
                  className="group w-full rounded-2xl border border-base-300 bg-[var(--surface)] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                      {shop.shopImage ? (
                        <img src={shop.shopImage} alt={shop.name} className="h-full w-full object-cover" />
                      ) : (
                        <Store size={23} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-base-content group-hover:text-primary">{shop.name}</h3>
                      <p className="mt-1 text-sm text-base-content/60">{shop.category || 'Boutique'}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-base-200 pt-4 text-center text-xs text-base-content/60">
                    <span><strong className="block text-base font-bold text-base-content">{shop.products}</strong>produits</span>
                    <span><strong className="block text-base font-bold text-base-content">{shop.rating || '—'}</strong>note</span>
                    <span><strong className="block text-base font-bold text-base-content">{shop.views || 0}</strong>vues</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {selectedShop && (
        <ShopDetail shop={selectedShop} onClose={() => setSelectedShop(null)} />
      )}
    </Reveal>
  )
}

function ShopDetail({ shop, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="shop-detail-title">
      <article className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[var(--surface)] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Boutique validée</p>
            <div className="flex items-center gap-3">
              {shop.shopImage && <ZoomableImage src={shop.shopImage} alt={shop.name} className="size-12 rounded-xl" />}
              {shop.creatorPhoto && <ZoomableImage src={shop.creatorPhoto} alt={shop.creatorName || shop.owner} className="size-10 rounded-full" />}
              <h2 id="shop-detail-title" className="mt-1 text-3xl font-extrabold text-base-content">{shop.name}</h2>
            </div>
            <p className="mt-1 text-sm text-base-content/60">
              {shop.category || 'Catégorie non renseignée'} · Vendeur : {shop.creatorName || shop.owner}
            </p>
            <Link
              to={`/profil-vendeur/${shop.ownerId}`}
              onClick={onClose}
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Voir le profil du vendeur
            </Link>
            <div className="mt-4 space-y-1 text-sm text-base-content/65">
              <p className="flex items-center gap-2"><Users size={15} /> {shop.creatorName || shop.owner}</p>
              {shop.email && <p className="flex items-center gap-2"><Mail size={15} /> {shop.email}</p>}
              {shop.phone && <p className="flex items-center gap-2"><Phone size={15} /> {shop.phone}</p>}
              {shop.address && <p className="flex items-center gap-2"><MapPin size={15} /> {shop.address}</p>}
              {shop.website && <a href={shop.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe size={15} /> Site web</a>}
              {shop.instagram && <a href={shop.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe size={15} /> Instagram</a>}
              {shop.facebook && <a href={shop.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe size={15} /> Facebook</a>}
              {shop.tiktok && <a href={shop.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe size={15} /> TikTok</a>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-circle" aria-label="Fermer le détail de la boutique">
            <X size={20} />
          </button>
        </div>

        <p className="mt-6 leading-7 text-base-content/75">
          {shop.description || 'Cette boutique n’a pas encore ajouté de description.'}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ShopMetric label="Produits" value={shop.products} />
          <ShopMetric label="Note" value={shop.rating || '—'} />
          <ShopMetric label="Avis" value={shop.reviewCount || 0} />
          <ShopMetric label="Vues" value={shop.views || 0} />
        </div>

        <h3 className="mt-8 text-xl font-bold text-base-content">Produits de la boutique</h3>
        {shop.productList?.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shop.productList.map((product) => (
              <Link key={product.id} to={`/produit/${product.id}`} onClick={onClose} className="rounded-xl border border-base-300 p-4 transition hover:border-primary/40 hover:bg-primary/5">
                <p className="font-semibold text-base-content">{product.name}</p>
                <p className="mt-1 text-sm text-primary">{Number(product.price).toLocaleString('fr-FR')} BIF</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-base-content/60">Aucun produit publié dans cette boutique.</p>
        )}

        <div className="mt-8 border-t border-base-300 pt-6">
          <ReviewSection
            targetType="shop"
            targetId={shop.ownerId}
            ownerId={shop.ownerId}
            compact
          />
        </div>
      </article>
    </div>
  )
}

function ShopMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-base-200/60 p-3 text-center">
      <p className="text-lg font-bold text-base-content">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  )
}
