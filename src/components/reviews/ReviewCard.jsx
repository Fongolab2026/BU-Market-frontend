import { CheckCircle2, Flag, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import StarRating from './StarRating.jsx'
import {
  formatReviewDate,
  initialsOf,
  reviewErrorMessage,
} from './reviewUtils.js'

const MIN_COMMENT = 3
const DELETE_CONFIRM_MS = 5000

/**
 * Carte d'un avis : auteur, note, date, commentaire, signalement.
 * L'auteur peut en plus modifier (en ligne) ou supprimer son propre avis :
 * les deux actions sont réservées au serveur au propriétaire de l'avis.
 */
export default function ReviewCard({
  review,
  currentUserId,
  reported = false,
  onReport,
  onUpdate,
  onDelete,
}) {
  const isAuthor =
    currentUserId != null && Number(currentUserId) === Number(review.authorId)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftStars, setDraftStars] = useState(0)
  const [saving, setSaving] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const startEdit = () => {
    setDraft(review.comment || '')
    setDraftStars(Number(review.note) || 0)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setConfirmingDelete(false)
  }

  const saveEdit = async () => {
    const text = draft.trim()
    if (draftStars < 1) {
      toast.error('Choisissez une note de 1 à 5 étoiles.')
      return
    }
    if (text.length < MIN_COMMENT) {
      toast.error(`Votre commentaire doit faire au moins ${MIN_COMMENT} caractères.`)
      return
    }
    setSaving(true)
    try {
      await onUpdate?.(review, { note: draftStars, comment: text })
      setEditing(false)
      toast.success('Votre avis a été mis à jour.')
    } catch (error) {
      toast.error(reviewErrorMessage(error, "Impossible de modifier l'avis."))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      window.setTimeout(() => setConfirmingDelete(false), DELETE_CONFIRM_MS)
      return
    }
    setConfirmingDelete(false)
    try {
      await onDelete(review)
      toast.success('Votre avis a été supprimé.')
    } catch (error) {
      toast.error(reviewErrorMessage(error, "Impossible de supprimer l'avis."))
    }
  }

  return (
    <article className="rounded-2xl border border-base-300 bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
          {review.authorAvatar ? (
            <img
              src={review.authorAvatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initialsOf(review.author)
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="min-w-0 break-words font-semibold text-base-content">
              {review.author || 'Utilisateur'}
              {isAuthor && (
                <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand">
                  Vous
                </span>
              )}
            </p>
            {!editing && <StarRating value={Number(review.note)} size={14} />}
          </div>

          <p className="mt-0.5 text-xs text-base-content/45">
            {formatReviewDate(review.date)}
          </p>

          {editing ? (
            <div className="mt-3 grid gap-2.5">
              <StarRating
                value={draftStars}
                onChange={setDraftStars}
                showLabel
                size={15}
              />
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                rows={3}
                className="textarea textarea-bordered w-full resize-none text-sm"
              />
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg border border-base-300 px-3 py-1.5 text-xs font-semibold text-base-content/70 transition hover:bg-base-200"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={saving}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-soft disabled:opacity-50"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-base-content/75">
              {review.comment}
            </p>
          )}

          {isAuthor && !editing && (
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              {onUpdate && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/45 underline-offset-2 transition hover:text-brand hover:underline"
                >
                  <Pencil size={12} aria-hidden="true" />
                  Modifier
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-2 transition ${
                    confirmingDelete ? 'text-error' : 'text-base-content/45 hover:text-error'
                  } hover:underline`}
                >
                  <Trash2 size={12} aria-hidden="true" />
                  {confirmingDelete ? 'Confirmer la suppression ?' : 'Supprimer'}
                </button>
              )}
            </div>
          )}

          {!isAuthor && onReport && (
            <div className="mt-2.5">
              {reported ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  Signalement enregistré
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => onReport(review)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/45 underline-offset-2 transition hover:text-error hover:underline"
                >
                  <Flag size={12} aria-hidden="true" />
                  Signaler cet avis
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
