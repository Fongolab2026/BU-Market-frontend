import { useEffect, useRef, useState } from 'react'

/**
 * Révèle son contenu lorsqu'il entre dans le viewport.
 *
 * - `variant` : "up" (défaut), "down", "left", "right" ou "zoom".
 * - `delay`   : décalage en millisecondes (utile pour les listes en cascade).
 * - `as`      : balise HTML à rendre (section, article, li, ...).
 *
 * L'animation est purement visuelle : le contenu reste lisible si
 * IntersectionObserver est indisponible ou si l'utilisateur préfère réduire
 * les animations (voir les styles dans `src/index.css`).
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-reveal-visible={visible ? 'true' : 'false'}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}
