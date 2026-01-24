import { useCallback, useState } from 'react'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '../components/CustomView/CustomDayView'
import { mockCalendarEvents } from '../mocks/calendarEvents'
import { appendEvent, normalizeDate, updateEventRange } from '../utils/helpers/calendarPageHelpers'

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => [...mockCalendarEvents])

  const addEvent = useCallback((date: Date, allDay = false) => {
    setEvents((prev) => appendEvent(prev, date, allDay))
  }, [])

  const moveEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) => updateEventRange(prev, event.id, normalizedStart, normalizedEnd))
  }, [])

  const resizeEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) => updateEventRange(prev, event.id, normalizedStart, normalizedEnd))
  }, [])

  return { events, addEvent, moveEvent, resizeEvent }
}
