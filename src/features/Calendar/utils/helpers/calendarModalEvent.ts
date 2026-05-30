import type { CalendarEvent } from '@/shared/types/calendar/types'

import { getEventOccurrenceKey } from './dayViewHelpers'

export const getCalendarModalEvent = ({
  events,
  modalEventId,
  selectedEventKey,
}: {
  events: CalendarEvent[]
  modalEventId: CalendarEvent['id'] | null
  selectedEventKey: string | null
}) => {
  if (modalEventId == null) return null

  const selectedOccurrenceEvent =
    selectedEventKey != null
      ? (events.find((item) => getEventOccurrenceKey(item) === selectedEventKey) ?? null)
      : null

  if (selectedOccurrenceEvent && selectedOccurrenceEvent.id === modalEventId) {
    return selectedOccurrenceEvent
  }

  return events.find((item) => item.id === modalEventId) ?? null
}
