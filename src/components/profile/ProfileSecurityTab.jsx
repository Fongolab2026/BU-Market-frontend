import { useState } from 'react'
import { Loader2, Lock, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi } from '../../services/userService'
import { Card, Field } from './ProfileFormFields.jsx'

/** Onglet Sécurité : changement de mot de passe autonome. */
export default function ProfileSecurityTab() {
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [changing, setChanging] = useState(false)

  const update = (name) => (event) => {
    setPwd((current) => ({ ...current, [name]: event.target.value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (changing) return

    const nextErrors = {}
    if (!pwd.current) nextErrors.current = 'Le mot de passe actuel est requis.'
    if (pwd.next.length < 8)
      nextErrors.next = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
    if (pwd.confirm !== pwd.next)
      nextErrors.confirm = 'Les mots de passe ne correspondent pas.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setChanging(true)
    try {
      await userApi.changePassword({
        current_password: pwd.current,
        new_password: pwd.next,
      })
      toast.success('Votre mot de passe a été mis à jour avec succès.')
      setPwd({ current: '', next: '', confirm: '' })
      setErrors({})
    } catch (error) {
      const data = error.response?.data
      const apiErrors = {}
      if (data?.current_password) apiErrors.current = data.current_password[0]
      if (data?.new_password) apiErrors.next = data.new_password[0]
      if (data?.detail && !apiErrors.current && !apiErrors.next) apiErrors.current = data.detail
      setErrors(apiErrors)
      if (Object.keys(apiErrors).length === 0)
        toast.error('Impossible de modifier le mot de passe. Réessayez.')
    } finally {
      setChanging(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card
        icon={Shield}
        title="Sécurité"
        description="Modifiez le mot de passe utilisé pour vous connecter."
        footer={
          <button type="submit" disabled={changing} className="btn btn-primary px-7">
            {changing ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Enregistrement…
              </>
            ) : (
              <>
                <Lock size={16} aria-hidden="true" /> Modifier le mot de passe
              </>
            )}
          </button>
        }
      >
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
              onChange={update('current')}
              className={`input input-bordered w-full bg-base-100 ${errors.current ? 'input-error' : ''}`}
            />
            {errors.current && <p className="text-xs text-error">{errors.current}</p>}
          </div>

          <Field
            label="Nouveau mot de passe"
            name="next"
            type="password"
            value={pwd.next}
            onChange={update('next')}
            error={errors.next}
            placeholder="8 caractères minimum"
          />

          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="confirm" className="text-sm font-semibold text-base-content">
              Confirmation <span className="ml-1 text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={pwd.confirm}
              onChange={update('confirm')}
              className={`input input-bordered w-full bg-base-100 ${errors.confirm ? 'input-error' : ''}`}
            />
            {errors.confirm && <p className="text-xs text-error">{errors.confirm}</p>}
          </div>
        </div>
      </Card>
    </form>
  )
}
