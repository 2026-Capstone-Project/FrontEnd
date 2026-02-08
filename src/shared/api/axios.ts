import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

//TODO: @yujin5959 나중에 이부분 해주세용~
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
