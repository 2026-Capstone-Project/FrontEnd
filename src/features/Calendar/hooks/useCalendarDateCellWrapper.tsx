import { cloneElement, type MouseEvent, useCallback } from 'react'
import type { DateCellWrapperProps } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarDateCellWrapperArgs = {
  setDate: (date: Date) => void
  setSelectedEventId: (eventId: CalendarEvent['id'] | null) => void
  setSelectedEventKey: (eventKey: string | null) => void
}

export const useCalendarDateCellWrapper = ({
  setDate,
  setSelectedEventId,
  setSelectedEventKey,
}: UseCalendarDateCellWrapperArgs) =>
  useCallback(
    ({ value, children }: DateCellWrapperProps) =>
      cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          event.stopPropagation()
          setSelectedEventId(null)
          setSelectedEventKey(null)
          setDate(value)
          if (typeof children.props.onClick === 'function') {
            children.props.onClick(event)
          }
        },
      }),
    [setDate, setSelectedEventId, setSelectedEventKey],
  )
