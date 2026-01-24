import moment from 'moment'
import React from 'react'

import { getColorPalette } from '../../utils/colorPalette'
import type { CalendarEvent } from '../CustomView/CustomDayView'
import * as S from './CustomEvent.style'

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
//TODO: 이벤트 클릭 시 해당 이벤트를 수정할 수 있는 모달 띄우기
const CustomWeekEvent: React.FC<CustomWeekEventProps> = ({ event }) => {
  const palette = getColorPalette(event.color)
  const baseColor = palette?.base
  const pointColor = palette?.point

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
