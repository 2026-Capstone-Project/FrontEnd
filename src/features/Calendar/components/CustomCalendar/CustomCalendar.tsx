/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Calendar, type DateCellWrapperProps, momentLocalizer } from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import {
  useCalendarApiEvents,
  useCalendarCreateHandlers,
  useCalendarDateRange,
  useCalendarDayViewTiming,
  useCalendarDraftEvent,
  useCalendarDragDrop,
  useCalendarKeyDelete,
  useCalendarModal,
  useCalendarNavigation,
  useCalendarRbcProps,
  useCalendarResponsive,
  useCalendarSelection,
  useCalendarTodoTimingPatch,
  useDayViewHandlers,
  useStoredCalendarView,
} from '@/features/Calendar/hooks'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import {
  getEventOccurrenceScope,
  getEventScopeFromEditOption,
  getTodoScopeFromEditOption,
} from '@/features/Calendar/utils/helpers/calendarRecurrenceScope'
import { getEventOccurrenceKey } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EditConfirmOption } from '@/shared/ui/Modals'

import CalendarModals from './CalendarModals'
import * as S from './CustomCalendar.style'
import CustomCalendarDialogs from './CustomCalendarDialogs'
import CustomCalendarMobileActions from './CustomCalendarMobileActions'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)
export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

type CustomCalendarProps = {
  onSelectedDateChange?: (selectedDate: Date) => void
}

const CustomCalendar = ({ onSelectedDateChange }: CustomCalendarProps) => {
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
  const { patchTodoTiming } = useCalendarTodoTimingPatch({ patchTodoMutate })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    eventId: CalendarEvent['id'] | null
    title: string
    occurrenceDate: string
  }>({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  const [recurringDropConfirm, setRecurringDropConfirm] = useState<{
    isOpen: boolean
    target: 'event' | 'todo'
    args: EventInteractionArgs<CalendarEvent> | null
  }>({ isOpen: false, target: 'event', args: null })
  // 로컬 캘린더 이벤트 상태 및 동작
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
    updateEventShared,
    toggleEventDone,
    removeEvent,
  } = useCalendarEvents({ initialEvents: apiEvents })

  // Todo 완료 토글
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

  // 반응형 레이아웃 판단
  const isDesktop = useCalendarResponsive()
  const isInlineMode = isDesktop
  // 일정 삭제(반복 여부 포함)
  const handleRemoveEvent = useCallback(
    (eventId: CalendarEvent['id'], occurrenceDate: string, isRecurring: boolean) => {
      const params = {
        ...(isRecurring ? { scope: getEventOccurrenceScope(isRecurring) } : {}),
        occurrenceDate: moment(occurrenceDate).format('YYYY-MM-DDTHH:mm:ss'),
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

  // 반복 일정/할 일 판정
  const isRecurring = useCallback(
    (eventId: CalendarEvent['id']) => {
      const target = events.find((eventItem) => eventItem.id === eventId)
      if (!target) return false
      if (target.type === 'todo') {
        return Boolean(target.isRecurring)
      }
      return target.recurrenceGroup != null
    },
    [events],
  )

  // 모달 상태/핸들러
  const { modal, modalDate, isModalEditing, handleAddEvent, handleEventClick, handleCloseModal } =
    useCalendarModal({
      currentDate: date,
      removeEvent: handleRemoveEvent,
      isRecurring,
    })

  const handleOpenEventFromCalendar = useCallback(
    (event: CalendarEvent) => {
      if (!isModalEditing && modal.isOpen && modal.eventId != null) {
        removeEvent(modal.eventId)
      }
      handleEventClick(event)
    },
    [handleEventClick, isModalEditing, modal.eventId, modal.isOpen, removeEvent],
  )

  // 선택 상태 관리
  const {
    selectedDate,
    setSelectedDate,
    selectedEventId,
    setSelectedEventId,
    selectedEventKey,
    setSelectedEventKey,
    clearSelection,
    selectEvent,
    selectEventOnly,
  } = useCalendarSelection({
    onOpenEvent: handleOpenEventFromCalendar,
  })

  const { handleCloseModalWithCleanup, enqueueDraftEvent } = useCalendarDraftEvent({
    events,
    isModalEditing,
    modal,
    removeEvent,
    handleCloseModal,
    enqueueEvent,
    updateEventTiming,
  })

  // 반복 삭제 확인 모달 닫기
  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  }, [])

  const { handleDayViewEventTimeChange, handleDayViewEventTimePreview } = useCalendarDayViewTiming({
    events,
    patchEventMutate,
    patchTodoTiming,
    updateLocalEventTime,
  })

  // 키보드 삭제(Backspace) 처리
  useCalendarKeyDelete({
    isModalOpen: modal.isOpen,
    date,
    events,
    selectedEventId,
    selectedEventKey,
    selectedDate,
    onClearSelection: clearSelection,
    onOpenRecurringConfirm: ({ eventId, title, occurrenceDate }) =>
      setDeleteConfirm({
        isOpen: true,
        eventId,
        title,
        occurrenceDate,
      }),
    onRemoveEvent: handleRemoveEvent,
    onDeleteTodo: deleteTodoMutate,
  })

  // 뷰/날짜 이동 처리
  const { onView, onNavigate, onSelectDate } = useCalendarNavigation({
    view,
    date,
    isDesktop,
    setView,
    setDate,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
  })

  // 슬롯 선택 및 일간 뷰 생성 처리
  const { handleDayViewCreateEvent, handleSelectSlotWrapper } = useCalendarCreateHandlers({
    view,
    enqueueEvent: enqueueDraftEvent,
    onAddEvent: handleAddEvent,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
  })
  const handleWeekViewCreateEvent = useCallback(
    (slotDate: Date) => {
      const start = moment(slotDate).startOf('day').set({ hour: 9, minute: 0, second: 0 }).toDate()
      const createdId = enqueueDraftEvent(start, false)
      if (createdId != null) {
        handleAddEvent(start, createdId)
      }
    },
    [enqueueDraftEvent, handleAddEvent],
  )
  const handleWeekViewSelectDate = useCallback(
    (nextDate: Date) => {
      setSelectedDate(nextDate)
      setSelectedEventId(null)
      setSelectedEventKey(null)
    },
    [setSelectedDate, setSelectedEventId, setSelectedEventKey],
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
    onEventSelect: selectEventOnly,
    onEventClick: undefined,
    onEventDoubleClick: selectEvent,
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
    [setDate, setSelectedEventId, setSelectedEventKey],
  )

  // drag & drop 처리
  const { handleEventDrop, applyEventDrop } = useCalendarDragDrop({
    view,
    moveEvent,
    patchEventMutate,
    patchTodoTiming,
    onRequireRecurringDropConfirm: (args, target) => {
      setRecurringDropConfirm({ isOpen: true, target, args })
    },
  })
  const handleCloseRecurringDropConfirm = useCallback(() => {
    setRecurringDropConfirm({ isOpen: false, target: 'event', args: null })
  }, [])
  const handleConfirmRecurringDrop = useCallback(
    (option: EditConfirmOption) => {
      if (!recurringDropConfirm.args) return
      if (recurringDropConfirm.target === 'todo') {
        applyEventDrop(recurringDropConfirm.args, { todoScope: getTodoScopeFromEditOption(option) })
        handleCloseRecurringDropConfirm()
        return
      }
      applyEventDrop(recurringDropConfirm.args, { eventScope: getEventScopeFromEditOption(option) })
      handleCloseRecurringDropConfirm()
    },
    [
      applyEventDrop,
      handleCloseRecurringDropConfirm,
      recurringDropConfirm.args,
      recurringDropConfirm.target,
    ],
  )

  // react-big-calendar props 구성
  const { calendarProps } = useCalendarRbcProps({
    view,
    date,
    events,
    selectedEventKey,
    effectiveSelectedDate: selectedDate,
    onView,
    onNavigate,
    onSelectDate,
    onSelectEvent: selectEvent,
    onSelectEventOnly: selectEventOnly,
    onDoubleClickEvent: selectEvent,
    onDoubleClickDate: handleWeekViewCreateEvent,
    onSelectWeekDate: handleWeekViewSelectDate,
    onToggleTodo: handleToggleTodo,
    onSelectSlot: handleSelectSlotWrapper,
    onEventDrop: handleEventDrop,
    onEventResize: resizeEvent,
    dateCellWrapper: DateCellWrapper,
    dayViewComponent: dayViewWithHandlers,
    localizer,
  })

  // 모달에 넘길 이벤트 조회
  const modalEvent = useMemo(() => {
    if (modal.eventId == null) return null

    const selectedOccurrenceEvent =
      selectedEventKey != null
        ? (events.find((item) => getEventOccurrenceKey(item) === selectedEventKey) ?? null)
        : null

    if (selectedOccurrenceEvent && selectedOccurrenceEvent.id === modal.eventId) {
      return selectedOccurrenceEvent
    }

    return events.find((item) => item.id === modal.eventId) ?? null
  }, [events, modal.eventId, selectedEventKey])
  const modalMode: 'modal' | 'inline' = isInlineMode ? 'inline' : 'modal'
  // 이벤트 수정 핸들러 묶음
  const eventActions = useMemo(
    () => ({
      onEventColorChange: updateEventColor,
      onEventTitleConfirm: updateEventTitle,
      onEventSharedChange: updateEventShared,
      onEventTypeChange: updateEventType,
      onEventTimingChange: updateEventTiming,
    }),
    [updateEventColor, updateEventShared, updateEventTitle, updateEventType, updateEventTiming],
  )
  useEffect(() => {
    onSelectedDateChange?.(selectedDate ?? date)
  }, [date, onSelectedDateChange, selectedDate])

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <CustomCalendarMobileActions
        view={view}
        onView={onView}
        currentDate={date}
        onAddEvent={handleAddEvent}
      />
      <S.CalendarWrapper view={view}>
        <DragAndDropCalendar {...calendarProps} />
      </S.CalendarWrapper>
      <CalendarModals
        modalDate={modalDate}
        modalEventId={modal.eventId}
        modalEvent={modalEvent}
        isModalEditing={isModalEditing}
        modalMode={modalMode}
        onCloseModal={handleCloseModalWithCleanup}
        eventActions={eventActions}
      />
      <CustomCalendarDialogs
        deleteConfirm={deleteConfirm}
        onCloseDeleteConfirm={handleCloseDeleteConfirm}
        deleteEventMutate={deleteEventMutate}
        recurringDropConfirm={recurringDropConfirm}
        onCloseRecurringDropConfirm={handleCloseRecurringDropConfirm}
        onConfirmRecurringDrop={handleConfirmRecurringDrop}
      />
    </div>
  )
}

export default CustomCalendar
