import { useEffect, useState } from 'react'
import { CheckCheck, Mail, MailOpen, MessageSquareText, Search, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { messagesService } from '../services/messagesService.js'
import { PageHeader } from '../../../components/ui.jsx'

export function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    messagesService.list().then((result) => {
      setConversations(result)
      setLoading(false)
    })
  }, [])

  const unreadCount = conversations.filter((conversation) => conversation.unread > 0).length
  const selected = conversations.find((conversation) => conversation.id === selectedId) || null

  const filtered = conversations.filter((conversation) => {
    const text = `${conversation.sender} ${conversation.shop} ${conversation.message}`.toLowerCase()
    return !search.trim() || text.includes(search.trim().toLowerCase())
  })

  const openConversation = async (conversation) => {
    setSelectedId(conversation.id)
    if (conversation.unread > 0) {
      const updated = await messagesService.markRead(conversation.id)
      setConversations((current) => current.map((item) => (item.id === updated.id ? { ...item, unread: 0, status: 'closed' } : item)))
    }
  }

  const markAll = async () => {
    const result = await messagesService.markAllRead()
    setConversations(result.map((item) => ({ ...item, unread: 0 })))
    toast.success('Tous les messages sont marqués comme lus.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Commerce"
        title="Messages"
        description="Consultez les échanges entre les commerçants et la plateforme."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand">
              <MessageSquareText size={17} /> {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        }
      />

      <div className="card mt-5 flex flex-col gap-4 p-4 lg:flex-row lg:items-stretch">
        <div className="w-full lg:max-w-sm lg:shrink-0">
          <div className="relative mb-3">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="search"
              placeholder="Rechercher un commerçant..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input w-full border-none bg-base-100 pl-11"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Conversations</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAll} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-soft">
                <CheckCheck size={14} /> Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="mt-2 max-h-[480px] space-y-1.5 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center gap-3 p-8 text-sm text-base-content/50">
                <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <p className="p-6 text-center text-sm text-base-content/50">Aucun message</p>
            ) : (
              filtered.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => openConversation(conversation)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === conversation.id ? 'border-brand bg-brand/5' : 'border-transparent hover:bg-base-100'}`}
                >
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold ${conversation.unread > 0 ? 'bg-brand text-white' : 'bg-brand/10 text-brand'}`}>
                    {conversation.avatar}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${conversation.unread > 0 ? 'font-bold text-base-content' : 'font-semibold text-base-content/80'}`}>{conversation.sender}</span>
                      <span className="shrink-0 text-[11px] text-base-content/45">{conversation.time}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-base-content/55">
                      <Store size={11} /> {conversation.shop}
                    </span>
                  </span>
                  {conversation.unread > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">{conversation.unread}</span>}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-2xl border border-base-200 bg-base-50 p-6">
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{selected.avatar}</span>
                  <div>
                    <p className="flex items-center gap-1.5 font-bold text-base-content">
                      {selected.sender}
                      {selected.unread > 0 && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">Nouveau</span>}
                    </p>
                    <p className="text-sm text-base-content/60">{selected.shop}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                  {selected.unread > 0 ? <Mail size={13} /> : <MailOpen size={13} />}
                  {selected.unread > 0 ? 'Non lu' : 'Lu'}
                </span>
              </div>
              <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm leading-6 text-base-content/80">{selected.message}</p>
                <p className="mt-2 text-xs text-base-content/40">{selected.time}</p>
              </div>
              <p className="mt-6 text-sm text-base-content/55">La réponse sera transmise à ce commerçant depuis l’interface de gestion.</p>
            </>
          ) : (
            <div className="grid h-full min-h-64 place-items-center text-center">
              <div>
                <MailOpen size={40} className="mx-auto opacity-30" />
                <p className="mt-2 text-sm text-base-content/50">Sélectionnez une conversation pour l’ouvrir</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}