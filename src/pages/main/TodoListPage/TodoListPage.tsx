/** @JsxImportSource @emotion/react */
import { useRef } from 'react'

import TodoSection from '@/features/Todo/components/TodoSection/TodoSection'
import TodoStatus from '@/features/Todo/components/TodoStatus/TodoStatus'

import * as S from './TodoListPage.styles'

export default function TodoListPage() {
  const cardAreaRef = useRef<HTMLDivElement | null>(null)

  return (
    <S.PageWrapper>
      <S.Title>
        2025년 12월 4주차
        <div>TO DO</div>
      </S.Title>
      <S.Wrapper>
        <TodoSection />
        <div css={{ display: 'flex', width: '100%' }} ref={cardAreaRef} id="desktop-card-area">
          <TodoStatus progress={3} total={5} />
        </div>
      </S.Wrapper>
    </S.PageWrapper>
  )
}
