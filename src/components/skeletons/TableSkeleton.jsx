import { Skeleton, SkeletonCircle } from './Skeleton.jsx'

/**
 * `TableRowsSkeleton` : uniquement les `<tr>` du corps d'un tableau. À poser
 * directement dans un `<tbody>` existant.
 *
 * `TableSkeleton` : tableau complet (en-tête + corps) pour remplacer tout un
 * bloc « chargement » autonome.
 */

/** Lignes de tableau (à insérer dans un `<tbody>`). */
export function TableRowsSkeleton({ rows = 4, columns = 5, leadingAvatar = true }) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse motion-reduce:animate-none" aria-hidden="true">
          {Array.from({ length: columns }, (_, colIndex) => (
            <td key={colIndex} className={colIndex === 0 ? 'py-3.5 pl-2' : 'py-3.5'}>
              {colIndex === 0 && leadingAvatar ? (
                <div className="flex items-center gap-3">
                  <SkeletonCircle className="size-10 shrink-0" />
                  <div className="space-y-2">
                    <Skeleton rounded="rounded" className="h-4 w-40" />
                    <Skeleton rounded="rounded" className="h-3 w-24" />
                  </div>
                </div>
              ) : colIndex === 0 ? (
                <Skeleton rounded="rounded-lg" className="h-10 w-52" />
              ) : colIndex === columns - 1 ? (
                <Skeleton rounded="rounded-full" className="h-6 w-20" />
              ) : (
                <Skeleton rounded="rounded" className="h-4 w-24" />
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/** Tableau complet factice : en-tête + `rows` lignes. */
export default function TableSkeleton({ rows = 5, columns = 5, leadingAvatar = true, minWidth, className = '' }) {
  return (
    <div
      className={`overflow-x-auto ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Chargement du tableau"
    >
      <table className="w-full text-left" style={minWidth ? { minWidth } : undefined}>
        <thead aria-hidden="true">
          <tr className="text-xs font-semibold uppercase tracking-wide text-base-content/40">
            {Array.from({ length: columns }, (_, colIndex) => (
              <th key={colIndex} className={colIndex === 0 ? 'pb-3 pl-2' : 'pb-3'}>
                <Skeleton rounded="rounded" className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-base-200">
          <TableRowsSkeleton rows={rows} columns={columns} leadingAvatar={leadingAvatar} />
        </tbody>
      </table>
    </div>
  )
}
