import moment from 'moment'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import {
  compareByStart,
  eventCoversDate,
  getEventOccurrenceKey,
  isDateOnlyString,
} from './helpers/dayViewHelpers'

export const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export type AllDaySegment = {
  event: CalendarEvent
  key: string
  startIndex: number
  endIndex: number
  lane: number
}

export const buildWeekDays = (date: Date) => {
  const weekStart = moment(date).startOf('week')
  return Array.from({ length: 7 }, (_, index) => weekStart.clone().add(index, 'day'))
}

export const getWeeklyAllDayEvents = (events: CalendarEvent[]) =>
  events.filter((event) => event.isAllDay || isDateOnlyString(event.start)).sort(compareByStart)

export const buildAllDaySegments = (
  weeklyAllDayEvents: CalendarEvent[],
  weekDays: Date[],
): AllDaySegment[] => {
  const laneLastEndIndexes: number[] = []
  const segments: AllDaySegment[] = []

  weeklyAllDayEvents.forEach((event) => {
    const coveredIndexes = weekDays
      .map((dayDate, index) => (eventCoversDate(event, dayDate) ? index : -1))
      .filter((index) => index >= 0)
    if (coveredIndexes.length === 0) return

    const startIndex = coveredIndexes[0]
    const endIndex = coveredIndexes[coveredIndexes.length - 1]
    let lane = laneLastEndIndexes.findIndex((lastEnd) => startIndex > lastEnd)
    if (lane === -1) {
      lane = laneLastEndIndexes.length
      laneLastEndIndexes.push(endIndex)
    } else {
      laneLastEndIndexes[lane] = endIndex
    }

    segments.push({
      event,
      key: getEventOccurrenceKey(event),
      startIndex,
      endIndex,
      lane,
    })
  })

  return segments
}

export const getAllDayLaneCount = (segments: AllDaySegment[]) =>
  segments.reduce((maxLane, segment) => Math.max(maxLane, segment.lane), -1) + 1

export const getTimedEventsForDate = (events: CalendarEvent[], date: Date) =>
  events
    .filter((event) => eventCoversDate(event, date))
    .filter((event) => !event.isAllDay && !isDateOnlyString(event.start))
    .sort(compareByStart)

export const getDropDayIndex = (clientX: number, sectionRect: DOMRect, dayCount = 7) => {
  const relativeX = Math.max(0, Math.min(clientX - sectionRect.left, sectionRect.width - 1))
  const dayWidth = sectionRect.width / dayCount
  return Math.max(0, Math.min(dayCount - 1, Math.floor(relativeX / dayWidth)))
}

export const buildWeekDropRange = (
  draggingEvent: CalendarEvent,
  targetDate: Date,
  dropAsAllDay: boolean,
) => {
  const originalStart = moment(draggingEvent.start)
  const originalEnd = moment(draggingEvent.end)
  const originalStartDay = originalStart.clone().startOf('day')
  const originalEndDay = originalEnd.clone().startOf('day')
  const originalAllDay = draggingEvent.isAllDay || isDateOnlyString(draggingEvent.start)
  const durationMs = Math.max(originalEnd.diff(originalStart), 0)
  const useAllDayTime = dropAsAllDay || originalAllDay

  const nextStart = useAllDayTime
    ? moment(targetDate).startOf('day')
    : moment(targetDate).set({
        hour: originalStart.hour(),
        minute: originalStart.minute(),
        second: originalStart.second(),
        millisecond: originalStart.millisecond(),
      })
  const nextEnd = useAllDayTime
    ? (() => {
        const spanDays = Math.max(originalEndDay.diff(originalStartDay, 'days') + 1, 1)
        return nextStart
          .clone()
          .add(spanDays - 1, 'days')
          .endOf('day')
      })()
    : durationMs > 0
      ? nextStart.clone().add(durationMs, 'milliseconds')
      : nextStart.clone().add(1, 'hour')

  return {
    start: nextStart.toDate(),
    end: nextEnd.toDate(),
    allDay: useAllDayTime,
  }
}
