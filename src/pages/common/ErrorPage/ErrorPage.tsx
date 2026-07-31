import { useEffect } from 'react'
import { useNavigate, useRouteError, useSearchParams } from 'react-router-dom'

import PageMeta from '@/shared/ui/common/PageMeta/PageMeta'

import * as S from './ErrorPage.styles'

const CHUNK_RELOAD_AT_KEY = 'calio.chunkReloadedAt'
const CHUNK_RELOAD_COOLDOWN_MS = 30_000

const isChunkLoadError = (error: unknown) => {
  const message = error instanceof Error ? error.message : ''

  return /dynamically imported module|Importing a module script failed|error loading|Failed to fetch/i.test(
    message,
  )
}

/*
  배포 직후에는 열려 있던 구버전 탭이 이전 해시의 lazy 청크를 요청하다 실패할 수 있습니다.
  새 index.html을 받으면 해결되므로 자동 새로고침하되,
  새로고침으로도 해결되지 않는 경우(네트워크 장애 등)의 무한 루프를 막기 위해
  최근에 이미 새로고침했다면 에러 화면을 그대로 보여줍니다.
*/
const shouldReloadForChunkError = (error: unknown) => {
  if (!isChunkLoadError(error)) return false

  try {
    const lastReloadAt = Number(sessionStorage.getItem(CHUNK_RELOAD_AT_KEY) || 0)

    return Date.now() - lastReloadAt > CHUNK_RELOAD_COOLDOWN_MS
  } catch {
    // sessionStorage를 못 쓰는 환경에서는 루프 방지가 불가능하므로 새로고침하지 않습니다.
    return false
  }
}

export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError() as { status?: number; statusText?: string; message?: string } | null
  const [searchParams] = useSearchParams()

  const shouldReload = shouldReloadForChunkError(error)

  useEffect(() => {
    if (!shouldReload) return

    try {
      sessionStorage.setItem(CHUNK_RELOAD_AT_KEY, String(Date.now()))
    } catch {
      return
    }
    window.location.reload()
  }, [shouldReload])

  const queryMessage = searchParams.get('message')
  const description =
    queryMessage || error?.statusText || error?.message || '요청하신 페이지를 찾을 수 없어요.'

  /* 곧 새로고침될 예정이면 에러 문구가 깜빡이지 않도록 비워둡니다. */
  if (shouldReload) return null

  return (
    <S.Container>
      <PageMeta title="페이지를 찾을 수 없어요" noIndex />
      <S.Title>문제가 발생했어요</S.Title>
      <S.Description>{description}</S.Description>
      <S.ButtonRow>
        <S.SecondaryButton type="button" onClick={() => navigate(-1)}>
          뒤로가기
        </S.SecondaryButton>
        <S.PrimaryButton type="button" onClick={() => navigate('/')}>
          홈으로
        </S.PrimaryButton>
      </S.ButtonRow>
    </S.Container>
  )
}
