import {
  AlertCircle,
  ChevronLeft,
  Loader2,
  Mail,
  MailOpen,
  MessageSquareText,
  Send,
  Store,
} from 'lucide-react'
import Avatar from '../../../../../components/Avatar.jsx'
import { Skeleton } from '../../../../../components/skeletons'

/** Colonne de droite : en-tête, fil de messages et composeur. */
export default function ThreadPane({
  selected,
  thread,
  threadLoading,
  threadError,
  user,
  draft,
  onDraftChange,
  sending,
  threadRef,
  onClose,
  onRetry,
  onSend,
  onComposerKeyDown,
}) {
  return (
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
              onClick={onClose}
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
              {selected.unread > 0 ? <Mail size={13} /> : <MailOpen size={13} />}
              {selected.unread > 0 ? 'Non lu' : 'Lu'}
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
            {threadLoading ? (
              <div className="space-y-4">
                <Skeleton rounded="rounded-2xl" className="h-16 w-2/3" />
                <Skeleton rounded="rounded-2xl" className="ml-auto h-20 w-3/4" />
                <Skeleton rounded="rounded-2xl" className="h-14 w-1/2" />
              </div>
            ) : threadError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
                  <AlertCircle size={22} />
                </span>
                <p className="mt-3 text-sm font-semibold">Conversation indisponible</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content transition hover:bg-primary/90"
                >
                  Réessayer
                </button>
              </div>
            ) : thread.length ? (
              thread.map((message) => {
                const isMine = message.sender === user?.id
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[72%] ${
                        isMine
                          ? 'rounded-br-md bg-primary text-primary-content'
                          : 'rounded-bl-md border border-base-200 bg-base-100 text-base-content'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          isMine
                            ? 'text-primary-content/65'
                            : 'text-base-content/35'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="py-10 text-center text-sm text-base-content/45">
                Aucun message dans cette conversation.
              </p>
            )}
          </div>

          <form
            onSubmit={onSend}
            className="border-t border-base-200 bg-base-100/90 p-3 sm:p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-base-300/80 bg-base-100 p-1.5 shadow-sm transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
              <textarea
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                onKeyDown={onComposerKeyDown}
                rows={1}
                disabled={sending}
                placeholder="Écrivez votre réponse…"
                aria-label="Votre réponse"
                className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-sm text-base-content placeholder:text-base-content/35 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sending || threadLoading || threadError}
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
            Choisissez un commerçant dans la liste pour consulter l’échange et répondre.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-base-100 px-3 py-1.5 text-[11px] font-medium text-base-content/45 ring-1 ring-base-300/70">
            <MailOpen size={13} /> Conversations synchronisées
          </div>
        </div>
      )}
    </section>
  )
}
