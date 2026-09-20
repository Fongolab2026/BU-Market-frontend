import { useEffect, useState } from 'react'
import { AlertTriangle, BellRing, CheckCheck, MessageSquareText, Package, ShoppingBag, Store, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { notificationsService } from '../services/notificationsService.js'
import { PageHeader } from '../../../components/ui.jsx'
import { ConfirmDialog } from '../../../components/ConfirmDialog.jsx'

const iconByKind = { shop: Store, alert: AlertTriangle, order: ShoppingBag, product: Package, message: MessageSquareText }
const toneByKind = { shop: 'bg-brand/10 text-brand', alert: 'bg-rose-50 text-rose-600', order: 'bg-emerald-50 text-emerald-600', product: 'bg-violet-50 text-violet-600', message: 'bg-amber-50 text-amber-600' }

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    notificationsService.list().then((result) => {
      setNotifications(result)
      setLoading(false)
    })
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length
  const filtered = notifications.filter((notification) => filter === 'all' || (filter === 'unread' && !notification.read) || (filter === 'read' && notification.read))

  const markRead = async (notification) => {
    if (!notification.read) {
      const updated = await notificationsService.markRead(notification.id)
      setNotifications((current) => current.map((item) => (item.id === updated.id ? { ...item, read: true } : item)))
    }
  }

  const markAll = async () => {
    for (const notification of notifications.filter((item) => !item.read)) {
      await notificationsService.markRead(notification.id)
    }
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
    toast.success('Toutes les notifications sont marquées comme lues.')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await notificationsService.remove(deleteTarget.id)
    setNotifications((current) => current.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success('Notification supprimée.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Système"
        title="Notifications"
        description="Toutes les alertes liées à la vie de la plateforme."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
              <BellRing size={17} /> {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAll} className="inline-flex items-center gap-2 rounded-lg border border-base-300 bg-white px-3 py-1.5 text-sm font-semibold text-base-content/70 transition hover:bg-base-100">
                <CheckCheck size={17} /> Tout marquer comme lu
              </button>
            )}
          </div>
        }
      />

      <div className="card mt-5 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-base-content/55">{unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} à consulter.` : 'Vous êtes à jour.'}</p>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="select w-full border-none bg-base-100 md:w-52">
          <option value="all">Toutes</option>
          <option value="unread">Non lues</option>
          <option value="read">Lues</option>
        </select>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="card flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            Chargement des notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <BellRing size={40} className="mx-auto opacity-30" />
            <p className="mt-2 text-sm text-base-content/50">Aucune notification</p>
          </div>
        ) : (
          filtered.map((notification) => {
            const Icon = iconByKind[notification.kind]
            return (
              <article key={notification.id} className={`card flex items-start gap-3 p-4 transition ${notification.read ? 'opacity-65' : 'ring-2 ring-brand/15'}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${toneByKind[notification.kind]}`}>
                  <Icon size={18} />
                </span>
                <button type="button" onClick={() => markRead(notification)} className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-base-content">{notification.title}</p>
                    {!notification.read && (
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-brand" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-5 text-base-content/60">{notification.description}</p>
                  <p className="mt-2 text-xs text-base-content/45">{notification.time}</p>
                </button>
                <button onClick={() => setDeleteTarget(notification)} className="rounded-lg p-2 text-base-content/40 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Supprimer la notification">
                  <Trash2 size={16} />
                </button>
              </article>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Supprimer la notification"
        message={deleteTarget ? `La notification « ${deleteTarget.title} » sera définitivement supprimée.` : ''}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}