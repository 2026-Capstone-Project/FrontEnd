import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { RECURRENCE_TODO_SCOPE } from '@/shared/constants/recurrenceScope'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EventColorType } from '@/shared/types/event/event'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import type { RepeatConfig } from '@/shared/types/recurrence/repeat'
import SelectColor from '@/shared/ui/scheduleTodo/SelectColor/SelectColor'

type UseTodoFooterProps = {
  repeatConfig: RepeatConfig
  eventId: CalendarEvent['id']
  isPersistedTodo: boolean
  isEditing: boolean
  occurrenceDate: string
  hasExistingRecurrence: boolean
  eventColor: EventColorType
  setEventColor: (value: EventColorType) => void
  onEventColorChange?: TodoEditorFormProps['onEventColorChange']
  registerFooterChildren?: (node: ReactNode | null) => void
  registerDeleteHandler?: TodoEditorFormProps['registerDeleteHandler']
  closeModal: () => void
}

export const useTodoFooter = ({
  repeatConfig,
  eventId,
  isPersistedTodo,
  isEditing,
  occurrenceDate,
  hasExistingRecurrence,
  eventColor,
  setEventColor,
  onEventColorChange,
  registerFooterChildren,
  registerDeleteHandler,
  closeModal,
}: UseTodoFooterProps) => {
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const { useDeleteTodo, usePatchTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const { mutate: patchTodoMutate } = usePatchTodo()
  const eventIdRef = useRef(eventId)
  const isPersistedTodoRef = useRef(isPersistedTodo)
  const repeatTypeRef = useRef(repeatConfig.repeatType)
  const occurrenceDateRef = useRef(occurrenceDate)
  const closeModalRef = useRef(closeModal)
  const deleteTodoMutateRef = useRef(deleteTodoMutate)
  const patchTodoMutateRef = useRef(patchTodoMutate)
  const eventColorRef = useRef(eventColor)
  const isEditingRef = useRef(isEditing)
  const hasExistingRecurrenceRef = useRef(hasExistingRecurrence)
  const onEventColorChangeRef = useRef(onEventColorChange)
  const setEventColorRef = useRef(setEventColor)
  // 최신 값을 유지하기 위해 렌더 단계에서 ref를 직접 동기화합니다.
  eventIdRef.current = eventId
  isPersistedTodoRef.current = isPersistedTodo
  repeatTypeRef.current = repeatConfig.repeatType
  occurrenceDateRef.current = occurrenceDate
  closeModalRef.current = closeModal
  deleteTodoMutateRef.current = deleteTodoMutate
  patchTodoMutateRef.current = patchTodoMutate
  eventColorRef.current = eventColor
  isEditingRef.current = isEditing
  hasExistingRecurrenceRef.current = hasExistingRecurrence
  onEventColorChangeRef.current = onEventColorChange
  setEventColorRef.current = setEventColor

  const handleDelete = useCallback(() => {
    if (eventIdRef.current == null || eventIdRef.current === 0 || !isPersistedTodoRef.current) {
      closeModalRef.current()
      return
    }
    if (repeatTypeRef.current !== 'none') {
      setDeleteWarningVisible(true)
      return
    }
    deleteTodoMutateRef.current(
      {
        todoId: eventIdRef.current,
        occurrenceDate: occurrenceDateRef.current,
      },
      {
        onSuccess: () => closeModalRef.current(),
      },
    )
  }, [])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  const handleColorChange = useCallback((value: EventColorType) => {
    const previousColor = eventColorRef.current
    setEventColorRef.current(value)
    if (eventIdRef.current != null && eventIdRef.current !== 0) {
      onEventColorChangeRef.current?.(eventIdRef.current, value)
    }
    if (!isEditingRef.current || eventIdRef.current == null || eventIdRef.current === 0) {
      return
    }
    patchTodoMutateRef.current(
      {
        todoId: eventIdRef.current,
        occurrenceDate: occurrenceDateRef.current,
        ...(hasExistingRecurrenceRef.current ? { scope: RECURRENCE_TODO_SCOPE.THIS_TODO } : {}),
        requestBody: {
          color: value,
        },
      },
      {
        onError: () => {
          setEventColorRef.current(previousColor)
          if (eventIdRef.current != null && eventIdRef.current !== 0) {
            onEventColorChangeRef.current?.(eventIdRef.current, previousColor)
          }
        },
      },
    )
  }, [])

  const footerNode = useMemo(
    () => <SelectColor value={eventColor} onChange={handleColorChange} />,
    [eventColor, handleColorChange],
  )

  useEffect(() => {
    registerFooterChildren?.(footerNode)
    return () => registerFooterChildren?.(null)
  }, [footerNode, registerFooterChildren])

  return { deleteWarningVisible, setDeleteWarningVisible }
}
