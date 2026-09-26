import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/authService.js'
import { getAccessToken } from '../services/api.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'vima_demo_session'
const DEMO_ROLE_KEY = 'vima_demo_role'
const demoAdmin = { id: 'usr-admin-001', firstName: 'Julien', lastName: 'Faure', email: 'julien.faure@bumarket.app', role: 'admin', initials: 'JF' }
const demoMerchant = { id: 'usr-merchant-001', firstName: 'Espoir', lastName: 'Durand', email: 'espoir.durand@bumarket.app', role: 'merchant', initials: 'ED' }
const demoUserFor = (role) => (role === 'merchant' ? demoMerchant : demoAdmin)

function readSession() {
  if (import.meta.env.VITE_ENABLE_DEMO_ADMIN !== 'false') {
    const role = localStorage.getItem(DEMO_ROLE_KEY) === 'merchant' ? 'merchant' : 'admin'
    const user = demoUserFor(role)
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  }
  const storedSession = localStorage.getItem(SESSION_KEY)
  if (storedSession) {
    try { return JSON.parse(storedSession) } catch { localStorage.removeItem(SESSION_KEY) }
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  useEffect(() => {
    // If demo mode or no token, don't fetch
    if (import.meta.env.VITE_ENABLE_DEMO_ADMIN !== 'false' || !getAccessToken()) return
    // If we already have a user, don't fetch again
    if (user) return

    authApi.me()
      .then(({ data }) => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data))
        setUser(data)
      })
      .catch(() => setUser(null))
  }, [user])

  const value = useMemo(() => ({
    user,
    signIn: (nextUser) => { localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser)); setUser(nextUser) },
    signOut: () => { localStorage.removeItem(SESSION_KEY); setUser(null) },
    switchDemoRole: (role) => { localStorage.setItem(DEMO_ROLE_KEY, role); signIn(demoUserFor(role)) },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}