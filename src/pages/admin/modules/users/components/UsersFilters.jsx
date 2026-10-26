import { Filter, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'

/** Barre de recherche et filtres de la liste des utilisateurs. */
export default function UsersFilters({ filters, updateFilter, resetFilters, filtersActive }) {
  return (
    <div className="border-b border-base-200 bg-base-50/60 p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
        <label className="relative block">
          <span className="sr-only">Rechercher un utilisateur</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            size={18}
          />
          <input
            value={filters.query}
            onChange={(event) => updateFilter('query', event.target.value)}
            placeholder="Rechercher par nom, e-mail ou boutique…"
            className="h-10 w-full rounded-lg border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrer par rôle</span>
          <Filter
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            size={16}
          />
          <select
            value={filters.role}
            onChange={(event) => updateFilter('role', event.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="all">Tous les rôles</option>
            <option value="merchant">Commerçants</option>
            <option value="buyer">Clients</option>
            <option value="admin">Gestionnaires</option>
          </select>
        </label>

        <label className="relative">
          <span className="sr-only">Filtrer par statut</span>
          <SlidersHorizontal
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            size={16}
          />
          <select
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-base-300 bg-white pl-9 pr-3 text-sm font-medium outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
          </select>
        </label>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!filtersActive}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-base-300 bg-white px-3 text-sm font-semibold text-base-content/60 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={15} /> Réinitialiser
        </button>
      </div>
    </div>
  )
}
