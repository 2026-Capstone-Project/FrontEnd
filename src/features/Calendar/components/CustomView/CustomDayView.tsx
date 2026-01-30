import moment from 'moment'
import React, {
  type PointerEvent as ReactPointerEvent,
  type Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { NavigateAction, stringOrDate, ViewStatic } from 'react-big-calendar'

import { formatWeekday } from '@/features/Calendar/utils/formatters'

import { TIMED_SLOT_CONFIG } from '../../domain/constants'
import type { CalendarEvent } from '../../domain/types'
import { getColorPalette } from '../../utils/colorPalette'
import {
  buildTimedSlots,
  compareByStart,
  eventCoversDate,
  isDateOnlyString,
} from '../../utils/helpers/dayViewHelpers'
import * as S from './dayView'

interface CustomDayViewProps {
  events?: CalendarEvent[]
  date?: Date
  onSlotDoubleClick?: (slotDate: Date) => void
  onEventDrag?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
}

//TODO: 반응형 디자인 추가: 모바일 환경에서는 grid 1
//TODO: 이벤트가 차지하는 높이가 작을 때 텍스트가 넘치는 문제 해결
//TODO: 드래그해서 시간 선택, 이벤트 시간 변경 기능 추가
//TODO: 이벤트 겹침 처리 -> 디자인 요청

/** 24시간을 12시간씩 두 컬럼으로 나누어 시간 라인을 렌더링합니다. */
const renderTimeSlotRows = (
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

/**
 * 하루 단위로 렌더링하는 커스텀 뷰.
 * allDay 이벤트는 상단 배너로, 그 외 타임드 이벤트는 12시간씩 나뉘어진 슬롯에 배치합니다.
 */
const CustomDayView: React.FC<CustomDayViewProps> & ViewStatic = ({
  events = [],
  date = new Date(),
  onSlotDoubleClick,
  onEventDrag,
}) => {
  const currentDate = moment(date)
  const isToday = currentDate.isSame(moment(), 'day')

  // 날짜 전체를 차지하는 이벤트만 추려서 위쪽 배너에서 보여줍니다.
  const allDayEvents = events
    .filter(
      (event) => (event.allDay || isDateOnlyString(event.start)) && eventCoversDate(event, date),
    )
    .sort(compareByStart)

  // 특정 시간에 시작하는 이벤트는 타임라인에 배치합니다.
  const timedEvents = events
    .filter(
      (event) => !event.allDay && !isDateOnlyString(event.start) && eventCoversDate(event, date),
    )
    .sort(compareByStart)

  const timedColumns = buildTimedSlots(timedEvents)

  const normalizedEvent = useCallback((value: stringOrDate): Date => {
    if (value instanceof Date) return value
    return value ? new Date(value) : new Date()
  }, [])

  type DragMode = 'move' | 'resize'
  type DragState = {
    event: CalendarEvent
    startClientY: number
    startDate: Date
    endDate: Date
    deltaMinutes: number
    pointerId: number
    target: EventTarget | null
    mode: DragMode
  }

  const [rowHeight, setRowHeight] = useState(50)
  const [, setDragRenderTrigger] = useState(0)
  const dragStateRef = useRef<DragState | null>(null)
  const cleanupRef = useRef<undefined | (() => void)>(undefined)
  const slotRowRef = useRef<HTMLDivElement | null>(null)

  const handleSlotRef = useCallback((node: HTMLDivElement | null) => {
    slotRowRef.current = node
    if (node) {
      setRowHeight(node.getBoundingClientRect().height)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (slotRowRef.current) {
        setRowHeight(slotRowRef.current.getBoundingClientRect().height)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEventPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    calendarEvent: CalendarEvent,
  ) => {
    event.preventDefault()
    cleanupRef.current?.()

    const start = normalizedEvent(calendarEvent.start)
    const end = normalizedEvent(calendarEvent.end)
    const target = event.currentTarget
    const minutesPerPixel = 60 / (rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - event.clientY
      const deltaMinutes = Math.round(deltaY * minutesPerPixel)
      dragStateRef.current = {
        event: calendarEvent,
        startClientY: event.clientY,
        startDate: start,
        endDate: end,
        deltaMinutes,
        pointerId: moveEvent.pointerId,
        target,
        mode: 'move',
      }
      setDragRenderTrigger((prev) => prev + 1)
    }

    const handlePointerUp = () => {
      const deltaMinutes = dragStateRef.current?.deltaMinutes ?? 0
      const newStart = new Date(start.getTime() + deltaMinutes * 60000)
      const newEnd = new Date(end.getTime() + deltaMinutes * 60000)
      if (target instanceof HTMLElement) {
        target.releasePointerCapture(event.pointerId)
      }
      onEventDrag?.(calendarEvent, newStart, newEnd)
      cleanup()
    }

    const handleCancel = () => {
      if (target instanceof HTMLElement) {
        target.releasePointerCapture(event.pointerId)
      }
      cleanup()
    }

    function cleanup() {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handleCancel)
      dragStateRef.current = null
      setDragRenderTrigger((prev) => prev + 1)
      cleanupRef.current = undefined
    }

    cleanupRef.current = cleanup
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handleCancel)
    target?.setPointerCapture(event.pointerId)
    dragStateRef.current = {
      event: calendarEvent,
      startClientY: event.clientY,
      startDate: start,
      endDate: end,
      deltaMinutes: 0,
      pointerId: event.pointerId,
      target,
      mode: 'move',
    }
  }

  const handleResizePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    calendarEvent: CalendarEvent,
  ) => {
    event.preventDefault()
    cleanupRef.current?.()

    const start = normalizedEvent(calendarEvent.start)
    const end = normalizedEvent(calendarEvent.end)
    const target = event.currentTarget
    const minutesPerPixel = 60 / (rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT)
    const pointerStartY = event.clientY

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
        target,
        mode: 'resize',
      }
      setDragRenderTrigger((prev) => prev + 1)
    }

    const handlePointerUp = () => {
      const deltaMinutes = dragStateRef.current?.deltaMinutes ?? 0
      const candidate = new Date(end.getTime() + deltaMinutes * 60000)
      const minEnd = new Date(start.getTime())
      minEnd.setMinutes(minEnd.getMinutes() + 15)
      const finalEnd = candidate <= start ? minEnd : candidate
      if (target instanceof HTMLElement) {
        target.releasePointerCapture(event.pointerId)
      }
      onEventDrag?.(calendarEvent, start, finalEnd)
      cleanup()
    }

    const handleCancel = () => {
      if (target instanceof HTMLElement) {
        target.releasePointerCapture(event.pointerId)
      }
      cleanup()
    }

    function cleanup() {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handleCancel)
      dragStateRef.current = null
      setDragRenderTrigger((prev) => prev + 1)
      cleanupRef.current = undefined
    }

    cleanupRef.current = cleanup
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handleCancel)
    target?.setPointerCapture(event.pointerId)
    dragStateRef.current = {
      event: calendarEvent,
      startClientY: pointerStartY,
      startDate: start,
      endDate: end,
      deltaMinutes: 0,
      pointerId: event.pointerId,
      target,
      mode: 'resize',
    }
    setDragRenderTrigger((prev) => prev + 1)
  }

  const handleSlotDoubleClick = useCallback(
    (slotDate: Date) => onSlotDoubleClick?.(slotDate),
    [onSlotDoubleClick],
  )

  return (
    <S.DayViewContainer>
      <S.DateInfo>
        <S.DateLabel>{formatWeekday(date)}요일</S.DateLabel>
        <S.DateCircle highlight={isToday}>{moment(date).format('D')}</S.DateCircle>
      </S.DateInfo>

      <S.CalendarWrapper>
        <S.AllDaySection>
          {allDayEvents.map((event) => {
            const palette = getColorPalette(event?.color)
            return (
              <S.EventBadgeWrapper key={event.id} color={palette.base}>
                <S.Circle backgroundColor={palette.point} />
                {event.title}
              </S.EventBadgeWrapper>
            )
          })}
        </S.AllDaySection>

        <S.GridContainer>
          {[0, 12].map((startHour, columnIndex) => (
            <S.SlotColumn key={startHour}>
              {renderTimeSlotRows(
                startHour,
                date,
                handleSlotDoubleClick,
                startHour === 0 ? handleSlotRef : undefined,
              )}
              <S.TimeOverlay>
                {timedColumns[columnIndex].map(({ event, top, height, palette }) => {
                  const currentDragState = dragStateRef.current
                  const isDraggingEvent = currentDragState?.event.id === event.id
                  const moveDeltaMinutes =
                    isDraggingEvent && currentDragState?.mode === 'move'
                      ? currentDragState.deltaMinutes
                      : 0
                  const resizeDeltaMinutes =
                    isDraggingEvent && currentDragState?.mode === 'resize'
                      ? currentDragState.deltaMinutes
                      : 0
                  const movePixelOffset =
                    (moveDeltaMinutes / 60) * (rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT) || 0
                  const resizeHeightOffset =
                    (resizeDeltaMinutes / 60) * (rowHeight || TIMED_SLOT_CONFIG.SLOT_HEIGHT) || 0
                  const finalHeight = Math.max(
                    height + resizeHeightOffset,
                    TIMED_SLOT_CONFIG.MIN_HEIGHT,
                  )
                  return (
                    <S.DayEventBadge
                      key={event.id}
                      color={palette.base}
                      style={{ top: top + movePixelOffset, height: finalHeight }}
                      onPointerDown={(pointerEvent) => handleEventPointerDown(pointerEvent, event)}
                    >
                      <S.EventRow>
                        <S.Circle backgroundColor={palette.point} />
                        <S.EventTitle>{event.title}</S.EventTitle>
                      </S.EventRow>
                      {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
                      <S.EventResizer
                        onPointerDown={(pointerEvent) => {
                          pointerEvent.stopPropagation()
                          handleResizePointerDown(pointerEvent, event)
                        }}
                      />
                    </S.DayEventBadge>
                  )
                })}
              </S.TimeOverlay>
            </S.SlotColumn>
          ))}
        </S.GridContainer>
      </S.CalendarWrapper>
    </S.DayViewContainer>
  )
}

CustomDayView.title = (date: Date) => moment(date).format('YYYY년 M월 D일')

CustomDayView.navigate = (date: Date, action: NavigateAction) => {
  switch (action) {
    case 'PREV':
      return moment(date).subtract(1, 'day').toDate()
    case 'NEXT':
      return moment(date).add(1, 'day').toDate()
    default:
      return date
  }
}

export default CustomDayView

export type { CalendarEvent }
