import { useCallback, useState } from 'react'

import type { RecurringDropConfirmState } from '@/features/Calendar/components/CustomCalendar/CustomCalendar.types'
import {
  getEventScopeFromEditOption,
  getTodoScopeFromEditOption,
} from '@/features/Calendar/utils/helpers/calendarRecurrenceScope'
import type { EditConfirmOption } from '@/shared/ui/Modals'

import { useCalendarDragDrop } from './useCalendarDragDrop'

type UseCalendarRecurringDropConfirmArgs = Omit<
  Parameters<typeof useCalendarDragDrop>[0],
  'onRequireRecurringDropConfirm'
>

export const useCalendarRecurringDropConfirm = ({
  view,
  moveEvent,
  patchEventMutate,
  patchTodoTiming,
}: UseCalendarRecurringDropConfirmArgs) => {
  const [recurringDropConfirm, setRecurringDropConfirm] = useState<RecurringDropConfirmState>({
    isOpen: false,
    target: 'event',
    args: null,
  })

  const { handleEventDrop, applyEventDrop } = useCalendarDragDrop({
    view,
    moveEvent,
    patchEventMutate,
    patchTodoTiming,
    onRequireRecurringDropConfirm: (args, target) => {
      setRecurringDropConfirm({ isOpen: true, target, args })
    },
  })

  const handleCloseRecurringDropConfirm = useCallback(() => {
    setRecurringDropConfirm({ isOpen: false, target: 'event', args: null })
  }, [])

  const handleConfirmRecurringDrop = useCallback(
    (option: EditConfirmOption) => {
      if (!recurringDropConfirm.args) return
      if (recurringDropConfirm.target === 'todo') {
        applyEventDrop(recurringDropConfirm.args, { todoScope: getTodoScopeFromEditOption(option) })
        handleCloseRecurringDropConfirm()
        return
      }
      applyEventDrop(recurringDropConfirm.args, { eventScope: getEventScopeFromEditOption(option) })
      handleCloseRecurringDropConfirm()
    },
    [
      applyEventDrop,
      handleCloseRecurringDropConfirm,
      recurringDropConfirm.args,
      recurringDropConfirm.target,
    ],
  )

  return {
    recurringDropConfirm,
    handleEventDrop,
    handleCloseRecurringDropConfirm,
    handleConfirmRecurringDrop,
  }
}
