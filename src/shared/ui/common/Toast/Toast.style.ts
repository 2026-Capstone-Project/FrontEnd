import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

const toastEnter = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`

export const Viewport = styled.div`
  position: fixed;
  inset: 0;
  z-index: 22000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 32px;
  pointer-events: none;

  ${media.down(theme.breakPoints.mobile)} {
    padding: 16px;
  }
`

export const Card = styled.div<{ $background: string; $accent: string }>`
  width: min(435px, calc(100vw - 32px));
  min-height: 155px;
  padding: 24px 34px 30px;
  border-radius: 20px;
  border-left: 8px solid ${({ $accent }) => $accent};
  background: ${({ $background }) => $background};
  box-shadow:
    0 26px 70px rgba(33, 53, 74, 0.12),
    0 12px 28px rgba(33, 53, 74, 0.08);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(18px);
  pointer-events: auto;
  animation: ${toastEnter} 0.24s ease-out;

  ${media.down(theme.breakPoints.mobile)} {
    min-height: unset;
    padding: 22px 24px 24px;
    border-radius: 20px;
    border-left-width: 6px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
`

export const StatusBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 24px rgba(255, 255, 255, 0.45);

  svg {
    display: block;
  }
`

export const CloseButton = styled.button<{ $color: string }>`
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.45);
  }

  &:active {
    opacity: 0.7;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const Content = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Title = styled.h3<{ $color: string }>`
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
  word-break: keep-all;

  ${media.down(theme.breakPoints.mobile)} {
    font-size: 18px;
  }
`

export const Message = styled.p<{ $color: string }>`
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.02em;
  word-break: keep-all;
  white-space: pre-line;

  ${media.down(theme.breakPoints.mobile)} {
    font-size: 12px;
  }
`
