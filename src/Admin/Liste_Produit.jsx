import { useState } from 'react'
import { FileStack, Package, Search } from 'lucide-react'
import { PageHeader } from './components/ui.jsx'

const initialProducts = [
  { id: 1, name: 'Smartphone Samsung Galaxy A54', category: 'Électronique', price: 250000, status: 'active' },
  { id: 2, name: 'Robe en coton', category: 'Mode', price: 15000, status: 'active' },
  { id: 3, name: 'Sac à main cuir', category: 'Accessoires', price: 45000, status: 'hidden' }
]

const badgeByStatus = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  hidden: 'bg-base-200 text-base-content/60 ring-base-300'
}
const labelByStatus = { active: 'Publié', hidden: 'Masqué' }

export default function Liste() {
  const [search, setSearch] = useState('')
  const filtered = initialProducts.filter((p) => (p.name + p.category).toLowerCase().includes(search.toLowerCase()))
  return <>
    <PageHeader title="Produits" description="Tous les produits publiés sur la plateforme." action={<span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand"><FileStack size={17} /> {filtered.length} produit{filtered.length > 1 ? 's' : ''}</span>} />
    <section className="card p-4 sm:p-5">
      <label className="relative block"><span className="sr-only">Rechercher un produit</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher par nom ou catégorie…" className="h-10 w-full border border-base-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10" /></label>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[640px] text-left"><thead><tr className="border-b border-base-200 text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45"><th className="pb-3 pl-2">Produit</th><th className="pb-3">Catégorie</th><th className="pb-3">Prix</th><th className="pb-3">Statut</th></tr></thead><tbody className="divide-y divide-base-200">{filtered.map((product) => <tr key={product.id} className="transition hover:bg-base-100"><td className="py-3.5 pl-2"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand"><Package size={17} /></span><p className="font-semibold text-base-content">{product.name}</p></div></td><td className="py-3.5 text-sm text-base-content/70">{product.category}</td><td className="py-3.5 text-sm font-semibold text-base-content">{product.price.toLocaleString()} FCFA</td><td className="py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${badgeByStatus[product.status] || badgeByStatus.hidden}`}>{labelByStatus[product.status] || product.status}</span></td></tr>)}</tbody></table></div>
      {filtered.length === 0 && <div className="py-14 text-center"><Search className="mx-auto text-base-content/25" size={30} /><p className="mt-3 font-bold text-base-content">Aucun produit trouvé</p><p className="mt-1 text-sm text-base-content/45">Modifiez vos critères de recherche.</p></div>}
    </section>
  </>
}