import { useCallback } from 'react'

import { useCalendarSelection } from '@/features/Calendar/hooks/useCalendarSelection'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarSelectionBridgeArgs = {
  isModalEditing: boolean
  isModalOpen: boolean
  modalEventId: CalendarEvent['id'] | null
  removeEvent: (eventId: CalendarEvent['id']) => void
  handleEventClick: (event: CalendarEvent) => void
}

export const useCalendarSelectionBridge = ({
  isModalEditing,
  isModalOpen,
  modalEventId,
  removeEvent,
  handleEventClick,
}: UseCalendarSelectionBridgeArgs) => {
  const handleOpenEventFromCalendar = useCallback(
    (event: CalendarEvent) => {
      if (!isModalEditing && isModalOpen && modalEventId != null) {
        removeEvent(modalEventId)
      }
      handleEventClick(event)
    },
    [handleEventClick, isModalEditing, isModalOpen, modalEventId, removeEvent],
  )

  return useCalendarSelection({
    onOpenEvent: handleOpenEventFromCalendar,
  })
}
