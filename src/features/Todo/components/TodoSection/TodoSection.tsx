import { useEffect, useState } from 'react'

import { theme } from '@/shared/styles/theme'
import AddTodoModal from '@/shared/ui/modal/AddTodo'

import TodoCard from '../TodoCard/TodoCard'
import * as S from './TodoSection.style'

const getIsoDateWithOffset = (offset: number) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString()
}

const TodoSection = () => {
  const [todoState, setTodoState] = useState<'ALL' | 'TODAY' | 'IMPORTANCE' | 'COMPLETED'>('ALL')
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
  const tomorrowIso = getIsoDateWithOffset(1)

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
              onClick={() => setTodoState('IMPORTANCE')}
              $isActive={todoState === 'IMPORTANCE'}
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
            할 일 추가 +
          </button>
        </S.Header>
        <S.CardList>
          <TodoCard
            id={1}
            title="프로젝트 기획서 작성"
            date="오늘"
            isHighlight
            priority="HIGH"
            time="17:00"
            onDoubleClick={() => handleCardDoubleClick(todayIso, true, 1)}
          />
          <TodoCard
            id={2}
            title="영어 단어 암기"
            date="내일"
            priority="MEDIUM"
            repeat={true}
            repeatInfo="매일"
            onDoubleClick={() => handleCardDoubleClick(tomorrowIso, true, 2)}
          />
          <TodoCard
            id={3}
            title="프로젝트 기획서 작성"
            date="내일"
            time="17:00"
            priority="LOW"
            onDoubleClick={() => handleCardDoubleClick(tomorrowIso, true, 3)}
          />
          <TodoCard
            id={4}
            title="캡스톤 프로젝트 회의"
            repeat={true}
            repeatInfo="매주 목요일 22:00"
            date="내일"
            time="22:00"
            priority="HIGH"
            onDoubleClick={() => handleCardDoubleClick(tomorrowIso, true, 4)}
          />
        </S.CardList>
      </S.Section>
      {isAddTodoOpen.open && isAddTodoOpen.id !== undefined && (
        <AddTodoModal
          date={addTodoDate}
          onClose={closeAddTodoModal}
          eventId={isAddTodoOpen.id}
          tabsVisible={!isAddTodoOpen.isEdit}
          mode={isDesktop ? 'inline' : 'modal'}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoSection
