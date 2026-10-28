import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import CardProducts from '../../products/ui/cardProduct'
import Reveal from '../../../components/Reveal.jsx'
import { ProductGridSkeleton } from '../../../components/skeletons'
import { PRODUCTS_PER_PAGE } from './homeData.js'

export default function HomeCatalog({ catalog }) {
  const {
    categories,
    selectedCategory,
    selectCategory,
    currentPage,
    setCurrentPage,
    totalPages,
    visibleProducts,
    searchedProducts,
    initialLoading,
    catalogLoading,
    error,
    searchQuery,
    setSearchQuery,
  } = catalog

  return (
    <Reveal as="section" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:pb-16">
      <Reveal
        id="produits"
        className="mb-7 flex scroll-mt-24 flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
      >
        <div>
          <span className="badge badge-accent badge-sm mb-2 uppercase tracking-widest">Catalogue</span>
          <h2 className="text-3xl font-bold tracking-tight text-base-content md:text-4xl">
            Nos produits
          </h2>
        </div>
        {!initialLoading && (
          <p className="text-sm text-base-content/60" aria-live="polite">
            {searchedProducts.length} produit{searchedProducts.length > 1 ? 's' : ''} disponible
            {searchQuery ? ` pour « ${searchQuery} »` : selectedCategory ? ' dans cette catégorie' : ''}
            {catalogLoading && (
              <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-base-content/45">
                <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                catalogue en cours de chargement
              </span>
            )}
          </p>
        )}
      </Reveal>

      <div className="mx-auto mb-5 max-w-2xl">
        <label className="relative block">
          <span className="sr-only">Rechercher un produit</span>
          <Search
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher un produit..."
            className="input h-12 w-full border-base-300 bg-[var(--surface)] pl-11 pr-4 text-base shadow-sm"
          />
        </label>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => selectCategory(null)}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => selectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {initialLoading ? (
        <ProductGridSkeleton count={8} />
      ) : searchedProducts.length === 0 ? (
        <p className="text-center text-base-content/60">Aucun produit ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product, index) => (
            <Reveal key={product.id} delay={(index % 4) * 70} className="w-full">
              <CardProducts
                product={product}
                priority={index < 4}
                categoryName={categories.find((category) => category.id === product.category)?.name}
              />
            </Reveal>
          ))}
        </div>
      )}

      {!initialLoading && searchedProducts.length > PRODUCTS_PER_PAGE && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3" aria-label="Pagination des produits">
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            <ChevronLeft size={17} aria-hidden="true" />
            Précédente
          </button>
          <span className="rounded-field bg-base-200 px-4 py-2 text-sm font-semibold text-base-content">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm gap-1"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            Suivante
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </nav>
      )}
    </Reveal>
  )
}
