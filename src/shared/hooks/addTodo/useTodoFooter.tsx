import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EventColorType } from '@/shared/types/event/event'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import type { RepeatConfig } from '@/shared/types/recurrence/repeat'
import SelectColor from '@/shared/ui/common/SelectColor/SelectColor'

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

  useEffect(() => {
    eventIdRef.current = eventId
  }, [eventId])
  useEffect(() => {
    isPersistedTodoRef.current = isPersistedTodo
  }, [isPersistedTodo])
  useEffect(() => {
    repeatTypeRef.current = repeatConfig.repeatType
  }, [repeatConfig.repeatType])
  useEffect(() => {
    occurrenceDateRef.current = occurrenceDate
  }, [occurrenceDate])
  useEffect(() => {
    closeModalRef.current = closeModal
  }, [closeModal])
  useEffect(() => {
    deleteTodoMutateRef.current = deleteTodoMutate
  }, [deleteTodoMutate])
  useEffect(() => {
    patchTodoMutateRef.current = patchTodoMutate
  }, [patchTodoMutate])
  useEffect(() => {
    eventColorRef.current = eventColor
  }, [eventColor])
  useEffect(() => {
    isEditingRef.current = isEditing
  }, [isEditing])
  useEffect(() => {
    hasExistingRecurrenceRef.current = hasExistingRecurrence
  }, [hasExistingRecurrence])
  useEffect(() => {
    onEventColorChangeRef.current = onEventColorChange
  }, [onEventColorChange])
  useEffect(() => {
    setEventColorRef.current = setEventColor
  }, [setEventColor])

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
        ...(hasExistingRecurrenceRef.current ? { scope: 'THIS_TODO' as const } : {}),
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
