import AuthLayout from '@/layout/AuthLayout'
import Login from '@/pages/auth/Login'
import type { RouteObject } from 'react-router-dom'

const AuthRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: '/login',
      element: <Login />,
    },
  ],
}

export default AuthRoutes
