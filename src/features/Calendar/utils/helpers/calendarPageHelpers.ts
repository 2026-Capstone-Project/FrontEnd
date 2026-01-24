import moment from 'moment'
import type { stringOrDate } from 'react-big-calendar'

import type { CalendarEvent } from '../../components/CustomView/CustomDayView'
import {
  DEFAULT_ALL_DAY_TITLE,
  DEFAULT_EVENT_DURATION_HOURS,
  DEFAULT_EVENT_TITLE,
} from '../../domain/constants/calendarPage'

/** 문자열 또는 숫자/Date 혼합 값을 Date로 정규화합니다. */
export const normalizeDate = (value: stringOrDate): Date =>
  typeof value === 'string' || typeof value === 'number' ? new Date(value) : value

const buildEventId = (prevCount: number, date: Date) => `${prevCount}-${date.valueOf()}`

/** 기본 제목/기간을 가지는 새 캘린더 이벤트를 생성합니다. */
export const createEvent = (date: Date, index: number, allDay = false): CalendarEvent => {
  const start = date
  const eventDurationMs = moment.duration(DEFAULT_EVENT_DURATION_HOURS, 'hours')
  return {
    id: buildEventId(index, date),
    title: allDay ? DEFAULT_ALL_DAY_TITLE : DEFAULT_EVENT_TITLE,
    start,
    end: allDay ? date : moment(date).add(eventDurationMs).toDate(),
    allDay,
  }
}

/** 기존 이벤트 배열의 끝에 새 이벤트를 추가합니다. */
export const appendEvent = (events: CalendarEvent[], date: Date, allDay = false) => [
  ...events,
  createEvent(date, events.length, allDay),
]

/** drag 또는 resize 등으로 시작/종료 시간이 변경될 경우 해당 이벤트를 업데이트합니다. */
export const updateEventRange = (
  events: CalendarEvent[],
  eventId: string,
  start: Date,
  end: Date,
) =>
  events.map((item) =>
    item.id === eventId
      ? {
          ...item,
          start,
          end,
        }
      : item,
  )

/** 캘린더에서 선택된 날짜에만 배경 색을 주기 위한 prop을 반환합니다. */
export const getDayPropStyle = (calendarDate: Date, selectedDate: Date | null) => {
  if (!selectedDate) {
    return {}
  }
  return moment(selectedDate).isSame(calendarDate, 'day')
    ? {
        style: {
          backgroundColor: '#f5f5f5',
        },
      }
    : {}
}
