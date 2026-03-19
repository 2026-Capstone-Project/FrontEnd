import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addScheduleSchema } from '@/shared/schemas/schedule'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type AddScheduleFormValues,
  type EventColorType,
  type RepeatConfigSchema,
} from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { mapRecurrenceGroupToRepeatConfig } from '@/shared/utils/recurrenceGroup'

type UseScheduleFormFieldsProps = {
  date: string
  isAllday: boolean
  initialEvent?: CalendarEvent | null
  isEditing: boolean
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
  isEditing,
}: UseScheduleFormFieldsProps): UseScheduleFormFieldsResult => {
  const resolver = yupResolver(addScheduleSchema) as Resolver<AddScheduleFormValues>
  const defaultStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const defaultEnd =
    initialEvent?.end && initialEvent.end !== initialEvent?.start
      ? new Date(initialEvent.end)
      : new Date(defaultStart)
  const defaultStartTime = formatTimeFromDate(defaultStart)
  const defaultEndTime = formatTimeFromDate(defaultEnd)
  const initialTitle = initialEvent?.title === '새 일정' ? '' : (initialEvent?.title ?? '')
  const initialDescription = initialEvent?.content ?? ''
  const initialLocation = initialEvent?.location ?? ''
  const initialAddress = initialEvent?.address ?? null
  const initialColor = initialEvent?.color ?? 'BLUE'
  const initialIsAllDay = initialEvent?.isAllDay ?? isAllday
  const formMethods = useForm<AddScheduleFormValues>({
    resolver,
    defaultValues: {
      eventTitle: initialTitle,
      eventDescription: initialDescription,
      location: initialLocation,
      address: initialAddress,
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
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'BLUE') as EventColorType
  const eventTitle = useWatch({ control, name: 'eventTitle' })

  useEffect(() => {
    register('eventStartDate')
    register('eventEndDate')
    register('eventStartTime')
    register('eventEndTime')
    register('location')
    register('address')
    register('isAllday')
    register('repeatConfig')
    register('eventColor')
  }, [register])

  useEffect(() => {
    setValue('isAllday', isAllday)
  }, [isAllday, setValue])

  useEffect(() => {
    if (!isEditing || !initialEvent) return
    const start = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
    const end =
      initialEvent?.end && initialEvent.end !== initialEvent?.start
        ? new Date(initialEvent.end)
        : new Date(start)
    setValue('eventStartDate', start)
    setValue('eventEndDate', end)
    setValue('eventStartTime', formatTimeFromDate(start))
    setValue('eventEndTime', formatTimeFromDate(end))
    const nextTitle = initialEvent?.title ?? ''
    setValue('eventTitle', nextTitle === '새 일정' ? '' : nextTitle)
    setValue('eventDescription', initialEvent?.content ?? '')
    setValue('location', initialEvent?.location ?? '')
    setValue('address', initialEvent?.address ?? null)
    setValue('eventColor', initialEvent?.color ?? 'BLUE')
    const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(initialEvent?.recurrenceGroup)
    const nextRepeatConfig: RepeatConfigSchema = {
      ...defaultRepeatConfig,
      ...mappedRepeatConfig,
      customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
    } as RepeatConfigSchema
    setValue('repeatConfig', nextRepeatConfig, { shouldValidate: true })
  }, [date, initialEvent, isEditing, setValue])

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
