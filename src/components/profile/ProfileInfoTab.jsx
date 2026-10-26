import { CheckCircle2, Loader2, UserRound } from 'lucide-react'
import { Card, Field } from './ProfileFormFields.jsx'

export default function ProfileInfoTab({
  form,
  showContactFields,
  phoneError,
  saving,
  updateField,
  onPhoneChange,
  onReset,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <Card
        icon={UserRound}
        title="Informations personnelles"
        description="Nom, prénom et coordonnées affichés sur votre profil."
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={onReset}>
              Réinitialiser
            </button>
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
          </>
        }
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field
            label="Prénom"
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            required
            placeholder="Ex. Espoir"
          />
          <Field
            label="Nom"
            name="username"
            value={form.username}
            readOnly
            placeholder="Nom du compte"
          />
          {showContactFields && (
            <>
              <Field
                label="Téléphone"
                name="phone"
                isPhone
                error={phoneError}
                value={form.phone}
                onChange={onPhoneChange}
              />
              <Field
                label="Adresse"
                name="adresse"
                value={form.adresse}
                onChange={updateField}
                placeholder="Ex. Bujumbura, Rohero"
                className="sm:col-span-2"
              />
            </>
          )}
          <Field
            label="Adresse e-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            readOnly
            className="sm:col-span-2"
          />
        </div>
      </Card>
    </form>
  )
}
