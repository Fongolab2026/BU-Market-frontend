import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
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
  Star,
  Users,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
} from 'lucide-react'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Textarea } from 'primereact/textarea'
import CardProducts from '../products/ui/cardProduct'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { productApi, categoryApi } from '../../services'

const TRUST_POINTS = [
  { icon: Truck, title: 'Livraison rapide', text: 'Expédition sous 24h' },
  { icon: ShieldCheck, title: 'Paiement sécurisé', text: 'Transactions protégées' },
  { icon: RotateCcw, title: 'Retours faciles', text: 'Satisfait ou remboursé' },
  { icon: Headphones, title: 'Support 7j/7', text: 'Une équipe à votre écoute' },
]

const VALUES = [
  {
    icon: Heart,
    title: 'Passion',
    text: 'Nous adorons vous aider à trouver les produits qui correspondent à vos besoins et à votre style de vie.',
  },
  {
    icon: ShieldCheck,
    title: 'Confiance',
    text: 'Chaque vendeur est vérifié pour garantir une expérience d\'achat sûre et fiable.',
  },
  {
    icon: Users,
    title: 'Communauté',
    text: 'Nous construisons une communauté de confiance entre acheteurs et vendeurs.',
  },
  {
    icon: Award,
    title: 'Qualité',
    text: 'Une sélection rigoureuse de produits de qualité pour votre satisfaction maximale.',
  },
]

const PRODUCTS_PER_PAGE = 20

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

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

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSent(true)
    setContactForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setContactSent(false), 5000)
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main>
        {/* ---------- Bandeau d'accueil ---------- */}
        <section className="home-hero relative overflow-hidden text-primary-content">
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

        {/* ---------- Valeurs ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 text-center">
            <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Pourquoi nous choisir</span>
            <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Nos valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-base-content">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/60">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ---------- Produits ---------- */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
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

          {initialLoading && searchedProducts.length > 0 && (
            <section className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-primary-content md:p-12">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold md:text-3xl">Une question, une envie ?</h3>
                  <p className="mt-2 text-primary-content/80">
                    Notre équipe vous accompagne pour trouver exactement ce qu&apos;il vous faut.
                  </p>
                </div>
                <a href="#contact" className="btn btn-accent gap-2">
                  Nous contacter
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </section>
          )}
        </section>

        {/* ---------- À propos de nous ---------- */}
        <section id="a-propos" className="bg-base-200/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">À propos</span>
                <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                  BU-Market, votre marketplace de confiance
                </h2>
                <p className="mt-4 leading-7 text-base-content/75">
                  Fondée avec la mission de simplifier l&apos;accès aux produits de qualité,
                  BU-Market rassemble des vendeurs vérifiés et des acheteurs exigeants.
                  Notre plateforme vous offre une expérience d&apos;achat fluide,
                  sécurisée et agréable.
                </p>
                <p className="mt-4 leading-7 text-base-content/75">
                  Nous croyons que chaque utilisateur mérite de trouver des produits
                  qui correspondent à ses attentes, au prix juste. C&apos;est pourquoi
                  nous sélectionnons soigneusement chaque vendeur et chaque produit
                  référencé sur notre plateforme.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/inscription" className="btn btn-primary gap-2">
                    <Sparkles size={18} aria-hidden="true" />
                    Rejoignez-nous
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm">
                  <Globe size={32} className="mb-3 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold text-base-content">Livraison internationale</h3>
                  <p className="mt-1 text-sm text-base-content/60">Livraison dans plus de 50 pays à travers le monde.</p>
                </div>
                <div className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm">
                  <Users size={32} className="mb-3 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold text-base-content">10 000+ clients</h3>
                  <p className="mt-1 text-sm text-base-content/60">Des milliers d&apos;acheteurs satisfaits chaque mois.</p>
                </div>
                <div className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm">
                  <Award size={32} className="mb-3 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold text-base-content">Vendeurs certifiés</h3>
                  <p className="mt-1 text-sm text-base-content/60">Chaque vendeur passe une vérification rigoureuse.</p>
                </div>
                <div className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm">
                  <Star size={32} className="mb-3 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold text-base-content">Satisfaction garantie</h3>
                  <p className="mt-1 text-sm text-base-content/60">Toujours satisfait ou remboursé sous 30 jours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Témoignages ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mb-10 text-center">
            <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Témoignages</span>
            <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Ce que nos clients disent
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: 'Marie L.',
                role: 'Acheteuse régulière',
                text: 'J\'ai trouvé exactement ce que je cherchais. La qualité des produits est au rendez-vous et la livraison est toujours à l\'heure.',
                rating: 5,
              },
              {
                name: 'Thomas D.',
                role: 'Vendeur',
                text: 'BU-Market m\'a permis de développer mon activité. L\'interface est intuitive et le support est toujours disponible pour m\'aider.',
                rating: 5,
              },
              {
                name: 'Sophie B.',
                role: 'Cliente fidèle',
                text: 'Je suis impressionnée par la variété des produits et les prix compétitifs. C\'est ma plateforme de shopping préférée.',
                rating: 5,
              },
            ].map(({ name, role, text, rating }) => (
              <div
                key={name}
                className="flex flex-col gap-3 rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-1 flex text-amber-500" role="img" aria-label={`${rating} étoiles sur 5`}>
                  {Array.from({ length: rating }, (_, index) => (
                    <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-base-content/75">&quot;{text}&quot;</p>
                <div className="mt-auto pt-2">
                  <p className="font-semibold text-base-content">{name}</p>
                  <p className="text-xs text-base-content/50">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Bandeau CTA ---------- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" aria-hidden="true" />
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center text-primary-content sm:px-6 md:py-20">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Prêt à commencer vos achats ?
            </h2>
            <p className="max-w-xl text-lg text-primary-content/80">
              Rejoignez notre communauté et découvrez des milliers de produits
              de qualité à des prix imbattables.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/inscription" className="btn btn-accent gap-2">
                Créer un compte gratuitement
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href="#produits" className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20">
                Explorer les produits
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="bg-base-200/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">Contact</span>
                <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
                  Nous contacter
                </h2>
                <p className="mt-4 leading-7 text-base-content/75">
                  Une question, une suggestion ou un problème ? Notre équipe est là
                  pour vous aider. Nous vous répondrons dans les plus brefs délais.
                </p>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-base-content/75">
                    <Mail size={20} className="shrink-0 text-primary" aria-hidden="true" />
                    <span>support@bu-market.app</span>
                  </div>
                  <div className="flex items-center gap-3 text-base-content/75">
                    <Phone size={20} className="shrink-0 text-primary" aria-hidden="true" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center gap-3 text-base-content/75">
                    <MapPin size={20} className="shrink-0 text-primary" aria-hidden="true" />
                    <span>45 Rue du Commerce, 75001 Paris</span>
                  </div>
                  <div className="flex items-center gap-3 text-base-content/75">
                    <Clock size={20} className="shrink-0 text-primary" aria-hidden="true" />
                    <span>Lun – Ven : 9h – 18h</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm sm:p-8">
                {contactSent ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                      <Send size={32} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-base-content">Message envoyé !</h3>
                    <p className="text-sm text-base-content/60">
                      Nous vous contacterons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-4">
                      <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-base-content">
                        Nom complet
                      </label>
                      <InputText
                        id="contact-name"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-base-content">
                        Adresse e-mail
                      </label>
                      <InputText
                        id="contact-email"
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold text-base-content">
                        Sujet
                      </label>
                      <InputText
                        id="contact-subject"
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full"
                        placeholder="Objet de votre message"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold text-base-content">
                        Message
                      </label>
                      <Textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full resize-none"
                        placeholder="Votre message..."
                      />
                    </div>
                    <Button type="submit" className="mt-2 gap-2" color="primary">
                      <Send size={18} aria-hidden="true" />
                      Envoyer le message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Pied de page ---------- */}
      <Footer />
    </div>
  )
}
