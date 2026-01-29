import { type MouseEventHandler, useState } from 'react'

import Repeat from '@/shared/assets/icons/rotate.svg?react'
import Trash from '@/shared/assets/icons/trash-2.svg?react'
import { theme } from '@/shared/styles/theme'

import PriorityBadge from '../ImportantBadge/PriorityBadge'
import TodoCheckbox from '../TodoCheckbox/TodoCheckbox'
import * as S from './TodoCard.style'
const TodoCard = ({
  id,
  title,
  date,
  isHighlight,
  time,
  priority,
  repeat,
  repeatInfo,
  onDoubleClick,
  isEditing,
}: {
  id: number
  title: string
  date: string
  time?: string
  isHighlight?: boolean
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  repeat?: boolean
  repeatInfo?: string
  onDoubleClick?: MouseEventHandler<HTMLDivElement>
  isEditing?: boolean
}) => {
  const [selected, setSelected] = useState(false)

  return (
    <S.Wrapper
      key={id}
      $isHighlight={isHighlight}
      $isEditing={isEditing}
      onDoubleClick={onDoubleClick}
    >
      <S.TodoLeftWrapper>
        <TodoCheckbox checked={selected} onChange={() => setSelected(!selected)} />
        <S.TodoInfoWrapper>
          <S.Title>{title}</S.Title>
          <S.Info $isHighlight={isHighlight}>
            {date} {time}{' '}
            {repeat && (
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
        <Trash color="#c5c5c5" />
      </S.ButtonWrapper>
    </S.Wrapper>
  )
}

export default TodoCard
