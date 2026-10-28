import Reveal from '../../../components/Reveal.jsx'
import { TRUST_POINTS } from './homeData.js'

export default function HomeTrustStrip() {
  return (
    <Reveal as="section" id="garanties" className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 -mt-8 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, title, text }, index) => (
          <Reveal
            key={title}
            delay={index * 70}
            className="flex items-center gap-3 rounded-box border border-base-300/70 bg-[var(--surface)] p-4 shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              {/* Sur mobile la carte fait 2 colonnes : on autorise le retour
                  à la ligne plutôt que la troncature « Livraison… ». */}
              <p className="line-clamp-2 font-semibold leading-snug text-base-content">{title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-base-content/60">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
