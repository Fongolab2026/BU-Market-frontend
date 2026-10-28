import { Home, Info, Mail, ShoppingBag } from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Accueil', path: '/accueil', icon: Home },
  { label: 'Produits', path: '/accueil#produits', icon: ShoppingBag },
  { label: 'À propos', path: '/accueil#a-propos', icon: Info },
  { label: 'Contact', path: '/accueil#contact', icon: Mail },
]

/** Indique si un lien de navigation correspond à la route courante. */
export function isNavLinkActive(pathname, hash, path) {
  const [base, section] = path.split('#')
  if (section) {
    return (
      (pathname === base && hash === `#${section}`) ||
      (section === 'produits' && pathname.startsWith('/produit/'))
    )
  }
  return pathname === base && !hash
}
