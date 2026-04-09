import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import { createEvent, normalizeDate, updateEventRange } from '../utils/helpers/calendarPageHelpers'

type UseCalendarEventsOptions = {
  initialEvents?: CalendarEvent[]
}

// 캘린더 이벤트 목록과 편집 동작을 관리하는 훅
export const useCalendarEvents = (options: UseCalendarEventsOptions = {}) => {
  const { initialEvents } = options
  // 서버에서 내려온 초기 이벤트를 로컬 상태로 동기화
  const [events, setEvents] = useState<CalendarEvent[]>(() => initialEvents ?? [])

  useEffect(() => {
    if (!initialEvents) return
    // 서버 데이터가 갱신되면 로컬 이벤트도 교체
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEvents(initialEvents)
  }, [initialEvents])

  // 이벤트 추가: 서버 생성 요청 전에 임시 이벤트를 먼저 렌더링
  // 반환값은 임시 이벤트 id로, 서버 응답 후 실제 id로 교체하는 데 사용
  const addEvent = useCallback((date: Date, allDay = false) => {
    const createdId = Date.now()
    const nextEvent: CalendarEvent = { ...createEvent(date, 0, allDay), id: createdId }
    setEvents((prev) => [...prev, nextEvent])
    return createdId
  }, [])

  // 이벤트 이동: 드래그 이동 시 시작/종료 시간을 로컬 상태에 반영
  const moveEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) =>
      updateEventRange(
        prev,
        event.id,
        normalizedStart,
        normalizedEnd,
        event.type,
        event.occurrenceDate,
      ),
    )
  }, [])

  // 이벤트 리사이즈: 크기 변경 시 시작/종료 시간을 로컬 상태에 반영
  const resizeEvent = useCallback((args: EventInteractionArgs<CalendarEvent>) => {
    const { event, start, end } = args
    const normalizedStart = normalizeDate(start)
    const normalizedEnd = normalizeDate(end)
    setEvents((prev) =>
      updateEventRange(
        prev,
        event.id,
        normalizedStart,
        normalizedEnd,
        event.type,
        event.occurrenceDate,
      ),
    )
  }, [])

  // 외부에서 시간 변경을 직접 반영할 때 사용 (일간 뷰 등)
  const updateEventTime = useCallback(
    (
      eventId: CalendarEvent['id'],
      start: Date,
      end: Date,
      type?: CalendarEvent['type'],
      occurrenceDate?: CalendarEvent['occurrenceDate'],
    ) => {
      setEvents((prev) => updateEventRange(prev, eventId, start, end, type, occurrenceDate))
    },
    [],
  )

  // 이벤트 색상 변경
  const updateEventColor = useCallback(
    (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, color } : event)))
    },
    [],
  )

  // 이벤트 일정 시간/종일 여부 변경
  const updateEventTiming = useCallback(
    (
      eventId: CalendarEvent['id'],
      start: Date,
      end: Date,
      allDay: boolean,
      occurrenceDate?: CalendarEvent['occurrenceDate'],
    ) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId && (occurrenceDate ? event.occurrenceDate === occurrenceDate : true)
            ? {
                ...event,
                start: moment(start).format('YYYY-MM-DDTHH:mm'),
                end: moment(end).format('YYYY-MM-DDTHH:mm'),
                isAllDay: allDay,
              }
            : event,
        ),
      )
    },
    [],
  )

  // 일정/할 일 타입 변경 (todo로 바뀌면 isDone 유지)
  const updateEventType = useCallback(
    (eventId: CalendarEvent['id'], type: CalendarEvent['type']) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, type, isDone: type === 'todo' ? event.isDone : undefined }
            : event,
        ),
      )
    },
    [],
  )

  // 제목 수정
  const updateEventTitle = useCallback(
    (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, title } : event)))
    },
    [],
  )

  // 서버 응답 후 임시 이벤트 id를 실제 id로 교체
  const updateEventId = useCallback((tempId: CalendarEvent['id'], nextId: CalendarEvent['id']) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === tempId ? { ...event, id: nextId } : event)),
    )
  }, [])

  // 완료 상태 토글 (type을 전달하면 해당 타입만 대상)
  const toggleEventDone = useCallback(
    (eventId: CalendarEvent['id'], type?: CalendarEvent['type']) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId && (type ? event.type === type : true)
            ? { ...event, isDone: !event.isDone }
            : event,
        ),
      )
    },
    [],
  )

  // 이벤트 삭제
  const removeEvent = useCallback((eventId: CalendarEvent['id']) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }, [])

  return {
    events,
    addEvent,
    moveEvent,
    resizeEvent,
    updateEventTime,
    updateEventColor,
    updateEventTiming,
    updateEventType,
    updateEventTitle,
    updateEventId,
    toggleEventDone,
    removeEvent,
  }
}
