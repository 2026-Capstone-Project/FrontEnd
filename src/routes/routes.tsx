import { createBrowserRouter } from 'react-router-dom'

import CalendarPage from '@/pages/CalendarPage'
import DefaultAppLayout from '@/shared/layout/defaultAppLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultAppLayout />,
    children: [
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'todo',
        element: <div>Todo Page</div>,
      },
    ],
  },
])

export default router
