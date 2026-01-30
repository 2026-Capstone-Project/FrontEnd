import moment from 'moment'
import { useCallback, useMemo } from 'react'
import type { ViewStatic } from 'react-big-calendar'

import CustomDayView from '@/features/Calendar/components/CustomView/CustomDayView'
import type { CalendarEvent } from '@/features/Calendar/domain/types'

type UseDayViewHandlersArgs = {
  clearSelectedDate: () => void
  enqueueEvent: (date: Date, allDay: boolean) => void
  handleAddEvent: (referenceDate?: Date | string) => void
  updateEventTime: (eventId: CalendarEvent['id'], start: Date, end: Date) => void
}

export const useDayViewHandlers = ({
  clearSelectedDate,
  enqueueEvent,
  handleAddEvent,
  updateEventTime,
}: UseDayViewHandlersArgs) => {
  const handleDayViewSlotDoubleClick = useCallback(
    (slotDate: Date) => {
      clearSelectedDate()
      handleAddEvent(slotDate)
      enqueueEvent(slotDate, false)
    },
    [clearSelectedDate, enqueueEvent, handleAddEvent],
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
          {...props}
        />
      ),
      {
        title: CustomDayView.title,
        navigate: CustomDayView.navigate,
      },
    ) as React.FC<Parameters<typeof CustomDayView>[0]> & ViewStatic
    return BaseDayView
  }, [handleDayViewSlotDoubleClick, handleDayViewEventDrag])

  return dayViewWithHandlers
}
