import type { RouteObject } from 'react-router-dom'

import MainLayout from '@/shared/layout/MainLayout'

/*
  로그인 이후 화면은 모두 lazy로 분리합니다.
  react-big-calendar, dayjs, kakao maps SDK 같은 무거운 의존성이
  랜딩 진입 청크에 섞이지 않도록 하는 것이 목적입니다.
*/
const MainRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: '/',
      lazy: async () => ({ Component: (await import('@/pages/main/HomePage/HomePage')).default }),
    },
    {
      path: '/calendar',
      lazy: async () => ({
        Component: (await import('@/pages/main/CalendarPage/CalendarPage')).default,
      }),
    },
    {
      path: '/todo',
      lazy: async () => ({
        Component: (await import('@/pages/main/TodoListPage/TodoListPage')).default,
      }),
    },
    {
      path: '/friends',
      lazy: async () => ({
        Component: (await import('@/pages/main/FriendsPage/FriendsPage')).default,
      }),
    },
  ],
}

export default MainRoutes
