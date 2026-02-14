// 일정 수정 payload를 생성하고 patch 요청을 보내는 훅
import { useCallback } from 'react'

import type { CalendarEvent, Event } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues, RepeatConfigSchema } from '@/shared/types/event/event'
import type { RecurrenceEventScope } from '@/shared/types/recurrence/recurrence'
import { mapRepeatConfigToRecurrenceGroup } from '@/shared/utils/recurrenceGroup'
import { areRepeatConfigsEqual } from '@/shared/utils/repeatConfig'

type PatchEventMutate = (params: {
  eventId: number
  eventData: {
    title?: string
    content?: string
    startTime?: string
    endTime?: string
    color?: Event['color']
    isAllDay?: boolean
    recurrenceUpdateScope?: RecurrenceEventScope
    occurrenceDate?: string
    recurrenceGroup?: Event['recurrenceGroup'] | null
  }
}) => Promise<unknown>

type UseSchedulePatchArgs = {
  eventId: number | null
  date: string
  initialEvent?: CalendarEvent | null
  initialRepeatConfig: RepeatConfigSchema
  patchEventMutation: PatchEventMutate
  formatDateTime: (value: Date) => string
  buildDateTime: (dateValue: Date | null, timeValue?: string) => Date
}

export const useSchedulePatch = ({
  eventId,
  date,
  initialEvent,
  initialRepeatConfig,
  patchEventMutation,
  formatDateTime,
  buildDateTime,
}: UseSchedulePatchArgs) =>
  useCallback(
    (values: AddScheduleFormValues, scope?: RecurrenceEventScope, occurrenceDate?: string) => {
      if (eventId == null || eventId === 0) return Promise.resolve()
      const startDate = values.eventStartDate ?? new Date(date)
      const endDate = values.eventEndDate ?? startDate
      const [start, end] = values.isAllday
        ? [
            new Date(new Date(startDate).setHours(0, 0, 0, 0)),
            new Date(new Date(endDate).setHours(23, 59, 59, 0)),
          ]
        : [
            buildDateTime(startDate, values.eventStartTime),
            buildDateTime(endDate, values.eventEndTime),
          ]

      const isRecurring =
        values.repeatConfig.repeatType !== 'none' || initialEvent?.recurrenceGroup != null
      const shouldSendRecurrenceGroup = !areRepeatConfigsEqual(
        values.repeatConfig,
        initialRepeatConfig,
      )

      const initialTitle = initialEvent?.title ?? ''
      const initialContent = initialEvent?.content ?? ''
      const initialColor = initialEvent?.color
      const initialIsAllday = initialEvent?.isAllDay ?? false
      const initialStart =
        initialEvent?.start != null ? formatDateTime(new Date(initialEvent.start)) : undefined
      const initialEnd =
        initialEvent?.end != null ? formatDateTime(new Date(initialEvent.end)) : undefined

      const nextTitle = values.eventTitle?.trim() || '새 일정'
      const nextContent = values.eventDescription ?? ''
      const nextStart = formatDateTime(start)
      const nextEnd = formatDateTime(end)
      const nextOccurrenceDate = occurrenceDate ?? nextStart

      const eventData: Parameters<PatchEventMutate>[0]['eventData'] = {
        ...(nextTitle !== initialTitle ? { title: nextTitle } : {}),
        ...(nextContent !== initialContent ? { content: nextContent } : {}),
        ...(initialStart && nextStart !== initialStart ? { startTime: nextStart } : {}),
        ...(initialEnd && nextEnd !== initialEnd ? { endTime: nextEnd } : {}),
        ...(initialColor && values.eventColor !== initialColor ? { color: values.eventColor } : {}),
        ...(values.isAllday !== initialIsAllday ? { isAllDay: values.isAllday } : {}),
        ...(shouldSendRecurrenceGroup
          ? {
              recurrenceGroup:
                values.repeatConfig.repeatType === 'none'
                  ? null
                  : mapRepeatConfigToRecurrenceGroup(values.repeatConfig),
            }
          : {}),
        occurrenceDate: nextOccurrenceDate,
      }

      if (Object.keys(eventData).length === 0) return Promise.resolve()
      if (isRecurring && scope) {
        eventData.recurrenceUpdateScope = scope
      }

      return patchEventMutation({ eventId, eventData })
    },
    [
      buildDateTime,
      date,
      eventId,
      formatDateTime,
      initialEvent,
      initialRepeatConfig,
      patchEventMutation,
    ],
  )
