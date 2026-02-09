import type { stringOrDate } from 'react-big-calendar'

import type { EventColorType } from '@/shared/types/event/event'
import type { recurrenceGroup } from '@/shared/types/event/recurrence/recurrence'

export interface CalendarEvent {
  id: number
  title: string
  start: stringOrDate
  end: stringOrDate
  allDay?: boolean
  type: 'todo' | 'schedule'
  isDone?: boolean
  color: EventColorType
  location?: string
  memo?: string
  recurrenceGroup?: recurrenceGroup | null
}

export type Event = {
  id: number
  calculated: boolean
  title: string
  content: string | null
  start: string
  end: string
  location: string | null
  isAllday: boolean
  color: EventColorType
  recurrenceGroup: recurrenceGroup | null
}

export type GetEventsResponseDTO = {
  details: Array<Event>
}

export type GetEventDetailResponseDTO = Event
