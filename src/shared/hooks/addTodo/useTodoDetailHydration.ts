import moment from 'moment'
import { useEffect, useRef } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { useGetDetailTodoQuery } from '@/shared/hooks/query/useTodoQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { type AddTodoFormValues, type RepeatConfigSchema } from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { mapRecurrenceGroupToRepeatConfig } from '@/shared/utils/index'

type UseTodoDetailHydrationProps = {
  date: string
  eventId: CalendarEvent['id']
  isEditing: boolean
  todoDate: Date | null
  setValue: UseFormSetValue<AddTodoFormValues>
}

export const useTodoDetailHydration = ({
  date,
  eventId,
  isEditing,
  todoDate,
  setValue,
}: UseTodoDetailHydrationProps) => {
  const hydratedDetailKeyRef = useRef<string | null>(null)
  const isPersistedTodo = isEditing && eventId != null && eventId !== 0
  const shouldFetchDetail = isPersistedTodo
  const detailOccurrenceDate = moment(date).format('YYYY-MM-DD')
  const { data: detailData } = useGetDetailTodoQuery(
    Number(eventId),
    detailOccurrenceDate,
    shouldFetchDetail,
  )

  useEffect(() => {
    hydratedDetailKeyRef.current = null
  }, [detailOccurrenceDate, eventId, isPersistedTodo])

  useEffect(() => {
    const detail = detailData?.result
    if (!isEditing || !detail) return
    const detailKey = `${detail.todoId}-${detail.occurrenceDate ?? ''}`
    if (hydratedDetailKeyRef.current === detailKey) return
    hydratedDetailKeyRef.current = detailKey

    const baseDate = detail.occurrenceDate ? new Date(detail.occurrenceDate) : new Date()
    const dueTime = detail.dueTime
    const parsedTime =
      typeof dueTime === 'string'
        ? dueTime.slice(0, 5)
        : `${String(dueTime?.hour ?? 0).padStart(2, '0')}:${String(dueTime?.minute ?? 0).padStart(
            2,
            '0',
          )}`

    setValue('todoTitle', detail.title ?? '', { shouldValidate: true })
    setValue('todoDescription', detail.memo ?? '', { shouldValidate: true })
    setValue('todoDate', baseDate, { shouldValidate: true })
    setValue('todoEndTime', parsedTime, { shouldValidate: true })
    setValue('isAllday', detail.isAllDay, { shouldValidate: true })
    setValue('eventColor', detail.color ?? 'GRAY', { shouldValidate: true })
    setValue('todoPriority', detail.priority ?? 'MEDIUM', { shouldValidate: true })

    const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(detail.recurrenceGroup)
    const nextRepeatConfig: RepeatConfigSchema = {
      ...defaultRepeatConfig,
      ...mappedRepeatConfig,
      customMonthlyMode: mappedRepeatConfig.customMonthlyMode ?? 'dates',
      customMonthlyPatternWeek: mappedRepeatConfig.customMonthlyPatternWeek ?? '1',
      customMonthlyPatternDay: mappedRepeatConfig.customMonthlyPatternDay ?? 'mon',
      customYearlyConditionEnabled: mappedRepeatConfig.customYearlyConditionEnabled ?? false,
      customYearlyConditionWeek: mappedRepeatConfig.customYearlyConditionWeek ?? '1',
      customYearlyConditionDay: mappedRepeatConfig.customYearlyConditionDay ?? 'mon',
      customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
    }
    setValue('repeatConfig', nextRepeatConfig, { shouldValidate: true })
  }, [detailData, isEditing, setValue])

  const occurrenceDate = detailData?.result?.occurrenceDate
    ? moment(detailData.result.occurrenceDate).format('YYYY-MM-DD')
    : moment(todoDate ?? date).format('YYYY-MM-DD')

  return {
    detailData,
    hasExistingRecurrence: Boolean(detailData?.result?.recurrenceGroup),
    isDetailReady: !isPersistedTodo || !shouldFetchDetail || Boolean(detailData?.result),
    isPersistedTodo,
    occurrenceDate,
  }
}
