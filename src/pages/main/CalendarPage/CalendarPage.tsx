/** @jsxImportSource @emotion/react */
import { useRef, useState } from 'react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'
import EventsCard from '@/features/Calendar/components/EventsCard/EventsCard'
import { mapSettingsDefaultView } from '@/features/Calendar/hooks/useStoredCalendarView'
import { SettingsAPI } from '@/shared/api/settings/settings'
import { useCustomSuspenseQuery } from '@/shared/hooks/common/customQuery'

import * as S from './CalendarPage.styles'
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const cardAreaRef = useRef<HTMLDivElement | null>(null)
  const { data: settings } = useCustomSuspenseQuery(['settings'], async () => {
    const res = await SettingsAPI.getSettings()
    if (!res.isSuccess) throw new Error('설정 불러오기 실패')
    return res.result
  })
  const initialView = mapSettingsDefaultView(settings.defaultView)

  return (
    <S.PageWrapper>
      <CustomCalendar initialView={initialView} onSelectedDateChange={setSelectedDate} />
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
