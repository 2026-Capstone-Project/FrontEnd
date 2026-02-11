import { useQueryClient } from '@tanstack/react-query'

import { deleteTodo, patchTodo, patchTodoComplete, postTodo } from '@/shared/api/todo/api'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { PatchTodoRequestDTO } from '@/shared/types/todo/types'

import { useCustomMutation } from '../common/customQuery'

export function useTodoMutations() {
  const queryClient = useQueryClient()
  const invalidateCalendarQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['todo', 'list'] })
    queryClient.invalidateQueries({ queryKey: ['todo', 'detail'] })
    queryClient.invalidateQueries({ queryKey: ['todo', 'progress'] })
    queryClient.invalidateQueries({ queryKey: ['calendar', 'todos'] })
  }
  function usePostTodo() {
    return useCustomMutation(postTodo, {
      onSuccess: invalidateCalendarQueries,
    })
  }
  function useDeleteTodo() {
    return useCustomMutation(
      ({
        todoId,
        occurrenceDate,
        scope,
      }: {
        todoId: number
        occurrenceDate?: string
        scope?: RecurrenceTodoScope
      }) => deleteTodo(todoId, occurrenceDate, scope),
      {
        onSuccess: invalidateCalendarQueries,
      },
    )
  }
  function usePatchTodo() {
    return useCustomMutation(
      ({
        todoId,
        requestBody,
        occurrenceDate,
        scope,
      }: {
        todoId: number
        requestBody: PatchTodoRequestDTO
        occurrenceDate?: string
        scope?: RecurrenceTodoScope
      }) => patchTodo(todoId, requestBody, occurrenceDate, scope),
      {
        onSuccess: invalidateCalendarQueries,
      },
    )
  }
  function usePatchCompleteTodo() {
    return useCustomMutation(
      ({
        todoId,
        occurrenceDate,
        isCompleted,
      }: {
        todoId: number
        occurrenceDate?: string
        isCompleted?: boolean
      }) => patchTodoComplete(todoId, occurrenceDate, isCompleted),
      {
        onSuccess: invalidateCalendarQueries,
      },
    )
  }
  return { usePostTodo, useDeleteTodo, usePatchTodo, usePatchCompleteTodo }
}
