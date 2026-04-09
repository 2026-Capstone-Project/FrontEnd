import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addTodoSchema } from '@/shared/schemas/todo'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type TodoEditorFormValues,
} from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'

type UseTodoFormFieldsProps = {
  date: string
  initialEvent?: CalendarEvent | null
  isEditing?: boolean
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft) => void
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

const buildTodoDefaultValues = ({
  date,
  initialEvent,
  draftValues,
}: {
  date: string
  initialEvent?: CalendarEvent | null
  draftValues?: ItemEditorDraft | null
}): TodoEditorFormValues => {
  const defaultTodoDate = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const defaultTodoTime = initialEvent?.start ? formatTimeFromDate(defaultTodoDate) : '10:00'

  return {
    todoTitle: draftValues?.title ?? '',
    todoDescription: draftValues?.description ?? '',
    todoDate: draftValues?.startDate ?? defaultTodoDate,
    todoEndTime: draftValues?.endTime ?? draftValues?.startTime ?? defaultTodoTime,
    isAllday: draftValues?.isAllday ?? initialEvent?.isAllDay ?? false,
    eventColor: draftValues?.eventColor ?? initialEvent?.color ?? 'GRAY',
    todoPriority: 'MEDIUM',
    repeatConfig: draftValues?.repeatConfig ?? (defaultRepeatConfig as RepeatConfigSchema),
  }
}

export const useTodoFormFields = ({
  date,
  initialEvent,
  isEditing = false,
  draftValues,
  onDraftChange,
}: UseTodoFormFieldsProps): UseTodoFormFieldsResult => {
  const resolver = yupResolver(addTodoSchema) as Resolver<TodoEditorFormValues>
  const initialValues = useMemo(
    () => buildTodoDefaultValues({ date, initialEvent, draftValues }),
    [date, draftValues, initialEvent],
  )
  const formMethods = useForm<TodoEditorFormValues>({
    resolver,
    defaultValues: initialValues,
  })
  const { control, register, reset, setValue, handleSubmit } = formMethods

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
    reset(initialValues)
  }, [date, initialValues, isEditing, reset])

  useEffect(() => {
    if (isEditing || !onDraftChange) return
    const subscription = formMethods.watch((values) => {
      onDraftChange({
        title: values.todoTitle ?? '',
        description: values.todoDescription ?? '',
        startDate: values.todoDate ?? null,
        endDate: values.todoDate ?? null,
        startTime: values.todoEndTime,
        endTime: values.todoEndTime,
        isAllday: values.isAllday ?? false,
        eventColor: (values.eventColor ?? 'GRAY') as EventColorType,
        repeatConfig:
          (values.repeatConfig as RepeatConfigSchema | undefined) ??
          (defaultRepeatConfig as RepeatConfigSchema),
        location: '',
        address: null,
      })
    })

    return () => subscription.unsubscribe()
  }, [formMethods, isEditing, onDraftChange])

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
