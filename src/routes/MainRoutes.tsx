import MainLayout from '@/layout/MainLayout'
import Calendar from '@/pages/main/Calendar'
import Home from '@/pages/main/Home'
import TodoList from '@/pages/main/TodoList'
import type { RouteObject } from 'react-router-dom'

const MainRoutes: RouteObject = {
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/calendar',
      element: <Calendar />,
    },
    {
      path: '/todo',
      element: <TodoList />,
    },
  ],
}

export default MainRoutes
