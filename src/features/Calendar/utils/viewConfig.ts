import moment from 'moment'
import type { ComponentType } from 'react'
import { createElement } from 'react'
import type { Components, Formats, HeaderProps, View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import CustomHeader from '../components/CalendarHeader'
import type { CalendarEvent } from '../components/CustomDayView'
import { formatDayHeaderLabel, formatDayNumber, formatWeekday } from './formatters'

type ViewConfigOptions = {
  onAddHeader?: (date: Date) => void
}

type ViewConfig = {
  formats?: Formats
  components?: Components<CalendarEvent, object>
  allDayAccessor?: (event: CalendarEvent) => boolean
}

const weekdayFormat = (date: Date) => formatWeekday(date)
const dayHeaderFormat = (date: Date) => formatDayHeaderLabel(date)
const timeGutterFormat = (date: Date) => moment(date).format('HH:00')

const createWeekHeader = (options?: ViewConfigOptions): ComponentType<HeaderProps> => {
  if (options?.onAddHeader) {
    return (props: HeaderProps) =>
      createElement(CustomHeader as ComponentType<HeaderProps & { onAdd?: (date: Date) => void }>, {
        ...props,
        onAdd: options.onAddHeader,
      })
  }
  return CustomHeader
}

const viewConfigMap: Partial<Record<View, ViewConfig>> = {
  month: {
    formats: {
      weekdayFormat,
      dateFormat: formatDayNumber,
    },
  },
  week: {
    formats: {
      weekdayFormat,
      dayHeaderFormat,
      timeGutterFormat,
    },
    components: {
      header: CustomHeader,
    },
    allDayAccessor: () => true,
  },
  day: {
    formats: {
      dayHeaderFormat,
      timeGutterFormat,
    },
    components: {
      header: CustomHeader,
    },
  },
}

export const getViewConfig = (view: View, options?: ViewConfigOptions): ViewConfig => {
  const config = viewConfigMap[view] ?? viewConfigMap.month!
  if (view === Views.WEEK) {
    return {
      ...config,
      components: {
        ...config.components,
        header: createWeekHeader(options),
      },
    }
  }
  return config
}
