import { useEffect, useMemo, useState } from 'react'

import { theme } from '@/shared/styles/theme'
import type { TodoFilter } from '@/shared/types/todo/types'

import { getIsoDateWithOffset } from '../utils/todoDate'

type OpenTodoModalArgs = {
  date?: string
  isEditing?: boolean
  id?: number
  occurrenceDate?: string
}

type TodoModalState = {
  id: number | undefined
  open: boolean
  isEdit: boolean
  occurrenceDate?: string
}

export const useTodoSectionState = () => {
  const [todoFilter, setTodoFilter] = useState<TodoFilter>('ALL')
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${theme.breakPoints.desktop})`).matches
  })

  const [todoModalState, setTodoModalState] = useState<TodoModalState>({
    id: undefined,
    open: false,
    isEdit: false,
    occurrenceDate: undefined,
  })
  const [addTodoDate, setAddTodoDate] = useState(() => getIsoDateWithOffset(0))

  // 반복 할 일은 같은 id라도 occurrenceDate가 다를 수 있어서,
  // 카드 편집 강조 기준을 id + occurrenceDate 조합으로 고정합니다.
  const editingCardKey = useMemo(() => {
    if (!todoModalState.open || !todoModalState.isEdit) return undefined
    if (todoModalState.id == null || !todoModalState.occurrenceDate) return undefined
    return `${todoModalState.id}-${todoModalState.occurrenceDate}`
  }, [todoModalState.id, todoModalState.isEdit, todoModalState.occurrenceDate, todoModalState.open])

  const openAddTodoModal = ({
    date,
    isEditing = true,
    id,
    occurrenceDate,
  }: OpenTodoModalArgs = {}) => {
    setAddTodoDate(date ?? getIsoDateWithOffset(0))
    setTodoModalState({
      id,
      open: true,
      isEdit: isEditing,
      occurrenceDate,
    })
  }

  const closeAddTodoModal = () => {
    setTodoModalState({
      id: undefined,
      open: false,
      isEdit: false,
      occurrenceDate: undefined,
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(min-width: ${theme.breakPoints.desktop})`)
    const handler = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return {
    todoFilter,
    setTodoFilter,
    isDesktop,
    addTodoDate,
    todoModalState,
    editingCardKey,
    openAddTodoModal,
    closeAddTodoModal,
  }
}
