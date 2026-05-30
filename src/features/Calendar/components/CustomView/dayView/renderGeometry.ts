import { TIMED_SLOT_CONFIG } from '@/features/Calendar/domain/constants'

import type { DragState } from './dragHandlers'

const LANE_GAP = 6

export const getDayEventRenderGeometry = ({
  top,
  height,
  overflowTop,
  overflowBottom,
  laneIndex,
  laneCount,
  rowHeight,
  columnWidth,
  columnGapPx,
  dragState,
  eventId,
}: {
  top: number
  height: number
  overflowTop?: boolean
  overflowBottom?: boolean
  laneIndex?: number
  laneCount?: number
  rowHeight: number
  columnWidth: number
  columnGapPx: number
  dragState: DragState | null
  eventId: number
}) => {
  const rowHeightForCalc = rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT
  const columnHeight = rowHeightForCalc * (TIMED_SLOT_CONFIG.MAX_VISUAL_HOURS - 1)
  const minHeight = TIMED_SLOT_CONFIG.MIN_HEIGHT
  const isDraggingEvent = dragState?.event.id === eventId
  const isPreviewing = Boolean(dragState?.preview)
  const columnShift =
    isDraggingEvent && dragState?.mode === 'move' && !isPreviewing
      ? (dragState?.columnShift ?? 0)
      : 0
  const translateX = columnShift ? columnShift * (columnWidth + columnGapPx) : 0
  const moveDeltaMinutes =
    isDraggingEvent && dragState?.mode === 'move' && !isPreviewing ? dragState.deltaMinutes : 0
  const resizeDeltaMinutes =
    isDraggingEvent && dragState?.mode === 'resize' && !isPreviewing ? dragState.deltaMinutes : 0
  const moveOffset = (moveDeltaMinutes / 60) * rowHeightForCalc
  const resizeOffset = (resizeDeltaMinutes / 60) * rowHeightForCalc
  const baseTop = top + moveOffset
  const clampedTop = Math.min(Math.max(baseTop, 0), columnHeight - minHeight)
  const baseHeight = Math.max(height + resizeOffset, minHeight)
  const clampedHeight = Math.min(baseHeight, Math.max(columnHeight - clampedTop, minHeight))
  const overflowTopResolved = Boolean(overflowTop) || baseTop < 0
  const overflowBottomResolved = Boolean(overflowBottom) || baseTop + baseHeight > columnHeight
  const lanes = Math.max(laneCount ?? 1, 1)
  const lane = Math.max(laneIndex ?? 0, 0)
  const totalGap = lanes > 1 ? LANE_GAP * (lanes - 1) : 0
  const laneWidthCss = lanes > 1 ? `calc((100% - ${totalGap}px) / ${lanes})` : '100%'
  const laneLeftCss =
    lanes > 1 ? `calc(${lane} * (100% - ${totalGap}px) / ${lanes} + ${lane * LANE_GAP}px)` : '0px'

  return {
    isDraggingEvent,
    overflowTopResolved,
    overflowBottomResolved,
    style: {
      top: clampedTop,
      height: clampedHeight,
      width: laneWidthCss,
      left: laneLeftCss,
      right: 'auto',
      transform: translateX ? `translateX(${translateX}px)` : undefined,
      transition: translateX ? 'transform 120ms ease' : undefined,
      zIndex: isDraggingEvent ? 4 : undefined,
    },
  }
}
