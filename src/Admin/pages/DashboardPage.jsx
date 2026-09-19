import { useEffect, useState } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock3, Package, Store, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader, StatCard, StatusBadge } from '../components/ui.jsx'

const iconByStat = { users: UsersRound, shops: Store, products: Package, pending: AlertTriangle }
const activityIcon = { shop: Store, user: UsersRound, alert: AlertTriangle, settings: CheckCircle2 }
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function DashboardPage() {
  const [data, setData] = useState(null)
  useEffect(() => { adminService.getDashboard().then(setData) }, [])
  if (!data) return <DashboardSkeleton />
  const maxActivity = Math.max(...data.weeklyActivity)
  return <>
    <PageHeader title="Tableau de bord" description="Suivi des utilisateurs, boutiques, produits et éléments à traiter." action={<span className="inline-flex items-center gap-2 rounded-full border border-base-200 bg-white px-3 py-1.5 text-xs font-medium text-base-content/60"><Clock3 size={15} /> Mis à jour à 10:24</span>} />
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.stats.map((stat) => <StatCard key={stat.id} {...stat} icon={iconByStat[stat.id]} />)}</section>
    <section className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)]">
      <article className="card p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-base-content">Activité de la plateforme</h2><p className="mt-1 text-sm text-base-content/55">Nouvelles inscriptions et publications cette semaine.</p></div><span className="bg-brand/10 p-2 text-brand"><Activity size={18} /></span></div><div className="mt-5 flex h-44 items-end justify-between gap-2 sm:gap-4" aria-label="Graphique d'activité hebdomadaire">{data.weeklyActivity.map((value, index) => <div key={weekDays[index]} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-semibold text-base-content/55">{value}</span><div className="w-full max-w-10 rounded-t-md bg-brand transition-all" style={{ height: `${(value / maxActivity) * 100}%` }} /><span className="text-xs font-medium text-base-content/40">{weekDays[index]}</span></div>)}</div></article>
      <article className="card p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-base-content">À modérer</h2><p className="mt-1 text-sm text-base-content/55">Les derniers éléments reçus.</p></div><Link to="/admin/utilisateurs?status=pending" className="text-sm font-semibold text-brand hover:text-brand-soft">Tout voir</Link></div><div className="mt-4 divide-y divide-base-200">{data.moderationQueue.map((item) => <div key={item.id} className="flex gap-3 py-3 first:pt-0"><span className="grid size-8 shrink-0 place-items-center bg-amber-50 text-amber-700"><AlertTriangle size={16} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-base-content">{item.title}</p><StatusBadge status={item.status} /></div><p className="mt-1 text-xs text-base-content/50">{item.type} · {item.owner}</p><p className="mt-1 text-xs text-base-content/40">{item.date}</p></div></div>)}</div></article>
    </section>
    <section className="card mt-5 p-4 sm:p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-base-content">Activité récente</h2><p className="mt-1 text-sm text-base-content/55">Les dernières actions réalisées sur la plateforme.</p></div><span className="hidden bg-base-200 p-2 text-base-content/55 sm:block"><Activity size={18} /></span></div><div className="mt-4 grid gap-px bg-base-200 lg:grid-cols-2 xl:grid-cols-4">{data.activity.map((entry) => { const Icon = activityIcon[entry.kind]; return <div key={entry.id} className="bg-white p-4"><span className="grid size-7 place-items-center bg-brand/10 text-brand"><Icon size={15} /></span><p className="mt-3 text-sm font-semibold text-base-content">{entry.title}</p><p className="mt-1 text-xs leading-5 text-base-content/55">{entry.description}</p><p className="mt-3 text-xs font-medium text-base-content/45">{entry.time}</p></div> })}</div></section>
  </>
}

function DashboardSkeleton() { return <div className="animate-pulse space-y-6"><div className="h-20 w-80 rounded-xl bg-base-200" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-40 rounded-2xl bg-base-200" />)}</div><div className="h-72 rounded-2xl bg-base-200" /></div> }