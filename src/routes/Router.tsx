import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from '@/pages/common/ErrorPage/ErrorPage'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'

export const authRouter = createBrowserRouter([
  AuthRoutes,
  {
    path: '*',
    element: <ErrorPage />,
  },
])

export const mainRouter = createBrowserRouter([
  MainRoutes,
  {
    path: '*',
    element: <ErrorPage />,
  },
])
