import { CheckCircle2, MessageSquareHeart, Send, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAuthenticated, reviewApi, shopReviewApi } from '../../services'
import { useAuth } from '../../context/AuthContext.jsx'
import ReviewCard from './ReviewCard.jsx'
import StarRating from './StarRating.jsx'
import {
  averageOf,
  distributionOf,
  reviewErrorMessage,
} from './reviewUtils.js'

const PAGE_SIZE = 6
const MIN_COMMENT = 3

const TARGET_LABELS = {
  product: { singular: 'produit', demonstrative: 'ce', title: 'Avis clients' },
  shop: { singular: 'boutique', demonstrative: 'cette', title: 'Avis sur la boutique' },
}

/**
 * Bloc d'avis réutilisable : résumé (note moyenne + répartition), formulaire
 * de dépôt et liste des avis.
 *
 * `targetType` = "product" (avis sur un produit) ou "shop" (avis sur une
 * boutique). Client comme vendeur connecté peut déposer un avis ; l'auteur du
 * produit/boutique est exclu (règle serveur) — on l'explique à l'écran.
 */
export default function ReviewSection({
  targetType = 'product',
  targetId,
  ownerId,
  title,
  compact = false,
  onCreated,
}) {
  const { user } = useAuth()
  const service = targetType === 'shop' ? shopReviewApi : reviewApi
  const labels = TARGET_LABELS[targetType] || TARGET_LABELS.product

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reportedIds, setReportedIds] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (!targetId) {
      setLoading(false)
      return undefined
    }
    let active = true
    setLoading(true)
    const params =
      targetType === 'shop'
        ? { shop: targetId, perPage: 100 }
        : { product: targetId, perPage: 100 }

    service
      .list(params)
      .then(({ data }) => {
        if (!active) return
        const result = Array.isArray(data) ? data : data?.results ?? []
        setReviews(Array.isArray(result) ? result : [])
      })
      .catch(() => {
        if (active) setReviews([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [targetId, targetType, service])

  const average = useMemo(() => averageOf(reviews), [reviews])
  const distribution = useMemo(() => distributionOf(reviews), [reviews])

  const isOwnTarget =
    user != null && ownerId != null && Number(user.id) === Number(ownerId)

  // Avis déjà déposé par l'utilisateur connecté : on remplace le formulaire
  // par un rappel (le serveur refuse un second avis pour la même cible).
  const myReview =
    user == null
      ? null
      : reviews.find((item) => Number(item.authorId) === Number(user.id)) || null

  const handleUpdate = async (review, payload) => {
    const { data } = await service.update(review.id, payload)
    setReviews((current) =>
      current.map((item) => (item.id === data.id ? data : item)),
    )
  }

  const handleDelete = async (review) => {
    await service.remove(review.id)
    setReviews((current) => current.filter((item) => item.id !== review.id))
  }

  const handleReport = async (review) => {
    if (!isAuthenticated()) {
      toast.error('Connectez-vous pour signaler un avis.')
      return
    }
    try {
      await service.report(review.id)
      setReportedIds((current) => [...current, review.id])
      toast.success('Avis signalé à notre équipe de modération.')
    } catch (error) {
      toast.error(reviewErrorMessage(error, "Impossible de signaler l'avis."))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated()) {
      toast.error('Connectez-vous pour laisser un avis.')
      return
    }
    const text = comment.trim()
    if (stars < 1) {
      toast.error('Choisissez une note de 1 à 5 étoiles.')
      return
    }
    if (text.length < MIN_COMMENT) {
      toast.error(`Votre commentaire doit faire au moins ${MIN_COMMENT} caractères.`)
      return
    }

    setSubmitting(true)
    try {
      const payload =
        targetType === 'shop'
          ? { shop: Number(targetId), note: stars, comment: text }
          : { product: Number(targetId), note: stars, comment: text }
      const { data } = await service.create(payload)
      setReviews((current) => [data, ...current.filter((item) => item.id !== data.id)])
      setComment('')
      setStars(0)
      setShowAll(true)
      toast.success('Votre avis a été publié.')
      onCreated?.(data)
    } catch (error) {
      toast.error(
        reviewErrorMessage(error, 'Impossible de publier votre avis.'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, PAGE_SIZE)

  const renderForm = () => {
    if (!isAuthenticated()) {
      return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-base-content/65">
            Connectez-vous pour noter {labels.singular} et partager votre
            expérience.
          </p>
          <Link
            to="/connexion"
            className="btn btn-sm bg-brand text-white hover:bg-brand-soft border-transparent"
          >
            Se connecter
          </Link>
        </div>
      )
    }

    if (isOwnTarget) {
      return (
        <p className="flex items-start gap-2 rounded-2xl border border-info/30 bg-info/10 p-4 text-sm leading-6 text-base-content/75">
          <ShieldAlert size={17} className="mt-0.5 shrink-0 text-info" aria-hidden="true" />
          Vous ne pouvez pas noter votre propre {labels.singular}. Les avis des
          clients et des autres vendeurs s&apos;affichent ci-dessous.
        </p>
      )
    }

    if (myReview) {
      return (
        <p className="flex items-start gap-2 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-sm leading-6 text-base-content/75">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
          Vous avez déjà publié votre avis pour {labels.demonstrative}{' '}
          {labels.singular}. Modifiez-le ou supprimez-le depuis votre carte,
          juste ci-dessous.
        </p>
      )
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-base-300 bg-[var(--surface)] p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-base-content">Votre note</p>
          <StarRating value={stars} onChange={setStars} showLabel />
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Votre commentaire</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={compact ? 2 : 3}
            placeholder={
              targetType === 'shop'
                ? 'Qualité du service, délais, accueil…'
                : 'Qualité du produit, conformité, livraison…'
            }
            className="textarea textarea-bordered w-full resize-none text-sm placeholder:text-base-content/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-base-content/45">
            {comment.length}/2000 caractères
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} aria-hidden="true" />
            {submitting ? 'Publication…' : 'Publier mon avis'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <section aria-labelledby={`reviews-${targetType}-${targetId}`}>
      <div className="mb-4 flex items-center gap-2">
        <MessageSquareHeart size={20} className="text-amber-400" aria-hidden="true" />
        <h2
          id={`reviews-${targetType}-${targetId}`}
          className="text-xl font-bold text-base-content"
        >
          {title || labels.title}
        </h2>
        <span className="text-sm text-base-content/55">({reviews.length})</span>
      </div>

      {!compact && (
        <div className="mb-5 grid gap-4 rounded-2xl border border-base-300 bg-[var(--surface)] p-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex flex-col items-center justify-center border-base-300 px-2 sm:border-r">
            <p className="text-4xl font-extrabold tracking-tight text-base-content">
              {average || '—'}
            </p>
            <StarRating value={Math.round(average)} size={15} className="mt-1" />
            <p className="mt-1 text-xs text-base-content/55">
              {reviews.length} avis
            </p>
          </div>
          <div className="grid gap-1.5">
            {distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 shrink-0 font-semibold text-base-content/60">
                  {row.stars} ★
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-base-300/70">
                  <span
                    className="block h-full rounded-full bg-amber-400"
                    style={{ width: `${Math.round(row.ratio * 100)}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right text-base-content/50">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {renderForm()}

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-base-content/60">Chargement des avis…</p>
        ) : reviews.length === 0 ? (
          <p className="rounded-xl bg-base-200/50 p-4 text-sm text-base-content/60">
            Aucun avis pour le moment. Soyez le premier à partager votre
            expérience.
          </p>
        ) : (
          <div className="space-y-3">
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                reported={reportedIds.includes(review.id)}
                onReport={handleReport}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {!showAll && reviews.length > PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="w-full rounded-xl border border-base-300 py-2.5 text-sm font-semibold text-base-content/70 transition hover:border-brand hover:text-brand"
              >
                Afficher les {reviews.length} avis
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
