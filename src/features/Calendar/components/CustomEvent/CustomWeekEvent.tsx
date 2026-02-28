import moment from 'moment'
import React, { type MouseEvent, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { getColorPalette } from '../../utils/colorPalette'
import type { CalendarEvent } from '../CustomView/CustomDayView'
import * as S from './CustomEvent.style'

const formatTimeRange = (event: CalendarEvent) => {
  if (event.isAllDay) {
    return '종일'
  }
  const start = moment(event.start).format('HH:mm')
  const end = moment(event.end).format('HH:mm')
  return `${start} ~ ${end}`
}

type CustomWeekEventProps = {
  event: CalendarEvent
  onEventClick: (event: CalendarEvent) => void
  onEventDoubleClick: (event: CalendarEvent) => void
  onToggleTodo?: (eventId: CalendarEvent['id']) => void
  isSelected?: boolean
}
//TODO: 이벤트 클릭 시 해당 이벤트를 수정할 수 있는 모달 띄우기
const CustomWeekEvent: React.FC<CustomWeekEventProps> = ({
  event,
  onEventClick,
  onEventDoubleClick,
  onToggleTodo,
  isSelected,
}) => {
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

  // 제목이 말줄임 처리된 경우에만 툴팁을 띄워 불필요한 노출을 막는다.
  const isTitleOverflowed = () => {
    const titleElement = titleRef.current
    if (!titleElement) {
      return false
    }
    return titleElement.scrollWidth > titleElement.clientWidth
  }

  // 주간 셀 영역에 잘리지 않도록 마우스 기준 좌표로 포털 툴팁 위치를 갱신한다.
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
    <S.WeekEventContainer
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
      <S.WeekEventRow>
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
      </S.WeekEventRow>
      <S.EventWeekMeta>{formatTimeRange(event)}</S.EventWeekMeta>
      {event.location && <S.EventLocation>{event.location}</S.EventLocation>}
      {tooltip.visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <S.MonthEventTooltip style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltipText}
          </S.MonthEventTooltip>,
          document.body,
        )}
    </S.WeekEventContainer>
  )
}

export default CustomWeekEvent
