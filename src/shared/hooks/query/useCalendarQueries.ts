import { useCustomQuery } from '@/shared/hooks/common/customQuery'

import { calendarKeys } from '../../api/queryKey/queryKeys'

export function useEventQuery(startDate: string, endDate: string) {
  const query = calendarKeys.events(startDate, endDate)
  return useCustomQuery(query.queryKey, query.queryFn)
}

export function useDetailEventQuery(eventId?: number | null, occurrenceDate?: string) {
  const safeEventId = eventId ?? 0
  const safeOccurrenceDate = occurrenceDate ?? ''
  const query = calendarKeys.detail(safeEventId, safeOccurrenceDate)
  return useCustomQuery(query.queryKey, query.queryFn, {
    enabled: Boolean(eventId) && Boolean(occurrenceDate),
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 404) {
        return failureCount < 3
      }
      return failureCount < 2
    },
    retryDelay: (attempt) => Math.min(500 * attempt, 1500),
  })
}
