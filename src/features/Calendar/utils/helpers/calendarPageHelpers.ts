import moment from 'moment'

import { theme } from '@/shared/styles/theme'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import {
  DEFAULT_ALL_DAY_TITLE,
  DEFAULT_EVENT_DURATION_HOURS,
  DEFAULT_EVENT_TITLE,
} from '../../domain/constants'

/** 문자열 또는 숫자/Date 혼합 값을 Date로 정규화합니다. */
export const normalizeDate = (value: Date | string): Date =>
  typeof value === 'string' ? new Date(value) : value

// 로컬에서 임시로 생성하는 이벤트 id 충돌을 줄이기 위해 timestamp + index를 사용한다.
const buildEventId = (prevCount: number, date: Date) => date.valueOf() + prevCount

/** 기본 제목/기간을 가지는 새 캘린더 이벤트를 생성합니다. */
export const createEvent = (date: Date, index: number, allDay = false): CalendarEvent => {
  const start = moment(date)
  const eventDurationMs = moment.duration(DEFAULT_EVENT_DURATION_HOURS, 'hours')
  const end = allDay ? start.clone().endOf('day') : start.clone().add(eventDurationMs)
  return {
    id: buildEventId(index, date),
    title: allDay ? DEFAULT_ALL_DAY_TITLE : DEFAULT_EVENT_TITLE,
    content: null,
    start: start.format('YYYY-MM-DDTHH:mm'),
    end: end.format('YYYY-MM-DDTHH:mm'),
    calculated: false,
    location: null,
    isAllDay: allDay,
    color: 'GRAY',
    recurrenceGroup: null,
    friendIds: [],
    type: 'schedule',
  }
}

/** drag 또는 resize 등으로 시작/종료 시간이 변경될 경우 해당 이벤트를 업데이트합니다. */
export const updateEventRange = (
  events: CalendarEvent[],
  eventId: CalendarEvent['id'],
  start: Date,
  end: Date,
  type?: CalendarEvent['type'],
  occurrenceDate?: CalendarEvent['occurrenceDate'],
) =>
  events.map((item) =>
    item.id === eventId &&
    (type ? item.type === type : true) &&
    (occurrenceDate ? item.occurrenceDate === occurrenceDate : true)
      ? {
          ...item,
          start: moment(start).format('YYYY-MM-DDTHH:mm'),
          end: moment(end).format('YYYY-MM-DDTHH:mm'),
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
          backgroundColor: theme.colors.lightGray,
        },
      }
    : {}
}
