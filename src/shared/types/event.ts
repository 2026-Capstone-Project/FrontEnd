import type { InferType } from 'yup'

import { addScheduleSchema } from '@/shared/schemas/schedule'

import type { addTodoSchema } from '../schemas/todo'

export type DatePickerField = 'start' | 'end'
export type DatePickerRenderProps = {
  field: DatePickerField
  selectedDate: Date | null
  onSelectDate: (value: Date) => void
}
export type TimePickerField = 'start' | 'end'
export type TimePickerRenderProps = {
  field: TimePickerField
  value: string
  onChange: (value: string) => void
}

export type AddScheduleFormValues = InferType<typeof addScheduleSchema>
export type RepeatConfigSchema = AddScheduleFormValues['repeatConfig']

export type EventColorType = 'pink' | 'mint' | 'sky' | 'violet' | 'yellow' | 'gray'
export type WeekDaysSingleChar = 'S' | 'M' | 'T' | 'W' | 'T' | 'F'

export type AddTodoFormValues = InferType<typeof addTodoSchema>
