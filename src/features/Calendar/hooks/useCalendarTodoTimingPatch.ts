import moment from 'moment'
import { useCallback, useRef } from 'react'

import { buildRecurringGroupForFutureDrop } from '@/features/Calendar/hooks/useCalendarDragDrop'
import {
  getTodoOccurrenceScope,
  isTodoFollowingScope,
} from '@/features/Calendar/utils/helpers/calendarRecurrenceScope'
import { getDetailTodo } from '@/shared/api/todo/api'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { RecurrenceGroup, RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { PatchTodoRequestDTO } from '@/shared/types/todo/types'

type PatchTodoPayload = {
  todoId: number
  requestBody: PatchTodoRequestDTO
  occurrenceDate?: string
  scope?: RecurrenceTodoScope
}

export type PatchTodoTiming = (
  todoEvent: CalendarEvent,
  start: Date,
  options?: { scope?: RecurrenceTodoScope; occurrenceDate?: string },
) => void

type UseCalendarTodoTimingPatchArgs = {
  patchTodoMutate: (payload: PatchTodoPayload) => void
}

export const useCalendarTodoTimingPatch = ({ patchTodoMutate }: UseCalendarTodoTimingPatchArgs) => {
  const recurringTodoPatchSeqRef = useRef<Map<string, number>>(new Map())

  const resolveFutureTodoRecurrenceGroup = useCallback(
    async (todoId: number, occurrenceDate: string, nextStart: Date) => {
      try {
        const { result } = await getDetailTodo(todoId, occurrenceDate)
        return buildRecurringGroupForFutureDrop(result?.recurrenceGroup ?? null, nextStart)
      } catch (error) {
        console.error('[useCalendarTodoTimingPatch] failed to resolve todo recurrenceGroup', error)
        return undefined
      }
    },
    [],
  )

  const patchTodoTiming = useCallback(
    (
      todoEvent: CalendarEvent,
      start: Date,
      options?: { scope?: RecurrenceTodoScope; occurrenceDate?: string },
    ) => {
      const startDate = moment(start).format('YYYY-MM-DD')
      const occurrenceDate =
        options?.occurrenceDate ??
        moment(todoEvent.occurrenceDate ?? todoEvent.start).format('YYYY-MM-DD')
      const patchScope = options?.scope ?? getTodoOccurrenceScope(Boolean(todoEvent.isRecurring))
      const dueTime = todoEvent.isAllDay ? undefined : moment(start).format('HH:mm')

      const submitPatch = (recurrenceGroup?: RecurrenceGroup) => {
        patchTodoMutate({
          todoId: todoEvent.id,
          occurrenceDate,
          ...(patchScope ? { scope: patchScope } : {}),
          requestBody: {
            startDate,
            dueTime,
            isAllDay: todoEvent.isAllDay,
            ...(recurrenceGroup ? { recurrenceGroup } : {}),
          },
        })
      }

      if (isTodoFollowingScope(patchScope)) {
        const requestKey = `${todoEvent.id}-${occurrenceDate}`
        const nextSequence = (recurringTodoPatchSeqRef.current.get(requestKey) ?? 0) + 1
        recurringTodoPatchSeqRef.current.set(requestKey, nextSequence)

        void resolveFutureTodoRecurrenceGroup(todoEvent.id, occurrenceDate, start).then(
          (recurrenceGroup) => {
            const latestSequence = recurringTodoPatchSeqRef.current.get(requestKey)
            if (latestSequence !== nextSequence) return
            submitPatch(recurrenceGroup)
          },
        )
        return
      }

      submitPatch()
    },
    [patchTodoMutate, resolveFutureTodoRecurrenceGroup],
  )

  return { patchTodoTiming }
}
