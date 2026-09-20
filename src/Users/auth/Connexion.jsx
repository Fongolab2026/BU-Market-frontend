import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../../services'
import { setTokens } from '../../services'

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
      navigate('/admin')
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect')
      console.error('connexion:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center h-screen p-1 items-center bg-[whitesmoke]">
      <div className="w-105 rounded-md gap-3 flex flex-col p-10 bg-white shadow-md text-center">
        <h1 className="text-[1.8rem] font-bold text-gray-700">Se connecter</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='mb-5 flex flex-col text-left'>
            <label className='mb-2 text-[0.9rem] font-bold'>Nom d'utilisateur *</label>
            <input
              className='input input-lg w-full'
              type="text"
              name="username"
              placeholder="Nom d'utilisateur..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-5 flex flex-col text-left'>
            <label className='mb-2 text-[0.9rem] font-bold'>Mot de passe *</label>
            <input
              className='input input-lg w-full'
              type="password"
              name="password"
              placeholder='Mot de passe...'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className='text-center mt-3'>
            <button className='btn btn-primary w-full' type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
        <p className='text-center text-gray-500 text-[0.9rem]'>Pas de compte ? <a className='text-primary font-semibold' href='/inscription'>S'inscrire</a></p>
      </div>
    </div>
  )
}