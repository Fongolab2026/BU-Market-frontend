import { Star } from 'lucide-react'
import { useState } from 'react'
import { MAX_STARS, RATING_LABELS } from './reviewUtils.js'

/**
 * Note en étoiles.
 * - `value` seul : affichage (lecture seule) ;
 * - avec `onChange` : sélecteur interactif (boutons `radiogroup`).
 */
export default function StarRating({
  value = 0,
  onChange,
  size = 16,
  className = '',
  showLabel = false,
}) {
  const [hovered, setHovered] = useState(0)
  const interactive = typeof onChange === 'function'
  const displayed = hovered || Number(value) || 0

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? 'group' : 'img'}
      aria-label={
        interactive
          ? 'Attribuer une note'
          : `Note : ${displayed} sur ${MAX_STARS}`
      }
    >
      {Array.from({ length: MAX_STARS }, (_, index) => {
        const star = index + 1
        const filled = star <= displayed
        const starClass = filled
          ? 'fill-amber-400 text-amber-400'
          : 'text-base-content/25'

        if (!interactive) {
          return (
            <Star
              key={star}
              size={size}
              className={starClass}
              aria-hidden="true"
            />
          )
        }

        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onChange(star)}
            aria-label={`${star} étoile${star > 1 ? 's' : ''} — ${RATING_LABELS[star]}`}
            aria-pressed={Number(value) === star}
            className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            <Star size={size + 4} className={starClass} />
          </button>
        )
      })}

      {showLabel && displayed > 0 && (
        <span className="ml-1.5 text-xs font-semibold text-base-content/60">
          {displayed}/5 · {RATING_LABELS[displayed]}
        </span>
      )}
      {!showLabel && !interactive && displayed > 0 && (
        <span className="ml-1 text-xs font-semibold text-base-content/60">
          {displayed}/5
        </span>
      )}
    </span>
  )
}
