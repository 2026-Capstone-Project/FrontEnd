import { todoKeys } from '@/shared/api/todo/queryKeys'
import type { TodoFilter } from '@/shared/types/todo/types'

import { useCustomQuery } from '../common/customQuery'

export function useGetTodoQuery(filter: TodoFilter) {
  const query = todoKeys.list(filter)
  return useCustomQuery(query.queryKey, query.queryFn)
}

export function useGetDetailTodoQuery(todoId: number, occurrenceDate: string, enabled = true) {
  const query = todoKeys.detail(todoId, occurrenceDate)
  return useCustomQuery(query.queryKey, query.queryFn, { enabled })
}

export function useGetTodoProgressQuery(date: string) {
  const query = todoKeys.progress(date)
  return useCustomQuery(query.queryKey, query.queryFn)
}

export function useGetTodoTitleHistoryQuery(keyword: string, enabled = true) {
  const query = todoKeys.titleHistory(keyword)
  return useCustomQuery(query.queryKey, query.queryFn, { enabled })
}
