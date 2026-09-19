export default function Loading() {
  return (
    <div className="flex min-h-32 w-full items-center justify-center" role="status" aria-live="polite">
      <span className="loading loading-spinner loading-lg" aria-hidden="true" />
      <span className="sr-only">Chargement...</span>
    </div>
  )
}
