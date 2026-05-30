import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const TimePickerWrapper = styled.div`
  height: 100%;
`

export const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  background: ${theme.colors.inputColor};
  width: fit-content;
`

export const DirectInput = styled.input`
  border: none;
  width: 24px;
  font-size: 16px;
  text-align: center;
  color: ${theme.colors.textColor3};
  background: transparent;
  padding: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.lightGray};
  }
`

export const TimeDivider = styled.span`
  margin: 0 4px;
  color: ${theme.colors.textColor3};
`
