import React from 'react'
import moment from 'moment'
import type { NavigateAction, ViewStatic, stringOrDate } from 'react-big-calendar'
import * as S from './CustomDayView.style'
import { getColorPalette } from '../../../utils/colorPalette'

export interface CalendarEvent {
  id: string
  title: string
  start: stringOrDate
  end: stringOrDate
  allDay?: boolean
  color?: 'gray' | 'yellow' | 'pink' | 'mint' | 'sky' | 'violet'
  location?: string
  palette?: string
}

interface CustomDayViewProps {
  events?: CalendarEvent[]
  date?: Date
}

const isDateOnlyString = (value?: stringOrDate) => typeof value === 'string' && !value.includes('T')

const CustomDayView: React.FC<CustomDayViewProps> & ViewStatic = ({
  events = [],
  date = new Date(),
}) => {
  const currentDate = moment(date)
  const compareByStart = (a: CalendarEvent, b: CalendarEvent) =>
    moment(a.start).diff(moment(b.start))

  const eventCoversDate = (event: CalendarEvent) => {
    const start = moment(event.start)
    const end = moment(event.end)
    const startOfDay = start.clone().startOf('day')
    const endOfDay = end.clone().endOf('day')
    return currentDate.isBetween(startOfDay, endOfDay, undefined, '[]')
  }

  const allDayEvents = events
    .filter((event) => {
      const startIsDateOnly = isDateOnlyString(event.start)
      return (event.allDay || startIsDateOnly) && eventCoversDate(event)
    })
    .sort(compareByStart)
  const timedEvents = events
    .filter((event) => {
      const startIsDateOnly = isDateOnlyString(event.start)
      return !event.allDay && !startIsDateOnly && eventCoversDate(event)
    })
    .sort(compareByStart)
  const SLOT_HEIGHT = 50
  const columnEvents: Array<{
    event: CalendarEvent
    top: number
    height: number
    baseColor: string
    pointColor: string
  }>[] = [[], []]
  timedEvents.forEach((event) => {
    const start = moment(event.start)
    const columnIdx = start.hour() < 12 ? 0 : 1
    const minutesSinceColumnStart =
      (start.hour() % 12) * SLOT_HEIGHT + (start.minute() / 60) * SLOT_HEIGHT
    const durationMinutes = Math.max(moment(event.end).diff(start, 'minutes'), 15)
    const rawHeight = (durationMinutes / 60) * SLOT_HEIGHT
    const height = Math.min(rawHeight, SLOT_HEIGHT * 13 - minutesSinceColumnStart)
    const palette = getColorPalette(event.palette ?? event.color)
    const baseColor = palette?.base ?? '#d1d5db'
    const pointColor = palette?.point ?? '#9ca3af'
    columnEvents[columnIdx].push({
      event,
      top: minutesSinceColumnStart,
      height: Math.max(height, SLOT_HEIGHT / 2),
      baseColor,
      pointColor,
    })
  })
  const isToday = moment(date).isSame(moment(), 'day')
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const columnStartHours = [0, 12]

  const renderColumn = (startHour: number) => {
    return Array.from({ length: 13 }, (_, i) => {
      const hour = startHour + i
      const hourStr = `${String(hour).padStart(2, '0')}:00`
      const isLast = i === 12

      return (
        <S.TimeSlotRow key={hour}>
          {!isLast ? <S.TimeLabel>{hourStr}</S.TimeLabel> : <S.PlaceholderLabel />}

          {!isLast && (
            <S.SlotContent className={hour === startHour + 11 ? 'last-slot' : ''}></S.SlotContent>
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
            <S.EventBadgeWrapper key={idx} color={getColorPalette(event.color)?.base || '#d1d5db'}>
              <S.Circle backgroundColor={getColorPalette(event.color)?.point || '#d1d5db'} />
              {event.title}
            </S.EventBadgeWrapper>
          ))}
        </S.AllDaySection>

        <S.GridContainer>
          {columnStartHours.map((startHour, index) => (
            <S.SlotColumn key={startHour}>
              {renderColumn(startHour)}
              <S.TimeOverlay>
                {columnEvents[index].map(({ event, top, height, baseColor, pointColor }) => (
                  <S.DayEventBadge key={event.id} color={baseColor} style={{ top, height }}>
                    <S.EventRow>
                      <S.Circle backgroundColor={pointColor} />
                      <S.EventTitle>{event.title}</S.EventTitle>
                    </S.EventRow>
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
