// 일정 수정 payload를 생성하고 patch 요청을 보내는 훅
import { useCallback } from 'react'

import type { CalendarEvent, Event } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues, RepeatConfigSchema } from '@/shared/types/event/event'
import type { RecurrenceEventScope, RecurrenceGroup } from '@/shared/types/recurrence/recurrence'
import { mapRepeatConfigToRecurrenceGroup } from '@/shared/utils/recurrenceGroup'
import {
  isSameYmd,
  normalizeRecurrenceGroupPayload,
  toWeekday,
  toWeekOfMonth,
} from '@/shared/utils/recurrencePattern'

const isMonthlyPatternWithFlexibleWeekdayRule = (group: RecurrenceGroup | null | undefined) =>
  group?.frequency === 'MONTHLY' &&
  group.monthlyType === 'DAY_OF_WEEK' &&
  group.weekdayRule != null &&
  group.weekdayRule !== 'SINGLE'

const buildMonthlySinglePatternFromDate = (
  group: RecurrenceGroup,
  targetDate: Date,
): RecurrenceGroup => ({
  ...group,
  monthlyType: 'DAY_OF_WEEK',
  weekOfMonth: toWeekOfMonth(targetDate),
  weekdayRule: 'SINGLE',
  dayOfWeekInMonth: toWeekday(targetDate),
  daysOfMonth: undefined,
})

type PatchEventMutate = (params: {
  eventId: number
  params: {
    occurrenceDate: string
    scope?: Extract<RecurrenceEventScope, 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS'>
  }
  eventData: {
    title?: string
    content?: string
    location?: string
    address?: string | null
    startTime?: string
    endTime?: string
    color?: Event['color']
    isAllDay?: boolean
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
      const initialRecurrenceGroupPayload =
        normalizeRecurrenceGroupPayload(initialEvent?.recurrenceGroup) ??
        mapRepeatConfigToRecurrenceGroup(initialRepeatConfig)
      const nextRecurrenceGroupPayload =
        values.repeatConfig.repeatType === 'none'
          ? null
          : mapRepeatConfigToRecurrenceGroup(values.repeatConfig)
      const shouldSendRecurrenceGroup =
        JSON.stringify(nextRecurrenceGroupPayload ?? null) !==
        JSON.stringify(initialRecurrenceGroupPayload ?? null)
      const patchScope = shouldSendRecurrenceGroup
        ? 'THIS_AND_FOLLOWING_EVENTS'
        : isRecurring
          ? (scope ?? 'THIS_EVENT')
          : undefined

      const initialTitle = initialEvent?.title ?? ''
      const initialContent = initialEvent?.content ?? ''
      const initialLocation = initialEvent?.location ?? ''
      const initialAddress = initialEvent?.address ?? null
      const initialColor = initialEvent?.color
      const initialIsAllday = initialEvent?.isAllDay ?? false
      const initialStart =
        initialEvent?.start != null ? formatDateTime(new Date(initialEvent.start)) : undefined
      const initialEnd =
        initialEvent?.end != null ? formatDateTime(new Date(initialEvent.end)) : undefined

      const nextTitle = values.eventTitle?.trim() || '새 일정'
      const nextContent = values.eventDescription ?? ''
      const nextLocation = values.location?.trim() || ''
      const nextAddress = values.address?.trim() || null
      const nextStart = formatDateTime(start)
      const nextEnd = formatDateTime(end)
      const hasStartDateChanged =
        initialEvent?.start != null && !isSameYmd(new Date(initialEvent.start), start)
      const shouldSendMonthlySinglePattern =
        patchScope === 'THIS_AND_FOLLOWING_EVENTS' &&
        !shouldSendRecurrenceGroup &&
        hasStartDateChanged &&
        isMonthlyPatternWithFlexibleWeekdayRule(initialRecurrenceGroupPayload)
      const monthlySinglePatternPayload =
        shouldSendMonthlySinglePattern && initialRecurrenceGroupPayload
          ? buildMonthlySinglePatternFromDate(initialRecurrenceGroupPayload, start)
          : undefined
      const recurrenceGroupPayload = shouldSendRecurrenceGroup
        ? nextRecurrenceGroupPayload
        : monthlySinglePatternPayload
      // occurrenceDate 우선순위:
      // 1) 호출자가 명시적으로 전달한 occurrenceDate
      // 2) 기존 이벤트가 가진 태생 occurrenceDate
      // 3) 현재 계산된 startTime
      const nextOccurrenceDate =
        occurrenceDate ??
        (initialEvent?.occurrenceDate
          ? formatDateTime(new Date(initialEvent.occurrenceDate))
          : nextStart)

      const eventData: Parameters<PatchEventMutate>[0]['eventData'] = {
        ...(nextTitle !== initialTitle ? { title: nextTitle } : {}),
        ...(nextContent !== initialContent ? { content: nextContent } : {}),
        ...(nextLocation !== initialLocation ? { location: nextLocation } : {}),
        ...(nextAddress !== initialAddress ? { address: nextAddress } : {}),
        ...(initialStart && nextStart !== initialStart ? { startTime: nextStart } : {}),
        ...(initialEnd && nextEnd !== initialEnd ? { endTime: nextEnd } : {}),
        ...(initialColor && values.eventColor !== initialColor ? { color: values.eventColor } : {}),
        ...(values.isAllday !== initialIsAllday ? { isAllDay: values.isAllday } : {}),
        ...(recurrenceGroupPayload !== undefined
          ? {
              recurrenceGroup: recurrenceGroupPayload,
            }
          : {}),
      }

      if (Object.keys(eventData).length === 0) return Promise.resolve()
      return patchEventMutation({
        eventId,
        params: {
          occurrenceDate: nextOccurrenceDate,
          ...(patchScope ? { scope: patchScope } : {}),
        },
        eventData,
      })
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
