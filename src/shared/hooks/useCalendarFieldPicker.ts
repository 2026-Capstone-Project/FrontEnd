import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import type { AddScheduleFormValues, DatePickerField, TimePickerField } from '@/shared/types/event'

import { formatMinutes, toMinutes } from './timeUtils'

type UseCalendarFieldPickerProps = {
  setValue: UseFormSetValue<AddScheduleFormValues>
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime?: string
  eventEndTime?: string
}

export const useCalendarFieldPicker = ({
  setValue,
  eventStartDate,
  eventEndDate,
  eventStartTime,
  eventEndTime,
}: UseCalendarFieldPickerProps) => {
  const [activeCalendarField, setActiveCalendarField] = useState<DatePickerField | null>(null)
  const calendarRef = useRef<HTMLDivElement | null>(null)

  const handleCalendarOpen = useCallback((field: DatePickerField) => {
    setActiveCalendarField(field)
  }, [])

  const handleCalendarClose = useCallback(() => {
    setActiveCalendarField(null)
  }, [])

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

  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (!activeCalendarField) return
      if (activeCalendarField === 'start') {
        setValue('eventStartDate', selectedDate, { shouldValidate: true })
        setValue('eventEndDate', selectedDate, { shouldValidate: true })
      } else {
        if (eventStartDate && selectedDate < eventStartDate) {
          const adjusted = new Date(selectedDate)
          adjusted.setDate(adjusted.getDate() - 1)
          setValue('eventStartDate', adjusted, { shouldValidate: true })
        }
        setValue('eventEndDate', selectedDate, { shouldValidate: true })
      }
      handleCalendarClose()
    },
    [activeCalendarField, eventStartDate, setValue, handleCalendarClose],
  )

  const handleTimeChange = useCallback(
    (field: TimePickerField, value: string) => {
      const fieldName = field === 'start' ? 'eventStartTime' : 'eventEndTime'
      setValue(fieldName, value, { shouldValidate: true })
      const sameDay =
        eventStartDate !== null &&
        eventEndDate !== null &&
        eventStartDate.toDateString() === eventEndDate.toDateString()
      const newMinutes = toMinutes(value)
      if (field === 'end' && sameDay) {
        const currentStartMinutes = toMinutes(eventStartTime)
        if (currentStartMinutes >= newMinutes) {
          const adjustedStart = formatMinutes(newMinutes - 60)
          setValue('eventStartTime', adjustedStart, { shouldValidate: true })
        }
      }
      if (field === 'start' && sameDay) {
        const currentEndMinutes = toMinutes(eventEndTime)
        if (currentEndMinutes <= newMinutes) {
          const adjustedEnd = formatMinutes(newMinutes + 60)
          setValue('eventEndTime', adjustedEnd, { shouldValidate: true })
        }
      }
    },
    [eventEndDate, eventEndTime, eventStartDate, eventStartTime, setValue],
  )

  return {
    activeCalendarField,
    calendarRef,
    handleCalendarOpen,
    handleCalendarClose,
    handleDateSelect,
    handleTimeChange,
  }
}
