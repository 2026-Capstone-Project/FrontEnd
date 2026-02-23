// 훅: react-big-calendar 설정/컴포넌트/props를 생성합니다.
import moment from 'moment'
import type { ComponentProps, ComponentType } from 'react'
import { useMemo } from 'react'
import type {
  DateCellWrapperProps,
  DateLocalizer,
  EventProps,
  SlotInfo,
  View,
  ViewStatic,
} from 'react-big-calendar'
import { Views } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import CalendarHeader from '@/features/Calendar/components/CalendarDateHeader/CalendarDateHeader'
import CustomToolbar from '@/features/Calendar/components/CalendarToolbar/CalendarToolbar'
import { CustomMonthEvent, CustomMonthShowMore } from '@/features/Calendar/components/CustomEvent'
import CustomWeekView from '@/features/Calendar/components/CustomView/CustomWeekView'
import {
  getDayPropStyle,
  normalizeDate,
} from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getEventOccurrenceKey } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import { getViewConfig } from '@/features/Calendar/utils/viewConfig'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import { buildCalendarConfig } from '../domain/config'

type UseCalendarRbcPropsArgs = {
  view: View
  date: Date
  events: CalendarEvent[]
  selectedEventKey: string | null
  effectiveSelectedDate: Date | null
  onView: (view: View) => void
  onNavigate: (date: Date) => void
  onSelectDate: (date: Date) => void
  onSelectWeekDate: (date: Date) => void
  onSelectEvent: (event: CalendarEvent) => void
  onSelectEventOnly: (event: CalendarEvent) => void
  onDoubleClickEvent: (event: CalendarEvent) => void
  onDoubleClickDate: (date: Date) => void
  onToggleTodo: (eventId: CalendarEvent['id']) => void
  onSelectSlot: (slotInfo: SlotInfo) => void
  onEventDrop: (args: EventInteractionArgs<CalendarEvent>) => void
  onEventResize: (args: EventInteractionArgs<CalendarEvent>) => void
  dateCellWrapper: ComponentType<DateCellWrapperProps>
  dayViewComponent: ComponentType & ViewStatic
  localizer: DateLocalizer
}

export const useCalendarRbcProps = ({
  view,
  date,
  events,
  selectedEventKey,
  effectiveSelectedDate,
  onView,
  onNavigate,
  onSelectDate,
  onSelectWeekDate,
  onSelectEvent,
  onSelectEventOnly,
  onDoubleClickEvent,
  onDoubleClickDate,
  onToggleTodo,
  onSelectSlot,
  onEventDrop,
  onEventResize,
  dateCellWrapper,
  dayViewComponent,
  localizer,
}: UseCalendarRbcPropsArgs) => {
  // 선택된 날짜 기준으로 day 셀 스타일을 계산하는 함수 메모이제이션
  const dayPropGetter = useMemo(
    () => (calendarDate: Date) => getDayPropStyle(calendarDate, effectiveSelectedDate),
    [effectiveSelectedDate],
  )

  // 뷰별 설정(헤더 등) 구성
  const viewConfig = useMemo(
    () =>
      getViewConfig(view, {
        onAddHeader: onSelectDate,
      }),
    [onSelectDate, view],
  )

  // 월/주 뷰에서 사용할 커스텀 이벤트 컴포넌트 결정
  const viewEventComponent = useMemo(() => {
    if (view === Views.MONTH) {
      return {
        event: (props: EventProps<CalendarEvent>) => (
          <CustomMonthEvent
            {...props}
            onEventClick={onSelectEventOnly}
            onEventDoubleClick={onSelectEvent}
            onToggleTodo={onToggleTodo}
            isSelected={getEventOccurrenceKey(props.event) === selectedEventKey}
          />
        ),
      }
    }
    return {}
  }, [onSelectEvent, onSelectEventOnly, onToggleTodo, selectedEventKey, view])

  const weekViewWithHandlers = useMemo(() => {
    return Object.assign(
      (props: ComponentProps<typeof CustomWeekView>) => (
        <CustomWeekView
          {...props}
          selectedDate={effectiveSelectedDate}
          onToggleTodo={onToggleTodo}
          onSelectDate={onSelectWeekDate}
          onSelectEvent={onSelectEventOnly}
          onDoubleClickEvent={onSelectEvent}
          onDoubleClickDate={onDoubleClickDate}
          onEventDrop={onEventDrop}
          selectedEventKey={selectedEventKey}
        />
      ),
      {
        navigate: CustomWeekView.navigate,
        title: CustomWeekView.title,
      },
    ) as ComponentType & ViewStatic
  }, [
    effectiveSelectedDate,
    onDoubleClickDate,
    onEventDrop,
    onSelectEvent,
    onSelectEventOnly,
    onSelectWeekDate,
    onToggleTodo,
    selectedEventKey,
  ])

  // react-big-calendar components 병합 (툴바/헤더/이벤트 등)
  const mergedComponents = useMemo(
    () => ({
      toolbar: CustomToolbar,
      ...(view === Views.DAY ? {} : viewConfig.components),
      ...viewEventComponent,
      dateCellWrapper,
      dateHeader: ({ label, date: headerDate }: { label: string; date: Date }) => (
        <CalendarHeader label={label} date={headerDate} onClick={() => onSelectDate(headerDate)} />
      ),
      showMore: CustomMonthShowMore,
    }),
    [dateCellWrapper, onSelectDate, view, viewConfig.components, viewEventComponent],
  )

  // 사용할 뷰 목록 정의
  const calendarViews = useMemo(
    () => ({
      month: true,
      week: weekViewWithHandlers,
      day: dayViewComponent,
    }),
    [dayViewComponent, weekViewWithHandlers],
  )

  // 이벤트 날짜를 정규화해서 달력에 전달
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: normalizeDate(event.start),
        end: normalizeDate(event.end),
      })),
    [events],
  )

  // 주간 뷰에서 daySpan 계산을 커스터마이즈한 localizer 사용
  const resolvedLocalizer = useMemo(() => {
    if (view !== Views.WEEK) {
      return localizer
    }
    const nextLocalizer = Object.assign(
      Object.create(Object.getPrototypeOf(localizer)),
      localizer,
    ) as DateLocalizer & {
      daySpan?: (start: Date, end: Date) => number
    }
    nextLocalizer.daySpan = (start: Date, end: Date) => {
      const startDay = moment(start).startOf('day')
      const endDay = moment(end).startOf('day')
      const diff = endDay.diff(startDay, 'days')
      return diff + 1
    }
    return nextLocalizer
  }, [localizer, view])

  // 최종 calendar props 구성
  const calendarProps = useMemo(
    () =>
      buildCalendarConfig({
        localizer: resolvedLocalizer,
        views: calendarViews,
        view,
        date,
        events: calendarEvents,
        onView,
        onNavigate,
        onSelectEvent: view === Views.MONTH ? undefined : onSelectEventOnly,
        onDoubleClickEvent: view === Views.MONTH ? undefined : onDoubleClickEvent,
        onEventDrop,
        onEventResize: view === Views.DAY ? undefined : onEventResize,
        onSelectSlot,
        dayPropGetter,
        // 월간 뷰에서는 현재 달 범위 밖의 이벤트를 숨김
        eventPropGetter:
          view === Views.MONTH
            ? (event) => {
                const start = moment(event.start)
                const end = moment(event.end)
                const monthStart = moment(date).startOf('month')
                const monthEnd = moment(date).endOf('month')
                const overlaps =
                  end.isSameOrAfter(monthStart, 'day') && start.isSameOrBefore(monthEnd, 'day')
                return overlaps ? {} : { style: { display: 'none' } }
              }
            : undefined,
        components: mergedComponents,
        viewConfig,
      }),
    [
      calendarEvents,
      calendarViews,
      date,
      dayPropGetter,
      mergedComponents,
      onDoubleClickEvent,
      onEventDrop,
      onEventResize,
      onNavigate,
      onSelectEventOnly,
      onSelectSlot,
      onView,
      resolvedLocalizer,
      view,
      viewConfig,
    ],
  )

  return { calendarProps }
}
