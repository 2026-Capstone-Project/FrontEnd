// 캘린더 API 응답을 화면용 이벤트로 변환하는 훅
import { useMemo } from 'react'

import { useEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'

export const useCalendarApiEvents = (startDate: string, endDate: string) => {
  const { data } = useEventQuery(startDate, endDate)

  const events = useMemo<CalendarEvent[]>(() => {
    const details = data?.result?.details ?? []
    return details.map((item) => ({
      id: item.id,
      title: item.title,
      start: item.start,
      end: item.end,
      allDay: item.isAllday,
      type: 'schedule',
      color: item.color,
      location: item.location ?? undefined,
      memo: item.content ?? undefined,
      recurrenceGroup: item.recurrenceGroup ?? null,
    }))
  }, [data])

  return { events }
}
