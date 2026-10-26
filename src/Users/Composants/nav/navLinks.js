export const NAV_LINKS = [
  { label: 'Accueil', path: '/accueil' },
  { label: 'Produits', path: '/accueil#produits' },
  { label: 'À propos', path: '/accueil#a-propos' },
  { label: 'Contact', path: '/accueil#contact' },
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
