import { useEffect, useState } from 'react'
import { MapPin, Star, Store, Users, Package, TrendingUp, X, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { merchantCompetitorService } from '../services/merchantCompetitorService.js'
import { PageHeader, StatCard } from '../../../components/ui.jsx'
import { CardGridSkeleton } from '../../../../../components/skeletons'

const statIcons = { shops: Store, products: Package, rating: Star, views: TrendingUp }

export function MerchantCompetitorsPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  // État du panneau détail (boutons dynamiques)
  const [selectedShop, setSelectedShop] = useState(null)
  const [competitorProducts, setCompetitorProducts] = useState([])
  const [myProducts, setMyProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [comparing, setComparing] = useState(false)

  useEffect(() => {
    merchantCompetitorService.list().then((result) => {
      setShops(result)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  /** Ouvre le panneau détail d'un concurrent et charge ses produits. */
  const openShop = async (shop) => {
    setSelectedShop(shop)
    setComparing(false)
    setProductsLoading(true)
    try {
      const products = await merchantCompetitorService.productsByOwner(shop.ownerId ?? shop.id)
      setCompetitorProducts(products)
    } catch {
      setCompetitorProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  /** Charge mes propres produits pour la comparaison. */
  const loadMyProducts = async () => {
    setProductsLoading(true)
    try {
      const products = await merchantCompetitorService.myProducts()
      setMyProducts(products)
      setComparing(true)
    } catch {
      setMyProducts([])
      setComparing(true)
    } finally {
      setProductsLoading(false)
    }
  }

  const closePanel = () => {
    setSelectedShop(null)
    setCompetitorProducts([])
    setMyProducts([])
    setComparing(false)
    setProductsLoading(false)
  }

  const totalProducts = shops.reduce((sum, s) => sum + s.products, 0)
  const avgRating = shops.length ? (shops.reduce((sum, s) => sum + s.rating, 0) / shops.length).toFixed(1) : 0
  const activeShops = shops.filter((s) => s.status === 'active').length

  const stats = [
    { id: 'shops', label: 'Concurrents', value: shops.length, change: `${activeShops} actifs`, trend: 'up', tone: 'brand' },
    { id: 'products', label: 'Produits totaux', value: totalProducts, change: 'En vente', trend: 'up', tone: 'emerald' },
    { id: 'rating', label: 'Note moyenne', value: avgRating, change: '/ 5.0', trend: 'up', tone: 'amber' },
    { id: 'views', label: 'Vues estimées', value: '2.4k+', change: 'Ce mois', trend: 'up', tone: 'orange' },
  ]

  if (selectedShop) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <header className="sticky top-0 z-20 bg-base-100/95 backdrop-blur border-b border-base-200 px-6 py-3">
          <button
            type="button"
            onClick={closePanel}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-base-content/70 transition hover:bg-base-100"
            aria-label="Retour à la liste"
          >
            <ArrowLeft size={16} /> Retour
          </button>
          {comparing && (
            <button
              type="button"
              onClick={loadMyProducts}
              disabled={productsLoading}
              className="ml-auto flex items-center gap-2 rounded-lg border border-base-300 px-2 py-1.5 text-sm font-medium text-base-content/70 transition hover:bg-base-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {productsLoading ? 'Chargement…' : (
                <>
                  <SlidersHorizontal size={16} /> Comparer
                </>
              )}
            </button>
          )}
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8">
          <PageHeader
            eyebrow="Espace vendeur"
            title={comparing ? 'Analyse comparative' : selectedShop.name}
            description={comparing
              ? `Comparaison de vos produits avec ceux de ${selectedShop.name}.`
              : `${selectedShop.products} produits · ${selectedShop.distance}`}
          />

          {comparing ? (
            <ComparisonView
              shop={selectedShop}
              competitorProducts={competitorProducts}
              myProducts={myProducts}
              loading={productsLoading}
              onCloseComparison={closePanel}
            />
          ) : (
            <ShopDetailView
              shop={selectedShop}
              products={competitorProducts}
              loading={productsLoading}
              onCompare={loadMyProducts}
            />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Espace vendeur"
        title="Concurrents"
        description="Analysez les autres commerçants de votre zone pour ajuster votre stratégie."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs concurrents">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} icon={statIcons[stat.id]} />
        ))}
      </section>

      <section className="card">
        <div className="border-b border-base-200 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="font-semibold text-base-content">Autres commerçants à proximité</h2>
          <p className="mt-0.5 text-sm text-base-content/60">Cliquez sur une boutique pour voir ses détails et produits.</p>
        </div>

        <div className="p-4">
          {loading ? (
            <CardGridSkeleton count={6} height="h-44" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
          ) : shops.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="mx-auto text-base-content/25" size={32} />
              <p className="mt-3 font-bold text-base-content">Aucun concurrent trouvé</p>
              <p className="mt-1 text-sm text-base-content/45">Aucun autre commerçant dans votre zone pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <article
                key={shop.id}
                className="rounded-2xl border border-base-200 bg-white p-5 transition hover:border-brand/30 hover:shadow-lg cursor-pointer group"
                onClick={() => openShop(shop)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => event.key === 'Enter' && openShop(shop)}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Store size={22} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base-content truncate">{shop.name}</h3>
                        <StatusBadge status={shop.status === 'active' ? 'active' : 'inactive'} label={shop.status === 'active' ? 'Actif' : 'Inactif'} />
                      </div>
                      <p className="mt-1 text-sm text-base-content/55">{shop.category}</p>
                      <p className="mt-0.5 text-xs text-base-content/45 flex items-center gap-1">
                        <MapPin size={11} /> {shop.distance}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-base-100 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-base-content/70">
                        <Star size={14} className="text-amber-500 fill-current" />
                        <span className="font-semibold">{shop.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-base-content/70">
                        <Users size={14} />
                        <span>{shop.reviewCount} avis</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-base-content/70">
                      <Package size={14} />
                      <span>{shop.products} produits</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        openShop(shop)
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-base-300 px-3 py-2 text-sm font-medium text-base-content/70 transition hover:bg-base-50"
                    >
                      <Package size={14} /> {selectedShop?.id === shop.id && comparing ? 'Fermer' : 'Voir produits'}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (selectedShop?.id === shop.id && comparing) {
                          closePanel()
                        } else {
                          loadMyProducts()
                        }
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-soft"
                    >
                      {selectedShop?.id === shop.id && comparing ? (
                        <>
                          <X size={14} /> Annuler
                        </>
                      ) : (
                        <>
                          <TrendingUp size={14} /> Analyser
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status, label }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-base-100 text-base-content/60'}`}>
      {label}
    </span>
  )
}

/** Détail d'un concurrent : ses infos et ses produits. */
function ShopDetailView({ shop, products, loading, onCompare }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Produits" value={shop.products} icon={Package} tone="brand" />
        <StatCard label="Note" value={shop.rating} change="/ 5" trend="up" tone="amber" icon={Star} />
        <StatCard label="Avis" value={shop.reviewCount} change="clients" trend="up" tone="emerald" icon={Users} />
        <StatCard label="Vues" value={shop.views} change="estimées" trend="up" tone="orange" icon={TrendingUp} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <CardGridSkeleton count={8} height="h-40" className="col-span-full grid gap-4 sm:grid-cols-3 lg:grid-cols-4" />
        ) : products.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <Package className="mx-auto text-base-content/20" size={32} />
            <p className="mt-3 font-bold text-base-content">Aucun produit publié</p>
          </div>
        ) : (
          products.map((product) => (
            <article key={product.id} className="rounded-xl border border-base-200 bg-white p-4 flex flex-col">
              <div className="h-24 flex items-center justify-center overflow-hidden bg-base-100 mb-3 rounded-lg">
                {product.main_image ? (
                  <img src={product.main_image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl" aria-hidden="true">📦</span>
                )}
              </div>
              <h4 className="font-semibold text-base-content line-clamp-2">{product.name}</h4>
              <p className="mt-1 text-sm font-bold text-brand">{Number(product.price).toLocaleString('fr-FR')} BIF</p>
              <p className="mt-1 text-xs text-base-content/50">Stock : {product.stock}</p>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onCompare}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-soft disabled:opacity-50"
        >
          {loading ? 'Chargement…' : (
            <>
              <SlidersHorizontal size={16} /> Comparer avec ma boutique
            </>
          )}
        </button>
      </div>
    </section>
  )
}

/** Comparaison côte à côte : produits du concurrent vs mes produits. */
function ComparisonView({ shop, competitorProducts, myProducts, loading, onCloseComparison }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-base-content">Vous vs {shop.name}</h2>
          <p className="text-sm text-base-content/55">
            Produits actifs : {competitorProducts.length} (concurrent) / {myProducts.length} (vous)
          </p>
        </div>
        <button
          type="button"
          onClick={onCloseComparison}
          className="rounded-lg p-2 text-base-content/50 transition hover:bg-base-100" aria-label="Fermer l'analyse"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-base-200 bg-white p-4">
          <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
            <Package size={16} className="text-brand" /> {shop.name}
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-base-content/50">
              <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            </div>
          ) : competitorProducts.length === 0 ? (
            <p className="text-base-content/45 text-center py-4">Aucun produit publié</p>
          ) : (
            <ul className="space-y-3">
              {competitorProducts.map((product) => (
                <li key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-base-50">
                  <span className="shrink-0 text-base-content/30">📦</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-base-content line-clamp-1">{product.name}</p>
                    <p className="text-xs text-base-content/60">{Number(product.price).toLocaleString('fr-FR')} BIF</p>
                  </div>
                  <span className="text-sm font-medium text-brand">{Number(product.price).toLocaleString('fr-FR')} BIF</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-base-200 bg-white p-4">
          <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
            <Store size={16} className="text-brand" /> Ma boutique
          </h3>
          {myProducts.length === 0 ? (
            <p className="text-base-content/45 text-center py-4">Vous n'avez aucun produit publié pour le moment.</p>
          ) : (
            <ul className="space-y-3">
              {myProducts.map((product) => {
                const compPrice = competitorProducts.find((c) => c.name.toLowerCase() === product.name.toLowerCase())?.price
                const cheaper = compPrice != null ? Number(product.price) < Number(compPrice) : null
                return (
                  <li key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-base-50">
                    <span className="shrink-0 text-base-content/30">📦</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-base-content line-clamp-1">{product.name}</p>
                      <p className="text-xs text-base-content/60">
                        {cheaper !== null ? (cheaper ? 'Moins cher' : 'Plus cher') : 'Sans équivalent'}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-brand">{Number(product.price).toLocaleString('fr-FR')} BIF</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-brand/5 border border-brand/10">
        <h4 className="font-semibold text-brand mb-2">Recommandation</h4>
        <p className="text-sm text-base-content">
          Surveillez les produits où {shop.name} pratique un prix inférieur au vôtre sur des articles similaires.
          Ajustez votre stock et vos prix pour rester compétitif.
        </p>
      </div>
    </section>
  )
}