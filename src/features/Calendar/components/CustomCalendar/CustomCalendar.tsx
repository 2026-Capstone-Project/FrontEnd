/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  type DateCellWrapperProps,
  type DateLocalizer,
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
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal/DeleteConfirmModal'

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
  const { usePatchEvent, useDeleteEvent, usePostEvent } = useCalendarMutation()
  const { mutate: patchEventMutate } = usePatchEvent()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const { mutate: postEventMutate } = usePostEvent()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<CalendarEvent['id'] | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    eventId: CalendarEvent['id'] | null
    title: string
    occurrenceDate: string
  }>({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  const {
    events,
    addEvent: enqueueEvent,
    moveEvent,
    resizeEvent,
    updateEventTime: updateLocalEventTime,
    updateEventColor,
    updateEventTiming,
    updateEventType,
    updateEventTitle,
    toggleEventDone,
  } = useCalendarEvents({ initialEvents: apiEvents })

  // 반응형 레이아웃 판단
  const isDesktop = useCalendarResponsive()
  const isInlineMode = isDesktop
  const { modalPortalRoot, cardPortalRoot } = useCalendarPortals()
  const handleRemoveEvent = useCallback(
    (eventId: CalendarEvent['id'], occurrenceDate: string, isRecurring: boolean) => {
      const params = {
        ...(isRecurring ? { scope: 'THIS_EVENT' as const } : {}),
        occurrenceDate: moment(occurrenceDate).format('YYYY-MM-DD'),
      }
      deleteEventMutate(
        {
          eventId,
          params,
        },
        {
          onSuccess: () => {
            refetchEvents()
          },
        },
      )
    },
    [deleteEventMutate, refetchEvents],
  )

  const isRecurring = useCallback(
    (eventId: CalendarEvent['id']) =>
      events.find((eventItem) => eventItem.id === eventId)?.recurrenceGroup != null,
    [events],
  )

  const { modal, modalDate, isModalEditing, handleAddEvent, handleEventClick, handleCloseModal } =
    useCalendarModal({
      currentDate: date,
      removeEvent: handleRemoveEvent,
      isRecurring,
    })

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  }, [])

  const handleDayViewEventTimeChange = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date) => {
      updateLocalEventTime(eventId, start, end)
      const nextStart = moment(start).format('YYYY-MM-DDTHH:mm')
      const nextEnd = moment(end).format('YYYY-MM-DDTHH:mm')
      patchEventMutate({
        eventId,
        eventData: {
          startTime: nextStart,
          endTime: nextEnd,
          isAllDay: false,
          occurrenceDate: nextStart,
        },
      })
    },
    [patchEventMutate, updateLocalEventTime],
  )

  const handleDayViewEventTimePreview = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date) => {
      updateLocalEventTime(eventId, start, end)
    },
    [updateLocalEventTime],
  )

  useEffect(() => {
    if (modal.isOpen) return undefined
    if (selectedEventId == null) return undefined
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Backspace') return
      const target = event.target as HTMLElement | null
      if (target) {
        const tagName = target.tagName
        const isEditable = tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable
        if (isEditable) return
      }
      const selectedEvent = events.find((item) => item.id === selectedEventId)
      if (!selectedEvent) return
      const baseDate =
        selectedDate ?? (selectedEvent.start ? normalizeDate(selectedEvent.start) : new Date(date))
      const isRecurringEvent = selectedEvent.recurrenceGroup != null
      event.preventDefault()
      if (isRecurringEvent) {
        setDeleteConfirm({
          isOpen: true,
          eventId: selectedEventId,
          title: selectedEvent.title ?? '',
          occurrenceDate: moment(baseDate).format('YYYY-MM-DD'),
        })
        return
      }
      handleRemoveEvent(selectedEventId, baseDate.toISOString(), false)
      setSelectedEventId(null)
      setSelectedDate(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [date, events, handleRemoveEvent, modal.isOpen, selectedDate, selectedEventId])

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

  const handleDayViewCreateEvent = useCallback(
    (slotDate: Date) => {
      const startBase = moment(slotDate).set({ second: 0, millisecond: 0 })
      const snappedMinute = startBase.minute() < 30 ? 0 : 30
      const start = startBase.set({ minute: snappedMinute }).toDate()
      const end = moment(start).add(1, 'hour').toDate()
      postEventMutate(
        {
          title: '새 일정',
          content: '',
          startTime: moment(start).format('YYYY-MM-DDTHH:mm'),
          endTime: moment(end).format('YYYY-MM-DDTHH:mm'),
          isAllDay: false,
        },
        {
          onSuccess: (response) => {
            const nextId = response?.result?.id ?? response?.id
            if (typeof nextId === 'number') {
              refetchEvents()
              handleAddEvent(slotDate, nextId)
            }
          },
        },
      )
    },
    [handleAddEvent, postEventMutate, refetchEvents],
  )

  const handleSelectSlotWrapper = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 더블클릭이면 기본 일정 생성
      const handled = handleSelectSlot(slotInfo)
      if (!handled) {
        setSelectedEventId(null)
        setSelectedDate(slotInfo.start)
      } else {
        setSelectedDate(slotInfo.start)
      }
    },
    [handleSelectSlot],
  )

  // 이벤트 선택 시 상세 모달 열기
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEventId(event.id)
      setSelectedDate(normalizeDate(event.start))
      handleEventClick(event)
    },
    [handleEventClick],
  )

  // 선택 표시만 하고 모달은 열지 않기
  const handleSelectEventOnly = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
    setSelectedDate(normalizeDate(event.start))
  }, [])

  const handleRbcSelectEvent = useCallback(
    (event: CalendarEvent) => {
      handleSelectEventOnly(event)
    },
    [handleSelectEventOnly],
  )

  const handleRbcDoubleClickEvent = useCallback(
    (event: CalendarEvent) => {
      handleSelectEvent(event)
    },
    [handleSelectEvent],
  )
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
  const handleSelectDate = useCallback((next: Date) => {
    setSelectedEventId(null)
    setDate(next)
  }, [])
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
    updateEventTime: handleDayViewEventTimeChange,
    updateEventTimePreview: handleDayViewEventTimePreview,
    onCreateEvent: handleDayViewCreateEvent,
    onToggleTodo: toggleEventDone,
    selectedEventId,
    onEventSelect: handleSelectEventOnly,
    onEventClick: undefined,
    onEventDoubleClick: handleSelectEvent,
  })

  // 날짜 셀 클릭 시 날짜 이동(기본 이벤트 전파 제어)
  const DateCellWrapper = useCallback(
    ({ value, children }: DateCellWrapperProps) =>
      cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          event.stopPropagation()
          setSelectedEventId(null)
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
            onEventClick={handleSelectEventOnly}
            onEventDoubleClick={handleSelectEvent}
            onToggleTodo={toggleEventDone}
            isSelected={props.event.id === selectedEventId}
          />
        ),
      }
    }
    if (view === Views.WEEK) {
      return {
        event: (props: EventProps<CalendarEvent>) => (
          <CustomWeekEvent
            event={props.event}
            onEventClick={handleSelectEventOnly}
            onEventDoubleClick={handleSelectEvent}
            onToggleTodo={toggleEventDone}
            isSelected={props.event.id === selectedEventId}
          />
        ),
      }
    }
    return {}
  }, [view, handleSelectEvent, toggleEventDone, selectedEventId, handleSelectEventOnly])

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
    // 주간뷰에서 2일 이상 걸치는 일정(날짜가 바뀌는 일정)을 멀티데이로 분류
    nextLocalizer.daySpan = (start: Date, end: Date) => {
      const startDay = moment(start).startOf('day')
      const endDay = moment(end).startOf('day')
      const diff = endDay.diff(startDay, 'days')
      return diff + 1
    }
    return nextLocalizer
  }, [view])

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
        onSelectEvent: view === Views.MONTH ? undefined : handleRbcSelectEvent,
        onDoubleClickEvent: view === Views.MONTH ? undefined : handleRbcDoubleClickEvent,
        onEventDrop: handleEventDrop,
        onEventResize: resizeEvent,
        onSelectSlot: handleSelectSlotWrapper,
        dayPropGetter,
        components: mergedComponents,
        viewConfig,
      }),
    [
      resolvedLocalizer,
      calendarViews,
      view,
      date,
      calendarEvents,
      onView,
      onNavigate,
      handleRbcSelectEvent,
      handleRbcDoubleClickEvent,
      handleEventDrop,
      resizeEvent,
      dayPropGetter,
      mergedComponents,
      viewConfig,
      handleSelectSlotWrapper,
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
      {deleteConfirm.isOpen && deleteConfirm.eventId != null && (
        <DeleteConfirmModal
          onClose={handleCloseDeleteConfirm}
          title={deleteConfirm.title}
          eventId={deleteConfirm.eventId}
          occurrenceDate={deleteConfirm.occurrenceDate}
        />
      )}
    </div>
  )
}

export default CustomCalendar
