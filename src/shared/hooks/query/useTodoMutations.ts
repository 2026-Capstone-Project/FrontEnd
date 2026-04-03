import { useQueryClient } from '@tanstack/react-query'

import { deleteTodo, patchTodo, patchTodoComplete, postTodo } from '@/shared/api/todo/api'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { PatchTodoRequestDTO } from '@/shared/types/todo/types'
import { getErrorMessage, markErrorToastHandled } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

import { useCustomMutation } from '../common/customQuery'

type DeleteTodoVariables = {
  todoId: number
  occurrenceDate?: string
  scope?: RecurrenceTodoScope
}

type PatchTodoVariables = {
  todoId: number
  requestBody: PatchTodoRequestDTO
  occurrenceDate?: string
  scope?: RecurrenceTodoScope
}

type PatchCompleteTodoVariables = {
  todoId: number
  occurrenceDate: string
  isCompleted: boolean
}

const useInvalidateTodoQueries = () => {
  const queryClient = useQueryClient()

  // Todo 수정/삭제/완료 토글 이후에는 목록/상세/진행률/캘린더 조회를 함께 무효화합니다.
  return () => {
    queryClient.invalidateQueries({ queryKey: ['todo', 'list'] })
    queryClient.invalidateQueries({ queryKey: ['todo', 'detail'] })
    queryClient.invalidateQueries({ queryKey: ['todo', 'progress'] })
    queryClient.invalidateQueries({ queryKey: ['calendar', 'todos'] })
  }
}

export function usePostTodoMutation() {
  const invalidateTodoQueries = useInvalidateTodoQueries()
  return useCustomMutation(postTodo, {
    onSuccess: () => {
      invalidateTodoQueries()
      useToastStore.getState().showToast({
        title: '할 일이 저장되었습니다',
        message: '새 할 일이 정상적으로 등록되었어요.',
        toastType: 'success',
      })
    },
    onError: (error: unknown) => {
      useToastStore.getState().showToast({
        title: '할 일 저장에 실패했습니다',
        message: getErrorMessage(error),
        toastType: 'error',
      })
      markErrorToastHandled(error)
    },
  })
}

export function useDeleteTodoMutation() {
  const invalidateTodoQueries = useInvalidateTodoQueries()
  return useCustomMutation(
    ({ todoId, occurrenceDate, scope }: DeleteTodoVariables) =>
      deleteTodo(todoId, occurrenceDate, scope),
    {
      onSuccess: () => {
        invalidateTodoQueries()
        useToastStore.getState().showToast({
          title: '할 일이 삭제되었습니다',
          message: '선택한 할 일이 정상적으로 삭제되었어요.',
          toastType: 'success',
        })
      },
      onError: (error: unknown) => {
        useToastStore.getState().showToast({
          title: '할 일 삭제에 실패했습니다',
          message: getErrorMessage(error),
          toastType: 'error',
        })
        markErrorToastHandled(error)
      },
    },
  )
}

export function usePatchTodoMutation() {
  const invalidateTodoQueries = useInvalidateTodoQueries()
  return useCustomMutation(
    ({ todoId, requestBody, occurrenceDate, scope }: PatchTodoVariables) =>
      patchTodo(todoId, requestBody, occurrenceDate, scope),
    {
      onSuccess: () => {
        invalidateTodoQueries()
        useToastStore.getState().showToast({
          title: '할 일이 수정되었습니다',
          message: '변경 사항이 정상적으로 반영되었어요.',
          toastType: 'success',
        })
      },
      onError: (error: unknown) => {
        useToastStore.getState().showToast({
          title: '할 일 수정에 실패했습니다',
          message: getErrorMessage(error),
          toastType: 'error',
        })
        markErrorToastHandled(error)
      },
    },
  )
}

export function usePatchCompleteTodoMutation() {
  const invalidateTodoQueries = useInvalidateTodoQueries()
  return useCustomMutation(
    ({ todoId, occurrenceDate, isCompleted }: PatchCompleteTodoVariables) =>
      patchTodoComplete(todoId, occurrenceDate, isCompleted),
    {
      onSuccess: (_data, variables) => {
        invalidateTodoQueries()
        useToastStore.getState().showToast(
          variables.isCompleted
            ? {
                title: '할 일이 완료되었습니다',
                message: '변경 사항이 정상적으로 반영되었어요.',
                toastType: 'success',
              }
            : {
                title: '할 일 완료가 해제되었습니다',
                message: '변경 사항이 정상적으로 반영되었어요.',
                toastType: 'info',
              },
        )
      },
      onError: (error: unknown) => {
        useToastStore.getState().showToast({
          title: '완료 상태 변경에 실패했습니다',
          message: getErrorMessage(error),
          toastType: 'error',
        })
        markErrorToastHandled(error)
      },
    },
  )
}

// 기존 호출부(useTodoMutations().usePatchTodo())와의 호환을 위해 래퍼 형태를 유지합니다.
export function useTodoMutations() {
  function usePostTodo() {
    return usePostTodoMutation()
  }
  function useDeleteTodo() {
    return useDeleteTodoMutation()
  }
  function usePatchTodo() {
    return usePatchTodoMutation()
  }
  function usePatchCompleteTodo() {
    return usePatchCompleteTodoMutation()
  }
  return { usePostTodo, useDeleteTodo, usePatchTodo, usePatchCompleteTodo }
}
