import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo, useRef } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addScheduleSchema } from '@/shared/schemas/schedule'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type ScheduleEditorFormValues,
} from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { mapRecurrenceGroupToRepeatConfig } from '@/shared/utils/recurrenceGroup'

type UseScheduleFormFieldsProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing: boolean
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft) => void
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

const buildScheduleDefaultValues = ({
  date,
  initialEvent,
  draftValues,
}: {
  date: string
  initialEvent?: CalendarEvent | null
  draftValues?: ItemEditorDraft | null
}): ScheduleEditorFormValues => {
  const initialStart = initialEvent?.start
  const initialEnd = initialEvent?.end
  const defaultStart = initialStart ? toDate(initialStart) : new Date(date)
  const defaultEnd = getDefaultEndDate(defaultStart, initialStart, initialEnd)
  const initialTitle = initialEvent?.title === '새 일정' ? '' : (initialEvent?.title ?? '')
  const initialDescription = initialEvent?.content ?? ''
  const initialLocation = initialEvent?.location ?? ''
  const initialAddress = initialEvent?.address ?? null
  const initialColor = initialEvent?.color ?? 'BLUE'
  const initialIsAllDay = initialEvent?.isAllDay ?? false
  const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(initialEvent?.recurrenceGroup)
  const initialRepeatConfig: RepeatConfigSchema = {
    ...defaultRepeatConfig,
    ...mappedRepeatConfig,
    customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
    customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
    customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
  } as RepeatConfigSchema

  return {
    eventTitle: draftValues?.title ?? initialTitle,
    eventDescription: draftValues?.description ?? initialDescription,
    location: draftValues?.location ?? initialLocation,
    address: draftValues?.address ?? initialAddress,
    eventStartDate: draftValues?.startDate ?? defaultStart,
    eventEndDate: draftValues?.endDate ?? defaultEnd,
    eventStartTime: draftValues?.startTime ?? formatTimeFromDate(defaultStart),
    eventEndTime: draftValues?.endTime ?? formatTimeFromDate(defaultEnd),
    isAllday: draftValues?.isAllday ?? initialIsAllDay,
    eventColor: draftValues?.eventColor ?? initialColor,
    repeatConfig: draftValues?.repeatConfig ?? initialRepeatConfig,
  }
}

export const useScheduleFormFields = ({
  date,
  initialEvent,
  isEditing,
  draftValues,
  onDraftChange,
}: UseScheduleFormFieldsProps): UseScheduleFormFieldsResult => {
  const resolver = yupResolver(addScheduleSchema) as Resolver<ScheduleEditorFormValues>
  const initialStart = initialEvent?.start
  const initialIsAllDay = initialEvent?.isAllDay ?? false
  const initialValues = useMemo(
    () => buildScheduleDefaultValues({ date, initialEvent, draftValues }),
    [date, draftValues, initialEvent],
  )
  const previousResetKeyRef = useRef(`${date}::${String(initialEvent?.id ?? 'new')}`)
  const formMethods = useForm<ScheduleEditorFormValues>({
    resolver,
    defaultValues: initialValues,
  })
  const { control, register, reset, setValue, handleSubmit } = formMethods

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
    reset(buildScheduleDefaultValues({ date, initialEvent, draftValues: null }))
  }, [date, initialEvent, initialStart, isEditing, reset])

  useEffect(() => {
    if (isEditing) return
    const nextResetKey = `${date}::${String(initialEvent?.id ?? 'new')}`
    if (previousResetKeyRef.current === nextResetKey) return
    previousResetKeyRef.current = nextResetKey
    reset(initialValues)
  }, [date, initialEvent?.id, initialValues, isEditing, reset])

  useEffect(() => {
    if (isEditing || !onDraftChange) return
    const subscription = formMethods.watch((values) => {
      onDraftChange({
        title: values.eventTitle ?? '',
        description: values.eventDescription ?? '',
        startDate: values.eventStartDate ?? null,
        endDate: values.eventEndDate ?? values.eventStartDate ?? null,
        startTime: values.eventStartTime,
        endTime: values.eventEndTime,
        isAllday: values.isAllday ?? false,
        eventColor: (values.eventColor ?? 'BLUE') as EventColorType,
        repeatConfig:
          (values.repeatConfig as RepeatConfigSchema | undefined) ??
          (defaultRepeatConfig as RepeatConfigSchema),
        location: values.location ?? '',
        address: values.address ?? null,
      })
    })

    return () => subscription.unsubscribe()
  }, [formMethods, isEditing, onDraftChange])

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
