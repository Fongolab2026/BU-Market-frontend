import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const SESSION_KEY = 'vima_demo_session'
const demoAdmin = { id: 'usr-admin-001', firstName: 'Aline', lastName: 'Morel', email: 'aline.morel@bumarket.app', role: 'admin', initials: 'AM' }

function readSession() {
  const storedSession = localStorage.getItem(SESSION_KEY)
  if (storedSession) {
    try { return JSON.parse(storedSession) } catch { localStorage.removeItem(SESSION_KEY) }
  }
  // Le formulaire d'authentification sera branché ultérieurement. En attendant,
  // une session locale permet de valider les pages protégées.
  if (import.meta.env.VITE_ENABLE_DEMO_ADMIN !== 'false') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(demoAdmin))
    return demoAdmin
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const value = useMemo(() => ({
    user,
    signIn: (nextUser) => { localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser)); setUser(nextUser) },
    signOut: () => { localStorage.removeItem(SESSION_KEY); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
