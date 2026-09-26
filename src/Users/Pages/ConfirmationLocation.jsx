import { ArrowLeft, Check, Clock3, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'

export default function ConfirmationLocation() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/65 transition hover:text-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil
        </Link>

        <section className="mx-auto w-full max-w-3xl border-y border-base-300 py-10 sm:py-14" aria-labelledby="confirmation-title">
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
            Notre équipe va examiner les informations de votre boutique. Merci de patienter; vous serez contacté dès que votre demande aura été étudiée.
          </p>

          <div className="mt-9 flex items-start gap-4 border-l-4 border-accent bg-accent/10 p-5" role="status">
            <Clock3 size={22} className="mt-0.5 shrink-0 text-base-content/75" aria-hidden="true" />
            <div>
              <h2 className="font-bold">Aucune action supplémentaire n’est nécessaire</h2>
              <p className="mt-1 text-sm leading-6 text-base-content/65">
                Patientez pendant la vérification. L’accès à l’espace marchand sera disponible après confirmation.
              </p>
            </div>
          </div>

          <Link to="/" className="btn btn-primary mt-8 gap-2">
            Retourner à l’accueil
          </Link>
        </section>
      </main>
    </div>
  )
}