import moment from 'moment'
import type { MutableRefObject, Ref } from 'react'

import { TIMED_SLOT_CONFIG } from '../../../domain/constants'
import type { CalendarEvent } from '../../../domain/types'
import { getColorPalette } from '../../../utils/colorPalette'
import type { TimedSlotEvent } from '../../../utils/helpers/dayViewHelpers'
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
) =>
  events.map((event) => {
    const palette = getColorPalette(event.color)
    return (
      <S.EventBadgeWrapper key={event.id} color={palette.base}>
        {event.type === 'todo' ? (
          <S.TodoCheckbox
            type="checkbox"
            checked={!!event.isDone}
            onClick={(eventClick) => eventClick.stopPropagation()}
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
}) => {
  const rowHeightForCalc = rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT
  return (
    <S.SlotColumn key={startHour}>
      {renderTimeSlotRows(startHour, date, handleSlotDoubleClick, slotRef)}
      <S.TimeOverlay>
        {columnEvents.map(({ event, top, height, palette }) => {
          const eventStart = normalizeDateValue(event.start)
          const eventEnd = normalizeDateValue(event.end)
          const currentDragState = dragStateRef.current
          const isDraggingEvent = currentDragState?.event.id === event.id
          const moveDeltaMinutes =
            isDraggingEvent && currentDragState?.mode === 'move' ? currentDragState.deltaMinutes : 0
          const resizeDeltaMinutes =
            isDraggingEvent && currentDragState?.mode === 'resize'
              ? currentDragState.deltaMinutes
              : 0
          const moveOffset = (moveDeltaMinutes / 60) * rowHeightForCalc
          const resizeOffset = (resizeDeltaMinutes / 60) * rowHeightForCalc
          const finalHeight = Math.max(height + resizeOffset, TIMED_SLOT_CONFIG.MIN_HEIGHT)
          return (
            <S.DayEventBadge
              key={event.id}
              color={palette.base}
              style={{ top: top + moveOffset, height: finalHeight }}
              onPointerDown={(pointerEvent) =>
                handleEventPointerDown(pointerEvent, event, rowHeightForCalc, eventStart, eventEnd)
              }
            >
              <S.EventRow>
                {event.type === 'todo' ? (
                  <S.TodoCheckbox
                    type="checkbox"
                    checked={!!event.isDone}
                    onClick={(eventClick) => eventClick.stopPropagation()}
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
