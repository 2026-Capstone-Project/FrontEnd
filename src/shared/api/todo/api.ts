import type { TCommonResponse, TitleHistoryResponseDTO } from '@/shared/types/common/common'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type {
  GetDetailTodoResponseDTO,
  GetTodoProgressResponseDTO,
  GetTodoResponseDTO,
  PatchTodoRequestDTO,
  PostTodoRequestDTO,
  PostTodoResponseDTO,
  TodoFilter,
} from '@/shared/types/todo/types'

import axiosInstance from '../axios'

export const getTodos = async (
  filter: TodoFilter,
): Promise<TCommonResponse<GetTodoResponseDTO>> => {
  const { data } = await axiosInstance.get('/todos', {
    params: { filter },
  })
  return data
}

export const postTodo = async (
  requestBody: PostTodoRequestDTO,
): Promise<TCommonResponse<PostTodoResponseDTO>> => {
  const { data } = await axiosInstance.post('/todos', requestBody)
  return data
}

export const getDetailTodo = async (
  todoId: number,
  occurrenceDate: string,
): Promise<TCommonResponse<GetDetailTodoResponseDTO>> => {
  const { data } = await axiosInstance.get(`/todos/${todoId}`, {
    params: { occurrenceDate },
  })
  return data
}

export const deleteTodo = async (
  todoId: number,
  occurrenceDate?: string,
  scope?: RecurrenceTodoScope,
) => {
  const { data } = await axiosInstance.delete(`/todos/${todoId}`, {
    params: { occurrenceDate, scope },
  })
  return data
}

export const patchTodo = async (
  todoId: number,
  requestBody: PatchTodoRequestDTO,
  occurrenceDate?: string,
  scope?: RecurrenceTodoScope,
) => {
  const { data } = await axiosInstance.patch(`/todos/${todoId}`, requestBody, {
    params: { occurrenceDate, scope },
  })
  return data
}

export const patchTodoComplete = async (
  todoId: number,
  occurrenceDate?: string,
  isCompleted?: boolean,
) => {
  const { data } = await axiosInstance.patch(`/todos/${todoId}/complete`, null, {
    params: { occurrenceDate, isCompleted },
  })
  return data
}

export const getTodoProgress = async (
  date: string,
): Promise<TCommonResponse<GetTodoProgressResponseDTO>> => {
  const { data } = await axiosInstance.get('/todos/progress', {
    params: { date },
  })
  return data
}

export const getTodoTitleHistory = async (
  keyword?: string,
): Promise<TCommonResponse<TitleHistoryResponseDTO>> => {
  const normalizedKeyword = keyword?.trim()
  const { data } = await axiosInstance.get('/todos/history/titles', {
    params: {
      keyword: normalizedKeyword || undefined,
    },
  })
  return data
}
