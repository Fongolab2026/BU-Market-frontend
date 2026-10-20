import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCheck,
  ChevronLeft,
  Inbox,
  Loader2,
  MailOpen,
  MessageSquareText,
  Search,
  Send,
  Store,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { merchantMessageService } from '../services/merchantMessageService.js'
import { PageHeader } from '../../../components/ui.jsx'
import Avatar from '../../../../../components/Avatar.jsx'
import { ConversationListSkeleton } from '../../../../../components/skeletons'

const formatBadge = (count) => (count > 99 ? '99+' : count)
const plural = (count, singular, pluralForm) =>
  `${count} ${count > 1 ? pluralForm : singular}`

export function MerchantMessagesPage() {
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)
  const threadRef = useRef(null)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      setConversations(await merchantMessageService.list())
    } catch {
      setError(true)
      toast.error('Impossible de charger vos messages.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const unreadCount = conversations.reduce(
    (total, conversation) => total + (Number(conversation.unread) || 0),
    0,
  )
  const selected =
    conversations.find((conversation) => conversation.id === selectedId) || null

  useEffect(() => {
    const node = threadRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [selectedId, selected?.thread?.length])

  const filtered = conversations.filter((conversation) => {
    const threadText = (conversation.thread || [])
      .map((message) => message.content)
      .join(' ')
    const text = `${conversation.sender} ${conversation.shop} ${conversation.message} ${threadText}`.toLowerCase()
    return !search.trim() || text.includes(search.trim().toLowerCase())
  })

  const openConversation = (conversation) => {
    if (conversation.id === selectedId) return
    setSelectedId(conversation.id)
    setDraft('')
    if (conversation.unread > 0) {
      merchantMessageService
        .markRead(conversation.id)
        .then(() => {
          setConversations((current) =>
            current.map((item) =>
              item.id === conversation.id ? { ...item, unread: 0 } : item,
            ),
          )
        })
        .catch(() => {})
    }
  }

  const markAll = async () => {
    if (unreadCount === 0) return
    try {
      await merchantMessageService.markAllRead()
      setConversations((current) =>
        current.map((item) => ({ ...item, unread: 0 })),
      )
      toast.success('Tous les messages sont marqués comme lus.')
    } catch {
      toast.error('Impossible de marquer les messages comme lus.')
    }
  }

  const sendReply = async (event) => {
    event.preventDefault()
    const content = draft.trim()
    if (!selected || !content || sending) return
    setSending(true)
    try {
      const updated = await merchantMessageService.send(selected.id, content)
      if (updated) {
        setConversations((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
      }
      setDraft('')
      toast.success('Votre réponse a été envoyée.')
    } catch {
      toast.error("Impossible d'envoyer votre message.")
    } finally {
      setSending(false)
    }
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace vendeur"
        title="Messages"
        description="Échangez avec vos clients et l’équipe de la plateforme."
        action={
          <span
            aria-live="polite"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${
              unreadCount > 0
                ? 'bg-primary/10 text-primary ring-primary/15'
                : 'bg-base-200/70 text-base-content/55 ring-base-300/70'
            }`}
          >
            <MessageSquareText size={17} />
            {unreadCount > 0
              ? `${formatBadge(unreadCount)} non lu${unreadCount > 1 ? 's' : ''}`
              : 'Tout est lu'}
          </span>
        }
      />

      <div className="card mt-5 flex h-[calc(100dvh-11rem)] min-h-[540px] flex-col overflow-hidden p-0 lg:h-[calc(100dvh-13rem)] lg:flex-row">
        <aside
          className={`${
            selected ? 'hidden lg:flex' : 'flex'
          } min-h-0 w-full flex-col border-b border-base-200 lg:w-[340px] lg:shrink-0 lg:border-b-0 lg:border-r`}
        >
          <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
            <div>
              <p className="text-sm font-bold text-base-content">Boîte de réception</p>
              <p className="mt-1 text-xs text-base-content/45">
                {conversations.length === 0
                  ? 'Aucune conversation'
                  : plural(conversations.length, 'conversation', 'conversations')}
                {unreadCount > 0 &&
                  ` · ${formatBadge(unreadCount)} non lu${unreadCount > 1 ? 's' : ''}`}
              </p>
            </div>
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageSquareText size={17} />
            </span>
          </div>

          <div className="px-3 sm:px-4">
            <label className="relative block">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/35"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un échange…"
                aria-label="Rechercher une conversation"
                className="input h-11 w-full border-base-200 bg-base-100 pl-10 pr-10 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-base-content/40 transition hover:bg-base-200 hover:text-base-content"
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>

          <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-3 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/35">
              Conversations
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                title="Tout marquer comme lu"
                aria-label="Tout marquer comme lu"
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/10"
              >
                <CheckCheck size={14} />
                <span className="hidden sm:inline">Tout marquer</span>
              </button>
            )}
          </div>

          <div className="aside-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-3 sm:px-3">
            {loading ? (
              <ConversationListSkeleton rows={6} className="space-y-1" />
            ) : error ? (
              <div className="flex h-full min-h-56 flex-col items-center justify-center px-5 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                  <AlertCircle size={22} />
                </span>
                <p className="mt-3 text-sm font-semibold">Impossible de charger vos messages</p>
                <p className="mt-1 text-xs leading-5 text-base-content/50">
                  Vérifiez votre connexion puis réessayez.
                </p>
                <button
                  type="button"
                  onClick={loadConversations}
                  className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content transition hover:bg-primary/90"
                >
                  Réessayer
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-full min-h-56 flex-col items-center justify-center px-5 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-base-200 text-base-content/35">
                  {search ? <Search size={22} /> : <Inbox size={22} />}
                </span>
                <p className="mt-3 text-sm font-semibold">
                  {search ? 'Aucun résultat' : 'Aucune conversation'}
                </p>
                <p className="mt-1 max-w-[220px] text-xs leading-5 text-base-content/50">
                  {search
                    ? `Aucun échange ne correspond à « ${search} ».`
                    : 'Vos échanges avec les clients apparaîtront ici.'}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-4 rounded-full bg-base-200 px-3.5 py-1.5 text-xs font-semibold text-base-content/65 transition hover:bg-base-300"
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>
            ) : (
              filtered.map((conversation) => {
                const lastMessage =
                  conversation.thread?.at(-1)?.content ||
                  conversation.message ||
                  'Aucun message'
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => openConversation(conversation)}
                    aria-pressed={selectedId === conversation.id}
                    className={`group relative flex w-full items-start gap-3 rounded-2xl px-2.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                      selectedId === conversation.id
                        ? 'bg-primary/[0.07] ring-1 ring-inset ring-primary/15'
                        : 'hover:bg-base-200/60'
                    }`}
                  >
                    {selectedId === conversation.id && (
                      <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />
                    )}
                    <Avatar
                      src={conversation.avatar}
                      name={conversation.sender}
                      alt=""
                      className={`size-11 shrink-0 rounded-full text-xs font-bold ${
                        conversation.unread > 0
                          ? 'bg-primary text-primary-content ring-2 ring-primary/15'
                          : 'bg-primary/10 text-primary'
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span
                          className={`truncate text-sm ${
                            conversation.unread > 0
                              ? 'font-bold text-base-content'
                              : 'font-semibold text-base-content/85'
                          }`}
                        >
                          {conversation.sender}
                        </span>
                        <span className="shrink-0 text-[10px] font-medium text-base-content/35">
                          {conversation.time}
                        </span>
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[11px] text-base-content/45">
                        <Store size={11} className="shrink-0" />
                        <span className="truncate">{conversation.shop || 'Boutique'}</span>
                      </span>
                      <span
                        className={`mt-1 block truncate text-xs leading-5 ${
                          conversation.unread > 0
                            ? 'font-medium text-base-content/70'
                            : 'text-base-content/50'
                        }`}
                      >
                        {lastMessage}
                      </span>
                    </span>
                    {conversation.unread > 0 && (
                      <span className="mt-0.5 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-content">
                        {formatBadge(conversation.unread)}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section
          className={`${
            selected ? 'flex' : 'hidden lg:flex'
          } min-h-0 min-w-0 flex-1 flex-col bg-base-200/30`}
        >
          {selected ? (
            <>
              <header className="flex items-center gap-3 border-b border-base-200 bg-base-100/80 px-3 py-3.5 backdrop-blur sm:px-5">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Retour aux conversations"
                  className="grid size-9 shrink-0 place-items-center rounded-full text-base-content/55 transition hover:bg-base-200 hover:text-base-content lg:hidden"
                >
                  <ChevronLeft size={20} />
                </button>
                <Avatar
                  src={selected.avatar}
                  name={selected.sender}
                  alt=""
                  className="size-11 shrink-0 rounded-full bg-primary text-sm font-bold text-primary-content"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-base-content">{selected.sender}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-base-content/50">
                    <Store size={12} className="shrink-0" />
                    <span className="truncate">{selected.shop || 'Boutique'}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-inset ring-primary/15">
                  <MessageSquareText size={13} />
                  {selected.thread?.length || 0} message
                  {(selected.thread?.length || 0) > 1 ? 's' : ''}
                </span>
              </header>

              <div
                ref={threadRef}
                role="log"
                aria-live="polite"
                className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
              >
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-base-content/30">
                  <span className="h-px flex-1 bg-base-300/60" />
                  Conversation
                  <span className="h-px flex-1 bg-base-300/60" />
                </div>
                {selected.thread?.length ? (
                  selected.thread.map((message, index) => (
                    <div
                      key={`${message.time}-${index}`}
                      className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[72%] ${
                          message.from === 'me'
                            ? 'rounded-br-md bg-primary text-primary-content'
                            : 'rounded-bl-md border border-base-200 bg-base-100 text-base-content'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            message.from === 'me'
                              ? 'text-primary-content/65'
                              : 'text-base-content/35'
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-10 text-center text-sm text-base-content/45">
                    Aucun message dans cette conversation.
                  </p>
                )}
              </div>

              <form
                onSubmit={sendReply}
                className="border-t border-base-200 bg-base-100/90 p-3 sm:p-4"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-base-300/80 bg-base-100 p-1.5 shadow-sm transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={1}
                    disabled={sending}
                    placeholder="Écrivez votre réponse…"
                    aria-label="Votre réponse"
                    className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-base-content placeholder:text-base-content/35 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    aria-label={sending ? 'Envoi en cours' : 'Envoyer le message'}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-content shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span className="hidden sm:inline">{sending ? 'Envoi…' : 'Envoyer'}</span>
                  </button>
                </div>
                <p className="mt-2 hidden px-1 text-[10px] text-base-content/35 sm:block">
                  Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne
                </p>
              </form>
            </>
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
              <span className="grid size-16 place-items-center rounded-[1.75rem] bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15">
                <MessageSquareText size={30} />
              </span>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-base-content">
                Sélectionnez une conversation
              </h2>
              <p className="mt-1 max-w-xs text-sm leading-6 text-base-content/50">
                Choisissez un client dans la liste pour lire vos échanges et lui répondre.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-base-100 px-3 py-1.5 text-[11px] font-medium text-base-content/45 ring-1 ring-base-300/70">
                <MailOpen size={13} /> Conversations synchronisées
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
