import React from 'react'
import moment from 'moment'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'
import * as S from './CustomDayView.style'

export interface CalendarEvent {
  title?: string
  start?: Date | string
  end?: Date | string
  allDay?: boolean
  color?: string
}

interface CustomDayViewProps {
  events?: CalendarEvent[]
  date?: Date
}

const CustomDayView: React.FC<CustomDayViewProps> & ViewStatic = ({
  events = [],
  date = new Date(),
}) => {
  const allDayEvents = events.filter((event) => event.allDay)
  const timedEvents = events.filter((event) => !event.allDay)
  const isToday = moment(date).isSame(moment(), 'day')
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

  const renderColumn = (startHour: number) => {
    return Array.from({ length: 13 }, (_, i) => {
      const hour = startHour + i
      const hourStr = `${String(hour).padStart(2, '0')}:00`
      const isLast = i === 12

      const hourEvent = timedEvents.find(
        (event) => event.start && moment(event.start).hour() === hour,
      )

      return (
        <S.TimeSlotRow key={hour}>
          {!isLast ? <S.TimeLabel>{hourStr}</S.TimeLabel> : <S.PlaceholderLabel />}

          {!isLast && (
            <S.SlotContent className={hour === startHour + 11 ? 'last-slot' : ''}>
              {hourEvent && <S.EventBadge color={hourEvent.color}>{hourEvent.title}</S.EventBadge>}
            </S.SlotContent>
          )}
        </S.TimeSlotRow>
      )
    })
  }

  return (
    <S.DayViewContainer>
      <S.DateInfo>
        <S.DateLabel>{weekdays[moment(date).day()]}</S.DateLabel>
        <S.DateCircle highlight={isToday}>{moment(date).format('D')}</S.DateCircle>
      </S.DateInfo>

      <S.CalendarWrapper>
        <S.AllDaySection>
          {allDayEvents.map((event, idx) => (
            <S.EventBadgeWrapper key={idx} color={event.color}>
              ● {event.title}
            </S.EventBadgeWrapper>
          ))}
        </S.AllDaySection>

        <S.GridContainer>
          <div>{renderColumn(0)}</div>
          <div>{renderColumn(12)}</div>
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
