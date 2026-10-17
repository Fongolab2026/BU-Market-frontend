import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PhoneInput as IntlPhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { getPhoneError, isValidPhone } from '../utils/phone.js'

/**
 * Champ téléphone international avec validation stricte.
 *
 * - Le pays sélectionné fait foi : le numéro saisi est interprété comme un
 *   numéro national de ce pays, ce qui empêche de saisir n'importe quoi.
 * - `onChange` renvoie le numéro au format E.164 (ex. +25766123456).
 * - `getPhoneError` est exporté via utils/phone.js pour la validation au submit.
 */
export default function PhoneInput({
  id,
  name,
  value = '',
  onChange,
  placeholder,
  required = false,
  error = false,
  defaultCountry = 'bi',
  size = 'md',
}) {
  const [countryIso2, setCountryIso2] = useState(defaultCountry)

  const height = size === 'lg' ? '2.5rem' : size === 'sm' ? '2.125rem' : '2.375rem'
  const fontSize = size === 'lg' ? '0.9375rem' : size === 'sm' ? '0.8125rem' : '0.875rem'
  const filled = Boolean(value && value.trim())

  // Un numéro n'est affiché comme invalide que s'il est déjà saisi en partie :
  // un champ laissé vide au repos reste neutre (l'erreur « requis » vient du
  // formulaire). La vérification est stricte (google-libphonenumber) et tient
  // compte du pays sélectionné.
  const inlineError = useMemo(() => {
    if (!filled) return null
    if (isValidPhone(value, countryIso2)) return null
    return getPhoneError(value, countryIso2)
  }, [value, countryIso2, filled])

  const showError = error || Boolean(inlineError)
  const isValid = filled && !inlineError && !error
  const message = error || inlineError

  const rootStyle = {
    width: '100%',
    '--react-international-phone-height': height,
    '--react-international-phone-font-size': fontSize,
  }

  return (
    <div className="w-full">
      <div
        className="phone-input relative"
        data-error={showError ? 'true' : 'false'}
        style={rootStyle}
      >
        <IntlPhoneInput
          defaultCountry={defaultCountry}
          value={value || ''}
          onChange={(phone, meta) => {
            // Si seul l'indicatif est saisi, on considère le champ comme vide
            const onlyDialCode = meta?.country && phone === `+${meta.country.dialCode}`
            if (meta?.country?.iso2) setCountryIso2(meta.country.iso2)
            onChange?.(onlyDialCode ? '' : phone)
          }}
          placeholder={placeholder}
          className="w-full"
          preferredCountries={['bi', 'rw', 'cd', 'tz', 'ke']}
          countrySelectorStyleProps={{ buttonClassName: 'px-2' }}
          inputClassName="w-full pr-9"
          inputProps={{
            id,
            name,
            required,
            type: 'tel',
            inputMode: 'tel',
            autoComplete: 'tel',
            'aria-invalid': showError ? 'true' : undefined,
          }}
        />

        {/* Validation en direct : croix rouge ou coche verte */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-3 flex items-center transition-opacity duration-200 ${
            isValid || showError ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isValid ? (
            <CheckCircle2 size={17} className="text-success" />
          ) : (
            <XCircle size={17} className="text-error" />
          )}
        </span>
      </div>

      <p
        className={`mt-1.5 flex min-h-[1.1rem] items-start gap-1.5 text-xs leading-tight transition-colors ${
          showError ? 'text-error' : 'text-base-content/50'
        }`}
        role={showError ? 'alert' : undefined}
      >
        {showError ? (
          <>
            <XCircle size={13} className="mt-px shrink-0" />
            <span>{message}</span>
          </>
        ) : (
          <span>
            {filled && isValid
              ? 'Numéro valide.'
              : 'Indicatif pays + numéro national, chiffres uniquement.'}
          </span>
        )}
      </p>
    </div>
  )
}
