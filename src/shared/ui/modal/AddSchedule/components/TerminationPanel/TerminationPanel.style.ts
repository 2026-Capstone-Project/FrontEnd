import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Label = styled.span`
  font-size: 12px;
  color: ${theme.colors.textColor3};
`

export const TerminationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const CalendarWrapper = styled.div`
  position: relative;
`

export const CalendarTrigger = styled.button`
  border-radius: 8px;
  border: 1px solid ${theme.colors.lightGray};
  padding: 6px 12px;
  background: ${theme.colors.white};
  color: ${theme.colors.textColor2};
  font-size: 16px;
  cursor: pointer;
`

export const CalendarPopover = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 300px;
  z-index: 20;
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${theme.colors.textPrimary};
`

export const InlineInput = styled.input`
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 8px;
  padding: 6px 10px;
  width: 100px;
  background: ${theme.colors.white};
  font-size: 16px;
  color: ${theme.colors.textColor2};
  text-align: end;
`

export const RepeatDetail = styled.div`
  border: 1px solid ${theme.colors.lightGray};
  padding: 10px 20px;
  background: ${theme.colors.inputColor};
  display: flex;
  flex-direction: column;
  gap: 12px;
`
