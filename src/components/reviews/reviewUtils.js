/** Aide-mémoire partagé par les composants d'avis (produit et boutique). */

export const MAX_STARS = 5

export const RATING_LABELS = {
  1: 'Très insatisfait',
  2: 'Insatisfait',
  3: 'Correct',
  4: 'Satisfait',
  5: 'Excellent',
}

export const formatReviewDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const now = Date.now()
  const diff = Math.round((now - date.getTime()) / 86400000)
  if (diff <= 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7) return `Il y a ${diff} jours`
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

export const initialsOf = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export const averageOf = (reviews = []) => {
  if (!reviews.length) return 0
  const total = reviews.reduce((sum, review) => sum + Number(review.note || 0), 0)
  return Math.round((total / reviews.length) * 10) / 10
}

/** Répartition des notes : `[{ stars: 5, count: 2, ratio: 0.66 }, …]` */
export const distributionOf = (reviews = []) =>
  [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => Number(review.note) === stars).length
    return {
      stars,
      count,
      ratio: reviews.length ? count / reviews.length : 0,
    }
  })

/** Message d'erreur DRF quel que soit le champ fautive. */
export const reviewErrorMessage = (error, fallback) =>
  error?.response?.data?.detail ||
  error?.response?.data?.non_field_errors?.[0] ||
  Object.values(error?.response?.data || {})
    .flat()
    .map((value) => (typeof value === 'string' ? value : value?.[0]))
    .filter(Boolean)[0] ||
  fallback
