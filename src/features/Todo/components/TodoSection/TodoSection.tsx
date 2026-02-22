import { useEffect, useState } from 'react'

import Plus from '@/shared/assets/icons/plus.svg?react'
import { useGetTodoQuery } from '@/shared/hooks/query/useTodoQueries'
import { theme } from '@/shared/styles/theme'
import type { TodoFilter } from '@/shared/types/todo/types'
import AddTodoModal from '@/shared/ui/modal/AddTodo'

import TodoCard from '../TodoCard/TodoCard'
import * as S from './TodoSection.style'

const getIsoDateWithOffset = (offset: number) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString()
}

const formatYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`

const parseYmd = (value: string) => {
  const [year, month, day] = value.split('-').map((part) => Number.parseInt(part, 10))
  return new Date(year, (month || 1) - 1, day || 1)
}

type DueTimeLike =
  | string
  | { hour: number; minute: number; second: number; nano: number }
  | undefined

const formatTime = (value?: DueTimeLike) => {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 5)
  const hour = String(value.hour ?? 0).padStart(2, '0')
  const minute = String(value.minute ?? 0).padStart(2, '0')
  return `${hour}:${minute}`
}

const getWeekLabel = (date: Date) => {
  const names = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return names[date.getDay()] ?? ''
}

const getTodoDateLabel = (occurrenceDate: string, dueTime?: DueTimeLike) => {
  const targetDate = parseYmd(occurrenceDate)
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.floor((targetDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
  const timeLabel = formatTime(dueTime)
  if (diffDays === 0) return `오늘 ${timeLabel}`.trim()
  if (diffDays === 1) return `내일 ${timeLabel}`.trim()
  if (diffDays >= 2 && diffDays <= 6)
    return `이번주 ${getWeekLabel(targetDate)} ${timeLabel}`.trim()
  if (diffDays >= 7 && diffDays <= 13)
    return `다음주 ${getWeekLabel(targetDate)} ${timeLabel}`.trim()
  const ymd = `${targetDate.getFullYear()}.${String(targetDate.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(targetDate.getDate()).padStart(2, '0')}`
  return timeLabel ? `${ymd} ${timeLabel}` : ymd
}

const getTodoDueDateTime = (occurrenceDate: string, dueTime?: DueTimeLike, isAllDay?: boolean) => {
  const base = parseYmd(occurrenceDate)
  if (isAllDay || !dueTime) {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999)
  }
  if (typeof dueTime !== 'string') {
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      dueTime.hour || 0,
      dueTime.minute || 0,
      dueTime.second || 0,
      0,
    )
  }
  const [hour, minute, second] = dueTime.split(':').map((part) => Number.parseInt(part, 10))
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hour || 0,
    minute || 0,
    second || 0,
    0,
  )
}

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

  const createNewEvent = () => {
    console.log('새로운 할 일 생성 로직 처리')
    const id = Math.floor(Math.random() * 10000)
    return id
  }

  const handleCardDoubleClick = (date?: string, isEditing = true, id?: number) => {
    if (!id) {
      id = createNewEvent()
    }
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
      {isAddTodoOpen.open && isAddTodoOpen.id !== undefined && (
        <AddTodoModal
          date={addTodoDate}
          onClose={closeAddTodoModal}
          eventId={isAddTodoOpen.id}
          tabsVisible={false}
          isEditing={isAddTodoOpen.isEdit}
          mode={isDesktop ? 'inline' : 'modal'}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoSection
