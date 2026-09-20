import React, { useEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ThemeProvider } from '../context/ThemeContext.jsx'
import { publicRoutes } from './routes/PublicRoutes.jsx'
import { protectedRoutes } from './routes/ProtectedRoutes.jsx'
import LoadingPage from './Pages/LoadingPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
    ],
  },
])

export default function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider>
        {booted ? <RouterProvider router={router} /> : <LoadingPage />}
      </ThemeProvider>
    </AuthProvider>
  )
}