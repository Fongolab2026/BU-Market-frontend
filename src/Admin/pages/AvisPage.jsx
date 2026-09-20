import { useEffect, useState } from 'react'
import { Eye, EyeOff, Search, Star, Store, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminService } from '../../services/mockAdminService.js'
import { PageHeader, Pagination, StatusBadge } from '../components/ui.jsx'
import { ConfirmDialog } from '../components/ConfirmDialog.jsx'
import Loading from '../../Users/Composants/Loading'

const PAGE_SIZE = 8

export function AvisPage() {
  const [reviews, setReviews] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    let active = true
    adminService.listReviews().then((result) => {
      if (active) {
        setReviews(result)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  const visibleCount = reviews.filter((review) => review.status === 'visible').length
  const hiddenCount = reviews.length - visibleCount

  const filtered = reviews.filter((review) => {
    const matchesStatus = status === 'all' || review.status === (status === 'hidden' ? 'hidden' : 'visible')
    const text = `${review.author} ${review.comment} ${review.shopName}`.toLowerCase()
    const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleReview = async (review) => {
    const nextStatus = review.status === 'visible' ? 'hidden' : 'visible'
    await adminService.updateReviewStatus(review.shopId, review.id, nextStatus)
    setReviews((current) => current.map((item) => (item.id === review.id ? { ...item, status: nextStatus } : item)))
    toast.success(nextStatus === 'visible' ? 'L’avis est de nouveau visible.' : 'L’avis a été masqué.')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await adminService.deleteReview(deleteTarget.shopId, deleteTarget.id)
    setReviews((current) => current.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success('L’avis a été supprimé.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Modération"
        title="Avis"
        description="Masquez un avis signalé ou rendez-le de nouveau visible sur les boutiques."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
            <Star size={17} /> {reviews.length} avis
          </span>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Avis reçus</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{reviews.length}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Visibles</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">{visibleCount}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Masqués</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content/50">{hiddenCount}</p>
        </article>
      </section>

      <section className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="search"
            placeholder="Rechercher un auteur, un commentaire, une boutique..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input w-full border-none bg-base-100 pl-11"
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="select w-full border-none bg-base-100 md:w-48">
          <option value="all">Tous les statuts</option>
          <option value="visible">Visibles</option>
          <option value="hidden">Masqués</option>
        </select>
      </section>

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="card overflow-hidden"><Loading /></div>
        ) : visible.length === 0 ? (
          <div className="card p-10 text-center">
            <Star size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucun avis trouvé</p>
          </div>
        ) : (
          visible.map((review) => (
            <article key={review.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                  {review.author.split(' ').map((part) => part[0]).join('')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-base-content">{review.author}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                      <Star size={12} className="fill-amber-500 text-amber-500" /> {review.note}/5
                    </span>
                    <StatusBadge status={review.status} label={review.status === 'visible' ? 'Visible' : 'Masqué'} />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-base-content/70">{review.comment}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-base-content/45">
                    <span className="inline-flex items-center gap-1.5">
                      <Store size={12} /> <Link to="/admin/boutiques" className="hover:text-brand">{review.shopName}</Link>
                    </span>
                    <span>{review.shopLocation}</span>
                    <span>{review.date}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {review.status === 'visible' ? (
                  <button onClick={() => toggleReview(review)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                    <EyeOff size={15} /> Masquer
                  </button>
                ) : (
                  <button onClick={() => toggleReview(review)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/20">
                    <Eye size={15} /> Rendre visible
                  </button>
                )}
                <button onClick={() => setDeleteTarget(review)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer l’avis">
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer l’avis"
        message={deleteTarget ? `L’avis de ${deleteTarget.author} sur ${deleteTarget.shopName} sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}