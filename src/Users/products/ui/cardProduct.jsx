import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { favoriteApi, isAuthenticated } from '../../../services'

export default function CardProducts({ product, categoryName }) {
  const handleFavorite = async (event) => {
    event.preventDefault()
    event.stopPropagation()
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

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group flex w-[240px] flex-col overflow-hidden rounded-2xl border border-base-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
            Pas d&apos;image
          </div>
        )}
        <button
          type="button"
          onClick={handleFavorite}
          title="Ajouter aux favoris"
          className="btn btn-ghost btn-circle btn-xs absolute right-2 top-2 bg-white/80 backdrop-blur"
        >
          <Heart size={18} className="text-red-500" />
        </button>
      </div>

      {/* Informations */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-1 font-bold capitalize text-base-content">{product.name}</h2>
        <span className="uppercase text-xs text-base-content/50">{categoryName ?? 'Produit'}</span>
        <p className="text-sm text-base-content/70 line-clamp-2">{product.details}</p>
        <h2 className="mt-auto font-bold text-primary">
          {Number(product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h2>
      </div>
    </Link>
  )
}