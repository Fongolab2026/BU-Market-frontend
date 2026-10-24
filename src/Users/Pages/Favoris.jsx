import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import CardProducts from '../products/ui/cardProduct'
import { ProductGridSkeleton } from '../../components/skeletons'
import { favoriteApi, categoryApi } from '../../services'

const toProduct = (favorite) => ({
  id: favorite.product,
  name: favorite.product_name,
  price: favorite.price,
  main_image: favorite.main_image,
  shopName: favorite.shopName,
  details: favorite.details,
  category: favorite.category,
  status: favorite.product_status,
})

export default function Favoris() {
  const [favorites, setFavorites] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      favoriteApi.listAll(),
      categoryApi.list().catch(() => ({ data: [] })),
    ])
      .then(([favoriteResponse, categoryResponse]) => {
        setFavorites(Array.isArray(favoriteResponse) ? favoriteResponse : [])

        const catList = categoryResponse.data.results ?? categoryResponse.data
        setCategories(Array.isArray(catList) ? catList : [])
      })
      .catch(() => toast.error('Impossible de charger vos favoris.'))
      .finally(() => setLoading(false))
  }, [])

  const categoryName = (id) => categories.find((c) => c.id === id)?.name

  // Retire la carte immédiatement lorsque le produit est retiré des favoris.
  const handleToggle = (productId, wasFavorite) => {
    if (!wasFavorite) return
    setFavorites((current) => current.filter((f) => f.product !== productId))
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Heart className="fill-current" size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-base-content">Mes favoris</h1>
            <p className="mt-1 text-sm text-base-content/60">
              {favorites.length > 0
                ? `${favorites.length} produit${favorites.length > 1 ? 's' : ''} enregistré${favorites.length > 1 ? 's' : ''}.`
                : 'Retrouvez ici les produits que vous avez enregistrés.'}
            </p>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        ) : favorites.length === 0 ? (
          <div className="py-20 text-center">
            <Heart size={48} className="mx-auto text-base-content/25" aria-hidden="true" />
            <p className="mt-4 font-semibold text-base-content">
              Vous n&apos;avez aucun favori pour le moment.
            </p>
            <p className="mt-1 text-sm text-base-content/55">
              Touchez le cœur sur un produit pour l&apos;enregistrer ici.
            </p>
            <Link to="/accueil" className="btn btn-primary mt-6">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((favorite) => (
              <CardProducts
                key={favorite.id}
                product={toProduct(favorite)}
                categoryName={categoryName(favorite.category)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
