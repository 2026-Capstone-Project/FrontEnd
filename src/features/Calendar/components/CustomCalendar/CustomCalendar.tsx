import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { cloneElement, type MouseEvent, useCallback, useMemo, useState } from 'react'
import {
  Calendar,
  type DateCellWrapperProps,
  momentLocalizer,
  type SlotInfo,
  type View,
  Views,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

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
import AddSchedule from '@/shared/ui/modal/AddSchedule/AddSchedule'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import * as S from './CustomCalendar.style'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)

//TODO: 모달 및 특정 일 상세 조회 컴포넌트 추가
type CustomCalendarProps = {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

const CustomCalendar = ({ selectedDate, onSelectDate }: CustomCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const { events, addEvent: enqueueEvent, moveEvent, resizeEvent } = useCalendarEvents()
  const [modal, setModal] = useState<boolean>(false)
  const [modalDate, setModalDate] = useState<string>(() => new Date().toISOString())
  const onView = useCallback((newView: View) => setView(newView), [])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      // 슬롯 선택/더블클릭 처리: 선택 날짜 설정 후 더블클릭이면 새 일정 추가

      if (slotInfo.action === 'doubleClick') {
        setModalDate(slotInfo.start.toISOString())
        setModal(true)
        enqueueEvent(slotInfo.start, slotInfo.slots.length === 1)
      } else {
        onSelectDate(slotInfo.start)
      }
    },
    [enqueueEvent, onSelectDate],
  )
  /** 선택된 날짜에 배경 강조 스타일을 적용하도록 props를 반환합니다. */
  const dayPropGetter = useCallback(
    (calendarDate: Date) => getDayPropStyle(calendarDate, selectedDate),
    [selectedDate],
  )

  const handleSelectDate = useCallback((next: Date) => onSelectDate(next), [onSelectDate])
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
          onSelectDate(value)
          if (typeof children.props.onClick === 'function') {
            children.props.onClick(event)
          }
        },
      }),
    [onSelectDate],
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
    }),
    [view, viewConfig, viewEventComponent, DateCellWrapper],
  )

  return (
    <>
      <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
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
      {modal && <AddSchedule date={modalDate} onClose={() => setModal(false)} />}
    </>
  )
}

export default CustomCalendar
