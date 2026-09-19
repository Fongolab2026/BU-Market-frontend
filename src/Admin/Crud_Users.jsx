import { useState } from 'react'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader, Pagination, StatusBadge } from './components/ui.jsx'

const initialUsers = [
  { id: 1, initials: 'JD', name: 'Jean Dupont', email: 'jean@exemple.com', role: 'admin', status: 'active', lastActive: 'il y a 5 min' },
  { id: 2, initials: 'MK', name: 'Marie Kouassi', email: 'marie@exemple.com', role: 'merchant', status: 'active', lastActive: 'il y a 2 h' },
  { id: 3, initials: 'AT', name: 'Ali Traoré', email: 'ali@exemple.com', role: 'client', status: 'pending', lastActive: 'il y a 3 jours' }
]
const roleLabel = { admin: 'Gestionnaire', merchant: 'Commerçant', client: 'Client' }

const inputCls = 'h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10'

export default function Crud_Users() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null) // 'add' | 'edit' | 'delete'
  const [current, setCurrent] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'client', status: 'active' })

  const perPage = 5
  const filtered = users.filter((u) => (u.name + u.email).toLowerCase().includes(search.trim().toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * perPage
  const paged = filtered.slice(start, start + perPage)

  const openAdd = () => { setForm({ name: '', email: '', role: 'client', status: 'active' }); setModal('add') }
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setCurrent(u); setModal('edit') }

  const handleSubmit = () => {
    if (!form.name || !form.email) return toast.error('Nom et email requis')
    if (modal === 'edit') {
      setUsers((list) => list.map((u) => (u.id === current.id ? { ...u, ...form, initials: form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() } : u)))
      toast.success('Utilisateur modifié')
    } else {
      setUsers((list) => [...list, { id: Date.now(), ...form, initials: form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), lastActive: "à l'instant" }])
      toast.success('Utilisateur ajouté')
    }
    setModal(null)
  }

  const confirmDelete = () => { setUsers((list) => list.filter((u) => u.id !== toDelete.id)); toast.success('Utilisateur supprimé'); setToDelete(null) }

  return <>
    <PageHeader title="Utilisateurs" description="Gérez les comptes de la plateforme : ajout, modification, statut et suppression." action={<button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"><Plus size={17} /> Ajouter</button>} />

    <section className="card p-4 sm:p-5">
      <label className="relative block"><span className="sr-only">Rechercher un utilisateur</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Rechercher par nom ou e-mail…" className="h-10 w-full border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" /></label>

      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-base-200 text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45"><th className="pb-3 pl-2">Utilisateur</th><th className="pb-3">Rôle</th><th className="pb-3">Statut</th><th className="pb-3">Dernière activité</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-base-200">{paged.map((user) => <tr key={user.id} className="transition hover:bg-base-100"><td className="py-3.5 pl-2"><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">{user.initials}</span><div className="min-w-0"><p className="truncate font-semibold text-base-content">{user.name}</p><p className="truncate text-xs text-base-content/50">{user.email}</p></div></div></td><td className="py-3.5 text-sm font-medium text-base-content/70">{roleLabel[user.role]}</td><td className="py-3.5"><StatusBadge status={user.status} /></td><td className="py-3.5 text-sm text-base-content/55">{user.lastActive}</td><td className="py-3.5"><div className="flex justify-end gap-1"><button onClick={() => openEdit(user)} aria-label={`Modifier ${user.name}`} className="rounded-lg p-2 text-base-content/50 transition hover:bg-brand/10 hover:text-brand"><Pencil size={16} /></button><button onClick={() => setToDelete(user)} aria-label={`Supprimer ${user.name}`} className="rounded-lg p-2 text-base-content/50 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>

      {filtered.length === 0 && <div className="py-14 text-center"><Search className="mx-auto text-base-content/25" size={30} /><p className="mt-3 font-bold text-base-content">Aucun utilisateur trouvé</p><p className="mt-1 text-sm text-base-content/45">Modifiez vos critères de recherche.</p></div>}
      {filtered.length > 0 && <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />}
    </section>

    {/* Modal Ajout / Modification */}
    {(modal === 'add' || modal === 'edit') && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
        <div className="card w-full max-w-md p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-base-content">{modal === 'add' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}</h2><button onClick={() => setModal(null)} aria-label="Fermer" className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-200 hover:text-base-content"><X size={18} /></button></div>
          <div className="space-y-4">
            <div><label className="mb-1.5 block text-sm font-semibold text-base-content/80">Nom complet</label><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nom de l'utilisateur" className={inputCls} /></div>
            <div><label className="mb-1.5 block text-sm font-semibold text-base-content/80">Adresse e-mail</label><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="email@exemple.com" className={inputCls} /></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-sm font-semibold text-base-content/80">Rôle</label><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="h-10 w-full appearance-none border border-base-300 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"><option value="client">Client</option><option value="merchant">Commerçant</option><option value="admin">Gestionnaire</option></select></div>
              <div><label className="mb-1.5 block text-sm font-semibold text-base-content/80">Statut</label><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-10 w-full appearance-none border border-base-300 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"><option value="active">Actif</option><option value="pending">En attente</option><option value="suspended">Suspendu</option></select></div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={() => setModal(null)} className="flex-1 rounded-lg border border-base-300 bg-white px-4 py-2.5 text-sm font-semibold text-base-content/70 transition hover:border-brand hover:text-brand">Annuler</button><button onClick={handleSubmit} className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft">Enregistrer</button></div>
        </div>
      </div>
    )}

    {/* Modal Suppression */}
    {toDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
        <div className="card w-full max-w-sm p-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-rose-50 text-rose-600"><Trash2 size={26} /></span>
          <h2 className="mt-4 text-lg font-bold text-base-content">Supprimer cet utilisateur ?</h2>
          <p className="mt-1 text-sm text-base-content/55">L'utilisateur <b>{toDelete.name}</b> sera définitivement supprimé.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={() => setToDelete(null)} className="flex-1 rounded-lg border border-base-300 bg-white px-4 py-2.5 text-sm font-semibold text-base-content/70 transition hover:border-brand hover:text-brand">Annuler</button><button onClick={confirmDelete} className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">Supprimer</button></div>
        </div>
      </div>
    )}
  </>
}