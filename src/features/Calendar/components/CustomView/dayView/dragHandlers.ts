import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

import type { CalendarEvent } from '../../../../../shared/types/calendar/types'
import {
  buildSnappedDragRange,
  type DayViewDragMode,
  getColumnShift,
  snapMinutes,
} from './dragMath'
import { getMinutesPerPixel } from './timeHelpers'

export type DragMode = DayViewDragMode
export type DragState = {
  event: CalendarEvent
  startClientY: number
  startClientX: number
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
  const dragThresholdPassedRef = useRef(false)
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
      const pointerStartX = pointerEvent.clientX
      const minutesPerPixel = getMinutesPerPixel(rowHeight)
      const gridRect = options?.gridRect ?? null
      const originColumnIndex = options?.originColumnIndex
      const columnGapPx = options?.columnGapPx ?? 0

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - pointerStartX
        const deltaY = moveEvent.clientY - pointerStartY
        const rawDeltaMinutes = deltaY * minutesPerPixel
        const deltaMinutes = snapMinutes(rawDeltaMinutes)
        if (Math.hypot(deltaX, deltaY) > 6) {
          dragThresholdPassedRef.current = true
        }
        const columnShift = getColumnShift({
          clientX: moveEvent.clientX,
          gridRect,
          originColumnIndex,
          columnGapPx,
        })
        dragStateRef.current = {
          event: calendarEvent,
          startClientY: pointerStartY,
          startClientX: pointerStartX,
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
          const { nextRange } = buildSnappedDragRange({
            mode,
            start,
            end,
            deltaMinutes,
            columnShift,
          })
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
        const { snappedTotalMinutes, nextRange } = buildSnappedDragRange({
          mode,
          start,
          end,
          deltaMinutes,
          columnShift,
        })
        if (snappedTotalMinutes === 0) {
          if (pointerEvent.currentTarget instanceof HTMLElement) {
            pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
          }
          cleanup()
          return
        }
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
      dragThresholdPassedRef.current = false
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handleCancel)
      pointerEvent.currentTarget?.setPointerCapture(pointerEvent.pointerId)
      dragStateRef.current = {
        event: calendarEvent,
        startClientY: pointerStartY,
        startClientX: pointerStartX,
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
    dragThresholdPassedRef,
    handleEventPointerDown,
    handleResizePointerDown,
    handleResizeStartPointerDown,
  }
}
