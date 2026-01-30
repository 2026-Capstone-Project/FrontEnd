import type { stringOrDate } from 'react-big-calendar'

import type { EventColorType } from '@/shared/types/event'

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
}
