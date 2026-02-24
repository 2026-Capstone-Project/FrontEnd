import { useCallback, useState } from 'react'

import {
  useDeleteTodoMutation,
  usePatchCompleteTodoMutation,
} from '@/shared/hooks/query/useTodoMutations'

type UseTodoCardActionsArgs = {
  id: number
  occurrenceDate: string
  isCompleted?: boolean
  isRecurring?: boolean
}

export const useTodoCardActions = ({
  id,
  occurrenceDate,
  isCompleted,
  isRecurring,
}: UseTodoCardActionsArgs) => {
  const [optimisticSelected, setOptimisticSelected] = useState<boolean | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const isRecurringTodo = Boolean(isRecurring)
  const { mutate: deleteTodoMutate } = useDeleteTodoMutation()
  const { mutate: patchCompleteTodoMutate } = usePatchCompleteTodoMutation()
  const selected = optimisticSelected ?? isCompleted ?? false

  // 반복 할 일은 단순 삭제하지 않고 확인 모달을 먼저 노출합니다.
  const handleDelete = useCallback(() => {
    if (isRecurringTodo) {
      setOpenDeleteModal(true)
      return
    }
    deleteTodoMutate({
      todoId: id,
      occurrenceDate,
    })
  }, [deleteTodoMutate, id, isRecurringTodo, occurrenceDate])

  // 체크 토글은 즉시 UI 반영(낙관적 업데이트) 후 실패 시 이전 값으로 되돌립니다.
  const handleToggleComplete = () => {
    const nextSelected = !selected
    setOptimisticSelected(nextSelected)
    patchCompleteTodoMutate(
      {
        todoId: id,
        occurrenceDate,
        isCompleted: nextSelected,
      },
      {
        onSuccess: () => {
          // 성공 이후에는 서버 데이터(isCompleted)를 단일 진실 원천으로 사용합니다.
          setOptimisticSelected(null)
        },
        onError: () => {
          // 실패 시에는 서버 값(isCompleted)으로 다시 보여주기 위해 낙관 상태를 해제합니다.
          setOptimisticSelected(null)
        },
      },
    )
  }

  return {
    selected,
    openDeleteModal,
    isRecurringTodo,
    deleteTodoMutate,
    handleDelete,
    handleToggleComplete,
    closeDeleteModal: () => setOpenDeleteModal(false),
  }
}
