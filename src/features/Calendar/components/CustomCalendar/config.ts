import { type CalendarProps, type View, Views } from 'react-big-calendar'
import type { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '@/features/Calendar/domain/types'

type CalendarDndProps = CalendarProps<CalendarEvent, object> &
  withDragAndDropProps<CalendarEvent, object>

type CalendarConfigArgs = {
  localizer: CalendarDndProps['localizer']
  views: CalendarDndProps['views']
  view: View
  date: Date
  events: CalendarEvent[]
  onView: (view: View) => void
  onNavigate: (date: Date) => void
  onSelectEvent: CalendarDndProps['onSelectEvent']
  onEventDrop: CalendarDndProps['onEventDrop']
  onEventResize: CalendarDndProps['onEventResize']
  onSelectSlot: CalendarDndProps['onSelectSlot']
  dayPropGetter: CalendarDndProps['dayPropGetter']
  components: CalendarDndProps['components']
  viewConfig: {
    formats?: CalendarDndProps['formats']
    allDayAccessor?: (event: CalendarEvent) => boolean
  }
}

export const buildCalendarConfig = ({
  localizer,
  views,
  view,
  date,
  events,
  onView,
  onNavigate,
  onSelectEvent,
  onEventDrop,
  onEventResize,
  onSelectSlot,
  dayPropGetter,
  components,
  viewConfig,
}: CalendarConfigArgs): CalendarDndProps => {
  const allDayAccessorProps = viewConfig.allDayAccessor
    ? { allDayAccessor: viewConfig.allDayAccessor }
    : {}

  return {
    localizer,
    culture: 'ko',
    views,
    defaultView: Views.MONTH,
    view,
    date,
    events,
    onView,
    onNavigate,
    onSelectEvent,
    onEventDrop,
    onEventResize,
    draggableAccessor: () => true,
    onSelectSlot,
    dayPropGetter,
    components,
    formats: view === Views.DAY ? {} : viewConfig.formats,
    ...allDayAccessorProps,
    drilldownView: null,
    style: { height: '100%', width: '100%' },
    selectable: true,
    popup: true,
    resizable: true,
  }
}
