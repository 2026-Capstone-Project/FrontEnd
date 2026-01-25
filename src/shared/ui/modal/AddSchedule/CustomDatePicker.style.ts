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
`

export const CustomCalendarTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`

export const CustomCalendarClose = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.primary};
  font-size: 12px;
  cursor: pointer;
`

export const CustomCalendarDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`

export const CustomCalendarDay = styled.button<{ isActive?: boolean; isCurrentMonth?: boolean }>`
  border-radius: 8px;
  border: 1px solid ${(props) => (props.isActive ? theme.colors.primary2 : theme.colors.lightGray)};
  background-color: ${(props) =>
    props.isActive
      ? theme.colors.primary
      : props.isCurrentMonth
        ? theme.colors.white
        : theme.colors.lightGray};
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? theme.colors.white : theme.colors.textPrimary)};
`

export const CustomCalendarWeekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`

export const CustomCalendarWeekday = styled.span`
  padding-bottom: 4px;
`

export const CustomCalendarNav = styled.button`
  border: none;
  background: ${theme.colors.sub};
  color: ${theme.colors.primary};
  border-radius: 8px;
  padding: 4px 8px;
  margin-right: 6px;
  cursor: pointer;
  font-size: 12px;
`

export const CustomCalendarDayNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
`
