import type { EventColorType } from '@/shared/types/event/event'
import type { RecurrenceGroup } from '@/shared/types/recurrence/recurrence'

import type { TodoType } from '../todo/types'

export type Event = {
  id: number
  calculated: boolean
  title: string
  content: string | null
  start: string
  end: string
  location: string | null
  isAllDay: boolean
  color: EventColorType
  recurrenceGroup: RecurrenceGroup | null
}

export type CalendarEvent = Omit<Event, 'start' | 'end'> & {
  start: string | Date
  end: string | Date
  type?: 'todo' | 'schedule'
  isDone?: boolean
}

export type GetEventsResponseDTO = {
  details: Array<Event>
}

export type GetEventDetailResponseDTO = Event

export type GetTodoForCalendarResponseDTO = {
  todos: Array<TodoType>
}
