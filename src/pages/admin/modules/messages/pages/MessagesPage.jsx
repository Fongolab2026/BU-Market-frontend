import { useEffect, useState } from 'react'
import { CheckCheck, Mail, MailOpen, MessageSquareText, Search, Send, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { messagesService } from '../services/messagesService.js'
import { PageHeader } from '../../../components/ui.jsx'
import Avatar from '../../../../../components/Avatar.jsx'
import { ConversationListSkeleton } from '../../../../../components/skeletons'

export function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [thread, setThread] = useState([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
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
    setReply('')
    try {
      const [messages] = await Promise.all([
        messagesService.thread(conversation.id),
        conversation.unread > 0 ? messagesService.markRead(conversation.id) : Promise.resolve(),
      ])
      setThread(messages)
      if (conversation.unread > 0) {
        setConversations((current) => current.map((item) => (item.id === conversation.id ? { ...item, unread: 0, status: 'closed' } : item)))
      }
    } catch {
      toast.error('Impossible de charger cette conversation.')
    }
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!selected || !reply.trim()) return
    setSending(true)
    try {
      await messagesService.send(selected.id, reply.trim())
      const updatedThread = await messagesService.thread(selected.id)
      setThread(updatedThread)
      setReply('')
      setConversations((current) => current.map((item) => item.id === selected.id
        ? { ...item, message: reply.trim(), time: "À l'instant" }
        : item))
      toast.success('Réponse envoyée. L’utilisateur recevra une notification.')
    } catch {
      toast.error("Impossible d'envoyer la réponse.")
    } finally {
      setSending(false)
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
              <ConversationListSkeleton rows={6} />
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
                  <Avatar
                    src={conversation.avatar}
                    name={conversation.sender}
                    alt=""
                    className={`size-10 shrink-0 rounded-full text-xs font-bold ${conversation.unread > 0 ? 'bg-brand text-white' : 'bg-brand/10 text-brand'}`}
                  />
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

        <div className="flex min-h-[560px] min-w-0 flex-1 flex-col rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:p-5">
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-base-300 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selected.avatar}
                    name={selected.sender}
                    alt=""
                    className="size-11 shrink-0 rounded-full bg-brand text-sm font-bold text-white"
                  />
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
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-5">
                {thread.map((message) => (
                  <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] break-words rounded-2xl px-4 py-3 shadow-sm ${message.from === 'me' ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm border border-base-300 bg-(--surface) text-base-content'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                      <p className={`mt-1 text-right text-[11px] ${message.from === 'me' ? 'text-white/65' : 'text-base-content/45'}`}>{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-base-300 pt-4">
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={2}
                  maxLength={5000}
                  placeholder="Écrivez votre réponse…"
                  aria-label="Votre réponse"
                  className="textarea textarea-bordered min-h-12 flex-1 resize-y bg-(--surface) text-sm text-base-content placeholder:text-base-content/45"
                />
                <button type="submit" disabled={!reply.trim() || sending} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50">
                  <Send size={16} /> <span className="hidden sm:inline">Répondre</span>
                </button>
              </form>
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
