import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CreditCard,
  Headphones,
  Package,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Truck,
  Users,
  Zap,
} from 'lucide-react'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import CardProducts from '../products/ui/cardProduct'
import { productApi } from '../../services'

const STATS = [
  { value: '10 000+', label: 'Clients satisfaits', icon: Users },
  { value: '2 500+', label: 'Vendeurs certifiés', icon: Store },
  { value: '24h', label: 'Livraison express', icon: Truck },
  { value: '98%', label: 'Avis positifs', icon: Star },
]

const FEATURES = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    text: 'Expédition sous 24h et suivi en temps réel, où que vous soyez au Burundi.',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement sécurisé',
    text: 'Transactions chiffrées et protection acheteur sur chaque commande.',
  },
  {
    icon: RotateCcwIcon,
    title: 'Retours faciles',
    text: 'Satisfait ou remboursimple : retour gratuit sous 30 jours.',
  },
  {
    icon: Headphones,
    title: 'Support 7j/7',
    text: 'Une équipe à votre écoute pour vous accompagner à chaque étape.',
  },
]

const STEPS = [
  {
    icon: ShoppingBag,
    step: '01',
    title: 'Parcourez le catalogue',
    text: 'Explorez des milliers de produits de qualité auprès de vendeurs vérifiés.',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'Commandez en un clic',
    text: 'Paiement simple et sécurisé, livraison suivie jusqu’à chez vous.',
  },
  {
    icon: Package,
    step: '03',
    title: 'Recevez et profitez',
    text: 'Suivez votre colis en temps réel et recevez-le en un éclair.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Marie L.',
    role: 'Acheteuse régulière',
    text: 'J\'ai trouvé exactement ce que je cherchais. La qualité est au rendez-vous et la livraison toujours à l\'heure.',
    rating: 5,
  },
  {
    name: 'Thomas D.',
    role: 'Vendeur partenaire',
    text: 'BU-Market m\'a permis de développer mon activité. L\'interface est intuitive et le support toujours disponible.',
    rating: 5,
  },
  {
    name: 'Sophie B.',
    role: 'Cliente fidèle',
    text: 'La variété des produits et les prix compétitifs en font ma plateforme de shopping préférée.',
    rating: 5,
  },
]

const FAQ = [
  {
    question: 'Comment créer un compte ?',
    answer: 'Cliquez sur « Inscription », remplissez le formulaire avec vos informations et validez. Votre compte est actif immédiatement.',
  },
  {
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons les paiements mobiles (Mobile Money, Airtel Money) et les cartes bancaires, tous sécurisés.',
  },
  {
    question: 'Comment devenir vendeur ?',
    answer: 'Créez un compte, soumettez votre demande d\'espace boutique et notre équipe la valide sous 48h après vérification.',
  },
  {
    question: 'Que faire en cas de problème avec une commande ?',
    answer: 'Contactez notre support 7j/7 via la page Contact : nous vous répondons dans les plus brefs délais et gérons le litige.',
  },
]

function RotateCcwIcon({ size = 24, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

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

export default function Landing() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productApi
      .list()
      .then((response) => {
        const items = response.data.results ?? response.data
        setFeatured(Array.isArray(items) ? items.slice(0, 8) : [])
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar variant="landing" />

      <main>
        {/* ---------- Hero ---------- */}
        <section className="home-hero relative overflow-hidden">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:gap-8 sm:px-6 sm:py-20 md:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Sparkles size={16} className="text-accent" aria-hidden="true" />
              La marketplace n°1 au Burundi
            </span>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                Achetez et vendez
                <span className="text-accent"> en toute confiance</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-content/80 md:text-xl">
                BU-Market rassemble des vendeurs vérifiés et des acheteurs exigeants.
                Mode, maison, high-tech et plus encore, livrés chez vous en un éclair.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link to="/inscription" className="btn btn-accent gap-2 text-base w-full justify-center sm:w-auto">
                <ShoppingBag size={18} aria-hidden="true" />
                Créer un compte gratuitement
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/connexion"
                className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20 w-full justify-center sm:w-auto"
              >
                Se connecter
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-sm text-primary-content/80">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} aria-hidden="true" /> Paiement sécurisé
              </span>
              <span className="flex items-center gap-2">
                <Truck size={16} aria-hidden="true" /> Livraison sous 24h
              </span>
              <span className="flex items-center gap-2">
                <Headphones size={16} aria-hidden="true" /> Support 7j/7
              </span>
            </div>
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <section className="border-b border-base-300/70 bg-base-200/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:gap-6 sm:px-6 sm:py-12 lg:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 sm:gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:size-12">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-base-content sm:text-2xl">{value}</p>
                  <p className="text-xs text-base-content/60 sm:text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Fonctionnalités ---------- */}
        <section id="fonctionnalites" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">Fonctionnalités</span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Tout ce qu'il vous faut pour acheter et vendre
            </h2>
            <p className="mt-4 text-base-content/65">
              Une plateforme pensée pour simplifier vos achats et booster vos ventes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="mb-4 grid size-12 place-items-center rounded-xl bg-accent/20 text-base-content transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-base-content/65">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Comment ça marche ---------- */}
        <section className="bg-base-200/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">Simple et rapide</span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Comment ça marche ?
              </h2>
              <p className="mt-4 text-base-content/65">
                Trois étapes suffisent pour passer votre première commande.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, step, title, text }) => (
                <div
                  key={step}
                  className="relative rounded-2xl border border-base-300/70 bg-[var(--surface)] p-7 shadow-sm"
                >
                  <span className="absolute -top-4 left-6 grid size-9 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-content shadow-md shadow-primary/25">
                    {step}
                  </span>
                  <span className="mb-4 mt-2 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-base-content/65">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link to="/inscription" className="btn btn-primary gap-2 px-8 text-base">
                Commencer maintenant
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Produits publiés ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Catalogue</span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Produits publiés</h2>
              <p className="mt-2 text-base-content/60">
                Les dernières publications de nos vendeurs certifiés.
              </p>
            </div>
            <Link to="/connexion" className="text-sm font-semibold text-primary transition hover:underline">
              Tout voir →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Chargement des produits">
              {Array.from({ length: 8 }, (_, index) => (
                <CarteSquelette key={index} delay={index * 70} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-base-content/60">Aucun produit publié pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product) => (
                <CardProducts key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ---------- Témoignages ---------- */}
        <section className="bg-base-200/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">Témoignages</span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Ils nous font confiance
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map(({ name, role, text, rating }) => (
                <figure
                  key={name}
                  className="flex flex-col gap-4 rounded-2xl border border-base-300/70 bg-[var(--surface)] p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <Quote size={28} className="text-accent" aria-hidden="true" />
                  <div className="flex text-amber-500" role="img" aria-label={`${rating} étoiles sur 5`}>
                    {Array.from({ length: rating }, (_, index) => (
                      <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed text-base-content/75">« {text} »</blockquote>
                  <figcaption className="mt-auto border-t border-base-300/60 pt-4">
                    <p className="font-bold">{name}</p>
                    <p className="text-xs text-base-content/50">{role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-xl border border-base-300/70 bg-[var(--surface)] p-5 shadow-sm open:border-primary/30 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                  {question}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-base-content/65">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="home-hero relative overflow-hidden rounded-3xl px-6 py-16 text-center text-primary-content shadow-xl md:px-16 md:py-20">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <Zap size={28} className="text-accent" aria-hidden="true" />
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Prêt à rejoindre BU-Market ?
              </h2>
              <p className="text-lg text-primary-content/80">
                Créez votre compte gratuitement en quelques minutes et commencez
                à acheter ou vendre dès aujourd'hui.
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                <Link to="/inscription" className="btn btn-accent gap-2 text-base w-full justify-center sm:w-auto">
                  Créer un compte
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  to="/connexion"
                  className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20 w-full justify-center sm:w-auto"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}