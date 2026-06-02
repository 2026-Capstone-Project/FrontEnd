import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Circle = styled.div<{ backgroundColor?: string }>`
  min-width: 10px;
  min-height: 10px;
  flex: 0 0 auto;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
`

export const TodoCheckbox = styled.input`
  max-width: 10px;
  max-height: 10px;
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  aspect-ratio: 1 / 1;
  appearance: none;
  border: 1px dashed ${({ theme }) => theme.colors.textColor3};
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  position: relative;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.05s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.textColor3};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 124, 255, 0.25);
  }

  &:checked {
    border-color: ${({ theme }) => theme.colors.textColor3};
    background-color: ${({ theme }) => theme.colors.textColor3};
  }

  &:checked::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 3px;
    border: 1px solid ${({ theme }) => theme.colors.white};
    border-top: 0;
    border-right: 0;
    transform: rotate(-45deg);
    left: 1px;
    top: 2px;
  }
`
export const MonthEventContainer = styled.div<{
  backgroundColor?: string
  pointColor?: string
  isSelected?: boolean
}>`
  display: flex;
  flex-direction: row;
  gap: 4px;
  white-space: normal;
  align-items: center;
  justify-content: space-between;
  color: #1f1f1f;
  overflow: hidden;
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
  padding: 0 5px;
  border-radius: 8px;
  height: 16px;
  box-shadow: ${({ isSelected, pointColor }) =>
    isSelected ? `inset 0 0 0 2px ${pointColor ?? 'transparent'}` : 'none'};
`

export const WeekEventContainer = styled.div<{
  backgroundColor?: string
  pointColor: string
  isSelected?: boolean
}>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  max-width: 100%;
  justify-self: center;
  gap: 8px;
  color: #1b1b1b;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'white'};
  padding: 6px 8px;
  border-radius: 4px;
  outline: ${({ isSelected, pointColor }) => (isSelected ? `2px solid ${pointColor}` : 'none')};
  outline-offset: -1px;
  height: 60px;
`

export const EventTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
`

export const EventMeta = styled.div`
  flex: 0 0 auto;
  font-size: 8px;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  min-width: fit-content;
`
export const EventWeekMeta = styled.div`
  flex: 0 0 auto;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
`

export const EventLocation = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.black};
`

export const EventRow = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  max-width: 100%;
`

export const WeekEventRow = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 3px;
`

export const MonthShowMore = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 2px 6px;
  width: 100%;
  height: 10px;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: ${theme.colors.textColor2};
  background-color: ${theme.colors.lightGray};
`

export const MonthEventTooltip = styled.div`
  position: fixed;
  z-index: 10010;
  pointer-events: none;
  padding: 6px 8px;
  border-radius: 6px;
  max-width: 240px;
  font-size: 11px;
  line-height: 1.35;
  color: ${theme.colors.white};
  background-color: rgba(25, 25, 25, 0.92);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  white-space: normal;
  word-break: break-word;
`
