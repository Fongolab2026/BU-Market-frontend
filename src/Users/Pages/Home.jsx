import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import CardProducts from '../products/ui/cardProduct'
import NavBar from '../Composants/nav'
import { productApi, categoryApi } from '../../services'

const TRUST_POINTS = [
  { icon: Truck, title: 'Livraison rapide', text: 'Expédition sous 24h' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Transactions protégées' },
  { icon: RotateCcw, title: 'Retours faciles', text: 'Satisfait ou remboursé' },
  { icon: Headphones, title: 'Support 7j/7', text: 'Une équipe à votre écoute' },
]

/* Squelette d'une carte produit — uniquement affiché pendant le chargement initial */
function CarteSquelette({ delay }) {
  return (
    <div
      className="w-[240px] overflow-hidden rounded-2xl border border-base-300 bg-white shadow-sm"
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
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
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
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      {/* ---------- Bandeau d'accueil ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-primary-content">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:py-24">
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
      <section id="garanties" className="mx-auto max-w-7xl px-4 sm:px-6">
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

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* ---------- En-tête produits ---------- */}
        <div id="produits" className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Catalogue</span>
            <h2 className="text-3xl font-bold tracking-tight text-base-content">
              Nos produits
            </h2>
          </div>
          {!loading && (
            <p className="text-sm text-base-content/60">
              {filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible
              {selectedCategory ? ' dans cette catégorie' : ''}
            </p>
          )}
        </div>

        {/* ---------- Filtres par catégorie ---------- */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error mb-6">{error}</div>}

        {/* ---------- Grille produits / squelette ---------- */}
        {loading ? (
          <div className="flex flex-wrap gap-6" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => (
              <CarteSquelette key={i} delay={i * 70} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-base-content/60">Aucun produit disponible.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filtered.map((p) => (
              <CardProducts
                key={p.id}
                product={p}
                categoryName={categories.find((c) => c.id === p.category)?.name}
              />
            ))}
          </div>
        )}

        {/* ---------- Bandeau promotionnel ---------- */}
        {!loading && filtered.length > 0 && (
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
      <footer className="mt-8 border-t border-base-300/70 bg-base-200/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <p className="text-sm font-bold tracking-tight text-base-content">
            BU-<span className="text-primary">Market</span>
          </p>
          <p className="text-sm text-base-content/60">
            © {new Date().getFullYear()} BU-Market — Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}