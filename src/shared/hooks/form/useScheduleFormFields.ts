import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addScheduleSchema } from '@/shared/schemas/schedule'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type ScheduleEditorFormValues,
} from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { mapRecurrenceGroupToRepeatConfig } from '@/shared/utils/recurrenceGroup'

type UseScheduleFormFieldsProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing: boolean
}

export type UseScheduleFormFieldsResult = {
  formMethods: UseFormReturn<ScheduleEditorFormValues>
  control: Control<ScheduleEditorFormValues>
  setValue: UseFormReturn<ScheduleEditorFormValues>['setValue']
  handleSubmit: UseFormReturn<ScheduleEditorFormValues>['handleSubmit']
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  isAllday: boolean
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  eventTitle: string | undefined
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

const toDate = (value: string | Date) => new Date(value)

const isSameDateTime = (left: string | Date, right: string | Date) =>
  toDate(left).getTime() === toDate(right).getTime()

const getDefaultEndDate = (
  defaultStart: Date,
  initialStart?: CalendarEvent['start'],
  initialEnd?: CalendarEvent['end'],
) => {
  if (initialEnd && initialStart && !isSameDateTime(initialEnd, initialStart)) {
    return toDate(initialEnd)
  }
  return new Date(defaultStart.getTime() + 60 * 60 * 1000)
}

export const useScheduleFormFields = ({
  date,
  initialEvent,
  isEditing,
}: UseScheduleFormFieldsProps): UseScheduleFormFieldsResult => {
  const resolver = yupResolver(addScheduleSchema) as Resolver<ScheduleEditorFormValues>
  const initialStart = initialEvent?.start
  const initialEnd = initialEvent?.end
  const initialRecurrenceGroup = initialEvent?.recurrenceGroup
  const defaultStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const defaultEnd = getDefaultEndDate(defaultStart, initialStart, initialEnd)
  const defaultStartTime = formatTimeFromDate(defaultStart)
  const defaultEndTime = formatTimeFromDate(defaultEnd)
  const initialTitle = initialEvent?.title === '새 일정' ? '' : (initialEvent?.title ?? '')
  const initialDescription = initialEvent?.content ?? ''
  const initialLocation = initialEvent?.location ?? ''
  const initialAddress = initialEvent?.address ?? null
  const initialColor = initialEvent?.color ?? 'BLUE'
  const initialIsAllDay = initialEvent?.isAllDay ?? false
  const formMethods = useForm<ScheduleEditorFormValues>({
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
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? initialIsAllDay
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
    if (!isEditing || !initialStart) return
    const start = initialStart ? toDate(initialStart) : new Date(date)
    const end = getDefaultEndDate(start, initialStart, initialEnd)
    setValue('eventStartDate', start)
    setValue('eventEndDate', end)
    setValue('eventStartTime', formatTimeFromDate(start))
    setValue('eventEndTime', formatTimeFromDate(end))
    const nextTitle = initialTitle
    setValue('eventTitle', nextTitle === '새 일정' ? '' : nextTitle)
    setValue('eventDescription', initialDescription)
    setValue('location', initialLocation)
    setValue('address', initialAddress)
    setValue('isAllday', initialIsAllDay)
    setValue('eventColor', initialColor)
    const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(initialRecurrenceGroup)
    const nextRepeatConfig: RepeatConfigSchema = {
      ...defaultRepeatConfig,
      ...mappedRepeatConfig,
      customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
    } as RepeatConfigSchema
    setValue('repeatConfig', nextRepeatConfig, { shouldValidate: true })
  }, [
    date,
    initialAddress,
    initialColor,
    initialDescription,
    initialEnd,
    initialIsAllDay,
    initialLocation,
    initialRecurrenceGroup,
    initialStart,
    initialTitle,
    isEditing,
    setValue,
  ])

  useEffect(() => {
    if (isEditing) return
    const start = initialStart ? toDate(initialStart) : new Date(date)
    const end = getDefaultEndDate(start, initialStart, initialEnd)
    const nextIsAllDay = initialIsAllDay
    setValue('eventStartDate', start)
    setValue('eventEndDate', end)
    setValue('isAllday', nextIsAllDay)
    if (nextIsAllDay) {
      setValue('eventStartTime', undefined)
      setValue('eventEndTime', undefined)
      return
    }
    setValue('eventStartTime', formatTimeFromDate(start))
    setValue('eventEndTime', formatTimeFromDate(end))
  }, [date, initialEnd, initialIsAllDay, initialStart, isEditing, setValue])

  return {
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
  }
}
