import moment from 'moment'
import { useCallback } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '@/shared/types/calendar/types'

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
  patchTodoTiming: (todoEvent: CalendarEvent, start: Date) => void
}
// 드래그/드롭으로 일정·할 일을 갱신합니다.
export const useCalendarDragDrop = ({
  view,
  moveEvent,
  patchEventMutate,
  patchTodoTiming,
}: UseCalendarDragDropArgs) => {
  const handleEventDrop = useCallback(
    (args: EventInteractionArgs<CalendarEvent>) => {
      moveEvent(args)
      if (view !== Views.MONTH && view !== Views.WEEK) return
      const { event, start, end } = args
      if (event.type === 'todo') {
        patchTodoTiming(event, start as Date)
        return
      }
      const nextStart = moment(start).format('YYYY-MM-DDTHH:mm:ss')
      const nextEnd = moment(end).format('YYYY-MM-DDTHH:mm:ss')
      const occurrenceDate = event.occurrenceDate
        ? moment(event.occurrenceDate).format('YYYY-MM-DDTHH:mm:ss')
        : moment(event.start).format('YYYY-MM-DDTHH:mm:ss')
      patchEventMutate({
        eventId: event.id,
        params: { occurrenceDate },
        eventData: {
          startTime: nextStart,
          endTime: nextEnd,
          isAllDay: event.isAllDay ?? false,
        },
      })
    },
    [moveEvent, patchEventMutate, patchTodoTiming, view],
  )

  return { handleEventDrop }
}
