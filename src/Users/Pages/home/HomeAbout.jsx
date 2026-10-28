import { ArrowRight, Award, Globe, Mail, ShoppingBag, Star, Users } from 'lucide-react'
import Reveal from '../../../components/Reveal.jsx'

const HIGHLIGHTS = [
  { icon: Globe, title: 'Livraison internationale', text: 'Livraison dans plus de 50 pays à travers le monde.' },
  { icon: Users, title: '10 000+ clients', text: 'Des milliers d’acheteurs satisfaits chaque mois.' },
  { icon: Award, title: 'Vendeurs certifiés', text: 'Chaque vendeur passe une vérification rigoureuse.' },
  { icon: Star, title: 'Satisfaction garantie', text: 'Toujours satisfait ou remboursé sous 30 jours.' },
]

export default function HomeAbout() {
  return (
    <Reveal as="section" id="a-propos" className="scroll-mt-24 bg-base-200/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="left">
            <span className="badge badge-accent badge-sm mb-3 uppercase tracking-widest">À propos</span>
            <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              BU-Market, votre marketplace de confiance
            </h2>
            <p className="mt-4 leading-7 text-base-content/75">
              Fondée avec la mission de simplifier l’accès aux produits de qualité,
              BU-Market rassemble des vendeurs vérifiés et des acheteurs exigeants.
              Notre plateforme vous offre une expérience d’achat fluide,
              sécurisée et agréable.
            </p>
            <p className="mt-4 leading-7 text-base-content/75">
              Nous croyons que chaque utilisateur mérite de trouver des produits
              qui correspondent à ses attentes, au prix juste. C’est pourquoi
              nous sélectionnons soigneusement chaque vendeur et chaque produit
              référencé sur notre plateforme.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#produits" className="btn btn-primary gap-2">
                <ShoppingBag size={18} aria-hidden="true" />
                Explorer le catalogue
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="btn gap-2 border border-base-300 bg-[var(--surface)] text-base-content hover:bg-base-200"
              >
                <Mail size={18} aria-hidden="true" />
                Nous contacter
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }, index) => (
              <Reveal
                key={title}
                variant="right"
                delay={index * 80}
                className="rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm"
              >
                <Icon size={32} className="mb-3 text-primary" aria-hidden="true" />
                <h3 className="font-semibold text-base-content">{title}</h3>
                <p className="mt-1 text-sm text-base-content/60">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}
