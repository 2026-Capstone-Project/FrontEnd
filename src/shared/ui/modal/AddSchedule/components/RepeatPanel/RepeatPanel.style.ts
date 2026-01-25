import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'
export const Label = styled.span`
  font-size: 12px;
  color: ${theme.colors.textColor3};
`
export const InlineInput = styled.input`
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 8px;
  padding: 6px 10px;
  width: 70px;
  background: ${theme.colors.white};
  font-size: 16px;
  color: ${theme.colors.textColor2};
  text-align: end;
`
export const MultiSelectGrid = styled.div`
  display: grid;
  gap: 4px;
  width: fit-content;
  grid-template-columns: repeat(7, 1fr);
`
export const MultiSelectMonthGrid = styled.div`
  display: grid;
  gap: 4px;
  width: fit-content;
  grid-template-columns: repeat(6, 1fr);
`
export const DayChip = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? '#e9f4f7' : theme.colors.white)};
  color: ${(props) => (props.isActive ? theme.colors.textPrimary : theme.colors.textColor2)};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 14px;
  cursor: pointer;
`

export const MonthChip = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? '#e9f4f7' : theme.colors.white)};
  color: ${(props) => (props.isActive ? theme.colors.textPrimary : theme.colors.textColor2)};
  border-radius: 16px;
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;
`

export const RepeatRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`
export const RepeatButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? '#E9F4F7' : '#F7F7F7')};
  color: ${(props) => (props.isActive ? theme.colors.primary2 : '#757575')};
  border: none;
  border-radius: 8px;
  padding: 2px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const NumberRepeat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
export const DayGrid = styled.div`
  display: flex;
  padding: 0 40px;
  gap: 6px;
`
