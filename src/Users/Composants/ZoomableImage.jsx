import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'

export default function ZoomableImage({ src, alt, className = '' }) {
  const [open, setOpen] = useState(false)

  if (!src) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative block overflow-hidden ${className}`}
        aria-label={`Agrandir ${alt || "la photo"}`}
      >
        <img src={src} alt={alt} className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
          <Maximize2 size={24} />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo agrandie : ${alt || "photo"}`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Fermer la photo"
          >
            <X size={24} />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
