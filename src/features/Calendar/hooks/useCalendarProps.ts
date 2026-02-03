import { useMemo } from 'react'
import type { View } from 'react-big-calendar'

import type { CalendarEvent } from '@/features/Calendar/domain/types'

import { buildCalendarConfig } from '../components/CustomCalendar/config'

type UseCalendarPropsArgs = {
  localizer: Parameters<typeof buildCalendarConfig>[0]['localizer']
  views: Parameters<typeof buildCalendarConfig>[0]['views']
  view: View
  date: Date
  events: CalendarEvent[]
  onView: (view: View) => void
  onNavigate: (date: Date) => void
  onSelectEvent: Parameters<typeof buildCalendarConfig>[0]['onSelectEvent']
  onEventDrop: Parameters<typeof buildCalendarConfig>[0]['onEventDrop']
  onEventResize: Parameters<typeof buildCalendarConfig>[0]['onEventResize']
  onSelectSlot: Parameters<typeof buildCalendarConfig>[0]['onSelectSlot']
  dayPropGetter: Parameters<typeof buildCalendarConfig>[0]['dayPropGetter']
  components: Parameters<typeof buildCalendarConfig>[0]['components']
  viewConfig: Parameters<typeof buildCalendarConfig>[0]['viewConfig']
}

export const useCalendarProps = ({
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
}: UseCalendarPropsArgs) =>
  useMemo(
    () =>
      buildCalendarConfig({
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
      }),
    [
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
    ],
  )
