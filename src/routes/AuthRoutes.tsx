import type { RouteObject } from 'react-router-dom'

import Login from '@/pages/auth/Login'
import AuthLayout from '@/shared/layout/AuthLayout'

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
