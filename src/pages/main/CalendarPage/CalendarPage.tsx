/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import EventsCard from '@/features/Calendar/components/EventsCard/EventsCard'

import * as S from './CalendarPage.styles'
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const cardAreaRef = useRef<HTMLDivElement | null>(null)
  return (
    <S.PageWrapper>
      <CustomCalendar onSelectedDateChange={setSelectedDate} />
      <div
        ref={cardAreaRef}
        id="desktop-card-area"
        css={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <EventsCard selectedDate={selectedDate} />
      </div>
    </S.PageWrapper>
  )
}

export default CalendarPage
