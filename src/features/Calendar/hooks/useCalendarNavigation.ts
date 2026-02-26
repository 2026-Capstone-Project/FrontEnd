import moment from 'moment'
import { useCallback } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

type UseCalendarNavigationArgs = {
  view: View
  date: Date
  isDesktop: boolean
  setView: (view: View) => void
  setDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedEventId: (id: number | null) => void
  setSelectedEventKey: (key: string | null) => void
}

// 캘린더뷰가 변할 때, selectedDate을 뷰의 시작 날짜로 초기화
const getViewStartDate = (baseDate: Date, baseView: View) => {
  const base = moment(baseDate)
  if (baseView === Views.MONTH) {
    return base.startOf('month').toDate()
  }
  if (baseView === Views.WEEK) {
    return base.day(0).startOf('day').toDate()
  }
  return base.startOf('day').toDate()
}

// 캘린더 네비게이션 훅: 뷰 변경, 날짜 이동, 날짜 선택 핸들러 제공
export const useCalendarNavigation = ({
  view,
  date,
  isDesktop,
  setView,
  setDate,
  setSelectedDate,
  setSelectedEventId,
  setSelectedEventKey,
}: UseCalendarNavigationArgs) => {
  // 선택된 이벤트 초기화
  const clearSelection = useCallback(() => {
    setSelectedEventId(null)
    setSelectedEventKey(null)
  }, [setSelectedEventId, setSelectedEventKey])

  // 뷰 변경 핸들러
  const onView = useCallback(
    (newView: View) => {
      setView(newView)
      setSelectedDate(isDesktop ? getViewStartDate(date, newView) : null)
      clearSelection()
    },
    [clearSelection, date, isDesktop, setSelectedDate, setView],
  )

  // 날짜 이동 핸들러
  const onNavigate = useCallback(
    (newDate: Date) => {
      setDate(newDate)
      setSelectedDate(isDesktop ? getViewStartDate(newDate, view) : null)
      clearSelection()
    },
    [clearSelection, isDesktop, setDate, setSelectedDate, view],
  )

  // 날짜 선택 핸들러
  const onSelectDate = useCallback(
    (next: Date) => {
      clearSelection()
      setDate(next)
    },
    [clearSelection, setDate],
  )

  return { onView, onNavigate, onSelectDate }
}
