import { useCallback, useEffect, useState } from 'react'
import { Bell, CheckCheck, MessageSquareText } from 'lucide-react'
import toast from 'react-hot-toast'
import NavBar from '../Composants/nav'
import Footer from '../Composants/Footer'
import { notificationApi } from '../../services'

const loadNotifications = async () => {
  const notifications = []
  let page = 1
  let hasNextPage = true
  while (hasNextPage) {
    const { data } = await notificationApi.list({ page })
    const results = Array.isArray(data) ? data : data?.results ?? []
    notifications.push(...results)
    hasNextPage = !Array.isArray(data) && Boolean(data?.next)
    page += 1
  }
  return notifications
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function BuyerNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setNotifications(await loadNotifications())
    } catch {
      toast.error('Impossible de charger les notifications.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const markRead = async (item) => {
    if (item.is_read) return
    try {
      await notificationApi.markRead(item.id)
      setNotifications((current) => current.map((notification) => (
        notification.id === item.id ? { ...notification, is_read: true, read: true } : notification
      )))
    } catch {
      toast.error('Impossible de marquer cette notification comme lue.')
    }
  }

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead()
      setNotifications((current) => current.map((item) => ({ ...item, is_read: true, read: true })))
      toast.success('Toutes les notifications sont marquées comme lues.')
    } catch {
      toast.error('Impossible de marquer les notifications comme lues.')
    }
  }

  const unreadCount = notifications.filter((item) => !(item.is_read ?? item.read)).length

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Bell size={22} /></span>
            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Mes notifications</h1>
              <p className="mt-1 text-sm text-base-content/55">Restez informé des réponses et de l’activité de votre compte.</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/75 transition hover:bg-base-200">
              <CheckCheck size={17} /> Tout marquer comme lu
            </button>
          )}
        </div>

        <section className="mt-7 space-y-3" aria-live="polite">
          {loading ? (
            <div className="rounded-2xl border border-base-300 bg-(--surface) p-8 text-center text-sm text-base-content/55">Chargement des notifications…</div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-(--surface) p-10 text-center">
              <Bell size={34} className="mx-auto text-base-content/25" />
              <p className="mt-3 font-semibold">Aucune notification pour le moment</p>
            </div>
          ) : notifications.map((item) => {
            const read = Boolean(item.is_read ?? item.read)
            const isMessage = (item.type || item.kind) === 'message'
            return (
              <article key={item.id} className={`flex items-start gap-3 rounded-2xl border bg-(--surface) p-4 transition sm:gap-4 sm:p-5 ${read ? 'border-base-300' : 'border-primary/35 shadow-sm shadow-primary/5'}`}>
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${isMessage ? 'bg-primary/10 text-primary' : 'bg-base-200 text-base-content/65'}`}>
                  {isMessage ? <MessageSquareText size={19} /> : <Bell size={19} />}
                </span>
                <button type="button" onClick={() => markRead(item)} className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{item.title}</h2>
                    {!read && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">Nouveau</span>}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-base-content/65">{item.message}</p>
                  <p className="mt-2 text-xs text-base-content/45">{formatDate(item.created_at || item.time)}</p>
                </button>
              </article>
            )
          })}
        </section>
      </main>
      <Footer />
    </div>
  )
}
