import type { SocialProvider } from '@/shared/types/auth/auth'
import type { UserResponse } from '@/shared/types/auth/auth'

import axiosInstance from '../axios'

export function redirectToSocialLogin(provider: string): void {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL
  const upperProvider = provider.toUpperCase() as SocialProvider
  window.location.href = `${SERVER_URL}/api/v1/auth/${upperProvider}`
}

export function processLoginCallback(provider: string, code: string, state: string): void {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL
  const upperProvider = provider.toUpperCase() as SocialProvider

  window.location.href = `${SERVER_URL}/api/v1/auth/${upperProvider}/callback?code=${code}&state=${state}`
}

//내 정보 조회
export const fetchUserInfo = async (): Promise<UserResponse> => {
  const res = await axiosInstance.get<UserResponse>('/api/v1/members/me')

  return res.data
}

//로그아웃
export const logoutAPI = async () => {
  await axiosInstance.post('/api/v1/auth/logout')
}
