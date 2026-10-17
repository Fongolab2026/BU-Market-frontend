import libphonenumber from 'google-libphonenumber'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const PNF = libphonenumber.PhoneNumberFormat
const PNT = libphonenumber.PhoneNumberType

/** Formats un numéro au format international E.164 (+25766123456). */
export function toE164(phone) {
  try {
    return phoneUtil.format(phoneUtil.parse(phone), PNF.E164)
  } catch {
    return ''
  }
}

/** Vérifie très strictement qu'un numéro est valide pour le pays indiqué. */
export function isValidPhone(phone, countryIso2) {
  if (!phone || !phone.trim()) return false
  const region = String(countryIso2 || '').toUpperCase()
  try {
    return phoneUtil.isValidNumberForRegion(phoneUtil.parse(phone), region)
  } catch {
    return false
  }
}

/** Vérifie qu'un numéro national (sans indicatif pays) est valide pour un pays. */
export function isValidNationalPhone(nationalNumber, countryIso2) {
  if (!nationalNumber || !nationalNumber.trim()) return false
  if (!countryIso2) return false
  const region = String(countryIso2).toUpperCase()
  try {
    return phoneUtil.isValidNumberForRegion(phoneUtil.parse(nationalNumber, region), region)
  } catch {
    return false
  }
}

/**
 * Types de numéros à proscrire : surtaxés, mémorielles et thématiques.
 * Un utilisateur ne doit pas pouvoir renseigner ce type de numéro.
 */
const BLOCKED_TYPES = [PNT.PREMIUM_RATE, PNT.SHARED_COST, PNT.VOICEMAIL, PNT.UAN, PNT.PAGER]

/** Retourne null si le numéro est acceptable, sinon un message d'erreur. */
export function getPhoneError(phone, countryIso2) {
  if (!phone || !phone.trim()) return null
  if (!isValidPhone(phone, countryIso2)) {
    return 'Numéro invalide pour ce pays. Vérifiez le nombre de chiffres saisis.'
  }
  let type
  try {
    type = phoneUtil.getNumberType(phoneUtil.parse(phone))
  } catch {
    return 'Numéro invalide.'
  }
  if (BLOCKED_TYPES.includes(type)) {
    return 'Ce type de numéro (surtaxé ou non vocal) n’est pas autorisé.'
  }
  return null
}
