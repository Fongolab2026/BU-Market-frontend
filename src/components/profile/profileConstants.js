import { KeyRound, Shield, UserRound } from 'lucide-react'

export const ROLE_LABELS = {
  merchant: 'Vendeur',
  admin: 'Administrateur',
  client: 'Acheteur',
}

export const TABS = [
  { id: 'infos', label: 'Informations', icon: UserRound },
  { id: 'securite', label: 'Sécurité', icon: Shield },
  { id: 'session', label: 'Session', icon: KeyRound },
]

export const formFromUser = (source) => ({
  firstName: source?.firstName ?? source?.first_name ?? '',
  // Le backend ne stocke pas de nom de famille séparé : le champ « Nom »
  // affiche donc le nom d'utilisateur actuel du compte (lecture seule).
  username: source?.username ?? '',
  phone: source?.phone ?? source?.phone_number ?? '',
  adresse: source?.adresse ?? source?.address ?? source?.location ?? '',
  email: source?.email ?? '',
})
