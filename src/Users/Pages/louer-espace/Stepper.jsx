import { Check } from 'lucide-react'
import { STEPS } from './constants.js'

/**
 * Barre de progression dégradée + étapes numérotées reliées par une ligne.
 */
export default function Stepper({ activeStep, completedSteps, onSelect }) {
  const progress = Math.round(((activeStep + 1) / STEPS.length) * 100)
  const stepperProgress = (activeStep / (STEPS.length - 1)) * 100

  return (
    <div className="px-5 pt-6 sm:px-8 sm:pt-7">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-200" aria-hidden="true">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary via-secondary to-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="relative mt-5 grid grid-cols-3" aria-label="Étapes de la demande">
        <div
          aria-hidden="true"
          className="absolute left-[16.6667%] right-[16.6667%] top-5 h-px -translate-y-1/2 bg-base-300"
        >
          <div
            className="h-full bg-primary/70 transition-[width] duration-500 ease-out"
            style={{ width: `${stepperProgress}%` }}
          />
        </div>

        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isActive = index === activeStep
          const reachable = index <= activeStep || isCompleted
          return (
            <li key={step.key} className="relative z-10 flex min-w-0 flex-col items-center px-1 text-center">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Étape ${index + 1} : ${step.label}`}
                className="group flex w-full flex-col items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-primary text-primary-content shadow-sm shadow-primary/30'
                      : isActive
                        ? 'bg-primary text-primary-content shadow-md shadow-primary/30 ring-4 ring-primary/15'
                        : 'border border-base-300 bg-base-200 text-base-content/45'
                  }`}
                >
                  {isCompleted ? <Check size={17} strokeWidth={3} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={`block min-w-0 truncate text-[13px] transition-colors sm:text-sm ${
                    isActive
                      ? 'font-bold text-primary'
                      : isCompleted
                        ? 'font-semibold text-base-content/70'
                        : 'font-medium text-base-content/45'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
