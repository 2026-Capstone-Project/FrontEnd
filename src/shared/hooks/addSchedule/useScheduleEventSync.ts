import { useCallback } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues } from '@/shared/types/event/event'

type UseScheduleEventSyncProps = {
  eventId: CalendarEvent['id']
  date: string
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  buildDateTime: (dateValue: Date | null, timeValue?: string) => Date
}

export const useScheduleEventSync = ({
  eventId,
  date,
  onEventTimingChange,
  onEventTitleConfirm,
  buildDateTime,
}: UseScheduleEventSyncProps) => {
  // 로컬 이벤트 시간 동기화
  const syncEventTiming = useCallback(
    (values: AddScheduleFormValues) => {
      if (eventId == null || eventId === 0) return
      if (!onEventTimingChange) return
      const startDate = values.eventStartDate ?? new Date(date)
      const endDate = values.eventEndDate ?? startDate
      if (values.isAllday) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true)
        return
      }
      const start = buildDateTime(startDate, values.eventStartTime)
      const end = buildDateTime(endDate, values.eventEndTime)
      onEventTimingChange(eventId, start, end, false)
    },
    [buildDateTime, date, eventId, onEventTimingChange],
  )

  // 제목 확정 처리(로컬 이벤트에 반영)
  const handleTitleConfirm = useCallback(
    (value: string) => {
      if (eventId != null && eventId !== 0) {
        onEventTitleConfirm?.(eventId, value)
      }
    },
    [eventId, onEventTitleConfirm],
  )

  return { syncEventTiming, handleTitleConfirm }
}
