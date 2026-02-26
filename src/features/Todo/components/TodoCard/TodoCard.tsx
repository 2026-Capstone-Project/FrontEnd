import { type MouseEventHandler, useCallback, useEffect, useState } from 'react'

import Repeat from '@/shared/assets/icons/rotate.svg?react'
import Trash from '@/shared/assets/icons/trash-2.svg?react'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import { theme } from '@/shared/styles/theme'
import { DeleteConfirmModal } from '@/shared/ui/modal'

import PriorityBadge from '../ImportantBadge/PriorityBadge'
import TodoCheckbox from '../TodoCheckbox/TodoCheckbox'
import * as S from './TodoCard.style'
const TodoCard = ({
  id,
  title,
  date,
  occurrenceDate,
  isHighlight,
  isOverdue,
  time,
  priority,
  isRecurring,
  repeatInfo,
  onDoubleClick,
  isEditing,
  isCompleted,
}: {
  id: number
  title: string
  date: string
  occurrenceDate: string
  time?: string
  isHighlight?: boolean
  isOverdue?: boolean
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  isRecurring?: boolean
  repeatInfo?: string
  onDoubleClick?: MouseEventHandler<HTMLDivElement>
  isEditing?: boolean
  isCompleted?: boolean
}) => {
  const [selected, setSelected] = useState(isCompleted ?? false)
  const [openModal, setOpenModal] = useState(false)
  const isRecurringTodo = Boolean(isRecurring)
  const { useDeleteTodo, usePatchCompleteTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const { mutate: patchCompleteTodoMutate } = usePatchCompleteTodo()
  useEffect(() => {
    setSelected(isCompleted ?? false)
  }, [isCompleted])
  const handleDelete = useCallback(() => {
    if (isRecurringTodo) {
      setOpenModal(true)
      return
    }
    deleteTodoMutate({
      todoId: id,
      occurrenceDate,
    })
  }, [deleteTodoMutate, id, isRecurringTodo, occurrenceDate])

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

  return (
    <S.Wrapper
      $isHighlight={isHighlight}
      $isOverdue={isOverdue}
      $isEditing={isEditing}
      onDoubleClick={onDoubleClick}
    >
      <S.TodoLeftWrapper>
        <TodoCheckbox checked={selected} onChange={handleToggleComplete} ariaLabel="할 일 완료" />
        <S.TodoInfoWrapper>
          <S.Title>{title}</S.Title>
          <S.Info $isHighlight={isHighlight}>
            {date} {time}{' '}
            {isRecurring && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: theme.colors.textColor3,
                }}
              >
                <Repeat width={20} height={20} /> <div className="repeat-info">{repeatInfo}</div>
              </div>
            )}
          </S.Info>
        </S.TodoInfoWrapper>
      </S.TodoLeftWrapper>
      <S.ButtonWrapper>
        <PriorityBadge priority={priority} />
        <Trash
          color="#c5c5c5"
          onClick={(event) => {
            event.stopPropagation()
            handleDelete()
          }}
        />
      </S.ButtonWrapper>
      {openModal && isRecurringTodo && (
        <DeleteConfirmModal
          onClose={() => setOpenModal(false)}
          title={title}
          target={{ type: 'todo', id, occurrenceDate }}
          mutate={deleteTodoMutate}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoCard
