import React, { useEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'
import { RouteError } from '../components/ErrorBoundary.jsx'
import { useSellerUpgrade } from '../hooks/useSellerUpgrade.js'
import { publicRoutes } from './routes/PublicRoutes.jsx'
import { protectedRoutes } from './routes/ProtectedRoutes.jsx'
import LoadingPage from './Pages/LoadingPage.jsx'

/**
 * Racine de l'application : vérifie en continu si la demande d'espace du
 * client connecté vient d'être validée afin de le basculer automatiquement
 * vers l'espace marchand.
 */
function RootLayout() {
  useSellerUpgrade()
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
    ],
  },
])

const STARTUP_SEEN_KEY = 'bu-market-startup-seen'

export default function App() {
  const [booted, setBooted] = useState(() =>
    sessionStorage.getItem(STARTUP_SEEN_KEY) === 'true'
  )

  useEffect(() => {
    if (booted) return

    sessionStorage.setItem(STARTUP_SEEN_KEY, 'true')
    const t = setTimeout(() => setBooted(true), 2800)
    return () => clearTimeout(t)
  }, [booted])

  return (
    <AuthProvider>
      <ThemeProvider>
        {booted ? <RouterProvider router={router} /> : <LoadingPage />}
      </ThemeProvider>
    </AuthProvider>
  )
}