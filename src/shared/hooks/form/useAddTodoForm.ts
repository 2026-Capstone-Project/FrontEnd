import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type Control, type UseFormReturn } from 'react-hook-form'

import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type {
  AddTodoFormValues,
  DatePickerField,
  EventColorType,
  RepeatConfigSchema,
  TimePickerField,
} from '@/shared/types/event/event'
import type { CustomRepeatBasis, RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import { formatIsoDate } from '@/shared/utils/date'
import { mapRepeatConfigToRecurrenceGroup } from '@/shared/utils/recurrenceGroup'

import { useTodoFormFields } from './useTodoFormFields'

type UseAddTodoProps = {
  date: string
  id: CalendarEvent['id']
}

export type UseAddTodoFormResult = {
  control: Control<AddTodoFormValues>
  formMethods: UseFormReturn<AddTodoFormValues>
  activeCalendarField: DatePickerField | null
  isAllday: boolean
  calendarRef: React.RefObject<HTMLDivElement | null>
  todoDate: Date | null
  todoEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  handleCalendarOpen: (field: DatePickerField) => void
  handleDateSelect: (selectedDate: Date) => void
  handleTimeChange: (field: TimePickerField, value: string) => void
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<AddTodoFormValues>['handleSubmit']
  onSubmit: (values: AddTodoFormValues) => Promise<unknown>
  setIsAllday: React.Dispatch<React.SetStateAction<boolean>>
  setEventColor: (value: EventColorType) => void
  todoTitle: string | undefined
  repeatEndDate: Date | null
}

const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
  value !== 'none' && value !== 'custom'

export const useAddTodoForm = ({ date, id }: UseAddTodoProps): UseAddTodoFormResult => {
  const [isAllday, setIsAllday] = useState(false)
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
    repeatConfig,
    todoTitle,
    eventColor,
  } = useTodoFormFields({ date, isAllday })

  const calendarRef = useRef<HTMLDivElement | null>(null)
  const [activeCalendarField, setActiveCalendarField] = useState<DatePickerField | null>(null)

  const handleCalendarOpen = useCallback((field: DatePickerField) => {
    setActiveCalendarField(field)
  }, [])

  const handleCalendarClose = useCallback(() => {
    setActiveCalendarField(null)
  }, [])

  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (!activeCalendarField) return
      setValue('todoDate', selectedDate, { shouldValidate: true })
      handleCalendarClose()
    },
    [activeCalendarField, handleCalendarClose, setValue],
  )

  const handleTimeChange = useCallback(
    (_field: TimePickerField, value: string) => {
      setValue('todoEndTime', value, { shouldValidate: true })
    },
    [setValue],
  )

  useEffect(() => {
    if (!activeCalendarField) return undefined
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (calendarRef.current?.contains(target)) return
      handleCalendarClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeCalendarField, handleCalendarClose])

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

  const repeatEndDate = useMemo(() => {
    if (!todoDate) return null
    const clone = new Date(todoDate)
    clone.setHours(0, 0, 0, 0)
    return clone
  }, [todoDate])

  const setEventColor = useCallback(
    (value: EventColorType) => {
      setValue('eventColor', value, { shouldValidate: true })
    },
    [setValue],
  )

  const onSubmit = (values: AddTodoFormValues) => {
    const recurrenceGroup =
      values.repeatConfig.repeatType === 'none'
        ? undefined
        : (mapRepeatConfigToRecurrenceGroup(values.repeatConfig) ?? undefined)
    const payload = {
      title: values.todoTitle?.trim() || '새로운 할 일',
      startDate: formatIsoDate(values.todoDate),
      dueTime: values.isAllday ? undefined : values.todoEndTime,
      isAllDay: values.isAllday ? true : false,
      color: values.eventColor,
      priority: 'MEDIUM' as const,
      memo: values.todoDescription ?? '',
      recurrenceGroup,
    }

    if (id && id !== 0) {
      return patchTodoMutate({
        todoId: id,
        occurrenceDate: formatIsoDate(date),
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
    activeCalendarField,
    isAllday,
    calendarRef,
    todoDate,
    todoEndTime,
    repeatConfig,
    eventColor,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
    handleSubmit,
    onSubmit,
    setIsAllday,
    setEventColor,
    todoTitle,
    repeatEndDate,
  }
}
