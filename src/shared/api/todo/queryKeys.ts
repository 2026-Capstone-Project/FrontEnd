import { createQueryKeys } from '@lukemorales/query-key-factory'

import type { TodoFilter } from '@/shared/types/todo/types'

import { getDetailTodo, getTodoProgress, getTodos } from './api'

export const todoKeys = createQueryKeys('todo', {
  list: (filter: TodoFilter) => ({
    queryKey: [filter],
    queryFn: () => getTodos(filter),
  }),
  detail: (todoId: number, occurrenceDate: string) => ({
    queryKey: [{ todoId, occurrenceDate }],
    queryFn: () => getDetailTodo(todoId, occurrenceDate),
  }),
  progress: (date: string) => ({
    queryKey: [date],
    queryFn: () => getTodoProgress(date),
  }),
})
