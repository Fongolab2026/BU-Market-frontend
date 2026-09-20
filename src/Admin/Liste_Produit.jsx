import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productApi, categoryApi } from '../services'

export default function Liste() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.list(),
          categoryApi.list(),
        ])
        setProducts(prodRes.data.results ?? prodRes.data)
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.results ?? [])
      } catch (e) {
        setError('Impossible de charger les produits')
        console.error('products:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = categoryFilter
    ? products.filter((p) => p.category === Number(categoryFilter))
    : products

  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? '—'

  return (
    <div className='min-h-screen bg-base-100 text-base-content'>
      <div className='w-full h-full flex flex-col gap-4 p-6'>
        <nav className='navbar py-0'>
          <h1 className='text-2xl font-bold'>Produits - Listes</h1>
        </nav>

        {error && <div className='alert alert-error'>{error}</div>}

        <div className='flex flex-col gap-4'>
          <div className='w-full flex justify-center items-center gap-4 flex-wrap'>
            <input type="search" placeholder='Rechercher un produit' className='input input-lg bg-white w-[70%]' />
            <button className='btn btn-soft btn-lg'><Link to="/modifier">Modifier un Produit</Link></button>
          </div>
          <div className='w-full flex gap-4'>
            <select
              className='select select-bordered w-64'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className='w-full p-8 bg-white shadow-2xl rounded-2xl overflow-x-auto'>
          {loading ? (
            <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-base-content/60 py-8">Aucun produit trouvé.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="py-3 px-3">Nom</th>
                  <th className="py-3 px-3">Catégorie</th>
                  <th className="py-3 px-3">Prix</th>
                  <th className="py-3 px-3">Détails</th>
                  <th className="py-3 px-3">Vendeur</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200/70 text-sm text-slate-700'>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-100/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-3 px-3">{categoryName(p.category)}</td>
                    <td className="py-3 px-3">
                      {Number(p.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-md truncate">{p.details}</td>
                    <td className="py-3 px-3 text-slate-600">{p.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}