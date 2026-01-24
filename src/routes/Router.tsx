import { createBrowserRouter } from 'react-router-dom'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'

export const router = createBrowserRouter([AuthRoutes, MainRoutes])
