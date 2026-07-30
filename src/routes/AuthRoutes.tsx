import type { RouteObject } from 'react-router-dom'

import Landing from '@/pages/auth/Landing'
import AuthLayout from '@/shared/layout/AuthLayout'

/*
  Landing은 검색 유입의 첫 화면이라 진입 청크에 그대로 둡니다.
  나머지 라우트는 lazy로 분리해 랜딩 방문자가 내려받는 JS를 줄입니다.
*/
const AuthRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/login',
      lazy: async () => ({ Component: (await import('@/pages/auth/Login')).default }),
    },
    {
      path: '/login/callback/:provider',
      lazy: async () => ({ Component: (await import('@/pages/auth/SocialCallback')).default }),
    },
  ],
}

export default AuthRoutes
