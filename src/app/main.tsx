import { ThemeProvider } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { authRouter, mainRouter } from '@/routes/Router'
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
  const [isInitializing, setIsInitializing] = useState(true)

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
        <ToastViewport />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
