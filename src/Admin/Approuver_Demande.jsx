import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Package,
  Store,
  CalendarDays,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileStack
} from 'lucide-react'
import toast from 'react-hot-toast'

const initialRequests = [
  {
    id: 1,
    product: {
      name: 'Smartphone Samsung Galaxy A54',
      category: 'Électronique',
      price: 250000,
      image: ''
    },
    seller: 'Jean Dupont',
    date: '2026-09-18',
    status: 'pending'
  },
  {
    id: 2,
    product: {
      name: 'Robe en coton',
      category: 'Mode',
      price: 15000,
      image: ''
    },
    seller: 'Marie Kouassi',
    date: '2026-09-15',
    status: 'pending'
  },
  {
    id: 3,
    product: {
      name: 'Sac à main cuir',
      category: 'Accessoires',
      price: 45000,
      image: ''
    },
    seller: 'Ali Traoré',
    date: '2026-09-10',
    status: 'approved'
  },
  {
    id: 4,
    product: {
      name: 'Chaussures de sport',
      category: 'Sport',
      price: 30000,
      image: ''
    },
    seller: 'Fatou Ndiaye',
    date: '2026-09-08',
    status: 'rejected'
  }
]

const BadgeStatut = ({ status }) => {
  const config = {
    pending: { label: 'En attente', cls: 'badge-warning' },
    approved: { label: 'Approuvé', cls: 'badge-success' },
    rejected: { label: 'Rejeté', cls: 'badge-error' }
  }
  const c = config[status] ?? config.pending
  return <span className={`badge badge-sm md:badge-md gap-1 ${c.cls}`}>{c.label}</span>
}

export default function Detail() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  const filtered = requests.filter((r) =>
    (r.product.name + r.product.category + r.seller)
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const updateStatus = (id, status) => {
    setRequests((reqs) => reqs.map((r) => (r.id === id ? { ...r, status } : r)))
    toast.success(
      status === 'approved' ? 'Demande approuvée, produit publié' : 'Demande rejetée'
    )
    setSelected(null)
  }

  const statCards = [
    { label: 'En attente', value: pendingCount, cls: 'text-warning bg-warning/10' },
    { label: 'Approuvées', value: approvedCount, cls: 'text-success bg-success/10' },
    { label: 'Rejetées', value: rejectedCount, cls: 'text-error bg-error/10' }
  ]

  return (
    <div className='min-h-screen bg-base-100 text-base-content lg:flex'>
      {/* Aside bar */}
      <aside className='w-full lg:w-64 lg:min-h-screen bg-white border-b lg:border-b-0 lg:border-r border-base-300 p-4 flex lg:flex-col gap-4 lg:sticky lg:top-0 flex-wrap'>
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 rounded-lg bg-primary text-primary-content flex items-center justify-center font-extrabold'>
            BU
          </div>
          <p className='text-lg font-bold text-primary'>BU Market</p>
        </div>
        <nav className='flex lg:flex-col gap-2 overflow-x-auto w-full'>
          <Link to='/admin' className='btn btn-ghost justify-start gap-2 whitespace-nowrap'>
            <LayoutDashboard size={18} /> Tableau de bord
          </Link>
          <Link to='/admin' className='btn btn-ghost justify-start gap-2 whitespace-nowrap'>
            <Users size={18} /> Utilisateurs
          </Link>
          <Link to='/approbation-demandes' className='btn btn-primary justify-start gap-2 whitespace-nowrap'>
            <ClipboardList size={18} /> Demandes
          </Link>
          <Link to='/liste-produits' className='btn btn-ghost justify-start gap-2 whitespace-nowrap'>
            <FileStack size={18} /> Produits
          </Link>
        </nav>
      </aside>

      {/* Main bar */}
      <main className='flex-1 min-w-0 p-4 md:p-6'>
        <nav className='navbar navbar-start text-xl md:text-2xl font-bold pl-0'>
          DEMANDES DE PUBLICATION
        </nav>

        {/* Statistiques */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
          {statCards.map((s) => (
            <div key={s.label} className='card p-4 flex-row items-center justify-between'>
              <div>
                <p className='text-sm text-base-content/60'>{s.label}</p>
                <p className='text-3xl font-extrabold'>{s.value}</p>
              </div>
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${s.cls}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Zone de recherches + filtre */}
        <div className='card p-3 md:p-4 mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between'>
          <div className='relative w-full md:w-[70%]'>
            <Search size={20} className='absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40' />
            <input
              type='search'
              placeholder='Rechercher une demande (produit, catégorie, vendeur)...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='input input-lg border-none w-full bg-base-100 pl-12'
            />
          </div>
          <select defaultValue='all' className='select select-lg bg-base-100'>
            <option value='all'>Tous les statuts</option>
            <option value='pending'>En attente</option>
            <option value='approved'>Approuvées</option>
            <option value='rejected'>Rejetées</option>
          </select>
        </div>

        {/* Liste des demandes */}
        <div className='mt-4 space-y-4'>
          {filtered.length === 0 && (
            <div className='card p-10 text-center text-base-content/50'>
              <Package size={40} className='mx-auto opacity-40' />
              <p className='mt-2'>Aucune demande trouvée</p>
            </div>
          )}

          {filtered.map((r) => (
            <div
              key={r.id}
              className='card p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3'
            >
              <div className='flex items-center gap-4 min-w-0'>
                <div className='w-16 h-16 md:w-20 md:h-20 rounded-xl bg-base-200 flex items-center justify-center overflow-hidden shrink-0'>
                  {r.product.image ? (
                    <img
                      src={r.product.image}
                      alt={r.product.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <Package size={30} className='text-secondary/60' />
                  )}
                </div>
                <div className='min-w-0'>
                  <h3 className='font-bold text-base-content truncate'>
                    {r.product.name}
                  </h3>
                  <p className='text-sm text-secondary'>
                    {r.product.category} ·{' '}
                    <span className='font-semibold'>
                      {r.product.price.toLocaleString()} FCFA
                    </span>
                  </p>
                  <p className='text-xs text-base-content/60 flex flex-wrap items-center gap-3 mt-0.5'>
                    <span className='flex items-center gap-1'>
                      <Store size={12} /> {r.seller}
                    </span>
                    <span className='flex items-center gap-1'>
                      <CalendarDays size={12} /> {r.date}
                    </span>
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between md:justify-end gap-2 shrink-0'>
                <BadgeStatut status={r.status} />
                {r.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => setSelected(r)}
                      className='btn btn-ghost btn-sm md:btn-md'
                      title='Voir le détail'
                    >
                      <Eye size={16} /> Détail
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, 'rejected')}
                      className='btn btn-error btn-sm md:btn-md text-error-content gap-1'
                    >
                      <XCircle size={16} /> Rejeter
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, 'approved')}
                      className='btn btn-success btn-sm md:btn-md text-success-content gap-1'
                    >
                      <CheckCircle2 size={16} /> Approuver
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelected(r)}
                      className='btn btn-ghost btn-sm md:btn-md'
                    >
                      <Eye size={16} /> Voir
                    </button>
                    {r.status !== 'pending' && (
                      <button
                        onClick={() => setSelected(null)}
                        className='btn btn-ghost btn-sm md:btn-md opacity-50 pointer-events-none'
                      >
                        —
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de détail */}
      {selected && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
          <div className='w-full max-w-lg card p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-base-content'>
                Détail de la demande
              </h2>
              <button onClick={() => setSelected(null)} className='btn btn-ghost btn-sm btn-circle'>
                ✕
              </button>
            </div>

            <div className='flex items-center gap-4'>
              <div className='w-24 h-24 rounded-xl bg-base-200 flex items-center justify-center overflow-hidden'>
                {selected.product.image ? (
                  <img
                    src={selected.product.image}
                    alt={selected.product.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <Package size={36} className='text-secondary/60' />
                )}
              </div>
              <div>
                <h3 className='text-lg font-bold'>{selected.product.name}</h3>
                <p className='text-sm text-base-content/60'>
                  {selected.product.category}
                </p>
                <p className='text-xl font-extrabold text-primary mt-1'>
                  {selected.product.price.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-100 rounded-xl p-4'>
              <div>
                <p className='text-xs text-base-content/50 font-semibold uppercase'>Vendeur</p>
                <p className='text-sm font-medium flex items-center gap-1 mt-1'>
                  <Store size={14} className='text-secondary' /> {selected.seller}
                </p>
              </div>
              <div>
                <p className='text-xs text-base-content/50 font-semibold uppercase'>Demandé le</p>
                <p className='text-sm font-medium flex items-center gap-1 mt-1'>
                  <CalendarDays size={14} className='text-secondary' /> {selected.date}
                </p>
              </div>
            </div>

            <div className='mt-6 flex flex-col sm:flex-row gap-3'>
              <button
                onClick={() => updateStatus(selected.id, 'rejected')}
                className='flex-1 btn btn-error text-error-content'
              >
                <XCircle size={16} /> Rejeter
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'approved')}
                className='flex-1 btn btn-primary'
              >
                <CheckCircle2 size={16} /> Approuver la publication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}