import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { userApi } from '../services'

const ROLE_LABELS = {
  buyer: 'Buyer',
  seller: 'Seller',
  admin: 'Admin',
  superadmin: 'Super Admin',
}

export default function Crud_Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await userApi.list()
      setUsers((Array.isArray(data) ? data : data.results ?? []))
    } catch (e) {
      setError('Impossible de charger les utilisateurs')
      console.error('users:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await userApi.remove(id)
      toast.success('Utilisateur supprimé')
      setUsers(users.filter((u) => u.id !== id))
    } catch {
      toast.error('Suppression impossible')
    }
  }

  const handleRole = async (user, role) => {
    if (role === user.role) return
    try {
      const { data } = await userApi.partialUpdate(user.id, { role })
      setUsers(users.map((u) => (u.id === data.id ? data : u)))
      toast.success('Rôle mis à jour')
    } catch {
      toast.error('Mise à jour impossible')
    }
  }

  const filtered = users.filter((u) =>
    `${u.username} ${u.email} ${u.first_name ?? ''} ${u.last_name ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className='min-h-screen bg-base-100 text-base-content'>
      <div className='w-full h-full p-4'>
        <h1 className='text-2xl font-bold mb-4'>Utilisateurs</h1>

        {error && <div className='alert alert-error mb-4'>{error}</div>}

        <div className='w-full p-2 flex flex-col shadow-2xl rounded-2xl bg-white'>
          <div className='w-full flex justify-between mb-4 flex-wrap gap-2'>
            <input
              type="search"
              placeholder='Rechercher Utilisateur'
              className='input input-lg bg-white w-[40%]'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className='btn btn-primary'>+ Ajouter Utilisateurs</button>
          </div>

          <div className='w-full overflow-x-auto'>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Rôle</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200/70 text-sm text-slate-700'>
                {loading ? (
                  <tr><td className="py-8 text-center" colSpan="5"><span className="loading loading-spinner loading-lg"></span></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-8 text-center text-slate-500" colSpan="5">Aucun utilisateur trouvé.</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-100/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                            {(u.username ?? '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800">{u.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{u.email}</td>
                      <td className="py-3 px-3">
                        <select
                          className={`select select-sm ${u.role === 'admin' || u.role === 'superadmin' ? 'select-warning' : 'select-ghost'}`}
                          value={u.role}
                          onChange={(e) => handleRole(u, e.target.value)}
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-md text-xs font-medium">
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-500">
                          <button title="Supprimer" onClick={() => handleDelete(u.id)} className="hover:text-red-600 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}