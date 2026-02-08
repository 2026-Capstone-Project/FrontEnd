import type { SocialProvider } from '@/shared/types/auth/auth'

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
