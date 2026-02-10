import moment from 'moment'
import type { EventProps } from 'react-big-calendar'

import { getColorPalette } from '../../utils/colorPalette'
import type { CalendarEvent } from '../CustomView/CustomDayView'
import * as S from './CustomEvent.style'

const formatTimeRange = (event: CalendarEvent) => {
  if (event.isAllDay) {
    return '종일'
  }

  const start = moment(event.start).format('HH:mm')
  return `${start}`
}

type CustomMonthEventProps = EventProps<CalendarEvent> & {
  onEventClick: (event: CalendarEvent) => void
  onEventDoubleClick: (event: CalendarEvent) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  isSelected?: boolean
}

const CustomMonthEvent = ({
  event,
  onEventClick,
  onEventDoubleClick,
  onToggleTodo,
  isSelected,
}: CustomMonthEventProps) => {
  const palette = getColorPalette(event.color)
  const baseColor = palette?.base
  const pointColor = palette?.point
  const isTodo = 'type' in event && (event as { type?: string }).type === 'todo'
  const isDone = 'isDone' in event && (event as { isDone?: boolean }).isDone
  return (
    <S.MonthEventContainer
      backgroundColor={baseColor}
      pointColor={pointColor}
      isSelected={isSelected}
      onClick={(eventMouse) => {
        eventMouse.stopPropagation()
        onEventClick(event)
      }}
      onDoubleClick={(eventMouse) => {
        eventMouse.stopPropagation()
        onEventDoubleClick(event)
      }}
    >
      <S.EventRow>
        {isTodo ? (
          <S.TodoCheckbox
            type="checkbox"
            checked={!!isDone}
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
