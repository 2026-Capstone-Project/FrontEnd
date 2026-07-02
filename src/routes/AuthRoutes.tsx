import type { RouteObject } from 'react-router-dom'

import Landing from '@/pages/auth/Landing'
import Login from '@/pages/auth/Login'
import SocialCallback from '@/pages/auth/SocialCallback'
import AuthLayout from '@/shared/layout/AuthLayout'

const AuthRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/login/callback/:provider',
      element: <SocialCallback />,
    },
  ],
}

export default AuthRoutes
