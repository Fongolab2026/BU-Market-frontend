import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/AuthContext.jsx";
import { useTheme } from "../../../../../context/ThemeContext.jsx";
import { isAuthenticated } from "../../../../../services/api.js";
import { AdminAccessError, authAdminService } from "../services/authAdminService.js";

const emptyForm = { username: "", password: "" };

export function ConnexionAdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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
    if (!form.username.trim()) nextErrors.username = "Identifiant requis";
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
        const detail = err.response?.data?.detail;
        setError(detail || "Nom d'utilisateur ou mot de passe incorrect");
        toast.error("Connexion impossible");
      }
      console.error("connexion administrateur:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        className="btn btn-ghost btn-circle absolute right-4 top-4 z-10 sm:right-8 sm:top-8"
      >
        {isDark ? <Sun size={21} /> : <Moon size={21} />}
      </button>

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center overflow-hidden rounded-3xl border border-base-300 bg-[var(--surface)] shadow-2xl shadow-base-content/10 lg:grid-cols-2">
        <section className="home-hero relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-10 text-primary-content lg:flex xl:p-14">
          <div
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-3 text-xl font-bold tracking-tight">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-2xl font-black text-brand">
                B
              </span>
              BUJA MARKET
            </span>
            <span className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold">
              <ShieldCheck size={15} className="text-accent" aria-hidden="true" />
              Espace réservé à l&apos;équipe d&apos;administration
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
              Pilotez la marketplace.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-primary-content/75">
              Boutiques, produits, commandes et modération : toute la plateforme
              se gère depuis cet espace sécurisé.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-sm font-medium text-primary-content/80">
            <Lock size={20} className="text-accent" aria-hidden="true" />
            Accès protégé par jeton d&apos;authentification
          </div>
        </section>

        <section className="mx-auto w-full max-w-md p-7 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden">
            <span className="inline-flex items-center gap-2 text-lg font-bold text-base-content">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-xl font-black text-accent">
                B
              </span>
              BUJA <span className="text-primary">MARKET</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold tracking-wide text-accent">
              Administration
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-base-content">
              Connexion au tableau de bord
            </h2>
            <p className="mt-1 text-sm leading-5 text-base-content/60">
              Saisissez vos identifiants de gestionnaire pour continuer.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-600/10"
            >
              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <Field
              id="admin-username"
              label="Identifiant"
              icon={User}
              error={errors.username}
            >
              <input
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="admin ou admin@bumarket.app"
                value={form.username}
                onChange={(event) => setFormField("username", event.target.value)}
                aria-invalid={Boolean(errors.username)}
                className={`${inputClass} ${errorClass(errors.username)}`}
              />
            </Field>

            <Field
              id="admin-password"
              label="Mot de passe"
              icon={KeyRound}
              error={errors.password}
            >
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                value={form.password}
                onChange={(event) => setFormField("password", event.target.value)}
                aria-invalid={Boolean(errors.password)}
                className={`${inputClass} pr-11 ${errorClass(errors.password)}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-base-content/50 transition hover:bg-base-200 hover:text-base-content"
                aria-label={
                  showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Connexion..." : "Se connecter"}
              {!submitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-base-content/65">
            Accès réservé aux gestionnaires de la plateforme. En cas de mot de
            passe oublié, contactez l&apos;administrateur réseau.
          </p>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full border border-base-300 bg-white px-3 text-sm outline-none transition placeholder:text-base-content/40 focus:border-brand focus:ring-4 focus:ring-brand/10";

const errorClass = (error) =>
  error ? "border-error focus:border-error focus:ring-error/10" : "";

function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex items-center gap-2 text-sm font-bold text-base-content"
        htmlFor={id}
      >
        <Icon size={16} className="text-accent" aria-hidden="true" />
        {label}
      </label>
      <div className="relative">{children}</div>
      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
