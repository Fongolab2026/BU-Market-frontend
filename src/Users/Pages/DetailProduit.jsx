import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Heart, ShieldCheck, ShoppingBag, Store, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { productApi, categoryApi, favoriteApi, isAuthenticated } from '../../services'
import Loading from '../Composants/Loading'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'

export default function DetailProduit() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.detail(id),
          categoryApi.list(),
        ])
        if (!active) return
        setProduct(prodRes.data)
        setSelectedImage(prodRes.data.main_image)
        setCategories(
          Array.isArray(catRes.data) ? catRes.data : catRes.data.results ?? []
        )
      } catch (e) {
        if (active) {
          console.error('detail produit:', e)
          setError('Impossible de charger ce produit.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  const categoryName =
    categories.find((c) => c.id === product?.category)?.name ?? 'Produit'

  const galleryImages =
    product?.images?.length
      ? product.images
      : product?.main_image
        ? [{ id: 'main', image: product.main_image, is_main: true }]
        : []

  const handleFavorite = async () => {
    if (!isAuthenticated()) {
      return toast.error('Connectez-vous pour ajouter aux favoris')
    }
    try {
      await favoriteApi.create({ product: product.id, stars: 5 })
      toast.success('Ajouté aux favoris')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Déjà dans vos favoris')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <NavBar />
        <Loading />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-100">
        <NavBar />
        <main className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="max-w-md text-center">
            <p className="text-5xl font-bold text-primary/25">404</p>
            <p className="mt-3 font-semibold text-base-content">{error || 'Produit introuvable.'}</p>
            <Link to="/" className="btn btn-primary mt-6 gap-2">
              <ArrowLeft size={17} aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-12">
          {/* Galerie d'images (principale + secondaires) */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-base-300 bg-[var(--surface)] shadow-lg shadow-base-content/5">
              <img
                src={selectedImage || product.main_image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-base-100/90 px-3 py-1.5 text-xs font-bold text-base-content shadow-sm backdrop-blur">
                <BadgeCheck size={15} className="text-success" aria-hidden="true" />
                Produit vérifié
              </span>
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {galleryImages.map((img, index) => (
                  <button
                    key={img.id ?? index}
                    type="button"
                    onClick={() => setSelectedImage(img.image)}
                    className={`aspect-square overflow-hidden rounded-2xl border-2 bg-[var(--surface)] transition-all ${
                      selectedImage === img.image
                        ? 'border-primary shadow-md'
                        : 'border-base-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`${product.name} - vue ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="flex flex-col gap-6 lg:pt-3">
            <div className="border-b border-base-300 pb-6">
              <span className="badge badge-primary badge-sm uppercase tracking-wide">
                {categoryName}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-base-content sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-[var(--surface)] p-4 text-sm text-base-content/65">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-base-content/45">Vendu par</p>
                <p className="font-semibold text-base-content">Vendeur n°{product.owner}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/10 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-base-content/55">Prix actuel</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-primary">
                {Number(product.price).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>

            <div className="border-b border-base-300 pb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60">
                Description
              </h2>
              <p className="mt-3 leading-7 text-base-content/75">{product.details || 'Aucune description disponible pour ce produit.'}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleFavorite}
                className="btn btn-outline gap-2"
              >
                <Heart size={18} className="text-red-500" aria-hidden="true" />
                Favori
              </button>
              <button type="button" className="btn btn-primary flex-1 gap-2 sm:flex-none">
                <ShoppingBag size={18} aria-hidden="true" />
                Ajouter au panier
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-base-300 pt-5 text-sm text-base-content/65 sm:grid-cols-2">
              <span className="flex items-center gap-2"><Truck size={17} className="text-primary" /> Livraison rapide</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-primary" /> Paiement sécurisé</span>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}