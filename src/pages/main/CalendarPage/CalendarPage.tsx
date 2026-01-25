/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import CustomCalendar, {
  type SelectDateSource,
} from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import EventsCard from '@/features/Calendar/components/EventsCard/EventsCard'

import * as S from './CalendarPage.styles'

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [modal, setModal] = useState<boolean>(false)
  const [cardOpen, setCardOpen] = useState<boolean>(false)
  const handleSelectDate = (date: Date | null, meta?: { source?: SelectDateSource }) => {
    setSelectedDate(date)
    if (!date) {
      setCardOpen(false)
      return
    }
    setCardOpen(meta?.source === 'date-header')
  }
  useEffect(() => {
    if (!selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCardOpen(false)
    }
  }, [selectedDate])
  return (
    <S.PageWrapper>
      <CustomCalendar
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        modal={modal}
        setModal={setModal}
      />
      {selectedDate && !modal && cardOpen && (
        <EventsCard selectedDate={selectedDate} setCardOpen={setCardOpen} />
      )}
    </S.PageWrapper>
  )
}

export default CalendarPage
