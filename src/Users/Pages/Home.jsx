import { Link } from 'react-router-dom'
import { ArrowRight, Shirt, Watch, Footprints, Backpack, Package } from 'lucide-react'
import CardProduit from '../Composants/CardProduit.jsx'

/* Données d'exemple — à remplacer par l'API (productApi.list) si besoin */
const produits = [
  {
    id: 1,
    name: 'Chemise en lin',
    vendor: 'Buja Style',
    price: 29.9,
    icon: Shirt,
    image: 'linear-gradient(135deg, #e8dcc9 0%, #c4ab90 100%)',
  },
  {
    id: 2,
    name: 'Veste en jean',
    vendor: 'Denim & Co',
    price: 45.0,
    icon: Shirt,
    image: 'linear-gradient(135deg, #4d6273 0%, #1e2a35 100%)',
  },
  {
    id: 3,
    name: 'Pantalon chino',
    vendor: 'Mode Homme',
    price: 35.5,
    icon: Shirt,
    image: 'linear-gradient(135deg, #b49d82 0%, #7d684f 100%)',
  },
  {
    id: 4,
    name: 'T-shirt coton bio',
    vendor: 'Urban Wear',
    price: 15.0,
    icon: Shirt,
    image: 'linear-gradient(135deg, #6b7ba8 0%, #2f3f66 100%)',
  },
  {
    id: 5,
    name: 'Sneakers blanches',
    vendor: 'Step Paris',
    price: 59.9,
    icon: Footprints,
    image: 'linear-gradient(135deg, #e3e3e3 0%, #9aa1a8 100%)',
  },
  {
    id: 6,
    name: 'Montre classique',
    vendor: 'Tempo Luxe',
    price: 79.0,
    icon: Watch,
    image: 'linear-gradient(135deg, #2b3440 0%, #10161d 100%)',
  },
  {
    id: 7,
    name: 'Ceinture en cuir',
    vendor: 'Cuir & Co',
    price: 19.9,
    icon: Package,
    image: 'linear-gradient(135deg, #b98a4e 0%, #6e4518 100%)',
  },
  {
    id: 8,
    name: 'Sac à dos urbain',
    vendor: 'Nomad Gear',
    price: 49.0,
    icon: Backpack,
    image: 'linear-gradient(135deg, #4f6b58 0%, #22382b 100%)',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* En-tête de section */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Collection
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Tous hommes
            </h2>
          </div>
          <Link
            to="/recherche?q="
            className="btn btn-ghost btn-sm gap-1 text-primary hover:bg-primary/10"
          >
            Voir plus
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {produits.map((produit) => (
            <CardProduit key={produit.id} product={produit} />
          ))}
        </div>
      </div>
    </main>
  )
}