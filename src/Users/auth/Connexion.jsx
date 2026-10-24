import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, Store } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import AuthField from '../../components/AuthField.jsx'
import AuthLayout from '../../components/AuthLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { authApi, setTokens } from '../../services'
import { extractApiError } from '../../utils/apiError.js'
import { resolveRole } from '../../utils/roles.js'

export default function Connexion() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login({
        email: formData.email.trim(),
        password: formData.password,
      })
      setTokens(data)
      let profile = data.user
      if (!profile) {
        try {
          profile = (await authApi.me()).data
        } catch (profileError) {
          console.error('profil après connexion:', profileError)
          profile = { email: formData.email }
        }
      }
      const role = resolveRole(profile)
      signIn({ ...profile, role })
      toast.success('Connexion réussie')
      if (role === 'admin') {
        navigate('/admin/tableau-de-bord', { replace: true })
      } else if (role === 'merchant') {
        navigate('/marchand/tableau-de-bord', { replace: true })
      } else {
        navigate('/accueil', { replace: true })
      }
    } catch (err) {
      console.error('connexion:', err)
      if (err.response?.status === 401) {
        setError('E-mail ou mot de passe incorrect')
        return
      }
      const { general, fields } = extractApiError(err)
      setError(general || fields.email || fields.username || 'E-mail ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      brand={{
        to: '/connexion',
        label: 'BU-Market',
        mark: <Store size={22} aria-hidden="true" />,
      }}
      heroBadge={
        <>
          <Sparkles size={15} className="text-accent" aria-hidden="true" />
          Votre marketplace de confiance
        </>
      }
      heroTitle="Retrouvez vos essentiels, simplement."
      heroText="Connectez-vous pour retrouver vos produits, vos favoris et une sélection pensée pour vous."
      heroFooter={
        <>
          <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
          Une expérience sécurisée et personnalisée
        </>
      }
      eyebrow="Bon retour"
      title="Se connecter"
      subtitle="Accédez à votre espace personnel et continuez vos achats."
      alert={
        error ? (
          <div role="alert" className="alert alert-error mb-5 text-sm">
            {error}
          </div>
        ) : null
      }
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link className="font-bold text-primary hover:underline" to="/inscription">
            S&apos;inscrire
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Adresse e-mail"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <AuthField
          id="password"
          label="Mot de passe"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          name="password"
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
              aria-label={
                showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
              }
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              toast('Réinitialisation bientôt disponible. Contactez BU-Market.', {
                icon: '🔑',
              })
            }
            className="text-sm font-semibold text-primary hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          className="btn btn-primary h-12 w-full gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
          {!loading && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
    </AuthLayout>
  )
}
