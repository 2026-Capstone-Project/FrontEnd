/** @jsxImportSource @emotion/react */
import { useMemo, useRef } from 'react'

import TodoSection from '@/features/Todo/components/TodoSection/TodoSection'
import TodoStatus from '@/features/Todo/components/TodoStatus/TodoStatus'
import { useGetTodoProgressQuery } from '@/shared/hooks/query/useTodoQueries'

import * as S from './TodoListPage.styles'

export default function TodoListPage() {
  const cardAreaRef = useRef<HTMLDivElement | null>(null)
  const titleLabel = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const firstDay = new Date(year, now.getMonth(), 1).getDay()
    const weekOfMonth = Math.ceil((now.getDate() + firstDay) / 7)
    return `${year}년 ${month}월 ${weekOfMonth}주차`
  }, [])
  const todayParam = useMemo(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`
  }, [])
  const { data } = useGetTodoProgressQuery(todayParam)
  return (
    <S.PageWrapper>
      <S.Title>
        {titleLabel}
        <div>TO DO</div>
      </S.Title>
      <S.Wrapper>
        <TodoSection />
        <div
          css={{ display: 'flex', width: '100%', flexDirection: 'column', position: 'relative' }}
          ref={cardAreaRef}
          id="desktop-card-area"
        >
          <TodoStatus
            progress={data?.result?.completedCount ?? 0}
            total={data?.result?.totalCount ?? 0}
          />
        </div>
      </S.Wrapper>
    </S.PageWrapper>
  )
}
