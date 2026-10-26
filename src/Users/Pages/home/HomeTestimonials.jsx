import { Star } from 'lucide-react'
import Reveal from '../../../components/Reveal.jsx'
import { TESTIMONIALS } from './homeData.js'

export default function HomeTestimonials() {
  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <Reveal className="mb-10 text-center">
        <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Témoignages</span>
        <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
          Ce que nos clients disent
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map(({ name, role, text, rating }, index) => (
          <Reveal
            key={name}
            delay={index * 90}
            className="flex flex-col gap-3 rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-1 flex text-amber-500" role="img" aria-label={`${rating} étoiles sur 5`}>
              {Array.from({ length: rating }, (_, starIndex) => (
                <Star key={starIndex} size={16} fill="currentColor" aria-hidden="true" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-base-content/75">&quot;{text}&quot;</p>
            <div className="mt-auto pt-2">
              <p className="font-semibold text-base-content">{name}</p>
              <p className="text-xs text-base-content/50">{role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
