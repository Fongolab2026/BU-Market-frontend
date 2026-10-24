/**
 * Transforme une erreur axios / DRF en messages affichables par un formulaire.
 *
 * Règle d'or : une erreur ne doit jamais être muette. Même une réponse
 * inattendue (HTML d'erreur, 404 d'un autre serveur, panne réseau) produit un
 * message général visible par l'utilisateur.
 *
 * Retourne :
 * - `fields` : erreurs par champ (username, email, password...) ;
 * - `general` : message à afficher dans le bandeau du formulaire.
 */
const SYSTEM_KEYS = new Set(["detail", "non_field_errors", "message", "error"]);

// Clés techniques ajoutées par Laravel/Symfony dans les réponses de debug :
// elles ne doivent jamais être affichées dans un formulaire.
const IGNORED_KEYS = new Set(["exception", "file", "line", "trace"]);

const toMessage = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && typeof value.message === "string") {
    return value.message.trim();
  }
  return "";
};

export function extractApiError(error) {
  const data = error?.response?.data;

  if (!data) {
    return {
      general:
        "Erreur de connexion au serveur. Vérifiez que l'API est démarrée, puis réessayez.",
      fields: {},
    };
  }

  // Réponse texte ou HTML (erreur 500 Django en DEBUG, page d'un proxy...).
  if (typeof data !== "object" || Array.isArray(data)) {
    return {
      general: "Le serveur a renvoyé une réponse inattendue. Réessayez ou contactez le support.",
      fields: {},
    };
  }

  const fields = {};
  let general = "";

  Object.entries(data).forEach(([key, value]) => {
    if (IGNORED_KEYS.has(key)) return;

    const message = toMessage(value);
    if (!message) return;

    if (SYSTEM_KEYS.has(key)) {
      general = general || message;
    } else {
      fields[key] = message;
    }
  });

  if (!general && Object.keys(fields).length === 0) {
    general = "Une erreur est survenue. Réessayez.";
  }

  return { general, fields };
}
