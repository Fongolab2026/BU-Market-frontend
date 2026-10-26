import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import toast from 'react-hot-toast'
import { messagesService } from '../services/messagesService.js'
import { PageHeader } from '../../../components/ui.jsx'
import { useAuth } from '../../../../../context/AuthContext.jsx'
import ConversationList from '../components/ConversationList.jsx'
import ThreadPane from '../components/ThreadPane.jsx'
import { formatBadge } from '../components/messageUtils.js'

export function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [threadLoading, setThreadLoading] = useState(false)
  const [threadError, setThreadError] = useState(false)
  const [threadReloadToken, setThreadReloadToken] = useState(0)
  const [sending, setSending] = useState(false)
  const threadRef = useRef(null)
  const selectedIdRef = useRef(null)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      setConversations(await messagesService.list())
    } catch {
      setError(true)
      toast.error('Impossible de charger les messages.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (!selectedId) {
      setThread([])
      setThreadError(false)
      setThreadLoading(false)
      return undefined
    }
    let active = true
    setThreadLoading(true)
    setThreadError(false)
    messagesService
      .thread(selectedId)
      .then((messages) => {
        if (active) setThread(messages)
      })
      .catch(() => {
        if (active) setThreadError(true)
      })
      .finally(() => {
        if (active) setThreadLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedId, threadReloadToken])

  useEffect(() => {
    const node = threadRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [selectedId, thread.length])

  const unreadCount = conversations.reduce(
    (total, conversation) => total + (Number(conversation.unread) || 0),
    0,
  )
  const selected =
    conversations.find((conversation) => conversation.id === selectedId) || null

  const filtered = conversations.filter((conversation) => {
    const text = `${conversation.sender} ${conversation.shop} ${conversation.message}`.toLowerCase()
    return !search.trim() || text.includes(search.trim().toLowerCase())
  })

  const openConversation = (conversation) => {
    if (conversation.id === selectedId) return
    selectedIdRef.current = conversation.id
    setSelectedId(conversation.id)
    setThread([])
    setThreadLoading(true)
    setThreadError(false)
    setDraft('')
    if (conversation.unread > 0) {
      messagesService
        .markRead(conversation.id)
        .then(() => {
          setConversations((current) =>
            current.map((item) =>
              item.id === conversation.id
                ? { ...item, unread: 0, status: 'closed' }
                : item,
            ),
          )
        })
        .catch(() => {})
    }
  }

  const closeConversation = () => {
    selectedIdRef.current = null
    setSelectedId(null)
  }

  const markAll = async () => {
    try {
      await messagesService.markAllRead()
      setConversations((current) =>
        current.map((item) => ({ ...item, unread: 0, status: 'closed' })),
      )
      toast.success('Tous les messages sont marqués comme lus.')
    } catch {
      toast.error('Impossible de marquer les messages comme lus.')
    }
  }

  const sendReply = async (event) => {
    event.preventDefault()
    const content = draft.trim()
    if (!selected || !content || sending || threadLoading || threadError) return
    const targetId = selected.id
    setSending(true)
    try {
      const sent = await messagesService.send(targetId, content)
      if (selectedIdRef.current === targetId) {
        setThread((current) => [...current, sent])
      }
      setConversations((current) =>
        current.map((item) =>
          item.id === targetId
            ? { ...item, message: content, time: 'À l’instant', unread: 0 }
            : item,
        ),
      )
      if (selectedIdRef.current === targetId) setDraft('')
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
        eyebrow="Commerce"
        title="Messages"
        description="Consultez et poursuivez les échanges avec les commerçants de la plateforme."
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
        <ConversationList
          conversations={conversations}
          filtered={filtered}
          loading={loading}
          error={error}
          search={search}
          onSearchChange={setSearch}
          selectedId={selectedId}
          unreadCount={unreadCount}
          onOpen={openConversation}
          onRetry={loadConversations}
          onMarkAll={markAll}
        />

        <ThreadPane
          selected={selected}
          thread={thread}
          threadLoading={threadLoading}
          threadError={threadError}
          user={user}
          draft={draft}
          onDraftChange={setDraft}
          sending={sending}
          threadRef={threadRef}
          onClose={closeConversation}
          onRetry={() => setThreadReloadToken((value) => value + 1)}
          onSend={sendReply}
          onComposerKeyDown={handleComposerKeyDown}
        />
      </div>
    </>
  )
}
