import {
  ArrowRight,
  Eye,
  EyeOff,
  Moon,
  ShieldCheck,
  Sparkles,
  Store,
  Sun,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { authApi, setTokens } from "../../services";

export default function Connexion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login(formData);
      setTokens(data);
      let profile = data.user;
      if (!profile) {
        try {
          profile = (await authApi.me()).data;
        } catch (profileError) {
          console.error("profil après connexion:", profileError);
          profile = { username: formData.username };
        }
      }
      signIn(profile);
      toast.success("Connexion réussie");
      navigate("/");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Nom d'utilisateur ou mot de passe incorrect");
      console.error("connexion:", err);
    } finally {
      setLoading(false);
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
            <Link
              to="/connexion"
              className="inline-flex items-center gap-3 text-xl font-bold tracking-tight"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Store size={23} aria-hidden="true" />
              </span>
              BU-Market
            </Link>
            <span className="mt-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold">
              <Sparkles size={15} className="text-accent" aria-hidden="true" />
              Votre marketplace de confiance
            </span>
            <h2 className="mt-6 max-w-md text-4xl font-extrabold leading-tight xl:text-5xl">
              Retrouvez vos essentiels, simplement.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-primary-content/75">
              Connectez-vous pour retrouver vos produits, vos favoris et une
              sélection pensée pour vous.
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-sm font-medium text-primary-content/80">
            <ShieldCheck size={20} className="text-accent" aria-hidden="true" />
            Une expérience sécurisée et personnalisée
          </div>
        </section>

        <section className="mx-auto w-full max-w-md p-7 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden">
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 text-lg font-bold text-base-content"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
                <Store size={20} />
              </span>
              BU-<span className="text-primary">Market</span>
            </Link>
          </div>
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Bon retour
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-base-content">
              Se connecter
            </h1>
            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Accédez à votre espace personnel et continuez vos achats.
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-5 text-sm">{error}</div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-base-content"
                htmlFor="username"
              >
                Nom d&apos;utilisateur
              </label>
              <input
                id="username"
                className="input input-lg w-full"
                type="text"
                name="username"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold text-base-content"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="input input-lg w-full pr-12"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <button
              className="btn btn-primary w-full gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
              {!loading && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-base-content/65">
            Pas encore de compte ?{" "}
            <Link
              className="font-bold text-primary hover:underline"
              to="/inscription"
            >
              S&apos;inscrire
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
