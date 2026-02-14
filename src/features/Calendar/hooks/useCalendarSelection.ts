import { useCallback, useState } from 'react'

import { normalizeDate } from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getEventOccurrenceKey } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarSelectionArgs = {
  onOpenEvent: (event: CalendarEvent) => void
}
// 선택된 이벤트/날짜 상태와 도우미를 관리합니다.
export const useCalendarSelection = ({ onOpenEvent }: UseCalendarSelectionArgs) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<CalendarEvent['id'] | null>(null)
  const [selectedEventKey, setSelectedEventKey] = useState<string | null>(null)

  // 선택 상태 초기화
  const clearSelection = useCallback(() => {
    setSelectedEventId(null)
    setSelectedEventKey(null)
    setSelectedDate(null)
  }, [])

  // 이벤트 선택 및 상세 열기
  const selectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEventId(event.id)
      setSelectedDate(normalizeDate(event.start))
      setSelectedEventKey(getEventOccurrenceKey(event))
      onOpenEvent(event)
    },
    [onOpenEvent],
  )

  // 이벤트만 선택 (상세 열기 없음)
  const selectEventOnly = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
    setSelectedDate(normalizeDate(event.start))
    setSelectedEventKey(getEventOccurrenceKey(event))
  }, [])

  return {
    selectedDate,
    setSelectedDate,
    selectedEventId,
    setSelectedEventId,
    selectedEventKey,
    setSelectedEventKey,
    clearSelection,
    selectEvent,
    selectEventOnly,
  }
}
