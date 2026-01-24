/** @jsxImportSource @emotion/react */
import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import EventsCard from '@/features/Calendar/components/EventsCard/EventsCard'

import * as S from './CalendarPage.styles'

const CalendarPage = () => {
  return (
    <S.PageWrapper>
      <CustomCalendar />
      <EventsCard />
    </S.PageWrapper>
  )
}

export default CalendarPage
