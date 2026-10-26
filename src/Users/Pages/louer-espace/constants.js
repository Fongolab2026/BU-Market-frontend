import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'

export const industries = [
  'Alimentation et boissons',
  'Artisanat',
  'Beauté et soins',
  'Électronique et high-tech',
  'Maison et décoration',
  'Mode et accessoires',
  'Services',
  'Autre',
]

export const initialForm = {
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

export const STEPS = [
  { key: 'company', label: 'Identité', description: 'Identité et coordonnées de votre boutique.' },
  { key: 'social', label: 'Informations', description: 'Vos liens publics sur les réseaux sociaux (facultatif).' },
  { key: 'location', label: 'Emplacement', description: 'Où se trouve votre boutique.' },
]

export const TRUST_ITEMS = [
  { icon: CheckCircle2, label: '3 étapes rapides' },
  { icon: ShieldCheck, label: 'Vendeurs vérifiés' },
  { icon: Clock3, label: 'Réponse sous 48h' },
]

export const ERROR_STEP_FIELDS = [
  ['companyName', 'company_name', 'ownerName', 'owner_name', 'industry', 'phone', 'whatsapp', 'email', 'slogan'],
  ['facebook', 'instagram', 'tiktok', 'website'],
  ['province', 'commune', 'neighborhood', 'otherNeighborhood', 'other_neighborhood'],
]
