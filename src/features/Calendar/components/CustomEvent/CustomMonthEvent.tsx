import moment from 'moment'
import { type MouseEvent, useRef, useState } from 'react'
import type { EventProps } from 'react-big-calendar'
import { createPortal } from 'react-dom'

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
  const titleRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  })

  // 제목이 말줄임으로 잘린 경우에만 툴팁을 보여주기 위한 검사다.
  const isTitleOverflowed = () => {
    const titleElement = titleRef.current
    if (!titleElement) {
      return false
    }
    return titleElement.scrollWidth > titleElement.clientWidth
  }

  // 마우스 위치 기준으로 툴팁 좌표를 계산해 셀 경계 밖에서도 읽을 수 있게 한다.
  const updateTooltipPosition = (eventMouse: MouseEvent<HTMLDivElement>) => {
    if (!tooltip.visible) {
      return
    }

    const horizontalOffset = 12
    const verticalOffset = 14

    setTooltip((previous) => ({
      ...previous,
      x: eventMouse.clientX + horizontalOffset,
      y: eventMouse.clientY + verticalOffset,
    }))
  }

  const showTooltip = (eventMouse: MouseEvent<HTMLDivElement>) => {
    if (!isTitleOverflowed()) {
      return
    }

    setTooltip({
      visible: true,
      x: eventMouse.clientX + 12,
      y: eventMouse.clientY + 14,
    })
  }

  const hideTooltip = () => {
    setTooltip((previous) => ({
      ...previous,
      visible: false,
    }))
  }

  const tooltipText = typeof event.title === 'string' ? event.title : ''
  return (
    <S.MonthEventContainer
      backgroundColor={baseColor}
      pointColor={pointColor}
      isSelected={isSelected}
      onClick={(eventMouse) => {
        eventMouse.stopPropagation()
        hideTooltip()
        onEventClick(event)
      }}
      onDoubleClick={(eventMouse) => {
        eventMouse.stopPropagation()
        hideTooltip()
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
        <S.EventTitle
          ref={titleRef}
          onMouseEnter={showTooltip}
          onMouseMove={updateTooltipPosition}
          onMouseLeave={hideTooltip}
        >
          {event.title}
        </S.EventTitle>
      </S.EventRow>
      <S.EventMeta>{formatTimeRange(event)}</S.EventMeta>
      {tooltip.visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <S.MonthEventTooltip style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltipText}
          </S.MonthEventTooltip>,
          document.body,
        )}
    </S.MonthEventContainer>
  )
}

export default CustomMonthEvent
