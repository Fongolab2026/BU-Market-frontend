import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAuthenticated } from '../../../services'
import { useFavorites } from '../../../hooks/useFavorites'

export default function CardProducts({ product, categoryName, onToggle }) {
  const { isFavorite, toggleFavorite, loading } = useFavorites()
  const liked = isFavorite(product.id)
  // Les visiteurs non connectés sont redirigés vers l'inscription plutôt que
  // vers la fiche produit (protégée par RequireBuyer).
  const requiresAuth = !isAuthenticated()

  const handleFavorite = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated()) {
      return toast.error('Connectez-vous pour ajouter aux favoris')
    }
    await toggleFavorite(product.id)
    onToggle?.(product.id, liked)
  }

  const handleOpen = () => {
    if (requiresAuth) {
      toast('Connectez-vous pour voir ce produit', { icon: '🔒' })
    }
  }

  return (
    <Link
      to={requiresAuth ? '/inscription' : `/produit/${product.id}`}
      onClick={handleOpen}
      className="group flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-base-300 bg-[var(--surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:max-w-none"
    >
      {/* Image principale */}
      <div className="relative aspect-square w-full overflow-hidden bg-base-200">
        {product.main_image ? (
          <img
            src={product.main_image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-base-content/30">
            Pas d'image
          </div>
        )}
        <button
          type="button"
          onClick={handleFavorite}
          title={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          disabled={loading}
          className={`btn btn-ghost btn-circle btn-xs absolute right-2 top-2 bg-base-100/80 backdrop-blur ${
            liked ? 'text-red-500' : 'text-base-content/60'
          }`}
        >
          <Heart size={18} className={liked ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Informations */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-1 font-bold capitalize text-base-content">{product.name}</h2>
        <span className="uppercase text-xs text-base-content/50">{categoryName ?? 'Produit'}</span>
        <p className="line-clamp-1 text-xs font-semibold text-base-content/60">
          Vendeur : {product.shopName || product.owner_username || 'Vendeur'}
        </p>
        <p className="text-sm text-base-content/70 line-clamp-2">{product.details}</p>
        <h2 className="mt-auto font-bold text-primary">
          {Number(product.price).toLocaleString('fr-FR')} BIF
        </h2>
      </div>
    </Link>
  )
}