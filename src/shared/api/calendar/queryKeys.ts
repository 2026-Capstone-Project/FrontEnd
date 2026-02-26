import { createQueryKeys } from '@lukemorales/query-key-factory'

import { getDetailEvent, getEvents, getTodoForCalendar } from '../calendar/api'

export const calendarKeys = createQueryKeys('calendar', {
  events: (startDate: string, endDate: string) => ({
    queryKey: [{ startDate, endDate }],
    queryFn: () => getEvents({ startDate, endDate }),
  }),
  detail: (eventId: number, occurrenceDate: string) => ({
    queryKey: ['event', { eventId, occurrenceDate }],
    queryFn: () => getDetailEvent(eventId, occurrenceDate),
  }),
  todos: (startDate: string, endDate: string) => ({
    queryKey: [{ startDate, endDate }],
    queryFn: () => getTodoForCalendar(startDate, endDate),
  }),
})
