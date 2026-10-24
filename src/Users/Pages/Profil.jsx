import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, ImagePlus, KeyRound, Loader2, Lock, Shield, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import NavBar from '../Composants/nav'
import { useAuth } from '../../context/AuthContext.jsx'
import api, { endpoints } from '../../services/api'
import { authApi } from '../../services/authService'
import { userApi } from '../../services/userService'
import { hasRentedSpace, resolveRole } from '../../utils/roles.js'
import PhoneInput from '../../components/PhoneInput.jsx'
import { getPhoneError } from '../../utils/phone.js'

function formFromUser(source) {
  return {
    firstName: source?.firstName ?? source?.first_name ?? '',
    // Le backend ne stocke pas de nom de famille séparé : le champ « Nom »
    // affiche donc le nom d'utilisateur actuel du compte (lecture seule).
    username: source?.username ?? '',
    phone: source?.phone ?? source?.phone_number ?? '',
    adresse: source?.adresse ?? source?.address ?? source?.location ?? '',
    email: source?.email ?? '',
  }
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder, error, readOnly = false, isPhone = false, defaultCountry, className = '' }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-sm font-semibold text-base-content">
        {label}{required && <span className="ml-1 text-error" aria-hidden="true">*</span>}
      </label>
      {isPhone ? (
        <PhoneInput id={name} name={name} value={value} onChange={onChange} defaultCountry={defaultCountry} error={error || undefined} />
      ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        aria-invalid={error ? 'true' : undefined}
        className={`input input-bordered w-full bg-base-100 ${readOnly ? 'cursor-not-allowed opacity-60' : ''} ${error ? 'input-error' : ''}`}
      />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

export default function Profil() {
  const { user, signIn, signOut } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => formFromUser(user))
  const editedRef = useRef(false)
  const [phoneError, setPhoneError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState('')
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdErrors, setPwdErrors] = useState({})
  const [changingPwd, setChangingPwd] = useState(false)
  const [activeSection, setActiveSection] = useState('infos')

  useEffect(() => {
    const sections = ['infos', 'securite', 'session']
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  const syncedIdRef = useRef(undefined)
  useEffect(() => {
    // On ne réinitialise le formulaire que lorsque l'utilisateur connecté
    // change (connexion/déconnexion), pas à chaque rafraîchissement du profil.
    if (syncedIdRef.current === user?.id) return
    syncedIdRef.current = user?.id
    setForm(formFromUser(user))
  }, [user])

  // On recharge le profil depuis le serveur pour toujours afficher des
  // informations complètes et à jour, même si la session stockée est ancienne.
  useEffect(() => {
    if (!user?.id) return
    let active = true
    authApi
      .me()
      .then(({ data }) => {
        if (!active) return
        const profile = { ...data, role: resolveRole(data) }
        signIn(profile)
        if (!editedRef.current) setForm(formFromUser(profile))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user?.id, signIn])

  useEffect(() => {
    return () => {
      if (profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview)
    }
  }, [profilePreview])

  const initials =
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ''}`.toUpperCase() ||
    'U'
  const displayName =
    user?.firstName || user?.first_name || user?.username || 'Utilisateur'
  const profileImage = profilePreview || user?.profile_pic || user?.profilePic || ''
  // Téléphone et adresse ne sont demandés qu'aux utilisateurs ayant loué un
  // espace : on les masque tant que le compte est encore un simple acheteur.
  const showContactFields = hasRentedSpace(user)

  const profileSections = [
    { id: 'infos', label: 'Informations personnelles', icon: UserRound },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'session', label: 'Session', icon: KeyRound },
  ]

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const updateField = (event) => {
    editedRef.current = true
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Sélectionnez un fichier image valide.')
      return
    }
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
    const phoneError =
      showContactFields && (form.phone || '').trim()
        ? getPhoneError(form.phone, 'bi')
        : null
    setPhoneError(phoneError)
    if (phoneError) {
      toast.error(phoneError)
      return
    }
    setSaving(true)
    try {
      let updatedProfile = user
      const contactFields = showContactFields
        ? { phone: form.phone, adresse: form.adresse }
        : {}
      const { data } = await api.patch(endpoints.users.me, {
        first_name: form.firstName,
        ...contactFields,
      })
      updatedProfile = { ...updatedProfile, ...data }
      if (profileFile) {
        const imageData = new FormData()
        imageData.append('profile_pic', profileFile)
        const { data } = await api.patch(endpoints.users.me, imageData)
        updatedProfile = { ...updatedProfile, ...data }
      }
      signIn({
        ...updatedProfile,
        firstName: form.firstName,
        first_name: form.firstName,
        ...(showContactFields
          ? { phone: form.phone, adresse: form.adresse }
          : {}),
        email: form.email,
      })
      editedRef.current = false
      setProfileFile(null)
      toast.success('Vos informations ont été mises à jour.')
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object' && !Array.isArray(err.response.data)) {
        const payload = err.response.data
        toast.error(Object.values(payload).flat().join(' ') || 'Enregistrement impossible.')
      } else {
        toast.error("Impossible de joindre le serveur, réessayez.", { id: 'profil-save' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    if (changingPwd) return

    const errors = {}
    if (!pwd.current) errors.current = 'Le mot de passe actuel est requis.'
    if (pwd.next.length < 8) errors.next = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
    if (pwd.confirm !== pwd.next) errors.confirm = 'Les mots de passe ne correspondent pas.'
    setPwdErrors(errors)
    if (Object.keys(errors).length > 0) return

    setChangingPwd(true)
    try {
      await userApi.changePassword({ current_password: pwd.current, new_password: pwd.next })
      toast.success('Votre mot de passe a été mis à jour avec succès.')
      setPwd({ current: '', next: '', confirm: '' })
      setPwdErrors({})
    } catch (error) {
      const data = error.response?.data
      const next = {}
      if (data?.current_password) next.current = data.current_password[0]
      if (data?.new_password) next.next = data.new_password[0]
      if (data?.detail && !next.current && !next.next) next.current = data.detail
      setPwdErrors(next)
      if (Object.keys(next).length === 0) {
        toast.error('Impossible de modifier le mot de passe. Réessayez.')
      }
    } finally {
      setChangingPwd(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <NavBar />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
          <span className="mb-5 grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound size={28} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-extrabold">Vous n'êtes pas connecté</h1>
          <p className="mt-2 text-base-content/65">
            Connectez-vous pour consulter et modifier les paramètres de votre profil.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/connexion" className="btn btn-primary px-7">Se connecter</Link>
            <Link to="/inscription" className="btn btn-ghost">Créer un compte</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <Link to="/accueil" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/65 transition hover:text-primary">
          <ArrowLeft size={16} aria-hidden="true" /> Retour à l'accueil
        </Link>

        <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:items-start">
          <aside aria-label="Navigation du profil" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-base-300 bg-(--surface) p-2 shadow-sm">
              <div className="flex items-center gap-3 border-b border-base-300/70 px-3 py-4">
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-base font-bold text-primary ring-1 ring-primary/25">
                  {profileImage ? <img src={profileImage} alt="" className="h-full w-full object-cover" /> : initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-base-content">{displayName}</p>
                  <p className="truncate text-xs text-base-content/55">{user?.email || 'Gérer mon espace'}</p>
                </div>
              </div>
              <nav className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 pt-3 lg:flex-col lg:overflow-visible lg:pb-0">
                {profileSections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    aria-current={activeSection === id ? 'true' : undefined}
                    className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      activeSection === id
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content/75 hover:bg-base-200 hover:text-primary'
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
        <header className="mb-8 flex flex-col items-start gap-4 border-b border-base-300 pb-6 sm:mb-10 sm:flex-row sm:items-center sm:gap-5 sm:pb-8">
          <label className="group relative flex size-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary/10 text-lg font-bold text-primary ring-1 ring-primary/25 sm:size-16 sm:text-xl" title="Modifier la photo de profil">
            {profileImage ? <img src={profileImage} alt="Photo de profil" className="h-full w-full object-cover" /> : initials}
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
              <ImagePlus size={20} />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleProfileImageChange} />
          </label>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">Paramètres du profil</h1>
            <p className="mt-2 text-base-content/65">
              Gérez vos informations personnelles et la sécurité de votre compte.
            </p>
          </div>
        </header>

        <form onSubmit={handleProfileSubmit} noValidate className="space-y-6">
          <section id="infos" aria-labelledby="infos-heading" className="scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-base-content">
                <UserRound size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 id="infos-heading" className="text-xl font-bold">Informations personnelles</h2>
                <p className="mt-1 text-sm text-base-content/55">Nom, prénom, coordonnées affichées publiquement</p>
              </div>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Field label="Prénom" name="firstName" value={form.firstName} onChange={updateField} required placeholder="Ex. Espoir" />
              <Field label="Nom" name="username" value={form.username} readOnly placeholder="Nom du compte" />
              {showContactFields && (
                <>
                  <Field label="Téléphone" name="phone" isPhone error={phoneError} value={form.phone} onChange={(phone) => {
                    editedRef.current = true
                    setForm((current) => ({ ...current, phone }))
                    setPhoneError((phone || '').trim() ? getPhoneError(phone, 'bi') : null)
                  }} />
                  <Field label="Adresse" name="adresse" value={form.adresse} onChange={updateField} placeholder="Ex. Bujumbura, Rohero" className="sm:col-span-2" />
                </>
              )}
              <Field label="Adresse e-mail" name="email" type="email" value={form.email} onChange={updateField} readOnly className="sm:col-span-2" />
            </div>
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-base-300/70 pt-5">
              <Link to="/accueil" className="btn btn-ghost">Annuler</Link>
              <button type="submit" disabled={saving} className="btn btn-primary px-7">
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Enregistrement…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" /> Enregistrer
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        <form onSubmit={handlePasswordSubmit} noValidate className="mt-6">
          <section id="securite" aria-labelledby="security-heading" className="scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-base-content">
                <Shield size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 id="security-heading" className="text-xl font-bold">Sécurité</h2>
                <p className="mt-1 text-sm text-base-content/55">Modifiez votre mot de passe de connexion</p>
              </div>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-3">
              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="current" className="text-sm font-semibold text-base-content">
                  Mot de passe actuel <span className="ml-1 text-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="current"
                  name="current"
                  type="password"
                  value={pwd.current}
                  onChange={(event) => { setPwd({ ...pwd, current: event.target.value }); setPwdErrors({ ...pwdErrors, current: undefined }) }}
                  className={`input input-bordered w-full bg-base-100 ${pwdErrors.current ? 'input-error' : ''}`}
                />
                {pwdErrors.current && <p className="text-xs text-error">{pwdErrors.current}</p>}
              </div>
              <Field label="Nouveau mot de passe" name="next" type="password" value={pwd.next} onChange={(event) => { setPwd({ ...pwd, next: event.target.value }); setPwdErrors({ ...pwdErrors, next: undefined }) }} error={pwdErrors.next} placeholder="6 caractères minimum" />
              <div className="flex min-w-0 flex-col gap-2">
                <label htmlFor="confirm" className="text-sm font-semibold text-base-content">
                  Confirmation <span className="ml-1 text-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  value={pwd.confirm}
                  onChange={(event) => { setPwd({ ...pwd, confirm: event.target.value }); setPwdErrors({ ...pwdErrors, confirm: undefined }) }}
                  className={`input input-bordered w-full bg-base-100 ${pwdErrors.confirm ? 'input-error' : ''}`}
                />
                {pwdErrors.confirm && <p className="text-xs text-error">{pwdErrors.confirm}</p>}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-base-300/70 pt-5">
              <button type="submit" disabled={changingPwd} className="btn btn-primary px-7">
                {changingPwd ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Enregistrement…
                  </>
                ) : (
                  <>
                    <Lock size={16} aria-hidden="true" /> Modifier le mot de passe
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        <section id="session" aria-labelledby="session-heading" className="mt-6 scroll-mt-24 rounded-lg border border-base-300 bg-(--surface) p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-error/10 text-error">
                <KeyRound size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 id="session-heading" className="text-xl font-bold">Session</h2>
                <p className="mt-1 text-sm text-base-content/55">Connecté en tant que {displayName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                signOut()
                navigate('/')
              }}
              className="btn btn-outline border-error text-error hover:bg-error hover:text-error-content"
            >
              Se déconnecter
            </button>
          </div>
        </section>
          </div>
        </div>
      </main>
    </div>
  )
}