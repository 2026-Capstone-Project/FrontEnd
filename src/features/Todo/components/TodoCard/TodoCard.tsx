import type { MouseEventHandler } from 'react'

import Repeat from '@/shared/assets/icons/rotate.svg?react'
import Trash from '@/shared/assets/icons/trash-2.svg?react'
import { theme } from '@/shared/styles/theme'
import { DeleteConfirmModal } from '@/shared/ui/modal'

import { useTodoCardActions } from '../../hooks/useTodoCardActions'
import PriorityBadge from '../ImportantBadge/PriorityBadge'
import TodoCheckbox from '../TodoCheckbox/TodoCheckbox'
import * as S from './TodoCard.style'

type TodoCardProps = {
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
}

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
}: TodoCardProps) => {
  const {
    selected,
    openDeleteModal,
    isRecurringTodo,
    deleteTodoMutate,
    handleDelete,
    handleToggleComplete,
    closeDeleteModal,
  } = useTodoCardActions({
    id,
    occurrenceDate,
    isCompleted,
    isRecurring,
  })

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
      {openDeleteModal && isRecurringTodo && (
        <DeleteConfirmModal
          onClose={closeDeleteModal}
          title={title}
          target={{ type: 'todo', id, occurrenceDate }}
          mutate={deleteTodoMutate}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoCard
