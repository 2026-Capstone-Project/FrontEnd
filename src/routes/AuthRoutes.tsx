import type { RouteObject } from 'react-router-dom'

import Login from '@/pages/auth/Login'
import SocialCallback from '@/pages/auth/SocialCallback'
import AuthLayout from '@/shared/layout/AuthLayout'

const AuthRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/login/callback/:provider',
      element: <SocialCallback />,
    },
  ],
}

export default AuthRoutes
