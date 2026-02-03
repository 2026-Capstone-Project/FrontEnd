import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'

import { formatWeekday } from '@/features/Calendar/utils/formatters'

import type { CalendarEvent } from '../../domain/types'
import {
  buildTimedSlots,
  compareByStart,
  eventCoversDate,
  isDateOnlyString,
} from '../../utils/helpers/dayViewHelpers'
import * as S from './dayView'
import { TIME_COLUMN_START_HOURS } from './dayView/constants'
import { useDayViewDragHandlers } from './dayView/dragHandlers'
import { renderAllDayEventBadges, renderTimeOverlayColumn } from './dayView/renderers'

interface CustomDayViewProps {
  events?: CalendarEvent[]
  date?: Date
  onSlotDoubleClick?: (slotDate: Date) => void
  onEventDrag?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventId?: CalendarEvent['id'] | null
  onEventSelect?: (event: CalendarEvent) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventDoubleClick?: (event: CalendarEvent) => void
}

//TODO: 이벤트가 차지하는 높이가 작을 때 텍스트가 넘치는 문제 해결

//TODO: 이벤트 겹침 처리 -> 디자인 요청

/**
 * 하루 단위로 렌더링하는 커스텀 뷰.
 * allDay 이벤트는 상단 배너로, 그 외 타임드 이벤트는 12시간씩 나뉘어진 슬롯에 배치합니다.
 */
const CustomDayView: React.FC<CustomDayViewProps> & ViewStatic = ({
  events = [],
  date = new Date(),
  onSlotDoubleClick,
  onEventDrag,
  onToggleTodo,
  selectedEventId,
  onEventSelect,
  onEventClick,
  onEventDoubleClick,
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

  const [rowHeight, setRowHeight] = useState(50)
  const { dragStateRef, handleEventPointerDown, handleResizePointerDown } =
    useDayViewDragHandlers(onEventDrag)
  const slotRowRef = useRef<HTMLDivElement | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

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
          {renderAllDayEventBadges(
            allDayEvents,
            onToggleTodo,
            selectedEventId,
            onEventSelect,
            onEventClick,
            onEventDoubleClick,
          )}
        </S.AllDaySection>

        <S.GridContainer ref={gridRef}>
          {TIME_COLUMN_START_HOURS.map((startHour, columnIndex) =>
            renderTimeOverlayColumn({
              startHour,
              columnEvents: timedColumns[columnIndex] ?? [],
              date,
              rowHeight,
              slotRef: columnIndex === 0 ? handleSlotRef : undefined,
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
            }),
          )}
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
