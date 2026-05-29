import type { RouteObject } from 'react-router-dom'

import CalendarPage from '@/pages/main/CalendarPage/CalendarPage'
import FriendsPage from '@/pages/main/FriendsPage/FriendsPage'
import Home from '@/pages/main/HomePage/HomePage'
import TodoListPage from '@/pages/main/TodoListPage/TodoListPage'
import MainLayout from '@/shared/layout/MainLayout'

const MainRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/calendar',
      element: <CalendarPage />,
    },
    {
      path: '/todo',
      element: <TodoListPage />,
    },
    {
      path: '/friends',
      element: <FriendsPage />,
    },
  ],
}

export default MainRoutes
