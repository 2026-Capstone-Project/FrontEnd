import { useCallback, useEffect, useState } from 'react'

import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'

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
  const [selected, setSelected] = useState(isCompleted ?? false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const isRecurringTodo = Boolean(isRecurring)
  const { useDeleteTodo, usePatchCompleteTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const { mutate: patchCompleteTodoMutate } = usePatchCompleteTodo()

  useEffect(() => {
    setSelected(isCompleted ?? false)
  }, [isCompleted])

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
    const previousSelected = selected
    const nextSelected = !selected
    setSelected(nextSelected)
    patchCompleteTodoMutate(
      {
        todoId: id,
        occurrenceDate,
        isCompleted: nextSelected,
      },
      {
        onError: () => {
          setSelected(previousSelected)
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
