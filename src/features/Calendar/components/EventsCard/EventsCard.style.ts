import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const CardOverlay = styled.div<{ mode: 'inline' | 'modal' }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: fit-content;

  ${media.down(theme.breakPoints.desktop)} {
    position: ${({ mode }) => (mode === 'modal' ? 'fixed' : 'relative')};
    inset: ${({ mode }) => (mode === 'modal' ? '0' : 'auto')};
    background-color: ${({ mode }) => (mode === 'modal' ? 'rgba(0, 0, 0, 0.1)' : 'transparent')};
    z-index: ${({ mode }) => (mode === 'modal' ? 1000 : 'auto')};
    height: ${({ mode }) => (mode === 'modal' ? '100vh' : 'fit-content')};
  }
`

export const CardWrapper = styled.div`
  display: flex;
  ${media.down(theme.breakPoints.desktop)} {
    width: 100%;
  }
`

export const Card = styled.div<{ mode: 'inline' | 'modal' }>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
  height: fit-content;
  background-color: #ffffff;
  ${media.down(theme.breakPoints.desktop)} {
    width: 100%;
  }
`
export const EventCards = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 4px solid ${theme.colors.primary2};
  color: ${theme.colors.textPrimary};
  font-weight: 500;
  font-size: 18px;
  padding: 2px 0 2px 0;
  margin: 24px;
  border-radius: 4px;
  gap: 28px;
`
export const Header = styled.div`
  width: 100%;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding: 20px 32px;
  font-size: 18px;
  display: flex;
  color: ${theme.colors.textPrimary};
  justify-content: space-between;
  font-weight: 500;
  align-items: center;
  background: linear-gradient(0deg, #e9f4f7 0%, #e9f4f7 100%), #deecec;
`

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${theme.colors.red};
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
`
export const EmptyEvent = styled.div`
  font-size: 18px;
  color: ${theme.colors.primary2};
  font-weight: 500;
  margin: 24px;
`
