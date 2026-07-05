import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Wrapper = styled.div`
  position: fixed;
  right: 40px;
  bottom: 100px;
  z-index: 1000;
  ${media.down(theme.breakPoints.desktop)} {
    right: 20px;
    bottom: 20px;
  }
`

export const AIChatButton = styled.button`
  width: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 54px;
  padding: 0;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.16);
  font-weight: bold;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 3px ${({ theme }) => theme.colors.primary2}40,
      2px 4px 20px rgba(0, 0, 0, 0.16);
  }
`

export const ModalPositioner = styled.div`
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: 500px;
  max-width: calc(100vw - 32px);
`
