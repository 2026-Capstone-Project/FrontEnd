import axios from 'axios'

import { queryClient } from '@/shared/api/queryClient'
import { useAuthStore } from '@/store/useAuthStore'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let refreshPromise: Promise<void> | null = null
let refreshBlocked = false

const getRequestPath = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http')) {
    try {
      return new URL(url).pathname
    } catch {
      return url
    }
  }

  return url.startsWith('/') ? url : `/${url}`
}

const isRefreshExcludedRequest = (url?: string) => {
  const path = getRequestPath(url)

  return path === '/security/reissue-cookie' || path === '/security/csrf'
}

const handleAuthFailure = () => {
  refreshBlocked = true
  queryClient.clear()
  useAuthStore.getState().logout()
}

axiosInstance.interceptors.request.use(
  async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/security/csrf`, {
          withCredentials: true,
        })
        const resultString = data.result || ''
        const csrfToken = resultString.replace('CSRF 토큰이 쿠키로 발급되었습니다.', '').trim()

        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken
        } else {
          console.error('[CSRF] 토큰 추출 실패. 응답 확인:', resultString)
        }
      } catch (error) {
        console.error('CSRF 토큰 갱신 실패:', error)
        return Promise.reject(error)
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshExcludedRequest(originalRequest.url) &&
      !refreshBlocked
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${import.meta.env.VITE_SERVER_URL}/security/reissue-cookie`,
              {},
              { withCredentials: true },
            )
            .then(() => undefined)
            .catch((reissueError) => {
              handleAuthFailure()
              throw reissueError
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        await refreshPromise
        return axiosInstance(originalRequest)
      } catch (reissueError) {
        return Promise.reject(reissueError)
      }
    }

    if (error.response?.status === 401 && isRefreshExcludedRequest(originalRequest?.url)) {
      handleAuthFailure()
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
