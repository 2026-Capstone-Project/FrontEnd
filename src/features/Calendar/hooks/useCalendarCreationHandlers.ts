import moment from 'moment'
import { useCallback } from 'react'
import type { SlotInfo, View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import { useDayViewHandlers } from './useDayViewHandlers'

type UseCalendarCreationHandlersArgs = {
  view: View
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

export const useCalendarCreationHandlers = ({
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
}: UseCalendarCreationHandlersArgs) => {
  const clearSelectionForDate = useCallback(
    (nextDate: Date | null) => {
      setSelectedDate(nextDate)
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    [setSelectedDate, setSelectedEventId, setSelectedEventKey],
  )

  const clearSelectedEvent = useCallback(() => {
    setSelectedEventId(null)
    setSelectedEventKey(null)
  }, [setSelectedEventId, setSelectedEventKey])

  const openDraftAt = useCallback(
    (start: Date) => {
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        handleAddEvent(start, createdId)
      }
    },
    [enqueueEvent, handleAddEvent],
  )

  const handleSelectSlotWrapper = useCallback(
    (slotInfo: SlotInfo) => {
      const isWeekSingleClick =
        view === Views.WEEK && slotInfo.action === 'select' && slotInfo.slots.length === 1

      if (slotInfo.action === 'doubleClick' || isWeekSingleClick) {
        openDraftAt(
          moment(slotInfo.start).set({ hour: 9, minute: 0, second: 0, millisecond: 0 }).toDate(),
        )
      }

      clearSelectionForDate(slotInfo.start)
    },
    [clearSelectionForDate, openDraftAt, view],
  )

  const handleDayViewCreateEvent = useCallback(
    (slotDate: Date) => {
      const startBase = moment(slotDate).set({ second: 0, millisecond: 0 })
      const snappedMinute = startBase.minute() < 30 ? 0 : 30
      openDraftAt(startBase.set({ minute: snappedMinute }).toDate())
    },
    [openDraftAt],
  )

  const handleWeekViewCreateEvent = useCallback(
    (slotDate: Date) => {
      openDraftAt(
        moment(slotDate).startOf('day').set({ hour: 9, minute: 0, second: 0 }).toDate(),
      )
    },
    [openDraftAt],
  )

  const handleWeekViewSelectDate = useCallback(
    (nextDate: Date) => clearSelectionForDate(nextDate),
    [clearSelectionForDate],
  )

  const dayViewWithHandlers = useDayViewHandlers({
    clearSelectedDate: () => setSelectedDate(null),
    clearSelectedEvent,
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
