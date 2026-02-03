import { useEffect, useState } from 'react'
import type { View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

const VIEW_STORAGE_KEY = 'calendar.view'

const getStoredView = (): View => {
  if (typeof window === 'undefined') return Views.MONTH
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
    if (stored === Views.MONTH || stored === Views.WEEK || stored === Views.DAY) {
      return stored
    }
  } catch {
    // noop
  }
  return Views.MONTH
}

export const useStoredCalendarView = () => {
  const [view, setView] = useState<View>(() => getStoredView())

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, view)
    } catch {
      // noop
    }
  }, [view])

  return { view, setView }
}
