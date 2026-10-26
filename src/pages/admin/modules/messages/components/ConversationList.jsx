import { AlertCircle, CheckCheck, Inbox, MessageSquareText, Search, Store, X } from 'lucide-react'
import Avatar from '../../../../../components/Avatar.jsx'
import { ConversationListSkeleton } from '../../../../../components/skeletons'
import { formatBadge, plural } from './messageUtils.js'

/** Colonne de gauche : recherche + liste des conversations. */
export default function ConversationList({
  conversations,
  filtered,
  loading,
  error,
  search,
  onSearchChange,
  selectedId,
  unreadCount,
  onOpen,
  onRetry,
  onMarkAll,
}) {
  return (
    <aside
      className={`${
        selectedId ? 'hidden lg:flex' : 'flex'
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher un commerçant…"
            aria-label="Rechercher une conversation"
            className="input h-11 w-full border-base-200 bg-base-100 pl-10 pr-10 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
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
            onClick={onMarkAll}
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
            <p className="mt-3 text-sm font-semibold">Impossible de charger les messages</p>
            <p className="mt-1 text-xs leading-5 text-base-content/50">
              Vérifiez votre connexion puis réessayez.
            </p>
            <button
              type="button"
              onClick={onRetry}
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
                : 'Les échanges avec les commerçants apparaîtront ici.'}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="mt-4 rounded-full bg-base-200 px-3.5 py-1.5 text-xs font-semibold text-base-content/65 transition hover:bg-base-300"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          filtered.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onOpen(conversation)}
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
                  {conversation.message || 'Aucun message'}
                </span>
              </span>
              {conversation.unread > 0 && (
                <span className="mt-0.5 grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-content">
                  {formatBadge(conversation.unread)}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
