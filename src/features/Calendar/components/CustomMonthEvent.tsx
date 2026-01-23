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
//TODO: 이벤트 클릭 시 해당 이벤트를 수정할 수 있는 모달 띄우기
//TODO: 이벤트를 길게 늘리거나 줄여서 날짜 변경 기능 추가
//TODO: 반응형 (모바일 뷰)
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
