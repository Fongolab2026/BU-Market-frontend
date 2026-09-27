import { LogOut, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/AuthContext.jsx";

/**
 * Page d'accès refusé, displayed quand un compte connecté ne possède pas
 * le rôle administrateur. Elle reste volontairement dans /admin : aucun lien
 * ne redirige vers l'espace client ou commerçant.
 */
export function AccesRefuseAdminPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleReconnect = () => {
    signOut();
    navigate("/admin/connexion", { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-base-100 px-4 py-10">
      <section className="card w-full max-w-md p-7 text-center sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-600/10">
          <ShieldAlert size={26} aria-hidden="true" />
        </span>

        <p className="mt-5 text-xs font-semibold tracking-wide text-accent">
          Accès restreint
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-base-content">
          Accès refusé
        </h1>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          Ce compte ne dispose pas des droits d&apos;administration de la
          plateforme. Merci de vous connecter avec un compte gestionnaire.
        </p>

        {user && (
          <p className="mt-4 rounded-lg bg-base-200 px-3 py-2 text-xs font-medium text-base-content/70">
            Connecté en tant que{" "}
            {user.email || user.username || "compte inconnu"}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleReconnect}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
          >
            <LogOut size={16} aria-hidden="true" />
            Utiliser un autre compte
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/connexion")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-base-300 px-4 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-100"
          >
            Retour à la connexion
          </button>
        </div>
      </section>
    </div>
  );
}
