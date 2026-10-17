/**
 * Pastille d'avatar réutilisable.
 *
 * Affiche la photo de profil fournie (`src`) et, en son absence, un contenu de
 * repli : soit `fallback` (nœud React), soit les initiales calculées à partir
 * de `name`. Le conteneur est toujours en `overflow-hidden` pour que l'image
 * épouse la forme (cercle, carré arrondi, etc.).
 */
const initialsOf = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function Avatar({
  src,
  name = "",
  fallback,
  alt = "",
  className = "",
}) {
  return (
    <span className={`grid place-items-center overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        (fallback ?? initialsOf(name))
      )}
    </span>
  );
}
