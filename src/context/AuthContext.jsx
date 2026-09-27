import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken } from "../services/api.js";
import { authApi } from "../services/authService.js";

const AuthContext = createContext(null);
const SESSION_KEY = "vima_demo_session";
const DEMO_ROLE_KEY = "vima_demo_role";
// Le mode démo est opt-in : sans VITE_ENABLE_DEMO_ADMIN=true, la vraie session
// JWT est utilisée.
const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO_ADMIN === "true";
const demoAdmin = {
  id: "usr-admin-001",
  firstName: "Julien",
  email: "julien.faure@bumarket.app",
  role: "admin",
  initials: "J",
};
const demoMerchant = {
  id: "usr-merchant-001",
  firstName: "Espoir",
  email: "espoir.durand@bumarket.app",
  role: "merchant",
  initials: "E",
};
const demoUserFor = (role) => (role === "merchant" ? demoMerchant : demoAdmin);

function readSession() {
  if (DEMO_ENABLED) {
    const role =
      localStorage.getItem(DEMO_ROLE_KEY) === "merchant" ? "merchant" : "admin";
    const user = demoUserFor(role);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  const storedSession = localStorage.getItem(SESSION_KEY);
  if (storedSession) {
    try {
      return JSON.parse(storedSession);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  // À chaque rechargement de page, on resynchronise la session avec le backend :
  // le profil mis en cache peut être incomplet (champ manquant) ou périmé.
  useEffect(() => {
    if (DEMO_ENABLED) return;

    if (!getAccessToken()) {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      return;
    }

    let cancelled = false;
    authApi
      .me()
      .then(({ data }) => {
        if (cancelled) return;
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
        setUser(data);
      })
      .catch((err) => {
        if (cancelled) return;
        // 401/403 : le jeton n'est plus valable, on déconnecte vraiment.
        // Autre erreur (réseau, 5xx) : on garde la session en cache plutôt que
        // de déconnecter l'utilisateur pour une panne passagère.
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem(SESSION_KEY);
          setUser(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      signIn: (nextUser) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      signOut: () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
      switchDemoRole: (role) => {
        localStorage.setItem(DEMO_ROLE_KEY, role);
        const nextUser = demoUserFor(role);
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}
