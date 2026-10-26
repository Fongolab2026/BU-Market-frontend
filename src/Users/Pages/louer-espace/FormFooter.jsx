import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, Loader2, Send } from 'lucide-react'
import { STEPS } from './constants.js'

export default function FormFooter({ activeStep, isLastStep, sending, onPrev, onNext }) {
  return (
    <footer className="mt-6 border-t border-base-200 px-5 py-5 sm:px-8">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <div className="order-3 flex items-center gap-1 sm:order-1">
          <Link
            to="/accueil"
            className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-base-content/55 transition hover:bg-base-200 hover:text-base-content"
          >
            Annuler
          </Link>
          {activeStep > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-base-content/55 transition hover:bg-base-200 hover:text-base-content"
            >
              <ChevronLeft size={16} aria-hidden="true" /> Retour
            </button>
          )}
        </div>

        <p className="order-1 text-center text-[11px] font-medium text-base-content/40 sm:order-2 sm:text-xs">
          Progression du formulaire · {activeStep + 1}/{STEPS.length}
        </p>

        <div className="order-2 flex sm:order-3 sm:justify-end">
          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-bold text-primary-content shadow-lg shadow-primary/25 transition hover:bg-secondary hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px sm:w-auto sm:min-w-36"
            >
              Suivant <ArrowRight size={17} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-bold text-primary-content shadow-lg shadow-primary/25 transition hover:bg-secondary hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? (
                <>
                  <Loader2 size={17} className="animate-spin" aria-hidden="true" /> Envoi…
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" /> Envoyer ma demande
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}
