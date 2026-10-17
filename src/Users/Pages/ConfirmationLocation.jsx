import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clock3, Loader2, Rocket, ShieldCheck, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSpaceRequest } from '../../hooks/useSpaceRequest.js'

const RULES = [
  { icon: ShieldCheck, text: 'Notre équipe vérifie les informations de votre boutique.' },
  { icon: Clock3, text: 'Comptez une réponse sous 48h ouvrées.' },
  { icon: Rocket, text: 'Dès la validation, votre espace marchand s’active automatiquement.' },
]

export default function ConfirmationLocation() {
  const { user } = useAuth()
  // Revérifie régulièrement le statut : dès qu'il passe à « validated »,
  // le hook global bascule automatiquement vers /marchand/tableau-de-bord.
  const { status } = useSpaceRequest(user, { pollMs: 5000 })
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => setDots((value) => (value.length >= 3 ? '' : `${value}.`)), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/accueil" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/65 transition hover:text-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil
        </Link>

        <section className="animate-fade-up mx-auto w-full max-w-3xl rounded-3xl border border-base-300 bg-(--surface) p-6 shadow-sm sm:p-10" aria-labelledby="confirmation-title">
          <div className="mb-7 grid size-16 place-items-center rounded-full bg-success/10 text-success">
            <Check size={32} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-success">
            <Store size={15} aria-hidden="true" /> Demande transmise
          </p>
          <h1 id="confirmation-title" className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Votre demande de location est en attente de confirmation.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/70">
            Notre équipe va examiner les informations de votre boutique. Merci de patienter ; vous serez contacté dès que votre demande aura été étudiée.
          </p>

          <div className="mt-9 flex items-start gap-4 rounded-2xl border-l-4 border-accent bg-accent/10 p-5" role="status" aria-live="polite">
            {status === 'validated' ? (
              <Check className="mt-0.5 shrink-0 text-success" size={22} aria-hidden="true" />
            ) : (
              <Loader2 size={22} className="mt-0.5 shrink-0 animate-spin text-base-content/70" aria-hidden="true" />
            )}
            <div>
              <h2 className="font-bold">
                {status === 'validated'
                  ? 'Boutique validée ! Activation de votre espace marchand…'
                  : `Vérification automatique en cours${dots}`}
              </h2>
              <p className="mt-1 text-sm leading-6 text-base-content/65">
                {status === 'validated'
                  ? 'Redirection automatique vers votre tableau de bord vendeur.'
                  : 'Aucune action supplémentaire n’est nécessaire : cette page se met à jour automatiquement dès la validation.'}
              </p>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {RULES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-base-content/70">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/accueil" className="btn btn-primary gap-2">
              Retourner à l’accueil
            </Link>
            <Link to="/" className="btn btn-ghost gap-2">
              Continuer à explorer
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
