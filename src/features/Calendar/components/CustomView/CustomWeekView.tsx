import moment from 'moment'
import React from 'react'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'

import { getColorPalette } from '@/features/Calendar/utils/colorPalette'
import {
  compareByStart,
  eventCoversDate,
  getEventOccurrenceKey,
  isDateOnlyString,
} from '@/features/Calendar/utils/helpers/dayViewHelpers'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import { TodoCheckbox } from '../CustomEvent/CustomEvent.style'
import * as S from './weekView'

type WeekProps = {
  date?: Date
  events?: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onDoubleClickEvent?: (event: CalendarEvent) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventKey?: string | null
}

const formatTime = (event: CalendarEvent) => {
  if (event.isAllDay || isDateOnlyString(event.start)) {
    return '종일'
  }
  return moment(event.start).format('HH:mm')
}

const CustomWeekView: React.ComponentType<WeekProps> & ViewStatic = (({
  date = new Date(),
  events = [],
  onSelectEvent,
  onDoubleClickEvent,
  onToggleTodo,
  selectedEventKey,
}: WeekProps) => {
  const weekStart = moment(date).startOf('week')
  const weekDays = Array.from({ length: 7 }, (_, index) => weekStart.clone().add(index, 'day'))
  const today = moment()

  return (
    <S.WeekContainer>
      <S.WeekHeaderRow>
        {weekDays.map((dayMoment) => {
          const day = dayMoment.day()
          return (
            <S.WeekHeaderCell key={dayMoment.format('YYYY-MM-DD')}>
              <S.DayName $isSunday={day === 0} $isSaturday={day === 6}>
                {dayMoment.format('ddd')}
              </S.DayName>
              <S.DayNumber $isToday={dayMoment.isSame(today, 'day')}>
                {dayMoment.format('D')}
              </S.DayNumber>
            </S.WeekHeaderCell>
          )
        })}
      </S.WeekHeaderRow>

      <S.DayGrid>
        {weekDays.map((dayMoment) => {
          const dayDate = dayMoment.toDate()
          const dayEvents = events
            .filter((event) => eventCoversDate(event, dayDate))
            .sort(compareByStart)
          const allDayEvents = dayEvents.filter(
            (event) => event.isAllDay || isDateOnlyString(event.start),
          )
          const timedEvents = dayEvents.filter(
            (event) => !event.isAllDay && !isDateOnlyString(event.start),
          )

          const renderEventCard = (event: CalendarEvent) => {
            const palette = getColorPalette(event.color)
            const isTodo = event.type === 'todo'
            const isDone = Boolean(event.isDone)
            return (
              <S.EventCard
                key={getEventOccurrenceKey(event)}
                type="button"
                $backgroundColor={palette.base}
                $pointColor={palette.point}
                $isSelected={getEventOccurrenceKey(event) === selectedEventKey}
                onClick={(eventMouse) => {
                  eventMouse.stopPropagation()
                  onSelectEvent?.(event)
                }}
                onDoubleClick={(eventMouse) => {
                  eventMouse.stopPropagation()
                  onDoubleClickEvent?.(event)
                }}
              >
                <S.EventHeader>
                  {isTodo ? (
                    <TodoCheckbox
                      type="checkbox"
                      checked={isDone}
                      onPointerDown={(eventPointer) => eventPointer.stopPropagation()}
                      onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
                      onClick={(eventClick) => eventClick.stopPropagation()}
                      onChange={(eventChange) => {
                        eventChange.stopPropagation()
                        onToggleTodo?.(event.id)
                      }}
                    />
                  ) : (
                    <S.EventDot $color={palette.point} />
                  )}
                  <S.EventTitle>{event.title}</S.EventTitle>
                </S.EventHeader>
                <S.EventMeta>{formatTime(event)}</S.EventMeta>
              </S.EventCard>
            )
          }

          return (
            <S.DayColumn key={dayMoment.format('YYYY-MM-DD')}>
              <S.DaySection>
                <S.SectionTitle>종일</S.SectionTitle>
                {allDayEvents.length > 0 ? (
                  <S.EventStack>{allDayEvents.map(renderEventCard)}</S.EventStack>
                ) : (
                  <S.EmptyText>일정 없음</S.EmptyText>
                )}
              </S.DaySection>
              <S.DaySection>
                <S.SectionTitle>시간 지정</S.SectionTitle>
                {timedEvents.length > 0 ? (
                  <S.EventStack>{timedEvents.map(renderEventCard)}</S.EventStack>
                ) : (
                  <S.EmptyText>일정 없음</S.EmptyText>
                )}
              </S.DaySection>
            </S.DayColumn>
          )
        })}
      </S.DayGrid>
    </S.WeekContainer>
  )
}) as React.ComponentType<WeekProps> & ViewStatic

CustomWeekView.navigate = (date: Date, action: NavigateAction) => {
  switch (action) {
    case 'PREV':
      return moment(date).subtract(1, 'week').toDate()
    case 'NEXT':
      return moment(date).add(1, 'week').toDate()
    default:
      return date
  }
}

CustomWeekView.title = (date: Date) => {
  const start = moment(date).startOf('week')
  const end = start.clone().endOf('week')
  return `${start.format('YYYY년 M월 D일')} - ${end.format('M월 D일')}`
}

export { CustomWeekView }
export default CustomWeekView
