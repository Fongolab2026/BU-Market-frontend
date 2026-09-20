import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardProducts from '../products/ui/cardProduct'
import { productApi, categoryApi } from '../../services'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
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
        setError("Erreur lors du chargement des produits")
        console.error('home:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-base-200 px-6 shadow-sm">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">BU Market</h1>
        </div>
        <Link className="btn btn-outline" to="/connexion">Se connecter</Link>
        <Link className="btn btn-primary" to="/inscription">Inscription</Link>
      </nav>

      <div className="px-8 py-6">
        <h2 className="text-3xl font-bold mb-6">Nos produits</h2>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            className={`btn btn-sm ${selectedCategory === null ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : filtered.length === 0 ? (
          <p className="text-base-content/60">Aucun produit disponible.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filtered.map((p) => (
              <CardProducts
                key={p.id}
                product={p}
                categoryName={categories.find((c) => c.id === p.category)?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}