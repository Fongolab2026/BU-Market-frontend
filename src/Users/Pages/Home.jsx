import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Search,
  Sparkles,
  Truck,
} from 'lucide-react'
import CardProducts from '../products/ui/cardProduct'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { useAuth } from '../../context/AuthContext.jsx'
import { productApi, categoryApi } from '../../services'

const TRUST_POINTS = [
  { icon: Truck, title: 'Livraison rapide', text: 'Expédition sous 24h' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Transactions protégées' },
  { icon: RotateCcw, title: 'Retours faciles', text: 'Satisfait ou remboursé' },
  { icon: Headphones, title: 'Support 7j/7', text: 'Une équipe à votre écoute' },
]

const PRODUCTS_PER_PAGE = 20

/* Squelette d'une carte produit — uniquement affiché pendant le chargement initial */
function CarteSquelette({ delay }) {
  return (
    <div
      className="w-[240px] overflow-hidden rounded-2xl border border-base-300 bg-[var(--surface)] shadow-sm"
      role="status"
      aria-label="Chargement des produits"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="aspect-square w-full animate-pulse bg-base-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-base-200" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-base-200" />
        <div className="h-3 w-full animate-pulse rounded bg-base-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-base-200" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-base-200" />
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.list(),
          categoryApi.list(),
        ])
        setProducts(prodRes.data.results ?? prodRes.data)
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.results ?? [])
      } catch (e) {
        setError('Erreur lors du chargement des produits')
        console.error('home:', e)
      } finally {
        setInitialLoading(false)
      }
    }
    load()
  }, [])

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products
  const searchQuery = searchParams.get('q')?.trim().toLowerCase() || ''
  const searchedProducts = searchQuery
    ? filtered.filter((product) => {
        const category = categories.find((item) => item.id === product.category)?.name || ''
        return `${product.name} ${product.details || ''} ${category}`.toLowerCase().includes(searchQuery)
      })
    : filtered
  const totalPages = Math.max(1, Math.ceil(searchedProducts.length / PRODUCTS_PER_PAGE))
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const visibleProducts = searchedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      {/* ---------- Bandeau d'accueil ---------- */}
      <section className="home-hero relative overflow-hidden text-primary-content">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:py-24">
          {user && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-accent-content">
                {user.initials || `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold">Bonjour, {user.firstName || user.username || 'utilisateur'}</p>
                <p className="text-xs text-primary-content/75">{user.email}</p>
              </div>
            </div>
          )}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles size={16} className="text-accent" aria-hidden="true" />
            Nouvelle collection disponible
          </span>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Trouvez le produit <span className="text-accent">parfait</span>, au prix juste.
          </h1>
          <p className="max-w-xl text-lg text-primary-content/80">
            Mode, maison, high-tech et plus encore — une sélection soignée de vendeurs de
            confiance, livrée chez vous en un éclair.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href="#produits" className="btn btn-accent gap-2">
              <ShoppingBag size={18} aria-hidden="true" />
              Découvrir nos produits
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#garanties" className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20">
              Nos garanties
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Garanties ---------- */}
      <section id="garanties" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 -mt-8 lg:grid-cols-4">
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-box border border-base-300/70 bg-[var(--surface)] p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-base-content">{title}</p>
                <p className="truncate text-xs text-base-content/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* ---------- En-tête produits ---------- */}
        <div id="produits" className="mb-7 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Catalogue</span>
            <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Nos produits
            </h2>
          </div>
          {!initialLoading && (
            <p className="text-sm text-base-content/60">
              {searchedProducts.length} produit{searchedProducts.length > 1 ? 's' : ''} disponible
              {searchQuery ? ` pour « ${searchQuery} »` : selectedCategory ? ' dans cette catégorie' : ''}
            </p>
          )}
        </div>

        {/* ---------- Filtres par catégorie ---------- */}
        <div className="mx-auto mb-5 max-w-2xl">
          <label className="relative block">
            <span className="sr-only">Rechercher un produit</span>
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => {
                const nextQuery = event.target.value
                setSearchParams(nextQuery ? { q: nextQuery } : {}, { replace: true })
              }}
              placeholder="Rechercher un produit..."
              className="input h-12 w-full border-base-300 bg-[var(--surface)] pl-11 pr-4 text-base shadow-sm"
            />
          </label>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => selectCategory(null)}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => selectCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error mb-6">{error}</div>}

        {/* ---------- Grille produits / squelette ---------- */}
        {initialLoading ? (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Chargement initial des produits">
            {Array.from({ length: 8 }, (_, i) => (
              <CarteSquelette key={i} delay={i * 70} />
            ))}
          </div>
        ) : searchedProducts.length === 0 ? (
          <p className="text-center text-base-content/60">Aucun produit ne correspond à votre recherche.</p>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((p) => (
              <CardProducts
                key={p.id}
                product={p}
                categoryName={categories.find((c) => c.id === p.category)?.name}
              />
            ))}
          </div>
        )}

        {!initialLoading && searchedProducts.length > PRODUCTS_PER_PAGE && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="Pagination des produits">
            <button
              type="button"
              className="btn btn-ghost btn-sm gap-1"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              <ChevronLeft size={17} aria-hidden="true" />
              Précédente
            </button>
            <span className="rounded-field bg-base-200 px-4 py-2 text-sm font-semibold text-base-content">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm gap-1"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              Suivante
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </nav>
        )}

        {/* ---------- Bandeau promotionnel ---------- */}
        {!initialLoading && searchedProducts.length > 0 && (
          <section className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-primary-content md:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold md:text-3xl">Une question, une envie ?</h3>
                <p className="mt-2 text-primary-content/80">
                  Notre équipe vous accompagne pour trouver exactement ce qu&apos;il vous faut.
                </p>
              </div>
              <a href="#produits" className="btn btn-accent gap-2">
                Voir les produits
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </section>
        )}
      </main>

      {/* ---------- Pied de page ---------- */}
      <Footer />
    </div>
  )
}