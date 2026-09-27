import { FileQuestion, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/ui.jsx";

/**
 * Page 404 interne à l'espace administrateur. Sans elle, une URL admin
 * inexistante retombait sur la page d'erreur publique.
 */
export function NotFoundAdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Erreur 404"
        title="Page introuvable"
        description="Cette page n'existe pas dans l'espace d'administration."
      />

      <section className="card p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/10 text-brand">
          <FileQuestion size={26} aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm leading-6 text-base-content/60">
          Vérifiez l&apos;adresse saisie ou utilisez le menu latéral pour
          revenir à une section de l&apos;administration.
        </p>
        <Link
          to="/admin/tableau-de-bord"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-soft"
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          Retour au tableau de bord
        </Link>
      </section>
    </>
  );
}
