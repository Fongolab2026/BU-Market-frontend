import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Store, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi } from '../../services'
import { useTheme } from '../../context/ThemeContext.jsx'

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
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const formatPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // If starts with 0, convert to +33 (France)
    if (digits.startsWith('0') && digits.length === 10) {
      return '+33' + digits.slice(1)
    }
    // If already has country code or other format, return as-is with +
    if (digits.length > 0 && !value.startsWith('+')) {
      return '+' + digits
    }
    return value
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Nom d'utilisateur requis"
    if (!formData.email.trim()) newErrors.email = "Email requis"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide"
    if (!formData.first_name.trim()) newErrors.first_name = "Prénom requis"
    if (!formData.last_name.trim()) newErrors.last_name = "Nom requis"
    if (formData.phone && !/^\+?\d{8,15}$/.test(formData.phone)) newErrors.phone = "Format: +33612345678 ou 0612345678"
    if (!formData.password) newErrors.password = "Mot de passe requis"
    else if (formData.password.length < 8) newErrors.password = "8 caractères minimum"
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = "Les mots de passe ne correspondent pas"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (!validateForm()) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      // Don't send password_confirm to backend
      const { password_confirm, profile_pic, ...payload } = formData
      await userApi.create(payload)
      toast.success("Inscription réussie, connectez-vous")
      navigate('/connexion')
    } catch (err) {
      console.error('inscription:', err)
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'object' && !Array.isArray(data)) {
          // Field-level validation errors from DRF
          const fieldErrors = {}
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
              fieldErrors[key] = data[key].join(', ')
            } else {
              fieldErrors[key] = data[key]
            }
          })
          setErrors(fieldErrors)
        } else if (data.detail) {
          setErrors({ general: data.detail })
        } else {
          setErrors({ general: "Une erreur est survenue lors de l'inscription" })
        }
      } else {
        setErrors({ general: "Erreur de connexion au serveur" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-base-100 px-4 py-6 sm:px-6 lg:px-8'>
      <button
        type='button'
        onClick={toggleTheme}
        title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        className='btn btn-ghost btn-circle absolute right-4 top-4 z-10 sm:right-8 sm:top-8'
      >
        {isDark ? <Sun size={21} /> : <Moon size={21} />}
      </button>

      <div className='mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center overflow-hidden rounded-3xl border border-base-300 bg-[var(--surface)] shadow-2xl shadow-base-content/10 lg:grid-cols-2'>
        <section className='home-hero relative hidden min-h-[700px] flex-col justify-between overflow-hidden p-10 text-primary-content lg:flex xl:p-14'>
          <div className='absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl' aria-hidden='true' />
          <div className='relative'>
            <Link to='/inscription' className='inline-flex items-center gap-3 text-xl font-bold tracking-tight'>
              <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25'>
                <Store size={23} aria-hidden='true' />
              </span>
              BU-Market
            </Link>
            <span className='mt-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold'>
              <Sparkles size={15} className='text-accent' aria-hidden='true' />
              Rejoignez notre communauté
            </span>
            <h2 className='mt-6 max-w-md text-4xl font-extrabold leading-tight xl:text-5xl'>
              Votre shopping commence ici.
            </h2>
            <p className='mt-5 max-w-md text-base leading-7 text-primary-content/75'>
              Créez votre compte et profitez d'une expérience simple, personnalisée et pensée pour vos envies.
            </p>
          </div>
          <div className='relative flex items-center gap-3 text-sm font-medium text-primary-content/80'>
            <ShieldCheck size={20} className='text-accent' aria-hidden='true' />
            Vos informations restent protégées
          </div>
        </section>

        <section className='mx-auto w-full max-w-md p-7 sm:p-10 lg:p-14'>
          <div className='mb-8 lg:hidden'>
            <Link to='/inscription' className='inline-flex items-center gap-2 text-lg font-bold text-base-content'>
              <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content'><Store size={20} /></span>
              BU-<span className='text-primary'>Market</span>
            </Link>
          </div>
          <div className='mb-8'>
            <p className='text-sm font-bold uppercase tracking-[0.2em] text-primary'>Nouveau membre</p>
            <h1 className='mt-2 text-3xl font-extrabold tracking-tight text-base-content'>Créer un compte</h1>
            <p className='mt-2 text-sm leading-6 text-base-content/60'>Quelques informations suffisent pour commencer votre expérience.</p>
          </div>

          {errors.general && <div className='alert alert-error mb-5 text-sm'>{errors.general}</div>}

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='username'>Nom d&apos;utilisateur</label>
                <input id='username' className={`input input-lg w-full ${errors.username ? 'input-error' : ''}`} type='text' name='username' placeholder='Votre identifiant' value={formData.username} onChange={handleChange} required />
                {errors.username && <p className='text-xs text-error'>{errors.username}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='first_name'>Prénom</label>
                <input id='first_name' className={`input input-lg w-full ${errors.first_name ? 'input-error' : ''}`} type='text' name='first_name' placeholder='Prénom' value={formData.first_name} onChange={handleChange} required />
                {errors.first_name && <p className='text-xs text-error'>{errors.first_name}</p>}
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='last_name'>Nom</label>
                <input id='last_name' className={`input input-lg w-full ${errors.last_name ? 'input-error' : ''}`} type='text' name='last_name' placeholder='Nom' value={formData.last_name} onChange={handleChange} required />
                {errors.last_name && <p className='text-xs text-error'>{errors.last_name}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='email'>Adresse e-mail</label>
                <input id='email' className={`input input-lg w-full ${errors.email ? 'input-error' : ''}`} type='email' name='email' placeholder='vous@exemple.com' value={formData.email} onChange={handleChange} required />
                {errors.email && <p className='text-xs text-error'>{errors.email}</p>}
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='phone'>Téléphone</label>
                <input id='phone' className={`input input-lg w-full ${errors.phone ? 'input-error' : ''}`} type='tel' name='phone' placeholder='+33 6 12 34 56 78' value={formData.phone} onChange={handlePhoneChange} />
                {errors.phone && <p className='text-xs text-error'>{errors.phone}</p>}
                <p className='text-xs text-base-content/50'>Format: +33612345678 ou 0612345678</p>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='adresse'>Adresse</label>
                <input id='adresse' className='input input-lg w-full' type='text' name='adresse' placeholder='Votre adresse' value={formData.adresse} onChange={handleChange} />
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='password'>Mot de passe</label>
                <div className='relative'>
                  <input id='password' className={`input input-lg w-full pr-12 ${errors.password ? 'input-error' : ''}`} type={showPassword ? 'text' : 'password'} name='password' placeholder='Mot de passe (8 min.)' value={formData.password} onChange={handleChange} required />
                  {errors.password && <p className='text-xs text-error'>{errors.password}</p>}
                  <button type='button' onClick={() => setShowPassword((visible) => !visible)} className='btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2' aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-bold text-base-content' htmlFor='password_confirm'>Confirmation</label>
                <div className='relative'>
                  <input id='password_confirm' className={`input input-lg w-full pr-12 ${errors.password_confirm ? 'input-error' : ''}`} type={showConfirmation ? 'text' : 'password'} name='password_confirm' placeholder='Répétez le mot de passe' value={formData.password_confirm} onChange={handleChange} required />
                  {errors.password_confirm && <p className='text-xs text-error'>{errors.password_confirm}</p>}
                  <button type='button' onClick={() => setShowConfirmation((visible) => !visible)} className='btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2' aria-label={showConfirmation ? 'Masquer la confirmation' : 'Afficher la confirmation'}>
                    {showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>
            <button className='btn btn-primary mt-3 w-full gap-2' type='submit' disabled={loading}>
              {loading ? 'Inscription...' : "Créer mon compte"}
              {!loading && <ArrowRight size={17} aria-hidden='true' />}
            </button>
          </form>
          <p className='mt-8 text-center text-sm text-base-content/65'>
            Vous avez déjà un compte ? <Link className='font-bold text-primary hover:underline' to='/connexion'>Se connecter</Link>
          </p>
        </section>
      </div>
    </div>
  )
}