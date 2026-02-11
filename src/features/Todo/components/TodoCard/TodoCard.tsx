import { useQueryClient } from '@tanstack/react-query'
import { type MouseEventHandler, useState } from 'react'

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
  const queryClient = useQueryClient()
  const { useDeleteTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const handleDelete = () => {
    if (isRecurring) {
      setOpenModal(true)
      return
    }
    deleteTodoMutate(
      { todoId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['todo', 'list'] })
        },
      },
    )
  }
  return (
    <S.Wrapper
      key={id}
      $isHighlight={isHighlight}
      $isOverdue={isOverdue}
      $isEditing={isEditing}
      onDoubleClick={onDoubleClick}
    >
      <S.TodoLeftWrapper>
        <TodoCheckbox checked={selected} onChange={() => setSelected(!selected)} />
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
        <Trash color="#c5c5c5" onClick={handleDelete} />
      </S.ButtonWrapper>
      {openModal && (
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
