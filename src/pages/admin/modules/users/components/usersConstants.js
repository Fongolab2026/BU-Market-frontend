import { ShieldCheck, ShoppingBag, Store } from 'lucide-react'

export const ROLE_META = {
  admin: {
    label: 'Gestionnaire',
    icon: ShieldCheck,
    className: 'bg-violet-50 text-violet-700 ring-violet-600/10',
  },
  merchant: {
    label: 'Commerçant',
    icon: Store,
    className: 'bg-orange-50 text-orange-700 ring-orange-600/10',
  },
  buyer: {
    label: 'Client',
    icon: ShoppingBag,
    className: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  },
}

export const SUPER_ADMIN_META = {
  label: 'Super admin',
  icon: ShieldCheck,
  className: 'bg-brand/10 text-brand ring-brand/15',
}

export const SHOP_STATUS_LABEL = {
  validated: 'Boutique validée',
  pending: 'Boutique en attente',
  suspended: 'Boutique suspendue',
}

export const emptyForm = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  role: 'buyer',
  password: '',
}

export const ALLOWED_ROLES = new Set(Object.keys(ROLE_META))

/** Normalise les erreurs Django (champs ou message global) pour le formulaire. */
export const parseApiErrors = (error) => {
  const data = error?.response?.data
  if (!data) return { fieldErrors: {}, message: 'Impossible de contacter le serveur.' }
  if (typeof data === 'string') {
    const text = data.trim()
    // Une page d'erreur HTML (500 Django) ne doit jamais etre affichee telle
    // quelle dans un toast : on renvoie un message court et lisible.
    if (text.startsWith('<')) {
      return {
        fieldErrors: {},
        message: 'Le serveur a rencontré une erreur. Réessayez ou contactez l’administrateur.',
      }
    }
    return { fieldErrors: {}, message: text }
  }
  if (Array.isArray(data)) return { fieldErrors: {}, message: data.join(' ') }

  const fieldErrors = {}
  let message = data.detail || ''
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'detail' || key === 'non_field_errors') {
      const text = Array.isArray(value) ? value.join(' ') : String(value)
      message = message || text
      return
    }
    fieldErrors[key] = Array.isArray(value) ? value.join(' ') : String(value)
    if (!message) message = fieldErrors[key]
  })

  return { fieldErrors, message: message || 'Une erreur est survenue.' }
}
