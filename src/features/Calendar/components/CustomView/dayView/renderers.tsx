import moment from 'moment'
import type { MutableRefObject, Ref } from 'react'

import { TIMED_SLOT_CONFIG } from '../../../domain/constants'
import type { CalendarEvent } from '../../../domain/types'
import { getColorPalette } from '../../../utils/colorPalette'
import type { TimedSlotEvent } from '../../../utils/helpers/dayViewHelpers'
import { TodoCheckbox } from '../../CustomEvent/CustomEvent.style'
import * as S from '../dayView'
import type { DragState, EventPointerDownHandler } from './dragHandlers'
import { normalizeDateValue } from './timeHelpers'

/** 24시간을 12시간씩 두 컬럼으로 나누어 시간 라인을 렌더링합니다. */
export const renderTimeSlotRows = (
  startHour: number,
  date: Date,
  onSlotDoubleClick?: (slotDate: Date) => void,
  rowRef?: Ref<HTMLDivElement>,
) => {
  const TOTAL_SLOTS = TIMED_SLOT_CONFIG.MAX_VISUAL_HOURS
  return Array.from({ length: TOTAL_SLOTS }, (_, index) => {
    const hour = startHour + index
    const hourLabel = `${String(hour).padStart(2, '0')}:00`
    const isLast = index === TOTAL_SLOTS - 1

    const slotDate = moment(date).hour(hour).minute(0).second(0).millisecond(0).toDate()

    if (isLast) {
      return null
    }

    return (
      <S.TimeSlotRow key={hour} ref={hour === startHour ? rowRef : undefined}>
        <S.TimeLabel>{hourLabel}</S.TimeLabel>
        <S.SlotContent
          className={hour === startHour + TOTAL_SLOTS - 2 ? 'last-slot' : ''}
          onDoubleClick={() => onSlotDoubleClick?.(slotDate)}
        />
      </S.TimeSlotRow>
    )
  })
}

export const renderAllDayEventBadges = (
  events: CalendarEvent[],
  onToggleTodo?: (eventId: CalendarEvent['id']) => void,
  selectedEventId?: CalendarEvent['id'] | null,
  onEventSelect?: (event: CalendarEvent) => void,
  onEventClick?: (event: CalendarEvent) => void,
  onEventDoubleClick?: (event: CalendarEvent) => void,
) =>
  events.map((event) => {
    const palette = getColorPalette(event.color)
    return (
      <S.EventBadgeWrapper
        key={event.id}
        color={palette.base}
        pointColor={palette.point}
        isSelected={selectedEventId === event.id}
        onClick={() => {
          onEventSelect?.(event)
          onEventClick?.(event)
        }}
        onDoubleClick={() => {
          onEventSelect?.(event)
          onEventDoubleClick?.(event)
        }}
      >
        {event.type === 'todo' ? (
          <TodoCheckbox
            type="checkbox"
            checked={!!event.isDone}
            onPointerDown={(eventPointer) => eventPointer.stopPropagation()}
            onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
            onClick={(eventClick) => eventClick.stopPropagation()}
            onDoubleClick={(eventDoubleClick) => eventDoubleClick.stopPropagation()}
            onChange={(eventChange) => {
              eventChange.stopPropagation()
              onToggleTodo?.(event.id)
            }}
          />
        ) : (
          <S.Circle backgroundColor={palette.point} />
        )}
        {event.title}
      </S.EventBadgeWrapper>
    )
  })

export const renderTimeOverlayColumn = ({
  startHour,
  columnEvents,
  date,
  rowHeight,
  slotRef,
  handleSlotDoubleClick,
  dragStateRef,
  handleEventPointerDown,
  handleResizePointerDown,
  onToggleTodo,
  selectedEventId,
  onEventSelect,
  onEventClick,
  onEventDoubleClick,
  gridRef,
  columnIndex,
}: {
  startHour: number
  columnEvents: TimedSlotEvent[]
  date: Date
  rowHeight: number
  slotRef?: Ref<HTMLDivElement>
  handleSlotDoubleClick?: (slotDate: Date) => void
  dragStateRef: MutableRefObject<DragState | null>
  handleEventPointerDown: EventPointerDownHandler
  handleResizePointerDown: EventPointerDownHandler
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventId?: CalendarEvent['id'] | null
  onEventSelect?: (event: CalendarEvent) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventDoubleClick?: (event: CalendarEvent) => void
  gridRef?: MutableRefObject<HTMLDivElement | null>
  columnIndex: number
}) => {
  const rowHeightForCalc = rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT
  const columnHeight = rowHeightForCalc * (TIMED_SLOT_CONFIG.MAX_VISUAL_HOURS - 1)
  const minHeight = TIMED_SLOT_CONFIG.MIN_HEIGHT
  const gridRect = gridRef?.current?.getBoundingClientRect() ?? null
  const columnGapPx = gridRef?.current
    ? Number.parseFloat(getComputedStyle(gridRef.current).columnGap || '0')
    : 0
  const columnWidth = gridRect ? (gridRect.width - columnGapPx) / 2 : 0
  return (
    <S.SlotColumn key={startHour}>
      {renderTimeSlotRows(startHour, date, handleSlotDoubleClick, slotRef)}
      <S.TimeOverlay>
        {columnEvents.map(({ event, top, height, palette, overflowTop, overflowBottom }) => {
          const eventStart = normalizeDateValue(event.start)
          const eventEnd = normalizeDateValue(event.end)
          const currentDragState = dragStateRef.current
          const isDraggingEvent = currentDragState?.event.id === event.id
          const columnShift =
            isDraggingEvent && currentDragState?.mode === 'move'
              ? (currentDragState?.columnShift ?? 0)
              : 0
          const translateX = columnShift ? columnShift * (columnWidth + columnGapPx) : 0
          const moveDeltaMinutes =
            isDraggingEvent && currentDragState?.mode === 'move' ? currentDragState.deltaMinutes : 0
          const resizeDeltaMinutes =
            isDraggingEvent && currentDragState?.mode === 'resize'
              ? currentDragState.deltaMinutes
              : 0
          const moveOffset = (moveDeltaMinutes / 60) * rowHeightForCalc
          const resizeOffset = (resizeDeltaMinutes / 60) * rowHeightForCalc
          const baseTop = top + moveOffset
          const clampedTop = Math.min(Math.max(baseTop, 0), columnHeight - minHeight)
          const baseHeight = Math.max(height + resizeOffset, minHeight)
          const clampedHeight = Math.min(baseHeight, Math.max(columnHeight - clampedTop, minHeight))
          const overflowTopResolved = Boolean(overflowTop) || baseTop < 0
          const overflowBottomResolved =
            Boolean(overflowBottom) || baseTop + baseHeight > columnHeight
          return (
            <S.DayEventBadge
              key={event.id}
              color={palette.base}
              pointColor={palette.point}
              isSelected={selectedEventId === event.id}
              overflowTop={overflowTopResolved}
              overflowBottom={overflowBottomResolved}
              style={{
                top: clampedTop,
                height: clampedHeight,
                transform: translateX ? `translateX(${translateX}px)` : undefined,
                transition: translateX ? 'transform 120ms ease' : undefined,
                zIndex: isDraggingEvent ? 4 : undefined,
              }}
              onClick={() => {
                onEventSelect?.(event)
                onEventClick?.(event)
              }}
              onDoubleClick={() => onEventDoubleClick?.(event)}
            >
              <S.EventRow
                onPointerDown={(pointerEvent) => {
                  onEventSelect?.(event)
                  handleEventPointerDown(
                    pointerEvent,
                    event,
                    rowHeightForCalc,
                    eventStart,
                    eventEnd,
                    {
                      gridRect: gridRef?.current?.getBoundingClientRect() ?? null,
                      originColumnIndex: columnIndex,
                      columnGapPx: Number.isNaN(columnGapPx) ? 0 : columnGapPx,
                    },
                  )
                }}
              >
                {event.type === 'todo' ? (
                  <TodoCheckbox
                    type="checkbox"
                    checked={!!event.isDone}
                    onPointerDown={(eventPointer) => eventPointer.stopPropagation()}
                    onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
                    onClick={(eventClick) => eventClick.stopPropagation()}
                    onDoubleClick={(eventDoubleClick) => eventDoubleClick.stopPropagation()}
                    onChange={(eventChange) => {
                      eventChange.stopPropagation()
                      onToggleTodo?.(event.id)
                    }}
                  />
                ) : (
                  <S.Circle backgroundColor={palette.point} />
                )}
                <S.EventTitle>{event.title}</S.EventTitle>
              </S.EventRow>
              {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
              <S.EventResizer
                onPointerDown={(pointerEvent) => {
                  pointerEvent.stopPropagation()
                  handleResizePointerDown(
                    pointerEvent,
                    event,
                    rowHeightForCalc,
                    eventStart,
                    eventEnd,
                  )
                }}
              />
            </S.DayEventBadge>
          )
        })}
      </S.TimeOverlay>
    </S.SlotColumn>
  )
}
