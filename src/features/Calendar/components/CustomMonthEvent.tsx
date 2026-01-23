import moment from 'moment'
import type { EventProps } from 'react-big-calendar'

import { getColorPalette } from '../utils/colorPalette'
import type { CalendarEvent } from './CustomDayView'
import * as S from './styles/CustomEvent.style'

const formatTimeRange = (event: CalendarEvent) => {
  if (event.allDay) {
    return '종일'
  }

  const start = moment(event.start).format('HH:mm')
  return `${start}`
}

const CustomMonthEvent = ({ event }: EventProps<CalendarEvent>) => {
  const palette = getColorPalette(event.palette ?? event.color)
  const baseColor = palette?.base ?? '#ffffff'
  const pointColor = palette?.point ?? '#1f1f1f'

  return (
    <S.MonthEventContainer backgroundColor={baseColor}>
      <S.EventRow>
        <S.Circle backgroundColor={pointColor} />
        <S.EventTitle>{event.title}</S.EventTitle>
      </S.EventRow>
      <S.EventMeta>{formatTimeRange(event)}</S.EventMeta>
    </S.MonthEventContainer>
  )
}

export default CustomMonthEvent
