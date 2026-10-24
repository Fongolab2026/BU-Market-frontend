import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Globe2, Heart, Mail, MapPin, Phone, ShieldCheck, ShoppingBag, Star, Store, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { productApi, categoryApi, reviewApi, isAuthenticated } from '../../services'
import { useFavorites } from '../../hooks/useFavorites'
import { useCart } from '../../context/CartContext.jsx'
import { ProductDetailSkeleton } from '../../components/skeletons'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DetailProduit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewNote, setReviewNote] = useState('5')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(true)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reportedReviewIds, setReportedReviewIds] = useState([])

  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItem } = useCart()
  const liked = product ? isFavorite(product.id) : false

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

  useEffect(() => {
    let active = true
    setReviewLoading(true)
    setReportedReviewIds([])
    reviewApi.list({ product: id, perPage: 100 }).then(({ data }) => {
      if (!active) return
      const result = Array.isArray(data) ? data : data?.results ?? []
      setReviews(Array.isArray(result) ? result : [])
    }).catch(() => {
      if (active) setReviews([])
    }).finally(() => {
      if (active) setReviewLoading(false)
    })
    return () => { active = false }
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
    await toggleFavorite(product.id)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated()) return toast.error('Connectez-vous pour ajouter au panier')
    try {
      await addItem(product.id)
      toast.success('Produit ajouté au panier')
      navigate('/panier')
    } catch (err) {
      toast.error(err.response?.data?.quantity?.[0] || err.response?.data?.detail || "Impossible d'ajouter ce produit au panier")
    }
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated()) {
      toast.error('Connectez-vous pour laisser un avis')
      return
    }
    setReviewSubmitting(true)
    try {
      const { data } = await reviewApi.create({
        product: Number(id),
        note: Number(reviewNote),
        comment: reviewComment.trim(),
      })
      setReviews((current) => [data, ...current])
      setReviewComment('')
      toast.success('Votre avis a été publié.')
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0]
      toast.error(detail || 'Impossible de publier votre avis.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleReportReview = async (review) => {
    if (!isAuthenticated()) {
      toast.error('Connectez-vous pour signaler un avis.')
      return
    }
    try {
      const { data } = await reviewApi.report(review.id)
      setReportedReviewIds((current) => [...current, review.id])
      if (data.hidden) {
        setReviews((current) => current.filter((item) => item.id !== review.id))
      }
      toast.success('Avis signalé à notre équipe.')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Impossible de signaler cet avis.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <NavBar />
        <ProductDetailSkeleton />
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
            <Link to="/accueil" className="btn btn-primary mt-6 gap-2">
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
          to="/accueil"
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
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                {product.shopImage ? (
                  <img src={product.shopImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Store size={18} aria-hidden="true" />
                )}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-base-content/45">Vendu par</p>
                <p className="font-semibold text-base-content">{product.sellerName || product.shopName || `Vendeur n°${product.owner}`}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300 bg-[var(--surface)] p-4 text-sm text-base-content/70">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-base-content/45">Coordonnées du vendeur</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {product.sellerEmail && <a href={`mailto:${product.sellerEmail}`} className="flex items-center gap-2 text-primary hover:underline"><Mail size={15} /> {product.sellerEmail}</a>}
                {product.sellerPhone && <a href={`tel:${product.sellerPhone}`} className="flex items-center gap-2 text-primary hover:underline"><Phone size={15} /> {product.sellerPhone}</a>}
                {product.sellerAddress && <p className="flex items-center gap-2"><MapPin size={15} /> {product.sellerAddress}</p>}
                {product.sellerWebsite && <a href={product.sellerWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={15} /> Site web</a>}
                {product.sellerInstagram && <a href={product.sellerInstagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={15} /> Instagram</a>}
                {product.sellerFacebook && <a href={product.sellerFacebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={15} /> Facebook</a>}
                {product.sellerTiktok && <a href={product.sellerTiktok} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline"><Globe2 size={15} /> TikTok</a>}
              </div>
            </div>

            <div className="rounded-2xl bg-primary/10 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-base-content/55">Prix actuel</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-primary">
                {Number(product.price).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'BIF',
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
                className={`btn btn-outline gap-2 ${liked ? 'text-red-500' : ''}`}
              >
                <Heart size={18} className={liked ? 'fill-current text-red-500' : 'text-base-content/60'} aria-hidden="true" />
                {liked ? 'Retirer des favoris' : 'Favori'}
              </button>
              <button type="button" onClick={handleAddToCart} className="btn btn-primary flex-1 gap-2 sm:flex-none">
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
        <section className="mx-auto mt-12 max-w-4xl border-t border-base-300 px-4 pt-8 sm:px-0" aria-labelledby="reviews-title">
          <div className="mb-6 flex items-center gap-2">
            <Star size={20} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            <h2 id="reviews-title" className="text-xl font-bold text-base-content">Avis clients</h2>
            <span className="text-sm text-base-content/55">({reviews.length})</span>
          </div>
          <form onSubmit={handleReviewSubmit} className="mb-8 grid gap-3 rounded-2xl border border-base-300 bg-[var(--surface)] p-4 sm:grid-cols-[150px_1fr_auto] sm:items-end">
            <label className="form-control gap-1 text-sm font-medium">
              Votre note
              <select className="select select-bordered" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
              </select>
            </label>
            <label className="form-control gap-1 text-sm font-medium">
              Votre commentaire
              <textarea className="textarea textarea-bordered min-h-12" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} maxLength={2000} placeholder="Partagez votre expérience" rows={2} />
            </label>
            <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
              {reviewSubmitting ? 'Publication…' : 'Publier'}
            </button>
          </form>
          {reviewLoading ? <p className="text-sm text-base-content/60">Chargement des avis…</p> : reviews.length === 0 ? (
            <p className="rounded-xl bg-base-200/50 p-4 text-sm text-base-content/60">Aucun avis pour ce produit. Soyez le premier à partager votre expérience.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-base-300 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-base-content">{review.author}</p>
                    <span className="text-sm font-semibold text-amber-600">{'★'.repeat(Number(review.note) || 0)}{'☆'.repeat(5 - (Number(review.note) || 0))} <span className="text-base-content/60">{review.note}/5</span></span>
                  </div>
                  {review.comment && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-base-content/70">{review.comment}</p>}
                  {user?.id !== review.authorId && !reportedReviewIds.includes(review.id) && (
                    <button type="button" onClick={() => handleReportReview(review)} className="mt-3 text-xs font-semibold text-base-content/50 underline-offset-2 hover:text-error hover:underline">
                      Signaler cet avis
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
