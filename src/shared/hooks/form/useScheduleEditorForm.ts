import { type Control, type UseFormReturn } from 'react-hook-form'

import { useScheduleFormFields } from '@/shared/hooks/form/useScheduleFormFields'
import { useRepeatConfigController } from '@/shared/hooks/repeat/useRepeatConfigController'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type ScheduleEditorFormValues,
} from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { type RepeatConfig, type RepeatType } from '@/shared/types/recurrence/repeat'

type UseScheduleEditorFormProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing?: boolean
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft) => void
}

export type UseScheduleEditorFormResult = {
  control: Control<ScheduleEditorFormValues>
  formMethods: UseFormReturn<ScheduleEditorFormValues>
  isAllday: boolean
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<ScheduleEditorFormValues>['handleSubmit']
  setEventColor: (value: EventColorType) => void
  eventTitle: string | undefined
}

export const useScheduleEditorForm = ({
  date,
  initialEvent,
  isEditing = false,
  draftValues,
  onDraftChange,
}: UseScheduleEditorFormProps): UseScheduleEditorFormResult => {
  const {
    formMethods,
    control,
    handleSubmit,
    setValue,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    isAllday,
    repeatConfig,
    eventColor,
    eventTitle,
  } = useScheduleFormFields({ date, initialEvent, isEditing, draftValues, onDraftChange })

  const { handleRepeatType, updateConfig, setEventColor } = useRepeatConfigController({
    repeatConfig,
    onRepeatConfigChange: (value) => {
      setValue('repeatConfig', value, { shouldValidate: true })
    },
    onEventColorChange: (value) => {
      setValue('eventColor', value, { shouldValidate: true })
    },
  })

  return {
    formMethods,
    control,
    updateConfig,
    handleRepeatType,
    isAllday,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    repeatConfig,
    eventColor,
    handleSubmit,
    setEventColor,
    eventTitle,
  }
}
