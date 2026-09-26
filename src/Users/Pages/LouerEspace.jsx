import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Building2, CheckCircle2, Globe2, Loader2, MapPin, Store, XCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../Composants/nav'
import api, { endpoints } from '../../services/api'

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

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder, error, children }) {
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
          aria-invalid={error ? 'true' : undefined}
          className={`input input-bordered w-full bg-base-100 ${error ? 'input-error' : ''}`}
        />
      )}
      {error && <p className="text-xs text-error">{[].concat(error).join(' ')}</p>}
    </div>
  )
}

export default function LouerEspace() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState(null)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const sectionRefs = useRef([])
  const communes = form.province ? locations[form.province].communes : []
  const neighborhoodOptions = neighborhoods[form.commune] || ['Centre-ville', 'Autre']
  const steps = ['Boutique', 'Réseaux sociaux', 'Emplacement']
  const progress = Math.round((completedSteps.length / steps.length) * 100)

  useEffect(() => {
    if (activeStep > 0) {
      sectionRefs.current[activeStep]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeStep])

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (sending) return

    const currentFields = sectionRefs.current[activeStep]?.querySelectorAll('input, select, textarea') || []
    const invalidField = Array.from(currentFields).find((field) => !field.checkValidity())
    if (invalidField) {
      invalidField.reportValidity()
      return
    }

    if (activeStep < steps.length - 1) {
      setCompletedSteps((current) => current.includes(activeStep) ? current : [...current, activeStep])
      setActiveStep((current) => current + 1)
      setFeedback(null)
      setErrors({})
      return
    }

    setCompletedSteps((current) => current.includes(activeStep) ? current : [...current, activeStep])
    setSending(true)
    setFeedback(null)
    setErrors({})
    try {
      await api.post(endpoints.boutiques.create, form)
      const message = 'Votre demande de location est en attente de confirmation. Veuillez patienter pendant son examen.'
      toast.success(message)
      navigate('/confirmation-location', { replace: true })
    } catch (err) {
      const payload = err.response?.data
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        setErrors(payload)
        const errorKeys = Object.keys(payload)
        const stepFields = [
          ['companyName', 'company_name', 'ownerName', 'owner_name', 'industry', 'phone', 'whatsapp', 'email', 'slogan'],
          ['facebook', 'instagram', 'tiktok', 'website'],
          ['province', 'commune', 'neighborhood', 'otherNeighborhood'],
        ]
        const invalidStep = stepFields.findIndex((fields) => errorKeys.some((key) => fields.includes(key)))
        if (invalidStep >= 0) {
          setActiveStep(invalidStep)
          invalidateStepsFrom(invalidStep)
        }
        setFeedback({
          type: 'error',
          message: 'Certains champs sont invalides. Vérifiez le formulaire.',
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Envoi impossible. Vérifiez votre connexion et réessayez.',
        })
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/65 transition hover:text-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil
        </Link>

        <header className="mb-8 flex flex-col justify-between gap-6 border-b border-base-300 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Store size={17} aria-hidden="true" /> Espace partenaire
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-base-content sm:text-4xl">Louer un espace sur BU-Market</h1>
          <p className="mt-3 max-w-2xl leading-7 text-base-content/65">
            Présentez votre entreprise, vos réseaux et son emplacement. Les champs marqués d’un astérisque sont requis.
          </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-base-content/55">Demande partenaire <span className="ml-1 rounded bg-accent/20 px-2 py-1 text-base-content">3 sections</span></p>
        </header>

        <div className="mb-8" aria-label="Progression du formulaire">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-base-content">Étape {Math.min(activeStep + 1, steps.length)} sur {steps.length} : {steps[activeStep]}</span>
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
            {steps.map((step, index) => (
              <li key={step}>
                <button
                  type="button"
                  disabled={index > activeStep && !completedSteps.includes(index)}
                  onClick={() => {
                    setActiveStep(index)
                    setFeedback(null)
                  }}
                  aria-current={index === activeStep ? 'step' : undefined}
                  className={`flex w-full min-w-0 items-center gap-2 border-b-2 pb-3 text-left text-xs font-semibold transition sm:gap-3 sm:text-sm ${
                    index <= activeStep || completedSteps.includes(index) ? 'border-primary text-primary' : 'border-base-300 text-base-content/45'
                  } disabled:cursor-not-allowed`}
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    completedSteps.includes(index) ? 'bg-success text-white' : index === activeStep ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/50'
                  }`}>
                    {completedSteps.includes(index) ? <CheckCircle2 size={15} aria-hidden="true" /> : index + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {feedback && (
          <div
            className={`mb-7 flex items-start gap-3 border-l-4 p-4 text-sm text-base-content ${
              feedback.type === 'success' ? 'border-success bg-success/10' : 'border-error bg-error/10'
            }`}
            role="status"
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <XCircle size={20} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
            )}
            <p>{feedback.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {activeStep === 0 && <section ref={(element) => { sectionRefs.current[0] = element }} aria-labelledby="company-heading" className="scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-base-content"><Building2 size={20} aria-hidden="true" /></span>
              <div>
                <h2 id="company-heading" className="text-xl font-bold">Informations de la boutique</h2>
                <p className="mt-1 text-sm text-base-content/55">Identité et coordonnées de votre entreprise</p>
              </div>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Nom de l’entreprise" name="companyName" value={form.companyName} error={errors.companyName} onChange={updateField} required placeholder="Ex. Atelier du Burundi" />
              <Field label="Nom du propriétaire" name="ownerName" value={form.ownerName} error={errors.ownerName} onChange={updateField} required placeholder="Nom complet" />
              <Field label="Industrie" name="industry" error={errors.industry} required>
                <select id="industry" name="industry" value={form.industry} onChange={updateField} required className="select select-bordered w-full bg-base-100">
                  <option value="" disabled>Sélectionner une industrie</option>
                  {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                </select>
              </Field>
              <Field label="Adresse e-mail" name="email" value={form.email} error={errors.email} onChange={updateField} type="email" required placeholder="nom@entreprise.com" />
              <Field label="Téléphone" name="phone" value={form.phone} error={errors.phone} onChange={updateField} type="tel" required placeholder="+257 ..." />
              <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} error={errors.whatsapp} onChange={updateField} type="tel" placeholder="+257 ..." />
              <div className="sm:col-span-2">
                <Field label="Slogan du magasin" name="slogan" value={form.slogan} error={errors.slogan} onChange={updateField} placeholder="Une courte phrase pour présenter votre boutique" />
              </div>
            </div>
          </section>}

          {activeStep === 1 && <section ref={(element) => { sectionRefs.current[1] = element }} aria-labelledby="social-heading" className="scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-base-content"><Globe2 size={20} aria-hidden="true" /></span>
              <div>
                <h2 id="social-heading" className="text-xl font-bold">Réseaux sociaux</h2>
                <p className="mt-1 text-sm text-base-content/55">Ajoutez les liens publics de votre marque (facultatif)</p>
              </div>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Lien Facebook" name="facebook" value={form.facebook} error={errors.facebook} onChange={updateField} type="url" placeholder="https://facebook.com/..." />
              <Field label="Lien Instagram" name="instagram" value={form.instagram} error={errors.instagram} onChange={updateField} type="url" placeholder="https://instagram.com/..." />
              <Field label="Lien TikTok" name="tiktok" value={form.tiktok} error={errors.tiktok} onChange={updateField} type="url" placeholder="https://tiktok.com/@..." />
              <Field label="Site web" name="website" value={form.website} error={errors.website} onChange={updateField} type="url" placeholder="https://..." />
            </div>
          </section>}

          {activeStep === 2 && <section ref={(element) => { sectionRefs.current[2] = element }} aria-labelledby="location-heading" className="scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-base-content"><MapPin size={20} aria-hidden="true" /></span>
              <div>
                <h2 id="location-heading" className="text-xl font-bold">Emplacement de l’entreprise</h2>
                <p className="mt-1 text-sm text-base-content/55">Choisissez une province, puis précisez la commune et le quartier</p>
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
          </section>}

          <div className="flex flex-col-reverse gap-3 rounded-lg border border-base-300 bg-base-200/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs leading-5 text-base-content/55">Votre demande est transmise à notre équipe partenaire.</p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Link to="/" className="btn btn-ghost">Annuler</Link>
              {activeStep > 0 && (
                <button type="button" onClick={() => { setActiveStep((current) => current - 1); setFeedback(null) }} className="btn btn-ghost">
                  Retour
                </button>
              )}
              <button type="submit" disabled={sending} className="btn btn-primary px-7">
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Envoi…
                  </>
                ) : (
                  activeStep < steps.length - 1 ? 'Valider et continuer' : 'Envoyer ma demande'
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}