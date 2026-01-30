import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import type { CalendarEvent } from '@/features/Calendar/domain/types'
import { addScheduleSchema } from '@/shared/schemas/schedule'
import {
  type AddScheduleFormValues,
  type EventColorType,
  type RepeatConfigSchema,
} from '@/shared/types/event'
import { defaultRepeatConfig } from '@/shared/types/repeat'

type UseScheduleFormFieldsProps = {
  date: string
  isAllday: boolean
  initialEvent?: CalendarEvent | null
}

export type UseScheduleFormFieldsResult = {
  formMethods: UseFormReturn<AddScheduleFormValues>
  control: Control<AddScheduleFormValues>
  setValue: UseFormReturn<AddScheduleFormValues>['setValue']
  handleSubmit: UseFormReturn<AddScheduleFormValues>['handleSubmit']
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  eventTitle: string | undefined
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

export const useScheduleFormFields = ({
  date,
  isAllday,
  initialEvent,
}: UseScheduleFormFieldsProps): UseScheduleFormFieldsResult => {
  const resolver = yupResolver(addScheduleSchema) as Resolver<AddScheduleFormValues>
  const defaultStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const defaultEnd =
    initialEvent?.end && initialEvent.end !== initialEvent?.start
      ? new Date(initialEvent.end)
      : new Date(defaultStart)
  const defaultStartTime = formatTimeFromDate(defaultStart)
  const defaultEndTime = formatTimeFromDate(defaultEnd)
  const initialTitle = initialEvent?.title ?? '새로운 일정'
  const initialDescription = initialEvent?.memo ?? ''
  const initialColor = initialEvent?.color ?? 'sky'
  const initialIsAllDay = initialEvent?.allDay ?? isAllday
  const formMethods = useForm<AddScheduleFormValues>({
    resolver,
    defaultValues: {
      eventTitle: initialTitle,
      eventDescription: initialDescription,
      eventStartDate: defaultStart,
      eventEndDate: defaultEnd,
      eventStartTime: defaultStartTime,
      eventEndTime: defaultEndTime,
      isAllday: initialIsAllDay,
      eventColor: initialColor,
      repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    },
  })
  const { control, register, setValue, handleSubmit } = formMethods

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
    const start = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
    const end =
      initialEvent?.end && initialEvent.end !== initialEvent?.start
        ? new Date(initialEvent.end)
        : new Date(start)
    setValue('eventStartDate', start)
    setValue('eventEndDate', end)
    setValue('eventStartTime', formatTimeFromDate(start))
    setValue('eventEndTime', formatTimeFromDate(end))
    setValue('eventTitle', initialEvent?.title ?? '새로운 일정')
    setValue('eventDescription', initialEvent?.memo ?? '')
    setValue('eventColor', initialEvent?.color ?? 'sky')
  }, [date, initialEvent, setValue])

  return {
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
  }
}
