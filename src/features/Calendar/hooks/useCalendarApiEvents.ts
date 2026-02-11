// 캘린더 API 응답을 화면용 이벤트로 변환하는 훅
import moment from 'moment'
import { useMemo } from 'react'

import { useEventQuery, useTodoForCalendarQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { TodoType } from '@/shared/types/todo/types'

const parseDueTime = (value: TodoType['dueTime']) => {
  if (!value) {
    return { hour: 0, minute: 0 }
  }
  if (typeof value === 'string') {
    const [hour, minute] = value.split(':').map((item: string) => Number.parseInt(item, 10))
    return {
      hour: Number.isNaN(hour) ? 0 : hour,
      minute: Number.isNaN(minute) ? 0 : minute,
    }
  }
  return {
    hour: value.hour ?? 0,
    minute: value.minute ?? 0,
  }
}

const toTodoEvent = (todo: TodoType): CalendarEvent => {
  const baseDate = moment(todo.occurrenceDate, 'YYYY-MM-DD').toDate()
  const { hour, minute } = parseDueTime(todo.dueTime)
  const startBase = new Date(baseDate)
  const start = todo.isAllDay ? startBase : new Date(startBase.setHours(hour, minute, 0, 0))
  const endBase = new Date(baseDate)
  const end = todo.isAllDay
    ? new Date(endBase.setHours(23, 59, 0, 0))
    : new Date(start.getTime() + 30 * 60 * 1000)
  return {
    id: todo.todoId,
    calculated: false,
    title: todo.title ?? '',
    content: todo.memo ?? null,
    start,
    end,
    location: null,
    isAllDay: todo.isAllDay,
    color: 'GRAY',
    recurrenceGroup: null,
    type: 'todo',
    isDone: todo.isCompleted,
  }
}

export const useCalendarApiEvents = (startDate: string, endDate: string) => {
  const { data, refetch, isFetching } = useEventQuery(startDate, endDate)
  const { data: todoData } = useTodoForCalendarQuery(startDate, endDate)
  const events = useMemo<CalendarEvent[]>(
    () => [...(data?.result?.details ?? []), ...(todoData?.result?.todos ?? []).map(toTodoEvent)],
    [data, todoData],
  )

  return { events, refetch, isFetching }
}
