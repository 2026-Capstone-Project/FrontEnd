/** @JsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  type DateCellWrapperProps,
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

//TODO: 모달 및 특정 일 상세 조회 컴포넌트 추가
export type SelectDateSource = 'date-cell' | 'slot' | 'header' | 'date-header'

type CustomCalendarProps = {
  mode?: 'modal' | 'inline'
}

const CustomCalendar = ({ mode }: CustomCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modal, setModal] = useState(false)
  const { events, addEvent: enqueueEvent, moveEvent, resizeEvent } = useCalendarEvents()
  const isInlineMode = mode === 'inline'
  const [modalDate, setModalDate] = useState<string>(() => new Date().toISOString())
  const modalPortalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('modal-root')
  }, [])

  const cardPortalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('desktop-card-area')
  }, [])
  const onView = useCallback((newView: View) => setView(newView), [])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 선택 날짜 설정 후 더블클릭이면 새 일정 추가
      if (slotInfo.action === 'doubleClick') {
        setSelectedDate(null)
        setModalDate(slotInfo.start.toISOString())

        enqueueEvent(slotInfo.start, slotInfo.slots.length === 1)
      }
      setSelectedDate(slotInfo.start)
    },
    [enqueueEvent, setModalDate],
  )

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      setModalDate(event.start.toString())
    },
    [setModalDate],
  )
  /** 선택된 날짜에 배경 강조 스타일을 적용하도록 props를 반환합니다. */
  const dayPropGetter = useCallback(
    (calendarDate: Date) => getDayPropStyle(calendarDate, date),
    [date],
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
      return { event: CustomMonthEvent }
    }
    if (view === Views.WEEK) {
      return { event: CustomWeekEvent }
    }
    return {}
  }, [view])

  const mergedComponents = useMemo(
    () => ({
      toolbar: CustomToolbar,

      ...(view === Views.DAY ? {} : viewConfig.components),
      ...viewEventComponent,
      dateCellWrapper: DateCellWrapper,
      dateHeader: ({ label, date }: { label: string; date: Date }) => (
        <CalendarHeader label={label} date={date} onClick={() => setDate(date)} />
      ),
    }),
    [view, viewConfig.components, viewEventComponent, DateCellWrapper],
  )

  useEffect(() => {
    if (date && date.toISOString() !== modalDate) {
      // 임시: 달력에서 날짜가 변경되면 모달에 반영
    }
  }, [date, modalDate])

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <S.MobileButtons>
        <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
        <button
          className="add-button"
          onClick={() => {
            setModalDate(date ? date.toISOString() : new Date().toISOString())
            // setModal(true)
          }}
        >
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
          resizable
          draggableAccessor={() => true}
          selectable
          onSelectSlot={handleSelectSlot}
          dayPropGetter={dayPropGetter}
          components={mergedComponents}
          formats={view === Views.DAY ? {} : viewConfig.formats}
          {...(viewConfig.allDayAccessor ? { allDayAccessor: viewConfig.allDayAccessor } : {})}
          drilldownView={null}
          style={{ height: '100%', width: '100%' }}
        />
      </S.CalendarWrapper>
      {modal &&
        modalPortalRoot &&
        !isInlineMode &&
        createPortal(
          <AddSchedule date={modalDate} onClose={() => setModal(false)} mode={mode} />,
          modalPortalRoot,
        )}
      {modal &&
        modalPortalRoot &&
        isInlineMode &&
        cardPortalRoot &&
        createPortal(
          <AddSchedule date={modalDate} onClose={() => setModal(false)} mode={mode} />,
          cardPortalRoot,
        )}

      {date &&
        !modal &&
        !isInlineMode &&
        selectedDate &&
        createPortal(
          <EventsCard onClose={() => setSelectedDate(null)} selectedDate={date} />,
          modalPortalRoot!,
        )}

      {date &&
        !modal &&
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
