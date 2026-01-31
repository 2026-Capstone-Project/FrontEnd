/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  type DateCellWrapperProps,
  type EventProps,
  momentLocalizer,
  type SlotInfo,
  type View,
  Views,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import CustomToolbar from '@/features/Calendar/components/CalendarToolbar/CalendarToolbar'
import CustomWeekView from '@/features/Calendar/components/CustomView/CustomWeekView'
import type { CalendarEvent } from '@/features/Calendar/domain/types'
import {
  useCalendarModal,
  useCalendarPortals,
  useCalendarProps,
  useCalendarResponsive,
  useStoredCalendarView,
} from '@/features/Calendar/hooks'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import { useDayViewHandlers } from '@/features/Calendar/hooks/useDayViewHandlers'
import { getDayPropStyle } from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getViewConfig } from '@/features/Calendar/utils/viewConfig'
import Plus from '@/shared/assets/icons/plus.svg?react'
import { theme } from '@/shared/styles/theme'

import CalendarHeader from '../CalendarDateHeader/CalendarDateHeader'
import { CustomMonthEvent, CustomMonthShowMore, CustomWeekEvent } from '../CustomEvent'
import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import CalendarModals from './CalendarModals'
import * as S from './CustomCalendar.style'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)
export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

const CustomCalendar = () => {
  const { view, setView } = useStoredCalendarView()
  const [date, setDate] = useState<Date>(new Date())
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
  } = useCalendarEvents()
  const isDesktop = useCalendarResponsive()
  const { modalPortalRoot, cardPortalRoot } = useCalendarPortals()
  const { modal, modalDate, isModalEditing, handleAddEvent, handleEventClick, handleCloseModal } =
    useCalendarModal({
      currentDate: date,
      removeEvent,
    })

  const onView = useCallback((newView: View) => setView(newView), [setView])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 선택 날짜 설정 후 더블클릭이면 새 일정 추가
      if (slotInfo.action === 'doubleClick') {
        setSelectedDate(null)
        const isAllDaySlot = slotInfo.slots.length === 1
        const createdId = enqueueEvent(slotInfo.start, isAllDaySlot)
        handleAddEvent(slotInfo.start, createdId)
      } else {
        setSelectedDate(slotInfo.start)
      }
    },
    [enqueueEvent, handleAddEvent],
  )

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setSelectedEventId(event.id)
      handleEventClick(event)
    },
    [handleEventClick],
  )

  const handleSelectEventOnly = useCallback((event: CalendarEvent) => {
    setSelectedEventId(event.id)
  }, [])
  /** 선택된 날짜에 배경 강조 스타일을 적용하도록 props를 반환합니다. */
  const dayPropGetter = useCallback(
    (calendarDate: Date) => getDayPropStyle(calendarDate, selectedDate),
    [selectedDate],
  )

  const handleSelectDate = useCallback((next: Date) => setDate(next), [])
  const viewConfig = useMemo(
    () =>
      getViewConfig(view, {
        onAddHeader: handleSelectDate,
      }),
    [view, handleSelectDate],
  )
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

  const isInlineMode = isDesktop

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

  const calendarViews = useMemo(
    () => ({
      month: true,
      week: CustomWeekView,
      day: dayViewWithHandlers,
    }),
    [dayViewWithHandlers],
  )

  const calendarProps = useCalendarProps({
    localizer,
    views: calendarViews,
    view,
    date,
    events,
    onView,
    onNavigate,
    onSelectEvent: handleSelectEvent,
    onEventDrop: moveEvent,
    onEventResize: resizeEvent,
    onSelectSlot: handleSelectSlot,
    dayPropGetter,
    components: mergedComponents,
    viewConfig,
  })

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isInlineMode) {
      setSelectedDate((prev) => prev ?? new Date())
      return
    }
    setSelectedDate(null)
  }, [isInlineMode])
  /* eslint-enable react-hooks/set-state-in-effect */

  const modalEvent = useMemo(
    () =>
      modal.eventId == null ? null : (events.find((item) => item.id === modal.eventId) ?? null),
    [events, modal.eventId],
  )
  const modalMode: 'modal' | 'inline' = isInlineMode ? 'inline' : 'modal'
  const eventCardDate = selectedDate ?? date

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
        showEventCard={selectedDate != null}
        onCloseModal={handleCloseModal}
        onCloseEventCard={() => setSelectedDate(null)}
        onEventColorChange={updateEventColor}
        onEventTitleConfirm={updateEventTitle}
        onEventTypeChange={updateEventType}
        onEventTimingChange={updateEventTiming}
      />
    </div>
  )
}

export default CustomCalendar
