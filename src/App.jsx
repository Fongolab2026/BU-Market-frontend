import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { publicRoutes } from './Users/routes/PublicRoutes.jsx'
import { protectedRoutes } from './Users/routes/ProtectedRoutes.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    children: [
      ...publicRoutes,
      ...protectedRoutes
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}