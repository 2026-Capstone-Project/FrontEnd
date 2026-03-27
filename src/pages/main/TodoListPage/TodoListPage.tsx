/** @jsxImportSource @emotion/react */
import { useMemo } from 'react'

import TodoSection from '@/features/Todo/components/TodoSection/TodoSection'
import TodoStatus from '@/features/Todo/components/TodoStatus/TodoStatus'
import { getTodoProgressDateParam, getTodoWeekTitle } from '@/features/Todo/utils/todoPage'
import { useGetTodoProgressQuery } from '@/shared/hooks/query/useTodoQueries'

import * as S from './TodoListPage.styles'

export default function TodoListPage() {
  const titleLabel = useMemo(() => getTodoWeekTitle(new Date()), [])
  const todayParam = useMemo(() => getTodoProgressDateParam(new Date()), [])
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
