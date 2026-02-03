import { useNavigate, useRouteError } from 'react-router-dom'

import * as S from './ErrorPage.styles'

export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError() as { status?: number; statusText?: string; message?: string } | null

  const description = error?.statusText || error?.message || '요청하신 페이지를 찾을 수 없어요.'

  return (
    <S.Container>
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
