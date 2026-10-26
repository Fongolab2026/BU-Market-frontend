import { MapPin, Store, Tag } from 'lucide-react'

/** Récapitulatif affiché juste avant l'envoi de la demande. */
export default function Recap({ form, locationLabel }) {
  const items = [
    { label: 'Boutique', value: form.companyName || '—', icon: Store },
    { label: 'Industrie', value: form.industry || '—', icon: Tag },
    { label: 'Emplacement', value: locationLabel, icon: MapPin },
  ]

  return (
    <div className="mt-6 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Récapitulatif</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex min-w-0 items-start gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon size={15} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] font-medium text-base-content/45">{label}</dt>
              <dd className="truncate text-[13px] font-semibold text-base-content" title={value}>
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
