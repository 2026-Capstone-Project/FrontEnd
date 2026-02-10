import type { EventColorType } from '@/shared/types/event/event'
import type { recurrenceGroup } from '@/shared/types/event/recurrence/recurrence'

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
  recurrenceGroup: recurrenceGroup | null
}

// 서버 스펙(Event)과 동일한 타입을 캘린더에서도 사용합니다.
// UI에서 필요한 경우에만 사용하는 확장 필드(type/isDone)를 옵션으로 둡니다.
export type CalendarEvent = Event & {
  type?: 'todo' | 'schedule'
  isDone?: boolean
}

export type GetEventsResponseDTO = {
  details: Array<Event>
}

export type GetEventDetailResponseDTO = Event
