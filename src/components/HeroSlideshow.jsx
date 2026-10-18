import { useEffect, useState } from 'react'

/**
 * Images de fond des bandeaux « hero ». Elles défilent en fondu croisé (avec un
 * très léger zoom « Ken Burns »). Pour changer les visuels, remplacez les
 * fichiers de `public/images/hero/` (mêmes noms) ou complétez ce tableau.
 */
const HERO_SLIDES = [
  { src: '/images/hero/hero-1.jpg', alt: 'Boutique de vêtements' },
  { src: '/images/hero/hero-2.jpg', alt: 'Cliente avec ses sacs shopping' },
  { src: '/images/hero/hero-3.jpg', alt: 'Paiement en caisse' },
  { src: '/images/hero/hero-4.jpg', alt: 'Sacs shopping' },
  { src: '/images/hero/hero-5.jpg', alt: 'Univers maison' },
  { src: '/images/hero/hero-6.jpg', alt: 'High-tech' },
]

const DEFAULT_INTERVAL = 6000

/**
 * Diaporama plein cadre à poser dans une section `relative overflow-hidden`.
 * Rend les images en fond (absolues) puis un voile dégradé pour que le texte
 * reste lisible par-dessus.
 *
 * @param {object}   props
 * @param {Array}    [props.slides]            Liste `{ src }` des images.
 * @param {number}   [props.interval]          Durée d'affichage d'une image (ms).
 * @param {string}   [props.overlayClassName]  Classes du voile (dégradé).
 */
export default function HeroSlideshow({
  slides = HERO_SLIDES,
  interval = DEFAULT_INTERVAL,
  overlayClassName = 'bg-gradient-to-r from-black/80 via-black/60 to-black/35',
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return undefined
    // Respecte la préférence « animations réduites » : on fige la première image.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      interval,
    )
    return () => clearInterval(id)
  }, [slides.length, interval])

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map(({ src }, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${
              index === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={src}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              className={`h-full w-full object-cover transition-transform duration-[9000ms] ease-out motion-reduce:transition-none ${
                index === active ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        ))}
      </div>
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden="true" />
    </>
  )
}
