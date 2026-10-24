import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  MessageSquareText,
  Package,
  RefreshCw,
  ShoppingBag,
  Store,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantNotificationService } from '../services/merchantNotificationService.js'
import { PageHeader } from '../../../components/ui.jsx'
import { ListSkeleton } from '../../../../../components/skeletons'

const iconByKind = {
  shop: Store,
  alert: AlertTriangle,
  order: ShoppingBag,
  product: Package,
  message: MessageSquareText,
  system: BellRing,
  promotion: AlertTriangle,
}

const toneByKind = {
  shop: 'bg-brand/10 text-brand',
  alert: 'bg-rose-100 text-rose-600',
  order: 'bg-emerald-100 text-emerald-600',
  product: 'bg-orange-100 text-orange-600',
  message: 'bg-amber-100 text-amber-600',
  system: 'bg-blue-100 text-blue-600',
  promotion: 'bg-rose-100 text-rose-600',
}

const formatRelative = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return "À l'instant"
  if (diff < 3_600_000) return `Il y a ${Math.floor(diff / 60_000)} min`
  if (diff < 86_400_000) return `Il y a ${Math.floor(diff / 3_600_000)} h`
  const days = Math.floor(diff / 86_400_000)
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'read', label: 'Lues' },
]

const isNotificationRead = (notification) => Boolean(notification.read ?? notification.is_read)

export function MerchantNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true)
    else setLoading(true)
    try {
      const result = await merchantNotificationService.list()
      setNotifications(result)
      setError(false)
      if (result.some((notification) => !isNotificationRead(notification))) {
        try {
          await merchantNotificationService.markAllRead()
          setNotifications((current) =>
            current.map((notification) => ({ ...notification, is_read: true, read: true }))
          )
        } catch {
          // L'échec de marquage ne doit pas empêcher la consultation de la liste.
        }
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const unreadCount = notifications.filter((notification) => !isNotificationRead(notification)).length

  const filtered = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === 'unread') return !isNotificationRead(notification)
        if (filter === 'read') return isNotificationRead(notification)
        return true
      }),
    [notifications, filter]
  )

  const markRead = async (notification) => {
    if (isNotificationRead(notification)) return
    try {
      await merchantNotificationService.markRead(notification.id)
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, is_read: true, read: true } : item))
      )
    } catch {
      toast.error('Impossible de marquer la notification comme lue.')
    }
  }

  const markAllRead = async () => {
    if (unreadCount === 0) return
    try {
      await merchantNotificationService.markAllRead()
      setNotifications((current) => current.map((item) => ({ ...item, is_read: true, read: true })))
      toast.success('Toutes les notifications sont marquées comme lues.')
    } catch {
      toast.error('Impossible de marquer les notifications comme lues.')
    }
  }

  const removeNotification = async (notification) => {
    try {
      await merchantNotificationService.remove(notification.id)
      setNotifications((current) => current.filter((item) => item.id !== notification.id))
      toast.success('Notification supprimée.')
    } catch {
      toast.error('Impossible de supprimer la notification.')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace vendeur"
        title="Notifications"
        description="Suivez les alertes de votre boutique (ruptures de stock, commandes, messages...)."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => load({ silent: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-base-300 px-3 py-1.5 text-sm font-semibold text-base-content/70 transition hover:bg-base-100 disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Actualisation…' : 'Actualiser'}
            </button>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck size={16} />
              Tout marquer comme lu
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Notifications</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">{notifications.length}</p>
        </article>
        <article className="card p-4">
          <p className="text-sm font-medium text-base-content/60">Non lues</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-rose-600">{unreadCount}</p>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === option.value
                ? 'bg-brand text-white'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="card mt-5 p-4 sm:p-5">
        {loading ? (
          <ListSkeleton rows={5} lines={2} className="divide-y divide-base-200" itemClassName="" />
        ) : error ? (
          <div className="p-10 text-center">
            <Bell size={40} className="mx-auto opacity-30" />
            <p className="mt-2 font-semibold text-base-content">Impossible de charger les notifications</p>
            <p className="mt-1 text-sm text-base-content/50">Veuillez réessayer dans quelques instants.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Bell size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">
              {filter === 'all'
                ? 'Aucune notification pour le moment.'
                : filter === 'unread'
                  ? 'Aucune notification non lue.'
                  : 'Aucune notification lue.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-base-200">
            {filtered.map((notification) => {
              const kind = notification.kind || notification.type || 'system'
              const Icon = iconByKind[kind] ?? Bell
              const read = isNotificationRead(notification)
              return (
                <li key={notification.id} className="flex items-start gap-3 py-4 first:pt-1 last:pb-1">
                  <span
                    className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-full ${
                      toneByKind[kind] ?? 'bg-base-200 text-base-content/60'
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate ${read ? 'font-semibold text-base-content/70' : 'font-bold text-base-content'}`}>
                        {notification.title}
                      </p>
                      {!read && (
                        <span className="size-2 shrink-0 rounded-full bg-rose-500" aria-label="Non lue" />
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-base-content/60">{notification.message}</p>
                    <p className="mt-1 text-xs text-base-content/40">
                      {formatRelative(notification.time || notification.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!read && (
                      <button
                        type="button"
                        onClick={() => markRead(notification)}
                        title="Marquer comme lue"
                        className="rounded-full p-2 text-base-content/50 transition hover:bg-base-200 hover:text-brand"
                      >
                        <Check size={17} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNotification(notification)}
                      title="Supprimer"
                      className="rounded-full p-2 text-base-content/50 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
