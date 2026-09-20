import React from 'react'
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { publicRoutes } from './routes/PublicRoutes.jsx'
import { protectedRoutes } from './routes/ProtectedRoutes.jsx'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-100 p-6 text-center">
      <h1 className="text-5xl font-bold text-primary">404</h1>
      <p className="text-base-content/70">Cette page n'existe pas encore.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  )
}

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
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}