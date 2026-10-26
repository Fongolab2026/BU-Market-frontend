import { ChevronLeft, Hand, Store, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import NavBar from '../Composants/nav'
import Stepper from './louer-espace/Stepper.jsx'
import StepIdentity from './louer-espace/StepIdentity.jsx'
import StepSocial from './louer-espace/StepSocial.jsx'
import StepLocation from './louer-espace/StepLocation.jsx'
import Recap from './louer-espace/Recap.jsx'
import FormFooter from './louer-espace/FormFooter.jsx'
import useSpaceForm from './louer-espace/useSpaceForm.js'
import { STEPS, TRUST_ITEMS } from './louer-espace/constants.js'

/**
 * Demande d'espace marchand.
 *
 * La page est présentée comme une boîte de dialogue centrée au-dessus d'un fond
 * doux. Toute la logique d'état vit dans `useSpaceForm` ; chaque étape et le
 * pied de page sont des composants dédiés.
 */
export default function LouerEspace() {
  const space = useSpaceForm()
  const { form, errors, feedback, sending, activeStep, isLastStep } = space

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="relative isolate overflow-hidden px-4 py-8 sm:px-6 sm:py-12">
        {/* Fond doux type « modale » : halos de la couleur du projet */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-base-100/40 to-base-100" />
        </div>

        <section
          ref={space.cardRef}
          aria-labelledby="louer-espace-title"
          className="mx-auto w-full max-w-3xl scroll-mt-24 overflow-hidden rounded-3xl border border-base-300/80 bg-(--surface) shadow-[0_24px_70px_-30px_rgba(36,31,43,0.35)]"
        >
          <header className="flex items-start justify-between gap-4 px-5 pt-6 sm:px-8 sm:pt-7">
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Store size={23} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h1 id="louer-espace-title" className="text-xl font-bold leading-tight sm:text-2xl">
                  Demande d’espace marchand
                </h1>
                <p className="mt-1 text-sm leading-6 text-base-content/55">
                  Renseignez les informations de votre boutique.
                </p>
              </div>
            </div>
            <Link
              to="/accueil"
              className="-mr-1 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-base-content/45 transition hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Fermer et revenir à l’accueil"
            >
              <X size={19} aria-hidden="true" />
            </Link>
          </header>

          <Stepper
            activeStep={activeStep}
            completedSteps={space.completedSteps}
            onSelect={space.goToStep}
          />

          <form
            onSubmit={space.handleSubmit}
            onTouchStart={space.handleTouchStart}
            onTouchEnd={space.handleTouchEnd}
            noValidate
          >
            <div className="px-5 pt-6 sm:px-8 sm:pt-7">
              {feedback && (
                <div
                  className={`mb-5 flex items-start gap-3 rounded-xl border-l-4 p-4 text-sm text-base-content ${
                    feedback.type === 'success' ? 'border-success bg-success/10' : 'border-error bg-error/10'
                  }`}
                  role="alert"
                >
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      feedback.type === 'success' ? 'bg-success' : 'bg-error'
                    }`}
                    aria-hidden="true"
                  />
                  <p>{feedback.message}</p>
                </div>
              )}

              <p className="mb-6 text-center text-[13px] leading-5 text-base-content/55">
                {STEPS[activeStep].description}
              </p>

              <div key={activeStep} className="animate-step-in">
                {activeStep === 0 && (
                  <StepIdentity
                    form={form}
                    errors={errors}
                    updateField={space.updateField}
                    sectionRef={(element) => { space.sectionRefs.current[0] = element }}
                  />
                )}

                {activeStep === 1 && (
                  <StepSocial
                    form={form}
                    errors={errors}
                    updateField={space.updateField}
                    sectionRef={(element) => { space.sectionRefs.current[1] = element }}
                  />
                )}

                {activeStep === 2 && (
                  <StepLocation
                    form={form}
                    errors={errors}
                    neighborhoodKey={space.neighborhoodKey}
                    updateField={space.updateField}
                    onProvinceChange={space.handleProvinceChange}
                    onCommuneChange={space.handleCommuneChange}
                    onNeighborhoodChange={space.handleNeighborhoodChange}
                    sectionRef={(element) => { space.sectionRefs.current[2] = element }}
                  />
                )}
              </div>

              {isLastStep && <Recap form={form} locationLabel={space.locationLabel} />}

              <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-base-content/40 sm:hidden">
                <ChevronLeft size={13} aria-hidden="true" />
                <Hand size={13} aria-hidden="true" />
                Glissez pour naviguer entre les étapes
              </p>
            </div>

            <FormFooter
              activeStep={activeStep}
              isLastStep={isLastStep}
              sending={sending}
              onPrev={space.goPrev}
              onNext={space.goNext}
            />
          </form>
        </section>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-base-content/45 sm:text-xs"
            >
              <Icon size={14} className="text-primary/70" aria-hidden="true" /> {label}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-xl text-center text-[11px] leading-5 text-base-content/35">
          Vos informations restent confidentielles et servent uniquement à l’examen de votre demande.
        </p>
      </main>
    </div>
  )
}
