import { useEffect, useRef, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import api, { endpoints } from '../services/api'
import { authApi } from '../services/authService'
import { hasRentedSpace, resolveRole } from '../utils/roles.js'
import { getPhoneError } from '../utils/phone.js'
import { ROLE_LABELS, TABS, formFromUser } from './profile/profileConstants.js'
import ProfileSidebar from './profile/ProfileSidebar.jsx'
import ProfileInfoTab from './profile/ProfileInfoTab.jsx'
import ProfileSecurityTab from './profile/ProfileSecurityTab.jsx'
import ProfileSessionTab from './profile/ProfileSessionTab.jsx'

/**
 * Paramètres du profil, conçus pour s'afficher À L'INTÉRIEUR de la coquille
 * (`WorkspaceShell`) : la barre latérale de l'espace reste donc toujours
 * visible pendant la modification du profil.
 */
export default function ProfileSettingsPage({ logoutPath = '/' }) {
  const { user, signIn, signOut } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => formFromUser(user))
  const [activeTab, setActiveTab] = useState('infos')
  const [phoneError, setPhoneError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [profileFile, setProfileFile] = useState(null)
  const [profilePreview, setProfilePreview] = useState('')
  const editedRef = useRef(false)
  const syncedIdRef = useRef(undefined)

  useEffect(() => {
    if (syncedIdRef.current === user?.id) return
    syncedIdRef.current = user?.id
    setForm(formFromUser(user))
  }, [user])

  useEffect(() => {
    if (!user?.id) return undefined
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

  useEffect(
    () => () => {
      if (profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview)
    },
    [profilePreview],
  )

  const role = resolveRole(user)
  const roleLabel = ROLE_LABELS[role] || 'Utilisateur'
  const displayName =
    user?.firstName || user?.first_name || user?.username || 'Utilisateur'
  const initials = (
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ''}` ||
    'U'
  ).toUpperCase()
  const profileImage = profilePreview || user?.profile_pic || user?.profilePic || ''
  // Les coordonnées personnelles ne concernent que les comptes ayant loué un
  // espace. Un acheteur ne doit pas les voir dans son profil.
  const showContactFields = hasRentedSpace(user)

  const updateField = (event) => {
    editedRef.current = true
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handlePhone = (phone) => {
    editedRef.current = true
    setForm((current) => ({ ...current, phone }))
    setPhoneError((phone || '').trim() ? getPhoneError(phone, 'bi') : null)
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

  const resetForm = () => {
    editedRef.current = false
    setForm(formFromUser(user))
    setPhoneError(null)
    setProfileFile(null)
    setProfilePreview('')
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    if (saving) return
    const error =
      showContactFields && (form.phone || '').trim()
        ? getPhoneError(form.phone, 'bi')
        : null
    setPhoneError(error)
    if (error) {
      toast.error(error)
      return
    }

    setSaving(true)
    try {
      let updated = user
      const contactFields = showContactFields
        ? { phone: form.phone, adresse: form.adresse }
        : {}
      const { data } = await api.patch(endpoints.users.me, {
        first_name: form.firstName,
        last_name: form.lastName,
        ...contactFields,
      })
      updated = { ...updated, ...data }

      if (profileFile) {
        const imageData = new FormData()
        imageData.append('profile_pic', profileFile)
        const imageResponse = await api.patch(endpoints.users.me, imageData)
        updated = { ...updated, ...imageResponse.data }
      }

      signIn({
        ...updated,
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
      const payload = err.response?.data
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        toast.error(Object.values(payload).flat().join(' ') || 'Enregistrement impossible.')
      } else {
        toast.error('Impossible de joindre le serveur, réessayez.', { id: 'profil-save' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    signOut()
    navigate(logoutPath, { replace: true })
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Paramètres du profil
          </h1>
          <p className="mt-1.5 text-sm text-base-content/60">
            Gérez vos informations personnelles, votre mot de passe et votre session.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BadgeCheck className="size-3.5" /> {roleLabel}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <ProfileSidebar
          profileImage={profileImage}
          initials={initials}
          displayName={displayName}
          user={user}
          form={form}
          showContactFields={showContactFields}
          onImageChange={handleProfileImageChange}
        />

        <div className="min-w-0 space-y-5">
          <div
            role="tablist"
            aria-label="Sections du profil"
            className="flex gap-1 overflow-x-auto rounded-xl border border-base-300 bg-base-200/60 p-1"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-base-content/70 hover:text-base-content'
                }`}
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>

          {activeTab === 'infos' && (
            <ProfileInfoTab
              form={form}
              showContactFields={showContactFields}
              phoneError={phoneError}
              saving={saving}
              updateField={updateField}
              onPhoneChange={handlePhone}
              onReset={resetForm}
              onSubmit={handleProfileSubmit}
            />
          )}

          {activeTab === 'securite' && <ProfileSecurityTab />}

          {activeTab === 'session' && (
            <ProfileSessionTab
              displayName={displayName}
              email={user?.email}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  )
}
