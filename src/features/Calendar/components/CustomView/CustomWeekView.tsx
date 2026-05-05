import moment from 'moment'
import React from 'react'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import People from '@/assets/icons/people.svg?react'
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
  onEventDrop?: (args: EventInteractionArgs<CalendarEvent>) => void
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

const buildEventAriaLabel = (event: CalendarEvent) => {
  const prefix =
    event.isAllDay || isDateOnlyString(event.start) ? '종일 일정' : `${formatTime(event)} 일정`
  return `${prefix}: ${event.title}`
}

const CustomWeekView: React.ComponentType<WeekProps> & ViewStatic = (({
  date = new Date(),
  events = [],
  selectedDate,
  onSelectDate,
  onSelectEvent,
  onDoubleClickEvent,
  onDoubleClickDate,
  onEventDrop,
  onToggleTodo,
  selectedEventKey,
}: WeekProps) => {
  const weekStart = moment(date).startOf('week')
  const weekDays = Array.from({ length: 7 }, (_, index) => weekStart.clone().add(index, 'day'))
  const allDaySectionRef = React.useRef<HTMLElement | null>(null)
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
  const eventsByOccurrenceKey = React.useMemo(
    () => new Map(events.map((event) => [getEventOccurrenceKey(event), event])),
    [events],
  )
  const [draggingEventKey, setDraggingEventKey] = React.useState<string | null>(null)
  const clearDraggingEvent = React.useCallback(() => {
    setDraggingEventKey(null)
  }, [])
  const handleDropToDate = React.useCallback(
    (targetDate: Date, dropAsAllDay: boolean) => {
      if (!onEventDrop || !draggingEventKey) return
      const draggingEvent = eventsByOccurrenceKey.get(draggingEventKey)
      setDraggingEventKey(null)
      if (!draggingEvent) return

      const originalStart = moment(draggingEvent.start)
      const originalEnd = moment(draggingEvent.end)
      const originalStartDay = originalStart.clone().startOf('day')
      const originalEndDay = originalEnd.clone().startOf('day')
      const originalAllDay = draggingEvent.isAllDay || isDateOnlyString(draggingEvent.start)
      const durationMs = Math.max(originalEnd.diff(originalStart), 0)
      const useAllDayTime = dropAsAllDay || originalAllDay

      const nextStart = useAllDayTime
        ? moment(targetDate).startOf('day')
        : moment(targetDate).set({
            hour: originalStart.hour(),
            minute: originalStart.minute(),
            second: originalStart.second(),
            millisecond: originalStart.millisecond(),
          })
      const nextEnd = useAllDayTime
        ? (() => {
            const spanDays = Math.max(originalEndDay.diff(originalStartDay, 'days') + 1, 1)
            return nextStart
              .clone()
              .add(spanDays - 1, 'days')
              .endOf('day')
          })()
        : durationMs > 0
          ? nextStart.clone().add(durationMs, 'milliseconds')
          : nextStart.clone().add(1, 'hour')

      onEventDrop({
        event: draggingEvent,
        start: nextStart.toDate(),
        end: nextEnd.toDate(),
        allDay: useAllDayTime,
      } as EventInteractionArgs<CalendarEvent>)
    },
    [draggingEventKey, eventsByOccurrenceKey, onEventDrop],
  )
  const handleDropToAllDayByPointer = React.useCallback(
    (clientX: number) => {
      const sectionRect = allDaySectionRef.current?.getBoundingClientRect()
      if (!sectionRect || sectionRect.width <= 0) return
      const relativeX = Math.max(0, Math.min(clientX - sectionRect.left, sectionRect.width - 1))
      const dayWidth = sectionRect.width / 7
      const dayIndex = Math.max(0, Math.min(6, Math.floor(relativeX / dayWidth)))
      handleDropToDate(weekDays[dayIndex].toDate(), true)
    },
    [handleDropToDate, weekDays],
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
                onClick={(eventMouse) => {
                  const nextDate = dayMoment.toDate()
                  onSelectDate?.(nextDate)
                  if (eventMouse.detail === 2) {
                    onDoubleClickDate?.(nextDate)
                  }
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
      <S.AllDaySection
        ref={allDaySectionRef}
        onDragOver={(eventMouse) => {
          eventMouse.preventDefault()
        }}
        onDrop={(eventMouse) => {
          eventMouse.preventDefault()
          handleDropToAllDayByPointer(eventMouse.clientX)
        }}
      >
        <S.AllDayGridLines>
          {weekDays.map((dayMoment) => {
            const isSelectedDay = selectedDate ? dayMoment.isSame(selectedDate, 'day') : false
            return (
              <S.AllDayGridLineCell
                key={`all-day-line-${dayMoment.format('YYYY-MM-DD')}`}
                $isSelected={isSelectedDay}
                onClick={(eventMouse) => {
                  const nextDate = dayMoment.toDate()
                  onSelectDate?.(nextDate)
                  if (eventMouse.detail === 2) {
                    onDoubleClickDate?.(nextDate)
                  }
                }}
                onDragOver={(eventMouse) => {
                  eventMouse.preventDefault()
                }}
                onDrop={(eventMouse) => {
                  eventMouse.preventDefault()
                  handleDropToAllDayByPointer(eventMouse.clientX)
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
                aria-label={buildEventAriaLabel(segment.event)}
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
                draggable
                onDragStart={(eventMouse) => {
                  eventMouse.stopPropagation()
                  eventMouse.dataTransfer.effectAllowed = 'move'
                  setDraggingEventKey(segment.key)
                }}
                onDragEnd={clearDraggingEvent}
              >
                {isTodo ? (
                  <TodoCheckbox
                    type="checkbox"
                    checked={isDone}
                    onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
                    onKeyDown={(eventKey) => eventKey.stopPropagation()}
                    onClick={(eventClick) => eventClick.stopPropagation()}
                    onChange={(eventChange) => {
                      eventChange.stopPropagation()
                      onToggleTodo?.(segment.event.id)
                    }}
                  />
                ) : segment.event.isShared ? (
                  <People
                    aria-hidden="true"
                    focusable="false"
                    width={10}
                    height={12}
                    color={palette.point ?? 'transparent'}
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
                aria-label={buildEventAriaLabel(event)}
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
                draggable
                onDragStart={(eventMouse) => {
                  eventMouse.stopPropagation()
                  eventMouse.dataTransfer.effectAllowed = 'move'
                  setDraggingEventKey(getEventOccurrenceKey(event))
                }}
                onDragEnd={clearDraggingEvent}
              >
                <S.EventHeader>
                  {isTodo ? (
                    <TodoCheckbox
                      type="checkbox"
                      checked={isDone}
                      onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
                      onKeyDown={(eventKey) => eventKey.stopPropagation()}
                      onClick={(eventClick) => eventClick.stopPropagation()}
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
              onClick={(eventMouse) => {
                onSelectDate?.(dayDate)
                if (eventMouse.detail === 2) {
                  onDoubleClickDate?.(dayDate)
                }
              }}
              onDragOver={(eventMouse) => {
                eventMouse.preventDefault()
              }}
              onDrop={(eventMouse) => {
                eventMouse.preventDefault()
                handleDropToDate(dayDate, false)
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
