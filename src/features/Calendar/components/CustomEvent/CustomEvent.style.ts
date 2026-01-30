import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Circle = styled.div<{ backgroundColor?: string }>`
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
`

export const TodoCheckbox = styled.input`
  max-width: 10px;
  max-height: 10px;
  width: 10px;
  height: 10px;
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
export const MonthEventContainer = styled.div<{ backgroundColor?: string }>`
  display: flex;
  flex-direction: row;
  gap: 4px;
  white-space: normal;
  align-items: center;
  justify-content: space-between;
  color: #1f1f1f;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
  padding: 0 5px;
  border-radius: 8px;
  height: 16px;
`

export const WeekEventContainer = styled.div<{ backgroundColor?: string }>`
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
`

export const EventTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EventMeta = styled.div`
  font-size: 8px;
  color: ${({ theme }) => theme.colors.black};
  white-space: nowrap;
  width: fit-content;
`
export const EventWeekMeta = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.black};
`

export const EventLocation = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.black};
`

export const EventRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  max-width: 80%;
`

export const WeekEventRow = styled.div`
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
