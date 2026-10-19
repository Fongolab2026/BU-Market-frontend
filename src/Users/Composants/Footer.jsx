import { Heart, Mail, Store } from 'lucide-react'
import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../../services/api'

// Sections présentes sur les pages d'accueil (publique et client).
const SECTIONS = [
  { id: 'produits', label: 'Produits' },
  { id: 'garanties', label: 'Nos garanties' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'contact', label: 'Contact' },
]

export default function Footer() {
  const navigate = useNavigate()

  /**
   * Rejoint une section de la page d'accueil : défilement direct si la section
   * est présente sur la page courante (accueil), sinon navigation vers
   * l'accueil puis défilement.
   */
  const goToSection = useCallback(
    (id) => {
      const scrollToSection = () => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (document.getElementById(id)) {
        scrollToSection()
        return
      }

      navigate(isAuthenticated() ? '/accueil' : '/')
      window.setTimeout(scrollToSection, 150)
    },
    [navigate],
  )

  return (
    <footer className="mt-auto border-t border-base-300/70 bg-base-200/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="border-base-300/70 bg-transparent shadow-none">
          <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-base-content" aria-label="BU-Market">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-content">
              <Store size={19} aria-hidden="true" />
            </span>
            BU-<span className="text-primary">Market</span>
          </span>
          <p className="mt-3 max-w-sm text-sm leading-6 text-base-content/60">
            Une marketplace pensée pour trouver des produits fiables au prix juste.
          </p>
        </div>

        <div className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Navigation</h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-base-content/65">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => goToSection(id)}
                className="text-left transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}
            <Link to="/connexion" className="transition-colors hover:text-primary">Connexion</Link>
          </nav>
        </div>

        <div className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Boutique</h2>
          <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-base-content/65">
            <button type="button" onClick={() => goToSection('produits')} className="text-left transition-colors hover:text-primary">
              Tous les produits
            </button>
            <Link to="/inscription" className="transition-colors hover:text-primary">Devenir vendeur</Link>
            <Link to="/inscription" className="transition-colors hover:text-primary">Créer un compte</Link>
            <button type="button" onClick={() => goToSection('a-propos')} className="text-left transition-colors hover:text-primary">
              Notre histoire
            </button>
          </nav>
        </div>

        <div className="border-base-300/70 bg-transparent shadow-none">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content">Besoin d'aide ?</h2>
          <p className="mt-3 flex items-center gap-2 text-sm text-base-content/65">
            <Mail size={16} className="text-primary" aria-hidden="true" />
            support@bu-market.app
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-base-content/65">
            <Heart size={16} className="text-primary" aria-hidden="true" />
            Conçu pour votre quotidien
          </p>
        </div>
      </div>
      <div className="border-t border-base-300/70 px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-7xl text-xs text-base-content/50">
          © {new Date().getFullYear()} BU-Market. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
