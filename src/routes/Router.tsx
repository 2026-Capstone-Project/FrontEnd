import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from '@/pages/common/ErrorPage/ErrorPage'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'

export const router = createBrowserRouter([
  AuthRoutes,
  MainRoutes,
  {
    path: '*',
    element: <ErrorPage />,
  },
])
