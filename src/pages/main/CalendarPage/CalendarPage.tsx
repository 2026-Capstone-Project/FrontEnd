/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import { theme } from '@/shared/styles/theme'

import * as S from './CalendarPage.styles'

const CalendarPage = () => {
  const [isModalMode, setIsModalMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const breakpoint = parseInt(theme.breakPoints.desktop, 10)
    const updateMode = () => {
      setIsModalMode(window.innerWidth < breakpoint)
    }
    updateMode()
    window.addEventListener('resize', updateMode)
    return () => window.removeEventListener('resize', updateMode)
  }, [])

  return (
    <S.PageWrapper>
      <CustomCalendar mode={isModalMode ? 'modal' : 'inline'} />
      <div id="desktop-card-area" />
    </S.PageWrapper>
  )
}

export default CalendarPage
