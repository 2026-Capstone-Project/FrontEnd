// 일정 제목 입력과 제목 추천 조회를 담당하는 필드입니다.
import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useThrottledValue } from '@/shared/hooks/common/useThrottledValue'
import { useEventTitleHistoryQuery } from '@/shared/hooks/query/useCalendarQueries'
import { theme } from '@/shared/styles/theme'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import TitleSuggestionInput from '@/shared/ui/scheduleTodo/TitleSuggestionInput/TitleSuggestionInput'

type ScheduleTitleFieldProps = {
  portalTarget?: HTMLElement | null
  autoFocus?: boolean
  isShared?: boolean
  onTitleConfirm: (value: string) => void
}

const ScheduleTitleField = ({
  portalTarget,
  autoFocus = true,
  isShared = false,
  onTitleConfirm,
}: ScheduleTitleFieldProps) => {
  const { control } = useFormContext<ScheduleEditorFormValues>()
  const eventTitleKeyword = (useWatch({ control, name: 'eventTitle' }) ?? '').trim()
  const throttledEventTitleKeyword = useThrottledValue(eventTitleKeyword, 150)
  const { data: eventTitleHistoryData } = useEventTitleHistoryQuery(
    throttledEventTitleKeyword,
    Boolean(throttledEventTitleKeyword),
  )
  const suggestions = eventTitleHistoryData?.result.titleHistory ?? []

  const titleField = (
    <TitleSuggestionInput
      fieldName="eventTitle"
      placeholder="새로운 일정"
      autoFocus={autoFocus}
      suggestions={suggestions}
      inputColor={isShared ? theme.colors.share.point : undefined}
      onLiveChange={onTitleConfirm}
      onConfirm={onTitleConfirm}
    />
  )

  return portalTarget ? createPortal(titleField, portalTarget) : titleField
}

export default ScheduleTitleField
