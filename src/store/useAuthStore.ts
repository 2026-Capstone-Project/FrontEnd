import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AUTH_HINT_KEY = 'calio.isLoggedIn'

/**
 * 인증 쿠키는 httpOnly라서 클라이언트에서 읽을 수 없습니다.
 * 그래서 마지막으로 확인된 로그인 여부만 힌트로 저장해 첫 렌더에 쓸 라우터를 결정합니다.
 * 실제 인증 상태는 앱 부팅 시 `/members/me` 응답으로 항상 다시 확정됩니다.
 */
const readAuthHint = () => {
  if (typeof window === 'undefined') return false

  try {
    // OAuth 콜백 경로는 로그아웃 상태 라우터에만 존재하므로 힌트를 무시합니다.
    if (window.location.pathname.startsWith('/login')) return false

    return window.localStorage.getItem(AUTH_HINT_KEY) === '1'
  } catch {
    // 시크릿 모드 등 localStorage를 쓸 수 없는 환경
    return false
  }
}

const writeAuthHint = (isLoggedIn: boolean) => {
  if (typeof window === 'undefined') return

  try {
    if (isLoggedIn) window.localStorage.setItem(AUTH_HINT_KEY, '1')
    else window.localStorage.removeItem(AUTH_HINT_KEY)
  } catch {
    // 저장에 실패해도 동작에 영향은 없습니다.
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: readAuthHint(),
  login: () => {
    writeAuthHint(true)
    set({ isLoggedIn: true })
  },
  logout: () => {
    writeAuthHint(false)
    set({ isLoggedIn: false })
  },
}))
