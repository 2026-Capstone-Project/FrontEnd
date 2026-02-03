import type { ReactNode } from 'react'

import * as S from './AsyncBoundaryFallback.styles'

type AsyncBoundaryFallbackProps = {
  error: Error
  onReset: () => void
  title?: ReactNode
  description?: ReactNode
}

const AsyncBoundaryFallback = ({
  error,
  onReset,
  title = '문제가 발생했어요',
  description,
}: AsyncBoundaryFallbackProps) => (
  <S.Container role="alert" aria-live="assertive">
    <S.Title>{title}</S.Title>
    <S.Description>{description ?? '요청을 처리하는 중 오류가 발생했어요.'}</S.Description>
    <S.ErrorMessage>{error.message}</S.ErrorMessage>
    <S.Button type="button" onClick={onReset}>
      다시 시도
    </S.Button>
  </S.Container>
)

export default AsyncBoundaryFallback
