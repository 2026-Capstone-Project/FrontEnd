import { useCallback } from 'react'
import { type Control, type UseFormReturn } from 'react-hook-form'

import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type {
  AddTodoFormValues,
  EventColorType,
  RepeatConfigSchema,
} from '@/shared/types/event/event'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { CustomRepeatBasis, RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import { formatIsoDate } from '@/shared/utils/date'
import { mapRepeatConfigToRecurrenceGroup } from '@/shared/utils/recurrenceGroup'
import { isSameYmd, toWeekday, toWeekOfMonth } from '@/shared/utils/recurrencePattern'

import { useTodoFormFields } from './useTodoFormFields'

type UseAddTodoProps = {
  date: string
  id: CalendarEvent['id']
  isEditing?: boolean
}

export type UseAddTodoFormResult = {
  control: Control<AddTodoFormValues>
  formMethods: UseFormReturn<AddTodoFormValues>
  isAllday: boolean
  todoDate: Date | null
  todoEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<AddTodoFormValues>['handleSubmit']
  onSubmit: (
    values: AddTodoFormValues,
    options?: { occurrenceDate?: string; scope?: RecurrenceTodoScope },
  ) => Promise<unknown>
  setEventColor: (value: EventColorType) => void
  todoTitle: string | undefined
}

const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
  value !== 'none' && value !== 'custom'

const parseYmd = (value?: string) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map((item) => Number.parseInt(item, 10))
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export const useAddTodoForm = ({
  date,
  id,
  isEditing = false,
}: UseAddTodoProps): UseAddTodoFormResult => {
  const { usePostTodo, usePatchTodo } = useTodoMutations()
  const { mutateAsync: postTodoMutate } = usePostTodo()
  const { mutateAsync: patchTodoMutate } = usePatchTodo()

  const {
    formMethods,
    control,
    handleSubmit,
    setValue,
    todoDate,
    todoEndTime,
    isAllday,
    repeatConfig,
    todoTitle,
    eventColor,
  } = useTodoFormFields({ date })

  const handleRepeatType = useCallback(
    (value: RepeatType) => {
      if (value === 'custom') {
        if (repeatConfig.repeatType === 'custom') {
          setValue(
            'repeatConfig',
            { ...repeatConfig, repeatType: 'none', customBasis: null },
            { shouldValidate: true },
          )
          return
        }
        setValue(
          'repeatConfig',
          {
            ...repeatConfig,
            repeatType: 'custom',
            customBasis: repeatConfig.customBasis ?? 'daily',
          },
          { shouldValidate: true },
        )
        return
      }

      if (repeatConfig.repeatType === 'custom' && isCustomBasis(value)) {
        setValue('repeatConfig', { ...repeatConfig, customBasis: value }, { shouldValidate: true })
        return
      }

      const nextType = repeatConfig.repeatType === value ? 'none' : value
      setValue(
        'repeatConfig',
        { ...repeatConfig, repeatType: nextType, customBasis: null },
        { shouldValidate: true },
      )
    },
    [repeatConfig, setValue],
  )

  const updateConfig = useCallback(
    (changes: Partial<RepeatConfig>) => {
      setValue('repeatConfig', { ...repeatConfig, ...changes }, { shouldValidate: true })
    },
    [repeatConfig, setValue],
  )

  const setEventColor = useCallback(
    (value: EventColorType) => {
      setValue('eventColor', value, { shouldValidate: true })
    },
    [setValue],
  )

  const onSubmit = (
    values: AddTodoFormValues,
    options?: { occurrenceDate?: string; scope?: RecurrenceTodoScope },
  ) => {
    const mappedRecurrenceGroup =
      values.repeatConfig.repeatType === 'none'
        ? undefined
        : (mapRepeatConfigToRecurrenceGroup(values.repeatConfig) ?? undefined)
    const currentDate = values.todoDate ? new Date(values.todoDate) : null
    const targetOccurrenceDate = parseYmd(options?.occurrenceDate)
    const shouldAdjustFutureMonthlyPattern =
      options?.scope === 'THIS_AND_FOLLOWING' &&
      mappedRecurrenceGroup?.frequency === 'MONTHLY' &&
      mappedRecurrenceGroup?.monthlyType === 'DAY_OF_WEEK' &&
      mappedRecurrenceGroup?.weekdayRule != null &&
      mappedRecurrenceGroup.weekdayRule !== 'SINGLE' &&
      currentDate != null &&
      targetOccurrenceDate != null &&
      !isSameYmd(currentDate, targetOccurrenceDate)
    const recurrenceGroup = shouldAdjustFutureMonthlyPattern
      ? {
          ...mappedRecurrenceGroup,
          weekOfMonth: toWeekOfMonth(currentDate),
          weekdayRule: 'SINGLE' as const,
          dayOfWeekInMonth: toWeekday(currentDate),
          daysOfMonth: undefined,
        }
      : mappedRecurrenceGroup
    const payload = {
      title: values.todoTitle?.trim() || '새로운 할 일',
      startDate: formatIsoDate(values.todoDate),
      dueTime: values.isAllday ? undefined : values.todoEndTime,
      isAllDay: values.isAllday ? true : false,
      color: values.eventColor,
      priority: values.todoPriority,
      memo: values.todoDescription ?? '',
      recurrenceGroup,
    }

    const isPersistedTodoId = typeof id === 'number' && id > 0
    if (isEditing && isPersistedTodoId) {
      const occurrenceDate = options?.occurrenceDate ?? formatIsoDate(date)
      return patchTodoMutate({
        todoId: id,
        occurrenceDate,
        ...(options?.scope ? { scope: options.scope } : {}),
        requestBody: payload,
      })
    }

    return postTodoMutate(payload)
  }

  return {
    formMethods,
    control,
    updateConfig,
    handleRepeatType,
    isAllday,
    todoDate,
    todoEndTime,
    repeatConfig,
    eventColor,
    handleSubmit,
    onSubmit,
    setEventColor,
    todoTitle,
  }
}
