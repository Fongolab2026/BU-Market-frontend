import { Calendar, ImagePlus, Mail, MapPin, Phone } from 'lucide-react'

/** Carte de gauche : avatar modifiable et coordonnées du compte. */
export default function ProfileSidebar({
  profileImage,
  initials,
  displayName,
  user,
  form,
  showContactFields,
  onImageChange,
}) {
  return (
    <aside className="lg:sticky lg:top-20">
      <section className="overflow-hidden rounded-2xl border border-base-300 bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-br from-primary to-secondary" />
        <div className="-mt-10 px-5 pb-5">
          <label
            className="group relative flex size-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary/10 text-xl font-bold text-primary shadow-sm"
            title="Modifier la photo de profil"
          >
            {profileImage ? (
              <img src={profileImage} alt="Photo de profil" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
              <ImagePlus size={18} />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={onImageChange} />
          </label>

          <h2 className="mt-3 truncate text-lg font-bold">{displayName}</h2>
          <p className="truncate text-sm text-base-content/55">{user?.email}</p>

          <dl className="mt-5 space-y-3 border-t border-base-300/70 pt-4 text-sm">
            {showContactFields && (
              <>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-base-content/40" />
                  <span className="truncate text-base-content/75">
                    {form.phone || 'Téléphone non renseigné'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0 text-base-content/40" />
                  <span className="truncate text-base-content/75">
                    {form.adresse || 'Adresse non renseignée'}
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-base-content/40" />
              <span className="truncate text-base-content/75">{user?.email || '—'}</span>
            </div>
            {user?.date_joined && (
              <div className="flex items-center gap-3">
                <Calendar className="size-4 shrink-0 text-base-content/40" />
                <span className="truncate text-base-content/75">
                  Membre depuis{' '}
                  {new Date(user.date_joined).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </dl>
        </div>
      </section>
    </aside>
  )
}
