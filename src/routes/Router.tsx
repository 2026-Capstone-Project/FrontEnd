import { createBrowserRouter } from 'react-router-dom'

import ErrorPage from '@/pages/common/ErrorPage/ErrorPage'

import AuthRoutes from './AuthRoutes'
import MainRoutes from './MainRoutes'
import SettingRoutes from './SettingRoutes'

/*
  라우터를 모듈 로드 시점에 만들면 두 라우터가 모두 현재 URL을 매칭해 초기화합니다.
  그 결과 로그아웃 상태의 랜딩에서도 mainRouter가 '/'에 해당하는 HomePage 청크를 내려받았습니다.

  또 `createBrowserRouter`는 내부에서 바로 `initialize()`를 호출해 history를 구독하므로,
  호출할 때마다 살아있는 라우터가 하나씩 늘어납니다.
  실제로 쓰는 라우터를 한 번만 만들어 재사용합니다.
*/
type Router = ReturnType<typeof createBrowserRouter>

let authRouter: Router | null = null
let mainRouter: Router | null = null

export const getAuthRouter = () =>
  (authRouter ??= createBrowserRouter([
    AuthRoutes,
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]))

export const getMainRouter = () =>
  (mainRouter ??= createBrowserRouter([
    MainRoutes,
    SettingRoutes,
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]))
