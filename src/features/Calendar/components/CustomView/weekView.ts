import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const weekViewStyles = css`
  .rbc-time-view {
    border: none !important;
  }
`

export const WeekContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 540px;
`

export const WeekHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`

export const WeekHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
`

export const DayName = styled.div<{ $isSunday?: boolean; $isSaturday?: boolean }>`
  min-height: 52px;
  padding: 0 12px;
  font-size: 14px;
  display: flex;
  width: 30px;
  align-items: center;
  justify-content: flex-start;
  color: ${({ $isSunday, $isSaturday, theme }) =>
    $isSunday ? theme.colors.red : $isSaturday ? '#4784c1' : theme.colors.textColor3};
`

export const DateCell = styled.div<{ $isLast?: boolean; $isSelected?: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: 0 8px;
  border-top: 1px solid ${theme.colors.lightGray};
  border-right: ${({ $isLast }) => ($isLast ? 'none' : `1px solid ${theme.colors.lightGray}`)};
  background-color: ${({ $isSelected }) => ($isSelected ? '#f0f0f0' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export const DayNumber = styled.div<{
  $isToday?: boolean
  $isSunday?: boolean
  $isSaturday?: boolean
}>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ $isToday, $isSunday, $isSaturday, theme }) =>
    $isToday
      ? theme.colors.white
      : $isSunday
        ? theme.colors.red
        : $isSaturday
          ? '#4784c1'
          : theme.colors.black};
  background-color: ${({ $isToday, theme }) => ($isToday ? theme.colors.red : 'transparent')};
`

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  min-height: 420px;
`

export const DayColumn = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ $isSelected }) => ($isSelected ? '#f0f0f0' : 'transparent')};
  border-right: 1px solid ${theme.colors.lightGray};

  &:last-of-type {
    border-right: none;
  }
`

export const AllDaySection = styled.section`
  position: relative;
  padding: 0;
`

export const AllDayLanes = styled.div<{ $laneCount: number }>`
  position: relative;
  z-index: 1;
  margin: 8px 0 0;
  height: ${({ $laneCount }) => Math.max($laneCount, 1) * 30}px;
`

export const AllDayGridLines = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  pointer-events: auto;
`

export const AllDayGridLineCell = styled.div<{ $isSelected?: boolean }>`
  background-color: ${({ $isSelected }) => ($isSelected ? '#f0f0f0' : 'transparent')};
  border-right: 1px solid ${theme.colors.lightGray};

  &:last-of-type {
    border-right: none;
  }
`

export const AllDayEventBar = styled.button<{
  $lane: number
  $startIndex: number
  $span: number
  $backgroundColor?: string
  $pointColor?: string
  $isSelected?: boolean
}>`
  position: absolute;
  top: ${({ $lane }) => $lane * 30}px;
  left: ${({ $startIndex }) => `calc((100% / 7) * ${$startIndex} + 2px)`};
  width: ${({ $span }) => `calc((100% / 7) * ${$span} - 4px)`};
  height: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  background-color: ${({ $backgroundColor }) => $backgroundColor ?? theme.colors.white};
  border: none;
  border-radius: 6px;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  outline: ${({ $isSelected, $pointColor }) =>
    $isSelected ? `2px solid ${$pointColor ?? theme.colors.primary2}` : 'none'};
  outline-offset: -1px;
`

export const AllDayEventTitle = styled.div`
  min-width: 0;
  font-size: 12px;
  color: ${theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DaySection = styled.section<{ $variant: 'allDay' | 'timed' }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${({ $variant }) => ($variant === 'timed' ? '0 2px' : '10px 8px')};
  border-bottom: none;
  min-height: ${({ $variant }) => ($variant === 'allDay' ? 'auto' : '220px')};
  flex: ${({ $variant }) => ($variant === 'allDay' ? '0 0 auto' : '1 1 auto')};
`

export const EventStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const EventCard = styled.button<{
  $backgroundColor?: string
  $pointColor?: string
  $isSelected?: boolean
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background-color: ${({ $backgroundColor }) => $backgroundColor ?? theme.colors.white};
  border: 2px solid
    ${({ $isSelected, $pointColor }) =>
      $isSelected ? ($pointColor ?? theme.colors.primary2) : 'transparent'};
  border-radius: 6px;
  box-sizing: border-box;
  text-align: left;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`

export const EventHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const EventDot = styled.div<{ $color?: string }>`
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color ?? theme.colors.textColor3};
`

export const EventTitle = styled.div`
  width: 100%;
  font-size: 12px;
  color: ${theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EventMeta = styled.div`
  font-size: 10px;
  color: ${theme.colors.textColor3};
`

export const EmptyText = styled.div`
  font-size: 11px;
  color: ${theme.colors.textColor3};
`
