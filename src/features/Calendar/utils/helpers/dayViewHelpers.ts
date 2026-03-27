import moment from 'moment'
import type { stringOrDate } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import { TIMED_SLOT_CONFIG } from '../../domain/constants'
import { getColorPalette } from '../colorPalette'

export type TimedSlotEvent = {
  event: CalendarEvent
  start: Date
  end: Date
  top: number
  height: number
  palette: { base: string; point: string }
  laneIndex?: number
  laneCount?: number
  overflowTop?: boolean
  overflowBottom?: boolean
}

// "2026-02-24" 같은 날짜 전용 문자열인지 판별해 시간 파싱 분기를 단순화한다.
export const isDateOnlyString = (value?: stringOrDate) =>
  typeof value === 'string' && !value.includes('T')

// day view 렌더링 전 이벤트를 시작 시각 기준으로 정렬한다.
export const compareByStart = (a: CalendarEvent, b: CalendarEvent) =>
  moment(a.start).diff(moment(b.start))

// 반복 일정의 각 occurrence를 안정적으로 식별하기 위한 키를 생성한다.
export const getEventOccurrenceKey = (event: CalendarEvent) =>
  `${event.id}_${moment(event.start).format('YYYY-MM-DDTHH:mm')}`

// occurrenceDate가 있으면 우선 사용하고, 없으면 start를 사용해 일관된 datetime 문자열을 만든다.
export const resolveOccurrenceDateTime = (
  occurrenceDate: CalendarEvent['occurrenceDate'] | undefined,
  fallbackStart: CalendarEvent['start'] | Date,
) => moment(occurrenceDate ?? fallbackStart).format('YYYY-MM-DDTHH:mm:ss')

// 며칠짜리 일정이 특정 날짜를 포함하는지 판별한다.
export const eventCoversDate = (event: CalendarEvent, date: Date) => {
  const start = moment(event.start)
  const end = moment(event.end)
  return moment(date).isBetween(start.startOf('day'), end.endOf('day'), undefined, '[]')
}

// 이벤트를 오전/오후 컬럼 단위 시각 슬롯으로 변환하고 겹침 레이아웃 정보를 계산한다.
export const buildTimedSlots = (
  events: CalendarEvent[],
  date: Date,
  slotHeight = TIMED_SLOT_CONFIG.SLOT_HEIGHT,
) => {
  const { MIN_HEIGHT, MAX_VISUAL_HOURS, COLUMNS } = TIMED_SLOT_CONFIG
  const columns: TimedSlotEvent[][] = COLUMNS.map(() => [])

  const dayStart = moment(date).startOf('day')
  const dayEnd = dayStart.clone().add(24, 'hours')
  const noon = dayStart.clone().add(12, 'hours')

  events.forEach((event) => {
    const palette = getColorPalette(event.color)
    const start = moment(event.start)
    const end = moment(event.end)
    const clampedStart = moment.max(start, dayStart)
    const clampedEnd = moment.min(end, dayEnd)

    if (!clampedEnd.isAfter(clampedStart)) {
      return
    }

    // 표시 구간(한 컬럼 내 시작/종료)을 실제 픽셀 좌표(top/height)로 변환한다.
    const pushSegment = (segmentStart: moment.Moment, segmentEnd: moment.Moment) => {
      const columnIndex = segmentStart.hour() < 12 ? 0 : 1
      const columnStart = dayStart.clone().add(COLUMNS[columnIndex], 'hours')
      const minutesSinceColumnStart = segmentStart.diff(columnStart, 'minutes')
      const top = (minutesSinceColumnStart / 60) * slotHeight
      const durationMinutes = Math.max(segmentEnd.diff(segmentStart, 'minutes'), 15)
      const calculatedHeight = (durationMinutes / 60) * slotHeight
      const height = Math.min(calculatedHeight, slotHeight * (MAX_VISUAL_HOURS - 1) - top)

      columns[columnIndex].push({
        event,
        start: segmentStart.toDate(),
        end: segmentEnd.toDate(),
        top,
        height: Math.max(height, MIN_HEIGHT),
        palette,
        overflowTop: segmentStart.isAfter(start),
        overflowBottom: segmentEnd.isBefore(end),
      })
    }

    if (clampedStart.isBefore(noon) && clampedEnd.isAfter(noon)) {
      pushSegment(clampedStart, noon)
      pushSegment(noon, clampedEnd)
      return
    }

    pushSegment(clampedStart, clampedEnd)
  })

  // 같은 시간대에 겹치는 이벤트를 lane으로 분배해 겹침 표시 폭을 계산한다.
  const assignLanes = (columnEvents: TimedSlotEvent[]) => {
    const sorted = [...columnEvents].sort((a, b) => a.start.getTime() - b.start.getTime())
    const active: Array<{ end: Date; lane: number }> = []
    let cluster: TimedSlotEvent[] = []
    let maxLane = 0

    // 하나의 겹침 클러스터가 끝나면 laneCount를 일괄 확정한다.
    const finalizeCluster = () => {
      if (cluster.length === 0) return
      cluster.forEach((item) => {
        item.laneCount = maxLane
      })
      cluster = []
      maxLane = 0
    }

    sorted.forEach((item) => {
      const now = item.start.getTime()
      active.sort((a, b) => a.end.getTime() - b.end.getTime())
      while (active.length > 0 && active[0].end.getTime() <= now) {
        active.shift()
      }

      if (active.length === 0) {
        finalizeCluster()
      }

      const usedLanes = new Set(active.map((entry) => entry.lane))
      let lane = 0
      while (usedLanes.has(lane)) lane += 1
      active.push({ end: item.end, lane })
      item.laneIndex = lane
      cluster.push(item)
      maxLane = Math.max(maxLane, active.length)
    })

    finalizeCluster()
  }

  columns.forEach(assignLanes)
  return columns
}
