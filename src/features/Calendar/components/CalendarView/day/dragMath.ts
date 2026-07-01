import { MIN_EVENT_DURATION_MINUTES } from './constants'
import {
  buildMoveRange,
  buildResizeRange,
  buildResizeStartRange,
  shiftMinutesBy,
  snapDateToMinutes,
} from './timeHelpers'

const SNAP_MINUTES = 30

export type DayViewDragMode = 'move' | 'resize' | 'resize-start'
export type DateRange = { nextStart: Date; nextEnd: Date }

export const snapMinutes = (value: number) => Math.round(value / SNAP_MINUTES) * SNAP_MINUTES

export const snapMoveRange = (range: DateRange) => {
  const snappedStart = snapDateToMinutes(range.nextStart, SNAP_MINUTES)
  const snappedEnd = snapDateToMinutes(range.nextEnd, SNAP_MINUTES)
  if (snappedEnd <= snappedStart) {
    return { nextStart: snappedStart, nextEnd: shiftMinutesBy(snappedStart, SNAP_MINUTES) }
  }
  return { nextStart: snappedStart, nextEnd: snappedEnd }
}

export const snapResizeRange = (range: DateRange, start: Date) => {
  const snappedEnd = snapDateToMinutes(range.nextEnd, SNAP_MINUTES)
  const minEnd = shiftMinutesBy(start, MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: range.nextStart,
    nextEnd: snappedEnd <= start ? minEnd : snappedEnd,
  }
}

export const snapResizeStartRange = (range: DateRange, end: Date) => {
  const snappedStart = snapDateToMinutes(range.nextStart, SNAP_MINUTES)
  const maxStart = shiftMinutesBy(end, -MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: snappedStart >= end ? maxStart : snappedStart,
    nextEnd: range.nextEnd,
  }
}

export const getColumnShift = ({
  clientX,
  gridRect,
  originColumnIndex,
  columnGapPx,
}: {
  clientX: number
  gridRect: DOMRect | null
  originColumnIndex?: number
  columnGapPx: number
}) => {
  if (!gridRect || typeof originColumnIndex !== 'number') return 0

  const gap = Math.max(columnGapPx, 0)
  const columnWidth = (gridRect.width - gap) / 2
  const relativeX = clientX - gridRect.left
  const clampedX = Math.min(Math.max(relativeX, 0), gridRect.width)
  const leftBoundary = columnWidth
  const rightBoundary = columnWidth + gap
  let targetIndex = originColumnIndex

  if (clampedX < leftBoundary) {
    targetIndex = 0
  } else if (clampedX > rightBoundary) {
    targetIndex = 1
  }

  return targetIndex - originColumnIndex
}

export const buildSnappedDragRange = ({
  mode,
  start,
  end,
  deltaMinutes,
  columnShift,
}: {
  mode: DayViewDragMode
  start: Date
  end: Date
  deltaMinutes: number
  columnShift: number
}) => {
  const totalMinutes = mode === 'move' ? deltaMinutes + columnShift * 12 * 60 : deltaMinutes
  const snappedTotalMinutes = snapMinutes(totalMinutes)
  const nextRange =
    mode === 'move'
      ? snapMoveRange(buildMoveRange(start, end, snappedTotalMinutes))
      : mode === 'resize'
        ? snapResizeRange(buildResizeRange(start, end, snappedTotalMinutes), start)
        : snapResizeStartRange(buildResizeStartRange(start, end, snappedTotalMinutes), end)

  return {
    snappedTotalMinutes,
    nextRange,
  }
}
