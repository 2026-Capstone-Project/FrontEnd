import moment from 'moment'
import { useCallback, useMemo } from 'react'
import type { ViewStatic } from 'react-big-calendar'

import CustomDayView from '@/features/Calendar/components/CustomView/CustomDayView'
import type { CalendarEvent } from '@/features/Calendar/domain/types'

type UseDayViewHandlersArgs = {
  clearSelectedDate: () => void
  clearSelectedEvent?: () => void
  enqueueEvent: (date: Date, allDay: boolean) => CalendarEvent['id'] | null
  handleAddEvent: (referenceDate?: Date | string, eventId?: CalendarEvent['id'] | null) => void
  updateEventTime: (eventId: CalendarEvent['id'], start: Date, end: Date) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventId?: CalendarEvent['id'] | null
  onEventSelect?: (event: CalendarEvent) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventDoubleClick?: (event: CalendarEvent) => void
}

export const useDayViewHandlers = ({
  clearSelectedDate,
  clearSelectedEvent,
  enqueueEvent,
  handleAddEvent,
  updateEventTime,
  onToggleTodo,
  selectedEventId,
  onEventSelect,
  onEventClick,
  onEventDoubleClick,
}: UseDayViewHandlersArgs) => {
  const handleDayViewSlotDoubleClick = useCallback(
    (slotDate: Date) => {
      clearSelectedDate()
      clearSelectedEvent?.()
      const createdId = enqueueEvent(slotDate, false)
      handleAddEvent(slotDate, createdId)
    },
    [clearSelectedDate, clearSelectedEvent, enqueueEvent, handleAddEvent],
  )

  const formatLogDateTime = useCallback(
    (value: Date) => moment(value).format('YYYY-MM-DD HH:mm'),
    [],
  )

  const handleDayViewEventDrag = useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      console.log('[Calendar] event time changed', {
        id: event.id,
        title: event.title,
        start: formatLogDateTime(start),
        end: formatLogDateTime(end),
        allDay: event.allDay ?? false,
      })
      updateEventTime(event.id, start, end)
    },
    [formatLogDateTime, updateEventTime],
  )

  const dayViewWithHandlers = useMemo<
    React.FC<Parameters<typeof CustomDayView>[0]> & ViewStatic
  >(() => {
    const BaseDayView = Object.assign(
      (props: Parameters<typeof CustomDayView>[0]) => (
        <CustomDayView
          onSlotDoubleClick={handleDayViewSlotDoubleClick}
          onEventDrag={handleDayViewEventDrag}
          onToggleTodo={onToggleTodo}
          selectedEventId={selectedEventId}
          onEventSelect={onEventSelect}
          onEventClick={onEventClick}
          onEventDoubleClick={onEventDoubleClick}
          {...props}
        />
      ),
      {
        title: CustomDayView.title,
        navigate: CustomDayView.navigate,
      },
    ) as React.FC<Parameters<typeof CustomDayView>[0]> & ViewStatic
    return BaseDayView
  }, [
    handleDayViewSlotDoubleClick,
    handleDayViewEventDrag,
    onToggleTodo,
    selectedEventId,
    onEventSelect,
    onEventClick,
    onEventDoubleClick,
  ])

  return dayViewWithHandlers
}
