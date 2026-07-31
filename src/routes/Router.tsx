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

/*
  라우트 lazy 청크 로드가 실패해도(배포 직후 구버전 탭 등) react-router 기본
  에러 화면 대신 ErrorPage가 처리하도록 최상위에 errorElement를 둡니다.
*/
export const getAuthRouter = () =>
  (authRouter ??= createBrowserRouter([
    { ...AuthRoutes, errorElement: <ErrorPage /> },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]))

export const getMainRouter = () =>
  (mainRouter ??= createBrowserRouter([
    { ...MainRoutes, errorElement: <ErrorPage /> },
    { ...SettingRoutes, errorElement: <ErrorPage /> },
    {
      path: '*',
      element: <ErrorPage />,
    },
  ]))

/*
  로그인/로그아웃으로 라우터가 교체된 뒤에도 이전 라우터는 history 구독을 유지해,
  뒤로가기(popstate) 시 비활성 라우터가 URL을 매칭하며 자기 lazy 청크를 받아올 수 있습니다.
  교체 시점에 이전 라우터를 dispose하고, 다시 필요해지면 새로 만듭니다.
*/
export const disposeAuthRouter = () => {
  authRouter?.dispose()
  authRouter = null
}

export const disposeMainRouter = () => {
  mainRouter?.dispose()
  mainRouter = null
}
