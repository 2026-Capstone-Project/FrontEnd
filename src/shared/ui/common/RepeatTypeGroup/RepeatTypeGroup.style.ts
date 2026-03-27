import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const RepeatRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  height: fit-content;
  .icon {
    ${media.down(theme.breakPoints.mobile)} {
      display: none;
    }
  }
  ${media.down(theme.breakPoints.mobile)} {
    align-items: flex-start;
  }
`

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

export const RepeatColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.div`
  display: none;
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
    white-space: nowrap;
    text-align: start;
    margin-top: 6px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    color: ${theme.colors.textColor3};
  }
`
export const RepeatButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? '#E9F4F7' : '#F7F7F7')};
  color: ${(props) => (props.isActive ? theme.colors.primary2 : '#757575')};
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  ${media.down(theme.breakPoints.mobile)} {
    padding: 4px 8px;
  }
`
