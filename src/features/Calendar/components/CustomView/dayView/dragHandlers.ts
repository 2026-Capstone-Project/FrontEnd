import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

import type { CalendarEvent } from '../../../../../shared/types/calendar/types'
import { MIN_EVENT_DURATION_MINUTES } from './constants'
import {
  buildMoveRange,
  buildResizeRange,
  buildResizeStartRange,
  getMinutesPerPixel,
  shiftMinutesBy,
  snapDateToMinutes,
} from './timeHelpers'

const SNAP_MINUTES = 30
const snapMinutes = (value: number) => Math.round(value / SNAP_MINUTES) * SNAP_MINUTES

const snapMoveRange = (range: { nextStart: Date; nextEnd: Date }) => {
  const snappedStart = snapDateToMinutes(range.nextStart, SNAP_MINUTES)
  const snappedEnd = snapDateToMinutes(range.nextEnd, SNAP_MINUTES)
  if (snappedEnd <= snappedStart) {
    return { nextStart: snappedStart, nextEnd: shiftMinutesBy(snappedStart, SNAP_MINUTES) }
  }
  return { nextStart: snappedStart, nextEnd: snappedEnd }
}

const snapResizeRange = (range: { nextStart: Date; nextEnd: Date }, start: Date) => {
  const snappedEnd = snapDateToMinutes(range.nextEnd, SNAP_MINUTES)
  const minEnd = shiftMinutesBy(start, MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: range.nextStart,
    nextEnd: snappedEnd <= start ? minEnd : snappedEnd,
  }
}

const snapResizeStartRange = (range: { nextStart: Date; nextEnd: Date }, end: Date) => {
  const snappedStart = snapDateToMinutes(range.nextStart, SNAP_MINUTES)
  const maxStart = shiftMinutesBy(end, -MIN_EVENT_DURATION_MINUTES)
  return {
    nextStart: snappedStart >= end ? maxStart : snappedStart,
    nextEnd: range.nextEnd,
  }
}

export type DragMode = 'move' | 'resize' | 'resize-start'
export type DragState = {
  event: CalendarEvent
  startClientY: number
  startDate: Date
  endDate: Date
  deltaMinutes: number
  pointerId: number
  target: EventTarget | null
  mode: DragMode
  originColumnIndex?: number
  lastClientX?: number
  columnShift?: number
  preview?: boolean
}

type DragStartOptions = {
  gridRect?: DOMRect | null
  originColumnIndex?: number
  columnGapPx?: number
}

export type EventPointerDownHandler = (
  pointerEvent: ReactPointerEvent<HTMLDivElement>,
  calendarEvent: CalendarEvent,
  rowHeight: number,
  start: Date,
  end: Date,
  options?: DragStartOptions,
) => void

type OnEventDrag = (event: CalendarEvent, newStart: Date, newEnd: Date) => void

export const useDayViewDragHandlers = (
  onEventDrag?: OnEventDrag,
  onEventDragPreview?: OnEventDrag,
) => {
  const [, setDragRenderTrigger] = useState(0)
  const dragStateRef = useRef<DragState | null>(null)
  const cleanupRef = useRef<undefined | (() => void)>(undefined)
  const previewFrameRef = useRef<number | null>(null)
  const pendingPreviewRef = useRef<{ event: CalendarEvent; start: Date; end: Date } | null>(null)

  const triggerRender = useCallback(() => {
    setDragRenderTrigger((prev) => prev + 1)
  }, [])

  const createCleanup = useCallback(
    (
      handlePointerMove: (event: PointerEvent) => void,
      handlePointerUp: () => void,
      handleCancel: () => void,
    ) => {
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
        window.removeEventListener('pointercancel', handleCancel)
        if (previewFrameRef.current != null) {
          window.cancelAnimationFrame(previewFrameRef.current)
          previewFrameRef.current = null
        }
        pendingPreviewRef.current = null
        dragStateRef.current = null
        triggerRender()
        cleanupRef.current = undefined
      }
    },
    [triggerRender],
  )

  const startDragSession = useCallback(
    (
      pointerEvent: ReactPointerEvent<HTMLDivElement>,
      calendarEvent: CalendarEvent,
      rowHeight: number,
      start: Date,
      end: Date,
      mode: DragMode,
      options?: DragStartOptions,
    ) => {
      cleanupRef.current?.()
      const pointerStartY = pointerEvent.clientY
      const minutesPerPixel = getMinutesPerPixel(rowHeight)
      const gridRect = options?.gridRect ?? null
      const originColumnIndex = options?.originColumnIndex
      const columnGapPx = options?.columnGapPx ?? 0

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaY = moveEvent.clientY - pointerStartY
        const rawDeltaMinutes = deltaY * minutesPerPixel
        const deltaMinutes = snapMinutes(rawDeltaMinutes)
        let columnShift = 0
        if (gridRect && typeof originColumnIndex === 'number') {
          const gap = Math.max(columnGapPx, 0)
          const columnWidth = (gridRect.width - gap) / 2
          const relativeX = moveEvent.clientX - gridRect.left
          const clampedX = Math.min(Math.max(relativeX, 0), gridRect.width)
          const leftBoundary = columnWidth
          const rightBoundary = columnWidth + gap
          let targetIndex = originColumnIndex
          if (clampedX < leftBoundary) {
            targetIndex = 0
          } else if (clampedX > rightBoundary) {
            targetIndex = 1
          }
          columnShift = targetIndex - originColumnIndex
        }
        dragStateRef.current = {
          event: calendarEvent,
          startClientY: pointerStartY,
          startDate: start,
          endDate: end,
          deltaMinutes,
          pointerId: moveEvent.pointerId,
          target: moveEvent.target,
          mode,
          originColumnIndex,
          lastClientX: moveEvent.clientX,
          columnShift,
          preview: Boolean(onEventDragPreview),
        }
        if (onEventDragPreview) {
          const totalMinutes = mode === 'move' ? deltaMinutes + columnShift * 12 * 60 : deltaMinutes
          const snappedTotalMinutes = snapMinutes(totalMinutes)
          const nextRange =
            mode === 'move'
              ? snapMoveRange(buildMoveRange(start, end, snappedTotalMinutes))
              : mode === 'resize'
                ? snapResizeRange(buildResizeRange(start, end, snappedTotalMinutes), start)
                : snapResizeStartRange(buildResizeStartRange(start, end, snappedTotalMinutes), end)
          pendingPreviewRef.current = {
            event: calendarEvent,
            start: nextRange.nextStart,
            end: nextRange.nextEnd,
          }
          if (previewFrameRef.current == null) {
            previewFrameRef.current = window.requestAnimationFrame(() => {
              const pending = pendingPreviewRef.current
              previewFrameRef.current = null
              pendingPreviewRef.current = null
              if (pending) {
                onEventDragPreview(pending.event, pending.start, pending.end)
              }
            })
          }
        }
        triggerRender()
      }

      const handlePointerUp = () => {
        const currentState = dragStateRef.current
        const deltaMinutes = currentState?.deltaMinutes ?? 0
        const columnShift = currentState?.columnShift ?? 0
        const totalMinutes = mode === 'move' ? deltaMinutes + columnShift * 12 * 60 : deltaMinutes
        const snappedTotalMinutes = snapMinutes(totalMinutes)
        if (snappedTotalMinutes === 0) {
          if (pointerEvent.currentTarget instanceof HTMLElement) {
            pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
          }
          cleanup()
          return
        }
        const nextRange =
          mode === 'move'
            ? snapMoveRange(buildMoveRange(start, end, snappedTotalMinutes))
            : mode === 'resize'
              ? snapResizeRange(buildResizeRange(start, end, snappedTotalMinutes), start)
              : snapResizeStartRange(buildResizeStartRange(start, end, snappedTotalMinutes), end)
        if (pointerEvent.currentTarget instanceof HTMLElement) {
          pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
        }
        onEventDrag?.(calendarEvent, nextRange.nextStart, nextRange.nextEnd)
        cleanup()
      }

      const handleCancel = () => {
        if (pointerEvent.currentTarget instanceof HTMLElement) {
          pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
        }
        cleanup()
      }

      const cleanup = createCleanup(handlePointerMove, handlePointerUp, handleCancel)
      cleanupRef.current = cleanup
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handleCancel)
      pointerEvent.currentTarget?.setPointerCapture(pointerEvent.pointerId)
      dragStateRef.current = {
        event: calendarEvent,
        startClientY: pointerStartY,
        startDate: start,
        endDate: end,
        deltaMinutes: 0,
        pointerId: pointerEvent.pointerId,
        target: pointerEvent.target,
        mode,
        preview: Boolean(onEventDragPreview),
      }
    },
    [createCleanup, onEventDrag, onEventDragPreview, triggerRender],
  )

  const handleEventPointerDown: EventPointerDownHandler = useCallback(
    (pointerEvent, calendarEvent, rowHeight, start, end, options) =>
      startDragSession(pointerEvent, calendarEvent, rowHeight, start, end, 'move', options),
    [startDragSession],
  )

  const handleResizePointerDown: EventPointerDownHandler = useCallback(
    (pointerEvent, calendarEvent, rowHeight, start, end) =>
      startDragSession(pointerEvent, calendarEvent, rowHeight, start, end, 'resize'),
    [startDragSession],
  )

  const handleResizeStartPointerDown: EventPointerDownHandler = useCallback(
    (pointerEvent, calendarEvent, rowHeight, start, end) =>
      startDragSession(pointerEvent, calendarEvent, rowHeight, start, end, 'resize-start'),
    [startDragSession],
  )

  return {
    dragStateRef,
    handleEventPointerDown,
    handleResizePointerDown,
    handleResizeStartPointerDown,
  }
}
