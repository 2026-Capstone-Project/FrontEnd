import moment from 'moment'
import type { stringOrDate } from 'react-big-calendar'

import type { CalendarEvent } from '@/features/Calendar/domain/types'

import { TIMED_SLOT_CONFIG } from '../../domain/constants'
import { getColorPalette } from '../colorPalette'

export type TimedSlotEvent = {
  event: CalendarEvent
  top: number
  height: number
  palette: { base: string; point: string }
}

export const isDateOnlyString = (value?: stringOrDate) =>
  typeof value === 'string' && !value.includes('T')

export const compareByStart = (a: CalendarEvent, b: CalendarEvent) =>
  moment(a.start).diff(moment(b.start))

export const eventCoversDate = (event: CalendarEvent, date: Date) => {
  const start = moment(event.start)
  const end = moment(event.end)
  return moment(date).isBetween(start.startOf('day'), end.endOf('day'), undefined, '[]')
}

export const buildTimedSlots = (events: CalendarEvent[]) => {
  const { SLOT_HEIGHT, MIN_HEIGHT, MAX_VISUAL_HOURS, COLUMNS } = TIMED_SLOT_CONFIG
  const columns: TimedSlotEvent[][] = COLUMNS.map(() => [])

  events.forEach((event) => {
    const start = moment(event.start)
    const columnIndex = start.hour() < 12 ? 0 : 1
    const palette = getColorPalette(event.color)
    const minutesSinceColumnStart =
      (start.hour() % 12) * SLOT_HEIGHT + (start.minute() / 60) * SLOT_HEIGHT
    const durationMinutes = Math.max(moment(event.end).diff(start, 'minutes'), 15)
    const calculatedHeight = (durationMinutes / 60) * SLOT_HEIGHT
    const height = Math.min(
      calculatedHeight,
      SLOT_HEIGHT * MAX_VISUAL_HOURS - minutesSinceColumnStart,
    )

    columns[columnIndex].push({
      event,
      top: minutesSinceColumnStart,
      height: Math.max(height, MIN_HEIGHT),
      palette,
    })
  })

  return columns
}
