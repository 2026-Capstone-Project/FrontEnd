// 일간 뷰 전용 핸들러를 구성하는 훅
import { useCallback, useMemo } from 'react'
import type { ViewStatic } from 'react-big-calendar'

import CustomDayView from '@/features/Calendar/components/CustomView/CustomDayView'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseDayViewHandlersArgs = {
  clearSelectedDate: () => void
  clearSelectedEvent?: () => void
  enqueueEvent: (date: Date, allDay: boolean) => CalendarEvent['id'] | null
  handleAddEvent: (referenceDate?: Date | string, eventId?: CalendarEvent['id'] | null) => void
  updateEventTime: (eventId: CalendarEvent['id'], start: Date, end: Date) => void
  updateEventTimePreview?: (eventId: CalendarEvent['id'], start: Date, end: Date) => void
  onCreateEvent?: (slotDate: Date) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventKey?: string | null
  onEventSelect?: (event: CalendarEvent, clickedDate?: Date) => void
  onEventClick?: (event: CalendarEvent, clickedDate?: Date) => void
  onEventDoubleClick?: (event: CalendarEvent, clickedDate?: Date) => void
}

export const useDayViewHandlers = ({
  clearSelectedDate,
  clearSelectedEvent,
  enqueueEvent,
  handleAddEvent,
  updateEventTime,
  updateEventTimePreview,
  onCreateEvent,
  onToggleTodo,
  selectedEventKey,
  onEventSelect,
  onEventClick,
  onEventDoubleClick,
}: UseDayViewHandlersArgs) => {
  const handleDayViewSlotDoubleClick = useCallback(
    (slotDate: Date) => {
      clearSelectedDate()
      clearSelectedEvent?.()
      if (onCreateEvent) {
        onCreateEvent(slotDate)
        return
      }
      const createdId = enqueueEvent(slotDate, false)
      handleAddEvent(slotDate, createdId)
    },
    [clearSelectedDate, clearSelectedEvent, enqueueEvent, handleAddEvent, onCreateEvent],
  )

  const handleDayViewEventDrag = useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      updateEventTime(event.id, start, end)
    },
    [updateEventTime],
  )

  const handleDayViewEventDragPreview = useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      updateEventTimePreview?.(event.id, start, end)
    },
    [updateEventTimePreview],
  )

  const dayViewWithHandlers = useMemo<
    React.FC<Parameters<typeof CustomDayView>[0]> & ViewStatic
  >(() => {
    const BaseDayView = Object.assign(
      (props: Parameters<typeof CustomDayView>[0]) => (
        <CustomDayView
          onSlotDoubleClick={handleDayViewSlotDoubleClick}
          onEventDrag={handleDayViewEventDrag}
          onEventDragPreview={handleDayViewEventDragPreview}
          onToggleTodo={onToggleTodo}
          selectedEventKey={selectedEventKey}
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
    handleDayViewEventDragPreview,
    onToggleTodo,
    selectedEventKey,
    onEventSelect,
    onEventClick,
    onEventDoubleClick,
  ])

  return dayViewWithHandlers
}
