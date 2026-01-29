import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const CustomCalendarRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const CustomCalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`

export const CustomCalendarTitle = styled.span`
  font-size: 19px;
  font-weight: 600;
  color: ${theme.colors.textColor2};
`

export const CustomCalendarClose = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.primary};
  font-size: 12px;
  cursor: pointer;
`

export const CustomCalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`

export const CustomCalendarWeekday = styled.span<{ dayIndex: number }>`
  padding-bottom: 4px;
  color: ${(props) =>
    props.dayIndex === 0
      ? theme.colors.red
      : props.dayIndex === 6
        ? theme.colors.primary
        : theme.colors.textPrimary};
`

export const CustomCalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`

export const Year = styled.div`
  font-size: 16px;
  font-weight: 500;
  align-self: flex-end;
  color: ${theme.colors.textColor3};
`

export const CustomCalendarDay = styled.button<{
  isActive?: boolean
  isCurrentMonth?: boolean
  isPlaceholder?: boolean
}>`
  border-radius: 18px;
  background-color: ${(props) =>
    props.isPlaceholder ? 'transparent' : props.isActive ? '#E9F4F7' : theme.colors.white};
  padding: 10px 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: ${(props) => (props.isPlaceholder ? 'default' : 'pointer')};
  box-shadow: ${(props) => (props.isPlaceholder ? 'none' : '0 0 1.6px 0 rgba(0, 0, 0, 0.16)')};
  color: ${(props) => (props.isActive ? theme.colors.primary2 : theme.colors.textPrimary)};
`

export const CustomCalendarDayNumber = styled.span<{ isActive?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.isActive ? theme.colors.primary2 : theme.colors.textColor2)};
`
