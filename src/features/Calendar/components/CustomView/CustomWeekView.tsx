import moment from 'moment'
import React from 'react'
import type { NavigateAction, ViewStatic } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import People from '@/assets/icons/people.svg?react'
import { getColorPalette } from '@/features/Calendar/utils/colorPalette'
import {
  getEventOccurrenceKey,
  isDateOnlyString,
} from '@/features/Calendar/utils/helpers/dayViewHelpers'
import {
  buildAllDaySegments,
  buildWeekDays,
  buildWeekDropRange,
  getAllDayLaneCount,
  getDropDayIndex,
  getTimedEventsForDate,
  getWeeklyAllDayEvents,
  KOREAN_WEEKDAYS,
} from '@/features/Calendar/utils/weekViewLayout'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import { TodoCheckbox } from '../CustomEvent/CustomEvent.style'
import * as S from './weekView'

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
  const weekDays = React.useMemo(() => buildWeekDays(date), [date])
  const weekDayDates = React.useMemo(
    () => weekDays.map((dayMoment) => dayMoment.toDate()),
    [weekDays],
  )
  const allDaySectionRef = React.useRef<HTMLElement | null>(null)
  const today = moment()
  const weeklyAllDayEvents = React.useMemo(() => getWeeklyAllDayEvents(events), [events])
  const allDaySegments = React.useMemo(
    () => buildAllDaySegments(weeklyAllDayEvents, weekDayDates),
    [weekDayDates, weeklyAllDayEvents],
  )
  const allDayLaneCount = React.useMemo(() => getAllDayLaneCount(allDaySegments), [allDaySegments])
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

      const nextRange = buildWeekDropRange(draggingEvent, targetDate, dropAsAllDay)

      onEventDrop({
        event: draggingEvent,
        start: nextRange.start,
        end: nextRange.end,
        allDay: nextRange.allDay,
      } as EventInteractionArgs<CalendarEvent>)
    },
    [draggingEventKey, eventsByOccurrenceKey, onEventDrop],
  )
  const handleDropToAllDayByPointer = React.useCallback(
    (clientX: number) => {
      const sectionRect = allDaySectionRef.current?.getBoundingClientRect()
      if (!sectionRect || sectionRect.width <= 0) return
      const dayIndex = getDropDayIndex(clientX, sectionRect, weekDays.length)
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
          const timedEvents = getTimedEventsForDate(events, dayDate)

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
