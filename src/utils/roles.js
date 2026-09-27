// Valeurs réellement produites par le backend Django (users/models.py -> User.Role)
// et leurs alias équivalents côté interface.
const ADMIN_ROLES = ["superadmin", "admin", "administrator", "gestionnaire", "superuser"];
const MERCHANT_ROLES = ["seller", "merchant", "commercant", "vendor", "boutique"];
const CLIENT_ROLES = ["buyer", "client", "customer", "acheteur", "user"];

/**
 * Normalise le rôle renvoyé par l'API vers les trois rôles utilisés par
 * l'application (admin | merchant | client) afin que les gardes de route
 * puissent comparer une valeur stable.
 */
export function resolveRole(profile) {
  if (!profile) return null;
  if (profile.is_superuser || profile.is_staff) return "admin";
  const role = String(profile.role ?? "").trim().toLowerCase();
  if (ADMIN_ROLES.includes(role)) return "admin";
  if (MERCHANT_ROLES.includes(role)) return "merchant";
  if (CLIENT_ROLES.includes(role)) return "client";
  return role || null;
}

export const isAdmin = (profile) => resolveRole(profile) === "admin";
