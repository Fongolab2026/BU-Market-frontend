import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Package,
  Store,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService.js'
import { downloadAdminReport } from '../../../../../utils/pdfReport.js'
import { DashboardSkeleton } from '../../../../../components/skeletons'

const iconByStat = { users: UsersRound, shops: Store, products: Package, moderation: AlertTriangle }
const activityIcon = { shop: Store, user: UsersRound, alert: AlertTriangle, settings: CheckCircle2 }
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const formatWeekDay = (value) => {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  const label = date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const queueTarget = (type) =>
  type === 'Boutique'
    ? '/admin/boutiques?status=pending'
    : type === 'Produit'
      ? '/admin/produits'
      : '/admin/avis?status=hidden'

export function DashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    dashboardService.get().then(setData).catch(() => setError(true))
  }, [])

  const handleReport = () => {
    if (!data) return
    setReporting(true)
    try {
      downloadAdminReport(data)
    } finally {
      setReporting(false)
    }
  }

  if (error) return <DashboardError />
  if (!data) return <DashboardSkeleton />

  const weeklyActivity = data.weeklyActivity || []
  const weeklyLabels = weeklyActivity.map(
    (_, index) => formatWeekDay(data.weeklyActivityDates?.[index]) || weekDays[index],
  )
  const maxActivity = Math.max(...weeklyActivity, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
            Espace gestion
          </span>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-base-content">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Suivi des utilisateurs, boutiques, produits et éléments à traiter.
          </p>
        </div>
        <button type="button" onClick={handleReport} disabled={reporting} className="btn btn-primary gap-2">
          <Download className="size-4" />
          Rapport PDF
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} {...stat} icon={iconByStat[stat.id] || Package} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-base-300 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
                <BarChart2 className="size-4 text-primary" />
                Activité de la plateforme
              </h2>
              <p className="mt-0.5 text-xs text-base-content/50">
                Commandes enregistrées cette semaine
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-medium text-base-content/60">
              <span>7 derniers jours</span>
              <ChevronDown className="size-3.5 text-base-content/40" />
            </span>
          </div>

          <div className="flex h-40 items-end justify-between gap-1 border-b border-base-300 px-1 pb-3 sm:h-48 sm:gap-2 sm:px-4">
            {weeklyActivity.map((value, index) => {
              const heightPct = maxActivity > 0 ? Math.max(8, (value / maxActivity) * 100) : 8
              const isPeak = maxActivity > 0 && value === maxActivity
              const label = weeklyLabels[index]
              return (
                <div key={`${data.weeklyActivityDates?.[index] || index}`} className="flex flex-1 flex-col items-center gap-2" style={{ maxWidth: 44 }}>
                  <span className="text-[11px] font-bold text-base-content/70">{value}</span>
                  <div className="flex h-24 w-full items-end justify-center rounded-t-lg bg-base-200/70 sm:h-32">
                    <div
                      className={`w-full rounded-t-lg transition-all ${isPeak ? 'bg-primary' : 'bg-primary/20'}`}
                      style={{ height: `${heightPct}%` }}
                      aria-label={`${label} : ${value}`}
                    />
                  </div>
                  <span className={`text-xs ${isPeak ? 'font-bold text-base-content' : 'text-base-content/50'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="pt-4 text-xs text-base-content/60">
            Point culminant : <strong className="text-base-content">{maxActivity} activités</strong>
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-base-300 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
                <AlertTriangle className="size-4 text-warning" />
                À modérer
              </h2>
              <p className="mt-0.5 text-xs text-base-content/50">Les derniers éléments reçus</p>
            </div>
            <Link to="/admin/boutiques?status=pending" className="whitespace-nowrap text-xs font-bold text-primary hover:underline">
              Tout voir
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {data.moderationQueue.length === 0 && (
              <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-center text-xs text-base-content/50">
                Rien à modérer
              </p>
            )}
            {data.moderationQueue.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                to={queueTarget(item.type)}
                className="flex items-start gap-3 rounded-xl border border-base-300 bg-base-200/40 p-3 transition-colors hover:bg-base-200"
              >
                <span className="shrink-0 rounded-lg bg-accent/20 p-2 text-accent">
                  <AlertTriangle className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-base-content">{item.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-base-content/60">
                    {item.type} · {item.owner}
                  </p>
                  <span className="mt-1 block text-[10px] text-base-content/40">{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-base-300 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
              <Activity className="size-4 text-primary" />
              Activité récente
            </h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Les dernières actions réalisées sur la plateforme
            </p>
          </div>
          <span className="hidden rounded-lg bg-base-200 p-2 text-base-content/50 sm:block">
            <Clock3 className="size-4" />
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.activity.map((entry) => {
            const Icon = activityIcon[entry.kind] || CheckCircle2
            return (
              <div key={entry.id} className="rounded-xl border border-base-300 bg-base-200/40 p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-sm font-semibold text-base-content">{entry.title}</p>
                <p className="mt-1 text-xs leading-5 text-base-content/60">{entry.description}</p>
                <p className="mt-3 text-xs font-medium text-base-content/40">{entry.time}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, change, icon: Icon, tone = 'brand' }) {
  const tones = {
    brand: 'bg-primary/10 text-primary',
    orange: 'bg-primary/10 text-primary',
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-success/10 text-success',
    success: 'bg-success/10 text-success',
    amber: 'bg-accent/20 text-accent',
    warning: 'bg-warning/10 text-warning',
  }
  const isPercent = /%/.test(String(change))

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-base-300 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">{label}</span>
        <span className={`rounded-lg p-1.5 ${tones[tone] || tones.brand}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <div>
        <p className="break-words text-2xl font-black tracking-tight text-base-content">{value}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {isPercent ? (
            <span className="flex items-center gap-1 rounded border border-success/25 bg-success/10 px-1.5 py-0.5 text-success">
              <TrendingUp className="size-3" /> {change}
            </span>
          ) : (
            <span className="rounded border border-base-300 bg-base-200 px-1.5 py-0.5 text-base-content/60">
              {change}
            </span>
          )}
          <span className="text-[11px] font-normal text-base-content/40">vs. période précédente</span>
        </div>
      </div>
    </div>
  )
}

function DashboardError() {
  return (
    <div className="grid place-items-center rounded-2xl border border-base-300 bg-white p-12 text-center shadow-sm">
      <span className="grid size-14 place-items-center rounded-2xl bg-error/10 text-error">
        <AlertTriangle className="size-7" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-base-content">Impossible de charger le tableau de bord</h2>
      <p className="mt-2 max-w-md text-sm text-base-content/60">
        Une erreur est survenue lors de la récupération des statistiques. Réessayez dans quelques instants.
      </p>
      <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-5">
        Recharger la page
      </button>
    </div>
  )
}
