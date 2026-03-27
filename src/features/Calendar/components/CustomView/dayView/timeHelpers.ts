import type { stringOrDate } from 'react-big-calendar'

import { TIMED_SLOT_CONFIG } from '../../../domain/constants'
import { MIN_EVENT_DURATION_MINUTES } from './constants'

export const normalizeDateValue = (value: stringOrDate): Date => {
  if (value instanceof Date) return value
  return value ? new Date(value) : new Date()
}

export const shiftMinutesBy = (value: Date, minutes: number) =>
  new Date(value.getTime() + minutes * 60000)

export const buildMoveRange = (start: Date, end: Date, deltaMinutes: number) => ({
  nextStart: shiftMinutesBy(start, deltaMinutes),
  nextEnd: shiftMinutesBy(end, deltaMinutes),
})

export const buildResizeRange = (start: Date, end: Date, deltaMinutes: number) => {
  const candidate = shiftMinutesBy(end, deltaMinutes)
  const minEnd = shiftMinutesBy(start, MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: start,
    nextEnd: candidate <= start ? minEnd : candidate,
  }
}

export const buildResizeStartRange = (start: Date, end: Date, deltaMinutes: number) => {
  const candidate = shiftMinutesBy(start, deltaMinutes)
  const maxStart = shiftMinutesBy(end, -MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: candidate >= end ? maxStart : candidate,
    nextEnd: end,
  }
}

export const getMinutesPerPixel = (rowHeight: number) =>
  rowHeight > 0 ? 60 / rowHeight : 60 / TIMED_SLOT_CONFIG.SLOT_HEIGHT

export const snapDateToMinutes = (value: Date, stepMinutes: number) => {
  const base = new Date(value)
  base.setSeconds(0, 0)
  const totalMinutes = base.getHours() * 60 + base.getMinutes()
  const snappedMinutes = Math.round(totalMinutes / stepMinutes) * stepMinutes
  const snapped = new Date(base)
  snapped.setHours(0, 0, 0, 0)
  snapped.setMinutes(snappedMinutes)
  return snapped
}
