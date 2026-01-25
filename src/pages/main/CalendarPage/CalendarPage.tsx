/** @jsxImportSource @emotion/react */
import { useState } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import EventsCard from '@/features/Calendar/components/EventsCard/EventsCard'

import * as S from './CalendarPage.styles'

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <S.PageWrapper>
      <CustomCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      {selectedDate && <EventsCard selectedDate={selectedDate} />}
    </S.PageWrapper>
  )
}

export default CalendarPage
