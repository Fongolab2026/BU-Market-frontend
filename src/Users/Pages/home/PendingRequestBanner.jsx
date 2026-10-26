import { useEffect, useRef, useState } from 'react'
import { Clock, X } from 'lucide-react'

/**
 * Bandeau fixe affiché tant que la demande de location est en attente.
 * Il se masque automatiquement après 3 s et prévient le parent de sa hauteur
 * pour que le hero ne soit jamais recouvert.
 */
export default function PendingRequestBanner({ status, onHeightChange }) {
  const [dismissed, setDismissed] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const nodeRef = useRef(null)

  const show = status === 'pending' && !dismissed
  const render = show || leaving

  useEffect(() => {
    if (!show || leaving) return undefined
    const timer = window.setTimeout(() => setLeaving(true), 3000)
    return () => window.clearTimeout(timer)
  }, [show, leaving])

  useEffect(() => {
    if (!leaving) return undefined
    const timer = window.setTimeout(() => {
      setDismissed(true)
      setLeaving(false)
    }, 320)
    return () => window.clearTimeout(timer)
  }, [leaving])

  useEffect(() => {
    const node = nodeRef.current
    if (!render || !node) {
      onHeightChange(0)
      return undefined
    }
    const updateHeight = () => onHeightChange(node.offsetHeight)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    return () => observer.disconnect()
  }, [render, onHeightChange])

  if (!render) return null

  return (
    <section
      className={`pointer-events-none fixed inset-x-0 top-[4.5rem] z-40 px-4 transition-all duration-300 ease-out motion-reduce:transition-none sm:px-6 ${
        leaving ? '-translate-y-2 scale-[0.98] opacity-0' : 'translate-y-0 scale-100 opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Demande de location en attente de confirmation"
    >
      <div
        ref={nodeRef}
        className={`mx-auto flex max-w-7xl items-start gap-3 rounded-2xl border border-accent/40 bg-base-100/95 p-4 shadow-lg shadow-base-content/10 backdrop-blur-xl sm:items-center ${
          leaving ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/20 text-accent">
          <Clock size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-base-content">
            Demande de location en attente de confirmation
          </p>
          <p className="mt-1 text-sm leading-6 text-base-content/65">
            Merci ! Notre équipe examine les informations de votre boutique sous 48h
            ouvrées. Votre espace marchand s&apos;activera automatiquement dès la validation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setLeaving(true)}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
          aria-label="Masquer cette information"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
