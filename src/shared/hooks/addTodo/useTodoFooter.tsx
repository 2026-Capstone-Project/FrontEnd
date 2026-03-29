import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

  const handleDelete = useCallback(() => {
    if (eventId == null || eventId === 0 || !isPersistedTodo) {
      closeModal()
      return
    }
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
      return
    }
    deleteTodoMutate(
      {
        todoId: eventId,
        occurrenceDate,
      },
      {
        onSuccess: () => closeModal(),
      },
    )
  }, [
    closeModal,
    deleteTodoMutate,
    eventId,
    isPersistedTodo,
    occurrenceDate,
    repeatConfig.repeatType,
  ])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  const handleColorChange = useCallback(
    (value: EventColorType) => {
      const previousColor = eventColor
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
      }
      if (!isEditing || eventId == null || eventId === 0) {
        return
      }
      patchTodoMutate(
        {
          todoId: eventId,
          occurrenceDate,
          ...(hasExistingRecurrence ? { scope: 'THIS_TODO' as const } : {}),
          requestBody: {
            color: value,
          },
        },
        {
          onError: () => {
            setEventColor(previousColor)
            onEventColorChange?.(eventId, previousColor)
          },
        },
      )
    },
    [
      eventColor,
      eventId,
      hasExistingRecurrence,
      isEditing,
      occurrenceDate,
      onEventColorChange,
      patchTodoMutate,
      setEventColor,
    ],
  )

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
