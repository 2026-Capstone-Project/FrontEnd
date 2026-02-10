/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useMemo, useState } from 'react'
import {
  Calendar,
  type DateCellWrapperProps,
  type EventProps,
  momentLocalizer,
  type SlotInfo,
  type View,
  Views,
} from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import CustomToolbar from '@/features/Calendar/components/CalendarToolbar/CalendarToolbar'
import CustomWeekView from '@/features/Calendar/components/CustomView/CustomWeekView'
import {
  useCalendarApiEvents,
  useCalendarCreateEvent,
  useCalendarDateRange,
  useCalendarModal,
  useCalendarPortals,
  useCalendarResponsive,
  useStoredCalendarView,
} from '@/features/Calendar/hooks'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import { useDayViewHandlers } from '@/features/Calendar/hooks/useDayViewHandlers'
import {
  getDayPropStyle,
  normalizeDate,
} from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getViewConfig } from '@/features/Calendar/utils/viewConfig'
import Plus from '@/shared/assets/icons/plus.svg?react'
import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { theme } from '@/shared/styles/theme'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import CalendarHeader from '../CalendarDateHeader/CalendarDateHeader'
import { CustomMonthEvent, CustomMonthShowMore, CustomWeekEvent } from '../CustomEvent'
import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import CalendarModals from './CalendarModals'
import { buildCalendarConfig } from './config'
import * as S from './CustomCalendar.style'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)
export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

const CustomCalendar = () => {
  // 사용자 뷰 상태(월/주/일) 저장
  const { view, setView } = useStoredCalendarView()
  const [date, setDate] = useState<Date>(new Date())
  // 현재 뷰 기준으로 서버 조회 범위 계산
  const { startDate, endDate } = useCalendarDateRange(view, date)
  // 서버 일정 목록 조회
  const { events: apiEvents, refetch: refetchEvents } = useCalendarApiEvents(startDate, endDate)
  const { usePatchEvent } = useCalendarMutation()
  const { mutate: patchEventMutate } = usePatchEvent()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<CalendarEvent['id'] | null>(null)
  const {
    events,
    addEvent: enqueueEvent,
    moveEvent,
    resizeEvent,
    updateEventTime,
    updateEventColor,
    updateEventTiming,
    updateEventType,
    updateEventTitle,
    toggleEventDone,
    removeEvent,
  } = useCalendarEvents({ initialEvents: apiEvents })

  // 반응형 레이아웃 판단
  const isDesktop = useCalendarResponsive()
  const isInlineMode = isDesktop
  const { modalPortalRoot, cardPortalRoot } = useCalendarPortals()
  const { modal, modalDate, isModalEditing, handleAddEvent, handleEventClick, handleCloseModal } =
    useCalendarModal({
      currentDate: date,
      removeEvent,
    })

  // 뷰 변경/이동 핸들러
  const onView = useCallback((newView: View) => setView(newView), [setView])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate])

  const { handleSelectSlot } = useCalendarCreateEvent({
    view,
    refetchEvents,
    onCreated: (start, nextId) => {
      handleAddEvent(start, nextId)
    },
  })

  const handleSelectSlotWrapper = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 더블클릭이면 기본 일정 생성
      const handled = handleSelectSlot(slotInfo)
      if (!handled) {
        setSelectedDate(slotInfo.start)
      } else {
        setSelectedDate(null)
      }
    },
    [handleSelectSlot],
  )

  // 이벤트 선택 시 상세 모달 열기
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEventId(event.id)
      handleEventClick(event)
    },
    [handleEventClick],
  )

  // 선택 표시만 하고 모달은 열지 않기
  const handleSelectEventOnly = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
  }, [])
  /** 선택된 날짜에 배경 강조 스타일을 적용하도록 props를 반환합니다. */
  const effectiveSelectedDate = useMemo(
    () => (isInlineMode ? (selectedDate ?? date) : selectedDate),
    [date, isInlineMode, selectedDate],
  )
  const dayPropGetter = useCallback(
    (calendarDate: Date) => getDayPropStyle(calendarDate, effectiveSelectedDate),
    [effectiveSelectedDate],
  )

  // 헤더 날짜 클릭 시 달력 날짜 이동
  const handleSelectDate = useCallback((next: Date) => setDate(next), [])
  const viewConfig = useMemo(
    () =>
      getViewConfig(view, {
        onAddHeader: handleSelectDate,
      }),
    [view, handleSelectDate],
  )
  // 일간뷰 전용 핸들러 주입
  const dayViewWithHandlers = useDayViewHandlers({
    clearSelectedDate: () => setSelectedDate(null),
    clearSelectedEvent: () => setSelectedEventId(null),
    enqueueEvent,
    handleAddEvent,
    updateEventTime,
    onToggleTodo: toggleEventDone,
    selectedEventId,
    onEventSelect: handleSelectEventOnly,
    onEventClick: modal.isOpen ? handleSelectEvent : undefined,
    onEventDoubleClick: handleSelectEvent,
  })

  // 날짜 셀 클릭 시 날짜 이동(기본 이벤트 전파 제어)
  const DateCellWrapper = useCallback(
    ({ value, children }: DateCellWrapperProps) =>
      cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          event.stopPropagation()
          setDate(value)
          if (typeof children.props.onClick === 'function') {
            children.props.onClick(event)
          }
        },
      }),
    [setDate],
  )

  // 뷰별 이벤트 렌더러 선택
  const viewEventComponent = useMemo(() => {
    if (view === Views.MONTH) {
      return {
        event: (props: EventProps<CalendarEvent>) => (
          <CustomMonthEvent
            {...props}
            onEventClick={handleSelectEvent}
            onToggleTodo={toggleEventDone}
          />
        ),
      }
    }
    if (view === Views.WEEK) {
      return {
        event: (props: EventProps<CalendarEvent>) => (
          <CustomWeekEvent
            event={props.event}
            onEventClick={handleSelectEvent}
            onToggleTodo={toggleEventDone}
            isSelected={props.event.id === selectedEventId}
          />
        ),
      }
    }
    return {}
  }, [view, handleSelectEvent, toggleEventDone, selectedEventId])

  // 캘린더 컴포넌트/헤더/더보기 구성
  const mergedComponents = useMemo(
    () => ({
      toolbar: CustomToolbar,

      ...(view === Views.DAY ? {} : viewConfig.components),
      ...viewEventComponent,
      dateCellWrapper: DateCellWrapper,
      dateHeader: ({ label, date }: { label: string; date: Date }) => (
        <CalendarHeader label={label} date={date} onClick={() => setSelectedDate(date)} />
      ),
      showMore: CustomMonthShowMore,
    }),
    [view, viewConfig.components, viewEventComponent, DateCellWrapper],
  )

  // 캘린더 뷰 구성
  const calendarViews = useMemo(
    () => ({
      month: true,
      week: CustomWeekView,
      day: dayViewWithHandlers,
    }),
    [dayViewWithHandlers],
  )

  // 캘린더에 전달할 props 정리
  const handleEventDrop = useCallback(
    (args: EventInteractionArgs<CalendarEvent>) => {
      moveEvent(args)
      if (view !== Views.MONTH && view !== Views.WEEK) return
      const { event, start, end } = args
      const nextStart = moment(start).format('YYYY-MM-DDTHH:mm')
      const nextEnd = moment(end).format('YYYY-MM-DDTHH:mm')
      patchEventMutate({
        eventId: event.id,
        eventData: {
          startTime: nextStart,
          endTime: nextEnd,
          isAllDay: event.isAllDay ?? false,
          occurrenceDate: nextStart,
        },
      })
    },
    [moveEvent, patchEventMutate, view],
  )

  // react-big-calendar 렌더링용으로 Date 타입을 보장한 이벤트 목록
  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        start: normalizeDate(event.start),
        end: normalizeDate(event.end),
      })),
    [events],
  )

  const calendarProps = useMemo(
    () =>
      buildCalendarConfig({
        localizer,
        views: calendarViews,
        view,
        date,
        events: calendarEvents,
        onView,
        onNavigate,
        onSelectEvent: handleSelectEvent,
        onEventDrop: handleEventDrop,
        onEventResize: resizeEvent,
        onSelectSlot: handleSelectSlotWrapper,
        dayPropGetter,
        components: mergedComponents,
        viewConfig,
      }),
    [
      calendarViews,
      view,
      date,
      calendarEvents,
      onView,
      onNavigate,
      handleSelectEvent,
      handleEventDrop,
      resizeEvent,
      handleSelectSlotWrapper,
      dayPropGetter,
      mergedComponents,
      viewConfig,
    ],
  )

  // 인라인 모드에서는 선택 날짜 유지
  // 모달에 넘길 이벤트 조회
  const modalEvent = useMemo(
    () =>
      modal.eventId == null ? null : (events.find((item) => item.id === modal.eventId) ?? null),
    [events, modal.eventId],
  )
  const modalMode: 'modal' | 'inline' = isInlineMode ? 'inline' : 'modal'
  // 이벤트 수정 핸들러 묶음
  const eventActions = useMemo(
    () => ({
      onEventColorChange: updateEventColor,
      onEventTitleConfirm: updateEventTitle,
      onEventTypeChange: updateEventType,
      onEventTimingChange: updateEventTiming,
    }),
    [updateEventColor, updateEventTitle, updateEventType, updateEventTiming],
  )
  const eventCardDate = effectiveSelectedDate ?? date

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <S.MobileButtons>
        <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
        <button className="add-button" onClick={() => handleAddEvent()} type="button">
          <Plus height={20} width={20} color={theme.colors.primary} />
        </button>
      </S.MobileButtons>
      <S.CalendarWrapper view={view}>
        <DragAndDropCalendar {...calendarProps} />
      </S.CalendarWrapper>
      <CalendarModals
        modalDate={modalDate}
        modalEventId={modal.eventId}
        modalEvent={modalEvent}
        isModalEditing={isModalEditing}
        isModalOpen={modal.isOpen}
        isInlineMode={isInlineMode}
        modalMode={modalMode}
        modalPortalRoot={modalPortalRoot}
        cardPortalRoot={cardPortalRoot}
        eventCardDate={eventCardDate}
        showEventCard={isInlineMode ? true : selectedDate != null}
        onCloseModal={handleCloseModal}
        onCloseEventCard={() => setSelectedDate(null)}
        eventActions={eventActions}
      />
    </div>
  )
}

export default CustomCalendar
