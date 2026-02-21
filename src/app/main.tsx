/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemeProvider } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { authRouter, mainRouter } from '@/routes/Router'
import axiosInstance from '@/shared/api/axios'
import GlobalStyle from '@/shared/styles/GlobalStyle'
import { theme } from '@/shared/styles/theme'
import { useAuthStore } from '@/store/useAuthStore'

import { queryClient } from '../shared/api/queryClient'

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const reissueRes = await axiosInstance.post('/security/reissue-cookie', {})

        if (reissueRes.data.isSuccess) {
          login()
        } else {
          logout()
        }
      } catch (error: any) {
        console.error('인증 확인 실패:', error)
        logout()
      } finally {
        setIsInitializing(false)
      }
    }

    initAuth()
  }, [login, logout])

  if (isInitializing) return null

  return <RouterProvider router={isLoggedIn ? mainRouter : authRouter} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {import.meta.env.VITE_DEV_MODE === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
