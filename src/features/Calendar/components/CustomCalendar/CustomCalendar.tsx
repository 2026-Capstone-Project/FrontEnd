/** @JsxImportSource @emotion/react */
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
import { createPortal } from 'react-dom'

import CustomToolbar from '@/features/Calendar/components/CalendarToolbar/CalendarToolbar'
import CustomMonthEvent from '@/features/Calendar/components/CustomEvent/CustomMonthEvent'
import CustomWeekEvent from '@/features/Calendar/components/CustomEvent/CustomWeekEvent'
import CustomDayView, {
  type CalendarEvent,
} from '@/features/Calendar/components/CustomView/CustomDayView'
import CustomWeekView from '@/features/Calendar/components/CustomView/CustomWeekView'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import { getDayPropStyle } from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getViewConfig } from '@/features/Calendar/utils/viewConfig'
import Plus from '@/shared/assets/icons/plus.svg?react'
import { theme } from '@/shared/styles/theme'
import AddSchedule from '@/shared/ui/modal/AddSchedule'

import CalendarHeader from '../CalendarDateHeader/CalendarDateHeader'
import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import EventsCard from '../EventsCard/EventsCard'
import * as S from './CustomCalendar.style'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)

export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

type CustomCalendarProps = {
  mode?: 'modal' | 'inline'
  cardPortalElement?: HTMLElement | null
}

const CustomCalendar = ({ mode, cardPortalElement }: CustomCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState<Date>(new Date())
  const [modalDate, setModalDate] = useState<string>(() => new Date().toISOString())
  const [cardPortalRoot, setCardPortalRoot] = useState<HTMLElement | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modal, setModal] = useState<{ isOpen: boolean; eventId: number | null }>({
    isOpen: false,
    eventId: null,
  })
  const [isModalEditing, setIsModalEditing] = useState(false)
  const { events, addEvent: enqueueEvent, moveEvent, resizeEvent } = useCalendarEvents()

  const modalPortalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('modal-root')
  }, [])

  const isInlineMode = mode === 'inline'
  const onView = useCallback((newView: View) => setView(newView), [])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      const start = event.start instanceof Date ? event.start : new Date(event.start ?? Date.now())
      setModalDate(start.toISOString())
      setIsModalEditing(true)
      setModal({ isOpen: true, eventId: event.id ?? null })
    },
    [setModal, setModalDate],
  )

  const handleAddEvent = useCallback(() => {
    const referenceDate = date ?? new Date()
    const eventId = 1
    setModalDate(referenceDate.toISOString())
    setIsModalEditing(false)
    setModal({ isOpen: true, eventId })
  }, [date, setModal, setModalDate])

  const handleCloseModal = useCallback(() => {
    setModal({ isOpen: false, eventId: null })
    setIsModalEditing(false)
  }, [setModal, setIsModalEditing])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 선택 날짜 설정 후 더블클릭이면 새 일정 추가
      if (slotInfo.action === 'doubleClick') {
        setSelectedDate(null)
        handleAddEvent()
        const isAllDaySlot = slotInfo.slots.length === 1
        enqueueEvent(slotInfo.start, isAllDaySlot)
      } else {
        setSelectedDate(slotInfo.start)
      }
    },
    [enqueueEvent, handleAddEvent],
  )

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      handleEventClick(event)
    },
    [handleEventClick],
  )
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
          <CustomMonthEvent {...props} onEventClick={handleEventClick} />
        ),
      }
    }
    if (view === Views.WEEK) {
      return {
        event: (props: EventProps<CalendarEvent>) => (
          <CustomWeekEvent event={props.event} onEventClick={handleEventClick} />
        ),
      }
    }
    return {}
  }, [view, handleEventClick])

  const mergedComponents = useMemo(
    () => ({
      toolbar: CustomToolbar,

      ...(view === Views.DAY ? {} : viewConfig.components),
      ...viewEventComponent,
      dateCellWrapper: DateCellWrapper,
      dateHeader: ({ label, date }: { label: string; date: Date }) => (
        <CalendarHeader label={label} date={date} onClick={() => setSelectedDate(date)} />
      ),
    }),
    [view, viewConfig.components, viewEventComponent, DateCellWrapper],
  )

  useEffect(() => {
    if (mode === 'inline') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDate((prev) => prev ?? new Date())
      return
    }
    setSelectedDate(null)
  }, [mode])

  useEffect(() => {
    if (cardPortalElement) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCardPortalRoot(cardPortalElement)
      return
    }
    if (typeof document === 'undefined') {
      setCardPortalRoot(null)
      return
    }
    setCardPortalRoot(document.getElementById('desktop-card-area'))
  }, [cardPortalElement])

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <S.MobileButtons>
        <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
        <button className="add-button" onClick={handleAddEvent} type="button">
          <Plus height={20} width={20} color={theme.colors.primary} />
        </button>
      </S.MobileButtons>
      <S.CalendarWrapper view={view}>
        <DragAndDropCalendar
          localizer={localizer}
          culture="ko"
          views={{
            month: true,
            week: CustomWeekView,
            day: CustomDayView,
          }}
          defaultView={Views.MONTH}
          view={view}
          date={date}
          events={events}
          onView={onView}
          onNavigate={onNavigate}
          onSelectEvent={handleSelectEvent}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          draggableAccessor={() => true}
          onSelectSlot={handleSelectSlot}
          dayPropGetter={dayPropGetter}
          components={mergedComponents}
          formats={view === Views.DAY ? {} : viewConfig.formats}
          {...(viewConfig.allDayAccessor ? { allDayAccessor: viewConfig.allDayAccessor } : {})}
          drilldownView={null}
          style={{ height: '100%', width: '100%' }}
          selectable
          popup
          resizable
        />
      </S.CalendarWrapper>
      {modal &&
        modalPortalRoot &&
        !isInlineMode &&
        modal.eventId &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={handleCloseModal}
            mode={mode}
            eventId={modal.eventId}
            tabsVisible={!isModalEditing}
          />,
          modalPortalRoot,
        )}
      {modal &&
        modalPortalRoot &&
        isInlineMode &&
        cardPortalRoot &&
        modal.eventId &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={handleCloseModal}
            mode={mode}
            eventId={modal.eventId}
            tabsVisible={!isModalEditing}
          />,
          cardPortalRoot,
        )}

      {date &&
        !modal.isOpen &&
        !isInlineMode &&
        selectedDate &&
        modalPortalRoot &&
        createPortal(
          <EventsCard onClose={() => setSelectedDate(null)} selectedDate={date} />,
          modalPortalRoot,
        )}

      {date &&
        !modal.isOpen &&
        isInlineMode &&
        selectedDate &&
        cardPortalRoot &&
        createPortal(
          <EventsCard onClose={() => setSelectedDate(null)} selectedDate={selectedDate} />,
          cardPortalRoot,
        )}
    </div>
  )
}

export default CustomCalendar
