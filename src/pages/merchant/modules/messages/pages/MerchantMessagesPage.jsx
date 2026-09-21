import { useEffect, useState } from 'react'
import { CheckCheck, MailOpen, MessageSquareText, Search, Send, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantMessageService } from '../services/merchantMessageService.js'
import { PageHeader } from '../../../components/ui.jsx'

export function MerchantMessagesPage() {
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    merchantMessageService.list().then((result) => {
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

  const openConversation = (conversation) => {
    setSelectedId(conversation.id)
    setDraft('')
    if (conversation.unread > 0) {
      merchantMessageService.markRead(conversation.id).then((updated) => {
        setConversations((current) => current.map((item) => (item.id === updated.id ? { ...item, unread: 0 } : item)))
      })
    }
  }

  const markAll = async () => {
    for (const conversation of conversations.filter((item) => item.unread > 0)) {
      await merchantMessageService.markRead(conversation.id)
    }
    setConversations((current) => current.map((item) => ({ ...item, unread: 0 })))
    toast.success('Tous les messages sont marqués comme lus.')
  }

  const sendReply = async (event) => {
    event.preventDefault()
    if (!selected || !draft.trim()) return
    setSending(true)
    const updated = await merchantMessageService.send(selected.id, draft.trim())
    setSending(false)
    setDraft('')
    setConversations((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    toast.success('Votre réponse a été envoyée.')
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace vendeur"
        title="Messages"
        description="Échangez avec vos clients et l’équipe de la plateforme."
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
              placeholder="Rechercher un échange..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input input-bordered w-full pl-11"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">Conversations</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAll} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-soft">
                <CheckCheck size={14} /> Tout marquer
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

        <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-base-200 bg-base-50">
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-base-200 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{selected.avatar}</span>
                  <div>
                    <p className="font-bold text-base-content">{selected.sender}</p>
                    <p className="text-sm text-base-content/60">{selected.shop}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                  <MailOpen size={13} /> Conversation
                </span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {selected.thread.map((item, index) => (
                  <div key={index} className={`flex ${item.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${item.from === 'me' ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm border border-base-200 bg-white'}`}>
                      <p className="text-sm leading-6">{item.content}</p>
                      <p className={`mt-1 text-[11px] ${item.from === 'me' ? 'text-white/60' : 'text-base-content/40'}`}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-base-200 bg-white p-3">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={1}
                  placeholder="Écrivez votre réponse…"
                  className="textarea textarea-bordered max-h-32 min-h-10 flex-1 resize-none text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} /> Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="grid h-full min-h-64 place-items-center text-center">
              <div>
                <MailOpen size={40} className="mx-auto opacity-30" />
                <p className="mt-2 text-sm text-base-content/50">Sélectionnez une conversation pour répondre</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}