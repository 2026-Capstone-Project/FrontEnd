import type { stringOrDate } from 'react-big-calendar'

import type { EventColorType } from '@/shared/types/color'

export interface CalendarEvent {
  id: string
  title: string
  start: stringOrDate
  end: stringOrDate
  allDay?: boolean
  color: EventColorType
  location?: string
  memo?: string
}
