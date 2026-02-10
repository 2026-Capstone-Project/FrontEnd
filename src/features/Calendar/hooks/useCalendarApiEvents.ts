// 캘린더 API 응답을 화면용 이벤트로 변환하는 훅
import { useMemo } from 'react'

import { useEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { Event } from '@/shared/types/calendar/types'

export const useCalendarApiEvents = (startDate: string, endDate: string) => {
  const { data, refetch, isFetching } = useEventQuery(startDate, endDate)

  const events = useMemo<Event[]>(() => data?.result?.details ?? [], [data])

  return { events, refetch, isFetching }
}
