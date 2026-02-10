import { useEffect, useState } from 'react'
import { type Control, type UseFormReturn } from 'react-hook-form'

import { useScheduleFormFields } from '@/shared/hooks/form/useScheduleFormFields'
import { useRepeatConfigController } from '@/shared/hooks/repeat/useRepeatConfigController'
import { useCalendarFieldPicker } from '@/shared/hooks/useCalendarFieldPicker'
import { useSearchPlaceToggle } from '@/shared/hooks/useSearchPlaceToggle'
import type { Event } from '@/shared/types/calendar/types'
import {
  type AddScheduleFormValues,
  type DatePickerField,
  type EventColorType,
  type RepeatConfigSchema,
  type TimePickerField,
} from '@/shared/types/event/event'
import { type RepeatConfig, type RepeatType } from '@/shared/types/event/recurrence/repeat'
import { formatIsoDate } from '@/shared/utils/date'

type UseAddScheduleFormProps = {
  date: string
  initialEvent?: Event | null
}

export type UseAddScheduleFormResult = {
  control: Control<AddScheduleFormValues>
  formMethods: UseFormReturn<AddScheduleFormValues>
  activeCalendarField: DatePickerField | null
  isAllday: boolean
  calendarRef: React.RefObject<HTMLDivElement | null>
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  handleCalendarOpen: (field: DatePickerField) => void
  handleDateSelect: (selectedDate: Date) => void
  handleTimeChange: (field: TimePickerField, value: string) => void
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<AddScheduleFormValues>['handleSubmit']
  onSubmit: (values: AddScheduleFormValues) => void
  setIsAllday: React.Dispatch<React.SetStateAction<boolean>>
  setEventColor: (value: EventColorType) => void
  mapRef: React.RefObject<HTMLDivElement | null>
  isSearchPlaceOpen: boolean
  openSearchPlace: () => void
  closeSearchPlace: () => void
  eventTitle: string | undefined
}

export const useAddScheduleForm = ({
  date,
  initialEvent,
}: UseAddScheduleFormProps): UseAddScheduleFormResult => {
  const [isAllday, setIsAllday] = useState(initialEvent?.isAllDay ?? false)

  const {
    formMethods,
    control,
    handleSubmit,
    setValue,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    repeatConfig,
    eventColor,
    eventTitle,
  } = useScheduleFormFields({ date, isAllday, initialEvent })

  const { handleRepeatType, updateConfig, setEventColor } = useRepeatConfigController({
    repeatConfig,
    setValue,
  })

  const {
    activeCalendarField,
    calendarRef,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
  } = useCalendarFieldPicker({
    setValue,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
  })

  const { mapRef, isSearchPlaceOpen, closeSearchPlace, openSearchPlace } = useSearchPlaceToggle()

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setIsAllday(initialEvent?.isAllDay ?? false)
  }, [initialEvent])
  /* eslint-enable react-hooks/set-state-in-effect */

  const onSubmit = (values: AddScheduleFormValues) => {
    const payload = {
      ...values,
      eventStartDate: formatIsoDate(values.eventStartDate),
      eventEndDate: formatIsoDate(values.eventEndDate),
    }
    console.log('일정 저장', payload)
  }

  return {
    formMethods,
    control,
    updateConfig,
    handleRepeatType,
    activeCalendarField,
    isAllday,
    calendarRef,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    repeatConfig,
    eventColor,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
    handleSubmit,
    onSubmit,
    setIsAllday,
    setEventColor,
    mapRef,
    isSearchPlaceOpen,
    openSearchPlace,
    closeSearchPlace,
    eventTitle,
  }
}
