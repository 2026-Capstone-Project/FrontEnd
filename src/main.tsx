import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { queryClient } from './shared/api/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      {import.meta.env.VITE_DEV_MODE === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
      <App />
    </StrictMode>
  </QueryClientProvider>,
)
