import React, { useEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { publicRoutes } from './routes/PublicRoutes.jsx'
import { protectedRoutes } from './routes/ProtectedRoutes.jsx'
import Loading from './components/Loading.jsx'
import NotFound from './components/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
      { path: '*', element: <NotFound /> },
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
      {booted ? <RouterProvider router={router} /> : <Loading fullScreen />}
    </AuthProvider>
  )
}