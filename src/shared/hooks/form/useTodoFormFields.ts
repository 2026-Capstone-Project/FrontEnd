import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addTodoSchema } from '@/shared/schemas/todo'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type TodoEditorFormValues,
} from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'

type UseTodoFormFieldsProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing?: boolean
}

export type UseTodoFormFieldsResult = {
  formMethods: UseFormReturn<TodoEditorFormValues>
  control: Control<TodoEditorFormValues>
  setValue: UseFormReturn<TodoEditorFormValues>['setValue']
  handleSubmit: UseFormReturn<TodoEditorFormValues>['handleSubmit']
  todoDate: Date | null
  todoEndTime: string | undefined
  isAllday: boolean
  repeatConfig: RepeatConfigSchema
  todoTitle: string | undefined
  eventColor: EventColorType
}

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

export const useTodoFormFields = ({
  date,
  initialEvent,
  isEditing = false,
}: UseTodoFormFieldsProps): UseTodoFormFieldsResult => {
  const resolver = yupResolver(addTodoSchema) as Resolver<TodoEditorFormValues>
  const defaultTodoDate = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const defaultTodoTime = initialEvent?.start ? formatTimeFromDate(defaultTodoDate) : '10:00'
  const formMethods = useForm<TodoEditorFormValues>({
    resolver,
    defaultValues: {
      todoTitle: '',
      todoDescription: '',
      todoDate: defaultTodoDate,
      todoEndTime: defaultTodoTime,
      isAllday: initialEvent?.isAllDay ?? false,
      eventColor: initialEvent?.color ?? 'GRAY',
      todoPriority: 'MEDIUM',
      repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    },
  })
  const { control, register, setValue, handleSubmit } = formMethods

  const todoDate = useWatch({ control, name: 'todoDate' })
  const todoEndTime = useWatch({ control, name: 'todoEndTime' })
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? false
  const repeatConfig = (useWatch({ control, name: 'repeatConfig' }) ??
    (defaultRepeatConfig as RepeatConfigSchema)) as RepeatConfigSchema
  const todoTitle = useWatch({ control, name: 'todoTitle' })
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'GRAY') as EventColorType

  useEffect(() => {
    register('todoDate')
    register('todoEndTime')
    register('isAllday')
    register('eventColor')
    register('todoPriority')
    register('repeatConfig')
  }, [register])

  useEffect(() => {
    if (isEditing) return
    const nextDate = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
    setValue('todoDate', nextDate)
    setValue('isAllday', initialEvent?.isAllDay ?? false)
    if (!(initialEvent?.isAllDay ?? false)) {
      setValue('todoEndTime', formatTimeFromDate(nextDate))
    }
  }, [date, initialEvent?.isAllDay, initialEvent?.start, isEditing, setValue])

  return {
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
  }
}
