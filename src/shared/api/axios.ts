import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/security/reissue-cookie`,
          {},
          { withCredentials: true },
        )

        return axiosInstance(originalRequest)
      } catch (reissueError) {
        return Promise.reject(reissueError)
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
