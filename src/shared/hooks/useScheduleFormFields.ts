import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { type Control, type Resolver, useForm, type UseFormReturn, useWatch } from 'react-hook-form'

import { addScheduleSchema } from '@/shared/schemas/schedule'
import {
  type AddScheduleFormValues,
  type EventColorType,
  type RepeatConfigSchema,
} from '@/shared/types/event'
import { defaultRepeatConfig } from '@/shared/types/repeat'

type UseScheduleFormFieldsProps = {
  date: string
  isAllday: boolean
}

export type UseScheduleFormFieldsResult = {
  formMethods: UseFormReturn<AddScheduleFormValues>
  control: Control<AddScheduleFormValues>
  setValue: UseFormReturn<AddScheduleFormValues>['setValue']
  handleSubmit: UseFormReturn<AddScheduleFormValues>['handleSubmit']
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime: string | undefined
  eventEndTime: string | undefined
  repeatConfig: RepeatConfigSchema
  eventColor: EventColorType
  eventTitle: string | undefined
}

export const useScheduleFormFields = ({
  date,
  isAllday,
}: UseScheduleFormFieldsProps): UseScheduleFormFieldsResult => {
  const resolver = yupResolver(addScheduleSchema) as Resolver<AddScheduleFormValues>
  const formMethods = useForm<AddScheduleFormValues>({
    resolver,
    defaultValues: {
      eventTitle: '새로운 일정',
      eventDescription: '',
      eventStartDate: new Date(date),
      eventEndDate: new Date(date),
      eventStartTime: '09:00',
      eventEndTime: '10:00',
      isAllday,
      eventColor: 'sky',
      repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    },
  })
  const { control, register, setValue, handleSubmit } = formMethods

  const eventStartDate = useWatch({ control, name: 'eventStartDate' })
  const eventEndDate = useWatch({ control, name: 'eventEndDate' })
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })
  const repeatConfig = (useWatch({ control, name: 'repeatConfig' }) ??
    (defaultRepeatConfig as RepeatConfigSchema)) as RepeatConfigSchema
  const eventColor = (useWatch({ control, name: 'eventColor' }) ?? 'sky') as EventColorType
  const eventTitle = useWatch({ control, name: 'eventTitle' })

  useEffect(() => {
    register('eventStartDate')
    register('eventEndDate')
    register('eventStartTime')
    register('eventEndTime')
    register('isAllday')
    register('repeatConfig')
    register('eventColor')
  }, [register])

  useEffect(() => {
    setValue('isAllday', isAllday)
  }, [isAllday, setValue])

  useEffect(() => {
    const baseDate = new Date(date)
    setValue('eventStartDate', baseDate)
    setValue('eventEndDate', baseDate)
  }, [date, setValue])

  return {
    formMethods,
    control,
    handleSubmit,
    setValue,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    repeatConfig,
    eventColor,
    eventTitle,
  }
}
