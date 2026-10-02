import { ArrowLeft, Building2, Globe2, Mail, MapPin, Package, Phone, Star, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../Composants/Loading'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import ZoomableImage from '../Composants/ZoomableImage.jsx'
import { shopApi } from '../../services'

export default function ProfilVendeur() {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    shopApi.detail(id)
      .then(({ data }) => {
        if (active) setShop(data)
      })
      .catch(() => {
        if (active) setError('Impossible de charger le profil de ce vendeur.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/accueil" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 hover:text-primary">
          <ArrowLeft size={16} /> Retour à l&apos;accueil
        </Link>

        {loading ? <Loading /> : error || !shop ? (
          <div className="py-20 text-center text-base-content/65">{error || 'Vendeur introuvable.'}</div>
        ) : (
          <>
            <section className="rounded-3xl border border-base-300 bg-[var(--surface)] p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Informations de la boutique</p>
              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                {shop.shopImage ? (
                  <ZoomableImage src={shop.shopImage} alt={shop.name} className="h-24 w-24 shrink-0 rounded-2xl bg-primary/10 text-primary" />
                ) : (
                  <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 size={38} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-extrabold text-base-content">{shop.name}</h1>
                  <p className="mt-2 flex items-center gap-2 text-base-content/60">
                    <Store size={16} /> {shop.category || 'Boutique'}
                  </p>
                </div>
              </div>
              <p className="mt-6 leading-7 text-base-content/75">{shop.description || 'Cette boutique n’a pas encore ajouté de description.'}</p>
            </section>

            <section className="mt-6 rounded-3xl border border-base-300 bg-[var(--surface)] p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Profil du propriétaire</p>
              <div className="mt-4 flex items-center gap-4">
                {shop.creatorPhoto ? (
                  <ZoomableImage src={shop.creatorPhoto} alt={shop.creatorName || shop.owner} className="h-16 w-16 shrink-0 rounded-full" />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {(shop.creatorName || shop.owner || '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-base-content">{shop.creatorName || shop.owner}</h2>
              </div>
              <div className="mt-6 grid gap-3 border-t border-base-200 pt-5 text-sm text-base-content/70 sm:grid-cols-2">
                {shop.email && <p className="flex items-center gap-2"><Mail size={16} /> {shop.email}</p>}
                {shop.phone && <p className="flex items-center gap-2"><Phone size={16} /> {shop.phone}</p>}
                {shop.address && <p className="flex items-center gap-2"><MapPin size={16} /> {shop.address}</p>}
                {shop.website && <a href={shop.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={16} /> Site web</a>}
                {shop.instagram && <a href={shop.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={16} /> Instagram</a>}
                {shop.facebook && <a href={shop.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={16} /> Facebook</a>}
                {shop.tiktok && <a href={shop.tiktok} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={16} /> TikTok</a>}
              </div>
            </section>

            <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Metric icon={Package} label="Produits" value={shop.products} />
              <Metric icon={Star} label="Note" value={shop.rating || '—'} />
              <Metric icon={Star} label="Avis" value={shop.reviewCount || 0} />
              <Metric icon={Store} label="Vues" value={shop.views || 0} />
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-base-content">Produits de {shop.name}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shop.productList?.map((product) => (
                  <Link key={product.id} to={`/produit/${product.id}`} className="rounded-2xl border border-base-300 bg-[var(--surface)] p-5 transition hover:border-primary/40 hover:shadow-md">
                    <p className="font-semibold text-base-content">{product.name}</p>
                    <p className="mt-2 font-bold text-primary">{Number(product.price).toLocaleString('fr-FR')} BIF</p>
                  </Link>
                ))}
              </div>
              {!shop.productList?.length && <p className="mt-4 text-base-content/60">Aucun produit publié.</p>}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-[var(--surface)] p-4 text-center">
      <Icon size={20} className="mx-auto text-primary" />
      <p className="mt-2 text-xl font-bold text-base-content">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  )
}