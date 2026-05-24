import moment from 'moment'
import { useCallback } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import { resolveOccurrenceDateTime } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import { RECURRENCE_EVENT_SCOPE } from '@/shared/constants/recurrenceScope'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type {
  RecurrenceEventScope,
  RecurrenceGroup,
  RecurrenceTodoScope,
} from '@/shared/types/recurrence/recurrence'
import {
  normalizeRecurrenceGroupPayload,
  toWeekday,
  toWeekOfMonth,
} from '@/shared/utils/recurrencePattern'
import { useToastStore } from '@/store/useToastStore'

export const buildRecurringGroupForFutureDrop = (
  recurrenceGroup: CalendarEvent['recurrenceGroup'],
  nextStart: Date,
): RecurrenceGroup | undefined => {
  const source = normalizeRecurrenceGroupPayload(recurrenceGroup)
  if (!source) return undefined
  const weekday = toWeekday(nextStart)
  const nextWeekOfMonth = toWeekOfMonth(nextStart)
  const nextDayOfMonth = nextStart.getDate()

  const nextGroup: RecurrenceGroup = {
    ...source,
  }

  if (source.frequency === 'WEEKLY') {
    nextGroup.daysOfWeek = [weekday]
  }

  if (source.frequency === 'MONTHLY') {
    if (source.monthlyType === 'DAY_OF_WEEK') {
      nextGroup.weekOfMonth = nextWeekOfMonth
      nextGroup.weekdayRule = 'SINGLE'
      nextGroup.dayOfWeekInMonth = weekday
    } else {
      nextGroup.daysOfMonth = [nextDayOfMonth]
      nextGroup.weekOfMonth = undefined
      nextGroup.weekdayRule = undefined
      nextGroup.dayOfWeekInMonth = undefined
    }
  }

  if (source.frequency === 'YEARLY') {
    nextGroup.monthOfYear = nextStart.getMonth() + 1
    if (source.weekOfMonth != null || source.weekdayRule != null) {
      nextGroup.weekOfMonth = nextWeekOfMonth
      if (source.weekdayRule && source.weekdayRule !== 'SINGLE') {
        nextGroup.dayOfWeekInMonth = null
      } else {
        nextGroup.weekdayRule = 'SINGLE'
        nextGroup.dayOfWeekInMonth = weekday
      }
    }
  }

  return nextGroup
}

type UseCalendarDragDropArgs = {
  view: View
  moveEvent: (args: EventInteractionArgs<CalendarEvent>) => void
  patchEventMutate: (payload: {
    eventId: number
    params: {
      occurrenceDate: string
      scope?: RecurrenceEventScope
    }
    eventData: {
      startTime: string
      endTime: string
      isAllDay: boolean
      recurrenceGroup?: RecurrenceGroup
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
  const showReadOnlyToast = useCallback(() => {
    useToastStore.getState().showToast({
      title: '일정을 수정할 수 없습니다',
      message: '일정 소유자만 수정할 수 있습니다.',
      toastType: 'warning',
    })
  }, [])

  const applyEventDrop = useCallback(
    (
      args: EventInteractionArgs<CalendarEvent>,
      options?: {
        eventScope?: RecurrenceEventScope
        todoScope?: RecurrenceTodoScope
      },
    ) => {
      const { event, start, end } = args
      if (event.type !== 'todo' && event.isOwner === false) {
        showReadOnlyToast()
        return
      }
      moveEvent(args)
      if (view !== Views.MONTH && view !== Views.WEEK) return
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
          ...(options?.eventScope === RECURRENCE_EVENT_SCOPE.THIS_AND_FOLLOWING_EVENTS
            ? {
                recurrenceGroup: buildRecurringGroupForFutureDrop(
                  event.recurrenceGroup,
                  start as Date,
                ),
              }
            : {}),
        },
      })
    },
    [moveEvent, patchEventMutate, patchTodoTiming, showReadOnlyToast, view],
  )

  const handleEventDrop = useCallback(
    (args: EventInteractionArgs<CalendarEvent>) => {
      const { event } = args
      if (event.type !== 'todo' && event.isOwner === false) {
        showReadOnlyToast()
        return
      }
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
    [applyEventDrop, onRequireRecurringDropConfirm, showReadOnlyToast, view],
  )

  return { handleEventDrop, applyEventDrop }
}
