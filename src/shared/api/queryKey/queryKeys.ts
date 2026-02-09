import { createQueryKeys } from '@lukemorales/query-key-factory'

import { getDetailEvent, getEvents } from '../calendar/api'

export const calendarKeys = createQueryKeys('calendar', {
  events: (startDate: string, endDate: string) => ({
    queryKey: ['events', { startDate, endDate }],
    queryFn: () => getEvents({ startDate, endDate }),
  }),
  detail: (eventId: number, occurrenceDate: string) => ({
    queryKey: ['eventDetail', { eventId, occurrenceDate }],
    queryFn: () => getDetailEvent(eventId, occurrenceDate),
  }),
})
