import type { CalendarEvent } from '@/shared/types/calendar/types'

export const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatTimeFromDate = (value: Date) =>
  `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

export const toMinutes = (value?: string) => {
  if (!value) return null
  const [hour, minute] = value.split(':').map((item) => Number.parseInt(item, 10))
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  return hour * 60 + minute
}

export const formatTimeFromMinutes = (value: number) => {
  const normalizedValue = Math.max(0, Math.min(value, 23 * 60 + 59))
  const hour = Math.floor(normalizedValue / 60)
  const minute = normalizedValue % 60
  return `${pad2(hour)}:${pad2(minute)}`
}

export const normalizeScheduleTimeRange = (startTime: string, endTime: string) => {
  const startMinutes = toMinutes(startTime)
  const endMinutes = toMinutes(endTime)

  if (startMinutes == null || endMinutes == null || startMinutes !== endMinutes) {
    return { startTime, endTime }
  }

  if (endMinutes >= 60) {
    return { startTime: formatTimeFromMinutes(endMinutes - 60), endTime }
  }

  return { startTime, endTime: formatTimeFromMinutes(startMinutes + 60) }
}

export const toDate = (value: string | Date) => new Date(value)

export const isSameDateTime = (left: string | Date, right: string | Date) =>
  toDate(left).getTime() === toDate(right).getTime()

export const getDefaultEndDate = (
  defaultStart: Date,
  initialStart?: CalendarEvent['start'],
  initialEnd?: CalendarEvent['end'],
) => {
  if (initialEnd && initialStart && !isSameDateTime(initialEnd, initialStart)) {
    return toDate(initialEnd)
  }
  return new Date(defaultStart.getTime() + 60 * 60 * 1000)
}

export const buildDateTime = (dateValue: Date | null, timeValue?: string) => {
  const nextDate = dateValue ? new Date(dateValue) : new Date()
  if (!timeValue) {
    nextDate.setHours(0, 0, 0, 0)
    return nextDate
  }
  const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
  nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
  return nextDate
}
