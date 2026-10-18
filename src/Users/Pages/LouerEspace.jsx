import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  Hand,
  Loader2,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../Composants/nav'
import api, { endpoints } from '../../services/api'
import { useAuth } from '../../context/AuthContext.jsx'
import PhoneInput from '../../components/PhoneInput.jsx'
import { getPhoneError } from '../../utils/phone.js'

const industries = [
  'Alimentation et boissons',
  'Artisanat',
  'Beauté et soins',
  'Électronique et high-tech',
  'Maison et décoration',
  'Mode et accessoires',
  'Services',
  'Autre',
]

const locations = {
  Bujumbura: {
    communes: ['Bujumbura', 'Isare', 'Kabezi', 'Kanyosha', 'Mubimbi', 'Mutambu', 'Mutimbuzi', 'Nyabiraba'],
  },
  Buhumuza: {
    communes: ['Cankuzo', 'Cendajuru', 'Gisagara', 'Giteranyi', 'Muyinga', 'Ruyigi'],
  },
  Burunga: {
    communes: ['Bururi', 'Makamba', 'Matana', 'Nyanza-Lac', 'Rutana'],
  },
  Butanyerera: {
    communes: ['Busoni', 'Gashikanwa', 'Kayanza', 'Kiremba', 'Kirundo', 'Ngozi'],
  },
  Gitega: {
    communes: ['Bugendana', 'Gitega', 'Giheta', 'Itaba', 'Makebuko', 'Mutaho', 'Ryansoro'],
  },
}

const neighborhoods = {
  Bujumbura: ['Bwiza', 'Buyenzi', 'Kamenge', 'Kinama', 'Kinindo', 'Ngagara', 'Nyakabiga', 'Rohero', 'Autre'],
  Gitega: ['Centre-ville', 'Gihetangwe', 'Magarama', 'Yoba', 'Autre'],
  Ngozi: ['Centre-ville', 'Kinyami', 'Muremera', 'Rubuye', 'Autre'],
  Muyinga: ['Centre-ville', 'Cibitoke', 'Gasave', 'Kigoganya', 'Autre'],
}

const initialForm = {
  companyName: '',
  ownerName: '',
  industry: '',
  phone: '',
  whatsapp: '',
  email: '',
  slogan: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  website: '',
  province: '',
  commune: '',
  neighborhood: '',
  otherNeighborhood: '',
}

const STEPS = [
  { key: 'company', label: 'Boutique', hint: 'Identité et coordonnées', icon: Building2 },
  { key: 'social', label: 'Réseaux sociaux', hint: 'Vos liens publics (facultatif)', icon: Globe2 },
  { key: 'location', label: 'Emplacement', hint: 'Où se trouve votre boutique', icon: MapPin },
]

const ERROR_STEP_FIELDS = [
  ['companyName', 'company_name', 'ownerName', 'owner_name', 'industry', 'phone', 'whatsapp', 'email', 'slogan'],
  ['facebook', 'instagram', 'tiktok', 'website'],
  ['province', 'commune', 'neighborhood', 'otherNeighborhood', 'other_neighborhood'],
]

const BENEFITS = [
  { icon: TrendingUp, title: 'Plus de visibilité', text: 'Votre boutique exposée à tous les acheteurs de la plateforme.' },
  { icon: Store, title: 'Espace marchand', text: 'Gérez produits, commandes et messages en un seul endroit.' },
  { icon: ShieldCheck, title: 'Validation sous 48h', text: 'Notre équipe vérifie votre demande puis active votre espace.' },
  { icon: Users, title: 'Communauté de confiance', text: 'Rejoignez des vendeurs vérifiés et des clients fidèles.' },
]

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder, error, readOnly = false, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-base-content">
        {label}{required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
      </label>
      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          aria-readonly={readOnly ? 'true' : undefined}
          aria-invalid={error ? 'true' : undefined}
          className={`input input-bordered w-full bg-base-100 ${error ? 'input-error' : ''} ${readOnly ? 'cursor-not-allowed opacity-70' : ''}`}
        />
      )}
      {error && <p className="text-xs text-error">{[].concat(error).join(' ')}</p>}
    </div>
  )
}

export default function LouerEspace() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState(null)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const sectionRefs = useRef([])
  const swipe = useRef({ x: 0, y: 0, tracking: false })

  const communes = form.province ? (locations[form.province]?.communes ?? []) : []
  const neighborhoodOptions = neighborhoods[form.commune] || ['Centre-ville', 'Autre']
  const progress = Math.round((completedSteps.length / STEPS.length) * 100)
  const isLastStep = activeStep === STEPS.length - 1

  useEffect(() => {
    if (!user) return
    const ownerName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || ''
    setForm((current) => ({ ...current, ownerName }))
  }, [user])

  useEffect(() => {
    if (activeStep > 0) {
      sectionRefs.current[activeStep]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])

  const recap = useMemo(
    () => [
      { label: 'Boutique', value: form.companyName || '—', icon: Building2 },
      { label: 'Industrie', value: form.industry || '—', icon: Sparkles },
      { label: 'Emplacement', value: form.province ? `${form.province}${form.commune ? ` · ${form.commune}` : ''}` : '—', icon: MapPin },
    ],
    [form.companyName, form.industry, form.province, form.commune],
  )

  const invalidateStepsFrom = (step) => {
    setCompletedSteps((current) => current.filter((completedStep) => completedStep < step))
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFeedback(null)
    setErrors((current) => ({ ...current, [name]: undefined }))
    invalidateStepsFrom(activeStep)
  }

  const handleProvinceChange = (event) => {
    setForm((current) => ({ ...current, province: event.target.value, commune: '', neighborhood: '', otherNeighborhood: '' }))
    setFeedback(null)
    invalidateStepsFrom(activeStep)
  }

  const handleCommuneChange = (event) => {
    setForm((current) => ({ ...current, commune: event.target.value, neighborhood: '', otherNeighborhood: '' }))
    setFeedback(null)
    invalidateStepsFrom(activeStep)
  }

  /** Valide les champs natifs d'une étape (formulaire en noValidate). */
  const validateStep = (index) => {
    // Validation stricte des numéros de téléphone.
    const phoneFields = [
      { key: 'phone', required: true, label: 'Le numéro de téléphone' },
      { key: 'whatsapp', required: false, label: 'Le numéro WhatsApp' },
    ]
    const phoneErrors = {}
    let firstInvalidPhone = null
    for (const field of phoneFields) {
      const value = (form[field.key] || '').trim()
      if (!value) continue
      const error = getPhoneError(value, 'bi')
      if (error) {
        phoneErrors[field.key] = error
        firstInvalidPhone = firstInvalidPhone || field.key
      }
    }
    if (firstInvalidPhone) {
      setErrors(phoneErrors)
      document.getElementById(firstInvalidPhone)?.focus({ preventScroll: false })
      return false
    }

    const fields = sectionRefs.current[index]?.querySelectorAll('input, select, textarea') || []
    const invalid = Array.from(fields).find((field) => !field.checkValidity())
    if (invalid) {
      invalid.reportValidity()
      invalid.focus({ preventScroll: true })
      return false
    }
    setErrors(phoneErrors)
    return true
  }

  const completeStep = (index) => {
    setCompletedSteps((current) => (current.includes(index) ? current : [...current, index]))
  }

  const goNext = () => {
    if (!validateStep(activeStep) || isLastStep) return
    completeStep(activeStep)
    setActiveStep((current) => current + 1)
    setFeedback(null)
    setErrors({})
  }

  const goPrev = () => {
    if (activeStep === 0) return
    setActiveStep((current) => current - 1)
    setFeedback(null)
  }

  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    swipe.current = { x: touch.clientX, y: touch.clientY, tracking: true }
  }

  const handleTouchEnd = (event) => {
    if (!swipe.current.tracking) return
    swipe.current.tracking = false
    const touch = event.changedTouches[0]
    const dx = touch.clientX - swipe.current.x
    const dy = touch.clientY - swipe.current.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx < 0) goNext()
    else goPrev()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (sending) return
    if (!validateStep(activeStep)) return

    completeStep(activeStep)

    if (!isLastStep) {
      setActiveStep((current) => current + 1)
      setFeedback(null)
      setErrors({})
      return
    }

    setSending(true)
    setFeedback(null)
    setErrors({})
    try {
      await api.post(endpoints.boutiques.create, form)
      toast.success('Votre demande de location est en attente de confirmation.')
      // Retour à l'accueil client : la demande reste « pending » et le hook
      // global `useSellerUpgrade` basculera vers l'espace marchand dès la
      // validation par l'admin.
      navigate('/accueil', { replace: true })
    } catch (err) {
      const payload = err.response?.data
      const isFieldErrors = payload && typeof payload === 'object' && !Array.isArray(payload) && !payload.detail
      if (isFieldErrors) {
        setErrors(payload)
        const errorKeys = Object.keys(payload)
        const invalidStep = ERROR_STEP_FIELDS.findIndex((fields) => errorKeys.some((key) => fields.includes(key)))
        if (invalidStep >= 0) {
          setActiveStep(invalidStep)
          invalidateStepsFrom(invalidStep)
        }
        setFeedback({ type: 'error', message: 'Certains champs sont invalides. Vérifiez le formulaire.' })
      } else {
        setFeedback({
          type: 'error',
          message: typeof payload?.detail === 'string'
            ? payload.detail
            : 'Envoi impossible. Vérifiez votre connexion et réessayez.',
        })
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/accueil" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-base-content/65 transition hover:text-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil
        </Link>

        {/* Bandeau */}
        <header className="home-hero relative mb-8 overflow-hidden rounded-3xl px-6 py-10 shadow-xl sm:px-10 sm:py-12">
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <Sparkles size={16} className="text-accent" aria-hidden="true" /> Espace partenaire
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
              Louez votre espace et vendez sur BU-Market
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-content/80">
              Présentez votre boutique en 3 étapes. Notre équipe vérifie votre demande et active votre espace marchand sous 48h.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-primary-content/85">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <CheckCircle2 size={15} className="text-accent" aria-hidden="true" /> 3 étapes rapides
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <ShieldCheck size={15} className="text-accent" aria-hidden="true" /> Vendeurs vérifiés
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <Clock3 size={15} className="text-accent" aria-hidden="true" /> Réponse sous 48h
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Colonne formulaire */}
          <div>
            {/* Progression */}
            <div className="mb-6 rounded-2xl border border-base-300 bg-(--surface) p-4 shadow-sm sm:p-5" aria-label="Progression du formulaire">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-base-content">
                  Étape {activeStep + 1} sur {STEPS.length} : {STEPS[activeStep].label}
                </span>
                <span className="shrink-0 font-bold text-primary">{progress}%</span>
              </div>
              <div
                className="mb-5 h-2 overflow-hidden rounded-full bg-base-200"
                role="progressbar"
                aria-label="Progression du formulaire"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
              </div>
              <ol className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="Étapes du formulaire">
                {STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const reachable = index <= activeStep || completedSteps.includes(index)
                  return (
                    <li key={step.key}>
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => { setActiveStep(index); setFeedback(null) }}
                        aria-current={index === activeStep ? 'step' : undefined}
                        className={`flex w-full min-w-0 items-center gap-2 border-b-2 pb-3 text-left text-xs font-semibold transition sm:gap-3 sm:text-sm ${
                          reachable ? 'border-primary text-primary' : 'border-base-300 text-base-content/45'
                        } disabled:cursor-not-allowed`}
                      >
                        <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                          completedSteps.includes(index) ? 'bg-success text-white' : index === activeStep ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/50'
                        }`}>
                          {completedSteps.includes(index) ? <CheckCircle2 size={16} aria-hidden="true" /> : <StepIcon size={15} aria-hidden="true" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate">{step.label}</span>
                          <span className="hidden truncate text-[11px] font-normal text-base-content/45 sm:block">{step.hint}</span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {feedback && (
              <div
                className={`mb-5 flex items-start gap-3 rounded-xl border-l-4 p-4 text-sm text-base-content ${
                  feedback.type === 'success' ? 'border-success bg-success/10' : 'border-error bg-error/10'
                }`}
                role="alert"
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                ) : (
                  <XCircle size={20} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
                )}
                <p>{feedback.message}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              noValidate
              className="space-y-5"
            >
              <div key={activeStep} className="animate-step-in">
                {activeStep === 0 && (
                  <section ref={(element) => { sectionRefs.current[0] = element }} aria-labelledby="company-heading" className="scroll-mt-24 rounded-2xl border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 size={22} aria-hidden="true" /></span>
                      <div>
                        <h2 id="company-heading" className="text-xl font-bold">Informations de la boutique</h2>
                        <p className="mt-0.5 text-sm text-base-content/55">Identité et coordonnées de votre entreprise</p>
                      </div>
                    </div>
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                      <Field label="Nom de l’entreprise" name="companyName" value={form.companyName} error={errors.companyName} onChange={updateField} required placeholder="Ex. Atelier du Burundi" />
                      <Field label="Nom du propriétaire" name="ownerName" value={form.ownerName} error={errors.ownerName} onChange={updateField} required readOnly placeholder="Nom du compte connecté" />
                      <Field label="Industrie" name="industry" error={errors.industry} required>
                        <select id="industry" name="industry" value={form.industry} onChange={updateField} required className="select select-bordered w-full bg-base-100">
                          <option value="" disabled>Sélectionner une industrie</option>
                          {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                        </select>
                      </Field>
                      <Field label="Adresse e-mail" name="email" value={form.email} error={errors.email} onChange={updateField} type="email" required placeholder="nom@entreprise.com" />
                      <Field label="Téléphone" name="phone" required><PhoneInput id="phone" name="phone" required value={form.phone} error={errors.phone || undefined} onChange={(value) => updateField({ target: { name: "phone", value } })} /></Field>
                      <Field label="WhatsApp" name="whatsapp"><PhoneInput id="whatsapp" name="whatsapp" value={form.whatsapp} error={errors.whatsapp || undefined} onChange={(value) => updateField({ target: { name: "whatsapp", value } })} /></Field>
                      <div className="sm:col-span-2">
                        <Field label="Slogan du magasin" name="slogan" value={form.slogan} error={errors.slogan} onChange={updateField} placeholder="Une courte phrase pour présenter votre boutique" />
                      </div>
                    </div>
                  </section>
                )}

                {activeStep === 1 && (
                  <section ref={(element) => { sectionRefs.current[1] = element }} aria-labelledby="social-heading" className="scroll-mt-24 rounded-2xl border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Globe2 size={22} aria-hidden="true" /></span>
                      <div>
                        <h2 id="social-heading" className="text-xl font-bold">Réseaux sociaux</h2>
                        <p className="mt-0.5 text-sm text-base-content/55">Ajoutez les liens publics de votre marque (facultatif)</p>
                      </div>
                    </div>
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                      <Field label="Lien Facebook" name="facebook" value={form.facebook} error={errors.facebook} onChange={updateField} type="url" placeholder="https://facebook.com/..." />
                      <Field label="Lien Instagram" name="instagram" value={form.instagram} error={errors.instagram} onChange={updateField} type="url" placeholder="https://instagram.com/..." />
                      <Field label="Lien TikTok" name="tiktok" value={form.tiktok} error={errors.tiktok} onChange={updateField} type="url" placeholder="https://tiktok.com/@..." />
                      <Field label="Site web" name="website" value={form.website} error={errors.website} onChange={updateField} type="url" placeholder="https://..." />
                    </div>
                  </section>
                )}

                {activeStep === 2 && (
                  <section ref={(element) => { sectionRefs.current[2] = element }} aria-labelledby="location-heading" className="scroll-mt-24 rounded-2xl border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin size={22} aria-hidden="true" /></span>
                      <div>
                        <h2 id="location-heading" className="text-xl font-bold">Emplacement de l’entreprise</h2>
                        <p className="mt-0.5 text-sm text-base-content/55">Choisissez une province, puis précisez la commune et le quartier</p>
                      </div>
                    </div>
                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                      <Field label="Province" name="province" error={errors.province} required>
                        <select id="province" name="province" value={form.province} onChange={handleProvinceChange} required className="select select-bordered w-full bg-base-100">
                          <option value="" disabled>Sélectionner une province</option>
                          {Object.keys(locations).map((province) => <option key={province} value={province}>{province}</option>)}
                        </select>
                      </Field>
                      <Field label="Commune" name="commune" error={errors.commune} required>
                        <select id="commune" name="commune" value={form.commune} onChange={handleCommuneChange} required disabled={!form.province} className="select select-bordered w-full bg-base-100 disabled:opacity-50">
                          <option value="" disabled>{form.province ? 'Sélectionner une commune' : 'Choisir d’abord une province'}</option>
                          {communes.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
                        </select>
                      </Field>
                      <Field label="Quartier" name="neighborhood" error={errors.neighborhood} required>
                        <select id="neighborhood" name="neighborhood" value={form.neighborhood} onChange={updateField} required disabled={!form.commune} className="select select-bordered w-full bg-base-100 disabled:opacity-50">
                          <option value="" disabled>{form.commune ? 'Sélectionner un quartier' : 'Choisir d’abord une commune'}</option>
                          {neighborhoodOptions.map((neighborhood) => <option key={neighborhood} value={neighborhood}>{neighborhood}</option>)}
                        </select>
                      </Field>
                      {form.neighborhood === 'Autre' && (
                        <Field label="Précisez le quartier" name="otherNeighborhood" value={form.otherNeighborhood} error={errors.otherNeighborhood} onChange={updateField} required placeholder="Nom du quartier" />
                      )}
                    </div>
                  </section>
                )}
              </div>

              <p className="flex items-center justify-center gap-2 text-xs text-base-content/45 sm:hidden">
                <ChevronLeft size={14} aria-hidden="true" />
                <Hand size={14} aria-hidden="true" />
                Glissez pour naviguer entre les étapes
                <ChevronRight size={14} aria-hidden="true" />
              </p>

              <div className="flex flex-col-reverse gap-3 rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs leading-5 text-base-content/55">Votre demande est transmise à notre équipe partenaire.</p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Link to="/accueil" className="btn btn-ghost">Annuler</Link>
                  {activeStep > 0 && (
                    <button type="button" onClick={goPrev} className="btn btn-ghost">
                      <ChevronLeft size={16} aria-hidden="true" /> Retour
                    </button>
                  )}
                  {!isLastStep ? (
                    <button type="button" onClick={goNext} className="btn btn-primary px-7">
                      Continuer <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="submit" disabled={sending} className="btn btn-primary px-7">
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Envoi…
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
            </form>
          </div>

          {/* Colonne latérale */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-base-300 bg-(--surface) p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60">Ce que vous obtenez</h2>
              <ul className="mt-4 space-y-4">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon size={18} aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-base-content">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-base-content/55">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-base-300 bg-(--surface) p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60">Récapitulatif</h2>
              <ul className="mt-4 space-y-3">
                {recap.map(({ label, value, icon: Icon }) => (
                  <li key={label} className="flex items-center justify-between gap-3 border-b border-base-200 pb-3 last:border-0 last:pb-0">
                    <span className="flex items-center gap-2 text-xs font-medium text-base-content/55">
                      <Icon size={14} aria-hidden="true" /> {label}
                    </span>
                    <span className="max-w-[60%] truncate text-right text-sm font-semibold text-base-content">{value}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-base-content">
                <Sparkles size={16} className="text-accent" aria-hidden="true" /> Le saviez-vous ?
              </p>
              <p className="mt-2 text-xs leading-5 text-base-content/70">
                Une fois votre demande validée, votre boutique apparaît dans le catalogue public et vous accédez à votre espace marchand complet.
              </p>
              <Link to="/accueil#boutiques-title" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Voir les boutiques existantes <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
