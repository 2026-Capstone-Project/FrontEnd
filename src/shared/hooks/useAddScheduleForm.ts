import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import {
  type Control,
  type Resolver,
  useForm,
  type UseFormRegister,
  useWatch,
} from 'react-hook-form'

import { useCalendarFieldPicker } from '@/shared/hooks/useCalendarFieldPicker'
import { useSearchPlaceToggle } from '@/shared/hooks/useSearchPlaceToggle'
import { addScheduleSchema } from '@/shared/schemas/schedule'
import {
  type AddScheduleFormValues,
  type DatePickerField,
  type EventColorType,
  type RepeatConfigSchema,
  type TimePickerField,
} from '@/shared/types/event'
import {
  type CustomRepeatBasis,
  defaultRepeatConfig,
  type RepeatConfig,
  type RepeatType,
} from '@/shared/types/repeat'
import { formatIsoDate } from '@/shared/utils/date'

type UseAddScheduleFormProps = {
  date: string
}

export type UseAddScheduleFormResult = {
  control: Control<AddScheduleFormValues>
  register: UseFormRegister<AddScheduleFormValues>
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
  handleRepeatConfigChange: (value: RepeatConfigSchema) => void
  handleSubmit: ReturnType<typeof useForm<AddScheduleFormValues>>['handleSubmit']
  onSubmit: (values: AddScheduleFormValues) => void
  setIsAllday: React.Dispatch<React.SetStateAction<boolean>>
  setEventColor: (value: EventColorType) => void
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  mapRef: React.RefObject<HTMLDivElement | null>
  isSearchPlaceOpen: boolean
  openSearchPlace: () => void
  closeSearchPlace: () => void
  eventTitle: string | undefined
  setEventTitle: (value: string) => void
}

export const useAddScheduleForm = ({ date }: UseAddScheduleFormProps): UseAddScheduleFormResult => {
  const [isAllday, setIsAllday] = useState(false)

  const resolver = yupResolver(addScheduleSchema) as Resolver<AddScheduleFormValues>
  const { control, register, setValue, handleSubmit } = useForm<AddScheduleFormValues>({
    resolver,
    defaultValues: {
      eventTitle: '새로운 일정',
      eventDescription: '',
      eventStartDate: new Date(date),
      eventEndDate: new Date(date),
      eventStartTime: '09:00',
      eventEndTime: '10:00',
      isAllday,
      rotate: null,
      eventColor: 'sky',
      repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    },
  })

  const eventStartDate = useWatch({ control, name: 'eventStartDate' })
  const eventEndDate = useWatch({ control, name: 'eventEndDate' })
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })
  const repeatConfig = (useWatch({ control, name: 'repeatConfig' }) ??
    (defaultRepeatConfig as RepeatConfigSchema)) as RepeatConfigSchema
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'sky') as EventColorType
  const eventTitle = useWatch({ control, name: 'eventTitle' })

  useEffect(() => {
    register('eventStartDate')
    register('eventEndDate')
    register('eventStartTime')
    register('eventEndTime')
    register('isAllday')
    register('repeatConfig')
    register('eventColor')
  }, [register])

  useEffect(() => {
    setValue('isAllday', isAllday)
  }, [isAllday, setValue])

  useEffect(() => {
    const baseDate = new Date(date)
    setValue('eventStartDate', baseDate)
    setValue('eventEndDate', baseDate)
  }, [date, setValue])

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

  const handleRepeatConfigChange = (value: RepeatConfigSchema) => {
    setValue('repeatConfig', value, { shouldValidate: true })
  }
  const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
    value !== 'none' && value !== 'custom'
  const setEventColor = (value: EventColorType) => {
    setValue('eventColor', value, { shouldValidate: true })
  }

  const setEventTitle = (value: string) => {
    setValue('eventTitle', value, { shouldValidate: true })
  }
  const onSubmit = (values: AddScheduleFormValues) => {
    const payload = {
      ...values,
      eventStartDate: formatIsoDate(values.eventStartDate),
      eventEndDate: formatIsoDate(values.eventEndDate),
    }
    console.log('일정 저장', payload)
  }
  const handleRepeatType = (value: RepeatType) => {
    if (value === 'custom') {
      if (repeatConfig.repeatType === 'custom') {
        handleRepeatConfigChange({ ...repeatConfig, repeatType: 'none', customBasis: null })
        return
      }
      handleRepeatConfigChange({
        ...repeatConfig,
        repeatType: 'custom',
        customBasis: repeatConfig.customBasis ?? 'daily',
      })
      return
    }

    if (repeatConfig.repeatType === 'custom' && isCustomBasis(value)) {
      handleRepeatConfigChange({ ...repeatConfig, customBasis: value })
      return
    }

    const nextType = repeatConfig.repeatType === value ? 'none' : value
    handleRepeatConfigChange({
      ...repeatConfig,
      repeatType: nextType,
      customBasis: null,
    })
  }
  const updateConfig = (changes: Partial<RepeatConfig>) =>
    handleRepeatConfigChange({ ...repeatConfig, ...changes })

  return {
    control,
    register,
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
    handleRepeatConfigChange,
    handleSubmit,
    onSubmit,
    setIsAllday,
    setEventColor,
    mapRef,
    isSearchPlaceOpen,
    openSearchPlace,
    closeSearchPlace,
    eventTitle,
    setEventTitle,
  }
}
