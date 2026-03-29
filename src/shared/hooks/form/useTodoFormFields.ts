import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addTodoSchema } from '@/shared/schemas/todo'
import {
  type AddTodoFormValues,
  type EventColorType,
  type RepeatConfigSchema,
} from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'

type UseTodoFormFieldsProps = {
  date: string
}

export type UseTodoFormFieldsResult = {
  formMethods: UseFormReturn<AddTodoFormValues>
  control: Control<AddTodoFormValues>
  setValue: UseFormReturn<AddTodoFormValues>['setValue']
  handleSubmit: UseFormReturn<AddTodoFormValues>['handleSubmit']
  todoDate: Date | null
  todoEndTime: string | undefined
  isAllday: boolean
  repeatConfig: RepeatConfigSchema
  todoTitle: string | undefined
  eventColor: EventColorType
}

export const useTodoFormFields = ({ date }: UseTodoFormFieldsProps): UseTodoFormFieldsResult => {
  const resolver = yupResolver(addTodoSchema) as Resolver<AddTodoFormValues>
  const formMethods = useForm<AddTodoFormValues>({
    resolver,
    defaultValues: {
      todoTitle: '',
      todoDescription: '',
      todoDate: new Date(date),
      todoEndTime: '10:00',
      isAllday: false,
      eventColor: 'GRAY',
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
    const baseDate = new Date(date)
    setValue('todoDate', baseDate)
  }, [date, setValue])

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
