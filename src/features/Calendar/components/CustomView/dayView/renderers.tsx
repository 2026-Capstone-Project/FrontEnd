import moment from 'moment'
import type { MutableRefObject, Ref } from 'react'

import People from '@/assets/icons/people.svg?react'

import type { CalendarEvent } from '../../../../../shared/types/calendar/types'
import { TIMED_SLOT_CONFIG } from '../../../domain/constants'
import { getColorPalette } from '../../../utils/colorPalette'
import { getEventOccurrenceKey, type TimedSlotEvent } from '../../../utils/helpers/dayViewHelpers'
import { TodoCheckbox } from '../../CustomEvent/CustomEvent.style'
import * as S from '../dayView'
import type { DragState, EventPointerDownHandler } from './dragHandlers'
import { getDayEventRenderGeometry } from './renderGeometry'
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
  selectedEventKey?: string | null,
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
        isSelected={selectedEventKey === getEventOccurrenceKey(event)}
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
        ) : event.isShared ? (
          <People
            aria-hidden="true"
            focusable="false"
            width={10}
            height={12}
            color={palette.point ?? 'transparent'}
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
  handleResizeStartPointerDown,
  onToggleTodo,
  selectedEventKey,
  onEventSelect,
  onEventClick,
  onEventDoubleClick,
  dragThresholdPassedRef,
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
  handleResizeStartPointerDown: EventPointerDownHandler
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventKey?: string | null
  onEventSelect?: (event: CalendarEvent) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventDoubleClick?: (event: CalendarEvent) => void
  dragThresholdPassedRef?: MutableRefObject<boolean>
  gridRef?: MutableRefObject<HTMLDivElement | null>
  columnIndex: number
}) => {
  const rowHeightForCalc = rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT
  const gridRect = gridRef?.current?.getBoundingClientRect() ?? null
  const columnGapPx = gridRef?.current
    ? Number.parseFloat(getComputedStyle(gridRef.current).columnGap || '0')
    : 0
  const columnWidth = gridRect ? (gridRect.width - columnGapPx) / 2 : 0
  return (
    <S.SlotColumn key={startHour}>
      {renderTimeSlotRows(startHour, date, handleSlotDoubleClick, slotRef)}
      <S.TimeOverlay>
        {columnEvents.map(
          ({ event, top, height, palette, overflowTop, overflowBottom, laneIndex, laneCount }) => {
            const eventStart = normalizeDateValue(event.start)
            const eventEnd = normalizeDateValue(event.end)
            const { overflowTopResolved, overflowBottomResolved, style } =
              getDayEventRenderGeometry({
                top,
                height,
                overflowTop,
                overflowBottom,
                laneIndex,
                laneCount,
                rowHeight: rowHeightForCalc,
                columnWidth,
                columnGapPx,
                dragState: dragStateRef.current,
                eventId: event.id,
              })
            return (
              <S.DayEventBadge
                key={event.id}
                color={palette.base}
                pointColor={palette.point}
                isSelected={selectedEventKey === getEventOccurrenceKey(event)}
                overflowTop={overflowTopResolved}
                overflowBottom={overflowBottomResolved}
                style={style}
                onClick={() => {
                  if (dragThresholdPassedRef?.current) return
                  onEventSelect?.(event)
                  onEventClick?.(event)
                }}
                onDoubleClick={() => {
                  if (dragThresholdPassedRef?.current) return
                  onEventDoubleClick?.(event)
                }}
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
                <S.EventRow>
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
                  ) : event.isShared ? (
                    <People
                      aria-hidden="true"
                      focusable="false"
                      width={10}
                      height={12}
                      color={palette.point ?? 'transparent'}
                    />
                  ) : (
                    <S.Circle backgroundColor={palette.point} />
                  )}
                  <S.EventTitle>{event.title}</S.EventTitle>
                </S.EventRow>
                {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
                {event.type !== 'todo' && (
                  <S.EventResizerTop
                    onPointerDown={(pointerEvent) => {
                      pointerEvent.stopPropagation()
                      handleResizeStartPointerDown(
                        pointerEvent,
                        event,
                        rowHeightForCalc,
                        eventStart,
                        eventEnd,
                      )
                    }}
                  />
                )}
                {event.type !== 'todo' && (
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
                )}
              </S.DayEventBadge>
            )
          },
        )}
      </S.TimeOverlay>
    </S.SlotColumn>
  )
}
