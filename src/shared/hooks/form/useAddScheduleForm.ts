import { type Control, type UseFormReturn } from 'react-hook-form'

import { useScheduleFormFields } from '@/shared/hooks/form/useScheduleFormFields'
import { useRepeatConfigController } from '@/shared/hooks/repeat/useRepeatConfigController'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type AddScheduleFormValues,
  type EventColorType,
  type RepeatConfigSchema,
} from '@/shared/types/event/event'
import { type RepeatConfig, type RepeatType } from '@/shared/types/recurrence/repeat'

type UseAddScheduleFormProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing?: boolean
}

export type UseAddScheduleFormResult = {
  control: Control<AddScheduleFormValues>
  formMethods: UseFormReturn<AddScheduleFormValues>
  isAllday: boolean
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<AddScheduleFormValues>['handleSubmit']
  setEventColor: (value: EventColorType) => void
  eventTitle: string | undefined
}

export const useAddScheduleForm = ({
  date,
  initialEvent,
  isEditing = false,
}: UseAddScheduleFormProps): UseAddScheduleFormResult => {
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
  } = useScheduleFormFields({ date, initialEvent, isEditing })

  const { handleRepeatType, updateConfig, setEventColor } = useRepeatConfigController({
    repeatConfig,
    setValue,
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
