import { useState } from 'react'
import { apiPost, endpoints } from '../../../services/api.js'
import { extractApiError } from '../../../utils/apiError.js'

/** Formulaire de contact de l'accueil (réservé aux comptes connectés). */
export default function useContactForm(user) {
  const [contactForm, setContactForm] = useState({ subject: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const [contactSending, setContactSending] = useState(false)
  const [contactError, setContactError] = useState('')

  const updateContactField = (event) => {
    const { name, value } = event.target
    setContactForm((current) => ({ ...current, [name]: value }))
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    if (!user) {
      setContactError('Connectez-vous pour envoyer un message au support.')
      return
    }

    setContactSending(true)
    setContactError('')
    try {
      await apiPost(endpoints.messages.contact, {
        subject: contactForm.subject,
        message: contactForm.message,
      })
      setContactSent(true)
      setContactForm({ subject: '', message: '' })
      window.setTimeout(() => setContactSent(false), 5000)
    } catch (err) {
      const { general, fields } = extractApiError(err)
      setContactError(
        general ||
          fields.message ||
          fields.subject ||
          'Impossible d’envoyer le message. Veuillez réessayer plus tard.',
      )
    } finally {
      setContactSending(false)
    }
  }

  return {
    contactForm,
    updateContactField,
    contactSent,
    contactSending,
    contactError,
    handleContactSubmit,
  }
}
