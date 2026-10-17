import { Component } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { AlertTriangle, Home, RotateCw } from "lucide-react";

/**
 * Écran d'erreur commun (design de l'application).
 *
 * Volontairement autonome (pas de contexte, pas de routeur) pour pouvoir
 * s'afficher même lorsque le reste de l'application a planté.
 */
function ErrorScreen({ title, message, details }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4 py-10">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 p-8 text-center shadow-xl">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle size={32} aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-base-content">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-base-content/65">{message}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary gap-2"
          >
            <RotateCw size={17} aria-hidden="true" />
            Recharger la page
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="btn btn-ghost gap-2"
          >
            <Home size={17} aria-hidden="true" />
            Retour à l&apos;accueil
          </button>
        </div>

        {details ? (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-base-content/45">
              Détails techniques
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-base-200 p-3 text-[11px] leading-5 text-base-content/70">
              {details}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}

const devDetails = (error) =>
  import.meta.env.DEV ? (error?.stack || error?.message || String(error)) : "";

/**
 * Frontière d'erreur globale (hors routeur) : attrape toute erreur de rendu et
 * affiche un écran soigné plutôt que la page technique de React.
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur inattendue de l'application :", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="Erreur inattendue de l'application"
          message="Quelque chose s'est mal passé. Rechargez la page ou revenez à l'accueil pour continuer."
          details={devDetails(this.state.error)}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Frontière d'erreur de route (React Router) : remplace la page « Unexpected
 * Application Error! » par défaut par un écran cohérent avec l'application.
 */
export function RouteError() {
  const error = useRouteError();

  let title = "Erreur inattendue de l'application";
  let message =
    "Quelque chose s'est mal passé. Rechargez la page ou revenez à l'accueil pour continuer.";

  if (isRouteErrorResponse(error)) {
    title = `Erreur ${error.status}`;
    message =
      error.status === 404
        ? "La page demandée est introuvable."
        : error.statusText || "La page demandée n'a pas pu être chargée.";
  }

  return (
    <ErrorScreen title={title} message={message} details={devDetails(error)} />
  );
}

export default ErrorBoundary;
