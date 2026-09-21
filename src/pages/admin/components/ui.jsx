import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

const statusStyles = { active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', pending: 'bg-amber-50 text-amber-700 ring-amber-600/10', suspended: 'bg-rose-50 text-rose-700 ring-rose-600/10', hidden: 'bg-base-200 text-base-content/60 ring-base-300', validated: 'bg-brand/10 text-brand ring-brand/15', visible: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', inactive: 'bg-base-200 text-base-content/60 ring-base-300', approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', rejected: 'bg-rose-50 text-rose-700 ring-rose-600/10', confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/10', shipped: 'bg-violet-50 text-violet-700 ring-violet-600/10', completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/10' }
const statusLabels = { active: 'Actif', pending: 'En attente', suspended: 'Suspendu', hidden: 'Masqué', validated: 'Validé', visible: 'Visible', inactive: 'Inactive', approved: 'Approuvé', rejected: 'Rejeté', confirmed: 'Confirmée', shipped: 'Expédiée', completed: 'Livrée', cancelled: 'Annulée' }

export function StatusBadge({ status, label }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusStyles[status] || statusStyles.hidden}`}>{label || statusLabels[status] || status}</span> }

export function PageHeader({ eyebrow, title, description, action }) {
  return <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="text-xs font-semibold tracking-wide text-accent">{eyebrow}</p>}<h1 className={`${eyebrow ? 'mt-1' : ''} text-2xl font-bold tracking-tight text-base-content`}>{title}</h1>{description && <p className="mt-1 text-sm leading-5 text-base-content/60">{description}</p>}</div>{action}</div>
}

export function StatCard({ label, value, change, trend = 'up', icon: Icon, tone = 'brand' }) {
  const tones = { brand: 'bg-brand/10 text-brand', violet: 'bg-violet-50 text-violet-700', emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' }
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight
  return <article className="card p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-base-content/60">{label}</p><span className={`grid size-9 place-items-center ${tones[tone]}`}><Icon size={18} /></span></div><p className="mt-3 text-2xl font-bold tracking-tight text-base-content">{value}</p><p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}><TrendIcon size={14} /> {change} <span className="font-normal text-base-content/45">vs. mois dernier</span></p></article>
}

function getPageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const wanted = [...new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1])]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b)
  const items = []
  let previous = 0
  for (const value of wanted) {
    if (previous && value - previous > 1) items.push('…')
    items.push(value)
    previous = value
  }
  return items
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const itemClass = (isActive) => `inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition ${isActive ? 'border-brand bg-brand text-white' : 'border-base-300 bg-white text-base-content/70 hover:border-brand hover:text-brand'}`
  const stepClass = `inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-base-300 bg-white px-3 text-sm font-semibold text-base-content/70 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-base-300 disabled:hover:text-base-content/70`
  return <nav aria-label="Pagination" className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row"><p className="text-sm text-base-content/55">Page <span className="font-bold text-base-content">{page}</span> sur {totalPages}</p><div className="flex flex-wrap items-center gap-1.5"><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className={stepClass}><ChevronLeft size={16} /><span className="hidden sm:inline">Précédent</span></button>{getPageItems(page, totalPages).map((item) => (item === '…' ? <span key={`gap-${item}`} className="px-1 text-sm text-base-content/40">…</span> : <button type="button" key={item} disabled={item === page} onClick={() => onChange(item)} aria-current={item === page ? 'page' : undefined} className={itemClass(item === page)}>{item}</button>))}<button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className={stepClass}><span className="hidden sm:inline">Suivant</span><ChevronRight size={16} /></button></div></nav>
}