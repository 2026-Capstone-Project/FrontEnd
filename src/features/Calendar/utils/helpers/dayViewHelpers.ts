import moment from 'moment'
import type { stringOrDate } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import { TIMED_SLOT_CONFIG } from '../../domain/constants'
import { getColorPalette } from '../colorPalette'

export type TimedSlotEvent = {
  event: CalendarEvent
  start: Date
  end: Date
  top: number
  height: number
  palette: { base: string; point: string }
  laneIndex?: number
  laneCount?: number
  overflowTop?: boolean
  overflowBottom?: boolean
}

export const isDateOnlyString = (value?: stringOrDate) =>
  typeof value === 'string' && !value.includes('T')

export const compareByStart = (a: CalendarEvent, b: CalendarEvent) =>
  moment(a.start).diff(moment(b.start))

export const getEventOccurrenceKey = (event: CalendarEvent) =>
  `${event.id}_${moment(event.start).format('YYYY-MM-DDTHH:mm')}`

export const resolveOccurrenceDateTime = (
  occurrenceDate: CalendarEvent['occurrenceDate'] | undefined,
  fallbackStart: CalendarEvent['start'] | Date,
) => moment(occurrenceDate ?? fallbackStart).format('YYYY-MM-DDTHH:mm:ss')

export const eventCoversDate = (event: CalendarEvent, date: Date) => {
  const start = moment(event.start)
  const end = moment(event.end)
  return moment(date).isBetween(start.startOf('day'), end.endOf('day'), undefined, '[]')
}

export const buildTimedSlots = (events: CalendarEvent[], date: Date) => {
  const { SLOT_HEIGHT, MIN_HEIGHT, MAX_VISUAL_HOURS, COLUMNS } = TIMED_SLOT_CONFIG
  const columns: TimedSlotEvent[][] = COLUMNS.map(() => [])

  const dayStart = moment(date).startOf('day')
  const dayEnd = dayStart.clone().add(24, 'hours')
  const noon = dayStart.clone().add(12, 'hours')

  events.forEach((event) => {
    const palette = getColorPalette(event.color)
    const start = moment(event.start)
    const end = moment(event.end)
    const clampedStart = moment.max(start, dayStart)
    const clampedEnd = moment.min(end, dayEnd)

    if (!clampedEnd.isAfter(clampedStart)) {
      return
    }

    const pushSegment = (segmentStart: moment.Moment, segmentEnd: moment.Moment) => {
      const columnIndex = segmentStart.hour() < 12 ? 0 : 1
      const columnStart = dayStart.clone().add(COLUMNS[columnIndex], 'hours')
      const minutesSinceColumnStart = segmentStart.diff(columnStart, 'minutes')
      const top = (minutesSinceColumnStart / 60) * SLOT_HEIGHT
      const durationMinutes = Math.max(segmentEnd.diff(segmentStart, 'minutes'), 15)
      const calculatedHeight = (durationMinutes / 60) * SLOT_HEIGHT
      const height = Math.min(calculatedHeight, SLOT_HEIGHT * (MAX_VISUAL_HOURS - 1) - top)

      columns[columnIndex].push({
        event,
        start: segmentStart.toDate(),
        end: segmentEnd.toDate(),
        top,
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

  const assignLanes = (columnEvents: TimedSlotEvent[]) => {
    const sorted = [...columnEvents].sort((a, b) => a.start.getTime() - b.start.getTime())
    const active: Array<{ end: Date; lane: number }> = []
    let cluster: TimedSlotEvent[] = []
    let maxLane = 0

    const finalizeCluster = () => {
      if (cluster.length === 0) return
      cluster.forEach((item) => {
        item.laneCount = maxLane
      })
      cluster = []
      maxLane = 0
    }

    sorted.forEach((item) => {
      const now = item.start.getTime()
      active.sort((a, b) => a.end.getTime() - b.end.getTime())
      while (active.length > 0 && active[0].end.getTime() <= now) {
        active.shift()
      }

      if (active.length === 0) {
        finalizeCluster()
      }

      const usedLanes = new Set(active.map((entry) => entry.lane))
      let lane = 0
      while (usedLanes.has(lane)) lane += 1
      active.push({ end: item.end, lane })
      item.laneIndex = lane
      cluster.push(item)
      maxLane = Math.max(maxLane, active.length)
    })

    finalizeCluster()
  }

  columns.forEach(assignLanes)
  return columns
}
