import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'

import { useCalendarTodoTimingPatch } from './useCalendarTodoTimingPatch'

export const useCustomCalendarMutations = () => {
  const { usePatchEvent, useDeleteEvent } = useCalendarMutation()
  const { mutate: patchEventMutate } = usePatchEvent()
  const { mutate: deleteEventMutate } = useDeleteEvent()

  const { usePatchCompleteTodo, usePatchTodo, useDeleteTodo } = useTodoMutations()
  const { mutate: patchCompleteTodoMutate } = usePatchCompleteTodo()
  const { mutate: patchTodoMutate } = usePatchTodo()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const { patchTodoTiming } = useCalendarTodoTimingPatch({ patchTodoMutate })

  return {
    patchEventMutate,
    deleteEventMutate,
    patchCompleteTodoMutate,
    patchTodoTiming,
    deleteTodoMutate,
  }
}
