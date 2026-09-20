import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userApi } from '../../services'

export default function Inscription() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    adresse: '',
    profile_pic: null,
    password: '',
    password_confirm: ''
  })
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
      await userApi.create(formData)
      toast.success("Inscription réussie, connectez-vous")
      navigate('/connexion')
    } catch (err) {
      setError(err.response?.data?.detail || "Une erreur est survenue lors de l'inscription")
      console.error('inscription:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center min-h-screen p-4 items-center bg-base-100'>
      <div className='card w-105 gap-3 flex flex-col p-10'>
        <h1 className='text-center text-[1.8rem] font-bold text-base-content'>Créer un compte</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='mb-5 flex flex-col'>
            <label className='mb-2 text-[0.9rem] font-bold text-base-content'>Nom d'utilisateur *</label>
            <input
              className='input input-lg w-85'
              type="text"
              name="username"
              placeholder="Choisissez un nom d'utilisateur..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-5 flex flex-col'>
            <label className='mb-2 text-[0.9rem] font-bold text-base-content'>Nom complet *</label>
            <input
              className='input input-lg w-85'
              type="text"
              name="first_name"
              placeholder='Tapez votre nom...'
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-5 flex flex-col'>
            <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Email *</label>
            <input
              className='input input-lg w-85'
              type="email"
              name="email"
              placeholder='Tapez votre mail...'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mb-5 flex flex-col'>
            <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Mot de passe *</label>
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
          <div className='mb-5 flex flex-col'>
            <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Confirmation mot de passe *</label>
            <input
              className='input input-lg w-85'
              type="password"
              name="password_confirm"
              placeholder='Confirmez le mot de passe...'
              value={formData.password_confirm}
              onChange={handleChange}
              required
            />
          </div>
          <div className='text-center mt-3'>
            <button className='btn btn-primary w-85' type="submit" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
        </form>
        <p className='text-center text-base-content/70 text-[0.9rem]'>Déjà un compte ? <Link className='text-primary font-semibold' to="/connexion">Se connecter</Link></p>
      </div>
    </div>
  )
}