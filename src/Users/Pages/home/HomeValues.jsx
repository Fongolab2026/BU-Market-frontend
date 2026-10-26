import Reveal from '../../../components/Reveal.jsx'
import { VALUES } from './homeData.js'

export default function HomeValues() {
  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <Reveal className="mb-10 text-center">
        <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Pourquoi nous choisir</span>
        <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
          Nos valeurs
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, text }, index) => (
          <Reveal
            key={title}
            delay={index * 80}
            className="flex flex-col items-center gap-3 rounded-2xl border border-base-300/70 bg-[var(--surface)] p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={24} aria-hidden="true" />
            </span>
            <h3 className="font-semibold text-base-content">{title}</h3>
            <p className="text-sm leading-relaxed text-base-content/60">{text}</p>
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
