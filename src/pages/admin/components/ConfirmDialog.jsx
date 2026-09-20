import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', tone = 'danger', busy = false, onConfirm, onCancel }) {
  if (!open) return null
  const isDanger = tone === 'danger'
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div role="alertdialog" aria-modal="true" className="card w-full max-w-sm p-5">
        <div className="flex items-start gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertTriangle size={19} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-base-content">{title}</h2>
            {message && <p className="mt-1 text-sm leading-5 text-base-content/60">{message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100 disabled:opacity-60">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${isDanger ? 'bg-rose-700 hover:bg-rose-800' : 'bg-brand hover:bg-brand-soft'}`}>
            {busy ? 'En cours…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}