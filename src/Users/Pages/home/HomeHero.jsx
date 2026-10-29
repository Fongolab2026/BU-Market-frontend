import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Clock, ShoppingBag, Sparkles } from 'lucide-react'
import HeroSlideshow from '../../../components/HeroSlideshow.jsx'

export default function HomeHero({ pendingHeight, showPendingBanner, showSeller, hasOpenRequest }) {
  return (
    <section className="home-hero relative overflow-hidden text-primary-content">
      <HeroSlideshow />
      <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <div
        className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 pb-16 pt-16 transition-[padding] duration-300 ease-out motion-reduce:transition-none sm:px-6 md:pb-24 md:pt-24"
        style={showPendingBanner && pendingHeight ? { paddingTop: `${pendingHeight + 24}px` } : undefined}
      >
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur sm:text-sm">
          <Sparkles size={16} className="text-accent" aria-hidden="true" />
          Nouvelle collection disponible
        </span>

        <h1
          className="animate-fade-up max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          Trouvez le produit <span className="text-accent">parfait</span>, au prix juste.
        </h1>
        <p
          className="animate-fade-up max-w-xl text-base text-primary-content/80 sm:text-lg"
          style={{ animationDelay: '160ms' }}
        >
          Mode, maison, high-tech et plus encore — une sélection soignée de vendeurs de
          confiance, livrée chez vous en un éclair.
        </p>

        <div
          className="animate-fade-up flex flex-wrap gap-3"
          style={{ animationDelay: '240ms' }}
        >
          <a href="#produits" className="btn btn-accent gap-2">
            <ShoppingBag size={18} aria-hidden="true" />
            Découvrir nos produits
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href="#garanties" className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20">
            Nos garanties
          </a>
          {!showSeller && (
            hasOpenRequest ? (
              <span
                className="btn pointer-events-none gap-2 border border-white/30 bg-white/10 text-primary-content opacity-70"
                aria-disabled="true"
              >
                <Clock size={18} aria-hidden="true" />
                Demande en attente
              </span>
            ) : (
              <Link
                to="/louer-espace"
                className="btn gap-2 border border-white/30 bg-white/10 text-primary-content hover:bg-white/20"
              >
                <Building2 size={18} aria-hidden="true" />
                Louer l&apos;espace
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  )
}
