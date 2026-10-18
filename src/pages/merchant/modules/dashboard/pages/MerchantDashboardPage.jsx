import { useEffect, useState } from 'react'
import {
  Activity,
  Banknote,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileText,
  MessageSquare,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { merchantDashboardService } from '../services/merchantDashboardService.js'
import { downloadMerchantReport } from '../../../../../utils/pdfReport.js'
import { DashboardSkeleton } from '../../../../../components/skeletons'

const iconByStat = { sales: Banknote, orders: ShoppingCart, products: Package, views: TrendingUp }
const activityIcon = { order: ShoppingCart, product: Package, message: MessageSquare, delivery: CheckCircle2 }
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const activityTarget = (kind) =>
  kind === 'order'
    ? '/marchand/commandes'
    : kind === 'product'
      ? '/marchand/produits'
      : kind === 'message'
        ? '/marchand/messages'
        : '/marchand/commandes'

const ORDER_STATUS = {
  pending: { label: 'En attente', className: 'bg-warning/10 text-warning border-warning/25' },
  confirmed: { label: 'Confirmée', className: 'bg-primary/10 text-primary border-primary/25' },
  shipped: { label: 'Expédiée', className: 'bg-info/10 text-info border-info/25' },
  completed: { label: 'Livrée', className: 'bg-success/10 text-success border-success/25' },
  cancelled: { label: 'Annulée', className: 'bg-error/10 text-error border-error/25' },
}

const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const formatNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('fr-FR') : '0'
}

export function MerchantDashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [reporting, setReporting] = useState(false)

  useEffect(() => {
    merchantDashboardService
      .get()
      .then(setData)
      .catch(() => setError(true))
  }, [])

  const handleReport = () => {
    if (!data) return
    setReporting(true)
    try {
      downloadMerchantReport(data)
    } finally {
      setReporting(false)
    }
  }

  if (error) return <MerchantDashboardError />
  if (!data) return <DashboardSkeleton />

  const maxSales = Math.max(...data.weeklySales, 0)
  const totalSales = data.weeklySales.reduce((sum, value) => sum + value, 0)
  const averageSales = data.weeklySales.length ? Math.round(totalSales / data.weeklySales.length) : 0
  const recentOrders = (data.orders || []).slice(0, 5)
  const shopName = data.shop?.name || 'votre boutique'

  return (
    <div className="space-y-6">
      {/* En-tête + action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
            Espace vendeur
          </span>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-base-content">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Vue d'ensemble de votre activité : ventes, commandes, produits et messages.
          </p>
        </div>
        <button type="button" onClick={handleReport} disabled={reporting} className="btn btn-primary gap-2">
          <Download className="size-4" />
          Rapport PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} {...stat} icon={iconByStat[stat.id] || Package} />
        ))}
      </div>

      {/* Graphique + activité */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl border border-base-300 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
                <BarChart2 className="size-4 text-primary" />
                Évolution des ventes (7 jours)
              </h2>
              <p className="mt-0.5 text-xs text-base-content/50">Chiffre d'affaires quotidien en BIF</p>
            </div>
            <span className="flex items-center gap-1 rounded-lg border border-base-300 bg-base-200 px-3 py-1.5 text-xs font-medium text-base-content/60">
              <span>7 derniers jours</span>
              <ChevronDown className="size-3.5 text-base-content/40" />
            </span>
          </div>

          <div className="flex h-40 items-end justify-between gap-1 border-b border-base-300 px-1 pb-3 sm:h-48 sm:gap-2 sm:px-4">
            {data.weeklySales.map((value, index) => {
              const heightPct = maxSales > 0 ? Math.max(8, (value / maxSales) * 100) : 8
              const isPeak = maxSales > 0 && value === maxSales
              return (
                <div key={weekDays[index]} className="flex flex-1 flex-col items-center gap-2" style={{ maxWidth: 44 }}>
                  <span className="text-[11px] font-bold text-base-content/70">
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  </span>
                  <div className="flex h-24 w-full items-end justify-center rounded-t-lg bg-base-200/70 sm:h-32">
                    <div
                      className={`w-full rounded-t-lg transition-all ${isPeak ? 'bg-primary' : 'bg-primary/20'}`}
                      style={{ height: `${heightPct}%` }}
                      role="img"
                      aria-label={`${weekDays[index]} : ${value.toLocaleString('fr-FR')} BIF`}
                    />
                  </div>
                  <span className={`text-xs ${isPeak ? 'font-bold text-base-content' : 'text-base-content/50'}`}>
                    {weekDays[index]}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-base-content/60">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary" />
              <span>Jour de forte affluence</span>
            </div>
            <div className="font-medium text-base-content/70">
              Pic : <strong className="text-base-content">{formatNumber(maxSales)} BIF</strong>
              <span className="mx-2 text-base-300">|</span>
              Moyenne : <strong className="text-base-content">{formatNumber(averageSales)} BIF/j</strong>
            </div>
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-base-300 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
                <Activity className="size-4 text-primary" />
                Activité récente
              </h2>
              <p className="mt-0.5 text-xs text-base-content/50">Dernières actions sur votre boutique</p>
            </div>
            <Link to="/marchand/commandes" className="whitespace-nowrap text-xs font-bold text-primary hover:underline">
              Tout voir
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {data.activity.length === 0 && (
              <p className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-center text-xs text-base-content/50">
                Aucune activité récente
              </p>
            )}
            {data.activity.slice(0, 4).map((item) => {
              const Icon = activityIcon[item.kind] || Package
              const tone =
                item.kind === 'order'
                  ? 'bg-success/15 text-success'
                  : item.kind === 'message'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-primary/15 text-primary'
              return (
                <Link
                  key={item.id}
                  to={activityTarget(item.kind)}
                  className="flex items-start gap-3 rounded-xl border border-base-300 bg-base-200/40 p-3 transition-colors hover:bg-base-200"
                >
                  <span className={`shrink-0 rounded-lg p-2 ${tone}`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-base-content">{item.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-base-content/60">{item.description}</p>
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-base-content/40">
                      <Clock3 className="size-3" /> {item.time}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      {/* Dernières commandes */}
      <section className="rounded-2xl border border-base-300 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-base-content">
              <FileText className="size-4 text-primary" />
              Dernières commandes enregistrées
            </h2>
            <p className="mt-0.5 text-xs text-base-content/50">
              Suivez l'état d'expédition des commandes récentes de {shopName}
            </p>
          </div>
          <Link to="/marchand/commandes" className="btn btn-sm gap-2 border border-base-300 bg-base-100 text-base-content/70 hover:bg-base-200">
            Filtrer
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-base-300 bg-base-200/40 py-8 text-center text-xs text-base-content/50">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-base-300 text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                  <th className="pb-3">Commande</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {recentOrders.map((order) => {
                  const status = ORDER_STATUS[order.status] || {
                    label: order.status,
                    className: 'bg-base-200 text-base-content/60 border-base-300',
                  }
                  return (
                    <tr key={order.id} className="transition-colors hover:bg-base-200/50">
                      <td className="py-3 font-semibold text-base-content">#{order.id}</td>
                      <td className="py-3 text-base-content/70">{order.client || '—'}</td>
                      <td className="py-3 text-base-content/50">{formatDateTime(order.created_at)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-base-content">
                        {formatNumber(order.total_price ?? order.total)} BIF
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
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
            <span className="flex items-center gap-1 rounded border border-base-300 bg-base-200 px-1.5 py-0.5 text-base-content/60">
              <span className="size-1.5 rounded-full bg-accent" /> {change}
            </span>
          )}
          <span className="text-[11px] font-normal text-base-content/40">vs. mois dernier</span>
        </div>
      </div>
    </div>
  )
}

function MerchantDashboardError() {
  return (
    <div className="grid place-items-center rounded-2xl border border-base-300 bg-white p-12 text-center shadow-sm">
      <span className="grid size-14 place-items-center rounded-2xl bg-error/10 text-error">
        <Activity className="size-7" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-base-content">
        Impossible de charger votre tableau de bord
      </h2>
      <p className="mt-2 max-w-md text-sm text-base-content/60">
        Une erreur est survenue lors de la récupération de vos statistiques. Réessayez dans quelques instants.
      </p>
      <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-5">
        Recharger la page
      </button>
    </div>
  )
}
