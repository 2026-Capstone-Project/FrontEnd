// 캘린더 뷰(월/주/일)를 로컬스토리지에 저장/복원하는 훅
import { useEffect, useState } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

const VIEW_STORAGE_KEY = 'calendar.view'

const getStoredView = (): View | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
  if (stored === Views.MONTH || stored === Views.WEEK || stored === Views.DAY) {
    return stored
  }
  return null
}

type UseStoredCalendarViewArgs = {
  initialView?: View | null
}

export const useStoredCalendarView = ({ initialView }: UseStoredCalendarViewArgs = {}) => {
  const storedView = getStoredView()
  const [userView, setUserView] = useState<View | null>(() => storedView ?? null)
  const view = userView ?? initialView ?? Views.MONTH

  useEffect(() => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, view)
  }, [view])

  return { view, setView: setUserView }
}
