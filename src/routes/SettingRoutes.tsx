import type { RouteObject } from 'react-router-dom'

import SettingLayout from '@/shared/layout/SettingLayout'

const SettingRoutes: RouteObject = {
  path: '/settings',
  element: <SettingLayout />,
  children: [
    {
      index: true,
      lazy: async () => ({
        Component: (await import('@/pages/main/SettingPage/SettingsPage')).default,
      }),
    },
  ],
}

export default SettingRoutes
