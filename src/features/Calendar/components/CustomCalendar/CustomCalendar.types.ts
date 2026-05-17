import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '@/shared/types/calendar/types'

export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

export type CalendarEventActions = {
  onEventColorChange: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
  onEventTitleConfirm: (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => void
  onEventSharedChange: (eventId: CalendarEvent['id'], isShared: boolean) => void
  onEventTypeChange: (eventId: CalendarEvent['id'], type: 'todo' | 'schedule') => void
  onEventTimingChange: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
    occurrenceDate?: CalendarEvent['occurrenceDate'],
  ) => void
}

export type DeleteConfirmState = {
  isOpen: boolean
  eventId: CalendarEvent['id'] | null
  title: string
  occurrenceDate: string
}

export type RecurringDropConfirmState = {
  isOpen: boolean
  target: 'event' | 'todo'
  args: EventInteractionArgs<CalendarEvent> | null
}
