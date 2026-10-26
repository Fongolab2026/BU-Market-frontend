import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { endpoints } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext.jsx'
import { getPhoneError } from '../../../utils/phone.js'
import { ERROR_STEP_FIELDS, STEPS, initialForm } from './constants.js'

/**
 * Toute la logique du formulaire de location d'espace : état, validation,
 * navigation entre les étapes, glissement tactile et envoi à l'API.
 */
export default function useSpaceForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [feedback, setFeedback] = useState(null)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [neighborhoodKey, setNeighborhoodKey] = useState('')
  const sectionRefs = useRef([])
  const cardRef = useRef(null)
  const swipe = useRef({ x: 0, y: 0, tracking: false })

  const locationLabel = [
    form.province,
    form.commune,
    form.neighborhood === 'Autre' ? form.otherNeighborhood : form.neighborhood,
  ].filter(Boolean).join(' · ') || '—'

  const isLastStep = activeStep === STEPS.length - 1

  useEffect(() => {
    if (!user) return
    const ownerName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || ''
    setForm((current) => ({ ...current, ownerName }))
  }, [user])

  useEffect(() => {
    if (activeStep > 0) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    setForm((current) => ({
      ...current,
      province: event.target.value,
      commune: '',
      neighborhood: '',
      otherNeighborhood: '',
    }))
    setNeighborhoodKey('')
    setFeedback(null)
    invalidateStepsFrom(activeStep)
  }

  const handleCommuneChange = (event) => {
    setForm((current) => ({
      ...current,
      commune: event.target.value,
      neighborhood: '',
      otherNeighborhood: '',
    }))
    setNeighborhoodKey('')
    setFeedback(null)
    invalidateStepsFrom(activeStep)
  }

  /**
   * La valeur de l'option combine la zone et le quartier pour distinguer les
   * homonymes d'une même commune. Seul le nom du quartier est enregistré.
   */
  const handleNeighborhoodChange = (event) => {
    const key = event.target.value
    const separator = key.indexOf('::')
    const neighborhood = separator >= 0 ? key.slice(separator + 2) : key
    setNeighborhoodKey(key)
    setForm((current) => ({ ...current, neighborhood, otherNeighborhood: '' }))
    setFeedback(null)
    setErrors((current) => ({ ...current, neighborhood: undefined, otherNeighborhood: undefined }))
    invalidateStepsFrom(activeStep)
  }

  /** Valide les champs natifs d'une étape (formulaire en noValidate). */
  const validateStep = (index) => {
    const phoneFields = [
      { key: 'phone', required: true },
      { key: 'whatsapp', required: false },
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

  const goToStep = (index) => {
    setActiveStep(index)
    setFeedback(null)
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
      const { data } = await api.post(endpoints.boutiques.create, form)
      window.dispatchEvent(new Event('bu-market:space-request-updated'))
      toast.success(data?.status === 'validated'
        ? 'Votre espace marchand est activé 🎉'
        : 'Votre demande de location est en attente de confirmation.')
      // La demande reste « pending » : `useSellerUpgrade` basculera vers
      // l'espace marchand dès la validation par l'admin.
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

  return {
    form,
    feedback,
    errors,
    sending,
    activeStep,
    completedSteps,
    neighborhoodKey,
    locationLabel,
    isLastStep,
    sectionRefs,
    cardRef,
    updateField,
    handleProvinceChange,
    handleCommuneChange,
    handleNeighborhoodChange,
    goToStep,
    goNext,
    goPrev,
    handleTouchStart,
    handleTouchEnd,
    handleSubmit,
  }
}
