import moment from 'moment'
import { useCallback } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import { resolveOccurrenceDateTime } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type {
  RecurrenceEventScope,
  RecurrenceTodoScope,
} from '@/shared/types/recurrence/recurrence'

type UseCalendarDragDropArgs = {
  view: View
  moveEvent: (args: EventInteractionArgs<CalendarEvent>) => void
  patchEventMutate: (payload: {
    eventId: number
    params: {
      occurrenceDate: string
    }
    eventData: {
      startTime: string
      endTime: string
      isAllDay: boolean
    }
  }) => void
  patchTodoTiming: (
    todoEvent: CalendarEvent,
    start: Date,
    options?: { scope?: RecurrenceTodoScope; occurrenceDate?: string },
  ) => void
  onRequireRecurringDropConfirm?: (
    args: EventInteractionArgs<CalendarEvent>,
    target: 'event' | 'todo',
  ) => void
}
// 드래그/드롭으로 일정·할 일을 갱신합니다.
export const useCalendarDragDrop = ({
  view,
  moveEvent,
  patchEventMutate,
  patchTodoTiming,
  onRequireRecurringDropConfirm,
}: UseCalendarDragDropArgs) => {
  const applyEventDrop = useCallback(
    (
      args: EventInteractionArgs<CalendarEvent>,
      options?: {
        eventScope?: RecurrenceEventScope
        todoScope?: RecurrenceTodoScope
      },
    ) => {
      moveEvent(args)
      if (view !== Views.MONTH && view !== Views.WEEK) return
      const { event, start, end } = args
      if (event.type === 'todo') {
        const defaultOccurrenceDate = moment(event.occurrenceDate ?? event.start).format(
          'YYYY-MM-DD',
        )
        patchTodoTiming(event, start as Date, {
          occurrenceDate: defaultOccurrenceDate,
          scope: options?.todoScope,
        })
        return
      }
      const nextStart = moment(start).format('YYYY-MM-DDTHH:mm:ss')
      const nextEnd = moment(end).format('YYYY-MM-DDTHH:mm:ss')
      const occurrenceDate = resolveOccurrenceDateTime(event.occurrenceDate, event.start)
      patchEventMutate({
        eventId: event.id,
        params: {
          occurrenceDate,
          ...(options?.eventScope ? { scope: options.eventScope } : {}),
        },
        eventData: {
          startTime: nextStart,
          endTime: nextEnd,
          isAllDay: event.isAllDay ?? false,
        },
      })
    },
    [moveEvent, patchEventMutate, patchTodoTiming, view],
  )

  const handleEventDrop = useCallback(
    (args: EventInteractionArgs<CalendarEvent>) => {
      const { event } = args
      if (
        (view === Views.MONTH || view === Views.WEEK) &&
        event.type !== 'todo' &&
        event.recurrenceGroup != null
      ) {
        onRequireRecurringDropConfirm?.(args, 'event')
        return
      }
      if (
        (view === Views.MONTH || view === Views.WEEK) &&
        event.type === 'todo' &&
        event.isRecurring
      ) {
        onRequireRecurringDropConfirm?.(args, 'todo')
        return
      }
      applyEventDrop(args)
    },
    [applyEventDrop, onRequireRecurringDropConfirm, view],
  )

  return { handleEventDrop, applyEventDrop }
}
