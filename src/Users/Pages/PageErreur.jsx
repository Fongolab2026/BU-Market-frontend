import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, Home } from 'lucide-react'

export default function PageErreur() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100 px-6 py-12 text-base-content">
      <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <section className="relative w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
          <Compass size={38} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Erreur 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Cette page a disparu</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-base-content/65">
          L&apos;adresse demandée n&apos;existe pas ou n&apos;est plus disponible. Revenez à l&apos;accueil pour continuer vos achats.
        </p>
        <Link to="/" className="btn btn-primary mt-8 gap-2 px-6">
          <Home size={18} aria-hidden="true" />
          Retour à l&apos;accueil
          <ArrowLeft size={17} className="rotate-180" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
