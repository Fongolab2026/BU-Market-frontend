import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi, setTokens } from '../../services'

export default function Connexion() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login(formData)
      setTokens(data)
      toast.success('Connexion réussie')
      navigate('/')
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect")
      console.error('connexion:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center min-h-screen p-4 items-center bg-base-100'>
      <div className='card w-105 gap-3 flex flex-col p-10'>
        <h1 className='text-center text-[1.8rem] font-bold text-base-content'>Se connecter</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='mb-5 flex flex-col'>
            <label className='mb-2 text-[0.9rem] font-bold text-base-content'>Nom d'utilisateur *</label>
            <input
              className='input input-lg w-85'
              type="text"
              name="username"
              placeholder="Nom d'utilisateur..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-3 flex flex-col'>
            <label className='text-[0.9rem] font-bold mb-2 text-base-content'>Mot de passe *</label>
            <input
              className='input input-lg w-85'
              type="password"
              name="password"
              placeholder='Mot de passe...'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex justify-end mb-4'>
            <a className='text-[0.85rem] text-primary font-semibold' href=''>Mot de passe oublié ?</a>
          </div>
          <div className='text-center'>
            <button className='btn btn-primary w-85' type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
        <p className='text-center text-base-content/70 text-[0.9rem]'>Pas encore de compte ? <Link className='text-primary font-semibold' to="/inscription">S'inscrire</Link></p>
      </div>
    </div>
  )
}