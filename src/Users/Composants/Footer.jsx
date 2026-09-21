import { Heart, Mail, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from 'primereact/card'

export default function Footer() {
  return (
    <footer className="border-t border-base-300/70 bg-base-200/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Card className="border-base-300/70 bg-transparent shadow-none">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-base-content">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-content">
              <Store size={19} aria-hidden="true" />
            </span>
            BU-<span className="text-primary">Market</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-base-content/60">
            Une marketplace pensée pour trouver des produits fiables au prix juste.
          </p>
        </Card>

        <Card className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Navigation</h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-base-content/65">
            <a href="#produits" className="transition-colors hover:text-primary">Produits</a>
            <a href="#garanties" className="transition-colors hover:text-primary">Nos garanties</a>
            <a href="#a-propos" className="transition-colors hover:text-primary">À propos</a>
            <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
            <Link to="/connexion" className="transition-colors hover:text-primary">Connexion</Link>
          </nav>
        </Card>

        <Card className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Boutique</h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-base-content/65">
            <a href="#produits" className="transition-colors hover:text-primary">Tous les produits</a>
            <Link to="/inscription" className="transition-colors hover:text-primary">Devenir vendeur</Link>
            <Link to="/inscription" className="transition-colors hover:text-primary">Créer un compte</Link>
            <a href="#a-propos" className="transition-colors hover:text-primary">Notre histoire</a>
          </nav>
        </Card>

        <Card className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Besoin d'aide ?</h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-base-content/65">
            <Mail size={16} className="text-primary" aria-hidden="true" />
            support@bu-market.app
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-base-content/65">
            <Heart size={16} className="text-primary" aria-hidden="true" />
            Conçu pour votre quotidien
          </p>
        </Card>
      </div>
      <div className="border-t border-base-300/70 px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-7xl text-xs text-base-content/50">
          © {new Date().getFullYear()} BU-Market. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
