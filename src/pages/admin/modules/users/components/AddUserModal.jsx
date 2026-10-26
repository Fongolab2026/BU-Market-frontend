import { useState } from 'react'
import { AlertCircle, Eye, EyeOff, Lock, Pencil, ShieldCheck, UsersRound, X } from 'lucide-react'
import PhoneInput from '../../../../../components/PhoneInput.jsx'
import { ModalField, ModalSelect } from './ModalFields.jsx'

/** Création / édition d'un utilisateur (admin). */
export default function AddUserModal({
  editing,
  form,
  formErrors,
  setFormField,
  canSubmit,
  submitting,
  onSubmit,
  onClose,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4">
      <form
        onSubmit={onSubmit}
        className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-base-200 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              {editing ? <Pencil size={18} /> : <UsersRound size={18} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-base-content">
                {editing ? 'Modifier l’utilisateur' : 'Ajouter un utilisateur'}
              </h2>
              <p className="mt-0.5 text-sm text-base-content/55">
                {editing
                  ? `Mettez à jour le compte de ${editing.firstName}.`
                  : 'Créez un compte et attribuez-lui le bon rôle.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="grid size-8 place-items-center rounded-lg text-base-content/45 transition hover:bg-base-100 hover:text-base-content disabled:opacity-50"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {formErrors.general && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{formErrors.general}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField
              label="Prénom"
              value={form.firstName}
              onChange={(value) => setFormField('firstName', value)}
              placeholder="Ex. Antoine"
              error={formErrors.firstName}
              required
            />
            <ModalField
              label="Nom"
              value={form.lastName}
              onChange={(value) => setFormField('lastName', value)}
              placeholder="Ex. Ndayishimiye"
              error={formErrors.lastName}
            />
            <ModalField
              label="Nom d’utilisateur"
              value={form.username}
              onChange={(value) => setFormField('username', value)}
              placeholder="Ex. antoine"
              error={formErrors.username}
              autoComplete="off"
              required
            />
            <ModalField
              label="Adresse e-mail"
              type="email"
              value={form.email}
              onChange={(value) => setFormField('email', value)}
              placeholder="exemple@gmail.com"
              error={formErrors.email}
              autoComplete="off"
              required
            />

            <div className="block">
              <span className="mb-1.5 block text-sm font-semibold text-base-content/80">
                Téléphone <span className="font-normal text-base-content/40">(optionnel)</span>
              </span>
              <PhoneInput
                size="md"
                value={form.phone}
                onChange={(value) => setFormField('phone', value)}
                error={Boolean(formErrors.phone)}
              />
              {formErrors.phone && (
                <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.phone}</p>
              )}
            </div>

            <ModalSelect
              label="Rôle"
              value={form.role}
              onChange={(value) => setFormField('role', value)}
              error={formErrors.role}
            >
              <option value="buyer">Client</option>
              <option value="merchant">Commerçant</option>
              <option value="admin">Gestionnaire</option>
            </ModalSelect>

            <ModalField
              label="Localisation"
              value={form.location}
              onChange={(value) => setFormField('location', value)}
              placeholder="Ex. Bujumbura, Rohero"
              error={formErrors.location}
              className="sm:col-span-2"
            />

            <div className="sm:col-span-2">
              <label className="block">
                <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-base-content/80">
                  <span>
                    {editing ? 'Nouveau mot de passe' : 'Mot de passe'}{' '}
                    <span className="font-normal text-base-content/40">
                      {editing ? '(optionnel)' : ''}
                    </span>
                  </span>
                  {!editing && <span className="text-xs font-normal text-base-content/40">8 caractères minimum</span>}
                </span>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setFormField('password', event.target.value)}
                    placeholder={editing ? 'Laisser vide pour conserver l’actuel' : '••••••••'}
                    autoComplete="new-password"
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm outline-none transition placeholder:text-base-content/40 focus:ring-4 ${
                      formErrors.password
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                        : 'border-base-300 focus:border-brand focus:ring-brand/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-base-content/40 transition hover:bg-base-100 hover:text-base-content"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.password}</p>
                )}
                {!formErrors.password && form.password.length > 0 && form.password.length < 8 && (
                  <p className="mt-1 text-xs font-medium text-amber-600">
                    Le mot de passe doit contenir au moins 8 caractères.
                  </p>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-base-200 bg-base-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-1.5 text-xs text-base-content/45">
            <ShieldCheck size={14} /> Les champs marqués d’un * sont obligatoires.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-base-300 bg-white px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100 disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
