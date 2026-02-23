import { useEffect, useState } from 'react'

import Plus from '@/shared/assets/icons/plus.svg?react'
import { useGetTodoQuery } from '@/shared/hooks/query/useTodoQueries'
import { theme } from '@/shared/styles/theme'
import type { TodoFilter } from '@/shared/types/todo/types'
import AddTodoModal from '@/shared/ui/modal/AddTodo'

import {
  formatYmd,
  getIsoDateWithOffset,
  getTodoDateLabel,
  getTodoDueDateTime,
} from '../../utils/todoDate'
import TodoCard from '../TodoCard/TodoCard'
import * as S from './TodoSection.style'

const TodoSection = () => {
  const [todoState, setTodoState] = useState<TodoFilter>('ALL')
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${theme.breakPoints.desktop})`).matches
  })

  const [isAddTodoOpen, setIsAddTodoOpen] = useState<{
    id: number | undefined
    open: boolean
    isEdit: boolean
  }>({
    id: undefined,
    open: false,
    isEdit: false,
  })
  const [addTodoDate, setAddTodoDate] = useState(() => getIsoDateWithOffset(0))
  const editingCardId = isAddTodoOpen.open && isAddTodoOpen.isEdit ? isAddTodoOpen.id : undefined

  const { data } = useGetTodoQuery(todoState)

  const handleCardDoubleClick = (date?: string, isEditing = true, id?: number) => {
    setAddTodoDate(date ?? getIsoDateWithOffset(0))
    setIsAddTodoOpen({ id, open: true, isEdit: isEditing })
  }

  const closeAddTodoModal = () => {
    setIsAddTodoOpen({ id: undefined, open: false, isEdit: false })
  }

  const todayIso = getIsoDateWithOffset(0)
  const todayYmd = formatYmd(new Date())

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(min-width: ${theme.breakPoints.desktop})`)
    const handler = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <S.Wrapper>
      <S.Section>
        <S.Header>
          <S.StateButtonGroup>
            <S.StateButton onClick={() => setTodoState('ALL')} $isActive={todoState === 'ALL'}>
              전체
            </S.StateButton>
            <S.StateButton onClick={() => setTodoState('TODAY')} $isActive={todoState === 'TODAY'}>
              오늘
            </S.StateButton>
            <S.StateButton
              onClick={() => setTodoState('PRIORITY')}
              $isActive={todoState === 'PRIORITY'}
            >
              중요도
            </S.StateButton>
            <S.StateButton
              onClick={() => setTodoState('COMPLETED')}
              $isActive={todoState === 'COMPLETED'}
            >
              완료
            </S.StateButton>
          </S.StateButtonGroup>
          <button
            className="add-button"
            type="button"
            onClick={() => handleCardDoubleClick(todayIso, false, undefined)}
          >
            <label>할 일 추가</label> <Plus color="white" width={15} height={15} />
          </button>
        </S.Header>
        <S.CardList>
          {data?.result.todos.map((todo) => (
            <TodoCard
              key={`${todo.todoId}-${todo.occurrenceDate}`}
              id={todo.todoId}
              title={todo.title}
              date={getTodoDateLabel(todo.occurrenceDate, todo.dueTime)}
              occurrenceDate={todo.occurrenceDate}
              isCompleted={todo.isCompleted}
              isHighlight={todo.occurrenceDate === todayYmd}
              isOverdue={
                !todo.isCompleted &&
                getTodoDueDateTime(todo.occurrenceDate, todo.dueTime, todo.isAllDay) < new Date()
              }
              priority={todo.priority}
              isRecurring={todo.isRecurring}
              onDoubleClick={() => handleCardDoubleClick(todo.occurrenceDate, true, todo.todoId)}
              isEditing={editingCardId === todo.todoId}
            />
          ))}
        </S.CardList>
      </S.Section>
      {isAddTodoOpen.open && (
        <AddTodoModal
          date={addTodoDate}
          onClose={closeAddTodoModal}
          eventId={isAddTodoOpen.id ?? 0}
          tabsVisible={false}
          isEditing={isAddTodoOpen.isEdit}
          mode={isDesktop ? 'inline' : 'modal'}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoSection
