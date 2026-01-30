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
}

export type EventPointerDownHandler = (
  pointerEvent: ReactPointerEvent<HTMLDivElement>,
  calendarEvent: CalendarEvent,
  rowHeight: number,
  start: Date,
  end: Date,
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
    ) => {
      pointerEvent.preventDefault()
      cleanupRef.current?.()
      const pointerStartY = pointerEvent.clientY
      const minutesPerPixel = getMinutesPerPixel(rowHeight)

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaY = moveEvent.clientY - pointerStartY
        const deltaMinutes = Math.round(deltaY * minutesPerPixel)
        dragStateRef.current = {
          event: calendarEvent,
          startClientY: pointerStartY,
          startDate: start,
          endDate: end,
          deltaMinutes,
          pointerId: moveEvent.pointerId,
          target: moveEvent.target,
          mode,
        }
        triggerRender()
      }

      const handlePointerUp = () => {
        const deltaMinutes = dragStateRef.current?.deltaMinutes ?? 0
        const nextRange =
          mode === 'move'
            ? buildMoveRange(start, end, deltaMinutes)
            : buildResizeRange(start, end, deltaMinutes)
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
    (pointerEvent, calendarEvent, rowHeight, start, end) =>
      startDragSession(pointerEvent, calendarEvent, rowHeight, start, end, 'move'),
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
