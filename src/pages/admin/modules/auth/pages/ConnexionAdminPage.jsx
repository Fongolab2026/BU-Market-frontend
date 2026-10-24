import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthField from "../../../../../components/AuthField.jsx";
import AuthLayout from "../../../../../components/AuthLayout.jsx";
import { useAuth } from "../../../../../context/AuthContext.jsx";
import { isAuthenticated } from "../../../../../services/api.js";
import { extractApiError } from "../../../../../utils/apiError.js";
import { AdminAccessError, authAdminService } from "../services/authAdminService.js";

const emptyForm = { email: "", password: "" };

export function ConnexionAdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Deja connecte en tant qu'admin : pas besoin de repasser par le formulaire.
  if (isAuthenticated() && user?.role === "admin") {
    return <Navigate to="/admin/tableau-de-bord" replace />;
  }

  const setFormField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Adresse e-mail requise";
    if (!form.password) nextErrors.password = "Mot de passe requis";
    else if (form.password.length < 8) nextErrors.password = "8 caractères minimum";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError("");
    try {
      const profile = await authAdminService.login(form);
      signIn(profile);
      toast.success("Connexion administrateur réussie");
      const from = location.state?.from;
      navigate(from && from.startsWith("/admin") ? from : "/admin/tableau-de-bord", {
        replace: true,
      });
    } catch (err) {
      if (err instanceof AdminAccessError) {
        setError(err.message);
        toast.error(err.message);
      } else {
        const { general, fields } = extractApiError(err);
        const message =
          err.response?.status === 401
            ? "E-mail ou mot de passe incorrect"
            : general || fields.email || fields.username || "Connexion impossible";
        setError(message);
        toast.error("Connexion impossible");
      }
      console.error("connexion administrateur:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      brand={{
        to: "/admin/connexion",
        label: "BUJA MARKET",
        mark: <span className="text-lg font-black">B</span>,
      }}
      heroBadge={
        <>
          <ShieldCheck size={15} className="text-accent" aria-hidden="true" />
          Espace réservé à l&apos;équipe d&apos;administration
        </>
      }
      heroTitle="Pilotez la marketplace."
      heroText="Boutiques, produits, commandes et modération : toute la plateforme se gère depuis cet espace sécurisé."
      heroFooter={
        <>
          <Lock size={20} className="text-accent" aria-hidden="true" />
          Accès protégé par jeton d&apos;authentification
        </>
      }
      eyebrow="Administration"
      title="Connexion au tableau de bord"
      subtitle="Saisissez vos identifiants de gestionnaire pour continuer."
      backgroundImage="/images/hero/hero-5.jpg"
      alert={
        error ? (
          <div
            role="alert"
            className="alert alert-error mb-5 flex items-start gap-2 text-sm"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : null
      }
      footer={
        <>
          Accès réservé aux gestionnaires de la plateforme. En cas de mot de passe
          oublié, contactez l&apos;administrateur réseau.
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="admin-email"
          label="Adresse e-mail"
          icon={User}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="admin@bumarket.app"
          value={form.email}
          onChange={(event) => setFormField("email", event.target.value)}
          error={errors.email}
          required
        />

        <AuthField
          id="admin-password"
          label="Mot de passe"
          icon={KeyRound}
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          value={form.password}
          onChange={(event) => setFormField("password", event.target.value)}
          error={errors.password}
          required
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
              aria-label={
                showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary h-12 w-full gap-2"
        >
          {submitting ? "Connexion..." : "Se connecter"}
          {!submitting && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
    </AuthLayout>
  );
}
