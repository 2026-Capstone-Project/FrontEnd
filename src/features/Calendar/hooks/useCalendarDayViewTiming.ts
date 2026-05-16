import moment from 'moment'
import { useCallback } from 'react'

import { getEventOccurrenceScope } from '@/features/Calendar/utils/helpers/calendarRecurrenceScope'
import { resolveOccurrenceDateTime } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import type { RecurrenceEventSeriesScope } from '@/shared/constants/recurrenceScope'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import type { PatchTodoTiming } from './useCalendarTodoTimingPatch'

type PatchEventPayload = {
  eventId: number
  params: {
    occurrenceDate: string
    scope?: RecurrenceEventSeriesScope
  }
  eventData: {
    startTime: string
    endTime: string
    isAllDay: boolean
  }
}

type UseCalendarDayViewTimingArgs = {
  events: CalendarEvent[]
  patchEventMutate: (payload: PatchEventPayload) => void
  patchTodoTiming: PatchTodoTiming
  updateLocalEventTime: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    type?: CalendarEvent['type'],
  ) => void
}

export const useCalendarDayViewTiming = ({
  events,
  patchEventMutate,
  patchTodoTiming,
  updateLocalEventTime,
}: UseCalendarDayViewTimingArgs) => {
  const handleDayViewEventTimeChange = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, type?: CalendarEvent['type']) => {
      updateLocalEventTime(eventId, start, end, type)
      if (type === 'todo') {
        const todoEvent = events.find(
          (eventItem) => eventItem.id === eventId && eventItem.type === 'todo',
        )
        if (todoEvent) {
          patchTodoTiming(todoEvent, start)
        }
        return
      }

      const targetEvent = events.find((eventItem) => eventItem.id === eventId)
      const occurrenceDate = resolveOccurrenceDateTime(
        targetEvent?.occurrenceDate,
        targetEvent?.start ?? start,
      )
      const patchScope = getEventOccurrenceScope(targetEvent?.recurrenceGroup != null)
      patchEventMutate({
        eventId,
        params: {
          occurrenceDate,
          ...(patchScope ? { scope: patchScope } : {}),
        },
        eventData: {
          startTime: moment(start).format('YYYY-MM-DDTHH:mm:ss'),
          endTime: moment(end).format('YYYY-MM-DDTHH:mm:ss'),
          isAllDay: false,
        },
      })
    },
    [events, patchEventMutate, patchTodoTiming, updateLocalEventTime],
  )

  const handleDayViewEventTimePreview = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, type?: CalendarEvent['type']) => {
      updateLocalEventTime(eventId, start, end, type)
    },
    [updateLocalEventTime],
  )

  return {
    handleDayViewEventTimeChange,
    handleDayViewEventTimePreview,
  }
}
