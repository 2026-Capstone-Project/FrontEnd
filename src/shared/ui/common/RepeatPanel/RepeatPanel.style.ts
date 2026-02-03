import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Label = styled.span`
  font-size: 14px;
  color: ${theme.colors.textColor2};
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
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`
export const MultiSelectGrid = styled.div`
  display: grid;
  gap: 6px;
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
  border-radius: 16px;
  width: 36px;
  height: 36px;
  font-size: 14px;
  min-width: 32px;
  box-shadow: 0 0 1.6px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
`

export const MonthChip = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? '#e9f4f7' : theme.colors.white)};
  color: ${(props) => (props.isActive ? theme.colors.textPrimary : theme.colors.textColor2)};
  border-radius: 16px;
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 12px;
  }
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
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`
export const DayGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 6px;
`
