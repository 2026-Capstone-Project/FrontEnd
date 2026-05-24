import moment from 'moment'
import { useCallback } from 'react'

import { useCalendarCreateHandlers } from '@/features/Calendar/hooks/useCalendarCreateHandlers'
import { useDayViewHandlers } from '@/features/Calendar/hooks/useDayViewHandlers'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarViewCreationHandlersArgs = {
  view: Parameters<typeof useCalendarCreateHandlers>[0]['view']
  enqueueEvent: (date: Date, allDay: boolean) => CalendarEvent['id'] | null
  handleAddEvent: (referenceDate?: Date | string, eventId?: CalendarEvent['id'] | null) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedEventId: (eventId: CalendarEvent['id'] | null) => void
  setSelectedEventKey: (eventKey: string | null) => void
  updateEventTime: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    type?: CalendarEvent['type'],
  ) => void
  updateEventTimePreview: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    type?: CalendarEvent['type'],
  ) => void
  onToggleTodo: (eventId: CalendarEvent['id']) => void
  selectedEventKey: string | null
  selectEventOnly: (event: CalendarEvent) => void
  selectEvent: (event: CalendarEvent) => void
}

export const useCalendarViewCreationHandlers = ({
  view,
  enqueueEvent,
  handleAddEvent,
  setSelectedDate,
  setSelectedEventId,
  setSelectedEventKey,
  updateEventTime,
  updateEventTimePreview,
  onToggleTodo,
  selectedEventKey,
  selectEventOnly,
  selectEvent,
}: UseCalendarViewCreationHandlersArgs) => {
  const { handleDayViewCreateEvent, handleSelectSlotWrapper } = useCalendarCreateHandlers({
    view,
    enqueueEvent,
    onAddEvent: handleAddEvent,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
  })

  const handleWeekViewCreateEvent = useCallback(
    (slotDate: Date) => {
      const start = moment(slotDate).startOf('day').set({ hour: 9, minute: 0, second: 0 }).toDate()
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        handleAddEvent(start, createdId)
      }
    },
    [enqueueEvent, handleAddEvent],
  )

  const handleWeekViewSelectDate = useCallback(
    (nextDate: Date) => {
      setSelectedDate(nextDate)
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    [setSelectedDate, setSelectedEventId, setSelectedEventKey],
  )

  const dayViewWithHandlers = useDayViewHandlers({
    clearSelectedDate: () => setSelectedDate(null),
    clearSelectedEvent: () => {
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    enqueueEvent,
    handleAddEvent,
    updateEventTime,
    updateEventTimePreview,
    onCreateEvent: handleDayViewCreateEvent,
    onToggleTodo,
    selectedEventKey,
    onEventSelect: selectEventOnly,
    onEventClick: undefined,
    onEventDoubleClick: selectEvent,
  })

  return {
    dayViewWithHandlers,
    handleSelectSlotWrapper,
    handleWeekViewCreateEvent,
    handleWeekViewSelectDate,
  }
}
