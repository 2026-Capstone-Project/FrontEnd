import type { RouteObject } from 'react-router-dom'

import SettingsPage from '@/pages/main/SettingPage/SettingsPage'
import SettingLayout from '@/shared/layout/SettingLayout'

const SettingRoutes: RouteObject = {
  path: '/settings',
  element: <SettingLayout />,
  children: [
    {
      index: true,
      element: <SettingsPage />,
    },
  ],
}

export default SettingRoutes
