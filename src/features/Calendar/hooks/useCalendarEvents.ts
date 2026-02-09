import { useCallback, useEffect, useState } from 'react'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import { createEvent, normalizeDate, updateEventRange } from '../utils/helpers/calendarPageHelpers'

type UseCalendarEventsOptions = {
  initialEvents?: CalendarEvent[]
}

export const useCalendarEvents = (options: UseCalendarEventsOptions = {}) => {
  const { initialEvents } = options
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    initialEvents && initialEvents.length > 0 ? initialEvents : [],
  )

  useEffect(() => {
    if (!initialEvents) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(initialEvents)
  }, [initialEvents])

  const addEvent = useCallback((date: Date, allDay = false) => {
    const createdId = Date.now()
    const nextEvent: CalendarEvent = { ...createEvent(date, 0, allDay), id: createdId }
    setEvents((prev) => [...prev, nextEvent])
    return createdId
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

  const updateEventTime = useCallback((eventId: CalendarEvent['id'], start: Date, end: Date) => {
    setEvents((prev) => updateEventRange(prev, eventId, start, end))
  }, [])

  const updateEventColor = useCallback(
    (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, color } : event)))
    },
    [],
  )

  const updateEventTiming = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, allDay: boolean) => {
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, start, end, allDay } : event)),
      )
    },
    [],
  )

  const updateEventType = useCallback(
    (eventId: CalendarEvent['id'], type: CalendarEvent['type']) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, type, isDone: type === 'todo' ? event.isDone : undefined }
            : event,
        ),
      )
    },
    [],
  )

  const updateEventTitle = useCallback(
    (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, title } : event)))
    },
    [],
  )

  const toggleEventDone = useCallback((eventId: CalendarEvent['id']) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, isDone: !event.isDone } : event)),
    )
  }, [])

  const removeEvent = useCallback((eventId: CalendarEvent['id']) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])

  return {
    events,
    addEvent,
    moveEvent,
    resizeEvent,
    updateEventTime,
    updateEventColor,
    updateEventTiming,
    updateEventType,
    updateEventTitle,
    toggleEventDone,
    removeEvent,
  }
}
