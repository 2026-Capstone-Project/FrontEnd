import {
  Calendar,
  momentLocalizer,
  Views,
  type SlotInfo,
  type View,
  type stringOrDate,
} from 'react-big-calendar'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import * as S from './Calendar.style'
import { getViewConfig } from './viewConfig'
import CustomToolbar from './components/CalendarToolbar'
import CustomDayView, { type CalendarEvent } from './components/CustomDayView'
import CustomWeekView from './components/CustomWeekView'

import CustomMonthEvent from './components/CustomMonthEvent'
import CustomWeekEvent from './components/CustomWeekEvent'
import { mockCalendarEvents } from '../../mocks/calendarEvents'
import { useCallback, useMemo, useState } from 'react'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)

const normalizeDate = (value: stringOrDate): Date =>
  typeof value === 'string' || typeof value === 'number' ? new Date(value) : value

const CalendarPage = () => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(() => [...mockCalendarEvents])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const onView = useCallback((newView: View) => setView(newView), [])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  const addEvent = useCallback((date: Date, allDay = false) => {
    setEvents((prev) => [
      ...prev,
      {
        id: `${prev.length}-${date.valueOf()}`,
        title: allDay ? '새 종일 일정' : '새 일정',
        start: date,
        end: allDay ? date : moment(date).add(1, 'hour').toDate(),
        allDay,
      },
    ])
    setSelectedDate(date)
  }, [])

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      setSelectedDate(slotInfo.start)
      if (slotInfo.action === 'doubleClick') {
        addEvent(slotInfo.start, slotInfo.slots.length === 1)
      }
    },
    [addEvent],
  )

  const moveEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id ? { ...item, start: normalizedStart, end: normalizedEnd } : item,
      ),
    )
  }, [])

  const resizeEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id ? { ...item, start: normalizedStart, end: normalizedEnd } : item,
      ),
    )
  }, [])

  const dayPropGetter = useCallback(
    (calendarDate: Date) => {
      if (!selectedDate) {
        return {}
      }
      const match = moment(selectedDate).isSame(calendarDate, 'day')
      return match
        ? {
            style: {
              backgroundColor: '#f5f5f5',
            },
          }
        : {}
    },
    [selectedDate],
  )

  const handleSelectDate = useCallback((next: Date) => setSelectedDate(next), [])
  const viewConfig = useMemo(
    () =>
      getViewConfig(view, {
        onAddHeader: handleSelectDate,
      }),
    [view, handleSelectDate],
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
    }),
    [view, viewConfig, viewEventComponent],
  )

  return (
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
        style={{ height: '100%', width: '100%' }}
      />
    </S.CalendarWrapper>
  )
}

export default CalendarPage
