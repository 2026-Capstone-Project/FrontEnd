import moment from 'moment'
import type { EventProps } from 'react-big-calendar'

import { getColorPalette } from '../../utils/colorPalette'
import type { CalendarEvent } from '../CustomView/CustomDayView'
import * as S from './CustomEvent.style'

const formatTimeRange = (event: CalendarEvent) => {
  if (event.allDay) {
    return '종일'
  }

  const start = moment(event.start).format('HH:mm')
  return `${start}`
}

type CustomMonthEventProps = EventProps<CalendarEvent> & {
  onEventClick: (event: CalendarEvent) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
}

const CustomMonthEvent = ({ event, onEventClick, onToggleTodo }: CustomMonthEventProps) => {
  const palette = getColorPalette(event.color)
  const baseColor = palette?.base
  const pointColor = palette?.point

  return (
    <S.MonthEventContainer backgroundColor={baseColor} onClick={() => onEventClick(event)}>
      <S.EventRow>
        {event.type === 'todo' ? (
          <S.TodoCheckbox
            type="checkbox"
            checked={!!event.isDone}
            onPointerDown={(eventPointer) => eventPointer.stopPropagation()}
            onMouseDown={(eventMouse) => eventMouse.stopPropagation()}
            onClick={(eventClick) => eventClick.stopPropagation()}
            onChange={(eventChange) => {
              eventChange.stopPropagation()
              onToggleTodo?.(event.id)
            }}
          />
        ) : (
          <S.Circle backgroundColor={pointColor} />
        )}
        <S.EventTitle>{event.title}</S.EventTitle>
      </S.EventRow>
      <S.EventMeta>{formatTimeRange(event)}</S.EventMeta>
    </S.MonthEventContainer>
  )
}

export default CustomMonthEvent
