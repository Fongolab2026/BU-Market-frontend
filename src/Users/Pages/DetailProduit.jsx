import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingBag, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { productApi, categoryApi, favoriteApi, isAuthenticated } from '../../services'
import Loading from '../Composants/Loading'

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
      <main className="min-h-screen bg-base-100">
        <Loading />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-100 px-6">
        <div className="max-w-md text-center">
          <p className="text-3xl font-bold text-base-content/20">🤷</p>
          <p className="mt-3 font-semibold text-base-content">{error || 'Produit introuvable.'}</p>
          <Link to="/" className="btn btn-primary mt-6">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-base-content/60 transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Galerie d'images (principale + secondaires) */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-base-300 bg-[var(--surface)] shadow-sm">
              <img
                src={selectedImage || product.main_image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, index) => (
                  <button
                    key={img.id ?? index}
                    type="button"
                    onClick={() => setSelectedImage(img.image)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 bg-[var(--surface)] transition-all ${
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
          <div className="flex flex-col gap-5">
            <div>
              <span className="badge badge-primary badge-sm uppercase tracking-wide">
                {categoryName}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3 text-sm text-base-content/60">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store size={18} aria-hidden="true" />
              </span>
              Vendu par le vendeur n°{product.owner}
            </div>

            <p className="text-3xl font-bold text-primary">
              {Number(product.price).toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>

            <div className="border-y border-base-300 py-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60">
                Description
              </h2>
              <p className="mt-3 leading-7 text-base-content/80">{product.details}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleFavorite}
                className="btn gap-2"
              >
                <Heart size={18} className="text-red-500" aria-hidden="true" />
                Favori
              </button>
              <button type="button" className="btn btn-primary gap-2">
                <ShoppingBag size={18} aria-hidden="true" />
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}