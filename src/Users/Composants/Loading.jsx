import { LoaderCircle, ShoppingBag } from 'lucide-react'

export default function Loading() {
  return (
    <div
      className="relative flex min-h-[18rem] w-full items-center justify-center overflow-hidden bg-base-100 px-6 py-12"
      role="status"
      aria-live="polite"
    >
      <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-12 h-56 w-56 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-5 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-xl shadow-primary/25">
          <ShoppingBag size={28} strokeWidth={1.8} aria-hidden="true" />
          <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-content shadow-md">
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="font-semibold text-base-content">Préparation de votre espace</p>
          <p className="mt-1 text-sm text-base-content/60">Nous récupérons les dernières informations.</p>
        </div>
      </div>
      <span className="sr-only">Chargement en cours...</span>
    </div>
  )
}
