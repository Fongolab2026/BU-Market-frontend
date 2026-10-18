import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  Store,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AuthField from '../../components/AuthField.jsx'
import AuthLayout from '../../components/AuthLayout.jsx'
import PhoneInput from '../../components/PhoneInput.jsx'
import { userApi } from '../../services'
import { getPhoneError } from '../../utils/phone.js'

export default function Inscription() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    phone: '',
    adresse: '',
    profile_pic: null,
    password: '',
    password_confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Efface l'erreur du champ dès que l'utilisateur corrige sa saisie.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }))
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Nom d'utilisateur requis"
    if (!formData.email.trim()) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.first_name.trim()) newErrors.first_name = 'Prénom requis'
    // Le téléphone est optionnel côté backend : on le valide seulement s'il est saisi
    if (formData.phone && formData.phone.trim()) {
      const phoneError = getPhoneError(formData.phone, 'bi')
      if (phoneError) newErrors.phone = phoneError
    }
    if (!formData.password) newErrors.password = 'Mot de passe requis'
    else if (formData.password.length < 8) newErrors.password = '8 caractères minimum'
    if (formData.password !== formData.password_confirm)
      newErrors.password_confirm = 'Les mots de passe ne correspondent pas'
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
      toast.success('Inscription réussie, connectez-vous')
      navigate('/connexion')
    } catch (err) {
      console.error('inscription:', err)
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'object' && !Array.isArray(data)) {
          // Field-level validation errors from DRF
          const fieldErrors = {}
          Object.keys(data).forEach((key) => {
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
        setErrors({ general: 'Erreur de connexion au serveur' })
      }
    } finally {
      setLoading(false)
    }
  }

  const passwordsMatch =
    Boolean(formData.password && formData.password_confirm) &&
    formData.password === formData.password_confirm

  const passwordToggle = (visible, setVisible, label) => (
    <button
      type="button"
      onClick={() => setVisible((current) => !current)}
      className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
      aria-label={visible ? `Masquer ${label}` : `Afficher ${label}`}
    >
      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  )

  return (
    <AuthLayout
      brand={{
        to: '/inscription',
        label: 'BU-Market',
        mark: <Store size={22} aria-hidden="true" />,
      }}
      heroBadge={
        <>
          <Sparkles size={15} className="text-accent" aria-hidden="true" />
          Rejoignez notre communauté
        </>
      }
      heroTitle="Votre shopping commence ici."
      heroText="Créez votre compte et profitez d'une expérience simple, personnalisée et pensée pour vos envies."
      heroFooter={
        <>
          <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
          Vos informations restent protégées
        </>
      }
      eyebrow="Nouveau membre"
      title="Créer un compte"
      subtitle="Quelques informations suffisent pour commencer votre expérience."
      heroMinHeight="lg:min-h-[700px]"
      formWidth="max-w-lg"
      alert={
        errors.general ? (
          <div role="alert" className="alert alert-error mb-5 text-sm">
            {errors.general}
          </div>
        ) : null
      }
      footer={
        <>
          Vous avez déjà un compte ?{' '}
          <Link className="font-bold text-primary hover:underline" to="/connexion">
            Se connecter
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            id="username"
            label="Nom d'utilisateur"
            icon={AtSign}
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Votre identifiant"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />
          <AuthField
            id="first_name"
            label="Prénom"
            icon={User}
            type="text"
            name="first_name"
            autoComplete="given-name"
            placeholder="Prénom"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            required
          />
        </div>

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
          error={errors.email}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-base-content" htmlFor="phone">
              Téléphone
            </label>
            <PhoneInput
              id="phone"
              name="phone"
              height="3rem"
              error={errors.phone || undefined}
              placeholder="Numéro de téléphone"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>
          <AuthField
            id="adresse"
            label="Adresse"
            icon={MapPin}
            type="text"
            name="adresse"
            autoComplete="street-address"
            placeholder="Votre adresse"
            value={formData.adresse}
            onChange={handleChange}
            error={errors.adresse}
          />
        </div>

        <div className="border-t border-base-200 pt-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-base-content/70">
            Sécurité du compte
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField
              id="password"
              label="Mot de passe"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              hint="8 caractères minimum"
              required
              endAdornment={passwordToggle(showPassword, setShowPassword, 'le mot de passe')}
            />
            <AuthField
              id="password_confirm"
              label="Confirmation"
              icon={Lock}
              type={showConfirmation ? 'text' : 'password'}
              name="password_confirm"
              autoComplete="new-password"
              placeholder="Répétez le mot de passe"
              value={formData.password_confirm}
              onChange={handleChange}
              error={errors.password_confirm}
              required
              endAdornment={passwordToggle(
                showConfirmation,
                setShowConfirmation,
                'la confirmation',
              )}
            />
          </div>

          {!errors.password_confirm && formData.password && formData.password_confirm && (
            <p
              className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${
                passwordsMatch ? 'text-success' : 'text-base-content/50'
              }`}
            >
              {passwordsMatch ? (
                <CheckCircle2 size={14} aria-hidden="true" />
              ) : (
                <AlertCircle size={14} aria-hidden="true" />
              )}
              {passwordsMatch
                ? 'Les mots de passe correspondent'
                : 'Les mots de passe ne correspondent pas encore'}
            </p>
          )}
        </div>

        <button
          className="btn btn-primary h-12 w-full gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Inscription...' : 'Créer mon compte'}
          {!loading && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
    </AuthLayout>
  )
}
