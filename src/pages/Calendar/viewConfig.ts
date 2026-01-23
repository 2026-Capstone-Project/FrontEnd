import type { CalendarProps, View } from 'react-big-calendar'
import moment from 'moment'
import CustomHeader from './components/CalendarHeader'
import { formatWeekday, formatDayHeaderLabel, formatDayNumber } from './formatters'
import type { CalendarEvent } from './components/CustomDayView'

type ViewConfig = Pick<CalendarProps<CalendarEvent>, 'formats' | 'components' | 'allDayAccessor'>

const weekdayFormat = (date: Date) => formatWeekday(date)

const dayHeaderFormat = (date: Date) => formatDayHeaderLabel(date)
const timeGutterFormat = (date: Date) => moment(date).format('HH:00')

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

export const getViewConfig = (view: View): ViewConfig => viewConfigMap[view] ?? viewConfigMap.month!
