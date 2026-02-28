import type { TodoFilter } from '@/shared/types/todo/types'

import * as S from './TodoSection.style'

const TODO_FILTER_OPTIONS: Array<{ value: TodoFilter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'TODAY', label: '오늘' },
  { value: 'PRIORITY', label: '중요도' },
  { value: 'COMPLETED', label: '완료' },
]

type TodoFilterTabsProps = {
  value: TodoFilter
  onChange: (value: TodoFilter) => void
}

const TodoFilterTabs = ({ value, onChange }: TodoFilterTabsProps) => {
  return (
    <S.StateButtonGroup>
      {TODO_FILTER_OPTIONS.map((option) => (
        <S.StateButton
          key={option.value}
          onClick={() => onChange(option.value)}
          $isActive={value === option.value}
        >
          {option.label}
        </S.StateButton>
      ))}
    </S.StateButtonGroup>
  )
}

export default TodoFilterTabs
