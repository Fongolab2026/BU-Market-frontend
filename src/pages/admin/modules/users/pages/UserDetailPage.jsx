import { useEffect, useState } from 'react'
import { ArrowLeft, Ban, Building2, CheckCircle2, Clock3, Eye, EyeOff, LogIn, Mail, MapPin, MessageSquareText, Package, Phone, ShieldAlert, Star, Store, Trash2, UserPlus, UserRoundCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { utilisateursService } from '../services/utilisateursService.js'
import { produitsService } from '../../products/services/produitsService.js'
import { avisService } from '../../reviews/services/avisService.js'
import { boutiquesService } from '../../shops/services/boutiquesService.js'
import { StatusBadge } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

const roleLabel = { admin: 'Gestionnaire', merchant: 'Commerçant', client: 'Client' }

const timelineStyle = {
  account: { icon: UserPlus, className: 'bg-brand/10 text-brand' },
  shop: { icon: Store, className: 'bg-violet-100 text-violet-700' },
  validation: { icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700' },
  products: { icon: Package, className: 'bg-brand/10 text-brand' },
  reviews: { icon: Star, className: 'bg-amber-100 text-amber-700' },
  suspension: { icon: Ban, className: 'bg-rose-100 text-rose-700' },
  pending: { icon: Clock3, className: 'bg-amber-100 text-amber-700' },
  login: { icon: LogIn, className: 'bg-base-200 text-base-content/60' },
}

export function UserDetailPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => { utilisateursService.detail(userId).then(setUser) }, [userId])

  const updateStatus = async (status) => {
    setBusy(true)
    const nextUser = await utilisateursService.updateStatus(user.id, status)
    setUser({ ...nextUser })
    setBusy(false)
    toast.success(status === 'active' ? 'Le compte et la boutique ont été validés.' : 'Le compte a été suspendu.')
  }

  const toggleProduct = async (product) => {
    const nextStatus = product.status === 'active' ? 'inactive' : 'active'
    setBusy(true)
    const nextUser = await produitsService.updateStatus(user.shop.id, product.id, nextStatus)
    setUser({ ...nextUser })
    setBusy(false)
    toast.success(nextStatus === 'active' ? 'Le produit est de nouveau visible sur la plateforme.' : 'Le produit a été retiré de la plateforme.')
  }

  const toggleReview = async (review) => {
    const nextStatus = review.status === 'visible' ? 'hidden' : 'visible'
    setBusy(true)
    const nextUser = await avisService.updateStatus(user.shop.id, review.id, nextStatus)
    setUser({ ...nextUser })
    setBusy(false)
    toast.success(nextStatus === 'visible' ? 'L’avis est de nouveau visible.' : 'L’avis a été masqué.')
  }

  const handleDeleteShop = async () => {
    setBusy(true)
    const nextUser = await boutiquesService.remove(user.shop.id)
    setUser({ ...nextUser })
    setBusy(false)
    setConfirm(null)
    toast.success('La boutique a été supprimée.')
  }

  const handleDeleteUser = async () => {
    setBusy(true)
    await utilisateursService.remove(user.id)
    setBusy(false)
    setConfirm(null)
    toast.success('Le compte a été supprimé.')
    navigate('/admin/utilisateurs')
  }

  if (!user) return <ProfileSkeleton />

  return (
    <>
      <Link to="/admin/utilisateurs" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 transition hover:text-brand">
        <ArrowLeft size={17} /> Retour aux utilisateurs
      </Link>

      <IdentityCard user={user} />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {user.shop && <ShopCard shop={user.shop} />}
          {user.shop && <ProductsCard shop={user.shop} busy={busy} onToggle={toggleProduct} />}
          {user.shop && <ReviewsCard shop={user.shop} busy={busy} onToggle={toggleReview} />}
          {!user.shop && (
            <section className="card p-6 text-center">
              <p className="font-semibold text-base-content">Aucune boutique associée à ce compte.</p>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          <ActionsCard user={user} busy={busy} onValidate={() => updateStatus('active')} onSuspend={() => updateStatus('suspended')} />
          <DangerZone shopName={user.shop?.name} busy={busy} onDeleteShop={() => setConfirm('shop')} onDeleteUser={() => setConfirm('user')} />
        </aside>
      </div>

      <HistoryCard timeline={user.timeline} />

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm === 'shop' ? 'Supprimer la boutique' : 'Supprimer le compte'}
        message={confirm === 'shop' ? `La boutique « ${user.shop?.name} » sera supprimée. Cette action est définitive.` : `Le compte de ${user.firstName} ${user.lastName} sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        busy={busy}
        onConfirm={confirm === 'shop' ? handleDeleteShop : handleDeleteUser}
        onCancel={() => setConfirm(null)}
      />
    </>
  )
}

function IdentityCard({ user }) {
  return (
    <section className="card overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-brand via-brand-soft to-accent" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-soft text-base font-bold text-white shadow-md">
            {user.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-base-content sm:text-2xl">{user.firstName} {user.lastName}</h1>
              <UserRoundCheck size={19} className="text-brand" aria-label="Compte vérifié" />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">{roleLabel[user.role]}</span>
              <StatusBadge status={user.status} />
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-base-content/55">
              <MapPin size={15} /> {user.location}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-base-200 bg-base-200 sm:grid-cols-2 xl:grid-cols-4">
          <InfoItem icon={Mail} label="E-mail" value={user.email} />
          <InfoItem icon={Phone} label="Téléphone" value={user.phone} />
          <InfoItem icon={MapPin} label="Localisation" value={user.location} />
          <InfoItem icon={Clock3} label="Dernière activité" value={user.lastActive} />
        </div>

        <p className="mt-4 text-sm text-base-content/55">Compte créé le {user.joinedAt}</p>
      </div>
    </section>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-white p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-base-content/45">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold text-base-content/85">{value}</p>
      </div>
    </div>
  )
}

function ShopCard({ shop }) {
  const metrics = [
    { icon: Package, value: shop.products, label: 'Produits' },
    { icon: MessageSquareText, value: shop.messages, label: 'Messages' },
    { icon: Eye, value: shop.views, label: 'Vues' },
    { icon: Star, value: shop.rating || '-', label: 'Note / 5' },
  ]
  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-base-200 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Boutique associée</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-base-content">{shop.name}</h2>
            <StatusBadge status={shop.status} />
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">{shop.category}</span>
          </div>
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-sm">
          <Building2 size={20} />
        </span>
      </div>
      <div className="px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-base-content/70">{shop.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl bg-base-100 p-3.5">
              <metric.icon size={16} className="text-brand" />
              <p className="mt-2 text-lg font-bold text-base-content">{metric.value}</p>
              <p className="text-xs font-medium text-base-content/55">{metric.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-base-200 pt-4 text-sm text-base-content/55">
          Créée le {shop.createdAt}, {shop.reviewCount} avis reçus
        </p>
      </div>
    </section>
  )
}

function ProductsCard({ shop, busy, onToggle }) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold text-base-content">Produits de la boutique</h2>
          <p className="mt-1 text-sm text-base-content/55">Retirez ou réactivez un produit publié.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
          <Package size={16} /> {shop.productList.length}
        </span>
      </div>
      <div className="overflow-x-auto border-t border-base-200">
        <table className="w-full min-w-[620px] text-left">
          <thead>
            <tr className="bg-base-50 text-xs font-semibold uppercase tracking-wide text-base-content/45">
              <th className="px-5 py-3">Produit</th>
              <th className="px-5 py-3">Prix</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {shop.productList.map((product) => (
              <tr key={product.id} className="transition hover:bg-base-50">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-base-content">{product.name}</p>
                  <p className="mt-0.5 text-xs text-base-content/45">Publié le {product.date}</p>
                </td>
                <td className="px-5 py-3.5 font-semibold text-base-content">{product.price} F</td>
                <td className="px-5 py-3.5 text-sm text-base-content/70">{product.stock} en stock</td>
                <td className="px-5 py-3.5"><StatusBadge status={product.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  {product.status === 'active' ? (
                    <button disabled={busy} onClick={() => onToggle(product)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
                      <EyeOff size={15} /> Retirer
                    </button>
                  ) : (
                    <button disabled={busy} onClick={() => onToggle(product)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-60">
                      <Eye size={15} /> Réactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ReviewsCard({ shop, busy, onToggle }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-base-content">Avis de la boutique</h2>
          <p className="mt-1 text-sm text-base-content/55">Masquez ou affichez un avis signalé.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
          <Star size={16} /> {shop.reviewList.length}
        </span>
      </div>

      <div className="mt-4 divide-y divide-base-200">
        {shop.reviewList.map((review) => (
          <div key={review.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                {review.author.split(' ').map((part) => part[0]).join('')}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-base-content">{review.author}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                    <Star size={12} className="fill-amber-500 text-amber-500" /> {review.note}/5
                  </span>
                  <StatusBadge status={review.status} />
                </div>
                <p className="mt-1 text-sm leading-6 text-base-content/70">{review.comment}</p>
                <p className="mt-1 text-xs text-base-content/45">{review.date}</p>
              </div>
            </div>
            <div className="sm:shrink-0">
              {review.status === 'visible' ? (
                <button disabled={busy} onClick={() => onToggle(review)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
                  <EyeOff size={15} /> Masquer
                </button>
              ) : (
                <button disabled={busy} onClick={() => onToggle(review)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-2.5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-60">
                  <Eye size={15} /> Rendre visible
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ActionsCard({ user, busy, onValidate, onSuspend }) {
  return (
    <section className="card p-5">
      <h2 className="font-semibold text-base-content">Actions de gestion</h2>
      <p className="mt-1 text-sm leading-5 text-base-content/55">Choisissez l’état du compte et de sa boutique.</p>
      <div className="mt-4 space-y-2">
        {user.status !== 'active' && (
          <button disabled={busy} onClick={onValidate} className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:opacity-60">
            <CheckCircle2 size={17} /> Valider le compte
          </button>
        )}
        {user.status !== 'suspended' && (
          <button disabled={busy} onClick={onSuspend} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
            <Ban size={17} /> Suspendre le compte
          </button>
        )}
      </div>
    </section>
  )
}

function DangerZone({ shopName, busy, onDeleteShop, onDeleteUser }) {
  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex gap-3">
        <ShieldAlert className="shrink-0 text-rose-700" size={19} />
        <div>
          <h2 className="font-semibold text-rose-900">Zone sensible</h2>
          <p className="mt-1 text-sm leading-5 text-rose-800/80">Les actions ci-dessous sont définitives.</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {shopName && (
          <button disabled={busy} onClick={onDeleteShop} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
            <Trash2 size={17} /> Supprimer la boutique
          </button>
        )}
        <button disabled={busy} onClick={onDeleteUser} className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-60">
          <Trash2 size={17} /> Supprimer le compte
        </button>
      </div>
    </section>
  )
}

function HistoryCard({ timeline }) {
  return (
    <section className="card mt-4 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
          <Clock3 size={19} />
        </span>
        <div>
          <h2 className="font-semibold text-base-content">Historique</h2>
          <p className="mt-1 text-sm text-base-content/55">Les dernières actions liées à ce compte.</p>
        </div>
      </div>
      <div className="mt-5 space-y-0">
        {timeline.map((entry, index) => (
          <TimelineEntry key={entry.id} entry={entry} isLast={index === timeline.length - 1} />
        ))}
      </div>
    </section>
  )
}

function TimelineEntry({ entry, isLast }) {
  const { icon: Icon, className } = timelineStyle[entry.kind] || timelineStyle.account
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`grid size-8 shrink-0 place-items-center rounded-full ${className}`}>
          <Icon size={14} />
        </span>
        {!isLast && <span className="my-1 w-px flex-1 bg-base-200" />}
      </div>
      <div className={isLast ? 'pb-0 pt-1' : 'pb-6 pt-1'}>
        <p className="text-sm font-semibold text-base-content">{entry.label}</p>
        <p className="mt-0.5 text-xs text-base-content/50">{entry.date}</p>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 rounded-2xl bg-base-200" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-72 rounded-2xl bg-base-200" />
        <div className="h-64 rounded-2xl bg-base-200" />
      </div>
    </div>
  )
}