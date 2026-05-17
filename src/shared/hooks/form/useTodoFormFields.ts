import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useMemo } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { useEditorFormLifecycle } from '@/shared/hooks/form/useEditorFormLifecycle'
import { addTodoSchema } from '@/shared/schemas/todo'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import {
  type EventColorType,
  type RepeatConfigSchema,
  type TodoEditorFormValues,
} from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import { formatTimeFromDate } from '@/shared/utils/editorDateTime'

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
  const resetKey = `${date}::${String(initialEvent?.id ?? 'new')}`
  const formMethods = useForm<TodoEditorFormValues>({
    resolver,
    defaultValues: initialValues,
  })
  const { control, setValue, handleSubmit } = formMethods

  const todoDate = useWatch({ control, name: 'todoDate' })
  const todoEndTime = useWatch({ control, name: 'todoEndTime' })
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? false
  const repeatConfig = (useWatch({ control, name: 'repeatConfig' }) ??
    (defaultRepeatConfig as RepeatConfigSchema)) as RepeatConfigSchema
  const todoTitle = useWatch({ control, name: 'todoTitle' })
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'GRAY') as EventColorType

  const mapDraft = useCallback(
    (values: TodoEditorFormValues): ItemEditorDraft => ({
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
    }),
    [],
  )

  useEditorFormLifecycle({
    formMethods,
    registeredFields: [
      'todoDate',
      'todoEndTime',
      'isAllday',
      'eventColor',
      'todoPriority',
      'repeatConfig',
    ],
    resetKey,
    isEditing,
    initialValues,
    onDraftChange,
    mapDraft,
  })

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
