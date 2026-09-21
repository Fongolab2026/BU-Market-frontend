import { useEffect, useState } from 'react'
import { Activity, Banknote, Building2, CheckCircle2, Clock3, MessageSquare, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { merchantDashboardService } from '../services/merchantDashboardService.js'
import { PageHeader, StatCard, StatusBadge } from '../../../components/ui.jsx'

const iconByStat = { sales: Banknote, orders: ShoppingBag, products: Package, views: TrendingUp }
const activityIcon = { order: ShoppingBag, product: Package, message: MessageSquare, delivery: CheckCircle2 }
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const activityTarget = (kind) => (kind === 'order' ? '/marchand/commandes' : kind === 'product' ? '/marchand/produits' : kind === 'message' ? '/marchand/messages' : '/marchand/commandes')

export function MerchantDashboardPage() {
  const [data, setData] = useState(null)
  useEffect(() => { merchantDashboardService.get().then(setData) }, [])
  if (!data) return <MerchantDashboardSkeleton />
  const maxActivity = Math.max(...data.weeklySales)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité : ventes, commandes, produits et messages."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={12} /> En ligne
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-base-200 bg-white px-3 py-1.5 text-xs font-medium text-base-content/60">
              <Clock3 size={12} /> Maj auto
            </span>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs clés">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} {...stat} icon={iconByStat[stat.id]} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(380px,1fr)]">
        <article className="card overflow-hidden">
          <div className="border-b border-base-200 bg-base-50/50 px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-base-content">Évolution des ventes (7 jours)</h2>
                <p className="mt-0.5 text-sm text-base-content/60">Chiffre d'affaires quotidien en F CFA</p>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
                <TrendingUp size={18} />
              </span>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex h-56 items-end justify-between gap-1.5 sm:gap-3" role="img" aria-label="Graphique à barres des ventes sur 7 jours">
              {data.weeklySales.map((value, index) => {
                const heightPct = maxActivity > 0 ? Math.max(8, (value / maxActivity) * 100) : 8
                const isPeak = value === maxActivity
                return (
                  <div key={weekDays[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" style={{ minWidth: 40 }}>
                    <span className={`text-xs font-semibold ${isPeak ? 'text-brand' : 'text-base-content/55'}`}>
                      {value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}
                    </span>
                    <div
                      className={`w-full max-w-10 rounded-t-md transition-all duration-500 ${isPeak ? 'bg-brand' : 'bg-brand/20'}`}
                      style={{ height: `${heightPct}%` }}
                      role="img"
                      aria-label={`${weekDays[index]} : ${value.toLocaleString()} F`}
                    />
                    <span className="text-xs font-medium text-base-content/40">{weekDays[index]}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="border-t border-base-200 bg-base-50/50 px-5 py-3 sm:px-6">
            <p className="text-xs text-base-content/55 text-center">
              Pic : <span className="font-semibold text-brand">{Math.max(...data.weeklySales).toLocaleString()} F</span> &nbsp;|&nbsp; Moyenne : <span className="font-semibold text-base-content">{(data.weeklySales.reduce((a, b) => a + b, 0) / data.weeklySales.length).toFixed(0)} F</span>
            </p>
          </div>
        </article>

        <article className="card overflow-hidden">
          <div className="border-b border-base-200 bg-base-50/50 px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-base-content">Activité récente</h2>
              <p className="mt-0.5 text-sm text-base-content/60">Dernières actions sur votre boutique</p>
            </div>
            <Link to="/marchand/commandes" className="text-sm font-semibold text-brand hover:text-brand-soft whitespace-nowrap">Tout voir</Link>
          </div>
          <div className="divide-y divide-base-200">
            {data.activity.map((item) => {
              const Icon = activityIcon[item.kind]
              return (
                <Link key={item.id} to={activityTarget(item.kind)} className="flex gap-4 p-4 transition hover:bg-base-50" role="listitem">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-base-content">{item.title}</p>
                      <StatusBadge status="active" label="Nouveau" />
                    </div>
                    <p className="mt-1 text-sm text-base-content/60">{item.description}</p>
                    <p className="mt-1 text-xs text-base-content/40 flex items-center gap-1">
                      <Clock3 size={12} /> {item.time}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="px-5 py-3 sm:px-6">
            <Link to="/marchand/commandes" className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg border border-base-300 bg-white px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-50">
              <Activity size={16} /> Voir toute l'activité
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Raccourcis rapides">
        <QuickLink to="/marchand/produits" icon={Package} label="Ajouter un produit" desc="Publier un nouvel article" />
        <QuickLink to="/marchand/boutique" icon={Building2} label="Ma boutique" desc="Modifier mes infos" />
        <QuickLink to="/marchand/messages" icon={MessageSquare} label="Messages" desc="Répondre aux clients" />
        <QuickLink to="/marchand/commandes" icon={ShoppingBag} label="Commandes" desc="Gérer les statuts" />
      </section>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label, desc }) {
  return (
    <Link to={to} className="card group flex items-center gap-4 p-4 transition hover:border-brand/30 hover:shadow-md hover:bg-base-50">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
        <Icon size={22} strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-base-content group-hover:text-brand">{label}</p>
        <p className="mt-0.5 text-sm text-base-content/55">{desc}</p>
      </div>
      <span className="text-base-content/30 group-hover:text-brand transition-colors">→</span>
    </Link>
  )
}

function MerchantDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 w-80 rounded-xl bg-base-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-40 rounded-2xl bg-base-200" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(380px,1fr)]">
        <div className="h-72 rounded-2xl bg-base-200" />
        <div className="h-72 rounded-2xl bg-base-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 rounded-2xl bg-base-200" />
        ))}
      </div>
    </div>
  )
}