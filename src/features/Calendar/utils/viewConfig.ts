import moment from 'moment'
import type { ComponentType } from 'react'
import { createElement } from 'react'
import type { Components, Formats, HeaderProps, View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import CustomHeader from '../components/CalendarHeader/CalendarHeader'
import type { CalendarEvent } from '../components/CustomView/CustomDayView'
import { formatDayHeaderLabel, formatDayNumber, formatWeekday } from './formatters'

type ViewConfigOptions = {
  onAddHeader?: (date: Date) => void
}

type ViewConfig = {
  formats?: Formats
  components?: Components<CalendarEvent, object>
  allDayAccessor?: (event: CalendarEvent) => boolean
}

// react-big-calendar format 콜백을 앱 공통 포맷으로 연결한다.
const weekdayFormat = (date: Date) => formatWeekday(date)
const dayHeaderFormat = (date: Date) => formatDayHeaderLabel(date)
const timeGutterFormat = (date: Date) => moment(date).format('HH:00')

// 주간 헤더에서만 "+" 액션을 주입할 수 있도록 동적 헤더 컴포넌트를 만든다.
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

// 뷰 타입별로 날짜 포맷/헤더 렌더러/종일 처리 규칙을 분리해 관리한다.
const viewConfigMap: Partial<Record<View, ViewConfig>> = {
  month: {
    formats: {
      weekdayFormat,
      dateFormat: formatDayNumber,
    },
    allDayAccessor: (event) => event.isAllDay,
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
    // 주간뷰에서는 일정 전부를 종일 영역에 표시
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
    allDayAccessor: (event) => event.isAllDay,
  },
}

// 선택된 뷰에 맞는 캘린더 설정을 반환하고, 주간뷰는 헤더 옵션을 합성한다.
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
