import { todoKeys } from '@/shared/api/todo/queryKeys'
import type { TodoFilter } from '@/shared/types/todo/types'

import { useCustomQuery } from '../common/customQuery'

export function useGetTodoQuery(filter: TodoFilter) {
  const query = todoKeys.list(filter)
  return useCustomQuery(query.queryKey, query.queryFn)
}

export function useGetDetailTodoQuery(todoId: number, occurrenceDate: string) {
  const query = todoKeys.detail(todoId, occurrenceDate)
  return useCustomQuery(query.queryKey, query.queryFn)
}

export function useGetTodoProgressQuery(date: string) {
  const query = todoKeys.progress(date)
  return useCustomQuery(query.queryKey, query.queryFn)
}
