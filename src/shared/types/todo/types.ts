import type { PriorityType } from '../event/priority'
import type { RecurrenceGroup } from '../recurrence/recurrence'

export type TodoFilter = 'ALL' | 'TODAY' | 'PRIORITY' | 'COMPLETED'

export type TodoType = {
  todoId: number
  occurrenceDate: string
  title: string
  dueTime: {
    hour: number
    minute: number
    second: number
    nano: number
  }
  isAllDay: boolean
  priority: PriorityType
  memo: string
  isCompleted: boolean
  isRecurring: boolean
}

export type GetTodoResponseDTO = {
  todos: Array<TodoType>
}

export type PostTodoRequestDTO = {
  title: string
  startDate: string
  dueTime?: string
  isAllDay: boolean
  priority: PriorityType
  memo?: string
  recurrenceGroup?: RecurrenceGroup
}

export type PostTodoResponseDTO = TodoType & {
  recurrenceGroupId: number | null
}

export type TodoDetailType = TodoType & {
  recurrenceGroup: RecurrenceGroup | null
}

export type GetDetailTodoResponseDTO = TodoDetailType

export type PatchTodoRequestDTO = {
  title?: string
  startDate?: string
  dueTime?: string
  isAllDay?: boolean
  priority?: PriorityType
  memo?: string
  recurrenceGroup?: RecurrenceGroup | null
}

export type PatchTodoResponseDTO = TodoType & {
  recurrenceGroupId: number | null
}

export type GetTodoProgressResponseDTO = {
  date: string
  totalCount: number
  completedCount: number
  progressRate: number
}

export type GetTodoForCalendarResponseDTO = {
  todos: Array<TodoType>
}
