/** @jsxImportSource @emotion/react */
import { useRef } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'

import * as S from './CalendarPage.styles'
const CalendarPage = () => {
  const cardAreaRef = useRef<HTMLDivElement | null>(null)

  return (
    <S.PageWrapper>
      <CustomCalendar />
      <div ref={cardAreaRef} id="desktop-card-area" css={{ position: 'relative' }} />
    </S.PageWrapper>
  )
}

export default CalendarPage
