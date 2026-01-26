/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import { theme } from '@/shared/styles/theme'

import * as S from './CalendarPage.styles'

const CalendarPage = () => {
  const [isModalMode, setIsModalMode] = useState(false)
  const cardAreaRef = useRef<HTMLDivElement | null>(null)
  const [cardPortalElement, setCardPortalElement] = useState<HTMLElement | null>(null)

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

  useEffect(() => {
    setCardPortalElement(cardAreaRef.current)
  }, [])

  return (
    <S.PageWrapper>
      <CustomCalendar
        mode={isModalMode ? 'modal' : 'inline'}
        cardPortalElement={cardPortalElement}
      />
      <div ref={cardAreaRef} id="desktop-card-area" />
    </S.PageWrapper>
  )
}

export default CalendarPage
