import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../../../components/Reveal.jsx'

export default function HomeCta() {
  return (
    <Reveal as="section" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center text-base-content sm:px-6 md:py-20">
        <Reveal variant="zoom" className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Prêt à commencer vos achats ?
          </h2>
          <p className="max-w-xl text-lg text-base-content">
            Rejoignez notre communauté et découvrez des milliers de produits
            de qualité à des prix imbattables.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/inscription" className="btn btn-accent gap-2">
              Créer un compte gratuitement
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#produits" className="btn gap-2 border border-base-300 bg-[var(--surface)] text-base-content hover:bg-base-200">
              Explorer les produits
            </a>
          </div>
        </Reveal>
      </div>
    </Reveal>
  )
}
