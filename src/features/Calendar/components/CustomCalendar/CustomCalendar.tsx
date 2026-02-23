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
  useCalendarDragDrop,
  useCalendarKeyDelete,
  useCalendarModal,
  useCalendarNavigation,
  useCalendarPortals,
  useCalendarRbcProps,
  useCalendarResponsive,
  useCalendarSelection,
  useDayViewHandlers,
  useStoredCalendarView,
} from '@/features/Calendar/hooks'
import { buildRecurringGroupForFutureDrop } from '@/features/Calendar/hooks/useCalendarDragDrop'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import {
  getEventOccurrenceKey,
  resolveOccurrenceDateTime,
} from '@/features/Calendar/utils/helpers/dayViewHelpers'
import { getDetailTodo } from '@/shared/api/todo/api'
import Plus from '@/shared/assets/icons/plus.svg?react'
import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import { theme } from '@/shared/styles/theme'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type {
  RecurrenceEventScope,
  RecurrenceTodoScope,
} from '@/shared/types/recurrence/recurrence'
import { EditConfirmModal, type EditConfirmOption } from '@/shared/ui/modal'
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal/DeleteConfirmModal'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import CalendarModals from './CalendarModals'
import * as S from './CustomCalendar.style'

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

  const resolveFutureTodoRecurrenceGroup = useCallback(
    async (todoId: number, occurrenceDate: string, nextStart: Date) => {
      try {
        // "이후 일정만 변경"일 때는 현재 occurrence 기준의 상세 recurrence를 받아
        // 드롭한 날짜(nextStart)에 맞는 recurrenceGroup으로 재계산해 patch에 포함합니다.
        const { result } = await getDetailTodo(todoId, occurrenceDate)
        return buildRecurringGroupForFutureDrop(result?.recurrenceGroup ?? null, nextStart)
      } catch (error) {
        console.error('[CustomCalendar] failed to resolve todo recurrenceGroup', error)
        return undefined
      }
    },
    [],
  )

  // Todo 일정 이동 시 시간 패치
  const patchTodoTiming = useCallback(
    (
      todoEvent: CalendarEvent,
      start: Date,
      options?: { scope?: RecurrenceTodoScope; occurrenceDate?: string },
    ) => {
      const startDate = moment(start).format('YYYY-MM-DD')
      const occurrenceDate =
        options?.occurrenceDate ??
        moment(todoEvent.occurrenceDate ?? todoEvent.start).format('YYYY-MM-DD')
      const patchScope = options?.scope ?? (todoEvent.isRecurring ? 'THIS_TODO' : undefined)
      const dueTime = todoEvent.isAllDay ? undefined : moment(start).format('HH:mm')
      const submitPatch = (recurrenceGroup?: CalendarEvent['recurrenceGroup']) => {
        patchTodoMutate({
          todoId: todoEvent.id,
          occurrenceDate,
          ...(patchScope ? { scope: patchScope } : {}),
          requestBody: {
            startDate,
            dueTime,
            isAllDay: todoEvent.isAllDay,
            ...(recurrenceGroup ? { recurrenceGroup } : {}),
          },
        })
      }

      if (patchScope === 'THIS_AND_FOLLOWING') {
        // 반복 할 일을 "이후 항목" 범위로 이동한 경우 recurrenceGroup 보정이 필요합니다.
        void resolveFutureTodoRecurrenceGroup(todoEvent.id, occurrenceDate, start).then(
          (recurrenceGroup) => {
            submitPatch(recurrenceGroup)
          },
        )
        return
      }
      submitPatch()
    },
    [patchTodoMutate, resolveFutureTodoRecurrenceGroup],
  )

  // 반응형 레이아웃 판단
  const isDesktop = useCalendarResponsive()
  const isInlineMode = isDesktop
  const { modalPortalRoot, cardPortalRoot } = useCalendarPortals()
  // 일정 삭제(반복 여부 포함)
  const handleRemoveEvent = useCallback(
    (eventId: CalendarEvent['id'], occurrenceDate: string, isRecurring: boolean) => {
      const params = {
        ...(isRecurring ? { scope: 'THIS_EVENT' as const } : {}),
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
  const [openedModalMode, setOpenedModalMode] = useState<'modal' | 'inline' | null>(null)

  useEffect(() => {
    if (!modal.isOpen) {
      setOpenedModalMode(null)
      return
    }
    if (openedModalMode == null) {
      setOpenedModalMode(isInlineMode ? 'inline' : 'modal')
    }
  }, [isInlineMode, modal.isOpen, openedModalMode])

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
    onOpenEvent: handleEventClick,
  })

  // 모달 닫힘 시 임시 이벤트 정리
  const handleCloseModalWithCleanup = useCallback(() => {
    if (!isModalEditing && modal.eventId != null) {
      removeEvent(modal.eventId)
    }
    handleCloseModal()
  }, [handleCloseModal, isModalEditing, modal.eventId, removeEvent])

  const clearPendingDraftEvent = useCallback(() => {
    if (!modal.isOpen || isModalEditing || modal.eventId == null) return
    removeEvent(modal.eventId)
  }, [isModalEditing, modal.eventId, modal.isOpen, removeEvent])

  // 반복 삭제 확인 모달 닫기
  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  }, [])

  // 일간 뷰에서 시간 변경 확정 처리
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
      const nextEnd = moment(end).format('YYYY-MM-DDTHH:mm:ss')
      const targetEvent = events.find((eventItem) => eventItem.id === eventId)
      const occurrenceDate = resolveOccurrenceDateTime(
        targetEvent?.occurrenceDate,
        targetEvent?.start ?? start,
      )
      const patchScope = targetEvent?.recurrenceGroup != null ? ('THIS_EVENT' as const) : undefined
      patchEventMutate({
        eventId,
        params: {
          occurrenceDate,
          ...(patchScope ? { scope: patchScope } : {}),
        },
        eventData: {
          startTime: moment(start).format('YYYY-MM-DDTHH:mm:ss'),
          endTime: nextEnd,
          isAllDay: false,
        },
      })
    },
    [events, patchEventMutate, patchTodoTiming, updateLocalEventTime],
  )

  // 일간 뷰에서 시간 변경 미리보기
  const handleDayViewEventTimePreview = useCallback(
    (eventId: CalendarEvent['id'], start: Date, end: Date, type?: CalendarEvent['type']) => {
      updateLocalEventTime(eventId, start, end, type)
    },
    [updateLocalEventTime],
  )

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
    enqueueEvent,
    onAddEvent: handleAddEvent,
    onBeforeCreate: clearPendingDraftEvent,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
  })
  const handleWeekViewCreateEvent = useCallback(
    (slotDate: Date) => {
      clearPendingDraftEvent()
      const start = moment(slotDate).startOf('day').set({ hour: 9, minute: 0, second: 0 }).toDate()
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        handleAddEvent(start, createdId)
      }
    },
    [clearPendingDraftEvent, enqueueEvent, handleAddEvent],
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
        const todoScope: RecurrenceTodoScope =
          option === 'future' ? 'THIS_AND_FOLLOWING' : 'THIS_TODO'
        applyEventDrop(recurringDropConfirm.args, { todoScope })
        handleCloseRecurringDropConfirm()
        return
      }
      const eventScope: RecurrenceEventScope =
        option === 'future' ? 'THIS_AND_FOLLOWING_EVENTS' : 'THIS_EVENT'
      applyEventDrop(recurringDropConfirm.args, { eventScope })
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
    if (selectedEventKey) {
      const selectedOccurrenceEvent =
        events.find((item) => getEventOccurrenceKey(item) === selectedEventKey) ?? null
      if (selectedOccurrenceEvent) return selectedOccurrenceEvent
    }
    return modal.eventId == null ? null : (events.find((item) => item.id === modal.eventId) ?? null)
  }, [events, modal.eventId, selectedEventKey])
  const modalMode: 'modal' | 'inline' = openedModalMode ?? (isInlineMode ? 'inline' : 'modal')
  const isModalInlineMode = modalMode === 'inline'
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
  useEffect(() => {
    onSelectedDateChange?.(selectedDate ?? date)
  }, [date, onSelectedDateChange, selectedDate])

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      {/* 모바일 전용 헤더 버튼 */}
      <S.MobileButtons>
        <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
        <button className="add-button" onClick={() => handleAddEvent()} type="button">
          <Plus height={20} width={20} color={theme.colors.primary} />
        </button>
      </S.MobileButtons>
      {/* 캘린더 본문 */}
      <S.CalendarWrapper view={view}>
        <DragAndDropCalendar {...calendarProps} />
      </S.CalendarWrapper>
      {/* 모달/카드 영역 */}
      <CalendarModals
        modalDate={modalDate}
        modalEventId={modal.eventId}
        modalEvent={modalEvent}
        isModalEditing={isModalEditing}
        isInlineMode={isModalInlineMode}
        modalMode={modalMode}
        modalPortalRoot={modalPortalRoot}
        cardPortalRoot={cardPortalRoot}
        onCloseModal={handleCloseModalWithCleanup}
        eventActions={eventActions}
      />
      {/* 반복 일정 삭제 확인 */}
      {deleteConfirm.isOpen && deleteConfirm.eventId != null && (
        <DeleteConfirmModal
          onClose={handleCloseDeleteConfirm}
          title={deleteConfirm.title}
          target={{
            type: 'event',
            id: deleteConfirm.eventId,
            occurrenceDate: deleteConfirm.occurrenceDate,
          }}
          mutate={deleteEventMutate}
        />
      )}
      {recurringDropConfirm.isOpen && (
        <EditConfirmModal
          onCancel={handleCloseRecurringDropConfirm}
          onConfirm={handleConfirmRecurringDrop}
        />
      )}
    </div>
  )
}

export default CustomCalendar
