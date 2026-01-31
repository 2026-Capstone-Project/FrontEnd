import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

import type { CalendarEvent } from '../../../domain/types'
import { buildMoveRange, buildResizeRange, getMinutesPerPixel } from './timeHelpers'

export type DragMode = 'move' | 'resize'
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

export const useDayViewDragHandlers = (onEventDrag?: OnEventDrag) => {
  const [, setDragRenderTrigger] = useState(0)
  const dragStateRef = useRef<DragState | null>(null)
  const cleanupRef = useRef<undefined | (() => void)>(undefined)

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
        const deltaMinutes = Math.round(deltaY * minutesPerPixel)
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
        }
        triggerRender()
      }

      const handlePointerUp = () => {
        const currentState = dragStateRef.current
        const deltaMinutes = currentState?.deltaMinutes ?? 0
        const columnShift = currentState?.columnShift ?? 0
        const totalMinutes = mode === 'move' ? deltaMinutes + columnShift * 12 * 60 : deltaMinutes
        if (totalMinutes === 0) {
          if (pointerEvent.currentTarget instanceof HTMLElement) {
            pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
          }
          cleanup()
          return
        }
        const nextRange =
          mode === 'move'
            ? buildMoveRange(start, end, totalMinutes)
            : buildResizeRange(start, end, totalMinutes)
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
      }
    },
    [createCleanup, onEventDrag, triggerRender],
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

  return {
    dragStateRef,
    handleEventPointerDown,
    handleResizePointerDown,
  }
}
