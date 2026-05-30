import moment from 'moment'
import { useCallback } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarTodoActionsArgs = {
  events: CalendarEvent[]
  toggleEventDone: (eventId: CalendarEvent['id'], type: 'todo') => void
  patchCompleteTodoMutate: (variables: {
    todoId: CalendarEvent['id']
    occurrenceDate: string
    isCompleted: boolean
  }) => void
}

export const useCalendarTodoActions = ({
  events,
  toggleEventDone,
  patchCompleteTodoMutate,
}: UseCalendarTodoActionsArgs) => {
  const handleToggleTodo = useCallback(
    (eventId: CalendarEvent['id']) => {
      const target = events.find(
        (eventItem) => eventItem.id === eventId && eventItem.type === 'todo',
      )
      if (!target || target.type !== 'todo') return

      const nextCompleted = !target.isDone
      toggleEventDone(eventId, 'todo')
      patchCompleteTodoMutate({
        todoId: eventId,
        occurrenceDate: moment(target.start).format('YYYY-MM-DD'),
        isCompleted: nextCompleted,
      })
    },
    [events, patchCompleteTodoMutate, toggleEventDone],
  )

  return { handleToggleTodo }
}
