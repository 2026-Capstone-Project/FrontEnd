import moment from 'moment'
import { useCallback, useMemo } from 'react'

import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues, RepeatConfigSchema } from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { useSchedulePatch } from '@/shared/ui/modal/AddSchedule/hooks/useSchedulePatch'
import {
  mapRecurrenceGroupToRepeatConfig,
  mapRepeatConfigToRecurrenceGroup,
} from '@/shared/utils/recurrenceGroup'

type UseSchedulePatchControllerProps = {
  eventId: CalendarEvent['id']
  date: string
  initialEvent?: CalendarEvent | null
}

export const useSchedulePatchController = ({
  eventId,
  date,
  initialEvent,
}: UseSchedulePatchControllerProps) => {
  // API 전송용 날짜/시간 포맷팅
  const formatDateTime = useCallback(
    (value: Date) => moment(value).format('YYYY-MM-DDTHH:mm:ss'),
    [],
  )

  const { usePatchEvent, usePostEvent } = useCalendarMutation()
  const { mutateAsync: patchEventMutation } = usePatchEvent()
  const { mutateAsync: postEventMutation } = usePostEvent()

  // 서버 반복 규칙을 폼 기본값으로 매핑
  const initialRepeatConfig = useMemo<RepeatConfigSchema>(() => {
    const mapped = mapRecurrenceGroupToRepeatConfig(initialEvent?.recurrenceGroup)
    return {
      ...defaultRepeatConfig,
      ...mapped,
      customWeeklyDays: mapped.customWeeklyDays ?? [],
      customMonthlyDates: mapped.customMonthlyDates ?? [],
      customYearlyMonths: mapped.customYearlyMonths ?? [],
    } as RepeatConfigSchema
  }, [initialEvent])

  // 날짜 + 시간 문자열을 Date로 합성
  const buildDateTime = useCallback((dateValue: Date | null, timeValue?: string) => {
    const nextDate = dateValue ? new Date(dateValue) : new Date()
    if (!timeValue) {
      nextDate.setHours(0, 0, 0, 0)
      return nextDate
    }
    const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
    nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
    return nextDate
  }, [])

  // 변경된 필드만 추려 patch 요청 생성
  const patchSchedule = useSchedulePatch({
    eventId,
    date,
    initialEvent,
    initialRepeatConfig,
    patchEventMutation,
    formatDateTime,
    buildDateTime,
  })

  const createSchedule = useCallback(
    (values: AddScheduleFormValues) => {
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

      const recurrenceGroup =
        values.repeatConfig.repeatType === 'none'
          ? undefined
          : (mapRepeatConfigToRecurrenceGroup(values.repeatConfig) ?? undefined)

      return postEventMutation({
        title: values.eventTitle?.trim() || '새 일정',
        content: values.eventDescription ?? '',
        startTime: formatDateTime(start),
        endTime: formatDateTime(end),
        isAllDay: values.isAllday,
        color: values.eventColor,
        recurrenceGroup,
      })
    },
    [buildDateTime, date, formatDateTime, postEventMutation],
  )

  return {
    formatDateTime,
    buildDateTime,
    initialRepeatConfig,
    patchSchedule,
    createSchedule,
  }
}
