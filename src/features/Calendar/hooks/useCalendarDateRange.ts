import moment from 'moment'
import { useMemo } from 'react'
import { type View, Views } from 'react-big-calendar'

// 캘린더 뷰와 기준 날짜로 API 조회 범위를 계산하는 훅
export const useCalendarDateRange = (view: View, date: Date) =>
  useMemo(() => {
    const base = moment(date)
    if (view === Views.MONTH) {
      return {
        startDate: base.clone().startOf('month').format('YYYY-MM-DD'),
        endDate: base.clone().endOf('month').format('YYYY-MM-DD'),
      }
    }
    if (view === Views.WEEK) {
      const weekStart = base.clone().day(0).startOf('day') // Sunday
      const weekEnd = weekStart.clone().add(6, 'days').endOf('day') // Saturday
      return {
        startDate: weekStart.format('YYYY-MM-DD'),
        endDate: weekEnd.format('YYYY-MM-DD'),
      }
    }
    return {
      startDate: base.clone().startOf('day').format('YYYY-MM-DD'),
      endDate: base.clone().endOf('day').format('YYYY-MM-DD'),
    }
  }, [date, view])
