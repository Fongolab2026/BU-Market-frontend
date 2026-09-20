import { ShoppingBag } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-gradient-to-b from-[#481965] via-[#5a2383] to-[#2c0b3e]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur">
          <ShoppingBag className="h-10 w-10 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            BU-Market
          </h1>
          <p className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white/50">
            Marketplace
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-white"></span>
        <p className="animate-pulse text-sm font-semibold uppercase tracking-widest text-white/60">
          Chargement...
        </p>
      </div>
    </div>
  )
}