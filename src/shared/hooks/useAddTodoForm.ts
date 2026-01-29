import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type Control, type UseFormReturn } from 'react-hook-form'

import type {
  AddTodoFormValues,
  DatePickerField,
  RepeatConfigSchema,
  TimePickerField,
} from '@/shared/types/event'
import type { CustomRepeatBasis, RepeatConfig, RepeatType } from '@/shared/types/repeat'
import { formatIsoDate } from '@/shared/utils/date'

import { useTodoFormFields } from './useTodoFormFields'

type UseAddTodoProps = {
  date: string
  id: number
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
  handleCalendarOpen: (field: DatePickerField) => void
  handleDateSelect: (selectedDate: Date) => void
  handleTimeChange: (field: TimePickerField, value: string) => void
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleSubmit: UseFormReturn<AddTodoFormValues>['handleSubmit']
  onSubmit: (values: AddTodoFormValues) => void
  setIsAllday: React.Dispatch<React.SetStateAction<boolean>>
  todoTitle: string | undefined
  repeatEndDate: Date | null
}

const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
  value !== 'none' && value !== 'custom'

export const useAddTodoForm = ({ date }: UseAddTodoProps): UseAddTodoFormResult => {
  const [isAllday, setIsAllday] = useState(false)

  const {
    formMethods,
    control,
    handleSubmit,
    setValue,
    todoDate,
    todoEndTime,
    repeatConfig,
    todoTitle,
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

  const onSubmit = (values: AddTodoFormValues) => {
    const payload = {
      ...values,
      todoDate: formatIsoDate(values.todoDate),
    }
    console.log('투두 저장', payload)
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
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
    handleSubmit,
    onSubmit,
    setIsAllday,
    todoTitle,
    repeatEndDate,
  }
}
