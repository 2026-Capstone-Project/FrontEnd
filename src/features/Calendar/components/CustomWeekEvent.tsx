import moment from 'moment'
import React from 'react'

import { getColorPalette } from '../utils/colorPalette'
import type { CalendarEvent } from './CustomDayView'
import * as S from './styles/CustomEvent.style'

const formatTimeRange = (event: CalendarEvent) => {
  if (event.allDay) {
    return '종일'
  }
  const start = moment(event.start).format('HH:mm')
  const end = moment(event.end).format('HH:mm')
  return `${start} ~ ${end}`
}

type CustomWeekEventProps = {
  event: CalendarEvent
}

const CustomWeekEvent: React.FC<CustomWeekEventProps> = ({ event }) => {
  const palette = getColorPalette(event.palette ?? event.color)
  const baseColor = palette?.base ?? '#ffffff'
  const pointColor = palette?.point ?? '#1f1f1f'

  return (
    <S.WeekEventContainer backgroundColor={baseColor}>
      <S.EventRow>
        <S.Circle backgroundColor={pointColor} />
        <S.EventTitle>{event.title}</S.EventTitle>
      </S.EventRow>
      <S.EventWeekMeta>{formatTimeRange(event)}</S.EventWeekMeta>
      {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
    </S.WeekEventContainer>
  )
}

export default CustomWeekEvent
