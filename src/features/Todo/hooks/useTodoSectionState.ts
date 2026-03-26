import { useEffect, useMemo, useState } from 'react'

import { theme } from '@/shared/styles/theme'
import type { TodoFilter } from '@/shared/types/todo/types'

import { getIsoDateWithOffset } from '../utils/todoDate'

type OpenTodoEditorArgs = {
  date?: string
  isEditing?: boolean
  id?: number
  occurrenceDate?: string
}

type TodoEditorState = {
  id: number | undefined
  open: boolean
  isEditing: boolean
  occurrenceDate?: string
}

export const useTodoSectionState = () => {
  const [todoFilter, setTodoFilter] = useState<TodoFilter>('ALL')
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${theme.breakPoints.desktop})`).matches
  })

  const [todoEditorState, setTodoEditorState] = useState<TodoEditorState>({
    id: undefined,
    open: false,
    isEditing: false,
    occurrenceDate: undefined,
  })
  const [todoEditorDate, setTodoEditorDate] = useState(() => getIsoDateWithOffset(0))

  // 반복 할 일은 같은 id라도 occurrenceDate가 다를 수 있어서,
  // 카드 편집 강조 기준을 id + occurrenceDate 조합으로 고정합니다.
  const editingCardKey = useMemo(() => {
    if (!todoEditorState.open || !todoEditorState.isEditing) return undefined
    if (todoEditorState.id == null || !todoEditorState.occurrenceDate) return undefined
    return `${todoEditorState.id}-${todoEditorState.occurrenceDate}`
  }, [
    todoEditorState.id,
    todoEditorState.isEditing,
    todoEditorState.occurrenceDate,
    todoEditorState.open,
  ])

  const openTodoEditor = ({
    date,
    isEditing = true,
    id,
    occurrenceDate,
  }: OpenTodoEditorArgs = {}) => {
    setTodoEditorDate(date ?? getIsoDateWithOffset(0))
    setTodoEditorState({
      id,
      open: true,
      isEditing,
      occurrenceDate,
    })
  }

  const closeTodoEditor = () => {
    setTodoEditorState({
      id: undefined,
      open: false,
      isEditing: false,
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
    todoEditorDate,
    todoEditorState,
    editingCardKey,
    openTodoEditor,
    closeTodoEditor,
  }
}
