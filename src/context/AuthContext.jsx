import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAccessToken, clearTokens } from "../services/api.js";
import { authApi } from "../services/authService.js";
import { resolveRole } from "../utils/roles.js";

const AuthContext = createContext(null);
const SESSION_KEY = "bumarket_session";

function readStoredSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed ? { ...parsed, role: resolveRole(parsed) } : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function bootstrap() {
  if (!getAccessToken()) return { user: null, loading: false };

  const session = readStoredSession();
  if (session) return { user: session, loading: false };

  return { user: null, loading: true };
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(bootstrap);
  const { user, loading } = state;

  useEffect(() => {
    if (!loading) return;
    let active = true;

    authApi
      .me()
      .then(({ data }) => {
        if (!active) return;
        const role = resolveRole(data);
        const profile = { ...data, role };
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        setState({ user: profile, loading: false });
      })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 401 || err.response?.status === 403) {
          clearTokens();
        }
        setState({ user: null, loading: false });
      });

    return () => {
      active = false;
    };
  }, [loading]);

  const signIn = useCallback((profile) => {
    const role = resolveRole(profile);
    const next = { ...profile, role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setState({ user: next, loading: false });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    clearTokens();
    setState({ user: null, loading: false });
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}
