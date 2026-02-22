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

const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

type WeekProps = {
  date?: Date
  events?: CalendarEvent[]
  selectedDate?: Date | null
  onSelectDate?: (date: Date) => void
  onSelectEvent?: (event: CalendarEvent) => void
  onDoubleClickEvent?: (event: CalendarEvent) => void
  onDoubleClickDate?: (date: Date) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  selectedEventKey?: string | null
}

type AllDaySegment = {
  event: CalendarEvent
  key: string
  startIndex: number
  endIndex: number
  lane: number
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
  selectedDate,
  onSelectDate,
  onSelectEvent,
  onDoubleClickEvent,
  onDoubleClickDate,
  onToggleTodo,
  selectedEventKey,
}: WeekProps) => {
  const weekStart = moment(date).startOf('week')
  const weekDays = Array.from({ length: 7 }, (_, index) => weekStart.clone().add(index, 'day'))
  const today = moment()
  const weeklyAllDayEvents = React.useMemo(
    () =>
      events
        .filter((event) => event.isAllDay || isDateOnlyString(event.start))
        .sort(compareByStart),
    [events],
  )
  const allDaySegments = React.useMemo<AllDaySegment[]>(() => {
    const laneLastEndIndexes: number[] = []
    const segments: AllDaySegment[] = []

    weeklyAllDayEvents.forEach((event) => {
      const coveredIndexes = weekDays
        .map((dayMoment, index) => (eventCoversDate(event, dayMoment.toDate()) ? index : -1))
        .filter((index) => index >= 0)
      if (coveredIndexes.length === 0) return

      const startIndex = coveredIndexes[0]
      const endIndex = coveredIndexes[coveredIndexes.length - 1]
      let lane = laneLastEndIndexes.findIndex((lastEnd) => startIndex > lastEnd)
      if (lane === -1) {
        lane = laneLastEndIndexes.length
        laneLastEndIndexes.push(endIndex)
      } else {
        laneLastEndIndexes[lane] = endIndex
      }

      segments.push({
        event,
        key: getEventOccurrenceKey(event),
        startIndex,
        endIndex,
        lane,
      })
    })

    return segments
  }, [weekDays, weeklyAllDayEvents])
  const allDayLaneCount = React.useMemo(
    () => allDaySegments.reduce((maxLane, segment) => Math.max(maxLane, segment.lane), -1) + 1,
    [allDaySegments],
  )

  return (
    <S.WeekContainer>
      <S.WeekHeaderRow>
        {weekDays.map((dayMoment) => {
          const day = dayMoment.day()
          const isSelectedDay = selectedDate ? dayMoment.isSame(selectedDate, 'day') : false
          return (
            <S.WeekHeaderCell key={dayMoment.format('YYYY-MM-DD')}>
              <S.DayName $isSunday={day === 0} $isSaturday={day === 6}>
                {KOREAN_WEEKDAYS[day]}
              </S.DayName>
              <S.DateCell
                $isLast={day === 6}
                $isSelected={isSelectedDay}
                onClick={() => {
                  onSelectDate?.(dayMoment.toDate())
                }}
              >
                <S.DayNumber
                  $isToday={dayMoment.isSame(today, 'day')}
                  $isSunday={day === 0}
                  $isSaturday={day === 6}
                >
                  {dayMoment.format('D')}
                </S.DayNumber>
              </S.DateCell>
            </S.WeekHeaderCell>
          )
        })}
      </S.WeekHeaderRow>
      <S.AllDaySection>
        <S.AllDayGridLines>
          {weekDays.map((dayMoment) => {
            const isSelectedDay = selectedDate ? dayMoment.isSame(selectedDate, 'day') : false
            return (
              <S.AllDayGridLineCell
                key={`all-day-line-${dayMoment.format('YYYY-MM-DD')}`}
                $isSelected={isSelectedDay}
                onClick={() => {
                  onSelectDate?.(dayMoment.toDate())
                }}
              />
            )
          })}
        </S.AllDayGridLines>
        <S.AllDayLanes $laneCount={allDayLaneCount}>
          {allDaySegments.map((segment) => {
            const palette = getColorPalette(segment.event.color)
            const isTodo = segment.event.type === 'todo'
            const isDone = Boolean(segment.event.isDone)
            return (
              <S.AllDayEventBar
                key={segment.key}
                type="button"
                $lane={segment.lane}
                $startIndex={segment.startIndex}
                $span={segment.endIndex - segment.startIndex + 1}
                $backgroundColor={palette.base}
                $pointColor={palette.point}
                $isSelected={segment.key === selectedEventKey}
                onClick={(eventMouse) => {
                  eventMouse.stopPropagation()
                  onSelectEvent?.(segment.event)
                }}
                onDoubleClick={(eventMouse) => {
                  eventMouse.stopPropagation()
                  onDoubleClickEvent?.(segment.event)
                }}
              >
                {isTodo ? (
                  <TodoCheckbox
                    type="checkbox"
                    checked={isDone}
                    onPointerDown={(eventPointer) => eventPointer.stopPropagation()}
                    onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
                    onClick={(eventClick) => eventClick.stopPropagation()}
                    onChange={(eventChange) => {
                      eventChange.stopPropagation()
                      onToggleTodo?.(segment.event.id)
                    }}
                  />
                ) : (
                  <S.EventDot $color={palette.point} />
                )}
                <S.AllDayEventTitle>{segment.event.title}</S.AllDayEventTitle>
              </S.AllDayEventBar>
            )
          })}
        </S.AllDayLanes>
      </S.AllDaySection>

      <S.DayGrid>
        {weekDays.map((dayMoment) => {
          const dayDate = dayMoment.toDate()
          const isSelectedDay = selectedDate ? dayMoment.isSame(selectedDate, 'day') : false
          const timedEvents = events
            .filter((event) => eventCoversDate(event, dayDate))
            .filter((event) => !event.isAllDay && !isDateOnlyString(event.start))
            .sort(compareByStart)

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
            <S.DayColumn
              key={dayMoment.format('YYYY-MM-DD')}
              $isSelected={isSelectedDay}
              onClick={() => {
                onSelectDate?.(dayDate)
              }}
              onDoubleClick={() => {
                onDoubleClickDate?.(dayDate)
              }}
            >
              <S.DaySection $variant="timed">
                {timedEvents.length > 0 && (
                  <S.EventStack>{timedEvents.map(renderEventCard)}</S.EventStack>
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
