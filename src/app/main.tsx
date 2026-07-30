import { ThemeProvider } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { getAuthRouter, getMainRouter } from '@/routes/Router'
import axiosInstance from '@/shared/api/axios'
import { resetAuthRecoveryState } from '@/shared/api/axios'
import GlobalStyle from '@/shared/styles/GlobalStyle'
import { theme } from '@/shared/styles/theme'
import ToastViewport from '@/shared/ui/common/Toast/ToastViewport'
import { useAuthStore } from '@/store/useAuthStore'

import { queryClient } from '../shared/api/queryClient'

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const { isLoggedIn, login, logout } = useAuthStore()

  /*
    첫 렌더를 `/members/me` 응답까지 기다리지 않습니다.
    이전에는 응답 전까지 null을 렌더해서 API가 느리거나 죽으면 흰 화면만 보였고,
    검색 유입(= 항상 로그아웃 상태)의 첫 페인트가 API 왕복만큼 밀렸습니다.
    저장된 로그인 힌트로 라우터를 먼저 띄우고, 응답이 오면 상태를 확정합니다.
  */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await axiosInstance.get('/members/me')

        if (response.data.isSuccess) {
          resetAuthRecoveryState()
          login()
        } else {
          logout()
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        logout()
      }
    }

    initAuth()
  }, [login, logout])

  return <RouterProvider router={isLoggedIn ? getMainRouter() : getAuthRouter()} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {import.meta.env.VITE_DEV_MODE === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
        <GlobalStyle />
        <App />
        <ToastViewport />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
