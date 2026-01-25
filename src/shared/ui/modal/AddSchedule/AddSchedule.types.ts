export type DatePickerField = 'start' | 'end'
export type DatePickerRenderProps = {
  field: DatePickerField
  selectedDate: Date | null
  onSelectDate: (value: Date) => void
  onClose: () => void
}
export type TimePickerField = 'start' | 'end'
export type TimePickerRenderProps = {
  field: TimePickerField
  value: string
  onChange: (value: string) => void
}

export const toDateValue = (value: Date | string | null | undefined) =>
  value instanceof Date ? value : value ? new Date(value) : null

export const formatCalendarDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  return dateValue ? dateValue.toLocaleDateString('ko-KR') : '날짜 선택'
}
