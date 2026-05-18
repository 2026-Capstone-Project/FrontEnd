// 캘린더 뷰(월/주/일)를 로컬스토리지에 저장/복원하는 훅
import { useEffect, useState } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import type { CalendarView } from '@/shared/types/settings/settings'

const VIEW_STORAGE_KEY = 'calendar.view'

const SETTINGS_VIEW_MAP: Record<CalendarView, View> = {
  MONTH: Views.MONTH,
  WEEK: Views.WEEK,
  DAY: Views.DAY,
}

const getStoredView = (): View | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
  if (stored === Views.MONTH || stored === Views.WEEK || stored === Views.DAY) {
    return stored
  }
  return null
}

export const mapSettingsDefaultView = (defaultView: CalendarView): View =>
  SETTINGS_VIEW_MAP[defaultView] ?? Views.MONTH

type UseStoredCalendarViewArgs = {
  initialView?: View | null
}

export const useStoredCalendarView = ({ initialView }: UseStoredCalendarViewArgs = {}) => {
  const [userView, setUserView] = useState<View | null>(() => initialView ?? getStoredView())
  const view = userView ?? initialView ?? Views.MONTH

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(VIEW_STORAGE_KEY, view)
  }, [view])

  return { view, setView: setUserView }
}
