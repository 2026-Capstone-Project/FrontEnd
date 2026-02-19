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
  border-top: 1px solid ${theme.colors.lightGray};
`

export const WeekHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid ${theme.colors.lightGray};
`

export const WeekHeaderCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 72px;
  border-right: 1px solid ${theme.colors.lightGray};

  &:last-of-type {
    border-right: none;
  }
`

export const DayName = styled.div<{ $isSunday?: boolean; $isSaturday?: boolean }>`
  font-size: 14px;
  color: ${({ $isSunday, $isSaturday, theme }) =>
    $isSunday ? theme.colors.red : $isSaturday ? '#4784c1' : theme.colors.textColor3};
`

export const DayNumber = styled.div<{ $isToday?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ $isToday, theme }) => ($isToday ? theme.colors.white : theme.colors.black)};
  background-color: ${({ $isToday, theme }) => ($isToday ? theme.colors.red : 'transparent')};
`

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  min-height: 468px;
`

export const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${theme.colors.lightGray};

  &:last-of-type {
    border-right: none;
  }
`

export const DaySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 8px;
  min-height: 210px;
  border-bottom: 1px solid ${theme.colors.lightGray};

  &:last-of-type {
    min-height: 240px;
    border-bottom: none;
  }
`

export const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textColor3};
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
  border: none;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  outline: ${({ $isSelected, $pointColor }) =>
    $isSelected ? `2px solid ${$pointColor ?? theme.colors.primary2}` : 'none'};
  outline-offset: -1px;
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
