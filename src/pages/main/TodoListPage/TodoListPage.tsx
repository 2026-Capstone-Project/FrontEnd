import { useRef } from 'react'

import TodoSection from '@/features/Todo/components/TodoSection/TodoSection'
import TodoStatus from '@/features/Todo/components/TodoStatus/TodoStatus'

import * as S from './TodoListPage.styles'

export default function TodoListPage() {
  const cardAreaRef = useRef<HTMLDivElement | null>(null)

  return (
    <S.PageWrapper>
      <S.Title>
        Todo Section Component
        <div>TO DO</div>
      </S.Title>
      <S.Wrapper>
        <TodoSection />
        <TodoStatus progress={3} total={5} />
        <div ref={cardAreaRef} id="desktop-card-area" />
      </S.Wrapper>
    </S.PageWrapper>
  )
}
