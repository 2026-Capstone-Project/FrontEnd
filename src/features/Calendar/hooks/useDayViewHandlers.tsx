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
  updateEventTime: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    type?: CalendarEvent['type'],
  ) => void
  updateEventTimePreview?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    type?: CalendarEvent['type'],
  ) => void
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
  // 일간 뷰의 시간 슬롯을 더블 클릭했을 때 새 일정을 생성하는 핸들러
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

  // 일간 뷰에서 일정을 드래그하여 시간 변경 시 호출되는 핸들러
  const handleDayViewEventDrag = useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      updateEventTime(event.id, start, end, event.type)
    },
    [updateEventTime],
  )

  // 일간 뷰에서 일정을 드래그하는 동안 미리보기 업데이트를 위한 핸들러
  const handleDayViewEventDragPreview = useCallback(
    (event: CalendarEvent, start: Date, end: Date) => {
      updateEventTimePreview?.(event.id, start, end, event.type)
    },
    [updateEventTimePreview],
  )

  // 일간 뷰 컴포넌트에 핸들러를 주입한 새로운 컴포넌트를 메모이제이션
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
