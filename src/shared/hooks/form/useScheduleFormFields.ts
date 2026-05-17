import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useMemo } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { useEditorFormLifecycle } from '@/shared/hooks/form/useEditorFormLifecycle'
import { addScheduleSchema } from '@/shared/schemas/schedule'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type ScheduleEditorFormValues,
} from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import {
  formatTimeFromDate,
  getDefaultEndDate,
  normalizeScheduleTimeRange,
  toDate,
} from '@/shared/utils/editorDateTime'
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
  const defaultStartTime = draftValues?.startTime ?? formatTimeFromDate(defaultStart)
  const defaultEndTime = draftValues?.endTime ?? formatTimeFromDate(defaultEnd)
  const { startTime, endTime } = normalizeScheduleTimeRange(defaultStartTime, defaultEndTime)
  const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(initialEvent?.recurrenceGroup)
  const initialFriendIds =
    initialEvent?.friendIds ??
    initialEvent?.eventParticipantInfo?.map((participant) => participant.eventParticipantId) ??
    []
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
    eventStartTime: startTime,
    eventEndTime: endTime,
    isAllday: draftValues?.isAllday ?? initialIsAllDay,
    eventColor: draftValues?.eventColor ?? initialColor,
    repeatConfig: draftValues?.repeatConfig ?? initialRepeatConfig,
    friendIds: initialFriendIds,
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
  const editingResetValues = useMemo(
    () =>
      isEditing && initialStart
        ? buildScheduleDefaultValues({ date, initialEvent, draftValues: null })
        : null,
    [date, initialEvent, initialStart, isEditing],
  )
  const resetKey = `${date}::${String(initialEvent?.id ?? 'new')}`
  const formMethods = useForm<ScheduleEditorFormValues>({
    resolver,
    defaultValues: initialValues,
  })
  const { control, setValue, handleSubmit } = formMethods

  const eventStartDate = useWatch({ control, name: 'eventStartDate' })
  const eventEndDate = useWatch({ control, name: 'eventEndDate' })
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? initialIsAllDay
  const repeatConfig = (useWatch({ control, name: 'repeatConfig' }) ??
    (defaultRepeatConfig as RepeatConfigSchema)) as RepeatConfigSchema
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'BLUE') as EventColorType
  const eventTitle = useWatch({ control, name: 'eventTitle' })

  const mapDraft = useCallback(
    (values: ScheduleEditorFormValues): ItemEditorDraft => ({
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
    }),
    [],
  )

  useEditorFormLifecycle({
    formMethods,
    registeredFields: [
      'eventStartDate',
      'eventEndDate',
      'eventStartTime',
      'eventEndTime',
      'location',
      'address',
      'isAllday',
      'repeatConfig',
      'eventColor',
      'friendIds',
    ],
    resetKey,
    isEditing,
    initialValues,
    editingResetValues,
    onDraftChange,
    mapDraft,
  })

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
