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
import { getEventOccurrenceKey } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import { getViewConfig } from '@/features/Calendar/utils/viewConfig'
import Plus from '@/shared/assets/icons/plus.svg?react'
import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
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

  const { usePatchEvent, useDeleteEvent } = useCalendarMutation()
  const { mutate: patchEventMutate } = usePatchEvent()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const { usePatchCompleteTodo, usePatchTodo, useDeleteTodo } = useTodoMutations()
  const { mutate: patchCompleteTodoMutate } = usePatchCompleteTodo()
  const { mutate: patchTodoMutate } = usePatchTodo()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<CalendarEvent['id'] | null>(null)
  const [selectedEventKey, setSelectedEventKey] = useState<string | null>(null)
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
    removeEvent,
  } = useCalendarEvents({ initialEvents: apiEvents })

  const handleToggleTodo = useCallback(
    (eventId: CalendarEvent['id']) => {
      const target = events.find(
        (eventItem) => eventItem.id === eventId && eventItem.type === 'todo',
      )
      if (!target || target.type !== 'todo') {
        return
      }
      const nextCompleted = !target.isDone
      toggleEventDone(eventId, 'todo')
      const occurrenceDate = moment(target.start).format('YYYY-MM-DD')
      patchCompleteTodoMutate({
        todoId: eventId,
        occurrenceDate,
        isCompleted: nextCompleted,
      })
    },
    [events, patchCompleteTodoMutate, toggleEventDone],
  )

  const patchTodoTiming = useCallback(
    (todoEvent: CalendarEvent, start: Date) => {
      const startDate = moment(start).format('YYYY-MM-DD')
      const dueTime = todoEvent.isAllDay ? undefined : moment(start).format('HH:mm')
      patchTodoMutate({
        todoId: todoEvent.id,
        occurrenceDate: startDate,
        requestBody: {
          startDate,
          dueTime,
          isAllDay: todoEvent.isAllDay,
        },
      })
    },
    [patchTodoMutate],
  )

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

  const handleCloseModalWithCleanup = useCallback(() => {
    if (!isModalEditing && modal.eventId != null) {
      removeEvent(modal.eventId)
    }
    handleCloseModal()
  }, [handleCloseModal, isModalEditing, modal.eventId, removeEvent])

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  }, [])

  const handleDayViewEventTimeChange = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, type?: CalendarEvent['type']) => {
      updateLocalEventTime(eventId, start, end, type)
      if (type === 'todo') {
        const todoEvent = events.find(
          (eventItem) => eventItem.id === eventId && eventItem.type === 'todo',
        )
        if (todoEvent) {
          patchTodoTiming(todoEvent, start)
        }
        return
      }
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
    [events, patchEventMutate, patchTodoTiming, updateLocalEventTime],
  )

  const handleDayViewEventTimePreview = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, type?: CalendarEvent['type']) => {
      updateLocalEventTime(eventId, start, end, type)
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
      const selectedEvent =
        selectedEventKey != null
          ? events.find((item) => getEventOccurrenceKey(item) === selectedEventKey)
          : events.find((item) => item.id === selectedEventId)
      if (!selectedEvent) return
      const baseDate =
        selectedDate ?? (selectedEvent.start ? normalizeDate(selectedEvent.start) : new Date(date))
      const isRecurringEvent = selectedEvent.recurrenceGroup != null
      event.preventDefault()
      if (selectedEvent.type === 'todo') {
        deleteTodoMutate({
          todoId: selectedEvent.id,
          occurrenceDate: moment(baseDate).format('YYYY-MM-DD'),
          scope: isRecurringEvent ? 'THIS_TODO' : undefined,
        })
        setSelectedEventId(null)
        setSelectedEventKey(null)
        setSelectedDate(null)
        return
      }
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
      setSelectedEventKey(null)
      setSelectedDate(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    date,
    deleteTodoMutate,
    events,
    handleRemoveEvent,
    modal.isOpen,
    selectedDate,
    selectedEventId,
    selectedEventKey,
  ])

  // 뷰 변경/이동 핸들러
  const getViewStartDate = useCallback((baseDate: Date, baseView: View) => {
    const base = moment(baseDate)
    if (baseView === Views.MONTH) {
      return base.startOf('month').toDate()
    }
    if (baseView === Views.WEEK) {
      return base.day(0).startOf('day').toDate() // Sunday
    }
    return base.startOf('day').toDate()
  }, [])

  const onView = useCallback(
    (newView: View) => {
      setView(newView)
      setSelectedDate(isDesktop ? getViewStartDate(date, newView) : null)
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    [date, getViewStartDate, isDesktop, setView],
  )

  const onNavigate = useCallback(
    (newDate: Date) => {
      setDate(newDate)
      setSelectedDate(isDesktop ? getViewStartDate(newDate, view) : null)
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    [getViewStartDate, isDesktop, view],
  )

  const { handleSelectSlot } = useCalendarCreateEvent({
    view,
    enqueueEvent,
    onCreated: (start, nextId) => {
      handleAddEvent(start, nextId)
    },
  })

  const handleDayViewCreateEvent = useCallback(
    (slotDate: Date) => {
      const startBase = moment(slotDate).set({ second: 0, millisecond: 0 })
      const snappedMinute = startBase.minute() < 30 ? 0 : 30
      const start = startBase.set({ minute: snappedMinute }).toDate()
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        handleAddEvent(start, createdId)
      }
    },
    [enqueueEvent, handleAddEvent],
  )

  const handleSelectSlotWrapper = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 더블클릭이면 기본 일정 생성
      const handled = handleSelectSlot(slotInfo)
      if (!handled) {
        setSelectedEventId(null)
        setSelectedEventKey(null)
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
      setSelectedEventKey(getEventOccurrenceKey(event))
      handleEventClick(event)
    },
    [handleEventClick],
  )

  // 선택 표시만 하고 모달은 열지 않기
  const handleSelectEventOnly = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
    setSelectedDate(normalizeDate(event.start))
    setSelectedEventKey(getEventOccurrenceKey(event))
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
    setSelectedEventKey(null)
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
    clearSelectedEvent: () => {
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    enqueueEvent,
    handleAddEvent,
    updateEventTime: handleDayViewEventTimeChange,
    updateEventTimePreview: handleDayViewEventTimePreview,
    onCreateEvent: handleDayViewCreateEvent,
    onToggleTodo: handleToggleTodo,
    selectedEventKey,
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
          setSelectedEventKey(null)
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
            onToggleTodo={handleToggleTodo}
            isSelected={getEventOccurrenceKey(props.event) === selectedEventKey}
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
            onToggleTodo={handleToggleTodo}
            isSelected={getEventOccurrenceKey(props.event) === selectedEventKey}
          />
        ),
      }
    }
    return {}
  }, [view, handleSelectEvent, handleToggleTodo, selectedEventKey, handleSelectEventOnly])

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
      if (event.type === 'todo') {
        patchTodoTiming(event, start as Date)
        return
      }
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
    [moveEvent, patchEventMutate, patchTodoTiming, view],
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
        onEventResize: view === Views.DAY ? undefined : resizeEvent,
        onSelectSlot: handleSelectSlotWrapper,
        dayPropGetter,
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
  const modalEvent = useMemo(() => {
    if (selectedEventKey) {
      return events.find((item) => getEventOccurrenceKey(item) === selectedEventKey) ?? null
    }
    return modal.eventId == null ? null : (events.find((item) => item.id === modal.eventId) ?? null)
  }, [events, modal.eventId, selectedEventKey])
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
        onCloseModal={handleCloseModalWithCleanup}
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
