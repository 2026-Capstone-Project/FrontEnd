import { ThemeProvider } from '@emotion/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import GlobalStyle from '@/shared/styles/GlobalStyle'
import { theme } from '@/shared/styles/theme'

import { router } from '../routes/Router'
import { queryClient } from '../shared/api/queryClient'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {import.meta.env.VITE_DEV_MODE === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
