import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { favoriteApi, isAuthenticated } from '../../../services'

export default function CardProducts({ product, categoryName }) {
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

  return (
    <div className="w-[240px] border border-base-300 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold capitalize text-lg">{product.name}</h2>
          <button onClick={handleFavorite} title="Ajouter aux favoris" className="btn btn-ghost btn-circle btn-xs">
            <Heart size={18} className="text-red-500" />
          </button>
        </div>
        <span className="uppercase text-xs text-base-content/50">{categoryName ?? 'Produit'}</span>
        <p className="text-sm text-base-content/70 line-clamp-2">{product.details}</p>
        <h2 className="font-bold text-primary">
          {Number(product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </h2>
      </div>
    </div>
  )
}