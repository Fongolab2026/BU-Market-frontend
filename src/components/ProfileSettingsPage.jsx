import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ImagePlus,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import api, { endpoints } from "../services/api";
import { authApi } from "../services/authService";
import { userApi } from "../services/userService";
import { resolveRole } from "../utils/roles.js";
import PhoneInput from "./PhoneInput.jsx";
import { getPhoneError } from "../utils/phone.js";

/**
 * Paramètres du profil, conçus pour s'afficher À L'INTÉRIEUR de la coquille
 * (`WorkspaceShell`) : la barre latérale de l'espace reste donc toujours
 * visible pendant la modification du profil.
 */

const ROLE_LABELS = {
  merchant: "Vendeur",
  admin: "Administrateur",
  client: "Acheteur",
};

const TABS = [
  { id: "infos", label: "Informations", icon: UserRound },
  { id: "securite", label: "Sécurité", icon: Shield },
  { id: "session", label: "Session", icon: KeyRound },
];

const formFromUser = (source) => ({
  firstName: source?.firstName ?? source?.first_name ?? "",
  lastName: source?.lastName ?? source?.last_name ?? "",
  phone: source?.phone ?? source?.phone_number ?? "",
  adresse: source?.adresse ?? source?.address ?? source?.location ?? "",
  email: source?.email ?? "",
});

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  error,
  readOnly = false,
  isPhone = false,
  defaultCountry,
  className = "",
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="text-sm font-semibold text-base-content">
        {label}
        {required && (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {isPhone ? (
        <PhoneInput
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          defaultCountry={defaultCountry}
          error={error || undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          aria-invalid={error ? "true" : undefined}
          className={`input input-bordered w-full bg-base-100 ${readOnly ? "cursor-not-allowed opacity-60" : ""} ${error ? "input-error" : ""}`}
        />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

function Card({ icon: Icon, title, description, children, footer }) {
  return (
    <section className="rounded-2xl border border-base-300 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-base-300/70 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-base-content/55">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex flex-col gap-3 border-t border-base-300/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          {footer}
        </div>
      )}
    </section>
  );
}

export default function ProfileSettingsPage({ logoutPath = "/" }) {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => formFromUser(user));
  const [activeTab, setActiveTab] = useState("infos");
  const [phoneError, setPhoneError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdErrors, setPwdErrors] = useState({});
  const [changingPwd, setChangingPwd] = useState(false);
  const editedRef = useRef(false);

  const syncedIdRef = useRef(undefined);
  useEffect(() => {
    if (syncedIdRef.current === user?.id) return;
    syncedIdRef.current = user?.id;
    setForm(formFromUser(user));
  }, [user]);

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    authApi
      .me()
      .then(({ data }) => {
        if (!active) return;
        const profile = { ...data, role: resolveRole(data) };
        signIn(profile);
        if (!editedRef.current) setForm(formFromUser(profile));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.id, signIn]);

  useEffect(
    () => () => {
      if (profilePreview.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
    },
    [profilePreview],
  );

  const role = resolveRole(user);
  const roleLabel = ROLE_LABELS[role] || "Utilisateur";
  const displayName =
    user?.firstName || user?.first_name || user?.username || "Utilisateur";
  const initials = (
    user?.initials ||
    `${user?.firstName?.[0] || user?.first_name?.[0] || user?.username?.[0] || ""}` ||
    "U"
  ).toUpperCase();
  const profileImage = profilePreview || user?.profile_pic || user?.profilePic || "";

  const updateField = (event) => {
    editedRef.current = true;
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePhone = (phone) => {
    editedRef.current = true;
    setForm((current) => ({ ...current, phone }));
    setPhoneError((phone || "").trim() ? getPhoneError(phone, "bi") : null);
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Sélectionnez un fichier image valide.");
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    editedRef.current = false;
    setForm(formFromUser(user));
    setPhoneError(null);
    setProfileFile(null);
    setProfilePreview("");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const error = (form.phone || "").trim() ? getPhoneError(form.phone, "bi") : null;
    setPhoneError(error);
    if (error) {
      toast.error(error);
      return;
    }
    setSaving(true);
    try {
      let updated = user;
      const { data } = await api.patch(endpoints.users.me, {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        adresse: form.adresse,
      });
      updated = { ...updated, ...data };
      if (profileFile) {
        const imageData = new FormData();
        imageData.append("profile_pic", profileFile);
        const imageResponse = await api.patch(endpoints.users.me, imageData);
        updated = { ...updated, ...imageResponse.data };
      }
      signIn({
        ...updated,
        firstName: form.firstName,
        lastName: form.lastName,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        adresse: form.adresse,
        email: form.email,
      });
      editedRef.current = false;
      setProfileFile(null);
      toast.success("Vos informations ont été mises à jour.");
    } catch (err) {
      const payload = err.response?.data;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        toast.error(Object.values(payload).flat().join(" ") || "Enregistrement impossible.");
      } else {
        toast.error("Impossible de joindre le serveur, réessayez.", { id: "profil-save" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (changingPwd) return;
    const errors = {};
    if (!pwd.current) errors.current = "Le mot de passe actuel est requis.";
    if (pwd.next.length < 8)
      errors.next = "Le nouveau mot de passe doit contenir au moins 8 caractères.";
    if (pwd.confirm !== pwd.next)
      errors.confirm = "Les mots de passe ne correspondent pas.";
    setPwdErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setChangingPwd(true);
    try {
      await userApi.changePassword({
        current_password: pwd.current,
        new_password: pwd.next,
      });
      toast.success("Votre mot de passe a été mis à jour avec succès.");
      setPwd({ current: "", next: "", confirm: "" });
      setPwdErrors({});
    } catch (error) {
      const data = error.response?.data;
      const next = {};
      if (data?.current_password) next.current = data.current_password[0];
      if (data?.new_password) next.next = data.new_password[0];
      if (data?.detail && !next.current && !next.next) next.current = data.detail;
      setPwdErrors(next);
      if (Object.keys(next).length === 0)
        toast.error("Impossible de modifier le mot de passe. Réessayez.");
    } finally {
      setChangingPwd(false);
    }
  };

  const handleLogout = () => {
    signOut();
    navigate(logoutPath, { replace: true });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Paramètres du profil
          </h1>
          <p className="mt-1.5 text-sm text-base-content/60">
            Gérez vos informations personnelles, votre mot de passe et votre session.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BadgeCheck className="size-3.5" /> {roleLabel}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-20">
          <section className="overflow-hidden rounded-2xl border border-base-300 bg-white shadow-sm">
            <div className="h-20 bg-gradient-to-br from-primary to-secondary" />
            <div className="-mt-10 px-5 pb-5">
              <label
                className="group relative flex size-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-primary/10 text-xl font-bold text-primary shadow-sm"
                title="Modifier la photo de profil"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Photo de profil" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
                  <ImagePlus size={18} />
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleProfileImageChange} />
              </label>

              <h2 className="mt-3 truncate text-lg font-bold">{displayName}</h2>
              <p className="truncate text-sm text-base-content/55">{user?.email}</p>

              <dl className="mt-5 space-y-3 border-t border-base-300/70 pt-4 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-base-content/40" />
                  <span className="truncate text-base-content/75">
                    {form.phone || "Téléphone non renseigné"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 shrink-0 text-base-content/40" />
                  <span className="truncate text-base-content/75">
                    {form.adresse || "Adresse non renseignée"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-base-content/40" />
                  <span className="truncate text-base-content/75">{user?.email || "—"}</span>
                </div>
                {user?.date_joined && (
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 shrink-0 text-base-content/40" />
                    <span className="truncate text-base-content/75">
                      Membre depuis{" "}
                      {new Date(user.date_joined).toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </dl>
            </div>
          </section>
        </aside>

        <div className="min-w-0 space-y-5">
          <div
            role="tablist"
            aria-label="Sections du profil"
            className="flex gap-1 overflow-x-auto rounded-xl border border-base-300 bg-base-200/60 p-1"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === id
                    ? "bg-white text-primary shadow-sm"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>

          {activeTab === "infos" && (
            <form onSubmit={handleProfileSubmit} noValidate>
              <Card
                icon={UserRound}
                title="Informations personnelles"
                description="Nom, prénom et coordonnées affichés sur votre profil."
                footer={
                  <>
                    <button type="button" className="btn btn-ghost" onClick={resetForm}>
                      Réinitialiser
                    </button>
                    <button type="submit" disabled={saving} className="btn btn-primary px-7">
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Enregistrement…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} aria-hidden="true" /> Enregistrer
                        </>
                      )}
                    </button>
                  </>
                }
              >
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Prénom" name="firstName" value={form.firstName} onChange={updateField} required placeholder="Ex. Espoir" />
                  <Field label="Nom" name="lastName" value={form.lastName} onChange={updateField} required placeholder="Ex. Durand" />
                  <Field label="Téléphone" name="phone" isPhone error={phoneError} value={form.phone} onChange={handlePhone} />
                  <Field label="Adresse" name="adresse" value={form.adresse} onChange={updateField} placeholder="Ex. Bujumbura, Rohero" className="sm:col-span-2" />
                  <Field label="Adresse e-mail" name="email" type="email" value={form.email} onChange={updateField} readOnly className="sm:col-span-2" />
                </div>
              </Card>
            </form>
          )}

          {activeTab === "securite" && (
            <form onSubmit={handlePasswordSubmit} noValidate>
              <Card
                icon={Shield}
                title="Sécurité"
                description="Modifiez le mot de passe utilisé pour vous connecter."
                footer={
                  <button type="submit" disabled={changingPwd} className="btn btn-primary px-7">
                    {changingPwd ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Enregistrement…
                      </>
                    ) : (
                      <>
                        <Lock size={16} aria-hidden="true" /> Modifier le mot de passe
                      </>
                    )}
                  </button>
                }
              >
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-3">
                  <div className="flex min-w-0 flex-col gap-2">
                    <label htmlFor="current" className="text-sm font-semibold text-base-content">
                      Mot de passe actuel <span className="ml-1 text-error" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="current"
                      name="current"
                      type="password"
                      value={pwd.current}
                      onChange={(e) => {
                        setPwd({ ...pwd, current: e.target.value });
                        setPwdErrors({ ...pwdErrors, current: undefined });
                      }}
                      className={`input input-bordered w-full bg-base-100 ${pwdErrors.current ? "input-error" : ""}`}
                    />
                    {pwdErrors.current && <p className="text-xs text-error">{pwdErrors.current}</p>}
                  </div>
                  <Field
                    label="Nouveau mot de passe"
                    name="next"
                    type="password"
                    value={pwd.next}
                    onChange={(e) => {
                      setPwd({ ...pwd, next: e.target.value });
                      setPwdErrors({ ...pwdErrors, next: undefined });
                    }}
                    error={pwdErrors.next}
                    placeholder="8 caractères minimum"
                  />
                  <div className="flex min-w-0 flex-col gap-2">
                    <label htmlFor="confirm" className="text-sm font-semibold text-base-content">
                      Confirmation <span className="ml-1 text-error" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      value={pwd.confirm}
                      onChange={(e) => {
                        setPwd({ ...pwd, confirm: e.target.value });
                        setPwdErrors({ ...pwdErrors, confirm: undefined });
                      }}
                      className={`input input-bordered w-full bg-base-100 ${pwdErrors.confirm ? "input-error" : ""}`}
                    />
                    {pwdErrors.confirm && <p className="text-xs text-error">{pwdErrors.confirm}</p>}
                  </div>
                </div>
              </Card>
            </form>
          )}

          {activeTab === "session" && (
            <Card
              icon={KeyRound}
              title="Session et déconnexion"
              description="Informations sur votre session en cours."
            >
              <div className="flex flex-col gap-4 rounded-xl border border-base-300 bg-base-200/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Connecté en tant que {displayName}</p>
                  <p className="truncate text-xs text-base-content/60">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline shrink-0 border-error text-error hover:bg-error hover:text-error-content"
                >
                  <LogOut className="size-4" /> Se déconnecter
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
