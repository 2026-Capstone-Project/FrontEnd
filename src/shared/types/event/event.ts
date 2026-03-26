import type { InferType } from 'yup'

import { addScheduleSchema } from '@/shared/schemas/schedule'

import type { addTodoSchema } from '../../schemas/todo'

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

export type ScheduleEditorFormValues = InferType<typeof addScheduleSchema>
export type RepeatConfigSchema = ScheduleEditorFormValues['repeatConfig']

export type EventColorType = 'PINK' | 'GREEN' | 'BLUE' | 'PURPLE' | 'YELLOW' | 'GRAY'
export type WeekDaysSingleChar = 'S' | 'M' | 'T' | 'W' | 'T' | 'F'

export type TodoEditorFormValues = InferType<typeof addTodoSchema>

export type Week =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
