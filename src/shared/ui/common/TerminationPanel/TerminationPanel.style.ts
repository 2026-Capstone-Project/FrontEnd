import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
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
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`

export const CalendarWrapper = styled.div`
  position: relative;
`

export const RepeatDetail = styled.div`
  border: 1px solid ${theme.colors.lightGray};
  padding: 10px 20px;
  background: ${theme.colors.inputColor};
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`

export const CalendarPopover = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: min(320px, 100%);
  z-index: 3000;
  ${media.down(theme.breakPoints.tablet)} {
    width: min(90vw, 360px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`
