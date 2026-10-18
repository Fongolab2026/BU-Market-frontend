import { AlertCircle } from 'lucide-react'

/**
 * Champ de formulaire des écrans d'authentification.
 *
 * Même hauteur (`h-12`), même rayon et même halo de focus que les autres
 * champs de l'application (classe `.field-input` de `theme.css`), avec une
 * icône optionnelle à gauche et un contenu optionnel à droite (ex. bouton
 * « afficher le mot de passe »).
 */
export default function AuthField({
  id,
  label,
  icon: Icon,
  type = 'text',
  error,
  hint,
  endAdornment,
  className = '',
  ...inputProps
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-base-content" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40"
            aria-hidden="true"
          />
        )}

        <input
          id={id}
          type={type}
          className={`field-input h-12 w-full text-sm ${Icon ? 'pl-11' : 'pl-4'} ${
            endAdornment ? 'pr-12' : 'pr-4'
          } ${error ? 'border-error' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          {...inputProps}
        />

        {endAdornment}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-error">
          <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-xs text-base-content/50">{hint}</p>
      ) : null}
    </div>
  )
}
