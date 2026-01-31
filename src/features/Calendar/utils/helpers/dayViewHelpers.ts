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
  overflowTop?: boolean
  overflowBottom?: boolean
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
    const palette = getColorPalette(event.color)
    const start = moment(event.start)
    const end = moment(event.end)
    const dayStart = start.clone().startOf('day')
    const dayEnd = dayStart.clone().add(24, 'hours')
    const noon = dayStart.clone().add(12, 'hours')
    const clampedStart = moment.max(start, dayStart)
    const clampedEnd = moment.min(end, dayEnd)

    if (!clampedEnd.isAfter(clampedStart)) {
      return
    }

    const pushSegment = (segmentStart: moment.Moment, segmentEnd: moment.Moment) => {
      const columnIndex = segmentStart.hour() < 12 ? 0 : 1
      const columnStart = dayStart.clone().add(COLUMNS[columnIndex], 'hours')
      const minutesSinceColumnStart = segmentStart.diff(columnStart, 'minutes')
      const durationMinutes = Math.max(segmentEnd.diff(segmentStart, 'minutes'), 15)
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
        overflowTop: segmentStart.isAfter(start),
        overflowBottom: segmentEnd.isBefore(end),
      })
    }

    if (clampedStart.isBefore(noon) && clampedEnd.isAfter(noon)) {
      pushSegment(clampedStart, noon)
      pushSegment(noon, clampedEnd)
      return
    }

    pushSegment(clampedStart, clampedEnd)
  })

  return columns
}
