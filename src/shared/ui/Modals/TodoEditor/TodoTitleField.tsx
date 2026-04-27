// 할 일 제목 입력과 제목 추천 조회를 담당하는 필드입니다.
import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useThrottledValue } from '@/shared/hooks/common/useThrottledValue'
import { useGetTodoTitleHistoryQuery } from '@/shared/hooks/query/useTodoQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { TodoEditorFormValues } from '@/shared/types/event/event'
import TitleSuggestionInput from '@/shared/ui/scheduleTodo/TitleSuggestionInput/TitleSuggestionInput'

type TodoTitleFieldProps = {
  eventId: CalendarEvent['id']
  portalTarget?: HTMLElement | null
  autoFocus?: boolean
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
}

const TodoTitleField = ({
  eventId,
  portalTarget,
  autoFocus = true,
  onEventTitleConfirm,
}: TodoTitleFieldProps) => {
  const { control } = useFormContext<TodoEditorFormValues>()
  const todoTitleKeyword = (useWatch({ control, name: 'todoTitle' }) ?? '').trim()
  const throttledTodoTitleKeyword = useThrottledValue(todoTitleKeyword, 150)
  const { data: todoTitleHistoryData } = useGetTodoTitleHistoryQuery(
    throttledTodoTitleKeyword,
    Boolean(throttledTodoTitleKeyword),
  )
  const suggestions = todoTitleHistoryData?.result.titleHistory ?? []

  const titleField = (
    <TitleSuggestionInput
      fieldName="todoTitle"
      placeholder="새로운 할 일"
      autoFocus={autoFocus}
      suggestions={suggestions}
      onLiveChange={(value) => {
        if (eventId != null && eventId !== 0) {
          onEventTitleConfirm?.(eventId, value)
        }
      }}
      onConfirm={(value) => onEventTitleConfirm?.(eventId, value)}
    />
  )

  return portalTarget ? createPortal(titleField, portalTarget) : titleField
}

export default TodoTitleField
