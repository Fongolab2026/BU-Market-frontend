import { useEffect, useState } from 'react'
import { MapPin, Star, Store, Users, Package, TrendingUp } from 'lucide-react'
import { merchantCompetitorService } from '../services/merchantCompetitorService.js'
import { PageHeader, StatCard } from '../../../components/ui.jsx'

const statIcons = { shops: Store, products: Package, rating: Star, views: TrendingUp }

export function MerchantCompetitorsPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    merchantCompetitorService.list().then((result) => {
      setShops(result)
      setLoading(false)
    })
  }, [])

  const totalProducts = shops.reduce((sum, s) => sum + s.products, 0)
  const avgRating = shops.length ? (shops.reduce((sum, s) => sum + s.rating, 0) / shops.length).toFixed(1) : 0
  const activeShops = shops.filter((s) => s.status === 'active').length

  const stats = [
    { id: 'shops', label: 'Concurrents', value: shops.length, change: `${activeShops} actifs`, trend: 'up', tone: 'brand' },
    { id: 'products', label: 'Produits totaux', value: totalProducts, change: 'En vente', trend: 'up', tone: 'emerald' },
    { id: 'rating', label: 'Note moyenne', value: avgRating, change: '/ 5.0', trend: 'up', tone: 'amber' },
    { id: 'views', label: 'Vues estimées', value: '2.4k+', change: 'Ce mois', trend: 'up', tone: 'violet' },
  ]

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
            <div className="flex items-center justify-center gap-3 p-10 text-sm text-base-content/50">
              <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Chargement des commerçants...
            </div>
          ) : shops.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="mx-auto text-base-content/25" size={32} />
              <p className="mt-3 font-bold text-base-content">Aucun concurrent trouvé</p>
              <p className="mt-1 text-sm text-base-content/45">Aucun autre commerçant dans votre zone pour le moment.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <article key={shop.id} className="rounded-2xl border border-base-200 bg-white p-5 transition hover:border-brand/30 hover:shadow-lg">
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
                    <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-base-300 px-3 py-2 text-sm font-medium text-base-content/70 transition hover:bg-base-50">
                      <Package size={14} /> Voir produits
                    </button>
                    <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-soft">
                      <TrendingUp size={14} /> Analyser
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