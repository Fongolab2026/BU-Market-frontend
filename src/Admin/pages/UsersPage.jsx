import { useEffect, useState } from 'react'
import { Eye, Filter, Search, SlidersHorizontal, UsersRound } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader, Pagination, StatusBadge } from '../components/ui.jsx'

const roleLabel = { admin: 'Gestionnaire', merchant: 'Commerçant', client: 'Client' }

export function UsersPage() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({ query: '', role: 'all', status: searchParams.get('status') || 'all' })
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ results: [], total: 0, totalPages: 1, page: 1, perPage: 5 })
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); const timer = setTimeout(() => adminService.listUsers({ ...filters, page }).then((response) => { setData(response); setLoading(false) }), 150); return () => clearTimeout(timer) }, [filters, page])
  const updateFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setPage(1) }
  const rangeStart = data.total ? (data.page - 1) * data.perPage + 1 : 0
  const rangeEnd = Math.min(data.page * data.perPage, data.total)
  return <>
    <PageHeader title="Utilisateurs" description="Consultez les comptes et leur accès à la plateforme." action={<div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand"><UsersRound size={17} /> {data.total} résultat{data.total > 1 ? 's' : ''}</div>} />
    <section className="card p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="relative block"><span className="sr-only">Rechercher un utilisateur</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} /><input value={filters.query} onChange={(event) => updateFilter('query', event.target.value)} placeholder="Rechercher par nom, e-mail ou boutique…" className="h-10 w-full border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" /></label>
        <label className="relative"><span className="sr-only">Filtrer par rôle</span><Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} /><select value={filters.role} onChange={(event) => updateFilter('role', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"><option value="all">Tous les rôles</option><option value="merchant">Commerçants</option><option value="client">Clients</option><option value="admin">Gestionnaires</option></select></label>
        <label className="relative"><span className="sr-only">Filtrer par statut</span><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} /><select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)} className="h-10 w-full appearance-none border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"><option value="all">Tous les statuts</option><option value="active">Actifs</option><option value="pending">En attente</option><option value="suspended">Suspendus</option></select></label>
      </div>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead><tr className="border-b border-base-200 text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45"><th className="pb-3 pl-2">Utilisateur</th><th className="pb-3">Rôle</th><th className="pb-3">Boutique</th><th className="pb-3">Statut</th><th className="pb-3">Dernière activité</th><th className="pb-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-base-200">{loading ? <TableSkeleton /> : data.results.map((user) => <tr key={user.id} className="transition hover:bg-base-100"><td className="py-3.5 pl-2"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{user.initials}</span><div><p className="font-semibold text-base-content">{user.firstName} {user.lastName}</p><p className="mt-0.5 text-xs text-base-content/50">{user.email}</p></div></div></td><td className="py-3.5 text-sm font-medium text-base-content/70">{roleLabel[user.role]}</td><td className="py-3.5 text-sm text-base-content/70">{user.shop ? user.shop.name : <span className="text-base-content/40">—</span>}</td><td className="py-3.5"><StatusBadge status={user.status} /></td><td className="py-3.5 text-sm text-base-content/55">{user.lastActive}</td><td className="py-3.5 text-right">{user.role === 'merchant' ? <Link to={`/admin/utilisateurs/${user.id}`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand hover:bg-brand/10"><Eye size={16} /> Détail</Link> : <span className="mr-2 text-sm text-base-content/40">—</span>}</td></tr>)}</tbody></table></div>
      {!loading && data.results.length === 0 && <div className="py-14 text-center"><Search className="mx-auto text-base-content/25" size={30} /><p className="mt-3 font-bold text-base-content">Aucun utilisateur trouvé</p><p className="mt-1 text-sm text-base-content/45">Modifiez vos critères de recherche.</p></div>}
      {!loading && data.total > 0 && <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-base-200 pt-4 sm:flex-row"><p className="text-sm text-base-content/55">Affichage de <span className="font-bold text-base-content">{rangeStart}</span> à <span className="font-bold text-base-content">{rangeEnd}</span> sur {data.total}</p><Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} /></div>}
    </section>
  </>
}

function TableSkeleton() { return [1, 2, 3, 4].map((item) => <tr key={item} className="animate-pulse"><td className="py-4"><div className="h-10 w-52 rounded-lg bg-base-200" /></td><td><div className="h-4 w-24 rounded bg-base-200" /></td><td><div className="h-4 w-28 rounded bg-base-200" /></td><td><div className="h-6 w-20 rounded-full bg-base-200" /></td><td><div className="h-4 w-24 rounded bg-base-200" /></td></tr>) }