import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useThrottledValue } from '@/shared/hooks/common/useThrottledValue'
import { useEventTitleHistoryQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'

type AddScheduleTitleFieldProps = {
  portalTarget?: HTMLElement | null
  onTitleConfirm: (value: string) => void
}

const AddScheduleTitleField = ({ portalTarget, onTitleConfirm }: AddScheduleTitleFieldProps) => {
  const { control } = useFormContext<AddScheduleFormValues>()
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
      autoFocus
      suggestions={suggestions}
      onLiveChange={onTitleConfirm}
      onConfirm={onTitleConfirm}
    />
  )

  return portalTarget ? createPortal(titleField, portalTarget) : titleField
}

export default AddScheduleTitleField
