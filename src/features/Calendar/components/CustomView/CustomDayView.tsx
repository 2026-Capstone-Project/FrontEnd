import moment from 'moment'
import React from 'react'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'

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
}

//TODO: 반응형 디자인 추가: 모바일 환경에서는 grid 1
//TODO: 이벤트가 차지하는 높이가 작을 때 텍스트가 넘치는 문제 해결
//TODO: 드래그해서 시간 선택, 이벤트 시간 변경 기능 추가
//TODO: 이벤트 겹침 처리 -> 디자인 요청

/** 24시간을 12시간씩 두 컬럼으로 나누어 시간 라인을 렌더링합니다. */
const renderTimeSlotRows = (startHour: number) => {
  const TOTAL_SLOTS = TIMED_SLOT_CONFIG.MAX_VISUAL_HOURS
  return Array.from({ length: TOTAL_SLOTS }, (_, index) => {
    const hour = startHour + index
    const hourLabel = `${String(hour).padStart(2, '0')}:00`
    const isLast = index === TOTAL_SLOTS - 1

    return (
      <>
        {!isLast && (
          <S.TimeSlotRow key={hour}>
            <S.TimeLabel>{hourLabel}</S.TimeLabel>
            <S.SlotContent className={hour === startHour + TOTAL_SLOTS - 2 ? 'last-slot' : ''} />
          </S.TimeSlotRow>
        )}
      </>
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
              {renderTimeSlotRows(startHour)}
              <S.TimeOverlay>
                {timedColumns[columnIndex].map(({ event, top, height, palette }) => (
                  <S.DayEventBadge key={event.id} color={palette.base} style={{ top, height }}>
                    <S.EventRow>
                      <S.Circle backgroundColor={palette.point} />
                      <S.EventTitle>{event.title}</S.EventTitle>
                    </S.EventRow>
                    {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
                  </S.DayEventBadge>
                ))}
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
